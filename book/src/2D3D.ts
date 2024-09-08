import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

viewer.scene.morphTo2D(1); //二维

viewer.scene.morphTo3D(1); //三维

viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(114, 30, 100.0),
  box: {
    dimensions: new Cesium.Cartesian3(50, 50, 50),
    material: Cesium.Color.BLUE
  }
});
//lookAt会被固定视角范围，一直围绕中心点
// viewer.camera.lookAt(
//   Cesium.Cartesian3.fromDegrees(114, 30, 100.0),
//   new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 200)
// );

function getCenter() {
  let center;
  const pos = new Cesium.Cartesian2(viewer.canvas.width * 0.5, viewer.canvas.height * 0.5);
  if (viewer.scene.pickPositionSupported) {
    center = Cesium.Cartographic.fromCartesian(viewer.scene.pickPosition(pos));
  } else {
    const ray = viewer.camera.getPickRay(pos);
    if (ray) center = viewer.scene.globe.pick(ray, viewer.scene);
  }

  if (Cesium.defined(center)) {
    const p = Cesium.Cartographic.fromCartesian(center);
    return [Cesium.Math.toDegrees(p.longitude), Cesium.Math.toDegrees(p.latitude), p.height];
  }
  return null;
}

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(114, 30, Math.tan(Cesium.Math.toRadians(30)) * 100)
});

/**
 * 根据距离方向和观察点计算目标点（109.878321 19.963493 82 0 500）
 * @param {Object} lon 经度
 * @param {Object} lat 维度
 * @param {Object} height 高度
 * @param {Object} direction 方向
 * @param {Object} radius 可视距离
 */
function calculatingTargetPoints(
  lon: number,
  lat: number,
  height: number,
  direction: number,
  radius: number
) {
  // 观察点
  var viewPoint = Cesium.Cartesian3.fromDegrees(lon, lat, height);
  // 世界坐标转换为投影坐标
  var webMercatorProjection = new Cesium.WebMercatorProjection(viewer.scene.globe.ellipsoid);
  var viewPointWebMercator = webMercatorProjection.project(
    Cesium.Cartographic.fromCartesian(viewPoint)
  );
  // 计算目标点
  var toPoint = new Cesium.Cartesian3(
    viewPointWebMercator.x + radius * Math.cos(direction),
    viewPointWebMercator.y + radius * Math.sin(direction),
    0
  );
  // 投影坐标转世界坐标
  toPoint = webMercatorProjection.unproject(toPoint);
  toPoint = Cesium.Cartographic.toCartesian(toPoint.clone());
  // 世界坐标转地理坐标
  var cartographic = Cesium.Cartographic.fromCartesian(toPoint);
  var point = [
    Cesium.Math.toDegrees(cartographic.longitude),
    Cesium.Math.toDegrees(cartographic.latitude)
  ];
  return point;
}


/**
* 
* @param {*} lng 经度 122
* @param {*} lat 纬度 24
* @param {*} brng 方位角 0~360度
* @param {*} dist 90000距离(米)
*
*/
function (lng, lat, brng, dist) {
    var a = 6378137;
    var b = 6356752.3142;
    var f = 1 / 298.257223563;

    var lon1 = lng * 1;
    var lat1 = lat * 1;
    var s = dist;
    var alpha1 = brng * (Math.PI / 180)
    var sinAlpha1 = Math.sin(alpha1);
    var cosAlpha1 = Math.cos(alpha1);
    var tanU1 = (1 - f) * Math.tan(lat1 * (Math.PI / 180));
    var cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
    var sigma1 = Math.atan2(tanU1, cosAlpha1);
    var sinAlpha = cosU1 * sinAlpha1;
    var cosSqAlpha = 1 - sinAlpha * sinAlpha;
    var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    var sigma = s / (b * A), sigmaP = 2 * Math.PI;
    while (Math.abs(sigma - sigmaP) > 1e-12) {
        var cos2SigmaM = Math.cos(2 * sigma1 + sigma);
        var sinSigma = Math.sin(sigma);
        var cosSigma = Math.cos(sigma);
        var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
        sigmaP = sigma;
        sigma = s / (b * A) + deltaSigma;
    }

    var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
    var lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
        (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp));
    var lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
    var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    var L = lambda - (1 - C) * f * sinAlpha *
        (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));

    var revAz = Math.atan2(sinAlpha, -tmp); // final bearing

    var lngLatObj = { lng: lon1 + L * (180 / Math.PI), lat: lat2 * (180 / Math.PI) }
    return lngLatObj;
}
