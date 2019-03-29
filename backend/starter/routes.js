const postRoutes = require('../routes/post');

const subcategoryRoutes = require('../routes/subcategory');

const categoryRoutes = require('../routes/category');

const tagRoutes = require('../routes/tag');

const userRoutes = require('../routes/user');

const error = require('../middleware/error');

module.exports = ((app) => {
  app.use('/api/posts', postRoutes);

  app.use('/api/subcategories', subcategoryRoutes);

  app.use('/api/categories', categoryRoutes);

  app.use('/api/tags', tagRoutes);

  app.use('/api/users', userRoutes);

  app.use(error);
});

