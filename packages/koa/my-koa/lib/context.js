const context = {}
function defineGetter(target,key){
  context.__defineGetter__(key,function(){
      return this[target][key];
  })
}
defineGetter("request","url");  // ctx.url => ctx.request.url
defineGetter("request","path");  
defineGetter("request","query");  


defineGetter("response","body");  



function defineSetter(target, key) {
    context.__defineSetter__(key, function (value) {
        this[target][key] = value;
    })
}

defineSetter("response", "body");

module.exports = context;