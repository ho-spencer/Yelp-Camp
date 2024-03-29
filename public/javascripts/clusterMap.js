mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'cluster-map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-103.5917, 40.6699],
    zoom: 3
});

// Add zoom and rotation controls to the map
map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource('campgrounds', {
        type: 'geojson',
        // https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson -- example data format
        data: campgrounds,                  // point data to "campgrounds" -- variable from index.ejs which contains JSON stringified campground data for ALL campgrounds
        cluster: true,
        clusterMaxZoom: 14,                 // Max zoom to cluster points on
        clusterRadius: 50                   // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
            // with three steps to implement three types of circles:
            //   * #61A5C2, 20px circles when point count is less than 10
            //   * #468FAF, 30px circles when point count is between 10 and 30
            //   * #2C7DA0, 40px circles when point count is greater than or equal to 30
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#61A5C2',
                10,
                '#468FAF',
                30,
                '#2C7DA0'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,     // px width
                10,     // step (number of points)
                20,     // px width
                30,     // step (number of points)
                25      // px width
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    // unclustered (single) point properties
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgrounds',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#89C2D9',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('campgrounds').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;

                // point that is clicked becomes the center of the map as it zooms in to that point
                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', (e) => {
        const { popUpMarkup } = e.features[0].properties;                  // set properties.popUpMarkup to a variable (contains link to show page)
        const coordinates = e.features[0].geometry.coordinates.slice();
        
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        // popup when a point is clicked
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpMarkup)                // pass our popUpMarkup to the popup
            .addTo(map);
    });

    // update cursor style when hovering/unhovering over cluster
    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });
});
