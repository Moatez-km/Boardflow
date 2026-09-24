import { BoardsService } from './boards.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { UpdateBoardDto } from './dto/update-board.dto.js';
export declare class BoardsController {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
    create(request: any, dto: CreateBoardDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        ownerId: string;
    }>;
    findAll(request: any, search?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        ownerId: string;
    }[]>;
    findOne(boardId: string, request: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        ownerId: string;
    }>;
    update(boardId: string, request: Request & {
        user: {
            id: string;
        };
    }, dto: UpdateBoardDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        visibility: import("@prisma/client").$Enums.BoardVisibility;
        viewType: import("@prisma/client").$Enums.ViewType;
        ownerId: string;
    }>;
    remove(boardId: string, request: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        message: string;
    }>;
}
