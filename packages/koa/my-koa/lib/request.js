const url = require("url");
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

module.exports = request;