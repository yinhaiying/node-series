

function isType(type,value){
    return Object.prototype.toString.call(value) === `[object ${type}]`;
}
// console.log(isType("","String"))
// console.log(isType([],"Array"))
// console.log(isType(false,"Boolean"))


// 能不能将方法细分 isType 变成isArray,isString,
// 然后再去传具体的值

// function isType(type){
//     return function(value){
//        return Object.prototype.toString.call(value) === `[object ${type}]`;
//     }
// }

// const isArray = isType("Array");
// console.log(isArray([]));

// const isString = isType("String");
// console.log(isString(""));

// const isBoolean = isType("Boolean");
// console.log(isBoolean(false));

const currify = (fn,arr=[]) => {
  let len = fn.length;
  return function (...args){
    arr = [...arr,...args];
    if(arr.length < len){
        return currify(fn,arr);  // 递归不停地产生函数，收集参数
    }else{
        return fn(...arr);
    }
  }
}
console.log(currify(isType)("Array")([]));
console.log(currify(isType)("String")(""));
console.log(currify(isType)("Boolean")(false));

