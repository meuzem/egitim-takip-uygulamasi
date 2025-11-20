import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EgitimTakip() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sheets?sheet=Eğitim Takip');
      const result = await res.json();
      if (result.success) {
        const sortedData = result.data.sort((a, b) => {
          const aStatus = (a.durum || '').toLowerCase();
          const bStatus = (b.durum || '').toLowerCase();
          if (aStatus === 'yayında' && bStatus !== 'yayında') return 1;
          if (aStatus !== 'yayında' && bStatus === 'yayında') return -1;
          return 0;
        });
        setData(sortedData);
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportToExcel = () => {
    const headers = ['Eğitmen', 'Ders', 'Hafta', 'Konu', 'Video Başlık', 'Tarih', 'Saat', 'Süre', 'Durum', 'Platform', 'Not'];
    const rows = filteredData.map(row => [
      row.egitmen || '',
      row.ders || '',
      row.hafta || '',
      row.konu || '',
      row.video_baslik || '',
      row.tarih || '',
      row.saat || '',
      row.sure || '',
      row.durum || '',
      row.platform || '',
      row.not || ''
    ]);

    let csv = headers.join(',') + '\\n';
    rows.forEach(row => {
      csv += row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',') + '\\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'egitim-takip-' + new Date().toISOString().split('T')[0] + '.csv';
    link.click();
  };

  const filteredData = data.filter(row => {
    if (!filterText) return true;
    const searchText = filterText.toLowerCase();
    return (
      (row.egitmen || '').toLowerCase().includes(searchText) ||
      (row.ders || '').toLowerCase().includes(searchText) ||
      (row.konu || '').toLowerCase().includes(searchText) ||
      (row.video_baslik || '').toLowerCase().includes(searchText) ||
      (row.durum || '').toLowerCase().includes(searchText)
    );
  });

  const getRowClass = (durum) => {
    const durumLower = (durum || '').toLowerCase();
    if (durumLower === 'yayında') {
      return 'bg-green-100 text-green-900';
    }
    return 'hover:bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">📚 Eğitim Takip</h1>
            <div className="flex gap-3">
              <button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
              >
                <span>📥</span> Excel İndir
              </button>
              <Link href="/dashboard">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
                  ← Dashboard
                </button>
              </Link>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="🔍 Ara... (eğitmen, ders, konu, başlık, durum)"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg mb-4 transition duration-200 disabled:opacity-50"
          >
            {loading ? '🔄 Yükleniyor...' : '🔄 Yenile'}
          </button>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Eğitmen</th>
                    <th className="py-3 px-4 text-left">Ders</th>
                    <th className="py-3 px-4 text-left">Hafta</th>
                    <th className="py-3 px-4 text-left">Konu</th>
                    <th className="py-3 px-4 text-left">Video Başlık</th>
                    <th className="py-3 px-4 text-left">Tarih</th>
                    <th className="py-3 px-4 text-left">Saat</th>
                    <th className="py-3 px-4 text-left">Süre</th>
                    <th className="py-3 px-4 text-left">Durum</th>
                    <th className="py-3 px-4 text-left">Platform</th>
                    <th className="py-3 px-4 text-left">Not</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className={'border-b ' + getRowClass(row.durum)}>
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{row.egitmen}</td>
                      <td className="py-2 px-4">{row.ders}</td>
                      <td className="py-2 px-4">{row.hafta}</td>
                      <td className="py-2 px-4">{row.konu}</td>
                      <td className="py-2 px-4">{row.video_baslik}</td>
                      <td className="py-2 px-4">{row.tarih}</td>
                      <td className="py-2 px-4">{row.saat}</td>
                      <td className="py-2 px-4">{row.sure}</td>
                      <td className="py-2 px-4">
                        <span className={'px-2 py-1 rounded ' + (
                          (row.durum || '').toLowerCase() === 'yayında' 
                            ? 'bg-green-200 text-green-800 font-semibold'
                            : 'bg-gray-200 text-gray-800'
                        )}>
                          {row.durum}
                        </span>
                      </td>
                      <td className="py-2 px-4">{row.platform}</td>
                      <td className="py-2 px-4">{row.not}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length === 0 && (
                <p className="text-center py-8 text-gray-500">Veri bulunamadı</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
