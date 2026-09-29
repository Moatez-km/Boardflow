export declare class StorageService {
    private readonly s3;
    private readonly bucket;
    constructor();
    createUploadUrl(storageKey: string, mimeType: string): Promise<string>;
    headObject(storageKey: string): Promise<import("@aws-sdk/client-s3").HeadObjectCommandOutput>;
}
