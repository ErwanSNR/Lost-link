import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ItemType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'Dompet kulit coklat' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Dompet kulit warna coklat berisi KTP dan kartu pelajar, tertinggal di kantin' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 'Kantin sekolah, dekat kasir' })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({ example: '2026-10-18T09:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiPropertyOptional({ example: 'https://example.com/foto-dompet.jpg' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 'LOST', enum: ItemType })
  @IsEnum(ItemType)
  @IsNotEmpty()
  type!: ItemType;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  categoryId!: number;
}