
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { UpdateBoardDto } from './dto/update-board.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import {
    CurrentUser,
    type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator.js';

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) { }

    @Post()
    create(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateBoardDto,
    ) {
        return this.boardsService.create(user.id, dto);
    }

    @Get()
    findAll(
        @CurrentUser() user: AuthenticatedUser,
        @Query('search') search?: string,
    ) {
        return this.boardsService.findAll(user.id, search);
    }

    @Get(':id')
    findOne(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
    ) {
        return this.boardsService.findOne(user.id, id);
    }

    @Patch(':id')
    update(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
        @Body() dto: UpdateBoardDto,
    ) {
        return this.boardsService.update(user.id, id, dto);
    }

    @Delete(':id')
    remove(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
    ) {
        return this.boardsService.remove(user.id, id);
    }
}
