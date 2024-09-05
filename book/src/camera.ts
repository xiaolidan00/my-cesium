import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

//修改鼠标右键为倾斜视角操作
viewer.scene.screenSpaceCameraController.tiltEventTypes = [
  Cesium.CameraEventType.RIGHT_DRAG,
  Cesium.CameraEventType.PINCH,
  {
    eventType: Cesium.CameraEventType.LEFT_DRAG,
    modifier: Cesium.KeyboardEventModifier.CTRL
  },
  {
    eventType: Cesium.CameraEventType.RIGHT_DRAG,
    modifier: Cesium.KeyboardEventModifier.CTRL
  }
];
//修改鼠标滚轮为缩放操作
viewer.scene.screenSpaceCameraController.zoomEventTypes = [
  Cesium.CameraEventType.MIDDLE_DRAG,
  Cesium.CameraEventType.WHEEL,
  Cesium.CameraEventType.PINCH
];
