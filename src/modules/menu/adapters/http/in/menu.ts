import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { FetchMenuQuery } from '@api/modules/menu/core/queries/fetch-menu.query';
import { CreateMenuUseCase } from '@api/modules/menu/core/use-cases/create-menu.use-case';
import { DeleteMenuUseCase } from '@api/modules/menu/core/use-cases/delete-menu.use-case';

export const createMenuHandler =
  (useCase: CreateMenuUseCase) =>
  async (request: Request, response: Response): Promise<void> => {
    const output = await useCase.execute({
      name: request.body.name,
      relatedId: request.body.relatedId,
    });

    response.status(StatusCodes.CREATED).json(output);
  };

export const deleteMenuHandler =
  (useCase: DeleteMenuUseCase) =>
  async (request: Request, response: Response) => {
    await useCase.execute(request.params.id);

    response.status(StatusCodes.NO_CONTENT).json();
  };

export const fetchMenuHandler =
  (query: FetchMenuQuery) => async (_: Request, response: Response) => {
    response.status(StatusCodes.OK).json(await query.execute());
  };
