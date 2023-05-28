// @name         websocket kit
// @version      0.11
// @description  
// @author       Cath
// @update       1.更新了注册处理函数的方式
// @update       2.第一个中间件测试成功，负责完成数据中json字符串到obj的转化

// (function (angular, document) {
//#region constant

//#endregion

//#region config

//#endregion

//#region init

var scope = angular.element(document).scope();
var ws = scope.socket;//获取到游戏自身的websocket
var _onmessage = ws.onmessage;//保存原生onmessage函数

ws.middleware = {};//消息处理堆栈
ws.use = function (codeArr, fn) {//code:msg_id
    for (let i = 0; i < codeArr.length; i++) {
        if (!this.middleware[codeArr[i]]) {//没注册过消息id
            this.middleware[codeArr[i]] = [];
        }
        let funcArr = this.middleware[codeArr[i]];
        var flag = true;
        for (let j = 0; j < funcArr.length; j++) {
            if (Object.values(funcArr[j].name === fn.name)) {
                flag = false;
                break;
            }
        }
        if (flag) funcArr.push(fn);//注册对应code的处理函数fn
    }
}
ws.onmessage = function (e) {//插入code处理函数
    var data = JSON.parse(e.data);
    if (Object.hasOwn(this.middleware, data['msg_id'])) {
        let funcArr = this.middleware[data['msg_id']];
        for (let i = 0; i < funcArr.length; i++) {
            funcArr[i](data);
        }
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
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return obj;
            } else {
                return false;
            }

        } catch (e) {
            // log('error:' + str + '!!!' + e);
            return false;
        }
    }
    // log('It is not a string!')
}

function strToObj(obj) {
    if (obj instanceof Object) {
        let stack = [];
        let entries = Object.entries(obj);
        entries.map(item => item.push(obj));
        stack.push(...entries);
        while (stack.length) {
            let element = stack.pop();
            let toObj = isJSON(element[1]);
            if (toObj) {//可转换
                element[2][element[0]] = toObj;
                element[1] = toObj;
            }

            if (element[1] instanceof Object) {
                entries = Object.entries(element[1]);
                entries.map(item => item.push(element[2][element[0]]));
                stack.push(...entries)
            }
        }
        
        log(obj);
    }
}
    //#endregion

    //#region run
    // ws.use([3121, 3124, 3125,3126，3127], strToObj);,
    //#endregion
// }(angular, document))