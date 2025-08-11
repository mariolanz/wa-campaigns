# WA Campaigns (fixed)
- Mensaje + media (imagen/video/documento) para todos.
- Evolution API v2 (`apikey`, `sendText`, `sendMedia`).
- Dockerfiles corregidos (npm install + node_modules en runner).
- API con @nestjs/bullmq y tipos de Express/Multer.
- Worker con `prisma generate` y schema propio.

## Deploy (EasyPanel)
1) Crea servicios de **Postgres** y **Redis** y coloca las ENV en API/Worker.
2) API → Deploy → luego ejecutar una vez: `npm run prisma:migrate`.
3) Worker → Deploy.
4) Frontend → Deploy (set `NEXT_PUBLIC_API_URL`).