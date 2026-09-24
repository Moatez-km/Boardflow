import { CardsService } from './cards.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';
import { ReorderCardDto } from './dto/reorder-card.dto.js';
export declare class CardsController {
    private readonly cardsService;
    constructor(cardsService: CardsService);
    findAll(request: any, boardId: string): Promise<({
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
    })[]>;
    create(request: any, boardId: string, dto: CreateCardDto): Promise<{
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
    }>;
    update(request: any, cardId: string, dto: UpdateCardDto): Promise<{
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
    }>;
    remove(request: any, cardId: string): Promise<{
        success: boolean;
        id: string;
    }>;
    reorder(request: any, cardId: string, dto: ReorderCardDto): Promise<{
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
    }>;
}
