// Script to handle screen navigation, modal, date button shortcuts, and Leaflet map integration

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
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');

let selectedDateOption = ''; // To store the selected date option

// Initialize Leaflet Map
let map;
let markersGroup;

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
    const location = document.getElementById('location').value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    // Validate form inputs
    if (!location) {
        alert('Please enter a location.');
        return;
    }

    if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
    }

    // Validate date range
    if (new Date(startDate) > new Date(endDate)) {
        alert('Start Date cannot be after End Date.');
        return;
    }

    // Handle the search logic here (e.g., fetch data from the backend)
    console.log('Search Parameters:', { location, startDate, endDate });

    // For demonstration, we'll filter the sample data based on date range
    let filteredMarkets = markets.filter(market => {
        const marketDate = new Date(market.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return marketDate >= start && marketDate <= end;
    });

    // Update List View with filteredMarkets
    updateListView(filteredMarkets);

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
function openMarketDetails(market) {
    document.getElementById('modal-name').textContent = market.name;
    document.getElementById('modal-location').textContent = `Latitude: ${market.latitude}, Longitude: ${market.longitude}`;
    document.getElementById('modal-type').textContent = market.type;
    document.getElementById('modal-stalls').textContent = market.stalls;
    document.getElementById('modal-schedule').textContent = market.date; // Placeholder
    document.getElementById('modal-website').href = market.website;
    document.getElementById('modal-website').textContent = market.website;
    document.getElementById('modal-contact').textContent = market.contact;

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

        // Determine the date range based on the button clicked
        const today = new Date();
        let start, end;

        switch(this.getAttribute('data-value')) {
            case 'today':
                start = formatDate(today);
                end = formatDate(today);
                break;
            case 'tomorrow':
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                start = formatDate(tomorrow);
                end = formatDate(tomorrow);
                break;
            case 'weekend':
                // Determine the current day
                const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
                const saturday = new Date(today);
                const sunday = new Date(today);

                if (currentDay >= 1 && currentDay <= 5) { // Monday to Friday
                    // Set to next Saturday
                    saturday.setDate(today.getDate() + (6 - currentDay));
                    sunday.setDate(saturday.getDate() + 1);
                } else if (currentDay === 6) { // Saturday
                    saturday.setDate(today.getDate());
                    sunday.setDate(today.getDate() + 1);
                } else if (currentDay === 0) { // Sunday
                    saturday.setDate(today.getDate());
                    sunday.setDate(today.getDate());
                }

                start = formatDate(saturday);
                end = formatDate(sunday);
                break;
            case 'next7':
                const next7Start = new Date(today);
                const next7End = new Date(today);
                next7End.setDate(next7End.getDate() + 6);
                start = formatDate(next7Start);
                end = formatDate(next7End);
                break;
            default:
                return;
        }

        // Set the start and end date inputs
        startDateInput.value = start;
        endDateInput.value = end;
    });
});

// Utility function to format Date object to YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0'); // Months are zero-based
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Initialize Leaflet Map with Marker Clustering
function initializeMap(markets, location) {
    if (!map) {
        // Initialize the map
        map = L.map('map-container').setView([51.4545, -2.5879], 13); // Default to Bristol

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Initialize Marker Cluster Group
        markersGroup = L.markerClusterGroup();
        map.addLayer(markersGroup);
    } else {
        // Reset the map view if already initialized
        map.setView([51.4545, -2.5879], 13);
        // Remove existing markers
        markersGroup.clearLayers();
    }

    // Add markers for each market
    markets.forEach(market => {
        const marker = L.marker([market.latitude, market.longitude]);
        marker.bindPopup(`<strong>${market.name}</strong><br>
                         Date: ${market.date}<br>
                         Type: ${market.type}<br>
                         Stalls: ${market.stalls}<br>
                         <a href="${market.website}" target="_blank">Website</a><br>
                         Contact: ${market.contact}`);
        marker.on('click', function() {
            openMarketDetails(market);
        });
        markersGroup.addLayer(marker);
    });
}

// Function to update the list view with filtered markets
function updateListView(filteredMarkets) {
    const marketList = document.getElementById('market-list');
    marketList.innerHTML = ''; // Clear existing list

    if (filteredMarkets.length === 0) {
        marketList.innerHTML = '<li>No markets found for the selected criteria.</li>';
        return;
    }

    filteredMarkets.forEach(market => {
        const listItem = document.createElement('li');
        listItem.className = 'market-item';
        listItem.innerHTML = `
            <h3>${market.name}</h3>
            <p>Date: ${market.date}</p>
            <p>Type: ${market.type}</p>
            <p>Stalls: ${market.stalls}</p>
            <p>Distance: ${market.distance}</p>
        `;
        listItem.addEventListener('click', () => openMarketDetails(market));
        marketList.appendChild(listItem);
    });
}
