import * as Cesium from 'cesium';

//空间距离 单位米
function getSpaceDistance(positions: Cesium.Cartesian3[]) {
  let distance = 0;
  const geodesic = new Cesium.EllipsoidGeodesic();

  for (let i = 0; i < positions.length - 1; i++) {
    //计算直接距离
    distance += Cesium.Cartesian3.distance(positions[i], positions[i + 1]);
    const c1 = Cesium.Cartographic.fromCartesian(positions[i]);
    const c2 = Cesium.Cartographic.fromCartesian(positions[i + 1]);

    geodesic.setEndPoints(c1, c2);
    let s = geodesic.surfaceDistance;
    //两点之间的空间距离
    s = Math.sqrt(Math.pow(s, 2) + Math.pow(c2.height - c1.height, 2));
    distance = distance + s;
  }
  return distance;
}

function getBearing(from: Cesium.Cartographic, to: Cesium.Cartographic) {
  const lon1 = from.longitude;
  const lon2 = to.longitude;
  const lat1 = from.latitude;
  const lat2 = to.latitude;
  //返回从原点到x,y点的线段与x轴正方形之间的平面角度(弧度)
  let angel = -Math.atan2(
    Math.sin(lon1 - lon2) * Math.cos(lat2),
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
  );
  if (angel < 0) {
    angel += Math.PI * 2.0;
  }
  return Cesium.Math.toDegrees(angel);
}
function getAngle(p1: Cesium.Cartographic, p2: Cesium.Cartographic, p3: Cesium.Cartographic) {
  const b21 = getBearing(p2, p1);
  const b23 = getBearing(p2, p3);
  let angle = b21 - b23;
  if (angle < 0) {
    angle += 360;
  }
  return angle;
}
function getDistance(point1: Cesium.Cartographic, point2: Cesium.Cartographic) {
  //根据经纬度计算距离
  const geodesic = new Cesium.EllipsoidGeodesic();
  //设置起点终点
  geodesic.setEndPoints(point1, point2);
  //起点和终点表面距离
  let s = geodesic.surfaceDistance;
  //两点之间的距离
  s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2.height - point1.height, 2));
  return s;
}

function getArea(points: Cesium.Cartographic[]) {
  let res = 0;
  //拆分三角面
  for (let i = 0; i < points.length - 2; i++) {
    //相邻三个点
    const j = (i + 1) % points.length;
    const k = (i + 2) % points.length;
    let totalAngle = getAngle(points[i], points[j], points[k]);
    const d1 = getDistance(points[i], points[j]);
    const d2 = getDistance(points[j], points[k]);
    res +=
      d1 *
      d2 *
      Math.abs(Math.round(Math.sin(Cesium.Math.toRadians(totalAngle)) * 1000000) / 1000000);
  }
  return res; //单位平方米
}
