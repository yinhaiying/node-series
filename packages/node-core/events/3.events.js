// const EventEmitter = require("events");
const EventEmitter = require("./events.js");
const util = require("util"); // util.promisify/util.inherts
const event = new EventEmitter();
function Student() {}
util.inherits(Student, EventEmitter);  // 这里的继承只是原型链上方法的继承。没有继承属性


// 发布订阅

let student = new Student();


// student.on("study",() => {
//     console.log("学习数学")
// })
// student.on("study",() => {
//     console.log("学习语文")
// })
// student.on("study",() => {
//     console.log("学习英语");
// })

// 取消订阅
// student.off("study",() => {
//     console.log("学习英语");
// })
student.once("study",() => {
    console.log("学习数学")
})
student.once("study",() => {
    console.log("学习语文")
})
student.once("study",() => {
    console.log("学习英语");
})

student.emit("study");
student.emit("study");
