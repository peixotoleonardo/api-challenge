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

      (MenuDocument.create as jest.Mock).mockResolvedValueOnce({ id: mockedId });

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

      (MenuDocument.deleteMany as jest.Mock).mockResolvedValueOnce({ acknowledged: true });

      await repository.delete(menuId);

      expect(MenuDocument.deleteMany).toHaveBeenCalledWith({
        $or: [
          { _id: menuId },
          { related_id: menuId }
        ]
      });
    });
  });

  describe('fetch', () => {
    it('should return empty array when no menus exist', async () => {
      (MenuDocument.find as jest.Mock).mockResolvedValueOnce([]);

      const result = await repository.fetch();

      expect(result).toEqual([]);
      expect(MenuDocument.find).toHaveBeenCalled();
    });

    it('should return structured menu tree', async () => {
      const mockMenus = [
        { _id: '1', name: 'Menu 1', related_id: null },
        { _id: '2', name: 'Submenu 1', related_id: '1' },
        { _id: '3', name: 'Submenu 2', related_id: '1' },
        { _id: '4', name: 'Menu 2', related_id: null },
      ].map(menu => ({
        ...menu,
        _id: { toString: () => menu._id },
        related_id: menu.related_id ? { toString: () => menu.related_id } : null,
      }));

      (MenuDocument.find as jest.Mock).mockResolvedValueOnce(mockMenus);

      const result = await repository.fetch();

      expect(result).toEqual([
        {
          id: '1',
          name: 'Menu 1',
          submenus: [
            { id: '2', name: 'Submenu 1' },
            { id: '3', name: 'Submenu 2' }
          ]
        },
        {
          id: '4',
          name: 'Menu 2'
        }
      ]);
      expect(MenuDocument.find).toHaveBeenCalled();
    });
  });
});
