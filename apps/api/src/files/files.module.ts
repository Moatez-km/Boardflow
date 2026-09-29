import { Module } from '@nestjs/common';

import { FilesController } from './files.controller.js';
import { FilesService } from './files.service.js';
import { StorageService } from './storage.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,

  ],
  controllers: [
    FilesController,
  ],

  providers: [
    FilesService,
    StorageService,

  ],

  exports: [
    FilesService,
  ],
})
export class FilesModule { }