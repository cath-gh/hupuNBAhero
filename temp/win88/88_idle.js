(function () {
    setInterval(() => {
        console.info(new Date())
        if (document.getElementsByClassName('pop_tab').length) {//#比赛结束界面
            angular.element(document.getElementsByClassName('pop_tab')[0].lastElementChild).triggerHandler('click') // 再来一局
            console.log('下一局开始');
        } else if (document.getElementsByClassName('win88_list').length) {//# 胜利88启动页面
            angular.element(document.getElementsByClassName('win88_list')[0]).triggerHandler('click')
            console.log('进入比赛');
        } else {
            console.info('比赛中');
        }
    }, 60000);
}())