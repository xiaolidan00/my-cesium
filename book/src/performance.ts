import * as Cesium from 'cesium';

Cesium.RequestScheduler.throttleRequests = false; //关闭请求调度器的请求节流
Cesium.RequestScheduler.maximumRequestsPerServer = 18; // 设置cesium请求调度器的最大并发数量
