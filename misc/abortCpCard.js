// @name         abortCpCard
// @version      0.1
// @description  NBA英雄 abortCpCard
// @author       Cath
// @comment      1.新增公会贡献卡牌功能taskAbortCpCard

(function () {
    //#region constant
    const URLPATH_GET_SOCIATY_ABORT_MAX_NUM = '/Sociaty/getSociatyAbortMaxNum';//查询贡献次数
    const URLPATH_GET_ABORT_CP_CARD_LIST = '/Sociaty/getAbortCpCardList';//查询贡献的卡牌
    const URLPATH_SET_ABORT_CP_CARD = '/Sociaty/setAbortCpCard';//贡献卡牌
    const CARD_QUAILITY = {
        '全部': 0,
        '黑卡': 251,
        '巅峰': 211,
        '金卡': 201,
        '新秀': 161,
        '银卡': 151,
        '铜卡': 101
    };
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlGetSociatyAbortMaxNum = `${urlHost}${URLPATH_GET_SOCIATY_ABORT_MAX_NUM}`;
    var urlGetAbortCpCardList = `${urlHost}${URLPATH_GET_ABORT_CP_CARD_LIST}`;
    var urlSetAbortCpCard = `${urlHost}${URLPATH_SET_ABORT_CP_CARD}`;
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
    var getSociatyAbortMaxNum = function () {
        var method = 'POST';
        var url = urlGetSociatyAbortMaxNum;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            'TEAM_USER_TOKEN': token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getAbortCpCardList = function (offset = 0, limit = 100, sort = 1, desc = 1, quality = CARD_QUAILITY['银卡']) {
        var method = 'POST';
        var url = urlGetAbortCpCardList;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            'offset': offset,
            'limit': limit,
            'sort': sort,
            'desc': desc,
            'quality': quality,
            'TEAM_USER_TOKEN': token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var setAbortCpCard = function (cardId, costCredit = 0) {
        var method = 'POST';
        var url = urlSetAbortCpCard;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            'card_id': cardId,
            'cost_credit': costCredit,
            'TEAM_USER_TOKEN': token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskAbortCpCard = function (num = -1, abortCount = 3, protectCardId = '3708') {//默认剩余1次手动贡献，每次贡献3张，保护马尔卡宁
        var abortNum = getSociatyAbortMaxNum().result;
        var maxAbortNum = parseInt(abortNum['max_abort_num']);
        var playerAbortNum = parseInt(abortNum['player_abort_num']);

        if (num === 0) {//num为0则贡献全部次数
            num = maxAbortNum;
        } else if (num > 0) {//num为正数时贡献可操作次数
            num = num < maxAbortNum ? num : maxAbortNum;
        } else if (num < 0) {//num为负数时剩余指定次数
            num = (-num) < maxAbortNum ? num + maxAbortNum : 0
        }//num转换为一个范围内的正数

        if (num > playerAbortNum) {//num大于已贡献次数则进行贡献
            num = num - playerAbortNum;//实际待贡献次数
            let cardList = getAbortCpCardList().result.list
            let abortCardList = cardList.filter((item) => { return item['card_id'] !== protectCardId && item['star'] === '0' });
            let count = parseInt(abortCardList.length / abortCount);
            num = num < count ? num : count;
            for (let i = 0; i < num; i++) {
                let cardIdList = [];
                for (let j = 0; j < abortCount; j++) {
                    cardIdList.push(abortCardList[i * abortCount + j]['id']);
                }
                setAbortCpCard(cardIdList);
            }
        }
    }
    //#endregion

    //#region run
    taskAbortCpCard(-1);
    //#endregion
}())