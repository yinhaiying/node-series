const fs = require("fs");


// 先读取3个到内存中
const buffer = Buffer.alloc(3);

// 读取
fs.open("./num.txt","r",(err,fd) => {
    // fd就表示这个文件。file descriptor 文件描述符
    // buffer的第0个位置开始写入，写入到buffer中几个，文件的读取位置是多少
  fs.read(fd,buffer,0,3,0,(err,bytesRead) => {
      // bytersRead是真正的读取个数
      console.log(bytesRead,buffer);
  })
})



// 写入
const wBuffer = Buffer.from("大海你好");
fs.open("./num1.txt","a",438,function(err,fd){
    fs.write(fd,wBuffer,0,6,0,function(err,writter){
        console.log("成功")
    })
})