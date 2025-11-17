import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function EgitimTakip() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
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
    // Google Sheets'ten veri çekmek için API endpoint'i eklenecek
    // Şimdilik örnek veri
    const sampleData = [
      { dal: 'Mesleki ve Teknik', alan: 'Bilişim Teknolojileri', bolum: 'Web Geliştirme', egitim: 'React Temelleri', egitmen: 'Ahmet Yılmaz', icerikTakip: 'Meltem Ermez', durum: 'Çekimde', icerikBaslama: '2024-01-15', cekimBaslama: '2024-02-01', montajBaslama: '', montajSorumlusu: '', yayinTarihi: '', notlar: '' }
    ]
    setData(sampleData)
    setFilteredData(sampleData)
  }, [])

  useEffect(() => {
    let filtered = data
    if (filters.dal) filtered = filtered.filter(item => item.dal === filters.dal)
    if (filters.alan) filtered = filtered.filter(item => item.alan === filters.alan)
    if (filters.durum) filtered = filtered.filter(item => item.durum === filters.durum)
    setFilteredData(filtered)
  }, [filters, data])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">📚 Eğitim Takip</Link>
          <div className="space-x-4">
            <Link href="/cekim-takip" className="text-gray-600 hover:text-indigo-600">Çekim Takip</Link>
            <Link href="/montaj-takip" className="text-gray-600 hover:text-indigo-600">Montaj Takip</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔍 Filtreler</h2>
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
          <div className="table-container">
            <table>
              <thead>
                <tr>
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
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
