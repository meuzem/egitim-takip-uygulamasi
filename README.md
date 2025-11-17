# 📚 Eğitim Takip ve Çekim Montaj Uygulaması

Modern ve profesyonel eğitim takip sistemi. React.js ve Next.js ile geliştirilmiş, Google Sheets entegrasyonu ile veri yönetimi.

🔗 **Canlı Demo:** [egitim-takip-otomasyonu.vercel.app](https://egitim-takip-otomasyonu.vercel.app)

## ✨ Özellikler

### 📖 Eğitim Takip
- Tüm eğitimleri tek ekranda görüntüleme
- Dal, Alan ve Durum filtreleri
- Eğitmen ve içerik takipçi atamaları
- Tarih takibi (İçerik, Çekim, Montaj, Yayın)
- Detaylı notlar

### 🎥 Çekim Takip
- Çekim süreçlerini adım adım izleme
- Çekim sorumluları ve ekip yönetimi
- Fotoğraf çekimi takibi
- Synology entegrasyonu
- Dip ses ve tasnif kontrolleri

### ✂️ Montaj Takip
- Montaj aşamalarını takip
- Montaj sorumlusu ataması
- Revize tarihçesi
- İçerik uzmanı kontrolü

### 📊 Dashboard
- Gerçek zamanlı istatistikler
- Görsel grafikler (Pie, Bar charts)
- Toplam, Çekimde, Montajda, Yayında sayıları
- Aylık performans raporları

## 🚀 Kurulum

### Gereksinimler
- Node.js 18.0 veya üzeri
- npm veya yarn

### Adımlar

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/meuzem/egitim-takip-uygulamasi.git
cd egitim-takip-uygulamasi
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
# veya
yarn install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
# veya
yarn dev
```

4. **Tarayıcıda açın:**
[http://localhost:3000](http://localhost:3000)

## 📦 Teknolojiler

- **Frontend Framework:** Next.js 14
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Charts:** Chart.js & react-chartjs-2
- **API Requests:** Axios
- **Database:** Google Sheets API

## 📁 Proje Yapısı

```
egitim-takip-uygulamasi/
├── pages/
│   ├── index.js           # Ana sayfa
│   ├── egitim-takip.js    # Eğitim takip sayfası
│   ├── cekim-takip.js     # Çekim takip sayfası
│   ├── montaj-takip.js    # Montaj takip sayfası
│   ├── dashboard.js       # Dashboard
│   └── _app.js            # App wrapper
├── styles/
│   └── globals.css        # Global stiller
├── package.json
├── next.config.js
└── README.md
```

## 🎨 Sayfalar

### Ana Sayfa
Modern ve kullanıcı dostu arayüz ile tüm bölümlere kolay erişim.

### Eğitim Takip
- 13 kolon ile detaylı eğitim takibi
- Filtreleme ve arama özellikleri
- Kolay veri girişi

### Çekim Takip
- 20 kolon ile kapsamlı çekim yönetimi
- Aşama bazlı onay sistemi
- Synology entegrasyonu

### Montaj Takip
- 11 kolon ile montaj süreci takibi
- Revize yönetimi
- Durum güncellemeleri

### Dashboard
- Görsel istatistikler
- Pasta ve çubuk grafikleri
- Hızlı özet kartları

## 🔧 Yapılandırma

### Google Sheets Entegrasyonu
1. Google Cloud Console'da proje oluşturun
2. Sheets API'yi aktif edin
3. Service Account oluşturun
4. `.env.local` dosyasına kimlik bilgilerinizi ekleyin:

```env
GOOGLE_SHEETS_ID=your_sheet_id_here
GOOGLE_CLIENT_EMAIL=your_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your_private_key_here
```

## 📊 Veritabanı Yapısı

Google Sheets üzerinde 4 sayfa:
1. **Eğitim Takip** - Ana eğitim verileri
2. **Çekim Takip** - Çekim süreç verileri
3. **Montaj Takip** - Montaj süreç verileri
4. **Dashboard** - İstatistik verileri

## 🚢 Deployment

### Vercel (Önerilen)

1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Environment variables ekleyin
4. Deploy edin!

### Diğer Platformlar
- Netlify
- AWS Amplify
- Heroku

## 👥 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje özel kullanım için geliştirilmiştir.

## 📞 İletişim

Proje Sahibi: [@meuzem](https://github.com/meuzem)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
