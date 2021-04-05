// 服务端可以操作二进制，Buffer可以和字符串进行相互转化

// Buffer代表的都是二进制数据 内存(buffer不能扩容)


// 1. buffer的三种声明方式：

const buffer = Buffer.alloc(5);
const buffer1 = Buffer.from("大海");
const buffer2 = Buffer.from([0xe6,0xb5,0xb7]);
console.log(buffer)
console.log(buffer1);
console.log(buffer2);
console.log(".......");
console.log(buffer.length);
console.log(buffer.slice(0,3));
console.log(Buffer.isBuffer(buffer));

console.log("........")

Buffer.prototype.copy = function(targetBuffer,targetStart,sourceStart=0,sourceEnd=this.length){
    console.log("my")
    for (let i = sourceStart;i < sourceEnd;i++){
        targetBuffer[targetStart] = this[i];
        targetStart++;
    }
}


const buffer3 = Buffer.from("hello");
const buffer4 = Buffer.from("world");
const bigBuffer = Buffer.alloc(10);
buffer3.copy(bigBuffer,0,0,5);
buffer4.copy(bigBuffer,5);
console.log(bigBuffer.toString())  // helloworld

console.log(".....concat........");
let buffer5  = Buffer.concat([buffer3,buffer4]);
console.log(buffer5.toString())