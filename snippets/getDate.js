class _Date extends Date {
    constructor(...args) {
        super(...args);
    }
    getTimezoneHours(timezone) {//指定时区
        var offset_GMT = new Date().getTimezoneOffset();
        var delta = offset_GMT / 60 + timezone;
        return this.getHours() + delta;
    }
}