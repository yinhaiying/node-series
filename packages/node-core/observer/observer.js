// 观察者模式，内部也是基于发布订阅模式，它需要收集观察者  状态变化后要通知观察者

// 被观察者
class Subject {
  constructor(name) {
    this.name = name;
    this.state = "开心"; // 被观察者的状态
    this.observers = []; // 存储所有的观察者
  }
  // 收集所有的观察者
  attach(o) {
    this.observers.push(o);
  }
  // 被观察者状态改变
  setState(newState) {
    this.state = newState;
    this.observers.forEach((o) => o.update(this));
  }
}

// 观察者
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(baby){
    console.log(`当前${this.name}被通知了，${baby.name}的状态变成了${baby.state}`)
  }
}

let baby = new Subject("小孩");

let father = new Observer("爸爸");
let mother = new Observer("妈妈");
baby.attach(father);
baby.attach(mother);

// 状态发生变化
baby.setState("哭了");
