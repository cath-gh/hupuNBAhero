// @name         pveBoss
// @version      0.4
// @description  NBA英雄 pveBoss
// @author       Cath
// @update       1. 增加了Boss血量判断，方便抢Boss，似乎不好使

//Number(document.querySelector('.life-num').textContent.slice(9,14))
var count_boss_challenge = 0;

// 击杀boss
var killboss = function () {
    if (document.querySelector('.cardwar-pve-boss-challenge')) {
        angular.element(document.querySelector('.cardwar-pve-boss-challenge')).triggerHandler('click');
    };
    if (document.querySelectorAll('.btn span')[2]) {
        angular.element(document.querySelectorAll('.btn span')[2]).triggerHandler('click');
        count_boss_challenge += 1;
        console.info('%s - %s : %d', Date().toString(), 'count_boss_challenge', count_boss_challenge);
    };
}

// 刷新页面
var boss_challenge = function () {
    console.info('%s - %s', Date().toString(), 'boss_challenge : 刷新页面');
    angular.element(document.querySelector('.cardwar-pve-boss-back')).triggerHandler('click'); //从boss挑战返回列表
    angular.element(document.querySelector('.cardwar-pvelist-3')).triggerHandler('click'); //进入boss挑战
    setTimeout("state_check();", 1000);
}

// 状态监测
var state_check = function () {
    console.info('%s - %s', Date().toString(), 'state_check : 状态监测');
    console.info('%s - %s : %s', Date().toString(), '领取奖励状态', !!document.querySelector('.cw-popup-restrain-btn'));
    console.info('%s - %s : %s', Date().toString(), 'boss已被击杀状态', !!document.querySelector('.boss-was_killed'));
    console.info('%s - %s : %s', Date().toString(), 'boss倒计时状态', !!document.querySelector('.boss-soon-time'));
    console.info('%s - %s : %s', Date().toString(), '冷却状态', !!document.querySelector('.text1'));
    console.info('%s - %s : %s', Date().toString(), 'boss challenge状态', !!document.querySelector('.cardwar-pve-boss-challenge'));

    if (document.querySelector('.text1') || document.querySelector('.cardwar-pve-boss-challenge')) state_bc();
    else {
        var datetime = new Date();
        datetime.setHours(new Date().getHours() + 1);
        datetime.setMinutes(0, 0, 0);
        var delta = datetime - new Date() - 10000; //预留出多10000ms
        setTimeout(state_bc, delta);
        console.info('%s - %s%d%s', Date().toString(), 'setTimeout(state_bc, delta) : 等待', delta / 1000, '秒');
    }
}

// boss challenge状态
var state_bc = function () {
    console.info('%s - %s', Date().toString(), 'state_bc : boss challenge状态');
    int_bc = setInterval(
        () => {
            cont = document.querySelector('.life-num').textContent;
            boss_life = Number(cont.slice(9, cont.indexOf('/')));
            console.info('%s - %s%s', Date().toString(), 'boss_life : ', boss_life);
            if (boss_life > 20000 || boss_life < 3000) killboss();
            if (document.querySelector('.boss-was_killed')) {
                clearInterval(int_bc);
                console.info('%s - %s', Date().toString(), 'clearInterval(int_bc) : 清除击杀boss计时器');
                count_boss_challenge = 0;
                console.info('%s - %s', Date().toString(), 'count_boss_challenge : 击杀boss次数归零');
                boss_challenge();
            };
        }, 1000)
}

boss_challenge();
