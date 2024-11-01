import * as Cesium from 'cesium';

export type LngLatHeightType = [number, number, number];
//地球半径 单位m
const EARTH_RADIUS = 6378137;
export class PosUtil {
  static viewer: Cesium.Viewer;

  static Cartesian3ToCartographic(c: Cesium.Cartesian3) {
    return Cesium.Cartographic.fromCartesian(c);
  }

  static CartographicToWGS84(c: Cesium.Cartographic): LngLatHeightType {
    return [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude), c.height];
  }
  static Cartesian3ToWGS84(c: Cesium.Cartesian3): LngLatHeightType {
    const c1 = this.Cartesian3ToCartographic(c);
    return this.CartographicToWGS84(c1);
  }
  static WGS84ToCartesian3(c: LngLatHeightType) {
    return Cesium.Cartesian3.fromDegrees(c[0], c[1], c[2]);
  }
  static WGS84ToCartographic(c: LngLatHeightType) {
    return Cesium.Cartographic.fromDegrees(c[0], c[1], c[2]);
  }
  static Cartesian2ToCartesian3(c: Cesium.Cartesian2) {
    let cartesian = this.pickTilePos(c);
    if (Cesium.defined(cartesian)) {
      return cartesian;
    } else {
      cartesian = this.pickTerrainPos(c);
      if (Cesium.defined(cartesian)) {
        return cartesian;
      } else {
      }
    }
  }
  static Cartesian2ToWGS84(c: Cesium.Cartesian2) {
    let cartesian = this.Cartesian2ToCartesian3(c);
    if (Cesium.defined(cartesian)) {
      return this.Cartesian3ToWGS84(cartesian);
    }
  }
  static pickPosHeight(c: Cesium.Cartographic) {
    if (this.viewer.scene.sampleHeightSupported) {
      return this.viewer.scene.sampleHeight(c);
    }
  }
  static pickPosTerrainHeight(c: Cesium.Cartographic) {
    return new Promise((resolve) => {
      Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider, [
        new Cesium.Cartographic(c.longitude, c.latitude)
      ]).then((pos: Cesium.Cartographic[]) => {
        if (pos?.length) {
          resolve(pos[0].height);
        } else {
          resolve(0);
        }
      });
    });
  }
  static pickTilePosWGS84(c: Cesium.Cartesian2) {
    const pos = this.pickTilePos(c);
    if (Cesium.defined(pos)) {
      return this.Cartesian3ToWGS84(pos);
    }
  }
  static pickTerrainPosWGS84(c: Cesium.Cartesian2) {
    const pos = this.pickTerrainPos(c);
    if (Cesium.defined(pos)) {
      return this.Cartesian3ToWGS84(pos);
    }
  }
  static pickTilePos(c: Cesium.Cartesian2) {
    if (this.viewer.scene.pick(c)) {
      let cartesian = this.viewer.scene.pickPosition(c);
      if (Cesium.defined(cartesian)) {
        return cartesian;
      }
    }
    // let picks = this.viewer.scene.drillPick(c);

    // for (let i = 0; i < picks.length; i++) {
    //   const pick = picks[i];

    //   if (
    //     pick &&
    //     pick.primitive &&
    //     (pick instanceof Cesium.Cesium3DTileFeature ||
    //       pick instanceof Cesium.Cesium3DTileset ||
    //       pick instanceof Cesium.Model)
    //   ) {
    //     if (this.viewer.scene.pick(c)) {
    //       let cartesian = this.viewer.scene.pickPosition(c);
    //       if (Cesium.defined(cartesian)) {
    //         return cartesian;
    //       }
    //     }
    //   }
    // }
  }
  static pickTerrainPos(c: Cesium.Cartesian2) {
    let cartesian;
    if (this.viewer.terrainProvider instanceof Cesium.TerrainProvider) {
      const ray = this.viewer.camera.getPickRay(c);
      if (ray) {
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        if (Cesium.defined(cartesian)) {
          return cartesian;
        }
      }
    }
    cartesian = this.viewer.scene.camera.pickEllipsoid(c, this.viewer.scene.globe.ellipsoid);
    if (Cesium.defined(cartesian)) {
      return cartesian;
    }
  }
  static pickPos(c: Cesium.Cartesian2) {
    let pos = this.pickTilePos(c);
    if (Cesium.defined(pos)) {
      return pos;
    }
    pos = this.pickTerrainPos(c);
    if (Cesium.defined(pos)) {
      return pos;
    }
  }
  static pickPosWGS84(c: Cesium.Cartesian2) {
    const pos = this.pickPos(c);
    if (Cesium.defined(pos)) {
      return this.Cartesian3ToWGS84(pos);
    }
  }
  //获取空间距离
  static getSpaceDistance(c1: Cesium.Cartographic, c2: Cesium.Cartographic) {
    return Cesium.Cartesian3.distance(
      Cesium.Cartesian3.fromRadians(c1.longitude, c1.latitude, c1.height),
      Cesium.Cartesian3.fromRadians(c2.longitude, c2.latitude, c2.height)
    );
  }
  // 地球表面距离计算
  static getEarthDistance(c1: Cesium.Cartographic, c2: Cesium.Cartographic) {
    // 纬度
    let lat1 = c1.latitude;
    let lat2 = c2.latitude;
    // 经度
    let lng1 = c1.longitude;
    let lng2 = c2.longitude;
    // 纬度之差
    let a = lat1 - lat2;
    // 经度之差
    let b = lng1 - lng2;
    // 计算两点距离的公式
    let s =
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(a / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(b / 2), 2)
        )
      );
    // 弧长乘地球半径, 返回单位: 米
    s = s * EARTH_RADIUS;
    return s;
  }
}
