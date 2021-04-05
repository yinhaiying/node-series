# node核心


## node基础概念
### 一.node是什么?
Node.js是一个基于chrome v8引擎的Javascript运行环境(runtime)，Node不是一门语言，是js在后端的运行时，并且不包括js全集，因为在服务端中不包括BOM和DOM,Node也提供了一些新的模块，比如http,fs等模块。
Node.js使用了事件驱动（事件驱动可以理解为异步），非阻塞式I/O的模型，使其轻量又高效。

### 二。Node解决了哪些问题？
1. Node.js解决了高并发问题（通过异步事件机制）。
所谓的高并发是指在同一时间内并访问服务器。
在传统的java等开发语言中，都使用多线程，也就是说在线程池中放入多个线程，比如10个，如果同时来了10个请求，那么就需要10个线程进行处理，但是如果有更多的请求那就需要等其他线程执行完毕，或者在线程池中开辟更多的线程，这就是多线程带来的问题。
像node.js使用的是单线程，只有一个主线程，有一个请求来了，异步地去进行处理，主线程继续执行其他的，等待处理完毕了，通过事件的机制告诉主线程即可。不会带来阻塞问题。

2. Node.js适合于I/O密集型，比如文件操作，网络操作，数据库操作。相对地有cpu密集，cpu密集指的是逻辑运算，压缩，解压，加密，解密等。
由于node.js的异步和事件机制，因此对于一些文件操作，比如文件读写，可以通过异步地方式完成，然后通过回调返回结果即可。但是对于cpu密集型的，需要大量计算处理的，如果它的其中一个任务占据了cpu，虽然那个任务在异步地执行，但是它占据了很多cpu，导致其他任务分配不到资源，无法执行，最终其他任务队列的任务都不响应了。

### 三.Node是单线程的
node是基于js的，而js是单线程的，因此node也是单线程的。单线程的特点是：
1. 节约了内存(不需要开辟很多线程去处理请求)，并且不需要切换执行上下文(不需要进行线程切换)
比如一个文件需要a,b,c进行处理，可能a处理一会，保存上下文，然后交给b处理，b处理一会保存上下文交给c处理。这种上下文保存或者线程切换，在单线程中不需要进行考虑。
2. 单线程不需要管锁的问题
多线程的锁的问题：当多个线程同时对某一个文件进行处理时，为了避免冲突会进行加锁，比如a处理时那么就加锁，处理完毕之后才释放，b进行处理也加锁，处理完毕释放，主要是为了避免冲突。而单线程只有一个线程，不需要这种冲突，因此不需要管锁的问题。

### 四.同步异步和阻塞和非阻塞
**阻塞和非阻塞**：针对的是调用方的状态，比如我调用了一个方法之后我是继续往下执行了还是需要在此等待，如果是继续往下执行那么就是非阻塞的，如果需要等待，那么就是阻塞的。
**同步和异步**：针对地是被调用方，也就是刚刚那个方法，这个方法它是同步地还是异步地，是一开始就确定好的。

**异步非阻塞**：表示调用地方法或者执行的任务是异步地，我不需要等待这个方法执行完毕。


### 五.Node中的Event Loop
node中的event loop和浏览器中的event loop的区别?
1. 浏览器的event loop是借助了浏览器的多线程性，去异步地实现非阻塞。而node.js的event loop是借助了现代操作系统的多线程性去异步地实现非阻塞。
2. 浏览器的event loop中通常只有两个队列宏任务队列和微任务队列。而node.js的event loop有6个任务队列，不同的任务放到不同的队列中，比如setTimeout和setInterval放到timer队列中。setImmediate放到callbacks任务队列中，nextTick是每个队列执行完毕之后执行。最常用的三个任务队列是poll(轮询阶段:用于询问操作系统是否有完成的回调，比如各种I/O操作),check阶段执行setImmediate等；timer阶段是定时器的一些任务的执行。

3. nextTick不属于任何的阶段。它是在每个阶段的最后执行
4. 微任务队列追加在process.nextTick队列的后面，也属于本轮循环。


