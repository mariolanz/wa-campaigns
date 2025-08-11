Option B (Debian / glibc) Dockerfiles for Prisma:
- Replace your existing Dockerfiles with these.
- Rebuild without cache in EasyPanel.
- After API is up, run once: npm run prisma:migrate
- Then rebuild Worker without cache.

Targets:
- /api/Dockerfile (exposes 3001)
- /worker/Dockerfile
