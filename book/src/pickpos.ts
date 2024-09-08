import * as Cesium from 'cesium';

/**https://github.com/zhangti0708/cesium-measure/blob/master/src/cesium-measure.js
 * 拾取位置点
 *
 * @param {Object} px 屏幕坐标
 *
 * @return {Object} Cartesian3 三维坐标
 */
function getCatesian3FromPX(px) {
  if (this._viewer && px) {
    var picks = this._viewer.scene.drillPick(px);
    var cartesian = null;
    var isOn3dtiles = false,
      isOnTerrain = false;
    // drillPick
    for (let i in picks) {
      let pick = picks[i];

      if (
        (pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) ||
        (pick && pick.primitive instanceof Cesium.Cesium3DTileset) ||
        (pick && pick.primitive instanceof Cesium.Model)
      ) {
        //模型上拾取
        isOn3dtiles = true;
      }
      // 3dtilset
      if (isOn3dtiles) {
        this._viewer.scene.pick(px); // pick
        cartesian = this._viewer.scene.pickPosition(px);
        if (cartesian) {
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          if (cartographic.height < 0) cartographic.height = 0;
          let lon = Cesium.Math.toDegrees(cartographic.longitude),
            lat = Cesium.Math.toDegrees(cartographic.latitude),
            height = cartographic.height;
          cartesian = this.transformWGS84ToCartesian({ lng: lon, lat: lat, alt: height });
        }
      }
    }
    // 地形
    let boolTerrain = this._viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider;
    // Terrain
    if (!isOn3dtiles && !boolTerrain) {
      var ray = this._viewer.scene.camera.getPickRay(px);
      if (!ray) return null;
      cartesian = this._viewer.scene.globe.pick(ray, this._viewer.scene);
      isOnTerrain = true;
    }
    // 地球
    if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
      cartesian = this._viewer.scene.camera.pickEllipsoid(px, this._viewer.scene.globe.ellipsoid);
    }
    if (cartesian) {
      let position = this.transformCartesianToWGS84(cartesian);
      if (position.alt < 0) {
        cartesian = this.transformWGS84ToCartesian(position, 0.1);
      }
      return cartesian;
    }
    return false;
  }
}
