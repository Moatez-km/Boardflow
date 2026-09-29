import { randomUUID } from 'crypto';
import { extname } from 'path';
export function generateStorageKey(userId, cardId, filename) {
    const extension = extname(filename).toLowerCase();
    return [
        'attachments',
        userId,
        cardId,
        `${randomUUID()}${extension}`,
    ].join('/');
}
//# sourceMappingURL=storage-key.js.map