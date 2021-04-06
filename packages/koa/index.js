const Koa = require("koa");
// const Koa = require("./my-koa");
const fs = require("fs");



const app = new Koa();


app.use( async(ctx,next) => {
    console.log(1);
    await next();
    console.log(2)
})

app.use(async (ctx,next) => {
    ctx.body = fs.createReadStream("./1.koa.js");
    
})



app.listen(3000,() => {
    console.log(`server is running in port 3000`);
})