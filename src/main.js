import "./css/index.css"
import "./less/index.less"
import "./sass/index.sass"
import "./sass/index.scss"
import "./stylus/index.styl"
import "./css/iconfont.css"
// 完整引入
import "core-js"
// 按需加载
// import 'core-js/es/promise'





// // 配置热加载
// if(module.hot){
//     // 判断是否支持热模块替换功能
//     module.hot.access('')// 接受一个文件
//     // module.hot.access('')// 接受一个文件
// }

// 实现按需加载 配合代码分割生成多个文件
// document.getElementBy('btn').onclick = function(){
//     eslint不能识别动态导入需要 需要额外追加配置
//    /*webpackChunkName: 'math'*/ webpack命名 魔法名
//     import (/*webpackChunkName: 'math'*/"./js/math").then(({mul}=>{
//         console.log(mul(3,3))
//     }))
// }

new Promise((resolve) =>{
    setTimeout(() => {
        resolve()
    },100)
})