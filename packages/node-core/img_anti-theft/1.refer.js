const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const mime = require("mime");
const server = http.createServer((req,res) => {
  const {pathname} = url.parse(req.url,true);
  const absPath = path.join(__dirname,pathname);
  fs.stat(absPath,(err,statObj) => {
      if(err){
          res.end("not found");
      }else{
          if (statObj.isFile()){
              console.log(absPath);
              // 只对图片进行防盗链
              if (/\.(jpg|jpeg|pn|svg)/.test(absPath)) {
                  let referer = req.headers["referer"] || req.headers["referrer"];
                  if(referer){
                      // 拿到图片的host和refer进行比较
                      let host = req.headers.host;
                      referer = url.parse(referer).host;
                      // 如果不一致就返回错误的图片
                      if(host !== referer){
                          fs.createReadStream(path.resolve(__dirname,"./imgs/error.jpg")).pipe(res);
                          return;
                      }
                  }
              }
              res.setHeader("Content-Type",mime.getType(absPath));
              fs.createReadStream(absPath).pipe(res);
          }
      }
  })
}).listen(3000)