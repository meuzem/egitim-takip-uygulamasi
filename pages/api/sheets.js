// API Route - Neon PostgreSQL (FIXED for Vercel)
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

export default async function handler(req, res) {
  // CORS headers - MUST be first
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const sheetName = req.query.sheet || req.body?.sheetName;
    const tableName = tableMap[sheetName];

    if (!tableName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid sheet name: ' + sheetName 
      });
    }

    // Check if DATABASE_URL exists
    const hasDatabase = process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0;

    if (!hasDatabase) {
      console.warn('⚠️ DATABASE_URL not set, using fallback');
      return handleFallback(req, res, sheetName);
    }

    const sql = neon(process.env.DATABASE_URL);

    // GET - Read data
    if (req.method === 'GET') {
      try {
        const query = `SELECT * FROM ${tableName} ORDER BY id DESC`;
        const result = await sql(query);

        return res.status(200).json({ 
          data: result, 
          success: true,
          source: 'neon'
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return handleFallback(req, res, sheetName);
      }
    }

    // POST - Create data
    if (req.method === 'POST') {
      try {
        const { rowData } = req.body;

        if (!rowData) {
          return res.status(400).json({ error: 'rowData is required' });
        }

        // Get column names and values
        const columns = Object.keys(rowData);
        const values = Object.values(rowData);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        const insertQuery = `
          INSERT INTO ${tableName} (${columns.join(', ')})
          VALUES (${placeholders})
          RETURNING *
        `;

        const insertResult = await sql(insertQuery, values);
        const allData = await sql(`SELECT * FROM ${tableName} ORDER BY id DESC`);

        return res.status(200).json({ 
          success: true, 
          data: allData,
          newRow: insertResult[0],
          source: 'neon',
          message: '✅ Veri Neon PostgreSQL'e kaydedildi!'
        });
      } catch (dbError) {
        console.error('Insert error:', dbError);
        return res.status(500).json({ 
          success: false, 
          error: dbError.message,
          fallback: true
        });
      }
    }

    // PUT - Update data
    if (req.method === 'PUT') {
      try {
        const { rowIndex, rowData } = req.body;

        // Get all records to find the correct ID
        const allRecords = await sql(`SELECT * FROM ${tableName} ORDER BY id DESC`);

        if (!allRecords[rowIndex]) {
          return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
        }

        const recordId = allRecords[rowIndex].id;
        const updateParts = Object.entries(rowData).map(([key, value], i) => `${key} = $${i + 1}`);
        const values = Object.values(rowData);

        const updateQuery = `
          UPDATE ${tableName}
          SET ${updateParts.join(', ')}
          WHERE id = $${values.length + 1}
          RETURNING *
        `;

        const result = await sql(updateQuery, [...values, recordId]);

        return res.status(200).json({ 
          success: true,
          data: result[0],
          source: 'neon',
          message: '✅ Veri güncellendi!'
        });
      } catch (dbError) {
        console.error('Update error:', dbError);
        return res.status(500).json({ 
          success: false, 
          error: dbError.message 
        });
      }
    }

    // DELETE - Delete data
    if (req.method === 'DELETE') {
      try {
        const { rowIndex } = req.body;

        const allRecords = await sql(`SELECT * FROM ${tableName} ORDER BY id DESC`);

        if (!allRecords[rowIndex]) {
          return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
        }

        const recordId = allRecords[rowIndex].id;

        await sql(`DELETE FROM ${tableName} WHERE id = $1`, [recordId]);
        const remainingData = await sql(`SELECT * FROM ${tableName} ORDER BY id DESC`);

        return res.status(200).json({ 
          success: true,
          data: remainingData,
          source: 'neon',
          message: '✅ Veri silindi!'
        });
      } catch (dbError) {
        console.error('Delete error:', dbError);
        return res.status(500).json({ 
          success: false, 
          error: dbError.message 
        });
      }
    }

    // If method not supported
    return res.status(405).json({ error: 'Method not allowed: ' + req.method });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Fallback handler
function handleFallback(req, res, sheetName) {
  const method = req.method;

  if (method === 'GET') {
    const data = global.storage[sheetName] || [];
    return res.status(200).json({ 
      data, 
      success: true, 
      source: 'fallback',
      message: '⚠️ Geçici bellekten okunuyor'
    });
  }

  if (method === 'POST') {
    const { rowData } = req.body;
    if (!global.storage[sheetName]) global.storage[sheetName] = [];
    const newRow = { ...rowData, id: Date.now() };
    global.storage[sheetName].push(newRow);
    return res.status(200).json({ 
      success: true, 
      data: global.storage[sheetName],
      newRow,
      source: 'fallback',
      message: '⚠️ Geçici bellekte kaydedildi'
    });
  }

  if (method === 'PUT') {
    const { rowIndex, rowData } = req.body;
    if (global.storage[sheetName]?.[rowIndex]) {
      const id = global.storage[sheetName][rowIndex].id;
      global.storage[sheetName][rowIndex] = { ...rowData, id };
      return res.status(200).json({ 
        success: true, 
        source: 'fallback' 
      });
    }
    return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
  }

  if (method === 'DELETE') {
    const { rowIndex } = req.body;
    if (global.storage[sheetName]) {
      global.storage[sheetName].splice(rowIndex, 1);
      return res.status(200).json({ 
        success: true,
        data: global.storage[sheetName],
        source: 'fallback' 
      });
    }
    return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
