import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

viewer.scene.morphTo2D(1); //二维

viewer.scene.morphTo3D(1); //三维

viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(114, 30, 100.0),
  box: {
    dimensions: new Cesium.Cartesian3(50, 50, 50),
    material: Cesium.Color.BLUE
  }
});
//lookAt会被固定视角范围，一直围绕中心点
// viewer.camera.lookAt(
//   Cesium.Cartesian3.fromDegrees(114, 30, 100.0),
//   new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 200)
// );
//解除视角锁定
//viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

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
  return null;
}

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(114, 30, Math.tan(Cesium.Math.toRadians(30)) * 100)
});

// 2.5D 哥伦布模式
viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
// 2D 模式
viewer.scene.mode = Cesium.SceneMode.SCENE2D;
// 3D 模式
viewer.scene.mode = Cesium.SceneMode.SCENE3D;
// 变形模式
viewer.scene.mode = Cesium.SceneMode.MORPHING;

// 2.5D 哥伦布模式
viewer.scene.morphToColumbusView(1);
// 2D 模式
viewer.scene.morphTo2D(1);
// 3D 模式
viewer.scene.morphTo3D(1);
