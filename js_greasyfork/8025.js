// ==UserScript==
// @name        Holyseal Filter
// @namespace   https://greasyfork.org/users/4514
// @author      喵拉布丁
// @homepage    https://greasyfork.org/scripts/8025
// @description 在【Holyseal ~聖封~】上突出显示指定(拨作)公司的名称
// @include     http://holyseal.net/cgi-bin/*
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @version     1.4.2017-07-06
// @grant       none
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/8025/Holyseal%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/8025/Holyseal%20Filter.meta.js
// ==/UserScript==
$(function () {
    var banCompanyList = ['seal', /^PIXY$/i, /^(桃|極)フェロ$/, 'Guilty', 'LILITH', /^アトリエさくら/, /(桃色|暗黒)劇場/, 'TinkerBell', /^ルネ$/,
        'Illusion', 'Nomad', 'オーバードーズ', /^Miel$/i, '白濁系', '可憐ソフト', /^Norn$/i, 'アメノムラクモ', 'ガールズトーク', 'STRIKES',
        'ブルゲLIGHT', /^(黒|桃|萌)雛$/, '熟れ専', 'アパタイト', 'BISHOP', 'アンダーリップ', 'Delta', 'Liquid', 'アトリエかぐや', 'Black Package TRY',
        'ANIM.teamMM', '黒鳥', 'エロイット', 'アンモライト', 'SPINDLE', 'Lusterise', /^ZION$/i, '白濁汁', 'CYCLET', 'Witch Flame', 'エレクトリップ',
        'アンダームーン', 'U・Me', 'スワンマニア', 'MBS TRUTH', 'LUNATIC', '濡汁', 'ぴたふぇち！', 'ピンパイジューシィ', 'おとこの娘倶楽部', 'Portion',
        /^48Te$/i, 'SNACK-FACTORY', 'Paranoia/Fact？', 'WendyBell', 'どっ恋ソフト', 'Eroro', 'ピンキィソフト', 'Lucha Libre', 'EROTICA PEACH', 'OLE-M',
        'SQUEEZ', /^SPEED$/i, 'STUDIO邪恋', 'わるきゅ～れ', /^SYOKU$/i, 'Potage', 'もーにんぐ', 'レッドゾーン', /^チロル$/i, 'Hammerheads', /^13cm$/i,
        'つるみく', /^ANIM$/i, 'TRYSET', 'material', 'M no Violet', 'Waffle', 'Black Cyc', 'BLUE TOPAZ', /^KISS$/i, 'スタジオ カメ', /^スワン$/,
        /^マリン$/i, 'こっとんど～る', 'ミルクキャンディ', /^覇王$/, 'catwalkNERO', /^Misty$/i, '魔法使いソフト', 'G.J？', /^Frill$/i, 'PhantomSoft',
        '熟女時代', '筆柿そふと', 'InterHeart', 'CYC NO-NOS', 'Heat-Soft', /^M-O$/i, /^POISON$/i, 'CrossOver', 'BLACK RAINBOW', 'Red Label', 'Red Rebel',
        'Trois', 'Black Rabbit', /^MAIKA$/i, /^アイル$/i, 'ローズクラウン', 'Cattleya', 'CODEPINK', 'スワンアイ', 'Parthenon', 'LoveJuiceピンク',
        /^cico$/i, /^汁ダク系/, 'LunaSoft', 'スタッフィング', 'Atelier G/H', 'パンチラキック', 'Silky’s', 'hourglass', /^DMM$/i, 'ALL-TiME', 'Muscadet',
        '祭企画', 'シャオシャオカッパ', 'ルネTeamBitters', 'カウパー', 'Puzzlebox', 'たまくろ', 'TORPEDO', '野良うさぎ', 'Monogram', 'ORC SOFT',
        'Pink Tissue', /^FlyingShine(黒|寿)$/i, /^XXX$/i, 'NEGALiON', 'ぱちぱちそふと黒', 'ゆめまくら', 'Empress', /^ZIZ$/i, 'SPEED HYBRID', '脳内彼女',
        'BLUEGALE', 'Tangerine', 'TOUCHABLE', 'コンプリーツ', 'clockup', 'BlackLUNA', 'TABOO', '汁・ザル', 'AHAAN', 'ヴィーナス', 'Blackluck', 'Honeyboy',
        'ピンヒール', 'ローズティアラ', 'みるくぱい', 'らぱぷる', 'ミルフィーユ', '鬼畜野郎', 'Discovery', 'Cybele', 'ういろうそふと', 'エロゲーホンポ',
        'Black Package', 'TAIL SKID', /^flap$/i, 'LoveJuice', 'Oz project', 'TEA TIME', /^Gash$/i, 'はにぃま～る', 'メガロマンス', 'Vanadis', 'Gracious',
        /^NOIR$/i, 'N43 Project', 'アイチェリー', 'West Vision', /^ZERO$/i, 'FINISH!', 'ラブチェリー', 'mints', 'エイチプラス', 'A.S.S', 'Marry Bell',
        'TRUST Software', 'FULLTIME', 'RiddleSoft', /^すもも$/, 'ぴんくはてな', 'イーアンツ', 'TranceSoft', /^OLE$/i, 'EROTICA BLACK', 'エスポット',
        'PlumZERO', '暗黒媒体', 'Tech Arts 3D', 'ゆ～かりそふと', 'うらら', 'ルクス・もーしょん', 'ビタミン', 'Ark Shell', '蛇ノ道ハ蛇ソフト', /^セレス$/,
        '幻覚堂', 'ばにぃうぉ～か～', 'Abogado Powers', '桃源郷', /^Peaky$/i, 'エレンシア', 'いちゃらぶ堂', 'ブラックカラント', 'Luxury', /^elf$/i,
        'Mの時間', 'マッセル', 'キュートラッシュ', 'オーサリングヘヴン', 'ブラックスワン', 'Rave’N', 'アパダッシュ', 'SEACOXX', /^REAL$/i, 'Lamia',
		'rootnuko＋H', 'DarknessPot', 'メス男子', 'の～すとらいく', /^include$/i, /^カカオ$/, 'インカローズ', 'ARMADILLO', 'FREAK STRIKE', '裸足少女'];

    $('td[width=150][align="right"]').each(function (i, elem) {
        var companyName = '';
        var $companyNode = $(elem);
        if ($companyNode.children().length === 0) {
            companyName = $companyNode.text();
        }
        else if ($companyNode.has('a').length > 0) {
            var $textNode = $companyNode.find('a > span');
            if ($textNode.length === 1) {
                companyName = $textNode.text();
            }
        }

        if (companyName !== '') {
            for (var j in banCompanyList) {
                var flag = false;
                if (typeof banCompanyList[j].test !== 'undefined') {
                    if (banCompanyList[j].test(companyName)) flag = true;
                }
                else {
                    if (companyName.toLowerCase().indexOf(banCompanyList[j].toLowerCase()) > -1) flag = true;
                }
                if (flag) {
                    $companyNode.parent().css({'background-color': '#C48888'});
                    break;
                }
            }
        }
    });
});