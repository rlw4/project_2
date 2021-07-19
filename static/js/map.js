// Creating map object
var statesData = createObj();
//console.log(statesData);
var myMap = L.map("map", {
  center: [31.51073, -96.4247],
  zoom: 4.5
});

var overlayMaps = {
  DataJobs: new L.LayerGroup(),
  Breweries: new L.LayerGroup()
};

// Adding tile layers
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

// Adding information box
var info = L.control({position: 'bottomleft'});

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML = '<h4>Information</h4>' +  (props ?
    '<b>' + props.name + '</b><br /><b>Population Density: </b>' + props.density + ' people / mi<sup>2</sup><br /><b>Average Housing Price: </b>$'
    + props.average_home_price +' <br /><b>Data Scientist Annual Salary: </b>$'
    + props.annual_wage_median.ds+' <br /><b>Data Engineer Annual Salary: </b>$'
    + props.annual_wage_median.de+' <br /><b>Data Job Availability: </b>'
    + props.job_count+' <br /><b>Breweries Availability: </b>'
    + props.breweries_count //update to meidan salary
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

  //if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
  //  layer.bringToFront();
  //}

  info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    e.target.bringToBack();
  }
  info.update();
}

function zoomToFeature(e) {
  myMap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  console.log(feature);
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


var legend1 = L.control({position: 'bottomright'});

legend1.onAdd = function (map) {

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

legend1.addTo(myMap);

//display planning breweries in a different color from the rest
function fillColor(type){
  var color;
  if (type === "planning"){
    color = "gold";
  } else {
    color = "lightgreen";
  }
  return color;
}

//draw breweries circle markers on the map
d3.json("/breweries").then(data =>{
  for (var i=0; i<data.length; i++){
    var lat = data[i].latitude;
    var lon = data[i].longitude;
    if (lat & lon){
      var breweries = L.circleMarker([lat,lon], {
        fillOpacity: 1,
        color: "gray",
        weight: 0.5,
        fillColor: fillColor(data[i].brewery_type),
        radius: 5,
      }).bindPopup("<p>Name:" + data[i].name + "<br>Brewery Type: "+data[i].brewery_type+"<hr>website:<a href ="+data[i].website_url+">"+data[i].website_url+"</a></p3>"
      );
      breweries.addTo(overlayMaps["Breweries"]);
      }
    }
})




L.control.layers(baseMaps, overlayMaps).addTo(myMap);