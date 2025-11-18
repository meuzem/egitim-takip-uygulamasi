// API Route - Neon PostgreSQL (Vercel Compatible with Field Mapper)
import { neon } from '@neondatabase/serverless';

// Global fallback storage
if (!global.storage) {
  global.storage = {
    'Eğitim Takip': [],
    'Çekim Takip': [],
    'Montaj Takip': []
  };
}

// Table name mapping
const tableMap = {
  'Eğitim Takip': 'egitim_takip',
  'Çekim Takip': 'cekim_takip',
  'Montaj Takip': 'montaj_takip'
};

// Field name mapping: camelCase → snake_case
const fieldMapper = {
  'iceriktakip': 'icerik_takip',
  'icerikTakip': 'icerik_takip',
  'icerikBaslama': 'icerik_baslama',
  'cekimBaslama': 'cekim_baslama',
  'montajBaslama': 'montaj_baslama',
  'montajSorumlusu': 'montaj_sorumlusu',
  'yayinTarihi': 'yayin_tarihi',
  'egitmen': 'egitmen',
  'egitmenAdi': 'egitmen_adi',
  'cekimSorumlusu': 'cekim_sorumlusu',
  'montajSorumlusu': 'montaj_sorumlusu',
  'videoAdi': 'video_adi',
  'cekimTarihi': 'cekim_tarihi',
  'onCekim': 'on_cekim',
  'fotografCekimi': 'fotograf_cekimi',
  'fotografTarih': 'fotograf_tarih',
  'cekimKontrol': 'cekim_kontrol',
  'kontrolTarih': 'kontrol_tarih',
  'dipSes': 'dip_ses',
  'cekimTamamlandi': 'cekim_tamamlandi',
  'synologyKlasor': 'synology_klasor',
  'videKodu': 'vide_kodu',
  'cekimYapanlar': 'cekim_yapanlar',
  'egitimAdi': 'egitim_adi',
  'icerikUzmani': 'icerik_uzmani',
  'revizeTarihi': 'revize_tarihi',
  'montajDurumu': 'montaj_durumu',
  'montajTamamlandi': 'montaj_tamamlandi',
};

// Convert frontend field names to database field names
function mapFieldsToDB(data) {
  const mapped = {};
  for (const [key, value] of Object.entries(data)) {
    const dbKey = fieldMapper[key] || key;
    mapped[dbKey] = value;
  }
  return mapped;
}

