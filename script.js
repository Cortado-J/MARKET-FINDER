// Script to handle screen navigation, modal, date button selection, and map integration

// Elements
const openingScreen = document.getElementById('opening-screen');
const resultsScreen = document.getElementById('results-screen');
const searchForm = document.getElementById('search-form');
const backButton = document.getElementById('back-button');
const listViewBtn = document.getElementById('list-view-btn');
const mapViewBtn = document.getElementById('map-view-btn');
const listView = document.getElementById('list-view');
const mapView = document.getElementById('map-view');
const marketDetailsModal = document.getElementById('market-details-modal');
const closeButton = document.querySelector('.close-button');

// Date Buttons
const dateButtons = document.querySelectorAll('.date-btn');
const customRangeBtn = document.getElementById('custom-range-btn');
const customRange = document.getElementById('custom-range');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');

let selectedDateOption = ''; // To store the selected date option

// Initialize Leaflet Map
let map;

// Sample Market Data (Replace with dynamic data from backend)
const markets = [
    {
        name: "Farmers Market",
        date: "2024-11-05",
        type: "Farmers",
        stalls: 20,
        distance: "2.5 miles",
        latitude: 51.4545,
        longitude: -2.5879,
        website: "https://www.farmersmarketbristol.co.uk",
        contact: "email@example.com | 01234 567890"
    },
    {
        name: "Flea Market",
        date: "2024-11-06",
        type: "Flea",
        stalls: 15,
        distance: "3.0 miles",
        latitude: 51.4540,
        longitude: -2.5870,
        website: "https://www.fleamarketbristol.co.uk",
        contact: "contact@fleamarketbristol.co.uk | 09876 543210"
    },
    // Add more market objects as needed
];

// Event Listeners
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Retrieve form data
    const location = document.getElementById('location').value;
    let dateRange = {};

    if (selectedDateOption === 'custom') {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        if (!startDate || !endDate) {
            alert('Please select both start and end dates for the custom range.');
            return;
        }
        dateRange = { type: 'custom', start: startDate, end: endDate };
    } else {
        dateRange = { type: selectedDateOption };
    }

    // Here you would handle the search logic, e.g., fetch data from the backend
    console.log('Search Parameters:', { location, dateRange });

    // For demonstration, we'll filter the sample data based on selectedDateOption
    let filteredMarkets = [];

    // Simple filtering logic (to be replaced with actual search logic)
    filteredMarkets = markets.filter(market => {
        // Implement date filtering based on dateRange.type
        // This is a placeholder; you'd need to handle date comparisons properly
        return true; // Return all for now
    });

    // Update List View (Here we simply log it; you can dynamically update the DOM)
    // For this mockup, the list is static. Implement dynamic rendering as needed.

    // Initialize or Update Map
    initializeMap(filteredMarkets, location);

    // Transition to Results Screen
    openingScreen.classList.remove('active');
    resultsScreen.classList.add('active');
});

backButton.addEventListener('click', function() {
    resultsScreen.classList.remove('active');
    openingScreen.classList.add('active');
});

// View Toggle Buttons
listViewBtn.addEventListener('click', function() {
    listView.classList.add('active');
    mapView.classList.remove('active');
    listViewBtn.classList.add('active');
    mapViewBtn.classList.remove('active');
});

mapViewBtn.addEventListener('click', function() {
    mapView.classList.add('active');
    listView.classList.remove('active');
    mapViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
});

// Function to open Market Details Modal
function openMarketDetails() {
    marketDetailsModal.style.display = 'block';
}

// Close Modal
closeButton.addEventListener('click', function() {
    marketDetailsModal.style.display = 'none';
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', function(event) {
    if (event.target == marketDetailsModal) {
        marketDetailsModal.style.display = 'none';
    }
});

// Date Button Selection Logic
dateButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        dateButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to the clicked button
        this.classList.add('active');

        // Check if the clicked button is Custom Range
        if (this.id === 'custom-range-btn') {
            customRange.classList.remove('hidden');
            selectedDateOption = 'custom';
        } else {
            customRange.classList.add('hidden');
            selectedDateOption = this.getAttribute('data-value');
        }
    });
});

// Initialize Leaflet Map with Default View
function initializeMap(markets, location) {
    if (!map) {
        // Initialize the map
        map = L.map('map-container').setView([51.4545, -2.5879], 13); // Default to Bristol

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    } else {
        // Reset the map view if already initialized
        map.setView([51.4545, -2.5879], 13);
        // Remove existing markers
        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    }

    // Add markers for each market
    markets.forEach(market => {
        const marker = L.marker([market.latitude, market.longitude]).addTo(map);
        marker.bindPopup(`<strong>${market.name}</strong><br>
                         Date: ${market.date}<br>
                         Type: ${market.type}<br>
                         Stalls: ${market.stalls}<br>
                         <a href="${market.website}" target="_blank">Website</a><br>
                         Contact: ${market.contact}`);
    });
}
