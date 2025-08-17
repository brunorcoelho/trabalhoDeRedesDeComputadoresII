const express = require('express');
const { Pool } = require('pg');
// Load environment variables from .env
require('dotenv').config();

const app = express()
const port = 3000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

app.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        res.send('<h1>Conexão com o banco de dados PostgreSQL realizada com sucesso.</h1>');
        client.release();
    }
    catch (err) {
        res.status(500).send('<h1>Conexão com o banco de dados PostgreSQL mal-sucedida. Erro: </h1><pre>' + err.stack)
    }
})

app.listen(port, () => {
    console.log(`Aplicação rodando em http://localhost:${port}`)
})