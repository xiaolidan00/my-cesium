import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

function getCenter() {
  let center;
  const pos = new Cesium.Cartesian2(viewer.canvas.width * 0.5, viewer.canvas.height * 0.5);
  if (viewer.scene.pickPositionSupported) {
    center = Cesium.Cartographic.fromCartesian(viewer.scene.pickPosition(pos));
  } else {
    const ray = viewer.camera.getPickRay(pos);
    if (ray) center = viewer.scene.globe.pick(ray, viewer.scene);
  }

  if (Cesium.defined(center)) {
    const p = Cesium.Cartographic.fromCartesian(center);
    return [Cesium.Math.toDegrees(p.longitude), Cesium.Math.toDegrees(p.latitude), p.height];
  }
}
