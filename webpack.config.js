const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development', // или 'production' для финальной версии
    entry: './src/index.js', // Точка входа
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true, // Очищает dist при каждом билде
    },
    devServer: {
        static: './dist',
        hot: true, // Включаем горячую перезагрузку
        port: 3000
    },
    module: {
    rules: [
        {
        test: /\.js$/, // Обработка JS
        use: 'babel-loader',
        exclude: /node_modules/
        },
        {
        test: /\.css$/, // Обработка CSS
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        },
        {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Обработка изображений
        type: 'asset/resource'
        },
        {
        test: /\.(woff|woff2|eot|ttf|otf)$/i, // Обработка шрифтов
        type: 'asset/resource'
        }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
};
