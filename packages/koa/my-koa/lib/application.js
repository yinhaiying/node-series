const EventEmitter = require("events");
const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");


class Application extends EventEmitter {
    constructor(){
        super();
        // 为了防止多个实例共享response,request,context，需要都进行拷贝操作
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);
    }
    use(callback) {
        this.callback = callback;
    }
    createContext(req,res){
        // 每次请求都创建全新的上下文，防止多个请求之间共享数据
        let context = Object.create(this.context);
        let request = Object.create(this.request);
        let response = Object.create(this.response);
        // 上下文中有一个req属性是原生的req属性
        context.req = req;
        context.res = res;
        // 上下文中有一个request对象，是自己封装的对象
        context.request = request;
        context.response = response;
        // 自己封装的request对象上有req属性
        context.request.req = req;
        context.response.res = res;
        return context;
    }
    handleRequest(req,res) {
      let ctx = this.createContext(req,res);
      this.callback(ctx);
    }
    listen(...args) {
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
    }

}

module.exports = Application;