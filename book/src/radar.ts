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
let rotation = 0; //纹理旋转角度
let amount = 4; //旋转变化量
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(114, 30, 100.0),
  ellipse: {
    semiMajorAxis: 100,
    semiMinorAxis: 50,
    material: new Cesium.ImageMaterialProperty({
      image: './assets/test.png',
      color: new Cesium.Color(1.0, 1.0, 0.0, 0.5)
    }),
    height: 0,
    outline: true,
    outlineColor: Cesium.Color.RED,
    outlineWidth: 2,
    stRotation: new Cesium.CallbackProperty(() => {
      rotation += amount;
      if (amount >= 360 || rotation <= -360) {
        rotation = 0;
      }
      return Cesium.Math.toRadians(rotation);
    }, false)
  }
});
