// ==UserScript==
// @name         pokechill宝可梦战斗日志（最终版）
// @namespace    http://tampermonkey.net/
// @version      10.1
// @description  内置汉化 + 伤害统计 + 属性克制 + 手动重置。
// @author       黄黄
// @match        https://play-pokechill.github.io/*
// @match        https://g1tyx.github.io/play-pokechill/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562072/pokechill%E5%AE%9D%E5%8F%AF%E6%A2%A6%E6%88%98%E6%96%97%E6%97%A5%E5%BF%97%EF%BC%88%E6%9C%80%E7%BB%88%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562072/pokechill%E5%AE%9D%E5%8F%AF%E6%A2%A6%E6%88%98%E6%96%97%E6%97%A5%E5%BF%97%EF%BC%88%E6%9C%80%E7%BB%88%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectedScript() {
        console.log("Battle Log Script (v7.8 Smart-Split) Injected!");

        // =================================================================
        // 1. 内置全量汉化字典
        // =================================================================
        const CN_DICT = {
            "Player": "我方", "Enemy": "敌方", "Unknown": "未知",
            "Normal": "一般", "Fire": "火", "Water": "水", "Grass": "草", "Electric": "电",
            "Ice": "冰", "Fighting": "格斗", "Poison": "毒", "Ground": "地面", "Flying": "飞行",
            "Psychic": "超能力", "Bug": "虫", "Rock": "岩石", "Ghost": "幽灵", "Dragon": "龙",
            "Dark": "恶", "Steel": "钢", "Fairy": "妖精",
            "burn": "🔥烧伤", "freeze": "❄️冰冻", "paralysis": "⚡麻痹",
            "poisoned": "☠️中毒", "sleep": "💤睡眠", "confused": "💫混乱",
            "Fog": "起雾",

            // --- 宝可梦 ---
            "Bulbasaur": "妙蛙种子", "Ivysaur": "妙蛙草", "Venusaur": "妙蛙花", "Charmander": "小火龙", "Charmeleon": "火恐龙", "Charizard": "喷火龙", "Squirtle": "杰尼龟", "Wartortle": "卡咪龟", "Blastoise": "水箭龟",
            "Caterpie": "绿毛虫", "Metapod": "铁甲蛹", "Butterfree": "巴大蝶", "Weedle": "独角虫", "Kakuna": "铁壳蛹", "Beedrill": "大针蜂", "Pidgey": "波波", "Pidgeotto": "比比鸟", "Pidgeot": "大比鸟",
            "Rattata": "小拉达", "Raticate": "拉达", "Spearow": "烈雀", "Fearow": "大嘴雀", "Ekans": "阿柏蛇", "Arbok": "阿柏怪", "Pikachu": "皮卡丘", "Raichu": "雷丘", "Sandshrew": "穿山鼠", "Sandslash": "穿山王",
            "Nidoran♀": "尼多兰", "Nidorina": "尼多娜", "Nidoqueen": "尼多后", "Nidoran♂": "尼多朗", "Nidorino": "尼多力诺", "Nidoking": "尼多王", "Clefairy": "皮皮", "Clefable": "皮可西",
            "Vulpix": "六尾", "Ninetales": "九尾", "Jigglypuff": "胖丁", "Wigglytuff": "胖可丁", "Zubat": "超音蝠", "Golbat": "大嘴蝠", "Oddish": "走路草", "Gloom": "臭臭花", "Vileplume": "霸王花",
            "Paras": "派拉斯", "Parasect": "派拉斯特", "Venonat": "毛球", "Venomoth": "摩鲁蛾", "Diglett": "地鼠", "Dugtrio": "三地鼠", "Meowth": "喵喵", "Persian": "猫老大", "Psyduck": "可达鸭", "Golduck": "哥达鸭",
            "Mankey": "猴怪", "Primeape": "火暴猴", "Growlithe": "卡蒂狗", "Arcanine": "风速狗", "Poliwag": "蚊香蝌蚪", "Poliwhirl": "蚊香君", "Poliwrath": "蚊香泳士", "Abra": "凯西", "Kadabra": "勇基拉", "Alakazam": "胡地",
            "Machop": "腕力", "Machoke": "豪力", "Machamp": "怪力", "Bellsprout": "喇叭芽", "Weepinbell": "口呆花", "Victreebel": "大食花", "Tentacool": "玛瑙水母", "Tentacruel": "毒刺水母",
            "Geodude": "小拳石", "Graveler": "隆隆石", "Golem": "隆隆岩", "Ponyta": "小火马", "Rapidash": "烈焰马", "Slowpoke": "呆呆兽", "Slowbro": "呆壳兽", "Magnemite": "小磁怪", "Magneton": "三合一磁怪",
            "Farfetchd": "大葱鸭", "Doduo": "嘟嘟", "Dodrio": "嘟嘟利", "Seel": "小海狮", "Dewgong": "白海狮", "Grimer": "臭泥", "Muk": "臭臭泥", "Shellder": "大舌贝", "Cloyster": "刺甲贝",
            "Gastly": "鬼斯", "Haunter": "鬼斯通", "Gengar": "耿鬼", "Onix": "大岩蛇", "Drowzee": "催眠貘", "Hypno": "引梦貘人", "Krabby": "大钳蟹", "Kingler": "巨钳蟹", "Voltorb": "霹雳电球", "Electrode": "顽皮雷弹",
            "Exeggcute": "蛋蛋", "Exeggutor": "椰蛋树", "Cubone": "卡拉卡拉", "Marowak": "嘎啦嘎啦", "Hitmonlee": "飞腿郎", "Hitmonchan": "快拳郎", "Lickitung": "大舌头", "Koffing": "瓦斯弹", "Weezing": "双弹瓦斯",
            "Rhyhorn": "独角犀牛", "Rhydon": "钻角犀兽", "Chansey": "吉利蛋", "Tangela": "蔓藤怪", "Kangaskhan": "袋兽", "Horsea": "墨海马", "Seadra": "海刺龙", "Goldeen": "角金鱼", "Seaking": "金鱼王",
            "Staryu": "海星星", "Starmie": "宝石海星", "Mr Mime": "魔墙人偶", "Scyther": "飞天螳螂", "Jynx": "迷唇姐", "Electabuzz": "电击兽", "Magmar": "鸭嘴火兽", "Pinsir": "凯罗斯", "Tauros": "肯泰罗",
            "Magikarp": "鲤鱼王", "Gyarados": "暴鲤龙", "Lapras": "拉普拉斯", "Ditto": "百变怪", "Eevee": "伊布", "Vaporeon": "水伊布", "Jolteon": "雷伊布", "Flareon": "火伊布", "Porygon": "多边兽",
            "Omanyte": "菊石兽", "Omastar": "多刺菊石兽", "Kabuto": "化石盔", "Kabutops": "镰刀盔", "Aerodactyl": "化石翼龙", "Snorlax": "卡比兽", "Articuno": "急冻鸟", "Zapdos": "闪电鸟", "Moltres": "火焰鸟",
            "Dratini": "迷你龙", "Dragonair": "哈克龙", "Dragonite": "快龙", "Mewtwo": "超梦", "Mew": "梦幻", "Chikorita": "菊草叶", "Bayleef": "月桂叶", "Meganium": "大竺葵",
            "Cyndaquil": "火球鼠", "Quilava": "火岩鼠", "Typhlosion": "火暴兽", "Totodile": "小锯鳄", "Croconaw": "蓝鳄", "Feraligatr": "大力鳄", "Sentret": "尾立", "Furret": "大尾立",
            "Hoothoot": "咕咕", "Noctowl": "猫头夜鹰", "Ledyba": "芭瓢虫", "Ledian": "安瓢虫", "Spinarak": "圆丝蛛", "Ariados": "阿利多斯", "Crobat": "叉字蝠", "Chinchou": "灯笼鱼", "Lanturn": "电灯怪",
            "Pichu": "皮丘", "Cleffa": "皮宝宝", "Igglybuff": "宝宝丁", "Togepi": "波克比", "Togetic": "波克基古", "Natu": "天然雀", "Xatu": "天然鸟", "Mareep": "咩利羊", "Flaaffy": "茸茸羊", "Ampharos": "电龙",
            "Bellossom": "美丽花", "Marill": "玛力露", "Azumarill": "玛力露丽", "Sudowoodo": "树才怪", "Politoed": "蚊香蛙皇", "Hoppip": "毽子草", "Skiploom": "毽子花", "Jumpluff": "毽子棉",
            "Aipom": "长尾怪手", "Sunkern": "向日种子", "Sunflora": "向日花怪", "Yanma": "蜻蜻蜓", "Wooper": "乌波", "Quagsire": "沼王", "Espeon": "太阳伊布", "Umbreon": "月亮伊布", "Murkrow": "黑暗鸦",
            "Slowking": "呆呆王", "Misdreavus": "梦妖", "Unown": "未知图腾", "Wobbuffet": "果然翁", "Girafarig": "麒麟奇", "Pineco": "榛果球", "Forretress": "佛烈托斯", "Dunsparce": "土龙弟弟", "Gligar": "天蝎",
            "Steelix": "大钢蛇", "Snubbull": "布鲁", "Granbull": "布鲁皇", "Qwilfish": "千针鱼", "Scizor": "巨钳螳螂", "Shuckle": "壶壶", "Heracross": "赫拉克罗斯", "Sneasel": "狃拉", "Teddiursa": "熊宝宝",
            "Ursaring": "圈圈熊", "Slugma": "熔岩虫", "Magcargo": "熔岩蜗牛", "Swinub": "小山猪", "Piloswine": "长毛猪", "Corsola": "太阳珊瑚", "Remoraid": "铁炮鱼", "Octillery": "章鱼桶", "Delibird": "信使鸟",
            "Mantine": "巨翅飞鱼", "Skarmory": "盔甲鸟", "Houndour": "戴鲁比", "Houndoom": "黑鲁加", "Kingdra": "刺龙王", "Phanpy": "小小象", "Donphan": "顿甲", "Porygon2": "多边兽2型", "Stantler": "惊角鹿",
            "Smeargle": "图图犬", "Tyrogue": "无畏小子", "Hitmontop": "战舞郎", "Smoochum": "迷唇娃", "Elekid": "电击怪", "Magby": "鸭嘴宝宝", "Miltank": "大奶罐", "Blissey": "幸福蛋",
            "Raikou": "雷公", "Entei": "炎帝", "Suicune": "水君", "Larvitar": "幼基拉斯", "Pupitar": "沙基拉斯", "Tyranitar": "班基拉斯", "Lugia": "洛奇亚", "Ho Oh": "凤王", "Celebi": "时拉比",
            "Treecko": "木守宫", "Grovyle": "森林蜥蜴", "Sceptile": "蜥蜴王", "Torchic": "火稚鸡", "Combusken": "力壮鸡", "Blaziken": "火焰鸡", "Mudkip": "水跃鱼", "Marshtomp": "沼跃鱼", "Swampert": "巨沼怪",
            "Poochyena": "土狼犬", "Mightyena": "大狼犬", "Zigzagoon": "蛇纹熊", "Linoone": "直冲熊", "Wurmple": "刺尾虫", "Silcoon": "甲壳茧", "Beautifly": "狩猎凤蝶", "Cascoon": "盾甲茧", "Dustox": "毒粉蛾",
            "Lotad": "莲叶童子", "Lombre": "莲帽小童", "Ludicolo": "乐天河童", "Seedot": "橡实果", "Nuzleaf": "长鼻叶", "Shiftry": "狡猾天狗", "Taillow": "傲骨燕", "Swellow": "大王燕", "Wingull": "长翅鸥",
            "Pelipper": "大嘴鸥", "Ralts": "拉鲁拉丝", "Kirlia": "奇鲁莉安", "Gardevoir": "沙奈朵", "Surskit": "溜溜糖球", "Masquerain": "雨翅蛾", "Shroomish": "蘑蘑菇", "Breloom": "斗笠菇", "Slakoth": "懒人獭",
            "Vigoroth": "过动猿", "Slaking": "请假王", "Nincada": "土居忍士", "Ninjask": "铁面忍者", "Shedinja": "脱壳忍者", "Whismur": "咕妞妞", "Loudred": "吼爆弹", "Exploud": "爆音怪", "Makuhita": "幕下力士",
            "Hariyama": "铁掌力士", "Azurill": "露力丽", "Nosepass": "朝北鼻", "Skitty": "向尾喵", "Delcatty": "优雅猫", "Sableye": "勾魂眼", "Mawile": "大嘴娃", "Aron": "可可多拉", "Lairon": "可多拉",
            "Aggron": "波士可多拉", "Meditite": "玛沙那", "Medicham": "恰雷姆", "Electrike": "落雷兽", "Manectric": "雷电兽", "Plusle": "正电拍拍", "Minun": "负电拍拍", "Volbeat": "电萤虫", "Illumise": "甜甜萤",
            "Roselia": "毒蔷薇", "Gulpin": "溶食兽", "Swalot": "吞食兽", "Carvanha": "利牙鱼", "Sharpedo": "巨牙鲨", "Wailmer": "吼吼鲸", "Wailord": "吼鲸王", "Numel": "呆火驼", "Camerupt": "喷火驼",
            "Torkoal": "煤炭龟", "Spoink": "跳跳猪", "Grumpig": "噗噗猪", "Spinda": "晃晃斑", "Trapinch": "大颚蚁", "Vibrava": "超音波幼虫", "Flygon": "沙漠蜻蜓", "Cacnea": "刺球仙人掌", "Cacturne": "梦歌仙人掌",
            "Swablu": "青绵鸟", "Altaria": "七夕青鸟", "Zangoose": "猫鼬斩", "Seviper": "饭匙蛇", "Lunatone": "月石", "Solrock": "太阳岩", "Barboach": "泥泥鳅", "Whiscash": "鲶鱼王", "Corphish": "龙虾小兵",
            "Crawdaunt": "铁螯龙虾", "Baltoy": "天秤偶", "Claydol": "念力土偶", "Lileep": "触手百合", "Cradily": "摇篮百合", "Anorith": "太古羽虫", "Armaldo": "太古盔甲", "Feebas": "丑丑鱼", "Milotic": "美纳斯",
            "Castform": "飘浮泡泡", "Kecleon": "变隐龙", "Shuppet": "怨影娃娃", "Banette": "诅咒娃娃", "Duskull": "夜巡灵", "Dusclops": "彷徨夜灵", "Tropius": "热带龙", "Chimecho": "风铃铃", "Absol": "阿勃梭鲁",
            "Wynaut": "小果然", "Snorunt": "雪童子", "Glalie": "冰鬼护", "Spheal": "海豹球", "Sealeo": "海魔狮", "Walrein": "帝牙海狮", "Clamperl": "珍珠贝", "Huntail": "猎斑鱼", "Gorebyss": "樱花鱼",
            "Relicanth": "古空棘鱼", "Luvdisc": "爱心鱼", "Bagon": "宝贝龙", "Shelgon": "甲壳龙", "Salamence": "暴飞龙", "Beldum": "铁哑铃", "Metang": "金属怪", "Metagross": "巨金怪", "Regirock": "雷吉洛克",
            "Regice": "雷吉艾斯", "Registeel": "雷吉斯奇鲁", "Latias": "拉帝亚斯", "Latios": "拉帝欧斯", "Kyogre": "盖欧卡", "Groudon": "固拉多", "Rayquaza": "烈空坐", "Jirachi": "基拉祈", "Deoxys": "代欧奇希斯",
            "Turtwig": "草苗龟", "Grotle": "树林龟", "Torterra": "土台龟", "Chimchar": "小火焰猴", "Monferno": "猛火猴", "Infernape": "烈焰猴", "Piplup": "波加曼", "Prinplup": "波皇子", "Empoleon": "帝王拿波",
            "Starly": "姆克儿", "Staravia": "姆克鸟", "Staraptor": "姆克鹰", "Bidoof": "大牙狸", "Bibarel": "大尾狸", "Kricketot": "圆法师", "Kricketune": "音箱蟀", "Shinx": "小猫怪", "Luxio": "勒克猫",
            "Luxray": "伦琴猫", "Budew": "含羞苞", "Roserade": "罗丝雷朵", "Cranidos": "头盖龙", "Rampardos": "战槌龙", "Shieldon": "盾甲龙", "Bastiodon": "护城龙", "Burmy": "结草儿", "Wormadam": "结草贵妇",
            "Mothim": "绅士蛾", "Combee": "三蜜蜂", "Vespiquen": "蜂女王", "Pachirisu": "帕奇利兹", "Buizel": "泳圈鼬", "Floatzel": "浮潜鼬", "Cherubi": "樱花宝", "Cherrim": "樱花儿", "Shellos": "无壳海兔",
            "Gastrodon": "海兔兽", "Ambipom": "双尾怪手", "Drifloon": "飘飘球", "Drifblim": "随风球", "Buneary": "卷卷耳", "Lopunny": "长耳兔", "Mismagius": "梦妖魔", "Honchkrow": "乌鸦头头", "Glameow": "魅力喵",
            "Purugly": "东施喵", "Chingling": "铃铛响", "Stunky": "臭鼬噗", "Skuntank": "坦克臭鼬", "Bronzor": "铜镜怪", "Bronzong": "青铜钟", "Bonsly": "盆才怪", "Mime Jr": "魔尼尼", "Happiny": "小福蛋",
            "Chatot": "聒噪鸟", "Spiritomb": "花岩怪", "Gible": "圆陆鲨", "Gabite": "尖牙陆鲨", "Garchomp": "烈咬陆鲨", "Munchlax": "小卡比兽", "Riolu": "利欧路", "Lucario": "路卡利欧", "Hippopotas": "沙河马",
            "Hippowdon": "河马兽", "Skorupi": "钳尾蝎", "Drapion": "龙王蝎", "Croagunk": "不良蛙", "Toxicroak": "毒骷蛙", "Carnivine": "尖牙笼", "Finneon": "荧光鱼", "Lumineon": "霓虹鱼", "Mantyke": "小球飞鱼",
            "Snover": "雪笠怪", "Abomasnow": "暴雪王", "Weavile": "玛狃拉", "Magnezone": "自爆磁怪", "Lickilicky": "大舌舔", "Rhyperior": "超甲狂犀", "Tangrowth": "巨蔓藤", "Electivire": "电击魔兽",
            "Magmortar": "鸭嘴炎兽", "Togekiss": "波克基斯", "Yanmega": "远古巨蜓", "Leafeon": "叶伊布", "Glaceon": "冰伊布", "Gliscor": "天蝎王", "Mamoswine": "象牙猪", "Porygon Z": "多边兽乙型",
            "Gallade": "艾路雷朵", "Probopass": "大朝北鼻", "Dusknoir": "黑夜魔灵", "Froslass": "雪妖女", "Rotom": "洛托姆", "Uxie": "由克希", "Mesprit": "艾姆利多", "Azelf": "亚克诺姆", "Dialga": "帝牙卢卡",
            "Palkia": "帕路奇亚", "Heatran": "席多蓝恩", "Regigigas": "雷吉奇卡斯", "Giratina": "骑拉帝纳", "Cresselia": "克雷色利亚", "Phione": "霏欧纳", "Manaphy": "玛纳霏", "Darkrai": "达克莱伊",
            "Shaymin": "谢米", "Arceus": "阿尔宙斯", "Victini": "比克提尼", "Snivy": "藤藤蛇", "Servine": "青藤蛇", "Serperior": "君主蛇", "Tepig": "暖暖猪", "Pignite": "炒炒猪", "Emboar": "炎武王",
            "Oshawott": "水水獭", "Dewott": "双刃丸", "Samurott": "大剑鬼", "Patrat": "探探鼠", "Watchog": "步哨鼠", "Lillipup": "小约克", "Herdier": "哈约克", "Stoutland": "长毛狗", "Purrloin": "扒手猫",
            "Liepard": "酷豹", "Pansage": "花椰猴", "Simisage": "花椰猿", "Pansear": "爆香猴", "Simisear": "爆香猿", "Panpour": "冷水猴", "Simipour": "冷水猿", "Munna": "食梦梦", "Musharna": "梦梦蚀",
            "Pidove": "豆豆鸽", "Tranquill": "咕咕鸽", "Unfezant": "高傲雉鸡", "Blitzle": "斑斑马", "Zebstrika": "雷电斑马", "Roggenrola": "石丸子", "Boldore": "地幔岩", "Gigalith": "庞岩怪", "Woobat": "滚滚蝙蝠",
            "Swoobat": "心蝙蝠", "Drilbur": "螺钉地鼠", "Excadrill": "龙头地鼠", "Audino": "差不多娃娃", "Timburr": "搬运小匠", "Gurdurr": "铁骨土人", "Conkeldurr": "修建老匠", "Tympole": "圆蝌蚪",
            "Palpitoad": "蓝蟾蜍", "Seismitoad": "蟾蜍王", "Throh": "投摔鬼", "Sawk": "打击鬼", "Sewaddle": "虫宝包", "Swadloon": "宝包茧", "Leavanny": "保姆虫", "Venipede": "百足蜈蚣", "Whirlipede": "车轮球",
            "Scolipede": "蜈蚣王", "Cottonee": "木棉球", "Whimsicott": "风妖精", "Petilil": "百合根娃娃", "Lilligant": "裙儿小姐", "Basculin": "野蛮鲈鱼", "Sandile": "黑眼鳄", "Krokorok": "混混鳄",
            "Krookodile": "流氓鳄", "Darumaka": "火红不倒翁", "Darmanitan": "达摩狒狒", "Maractus": "沙铃仙人掌", "Dwebble": "石居蟹", "Crustle": "岩殿居蟹", "Scraggy": "滑滑小子", "Scrafty": "头巾混混",
            "Sigilyph": "象征鸟", "Yamask": "哭哭面具", "Cofagrigus": "迭失棺", "Tirtouga": "原盖海龟", "Carracosta": "肋骨海龟", "Archen": "始祖小鸟", "Archeops": "始祖大鸟", "Trubbish": "破破袋",
            "Garbodor": "灰尘山", "Zorua": "索罗亚", "Zoroark": "索罗亚克", "Minccino": "泡沫栗鼠", "Cinccino": "奇诺栗鼠", "Gothita": "哥德宝宝", "Gothorita": "哥德小童", "Gothitelle": "哥德小姐",
            "Solosis": "单卵细胞球", "Duosion": "双卵细胞球", "Reuniclus": "人造细胞卵", "Ducklett": "鸭宝宝", "Swanna": "舞天鹅", "Vanillite": "迷你冰", "Vanillish": "多多冰", "Vanilluxe": "双倍多多冰",
            "Deerling": "四季鹿", "Sawsbuck": "萌芽鹿", "Emolga": "电飞鼠", "Karrablast": "盖盖虫", "Escavalier": "骑士蜗牛", "Foongus": "哎呀球菇", "Amoonguss": "败露球菇", "Frillish": "轻飘飘",
            "Jellicent": "胖嘟嘟", "Alomomola": "保姆曼波", "Joltik": "电电虫", "Galvantula": "电蜘蛛", "Ferroseed": "种子铁球", "Ferrothorn": "坚果哑铃", "Klink": "齿轮儿", "Klang": "齿轮组",
            "Klinklang": "齿轮怪", "Tynamo": "麻麻小鱼", "Eelektrik": "麻麻鳗", "Eelektross": "麻麻鳗鱼王", "Elgyem": "小灰怪", "Beheeyem": "大宇怪", "Litwick": "烛光灵", "Lampent": "灯火幽灵",
            "Chandelure": "水晶灯火灵", "Axew": "牙牙", "Fraxure": "斧牙龙", "Haxorus": "双斧战龙", "Cubchoo": "喷嚏熊", "Beartic": "冻原熊", "Cryogonal": "几何雪花", "Shelmet": "小嘴蜗",
            "Accelgor": "敏捷虫", "Stunfisk": "泥巴鱼", "Mienfoo": "功夫鼬", "Mienshao": "师父鼬", "Druddigon": "赤面龙", "Golett": "泥偶小人", "Golurk": "泥偶巨人", "Pawniard": "驹刀小兵",
            "Bisharp": "劈斩司令", "Bouffalant": "爆炸头水牛", "Rufflet": "毛头小鹰", "Braviary": "勇士雄鹰", "Vullaby": "秃鹰丫头", "Mandibuzz": "秃鹰娜", "Heatmor": "熔蚁兽", "Durant": "铁蚁",
            "Deino": "单首龙", "Zweilous": "双首暴龙", "Hydreigon": "三首恶龙", "Larvesta": "燃烧虫", "Volcarona": "火神蛾", "Cobalion": "勾帕路翁", "Terrakion": "代拉基翁", "Virizion": "毕力吉翁",
            "Tornadus": "龙卷云", "Thundurus": "雷电云", "Reshiram": "莱希拉姆", "Zekrom": "捷克罗姆", "Landorus": "土地云", "Kyurem": "酋雷姆", "Keldeo": "凯路迪欧", "Meloetta": "美洛耶塔",
            "Genesect": "盖诺赛克特", "Chespin": "哈力栗", "Quilladin": "胖胖哈力", "Chesnaught": "布里卡隆", "Fennekin": "火狐狸", "Braixen": "长尾火狐", "Delphox": "妖火红狐", "Froakie": "呱呱泡蛙",
            "Frogadier": "呱头蛙", "Greninja": "甲贺忍蛙", "Bunnelby": "掘掘兔", "Diggersby": "掘地兔", "Fletchling": "小箭雀", "Fletchinder": "火箭雀", "Talonflame": "烈箭鹰", "Scatterbug": "粉蝶虫",
            "Spewpa": "粉蝶蛹", "Vivillon": "彩粉蝶", "Litleo": "小狮狮", "Pyroar": "火炎狮", "Flabebe": "花蓓蓓", "Floette": "花叶蒂", "Florges": "花洁夫人", "Skiddo": "坐骑小羊", "Gogoat": "坐骑山羊",
            "Pancham": "顽皮熊猫", "Pangoro": "霸道熊猫", "Furfrou": "多丽米亚", "Espurr": "妙喵", "Meowstic": "超能妙喵", "Honedge": "独剑鞘", "Doublade": "双剑鞘", "Aegislash": "坚盾剑怪",
            "Spritzee": "粉香香", "Aromatisse": "芳香精", "Swirlix": "绵绵泡芙", "Slurpuff": "胖甜妮", "Inkay": "好啦鱿", "Malamar": "乌贼王", "Binacle": "龟脚脚", "Barbaracle": "龟足巨铠",
            "Skrelp": "垃垃藻", "Dragalge": "毒藻龙", "Clauncher": "铁臂枪虾", "Clawitzer": "钢炮臂虾", "Helioptile": "伞电蜥", "Heliolisk": "光电伞蜥", "Tyrunt": "宝宝暴龙", "Tyrantrum": "怪颚龙",
            "Amaura": "冰雪龙", "Aurorus": "冰雪巨龙", "Sylveon": "仙子伊布", "Hawlucha": "摔角鹰人", "Dedenne": "咚咚鼠", "Carbink": "小碎钻", "Goomy": "黏黏宝", "Sliggoo": "黏美儿", "Goodra": "黏美龙",
            "Klefki": "钥圈儿", "Phantump": "小木灵", "Trevenant": "朽木妖", "Pumpkaboo": "南瓜精", "Gourgeist": "南瓜怪人", "Bergmite": "冰宝", "Avalugg": "冰岩怪", "Noibat": "嗡蝠", "Noivern": "音波龙",
            "Xerneas": "哲尔尼亚斯", "Yveltal": "伊裴尔塔尔", "Zygarde": "基格尔德", "Diancie": "蒂安希", "Hoopa": "胡帕", "Volcanion": "波尔凯尼恩", "Rowlet": "木木枭", "Dartrix": "投羽枭",
            "Decidueye": "狙射树枭", "Litten": "火斑喵", "Torracat": "炎热喵", "Incineroar": "炽焰咆哮虎", "Popplio": "球球海狮", "Brionne": "花漾海狮", "Primarina": "西狮海壬", "Pikipek": "小笃儿",
            "Trumbeak": "喇叭啄鸟", "Toucannon": "铳嘴大鸟", "Yungoos": "猫鼬少", "Gumshoos": "猫鼬探长", "Grubbin": "强颚鸡母虫", "Charjabug": "虫电宝", "Vikavolt": "锹农炮虫", "Crabrawler": "好胜蟹",
            "Crabominable": "好胜毛蟹", "Oricorio": "花舞鸟", "Cutiefly": "萌虻", "Ribombee": "蝶结萌虻", "Rockruff": "岩狗狗", "Lycanroc": "鬃岩狼人", "Wishiwashi": "弱丁鱼", "Mareanie": "好坏星",
            "Toxapex": "超坏星", "Mudbray": "泥驴仔", "Mudsdale": "重泥挽马", "Dewpider": "滴蛛", "Araquanid": "滴蛛霸", "Fomantis": "伪螳草", "Lurantis": "兰螳花", "Morelull": "睡睡菇",
            "Shiinotic": "灯罩夜菇", "Salandit": "夜盗火蜥", "Salazzle": "焰后蜥", "Stufful": "童偶熊", "Bewear": "穿着熊", "Bounsweet": "甜竹竹", "Steenee": "甜舞妮", "Tsareena": "甜冷美后",
            "Comfey": "花疗环环", "Oranguru": "智挥猩", "Passimian": "投掷猴", "Wimpod": "胆小虫", "Golisopod": "具甲武者", "Sandygast": "沙丘娃", "Palossand": "噬沙堡爷", "Pyukumuku": "拳海参",
            "Type Null": "属性空", "Silvally": "银伴战兽", "Minior": "小陨星", "Komala": "树枕尾熊", "Turtonator": "爆焰龟兽", "Togedemaru": "托戈德玛尔", "Mimikyu": "谜拟丘", "Bruxish": "磨牙彩皮鱼",
            "Drampa": "老翁龙", "Dhelmise": "破破舵轮", "Jangmoo": "心鳞宝", "Hakamoo": "鳞甲龙", "Kommoo": "杖尾鳞甲龙", "Tapu Koko": "卡璞・鸣鸣", "Tapu Lele": "卡璞・蝶蝶", "Tapu Bulu": "卡璞・哞哞",
            "Tapu Fini": "卡璞・鳍鳍", "Cosmog": "科斯莫古", "Cosmoem": "科斯莫姆", "Solgaleo": "索尔迦雷欧", "Lunala": "露奈雅拉", "Nihilego": "虚吾伊德", "Buzzwole": "爆肌蚊", "Pheromosa": "费洛美螂",
            "Xurkitree": "电束木", "Celesteela": "铁火辉夜", "Kartana": "纸御剑", "Guzzlord": "恶食大王", "Necrozma": "奈克洛兹玛", "Magearna": "玛机雅娜", "Marshadow": "玛夏多", "Poipole": "毒贝比",
            "Naganadel": "四颚针龙", "Stakataka": "垒磊石", "Blacephalon": "砰头小丑", "Zeraora": "捷拉奥拉", "Meltan": "美录坦", "Melmetal": "美录梅塔", "Grookey": "敲音猴", "Thwackey": "啪咚猴",
            "Rillaboom": "轰擂金刚猩", "Scorbunny": "炎兔儿", "Raboot": "腾蹴小将", "Cinderace": "闪焰王牌", "Sobble": "泪眼蜥", "Drizzile": "变涩蜥", "Inteleon": "千面避役", "Skwovet": "贪心栗鼠",
            "Greedent": "藏饱栗鼠", "Rookidee": "稚山雀", "Corvisquire": "蓝鸦", "Corviknight": "钢铠鸦", "Blipbug": "索侦虫", "Dottler": "天罩虫", "Orbeetle": "以欧路普", "Nickit": "狡小狐",
            "Thievul": "猾大狐", "Gossifleur": "幼棉棉", "Eldegoss": "白蓬蓬", "Wooloo": "毛辫羊", "Dubwool": "毛毛角羊", "Chewtle": "咬咬龟", "Drednaw": "暴噬龟", "Yamper": "来电汪", "Boltund": "逐电犬",
            "Rolycoly": "小炭仔", "Carkol": "大炭车", "Coalossal": "巨炭山", "Applin": "啃果虫", "Flapple": "苹裹龙", "Appletun": "丰蜜龙", "Silicobra": "沙包蛇", "Sandaconda": "沙螺蟒", "Cramorant": "古月鸟",
            "Arrokuda": "刺梭鱼", "Barraskewda": "戽斗尖梭", "Toxel": "电音婴", "Toxtricity": "颤弦蝾螈", "Sizzlipede": "烧火蚣", "Centiskorch": "焚焰蚣", "Clobbopus": "拳拳蛸", "Grapploct": "八爪武师",
            "Sinistea": "来悲茶", "Polteageist": "怖思壶", "Hatenna": "迷布莉姆", "Hattrem": "提布莉姆", "Hatterene": "布莉姆温", "Impidimp": "捣蛋小妖", "Morgrem": "诈唬魔", "Grimmsnarl": "长毛巨魔",
            "Obstagoon": "堵拦熊", "Perrserker": "喵头目", "Cursola": "魔灵珊瑚", "Sirfetchd": "葱游兵", "Mr Rime": "踏冰人偶", "Runerigus": "迭失板", "Milcery": "小仙奶", "Alcremie": "霜奶仙",
            "Falinks": "列阵兵", "Pincurchin": "啪嚓海胆", "Snom": "雪吞虫", "Frosmoth": "雪绒蛾", "Stonjourner": "巨石丁", "Eiscue": "冰砌鹅", "Indeedee": "爱管侍", "Morpeko": "莫鲁贝可",
            "Cufant": "铜象", "Copperajah": "大王铜象", "Dracozolt": "雷鸟龙", "Arctozolt": "雷鸟海兽", "Dracovish": "鳃鱼龙", "Arctovish": "鳃鱼海兽", "Duraludon": "铝钢龙", "Dreepy": "多龙梅西亚",
            "Drakloak": "多龙奇", "Dragapult": "多龙巴鲁托", "Zacian": "苍响", "Zamazenta": "藏玛然特", "Eternatus": "无极汰那", "Kubfu": "熊徒弟", "Urshifu": "武道熊师", "Zarude": "萨戮德",
            "Regieleki": "雷吉艾勒奇", "Regidrago": "雷吉铎拉戈", "Glastrier": "雪暴马", "Spectrier": "灵幽马", "Calyrex": "蕾冠王", "Wyrdeer": "诡角鹿", "Kleavor": "劈斧螳螂", "Ursaluna": "月月熊",
            "Basculegion": "幽尾玄鱼", "Sneasler": "大狃拉", "Overqwil": "万针鱼", "Enamorus": "眷恋云", "Sprigatito": "新叶喵", "Floragato": "蒂蕾喵", "Meowscarada": "魔幻假面喵", "Fuecoco": "呆火鳄",
            "Crocalor": "炙烫鳄", "Skeledirge": "骨纹巨声鳄", "Quaxly": "润水鸭", "Quaxwell": "涌跃鸭", "Quaquaval": "狂欢浪舞鸭", "Lechonk": "爱吃豚", "Oinkologne": "飘香豚", "Tarountula": "团珠蛛",
            "Spidops": "操陷蛛", "Nymble": "豆蟋蟀", "Lokix": "烈腿蝗", "Pawmi": "布拨", "Pawmo": "布土拨", "Pawmot": "巴布土拨", "Tandemaus": "一对鼠", "Maushold": "一家鼠", "Fidough": "狗仔包",
            "Dachsbun": "麻花犬", "Smoliv": "迷你芙", "Dolliv": "奥利纽", "Arboliva": "奥利瓦", "Squawkabilly": "怒鹦哥", "Nacli": "盐石宝", "Naclstack": "盐石垒", "Garganacl": "盐石巨灵",
            "Charcadet": "炭小侍", "Armarouge": "红莲铠骑", "Ceruledge": "苍炎刃鬼", "Tadbulb": "光蚪仔", "Bellibolt": "电肚蛙", "Wattrel": "电海燕", "Kilowattrel": "大电海燕", "Maschiff": "偶叫獒",
            "Mabosstiff": "獒教父", "Shroodle": "滋汁鼹", "Grafaiai": "涂标客", "Bramblin": "纳噬草", "Brambleghast": "怖纳噬草", "Toedscool": "原野水母", "Toedscruel": "陆地水母", "Klawf": "毛崖蟹",
            "Capsakid": "热辣娃", "Scovillain": "狠辣椒", "Rellor": "虫滚泥", "Rabsca": "虫甲圣", "Flittle": "飘飘雏", "Espathra": "超能艳鸵", "Tinkatink": "小锻匠", "Tinkatuff": "巧锻匠",
            "Tinkaton": "巨锻匠", "Wiglett": "海地鼠", "Wugtrio": "三海地鼠", "Bombirdier": "下石鸟", "Finizen": "波普海豚", "Palafin": "海豚侠", "Varoom": "噗隆隆", "Revavroom": "普隆隆姆",
            "Cyclizar": "摩托蜥", "Orthworm": "拖拖蚓", "Glimmet": "晶光芽", "Glimmora": "晶光花", "Greavard": "墓仔狗", "Houndstone": "墓扬犬", "Flamigo": "缠红鹤", "Cetoddle": "走鲸",
            "Cetitan": "浩大鲸", "Veluza": "轻身鳕", "Dondozo": "吃吼霸", "Tatsugiri": "米立龙", "Annihilape": "弃世猴", "Clodsire": "土王", "Farigiraf": "奇麒麟", "Dudunsparce": "土龙节节",
            "Kingambit": "仆刀将军", "Great Tusk": "雄伟牙", "Scream Tail": "吼叫尾", "Brute Bonnet": "猛恶菇", "Flutter Mane": "振翼发", "Slither Wing": "爬地翅", "Sandy Shocks": "沙铁皮",
            "Iron Treads": "铁辙迹", "Iron Bundle": "铁包袱", "Iron Hands": "铁臂膀", "Iron Jugulis": "铁脖颈", "Iron Moth": "铁毒蛾", "Iron Thorns": "铁荆棘", "Frigibax": "凉脊龙",
            "Arctibax": "冻脊龙", "Baxcalibur": "戟脊龙", "Gimmighoul": "索财灵", "Gholdengo": "赛富豪", "Wo Chien": "古简蜗", "Chien Pao": "古剑豹", "Ting Lu": "古鼎鹿", "Chi Yu": "古玉鱼",
            "Roaring Moon": "轰鸣月", "Iron Valiant": "铁武者", "Koraidon": "故勒顿", "Miraidon": "密勒顿", "Walking Wake": "波荡水", "Iron Leaves": "铁斑叶", "Dipplin": "裹蜜虫",
            "Poltchageist": "斯魔茶", "Sinistcha": "来悲粗茶", "Okidogi": "够赞狗", "Munkidori": "愿增猿", "Fezandipiti": "吉雉鸡", "Ogerpon": "厄诡椪", "Archaludon": "铝钢桥龙",
            "Hydrapple": "蜜集大蛇", "Gouging Fire": "破空焰", "Raging Bolt": "猛雷鼓", "Iron Boulder": "铁磐岩", "Iron Crown": "铁头壳", "Terapagos": "太乐巴戈斯", "Pecharunt": "桃歹郎",

            // --- 招式 ---
            "Pound": "拍击", "Karate Chop": "空手劈", "Double Slap": "连环巴掌", "Comet Punch": "连续拳", "Mega Punch": "百万吨重拳", "Pay Day": "聚宝功", "Fire Punch": "火焰拳",
            "Ice Punch": "冰冻拳", "Thunder Punch": "雷电拳", "Scratch": "抓", "Vise Grip": "夹住", "Guillotine": "极落钳", "Razor Wind": "旋风刀", "Swords Dance": "剑舞",
            "Cut": "居合劈", "Gust": "起风", "Wing Attack": "翅膀攻击", "Whirlwind": "吹飞", "Fly": "飞翔", "Bind": "绑紧", "Slam": "摔打", "Vine Whip": "藤鞭", "Stomp": "踩踏",
            "Double Kick": "二连踢", "Mega Kick": "百万吨重踢", "Jump Kick": "飞踢", "Rolling Kick": "回旋踢", "Sand Attack": "泼沙", "Headbutt": "头锤", "Horn Attack": "角撞",
            "Fury Attack": "乱击", "Horn Drill": "角钻", "Tackle": "撞击", "Body Slam": "泰山压顶", "Wrap": "紧束", "Take Down": "猛撞", "Thrash": "大闹一番", "Double Edge": "舍身冲撞",
            "Tail Whip": "摇尾巴", "Poison Sting": "毒针", "Twineedle": "双针", "Pin Missile": "飞弹针", "Leer": "瞪眼", "Bite": "咬住", "Growl": "叫声", "Roar": "吼叫", "Sing": "唱歌",
            "Supersonic": "超音波", "Sonic Boom": "音爆", "Disable": "定身法", "Acid": "溶解液", "Ember": "火花", "Flamethrower": "喷射火焰", "Mist": "白雾", "Water Gun": "水枪",
            "Hydro Pump": "水炮", "Surf": "冲浪", "Ice Beam": "冰冻光束", "Blizzard": "暴风雪", "Psybeam": "幻象光线", "Bubble Beam": "泡沫光线", "Aurora Beam": "极光束",
            "Hyper Beam": "破坏光线", "Peck": "啄", "Drill Peck": "啄钻", "Submission": "深渊翻滚", "Low Kick": "踢倒", "Counter": "双倍奉还", "Seismic Toss": "地球上投",
            "Strength": "怪力", "Absorb": "吸取", "Mega Drain": "超级吸取", "Leech Seed": "寄生种子", "Growth": "生长", "Razor Leaf": "飞叶快刀", "Solar Beam": "日光束",
            "Poison Powder": "毒粉", "Stun Spore": "麻痹粉", "Sleep Powder": "催眠粉", "Petal Dance": "花瓣舞", "String Shot": "吐丝", "Dragon Rage": "龙之怒", "Fire Spin": "火焰旋涡",
            "Thunder Shock": "电击", "Thunderbolt": "十万伏特", "Thunder Wave": "电磁波", "Thunder": "打雷", "Rock Throw": "落石", "Earthquake": "地震", "Fissure": "地裂", "Dig": "挖洞",
            "Toxic": "剧毒", "Confusion": "念力", "Psychic": "精神强念", "Hypnosis": "催眠术", "Meditate": "瑜伽姿势", "Agility": "高速移动", "Quick Attack": "电光一闪", "Rage": "愤怒",
            "Teleport": "瞬间移动", "Night Shade": "黑夜魔影", "Mimic": "模仿", "Screech": "刺耳声", "Double Team": "影子分身", "Recover": "自我再生", "Harden": "变硬", "Minimize": "变小",
            "Smokescreen": "烟幕", "Confuse Ray": "奇异之光", "Withdraw": "缩入壳中", "Defense Curl": "变圆", "Barrier": "屏障", "Light Screen": "光墙", "Haze": "黑雾", "Reflect": "反射壁",
            "Focus Energy": "聚气", "Bide": "忍耐", "Metronome": "挥指", "Mirror Move": "鹦鹉学舌", "Self Destruct": "玉石俱碎", "Egg Bomb": "炸蛋", "Lick": "舌舔", "Smog": "浊雾",
            "Sludge": "污泥攻击", "Bone Club": "骨棒", "Fire Blast": "大字爆炎", "Waterfall": "攀瀑", "Clamp": "贝壳夹击", "Swift": "高速星星", "Skull Bash": "火箭头锤", "Spike Cannon": "尖刺加农炮",
            "Constrict": "缠绕", "Amnesia": "瞬间失忆", "Kinesis": "折弯汤匙", "Soft Boiled": "生蛋", "Hi Jump Kick": "飞膝踢", "Glare": "大蛇瞪眼", "Dream Eater": "食梦", "Poison Gas": "毒瓦斯",
            "Barrage": "投球", "Leech Life": "吸血", "Lovely Kiss": "恶魔之吻", "Sky Attack": "神鸟猛击", "Transform": "变身", "Bubble": "泡沫", "Dizzy Punch": "迷昏拳", "Spore": "蘑菇孢子",
            "Flash": "闪光", "Psywave": "精神波", "Splash": "跃起", "Acid Armor": "溶化", "Crabhammer": "蟹钳锤", "Explosion": "大爆炸", "Fury Swipes": "乱抓", "Bonemerang": "骨头回力镖",
            "Rest": "睡觉", "Rock Slide": "岩崩", "Hyper Fang": "终结门牙", "Sharpen": "棱角化", "Conversion": "纹理", "Tri Attack": "三重攻击", "Super Fang": "愤怒门牙", "Slash": "劈开",
            "Substitute": "替身", "Struggle": "挣扎", "Sketch": "写生", "Triple Kick": "三连踢", "Thief": "小偷", "Spider Web": "蛛网", "Mind Reader": "心之眼", "Nightmare": "恶梦",
            "Flame Wheel": "火焰轮", "Snore": "打鼾", "Curse": "诅咒", "Flail": "抓狂", "Conversion 2": "纹理２", "Aeroblast": "气旋攻击", "Cotton Spore": "棉孢子", "Reversal": "绝处逢生",
            "Spite": "怨恨", "Powder Snow": "细雪", "Protect": "守住", "Mach Punch": "音速拳", "Scary Face": "可怕面孔", "Feint Attack": "出奇一击", "Sweet Kiss": "天使之吻", "Belly Drum": "腹鼓",
            "Sludge Bomb": "污泥炸弹", "Mud Slap": "掷泥", "Octazooka": "章鱼桶炮", "Spikes": "撒菱", "Zap Cannon": "电磁炮", "Foresight": "识破", "Destiny Bond": "同命", "Perish Song": "终焉之歌",
            "Icy Wind": "冰冻之风", "Detect": "看穿", "Bone Rush": "骨棒乱打", "Lock On": "锁定", "Outrage": "逆鳞", "Sandstorm": "沙暴", "Giga Drain": "终极吸取", "Endure": "挺住", "Charm": "撒娇",
            "Rollout": "滚动", "False Swipe": "点到为止", "Swagger": "虚张声势", "Milk Drink": "喝牛奶", "Spark": "电光", "Fury Cutter": "连斩", "Steel Wing": "钢翼", "Mean Look": "黑色目光",
            "Attract": "迷人", "Sleep Talk": "梦话", "Heal Bell": "治愈铃声", "Return": "报恩", "Present": "礼物", "Frustration": "迁怒", "Safeguard": "神秘守护", "Pain Split": "分担痛楚",
            "Sacred Fire": "神圣之火", "Magnitude": "震级", "Dynamic Punch": "爆裂拳", "Megahorn": "超级角击", "Dragon Breath": "龙息", "Baton Pass": "接棒", "Encore": "再来一次",
            "Pursuit": "追打", "Rapid Spin": "高速旋转", "Sweet Scent": "甜甜香气", "Iron Tail": "铁尾", "Metal Claw": "金属爪", "Vital Throw": "借力摔", "Morning Sun": "晨光",
            "Synthesis": "光合作用", "Moonlight": "月光", "Hidden Power": "觉醒力量", "Cross Chop": "十字劈", "Twister": "龙卷风", "Rain Dance": "求雨", "Sunny Day": "大晴天", "Crunch": "咬碎",
            "Mirror Coat": "镜面反射", "Psych Up": "自我暗示", "Extreme Speed": "神速", "Ancient Power": "原始之力", "Shadow Ball": "暗影球", "Future Sight": "预知未来", "Rock Smash": "碎岩",
            "Whirlpool": "潮旋", "Beat Up": "围攻", "Fake Out": "击掌奇袭", "Uproar": "吵闹", "Stockpile": "蓄力", "Spit Up": "喷出", "Swallow": "吞下", "Heat Wave": "热风", "Hail": "冰雹",
            "Torment": "无理取闹", "Flatter": "吹捧", "Will OWisp": "磷火", "Memento": "临别礼物", "Facade": "硬撑", "Focus Punch": "真气拳", "Smelling Salts": "清醒", "Follow Me": "看我嘛",
            "Nature Power": "自然之力", "Charge": "充电", "Taunt": "挑衅", "Helping Hand": "帮助", "Trick": "戏法", "Role Play": "扮演", "Wish": "祈愿", "Assist": "借助", "Ingrain": "扎根",
            "Superpower": "蛮力", "Magic Coat": "魔法反射", "Recycle": "回收利用", "Revenge": "报复", "Brick Break": "劈瓦", "Yawn": "哈欠", "Knock Off": "拍落", "Endeavor": "蛮干",
            "Eruption": "喷火", "Skill Swap": "特性互换", "Imprison": "封印", "Refresh": "焕然一新", "Grudge": "怨念", "Snatch": "抢夺", "Secret Power": "秘密之力", "Dive": "潜水",
            "Arm Thrust": "猛推", "Camouflage": "保护色", "Tail Glow": "萤火", "Luster Purge": "洁净光芒", "Mist Ball": "薄雾球", "Feather Dance": "羽毛舞", "Teeter Dance": "摇晃舞",
            "Blaze Kick": "火焰踢", "Mud Sport": "玩泥巴", "Ice Ball": "冰球", "Needle Arm": "尖刺臂", "Slack Off": "偷懒", "Hyper Voice": "巨声", "Poison Fang": "剧毒牙", "Crush Claw": "撕裂爪",
            "Blast Burn": "爆炸烈焰", "Hydro Cannon": "加农水炮", "Meteor Mash": "彗星拳", "Astonish": "惊吓", "Weather Ball": "气象球", "Aromatherapy": "芳香治疗", "Fake Tears": "假哭",
            "Air Cutter": "空气利刃", "Overheat": "过热", "Odor Sleuth": "气味侦测", "Rock Tomb": "岩石封锁", "Silver Wind": "银色旋风", "Metal Sound": "金属音", "Grass Whistle": "草笛",
            "Tickle": "挠痒", "Cosmic Power": "宇宙力量", "Water Spout": "喷水", "Signal Beam": "信号光束", "Shadow Punch": "暗影拳", "Extrasensory": "神通力", "Sky Uppercut": "冲天拳",
            "Sand Tomb": "流沙深渊", "Sheer Cold": "绝对零度", "Muddy Water": "浊流", "Bullet Seed": "种子机关枪", "Aerial Ace": "燕返", "Icicle Spear": "冰锥", "Iron Defense": "铁壁",
            "Block": "挡路", "Howl": "长嚎", "Dragon Claw": "龙爪", "Frenzy Plant": "疯狂植物", "Bulk Up": "健美", "Bounce": "弹跳", "Mud Shot": "泥巴射击", "Poison Tail": "毒尾", "Covet": "渴望",
            "Volt Tackle": "伏特攻击", "Magical Leaf": "魔法叶", "Water Sport": "玩水", "Calm Mind": "冥想", "Leaf Blade": "叶刃", "Dragon Dance": "龙之舞", "Rock Blast": "岩石爆击",
            "Shock Wave": "电击波", "Water Pulse": "水之波动", "Doom Desire": "破灭之愿", "Psycho Boost": "精神突进", "Roost": "羽栖", "Gravity": "重力", "Miracle Eye": "奇迹之眼",
            "Wake Up Slap": "唤醒巴掌", "Hammer Arm": "臂锤", "Gyro Ball": "陀螺球", "Healing Wish": "治愈之愿", "Brine": "盐水", "Natural Gift": "自然之恩", "Feint": "佯攻", "Pluck": "啄食",
            "Tailwind": "顺风", "Acupressure": "点穴", "Metal Burst": "金属爆炸", "U turn": "急速折返", "Close Combat": "近身战", "Payback": "以牙还牙", "Assurance": "恶意追击", "Embargo": "查封",
            "Fling": "投掷", "Psycho Shift": "精神转移", "Trump Card": "王牌", "Heal Block": "回复封锁", "Wring Out": "绞紧", "Power Trick": "力量戏法", "Gastro Acid": "胃液",
            "Lucky Chant": "幸运咒语", "Me First": "抢先一步", "Copycat": "仿效", "Power Swap": "力量互换", "Guard Swap": "防守互换", "Punishment": "惩罚", "Last Resort": "珍藏",
            "Worry Seed": "烦恼种子", "Sucker Punch": "突袭", "Toxic Spikes": "毒菱", "Heart Swap": "心灵互换", "Aqua Ring": "水流环", "Magnet Rise": "电磁飘浮", "Flare Blitz": "闪焰冲锋",
            "Force Palm": "发劲", "Aura Sphere": "波导弹", "Rock Polish": "岩石打磨", "Poison Jab": "毒击", "Dark Pulse": "恶之波动", "Night Slash": "暗袭要害", "Aqua Tail": "水流尾",
            "Seed Bomb": "种子炸弹", "Air Slash": "空气之刃", "X Scissor": "十字剪", "Bug Buzz": "虫鸣", "Dragon Pulse": "龙之波动", "Dragon Rush": "龙之俯冲", "Power Gem": "力量宝石",
            "Drain Punch": "吸取拳", "Vacuum Wave": "真空波", "Focus Blast": "真气弹", "Energy Ball": "能量球", "Brave Bird": "勇鸟猛攻", "Earth Power": "大地之力",
            "Switcheroo": "掉包", "Giga Impact": "终极冲击", "Nasty Plot": "诡计", "Bullet Punch": "子弹拳", "Avalanche": "雪崩", "Ice Shard": "冰砾", "Shadow Claw": "暗影爪", "Thunder Fang": "雷电牙",
            "Ice Fang": "冰冻牙", "Fire Fang": "火焰牙", "Shadow Sneak": "影子偷袭", "Mud Bomb": "泥巴炸弹", "Psycho Cut": "精神利刃", "Zen Headbutt": "意念头锤", "Mirror Shot": "镜光射击",
            "Flash Cannon": "加农光炮", "Rock Climb": "攀岩", "Defog": "清除浓雾", "Trick Room": "戏法空间", "Draco Meteor": "流星群", "Discharge": "放电", "Lava Plume": "喷烟",
            "Leaf Storm": "飞叶风暴", "Power Whip": "强力鞭打", "Rock Wrecker": "岩石炮", "Cross Poison": "十字毒刃", "Gunk Shot": "垃圾射击", "Iron Head": "铁头", "Magnet Bomb": "磁铁炸弹",
            "Stone Edge": "尖石攻击", "Captivate": "诱惑", "Stealth Rock": "隐形岩", "Grass Knot": "打草结", "Chatter": "喋喋不休", "Judgment": "制裁光砾", "Bug Bite": "虫咬",
            "Charge Beam": "充电光束", "Wood Hammer": "木槌", "Aqua Jet": "水流喷射", "Attack Order": "攻击指令", "Defend Order": "防御指令", "Heal Order": "回复指令", "Head Smash": "双刃头锤",
            "Double Hit": "二连击", "Roar of Time": "时光咆哮", "Spacial Rend": "亚空裂斩", "Lunar Dance": "新月舞", "Crush Grip": "捏碎", "Magma Storm": "熔岩风暴", "Dark Void": "暗黑洞",
            "Seed Flare": "种子闪光", "Ominous Wind": "奇异之风", "Shadow Force": "暗影潜袭", "Hone Claws": "磨爪", "Wide Guard": "广域防守", "Guard Split": "防守平分", "Power Split": "力量平分",
            "Wonder Room": "奇妙空间", "Psyshock": "精神冲击", "Venoshock": "毒液冲击", "Autotomize": "身体轻量化", "Rage Powder": "愤怒粉", "Telekinesis": "意念移物", "Magic Room": "魔法空间",
            "Smack Down": "击落", "Storm Throw": "山岚摔", "Flame Burst": "烈焰溅射", "Sludge Wave": "污泥波", "Quiver Dance": "蝶舞", "Heavy Slam": "重磅冲撞", "Synchronoise": "同步干扰",
            "Electro Ball": "电球", "Soak": "浸水", "Flame Charge": "蓄能焰袭", "Coil": "盘蜷", "Low Sweep": "下盘踢", "Acid Spray": "酸液炸弹", "Foul Play": "欺诈", "Simple Beam": "单纯光束",
            "Entrainment": "找伙伴", "After You": "您先请", "Round": "轮唱", "Echoed Voice": "回声", "Chip Away": "逐步击破", "Clear Smog": "清除之烟", "Stored Power": "辅助力量",
            "Quick Guard": "快速防守", "Ally Switch": "交换场地", "Scald": "热水", "Shell Smash": "破壳", "Heal Pulse": "治愈波动", "Hex": "祸不单行", "Sky Drop": "自由落体", "Shift Gear": "换档",
            "Circle Throw": "巴投", "Incinerate": "烧净", "Quash": "延后", "Acrobatics": "杂技", "Reflect Type": "镜面属性", "Retaliate": "报仇", "Final Gambit": "搏命", "Bestow": "传递礼物",
            "Inferno": "烈火深渊", "Water Pledge": "水之誓约", "Fire Pledge": "火之誓约", "Grass Pledge": "草之誓约", "Volt Switch": "伏特替换", "Struggle Bug": "虫之抵抗", "Bulldoze": "重踏",
            "Frost Breath": "冰息", "Dragon Tail": "龙尾", "Work Up": "自我激励", "Electro web": "电网", "Wild Charge": "疯狂伏特", "Drill Run": "直冲钻", "Dual Chop": "二连劈",
            "Heart Stamp": "爱心印章", "Horn Leech": "木角", "Sacred Sword": "圣剑", "Razor Shell": "贝壳刃", "Heat Crash": "高温重压", "Leaf Tornado": "青草搅拌器", "Steamroller": "疯狂滚压",
            "Cotton Guard": "棉花防守", "Night Daze": "暗黑爆破", "Psystrike": "精神击破", "Tail Slap": "扫尾拍打", "Hurricane": "暴风", "Head Charge": "爆炸头突击", "Gear Grind": "齿轮飞盘",
            "Searing Shot": "火焰弹", "Techno Blast": "高科技光炮", "Relic Song": "古老之歌", "Secret Sword": "神秘之剑", "Glaciate": "冰封世界", "Bolt Strike": "雷击", "Blue Flare": "青焰",
            "Fiery Dance": "火之舞", "Freeze Shock": "冰冻伏特", "Ice Burn": "极寒冷焰", "Snarl": "大声咆哮", "Icicle Crash": "冰柱坠击", "V create": "Ｖ热焰", "Fusion Flare": "交错火焰",
            "Fusion Bolt": "交错闪电", "Flying Press": "飞身重压", "Mat Block": "掀榻榻米", "Belch": "打嗝", "Rototiller": "耕地", "Sticky Web": "黏黏网", "Fell Stinger": "致命针刺",
            "Phantom Force": "潜灵奇袭", "Trick or Treat": "万圣夜", "Noble Roar": "战吼", "Ion Deluge": "等离子浴", "Parabolic Charge": "抛物面充电", "Forest Curse": "森林咒术",
            "Petal Blizzard": "落英缤纷", "Freeze Dry": "冷冻干燥", "Disarming Voice": "魅惑之声", "Parting Shot": "抛下狠话", "Topsy Turvy": "颠倒", "Draining Kiss": "吸取之吻",
            "Crafty Shield": "戏法防守", "Flower Shield": "鲜花防守", "Grassy Terrain": "青草场地", "Misty Terrain": "薄雾场地", "Electrify": "输电", "Play Rough": "嬉闹", "Fairy Wind": "妖精之风",
            "Moonblast": "月亮之力", "Boomburst": "爆音波", "Fairy Lock": "妖精之锁", "Kings Shield": "王者盾牌", "Play Nice": "和睦相处", "Confide": "密语", "Diamond Storm": "钻石风暴",
            "Steam Eruption": "蒸汽爆炸", "Hyperspace Hole": "异次元洞", "Water Shuriken": "飞水手里剑", "Mystical Fire": "魔法火焰", "Spiky Shield": "尖刺防守", "Aromatic Mist": "芳香薄雾",
            "Eerie Impulse": "怪异电波", "Venom Drench": "毒液陷阱", "Powder": "粉尘", "Geomancy": "大地掌控", "Magnetic Flux": "磁场操控", "Happy Hour": "欢乐时光",
            "Electric Terrain": "电气场地", "Dazzling Gleam": "魔法闪耀", "Celebrate": "庆祝", "Hold Hands": "牵手", "BabyDoll Eyes": "圆瞳", "Nuzzle": "蹭蹭脸颊", "Hold Back": "手下留情",
            "Infestation": "纠缠不休", "PowerUp Punch": "增强拳", "Oblivion Wing": "归天之翼", "Thousand Arrows": "千箭齐发", "Thousand Waves": "千波激荡", "Lands Wrath": "大地神力",
            "Light of Ruin": "破灭之光", "Origin Pulse": "根源波动", "Precipice Blades": "断崖之剑", "Dragon Ascent": "画龙点睛", "Hyperspace Fury": "异次元猛攻",
            "Breakneck Blitz": "一般Ｚ究极无敌大冲撞", "All Out Pummeling": "格斗Ｚ全力无双激烈拳", "Supersonic Skystrike": "飞行Ｚ极速俯冲轰烈撞", "Acid Downpour": "毒Ｚ强酸剧毒灭绝雨",
            "Tectonic Rage": "地面Ｚ地隆啸天大终结", "Continental Crush": "岩石Ｚ毁天灭地巨岩坠", "Savage Spin Out": "虫Ｚ绝对捕食回旋斩", "Never Ending Nightmare": "幽灵Ｚ无尽暗夜之诱惑",
            "Corkscrew Crash": "钢Ｚ超绝螺旋连击", "Inferno Overdrive": "火Ｚ超强极限爆焰弹", "Hydro Vortex": "水Ｚ超级水流大漩涡", "Bloom Doom": "草Ｚ绚烂缤纷花怒放",
            "Gigavolt Havoc": "电Ｚ终极伏特狂雷闪", "Shattered Psyche": "超能力Ｚ至高精神破坏波", "Subzero Slammer": "冰Ｚ激狂大地万里冰", "Devastating Drake": "龙Ｚ究极巨龙震天地",
            "Black Hole Eclipse": "恶Ｚ黑洞吞噬万物灭", "Twinkle Tackle": "妖精Ｚ可爱星星飞天撞", "Catastropika": "皮卡丘Ｚ皮卡皮卡必杀击", "Shore Up": "集沙", "First Impression": "迎头一击",
            "Baneful Bunker": "碉堡", "Spirit Shackle": "缝影", "Darkest Lariat": "ＤＤ金勾臂", "Sparkling Aria": "泡影的咏叹调", "Ice Hammer": "冰锤", "Floral Healing": "花疗",
            "High Horsepower": "十万马力", "Strength Sap": "吸取力量", "Solar Blade": "日光刃", "Leafage": "树叶", "Spotlight": "聚光灯", "Toxic Thread": "毒丝", "Laser Focus": "磨砺",
            "Gear Up": "辅助齿轮", "Throat Chop": "深渊突刺", "Pollen Puff": "花粉团", "Anchor Shot": "掷锚", "Psychic Terrain": "精神场地", "Lunge": "猛扑", "Fire Lash": "火焰鞭",
            "Power Trip": "嚣张", "Burn Up": "燃尽", "Speed Swap": "速度互换", "Smart Strike": "修长之角", "Purify": "净化", "Revelation Dance": "觉醒之舞", "Core Enforcer": "核心惩罚者",
            "Trop Kick": "热带踢", "Instruct": "号令", "Beak Blast": "鸟嘴加农炮", "Clanging Scales": "鳞片噪音", "Dragon Hammer": "龙锤", "Brutal Swing": "狂舞挥打", "Aurora Veil": "极光幕",
            "Sinister Arrow Raid": "狙射树枭Ｚ遮天蔽日暗影箭", "Malicious Moonsault": "炽焰咆哮虎Ｚ极恶飞跃粉碎击", "Oceanic Operetta": "西狮海壬Ｚ海神庄严交响乐",
            "Guardian of Alola": "卡璞Ｚ巨人卫士・阿罗拉", "Soul Stealing 7 Star Strike": "玛夏多Ｚ七星夺魂腿", "Stoked Sparksurfer": "阿罗雷Ｚ驾雷驭电戏冲浪",
            "Pulverizing Pancake": "卡比兽Ｚ认真起来大爆击", "Extreme Evoboost": "伊布Ｚ九彩昇华齐聚顶", "Genesis Supernova": "梦幻Ｚ起源超新星大爆炸", "Shell Trap": "陷阱甲壳",
            "Fleur Cannon": "花朵加农炮", "Psychic Fangs": "精神之牙", "Stomping Tantrum": "跺脚", "Shadow Bone": "暗影之骨", "Accelerock": "冲岩", "Liquidation": "水流裂破",
            "Prismatic Laser": "棱镜镭射", "Spectral Thief": "暗影偷盗", "Sunsteel Strike": "流星闪冲", "Moongeist Beam": "暗影之光", "Tearful Look": "泪眼汪汪", "Zing Zap": "麻麻刺刺",
            "Natures Madness": "自然之怒", "Multi Attack": "多属性攻击", "10,000,000 Volt Thunderbolt": "智皮卡Ｚ千万伏特", "Mind Blown": "惊爆大头", "Plasma Fists": "等离子闪电拳",
            "Photon Geyser": "光子喷涌", "Clangorous Soulblaze": "杖尾鳞甲龙Ｚ炽魂热舞烈音爆", "Splintered Stormshards": "鬃岩狼人Ｚ狼啸石牙飓风暴", "Let's Snuggle Forever": "谜拟丘Ｚ亲密无间大乱揍",
            "Searing Sunraze Smash": "索尔迦雷欧Ｚ日光回旋下苍穹", "Menacing Moonraze Maelstrom": "露奈雅拉Ｚ月华飞溅落灵霄", "Light That Burns the Sky": "究极奈克洛Ｚ焚天灭世炽光爆",
            "Zippy Zap": "电电加速", "Splishy Splash": "滔滔冲浪", "Floaty Fall": "飘飘坠落", "Pika Papow": "闪闪雷光", "Bouncy Bubble": "活活气泡", "Buzzy Buzz": "麻麻电击",
            "Sizzly Slide": "熊熊火爆", "Glitzy Glow": "哗哗气场", "Baddy Bad": "坏坏领域", "Sappy Seed": "茁茁炸弹", "Freezy Frost": "冰冰霜冻", "Sparkly Swirl": "亮亮风暴",
            "Veevee Volley": "砰砰击破", "Double Iron Bash": "钢拳双击", "Max Guard": "极巨防壁", "Dynamax Cannon": "极巨炮", "Snipe Shot": "狙击", "Jaw Lock": "紧咬不放",
            "Stuff Cheeks": "大快朵颐", "No Retreat": "背水一战", "Tar Shot": "沥青射击", "Magic Powder": "魔法粉", "Dragon Darts": "龙箭", "Teatime": "茶会", "Octolock": "蛸固",
            "Bolt Beak": "电喙", "Fishious Rend": "鳃咬", "Court Change": "换场", "Max Flare": "极巨火爆", "Max Flutterby": "极巨虫蛊", "Max Lightning": "极巨闪电", "Max Strike": "极巨攻击",
            "Max Knuckle": "极巨拳斗", "Max Phantasm": "极巨幽魂", "Max Hailstorm": "极巨寒冰", "Max Ooze": "极巨酸毒", "Max Geyser": "极巨水流", "Max Airstream": "极巨飞冲",
            "Max Starfall": "极巨妖精", "Max Wyrmwind": "极巨龙骑", "Max Mindstorm": "极巨超能", "Max Rockfall": "极巨岩石", "Max Quake": "极巨大地", "Max Darkness": "极巨恶霸",
            "Max Overgrowth": "极巨草原", "Max Steelspike": "极巨钢铁", "Clangorous Soul": "魂舞烈音爆", "Body Press": "扑击", "Decorate": "装饰", "Drum Beating": "鼓击",
            "Snap Trap": "捕兽夹", "Pyro Ball": "火焰球", "Behemoth Blade": "巨兽斩", "Behemoth Bash": "巨兽弹", "Aura Wheel": "气场轮", "Breaking Swipe": "广域破坏",
            "Branch Poke": "木枝突刺", "Overdrive": "破音", "Apple Acid": "苹果酸", "Grav Apple": "万有引力", "Spirit Break": "灵魂冲击", "Strange Steam": "神奇蒸汽",
            "Life Dew": "生命水滴", "Obstruct": "拦堵", "False Surrender": "假跪真撞", "Meteor Assault": "流星突击", "Eternabeam": "无极光束", "Steel Beam": "铁蹄光线",
            "G Max Wildfire": "超极巨深渊灭焰", "G Max Befuddle": "超极巨蝶影蛊惑", "G Max Volt Crash": "超极巨万雷轰顶", "G Max Gold Rush": "超极巨特大金币",
            "G Max Chi Strike": "超极巨会心一击", "G Max Terror": "超极巨幻影幽魂", "G Max Resonance": "超极巨极光旋律", "G Max Cuddle": "超极巨热情拥抱",
            "G Max Replenish": "超极巨资源再生", "G Max Malodor": "超极巨臭气冲天", "G Max Stonesurge": "超极巨岩阵以待", "G Max Wind Rage": "超极巨旋风袭卷",
            "G Max Stun Shock": "超极巨异毒电场", "G Max Finale": "超极巨幸福圆满", "G Max Depletion": "超极巨劣化衰变", "G Max Gravitas": "超极巨天道七星",
            "G Max Volcalith": "超极巨炎石喷发", "G Max Sandblast": "超极巨沙尘漫天", "G Max Snooze": "超极巨睡魔降临", "G Max Tartness": "超极巨酸不溜丢",
            "G Max Sweetness": "超极巨琼浆玉液", "G Max Smite": "超极巨天谴雷诛", "G Max Steelsurge": "超极巨钢铁阵法", "G Max Meltdown": "超极巨液金熔击",
            "G Max Foam Burst": "超极巨激漩泡涡", "G Max Centiferno": "超极巨百火焚野", "Expanding Force": "广域战力", "Steel Roller": "铁滚轮", "Scale Shot": "鳞射",
            "Meteor Beam": "流星光束", "Shell Side Arm": "臂贝武器", "Misty Explosion": "薄雾炸裂", "Grassy Glide": "青草滑梯", "Rising Voltage": "电力上升", "Terrain Pulse": "大地波动",
            "Skitter Smack": "爬击", "Burning Jealousy": "妒火", "Lash Out": "泄愤", "Poltergeist": "灵骚", "Corrosive Gas": "腐蚀气体", "Coaching": "指导", "Flip Turn": "快速折返",
            "Triple Axel": "三旋击", "Dual Wingbeat": "双翼", "Scorching Sands": "热沙大地", "Jungle Healing": "丛林治疗", "Wicked Blow": "暗冥强击", "Surging Strikes": "水流连打",
            "G Max Drum Solo": "超极巨狂擂乱打", "G Max Fireball": "超极巨破阵火球", "G Max Hydrosnipe": "超极巨狙击神射", "G Max Vine Lash": "超极巨灰飞鞭灭",
            "G Max Cannonade": "超极巨水炮轰灭", "G Max One Blow": "超极巨夺命一击", "G Max Rapid Flow": "超极巨流水连击", "Thunder Cage": "雷电囚笼", "Dragon Energy": "巨龙威能",
            "Freezing Glare": "冰冷视线", "Fiery Wrath": "怒火中烧", "Thunderous Kick": "雷鸣蹴击", "Glacial Lance": "雪矛", "Astral Barrage": "星碎", "Eerie Spell": "诡异咒语",
            "Dire Claw": "克命爪", "Psyshield Bash": "屏障猛攻", "Power Shift": "力量转换", "Stone Axe": "岩斧", "Springtide Storm": "阳春风暴", "Mystical Power": "神秘之力",
            "Raging Fury": "大愤慨", "Wave Crash": "波动冲", "Chloroblast": "叶绿爆震", "Mountain Gale": "冰山风", "Victory Dance": "胜利之舞", "Headlong Rush": "突飞猛扑",
            "Barb Barrage": "毒千针", "Esper Wing": "气场之翼", "Bitter Malice": "冤冤相报", "Shelter": "闭关", "Triple Arrows": "三连箭", "Infernal Parade": "群魔乱舞",
            "Ceaseless Edge": "秘剑・千重涛", "Bleakwind Storm": "枯叶风暴", "Wildbolt Storm": "鸣雷风暴", "Sandsear Storm": "热沙风暴", "Lunar Blessing": "新月祈祷",
            "Take Heart": "勇气填充", "Tera Blast": "太晶爆发", "Silk Trap": "线阱", "Axe Kick": "下压踢", "Last Respects": "扫墓", "Lumina Crash": "琉光冲激", "Order Up": "上菜",
            "Jet Punch": "喷射拳", "Spicy Extract": "辣椒精华", "Spin Out": "疾速转轮", "Population Bomb": "鼠数儿", "Ice Spinner": "冰旋", "Glaive Rush": "巨剑突击",
            "Revival Blessing": "复生祈祷", "Salt Cure": "盐腌", "Triple Dive": "三连钻", "Mortal Spin": "晶光转转", "Doodle": "描绘", "Fillet Away": "甩肉", "Kowtow Cleave": "仆刀",
            "Flower Trick": "千变万花", "Torch Song": "闪焰高歌", "Aqua Step": "流水旋舞", "Raging Bull": "怒牛", "Make It Rain": "淘金潮", "Psyblade": "精神剑", "Hydro Steam": "水蒸气",
            "Ruination": "大灾难", "Collision Course": "全开猛撞", "Electro Drift": "闪电猛冲", "Shed Tail": "断尾", "Chilly Reception": "冷笑话", "Tidy Up": "大扫除",
            "Snowscape": "雪景", "Pounce": "虫扑", "Trailblaze": "起草", "Chilling Water": "泼冷水", "Hyper Drill": "强力钻", "Twin Beam": "双光束", "Rage Fist": "愤怒之拳",
            "Armor Cannon": "铠农炮", "Bitter Blade": "悔念剑", "Double Shock": "电光双击", "Gigaton Hammer": "巨力锤", "Comeuppance": "复仇", "Aqua Cutter": "水波刀",
            "Blazing Torque": "灼热暴冲", "Wicked Torque": "黑暗暴冲", "Noxious Torque": "剧毒暴冲", "Combat Torque": "格斗暴冲", "Magical Torque": "魔法暴冲",
            "Blood Moon": "血月", "Matcha Gotcha": "刷刷茶炮", "Syrup Bomb‎": "糖浆炸弹", "Ivy Cudgel": "棘藤棒", "Electro Shot": "电光束", "Tera Starstorm": "晶光星群",
            "Fickle Beam": "随机光", "Burning Bulwark": "火焰守护", "Thunderclap": "迅雷", "Mighty Cleave": "强刃攻击", "Tachyon Cutter": "迅子利刃", "Hard Press": "硬压",
            "Dragon Cheer": "龙声鼓舞", "Alluring Voice": "魅诱之声", "Temper Flare": "豁出去", "Supercell Slam": "闪电强袭", "Psychic Noise": "精神噪音", "Upper Hand": "快手还击",
            "Malignant Chain": "邪毒锁链", "Nihil Light": "归无之光",

            // --- 区域 ---
            "Verdant Forest":"翠绿森林", "Foggy Graveyard":"迷雾墓地", "Woodland Concert":"林间音乐会", "Mantle Core":"地幔核心", "Fido Park":"宠物公园",
            "City Sewers":"城市下水道", "Active Volcano":"活火山", "Power Plant":"发电厂", "Quiet Meadow":"静谧草坪", "Urban Walkway":"城市步道",
            "Sandy Dunes":"沙丘地带", "Sunken Ship":"沉没船只", "Offshore Rigger":"近海钻井平台", "Safari Zone":"狩猎地带", "Cool Beach":"清凉海滩",
            "Computering Lab":"计算机实验室", "Gemstone Cavern":"宝石洞穴", "Frozen Lake":"冰封湖泊", "Abandoned Manor":"废弃庄园", "Draco Lair":"龙巢穴",
            "Mountain Trail":"山间小径", "Tea Parlor":"茶馆", "Pokemon Dojo":"宝可梦道场", "Sky High":"高空区域", "Dank Cave":"潮湿洞穴",
            "Forest Shrine":"森林神社", "Street Circus":"街头马戏团", "Weapons Facility":"武器设施", "Scorching Badlands":"灼热荒地", "Lava Lake":"熔岩湖",
            "Crashing Seaside":"惊涛海岸", "Strange Space":"异空间", "Chargestone Cave":"电石洞穴", "Seafoam Currents":"海沫洋流", "Valor Lakeside":"勇气湖畔",
            "Thornwood Forest":"荆棘森林", "Unova Works":"合众工厂", "Snowpoint Cliff":"雪点悬崖", "Hollow Nest":"中空巢穴", "Poni Canyon":"波尼峡谷", "Sea Bed":"海底",
            "Lon Lon Ranch":"隆隆牧场", "Saru Temple":"猿猴神殿", "Evil Summit":"邪恶山顶", "Fuego Ironworks":"火之炼铁厂", "Permafrost Grotto":"永冻洞穴",
            "Berry Forest":"树果森林", "Relic Passage":"遗迹通道",
            "Sinnoh Underground":"神奥地下通道", "Beginner Training":"初级训练所", "Advanced Training":"高级训练所", "Expert Training":"专家训练所", "Victory Road":"冠军之路",

            // --- 多形态 (修正空格) ---
            'Oricorio Baile': '花舞鸟 热辣热辣', 'Oricorio Pom pom': '花舞鸟 啪滋啪滋', 'Oricorio Pau': '花舞鸟 呼拉呼拉', 'Oricorio Sensu': '花舞鸟 轻盈轻盈',
            "Furfrou Heart": "心形 多丽米亚", "Furfrou Star": "星形 多丽米亚", "Furfrou Diamond": "菱形 多丽米亚", "Furfrou Debutante": "淑女 多丽米亚", "Furfrou Matron": "贵妇 多丽米亚",
            "Furfrou Dandy": "绅士 多丽米亚", "Furfrou Reine": "女王 多丽米亚", "Furfrou Kabuki": "歌舞伎 多丽米亚", "Furfrou Pharaoh": "国王 多丽米亚",
            "Lycanroc Midday": "白昼 鬃岩狼人", "Lycanroc Midnight": "黑夜 鬃岩狼人", "Lycanroc Dusk": "黄昏 鬃岩狼人",
            "Unown Exclamation":"未知图腾 !", "Unown Question":"未知图腾 ?",
            "Rotom Heat": "加热 洛托姆", "Rotom Wash": "清洗 洛托姆", "Rotom Frost": "结冰 洛托姆", "Rotom Fan": "旋转 洛托姆", "Rotom Mow": "切割 洛托姆",
            "Pikachu PopStar": "偶像 皮卡丘", "Pikachu PhD": "博士 皮卡丘", "Pikachu Libre": "面罩摔角手 皮卡丘", "Pikachu Belle": "贵妇 皮卡丘", "Pikachu RockStar": "硬摇滚 皮卡丘",
            "Magikarp Koi": "锦鲤 鲤鱼王", "Magikarp Regal": "富豪 鲤鱼王", "Magikarp Sakura": "樱花 鲤鱼王", "Magikarp Skelly": "骷髅 鲤鱼王", "Magikarp Soar": "腾跃 鲤鱼王", "Magikarp Tiger": "老虎 鲤鱼王"
        };

        // --- 核心：智能翻译函数 (增加驼峰分词) ---
        function splitCamelCase(str) {
            return str.replace(/([a-z])([A-Z])/g, '$1 $2');
        }

        function _t(text) {
            if (!text) return "";
            if (CN_DICT[text]) return CN_DICT[text];

            // 1. 尝试首字母大写匹配
            const capText = text.charAt(0).toUpperCase() + text.slice(1);
            if (CN_DICT[capText]) return CN_DICT[capText];

            // 2. 尝试拆分驼峰命名 (thunderShock -> Thunder Shock)
            const splitText = splitCamelCase(text);
            const capSplitText = splitText.charAt(0).toUpperCase() + splitText.slice(1);
            if (CN_DICT[capSplitText]) return CN_DICT[capSplitText];

            // 3. 智能处理 Mega
            if (text.startsWith("mega")) {
                const base = text.replace("mega", "");
                const capBase = base.charAt(0).toUpperCase() + base.slice(1);
                if (CN_DICT[capBase]) return `[Mega] ${CN_DICT[capBase]}`;
                if (CN_DICT[base]) return `[Mega] ${CN_DICT[base]}`;
                return `[Mega] ${base}`;
            }
            return text;
        }

        // --- 样式设置 ---
        function setStyles(el, styles) {
            for (let key in styles) el.style[key] = styles[key];
        }

        // =================================================================
        // 2. 统计逻辑模块
        // =================================================================
        const stats = {
            player: { id: null, moves: {} },
            enemy: { id: null, moves: {} }
        };

        function resetStats(side, newId = null) {
            stats[side] = { id: newId, moves: {} };
            renderStats(side);
        }

        function recordDamage(side, moveName, damage) {
            if (!stats[side].moves[moveName]) {
                stats[side].moves[moveName] = { total: 0, count: 0 };
            }
            stats[side].moves[moveName].total += damage;
            stats[side].moves[moveName].count++;
            renderStats(side);
        }

        function renderStats(side) {
            const container = document.getElementById(`stats-${side}`);
            if (!container) return;

            const moveKeys = Object.keys(stats[side].moves);
            if (moveKeys.length === 0) {
                container.innerHTML = `<span style="opacity:0.5;">暂无数据</span>`;
            } else {
                container.innerHTML = moveKeys.map(m => {
                    const data = stats[side].moves[m];
                    const avg = Math.round(data.total / data.count);
                    return `<div style="display:flex; justify-content:space-between;">
                        <span>${m}</span>
                        <span style="color:${side === 'player' ? '#74b9ff' : '#ff7675'}">${avg}</span>
                    </div>`;
                }).join("");
            }
        }

        // =================================================================
        // 3. UI 构建
        // =================================================================
        const container = document.createElement('div');
        container.id = 'battle-log-overlay';
        setStyles(container, {
            position: 'fixed', left: '20px', top: '120px', width: '280px', maxHeight: '80vh',
            backgroundColor: '#000000', color: '#eeeeee', border: '2px solid #555555', borderRadius: '8px',
            zIndex: '2147483647', fontFamily: 'Segoe UI, sans-serif', fontSize: '12px',
            display: 'flex', flexDirection: 'column', boxShadow: '0 5px 20px rgba(0,0,0,0.9)', overflow: 'hidden'
        });
        document.body.appendChild(container);

        const header = document.createElement('div');
        header.id = 'battle-log-header';
        // 增加重置按钮
        header.innerHTML = `
            <div style="display:flex;align-items:center;gap:5px;">
                <span>📊 战斗日志</span>
                <span id="btn-reset-stats" title="重置统计" style="cursor:pointer;font-size:14px;padding:0 4px;">🔄</span>
            </div>
            <span id="collapse-icon">▼</span>
        `;
        setStyles(header, {
            background: 'linear-gradient(90deg, #333333, #111111)', padding: '10px', fontWeight: 'bold',
            textAlign: 'center', cursor: 'move', userSelect: 'none', borderBottom: '1px solid #555555',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        });
        container.appendChild(header);

        const panel = document.createElement('div');
        panel.id = 'battle-info-panel';
        setStyles(panel, { padding: '12px', backgroundColor: '#111111', borderBottom: '1px solid #444444', display: 'flex', flexDirection: 'column', gap: '10px' });
        container.appendChild(panel);

        // 包含统计面板的 HTML
        panel.innerHTML = `
            <div id="box-enemy" style="padding:8px;border-radius:4px;display:flex;flex-direction:column;gap:4px;border:1px solid #880000;background-color:#220000;">
                <div style="display:flex;justify-content:space-between;color:#fff;font-weight:bold;">
                    <span id="name-enemy">Enemy</span>
                    <span id="hp-text-enemy" style="font-family:Consolas,monospace;">--/--</span>
                </div>
                <div style="height:6px;background:#333;border-radius:3px;overflow:hidden;margin-bottom:2px;">
                    <div id="hp-bar-enemy" style="height:100%;width:100%;background-color:#2ecc71;transition:width 0.2s;"></div>
                </div>
                <div id="stats-enemy" style="border-top:1px solid rgba(255,255,255,0.1); padding-top:4px; font-size:11px; color:#ccc; display:grid; grid-template-columns: 1fr 1fr; gap: 4px;"></div>
            </div>

            <div id="box-player" style="padding:8px;border-radius:4px;display:flex;flex-direction:column;gap:4px;border:1px solid #000055;background-color:#000022;">
                <div style="display:flex;justify-content:space-between;color:#fff;font-weight:bold;">
                    <span id="name-player">Player</span>
                    <span id="hp-text-player" style="font-family:Consolas,monospace;">--/--</span>
                </div>
                <div style="height:6px;background:#333;border-radius:3px;overflow:hidden;margin-bottom:2px;">
                    <div id="hp-bar-player" style="height:100%;width:100%;background-color:#2ecc71;transition:width 0.2s;"></div>
                </div>
                <div id="stats-player" style="border-top:1px solid rgba(255,255,255,0.1); padding-top:4px; font-size:11px; color:#ccc; display:grid; grid-template-columns: 1fr 1fr; gap: 4px;"></div>
            </div>
        `;

        const contentWrapper = document.createElement('div');
        setStyles(contentWrapper, { flexGrow: '1', position: 'relative', overflow: 'hidden', minHeight: '100px', backgroundColor: '#000000', display: 'flex', flexDirection: 'column' });
        container.appendChild(contentWrapper);

        const logContent = document.createElement('div');
        logContent.id = 'battle-log-content';
        setStyles(logContent, { flexGrow: '1', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' });
        contentWrapper.appendChild(logContent);

        const scrollBtn = document.createElement('div');
        scrollBtn.innerHTML = "⬇️";
        setStyles(scrollBtn, {
            position: 'absolute', bottom: '10px', right: '15px', width: '30px', height: '30px',
            backgroundColor: '#3498db', color: '#fff', borderRadius: '50%', display: 'none',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: '20', border: '1px solid #fff'
        });
        contentWrapper.appendChild(scrollBtn);

        // --- 交互逻辑 ---
        header.onmousedown = function(e) {
            // 防止点击重置按钮时触发拖动
            if (e.target.id === 'btn-reset-stats') return;

            e.preventDefault();
            let shiftX = e.clientX - container.getBoundingClientRect().left;
            let shiftY = e.clientY - container.getBoundingClientRect().top;
            function moveAt(px, py) { container.style.left = px - shiftX + 'px'; container.style.top = py - shiftY + 'px'; }
            function onMouseMove(e) { moveAt(e.pageX, e.pageY); }
            document.addEventListener('mousemove', onMouseMove);
            document.onmouseup = function() { document.removeEventListener('mousemove', onMouseMove); document.onmouseup = null; };
        };

        // 重置按钮点击逻辑
        document.getElementById('btn-reset-stats').addEventListener('click', (e) => {
            e.stopPropagation(); // 防止触发折叠
            resetStats('player', stats.player.id);
            resetStats('enemy', stats.enemy.id);
            addLogEntry('<span style="color:#aaa;font-style:italic;">-- 统计数据已重置 --</span>', 'sys');
        });

        let isCollapsed = false, isDragging = false;
        header.addEventListener('mousedown', () => isDragging = false);
        header.addEventListener('mousemove', () => isDragging = true);
        header.addEventListener('click', (e) => {
            if (isDragging || e.target.id === 'btn-reset-stats') return;
            isCollapsed = !isCollapsed;
            const disp = isCollapsed ? 'none' : 'flex';
            panel.style.display = disp;
            contentWrapper.style.display = disp;
            container.style.height = isCollapsed ? 'auto' : '';
            document.getElementById('collapse-icon').innerText = isCollapsed ? '◀' : '▼';
        });

        let autoScroll = true;
        logContent.addEventListener('scroll', () => {
            if (logContent.scrollHeight - logContent.scrollTop - logContent.clientHeight < 30) { autoScroll = true; scrollBtn.style.display = 'none'; }
            else { autoScroll = false; scrollBtn.style.display = 'flex'; }
        });
        scrollBtn.addEventListener('click', () => { logContent.scrollTop = logContent.scrollHeight; });

        function addLogEntry(html, type) {
            const div = document.createElement('div');
            div.innerHTML = html;
            const baseStyle = { padding: '6px 8px', borderRadius: '3px', borderLeftWidth: '3px', borderLeftStyle: 'solid', fontFamily: 'Consolas, monospace' };
            setStyles(div, baseStyle);
            if (type === 'player') setStyles(div, { borderLeftColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.1)' });
            else if (type === 'enemy') setStyles(div, { borderLeftColor: '#e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.1)' });
            else if (type === 'warn') setStyles(div, { borderLeftColor: '#f39c12', color: '#f1c40f', textAlign: 'center', fontWeight: 'bold' });
            else setStyles(div, { borderLeftColor: '#aaa', color: '#aaa', fontStyle: 'italic', textAlign: 'center' });
            logContent.appendChild(div);
            if (logContent.children.length > 150) logContent.removeChild(logContent.firstChild);
            if (autoScroll) logContent.scrollTop = logContent.scrollHeight;
        }

        // --- 游戏 Hook 逻辑 ---
        let currentTurn = null;
        let ignoreUntil = 0;
        let trackedEnemy = null;
        let enemyDead = false;

        const origVoid = window.voidAnimation;
        window.voidAnimation = function(divName, animName) {
            try {
                origVoid.apply(this, arguments);
                if (Date.now() < ignoreUntil) return;

                if (animName && animName.includes('moveboxFire')) {
                    const isP = divName.startsWith('pkmn-movebox-slot');
                    const isE = divName.startsWith('pkmn-movebox-wild');
                    if (isP || isE) {
                        const el = document.getElementById(divName);
                        const mid = el ? el.dataset.move : '';

                        let mName = mid;
                        // 1. 尝试从全局 move 对象获取
                        if (typeof move !== 'undefined' && move[mid] && move[mid].name) {
                            mName = move[mid].name;
                        }
                        // 2. 翻译
                        mName = _t(mName || mid);

                        currentTurn = {
                            source: isP ? 'player' : 'enemy',
                            move: mName,
                            moveId: mid, // 保留原始ID用于查属性
                            damage: 0,
                            buffs: [],
                            sHP: (isP ? (typeof wildPkmnHp !== 'undefined' ? wildPkmnHp : 0) : (pkmn[team[exploreActiveMember].pkmn.id].playerHp))
                        };
                        setTimeout(() => { if(currentTurn) flushLog(); }, 600);
                    }
                }
            } catch(e) { console.error("Log Hook Error:", e); }
        };

        if (typeof window.moveBuff === 'function') {
            const origBuff = window.moveBuff;
            window.moveBuff = function(target, buff, mod) {
                const res = origBuff.apply(this, arguments);
                try {
                    if (currentTurn && Date.now() >= ignoreUntil) {
                        let who = (mod === 'self') ?
                            (currentTurn.source === 'player' ? '我方' : '敌方') :
                            (target === 'wild' ? '敌方' : '我方');
                        currentTurn.buffs.push(`${who} ${_t(buff)}`);
                    }
                } catch(e) {}
                return res;
            };
        }

        function flushLog() {
            if (!currentTurn) return;

            let actorName = "未知", color = "#aaa", styleType = "sys";
            let effText = "";

            try {
                if (currentTurn.source === 'player') {
                    actorName = team[exploreActiveMember].pkmn.id;
                    color = "#3498db"; styleType = "player";
                } else {
                    actorName = saved.currentPkmn;
                    color = "#e74c3c"; styleType = "enemy";
                }

                // --- 属性克制计算 ---
                if (typeof typeEffectiveness === 'function' && typeof move !== 'undefined' && typeof pkmn !== 'undefined') {
                    const moveData = move[currentTurn.moveId];
                    if (moveData) {
                        let defTypes = [];
                        if (currentTurn.source === 'player') {
                            // 玩家攻击，防御方是敌方
                            const eId = saved.currentPkmn;
                            if (eId && pkmn[eId]) defTypes = pkmn[eId].type;
                        } else {
                            // 敌方攻击，防御方是玩家
                            const pId = team[exploreActiveMember].pkmn.id;
                            if (pId && pkmn[pId]) defTypes = pkmn[pId].type;
                        }

                        if (defTypes.length > 0) {
                            const eff = typeEffectiveness(moveData.type, defTypes);
                            if (eff > 1) effText = `<span style="color:#ff7675;font-weight:bold;margin-left:4px;">(效果绝佳)</span>`;
                            else if (eff === 0) effText = `<span style="color:#7f8c8d;text-decoration:line-through;margin-left:4px;">(无效)</span>`;
                            else if (eff < 1) effText = `<span style="color:#95a5a6;margin-left:4px;">(收效甚微)</span>`;
                        }
                    }
                }
            } catch(e) {}

            actorName = _t(actorName);

            let html = `<span style="color:${color}; font-weight:bold;">${actorName}</span> 使用了 <span style="color:#74b9ff; font-weight:bold;">${currentTurn.move}</span>`;

            // 伤害逻辑
            if (currentTurn.damage > 0) {
                html += ` 造成 <span style="color:#ff7675; font-weight:bold;">${Math.round(currentTurn.damage)}</span> 伤害 ${effText}`;
                // 记录统计
                const sideKey = currentTurn.source === 'player' ? 'player' : 'enemy';
                recordDamage(sideKey, currentTurn.move, currentTurn.damage);
            } else {
                // 伤害为0的情况
                if (effText.includes("无效")) {
                    html += ` ${effText}`;
                } else {
                    html += ` <span style="color:#aaa;">(未命中/无伤害)</span>`;
                }
            }

            addLogEntry(html, styleType);
            if (currentTurn.buffs.length > 0) addLogEntry(`<span style="color:#fdcb6e">➜ ${currentTurn.buffs.join(' | ')}</span>`, 'sys');
            currentTurn = null;
        }

        if (typeof window.updateWildPkmn === 'function') {
            const origUpd = window.updateWildPkmn;
            window.updateWildPkmn = function() {
                try {
                    if (currentTurn && currentTurn.source === 'player') {
                        const cur = typeof wildPkmnHp !== 'undefined' ? wildPkmnHp : 0;
                        const dmg = currentTurn.sHP - cur;
                        if (dmg > 0) currentTurn.damage += dmg;
                        setTimeout(flushLog, 50);
                    }
                } catch(e) {}
                return origUpd.apply(this, arguments);
            };
        }

        if (typeof window.updateTeamPkmn === 'function') {
            const origUpdTeam = window.updateTeamPkmn;
            window.updateTeamPkmn = function() {
                try {
                    if (currentTurn && currentTurn.source === 'enemy') {
                        const pid = team[exploreActiveMember].pkmn.id;
                        const cur = pkmn[pid].playerHp;
                        const dmg = currentTurn.sHP - cur;
                        if (dmg > 0) currentTurn.damage += dmg;
                        setTimeout(flushLog, 50);
                    }
                } catch(e) {}
                return origUpdTeam.apply(this, arguments);
            };
        }

        let lastArea = null;
        setInterval(() => {
            if (typeof saved === 'undefined') return;

            if (saved.currentArea !== lastArea) {
                if (saved.currentArea) {
                    addLogEntry(`🗺️ <strong>进入: ${_t(saved.currentArea)}</strong>`, 'sys');
                    ignoreUntil = Date.now() + 800; trackedEnemy = null; enemyDead = false; currentTurn = null;
                    resetStats('enemy', null);
                }
                lastArea = saved.currentArea;
            }
            if (!saved.currentArea || Date.now() < ignoreUntil) return;

            const eCur = wildPkmnHp || 0, eMax = wildPkmnHpMax || 1;
            const currentEnemyId = saved.currentPkmn;
            document.getElementById('name-enemy').innerText = _t(currentEnemyId);
            document.getElementById('hp-text-enemy').innerText = `${Math.floor(eCur)}/${Math.floor(eMax)}`;
            document.getElementById('hp-bar-enemy').style.width = `${Math.max(0, Math.min(100, (eCur/eMax)*100))}%`;

            if (currentEnemyId !== stats.enemy.id) {
                resetStats('enemy', currentEnemyId);
            }

            if (team && team[exploreActiveMember]) {
                const p = pkmn[team[exploreActiveMember].pkmn.id];
                const pid = p.id;
                document.getElementById('name-player').innerText = _t(pid);
                document.getElementById('hp-text-player').innerText = `${Math.floor(p.playerHp)}/${Math.floor(p.playerHpMax)}`;
                document.getElementById('hp-bar-player').style.width = `${Math.max(0, Math.min(100, (p.playerHp/p.playerHpMax)*100))}%`;

                if (pid !== stats.player.id) {
                    resetStats('player', pid);
                }
            }

            const curE = saved.currentPkmn;
            if (curE !== trackedEnemy) {
                if (curE && wildLevel > 0) {
                    addLogEntry(`⚠️ 遭遇: ${_t(curE)} (Lv.${wildLevel})`, 'warn');
                    trackedEnemy = curE; enemyDead = false;
                }
            } else if (!enemyDead && eCur <= 0 && curE) {
                addLogEntry(`🏆 击败: ${_t(curE)}`, 'sys');
                enemyDead = true;
            }
        }, 200);
    }

    const script = document.createElement('script');
    script.textContent = `(${injectedScript.toString()})();`;
    document.body.appendChild(script);

})();