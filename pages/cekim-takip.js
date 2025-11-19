import { useState, useEffect } from "react";
import Link from "next/link";
import { getSheetsData, addRowToSheet, updateRow, deleteRow } from '../lib/sheets';
import { exportToExcel } from '../lib/utils';

export default function CekimTakip() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({});

  const sorumluOpt = ["Gülnur Kılıç","Sadi Demirci","Soner Ulu"];
  const icerikUzmaniOpt = ["Arzu Mantar","Meltem Ermez","Nezahat Kara","Sevim Aydın Verim"];
  const cekimDurumuOpt = ["Başladı","Devam Ediyor","Tekrar Çekim","Bitti"];
  const fotografOpt = ["Yapıldı","Yapılmadı"];
  const kontrollerOpt = ["Yapıldı","Yapılmadı"];
  const tasnifOpt = ["Yapıldı","Yapılmadı"];
  const dipSesOpt = ["Yapıldı","Yapılmadı"];
  const cekimOpt = ["Tamamlandı","Tamamlanmadı"];
  const synologyOpt = ["Kaydedildi","Kaydedilmedi"];

  const [filters, setFilters] = useState({ egitimAdi:'', egitmenAdi:'', cekimDurumu:'', cekimSorumlusu:'' });

  useEffect(()=>{ getData(); },[]);
  useEffect(()=>{
    let d = data;
    if(filters.egitimAdi) d = d.filter(row=>row.egitimAdi===filters.egitimAdi);
    if(filters.egitmenAdi) d = d.filter(row=>row.egitmenAdi===filters.egitmenAdi);
    if(filters.cekimSorumlusu) d = d.filter(row=>row.cekimSorumlusu===filters.cekimSorumlusu);
    if(filters.cekimDurumu) d = d.filter(row=>row.cekimDurumu===filters.cekimDurumu);
    d = [...d].sort((a,b)=>(a.cekimDurumu==="Bitti"?1:0)-(b.cekimDurumu==="Bitti"?1:0));
    setFilteredData(d);
  },[filters,data]);

  async function getData() {
    const res = await getSheetsData("Çekim Takip");
    setData(res.data||[]);
  }
  function openModal(idx=null) {
    if(idx!==null) {
      setEditingIndex(idx); setFormData(filteredData[idx]);
    } else {
      setEditingIndex(null);
      setFormData({
        egitimAdi:"", egitmenAdi:"", cekimSorumlusu:"", videoAdi:"",
        cekimBaslamaTarihi:"", onCekim:"", onCekimTarihi:"", izlence:"",
        isikSorumlu:"", cekimDurumu:"", cekimBitisTarihi:"", fotografCekimleri:"",
        fotografCekimYapan:"", fotografCekimTarihi:"", cekimKontrolleri:"", cekimKontrolTarihi:"",
        cekimKontrolYapan:"", tasnif:"", tasnifYapan:"", dipSesTemizligi:"",
        cekim:"", synology:"", synologyKlasorAdi:"", videonunSynologydekiAdi:"",
        cekimYapanlar:"", notlar:""
      });
    }
    setShowModal(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if(editingIndex!==null) await updateRow("Çekim Takip", editingIndex, formData);
      else await addRowToSheet("Çekim Takip", formData);
      await getData(); setShowModal(false); alert("Başarıyla kaydedildi!");
    } catch(err) { alert("Kayıt hatası: "+err.message);}
  }

  async function handleDelete(idx) {
    if(!confirm("Silmek istediğinizden emin misiniz?")) return;
    try {
      await deleteRow("Çekim Takip", idx); await getData(); alert("Kayıt silindi!");
    } catch(err){ alert("Silme hatası: "+err.message);}
  }
  function handleExport() {
    exportToExcel(filteredData, "Cekim_Takip_"+new Date().toISOString().split("T")[0]);
  }
  function resetFilters() {
    setFilters({ egitimAdi:'', egitmenAdi:'', cekimDurumu:'', cekimSorumlusu:'' });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">🎥 Çekim Takip</Link>
          <div className="flex items-center gap-3">
            <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">📥 Excel İndir</button>
            <button onClick={()=>openModal()} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">➕ Yeni Çekim Ekle</button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-6 py-6">
        <div className="mb-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs mb-1">Eğitim Adı</label>
            <input type="text" className="w-32 border" value={filters.egitimAdi} onChange={e=>setFilters(f=>({...f, egitimAdi:e.target.value}))}/>
          </div>
          <div>
            <label className="block text-xs mb-1">Eğitmen Adı</label>
            <input type="text" className="w-32 border" value={filters.egitmenAdi} onChange={e=>setFilters(f=>({...f, egitmenAdi:e.target.value}))}/>
          </div>
          <div>
            <label className="block text-xs mb-1">Çekim Sorumlusu</label>
            <select className="w-32 border" value={filters.cekimSorumlusu} onChange={e=>setFilters(f=>({...f, cekimSorumlusu:e.target.value}))}>
              <option value="">Hepsi</option>
              {sorumluOpt.map(opt=>(<option key={opt}>{opt}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Çekim Durumu</label>
            <select className="w-32 border" value={filters.cekimDurumu} onChange={e=>setFilters(f=>({...f, cekimDurumu:e.target.value}))}>
              <option value="">Hepsi</option>
              {cekimDurumuOpt.map(opt=>(<option key={opt}>{opt}</option>))}
            </select>
          </div>
          <button onClick={resetFilters} className="text-xs text-gray-600 underline ml-2">Filtreleri Temizle</button>
        </div>
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th>İşlem</th>
                <th>Eğitim Adı</th>
                <th>Eğitmen</th>
                <th>Çekim Sorumlusu</th>
                <th>Video Adı</th>
                <th>Çekim Başlama</th>
                <th>On Çekim</th>
                <th>On Çekim Tarihi</th>
                <th>İzlence (Uzman)</th>
                <th>Işık (Sorumlu)</th>
                <th>Durum</th>
                <th>Bitiş</th>
                <th>Fot. Çekimleri</th>
                <th>Fot. Yapan</th>
                <th>Fot. Tarihi</th>
                <th>Çekim Kontrolleri</th>
                <th>Kontrol Tarihi</th>
                <th>Kontrol Yapan</th>
                <th>Tasnif</th>
                <th>Tasnif. Yapan</th>
                <th>Dip Ses Temizl.</th>
                <th>Çekim</th>
                <th>Synology</th>
                <th>Synology Klasörü</th>
                <th>Synology Adı</th>
                <th>Çekim Yapanlar</th>
                <th>Notlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row,idx)=>(
                <tr key={idx} className={row.cekimDurumu==="Bitti" ? "bg-green-100" : ""}>
                  <td className="whitespace-nowrap">
                    <button className="text-blue-600 text-xs mr-2" onClick={()=>openModal(idx)}>✏️</button>
                    <button className="text-red-600 text-xs" onClick={()=>handleDelete(idx)}>🗑️</button>
                  </td>
                  <td>{row.egitimAdi}</td>
                  <td>{row.egitmenAdi}</td>
                  <td>{row.cekimSorumlusu}</td>
                  <td>{row.videoAdi}</td>
                  <td>{row.cekimBaslamaTarihi}</td>
                  <td>{row.onCekim}</td>
                  <td>{row.onCekimTarihi}</td>
                  <td>{row.izlence}</td>
                  <td>{row.isikSorumlu}</td>
                  <td>{row.cekimDurumu}</td>
                  <td>{row.cekimBitisTarihi}</td>
                  <td>{row.fotografCekimleri}</td>
                  <td>{row.fotografCekimYapan}</td>
                  <td>{row.fotografCekimTarihi}</td>
                  <td>{row.cekimKontrolleri}</td>
                  <td>{row.cekimKontrolTarihi}</td>
                  <td>{row.cekimKontrolYapan}</td>
                  <td>{row.tasnif}</td>
                  <td>{row.tasnifYapan}</td>
                  <td>{row.dipSesTemizligi}</td>
                  <td>{row.cekim}</td>
                  <td>{row.synology}</td>
                  <td>{row.synologyKlasorAdi}</td>
                  <td>{row.videonunSynologydekiAdi}</td>
                  <td>{row.cekimYapanlar}</td>
                  <td>{row.notlar}</td>
                </tr>
              ))}
              {filteredData.length===0 && (
                <tr>
                  <td colSpan={27} className="text-center py-4 text-gray-400">Veri yok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-screen-lg max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 font-bold text-lg">{editingIndex!==null?"Düzenle":"Yeni Çekim Ekle"}</h3>
            <form className="grid md:grid-cols-3 gap-3" onSubmit={handleSubmit}>
              <input className="border p-2" placeholder="Eğitim Adı" required value={formData.egitimAdi||""} onChange={e=>setFormData(f=>({...f,egitimAdi:e.target.value}))}/>
              <input className="border p-2" placeholder="Eğitmen" value={formData.egitmenAdi||""} onChange={e=>setFormData(f=>({...f,egitmenAdi:e.target.value}))}/>
              <select className="border p-2" value={formData.cekimSorumlusu||""} onChange={e=>setFormData(f=>({...f,cekimSorumlusu:e.target.value}))}><option value="">Çekim Sorumlusu</option>{sorumluOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <input className="border p-2 md:col-span-2" placeholder="Video Adı" value={formData.videoAdi||""} onChange={e=>setFormData(f=>({...f,videoAdi:e.target.value}))}/>
              <input type="date" className="border p-2" placeholder="Başlama T." value={formData.cekimBaslamaTarihi||""} onChange={e=>setFormData(f=>({...f,cekimBaslamaTarihi:e.target.value}))}/>
              <select className="border p-2" value={formData.onCekim||""} onChange={e=>setFormData(f=>({...f,onCekim:e.target.value}))}><option value="">On Çekim</option>{["Yapıldı","Yapılmadı"].map(opt=><option key={opt}>{opt}</option>)}</select>
              <input type="date" className="border p-2" placeholder="On Çekim Tarihi" value={formData.onCekimTarihi||""} onChange={e=>setFormData(f=>({...f,onCekimTarihi:e.target.value}))}/>
              <select className="border p-2" value={formData.izlence||""} onChange={e=>setFormData(f=>({...f,izlence:e.target.value}))}><option value="">İzlence Uzmanı</option>{icerikUzmaniOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <select className="border p-2" value={formData.isikSorumlu||""} onChange={e=>setFormData(f=>({...f,isikSorumlu:e.target.value}))}><option value="">Işık Sorumlu</option>{sorumluOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <select className="border p-2" value={formData.cekimDurumu||""} onChange={e=>setFormData(f=>({...f,cekimDurumu:e.target.value}))}><option value="">Çekim Durumu</option>{cekimDurumuOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <input type="date" className="border p-2" placeholder="Bitiş T." value={formData.cekimBitisTarihi||""} onChange={e=>setFormData(f=>({...f,cekimBitisTarihi:e.target.value}))}/>
              <select className="border p-2" value={formData.fotografCekimleri||""} onChange={e=>setFormData(f=>({...f,fotografCekimleri:e.target.value}))}><option value="">Fotograf Çekimleri</option>{fotografOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <select className="border p-2" value={formData.fotografCekimYapan||""} onChange={e=>setFormData(f=>({...f,fotografCekimYapan:e.target.value}))}><option value="">Çeken</option>{sorumluOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <input type="date" className="border p-2" placeholder="Fotograf Çekim Tarihi" value={formData.fotografCekimTarihi||""} onChange={e=>setFormData(f=>({...f,fotografCekimTarihi:e.target.value}))}/>
              <select className="border p-2" value={formData.cekimKontrolleri||""} onChange={e=>setFormData(f=>({...f,cekimKontrolleri:e.target.value}))}><option value="">Çekim Kontrolleri</option>{kontrollerOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <input type="date" className="border p-2" placeholder="Kontrol Tarihi" value={formData.cekimKontrolTarihi||""} onChange={e=>setFormData(f=>({...f,cekimKontrolTarihi:e.target.value}))}/>
              <select className="border p-2" value={formData.cekimKontrolYapan||""} onChange={e=>setFormData(f=>({...f,cekimKontrolYapan:e.target.value}))}><option value="">Kontrol Yapan</option>{sorumluOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <select className="border p-2" value={formData.tasnif||""} onChange={e=>setFormData(f=>({...f,tasnif:e.target.value}))}><option value="">Tasnif</option>{tasnifOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <select className="border p-2" value={formData.tasnifYapan||""} onChange={e=>setFormData(f=>({...f,tasnifYapan:e.target.value}))}><option value="">Tasnif Yapan</option>{sorumluOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <select className="border p-2" value={formData.dipSesTemizligi||""} onChange={e=>setFormData(f=>({...f,dipSesTemizligi:e.target.value}))}><option value="">Dip Ses Temizleme</option>{dipSesOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <select className="border p-2" value={formData.cekim||""} onChange={e=>setFormData(f=>({...f,cekim:e.target.value}))}><option value="">Çekim</option>{cekimOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <select className="border p-2" value={formData.synology||""} onChange={e=>setFormData(f=>({...f,synology:e.target.value}))}><option value="">Synology</option>{synologyOpt.map(opt=><option key={opt}>{opt}</option>)}</select>
              <input className="border p-2" placeholder="Synology Klasörü Adı" value={formData.synologyKlasorAdi||""} onChange={e=>setFormData(f=>({...f,synologyKlasorAdi:e.target.value}))}/>
              <input className="border p-2" placeholder="Videonun Synology'deki Adı" value={formData.videonunSynologydekiAdi||""} onChange={e=>setFormData(f=>({...f,videonunSynologydekiAdi:e.target.value}))}/>
              <input className="border p-2" placeholder="Çekim Yapanlar" value={formData.cekimYapanlar||""} onChange={e=>setFormData(f=>({...f,cekimYapanlar:e.target.value}))}/>
              <textarea className="border p-2 md:col-span-3" placeholder="Varsa Notlar" value={formData.notlar||""} onChange={e=>setFormData(f=>({...f,notlar:e.target.value}))}/>
              <div className="flex gap-3 mt-2 md:col-span-3">
                <button type="submit" className="bg-indigo-600 text-white rounded px-4 py-2">{editingIndex!==null?"Kaydet":"Ekle"}</button>
                <button type="button" className="bg-gray-200 rounded px-4 py-2" onClick={()=>setShowModal(false)}>İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
