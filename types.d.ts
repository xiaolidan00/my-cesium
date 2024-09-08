import { CesiumMap } from './src/map/CesiumMap';
import * as Cesium from 'cesium';
declare global {
  interface Window {
    cesiumMap: CesiumMap;
    Cesium: Cesium;
  }
  type Cesium = Cesium;
}
