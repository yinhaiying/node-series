const fs = require("fs");
const path = require("path");


let sourceFilePath = path.resolve(__dirname,"./num.txt");
let targetFilePath = path.resolve(__dirname,"./num1.txt");

copy(sourceFilePath, targetFilePath,(err) => {
    if(err){
        console.log(err);
    }
    console.log("拷贝成功")
});

function copy(sourthPath,targetPath,callback){
    const SIZE = 3;
    const buffer = Buffer.alloc(SIZE);
    let readOffset = 0;
    let writeOffset = 0;
    fs.open(sourthPath,"r",(err,rfd) =>{  //rfd文件描述符一定是一个数字类型
        if(err) return callback(err);
        fs.open(targetPath,"w",(err,wfd) => {
            if(err){
                return callback(err);
            }
            const next = () => {
                fs.read(rfd, buffer, 0, SIZE, readOffset, (err, bytesRead) => {
                    // bytesRead 是读取到的个数，可能是1,2，或者SIZE个；
                    readOffset += bytesRead;  //更改读取的偏移量
                    fs.write(wfd, buffer, 0, bytesRead, writeOffset, (err, written) => {
                        if (err) {
                            return callback(err);
                        }
                        writeOffset += written;
                        if(bytesRead === SIZE){  // 可能还没有读取文笔
                            next();
                        }else{
                            fs.close(rfd,() =>{});
                            fs.close(wfd,() =>{});
                           callback();
                            
                        }
                    })
                })
            }
            next();
        })
    });
}

