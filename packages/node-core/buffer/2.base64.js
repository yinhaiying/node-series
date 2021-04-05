

let buffer = Buffer.from("珠");
console.log(buffer); //e7 8f a0
console.log((0xe7).toString(2));
console.log((0x8f).toString(2));
console.log((0xa0).toString(2));

// 11100111 10001111 10100000  3*8的格式
// 转化成  4 *6

// 111001 111000 111110 100000

console.log(parseInt(111001,2))  // 57
console.log(parseInt(111000, 2)) // 56
console.log(parseInt(111110, 2)) // 62
console.log(parseInt(100000, 2)) // 32

let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLocaleLowerCase();
str += "0123456789";
str += "+/";

console.log(str[57]+str[56]+str[62]+str[32])  // 54+g;