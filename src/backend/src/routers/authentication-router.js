const router = require('express').Router();
const authenticationController = require('./../controllers/authentication-controller');

router.post('/login', authenticationController.login);
router.post('/register', authenticationController.register);

module.exports = router;
