import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private svc: CampaignsService) {}

  @Post()
  create(@Body() dto: CreateCampaignDto) { return this.svc.create(dto); }

  @Get(':id')
  get(@Param('id') id: string) { return this.svc.get(+id); }
}