var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from './storage.service.js';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE, } from './file.constants.js';
import { generateStorageKey } from './storage-key.js';
let FilesService = class FilesService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async presign(userId, dto) {
        if (dto.size > MAX_FILE_SIZE) {
            throw new BadRequestException('File is too large');
        }
        if (!ALLOWED_MIME_TYPES.has(dto.mimeType)) {
            throw new BadRequestException('File type is not allowed');
        }
        const card = await this.prisma.card.findUnique({
            where: {
                id: dto.cardId,
            },
            include: {
                board: true,
            },
        });
        if (!card) {
            throw new NotFoundException('Card not found');
        }
        if (card.board.ownerId !== userId) {
            throw new BadRequestException('You cannot upload to this card');
        }
        const storageKey = generateStorageKey(userId, dto.cardId, dto.filename);
        const uploadUrl = await this.storage.createUploadUrl(storageKey, dto.mimeType);
        return {
            uploadUrl,
            storageKey,
            expiresIn: 300,
        };
    }
    async complete(userId, dto) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: dto.cardId,
            },
            include: {
                board: true,
            },
        });
        if (!card) {
            throw new NotFoundException('Card not found');
        }
        if (card.board.ownerId !== userId) {
            throw new BadRequestException('You cannot upload to this card');
        }
        const expectedPrefix = `attachments/${userId}/${dto.cardId}/`;
        if (!dto.storageKey.startsWith(expectedPrefix)) {
            throw new BadRequestException('Invalid storage key');
        }
        const object = await this.storage.headObject(dto.storageKey);
        if (!object.ContentLength ||
            object.ContentLength > MAX_FILE_SIZE) {
            throw new BadRequestException('Invalid uploaded file size');
        }
        if (object.ContentType &&
            !ALLOWED_MIME_TYPES.has(object.ContentType)) {
            throw new BadRequestException('Invalid uploaded file type');
        }
        const attachment = await this.prisma.attachment.create({
            data: {
                cardId: dto.cardId,
                storageKey: dto.storageKey,
                filename: dto.filename,
                mimeType: object.ContentType ??
                    dto.mimeType,
                size: BigInt(object.ContentLength),
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
};
FilesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        StorageService])
], FilesService);
export { FilesService };
//# sourceMappingURL=files.service.js.map