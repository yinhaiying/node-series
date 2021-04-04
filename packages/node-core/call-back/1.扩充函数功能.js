

function say(){
    console.log("say");
}

Function.prototype.before = function(callback){
  return (...args) => {
      callback();
      this(...args);
  }
}

let beforeSay = say.before(function(){
  console.log("before say")
});

beforeSay();
say();

