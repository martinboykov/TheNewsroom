const { Post } = require('../../models/post');

// GET
const getPosts = async (req, res, next) => {
  const pageSize = parseInt(req.query.pageSize, 10);
  const currentPage = parseInt(req.query.page, 10);
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  const posts = await postQuery
    .select('_id title content category dateCreated author imageMainPath')
    .sort({ 'dateCreated': -1 });

  posts.map((post) => {
    let content = post.content;
    // for eventual HTML post document
    // --------------------------------
    // const el = document.createElement('html');
    // el.innerHTML = content;
    // el.querySelector('.first-paragraph'); // Live NodeList of your anchor elements

    content = content.substring(0, 200); // for now...
    post.content = content;
    // console.log(post);
    return post;
  });
  res.status(200).json({
    message: 'Posts fetched successfully',
    data: posts,
  });
};

const getTotalCount = async (req, res, next) => {
  const postsCount = await Post.countDocuments();
  console.log(postsCount);
  res.status(200).json({
    message: 'Total posts count fetched successfully',
    data: postsCount,
  });
};

const getPost = async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params._id });
  if (!post) return res.status(400).json({ message: 'No such post.' });
  return res.status(200).json({
    message: `Post with _id: ${post._id} fetched successfully`,
    data: post,
  });
};

module.exports = {
  getPosts,
  getTotalCount,
  getPost,
};
