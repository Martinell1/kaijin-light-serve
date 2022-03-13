// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const TerserPlugin = require("terser-webpack-plugin");
// const webpack = require('webpack') 
// const path = require('path');
// console.log(path.join(__dirname,'node_modules'));
// module.exports = {
//   mode:'production',
//   target:'node',
//   entry:{
//     index:path.join(__dirname,'app/index'),
//   },
//   output:{
//     filename:'[name].js',
//     path:path.join(__dirname,'dist')
//   },
//   module:{
//     rules:[
//       {
//         test:/\.(png|jpg|jpeg|gif)$/,
//         use:{
//           loader:'url-loader',
//           options:{
//             limit:5 * 1024,
//             outputPath:'/public/images/'
//           }
//         }
//       },
//     ]
//   },
//   plugins:[
//     new CleanWebpackPlugin(), 
//     new webpack.DefinePlugin({
//       ENV:JSON.stringify('production')
//     }),
//   ],

//   optimization: {
//     minimize: true,
//     minimizer: [
//       new TerserPlugin({
//         extractComments: false,
//       }),
//     ],
//   },
// }
const path = require('path');
const webpack = require('webpack');
const _externals = require('externals-dependencies')

module.exports = {
  mode: 'production',
    entry: {

            // 如果polyfill放在这里，打包的时候将不会被external,必须在js里require才能有效external
            // 'babel-polyfill',
            index:path.join(__dirname,'app/index'),
        
    },
    output: {
        path:path.join(__dirname,'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: [".js"]
    },
    target: 'node',
    externals: _externals(),
    context: __dirname,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
    ]
}

