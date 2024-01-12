mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map",       // container ID -- must match the "id" of the div where we are displaying the map on the page
    center: [-74.5, 40],    // starting position [lng, lat]
    zoom: 9,                // starting zoom level
});
