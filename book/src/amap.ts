import * as Cesium from 'cesium';

//路网
// const url = `https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&size=1&scl=1&style=8&ltype=11`;
const url = `https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}`;
const imageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: `${url}`,
  subdomains: ['1', '2', '3', '4']
});
const viewer = new Cesium.Viewer('cesiumContainer', {
  baseLayerPicker: false,
  baseLayer: new Cesium.ImageryLayer(imageryProvider)
});
