// @name         pveBoss
// @version      0.51d
// @description  NBA英雄 pveBoss
// @author       Cath
// @update       1. log函数增加颜色并粗体显示，方便与官方log区分

//#region util
// 获取待执行函数的scope
var getFuncScope = function (selector) {
    return angular.element(selector).scope();
}

// 检测是否为指定页面，成功后执行cb函数
var checkPage = function (pageIdentifier, interval, cb) {
    interval = interval || 200;//检查间隔默认为200ms
    var intCheck = setInterval(() => {
        if (pageIdentifier()) {
            clearInterval(intCheck);
            cb();
        }
    }, interval);
}

// 简单的一个通用log函数
var log = function (property, value) {
    console.info('%c%s - %s : %s', 'color:blue;font-weight:bold', Date().toString(), property, value);
}
//#endregion

//#region refreshPveBossPage
// 刷新页面
var refreshPveBossPage = function () {
    log('refreshPveBossPage', '刷新页面');
    pveBossBack() //从boss挑战返回列表
    checkPage(pageIdCardwar, 200, pveBoss);
}

// 竞技场页面识别符
var pageIdCardwar = function () {
    return document.getElementsByClassName('cardwar-pvelist').length !== 0
};

// Boss挑战页面识别符
var pageIdpveBoss = function () {
    document.getElementsByClassName('cardwar-pve-boss-cash').length !== 0
};

// 进入Boss挑战页面的selector和func
var selectorPveBoss = document.getElementsByClassName('cardwar-pvelist-3');
var pveBoss = function () {
    log('pveBoss', '挑战Boss');
    getFuncScope(selectorPveBoss).goPveBoss();
}

// 从boss挑战页面返回的selector和func
var selectorPveBossBack = document.getElementsByClassName('cardwar-pve-boss-back');
var pveBossBack = function () {
    log('pveBossBack', '挑战Boss页面返回');
    getFuncScope(selectorPveBossBack).cardWarGoBack();
}
//#endregion

//#region killBoss
//Number(document.querySelector('.life-num').textContent.slice(9,14))
var count_boss_challenge = 0;

// 击杀boss
var killboss = function () {
    // checkPage(pageIdAttackBoss, 1000, attackBoss);
    // checkPage(pageIdContinueBoss, 800, continueBoss);

    log('killBoss', '击杀boss')
    let isAttack = document.getElementsByClassName('card-btn-text')[0]?.innerText === '立即挑战';
    if (isAttack) {
        attackBoss();
    };

    let isContinue = document.getElementsByClassName('btn')[2]?.children[1].innerText === '继续挑战';

    if (isContinue) {
        continueBoss();
        count_boss_challenge += 1;
        log('count_boss_challenge', count_boss_challenge);
    };
}

// Boss挑战页面立即挑战识别符
var pageIdAttackBoss = function () {
    return document.getElementsByClassName('card-btn-text')[0]?.innerText === '立即挑战';
};

// Boss挑战完成页面继续挑战识别符
var pageIdContinueBoss = function () {
    document.getElementsByClassName('btn')[2]?.children[1].innerText === '继续挑战';
};

// 击杀boss的selector和func
var selectorAttackBoss = document.getElementsByClassName('monthgift-btn');
var attackBoss = function () {
    log('attackBoss', '立即挑战');
    getFuncScope(selectorAttackBoss).joinAttackBoss();
}

// 继续挑战boss的selector和func
var selectorContinueBoss = document.getElementsByClassName('btn');
var continueBoss = function () {
    log('continueBoss', '继续挑战');
    getFuncScope(selectorContinueBoss).goContinueBoss(false, 3); //不知道3是什么意思，反正99就回到公会boss了
}
//#endregion

// 刷新状态
var boss_challenge = function () {
    log('boss_challenge', 'Boss挑战开启');
    refreshPveBossPage();
    setTimeout(state_check, 1000);
}

// 状态监测
var state_check = function () {
    log('state_check', '状态监测');
    log('领取奖励状态', !!document.querySelector('.cw-popup-restrain-btn'));
    log('boss已被击杀状态', !!document.querySelector('.boss-was_killed'));
    log('boss倒计时状态', !!document.getElementsByClassName('boss-soon-time').length);
    log('冷却状态', !!document.querySelector('.text1'));
    log('boss challenge状态', !!document.querySelector('.cardwar-pve-boss-challenge'));

    if (document.querySelector('.text1') || document.querySelector('.cardwar-pve-boss-challenge')) state_bc();
    else {
        var datetime = new Date();
        datetime.setHours(new Date().getHours() + 1);
        datetime.setMinutes(0, 0, 0);
        var delta = datetime - new Date() - 10000; //预留出多10000ms
        setTimeout("refreshPveBossPage(); state_bc();", delta);
        console.info('%s - %s%d%s', Date().toString(), 'setTimeout("refreshPveBossPage(); state_bc();", delta) : 等待', delta / 1000, '秒');
    }
}

// boss challenge状态
var state_bc = function () {
    log('state_bc', 'boss challenge状态');

    int_bc = setInterval(
        () => {
            killboss();
            if (document.querySelector('.boss-was_killed')) {
                clearInterval(int_bc);
                log('clearInterval(int_bc)', '清除击杀boss计时器');
                count_boss_challenge = 0;
                log('count_boss_challenge', '击杀boss次数归零');
                boss_challenge();
            };
        }, 1000)
}

boss_challenge();
