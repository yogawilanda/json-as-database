// script.js

let saasData; // Declare the variable to store the fetched JSON data

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

// Function to add a new shop
function addShop() {
    const shopName = document.getElementById('shopName').value;
    const newShop = { id: generateUniqueId(), name: shopName };
    saasData.shops.push(newShop);
    updateTables();
}

// Function to generate a unique ID (you may use a more sophisticated method)
function generateUniqueId() {
    return Math.floor(Math.random() * 1000);
}

// Function to save data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('saasData', JSON.stringify(saasData));
    console.log('Data saved to localStorage');
}

// Function to load data from localStorage
function loadDataFromLocalStorage() {
    const storedData = localStorage.getItem('saasData');
    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData);
            if (parsedData && parsedData.shops && parsedData.accounts && parsedData.products) {
                saasData = parsedData;
                updateTables();
                console.log('Data loaded from localStorage');
            } else {
                console.error('Invalid data structure in localStorage. Using default data.');
                initializeDefaultData();
            }
        } catch (error) {
            console.error('Error parsing data from localStorage. Using default data.', error);
            initializeDefaultData();
        }
    } else {
        console.log('No data found in localStorage');
    }
}

document.getElementById('shopsTable').addEventListener('click', function(event) {
    if (event.target && event.target.nodeName === 'BUTTON') {
        addShop();
    }
});

// Function to update tables with data
function updateTables() {
    // Ensure uniqueness for the "id" key
    saasData.shops = ensureUniqueKey(saasData.shops, 'id');
    saasData.accounts = ensureUniqueKey(saasData.accounts, 'id');
    saasData.products = ensureUniqueKey(saasData.products, 'id');

    // Populate tables with data from localStorage
    populateTableBody("shopsTable", "shopsBody", saasData.shops);
    populateTableBody("accountsTable", "accountsBody", saasData.accounts);
    populateTableBody("productsTable", "productsBody", saasData.products);

    // Save data to localStorage after updating tables
    saveDataToLocalStorage();
}

// Function to reset data to the initial state
function resetData() {
    saasData = {
        shops: [],
        accounts: [],
        products: []
    };
    updateTables();
    console.log('Data reset to initial state');
}

// Fetch JSON data from the file
fetch('https://raw.githubusercontent.com/yogawilanda/json-as-database/main/data.json')
    .then(response => response.json())
    .then(jsonData => {
        // Access the data using the key
        saasData = jsonData.saasData;

        // Initial population of tables
        updateTables();
    })
    .catch(error => console.error('Error fetching JSON:', error));
