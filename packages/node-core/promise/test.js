const Promise  = require("./index.js");

let p1 = new Promise((resolve, reject) => {
    reject("失败")
});

p1.then((data) => {
    console.log("值的串透");
}).catch((err) => {
    console.log("err:",err);
});