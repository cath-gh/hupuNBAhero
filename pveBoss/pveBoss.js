// @name         pveBoss
// @version      0.15
// @description  NBA英雄 pveBoss
// @author       Cath
// @update       1.增加websocket监听

(function (angular, document) {
    //#region constant
    const URLPATH_KILL_BOSS = '/PlayerFight/killBoss';
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlKillBoss = `${urlHost}${URLPATH_KILL_BOSS}`;

    var validHour = [8, 9, 10, 11, 12, 13, 14];
    var fin = 0;

    var leftScore=Number.POSITIVE_INFINITY;
    var intTimeout=-1;
    var scope = angular.element(document).scope();
    var websocket = scope.socket;
    var _onmessage = websocket.onmessage;
    var _pre = function (e) {
        // log('【killBoss脚本】websocket监听预处理开始');
        var data = JSON.parse(e.data);
        if (data['msg_id'] === 9001) {
            log('数据类型',typeof(data['left_score']),);
            leftScore=parseInt(data['left_score']);
            log('Boss剩余血量',data['left_score'],);

            if(leftScore===0){
                clearTimeout(intTimeout);
                killBoss();
            }
        } else {
            ;//暂留
        };
        // log('【killBoss脚本】websocket监听预处理结束');
    }
    websocket.onmessage=function(e){
        _pre(e);
        _onmessage(e);
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
            console.info('%c%s - %s: %s', 'color:blue;font-weight:bold', Date().toString(), value, comment);
        } else {
            console.info('%c%s : %s', 'color:blue;font-weight:bold', Date().toString(), comment);
            console.info(value);
        }
    }
    //#endregion

    //#region method
    var getKillBoss = function () {
        var method = 'GET';
        var url = urlKillBoss;
        var queryString = {
            post_time: new Date().getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };
        var res = getXhr(method, url, queryString);
        return res;
    }

    var killBoss = function () {
        log('【killBoss脚本】进入');
        if (!fin && validHour.indexOf(new Date().getHours()) !== -1) {//在有效的小时范围内
            var res = getKillBoss();
            log('【killBoss脚本】killBoss状态码', res.status);
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
                    if ((validHour.indexOf(new Date().getHours() + 1) !== -1)) {//下一时段在有效范围内
                        var datetime = new Date();
                        datetime.setHours(new Date().getHours() + 1);
                        datetime.setMinutes(0, 0, 100);//延迟100ms确保进入下一时段
                        var delta = datetime - new Date();
                        log('【killBoss脚本】等待进入下一轮挑战Boss', delta / 1000);
                        intTimeout = setTimeout(killBoss, delta);
                    } else {
                        log('【killBoss脚本】不在Boss挑战时间范围');
                    }
                    log('【killBoss脚本】8404break');
                    break;
                case -8409://当前Boss未开启
                    if ((validHour.indexOf(new Date().getHours() + 1) !== -1)) {//下一时段在有效范围内
                        var datetime = new Date();
                        datetime.setHours(new Date().getHours() + 1);
                        datetime.setMinutes(0, 0, 100);//延迟100ms确保进入下一时段
                        var delta = datetime - new Date();
                        log('【killBoss脚本】等待进入下一轮挑战Boss', delta / 1000);
                        intTimeout = setTimeout(killBoss, delta);
                    } else {
                        log('【killBoss脚本】不在Boss挑战时间范围');
                    }
                    break;
            }
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
}(angular, document))