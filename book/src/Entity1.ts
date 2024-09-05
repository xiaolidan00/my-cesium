import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

viewer.entities.add({
  id: 'ellipse',
  position: Cesium.Cartesian3.fromDegrees(113, 39, 50),
  ellipse: {
    semiMajorAxis: 200,
    semiMinorAxis: 100,
    material: Cesium.Color.RED.withAlpha(0.5)
  }
});

viewer.entities.add({
  id: 'cylinder',
  position: Cesium.Cartesian3.fromDegrees(113, 39, 50),
  cylinder: {
    length: 30,
    topRadius: 10,
    bottomRadius: 20,
    material: Cesium.Color.GREEN
  }
});

viewer.entities.add({
  id: 'corridor',

  corridor: {
    positions: Cesium.Cartesian3.fromDegreesArray([113, 39, 113.002, 39.002, 113, 38.998]),
    width: 100,
    material: Cesium.Color.BLUE
  }
});

viewer.entities.add({
  id: 'wall',
  wall: {
    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
      113, 39, 100, 113.002, 39.002, 50, 113, 38.998, 70
    ]),
    material: Cesium.Color.BLUE
  }
});
viewer.entities.add({
  id: 'box',
  position: Cesium.Cartesian3.fromDegrees(113, 39, 50),
  box: {
    dimensions: new Cesium.Cartesian3(100, 50, 30),
    material: Cesium.Color.BLUE
  }
});
viewer.entities.add({
  id: 'ellipsoid',
  position: Cesium.Cartesian3.fromDegrees(113, 39, 50),
  ellipsoid: {
    radii: new Cesium.Cartesian3(100, 50, 30),
    material: Cesium.Color.BLUE
  }
});
const pos = Cesium.Cartesian3.fromDegrees(113, 39, 50);
viewer.entities.add({
  id: 'model',
  position: pos,
  orientation: Cesium.Transforms.headingPitchRollQuaternion(
    pos,
    new Cesium.HeadingPitchRoll(0, Cesium.Math.toDegrees(-45), 0)
  ),
  model: {
    uri: './assets/Cesium_Man.glb',
    minimumPixelSize: 300,
    maximumScale: 10000,
    scale: 100
  }
});

viewer.entities.add({
  id: 'billboard',
  position: Cesium.Cartesian3.fromDegrees(113, 39, 50),
  billboard: {
    image: './assets/test.png',
    scale: 0.5
  }
});
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(113, 39, 100),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0
  }
});
