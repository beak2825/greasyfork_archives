// ==UserScript==
// @name         Better-PRTS-Plus
// @namespace    https://github.com/ntgmc/Better-PRTS-Plus
// @version      2.9.0
// @description  [整合版] 集成完美作业筛选、深度暗黑模式适配及干员头像可视化等功能的 zoot.plus 全方位体验增强脚本。
// @author       一只摆烂的42 & Gemini 3 pro
// @match        https://zoot.plus/*
// @icon         https://zoot.plus/favicon.ico
// @homepage     https://github.com/ntgmc/Better-PRTS-Plus
// @supportURL   https://github.com/ntgmc/Better-PRTS-Plus/issues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-body
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/558329/Better-PRTS-Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/558329/Better-PRTS-Plus.meta.js
// ==/UserScript==

/*
    Better-PRTS-Plus
    Copyright (C) 2023-2026  ntgmc
*/

(function() {
    'use strict';

    // =========================================================================
    //                            MODULE 1: 配置与常量
    // =========================================================================

    const OPS_STORAGE_KEY = 'prts_plus_user_ops';
    const DISPLAY_MODE_KEY = 'prts_plus_display_mode'; // 可选值: 'GRAY' | 'HIDE'

    // [V9.4 设置配置] 功能开关默认状态
    const CONFIG = {
        visuals: GM_getValue('prts_cfg_visuals', true), // 干员头像优化
        sidebar: GM_getValue('prts_cfg_sidebar', true), // 侧边栏优化
        cleanLink: GM_getValue('prts_cfg_link', true),  // 链接净化
        filterBar: GM_getValue('prts_cfg_filter', true) // 显示筛选栏
    };

    // 全局状态变量
    let currentFilterMode = 'NONE';
    let displayMode = GM_getValue(DISPLAY_MODE_KEY, 'GRAY');
    let ownedOpsSet = new Set();
    let isProcessingFilter = false;
    let rafId = null;
    let filterDebounceTimer = null;

    // =========================================================================
    //                            MODULE 2: 数据与样式
    // =========================================================================

    // [数据] 干员头像数据映射
    const RAW_OPS = [
      {"id":"char_002_amiya","name":"阿米娅"},{"id":"char_003_kalts","name":"凯尔希"},{"id":"char_009_12fce","name":"12F"},{"id":"char_010_chen","name":"陈"},{"id":"char_017_huang","name":"煌"},{"id":"char_1011_lava2","name":"炎狱炎熔"},{"id":"char_1012_skadi2","name":"浊心斯卡蒂"},{"id":"char_1013_chen2","name":"假日威龙陈"},{"id":"char_1014_nearl2","name":"耀骑士临光"},{"id":"char_1016_agoat2","name":"纯烬艾雅法拉"},{"id":"char_1019_siege2","name":"维娜·维多利亚"},{"id":"char_101_sora","name":"空"},{"id":"char_1020_reed2","name":"焰影苇草"},{"id":"char_1021_kroos2","name":"寒芒克洛丝"},{"id":"char_1023_ghost2","name":"归溟幽灵鲨"},{"id":"char_1024_hbisc2","name":"濯尘芙蓉"},{"id":"char_1026_gvial2","name":"百炼嘉维尔"},{"id":"char_1027_greyy2","name":"承曦格雷伊"},{"id":"char_1028_texas2","name":"缄默德克萨斯"},{"id":"char_1029_yato2","name":"麒麟R夜刀"},{"id":"char_102_texas","name":"德克萨斯"},{"id":"char_1030_noirc2","name":"火龙S黑角"},{"id":"char_1031_slent2","name":"淬羽赫默"},{"id":"char_1032_excu2","name":"圣约送葬人"},{"id":"char_1033_swire2","name":"琳琅诗怀雅"},{"id":"char_1034_jesca2","name":"涤火杰西卡"},{"id":"char_1035_wisdel","name":"维什戴尔"},{"id":"char_1036_fang2","name":"历阵锐枪芬"},{"id":"char_1038_whitw2","name":"荒芜拉普兰德"},{"id":"char_1039_thorn2","name":"引星棘刺"},{"id":"char_103_angel","name":"能天使"},{"id":"char_1040_blaze2","name":"烛煌"},{"id":"char_1041_angel2","name":"新约能天使"},{"id":"char_1042_phatm2","name":"酒神"},{"id":"char_1043_leizi2","name":"司霆惊蛰"},{"id":"char_1044_hsgma2","name":"斩业星熊"},{"id":"char_1045_svash2","name":"凛御银灰"},{"id":"char_1046_sbell2","name":"圣聆初雪"},{"id":"char_1047_halo2","name":"溯光星源"},{"id":"char_106_franka","name":"芙兰卡"},{"id":"char_107_liskam","name":"雷蛇"},{"id":"char_108_silent","name":"赫默"},{"id":"char_109_fmout","name":"远山"},{"id":"char_110_deepcl","name":"深海色"},{"id":"char_112_siege","name":"推进之王"},{"id":"char_113_cqbw","name":"W"},{"id":"char_115_headbr","name":"凛冬"},{"id":"char_117_myrrh","name":"末药"},{"id":"char_118_yuki","name":"白雪"},{"id":"char_120_hibisc","name":"芙蓉"},{"id":"char_121_lava","name":"炎熔"},{"id":"char_122_beagle","name":"米格鲁"},{"id":"char_123_fang","name":"芬"},{"id":"char_124_kroos","name":"克洛丝"},{"id":"char_126_shotst","name":"流星"},{"id":"char_127_estell","name":"艾丝黛尔"},{"id":"char_128_plosis","name":"白面鸮"},{"id":"char_129_bluep","name":"蓝毒"},{"id":"char_130_doberm","name":"杜宾"},{"id":"char_131_flameb","name":"炎客"},{"id":"char_133_mm","name":"梅"},{"id":"char_134_ifrit","name":"伊芙利特"},{"id":"char_135_halo","name":"星源"},{"id":"char_136_hsguma","name":"星熊"},{"id":"char_137_brownb","name":"猎蜂"},{"id":"char_140_whitew","name":"拉普兰德"},{"id":"char_141_nights","name":"夜烟"},{"id":"char_143_ghost","name":"幽灵鲨"},{"id":"char_144_red","name":"红"},{"id":"char_145_prove","name":"普罗旺斯"},{"id":"char_147_shining","name":"闪灵"},{"id":"char_148_nearl","name":"临光"},{"id":"char_149_scave","name":"清道夫"},{"id":"char_1502_crosly","name":"弑君者"},{"id":"char_150_snakek","name":"蛇屠箱"},{"id":"char_151_myrtle","name":"桃金娘"},{"id":"char_154_morgan","name":"摩根"},{"id":"char_155_tiger","name":"因陀罗"},{"id":"char_157_dagda","name":"达格达"},{"id":"char_158_milu","name":"守林人"},{"id":"char_159_peacok","name":"断罪者"},{"id":"char_163_hpsts","name":"火神"},{"id":"char_164_nightm","name":"夜魔"},{"id":"char_166_skfire","name":"天火"},{"id":"char_171_bldsk","name":"华法琳"},{"id":"char_172_svrash","name":"银灰"},{"id":"char_173_slchan","name":"崖心"},{"id":"char_174_slbell","name":"初雪"},{"id":"char_179_cgbird","name":"夜莺"},{"id":"char_180_amgoat","name":"艾雅法拉"},{"id":"char_181_flower","name":"调香师"},{"id":"char_183_skgoat","name":"地灵"},{"id":"char_185_frncat","name":"慕斯"},{"id":"char_187_ccheal","name":"嘉维尔"},{"id":"char_188_helage","name":"赫拉格"},{"id":"char_190_clour","name":"红云"},{"id":"char_192_falco","name":"翎羽"},{"id":"char_193_frostl","name":"霜叶"},{"id":"char_194_leto","name":"烈夏"},{"id":"char_195_glassb","name":"真理"},{"id":"char_196_sunbr","name":"古米"},{"id":"char_197_poca","name":"早露"},{"id":"char_198_blackd","name":"讯使"},{"id":"char_199_yak","name":"角峰"},{"id":"char_2012_typhon","name":"提丰"},{"id":"char_2013_cerber","name":"刻俄柏"},{"id":"char_2014_nian","name":"年"},{"id":"char_2015_dusk","name":"夕"},{"id":"char_201_moeshd","name":"可颂"},{"id":"char_2023_ling","name":"令"},{"id":"char_2024_chyue","name":"重岳"},{"id":"char_2025_shu","name":"黍"},{"id":"char_2026_yu","name":"余"},{"id":"char_202_demkni","name":"塞雷娅"},{"id":"char_204_platnm","name":"白金"},{"id":"char_206_gnosis","name":"灵知"},{"id":"char_208_melan","name":"玫兰莎"},{"id":"char_209_ardign","name":"卡缇"},{"id":"char_210_stward","name":"史都华德"},{"id":"char_211_adnach","name":"安德切尔"},{"id":"char_212_ansel","name":"安赛尔"},{"id":"char_213_mostma","name":"莫斯提马"},{"id":"char_214_kafka","name":"卡夫卡"},{"id":"char_215_mantic","name":"狮蝎"},{"id":"char_218_cuttle","name":"安哲拉"},{"id":"char_219_meteo","name":"陨星"},{"id":"char_220_grani","name":"格拉尼"},{"id":"char_222_bpipe","name":"风笛"},{"id":"char_225_haak","name":"阿"},{"id":"char_226_hmau","name":"吽"},{"id":"char_230_savage","name":"暴行"},{"id":"char_235_jesica","name":"杰西卡"},{"id":"char_236_rope","name":"暗索"},{"id":"char_237_gravel","name":"砾"},{"id":"char_240_wyvern","name":"香草"},{"id":"char_241_panda","name":"食铁兽"},{"id":"char_242_otter","name":"梅尔"},{"id":"char_243_waaifu","name":"槐琥"},{"id":"char_245_cello","name":"塑心"},{"id":"char_248_mgllan","name":"麦哲伦"},{"id":"char_249_mlyss","name":"缪尔赛思"},{"id":"char_250_phatom","name":"傀影"},{"id":"char_252_bibeak","name":"柏喙"},{"id":"char_253_greyy","name":"格雷伊"},{"id":"char_254_vodfox","name":"巫恋"},{"id":"char_258_podego","name":"波登可"},{"id":"char_260_durnar","name":"坚雷"},{"id":"char_261_sddrag","name":"苇草"},{"id":"char_263_skadi","name":"斯卡蒂"},{"id":"char_264_f12yin","name":"山"},{"id":"char_265_sophia","name":"鞭刃"},{"id":"char_271_spikes","name":"芳汀"},{"id":"char_272_strong","name":"孑"},{"id":"char_274_astesi","name":"星极"},{"id":"char_275_breeze","name":"微风"},{"id":"char_277_sqrrel","name":"阿消"},{"id":"char_278_orchid","name":"梓兰"},{"id":"char_279_excu","name":"送葬人"},{"id":"char_281_popka","name":"泡普卡"},{"id":"char_282_catap","name":"空爆"},{"id":"char_283_midn","name":"月见夜"},{"id":"char_284_spot","name":"斑点"},{"id":"char_285_medic2","name":"Lancet-2"},{"id":"char_286_cast3","name":"Castle-3"},{"id":"char_289_gyuki","name":"缠丸"},{"id":"char_290_vigna","name":"红豆"},{"id":"char_291_aglina","name":"安洁莉娜"},{"id":"char_293_thorns","name":"棘刺"},{"id":"char_294_ayer","name":"断崖"},{"id":"char_297_hamoni","name":"和弦"},{"id":"char_298_susuro","name":"苏苏洛"},{"id":"char_300_phenxi","name":"菲亚梅塔"},{"id":"char_301_cutter","name":"刻刀"},{"id":"char_302_glaze","name":"安比尔"},{"id":"char_304_zebra","name":"暴雨"},{"id":"char_306_leizi","name":"惊蛰"},{"id":"char_308_swire","name":"诗怀雅"},{"id":"char_311_mudrok","name":"泥岩"},{"id":"char_322_lmlee","name":"老鲤"},{"id":"char_325_bison","name":"拜松"},{"id":"char_326_glacus","name":"格劳克斯"},{"id":"char_328_cammou","name":"卡达"},{"id":"char_332_archet","name":"空弦"},{"id":"char_333_sidero","name":"铸铁"},{"id":"char_336_folivo","name":"稀音"},{"id":"char_337_utage","name":"宴"},{"id":"char_338_iris","name":"爱丽丝"},{"id":"char_340_shwaz","name":"黑"},{"id":"char_341_sntlla","name":"寒檀"},{"id":"char_343_tknogi","name":"月禾"},{"id":"char_344_beewax","name":"蜜蜡"},{"id":"char_345_folnic","name":"亚叶"},{"id":"char_346_aosta","name":"奥斯塔"},{"id":"char_347_jaksel","name":"杰克"},{"id":"char_348_ceylon","name":"锡兰"},{"id":"char_349_chiave","name":"贾维"},{"id":"char_350_surtr","name":"史尔特尔"},{"id":"char_355_ethan","name":"伊桑"},{"id":"char_356_broca","name":"布洛卡"},{"id":"char_358_lisa","name":"铃兰"},{"id":"char_362_saga","name":"嵯峨"},{"id":"char_363_toddi","name":"熔泉"},{"id":"char_365_aprl","name":"四月"},{"id":"char_366_acdrop","name":"酸糖"},{"id":"char_367_swllow","name":"灰喉"},{"id":"char_369_bena","name":"贝娜"},{"id":"char_373_lionhd","name":"莱恩哈特"},{"id":"char_376_therex","name":"THRM-EX"},{"id":"char_377_gdglow","name":"澄闪"},{"id":"char_378_asbest","name":"石棉"},{"id":"char_379_sesa","name":"慑砂"},{"id":"char_381_bubble","name":"泡泡"},{"id":"char_383_snsant","name":"雪雉"},{"id":"char_385_finlpp","name":"清流"},{"id":"char_388_mint","name":"薄绿"},{"id":"char_391_rosmon","name":"迷迭香"},{"id":"char_394_hadiya","name":"哈蒂娅"},{"id":"char_4000_jnight","name":"正义骑士号"},{"id":"char_4004_pudd","name":"布丁"},{"id":"char_4006_melnte","name":"玫拉"},{"id":"char_4009_irene","name":"艾丽妮"},{"id":"char_400_weedy","name":"温蒂"},{"id":"char_4010_etlchi","name":"隐德来希"},{"id":"char_4011_lessng","name":"止颂"},{"id":"char_4013_kjera","name":"耶拉"},{"id":"char_4014_lunacu","name":"子月"},{"id":"char_4015_spuria","name":"空构"},{"id":"char_4016_kazema","name":"风丸"},{"id":"char_4017_puzzle","name":"谜图"},{"id":"char_4019_ncdeer","name":"九色鹿"},{"id":"char_401_elysm","name":"极境"},{"id":"char_4023_rfalcn","name":"红隼"},{"id":"char_4025_aprot2","name":"暮落"},{"id":"char_4026_vulpis","name":"忍冬"},{"id":"char_4027_heyak","name":"霍尔海雅"},{"id":"char_402_tuye","name":"图耶"},{"id":"char_4032_provs","name":"但书"},{"id":"char_4036_forcer","name":"见行者"},{"id":"char_4039_horn","name":"号角"},{"id":"char_4040_rockr","name":"洛洛"},{"id":"char_4041_chnut","name":"褐果"},{"id":"char_4042_lumen","name":"流明"},{"id":"char_4043_erato","name":"埃拉托"},{"id":"char_4045_heidi","name":"海蒂"},{"id":"char_4046_ebnhlz","name":"黑键"},{"id":"char_4047_pianst","name":"车尔尼"},{"id":"char_4048_doroth","name":"多萝西"},{"id":"char_4051_akkord","name":"协律"},{"id":"char_4052_surfer","name":"寻澜"},{"id":"char_4054_malist","name":"至简"},{"id":"char_4055_bgsnow","name":"鸿雪"},{"id":"char_4058_pepe","name":"佩佩"},{"id":"char_405_absin","name":"苦艾"},{"id":"char_4062_totter","name":"铅踝"},{"id":"char_4063_quartz","name":"石英"},{"id":"char_4064_mlynar","name":"玛恩纳"},{"id":"char_4065_judge","name":"斥罪"},{"id":"char_4066_highmo","name":"海沫"},{"id":"char_4067_lolxh","name":"罗小黑"},{"id":"char_4071_peper","name":"明椒"},{"id":"char_4072_ironmn","name":"白铁"},{"id":"char_4077_palico","name":"泰拉大陆调查团"},{"id":"char_4078_bdhkgt","name":"截云"},{"id":"char_4079_haini","name":"海霓"},{"id":"char_4080_lin","name":"林"},{"id":"char_4081_warmy","name":"温米"},{"id":"char_4082_qiubai","name":"仇白"},{"id":"char_4083_chimes","name":"铎铃"},{"id":"char_4087_ines","name":"伊内丝"},{"id":"char_4088_hodrer","name":"赫德雷"},{"id":"char_4091_ulika","name":"U-Official"},{"id":"char_4093_frston","name":"Friston-3"},{"id":"char_4098_vvana","name":"薇薇安娜"},{"id":"char_4100_caper","name":"跃跃"},{"id":"char_4102_threye","name":"凛视"},{"id":"char_4104_coldst","name":"冰酿"},{"id":"char_4105_almond","name":"杏仁"},{"id":"char_4106_bryota","name":"苍苔"},{"id":"char_4107_vrdant","name":"维荻"},{"id":"char_4109_baslin","name":"深律"},{"id":"char_4110_delphn","name":"戴菲恩"},{"id":"char_4114_harold","name":"哈洛德"},{"id":"char_4116_blkkgt","name":"锏"},{"id":"char_4117_ray","name":"莱伊"},{"id":"char_4119_wanqin","name":"万顷"},{"id":"char_411_tomimi","name":"特米米"},{"id":"char_4121_zuole","name":"左乐"},{"id":"char_4122_grabds","name":"小满"},{"id":"char_4123_ela","name":"艾拉"},{"id":"char_4124_iana","name":"双月"},{"id":"char_4125_rdoc","name":"医生"},{"id":"char_4126_fuze","name":"导火索"},{"id":"char_4130_luton","name":"露托"},{"id":"char_4131_odda","name":"奥达"},{"id":"char_4132_ascln","name":"阿斯卡纶"},{"id":"char_4133_logos","name":"逻各斯"},{"id":"char_4134_cetsyr","name":"魔王"},{"id":"char_4136_phonor","name":"PhonoR-0"},{"id":"char_4137_udflow","name":"深巡"},{"id":"char_4138_narant","name":"娜仁图亚"},{"id":"char_4139_papyrs","name":"莎草"},{"id":"char_4140_lasher","name":"衡沙"},{"id":"char_4141_marcil","name":"玛露西尔"},{"id":"char_4142_laios","name":"莱欧斯"},{"id":"char_4143_sensi","name":"森西"},{"id":"char_4144_chilc","name":"齐尔查克"},{"id":"char_4145_ulpia","name":"乌尔比安"},{"id":"char_4146_nymph","name":"妮芙"},{"id":"char_4147_mitm","name":"渡桥"},{"id":"char_4148_philae","name":"菲莱"},{"id":"char_4151_tinman","name":"锡人"},{"id":"char_4155_talr","name":"裁度"},{"id":"char_415_flint","name":"燧石"},{"id":"char_4162_cathy","name":"凯瑟琳"},{"id":"char_4163_rosesa","name":"瑰盐"},{"id":"char_4164_tecno","name":"特克诺"},{"id":"char_4165_ctrail","name":"云迹"},{"id":"char_416_zumama","name":"森蚺"},{"id":"char_4171_wulfen","name":"钼铅"},{"id":"char_4172_xingzh","name":"行箸"},{"id":"char_4173_nowell","name":"诺威尔"},{"id":"char_4177_brigid","name":"水灯心"},{"id":"char_4178_alanna","name":"阿兰娜"},{"id":"char_4179_monstr","name":"Mon3tr"},{"id":"char_4182_oblvns","name":"丰川祥子"},{"id":"char_4183_mortis","name":"若叶睦"},{"id":"char_4184_dolris","name":"三角初华"},{"id":"char_4185_amoris","name":"祐天寺若麦"},{"id":"char_4186_tmoris","name":"八幡海铃"},{"id":"char_4187_graceb","name":"聆音"},{"id":"char_4188_confes","name":"CONFESS-47"},{"id":"char_4191_tippi","name":"蒂比"},{"id":"char_4193_lemuen","name":"蕾缪安"},{"id":"char_4194_rmixer","name":"信仰搅拌机"},{"id":"char_4195_radian","name":"电弧"},{"id":"char_4196_reckpr","name":"录武官"},{"id":"char_4198_christ","name":"Miss.Christine"},{"id":"char_4199_makiri","name":"松桐"},{"id":"char_4202_haruka","name":"遥"},{"id":"char_4203_kichi","name":"吉星"},{"id":"char_4204_mantra","name":"真言"},{"id":"char_4207_branch","name":"折桠"},{"id":"char_4208_wintim","name":"冬时"},{"id":"char_420_flamtl","name":"焰尾"},{"id":"char_4211_snhunt","name":"雪猎"},{"id":"char_421_crow","name":"羽毛笔"},{"id":"char_422_aurora","name":"极光"},{"id":"char_423_blemsh","name":"瑕光"},{"id":"char_426_billro","name":"卡涅利安"},{"id":"char_427_vigil","name":"伺夜"},{"id":"char_430_fartth","name":"远牙"},{"id":"char_431_ashlok","name":"灰毫"},{"id":"char_433_windft","name":"掠风"},{"id":"char_436_whispr","name":"絮雨"},{"id":"char_437_mizuki","name":"水月"},{"id":"char_440_pinecn","name":"松果"},{"id":"char_445_wscoot","name":"骋风"},{"id":"char_446_aroma","name":"阿罗玛"},{"id":"char_449_glider","name":"蜜莓"},{"id":"char_450_necras","name":"死芒"},{"id":"char_451_robin","name":"罗宾"},{"id":"char_452_bstalk","name":"豆苗"},{"id":"char_455_nothin","name":"乌有"},{"id":"char_456_ash","name":"灰烬"},{"id":"char_457_blitz","name":"闪击"},{"id":"char_458_rfrost","name":"霜华"},{"id":"char_459_tachak","name":"战车"},{"id":"char_464_cement","name":"洋灰"},{"id":"char_466_qanik","name":"雪绒"},{"id":"char_469_indigo","name":"深靛"},{"id":"char_472_pasngr","name":"异客"},{"id":"char_473_mberry","name":"桑葚"},{"id":"char_474_glady","name":"歌蕾蒂娅"},{"id":"char_475_akafyu","name":"赤冬"},{"id":"char_476_blkngt","name":"夜半"},{"id":"char_478_kirara","name":"绮良"},{"id":"char_479_sleach","name":"琴柳"},{"id":"char_484_robrta","name":"罗比菈塔"},{"id":"char_485_pallas","name":"帕拉斯"},{"id":"char_486_takila","name":"龙舌兰"},{"id":"char_487_bobb","name":"波卜"},{"id":"char_488_buildr","name":"青枳"},{"id":"char_489_serum","name":"蚀清"},{"id":"char_491_humus","name":"休谟斯"},{"id":"char_492_quercu","name":"夏栎"},{"id":"char_493_firwhl","name":"火哨"},{"id":"char_494_vendla","name":"刺玫"},{"id":"char_496_wildmn","name":"野鬃"},{"id":"char_497_ctable","name":"晓歌"},{"id":"char_498_inside","name":"隐现"},{"id":"char_499_kaitou","name":"折光"},{"id":"char_500_noirc","name":"黑角"},{"id":"char_501_durin","name":"杜林"},{"id":"char_502_nblade","name":"夜刀"},{"id":"char_503_rang","name":"巡林者"}
    ];

    // 生成 ID 映射表
    const OP_ID_MAP = {};
    if (typeof RAW_OPS !== 'undefined' && RAW_OPS.length > 0) {
        RAW_OPS.forEach(op => { OP_ID_MAP[op.name] = op.id; });
    }

    // [样式] CSS 样式定义
    // 适配 zoot.plus PR #512: 移除强制覆盖样式的部分，仅保留脚本功能特有的样式
    // 使用 body.dark 来适配网站原生深色模式
    const mergedStyles = `
    /* ==========================================================================
       [PRTS 业务模块] 专有组件样式
       ========================================================================== */
    
    /* 1. 描述容器 (Hover 展开) */
    .prts-desc-wrapper { position: relative; height: 24px; margin: 2px 0; width: 100%; z-index: 10; }
    .prts-desc-wrapper:hover { z-index: 100; }
    .prts-desc-content {
        width: 100%; height: 24px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        font-size: 13px; color: #6b7280; line-height: 24px; border-radius: 4px; background-color: transparent;
    }
    .prts-desc-wrapper:hover .prts-desc-content {
        position: absolute; top: -4px; left: -8px; width: calc(100% + 16px); height: auto;
        white-space: normal; overflow: visible; background-color: #ffffff; color: #374151;
        padding: 4px 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.2); border: 1px solid #e5e7eb;
    }
    
    /* 深色适配 */
    body.dark .prts-desc-content { color: #9ca3af; }
    body.dark .prts-desc-wrapper:hover .prts-desc-content {
        background-color: #232326; color: #e5e7eb; border-color: #3f3f46;
        box-shadow: 0 4px 16px rgba(0,0,0,0.6);
    }
    /* 高对比度适配 */
    body.high-contrast-theme .prts-desc-wrapper:hover .prts-desc-content {
        background-color: #18181c; border-color: #38383b;
    }

    /* 2. 视频链接 */
    .prts-video-box { margin-top: 2px; margin-bottom: 6px; display: flex; align-items: center; position: relative; z-index: 1; }
    .prts-bili-link {
        display: inline-flex !important; align-items: center; color: #94a3b8 !important;
        font-size: 12px !important; font-weight: normal !important; text-decoration: none !important;
        padding: 2px 0; background: transparent !important; border: none !important; transition: color 0.2s; cursor: pointer;
    }
    .prts-bili-link:hover { color: #fb7299 !important; text-decoration: underline !important; }
    
    body.dark .prts-bili-link { color: #52525b !important; }
    body.dark .prts-bili-link:hover { color: #fb7299 !important; }
    .prts-bili-link .bp4-icon { margin-right: 4px; font-size: 11px; }

    /* 3. 筛选栏与按钮 */
    #prts-filter-bar { display: flex; align-items: center; flex-wrap: wrap; width: 100%; margin-top: 8px; margin-bottom: 12px; padding-left: 2px; }
    .prts-btn {
        background: none !important; background-color: transparent !important; border: none !important;
        box-shadow: none !important; cursor: pointer !important; display: inline-flex !important;
        align-items: center !important; justify-content: center !important; padding: 6px 12px !important;
        font-size: 14px !important; color: #5c7080 !important; border-radius: 3px !important;
        min-height: 30px !important; line-height: 1 !important; font-weight: normal !important;
        margin-right: 4px !important; transition: background-color 0.1s cubic-bezier(0.4, 1, 0.75, 0.9) !important;
    }
    .prts-btn:hover { background-color: rgba(167, 182, 194, 0.3) !important; color: #1c2127 !important; text-decoration: none !important; }
    .prts-btn.prts-active { background-color: rgba(167, 182, 194, 0.3) !important; color: #2563eb !important; font-weight: 600 !important; }
    .prts-btn .bp4-icon { margin-right: 7px !important; color: #5c7080 !important; fill: currentColor !important; }
    .prts-btn.prts-active .bp4-icon { color: #2563eb !important; }

    body.dark .prts-btn { color: #a7b6c2 !important; }
    body.dark .prts-btn:hover, body.dark .prts-btn.prts-active {
        background-color: rgba(138, 155, 168, 0.15) !important; color: #f5f8fa !important;
    }
    body.dark .prts-btn.prts-active { color: #60a5fa !important; }
    body.dark .prts-btn .bp4-icon { color: #a7b6c2 !important; }
    body.dark .prts-btn.prts-active .bp4-icon { color: #60a5fa !important; }

    .prts-divider { width: 1px; height: 16px; background-color: rgba(16, 22, 26, 0.15); margin: 0 8px; display: inline-block; }
    body.dark .prts-divider { background-color: rgba(255, 255, 255, 0.15); }

    /* 4. 状态标签与卡片置灰 */
    .prts-status-label {
        margin-top: 12px !important; padding-top: 8px !important; border-top: 1px dashed #e5e7eb !important;
        font-size: 13px !important; font-weight: 700 !important; display: flex !important; align-items: center !important; line-height: 1.5 !important;
    }
    body.dark .prts-status-label { border-top-color: #444 !important; }
    /* 红色警告 (缺人/不可用) - 对应 Tailwind text-red-600 / dark:text-red-500 */
    .prts-label-missing { color: #dc2626 !important; } 
    body.dark .prts-label-missing { color: #ef4444 !important; } 
    
    /* 琥珀色警告 (需助战) - 对应 Tailwind text-amber-600 / dark:text-amber-500 */
    .prts-label-support { color: #d97706 !important; }
    body.dark .prts-label-support { color: #f59e0b !important; }
    
    .prts-card-gray .bp4-card {
        opacity: 0.4 !important; filter: grayscale(0.9) !important; transition: opacity 0.2s ease, filter 0.2s ease !important; background-color: #f3f4f6 !important;
    }
    body.dark .prts-card-gray .bp4-card { background-color: #1a1a1a !important; }
    .prts-card-gray:hover .bp4-card { opacity: 0.95 !important; filter: grayscale(0) !important; }

    /* 5. 干员显示 (Grid, Items, Avatar, Badges) */
    .prts-op-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; margin-bottom: 8px; align-items: center; }
    .prts-op-grid .bp4-popover2-target { display: inline-flex !important; margin: 0 !important; padding: 0 !important; vertical-align: top !important; height: 42px !important; }

    /* Avatar 适配: 稀有度边框与背景 */
    /* 6星 */
    body.dark .bg-orange-200.ring-orange-300 {
        background-color: rgba(234, 88, 12, 0.2) !important;     /* orange-600 / 0.2 */
        --tw-ring-color: rgba(249, 115, 22, 0.6) !important;      /* orange-500 / 0.6 */
        box-shadow: inset 0 0 0 2px var(--tw-ring-color) !important;
    }
    /* 5星 */
    body.dark .bg-yellow-100.ring-yellow-200 {
        background-color: rgba(234, 179, 8, 0.2) !important;      /* yellow-500 / 0.2 */
        --tw-ring-color: rgba(234, 179, 8, 0.6) !important;       /* yellow-500 / 0.6 */
        box-shadow: inset 0 0 0 2px var(--tw-ring-color) !important;
    }
    /* 4星 */
    body.dark .bg-purple-100.ring-purple-200 {
        background-color: rgba(147, 51, 234, 0.2) !important;     /* purple-600 / 0.2 */
        --tw-ring-color: rgba(168, 85, 247, 0.6) !important;      /* purple-500 / 0.6 */
        box-shadow: inset 0 0 0 2px var(--tw-ring-color) !important;
    }
    /* 低星 */
    body.dark .bg-slate-100.ring-slate-200 {
        background-color: #2d2d30 !important;
        --tw-ring-color: #3f3f46 !important;                      /* zinc-700 */
        box-shadow: inset 0 0 0 2px #3f3f46 !important;
        color: #52525b !important;                                /* zinc-600 */
    }
    /* 头像中的默认文字颜色 */
    body.dark .text-slate-300 { color: #52525b !important; }      /* zinc-600 */
    
    .prts-op-item, .prts-op-text {
        position: relative; width: 42px; height: 42px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        transition: transform 0.2s, box-shadow 0.2s; box-sizing: border-box;
    }
    .prts-op-item:hover, .prts-op-text:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.2); z-index: 50; }
    
    .prts-op-item { background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    body.dark .prts-op-item { background-color: #1f2937; border-color: #374151; }
    .prts-op-item:hover { border-color: #3b82f6; }
    body.dark .prts-op-item:hover { border-color: #60a5fa; }
    
    .prts-op-img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 3px; }
    
    .prts-op-text {
        display: flex; align-items: center; justify-content: center; background-color: #f1f5f9; color: #475569;
        border: 1px dashed #94a3b8; border-radius: 4px; font-size: 12px; font-weight: bold; text-align: center;
        line-height: 1.1; padding: 2px; word-break: break-all;
    }
    .prts-op-text:hover { border-style: solid; border-color: #3b82f6; background-color: #fff; }
    body.dark .prts-op-text { background-color: #27272a; color: #d1d5db; border-color: #52525b; }
    body.dark .prts-op-text:hover { background-color: #27272a; border-color: #60a5fa; }

    /* 关卡徽章 */
    .prts-level-badge {
        display: inline-flex; align-items: center; justify-content: center; background-color: #3b82f6;
        color: #ffffff !important; padding: 2px 8px; border-radius: 4px; font-family: ui-monospace, SFMono-Regular, monospace;
        font-weight: 700; font-size: 0.95em; margin-right: 8px; border: 1px solid #2563eb; vertical-align: middle;
        line-height: 1.2; flex-shrink: 0; box-shadow: 0 1px 2px rgba(37, 99, 235, 0.2);
    }
    body.dark .prts-level-badge {
        background-color: #1e3a8a; border-color: #1e40af; color: #e0e7ff !important; box-shadow: none;
    }

    /* 技能角标与 Grid Popover */
    .prts-popover-grid { display: flex; flex-wrap: wrap; gap: 6px; max-width: 320px; padding: 4px; }
    .prts-popover-item {
        position: relative; width: 48px; height: 48px; background-color: #1f2937;
        border: 1px solid #e5e7eb; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    body.dark .prts-popover-item { border-color: #4b5563; }
    .prts-popover-img { width: 100%; height: 100%; object-fit: cover; border-radius: 3px; }

    .prts-op-skill, .prts-popover-skill {
        position: absolute; bottom: 0; right: 0; z-index: 10; font-size: 11px !important; font-weight: 800 !important;
        font-family: ui-monospace, SFMono-Regular, Consolas, monospace; line-height: 1.1; text-align: center;
        padding: 1px 4px; min-width: 14px; border-top-left-radius: 4px; 
        background-color: #18181b !important; color: #f3f4f6 !important;
        border-top: 1px solid rgba(255, 255, 255, 0.3); border-left: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5); pointer-events: none;
    }
    /* 浅色模式下的 Popover 技能角标样式修正 */
    .bp4-popover2-content .prts-popover-skill {
        background-color: #ffffff !important; color: #000000 !important; border: 1px solid #e5e7eb;
    }
    /* 深色模式强制覆盖 */
    body.dark .bp4-popover2-content .prts-popover-skill, 
    body.dark .prts-popover-skill {
        background-color: #18181b !important; color: #f3f4f6 !important; border-color: rgba(255, 255, 255, 0.3) !important;
    }

    /* 6. 模拟 Tooltip */
    [data-prts-tooltip]:hover::after {
        content: attr(data-prts-tooltip); position: absolute; bottom: 115%; left: 50%; transform: translateX(-50%);
        background-color: #30404d; color: #f5f8fa; padding: 5px 8px; font-size: 12px; border-radius: 3px;
        white-space: nowrap; pointer-events: none; box-shadow: 0 0 0 1px rgba(16,22,26,.1), 0 2px 4px rgba(16,22,26,.2), 0 8px 24px rgba(16,22,26,.2); z-index: 100;
    }
    [data-prts-tooltip]:hover::before {
        content: ""; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
        border-width: 5px; border-style: solid; border-color: #30404d transparent transparent transparent; z-index: 100;
    }
    body.dark [data-prts-tooltip]:hover::after { background-color: #202b33; }
    body.dark [data-prts-tooltip]:hover::before { border-color: #202b33 transparent transparent transparent; }

    /* 7. 侧边栏与公告 */
    .prts-sidebar-collapsed { max-height: 48px !important; overflow: hidden !important; cursor: pointer !important; opacity: 0.9; }
    .prts-sidebar-header-icon { display: flex; align-items: center; justify-content: space-between; }
    .prts-sidebar-header-icon::after { content: "▼"; font-size: 0.8em; color: #9ca3af; transition: transform 0.3s; }
    .prts-sidebar-expanded .prts-sidebar-header-icon::after { transform: rotate(180deg); }
    
    .prts-notice-btn {
        cursor: pointer !important; border-left: 4px solid #3b82f6 !important;
        transition: transform 0.2s, box-shadow 0.2s !important; display: flex !important;
        flex-direction: column !important; justify-content: center !important; min-height: 48px !important; padding: 0 16px !important;
    }
    .prts-notice-btn:hover { transform: translateX(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important; }
    .prts-notice-btn > div:not(.bp4-heading), .prts-notice-btn ul { display: none !important; }
    .prts-notice-btn h4.bp4-heading {
        display: flex !important; align-items: center !important; margin: 0 !important;
        width: 100% !important; opacity: 1 !important; visibility: visible !important; color: #1f2937 !important;
    }
    body.dark .prts-notice-btn h4.bp4-heading { color: #f3f4f6 !important; }
    
    .prts-dialog-tag { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 14px; font-weight: bold; margin-right: 8px; color: #fff; vertical-align: middle; }
    .prts-tag-update { background-color: #10b981; } .prts-tag-fix { background-color: #f59e0b; }
    .prts-tag-event { background-color: #3b82f6; } .prts-tag-note { background-color: #64748b; }

    /* 8. 悬浮球 & 控制面板 */
    #prts-float-container {
        position: fixed; z-index: 9999; display: flex; align-items: center; opacity: 0.6; user-select: none;
        transition: opacity 0.3s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }
    #prts-float-container:hover, #prts-float-container.prts-float-open { opacity: 1; }
    #prts-float-container.is-dragging { opacity: 1; transition: none !important; }
    #prts-float-container.is-snapping { transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
    #prts-float-container.snap-right:not(:hover):not(.prts-float-open):not(.is-dragging) { transform: translateX(calc(100% - 12px)); }
    #prts-float-container.snap-left:not(:hover):not(.prts-float-open):not(.is-dragging) { transform: translateX(calc(-100% + 12px)); }
    
    .prts-float-btn {
        width: 48px; height: 48px; background-color: #fff; border: 1px solid #e5e7eb; border-right: none;
        border-radius: 8px 0 0 8px; box-shadow: -2px 2px 8px rgba(0,0,0,0.1); cursor: pointer; display: flex;
        align-items: center; justify-content: center; color: #374151; transition: all 0.3s; position: relative; z-index: 2;
    }
    .prts-float-btn svg { width: 24px; height: 24px; fill: currentColor; }
    #prts-float-container.snap-left .prts-float-btn { border-radius: 0 8px 8px 0; border-right: 1px solid #e5e7eb; border-left: none; box-shadow: 2px 2px 8px rgba(0,0,0,0.1); }
    
    body.dark .prts-float-btn { background-color: #232326; border-color: #3f3f46; color: #e5e7eb; box-shadow: -2px 2px 12px rgba(0,0,0,0.5); }
    
    .prts-settings-panel {
        position: absolute; top: 0; width: 260px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;
        padding: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 1; visibility: hidden; opacity: 0; pointer-events: none;
        transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); right: 55px; left: auto; transform: translateX(20px) scale(0.95); transform-origin: top right;
    }
    #prts-float-container.snap-left .prts-settings-panel { left: 55px; right: auto; transform: translateX(-20px) scale(0.95); transform-origin: top left; }
    #prts-float-container.prts-float-open .prts-settings-panel { visibility: visible; opacity: 1; transform: translateX(0) scale(1); pointer-events: auto; }
    
    body.dark .prts-settings-panel { background: #18181c; border-color: #3f3f46; box-shadow: 0 4px 20px rgba(0,0,0,0.6); }
    /* 高对比度模式下保持一致的深色背景 */
    body.high-contrast-theme .prts-settings-panel { background: #18181c; }
    
    .prts-panel-title { font-size: 14px; font-weight: bold; margin-bottom: 12px; color: #1f2937; display: flex; align-items: center; padding-bottom: 8px; border-bottom: 1px solid #f3f4f6; }
    body.dark .prts-panel-title { color: #f3f4f6; border-color: #3f3f46; }
    .prts-panel-item { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; font-size: 13px; color: #4b5563; }
    body.dark .prts-panel-item { color: #d1d5db; }
    
    .prts-switch { position: relative; display: inline-block; width: 36px; height: 20px; }
    .prts-switch input { opacity: 0; width: 0; height: 0; }
    .prts-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
    .prts-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .prts-slider { background-color: #3b82f6; }
    input:checked + .prts-slider:before { transform: translateX(16px); }
    body.dark .prts-slider { background-color: #4b5563; }
    body.dark input:checked + .prts-slider { background-color: #2563eb; }
`;

    GM_addStyle(mergedStyles);

    // =========================================================================
    //                            MODULE 3: 工具函数
    // =========================================================================

    /**
     * [工具] XPath 元素查找
     */
    function getElementByXPath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // =========================================================================
    //                            MODULE 4: 业务逻辑 - 筛选与净化
    // =========================================================================

    /**
     * [工具] 判断当前页面是否禁用筛选功能
     */
    function isFilterDisabledPage() {
        const path = window.location.pathname;
        return path.startsWith('/create') || path.startsWith('/editor');
    }

    /**
     * [V10.0 数据管理] 加载用户持有干员
     */
    function loadOwnedOps() {
        const storedData = GM_getValue(OPS_STORAGE_KEY, '[]');
        try {
            const ops = JSON.parse(storedData);
            ownedOpsSet = new Set();

            if (Array.isArray(ops)) {
                // 情况A: 纯字符串数组 (新版逻辑) ["A", "B"]
                if (ops.length === 0 || typeof ops[0] === 'string') {
                    ops.forEach(op => ownedOpsSet.add(op));
                }
                // 情况B: 对象数组 (旧版/Maa格式) [{"name":"A", "own":true}]
                else {
                    ops.forEach(op => {
                        if (op.own !== false && op.name) {
                            ownedOpsSet.add(op.name);
                        }
                    });
                }
            }
            console.log(`[Better PRTS] 已加载 ${ownedOpsSet.size} 名持有干员`);
        } catch (e) {
            console.error('[Better PRTS] 数据解析失败', e);
            ownedOpsSet = new Set(); // 出错重置
        }
    }

    /**
     * [V10.1 交互] 更新导入按钮文本 (UI Sync)
     */
    function updateImportButtonUI() {
        const btn = document.getElementById('btn-import');
        if (!btn) return;

        const count = ownedOpsSet.size;
        const textSpan = btn.querySelector('.bp4-button-text');
        if (textSpan) {
            textSpan.innerText = count > 0 ? `导入干员 (${count})` : '导入干员';
        }
    }

    /**
     * [V10.0 数据管理] 导入干员数据
     */
    function handleImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json, .txt';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 2 * 1024 * 1024) {
                alert('❌ 文件过大，请上传标准格式的干员数据文件');
                return;
            }

            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const jsonStr = event.target.result;
                    let json;
                    try {
                        json = JSON.parse(jsonStr);
                    } catch (e) {
                        alert('❌ 文件格式错误：不是有效的 JSON 文件');
                        return;
                    }

                    if (!Array.isArray(json)) throw new Error("数据格式非数组");

                    let names = [];
                    // 逻辑复刻：支持纯字符串数组或 Maa 导出格式对象
                    if (json.length === 0) {
                         names = [];
                    } else if (typeof json[0] === 'string') {
                        names = json;
                    } else if (typeof json[0] === 'object' && json[0] !== null && 'name' in json[0]) {
                        names = json
                            .filter(op => op?.own !== false && typeof op?.name === 'string')
                            .map(op => String(op.name).trim())
                            .filter(name => /^[a-zA-Z0-9\u4e00-\u9fa5\-\(\)\uff08\uff09]+$/.test(name));
                    }

                    if (names.length > 0) {
                        const uniqueNames = Array.from(new Set(names));

                        // 1. 持久化存储
                        GM_setValue(OPS_STORAGE_KEY, JSON.stringify(uniqueNames));

                        // 2. 更新内存状态
                        ownedOpsSet = new Set(uniqueNames);

                        // 3. [关键修复] 立即调用主渲染函数刷新按钮文字，无需等待定时器
                        injectFilterControls();

                        alert(`✅ 导入成功！\n共识别 ${uniqueNames.length} 名持有干员。`);
                        if (currentFilterMode !== 'NONE') requestFilterUpdate();
                    } else {
                        alert('⚠️ 未能识别有效的干员数据，请检查文件格式');
                    }
                } catch (err) {
                    console.error(err);
                    alert('❌ 导入过程中发生未知错误: ' + err.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    /**
     * [V10.2 交互] 切换显示模式（置灰/隐藏）
     */
    function toggleDisplayMode() {
        displayMode = (displayMode === 'GRAY') ? 'HIDE' : 'GRAY';
        GM_setValue(DISPLAY_MODE_KEY, displayMode);

        const bar = document.getElementById('prts-filter-bar');
        if (bar) bar.remove();
        injectFilterControls(); // 重建UI以更新图标状态

        requestFilterUpdate();
    }

    /**
     * [V10.0 筛选核心] 切换筛选模式（完美/助战）
     */
    function toggleFilter(mode) {
        if (ownedOpsSet.size === 0) {
            alert('请先导入干员数据！');
            return;
        }
        currentFilterMode = (currentFilterMode === mode) ? 'NONE' : mode;
        updateFilterButtonStyles();
        requestFilterUpdate();
    }

    /**
     * [V10.2 交互] 更新筛选按钮激活状态
     */
    function updateFilterButtonStyles() {
        const perfectBtn = document.getElementById('btn-perfect');
        const supportBtn = document.getElementById('btn-support');
        if (!perfectBtn || !supportBtn) return;

        perfectBtn.classList.remove('prts-active');
        supportBtn.classList.remove('prts-active');

        if (currentFilterMode === 'PERFECT') perfectBtn.classList.add('prts-active');
        else if (currentFilterMode === 'SUPPORT') supportBtn.classList.add('prts-active');
    }

    /**
     * [V10.3 UI组件] 注入筛选控制栏与 Blueprint 图标
     */
    function injectFilterControls() {
        if (isFilterDisabledPage()) {
            const existing = document.getElementById('prts-filter-bar');
            if (existing) existing.remove();
            return;
        }

        const searchInputGroup = document.querySelector('.bp4-input-group');
        if (!searchInputGroup) return;
        const searchRow = searchInputGroup.parentElement;
        if (!searchRow) return;

        // 1. 确保容器存在
        let controlBar = document.getElementById('prts-filter-bar');
        let isNew = false;
        if (!controlBar) {
            isNew = true;
            controlBar = document.createElement('div');
            controlBar.id = 'prts-filter-bar';
        }

        // 确保容器在正确的位置
        if (searchRow.nextSibling !== controlBar) {
            searchRow.parentNode.insertBefore(controlBar, searchRow.nextSibling);
        }

        // 2. 图标路径 (BlueprintJS 16x16 Standard Paths)
        const paths = {
            // Icon: import (PR: import) - 修正为 16px 适配路径
            import: 'M11 6h3l-6 6-6-6h3V1h6v5zm-7 8v2h12v-2h-2v1H6v-1H4z',
            // Icon: eye-open (PR: eye-open)
            eyeOn: 'M8 3C3 3 0 8 0 8s3 5 8 5 8-5 8-5-3-5-8-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z M8 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
            // Icon: eye-off (PR: eye-off)
            eyeOff: 'M6.41 7.83c-.03.39.07.79.31 1.12.24.34.59.58.98.68.39.1.81.02 1.15-.21.34-.23.59-.57.7-.96.1-.39.02-.8-.21-1.15-.16-.23-.38-.42-.64-.53L6.41 7.83z M2.05 2.64L1.03 3.66l2.54 2.54C2.22 6.75 1.12 7.34 0 8c0 0 4 5.6 8 5.6 1.41 0 2.71-.35 3.85-.96l2.08 2.09 1.02-1.02L2.05 2.64z M8 12c-2.21 0-4-1.79-4-4 0-.2.02-.39.05-.58l5.04 5.04c-1.24.74-3.46.59-1.09-.46z M13.57 11.6c.54-1.06.83-2.24.83-3.6 0 0-4-5.6-8-5.6-.69 0-1.34.09-1.98.25L6.07 4.3C6.68 4.1 7.33 4 8 4c2.21 0 4 1.79 4 4 0 .64-.14 1.24-.38 1.79l1.95 1.81z',
            // Icon: confirm (PR: confirm / 完美阵容)
            perfect: 'M13.76 3.84l-7.2 7.2L3.04 7.52 1.6 8.96l5.04 5.04 8.64-8.64z',
            // Icon: people (PR: people / 允许助战)
            support: 'M12 6.4c0-1.77-1.43-3.2-3.2-3.2S5.6 4.63 5.6 6.4s1.43 3.2 3.2 3.2 3.2-1.43 3.2-3.2zm-3.2 1.6c-.88 0-1.6-.72-1.6-1.6s.72-1.6 1.6-1.6 1.6.72 1.6 1.6-.72 1.6-1.6 1.6zm3.2-1.6c0-1.77-1.43-3.2-3.2-3.2-.45 0-.86.1-1.26.26.7.74 1.15 1.72 1.24 2.82.02.21.02.41 0 .62-.1 1.04-.51 1.98-1.16 2.71.37.13.75.19 1.18.19 1.77.01 3.2-1.42 3.2-3.4zM8.8 10.4H2.4c-.88 0-1.6.72-1.6 1.6v2.4h9.6V12c0-.88-.72-1.6-1.6-1.6zm-5.6 2.4h4.8v.8H3.2v-.8zm12-1.6h-4.8c.21 0 .4.03.59.07.67.15 1.29.44 1.81.85.91.71 1.5 1.81 1.57 3.04.01.1.01.18.03.28V12c0-.88-.72-1.6-1.6-1.6z'
        };

        // 3. 渲染辅助函数
        const renderButton = (id, text, svgPath, onClick, active = false, disabled = false) => {
            let btn = document.getElementById(id);
            // 统一使用 viewBox 0 0 16 16
            const innerHTML = `
                <span class="bp4-icon" aria-hidden="true" style="margin-right:6px">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="${svgPath}"></path></svg>
                </span>
                <span class="bp4-button-text">${text}</span>
            `;

            if (!btn) {
                btn = document.createElement('button');
                btn.type = "button";
                btn.className = 'prts-btn';
                btn.id = id;
                btn.onclick = onClick;
                // 不在此处 append，由下方统一排序
            }

            if (btn.innerHTML !== innerHTML) btn.innerHTML = innerHTML;

            if (active && !btn.classList.contains('prts-active')) btn.classList.add('prts-active');
            if (!active && btn.classList.contains('prts-active')) btn.classList.remove('prts-active');

            if (disabled) {
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            } else {
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
            return btn;
        };

        // 4. 按严格顺序构建/移动 DOM 节点

        // (1) 导入按钮
        const importText = ownedOpsSet.size > 0 ? `导入干员 (${ownedOpsSet.size})` : '导入干员';
        const btnImport = renderButton('btn-import', importText, paths.import, handleImport);
        controlBar.appendChild(btnImport);

        // (2) 模式切换
        const displayModeText = displayMode === 'GRAY' ? '置灰模式' : '隐藏模式';
        const displayModeIcon = displayMode === 'GRAY' ? paths.eyeOn : paths.eyeOff;
        const btnSetting = renderButton('btn-setting', displayModeText, displayModeIcon, toggleDisplayMode);
        controlBar.appendChild(btnSetting);

        // (3) 分割线
        let divider = document.getElementById('prts-divider-el');
        if (!divider) {
            divider = document.createElement('div');
            divider.className = 'prts-divider';
            divider.id = 'prts-divider-el';
        }
        controlBar.appendChild(divider);

        // (4) 完美阵容
        const btnPerfect = renderButton('btn-perfect', '完美阵容', paths.perfect, () => toggleFilter('PERFECT'), currentFilterMode === 'PERFECT');
        controlBar.appendChild(btnPerfect);

        // (5) 允许助战
        const btnSupport = renderButton('btn-support', '允许助战', paths.support, () => toggleFilter('SUPPORT'), currentFilterMode === 'SUPPORT');
        controlBar.appendChild(btnSupport);

        // 初始触发
        if (isNew && currentFilterMode !== 'NONE') {
            requestFilterUpdate();
        }
    }

    /**
     * [V8.0 内容清洗] B站链接净化与悬浮层重构
     * 提取描述中的链接转换为按钮，并优化多余空行
     */
    function cleanBilibiliLinks(cardInner) {
        if (!CONFIG.cleanLink) return;
        const descContainer = cardInner.querySelector('.grow.text-gray-700');
        if (!descContainer || descContainer.dataset.biliProcessed) return;

        let html = descContainer.innerHTML;
        let videoUrl = null;

        // 提取链接
        const regex = /((?:【.*?】\s*)?(https?:\/\/(?:www\.)?(?:bilibili\.com\/video\/|b23\.tv\/)[^\s<"']+))/gi;
        const match = regex.exec(html);

        if (match) {
            videoUrl = match[2];
            html = html.replace(match[1], '');
        }

        // 清洗末尾空行
        const trailingTrashRegex = /(?:<p>\s*(?:<br\s*\/?>)?\s*<\/p>|<br\s*\/?>|\s)+$/gi;
        html = html.replace(trailingTrashRegex, '');

        if (html.replace(/<[^>]+>/g, '').trim() === '') {
            html = '(无文字描述)';
        }

        // 重构为悬浮层结构
        descContainer.innerHTML = `<div class="prts-desc-content">${html}</div>`;
        descContainer.classList.add('prts-desc-wrapper');
        descContainer.classList.remove('grow');
        descContainer.style.width = '100%';

        // 插入视频按钮
        if (videoUrl) {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'prts-video-box';

            const linkBtn = document.createElement('a');
            linkBtn.href = videoUrl;
            linkBtn.target = "_blank";
            linkBtn.className = 'prts-bili-link';
            linkBtn.innerHTML = `<span class="bp4-icon bp4-icon-video"></span>参考视频`;
            linkBtn.onclick = (e) => e.stopPropagation();

            btnContainer.appendChild(linkBtn);
            if (descContainer.parentNode) {
                descContainer.parentNode.insertBefore(btnContainer, descContainer.nextSibling);
            }
        }

        descContainer.dataset.biliProcessed = "true";
    }

    function requestFilterUpdate() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(applyFilterLogic);
    }

    /**
     * [V6.0 视觉优化] 关卡徽章异步处理与干员头像化
     * 包含异步等待策略与独立状态锁
     */
    function optimizeCardVisuals(card, cardInner) {
        if (!CONFIG.visuals) return;

        const heading = cardInner.querySelector('h4, h5, .bp4-heading');
        const stageCodeSpan = cardInner.querySelector('.flex.whitespace-pre .inline-block.font-bold.my-auto');

        // 处理关卡代号徽章
        if (stageCodeSpan && heading && !heading.dataset.badgeProcessed) {
            const rawCode = stageCodeSpan.innerText.trim();
            // 判断是否为内部ID (如 act47side_07)，如果是则跳过等待下次渲染
            const isInternalId = rawCode.includes('_') || (rawCode.length > 5 && /^[a-z]/.test(rawCode));

            if (!isInternalId) {
                const titleTextNode = heading.querySelector('.whitespace-nowrap.overflow-hidden.text-ellipsis') || heading;
                let currentText = titleTextNode.innerText;

                const escapedCode = rawCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`^\\s*(\\[|【)?\\s*${escapedCode}\\s*(\\]|】)?\\s*([-|:：\\s]+)?`, 'i');

                if (regex.test(currentText)) {
                    titleTextNode.innerText = currentText.replace(regex, '');
                }

                const badge = document.createElement('span');
                badge.className = 'prts-level-badge';
                badge.innerText = rawCode;
                heading.insertBefore(badge, heading.firstChild);

                heading.dataset.badgeProcessed = "true";
            }
        }

        // 处理干员列表头像化
        const allDivs = Array.from(cardInner.querySelectorAll('div'));
        const labelDiv = allDivs.find(div => div.innerText.trim() === '干员/干员组');

        if (labelDiv && !labelDiv.dataset.opsProcessed) {
            const tagsContainer = labelDiv.nextElementSibling;
            if (tagsContainer) {
                const tags = tagsContainer.querySelectorAll('.bp4-tag');
                let grid = tagsContainer.querySelector('.prts-op-grid');
                if (!grid) {
                    grid = document.createElement('div');
                    grid.className = 'prts-op-grid';
                    tagsContainer.insertBefore(grid, tagsContainer.firstChild);
                }

                tags.forEach(tag => {
                    if (tag.dataset.opExtracted) return;

                    const rawText = tag.innerText.trim();
                    const cleanText = rawText.replace(/^\[|\]$/g, '');
                    const parts = cleanText.split(/\s+/);
                    const nameKey = parts[0];
                    const extraInfo = parts[1] || "";

                    let newItem = null;

                    if (OP_ID_MAP[nameKey]) {
                        // 图片头像
                        const opId = OP_ID_MAP[nameKey];
                        newItem = document.createElement('div');
                        newItem.className = 'prts-op-item';
                        const img = document.createElement('img');
                        img.src = `https://zoot.plus/assets/operator-avatars/webp96/${opId}.webp`;
                        img.className = 'prts-op-img';
                        img.loading = "lazy";
                        newItem.appendChild(img);
                    } else if (nameKey.length > 0) {
                        // 文字方块
                        newItem = document.createElement('div');
                        newItem.className = 'prts-op-text';
                        newItem.innerText = nameKey;
                    }

                    if (newItem && extraInfo) {
                        const badge = document.createElement('div');
                        badge.className = 'prts-op-skill';
                        badge.innerText = extraInfo;
                        newItem.appendChild(badge);
                    }

                    if (!newItem) return;

                    const interactiveWrapper = tag.closest('.bp4-popover2-target');
                    if (interactiveWrapper) {
                        grid.appendChild(interactiveWrapper);
                        interactiveWrapper.innerHTML = '';
                        interactiveWrapper.appendChild(newItem);
                    } else {
                        // 模拟 [V5.0 Tooltip]
                        const tooltipText = `${nameKey}${extraInfo ? ' ' + extraInfo : ''}`;
                        newItem.setAttribute('data-prts-tooltip', tooltipText);
                        grid.appendChild(newItem);
                        tag.style.display = 'none';
                    }

                    tag.dataset.opExtracted = "true";
                });
            }
        }
    }

    /**
     * [V11.2 弹窗优化] 适配单干员显示与列表解析
     * 解析悬浮弹窗中的文本，转换为网格化的干员头像
     */
    function enhancePopover(portalNode) {
        const content = portalNode.querySelector('.bp4-popover2-content');
        if (!content || content.dataset.optimized) return;

        const text = content.innerText.trim();
        const cleanText = text.replace(/^->\s*/, '');
        const firstWord = cleanText.split(/[\s,，]+/)[0];
        const isSingleOperator = OP_ID_MAP[firstWord];

        // 仅处理箭头格式、列表格式或有效的单干员名
        if (!text.startsWith('->') && !text.includes(',') && !isSingleOperator) return;

        const rawList = cleanText.split(/[,，]\s*/);
        const validOps = [];

        rawList.forEach(entry => {
            const parts = entry.trim().split(/\s+/);
            const name = parts[0];
            const skill = parts[1] || "";

            if (OP_ID_MAP[name]) {
                validOps.push({ name: name, id: OP_ID_MAP[name], skill: skill });
            }
        });

        if (validOps.length > 0) {
            content.innerHTML = '';
            const grid = document.createElement('div');
            grid.className = 'prts-popover-grid';

            validOps.forEach(op => {
                const item = document.createElement('div');
                item.className = 'prts-popover-item';
                item.title = `${op.name} ${op.skill ? '(技能 ' + op.skill + ')' : ''}`;

                const img = document.createElement('img');
                img.src = `https://zoot.plus/assets/operator-avatars/webp96/${op.id}.webp`;
                img.className = 'prts-popover-img';

                item.appendChild(img);
                if (op.skill) {
                    const badge = document.createElement('div');
                    badge.className = 'prts-popover-skill';
                    badge.innerText = op.skill;
                    item.appendChild(badge);
                }
                grid.appendChild(item);
            });

            content.appendChild(grid);
            content.dataset.optimized = "true";
        }
    }

    /**
     * [V10.4 筛选核心] 应用筛选逻辑
     */
    function applyFilterLogic() {
        if (isFilterDisabledPage()) return;
        isProcessingFilter = true;

        try {
            let cards = document.querySelectorAll('ul.grid > li, .tabular-nums ul > li');
            if (cards.length === 0) return;

            cards.forEach(card => {
                const cardInner = card.querySelector('.bp4-card');
                if (!cardInner) return;

                optimizeCardVisuals(card, cardInner);
                cleanBilibiliLinks(cardInner);

                let isUnavailable = false;
                let statusType = null;
                let statusValue = null;

                if (currentFilterMode !== 'NONE') {
                    const tags = Array.from(card.querySelectorAll('.bp4-tag'));
                    let requiredOps = [];

                    tags.forEach(tag => {
                        if (tag.querySelector('h4')) return;
                        const text = tag.innerText.trim();
                        // 排除非干员标签
                        if (['普通', '突袭', 'Beta'].includes(text) ||
                            text.includes('活动关卡') || text.includes('剿灭') || text.includes('危机合约') ||
                            text.includes('|') || text.startsWith('[') || text.includes('更新') ||
                            text.includes('医疗') || text.includes('奶')) return;

                        const opName = text.split(/\s+/)[0];
                        if (opName && !['json', '作者'].includes(opName)) {
                            requiredOps.push(opName);
                        }
                    });

                    let missingCount = 0;
                    let missingOpName = '';
                    requiredOps.forEach(op => {
                        if (!ownedOpsSet.has(op)) {
                            missingCount++;
                            if (missingCount === 1) missingOpName = op;
                        }
                    });

                    // 1. 判定是否“不可用” (用于决定是否置灰)
                    // 完美模式: 只要缺人就不可用
                    if (currentFilterMode === 'PERFECT') {
                        if (missingCount > 0) isUnavailable = true;
                    }
                    // 助战模式: 缺人超过1个才不可用
                    else if (currentFilterMode === 'SUPPORT') {
                        if (missingCount > 1) isUnavailable = true;
                    }

                    // 2. 判定显示的状态标签 (颜色逻辑)
                    if (currentFilterMode === 'SUPPORT' && missingCount === 1) {
                        // 允许助战且正好缺1人 -> 琥珀色提示 (即使作业是“可用”的)
                        statusType = 'support';
                        statusValue = missingOpName;
                    } else if (missingCount > 0) {
                        // 其他缺人情况 -> 红色警告
                        statusType = 'missing';
                        statusValue = missingCount;
                    }
                }

                // 处理隐藏与置灰
                if (isUnavailable && displayMode === 'HIDE') {
                    if (card.style.display !== 'none') card.style.display = 'none';
                    return;
                } else {
                    if (card.style.display === 'none') card.style.display = '';
                }

                const hasGrayClass = card.classList.contains('prts-card-gray');
                if (isUnavailable && displayMode === 'GRAY') {
                    if (!hasGrayClass) card.classList.add('prts-card-gray');
                } else {
                    if (hasGrayClass) card.classList.remove('prts-card-gray');
                }

                // 更新状态标签 UI
                const existingLabel = cardInner.querySelector('.prts-status-label');
                if (!statusType) {
                    if (existingLabel) existingLabel.remove();
                    return;
                }

                let newHtml = '';
                let newClass = 'prts-status-label';
                if (statusType === 'support') {
                    newClass += ' prts-label-support'; // 琥珀色
                    newHtml = `<span class="bp4-icon" style="margin-right:6px;">🆘</span>需助战: ${statusValue}`;
                } else {
                    newClass += ' prts-label-missing'; // 红色
                    newHtml = `<span class="bp4-icon" style="margin-right:6px;">✘</span>缺 ${statusValue} 人`;
                }

                if (existingLabel) {
                    if (existingLabel.innerHTML !== newHtml || existingLabel.className !== newClass) {
                        existingLabel.className = newClass;
                        existingLabel.innerHTML = newHtml;
                    }
                } else {
                    const labelDiv = document.createElement('div');
                    labelDiv.className = newClass;
                    labelDiv.innerHTML = newHtml;
                    cardInner.appendChild(labelDiv);
                }
            });

        } finally {
            isProcessingFilter = false;
        }
    }

    // =========================================================================
    //                            MODULE 5: 业务逻辑 - 侧边栏与悬浮球
    // =========================================================================

    /**
     * [V6.3 侧边栏优化] 折叠创作工具与美化公告
     */
    function optimizeSidebar() {
        if (!CONFIG.sidebar) return;
        const cards = document.querySelectorAll('.bp4-card');

        cards.forEach(card => {
            if (card.dataset.sidebarOptimized) return;
            const textContent = card.innerText;

            if (textContent.includes('创建新作业') || textContent.includes('拖拽上传')) {
                card.classList.add('prts-sidebar-collapsed');
                const header = card.querySelector('h4, h5, h3, .bp4-heading') || card.firstElementChild;
                if (header) {
                    header.classList.add('prts-sidebar-header-icon');
                    if (!header.dataset.origText) {
                         header.dataset.origText = header.innerText;
                         header.innerHTML = `🛠️ 创作工具`;
                         header.title = "点击展开/折叠";
                    }
                }
                card.onclick = (e) => {
                    if (e.target.closest('a') || e.target.closest('button')) return;
                    card.classList.toggle('prts-sidebar-collapsed');
                    card.classList.toggle('prts-sidebar-expanded');
                };
                card.dataset.sidebarOptimized = "true";
            }

            if (textContent.includes('公告') && card.querySelector('ul')) {
                card.classList.add('prts-notice-btn');
                const header = card.querySelector('h4, h5, h3, .bp4-heading');
                if (header) {
                    header.innerHTML = `📢 站务公告 <span style="font-size:12px; opacity:0.7; font-weight:normal; margin-left:auto;">点击查看详情</span>`;
                    header.classList.remove('text-gray-700');
                }
                card.dataset.sidebarOptimized = "true";
            }
        });
    }

    /**
     * [V6.1 弹窗优化] 公告标题自动添加高亮标签
     */
    function optimizeDialogContent() {
        const dialog = document.querySelector('.bp4-dialog');
        if (!dialog || dialog.dataset.contentOptimized) return;

        const title = dialog.querySelector('.bp4-heading');
        if (title && title.innerText.includes('公告')) {
            const contentBody = dialog.querySelector('.markdown-body');
            if (contentBody) {
                const headers = contentBody.querySelectorAll('h2');
                headers.forEach(h2 => {
                    const text = h2.innerText;
                    let tagHtml = '';

                    if (text.includes('升级') || text.includes('优化') || text.includes('更新')) {
                        tagHtml = `<span class="prts-dialog-tag prts-tag-update">更新</span>`;
                    } else if (text.includes('修复') || text.includes('问题') || text.includes('Bug')) {
                        tagHtml = `<span class="prts-dialog-tag prts-tag-fix">维护</span>`;
                    } else if (text.includes('活动') || text.includes('关卡')) {
                        tagHtml = `<span class="prts-dialog-tag prts-tag-event">活动</span>`;
                    } else {
                        tagHtml = `<span class="prts-dialog-tag prts-tag-note">通知</span>`;
                    }

                    if (!h2.querySelector('.prts-dialog-tag')) {
                        h2.innerHTML = tagHtml + h2.innerHTML;
                    }
                });
            }
            dialog.dataset.contentOptimized = "true";
        }
    }

    /**
     * [V9.4 全局控制] 存储配置
     */
    function saveConfig() {
        GM_setValue('prts_cfg_visuals', CONFIG.visuals);
        GM_setValue('prts_cfg_sidebar', CONFIG.sidebar);
        GM_setValue('prts_cfg_link', CONFIG.cleanLink);
        GM_setValue('prts_cfg_filter', CONFIG.filterBar);
    }

    /**
     * [V9.4 全局控制] 悬浮球与设置面板逻辑
     * 包含拖拽、自动吸附与面板开关
     */
    function createFloatingBall() {
        if (document.getElementById('prts-float-container')) return;

        const savedPos = JSON.parse(GM_getValue('prts_float_pos', '{"top":"40%","isRight":true}'));
        const container = document.createElement('div');
        container.id = 'prts-float-container';

        // 初始化位置
        container.style.top = savedPos.top;
        if (savedPos.isRight) {
            container.style.left = 'auto';
            container.style.right = '0px';
            container.classList.add('snap-right');
        } else {
            container.style.left = '0px';
            container.style.right = 'auto';
            container.classList.add('snap-left');
        }

        const btn = document.createElement('div');
        btn.className = 'prts-float-btn';
        btn.title = "脚本设置 (可拖拽)";
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M27,7.35l-9-5.2a4,4,0,0,0-4,0L5,7.35a4,4,0,0,0-2,3.46V21.19a4,4,0,0,0,2,3.46l9,5.2a4,4,0,0,0,4,0l9-5.2a4,4,0,0,0,2-3.46V10.81A4,4,0,0,0,27,7.35Zm-11.74-3a1.51,1.51,0,0,1,1.5,0l8.49,4.9L16,14.56,6.76,9.22Zm-9,18.17a1.51,1.51,0,0,1-.75-1.3v-9.8l9.24,5.33V27.39Zm19.48,0-8.49,4.9V16.72l9.24-5.33v9.8A1.51,1.51,0,0,1,25.74,22.49Z"></path></svg>`;

        const panel = document.createElement('div');
        panel.className = 'prts-settings-panel';

        const createSwitch = (label, checked, onChange) => {
            const div = document.createElement('div');
            div.className = 'prts-panel-item';
            div.innerHTML = `<span>${label}</span><label class="prts-switch"><input type="checkbox" ${checked ? 'checked' : ''}><span class="prts-slider"></span></label>`;
            const input = div.querySelector('input');
            input.onchange = (e) => onChange(e.target.checked);
            return div;
        };

        const title = document.createElement('div');
        title.className = 'prts-panel-title';
        title.innerHTML = `<span style="margin-right:auto">功能开关</span><span style="font-size:12px;opacity:0.6">刷新生效</span>`;
        panel.appendChild(title);

        // 已移除暗黑模式开关，由网站原生 ThemeSwitchButton 接管
        panel.appendChild(createSwitch('🖼️ 作业卡片美化', CONFIG.visuals, (val) => {
            CONFIG.visuals = val; saveConfig(); if(val) requestFilterUpdate(); else location.reload();
        }));
        panel.appendChild(createSwitch('🗂️ 侧边栏净化', CONFIG.sidebar, (val) => {
            CONFIG.sidebar = val; saveConfig(); if(val) optimizeSidebar();
        }));
        panel.appendChild(createSwitch('🔗 视频链接优化', CONFIG.cleanLink, (val) => {
            CONFIG.cleanLink = val; saveConfig(); if(val) requestFilterUpdate();
        }));

        const importBtn = document.createElement('button');
        importBtn.className = 'prts-btn';
        importBtn.style.width = '100%'; importBtn.style.marginTop = '8px';
        importBtn.innerHTML = '📂 导入干员数据';
        importBtn.onclick = handleImport;
        panel.appendChild(importBtn);

        container.appendChild(panel);
        container.appendChild(btn);
        document.body.appendChild(container);

        // 拖拽逻辑
        let isDragging = false;
        let hasMoved = false;
        let startX, startY, initialLeft, initialTop;

        btn.addEventListener('mousedown', (e) => {
            isDragging = true;
            hasMoved = false;
            startX = e.clientX;
            startY = e.clientY;
            const rect = container.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            container.classList.remove('is-snapping');
            container.classList.add('is-dragging');
            container.style.left = initialLeft + 'px';
            container.style.top = initialTop + 'px';
            container.style.right = 'auto';
            container.style.transform = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;

            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;

            // 边界检查
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;
            const elWidth = container.offsetWidth;
            const elHeight = container.offsetHeight;

            if (newLeft < 0) newLeft = 0;
            if (newLeft > winWidth - elWidth) newLeft = winWidth - elWidth;
            if (newTop < 0) newTop = 0;
            if (newTop > winHeight - elHeight) newTop = winHeight - elHeight;

            container.style.left = newLeft + 'px';
            container.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            container.classList.remove('is-dragging');
            container.style.transform = '';

            if (hasMoved) {
                const winWidth = window.innerWidth;
                const rect = container.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;

                container.classList.add('is-snapping');
                let isRight = true;
                if (centerX < winWidth / 2) {
                    container.style.left = '0px';
                    container.style.right = 'auto';
                    container.classList.remove('snap-left');
                    container.classList.add('snap-left');
                    isRight = false;
                } else {
                    container.style.left = 'auto';
                    container.style.right = '0px';
                    container.classList.remove('snap-left');
                    container.classList.add('snap-right');
                    isRight = true;
                }
                const topPercent = (rect.top / window.innerHeight * 100).toFixed(1) + '%';
                container.style.top = topPercent;

                GM_setValue('prts_float_pos', JSON.stringify({ top: topPercent, isRight: isRight }));
            }
        });

        btn.onclick = (e) => {
            e.stopPropagation();
            if (!hasMoved) container.classList.toggle('prts-float-open');
        };
        panel.onclick = (e) => e.stopPropagation();
        document.addEventListener('click', () => {
            if (!isDragging) container.classList.remove('prts-float-open');
        });
    }

    // =========================================================================
    //                            MODULE 6: 初始化与统一监听
    // =========================================================================

    function init() {
        loadOwnedOps();
        createFloatingBall();
        injectFilterControls();

        // 全局 DOM 观察者
        const observer = new MutationObserver((mutations) => {
            optimizeSidebar();
            optimizeDialogContent();

            if (isProcessingFilter) return;
            if (isFilterDisabledPage()) return;

            // 筛选变动检测
            let domChanged = false;
            for (const mutation of mutations) {
                if (mutation.target.classList && mutation.target.classList.contains('prts-status-label')) continue;
                if (mutation.target.id === 'prts-filter-bar') continue;
                if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                    domChanged = true;
                    break;
                }
            }

            if (domChanged) {
                injectFilterControls();
                if (filterDebounceTimer) clearTimeout(filterDebounceTimer);
                filterDebounceTimer = setTimeout(requestFilterUpdate, 50);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // [V11.1 修复] Portal 内部变化专用观察者
        const portalInnerObserver = new MutationObserver((mutations) => {
            if (!CONFIG.visuals) return;
            mutations.forEach(mutation => {
                const portalNode = mutation.target.closest('.bp4-portal');
                if (portalNode) enhancePopover(portalNode);
            });
        });

        // 监听 React Portal 容器生成 (用于弹窗和Tooltip)
        const bodyObserver = new MutationObserver((mutations) => {
            if (!CONFIG.visuals) return;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList.contains('bp4-portal')) {
                            setTimeout(() => enhancePopover(node), 0);
                            portalInnerObserver.observe(node, { childList: true, subtree: true });
                        }
                    });
                }
            });
        });

        bodyObserver.observe(document.body, { childList: true });

        // 保底定时器
        setInterval(() => {
            optimizeSidebar();
            optimizeDialogContent();
            createFloatingBall();
            if (CONFIG.sidebar) optimizeSidebar();
            if (!isFilterDisabledPage() && !document.getElementById('prts-filter-bar')) {
                injectFilterControls();
            }
        }, 1000);
    }

    init();

})();