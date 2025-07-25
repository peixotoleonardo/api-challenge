import { describe, expect, it, jest, beforeEach } from '@jest/globals';

import { IMenuRepository } from '@api/modules/menu/core/menu.repository';
import { DeleteMenuUseCase } from '@api/modules/menu/core/use-cases/delete-menu.use-case';

describe('DeleteMenuUseCase', () => {
  let useCase: DeleteMenuUseCase;
  let mockRepository: jest.Mocked<IMenuRepository>;

  beforeEach(() => {
    mockRepository = {
      delete: jest.fn(),
    } as unknown as jest.Mocked<IMenuRepository>;

    useCase = new DeleteMenuUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should delete a menu successfully with valid id', async () => {
      const expectedId = 'menu-123';

      await useCase.execute(expectedId);

      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(expectedId);
    });
  });
});
