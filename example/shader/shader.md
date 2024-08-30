# cesium自定义后期效果

[参考地址](https://sandcastle.cesium.com/?src=Custom%20Per-Feature%20Post%20Process.html&label=All)

```js
const fragmentShaderSource = `
  uniform sampler2D colorTexture;
  in vec2 v_textureCoordinates;
  uniform vec4 highlight;
  void main() {
  //贴图颜色
      vec4 color = texture(colorTexture, v_textureCoordinates);
      //选中对象
      if (czm_selected()) {
      //高亮颜色
          vec3 highlighted = highlight.a * highlight.rgb + (1.0 - highlight.a) * color.rgb;
          out_FragColor = vec4(highlighted, 1.0);
      } else { 
          out_FragColor = color;
      }
  }
  `;
//添加自定义后期
const stage = scene.postProcessStages.add(
  new Cesium.PostProcessStage({
    fragmentShader: fragmentShaderSource,
    uniforms: {
      highlight: function () {
      //半透明红色高亮
        return new Cesium.Color(1.0, 0.0, 0.0, 0.5);
      },
    },
  })
);
//后期选中对象
stage.selected = [];

//给canvas添加鼠标移动动作监听
const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (movement) {
  const pickedObject = viewer.scene.pick(movement.endPosition);
  //移动到物体上
  if (Cesium.defined(pickedObject)) {
    stage.selected = [pickedObject.primitive];
  } else {
    stage.selected = [];
  }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
```
