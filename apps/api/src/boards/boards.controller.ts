import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { UpdateBoardDto } from './dto/update-board.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) { }

    @Post()
    create(@Req() request: any, @Body() dto: CreateBoardDto) {
        return this.boardsService.create(request.user.id, dto);
    }

    @Get()
    findAll(
        @Req() request: any,
        @Query('search') search?: string,
    ) {
        return this.boardsService.findAll(request.user.id, search);
    }

    @Get(':id')
    findOne(@Req() request: any, @Param('id') id: string) {
        return this.boardsService.findOne(request.user.id, id);
    }

    @Patch(':id')
    update(
        @Req() request: any,
        @Param('id') id: string,
        @Body() dto: UpdateBoardDto,
    ) {
        return this.boardsService.update(request.user.id, id, dto);
    }

    @Delete(':id')
    remove(@Req() request: any, @Param('id') id: string) {
        return this.boardsService.remove(request.user.id, id);
    }
}