// Disable body parser size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const sheetName = req.query.sheet || req.body?.sheetName;
    const tableName = tableMap[sheetName];

    if (!tableName) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid sheet name: ' + sheetName 
      });
      return;
    }

    // Check DATABASE_URL
    const hasDatabase = process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0;

    if (!hasDatabase) {
      console.warn('⚠️ DATABASE_URL not set');
      handleFallback(req, res, sheetName);
      return;
    }

    const sql = neon(process.env.DATABASE_URL);

    // GET
    if (req.method === 'GET') {
      try {
        const result = await sql`SELECT * FROM ${sql(tableName)} ORDER BY id DESC`;
        res.status(200).json({ 
          data: result, 
          success: true,
          source: 'neon'
        });
        return;
      } catch (dbError) {
        console.error('Database error:', dbError);
        handleFallback(req, res, sheetName);
        return;
      }
    }

    // POST
    if (req.method === 'POST') {
      try {
        const { rowData } = req.body;

        if (!rowData) {
          res.status(400).json({ error: 'rowData is required' });
          return;
        }

        // Map frontend fields to database fields
        const mappedData = mapFieldsToDB(rowData);

        const columns = Object.keys(mappedData);
        const values = Object.values(mappedData);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        const insertQuery = `
          INSERT INTO ${tableName} (${columns.join(', ')})
          VALUES (${placeholders})
          RETURNING *
        `;

        const insertResult = await sql(insertQuery, values);
        const allData = await sql`SELECT * FROM ${sql(tableName)} ORDER BY id DESC`;

        res.status(200).json({ 
          success: true, 
          data: allData,
          newRow: insertResult[0],
          source: 'neon',
          message: '✅ Veri kaydedildi!'
        });
        return;
      } catch (dbError) {
        console.error('Insert error:', dbError);
        res.status(500).json({ 
          success: false, 
          error: dbError.message
        });
        return;
      }
    }

    // PUT
    if (req.method === 'PUT') {
      try {
        const { rowIndex, rowData } = req.body;

        const allRecords = await sql`SELECT * FROM ${sql(tableName)} ORDER BY id DESC`;

        if (!allRecords[rowIndex]) {
          res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
          return;
        }

        const recordId = allRecords[rowIndex].id;
        
        // Map frontend fields to database fields
        const mappedData = mapFieldsToDB(rowData);
        
        const updateParts = Object.entries(mappedData).map(([key, value], i) => `${key} = $${i + 1}`);
        const values = Object.values(mappedData);

        const updateQuery = `
          UPDATE ${tableName}
          SET ${updateParts.join(', ')}
          WHERE id = $${values.length + 1}
          RETURNING *
        `;

        const result = await sql(updateQuery, [...values, recordId]);

        res.status(200).json({ 
          success: true,
          data: result[0],
          source: 'neon',
          message: '✅ Güncellendi!'
        });
        return;
      } catch (dbError) {
        console.error('Update error:', dbError);
        res.status(500).json({ 
          success: false, 
          error: dbError.message 
        });
        return;
      }
    }

    // DELETE
    if (req.method === 'DELETE') {
      try {
        const { rowIndex } = req.body;

        const allRecords = await sql`SELECT * FROM ${sql(tableName)} ORDER BY id DESC`;

        if (!allRecords[rowIndex]) {
          res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
          return;
        }

        const recordId = allRecords[rowIndex].id;

        await sql`DELETE FROM ${sql(tableName)} WHERE id = ${recordId}`;
        const remainingData = await sql`SELECT * FROM ${sql(tableName)} ORDER BY id DESC`;

        res.status(200).json({ 
          success: true,
          data: remainingData,
          source: 'neon',
          message: '✅ Silindi!'
        });
        return;
      } catch (dbError) {
        console.error('Delete error:', dbError);
        res.status(500).json({ 
          success: false, 
          error: dbError.message 
        });
        return;
      }
    }

    res.status(405).json({ error: 'Method not allowed: ' + req.method });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Server error'
    });
  }
}

// Fallback handler
function handleFallback(req, res, sheetName) {
  const method = req.method;

  if (method === 'GET') {
    const data = global.storage[sheetName] || [];
    res.status(200).json({ 
      data, 
      success: true, 
      source: 'fallback'
    });
    return;
  }

  if (method === 'POST') {
    const { rowData } = req.body;
    if (!global.storage[sheetName]) global.storage[sheetName] = [];
    const newRow = { ...rowData, id: Date.now() };
    global.storage[sheetName].push(newRow);
    res.status(200).json({ 
      success: true, 
      data: global.storage[sheetName],
      newRow,
      source: 'fallback',
      message: '⚠️ Geçici bellekte kaydedildi'
    });
    return;
  }

  if (method === 'PUT') {
    const { rowIndex, rowData } = req.body;
    if (global.storage[sheetName]?.[rowIndex]) {
      const id = global.storage[sheetName][rowIndex].id;
      global.storage[sheetName][rowIndex] = { ...rowData, id };
      res.status(200).json({ 
        success: true, 
        source: 'fallback' 
      });
      return;
    }
    res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
    return;
  }

  if (method === 'DELETE') {
    const { rowIndex } = req.body;
    if (global.storage[sheetName]) {
      global.storage[sheetName].splice(rowIndex, 1);
      res.status(200).json({ 
        success: true,
        data: global.storage[sheetName],
        source: 'fallback' 
      });
      return;
    }
    res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
