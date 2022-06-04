// @name         pveBoss_request
// @version      0.11
// @description  NBA英雄 pveBoss_request
// @author       Cath
// @update      1. 修正了工会boss的url

///提示: 请先配置脚本的渠道、区服
var server = 'hupu' // 按需设置渠道，'hupu'=虎扑区, 'wx'=微信区
var service = 1 //按需设置区服, 1即代表XX 1区
var Hourset = [9, 10, 11, 12, 13, 14]
//调整Hourset[ ]内整点数, 可限定只打某些整点的BOSS,默认全打(外线、锋线BOSS性价比较高)
var t = 4000 //初始间隔时间, 默认4秒

server = server === 'hupu' ? server : 'tt';
service = service === 1 ? '' : service;

var servURL = `${server + service}-api.ttnba.cn`

//开启循环脚本
var intervBoss = setInterval((function close(j) {
    return function () {
        fn(j)
    }
})(servURL, Hourset), t);

function fn() {
    var xmlHttp = new XMLHttpRequest();
    var date = new Date()
    // (虎扑1区) 9点-lv.28勇士均衡 10点-lv30猛龙外线 11点-lv28猛龙外线 12点-lv28小牛内线 13点-lv28勇士均衡 14点-lv28七六人锋线
    //特殊Boss: 一般在10点, 即平日10点后boss会顺延
    var Hour = date.getHours()
    var Minutes = date.getMinutes()

    // 日常Boss
    if (((Hourset.indexOf(Hour) > -1)) || (Hourset.indexOf(Hour + 1) > -1 && Minutes >= 49)) {
        xmlHttp.open('GET',
            `https://` + servURL + `/PlayerFight/killBoss?post_time=${date.getTime()}&
                 TEAM_USER_TOKEN=${Object.values(JSON.parse(localStorage.getItem('TEAM_USER_TOKEN')))[0]}&os=m`,
            false)
        console.log(`https://` + servURL + `/PlayerFight/killBoss?post_time=${date.getTime()}&
            TEAM_USER_TOKEN=${Object.values(JSON.parse(localStorage.getItem('TEAM_USER_TOKEN')))[0]}&os=m`)
        xmlHttp.send(null)
        var res = JSON.parse(xmlHttp.responseText);
        console.log(res)
        switch (res.status) {
            case -1200:
                console.error('【自动BOSS脚本】token过期，请重新获取')
                break
            case -8409:
                if (Hourset.indexOf(Hour + 1) > -1 && Minutes >= 49) {
                    t = 4000
                    clearInterval(intervBoss)
                    intervBoss = setInterval(fn, t)
                    console.log('【自动BOSS脚本】临近BOSS，开始4秒快刷新模式')
                    break
                } else {
                    t = 600000
                    clearInterval(intervBoss)
                    intervBoss = setInterval(fn, t)
                    console.log('【自动BOSS脚本】BOSS未开放，进入10分钟刷新模式')
                    break
                }
            case -8404:
                console.log('【自动BOSS脚本】Boss已击败，脚本进入10分钟刷新模式')
                t = 600000
                clearInterval(intervBoss)
                intervBoss = setInterval(fn, t)
                break
        }
    }
    //工会Boss
    else if (date.getDay() == 6 && ((Hour == 19 && Minutes >= 49) || Hour == 20)) {
        xmlHttp.open('POST',
            `https://` + servURL + `/PlayerFight/killSociatyBoss?post_time=${date.getTime()}
        &TEAM_USER_TOKEN=${Object.values(JSON.parse(localStorage.getItem('TEAM_USER_TOKEN')))[0]}&os=m`,
            false)
        console.log(`https://` + servURL + `/PlayerFight/killSociatyBoss?post_time=${date.getTime()}
        &TEAM_USER_TOKEN=${Object.values(JSON.parse(localStorage.getItem('TEAM_USER_TOKEN')))[0]}&os=m`)
        xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlHttp.send(null)
        var res1 = JSON.parse(xmlHttp.responseText);
        console.log(res1)
        if (Hour == 20) {
            switch (res1.status) {
                case -8417:
                    console.log('【自动BOSS脚本】工会Boss已击败，脚本进入10分钟刷新模式')
                    t = 600000
                    clearInterval(intervBoss)
                    intervBoss = setInterval(fn, t)
                    break
            }
        }
    }
    else {
        t = 600000
        clearInterval(intervBoss)
        intervBoss = setInterval(fn, t)
        console.log('【自动BOSS脚本】BOSS不在目标列表内，进入10分钟刷新模式')
    }
    console.log((date.toLocaleString()) + "\n【自动BOSS脚本】当前刷新频率：", (t / 1000), "秒")
}