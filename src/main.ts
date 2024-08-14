import * as Cesium from 'cesium';

import { CesiumMap } from './map/CesiumMap';
import GUI from 'lil-gui';

const cesiumMap = new CesiumMap('cesiumContainer');
window.cesiumMap = cesiumMap;
window.addEventListener('unload', () => {
  cesiumMap.destroy();
});

cesiumMap.setView(
  { lng: 113.389097, lat: 23.050047, height: 5000 },
  { heading: 0, pitch: -45, roll: 0 }
);
//https://lil-gui.georgealways.com/#

const gui = new GUI();
const obj = {
  action: 'none'
};
const actions = {
  addHtml: () => {
    cesiumMap.htmlOverlay.addHtml({
      id: 'label',
      lng: 113.389097,
      lat: 23.050047,
      content: '<div style="background:dodgerblue;color:white;padding:16px;">HTML</div>'
    });
  },
  removeHtml: () => {
    cesiumMap.htmlOverlay.removeHtml('label');
  },
  addEntity: () => {
    cesiumMap.entityUtil.addBox(
      'box',
      { lng: 113.389097, lat: 23.050047, height: 1000 },
      { width: 500, height: 500, depth: 500 },
      {
        material: Cesium.Color.BLUE
      }
    );
    const lines: number[] = [
      [113.389097, 23.050047],
      [113.35, 23.050047],
      [113.389097, 23.0]
    ].flat(Infinity) as number[];
    cesiumMap.entityUtil.addLine('line', lines, {
      material: Cesium.Color.RED,
      clampToGround: true,
      width: 3
    });
  },
  removeEntity() {
    cesiumMap.entityUtil.removeEntity('box');
    cesiumMap.entityUtil.removeEntity('line');
  }
};
gui
  .add(obj, 'action', ['none'].concat(Object.keys(actions)))
  .onChange((value: keyof typeof actions) => {
    actions[value] && actions[value]();
  });
