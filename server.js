const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function tabloyuVeVerileriHazirla() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS urunler (
        id SERIAL PRIMARY KEY,
        isim VARCHAR(100) NOT NULL,
        fiyat NUMERIC(10, 2) NOT NULL
      );
    `);
    
    const urunKontrol = await pool.query('SELECT COUNT(*) FROM urunler');
    if (parseInt(urunKontrol.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO urunler (isim, fiyat) VALUES 
        ('Kablosuz Kulaklık', 1250.00),
        ('Akıllı Saat', 2500.00),
        ('Oyuncu Mouse', 600.00);
      `);
      console.log('Sistem İlk Kurulum: Örnek e-ticaret ürünleri RDS veritabanına eklendi.');
    }
  } catch (err) {
    console.error('Tablo kurulum aşamasında bir hata meydana geldi:', err);
  }
}

tabloyuVeVerileriHazirla();

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM urunler ORDER BY id');
    
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bulut Mağazası - AWS Cloud Project</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
            .container { max-width: 1000px; margin: 0 auto; }
            header { text-align: center; padding: 20px 0; margin-bottom: 30px; border-bottom: 2px solid #e1e8ed; }
            header h1 { margin: 0; color: #2c3e50; font-size: 2.5rem; }
            header p { color: #7f8c8d; margin-top: 5px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; }
            .card { background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 20px; text-align: center; transition: transform 0.2s; border: 1px solid #e1e8ed; }
            .card:hover { transform: translateY(-5px); }
            .icon { font-size: 3rem; margin-bottom: 15px; }
            .title { font-size: 1.3rem; font-weight: bold; color: #2c3e50; margin: 10px 0; }
            .price { font-size: 1.5rem; color: #27ae60; font-weight: bold; margin: 15px 0; }
            .btn { background-color: #3498db; color: white; border: none; padding: 10px 20px; font-size: 1rem; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold; transition: background 0.2s; }
            .btn:hover { background-color: #2980b9; }
            footer { text-align: center; margin-top: 40px; padding: 20px; color: #bdc3c7; font-size: 0.9rem; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>🛍️ Bulut Mağazası</h1>
                <p>AWS Load Balancer & RDS PostgreSQL ile Canlıda Ölçeklenebilir Mimari</p>
            </header>
            <div class="grid">
    `;

    result.rows.forEach(urun => {
      let icon = "📦"; // Varsayılan ikon
      if(urun.isim.includes("Kulaklık")) icon = "🎧";
      if(urun.isim.includes("Saat")) icon = "⌚";
      if(urun.isim.includes("Mouse")) icon = "🖱️";

      htmlContent += `
        <div class="card">
            <div class="icon">${icon}</div>
            <div class="title">${urun.isim}</div>
            <div class="price">${parseFloat(urun.fiyat).toLocaleString('tr-TR')} TL</div>
            <button class="btn">Sepete Ekle</button>
        </div>
      `;
    });

    htmlContent += `
            </div>
            <footer>
                © 2026 AWS Cloud Mimari Projesi - Tüm Hakları Saklıdır.
            </footer>
        </div>
    </body>
    </html>
    `;

    res.send(htmlContent);
  } catch (err) {
    console.error('Ana sayfa yüklenirken hata:', err);
    res.status(500).send('Veritabanı bağlantısında veya veri çekme aşamasında bir hata oluştu.');
  }
});


app.get('/urunler', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM urunler ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('API endpoint hatası:', err);
    res.status(500).json({ error: 'Veri tabanından veri çekme işlemi başarısız oldu.' });
  }
});

app.listen(PORT, () => {
  console.log(`E-Ticaret backend uygulaması ${PORT} portu üzerinde kararlı olarak çalışıyor.`);
});
