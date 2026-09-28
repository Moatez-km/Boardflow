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
        title: string;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        type: import("@prisma/client").$Enums.CardType;
        position: import("@prisma/client/runtime/library").Decimal;
        x: number | null;
        y: number | null;
        startAt: Date | null;
        endAt: Date | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        sectionId: string | null;
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
        title: string;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        type: import("@prisma/client").$Enums.CardType;
        position: import("@prisma/client/runtime/library").Decimal;
        x: number | null;
        y: number | null;
        startAt: Date | null;
        endAt: Date | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        sectionId: string | null;
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
        title: string;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        type: import("@prisma/client").$Enums.CardType;
        position: import("@prisma/client/runtime/library").Decimal;
        x: number | null;
        y: number | null;
        startAt: Date | null;
        endAt: Date | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        sectionId: string | null;
        createdById: string;
    }>;
    remove(request: any, cardId: string): Promise<{
        success: boolean;
        id: string;
    }>;
    reorder(request: any, cardId: string, dto: ReorderCardDto): Promise<{
        id: string;
        title: string;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        type: import("@prisma/client").$Enums.CardType;
        position: import("@prisma/client/runtime/library").Decimal;
        x: number | null;
        y: number | null;
        startAt: Date | null;
        endAt: Date | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        sectionId: string | null;
        createdById: string;
    }>;
}
