// ==UserScript==
// @name         宗教答题测试助手（v1.4.0，内置题库 + 模糊匹配 + 多选修复）
// @namespace    https://example.com/userscripts
// @version      1.4.0
// @description  对照内置/本地/远程题库，自动匹配并勾选【单选/多选】；更强规范化与模糊匹配；多选逐点原生 click；统计未命中/不一致；提供题库调试与内置题库管理。
// @author       GuZhi_007 & ChatGOT
// @match        *://hnjingsai.cn/cbt/exam/*
// @match        *://hnjingsai.cn/*
// @match        *://hnjingsai.cn/cbt/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553919/%E5%AE%97%E6%95%99%E7%AD%94%E9%A2%98%E6%B5%8B%E8%AF%95%E5%8A%A9%E6%89%8B%EF%BC%88v140%EF%BC%8C%E5%86%85%E7%BD%AE%E9%A2%98%E5%BA%93%20%2B%20%E6%A8%A1%E7%B3%8A%E5%8C%B9%E9%85%8D%20%2B%20%E5%A4%9A%E9%80%89%E4%BF%AE%E5%A4%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553919/%E5%AE%97%E6%95%99%E7%AD%94%E9%A2%98%E6%B5%8B%E8%AF%95%E5%8A%A9%E6%89%8B%EF%BC%88v140%EF%BC%8C%E5%86%85%E7%BD%AE%E9%A2%98%E5%BA%93%20%2B%20%E6%A8%A1%E7%B3%8A%E5%8C%B9%E9%85%8D%20%2B%20%E5%A4%9A%E9%80%89%E4%BF%AE%E5%A4%8D%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /** ================= 在此内置题库（占位符） =================
   * 用法：把下面对象里的示例替换成你的实际题库 JSON。
   * 规则：键是“规范化后的题干”（脚本会自动规范化页面题干进行匹配）。
   * - 单选：{ "type":"single", "answer":"A" }
   * - 多选：{ "type":"multi",  "answer":["A","C","D"] }
   *
   * 示例（可删除）：
   * "下列属于新时代党的治藏方略十个必须的基本内容的是": { "type":"multi","answer":["A","B","C","D"] },
   * "下列说法正确的是": { "type":"single","answer":"C" }
   */
  const BUILTIN_BANK = {
    
  '马克思认为宗教是人的异化形式宗教的本质是(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '我国宪法第条明确规定宗教团体和宗教事务不受国外势力的支配(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '宗教在社会主义社会将(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '构建各民族共有精神家园要以为引领(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '是最深层次的认同是民族团结之根、民族和睦之魂(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '《宪法》第条规定各少数民族聚居的地方实行区域自治设立自治机关行使自治权(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '在《反杜林论》中指出一切宗教都不过是支配着人们日常生活的外部力量在人们头脑中的幻想的反映在这种反映中人间的力量采取了超人间的力量的形式(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '马克思、恩格斯运用辩证唯物主义和历史唯物主义观察分析宗教现象和宗教问题创立了为马克思主义政党正确认识和处理宗教问题提供了理论基础(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '宗教认识其信仰对象的基本方法是(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '党的十九大把写入党章成为全党全国各族人民实现中国梦新征程上的共同意志和根本遵循(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '我国实行政教分离的原则任何宗教都没有超越的特权都不能干预国家行政、司法和教育等国家职能的实施(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '下列不是社会主义核心价值观的内容(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '《教育法》规定国家施行教育与宗教相分离任何组织和个人不得利用宗教进行妨碍国家教育制度的活动(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '下列说法错误的是(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '任何组织和个人不得在以下场所进行宗教活动(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '中国特色社会主义宗教理论以为指导对我国社会主义特别是初级阶段的宗教进行理论阐述分析宗教在我国社会主义时期的特征和作用明确党和国家在社会主义条件下处理宗教问题的方针政策(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '下列属于新时代党的治藏方略十个必须的基本内容的是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '马克思恩格斯认为宗教的根源有(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C'
    ]
  },
  '邪教的本质及危害性是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '处理我国宗教关系要(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '习近平总书记在第三次中央新疆工作座谈会上强调要促进各民族、、(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'D'
    ]
  },
  '下列属于《中华人民共和国境内外国人宗教活动管理规定》及其实施细则规定内容的是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '下列关于民族区域自治制度的说法正确的是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '习近平总书记在第二次中央新疆工作座谈会上指出各民族要像石榴籽那样紧紧抱在一起(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'C',
      'D'
    ]
  },
  '坚持和发展中国特色社会主义宗教理论要做到(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B'
    ]
  },
  '年全国宗教工作会议指出要坚持坚持独立自主自办原则统筹推进相关工作(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '是中华民族一家亲的坚强纽带(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '是解决我国民族问题的正确道路(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '年习近平总书记在河北省承德市考察时指出要坚持党的宗教工作基本方针坚持我国宗教的中国化方向积极引导宗教与社会主义社会相适应坚持独立自主自办原则全面贯彻党的宗教信仰自由政策弘扬爱国爱教优良传统创建良好宗教环境依法依规管理宗教事务促进宗教更好社会、社会、履行社会责任(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '五个维护是指维护社会主义民主、、、、(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '我国某地一寺庙佛门弟子积极参加当地架桥修路、捐资助学等活动方丈还以80万元巨资买到了电视台黄金时段前15秒公益广告权宣传保护野生动物和禁止毒品以上事实说明在我国(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '中国宗教的特征是(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '《刑法》第三百条规定组织、利用会道门、邪教组织或者利用迷信破坏国家法律、行政法规实施的情节特别严重的处以上有期徒刑并处罚金或者没收财产(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '《宪法》序言指出中华人民共和国是全国各族人民共同缔造的统一的多民族国家的社会主义民族关系已经确立并将继续加强(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '习近平总书记在上明确强调共产党员要做坚定的马克思主义无神论者严守党章规定坚定理想信念牢记党的宗旨决不能在宗教中寻找自己的价值和信念(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '如何理解我国的宗教信仰自由政策下面观点中正确的是(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '信仰宗教的党员经组织教育仍然没有转变应当(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '《中华人民共和国电信条例》第六十六条规定违反本条例的规定构成犯罪的依法追究刑事责任尚不构成犯罪的由公安机关、国家安全机关依照有关法律、行政法规的规定予以处罚(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '是社会主义民族关系的保障(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '年8月24日习近平总书记在中央第六次西藏工作座谈会上指出必须全面正确贯彻党的民族政策和宗教政策加强民族团结不断增进各族群众对的认同(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '党的十九大报告指出全面贯彻党的民族政策深化民族团结进步教育铸牢中华民族共同体意识加强各民族促进各民族像石榴籽一样紧紧抱在一起共同团结奋斗、共同繁荣发展(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '新修订《宗教事务条例》规定宗教教职人员经宗教团体认定报人民政府宗教事务部门备案可以从事宗教教务活动(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '习近平总书记在中央第次西藏工作座谈会上指出要重视加强学校思想政治教育把爱国主义精神贯穿各级各类学校教育全过程把爱我中华的种子埋入每个青少年的心灵深处(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '根据《宗教事务条例》第四十一条规定下列地点中不得组织、举行宗教活动的是(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '实现中华民族伟大复兴的中国梦就要以铸牢中华民族共同体意识为主线把作为基础性事业抓紧抓好(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '习近平总书记在第三次中央新疆工作座谈会上强调要加强、的研究将中华民族共同体意识教育纳入新疆干部教育、青少年教育、社会教育教育引导各族干部群众树立正确的国家观、历史观、民族观、文化观、宗教观让中华民族共同体意识根植心灵深处(4分)': {
    'type': 'multi',
    'answer': [
      'B',
      'C'
    ]
  },
  '全面正确地贯彻宗教信仰自由政策包含有两个方面的内容(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B'
    ]
  },
  '宗教印刷品、宗教音像制品属于下列情况不得人境(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C'
    ]
  },
  '积极引导宗教与社会主义社会相适应是要引导信教群众(4分)': {
    'type': 'multi',
    'answer': [
      'A'
    ]
  },
  '在《中外合作办学条例》中第七条规定中不得在中国境内从事合作办学活动(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '世界上的邪教五花八门名称各异但它们却有着共同的特点下列不属于邪教特点的是(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '目前全国共建立了156个民族区域自治地方其中包括自治区、30个自治州、121个自治县（旗）(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '下列说法正确的是(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '年9月在会见基层民族团结优秀代表时习近平总书记指出这是全体中华儿女的共同心愿也是全国各族人民的共同目标(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '宗教工作的本质是(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '年6月14日国务院常务会议审议通过了《宗教事务条例（修订草案）》2017年8月26日李克强总理签署国务院令公布条例自起施行(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '党的十八大以来以习近平同志为核心的党中央高度重视民族工作着眼培育中华民族共同体意识创新推进取得显著成绩(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '我国实行的原则任何宗教都没有超越宪法和法律的特权都不能干预国家行政、司法、教育等国家职能的实施(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '以下叙述不正确的是(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '在《刑法》第三百条规定组织利用会道门、邪教组织或者利用迷信破坏国家法律、行政法规实施的关于处罚下列说法错误的是(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '习近平总书记在中央第七次西藏工作座谈会上指出要挖掘、整理、宣传西藏自古以来各民族交往交流交融的历史事实引导各族群众看到民族的走向和未来深刻认识到促进各民族交往交流交融(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '新时代党的民族工作的主线是(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '年中央民族工作会议指出必须坚持和完善确保党中央政令畅通确保国家法律法规实施支持各民族发展经济、改善民生实现共同发展共同富裕(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '习近平总书记在十三届全国人大四次会议内蒙古代表团审议时指出要围绕共同团结奋斗、共同繁荣发展牢记、、在促进民族团结方面把工作做细做实(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C'
    ]
  },
  '《宪法》中关于民族关系的规定包括(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'D'
    ]
  },
  '年9月召开的新疆若干历史问题研究座谈会明确阐明(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '正确处理涉及民族因素的矛盾纠纷要做到(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '《宪法》第二十四条规定国家通过普及在城乡不同范围的群众中制定和执行各种守则、公约加强社会主义精神文明的建设(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '公民有宗教信仰自由就是说每个公民(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '新中国成立后我们党创造性地把马克思主义民族理论同中国民族问题具体实际相结合走出一条中国特色解决民族问题的正确道路确立了党的民族理论和民族政策各族人民在历史上第一次真正获得了平等的政治权利、共同当家做了主人终结了旧中国民族压迫、纷争的痛苦历史开辟了发展各民族平等团结互助和谐关系的新纪元(4分)': {
    'type': 'multi',
    'answer': [
      'B',
      'C'
    ]
  },
  '习近平总书记在全国民族团结进步表彰大会上指出要把民族团结进步创建全面深入持久开展起来创新方式载体推动进机关、进企业、进、进、进、进连队、进等(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '必须从战略高度把握新时代党的民族工作的历史方位(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '是党的宗教工作基本方针的根本方向和目的是宗教工作的重点(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '教育法规定国家实行教育和宗教相分离(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '多民族大一统格局是我国自以来就基本形成的历史传统和独特优势(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '坚持我国宗教中国化方向要求宗教界在上自觉融合(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '宗教信仰从本质上说属于意识形态范畴反映的是人们的问题是人们的一种思想认识(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '宗教与科学在本质上是的关系(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '正常的宗教活动主要有两层含义一是宗教活动要在允许的范围内进行二是宗教活动要严格按照宗教教义、教规及传统宗教习惯开展(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '中华民族和各民族的关系是(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '回顾党的百年历程党的民族工作取得的最大成就就是走出了一条解决民族问题的正确道路(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '是积极引导宗教与社会主义社会相适应的必然要求也是我国宗教发展的必由之路(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '下列不属于党关于加强和改进民族工作的重要思想的是(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '根据《宗教事务条例》有关规定任何组织或者个人不得利用宗教进行等违法活动(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '下列关于依法管理宗教事务的说法正确的是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '关于社会主义民族关系《宪法》第四条规定(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '各民族要始终把的利益放在首位(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '要正确认识和把握宗教社会作用的最大限度发挥宗教的积极作用最大限度抑制宗教的消极作用因势利导、趋利避害积极引导宗教与社会主义社会相适应(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '新时代党的民族工作的出发点和落脚点是(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '我国是统一的多民族国家是各族人民的生命线(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '坚持我国宗教中国化方向要求宗教界在上自觉适应(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '增进共同性、尊重和包容差异性是民族工作的(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '坚持我国宗教中国化方向下列说法错误的是(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '下列不是五个认同的内容(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '以下选项中符合我国宗教信仰自由政策的是(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '年11月四川广元县天主教神甫王良佐和500多名教徒联名发表了《天主教自立革新运动宣言》号召中国天主教徒基于爱祖国、爱人民的立场坚决与帝国主义者割断各方面的关系建设的新教会(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '下列有关新疆的说法不正确的是(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '《中国共产主义青年团章程》规定中国共产主义青年团坚决拥护中国共产党的纲领以马克思列宁主义、、、、科学发展观、(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '习近平总书记在全国民族团结进步表彰大会强调和都是民族团结的大敌要坚决反对(4分)': {
    'type': 'multi',
    'answer': [
      'C',
      'D'
    ]
  },
  '党的把铸牢中华民族共同体意识写入党章成为全党全国各族人民实现中国梦新征程上的共同意志和根本遵循(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '习近平总书记在参加十三届全国人大四次会议内蒙古代表团审议时强调要认真做好推广普及工作全面推行使用国家统编教材(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '信教群众和不信教群众在政治上经济上的是一致的都是党执政的群众基础(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '实行宗教信仰自由政策出发点和落脚点是(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '做好新时代党的民族工作要把作为党的民族工作的主线(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '《宗教事务条例》第三条规定宗教事务管理坚持的原则是(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '习近平总书记鲜明提出这是我们党关于宗教工作理论的系统总结和重大创新是中国特色社会主义理论体系的宗教篇(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '马克思主义哲学课的一项重要内容是要切实加强青少年的科学世界观其中包括的宣传教育(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '习近平总书记在参加十三届全国人大一次会议内蒙古代表团审议时指出要高举旗帜全面贯彻党的民族区域自治制度这一理论根源越扎越深、实践根基越打越牢(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '《宪法》第条规定中华人民共和国公民有宗教信仰自由(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '各高校利用课堂主渠道对在校学生进行马克思主义宗教观和党的宗教政策宣传教育要做到(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '宗教极端主义在本质上、、(4分)': {
    'type': 'multi',
    'answer': [
      'B',
      'C',
      'D'
    ]
  },
  '年中央民族工作会议提出必须构筑中华民族共有精神家园使各族人民、形成人心凝聚、团结奋进的强大精神纽带(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B'
    ]
  },
  '宗教极端主义的危害在于(4分)': {
    'type': 'multi',
    'answer': [
      'B',
      'C',
      'D'
    ]
  },
  '《互联网信息服务管理办法》第十五条规定互联网信息服务提供者不得含有煽动民族仇恨、民族歧视、破坏民族团结的内容的信息(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '年中央民族工作会议指出必须坚持正确的中华民族历史观增强对中华民族的和(4分)': {
    'type': 'multi',
    'answer': [
      'C',
      'D'
    ]
  },
  '宪法规定国家保护正常的宗教活动正常的宗教活动是指(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '要积极推进形成共学共进的氛围和条件避免各民族学生到了学校还是各抱各的团、各走各的圈(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '文化认同是民族团结的(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '在恩格斯提出的宗教发展和宗教历史形态图示中宗教经历了从原始社会的到阶级社会的的发展过程(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '习近平总书记在参加十三届全国人大一次会议内蒙古代表团审议时指出我国是统一的多民族国家民族团结是各族人民的生命线加强民族团结根本在于(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '共产党员和不能信仰宗教(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '习近平总书记指出积极引导宗教与社会主义社会相适应一个重要的任务就是(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '下列不属于五爱的基本内容的是(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '不属于民族团结进步七进的基本内容的是(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '我国《宪法》第三十六条明确规定宗教团体和宗教事务不受的支配(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '正确把握中华民族共同体意识和各民族意识的关系包括(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '改革开放特别是党的十八大以来我们党强调、、等理念既一脉相承又与时俱进贯彻党的民族理论和民族政策积累了把握民族问题、做好民族工作的宝贵经验形成了党关于加强和改进民族工作的重要思想(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'D'
    ]
  },
  '下列行为中违反《宗教事务条例》(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'D'
    ]
  },
  '民族区域自治制度在下列哪些方面起到了重要作用(4分)': {
    'type': 'multi',
    'answer': [
      'B',
      'C',
      'D'
    ]
  },
  '改革开放以来我国的民族关系为(4分)': {
    'type': 'multi',
    'answer': [
      'B',
      'C',
      'D'
    ]
  },
  '坚持我国宗教中国化方向要求宗教界在上自觉认同(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '党的宗教工作的本质是工作(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '马克思主义对宗教的批判的目的是要(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '根据《中华人民共和国电信条例》第五十六条中第五款规定任何组织或者个人不得利用电信网络制作、复制、发布、传播含有下列哪项信息(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B'
    ]
  },
  '三股势力是指、、(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C'
    ]
  },
  '习近平总书记在参加十三届全国人大四次会议内蒙古代表团审议时指出要在各族干部群众中深入开展中华民族共同体意识教育特别是要从青少年教育抓起引导广大干部群众全面理解党的民族政策树立正确的、、民族观、、宗教观旗帜鲜明反对各族错误思想观点凝聚建设亮丽内蒙古共圆伟大中国梦的合力(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C'
    ]
  },
  '中华民族主要分布在(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '下列关于中华民族多元一体格局中多元与一体的关系不正确的是(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '要支持引导宗教界加强自我、自我、自我全面从严治教带头守法遵规、提升宗教修为(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '信教公民举行集体宗教活动一般应在经登记的寺院、宫观、清真寺、教堂和(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '关于抵御利用宗教对学校进行渗透和防范校园传教的意义下列说法不正确的是(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '做好民族工作要正确把握(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '习近平总书记在全国民族团结进步表彰大会上指出各民族在文化上要、、、、(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B'
    ]
  },
  '必须坚持推进民族事务治理体系和治理能力现代化(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '本民族意识要服从和服务于意识(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '是社会主义民族关系的主线(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '根据新修订《宗教事务条例》第七十条规定擅自组织公民出境参加宗教方面的培训、会议、朝觐等活动的或者擅自开展宗教教育培训的由宗教事务部门会同有关部门责令停止活动可以并处的罚款(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '党的十八大来党中央提出一系列关于宗教工作的新理念新举措回答了、、等重大理论和实践问题(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C'
    ]
  },
  '我国宗教工作形势总体向好表现在(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '下列属于我国多元一体格局内容的是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '党的宗教工作基本方针是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '是中国特色解决民族问题的正确道路的重要内容和制度保障(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '假冒宗教教职人员进行宗教活动的由宗教事务部门责令有违法所得的没收违法所得有违反治安管理行为的依法给予治安管理处罚构成犯罪的依法追究刑事责任(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '下列不属于我国宗教特征的是(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '据《宗教事务条例》第五条规定各宗教坚持的原则宗教团体、宗教院校、宗教活动场所和宗教事务不受外国势力的支配(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '《中华人民共和国海关进出境印刷品及音像制品监管办法》规定个人携带、邮寄进境的宗教类出版物及印刷品在自用、合理范围内的数量不超过是可以进境的(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '三交的基本内涵是(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '四个共同是指我国(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '年中央民族工作会议提出必须促进各民族促进各民族在理想、信念、情感、文化上的团结统一守望相助、手足情深(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'C',
      'D'
    ]
  },
  '宗教院校以外的学校及其他教育机构传教、举行宗教活动、成立宗教组织、设立宗教活动场所的由其审批机关或者其他有关部门责令限期并予以警告(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '是社会主义民族关系的基石(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '年5月29日习近平总书记在第二次中央新疆工作座谈会上指出各族群众要像石榴籽那样紧紧抱在一起(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '关于如何区分邪教和宗教下列说法错误的是(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '实践充分证明党的民族理论和方针政策是正确的中国特色解决民族问题的道路是正确的只有中国共产党才能实现中华民族的大团结只有才能凝聚各民族、发展各民族、繁荣各民族(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '按照中央民族工作会议精神坚持依法治理民族事务做到法律面前人人平等就要做到(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'D'
    ]
  },
  '新时代党的治藏方略十个必须必须中西藏工作的着眼点和着力点是、(4分)': {
    'type': 'multi',
    'answer': [
      'C',
      'D'
    ]
  },
  '我国实行宗教与教育的原则(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '信教公民举行集体宗教活动一般应在经登记的宗教活动场所内举行下列属于违法宗教活动处所(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '要加强向干部群众和青少年进行辩证唯物主义和历史唯物主义的科学世界观的教育宣传加强有关自然现象、社会进化和人的生老病死、吉凶祸福等科学文化知识的宣传教育(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '依据《宗教事务条例》规定下列哪项不是宗教团体、宗教院校、宗教活动场所、宗教教职人员上开展对外交往的基础(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '马克思主义认为宗教对于现实世界的反映是(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '在新修订《宗教事务条例》中哪两项对从事互联网宗教信息服务作出了规定(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '以下说法不正确的是(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '党的十八以来民族工作的显著成绩体现在(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'D'
    ]
  },
  '用法律来保障民族团结要做到(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '国家要对宗教事务进行管理(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '我们的高校是党领导下的高校是中国特色社会主义高校办好我们的高校必须坚持全面贯彻党的教育方针(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '习近平总书记在2019年全国民族团结进步表彰大会上指出是中华民族伟大复兴必定要实现的根本保证(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '《宪法》第条规定中华人民共和国公民有维护国家统一和全国各民族团结的义务(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '在《网络出版服务管理规定》第二十四条规定中网络出版物不得含有以下内容(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '下列不属于宗教产生的根源的是(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '全面贯彻党的宗教工作基本方针坚持我国宗教的中国化方向积极引导宗教与社会主义社会相适应这是党的对宗教工作的重要论述(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '下列属于我国宗教事务管理坚持的基本原则内容的是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '宗教工作在党和国家工作全局中具有特殊重要性关系到(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '党的十九大对民族工作的重要论述包括(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '习近平总书记在2021年中央民族工作会议上指出要正确把握物质和精神的关系要赋予所有改革发展让中华民族共同体牢不可破(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B'
    ]
  },
  '新时代新疆工作的总目标是(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '恩格斯关于宗教的发展曾提出过三种图式下列说法错误的是(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '民族团结是我国各族人民的生命线各民族共同团结进步、共同繁荣发展是中华民族的生命所在、力量所在、希望所在这是因为(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'D'
    ]
  },
  '关于大藏区的表述以下说法正确的是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '是中华民族缔造统一的多民族国家的内生动力(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '对中华民族共同体的认识下列说法正确的是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '是社会主义民族关系的本质(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '中华民族是多元一体的大家庭是在长期历史演进中形成的(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '科学无神论的教育并不仅仅限于单纯否定神灵的存在它的最主要的内容是还包括和(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'C',
      'D'
    ]
  },
  '要深入推进我国宗教中国化引导和支持我国宗教以为引领增进宗教界人士和信教群众对伟大祖国、中华民族、中华文化、中国共产党、中国特色社会主义的认同(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '取得《互联网宗教信息服务许可证》的宗教院校可以且仅限于通过其依法自建的、、等开展面向宗教院校学生、宗教教职人员的宗教教育培训(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C'
    ]
  },
  '我国的民族区域自治制度是、、、(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '大汉族主义和狭隘民族主义的危害在于(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '我国的民族区域自治是指在国家的统一领导下各少数民族聚居地方实行区域自治设立行使(4分)': {
    'type': 'multi',
    'answer': [
      'B',
      'C'
    ]
  },
  '年中央民族工作会议指出必须坚决维护国家主权、安全、发展利益教育引导各民族继承和发扬传统自觉维护祖国统一、国家安全、社会稳定(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '年8月召开的中央第七次西藏工作座谈会指出党中央历来高度重视西藏工作做好西藏工作必须坚持中国共产党领导、中国特色社会主义制度、民族区域自治制度必须坚持治国必治边、治边先稳藏的战略思想必须把维护祖国统一、加强民族团结作为西藏工作的着眼点和着力点必须坚持依法治藏、富民兴藏、长期建藏、凝聚人心、夯实基础的重要原则必须必须把改善民生凝聚人心作为经济社会发展的出发点和落脚点必须必须坚持我国宗教中国化方向、依法管理宗教事务必须必须(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '坚持我国宗教中国化方向要求宗教界在上自觉认同坚持我国宗教中国化方向要求宗教界在上自觉融合坚持我国宗教中国化方向要求宗教界在上自觉适应(4分)': {
    'type': 'multi',
    'answer': [
      'B',
      'C',
      'D'
    ]
  },
  '关于中华民族各民族之间的关系下列说法正确的是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '《宪法》第三十六条规定中华人民共和国公民有宗教信仰自由任何国家机关、社会团体和不得强制公民信仰宗教或者不信仰宗教不得歧视信仰宗教的公民和不信仰宗教的公民(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '除经政府批准设立的宗教院校外在各级各类学校中以下做法正确的是(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '习近平总书记在全国民族团结进步表彰大会上指出我们要全面贯彻党的和坚持共同团结奋斗、共同繁荣发展促进各民族像石榴籽一样紧紧拥抱在一起推动中华民族走向包容性更强、凝聚力更大的命运共同体(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B'
    ]
  },
  '年全国宗教工作会议指出要在宗教界开展爱国主义、集体主义、社会主义教育有针对性地加强、、、教育引导宗教界人士和信教群众培育和践行社会主义核心价值观弘扬中华文化(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '年全国宗教工作会议指出要在宗教界开展、、教育有针对性地加强党史、新中国史、改革开放史、社会主义发展史教育引导宗教界人士和信教群众培育和践行社会主义核心价值观弘扬中华文化(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '关于民族区域自治制度下列说法正确的是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '习近平总书记在2021年全国宗教工作会议上指出要培养一支让他们深入学习马克思主义宗教观、党的宗教工作理论和方针政策、宗教知识不断提升导的能力要培养一支要培养一支加强马克思主义宗教学学科建设(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C'
    ]
  },
  '习近平总书记在全国宗教工作会议上强调党的十八大以来党中央提出一系列关于宗教工作的新理念新举措回答了新时代怎样认识宗教、怎样处理宗教问题、怎样做好党的宗教工作等重大理论和实践问题必须必须建立健全强有力的领导机制必须必须必须坚持我国宗教中国化方向必须坚持把广大信教群众团结在党和政府周围必须构建积极健康的宗教关系必须支持宗教团体加强自身建设必须(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '高校在教育教学过程中要发挥课堂主渠道作用在学校德育课程、思想政治理论课中加强科学教育、培养唯物主义思想认识(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '《中华人民共和国反恐怖主义法》第八十一条规定利用极端主义实施下列行为情节轻微尚不构成犯罪的由公安机关处五日以上十五日以下拘留可以并处一万元以下罚款(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '坚决抵御境外利用宗教进行渗透要求我们(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '是中华民族构建统一经济体的强大力量(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '是中华民族共同体形成和发展的历史根基(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '新时代党的民族工作的重要任务是(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '习近平总书记在中央第七次西藏工作座谈会上指出要培育和践行不断增强各族群众对伟大祖国、中华民族、中华文化、中国共产党、中国特色社会主义的认同(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '互联网宗教信息不得含有下列内容、、、(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '关于中华文化和各民族文化的关系下列说法正确的是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '党的宗教工作基本方针是完整、准确、全面贯彻党的宗教信仰自由政策尊重群众宗教信仰依法管理宗教事务坚持原则积极引导宗教与社会主义社会相适应(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '是习近平总书记关于民族工作的重大原创性论断是新时代党的民族工作的主线(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '《宗教事务条例》第四十七条规定从事互联网宗教信息服务应当经以上人民政府宗教事务部门审核同意后按照国家互联网信息服务管理有关规定办理(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '中华民族共同体意识是、、(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'C',
      'D'
    ]
  },
  '下列属于新时代党的治疆方略内容的是(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '年中央民族工作会议指出要守住意识形态阵地积极稳妥处理涉民族因素的意识形态问题持续肃清、流毒(4分)': {
    'type': 'multi',
    'answer': [
      'C',
      'D'
    ]
  },
  '中国共产党第二十次全国代表大会对民族工作的要求是以为主线坚定不移走中国特色解决民族问题的正确道路坚持和完善民族区域自治制度加强和改进党的民族工作全面推进民族团结进步事业(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '《宗教事务条例》第四十四条规定禁止在宗教院校以外的学校及其他教育机构进行(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '习近平总书记在2021年全国宗教工作会议上指出要健全宗教工作体制机制推动构建、、、的宗教事务治理格局要把握好涉及宗教工作的重大关系多做打基础、利长远的工作常抓不懈、久久为功(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '党的二十大对民族工作的重要论述包括以为主线坚定不移走中国特色解决民族问题的正确道路坚持和完善民族区域自治制度加强和改进党的民族工作全面推进事业坚持积极引导宗教与相适应(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '下列不属于新时代党的治疆方略内容的是(3分)': {
    'type': 'single',
    'answer': 'D'
  },
  '关于大藏区的说法错误的是(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '习近平总书记2021年7月在西藏自治区考察时指出要全面贯彻党的宗教工作基本方针尊重群众的宗教信仰坚持独立自主自办原则依法管理宗教事务积极引导藏传佛教与社会主义社会相适应促进、、（在推动社会发展进步中发挥积极作用(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C'
    ]
  },
  '五个认同是指让各族人民增强对伟大祖国、对、对、对、对的认同(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '年4月习近平总书记考察新疆时强调要把民族团结紧紧抓在手上坚持正确的祖国观、民族观全面贯彻党的民族政策牢牢把握各民族共同团结奋斗、共同繁荣发展的主题促进各民族(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '新时代党的治藏方略十个必须必须中西藏经济社会发展的出发点和落脚点是、(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B'
    ]
  },
  '宗教活动应当在法律法规规定范围内开展不得损害不得违背不得干涉和(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '是中华民族铸就多元一体文明格局的文化基因(3分)': {
    'type': 'single',
    'answer': 'C'
  },
  '马克思主义五观指的是国家观、、、、(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  },
  '是民族工作成功的根本保证也是各民族大团结的根本保证(3分)': {
    'type': 'single',
    'answer': 'A'
  },
  '党的十九大报告指出全面贯彻党的宗教工作基本方针坚持我国宗教的中国化方向积极引导宗教与社会主义社会(3分)': {
    'type': 'single',
    'answer': 'B'
  },
  '《宗教事务条例》第四十八条规定互联网宗教信息服务的内容应当符合的相关规定(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'D'
    ]
  },
  '铸牢中华民族共同体意识就是要引导各族人民牢固树立、、、的共同体理念(4分)': {
    'type': 'multi',
    'answer': [
      'A',
      'B',
      'C',
      'D'
    ]
  }

  };

  /** ================= 偏好设置（可在菜单里动态修改） ================= */
  const PREFS = {
    autoAnswer: GM_getValue("autoAnswer", true),
    fuzzyThreshold: Number(GM_getValue("fuzzyThreshold", 0.9)), //  可调
    bankURL: GM_getValue("qaBankURL", ""),                      // 可选远程题库
  };

  /** ================= 工具函数 ================= */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // 更强规范化：清空白/零宽、去【标签】、去空括号、去标点与序号
  function normalizeStem(raw) {
    if (!raw) return "";
    let s = String(raw)
      .replace(/[\s\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000\u200B]+/g, "") // 多种空白
      .replace(/【.*?】/g, "")                           // 去【单选】【多选】
      .replace(/^[\d一二三四五六七八九十百千]+[.)、．]/, "") // 去题号
      .replace(/[（(][ 　]*[)）]/g, "")                 // 去空括号
      .replace(/[“”"『』]/g, "")                        // 去引号
      .replace(/[：:。！？!?，,；;…]/g, "")             // 去常见标点
      .trim();
    s = s.replace(/^[\d\.]+/, "");
    return s;
  }

  function fireEvents(el) {
    ["pointerdown","mousedown","click","input","change"].forEach(type => {
      try { el.dispatchEvent(new Event(type, { bubbles: true })); } catch {}
    });
  }

  function getBank() {
    try { return JSON.parse(GM_getValue("qaBank", "{}")); } catch { return {}; }
  }
  function setBank(obj) {
    GM_setValue("qaBank", JSON.stringify(obj || {}));
  }

  async function fetchRemoteBank() {
    const url = PREFS.bankURL;
    if (!url) return null;
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET", url, timeout: 15000,
        onload: (res) => { try { resolve(JSON.parse(res.responseText)); } catch { resolve(null); } },
        onerror: () => resolve(null),
        ontimeout: () => resolve(null),
      });
    });
  }

  // 浅合并（后者覆盖前者）。用于：内置 ← 本地 ← 远程
  function mergeBanks(...banks) {
    const out = {};
    for (const b of banks) {
      if (b && typeof b === "object") {
        for (const k of Object.keys(b)) out[k] = b[k];
      }
    }
    return out;
  }

  /** ================= UI 面板 ================= */
  const panel = (() => {
    const box = document.createElement("div");
    Object.assign(box.style, {
      position: "fixed", right: "16px", bottom: "16px", zIndex: 999999,
      width: "340px", maxHeight: "62vh", overflow: "auto",
      background: "rgba(24,24,27,.95)", color: "#fff",
      borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,.35)",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      fontSize: "13px", lineHeight: 1.5, padding: "12px 12px 8px",
      backdropFilter: "blur(6px)",
    });
    box.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <strong>答题测试助手</strong>
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
          <input id="autoToggle" type="checkbox" style="accent-color:#22c55e"> 自动答题
        </label>
      </div>
      <div style="margin-top:6px;display:flex;gap:8px;align-items:center;opacity:.85">
        <div>模糊阈值</div>
        <code id="fzVal" style="background:#111827;border:1px solid #27272a;border-radius:6px;padding:1px 6px;">${PREFS.fuzzyThreshold}</code>
      </div>
      <div id="stats" style="margin-top:8px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        <div style="background:#18181b;border:1px solid #27272a;border-radius:8px;padding:8px;">
          <div style="opacity:.7">命中</div><div id="hitCount" style="font-weight:700">0</div>
        </div>
        <div style="background:#18181b;border:1px solid #27272a;border-radius:8px;padding:8px;">
          <div style="opacity:.7">未命中</div><div id="missCount" style="font-weight:700">0</div>
        </div>
        <div style="background:#18181b;border:1px solid #27272a;border-radius:8px;padding:8px;">
          <div style="opacity:.7">疑似不一致</div><div id="diffCount" style="font-weight:700">0</div>
        </div>
      </div>
      <details style="margin-top:8px;">
        <summary style="cursor:pointer;opacity:.9">详情 / 命中方式</summary>
        <div id="detailList" style="margin-top:6px;display:flex;flex-direction:column;gap:6px;"></div>
      </details>
    `;
    document.documentElement.appendChild(box);
    const hitCount = box.querySelector("#hitCount");
    const missCount = box.querySelector("#missCount");
    const diffCount = box.querySelector("#diffCount");
    const detailList = box.querySelector("#detailList");
    const autoToggle = box.querySelector("#autoToggle");
    const fzVal = box.querySelector("#fzVal");

    autoToggle.checked = !!PREFS.autoAnswer;
    autoToggle.addEventListener("change", () => {
      PREFS.autoAnswer = autoToggle.checked;
      GM_setValue("autoAnswer", PREFS.autoAnswer);
    });

    return {
      addDetail(type, stem, msg) {
        const tagColor = type === "miss" ? "#fb7185" : type === "diff" ? "#f59e0b" : "#22c55e";
        const item = document.createElement("div");
        item.style.cssText = "border:1px solid #27272a;border-radius:8px;padding:8px;background:#111827;";
        item.innerHTML = `
          <div style="display:flex;gap:8px;align-items:center;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:9999px;background:${tagColor}"></span>
            <div style="font-weight:600;flex:1;word-break:break-all">${stem}</div>
          </div>
          <div style="opacity:.9;margin-top:6px;word-break:break-all">${msg}</div>
        `;
        detailList.appendChild(item);
      },
      setStats({ hit, miss, diff }) {
        hitCount.textContent = String(hit);
        missCount.textContent = String(miss);
        diffCount.textContent = String(diff);
      },
      refreshFuzzy() { fzVal.textContent = String(PREFS.fuzzyThreshold); },
      isAuto() { return !!PREFS.autoAnswer; },
    };
  })();

  /** ================= 菜单（导入/导出/阈值/调试/内置题库） ================= */
  GM_registerMenuCommand("导入题库（JSON）", async () => {
    const text = prompt("请粘贴题库 JSON：\n格式：{ \"规范化题干\": {\"type\":\"single|multi\",\"answer\":\"A\"|[\"A\",\"C\"] }, ... }", "");
    if (!text) return;
    try {
      const data = JSON.parse(text);
      setBank(data);
      alert("题库已导入，共 " + Object.keys(data).length + " 条。");
    } catch (e) { alert("JSON 解析失败：" + e.message); }
  });

  GM_registerMenuCommand("导出题库（本地存储）", () => {
    const data = getBank();
    const text = JSON.stringify(data, null, 2);
    navigator.clipboard?.writeText(text);
    alert("已复制到剪贴板（共 " + Object.keys(data).length + " 条）。");
  });

  GM_registerMenuCommand("设置题库 URL（远程）", () => {
    const cur = PREFS.bankURL;
    const url = prompt("填写题库 JSON 的直链 URL（留空取消）：", cur || "");
    if (url != null) {
      PREFS.bankURL = url.trim();
      GM_setValue("qaBankURL", PREFS.bankURL);
      alert("已保存题库 URL。刷新页面以尝试拉取。");
    }
  });

  GM_registerMenuCommand("启/停自动答题", () => {
    PREFS.autoAnswer = !PREFS.autoAnswer;
    GM_setValue("autoAnswer", PREFS.autoAnswer);
    alert("自动答题已" + (PREFS.autoAnswer ? "启用" : "停用"));
    location.reload();
  });

  GM_registerMenuCommand("设置模糊阈值 ", () => {
    const v = prompt("请输入模糊匹配阈值（建议 0.6~0.9）：", String(PREFS.fuzzyThreshold));
    if (v == null) return;
    const num = Number(v);
    if (isNaN(num) || num <= 0 || num >= 1) { alert("无效的阈值"); return; }
    PREFS.fuzzyThreshold = num;
    GM_setValue("fuzzyThreshold", num);
    panel.refreshFuzzy();
    alert("已设置阈值为 " + num);
  });

  GM_registerMenuCommand("调试：复制本页规范化题干", () => {
    const singles = extractSingleQuestionBlocks().map(parseSingleBlock);
    const multis  = extractMultiQuestionBlocks().map(parseMultiBlock);
    const all = [...singles, ...multis].map(x => x.normStem).filter(Boolean);
    const text = all.join("\n");
    navigator.clipboard?.writeText(text);
    alert("已复制本页规范化题干，共 " + all.length + " 条。");
  });

  // —— 内置题库管理 ——
  GM_registerMenuCommand("用内置题库覆盖当前题库", () => {
    setBank(BUILTIN_BANK);
    alert("已用内置题库覆盖本地存储。条目数：" + Object.keys(BUILTIN_BANK).length);
  });

  GM_registerMenuCommand("导出内置题库模板", () => {
    const text = JSON.stringify(BUILTIN_BANK, null, 2);
    navigator.clipboard?.writeText(text);
    alert("已复制内置题库模板到剪贴板。");
  });

  /** ================= 匹配器（含模糊） ================= */
  function tokenizeForFuzzy(s) {
    // 轻量分词：以常见虚词切分，去重（长度>1）
    return Array.from(new Set(
      s.split(/(的|是|与|和|及|于|对|在|为|把|下列|关于|哪些|那些|以下|正确|说法|内容|必须|基本|方略|治藏|新时代)/)
       .filter(x => x && x.length > 1)
    ));
  }

  function findRecordForStem(normStem, bank, threshold = 0.5) {
    if (bank[normStem]) return { key: normStem, record: bank[normStem], reason: "exact" };

    const keys = Object.keys(bank);
    if (!keys.length) return null;

    // 1) 互为包含（优先）：短键命中长题干，或反之
    let hit = keys.find(k => k && (k.includes(normStem) || normStem.includes(k)));
    if (hit) return { key: hit, record: bank[hit], reason: "inclusive" };

    // 2) Jaccard 相似度
    const stemTokens = tokenizeForFuzzy(normStem);
    let best = null, bestScore = 0;
    for (const k of keys) {
      const kt = tokenizeForFuzzy(k);
      const inter = kt.filter(t => stemTokens.includes(t)).length;
      const uni = new Set([...kt, ...stemTokens]).size || 1;
      const jacc = inter / uni;
      if (jacc > bestScore) { bestScore = jacc; best = k; }
    }
    if (best && bestScore >= threshold) {
      return { key: best, record: bank[best], reason: "fuzzy:"+bestScore.toFixed(2) };
    }
    return null;
  }

  /** ================= DOM 选择/点击 ================= */
  function pickSingleChoice(container, answerLetter) {
    const input = container.querySelector(
      'input.el-radio__original[type="radio"][value="' + answerLetter + '"]'
    );
    if (!input) return false;
    const clickTarget = input.closest("label") || input;
    clickTarget.scrollIntoView({ block: "center", behavior: "instant" });
    // 原生 click 更稳（配合框架 v-model）
    try { input.click(); } catch { clickTarget.click(); }
    fireEvents(clickTarget);
    (clickTarget.closest(".el-radio") || clickTarget).style.outline = "2px solid #22c55e";
    return true;
  }

  // 多选逐点点击 + 小延时，避免只保留最后一个勾选
  async function pickMultiChoices(container, answerLetters) {
    const allInputs = Array.from(
      container.querySelectorAll('input.el-checkbox__original[type="checkbox"]')
    );
    if (!allInputs.length) return false;

    let changed = false;
    const need = new Set((answerLetters || []).map(x => (x || "").toUpperCase()));

    const toCheck   = allInputs.filter(i => need.has((i.value || "").toUpperCase()) && !i.checked);
    const toUncheck = allInputs.filter(i => !need.has((i.value || "").toUpperCase()) &&  i.checked);

    const clickInput = async (inp, highlight) => {
      const label = inp.closest("label") || inp;
      try { inp.click(); } catch { label.click(); }
      if (highlight) (label.closest(".el-checkbox") || label).style.outline = "2px solid #22c55e";
      await sleep(50); // 40~100ms 可调
    };

    // 先勾选需要的，再取消多余的
    for (const i of toCheck)   { await clickInput(i, true);  changed = true; }
    for (const i of toUncheck) { await clickInput(i, false); changed = true; }

    return changed;
  }

  /** ================= 解析器 ================= */
  function extractSingleQuestionBlocks(root = document) {
    const blocks = Array.from(root.querySelectorAll(".item-view"));
    return blocks.filter((el) => /【\s*单选\s*】/.test(el.textContent || ""));
  }

  function parseSingleBlock(block) {
    const stemNode = block.querySelector(".w-full");
    const rawStem = stemNode ? stemNode.textContent.trim() : "";
    const optionLabels = Array.from(block.querySelectorAll("label.el-radio"));
    const options = {};
    optionLabels.forEach((lab) => {
      const input = lab.querySelector('input.el-radio__original[type="radio"]');
      if (!input) return;
      const letter = (input.value || "").trim();
      const text = lab.textContent.replace(/[A-Z]\.\s*/, "").trim();
      if (letter) options[letter] = text;
    });
    return { rawStem, normStem: normalizeStem(rawStem), options, block };
  }

  function extractMultiQuestionBlocks(root = document) {
    const blocks = Array.from(root.querySelectorAll(".item-view"));
    return blocks.filter((el) => /【\s*多选\s*】/.test(el.textContent || ""));
  }

  function parseMultiBlock(block) {
    const stemNode = block.querySelector(".w-full");
    const rawStem = stemNode ? stemNode.textContent.trim() : "";
    const optionLabels = Array.from(block.querySelectorAll("label.el-checkbox"));
    const options = {};
    optionLabels.forEach((lab) => {
      const input = lab.querySelector('input.el-checkbox__original[type="checkbox"]');
      if (!input) return;
      const letter = (input.value || "").trim();
      const text = lab.textContent.replace(/[A-Z]\.\s*/, "").trim();
      if (letter) options[letter] = text;
    });
    return { rawStem, normStem: normalizeStem(rawStem), options, block };
  }

  /** ================= 主流程 ================= */
  (async function main() {
    await sleep(300);

    // 题库合并顺序：内置 ← 本地存储 ← 远程（远程优先级最高）
    const local = getBank();
    const remote = await fetchRemoteBank();
    let bank = mergeBanks(BUILTIN_BANK, local, (remote && typeof remote === "object") ? remote : null);

    let hit = 0, miss = 0, diff = 0;

    // 单选题
    for (const b of extractSingleQuestionBlocks()) {
      const parsed = parseSingleBlock(b);
      if (!parsed.normStem) continue;

      const found = findRecordForStem(parsed.normStem, bank, PREFS.fuzzyThreshold);
      if (!found) {
        miss++; panel.addDetail("miss", parsed.rawStem, "未在题库中找到（单选）。");
        b.style.outline = "2px dashed #fb7185";
        continue;
      }

      const { record, key, reason } = found;
      if (!record || record.type !== "single") {
        diff++; panel.addDetail("diff", parsed.rawStem, `题库键「${key}」类型为「${record && record.type}」，页面识别为「单选」。`);
        b.style.outline = "2px dashed #f59e0b";
        continue;
      }

      const ans = String(record.answer || "").toUpperCase();
      if (!/^[A-Z]$/.test(ans) || !(ans in parsed.options)) {
        diff++; panel.addDetail("diff", parsed.rawStem, `题库键「${key}」答案「${ans}」无效或页面不存在该选项。`);
        b.style.outline = "2px dashed #f59e0b";
        continue;
      }

      const ok = panel.isAuto() ? pickSingleChoice(b, ans) : false;
      hit++;
      if (!ok) panel.addDetail("hit", parsed.rawStem, `命中（${reason}，键：「${key}」），但未能自动点击或被框架拦截。`);
      else panel.addDetail("hit", parsed.rawStem, `命中（${reason}，键：「${key}」），答案「${ans}」。`);
    }

    // 多选题（注意 await）
    for (const b of extractMultiQuestionBlocks()) {
      const parsed = parseMultiBlock(b);
      if (!parsed.normStem) continue;

      const found = findRecordForStem(parsed.normStem, bank, PREFS.fuzzyThreshold);
      if (!found) {
        miss++; panel.addDetail("miss", parsed.rawStem, "未在题库中找到（多选）。");
        b.style.outline = "2px dashed #fb7185";
        continue;
      }

      const { record, key, reason } = found;
      if (!record || record.type !== "multi") {
        diff++; panel.addDetail("diff", parsed.rawStem, `题库键「${key}」类型为「${record && record.type}」，页面识别为「多选」。`);
        b.style.outline = "2px dashed #f59e0b";
        continue;
      }

      let ansArr = Array.isArray(record.answer) ? record.answer.map(s => String(s).toUpperCase()) : [];
      ansArr = Array.from(new Set(ansArr)).sort();
      if (!ansArr.length) {
        diff++; panel.addDetail("diff", parsed.rawStem, `题库键「${key}」答案数组为空或无效。`);
        b.style.outline = "2px dashed #f59e0b";
        continue;
      }

      const missing = ansArr.filter(x => !(x in parsed.options));
      if (missing.length) {
        diff++; panel.addDetail("diff", parsed.rawStem, `题库键「${key}」中以下选项在页面不存在：${missing.join("、")}。`);
        b.style.outline = "2px dashed #f59e0b";
        continue;
      }

      let ok = false;
      if (panel.isAuto()) ok = await pickMultiChoices(b, ansArr); // ★ 逐点点击 + 延时

      hit++;
      if (panel.isAuto() && !ok) {
        panel.addDetail("hit", parsed.rawStem, `命中（${reason}，键：「${key}」），应选：${ansArr.join("、")}，但未能切换勾选。`);
      } else {
        panel.addDetail("hit", parsed.rawStem, `命中（${reason}，键：「${key}」），应选：${ansArr.join("、")}。`);
      }
    }

    panel.setStats({ hit, miss, diff });
  })();

  /** ================= 可选“学习模式”（默认关闭，防误写） =================
   * 去掉注释后，脚本会根据你手动选择回写到【本地存储题库】（不会改动内置题库）。
   */
  
  document.addEventListener("change", (e) => {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;
    const isRadio = input.type === "radio" && input.classList.contains("el-radio__original");
    const isCheckbox = input.type === "checkbox" && input.classList.contains("el-checkbox__original");
    if (!isRadio && !isCheckbox) return;

    const block = input.closest(".item-view");
    if (!block) return;

    if (/【\s*多选\s*】/.test(block.textContent || "")) {
      const { rawStem, normStem } = parseMultiBlock(block);
      const checked = Array.from(block.querySelectorAll('input.el-checkbox__original[type="checkbox"]:checked'))
        .map(i => (i.value || "").toUpperCase()).filter(Boolean).sort();
      const bank = getBank();
      bank[normStem] = { type: "multi", answer: checked };
      setBank(bank);
      panel.addDetail("hit", rawStem, `已学习（多选）答案：[${checked.join(", ")}]。`);
    } else {
      const { rawStem, normStem } = parseSingleBlock(block);
      const letter = (input.value || "").toUpperCase();
      const bank = getBank();
      bank[normStem] = { type: "single", answer: letter };
      setBank(bank);
      panel.addDetail("hit", rawStem, `已学习（单选）答案「${letter}」。`);
    }
  });
  
})();