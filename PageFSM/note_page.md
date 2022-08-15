## 争霸赛界面
### 开启挑战
#### 选择器
`document.getElementsByClassName('status_open')[0]`

#### 执行
`angular.element(document.getElementsByClassName('status_open')[0]).triggerHandler('click')`

### 取消匹配
#### 选择器
`document.getElementsByClassName('status_match')[0]`

#### 执行
`angular.element(document.getElementsByClassName('status_match')[0]).triggerHandler('click')`



## 胜利88启动界面
### 初级房
#### 选择器
`document.getElementsByClassName('win88_list')[0]`

#### 执行
`angular.element(document.getElementsByClassName('win88_list')[0]).triggerHandler('click')`

## 比赛结束界面
### 离开
#### 选择器
1. `document.getElementsByClassName('pop_tab')[0].firstElementChild`
2. `document.getElementsByClassName('pop_tab')[0].children[0]`
3. `$('.pop_tab')[0].children[0]` //暂不支持

#### 执行
`angular.element(document.getElementsByClassName('pop_tab')[0].firstElementChild).triggerHandler('click')`

### 再来一局
#### 选择器
1.  `document.getElementsByClassName('pop_tab')[0].lastElementChild`
2. `document.getElementsByClassName('pop_tab')[0].children[1]`
3. `$('.pop_tab')[0].children[1]` //暂不支持

#### 执行
`angular.element(document.getElementsByClassName('pop_tab')[0].lastElementChild).triggerHandler('click')`

## 比赛界面
### 左上角按钮 - 离开
#### 选择器
`document.getElementsByClassName('leftMenu')[0].children[0].children[1]`

#### 执行
`angular.element(document.getElementsByClassName('leftMenu')[0].children[0].children[1]).triggerHandler('click')`

### 左上角按钮 - 换桌
#### 选择器
`document.getElementsByClassName('leftMenu')[0].children[0].children[2]`

#### 执行
`angular.element(document.getElementsByClassName('leftMenu')[0].children[0].children[2]).triggerHandler('click')`

### 左上角按钮 - 说明
#### 选择器
`document.getElementsByClassName('leftMenu')[0].children[0].children[3]`

#### 执行
`angular.element(document.getElementsByClassName('leftMenu')[0].children[0].children[3]).triggerHandler('click')`

### 左上角按钮 - 说明 - 我知道了
#### 选择器
`document.getElementsByClassName('card-explain-btn')[0]`

#### 执行
`angular.element(document.getElementsByClassName('card-explain-btn')[0]).triggerHandler('click')`