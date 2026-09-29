import {
    Body,
    Controller,
    Post,
    Req,
} from '@nestjs/common';

import { FilesService } from './files.service.js';
import { PresignUploadDto } from './dto/presign-upload.dto.js';
import { CompleteUploadDto } from './dto/complete-upload.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { UseGuards } from '@nestjs/common';

@Controller('files')
@UseGuards(AuthGuard)
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
    ) { }

    @Post('presign')
    async presign(
        @Req() request: any,
        @Body() dto: PresignUploadDto,
    ) {
        return this.filesService.presign(
            request.user.id,
            dto,
        );
    }
    @Post('complete')
    async complete(
        @Req() request: any,
        @Body() dto: CompleteUploadDto,
    ) {
        return this.filesService.complete(
            request.user.id,
            dto,
        );
    }
}