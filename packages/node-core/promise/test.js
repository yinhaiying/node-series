const Promise  = require("./index.js");

let p1 = new Promise((resolve, reject) => {
    reject("失败")
})
p1.then().then().then((data) => {
    console.log("值的串透")
},(err) => {
    console.log("失败的值的穿透:",err)
})