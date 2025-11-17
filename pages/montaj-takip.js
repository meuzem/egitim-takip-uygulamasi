import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSheetsData, addRowToSheet, updateRow, deleteRow } from '../lib/sheets'

export default function MontajTakip() {
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [formData, setFormData] = useState({})

  const montajSorumlusuOptions = ['Ayşe Nur Yazıcı', 'Hasan Taşdemir', 'Hatice Yürük', 'Cihan Çimen']
  const icerikUzmaniOptions = ['Arzu Mantar', 'Meltem Ermez', 'Nezahat Kara', 'Sevim Aydın Verim']
  const isikOptions = ['Gülnur Kılıç', 'Sadi Demirci', 'Soner Ulu']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const result = await getSheetsData('Montaj Takip')
    setData(result.data || [])
  }

  const openModal = (index = null) => {
    if (index !== null) {
      setEditingIndex(index)
      setFormData(data[index])
    } else {
      setEditingIndex(null)
      setFormData({
        egitimAdi: '', egitmenAdi: '', montajSorumlusu: '', videoAdi: '', icerikUzmani: '',
        montajBaslama: '', revizeTarihi: '', isik: '', montajDurumu: '', montajTamamlandi: '', notlar: ''
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
      setShowModal(false)
      loadData()
      alert('Başarıyla kaydedildi!')
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  const handleDelete = async (index) => {
    if (confirm('Silmek istediğinizden emin misiniz?')) {
      try {
        await deleteRow('Montaj Takip', index)
        loadData()
        alert('Kayıt silindi!')
      } catch (error) {
        alert('Hata: ' + error.message)
      }
    }
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
          <h2 className="text-xl font-bold">🎞️ Montaj Listesi ({data.length})</h2>
          <button onClick={() => openModal()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            ➕ Yeni Montaj Ekle
          </button>
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
                  <th>Video Adı</th>
                  <th>İçerik Uzmanı</th>
                  <th>Başlama Tarihi</th>
                  <th>Revize Tarihi</th>
                  <th>Işık</th>
                  <th>Durum</th>
                  <th>Tamamlandı</th>
                  <th>Notlar</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap">
                      <button onClick={() => openModal(index)} className="px-3 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600">✏️</button>
                      <button onClick={() => handleDelete(index)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">🗑️</button>
                    </td>
                    <td>{row.egitimAdi}</td>
                    <td>{row.egitmenAdi}</td>
                    <td>{row.montajSorumlusu}</td>
                    <td>{row.videoAdi}</td>
                    <td>{row.icerikUzmani}</td>
                    <td>{row.montajBaslama}</td>
                    <td>{row.revizeTarihi}</td>
                    <td>{row.isik}</td>
                    <td><span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">{row.montajDurumu}</span></td>
                    <td><span className={`px-3 py-1 rounded-full text-sm ${row.montajTamamlandi === 'Evet' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{row.montajTamamlandi}</span></td>
                    <td>{row.notlar}</td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan="12" className="text-center py-8 text-gray-500">Henüz veri yok. Yeni montaj eklemek için butonu kullanın.</td></tr>
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
                <label className="block text-sm font-medium mb-2">Video Adı</label>
                <input type="text" value={formData.videoAdi || ''} onChange={(e) => setFormData({...formData, videoAdi: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">İçerik Uzmanı</label>
                <select value={formData.icerikUzmani || ''} onChange={(e) => setFormData({...formData, icerikUzmani: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  {icerikUzmaniOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Montaj Başlama Tarihi</label>
                <input type="date" value={formData.montajBaslama || ''} onChange={(e) => setFormData({...formData, montajBaslama: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Revize Tarihi</label>
                <input type="date" value={formData.revizeTarihi || ''} onChange={(e) => setFormData({...formData, revizeTarihi: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Işık Sorumlusu</label>
                <select value={formData.isik || ''} onChange={(e) => setFormData({...formData, isik: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  {isikOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Montaj Durumu</label>
                <input type="text" value={formData.montajDurumu || ''} onChange={(e) => setFormData({...formData, montajDurumu: e.target.value})} className="w-full" placeholder="Örn: Montajda, Revize, Tamamlandı" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Montaj Tamamlandı</label>
                <select value={formData.montajTamamlandi || ''} onChange={(e) => setFormData({...formData, montajTamamlandi: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  <option value="Evet">Evet</option>
                  <option value="Hayır">Hayır</option>
                </select>
              </div>
              <div className="md:col-span-2">
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
