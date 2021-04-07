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


// 1. promise调用then的方法时,可能promise的状态仍然处于pengdign状态。因此两个回调函数都不会执行
// 2. 发布订阅模式，如果状态是pending状态，我们需要将成功和失败的回调保存起来。稍后调用resolve或者reject再执行。
// 3. 由于promise可以多次调用回调函数，而且都会被执行。因此，我们需要将成功的回调函数放在一起，失败的放到一起，然后再根据
//    状态进行执行。

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