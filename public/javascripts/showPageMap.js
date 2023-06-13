mapboxgl.accessToken = "pk.eyJ1Ijoic2hpdmFuc2gtMjMyIiwiYSI6ImNsZ200YThnbzAxNG0zaHM5YXI0ZHd3aHEifQ.4kC5CgZ8OVL-z3yd1QRbEQ";
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12', // stylesheet location
    center: college.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(college.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${college.title}</h3><p>${college.location}</p>`
            )
    )
    .addTo(map)

map.addControl(new mapboxgl.NavigationControl());