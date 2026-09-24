import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';
import { ReorderCardDto } from './dto/reorder-card.dto.js';
import { Prisma } from '@prisma/client';
export declare class CardsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getCardWithBoard;
    private assertBoardPermission;
    create(userId: string, boardId: string, dto: CreateCardDto): Promise<{
        attachments: {
            id: string;
            createdAt: Date;
            cardId: string;
            storageKey: string;
            filename: string;
            mimeType: string;
            size: number;
            uploadedById: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        y: number | null;
        title: string;
        content: Prisma.JsonValue | null;
        type: import("@prisma/client").$Enums.CardType;
        sectionId: string | null;
        startAt: Date | null;
        endAt: Date | null;
        x: number | null;
        latitude: Prisma.Decimal | null;
        longitude: Prisma.Decimal | null;
        position: Prisma.Decimal;
        boardId: string;
        createdById: string;
    }>;
    findAll(userId: string, boardId: string): Promise<({
        attachments: {
            id: string;
            createdAt: Date;
            cardId: string;
            storageKey: string;
            filename: string;
            mimeType: string;
            size: number;
            uploadedById: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        y: number | null;
        title: string;
        content: Prisma.JsonValue | null;
        type: import("@prisma/client").$Enums.CardType;
        sectionId: string | null;
        startAt: Date | null;
        endAt: Date | null;
        x: number | null;
        latitude: Prisma.Decimal | null;
        longitude: Prisma.Decimal | null;
        position: Prisma.Decimal;
        boardId: string;
        createdById: string;
    })[]>;
    private getCardOrFail;
    update(userId: string, cardId: string, dto: UpdateCardDto): Promise<{
        attachments: {
            id: string;
            createdAt: Date;
            cardId: string;
            storageKey: string;
            filename: string;
            mimeType: string;
            size: number;
            uploadedById: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        y: number | null;
        title: string;
        content: Prisma.JsonValue | null;
        type: import("@prisma/client").$Enums.CardType;
        sectionId: string | null;
        startAt: Date | null;
        endAt: Date | null;
        x: number | null;
        latitude: Prisma.Decimal | null;
        longitude: Prisma.Decimal | null;
        position: Prisma.Decimal;
        boardId: string;
        createdById: string;
    }>;
    remove(userId: string, cardId: string): Promise<{
        success: boolean;
        id: string;
    }>;
    reorder(userId: string, cardId: string, dto: ReorderCardDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        y: number | null;
        title: string;
        content: Prisma.JsonValue | null;
        type: import("@prisma/client").$Enums.CardType;
        sectionId: string | null;
        startAt: Date | null;
        endAt: Date | null;
        x: number | null;
        latitude: Prisma.Decimal | null;
        longitude: Prisma.Decimal | null;
        position: Prisma.Decimal;
        boardId: string;
        createdById: string;
    }>;
}
