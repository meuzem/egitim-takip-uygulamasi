import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MontajTakip() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sheets?sheet=Montaj Takip');
      const result = await res.json();
      if (result.success) {
        // Sort data: "Bitti" to bottom, others maintain order
        const sortedData = result.data.sort((a, b) => {
          const aStatus = (a.montaj_durumu || '').toLowerCase();
          const bStatus = (b.montaj_durumu || '').toLowerCase();
          if (aStatus === 'bitti' && bStatus !== 'bitti') return 1;
          if (aStatus !== 'bitti' && bStatus === 'bitti') return -1;
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
    const headers = ['Eğitmen', 'Ders', 'Hafta', 'Konu', 'Video Başlık', 'Montaj Başlangıç', 'Montaj Bitiş', 'Montaj Süresi', 'Montaj Durumu', 'Montaj Yapan', 'Montaj Notu'];
    const rows = filteredData.map(row => [
      row.egitmen || '',
      row.ders || '',
      row.hafta || '',
      row.konu || '',
      row.video_baslik || '',
      row.montaj_baslangic || '',
      row.montaj_bitis || '',
      row.montaj_suresi || '',
      row.montaj_durumu || '',
      row.montaj_yapan || '',
      row.montaj_notu || ''
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `montaj-takip-${new Date().toISOString().split('T')[0]}.csv`;
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
      (row.montaj_durumu || '').toLowerCase().includes(searchText) ||
      (row.montaj_yapan || '').toLowerCase().includes(searchText)
    );
  });

  const getRowClass = (durum) => {
    const durumLower = (durum || '').toLowerCase();
    if (durumLower === 'bitti') {
      return 'bg-green-100 text-green-900';
    }
    return 'hover:bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">✂️ Montaj Takip</h1>
            <div className="flex gap-3">
              <button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
              >
                <span>📥</span> Excel İndir
              </button>
              <Link href="/dashboard">
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition duration-200">
                  ← Dashboard
                </button>
              </Link>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="🔍 Ara... (eğitmen, ders, konu, başlık, durum, montajcı)"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg mb-4 transition duration-200 disabled:opacity-50"
          >
            {loading ? '🔄 Yükleniyor...' : '🔄 Yenile'}
          </button>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-orange-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Eğitmen</th>
                    <th className="py-3 px-4 text-left">Ders</th>
                    <th className="py-3 px-4 text-left">Hafta</th>
                    <th className="py-3 px-4 text-left">Konu</th>
                    <th className="py-3 px-4 text-left">Video Başlık</th>
                    <th className="py-3 px-4 text-left">Başlangıç</th>
                    <th className="py-3 px-4 text-left">Bitiş</th>
                    <th className="py-3 px-4 text-left">Süre</th>
                    <th className="py-3 px-4 text-left">Durum</th>
                    <th className="py-3 px-4 text-left">Montaj Yapan</th>
                    <th className="py-3 px-4 text-left">Not</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className={`border-b ${getRowClass(row.montaj_durumu)}`}>
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{row.egitmen}</td>
                      <td className="py-2 px-4">{row.ders}</td>
                      <td className="py-2 px-4">{row.hafta}</td>
                      <td className="py-2 px-4">{row.konu}</td>
                      <td className="py-2 px-4">{row.video_baslik}</td>
                      <td className="py-2 px-4">{row.montaj_baslangic}</td>
                      <td className="py-2 px-4">{row.montaj_bitis}</td>
                      <td className="py-2 px-4">{row.montaj_suresi}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded ${
                          (row.montaj_durumu || '').toLowerCase() === 'bitti'
                            ? 'bg-green-200 text-green-800 font-semibold'
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                          {row.montaj_durumu}
                        </span>
                      </td>
                      <td className="py-2 px-4">{row.montaj_yapan}</td>
                      <td className="py-2 px-4">{row.montaj_notu}</td>
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
