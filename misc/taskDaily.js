// @name         taskDaily
// @version      0.12
// @description  NBA英雄 taskDaily
// @author       Cath
// @update       1.添加公会免费拜访任务taskSociatyVisit

(function () {
    //#region constant
    const URLPATH_DAILY_REWARD = '/Player/privilegeDailyReward';//vip每日奖励

    const URLPATH_VIP_GET_BOSS_CHELLENGE = '/PlayerFight/vipGetBossChallenge';//vip每日挑战币

    const URLPATH_GET_MONTH_SIGN_LIST = '/Activity/getMonthSignList';//每月签到奖励列表
    const URLPATH_SET_PLAYER_MONTH_SIGN = '/Activity/setPlayerMonthSign';//每月签到奖励签到

    const URLPATH_GET_PAYMENT_FLAG = '/Player/getPaymentFlag';//每日免费礼包
    const URLPATH_GIFT = '/Activity/gift';//每日特惠列表
    const URLPATH_BUY_GIFT = '/Activity/buyGift';//购买每日特惠

    const URLPATH_GET_MY_SOCIATY = '/Sociaty/getMySociaty';//获取公会id
    const URLPATH_RECEIVE_DAILY_REWARD = '/Sociaty/receiveDailyReward';//公会签到奖励

    const URLPATH_GET_SOCIATY_VISIT_DETAIL = '/Sociaty/getSociatyVisitDetail';//公会拜访任务
    const URLPATH_SET_SOCIATY_PLAYER_VISIT = '/Sociaty/setSociatyPlayerVisit';//拜访
    const VISIT_ID = {
        '交易事务': 1,
        '公会福利': 2
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
    var urlDailyReward = `${urlHost}${URLPATH_DAILY_REWARD}`;
    var urlVipGetBossChallenge = `${urlHost}${URLPATH_VIP_GET_BOSS_CHELLENGE}`;
    var urlGetMonthSignList = `${urlHost}${URLPATH_GET_MONTH_SIGN_LIST}`;
    var urlSetPlayerMonthSign = `${urlHost}${URLPATH_SET_PLAYER_MONTH_SIGN}`;
    var urlGetPaymentFlag = `${urlHost}${URLPATH_GET_PAYMENT_FLAG}`;
    var urlGift = `${urlHost}${URLPATH_GIFT}`;
    var urlBuyGift = `${urlHost}${URLPATH_BUY_GIFT}`;
    var urlGetMySociaty = `${urlHost}${URLPATH_GET_MY_SOCIATY}`;
    var urlReceiveDailyReward = `${urlHost}${URLPATH_RECEIVE_DAILY_REWARD}`;
    var urlGetSociatyVisitDetail = `${urlHost}${URLPATH_GET_SOCIATY_VISIT_DETAIL}`;
    var urlSetSociatyPlayerVisit = `${urlHost}${URLPATH_SET_SOCIATY_PLAYER_VISIT}`;
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
    var getDailyReward = function () {
        var method = 'POST';
        var url = urlDailyReward;
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

    var getVipGetBossChallenge = function () {
        var method = 'POST';
        var url = urlVipGetBossChallenge;
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

    var getMonthSignList = function () {
        var method = 'POST';
        var url = urlGetMonthSignList;
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

    var setPlayerMonthSign = function (id) {
        var method = 'POST';
        var url = urlSetPlayerMonthSign;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            'id': id,
            'TEAM_USER_TOKEN': token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskMonthSign = function () {
        var signList = getMonthSignList();
        var sign = signList.result.day_list.find((item) => { return item['is_sign'] === 0 });
        if (sign) {
            setPlayerMonthSign(sign['id']);
        }

        if (![].findLast) {//alook不支持findLast，临时解决方法
            signList.result.day_list.reverse();
            signLast = signList.result.day_list.find((item) => { return item['is_sign'] === 2 });
            signList.result.day_list.reverse();
        } else {
            signLast = signList.result.day_list.findLast((item) => { return item['is_sign'] === 2 });
        }
        var signSum = signList.result.sum_day_list.find((item) => { return parseInt(item['day']) >= parseInt(signLast['day'] + 1) });
        if (signSum) {
            setPlayerMonthSign(signSum['id']);
        }
    }

    var getPaymentFlag = function () {
        var method = 'POST';
        var url = urlGetPaymentFlag;
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

    var getGift = function (id, type = 0, loop_type = 1) {
        var method = 'POST';
        var url = urlGift;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            'id': id,
            'type': type,
            'loop_type': loop_type,
            'TEAM_USER_TOKEN': token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getBuyGift = function (activityId, id) {
        var method = 'POST';
        var url = urlBuyGift;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            'activity_id': activityId,
            'id': id,
            'TEAM_USER_TOKEN': token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskBuyFreeGift = function () {
        var paymentFlag = getPaymentFlag();
        var gift = getGift(paymentFlag.result['gift_activity_id']);
        var freeGift = gift.result.list.find((item) => { return item['title'] === '每日免费' })
        getBuyGift(gift.result['id'], freeGift['id']);
    }

    var getMySociaty = function () {
        var method = 'POST';
        var url = urlGetMySociaty;
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

    var getReceiveDailyReward = function (sociatyId) {
        var method = 'POST';
        var url = urlReceiveDailyReward;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            'sociaty_id': sociatyId,
            'TEAM_USER_TOKEN': token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskSociatySign = function () {
        var sociaty = getMySociaty();
        getReceiveDailyReward(sociaty.result['sociaty_id']);
    }


    var getSociatyVisitDetail = function (visitId) {
        var method = 'POST';
        var url = urlGetSociatyVisitDetail;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            'visit_id': visitId,
            'max_visit_num': 3,
            'TEAM_USER_TOKEN': token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var setSociatyPlayerVisit = function (playerVisitId, playerVisitDetailId) {
        var method = 'POST';
        var url = urlSetSociatyPlayerVisit;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            'player_visit_id': playerVisitId,
            'player_visit_detail_id': playerVisitDetailId,
            'TEAM_USER_TOKEN': token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskSociatyVisit = function () {
        for (let i in VISIT_ID) {
            var detail = getSociatyVisitDetail(VISIT_ID[i]);
            var info = detail.result['visit_info'][0];
            if (info['is_free']) {
                setSociatyPlayerVisit(VISIT_ID[i], info['id']);
            }
        }

    }
    //#endregion

    //#region run
    getDailyReward();
    getVipGetBossChallenge();
    taskMonthSign();
    taskBuyFreeGift();
    taskSociatySign();
    taskSociatyVisit();
    //#endregion
}())