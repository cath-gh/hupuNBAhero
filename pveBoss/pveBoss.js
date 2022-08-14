// @name         pveBoss
// @version      0.12
// @description  NBA英雄 pveBoss
// @author       Cath
// @update       1. 调整代码结构，功能逐步添加

(function () {
    //#region constant
    const URLPATH_KILL_BOSS = '/PlayerFight/killBoss';
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlKillBoss = `${urlHost}${URLPATH_KILL_BOSS}`;
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
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };
        var res = getXhr(method, url, queryString);
        return res;
    }

    //开启循环脚本
    var intervBoss = setInterval((function close(j) {
        return function () {
            taskKillBoss(j)
        }
    })(), 4000);

    var taskKillBoss = function () {
        var Hourset = [9, 10, 11, 12, 13, 14]
        //调整Hourset[ ]内整点数, 可限定只打某些整点的BOSS,默认全打(外线、锋线BOSS性价比较高)
        var t = 4000 //初始间隔时间, 默认4秒
        var Hour = date.getHours()
        var Minutes = date.getMinutes()

        // 日常Boss
        if (((Hourset.indexOf(Hour) > -1)) || (Hourset.indexOf(Hour + 1) > -1 && Minutes >= 49)) {
            var res = getKillBoss();
            switch (res.status) {
                case -1200:
                    console.error('【自动BOSS脚本】token过期，请重新获取')
                    break
                case -8409:
                    if (Hourset.indexOf(Hour + 1) > -1 && Minutes >= 49) {
                        t = 4000
                        clearInterval(intervBoss)
                        intervBoss = setInterval(fn, t)
                        console.log('【自动BOSS脚本】临近BOSS，开始4秒快刷新模式')
                        break
                    } else {
                        t = 600000
                        clearInterval(intervBoss)
                        intervBoss = setInterval(fn, t)
                        console.log('【自动BOSS脚本】BOSS未开放，进入10分钟刷新模式')
                        break
                    }
                case -8404:
                    console.log('【自动BOSS脚本】Boss已击败，脚本进入10分钟刷新模式')
                    t = 600000
                    clearInterval(intervBoss)
                    intervBoss = setInterval(fn, t)
                    break
            }
        } else {
            t = 600000
            clearInterval(intervBoss);
            intervBoss = setInterval(taskKillBoss, t)
            console.log('【自动BOSS脚本】BOSS不在目标列表内，进入10分钟刷新模式')
        }
        console.log((date.toLocaleString()) + "\n【自动BOSS脚本】当前刷新频率：", (t / 1000), "秒")
    }
    //#endregion

    //#region run
    // taskKillBoss();
    //#endregion
}())