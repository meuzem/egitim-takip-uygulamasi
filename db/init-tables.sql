-- Neon PostgreSQL Tablo Oluşturma Scripti
-- Bu scripti Neon Console SQL Editor'de çalıştırın

-- Eğitim Takip Tablosu
CREATE TABLE IF NOT EXISTS egitim_takip (
    id SERIAL PRIMARY KEY,
    dal VARCHAR(100),
    alan VARCHAR(100),
    bolum VARCHAR(200),
    egitim VARCHAR(300) NOT NULL,
    egitmen VARCHAR(200),
    icerik_takip VARCHAR(200),
    durum VARCHAR(100),
    icerik_baslama VARCHAR(20),
    cekim_baslama VARCHAR(20),
    montaj_baslama VARCHAR(20),
    montaj_sorumlusu VARCHAR(100),
    yayin_tarihi VARCHAR(20),
    notlar TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Çekim Takip Tablosu
CREATE TABLE IF NOT EXISTS cekim_takip (
    id SERIAL PRIMARY KEY,
    egitim_adi VARCHAR(300) NOT NULL,
    egitmen_adi VARCHAR(200),
    cekim_sorumlusu VARCHAR(100),
    video_adi VARCHAR(300),
    cekim_tarihi VARCHAR(20),
    on_cekim VARCHAR(50),
    izlence VARCHAR(200),
    isik VARCHAR(100),
    fotograf_cekimi VARCHAR(50),
    fotograf_tarih VARCHAR(20),
    cekim_kontrol VARCHAR(50),
    kontrol_tarih VARCHAR(20),
    tasnif VARCHAR(50),
    dip_ses VARCHAR(50),
    cekim_tamamlandi VARCHAR(50),
    synology VARCHAR(50),
    synology_klasor VARCHAR(300),
    vide_kodu VARCHAR(100),
    cekim_yapanlar TEXT,
    notlar TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Montaj Takip Tablosu
CREATE TABLE IF NOT EXISTS montaj_takip (
    id SERIAL PRIMARY KEY,
    egitim_adi VARCHAR(300) NOT NULL,
    egitmen_adi VARCHAR(200),
    montaj_sorumlusu VARCHAR(100),
    video_adi VARCHAR(300),
    icerik_uzmani VARCHAR(200),
    montaj_baslama VARCHAR(20),
    revize_tarihi VARCHAR(20),
    isik VARCHAR(100),
    montaj_durumu VARCHAR(100),
    montaj_tamamlandi VARCHAR(50),
    notlar TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index'ler (performans için)
CREATE INDEX IF NOT EXISTS idx_egitim_durum ON egitim_takip(durum);
CREATE INDEX IF NOT EXISTS idx_egitim_dal ON egitim_takip(dal);
CREATE INDEX IF NOT EXISTS idx_egitim_alan ON egitim_takip(alan);
CREATE INDEX IF NOT EXISTS idx_cekim_egitim ON cekim_takip(egitim_adi);
CREATE INDEX IF NOT EXISTS idx_montaj_egitim ON montaj_takip(egitim_adi);

SELECT 'Tüm tablolar başarıyla oluşturuldu!' AS status;
