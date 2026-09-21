import { createParamDecorator, UnauthorizedException, } from '@nestjs/common';
export const CurrentUser = createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
        throw new UnauthorizedException('Authenticated user not found');
    }
    return data ? user[data] : user;
});
//# sourceMappingURL=current-user.decorator.js.map