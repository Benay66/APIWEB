const { Router } = require('express');
const { getUsers, createUser, loginUser } = require('../controllers/users.controller');

const router = Router();

router.get('/users', getUsers);
router.post('/users', createUser);
router.post('/login', loginUser);

module.exports = router;