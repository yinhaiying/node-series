

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

module.exports = EventEmitter;