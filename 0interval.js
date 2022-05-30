// 函数首次立即执行
function callinSound(){
            var callin=$('#callin')[0];
            callin.load();
            callin.play();
            //第一次执行完成后返回这个函数
            return callinSound;
}

setInterval(callinSound(),6000);
