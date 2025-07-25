import { Menu } from '@api/modules/menu/core/menu.entity';
import { FetchMenuResult, IMenuRepository } from '@api/modules/menu/core/menu.repository';

import { IMenuDocument, MenuDocument } from '@api/modules/menu/adapters/mongo/menu.document';

export class MenuMongoRepository implements IMenuRepository {
  async create(entity: Menu): Promise<string> {
    const { id } = await MenuDocument.create({
      name: entity.name,
      related_id: entity.relatedId,
    });

    return id;
  }

  async delete(id: string): Promise<void> {
    await MenuDocument.deleteMany({
      $or: [
        { _id: id },
        { related_id: id }
      ]
    });
  }

  async fetch(): Promise<FetchMenuResult[]> {
    const documents = await MenuDocument.find();

    const allMenus = documents
    const mainMenus = documents.filter(document => !document.related_id);

    const buildMenuTree = (parentId: string): any[] => {
      const children = allMenus.filter(menu => menu.related_id && menu.related_id.toString() === parentId);

      return children.map((child: IMenuDocument) => {
        const submenus = buildMenuTree(child._id.toString());

        return {
          id: child._id.toString(),
          name: child.name,
          ...(submenus.length ? { submenus } : {})
        };
      });
    };
    
    return mainMenus.map(menu => {
      const submenus = buildMenuTree(menu._id.toString());

      return {
        id: menu._id.toString(),
        name: menu.name,
        ...(submenus.length ? { submenus } : {}),
      };
    });
  }
}