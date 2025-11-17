import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSheetsData, addRowToSheet, updateRow, deleteRow } from '../lib/sheets'

export default function CekimTakip() {
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [formData, setFormData] = useState({})

  const cekimSorumlusuOptions = ['Gülnur Kılıç', 'Sadi Demirci', 'Soner Ulu']
  const icerikUzmaniOptions = ['Arzu Mantar', 'Meltem Ermez', 'Nezahat Kara', 'Sevim Aydın Verim']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const result = await getSheetsData('Çekim Takip')
    setData(result.data || [])
  }

  const openModal = (index = null) => {
    if (index !== null) {
      setEditingIndex(index)
      setFormData(data[index])
    } else {
      setEditingIndex(null)
      setFormData({
        egitimAdi: '', egitmenAdi: '', cekimSorumlusu: '', videoAdi: '', cekimTarihi: '',
        onCekim: '', izlence: '', isik: '', fotografCekimi: '', fotografTarih: '',
        cekimKontrol: '', kontrolTarih: '', tasnif: '', dipSes: '', cekimTamamlandi: '',
        synology: '', synologyKlasor: '', videKodu: '', cekimYapanlar: '', notlar: ''
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingIndex !== null) {
        await updateRow('Çekim Takip', editingIndex, formData)
      } else {
        await addRowToSheet('Çekim Takip', formData)
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
        await deleteRow('Çekim Takip', index)
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
          <Link href="/" className="text-2xl font-bold text-indigo-600">🎥 Çekim Takip</Link>
          <div className="space-x-4">
            <Link href="/" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">🏠 Ana Sayfa</Link>
            <Link href="/egitim-takip" className="text-gray-600 hover:text-indigo-600">Eğitim Takip</Link>
            <Link href="/montaj-takip" className="text-gray-600 hover:text-indigo-600">Montaj Takip</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">🎬 Çekim Listesi ({data.length})</h2>
          <button onClick={() => openModal()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            ➕ Yeni Çekim Ekle
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
                  <th>Çekim Sorumlusu</th>
                  <th>Video Adı</th>
                  <th>Çekim Tarihi</th>
                  <th>Ön Çekim</th>
                  <th>İzlence</th>
                  <th>Işık</th>
                  <th>Fotoğraf</th>
                  <th>Çekim Kontrol</th>
                  <th>Tasnif</th>
                  <th>Dip Ses</th>
                  <th>Tamamlandı</th>
                  <th>Synology</th>
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
                    <td>{row.cekimSorumlusu}</td>
                    <td>{row.videoAdi}</td>
                    <td>{row.cekimTarihi}</td>
                    <td>{row.onCekim}</td>
                    <td>{row.izlence}</td>
                    <td>{row.isik}</td>
                    <td>{row.fotografCekimi}</td>
                    <td>{row.cekimKontrol}</td>
                    <td>{row.tasnif}</td>
                    <td>{row.dipSes}</td>
                    <td><span className={`px-3 py-1 rounded-full text-sm ${row.cekimTamamlandi === 'Evet' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{row.cekimTamamlandi}</span></td>
                    <td>{row.synology}</td>
                    <td>{row.notlar}</td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan="16" className="text-center py-8 text-gray-500">Henüz veri yok. Yeni çekim eklemek için butonu kullanın.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{editingIndex !== null ? '✏️ Çekimi Düzenle' : '➕ Yeni Çekim Ekle'}</h3>
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
                <label className="block text-sm font-medium mb-2">Çekim Sorumlusu</label>
                <select value={formData.cekimSorumlusu || ''} onChange={(e) => setFormData({...formData, cekimSorumlusu: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  {cekimSorumlusuOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Video Adı</label>
                <input type="text" value={formData.videoAdi || ''} onChange={(e) => setFormData({...formData, videoAdi: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Çekim Tarihi</label>
                <input type="date" value={formData.cekimTarihi || ''} onChange={(e) => setFormData({...formData, cekimTarihi: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">İzlence (İçerik Uzmanı)</label>
                <select value={formData.izlence || ''} onChange={(e) => setFormData({...formData, izlence: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  {icerikUzmaniOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Işık Sorumlusu</label>
                <select value={formData.isik || ''} onChange={(e) => setFormData({...formData, isik: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  {cekimSorumlusuOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Çekim Yapanlar</label>
                <input type="text" value={formData.cekimYapanlar || ''} onChange={(e) => setFormData({...formData, cekimYapanlar: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Synology Klasörü</label>
                <input type="text" value={formData.synologyKlasor || ''} onChange={(e) => setFormData({...formData, synologyKlasor: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Video Kodu</label>
                <input type="text" value={formData.videKodu || ''} onChange={(e) => setFormData({...formData, videKodu: e.target.value})} className="w-full" />
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
