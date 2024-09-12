function CanvasParticle() {
  this.lng = null; // 粒子初始经度
  this.lat = null; // 粒子初始纬度
  this.x = null; // 粒子初始x位置(相对于棋盘网格，比如x方向有360个格，x取值就是0-360，这个是初始化时随机生成的)
  this.y = null; // 粒子初始y位置(同上)
  this.tlng = null; // 粒子下一步将要移动的经度，这个需要计算得来
  this.tlat = null; // 粒子下一步将要移动的y纬度，这个需要计算得来
  this.age = null; // 粒子生命周期计时器，每次-1
  this.speed = null; // 粒子移动速度，可以根据速度渲染不同颜色
  this.theight = 0;
  this.height = 0;
}
class CanvasWindy {
  constructor(json, params) {
    this.windData = json;
    this.viewer = params.viewer;
    this.canvas = params.canvas;
    this.extent = params.extent || []; // 风场绘制时的地图范围，范围不应该大于风场数据的范围，顺序：west/east/south/north，有正负区分，如：[110,120,30,36]
    //可配置的参数
    this.canvasContext = params.canvas.getContext('2d'); // canvas上下文
    this.canvasWidth = params.canvasWidth; //画布宽度
    this.canvasHeight = params.canvasHeight; //画布高度
    this.speedRate = params.speedRate || 50;
    this.particlesNumber = params.particlesNumber || 5000; //粒子数
    this.maxAge = params.maxAge || 120; //粒子生命周期
    this.frameTime = 100 / (params.frameRate || 10); // 每秒刷新次数
    this.color = params.color || '#ffffff';
    this.lineWidth = params.lineWidth || 1; // 线宽度
    // 内置参数
    this.initExtent = []; // 风场初始范围
    this.calcspeedRate = [0, 0]; // 根据speedRate参数计算经纬度步进长度
    this.windField = null;
    this.particles = [];
    this.animateFrame = null; // requestAnimationFrame事件句柄，用来清除操作
    this.isdistory = false; // 是否销毁，进行删除操作
    this.init();
  }

  init() {
    //创建棋盘格子
    this.windField = this.createField();

    // 20211124 全球风场使用
    // this.initExtent = [this.windField.west-180,this.windField.east-180,this.windField.south,this.windField.north];
    // 局部风场使用
    this.initExtent = [
      this.windField.west,
      this.windField.east,
      this.windField.south,
      this.windField.north
    ];
    // 如果风场创建时，传入的参数有extent，就根据给定的extent，让随机生成的粒子落在extent范围内
    if (this.extent.length !== 0) {
      this.extent = [
        Math.max(this.initExtent[0], this.extent[0]),
        Math.min(this.initExtent[1], this.extent[1]),
        Math.max(this.initExtent[2], this.extent[2]),
        Math.min(this.initExtent[3], this.extent[3])
      ];
    }
    this.calcStep();
    // 创建风场粒子
    for (let i = 0; i < this.particlesNumber; i++) {
      this.particles.push(this.randomParticle(new CanvasParticle()));
    }
    this.canvasContext.fillStyle = 'rgba(0, 0, 0, 0.97)';
    this.canvasContext.globalAlpha = 0.6;
    this.animate();

    let then = Date.now();
    const that = this;
    (function frame() {
      if (!that.isdistory) {
        that.animateFrame = requestAnimationFrame(frame);
        const now = Date.now();
        const delta = now - then;
        if (delta > that.frameTime) {
          then = now - (delta % that.frameTime);
          that.animate();
        }
      } else {
        that.removeLines();
      }
    })();
  }
  // // 计算经纬度步进长度
  calcStep() {
    const isextent = this.extent.length !== 0;
    const calcExtent = isextent ? this.extent : this.initExtent;
    const calcSpeed = this.speedRate;
    this.calcspeedRate = [
      (calcExtent[1] - calcExtent[0]) / calcSpeed,
      (calcExtent[3] - calcExtent[2]) / calcSpeed
    ];
  }

