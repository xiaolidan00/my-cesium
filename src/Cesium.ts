import Cesium from "cesium";

interface Deg {
  lng: number;
  lat: number;
  height: number;
}
type Orient = {
  heading: number;
  pitch: number;
  roll: number;
};
type OrientRange = {
  heading: number;
  pitch: number;
  range: number;
};
class CesiumBase {
  viewer: Cesium.Viewer | null = null;
  scene: Cesium.Scene | null = null;
  entities: Cesium.EntityCollection | null = null;
  camera: Cesium.Camera | null = null;
  init(containerId: string, viewerConfig: Cesium.Viewer.ConstructorOptions) {
    const viewer = new Cesium.Viewer(containerId, viewerConfig);
    this.viewer = viewer;
    this.scene = viewer.scene;
    this.entities = viewer.entities;
    this.camera = viewer.camera;
  }
  setView(deg: Deg, o: Orient) {
    if (this.camera)
      this.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          deg.lng,
          deg.lat,
          deg.height
        ),
        orientation: {
          heading: Cesium.Math.toRadians(o.heading),
          pitch: Cesium.Math.toRadians(o.pitch),
          roll: Cesium.Math.toRadians(o.roll),
        },
      });
  }
  flyTo(deg: Deg, o: Orient, duration: number) {
    if (this.camera)
      this.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          deg.lng,
          deg.lat,
          deg.height
        ),
        orientation: o
          ? {
              heading: Cesium.Math.toRadians(o.heading),
              pitch: Cesium.Math.toRadians(o.pitch),
              roll: Cesium.Math.toRadians(o.roll),
            }
          : undefined,
        duration,
      });
  }
  lookAt(deg: Deg, o: OrientRange) {
    if (this.camera)
      this.camera.lookAt(
        Cesium.Cartesian3.fromDegrees(deg.lng, deg.lat, deg.height),
        new Cesium.HeadingPitchRange(o.heading, o.pitch, o.range)
      );
  }
  fitView() {}
  getView() {}
}
