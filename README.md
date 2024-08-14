# 1.Cesium

## camera
```js
//禁止模型穿透 
 viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;  

//设置相机高度属性 
 
viewer.scene.screenSpaceCameraController.minimumZoomDistance = 0;
//相机的高度的最小值
 
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1000; 
 //相机高度的最大值
```

### 限制高度
```js
 cameraListener = viewer.camera.changed.addEventListener(() => {
        limitCameraHeight();
      });
      //取消监听
      cameraListener()
      const limitCameraHeight = () => {
  const viewer = cesium.pMapView.viewer;
  // 当前高度
  let height = viewer.camera.positionCartographic.height;
  //限制在当前高度10米以上
  if (height < curHeight.value + 10) {
    console.log('%climitCameraHeight', 'background:yellow');
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromRadians(
        viewer.camera.positionCartographic.longitude,
        viewer.camera.positionCartographic.latitude,
        curHeight.value + 10
      ),
      orientation: {
        heading: viewer.camera.heading,
        pitch: viewer.camera.pitch,
        roll: viewer.camera.roll
      }
    });
  }
};
```

```js
  /**
   * 初始化地图
   * @param xc 经度
   * @param yc 纬度
   * @param level 地图缩放等级
   * @param loadback 地图初始化完成回调函数
   */
  initMap(
    xc: number = 113.474353,
    yc: number = 22.744459,
    level: number = 9.5,
    loadback?: () => void
  ) {
    if (this.viewer) {
      // 设置地图位置
      this.setMapsCenterAndLevel(xc, yc, level);

      if (typeof loadback === 'function') {
        loadback();
      }
      return;
    }

    // this.initMapsSetting();
    Cesium.Ion.defaultAccessToken = cesiumToken;
    this.viewer = new Cesium.Viewer(this.divId, {
      sceneMode: Cesium.SceneMode.SCENE2D, // 2d显示
      mapMode2D: Cesium.MapMode2D.ROTATE, // 可以旋转
      // mapMode2D: Cesium.MapMode2D.INFINITE_SCROLL, // 无限滚轮
      // sceneMode: Cesium.SceneMode.SCENE3D, // 默认显示为2.5D地图
      // mapMode2D: Cesium.MapMode2D.ROTATE, // 切换2D显示时可旋转
      geocoder: false, // 搜索按钮取消
      homeButton: false, // 主页按钮取消
      baseLayerPicker: false, // 底图选择器取消
      sceneModePicker: false, // 视角选择器取消
      navigationHelpButton: false, // 帮助按钮取消
      animation: false, // 动画控制器取消
      fullscreenButton: false, // 全屏按钮取消
      vrButton: false, // VR模式取消
      infoBox: false, // 信息框取消
      selectionIndicator: false, // 选取指示器取消
      timeline: false, // 时间轴取消
      showRenderLoopErrors: true, // 抛出含错误的HTML面板
      contextOptions: {
        requestWebgl1: true
      },
      msaaSamples: 4,
      blurActiveElementOnCanvasFocus: true,
      orderIndependentTranslucency: false,
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: tdtMap.TDT_IMG_C,
        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        maximumLevel: 18,
        customTags: {
          tk: this.tkRandomFun
        }
      })
    });

    this.viewer.scene.globe.depthTestAgainstTerrain = true; //地面以下不可见（高程遮挡） 会导致图标被地面覆盖问题
    this.viewer.scene.globe.translucency.enabled = true;
    this.viewer.scene.fxaa = false;
    this.viewer.scene.postProcessStages.fxaa.enabled = true;
    this.viewer.scene.globe.preloadAncestors = false;
    this.viewer.scene.globe.preloadSiblings = true;
    this.viewer.scene.globe.tileCacheSize = 1000;
    this.viewer.scene.globe.maximumScreenSpaceError = 2;
    this.viewer.scene.screenSpaceCameraController.inertiaTranslate = 0.3; //移动的阻尼值
    this.viewer.scene.screenSpaceCameraController.inertiaZoom = 0.5; //缩放的阻尼值
    this.viewer.scene.screenSpaceCameraController.inertiaSpin = 0.1; //旋转的阻尼值
    this.viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#a3b9ce');
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    //设置操作的相关参数
    //限制pitch视角和相机高度范围
    const minPitch = Cesium.Math.toRadians(-90);
    const maxPitch = Cesium.Math.toRadians(-10);
    console.log(
      `%cminpitch=${minPitch},maxpitch=${maxPitch},current=${this.viewer.camera.pitch}`,
      'background:yellow'
    );
    const minHeight = 10;
    this.viewer.camera.changed.addEventListener(() => {
      const pitch = this.viewer.camera.pitch;

      const height = this.viewer.camera.positionCartographic.height;
      const newHeight = height < minHeight ? minHeight : height;
      const newPitch = pitch < minPitch ? minPitch : pitch > maxPitch ? maxPitch : pitch;
      if (height !== newHeight || pitch !== newPitch) {
        this.viewer.camera.setView({
          destination: Cesium.Cartesian3.fromRadians(
            this.viewer.camera.positionCartographic.longitude,
            this.viewer.camera.positionCartographic.latitude,
            newHeight
          ),
          orientation: {
            heading: this.viewer.camera.heading,
            pitch: newPitch,
            roll: this.viewer.camera.roll
          }
        });
        console.log(`%cnewPitch=${newPitch},newHeight=${newHeight}`, 'background:yellow');
      }
    });
    this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = false; //禁止模型穿透
    this.viewer.scene.screenSpaceCameraController.inertiaTranslate = 0.3; //移动的阻尼值
    this.viewer.scene.screenSpaceCameraController.inertiaZoom = 0.5; //缩放的阻尼值
    this.viewer.scene.screenSpaceCameraController.inertiaSpin = 0.1; //旋转的阻尼值
    this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = this.mapsLevelToHeight(20); //200
    this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = this.mapsLevelToHeight(3); //16067279; // 设置相机最大高度

    // this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    //   Cesium.CameraEventType.RIGHT_DRAG,
    //   Cesium.CameraEventType.PINCH,
    //   { eventType: Cesium.CameraEventType.LEFT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL },
    //   { eventType: Cesium.CameraEventType.RIGHT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL }
    // ];
    // //MapHolder.View.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.RIGHT_DRAG, Cesium.CameraEventType.PINCH, { eventType: Cesium.CameraEventType.LEFT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL }, { eventType: Cesium.CameraEventType.RIGHT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL }];
    // this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
    //   Cesium.CameraEventType.MIDDLE_DRAG,
    //   Cesium.CameraEventType.WHEEL,
    //   Cesium.CameraEventType.PINCH
    // ];
    this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [
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
    this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      // Cesium.CameraEventType.MIDDLE_DRAG,
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH
    ];
  }
```

