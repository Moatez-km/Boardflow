export declare enum CardType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    FILE = "FILE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    LINK = "LINK"
}
export declare class CreateCardDto {
    title: string;
    content?: unknown;
    type?: CardType;
    sectionId?: string;
    startAt?: string;
    endAt?: string;
    x?: number;
    y?: number;
    latitude?: number;
    longitude?: number;
}