node中的event loop是node.js处理异步非阻塞I/O的机制。javascript是单线程的，有了event loop的加持，node.js才可以非阻塞地执行I/O操作，把这些操作尽量都转移给操作系统来执行。我们知道大部分现代操作系统都是多线程的，这些操作系统可以在后台执行多个操作。当某个操作结束后，操作系统就会通知node.js，然后node.js就会把对应的回调函数添加到poll(轮询)队列，最终这些回调函数会被执行。

### 宏任务和微任务

**宏任务**：script/ui/setTimeout/setInterval/requestFrameAnimation/setImmediate
**微任务**：promise/nextTick/MutationsObserver



## node核心api
node的核心api都在global身上(类似于浏览器的window身上)
### process
process的常见的属性如下所示:
```js
[
  'version',
  'versions',
  'arch',
  'platform',
  '_events',
  'domain',
  'kill',
  'exit',
  'assert',
  'stdout',
  'stdin',
  'cwd',
  'env',
  'title',
  'argv',
  ...
]
```
* process.platform用于获取当前执行的系统环境比如win32
```js
console.log(process.platform) // win32
```
* process.argv
`process.argv`的第一个是执行的node.exe的地址，第二个参数是node当前执行的文件，这两个参数都不太会使用，
通常是用于解析用户自己传递的参数。
```js
[
  'C:\\Program Files\\nodejs\\node.exe',
  'D:\\my-program\\node-series\\packages\\node-core\\global\\1.process.js'
]
```
比如，在命令行中执行`node 1.process.js --port 3000 --color red --config a.js`，
那么拿到的参数如下所示：
```js
[
  'C:\\Program Files\\nodejs\\node.exe',
  'D:\\my-program\\node-series\\packages\\node-core\\global\\1.process.js',
  '--port',
  '3000',
  '--color',
  'red',
  '--config',
  'a.js'
]
```
这时候我们就能够拿到我们想要的参数了，以--开头的表示key值，后面的表示value值
```js
let obj = {};
args.forEach((item,index) => {
    if(item.startsWith("--")){
        obj[item.slice(2)] = args[index+1];
    }
})
console.log(obj)  // { port: '3000', color: 'red', config: 'a.js' }
```

* process.cwd (current working directory当前用户工作目录)
当用户在哪里执行node命令时，就去哪里找配置文件，比如webpack进行命令查找时，会先从当前目录下进行查找,内部实现就是通过process.cwd。这个用户可以进行切换(常见的cd操作)，相对应的有__dirname，这个指的是当前文件所在的目录，是无法手动修改的。



* process.env 环境变量
可以根据环境变量实现不同功能，比如常见的根据环境变量，设置开发环境和正式环境时执行不同的命令。
* process.nextTick
nextTick是node中自己实现的微任务

## core模块

### fs模块


### vm模块

虚拟机模块（沙箱）干净的环境，测试用例。
内部一般情况下，操作的都是字符串逻辑，如何让一个字符串`console.log(1)`，来当做js运行了。
1. eval(`console.log(a`);
2. new Function(`console.log(a)`);  // 可以使用new Function来创建一个沙箱环境，让字符串执行

### 模板引擎的实现原理 with语法+字符串拼接+new Function来实现

模板引擎的实现是读取模板文件`template.html`，然后用变量替换模板中的语法。
1. 字符串拼接。一步一步地进行拼接，拼接成可执行的js字符串。({{name}}替换成${name})
2. new Function用于将字符串变成可执行的代码。
3. with提供作用域，比如传入一个Obj，那么拿到的就都是obj的变量。

在node中提供了vm模块，这个模块可以用于创建沙箱环境，替代new Function的实现。
```js
const code = 'x += 40; var y = 17;';
const context = {
    x: 2
};
vm.createContext(context);
// `x` and `y` 是上下文中的全局变量。
// 最初，x 的值为 2，因为这是 context.x 的值。
vm.runInContext(code, context);

console.log(context.x);  // 42
console.log(context.y);  //17
```
vm会指定上下文，只能在指定的上下文中查找变量，不会去进行全局查找。


