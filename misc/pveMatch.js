// @name         pveMatch
// @version      0.12
// @description  NBA英雄 pveMatch
// @author       Cath
// @update       1.修正了积分奖励领取

(function () {
    //#region constant
    const URLPATH_PVE_MATCH = '/PlayerFight/pveMatch';//冠军经理模式刷新积分赛对手
    const URLPATH_PVE_INDEX = '/PlayerFight/pveIndex';//冠军经理模式查询积分赛对手战力
    const URLPATH_CONFIRM_PVE_MATCH = '/PlayerFight/confirmPveMatch';//积分赛挑战

    const URLPATH_PVE_DAILY_REWARD = '/PlayerFight/pveDailyReward';//冠军经理模式积分赛任务奖励列表
    const URLPATH_POINTS_LIST = '/PlayerFight/pointsList';//冠军经理模式积分赛积分奖励列表
    const URLPATH_RECEIVE_PVE_JOIN_REWARD = '/PlayerFight/receivePveJoinReward';//冠军经理模式积分赛参与奖励
    const URLPATH_RECEIVE_PVE_WIN_REWARD = '/PlayerFight/receivePveWinReward';//冠军经理模式积分赛胜利奖励
    const URLPATH_RECEIVE_PVE_STREAK_WIN_REWARD = '/PlayerFight/receivePveStreakWinReward';//冠军经理模式积分赛连胜奖励

    const URLPATH_POINTS_AWARD = '/PlayerFight/pointsAward';//冠军经理模式积分赛积分奖励
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlPveMatch = `${urlHost}${URLPATH_PVE_MATCH}`;
    var urlPveIndex = `${urlHost}${URLPATH_PVE_INDEX}`;
    var urlConfirmPveMatch = `${urlHost}${URLPATH_CONFIRM_PVE_MATCH}`;
    var urlPveDailyReward = `${urlHost}${URLPATH_PVE_DAILY_REWARD}`;
    var urlPointsList = `${urlHost}${URLPATH_POINTS_LIST}`;
    var urlReceivePveJoinReward = `${urlHost}${URLPATH_RECEIVE_PVE_JOIN_REWARD}`;
    var urlReceivePveWinReward = `${urlHost}${URLPATH_RECEIVE_PVE_WIN_REWARD}`;
    var urlReceivePveStreakWinReward = `${urlHost}${URLPATH_RECEIVE_PVE_STREAK_WIN_REWARD}`;

    var urlPointsAward = `${urlHost}${URLPATH_POINTS_AWARD}`;
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
    var getPveMatch = function (is_fresh = 1, showType = 3) {
        var method = 'GET';
        var url = urlPveMatch;
        var queryString = {
            TEAM_USER_TOKEN: token,
            is_fresh: is_fresh,
            os: 'm',
            show_type: showType,
            version: '3.0.0'
        };

        var res = getXhr(method, url, queryString);
        return res;
    }

    var getPveIndex = function (showType = 3) {
        var method = 'POST';
        var url = urlPveIndex;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            show_type: showType,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getConfirmPveMatch = function (showType = 3, userCode) {
        var method = 'GET';
        var url = urlConfirmPveMatch;
        var queryString = {
            TEAM_USER_TOKEN: token,
            os: 'm',
            show_type: showType,
            user_code: userCode,
            version: '3.0.0'
        };

        var res = getXhr(method, url, queryString);
        return res;
    }

    var pveMatch = function () {
        var pveIndex = getPveIndex().result;
        if (!pveIndex['match_player_list']) {
            getPveMatch();
            pveIndex = getPveIndex().result;
        }
        var pveList = pveIndex['match_player_list'];
        pveList.forEach((item) => { log('战力', item['lineup_ability']) })
        var pveSelect = pveList.reduce((item1, item2) => { return item1['lineup_ability'] <= item2['lineup_ability'] ? item1 : item2 }, { 'lineup_ability': Number.MAX_VALUE });
        log('选中战力', pveSelect['lineup_ability'])
        var userCode = pveSelect['player_info']['user_code'];
        getConfirmPveMatch(3, userCode);
    }

    var taskPveMatch = function () {
        var pveIndex = getPveIndex().result;
        for (let i = pveIndex['day_all']; i < pveIndex['day_max_num']; i++) {
            pveMatch();
        }
    }

    var getPveDailyReward = function (showType = 3) {
        var method = 'POST';
        var url = urlPveDailyReward;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            show_type: showType,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getReceivePveJoinReward = function (showType = 3) {
        var method = 'POST';
        var url = urlReceivePveJoinReward;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            show_type: showType,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getReceivePveWinReward = function (showType = 3) {
        var method = 'POST';
        var url = urlReceivePveWinReward;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            show_type: showType,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getReceivePveStreakWinReward = function (num, showType = 3) {
        var method = 'POST';
        var url = urlReceivePveStreakWinReward;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            num: num,
            show_type: showType,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskPveDailyReward = function () {
        var pveDailyReward = getPveDailyReward().result;
        if (pveDailyReward['list']['join_reward']['left_reward_time'] > 0) {
            getReceivePveJoinReward();
        }
        if (pveDailyReward['list']['win_reward']['left_reward_time'] > 0) {
            getReceivePveWinReward();
        }
        var streakWinList = pveDailyReward['list']['streak_win_reward'].filter((item) => { return item['left_reward_time'] > 0 });
        if (streakWinList.length) {
            streakWinList.map((item) => { getReceivePveStreakWinReward(item['score']) });
        }
    }

    var getPointsList = function (showType = 3) {
        var method = 'POST';
        var url = urlPointsList;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            show_type: showType,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getPointsAward = function (id, showType = 3) {
        var method = 'POST';
        var url = urlPointsAward;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            id: id,
            show_type: showType,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskPointsAward = function () {
        var pointsAward = getPointsList().result;
        var awardList = pointsAward['list'].filter((item) => { return item['status'] === 1 });
        awardList.map((item) => { getPointsAward(item['id']) });
    }
    //#endregion

    //#region run
    taskPveMatch();
    taskPveDailyReward();
    taskPointsAward();
    //#endregion
}())