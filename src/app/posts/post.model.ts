export interface Post {
  _id: String,

  title: String,

  content: String,

  author: {
    name: String,
    _id: String
  },

  dateCreated: Date, // !? or string

  imageMainPath: String,

  category: {
    name: String,
    _id: String
  },

  subcategory?: {
    name: String,
    _id: String
  },

  tags: [
    {
      _id: String,
      name: String
    }
  ],
  popularity: number,

  comments: [String],

  __v?: String
}



