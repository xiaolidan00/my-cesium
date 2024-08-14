import 'cesium/Build/Cesium/Widgets/widgets.css';

import * as Cesium from 'cesium';

import type { OrientType, PosType } from './types.d';

import { EntityUtil } from './EntityUtil';
import { HtmlOverlay } from './HtmlOverlay';

console.log(Cesium);

export class CesiumMap {
  viewer: Cesium.Viewer;
  entityUtil: EntityUtil;
  htmlOverlay: HtmlOverlay;
  listener: Cesium.Event.RemoveCallback;
  constructor(containerId: string) {
    //暗色底图
    // const nightLayer=new Cesium.ImageryLayer.fromProviderAsync(
    //   Cesium.IonImageryProvider.fromAssetId(3812)
    // )
    // const dayLayer=Cesium.ImageryLayer.fromProviderAsync(
    //   Cesium.IonImageryProvider.fromAssetId(3845)
    // );
    const viewer = new Cesium.Viewer(containerId, {
      animation: false, // 左下角动画小组件
      baseLayerPicker: false, // 右上角底图选择组件
      fullscreenButton: false, // 右下角全屏组件
      vrButton: false, // 右下角VR模式组件
      geocoder: false, // 右上角地址搜索组件
      homeButton: false, // 右上角Home组件，点击之后将视图跳转到默认视角
      infoBox: false, // 信息框
      sceneModePicker: false, // 右上角场景模式切换组件，2D、3D 和 Columbus View (CV) 模式。
      selectionIndicator: false, //选取指示器组件
      timeline: false, // 底部时间轴
      navigationHelpButton: false, // 右上角鼠标操作
      // 导航说明
      navigationInstructionsInitiallyVisible: false,
      //山形
      terrain: Cesium.Terrain.fromWorldTerrain(),
      //阴影
      shadows: true
    });
    //Cesium的logo
    (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = 'none';
    viewer.scene.globe.depthTestAgainstTerrain = true; //地面以下不可见（高程遮挡） 会导致图标被地面覆盖问题
    viewer.scene.globe.translucency.enabled = true;

    viewer.scene.postProcessStages.fxaa.enabled = true;
    viewer.scene.globe.preloadAncestors = false;
    viewer.scene.globe.preloadSiblings = true;
    viewer.scene.globe.tileCacheSize = 1000;
    viewer.scene.globe.maximumScreenSpaceError = 2;
    viewer.scene.screenSpaceCameraController.inertiaTranslate = 0.3; //移动的阻尼值
    viewer.scene.screenSpaceCameraController.inertiaZoom = 0.5; //缩放的阻尼值
    viewer.scene.screenSpaceCameraController.inertiaSpin = 0.1; //旋转的阻尼值
    // viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#a3b9ce');
    viewer.scene.screenSpaceCameraController.enableCollisionDetection = false; //禁止模型穿透

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
      },
      Cesium.CameraEventType.MIDDLE_DRAG
    ];
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      // Cesium.CameraEventType.MIDDLE_DRAG,
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH
    ];

    this.viewer = viewer;

    //添加html
    this.htmlOverlay = new HtmlOverlay(viewer);

    //添加实体
    this.entityUtil = new EntityUtil(viewer);

    this.listener = this.viewer.scene.preRender.addEventListener(() => {});
  }
  destroy() {
    this.htmlOverlay.destroy();
    this.entityUtil.destroy();
    this.listener();
  }

  setView(deg: PosType, o: OrientType) {
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(deg.lng, deg.lat, deg.height),
      orientation: {
        heading: Cesium.Math.toRadians(o.heading),
        pitch: Cesium.Math.toRadians(o.pitch),
        roll: Cesium.Math.toRadians(o.roll)
      }
    });
  }
  flyTo(deg: PosType, o: OrientType, duration: number) {
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(deg.lng, deg.lat, deg.height),
      orientation: o
        ? {
            heading: Cesium.Math.toRadians(o.heading),
            pitch: Cesium.Math.toRadians(o.pitch),
            roll: Cesium.Math.toRadians(o.roll)
          }
        : undefined,
      duration
    });
  }
}
