const postRoutes = require('../routes/post');

const subcategoryController = require('../routes/subcategory');

const categoryController = require('../routes/category');

const tagController = require('../routes/tag');

const error = require('../middleware/error');

module.exports = ((app) => {
  app.use('/api/posts', postRoutes);
  app.use('/api/subcategories', subcategoryController);

  app.use('/api/categories', categoryController);

  app.use('/api/tags', tagController);

  app.use(error);
});

