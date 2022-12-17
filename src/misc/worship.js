// @name         worship
// @version      0.1
// @description  NBA英雄 worship
// @author       Cath
// @update       1. 测试冠军联赛膜拜

(function () {
    //#region constant
    const URLPATH_PLAYER_CHAMPIONS_LEAGUE_INDEX = '/PlayerChampionsleague/index';//冠军联赛
    const URLPATH_WORSHIP = '/Playerchampionsleague/worship';//冠军联赛膜拜
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlPlayerChampionsLeagueIndex = `${urlHost}${URLPATH_PLAYER_CHAMPIONS_LEAGUE_INDEX}`;
    var urlWorship = `${urlHost}${URLPATH_WORSHIP}`;
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
    var getPlayerChampionsLeagueIndex = function () {
        var method = 'POST';
        var url = urlPlayerChampionsLeagueIndex;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getWorship = function (worshipId) {
        var method = 'POST';
        var url = urlWorship;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            worship_id: worshipId,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var worship = function (times, worshipId = 1, cooldown = 600000 + 500) {//补充500ms
        var handler = function () {
            getWorship(worshipId);
            log('执行膜拜');
            times -= 1;
            log('剩余膜拜次数', times);
        }
        handler();//执行一次
        if (times) {//还有剩余次数
            var intv = setInterval((() => {
                return () => {
                    handler();
                    if (!times) {
                        clearInterval(intv);
                        log('膜拜循环结束');
                    }
                };
            })(), cooldown);
        }
    }

    var taskWorship = function () {
        var championsLeagueIndex = getPlayerChampionsLeagueIndex().result;
        var times = championsLeagueIndex['worship_times'];
        var cooldown = championsLeagueIndex['worship_cd'] * 1000;//转化为毫秒
        log(`剩余膜拜次数${times}`);
        log(`等待${cooldown / 1000}秒后执行膜拜`);
        if (times) {//还有膜拜次数
            setTimeout(() => { worship(times); }, cooldown);//等待cd结束执行膜拜
        }
    }
    //#endregion

    //#region run
    taskWorship();
    //#endregion
}())