import { Express, Router } from 'express';
import asyncHandler from 'express-async-handler';

import { FetchMenuQuery } from '@api/modules/menu/core/queries/fetch-menu.query';
import { CreateMenuUseCase } from '@api/modules/menu/core/use-cases/create-menu.use-case';
import { DeleteMenuUseCase } from '@api/modules/menu/core/use-cases/delete-menu.use-case';

import { validateIdParam } from '@api/modules/common/validations/id.param';

import { MenuMongoRepository } from '@api/modules/menu/adapters/mongo/menu.repository';
import { createMenuValidation } from '@api/modules/menu/adapters/http/validation/create-menu.validation';
import { createMenuHandler, deleteMenuHandler, fetchMenuHandler } from '@api/modules/menu/adapters/http/in';

export class MenuModule {
  static register(app: Express) {
    const router = Router();

    const repository = new MenuMongoRepository();

    const menuCreationPipeline = [asyncHandler(createMenuValidation), asyncHandler(createMenuHandler(new CreateMenuUseCase(repository)))];
    const menuDeletionPipeline = [validateIdParam, asyncHandler(deleteMenuHandler(new DeleteMenuUseCase(repository)))];

    router
      .post('/', ...menuCreationPipeline)
      .delete('/:id', ...menuDeletionPipeline)
      .get('/', asyncHandler(fetchMenuHandler(new FetchMenuQuery(repository))));

    app.use('/api/v1/menu', router);
  }
}