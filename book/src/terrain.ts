import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain({
    requestVertexNormals: true,
    //水面运动
    requestWaterMask: true
  })
});
//日夜光照
viewer.scene.globe.enableLighting = true;

//开启地下模式
viewer.scene.screenSpaceCameraController.enableCollisionDetection = false; //设置鼠标进入地下浏览

