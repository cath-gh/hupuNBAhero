// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://hupu-cdn.ttnba.cn/*
// @match        https://hupu-api.ttnba.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ttnba.cn
// @grant        none
// ==/UserScript==

(function() {
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        console.log(url);
        url = url.replace(/&limit=[^&]*/,'&limit=200');
        console.log('=====================');
        const xhr = this;
        const getter = Object.getOwnPropertyDescriptor(
            XMLHttpRequest.prototype,
            "response"
        ).get;
        Object.defineProperty(xhr, "responseText", {
            get: () => {
                let result = getter.call(xhr);
                try {
                    const res = JSON.parse(result);
                    res.data.push('油猴脚本修改数据')
                    return JSON.stringify(res);
                } catch (e) {
                    return result;
                }
            },
        });

        originOpen.apply(this, arguments);
    };
    const originSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (data) {
        console.log(typeof(data));
        if(typeof(data)==='string'){
            data = data.replace(/"limit":[^,]*/,'"limit":200');
        }
        console.log('=====================');
        const xhr = this;

        originSend.apply(this, arguments);
    };
})();