import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CekimTakip() {
  const [data, setData] = useState([])

  useEffect(() => {
    const sampleData = [
      { egitimAdi: 'React Temelleri', egitmenAdi: 'Ahmet Yılmaz', cekimSorumlusu: 'Gülnur Kılıç', videoAdi: 'Ders 1 - Giriş', cekimTarihi: '2024-02-05', onCekim: 'Evet', izlence: 'Meltem Ermez', isik: 'Sadi Demirci', fotografCekimi: 'Evet', fotografTarih: '2024-02-05', cekimKontrol: 'Evet', kontrolTarih: '2024-02-06', tasnif: 'Hayır', dipSes: 'Hayır', cekimTamamlandi: 'Hayır', synology: 'Hayır', synologyKlasor: '', videKodu: '', cekimYapanlar: 'Gülnur Kılıç, Sadi Demirci', notlar: '' }
    ]
    setData(sampleData)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">🎥 Çekim Takip</Link>
          <div className="space-x-4">
            <Link href="/egitim-takip" className="text-gray-600 hover:text-indigo-600">Eğitim Takip</Link>
            <Link href="/montaj-takip" className="text-gray-600 hover:text-indigo-600">Montaj Takip</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">🎬 Çekim Listesi ({data.length})</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
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
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
