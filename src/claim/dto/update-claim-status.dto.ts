//import { PartialType } from '@nestjs/swagger';
//import { CreateClaimDto } from './create-claim.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ClaimStatus } from '@prisma/client';

//export class UpdateClaimDto extends PartialType(CreateClaimDto) {
export class UpdateClaimStatusDto {
  @IsEnum(ClaimStatus)
  @IsNotEmpty()
  status: ClaimStatus;
}
