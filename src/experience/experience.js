// @name         experience
// @version      0.21
// @description  NBA英雄 冠军经理历练
// @author       Cath
// @update       1. 修改后第一个测试版本

(async function () {
    //#region constant
    const ARENA_ID = {
        '东部训练': '1',
        '东部特训': '2',
        '西部训练': '3',
        '西部特训': '4',
        '历练之路': '5'
    }
    const URLPATH_ARENA_INDEX = '/PlayerScoutFight/arenaIndex';//冠军经理历练索引
    const URLPATH_GET_ARENA_DETAIL = '/PlayerScoutFight/getArenaDetail';//冠军经理历练详情
    const URLPATH_ARENA_MATCH = '/PlayerScoutFight/arenaMatch';//冠军经理历练挑战
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlArenaIndex = `${urlHost}${URLPATH_ARENA_INDEX}`;
    var urlGetArenaDetail = `${urlHost}${URLPATH_GET_ARENA_DETAIL}`;
    var urlArenaMatch = `${urlHost}${URLPATH_ARENA_MATCH}`;
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
    var getArenaIndex = async function () {
        var method = 'POST';
        var url = urlArenaIndex;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            'TEAM_USER_TOKEN': token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getArenaDetail = async function (arenaID) {
        var method = 'POST';
        var url = urlGetArenaDetail;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            arena_id: arenaID,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getArenaMatch = async function (arenaID, detailID) {
        var method = 'POST';
        var url = urlArenaMatch;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            arena_id: arenaID,
            detail_id: detailID,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskTrain = async function (arenaID) {
        var arenaDetail = (await getArenaDetail(arenaID)).result;
        var detailID;
        if (arenaID !== ARENA_ID['历练之路']) {//普通训练及特训
            let playerLevel = parseInt(arenaDetail['player_level']);
            detailID = arenaDetail['list'][playerLevel]['id'];
        } else {
            detailID = parseInt((await getArenaDetail(ARENA_ID['历练之路'])).result['curr_detail']);
        }

        for (let i = 0; i < 3; i++) {
            await getArenaMatch(arenaID, detailID);
            detailID = arenaID === ARENA_ID['历练之路'] ? detailID + 1 : detailID;
        }
    }

    var taskExperience = async function () {
        var arenaList = (await getArenaIndex()).result['list'];
        for (let i = 0; i < arenaList.length; i++) {
            if (arenaList[i]['is_open']) {
                await taskTrain(arenaList[i]['id']);
            }
        }
    }
    //#endregion

    //#region run
    taskExperience();
    //#endregion
}())