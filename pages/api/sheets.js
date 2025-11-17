// Simplified API - Neon PostgreSQL
import { neon } from '@neondatabase/serverless';

// Fallback storage
if (!global.storage) {
  global.storage = {
    'Eğitim Takip': [],
    'Çekim Takip': [],
    'Montaj Takip': []
  };
}

// Helper: Table name mapping
const getTableName = (sheetName) => {
  const map = {
    'Eğitim Takip': 'egitim_takip',
    'Çekim Takip': 'cekim_takip',
    'Montaj Takip': 'montaj_takip'
  };
  return map[sheetName];
};

// Helper: Check if Neon is configured
const isNeonConfigured = () => {
  return !!process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon');
};

export default async function handler(req, res) {
  const { method } = req;

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  const useNeon = isNeonConfigured();

  try {
    if (!useNeon) {
      console.warn('⚠️ DATABASE_URL not configured, using fallback storage');
      return handleFallback(req, res, method);
    }

    const sql = neon(process.env.DATABASE_URL);
    const sheetName = req.query.sheet || req.body?.sheetName;
    const tableName = getTableName(sheetName);

    if (!tableName) {
      return res.status(400).json({ error: 'Invalid sheet name' });
    }

    if (method === 'GET') {
      const result = await sql\`SELECT * FROM \${sql(tableName)} ORDER BY id DESC\`;
      console.log(\`GET \${sheetName}: \${result.length} items from Neon\`);

      return res.status(200).json({ 
        data: result, 
        success: true,
        source: 'neon',
        timestamp: new Date().toISOString()
      });
    }

    if (method === 'POST') {
      const { rowData } = req.body;

      // Build insert query dynamically
      const columns = Object.keys(rowData);
      const values = Object.values(rowData);
      const placeholders = values.map((_, i) => \`$\${i + 1}\`).join(', ');

      const query = \`
        INSERT INTO \${tableName} (\${columns.join(', ')}, created_at, updated_at)
        VALUES (\${placeholders}, NOW(), NOW())
        RETURNING *
      \`;

      const result = await sql(query, values);
      const allData = await sql\`SELECT * FROM \${sql(tableName)} ORDER BY id DESC\`;

      console.log(\`POST \${sheetName}: Added to Neon\`);
      return res.status(200).json({ 
        success: true, 
        data: allData,
        newRow: result[0],
        source: 'neon',
        message: '✅ Veri Neon PostgreSQL veritabanına kaydedildi!'
      });
    }

    if (method === 'PUT') {
      const { rowIndex, rowData } = req.body;

      // Get all records to find the ID
      const allRecords = await sql\`SELECT * FROM \${sql(tableName)} ORDER BY id DESC\`;

      if (!allRecords[rowIndex]) {
        return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
      }

      const recordId = allRecords[rowIndex].id;

      // Build update query
      const updates = Object.entries(rowData)
        .map(([key, value], i) => \`\${key} = $\${i + 1}\`)
        .join(', ');
      const values = Object.values(rowData);

      const query = \`
        UPDATE \${tableName}
        SET \${updates}, updated_at = NOW()
        WHERE id = $\${values.length + 1}
        RETURNING *
      \`;

      const result = await sql(query, [...values, recordId]);

      console.log(\`PUT \${sheetName}[\${rowIndex}]: Updated in Neon\`);
      return res.status(200).json({ 
        success: true,
        data: result[0],
        source: 'neon',
        message: '✅ Veri güncellendi!'
      });
    }

    if (method === 'DELETE') {
      const { rowIndex } = req.body;

      // Get all records to find the ID
      const allRecords = await sql\`SELECT * FROM \${sql(tableName)} ORDER BY id DESC\`;

      if (!allRecords[rowIndex]) {
        return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
      }

      const recordId = allRecords[rowIndex].id;

      await sql\`DELETE FROM \${sql(tableName)} WHERE id = \${recordId}\`;
      const remainingData = await sql\`SELECT * FROM \${sql(tableName)} ORDER BY id DESC\`;

      console.log(\`DELETE \${sheetName}[\${rowIndex}]: Deleted from Neon\`);
      return res.status(200).json({ 
        success: true,
        data: remainingData,
        source: 'neon',
        message: '✅ Veri silindi!'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);

    // Neon hatası varsa fallback'e geç
    console.warn('⚠️ Neon error, switching to fallback:', error.message);
    return handleFallback(req, res, method);
  }
}

// Fallback handler (global storage)
function handleFallback(req, res, method) {
  const sheetName = req.query.sheet || req.body?.sheetName;

  if (method === 'GET') {
    const data = global.storage[sheetName] || [];
    return res.status(200).json({ 
      data, 
      success: true, 
      source: 'fallback',
      message: '⚠️ Geçici bellekten okunuyor. DATABASE_URL ekleyin.'
    });
  }

  if (method === 'POST') {
    const { rowData } = req.body;
    if (!global.storage[sheetName]) global.storage[sheetName] = [];
    const newRow = { ...rowData, id: Date.now() + Math.random() };
    global.storage[sheetName].push(newRow);
    return res.status(200).json({ 
      success: true, 
      data: global.storage[sheetName],
      newRow,
      source: 'fallback',
      message: '⚠️ Geçici bellekte kaydedildi. DATABASE_URL ekleyin.'
    });
  }

  if (method === 'PUT') {
    const { rowIndex, rowData } = req.body;
    if (global.storage[sheetName]?.[rowIndex]) {
      const id = global.storage[sheetName][rowIndex].id;
      global.storage[sheetName][rowIndex] = { ...rowData, id };
      return res.status(200).json({ 
        success: true, 
        source: 'fallback',
        message: '⚠️ Geçici bellekte güncellendi.'
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
        source: 'fallback',
        message: '⚠️ Geçici bellekten silindi.'
      });
    }
    return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
