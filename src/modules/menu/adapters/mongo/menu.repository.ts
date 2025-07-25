import { Menu } from '@api/modules/menu/core/menu.entity';
import {
  FetchMenuResult,
  IMenuRepository,
} from '@api/modules/menu/core/menu.repository';

import { MenuDocument } from '@api/modules/menu/adapters/mongo/menu.document';
import { NameAlreadyExistsError } from '@api/modules/menu/core/error/name-already-exists.error';

const DUPLICATE_ERROR_CODE = 11000;

export class MenuMongoRepository implements IMenuRepository {
  async create(entity: Menu): Promise<string> {
    try {
      const { id } = await MenuDocument.create({
        name: entity.name,
        related_id: entity.relatedId,
      });

      return id;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).code === DUPLICATE_ERROR_CODE) {
        throw new NameAlreadyExistsError(entity.name);
      }

      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await MenuDocument.deleteMany({
      $or: [{ _id: id }, { related_id: id }],
    });
  }

  async fetch(): Promise<FetchMenuResult[]> {
    return MenuDocument.aggregate([
      {
        $match: {
          related_id: null,
        },
      },
      {
        $graphLookup: {
          from: 'menus',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'related_id',
          as: 'submenus',
          depthField: 'level',
        },
      },
      {
        $addFields: {
          submenus: {
            $function: {
              body: `function(root, items) {
              const buildTree = (parentId) => {
                return items
                  .filter(item => item.related_id && item.related_id.toString() === parentId.toString())
                  .map(item => ({
                    id: item._id,
                    name: item.name,
                    submenus: buildTree(item._id)
                  }))
                  .filter(item => item !== null);
              };
              
              return buildTree(root);
            }`,
              args: ['$_id', '$submenus'],
              lang: 'js',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          name: 1,
          submenus: {
            $cond: {
              if: { $gt: [{ $size: '$submenus' }, 0] },
              then: '$submenus',
              else: '$$REMOVE',
            },
          },
        },
      },
    ]);
  }
}
