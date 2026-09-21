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
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, } from '@nestjs/common';
import { BoardsService } from './boards.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { UpdateBoardDto } from './dto/update-board.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser, } from '../auth/decorators/current-user.decorator.js';
let BoardsController = class BoardsController {
    boardsService;
    constructor(boardsService) {
        this.boardsService = boardsService;
    }
    create(user, dto) {
        return this.boardsService.create(user.id, dto);
    }
    findAll(user, search) {
        return this.boardsService.findAll(user.id, search);
    }
    findOne(user, id) {
        return this.boardsService.findOne(user.id, id);
    }
    update(user, id, dto) {
        return this.boardsService.update(user.id, id, dto);
    }
    remove(user, id) {
        return this.boardsService.remove(user.id, id);
    }
};
__decorate([
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateBoardDto]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateBoardDto]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "remove", null);
BoardsController = __decorate([
    Controller('boards'),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [BoardsService])
], BoardsController);
export { BoardsController };
//# sourceMappingURL=boards.controller.js.map