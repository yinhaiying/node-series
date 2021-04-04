setTimeout(() => {
    console.log(1);
    Promise.resolve().then(() => {
        console.log("then");
    })
    process.nextTick(() => {
        console.log("nextTick");
    });
},0)

setTimeout(() => {
    console.log(2);
},0)

/* 




*/