const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

let schemaAttempts = 0;
async function ensureSchemaWithRetry() {
    schemaAttempts += 1;
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT now()
        );`);
        console.log('Database schema ensured. Attempts:', schemaAttempts);
    } catch (err) {
        const delayMs = Math.min(5000, 1000 + schemaAttempts * 500);
        console.error(`Schema creation attempt ${schemaAttempts} failed (${err.code || err.message}). Retrying in ${delayMs}ms`);
        setTimeout(ensureSchemaWithRetry, delayMs);
    }
}
ensureSchemaWithRetry();

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
        return res.status(400).json({ ok: false, error: 'Missing required fields.' });
    }
    try {
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
            [name, email, hash]
        );
        res.json({ ok: true, user: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ ok: false, error: 'Email already registered.' });
        }
        console.error('Registration error', err);
        res.status(500).json({ ok: false, error: 'Internal server error.' });
    }
});

app.get('/api/users', async (_req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 100');
        res.json({ ok: true, users: result.rows });
    } catch (err) {
        console.error('List users error', err);
        res.status(500).json({ ok: false, error: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`Aplicação rodando em http://localhost:${port}`)
})