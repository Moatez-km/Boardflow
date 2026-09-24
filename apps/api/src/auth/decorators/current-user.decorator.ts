import {
    ExecutionContext,
    createParamDecorator,
    UnauthorizedException,
} from '@nestjs/common';

export interface AuthenticatedUser {
    id: string;
    email: string;
    sub?: string;
}

export const CurrentUser = createParamDecorator(
    (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as AuthenticatedUser | undefined;

        if (!user) {
            throw new UnauthorizedException('Authenticated user not found');
        }

        return data ? user[data] : user;
    },
);
