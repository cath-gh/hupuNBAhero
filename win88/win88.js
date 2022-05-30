// @name         win88
// @version      0.1
// @description  NBA英雄 win88
// @comment      来源于微信群，原作者不可考，在此表示感谢

(function () {
    setInterval(() => {
        let giveUpScore = 0 // 底牌低于本数值自动放弃本局
        let raiseScore = 30 // 场上牌获得后超过本数值开始自动加价
        let mostRaise = 0.3 // 剩余金钱*本数值为自动加价最大值，例：当前剩余1000，该值为0.5，当前出价超过500时停止自动加价
        let allInScore = 86 // 超过本数值后无限加价
        console.log(new Date())
        if (document.getElementsByClassName('pop_tab').length) {
            angular.element(document.getElementsByClassName('pop_tab')[0].lastElementChild).triggerHandler('click') // 再来一局
            let timer = setTimeout(() => {
                clearTimeout(timer)
                angular.element(document.getElementsByClassName('leftMenu')[0].firstElementChild.children[1]).triggerHandler('click')
            }, 500);
        } else if (document.getElementsByClassName('user_score').length && document.getElementsByClassName('user_score')[0].lastElementChild) {
            if (parseFloat(document.getElementsByClassName('user_score')[0].lastElementChild.innerText) >= giveUpScore ||
                !parseFloat(document.getElementsByClassName('user_score')[0].lastElementChild.innerText)) {
                if (document.getElementsByClassName('playerCardAppear').length &&
                    document.getElementsByClassName('skillIntro').length) {
                    if (document.getElementsByClassName('card-sell-btn').length) {
                        angular.element(document.getElementsByClassName('card-sell-btn')[1]).triggerHandler('click')
                    }
                    let timer = setTimeout(() => {
                        clearTimeout(timer)
                        if (document.getElementsByClassName('playerCardAppear').length &&
                            document.getElementsByClassName('skillIntro').length &&
                            parseFloat(document.getElementsByClassName('skillIntro')[0].lastElementChild.innerText) >= raiseScore &&
                            parseFloat(document.getElementsByClassName('skillIntro')[0].lastElementChild.innerText) <= 88
                        ) {
                            let nowPrice = 0
                            for (let i = 0; i < document.getElementsByClassName('bid').length; i++) {
                                if (document.getElementsByClassName('bid')[i].className.indexOf('ng-hide') == -1) {
                                    nowPrice = parseFloat(document.getElementsByClassName('bid_num')[i].getAttribute('number'))
                                    break;
                                }
                            }
                            if (nowPrice + 40 <= parseInt(document.getElementsByClassName('player_gold')[7].innerText) * mostRaise) {
                                angular.element(document.getElementsByClassName('bid_button')[0]).triggerHandler('click')
                            } else if (parseFloat(document.getElementsByClassName('skillIntro')[0].lastElementChild.innerText) >= allInScore) {
                                angular.element(document.getElementsByClassName('bid_button')[0]).triggerHandler('click')
                            }
                        }
                    }, 3000);
                }
            } else {
                console.error('底牌：' + parseFloat(document.getElementsByClassName('user_score')[0].lastElementChild.innerText))
                angular.element(document.getElementsByClassName('card-sell-btn')[0]).triggerHandler('click')
            }
        } else if (document.getElementsByClassName('win88_list').length) {
            angular.element(document.getElementsByClassName('win88_list')[0]).triggerHandler('click')
            let timer = setTimeout(() => {
                clearTimeout(timer)
                angular.element(document.getElementsByClassName('leftMenu')[0].firstElementChild.children[1]).triggerHandler('click')
            }, 500);
        } else {
            console.error('请刷新重试')
        }
    }, 2000);
}())