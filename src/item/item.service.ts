import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemStatus, ItemType } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateItemDto) {
    return this.prisma.item.create({
      data: {
        ...dto,
        date: new Date(dto.date),
        userId,
      },
      include: {
        category: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findAll(query: { type?: ItemType; status?: ItemStatus; categoryId?: number; search?: string }) {
    const { type, status, categoryId, search } = query;
    return this.prisma.item.findMany({
      where: {
        ...(type && { type }),
        ...(status && { status }),
        ...(categoryId && { categoryId }),
        ...(search && {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
            { location: { contains: search } },
          ],
        }),
      },
      include: {
        category: true,
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
        user: { select: { id: true, name: true, email: true } },
        //school: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Barang dengan ID ${id} tidak ditemukan`);
    }
    return item;
  }

  async update(id: number, userId: number, role: string, dto: UpdateItemDto) {
    const item = await this.findOne(id);
    if (item.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Kamu tidak memiliki akses untuk merubah item ini');
    }

    return this.prisma.item.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.date && { date: new Date(dto.date) }),
      },
    });
  }

  async remove(id: number, userId: number, role: string) {
    const item = await this.findOne(id);
    if (item.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Kamu tidak memiliki akses untuk menghapus item ini');
    }

    await this.prisma.item.delete({ where: { id } });
    return { message: 'Item berhasil dihapus' };
  }
  async getSmartMatches(id: number, userId: number) {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Barang dengan ID ${id} tidak ditemukan`);
    }

    // Hanya pemilik laporan yang bisa mengecek rekomendasi sistem
    if (item.userId !== userId) {
      throw new ForbiddenException('Hanya pemilik laporan yang bisa melihat rekomendasi kecocokan');
    }

    // Tentukan target: Jika HILANG (LOST), cari yang DITEMUKAN (FOUND), dan sebaliknya
    const targetType = item.type === 'LOST' ? 'FOUND' : 'LOST';

    // Cari barang yang berpotensi cocok
    return this.prisma.item.findMany({
      where: {
        type: targetType,
        categoryId: item.categoryId, // Kunci utamanya: berada di kategori yang sama
        status: 'PENDING', // Hanya rekomendasikan barang yang masih tersedia
      },
      include: {
        category: true,
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' }, // Tampilkan yang paling baru dilaporkan
      take: 5, // Batasi 5 rekomendasi teratas agar rapi
    });
  }
}