// @name         activity
// @version      0.1
// @description  NBA英雄 activity
// @author       Cath
// @update       1.处理各种活动打卡(每日签到、扑克投票、集卡免费抽卡、季度卡签到、季度卡挑战5次)

(function () {
    //#region constant
    const GROUP_ID = {
        '常规活动': 1,//general
        '专题活动': 2,//topic
        '特殊活动': 3,//special
        '其他活动': 0,//other
    };
    const URLPATH_ACTIVITY_INDEX = '/Activity/index';//获取活动列表
    const URLPATH_ACTIVITY_DETAIL = '/Activity/detail';//获取活动详情
    const URLPATH_ACTIVITY_REWARD = '/Activity/reward';//获取活动奖励
    const URLPATH_ACTIVITY_POKER_LIST = '/Activitypoker/pokerList';//获取扑克活动
    const URLPATH_ACTIVITY_POKER = '/Activitypoker/poker';//扑克活动投票
    const POKER_TICKET = {
        '1': 'poker_ticket_one',
        '2': 'poker_ticket_two',
        '3': 'poker_ticket_three',
        '4': 'poker_ticket_four',
    };
    const URLPATH_COLLECTION_LIST = '/Collect/getCollectionList';//集卡活动
    const URLPATH_GUESS_CARD_SHOP = '/Collect/guessCardShop';//集卡抽卡
    const COLLECTION_ID = {
        '太平洋赛区': 1,
        '西北赛区': 2,
        '西南赛区': 3,
        '大西洋赛区': 4,
        '东南赛区': 5,
        '中部赛区': 6,
    };
    const URLPATH_ACTICITY_SUBLIST = '/Activity/subList';//季度卡活动
    const URLPATH_STAGE_AREA_LIST = '/PlayerFight/stageAreaList';//季度卡活动
    const URLPATH_MORE_FIGHT = '/PlayerFight/moreFight';//季度卡活动
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlActivityIndex = `${urlHost}${URLPATH_ACTIVITY_INDEX}`;
    var urlActivityDetail = `${urlHost}${URLPATH_ACTIVITY_DETAIL}`;
    var urlActivityReward = `${urlHost}${URLPATH_ACTIVITY_REWARD}`;
    var urlActivityPokerList = `${urlHost}${URLPATH_ACTIVITY_POKER_LIST}`;
    var urlActivityPoker = `${urlHost}${URLPATH_ACTIVITY_POKER}`;
    var urlCollectionList = `${urlHost}${URLPATH_COLLECTION_LIST}`;
    var urlGuessCardShop = `${urlHost}${URLPATH_GUESS_CARD_SHOP}`;
    var urlActivitySubList = `${urlHost}${URLPATH_ACTICITY_SUBLIST}`;
    var urlStageAreaList = `${urlHost}${URLPATH_STAGE_AREA_LIST}`;
    var urlMoreFight = `${urlHost}${URLPATH_MORE_FIGHT}`;
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
    var getActivityIndex = function (groupId) {
        var method = 'GET';
        var url = urlActivityIndex;
        var queryString = {
            TEAM_USER_TOKEN: token,
            group_id: groupId,
            index: 0,
            os: 'm',
            page_count: 100,
            version: '3.0.0'
        };

        var res = getXhr(method, url, queryString, null);
        return res;
    }

    var getActivityDetail = function (id) {
        var method = 'GET';
        var url = urlActivityDetail;
        var queryString = {
            TEAM_USER_TOKEN: token,
            id: id,
            index: 0,
            os: 'm',
            page_count: 8,
            version: '3.0.0'
        };

        var res = getXhr(method, url, queryString, null);
        return res;
    }

    var getActivityReward = function (id) {
        var method = 'GET';
        var url = urlActivityReward;
        var queryString = {
            TEAM_USER_TOKEN: token,
            id: id,
            os: 'm',
            version: '3.0.0'
        };

        var res = getXhr(method, url, queryString, null);
        return res;
    }

    var getActivityPokerList = function (activityId) {
        var method = 'GET';
        var url = urlActivityPokerList;
        var queryString = {
            TEAM_USER_TOKEN: token,
            activity_id: activityId,
            os: 'm',
            version: '3.0.0'
        };

        var res = getXhr(method, url, queryString, null);
        return res;
    }

    var getActivityPoker = function (id, cardId, num) {
        var method = 'POST';
        var url = urlActivityPoker;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            id: id,
            card_id: cardId,
            num: num,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getCollectionList = function (activityType) {
        var method = 'GET';
        var url = urlCollectionList;
        var queryString = {
            TEAM_USER_TOKEN: token,
            activity_type: activityType,
            is_outside: 0,
            os: 'm',
            platform: 'ios',
            version: '3.0.0'
        };

        var res = getXhr(method, url, queryString, null);
        return res;
    }

    var getGuessCardShop = function (activityType, collectionId) {
        var method = 'POST';
        var url = urlGuessCardShop;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            activity_type: activityType,
            is_outside: 0,
            collection_id: collectionId,
            count: 1,
            free_count: 0,
            platform: 'ios',
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getActicitySubList = function (id) {
        var method = 'GET';
        var url = urlActivitySubList;
        var queryString = {
            TEAM_USER_TOKEN: token,
            id: id,
            os: 'm',
            version: '3.0.0'
        };

        var res = getXhr(method, url, queryString, null);
        return res;
    }

    var getStageAreaList = function (type, levelId, parentId) {
        var method = 'POST';
        var url = urlStageAreaList;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            type: type,
            level_id: levelId,
            parent_id: parentId,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getMoreFight = function (stageId, num = 5, type = 3) {
        var method = 'POST';
        var url = urlMoreFight;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            stage_id: stageId,
            num: num,
            type: type,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskTopic = function () {
        var activityList = getActivityIndex(GROUP_ID['专题活动']).result['list'];
        var activityId = activityList.filter(item => item['title'].includes('每日签到'))[0]['id'];
        var rewardId = getActivityDetail(activityId).result['list'][0]['id'];
        getActivityReward(rewardId);
    }

    var taskSpecialPoker = function () {//扑克牌
        var activityList = getActivityIndex(GROUP_ID['特殊活动']).result['list'];
        var activityId = activityList.find(item => item['title'].includes('巅峰扑克牌'))['id'];
        var pokerList = getActivityPokerList(activityId).result;
        let cardId = pokerList['card_list'].find(item => item['name'] === '姚明')['id'];//就投姚明
        if (pokerList['remain_time'] === 0) {//有免费票
            getActivityPoker(pokerList['id'], cardId, 1);
        }
        var round = parseInt(Math.ceil(pokerList['round'] / 4));//猜测使用投票的阶段
        var num = pokerList['player_resource'][POKER_TICKET[round]];
        if (pokerList['player_resource'][POKER_TICKET[round]]) {//剩余票
            getActivityPoker(pokerList['id'], cardId, num);
        }
    }

    var taskSpecialCollection = function (collectionId = COLLECTION_ID['太平洋赛区']) {//集卡
        var activityList = getActivityIndex(GROUP_ID['特殊活动']).result['list'];
        var activityType = activityList.find(item => item['title'].includes('集卡'))['type'];
        var collcetionList = getCollectionList(activityType).result;
        if (collcetionList['next_interval_time'] === 0) {//存在免费抽卡
            getGuessCardShop(activityType, collectionId);
        }
    }

    var taskSpecialSeason = function () {//季度卡活动
        var activityList = getActivityIndex(GROUP_ID['特殊活动']).result['list'];
        var activityId = activityList.find(item => item['title'].includes('季度卡'))['id'];
        var subList = getActicitySubList(activityId).result['list'];

        var detailId = subList.find(item => item['title'].includes('签到'))['id'];//签到
        var rewardId = getActivityDetail(detailId).result['list'][0]['id'];
        getActivityReward(rewardId);

        var detailLinkId = subList.find(item => item['title'].includes('挑战关卡'))['link_id'].split(',');//挑战关卡5次
        var stageAreaList = getStageAreaList(detailLinkId[2], detailLinkId[0], detailLinkId[1]).result;
        var stageId = stageAreaList['stage_list'][4]['id'];//最后一关id
        getMoreFight(stageId, stageAreaList['challenge_times']);
    }
    //#endregion

    //#region run
    taskTopic();
    taskSpecialPoker();
    taskSpecialCollection();
    taskSpecialSeason();
    //#endregion
}())