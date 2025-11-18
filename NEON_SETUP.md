# 📝 NEON VERITABANI KURULUM

## ADIM 1: SQL Scriptini Çalıştır

1. Neon Console'a git: https://console.neon.tech/app/projects/super-base-39701874
2. Sol menüden **SQL Editor** seç
3. Aşağıdaki komutu çalıştır (db/init-tables.sql içeriği):

```sql
-- db/init-tables.sql içeriğini buraya yapıştır ve Run'a bas
```

4. "Tüm tablolar başarıyla oluşturuldu!" mesajını gör

## ADIM 2: Tabloları Kontrol Et

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

Şu tablolar görünmeli:
- egitim_takip ✅
- cekim_takip ✅
- montaj_takip ✅

## ADIM 3: Test (Opsiyonel)

```sql
INSERT INTO egitim_takip (dal, alan, egitim, durum) 
VALUES ('Mesleki ve Teknik', 'Bilişim Teknolojileri', 'Test Eğitimi', 'Eğitim Planlanıyor');

SELECT * FROM egitim_takip;
```

✅ HAZIR! Vercel deploy sonrası kaydetme çalışacak.
