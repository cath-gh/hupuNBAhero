function dfs(obj) {
    if (obj instanceof Object) {
        let stack = [];
        let entries = Object.entries(obj);
        entries.map(item => item.push(obj));
        stack.push(...entries);
        while (stack.length) {
            let el = stack.pop();
            console.log(el);
            if (el[1] instanceof Object) {
                entries = Object.entries(el[1]);
                entries.map(item => item.push(el[2][el[0]]));
                stack.push(...entries)
            }
        }
    }
}

function dfs2(obj) {
    if (obj instanceof Object) {
        let stack = [];
        let entries = Object.entries(obj);
        entries.map(item => item.push(obj));
        stack.push(...entries);
        while (stack.length) {
            let el = stack.pop();
            console.log(el);
            let jo = isJSON(el[1]);
            if (jo) {
                el[2][el[0]] = jo;
                el[1] = jo;
            }

            if (el[1] instanceof Object) {
                entries = Object.entries(el[1]);
                entries.map(item => item.push(el[2][el[0]]));
                stack.push(...entries)
            }
        }
    }
}

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return obj;
            } else {
                return false;
            }

        } catch (e) {
            console.log('error：' + str + '!!!' + e);
            return false;
        }
    }
    console.log('It is not a string!')
}