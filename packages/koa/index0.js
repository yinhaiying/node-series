// const Koa = require("koa");
const Koa = require("./my-koa/lib/application");

const app = new Koa();


app.use( (req,res) => {
    res.end("hello,world");
})
app.on("error",(err) => {
    console.log(err);
})

app.listen(3000,() => {
    console.log(`server is running in port 3000`);
})