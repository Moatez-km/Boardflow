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
import { Controller, Post, Body, Param, UseGuards, Req, Get, } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { SectionsService } from './sections.service.js';
import { CreateSectionDto } from './dto/create-section.dto.js';
let SectionsController = class SectionsController {
    sectionsService;
    constructor(sectionsService) {
        this.sectionsService = sectionsService;
    }
    create(request, boardId, dto) {
        return this.sectionsService.create(request.user.id, boardId, dto);
    }
    findAll(request, boardId) {
        return this.sectionsService.findAll(request.user.id, boardId);
    }
};
__decorate([
    Post('boards/:boardId/sections'),
    __param(0, Req()),
    __param(1, Param('boardId')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateSectionDto]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "create", null);
__decorate([
    Get('boards/:boardId/sections'),
    __param(0, Req()),
    __param(1, Param('boardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "findAll", null);
SectionsController = __decorate([
    Controller(),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [SectionsService])
], SectionsController);
export { SectionsController };
//# sourceMappingURL=sections.controller.js.map