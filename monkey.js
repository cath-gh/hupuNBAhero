// ==UserScript==
// @name         网络拦截测试
// @namespace    https://windliang.wang/
// @version      0.1
// @description  测试
// @author       windliang
// @match        https://www.baidu.com/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    const originOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (_, url) {
console.log(url);
    //url = url.replace(/&wd=[^&]*/,'&wd=c');
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




})();
