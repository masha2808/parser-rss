const router = require('express').Router();
const categoryController = require('./../controllers/category-controller');
const { authenticationMiddleware } = require('../middlewares/authentication-middleware');

router.get('/', authenticationMiddleware, categoryController.listCategories);

module.exports = router;
