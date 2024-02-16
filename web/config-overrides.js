/* eslint-disable no-param-reassign */
// /* eslint-disable import/no-extraneous-dependencies */
const webpack = require("webpack");
const path = require("path");
const getCacheIdentifier = require("react-dev-utils/getCacheIdentifier");
const Dotenv = require("dotenv-webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    fs: false,
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, "");
    }),
  );
  config.plugins.push(
    new Dotenv({
      path: "./.env", // Path to your .env file
      safe: true, // If true, load .env.example (defaults to "false" which does not use dotenv-safe)
      systemvars: true, // If true, load system environment variables (defaults to "false" which does not use dotenv-safe)
    }),
  );
  config.ignoreWarnings = [/Failed to parse source map/];
  config.module.rules.push({
    test: /\.(js|mjs|jsx)$/,
    enforce: "pre",
    loader: require.resolve("source-map-loader"),
    resolve: {
      fullySpecified: false,
    },
  });
  const loaders = config.module.rules[1].oneOf;

  loaders.splice(loaders.length - 1, 0, {
    test: /\.(js|mjs|cjs)$/,
    exclude: [
      /@babel(?:\/|\\{1,2})runtime/,
      path.resolve(__dirname, "node_modules/pl-lib/dist/cjs/api"),
    ],
    loader: require.resolve("babel-loader"),
    options: {
      babelrc: false,
      configFile: false,
      compact: false,
      presets: [
        [
          require.resolve("babel-preset-react-app/dependencies"),
          { helpers: true },
        ],
      ],
      cacheDirectory: true,
      // See #6846 for context on why cacheCompression is disabled
      cacheCompression: false,
      // @remove-on-eject-begin
      cacheIdentifier: getCacheIdentifier("development", [
        "babel-plugin-named-asset-import",
        "babel-preset-react-app",
        "react-dev-utils",
        "react-scripts",
      ]),
      // @remove-on-eject-end
      // Babel sourcemaps are needed for debugging into node_modules
      // code.  Without the options below, debuggers like VSCode
      // show incorrect code and set breakpoints on the wrong lines.
      sourceMaps: true,
      inputSourceMap: true,
    },
  });

  return config;
};
