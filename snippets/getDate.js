// class _Date extends Date {
//     constructor(...args) {
//         /*方式一
//         var timezone=8;//指定时区
//         var offset_GMT = new Date().getTimezoneOffset(); 
//         var delta = offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000;
//         */

//         //方式二
//         var delta = -3600000//韩国时区，固定偏移
//         if (args.length === 0) {
//             super(new Date().getTime() + delta);
//         } else {
//             super(...args);
//         }
//     }
// }

class _Date extends Date {
    constructor(...args) {
        /*方式一
        var timezone=8;//指定时区
        var offset_GMT = new Date().getTimezoneOffset(); 
        var delta = offset_GMT / 60 + timezone;
        */

        //方式二
        var delta = -1//韩国时区，固定偏移
        super(...args);
    }
    getHours() {
        return super.getHours() + delta;
    }
}