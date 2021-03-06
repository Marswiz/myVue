// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const config = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'myVue.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [{
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    devtool: 'source-map',
};

module.exports = config;