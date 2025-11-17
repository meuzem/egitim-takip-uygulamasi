// Google Sheets API Helper
const SPREADSHEET_ID = '1ywjQGfHS6k4hqNiitkOUZ2HytTnu7N9Z5PO9A_yXMUY';

// API endpoint (Next.js API route kullanacağız)
export const getSheetsData = async (sheetName) => {
  try {
    const response = await fetch(`/api/sheets?sheet=${sheetName}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export const addRowToSheet = async (sheetName, rowData) => {
  try {
    const response = await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheetName, rowData })
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding row:', error);
    throw error;
  }
};

export const updateRow = async (sheetName, rowIndex, rowData) => {
  try {
    const response = await fetch('/api/sheets', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheetName, rowIndex, rowData })
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating row:', error);
    throw error;
  }
};

export const deleteRow = async (sheetName, rowIndex) => {
  try {
    const response = await fetch('/api/sheets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheetName, rowIndex })
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting row:', error);
    throw error;
  }
};
