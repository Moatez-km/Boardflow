import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSectionDto } from './dto/create-section.dto.js';
export declare class SectionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private assertBoardOwner;
    create(userId: string, boardId: string, dto: CreateSectionDto): Promise<{
        id: string;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        boardId: string;
    }>;
    findAll(userId: string, boardId: string): Promise<({
        cards: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            y: number | null;
            title: string;
            content: import("@prisma/client/runtime/library").JsonValue | null;
            type: import("@prisma/client").$Enums.CardType;
            sectionId: string | null;
            startAt: Date | null;
            endAt: Date | null;
            x: number | null;
            latitude: import("@prisma/client/runtime/library").Decimal | null;
            longitude: import("@prisma/client/runtime/library").Decimal | null;
            position: import("@prisma/client/runtime/library").Decimal;
            boardId: string;
            createdById: string;
        }[];
    } & {
        id: string;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        boardId: string;
    })[]>;
}
