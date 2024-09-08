import * as Cesium from 'cesium';

type LngLatHeightType = [number, number, number];
class PosUtil {
  static viewer: Cesium.Viewer;

  static Cartesian3ToCartographic(c: Cesium.Cartesian3) {
    return Cesium.Cartographic.fromCartesian(c);
  }

  static CartographicToWGS84(c: Cesium.Cartographic) {
    return [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude), c.height];
  }
  static Cartesian3ToWGS84(c: Cesium.Cartesian3) {
    const c1 = this.Cartesian3ToCartographic(c);
    return this.CartographicToWGS84(c1);
  }
  static WGS84ToCartesian3(c: LngLatHeightType) {
    return Cesium.Cartesian3.fromDegrees(c[0], c[1], c[2]);
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
  static pickTilePos(c: Cesium.Cartesian2) {
    let picks = this.viewer.scene.drillPick(c);

    for (let i = 0; i < picks.length; i++) {
      const pick = picks[i];

      if (
        pick &&
        pick.primitive &&
        (pick instanceof Cesium.Cesium3DTileFeature ||
          pick instanceof Cesium.Cesium3DTileset ||
          pick instanceof Cesium.Model)
      ) {
        if (this.viewer.scene.pick(c)) {
          let cartesian = this.viewer.scene.pickPosition(c);
          if (Cesium.defined(cartesian)) {
            return cartesian;
          }
        }
      }
    }
  }
  static pickTerrainPos(c: Cesium.Cartesian2) {
    if (this.viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
      const ray = this.viewer.camera.getPickRay(c);
      if (ray) {
        let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        if (Cesium.defined(cartesian)) {
          return cartesian;
        } else {
          cartesian = this.viewer.scene.camera.pickEllipsoid(c, this.viewer.scene.globe.ellipsoid);
          if (Cesium.defined(cartesian)) {
            return cartesian; 
          }
        }
      }
    }
  }
}
