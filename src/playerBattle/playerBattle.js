// @name         playerBattle
// @version      0.12b
// @description  NBA英雄 血战
// @author       Cath
// @update       1.修正拼写错误

(function () {
    //#region constant
    const URLPATH_BATTLE_LAST_SELECT = '/Battle/lastSelect';//一键导入上一次选人
    const URLPATH_BATTLE_SAVE_SELECT = '/battle/saveSelect';//保存选人

    //可能没用，先预留
    const URLPATH_BATTLE_INFO = '/battle/battleInfo';//血战信息
    const URLPATH_BATTLE_BARRIER = '/battle/barrier';//血战关卡


    const URLPATH_BATTLE_LINEUP = '/battle/checkBattleLineup';//获取阵容ID
    const URLPATH_BATTLE_DETAIL = '/battle/playerBattleDetail';//获取阵容清单
    const URLPATH_PLAYER_FIGHT_LINEUP = '/PlayerFight/lineup';//上阵球员
    const URLPATH_LINEUP_YOKE_LIST = '/playeryoke/getPlayerLineupYokeList';//阵容羁绊清单
    const URLPATH_SET_PLAYER_LINEUP_YOKE = '/playeryoke/setPlayerLineupYoke';//设置阵容羁绊
    const URLPATH_BATTLE_CHALLENGE = '/battle/challenge';//血战关卡挑战
    const URLPATH_GAIN_STAR_REWARD = '/battle/gainStarReward';//血战领奖


    const URLPATH_ALL_YOKE_LIST = '/Playeryoke/getAllYokeList';//获取全部羁绊清单
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1; //按需设置区服, 1即代表XX 1区


    let lineupArr = [//阵容
        ['达米安-利拉德', '克雷-汤普森', '本-西蒙斯', '乔尔-恩比德', '凯文-勒夫'],//第一阵容，123
        ['达米安-利拉德', '克雷-汤普森', 'G-安特托孔波', '乔尔-恩比德', '凯文-勒夫'],//第二阵容，4
        ['扎克-拉文', '德文-布克', '保罗-乔治', '尼科拉-约基奇', '安东尼-唐斯'],//第三阵容，5678
        ['R-威斯布鲁克', '扎克-拉文', '科怀-伦纳德', '德雷蒙德-格林', '安德烈-德拉蒙德']//第四阵容，910
    ];
    let yokeArr = [//羁绊
        ['双帝组合'],//第一阵容
        [],//第二阵容
        ['肯塔基兄弟'],//第三阵容
        []//第四阵容
    ]
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlBattleLastSelect = `${urlHost}${URLPATH_BATTLE_LAST_SELECT}`;
    var urlBattleSaveSelect = `${urlHost}${URLPATH_BATTLE_SAVE_SELECT}`;

    //可能没用，先预留
    var urlBattleInfo = `${urlHost}${URLPATH_BATTLE_INFO}`;
    var urlBattleBarrier = `${urlHost}${URLPATH_BATTLE_BARRIER}`;


    var urlBattleLineup = `${urlHost}${URLPATH_BATTLE_LINEUP}`;
    var urlBattleDetail = `${urlHost}${URLPATH_BATTLE_DETAIL}`;
    var urlPlayerFightLineup = `${urlHost}${URLPATH_PLAYER_FIGHT_LINEUP}`;
    var urlLineupYokeList = `${urlHost}${URLPATH_LINEUP_YOKE_LIST}`;
    var urlSetPlayerLineupYoke = `${urlHost}${URLPATH_SET_PLAYER_LINEUP_YOKE}`;
    var urlBattleChallenge = `${urlHost}${URLPATH_BATTLE_CHALLENGE}`;
    var urlGainStarReward = `${urlHost}${URLPATH_GAIN_STAR_REWARD}`;

    var urlAllYokeList = `${urlHost}${URLPATH_ALL_YOKE_LIST}`;
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
    var getBattleLastSelect = async function () {
        var method = 'POST';
        var url = urlBattleLastSelect;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getBattleSaveSelect = async function (cardsIds) {
        var method = 'POST';
        var url = urlBattleSaveSelect;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            cards_ids: cardsIds,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getBattleInfo = async function () {
        var method = 'POST';
        var url = urlBattleInfo;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getBattleBarrier = async function () {
        var method = 'POST';
        var url = urlBattleBarrier;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getBattleLineup = async function () {
        var method = 'POST';
        var url = urlBattleLineup;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    /**
     * 获取指定位置的球员列表
     * @param {int} pos 球员位置1 - 5
     * @returns 
     */
    var getBattleDetail = async function (pos = 1) {
        var method = 'POST';
        var url = urlBattleDetail;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            pos: pos,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getPlayerFightLineup = async function (lineupId, cardId, pos, lineupType = 4) {
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

    var getAllYokeList = async function (type = 0, offset = 0, limit = 200) {
        var method = 'POST';
        var url = urlAllYokeList;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            type: type,
            offset: offset,
            limit: limit,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var setLinupAndYoke = async function (lineupId, lineupDict, lineupArr, yokeArr) {
        // await Promise.all(lineupArr.map((item, idx) => {//阵容上阵
        //     return getPlayerFightLineup(lineupId, lineupDict[item], idx + 1);
        // }))

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

    var getBattleChallenge = async function (barrierNo) {
        var method = 'POST';
        var url = urlBattleChallenge;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            barrier_no: barrierNo,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getGainStarReward = async function (pointsRewardId) {
        var method = 'POST';
        var url = urlGainStarReward;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            points_reward_id: pointsRewardId,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskBattle = async function () {
        const lastSelect = (await getBattleLastSelect()).result['list'];
        const cardsIds = lastSelect.map(item => item['id']);
        await getBattleSaveSelect(cardsIds);//一键导入

        const lineupId = (await getBattleLineup()).result;//阵容ID
        const lineupDict = lastSelect.reduce((obj, item) => { obj[item['card_info']['base_name']] = item['id']; return obj }, {})


        await setLinupAndYoke(lineupId, lineupDict, lineupArr[0], yokeArr[0]);//第一阵容
        log(`第一阵容上阵完成~`);
        await getBattleChallenge(1);
        log(`血战第1场完成~`);
        await getBattleChallenge(2);
        log(`血战第2场完成~`);
        await getBattleChallenge(3);
        log(`血战第3场完成~`);
        await setLinupAndYoke(lineupId, lineupDict, lineupArr[1], yokeArr[1]);//第二阵容
        log(`第二阵容上阵完成~`);
        await getBattleChallenge(4);
        log(`血战第4场完成~`);
        await setLinupAndYoke(lineupId, lineupDict, lineupArr[2], yokeArr[2]);//第三阵容
        log(`第三阵容上阵完成~`);
        await getBattleChallenge(5);
        log(`血战第5场完成~`);
        await getBattleChallenge(6);
        log(`血战第6场完成~`);
        await getBattleChallenge(7);
        log(`血战第7场完成~`);
        await setLinupAndYoke(lineupId, lineupDict, lineupArr[3], yokeArr[3]);//第四阵容
        log(`第四阵容上阵完成~`);
        await getBattleChallenge(8);
        log(`血战第8场完成~`);
        await getBattleChallenge(9);
        log(`血战第9场完成~`);
        await getBattleChallenge(10);
        log(`血战第10场完成~`);

        const rewardList = (await getBattleBarrier()).result['star_reward_list'];
        const rewardIdList = rewardList.filter(item => item['reward_status'] === 1).map(item => item['points_reward_id']);
        // await rewardIdList.map(item => getGainStarReward(item));
        for (item of rewardIdList) {
            await getGainStarReward(item);
        }
        log(`血战任务Done~`);
    }
    //#endregion

    //#region run
    taskBattle();
    //#endregion
}())