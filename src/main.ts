import { CesiumMap } from './map/CesiumMap';
import GUI from 'lil-gui';

const cesiumMap = new CesiumMap('cesiumContainer');
window.cesiumMap = cesiumMap;
window.addEventListener('unload', () => {
  cesiumMap.destroy();
});

//https://lil-gui.georgealways.com/#

const gui = new GUI();
const obj = {
  action: 'addHtml'
};
const actions = {
  addHtml: () => {
    cesiumMap.htmlOverlay.addHtml({
      id: 'label',
      lat: 39,
      lng: 110,
      content: '<div style="background:dodgerblue;color:white;padding:16px;">HTML</div>'
    });
  },
  removeHtml: () => {
    cesiumMap.htmlOverlay.removeHtml('label');
  }
};
gui
  .add(obj, 'action', ['addHtml', 'removeHtml', 'Large'])
  .onChange((value: keyof typeof actions) => {
    actions[value] && actions[value]();
  });
