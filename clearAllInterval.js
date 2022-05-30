// 清楚所有计时器
let end = setInterval(function () { }, 10000);
for (let i = 1; i <= end; i++) {
    clearInterval(i);
}