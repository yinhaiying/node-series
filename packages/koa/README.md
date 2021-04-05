# koa

koa是对http的一个封装，实现了一个Node框架  => 根据这个框架去实现自己的mvc框架
由于每个人对koa的方式都不太一样，无法做到约定性，因此出现了egg.js。

lib
* application.js  创建应用
* context 上下文
* request koa中自己实现的request对象
* response koa中自己实现的response对象


## koa的基本使用
```js
const Koa = require("koa");
const app = new Koa();
app.use(async (ctx,next) => {
    throw new Error("监听错误");
    ctx.body = "hello,world";
})
app.on("error",(err) => {
    console.log(err);
})
app.listen(3000,() => {
    console.log(`server is running in port 3000`);
})
```

## 实现一个简易的Koa

根据上面的使用，我们知道koa实际上是一个类，这个类有`use`,`listen`方法，同时他还可以使用`on`监听`error`事件，
说明它继承了`events`类。

### 步骤一：实现基本的逻辑
```js
const EventEmitter = require("events");
const http = require("http");
class Application extends EventEmitter {
    use(callback) {
        this.callback = callback;
    }
    // 每个请求
    handleRequest(req,res) {
      this.callback(req,res);
    }
    listen(...args) {
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
    }

}
```

### 步骤二：属性的扩展ctx.request
`context`是koa自己封装的上下文对象，整合了自己实现的request和response，以及原生的req和res。
以url为例，在ctx中存在原生的url，即
```js
console.log(ctx.req.url);
console.log(ctx.request.req.url);
```
也存在封装后的url:
```js
console.log(ctx.request.url);
console.log(ctx.url); // ctx.url实际上是从ctx.request.url
```
我们可以发现无论是`context`还是`request`还是`response`都是一个对象，封装了一些属性而已。

```js
    createContext(req,res){
        // 每次请求都创建全新的上下文，防止多个请求之间共享数据
        let context = Object.create(this.context);
        let request = Object.create(this.request);
        let response = Object.create(this.response);
        // 上下文中有一个req属性是原生的req属性
        context.req = req;
        // 上下文中有一个request对象，是自己封装的对象
        context.request = request;
        // 自己封装的request对象上有req属性
        context.request.req = req;
        return context;
    }
```
如上所示，我们在`context`上新增了`req`属性，新增了`request`属性等。这样的话，我们如果再在`request`身上绑定其他属性，
那么都可以通过`ctx.request`获取到。
```js
const request = {
  get url(){
      // 属性访问器  ctx.request.url   
    //   console.log(this)  // 这里的this是ctx.request
      return this.req.url;
  },
  get path(){
      return url.parse(this.req.url).pathname;
  },
  get query(){
    console.log("req.url11111:",this.req.url)
    return url.parse(this.req.url).query;
  }
}
```
### 步骤三：context的实现原理

#### 实现ctx.req
我们经常使用`ctx.url`这种直接从`context`中去获取`url`，而不是通过`ctx.request.url`去获取。
实际上内部只是做了一次代理罢了。内部还是需要通过`ctx.request.xxx`去进行获取
```js
const context = {
   get url(){
       // ctx.url
       return this.request.url;
   },
   get path(){
       return this.request.path;
   },
   get query(){
       return this.request.query;
   }
}
```
进一步优化，我们可以发现最终`ctx`身上的属性，都是通过`this.request.xxx`来进行获取，如果需要绑定的属性比较多，那么重复度就比较高，因此我们直接实现这个拦截方法。
```js
const context = {}
function defineGetter(target,key){
  context.__defineGetter__(key,function(){
      return this[target][key];
  })
}
defineGetter("request","url");  // ctx.url => ctx.request.url
defineGetter("request","path");  
defineGetter("request","query");  

```

#### 实现ctx.res
对于`response`我们经常需要处理它的响应，比如`ctx.body="111"`，同时我们需要能够读取`ctx.body`。
```js
const response = {
  _body:"",
  get body(){
    return this._body;
  },
  set body(newBody){  // ctx.body = newBody;
    console.log("newBody:",newBody)
    this._body = newBody;
  }
}
module.exports = response;
```
1. 实现读取`ctx.body`
```js
function defineGetter(target,key){
  context.__defineGetter__(key,function(){
      return this[target][key];
  })
}
defineGetter("response","body");  
```
2. 实现设置`ctx.body`
```js
function defineSetter(target, key) {
    context.__defineSetter__(key, function (value) {
        this[target][key] = value;
    })
}
defineSetter("response", "body");
```