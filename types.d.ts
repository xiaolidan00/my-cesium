import { CesiumMap } from './src/map/CesiumMap';
declare global {
  interface Window {
    cesiumMap: CesiumMap;
  }
}
