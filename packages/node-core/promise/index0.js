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
    then(onFulfilled,onRejected){
      if(this.status === RESOLVED){
          onFulfilled(this.value);
      }
      if(this.status === REJECTED){
          console.log("失败原因：",this.reason)
          onRejected(this.reason);
      }
    }
}

let p = new Promise((resolve,reject) => {
    console.log("ok");
    reject("失败")
});

p.then((result) => {},(reason) => {})