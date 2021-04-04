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

