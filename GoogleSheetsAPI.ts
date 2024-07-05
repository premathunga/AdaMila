//GoogleSheetsAPI.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const apiKey = 'AIzaSyAlalBpcE-45K8pSpAW2MeHpMUsVMpLCew';
const sheetId = '1v8WaLT-_YYy0mtzMy105HVE4oMKrhACpKy3qOoqZRm8';
const API_BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/`;

export interface DataItem {
  Id: number;
  Date: string;
  Name: string;
  Keyword: string;
  "Minimum Price": number;
  "Maximum Price": number;
  Category: string;
  "RetailPrice": number;
}

export const fetchDataFromSheet = async (sheetName: string): Promise<{ data: DataItem[]; lastUpdate: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}${sheetName}!A:H?key=${apiKey}`);
    const values = response.data.values.slice(1);
    const lastUpdate = values.length > 0 ? formatDate(values[values.length - 1][1]) : 'N/A';

    const data = values.map((row: any) => ({
      Id: row[0],
      Date: formatDate(row[1]),
      Name: row[2],
      Keyword: row[3],
      "Minimum Price": row[4],
      "Maximum Price": row[5],
      Category: row[6],
      "RetailPrice": row[7],
    }));

    return { data, lastUpdate };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const formatDate = (dateString: string) => {
  // Implement your date formatting logic here
  return dateString;
};
