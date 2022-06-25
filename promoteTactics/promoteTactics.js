// @name         promoteTactics
// @version      0.1
// @description  NBA英雄 promoteTactics
// @author       Cath
// @comment      1. 定义了一些工具方法，部分来源于网友博文，在此表示感谢
// @comment      2. 测试getXhr方法

//#region init
var date = new Date();
var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
//#endregion

//#region config
var method = 'POST';
var url = 'https://hupu-api.ttnba.cn/PlayerFight/getAttackItemList';
var queryString = {
    post_time: date.getTime(),
    TEAM_USER_TOKEN: token,
    os: 'm'
};

var data = new FormData();
data.append('static_attack_id', 3);
data.append('type', 1);// 进攻战术1、防守战术2
data.append('TEAM_USER_TOKEN', token);
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

var log = function (property, value) {
    console.info('%c%s - %s : %s', 'color:blue;font-weight:bold', Date().toString(), property, value);
}
//#endregion

//#region run
getXhr(method, url, queryString, data);
//#endregion