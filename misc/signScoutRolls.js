// @name         signScoutRolls
// @version      0.1
// @description  NBA英雄 signScoutRolls
// @author       Cath
// @update       1.切换为1级秋燕

(function () {
    //#region constant
    const URLPATH_GET_CARD_SHOP_LIST = '/Cardshop/getCardShopList';//冠军经理模式球员搜索主页面
    const URLPATH_GUESS_CARD_SHOP = '/Cardshop/guessCardShop';//搜索球员
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
    var getCardShopList = function () {
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

        var res = getXhr(method, url, queryString);
        return res;
    }

    var getGuessCardShop = function (Id) {
        var method = 'POST';
        var url = urlGuessCardShop;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            id: Id,
            update_time: 0,
            type: 0,
            extra: 3,
            free_count: 0,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getSignScoutRolls = function (Id, signIds) {
        var method = 'POST';
        var url = urlSignScoutRolls;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            id: Id,
            sign_ids: signIds,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getChangeScout = function (newScoutId) {
        var method = 'POST';
        var url = urlChangeScout;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            new_scout_id: newScoutId,
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskSignScoutRolls = function () {//执行所有赛区半价搜索且不签约任何球员
        getChangeScout(1);//切换为1级球探
        var cardShopList = getCardShopList().result['list'];
        var halfShopList = cardShopList.filter((item) => { return item['remain_half_count'] > 0 });
        halfShopList.forEach((item) => {
            getGuessCardShop(item['id']);
            getSignScoutRolls(item['id'], []);
        })
    }
    //#endregion

    //#region run
    taskSignScoutRolls();
    //#endregion
}())