import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSheetsData, addRowToSheet, updateRow, deleteRow } from '../lib/sheets';
import { exportToExcel } from '../lib/utils';

export default function EgitimTakip() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({});

  const [filters, setFilters] = useState({
    egitimAdi: '', alan: '', durum: ''
  });

  const alanOpsiyon = [
    'Bilişim Teknolojileri', 'Çocuk Gelişimi', 'Dil Eğitimleri', 'El Sanatları', 'Gastronomi', 'Görsel İletişim',
    'Güzellik ve Saç', 'Kişisel Gelişim', 'Medya', 'Moda/Tekstil', 'Muhasebe', 'Müzik',
    'Robotik/Yapay Zeka', 'Sahne Sanatları', 'Sanat/Tasarım', 'Yönetim', 'Ziraat'
  ];
  const durumOpsiyon= [
    'Eğitim Planlanıyor', 'Yayında', 'Hazırlanıyor', 'Onayda', 'İptal', 'Devam Ediyor'
  ];

  useEffect(() => { getData(); }, []);
  useEffect(()=> {
    let d = data;
    if(filters.egitimAdi) d = d.filter(row=>row.egitimAdi===filters.egitimAdi);
    if(filters.alan) d = d.filter(row=>row.alan===filters.alan);
    if(filters.durum) d = d.filter(row=>row.durum===filters.durum);
    d = [...d].sort((a, b) => (a.durum==="Yayında" ? 1 : 0)-(b.durum==="Yayında" ? 1 : 0));
    setFilteredData(d);
  }, [filters, data]);

  async function getData() {
    const res = await getSheetsData('Eğitim Takip');
    setData(res.data || []);
  }

  function openModal(idx=null) {
    if(idx!==null) {
      setEditingIndex(idx);
      setFormData(filteredData[idx]);
    } else {
      setEditingIndex(null);
      setFormData({egitimAdi:'', alan:'', durum:'', notlar:''});
    }
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if(editingIndex!==null) await updateRow('Eğitim Takip', editingIndex, formData);
      else await addRowToSheet('Eğitim Takip', formData);
      await getData();
      setShowModal(false);
      alert('Başarıyla kaydedildi!');
    } catch(err) { alert('Kayıt hatası: '+err.message); }
  }

  async function handleDelete(idx) {
    if(!confirm('Bu kaydı silmek istiyor musunuz?')) return;
    try {
      await deleteRow('Eğitim Takip', idx);
      await getData();
      alert('Kayıt silindi.');
    } catch(err){ alert('Silme hatası: '+err.message);}
  }

  function handleExport() {
    exportToExcel(filteredData, 'Egitim_Takip_'+new Date().toISOString().split('T')[0]);
  }

  function resetFilters() {
    setFilters({egitimAdi:'', alan:'', durum:''});
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">📚 Eğitim Takip</Link>
          <div className="flex items-center gap-3">
            <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">📥 Excel İndir</button>
            <button onClick={()=>openModal()} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">➕ Yeni Eğitim Ekle</button>
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
            <label className="block text-xs mb-1">Alan</label>
            <select className="w-32 border" value={filters.alan} onChange={e=>setFilters(f=>({...f, alan:e.target.value}))}>
              <option value="">Hepsi</option>
              {alanOpsiyon.map(opt=>(<option key={opt}>{opt}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Durum</label>
            <select className="w-28 border" value={filters.durum} onChange={e=>setFilters(f=>({...f, durum:e.target.value}))}>
              <option value="">Hepsi</option>
              {durumOpsiyon.map(opt=>(<option key={opt}>{opt}</option>))}
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
                <th>Alan</th>
                <th>Durum</th>
                <th>Notlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx)=>(
                <tr key={idx} className={row.durum==="Yayında" ? "bg-green-100" : ""}>
                  <td className="whitespace-nowrap">
                    <button className="text-blue-600 text-xs mr-2" onClick={()=>openModal(idx)}>✏️</button>
                    <button className="text-red-600 text-xs" onClick={()=>handleDelete(idx)}>🗑️</button>
                  </td>
                  <td>{row.egitimAdi}</td>
                  <td>{row.alan}</td>
                  <td>{row.durum}</td>
                  <td>{row.notlar}</td>
                </tr>
              ))}
              {filteredData.length===0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">Veri yok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-xl">
            <h3 className="mb-4 font-bold text-lg">{editingIndex!==null?'Düzenle':'Yeni Eğitim Ekle'}</h3>
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <input type="text" className="border p-2" required placeholder="Eğitim Adı" value={formData.egitimAdi||''} onChange={e=>setFormData(f=>({...f, egitimAdi:e.target.value}))} />
              <select required className="border p-2" value={formData.alan||''} onChange={e=>setFormData(f=>({...f, alan:e.target.value}))}>
                <option value="">Alan seç</option>
                {alanOpsiyon.map(opt=>(<option key={opt}>{opt}</option>))}
              </select>
              <select required className="border p-2" value={formData.durum||''} onChange={e=>setFormData(f=>({...f, durum:e.target.value}))}>
                <option value="">Durum seç</option>
                {durumOpsiyon.map(opt=>(<option key={opt}>{opt}</option>))}
              </select>
              <textarea className="border p-2" placeholder="Notlar" value={formData.notlar||''} onChange={e=>setFormData(f=>({...f, notlar:e.target.value}))}/>
              <div className="flex gap-3 mt-2">
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
