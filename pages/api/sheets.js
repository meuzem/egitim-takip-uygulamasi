// API Route - Neon/Postgres Only
import { neon } from '@neondatabase/serverless';

const tableMap = {
  'Eğitim Takip': 'egitim_takip',
  'Çekim Takip': 'cekim_takip',
  'Montaj Takip': 'montaj_takip'
};

const fieldMapper = {
  'dal': 'dal',
  'alan': 'alan',
  'bolum': 'bolum',
  'egitim': 'egitim',
  'egitmen': 'egitmen',
  'icerikTakip': 'icerik_takip',
  'durum': 'durum',
  'icerikBaslama': 'icerik_baslama',
  'cekimBaslama': 'cekim_baslama',
  'montajBaslama': 'montaj_baslama',
  'montajSorumlusu': 'montaj_sorumlusu',
  'yayinTarihi': 'yayin_tarihi',
  'notlar': 'notlar',
  'egitimAdi': 'egitim_adi',
  'egitmenAdi': 'egitmen_adi',
  'cekimSorumlusu': 'cekim_sorumlusu',
  'videoAdi': 'video_adi',
  'cekimTarihi': 'cekim_tarihi',
  'onCekim': 'on_cekim',
  'izlence': 'izlence',
  'isik': 'isik',
  'fotografCekimi': 'fotograf_cekimi',
  'fotografTarih': 'fotograf_tarih',
  'cekimKontrol': 'cekim_kontrol',
  'kontrolTarih': 'kontrol_tarih',
  'tasnif': 'tasnif',
  'dipSes': 'dip_ses',
  'cekimTamamlandi': 'cekim_tamamlandi',
  'synology': 'synology',
  'synologyKlasor': 'synology_klasor',
  'videKodu': 'vide_kodu',
  'cekimYapanlar': 'cekim_yapanlar',
  'icerikUzmani': 'icerik_uzmani',
  'revizeTarihi': 'revize_tarihi',
  'montajDurumu': 'montaj_durumu',
  'montajTamamlandi': 'montaj_tamamlandi',
};

function mapFieldsToDB(data) {
  const mapped = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null && value !== '') {
      const dbKey = fieldMapper[key] || key;
      mapped[dbKey] = value;
    }
  }
  return mapped;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.length === 0) {
    res.status(500).json({ 
      success: false, 
      error: "DATABASE_URL environment variable is missing!" 
    });
    return;
  }

  const sheetName = req.query.sheet || req.body?.sheetName;
  const tableName = tableMap[sheetName];

  if (!tableName) {
    res.status(400).json({ 
      success: false, 
      error: 'Invalid sheet name: ' + sheetName 
    });
    return;
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // --- GET ---
    if (req.method === 'GET') {
      // FIX: Use string concatenation instead of template literal with sql()
      const selectQuery = 'SELECT * FROM ' + tableName + ' ORDER BY id DESC';
      const result = await sql(selectQuery);
      res.status(200).json({ data: result, success: true });
      return;
    }

    // --- POST ---
    if (req.method === 'POST') {
      const { rowData } = req.body;

      if (!rowData) {
        res.status(400).json({ success: false, error: 'rowData is required' });
        return;
      }

      const mappedData = mapFieldsToDB(rowData);
      mappedData.created_at = new Date().toISOString();
      mappedData.updated_at = new Date().toISOString();

      const keys = Object.keys(mappedData);
      const vals = Object.values(mappedData);

      const columns = keys.join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

      const insertQuery = 'INSERT INTO ' + tableName + ' (' + columns + ') VALUES (' + placeholders + ') RETURNING *';
      const insertResult = await sql(insertQuery, vals);

      res.status(200).json({ 
        success: true, 
        newRow: insertResult[0], 
        message: '✅ Veri kaydedildi!' 
      });
      return;
    }

    // --- PUT ---
    if (req.method === 'PUT') {
      const { rowIndex, rowData } = req.body;

      const selectQuery = 'SELECT * FROM ' + tableName + ' ORDER BY id DESC';
      const allRecords = await sql(selectQuery);

      if (!allRecords[rowIndex]) {
        res.status(404).json({ 
          success: false, 
          error: 'Kayıt bulunamadı' 
        });
        return;
      }

      const recordId = allRecords[rowIndex].id;
      const mappedData = mapFieldsToDB(rowData);
      mappedData.updated_at = new Date().toISOString();

      const updateParts = Object.entries(mappedData).map(([key, value], i) => 
        `${key} = $${i + 1}`
      );
      const values = Object.values(mappedData);

      const updateQuery = 'UPDATE ' + tableName + ' SET ' + updateParts.join(', ') + ' WHERE id = $' + (values.length + 1) + ' RETURNING *';
      const result = await sql(updateQuery, [...values, recordId]);

      res.status(200).json({ 
        success: true, 
        data: result[0], 
        message: '✅ Güncellendi!' 
      });
      return;
    }

    // --- DELETE ---
    if (req.method === 'DELETE') {
      const { rowIndex } = req.body;

      const selectQuery = 'SELECT * FROM ' + tableName + ' ORDER BY id DESC';
      const allRecords = await sql(selectQuery);

      if (!allRecords[rowIndex]) {
        res.status(404).json({ 
          success: false, 
          error: 'Kayıt bulunamadı' 
        });
        return;
      }

      const recordId = allRecords[rowIndex].id;
      const deleteQuery = 'DELETE FROM ' + tableName + ' WHERE id = $1';
      await sql(deleteQuery, [recordId]);

      res.status(200).json({ 
        success: true, 
        message: '✅ Silindi!' 
      });
      return;
    }

    res.status(405).json({ error: 'Method not allowed: ' + req.method });

  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server error',
      details: err.toString()
    });
  }
}
