// Enable Map
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map",                               // container ID -- must match the "id" of the div where we are displaying the map on the page
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center:  campground.geometry.coordinates,       // starting position [lng, lat] - coordinates from geocoding
    zoom: 10,                                       // starting zoom level
});

// Add Marker
const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${ campground.title }</h3><p>${ campground.location }</p>`
        )
    )
    .addTo(map);
