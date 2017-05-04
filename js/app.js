//**----The Model----**//
var locations = [{
        title: 'Torre dos Clérigos',
        id: '4c02f97058dad13aa5014897',
        location: {
            lat: 41.145821,
            lng: -8.613985
        }
    },
    {
        title: 'Ponte Dom Luís I',
        id: '4c3887eb2c8020a156ea8a00',
        location: {
            lat: 41.139959,
            lng: -8.609448
        }
    },
    {
        title: 'Casa da Música',
        id: '4b3b6e5ef964a520b07325e3',
        location: {
            lat: 41.158881,
            lng: -8.630696
        }
    },
    {
        title: 'Palácio da Bolsa',
        id: '4c4ec5e89932e21e3c5346ce',
        location: {
            lat: 41.141377,
            lng: -8.615672
        }
    },
    {
        title: 'Sé Catedral do Porto',
        id: '4bf91dd88d30d13ad6b40118',
        location: {
            lat: 41.142826,
            lng: -8.611184
        }
    },
    {
        title: 'Estação de São Bento',
        id: '4f9196d8e4b04fef00beae3d',
        location: {
            lat: 41.145607,
            lng: -8.610526
        }
    },
    {
        title: 'Museu de Serralves',
        id: '4bb8cd1898c7ef3bd26b3102',
        location: {
            lat: 41.15979,
            lng: -8.659666
        }
    },
    {
        title: 'Majestic Café',
        id: '4b963f73f964a5204dc234e3',
        location: {
            lat: 41.147238,
            lng: -8.606579
        }
    },
    {
        title: 'Parque da Cidade',
        id: '4b582915f964a5208e4c28e3',
        location: {
            lat: 41.168674,
            lng: -8.678836
        }
    },
    {
        title: 'Jardins do Palácio Cristal',
        id: '4c580f18b7a31b8d1b8b51da',
        location: {
            lat: 41.14834,
            lng: -8.625638
        }
    },
    {
        title: 'Ribeira',
        id: '4d8a13ee5ecdf04d77deb68a',
        location: {
            lat: 41.140696,
            lng: -8.613136
        }
    },
];
//**----The ViewModel----**//
// Maps api asynchronous load code here.
var map;
var markers = [];
var viewModel = {
    items: ko.observableArray([]),
    filter: ko.observable(""),

    markersFromModel: function() {
        largeInfowindow = new google.maps.InfoWindow();
        // Creates an array of the locations for use as markers on initialize.
        // Credit goes to the Google API course here on Udacity.
        for (var i = 0; i < locations.length; i++) {
            var position = locations[i].location;
            var title = locations[i].title;
            var id = locations[i].id;
            // Create markers for each location and puts into the markers array.
            var marker = new google.maps.Marker({
                position: position,
                map: map,
                title: title,
                animation: google.maps.Animation.DROP,
                id: id
            });
            // Push the marker to our array of markers.
            markers.push(marker);
            // Create an onclick event to open the large infowindow at each marker.
            marker.addListener('click', function() {
                viewModel.populateInfoWindow(this, largeInfowindow);
            });
        }
    },
    // Start the marker bounce
    toggleBounce: function(marker) {
        viewModel.stopBounce();
        marker.setAnimation(google.maps.Animation.BOUNCE);
    },
    // Stop the marker bounce
    stopBounce: function() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setAnimation(null);
        }
    },
    // First removes all markers, and then places them again if they are part of the filter.
    markersVisible: function() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(false);
            for (var j = 0; j < viewModel.filteredItems().length; j++) {
                if (markers[i].id == viewModel.filteredItems()[j].id) {
                    markers[i].setVisible(true);
                }
            }
        }
    },
    // Opens the infowindow when a point of interest is clicked in the list
    clickPoi: function(item) {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].id == item.id) {
                viewModel.populateInfoWindow(markers[i], largeInfowindow);
            }
        }
    },
    populateInfoWindow: function(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
                viewModel.stopBounce();
            });
            // This function does everything needed to get the Foursquare info loaded to the infoWindow.
            function getVenueInfo() {
                var clientId = 'TIMHF2YUJHPKIXG3N0OYDOIY5WH1VHB1XM1VICB5HSMEIGBT';
                var clientSecret = '3R3P1CBBAI4UFAGQCH5GCE0ANSSEJZ4KOLOK4KXFNLVU35XT';
                var foursquareLink = 'https://api.foursquare.com/v2/venues/';
                var version = '20170101';
                // Generate the url that we use in the .ajax request towards foursquare.
                var searchLink = foursquareLink + marker.id + '?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=' + version;

                $.getJSON(searchLink, function(data) {
                    var bestPhoto = data.response.venue.bestPhoto.prefix + 'width250' + data.response.venue.bestPhoto.suffix;
                    var rating = data.response.venue.rating;
                    var fsUrl = data.response.venue.canonicalUrl;
                    if (bestPhoto, rating, fsUrl) {
                        infowindow.setContent('<div class="lead text-center"><h4>' + marker.title + '</h4></div><div id="photo"></div><div><img src="' + bestPhoto + '" class="img-thumbnail center-block"></div><div><p> <h5>Foursquare Rating: <span class="venueScore positive"><span>' + rating + '</span><sup>/<span>10</span></sup></h5></p></div><div><a href=' + fsUrl + '><button type="button" class="btn btn-primary center-block"> Foursquare link</button> </a> </div>');
                    } else {
                        infowindow.setContent('<div>Nothing Found</div>');
                    }
                }).fail(function() {
                    infowindow.setContent('<div>No Foursquare information was Found for ' + marker.title + '!</div>');
                });
            }
            // Open the infowindow on the correct marker.
            viewModel.toggleBounce(marker);
            getVenueInfo();
            infowindow.open(map, marker);
        }
    }
};
//*************The Filtering*************//
viewModel.items = ko.observableArray(locations);
// Filters the items
viewModel.filteredItems = ko.computed(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
        return this.items();
    } else {
        return ko.utils.arrayFilter(this.items(), function(item) {
            return item.title.toLowerCase().indexOf(filter) >= 0;
        });
    }
}, viewModel);

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 41.157944,
            lng: -8.629105
        },
        zoom: 13,
        mapTypeControl: false
    });
    ko.applyBindings(new viewModel.markersFromModel());
}

// Hides the nav bar
var menu = document.querySelector('#menu');
var drawer = document.querySelector('.nav');
menu.addEventListener('click', function(e) {
    drawer.classList.toggle('open');
    e.stopPropagation();
});

// resizes google map, fixes bootstrap .container-fluid
$(window).resize(function() {
    var h = $(window).height(),
        offsetTop = 0; // Calculate the top offset

    $('#map').css('height', (h - offsetTop));
}).resize();

// Error call handler
var mapsInitError = function() {
    alert("Google Maps failed to load");
};
