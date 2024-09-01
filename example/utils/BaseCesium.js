export default class BaseCesium {
  constructor() {
    this.viewerConfig = {
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
    };
    this.domId = 'cesiumContainer';
  }
  init() {
    const viewer = new Cesium.Viewer(this.domId, this.viewerConfig);
    this.viewer = viewer;
    viewer.cesiumWidget.creditContainer.style.display = 'none';
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
    window.BaseCesium = this;
  }
  //获取当前画面中心点位置
  getCenter() {
    const canvas = this.viewer.canvas;
    const center = Cesium.Cartographic.fromCartesian(
      this.viewer.scene.pickPosition(new Cesium.Cartesian2(canvas.width * 0.5, canvas.height * 0.5))
    );
    console.log({
      lng: Cesium.Math.toDegrees(center.longitude),
      lat: Cesium.Math.toDegrees(center.latitude),
      height: center.height
    });
  }
  //设置视角
  setView(
    pos,
    orient = {
      heading: 0.0,
      pitch: -45,
      roll: 0.0
    }
  ) {
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(pos.lng, pos.lat, pos.height),
      orientation: {
        heading: Cesium.Math.toRadians(orient.heading),
        pitch: Cesium.Math.toRadians(orient.pitch),
        roll: Cesium.Math.toRadians(orient.roll)
      }
    });
  }
  //获取当前视角
  getView() {
    const camera = this.viewer.camera;
    const pos = camera.positionCartographic;
    console.log(
      {
        lng: Cesium.Math.toDegrees(pos.longitude),
        lat: Cesium.Math.toDegrees(pos.latitude),
        height: pos.height
      },
      {
        heading: Math.round(Cesium.Math.toDegrees(camera.heading)),
        pitch: Math.round(Cesium.Math.toDegrees(camera.pitch)),
        roll: Math.round(Cesium.Math.toDegrees(camera.roll))
      }
    );
  }
  createMap() {}
}
