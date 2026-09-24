import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';
import { ReorderCardDto } from './dto/reorder-card.dto.js';
import { Prisma } from '@prisma/client';



@Injectable()
export class CardsService {
    constructor(private prisma: PrismaService) { }
    private async getCardWithBoard(cardId: string) {
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

    /*  private async assertBoardPermission(
    userId: string,
    boardId: string,
    permission: 'read' | 'create' | 'edit' | 'delete',
  ) {
    const allowed = await this.permissionsService.can(
      userId,
      boardId,
      permission,
    );
  
    if (!allowed) {
      throw new ForbiddenException('Insufficient permission');
    }
  }*/

    private async assertBoardPermission(
        userId: string,
        boardId: string,
        permission: 'read' | 'create' | 'edit' | 'delete',
    ) {
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

        // Temporary Phase 3 rule:
        // Only the board owner can access and modify cards.
        const isOwner = board.ownerId === userId;

        if (!isOwner) {
            throw new ForbiddenException(
                'You do not have permission to access this board',
            );
        }

        return board;
    }
    async create(
        userId: string,
        boardId: string,
        dto: CreateCardDto,
    ) {
        await this.assertBoardPermission(userId, boardId, 'create');

        if (dto.sectionId) {
            const section = await this.prisma.section.findFirst({
                where: {
                    id: dto.sectionId,
                    boardId,
                },
            });

            if (!section) {
                throw new BadRequestException(
                    'Section does not belong to this board',
                );
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
    async findAll(userId: string, boardId: string) {
        await this.assertBoardPermission(userId, boardId, 'read');

        return this.prisma.card.findMany({
            where: {
                boardId,
            },
            orderBy: {
                position: 'asc',
            },
            include: {
                attachments: true,
            },
        });
    }

    private async getCardOrFail(cardId: string) {
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
    async update(
        userId: string,
        cardId: string,
        dto: UpdateCardDto,
    ) {
        const card = await this.getCardOrFail(cardId);

        await this.assertBoardPermission(
            userId,
            card.boardId,
            'edit',
        );

        if (dto.sectionId) {
            const section = await this.prisma.section.findFirst({
                where: {
                    id: dto.sectionId,
                    boardId: card.boardId,
                },
            });

            if (!section) {
                throw new BadRequestException(
                    'Section does not belong to this board',
                );
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
    async remove(userId: string, cardId: string) {
        const card = await this.getCardOrFail(cardId);

        await this.assertBoardPermission(
            userId,
            card.boardId,
            'delete',
        );

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
    async reorder(
        userId: string,
        cardId: string,
        dto: ReorderCardDto,
    ) {
        const card = await this.getCardOrFail(cardId);

        await this.assertBoardPermission(
            userId,
            card.boardId,
            'edit',
        );

        if (dto.sectionId) {
            const section = await this.prisma.section.findFirst({
                where: {
                    id: dto.sectionId,
                    boardId: card.boardId,
                },
            });

            if (!section) {
                throw new BadRequestException(
                    'Section does not belong to this board',
                );
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

}
