// Creating map object
var statesData = createObj();
console.log(statesData);
var myMap = L.map("map", {
  center: [31.51073, -96.4247],
  zoom: 4.5
});

var overlayMaps = {
  DataJobs: new L.LayerGroup(),
  Breweries: new L.LayerGroup()
};

// Adding tile layer
var streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
}).addTo(myMap);

var baseMaps = {
  Satellite: satellite,
  Street: streets,
};

var info = L.control({position: 'bottomleft'});

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML = '<h4>Information</h4>' +  (props ?
    '<b>' + props.name + '</b><br /><b>Population Density: </b>' + props.density + ' people / mi<sup>2</sup><br /><b>Average Housing Price: </b>$'
    + props.average_home_price +' <br /><b>Data Jobs - Median Salary: </b>$'
    + props.average_home_price //update to meidan salary
    : 'Hover over a state');
};

info.addTo(myMap);


// get color depending on population density value
function getColor(d) {
  return d > 1000 ? '#800026' :
      d > 500  ? '#BD0026' :
      d > 200  ? '#E31A1C' :
      d > 100  ? '#FC4E2A' :
      d > 50   ? '#FD8D3C' :
      d > 20   ? '#FEB24C' :
      d > 10   ? '#FED976' :
            '#FFEDA0';
}

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.density)
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  myMap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

geojson = L.geoJson(statesData, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(myMap);

//myMap.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [],
    from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' + getColor(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(myMap);

d3.json("/breweries").then(data =>{
  for (var i=0; i<data.length; i++){
    var lat = data[i].latitude;
    var lon = data[i].longitude;
    if (lat & lon){
      var breweries = L.circleMarker([lat,lon], {
        fillOpacity: 0.75,
        color: "gray",
        weight: 0.5,
        fillColor: "lightblue",
        radius: 5,
      }).bindPopup("<h3>" + data[i].name + "<hr><br/>Name:<a herf ="+data[i].website_url+">"+data[i].website_url+"</a></h3>"
      );
      breweries.addTo(overlayMaps["Breweries"]);
      }
    }
})




L.control.layers(baseMaps, overlayMaps).addTo(myMap);