### 分析node源码，了解require的原理
1. 会默认调用require语法
2. require方法定义在每个模块的原型身上。
```js
Module.prototype.require = function(id) {
  validateString(id, 'id');
  if (id === '') {
    throw new ERR_INVALID_ARG_VALUE('id', id,
                                    'must be a non-empty string');
  }
  requireDepth++;
  try {
    return Module._load(id, this, /* isMain */ false);
  } finally {
    requireDepth--;
  }
};
```
3. 调用模块的加载方法`Module._load`，这个加载方法最终返回的是`module.exports`;
4. `Module._resolveFilename` 解析文件名，将文件名变成觉得路径，默认会尝试添加.js，.json等后缀。在这个过程中有缓存机制，
如果有缓存就不再重新进行加载了。
5. new Module创建模块(对象)，这个对象包括id,exports,filename等。然后把模块缓存起来。
```js
const module = cachedModule || new Module(filename, parent);
```
到目前为止，还是模块的创建。
6. `tryLoadModule`尝试加载模块。`module.load(filename)`;
7. `module.paths`定义第三方模块的查找路径。
```js
this.paths = Module._nodeModulePaths(path.dirname(filename));
```
8.获取当前模块的扩展名 根据扩展名调用对应的方法。
```js
Module._extensions[extension](this, filename);
```
`Module._extensions`有`.js`,`.json`和`.node`三种处理方式，不同的扩展名调用不同的加载方式。
9. 获取文件的内容。通过fs.readFileSync获取文件内容。
10. 调用module._compile方法。
11. 将用户的内容，包裹到一个函数中。
```js
let wrap = function(script) {
  return Module.wrapper[0] + script + Module.wrapper[1];
};

const wrapper = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
];
```
12. 通过vm来执行这个字符串函数。


### 实现commonjs规范的require方法。

**步骤一：获取绝对路径。**
```js
Module._load = function (filePath) {
    let filename = Module._resolveFilename(filePath);
}
```
因此核心是实现`_resolveFilename`。读取文件时必须使用绝对路径，因此我们首先需要找到这个文件。如果直接找到文件，那么就不需要处理；如果没找到，尝试添加后缀进行查找。
```js
Module._resolveFilename = function(filePath){
   let absFilePath = path.resolve(__dirname,filePath)
   let isFileExists = fs.existsSync(absFilePath);
   if(isFileExists){
       return absFilePath;
   }
   // 尝试添加后缀
   let keys = Object.keys(Module._extensiton);
   for(let i = 0;i < keys.length;i++ ){
       let currentPath = absFilePath + keys[i];
       if(fs.existsSync(currentPath)){
            return currentPath
       }
   }
}

```
**步骤二：创建模块。**
```js
function Module(id){
  this.id = id;
  this.exports = {}
}
Module._load = function (filePath) {
    let filename = Module._resolveFilename(filePath);
    let module = new Module(filename)
}
```
创建模块，所谓的模块就是一个对象。
**步骤三：加载模块。**
加载模块，是通过模块实例的`load`方法实现。
```js
Module._load = function (filePath) {
    let filename = Module._resolveFilename(filePath);
    let module = new Module(filename)
    module.load();
}
```
因此，核心是实现这个`load`方法。
```js
Module.prototype.load = function(filename){
    // 获取文件的后缀来进行加载
    let extname = path.extname(filename);
    Module._extensiton[extname](this);  // 根据对象的后缀名进行加载。
}
```
`load`的方法的实现是根据不同的后缀名，调用不同的处理策略。所谓的处理策略就是使用fs读取文件内容，然后进行处理。
我们以简单的`json`格式处理为例：
```js
Module._extensiton = {
    ".js": function (module) {
       console.log("js:",module)
    },
    ".json": function (module) {
        // 读取文件
        let content = fs.readFileSync(module.id);
        // 将读取的字符串对象，parse后赋值给module.exports。
        module.exports = JSON.parse(content);
    }
}
```
如上所示，对`json`格式的处理实际上就是读取文件内容(得到的是一个字符串)，然后通过解析成一个对象，最后赋值给`module`实例身上的
`exports`属性。
最终返回`module.exports`。
```js
Module.cache = {};
Module._load = function (filePath) {
    let filename = Module._resolveFilename(filePath);
    // 处理缓存
    if(Module.cache[filename]){
        return Module.cache[filename].exports;
    }
    let module = new Module(filename);
    Module.cache[filename] = module;
    module.load(filename);
    return module.exports;
}
```
**步骤四：处理js的策略。**
js代码读取后不能像`json`格式的数据一样，直接通过`JSON.parse`来执行。而是需要通过类似于eval()或者`new Function`这种能够执行字符串的方式来处理。他的实现就是`加壳`，在外面包一层函数。
1. **进行包裹，转化成函数形式的字符串**
```js
Module.wrap = function(script){
    const wrapper = [
        '(function (exports, require, module, __filename, __dirname) { ',
        script,
        '\n});'
    ];
    return wrapper.join("");
}
```
2. 通过`vm.runInThisContext(fnStr)`转化成可执行的函数;
```js
    ".js": function (module) {
       let content = fs.readFileSync(module.id, "utf-8");
       let fnStr = Module.wrap(content);
       let fn = vm.runInThisContext(fnStr);
       let exports = module.exports;
       let require = myRequire;
       let __filename = module.id;
       let __dirname = path.dirname(module.id);
       fn.call(exports,exports,require,module,__filename,__dirname);// 执行完这个函数之后就会自动赋值。
    },
```
**注意**：虽然exports和module.exports是同一个对象，但是我们最终导出的是module.exports，因此需要注意修改exports不会影响module.exports。只有修改exports.xxx的时候才会导致module.exports发生变化。


