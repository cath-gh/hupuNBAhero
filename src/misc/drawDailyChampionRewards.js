// @name         drawDailyChampionRewards
// @version      0.1
// @description  NBA英雄 drawDailyChampionRewards
// @author       Cath
// @update       1. 领取冠军联赛每日奖励

(function () {
    //#region constant
    const URLPATH_PLAYER_CHAMPIONS_LEAGUE_INDEX = '/PlayerChampionsleague/index';//冠军联赛
    const URLPATH_DRAW_DAILY_CHAMPION_REWARDS = '/Playerchampionsleague/drawDailyChampionRewards';//冠军联赛冠军服奖励
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlPlayerChampionsLeagueIndex = `${urlHost}${URLPATH_PLAYER_CHAMPIONS_LEAGUE_INDEX}`;
    var urlDrawDailyChampionRewards = `${urlHost}${URLPATH_DRAW_DAILY_CHAMPION_REWARDS}`;
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
    var getPlayerChampionsLeagueIndex = function () {
        var method = 'POST';
        var url = urlPlayerChampionsLeagueIndex;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var getDrawDailyChampionRewards = function () {
        var method = 'POST';
        var url = urlDrawDailyChampionRewards;
        var queryString = {
            post_time: date.getTime(),
            TEAM_USER_TOKEN: token,
            os: 'm'
        };

        data = {
            TEAM_USER_TOKEN: token
        }

        var res = getXhr(method, url, queryString, JSON.stringify(data));
        return res;
    }

    var taskChapionsLeague = function () {
        var championsLeagueIndex = getPlayerChampionsLeagueIndex().result;
        if(championsLeagueIndex['is_last_week_champion_server'] && !championsLeagueIndex['has_server_rewards_drawn']){
            getDrawDailyChampionRewards();
        }
    }

    //#endregion

    //#region run
    taskChapionsLeague();
    //#endregion
}())