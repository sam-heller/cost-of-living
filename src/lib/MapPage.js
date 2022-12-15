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
                const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
                    const hex = x.toString(16)
                    return hex.length === 1 ? '0' + hex : hex
                  }).join('')

                  
                    function markerColor(cost) {
                        color1 = [255,0,0]
                        color2 = [0,255,0]
                        var p = ((cost - 320) * .036) / 100
                        var w = p * 2 - 1;
                        var w1 = (w/1+1) / 2;
                        var w2 = 1 - w1;
                        return rgbToHex(Math.round(color1[0] * w1 + color2[0] * w2), Math.round(color1[1] * w1 + color2[1] * w2),Math.round(color1[2] * w1 + color2[2] * w2));
                    }

                    var map = L.map('map').setView([39.8283, -98.5795], 5);
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19,attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
                    document.addEventListener("DOMContentLoaded", function(event) { 
                        const response = fetch('/for-map')
                            .then((response) => response.json())
                            .then((data) => {
                                for (let city of data){
                                    let caption = city.name + ", " + city.state + "<br/>1BR Average $" + city.price
                                    let mark = L.circleMarker([city['lat'], city['lon']], {
                                        color: markerColor(city.price),
                                        fillColor: markerColor(city.price),
                                        fillOpacity: 1, 
                                        radius: 5,
                                        alt: caption
                                    }).addTo(map);
                                    mark.bindPopup(caption) 
                                }         
                            });
                    });
                </script>
            </body>
        </html>`
    }
}


// // 500 / 300  
// // {
//     color: "red",
//     fillColor: "#f03",
//     fillOpacity: 0.5,
//     radius: 50.0
// })