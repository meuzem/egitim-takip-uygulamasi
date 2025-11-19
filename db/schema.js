// Drizzle ORM Schema - Neon PostgreSQL
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// Eğitim Takip Tablosu
export const egitimTakip = pgTable('egitim_takip', {
  id: serial('id').primaryKey(),
  dal: varchar('dal', { length: 100 }),
  alan: varchar('alan', { length: 100 }),
  bolum: varchar('bolum', { length: 200 }),
  egitim: varchar('egitim', { length: 300 }).notNull(),
  egitmen: varchar('egitmen', { length: 200 }),
  icerikTakip: varchar('icerik_takip', { length: 200 }),
  durum: varchar('durum', { length: 100 }),
  icerikBaslama: varchar('icerik_baslama', { length: 20 }),
  cekimBaslama: varchar('cekim_baslama', { length: 20 }),
  montajBaslama: varchar('montaj_baslama', { length: 20 }),
  montajSorumlusu: varchar('montaj_sorumlusu', { length: 100 }),
  yayinTarihi: varchar('yayin_tarihi', { length: 20 }),
  notlar: text('notlar'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Çekim Takip Tablosu - YENİ ALANLAR EKLENDI
export const cekimTakip = pgTable('cekim_takip', {
  id: serial('id').primaryKey(),
  egitimAdi: varchar('egitim_adi', { length: 300 }).notNull(),
  egitmenAdi: varchar('egitmen_adi', { length: 200 }),
  cekimSorumlusu: varchar('cekim_sorumlusu', { length: 100 }),
  videoAdi: text('video_adi'),
  cekimBaslamaTarihi: varchar('cekim_baslama_tarihi', { length: 20 }),
  onCekim: varchar('on_cekim', { length: 50 }),
  onCekimTarihi: varchar('on_cekim_tarihi', { length: 20 }),
  izlence: varchar('izlence', { length: 200 }),
  isikSorumlu: varchar('isik_sorumlu', { length: 100 }),
  cekimDurumu: varchar('cekim_durumu', { length: 100 }),
  cekimBitisTarihi: varchar('cekim_bitis_tarihi', { length: 20 }),
  fotografCekimleri: varchar('fotograf_cekimleri', { length: 50 }),
  fotografCekimYapan: varchar('fotograf_cekim_yapan', { length: 100 }),
  fotografCekimTarihi: varchar('fotograf_cekim_tarihi', { length: 20 }),
  cekimKontrolleri: varchar('cekim_kontrolleri', { length: 50 }),
  cekimKontrolTarihi: varchar('cekim_kontrol_tarihi', { length: 20 }),
  cekimKontrolYapan: varchar('cekim_kontrol_yapan', { length: 100 }),
  tasnif: varchar('tasnif', { length: 50 }),
  tasnifYapan: varchar('tasnif_yapan', { length: 100 }),
  dipSesTem: varchar('dip_ses_tem', { length: 50 }),
  cekim: varchar('cekim', { length: 50 }),
  synology: varchar('synology', { length: 50 }),
  synologyKlasor: varchar('synology_klasor', { length: 300 }),
  videoKodu: varchar('video_kodu', { length: 100 }),
  cekimYapanlar: text('cekim_yapanlar'),
  notlar: text('notlar'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Montaj Takip Tablosu - YENİ ALANLAR EKLENDI
export const montajTakip = pgTable('montaj_takip', {
  id: serial('id').primaryKey(),
  egitimAdi: varchar('egitim_adi', { length: 300 }).notNull(),
  egitmenAdi: varchar('egitmen_adi', { length: 200 }),
  montajSorumlusu: varchar('montaj_sorumlusu', { length: 100 }),
  bitenVideoAdi: text('biten_video_adi'),
  icerikUzmani: varchar('icerik_uzmani', { length: 200 }),
  montajBaslamaTarihi: varchar('montaj_baslama_tarihi', { length: 20 }),
  revize1Tarihi: varchar('revize1_tarihi', { length: 20 }),
  revize2Tarihi: varchar('revize2_tarihi', { length: 20 }),
  montajDurumu: varchar('montaj_durumu', { length: 100 }),
  montajBitisTarihi: varchar('montaj_bitis_tarihi', { length: 20 }),
  montaj: varchar('montaj', { length: 50 }),
  notlar: text('notlar'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
