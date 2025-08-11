import { IsISO8601, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCampaignDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() messageTemplate: string;
  @IsISO8601() startAt: string; // ISO date string
  @IsInt() @Min(60) intervalSec: number; // enforce >= 60

  // Media opcional (nivel campaña)
  @IsOptional() @IsString() mediaType?: 'image' | 'video' | 'document';
  @IsOptional() @IsString() media?: string; // URL o base64
  @IsOptional() @IsString() mediaCaption?: string;
  @IsOptional() @IsString() mediaFileName?: string;
}