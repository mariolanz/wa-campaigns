import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' }
    }),
    BullModule.registerQueue({ name: 'send-whatsapp' })
  ],
  exports: [BullModule]
})
export class QueueModule {}