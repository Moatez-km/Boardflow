export interface AuthenticatedUser {
    id: string;
    email: string;
    sub?: string;
}
export declare const CurrentUser: (...dataOrPipes: (keyof AuthenticatedUser | import("@nestjs/common").ParameterDecoratorOptions | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
