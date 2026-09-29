import { FilesService } from './files.service.js';
import { PresignUploadDto } from './dto/presign-upload.dto.js';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    presign(request: any, dto: PresignUploadDto): Promise<{
        uploadUrl: string;
        storageKey: string;
        expiresIn: number;
    }>;
}
