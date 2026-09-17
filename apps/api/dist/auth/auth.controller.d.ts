import express from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        email: string;
        name: string;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }>;
    login(dto: LoginDto, res: express.Response): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            status: "ACTIVE";
        };
    }>;
    me(req: Request & {
        user?: {
            sub: string;
        };
    }): Promise<{
        email: string;
        name: string;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
    } | null>;
    logout(res: express.Response): {
        message: string;
    };
}
