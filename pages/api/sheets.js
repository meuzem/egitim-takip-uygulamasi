// Vercel KV ile Kalıcı Veri Saklama
import { kv } from '@vercel/kv';

const SPREADSHEET_ID = '1ywjQGfHS6k4hqNiitkOUZ2HytTnu7N9Z5PO9A_yXMUY';

// KV keys
const getKey = (sheetName) => `sheet:${sheetName}`;

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

  try {
    if (method === 'GET') {
      const { sheet } = req.query;
      const key = getKey(sheet);

      // KV'den veri çek
      let data = await kv.get(key);

      // Eğer veri yoksa boş array başlat
      if (!data) {
        data = [];
        await kv.set(key, data);
      }

      console.log(`GET ${sheet}: ${data.length} items`);
      return res.status(200).json({ 
        data, 
        success: true,
        timestamp: new Date().toISOString()
      });
    }

    if (method === 'POST') {
      const { sheetName, rowData } = req.body;
      const key = getKey(sheetName);

      // Mevcut veriyi al
      let data = await kv.get(key) || [];

      // Yeni satır ekle
      const newRow = {
        ...rowData,
        id: Date.now() + Math.random(),
        createdAt: new Date().toISOString()
      };

      data.push(newRow);

      // KV'ye kaydet
      await kv.set(key, data);

      console.log(`POST ${sheetName}: Added item, total: ${data.length}`);
      return res.status(200).json({ 
        success: true, 
        data: data,
        newRow,
        message: '✅ Veri başarıyla eklendi ve kalıcı olarak kaydedildi!'
      });
    }

    if (method === 'PUT') {
      const { sheetName, rowIndex, rowData } = req.body;
      const key = getKey(sheetName);

      // Mevcut veriyi al
      let data = await kv.get(key) || [];

      if (data[rowIndex]) {
        const existingId = data[rowIndex].id;
        data[rowIndex] = {
          ...rowData,
          id: existingId,
          updatedAt: new Date().toISOString()
        };

        // KV'ye kaydet
        await kv.set(key, data);

        console.log(`PUT ${sheetName}[${rowIndex}]: Updated`);
        return res.status(200).json({ 
          success: true,
          data: data[rowIndex],
          message: '✅ Veri başarıyla güncellendi!'
        });
      }

      return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
    }

    if (method === 'DELETE') {
      const { sheetName, rowIndex } = req.body;
      const key = getKey(sheetName);

      // Mevcut veriyi al
      let data = await kv.get(key) || [];

      if (rowIndex < data.length) {
        data.splice(rowIndex, 1);

        // KV'ye kaydet
        await kv.set(key, data);

        console.log(`DELETE ${sheetName}[${rowIndex}]: Deleted, remaining: ${data.length}`);
        return res.status(200).json({ 
          success: true,
          data: data,
          message: '✅ Veri başarıyla silindi!'
        });
      }

      return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);

    // Eğer KV bağlantısı yoksa fallback olarak global storage kullan
    if (error.message?.includes('KV') || error.message?.includes('VERCEL')) {
      console.warn('⚠️ Vercel KV not configured, using fallback storage');

      // Fallback to global storage
      if (!global.storage) global.storage = {};

      if (method === 'GET') {
        const { sheet } = req.query;
        const data = global.storage[sheet] || [];
        return res.status(200).json({ data, success: true, fallback: true });
      }

      if (method === 'POST') {
        const { sheetName, rowData } = req.body;
        if (!global.storage[sheetName]) global.storage[sheetName] = [];
        const newRow = { ...rowData, id: Date.now() };
        global.storage[sheetName].push(newRow);
        return res.status(200).json({ success: true, data: global.storage[sheetName], fallback: true });
      }

      // Diğer methodlar için de fallback eklenebilir
    }

    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Sunucu hatası'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
