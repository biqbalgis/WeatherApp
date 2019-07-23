const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// The path to the cesium source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
const olSource = 'node_modules/openlayers/src/ol';
module.exports = (env, options) => {
    const devtool_val = options.mode == 'development' ? 'source-map' : '';
    const file_name = 'mapview.js';
    const output_dir = !options.mode ? path.resolve(__dirname, 'dist') : '../../../src/main/webapp/resources/';
    return {
        // context: __dirname,
        entry: {main: './src/' + file_name},
        output: {
            path: output_dir,
            filename:  file_name, //path.join(output_dir,'js/georeact/', file_name),
            // Needed by Cesium for multiline strings
            sourcePrefix: ''
        },
        devtool: devtool_val,
        amd: {
            // Enable webpack-friendly use of require in cesium
            toUrlUndefined: true
        },
        node: {
            // Resolve node module use of fs
            fs: "empty"
        },
        resolve: {
            alias: {
                // Cesium module name
                cesium: path.resolve(__dirname, cesiumSource)
            }
        },
        module: {
            rules: [{
                test: /\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    // options: {
                    //     // Minify css
                    //     minimize: true
                    // }
                }]
            }, {
                test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
                use: ['url-loader']
            }, {
                // Remove pragmas
                test: /\.js$/,
                // enforce: 'pre',
                exclude: /node_modules/,
                // include: path.resolve(__dirname, cesiumSource),
                use: {loader: "babel-loader"}
            }]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'src/index.html'
            }),
            // Copy Cesium Assets, Widgets, and Workers to a static directory
            // new CopyWebpackPlugin([{from: path.join(cesiumSource, cesiumWorkers), to: path.join(output_dir,'Cesium/Workers')}]),
            // new CopyWebpackPlugin([{from: path.join(cesiumSource, 'Assets'), to: path.join(output_dir,'Cesium/Assets')}]),
            // new CopyWebpackPlugin([{from: path.join(cesiumSource, 'Widgets'), to: path.join(output_dir,'Cesium/Widgets') }]),
            // new webpack.DefinePlugin({
            //     // Define relative base path in cesium for loading assets
            //     CESIUM_BASE_URL: JSON.stringify('Cesium')
            // }),
            new CopyWebpackPlugin([{from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'}]),
            new CopyWebpackPlugin([{from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
            new CopyWebpackPlugin([{from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),
            new webpack.DefinePlugin({
                // Define relative base path in cesium for loading assets
                CESIUM_BASE_URL: JSON.stringify('')
            }),
        ],

    }
};
