// Mock API for Google Sheets (gerçek API entegrasyonu için Google Sheets API key gerekir)
let mockData = {
  'Eğitim Takip': [],
  'Çekim Takip': [],
  'Montaj Takip': []
};

export default function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { sheet } = req.query;
    return res.status(200).json({ data: mockData[sheet] || [] });
  }

  if (method === 'POST') {
    const { sheetName, rowData } = req.body;
    if (!mockData[sheetName]) mockData[sheetName] = [];
    mockData[sheetName].push({ ...rowData, id: Date.now() });
    return res.status(200).json({ success: true, data: mockData[sheetName] });
  }

  if (method === 'PUT') {
    const { sheetName, rowIndex, rowData } = req.body;
    if (mockData[sheetName] && mockData[sheetName][rowIndex]) {
      mockData[sheetName][rowIndex] = { ...rowData, id: mockData[sheetName][rowIndex].id };
    }
    return res.status(200).json({ success: true });
  }

  if (method === 'DELETE') {
    const { sheetName, rowIndex } = req.body;
    if (mockData[sheetName]) {
      mockData[sheetName].splice(rowIndex, 1);
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
