import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ItemStatus, ItemType } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ResponseMessage('Laporan barang berhasil dibuat')
  create(
    @GetUser('userId') userId: number,
    @Body() dto: CreateItemDto,
  ) {
    return this.itemService.create(userId, dto);
  }

  @Get()
  @ResponseMessage('Daftar barang berhasil diambil')
  findAll(
    @Query('type') type?: ItemType,
    @Query('status') status?: ItemStatus,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.itemService.findAll({
      type,
      status,
      categoryId: categoryId ? +categoryId : undefined,
      search,
    });
  }

  @Get(':id/matches')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ResponseMessage('Rekomendasi kecocokan berhasil diambil')
  getSmartMatches(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
  ) {
    return this.itemService.getSmartMatches(id, userId);
  }

  @Get(':id')
  @ResponseMessage('Detail barang berhasil diambil')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ResponseMessage('Barang berhasil diperbarui')
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
    @GetUser('role') role: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.itemService.update(id, userId, role, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ResponseMessage('Barang berhasil dihapus')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
    @GetUser('role') role: string,
  ) {
    return this.itemService.remove(id, userId, role);
  }
}