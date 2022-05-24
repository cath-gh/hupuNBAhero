// @name         pveBoss
// @version      0.2
// @description  NBA英雄 pveBoss
// @author       Cath
// @update       去掉了倒计时、Boss已被击杀两种状态的处理

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
    else { //其他状态直接倒计时
        var datetime = new Date();
        datetime.setHours(new Date().getHours() + 1);
        datetime.setMinutes(0, 0, 0);
        var delta = datetime - new Date() - 10000; //预留出多10000ms
        setTimeout(state_bc, delta);
        console.log('%s - %s%d%s', Date().toString(), 'setTimeout(state_bc, delta) : 等待', delta/1000, '秒');
    }
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
