(function () {
    setInterval(() => {
        let base_score = document.getElementsByClassName('user_score')[0].lastElementChild.innerText;

        let giveUpScore = 0 // 底牌低于本数值自动放弃本局
        let raiseScore = 30 // 场上牌获得后超过本数值开始自动加价
        let mostRaise = 0.5 // 剩余金钱*本数值为自动加价最大值，例：当前剩余1000，该值为0.5，当前出价超过500时停止自动加价
        let allInScore = 85 // 超过本数值后无限加价
        console.log(new Date())
        if (document.getElementsByClassName('pop_tab').length) {//#比赛结束界面
            angular.element(document.getElementsByClassName('pop_tab')[0].lastElementChild).triggerHandler('click') // 再来一局
        } else if (document.getElementsByClassName('user_score').length && base_score) {
            if (parseFloat(base_score) >= giveUpScore ||
                !parseFloat(base_score)) {
                if (document.getElementsByClassName('playerCardAppear').length &&
                    document.getElementsByClassName('skillIntro').length) {
                    if (document.getElementsByClassName('card-sell-btn').length) {
                        angular.element(document.getElementsByClassName('card-sell-btn')[1]).triggerHandler('click')
                    }
                    let timer = setTimeout(() => {
                        let done_score = document.getElementsByClassName('skillIntro')[0].lastElementChild.innerText;

                        clearTimeout(timer)
                        if (document.getElementsByClassName('playerCardAppear').length &&
                            document.getElementsByClassName('skillIntro').length &&
                            parseFloat(done_score) >= raiseScore &&
                            parseFloat(done_score) <= 88
                        ) {// #核心加价算法
                            let nowPrice = 0
                            for (let i = 0; i < document.getElementsByClassName('bid').length; i++) {
                                if (document.getElementsByClassName('bid')[i].className.indexOf('ng-hide') == -1) {
                                    nowPrice = parseFloat(document.getElementsByClassName('bid_num')[i].getAttribute('number'))
                                    break;
                                }
                            }
                            if (nowPrice + 40 <= parseInt(document.getElementsByClassName('player_gold')[7].innerText) * mostRaise) {// #小于加价最高限值
                                angular.element(document.getElementsByClassName('bid_button')[0]).triggerHandler('click')// #加价
                            } else if (parseFloat(done_score) >= allInScore) {
                                angular.element(document.getElementsByClassName('bid_button')[0]).triggerHandler('click')// #加价
                            }
                        }
                    }, 3000);
                }
            } else {
                console.error('底牌：' + parseFloat(base_score))
                angular.element(document.getElementsByClassName('card-sell-btn')[0]).triggerHandler('click')
            }
        } else if (document.getElementsByClassName('win88_list').length) {//# 胜利88启动页面
            angular.element(document.getElementsByClassName('win88_list')[0]).triggerHandler('click')
        } else {
            console.error('请刷新重试')
        }
    }, 2000);
}())