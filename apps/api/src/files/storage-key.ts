import { randomUUID } from 'crypto';
import { extname } from 'path';

export function generateStorageKey(
    userId: string,
    cardId: string,
    filename: string,
) {
    const extension =
        extname(filename).toLowerCase();

    return [
        'attachments',
        userId,
        cardId,
        `${randomUUID()}${extension}`,
    ].join('/');
}