const socket = io();

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };
        socket.emit('sendLocation', coords);

    },
    (error) => {
        console.log(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }


);
}

const map =   L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; CheekyCasanova"
}).addTo(map);


const marker = {};

socket.on('receiveLocation', (data) => {

    const {id,lat,lon} = data;
    map.setView([lat, lon]);
    if(marker[id]) {
        marker[id].setLatLng([lat, lon]);
    } else {
        marker[id] = L.marker([lat, lon]).addTo(map);
    }
});

socket.on('user disconnected', (id) => {
    
    if(marker[id]) {
        map.removeLayer(marker[id]);
        delete marker[id];
    }
});
    