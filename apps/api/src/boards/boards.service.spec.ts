import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { BoardsService } from './boards.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BoardVisibilityDto, CreateBoardDto, ViewTypeDto } from './dto/create-board.dto.js';

describe('BoardsService', () => {
  let service: BoardsService;

  const createMockPrisma = () => ({
    board: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  });

  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    vi.clearAllMocks();
    prisma = createMockPrisma();
    service = new BoardsService(prisma as unknown as PrismaService);
  });

  describe('create', () => {
    it('creates a board with default values', async () => {
      const createdBoard = {
        id: 'board-1',
        title: 'My Board',
        description: 'Test board',
        visibility: 'PRIVATE',
        viewType: 'KANBAN',
        ownerId: 'user-1',
      };

      prisma.board.create.mockResolvedValue(createdBoard);

      const dto: CreateBoardDto = {
        title: 'My Board',
        description: 'Test board',
      };

      const result = await service.create('user-1', dto);

      expect(result).toEqual(createdBoard);

      expect(prisma.board.create).toHaveBeenCalledOnce();
      expect(prisma.board.create).toHaveBeenCalledWith({
        data: {
          title: 'My Board',
          description: 'Test board',
          visibility: 'PRIVATE',
          viewType: 'KANBAN',
          ownerId: 'user-1',
        },
      });
    });

    it('creates a board using provided visibility and view type', async () => {
      const createdBoard = {
        id: 'board-2',
        title: 'Public Board',
        description: undefined,
        visibility: BoardVisibilityDto.PUBLIC,
        viewType: ViewTypeDto.CANVAS,
        ownerId: 'user-1',
      };

      prisma.board.create.mockResolvedValue(createdBoard);

      const dto: CreateBoardDto = {
        title: 'Public Board',
        description: undefined,
        visibility: BoardVisibilityDto.PUBLIC,
        viewType: ViewTypeDto.CANVAS,
      };

      const result = await service.create('user-1', dto);

      expect(result).toEqual(createdBoard);

      expect(prisma.board.create).toHaveBeenCalledWith({
        data: {
          title: 'Public Board',
          description: undefined,
          visibility: BoardVisibilityDto.PUBLIC,
          viewType: ViewTypeDto.CANVAS,
          ownerId: 'user-1',
        },
      });
    });
  });

  describe('findAll', () => {
    it('returns all boards owned by the user', async () => {
      const boards = [
        {
          id: 'board-1',
          title: 'First Board',
          ownerId: 'user-1',
        },
        {
          id: 'board-2',
          title: 'Second Board',
          ownerId: 'user-1',
        },
      ];

      prisma.board.findMany.mockResolvedValue(boards);

      const result = await service.findAll('user-1');

      expect(result).toEqual(boards);

      expect(prisma.board.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: 'user-1',
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    });

    it('filters boards by a trimmed search term', async () => {
      prisma.board.findMany.mockResolvedValue([]);

      await service.findAll('user-1', '  project  ');

      expect(prisma.board.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: 'user-1',
          title: {
            contains: 'project',
            mode: 'insensitive',
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    });

    it('does not add a title filter for an empty search term', async () => {
      prisma.board.findMany.mockResolvedValue([]);

      await service.findAll('user-1', '   ');

      expect(prisma.board.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: 'user-1',
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    });
  });

  describe('findOneForOwner', () => {
    it('returns the board when the user is the owner', async () => {
      const board = {
        id: 'board-1',
        title: 'My Board',
        ownerId: 'user-1',
      };

      prisma.board.findFirst.mockResolvedValue(board);

      const result = await service.findOneForOwner(
        'user-1',
        'board-1',
      );

      expect(result).toEqual(board);

      expect(prisma.board.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'board-1',
          ownerId: 'user-1',
        },
      });
    });

    it('throws NotFoundException when the board is not owned by the user', async () => {
      prisma.board.findFirst.mockResolvedValue(null);

      await expect(
        service.findOneForOwner('user-1', 'board-1'),
      ).rejects.toBeInstanceOf(NotFoundException);

      await expect(
        service.findOneForOwner('user-1', 'board-1'),
      ).rejects.toThrow('Board not found');
    });
  });

  describe('findOne', () => {
    it('returns a board when the user has read access', async () => {
      const board = {
        id: 'board-1',
        title: 'Private Board',
        ownerId: 'user-1',
        visibility: 'PRIVATE',
      };

      prisma.board.findUnique.mockResolvedValue(board);

      const result = await service.findOne(
        'user-1',
        'board-1',
      );

      expect(result).toEqual(board);
    });

    it('returns a public board without a user id', async () => {
      const board = {
        id: 'board-1',
        title: 'Public Board',
        ownerId: 'user-1',
        visibility: 'PUBLIC',
      };

      prisma.board.findUnique.mockResolvedValue(board);

      const result = await service.findOne(
        undefined,
        'board-1',
      );

      expect(result).toEqual(board);
    });

    it('rejects a private board for a different user', async () => {
      const board = {
        id: 'board-1',
        title: 'Private Board',
        ownerId: 'owner-1',
        visibility: 'PRIVATE',
      };

      prisma.board.findUnique.mockResolvedValue(board);

      await expect(
        service.findOne('another-user', 'board-1'),
      ).rejects.toBeInstanceOf(ForbiddenException);

      await expect(
        service.findOne('another-user', 'board-1'),
      ).rejects.toThrow(
        'You do not have permission to view this board',
      );
    });

    it('throws NotFoundException when the board does not exist', async () => {
      prisma.board.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('user-1', 'unknown-board'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.board.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'unknown-board',
        },
      });
    });
  });

  describe('update', () => {
    it('updates a board owned by the user', async () => {
      const existingBoard = {
        id: 'board-1',
        title: 'Old title',
        ownerId: 'user-1',
      };

      const updatedBoard = {
        id: 'board-1',
        title: 'New title',
        ownerId: 'user-1',
      };

      prisma.board.findFirst.mockResolvedValue(existingBoard);
      prisma.board.update.mockResolvedValue(updatedBoard);

      const dto = {
        title: 'New title',
      };

      const result = await service.update(
        'user-1',
        'board-1',
        dto,
      );

      expect(result).toEqual(updatedBoard);

      expect(prisma.board.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'board-1',
          ownerId: 'user-1',
        },
      });

      expect(prisma.board.update).toHaveBeenCalledWith({
        where: {
          id: 'board-1',
        },
        data: dto,
      });
    });

    it('does not update a board that the user does not own', async () => {
      prisma.board.findFirst.mockResolvedValue(null);

      await expect(
        service.update('user-2', 'board-1', {
          title: 'Hacked title',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.board.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes a board owned by the user', async () => {
      const board = {
        id: 'board-1',
        ownerId: 'user-1',
      };

      prisma.board.findFirst.mockResolvedValue(board);
      prisma.board.delete.mockResolvedValue(board);

      const result = await service.remove(
        'user-1',
        'board-1',
      );

      expect(result).toEqual({
        message: 'Board deleted successfully',
      });

      expect(prisma.board.delete).toHaveBeenCalledWith({
        where: {
          id: 'board-1',
        },
      });
    });

    it('does not delete a board that the user does not own', async () => {
      prisma.board.findFirst.mockResolvedValue(null);

      await expect(
        service.remove('user-2', 'board-1'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.board.delete).not.toHaveBeenCalled();
    });
  });

  describe('getBoardOrFail', () => {
    it('returns the board when it exists', async () => {
      const board = {
        id: 'board-1',
        title: 'My Board',
      };

      prisma.board.findUnique.mockResolvedValue(board);

      const result = await service.getBoardOrFail('board-1');

      expect(result).toEqual(board);

      expect(prisma.board.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'board-1',
        },
      });
    });

    it('throws NotFoundException when the board does not exist', async () => {
      prisma.board.findUnique.mockResolvedValue(null);

      await expect(
        service.getBoardOrFail('unknown-board'),
      ).rejects.toThrow('Board not found');
    });
  });

  describe('checkReadAccess', () => {
    it('allows the owner to read a private board', async () => {
      const board = {
        id: 'board-1',
        ownerId: 'user-1',
        visibility: 'PRIVATE',
      };

      prisma.board.findUnique.mockResolvedValue(board);

      await expect(
        service.checkReadAccess('board-1', 'user-1'),
      ).resolves.toEqual(board);
    });

    it('allows anyone to read a public board', async () => {
      const board = {
        id: 'board-1',
        ownerId: 'user-1',
        visibility: 'PUBLIC',
      };

      prisma.board.findUnique.mockResolvedValue(board);

      await expect(
        service.checkReadAccess('board-1'),
      ).resolves.toEqual(board);
    });

    it('rejects another user from reading a private board', async () => {
      const board = {
        id: 'board-1',
        ownerId: 'user-1',
        visibility: 'PRIVATE',
      };

      prisma.board.findUnique.mockResolvedValue(board);

      await expect(
        service.checkReadAccess('board-1', 'user-2'),
      ).rejects.toThrow(
        'You do not have permission to view this board',
      );
    });
  });

  describe('checkOwnerAccess', () => {
    it('allows the owner to access the board', async () => {
      const board = {
        id: 'board-1',
        ownerId: 'user-1',
        visibility: 'PRIVATE',
      };

      prisma.board.findUnique.mockResolvedValue(board);

      await expect(
        service.checkOwnerAccess('board-1', 'user-1'),
      ).resolves.toEqual(board);
    });

    it('rejects a different user', async () => {
      const board = {
        id: 'board-1',
        ownerId: 'user-1',
        visibility: 'PRIVATE',
      };

      prisma.board.findUnique.mockResolvedValue(board);

      await expect(
        service.checkOwnerAccess('board-1', 'user-2'),
      ).rejects.toBeInstanceOf(ForbiddenException);

      await expect(
        service.checkOwnerAccess('board-1', 'user-2'),
      ).rejects.toThrow(
        'Only the board owner can perform this action',
      );
    });
  });
});
