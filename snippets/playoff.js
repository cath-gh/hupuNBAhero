

//#region constant
var URLPATH_GET_PLAYOFF_SECTION_MATCH = '/Sociaty/getPlayoffSectionMatch'
//#endregion

//#region config
var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
    service = 1 //按需设置区服, 1即代表XX 1区
//#endregion

//#region init
var date = new Date();
var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
var urlGetPlayoffSectionMatch = `${urlHost}${URLPATH_GET_PLAYOFF_SECTION_MATCH}`;
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
var getPlayoffSectionMatch = function (round, section) {
    var method = 'POST';
    var url = urlGetPlayoffSectionMatch;
    var queryString = {
        post_time: date.getTime(),
        TEAM_USER_TOKEN: token,
        os: 'm'
    };

    var data = new FormData();
    data.append('round', round);
    data.append('section', section);
    data.append('TEAM_USER_TOKEN', token);

    var res = getXhr(method, url, queryString, data);
    return res;
}

// var getAllPlayoffSectionMatch = function (tactic, num) {
    
// }
//#endregion

//#region run
var match = getPlayoffSectionMatch(1, 1);
log(match.result.list);
//#endregion