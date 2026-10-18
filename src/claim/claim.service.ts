import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimStatusDto } from './dto/update-claim-status.dto';

@Injectable()
export class ClaimService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateClaimDto) {
    const item = await this.prisma.item.findUnique({ where: { id: dto.itemId } });
    if (!item) throw new NotFoundException('Barang tidak ditemukan');
    
    if (item.userId === userId) {
      throw new BadRequestException('Kamu tidak bisa mengklaim laporanmu sendiri');
    }

    const existingClaim = await this.prisma.claim.findFirst({
      where: { userId, itemId: dto.itemId },
    });
    if (existingClaim) {
      throw new BadRequestException('Kamu sudah mengajukan klaim untuk barang ini');
    }

    return this.prisma.claim.create({
      data: {
        userId,
        itemId: dto.itemId,
        proof: dto.proof,
      },
    });
  }

  // Melihat klaim yang masuk ke barang-barang milik user yang sedang login
  async getIncomingClaims(userId: number) {
    return this.prisma.claim.findMany({
      where: {
        item: {
          userId: userId,
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        item: { select: { id: true, title: true, status: true } },
      },
    });
  }

  // Melihat klaim yang diajukan oleh user yang sedang login
  async getMyClaims(userId: number) {
    return this.prisma.claim.findMany({
      where: { userId },
      include: {
        item: { select: { id: true, title: true, status: true } },
      },
    });
  }

    async updateStatus(claimId: number, userId: number, role: string, dto: UpdateClaimStatusDto) {
    const claim = await this.prisma.claim.findUnique({
      where: { id: claimId },
      include: { item: true },
    });

    if (!claim) throw new NotFoundException('Klaim tidak ditemukan');

    // Yang berhak memproses klaim: pembuat laporan barang ATAU admin
    const isReporter = claim.item.userId === userId;
    const isAdmin = role === 'ADMIN';
    if (!isReporter && !isAdmin) {
      throw new ForbiddenException('Hanya pembuat laporan atau admin yang dapat memproses klaim ini');
    }

    const updatedClaim = await this.prisma.claim.update({
      where: { id: claimId },
      data: { status: dto.status },
    });

    // Jika klaim disetujui, ubah status barang menjadi MATCHED
    if (dto.status === 'APPROVED') {
      await this.prisma.item.update({
        where: { id: claim.itemId },
        data: { status: 'MATCHED' },
      });
      
      // Opsional: Otomatis REJECT klaim lain untuk barang yang sama
      await this.prisma.claim.updateMany({
        where: { itemId: claim.itemId, id: { not: claimId }, status: 'PENDING' },
        data: { status: 'REJECTED' },
      });
    }

    return updatedClaim;
  }
}