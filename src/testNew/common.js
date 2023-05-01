const URLPATH_PLAYER_CARD_LIST = '/PlayerFight/playerCardList'; // 用户球员卡牌
const PLAYER_POS = {
    '全部': 0,
    '控卫': 1,
    '分卫': 2,
    '小前': 3,
    '大前': 4,
    '中锋': 5
};
const PLAYER_SORT = {
    '品质': 1,
    '战力': 2,
    '两分': 3,
    '三分': 4,
    '助攻': 5,
    '篮板': 6,
    '抢断': 7,
    '封盖': 8,
    '卡量': 9,
}

const URLPATH_PLAYER_CARD_STAR_LIST = '/Playercardstar/starList';
const URLPATH_CHECK_INHERIT = '/Playercardstar/checkInherit';
const URLPATH_SET_STAR = '/Playercardstar/setStar';

export { URLPATH_PLAYER_CARD_LIST, PLAYER_POS, PLAYER_SORT, URLPATH_PLAYER_CARD_STAR_LIST, URLPATH_CHECK_INHERIT, URLPATH_SET_STAR };