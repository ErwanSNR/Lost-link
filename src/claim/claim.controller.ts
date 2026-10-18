import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimStatusDto } from './dto/update-claim-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('claims')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('claims')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  @ResponseMessage('Klaim berhasil diajukan')
  create(@GetUser('userId') userId: number, @Body() dto: CreateClaimDto) {
    return this.claimService.create(userId, dto);
  }

  @Get('incoming')
  @ResponseMessage('Klaim masuk berhasil diambil')
  getIncomingClaims(@GetUser('userId') userId: number) {
    return this.claimService.getIncomingClaims(userId);
  }

  @Get('my-claims')
  @ResponseMessage('Riwayat klaim kamu berhasil diambil')
  getMyClaims(@GetUser('userId') userId: number) {
    return this.claimService.getMyClaims(userId);
  }

  @Patch(':id/status')
  @ResponseMessage('Status klaim berhasil diperbarui')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
    @GetUser('role') role: string,
    @Body() dto: UpdateClaimStatusDto,
  ) {
    return this.claimService.updateStatus(id, userId, role, dto);
  }
}