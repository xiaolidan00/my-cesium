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

viewer.extend(Cesium.viewerCesiumInspectorMixin);
viewer.extend(Cesium.viewerPerformanceWatchdogMixin, {
  lowFrameRateMessage: 'Why is this going so <em>slowly</em>?'
});
viewer.extend(Cesium.viewerDragDropMixin);
viewer.extend(Cesium.viewerVoxelInspectorMixin);
viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
