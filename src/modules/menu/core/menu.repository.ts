import { Menu } from '@api/modules/menu/core/menu.entity';

export interface FetchMenuResult {
  id: string;
  name: string;
  submenus?: FetchMenuResult[];
}

export interface IMenuRepository {
  create(entity: Menu): Promise<string>;
  delete(id: string): Promise<void>;
  fetch(): Promise<FetchMenuResult[]>;
}
