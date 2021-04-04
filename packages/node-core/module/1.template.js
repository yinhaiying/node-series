// 实现一个自定义的模板引擎


const ejs = require("ejs");
const path = require("path");
ejs.renderFile(path.resolve(__dirname,"./template.html"),{
  name:"hello",
  age:11,
  arr:[1,2,3]
},(err,data) => {
  console.log(data);
})