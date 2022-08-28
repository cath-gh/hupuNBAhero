// @name         matchDetail
// @version      0.11
// @description  NBA英雄 matchDetail
// @author       Cath
// @update       1.修正一个拼写错误

// (function () {
//#region constant
const URLPATH_PVE_MATCH_LIST = '/PlayerFight/pveMatchList';//积分赛已赛列表
const URLPATH_PVE_MATCH_DETAIL = '/Playerfight/pveMatchDetail';//积分赛明细
//#endregion

//#region config
var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
    service = 1 //按需设置区服, 1即代表XX 1区
//#endregion

//#region init
var date = new Date();
var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
var urlPveMatchList = `${urlHost}${URLPATH_PVE_MATCH_LIST}`;
var urlPveMatchDetail = `${urlHost}${URLPATH_PVE_MATCH_DETAIL}`;
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
var getPveMatchList = function () {
    var method = 'GET';
    var url = urlPveMatchList;
    var queryString = {
        TEAM_USER_TOKEN: token,
        os: 'm',
        version: '3.0.0'
    };

    var res = getXhr(method, url, queryString, '');
    return res;
}

var getPveMatchDetail = function (matchID) {
    var method = 'POST';
    var url = urlPveMatchDetail;
    var queryString = {
        post_time: date.getTime(),
        TEAM_USER_TOKEN: token,
        os: 'm'
    };

    data = {
        match_id: matchID,
        TEAM_USER_TOKEN: token
    }

    var res = getXhr(method, url, queryString, JSON.stringify(data));
    return res;
}

//#endregion

//#region run
var pveMatchList = getPveMatchList().result['pve_match_list'];
var matchIDList = [];
for (i in pveMatchList) {
    for (j in pveMatchList[i]['list']) {
        matchIDList.push(pveMatchList[i]['list'][j]['id'])
    }
}

var testID=matchIDList[0];
var matchDetail = getPveMatchDetail(testID);
    //#endregion
// }())