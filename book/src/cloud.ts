import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(114, 30, 100.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});

const clouds = viewer.scene.primitives.add(
  new Cesium.CloudCollection({
    noiseDetail: 16.0
  })
);

const cloud = clouds.add({
  position: Cesium.Cartesian3.fromDegrees(114, 30, 100.0),
  scale: new Cesium.Cartesian2(25, 12),
  slice: 0.36,
  brightness: 1
});
viewer.camera.lookAt(
  Cesium.Cartesian3.fromDegrees(114, 30, 100.0),
  new Cesium.Cartesian3(30, 30, -10)
);
