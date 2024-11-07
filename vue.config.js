const webpack = require("webpack");
const path = require('path');
const isBuild = process.argv.includes("build")

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 8594

function getProxyPath(proxyPath = {}) {
  const mockPath = require("./src/utils/mockProxy");
  mockPath.map((path) => {
    proxyPath[`${path}`] = {
      target: `http://localhost:${port}/dev-api`,
      changeOrigin: true, // 是否跨域
      ws: true,
      pathRewrite: {}
    };
  })
  return proxyPath;
}

module.exports = {
  publicPath: '',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  css: { extract: false },
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      ...getProxyPath()
    },
    before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [],
    externals: isBuild ? {
      "axios": "axios",
      "dayjs": "dayjs",
      "element-resize-detector": "element-resize-detector",
      "element-ui": "element-ui",
      "exceljs": "exceljs",
      "ramda": "ramda",
      "richform": "richform",
      "screenfull": "screenfull",
      "short-uuid": "short-uuid",
      "vue-i18n": "vue-i18n",
      "vxe-pc-ui": "vxe-pc-ui",
      "vxe-table": "vxe-table",
      "vxe-table-plugin-export-xlsx": "vxe-table-plugin-export-xlsx"
    } : {}
  },
  // to handle element icon error in build. 
  chainWebpack: config => {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.module
      .rule("fonts")
      .test(/.(ttf|otf|eot|woff|woff2)$/)
      .use("url-loader")
      .loader("url-loader")
      .tap(options => {
        options = {
          // limit: 10000,
          name: '/static/fonts/[name].[ext]',
        }
        return options
      })
      .end()
  }
}
