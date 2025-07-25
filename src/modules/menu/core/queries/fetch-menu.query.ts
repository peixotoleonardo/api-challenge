import { IMenuRepository } from '@api/modules/menu/core/menu.repository';

export class FetchMenuQuery {
  constructor(private readonly repository: IMenuRepository) { }

  execute() {
    return this.repository.fetch();
  }
}