  createField() {
    const data = this.parseWindJson();
    return new CanvasWindField(data);
  }

  animate() {
    const self = this;
    const field = self.windField;
    let nextLng = null;
    let nextLat = null;
    let uvw = null;
    // this._graphicData = [];
    this.particles.forEach((particle) => {
      if (particle.age <= 0) {
        this.randomParticle(particle);
      }
      if (particle.age > 0) {
        const tlng = particle.tlng;
        const tlat = particle.tlat;
        const height = particle.theight;
        const gridpos = this.togrid(tlng, tlat);
        const tx = gridpos[0];
        const ty = gridpos[1];
        if (!this.isInExtent(tlng, tlat)) {
          particle.age = 0;
        } else {
          uvw = field.getIn(tx, ty);
          nextLng = tlng + this.calcspeedRate[0] * uvw[0];
          nextLat = tlat + this.calcspeedRate[1] * uvw[1];
          particle.lng = tlng;
          particle.lat = tlat;
          particle.x = tx;
          particle.y = ty;
          particle.tlng = nextLng;
          particle.tlat = nextLat;
          particle.height = height;
          //计算空间距离
          const startPosition = new Cesium.Cartesian3.fromDegrees(particle.lng, particle.lat);
          const endPosition = new Cesium.Cartesian3.fromDegrees(particle.tlng, particle.tlat);
          const d = Cesium.Cartesian3.distance(startPosition, endPosition);

          const t = d / uvw[3];
          particle.theight = particle.height + (t * uvw[2]) / this.speedRate;
          particle.age--;
        }
      }
    });
    if (this.particles.length <= 0) this.removeLines();

    this.drawLines();
  }

  // 粒子是否在地图范围内
  isInExtent(lng, lat) {
    const calcExtent = this.initExtent;
    if (
      lng >= calcExtent[0] &&
      lng <= calcExtent[1] &&
      lat >= calcExtent[2] &&
      lat <= calcExtent[3]
    )
      return true;
    return false;
  }

  parseWindJson() {
    let uComponent = null;
    let vComponent = null;
    let header = null;
    this.windData.forEach(function (record) {
      const type = `${record.header.parameterCategory},${record.header.parameterNumber}`;
      switch (type) {
        case '2,2':
          uComponent = record.data;
          header = record.header;
          break;
        case '2,3':
          vComponent = record.data;
          break;
        default:
          break;
      }
    });
    return {
      header: header,
      uComponent: uComponent,
      vComponent: vComponent
    };
  }

  removeLines() {
    window.cancelAnimationFrame(this.animateFrame);
    this.isdistory = true;
    this.canvas.width = 1;
    document.getElementById('content').removeChild(this.canvas);
  }

