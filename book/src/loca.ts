import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

const hander = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

let cartesian3;
//点击获取屏幕坐标
hander.setInputAction((ev) => {
  console.log(ev.position);
  //获取场景坐标
  {
    cartesian3 = viewer.scene.pickPosition(ev.position);
  }

  //获取地表坐标

  {
    const ray = viewer.camera.getPickRay(ev.position);
    if (ray) {
      cartesian3 = viewer.scene.globe.pick(ray, viewer.scene);
    }
  }
  //获取椭球面坐标
  {
    cartesian3 = viewer.scene.camera.pickEllipsoid(ev.position);
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//世界坐标转屏幕坐标
{
  const cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian3);
}

//世界坐标转wgs84
{
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
}
//弧度和经纬度相互转换
{
  const degrees = 113;
  const radians = Cesium.Math.toRadians(degrees);
}
{
  const radians = Math.PI * 0.5;
  const degrees = Cesium.Math.toDegrees(radians);
}
//经纬度坐标转世界坐标
{
  const lng = 113,
    lat = 39,
    height = 1000;
  const c = Cesium.Cartesian3.fromDegrees(lng, lat, height);
}

//经纬度转世界坐标
{
  const lng = Cesium.Math.toRadians(113),
    lat = Cesium.Math.toRadians(39),
    height = 1000;
  const c = Cesium.Cartesian3.fromRadians(lng, lat, height);
}
