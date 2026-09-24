import {
    Controller,
    Post,
    Body,
    Param,
    UseGuards,
    Req,
    Get,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';

import { SectionsService } from './sections.service.js';
import { CreateSectionDto } from './dto/create-section.dto.js';
@Controller()
@UseGuards(AuthGuard)
export class SectionsController {
    constructor(
        private readonly sectionsService: SectionsService,
    ) { }

    @Post('boards/:boardId/sections')
    create(
        @Req() request: any,
        @Param('boardId') boardId: string,
        @Body() dto: CreateSectionDto,
    ) {
        return this.sectionsService.create(
            request.user.id,
            boardId,
            dto,
        );
    }

    @Get('boards/:boardId/sections')
    findAll(
        @Req() request: any,
        @Param('boardId') boardId: string,
    ) {
        return this.sectionsService.findAll(
            request.user.id,
            boardId,
        );
    }
}
