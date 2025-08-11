import { Body, Controller, Post } from '@nestjs/common';
import { EvolutionService } from './evolution.service';

@Controller('evolution')
export class EvolutionController {
  constructor(private evo: EvolutionService) {}

  @Post('session/start')
  async start(@Body() body: { instanceName?: string }) {
    const name = body?.instanceName || 'octocom';
    return this.evo.createInstance(name);
  }
}