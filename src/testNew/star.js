System.register([], (function () {
    'use strict';
    return {
        execute: (async function () {

            const URLPATH_PLAYER_CARD_LIST = '/PlayerFight/playerCardList'; // 用户球员卡牌
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
            };

            const URLPATH_PLAYER_CARD_STAR_LIST = '/Playercardstar/starList';
            const URLPATH_SET_STAR = '/Playercardstar/setStar';

            // 定义url字符串拼接的方法
            var concatUrlQuery = function (url, query) {
                if (query) {
                    let queryArr = [];
                    for (const key in query) {
                        if (query.hasOwnProperty(key)) {
                            queryArr.push(`${key}=${query[key]}`);
                        }
                    }
                    if (url.indexOf('?') === -1) {
                        url = `${url}?${queryArr.join('&')}`;
                    } else if (url.indexOf('=') === -1) {
                        url = `${url}${queryArr.join('&')}`;
                    } else {
                        url = `${url}&${queryArr.join('&')}`;
                    }
                }
                return url;
            };

            var getFetch = async function (method, url, query, formData, delay = 850) {//默认延时850ms
                formData = formData || null;
                let urlString = concatUrlQuery(url, query);
                var res = await fetch(urlString, {
                    method: method,
                    body: formData
                });

                if (!!delay) {
                    await sleep(delay);
                    log(`操作延时：${delay}`);
                }

                return res.json();
            };

            var log = function (value, comment) {
                comment = comment || '';
                if (typeof (value) === 'string') {
                    console.info('%c%s - %s: %s', 'color:blue;font-weight:bold', Date().toString(), value, comment);
                } else {
                    console.info('%c%s : %s', 'color:blue;font-weight:bold', Date().toString(), comment);
                    console.info(value);
                }
            };

            var sleep = async function (time) {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, time);
                })
            };

            //#region config
            var server = 'hupu'; // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
             //按需设置区服, 1即代表XX 1区
            //#endregion

            //#region init
            var date = new Date();
            var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
            var urlHost = `https://${server + ('' )}-api.ttnba.cn`;
            var urlPlayerCardList = `${urlHost}${URLPATH_PLAYER_CARD_LIST}`;
            var urlPlayerCardStarList = `${urlHost}${URLPATH_PLAYER_CARD_STAR_LIST}`;
            var urlSetStar = `${urlHost}${URLPATH_SET_STAR}`;
            //#endregion

            //#region method
            var getPlayerCardList = async function (pos, offset = 0, limit = 100, sort = PLAYER_SORT['战力'], type = 'reserve') {
                var method = 'POST';
                var url = urlPlayerCardList;
                var queryString = {
                    post_time: date.getTime(),
                    TEAM_USER_TOKEN: token,
                    os: 'm'
                };
                var data = new FormData();
                data.append('pos', pos);
                data.append('offset', offset);
                data.append('limit', limit);
                data.append('sort', sort);
                data.append('type', type);
                data.append('TEAM_USER_TOKEN', token);

                // var res = getXhr(method, url, queryString, data);
                var res = await getFetch(method, url, queryString, data);
                return res;
            };

            var getPlayerCardStarList = async function (cardId, isPreview = 1, isMemberId = 0, memberId = 0) {
                var method = 'POST';
                var url = urlPlayerCardStarList;
                var queryString = {
                    post_time: date.getTime(),
                    TEAM_USER_TOKEN: token,
                    os: 'm'
                };
                var data = new FormData();
                data.append('card_id', cardId);
                data.append('is_preview', isPreview);
                data.append('is_member_id', isMemberId);
                data.append('member_id', memberId);
                data.append('TEAM_USER_TOKEN', token);

                // var res = getXhr(method, url, queryString, data);
                var res = await getFetch(method, url, queryString, data);
                return res;
            };

            var getSetStar = async function (cardId, starCardIds, inheritCardId = 0, isDuty = 0) {
                var method = 'POST';
                var url = urlSetStar;
                var queryString = {
                    post_time: date.getTime(),
                    TEAM_USER_TOKEN: token,
                    os: 'm'
                };

                data = {
                    'card_id': cardId,
                    'star_card_ids': starCardIds,
                    'inherit_card_id': inheritCardId,
                    'is_duty': isDuty,
                    'TEAM_USER_TOKEN': token
                };

                var res = await getFetch(method, url, queryString, JSON.stringify(data));
                return res;
            };

            var taskGoldenCardSetStar = async function () {
                var cardList = await getPlayerCardList(PLAYER_POS['中锋']);
                cardList = cardList.result;
                var cardMain = cardList['list'].find((item, idx) => { return item['card_info']['base_name'] === '巴姆-阿德巴约' });//阿德巴约

                for (let i = 0; i < 5; i++) {
                    log(`金卡第${i + 1}次进入`);
                    var cardStarList = await getPlayerCardStarList(cardMain['id']);
                    var cardBase = cardStarList.result.card_list[0];
                    await getSetStar(cardBase['id'], [cardMain['id']]);
                    log(cardMain['id'], `金卡${i + 1}cardMain`);
                    log(cardBase['id'], `金卡${i + 1}cardBase`);
                    cardMain = cardBase;
                    log(`金卡第${i + 1}次升星完成`);
                }

            };
            //#endregion

            //#region run
            await taskGoldenCardSetStar();
            // await taskSilverCardSetStar();
            log(`升星任务Done~`);
                //#endregion

        })
    };
}));
