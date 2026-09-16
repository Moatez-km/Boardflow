import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        email: string;
        name: string;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            status: "ACTIVE";
        };
    }>;
    findUserById(userId: string): Promise<{
        email: string;
        name: string;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
    } | null>;
}
