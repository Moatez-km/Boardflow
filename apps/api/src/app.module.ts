import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BoardsModule } from './boards/boards.module.js';
import { CardsModule } from './cards/cards.module.js';

@Module({
  imports: [PrismaModule, AuthModule, BoardsModule, CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
