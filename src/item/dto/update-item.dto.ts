import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ItemStatus } from '@prisma/client';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @IsEnum(ItemStatus)
  @IsOptional()
  status?: ItemStatus;
}