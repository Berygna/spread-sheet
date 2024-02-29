const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COLS = 10;
const spreadSheet = [];
const alphabet = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
]

class Cell {
    constructor(isHeader, disabled, data, row, col, rowName, colName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.col = col;
        this.rowName = rowName;
        this.colName = colName;
        this.active = active;
    }
}

exportBtn.onclick = (e) => {
    let csv = "";
    for(let i=0; i<spreadSheet.length; i++) {
        if (i == 0) continue;
        csv += 
        spreadSheet[i]
        .filter(item => !item.isHeader)
        .map(item => item.data)
        .join(",") + "\r\n";

    }

    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);
    console.log("csv url", csvUrl);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = 'spreadsheet_name.csv';
    a.click();
    

    console.log("Button Clicked", spreadSheet);
    console.log("CSV", csv);
}

initSpreadSheet();

function initSpreadSheet() {
    for (let i = 0; i < ROWS; i++) {
        let spreadSheetRow = [];
        for (let j = 0; j < COLS; j++) {
            let cellData = "";
            let isHeader = false;
            let disabled = false;

            if (j==0) {
                cellData = i;
                isHeader = true;
                disabled = true;
            }
            if (i==0) {
                cellData = alphabet[j-1];
                isHeader = true;
                disabled = true
            }

            if (cellData <= 0 || !cellData ) {
                cellData = "";
            }
            const rowName = i;
            const colName = alphabet[j-1];

            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, colName, false);
            spreadSheetRow.push(cell);
        }
        spreadSheet.push(spreadSheetRow);
    }
    drawSheet();
    //console.log("Spreadsheet", spreadSheet);
}

function createCellElem(cell) {
    const cellElem = document.createElement("input");
    cellElem.className = "cell";
    cellElem.id = "cell-" + cell.row + "-" + cell.col;
    cellElem.value = cell.data;
    cellElem.disabled = cell.disabled;

    if (cell.isHeader) {
        cellElem.classList.add("header");
    }

    cellElem.onclick = () => handleCellClick(cell);
    cellElem.onchange = (e) => handleCellChange(e.target.value, cell);

    return cellElem;
}

function handleCellChange(data, cell) {
    cell.data = data;
}

function handleCellClick(cell) {
    clearHeaderActiveState();

    const colHeader = spreadSheet[0][cell.col];
    const rowHeader = spreadSheet[cell.row][0];
    const colHeaderElem = getElemFromRowCol(colHeader.row, colHeader.col);
    const rowHeaderElem = getElemFromRowCol(rowHeader.row, rowHeader.col);

    colHeaderElem.classList.add("active");
    rowHeaderElem.classList.add("active");
    //console.log("clicked", rowHeaderElem, colHeaderElem);
    document.querySelector('#cell-status').innerHTML = cell.colName + "" + cell.rowName;
}

function clearHeaderActiveState() {
    const headers = document.querySelectorAll(".header");
    headers.forEach((header) => {
        header.classList.remove("active");
    })
}

function getElemFromRowCol(row, col) {
    return document.querySelector("#cell-" + row + "-" + col);
}

function drawSheet() {
    for (let i = 0; i < spreadSheet.length; i++) {
        const rowContainerElem = document.createElement("div");
        rowContainerElem.className = "row-container";

        for (let j = 0; j < spreadSheet[i].length; j++) {
            const cell = spreadSheet[i][j];
            const cellElem = createCellElem(cell);

            rowContainerElem.append(cellElem);
        }
        spreadSheetContainer.append(rowContainerElem);
    }
}
