import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateSectionDto {
    @IsString()
    @MaxLength(100)
    title: string;

    @IsOptional()
    position?: number;
}