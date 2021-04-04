const path = require("path");
const fs = require("fs");
renderFile(path.resolve(__dirname,"./my-template.html"),{name:"hello",age:11},(err,data) => {
  if(err){
      return;
  }
  console.log(data)
})

function renderFile(filePath,obj,cb){
  fs.readFile(filePath,"utf-8",function(err,html){
      if(err){
          return cb(err,html)
      }
    //   console.log(html)
      html = html.replace(/\{\{([^}]+)\}\}/g, function () {
        // console.log(arguments[0]) arguments[0]表示匹配上的内容 {{name}}
        let key = arguments[1].trim();  // arguments[1]表示匹配的子项 name
        return obj[key];
      })
      cb(null,html);
  })
}
