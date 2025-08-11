import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

function redisConnectionFromEnv() {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  const u = new URL(url);
  const conn: any = {
    host: u.hostname,
    port: Number(u.port || 6379),
  };
  if (u.username) conn.username = decodeURIComponent(u.username);
  if (u.password) conn.password = decodeURIComponent(u.password);
  if (u.protocol === 'rediss:') conn.tls = {};
  return conn;
}

@Module({
  imports: [
    BullModule.forRoot({
      connection: redisConnectionFromEnv(),
    }),
    BullModule.registerQueue({ name: 'send-whatsapp' })
  ],
  exports: [BullModule]
})
export class QueueModule {}