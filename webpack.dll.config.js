/**
 * Created by Administrator on 2017/6/21.
 * 动态链接依赖库（dll）
 * Dll 的技术就是在第一次时将所有引入的库打包成一个 dll.js 的文件，将自己编写的内容打包为 bundle.js 文件，这样之后的打包只用处理 bundle 部分。
 * 这个文件的作用是将 vue、vue-router 以及 vuex 合并打包为一个名为 Dll.js 的静态资源包，同时生成一个 manifest.json 文件方便对 Dll.js 中的模块进行引用。
 * 要注意的是，执行 webpack 命令是默认执行该目录下名为 webpack.config.js 或者 webpackfile.js 的文件。所以需要通过 --config 指令手动指定该文件，最后加入 -p 指令将 Dll.js 压缩。
 */
var path = require('path'), webpack = require("webpack");

//运行此文件webpack ddl.config.js lib.js
//打包文件  webpack --config config/webpack.dll.config.js -p   (必须在有package.json文件夹下运行)

//配置需要单独打包的模块
var vendors = [
    "antd",
    "axios",
    "d3-format",
    "mobx",
    "mobx-react",
    "react",
    "react-dom",
    "react-grid-layout",
    "react-router-dom",
    "react-stockcharts",
    "react-router",
];

module.exports = {
    entry: {
        vendor: vendors
    },
    output: {
        path:path.join(__dirname,'./config'),
        filename: "Dll.js",
        library: "[name]"
        // library: "[name]_[hash]"
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, "manifest.json"),    //文件的输出路径,这个文件会用于后续的业务代码打包
            // name: "[name]_[hash]",  //是 dll 暴露的对象名，要跟 output.library 保持一致；
            name: "[name]",  //是 dll 暴露的对象名，要跟 output.library 保持一致；
            context: __dirname  //是解析包路径的上下文，这个要跟接下来配置的 webpack.config.js 一致。
        })
    ]
};
