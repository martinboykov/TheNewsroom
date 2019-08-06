export interface Comment {
  _id?: string;

  content: string;

  author: {
    _id: string,
    name: string,
    avatar: string,
  };

  dateCreated?: Date;

  postId: string;
}



