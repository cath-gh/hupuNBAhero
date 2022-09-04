// @name         websocket
// @version      0.1
// @description  NBA英雄 websocket
// @author       Cath
// @comment      1.测试WebSocket

// (function () {
//#region constant
const URLPATH_HOME = '/player/home';//用户信息
const URLPATH_PVE_MATCH_DETAIL = '/Playerfight/pveMatchDetail';//积分赛明细
//#endregion

//#region config
var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
    service = 1 //按需设置区服, 1即代表XX 1区
//#endregion

//#region init
var date = new Date();
var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
var urlWebSocket = 'wss://hupu-ws.ttnba.cn:7401/';
var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
var urlHome = `${urlHost}${URLPATH_HOME}`;
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
var getHome = function () {
    var method = 'POST';
    var url = urlHome;
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

//#endregion

//#region run
var initWS = function () {
    var ws = new WebSocket(urlWebSocket);
    ws.onopen = function () {
        // Web Socket is connected, send data using send()
        // ws.send("121314");
        log("Message is sending");
    };
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        log("Message is received");
        log(evt.data)
    };
    ws.onerror = function (err) {
        log(err);
    };
    ws.onclose = function () {
        // websocket is closed
        log("Connection is closed");
    };
    return ws;
}
    //#endregion
// }())