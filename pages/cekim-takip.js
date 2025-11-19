import { useState, useEffect } from "react";
import Link from "next/link";
import { getSheetsData, addRowToSheet, updateRow, deleteRow } from "../lib/sheets";
import { exportToExcel } from "../lib/utils";

const sorumluOpt = ["Gülnur Kılıç", "Sadi Demirci", "Soner Ulu"];
const icerikUzmaniOpt = [
  "Arzu Mantar", "Meltem Ermez", "Nezahat Kara", "Sevim Aydın Verim"
];
const cekimDurumuOpt = ["Başladı", "Devam Ediyor", "Tekrar Çekim", "Bitti"];
const fotografOpt = ["Yapıldı", "Yapılmadı"];
const kontrollerOpt = ["Yapıldı", "Yapılmadı"];
const tasnifOpt = ["Yapıldı", "Yapılmadı"];
const dipSesOpt = ["Yapıldı", "Yapılmadı"];
const cekimOpt = ["Tamamlandı", "Tamamlanmadı"];
const synologyOpt = ["Kaydedildi", "Kaydedilmedi"];

export default function CekimTakip() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [filters, setFilters] = useState({
    egitim_adi: '', egitmen_adi: '', cekim_sorumlusu: '', cekim_durumu: ''
  });

  useEffect(()=>{ getData(); },[]);
  useEffect(()=>{
    let d = data;
    if(filters.egitim_adi) d = d.filter(r=>r.egitim_adi === filters.egitim_adi);
    if(filters.egitmen_adi) d = d.filter(r=>r.egitmen_adi === filters.egitmen_adi);
    if(filters.cekim_sorumlusu) d = d.filter(r=>r.cekim_sorumlusu === filters.cekim_sorumlusu);
    if(filters.cekim_durumu) d = d.filter(r=>r.cekim_durumu === filters.cekim_durumu);
    d = [...d].sort((a, b)=>((a.cekim_durumu==="Bitti"?1:0)-(b.cekim_durumu==="Bitti"?1:0)));
    setFilteredData(d);
  },[filters, data]);

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
        egitim_adi:"", egitmen_adi:"", cekim_sorumlusu:"", video_adi:"",
        cekim_baslama_tarihi:"", on_cekim:"", on_cekim_tarihi:"", izlence:"",
        isik_sorumlu:"", cekim_durumu:"", cekim_bitis_tarihi:"", fotograf_cekimleri:"",
        fotograf_cekim_yapan:"", fotograf_cekim_tarihi:"", cekim_kontrolleri:"",
        cekim_kontrol_tarihi:"", cekim_kontrol_yapan:"", tasnif:"", tasnif_yapan:"",
        dip_ses_temizligi:"", cekim:"", synology:"", synology_klasor_adi:"",
        videonun_synologydeki_adi:"", cekim_yapanlar:"", notlar:""
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
    setFilters({
      egitim_adi:'', egitmen_adi:'', cekim_sorumlusu:'', cekim_durumu:''
    });
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
            <input type="text" className="w-32 border"
                   value={filters.egitim_adi}
                   onChange={e=>setFilters(f=>({...f, egitim_adi:e.target.value}))}/>
          </div>
          <div>
            <label className="block text-xs mb-1">Eğitmen Adı</label>
            <input type="text" className="w-32 border"
                   value={filters.egitmen_adi}
                   onChange={e=>setFilters(f=>({...f, egitmen_adi:e.target.value}))}/>
          </div>
          <div>
            <label className="block text-xs mb-1">Çekim Sorumlusu</label>
            <select className="w-32 border"
                    value={filters.cekim_sorumlusu}
                    onChange={e=>setFilters(f=>({...f, cekim_sorumlusu:e.target.value}))}>
              <option value="">Hepsi</option>
              {sorumluOpt.map(opt=>(<option key={opt}>{opt}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Çekim Durumu</label>
            <select className="w-32 border"
                    value={filters.cekim_durumu}
                    onChange={e=>setFilters(f=>({...f, cekim_durumu:e.target.value}))}>
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
              <th>İzlence</th>
              <th>Işık Sorumlu</th>
              <th>Durum</th>
              <th>Bitiş</th>
              <th>Fotoğraf Çekimleri</th>
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
              <tr key={idx} className={row.cekim_durumu==="Bitti" ? "bg-green-100" : ""}>
                <td className="whitespace-nowrap">
                  <button className="text-blue-600 text-xs mr-2" onClick={()=>openModal(idx)}>✏️</button>
                  <button className="text-red-600 text-xs" onClick={()=>handleDelete(idx)}>🗑️</button>
                </td>
                <td>{row.egitim_adi}</td>
                <td>{row.egitmen_adi}</td>
                <td>{row.cekim_sorumlusu}</td>
                <td>{row.video_adi}</td>
                <td>{row.cekim_baslama_tarihi}</td>
                <td>{row.on_cekim}</td>
                <td>{row.on_cekim_tarihi}</td>
                <td>{row.izlence}</td>
                <td>{row.isik_sorumlu}</td>
                <td>{row.cekim_durumu}</td>
                <td>{row.cekim_bitis_tarihi}</td>
                <td>{row.fotograf_cekimleri}</td>
                <td>{row.fotograf_cekim_yapan}</td>
                <td>{row.fotograf_cekim_tarihi}</td>
                <td>{row.cekim_kontrolleri}</td>
                <td>{row.cekim_kontrol_tarihi}</td>
                <td>{row.cekim_kontrol_yapan}</td>
                <td>{row.tasnif}</td>
                <td>{row.tasnif_yapan}</td>
                <td>{row.dip_ses_temizligi}</td>
                <td>{row.cekim}</td>
                <td>{row.synology}</td>
                <td>{row.synology_klasor_adi}</td>
                <td>{row.videonun_synologydeki_adi}</td>
                <td>{row.cekim_yapanlar}</td>
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
            <form className="grid md:grid-cols-3 gap-2" onSubmit={handleSubmit}>
              {/* ... here comes the same logic! Her field adı snake_case */}
              {Object.entries(formData).map(([key,val],i)=>(
                <input key={key} value={val||""} onChange={e=>setFormData({...formData, [key]:e.target.value})}
                  className="border p-2" placeholder={key.replace(/_/g," ").replace(/(^| )[a-z]/g,char=>char.toUpperCase())}/>
              ))}
              <div className="md:col-span-3 flex gap-2 mt-3">
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
