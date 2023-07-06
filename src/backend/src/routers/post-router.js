const router = require('express').Router();
const postController = require('./../controllers/post-controller');
const { authenticationMiddleware } = require('../middlewares/authentication-middleware');

router.post('/', authenticationMiddleware, postController.createPost);
router.put('/:id', authenticationMiddleware, postController.updatePost);
router.delete('/:id', authenticationMiddleware, postController.deletePost);
router.get('/', authenticationMiddleware, postController.listPosts);

module.exports = router;
