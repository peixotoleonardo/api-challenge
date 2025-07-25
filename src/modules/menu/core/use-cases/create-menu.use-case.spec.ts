import { describe, expect, it, jest, beforeEach } from '@jest/globals';

import { IMenuRepository } from '@api/modules/menu/core/menu.repository';
import { CreateMenuInput, CreateMenuUseCase } from '@api/modules/menu/core/use-cases/create-menu.use-case';

describe('CreateMenuUseCase', () => {
  let useCase: CreateMenuUseCase;
  let mockRepository: jest.Mocked<IMenuRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<IMenuRepository>;

    useCase = new CreateMenuUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should create a menu successfully with valid input', async () => {
      const expectedId = 'menu-123';
      const input: CreateMenuInput = {
        name: 'Test Menu',
      };
      mockRepository.create.mockResolvedValue(expectedId);

      const result = await useCase.execute(input);

      expect(result).toEqual({ id: expectedId });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({ props: { name: 'Test Menu' } }));
    });
  });
});
