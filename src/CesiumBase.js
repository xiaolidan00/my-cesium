export default class CesiumBase {
  constructor() {
    this.isClick = false;
    this.isSelect = true;
    this.selectedColor = Cesium.Color.LIME;
  }
  init(options) {
    const viewer = new Cesium.Viewer("cesiumContainer", options);
    this.viewer = viewer;
    if (this.isClick) {
      this.onClick();
    }
    if (this.isSelect) {
      this.onSelect();
    }
  }
  createMap() {}
  addBox(id, pos, size, style) {
    this.addEntity(id, pos, {
      box: {
        dimensions: new Cesium.Cartesian3(size.width, size.height, size.depth),
        ...style,
      },
    });
  }

  addCircle(id, pos, size, style) {
    this.addEntity(id, pos, {
      ellipse: {
        semiMinorAxis: size.height,
        semiMajorAxis: size.width,
        extrudedHeight: size.depth,
        ...style,
      },
    });
  }
  addCylinder(id, pos, size, style) {
    this.addEntity(id, pos, {
      cylinder: {
        length: size.height,
        topRadius: size.top,
        bottomRadius: size.bottom,
        ...style,
      },
    });
  }
  addCorridor(id, size, path, style) {
    this.viewer.entities.add({
      id,
      corridor: {
        positions: Cesium.Cartesian3.fromDegreesArray(path),
        extrudedHeight: size.depth,
        width: size.width,
        height: size.height,
        ...style,
      },
    });
  }
  addSphere(id, pos, size, style) {
    this.addEntity(id, pos, {
      ellipsoid: {
        radii: new Cesium.Cartesian3(size.width, size.height, size.depth),
        ...style,
      },
    });
  }

  addPloygon(id, shape, style) {
    this.viewer.entities.add({
      id,
      polygon: {
        hierarchy: shape,
        ...style,
      },
    });
  }
  addRectangle(id, size, style) {
    this.viewer.entities.add({
      id,
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(
          size.left,
          size.top,
          size.right,
          size.bottom
        ),
        extrudedHeight: size.depth,
        height: size.height,
        ...style,
      },
    });
  }
  addPlane(id, pos, size, style) {
    this.addEntity(id, pos, {
      plane: {
        dimensions: new Cesium.Cartesian2(size.width, size.height),
        ...style,
      },
    });
  }
  addLine(id, path, style) {
    this.viewer.entities.add({
      id,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(path),
        ...style,
      },
    });
  }
  addWall(id, path, style) {
    this.viewer.entities.add({
      id,
      wall: {
        positions: path,
        ...style,
      },
    });
  }
  addLabel(id, pos, text, style) {
    this.addEntity(id, pos, {
      label: {
        text: text,
        ...style,
      },
    });
  }
  addHTML() {}
  addPoint() {}
  addLineShape(id, path, style) {
    this.viewer.entities.add({
      id,
      polylineVolume: {
        positions: Cesium.Cartesian3.fromDegreesArray(path),
        ...style,
      },
    });
  }
  onClick() {
    const viewer = this.viewer;
    viewer.screenSpaceEventHandler.setInputAction((mouse) => {
      viewer.scene.pick(mouse.position);
      const ray = viewer.camera.getPickRay(mouse.position);
      const globe = viewer.scene.globe;
      const cartesian = globe.pick(ray, viewer.scene);

      if (!Cesium.defined(cartesian)) {
        return;
      }
      console.log(cartesian);
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      this.onClickAction(cartographic, cartesian);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  printColor(c) {
    const str = c.toCssColorString();
    console.log(`%c${str}`, `background:${str}`);
  }
  onSelect() {
    const selected = {
      originalColor: undefined,
      feature: undefined,
    };
    this.selected = selected;

    const viewer = this.viewer;

    if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
      const outlineEffect =
        Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      outlineEffect.uniforms.color = this.selectedColor;
      outlineEffect.uniforms.length = 0.01;
      outlineEffect.selected = [];
      outlineEffect.enabled = true;
      viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createSilhouetteStage([outlineEffect])
      );

      viewer.screenSpaceEventHandler.setInputAction((movement) => {
        const pickedFeature = viewer.scene.pick(movement.position);

        if (!Cesium.defined(pickedFeature)) {
          return;
        }
        if (
          outlineEffect.selected.length &&
          outlineEffect.selected[0] === pickedFeature
        )
          return;
        outlineEffect.selected = [pickedFeature];
        console.log(pickedFeature);
        this.onSelectAction(pickedFeature);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    } else {
      viewer.screenSpaceEventHandler.setInputAction((movement) => {
        // Pick a new feature
        const pickedFeature = viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedFeature)) {
          return;
        }
        if (
          Cesium.defined(selected.feature) &&
          pickedFeature === selected.feature
        ) {
          return;
        }
        if (
          Cesium.defined(selected.feature) &&
          pickedFeature !== selected.feature
        ) {
          //之前选中的对象还原颜色
          selected.feature.color = selected.originalColor;
          selected.feature = undefined;
        }

        this.printColor(pickedFeature.color);
        // //存储原始颜色
        selected.originalColor = Cesium.Color.clone(pickedFeature.color);

        selected.feature = pickedFeature;

        //选中对象更新为高亮颜色
        pickedFeature.color = this.selectedColor;
        console.log(selected);
        this.onSelectAction(pickedFeature);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  }
  onSelectAction(obj) {}
  onClickAction(cartographic, cartesian) {}
  addEntity(id, pos, set) {
    this.viewer.entities.add({
      id,
      position: Cesium.Cartesian3.fromDegrees(pos.lng, pos.lat, pos.height),
      ...set,
    });
  }
  getEntityById(id) {
    //https://cesium.com/learn/cesiumjs/ref-doc/EntityCollection.html
    return this.viewer.entities.getById(id);
  }
  drawLine() {}
}
