import {
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
} from 'class-validator';

export class CompleteUploadDto {
    @IsString()
    @IsNotEmpty()
    cardId: string;

    @IsString()
    @IsNotEmpty()
    storageKey: string;

    @IsString()
    @IsNotEmpty()
    filename: string;

    @IsString()
    @IsNotEmpty()
    mimeType: string;

    @IsInt()
    @Min(1)
    size: number;
}