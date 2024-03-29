// @name         playerYoke
// @version      0.14
// @description  NBA英雄 羁绊强化
// @author       Cath
// @update       1.修改描述

(function () {
    //#region constant
    const PLAYER_POS = {
        '全部': 0,
        '控卫': 1,
        '分卫': 2,
        '小前': 3,
        '大前': 4,
        '中锋': 5
    };
    const PLAYER_SORT = {
        '品质': 1,
        '战力': 2,
        '两分': 3,
        '三分': 4,
        '助攻': 5,
        '篮板': 6,
        '抢断': 7,
        '封盖': 8,
        '卡量': 9,
    }
    const PLAYER_QUALITY = {
        '黑卡': 251,
        '巅峰': 211,
        '金卡': 201,
        '新秀': 161,
        '银卡': 151,
        '铜卡': 101//包含铁卡
    }
    const URLPATH_YOKE_STAGE_LIST = '/Playeryoke/getYokeStageList';//羁绊强化挑战列表
    const URLPATH_PLAYER_CARD_LIST = '/PlayerFight/playerCardList';//卡牌列表

    const URLPATH_STAR_LIST = '/Playercardstar/starList';//卡牌升星列表

    const URLPATH_MORE_YOKE_STAGE_FIGHT = '/Playeryoke/playerMoreYokeStageFight';//卡牌列表
    const URLPATH_RECOVER = '/Playeryoke/recover';//卡牌列表

    const URLPATH_PLAYER_FIGHT_LINEUP = '/PlayerFight/lineup';//上阵球员
    const URLPATH_LINEUP_YOKE_LIST = '/playeryoke/getPlayerLineupYokeList';//阵容羁绊清单
    const URLPATH_SET_PLAYER_LINEUP_YOKE = '/playeryoke/setPlayerLineupYoke';//设置阵容羁绊
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1; //按需设置区服, 1即代表XX 1区

    let lineupArr = [//阵容
        ['R-威斯布鲁克', '保罗-乔治', '科怀-伦纳德', '乔尔-恩比德', '安德烈-德拉蒙德'],//第一阵容，10987
        ['R-威斯布鲁克', '保罗-乔治', '科怀-伦纳德', '凯文-勒夫', '安东尼-戴维斯'],//第二阵容，65
        ['詹姆斯-哈登', '斯蒂芬-库里', '吉米-巴特勒', 'G-安特托孔波', '尼科拉-约基奇'],//第三阵容，432
        ['詹姆斯-哈登', '斯蒂芬-库里', '科怀-伦纳德', 'G-安特托孔波', '尼科拉-约基奇'],//第四阵容，1
    ];
    let yokeArr = [//羁绊
        ['威卡椒组合'],
        ['威卡椒组合'],
        ['09双星', '欧洲MVP'],
        ['09双星', '欧洲MVP']
    ]
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlYokeStageList = `${urlHost}${URLPATH_YOKE_STAGE_LIST}`;
    var urlPlayerCardList = `${urlHost}${URLPATH_PLAYER_CARD_LIST}`;

    var urlStarList = `${urlHost}${URLPATH_STAR_LIST}`;

    var urlMoreYokeStageFight = `${urlHost}${URLPATH_MORE_YOKE_STAGE_FIGHT}`;
    var urlRecover = `${urlHost}${URLPATH_RECOVER}`;

    var urlPlayerFightLineup = `${urlHost}${URLPATH_PLAYER_FIGHT_LINEUP}`;
    var urlLineupYokeList = `${urlHost}${URLPATH_LINEUP_YOKE_LIST}`;
    var urlSetPlayerLineupYoke = `${urlHost}${URLPATH_SET_PLAYER_LINEUP_YOKE}`;
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
        if (comment !== 0) {
            comment = comment || '';
        }
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
    var getYokeStageList = async function (stageID) {
        var method = 'GET';
        var url = urlYokeStageList;
        var queryString = {
            TEAM_USER_TOKEN: token,
            os: 'm',
            stage_id: stageID,
            version: '3.0.0'
        };

        // var res = getXhr(method, url, queryString, null);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getPlayerCardList = async function (pos, offset, limit, sort, quality) {
        var method = 'POST';
        var url = urlPlayerCardList;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            pos: pos,
            offset: offset,
            limit: limit,
            sort: sort,
            type: 'battle',
            // lineup_id: lineupID,
            quality: quality,
            team_id: 0,
            division: 0,
            section: 0,
            lineup_type: 14,//不知道是啥意思，怀疑是不同玩法的阵容区别
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getStarList = async function (cardID) {
        var method = 'POST';
        var url = urlStarList;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            card_id: cardID,
            is_preview: 0,
            is_member_id: 0,
            member_id: 0,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getMoreYokeStageFight = async function (stageDetailID, num) {
        var method = 'POST';
        var url = urlMoreYokeStageFight;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            stage_detail_id: stageDetailID,
            num: num,
            auto_cost: 0,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getRecover = async function (cardsID) {
        var method = 'POST';
        var url = urlRecover;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            cards_id: cardsID,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getPlayerFightLineup = async function (lineupId, cardId, pos, lineupType = 14) {
        var method = 'POST';
        var url = urlPlayerFightLineup;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            lineup_id: lineupId,
            card_id: cardId,
            pos: pos,
            lineup_type: lineupType,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getLineupYokeList = async function (lineupId) {
        var method = 'POST';
        var url = urlLineupYokeList;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            lineup_id: lineupId,
            is_del: 1,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getSetPlayerLineupYoke = async function (lineupId, yokeIds) {
        var method = 'POST';
        var url = urlSetPlayerLineupYoke;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            lineup_id: lineupId,
            yoke_ids: yokeIds,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var setLinupAndYoke = async function (lineupId, lineupDict, lineupArr, yokeArr) {
        for (let i = 0; i < lineupArr.length; i++) {
            await getPlayerFightLineup(lineupId, lineupDict[lineupArr[i]], i + 1);
        }
        log(`球员上阵完成~`);

        if (yokeArr.length) {//阵容羁绊
            let yokeList = (await getLineupYokeList(lineupId)).result[2];
            let yokeSetList = yokeArr.map(item => yokeList.find(yoke => yoke['title'] === item)['yoke_id']);
            await getSetPlayerLineupYoke(lineupId, yokeSetList);
            log(`阵容羁绊完成~`);
        }
    }

    var taskPlayerYoke = async function () {
        const stagelist = (await getYokeStageList(2)).result;//普通难度
        let cardList = (await getPlayerCardList(PLAYER_POS['全部'], 0, 100, PLAYER_SORT['战力'], PLAYER_QUALITY['金卡'])).result['list'];//获取全部位置的金卡卡牌列表
        const lineupSet = new Set(lineupArr.flat());
        cardList = cardList.filter(item => lineupSet.has(item.card_info.base_name));//只保留阵容球员信息

        for (let i = 0; i < cardList.length; i++) {//只保留能力值最高的卡牌
            const starList = (await getStarList(cardList[i].id)).result['list'];//获取该球员的所有卡牌
            for (star of starList) {
                if (star.card_info.ability > cardList[i].card_info.ability) {
                    cardList[i] = star;
                }
            }
        }

        const lineupId = stagelist['challenge_info']['lineup_id'];
        const lineupDict = cardList.reduce((obj, item) => { obj[item['card_info']['base_name']] = item['id']; return obj }, {})

        await setLinupAndYoke(lineupId, lineupDict, lineupArr[0], yokeArr[0]);//第一阵容
        log(`第一阵容上阵完成~`);
        await getMoreYokeStageFight(100032, 1);//指定关卡，10
        log(`羁绊强化第1场完成~`);
        await getMoreYokeStageFight(100032, 1);//9
        log(`羁绊强化第2场完成~`);
        await getMoreYokeStageFight(100032, 1);//8
        log(`羁绊强化第3场完成~`);
        await getMoreYokeStageFight(100032, 1);//7
        log(`羁绊强化第4场完成~`);
        await getRecover(lineupDict['科怀-伦纳德']);//恢复体力
        log(`恢复球员体力完成~`);
        await setLinupAndYoke(lineupId, lineupDict, lineupArr[1], yokeArr[1]);//第二阵容
        log(`第二阵容上阵完成~`);
        await getMoreYokeStageFight(100031, 1);//6
        log(`羁绊强化第5场完成~`);
        await getMoreYokeStageFight(100031, 1);//5
        log(`羁绊强化第6场完成~`);
        await setLinupAndYoke(lineupId, lineupDict, lineupArr[2], yokeArr[2]);//第三阵容
        log(`第三阵容上阵完成~`);
        await getMoreYokeStageFight(100030, 1);//4
        log(`羁绊强化第7场完成~`);
        await getMoreYokeStageFight(100030, 1);//3
        log(`羁绊强化第8场完成~`);
        await getMoreYokeStageFight(100030, 1);//2
        log(`羁绊强化第9场完成~`);
        await setLinupAndYoke(lineupId, lineupDict, lineupArr[3], yokeArr[3]);//第四阵容
        log(`第四阵容上阵完成~`);
        await getMoreYokeStageFight(100031, 1);//1
        log(`羁绊强化第10场完成~`);
        log(`羁绊强化任务Done~`);
    }
    //#endregion

    //#region run
    taskPlayerYoke();
    //#endregion
}())