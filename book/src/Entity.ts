import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(114.39, 30.5, 100.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});

// viewer.entities.add({
//   id: 'point',
//   show: true,
//   position: Cesium.Cartesian3.fromDegrees(114.39, 30.5, 100),
//   point: {
//     color: Cesium.Color.BLUE,
//     pixelSize: 10
//   }
// });

// viewer.entities.add({
//   id: 'polyline',
//   show: true,

//   polyline: {
//     material: Cesium.Color.BLUE,
//     width: 5,
//     // clampToGround:true,
//     // positions: Cesium.Cartesian3.fromDegreesArray([114.39, 30.5, 114.39, 30.502])
//     positions: Cesium.Cartesian3.fromDegreesArrayHeights([114.39, 30.5, 100, 114.39, 30.502, 50])
//   }
// });

// viewer.entities.add({
//   id: 'polygon',
//   show: true,
//   polygon: {
//     hierarchy: Cesium.Cartesian3.fromDegreesArray([114.39, 30.5, 114.39, 30.502, 114.392, 30.5]),
//     material: Cesium.Color.RED.withAlpha(0.5)
//   }
// });
viewer.entities.add({
  id: 'rectangle',
  show: true,
  rectangle: {
    coordinates: Cesium.Rectangle.fromDegrees(114.39, 30.5, 114.392, 30.502),
    material: Cesium.Color.RED.withAlpha(0.5)
  }
});
