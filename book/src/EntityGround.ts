import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain()
});

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(114, 30, 100.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});

//贴地控制
/**
 * heightReference属性
 * Cesium.HeightReference.NONE
 * 
NONE	 	绝对.
CLAMP_TO_GROUND	 	该位置被固定在地形和3D瓦片上.
RELATIVE_TO_GROUND	 	相对于地形和3D瓷砖的高度.
CLAMP_TO_TERRAIN	 	紧贴地形.
RELATIVE_TO_TERRAIN	 	相对于地形上的高度.
CLAMP_TO_3D_TILE	 	紧贴3D瓦片.
RELATIVE_TO_3D_TILE	 	相对于3D瓦片的高度.


classificationType属性
Cesium.ClassificationType.TERRAIN	 	仅被地形分类.
CESIUM_3D_TILE	 	仅3D瓦片被分类
BOTH	 	地形和3D瓦片都被分类.
 */

viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(114, 30),
  point: {
    color: Cesium.Color.RED,
    pixelSize: 50,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  }
});

viewer.entities.add({
  polyline: {
    material: Cesium.Color.RED,
    width: 5,
    positions: Cesium.Cartesian3.fromDegreesArray([114, 30, 114.002, 30]),
    clampToGround: true
  }
});

viewer.entities.add({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([114, 30, 114.002, 30, 114.002, 30.002]),
    material: Cesium.Color.RED,
    classificationType: Cesium.ClassificationType.BOTH
  }
});

viewer.entities.add({
  rectangle: {
    coordinates: Cesium.Rectangle.fromDegrees(114, 30, 114.002, 30.002),
    material: Cesium.Color.RED,
    classificationType: Cesium.ClassificationType.BOTH
  }
});
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(114, 30),
  ellipse: {
    semiMajorAxis: 40,
    semiMinorAxis: 25,

    material: Cesium.Color.RED,
    classificationType: Cesium.ClassificationType.BOTH
  }
});
viewer.entities.add({
  corridor: {
    positions: Cesium.Cartesian3.fromDegreesArray([114, 30, 114.002, 30, 114.002, 30.002]),
    width: 20,
    material: Cesium.Color.RED,
    classificationType: Cesium.ClassificationType.BOTH
  }
});
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(114, 30),
  orientation: Cesium.Transforms.headingPitchRollQuaternion(
    Cesium.Cartesian3.fromDegrees(114, 30),
    new Cesium.HeadingPitchRoll(0, Cesium.Math.toRadians(60), 0)
  ),
  model: {
    uri: './assets/Cesium_Man.glb',
    scale: 30,
    minimumPixelSize: 30,
    maximumScale: 500,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  }
});
