import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ItemType } from '@prisma/client';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(ItemType)
  @IsNotEmpty()
  type: ItemType;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}