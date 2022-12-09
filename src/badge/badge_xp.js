// @name         badge
// @version      0.11xp
// @description  NBA英雄 badge
// @author       Cath
// @update       1. 全面重写徽章获取代码，统一使用调整后结构
// @update       2. 输出模块待修改

//#region constant
var URLPATH_GET_BADGE_LIST = '/Badge/list';
var BADGENAME = [
    '节奏机器', '无球跑位', '盗球手', '脚踝终结者', '远程炮台', '空隙猎手', '死亡缠绕', '遮眼防守', '勾手大师', '护框精英', '防守威慑', '移动堡垒', '抢断大师', '指尖挑篮', '突破分球', '神射手', '卡位大师', '包夹能手', '补篮大王', '见缝插针'];
//#endregion

//#region config
var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
    service = 1 //按需设置区服, 1即代表XX 1区
//#endregion

//#region init
var date = new Date();
var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
var urlGetBadgeList = `${urlHost}${URLPATH_GET_BADGE_LIST}`;
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
var getBadgeList = function (quality) {
    var method = 'GET';
    var url = urlGetBadgeList;
    var queryString = {
        TEAM_USER_TOKEN: token,
        filter_equip: 1,
        num: 5000,
        os: 'm',
        page: 0,
        positon: '',
        quality: quality,
        suit: '',
        version: '3.0.0'
    };

    var res = getXhr(method, url, queryString);
    return res;
}

var getBadgeSummary = function (badge) {
    var badgeList = {};
    BADGENAME.map(name => { badgeList[name] = Array(6).fill(0) });
    badge.list.map(item => {
        badgeList[item.name.slice(0, -1)][item.position - 1] += 1;
    });
    return badgeList;
}
//#endregion

//#region run
var badge = getBadgeList(1);
var badgelist = getBadgeSummary(badge.result);
//#endregion