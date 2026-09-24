var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForbiddenException, Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let CardsService = class CardsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCardWithBoard(cardId) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: {
                board: true,
                section: true,
            },
        });
        if (!card) {
            throw new NotFoundException('Card not found');
        }
        return card;
    }
    async assertBoardPermission(userId, boardId, permission) {
        const board = await this.prisma.board.findUnique({
            where: {
                id: boardId,
            },
            select: {
                id: true,
                ownerId: true,
                visibility: true,
            },
        });
        if (!board) {
            throw new NotFoundException('Board not found');
        }
        const isOwner = board.ownerId === userId;
        if (!isOwner) {
            throw new ForbiddenException('You do not have permission to access this board');
        }
        return board;
    }
    async create(userId, boardId, dto) {
        await this.assertBoardPermission(userId, boardId, 'create');
        if (dto.sectionId) {
            const section = await this.prisma.section.findFirst({
                where: {
                    id: dto.sectionId,
                    boardId,
                },
            });
            if (!section) {
                throw new BadRequestException('Section does not belong to this board');
            }
        }
        const lastCard = await this.prisma.card.findFirst({
            where: {
                boardId,
                sectionId: dto.sectionId ?? null,
            },
            orderBy: {
                position: 'desc',
            },
        });
        const position = lastCard
            ? Number(lastCard.position) + 1000
            : 1000;
        return this.prisma.card.create({
            data: {
                boardId,
                sectionId: dto.sectionId ?? null,
                title: dto.title,
                content: JSON.stringify(dto.content),
                type: dto.type ?? 'TEXT',
                position,
                createdById: userId,
                startAt: dto.startAt
                    ? new Date(dto.startAt)
                    : undefined,
                endAt: dto.endAt
                    ? new Date(dto.endAt)
                    : undefined,
                x: dto.x,
                y: dto.y,
                latitude: dto.latitude,
                longitude: dto.longitude,
            },
            include: {
                attachments: true,
            },
        });
    }
    async findAll(userId, boardId) {
        await this.assertBoardPermission(userId, boardId, 'read');
        return this.prisma.card.findMany({
            where: {
                boardId,
            },
            orderBy: [
                { position: 'asc' },
                { sectionId: 'asc' }
            ],
            include: {
                attachments: true,
            },
        });
    }
    async getCardOrFail(cardId) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: cardId,
            },
            include: {
                board: true,
            },
        });
        if (!card) {
            throw new NotFoundException('Card not found');
        }
        return card;
    }
    async update(userId, cardId, dto) {
        const card = await this.getCardOrFail(cardId);
        await this.assertBoardPermission(userId, card.boardId, 'edit');
        if (dto.sectionId) {
            const section = await this.prisma.section.findFirst({
                where: {
                    id: dto.sectionId,
                    boardId: card.boardId,
                },
            });
            if (!section) {
                throw new BadRequestException('Section does not belong to this board');
            }
        }
        return this.prisma.card.update({
            where: {
                id: cardId,
            },
            data: {
                title: dto.title,
                content: JSON.stringify(dto.content),
                type: dto.type,
                sectionId: dto.sectionId,
                x: dto.x,
                y: dto.y,
                latitude: dto.latitude,
                longitude: dto.longitude,
                startAt: dto.startAt
                    ? new Date(dto.startAt)
                    : undefined,
                endAt: dto.endAt
                    ? new Date(dto.endAt)
                    : undefined,
            },
            include: {
                attachments: true,
            },
        });
    }
    async remove(userId, cardId) {
        const card = await this.getCardOrFail(cardId);
        await this.assertBoardPermission(userId, card.boardId, 'delete');
        await this.prisma.card.delete({
            where: {
                id: cardId,
            },
        });
        return {
            success: true,
            id: cardId,
        };
    }
    async reorder(userId, cardId, dto) {
        const card = await this.getCardOrFail(cardId);
        await this.assertBoardPermission(userId, card.boardId, 'edit');
        if (dto.sectionId) {
            const section = await this.prisma.section.findFirst({
                where: {
                    id: dto.sectionId,
                    boardId: card.boardId,
                },
            });
            if (!section) {
                throw new BadRequestException('Section does not belong to this board');
            }
        }
        return this.prisma.card.update({
            where: {
                id: cardId,
            },
            data: {
                sectionId: dto.sectionId ?? null,
                position: dto.position,
            },
        });
    }
};
CardsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CardsService);
export { CardsService };
//# sourceMappingURL=cards.service.js.map