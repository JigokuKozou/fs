const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'public');

// Объект ключ - значение из файла .env
const env = dotenv.config().parsed;

module.exports = {
    entry: path.resolve(srcPath, 'index.tsx'),
    output: {
        path: path.resolve(distPath),
        filename: 'bundle.[contenthash].js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.css'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(srcPath, 'index.html'),
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new webpack.EnvironmentPlugin(env),
        new CleanWebpackPlugin(),
    ],
    devServer: {
        watchFiles: distPath,
        port: 9000,
        hot: true,
    },
};