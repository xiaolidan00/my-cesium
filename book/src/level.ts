import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');
const mapWidth = viewer.canvas.width - 700; //地图宽度-左右两侧内容栏
const mapHeight = (viewer.canvas.height = 100); //地图高度-顶部标题栏
const getLevelResolution = (level: number) => {
  const resolution = 360 / (Math.pow(2, level + 1) * 256);
  return resolution;
};

const getBoundsLevel = (bounds: number[]) => {
  const width = Math.abs(bounds[0] - bounds[2]);
  const height = Math.abs(bounds[1] - bounds[3]);
  for (let i = 19; i >= 3; i = i - 0.5) {
    const d = getLevelResolution(i);
    if (mapWidth * d >= width && mapHeight * d >= height) {
      return i;
    }
  }
  return 3;
};

const heightToLevel = (h: number) => {
  return Math.log2(128538232 / h);
};
const levelToHeight = (level: number) => {
  return 128538232 / Math.pow(2, level);
};
