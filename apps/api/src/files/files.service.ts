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
import { CompleteUploadDto } from './dto/complete-upload.dto.js';

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
        //later member/role permission tables.
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
    async complete(
        userId: string,
        dto: CompleteUploadDto,
    ) {
        // 1. Find card
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

        // 2. Authorization
        if (card.board.ownerId !== userId) {
            throw new BadRequestException(
                'You cannot upload to this card',
            );
        }

        // 3. Make sure storage key belongs
        //    to this user/card
        const expectedPrefix =
            `attachments/${userId}/${dto.cardId}/`;

        if (!dto.storageKey.startsWith(expectedPrefix)) {
            throw new BadRequestException(
                'Invalid storage key',
            );
        }

        // 4. Verify object actually exists
        const object =
            await this.storage.headObject(
                dto.storageKey,
            );

        // 5. Verify actual size
        if (
            !object.ContentLength ||
            object.ContentLength > MAX_FILE_SIZE
        ) {
            throw new BadRequestException(
                'Invalid uploaded file size',
            );
        }

        // 6. Verify MIME
        if (
            object.ContentType &&
            !ALLOWED_MIME_TYPES.has(
                object.ContentType,
            )
        ) {
            throw new BadRequestException(
                'Invalid uploaded file type',
            );
        }

        // 7. Create DB record
        const attachment =
            await this.prisma.attachment.create({
                data: {
                    cardId: dto.cardId,

                    storageKey: dto.storageKey,

                    filename: dto.filename,

                    mimeType:
                        object.ContentType ??
                        dto.mimeType,

                    size: BigInt(
                        object.ContentLength,
                    ),

                    uploadedById: userId,
                },
            });

        return {
            id: attachment.id,
            cardId: attachment.cardId,
            filename: attachment.filename,
            mimeType: attachment.mimeType,
            size: attachment.size.toString(),
            createdAt: attachment.createdAt,
        };
    }
}