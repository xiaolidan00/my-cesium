import cesium from 'vite-plugin-cesium';
import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      /**
       * 在这里写entry后，你将不需要在`index.html`内添加 script 标签，原有标签需要删除
       * @default src/main.ts
       */
      entry: 'src/main.ts',
      /**
       * 如果你想将 `index.html`存放在指定文件夹，可以修改它，否则不需要配置
       * @default index.html
       */
      template: 'index.html'
    }),
    cesium()
  ]
});
