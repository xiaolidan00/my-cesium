import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

const czml = [
  { id: 'document', name: 'CZML Model', version: '1.0' },
  {
    id: 'model',
    name: 'hahah',
    position: {
      cartographicDegrees: [114.39, 30.5, 10.0]
    },
    model: {
      gltf: './assets/house.glb',
      scale: 50
    }
  }
];
const datasource = viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
datasource.then((data) => {
  console.log(data.entities.getById('model'));
});
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(114.39, 30.5, 100.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});
