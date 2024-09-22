const viewer = new Cesium.Viewer('cesiumContainer');
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(113, 39, 2000.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});

const polyonAppearance = new Cesium.MaterialAppearance({
  material: Cesium.Material.fromType('Color', {
    color: Cesium.Color.BLUE
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
viewer.entities.add({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([113, 39, 113.002, 39, 113.002, 39.002]),
    material: Cesium.Color.RED,
    classificationType: Cesium.ClassificationType.BOTH
  }
});
