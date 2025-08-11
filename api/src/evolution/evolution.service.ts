import { Injectable } from '@nestjs/common';
import axios from 'axios';

type MediaType = 'image' | 'video' | 'document';

@Injectable()
export class EvolutionService {
  private base = (process.env.EVOLUTION_BASE_URL || '').replace(/\/$/, '');
  private apiKey = process.env.EVOLUTION_API_KEY || '';

  private headers() {
    return { 'Content-Type': 'application/json', apikey: this.apiKey };
  }

  // Crea instancia y devuelve QR + nombre
  async createInstance(instanceName: string) {
    const url = `${this.base}/instance/create`;
    const { data } = await axios.post(url, {
      instanceName,
      token: instanceName,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
    }, { headers: this.headers() });
    const qr = data?.qrcode || data?.base64 || data?.qr;
    return { instance: data?.instance?.name || instanceName, qr };
  }

  async sendText(instance: string, numberE164: string, text: string) {
    const url = `${this.base}/message/sendText/${instance}`;
    const { data } = await axios.post(url, { number: numberE164, text }, { headers: this.headers() });
    return data;
  }

  async sendMedia(instance: string, numberE164: string, mediaType: MediaType, media: string, opts?: { caption?: string; fileName?: string }) {
    const url = `${this.base}/message/sendMedia/${instance}`;
    const { data } = await axios.post(url, {
      number: numberE164,
      options: { presence: 'composing' },
      mediaMessage: {
        mediaType,
        media,
        caption: opts?.caption,
        fileName: opts?.fileName || (mediaType === 'document' ? 'document.pdf' : undefined),
      },
    }, { headers: this.headers() });
    return data;
  }
}