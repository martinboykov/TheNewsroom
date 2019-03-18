import { Subcategory } from './subcategory.model';

export interface Category {
  _id?: string;
  name: string;
  subcategories?: Subcategory[];
  posts?: string[];
  order: number;
  isVisible: boolean;
}
