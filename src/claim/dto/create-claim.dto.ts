import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClaimDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  itemId!: number;

  @ApiProperty({ example: 'Dompetnya ada foto keluarga di dalamnya dan kartu pelajar atas nama saya, Budi Santoso kelas XII RPL 1' })
  @IsString()
  @IsNotEmpty()
  proof!: string;
}