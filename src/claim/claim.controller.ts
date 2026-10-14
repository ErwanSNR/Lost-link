import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimStatusDto } from './dto/update-claim-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('claims')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('claims')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  create(@GetUser('userId') userId: number, @Body() dto: CreateClaimDto) {
    return this.claimService.create(userId, dto);
  }

  @Get('incoming')
  getIncomingClaims(@GetUser('userId') userId: number) {
    return this.claimService.getIncomingClaims(userId);
  }

  @Get('my-claims')
  getMyClaims(@GetUser('userId') userId: number) {
    return this.claimService.getMyClaims(userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
    @Body() dto: UpdateClaimStatusDto,
  ) {
    return this.claimService.updateStatus(id, userId, dto);
  }
}