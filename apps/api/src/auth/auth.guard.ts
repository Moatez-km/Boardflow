import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<Request & { user?: unknown }>();

        const token = request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException('Authentication required');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);
            request.user = {
                id: payload.sub,
                email: payload.email,
                sub: payload.sub,
            };
            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired session');
        }
    }
}
