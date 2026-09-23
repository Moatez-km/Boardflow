import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export enum BoardVisibilityDto {
    PRIVATE = 'PRIVATE',
    PUBLIC = 'PUBLIC',

}

export enum ViewTypeDto {
    KANBAN = 'KANBAN',
    CANVAS = 'CANVAS',
    TIMELINE = 'TIMELINE',
    MAP = 'MAP',
    BLOG = 'BLOG',
}

export class CreateBoardDto {
    @IsString()
    @MinLength(1)
    @MaxLength(120)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsEnum(BoardVisibilityDto)
    visibility?: BoardVisibilityDto;

    @IsOptional()
    @IsEnum(ViewTypeDto)
    viewType?: ViewTypeDto;
}
