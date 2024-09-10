import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

const hander = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

hander.setInputAction((ev: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
  console.log(ev);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

hander.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

//ctrl+左点击
hander.setInputAction(
  (ev) => {
    console.log(ev);
  },
  Cesium.ScreenSpaceEventType.LEFT_CLICK,
  Cesium.KeyboardEventModifier.CTRL
);

const hander = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

hander.setInputAction((ev) => {
  const pick = viewer.scene.pick(ev.position);
  console.log(pick.id);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//监听底图加载完毕
const helper = new Cesium.EventHelper();
helper.add(viewer.scene.globe.tileLoadProgressEvent, (ev) => {
  if (ev === 0) {
    console.log(ev);
  }
});
