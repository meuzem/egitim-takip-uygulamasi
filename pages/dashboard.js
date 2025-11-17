import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const [stats, setStats] = useState({
    toplamEgitim: 120,
    cekimde: 25,
    montajda: 18,
    yayinda: 77
  })

  const durumData = {
    labels: ['Çekimde', 'Montajda', 'Yayında', 'Planlanıyor'],
    datasets: [{
      data: [25, 18, 77, 15],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
    }]
  }

  const aylikData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [{
      label: 'Yayına Çıkan Eğitimler',
      data: [12, 15, 18, 14, 20, 16],
      backgroundColor: '#4f46e5'
    }]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">📊 Dashboard</Link>
          <div className="space-x-4">
            <Link href="/" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">🏠 Ana Sayfa</Link>
            <Link href="/egitim-takip" className="text-gray-600 hover:text-indigo-600">Eğitim Takip</Link>
            <Link href="/cekim-takip" className="text-gray-600 hover:text-indigo-600">Çekim Takip</Link>
            <Link href="/montaj-takip" className="text-gray-600 hover:text-indigo-600">Montaj Takip</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">İstatistikler ve Raporlar</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold">{stats.toplamEgitim}</div>
            <div className="text-blue-100">Toplam Eğitim</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-4xl mb-2">🎥</div>
            <div className="text-3xl font-bold">{stats.cekimde}</div>
            <div className="text-purple-100">Çekimde</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-4xl mb-2">✂️</div>
            <div className="text-3xl font-bold">{stats.montajda}</div>
            <div className="text-indigo-100">Montajda</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold">{stats.yayinda}</div>
            <div className="text-green-100">Yayında</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Durum Dağılımı</h3>
            <div className="h-64 flex items-center justify-center">
              <Pie data={durumData} options={{maintainAspectRatio: false}} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Aylık Yayın Performansı</h3>
            <div className="h-64">
              <Bar data={aylikData} options={{maintainAspectRatio: false, responsive: true}} />
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">🔥 Hızlı Özet</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="text-sm text-gray-600">Ortalama Tamamlanma Süresi</div>
              <div className="text-2xl font-bold text-gray-800">45 gün</div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="text-sm text-gray-600">Bu Ay Tamamlanan</div>
              <div className="text-2xl font-bold text-gray-800">16 eğitim</div>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-sm text-gray-600">Bekleyen Onay</div>
              <div className="text-2xl font-bold text-gray-800">8 eğitim</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
