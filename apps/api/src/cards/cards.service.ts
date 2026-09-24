import {
    ForbiddenException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';
import { ReorderCardDto } from './dto/reorder-card.dto.js';
import { Prisma } from '@prisma/client';



@Injectable()
export class CardsService {
    constructor(private prisma: PrismaService) { }
    private async getCardWithBoard(cardId: string) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: {
                board: true,
                section: true,
            },
        });

        if (!card) {
            throw new NotFoundException('Card not found');
        }

        return card;
    }

    /*  private async assertBoardPermission(
    userId: string,
    boardId: string,
    permission: 'read' | 'create' | 'edit' | 'delete',
  ) {
    const allowed = await this.permissionsService.can(
      userId,
      boardId,
      permission,
    );
  
    if (!allowed) {
      throw new ForbiddenException('Insufficient permission');
    }
  }*/



}
