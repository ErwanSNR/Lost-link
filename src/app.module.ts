import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module'; // <-- Pastikan ini ada

import { CategoryModule } from './category/category.module';
import { ItemModule } from './item/item.module';
import { ClaimModule } from './claim/claim.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule, // <-- Dan pastikan ini juga masuk ke array imports
    ClaimModule,
    CategoryModule,
    ItemModule,
    ClaimModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}