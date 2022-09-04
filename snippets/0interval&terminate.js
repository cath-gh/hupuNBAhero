// 立即执行首次函数，并在满足条件后终止计时器
var a = 3; b = 2;
var func1 = function () { if (a === 3) console.log('done A') };
var int1 = setInterval((() => {
    func1();
    return () => {
        func1();
        if (b === 4) {
            clearInterval(int1); console.log('done B')
        }
    }
})(), 2000);

b = 4;
clearInterval(int1)

var immediatelyInterval = function (func, interval) {
    var int = setInterval((() => {
        func();
        return func;
    })(), interval);
    return int;
}