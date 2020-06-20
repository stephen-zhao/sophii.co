const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const createVariants = require('parallel-webpack').createVariants;

const variants = {
  production: {
    mode: ['production'],
    libraryTarget: ['amd', 'umd', 'commonjs2', 'var'],
    minified: [true, false],
  },
  development: {
    mode: ['development'],
    libraryTarget: ['var'],
    minified: [false]
  },
};

const createConfig = function(options) {
  const variantName = options.libraryTarget + (options.minified ? '.min' : '');
  return {
    name: variantName,
    mode: options.mode,
    entry: {
      "avoidance": path.resolve(__dirname, 'src', 'avoidance.js'),
    },
    devtool: 'source-maps',
    output: {
      path: path.resolve(__dirname, options.mode === 'development' ? 'dist_dev' : 'dist'),
      filename: 'avoidance.'+variantName+'.js',
      library: 'Avoidance',
      libraryExport: 'default',
      libraryTarget: options.libraryTarget,
    },
    resolve: {
      extensions: ['.js']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            }
          }
        }
      ]
    },
    optimization: {
      minimize: options.minified,
      minimizer: [new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      })]
    }
  };
};

const mode = process.argv.reduce((accum, curr) => {
  if (accum) return accum;
  if (curr.startsWith('--mode=')) {
    var mode = curr.substring(7);
    return (mode in variants) ? mode : null;
  }
  else {
    return null;
  }
}, null);

module.exports = createVariants(variants[mode], createConfig);
