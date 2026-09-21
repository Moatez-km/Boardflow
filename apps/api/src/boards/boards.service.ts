import {
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

    async findAll(userId: string, search?: string) {
        return this.prisma.board.findMany({
            where: {
                ownerId: userId,
                ...(search
                    ? {
                        title: {
                            contains: search,
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

    async findOne(userId: string, boardId: string) {
        const board = await this.prisma.board.findFirst({
            where: {
                id: boardId,
                ownerId: userId,
            },
            //implement section
        });

        if (!board) {
            throw new NotFoundException('Board not found');
        }

        return board;
    }

    async update(userId: string, boardId: string, dto: UpdateBoardDto) {
        await this.findOne(userId, boardId);

        return this.prisma.board.update({
            where: {
                id: boardId,
            },
            data: dto,
        });
    }

    async remove(userId: string, boardId: string) {
        await this.findOne(userId, boardId);

        await this.prisma.board.delete({
            where: {
                id: boardId,
            },
        });

        return {
            message: 'Board deleted successfully',
        };
    }
}
