import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { UpdateBoardDto } from './dto/update-board.dto.js';

@Injectable()
export class BoardsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, dto: CreateBoardDto) {
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

    // Dashboard: return only boards owned by the current user
    async findAll(userId: string, search?: string) {
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

    // Use this for owner-only actions:
    // update, delete, settings, duplicate
    async findOneForOwner(userId: string, boardId: string) {
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

    // Use this when an authenticated owner opens a board
    async findOne(userId: string, boardId: string) {
        return this.checkReadAccess(boardId, userId);
    }

    async update(
        userId: string,
        boardId: string,
        dto: UpdateBoardDto,
    ) {
        await this.findOneForOwner(userId, boardId);

        return this.prisma.board.update({
            where: {
                id: boardId,
            },
            data: dto,
        });
    }

    async remove(userId: string, boardId: string) {
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

    async getBoardOrFail(boardId: string) {
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

    // Public/private read access
    async checkReadAccess(
        boardId: string,
        userId?: string,
    ) {
        const board = await this.getBoardOrFail(boardId);

        const isOwner =
            userId !== undefined &&
            board.ownerId === userId;

        const isPublic = board.visibility === 'PUBLIC';

        if (isOwner || isPublic) {
            return board;
        }

        throw new ForbiddenException(
            'You do not have permission to view this board',
        );
    }

    // Owner-only access
    async checkOwnerAccess(
        boardId: string,
        userId: string,
    ) {
        const board = await this.getBoardOrFail(boardId);

        if (board.ownerId !== userId) {
            throw new ForbiddenException(
                'Only the board owner can perform this action',
            );
        }

        return board;
    }
}
