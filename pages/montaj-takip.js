import { useState, useEffect } from "react";
import Link from "next/link";
import { getSheetsData, addRowToSheet, updateRow, deleteRow } from "../lib/sheets";
import { exportToExcel } from "../lib/utils";

export default function MontajTakip() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({});

  // açılırlar
  const montajSorumlusuOpt = ["Ayşe Nur Yazıcı","Hasan Taşdemir","Hatice Yürük","Cihan Çimen"];
  const icerikUzmaniOpt = ["Arzu Mantar", "Meltem Ermez", "Nezahat Kara", "Sevim Aydın Verim"];
  const montajDurumuOpt = ["Başladı","Devam Ediyor","1.Revize","2.Revize","Bitti"];
  const montajOpt = ["Tamamlandı", "Tamamlanmadı"];

  const [filters, setFilters] = useState({ egitimAdi:'', montajSorumlusu:'', icerikUzmani:'', durum:'' });

  useEffect(()=>{ getData(); },[]);
  useEffect(()=>{
    let d = data;
    if(filters.egitimAdi) d = d.filter(row=>row.egitimAdi === filters.egitimAdi);
    if(filters.montajSorumlusu) d = d.filter(row=>row.montajSorumlusu === filters.montajSorumlusu);
    if(filters.icerikUzmani) d = d.filter(row=>row.icerikUzmani === filters.icerikUzmani);
    if(filters.durum) d = d.filter(row=>row.montajDurumu === filters.durum);
    d = [...d].sort((a,b)=>(a.montajDurumu==="Bitti"?1:0)-(b.montajDurumu==="Bitti"?1:0));
    setFilteredData(d);
  },[filters,data]);

  async function getData() {
    const res = await getSheetsData("Montaj Takip");
    setData(res.data||[]);
  }

  function openModal(idx=null) {
    if(idx!==null) {
      setEditingIndex(idx); setFormData(filteredData[idx]);
    } else {
      setEditingIndex(null);
      setFormData({egitimAdi:"",egitmenAdi:"",montajSorumlusu:"",bitenVideoAdi:"",icerikUzmani:"",montajBaslamaTarihi:"",revize1Tarihi:"",revize2Tarihi:"",montajDurumu:"",montajBitisTarihi:"",montaj:"",notlar:""});
    }
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if(editingIndex!==null) await updateRow("Montaj Takip", editingIndex, formData);
      else await addRowToSheet("Montaj Takip", formData);
      await getData(); setShowModal(false);
      alert("Başarıyla kaydedildi!");
    } catch(err){ alert("Hata: "+err.message);}
  }

  async function handleDelete(idx) {
    if(!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await deleteRow("Montaj Takip", idx); await getData();
      alert("Kayıt silindi!");
    } catch(err){ alert("Silme hatası: "+err.message);}
  }

  function handleExport() {
    exportToExcel(filteredData, "Montaj_Takip_"+new Date().toISOString().split("T")[0]);
  }
  function resetFilters() {
    setFilters({ egitimAdi:'', montajSorumlusu:'', icerikUzmani:'', durum:'' });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">🎬 Montaj Takip</Link>
          <div className="flex items-center gap-3">
            <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">📥 Excel İndir</button>
            <button onClick={()=>openModal()} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">➕ Yeni Montaj Ekle</button>
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
            <label className="block text-xs mb-1">Montaj Sorumlusu</label>
            <select className="w-32 border" value={filters.montajSorumlusu} onChange={e=>setFilters(f=>({...f, montajSorumlusu:e.target.value}))}>
              <option value="">Hepsi</option>
              {montajSorumlusuOpt.map(opt=>(<option key={opt}>{opt}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">İçerik Uzmanı</label>
            <select className="w-32 border" value={filters.icerikUzmani} onChange={e=>setFilters(f=>({...f, icerikUzmani:e.target.value}))}>
              <option value="">Hepsi</option>
              {icerikUzmaniOpt.map(opt=>(<option key={opt}>{opt}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Durum</label>
            <select className="w-28 border" value={filters.durum} onChange={e=>setFilters(f=>({...f, durum:e.target.value}))}>
              <option value="">Hepsi</option>
              {montajDurumuOpt.map(opt=>(<option key={opt}>{opt}</option>))}
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
                <th>Montaj Sorumlusu</th>
                <th>Biten Video Adı</th>
                <th>İçerik Uzmanı</th>
                <th>Başlama Tarihi</th>
                <th>1.Revize Tarihi</th>
                <th>2.Revize Tarihi</th>
                <th>Durum</th>
                <th>Bitiş Tarihi</th>
                <th>Montaj</th>
                <th>Notlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx)=>(
                <tr key={idx} className={row.montajDurumu==="Bitti" ? "bg-green-100" : ""}>
                  <td className="whitespace-nowrap">
                    <button className="text-blue-600 text-xs mr-2" onClick={()=>openModal(idx)}>✏️</button>
                    <button className="text-red-600 text-xs" onClick={()=>handleDelete(idx)}>🗑️</button>
                  </td>
                  <td>{row.egitimAdi}</td>
                  <td>{row.egitmenAdi}</td>
                  <td>{row.montajSorumlusu}</td>
                  <td>{row.bitenVideoAdi}</td>
                  <td>{row.icerikUzmani}</td>
                  <td>{row.montajBaslamaTarihi}</td>
                  <td>{row.revize1Tarihi}</td>
                  <td>{row.revize2Tarihi}</td>
                  <td>{row.montajDurumu}</td>
                  <td>{row.montajBitisTarihi}</td>
                  <td>{row.montaj}</td>
                  <td>{row.notlar}</td>
                </tr>
              ))}
              {filteredData.length===0 && (
                <tr>
                  <td colSpan={13} className="text-center py-4 text-gray-400">Veri yok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-2xl">
            <h3 className="mb-4 font-bold text-lg">{editingIndex!==null?'Düzenle':'Yeni Montaj Ekle'}</h3>
            <form className="grid md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
              <input type="text" className="border p-2" required placeholder="Eğitim Adı" value={formData.egitimAdi||''} onChange={e=>setFormData(f=>({...f, egitimAdi:e.target.value}))} />
              <input type="text" className="border p-2" placeholder="Eğitmen" value={formData.egitmenAdi||''} onChange={e=>setFormData(f=>({...f, egitmenAdi:e.target.value}))} />
              <select className="border p-2" value={formData.montajSorumlusu||''} onChange={e=>setFormData(f=>({...f, montajSorumlusu:e.target.value}))}>
                <option value="">Sorumlu seç</option>
                {montajSorumlusuOpt.map(opt=>(<option key={opt}>{opt}</option>))}
              </select>
              <select className="border p-2" value={formData.icerikUzmani||''} onChange={e=>setFormData(f=>({...f, icerikUzmani:e.target.value}))}>
                <option value="">Uzman seç</option>
                {icerikUzmaniOpt.map(opt=>(<option key={opt}>{opt}</option>))}
              </select>
              <textarea rows={2} className="border p-2 md:col-span-2" placeholder="Biten Video Adı" value={formData.bitenVideoAdi||''} onChange={e=>setFormData(f=>({...f, bitenVideoAdi:e.target.value}))}/>
              <input type="date" className="border p-2" placeholder="Başlama Tarihi" value={formData.montajBaslamaTarihi||''} onChange={e=>setFormData(f=>({...f, montajBaslamaTarihi:e.target.value}))}/>
              <input type="date" className="border p-2" placeholder="1.Revize Tarihi" value={formData.revize1Tarihi||''} onChange={e=>setFormData(f=>({...f, revize1Tarihi:e.target.value}))}/>
              <input type="date" className="border p-2" placeholder="2.Revize Tarihi" value={formData.revize2Tarihi||''} onChange={e=>setFormData(f=>({...f, revize2Tarihi:e.target.value}))}/>
              <select className="border p-2" value={formData.montajDurumu||''} onChange={e=>setFormData(f=>({...f, montajDurumu:e.target.value}))}>
                <option value="">Montaj Durumu</option>
                {montajDurumuOpt.map(opt=>(<option key={opt}>{opt}</option>))}
              </select>
              <input type="date" className="border p-2" placeholder="Bitiş Tarihi" value={formData.montajBitisTarihi||''} onChange={e=>setFormData(f=>({...f, montajBitisTarihi:e.target.value}))}/>
              <select className="border p-2" value={formData.montaj||''} onChange={e=>setFormData(f=>({...f, montaj:e.target.value}))}>
                <option value="">Montaj...</option>
                {montajOpt.map(opt=>(<option key={opt}>{opt}</option>))}
              </select>
              <textarea rows={2} className="border p-2 md:col-span-2" placeholder="Varsa notlar" value={formData.notlar||''} onChange={e=>setFormData(f=>({...f, notlar:e.target.value}))}/>
              <div className="flex gap-3 mt-2 md:col-span-2">
                <button type="submit" className="bg-indigo-600 text-white rounded px-4 py-2">{editingIndex!==null?'Kaydet':'Ekle'}</button>
                <button type="button" className="bg-gray-200 rounded px-4 py-2" onClick={()=>setShowModal(false)}>İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
