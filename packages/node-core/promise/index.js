const RESOLVED = "resolved";
const REJECTED = "rejected";
const PENDING = "pending";

class Promise{
    constructor(executor){
        this.status = PENDING;
        this.value = undefined;  // 成功的结果
        this.reason = undefined; // 失败的原因
        let resolve = (value) => {
            if(this.status === PENDING){
                this.value = value;
                this.status = RESOLVED;
            }
        };
        let reject = (reason) => {
            if(this.status === PENDING){
                this.reason = reason;
                this.status = REJECTED;
            }
        }
        try{
            executor(resolve, reject)
        }catch(error){
            reject(error);
        }
    }
}

let p = new Promise((resolve,reject) => {
    console.log("ok");
    resolve("OK")
})