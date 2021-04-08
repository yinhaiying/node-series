const Promise  = require("./index.js");

let p1 = new Promise((resolve, reject) => {
    reject("失败")
});

// p1.then((data) => {
//     console.log("值的串透");
// }).catch((err) => {
//     console.log("err:",err);
// });
console.log("............")
let p2 = Promise.resolve(111);
p2.then((data) => {console.log("data",data)})
let p3 = Promise.reject("error111");
p3.catch((error) => {
    console.log(error)
})