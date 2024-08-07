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

