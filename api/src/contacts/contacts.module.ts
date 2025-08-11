import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { PrismaService } from '../common/prisma.service';

@Module({ controllers: [ContactsController], providers: [ContactsService, PrismaService] })
export class ContactsModule {}