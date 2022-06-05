// @name         experience
// @version      0.1
// @description  NBA英雄 experience
// @comment      自动完成冠军经理每日历练内容，来源于微信群，在此感谢原作者

(function (){
    //提示: 请注意设置渠道及区服
    var serv = 'hupu' // 按需设置渠道，'hupu'=虎扑区, 'wx'=微信区
    var service = 1 //按需设置区服, 1即代表XX 1区
    var servURL
    switch (serv) {
        case 'hupu':
            servURL = 'hupu'+`${service==1?'':service}`+'-api.ttnba.cn'
            break;
        case 'wx':
            servURL = 'tt'+`${service==1?'':service}`+'-api.ttnba.cn'
            break;
    }

    var xmlHttp = new XMLHttpRequest();
    var date = new Date()
    var XLnumber = getnumber(servURL)[0]
    var LLnumber = getnumber(servURL)[1]
    if (XLnumber > 0 || LLnumber > 0) {
        for (var i = 1; i < 6; i++) {
            xmlHttp.open('POST',`https://`+servURL+`/PlayerScoutFight/getArenaDetail?post_time=${date.getTime()}&TEAM_USER_TOKEN=${Object.values(JSON.parse(localStorage.getItem('TEAM_USER_TOKEN')))[0]}&os=m`, false)
            xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            xmlHttp.send('arena_id='+i+'&TEAM_USER_TOKEN=${Object.values(JSON.parse(localStorage.getItem("TEAM_USER_TOKEN")))[0]}')
            var o = JSON.parse(xmlHttp.responseText)
            //获取目前各个训练场最高难度
            //console.log(i, o.result.player_level)
            if (i < 5) {
                if (XLnumber >0 && XLnumber <= 3) { //遍历完成4个训练
                    for (var k = 0; k < XLnumber; k++) {
                        xmlHttp.open('POST',`https://`+servURL+`/PlayerScoutFight/arenaMatch?post_time=${date.getTime()}&TEAM_USER_TOKEN=${Object.values(JSON.parse(localStorage.getItem('TEAM_USER_TOKEN')))[0]}&os=m`, false)
                        xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
                        xmlHttp.send('arena_id='+i+'&detail_id='+parseInt((i-1)*6 + parseInt(o.result.player_level))+'&TEAM_USER_TOKEN=${Object.values(JSON.parse(localStorage.getItem("TEAM_USER_TOKEN")))[0]}')
                    }
                }
            }
            else { //id=5 完成历练
                if ( LLnumber > 0) {
                    for (var j = 0; j < LLnumber; j++){
                        xmlHttp.open('POST',`https://`+servURL+`/PlayerScoutFight/arenaMatch?post_time=${date.getTime()}&TEAM_USER_TOKEN=${Object.values(JSON.parse(localStorage.getItem('TEAM_USER_TOKEN')))[0]}&os=hupu`, false)
                        xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
                        xmlHttp.send('arena_id=5'+'&detail_id=' + (parseInt(o.result.curr_detail) + j) + '&TEAM_USER_TOKEN=${Object.values(JSON.parse(localStorage.getItem("TEAM_USER_TOKEN")))[0]}')
                    }
                }
            }
        }
    }
})()

//获取剩余场次 返回数组[Max, Lilian]: 1-4特训取Max值(Max), 历练之路取剩余值(Lilian) 后续加上当前层数确定爬塔id
function getnumber(servURL){
    var xmlHttp = new XMLHttpRequest();
    var date = new Date()
    xmlHttp.open('POST',`https://`+servURL+`/PlayerScoutFight/arenaIndex?post_time=${date.getTime()}&TEAM_USER_TOKEN=${Object.values(JSON.parse(localStorage.getItem('TEAM_USER_TOKEN')))[0]}&os=m`, false)
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xmlHttp.send('TEAM_USER_TOKEN=${Object.values(JSON.parse(localStorage.getItem("TEAM_USER_TOKEN")))[0]}')
    //console.log(JSON.parse(xmlHttp.responseText))
    var o = JSON.parse(xmlHttp.responseText)
    var LLnumber = 3 - o.result.list[4].num
    var XLnumber
    switch(date.getDay()) {
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