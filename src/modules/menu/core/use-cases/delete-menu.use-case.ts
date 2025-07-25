import { IMenuRepository } from '@api/modules/menu/core/menu.repository';

export class DeleteMenuUseCase {
  constructor(
    private readonly repository: IMenuRepository,
  ) {}

  execute(id: string) {
    return this.repository.delete(id);
  }
}
