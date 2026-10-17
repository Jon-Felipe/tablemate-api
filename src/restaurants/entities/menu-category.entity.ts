import { MenuItem } from './menu-item.entity.js';

export class MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}
