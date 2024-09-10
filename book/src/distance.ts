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
