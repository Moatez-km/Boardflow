import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from './storage.service.js';
import { PresignUploadDto } from './dto/presign-upload.dto.js';
import { CompleteUploadDto } from './dto/complete-upload.dto.js';
export declare class FilesService {
    private readonly prisma;
    private readonly storage;
    constructor(prisma: PrismaService, storage: StorageService);
    presign(userId: string, dto: PresignUploadDto): Promise<{
        uploadUrl: string;
        storageKey: string;
        expiresIn: number;
    }>;
    complete(userId: string, dto: CompleteUploadDto): Promise<{
        id: string;
        cardId: string;
        filename: string;
        mimeType: string;
        size: string;
        createdAt: Date;
    }>;
}
