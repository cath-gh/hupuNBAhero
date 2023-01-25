var getDate=function(timezone){//获取指定时区的时间
    var offset_GMT = new Date().getTimezoneOffset(); 
    var nowDate = new Date().getTime(); 
    var targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);return targetDate;
    }