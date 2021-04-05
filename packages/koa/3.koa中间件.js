const Koa = require("koa");
// const Koa = require("./my-koa");

const app = new Koa();


app.use( async(ctx,next) => {
    console.log(1);
    next();
    console.log(2)
})

app.use(async (ctx, next) => {
    console.log(3);
    next();
    console.log(4)
})


app.use(async (ctx, next) => {
    console.log(5);
    next();
    console.log(6)
})




app.on("error",(err) => {
    console.log(err);
})

app.listen(3000,() => {
    console.log(`server is running in port 3000`);
})