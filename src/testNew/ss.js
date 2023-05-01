import { URLPATH_PLAYER_CARD_LIST, PLAYER_POS, PLAYER_SORT, URLPATH_PLAYER_CARD_STAR_LIST, URLPATH_CHECK_INHERIT, URLPATH_SET_STAR } from './common.js';
import { concatUrlQuery, getXhr, getFetch, log, sleep } from './utils.js';

//#region config
var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
    service = 1 //按需设置区服, 1即代表XX 1区
//#endregion

//#region init
var date = new Date();
var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
var urlPlayerCardList = `${urlHost}${URLPATH_PLAYER_CARD_LIST}`;
var urlPlayerCardStarList = `${urlHost}${URLPATH_PLAYER_CARD_STAR_LIST}`;
var urlCheckInherit = `${urlHost}${URLPATH_CHECK_INHERIT}`;
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
}

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
}

var getCheckInherit = function (cardId, starCardIds) {
    var method = 'POST';
    var url = urlCheckInherit;
    var queryString = {
        post_time: date.getTime(),
        TEAM_USER_TOKEN: token,
        os: 'm'
    };

    data = {
        'card_id': cardId,
        'star_card_ids': starCardIds,
        'TEAM_USER_TOKEN': token
    }

    var res = getXhr(method, url, queryString, JSON.stringify(data));
    return res;
}

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
    }

    var res = await getFetch(method, url, queryString, JSON.stringify(data));
    return res;
}

var taskGoldenCardSetStar = async function () {
    var cardList = await getPlayerCardList(PLAYER_POS['中锋']);
    cardList = cardList.result;
    var cardMain = cardList['list'].find((item, idx) => { return item['card_info']['base_name'] === '巴姆-阿德巴约' });//阿德巴约

    for (let i = 0; i < 5; i++) {
        log(`金卡第${i + 1}次进入`);
        var cardStarList = await getPlayerCardStarList(cardMain['id']);
        var cardBase = cardStarList.result.card_list[0];
        var setStar = await getSetStar(cardBase['id'], [cardMain['id']]);
        log(cardMain['id'], `金卡${i + 1}cardMain`);
        log(cardBase['id'], `金卡${i + 1}cardBase`);
        cardMain = cardBase;
        log(`金卡第${i + 1}次升星完成`);
    }

}

var taskSilverCardSetStar = async function () {
    var cardList = await getPlayerCardList(PLAYER_POS['大前']);
    cardList = cardList.result;
    var cardMain = cardList['list'].find((item, idx) => { return item['card_info']['base_name'] === '劳里-马尔卡宁' });//马尔卡宁

    for (let i = 0; i < 10; i++) {
        log(`银卡第${i + 1}次进入`);
        var cardStarList = await getPlayerCardStarList(cardMain['id']);
        var cardBase = cardStarList.result.card_list[0];
        var setStar = await getSetStar(cardBase['id'], [cardMain['id']]);
        log(cardMain['id'], `银卡${i + 1}cardMain`);
        log(cardBase['id'], `银卡${i + 1}cardBase`);
        cardMain = cardBase;
        log(`银卡第${i + 1}次升星完成`);
    }

}
//#endregion

//#region run
await taskGoldenCardSetStar();
// await taskSilverCardSetStar();
log(`升星任务Done~`);
    //#endregion
