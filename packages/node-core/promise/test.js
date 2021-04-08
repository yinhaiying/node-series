

Promise.resolve("123").finally((data) => {
    return new Promise((resolve,reject) => {
        reject("失败了，失败了");
    })
}).then((data)=>{
    console.log("成功",data);
}).catch((error) => {
    console.log("失败",error);
})