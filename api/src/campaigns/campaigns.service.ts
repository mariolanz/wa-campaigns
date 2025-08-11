import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService, @InjectQueue('send-whatsapp') private queue: Queue) {}

  async create(dto: CreateCampaignDto) {
    if (dto.intervalSec < 60) throw new BadRequestException('intervalSec debe ser >= 60');
    const start = new Date(dto.startAt);
    if (isNaN(start.getTime())) throw new BadRequestException('startAt inválido');

    const campaign = await this.prisma.campaign.create({ data: {
      userId: 1,
      name: dto.name,
      message_template: dto.messageTemplate,
      start_at: start,
      interval_sec: dto.intervalSec,
      status: 'scheduled',
      media_type: dto.mediaType,
      media_url: dto.media,
      media_caption: dto.mediaCaption,
      media_filename: dto.mediaFileName,
    }});

    const contacts = await this.prisma.contact.findMany({ where: { userId: 1 } });
    const jobs: Promise<any>[] = [];
    for (let i = 0; i < contacts.length; i++) {
      const scheduledAt = new Date(start.getTime() + i * dto.intervalSec * 1000);
      const cr = await this.prisma.campaignRecipient.create({ data: {
        campaignId: campaign.id,
        contactId: contacts[i].id,
        variables: contacts[i].meta,
        scheduled_at: scheduledAt,
        status: 'scheduled'
      }});
      const delay = Math.max(0, scheduledAt.getTime() - Date.now());
      jobs.push(this.queue.add('send', { campaignRecipientId: cr.id }, { delay, attempts: 5, backoff: { type: 'exponential', delay: 120000 } }));
    }
    await Promise.all(jobs);
    return campaign;
  }

  async get(id: number) {
    return this.prisma.campaign.findUnique({ where: { id }, include: { recipients: true } });
  }
}