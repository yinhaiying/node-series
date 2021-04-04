# 高阶函数

## 什么是高阶函数？
1. 如果一个函数的参数是一个函数(回调函数也是一种高阶函数)
2. 如果一个函数返回一个函数，当前这个函数也是一个高阶函数

## 高阶函数的应用场景


### 一.扩充函数的功能
```js
function say(){
    // 这里
    console.log("say");
}
```
对于一个这样的业务函数，如果我们想要去增加他的功能，最常见的做法可能是直接在函数中去新增功能，
但是经常会存在这种情况，那就是原来的功能需要保持，同时在一些情况下需要新增功能，这时候我们通常会做一些条件判断之类的去实现。
但是，实际上我们可以使用高阶函数，通过在原型上去新增回调函数来扩充say的功能。示例：
```js

Function.prototype.beforeSay = function(callback){
  return (...args) => {
      callback();
      this(...args);
  }
}

let beforeSay = say.before(function(){
  console.log("before say")
});

beforeSay();  // 需要扩展的函数功能
say();        // 原来的函数功能
```
我们可以看到，我们需要扩展的函数功能通过`callback`函数来实现，然后返回一个新的函数去进行调用（这里必须返回一个新的函数，因为beforeSay需要被调用执行），同时我们又可以直接调用say方法。


### 二.函数柯里化
函数柯里化，又可以称之为函数颗粒化，就是把一个大的范围，变成一个小的范围。以获取参数类型为例：
```js
function isType(value,type){
    return Object.prototype.toString.call(value) === `[object ${type}]`;
}
console.log(isType("","String"))
console.log(isType([],"Array"))
console.log(isType(false,"Boolean"))
```
如上所示，我们定义了一个`isType`函数，它接收两个参数`value`和`type`，调用时我们必须同时传入这两个参数，而且还必须一一对应，
比如如果你需要判断数组类型的，那么你就必须通过`isType([],"Array")`，如果你想判断字符串类型的，你就必须通过`isType("","String")`去进行调用。如果有非常多的类型需要去调用，每个调用都是使用`isType`这个类型去判断，事实上我们可不可以细分一下了，将`isType`的判断改成`isString`和`isArray`等。实现的方式如下：
```js
function isType(type){
    return function(value){
       return Object.prototype.toString.call(value) === `[object ${type}]`;
    }
}
```
我们可以看到我们还是实现一个`isType`函数，但是它只接收一个参数了，返回的就是一个判断函数的回调函数，你传入的是`String`，它返回的就是用来判断`String`类型，你传入的是`Array`，它就是用来判断数组类型的，这样的话我们如果有非常多的数据类型需要判断，只需要调用对应的函数即可，如下所示：
```js
// 判断数组的方法
const isArray = isType("Array");
console.log(isArray([]));
// 判断字符串的方法
const isString = isType("String");
console.log(isString(""));
// 判断boolean的方法
const isBoolean = isType("Boolean");
console.log(isBoolean(false));
```
上面这种实现其实就是函数的颗粒话，将大范围的功能函数，颗粒化成小范围的功能函数。但是事实上是有这种通用的颗粒化函数的转化的。那就是函数的`currify`。
```js
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
```


### 三.通过回调函数解决异步并发问题
在前端开发中，我们经常需要同时发送多个异步请求，但是我们通常都不知道什么时候会结束，这时候通常会开一个计时器，判断所有的异步任务都执行完了，然后调用回调函数。
```js

let index = 0;  // 计时器
const cb = () => {    // 回调函数
  index++;
  if(index === 2){
      console.log("nums:",nums)
  }
}
fs.readFile("./1.txt","utf-8",function(err,data){
    console.log("1",data);
    nums[1] = data;
    cb();// 每个异步任务都执行回调函数
})

fs.readFile("./2.txt", "utf-8", function (err, data) {
    console.log("2:",data)
    nums[2] = data;
    cb();// 每个异步任务都执行回调函数
})
```
如上所示，我们通过在每个异步任务中都执行回调函数，然后在回调函数中开计时器，如果等于异步任务个数，表示都执行完毕了。
但是，上面的这种方式有个缺点，那就是如果有非常多不同的异步任务，那么我们需要定义非常多的变量和回调函数。因此，我们可以将其封装一下：
```js
function after(times,callback){
    return function(){
        times--;
        if(times === 0){
            callback();
        }
    }
}

let cb = after(2,function(){
    console.log(school)
})
```
如上所示，我们将`index`传入进去，然后传入你每次定义的回调函数即可。这样的话，你有多少类型的异步任务，你就执行多少次`after`函数即可。
