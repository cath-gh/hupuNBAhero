// @name         socialVisit
// @version      0.1
// @description  NBA英雄 工会事务
// @author       Cath
// @update       1. 实现公会拜访任务

(async function () {
    //#region constant
    const VISIT_TYPE = {
        '战术研习': '2',
        '球员提升': '3',
        '球探开拓': '4',
        '教练事务': '5'
    }
    const URLPATH_GET_SOCAIL_VISIT_LIST = '/Sociaty/getSociatyVisitList';//获取工会事务列表
    const URLPATH_GET_SOCAIL_VISIT_DETAIL = '/Sociaty/getSociatyVisitDetail';//获取工会事务详情
    const URLPATH_GET_SOCAIL_PLAYER_VISIT = '/Sociaty/getSociatyPlayerVisit';//获取公会拜访
    const URLPATH_SET_SOCAIL_PLAYER_VISIT = '/Sociaty/setSociatyPlayerVisit';//执行公会拜访
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlGetSocialVisitList = `${urlHost}${URLPATH_GET_SOCAIL_VISIT_LIST}`;
    var urlGetSocialVisitDetail = `${urlHost}${URLPATH_GET_SOCAIL_VISIT_DETAIL}`;
    var urlGetSocialPlayerVisit = `${urlHost}${URLPATH_GET_SOCAIL_PLAYER_VISIT}`;
    var urlSetSocialPlayerVisit = `${urlHost}${URLPATH_SET_SOCAIL_PLAYER_VISIT}`;
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

    var getFetch = async function (method, url, query, formData, delay = 850) {//默认延时850ms
        formData = formData || null;
        let urlString = concatUrlQuery(url, query);
        var res = await fetch(urlString, {
            method: method,
            body: formData
        })

        if (!!delay) {
            await sleep(delay);
            log(`操作延时：${delay}`);
        }

        return res.json();
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

    var sleep = async function (time) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, time)
        })
    }
    //#endregion

    //#region method
    var getSocialVisitList = async function (visitType) {
        var method = 'POST';
        var url = urlGetSocialVisitList;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            type: visitType,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getSocialVisitDetail = async function (visitID, maxVisitNum) {
        var method = 'POST';
        var url = urlGetSocialVisitDetail;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            visit_id: visitID,
            max_visit_num: maxVisitNum,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getSocialPlayerVisit = async function (playerVisitID, playerVisitDetailID) {
        var method = 'POST';
        var url = urlGetSocialPlayerVisit;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            player_visit_id: playerVisitID,
            player_visit_detail_id: playerVisitDetailID,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var setSocialPlayerVisit = async function (playerVisitID, playerVisitDetailID) {
        var method = 'POST';
        var url = urlSetSocialPlayerVisit;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            player_visit_id: playerVisitID,
            player_visit_detail_id: playerVisitDetailID,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskVisit = async function (taskList, visitType) {
        var visitInfo = (await getSocialVisitList(visitType)).result['visit_info'];
        for (let i = 0; i < visitInfo.length; i++) {
            let item = visitInfo[i];
            if (taskList.includes(item['name'])) { //只完成在任务列表内的拜访任务
                var visitDetail = (await getSocialVisitDetail(item['id'], item['max_visit_num'])).result;
                var maxVisitNum = visitDetail['max_visit_num'];
                var playerVisitNum = visitDetail['player_visit_num'];
                for (let j = 0; j < maxVisitNum - playerVisitNum; j++) {
                    await setSocialPlayerVisit(item['id'], visitDetail['visit_info'][0]['id']); //暂时只拜访最基础等级
                }
                log(`拜访${item['name']}完成~`);
            }
        }
    }

    var taskSocaialVisit = async function () {
        var taskList = ['进攻战术', '防守战术', '内线指导', '抢断好手'];

        await taskVisit(taskList, VISIT_TYPE['战术研习']);
        await taskVisit(taskList, VISIT_TYPE['球员提升']);
        log(`公会拜访任务Done~`);
    }
    //#endregion

    //#region run
    taskSocaialVisit();
    //#endregion
}())