// @name         coachTactics
// @version      0.1
// @description  NBA英雄 coachTactics
// @author       Cath
// @comment      1. 快速使用教练战术

//#region constant
var STATIC_ATTACK_ID = {
    '内线战术': 1,
    '均衡战术': 2,
    '锋线战术': 3,
    '外线战术': 4,
    '高低位战术': 5,
    '锋卫战术': 6,
    '收缩内线': 101,
    '半场盯人': 102,
    '区域联防': 103,
    '3-2联防': 104,
    '盯防高低': 105,
    '包夹防守': 106
},
    URLPATH_TACTICS_LIST = '/Coach/tacticsList',//教练战术信息
    URLPATH_GET_ATTACK_ITEM_LIST = '/coach/getAttackItemList',//战术包
    URLPATH_USEITEM = '/Player/useItem';
//#endregion

//#region config
var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
    service = 1; //按需设置区服, 1即代表XX 1区
//#endregion

//#region init
var date = new Date();
var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
var urlTacticsList = `${urlHost}${URLPATH_TACTICS_LIST}`;
var urlGetAttackItemList = `${urlHost}${URLPATH_GET_ATTACK_ITEM_LIST}`;
var urlUseItem = `${urlHost}${URLPATH_USEITEM}`;// 使用战术经验
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
// 获取待升级战术及战术经验包信息
var getTacticsList = function (cardId) {
    var method = 'POST';
    var url = urlTacticsList;
    var queryString = {
        post_time: date.getTime(),
        TEAM_USER_TOKEN: token,
        os: 'm'
    };

    data = {
        card_id: cardId,
        TEAM_USER_TOKEN: token
    }

    var res = getXhr(method, url, queryString, JSON.stringify(data));
    return res;
}

var getAttackItemList = function (staticAttackId, cardId) {
    var method = 'POST';
    var url = urlGetAttackItemList;
    var queryString = {
        post_time: date.getTime(),
        TEAM_USER_TOKEN: token,
        os: 'm'
    };

    data = {
        static_attack_id: staticAttackId,
        cards_id: cardId,
        TEAM_USER_TOKEN: token
    }

    var res = getXhr(method, url, queryString, JSON.stringify(data));
    return res;
}

// 使用战术经验
var useItem = function (bagId, num, selfSel) {
    var method = 'POST';
    var url = urlUseItem;
    var queryString = {
        post_time: date.getTime(),
        TEAM_USER_TOKEN: token,
        os: 'm'
    };

    data = {
        bag_id: bagId,
        num: num,
        self_sel: selfSel,
        TEAM_USER_TOKEN: token
    }

    var res = getXhr(method, url, queryString, JSON.stringify(data));
    return res;
}

var promoteTactics = function (cardId, tactic) {
    var tacticsList = getTacticsList(cardId).result;
    var attackItemList = getAttackItemList(tactic, cardId).result;

    log(`当前经验值`, attackItemList['attack_info']['curr_exp']);
    var bag = attackItemList['list']['list'][0];// 默认使用第一个经验包
    var left = Math.floor((parseInt(attackItemList['attack_info']['max_exp']) - parseInt(attackItemList['attack_info']['curr_exp'])) / parseInt(bag['item_info']['args']))
    var num = bag['num'] > left ? left : bag['num'];
    log(`使用经验包`, num);
    var promote = useItem(bag.id, num, `${cardId}:${tactic}`);
    if (promote.status !== 0) {
        log(promote.message);
    } else {
        attackItemList = getAttackItemList(tactic, cardId).result;
        log(`当前经验值`, attackItemList['attack_info']['curr_exp']);
    }
    return promote;
}
//#endregion

//#region run
// var cardId = '5567854';//多诺万
var cardId = '14739376';//施耐德
var tactic = STATIC_ATTACK_ID['3-2联防'];
promoteTactics(cardId, tactic);
//#endregion