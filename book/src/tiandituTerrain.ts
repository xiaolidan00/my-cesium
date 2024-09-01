import * as Cesium from 'cesium';

const tiandituToken = '17f0870a78b24d59caa33871cef10306';
const url = `http://t{s}.tianditu.gov.cn/img_w/wmts?tk=${tiandituToken}`;
const terrainUrl = 'https://t{s}.tianditu.gov.cn/mapservice/swdx?tk=' + tiandituToken;
const imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
  url: `${url}`,
  subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'], //服务器负载子域
  layer: 'img',
  style: 'default',
  format: 'tiles',
  minimumLevel: 0, //最小层级
  maximumLevel: 18, //最大层级
  tileMatrixSetID: 'w'
});
const viewer = new Cesium.Viewer('cesiumContainer', {
  baseLayerPicker: false,
  baseLayer: new Cesium.ImageryLayer(imageryProvider),
  terrain: new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromUrl(terrainUrl))
});
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(116.397455, 39.909187, 1000.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});
