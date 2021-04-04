
// console.log(Object.keys(process))
console.log(process.platform) // win32
console.log(process.argv)
let args = process.argv.slice(2);
let obj = {};
args.forEach((item,index) => {
    if(item.startsWith("--")){
        obj[item.slice(2)] = args[index+1];
    }
})
console.log(obj)
// console.log(process.cwd)
// console.log(process.env)

// console.log(process.nextTick())