export declare enum BoardVisibilityDto {
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC"
}
export declare enum ViewTypeDto {
    KANBAN = "KANBAN",
    CANVAS = "CANVAS",
    TIMELINE = "TIMELINE",
    MAP = "MAP",
    BLOG = "BLOG"
}
export declare class CreateBoardDto {
    title: string;
    description?: string;
    visibility?: BoardVisibilityDto;
    viewType?: ViewTypeDto;
}
