import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSheet sData, addRowToSheet, updateRow, deleteRow } from '../lib/sheets'
import { exportToExcel } from '../lib/utils'

export default function MontajTakip() {
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [formData, setFormData] = useState({})

  const montajSorumlusuOptions = ['Ayşe Nur Yazıcı', 'Hasan Taşdemir', 'Hatice Yürük', 'Cihan Çimen']
  const icerikUzmaniOptions = ['Arzu Mantar', 'Meltem Ermez', 'Nezahat Kara', 'Sevim Aydın Verim']
  const montajDurumuOptions = ['Başladı', 'Devam Ediyor', '1.Revize', '2.Revize', 'Bitti']
  const montajOptions = ['Tamamlandı', 'Tamamlanmadı']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const result = await getSheetsData('Montaj Takip')
    // Sıralama: "Bitti" olanlar sona
    const sorted = (result.data || []).sort((a, b) => {
      if (a.montajDurumu === 'Bitti' && b.montajDurumu !== 'Bitti') return 1
      if (a.montajDurumu !== 'Bitti' && b.montajDurumu === 'Bitti') return -1
      return 0
    })
    setData(sorted)
  }

  const openModal = (index = null) => {
    if (index !== null) {
      setEditingIndex(index)
      setFormData(data[index])
    } else {
      setEditingIndex(null)
      setFormData({
        egitimAdi: '', egitmenAdi: '', montajSorumlusu: '', bitenVideoAdi: '', icerikUzmani: '',
        montajBaslamaTarihi: '', revize1Tarihi: '', revize2Tarihi: '', montajDurumu: '',
        montajBitisTarihi: '', montaj: '', notlar: ''
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingIndex !== null) {
        await updateRow('Montaj Takip', editingIndex, formData)
      } else {
        await addRowToSheet('Montaj Takip', formData)
      }
      await loadData()
      setShowModal(false)
      alert('Başarıyla kaydedildi!')
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  const handleDelete = async (index) => {
    if (confirm('Silmek istediğinize emin misiniz?')) {
      try {
        await deleteRow('Montaj Takip', index)
        loadData()
        alert('Kayıt silindi!')
      } catch (error) {
        alert('Hata: ' + error.message)
      }
    }
  }

  const handleExport = () => {
    exportToExcel(data, 'Montaj_Takip_' + new Date().toISOString().split('T')[0])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">✂️ Montaj Takip</Link>
          <div className="space-x-4">
            <Link href="/" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">🏠 Ana Sayfa</Link>
            <Link href="/egitim-takip" className="text-gray-600 hover:text-indigo-600">Eğitim Takip</Link>
            <Link href="/cekim-takip" className="text-gray-600 hover:text-indigo-600">Çekim Takip</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">🎬 Montaj Listesi ({data.length})</h2>
          <div className="space-x-3">
            <button onClick={handleExport} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              📥 Excel İndir
            </button>
            <button onClick={() => openModal()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              ➕ Yeni Montaj Ekle
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="table-container overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>İşlemler</th>
                  <th>Eğitim Adı</th>
                  <th>Eğitmen</th>
                  <th>Montaj Sorumlusu</th>
                  <th>Biten Video Adı</th>
                  <th>İçerik Uzmanı</th>
                  <th>Başlama Tarihi</th>
                  <th>1.Revize Tarihi</th>
                  <th>2.Revize Tarihi</th>
                  <th>Durum</th>
                  <th>Bitiş Tarihi</th>
                  <th>Montaj</th>
                  <th>Notlar</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className={row.montajDurumu === 'Bitti' ? 'bg-green-50' : ''}>
                    <td className="whitespace-nowrap">
                      <button onClick={() => openModal(index)} className="px-3 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600">✏️</button>
                      <button onClick={() => handleDelete(index)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">🗑️</button>
                    </td>
                    <td>{row.egitimAdi}</td>
                    <td>{row.egitmenAdi}</td>
                    <td>{row.montajSorumlusu}</td>
                    <td>{row.bitenVideoAdi}</td>
                    <td>{row.icerikUzmani}</td>
                    <td>{row.montajBaslamaTarihi}</td>
                    <td>{row.revize1Tarihi}</td>
                    <td>{row.revize2Tarihi}</td>
                    <td><span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">{row.montajDurumu}</span></td>
                    <td>{row.montajBitisTarihi}</td>
                    <td><span className={`px-3 py-1 rounded-full text-sm ${row.montaj === 'Tamamlandı' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{row.montaj}</span></td>
                    <td>{row.notlar}</td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan="13" className="text-center py-8 text-gray-500">Henüz veri yok. Yeni montaj eklemek için butonu kullanın.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{editingIndex !== null ? '✏️ Montajı Düzenle' : '➕ Yeni Montaj Ekle'}</h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Eğitim Adı *</label>
                <input type="text" value={formData.egitimAdi || ''} onChange={(e) => setFormData({...formData, egitimAdi: e.target.value})} required className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Eğitmen Adı</label>
                <input type="text" value={formData.egitmenAdi || ''} onChange={(e) => setFormData({...formData, egitmenAdi: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Montaj Sorumlusu</label>
                <select value={formData.montajSorumlusu || ''} onChange={(e) => setFormData({...formData, montajSorumlusu: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  {montajSorumlusuOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">İçerik Uzmanı</label>
                <select value={formData.icerikUzmani || ''} onChange={(e) => setFormData({...formData, icerikUzmani: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  {icerikUzmaniOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Biten Video Adı</label>
                <textarea value={formData.bitenVideoAdi || ''} onChange={(e) => setFormData({...formData, bitenVideoAdi: e.target.value})} rows="2" className="w-full"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Montaj Başlama Tarihi</label>
                <input type="date" value={formData.montajBaslamaTarihi || ''} onChange={(e) => setFormData({...formData, montajBaslamaTarihi: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">1.Revize Tarihi</label>
                <input type="date" value={formData.revize1Tarihi || ''} onChange={(e) => setFormData({...formData, revize1Tarihi: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">2.Revize Tarihi</label>
                <input type="date" value={formData.revize2Tarihi || ''} onChange={(e) => setFormData({...formData, revize2Tarihi: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Montaj Durumu</label>
                <select value={formData.montajDurumu || ''} onChange={(e) => setFormData({...formData, montajDurumu: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  {montajDurumuOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Montaj Bitiş Tarihi</label>
                <input type="date" value={formData.montajBitisTarihi || ''} onChange={(e) => setFormData({...formData, montajBitisTarihi: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Montaj </label>
                <select value={formData.montaj || ''} onChange={(e) => setFormData({...formData, montaj: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  montajOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notlar</label>
                <textarea value={formData.notlar || ''} onChange={(e) => setFormData({...formData, notlar: e.target.value})} rows="3" className="w-full"></textarea>
              </div>
              <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">İptal</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">💾 Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
