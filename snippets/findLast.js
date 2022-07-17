var a = [{ 'a1': 1, 'a2': 2 }, { 'a1': 1, 'a2': 3 }, { 'a1': 1, 'a2': 4 }, { 'a1': 2, 'a2': 5 }, { 'a1': 2, 'a2': 6 }];
if (![].findLast) {
    Array.prototype.findLast = function (arr, callback, thisArg) {
        for (let index = arr.length - 1; index >= 0; index--) {
            const value = arr[index];
            if (callback.call(thisArg, value, index, arr)) {
                return value;
            }
        }
        return undefined;
    }
}
a.findLast((item) => { return item.a1 === 1 });

// if (![].findLast) {
//     Array.prototype.findLast = function (arr, callback, thisArg) {
//         for (let index = arr.length - 1; index >= 0; index--) {
//             const value = arr[index];
//             if (callback.call(thisArg, value, index, arr)) {
//                 return value;
//             }
//         }
//         return undefined;
//     }
// }