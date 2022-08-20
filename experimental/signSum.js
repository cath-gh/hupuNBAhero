// @name         taskDaily
// @version      0.13
// @description  NBA英雄 taskDaily
// @author       Cath
// @update       1.修正每月累计签到
(function () {
    const URLPATH_GET_MONTH_SIGN_LIST = '/Activity/getMonthSignList';//每月签到奖励列表
    const URLPATH_SET_PLAYER_MONTH_ALL_SIGN = '/Activity/setPlayerMonthAllSign';//每月签到累计奖励


    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
   
    var urlGetMonthSignList = `${urlHost}${URLPATH_GET_MONTH_SIGN_LIST}`;
    var urlSetPlayerMonthAllSign = `${urlHost}${URLPATH_SET_PLAYER_MONTH_ALL_SIGN}`;
    

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
    var getMonthSignList = function () {
        var method = 'POST';
        var url = urlGetMonthSignList;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            'TEAM_USER_TOKEN': token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var setPlayerMonthAllSign = function (id) {
        var method = 'POST';
        var url = urlSetPlayerMonthAllSign;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            'id': id,
            'TEAM_USER_TOKEN': token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskMonthSign = function () {
        //每日签到
        var signList = getMonthSignList();

        //累计签到
        var signLast;
        if (![].findLast) {//alook不支持findLast，临时解决方法
            console.log('临时');
            signList.result.day_list.reverse();
            signLast = signList.result.day_list.find((item) => { return item['is_sign'] === 2 });
            signList.result.day_list.reverse();
        } else {
            console.log('原生');
            signLast = signList.result.day_list.findLast((item) => { return item['is_sign'] === 2 });
        }
        console.log(signLast);
        var signSum = signList.result.sum_day_list.find((item) => { return item['day'] === signLast['day'] });
        if (signSum) {
            setPlayerMonthAllSign(signSum['id']);
        }
    }

    taskMonthSign();
}())