import * as Cesium from 'cesium';

Cesium.Ion.defaultAccessToken = 'Token';
const viewer = new Cesium.Viewer('cesiumContainer', {
  geocoder: true, //是否显示位置查找工具
  homeButton: true, //是否显示首页位置工具
  sceneModePicker: true, //是否显示视角模式切换工具
  baseLayerPicker: true, //是否默认图层选择工具
  navigationHelpButton: true, //是否显示导航帮助工具
  animation: true, //是否显示动画工具
  timeline: true, //是否显示时间轴工具
  fullscreenButton: true //是否显示全屏按钮工具
});
function computeEmitterModelMatrix() {
  const hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, new Cesium.HeadingPitchRoll());
  const trs = new Cesium.TranslationRotationScale();

  trs.translation = Cesium.Cartesian3.fromElements(-4.0, 0.0, 1.4, new Cesium.Cartesian3());
  trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, new Cesium.Quaternion());

  return Cesium.Matrix4.fromTranslationRotationScale(trs, new Cesium.Matrix4());
}

const particle = new Cesium.ParticleSystem({
  image: './assets/test.png',
  startScale: 1.0,
  endScale: 4.0,
  particleLife: 1.0,
  speed: 5.0,
  imageSize: new Cesium.Cartesian2(20, 20),
  emissionRate: 5.0,
  lifetime: 16.0,
  modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(114, 30, 100)
  ),
  emitterModelMatrix: computeEmitterModelMatrix()
});
