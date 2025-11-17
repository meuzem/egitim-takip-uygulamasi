// API Route - Kalıcı veri saklama (Vercel KV benzeri basit yapı)
// Not: Vercel'de dosya sistemi read-only, bu yüzden global değişken kullanıyoruz
// Production için Vercel KV, MongoDB veya gerçek Google Sheets API kullanılmalı

// Global storage (server restart'ta kaybolur ama deployment boyunca kalır)
global.storage = global.storage || {
  'Eğitim Takip': [],
  'Çekim Takip': [],
  'Montaj Takip': []
};

export default function handler(req, res) {
  const { method } = req;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (method === 'GET') {
    const { sheet } = req.query;
    const data = global.storage[sheet] || [];
    console.log(`GET ${sheet}: ${data.length} items`);
    return res.status(200).json({ data, success: true });
  }

  if (method === 'POST') {
    const { sheetName, rowData } = req.body;
    if (!global.storage[sheetName]) {
      global.storage[sheetName] = [];
    }
    const newRow = { 
      ...rowData, 
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    };
    global.storage[sheetName].push(newRow);
    console.log(`POST ${sheetName}: Added item, total: ${global.storage[sheetName].length}`);
    return res.status(200).json({ 
      success: true, 
      data: global.storage[sheetName],
      message: 'Veri başarıyla eklendi'
    });
  }

  if (method === 'PUT') {
    const { sheetName, rowIndex, rowData } = req.body;
    if (global.storage[sheetName] && global.storage[sheetName][rowIndex]) {
      const existingId = global.storage[sheetName][rowIndex].id;
      global.storage[sheetName][rowIndex] = { 
        ...rowData, 
        id: existingId,
        updatedAt: new Date().toISOString()
      };
      console.log(`PUT ${sheetName}[${rowIndex}]: Updated`);
      return res.status(200).json({ 
        success: true,
        message: 'Veri başarıyla güncellendi'
      });
    }
    return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
  }

  if (method === 'DELETE') {
    const { sheetName, rowIndex } = req.body;
    if (global.storage[sheetName] && rowIndex < global.storage[sheetName].length) {
      global.storage[sheetName].splice(rowIndex, 1);
      console.log(`DELETE ${sheetName}[${rowIndex}]: Deleted, remaining: ${global.storage[sheetName].length}`);
      return res.status(200).json({ 
        success: true,
        message: 'Veri başarıyla silindi'
      });
    }
    return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Vercel serverless fonksiyonları için config
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
