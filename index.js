let stores;

fetch('./g.geojson')
  .then(res => res.json())
  .then(json => {
    stores = json;
  });

mapboxgl.accessToken =
  'pk.eyJ1IjoiYmRlcmllbCIsImEiOiJjajhicXN3MWIwMHF5MnFvazV0eW96OGM0In0.W3YmbjV_q0ZX-woP1ZvG1Q';
// This adds the map to your page
const map = new mapboxgl.Map({
  // container id specified in the HTML
  container: 'map',
  // style URL
  style: 'mapbox://styles/mapbox/light-v9',
  // initial position in [lon, lat] format
  center: [-77.034084, 38.909671],
  // initial zoom
  zoom: 14
});

map.on('load', function(e) {
  // Add the data to your map as a layer
  map.addLayer({
    id: 'locations',
    type: 'symbol',
    // Add a GeoJSON source containing place coordinates and information.
    source: {
      type: 'geojson',
      data: stores
    },
    layout: {
      'icon-image': 'restaurant-15',
      'icon-allow-overlap': true
    }
  });

  buildLocationList(stores);
});

// featured store in an object faster lookup
const featured = {
  '11935 Democracy Dr': true,
  '68 Coulter Ave': true
};

function buildLocationList(data) {
  // Iterate through the list of stores
  for (let i = 0; i < data.features.length; i++) {
    var currentFeature = data.features[i];
    // Shorten data.feature.properties to just `prop` so we're not
    // writing this long form over and over again.
    var prop = currentFeature.properties;
    // Select the listing container in the HTML and append a div
    // with the class 'item' for each store
    var listings = document.getElementById('listings');

    // Create a new link with the class 'title' for each store
    // and fill it with the store address
    if (prop.address in featured) {
      var listing = listings.insertAdjacentElement(
        'afterbegin',
        document.createElement('div')
      );

      listing.className = 'item featured';
      listing.id = 'listing-' + i;
      var link = listing.appendChild(document.createElement('a'));
      link.innerHTML = prop.address + ' *Featured*';
      link.className = 'title';
    } else {
      var listing = listings.appendChild(document.createElement('div'));
      listing.className = 'item';
      listing.id = 'listing-' + i;
      var link = listing.appendChild(document.createElement('a'));
      link.innerHTML = prop.address;
      link.className = 'title';
    }
    link.href = '#';
    link.dataPosition = i;

    // Create a new div with the class 'details' for each store
    // and fill it with the city and phone number
    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = prop.city;
    if (prop.phone) {
      details.innerHTML += ' &middot; ' + prop.phoneFormatted;
    }
  }
}
