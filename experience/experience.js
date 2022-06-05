// @name         experience
// @version      0.1
// @description  NBA英雄 experience
// @author       Cath
// @update       1. 统一token获取
// @update       2. 调整部分变量声明

(function () {
    //提示: 请注意设置渠道及区服
    let server = 'hupu'; // 按需设置渠道，'hupu'=虎扑区, 'tt'=微信区
    let service = 1; //按需设置区服, 1即代表XX 1区
    let servURL = `${server + (service === 1 ? '' : service)}-api.ttnba.cn`;
    let token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token

    let xmlHttp = new XMLHttpRequest();
    let date = new Date();
    let [XLnumber, LLnumber] = getnumber(servURL, token);
    if (XLnumber > 0 || LLnumber > 0) {
        for (var i = 1; i < 6; i++) {
            xmlHttp.open('POST', `https://${servURL}/PlayerScoutFight/getArenaDetail?post_time=${date.getTime()}&TEAM_USER_TOKEN=${token}&os=m`, false)
            xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            xmlHttp.send('arena_id=' + i + '&TEAM_USER_TOKEN=${token}')
            var o = JSON.parse(xmlHttp.responseText)
            //获取目前各个训练场最高难度
            //console.log(i, o.result.player_level)
            if (i < 5) {
                if (XLnumber > 0 && XLnumber <= 3) { //遍历完成4个训练
                    for (var k = 0; k < XLnumber; k++) {
                        xmlHttp.open('POST', `https://${servURL}/PlayerScoutFight/arenaMatch?post_time=${date.getTime()}&TEAM_USER_TOKEN=${token}&os=m`, false)
                        xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
                        xmlHttp.send('arena_id=' + i + '&detail_id=' + parseInt((i - 1) * 6 + parseInt(o.result.player_level)) + '&TEAM_USER_TOKEN=${token}')
                    }
                }
            }
            else { //id=5 完成历练
                if (LLnumber > 0) {
                    for (var j = 0; j < LLnumber; j++) {
                        xmlHttp.open('POST', `https://${servURL}/PlayerScoutFight/arenaMatch?post_time=${date.getTime()}&TEAM_USER_TOKEN=${token}&os=hupu`, false)
                        xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
                        xmlHttp.send('arena_id=5' + '&detail_id=' + (parseInt(o.result.curr_detail) + j) + '&TEAM_USER_TOKEN=${token}')
                    }
                }
            }
        }
    }
})()

//获取剩余场次 返回数组[Max, Lilian]: 1-4特训取Max值(Max), 历练之路取剩余值(Lilian) 后续加上当前层数确定爬塔id
function getnumber(servURL, token) {
    var xmlHttp = new XMLHttpRequest();
    var date = new Date()
    xmlHttp.open('POST', `https://${servURL}/PlayerScoutFight/arenaIndex?post_time=${date.getTime()}&TEAM_USER_TOKEN=${token}&os=m`, false)
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xmlHttp.send('TEAM_USER_TOKEN=${token}')
    var o = JSON.parse(xmlHttp.responseText)
    var LLnumber = 3 - o.result.list[4].num
    var XLnumber
    switch (date.getDay()) {
        case 1:
        case 3:
        case 5:
            XLnumber = 3 - Math.min.apply(null, [o.result.list[0].num, o.result.list[3].num]);
            break;
        case 2:
        case 4:
        case 6:
            XLnumber = 3 - Math.min.apply(null, [o.result.list[1].num, o.result.list[2].num]);
            break;
        case 0:
            XLnumber = 3 - Math.min.apply(null, [o.result.list[0].num, o.result.list[1].num, o.result.list[2].num, o.result.list[3].num])
            break;
    }
    return [XLnumber, LLnumber]
}