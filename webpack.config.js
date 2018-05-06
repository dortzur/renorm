const webpack = require("webpack");
const config = require("./paths");

// This is the Webpack configuration.
// It is focused on developer experience and fast rebuilds.
module.exports = options => {
  const mainBabelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: []
  };

  return {
    // Webpack can target multiple environments such as `node`,
    // `browser`, and even `electron`. Since Backpack is focused on Node,
    // we set the default target accordingly.
    target: "node",
    // The benefit of Webpack over just using babel-cli or babel-node
    // command is sourcemap support. Although it slows down compilation,
    // it makes debugging dramatically easier.
    devtool: "source-map",

    // As of Webpack 2 beta, Webpack provides performance hints.
    // Since we are not targeting a browser, bundle size is not relevant.
    // Additionally, the performance hints clutter up our nice error messages.
    performance: {
      hints: false
    },
    externals: ["reselect","normalizr"],
    // Since we are wrapping our own webpack config, we need to properly resolve
    // Backpack's and the given user's node_modules without conflict.
    resolve: {
      extensions: [".js", ".json"]
      // modules: [config.userNodeModulesPath, path.resolve(__dirname, '../node_modules')]
    },
    resolveLoader: {
      // modules: [config.userNodeModulesPath, path.resolve(__dirname, '../node_modules')]
    },
    node: {
      __filename: true,
      __dirname: true
    },
    entry: {
      index: `./src/index.js`
    },
    // This sets the default output file path, name, and compile target
    // module type. Since we are focused on Node.js, the libraryTarget
    // is set to CommonJS2
    output: {
      path: config.buildPath,
      filename: "[name].js",
      sourceMapFilename: "[name].map",
      publicPath: '/',
      libraryTarget: "commonjs2"
    },
    // Define a few default Webpack loaders. Notice the use of the new
    // Webpack 2 configuration: module.rules instead of module.loaders
    module: {
      rules: [
        // This is the development configuration.
        // It is focused on developer experience and fast rebuilds.
        {
          test: /\.json$/,
          loader: require.resolve("json-loader")
        },
        // Process JS with Babel (transpiles ES6 code into ES5 code).
        {
          test: /\.(js|jsx)$/,
          loader: require.resolve("babel-loader"),
          exclude: [/node_modules/, config.buildPath],
          options: mainBabelOptions
        }
      ]
    },
    plugins: [
      // We define some sensible Webpack flags. One for the Node environment,
      // and one for dev / production. These become global variables. Note if
      // you use something like eslint or standard in your editor, you will
      // want to configure __DEV__ as a global variable accordingly.
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      }),

      // The NoEmitOnErrorsPlugin plugin prevents Webpack
      // from printing out compile time stats to the console.
      new webpack.NoEmitOnErrorsPlugin()
    ]
  };
};
