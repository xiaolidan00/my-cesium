import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer', {
  shouldAnimate: true,
  terrain: Cesium.Terrain.fromWorldTerrain()
});
const scene = viewer.scene;
scene.globe.depthTestAgainstTerrain = true;

const resetCameraFunction = function () {
  scene.camera.setView({
    destination: new Cesium.Cartesian3(277096.634865404, 5647834.481964232, 2985563.7039122293),
    orientation: {
      heading: 4.731089976107251,
      pitch: -0.32003481981370063
    }
  });
};
resetCameraFunction();

// snow
const snowParticleSize = 12.0;
const snowRadius = 100000.0;
const minimumSnowImageSize = new Cesium.Cartesian2(snowParticleSize, snowParticleSize);
const maximumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 2.0, snowParticleSize * 2.0);
let snowGravityScratch = new Cesium.Cartesian3();
const snowUpdate = function (particle, dt) {
  snowGravityScratch = Cesium.Cartesian3.normalize(particle.position, snowGravityScratch);
  Cesium.Cartesian3.multiplyByScalar(
    snowGravityScratch,
    Cesium.Math.randomBetween(-30.0, -300.0),
    snowGravityScratch
  );
  particle.velocity = Cesium.Cartesian3.add(
    particle.velocity,
    snowGravityScratch,
    particle.velocity
  );
  const distance = Cesium.Cartesian3.distance(scene.camera.position, particle.position);
  if (distance > snowRadius) {
    particle.endColor.alpha = 0.0;
  } else {
    particle.endColor.alpha = 1.0 / (distance / snowRadius + 0.1);
  }
};

// rain
const rainParticleSize = 15.0;
const rainRadius = 100000.0;
const rainImageSize = new Cesium.Cartesian2(rainParticleSize, rainParticleSize * 2.0);
let rainGravityScratch = new Cesium.Cartesian3();
const rainUpdate = function (particle, dt) {
  rainGravityScratch = Cesium.Cartesian3.normalize(particle.position, rainGravityScratch);
  rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(
    rainGravityScratch,
    -1050.0,
    rainGravityScratch
  );

  particle.position = Cesium.Cartesian3.add(
    particle.position,
    rainGravityScratch,
    particle.position
  );

  const distance = Cesium.Cartesian3.distance(scene.camera.position, particle.position);
  if (distance > rainRadius) {
    particle.endColor.alpha = 0.0;
  } else {
    particle.endColor.alpha = Cesium.Color.BLUE.alpha / (distance / rainRadius + 0.1);
  }
};

// button
Sandcastle.addToolbarButton('Reset Camera', resetCameraFunction);

function startSnow() {
  scene.primitives.removeAll();
  scene.primitives.add(
    new Cesium.ParticleSystem({
      modelMatrix: new Cesium.Matrix4.fromTranslation(scene.camera.position),
      minimumSpeed: -1.0,
      maximumSpeed: 0.0,
      lifetime: 15.0,
      emitter: new Cesium.SphereEmitter(snowRadius),
      startScale: 0.5,
      endScale: 1.0,
      image: '../SampleData/snowflake_particle.png',
      emissionRate: 7000.0,
      startColor: Cesium.Color.WHITE.withAlpha(0.0),
      endColor: Cesium.Color.WHITE.withAlpha(1.0),
      minimumImageSize: minimumSnowImageSize,
      maximumImageSize: maximumSnowImageSize,
      updateCallback: snowUpdate
    })
  );

  scene.skyAtmosphere.hueShift = -0.8;
  scene.skyAtmosphere.saturationShift = -0.7;
  scene.skyAtmosphere.brightnessShift = -0.33;
  scene.fog.density = 0.001;
  scene.fog.minimumBrightness = 0.8;
}

// drop down
const options = [
  {
    text: 'Snow',
    onselect: startSnow
  },
  {
    text: 'Rain',
    onselect: function () {
      scene.primitives.removeAll();
      scene.primitives.add(
        new Cesium.ParticleSystem({
          modelMatrix: new Cesium.Matrix4.fromTranslation(scene.camera.position),
          speed: -1.0,
          lifetime: 15.0,
          emitter: new Cesium.SphereEmitter(rainRadius),
          startScale: 1.0,
          endScale: 0.0,
          image: '../SampleData/circular_particle.png',
          emissionRate: 9000.0,
          startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.0),
          endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
          imageSize: rainImageSize,
          updateCallback: rainUpdate
        })
      );

      scene.skyAtmosphere.hueShift = -0.97;
      scene.skyAtmosphere.saturationShift = 0.25;
      scene.skyAtmosphere.brightnessShift = -0.4;
      scene.fog.density = 0.00025;
      scene.fog.minimumBrightness = 0.01;
    }
  }
];
Sandcastle.addToolbarMenu(options);
startSnow();
