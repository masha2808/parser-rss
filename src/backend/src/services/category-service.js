const Category = require('../models/category-model');

const listCategories = async () => {
  const categoryList = await Category.findAll({ order: [[ 'categoryName', 'ASC' ]] });
  return {
    categoryList
  };
}

module.exports = {
  listCategories,
};