### events
node.js是事件驱动，它的事件机制是核心功能。node中自己实现了一个发布订阅，也就是events类

```js
const EventEmitter = require("events");
const event = new EventEmitter();  // 通过这个EventEmitter类创建一个事件对象
```
但是，我们一般不会直接使用`EventEmitter`这个类来进行实例化。而是通过继承的方式来实现，这又用到一个新的模块`util`。
```js
const EventEmitter = require("events");
const util = require("util");  // util.promisify/util.inherts
const event = new EventEmitter();
util.inherits(Girl,EventEmitter)   // 
```
Girl类通过`Util`继承`EventEmitter`。

#### events模块的实现原理
```js
function EventEmitter(){
  this._events = {};
}

EventEmitter.prototype.on = function(eventName,fn){
  if(!this._events){
      this._events = {};
  }
  if(!this._events[eventName]){
      this._events[eventName] = [];
  }
  this._events[eventName].push(fn);

}

EventEmitter.prototype.once = function (eventName, fn) {
    const callback = (...args) =>{
        fn(...args);
        this.off(eventName,callback);
    }
    callback.fakeFn = fn;  // 给callback增加标识。以方便删除时找到对应的函数
    this.on(eventName,callback);
}

EventEmitter.prototype.emit = function (eventName,...args) {
    if (this._events && this._events[eventName]){
      this._events[eventName].forEach((fn,index) => {
          fn(...args);
      })
    }
}

EventEmitter.prototype.off = function (eventName, fn) {
    if(this._events[eventName]){
        let list = this._events[eventName];
        this._events[eventName] = this._events[eventName].filter((cb) => (cb !==fn) && (cb !== fn.fakeFn));
       
    }
}
```

### Buffer

#### 进制

##### 任意进制转十进制
任意进制转化成十进制，需要用当前位所在的值 * 当前进制^第几位。比如：
**二进制转十进制**
```js
let num = 1011;
let num1 = 1* 2^3 + 0 * 2^2 + 1 * 2^1 + 1 * 2^0。
```
实现的方式如下：
```js
function toTen(num,base){
    let str = num.toString();
    let sum = 0;
    for(let i = 0;i < str.length;i++){
        let item = Number(str[i]);
        sum += item * Math.pow(base,i);
    }
    return sum;
}
```
也可以使用js提供好的api，parseInt(string,base)。将字符串转化成指定的进制。

##### 十进制转任意进制
十进制转任意进制采用取余法。
也可以使用toString方法实现进制转换。toString方法可以实现将任意进制转化成任意进制。

#### node中buffer是16进制的
在node中经常需要进行文件读取，node中操作的内容默认会存储在内存中，内存中的变现形式肯定是二进制的，但是我们平常会发现读取的文件，表现形式是16进制的。


