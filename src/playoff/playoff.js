// @name         playoff
// @version      0.1
// @description  NBA英雄 playoff
// @author       Cath
// @update       1. 收集工会战各公会战力

(function () {
    //#region constant
    const URLPATH_PLAYOFF_SECTION_MATCH = '/Sociaty/getPlayoffSectionMatch';//工会战季后赛
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlPlayoffSectionMatch = `${urlHost}${URLPATH_PLAYOFF_SECTION_MATCH}`;
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
    var getPlayoffSectionMatch = function (round = 1, section) {
        var method = 'POST';
        var url = urlPlayoffSectionMatch;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            round: round,
            section: section,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskPlayoff = function () {
        var header = `序号,公会,ID,战力`;
        var line = '';
        var arr = [];
        var idx = 1;
        arr.push(header);
        for (let i = 1; i < 33; i++) {
            var match = getPlayoffSectionMatch(1, i).result;
            var list = match['list'];
            for (let j = 0; j < 2; j++) {
                var sociatyName = match['players'][j]['sociaty_info']['name'];
                list[j].map(item => {
                    line = `${idx},${sociatyName},${item['player_name']},${item['ability']}`;
                    arr.push(line);
                    idx += 1;
                })
            }
        }


        var content = arr.join('\n');
        var export_blob = new Blob(['\ufeff', content], { type: 'text/plain' }); // \ufeff解决csv中文乱码问题
        var link = document.createElement('a');//创建a标签 
        link.href = URL.createObjectURL(export_blob);//通过URL.createObjectURL; 
        link.download = `公会成员战力统计${new Date().toISOString().slice(0, 10).replaceAll('-', '')}.csv`;
        link.click();//触发a标签下载文件
        URL.revokeObjectURL(link.href);
    }

    //#endregion

    //#region run
    taskPlayoff();
    //#endregion
}())