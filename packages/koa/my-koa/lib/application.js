const EventEmitter = require("events");
const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");
const Stream = require("stream");

class Application extends EventEmitter {
    constructor(){
        super();
        // 为了防止多个实例共享response,request,context，需要都进行拷贝操作
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);
        this.middlewares = [];  // 存储用户所有的callback
    }
    use(callback) {
        this.middlewares.push(callback);
        // this.callback = callback;
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
    compose(ctx){
      // 在数组中取出第一个，第一个执行后，调用next执行第二个。
      const dispatch = (i) => {
          if(i === this.middlewares.length){
              return Promise.resolve();
          }
        let middleware = this.middlewares[i];
       return Promise.resolve( middleware(ctx, () => dispatch(i + 1)) ) // next方法指的是  () => dispatch(i+1)
      }
      dispatch(0);
    }
    handleRequest(req,res) {
      let ctx = this.createContext(req,res);
      this.compose(ctx).then(() => {
          let body = ctx.body;
          if(typeof body === "string" || Buffer.isBuffer(body)){
              res.end(body);
          }else if(body instanceof  Stream){
              res.setHeader("Content-Disposition",`attachement;filename`)
              body.pip(res);
          }else if(typeof body === "object"){
              res.end(JSON.stringify(body));
          }
          res.end(body)
      })
    //   this.callback(ctx);
    }
    listen(...args) {
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
    }

}

module.exports = Application;