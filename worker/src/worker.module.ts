import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SendWhatsappProcessor } from './processors/send-whatsapp.processor';
import { EvolutionClientService } from './services/evolution-client.service';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [
    BullModule.forRoot({ connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } }),
    BullModule.registerQueue({ name: 'send-whatsapp' })
  ],
  providers: [SendWhatsappProcessor, EvolutionClientService, PrismaService],
})
export class WorkerModule {}