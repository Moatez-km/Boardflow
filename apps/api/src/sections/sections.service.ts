import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSectionDto } from './dto/create-section.dto.js';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
@Injectable()
export class SectionsService {

    constructor(private readonly prisma: PrismaService) { }

    private async assertBoardOwner(userId: string, boardId: string) {
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
        });

        if (!board) {
            throw new NotFoundException('Board not found');
        }

        if (board.ownerId !== userId) {
            throw new ForbiddenException(
                'You do not have permission to perform this action',
            );
        }
    }
    async create(
        userId: string,
        boardId: string,
        dto: CreateSectionDto,
    ) {
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
    async findAll(userId: string, boardId: string) {
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


}
