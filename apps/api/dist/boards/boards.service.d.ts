import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { UpdateBoardDto } from './dto/update-board.dto.js';
export declare class BoardsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBoardDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        ownerId: string;
    }>;
    findAll(userId: string, search?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        ownerId: string;
    }[]>;
    findOneForOwner(userId: string, boardId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        ownerId: string;
    }>;
    findOne(userId: string, boardId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        ownerId: string;
    }>;
    update(userId: string, boardId: string, dto: UpdateBoardDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        ownerId: string;
    }>;
    remove(userId: string, boardId: string): Promise<{
        message: string;
    }>;
    getBoardOrFail(boardId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        ownerId: string;
    }>;
    checkReadAccess(boardId: string, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        ownerId: string;
    }>;
    checkOwnerAccess(boardId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        ownerId: string;
    }>;
}
