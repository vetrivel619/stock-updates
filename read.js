import XLSX from 'xlsx'
import fs from 'fs'


// Load the Excel file
const workbook = XLSX.readFile('data.xlsx');

// Select the sheet you want to read (assuming the first sheet in this example)
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Specify the column you want to extract (e.g., column 'A' in this example)
const columnName = 'D';

// Get the range of the selected column
const columnRange = XLSX.utils.decode_range(sheet['!ref']);
const columnArray = [];

// Iterate through the rows and push the cell value to the array
for (let row = columnRange.s.r; row <= columnRange.e.r; row++) {
  const cellAddress = { c: XLSX.utils.decode_col(columnName), r: row };
  const cellRef = XLSX.utils.encode_cell(cellAddress);
  const cellValue = sheet[cellRef] ? sheet[cellRef].v : "";

  // Push the cell value to the array
  columnArray.push(cellValue);
}

let filteredArray = columnArray.filter((element) => {
    return element !== ""
})

let newArray = filteredArray.splice(0, 3001)

const outputFileName = 'bse.js';

fs.writeFileSync(outputFileName, JSON.stringify(newArray), 'utf-8');
console.log(newArray)

