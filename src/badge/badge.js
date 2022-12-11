// @name         badge
// @version      0.2
// @description  NBA英雄 badge
// @author       Cath
// @update       1. 全面重写徽章获取代码
// @update       2. 输出csv文件

(function () {
    //#region constant
    const URLPATH_BADGE_LIST = '/Badge/list';
    const BADGE_NAME = [
        '节奏机器', '无球跑位', '盗球手', '脚踝终结者', '远程炮台', '空隙猎手', '死亡缠绕', '遮眼防守',
        '勾手大师', '护框精英', '防守威慑', '移动堡垒', '抢断大师', '指尖挑篮', '突破分球', '神射手',
        '卡位大师', '包夹能手', '补篮大王', '见缝插针'];
    const BADGE_SUIT = function (badgeName) {
        return BADGE_NAME.indexOf(badgeName) + 1;
    }
    const BADGE_QUALITY = {
        '白色': 1,
        '绿色': 2,
        '蓝色': 3,
        '紫色': 4,
        '橙色': 5,
        '红色': 6,
        '黑色': 7,
        '传奇': 8,
    }
    //#endregion

    //#region config
    var server = 'hupu', // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
        service = 1 //按需设置区服, 1即代表XX 1区
    //#endregion

    //#region init
    var date = new Date();
    var token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
    var urlHost = `https://${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    var urlBadgeList = `${urlHost}${URLPATH_BADGE_LIST}`;
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
    var getBadgeList = function (quality, filterEquip = 0, positon = 0, suit = 0) {
        var method = 'GET';
        var url = urlBadgeList;
        var queryString = {
            TEAM_USER_TOKEN: token,
            num: 5000,
            os: 'm',
            filter_equip: filterEquip,
            page: 0,
            positon: positon,
            quality: quality,
            suit: suit,
            type: 0,
            version: '3.0.0'
        };

        var res = getXhr(method, url, queryString);
        return res;
    }

    var taskBadgeSummary = function (quality) {
        var badgeList = getBadgeList(BADGE_QUALITY[quality]).result['list'];
        var badgeSummary = {};
        BADGE_NAME.map(name => { badgeSummary[name] = Array(6).fill(0) });
        badgeList.map(item => {
            let info = [item.name.slice(0, -1), parseInt(item.name.slice(-1))];//名称 位置
            badgeSummary[info[0]][info[1] - 1] += 1;
        });

        var header = ['', '1号位', '2号位', '3号位', '4号位', '5号位', '6号位'];
        var line = [header.join(',')];
        BADGE_NAME.map(name => { line.push([].concat(name, badgeSummary[name]).join(',')) });

        var content = line.join('\n');
        var export_blob = new Blob(['\ufeff', content], { type: 'text/plain' }); // \ufeff解决csv中文乱码问题
        var link = document.createElement('a');//创建a标签 
        link.href = URL.createObjectURL(export_blob);//通过URL.createObjectURL; 
        link.download = `${quality}徽章统计${new Date().toISOString().slice(0, 10).replaceAll('-', '')}.csv`;
        link.click();//触发a标签下载文件
        URL.revokeObjectURL(link.href);
    }
    //#endregion

    //#region run
    taskBadgeSummary('红色');
    //#endregion
})();