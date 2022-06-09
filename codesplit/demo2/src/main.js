import {sum} from './math'
// import count from "./count"
console.log("hello app")
console.log(sum(1,2,3))

document.getElementById('btn').onclick = function (){
    // console.log(count(2,1));
    // import动态导入，将动画导入的文件代码分割 （拆分成单独模块） 在需要时自动加载
    import ('./count')
    .then((res) =>{
        console.log("yes",res.default(2,1));
    })
    .catch(()=>{
    console.log("no")
    })
}