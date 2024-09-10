import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer', {
  timeline: true,
  animation: true
});

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(114, 30, 100.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});
//https://sandcastle.cesium.com/index.html?src=Video.html
const videoDom = document.createElement('video');
videoDom.src = './assets/big-buck-bunny_trailer.mp4';
videoDom.loop = true;
videoDom.autoplay = true;
document.body.appendChild(videoDom);
let synchoronizer = new Cesium.VideoSynchronizer({
  clock: viewer.clock,
  element: videoDom
});

const sphere = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(114, 30, 100.0),
  ellipsoid: {
    radii: new Cesium.Cartesian3(50, 50, 50),
    material: videoDom
  }
});
let isRepeating = true;
//将相机视角锁定sphere
viewer.trackedEntity = sphere;
sphere.ellipsoid.material.repeat = new Cesium.CallbackProperty(function (time, result) {
  if (!Cesium.defined(result)) {
    result = new Cesium.Cartesian2();
  }
  if (isRepeating) {
    result.x = 8;
    result.y = 8;
  } else {
    result.x = 1;
    result.y = 1;
  }
  return result;
}, false);

//分辨率
viewer.resolutionScale = 2.0;
