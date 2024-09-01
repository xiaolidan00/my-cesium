《WebGIS之Cesium三维软件开发》郭明强著

# Cesium API概要

<https://cesium.com/learn/cesiumjs/ref-doc/index.html>

## Viewer

### camera

- direction相机视图方向
- heading方位角/绕Z轴旋转
- pitch俯仰角/绕Y轴旋转
- roll翻滚角/绕X轴旋转
- position位置

### scene:环境对象

管理三维场景，月亮，太阳，天空盒，大气圈

- 渲染事件（preUpdate,postUpdate,preRender,postRender）
- globe地球表层，包括地形和图像图层
- primitives基本图元
  - Primitive
  - GroundPrimitive
  - GroundPolylinePrimitive
  - ClassificationPrimitive
  - BillboardCollection
  - LabelCollection
  - PointPrimitiveCollection
  - PolylineCollection
  - Model
  - Cesium3DTileset
  - ParticleSystem
- groundPrimitives贴地几何对象(PrimitiveCollection)

### dataSources

- CustumDataSource
- CzmlDataSource
- GeoJsonDataSource
- KmlDataSource

### Widgets

### Entity

可以随着时间动态变化的实体

- 几何图形
  - BillboardGraphics广告牌
  - BoxGraphics盒子
  - CorridorGraphics走廊
  - CylinderGraphics圆柱体
  - EllipseGraphics椭圆
  - LabelGraphics标签
  - ModelGraphics模型
  - PathGraphics路径
  - PlaneGraphics平面
  - PointGraphics点
  - PolygonGraphics多边形
  - PolylineGraphics多线段
  - RectangleGraphics矩形
  - WallGraphics墙
- 基本属性
  - id
  - name
  - show
  - description
  - orientation方向
  - position位置

# 影像加载

ImageryLayerCollection类，ImageryLayer类，ImageryProvider类

## Bing地图(默认)

```js
Cesium.Ion.defaultAccessToken = 'Token';
const viewer = new Cesium.Viewer('cesiumContainer')
```

## 天地图

[tianditu](./src/tianditu.ts)

## 高德地图

[amap](./src/amap.ts)

## 地形
