import { IsEnum, IsNotEmpty } from 'class-validator';
import { ClaimStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClaimStatusDto {
  @ApiProperty({ example: 'APPROVED', enum: ClaimStatus })
  @IsEnum(ClaimStatus)
  @IsNotEmpty()
  status!: ClaimStatus;
}