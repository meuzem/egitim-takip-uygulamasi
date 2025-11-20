import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CekimTakip() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sheets?sheet=Çekim Takip');
      const result = await res.json();
      if (result.success) {
        // Sort data: "Bitti" to bottom, others maintain order
        const sortedData = result.data.sort((a, b) => {
          const aStatus = (a.cekim_durumu || '').toLowerCase();
          const bStatus = (b.cekim_durumu || '').toLowerCase();
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
    const headers = ['Eğitmen', 'Ders', 'Hafta', 'Konu', 'Video Başlık', 'Çekim Tarihi', 'Çekim Saati', 'Çekim Süresi', 'Çekim Durumu', 'Çekim Notu'];
    const rows = filteredData.map(row => [
      row.egitmen || '',
      row.ders || '',
      row.hafta || '',
      row.konu || '',
      row.video_baslik || '',
      row.cekim_tarihi || '',
      row.cekim_saati || '',
      row.cekim_suresi || '',
      row.cekim_durumu || '',
      row.cekim_notu || ''
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cekim-takip-${new Date().toISOString().split('T')[0]}.csv`;
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
      (row.cekim_durumu || '').toLowerCase().includes(searchText)
    );
  });

  const handleEdit = (row, index) => {
    setEditingRow(index);
    setEditForm({ ...row });
  };

  const handleSave = async (index) => {
    try {
      const res = await fetch('/api/sheets?sheet=Çekim Takip', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rowIndex: index + 2,
          data: editForm
        })
      });

      const result = await res.json();
      if (result.success) {
        alert('✅ Güncelleme başarılı!');
        setEditingRow(null);
        fetchData();
      } else {
        alert('❌ Güncelleme hatası: ' + (result.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      alert('❌ Güncelleme hatası: ' + error.message);
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditForm({});
  };

  const getRowClass = (durum) => {
    const durumLower = (durum || '').toLowerCase();
    if (durumLower === 'bitti') {
      return 'bg-green-100 text-green-900';
    }
    return 'hover:bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">🎥 Çekim Takip</h1>
            <div className="flex gap-3">
              <button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
              >
                <span>📥</span> Excel İndir
              </button>
              <Link href="/dashboard">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg mb-4 transition duration-200 disabled:opacity-50"
          >
            {loading ? '🔄 Yükleniyor...' : '🔄 Yenile'}
          </button>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-purple-600 text-white">
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
                    <th className="py-3 px-4 text-left">Not</th>
                    <th className="py-3 px-4 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className={`border-b ${getRowClass(row.cekim_durumu)}`}>
                      {editingRow === index ? (
                        <>
                          <td className="py-2 px-4">{index + 1}</td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              value={editForm.egitmen || ''}
                              onChange={(e) => setEditForm({ ...editForm, egitmen: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              value={editForm.ders || ''}
                              onChange={(e) => setEditForm({ ...editForm, ders: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              value={editForm.hafta || ''}
                              onChange={(e) => setEditForm({ ...editForm, hafta: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              value={editForm.konu || ''}
                              onChange={(e) => setEditForm({ ...editForm, konu: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              value={editForm.video_baslik || ''}
                              onChange={(e) => setEditForm({ ...editForm, video_baslik: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              value={editForm.cekim_tarihi || ''}
                              onChange={(e) => setEditForm({ ...editForm, cekim_tarihi: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              value={editForm.cekim_saati || ''}
                              onChange={(e) => setEditForm({ ...editForm, cekim_saati: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              value={editForm.cekim_suresi || ''}
                              onChange={(e) => setEditForm({ ...editForm, cekim_suresi: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <select
                              value={editForm.cekim_durumu || ''}
                              onChange={(e) => setEditForm({ ...editForm, cekim_durumu: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            >
                              <option value="">Seçiniz</option>
                              <option value="Planlandı">Planlandı</option>
                              <option value="Devam Ediyor">Devam Ediyor</option>
                              <option value="Bitti">Bitti</option>
                            </select>
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              value={editForm.cekim_notu || ''}
                              onChange={(e) => setEditForm({ ...editForm, cekim_notu: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSave(index)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                              >
                                ✓ Kaydet
                              </button>
                              <button
                                onClick={handleCancel}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                              >
                                ✗ İptal
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 px-4">{index + 1}</td>
                          <td className="py-2 px-4">{row.egitmen}</td>
                          <td className="py-2 px-4">{row.ders}</td>
                          <td className="py-2 px-4">{row.hafta}</td>
                          <td className="py-2 px-4">{row.konu}</td>
                          <td className="py-2 px-4">{row.video_baslik}</td>
                          <td className="py-2 px-4">{row.cekim_tarihi}</td>
                          <td className="py-2 px-4">{row.cekim_saati}</td>
                          <td className="py-2 px-4">{row.cekim_suresi}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded ${
                              (row.cekim_durumu || '').toLowerCase() === 'bitti'
                                ? 'bg-green-200 text-green-800 font-semibold'
                                : 'bg-gray-200 text-gray-800'
                            }`}>
                              {row.cekim_durumu}
                            </span>
                          </td>
                          <td className="py-2 px-4">{row.cekim_notu}</td>
                          <td className="py-2 px-4">
                            <button
                              onClick={() => handleEdit(row, index)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            >
                              ✏️ Düzenle
                            </button>
                          </td>
                        </>
                      )}
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
