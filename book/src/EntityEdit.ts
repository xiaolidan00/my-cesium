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

const line = viewer.entities.add({
  polyline: {
    material: Cesium.Color.RED,
    width: 5,
    positions: Cesium.Cartesian3.fromDegreesArray([114, 30, 114.002, 30]),
    clampToGround: true
  }
});

setTimeout(() => {
  line.polyline?.material = new Cesium.PolylineDashMaterialProperty({
    color: Cesium.Color.BLUE,
    dashLength: 10
  });
}, 3000);

setTimeout(() => {
  line.polyline?.material = new Cesium.PolylineArrowMaterialProperty(Cesium.Color.GREEN);
}, 6000);

setTimeout(() => {
  line.polyline?.material = new Cesium.PolylineGlowMaterialProperty({ color: Cesium.Color.YELLOW });
}, 9000);
setTimeout(() => {
  line.polyline?.material = new Cesium.PolylineOutlineMaterialProperty({
    color: Cesium.Color.GREEN,
    outlineColor: Cesium.Color.YELLOW,
    outlineWidth: 2
  });
}, 12000);

const polygon = viewer.entities.add({
  id: 'polygon',
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([114, 30, 114.002, 30, 114.002, 30.002]),
    material: Cesium.Color.RED,
    classificationType: Cesium.ClassificationType.BOTH
  }
});

polygon.polygon?.material = Cesium.Color.RED.withAlpha(0.5);

polygon.polygon?.material = new Cesium.StripeMaterialProperty({
  orientation: Cesium.StripeOrientation.VERTICAL,
  evenColor: Cesium.Color.PURPLE,
  oddColor: Cesium.Color.YELLOW,
  repeat: 10
});
polygon.polygon?.outline = true;
polygon.polygon?.outlineColor = Cesium.Color.GREEN;
polygon.polygon?.outlineWidth = 10;
polygon.polygon?.extrudedHeight = 100;

polygon.polygon?.material = './assets/test.png';

viewer.entities.remove(polygon);
viewer.entities.removeById('polygon');
viewer.entities.removeAll();
const collect = new Cesium.EntityCollection();
collect.add(polygon);
viewer.entities.add(collect);
