const path = require("path");

module.exports = {
  resolver: {
    extraNodeModules: {
      buffer: path.resolve(__dirname, "./node_modules/buffer"),
      crypto: path.resolve(__dirname, "./polyfills/crypto"),
      querystring: path.resolve(__dirname, "./node_modules/querystring"),
      stream: path.resolve(__dirname, "./node_modules/readable-stream"),
    },
  },
};
