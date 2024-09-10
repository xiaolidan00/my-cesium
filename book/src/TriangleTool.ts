import { HtmlOverlay, type HtmlOverlayType } from './../../src/map/HtmlOverlay';
import * as Cesium from 'cesium';

import { PosUtil, type LngLatHeightType } from './PosUtil';

export default class TriangleTool {
  private viewer: Cesium.Viewer;
  private htmlOverlay: HtmlOverlay;
  private handler: Cesium.ScreenSpaceEventHandler;
  isOpen: boolean = false;
  isDisposed: boolean = false;
  private readonly cursorName = 'triangleCursor';
  private readonly labelName = 'triangleLabel';
  currentIndex: number = 0;
  cursorLabel: HtmlOverlayType | null = null;
  currentShape: Array<Cesium.Entity> = [];
  currentPoints: LngLatHeightType[] = [];
  currentTips: Array<HtmlOverlayType> = [];
  private readonly polygonParams = {
    material: Cesium.Color.RED.withAlpha(0.5),
    perPositionHeight: true,

    outline: true,
    outlineColor: Cesium.Color.RED,
    outlineWidth: 5,
    zIndex: 1
  };
  private readonly pointParams = {
    pixelSize: 10,
    color: Cesium.Color.WHITE,
    outlineColor: Cesium.Color.RED,
    outlineWidth: 5,
    zIndex: 2
  };

  constructor(viewer: Cesium.Viewer, htmlOverlay: HtmlOverlay) {
    this.htmlOverlay = htmlOverlay;
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    PosUtil.viewer = viewer;
  }
  drawPoint(position: Cesium.Cartesian3) {
    const pointEntity = new Cesium.Entity({
      show: true,
      position,
      point: this.pointParams
    });
    this.viewer.entities.add(pointEntity);
    return pointEntity;
  }
  private refreshCursor(c: Cesium.Cartesian3) {
    let content = '';
    if (this.currentIndex === 0) {
      content = `<div class="line-tip">单击确定起点</div>`;
    } else {
      content = `<div class="line-tip">单击确定终点</div>`;
    }
    if (this.cursorLabel) {
      this.htmlOverlay.showHtml(this.cursorName);
      this.htmlOverlay.updateHtml({
        id: this.cursorName,
        position: PosUtil.Cartesian3ToWGS84(c),
        content
      });
    } else {
      this.cursorLabel = this.htmlOverlay.addHtml({
        id: this.cursorName,
        position: PosUtil.Cartesian3ToWGS84(c),
        content,
        offset: [12, 32]
      });
    }
  }
  setEndPoint(ev) {
    const crd = PosUtil.pickTilePos(ev.position);
    console.log('%csetEndPoint', 'background: #ffff00', crd);
    if (!crd) return;
    const wgs84 = PosUtil.Cartesian3ToWGS84(crd);

    if (this.currentIndex >= 1) {
      this.currentPoints[1] = wgs84;
      this.currentShape[2].position = crd;
      this.drawTriangle();
      this.refreshCursor(crd);
    } else {
      this.currentPoints[0] = wgs84;
      const p = crd;
      const point = this.drawPoint(p);
      this.currentShape[0] = point;

      const point1 = this.drawPoint(p);
      this.currentShape[1] = point1;

      const point2 = this.drawPoint(p);
      this.currentShape[2] = point2;
      this.refreshCursor(p);
      this.currentIndex++;
    }
  }
  private leftClickListener(ev: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
    const cartesian = PosUtil.Cartesian2ToCartesian3(ev.position);
    if (!cartesian) return;
    this.setEndPoint(ev);
    // if (this.currentIndex === 1) {
    //   this.closeTool();
    // }
  }

