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
    // Skip undefined, null, and empty string values
    if (value !== undefined && value !== null && value !== '') {
      const dbKey = fieldMapper[key] || key;
      mapped[dbKey] = value;
    }
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

        // Build dynamic INSERT query using Neon's tagged template
        const columnList = sql.join(
          columns.map(col => sql.identifier([col])),
          sql`, `
        );

        const valuePlaceholders = sql.join(
          values.map(val => sql`${val}`),
          sql`, `
        );

        const insertResult = await sql`
          INSERT INTO ${sql(tableName)} (${columnList})
          VALUES (${valuePlaceholders})
          RETURNING *
        `;
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