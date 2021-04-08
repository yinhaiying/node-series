const RESOLVED = "resolved";
const REJECTED = "rejected";
const PENDING = "pending";


const resolvePromise = (promise2, x, resolve, reject) => {
  if (promise2 === x) {
      return reject(new TypeError("Chaining cycle detected for promise #<Promise>"))
  }
  // 后续的条件要严格判断，保证能够和别的库兼容
  if((typeof x === "object" && x !== null) || typeof x === "function"){
    // 如果是对象或者是函数，才可能是一个promise。
    try {
        // 如果是promise那么一定有then方法
        let then = x.then;
        if(typeof then === "function"){  // 只能认为是一个promise
          then.call(x,(y) => {
            resolvePromise(promise2,y,resolve,reject)
          },(error) => {
            reject(error);
          });
        }else{  // {then:"hello"}
          resolve(x);
        }
    } catch (error) {
        reject(error);
    }
  }else{
      resolve(x);  // 普通值
  }

}
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
        // 处理onfulfilled和onrejected的情况
        if (typeof onFulfilled !== "function") {
            onFulfilled = function onFulfilled(value) {
                return value;
            }
        }
        if (typeof onRejected !== "function") {
            onRejected = function onRejected(reason) {
                throw reason;
            }
        }
        let promise2 = new Promise((resolve,reject) => {
            if (this.status === RESOLVED) {
                setTimeout(() => {
                    let x = onFulfilled(this.value);
                    resolvePromise(promise2, x, resolve, reject);
                })
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    let x = onRejected(this.reason);
                    resolvePromise(promise2, x, resolve, reject);
                })
            }
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    })
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    })
                })
            }
        })
      return promise2
    }
}


module.exports = Promise;


