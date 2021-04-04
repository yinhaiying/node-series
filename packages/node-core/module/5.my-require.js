

const path = require("path");
const fs  = require("fs");
const vm = require("vm");


function Module(id){
  this.id = id;
  this.exports = {

  }
}



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

Module.wrap = function(script){
    const wrapper = [
        '(function (exports, require, module, __filename, __dirname) { ',
        script,
        '\n});'
    ];
    return wrapper.join("");
}

Module._extensiton = {
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
    ".json": function (module) {
        console.log("json:",module)
        let content = fs.readFileSync(module.id,"utf-8");
        module.exports = JSON.parse(content);
    }
}
Module.prototype.load = function(filename){
    // 获取文件的后缀来进行加载
    let extname = path.extname(filename);
    Module._extensiton[extname](this);  // 根据对象的后缀名进行加载。
}

function myRequire(filePath){
 return  Module._load(filePath);
}

const a = myRequire("./a.js");
myRequire("./a.js");
myRequire("./a.js");
myRequire("./a.js");
console.log(a)