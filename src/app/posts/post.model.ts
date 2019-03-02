export interface Post {
  _id?: string;

  title: string;

  content: string;

  author: {
    name: string,
    _id: string,
  };

  dateCreated: Date; // !? or string

  imageMainPath: string;

  category: {
    name: string,
    _id: string,
  };

  subcategory?: {
    name: string,
    _id: string
  };

  tags: [
    {
      _id: string,
      name: string,
    }
  ];
  popularity: number;

  comments: [];

  __v?: string;
}



