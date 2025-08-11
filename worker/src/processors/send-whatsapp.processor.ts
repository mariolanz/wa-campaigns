import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../services/prisma.service';
import { EvolutionClientService } from '../services/evolution-client.service';

@Processor('send-whatsapp')
export class SendWhatsappProcessor extends WorkerHost {
  constructor(private prisma: PrismaService, private evo: EvolutionClientService) { super(); }

  async process(job: Job<{ campaignRecipientId: number }>) {
    const { campaignRecipientId } = job.data;
    const cr = await this.prisma.campaignRecipient.findUnique({
      where: { id: campaignRecipientId },
      include: { campaign: true, contact: true }
    });
    if (!cr) return;

    // Respetar el horario programado (safety)
    if (cr.scheduled_at.getTime() > Date.now()) {
      const delay = cr.scheduled_at.getTime() - Date.now();
      await job.updateData(job.data);
      await job.moveToDelayed(Date.now() + delay);
      return;
    }

    const tpl = cr.campaign.message_template;
    const vars = (cr.variables || {}) as Record<string, string>;
    const text = tpl.replace(/\{\{(.*?)\}\}/g, (_, k) => (vars[k.trim()] ?? ''));

    // Recupera instancia conectada del usuario (sessionId = instanceName)
    const session = await this.prisma.evolutionSession.findFirst({
      where: { userId: cr.campaign.userId, status: 'connected' },
    });
    if (!session) throw new Error('No instance connected for user');

    let res: any;
    if (cr.campaign.media_type && cr.campaign.media_url) {
      res = await this.evo.sendMedia(
        session.sessionId,
        cr.contact.phone_e164,
        cr.campaign.media_type as any,
        cr.campaign.media_url,
        { caption: cr.campaign.media_caption || text, fileName: cr.campaign.media_filename }
      );
    } else {
      res = await this.evo.sendText(session.sessionId, cr.contact.phone_e164, text);
    }

    await this.prisma.messageLog.create({ data: {
      campaignRecipientId: cr.id, wa_message_id: res?.messageId, status: 'sent', raw_response: res
    }});
    await this.prisma.campaignRecipient.update({ where: { id: cr.id }, data: { status: 'sent' } });
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error('Job failed', job.id, err.message);
  }
}