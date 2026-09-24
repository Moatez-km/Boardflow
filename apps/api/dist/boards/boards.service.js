var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let BoardsService = class BoardsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.board.create({
            data: {
                title: dto.title,
                description: dto.description,
                visibility: dto.visibility ?? 'PRIVATE',
                viewType: dto.viewType ?? 'KANBAN',
                ownerId: userId,
            },
        });
    }
    async findAll(userId, search) {
        return this.prisma.board.findMany({
            where: {
                ownerId: userId,
                ...(search?.trim()
                    ? {
                        title: {
                            contains: search.trim(),
                            mode: 'insensitive',
                        },
                    }
                    : {}),
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
    }
    async findOneForOwner(userId, boardId) {
        const board = await this.prisma.board.findFirst({
            where: {
                id: boardId,
                ownerId: userId,
            },
        });
        if (!board) {
            throw new NotFoundException('Board not found');
        }
        return board;
    }
    async findOne(userId, boardId) {
        return this.checkReadAccess(boardId, userId);
    }
    async update(userId, boardId, dto) {
        await this.findOneForOwner(userId, boardId);
        return this.prisma.board.update({
            where: {
                id: boardId,
            },
            data: dto,
        });
    }
    async remove(userId, boardId) {
        await this.findOneForOwner(userId, boardId);
        await this.prisma.board.delete({
            where: {
                id: boardId,
            },
        });
        return {
            message: 'Board deleted successfully',
        };
    }
    async getBoardOrFail(boardId) {
        const board = await this.prisma.board.findUnique({
            where: {
                id: boardId,
            },
        });
        if (!board) {
            throw new NotFoundException('Board not found');
        }
        return board;
    }
    async checkReadAccess(boardId, userId) {
        const board = await this.getBoardOrFail(boardId);
        const isOwner = userId !== undefined &&
            board.ownerId === userId;
        const isPublic = board.visibility === 'PUBLIC';
        if (isOwner || isPublic) {
            return board;
        }
        throw new ForbiddenException('You do not have permission to view this board');
    }
    async checkOwnerAccess(boardId, userId) {
        const board = await this.getBoardOrFail(boardId);
        if (board.ownerId !== userId) {
            throw new ForbiddenException('Only the board owner can perform this action');
        }
        return board;
    }
};
BoardsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], BoardsService);
export { BoardsService };
//# sourceMappingURL=boards.service.js.map