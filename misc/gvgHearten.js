// @name         gvgHearten
// @version      0.11
// @description  NBA英雄 gvgHearten
// @author       Cath
// @update       1.修正免费鼓舞后显示金币错误的问题

(function () {
    //#region constant
    const URLPATH_GET_SOCIATY_FLAG = '/Player/getSociatyFlag';//获取公会状态标志
    const URLPATH_GVG_SCHEDULE_LIST = '/sociaty/gvgScheduleList';//获取公会战列表
    const URLPATH_GET_RESOURCE = '/Player/getResource';//获取当前金币数量
    const URLPATH_GVG_HEARTEN = '/Sociaty/gvgHearten';//鼓舞
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlGetSocaityFlag = `${urlHost}${URLPATH_GET_SOCIATY_FLAG}`;
    var urlGvgScheduleList = `${urlHost}${URLPATH_GVG_SCHEDULE_LIST}`;
    var urlGetResource = `${urlHost}${URLPATH_GET_RESOURCE}`;
    var urlGvgHearten = `${urlHost}${URLPATH_GVG_HEARTEN}`;
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
        if (comment !== 0) {
            comment = comment || '';
        }
        if (typeof (value) === 'string') {
            console.info('%c%s - %s: %s', 'color:blue;font-weight:bold', Date().toString(), value, comment);
        } else {
            console.info('%c%s : %s', 'color:blue;font-weight:bold', Date().toString(), comment);
            console.info(value);
        }
    }
    //#endregion

    //#region method
    var getSocaityFlag = function () {
        var method = 'POST';
        var url = urlGetSocaityFlag;
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

    var getGvgScheduleList = function () {
        var method = 'POST';
        var url = urlGvgScheduleList;
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

    var getResource = function () {
        var method = 'POST';
        var url = urlGetResource;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            types: [3, 17],//3:金币, 7:公会币
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getGvgHearten = function (time, pos, times = 1) {
        var method = 'POST';
        var url = urlGvgHearten;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            time: time,
            pos: pos,
            type: 1,
            times: times,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskGvgHearten = function () {
        if (new Date().getDay() !== 7) {//不包含冠军赛
            var socaityFlag = getSocaityFlag().result;
            log('gvg_match_flag_0', socaityFlag['gvg_match_flag_0']);

            var gvgScheduleList = getGvgScheduleList().result;
            var schedule = gvgScheduleList['list'].filter((item) => { return !!item['free_hearten']; });
            if (schedule.length) {//存在免费鼓舞
                var resource = getResource().result;
                log('credit', resource['credit']);
                var gvgHearten = getGvgHearten(gvgScheduleList['time_list'][schedule[0]['round'] - 1], schedule[0]['pos']).result;
                var resource = getResource().result;
                log('credit', resource['credit']);
            }
        }
    }
    //#endregion

    //#region run
    taskGvgHearten();
    //#endregion
}())