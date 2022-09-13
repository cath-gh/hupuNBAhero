// 植入切片
let hurtori = angular.element(document.getElementsByClassName('monthgift-btn')).scope().hurtReceive
angular.element(document.getElementsByClassName('monthgift-btn')).scope().hurtReceive=function(){console.log('lalalla');hurtori();}
angular.element(document.getElementsByClassName('monthgift-btn')).scope().hurtReceive()

const AOP = {}
AOP.before = function (fn, before) {
    return function() {
        before.apply(this,arguments)
        fn.apply(this, arguments)
    }
}
AOP.after = function(fn, after) {
    return function () {
        fn.apply(this, arguments)
        after.apply(this, arguments)
    }
}

// 点击按钮提交数据
function submit() {
    console.log('提交数据')
}

document.querySelector('.btn').onclick = submit

// 在原有功能基础上做点装饰：点击按钮，提交数据前做个校验
function submit() {
    console.log(this)
    console.log('提交数据')
}
function check() {
    console.log(this)
    console.log('先进行校验')
}
submit = AOP.before(submit, check)
document.querySelector('.btn').onclick = submit