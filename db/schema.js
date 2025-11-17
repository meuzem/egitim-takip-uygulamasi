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

// Çekim Takip Tablosu
export const cekimTakip = pgTable('cekim_takip', {
  id: serial('id').primaryKey(),
  egitimAdi: varchar('egitim_adi', { length: 300 }).notNull(),
  egitmenAdi: varchar('egitmen_adi', { length: 200 }),
  cekimSorumlusu: varchar('cekim_sorumlusu', { length: 100 }),
  videoAdi: varchar('video_adi', { length: 300 }),
  cekimTarihi: varchar('cekim_tarihi', { length: 20 }),
  onCekim: varchar('on_cekim', { length: 50 }),
  izlence: varchar('izlence', { length: 200 }),
  isik: varchar('isik', { length: 100 }),
  fotografCekimi: varchar('fotograf_cekimi', { length: 50 }),
  fotografTarih: varchar('fotograf_tarih', { length: 20 }),
  cekimKontrol: varchar('cekim_kontrol', { length: 50 }),
  kontrolTarih: varchar('kontrol_tarih', { length: 20 }),
  tasnif: varchar('tasnif', { length: 50 }),
  dipSes: varchar('dip_ses', { length: 50 }),
  cekimTamamlandi: varchar('cekim_tamamlandi', { length: 50 }),
  synology: varchar('synology', { length: 50 }),
  synologyKlasor: varchar('synology_klasor', { length: 300 }),
  videKodu: varchar('vide_kodu', { length: 100 }),
  cekimYapanlar: text('cekim_yapanlar'),
  notlar: text('notlar'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Montaj Takip Tablosu
export const montajTakip = pgTable('montaj_takip', {
  id: serial('id').primaryKey(),
  egitimAdi: varchar('egitim_adi', { length: 300 }).notNull(),
  egitmenAdi: varchar('egitmen_adi', { length: 200 }),
  montajSorumlusu: varchar('montaj_sorumlusu', { length: 100 }),
  videoAdi: varchar('video_adi', { length: 300 }),
  icerikUzmani: varchar('icerik_uzmani', { length: 200 }),
  montajBaslama: varchar('montaj_baslama', { length: 20 }),
  revizeTarihi: varchar('revize_tarihi', { length: 20 }),
  isik: varchar('isik', { length: 100 }),
  montajDurumu: varchar('montaj_durumu', { length: 100 }),
  montajTamamlandi: varchar('montaj_tamamlandi', { length: 50 }),
  notlar: text('notlar'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
