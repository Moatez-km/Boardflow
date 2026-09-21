import { BoardsService } from './boards.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { UpdateBoardDto } from './dto/update-board.dto.js';
import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';
export declare class BoardsController {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
    create(user: AuthenticatedUser, dto: CreateBoardDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    findAll(user: AuthenticatedUser, search?: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }[]>;
    findOne(user: AuthenticatedUser, id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    update(user: AuthenticatedUser, id: string, dto: UpdateBoardDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    remove(user: AuthenticatedUser, id: string): Promise<{
        message: string;
    }>;
}
