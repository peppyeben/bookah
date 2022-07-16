const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })
    ],
    resolve: {
      fallback: {
        "os": false,
        "url": false,
        "crypto": false,
        "https": false,
        "http": false,
        "assert": false,
        "stream": false,
        "path": false,
        "zlib": false,
        "buffer": require.resolve("buffer")
      }
    },
    // rules: [
    //   {
    //     test: /\.svg$/,
    //     use: [
    //     ]
    //   }
    // ]
  },
})
