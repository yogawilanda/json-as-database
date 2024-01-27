// script.js

// Function to populate table body with data
function populateTableBody(tableId, bodyId, data) {
    const tableBody = document.getElementById(bodyId);
    tableBody.innerHTML = ""; // Clear existing content

    data.forEach(item => {
        const row = document.createElement("tr");
        Object.values(item).forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}

// Function to ensure uniqueness of a key within an array of objects
function ensureUniqueKey(dataArray, key) {
    const uniqueValues = new Set();
    return dataArray.filter(item => {
        if (!uniqueValues.has(item[key])) {
            uniqueValues.add(item[key]);
            return true;
        }
        return false;
    });
}

// Fetch JSON data from the file
fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        // Access the data using the key
        const saasData = jsonData.saasData;

        // Ensure uniqueness for the "id" key
        saasData.shops = ensureUniqueKey(saasData.shops, 'id');
        saasData.accounts = ensureUniqueKey(saasData.accounts, 'id');
        saasData.products = ensureUniqueKey(saasData.products, 'id');

        // Populate tables with data from JSON
        populateTableBody("shopsTable", "shopsBody", saasData.shops);
        populateTableBody("accountsTable", "accountsBody", saasData.accounts);
        populateTableBody("productsTable", "productsBody", saasData.products);
    })
    .catch(error => console.error('Error fetching JSON:', error));
