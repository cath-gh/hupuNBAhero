// @name         websocket kit
// @version      0.1
// @description  
// @author       Cath
// @update       1.待完成

(function (angular, document) {
    //#region constant
    
    //#endregion

    //#region config
    
    //#endregion

    //#region init
    
    var scope = angular.element(document).scope();
    var ws = scope.socket;//获取到游戏自身的websocket
    var _onmessage = ws.onmessage;//保存原生onmessage函数

    ws.middleware={};//消息处理堆栈
    ws.use=function(code, fn) {//code:msg_id
        this.middleware[code] = fn;//注册对应code的处理函数fn
    }
    ws.onmessage = function (e) {//插入code处理函数
        var data = JSON.parse(e.data);
        if (Object.hasOwn(this.middleware, data['msg_id'])) {
            this.middleware[data['msg_id']](data)
        }
        _onmessage(e);
    }


    //#endregion

    //#region utils
    function log(value, comment) {
        comment = comment || '';
        if (typeof (value) === 'string') {
            console.info('%c%s - %s: %s', 'color:blue;font-weight:bold', Date().toString(), value, comment);
        } else {
            console.info('%c%s : %s', 'color:blue;font-weight:bold', Date().toString(), comment);
            console.info(value);
        }
    }
    //#endregion

    //#region method

    //#endregion

    //#region run
    // taskKillBoss();
    //#endregion
}(angular, document))