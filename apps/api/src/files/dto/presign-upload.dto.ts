import {
    IsInt,
    IsNotEmpty,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class PresignUploadDto {
    @IsString()
    @IsNotEmpty()
    cardId: string;

    @IsString()
    @IsNotEmpty()
    filename: string;

    @IsString()
    @IsNotEmpty()
    mimeType: string;

    @IsInt()
    @Min(1)
    @Max(10 * 1024 * 1024)
    size: number;
}