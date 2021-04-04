

const fs = require("fs");

let nums = {};
let index = 0;
const cb = () => {
  index++;
  if(index === 2){
      console.log("nums:",nums)
  }
}

function after(times,callback){
    return function(){
        times--;
        if(times === 0){
            callback();
        }
    }
}

let cb = after(2,function(){
    console.log(school)
})
fs.readFile("./1.txt","utf-8",function(err,data){
    console.log("1",data);
    nums[1] = data;
    cb();
})

fs.readFile("./2.txt", "utf-8", function (err, data) {
    console.log("2:",data)
    nums[2] = data;
    cb();
})