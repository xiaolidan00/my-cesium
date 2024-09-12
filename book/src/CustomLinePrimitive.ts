import * as Cesium from 'cesium';

export type CustomLinePrimitiveOption = {
  id: string;
  positions: number[];
  color: Cesium.Color;
  width: number;
  isGround?: boolean;
};

class CustomLinePrimitive {
  _primitive: any;
  id: string;
  _positions: number[] = [];
  positions: number[];
  color: Cesium.Color;
  _color: Cesium.Color;
  width: number;
  isGround?: boolean;

  constructor(options: CustomLinePrimitiveOption) {
    this.id = options.id || (Math.random() * 9999).toFixed(0);
    this.positions = options.positions;
    this.width = options.width || 3;
    this.color = options.color;
    this.isGround = options.isGround;
  }
  getGeometry() {
    const options = this;
    if (options.isGround) {
      return new Cesium.GroundPolylineGeometry({
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.positions),
        width: options.width
      });
    } else {
      return new Cesium.PolylineGeometry({
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.positions),
        width: options.width
      });
    }
  }
  getPrimitive() {
    const geometry = this.getGeometry();
    const options = this;
    if (options.isGround) {
      return new Cesium.GroundPolylinePrimitive({
        geometryInstances: new Cesium.GeometryInstance({
          id: options.id + 'geometryInstance',
          geometry: geometry
        }),
        appearance: new Cesium.PolylineMaterialAppearance({
          material: Cesium.Material.fromType('Color', {
            color: options.color
          })
        }),
        asynchronous: false
      });
    } else {
      return new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          id: options.id + 'geometryInstance',
          geometry: geometry
        }),
        appearance: new Cesium.PolylineMaterialAppearance({
          material: Cesium.Material.fromType('Color', {
            color: options.color
          })
        }),
        asynchronous: false
      });
    }
  }
  update(frameState: any) {
    if (!(this.positions !== this._positions || this.color !== this._color)) {
      if (this._primitive) {
        this._primitive.update(frameState);
      }
      return;
    }

    this._positions = this.positions;
    this._color = this.color;

    this._primitive = this._primitive && this._primitive.destroy();

    this._primitive = this.getPrimitive();

    if (!this._primitive) return;

    this._primitive.update(frameState);
  }

  isDestroyed() {
    return false;
  }
  destroy() {
    this._primitive = this._primitive && this._primitive.destroy();
    return Cesium.destroyObject(this);
  }
}
export default CustomLinePrimitive;
