import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { PrismaService } from '../common/prisma.service';
import { EvolutionService } from '../evolution/evolution.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [CampaignsController],
  providers: [CampaignsService, PrismaService, EvolutionService],
})
export class CampaignsModule {}