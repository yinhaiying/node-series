const EventEmitter = require("events");
const util = require("util");  // util.promisify/util.inherts
const event = new EventEmitter();


// 但是我们一般不会创建EventEmitter的实例，而是创建一个类去继承它。

// 继承父类的原型方法：
// 1. Girl.prototype.__proto__ = EventEmitter.prototype
// 2. Object.create(EventEmitter.prototype)
// 3. Object.setPrototypeof(Girl.prototype,EventEmitter.prototype)


function Girl(){

}
util.inherits(Girl,EventEmitter)