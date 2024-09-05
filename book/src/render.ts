import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

//场景更新前
const preUpdateFn = (ev) => {
  console.log(ev);
};

viewer.scene.preUpdate.addEventListener(preUpdateFn);
viewer.scene.preUpdate.removeEventListener(preUpdateFn);

//场景更新后
const postUpdateFn = (ev) => {
  console.log(ev);
};
viewer.scene.postUpdate.addEventListener(postUpdateFn);
viewer.scene.postUpdate.removeEventListener(postUpdateFn);

//场景渲染前
const preRenderFn = (ev) => {
  console.log(ev);
};
viewer.scene.preRender.addEventListener(preRenderFn);
viewer.scene.preRender.removeEventListener(preRenderFn);

//场景渲染后
const postRenderFn = (ev) => {
  console.log(ev);
};
viewer.scene.postRender.addEventListener(postRenderFn);
viewer.scene.postRender.removeEventListener(postRenderFn);
