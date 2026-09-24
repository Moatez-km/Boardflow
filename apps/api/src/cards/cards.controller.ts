import { Controller } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';

import { CardsService } from './cards.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';
import { ReorderCardDto } from './dto/reorder-card.dto.js';
import { UseGuards } from '@nestjs/common';
import { Body, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';

@Controller()
@UseGuards(AuthGuard)
export class CardsController {
    constructor(private readonly cardsService: CardsService) { }

    @Get('boards/:boardId/cards')
    findAll(
        @Req() request: any,
        @Param('boardId') boardId: string,
    ) {
        return this.cardsService.findAll(request.user.id, boardId);
    }

    @Post('boards/:boardId/cards')
    create(
        @Req() request: any,
        @Param('boardId') boardId: string,
        @Body() dto: CreateCardDto,
    ) {
        return this.cardsService.create(request.user.id, boardId, dto);
    }

    @Patch('cards/:cardId')
    update(
        @Req() request: any,
        @Param('cardId') cardId: string,
        @Body() dto: UpdateCardDto,
    ) {
        return this.cardsService.update(request.user.id, cardId, dto);
    }

    @Delete('cards/:cardId')
    remove(
        @Req() request: any,
        @Param('cardId') cardId: string,
    ) {
        return this.cardsService.remove(request.user.id, cardId);
    }

    @Post('cards/:cardId/reorder')
    reorder(
        @Req() request: any,
        @Param('cardId') cardId: string,
        @Body() dto: ReorderCardDto,
    ) {
        return this.cardsService.reorder(request.user.id, cardId, dto);
    }
}

