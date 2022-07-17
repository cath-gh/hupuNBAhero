var a = [{ 'a1': 1, 'a2': 2 }, { 'a1': 1, 'a2': 3 }, { 'a1': 1, 'a2': 4 }, { 'a1': 2, 'a2': 5 }, { 'a1': 2, 'a2': 6 }];
if (!Array.prototype.findLast) {
  Array.prototype.findLast = function(predicate) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = length-1; i >=0; i--) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
} 
a.findLast((item) => { return item.a1 === 1 });
