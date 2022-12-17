// 立即执行首次函数，并在满足条件后终止计时器
var a = 3;
var b = 4;
var func1 = function () {
    console.log('func1 in');
    if (a === 3) console.log('done A');
    if (b === 4) {
        console.log('done B1')
    }
};

if (b !== 4) {
    var int1 = setInterval((() => {
        func1();
        return () => {
            console.log('start int');
            if (b === 4) {
                clearInterval(int1);
                console.log('done B1');
            } else func1();
        }
    })(), 2000);
}

b = 4;
clearInterval(int1)

var immediatelyInterval = function (func, interval) {
    var int = setInterval((() => {
        func();
        return func;
    })(), interval);
    return int;
}