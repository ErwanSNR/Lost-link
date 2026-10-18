import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ItemStatus } from '@prisma/client';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiPropertyOptional({ example: 'VERIFIED', enum: ItemStatus })
  @IsEnum(ItemStatus)
  @IsOptional()
  status?: ItemStatus;
}