import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');
//日照分析
viewer.scene.globe.enableLighting = true;
viewer.shadows = true;
viewer.clock.startTime = Cesium.JulianDate.fromDate(new Date());
viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date());
viewer.clock.stopTime = Cesium.JulianDate.fromDate(new Date());

viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
viewer.clock.multiplier = 1600;
