import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain()
});
const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(124624234);
viewer.scene.primitives.add(tileset);
const height = tileset.getHeight(viewer.scene.camera.positionCartographic, viewer.scene);
// 获取高程
//https://cesium.com/learn/cesiumjs/ref-doc/global.html?classFilter=sampleTerrain#sampleTerrain
//计算贴地线段长度
// Query the terrain height of two Cartographic positions
const terrainProvider = await Cesium.createWorldTerrainAsync();
const positions = [
  Cesium.Cartographic.fromDegrees(86.925145, 27.988257),
  Cesium.Cartographic.fromDegrees(87.0, 28.0)
];
const updatedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, positions);
// positions[0].height and positions[1].height have been updated.
// updatedPositions is just a reference to positions.

// To handle tile errors, pass true for the rejectOnTileFail parameter.
try {
  const updatedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, positions, true);
} catch (error) {
  // A tile request error occurred.
}

//3dtiles模型 高度采样clampToHeightMostDetailed
//https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#clampToHeightMostDetailed
const count = 30;
const clampedCartesians = await scene.clampToHeightMostDetailed(
  Cesium.Cartesian3.lerp(cartesian1, cartesian2, offset, new Cesium.Cartesian3())
);
//gltf模型 高度采样
//https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#sampleHeightMostDetailed
