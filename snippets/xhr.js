var formData = new FormData();

formData.append('bag_id', 9501470);
formData.append('num', 2);
formData.append('self_sel', 773972);
formData.append('TEAM_USER_TOKEN', token);
xmlHttp.open('POST',
    `https://hupu-api.ttnba.cn/Player/useItem?post_time${date.getTime()}&
                 TEAM_USER_TOKEN=${token}&os=m`,
    false)
xmlHttp.send(formData)
var res = JSON.parse(xmlHttp.responseText);



// 定义url字符串拼接的方法
const setUrlQuery = (options) => {
    let {url,query} = options;
    if(!url) return '';
    if(query) {
        let queryArr = [];
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                queryArr.push(`${key}=${query[key]}`)
            }
        }
        if(url.indexOf('?') !== -1) {
            url =`${url}&${queryArr.join('&')}`
        } else {
            url =`${url}?${queryArr.join('&')}`
        }
    }
    return url;
}

