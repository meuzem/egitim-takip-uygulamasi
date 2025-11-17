import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSheetsData, addRowToSheet, updateRow, deleteRow } from '../lib/sheets'

export default function EgitimTakip() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [formData, setFormData] = useState({})

  const [filters, setFilters] = useState({
    dal: '',
    alan: '',
    durum: ''
  })

  const dalOptions = ['Mesleki ve Teknik', 'Kişisel Gelişim', 'Güzel Sanatlar', 'El Sanatları ve Zanaat']
  const alanOptions = ['Bilişim Teknolojileri', 'Çocuk Gelişimi ve Eğitimi', 'Dil Eğitimleri', 'Örgü ve İşleme Sanatları', 'Gastronomi ve Mutfak Sanatları', 'Görsel İletişim ve Grafik Tasarım', 'Güzellik ve Saç Bakım Hizmetleri', 'Kişisel Gelişim ve Eğitim', 'Medya ve İletişim', 'Moda Tasarımı ve Tekstil & Teknolojisi', 'Muhasebe ve Finansman', 'Müzik', 'Robotik ve Yapay Zekâ', 'Sahne Sanatları', 'Sanat ve Tasarım', 'Yönetim ve Hizmet', 'Ziraat', 'Ahşap Tasarımı ve Teknolojileri', 'Süsleme Sanatları', 'Kuyumculuk ve Takı Tasarımı', 'Teknik Tasarım', 'Tekstil Tasarım']
  const durumOptions = ['Eğitim Planlanıyor', 'Eğitmen İçerik Hazırlıyor', 'Ekran Çekiminde', 'Etkileşimli İçerik Hazırlanıyor', 'Çekim Bekliyor', 'Çekimde', 'Çekim Bitti', 'Çekim Revize', 'İçerik Bitti', 'Ses Çekimi Bekleniyor', 'İçerik Kontrolü', 'İçerik Revize', 'Montaj Sırasında', 'Etkileşimli İçerik Sırasında', 'Montajda', 'Montaj Kontrolü', 'Montaj Revize', 'ID Bekliyor', 'Yayında', 'Eğitim Beklemede', 'İptal', 'ÖYS Aşamasında', 'Animasyon Programı Bekliyor']
  const icerikTakipOptions = ['Arzu Mantar', 'Meltem Ermez', 'Meltem Ermez - Nezahat Kara', 'Nezahat Kara', 'Nezahat Kara - Meltem Ermez', 'Sevim Aydın Verim', 'Sevim Aydın Verim - Meltem Ermez - Nezahat Kara']
  const montajSorumlusuOptions = ['Ayşe Nur Yazıcı', 'Hasan Taşdemir', 'Hatice Yürük', 'Cihan Çimen']

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = data
    if (filters.dal) filtered = filtered.filter(item => item.dal === filters.dal)
    if (filters.alan) filtered = filtered.filter(item => item.alan === filters.alan)
    if (filters.durum) filtered = filtered.filter(item => item.durum === filters.durum)
    setFilteredData(filtered)
  }, [filters, data])

  const loadData = async () => {
    const result = await getSheetsData('Eğitim Takip')
    setData(result.data || [])
    setFilteredData(result.data || [])
  }

  const openModal = (index = null) => {
    if (index !== null) {
      setEditingIndex(index)
      setFormData(filteredData[index])
    } else {
      setEditingIndex(null)
      setFormData({
        dal: '', alan: '', bolum: '', egitim: '', egitmen: '', icerikTakip: '',
        durum: '', icerikBaslama: '', cekimBaslama: '', montajBaslama: '',
        montajSorumlusu: '', yayinTarihi: '', notlar: ''
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingIndex !== null) {
        await updateRow('Eğitim Takip', editingIndex, formData)
      } else {
        await addRowToSheet('Eğitim Takip', formData)
      }
      setShowModal(false)
      loadData()
      alert('Başarıyla kaydedildi!')
    } catch (error) {
      alert('Hata oluştu: ' + error.message)
    }
  }

  const handleDelete = async (index) => {
    if (confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteRow('Eğitim Takip', index)
        loadData()
        alert('Kayıt silindi!')
      } catch (error) {
        alert('Hata oluştu: ' + error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">📚 Eğitim Takip</Link>
          <div className="space-x-4">
            <Link href="/" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">🏠 Ana Sayfa</Link>
            <Link href="/cekim-takip" className="text-gray-600 hover:text-indigo-600">Çekim Takip</Link>
            <Link href="/montaj-takip" className="text-gray-600 hover:text-indigo-600">Montaj Takip</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🔍 Filtreler</h2>
            <button onClick={() => openModal()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              ➕ Yeni Eğitim Ekle
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Dal</label>
              <select value={filters.dal} onChange={(e) => setFilters({...filters, dal: e.target.value})} className="w-full">
                <option value="">Tümü</option>
                {dalOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Alan</label>
              <select value={filters.alan} onChange={(e) => setFilters({...filters, alan: e.target.value})} className="w-full">
                <option value="">Tümü</option>
                {alanOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Durum</label>
              <select value={filters.durum} onChange={(e) => setFilters({...filters, durum: e.target.value})} className="w-full">
                <option value="">Tümü</option>
                {durumOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">📋 Eğitim Listesi ({filteredData.length})</h2>
          </div>
          <div className="table-container overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>İşlemler</th>
                  <th>DAL</th>
                  <th>ALAN</th>
                  <th>BÖLÜM</th>
                  <th>EĞİTİM</th>
                  <th>EĞİTMEN</th>
                  <th>İÇERİK TAKİP</th>
                  <th>DURUM</th>
                  <th>İÇERİK BAŞLAMA</th>
                  <th>ÇEKİM BAŞLAMA</th>
                  <th>MONTAJ BAŞLAMA</th>
                  <th>MONTAJ SORUMLUSU</th>
                  <th>YAYIN TARİHİ</th>
                  <th>NOTLAR</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap">
                      <button onClick={() => openModal(index)} className="px-3 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600">✏️ Düzenle</button>
                      <button onClick={() => handleDelete(index)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">🗑️ Sil</button>
                    </td>
                    <td>{row.dal}</td>
                    <td>{row.alan}</td>
                    <td>{row.bolum}</td>
                    <td>{row.egitim}</td>
                    <td>{row.egitmen}</td>
                    <td>{row.icerikTakip}</td>
                    <td><span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">{row.durum}</span></td>
                    <td>{row.icerikBaslama}</td>
                    <td>{row.cekimBaslama}</td>
                    <td>{row.montajBaslama}</td>
                    <td>{row.montajSorumlusu}</td>
                    <td>{row.yayinTarihi}</td>
                    <td>{row.notlar}</td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr><td colSpan="14" className="text-center py-8 text-gray-500">Henüz veri yok. Yeni eğitim eklemek için yukarıdaki butonu kullanın.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{editingIndex !== null ? '✏️ Eğitimi Düzenle' : '➕ Yeni Eğitim Ekle'}</h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Dal *</label>
                <select value={formData.dal || ''} onChange={(e) => setFormData({...formData, dal: e.target.value})} required className="w-full">
                  <option value="">Seçiniz</option>
                  {dalOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Alan *</label>
                <select value={formData.alan || ''} onChange={(e) => setFormData({...formData, alan: e.target.value})} required className="w-full">
                  <option value="">Seçiniz</option>
                  {alanOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bölüm</label>
                <input type="text" value={formData.bolum || ''} onChange={(e) => setFormData({...formData, bolum: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Eğitim Adı *</label>
                <input type="text" value={formData.egitim || ''} onChange={(e) => setFormData({...formData, egitim: e.target.value})} required className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Eğitmen</label>
                <input type="text" value={formData.egitmen || ''} onChange={(e) => setFormData({...formData, egitmen: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">İçerik Takip</label>
                <select value={formData.icerikTakip || ''} onChange={(e) => setFormData({...formData, icerikTakip: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  {icerikTakipOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Durum</label>
                <select value={formData.durum || ''} onChange={(e) => setFormData({...formData, durum: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  {durumOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">İçerik Başlama Tarihi</label>
                <input type="date" value={formData.icerikBaslama || ''} onChange={(e) => setFormData({...formData, icerikBaslama: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Çekim Başlama Tarihi</label>
                <input type="date" value={formData.cekimBaslama || ''} onChange={(e) => setFormData({...formData, cekimBaslama: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Montaj Başlama Tarihi</label>
                <input type="date" value={formData.montajBaslama || ''} onChange={(e) => setFormData({...formData, montajBaslama: e.target.value})} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Montaj Sorumlusu</label>
                <select value={formData.montajSorumlusu || ''} onChange={(e) => setFormData({...formData, montajSorumlusu: e.target.value})} className="w-full">
                  <option value="">Seçiniz</option>
                  {montajSorumlusuOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Yayın Tarihi</label>
                <input type="date" value={formData.yayinTarihi || ''} onChange={(e) => setFormData({...formData, yayinTarihi: e.target.value})} className="w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Notlar</label>
                <textarea value={formData.notlar || ''} onChange={(e) => setFormData({...formData, notlar: e.target.value})} rows="3" className="w-full"></textarea>
              </div>
              <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">İptal</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">💾 Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
