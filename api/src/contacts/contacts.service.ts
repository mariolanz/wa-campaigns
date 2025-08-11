import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { parse } from 'csv-parse/sync';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import type { Express } from 'express';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async uploadCsv(file?: Express.Multer.File) {
    if (!file?.buffer) throw new BadRequestException('CSV requerido');
    const rows = parse(file.buffer.toString('utf8'), { columns: true, skip_empty_lines: true });

    let total = 0, valid = 0, invalid = 0; const seen = new Set<string>();
    const contacts: { phone_e164: string; meta: any }[] = [];

    for (const r of rows) {
      total++;
      const raw = (r.phone || r.telefono || '').toString().trim();
      const pn = parsePhoneNumberFromString(raw, 'UY') || parsePhoneNumberFromString(raw);
      const e164 = pn?.isValid() ? pn.number : null;
      if (!e164) { invalid++; continue; }
      if (seen.has(e164)) { continue; }
      seen.add(e164);
      valid++;
      contacts.push({ phone_e164: e164, meta: { nombre: r.nombre || r.name || null } });
    }

    await this.prisma.contact.createMany({
      data: contacts.map(c => ({ userId: 1, phone_e164: c.phone_e164, meta: c.meta })),
      skipDuplicates: true
    });

    const duplicates = total - valid - invalid;
    return { total, valid, invalid, duplicates };
  }
}