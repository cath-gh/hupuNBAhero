// @name         activity
// @version      0.22
// @description  NBA英雄 activity
// @author       Cath
// @update       1.修复季度卡活动

(async function () {
    //#region constant
    const GROUP_ID = {
        '常规活动': 0,//general
        '专题活动': 3,//topic
        '充值活动': 2,//special
        '其他活动': 1,//other
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
    const URLPATH_ACTICITY_SUBLIST = '/Activity/subList';//季度卡活动、巨星挑战活动子列表
    const URLPATH_STAGE_AREA_LIST = '/PlayerFight/stageAreaList';//季度卡活动
    const URLPATH_MORE_FIGHT = '/PlayerFight/moreFight';//季度卡活动
    const URLPATH_STAGE_FIGHT = '/PlayerFight/stageFight';//季度卡挑战活动
    const URLPATH_RICH_NPC_ENTER = '/Activity/richNpcEnter';//大富翁活动选择角色
    const URLPATH_RICH_MOVE = '/Activity/richMove';//大富翁活动移动
    const URLPATH_LEGEND_STAGE_INDEX = '/activity/getLegendStageIndex';//巨星挑战活动
    const URLPATH_LEGEND_STAGE_BASEINFO = '/activity/getLegendStageBaseInfo';//巨星挑战活动信息
    const URLPATH_LEGEND_STAGE_LIST = '/activity/getLegendStageList';//巨星挑战列表
    const URLPATH_LEGEND_STAGE_FIGHT = '/activity/legendStageFight';//进行巨星挑战
    const URLPATH_WISHING_WELL = '/Activity/getWishingWell';//许愿池
    const URLPATH_BUY_WISHING_WELL = '/Activity/buyWishingWell';//许愿池选择
    const URLPATH_CHRISTMAS_GIFT = '/activity/getChristmasGift';//吉祥好物
    const URLPATH_RECEIVE_CHRISTMAS_GIFT = '/activity/receiveChristmasGiftHideReward';//吉祥好物领取隐藏奖励
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
    var urlStageFight = `${urlHost}${URLPATH_STAGE_FIGHT}`;
    var urlRichNPCEnter = `${urlHost}${URLPATH_RICH_NPC_ENTER}`;
    var urlRichMove = `${urlHost}${URLPATH_RICH_MOVE}`;
    var urlLegendStageIndex = `${urlHost}${URLPATH_LEGEND_STAGE_INDEX}`;
    var urlLegendStageBaseinfo = `${urlHost}${URLPATH_LEGEND_STAGE_BASEINFO}`;
    var urlLegendStageList = `${urlHost}${URLPATH_LEGEND_STAGE_LIST}`;
    var urlLegendStageFight = `${urlHost}${URLPATH_LEGEND_STAGE_FIGHT}`;
    var urlWishingWell = `${urlHost}${URLPATH_WISHING_WELL}`;
    var urlBuyWishingWell = `${urlHost}${URLPATH_BUY_WISHING_WELL}`;
    var urlChristmasGift = `${urlHost}${URLPATH_CHRISTMAS_GIFT}`;
    var urlReceiveChristmasGift = `${urlHost}${URLPATH_RECEIVE_CHRISTMAS_GIFT}`;
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
    var getActivityIndex = async function (groupID) {
        var method = 'GET';
        var url = urlActivityIndex;
        var queryString = {
            TEAM_USER_TOKEN: token,
            group_id: groupID,
            index: 0,
            os: 'm',
            page_count: 100,
            version: '3.0.0'
        };

        // var res = getXhr(method, url, queryString, null);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getActivityDetail = async function (id) {
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

        // var res = getXhr(method, url, queryString, null);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getActivityReward = async function (id) {
        var method = 'GET';
        var url = urlActivityReward;
        var queryString = {
            TEAM_USER_TOKEN: token,
            id: id,
            os: 'm',
            version: '3.0.0'
        };

        // var res = getXhr(method, url, queryString, null);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getActivityPokerList = async function (activityID) {
        var method = 'GET';
        var url = urlActivityPokerList;
        var queryString = {
            TEAM_USER_TOKEN: token,
            activity_id: activityID,
            os: 'm',
            version: '3.0.0'
        };

        // var res = getXhr(method, url, queryString, null);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getActivityPoker = async function (id, cardID, num) {
        var method = 'POST';
        var url = urlActivityPoker;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            id: id,
            card_id: cardID,
            num: num,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getCollectionList = async function (activityType) {
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

        // var res = getXhr(method, url, queryString, null);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getGuessCardShop = async function (activityType, collectionID) {
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
            collection_id: collectionID,
            count: 1,
            free_count: 0,
            platform: 'ios',
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getActicitySubList = async function (id) {
        var method = 'GET';
        var url = urlActivitySubList;
        var queryString = {
            TEAM_USER_TOKEN: token,
            id: id,
            os: 'm',
            version: '3.0.0'
        };

        // var res = getXhr(method, url, queryString, null);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getStageAreaList = async function (activityID, type, levelID, parentID) {
        var method = 'POST';
        var url = urlStageAreaList;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            activity_id: activityID,
            type: type,
            level_id: levelID,
            parent_id: parentID,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getMoreFight = async function (stageID, num = 5, type = 3) {
        var method = 'POST';
        var url = urlMoreFight;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            stage_id: stageID,
            num: num,
            type: type,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getStageFight = async function (stageID) {
        var method = 'POST';
        var url = urlStageFight;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            stage_id: stageID,
            type: 3,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getRichNPCEnter = async function (activityID, npcID) {
        var method = 'POST';
        var url = urlRichNPCEnter;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            activity_id: activityID,
            npc_id: npcID,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getRichMove = async function (activityID) {
        var method = 'POST';
        var url = urlRichMove;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            activity_id: activityID,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getLegendStageIndex = async function (activityID) {
        var method = 'GET';
        var url = urlLegendStageIndex;
        var queryString = {
            TEAM_USER_TOKEN: token,
            activity_id: activityID,
            os: 'm',
            version: '3.0.0'
        };

        // var res = getXhr(method, url, queryString, null);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getLegendStageBaseinfo = async function (activityID, legendStageID) {
        var method = 'GET';
        var url = urlLegendStageBaseinfo;
        var queryString = {
            TEAM_USER_TOKEN: token,
            activity_id: activityID,
            legend_stage_id: legendStageID,
            os: 'm',
            version: '3.0.0'
        };

        // var res = getXhr(method, url, queryString, null);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getLegendStageList = async function (activityID, legendStageID) {
        var method = 'GET';
        var url = urlLegendStageList;
        var queryString = {
            TEAM_USER_TOKEN: token,
            activity_id: activityID,
            current_stage_id: 0,
            direction: 0,
            legend_stage_id: legendStageID,
            os: 'm',
            page_num: 10,
            version: '3.0.0'
        };

        // var res = getXhr(method, url, queryString, null);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getLegendStageFight = async function (activityID, stageID) {
        var method = 'POST';
        var url = urlLegendStageFight;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            activity_id: activityID,
            stage_id: stageID,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getWishingWell = async function (activityID) {
        var method = 'GET';
        var url = urlWishingWell;
        var queryString = {
            TEAM_USER_TOKEN: token,
            activity_id: activityID,
            os: 'm',
            version: '3.0.0'
        };

        // var res = getXhr(method, url, queryString, null);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getBuyWishingWell = async function (activityID, index, day) {
        var method = 'POST';
        var url = urlBuyWishingWell;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            activity_id: activityID,
            index: index,
            day: day,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getChristmasGift = async function (activityID) {
        var method = 'GET';
        var url = urlChristmasGift;
        var queryString = {
            post_time: date.getTime(),
            activity_id: activityID,
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        // var res = getXhr(method, url, queryString, null);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getReceiveChristmasGift = async function (activityID) {
        var method = 'POST';
        var url = urlReceiveChristmasGift;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            activity_id: activityID,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var activityList = [];
    var taskGetActivityIndex = async function () {
        for (value of Object.values(GROUP_ID)) {
            let list = (await getActivityIndex(value)).result['list'];
            activityList = activityList.concat(list);
        }
        log(`获取活动索引Done~`);
    }

    var taskDailySign = async function () {
        var activity = activityList.filter(item => item['title'].includes('每日签到'));
        for (let item of activity) {
            let activityID = item['id'];
            let rewardID = (await getActivityDetail(activityID)).result['list'][0]['id'];
            await getActivityReward(rewardID);
        }
        log(`每日签到Done~`);
    }

    var taskPoker = async function () {//扑克牌
        var activity = activityList.find(item => item['title'].includes('扑克牌'));
        if (activity) {
            var activityID = activity['id'];
            var pokerList = (await getActivityPokerList(activityID)).result;
            // let cardID = pokerList['card_list'].find(item => item['name'] === '姚明')['id'];//就投姚明
            let cardID = pokerList['card_list'][0]['id'];//就投第一个
            if (pokerList['remain_time'] === 0) {//有免费票
                await getActivityPoker(pokerList['id'], cardID, 1);
            }
            var round = parseInt(Math.ceil(pokerList['round'] / 4));//猜测使用投票的阶段
            var num = pokerList['player_resource'][POKER_TICKET[round]];
            if (num) {//剩余票
                await getActivityPoker(pokerList['id'], cardID, num);
            }
        }
        log(`扑克牌Done~`);
    }

    var taskCollection = async function (collectionID = COLLECTION_ID['太平洋赛区']) {//集卡
        var activity = activityList.find(item => item['title'].includes('集卡'));
        if (activity) {
            var activityType = activity['type'];
            var collcetionList = (await getCollectionList(activityType)).result;
            if (collcetionList['next_interval_time'] === 0) {//存在免费抽卡
                await getGuessCardShop(activityType, collectionID);
            }
        }
        log(`集卡Done~`);
    }

    var taskSeason = async function () {//季度卡活动
        var activity = activityList.find(item => item['title'].includes('季度卡'));
        if (activity) {
            var activityID = activity['id'];
            var subList = (await getActicitySubList(activityID)).result['list'];

            var detailID = subList.find(item => item['title'].includes('签到'))['id'];//签到
            var rewardID = (await getActivityDetail(detailID)).result['list'][0]['id'];
            await getActivityReward(rewardID);

            var subItem = subList.find(item => item['title'].includes('挑战关卡'))
            var detailLinkID = subItem['link_id'].split(',');//挑战关卡5次
            var stageAreaList = (await getStageAreaList(subItem['id'], detailLinkID[2], detailLinkID[0], detailLinkID[1])).result;
            var num = stageAreaList['challenge_times'];
            var stageID = parseInt(stageAreaList['stage_list'].find(item => item['is_lock'] === 1)['id']) - 1;//第一个未解锁关卡
            for (let i = 0; i < num; i++) {
                await getStageFight(stageID);
                stageID += 1;
            }
        }
        log(`季度卡Done~`);
    }

    var taskSevenSign = async function () {//七日签到活动
        var activity = activityList.filter(item => item['title'].includes('7日签到'));
        for (let item of activity) {
            let activityID = item['id'];
            let rewardID = (await getActivityDetail(activityID)).result['list'].find(item => item['player_info']['reward_times'] === '0' && item['player_info']['state'] === '1');
            if (rewardID) await getActivityReward(rewardID['id']);
        }
        log(`七日签到Done~`);
    }

    var taskRich = async function () {//大富翁活动
        var activity = activityList.find(item => item['title'].includes('大富翁'));
        if (activity && activity['has_free']) {//存在活动且有免费次数
            var activityID = activity['id'];
            await getRichNPCEnter(activityID, 1);//默认选择第一个角色
            await getRichMove(activityID);
        }
        log(`大富翁Done~`);
    }

    var taskLegend = async function () {//巨星挑战活动
        var activity = activityList.find(item => item['title'].includes('巨星挑战'));
        if (activity) {
            var activityID = activity['id'];
            var stageIndex = (await getLegendStageIndex(activityID)).result;

            //签到
            var subList = (await getActicitySubList(activityID)).result;
            var detailID = subList['list'].find(item => item['title'].includes('签到'))['id'];
            if (subList['red_list'][detailID]) {//尚未签到则执行
                var rewardID = (await getActivityDetail(detailID)).result['list'][0]['id'];
                await getActivityReward(rewardID);
            }

            //挑战
            var stageBaseinfo = (await getLegendStageBaseinfo(activityID, 2)).result;//默认挑战字母
            var num = parseInt(stageBaseinfo['player_stage_info']['challenge_times']);//剩余挑战次数
            var stageList = (await getLegendStageList(activityID, 2)).result['list'];//默认挑战字母
            var stageID = parseInt(stageList.find(item => item['is_current'])['id']);
            // var stageID = 2105;//挑战指定关卡
            for (let i = 0; i < num; i++) {
                await getLegendStageFight(activityID, stageID);
                stageID += 1;
            }
        }
        log(`巨星挑战Done~`);
    }

    var taskWishingWell = async function () {
        var activity = activityList.find(item => item['title'].includes('许愿池'));
        if (activity) {
            var activityID = activity['id'];
            var wishingWell = (await getWishingWell(activityID)).result;
            if (wishingWell['is_free']) {
                await getBuyWishingWell(activityID, 1, wishingWell['day']);//随便选一个
            }
        }
        log(`许愿池Done~`);
    }

    var taskChristmasGift = async function () {
        var activity = activityList.find(item => item['title'].includes('吉祥好物'));
        if (activity) {
            var activityID = activity['id'];
            var christamsGift = (await getChristmasGift(activityID)).result;
            if (christamsGift['can_receive'] === 1) {
                await getReceiveChristmasGift(activityID);
            }
        }
        log(`圣诞礼物Done~`);
    }
    //#endregion

    //#region run
    await taskGetActivityIndex();
    await taskDailySign();
    await taskPoker();
    await taskCollection();
    await taskSeason();
    await taskSevenSign();
    await taskRich();
    await taskLegend();
    await taskWishingWell();
    await taskChristmasGift();
    //#endregion
}())