import { Injectable } from '@nestjs/common';
import axios from 'axios';

type MediaType = 'image' | 'video' | 'document';

@Injectable()
export class EvolutionClientService {
  private base = (process.env.EVOLUTION_BASE_URL || '').replace(/\/$/, '');
  private apiKey = process.env.EVOLUTION_API_KEY || '';

  private headers() {
    return { 'Content-Type': 'application/json', apikey: this.apiKey };
  }

  async sendText(instance: string, to: string, text: string) {
    const url = `${this.base}/message/sendText/${instance}`;
    const { data } = await axios.post(url, { number: to, text }, { headers: this.headers() });
    return data;
  }

  async sendMedia(instance: string, to: string, mediaType: MediaType, media: string, opts?: { caption?: string; fileName?: string }) {
    const url = `${this.base}/message/sendMedia/${instance}`;
    const { data } = await axios.post(url, {
      number: to,
      options: { presence: 'composing' },
      mediaMessage: { mediaType, media, caption: opts?.caption, fileName: opts?.fileName }
    }, { headers: this.headers() });
    return data;
  }
}