import { Menu } from '@api/modules/menu/core/menu.entity';
import { MenuDocument } from '@api/modules/menu/adapters/mongo/menu.document';
import { MenuMongoRepository } from '@api/modules/menu/adapters/mongo/menu.repository';

jest.mock('@api/modules/menu/adapters/mongo/menu.document');

describe('MenuMongoRepository', () => {
  let repository: MenuMongoRepository;

  beforeEach(() => {
    repository = new MenuMongoRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a menu and return its id', async () => {
      const menu = Menu.create({ name: 'Test Menu', relatedId: '123' });
      const mockedId = 'created-id';

      (MenuDocument.create as jest.Mock).mockResolvedValueOnce({
        id: mockedId,
      });

      const result = await repository.create(menu);

      expect(result).toBe(mockedId);
      expect(MenuDocument.create).toHaveBeenCalledWith({
        name: menu.name,
        related_id: menu.relatedId,
      });
    });
  });

  describe('delete', () => {
    it('should delete menus by id or related_id', async () => {
      const menuId = 'menu-id';

      (MenuDocument.deleteMany as jest.Mock).mockResolvedValueOnce({
        acknowledged: true,
      });

      await repository.delete(menuId);

      expect(MenuDocument.deleteMany).toHaveBeenCalledWith({
        $or: [{ _id: menuId }, { related_id: menuId }],
      });
    });
  });

  describe('fetch', () => {
    it('should return empty array when no menus exist', async () => {
      (MenuDocument.aggregate as jest.Mock).mockResolvedValueOnce([]);

      const result = await repository.fetch();

      expect(result).toEqual([]);
      expect(MenuDocument.aggregate).toHaveBeenCalled();
    });

    it('should return structured menu tree', async () => {
      const mockMenus = [
        { id: '1', name: 'Menu 1', submenus: [{ id: '2', name: 'Submenu 1' }, { id: '3', name: 'Submenu 2' }] },
      ];

      (MenuDocument.aggregate as jest.Mock).mockResolvedValueOnce(mockMenus);

      const result = await repository.fetch();

      expect(result).toEqual([
        {
          id: '1',
          name: 'Menu 1',
          submenus: [
            { id: '2', name: 'Submenu 1' },
            { id: '3', name: 'Submenu 2' },
          ],
        },
      ]);

      expect(MenuDocument.aggregate).toHaveBeenNthCalledWith(1, [{
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
                  .map(item => {
                    const submenus = buildTree(item._id)

                    const result = {
                      id: item._id,
                      name: item.name,
                    }

                    if (submenus.length) {
                      result.submenus = submenus
                    }

                    return result
                  })
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
    });
  });
});
