# Promsie的实现

## promise的初始化
1. status定义三种状态
2. value和reason分别用于保存成功和失败时的值
3. executor立即执行
```js
class Promise{
    constructor(executor){
        this.status = PENDING;
        this.value = undefined;  // 成功的结果
        this.reason = undefined; // 失败的原因
        let resolve = (value) => {
            if(this.status === PENDING){
                this.value = value;
                this.status = RESOLVED;
            }
        };
        let reject = (reason) => {
            if(this.status === PENDING){
                this.reason = reason;
                this.status = REJECTED;
            }
        }
        try{
            executor(resolve, reject)
        }catch(error){
            reject(error);
        }
    }
}
```

## promsie的then方法
 1. promise调用then的方法时,可能promise的状态仍然处于pengdign状态。因此两个回调函数都不会执行
2. 发布订阅模式，如果状态是pending状态，我们需要将成功和失败的回调保存起来。稍后调用resolve或者reject再执行。
3. 由于promise可以多次调用回调函数，而且都会被执行。因此，我们需要将成功的回调函数放在一起，失败的放到一起，然后再根据状态进行执行。
```js
const RESOLVED = "resolved";
const REJECTED = "rejected";
const PENDING = "pending";

class Promise{
    constructor(executor){
        this.status = PENDING;
        this.value = undefined;  // 成功的结果
        this.reason = undefined; // 失败的原因

        this.onResolvedCallbacks = []; // 用来存放成功的回调
        this.onRejectedCallbacks = [];  // 用来存放失败的回调



        let resolve = (value) => {
            if(this.status === PENDING){
                this.value = value;
                this.status = RESOLVED;
                this.onResolvedCallbacks.forEach((fn) => fn());
            }
        };
        let reject = (reason) => {
            if(this.status === PENDING){
                this.reason = reason;
                this.status = REJECTED;
                this.onRejectedCallbacks.forEach((fn) => fn())
            }
        }
        try{
            executor(resolve, reject)
        }catch(error){
            reject(error);
        }
    }
    then(onFulfilled,onRejected){
      if(this.status === RESOLVED){
          onFulfilled(this.value);
      }
      if(this.status === REJECTED){
          console.log("失败原因：",this.reason)
          onRejected(this.reason);
      }
      if(this.status === PENDING){
          this.onResolvedCallbacks.push(() => {
              onFulfilled(this.value);
          });
          this.onRejectedCallbacks.push(() => {
              onRejected(this.reason);
          })
      }
    }
}

let p = new Promise((resolve,reject) => {
    setTimeout(() => {
        reject("失败")
    },1000)
});




p.then((result) => {
    console.log('成功时的回调1')
},(reason) => {
    console.log("失败时的回调1")
})

p.then((result) => {
    console.log('成功时的回调2')
}, (reason) => {
    console.log("失败时的回调2")
})


```

## then的链式调用
1. promise成功和失败的回调(onfulfilled和onrejected)的返回值，可以传递给外层的下一个then
2. 回调的返回值有几种情况：
   * 普通值(传递到下一次的成功中，无论是成功的返回值还是失败的返回值，只要返回普通值就传递到外面的下一个then的成功回调中)
   * 返回一个promise（会根据promise的状态来确定成功和失败）
   * 出错(传递到下一个的失败，如果离自己最近的then没有处理失败(没有定义失败的回调函数)，那么会传递到下一个的失败回调中去)
3. promise可以链式调用是因为每次执行回调函数返回的都是一个新的promise。为什么返回的是一个新的promise，这是因为promise一旦成功，他的状态就不会改变了，而我们的回掉函数可能返回成功也可能返回失败的结果。