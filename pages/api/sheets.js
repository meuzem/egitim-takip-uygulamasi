// API Route - Neon PostgreSQL ile Kalıcı Veri Saklama
import { db } from '../../db';
import { egitimTakip, cekimTakip, montajTakip } from '../../db/schema';
import { eq } from 'drizzle-orm';

// Sheet name to table mapping
const tableMap = {
  'Eğitim Takip': egitimTakip,
  'Çekim Takip': cekimTakip,
  'Montaj Takip': montajTakip,
};

// Field name mapping (camelCase to snake_case ve tam tersi)
const fieldMapping = {
  egitimTakip: {
    dal: 'dal', alan: 'alan', bolum: 'bolum', egitim: 'egitim',
    egitmen: 'egitmen', icerikTakip: 'icerik_takip', durum: 'durum',
    icerikBaslama: 'icerik_baslama', cekimBaslama: 'cekim_baslama',
    montajBaslama: 'montaj_baslama', montajSorumlusu: 'montaj_sorumlusu',
    yayinTarihi: 'yayin_tarihi', notlar: 'notlar'
  },
  cekimTakip: {
    egitimAdi: 'egitim_adi', egitmenAdi: 'egitmen_adi',
    cekimSorumlusu: 'cekim_sorumlusu', videoAdi: 'video_adi',
    cekimTarihi: 'cekim_tarihi', onCekim: 'on_cekim', izlence: 'izlence',
    isik: 'isik', fotografCekimi: 'fotograf_cekimi',
    fotografTarih: 'fotograf_tarih', cekimKontrol: 'cekim_kontrol',
    kontrolTarih: 'kontrol_tarih', tasnif: 'tasnif', dipSes: 'dip_ses',
    cekimTamamlandi: 'cekim_tamamlandi', synology: 'synology',
    synologyKlasor: 'synology_klasor', videKodu: 'vide_kodu',
    cekimYapanlar: 'cekim_yapanlar', notlar: 'notlar'
  },
  montajTakip: {
    egitimAdi: 'egitim_adi', egitmenAdi: 'egitmen_adi',
    montajSorumlusu: 'montaj_sorumlusu', videoAdi: 'video_adi',
    icerikUzmani: 'icerik_uzmani', montajBaslama: 'montaj_baslama',
    revizeTarihi: 'revize_tarihi', isik: 'isik',
    montajDurumu: 'montaj_durumu', montajTamamlandi: 'montaj_tamamlandi',
    notlar: 'notlar'
  }
};

// Fallback storage (Neon bağlantısı yoksa)
if (!global.storage) global.storage = {
  'Eğitim Takip': [],
  'Çekim Takip': [],
  'Montaj Takip': []
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

  try {
    const table = tableMap[req.query.sheet || req.body?.sheetName];
    const useFallback = !process.env.DATABASE_URL || !table;

    if (useFallback) {
      console.warn('⚠️ Neon not configured, using fallback storage');
      return handleFallback(req, res, method);
    }

    if (method === 'GET') {
      const { sheet } = req.query;
      const data = await db.select().from(table);

      console.log(`GET ${sheet}: ${data.length} items from Neon`);
      return res.status(200).json({ 
        data, 
        success: true,
        source: 'neon',
        timestamp: new Date().toISOString()
      });
    }

    if (method === 'POST') {
      const { sheetName, rowData } = req.body;

      const insertData = {
        ...rowData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.insert(table).values(insertData).returning();
      const allData = await db.select().from(table);

      console.log(`POST ${sheetName}: Added to Neon, total: ${allData.length}`);
      return res.status(200).json({ 
        success: true, 
        data: allData,
        newRow: result[0],
        source: 'neon',
        message: '✅ Veri başarıyla kaydedildi (Neon PostgreSQL)'
      });
    }

    if (method === 'PUT') {
      const { sheetName, rowIndex, rowData } = req.body;

      // Önce tüm veriyi al
      const allData = await db.select().from(table);

      if (allData[rowIndex]) {
        const recordId = allData[rowIndex].id;

        const updateData = {
          ...rowData,
          updatedAt: new Date()
        };

        const result = await db
          .update(table)
          .set(updateData)
          .where(eq(table.id, recordId))
          .returning();

        console.log(`PUT ${sheetName}[${rowIndex}]: Updated in Neon`);
        return res.status(200).json({ 
          success: true,
          data: result[0],
          source: 'neon',
          message: '✅ Veri başarıyla güncellendi'
        });
      }

      return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
    }

    if (method === 'DELETE') {
      const { sheetName, rowIndex } = req.body;

      // Önce tüm veriyi al
      const allData = await db.select().from(table);

      if (allData[rowIndex]) {
        const recordId = allData[rowIndex].id;

        await db.delete(table).where(eq(table.id, recordId));

        const remainingData = await db.select().from(table);

        console.log(`DELETE ${sheetName}[${rowIndex}]: Deleted from Neon, remaining: ${remainingData.length}`);
        return res.status(200).json({ 
          success: true,
          data: remainingData,
          source: 'neon',
          message: '✅ Veri başarıyla silindi'
        });
      }

      return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);

    // Neon hatası varsa fallback'e geç
    if (error.message?.includes('database') || error.message?.includes('connect')) {
      console.warn('⚠️ Neon error, switching to fallback');
      return handleFallback(req, res, method);
    }

    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Sunucu hatası'
    });
  }
}

// Fallback handler
function handleFallback(req, res, method) {
  if (method === 'GET') {
    const { sheet } = req.query;
    const data = global.storage[sheet] || [];
    return res.status(200).json({ data, success: true, source: 'fallback' });
  }

  if (method === 'POST') {
    const { sheetName, rowData } = req.body;
    if (!global.storage[sheetName]) global.storage[sheetName] = [];
    const newRow = { ...rowData, id: Date.now() + Math.random() };
    global.storage[sheetName].push(newRow);
    return res.status(200).json({ 
      success: true, 
      data: global.storage[sheetName], 
      source: 'fallback',
      message: '⚠️ Geçici bellekte kaydedildi. Neon bağlantısı yapın.'
    });
  }

  if (method === 'PUT') {
    const { sheetName, rowIndex, rowData } = req.body;
    if (global.storage[sheetName]?.[rowIndex]) {
      const id = global.storage[sheetName][rowIndex].id;
      global.storage[sheetName][rowIndex] = { ...rowData, id };
      return res.status(200).json({ success: true, source: 'fallback' });
    }
    return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
  }

  if (method === 'DELETE') {
    const { sheetName, rowIndex } = req.body;
    if (global.storage[sheetName]) {
      global.storage[sheetName].splice(rowIndex, 1);
      return res.status(200).json({ success: true, source: 'fallback' });
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
