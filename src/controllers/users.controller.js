const { getConnection, sql } = require('../database/connection');

const crypto = require('crypto');

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
}

function verifyPassword(password, storedHash) {
    const [salt, key] = storedHash.split(':');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');
    return crypto.timingSafeEqual(derivedKey, keyBuffer);
}
const getUsers = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Users');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const pool = await getConnection();
	const passwordSegura = hashPassword(password);
        await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, passwordSegura)
            .query('INSERT INTO Users (username, password) VALUES (@username, @password)');
        res.json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE username = @username');
        
        if (result.recordset.length > 0) {
	    const user = result.recordset[0];
	    const esValida = verifyPassword(password, user.password);
            if (esValida) {
                res.json({ message: 'Login exitoso', success: true, id: user.id});
            } else {
                res.status(401).json({ message: 'Contraseña incorrecta', success: false });
            }
        } else {
            res.status(404).json({ message: 'Usuario no encontrado', success: false });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Users WHERE id = @id');
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateUserScore = async (req, res) => {
    const { id } = req.params;
    const { points } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('points', sql.Int, points)
            .query('UPDATE Users SET points = points + @points WHERE id = @id'); 
        
        res.json({ message: 'Puntaje actualizado exitosamente', success: true });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


module.exports = {
    getUsers,
    createUser,
    loginUser,
    getUserById,
    updateUserScore
};
