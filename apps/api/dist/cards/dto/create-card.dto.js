var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength, } from 'class-validator';
export var CardType;
(function (CardType) {
    CardType["TEXT"] = "TEXT";
    CardType["IMAGE"] = "IMAGE";
    CardType["FILE"] = "FILE";
    CardType["VIDEO"] = "VIDEO";
    CardType["AUDIO"] = "AUDIO";
    CardType["LINK"] = "LINK";
})(CardType || (CardType = {}));
export class CreateCardDto {
    title;
    content;
    type;
    sectionId;
    startAt;
    endAt;
    x;
    y;
    latitude;
    longitude;
}
__decorate([
    IsString(),
    MaxLength(200),
    __metadata("design:type", String)
], CreateCardDto.prototype, "title", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", Object)
], CreateCardDto.prototype, "content", void 0);
__decorate([
    IsOptional(),
    IsEnum(CardType),
    __metadata("design:type", String)
], CreateCardDto.prototype, "type", void 0);
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "sectionId", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "startAt", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "endAt", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", Number)
], CreateCardDto.prototype, "x", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", Number)
], CreateCardDto.prototype, "y", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", Number)
], CreateCardDto.prototype, "latitude", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", Number)
], CreateCardDto.prototype, "longitude", void 0);
//# sourceMappingURL=create-card.dto.js.map