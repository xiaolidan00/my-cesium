import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');
/**http://cesium.xin/cesium/cn/Documentation1.62/ScreenSpaceCameraController.html?classFilter=screenSpaceCameraController
 * rotateEventTypes : CameraEventType|Array|undefined
 * tiltEventTypes
 * translateEventTypes
 * zoomEventTypes
 * lookEventTypes
 */
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
/**
 * 控制缩放
 * minimumZoomDistance
 * maximumZoomDistance
 */

//看向某个物体，并旋转角度
const box = viewer.entities.add({
  id: 'box',
  position: Cesium.Cartesian3.fromDegrees(114.39, 30.5, 100.0),
  box: {
    dimensions: new Cesium.Cartesian3(100, 50, 30),
    material: Cesium.Color.BLUE
  }
});
viewer.camera.lookAt(
  Cesium.Cartesian3.fromDegrees(114.39, 30.5, 100.0),
  new Cesium.HeadingPitchRange(Cesium.Math.toRadians(45), Cesium.Math.toRadians(-30), 300)
);
viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
viewer.flyTo(box);

/**
viewer.camera.lookAt(
  Cesium.Cartesian3.fromDegrees(
    pos.lng,
    pos.lat -
      (PosUtil.is2D()
        ? 0
        : PosUtil.distanceToLat(
            height / Math.abs(Math.tan(Cesium.Math.toRadians(Math.abs(orient.pitch))))
          )),
    height
  ),
  new Cesium.HeadingPitchRange(
    Cesium.Math.toRadians(0),
    Cesium.Math.toRadians(PosUtil.is2D() ? -90 : orient.pitch),
    height
  )
);
viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
 */
