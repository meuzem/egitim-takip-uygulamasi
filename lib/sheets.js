// Google Sheets API Helper
const SPREADSHEET_ID = '1ywjQGfHS6k4hqNiitkOUZ2HytTnu7N9Z5PO9A_yXMUY';

// API endpoint (Next.js API route kullanacağız)
export const getSheetsData = async (sheetName) => {
  try {
    const response = await fetch(`/api/sheets?sheet=${sheetName}`);
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return { data: [] };
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return { data: [] };
  }
};

export const addRowToSheet = async (sheetName, rowData) => {
  try {
    const response = await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheetName, rowData })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const text = await response.text();
    if (!text) {
      throw new Error('Empty response from server');
    }

    return JSON.parse(text);
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const text = await response.text();
    if (!text) {
      throw new Error('Empty response from server');
    }

    return JSON.parse(text);
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const text = await response.text();
    if (!text) {
      throw new Error('Empty response from server');
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error deleting row:', error);
    throw error;
  }
};
