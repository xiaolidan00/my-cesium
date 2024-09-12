import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(114, 30, 100.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});

let polyline = new Cesium.GeometryInstance({
  geometry: new Cesium.PolylineGeometry({
    positions: Cesium.Cartesian3.fromDegreesArray([114, 30, 114.002, 30, 114.002, 30.002]),
    width: 5
  })
});
//https://cesium.com/learn/cesiumjs/ref-doc/Material.html?classFilter=Material
let polylineAppearance = new Cesium.PolylineMaterialAppearance({
  material: Cesium.Material.fromType('Color', {
    color: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
  })
});

viewer.scene.primitives.add(
  new Cesium.Primitive({
    geometryInstances: polyline,
    appearance: polylineAppearance
  })
);

const polyonAppearance = new Cesium.MaterialAppearance({
  material: Cesium.Material.fromType('Dot', {
    lightColor: Cesium.Color.GREEN,
    darkColor: Cesium.Color.YELLOW
  })
});

viewer.scene.primitives.add(
  new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray([114, 30, 114.002, 30, 114.002, 30.002])
        )
      })
    }),
    appearance: polyonAppearance
  })
);

viewer.scene.primitives.add(
  new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.EllipseGeometry({
        center: Cesium.Cartesian3.fromDegrees(114, 30),
        semiMajorAxis: 40,
        semiMinorAxis: 20
      })
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: Cesium.Material.fromType('Stripe', {
        horizontal: false,
        evenColor: Cesium.Color.GREEN,
        oddColor: Cesium.Color.YELLOW
      })
    })
  })
);

viewer.scene.primitives.add(
  new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.CircleGeometry({
        center: Cesium.Cartesian3.fromDegrees(114, 30),
        radius: 100
      })
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: Cesium.Material.fromType('Grid', {
        color: Cesium.Color.BLUE
      })
    })
  })
);

viewer.scene.primitives.add(
  new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.CorridorGeometry({
        positions: Cesium.Cartesian3.fromDegreesArray([114, 30, 114.002, 30, 114.002, 30.002]),
        width: 10
      }),
      attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute(0.2, 0.5, 0.2, 0.7)
      }
    }),
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: true, //平面阴影
      translucent: true //是否半透明
    })
  })
);
//水面
viewer.scene.primitives.add(
  new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(114, 30, 114.002, 30.002)
      })
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: Cesium.Material.fromType('Water', {
        baseWaterColor: Cesium.Color.DODGERBLUE.withAlpha(0.5),
        blendColor: Cesium.Color.LIGHTBLUE,
        normalMap: Cesium.buildModuleUrl('Assets/Textures/waterNormals.jpg'),
        amplitude: 10,
        frequency: 100.0,
        animationSpeed: 0.01
      })
    })
  })
);

viewer.scene.primitives.add(
  new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.WallGeometry({
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          114, 30, 50, 114.002, 30, 100, 114.002, 30.002, 80
        ])
      })
    }),
    appearance: new Cesium.MaterialAppearance({
      faceForward: false, //双面
      material: Cesium.Material.fromType('Color', {
        color: Cesium.Color.DODGERBLUE.withAlpha(0.5)
      })
    })
  })
);

const boxCenter = Cesium.Cartesian3.fromDegrees(114, 30);
//变化矩阵
const transformMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(boxCenter);
//仿射变换矩阵
const affineMatrix = Cesium.Matrix4.multiplyByTranslation(
  transformMatrix,
  new Cesium.Cartesian3(0, 0, 100),
  new Cesium.Matrix4()
);
//模型矩阵
const boxModelMatrix = Cesium.Matrix4.multiplyByUniformScale(
  affineMatrix,
  1.0, //缩放比例
  new Cesium.Matrix4()
);
viewer.scene.primitives.add(
  new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      modelMatrix: boxModelMatrix,
      geometry: Cesium.BoxGeometry.fromDimensions({
        dimensions: new Cesium.Cartesian3(100, 50, 30)
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.PINK)
      }
    }),
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: true, //平面阴影
      translucent: true //是否半透明
    })
  })
);

const ellipsoidCenter = Cesium.Cartesian3.fromDegrees(114, 30);
const ellipsoidMatrix = Cesium.Matrix4.multiplyByUniformScale(
  Cesium.Matrix4.multiplyByTranslation(
    Cesium.Transforms.eastNorthUpToFixedFrame(ellipsoidCenter),
    new Cesium.Cartesian3(0, 0, 100),
    new Cesium.Matrix4()
  ),
  2,
  new Cesium.Matrix4()
);
viewer.scene.primitives.add(
  new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      modelMatrix: ellipsoidMatrix,
      geometry: new Cesium.EllipsoidGeometry({
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        radii: new Cesium.Cartesian3(50, 30, 100)
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.PINK)
      }
    }),
    appearance: new Cesium.PerInstanceColorAppearance({
      translucent: false //是否半透明
    })
  })
);

const cylinderModelMatrix = Cesium.Matrix4.multiplyByTranslation(
  Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(114, 30)),
  new Cesium.Cartesian3(0, 0, 100),
  new Cesium.Matrix4()
);
viewer.scene.primitives.add(
  new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      modelMatrix: cylinderModelMatrix,
      geometry: new Cesium.CylinderGeometry({
        length: 40,
        topRadius: 20,
        bottomRadius: 30,
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.PINK)
      }
    }),
    appearance: new Cesium.PerInstanceColorAppearance({
      translucent: false //是否半透明
    })
  })
);

//调整顺序
viewer.scene.primitives.raiseToTop(polyline);
