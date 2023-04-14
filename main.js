import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Fill, Stroke, Icon, Style} from 'ol/style';
import {fromLonLat} from 'ol/proj';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: fromLonLat([-119.7714, 34.0116]), // Chino Hills, CA
    zoom: 7
  })
});

const createDotImage = (color, radius) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const size = radius * 2;

  canvas.width = size;
  canvas.height = size;

  context.beginPath();
  context.arc(radius, radius, radius, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();

  return canvas.toDataURL();
};

const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: feature => {
    const color = feature.get('color');
    const radius = feature.get('radius');
    return new Style({
      image: new Icon({
        src: createDotImage(color, radius),
        imgSize: [radius, radius],
        anchor: [0.5, 0.5],
        crossOrigin: 'anonymous'
      }),
      stroke: new Stroke({
        color: '#000',
        width: 5
      })
    });
  }
});

map.addLayer(vectorLayer);

const points = [
  {
    coords: [-117.7263, 33.9898], // Chino Hills, CA
    color: 'red',
    radius: 7
  },
  {
    coords: [-121.6555, 36.6777], // Salinas, CA
    color: 'blue',
    radius: 7
  },
  {
    coords: [-121.9780, 37.7648], // San Ramon, CA
    color: 'green',
    radius: 7
  }
];
points.forEach(point => {
  const feature = new Feature({
    geometry: new Point(fromLonLat(point.coords)),
    color: point.color,
    radius: point.radius
  });
  const dotImage = new Icon({
    src: createDotImage(point.color, point.radius),
    imgSize: [point.radius * 2, point.radius * 2],
    anchor: [0.5, 0.5],
    crossOrigin: 'anonymous'
  });
  const dotStyle = new Style({
    image: dotImage,
    stroke: new Stroke({
      color: '#000',
      width: 5
    })
  });
  feature.setStyle(dotStyle);
  vectorSource.addFeature(feature);
});