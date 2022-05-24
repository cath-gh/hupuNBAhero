// @name         pveBoss
// @version      0.1
// @description  NBA英雄 pveBoss
// @author       Cath

// 原始版本
// 来源于公会群，原作者不可考了，但在此表示感谢
// int1 = setInterval(
//     () => {
//         if (document.querySelector('.cardwar-pve-boss-challenge')) {
//             angular.element(document.querySelector('.cardwar-pve-boss-challenge')).triggerHandler('click');
//         };
//         if (document.querySelectorAll('.btn span')[2]) {
//             angular.element(document.querySelectorAll('.btn span')[2]).triggerHandler('click');
//         };
//     }, 1000)

var count_boss_challenge = 0;

// 击杀boss
var killboss = function () {
    if (document.querySelector('.cardwar-pve-boss-challenge')) {
        angular.element(document.querySelector('.cardwar-pve-boss-challenge')).triggerHandler('click');
    };
    if (document.querySelectorAll('.btn span')[2]) {
        angular.element(document.querySelectorAll('.btn span')[2]).triggerHandler('click');
        count_boss_challenge += 1;
        console.log('%s - %s : %d', Date().toString(), 'count_boss_challenge', count_boss_challenge);
    };
}

// 刷新页面
var boss_challenge = function () {
    console.log('%s - %s', Date().toString(), 'boss_challenge : 刷新页面');
    angular.element(document.querySelector('.cardwar-pve-boss-back')).triggerHandler('click'); //从boss挑战返回列表
    setTimeout("angular.element(document.querySelector('.cardwar-pvelist-3')).triggerHandler('click')", 500); //进入boss挑战
    state_check();
}

// 状态监测
var state_check = function () {
    console.log('%s - %s', Date().toString(), 'state_check : 状态监测');
    if (document.querySelector('.cw-popup-restrain-btn')) state_bonus(); // 领取奖励状态
    else if (document.querySelector('.boss-was_killed')) state_bwk(); // boss已被击杀状态
    else if (document.querySelector('.boss-soon-time')) state_bst(); // boss倒计时状态
    else if (document.querySelector('.cardwar-pve-boss-challenge')) state_bc(); // boss challenge状态
}

// boss已被击杀状态
var state_bwk = function () {
    console.log('%s - %s', Date().toString(), 'state_bwk : boss已被击杀状态');
    bwk = 30;
    var timer_bwk = bwk * 60 * 1000;
    // var timer_bwk = 5 * 1000;
    setTimeout(boss_challenge, timer_bwk);
    console.log('%s - %s%d%s', Date().toString(), 'setTimeout(boss_challenge, timer_bwk) : 等待', bwk, '分钟');
}

// boss倒计时状态
var state_bst = function () {
    console.log('%s - %s', Date().toString(), 'state_bst : boss倒计时状态');
    var bst = document.querySelector('.boss-soon-time').textContent;
    console.log('%s - %s %s', Date().toString(), 'bst : boss倒计时时间', bst);
    bst = Number(bst.slice(2, 4));
    if (bst > 1) {
        var timer_bst = bst * 60 * 1000 + 1000;
        setTimeout(boss_challenge, timer_bst);
        console.log('%s - %s%d%s', Date().toString(), 'setTimeout(boss_challenge, timer_bst) : 等待', bst, '分钟');
    }
    else state_bc()
}

// boss challenge状态
var state_bc = function () {
    console.log('%s - %s', Date().toString(), 'state_bc : boss challenge状态');
    int_bc = setInterval(
        () => {
            killboss();
            if (document.querySelector('.boss-was_killed')) {
                clearInterval(int_bc);
                console.log('%s - %s', Date().toString(), 'clearInterval(int_bc) : 清除击杀boss计时器');
                count_boss_challenge = 0;
                console.log('%s - %s', Date().toString(), 'count_boss_challenge : 击杀boss次数归零');
                boss_challenge();
            };
        }, 1000)
}

// 领取奖励状态
var state_bonus = function () {
    console.log('%s - %s', Date().toString(), 'state_bc : 领取奖励状态');
    var bonus = document.querySelector('.cw-popup-restrain-btn');
    console.log('%s - %s : %s', Date().toString(), 'bonus', bonus.textContent);
    angular.element(bonus).triggerHandler('click');
    setTimeout(boss_challenge, 1000);
}

boss_challenge();
