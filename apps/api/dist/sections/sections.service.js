var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
let SectionsService = class SectionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertBoardOwner(userId, boardId) {
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
        });
        if (!board) {
            throw new NotFoundException('Board not found');
        }
        if (board.ownerId !== userId) {
            throw new ForbiddenException('You do not have permission to perform this action');
        }
    }
    async create(userId, boardId, dto) {
        await this.assertBoardOwner(userId, boardId);
        const lastSection = await this.prisma.section.findFirst({
            where: {
                boardId,
            },
            orderBy: {
                position: 'desc',
            },
        });
        const position = lastSection
            ? Number(lastSection.position) + 1000
            : 1000;
        return this.prisma.section.create({
            data: {
                boardId,
                title: dto.title,
                position,
            },
        });
    }
    async findAll(userId, boardId) {
        await this.assertBoardOwner(userId, boardId);
        return this.prisma.section.findMany({
            where: {
                boardId,
            },
            orderBy: {
                position: 'asc',
            },
            include: {
                cards: {
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
        });
    }
};
SectionsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], SectionsService);
export { SectionsService };
//# sourceMappingURL=sections.service.js.map