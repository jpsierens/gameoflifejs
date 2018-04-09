'use strict';

var path = require('path');

module.exports = {
    entry: './app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '.')
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js?$/,
                loader: 'eslint-loader',
                options: {},
                exclude: /node_modules/
            },
            {
                test: /\.js$/, // Run the loader on all .js files
                exclude: /node_modules/, // ignore all files in the node_modules folder
                loader: 'babel-loader'
            }
        ]
    },

    resolve: {
        modules: [
            path.resolve(__dirname, '.'),
            path.resolve(__dirname, 'node_modules')
        ]
    }

};

