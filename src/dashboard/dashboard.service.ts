import { Injectable } from '@nestjs/common';
import { ClaimStatus, ItemStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async stats() {
    const [totalUsers, totalItems, totalLost, totalFound, totalCategories, totalClaims] =
      await Promise.all([
        this.prisma.user.count({ where: { role: 'USER' } }),
        this.prisma.item.count(),
        this.prisma.item.count({ where: { type: 'LOST' } }),
        this.prisma.item.count({ where: { type: 'FOUND' } }),
        this.prisma.category.count(),
        this.prisma.claim.count(),
      ]);

    const itemStatusGroups = await this.prisma.item.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    const itemsByStatus: Record<ItemStatus, number> = {
      PENDING: 0,
      VERIFIED: 0,
      MATCHED: 0,
      RETURNED: 0,
    };
    for (const g of itemStatusGroups) {
      itemsByStatus[g.status] = g._count._all;
    }

    const claimStatusGroups = await this.prisma.claim.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    const claimsByStatus: Record<ClaimStatus, number> = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
    };
    for (const g of claimStatusGroups) {
      claimsByStatus[g.status] = g._count._all;
    }

    return {
      totalUsers,
      totalItems,
      totalLost,
      totalFound,
      totalCategories,
      totalClaims,
      itemsByStatus,
      claimsByStatus,
    };
  }
}