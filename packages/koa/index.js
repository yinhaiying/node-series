// const Koa = require("koa");
const Koa = require("./my-koa");

const app = new Koa();


app.use( (ctx) => {
    // console.log("ctx111:",ctx);
    
    // 原生
    // console.log(ctx.req.url);
    // console.log(ctx.request.req.url);
    // console.log("..............");
    // console.log(ctx.request.url);

    // console.log("path:",ctx.request.path); // ctx.url实际上是从ctx.request.url
    // console.log("query:",ctx.request.query); // ctx.url实际上是从ctx.request.url
    // console.log("..........")
    // console.log(ctx.url); // ctx.url实际上是从ctx.request.url
    // console.log(ctx.path); // ctx.url实际上是从ctx.request.url
    ctx.response.body = "hello";
    ctx.body = "world";  // 一般都是通过这种方式来调用。
})
app.on("error",(err) => {
    console.log(err);
})

app.listen(3000,() => {
    console.log(`server is running in port 3000`);
})