function create(obj) {
    function F() {}
    F.prototype = obj;
    F.prototype.constructor = F;
    return new F()
}