// Script to handle screen navigation and modal

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

// Event Listeners
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Here you would handle the search logic
    openingScreen.classList.remove('active');
    resultsScreen.classList.add('active');
});

backButton.addEventListener('click', function() {
    resultsScreen.classList.remove('active');
    openingScreen.classList.add('active');
});

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
