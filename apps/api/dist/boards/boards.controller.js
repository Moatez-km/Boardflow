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
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, } from '@nestjs/common';
import { BoardsService } from './boards.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { UpdateBoardDto } from './dto/update-board.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
let BoardsController = class BoardsController {
    boardsService;
    constructor(boardsService) {
        this.boardsService = boardsService;
    }
    create(request, dto) {
        return this.boardsService.create(request.user.id, dto);
    }
    findAll(request, search) {
        return this.boardsService.findAll(request.user.id, search);
    }
    async findOne(boardId, request) {
        return this.boardsService.findOne(request.user.id, boardId);
    }
    async update(boardId, request, dto) {
        return this.boardsService.update(request.user.id, boardId, dto);
    }
    async remove(boardId, request) {
        return this.boardsService.remove(request.user.id, boardId);
    }
};
__decorate([
    Post(),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateBoardDto]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Req()),
    __param(1, Query('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, UpdateBoardDto]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "remove", null);
BoardsController = __decorate([
    Controller('boards'),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [BoardsService])
], BoardsController);
export { BoardsController };
//# sourceMappingURL=boards.controller.js.map