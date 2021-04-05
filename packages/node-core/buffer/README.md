# Buffer



## 进制

### 任意进制转十进制
任意进制转化成十进制，需要用当前位所在的值 * 当前进制^第几位。比如：
**二进制转十进制**
```js
let num = 1011;
let num1 = 1* 2^3 + 0 * 2^2 + 1 * 2^1 + 1 * 2^0。
```
实现的方式如下：
```js
function toTen(num,base){
    let str = num.toString();
    let sum = 0;
    for(let i = 0;i < str.length;i++){
        let item = Number(str[i]);
        sum += item * Math.pow(base,i);
    }
    return sum;
}
```
也可以使用js提供好的api，parseInt(string,base)。将字符串转化成指定的进制。

### 十进制转任意进制
十进制转任意进制采用取余法。
也可以使用toString方法实现进制转换。toString方法可以实现将任意进制转化成任意进制。

## node中buffer是16进制的
在node中经常需要进行文件读取，node中操作的内容默认会存储在内存中，内存中的变现形式肯定是二进制的，但是我们平常会发现读取的文件，表现形式是16进制的。


### base64
base64只是编码转化，没有加密功能，但是base64可以传输数据，可以减少http请求（不是所有的图片都转化成base64）
base64是将3*8的规则，转换成了4*6的规则。比如:
```js
let buffer = Buffer.from("珠");
console.log(buffer); //e7 8f a0
console.log((0xe7).toString(2));
console.log((0x8f).toString(2));
console.log((0xa0).toString(2));

// 11100111 10001111 10100000  3*8的格式
// 转化成  4 *6
// 111001 111000 111110 100000
我们可以看下6位的二进制，最大可以代表多少。  00111111  = 63。也就是说它最多可以代表0~63一共64个数字。
```
接下来就将其转化成base64:
```js
let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLocaleLowerCase();
str += "0123456789";
str += "+/";

console.log(str[57]+str[56]+str[62]+str[32])  // 54+g;
```
`54+g`就是我们最终得到的base64编码。从上面可以看出base64的编码和解码都是公共的方式，因此加密程度可以忽略不计。
base64一般用于图片转换，但是只适合于小图标，因为经过base64转化后会变大。比如刚刚的`珠`经过转化后变成`54+g`，从
3个字节变成了4个字节。如果图片比较大，转化成base64之后也会变大，因此不合适。