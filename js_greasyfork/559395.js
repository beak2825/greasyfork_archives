// ==UserScript==
// @name         猜百科助手
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  猜百科游戏辅助工具，智能词组推断，可调节间隔
// @author       AI Generated
// @match        https://xiaoce.fun/*
// @icon         https://b68res.daai.fun/xiaoce/icon_2.png
// @grant        none
// @run-at       document-idle
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/559395/%E7%8C%9C%E7%99%BE%E7%A7%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559395/%E7%8C%9C%E7%99%BE%E7%A7%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 1. 配置 =====
    const CONFIG = {
        DEBUG_MODE: false,
        PHASE1_CHAR_COUNT: 30,
        MIN_BLACK_WARNING: 10,
        DEFAULT_DELAY_MS: 1000,
        MIN_DELAY_MS: 100,
        MAX_DELAY_MS: 2000,
        INFER_MAX_NEW_CHARS_PER_HIT: 12,
        INFER_MAX_QUEUE_SIZE: 120,
        ENUMERATION_ENABLED: true,
        STORAGE_KEY_POSITION: 'baike-helper-position',
        STORAGE_KEY_COLLAPSED: 'baike-helper-collapsed',
        STORAGE_KEY_DELAY: 'baike-helper-delay'
    };

    const NATIVE_INPUT_SETTER = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
    ).set;

    // ===== 2. 数据 =====
    const highFreqChars = [
        '的', '一', '是', '在', '不', '了', '有', '和', '人', '这',
        '中', '大', '为', '上', '个', '国', '我', '以', '要', '他',
        '时', '来', '用', '们', '生', '到', '作', '地', '于', '出',
        '就', '分', '对', '成', '会', '可', '主', '发', '年', '动',
        '同', '工', '也', '能', '下', '过', '子', '说', '产', '种',
        '面', '而', '方', '后', '多', '定', '行', '学', '法', '所',
        '民', '得', '经', '十', '三', '之', '进', '着', '等', '部',
        '度', '家', '电', '力', '里', '如', '水', '化', '高', '自',
        '二', '理', '起', '小', '物', '现', '实', '加', '量', '都',
        '两', '体', '制', '机', '当', '使', '点', '从', '业', '本'
    ];

    const wordBank = {
        '国': ['中国', '美国', '英国', '德国', '法国', '韩国', '泰国', '俄国', '国家', '国民', '国内', '国外', '国际', '全国', '我国', '各国', '外国', '国王', '国度', '国籍', '国企', '爱国', '建国', '民国', '帝国'],
        '人': ['个人', '人们', '人民', '人类', '人工', '人生', '人口', '工人', '他人', '人才', '人员', '人物', '人格', '人性', '军人', '商人', '名人', '真人'],
        '中': ['中国', '中心', '中间', '中央', '其中', '集中', '中文', '中学', '中级', '中部', '中等', '中期', '中年', '中外', '中午', '中式', '高中', '初中'],
        '学': ['学习', '学校', '学生', '大学', '小学', '中学', '科学', '医学', '文学', '数学', '化学', '学者', '学历', '学位', '学科', '学期', '教学', '入学'],
        '时': ['时间', '时候', '时代', '小时', '当时', '同时', '时期', '时光', '按时', '时尚', '时速', '及时', '准时', '临时', '时常', '时刻', '古时', '时事'],
        '生': ['学生', '生活', '生产', '生命', '人生', '生长', '生态', '生日', '生物', '医生', '先生', '产生', '发生', '生成', '生意', '卫生', '生气', '生育'],
        '大': ['大学', '大家', '强大', '重大', '巨大', '长大', '大小', '大会', '大量', '大多', '大型', '大陆', '大约', '大使', '大夫', '大厦', '大赛', '大力'],
        '年': ['今年', '去年', '明年', '年代', '年度', '年级', '年轻', '年龄', '年月', '童年', '青年', '中年', '老年', '过年', '新年', '往年', '年初', '年终'],
        '地': ['土地', '地方', '地区', '地球', '各地', '当地', '本地', '外地', '内地', '地理', '地位', '基地', '场地', '地址', '地点', '地图', '地下', '天地'],
        '作': ['工作', '作品', '作用', '作为', '制作', '写作', '创作', '操作', '合作', '作者', '作业', '动作', '作文', '杰作', '佳作', '协作', '著作', '作战'],
        '家': ['国家', '大家', '家庭', '专家', '学家', '作家', '画家', '乐家', '术家', '在家', '回家', '家人', '家乡', '家族', '家属', '家长', '皇家', '全家'],
        '会': ['社会', '大会', '会议', '开会', '学会', '都会', '机会', '会员', '会场', '教会', '协会', '公会', '会见', '会计', '会话', '会合', '聚会', '晚会'],
        '民': ['人民', '民族', '国民', '农民', '居民', '市民', '民间', '民主', '民众', '民生', '民意', '民用', '公民', '民警', '民歌', '民俗', '军民', '黎民'],
        '发': ['发展', '发现', '开发', '发生', '发布', '发表', '发达', '发行', '发明', '出发', '发射', '发动', '发言', '发起', '发挥', '发送', '头发', '分发'],
        '经': ['经济', '经过', '已经', '经验', '经营', '经典', '经常', '神经', '经理', '经历', '经费', '经由', '念经', '取经', '经受', '经手', '经销', '经纪'],
        '理': ['道理', '管理', '经理', '理解', '处理', '理论', '物理', '理想', '心理', '地理', '修理', '理由', '整理', '料理', '理财', '理性', '合理', '真理'],
        '法': ['方法', '办法', '法律', '法国', '语法', '法院', '法定', '法则', '用法', '宪法', '手法', '书法', '学法', '做法', '法制', '法官', '法师', '无法'],
        '他': ['他们', '他人', '他乡', '他日', '其他', '他者', '利他'],
        '她': ['她们', '她的', '她家'],
        '它': ['它们', '它的'],
        '们': ['我们', '他们', '她们', '它们', '人们'],
        '和': ['和平', '和谐', '温和', '平和', '祥和', '柔和', '总和', '缓和'],
        '文': ['文化', '文学', '文章', '文字', '文明', '文件', '文艺', '语文', '中文', '英文', '天文', '人文', '作文', '文物', '文献', '文本', '散文', '论文'],
        '市': ['城市', '市场', '都市', '市民', '市区', '市长', '集市', '市政', '股市', '市面', '夜市', '市价', '闹市', '市井', '市郊'],
        '业': ['企业', '工业', '农业', '商业', '产业', '事业', '行业', '职业', '作业', '毕业', '就业', '失业', '创业', '专业', '业务', '从业', '物业', '林业'],
        '问': ['问题', '提问', '询问', '访问', '学问', '请问', '问答', '问候', '慰问', '发问', '问讯', '问诊', '问道', '问好', '质问', '追问', '盘问', '审问'],
        '新': ['新闻', '新的', '创新', '新兴', '新年', '新型', '最新', '重新', '全新', '新生', '新人', '新鲜', '新颖', '崭新', '焕然一新'],
        '而': ['而且', '而已', '反而', '从而', '进而', '而后', '然而', '而言', '而今'],
        '到': ['到达', '得到', '看到', '收到', '遇到', '做到', '想到', '来到', '回到', '找到', '买到', '听到', '感到', '周到', '迟到', '报到'],
        '了': ['为了', '除了', '到了', '过了', '完了', '不了', '得了'],
        '多': ['很多', '许多', '多少', '多数', '多样', '多余', '多种', '众多', '诸多', '多年', '多次', '多半', '多元', '多边', '多方', '好多', '最多'],
        '上': ['上海', '马上', '上午', '晚上', '早上', '向上', '上面', '史上', '桌上', '以上', '加上', '路上', '网上', '世上', '实上', '本上'],
        '下': ['以下', '如下', '天下', '一下', '下来', '地下', '下午', '当下', '上下', '底下', '脚下', '接下', '留下', '放下', '降下', '坐下'],
        '后': ['之后', '然后', '以后', '最后', '后来', '背后', '后面', '前后', '今后', '后代', '后期', '幕后', '落后', '后果', '而后', '后悔'],
        '前': ['之前', '以前', '目前', '从前', '面前', '眼前', '前面', '当前', '前后', '此前', '前进', '向前', '前方', '前期', '提前', '前景', '空前'],
        '外': ['国外', '海外', '国内外', '室外', '户外', '中外', '外国', '外交', '外地', '以外', '之外', '外面', '外界', '外部', '外观', '例外', '意外'],
        '内': ['国内', '室内', '以内', '之内', '境内', '在内', '内部', '内容', '体内', '内心', '内地', '内战', '市内', '内在', '内涵', '海内', '范围内'],
        '形': ['形式', '形成', '形状', '形象', '形态', '形容', '图形', '地形', '情形', '形体', '外形', '造形', '变形', '形势', '形迹', '无形', '有形', '圆形'],
        '应': ['应该', '应用', '应对', '反应', '适应', '响应', '应急', '应变', '应付', '应答', '应聘', '应邀', '呼应', '感应', '效应', '应验', '应战', '对应'],
        '通': ['通过', '通常', '通知', '交通', '通信', '通道', '普通', '通用', '沟通', '通讯', '流通', '通行', '通话', '畅通', '通风', '通俗', '精通', '贯通'],
        '知': ['知道', '知识', '通知', '认知', '知名', '知觉', '告知', '知己', '知音', '知足', '知情', '知晓', '知悉', '知心', '知遇', '无知', '求知', '周知'],
        '情': ['情况', '感情', '情绪', '爱情', '热情', '情感', '表情', '心情', '情节', '情形', '情理', '情景', '情报', '事情', '情意', '深情', '情趣', '友情'],
        '性': ['性格', '性质', '特性', '属性', '个性', '性能', '理性', '感性', '弹性', '能性', '要性', '活性', '性别', '人性', '天性', '本性'],
        '解': ['解决', '理解', '了解', '解释', '解答', '解放', '分解', '解除', '解开', '解说', '解读', '解析', '解救', '解散', '解脱', '见解', '误解', '化解'],
        '样': ['样子', '一样', '这样', '那样', '怎样', '同样', '样式', '样本', '榜样', '模样', '各样', '多样', '样品', '花样', '图样', '照样', '像样', '异样'],
        '间': ['时间', '空间', '之间', '中间', '期间', '房间', '民间', '人间', '瞬间', '间接', '车间', '世间', '夜间', '午间', '间隔', '区间', '间断', '离间'],
        '思': ['思想', '思考', '思维', '意思', '思念', '思路', '反思', '沉思', '思索', '构思', '心思', '思潮', '深思', '思绪', '相思', '哀思', '遐思', '三思'],
        '意': ['意思', '意义', '意见', '注意', '同意', '意识', '满意', '愿意', '任意', '意味', '意图', '意愿', '意外', '创意', '诚意', '心意', '用意', '故意'],
        '天': ['天气', '今天', '明天', '昨天', '天空', '天下', '天然', '天才', '天地', '天上', '天生', '每天', '整天', '晴天', '雨天', '天堂', '天真', '天文'],
        '长': ['长期', '成长', '长度', '增长', '长远', '漫长', '长久', '校长', '市长', '部长', '家长', '长大', '长江', '长城', '特长', '长处', '长寿', '延长'],
        '手': ['手机', '手段', '手术', '选手', '对手', '歌手', '高手', '手工', '手法', '动手', '伸手', '握手', '分手', '助手', '亲手', '双手', '随手', '着手'],
        '看': ['看到', '看见', '观看', '看法', '看来', '看起来', '好看', '难看', '看望', '看重', '看中', '看出', '看作', '看待', '察看', '参看', '小看', '看管'],
        '事': ['事情', '事实', '事件', '事物', '事业', '故事', '事故', '军事', '办事', '做事', '从事', '本事', '往事', '心事', '无事', '有事', '事务', '事项'],
        '世': ['世界', '世纪', '世代', '世间', '世人', '世上', '出世', '去世', '在世', '世俗', '世故', '世事', '世态', '入世', '处世', '盛世', '乱世', '世袭'],
        '公': ['公司', '公共', '公开', '公民', '公平', '公正', '公园', '公布', '公路', '公众', '公务', '公益', '办公', '公告', '公主', '公寓', '公认', '公式'],
        '身': ['身体', '身份', '本身', '身边', '自身', '全身', '身心', '身材', '亲身', '身上', '身后', '终身', '出身', '健身', '随身', '身影', '身高', '转身'],
        '重': ['重要', '重大', '重点', '严重', '重新', '重视', '重量', '重复', '体重', '重心', '尊重', '慎重', '沉重', '繁重', '着重', '贵重', '稳重', '隆重'],
        '立': ['建立', '成立', '独立', '立即', '设立', '确立', '站立', '立场', '立法', '树立', '立足', '立刻', '立体', '直立', '创立', '中立', '孤立', '自立'],
        '见': ['看见', '意见', '见面', '常见', '发见', '可见', '少见', '罕见', '偏见', '见解', '主见', '己见', '显见', '再见', '会见', '召见', '目见', '接见'],
        '月': ['月亮', '月份', '每月', '本月', '上月', '下月', '月底', '月初', '岁月', '月光', '月球', '月饼', '蜜月', '月薪', '月经', '满月', '新月', '明月'],
        '教': ['教育', '教学', '教师', '教授', '教练', '教材', '教室', '教导', '宗教', '教训', '教程', '教养', '教科书', '请教', '指教', '管教', '言传身教'],
        '员': ['人员', '成员', '会员', '队员', '党员', '职员', '演员', '学员', '委员', '官员', '员工', '团员', '议员', '船员', '乘员', '社员', '球员', '教员'],
        '明': ['明白', '说明', '证明', '表明', '明显', '明确', '文明', '光明', '聪明', '明天', '明年', '清明', '明星', '发明', '透明', '照明', '明亮', '英明'],
        '利': ['利用', '利益', '胜利', '顺利', '权利', '有利', '便利', '锋利', '利润', '利率', '利害', '利弊', '名利', '私利', '公利', '福利', '盈利', '牟利'],
        '位': ['位置', '地位', '单位', '部位', '座位', '方位', '学位', '岗位', '职位', '定位', '各位', '诸位', '到位', '让位', '高位', '首位', '排位', '床位'],
        '合': ['合作', '结合', '适合', '符合', '综合', '配合', '合理', '合同', '合法', '合适', '联合', '融合', '整合', '合并', '组合', '合格', '合计', '百合'],
        '日': ['日本', '今日', '明日', '昨日', '每日', '日常', '日期', '日子', '日记', '生日', '节日', '假日', '日程', '日益', '日夜', '日后', '往日', '来日'],
        '然': ['自然', '当然', '虽然', '然而', '然后', '突然', '仍然', '居然', '竟然', '必然', '偶然', '显然', '依然', '果然', '忽然', '固然', '天然', '浑然'],
        '代': ['时代', '现代', '代表', '古代', '年代', '世代', '替代', '取代', '一代', '后代', '近代', '当代', '朝代', '迭代', '代价', '代理', '代替', '代号'],
        '强': ['强大', '强调', '增强', '加强', '坚强', '强烈', '勉强', '强化', '顽强', '强制', '强迫', '强度', '倔强', '富强', '强悍', '刚强', '要强', '自强'],
        '实': ['实际', '实现', '实在', '事实', '真实', '实践', '实力', '实施', '确实', '实验', '实质', '实用', '切实', '实体', '实情', '扎实', '老实', '诚实'],
        '现': ['现在', '出现', '发现', '表现', '实现', '体现', '呈现', '展现', '现象', '现实', '现代', '现场', '现金', '现状', '兑现', '涌现', '再现', '浮现'],
        '加': ['加入', '增加', '加强', '参加', '加上', '加工', '加快', '加深', '加速', '加油', '加大', '加以', '附加', '追加', '加剧', '加热', '添加', '加班'],
        '量': ['数量', '质量', '大量', '重量', '能量', '力量', '产量', '含量', '流量', '测量', '衡量', '尽量', '估量', '容量', '音量', '热量', '胆量', '气量'],
        '都': ['首都', '都市', '都会', '成都', '全都', '都是', '大都', '古都', '京都'],
        '体': ['身体', '具体', '整体', '体现', '体系', '主体', '团体', '媒体', '载体', '体制', '体验', '群体', '体育', '体会', '实体', '个体', '物体', '液体'],
        '制': ['制度', '控制', '制作', '制造', '体制', '机制', '限制', '制定', '抑制', '强制', '编制', '制约', '复制', '制止', '管制', '制订', '自制', '研制'],
        '机': ['机会', '手机', '飞机', '机器', '机构', '机制', '机关', '算机', '动机', '机场', '机遇', '机械', '机动', '机密', '机智', '机灵', '有机', '危机'],
        '当': ['当时', '当然', '当前', '应当', '当地', '当代', '相当', '当中', '正当', '担当', '当作', '当成', '充当', '当年', '当初', '当场', '当局', '适当'],
        '使': ['使用', '使得', '即使', '促使', '驱使', '使命', '使者', '大使', '天使', '行使', '出使', '使然', '迫使', '指使', '役使', '支使', '使唤', '使劲'],
        '点': ['一点', '特点', '重点', '观点', '地点', '起点', '优点', '缺点', '要点', '热点', '焦点', '节点', '终点', '基点', '弱点', '盲点', '疑点', '据点'],
        '从': ['从事', '从而', '从来', '从此', '从前', '从中', '服从', '跟从', '顺从', '遵从', '自从', '从容', '从头', '从小', '从军', '从业', '盲从', '听从'],
        '本': ['基本', '本身', '根本', '本来', '本质', '日本', '资本', '本地', '版本', '成本', '文本', '剧本', '样本', '本人', '本能', '本土', '原本', '本科']
    };

    const additionalChars = [
        '天', '长', '手', '老', '看', '义', '今', '只', '名', '总', '先', '东', '事', '数', '世', '公', '已', '身',
        '立', '重', '见', '月', '教', '员', '问', '明', '利', '位', '合', '日', '新', '然', '己', '路', '外', '比', '形',
        '打', '儿', '统', '最', '女', '特', '元', '率', '应', '每', '界', '直', '取', '样', '间', '通', '知', '社', '思', '何',
        '内', '意', '情', '党', '性', '九', '代', '强', '记', '真', '北', '据', '决', '品', '保', '关', '区', '南', '解', '政',
        '海', '表', '反', '领', '全', '几', '第', '些', '原', '告', '结', '实', '况', '相', '持', '无', '感', '单', '受', '王',
        '流', '想', '向', '五', '军', '门', '太', '边', '深', '须', '走', '议', '达', '传', '任', '石', '识', '条',
        '白', '话', '争', '整', '导', '集', '风', '院', '色', '极', '求', '存', '斯', '史', '改', '消', '容', '切', '非', '满',
        '至', '格', '影', '认', '准', '红', '千', '快', '由', '变', '西', '拉', '示', '建', '空', '克', '厂', '光', '步', '件',
        '术', '证', '段', '注', '眼', '林', '各', '育', '便', '圆', '局', '布', '调', '干', '亲', '构', '亚', '革', '收', '美',
        '质', '素', '常', '称', '却', '往', '难', '交', '织', '精', '值', '确', '指', '历', '写', '让', '计', '效',
        '验', '责', '志', '观', '除', '清', '依', '未', '置', '费', '阳', '根', '景', '节', '密', '音', '师', '运', '专', '资',
        '式', '器', '基', '族', '维', '司', '土', '断', '济', '华', '图', '青', '江', '则', '备', '木', '城', '连', '温', '题',
        '八', '热', '办', '远', '造', '算', '选', '听', '压', '曲', '字', '复', '标', '层', '展', '待', '序', '获',
        '德', '究', '差', '细', '易', '属', '装', '似', '速', '答', '略', '够', '规', '响', '推', '止', '武',
        '联', '众', '劳', '练', '降', '养', '余', '击', '田', '客', '富', '黄', '湖', '若', '环',
        '毛', '额', '输', '艺', '州', '料', '护', '病', '油', '纪', '康', '脑', '章', '价', '显', '鲜', '足', '居', '供',
        '科', '积', '善', '怀', '紧', '村', '良', '罗', '船', '省', '投', '洋', '英', '短', '败', '群', '房',
        '急', '独', '限', '湾', '危', '皮', '喜', '希', '兵', '均', '亡', '射', '吸', '陈', '程', '宣', '母', '买', '李',
        '久', '左', '右', '星', '普', '血', '职', '益', '营', '台', '纸', '呢', '背', '检', '药', '宋', '香', '弟', '唐',
        '夫', '婚', '承', '孩', '录', '怎', '帝', '找', '扩', '股', '握', '早', '乐', '班', '杀', '犯', '判',
        '牛', '失', '担', '低', '货', '婆', '讲', '您', '牙', '旧', '奇', '鱼', '察', '街', '友', '古', '哪', '评', '宝',
        '园', '厅', '乡', '净', '献', '毫', '弱', '户', '防', '损', '著', '底', '厚', '仅', '破', '佛', '黑',
        '央', '势', '句', '角', '针', '兴', '爱', '云', '死', '脚', '亿', '令', '植', '六', '春', '跟', '欢', '束', '夜',
        '兰', '罪', '烈', '静', '境', '测', '姓', '银', '孙', '草', '摆', '球', '诉', '财', '械', '散', '笔', '君',
        '杂', '挥', '福', '采', '杨', '印'
    ];

    // ===== 3. 状态 =====
    let state = {
        isRunning: false,
        guessedChars: new Set(),
        correctChars: new Set(),
        wrongChars: new Set(),
        currentPhase: 1,
        priorityQueue: [],
        prioritySet: new Set(),
        commonIndex: 0,
        enumIndex: 0,
        inferBatchTotal: 0,
        inferBatchProcessed: 0,
        startTime: null,
        delayMs: CONFIG.DEFAULT_DELAY_MS,
        totalGuesses: 0,
        isCollapsed: false,
        timerInterval: null
    };

    // DOM 缓存
    let cachedInput = null;
    let cachedButton = null;
    let cachedBlackCount = null;

    // ===== 4. 工具函数 =====
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function log(...args) {
        if (CONFIG.DEBUG_MODE) console.log('[猜百科助手]', ...args);
    }

    function formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // ===== 5. DOM 操作 =====
    function findElement(selectorArray) {
        for (const selector of selectorArray) {
            if (selector.includes(':contains')) {
                const match = selector.match(/(.+):contains\("(.+)"\)/);
                if (match) {
                    const [, baseSelector, text] = match;
                    for (const el of document.querySelectorAll(baseSelector)) {
                        if (el.textContent.includes(text)) return el;
                    }
                }
            } else {
                const el = document.querySelector(selector);
                if (el) return el;
            }
        }
        return null;
    }

    function getInputElement() {
        if (cachedInput && document.contains(cachedInput)) return cachedInput;
        cachedInput = findElement([
            'input[placeholder*="只输入一个字"]',
            'input[type="text"]',
            'input[placeholder*="输入"]'
        ]);
        return cachedInput;
    }

    function getButtonElement() {
        if (cachedButton && document.contains(cachedButton)) return cachedButton;
        for (const btn of document.querySelectorAll('button')) {
            if (btn.textContent.includes('猜')) {
                cachedButton = btn;
                return btn;
            }
        }
        return null;
    }

    function getBlackBlockCount(forceRefresh = false) {
        if (cachedBlackCount !== null && !forceRefresh) return cachedBlackCount;

        let count = 0;
        for (const div of document.querySelectorAll('div[style*="background-color"]')) {
            const style = div.getAttribute('style') || '';
            if (style.includes('background-color: black') || style.includes('background-color:black')) {
                count++;
            }
        }
        cachedBlackCount = count;
        return count;
    }

    // ===== 6. 存储 =====
    function savePosition(x, y) {
        localStorage.setItem(CONFIG.STORAGE_KEY_POSITION, JSON.stringify({x, y}));
    }

    function loadPosition() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY_POSITION);
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    }

    function saveSettings() {
        localStorage.setItem(CONFIG.STORAGE_KEY_DELAY, state.delayMs.toString());
        localStorage.setItem(CONFIG.STORAGE_KEY_COLLAPSED, state.isCollapsed.toString());
    }

    function loadSettings() {
        try {
            const delay = localStorage.getItem(CONFIG.STORAGE_KEY_DELAY);
            const collapsed = localStorage.getItem(CONFIG.STORAGE_KEY_COLLAPSED);
            if (delay) {
                const val = parseInt(delay);
                state.delayMs = (val >= CONFIG.MIN_DELAY_MS && val <= CONFIG.MAX_DELAY_MS)
                    ? val : CONFIG.DEFAULT_DELAY_MS;
            }
            if (collapsed) state.isCollapsed = collapsed === 'true';
        } catch {}
    }

    // ===== 7. 猜测引擎 =====
    async function clearInputField(input) {
        NATIVE_INPUT_SETTER.call(input, '');
        const event = new Event('input', { bubbles: true, cancelable: true });
        event.simulated = true;
        input.dispatchEvent(event);
    }

    async function setInputValue(input, char) {
        input.focus();
        NATIVE_INPUT_SETTER.call(input, char);

        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        inputEvent.simulated = true;
        Object.defineProperty(inputEvent, 'target', { writable: false, value: input });
        input.dispatchEvent(inputEvent);

        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);

        await sleep(30);
    }

    async function waitForButtonEnabled(button, maxWaitMs = 1000) {
        const startTime = Date.now();
        while (button.disabled && (Date.now() - startTime) < maxWaitMs) {
            await sleep(30);
        }
        return !button.disabled;
    }

    async function submitGuess(button) {
        await waitForButtonEnabled(button, 800);
        button.click();
        await sleep(state.delayMs);
    }

    async function guessChar(char) {
        const input = getInputElement();
        const button = getButtonElement();

        if (!input || !button) {
            console.error('[猜百科助手] 找不到输入框或按钮');
            state.isRunning = false;
            return false;
        }

        const blackCountBefore = getBlackBlockCount(true);

        await clearInputField(input);
        await setInputValue(input, char);

        log(`猜测 "${char}" - 输入框值: "${input.value}", 按钮disabled: ${button.disabled}`);

        await submitGuess(button);
        state.guessedChars.add(char);
        await clearInputField(input);

        const blackCountAfter = getBlackBlockCount(true);
        const isCorrect = blackCountAfter < blackCountBefore;

        if (isCorrect) {
            const guessed = blackCountBefore - blackCountAfter;
            console.log(`[猜百科助手] ✓ 猜对：${char} (黑框: ${blackCountBefore} → ${blackCountAfter}, 猜中${guessed}个)`);
            state.correctChars.add(char);
            updatePriorityQueue(char);
        } else {
            console.log(`[猜百科助手] ✗ 猜错：${char} (黑框不变: ${blackCountBefore})`);
            state.wrongChars.add(char);
        }

        state.totalGuesses++;
        updateProgress();
        return isCorrect;
    }

    function updatePriorityQueue(correctChar) {
        const words = wordBank[correctChar];
        if (!words || words.length === 0) {
            log(`词组推断: "${correctChar}" 不在词库中，跳过`);
            return;
        }

        if (state.priorityQueue.length >= CONFIG.INFER_MAX_QUEUE_SIZE) {
            log(`词组推断: 队列已满 (${state.priorityQueue.length}/${CONFIG.INFER_MAX_QUEUE_SIZE})，跳过`);
            return;
        }

        const scores = new Map();
        for (const word of words) {
            for (const ch of word) {
                if (ch === correctChar) continue;
                const code = ch.charCodeAt(0);
                if (code < 0x4E00 || code > 0x9FFF) continue;
                if (state.guessedChars.has(ch) || state.prioritySet.has(ch)) continue;
                scores.set(ch, (scores.get(ch) || 0) + 1);
            }
        }

        if (scores.size === 0) return;

        const sorted = Array.from(scores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, CONFIG.INFER_MAX_NEW_CHARS_PER_HIT);

        const remainingCapacity = Math.max(0, CONFIG.INFER_MAX_QUEUE_SIZE - state.priorityQueue.length);
        let added = 0;

        for (const [ch] of sorted) {
            if (added >= remainingCapacity) break;
            state.priorityQueue.push(ch);
            state.prioritySet.add(ch);
            added++;
        }

        if (added > 0) {
            state.inferBatchTotal = Math.max(state.inferBatchTotal, state.inferBatchProcessed + state.priorityQueue.length);
            const newChars = sorted.slice(0, added).map(([ch]) => ch).join('');
            console.log(`[猜百科助手] 智能推断: 由"${correctChar}"补全 +${added} 字「${newChars}」(队列剩余 ${state.priorityQueue.length})`);
        }
    }

    function takeNextFromPriorityQueue() {
        while (state.priorityQueue.length > 0) {
            const next = state.priorityQueue.shift();
            state.prioritySet.delete(next);
            if (state.guessedChars.has(next)) continue;

            state.currentPhase = 2;
            if (state.inferBatchTotal === 0) {
                state.inferBatchProcessed = 0;
                state.inferBatchTotal = state.priorityQueue.length + 1;
            } else {
                state.inferBatchTotal = Math.max(state.inferBatchTotal, state.inferBatchProcessed + state.priorityQueue.length + 1);
            }
            state.inferBatchProcessed++;
            return next;
        }

        state.inferBatchTotal = 0;
        state.inferBatchProcessed = 0;
        return null;
    }

    async function autoGuessLoop() {
        state.startTime = Date.now();
        cachedBlackCount = null;

        while (state.isRunning) {
            const currentBlackCount = getBlackBlockCount(true);
            if (currentBlackCount === 0) {
                console.log('[猜百科助手] 🎉 已完成！');
                stopGuessing();
                break;
            }

            let charToGuess = takeNextFromPriorityQueue();

            if (!charToGuess) {
                while (state.commonIndex < highFreqChars.length && state.guessedChars.has(highFreqChars[state.commonIndex])) {
                    state.commonIndex++;
                }
                if (state.commonIndex < highFreqChars.length) {
                    state.currentPhase = 1;
                    charToGuess = highFreqChars[state.commonIndex++];
                }
            }

            if (!charToGuess && CONFIG.ENUMERATION_ENABLED) {
                while (state.enumIndex < additionalChars.length && state.guessedChars.has(additionalChars[state.enumIndex])) {
                    state.enumIndex++;
                }
                if (state.enumIndex < additionalChars.length) {
                    state.currentPhase = 3;
                    charToGuess = additionalChars[state.enumIndex++];
                }
            }

            if (!charToGuess) {
                console.log('[猜百科助手] 所有候选字已尝试完毕');
                stopGuessing();
                break;
            }

            await guessChar(charToGuess);
        }
    }

    // ===== 8. UI 控制 =====
    function startTimer() {
        if (state.timerInterval) clearInterval(state.timerInterval);
        state.timerInterval = setInterval(() => {
            if (state.isRunning && state.startTime) updateTimeDisplay();
        }, 1000);
    }

    function stopTimer() {
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        }
    }

    function updateTimeDisplay() {
        if (!state.startTime) return;
        const timeStr = formatTime(Date.now() - state.startTime);
        const elapsedEl = document.getElementById('elapsed-time');
        const collapsedTimeEl = document.getElementById('collapsed-time');
        if (elapsedEl) elapsedEl.textContent = timeStr;
        if (collapsedTimeEl) collapsedTimeEl.textContent = timeStr;
    }

    function updateDelayDisplay() {
        const delayValue = document.getElementById('delay-value');
        const delaySlider = document.getElementById('delay-slider');
        if (delayValue) delayValue.textContent = (state.delayMs / 1000).toFixed(1) + '秒';
        if (delaySlider) delaySlider.value = state.delayMs;
    }

    function updateProgress() {
        let phaseText = '', progress = 0, total = 1;

        if (state.currentPhase === 1) {
            phaseText = state.commonIndex < CONFIG.PHASE1_CHAR_COUNT ? '快速探测' : '常用字';
            progress = state.commonIndex;
            total = highFreqChars.length;
        } else if (state.currentPhase === 2) {
            phaseText = '词组补全';
            progress = state.inferBatchProcessed;
            total = Math.max(1, state.inferBatchTotal || (state.inferBatchProcessed + state.priorityQueue.length));
        } else if (state.currentPhase === 3) {
            phaseText = '枚举兜底';
            progress = state.enumIndex;
            total = additionalChars.length;
        }

        const phaseEl = document.getElementById('current-phase');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        if (phaseEl) phaseEl.textContent = phaseText;
        if (progressBar) progressBar.style.width = (total > 0 ? (progress / total) * 100 : 0) + '%';
        if (progressText) {
            progressText.textContent = state.currentPhase === 2
                ? `${progress}/${total} (队列剩余 ${state.priorityQueue.length})`
                : `${progress}/${total}`;
        }
    }

    function updateButtonState() {
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        if (state.isRunning) {
            startBtn.style.display = 'none';
            stopBtn.style.display = 'block';
        } else {
            startBtn.style.display = 'block';
            stopBtn.style.display = 'none';
        }
    }

    function makeDraggable(panel, handle) {
        let isDragging = false, offsetX = 0, offsetY = 0;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            handle.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let x = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - panel.offsetWidth));
            let y = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - panel.offsetHeight));
            panel.style.left = x + 'px';
            panel.style.top = y + 'px';
            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                handle.style.cursor = 'grab';
                savePosition(panel.offsetLeft, panel.offsetTop);
            }
        });
    }

    function toggleCollapse() {
        state.isCollapsed = !state.isCollapsed;
        const panel = document.getElementById('auto-guess-panel');
        const content = document.getElementById('panel-content');
        const collapsedView = document.getElementById('collapsed-view');

        if (state.isCollapsed) {
            content.style.display = 'none';
            collapsedView.style.display = 'flex';
            panel.style.minWidth = 'auto';
        } else {
            content.style.display = 'block';
            collapsedView.style.display = 'none';
            panel.style.minWidth = '300px';
        }
        saveSettings();
    }

    function startGuessing() {
        if (state.isRunning) return;

        const input = getInputElement();
        const button = getButtonElement();

        if (!input) {
            alert('找不到输入框！请确保页面已完全加载。');
            return;
        }

        if (!button) {
            alert('找不到提交按钮！请确保页面已完全加载。');
            return;
        }

        const blackCount = getBlackBlockCount(true);
        console.log(`[猜百科助手] 检测到未猜出的字数: ${blackCount}`);

        if (blackCount < CONFIG.MIN_BLACK_WARNING) {
            if (!confirm(`警告：检测到的未猜出字数较少（${blackCount}个）！\n\n是否仍要继续运行？`)) {
                return;
            }
        }

        state.isRunning = true;
        updateButtonState();
        startTimer();
        autoGuessLoop();
    }

    function stopGuessing() {
        state.isRunning = false;
        stopTimer();
        updateButtonState();
    }

    function createControlPanel(savedPosition) {
        const panel = document.createElement('div');
        panel.id = 'auto-guess-panel';
        panel.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: rgba(255, 255, 255, 0.72);
            color: #1d1d1f; border-radius: 16px;
            box-shadow: 0 4px 40px rgba(0, 0, 0, 0.12), 0 0 0 0.5px rgba(0, 0, 0, 0.08);
            z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif;
            font-size: 13px; min-width: 260px; backdrop-filter: blur(40px) saturate(180%);
            -webkit-backdrop-filter: blur(40px) saturate(180%); overflow: hidden;
            -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
        `;

        panel.innerHTML = `
            <div id="panel-header" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;cursor:grab;border-bottom:1px solid rgba(0,0,0,0.06);">
                <div style="display:flex;align-items:center;gap:6px;font-weight:600;font-size:14px;letter-spacing:-0.3px;">
                    <span style="font-size:15px;">🎯</span><span>猜百科助手</span>
                </div>
                <button id="collapse-btn" style="background:rgba(0,0,0,0.05);border:none;color:#86868b;font-size:14px;width:24px;height:24px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;margin-left:12px;">−</button>
            </div>
            <div id="collapsed-view" style="display:none;justify-content:center;padding:10px 14px;cursor:pointer;">
                <span id="collapsed-time" style="font-size:15px;color:#1d1d1f;font-weight:600;font-variant-numeric:tabular-nums;letter-spacing:-0.3px;">00:00</span>
            </div>
            <div id="panel-content" style="padding:14px 16px 16px;">
                <div id="elapsed-time" style="font-size:28px;color:#1d1d1f;font-weight:600;text-align:center;margin-bottom:12px;font-variant-numeric:tabular-nums;letter-spacing:-0.5px;">00:00</div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                    <span id="current-phase" style="font-size:13px;color:#86868b;font-weight:500;">准备中</span>
                    <span id="progress-text" style="font-size:13px;color:#86868b;font-variant-numeric:tabular-nums;">0/0</span>
                </div>
                <div style="margin-bottom:16px;">
                    <div style="height:4px;border-radius:2px;background:rgba(0,0,0,0.06);overflow:hidden;">
                        <div id="progress-bar" style="height:100%;width:0;background:linear-gradient(90deg,#007aff,#5ac8fa);border-radius:2px;transition:width 0.3s ease;"></div>
                    </div>
                </div>
                <div style="margin-bottom:16px;background:rgba(0,0,0,0.03);border-radius:10px;padding:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <span style="color:#1d1d1f;font-size:13px;font-weight:500;">间隔</span>
                        <span id="delay-value" style="color:#007aff;font-size:13px;font-weight:600;">${(state.delayMs / 1000).toFixed(1)}s</span>
                    </div>
                    <input type="range" id="delay-slider" min="100" max="2000" value="${state.delayMs}" step="100" style="width:100%;height:4px;-webkit-appearance:none;background:rgba(0,0,0,0.08);border-radius:2px;outline:none;" />
                </div>
                <div style="display:flex;gap:10px;">
                    <button id="start-btn" style="flex:1;border:none;padding:12px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;background:#007aff;color:white;transition:all 0.15s;">开始</button>
                    <button id="stop-btn" style="flex:1;display:none;border:none;padding:12px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;background:#ff3b30;color:white;transition:all 0.15s;">停止</button>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #auto-guess-panel { image-rendering: -webkit-optimize-contrast; }
            #auto-guess-panel * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
            #auto-guess-panel input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
                background: white; cursor: pointer; box-shadow: 0 0.5px 4px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(0,0,0,0.1);
            }
            #auto-guess-panel button:hover { filter: brightness(1.05); transform: scale(1.02); }
            #auto-guess-panel button:active { transform: scale(0.98); }
            #collapse-btn:hover { background: rgba(0,0,0,0.1) !important; }
            @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                #auto-guess-panel { border: 0.5px solid rgba(0,0,0,0.08); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);

        const header = document.getElementById('panel-header');
        const collapseBtn = document.getElementById('collapse-btn');
        const collapsedView = document.getElementById('collapsed-view');
        const content = document.getElementById('panel-content');
        const delaySlider = document.getElementById('delay-slider');

        const applyCollapseState = () => {
            if (state.isCollapsed) {
                content.style.display = 'none';
                collapsedView.style.display = 'flex';
                panel.style.minWidth = 'auto';
                collapseBtn.textContent = '+';
            } else {
                content.style.display = 'block';
                collapsedView.style.display = 'none';
                panel.style.minWidth = '300px';
                collapseBtn.textContent = '−';
            }
        };

        collapseBtn.addEventListener('click', () => { toggleCollapse(); applyCollapseState(); });
        collapsedView.addEventListener('click', () => { toggleCollapse(); applyCollapseState(); });
        delaySlider.addEventListener('input', (e) => {
            state.delayMs = parseInt(e.target.value, 10);
            updateDelayDisplay();
            saveSettings();
        });

        document.getElementById('start-btn').addEventListener('click', startGuessing);
        document.getElementById('stop-btn').addEventListener('click', stopGuessing);

        if (savedPosition && typeof savedPosition.x === 'number') {
            panel.style.left = savedPosition.x + 'px';
            panel.style.top = savedPosition.y + 'px';
            panel.style.right = 'auto';
        }

        if (header) makeDraggable(panel, header);
        applyCollapseState();
        updateButtonState();
        updateDelayDisplay();
        updateProgress();
    }

    // ===== 9. 初始化 =====
    let initialized = false;

    function init() {
        if (window.location.pathname !== '/baike') {
            const panel = document.getElementById('auto-guess-panel');
            if (panel) panel.remove();
            initialized = false;
            return;
        }

        if (initialized) return;

        console.log('[猜百科助手] 正在初始化...');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        loadSettings();
        const savedPosition = loadPosition();
        const blackCount = getBlackBlockCount(true);
        console.log('[猜百科助手] 初始未猜出的字数:', blackCount);
        createControlPanel(savedPosition);
        console.log('[猜百科助手] v1.2.0 初始化完成');
        initialized = true;
    }

    // 监听 SPA 路由变化
    let lastPath = window.location.pathname;
    const observer = new MutationObserver(() => {
        if (window.location.pathname !== lastPath) {
            lastPath = window.location.pathname;
            init();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 监听浏览器前进后退
    window.addEventListener('popstate', init);

    init();
})();
