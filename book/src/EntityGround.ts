import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

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
  polyline: {
    material: Cesium.Color.RED,
    width: 5,
    positions: Cesium.Cartesian3.fromDegreesArray([114, 30, 114.002, 30]),
    clampToGround: true
  }
});
