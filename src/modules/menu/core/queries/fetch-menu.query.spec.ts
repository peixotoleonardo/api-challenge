import { describe, expect, it, jest, beforeEach } from '@jest/globals';

import { IMenuRepository } from '@api/modules/menu/core/menu.repository';
import { FetchMenuQuery } from '@api/modules/menu/core/queries/fetch-menu.query';

describe('FetchMenuQuery', () => {
  let query: FetchMenuQuery;
  let mockRepository: jest.Mocked<IMenuRepository>;

  beforeEach(() => {
    mockRepository = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<IMenuRepository>;

    query = new FetchMenuQuery(mockRepository);
  });

  describe('execute', () => {
    it('should fetch the menu successfully', async () => {
      mockRepository.fetch.mockResolvedValue([]);

      const result = await query.execute();

      expect(result).toEqual([]);
      expect(mockRepository.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
