# Bot de Discord para descargas de Freepik

Bot de Discord que recibe un enlace de Freepik y descarga el recurso usando una cuenta premium.

> **Nota:** Respeta los términos de servicio de Freepik y utiliza esta automatización solo con recursos a los que tienes derecho de acceso.

## Requisitos
- Node.js 18+
- Cuenta Freepik Premium
- Token de Bot de Discord

## Configuración
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia el archivo de entorno:
   ```bash
   cp .env.example .env
   ```
3. Completa las variables en `.env`:
   ```env
   DISCORD_TOKEN=tu_token
   FREEPIK_EMAIL=tu_email
   FREEPIK_PASSWORD=tu_password
   ```

## Uso
Inicia el bot:
```bash
npm start
```

En Discord, escribe en un canal donde el bot tenga permisos:
```
!freepik https://www.freepik.com/tu-recurso
```

El bot descargará el recurso y, si el tamaño lo permite, lo adjuntará como archivo en el canal.

## Notas
- El bot limita el tamaño máximo de subida a 8 MB (límite típico de Discord sin boosts).
- Los archivos se descargan temporalmente en la carpeta `downloads/`.
