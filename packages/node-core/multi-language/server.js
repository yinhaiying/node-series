const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const querystring = require("querystring");
const messages = {
        en: {
            message: {
                hello: 'hello world'
            }
        },
        ja: {
            message: {
                hello: 'こんにちは、世界'
            }
        },
        'zh-CN':{
            message:{
                hello:"你好"
            }
        }
    }
const server = http.createServer((req, res) => {
    const {
        pathname
    } = url.parse(req.url, true);
    const absPath = path.join(__dirname, pathname);
    fs.stat(absPath, (err, statObj) => {
        if (err) {
            res.end("not found");
        } 
        // accept-language:zh-CN,zh;q=0.9,en;q=0.8
        let lans = req.headers["accept-language"];
        if(lans){
            let obj=querystring.parse(lans,",",";");
          // { 'zh-CN': '', zh: 'q=0.9', en: 'q=0.8' }
            // 根据权重进行排序
            let arr = [];
            Object.keys(obj).forEach((key) => {
                if(obj[key] == ""){
                  arr.push({name:key,q:1});
                }else{
                    arr.push({name:key,q:obj[key].split("=")[1]});
                }
            });
            arr.sort((a,b) =>b.q-a.q)
            for(let i = 0;i < arr.length;i++){
                let currentLan = arr[i];
                console.log(currentLan)
                let messagesObj = messages[currentLan.name];
                if (messagesObj) {
                    res.end(messagesObj.message.hello);
                }
            }
        }else{
             res.end(messagesObj["en"].message.hello)
        }
    })
}).listen(3000)