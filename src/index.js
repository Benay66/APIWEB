const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const indexRoutes = require('./routes/index.routes');
const userRoutes = require('./routes/users.routes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(indexRoutes);
app.use(userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});