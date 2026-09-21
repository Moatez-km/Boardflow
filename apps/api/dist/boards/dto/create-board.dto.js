var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
export var BoardVisibilityDto;
(function (BoardVisibilityDto) {
    BoardVisibilityDto["PRIVATE"] = "PRIVATE";
    BoardVisibilityDto["PUBLIC"] = "PUBLIC";
})(BoardVisibilityDto || (BoardVisibilityDto = {}));
export var ViewTypeDto;
(function (ViewTypeDto) {
    ViewTypeDto["KANBAN"] = "KANBAN";
    ViewTypeDto["CANVAS"] = "CANVAS";
    ViewTypeDto["TIMELINE"] = "TIMELINE";
    ViewTypeDto["MAP"] = "MAP";
    ViewTypeDto["BLOG"] = "BLOG";
})(ViewTypeDto || (ViewTypeDto = {}));
export class CreateBoardDto {
    title;
    description;
    visibility;
    viewType;
}
__decorate([
    IsString(),
    MinLength(1),
    MaxLength(120),
    __metadata("design:type", String)
], CreateBoardDto.prototype, "title", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(1000),
    __metadata("design:type", String)
], CreateBoardDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsEnum(BoardVisibilityDto),
    __metadata("design:type", String)
], CreateBoardDto.prototype, "visibility", void 0);
__decorate([
    IsOptional(),
    IsEnum(ViewTypeDto),
    __metadata("design:type", String)
], CreateBoardDto.prototype, "viewType", void 0);
//# sourceMappingURL=create-board.dto.js.map