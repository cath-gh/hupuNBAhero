// @name         pveDailyReward
// @version      0.1
// @description  NBA英雄 pveDailyReward
// @author       Cath
// @comment      1.新增自动领取冠军经理积分赛奖励，待完成

// (function () {
    //#region constant
    const URLPATH_PVE_DAILY_REWARD = '/PlayerFight/pveDailyReward';//冠军经理模式积分赛任务奖励列表
    const URLPATH_POINTS_LIST = '/PlayerFight/pointsList';//冠军经理模式积分赛积分奖励列表
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlPveDailyReward = `${urlHost}${URLPATH_PVE_DAILY_REWARD}`;
    var urlPointsList = `${urlHost}${URLPATH_POINTS_LIST}`;
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
    var getPveDailyReward = function (showType = 3) {
        var method = 'POST';
        var url = urlPveDailyReward;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            show_type: showType,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString,    JSON.stringify(data));
        return res;
    }

    var getPointsList = function (showType = 3) {
        var method = 'POST';
        var url = urlPointsList;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            show_type: showType,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString,    JSON.stringify(data));
        return res;
    }

    var taskPveMatch = function () {
        var pveIndex = getPveIndex().result;
        for (let i = pveIndex['day_all']; i < pveIndex['day_max_num']; i++) {
            pveMatch();
        }
    }
    //#endregion

    //#region run
    
    //#endregion
// }())