import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvolutionModule } from './evolution/evolution.module';
import { ContactsModule } from './contacts/contacts.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EvolutionModule,
    ContactsModule,
    CampaignsModule,
    QueueModule,
  ],
})
export class AppModule {}