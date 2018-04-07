'use strict';

var path = require('path');

module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '.')
  },

  module: {
    rules: [{
      test: /\.js$/, // Run the loader on all .js files
      exclude: /node_modules/, // ignore all files in the node_modules folder
      loader: 'eslint-loader',
      options: {
/*          "ecmaFeatures": {
                "modules": true,
                "spread" : true,
                "restParams" : true
            },
            "env" : {
                "browser" : true,
                "node" : true,
                "es6" : true
            },
            "rules" : {
                "no-unused-vars" : 2,
                "no-undef" : 2
            },
            "parserOptions": {
                "sourceType": "module"
            }
            */
      }
    }]
  },

  resolve: {
    modules: [
        path.resolve(__dirname, '.'), 
        path.resolve(__dirname, 'node_modules')
    ]
  }
  
};

/*
var path = require('path');
var webpack = require('webpack');
//var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        path.join(__dirname, 'app.js')
    ],
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: '[name].js',
        publicPath: '/'
    },
    plugins: [
    */
/*
        new HtmlWebpackPlugin({
          template: 'app/index.tpl.html',
          inject: 'body',
          filename: 'index.html'
        }),
*/
/*
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel'
            }, 
            {
                test: /\.json?$/,
                loader: 'json'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass?modules&localIdentName=[name]---[local]---[hash:base64:5]'
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    }
};
*/