const { Router } = require('express');
const { getUsers, createUser, loginUser, getUserById, updateUserScore } = require('../controllers/users.controller');

const router = Router();

router.get('/users', getUsers);
router.post('/users', createUser);
router.post('/login', loginUser);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUserScore);

module.exports = router;