export interface Subcategory {
  _id?: string;
  name: string;
  category?: string;
  posts?: string[];
  order: number;
  isVisible: boolean;
}
