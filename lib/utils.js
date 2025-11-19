// Utility functions for the application

// Excel export function
export function exportToExcel(data, filename) {
  if (!data || data.length === 0) {
    alert('Tabloda veri yok!');
    return;
  }

  // CSV formatına çevir (Excel UTF-8 BOM ile açabilir)
  const headers = Object.keys(data[0]).filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');

  // BOM (Byte Order Mark) ekle - Excel'in Türkçe karakterleri doğru göstermesi için
  let csv = '\uFEFF';

  // Başlıkları ekle
  csv += headers.join(',') + '\n';

  // Verileri ekle
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Virgül, tırnak veya satır sonu içeriyorsa tırnakla çevir
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return '"' + value.replace(/"/g, '""') + '"';
      }
      return value;
    });
    csv += values.join(',') + '\n';
  });

  // Blob oluştur ve indir
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename + '.csv');
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
