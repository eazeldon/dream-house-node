
////mapboxgl.accessToken = 'pk.eyJ1IjoiZWF6ZWxkb25mMSIsImEiOiJja2sxcTI2cXkwdGxkMnVwY21qOHpvc2dzIn0.8BS-PnxgH4cmXsbS3V5wuw';

//mapboxgl.accessToken = '<%-process.env.MAPBOX_TOKEN%>';
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    //streets-v11 or satellite-v9 or dark-v10
    style: 'mapbox://styles/mapbox/outdoors-v11', // stylesheet location
    //center: [-74.5, 40], // starting position [lng, lat]
    center: house.geometry.coordinates,
    zoom: 9// starting zoom
});

///controls
map.addControl(new mapboxgl.NavigationControl());



////marker

new mapboxgl.Marker()
    //.setLngLat([-74.5, 40])
    .setLngLat(house.geometry.coordinates)
    //description and address of a marker
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${house.title}</h3><p>${house.location}</p>`
            )
    )

    .addTo(map)
