const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Permite que nuestro servidor entienda datos en formato JSON

// Servir archivos estáticos desde el directorio padre
app.use(express.static(path.join(__dirname, '..')));

// Configuración de la conexión a MySQL usando los datos de tu .env
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar la conexión con la base de datos al iniciar
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos MySQL:', err.message);
    console.log('Asegúrate de que tu servidor MySQL (XAMPP/WAMP) esté encendido y que el nombre de la base de datos sea correcto.');
  } else {
    console.log('✅ Conexión exitosa a la base de datos MySQL!');
    connection.release();
  }
});

// 1. OBTENER TODOS LOS LIBROS (READ)
app.get('/api/books', (req, res) => {
  db.query('SELECT * FROM books ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. CREAR UN NUEVO LIBRO (CREATE)
app.post('/api/books', (req, res) => {
  const { title, author, genre, status, cover, description } = req.body;
  const query = 'INSERT INTO books (title, author, genre, status, cover, description) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(query, [title, author, genre, status, cover, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, message: 'Libro guardado con éxito' });
  });
});

// 3. EDITAR UN LIBRO (UPDATE)
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, genre, status, cover, description } = req.body;
  const query = 'UPDATE books SET title = ?, author = ?, genre = ?, status = ?, cover = ?, description = ? WHERE id = ?';

  db.query(query, [title, author, genre, status, cover, description, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Libro actualizado con éxito' });
  });
});

// 4. ELIMINAR UN LIBRO (DELETE)
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM books WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Libro eliminado con éxito' });
  });
});

// Servir index.html para la raíz y rutas no capturadas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
});