  // 根据粒子当前所处的位置(棋盘网格位置)，计算经纬度，在根据经纬度返回屏幕坐标
  tomap(lng, lat, particle) {
    if (!lng || !lat) {
      return null;
    }
    const ct3 = Cesium.Cartesian3.fromDegrees(lng, lat, particle.height);
    // 判断当前点是否在地球可见端
    const isVisible = new Cesium.EllipsoidalOccluder(
      Cesium.Ellipsoid.WGS84,
      this.viewer.camera.position
    ).isPointVisible(ct3);
    const pos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, ct3);
    if (!isVisible) {
      particle.age = 0;
    }
    return pos ? [pos.x, pos.y] : null;
  }

  tomap1(lng, lat, particle) {
    if (!lng || !lat) {
      return null;
    }
    const ct3 = Cesium.Cartesian3.fromDegrees(lng, lat, particle.theight);
    // 判断当前点是否在地球可见端
    const isVisible = new Cesium.EllipsoidalOccluder(
      Cesium.Ellipsoid.WGS84,
      this.viewer.camera.position
    ).isPointVisible(ct3);
    const pos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, ct3);
    if (!isVisible) {
      particle.age = 0;
    }
    return pos ? [pos.x, pos.y] : null;
  }

  // 根据经纬度，算出棋盘格位置
  togrid(lng, lat) {
    const field = this.windField;
    const x =
      ((lng - this.initExtent[0]) / (this.initExtent[1] - this.initExtent[0])) * (field.cols - 1);
    const y =
      ((this.initExtent[3] - lat) / (this.initExtent[3] - this.initExtent[2])) * (field.rows - 1);
    return [x, y];
  }

  drawLines() {
    const particles = this.particles;
    const color = this.color;
    this.canvasContext.lineWidth = this.lineWidth;
    this.canvasContext.globalCompositeOperation = 'destination-in';
    this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.canvasContext.globalCompositeOperation = 'lighter'; // 重叠部分的颜色会被重新计算
    this.canvasContext.globalAlpha = 0.9;
    this.canvasContext.strokeStyle = '#fff';
    particles.forEach((particle) => {
      const movetopos = this.tomap(particle.lng, particle.lat, particle);
      const linetopos = this.tomap1(particle.tlng, particle.tlat, particle);
      if (movetopos != null && linetopos != null) {
        this.canvasContext.beginPath();
        if (Object.prototype.toString.call(color).slice(8, -1) === 'Object') {
          for (const key in color) {
            if (Object.hasOwnProperty.call(color, key)) {
              const currentSColor = color[key];
              if (particle.speed > Number(key)) {
                this.canvasContext.strokeStyle = currentSColor;
              }
            }
          }
        }

        this.canvasContext.moveTo(movetopos[0], movetopos[1]);
        this.canvasContext.lineTo(linetopos[0], linetopos[1]);
        this.canvasContext.stroke();
      }
    });
  }

  // 随机数生成器（小数）
  fRandomByfloat(under, over) {
    return under + Math.random() * (over - under);
  }
  // 随机数生成器（整数）
  fRandomBy(under, over) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * under + 1);
      case 2:
        return parseInt(Math.random() * (over - under + 1) + under);
      default:
        return 0;
    }
  }

  //根据风场范围随机生成粒子
  randomParticle(particle) {
    let safe = 30;
    let x = -1;
    let y = -1;
    let lng = null;
    let lat = null;
    const hasextent = this.extent.length !== 0;
    const calcextent = hasextent ? this.extent : this.initExtent;
    do {
      try {
        if (hasextent) {
          const posx = this.fRandomBy(0, this.canvasWidth);
          const posy = this.fRandomBy(0, this.canvasHeight);
          const cartesian = this.viewer.camera.pickEllipsoid(
            new Cesium.Cartesian2(posx, posy),
            this.viewer.scene.globe.ellipsoid
          );
          const cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
          if (cartographic) {
            // 将弧度转为度的十进制度表示
            lng = Cesium.Math.toDegrees(cartographic.longitude);
            lat = Cesium.Math.toDegrees(cartographic.latitude);
          }
        } else {
          lng = this.fRandomByfloat(calcextent[0], calcextent[1]);
          lat = this.fRandomByfloat(calcextent[2], calcextent[3]);
        }
      } catch (e) {
        // console.log(e)
      }
      if (lng) {
        //找到随机生成的粒子的经纬度在棋盘的位置 x y
        const gridpos = this.togrid(lng, lat);
        x = gridpos[0];
        y = gridpos[1];
      }
    } while (this.windField.getIn(x, y)[2] <= 0 && safe++ < 30);
    const field = this.windField;
    const uvw = field.getIn(x, y);
    const nextLng = lng + this.calcspeedRate[0] * uvw[0];
    const nextLat = lat + this.calcspeedRate[1] * uvw[1];
    particle.lng = lng;
    particle.lat = lat;
    //计算随机点的高程
    const cartographic = Cesium.Cartographic.fromDegrees(particle.lng, particle.lat, 0);

    particle.height = this.viewer.scene.globe.getHeight(cartographic);
    particle.x = x;
    particle.y = y;
    particle.tlng = nextLng;
    particle.tlat = nextLat;
    particle.speed = uvw[3];
    particle.age = Math.round(Math.random() * this.maxAge); // 每一次生成都不一样
    //计算空间距离
    const startPosition = new Cesium.Cartesian3.fromDegrees(particle.lng, particle.lat);
    const endPosition = new Cesium.Cartesian3.fromDegrees(particle.tlng, particle.tlat);
    const d = Cesium.Cartesian3.distance(startPosition, endPosition);
    const t = d / uvw[3];
    particle.theight = particle.height + (t * uvw[2]) / this.speedRate;
    return particle;
  }

  // 根据现有参数重新生成风场
  redraw() {
    window.cancelAnimationFrame(this.animateFrame);
    this.particles = [];
    // this.windField.grid = []
    this.init();
  }

  resize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }
}
// 棋盘类
function CanvasWindField(obj) {
  this.west = null;
  this.east = null;
  this.south = null;
  this.north = null;
  this.rows = null;
  this.cols = null;
  this.dx = null;
  this.dy = null;
  this.unit = null;
  this.date = null;

  this.grid = null;
  this.init(obj);
}
CanvasWindField.prototype = {
  constructor: CanvasWindField,
  init: function (obj) {
    const header = obj.header;
    const uComponent = obj.uComponent;
    const vComponent = obj.vComponent;

    this.west = +header.lo1;
    this.east = +header.lo2;
    this.south = +header.la2;
    this.north = +header.la1;
    this.rows = +header.ny;
    this.cols = +header.nx;
    this.dx = +header.dx;
    this.dy = +header.dy;
    this.unit = header.parameterUnit;
    this.date = header.refTime;

    this.grid = [];
    let k = 0;
    let rows = null;
    let uvw = null;
    for (let j = 0; j < this.rows; j++) {
      rows = [];
      for (let i = 0; i < this.cols; i++, k++) {
        uvw = this.calcUVW(uComponent[k], vComponent[k], vComponent[k]);
        rows.push(uvw);
      }
      this.grid.push(rows);
    }
  },

  //计算风场向量
  calcUVW(u, v, w) {
    return [+u, +v, +w, Math.sqrt(u * u + v * v)];
  },

  // 二分差值算法计算给定节点的速度
  bilinearInterpolation(x, y, g00, g10, g01, g11) {
    const rx = 1 - x;
    const ry = 1 - y;
    const a = rx * ry;
    const b = x * ry;
    const c = rx * y;
    const d = x * y;
    const u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
    const v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
    const w = g00[2] * a + g10[2] * b + g01[2] * c + g11[2] * d;
    return this.calcUVW(u, v, w);
  },

  getIn(x, y) {
    //  局部风场使用
    if (x < 0 || x >= this.cols || y >= this.rows || y <= 0) {
      return [0, 0, 0];
    }
    const x0 = Math.floor(x); //向下取整
    const y0 = Math.floor(y);
    let x1;
    let y1;
    if (x0 === x && y0 === y) return this.grid[y][x];

    x1 = x0 + 1;
    y1 = y0 + 1;

    const g00 = this.getIn(x0, y0);
    const g10 = this.getIn(x1, y0);
    const g01 = this.getIn(x0, y1);
    const g11 = this.getIn(x1, y1);
    let result = null;
    // console.log(x - x0, y - y0, g00, g10, g01, g11)
    try {
      result = this.bilinearInterpolation(x - x0, y - y0, g00, g10, g01, g11);
      // console.log(result)
    } catch (e) {
      console.log(x, y);
    }
    return result;
  },
  isInBound: function (x, y) {
    if (x >= 0 && x < this.cols - 1 && y >= 0 && y < this.rows - 1) return true;
    return false;
  }
};
