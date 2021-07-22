//Create Data Object
var feature = createObj();
//console.log(feature);
//console.log(feature[0].properties.job_count);

//Create overlayMap
var overlayMaps = {
  Breweries: new L.LayerGroup(),
};

// Adding tile layers
var streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

var baseMaps = {
  Satellite: satellite,
  Street: streets,
};

// Create additional Control placeholders
function addControlPlaceholders(map) {
  var corners = map._controlCorners,
    l = 'leaflet-',
    container = map._controlContainer;

  function createCorner(vSide, hSide) {
    var className = l + vSide + ' ' + l + hSide;

    corners[vSide + hSide] = L.DomUtil.create('div', className, container);
  }

  createCorner('verticalcenter', 'left');
  createCorner('verticalcenter', 'right');
}

//display planning breweries in a different color from the rest
function fillColor(type) {
  var color;
  if (type === "planning" || type === "Planning") {
    color = "gold";
  } else {
    color = "lightgreen";
  }
  return color;
}

// Create markers for breweries and add to overlayMaps placeholder.
d3.json("/breweries").then(data => {
  for (var i = 0; i < data.length; i++) {
    var lat = data[i].latitude;
    var lon = data[i].longitude;
    if (lat & lon) {
      var breweries = L.circleMarker([lat, lon], {
        fillOpacity: 1,
        color: "gray",
        weight: 0.5,
        fillColor: fillColor(data[i].brewery_type),
        radius: 5,
      }).bindPopup("<p>Name:" + data[i].name + "<br>Brewery Type: " + data[i].brewery_type + "<hr>website:<a href =" + data[i].website_url + ">" + data[i].website_url + "</a></p3>"
      );
      breweries.addTo(overlayMaps["Breweries"]);
    }
  }
})

//Create the map object with default layers

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

var myMap = L.map("map", {
  center: [31.51073, -96.4247],
  zoom: 4.5,
  layers: [streets]
});
//Create state boundaries on the map
var geojson;
//Set boundary map style, use job_count as the color for the state
setTimeout(timeout, 1000);
function timeout() {
  function style(feature) {
    return {
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.job_count)
    };
  }
  geojson = L.geoJson(feature, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(myMap);
}


// get color depending on population density value
function getColor(d) {
  return d > 1000 ? '#800026' :
    d > 500 ? '#BD0026' :
      d > 200 ? '#E31A1C' :
        d > 100 ? '#FC4E2A' :
          d > 50 ? '#FD8D3C' :
            d > 20 ? '#FEB24C' :
              d > 10 ? '#FED976' :
                '#FFEDA0';
}

//if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
//  layer.bringToFront();
//}

function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });
  info.update(layer.feature.properties);
}

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


//Adding legend
var legend_b = L.control({ position: 'verticalcenterright' });
legend_b.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    labels = ['<strong>Breweries</strong>'],
    categories = ['Planning','Existing'];
    
    for (var i = 0; i < categories.length; i++) {
            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + fillColor(categories[i]) + '"></i> ' +
            (categories[i] ? categories[i] : '+'));
        }
        div.innerHTML = labels.join('<br>');
    return div;
};

var legend = L.control({ position: 'bottomright' });
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

// Adding information box
var info = L.control({ position: 'verticalcenterleft' });

info.onAdd = function () {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML = (props ?
    '<h4>' + props.name + ' - '+ props.abname + '</h4><br /><br/><b>Population Density: </b>' + props.density + ' people / mi<sup>2</sup><br /><br/><b>Average Housing Price: </b>$'
    + props.average_home_price +
    '<br /><br/><b>Data Scientist Annual Salary: </b>$'
    + props.annual_wage_median.ds + ' <br /><br/><b>Data Engineer Annual Salary: </b>$'
    + props.annual_wage_median.de + ' <br /><br/><b>Data Job Availability: </b>'
    + props.job_count + ' <br /><br/><b>Breweries Availability: </b>'
    + props.breweries_count //update to meidan salary
    : '<b>Hover over a state to see <br/>job, housing and demographic inforamiotn <br/>about the state</b>');
};


addControlPlaceholders(myMap);
info.addTo(myMap);
legend.addTo(myMap);
L.control.layers(baseMaps, overlayMaps).addTo(myMap);
myMap.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');

myMap.on('overlayadd', function(eventLayer){
  legend_b.addTo(myMap);
  if (eventLayer.name === "Breweries"){
      myMap.addControl(legend_b);
  } 
});

myMap.on('overlayremove', function(eventLayer){
  if (eventLayer.name === "Breweries"){
       myMap.removeControl(legend_b);
  } 
});
//console.log();