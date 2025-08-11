import { Module } from '@nestjs/common';
import { EvolutionService } from './evolution.service';
import { EvolutionController } from './evolution.controller';
import { PrismaService } from '../common/prisma.service';

@Module({ providers: [EvolutionService, PrismaService], controllers: [EvolutionController], exports: [EvolutionService] })
export class EvolutionModule {}