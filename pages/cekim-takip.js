import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSheetsData, addRowToSheet, updateRow, deleteRow } from '../lib/sheets'

const SORUMLULAR = [
  'Gülnur Kılıç', 'Sadi Demirci', 'Soner Ulu'
];
const ICERIK_UZM = [
  'Arzu Mantar', 'Meltem Ermez', 'Nezahat Kara', 'Sevim Aydın Verim'
];
const YAPILDI_YAPILMADI = ['Yapıldı', 'Yapılmadı'];
const KAYDEDILDI_KAYDEDILMEDI = ['Kaydedildi', 'Kaydedilmedi'];
const TAMAMLANDI_TAMAMLANMADI = ['Tamamlandı', 'Tamamlanmadı'];

export default function CekimTakip() {
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const result = await getSheetsData('Çekim Takip')
    setData(result.data || [])
  }

  const openModal = (index = null) => {
    if (index !== null) {
      setEditingIndex(index)
      setFormData(data[index])
    } else {
      setEditingIndex(null)
      setFormData({
        egitimAdi: '',
        egitmenAdi: '',
        cekimSorumlusu: '',
        videoAdi: '',
        cekimTarihi: '',
        onCekim: '',
        onCekimTarih: '',
        izlence: '',
        isikSorumlu: '',
        fotografCekimi: '',
        fotografCekimYapan: '',
        fotografCekimTarih: '',
        cekimKontrolleri: '',
        cekimKontrolTarih: '',
        cekimKontrolYapan: '',
        tasnif: '',
        tasnifYapan: '',
        dipSesTemizlik: '',
        cekimDurum: '',
        synology: '',
        synologyKlasor: '',
        videoKodu: '',
        cekimYapanlar: '',
        notlar: ''
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingIndex !== null) {
        await updateRow('Çekim Takip', editingIndex, formData)
      } else {
        await addRowToSheet('Çekim Takip', formData)
      }
      await loadData()
      setShowModal(false)
      alert('Başarıyla kaydedildi!')
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  const handleDelete = async (index) => {
    if (confirm('Silmek istediğinize emin misiniz?')) {
      try {
        await deleteRow('Çekim Takip', index)
        loadData()
        alert('Kayıt silindi!')
      } catch (error) {
        alert('Hata: ' + error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">📹 Çekim Takip</Link>
          <div className="space-x-4">
            <Link href="/" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">🏠 Ana Sayfa</Link>
            <Link href="/egitim-takip" className="text-gray-600 hover:text-indigo-600">Eğitim Takip</Link>
            <Link href="/montaj-takip" className="text-gray-600 hover:text-indigo-600">Montaj Takip</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col">
          <h2 className="text-xl font-bold mb-4">📋 Çekim Listesi ({data.length})</h2>
          <button onClick={() => openModal()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            ➕ Yeni Çekim Ekle
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-auto">
          <table>
            <thead>
              <tr>
                <th>İşlemler</th>
                <th>Eğitim Adı</th>
                <th>Eğitmen Adı Soyadı</th>
                <th>Eğitim Çekim Sorumlusu</th>
                <th>Video Adı</th>
                <th>Çekim Tarihi</th>
                <th>Ön Çekim</th>
                <th>Ön Çekim Tarihi</th>
                <th>İzlence (İçerik Uzm.)</th>
                <th>Işık (Sorumlu)</th>
                <th>Fotoğraf Çekimleri</th>
                <th>Fotoğraf Çekim Yapan</th>
                <th>Fotoğraf Çekim Tarihi</th>
                <th>Çekim Kontrolleri</th>
                <th>Çekim Kontrol Tarihi</th>
                <th>Çekim Kontrolü Yapan</th>
                <th>Tasnif</th>
                <th>Tasnif Yapan</th>
                <th>Videolarda Dip Ses Temizliği</th>
                <th>Çekim</th>
                <th>Synology</th>
                <th>Synology Klasörünün Adı</th>
                <th>Videonun Synology'deki Adı (kodu)</th>
                <th>Çekim Yapanlar</th>
                <th>Varsa Ek Notlar</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>
                    <button onClick={() => openModal(index)} className="px-3 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600">✏️</button>
                    <button onClick={() => handleDelete(index)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">🗑️</button>
                  </td>
                  <td>{row.egitimAdi}</td>
                  <td>{row.egitmenAdi}</td>
                  <td>{row.cekimSorumlusu}</td>
                  <td>{row.videoAdi}</td>
                  <td>{row.cekimTarihi}</td>
                  <td>{row.onCekim}</td>
                  <td>{row.onCekimTarih}</td>
                  <td>{row.izlence}</td>
                  <td>{row.isikSorumlu}</td>
                  <td>{row.fotografCekimi}</td>
                  <td>{row.fotografCekimYapan}</td>
                  <td>{row.fotografCekimTarih}</td>
                  <td>{row.cekimKontrolleri}</td>
                  <td>{row.cekimKontrolTarih}</td>
                  <td>{row.cekimKontrolYapan}</td>
                  <td>{row.tasnif}</td>
                  <td>{row.tasnifYapan}</td>
                  <td>{row.dipSesTemizlik}</td>
                  <td>{row.cekimDurum}</td>
                  <td>{row.synology}</td>
                  <td>{row.synologyKlasor}</td>
                  <td>{row.videoKodu}</td>
                  <td>{row.cekimYapanlar}</td>
                  <td>{row.notlar}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={25} className="text-center text-gray-400 py-10">Henüz veri yok. Yeni çekim ekleyin.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full overflow-y-scroll" style={{maxHeight:'90vh'}}>
              <h3 className="text-2xl font-bold mb-4">{editingIndex !== null ? "✏️ Çekimi Düzenle" : "➕ Yeni Çekim Ekle"}</h3>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div><label> Eğitim Adı* </label>
                  <input required value={formData.egitimAdi||''} onChange={e=>setFormData({...formData,egitimAdi:e.target.value})} className="w-full"/>
                </div>
                <div><label> Eğitmen Adı Soyadı </label>
                  <input value={formData.egitmenAdi||''} onChange={e=>setFormData({...formData,egitmenAdi:e.target.value})} className="w-full"/>
                </div>
                <div><label> Eğitim Çekim Sorumlusu </label>
                  <select value={formData.cekimSorumlusu||''} onChange={e=>setFormData({...formData,cekimSorumlusu:e.target.value})} className="w-full">
                    <option value="">Seçiniz</option>
                    {SORUMLULAR.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label> Video Adı </label>
                  <input value={formData.videoAdi||''} onChange={e=>setFormData({...formData,videoAdi:e.target.value})} className="w-full"/>
                </div>
                <div><label> Çekim Tarihi </label>
                  <input type="date" value={formData.cekimTarihi||''} onChange={e=>setFormData({...formData,cekimTarihi:e.target.value})} className="w-full"/>
                </div>
                <div><label> Ön Çekim </label>
                  <select value={formData.onCekim||''} onChange={e=>setFormData({...formData,onCekim:e.target.value})} className="w-full">
                    <option value="">Seçiniz</option>
                    {YAPILDI_YAPILMADI.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label> Ön Çekim Tarihi </label>
                  <input type="date" value={formData.onCekimTarih||''} onChange={e=>setFormData({...formData,onCekimTarih:e.target.value})} className="w-full"/>
                </div>
                <div><label> İzlence (İçerik Uzm.) </label>
                  <select value={formData.izlence||''} onChange={e=>setFormData({...formData,izlence:e.target.value})} className="w-full">
                    <option value="">Seçiniz</option>
                    {ICERIK_UZM.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label> Işık (Sorumlu) </label>
                  <select value={formData.isikSorumlu||''} onChange={e=>setFormData({...formData,isikSorumlu:e.target.value})} className="w-full">
                    <option value="">Seçiniz</option>
                    {SORUMLULAR.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label> Fotoğraf Çekimleri </label>
                  <select value={formData.fotografCekimi||''} onChange={e=>setFormData({...formData,fotografCekimi:e.target.value})} className="w-full">
                    <option value="">Seçiniz</option>
                    {YAPILDI_YAPILMADI.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label> Fotoğraf Çekim Yapan </label>
                  <select value={formData.fotografCekimYapan||''} onChange={e=>setFormData({...formData,fotografCekimYapan:e.target.value})} className="w-full">
                    <option value="">Seçiniz</option>
                    {SORUMLULAR.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label> Fotoğraf Çekim Tarihi </label>
                  <input type="date" value={formData.fotografCekimTarih||''} onChange={e=>setFormData({...formData,fotografCekimTarih:e.target.value})} className="w-full"/>
                </div>
                <div><label> Çekim Kontrolleri </label>
                  <select value={formData.cekimKontrolleri||''} onChange={e=>setFormData({...formData,cekimKontrolleri:e.target.value})} className="w-full" >
                    <option value="">Seçiniz</option>
                    {YAPILDI_YAPILMADI.map(opt=> <option key={opt} value={opt}>{opt}</option>) }
                  </select>
                </div>
                <div><label> Çekim Kontrol Tarihi </label>
                  <input type="date" value={formData.cekimKontrolTarih||''} onChange={e=>setFormData({...formData,cekimKontrolTarih:e.target.value})} className="w-full"/>
                </div>
                <div><label> Çekim Kontrolü Yapan </label>
                  <select value={formData.cekimKontrolYapan||''} onChange={e=>setFormData({...formData,cekimKontrolYapan:e.target.value})} className="w-full" >
                    <option value="">Seçiniz</option>
                    {SORUMLULAR.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label> Tasnif </label>
                  <select value={formData.tasnif||''} onChange={e=>setFormData({...formData,tasnif:e.target.value})} className="w-full" >
                    <option value="">Seçiniz</option>
                    {YAPILDI_YAPILMADI.map(opt=> <option key={opt} value={opt}>{opt}</option>) }
                  </select>
                </div>
                <div><label> Tasnif Yapan </label>
                  <select value={formData.tasnifYapan||''} onChange={e=>setFormData({...formData,tasnifYapan:e.target.value})} className="w-full" >
                    <option value="">Seçiniz</option>
                    {SORUMLULAR.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label> Videolarda Dip Ses Temizliği </label>
                  <select value={formData.dipSesTemizlik||''} onChange={e=>setFormData({...formData,dipSesTemizlik:e.target.value})} className="w-full" >
                    <option value="">Seçiniz</option>
                    {YAPILDI_YAPILMADI.map(opt=> <option key={opt} value={opt}>{opt}</option>) }
                  </select>
                </div>
                <div><label> Çekim </label>
                  <select value={formData.cekimDurum||''} onChange={e=>setFormData({...formData,cekimDurum:e.target.value})} className="w-full" >
                    <option value="">Seçiniz</option>
                    {TAMAMLANDI_TAMAMLANMADI.map(opt=> <option key={opt} value={opt}>{opt}</option>) }
                  </select>
                </div>
                <div><label> Synology </label>
                  <select value={formData.synology||''} onChange={e=>setFormData({...formData,synology:e.target.value})} className="w-full" >
                    <option value="">Seçiniz</option>
                    {KAYDEDILDI_KAYDEDILMEDI.map(opt=> <option key={opt} value={opt}>{opt}</option>) }
                  </select>
                </div>
                <div><label> Synology Klasörünün Adı </label>
                  <input value={formData.synologyKlasor||''} onChange={e=>setFormData({...formData,synologyKlasor:e.target.value})} className="w-full" />
                </div>
                <div><label> Videonun Synology'deki Adı (kodu) </label>
                  <input value={formData.videoKodu||''} onChange={e=>setFormData({...formData,videoKodu:e.target.value})} className="w-full" />
                </div>
                <div><label> Çekim Yapanlar </label>
                  <select value={formData.cekimYapanlar||''} onChange={e=>setFormData({...formData,cekimYapanlar:e.target.value})} className="w-full" >
                    <option value="">Seçiniz</option>
                    {SORUMLULAR.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label >Varsa Ek Notlar</label>
                  <textarea value={formData.notlar||''} onChange={e=>setFormData({...formData,notlar:e.target.value})} rows={2} className="w-full" />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">İptal</button>
                  <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">{editingIndex !== null ? "Güncelle" : "Ekle"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
