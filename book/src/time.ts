import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer', {
  timeline: true,
  animation: true
});

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(113, 39, 100.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});
const tileset = viewer.scene.primitives.add(Cesium.Cesium3DTileset.fromUrl('tileset.json'));
const model = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(113, 39),
  model: {
    uri: './assets/Cesium_Air.glb'
  }
});
model.orientation = new Cesium.VelocityOrientationProperty(model.position);
const positionProperty = model.position;
function start() {
  viewer.clock.shouldAnimate = true;
  viewer.scene.postRender.addEventListener(() => {
    const pos = positionProperty?.getValue(viewer.clock.currentTime);
    model.position = viewer.scene.clampToHeight(pos, [model]);
  });
}
tileset.initialTilesLoaded.addEventListener(start);
