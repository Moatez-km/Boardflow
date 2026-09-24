var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { CardsService } from './cards.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';
import { ReorderCardDto } from './dto/reorder-card.dto.js';
import { UseGuards } from '@nestjs/common';
import { Body, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
let CardsController = class CardsController {
    cardsService;
    constructor(cardsService) {
        this.cardsService = cardsService;
    }
    findAll(request, boardId) {
        return this.cardsService.findAll(request.user.id, boardId);
    }
    create(request, boardId, dto) {
        return this.cardsService.create(request.user.id, boardId, dto);
    }
    update(request, cardId, dto) {
        return this.cardsService.update(request.user.id, cardId, dto);
    }
    remove(request, cardId) {
        return this.cardsService.remove(request.user.id, cardId);
    }
    reorder(request, cardId, dto) {
        return this.cardsService.reorder(request.user.id, cardId, dto);
    }
};
__decorate([
    Get('boards/:boardId/cards'),
    __param(0, Req()),
    __param(1, Param('boardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "findAll", null);
__decorate([
    Post('boards/:boardId/cards'),
    __param(0, Req()),
    __param(1, Param('boardId')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateCardDto]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "create", null);
__decorate([
    Patch('cards/:cardId'),
    __param(0, Req()),
    __param(1, Param('cardId')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateCardDto]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "update", null);
__decorate([
    Delete('cards/:cardId'),
    __param(0, Req()),
    __param(1, Param('cardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "remove", null);
__decorate([
    Post('cards/:cardId/reorder'),
    __param(0, Req()),
    __param(1, Param('cardId')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ReorderCardDto]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "reorder", null);
CardsController = __decorate([
    Controller(),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [CardsService])
], CardsController);
export { CardsController };
//# sourceMappingURL=cards.controller.js.map