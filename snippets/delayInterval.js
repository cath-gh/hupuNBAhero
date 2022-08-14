var delayInterval = function (interval, state, callback, sleep) {
    let _int = -1;
    intStart = () => {
        _int = setInterval(() => {
            if (state()) {
                clearInterval(_int);
                callback();
                setTimeout(() => {
                    intStart()
                }, sleep);
            }
        }, interval);
    }
    intStart();
}