const path = require('path');
const fs = require('fs/promises');
const { chromium } = require('playwright');

const DOWNLOAD_DIR = path.resolve(__dirname, '..', 'downloads');

async function ensureDownloadDir() {
  await fs.mkdir(DOWNLOAD_DIR, { recursive: true });
}

async function loginFreepik(page, email, password) {
  await page.goto('https://www.freepik.com/login', { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('button[type="submit"]')
  ]);
}

async function downloadFromFreepik(url, { email, password }) {
  await ensureDownloadDir();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  await loginFreepik(page, email, password);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
  await page.click('[data-cy="download-button"], .download, .download__button');
  const download = await downloadPromise;

  const suggested = download.suggestedFilename();
  const targetPath = path.join(DOWNLOAD_DIR, suggested);
  await download.saveAs(targetPath);

  await context.close();
  await browser.close();

  return {
    filename: suggested,
    filepath: targetPath
  };
}

module.exports = {
  downloadFromFreepik
};
