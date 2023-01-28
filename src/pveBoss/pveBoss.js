// @name         pveBoss
// @version      0.31
// @description  NBA英雄 pveBoss
// @author       Cath
// @update       1.fix bug

(function (angular, document) {
    //#region 使用自定义Date获取北京时间
    class _Date extends Date {
        constructor(...args) {
            /*方式一
            var timezone=8;//指定时区
            var offset_GMT = new Date().getTimezoneOffset(); 
            var delta = offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000;
            */

            //方式二
            var delta = -3600000//韩国时区，固定偏移
            if (args.length === 0) {
                super(new Date().getTime() + delta);
            } else {
                super(...args);
            }
        }
    }
    //#endregion

    //#region utils
    // 定义url字符串拼接的方法
    var concatUrlQuery = function (url, query) {
        if (query) {
            let queryArr = [];
            for (const key in query) {
                if (query.hasOwnProperty(key)) {
                    queryArr.push(`${key}=${query[key]}`)
                }
            }
            if (url.indexOf('?') === -1) {
                url = `${url}?${queryArr.join('&')}`
            } else if (url.indexOf('=') === -1) {
                url = `${url}${queryArr.join('&')}`
            } else {
                url = `${url}&${queryArr.join('&')}`
            }
        }
        return url;
    }

    var getXhr = function (method, url, query, formData) {
        formData = formData || null;
        let urlString = concatUrlQuery(url, query);
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open(method, urlString, false);
        xmlHttp.send(formData);
        var res = JSON.parse(xmlHttp.responseText);
        return res;
    }

    var log = function (value, comment) {
        comment = comment || '';
        if (typeof (value) === 'string') {
            console.info('%c%s - %s: %s', 'color:blue;font-weight:bold', new _Date().toString(), value, comment);
        } else {
            console.info('%c%s : %s', 'color:blue;font-weight:bold', new _Date().toString(), comment);
            console.info(value);
        }
    }

    var wsMessageStack = {};//消息处理堆栈
    var wsMessageUse = function (code, fn) {//code:msg_id
        wsMessageStack[code] = fn;//注册对应code的处理函数fn
    }
    //#endregion

    //#region constant
    const URLPATH_KILL_BOSS = '/PlayerFight/killBoss';
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1; //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlKillBoss = `${urlHost}${URLPATH_KILL_BOSS}`;

    var validHour = [8, 9, 10, 11, 12, 13, 14];
    var fin = 0;
    var leftScore = Number.POSITIVE_INFINITY;
    var intTimeout = -1;

    log(arguments[2], '【killBoss脚本】传入参数');
    var stun = arguments[2]?.stun || false;//开启抢Boss为true，默认为false
    var pauseScore = arguments[2]?.pauseScore || 15000;//暂停挑战Boss，等待最后一次
    var stunScore = arguments[2]?.stunScore || 4000;//血量小于该数值执行挑战Boss
    var pause = false;//抢Boss模式下，进入等待状态后置为true，默认为false

    var scope = angular.element(document).scope();
    var websocket = scope.socket;//获取到游戏自身的websocket
    var _onmessage = websocket.onmessage;//保存原生onmessage函数

    websocket.onmessage = function (e) {//插入code处理函数
        var data = JSON.parse(e.data);
        if (Object.hasOwn(wsMessageStack, data['msg_id'])) {
            wsMessageStack[data['msg_id']](data)
        }
        _onmessage(e);
    }


    //#endregion


    //#region method
    var wsKillBoss = function (data) {
        // log('【killBoss脚本】websocket监听预处理开始');
        leftScore = data['left_score'];
        log('【killBoss脚本】Boss剩余血量', data['left_score']);

        if (stun) {
            if (!pause && leftScore <= pauseScore) {
                clearInterval(intTimeout);
                pause = true;//进入等待状态
                log('【killBoss脚本】进入等待状态');
            }
            if (pause && leftScore <= stunScore) {
                log('【killBoss脚本】执行抢Boss');
                var status = killBoss();
                if (status !== -8407) {//如果还在冷却状态，则维持等待状态
                    pause = false;//成功执行挑战或者Boss已被击杀，则还原至未等待状态，默认抢Boss仅执行一次;
                }
            }
        }

        if (leftScore === 0) {
            clearTimeout(intTimeout);
            pause = false;//还原为未等待状态
            killBoss();
        }
    }

    wsMessageUse(9001, wsKillBoss);

    var getKillBoss = function () {
        var method = 'GET';
        var url = urlKillBoss;
        var queryString = {
            post_time: new _Date().getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };
        var res = getXhr(method, url, queryString);
        return res;
    }

    var killBoss = function () {
        log('【killBoss脚本】进入');
        if (!fin && validHour.indexOf(new _Date().getHours()) !== -1) {//在有效的小时范围内
            var res = getKillBoss();
            log('【killBoss脚本】killBoss状态码', res.status);
            log('【killBoss脚本】killBoss状态消息', res.message || '挑战Boss');
            log(res, '【killBoss脚本】res');
            switch (res.status) {
                case 0:
                    t = 60000;
                    intTimeout = setTimeout(killBoss, t);
                    log('【killBoss脚本】挑战Boss');
                    break;
                case -8407://正在冷却中
                    t = 4000;
                    intTimeout = setTimeout(killBoss, t);
                    log('【killBoss脚本】Boss正在冷却中');
                    break;
                case -8404://Boss已被击杀
                    if ((validHour.indexOf(new _Date().getHours() + 1) !== -1)) {//下一时段在有效范围内
                        var datetime = new _Date();
                        datetime.setHours(new _Date().getHours() + 1);
                        datetime.setMinutes(0, 0, 300);//延迟300ms确保进入下一时段
                        var delta = datetime - res.server_time * 1000;
                        log('【killBoss脚本】等待进入下一轮挑战Boss', delta / 1000);
                        intTimeout = setTimeout(killBoss, delta);
                    } else {
                        log('【killBoss脚本】不在Boss挑战时间范围');
                    }
                    break;
                case -8409://当前Boss未开启
                    if ((validHour.indexOf(new _Date().getHours() + 1) !== -1)) {//下一时段在有效范围内
                        var datetime = new _Date();
                        datetime.setHours(new _Date().getHours() + 1);
                        datetime.setMinutes(0, 0, 300);//延迟300ms确保进入下一时段
                        var delta = datetime - res.server_time * 1000;
                        log('【killBoss脚本】等待进入下一轮挑战Boss', delta / 1000);
                        intTimeout = setTimeout(killBoss, delta);
                    } else {
                        log('【killBoss脚本】不在Boss挑战时间范围');
                    }
                    break;
            }
            return res.status;
        } else {
            log('【killBoss脚本】不在Boss挑战时间范围');
        }
    }

    var taskKillBoss = function () {
        killBoss();
    }
    //#endregion

    //#region run
    taskKillBoss();
    //#endregion
}(angular, document, { stun: false, pauseScore: 40000, stunScore: 4500 }))