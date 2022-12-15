export default class MapPage {
    markup(){
        return `<!DOCTYPE HTML>
        <html>
            <head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin=""/>
                <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
                <style>#map {height: 800px;}</style>
            </head>
            <body>
        
                <div id="map"></div>
        
                <script type="text/javascript">
                    var map = L.map('map').setView([39.8283, -98.5795], 5);
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19,attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
                    document.addEventListener("DOMContentLoaded", function(event) { 
                        const response = fetch('/for-map')
                            .then((response) => response.json())
                            .then((data) => {
                                for (let city of data){
                                    let mark = L.marker([city['lat'], city['lon']], {
                                        title: city.name,
                                        alt: city.name
                                    }).addTo(map);
                                    mark.bindPopup(city.name)
                                }         
                            });
                    });
                </script>
            </body>
        </html>`
    }
}