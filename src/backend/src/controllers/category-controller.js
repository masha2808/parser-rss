const categoryService = require('../services/category-service');

const listCategories = async (req, res) => {
  try {
    const categoryList = await categoryService.listCategories();
    res.status(200).send(categoryList);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
}

module.exports = {
  listCategories
}