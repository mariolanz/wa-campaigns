# WA Campaigns (NestJS + Next.js + BullMQ) — Updated
- Soporta mensaje único + media (imagen/video/documento) para todos los contactos.
- Evolution API v2 con header `apikey` y endpoints `sendText/sendMedia` por instancia.

## Variables de entorno
En `api/` y `worker/`:
```
EVOLUTION_BASE_URL=https://operacion-evolution-api.nxfws2.easypanel.host
EVOLUTION_API_KEY=TU_API_KEY
DATABASE_URL=...
REDIS_URL=...
```
En `frontend/`:
```
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
```

## Migraciones Prisma
En la app **api** tras el primer deploy:
```
npm run prisma:migrate
```

## Flujo
1) Crear/abrir instancia (QR) en `/evolution/session/start` (por defecto `octocom`).
2) Subir CSV de contactos.
3) Crear campaña con mensaje + (opcional) media URL/base64.
4) El worker envía respetando intervalo ≥ 60s.

> Ajusta dominios y variables en EasyPanel según tu entorno.