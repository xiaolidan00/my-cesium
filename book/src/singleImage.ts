import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');
const rectangle = Cesium.Rectangle.fromDegrees(114.38, 30.5, 114.4, 30.52);
viewer.imageryLayers.addImageryProvider(
  new Cesium.SingleTileImageryProvider({
    url: './assets/test.png',
    rectangle
  })
);

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(114.39, 30.5, 100.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});