  drawTriangle() {
    const p1 = this.currentPoints[0];
    const p2 = this.currentPoints[1];
    const distance = PosUtil.getDistance(
      PosUtil.WGS84ToCartographic(p1),
      PosUtil.WGS84ToCartographic(p2)
    );
    const height = Math.abs(p1[2] - p2[2]);
    const len = Math.sqrt(distance * distance + height * height);
    const maxHeight = Math.max(p1[2], p2[2]);
    const p3 = [p1[0], p1[1], maxHeight];
    const arr = [p2, p3, p1];
    console.log('🚀 ~ file: TriangleTool.ts:93 ~ TriangleTool ~ drawTriangle ~ arr:', arr);
    const pos = Cesium.Cartesian3.fromDegreesArrayHeights(arr.flat(Infinity));
    this.currentShape[1].position = Cesium.Cartesian3.fromDegrees(...p3);
    if (!this.currentShape[3]) {
      this.currentShape[3] = new Cesium.Entity({
        polygon: {
          hierarchy: pos,
          ...this.polygonParams
        }
      });
      this.viewer.entities.add(this.currentShape[3]);
    } else {
      this.currentShape[3].polygon.hierarchy = pos;
    }

    const h = maxHeight - height * 0.5;
    if (this.currentTips?.length) {
      this.currentTips[0] = this.htmlOverlay.updateHtml({
        id: this.labelName + '1',
        position: [(p1[0] + p2[0]) * 0.5, (p1[1] + p2[1]) * 0.5, maxHeight],
        content: `<div class="line-tip">空间距离${distance.toFixed(2)}米</div>`,
        offset: [-60, -14]
      });

      this.currentTips[1] = this.htmlOverlay.updateHtml({
        id: this.labelName + '2',
        position: [(p1[0] + p2[0]) * 0.5, (p1[1] + p2[1]) * 0.5, h],
        content: `<div class="line-tip">直线距离${len.toFixed(2)}米</div>`,
        offset: [-60, -14]
      });

      this.currentTips[2] = this.htmlOverlay.updateHtml({
        id: this.labelName + '3',
        position: [p1[0], p1[1], h],
        content: `<div class="line-tip">高度差${height.toFixed(2)}米</div>`,
        offset: [-60, -14]
      });
    } else {
      this.currentTips[0] = this.htmlOverlay.addHtml({
        id: this.labelName + '1',
        position: [(p1[0] + p2[0]) * 0.5, (p1[1] + p2[1]) * 0.5, maxHeight],
        content: `<div class="line-tip">空间距离${distance.toFixed(2)}米</div>`,
        offset: [-60, -14]
      });

      this.currentTips[1] = this.htmlOverlay.addHtml({
        id: this.labelName + '2',
        position: [(p1[0] + p2[0]) * 0.5, (p1[1] + p2[1]) * 0.5, h],
        content: `<div class="line-tip">直线距离${len.toFixed(2)}米</div>`,
        offset: [-60, -14]
      });

      this.currentTips[2] = this.htmlOverlay.addHtml({
        id: this.labelName + '3',
        position: [p1[0], p1[1], h],
        content: `<div class="line-tip">高度差${height.toFixed(2)}米</div>`,
        offset: [-60, -14]
      });
    }
  }
  private rightClickListener(ev: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
    if (this.currentShape[2]) {
      this.setEndPoint(ev);
    }
    this.closeTool();
  }

  private mouseMoveListener(ev: Cesium.ScreenSpaceEventHandler.MotionEvent) {
    const cartesian = PosUtil.Cartesian2ToCartesian3(ev.endPosition);
    if (!cartesian) return;
    this.refreshCursor(cartesian);
    if (this.currentShape[2]) {
      this.setEndPoint({ position: ev.endPosition });
    }
  }
  private addEventListener() {
    this.handler.setInputAction(
      this.leftClickListener.bind(this),
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    this.handler.setInputAction(
      this.rightClickListener.bind(this),
      Cesium.ScreenSpaceEventType.RIGHT_CLICK
    );
    this.handler.setInputAction(
      this.mouseMoveListener.bind(this),
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    );
  }
  //  移除事件
  private removeEventListener() {
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    document.body.addEventListener('click', this.onClickListener.bind(this));
  }
  private onClickListener(ev: MouseEvent) {
    if (this.isOpen) return;
  }
  // 工具打开时的操作
  openTool(): void {
    this.isOpen = true;
    this.addEventListener();
    this.currentIndex = 0;
    this.viewer.canvas.style.cursor = 'url(/line_tool.cur), auto';
  }

  // 工具关闭时的操作
  closeTool(): void {
    this.isOpen = false;
    this.viewer.canvas.style.cursor = 'default';
    if (this.cursorLabel) {
      this.htmlOverlay.hideHtml(this.cursorName);
    }
    this.removeEventListener();
  }

  clear(): void {
    this.removeEventListener();
  }

  dispose(): void {
    // 清理资源
    this.clear();
    this.isDisposed = true;
  }
}
