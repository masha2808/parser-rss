const router = require('express').Router();
const postRouter = require('./post-router');
const categoryRouter = require('./category-router');
const authenticationRouter = require('./authentication-router');

router.use('/post', postRouter);
router.use('/category', categoryRouter);
router.use('/authentication', authenticationRouter);

module.exports = router;