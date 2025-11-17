import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MontajTakip() {
  const [data, setData] = useState([])

  useEffect(() => {
    const sampleData = [
      { egitimAdi: 'React Temelleri', egitmenAdi: 'Ahmet Yılmaz', montajSorumlusu: 'Hasan Taşdemir', videoAdi: 'Ders 1 - Giriş', icerikUzmani: 'Meltem Ermez', montajBaslama: '2024-02-10', revizeTarihi: '', isik: 'Sadi Demirci', montajDurumu: 'Montajda', montajTamamlandi: 'Hayır', notlar: '' }
    ]
    setData(sampleData)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">✂️ Montaj Takip</Link>
          <div className="space-x-4">
            <Link href="/egitim-takip" className="text-gray-600 hover:text-indigo-600">Eğitim Takip</Link>
            <Link href="/cekim-takip" className="text-gray-600 hover:text-indigo-600">Çekim Takip</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">🎞️ Montaj Listesi ({data.length})</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
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
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
