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

### promise实现链式调用，因此then返回的一定是另外一个promise
这里我们先初步实现一个promsise的then的返回。
```js
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
        // 为了实现链式调用，掉完then之后返回一个新的promise
        let promise2 = new Promise((resolve, reject) => {})
        return promise2;
    }
```
但是我们可以发现，我们这种实现忽略了一个问题，那就是链式调用的传值问题。我们需要拿到then的值，然后传递给下一个then，实际上就是需要调用返回的promise进行resolve()。因此，我们每次都需要拿到then后返回的结果，然后传递给需要返回的promise对象进行resolve。s
```js
    then(onFulfilled,onRejected){
      let x;
      if(this.status === RESOLVED){
          x = onFulfilled(this.value);
      }
      if(this.status === REJECTED){
          x = onRejected(this.reason);
      }
      if(this.status === PENDING){
          this.onResolvedCallbacks.push(() => {
              x = onFulfilled(this.value);
          });
          this.onRejectedCallbacks.push(() => {
              x = onRejected(this.reason);
          })
      }
        // 为了实现链式调用，掉完then之后返回一个新的promise
        let promise2 = new Promise((resolve, reject) => {
            resolve(x);
        })
        return promise2;
    }
```
上面的写法可以进一步优化，由于new Promise的executor可以立即执行，因此我们可以将代码都放到返回的promise中去。
```js
    then(onFulfilled,onRejected){
      return new Promise((resolve,reject) => {
        if (this.status === RESOLVED) {
            let x = onFulfilled(this.value);
            resolve(x);
        }
        if (this.status === REJECTED) {
            let x = onRejected(this.reason);
            resolve(x);
        }
        if (this.status === PENDING) {
            this.onResolvedCallbacks.push(() => {
                let x = onFulfilled(this.value);
                resolve(x);
            });
            this.onRejectedCallbacks.push(() => {
                let x = onRejected(this.reason);
                resolve(x);
            })
        }
      })
    }
```
上面的处理都是基于x是一个普通值，但是很多时候我们可能传递一个`promise`，示例：
```js
let p1 = new Promise((resolve,reject) => {
    setTimeout(()=>{
        console.log("hello");
        resolve(100);
    },2000)
   
})
// p2的then方法返回一个promsie
let p2 = p1.then((data) => {
    return new Promise((resolve,reject) => {
        resolve("返回一个promise")
    })
})
p2.then((data2) => {
    console.log("data2:",data2)
})
```
如上代码所示，p2的then方法返回一个promise，这样的话在then中我们得到的`data2`是一个promise，而不是我们想要的那个值。因此，我们需要根据x的值(是普通值，是promsie，是报错来决定如何处理返回值)。
我们定义一个`resolvePromise(promise2,x,resolve,reject)`专门用来处理这个结果。
```js
    then(onFulfilled,onRejected){
        let promise2 = new Promise((resolve,reject) => {
            if (this.status === RESOLVED) {
                let x = onFulfilled(this.value);
                resolvePromise(promise2,x,resolve,reject);
            }
            if (this.status === REJECTED) {
                let x = onRejected(this.reason);
                resolvePromise(promise2, x, resolve, reject);
            }
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    let x = onFulfilled(this.value);
                    resolvePromise(promise2, x, resolve, reject);
                });
                this.onRejectedCallbacks.push(() => {
                    let x = onRejected(this.reason);
                    resolvePromise(promise2, x, resolve, reject);
                })
            }
        })
```
但是我们可以发现，我们的`resolvePromise`函数中用到了它自身`promise2`，但是在new 的时候我们还拿不到这个实例的，因此我们需要考虑使用异步的方式，让这个函数异步执行。
```js
    then(onFulfilled,onRejected){
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
```
如上所示，我们将所有值的获取都放到异步中进行了，这样再调用`resolvePromise`时就可以拿到返回的自身promise了。