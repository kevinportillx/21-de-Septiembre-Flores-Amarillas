require('dotenv').config();
const fs = require('fs/promises');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const { downloadFromFreepik } = require('./downloadFreepik');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const FREEPIK_EMAIL = process.env.FREEPIK_EMAIL;
const FREEPIK_PASSWORD = process.env.FREEPIK_PASSWORD;
const MAX_FILE_SIZE_MB = 8;

if (!DISCORD_TOKEN || !FREEPIK_EMAIL || !FREEPIK_PASSWORD) {
  console.error('Faltan variables de entorno. Revisa tu archivo .env');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

function isValidFreepikUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith('freepik.com');
  } catch (error) {
    return false;
  }
}

client.on('ready', () => {
  console.log(`Conectado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!freepik ')) return;

  const url = message.content.replace('!freepik', '').trim();
  if (!isValidFreepikUrl(url)) {
    await message.reply('Por favor, envía un enlace válido de Freepik.');
    return;
  }

  const statusMessage = await message.reply('Iniciando descarga desde Freepik...');

  try {
    const { filename, filepath } = await downloadFromFreepik(url, {
      email: FREEPIK_EMAIL,
      password: FREEPIK_PASSWORD
    });

    const stats = await fs.stat(filepath);
    const sizeMb = stats.size / (1024 * 1024);

    if (sizeMb > MAX_FILE_SIZE_MB) {
      await statusMessage.edit(
        `El archivo pesa ${sizeMb.toFixed(2)} MB y supera el límite de ${MAX_FILE_SIZE_MB} MB de Discord.`
      );
      await fs.unlink(filepath);
      return;
    }

    await statusMessage.edit({
      content: 'Descarga completada. Subiendo archivo...'
    });

    await message.channel.send({
      files: [{ attachment: filepath, name: filename }]
    });

    await statusMessage.delete();
    await fs.unlink(filepath);
  } catch (error) {
    console.error(error);
    await statusMessage.edit('No se pudo completar la descarga. Revisa el enlace o la cuenta premium.');
  }
});

client.login(DISCORD_TOKEN);
