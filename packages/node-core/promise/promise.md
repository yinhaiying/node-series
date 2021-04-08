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

## promise的then方法
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

### 1.then的链式调用
1. promise成功和失败的回调(onfulfilled和onrejected)的返回值，可以传递给外层的下一个then
2. 回调的返回值有几种情况：
   * 普通值(传递到下一次的成功中，无论是成功的返回值还是失败的返回值，只要返回普通值就传递到外面的下一个then的成功回调中)
   * 返回一个promise（会根据promise的状态来确定成功和失败）
   * 出错(传递到下一个的失败，如果离自己最近的then没有处理失败(没有定义失败的回调函数)，那么会传递到下一个的失败回调中去)
3. promise可以链式调用是因为每次执行回调函数返回的都是一个新的promise。为什么返回的是一个新的promise，这是因为promise一旦成功，他的状态就不会改变了，而我们的回掉函数可能返回成功也可能返回失败的结果。

### 2.promise的返回值
promise实现链式调用，因此then返回的一定是另外一个promise
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

### 3.then返回值的处理resolvePromise方法
`rsolvePromise`的核心就是处理promise的返回值，根据不同的返回值做不同的处理。
1. 如果typeof x不是object或者function,说明返回的就是普通值。那么直接resolve
2. 如果typeof x是object或者function，那么存在两种情况。
   * 看x上是否有then属性，如果then属性不是一个函数，说明返回的是类似于{then:123}这种普通对象。直接resolve即可。
   * 如果x上有then属性，而且then属性是一个函数，那么就认为它是一个promise，那么我们需要执行这个promise，拿到这个promise的值，再进行resolve或者reject。
```js
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
            resolve(y)
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
```

### 4.then值的穿透
在promiseA+规范中，then的两个参数`onfulfilled和onrejected`两个参数都不是必填的。所有的值可以进行穿透，只需要在最后能够被捕获就行了。
```js
let p1 = new Promise((resolve, reject) => {
    resolve(1)
})
p1.then()  // 没有onfulfilled和onrejected
  .then()  // 没有onfulfilled和onrejected
  .then((data) => {
    console.log("值的串透")
})
```
我们可以看到多个`then`方法中都没有`onfulfilled和onrejected`，只有最后一个`then`进行了处理。
因此，我们调用then的方法时，也需要进行处理。判断onfulfilled是否存在。
```js
    then(onFulfilled,onRejected){
        // onFulfilled和onRejected未传递的情况
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
    }

```

## promise的catch方法
promise的`catch`方法实际上就是`onFulfilled`的语法糖，我们可以看下我们经常的使用方式：
```js
let p1 = new Promise((resolve, reject) => {
    reject("失败")
});

p1.then((data) => {
    console.log("值的串透");
}).catch((err) => {
    console.log("err:",err);
});
```
实际上我们可以写成这样：
```js
p1.then((data) => {
    console.log("值的串透");
}).then(null,(err) => {
    console.log("err:",err);
});
```
我们可以看到`catch`实际上就是没有成功的`then`的一种情况，因此我们可以这样定义catch.
```js
    catch(errorCallback){
        this.then(null,errorCallback);
    }
```
## Promise的reaolve和reject静态方法
```js
    static resolve(value) {
      return new Promise((resolve,reject) => {
          resolve(value);
      })
    }
    static reject(reason){
        return new Promise((resolve,reject) => {
            reject(reason);
        })
    }
```
但是这里存在一个问题，那就是如果resolve中又是一个promise，那么它返回的就会是一个promise而不是promise的then执行的值。因此，我们需要判断一下`resolve(value)`是否是一个`promise`。
```js
    let resolve = (value) => {
        if(value instanceof Promise){
            return value.then(resolve,reject);// 递归解析resolve中的参数，直到是一个普通值
        }
        if(this.status === PENDING){
            this.value = value;
            this.status = RESOLVED;
            this.onResolvedCallbacks.forEach((fn) => fn());
        }
    };
```
resolve和reject的区别是resolve会等待promise的then的执行结果，直到是一个普通值为止，而reject是不会等待的。
