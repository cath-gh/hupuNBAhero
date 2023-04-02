// @name         signScoutRolls
// @version      0.2
// @description  NBA英雄 signScoutRolls
// @author       Cath
// @update       1.消耗搜索券、球探币版本

(async function () {
    //#region constant
    const URLPATH_GET_CARD_SHOP_LIST = '/Cardshop/getCardShopList';//冠军经理模式球员搜索主页面
    const URLPATH_GUESS_CARD_SHOP = '/Cardshop/guessCardShop';//单次搜索球员
    const URLPATH_FIVE_GUESS_CARD_SHOP = '/Cardshop/fiveGuessCardShop';//5次搜索球员
    const URLPATH_SIGN_SCOUT_ROLLS = '/cardShop/signSocutRolls';//签约球员 居然还有拼写错误
    const URLPATH_CHANGE_SCOUT = '/playerScoutFight/changeScout';//切换球探等级

    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlGetCardShopList = `${urlHost}${URLPATH_GET_CARD_SHOP_LIST}`;
    var urlGuessCardShop = `${urlHost}${URLPATH_GUESS_CARD_SHOP}`;
    var urlFiveGuessCardShop = `${urlHost}${URLPATH_FIVE_GUESS_CARD_SHOP}`;
    var urlSignScoutRolls = `${urlHost}${URLPATH_SIGN_SCOUT_ROLLS}`;
    var urlChangeScout = `${urlHost}${URLPATH_CHANGE_SCOUT}`;
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
    var getCardShopList = async function () {
        var method = 'GET';
        var url = urlGetCardShopList;
        var queryString = {
            TEAM_USER_TOKEN: token,
            is_show: 1,
            last_index: 0,
            os: 'm',
            page_count: 10000,
            shop_type: 2,
            version: '3.0.0'
        };

        // var res = getXhr(method, url, queryString);
        var res = await getFetch(method, url, queryString, null);
        return res;
    }

    var getGuessCardShop = async function (ID) {
        var method = 'POST';
        var url = urlGuessCardShop;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            id: ID,
            update_time: 0,
            type: 0,
            extra: 3,
            free_count: 0,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));

        return res;
    }

    var getFiveGuessCardShop = async function (ID) {
        var method = 'POST';
        var url = urlFiveGuessCardShop;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            id: ID,
            update_time: 0,
            type: 0,
            extra: 5,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));

        return res;
    }

    var getSignScoutRolls = async function (ID, signIDs) {
        var method = 'POST';
        var url = urlSignScoutRolls;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            id: ID,
            sign_ids: signIDs,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getChangeScout = async function (newScoutID) {
        var method = 'POST';
        var url = urlChangeScout;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            new_scout_id: newScoutID,
            TEAM_USER_TOKEN: token
        }

        // var res = getXhr(method, url, queryString, JSON.stringify(data));
        var res = await getFetch(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskSignScoutRolls = async function (num) {//执行所有赛区半价搜索且不签约任何球员
        await getChangeScout(1);//切换为1级球探
        var cardShopList = (await getCardShopList()).result['list'];
        // var halfShopList = cardShopList.filter((item) => { return item['remain_half_count'] > 0 });

        // for (let i = 0; i < halfShopList.length; i++) {
        //     await getGuessCardShop(halfShopList[i]['id']);
        //     await getSignScoutRolls(halfShopList[i]['id'], []);
        // }

        var start = Math.ceil(Math.random() * 6) - 1;
        for (let i = 0; i < 10; i++) {
            var round = start % 6;
            var cardList = (await getFiveGuessCardShop(cardShopList[round]['id'])).result['rolls'];
            var cardIDs = cardList.reduce((arr, item) => { arr.push(item['card_id']); return arr }, [])
            var exchangeList = (await getSignScoutRolls(cardShopList[round]['id'], cardIDs)).result['exchange_list'];
            var scoutTicket = exchangeList['reward_list'][0]['award_num'];
            log(`消耗球探币${scoutTicket}`);
            start += 1;
        }

        log(`消耗球探任务Done~`);
    }
    //#endregion

    //#region run
    taskSignScoutRolls();
    //#endregion
}())