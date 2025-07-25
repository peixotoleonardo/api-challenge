import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { FetchMenuQuery } from '@api/modules/menu/core/queries/fetch-menu.query';
import { CreateMenuUseCase } from '@api/modules/menu/core/use-cases/create-menu.use-case';
import { DeleteMenuUseCase } from '@api/modules/menu/core/use-cases/delete-menu.use-case';
import { createMenuHandler, deleteMenuHandler, fetchMenuHandler } from '@api/modules/menu/adapters/http/in/menu';

describe('Menu Handlers', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = {};
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
  });

  describe('createMenuHandler', () => {
    let mockCreateMenuUseCase: jest.Mocked<CreateMenuUseCase>;

    beforeEach(() => {
      mockCreateMenuUseCase = {
        execute: jest.fn(),
      } as any;
    });

    it('should create menu successfully', async () => {
      const menuData = { name: 'Test Menu', relatedId: '123' };
      const expectedOutput = { id: '1', ...menuData };

      mockRequest.body = menuData;
      mockCreateMenuUseCase.execute.mockResolvedValue(expectedOutput);

      await createMenuHandler(mockCreateMenuUseCase)(mockRequest as Request, mockResponse as Response);

      expect(mockCreateMenuUseCase.execute).toHaveBeenCalledWith(menuData);
      expect(mockStatus).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockJson).toHaveBeenCalledWith(expectedOutput);
    });

    it('should throw error when creation fails', async () => {
      const error = new Error('Creation failed');
      mockRequest.body = { name: 'Test Menu', relatedId: '123' };
      mockCreateMenuUseCase.execute.mockRejectedValue(error);

      await expect(
        createMenuHandler(mockCreateMenuUseCase)(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('deleteMenuHandler', () => {
    let mockDeleteMenuUseCase: jest.Mocked<DeleteMenuUseCase>;

    beforeEach(() => {
      mockDeleteMenuUseCase = {
        execute: jest.fn(),
      } as any;
    });

    it('should delete menu successfully', async () => {
      mockRequest.params = { id: '123' };
      mockDeleteMenuUseCase.execute.mockResolvedValue(undefined);

      await deleteMenuHandler(mockDeleteMenuUseCase)(mockRequest as Request, mockResponse as Response);

      expect(mockDeleteMenuUseCase.execute).toHaveBeenCalledWith('123');
      expect(mockStatus).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
      expect(mockJson).toHaveBeenCalled();
    });

    it('should throw error when deletion fails', async () => {
      const error = new Error('Deletion failed');
      mockRequest.params = { id: '123' };
      mockDeleteMenuUseCase.execute.mockRejectedValue(error);

      await expect(
        deleteMenuHandler(mockDeleteMenuUseCase)(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('Deletion failed');
    });
  });

  describe('fetchMenuHandler', () => {
    let mockFetchMenuQuery: jest.Mocked<FetchMenuQuery>;

    beforeEach(() => {
      mockFetchMenuQuery = {
        execute: jest.fn(),
      } as any;
    });

    it('should fetch menus successfully', async () => {
      const expectedMenus = [
        { id: '1', name: 'Menu 1', relatedId: '123' },
        { id: '2', name: 'Menu 2', relatedId: '456' },
      ];
      mockFetchMenuQuery.execute.mockResolvedValue(expectedMenus);

      await fetchMenuHandler(mockFetchMenuQuery)(mockRequest as Request, mockResponse as Response);

      expect(mockFetchMenuQuery.execute).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockJson).toHaveBeenCalledWith(expectedMenus);
    });

    it('should throw error when fetch fails', async () => {
      const error = new Error('Fetch failed');
      mockFetchMenuQuery.execute.mockRejectedValue(error);

      await expect(
        fetchMenuHandler(mockFetchMenuQuery)(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('Fetch failed');
    });
  });
});
