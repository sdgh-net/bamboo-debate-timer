const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const path = require('path');

module.exports = {
  // lintOnSave: false,
  devServer: {
    // host: '0.0.0.0', //host改成自己的IP
    // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#配置代理
    proxy: null, // string | Object
  },
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    _: 'lodash',
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        asar: false,
        win: {
          icon: './public/electron.ico',
          target: [
            {
              target: 'portable',
              arch: [
                "ia32"
              ]
            }
          ]
        },
      }
    }
  },
  configureWebpack: () => {
    if(process.env.NODE_ENV === 'production' && !process.env.IS_ELECTRON) {
      return {module: {
          rules: [
            {
              test: /\.mjs$/,
              include: /node_modules/,
              type: "javascript/auto"
            },
          ]
        },
        plugins: [
          new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, './dist'),
            routes: ['/', '/show','/gen'],
            renderer: new Renderer({
              headless: true,
              // renderAfterTime: 5000,
              renderAfterDocumentEvent: 'render-event',
            })
          }),

        ],};
    }else {
      return {module: {
          rules: [
            {
              test: /\.mjs$/,
              include: /node_modules/,
              type: "javascript/auto"
            },
          ]
        }};
    }
  }
}
