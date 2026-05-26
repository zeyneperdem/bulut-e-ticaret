const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',         
  host: process.env.DB_HOST,                     
  database: process.env.DB_NAME || 'postgres',     
  password: process.env.DB_PASSWORD,              
  port: process.env.DB_PORT || 5432,               
  
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('AWS RDS PostgreSQL veritabanına SSL ile başarıyla bağlanıldı.');
});

pool.on('error', (err) => {
  console.error('Veritabanı havuzunda beklenmedik bir hata oluştu:', err);
});

module.exports = pool;
