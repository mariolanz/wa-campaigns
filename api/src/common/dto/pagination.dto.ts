import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional() @IsInt() @Min(0) skip?: number = 0;
  @IsOptional() @IsInt() @Min(1) take?: number = 50;
}