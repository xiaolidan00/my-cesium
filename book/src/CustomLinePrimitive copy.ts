export type CustomLinePrimitiveOption = {
  id: string;
  positions: number[];
  color: Cesium.Color;
  width: number;
  isGround?: boolean;
};
// class CustomLinePrimitive {
//   private id: string;
//   private positions: number[];
//   private width: number;
//   private color: Cesium.Color;
//   private primitive: Cesium.Primitive;
//   private isGround?: boolean;
//   private isChange: boolean = false;
//   constructor(options: CustomLinePrimitiveOption) {
//     this.id = options.id || (Math.random() * 9999).toFixed(0);
//     this.positions = options.positions;
//     this.width = options.width || 3;
//     this.color = options.color;
//     this.isGround = options.isGround;
//   }
//   setPositions(pos: number[]) {
//     this.positions = pos;
//     this.isChange = true;
//   }
//   getPrimitive() {
//     if (this.primitive && !this.isChange) {
//       return this.primitive;
//     }
//     if (this.primitive) {
//       this.primitive.destroy();
//     }
//     if (this.isGround) {
//       this.primitive = new Cesium.GroundPolylinePrimitive({
//         geometryInstances: new Cesium.GeometryInstance({
//           id: this.id + 'geometryInstance',
//           geometry: new Cesium.GroundPolylineGeometry({
//             positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.positions),
//             width: this.width
//           })
//         }),
//         appearance: new Cesium.PolylineMaterialAppearance({
//           material: Cesium.Material.fromType('Color', {
//             color: this.color
//           })
//         }),
//         asynchronous: false
//       });
//     } else {
//       this.primitive = new Cesium.Primitive({
//         geometryInstances: new Cesium.GeometryInstance({
//           id: this.id + 'geometryInstance',
//           geometry: new Cesium.PolylineGeometry({
//             positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.positions),
//             width: this.width
//           })
//         }),
//         appearance: new Cesium.PolylineMaterialAppearance({
//           material: Cesium.Material.fromType('Color', {
//             color: this.color
//           })
//         }),
//         asynchronous: false
//       });
//     }
//     return this.primitive;
//   }
// }
function CustomLinePrimitive(options: CustomLinePrimitiveOption) {
  this.id = options.id || (Math.random() * 9999).toFixed(0);
  this.positions = options.positions;
  this.width = options.width || 3;
  this.color = options.color;
  this.isGround = options.isGround;
}

CustomLinePrimitive.prototype.getGeometry = function () {
  if (this.isGround) {
    return new Cesium.GroundPolylineGeometry({
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.positions),
      width: this.width
    });
  } else {
    return new Cesium.PolylineGeometry({
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.positions),
      width: this.width
    });
  }
};

CustomLinePrimitive.prototype.getPrimitive = function () {
  var geometry = this.getGeometry();

  if (this.isGround) {
    return new Cesium.GroundPolylinePrimitive({
      geometryInstances: new Cesium.GeometryInstance({
        id: this.id + 'geometryInstance',
        geometry: geometry
      }),
      appearance: new Cesium.PolylineMaterialAppearance({
        material: Cesium.Material.fromType('Color', {
          color: this.color
        })
      }),
      asynchronous: false
    });
  } else {
    return new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        id: this.id + 'geometryInstance',
        geometry: geometry
      }),
      appearance: new Cesium.PolylineMaterialAppearance({
        material: Cesium.Material.fromType('Color', {
          color: this.color
        })
      }),
      asynchronous: false
    });
  }
};

CustomLinePrimitive.prototype.update = function (frameState: any) {
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
};

CustomLinePrimitive.prototype.isDestroyed = function () {
  return false;
};

CustomLinePrimitive.prototype.destroy = function () {
  this._primitive = this._primitive && this._primitive.destroy();
  return Cesium.destroyObject(this);
};
// class CustomLinePrimitive extends Cesium.Primitive {
//   constructor(options, viewer) {
//     let primitive;
//     if (options.isGround) {
//       primitive = new Cesium.GroundPolylinePrimitive({
//         geometryInstances: new Cesium.GeometryInstance({
//           id: options.id + 'geometryInstance',
//           geometry: new Cesium.GroundPolylineGeometry({
//             positions: Cesium.Cartesian3.fromDegreesArrayHeights(options.positions),
//             width: options.width
//           })
//         }),
//         appearance: new Cesium.PolylineMaterialAppearance({
//           material: Cesium.Material.fromType('Color', {
//             color: options.color
//           })
//         }),
//         asynchronous: false
//       });
//     } else {
//       primitive = new Cesium.Primitive({
//         geometryInstances: new Cesium.GeometryInstance({
//           id: options.id + 'geometryInstance',
//           geometry: new Cesium.PolylineGeometry({
//             positions: Cesium.Cartesian3.fromDegreesArrayHeights(options.positions),
//             width: options.width
//           })
//         }),
//         appearance: new Cesium.PolylineMaterialAppearance({
//           material: Cesium.Material.fromType('Color', {
//             color: options.color
//           })
//         }),
//         asynchronous: false
//       });
//     }

//     super({
//       ...primitive
//     });
//     this.viewer = viewer;

//     this.that = options;
//   }
//   updatePos(pos: number[]) {
//     let g;
//     let options = this.that;
//     if (options.isGround) {
//       g = new Cesium.GeometryInstance({
//         id: options.id + 'geometryInstance',
//         geometry: new Cesium.GroundPolylineGeometry({
//           positions: Cesium.Cartesian3.fromDegreesArrayHeights(pos),
//           width: options.width
//         })
//       });
//     } else {
//       g = new Cesium.GeometryInstance({
//         id: options.id + 'geometryInstance',
//         geometry: new Cesium.PolylineGeometry({
//           positions: Cesium.Cartesian3.fromDegreesArrayHeights(pos),
//           width: options.width
//         })
//       });
//     }

//     this.geometryInstances = g;
//     this._state = 0;
//     // this._batchTable = undefined;
//     // this._ready = false;

//     this.update(this.viewer.scene.frameState);
//   }
// }
export default CustomLinePrimitive;
