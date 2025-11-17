import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-indigo-600">📚 Eğitim Takip Sistemi</h1>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Hoş Geldiniz</h2>
          <p className="text-xl text-gray-600">Eğitim, çekim ve montaj süreçlerinizi kolayca yönetin</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/egitim-takip" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="text-center">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Eğitim Takip</h3>
              <p className="text-gray-600">Eğitimleri yönet ve takip et</p>
            </div>
          </Link>

          <Link href="/cekim-takip" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="text-center">
              <div className="text-5xl mb-4">🎥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Çekim Takip</h3>
              <p className="text-gray-600">Çekim süreçlerini izle</p>
            </div>
          </Link>

          <Link href="/montaj-takip" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="text-center">
              <div className="text-5xl mb-4">✂️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Montaj Takip</h3>
              <p className="text-gray-600">Montaj durumunu kontrol et</p>
            </div>
          </Link>

          <Link href="/dashboard" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Dashboard</h3>
              <p className="text-gray-600">İstatistikleri görüntüle</p>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 Hızlı Başlangıç</h3>
            <ol className="text-left space-y-3 text-gray-700">
              <li>1️⃣ <strong>Eğitim Takip:</strong> Yeni eğitimler ekleyin ve durumlarını güncelleyin</li>
              <li>2️⃣ <strong>Çekim Takip:</strong> Çekim aşamalarını kaydedin</li>
              <li>3️⃣ <strong>Montaj Takip:</strong> Montaj süreçlerini yönetin</li>
              <li>4️⃣ <strong>Dashboard:</strong> Tüm istatistikleri tek ekranda görün</li>
            </ol>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-16 py-6">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>© 2024 Eğitim Takip Sistemi - Tüm hakları saklıdır</p>
        </div>
      </footer>
    </div>
  )
}
