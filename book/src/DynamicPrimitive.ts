import * as Cesium from 'cesium';

export type ColorArrType = [number, number, number, number];
export type LineOptionType = {
  id: string;
  positions: number[];
  color: Cesium.Color;
  width: number;
  isGround?: boolean;
  zIndex?: number;
};

class DynamicPrimitive {
  constructor(option: any) {}
  static viewer: Cesium.Viewer;
  static lines: { [n: string]: Cesium.Primitive | Cesium.GroundPolylinePrimitive } = {};

  static addPolyline(set: LineOptionType) {
    let line;
    if (set.isGround) {
      line = this.viewer.scene.primitives.add(
        new Cesium.GroundPolylinePrimitive({
          geometryInstances: new Cesium.GeometryInstance({
            id: set.id + 'geometryInstance',
            geometry: new Cesium.GroundPolylineGeometry({
              positions: Cesium.Cartesian3.fromDegreesArray(set.positions),
              width: set.width
            })
          }),
          appearance: new Cesium.PolylineMaterialAppearance({
            material: Cesium.Material.fromType('Color', {
              color: set.color
            })
          }),
          asynchronous: false
        })
      );
    } else {
      line = this.viewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: new Cesium.GeometryInstance({
            id: set.id + 'geometryInstance',
            geometry: new Cesium.PolylineGeometry({
              positions: Cesium.Cartesian3.fromDegreesArray(set.positions),
              width: set.width
            })
          }),
          appearance: new Cesium.PolylineMaterialAppearance({
            material: Cesium.Material.fromType('Color', {
              color: set.color
            })
          }),
          asynchronous: false
        })
      );
    }
    this.lines[set.id] = line;
  }
  static updatePolylinePos(id: string, pos: number[]) {
    const line = this.lines[id];
    if (line) {
      line.update(this.viewer.scene);
      //   line.geometryInstances.geometry = new Cesium.PolylineGeometry({
      //     positions: Cesium.Cartesian3.fromDegreesArray(pos)
      //   });
    }
  }
  static removePolyline(id: string) {
    const line = this.lines[id];
    if (line) {
      this.viewer.scene.primitives.remove(line);
    }
  }
}
