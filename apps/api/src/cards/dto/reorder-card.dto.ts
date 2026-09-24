import { IsOptional, IsUUID, IsNumber } from 'class-validator';

export class ReorderCardDto {
    @IsOptional()
    @IsUUID()
    sectionId?: string;

    @IsNumber()
    position: number;
}

