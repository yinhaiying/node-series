

// 转化成10进制
function toTen(num,base){
    let str = num.toString();
    let sum = 0;
    for(let i = 0;i < str.length;i++){
        let item = Number(str[i]);
        sum += item * Math.pow(base,i);
    }
    return sum;
}

console.log(toTen(111,2));