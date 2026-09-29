import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from './storage.service.js';

import { PresignUploadDto } from './dto/presign-upload.dto.js';
import {
    ALLOWED_MIME_TYPES,
    MAX_FILE_SIZE,
} from './file.constants.js';

import { generateStorageKey } from './storage-key.js';

@Injectable()
export class FilesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly storage: StorageService,
    ) { }

    async presign(
        userId: string,
        dto: PresignUploadDto,
    ) {
        // 1. Validate size
        if (dto.size > MAX_FILE_SIZE) {
            throw new BadRequestException(
                'File is too large',
            );
        }

        // 2. Validate MIME type
        if (!ALLOWED_MIME_TYPES.has(dto.mimeType)) {
            throw new BadRequestException(
                'File type is not allowed',
            );
        }

        // 3. Find card
        const card =
            await this.prisma.card.findUnique({
                where: {
                    id: dto.cardId,
                },
                include: {
                    board: true,
                },
            });

        if (!card) {
            throw new NotFoundException(
                'Card not found',
            );
        }

        // 4. Authorization
        if (card.board.ownerId !== userId) {
            throw new BadRequestException(
                'You cannot upload to this card',
            );
        }

        // 5. Generate storage key
        const storageKey =
            generateStorageKey(
                userId,
                dto.cardId,
                dto.filename,
            );

        // 6. Generate presigned URL
        const uploadUrl =
            await this.storage.createUploadUrl(
                storageKey,
                dto.mimeType,
            );

        return {
            uploadUrl,
            storageKey,
            expiresIn: 300,
        };
    }
}