

const vm = require("vm");
const code = 'x += 40; var y = 17;';
const context = {
    x: 2
};
vm.createContext(context);
// `x` and `y` 是上下文中的全局变量。
// 最初，x 的值为 2，因为这是 context.x 的值。
vm.runInContext(code, context);

console.log(context.x);  // 42
console.log(context.y);  //17