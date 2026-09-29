import { FilesService } from './files.service.js';
import { PresignUploadDto } from './dto/presign-upload.dto.js';
import { CompleteUploadDto } from './dto/complete-upload.dto.js';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    presign(request: any, dto: PresignUploadDto): Promise<{
        uploadUrl: string;
        storageKey: string;
        expiresIn: number;
    }>;
    complete(request: any, dto: CompleteUploadDto): Promise<{
        id: string;
        cardId: string;
        filename: string;
        mimeType: string;
        size: string;
        createdAt: Date;
    }>;
}
