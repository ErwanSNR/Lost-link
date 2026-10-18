import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ItemModule } from './item/item.module';
import { ClaimModule } from './claim/claim.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClaimModule,
    CategoryModule,
    ItemModule,
     DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}