#### base64
base64只是编码转化，没有加密功能，但是base64可以传输数据，可以减少http请求（不是所有的图片都转化成base64）
base64是将3*8的规则，转换成了4*6的规则。比如:
```js
let buffer = Buffer.from("珠");
console.log(buffer); //e7 8f a0
console.log((0xe7).toString(2));
console.log((0x8f).toString(2));
console.log((0xa0).toString(2));

// 11100111 10001111 10100000  3*8的格式
// 转化成  4 *6
// 111001 111000 111110 100000
我们可以看下6位的二进制，最大可以代表多少。  00111111  = 63。也就是说它最多可以代表0~63一共64个数字。
```
接下来就将其转化成base64:
```js
let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLocaleLowerCase();
str += "0123456789";
str += "+/";

console.log(str[57]+str[56]+str[62]+str[32])  // 54+g;
```
`54+g`就是我们最终得到的base64编码。从上面可以看出base64的编码和解码都是公共的方式，因此加密程度可以忽略不计。
base64一般用于图片转换，但是只适合于小图标，因为经过base64转化后会变大。比如刚刚的`珠`经过转化后变成`54+g`，从
3个字节变成了4个字节。如果图片比较大，转化成base64之后也会变大，因此不合适。

#### 前端操作二进制——Blob和FileReader
在前端中，我们一般很少去操作二进制，但是我们有些文件类型是Blob就是二进制文件。

1. input  type file file类型就是继承于Blob。
2. 前端实现下载，通常是需要将字符串包装成二进制类型
```js
    let str = `<div></div>`;
    const blob = new Blob([str],{
        type:"text/html"
    });
    const a = document.createElement("a");
    a.setAttribute("download","index.html");
    a.href = URL.createObjectURL(blob);
    a.click();
```
3. 前端实现预览功能，读取二进制内容 fileReader。
```js
file.addEventListener("change",(e) => {
    let file = e.target.files[0];  // 二进制文件类型
    let fileReader = new FileReader();  //如果我们想要操作文件，那就需要通过FileReader读取文件
    fileReader.onload = function(){
        console.log(fileReader.result);
        let img = document.createElement("img");
        img.src = fileReader.result;
        document.body.appendChild(img);
    }
    fileReader.readAsDataURL(file);
})
```

#### node.js中的Buffer
之前我们说了前端操作二进制数据是通过`fileReader`，而后端操作二进制数据是通过`buffer`，buffer代表的都是二进制数据，二进制数据是保存在内存中的，因此肯定需要指定分配内存大小，因此，buffer也是一开始就分配内存，之后不能扩容。

##### buffer声明的三种方式
```js
const buffer = Buffer.alloc(5);       // 通过alloc分配内存地址声明
const buffer1 = Buffer.from("大海");  // 通过from方法声明
const buffer2 = Buffer.from([0xe6,0xb5,0xb7]);  // 通过数组声明
```


##### buffer的常见属性和方法
* length
获取buffer的长度。
```js
const buffer = Buffer.alloc(5);
console.log(buffer.length);   // 5
```
* slice() buffer子串
```js
console.log(buffer.slice(0,3));
```

* Buffer.isBuffer()
判断是否是Buffer。
```js
const buffer = Buffer.alloc(5);
console.log(Buffer.isBuffer(buffer));  // true
```

* copy():拷贝到某个buffer身上。
```js
const buffer3 = Buffer.from("hello");
const buffer4 = Buffer.from("world");
const bigBuffer = Buffer.alloc(10);
buffer3.copy(bigBuffer,0,0,5);
buffer4.copy(bigBuffer,5);
console.log(bigBuffer.toString())  // helloworld
```
copy的实现原理：实际上就是把遍历buffer的每一个：
```js
Buffer.prototype.copy = function(targetBuffer,targetStart,sourceStart=0,sourceEnd=this.length){
    for (let i = sourceStart;i < sourceEnd;i++){
        targetBuffer[targetStart] = this[i];
        targetStart++;
    }
}
```

* concat([])合并多个Buffer
```js
let buffer5  = Buffer.concat([buffer3,buffer4]);
console.log(buffer5.toString())
```