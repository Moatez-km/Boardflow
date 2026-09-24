import {
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';

export enum CardType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    FILE = 'FILE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    LINK = 'LINK',
}

export class CreateCardDto {
    @IsString()
    @MaxLength(200)
    title: string;

    @IsOptional()
    content?: unknown;

    @IsOptional()
    @IsEnum(CardType)
    type?: CardType;

    @IsOptional()
    @IsUUID()
    sectionId?: string;

    @IsOptional()
    @IsDateString()
    startAt?: string;

    @IsOptional()
    @IsDateString()
    endAt?: string;

    @IsOptional()
    x?: number;

    @IsOptional()
    y?: number;

    @IsOptional()
    latitude?: number;

    @IsOptional()
    longitude?: number;
}
