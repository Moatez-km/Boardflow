import { Injectable } from '@nestjs/common';
import {
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
    private readonly s3: S3Client;

    private readonly bucket = process.env.S3_BUCKET!;

    constructor() {
        this.s3 = new S3Client({
            region: process.env.S3_REGION!,
            endpoint: process.env.S3_ENDPOINT,

            forcePathStyle:
                process.env.S3_FORCE_PATH_STYLE === 'true',

            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY!,
                secretAccessKey: process.env.S3_SECRET_KEY!,
            },
        });
    }

    async createUploadUrl(
        storageKey: string,
        mimeType: string,
    ) {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: storageKey,
            ContentType: mimeType,
        });

        return getSignedUrl(
            this.s3,
            command,
            {
                expiresIn: 60 * 5,
            },
        );
    }
}