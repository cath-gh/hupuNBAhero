// @name         promoteTactics
// @version      0.11
// @description  NBA英雄 promoteTactics
// @author       Cath
// @update       1. 对外使用promoteTactics方法，只需要指定升级战术名称即可
// @update       2. 大幅修改代码结构，按照功能划分region，更方便扩充功能

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
    URLPATH_GET_ATTACK_ITEMLIST = '/PlayerFight/getAttackItemList',
    URLPATH_USEITEM = '/Player/useItem';
//#endregion

//#region config
var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
    service = 1, //按需设置区服, 1即代表XX 1区

    tactic = '锋线战术', // 准备升级的战术
    tactic_num = -1;// 使用战术经验的数量，默认使用第一个战术经验包
//#endregion

//#region init
var date = new Date();
var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
var urlGetAttackItemList = `${urlHost}${URLPATH_GET_ATTACK_ITEMLIST}`;// 获取待升级战术及战术经验包信息
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
var getAttackItemList = function (tactic) {
    var static_attack_id = STATIC_ATTACK_ID[tactic];
    var type = static_attack_id <= 6 ? 1 : 2;
    var method = 'POST';
    var url = urlGetAttackItemList;
    var queryString = {
        post_time: date.getTime(),
        TEAM_USER_TOKEN: token,
        os: 'm'
    };

    var data = new FormData();
    data.append('static_attack_id', static_attack_id);
    data.append('type', type);// 进攻战术1、防守战术2
    data.append('TEAM_USER_TOKEN', token);

    var res = getXhr(method, url, queryString, data);
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

    var data = new FormData();
    data.append('bag_id', bagId);
    data.append('num', num);
    data.append('self_sel', selfSel);
    data.append('TEAM_USER_TOKEN', token);

    var res = getXhr(method, url, queryString, data);
    return res;
}

var promoteTactics = function (tactic, num) {
    var tac = getAttackItemList(tactic).result;
    log(`${tactic}当前经验值`, tac.attack_info.curr_exp);
    var bag = tac.list.list[0];// 默认使用第一个经验包
    if (num > 0) {
        num = bag.num > num ? num : bag.num;
    } else {
        let left = Math.floor((parseInt(tac.attack_info.max_exp) - parseInt(tac.attack_info.curr_exp)) / parseInt(bag.item_info.args))
        num = bag.num > left ? left : bag.num;
    }

    var promote = useItem(bag.id, num, tac.player_attack_id);
    if (promote.status !== 0) {
        log(promote.message);
    } else {
        tac = getAttackItemList(tactic).result;
        log(`${tactic}当前经验值`, tac.attack_info.curr_exp);
    }
    return promote;
}
//#endregion

//#region run
promoteTactics('锋线战术');
//#endregion