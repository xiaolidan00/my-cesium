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
