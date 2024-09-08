import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain()
});

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(113, 39, 100.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});

let polyline = new Cesium.GeometryInstance({
  geometry: new Cesium.GroundPolylineGeometry({
    positions: Cesium.Cartesian3.fromDegreesArray([113, 39, 113.002, 39, 113.002, 39.002]),
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
  new Cesium.GroundPolylinePrimitive({
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
  new Cesium.GroundPrimitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray([113, 39, 113.002, 39, 113.002, 39.002])
        )
      })
    }),
    appearance: polyonAppearance
  })
);

viewer.scene.primitives.add(
  new Cesium.GroundPrimitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.EllipseGeometry({
        center: Cesium.Cartesian3.fromDegrees(113, 39),
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
  new Cesium.GroundPrimitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.EllipseGeometry({
        center: Cesium.Cartesian3.fromDegrees(113, 39),
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
  new Cesium.GroundPrimitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.CircleGeometry({
        center: Cesium.Cartesian3.fromDegrees(113, 39),
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
  new Cesium.GroundPrimitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.CorridorGeometry({
        positions: Cesium.Cartesian3.fromDegreesArray([113, 39, 113.002, 39, 113.002, 39.002]),
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

viewer.scene.primitives.add(
  new Cesium.GroundPrimitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(113, 39, 113.002, 39.002)
      })
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: Cesium.Material.fromType('Color', {
        color: Cesium.Color.DODGERBLUE.withAlpha(0.5)
      })
    })
  })
);

//合并多个几何图形

const instances: Cesium.GeometryInstance[] = [];
for (let lon = -180; lon < 180; lon += 5.0) {
  for (let lat = -90; lat < 90; lat += 5.0) {
    instances.push(
      new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
          rectangle: Cesium.Rectangle.fromDegrees(lon, lat, lon + 5, lat + 5),
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
        }),
        id: lon + '-' + lat,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.fromRandom({ alpha: 0.6 })
          )
        }
      })
    );
  }
}

const mergeInstances = new Cesium.Primitive({
  geometryInstances: instances,
  appearance: new Cesium.PerInstanceColorAppearance()
});

viewer.scene.primitives.add(mergeInstances);

const attributes = mergeInstances.getGeometryInstanceAttributes('105-40');
attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED.withAlpha(0.5));

viewer.scene.primitives.remove(mergeInstances);
viewer.scene.primitives.removeAll();
