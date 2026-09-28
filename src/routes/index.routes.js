const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.send('Bienvenido a la REST-API');
});

router.get('/marco', (req, res) => {
    res.send('Polo!');
});

router.get('/ping', (req, res) => {
    res.json({ status: 'pong' });
});

module.exports = router;