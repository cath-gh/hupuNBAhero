// interval函数首次立即执行
var _setInterval = function (handler, timeout) {
    var _handler = function () {
        handler();
        return handler;
    }
    setInterval(_handler(), timeout);
}
