import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

const origin = Cesium.Cartesian3.fromDegrees(114.39, 30.5, 50.0);
const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
try {
  const model = await Cesium.Model.fromGltfAsync({
    url: './assets/house.glb',

    modelMatrix: modelMatrix,
    scale: 50
  });
  console.log('🚀 ~ model:', model);
  viewer.scene.primitives.add(model);
} catch (error) {
  console.log(error);
}
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(114.39, 30.5, 100.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});
