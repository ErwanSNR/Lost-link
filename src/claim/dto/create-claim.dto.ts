import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateClaimDto {
  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @IsString()
  @IsNotEmpty()
  proof: string;
}