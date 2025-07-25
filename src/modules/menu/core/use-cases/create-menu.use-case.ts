import { Menu } from '@api/modules/menu/core/menu.entity';
import { IMenuRepository } from '@api/modules/menu/core/menu.repository';

export interface CreateMenuInput {
  name: string;
  relatedId?: string;
}

export interface CreatedMenuOutput {
  id: string;
}

export class CreateMenuUseCase {
  constructor(private readonly repository: IMenuRepository) { }

  async execute(input: Readonly<CreateMenuInput>): Promise<CreatedMenuOutput> {
    const entity = Menu.create({ name: input.name, relatedId: input.relatedId });

    return {
      id: await this.repository.create(entity),
    };
  }
}
