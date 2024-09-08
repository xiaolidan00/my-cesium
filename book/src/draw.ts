import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain()
});
//计算地形与图形之间的遮挡关系
viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(113, 39, 100.0),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0.0
  }
});

const tileset = await Cesium.Cesium3DTileset.fromUrl(
  'http://localhost:8002/tilesets/Seattle/tileset.json',
  { enableCollision: true }
);
viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset);
let height = 10;
//将3D Tiles模型的外包围球中心点从笛卡尔空间直角坐标转换为弧度表示
const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center); //3D Tiles外包围球中心点
//3D Tiles模型外包围球中心点原始坐标
const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude);
//3D Tiles模型外包围球中心点坐标偏移
const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
//计算两个笛卡尔分量的差异
const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

function update3DTilesMatrix(params) {
  //旋转
  let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
  let my = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.ry));
  let mz = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rz));
  let rotaionX = Cesium.Matrix4.fromRotationTranslation(mx);
  let rotaionY = Cesium.Matrix4.fromRotationTranslation(my);
  let rotaionZ = Cesium.Matrix4.fromRotationTranslation(mz);
  //平移
  let position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
  let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
  //将旋转矩阵和平移矩阵相乘
  Cesium.Matrix4.multiply(m, rotaionX, m);
  Cesium.Matrix4.multiply(m, rotaionY, m);
  Cesium.Matrix4.multiply(m, rotaionZ, m);
  //返回旋转平移结果矩阵
  return m;
}

tileset._root.transform = update3DTilesMatrix({
  tx: Cesium.Math.toDegrees(113),
  ty: Cesium.Math.toDegrees(39),
  tz: 100,
  rx: 0,
  ry: 0,
  rz: 0
});

function changeScale(scale) {
  const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
  const surface = Cesium.Cartesian3.fromRadians(
    cartographic.longitude,
    cartographic.latitude,
    cartographic.height
  );
  const m = Cesium.Transforms.eastNorthUpToFixedFrame(surface);
  const mStart = tileset._root.transform;
  const s = Cesium.Matrix4.fromUniformScale(scale);
  Cesium.Matrix4.multiply(mStart, s, m);
}
//设置瓦片透明度
tileset.style = new Cesium.Cesium3DTileStyle({
  color: 'rgba(255,255,255,0.5)'
});

//添加OSM建筑白膜数据
const osmBuildingTileset = await Cesium.createOsmBuildingsAsync();
viewer.scene.primitives.add(osmBuildingTileset);
const lon = 113,
  lat = 39;
osmBuildingTileset.style = new Cesium.Cesium3DTileStyle({
  color: {
    conditions: [
      ["${building} === 'university'", "color('skyblue',0.8)"],
      ["${building} === 'dormitory'", "color('cyan',0.9)"],
      ["${building} === 'yes'", "color('purple',0.7)"],
      ['true', "color('white')"]
    ]
  },
  defines: {
    distance:
      "distance(vec2(${feature['cesium#longitude']},${feature['cesium#latitude'}),vec2(" +
      [lon, lat].join(',') +
      '))'
  }
});
osmBuildingTileset.style = new Cesium.Cesium3DTileStyle({
  show: "${building} === 'university'"
});

const model = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(113, 39, 100),
  model: {
    uri: './assets/Cesium_Man.glb',
    minimumPixelSize: 2,
    maximumScale: 200,
    color: Cesium.Color.YELLOW,
    colorBlendAmount: 0.5,
    colorBlendMode: Cesium.ColorBlendMode.MIX,
    silhouetteColor: Cesium.Color.RED,
    silhouetteSize: 2
  }
});

viewer.entities.add(model);
viewer.zoomTo(model);
{
  let cartographic = new Cesium.Cartographic();
  const duration = 8.0;
  let longitude = 113;
  let latitude = 39;
  let range = 0.0001;
  const point = viewer.entities.add({
    position: new Cesium.CallbackProperty(updatePosition, false),
    point: {
      pixelSize: 10,
      color: Cesium.Color.YELLOW,
      disableDepthTestDistance: Number.POSITIVE_INFINITY //设置距地面多少米后禁用深度测试
    },
    label: {
      showBackground: true,
      font: '14px monospace',
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(5, 5)
    }
  });
  function updatePosition(time): Cesium.CallbackProperty.Callback {
    const offset = (time.secondsOfDay % duration) / duration;
    cartographic.longitude = Cesium.Math.toRadians(longitude - range + offset * range * 2.0);
    cartographic.latitude = Cesium.Math.toRadians(latitude);
    let height;
    if (viewer.scene.sampleHeightSupported) {
      height = viewer.scene.sampleHeight(cartographic);
    }
    if (Cesium.defined(height)) {
      cartographic.height = height;
      point.label?.text = Math.abs(height).toFixed(2) + 'm';
      point.label?.show = true;
    } else {
      cartographic.height = 0;
      point.show = false;
    }
    return Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      cartographic.height
    );
  }
}
