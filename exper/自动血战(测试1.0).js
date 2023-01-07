(async function () {
        // 该脚本推荐血战好打的玩家使用，血战不好打的玩家中途某个阵容如果打不过会卡住，不推荐使用
        // 第一阵容挑战前三关，第二阵容挑战中三关，第三阵容挑战后四关，如需调整，请自行调整脚本最下方挑战顺序
        // 按顺序输入三个阵容的球员名称，请使用原名，不要使用购买的昵称
        // 选择完阵容后运行代码即可，一般4-5秒内就会自动打完，再退出重进领奖励即可

        const service = 1 // 区服
        const token = JSON.parse(localStorage.getItem('TEAM_USER_TOKEN'))['170' + service]

        // 第一阵容 ↓
        let first = [{
            name: '达米安-利拉德',
            id: ''
        }, {
            name: '克雷-汤普森',
            id: ''
        }, {
            name: '本-西蒙斯',
            id: ''
        }, {
            name: '乔尔-恩比德',
            id: ''
        }, {
            name: '凯文-勒夫',
            id: ''
        }]
        // 第二阵容 ↓
        let second = [{
            name: '扎克-拉文',
            id: ''
        }, {
            name: '德文-布克',
            id: ''
        }, {
            name: '保罗-乔治',
            id: ''
        }, {
            name: '尼科拉-约基奇',
            id: ''
        }, {
            name: '安东尼-唐斯',
            id: ''
        }]
        // 第三阵容 ↓
        let third = [{
            name: 'R-威斯布鲁克',
            id: ''
        }, {
            name: '扎克-拉文',
            id: ''
        }, {
            name: '科怀-伦纳德',
            id: ''
        }, {
            name: '德雷蒙德-格林',
            id: ''
        }, {
            name: '安德烈-德拉蒙德',
            id: ''
        }]

        function getLineUpId() {
            return new Promise((resolve, reject) => {
                let xmlHttp = new XMLHttpRequest();
                let timer = new Date()
                xmlHttp.open('POST',
                    `https://hupu${service==1?'':service}-api.ttnba.cn/battle/checkBattleLineup?post_time=${timer.getTime()}
          &TEAM_USER_TOKEN=${token}&os=m`,
                    false)
                let formData = new FormData()
                formData.append('TEAM_USER_TOKEN', token)
                xmlHttp.send(formData)
                let res = JSON.parse(xmlHttp.responseText);
                resolve(res.result)
            })
        }

        function getAllCard(pos) {
            return new Promise((resolve, reject) => {
                let xmlHttp = new XMLHttpRequest();
                let timer = new Date()
                xmlHttp.open('POST',
                    `https://hupu${service==1?'':service}-api.ttnba.cn/battle/playerBattleDetail?post_time=${timer.getTime()}
        &TEAM_USER_TOKEN=${token}&os=m`,
                    false)
                let formData = new FormData()
                formData.append('TEAM_USER_TOKEN', token)
                formData.append('pos', pos)
                xmlHttp.send(formData)
                let res = JSON.parse(xmlHttp.responseText);
                res.result.list.map(item => {
                    if (item.card_info.base_name == first[pos - 1].name) {
                        first[pos - 1].id = item.id
                    } else if (item.card_info.base_name == second[pos - 1].name) {
                        second[pos - 1].id = item.id
                    } else if (item.card_info.base_name == third[pos - 1].name) {
                        third[pos - 1].id = item.id
                    }
                })
                resolve('ok')
            })
        }

        function lineUp(card_id, pos) {
            return new Promise((resolve, reject) => {
                let xmlHttp = new XMLHttpRequest();
                let timer = new Date()
                xmlHttp.open('POST',
                    `https://hupu${service==1?'':service}-api.ttnba.cn/PlayerFight/lineup?post_time=${timer.getTime()}
            &TEAM_USER_TOKEN=${token}&os=m`,
                    false)
                let formData = new FormData()
                formData.append('TEAM_USER_TOKEN', token)
                formData.append('lineup_type', '4')
                formData.append('lineup_id', lineup_id)
                formData.append('card_id', card_id)
                formData.append('pos', pos)
                xmlHttp.send(formData)
                let res = JSON.parse(xmlHttp.responseText);
                if (res.status != 0) {
                    console.error(res.message)
                }
                resolve('ok')
            })
        }

        function challenge(barrier_no) {
            return new Promise((resolve, reject) => {
                let xmlHttp = new XMLHttpRequest();
                let timer = new Date()
                xmlHttp.open('POST',
                    `https://hupu${service==1?'':service}-api.ttnba.cn/battle/challenge?post_time=${timer.getTime()}
            &TEAM_USER_TOKEN=${token}&os=m`,
                    false)
                let formData = new FormData()
                formData.append('TEAM_USER_TOKEN', token)
                formData.append('barrier_no', barrier_no)
                xmlHttp.send(formData)
                let res = JSON.parse(xmlHttp.responseText);
                if (res.status != 0) {
                    console.error(res.message)
                }
                resolve('ok')
            })
        }

        let lineup_id = await getLineUpId()
        await Promise.all([getAllCard(1), getAllCard(2), getAllCard(3), getAllCard(4), getAllCard(5)])
        let flag = true
        first.map(item => {
            if (!item.id) {
                console.error('第一阵容中‘' + item.name + '’昵称不正确或该球员未被选入15人名单')
                flag = false
            }
        })
        second.map(item => {
            if (!item.id) {
                console.error('第二阵容中‘' + item.name + '’昵称不正确或该球员未被选入15人名单')
                flag = false
            }
        })
        third.map(item => {
            if (!item.id) {
                console.error('第三阵容中‘' + item.name + '’昵称不正确或该球员未被选入15人名单')
                flag = false
            }
        })
        if (!flag) return
        // 换阵 ↓
        await Promise.all([lineUp(first[0].id, 1), lineUp(first[1].id, 2), lineUp(first[2].id, 3), lineUp(first[3].id, 4), lineUp(first[4].id, 5)])
        // 挑战 ↓
        await challenge('1')
        await challenge('2')
        await challenge('3')
        // 换阵 ↓
        await Promise.all([lineUp(second[0].id, 1), lineUp(second[1].id, 2), lineUp(second[2].id, 3), lineUp(second[3].id, 4), lineUp(second[4].id, 5)])
        // 挑战 ↓
        await challenge('4')
        await challenge('5')
        await challenge('6')
        await challenge('7')
        // 换阵 ↓
        await Promise.all([lineUp(third[0].id, 1), lineUp(third[1].id, 2), lineUp(third[2].id, 3), lineUp(third[3].id, 4), lineUp(third[4].id, 5)])
        // 挑战 ↓
        await challenge('8')
        await challenge('9')
        await challenge('10')
        console.log('自动血战结束...')
    }())