//https://cesium.com/learn/cesiumjs/ref-doc/Entity.html

import * as Cesium from 'cesium';

import type {
  OrientType,
  PosType,
  SizeCylinderType,
  SizePlaneType,
  SizeRectType,
  SizeType
} from './types.d';

export class EntityUtil {
  viewer: Cesium.Viewer;
  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }
  getEntity(id: string) {
    return this.viewer.entities.getById(id);
  }
  destroy() {
    this.viewer.entities.removeAll();
  }

  removeEntity(id: string) {
    this.viewer.entities.removeById(id);
  }
  addEntity(id: string, pos: PosType, set: any) {
    return this.viewer.entities.add({
      id,
      position: Cesium.Cartesian3.fromDegrees(pos.lng, pos.lat, pos.height),
      ...set
    });
  }
  addBox(id: string, pos: PosType, size: SizeType, style: any) {
    return this.addEntity(id, pos, {
      box: {
        dimensions: new Cesium.Cartesian3(size.width, size.height, size.depth),
        ...style
      }
    });
  }
  addCircle(id: string, pos: PosType, size: SizeType, style: any) {
    return this.addEntity(id, pos, {
      ellipse: {
        semiMinorAxis: size.height,
        semiMajorAxis: size.width,
        extrudedHeight: size.depth,
        ...style
      }
    });
  }
  addCylinder(id: string, pos: PosType, size: SizeCylinderType, style: any) {
    return this.addEntity(id, pos, {
      cylinder: {
        length: size.height,
        topRadius: size.top,
        bottomRadius: size.bottom,
        ...style
      }
    });
  }
  addCorridor(id: string, size: SizeType, path: number[], style: any) {
    return this.viewer.entities.add({
      id,
      corridor: {
        positions: Cesium.Cartesian3.fromDegreesArray(path),
        extrudedHeight: size.depth,
        width: size.width,
        height: size.height,
        ...style
      }
    });
  }
  addSphere(id: string, pos: PosType, size: SizeType, style: any) {
    return this.addEntity(id, pos, {
      ellipsoid: {
        radii: new Cesium.Cartesian3(size.width, size.height, size.depth),
        ...style
      }
    });
  }

  addPloygon(id: string, shape: Cesium.Property, style: any) {
    return this.viewer.entities.add({
      id,
      polygon: {
        hierarchy: shape,
        ...style
      }
    });
  }
  addRectangle(id: string, size: SizeRectType, style: any) {
    return this.viewer.entities.add({
      id,
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(size.left, size.top, size.right, size.bottom),
        extrudedHeight: size.depth,
        height: size.height,
        ...style
      }
    });
  }
  addPlane(id: string, pos: PosType, size: SizePlaneType, style: any) {
    return this.addEntity(id, pos, {
      plane: {
        dimensions: new Cesium.Cartesian2(size.width, size.height),
        ...style
      }
    });
  }
  addLine(id: string, path: number[], style: any) {
    return this.viewer.entities.add({
      id,
      polyline: {
        positions: style.clampToGround
          ? Cesium.Cartesian3.fromDegreesArray(path)
          : Cesium.Cartesian3.fromDegreesArrayHeights(path),
        ...style
      }
    });
  }
  addWall(id: string, path: number[], style: any) {
    return this.viewer.entities.add({
      id,
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(path),
        ...style
      }
    });
  }
  addLabel(id: string, pos: PosType, text: string, style: any) {
    return this.addEntity(id, pos, {
      label: {
        text: text,
        ...style
      }
    });
  }
  addPoint(id: string, pos: PosType, style: any) {
    return this.addEntity(id, pos, {
      label: {
        ...style
      }
    });
  }
  addBillboard(id: string, pos: PosType, style: any) {
    return this.addEntity(id, pos, {
      billboard: {
        ...style
      }
    });
  }
  addLineShape(id: string, path: number[], style: any) {
    return this.viewer.entities.add({
      id,
      polylineVolume: {
        positions: Cesium.Cartesian3.fromDegreesArray(path),
        ...style
      }
    });
  }
  addModel(id: string, pos: PosType, orient: OrientType, url: string, style: any) {
    const hpr = new Cesium.HeadingPitchRoll(orient.heading, orient.pitch, orient.roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
      Cesium.Cartesian3.fromDegrees(pos.lng, pos.lat, pos.height),
      hpr
    );
    return this.addEntity(id, pos, {
      orientation,
      model: {
        uri: url,
        ...style
      }
    });
  }
}
