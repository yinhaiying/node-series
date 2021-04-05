const response = {
  _body:"",
  get body(){
    return this._body;
  },
  set body(newBody){  // ctx.body = newBody;
    console.log("newBody:",newBody)
    this._body = newBody;
  }
}
module.exports = response;