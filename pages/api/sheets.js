// API Route - Neon/Postgres Only
import { neon } from '@neondatabase/serverless';

const tableMap = {
  'EÄŸitim Takip': 'egitim_takip',
  'Ã‡ekim Takip': 'cekim_takip',
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
  'bitenVideoAdi': 'biten_video_adi',
  'cekimBaslamaTarihi': 'cekim_baslama_tarihi',
  'onCekim': 'on_cekim',
  'onCekimTarihi': 'on_cekim_tarihi',
  'izlence': 'izlence',
  'isikSorumlu': 'isik_sorumlu',
  'cekimDurumu': 'cekim_durumu',
  'cekimBitisTarihi': 'cekim_bitis_tarihi',
  'fotografCekimleri': 'fotograf_cekimleri',
  'fotografCekimYapan': 'fotograf_cekim_yapan',
  'fotografCekimTarihi': 'fotograf_cekim_tarihi',
  'cekimKontrolleri': 'cekim_kontrolleri',
  'cekimKontrolTarihi': 'cekim_kontrol_tarihi',
  'cekimKontrolYapan': 'cekim_kontrol_yapan',
  'tasnif': 'tasnif',
  'tasnifYapan': 'tasnif_yapan',
  'dipSesTem': 'dip_ses_tem',
  'cekim': 'cekim',
  'synology': 'synology',
  'synologyKlasor': 'synology_klasor',
  'videoKodu': 'video_kodu',
  'cekimYapanlar': 'cekim_yapanlar',
  'icerikUzmani': 'icerik_uzmani',
  'montajBaslamaTarihi': 'montaj_baslama_tarihi',
  'revize1Tarihi': 'revize1_tarihi',
  'revize2Tarihi': 'revize2_tarihi',
  'montajDurumu': 'montaj_durumu',
  'montajBitisTarihi': 'montaj_bitis_tarihi',
  'montaj': 'montaj',
};

function mapFieldsToDB(data) {
  const mapped = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      const dbKey = fieldMapper[key] || key;
      mapped[dbKey] = value;
    }
  }
  return mapped;
}

// Reverse mapper: snake_case â†’ camelCase
function mapDBToFields(dbRow) {
  const reverseMap = {};
  for (const [camelKey, snakeKey] of Object.entries(fieldMapper)) {
    reverseMap[snakeKey] = camelKey;
  }

  const mapped = {};
  for (const [key, value] of Object.entries(dbRow)) {
    const camelKey = reverseMap[key] || key;
    mapped[camelKey] = value;
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
      const selectQuery = 'SELECT * FROM ' + tableName + ' ORDER BY id DESC';
      const result = await sql(selectQuery);
      res.status(200).json({ data: result.map(mapDBToFields), success: true });
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
        message: 'âœ… Veri kaydedildi!' 
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
          error: 'KayÄ±t bulunamadÄ±' 
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
        message: 'âœ… GÃ¼ncellendi!' 
      });
      return;
    }

// 👇👇 Sadece aşağıdan yukarıya kadar yapıştır!
function toSnakeCase(obj) {
  if (!obj) return {};
  const map = {
    egitimAdi: "egitim_adi", egitmenAdi: "egitmen_adi",
    cekimSorumlusu: "cekim_sorumlusu", cekimDurumu: "cekim_durumu",
    videoAdi:"video_adi", notlar: "notlar",
    // Diğer camelCase->snake_case alanlarını ekle!
  };
  return Object.keys(obj).reduce((acc, key) =>
    ({ ...acc, [map[key] || key]: obj[key] }), {});
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  const sheetName = req.query.sheet || req.body?.sheetName;
  const tableMap = { 'Eğitim Takip':'egitim_takip', 'Çekim Takip':'cekim_takip', 'Montaj Takip':'montaj_takip' };
  const tableName = tableMap[sheetName];

  const sql = neon(process.env.DATABASE_URL);
  
  try {
    if (req.method === "GET") {
      const rows = await sql(`SELECT * FROM ${tableName} ORDER BY id DESC`);
      res.status(200).json({ data: rows, success:true }); return;
    }
    if (req.method === "POST") {
      // 👇 MAPPING İLE SNAKE CASE COLLUMNA ÇEVİR!
      let mappedData = toSnakeCase(req.body.rowData || req.body);
      // Kolon isimlerini ve değerlerini ayıkla:
      const cols = Object.keys(mappedData);
      const vals = Object.values(mappedData);
      const q = `INSERT INTO ${tableName} (${cols.join(",")}) VALUES (${vals.map((_,i)=>"$"+(i+1)).join(",")}) RETURNING *`;
      const inserted = await sql(q, vals);
      res.status(200).json({ newRow:inserted[0], success:true }); return;
    }
    if (req.method === "PUT") {
      const { rowIndex, rowData } = req.body;
      let mappedData = toSnakeCase(rowData);
      const cols = Object.keys(mappedData);
      const sets = cols.map((c,i)=>`${c}=$${i+1}`).join(",");
      // Güncellenecek satırı bulmak için önce id alın.
      const rows = await sql(`SELECT id FROM ${tableName} ORDER BY id DESC`);
      const id = rows[rowIndex].id;
      const q = `UPDATE ${tableName} SET ${sets} WHERE id=$${cols.length+1} RETURNING *`;
      const updated = await sql(q, [...Object.values(mappedData), id]);
      res.status(200).json({ updated:updated[0], success:true }); return;
    }
    if (req.method === "DELETE") {
      const { rowIndex } = req.body;
      const rows = await sql(`SELECT id FROM ${tableName} ORDER BY id DESC`);
      const recId = rows[rowIndex].id;
      await sql(`DELETE FROM ${tableName} WHERE id=$1`, [recId]);
      res.status(200).json({ success:true }); return;
    }
    res.status(405).json({error:"Method not allowed"});
  } catch(e) {
    res.status(500).json({ success:false, error:String(e), details:String(e) });
  }
}


    
    // --- DELETE ---
    if (req.method === 'DELETE') {
      const { rowIndex } = req.body;

      const selectQuery = 'SELECT * FROM ' + tableName + ' ORDER BY id DESC';
      const allRecords = await sql(selectQuery);

      if (!allRecords[rowIndex]) {
        res.status(404).json({ 
          success: false, 
          error: 'KayÄ±t bulunamadÄ±' 
        });
        return;
      }

      const recordId = allRecords[rowIndex].id;
      const deleteQuery = 'DELETE FROM ' + tableName + ' WHERE id = $1';
      await sql(deleteQuery, [recordId]);

      res.status(200).json({ 
        success: true, 
        message: 'â\… Silindi!' 
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
