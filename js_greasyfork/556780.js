// NexusMods 中文化词典
// 仅包含简单的英文 -> 中文 key/value 映射，不包含任何 DOM 或逻辑代码。
// 结构：window.NEXUS_I18N[语言][页面类型][英文原文] = '中文';

(function (window) {
  'use strict';

  if (!window.NEXUS_I18N) {
    window.NEXUS_I18N = {};
  }

  const LANG = 'zh-CN';

  if (!window.NEXUS_I18N[LANG]) {
    window.NEXUS_I18N[LANG] = {};
  }

  const zhCN = window.NEXUS_I18N[LANG];

  // 公共 UI 词条：在所有页面通用（可以根据需要慢慢补）
  zhCN.public = Object.assign(zhCN.public || {}, {

    'Enter your mods now for a chance to win the trip of a lifetime to Las Vegas. Business class flights, VIP shows, and unforgettable adventures await.': '现在上传你的模组，赢取一生一次的拉斯维加斯之旅。商务舱机票、VIP演出和难忘的冒险等待着你。',
    // 搜索框
    'Search': '搜索',
    'Search mods, games, collections, images & videos': '搜索模组、游戏、合集、图片和视频',
    'Close': '关闭',
    'All content': '所有内容',
    'Users': '用户',
    'Recent Searches': '最近搜索',
    'Clear all': '清除所有',
    'Select': '选择',
    'Move': '移动',
    'Customise your': '自定义你的',
    'search preferences': '搜索设置',

    'Upload': '上传',
    
    'Games': '游戏',
    'All games': '所有游戏',
    'Recently added': '最近添加',
    'My games': '我的游戏',

    "Mods": "模组",
    "All mods": "全部模组",
    "New": "最新发布",
    "Trending": "热门趋势",
    "Most endorsed": "最多认可",
    "Mod updates": "模组更新",
    "Tracked mods": "已关注模组",
    "My stuff": "我的内容",
    "My mods": "我的模组",
    "Mod rewards": "模组奖励",
    "Download history": "下载记录",
    "Upload mod": "上传模组",
    "Modding tutorials": "模组制作教程",
    "Learn from the community with tutorials and guides.": "通过社区提供的教程与指南学习模组制作。",
    "Explore": "发现",
    "Recent activity": "最新动态",
    "Top files": "热门文件",
    "Mod categories": "模组分类",

    "Collections": "合集",
    "All collections": "全部合集",
    "Highest rated": "最高评分",
    "Collections tutorials": "合集教程",
    "Vortex mod manager": "Vortex 模组管理器",
    "The elegant, powerful and open-source mod manager.": "优雅、强大且开源的模组管理器。",
    "Download": "下载",
    "Login to comment": "登录后评论",

    "Media": "媒体",
    "Images": "图片",
    "Latest": "最新",
    "My images": "我的图片",
    "Upload image": "上传图片",
    "Videos": "视频",
    "My videos": "我的视频",
    "Upload video": "上传视频",
    "Supporter images": "支持者专属图片",
    "Upgrade your account to unlock all media content.": "升级您的账户以解锁所有媒体内容。",
    "Upgrade": "升级",

    'Community': '社区',
    'Forums': '论坛',
    'Wiki': '百科',
    'Support authors': "支持作者",
    'News': "新闻",
    'All news': "所有新闻",
    'Site news': '站点新闻',
    'Competitions': '竞赛',
    'Interviews': '采访',

    'Support': '支持',
    'Help': '帮助',
    'Contact': '联系',
    'FAQ': '常见问题',
    'Game guides': '游戏指南',
    'Tutorial': '教程',
    'Tools': '工具',
    'Vortex help': 'Vortex 帮助',
    'API documentation': 'API 文档',
    'Install Vortex': '安装 Vortex',
    'Give feedback': '提供反馈',
    'Share your ideas, discuss them with the community, and cast your vote on feedback provided.': "分享您的想法，与社区讨论，并对提供的反馈进行投票。",
    'Give Feedback': '提供反馈',

    'Upload content': '上传内容',
    'Make mods.': '制作模组，',
    'Earn rewards.': '赚取奖励。',
    'Join our rewards programme to earn cash': '加入我们的奖励计划，赚取现金、',
    'payouts, free premium and more.': '支付、免费高级版和其他更多。',
    'Learn More': '了解更多',
    'Get fast downloads with': '快速下载，使用',
    'Try Premium for free': '免费试用高级版',
    'Start free trial': '开始免费试用',
    'auto-install collections': '自动安装合集',
    'uncapped download speeds': '无限制下载速度',
    'browse ad-free': '去广告',
    'Cash payouts': '现金支付',
    'Free Premium': '免费高级版',

    // 通知
    'Notifications': '通知',
    'See all': '查看全部',
    'Mark all as read': '全部标为已读',
    'Mark as read': '标为已读',
    'Delete notification': '删除通知',

    // 头像侧边栏
    'Member': '普通用户',
    'Go premium': '升级为高级会员',
    'Try premium free': '免费试用高级版',
    'My profile': '我的资料',
    'My collections': '我的合集',
    'My media': '我的媒体',
    'My wallet': '我的钱包',
    'Tracking centre': '关注中心',
    'Account settings': '账户设置',
    'Site preferences': '站点设置',
    'Sign out': '退出登录',

    // 底部导航
    'Statistics': '统计',
    'Careers': '职业',
    'About us': '关于我们',
    'Premium features': '高级功能',

    'Discover': '发现',
    'New mods': '新模组',
    'Popular mods': '热门模组',
    'All images': '所有图片', 
    'API reference': 'API 参考',
    'Feedback': '反馈',
    'Report a bug': '报告漏洞',
    'Add a new report about this mod': '添加关于此模组的新的报告',
    'You have to download this mod before reporting an issue with it': '你必须要先下载这个模组，才能报告关于它的错误',
    ' Make it a private report': '将其设为私人报告',
    'Unban requests': '解禁请求',
    'Manage cookie settings': '管理 Cookie 设置',
    'Contact us': '联系我们',

    'Support Nexus Mods': '支持 Nexus Mods',
    'Go Premium': '升级为高级会员',
    'Search results': '搜索结果',
    // 'Join us on Discord': '加入我们的 Discord',
    // 'Follow us on Twitter': '关注我们的 Twitter',
    // 'Follow us on TikTok': '关注我们的 TikTok',
    // 'Follow us on Twitch': '关注我们的 Twitch',
    // 'Follow us on Youtube': '关注我们的 YouTube',
    // 'Follow us on Instagram': '关注我们的 Instagram',
    // 'We\'re hiring': '我们正在招聘',
    // 'View forum messages': '查看论坛消息',
    // 'Profile image': '个人资料图片',

    'Network stats': '数据统计',
    'Network Stats': '数据统计',
    'Members': '普通用户',
    'Kudos': '点赞',
    'Kudos given': '已点赞',
    'Server info': '服务器信息',
    'Page served in': '加载页面耗时',

    'Copyright ©': '版权所有 ©',
    'Black Tree Gaming Ltd. All rights reserved.': ' Black Tree Gaming Ltd. 所有权利保留。',

    'Terms of Service': '服务条款',
    'Privacy Policy': '隐私政策',

    'Updated': '更新',
    'Popular': '热门',
    'Surprise': '惊喜',

    'All time': '所有时间',
    '24 Hours': '24 小时',
    '7 Days': '7 天',
    '14 Days': '14 天',
    '28 Days': '28 天',
    '1 Year': '1 年',

    'View all': '查看全部',
    'View more': '查看更多',

    'Endorse': '认可',
    'Track': '关注',

    'Trending Mods': '趋势模组',
    'Trending mods': '趋势模组',
    'Get hundreds of curated mods the easy way and': '轻松获取数百个精选模组,',
    'make it one click with premium': '只需一键即可使用高级版',
    'Free trial': '免费试用',
    'More time playing': '更多游戏时间',
    'Unlock 1-click automated collections': '解锁一键自动合集',
    'The fastest way to mod': '最快的方式制作模组',
    'No manual steps required': '无需手动步骤',
    'More time playing your games': '更多游戏时间',
    'Easy install': '轻松安装',
    'Top pick': '最佳选择',
    'Official': '官方',

    'New to modding': '新手上路 ',
    'Start with the': '从',
    'essential starter mods': '必备的入门模组',
    'and helpful tools to begin your journey.': '和有用的工具开始你的旅程。',
    'Dismiss': '忽略',
    'Explore starter mods': '探索入门模组',
    'mods': ' 模组',

    'Buy now': '立即购买',
    'Mod created': '模组创建',
    'Action by:': '操作人：',

    'Home': '首页',
    'Skip to content': '跳到主要内容',
    'Nexus Mods home': 'Nexus Mods 主页',

    // 某个游戏的模组列表页
    'Browse the internet\'s best mods': '浏览互联网上最好的模组',
    'Preview our new app': '预览我们的新应用',
    'Install and organise mods effortlessly with our all-in-one powerful mod manager.': '使用我们的一体化强大模组管理器轻松安装和组织模组。',
    'All new app for collections and mods': '全新的应用，用于合集和模组',
    'Beta now available →': 'Beta 现已可用 →',
    'Beta now available': 'Beta 现已可用',
    'From': '从',
    'To': '到',
    "Endorsements": "认可数",
    "Date Published": "发布日期",
    "Downloads": "下载量",
    "Unique Downloads": "独立下载量",
    "Last Updated": "最后更新",
    "Mod Name": "模组名称",
    "File Size": "文件大小",
    "Last Comment": "最新评论",
    "Desc": "降序",
    "Asc": "升序",
    "20 Items": "20 条",
    "40 Items": "40 条",
    "60 Items": "60 条",
    "80 Items": "80 条",
    'Get more': '获取更多',
    'with Premium': '使用高级版',
    'View more results for mods,': '查看更多模组结果，',
    'collections and media everywhere.': '合集和媒体无处不在。',
    'Standard': '标准',
    'Compact': '紧凑',
    'List': '列表',
    'preference': '设置',

    'Show filters': '显示过滤器',
    'Hide filters': '隐藏过滤器',
    'Clear game filter': '清除游戏筛选',

    'Sort': '排序',
    'Sort results': '排序结果',
    'Time': '时间',
    'Sort direction': '排序方式',
    'Mods per page': '每页模组数量',
    'View more results for mods, collections and media with': '查看更多模组、合集和媒体结果，使用',
    'Display': '显示',
    'View results': '查看结果',
    "Category": "分类",
    "Audio": "音频",
    "Buildings": "建筑",
    "Characters": "角色",
    "Cheats": "作弊",
    "Clothing": "服装",
    "Crafting": "制作",
    "Crops": "作物",
    "Dialogue": "对话",
    "Events": "事件",
    "Expansions": "扩展",
    "Fishing": "钓鱼",
    "Furniture": "家具",
    "Gameplay Mechanics": "游戏机制",
    "Interiors": "室内",
    "Items": "物品",
    "Livestock and Animals": "畜牧与动物",
    "Locations": "地点",
    "Maps": "地图",
    "Miscellaneous": "杂项",
    "Modding Tools": "模组工具",
    "New Characters": "新角色",
    "Pets / Horses": "宠物 / 马",
    "Player": "玩家",
    "Portraits": "肖像",
    "User Interface": "用户界面",
    "Visuals and Graphics": "视觉与图形",
    'Tags': '标签',
    'Includes': '包含',
    'Excludes': '排除',
    'Search parameters': '搜索参数',
    'Title contains': '标题包含',
    'Description contains': '描述包含',
    'Author contains': '作者包含',
    'Uploader contains': '上传者包含',
    'Language support': '语言支持',
    'Hide translations': '隐藏翻译',
    'Content options': '内容选项',
    'Hide adult content': '隐藏成人内容',
    'Show only adult content': '只显示成人内容',
    'Supported by Vortex': '支持 Vortex',
    'Show only updated mods': '只显示更新过的模组',
    'No min': '无限制',
    'No max': '无限制',
    'Total number of downloads, updates every 15 minutes': '总下载量，每 15 分钟更新一次',
    'Views': '浏览量',
    'The best screen archery on the internet': '互联网上最好的游戏摄影作品',
    'Update available': '有更新可用',

    // 某个游戏的合集列表页
    'Install hundreds of mods with the click of a button.': '一键安装数百个模组。',
    'Learn more about collections': '了解更多关于合集',
    'Mod manager for installing collections': '模组管理器用于安装合集',
    'Download Vortex': '下载 Vortex',
    "Game Version": "游戏版本",
    "Most downloaded": "下载最多",
    "Recently listed": "最新上架",
    "Total members who liked this content": "喜欢此内容的用户总数",
    "Total number of downloads": "总下载量",
    "Essentials": "必备",
    "Themed": "主题",
    "Total Overhaul": "全面改造",
    "Vanilla Plus": "原版增强",
    "Wabbajack Mod List": "Wabbajack 模组列表",
    "Included Mods": "包含模组",
    "Browse Mods": "浏览模组",
    "Hide Adult Content": "隐藏成人内容",
    'Install and organise mods and collections effortlessly with our all-in-one powerful mod manager.': '轻松安装和组织模组和合集，使用我们的一体化强大模组管理器。',

    // https://www.nexusmods.com/stardewvalley/mods/1915
    // 模组详情页
    'Unique DLs': '独立下载量',
    'Total DLs': '总下载量',
    'Total views': '总浏览量',
    'Version': '版本',
    'Original File': '原始文件',
    'Add media': '添加媒体',
    'Add images': '添加图片',
    'Link a new video': '添加视频',
    'Vote': '投票',
    'Download:': '下载:',
    'Mod manager': '模组管理器',
    'Manual': '手动',
    'Last updated': '最后更新',
    'Original upload': '原始上传',
    'Created by': '创建者',
    'Uploaded by': '上传者',
    'Virus scan': '病毒扫描',
    'Safe to use': '安全',
    'Tags for this mod': '此模组的标签',
    'Tag this mod': ' 添加标签',
    'View more..': '更多..',
    'View more...': '更多...',
    'View less': '更少',
    'Description': '描述',
    'Files': '文件',
    'Posts': '评论',
    'Logs': '日志',
    'Activity log': '活动日志',
    'Mod image added': '模组图片添加',
    'File added': '文件添加',
    'Mod created': '模组创建',
    'Attribute change': '属性更改',
    'Changelog added': '更新日志添加',
    'Tracked': '已关注',
    'Stats': '统计',
    'About this mod': '关于此模组',
    'Share': '分享',
    'Report Abuse': '报告滥用',
    'Requirements': '要求',
    'This mod does not have any known dependencies other than the base game.': '这个模组除了基础游戏外，没有其他已知的依赖。',
    'Off-site requirements': '离线要求',
    'Mods requiring this file': '需要此文件的模组',
    'Nexus requirements': 'Nexus 要求',
    'Notes': '备注',
    "Permissions and credits": "权限与致谢",
    "Credits and distribution permission": "致谢与分发权限",
    'This author has not specified whether they have used assets from other authors or not': '这个作者没有指定他们是否使用了其他作者的资产。',
    'Please': '请',
    'to find out whether this mod is receiving Donation Points': '来确认这个模组是否赚取捐赠点数',
    'Other user\'s assets': '其他用户资产',
    'All the assets in this file belong to the author, or are from free-to-use modder\'s resources': '此文件中的所有资产属于作者，或来自免费使用的模组作者的资源。',
    'Some assets in this file belong to other authors. You will need to seek permission from': '此文件中的一些资产属于其他作者。你需要从他们那里寻求许可。',
    'Upload permission': '上传权限',
    'You are not allowed to upload this file to other sites under any circumstances': '你不得在任何情况下将此文件上传到其他网站。',
    'You can upload this file to other sites but you must credit me as the creator of the file': '你可以将此文件上传到其他网站，但你必须注明我是文件的创作者。',
    'Modification permission': '修改权限',
    'You must get permission from me before you are allowed to modify my files to improve it': '你必须在获得我的许可之前，才能修改我的文件以改进它',
    'You are allowed to modify my files and release bug fixes or improve on the features without permission from or credit to me': '你被允许修改我的文件并发布漏洞修复或改进功能，而不需要我的许可或信用。',
    'You are allowed to modify my files and release bug fixes or improve on the features so long as you credit me as the original creator': '你被允许修改我的文件并发布漏洞修复或改进功能，只要注明我是原始创作者。',
    'Conversion permission': '转换权限',
    'You are not allowed to convert this file to work on other games under any circumstances': '你不得在任何情况下将此文件转换为在其他游戏上工作。',
    'You can convert this file to work with other games as long as you credit me as the creator of the file': '你可以将此文件转换为在其他游戏上工作，只要注明我是文件的创作者。',
    'Asset use permission': '资产使用权限',
    'You are allowed to use the assets in this file without permission or crediting me': '你被允许使用此文件中的资产，而不需要我的许可或信用。',
    'You are allowed to use the assets in this file in mods/files that are being sold, for money, on Steam Workshop or other platforms': '你被允许在销售中的模组/文件中使用此文件中的资产，用于金钱，在 Steam Workshop 或其他平台上。',
    'You must get permission from me before you are allowed to use any of the assets in this file': '你必须在获得我的许可之前，才能使用此文件中的任何资产',
    'You are allowed to use the assets in this file without permission as long as you credit me': '你被允许使用此文件中的资产，而不需要我的许可，只要注明我是创作者。',
    'Asset use permission in mods/files that are being sold': '在销售中的模组/文件中使用资产的权限',
    'You are not allowed to use assets from this file in any mods/files that are being sold, for money, on Steam Workshop or other platforms': '你不得将本文件中的任何素材用于需要付费购买的模组/文件，包括发布在 Steam 创意工坊或其他平台上。',
    'Asset use permission in mods/files that earn donation points': '在模组/文件中使用资产以赚取捐赠点数的权限',
    'You are not allowed to earn Donation Points for your mods if they use my assets': '你不得为使用我的资产的模组赚取捐赠点数',
    'You are allowed to earn Donation Points for your mods if they use my assets': '你被允许为使用我的资产的模组赚取捐赠点数',
    'You must get permission to earn Donation Points for your mods if they use my assets': '如果你的模组使用了我的素材，你必须获得我的许可才能赚取捐赠点数',
    'You are not allowed to modify my files, including creating bug fixes or improving on features under any circumstances': '你不得修改我的文件，包括创建漏洞修复或改进功能，在任何情况下。',
    'You are not allowed to use assets from this file under any circumstances': '你不得在任何情况下使用此文件中的资产。',
    'Author notes': '作者备注',
    'This author has not provided any additional notes regarding file permissions': '这个作者没有提供任何关于文件权限的额外备注',
    'File credits': '文件信用',
    'This author has not credited anyone else in this file': '这个作者没有在文件中提及其他人',
    'Author\'s instructions': '作者的说明',
    'Donation Points system': '捐赠点系统',
    'This mod is': '这个模组是',
    'opted-in': '已加入',
    'to receive Donation Points': '赚取捐赠点数',
    'these': '这些',
    'authors before you can use their assets': '作者，你才能使用他们的资产',
    'Mirrors': '镜像',
    'Donations': '捐赠',
    'No donations accepted': '不接受捐赠',
    'Collections containing this mod': '包含此模组的合集',
    'Get hundreds of curated mods the easy way': '轻松获取数百个精选模组',
    'and': '和',
    'make it 1-click with premium': '只需一键即可使用高级版',
    'View all': '查看全部',
    'Translations': '翻译',
    'Translations available on the Nexus': 'Nexus 上提供的翻译',
    'Language': '语言',
    'Author:': '作者：',
    'Changelogs': '更新日志',
    'Adult': '成人',

    'Try premium.': '尝试高级版。',
    'Try premium. Go': '尝试高级版。立即开始',
    'Go': '确定',
    '10x faster': '10 倍更快',
    'with premium': '使用高级版',
    'Your download speed is limited to 3 MB/s. Go premium for': '你的下载速度限制为 3 MB/s。升级为高级版以',
    'max speeds': '最大速度',
    'and more.': '和更多。',
    'Get max speeds and more': '获取最大速度和更多',
    'You haven\'t downloaded this mod yet': '你还没有下载这个模组',
    'Success': '成功',
    'Tracking': '关注中',

    'Report a mod': '报告模组',
    'I\'m having problems using this mod': '我无法使用这个模组',
    'The mod does not work as expected.': '这个模组无法正常工作。',
    'The mod features content that I disagree with.': '这个模组包含我不认同的内容。',
    'I believe this mod is breaking the rules': '我相信这个模组违反了规则',
    'This mod doesn\'t comply with the community guidelines.': '这个模组不符合社区指南。',
    'To report a problem with this mod please use the options below.': '要报告这个模组的问题，请使用下面的选项。',
    'Post a comment': '发表评论',
    'Discuss on the forums': '在论坛上讨论',
    'You can block mods by tag or by uploader using your Content Blocking settings.': '你可以使用内容屏蔽设置来屏蔽模组或上传者。',
    'How does this mod break the community rules?': '这个模组如何违反社区规则？',
    'Stolen Content': '被盗内容',
    'This mod contains content created by others without permission.': '这个模组包含其他人未经许可创建的内容。',
    'This mod includes abusive, illegal or otherwise unsuitable content.': '这个模组包含暴力、非法或不适合的内容。',
    'Suspicious Content': '可疑内容',
    'This mod is designed to damage the game, provide an unfair advantage in multiplayer or may be a virus.': '这个模组设计为损坏游戏、在多人游戏中提供不公平优势或可能是病毒。',
    'This mod features AI generated voices, artwork, etc.': '这个模组包含 AI 生成的声音、艺术品等。',
    'Donation Issues': '捐赠问题',
    'Advertising mod(s) that require payment to access or other violations of the Donation Guidelines.': '广告模组，需要支付才能访问，或违反捐赠指南。',
    'This mod appears to be spam.': '这个模组似乎是垃圾内容。',
    'Are you the owner of the content?': '你是内容的所有者吗？',
    'If you are not the owner/copyright holder for the content, we may not be able to fully investigate your report.': '如果你不是内容的所有者/版权持有者，我们可能无法完全调查你的报告。',
    'Where is the original content hosted?': '原始内容在哪里托管？',
    'If the original content can\'t be found on Nexus Mods, we may not be able to reliably verify your claim. Please ensure you provide a public, permanent link to the content. Content that is paywalled or hosted on a private website/community may not be possible for our team to review.': '如果原始内容无法在 Nexus Mods 上找到，我们可能无法可靠地验证你的声明。请确保你提供一个公共、永久的链接到内容。内容如果是付费墙或托管在私人网站/社区可能无法被我们的团队审查。',
    'Source Link': '原始链接',
    'Additional details': '额外细节',
    'Why is this content inappropriate?': '为什么这个内容不合适？',
    'Includes nudity, sexualised content, gore or swearing and is not tagged appropriately.': '包含裸露、性内容、暴力或亵渎，并且没有适当标记。',
    'Abusive Content': '暴力内容',
    'Spam, trolling, hate speech, flame baiting, etc.': '垃圾内容、嘲讽、仇恨言论、煽动性言论等。',
    'Illegal Content': '非法内容',
    'Content that promotes piracy, sexualisation of minors, bestiality, etc.': '推广盗版、未成年人性化、动物性恋等。',
    'Adult content is allowed if tagged correctly.': '成人内容如果正确标记，则允许。',
    'You can block this content in your': '你可以屏蔽这个内容在你的',
    'settings': '设置',
    'Why is this content suspicious?': '为什么这个内容可疑？',
    'Suspected Virus/Malware': '疑似病毒/恶意软件',
    'A file on this mod page may include a virus or malware.': '这个模组页面上的文件可能包含病毒或恶意软件。',
    'Malicious Mod': '恶意模组',
    'Designed to intentionally cause damage to your game, saved data or computer.': '设计为故意损坏你的游戏、保存的数据或计算机。',
    'Cheat Mod (Multiplayer)': '作弊模组（多人游戏）',
    'Gives the user an unfair advantage that is disruptive to a multiplayer environment.': '给用户不公平优势，破坏多人游戏环境。',
    'All files on Nexus Mods are virus scanned. Some anti-virus apps detect false positives for mod files.': 'Nexus Mods 上的所有文件都经过病毒扫描。一些反病毒应用程序检测到模组文件的误报。',
    'You can block the "AI Generated Content" tag in your': '你可以屏蔽 "AI 生成内容" 标签在你的',
    'AI generated content generally does not breach our Terms of Service. Please read our official stance on AI generated mods': 'AI 生成内容通常不会违反我们的服务条款。请阅读我们对 AI 生成模组的立场',
    'here': '这里',
    'How does this content break Donation Guidelines?': '这个内容如何违反捐赠指南？',
    'Donation Point Guidelines': '捐赠点指南',
    'Paywall Link': '付费墙链接',
    'Donation Points Abuse': '捐赠点滥用',

    'Docs': '文档',
    'Documentation': '文档',
    'View as plain text': '查看纯文本',
    'Error': '错误',
    'You cannot rate a file within 15 minutes of downloading it. Please come back and rate this file again once you\'ve played with it enough.': '你不能在下载文件后 15 分钟内评分。请回来再次评分，一旦你玩够了。',
    
    'This mod is currently not opted in to our mod rewards program.': '这个模组目前没有加入我们的模组奖励计划。',
    'Opt-in': '加入',

    'Your mod is currently not published.': '你的模组目前未发布。',
    'You need to complete the following steps before you can publish this mod.': '你需要完成以下步骤，才能发布这个模组。',
    'Summary - You must enter a summary for this mod.': '摘要 - 你必须输入这个模组的摘要。',
    'Images - You must upload at least 1 image for this mod.': '图片 - 你必须上传至少 1 张图片用于这个模组。',
    'Files - You must upload at least 1 file for this mod.': '文件 - 你必须上传至少 1 个文件用于这个模组。',

    'Manage': '管理',
    'Required files': '所需文件',
    'File mirrors': '文件镜像',
    'Publish': '发布',

    'Suggest tags for this mod': '为这个模组建议标签',
    'Tags confirmed by the author': '作者确认的标签',
    'Tags confirmed by users': '用户确认的标签',
    'Tags not confirmed yet': '标签未确认',
    'Tags rejected by the author': '作者拒绝的标签',


    'Some suspicious files': '一些可疑文件',



    // 模组文件详情页
    'Main files': '主要文件',
    'Sort by': '排序方式',
    'Size': '大小',
    'Name': '名称',
    'Date uploaded': '上传日期',
    'File size': '文件大小',
    'Downloaded': '已下载',
    'Mod manager download': '模组管理器下载',
    'Manual download': '手动下载',
    'Preview file contents': '预览文件内容',
    'Optional files': '可选文件',
    'Old files': '旧文件',
    'File archive': '文件归档',
    'Additional files required': '额外文件要求',
    'This mod requires one or more additional files in order to work properly.': '这个模组需要一个或多个额外文件才能正常工作。',
    'Please ensure you have these files installed properly before attempting to use this file.': '请确保你已经正确安装了这些文件，然后再尝试使用这个文件。',
    'Free': '免费',
    "Slow download. Wait more.": "下载速度较慢，请耐心等待。",
    "Throttled downloads (1.5-3MB/s)": "限速下载（1.5–3MB/s）",
    "Delay before each download": "每次下载前的等待时间",
    "Manually download mod collections": "手动下载模组合集",
    "Ads (site-wide)": "全站广告",
    "Go 10x faster. Play more.": "速度提升 10 倍，尽情畅玩。",
    "Max download speeds": "最大下载速度",
    "Instant downloads": "即时下载",
    "Auto-download mod collections": "自动下载模组合集",
    "No more ads": "无广告",
    'Slow download': '慢速下载',
    'Fast download - free trial': '快速下载 - 免费试用',
    'Miscellaneous files': '其他文件',
    'FILE CONTENTS': '文件内容',
    'Your download has started': '你的下载已经开始',
    'If you are having trouble,': '如果你有困难，',
    'click here': '点击这里',
    'to download manually': '手动下载',

    // 模组图片详情页
    'Add your images': '添加图片',
    'Author images': '作者图片',
    'Pages': '页面',
    'User images': '用户图片',
    'No results': '没有结果',
    'View image': '查看图片',
    'Report a mod image': '报告图片',
    'I don\'t like this content': '我不喜欢这个内容',
    'The image features content that I disagree with.': '图片包含我不认同的内容。',
    'I believe this image is breaking the rules': '我相信这张图片违反了规则',
    'This image doesn\'t comply with the community guidelines.': '这张图片不符合社区指南。',
    'Read our': '阅读我们的',
    'Reporting Guidelines': '报告指南',
    'to learn more about our rules.': '了解我们的规则。',
    'Next': '下一步',
    'Back': '返回',
    'Done': '完成',
    'How does this image break the community rules?': '这张图片如何违反社区规则？',
    'AI Generated Content': 'AI 生成内容',
    'This image features AI generated artwork, etc.': '这张图片包含 AI 生成的艺术品等。',
    'Adult Content': '成人内容',
    'Includes nudity, sexualised content, gore or swearing.': '包含裸露、性内容、暴力或亵渎。',
    'Unrelated to Mod': '与模组无关',
    'This image is unrelated to the mod page it has been posted on.': '这张图片与它发布的模组页面无关。',
    'Other Terms of Service violation': '其他服务条款违反',
    'This content does not comply with the community standards.': '这个内容不符合社区标准。',
    'Spam Content': '垃圾内容',
    'This image appears to be spam.': '这张图片似乎是垃圾内容。',
    'Loading...': '加载中...',
    'You can block users by uploader using your Content Blocking settings.': '你可以使用内容屏蔽设置来屏蔽上传者。',
    'More Info': '更多信息',
    'Manage my settings': '管理我的设置',

    // 图片尺寸 / 上传说明
    // 注意：这里加上一版包含 "Max file size" 的完整句子，避免整段文本在一个 textNode 里时无法匹配
    'We recommend you use image sizes of 1920x1080 (16:9). This will fit best within this area and will retain a consistent look across any sort of device our users browse with.':
      '建议你使用 1920x1080（16:9）尺寸的图片。这样可以在此区域有最佳显示效果，并在各种设备上保持一致的外观。',
    'We recommend you use image sizes of 1920x1080 (16:9). This will fit best within this area and will retain a consistent look across any sort of device our users browse with. Max file size':
      '建议你使用 1920x1080（16:9）尺寸的图片。这样可以在此区域有最佳显示效果，并在各种设备上保持一致的外观。 文件最大大小为',
    'Max file size': '文件最大大小为',
    '. We only accept': '。我们只接受',
    'or': '或',
    '(not animated) images.': '（非动画）图片。',

    'Drop images here to upload them to this mod': '将图片拖拽到这里上传到此模组',
    'Or browse for an image': '或选择图片',

    // 模组视频详情页
    'Author videos': '作者视频',
    'User videos': '用户视频',

    // 模组文章详情页
    'Articles': '文章',
    'Mod articles': '模组文章',
    'Add a new comment': '添加新评论',
    'Added on': '添加于',
    'Edited on': '编辑于',
    'Written by': '撰写者',

    // 模组评论详情页
    'Jump': '跳转',
    'Search comments...': '搜索评论...',
    'Add comment': '添加评论',
    'Report': '报告',
    'Sticky': '置顶',
    'Locked': '锁定',
    'member': '普通用户',
    'premium': '高级会员',
    'supporter': '支持者',
    'Reply': '回复',
    'Report an Comment': '报告评论',
    'How does this comment break the community rules?': '这条评论如何违反社区规则？',
    'Inappropriate Content': '不适当内容',
    'Trolling or harassment': '嘲讽或骚扰',
    'Malicious/disreputable link(s)': '恶意/不良链接',
    'Content links to site or has attachment that can be harmful.': '内容链接到站点或附件可能有害。',
    'This collection bug report appears to be spam.': '这个合集漏洞报告似乎是垃圾内容。',
    'Breaks the rules set by Nexus Mods.': '违反 Nexus Mods 的规则。',
    'Describe your issue in as much detail as possible and a moderator will review the case': '尽可能详细地描述你的问题，管理员将审查此案例',
    '(Required)': '(必填)',
    'Add attachment': '添加附件',
    'Add any images or text files that will help us moderate your report more effectively.': '添加任何图片或文本文件，以帮助我们更有效地审查你的报告。',
    'I confirm that, to the best of my knowledge, the information I have provided is correct and follows our': '我确认，根据我的知识，我提供的信息是正确的，并遵循我们的',
    'Submit': '提交',
    'Cancel': '取消',
    'Add a reply': '添加回复',
    'Use emoticons': '使用表情符号',

    // 模组漏洞
    'Bugs': '漏洞',
    'Bug reports': '漏洞报告',
    "Status": "状态",
    "All issues": "所有问题",
    "New issues": "新问题",
    "New issue": "新问题",
    'Known issue': '已知问题',
    "Being looked at": "正在处理",
    "Fixed": "已修复",
    "Known issues": "已知问题",
    "Duplicates": "重复",
    "Duplicate": "重复",
    "Not a bug": "不是漏洞",
    "Won't fix": "不会修复",
    "Need more info": "需要更多信息",
    'Priority': '优先级',
    'All priorities': '所有优先级',
    'Not set': '未设置',
    'Low': '低',
    'Medium': '中等',
    'High': '高',
    'Date': '日期',
    'Last reply': '最后回复',
    'Order': '排序',
    'Bug title': '漏洞标题',
    'Last post': '最后回复',
    'Replies': '回复',
    'Loading issue...': '加载问题...',
    'No issues reported at this time.': '目前没有报告的问题。',

    // 模组日志详情页
    'Activity logs': '活动日志',
    'Author\'s activity': '作者的活动',
    'Mod page activity': '模组页面的活动',
    'Load more items': '加载更多项目',

    // 模组统计详情页
    'Mod statistics': '模组统计',
    'Zoom': '缩放',
    'Mod Download History': '模组下载历史',
    'Page Views': '页面浏览量',
    'Total Endorsements': '总认可数',
    'Totals': '总计',
    'DATA GROUPING:': '数据分组：',
    'Auto': '自动',
    'Daily': '每日',
    'Weekly': '每周',
    'Monthly': '每月',

    // 合集详情页面
    'Updated: ': '更新于 ',
    'Published: ': '发布于 ',
    'Add collection (Desktop only)': '添加合集（仅限桌面）',
    'Add collection': '添加合集',
    'Unlock': '解锁',
    'one-click collections': '一键合集',
    'maximum download speeds': '最大下载速度',
    'Try premium for free': '免费试用高级版',
    'About': '关于',
    'Comments': '评论',
    'Changelog': '更新日志',
    'Published': '发布日期',
    'Total': '总',
    'DLs': '下载量',
    'Unique': '独立',
    'View changelog': '查看更新日志',
    'Creator notes': '作者笔记',
    'First published -': '首次发布 -',
    'Mods by': '模组作者',
    'Revision': '修订 ',
    'Game version': '游戏版本',
    'Below are all the mods that are contained within this collection.': '以下是包含在此合集中的所有模组。',
    'Mod name': '模组名称',
    'Uploader': '上传者',
    'Read more': '阅读更多',
    'Bundled Assets': '捆绑资产',
    'This mod is included in this package.': '这个模组包含在这个合集中。',
    'Optional Mods': '可选模组',
    'Size:': '大小:',
    'Version:': '版本:',
    'Below are all the comments for all the revisions within this collection.': '以下是此合集所有修订版本的评论。',
    'Newest first': '最新优先',
    'Oldest first': '最旧优先',
    'Best': '最佳',
    'Premium': '高级会员',
    'Edited': '编辑于 ',
    'Copy link': '复制链接',
    'Report abuse': '报告滥用',
    'Leave a comment': '留下评论',
    'Comment': '评论',
    '+ Show more': '+ 显示更多',
    '- Show less': '- 显示更少',
    'No comments have been added': '没有评论',
    'Below are all the changelogs for all the revisions within this collection.': '以下是此合集所有修订版本的更新日志。',
    'Below are all the raised bugs for this collection.': '以下是此合集所有提出的漏洞。',
    'Open': '打开',
    'Closed': '已关闭',
    'Title': '标题',
    'Reporter': '报告者',
    'Created': '创建于',
    'a bug': '漏洞',
    'raised this bug': '提出了这个漏洞在 ',
    'Share this': '分享这个',
    'Collection': '合集',
    'with your friends': '给你的朋友',
    // 'No tags added': '暂无标签',
    'Report Collection': '报告合集',
    'I am having problems using this collection': '我无法使用这个合集',
    'The collection does not work as expected.': '这个合集无法正常工作。',
    'The collection features content I disagree with.': '这个合集包含我不认同的内容。',
    'I believe this collection is breaking the rules': '我相信这个合集违反了规则',
    'This content doesn\'t comply with the community guidelines.': '这个内容不符合社区指南。',
    'To report a bug related to this collection, please visit the bug tab.': '要报告与这个合集相关的漏洞，请访问漏洞标签。',
    'Unfortunately, we currently do not have blocking tools in place for collections, but we hope to be able to implement content filtering in the future.': '不幸的是，我们目前没有为合集设置屏蔽工具，但我们希望在未来能够实现内容过滤。',
    'How does this collection break the community rules?': '这个合集如何违反社区规则？',
    'The page contains adult content but is not marked correctly.': '页面包含成人内容但未正确标记。',
    'Improper use of bundled assets': '不适当的使用捆绑资产',
    'Bundled assets contain content the curator does not have permission to distribute.': '捆绑资产包含合集创建者没有权限分发的内容。',
    'This user\'s About Me section includes abusive, illegal or otherwise unsuitable content.': '这个用户的“关于我”部分包含侮辱、非法或不适合的内容。',
    'Other Collections Guidelines violation': '其他合集指南违反',
    'This collection appears to be spam.': '这个合集似乎是垃圾内容。',
    'There are no changelogs yet': '还没有更新日志',
    'Check back again when a new revision has been added.': '当有新的修订版本时，请再次检查。',
    // 'No': '没有',
    'tags': '标签',
    'added': '已添加',


    // 所有游戏页面 https://www.nexusmods.com/games
    'Choose from': '从 ',
    'games': ' 游戏中选择',
    'to mod': '模组',
    'Get games to mod, cheaper.': '获取更便宜的模组化游戏',
    'Discover offers': '发现优惠',
    'Download count': '下载量',
    'Mods count': '模组数量',
    'Collections count': '合集数量',
    'Date added': '添加日期',
    'Game': '游戏',
    'Search game': '搜索游戏',
    'Apply': '应用',
    'Game genre': '游戏类型',
    'Game genre search': '游戏类型搜索',
    'Vortex Support': 'Vortex 支持',
    'No. of mods': '模组数量',
    'No. of collections': '合集数量',
    'Page': '页',

    // 我的资料 https://next.nexusmods.com/profile/*
    'Edit profile': '编辑资料',
    'Endorsements Given': '认可数',
    'Profile Views': '浏览量',
    'Last active on': '最后活跃于',
    'Joined on': '加入于',
    'About Me': '关于我',
    'There\'s nothing here yet': '这里暂时还没有内容',
    'All Games': '所有游戏',
    'No results found': '未找到任何结果',
    'All': '全部',
    'Supporter Images': '支持者图片',
    'Give Kudos': '点赞',
    'Message': '消息',
    'Ignore': '忽略',
    'Donate': '捐赠',
    'Verified mod author': '认证模组作者',
    'Report User Profile': '举报用户',
    'Please report the specific piece of content that does not comply with the Terms of Service.': '请报告不符合服务条款的具体内容。',
    'I don\'t like this user': '我不喜欢这个用户',
    'Their profile features content that I disagree with.': '他的资料包含我不同意的内容。',
    'I believe this user is breaking the rules': '我相信这个用户违反了规则',
    'This user doesn\'t comply with the community guidelines.': '这个用户不符合社区指南。',
    'You can block users on their profile page or by using your Content Blocking settings.': '你可以在他的资料页面或使用你的内容屏蔽设置屏蔽用户。',
    'How does this user break the community rules?': '这个用户如何违反社区规则？',
    'Content or Comments': '内容或评论',
    'This user\'s content or comments do not comply with the community standards.': '这个用户的内容或评论不符合社区标准。',
    'Inappropriate Avatar': '不适当的头像',
    'This user\'s avatar includes abusive, illegal or otherwise unsuitable content.': '这个用户的头像包含侮辱、非法或不适合的内容。',
    'Inappropriate About Me': '不适当的关于我',
    'This user\'s \'About Me\' section includes abusive, illegal or otherwise unsuitable content.': '这个用户的“关于我”部分包含侮辱、非法或不适合的内容。',
    'Inappropriate Username': '不适当的用户名',
    'This user\'s username includes abusive, illegal or otherwise unsuitable content.': '这个用户的用户名包含侮辱、非法或不适合的内容。',
    'Spam Account': '垃圾账户',
    'This user is posting spam content.': '这个用户在发布垃圾内容。',
    'Soliciting Issues': '寻求问题',
    'Advertising mod(s) that require payment to access or soliciting payment in any form.': '广告模组，需要支付才能访问或以任何形式寻求支付。',
    'Donation Point Issues': '捐赠点问题',
    'This mod violates the': '这个模组违反了',
    'Donation Point Guidelines.': '捐赠点指南。',
    'Supporter': '支持者',
    'You must enter a summary for this mod.You must upload at least 1 image for this mod.You must upload at least 1 file for this mod.': '你必须为这个模组输入一个摘要。你必须上传至少 1 张图片。你必须上传至少 1 个文件。',

    // 我的模组 https://www.nexusmods.com/users/myaccount?tab=mods
    'My Content': '我的内容',
    'My content': '我的内容',
    'Blocked users': '屏蔽用户',
    'Analytics': '分析',
    'My Files': '我的文件',
    'Other Files': '其他文件',
    'Invitations': '邀请',
    'My Nexus Files': '我的 Nexus 文件',
    'Manage mod': '管理模组',
    'Mod status': '模组状态',
    'Unpublished': '未发布',
    'Publish this mod': '发布这个模组',
    'Delete this mod': '删除这个模组',
    'Manage Mod Rewards': '管理模组奖励',
    'Add a file': '添加文件',
    'Date published': '发布日期',
    'Unique downloads': '独立下载量',
    'Author name': '作者名称',
    'File name': '文件名称',
    'Last comment': '最新评论',
    'Random': '随机',
    'Show': '显示',
    '20 items': '20 条',
    'This is a premium-only feature': '这是一个高级会员专属功能',
    'The powerful open-source mod manager from Nexus Mods.': 'Nexus 的强大开源模组管理器。',
    'Learn more': '了解更多',
    'My Nexus images': '我的 Nexus 图片',
    'Recent': '最近',
    'Ratings': '评分',
    'Add an image': '添加图片',
    'My Nexus videos': '我的 Nexus 视频',
    'Add a video': '添加视频',
    'My download history': '我的下载历史',
    'Please allow up to 10 minutes for new downloads to appear in this list.': '请允许 10 分钟新下载出现在此列表中。',
    'Download history tracks up to 30,000 files. Fewer than 30,000 mods may appear below, as mods often include multiple files.': '下载历史记录跟踪最多 30,000 个文件。少于 30,000 个模组可能出现在下面，因为模组通常包含多个文件。',
    'We are building your download history...': '我们正在构建你的下载历史...',
    'If this takes longer than expected, please ensure Javascript is enabled.': '如果这需要比预期更长的时间，请确保 Javascript 已启用。',
    'Search:': '搜索：',
    'Previous': '上一步',
    'Last DL': '最后下载',
    'Endorsement': '认可',
    'Log': '日志',
    'View': '查看',
    'The following users have invited you to edit their mods.': '以下用户邀请你编辑他们的模组。',
    'User': '用户',
    'Mod': '模组',
    'You have no pending invitations': '你没有待处理的邀请',
    'Categories:': '分类：',
    'Hidden': '隐藏',
    'Misc': '杂项',
    'Other': '其他',


    // 我的分析 https://next.nexusmods.com/my-content/analytics
    'View all your mod stats over time': '查看你的模组统计随时间变化',
    'Total downloads': '总下载量',
    'All files' : '所有文件',
    'My files': '我的文件',
    'Other files': '其他文件',
    'Month': '月',
    'There are no results based on your filters': '没有根据你的过滤器找到结果',

    // 屏蔽用户 https://www.nexusmods.com/my-content/blocked-users
    'The following users have been blocked from interacting with your mods, collections and media.': '以下用户已被屏蔽与你的模组、合集和媒体互动。',
    'Blocked user': '屏蔽用户',
    'Reason': '原因',
    'You haven\'t blocked any users': '你还没有屏蔽任何用户',
    
    // 我的合集 https://www.nexusmods.com/my-collections
    'My Collections': '我的合集',
    'An overview of all your published and draft collections.': '所有已发布和草稿合集的概览。',
    'Date created': '创建日期',
    'Date updated': '更新日期',
    'Revisions': '修订',
    'Hide draft revisions': '隐藏草稿修订',
    'Visibility': '可见性',

    // 我的钱包 https://www.nexusmods.com/modrewards#/wallet/all/1
    'MY WALLET': '我的钱包',
    'Send Points': '发送点数',
    'Visit Store': '访问商店',
    'Learn more about Donation Points': '了解更多关于捐赠点数',
    'Incoming': '收入',
    'Outgoing': '支出',
    'Purchases': '购买',
    'See full statement': '查看完整报表',
    'Back to Dashboard': '返回面板',
    'You don\'t have any transactions yet!': '你还没有任何交易！',
    'Monthly Reports': '每月报表',
    'We have recently changed the way the Donation Point System works.': '我们最近改变了捐赠点系统的工作方式。',
    'Read more here': '阅读更多',
    'Find out more': '了解更多',
    'You don\'t have any mod reports yet!': '你还没有任何模组报告！',
    'Each month you will see a report of all your mod rewards, showing you how much DP you earned, which mod has the most downloads and more ...': '每个月你将看到所有模组奖励的报告，显示你赚取了多少 DP，哪个模组下载量最多等等...',
    'Pending DP will be added to your wallet after 90 days': '待入账的 DP 将在 90 天后添加到你的钱包中',
    'SEND DP TO ANOTHER USER': '发送 DP 给其他用户',
    'You are about to send some of your DP to another Nexus Mods user. Once you have done this you will not be able to get the DP back.': '你即将发送一些你的 DP 给另一个 Nexus Mods 用户。一旦你这样做，你将无法收回 DP。',
    'Select who you want to send money to:': '选择你想发送的用户：',
    'Search': '搜索',
    'Enter a user name': '输入用户名称',
    'Opt In Your Mods': '选择你的模组',
    'The Donation Points system allows mod authors to accumulate, through unique file page downloads, points that can then be redeemed for rewards through our': '捐赠点系统允许模组作者通过独特的文件页面下载积累点数，然后可以通过我们的',
    'store': '商店',
    '. Only opted in mods will receive donation points and you can opt in your mods on this page. You also have the option to share your donation points with your friends and other mod authors by using the Share link below. To find out more view': '。只有加入的模组会收到捐赠点数，你可以在本页加入你的模组。你也可以通过分享链接与你的朋友和其他模组作者分享你的捐赠点数。要了解更多，请查看',
    'our FAQ page': '我们的 FAQ 页面',
    'our': '我们的',
    'Donation Point Guidelines': '捐赠点指南',
    '< Back to my mods': '返回我的模组',
    'here': '这里',
    'to learn more about how to earn and spend Donation Points.': '了解如何赚取和花费捐赠点数。',
    'View mods you have been opted into': '查看你加入的模组',
    'Mod Status': '模组状态',
    'Reward Percentage': '奖励比例',
    'Actions': '操作',
    'Opt-In Confirmation': '加入确认',
    'Share with others': '分享给其他人',
    'If you would like to share your DP with other users, add their username(s) below and drag the slider to decide what percentage of DP you will share with them. If you have shared DP with them recently you can select their avatar to quickly add them.': '如果你希望与其他用户分享你的 DP，请在下方添加他们的用户名，并拖动滑块决定你将与他们分享多少 DP。如果你最近与他们分享过 DP，你可以选择他们的头像快速添加他们。',
    'Type user name...': '输入用户名...',
    'Clear': '清除',
    'You will receive  100% of the DP for this mod': '你将收到此模组的 100% 的 DP',
    'Share your DP with one of the following charities:': '与以下慈善机构分享你的 DP：',
    'You don\'t have any mods!': '你还没有任何模组！',
    'By creating mods, and opting them into the rewards system, you can earn rewards!': '通过创建模组，并加入奖励系统，你可以赚取奖励！',
    'Opted-In Status': '加入状态',
    'Below shows all of the mods that have opted you in to reap the rewards from unique downloads. You might be the uploader of these mods, or someone might have done it on your behalf. To find out more view': '下面显示了所有加入的模组，你可以通过独特的下载赚取奖励。你可能是最初上传这些模组的人，或者有人代表你这样做。要了解更多，请查看',
    'Name A-Z': '名称 A-Z',
    'Name Z-A': '名称 Z-A',
    'Highest Ratio': '最高比例',
    'Lowest Ratio': '最低比例',
    'Enter mod name...': '输入模组名称...',
    'Mods Uploaded By Me': '我上传的模组',
    'Mods Uploaded By Others': '其他用户上传的模组',
    'Cash out': '提现',
    'If nothing takes your fancy this month. Swap Donation Points for cold, hard digital cash. Convert DP to your local currency with Paypal.': '如果本月没有你心仪的物品，你也可以将捐赠点数兑换为实实在在的数字现金。通过 Paypal 将 DP 转换为你的本地货币。',    
    'Charity Donations': '慈善捐赠',
    'Learn More About DP': '了解更多关于 DP',
    'My Wallet:': '我的钱包：',
    'Want to make the world a better place? Use your Donation Points to fund important medical research, wildlife conservation or improving the lives of those less fortunate. Support one of our selected charities to do something good with your modding superpowers.':'想让世界变得更美好吗？你可以使用捐赠点数来资助重要的医学研究、野生动物保护，或帮助改善弱势群体的生活。支持我们精选的慈善机构，用你的模组创作超能力去创造一些真正的善意。',
    'View Wallet': '查看钱包',
    'You can buy items from this store using your Donation Points. Your points balance will display in the wallet section on this page. To view previous transactions go to your':'你可以使用捐赠点数从商店购买物品。你的点数余额将显示在钱包部分。要查看之前的交易，请转到你的',
    'Wallet Page': '钱包页面',
    'Store': '商店',
    'Game Keys': '游戏激活码',
    'Turn your modding efforts into new gaming experiences. We’re offering a limited supply of great value game keys, exclusively to our members. Your next adventure awaits...':'把你的模组创作转化为新的游戏体验吧。我们为会员独家提供数量有限、超值优惠的游戏激活码。你的下一段冒险正在等待……',
    'Charity Donation': '慈善捐赠',
    'Featured': '精选',
    'Product Details': '产品详情',
    'Terms and Conditions': '条款和条件',
    'This is a game key for': '这是一个游戏激活码，用于',
    'and can only be redeemed there.': '，只能在那里兑换。',
    'Buy Now': '立即购买',
    'Enter your amount:': '输入你的数量：',
    'Charity': '慈善',
    'It looks like you have not set up your PayPal e-mail address, or your current address is invalid. To do that now please go to your': '看起来你还没有设置你的 PayPal 邮箱地址，或者你的当前地址无效。要现在这样做，请转到你的',
    'donation settings': '捐赠设置',
    'and add your PayPal email there.': '并添加你的 PayPal 邮箱地址。',
    'This mod is opted in to our mod rewards program.': '这个模组已加入我们的模组奖励计划。',

    
    // 站点设置 https://next.nexusmods.com/settings/preferences
    'Preferences': '设置',
    'Settings': '设置',
    'Set the preferences you want when using Nexus Mods.': '你在使用 Nexus Mods 时的设置。',
    'Global': '全局',
    '1 days': '1 天',
    '3 days': '3 天',
    '7 days': '7 天',
    '14 days': '14 天',
    '28 days': '28 天',
    'Never': '从不',
    'Remind me about file ratings': '提醒我关于文件评分',
    'Images added by the author in the image description': '作者在图片描述中添加的图片',
    'Choose on a per image basis': '按每张图片为基础选择',
    'Turn off images': '关闭图片',
    'Turn on images': '开启图片',
    'Replies to posts bump the original post': '回复帖子会提升原始帖子',
    'File downloads open in a pop-up box': '文件下载在弹出框中打开',
    'Browse': '浏览',
    'All Time': '所有时间',
    'Default quick search': '默认快速搜索',
    'Default mod sorting': '默认模组排序',
    'Default mod view': '默认模组视图',
    'Homepage': '首页',
    'Set your default tabs for the ‘homepage’ and ‘game homepages’.': '设置你的默认标签用于首页和游戏首页。',
    'Default Mods Tab': '默认模组标签',
    'Default Media Tab': '默认媒体标签',
    'Tracked Content Updates': '关注内容更新',
    'Show user comments about your files, images and videos': '显示用户关于你的文件、图片和视频的评论',
    'Show user activity on your files, images and videos': '显示用户关于你的文件、图片和视频的活动',
    'Show user activity on the files you track': '显示你关注的文件的用户活动',
    'Show user comments on the files you track': '显示你关注的文件的用户评论',
    'Show author activity on the files you track': '显示你关注的文件的作者活动',
    'Content blocking': '内容屏蔽',
    'Control what content you see on Nexus Mods.': '控制你在 Nexus Mods 上看到的内容。',
    'Adult content': '成人内容',
    'Show adult content with blur': '显示成人内容并模糊处理',
    'Blurred content can be revealed on click': '模糊内容可以点击揭示',
    'Show adult content': '显示成人内容',
    'Specify what type(s) of adult content you’d like to see': '指定你希望看到哪种类型的成人内容',
    "Extreme violence": "极端暴力",
    "Sexualised": "性暗示",
    "Swearing/Profanity": "脏话 / 不雅用语",
    "Pornographic": "色情内容",
    "Suicide": "自杀",
    "Depression": "抑郁",
    "Self-harm": "自残",
    "Body stigma": "身体羞辱",
    "Eating disorder": "饮食失调",
    "Harmful substances": "有害物质",
    'Blocked content': '屏蔽内容',
    'Use tags to block content you don’t want to see on Nexus Mods.': '使用标签屏蔽你不想在 Nexus Mods 上看到的内容。',
    'blocked tags': '屏蔽标签',
    'No tags blocked': '没有屏蔽标签',
    'Select tags to block. They can be global or game specific.': '选择标签屏蔽。它们可以是全局或游戏特定的。',
    'Global tags': '全局标签',
    'Ignored users': '忽略用户',
    'Ignoring a user hides their content and activity form you, including mods, images, videos, collections, comments, bug reports, and notifications.': '忽略一个用户会隐藏他们的内容和活动对你，包括模组、图片、视频、合集、评论、漏洞报告和通知。',
    'Ignored users can still view and interact with your content. They won\'t be notified, and you can still access their profile.': '忽略的用户仍然可以查看和与你互动的内容。他们不会收到通知，你仍然可以访问他们的资料。',
    'No ignored users': '没有忽略用户',
    'Add a user you want to ignore': '添加你想要忽略的用户',
    'Username': '用户名',
    'Enter the exact username': '输入确切的用户名',

    'Profile': '资料',
    'Profile picture': '个人头像',
    'Add, remove and change your profile picture': '添加、删除和更改你的个人头像',
    'A profile picture adds a personal touch to your account and helps others recognise you.': '个人头像可以为你的账户增添特色，并帮助其他人识别你。',
    'Change': '更改',
    'Remove': '删除',
    'Change username': '更改用户名',
    'Craft your story in the \'About Me\' section and share more about yourself.': '在“关于我”部分创作你的故事，并分享更多关于你自己的信息。',
    'Edit': '编辑',
    'Display when you were last active': '显示你上次活跃的时间',
    // 'Add profile picture': '添加资料图片',
    'Add': '添加',
    'profile picture': '个人头像',
    'Drag and drop an image': '拖拽图片', 
    'Choose an image': '选择图片',
    'It is prohibited to include any Adult Content in profile pictures.': '禁止在资料图片中包含任何成人内容。',
    'Remove Profile Picture': '删除资料图片',
    'Are you sure you want to remove your current profile picture?': '你确定要删除你的当前资料图片吗？',
    'Back to profile settings': '返回资料设置',
    'Your new username may take 15 minutes to appear across the website. To update some applications you might need to log out and back in.': '你的新用户名可能需要 15 分钟才能在整个网站上显示。要更新一些应用，你可能需要退出并重新登录。',
    'You can only change your username once every 6 months.': '你只能每 6 个月更改一次你的用户名。',
    'Current username: ': '当前用户名：',
    'New username': '新用户名',
    'Min of 3 characters': '至少 3 个字符',
    'Max of 26 characters': '最多 26 个字符',
    'Only letters or numbers': '只能使用字母或数字',
    'Different to current': '不同于当前',
    'Must be unique': '必须唯一',
    'No restricted words': '没有受限制的单词',
    'I understand the username I have chosen is the one I want and it can\'t be changed for 6 months.': '我理解我选择的用户名是我想要的，并且不能在 6 个月内更改。',
    'About me': '关于我',
    'Country': '国家',
    'Bio': '简介',
    'Tell the community a bit about yourself. This will be displayed on your profile page.': '告诉社区一些关于你自己的信息。这将显示在你的资料页面上。',
    'Please select...': '请选择...',
    'Add full description': '添加完整描述',
    'We only accept': '我们只接受',
    'JPG, PNG, GIF, or WebP': 'JPG、PNG、GIF 或 WebP',

    // 捐赠
    'If you are a particularly helpful or productive user on the Nexus sites then other users might wish to show their appreciation to you by donating to you. Donations are completely opt-in and optional.': '如果你在 Nexus 站点上特别活跃、乐于助人或贡献突出，其他用户可能会希望通过捐赠来表达对你的感谢。捐赠完全是自愿的，你可以自由选择是否开启。',
    'Warning': '警告',
    'You should': '你应该',
    'never, ever': '永远不要',
    'charge for access to any files, additional content or perks on Nexus Mods. This includes providing a file for free and then requiring users to donate to receive additional features, support or special perks. It is against the rules of this site to incentivise the donation system or ask users to donate to you for additional support or content.': '向用户收取访问 Nexus Mods 上任意文件、额外内容或特殊权益的费用。这包括：文件本体免费提供，但要求用户捐赠才能获取额外功能、支持或特殊奖励等行为。在本站上通过激励手段鼓励捐赠，或要求用户捐赠以获得额外内容或支持，都是违反规定的。',
    'Accept Direct Donations on my mods': '接受直接捐赠我的模组',
    'You will need to enable donations on each of your mod pages.': '你需要在每个模组的页面上启用捐赠。',
    'Your Paypal email': '你的 Paypal 邮箱',
    'Accepting direct donations will publicly share your PayPal email address to donors. Are you sure you wish to enable this feature?': '接受直接捐赠将公开分享你的 PayPal 邮箱地址给捐赠者。你确定要启用这个功能吗？',
    'Enable': '启用',
    'Your PayPal e-mail address': '你的 PayPal 邮箱地址',
    'Enter your PayPal email address': '输入你的 PayPal 邮箱地址',
    'Save': '保存',
    'Show a donate button on my profile page': '在我的资料页面上显示一个捐赠按钮',
    'Participate in donation points program': '参与捐赠点计划',

    // API Keys
    'API Keys': 'API 密钥',
    'Manage the API keys for all your third-party apps.': '管理你所有第三方应用的 API 密钥。',
    'Integrations': '集成',
    'Request Api Key': '请求 API 密钥',
    'Personal API Key': '个人 API 密钥',
    'If you are developing a new application, you can also access the API using your personal API key. Please see our': '如果你正在开发一个新的应用，你也可以使用你的个人 API 密钥访问 API。请参阅我们的',
    'Acceptable Use Policy': '可接受使用政策',
    'for details on how to register your application for public use.': '了解如何注册你的应用以供公共使用。',
    'Warning: Do not enter your personal API key into an application you do not trust. If an unregistered application asks for your personal API key it may be malicious. Your API key grants the application limited access to your Nexus Mods account and personal information.': '警告：不要将你的个人 API 密钥输入到你不信任的应用中。如果一个未注册的应用请求你的个人 API 密钥，它可能是恶意的。你的 API 密钥授予应用对你的 Nexus Mods 账户和个人信息有限的访问权限。',

    // Moderation
    'Moderation': '管理',
    'View your raised reports.': '查看你提出的报告。',
    'View reports': '查看报告',
    'Any moderation or warnings relating to this account will be shown here.': '任何与此账户相关的管理或警告将显示在这里。',
    'Warnings and Restrictions': '警告和限制',
    'You have not received any warnings or restrictions on your account.': '你还没有收到任何警告或限制。',

    // 通知
    'Choose what types of notifications you want to receive from us.': '选择你希望从我们这里接收的通知类型。',
    'Display notifications': '显示通知',
    'Controls whether you see notifications, disable this to stop getting alerted to new notifications': '控制你是否看到通知，禁用此选项将停止收到新通知的提醒。',
    'Game specific notifications': '游戏特定通知',
    'When viewing a game-specific page, you\'ll only see notifications for that game' : '当你查看一个游戏特定的页面时，你只会看到该游戏的通知。',
    'New games added': '新游戏添加',
    'Receive a weekly roundup of new games added to Nexus Mods, we may also send one-off notifications for new games': '接收每周一次的新游戏添加概览，我们也可能会发送一次性通知关于新游戏。',
    'News articles from Nexus Mods': '新闻文章',
    'Receive a notification every time we post a new article to Nexus Mods': '每次我们发布新的文章到 Nexus Mods 时，接收一条通知。',
    'Donation Points payout': '捐赠点支付',
    'Receive a notification when you receive Donation Points from a payout': '当你收到捐赠点支付时，接收一条通知。',
    'Donation Points sent to me': '捐赠点发送给我',
    'Receive a notification when another user sends you Donation Points': '当另一个用户发送捐赠点给你时，接收一条通知。',
    'Donation Points monthly reports': '捐赠点每月报告',
    'Receive a notification when a new Donation Points monthly report has been added': '当新的捐赠点每月报告被添加时，接收一条通知。',
    'New files': '新文件',
    'Updated files': '更新文件',
    'Receive a notification for your tracked mods when a Mod Author updates their mod with a new file': '当你关注的模组作者更新他们的模组时，接收一条通知。',
    'New articles': '新文章',
    'Receive a notification for your tracked mods when a new article is added': '当你关注的模组作者发布新的文章时，接收一条通知。',
    'Tracked users': '关注用户',
    'Receive a notification for your tracked users when they upload a new mod': '当你关注的用户上传新的模组时，接收一条通知。',
    'New images': '新图片',
    'Receive a notification for your tracked users when they add a new image to the media share': '当你关注的用户在媒体分享中添加新的图片时，接收一条通知。',
    'New videos': '新视频',
    'Receive a notification for your tracked users when they add a new video to the media share': '当你关注的用户在媒体分享中添加新的视频时，接收一条通知。',
    'My Comments': '我的评论',
    'Mod comment replies': '模组评论回复',
    'Receive a notification when someone replies to one of your comments on a mod': '当有人在你的模组上的评论时，接收一条通知。',
    'Collection comment replies': '合集评论回复',
    'Receive a notification when someone replies to one of your comments on a collection': '当有人在你的合集上的评论回复时，接收一条通知。',
    'My Bug Reports': '我的漏洞报告',
    'Collection bug report closed': '合集漏洞报告关闭',
    'Receive a notification when the Curator closes your bug report on a collection': '当合集创建者关闭你的合集上的漏洞报告时，接收一条通知。',
    'Collection bug report reopened': '合集漏洞报告重新打开',
    'Receive a notification when the Curator reopens your bug report on a collection': '当合集创建者重新打开你的合集上的漏洞报告时，接收一条通知。',
    'Collection bug report replies': '合集漏洞报告回复',
    'Receive a notification when someone replies to one of your bug reports on a collection': '当有人在你的合集上的漏洞报告时，接收一条通知。',
    'My Mods': '我的模组',
    'New comments': '新评论',
    'Receive a notification when a user comments on one of your mods': '当有人在你的模组上评论时，接收一条通知。',
    'New bug reports': '新漏洞报告',
    'Receive a notification when a user submits a new bug report on one of your mods': '当有人在你的模组上提交新的漏洞报告时，接收一条通知。',
    'New bug report replies': '新漏洞报告回复',
    'Receive a notification when a user leaves a comment reply on one of your mod\'s bug reports': '当有人在你的模组上的漏洞报告上留下评论回复时，接收一条通知。',
    'Pending images': '待审核图片',
    'Receive a notification when a user adds a new image that needs approval, on one of your mods': '当有人在你的模组上添加新的需要审核的图片时，接收一条通知。',
    'Pending videos': '待审核视频',
    'Receive a notification when a user adds a new video that needs approval, on one of your mods': '当有人在你的模组上添加新的需要审核的视频时，接收一条通知。',
    'Receive a notification when anyone adds a new image on one of your mods': '当有人在你的模组上添加新的图片时，接收一条通知。',
    'Deleted image': '删除图片',
    'Receive a notification when a Team Member deletes an image on one of your mods': '当团队成员删除你的模组上的图片时，接收一条通知。',
    'Deleted video': '删除视频',
    'Receive a notification when a Team Member deletes a video on one of your mods': '当团队成员删除你的模组上的视频时，接收一条通知。',
    'Mod description edits': '模组描述编辑',
    'Receive a notification when a Team Member edits the description on one of your mods': '当团队成员编辑你的模组上的描述时，接收一条通知。',
    'Mod published': '模组发布',
    'Receive a notification when a Team Member publishes one of your mods': '当团队成员发布你的模组时，接收一条通知。',
    'Mod hidden': '模组隐藏',
    'Receive a notification when a Team Member hides one of your mods': '当团队成员隐藏你的模组时，接收一条通知。',
    'Mod unhidden': '模组取消隐藏',
    'Receive a notification when a Team Member unhides one of your mods': '当团队成员取消隐藏你的模组时，接收一条通知。',
    'New mod files': '新模组文件',
    'Receive a notification when a Team Member adds new files to one of your mods': '当团队成员添加新的文件到你的模组时，接收一条通知。',
    'Mod files edited': '模组文件编辑',
    'Receive a notification when a Team Member edits existing files on one of your mods': '当团队成员编辑你的模组上的现有文件时，接收一条通知。',
    'Mod files archived': '模组文件归档',
    'Receive a notification when a Team Member archives existing files on one of your mods': '当团队成员归档你的模组上的现有文件时，接收一条通知。',
    'Receive a notification when a Team Member adds a new article to one of your mods': '当团队成员添加新的文章到你的模组时，接收一条通知。',
    'Updated articles': '更新文章',
    'Receive a notification when a Team Member updates an existing article on one of your mods': '当团队成员更新你的模组上的现有文章时，接收一条通知。',
    'Deleted articles': '删除文章',
    'Receive a notification when a Team Member deletes an article on one of your mods': '当团队成员删除你的模组上的文章时，接收一条通知。',
    'Readme added': 'Readme 添加',
    'Receive a notification when a Team Member adds a readme to one of your mods': '当团队成员添加 Readme 到你的模组时，接收一条通知。',
    'Readme removed': 'Readme 删除',
    'Receive a notification when a Team Member removes a readme from one of your mods': '当团队成员删除你的模组上的 Readme 时，接收一条通知。',
    'Receive a notification when a user comments on one of your collections': '当有人在你的合集上评论时，接收一条通知。',
    'Bug reports created': '漏洞报告创建',
    'Receive a notification when a user creates a new bug report on one of your collections': '当有人在你的合集上创建新的漏洞报告时，接收一条通知。',
    'Bug report comments': '漏洞报告评论',
    'Receive a notification when a user comments on one of your collection bug reports': '当有人在你的合集上的漏洞报告时，接收一条通知。',
    'My Media': '我的媒体',
    'New comments on images': '新图片评论',
    'Receive a notification when a user comments on one of your images': '当有人在你的图片上评论时，接收一条通知。',
    'New comments on supporter images': '新支持者图片评论',
    'Receive a notification when a user comments on one of your supporter images': '当有人在你的支持者图片上评论时，接收一条通知。',
    'New comments on videos': '新视频评论',
    'Receive a notification when a user comments on one of your videos': '当有人在你的视频上评论时，接收一条通知。',

    // https://next.nexusmods.com/settings/emails
    'Emails': '邮箱',
    'Set your email preferences.': '设置你的邮箱偏好。',
    'Receive promotional emails': '接收促销邮件',
    'Opt in or out of promotional emails from us. You may still receive service emails (billing, receipts).': '选择是否接收我们的促销邮件。你仍然会收到服务邮件（账单、收据）。',

    // My reports
    'My reports': '我的报告',
    'You have no reports': '你还没有任何报告',

    // Security https://users.nexusmods.com/account/security
    'Security': '安全',
    'Manage your': '管理你的',
    'info': '信息',
    'privacy': '隐私',
    'security': '安全',
    'Two-factor authentication': '两步验证',
    'ACTIVE': '已激活',
    'Two-factor authentication is an extra layer of security for your Nexus Mods account.': '两步验证是你的 Nexus Mods 账户的额外安全层。',
    'Disable 2FA': '禁用两步验证',
    'Change email': '更改邮箱',
    'Current password': '当前密码',
    'New email': '新邮箱',
    'Enter the': '输入',
    '6-digit verification code': '6 位验证码',
    'generated by the app.': '由应用生成。',
    '2FA key': '两步验证密钥',
    'Verify email': '验证邮箱',
    'Change password': '更改密码',
    'Your password was last updated 2 months ago.': '你的密码最后一次更新于 2 个月前。',
    'New password': '新密码',
    'Confirm new password': '确认新密码',
    'Save changes': '保存更改',
    'Account Recovery (temporarily disabled)': '账户恢复（暂时禁用）',
    'SMS account recovery is no longer available.': 'SMS 账户恢复已不再可用。',
    'Read more about account recovery': '阅读更多关于账户恢复的信息',
    'Delete account': '删除账户',
    'Delete your account': '删除你的账户',
    'Please note: if you delete your account, you won\'t be able to reactivate it.': '请注意：如果你删除你的账户，你将无法重新激活它。',
    'When your account is deleted, we remove all of your Personally Identifiable Information (PII) from our system, including (but not limited to):': '当你删除你的账户时，我们将从系统中删除你所有的个人信息（PII），包括（但不限于）：',
    'Username;': '用户名；',
    'E-mail address;': '邮箱地址；',
    'Profile data;': '资料数据；',
    'Preferences and settings;': '偏好和设置；',
    'Any other information on our systems which is considered PII in compliance with GDPR.': '我们的系统中任何被视为 GDPR 合规的个人信息（PII）。',
    'Your password was last updated 3 months ago.': '你的密码上次更新是在 3 个月前。',


    // Billing
    'Billing': '账单',
    'Your current plan': '当前计划',
    'Unlock amazing features with': '解锁惊人的功能，使用',
    'For questions about billing, contact:': '关于账单的问题，请联系：',
    "Uncapped download speeds": "不限速",
    "Download with no speed limits and get access to exclusive servers around the world.": "享受无速度限制的下载体验，并可连接全球专属高速服务器。",
    
    "One-click downloads": "一键下载",
    "Start the download and installation of an entire collection of mods in just one click.": "只需轻轻一点，即可开始整套模组合集的下载与安装。",
    
    "Instant & multi-threaded downloads": "极速多线程",
    "Get mods faster with the one-click and multi-threaded download capabilities.": "借助一键操作与多线程加速，更快速地获取模组内容。",
    
    "Supporting mod authors": "支持模组作者",
    "We donate monthly to our mod authors to support and thank them for all the work they do.": "我们每月向模组作者提供捐助，以支持并感谢他们的辛勤创作。",
    'Cancel your subscription at anytime, plus a': '随时取消订阅，并获得额外的',
    'refund policy': '退款政策',
    'based on how many mods you download.': '基于你下载的模组数量。',
    'Accelerate all your mod downloads for over 3,800 games.': '加速超过 3,800 款游戏的模组下载。',
    'Try Premium': '免费试用高级版',
    'Free for 3 Days': ' 3 天',
    'Experience the best of Nexus Mods with no commitment.': '体验 Nexus Mods 的最佳功能，无需任何承诺。',
    'Start a 3-day free trial of Premium and see why millions of modders upgrade.': '开始 3 天免费试用高级版，看看为什么数百万模组制作者选择升级。',
    'Unlock max download speeds': '解锁最大下载速度',
    'Get mod collections in one click': '一键获取模组合集',
    'Get rid of Ads — forever': '永远摆脱广告',
    'Support mod creators': '支持模组制作者',
    'Yearly': '每年',
    '$8.99 / month': '$8.99 / 月',
    "$89.99 billed yearly": "每年收费 $89.99",
    'Billed monthly': "每月收费",
    'today': '今天',
    '3-day free trial': '3 天免费试用',
    'Annual subscription': '年度订阅',
    'Monthly subscription': '每月订阅',
    'Card number': '卡号',
    'Expiration date': '过期日期',
    'Security code': '安全码',
    'Name on card': '持卡人姓名',
    'We collect this information to prevent fraud and secure your payment.': '我们收集这些信息以防止欺诈并确保你的支付安全。',
    'You won\'t be charged today and can cancel anytime.': '你今天不会被收费，可以随时取消。',
    'No thanks': '不用了',
    '(Basic membership).': '(普通用户)',

    // https://www.nexusmods.com/stardewvalley/news
    'News & Updates': '新闻和更新',
    'Game News': '游戏新闻',
    'Site News': '站点新闻',
    'By': '作者 ',
    'Read full article': '阅读全文',
    'Features': '特点',
    'Competition news': '竞赛新闻',
    'Game news': '游戏新闻',
    'Mod news': '模组新闻',
    'Author': '作者 ',
    '24 hrs': '24 小时',
    '30 days': '30 天',
    '1 year': '1 年',
    'Range...': '范围...',
    'Competition': '竞赛',
    'Mod News': '模组新闻',
    'More articles': '更多文章',
    'Comments locked': '评论已锁定',
    'You cannot add comments to a mod until it is published.': '你不能在模组发布之前添加评论。',
    'A moderator has closed this comment topic for the time being': '版主暂时关闭了这个评论主题',
    'Content Manager': '内容管理员',
    'Community Manager': '社区管理员',
    'Add A Video': '添加视频',

    'Welcome back,': '欢迎回来,',
    'Add some games to get started': '添加一些游戏开始',
    'Add games': '添加游戏',
    'Games that you favourite will be displayed here': '你喜欢的游戏将显示在这里',
    'Find the mods you want in a collection': '在合集中找到你想要的模组',

    // https://www.nexusmods.com/games/stardewvalley/starter-mods
    'Was this page helpful?': '这个页面有用吗？',
    'Let us know if this page made modding easier, or if something was missing.': '告诉我们如果这个页面使模组制作更容易，或者有什么缺失。',
    'Send feedback': '发送反馈',
    'Start with the essential starter mods and helpful tools to begin your journey.': '从必备的入门模组和有用的工具开始你的旅程。',
    'Install a ready-made set of mods to get started fast': '安装一个准备好的模组集，快速开始',
    'Unlock 1-click install': '解锁一键安装',
    'Free users': '免费用户',
    'follow a few extra guided steps.': '遵循一些额外的指导步骤。',
    'Premium users': '高级用户',
    'install complete setups in one click.': '一键安装完整的模组集。',
    'mods in 1-click with Premium': ' 个模组一键安装',
    'Official Collection': '官方合集',
    'Or get started manually': '或者手动开始',
    'Stage 1': '阶段 1',
    'Core mods': '核心模组',
    'Core mods are required foundation mods that enable other mods to work properly. Install these first to ensure your game is ready for modding.': '核心模组是必需的基模组，使其他模组正常工作。安装这些模组首先确保你的游戏准备好进行模组制作。',
    'Stage 2': '阶段 2',
    'Beginner mods': '入门模组',
    'Beginner mods are fun and useful mods that enhance your experience. These are great first picks to see what modding can do.': '入门模组是有趣且有用的模组，增强你的体验。这些是很好的第一次选择，看看模组制作能做什么。',
    'Modding guides & resources': '模组制作指南和资源',
    'How to mod': '如何制作模组',
    'Written guides & articles': '书面指南和文章',
    'Everything you need to start modding' : '你需要的一切来开始模组制作 ',
    '. Whether you want to use a mod manager or go hands-on.': '。无论你是想使用模组管理器还是亲自上手。',
    'Mod with the Nexus Mods App (Preview)': '使用 Nexus Mods 应用（预览版）制作模组',
    'The easiest way to start modding.': '开始模组制作的最简单方式。',
    'Mod with Vortex': '使用 Vortex 制作模组',
    'Install and manage mods with just a few clicks. No setup needed.': '只需点击几下即可安装和管理模组，无需设置。',
    'The Midnight Ride': '午夜骑行',
    'Modding Guide': '模组制作指南',
    'The Midnight Ride is a modding guide for Fallout 4 that will carefully walk you through how to install all the mods you will need for a perfectly stable, smooth and enjoyable experience.': '午夜骑行是 Fallout 4 的模组制作指南，将仔细引导你如何安装所有你需要的一切，以获得完美稳定、流畅且愉快的体验。',
    'How to Mod Without a Mod Manager': '如何制作模组，无需模组管理器',
    'Prefer to do things manually?': '更喜欢手动操作？',
    'Step-by-step guide for adding mods by hand.': '手动添加模组的逐步指南。',
    'Recommended Mods by Pathoschild': 'Pathoschild 推荐的模组',
    'Top picks from a trusted creator.': '来自可信赖创作者的精选推荐。',
    'Mods handpicked by the developer behind SMAPI.': 'SMAPI 开发者精选的模组。',
    'Learn & discover': '学习 & 发现',
    'Video tutorials & showcases': '视频教程和展示',
    'Helpful video guides and showcases to get you started with modding': '有用的视频指南和展示，帮助你开始模组制作',
    'Connect & discuss': '连接 & 讨论',
    'Community spaces & support': '社区空间 & 支持',
    'Find help and connect with other modders in community spaces such as forums, Discord servers, and social channels. These are great places to ask questions, share tips, and learn from others.': '在社区空间，如论坛、Discord 服务器和社交频道中找到帮助并与其他模组制作者联系。这些是很好的地方提问、分享技巧并从其他人那里学习。',
    'The community server for Stardew Valley.': 'Stardew Valley 的社区服务器。',


    // 添加模组 https://www.nexusmods.com/stardewvalley/mods/add
    'Add a mod: Mod details': '添加模组：模组详情',
    'Your mod page': '你的模组页面',
    'Mod details': '模组详情',
    'Permissions': '权限',
    'Requirements and mirrors': '要求和镜像',
    'Manage files': '管理文件',
    'Publish mod': '发布模组',
    'Adding a mod to the nexus': '添加模组到 Nexus',
    'We need to ask you a few questions about the mod you want to upload, and then we\'ll create you a new page to add in as many details as you like, and after that you\'ll be able to publish the mod to the world!': '我们需要问你几个关于你想上传的模组的问题，然后我们会为你创建一个新页面，添加你喜欢的所有细节，然后你就可以将模组发布到世界！',
    'All fields are mandatory unless stated otherwise.': '所有字段都是必需的，除非另有说明。',
    'Type of file': '文件类型',
    'What type of file are you uploading?': '你上传的是什么类型的文件？',
    'Translation': '翻译',

    // 上传模组
    'Mod category': '模组分类',
    'Please Choose a Category for your file': '请选择一个分类用于你的文件',
    'Can\'t find a category that suits your file? Select the closest category match to your file from the list below and use the drop-down or text-field further down to suggest a new category for your file. If an admin agrees with your category suggestion then a new category will be created and your file will automatically be moved in to this new category.': '找不到适合你文件的分类？从下面的列表中选择与你文件最接近的分类，并使用下面的下拉菜单或文本字段建议一个新的分类用于你的文件。如果管理员同意你的分类建议，那么一个新的分类将被创建，你的文件将自动移动到这个新分类。',
    'Categories suggested by others': '其他建议的分类',
    'You do not need to select a category here if you are already happy with the categories provided in the drop-down list above.': '如果你已经满意于上面的下拉列表中的分类，你不需要在这里选择分类。',
    'Suggest a new category for your file': '建议一个新的分类用于你的文件',
    'You can leave this blank if you are happy with the categories in the drop-down lists above': '如果你满意于上面的下拉列表中的分类，你可以留空。',
    'Mod language': '模组语言',
    'Current version': '当前版本',
    'Author or team name': '作者或团队名称',
    'Brief overview': '简要概述',
    'Many authors often forget to add a basic description of what their mod does, which results in less downloads, less chance that they’ll recommend it to others, and less return visits. To ensure that users understand what your file does, please use 350 characters or less to give a brief description of the basics. BBCode will not work in this area.': '许多作者经常忘记添加他们模组的基本描述，这导致下载量更少，他们推荐给其他人的机会更少，以及更少的回访。为了确保用户理解你的文件做什么，请使用 350 个字符或更少来给出基本的描述。BBCode 在这个区域不起作用。',
    'Characters remaining:': '剩余字符数：',
    'Detailed description': '详细描述',
    'Along with a brief overview, users will want to know everything about your mod. Please go into as much detail as necessary.': '除了简要概述，用户还想了解你的模组的一切。请尽可能详细地描述。',
    'My mod contains': '我的模组包含',
    'In order to filter out certain types of content to those who request it, we ask that you check any of the following that relate to your mod. If you\'re unsure of what \'adult content\' refers to, use our': '为了过滤掉某些类型的内容给那些请求它的人，我们要求你检查任何与你的模组相关的以下内容。如果你不确定 \'成人内容\' 指的是什么，使用我们的 ',
    'guide to gain a better understanding.': ' 指南来获得更好的理解。',
    'Classification': '分类',
    'Character preset(s)': '角色预设',
    'Requires the Content Patcher': '需要 Content Patcher',
    'An entry for the ☢️ Fallout Modathon 2025 event': '☢️ Fallout Modathon 2025 活动的条目',
    'Content related to or referencing real world issues, events, political statements etc.': '与现实世界问题、事件、政治声明等相关的内容。',
    'ReShade or other visual preset(s)': 'ReShade 或其他视觉预设',
    'Save game files': '保存游戏文件',
    'Requires SMAPI (Stardew Valley Modding API)': '需要 SMAPI (Stardew Valley Modding API)',
    'Tested in Version 1.5': '测试于版本 1.5',
    'Translation files': '翻译文件',
    'Compatible with version 1.6': '兼容版本 1.6',
    'Add a mod:': '添加模组：',
    'Edit your mod details:': '编辑你的模组详情：',
    'Opt Out': '退出',
    'Are you sure you want to opt out this mod:': '你确定要退出这个模组吗：',
    'You, and any users you are sharing donations points with, will no longer receive donation points for this mod if you opt-out.': '你，以及你与任何分享捐赠点的人，如果你退出，将不再收到这个模组的捐赠点。',
    'You would have received': '你将收到',
    'for this mod': '这个模组的',
    'Confirm': '确认',

    // 上传翻译
    'Original file your mod is a translation of': '原始文件你的模组是翻译的',
    'We only accept translations for files that are uploaded to Nexus Mods. We do not accept translations for mods that are not uploaded here': '我们只接受翻译文件，这些文件被上传到 Nexus Mods。我们不接受在这里未上传的模组的翻译。',

    'View mod page': '查看模组页面',

    // 上传模组 - 媒体
    'Mod page header area': '模组页面头部区域',
    '(Optional)': '(可选)',
    'This image is for the header area of your mod page.': '这张图片用于模组页面的头部区域。',
    '(not animated) images. Animated GIF images will be converted to a still frame after cropping.': '(非动画) 图片。动画 GIF 图片将在裁剪后转换为静态帧。',
    'Drop a header image here to start cropping': '拖动一张图片到这里开始裁剪',
    'Your mod images': '你的模组图片',
    '(At least 1 required to publish)': '(至少需要 1 张图片才能发布)',
    'To give people a better idea of what they can expect from your mod, some in-game images should be included.': '为了让人们更好地了解你的模组，一些游戏内图片应该被包含。',
    'Drop an image here to upload it': '拖动一张图片到这里上传它',
    'User submitted images': '用户提交的图片',
    'None.': '没有。',
    'Your mod videos': '你的模组视频',
    'Add a new video': '添加一个新视频',
    'For all of your videos, we recommend that you use videos that represent what your mod is about. Try not to use videos that are unrelated to your mod, if the video depicts other mods in action it can be misleading to your users.': '对于所有你的视频，我们建议你使用代表你的模组内容的视频。尝试不使用与你的模组无关的视频，如果视频描绘了其他模组的动作，它可能会误导你的用户。',
    'We accept videos from': '我们接受来自 ',
    'only at the moment.': ' 只有现在。',
    'Video title': '视频标题',
    'Youtube video URL': 'Youtube 视频 URL',
    'Please enter a description for this video.': '请输入视频的描述。',
    'Add this video': '添加视频',
    'Video-share videos': '视频分享区的视频',
    'Prev': '上一步',
    'Edit your mod:': '编辑你的模组：',

    // 上传模组 - 文档
    'Edit fds:': '编辑模组：',
    'Readme, changelog and additional information': 'Readme、变更日志和额外信息',
    'This will be the official readme for your mod. It should encompass all important information, as well as any references to any other documentation you plan on attaching to this page. Here\'s a': '这将是你模组的官方 Readme。它应该涵盖所有重要信息，以及任何你计划附加到这个页面的其它文档的引用。这里有一个 ',
    'good example': '好的例子',
    'of a nicely formatted Readme file if you need a template to start from.': '。如果你需要一个模板来开始，这里有一个格式良好的 Readme 文件的例子。',
    'Drop a readme file here to upload it': '拖动一个 Readme 文件到这里上传它',
    'Or browse for files': '或者浏览文件',
    'Add new changelog': '添加新的变更日志',
    'To allow users to easily discover what you have edited in each update, you should add a list of changes to this log. Versions are sorted according to "natural ordering". We recommend you follow semantic versioning for consistency with other files on the site. Version numbers starting with letters will be considered newer than numerical versions.': '为了让用户轻松发现你在每次更新中编辑了什么，你应该添加一个变更列表到这个日志。版本是根据 "自然排序" 排序的。我们建议你遵循语义版本控制，与其他网站上的其它文件一致。以字母开头的版本号将被认为比数字版本号新。',
    'Input method': '输入方法',
    'Separate text fields': '单独的文本字段',
    'Large text box': '大文本框',
    'Changes': '变更',
    'Entry': '条目',
    'Add row': '添加行',
    'Please write one entry per line': '请每行写一个条目',

    // 上传模组 - 权限
    'Mod page Permissions': '模组页面权限',
    'Commenting and discussion': '评论和讨论',
    'With user comments, I would like:': '对于用户评论，我希望：',
    'This setting is only available to Verified Mod Authors': '这个设置仅适用于已验证的模组作者',
    'A single comment topic and no discussion tab': '一个单独的评论主题和没有讨论标签',
    'A single comment topic and a discussions tab': '一个单独的评论主题和讨论标签',
    'Just a discussions tab': '一个单独的讨论标签',
    'No comments': '没有评论',
    'User permissions': '用户权限',
    'Give users access to edit this mod': '给用户访问编辑这个模组的权限',
    'The following users will be able to edit your mod details. Type a username and click on the add button to grant them permissions.': '以下用户将能够编辑你的模组详情。输入一个用户名并点击添加按钮授予他们权限。',
    'Bug tracker options': '漏洞跟踪选项',
    'Public (users who downloaded your mod can add reports, everyone can see reports)': '公共（下载了你模组的用户可以添加报告，所有人都可以看到报告）',
    'Locked (only authors can add reports, everyone can see reports)': '锁定（只有作者可以添加报告，所有人都可以看到报告）',
    'Private (only authors can add and see reports)': '私人（只有作者可以添加和看到报告）',
    'Disabled': '禁用',
    'Allow users to endorse your file?': '允许用户认可你的文件？',
    // 'Yes': '是',
    'Allow users to tag your file?': '允许用户标记你的文件？',
    'Allow members of this site to tag your files with descriptive words so your file can be found easier.': '允许网站成员用描述性词语标记你的文件，以便更容易找到。',
    'Allow users to upload images for this mod?': '允许用户上传图片用于这个模组？',
    'Yes, without my verification': '是，无需我的验证',
    'Yes, but I must verify the image first': '是，但我必须先验证图片',
    'Allow users to upload videos for this mod?': '允许用户上传视频用于这个模组？',
    'Yes, but I must verify the video first': '是，但我必须先验证视频',
    'Allow users to view your file statistics?': '允许用户查看你的文件统计信息？',
    'Allow users to view the file archive?': '允许用户查看文件存档？',
    'Blocked Users': '被阻止的用户',
    'Mod page blocks': '模组页面阻止',
    'This section shows the users who have been blocked from interacting with this mod page. Blocked users cannot leave comments, create bug reports or add media to the mod page. Users can be blocked using the manage button on any interaction.': '这个部分显示了被阻止与这个模组页面互动的用户。被阻止的用户不能留下评论、创建漏洞报告或添加媒体到模组页面。用户可以使用管理按钮在任何互动中被阻止。',
    'The following users have been blocked from this mod page by the page owner or a team member with edit access.': '以下用户已被页面所有者或具有编辑访问权限的团队成员阻止与此模组页面的互动。',
    'Blocked by': '被阻止者',
    'Global blocks': '全局阻止',
    'The following users have been blocked by the mod page owner from all of their mod pages. Only the mod page owner can remove these blocks.': '以下用户已被模组页面所有者从所有他们的模组页面中阻止。只有模组页面所有者可以删除这些阻止。',
    'No users are blocked from this mod page.': '没有用户被阻止与此模组页面互动。',
    'No users are globally blocked.': '没有用户被全局阻止。',
    'Distribution, credits and permissions': '分发、信用和权限',
    'File distribution': '文件分发',
    'We take file author permissions very seriously and try our hardest to protect file authors from having their content stolen or used without permission. Setting the correct distribution permissions lets other mod makers know how you would like your files to be used, if at all, and allows the staff of the site to properly investigate claims of stolen resources should they arise.': '我们非常认真地对待文件作者的权限，并尽力保护文件作者的内容不被盗用或未经许可使用。设置正确的分发权限让其他模组制作者知道你希望你的文件如何使用，如果有的话，并允许网站的工作人员正确调查被盗资源的索赔应该出现。',
    'If you change these settings then the date and time of the change will be logged. You cannot allow other mod authors to modify or use your resources and then change your mind and expect them to remove your content from their work. As such; if someone releases a file using some of your content before you change your distribution permissions then the staff here will always rule in favour of the person who used your resources as you gave your permission before changing your mind.': '如果你改变这些设置，那么改变的日期和时间将被记录。你不能允许其他模组制作者修改或使用你的资源，然后改变你的想法并期望他们从他们的工作中删除你的内容。因此；如果有人在改变你的分发权限之前使用了一些你的内容发布文件，那么这里的工作人员将总是支持使用你的资源的人，因为你之前给予了许可。',
    'I would like to specify my own permissions in the "Permission instructions" text box below and not use the built-in options': '我希望在下面的 "权限说明" 文本框中指定我自己的权限，而不是使用内置选项',
    'Does your file contain assets used from other authors (that you have permission to use) that can\'t be redistributed without permission?': '你的文件是否包含来自其他作者的资产（你有许可使用），不能在没有许可的情况下重新分发？',
    'Give permission for users to upload my files on other sites?': '允许用户在其他网站上传我的文件？',
    'Yes, but you must credit me as the creator of the file': '是，但你必须注明我是文件的创作者',
    'Give permission for users to convert my mod to work in other games?': '允许用户将我的模组转换为在其他游戏中工作？',
    'Give permission for users to modify my file; including releasing bug fixes or improving on the features my file adds to the game, and upload it as a separate file?': '允许用户修改我的文件；包括发布漏洞修复或改进我的文件添加到游戏的功能，并将其上传为单独的文件？',
    'Yes, no credit or permission needed': '是，不需要信用或权限',
    'Yes, but you must credit me as the original creator': '是，但你必须注明我是原始创作者',
    'Not without permission from me first': '没有我的许可之前不行',
    'Absolutely not under any circumstances': '绝对不行，在任何情况下都不行',
    'Give permission for users to use assets contained in my files in their own files?': '允许用户使用我文件中的资产在他们自己的文件中？',
    'Yes, but you must credit me for all the files you use': '是，但你必须注明我是所有你使用的文件的创作者',
    'Users can not use my assets in any mods/files that are being sold, for money, on Steam Workshop or other platforms': '用户不能使用我的资产在任何模组/文件上，这些模组/文件正在出售，用于金钱，在 Steam Workshop 或其他平台上',
    'Give permission for users to be able to earn Donation Points for their mods if they use my assets?': '允许用户在其模组中使用我的资产以赚取捐赠点数？',
    'Contact me for permission': '联系我获取许可',
    'Additional permission instructions': '额外权限说明',
    'Give specific instructions for people looking to use your assets or maybe note down users you have given permission to use your work.': '给那些想要使用你的资产的人提供具体说明，或者记下你已经给予许可使用你的人。',
    'Credits': '信用',
    'Always credit work that isn\'t yours': '总是注明不是你的作品',
    '. If you have received permission to use someone elses assets in your files you should always credit them. If you don\'t credit assets you\'ve used from other users you will be considered a thief and you\'re likely to be banned; so it\'s very important you credit the work of others that you have used.': '。如果你已经收到了许可使用其他人的资产在你的文件中，你应该总是注明他们。如果你不注明你使用的来自其他用户的资产，你将被认为是一个小偷，你很可能被禁止；因此，非常重要的是你注明你使用的其他人的作品。',
    'Crediting other people\'s work does not entitle you to use their work. You must always get permission from the creator of the work first before you upload it to the site.': '注明其他人的作品并不赋予你使用他们的作品的权利。你必须总是从作品的创作者那里获得许可，在你上传到网站之前。',
    'Allow donations to your file?': '允许用户捐赠你的文件？',

    // 上传模组 - 要求和镜像
    'Mod requirements': '模组要求',
    'If your mod requires specific DLC or other mods in order to work, please specify them here.': '如果你的模组需要特定的 DLC 或其他模组才能工作，请在这里指定它们。',
    'Official mod requirements (DLCs)': '官方模组要求 (DLCs)',
    'None available for this game.': '没有可用的 DLC。',
    'Required mods on the Nexus': 'Nexus 上的所需模组',
    'Start typing a mod name to find it on the Nexus. The mod you pick from this list will be added to the table below.': '开始输入一个模组名称，在 Nexus 上找到它。从列表中选择一个模组，它将被添加到下面的表格中。',
    'Requirement notes': '要求说明',
    'Other required resources': '其它所需资源',
    'Add a name, URL and description for any off-site mods.': '添加一个名称、URL 和描述用于任何离线模组。',
    'Requirement name': '要求名称',
    'Requirement URL': '要求 URL',
    'Add another requirement': '添加另一个要求',
    'Mod mirrors': '模组镜像',
    'If you have uploaded your mod to another site then you can link to that location here.': '如果你已经将你的模组上传到另一个网站，那么你可以在这里链接那个位置。',
    'Mirror name': '镜像名称',
    'Mirror URL': '镜像 URL',
    'Add another mirror': '添加另一个镜像',

    // 上传模组 - 管理文件
    'Add a new file': '添加新文件',
    'Enter the details and then upload the files for your mod. After you’ve saved your file, it will appear at the top of this page and you will be able to make changes, hide it, or remove it completely.': '输入细节并上传你的模组的文件。在你保存你的文件后，它将出现在这个页面的顶部，你可以进行更改、隐藏它，或完全删除它。',
    'Your new file': '新文件',
    'This is the name of your file on the download page for your mod. 50 character limit.': '这是文件在下载页面上的名称。50 个字符限制。',
    'File version': '文件版本',
    'This is the version of your file. 50 character limit.': '这是文件的版本。50 个字符限制。',
    'This is the latest version of the mod (your main version will be updated automatically)': '这是模组的最新版本（你的主版本将自动更新）',
    'File category': '文件分类',
    'Main Files': '主文件',
    'Updates': '更新',
    'Old versions': '旧版本',
    'Archived': '归档',
    'File description': '文件描述',
    'This is the description that will accompany the file name on the download page. 255 character limit.': '这是文件名称在下载页面上的描述。255 个字符限制。',
    'File options': '文件选项',
    'Stardew Valley is compatible with Vortex, the simple and modern mod manager by Nexus Mods. By default, your files will display a ‘Download with Manager’ button for users to install directly into Vortex. You can disable this button for this file, however, this may make it more difficult for users to install your mod. You may also set this upload as the main file, meaning it will be the default file when users click the download button in the top right of your mod page.': 'Stardew Valley 兼容 Vortex，Nexus Mods 的简单和现代的模组管理器。默认情况下，你的文件将显示一个 ‘Download with Manager’ 按钮，用于用户直接安装到 Vortex。你可以禁用这个按钮用于这个文件，然而，这可能会使用户更难安装你的模组。你也可以将这个上传设置为主要文件，这意味着当用户点击模组页面右上角的下载按钮时，它将是默认文件。',
    'Remove the \'Download with manager\' button': '移除 ‘Download with Manager’ 按钮',
    'Set the file as the main Vortex file': '将文件设置为主 Vortex 文件',
    'Attach the file': '附加文件',
    'We only accept .rar, .zip, .7z, .exe, or .omod files. The file size limit is 20GB.': '我们只接受 .rar、.zip、.7z、.exe 或 .omod 文件。文件大小限制为 20GB。',
    'Drop your file here to upload it': '拖动你的文件到这里上传它',
    'Save your file': '保存文件',
    'Upon saving your file, it will be added into the categories at the top of this page and you will have the chance to add more files.': '在你保存文件后，它将被添加到这个页面的顶部分类中，你将有添加更多文件的机会。',
    'Save file': '保存文件',

    // 上传模组 - 文章
    'Write a new article': '撰写新文章',
    'Content': '内容',
    'Article options': '文章选项',
    'Visible': '可见',
    'Allow comment': '允许评论',
    'Save your article': '保存文章',
    'Upon saving your article, it will be added at the top of this page and you will have the chance to add more articles.': '在你保存文章后，它将被添加到这个页面的顶部，你将有添加更多文章的机会。',
    'Discard changes': '放弃更改',
    'Manage articles': '管理文章',

    // 上传模组 - 发布
    'Ready to publish?': '准备发布？',
    'Publish your mod': '发布你的模组',
    'What happens next?': '接下来会发生什么？',
    'During this process, any new files have remained hidden in our database so only you can see them.': '在此过程中，任何新文件都保留在我们的数据库中，因此只有你能看到它们。',
    'Your file remains in this state until you publish. Once published your files become visible to everyone on the Nexus sites and gets added to our "new today", "new recently" and "latest files" sections. It\'s recommended that you take a look at your file page and ensure everything looks and reads exactly how you want it to before you publish your file.': '你的文件会保持在当前状态，直到你选择发布。发布后，你的文件将对所有 Nexus 站点用户可见，并会自动出现在“今日新增”、“最近新增”和“最新文件”等栏目中。我们建议你在发布之前，先仔细检查你的文件页面，确保所有内容的呈现与描述都完全符合你的期望。',
    'When you\'re ready, publish your files, you will be taken to the manage your files area where you can make further changes and track the status of your mod.': '当你准备好时，发布你的文件，你将被带到管理你的文件区域，你可以进行进一步的更改并跟踪你的模组的状态。',
    'I\'m ready, publish my mod': '我准备好了，发布我的模组',
    'Delete my mod': '删除我的模组',
    

    'The mod you are trying to edit has been removed.': '你尝试编辑的模组已被删除。',
    'Mods of the month': '本月模组',
    "Explore this month\'s nominated mods.": "探索本月的提名模组。",
    'The file your mod is a translation of couldn\'t be found.': '你模组的翻译文件无法找到。',
    'Please enter a name for your mod.': '请输入你的模组名称。',
    'Please enter a version for your mod.': '请输入你的模组版本。',
    'Please enter an author for your mod.': '请输入你的模组作者。',
    'Please enter a description for your mod.': '请输入你的模组描述。',

    // https://www.nexusmods.com/modrewards#/mods/*
    // 'The Donation Points system allows mod authors to accumulate, through unique file page downloads, points that can then be redeemed for rewards through our': '捐赠点系统允许模组作者通过独特的文件页面下载积累点数，这些点数可以通过我们的',

    'Media Gallery (': '媒体库 (',
    'ago': '前',
    'Mark all as read (': '标记所有为已读 (',
    'Upload': '上传',
    'Some files not scanned': '一些文件未扫描',
    'All changes have been saved': '所有更改已保存',
    'This is a new version of an existing file (optional)': '这是一个现有文件的新版本（可选）',
    'Edit, remove or hide existing files by using the options below.': '使用下面的选项编辑、删除或隐藏现有文件。',
    'Edit existing files': '编辑现有文件',
    'Edit details': '编辑细节',
    'Upload new version': '上传新版本',
    'Set as main Vortex file': '设置为主 Vortex 文件',
    'Archive': '归档',
    'Select the file your new file is replacing': '选择你的新文件替换的文件',
    'Remove the previous version after this file has been successfully uploaded': '在上传成功后删除之前的版本',
    'You must provide a version for your file.': '你必须提供一个版本用于你的文件。',
    'Set mod to hidden': '设置模组为隐藏',

    // 上传图片 https://www.nexusmods.com/stardewvalley/images/add
    'Adding an image to the nexus': '添加图片到 Nexus',
    'Image details': '图片细节',
    'Image title': '图片标题',
    'Image caption': '图片描述',
    'Optional.': '可选',
    'Upload an image': '上传图片',
    'Or browse for images': '或者浏览图片',
    'Publishing options': '发布选项',
    'Allow users to comment on this image?': '允许用户评论这张图片？',
    'Enable endorsements?': '启用认可？',
    'Is there adult-only content in this image?': '这张图片有成人内容吗？',
    'Nudity is not permitted.': '裸露是不被允许的。',
    'Do not post images that include: breasts, genitalia, buttocks or characters that are wearing next to nothing. For further information consult our': '不要发布包含：胸部、生殖器、臀部或穿着很少的衣服的角色。有关进一步信息，请咨询我们的',
    'adult content guidelines': '成人内容指南',
    'Terms and conditions': '条款和条件',
    'I agree to the': '我同意',
    'terms and conditions': '条款和条件',
    'Publish my image': '发布图片',

    // 上传视频 https://www.nexusmods.com/stardewvalley/videos/add
    'Adding a video to the nexus': '添加视频到 Nexus',
    'At this time we only support YouTube videos.': '目前我们只支持 YouTube 视频。',
    'Video details': '视频细节',
    'Link to video': '视频链接',
    'We accept Youtube links only. Please provide the full video URL in this field, we\'ll take care of the rest.': '我们只接受 YouTube 链接。请在这个字段中提供完整的视频 URL，我们会处理剩下的部分。',
    'Video caption': '视频描述',
    'If the language of your video is not present on the list please use the "Other" option and specify the language in your video title.': '如果视频的语言不在列表中，请使用“其他”选项并在视频标题中指定语言。',
    'Featured mods': '推荐模组',
    'If your video is showcasing files that can be found on the Nexus, please add them below.': '如果你的视频展示了可以在 Nexus 上找到的文件，请在下面添加它们。',
    'Allow users to comment on this video?': '允许用户评论这个视频？',
    'Is there adult-only content in this video?': '这个视频有成人内容吗？',
    'Do not post videos that include: breasts, genitalia, buttocks or characters that are wearing next to nothing. If you mark your video as having no nudity, and it is found to contain nudity, you run the risk of having your account suspended.': '不要发布包含：胸部、生殖器、臀部或穿着很少的衣服的角色。如果你标记你的视频没有裸露，并且它被发现包含裸露，你就有可能被暂停你的账户。',
    'By submitting this video I confirm that all content showcased conforms to the': '通过提交这个视频，我确认所有展示的内容都符合',
    'and that this video is appropriate for all audiences.': '和这个视频适合所有观众。',
    'Publish my video': '发布视频',

    // https://www.nexusmods.com/stardewvalley/images/*
    'More images': '更多图片',
    'View more from uploader': '查看更多',
    'About this image': '关于这张图片',
    'Report an Image': '报告这张图片',
    'Unrelated to Game': '与游戏无关',
    'This image is unrelated to the game page it has been posted on.': '这张图片与它所发布在的游戏页面无关。',
    'Content that promoted piracy, sexualisation of minors, bestiality, etc.': '推广盗版、未成年人性化、动物虐待等内容。',
    'You can block the': '你可以阻止',
    '"AI Generated Content"': '"AI 生成内容"',
    'tag in your': '标签在你的',
    'Unrelated Content': '与游戏无关的内容',
    'Notice': '注意',
    'This user\'s image description contains': '该用户的图片描述包含 ',
    'images. Some authors like to showcase more of their work in their image descriptions or use the image description to provide a storyboard for the image provided.': ' 张图片。有些作者喜欢在图片描述中展示更多作品，或通过图片描述为所提供的图片构建一个故事情节。',
    'You will need to be logged in before you can see this user\'s image description.': '你需要登录才能查看该用户的图片描述。',
    'Latest image endorsers': '最新图片认可者',
    'Latest video endorsers': '最新视频认可者',
    'No members have endorsed this video yet': '还没有用户认可这个视频',
    'No members have endorsed this image yet': '还没有用户认可这个图片',


    // https://www.nexusmods.com/stardewvalley/videos/*
    'Endorsed': '认可',
    'More videos': '更多视频',
    'About this video': '关于这个视频',
    'Report a video': '报告这个视频',
    'The video features content that I disagree with.': '这个视频展示了我不认同的内容。',
    'I believe this video is breaking the rules': '我相信这个视频违反了规则',
    'This video doesn\'t comply with the community guidelines.': '这个视频不符合社区指南。',
    'How does this video break the community rules?': '这个视频如何违反社区规则？',
    'This video features AI generated voices, artwork, etc.': '这个视频使用了 AI 生成的声音、艺术等。',
    'This video is unrelated to the game page it has been posted on.': '这个视频与它所发布在的游戏页面无关。',
    'Video that promotes piracy, sexualisation of minors, bestiality, etc.': '推广盗版、未成年人性化、动物虐待等内容。',
    'This video does not comply with the community standards.': '这个视频不符合社区标准。',
    'This video appears to be spam.': '这个视频似乎是垃圾邮件。',

    // https://www.nexusmods.com/stardewvalley/mods/trackingcentre
    'Authors': '作者 ',
    'Tracked content updates': '关注内容更新',
    'Mods you\'re tracking': '你关注的模组',
    'Last upload': '最后上传',
    'Highlight updates': '突出更新',
    'No highlight': '没有突出更新',
    'Last download': '最后下载',
    'Authors you\'re tracking': '你关注的作者',
    'View author profile': '查看作者资料',
    'Stop tracking this author': '停止关注这个作者',
    'Comments on your files': '你文件的评论',
    'Topic': '主题',
    'Starter': '发起者',
    'by': '作者 ',
    'Official comment topic': '官方评论主题',
    'The comment tracking centre lists all the comment and discussion threads related to all your uploaded files on this site. It is listed in the order of the time of the last post, with the most recent post at the top. You have 2 comment topics across all your files.': '评论关注中心列出了所有与你在这个网站上上传的文件相关的评论和讨论主题。它按照最后回复的时间顺序列出，最近的回复在最上面。你在这个网站上的所有文件共有 2 个评论主题。',
    
    'Latest news': '最新新闻',
    'Date range': '日期范围',
    'account closed': '账户已关闭',
    'Content Team': '内容团队',
    'Moderator': '版主',
    'When you ignore someone on Nexus Mods, you won\'t see the following content from them:': '当你在 Nexus Mods 上忽略某人时，你将不会看到他们发布的以下内容：',
    'Bug Reports': '漏洞报告',
    'They won\'t be notified, and you can still view their profile. Ignored users can still see and interact with your content.': '他们不会收到通知，你仍然可以查看他们的资料。忽略的用户仍然可以查看和与你互动的内容。',
    'This setting does not affect the Nexus Mods forum. You can manage your forum preferences': '这个设置不会影响 Nexus Mods 论坛。你可以管理你的论坛偏好',
    'All media': '所有媒体',
    'Type': '类型',
    'Image': '图片',
    'Video': '视频',
    'Explore this month’s nominated mods.': '探索本月的提名模组。',
    'Current month so far': '本月至今',
    'Uploader:': '上传者：',
    'Kudos Given': '已点赞',

    // https://www.nexusmods.com/*/mods/top
    'Top Lists': '热门列表',
    'Most endorsed files in the last two weeks': '过去两周最受认可的文件',
    'Most endorsed recently added files': '最近最受认可的文件',
    'Most endorsed files of all-time': '所有时间最受认可的文件',
    'Most endorsed files of all-time (non-adult)': '所有时间最受认可的文件（非成人）',
    'Most endorsed files of all-time (adult-only)': '所有时间最受认可的文件（成人）',
    'Top 30 Files in past two weeks:': '过去两周最受认可的30个文件：',
    'Last Update:': '最后更新：',
    'Uploaded: ': '上传于：',
    'You downloaded the most recent version of this mod': '你下载了此模组的最新版本',
    'View image gallery': '查看图片库',
    'Endorse mod': '认可模组',
    'Unendorse': '取消认可',
    'Track this mod': '关注此模组',
    'Stop tracking': '停止关注',
    'Forward 30 »': '前进 30 »',
    '« Back 30 ': '« 后退 30 ',
    'Top 30 recently added files:': '最近最受认可的30个文件：',
    'Mods added in past:': '过去添加的模组：',
    'Filter by category:': '按分类过滤：',

    // https://users.nexusmods.com/account/billing/premium
    'Premium membership': '高级会员',
    'Power-up with': '更多功能，使用',
    'No charge today. Cancel any time': '今天不收费。随时取消',
    'Download your mods faster without any speed limits.': '下载你的模组更快，没有速度限制。',
    'Download and install an entire collection of mods in one click.': '一键下载并安装整个模组合集。',
    'This still applies after your premium subscription ends!': '这个仍然适用于你的高级订阅结束之后！',
    'Not applicable if you cancel before free trial ends.': '如果你在免费试用结束前取消，则不适用。',
    'We\'ve donated': '我们已捐赠',
    '$14 million': ' $1400 万美元 ',
    '$15 million': ' $1500 万美元 ',
    'to our creators to date.': '给我们的创作者迄今为止。',
    'Start your free trial': '开始免费试用',
    'Subtotal': '总计',
    'Saving 17% with yearly': '每年节省 17%',
    'Tax': '税费',
    'Total price after trial': '试用后总价',
    'You will be charged': '将扣费',
    '$89.99': '$89.99',
    'after the': '在结束后',
    '3-day trial': '3 天试用期',
    'You will be charged every year thereafter while the subscription is active. Cancel any time.':
    '在订阅持续有效期间，每年都会自动续费。你可以随时取消。',
    'By continuing with this purchase you agree to the': '通过继续购买，你同意',
    'of the Premium Membership.': '关于高级会员',
    'Plus more:': '更多：',
    'Instant, multi-threaded downloads': '即时、多线程下载',
    '4x more mod results': '4 倍更多模组结果',
    '5x larger inbox': '5 倍更大收件箱',
    'Cancel anytime.': '随时取消。',
    'See refund policy': '查看退款政策',
    'You will be charged every month thereafter while the subscription is active. Cancel any time.': '在订阅持续有效期间，每月都会自动续费。你可以随时取消。',
    'Start your free trial': '开始免费试用',

    // https://www.nexusmods.com/about/careers
    'Work at Nexus Mods': '在 Nexus Mods 工作',
    'Our community is built by gamers, creators, and tech enthusiasts and we’re always looking for people who share that passion.': '我们的社区由玩家、创作者和科技爱好者共同构建，我们始终欢迎那些与我们拥有同样热情的人加入。',
    'Explore open roles': '探索开放职位',
    'Established in 2001, Nexus Mods is the largest video game modding platform on the internet — a household name in the PC gaming ecosystem. Our mission is to make modding easy by providing a platform for people around the world to share their creations with other gamers.': 'Nexus Mods 成立于 2001 年，是互联网上最大的视频游戏模组平台，也是 PC 游戏生态中的标志性品牌。我们的使命是让模组制作变得更加简单，通过为全球用户提供一个分享创作的平台，让创作者与玩家紧密相连。',
    'Available jobs': '可用职位',
    'Benefits of working at Nexus Mods': '在 Nexus Mods 工作的福利',
    '4 - day work week': '四天工作制',
    'We strongly believe in work-life balance and work a four-day week with no reduction in pay.': '我们非常重视工作与生活的平衡，实行四天工作制，薪资不打折。',
    'Holiday': '带薪年假',
    '25 days of annual leave, including bank holidays. Increases with service.': '每年享有 25 天带薪年假（含法定节假日），并随在职年限逐步增加。',
    'Gaming credit': '游戏补贴',
    '£25 / month to spend on games, or your favourite subscriptions.': '每月提供 £25，可用于购买游戏或你喜爱的订阅服务。',
    'Private medical insurance': '私人医疗保险',
    'As part of our wellbeing offering, we provide private medical cover through Bupa.': '作为员工健康福利的一部分，我们通过 Bupa 提供私人医疗保险保障。',
    'Pension': '养老金',
    'Helping you save for the future with our company pension scheme.': '通过我们的公司养老金计划，助你为未来稳健储蓄。',
    'Accessible hiring at Nexus Mods': 'Nexus Mods 的无障碍招聘',
    'Supporting an incredible community of tens of millions of users, we thrive on engaging as many perspectives as possible to make our platform better. We see no reason why our culture should be any different.': '我们支持着一个拥有数千万用户的卓越社区，并始终致力于倾听尽可能多元的声音，让平台不断变得更好。我们的企业文化，同样如此。',
    'So come and join Nexus Mods — and bring the unique voice that will help us shape the world’s largest mod sharing platform for the better.': '因此，欢迎加入 Nexus Mods，带上你独一无二的声音，一同塑造并提升这个全球最大的模组分享平台。',
    'Nexus Mods is an equal opportunity employer and does not tolerate discrimination of any kind.': 'Nexus Mods 是一家平等机会雇主，绝不容忍任何形式的歧视。',
    'If you require any reasonable adjustment, please contact us at': '如果你需要任何合理的调整，请联系我们：',
    '. In your email, please include the role you’ve applied for, your name, and your preferred way of being contacted.': '。在邮件中，请包含你申请的职位、姓名以及联系方式。',
    'Remote or hybrid': '远程或混合',
    'In office': '在办公室',
    'Backend': '后端',
    'Business Services': '商业服务',
    'Frontend': '前端',
    'Design': '设计',
    'Product Management': '产品管理',




    // https://next.nexusmods.com/premium
    'Speed up your': '解锁更好的',
    'modding with': '模组体验通过',
    'PREMIUM': '高级会员',
    "One-click collections": "一键下载合集",
    "Ad-free experience": "无广告体验",
    "No-risk cancel anytime": "随时取消，无任何风险",
    "Fast access to over 450,000 mods on the world’s biggest modding site.": "在全球最大的模组平台，快速获取超 450,000 个模组。",
    "Play your modded games. Faster.": "畅玩你的模组游戏，更快、更顺畅。",
    "Save your time with uncapped speeds and instant downloads. Time better spent playing your favourite modded games.": 
    "无限速、即刻下载，为你节省宝贵时间——把更多时间用来畅玩你最爱的模组游戏。",
    "One click to change the game: collections.": "一键改变游戏体验：模组合集。",
    "Unlock the shortcut to changing your game with new graphics and gameplay. Instead of downloading each mod in a collection separately, enjoy a cup of coffee while we handle the process!":
    "用合集一键解锁全新的画面与玩法。不再逐个下载模组——喝杯咖啡，其余交给我们！",
    "No more Ads. Ever.": "告别广告，从此再无打扰。",
    "Go Premium and never see ads on our site again. The best part? You get to keep this perk, even after your subscription ends!":
    "升级为高级会员，彻底摆脱站内广告。更棒的是——即使订阅到期，这项福利依然属于你！",
    "Support mod creators.": "支持模组创作者。",
    "We’ve now donated over": "我们已累计捐赠超过",
    'Million': '百万',
    "to mod authors. As a Premium member, you’re actively supporting the community by helping us maintain and even increase mod rewards for creators.":
    "给模组作者。作为高级会员，你帮助我们维持并提升创作者奖励，真正为社区发展出一份力。",
    'Here’s what the community is saying': '来自社区的声音',
    'Collection curator': '合集管理员',
    'Modder': '模组创作者',
    'Skyrim gamer': '天际线玩家',
    'Collection Modder': '合集模组创作者',
    'Frequently Asked Questions': '常见问题',
    'What’s included in Premium membership?': '高级会员包含什么？',
    'Premium members enjoy several perks that help to unlock the full potential of modding:': '高级会员享受多项福利，助你充分发挥模组潜力：',
    'Uncapped downloads speeds': '无限制下载速度',
    'Instant downloads (no delay/countdown)': '即时下载（无延迟/倒计时）',
    'Multi-threaded downloads': '多线程下载',
    'Ad free browsing (forever - even after the Premium membership expires!)': '无广告浏览（永久有效 - 即使高级会员订阅到期！）',
    'Access to the (exclusive) Supporter Image share': '访问（专属）支持者图片分享',
    'The ability to choose a preferred download server': '选择首选下载服务器的能力',
    'Viewing more mods per page': '每页查看更多模组',
    'Additional space for personal messages': '额外空间用于个人消息',
    'What does “one-click collections” mean?': '“一键下载合集”是什么意思？',
    'Collections are entire lists of mods that can be downloaded and installed in one go using our mod manager Vortex, which is available for free. While free users can access collections, they will need to trigger the download of every mod in a collection separately. As a Premium user, however, you can start the download and installation of an entire collection with one action, sit back and completely transform your game with ease.': '合集是整个模组的列表，可以使用我们的模组管理器 Vortex 一键下载和安装。免费用户可以访问合集，但他们需要分别触发每个模组的下载。然而，作为高级会员，你可以一键开始下载和安装整个合集，坐等轻松改变你的游戏。',
    'Do I get to keep any perks once my Premium membership expires?': '我的高级会员订阅到期后，还能保留哪些福利？',
    'Yes! When your Premium membership expires, your account status will be marked as “Supporter” to honour you for giving back to our site and community. As a Supporter, you will never see ads on our site again and you will retain access to the Supporter image share.': '是的！当你的高级会员订阅到期时，你的账户状态将被标记为“支持者”，以表彰你对我们的网站和社区的贡献。作为支持者，你将永远不会再次看到我们的网站上的广告，并且你将保留对支持者图片分享的访问权限。',
    'You will, however, lose access to uncapped download speeds and one-click collections, unless you choose to re-subscribe and become a Premium member again.': '然而，你将失去无限制下载速度和一键下载合集的访问权限，除非你选择重新订阅并再次成为高级会员。',
    'Do I get to keep my (installed) mods when my Premium membership expires?': '我的高级会员订阅到期后，还能保留哪些模组？',
    'Yes, absolutely. Any mods you install, whether as a free user or a Premium user, are installed locally on your PC/console. Whether your Premium membership expires or whether you lose access to your account - in any event you get to keep the mods you installed on your computer.': '是的，绝对可以。无论你是免费用户还是高级会员，安装的模组都会安装在你的 PC/控制台上。无论你的高级会员订阅到期还是失去账户访问权限 - 无论哪种情况，你都可以保留你安装在电脑上的模组。',
    'Can I get a refund?': '我可以获得退款吗？',
    'Absolutely, going Premium is risk free as we will refund you, should you so desire, based on the amount of mods you have downloaded in the meantime, provided that you send a refund request to support@nexusmods.com within 14 days of purchase.': '是的，升级为高级会员是零风险，只要你愿意，我们将在你下载模组期间根据你下载的模组数量退还你，只要你在此购买后 14 天内发送退款请求到 support@nexusmods.com。',
    'Please refer to our': '请参考我们的',
    'terms of service': '服务条款',
    'to view details regarding our refund policy.': '查看我们的退款政策的详细信息。',

    // https://www.nexusmods.com/skyrim/mods/*?tab=forum
    'Forum': '论坛',
    'Forum topics': '论坛主题',
    'Add topic': '添加主题',
    'Topic title': '主题标题',
    'Add a new topic': '添加新主题',
    'Subject': '主题',
    'Topic content': '主题内容',
    'Official endorsements topic': '官方认可主题',
    'BANNED': '封禁',
    'This comment has been': '这条评论已被',
    'hidden': '隐藏',
    'a moderator': '版主',
    'This content breaches our': '这条内容违反了我们的',
    'Load more comments': '加载更多评论',
    'Reason: Terms of service violation': '原因：服务条款违反',
    'Badge': '徽章',

    // https://www.nexusmods.com/videos 
    'All videos': '所有视频',
    'Most viewed': '最受欢迎',
    "Funny": "搞笑",
    "General": "综合",
    "Individual showcase": "个人展示",
    "Interview": "采访",
    "Review": "评测",
    "Story-driven": "剧情向",

    // 所有标签
    // 总分类
    "Attributes": "属性",
    "Balance": "平衡",
    "Compatibility": "兼容性",
    "Components": "组件",
    "Content and realism": "内容与真实感",
    "Contests/Events": "竞赛 / 活动",
    "Landscape and Environment": "景观与环境",
    "Nexus Mods Events": "Nexus Mods 活动",
    "Resources": "资源",

    // 子分类 - Attributes
    "AI-Generated Content": "AI 生成内容",
    "Bug Fixes": "漏洞修复",
    "Character Preset": "角色预设",
    "Collection Asset": "合集资源",
    "Compilation": "整合包",
    "Gameplay": "游戏玩法",
    "ini tweak": "ini 调整",
    "Official": "官方",
    "Overhaul": "全面改造",
    "Performance Optimization": "性能优化",
    "Quality of Life": "品质提升",
    "Replacer": "替换",
    "ReShade": "ReShade",
    "Total Conversion": "完全重制",

    // 子分类 - Audio
    "Music": "音乐",
    "Sound FX": "音效",
    "Voice Acting": "配音",

    // 子分类 - Balance
    "Cheating": "作弊",
    "Fair and balanced": "公平平衡",
    "Unbalanced": "不平衡",

    // 子分类 - Compatibility
    'Android Compatible': 'Android 兼容',
    'Broken in Version 1.2': '在版本 1.2 中损坏',
    'Broken in Version 1.3': '在版本 1.3 中损坏',
    'Broken in Version 1.4': '在版本 1.4 中损坏',
    'Broken in Version 1.5': '在版本 1.5 中损坏',
    'Broken in Version 1.6': '在版本 1.6 中损坏',
    'Compatibility Patch': '兼容性补丁',
    'Version 1.2 Compatible': '版本 1.2 兼容',
    'Version 1.3 (Android) Compatible': '版本 1.3 (Android) 兼容',
    'Version 1.3 Compatible': '版本 1.3 兼容',
    'Version 1.4 (Android) Compatible': '版本 1.4 (Android) 兼容',
    'Version 1.4 Compatible': '版本 1.4 兼容',
    'Version 1.5 (Android) Compatible': '版本 1.5 (Android) 兼容',
    'Version 1.5 Compatible': '版本 1.5 兼容',
    'Version 1.6 Compatible': '版本 1.6 兼容',

    // 子分类 - Components
    "Animation - Modified": "动画 - 修改版",
    "Animation - New": "动画 - 新增",
    "Camera": "镜头",
    "Lighting": "光照",
    "Menu Replacer": "菜单替换",
    "Models/Meshes": "模型 / 网格",
    "Portrait": "肖像",
    "Races - New": "种族 - 新增",
    "Sprites": "贴图元素",
    "Textures": "纹理",
    "Visual Effects/Particles": "视觉效果 / 粒子",

    // 子分类 - Content and realism
    "Anime": "动漫",
    "Horror": "恐怖",
    "Humour, Joke or Just for Fun": "幽默 / 玩笑 / 纯娱乐",
    "LGBTQ+": "LGBTQ+",
    "Not Safe For Work": "工作环境不宜",
    "Real World Issues": "现实议题",
    "Related to Movies/TV/Books/Other Games": "影视 / 书籍 / 其他游戏相关",
    "Saved games": "存档",
    "Unrealistic": "非现实",

    // 子分类 - Contests/Events
    'Fallout Modathon 2025': 'Fallout Modathon 2025',

    // 子分类 - Landscape and Environment
    'Foliage (Plants)': '植被 (植物)',
    'Sky': '天空',
    'Terrain': '地形',
    'Water': '水',
    'Weather': '天气',

    // 子分类 - 语言
    'Chinese': '中文',
    'English': '英语',
    'Czech': '捷克语',
    'French': '法语',
    'German': '德语',
    'Hungarian': '匈牙利语',
    'Italian': '意大利语',
    'Japanese': '日语',
    'Korean': '韩语',
    'Mandarin': '普通话',
    'Other languages': '其他语言',
    'Polish': '波兰语',
    'Portuguese': '葡萄牙语',
    'Russian': '俄语',
    'Turkish': '土耳其语',
    'Ukrainian': '乌克兰语',
    'Spanish': '西班牙语',
    'Dutch': '荷兰语',

    // 子分类 - Resources
    'Modder\'s Resource': '模组创作者资源',
    'Non-Playable Resource': '非可玩资源',
    'Tutorials for Modders': '模组创作者教程',
    'Tutorials for Players': '玩家教程',
    'Utilities for Modders': '模组创作者工具',
    'Utilities for Players': '玩家工具',
    'Stay Home. Make Mods.': '宅家做模组',

    // 杂类
    '20 Years of Modding 2021': '模组20周年（2021）',
    'Animations': '动画',
    'Appearance': '外观',
    'Armour and Clothing': '护甲与服装',
    'Modders Resources': '模组作者资源',
    'Scripts': '脚本',
    'Utilities': '实用工具',
    'Vehicles': '载具',
    'Weapons': '武器',


    // 用户状态
    'Banned': '封禁',
    'Curator': '合集创建者',
    'Delete': '删除',
    'Edit post': '编辑帖子',

    'Has Collections': '有合集',
    'See All': '查看全部',
    'Copyright © 2025 Black Tree Gaming Ltd. All rights reserved.': '版权所有 © 2025 Black Tree Gaming Ltd. 保留所有权利。',


    // https://next.nexusmods.com/notifications/all
    'Unread': '未读',
    'Filters': '过滤',
    'Wallet': '钱包',
    'Mark as unread': '标记为未读',
    'Mark all as Read': '标记全部为已读',
    'Delete all': '删除全部',
    'Notifications are automatically deleted after 90 days.': '通知将在 90 天后自动删除。',
    'You are all up to date': '所有内容均为最新',
    'Are you sure you want to delete all notifications?': '你确定要删除所有通知吗？',
    'No notifications right now': '现在没有通知',
    'You are up-to-date': '已是最新状态',


    'Endorsement reminder': '认可提醒',
    'You have no unread notifications': '你没有未读通知',
    'Not found': '未找到',
    'The mod you were looking for couldn\'t be found': '你正在寻找的模组无法找到',
    'to': '到',
    'No. of endorsements': '认可数',

    // https://users.nexusmods.com/?goal=*  
    'Log in to': '登录',
    'You need to': '你需要',
    'log in': '登录',
    'before continuing.': '才能继续。',
    'Email or Username': '邮箱或用户名',
    'Password': '密码',
    'Forgot your': '忘记你的',
    'Log in': '登录',
    'Need an account?': '需要一个账户？',
    'Register here': '点击这里注册',
    'Show/hide password': '显示/隐藏密码',
    'Register': '注册',
    'Log in to view adult content': '登录以查看成人内容',
    'You have to be logged in to download files': '你需要登录才能下载文件',
    'Log in to search comments': '登录以搜索评论',
    'Your favourited games will be displayed here': '你收藏的游戏将显示在这里',
    'Please enter your Two-factor Authentication code': '请输入你的两步验证码',
    'Not you? click here': '不是你？点击这里',
    'Dont have access to your authenticator app?': '无法使用你的认证应用？',
    'Verify': '验证',
    'Incorrect 2FA code': '错误的两步验证码',
    'Too many attempts. Please try again later.': '尝试次数过多，请稍后再试。',
    'Forgot password?': '忘记密码？',
    'Enter the username or email for your account so we can send you a link to reset your password.': '输入你的用户名或邮箱，我们将发送一个链接来重置你的密码。',
    'Send email': '发送邮件',

    // 注册
    'Step 1 of 3': '步骤 1 / 3',
    'Join': '加入',
    '69 Million': '6900万',
    'players': '玩家',
    'Already have an account?': '已经有一个账户？',
    'Sign in': '登录',
    'Register for free now or upgrade your experience with extra perks and support Nexus Mods by becoming a': '立即注册免费账户，或升级为高级会员，享受更多特权并支持 Nexus Mods，成为一名',
    'Premium Member': '高级会员',
    'Email': '邮箱',
    'Please see our': '请参阅我们的',
    'Step 2 of 3': '步骤 2 / 3',
    'Verify your email address': '验证你的邮箱地址',
    'Sent Code': '已发送验证码至',
    'Resend email': '重新发送验证码',
    'Enter your 4-digit code': '输入你的 4 位验证码',
    'Didn\'t receive your code?': '没有收到验证码？',
    'See our help article': '查看我们的帮助文章',
    'Error': '错误',
    'Invalid validation code. Please try again.': '无效的验证码，请重试。',
    'Too many validation attempts. Please try again later.': '验证码尝试次数过多，请稍后再试。',
    'Popular games': '热门游戏',
    'Step 3 of 3': '步骤 3 / 3',
    'Create account': '创建账户',
    'Confirm password': '再次输入密码',
    'I agree to receive news and information from Nexus Mods by email': '我同意接收 Nexus Mods 的新闻和信息邮件',
    'By signing up you agree to our': '通过注册，你同意我们的',
    'Create my account': '创建账户',
    'Name has already been taken': '用户名已被占用',

    // Network statistics
    'Network statistics': '数据统计',
    'Can\'t see the stats?': '看不到统计数据？',
    'Site Stats': '站点统计',
    'New Files': '新文件',
    'New Videos': '新视频',
    'New Images': '新图片',
    'New Registrations': '新注册',
    'PERMALINK:': '永久链接：',
    'BROWSE:': '浏览：',
    'Downloadable files': '可下载文件',
    'Members with files': '有文件的用户',
    'Total file database size': '总文件数据库大小',
    'File images': '文件图片',
    'File views': '文件浏览量',
    'Confirmed tags': '已确认标签',
    'Tracked files': '已关注文件',
    'Image-share': '图片分享',
    'Network': '网络',
    'Topics': '主题',
    'Topic views': '主题浏览量',
    'Profile views': '资料浏览量',
    'Stored PMs': '已存储的私信',

    // https://www.nexusmods.com/about#current-positions
    'Join one of the biggest gaming websites': '加入最大的游戏网站之一',
    'Are you passionate about games?': '你对游戏充满热情吗？',
    'View jobs': '查看职位',
    'Community Users': '社区用户数',
    'File Downloads': '文件下载量',
    'Hosted Files': '托管文件数',
    'Modding Site': '模组网站',
    'About Us': '关于我们',
    'Nexus Mods is not only one of the most highly trafficked UK based websites worldwide, but one of the most popular gaming websites on the internet. Since 2001 we have made it our mission to provide a platform for people around the world to share their mods and tools freely with other gamers so they too can enjoy their creations.':'Nexus Mods 不仅是全球访问量最高的英国网站之一，也是互联网上最受欢迎的游戏网站之一。自 2001 年以来，我们始终致力于为全球玩家提供一个自由分享他们的模组和工具的平台，让更多玩家能够一起体验并享受这些原创作品。',
    'Gamers can mod their games manually by downloading mods that other users upload to our site or they can make use of our desktop software, Vortex, that helps to automate the process. Every month we continue to support modding for more games both on our website and through Vortex as we continue to grow organically based on the demands of our community.':'玩家可以通过手动下载其他用户上传到我们网站的模组来修改游戏，也可以使用我们的桌面软件 Vortex，通过自动化方式更轻松地完成模组安装。随着社区需求的不断增长，我们每个月都会持续为更多游戏提供模组支持，无论是在我们的网站上，还是通过 Vortex。',
    'High Spec Hardware':'高规格硬件设备',
    'Modern office':'现代化办公环境',
    'A fast-growing company':'高速成长的公司',
    'Fun & friendly environment':'有趣且友好的工作氛围',
    'Working at Nexus Mods': '在 Nexus Mods 工作',
    'Nexus Mods is staffed by a team of committed gamers who are passionate about the work they do. Our team work from a main office in the historical and cultural city of Exeter, Devon, in the south west of England, which is consistently voted top of quality of life surveys for England and Wales.':'Nexus Mods 的团队由一群对自己工作充满热情的忠实玩家组成。我们的团队主要在英国西南部德文郡的埃克塞特办公，这是一座拥有悠久历史与丰富文化的城市，并在英格兰和威尔士的生活质量评选中始终名列前茅。',
    'The office culture is relaxed yet professional with flexibility to accommodate families and lifestyles accordingly. Most of all, we can guarantee that your work will be interesting and rewarding, seen and used by millions of people around the world each month.':'我们的办公文化轻松而专业，并具备足够的灵活性，能够兼顾家庭与个人生活方式。最重要的是，我们可以保证你的工作将既有趣又富有成就感，每个月都会被全球数百万用户看到并实际使用。',
    'Diversity and Inclusion':'多元化与包容',
    'We celebrate diversity and want you to bring your whole self to work.':'我们拥抱多元文化，并鼓励你以完整而真实的自我投入工作。',
    'Supporting an incredible community of tens of millions of users, we thrive on engaging as many views as possible to improve our platform. We see no reason why our culture should be any different.':'我们支持着一个由数千万用户组成的庞大社区，积极吸纳各方观点以改进我们的平台，而我们的企业文化同样应当保持这种多元性与开放性。',
    'We undertake Diversity, Inclusion and Belonging training to be more aware of diverse views and of our own biases to make sure we don\'t leave anyone feeling unheard or left behind.':'我们持续进行多元化、包容与归属感相关的培训，以更好地理解不同观点并认识到自身可能存在的偏见，确保没有人被忽视或被排除在外。',
    'So come and work for Nexus Mods, and bring that unique voice that will help us shape the biggest mod sharing platform in the world for the better.':'加入 Nexus Mods，让你的独特声音帮助我们把全球最大的模组分享平台建设得更加完善。',
    'The Team':'团队',
    'Our user base continues to grow, as does our need for highly talented and energetic individuals. At Nexus Mods we\'re passionate about supporting modding communities and making modding as easy as possible for gamers worldwide. If you share our passion for gaming and modding then we\'d love to work with you.':'随着用户群持续扩大，我们对高素质且充满活力的人才需求也在不断增长。在 Nexus Mods，我们致力于支持模组社区，并让全球玩家尽可能轻松地进行模组创作与安装。如果你也对游戏和模组抱有同样的热情，我们非常期待与你共事。',
    'Current Positions': '当前职位',
    'If you\'re interested in having a chat with us, get in touch at': '如果你有兴趣与我们聊一聊，请联系我们：',
    'Some stats could be retrieved at this time': '目前无法获取统计数据',

    'Total DLs:': '总下载量：',
    'Unique DLs:': '独立下载量：',
    'Log in to add topic': '登录以添加主题',
    'Untracked': '取消关注',
    'Captcha challenge failed. Please try again. Need help or can\'t see the challenge?': '验证码验证失败，请重试。需要帮助，或无法看到验证内容？',
    'Troubleshoot login issues': '解决登录问题',
    // https://help.nexusmods.com/
    'Categories': '分类',
    'Policies and Guidelines': '政策和指南',
    'Important documents regarding the use of Nexus Mods services.': '关于使用 Nexus Mods 服务的相关重要文件。',
    'Account Settings': '账户设置',
    'Website Features': '网站功能',
    'Sort by Default': '默认排序',
    'Sort A-Z': '按 A-Z 排序',
    'Sort by Popularity': '按受欢迎度排序',
    'Sort by Last Updated': '按最后更新排序',
    'Moderation Policy': '管理政策',
    'Forum and Commenting Guidelines': '论坛和评论指南',
    'Adult Content Guidelines': '成人内容指南',
    'Donation Points System Rules': '捐赠点系统规则',
    'Donation Options & Guidelines': '捐赠选项和指南',
    'API Acceptable Use Policy': 'API 可接受使用政策',
    'Guidelines for Collections': '合集指南',
    'Premium Membership Terms and Conditions': '高级会员条款和条件',
    'Best Practices for Mod Authors': '模组作者最佳实践',
    'File Submission Guidelines': '文件提交指南',

    // https://forums.nexusmods.com/messenger/
    'Activity': '活动',
    'Search...': '搜索...',
    'Create': '创建',
    'Everywhere': '所有',
    'Create new content': '创建新内容',
    'Messages': '消息',
    'Inbox': '收件箱',
    'Add Folder': '添加文件夹',
    'Select Rows': '选择文件夹',
    'None': '无',
    'Select rows based on type': '按类型选择文件夹',
    'Sort By': '排序方式',
    'Recently Updated': '最近更新',
    'Start Time': '开始时间',
    'Filter By': '按类型过滤',
    'All Conversations': '所有对话',
    'Conversations I Started': '我发起的对话',
    'Conversations Others Started': '其他人发起的对话',
    'Read': '已读',
    'Mark all read': '标记所有已读',
    'Empty': '空',
    'Compose New': '撰写新消息',
    'Search messages in this folder...': '搜索此文件夹中的消息...',
    'There are no messages to display.': '没有消息要显示。',
    'Search In...': '搜索...',
    'Recipient name': '收件人名称',
    'Sender name': '发件人名称',
    'No message selected': '没有选择消息',
    'Community Activity': '社区活动',
    'Mark site read': '标记站点已读',
    'Add folder': '添加文件夹',
    'Enter a folder name': '输入文件夹名称',
    'Can\'t find who you\'re looking for? Visit their Nexus Mods profile page to message them.': '找不到你想找的人？访问他们的 Nexus Mods 个人资料页面与他们联系。',
    'Insert image from URL': '从 URL 插入图片',
    'Send': '发送',
    'Your Current Rank': '当前等级',
    'My Attachments': '我的附件',
    'Manage Followed Content': '管理关注的内容',
    'Ignored Users': '忽略的用户',
    'Sign Out': '退出登录',
    'Manage your account settings, and set up social network integration.': '管理你的账户设置，并设置社交网络集成。',
    'Display Name': '显示名称',
    'Email Address': '邮箱地址',
    'Profile Status': '资料状态',
    'Other Settings': '其他设置',
    'Notification Settings': '通知设置',
    'Edit Profile': '编辑资料',
    'Recently Used Devices': '最近使用的设备',
    'Content View Behavior': '内容查看行为',
    'Contact Us': '联系我们',
    'Powered by Invision Community': '由 Invision Community 提供支持',
    'Overview': '概览',
    'When opening content...': '正在打开内容…',
    'Don\'t load content in the background': '不在后台加载内容',
    'Take me to the beginning': '回到开头',
    'Take me to the latest comment': '跳转到最新评论',
    'Take me to comments I haven\'t read': '跳转到我未读的评论',
    'Options': '选项',
    'Your Notifications': '你的通知',
    'Achievements': '成就',
    'Notification List': '通知列表',
    'Newsletter': '新闻通讯',
    'Followed Content': '关注的内容',
    'Messenger': '消息',
    'Mentions & My Content': '提及和我的内容',
    'Event Reminders': '事件提醒',
    'Notification Types Available': '可用的通知类型',
    'We\'ll show you these notifications when you visit the community - just click the bell icon.': '当你访问社区时，我们会显示这些通知 - 只需点击铃铛图标。',
    'Notifications that we send as an email go to': '我们发送的通知作为电子邮件发送到的地址',
    'Stop all email notifications': '停止所有电子邮件通知',
    'These notifications will be sent when you earn a new rank or badge.': '这些通知将在你获得新的等级或勋章时发送。',
    'Cover Photo': '封面照片',
    'See my activity': '查看我的活动',
    'Joined': '已加入',
    'Last visited': '最后访问 ',
    'Your Achievements': '你的成就',
    'Nexus Mods Profile': 'Nexus Mods 资料',
    'Currently': '当前',
    'Recent Profile Visitors': '最近访问者',
    'The recent visitors block is disabled and is not being shown to other users.': '最近访问者块已禁用，不会显示给其他用户。',
    'No restrictions being applied': '没有应用限制',
    'No followers': '没有关注者',
    'Just now': '刚刚',
    'Allow others to follow me': '允许其他人关注我',
    'Don\'t allow others to follow me': '不允许其他人关注我',
    'When other users follow you, they will be notified when you post new content': '当其他用户关注你时，当你发布新内容时，他们会收到通知',
    'There are no recent visitors to show': '没有最近访问者要显示',
    'Configure': '配置',
    'Are you sure you want to mark all content in the community as read?': '你确定要标记社区中的所有内容为已读吗？',
    'OK': '确定',
    'Mark all content on the site as read': '标记站点上的所有内容为已读',
    'Signed in as': '已登录为',
    'Updating display name here when': '更新显示名称在这里当',
    'Nexus Mods username': ' Nexus Mods 用户名 ',
    'changes': '更改',
    'Updating email address here when': '更新邮箱地址在这里当',
    'Nexus Mods email address': ' Nexus Mods 邮箱地址 ',
    'Use my': '使用我的',
    'Nexus Mods photo': ' Nexus Mods 照片 ',
    'as my profile photo': '作为我的资料图片',
    'Update preferences': '更新设置',
    'Attachment Quota': '附件配额',
    'Upload Date': '上传日期',
    'Filename': '文件名',
    'Tell a friend': '告诉朋友',
    'Love Nexus Mods Forums? Tell a friend!': '喜欢 Nexus Mods 论坛？告诉你的朋友！',
    'Active Topics': '活跃主题',
    'Popular Game Communities': '热门游戏社区',
    '· Started': '· 开始于 ',
    'Game Communities': '游戏社区',
    'Online Users': '在线用户',
    'Guidelines': '指南',
    'Staff': '管理员',
    'Nexus Mods Hub': 'Nexus Mods 中心',
    'Modding Discussion': '模组讨论',
    'The Lounge': '休闲区',
    'Start new topic': '创建新主题',
    'Toggle this category': '隐藏此分类',
    'No posts here yet': '暂无帖子',
    'posts': '帖子',
    'Preview available now.': '预览现在可用。',
    'replies': '回复',
    'reply': '回复',
    'views': '查看',
    'Tagged with:': '标签：',
    'Posted': '发布于',
    'Follow': '关注',
    'Reply to this topic': '回复此主题',
    'Report': '举报',
    'Share': '分享',
    'Go to topic listing': '前往主题列表',
    'Next unread topic': '下一个未读主题',
    'Your content will need to be approved by a moderator': '你的内容需要被管理员批准',
    'Reply to this topic...': '回复此主题...',
    'Recently Browsing': '最近浏览',
    'More sharing options...': '更多分享选项...',
    'Follow this content': '关注此内容',
    'Site Support': '站点支持',
    'in': ' 在 ',
    'Create New Topic': '创建新主题',
    'Moderator Options': '管理员选项',
    'After posting...': '发布后...',
    'Hide topic': '隐藏主题',
    'Add Tags...': '添加标签...',
    'Poll': '投票',
    'Type tags separated by commas.': '输入标签，用逗号分隔。',
    'Each tag should be at least 2 characters long.': '每个标签至少需要 2 个字符。',
    'Drag files here to attach, or': '拖动文件到这里附件，或',
    'choose files...': '选择文件...',
    'Max total size:': '最大总大小：',
    'Other Media': '其他媒体',
    'Insert existing attachment': '插入附件',
    'Follow topic': '关注主题',
    'You do not have any existing attachments.': '你没有附件。',
    'Clear Selection': '清除选择',
    'Insert Selected': '插入选择',
    'Submit Topic': '提交主题',
    'Poll title': '投票标题',
    'Make voter names public?': '公开投票者名称？',
    'Automatically close poll on specific date?': '自动关闭投票于特定日期？',
    'Question title': '问题标题',
    'Choices': '选项',
    'Add Choice': '添加选项',
    'Multiple choice question?': '多选问题？',
    'Add Question': '添加问题',
    'Poll close date': '投票关闭日期',
    'Top Games': '热门游戏',
    'Mark forum as read': '标记论坛为已读',
    'Start Date': '开始日期',
    'Most Viewed': '最受欢迎',
    'Most Replies': '最多回复',
    'Custom': '自定义',
    'Custom Sort': '自定义排序',
    'Filter': '过滤',
    'Unlocked': '已解锁',
    'Popular now': '现在热门',
    'Moved': '已移动',
    'Topics I started': '我发起的主题',
    'Topics I\'ve posted in': '我参与过的主题',
    'Last post date': '最后回复日期',
    'Name of last poster': '最后回复者的名称',
    'Name of topic starter': '主题发起者的名称',
    'Sort Direction': '排序方向',
    'Descending (newest first)': '降序（最新优先）',
    'Ascending (oldest first/alphabetically)': '升序（最旧优先/字母顺序）',
    'Last Reply': '最后回复',
    'Anytime': '任何时间',
    'Today': '今天',
    // 'Last 5 Days': '最近 5 天',
    'Page number' : '页码',
    'Next page': '下一页',
    'Last page': '最后一页',
    'Previous page': '上一页',
    'Last reply by': '最后回复者：',
    'Who\'s Online': '当前在线用户 ',
    '(See full list)': '（查看完整列表）',
    'See who follows this': '查看谁关注了此内容',
    'Condensed View: Show topics as a list': '紧凑视图：显示主题为列表',
    'Expanded View: Show topics with a preview of the post': '扩展视图：显示主题及其帖子的预览',
    'Select Forum': '选择论坛',
    'Continue': '继续',
    'Online User List': '在线用户列表',
    'Logged In': '已登录',
    'Community Champion': '社区先锋',
    'Guests': '访客',
    'Moderators': '版主',
    'Nothing to show': '暂无内容',
    'There are no users that match your criteria': '没有符合条件的用户',
    'Follow member': '关注他',
    'See their activity': '查看他的活动',
    'Profile Fields': '资料字段',
    'Follow this member': '关注此用户',
    'request': '请求',
    'follower': '关注者',
    'All Activity': '所有活动',
    'Event Comments': '事件评论',
    'View Profile': '查看资料',
    'Ignoring a user allows you to block some or all of their content from showing. Users are not notified that you are ignoring them.': '忽略一个用户会隐藏他们的内容和活动对你，包括模组、图片、视频、合集、评论、漏洞报告和通知。忽略的用户仍然可以查看和与你互动的内容。他们不会收到通知，你仍然可以访问他们的资料。',
    'Add new user to ignore list': '添加新用户到忽略列表',
    'Enter a member\'s name to set ignore options': '输入一个成员的名字来设置忽略选项',
    'Users currently being ignored': '当前被忽略的用户',
    'Mentions': '提及',
    'There are no results to display.': '没有结果显示。',
    'Change how the notification is sent': '更改通知发送方式',
    'Ignore:': '忽略：',
    'Add User': '添加用户',
    'Change ignored content': '更改忽略内容',
    'Stop ignoring user': '停止忽略用户',
    'Go to inbox': '前往收件箱',
    'Update Preferences': '更新偏好',
    'Search the Community': '搜索社区中的内容',
    'Search Term': '关键词',
    'Content Search': '内容搜索',
    'Member Search': '用户搜索',
    'Search By Tags': '按标签搜索',
    'Content Type': '内容类型',
    'Find results in...': '在...中查找结果',
    'Content titles and body': '内容标题和正文',
    'Content titles only': '仅内容标题',
    'Date Created': '创建日期',
    'Any': '任何',
    'Last 24 hours': '最近 24 小时',
    'Last week': '最近一周',
    'Last month': '最近一个月',
    'Last six months': '最近六个月',
    'Last year': '最近一年',
    'Find results that contain...': '查找包含...的结果',
    'of my search term words': '单词',
    'All Content': '所有内容',
    'Search Content': '搜索内容',
    'Search By Author': '按作者搜索',
    'Match term': '匹配关键词',
    'OR': ' 或 ',
    'AND': ' 且 ',
    'Group': '分组',
    'Search Members': '搜索用户',
    'Fetching results...': '正在获取结果...',
    'Subscribe': '订阅',
    'Create Event': '创建事件',
    'With All Calendars': '所有日历',
    'Download iCalendar export': '下载 iCalendar 导出',
    'Subscribe to iCalendar feed': '订阅 iCalendar 源',
    'Search Events': '搜索事件',
    'Online Events': '在线事件',
    'Physical Events': '现实事件',
    'Browse By Month': '按月浏览',
    'No events scheduled this month': '本月没有安排事件',
    'Modding Events': '模组事件',
    'All Calendars': '所有日历',
    'Jump to': '跳转至',
    'Go to today': '前往今天',
    'Events happening today': '今天发生的事件',
    'No events scheduled today': '今天没有安排事件',
    'Prev Week': '上一周',
    'Next Week': '下一周',
    'My Activity Streams': '我的活动流',
    'Unread Content': '未读内容',
    'Content I Started': '我发起的活动',
    'Leaderboard': '排行榜',
    'Stream Options': '活动流选项',
    'Set as your default stream': '设置为默认活动流',
    'Subscribe to RSS feed': '订阅 RSS 源',
    'This stream auto-updates': '此活动流自动更新',
    'Condensed': '紧凑',
    'Expanded': '扩展',
    'Load more activity': '加载更多活动',
    'Past hour': '过去一小时',
    'Past Leaders': '历史领先者',
    'Top Members': '优秀成员',
    'Find Content': '查找内容',
    'All areas': '所有区域',
    'Year': '年',
    'Week': '周',
    'Custom Date': '自定义日期',
    'Popular Content': '热门内容',
    'in all areas': '在所有区域中',
    'Most reputation': '最高声誉',
    'Most content': '最多内容',
    'Most posts': '最多帖子',
    'Member\'s reputation this period': '该成员在本期声誉最高',
    'Points': '点数',
    'points': '点数',
    'There are no members to show': '没有成员显示',
    'There are no results to show': '没有结果显示',
    'This leaderboard is set to UTC/GMT+00:00': '此排行榜设置为 UTC/GMT+00:00',
    'in Events': '在事件中',
    'in Event Comments': '在事件评论中',
    'in Topics': '在主题中',
    'in Posts': '在帖子中',
    'There are no notifications to display': '没有通知',
    'View all notifications': '查看所有通知',
    'You have no notifications': '你没有通知',
    'Website URL': '网站 URL',
    'Currently Playing': '当前游玩',
    'Favourite Game': '收藏游戏',
    'Choose Photo': '选择照片',
    'Drag and drop your file here, or': '拖拽文件到这里，或',
    'Choose Single File...': '选择单个文件...',
    'Accepted file types': '接受的文件类型',
    'Reputation': '声誉',
    'Reputation Activity': '声誉活动',
    'Event Reviews': '事件评价',
    'Neutral': '中立',
    'Are you sure you want to stop ignoring this user?': '你确定要停止忽略这个用户吗？',
    'You can ignore them again later from this page.': '你可以在以后从本页面再次忽略他们。',
    'Join Community': '加入社区',
    'Discussion': ' 讨论',
    'My Games': '我的游戏',
    'Recent activity in my games': '最近游戏活动',
    'Game Directory': '游戏目录',
    'Latest Activity': '最新活动',
    'Most Members': '最多用户',
    'Most Content': '最多内容',
    'Latest Created': '最新创建',
    'Game Type': '游戏类型',
    'Popular Games': '热门游戏',
    'Badges': '徽章',
    'You are a member of this club': '你是这个俱乐部的成员',
    'Send me email updates': '发送电子邮件更新',
    'Show me': '显示我',
    'Content items, comments, and reviews': '内容项目、评论和评价',
    'Content items only': '仅内容项目',
    'Tagged with': '标签为',
    'Items, Comments & Reviews': '项目、评论和评价',
    'Items only': '仅项目',
    'Any tags': '任何标签',
    'Content Types': '内容类型',
    'Apply Changes': '应用更改',
    'Narrow by Forums': '按论坛缩小',
    'More options for Topics': '更多选项用于主题',
    'Read Status': '阅读状态',
    'Everything': '所有',
    'Content I haven\'t read': '未读的内容',
    'Unread content streams are only viewable with \'Items Only\'': '未读内容流仅在“仅项目”模式下可见',
    'Solved': '已解决',
    'Unsolved': '未解决',
    'Ownership': '所有权',
    'Content I started': '我发起的活动',
    'Content I have posted in': '我参与的活动',
    'Content by specific members': '特定成员的活动',
    'There are no results to show in this activity stream yet': '此活动流中没有结果显示',
    'I posted in': '我参与的活动',
    'I started': '我发起的活动',
    'Following': '关注中',
    'Content posted in areas I follow': '我关注区域的活动',
    'Content items I follow': '我关注的项目',
    'Content posted by members I follow': '我关注的成员的活动',
    'Areas': '区域',
    'Areas, Items': '区域, 项目',
    'Areas, Items, Members': '区域, 项目, 成员',
    'Items, Members': '项目, 成员',
    'Time Period': '时间范围',
    'Any time': '任何时间',
    'Since my last visit': '自从我上次访问',
    'Last visit': '最后访问',
    'Specified time period': '指定时间范围',
    'Specific date range': '指定日期范围',
    'Within the last': '在过去',
    'Sorting': '排序',
    'Newest activity first': '最新活动优先',
    'Oldest activity first': '最旧活动优先',
    'Save these changes?': '保存这些更改？',
    'Don\'t Save': '不保存',
    'Save As New Stream': '保存为新活动流',
    'Default Streams': '默认活动流',
    'Content I Follow': '我关注的内容',
    'Members I Follow': '我关注的成员',
    'Content I Posted In': '我参与的活动',
    'Create New Stream': '创建新活动流',
    'Showing all content I have not read and posted since my last visit.': '显示我上次访问以来未读和参与的所有内容。',
    'Showing all content I posted and posted since my last visit.': '显示我上次访问以来参与的所有内容。',
    'Stream Title': '活动流标题',
    'Game Filters': '游戏过滤器',
    'Only content I follow': '仅我关注的内容',
    'Default View': '默认视图',
    'Save Changes': '保存更改',
    'More options for Events': '更多选项用于事件',
    'Last reply by Guest,': '最后回复由访客,',
    'The elegant, powerful, and open-source mod manager from Nexus Mods.': '来自 Nexus Mods 的优雅、强大且开源的模组管理器。',
    'Download the latest version now': '下载最新版本',
    'Vortex File Page': 'Vortex 文件页面',
    'Why Vortex?': '为什么使用 Vortex？',
    'Supported Games': '支持的游戏',
    'Disable my inbox': '关闭收件箱',
    'Help and Support': '帮助和支持',
    'MULTI GAME SUPPORT': '多游戏支持',
    'Removed by author': '被作者删除',
    'Inform downloaders of this mod\'s requirements before they attempt to download this file': '在下载者尝试下载此文件之前，告知他们此模组的要求',
    'The mod you were looking for was removed by its author': '你正在寻找的模组已被作者删除',
    'With mod support for over 30 different games - from Dark Souls, Fallout and Skyrim, to the Witcher series and Stardew Valley - Vortex is the most versatile mod manager available.': '支持超过 30 款不同游戏的模组——从《黑暗之魂》、《辐射》、《上古卷轴》，到《巫师》系列和《星露谷物语》——Vortex 是目前功能最全面的模组管理器。',

    'MOD PROFILES': '模组配置',
    'Easily set up, switch between, and manage independent mod profiles enabling you to use exactly the combination of mods that you want for a particular playthrough.': '可轻松设置、切换并管理彼此独立的模组配置，让你在每一轮游玩中自由使用自己想要的模组组合。',

    'CLOSE INTEGRATION WITH NEXUSMODS': '与 Nexus Mods 深度集成',
    'Vortex is designed to seamlessly interact with Nexus Mods allowing you to easily find, install, and play mods from our site, learn about new files and catch the latest news.': 'Vortex 专为与 Nexus Mods 无缝协作而设计，让你能够轻松从我们的网站查找、安装并游玩模组，同时获取最新文件与最新资讯。',

    'MODERN, EASY TO USE UI': '现代易用的用户界面',
    'Featuring a fully customisable interface, Vortex allows you to quickly and easily access tools and manage your games, plugins, downloads and save games.': '界面支持完全自定义，Vortex 让你能够快速、便捷地访问各类工具，统一管理你的游戏、插件、下载内容与存档。',
    
    'MODDING MADE EASY': '让模组更简单',
    'The built-in auto-sorting system manages your load order and helps you to resolve mod conflicts with powerful, yet easy to use plugin management features.': '内置的自动排序系统可管理你的加载顺序，并通过强大且易用的插件管理功能，帮助你轻松解决模组冲突。',

    'EXTENSIONS AND PLUGINS': '扩展与插件',
    'Vortex is released under a GPL-3 License giving our community the ability to write extensions and frameworks which can then interact with Vortex, continually adding to its functionality.': 'Vortex 以 GPL-3 许可证开源发布，让社区能够编写扩展与框架并与 Vortex 进行交互，从而不断拓展其功能。',

    'Upgrade to the future of mod management!': '升级，迈向模组管理的未来！',
    'Download Vortex Now': '立即下载 Vortex',
    'Moving from NMM or MO?': '从 NMM 或 MO 迁移？',
    'Find out how': '了解更多',
    // 'Vortex UI': 'Vortex 界面'

    // https://wiki.nexusmods.com/index.php/Games
    'View source': '查看源码',
    'History': '历史',
    'Search Nexus Mods Wiki': '在 Nexus Mods 百科中搜索',
    'Content pages': '内容页面',
    'About Nexus Mods Wiki': '关于 Nexus Mods 百科',
    'Disclaimers': '免责声明',
    'Multimedia': '多媒体',
    'Advanced': '高级',
    'Special page': '特殊页面',
    'Knowledge Base': '知识库',
    'Game Wikis': '游戏百科',
    'General modding': '通用模组',


    'Support the author': '支持作者',
    'Donation amount': '捐赠金额',
    'Mod authors work tirelessly and without financial gain to share their creations with you free of charge on Nexus Mods.': '模组作者辛勤工作，不收取任何费用，免费与你分享他们的创作。',
    'Show them some love with a voluntary donation,': '用自愿捐赠表达你的爱意，',
    'of which goes directly to the author and is not handled by Nexus Mods in any way, shape or form.': '其中直接交给作者， Nexus Mods 不会以任何方式、形式处理。',
    

    "Endorse collection": "认可合集",
    "You must first download a collection before you can endorse it.": "您必须先下载该合集，才能进行认可。",
    "Ok": "确定",
    "Mod Manager Required": "需要模组管理器",
    "To easily install mods you need a mod manager (app). If you\’re already using a mod manager, you can ignore this.": "为便捷安装模组，您需要使用模组管理器（应用）。如果您已经在使用模组管理器，可忽略此提示。",
    "Get Vortex Mod Manager": "获取 Vortex 模组管理器",
    "Feeling adventurous? Take our new app for a spin!": "想要尝试新体验？立即试用我们的新应用！",
    "Don't show again": "不再显示",
    "Continue (requires mod manager)": "继续（需要模组管理器）",
    'Adding collection...': '添加合集中...',

    'Endorse this mod': '认可此模组',
    'Abstain from endorsing this mod': '不认可此模组',
    'Easy install - Highly reliable setup and install.': '轻松安装 - 高度可靠的配置与安装体验。',
    'Needs more info': '需要更多信息',
    'commented on': '评论了 ',
    'Updated since last downloaded': '上次下载后更新',
    'Bot': '机器人',
    'This is an official collection.': '这是官方合集',
    "Highly reliable setup and install.": "高度可靠的配置与安装体验",

    'Open bug report': '打开漏洞报告',
    'This file is currently being uploaded to our CDN servers. If this is taking longer than expected, please contact a moderator or': '此文件目前正在上传到我们的 CDN 服务器。如果此过程比预期时间长，请联系管理员或',
    'email us.': '发送邮件给我们。',
    'Hide mod': '隐藏模组',
    'Warning: Hidden mods will not earn any Donation Points.': '警告：隐藏模组不会获得任何捐赠点。',
    'Please select a reason': '请选择原因',
    'Please select a reason why you\'re hiding': '请选择你隐藏模组的原因',
    '. It will appear on your hidden mod page and it will be visible to everyone.': '。它将出现在你的隐藏模组页面，并且对所有人可见。',
    'Temporarily unsupported': '暂时不支持',
    'Reason:': '原因：',
    'This mod is currently not supported by the author(s) and/or has issue(s) they are unable to fix yet.': '这个模组目前不被作者支持，或者存在作者无法修复的问题。',
    'Mod is obsolete': '模组已过时',
    'Start typing a mod name.': '开始输入模组名称。',
    'This mod is obsolete and should no longer be used. Please use this mod instead:': '这个模组已过时，不应再使用。请使用这个模组代替：',
    'Permission/License issue': '权限/许可证问题',
    'The mod has (possible) permission issues that the author is working to address.': '这个模组可能存在权限问题，作者正在努力解决。',
    'Updating the mod page': '更新模组页面',
    'This mod is temporarily unavailable while the mod author updates the mod page information.': '这个模组暂时不可用，因为作者正在更新模组页面信息。',
    'All notifications were successfully marked as read.': '所有通知已成功标记为已读。',
    'You have already abstained from endorsing this mod.': '你已经放弃了认可这个模组。',
    'You have already endorsed this mod.': '你已经认可了这个模组。',

    'Handpicked by Nexus Mods for quality and reliability.': '由 Nexus Mods 精选，品质与可靠性保证',
    'opted-in to receive Donation Points': '选择接收捐赠点',
    'not': '没有',
    'You must have downloaded this Collection to report a bug': '必须下载这个合集才能报告漏洞',
    'No translation available on the Nexus': 'Nexus 上没有翻译',
    'Straight donations accepted': '直接捐赠接受',
    '1m': '1月',
    '3m': '3月',
    '6m': '6月',
    'YTD': '至今',
    '1y': '1年',
    'Mod edited': '模组编辑',
    'Primary image changed': '主图更改',
    'Permission change': '权限更改',

    'Successfully given kudos.': '点赞成功！',
    'Successfully removed kudos.': '已取消点赞',
    'User successfully tracked.': '已成功关注！',
    'User successfully untracked.': '已取消关注',
    'Link copied to your clipboard.': '链接已复制到你的剪贴板',
    'Removed from ‘My Games’.': '已从“我的游戏”中移除',
    'Added to ‘My Games’.': '已添加到“我的游戏”',
    'Mod tracked': '已关注',
    'Mod untracked': '已取消关注',
    'Mod endorsed': '已认可',
    'Mod unendorsed': '已取消认可',

    // 游戏类型
    'Action': '动作',
    'Adventure': '冒险',
    'ARPG': '动作角色扮演',
    'Dungeon crawl': '地下城探索',
    'Fighting': '格斗',
    'FPS': '第一人称射击',
    'Hack and Slash': '砍杀动作',
    'Indie': '独立游戏',
    'Metroidvania': '银河战士类',
    'MMORPG': '大型多人在线角色扮演',
    'Platformer': '平台跳跃',
    'Puzzle': '解谜',
    'Racing': '赛车',
    'Roguelike': '肉鸽',
    'RPG': '角色扮演',
    'Sandbox': '沙盒',
    'Simulation': '模拟',
    'Space sim': '太空模拟',
    'Sports': '体育',
    'Stealth': '潜行',
    'Survival': '生存',
    'Third-Person Shooter': '第三人称射击',
    'Visual Novel': '视觉小说',
    'Strategy': '策略',

    'Show games with Collections': '显示有合集的游戏',
    'Get started with the essential mods.': '从必备的模组开始你的旅程。',
    'Get starter mods': '获取入门模组',
    'Quick start - skip the steps': '快速开始 - 跳过步骤',
    'Get started with': '从此开始 ',
    'Install a curated set of mods to get started fast': '安装精选的模组集合，快速开始',
    'Collections are a quick way to install a group of mods that "just work".': '合集是一种快速安装一整组“即装即用”模组的方式。',
    'Prefer to mod manually?': '更喜欢手动模组？',



});

  // 首页相关（/ 或 /site），先只保留一组示例，后续可按需增减
  zhCN.home = Object.assign(zhCN.home || {}, {
    'Latest news': '最新新闻',
    'Comments': '评论',
    'Tracking centre': '关注中心',
    'My content': '我的内容',

    'My Games': '我的游戏',
    'All Games': '所有游戏',

  });

  // 全局配置：用正则匹配 URL，决定当前页面类型
  // 结构与 GitHub 中文化脚本的 I18N.conf 类似，但这里只关心 URL 匹配
  if (!window.NEXUS_I18N.conf) {
    window.NEXUS_I18N.conf = {};
  }

  // routes: [ [正则字符串, 页面类型], ... ]
  // 例如：^/$|^/site/?$ 匹配首页
  window.NEXUS_I18N.conf.routes = [
    ['^/$|^/site/?$', 'home']
    // 以后要支持其它页面，就在这里追加新的 [pattern, pageType]
  ];

  // 广告容器选择器，供脚本读取并统一隐藏（以后新增/调整广告只需要改这里）
  window.NEXUS_I18N.conf.adSelectors = [
    '[data-testid^="ad-"]',
    '.ad-container',
    '.ad-slot',
    '.advertisement',
    '.premium-upsell-banner',
    '.new-new-premium-banner',
    '#freeTrialBanner',
    // Instant Gaming 顶部大横幅广告
    '#ig-banner-container',
    // Fallout Modathon 竞赛横幅
    'a[href*="/fallout-modathon"]',
    // 顶部合集推广横幅（下载 Collections for 某游戏）
    '.collections-banner-wrapper',
    // 页脚 App 预览横幅
    '#app-banner',
    // Premium 会员推广卡片（解锁一键合集和最大下载速度）
    'a.hover-overlay.border-premium-moderate.bg-gradient-to-tl.from-premium-weak.to-premium-900',
    // 首页左侧 Vortex 推广卡片
    'div.border-stroke-weak.min-w-64.rounded-lg.border.px-3.py-2.md\\:block',
    // 制作模组赚取奖励（模组福利）横幅（小/大 + 顶部创作者卡片）
    'div[style*="mod-author-benefits/banner-small-pattern.webp"]',
    'div[style*="mod-author-benefits/banner-large-pattern.webp"]',
    'a[style*="backgrounds/creator.webp"]',
    // 首页新应用推广卡片（预览我们的新应用）
    '.app-hero-button',
    // Premium 背景大横幅（快速下载，使用高级会员）
    'div[style*="backgrounds/premium.webp"]',
    // 搜索结果右侧 Premium 小提示卡片（获取更多 / 使用高级版）
    'div.mt-1\\.5.hidden.border-t.border-stroke-weak.px-3.pt-3\\.5.pb-1\\.5.md\\:block',
    // 搜索结果下拉中 Premium 解锁提示项（40/60/80 条，禁用状态），与广告开关联动隐藏
    'div.cursor-not-allowed.opacity-40[id^="headlessui-listbox-option-"]',
    // Instant Gaming 小横幅（获取更便宜的模组化游戏）
    'div.flex.h-fit.w-full.flex-col.items-start.gap-4.rounded-sm.bg-surface-translucent-mid.p-4.backdrop-blur-xs',
    // Instant Gaming 游戏价格卡片（含 Steam 价格与“立即购买”按钮）
    'div.bg-surface-translucent-low:has(a[href*="instant-gaming.com"])',
    // 文本内 Premium 整段提示（例如「轻松获取数百个精选模组和只需一键即可使用高级版。」）
    'span.typography-body-sm.text-neutral-moderate:has(a.link.link-secondary.text-premium-strong[href*="/premium"])',
    // 新版 Premium 提示段落容器（轻松获取数百个精选模组，只需一键即可使用高级版）
    'p.typography-body-md.text-translucent-strong.mt-1.sm\\:mt-4',
    // 合集页顶部「解锁一键安装」Premium 按钮
    'a.group.hidden.items-center.gap-1.rounded.border-t.border-t-stroke-weak.bg-linear-87.from-premium-900.to-premium-700.px-3.py-1.shadow-lg.transition-colors.sm\\:inline-flex[href*="/account/billing/premium"]',
    // 合集页顶部「102 个模组一键安装」Premium 强调文案
    'p.typography-body-md.pb-0\\.5.font-semibold.text-premium-strong',
    // 用户菜单中的「免费试用高级版」按钮
    'a.button.primary:has(span[data-trial-text="Try premium free"])',
    // 页脚「支持 Nexus Mods / 升级为高级会员」块（整块容器）
    '.rj-supporter-wrapper',
    // 页脚支持块内部：左侧「支持 Nexus Mods」+「升级为高级会员」按钮的小卡片
    'div.text-left:has(a.nxm-button.nxm-button-primary[href*="/account/billing/premium"])',
    // 页脚 Vortex 推广模块
    '#rj-vortex',
    // 右侧 Vortex 模组管理器推广卡片（合集/模组页侧边栏，旧样式）
    'div.w-full.max-w-60.self-start.rounded-lg.border.p-4.border-stroke-subdued.hidden.lg\\:block',
    // Vortex 模组管理器推广卡片（无 hidden/lg:block 新样式）
    'div.w-full.max-w-60.self-start.rounded-lg.border.p-4.border-stroke-subdued:has(a[href*="/site/mods/1"])',
    // 导航区域 Vortex 模组管理器推广卡片（nav-card large-only）
    '.nav-card.large-only:has(a[href*="/site/mods/1"])',
    // 导航区域 Vortex 模组管理器推广卡片（nav-card 通用版）
    '.nav-card:has(a[href*="/site/mods/1"])',
    // 导航区域 / 侧边栏中，带 Premium 升级链接的 nav-card（例如“支持者专属图片 / 升级您的账户以解锁所有媒体内容。”）
    '.nav-card:has(a[href*="/account/billing/premium"])',
    // 导航区域 / 侧边栏中，指向建议板（Suggestion Board）的 nav-card（“提供反馈”等）
    '.nav-card:has(a[href*="/forum/9063-suggestion-board/"])',
    // 支持者图片 Premium 卡片（提示升级账户解锁媒体）
    'div.w-full.max-w-60.self-start.rounded-lg.border.p-4.border-stroke-subdued:has(a[href*="/account/billing/premium"])',
    // 侧边栏「提供反馈」卡片（与 nav-card 内容类似，只是样式不同）
    'div.w-full.max-w-60.self-start.rounded-lg.border.p-4.border-stroke-subdued:has(a[href*="/forum/9063-suggestion-board/"])',
    // 合集/模组页中「更多游戏时间 / 解锁一键自动合集」Premium 大横幅广告卡片
    'div.relative.rounded-lg.border.border-premium-moderate.bg-gradient-to-t.from-premium-weak.to-premium-900',
    // Premium 推广页顶部整屏大横幅（背景 diagonals-top.png + 高级会员文案）
    'div.relative.flex.min-h-screen.w-full.justify-center[style*="premium/promotion-page/diagonals-top.png"]'
  ];

  // 不应翻译的区域选择器（例如长描述、Lexical 富文本）
  window.NEXUS_I18N.conf.ignoreSelectors = [
    '.mod_description_container',                  // <div class="container mod_description_container condensed">
    '.prose-lexical.prose',                        // Lexical 富文本区域（例如合集日志正文）
    '.typography-body-md.text-neutral-strong.line-clamp-3', // 首页「Mods are now available for ...」这种摘要文案，保持英文
    'i.material-icons',                            // 材质图标文本（例如 <i class="material-icons">settings</i>），不翻译
    // 模组卡片标题（在 .tile-content 下）：
    // <div class="tile-content">
    //   <p class="tile-name"><a href="...">BaZhua's Marriable Role Portrait</a></p>
    //   ...
    //   <p class="desc">Pixel Portraits ...</p>
    // </div>
    // 标题和摘要都保持原文，不做翻译，避免破坏作者自定义内容
    '.tile-content .tile-name',
    '.tile-content .desc',
    // 论坛主题标题（例如 "Too many mods"），保持原文
    '.ipsDataItem_title',
    // 论坛/社区中使用 .ipsType_break.ipsContained 包裹的标题（例如 "Too many mods" 链接），保持原文
    'span.ipsType_break.ipsContained',
    // 评论正文整体不翻译
    '.comment-content-text',
    // 首页「Mods are now available for ... and XX more new games」整块提示不翻译（新结构，外层 div 无类名）
    'div:has(> span.text-primary-moderate):has(> span:last-child)',
    // 新闻文章正文不翻译（保留作者原创内容）
    '.news-article',
    // 文章正文（模组描述、站点文章等），常规段落和列表统一保持原文，
    // 但保留标题 / 日期等元信息可翻译（例如 Revision 98 + 日期）
    'article p',
    'article ul.disc',
    // 论坛 / 文章中的引用块（<figure class="quote col-3-3">...</figure>），保留作者原文
    'figure.quote',
    // 模组更新日志 / Changelog 列表（保留作者原文）
    // '.log-block',
    '.change-logs',
    

    // .post-content
    // '.post-content',
    // 活动流状态行（例如 "MaskPlague and 13 others reacted ..."），保持原文，不翻译
    '.ipsStreamItem_status'
  ];

  // 描述 Tab 内允许翻译的子区域（白名单）
  window.NEXUS_I18N.conf.descTabAllowSelectors = [
    '#description_tab_h2',
    '.modhistory.inline-flex',
    '.actions.clearfix',
    '.accordionitems'
  ];

  // regexpRules: [ [正则字符串, 替换模板, 可选类型], ... ]
  // 用于处理带动态内容的 UI 文本，例如包含日期的提示
  window.NEXUS_I18N.conf.regexpRules = [
    // 游戏模组分类标题："Stardew Valley mod categories" -> "Stardew Valley 模组分类"
    [
      '^(.+) mod categories$',
      '$1 模组分类'
    ],
    // 游戏模组列表标题："Stardew Valley mods" -> "Stardew Valley 模组"
    [
      '^(.+) mods$',
      '$1 模组'
    ],
    // 分类标签前缀："Category: Gameplay Mechanics" -> "分类：Gameplay Mechanics"
    // 只翻译前面的 "Category"，后面的具体分类名称保持英文
    [
      '^Category: (.+)$',
      '分类：$1'
    ],
    // Title: "Title: Stardew Valley mods" -> "标题：Stardew Valley 模组"
    [
      '^Title: (.+)$',
      '标题：$1'
    ],

    // Open Community · 2833 members · Last active
    [
      '^Open Community · ([0-9,]+) members · Last active$',
      '开放社区 · $1 位成员 · 最后活跃 '
    ],

    // Description: 321321
    [
      '^Description: (.+)$',
      '描述：$1'
    ],

    // Viewing Topic: *
    [
      '^Viewing Topic: (.+)$',
      '查看主题：$1'
    ],

    // Author: 321
    [
      '^Author: (.+)$',
      '作者：$1'
    ],
    // Min size: 5GB
    [
      '^Min size: (.+)$',
      '最小：$1'
    ],
    // Max size: 10GB
    [
      '^Max size: (.+)$',
      '最大：$1'
    ],
    // Min downloads: 1,000,000
    [
      '^Min downloads: (.+)$',
      '最小下载量：$1'
    ],
    // Max downloads: 1,000,000
    [
      '^Max downloads: (.+)$',
      '最大下载量：$1'
    ],
    // 1337 users online
    [
      '^([0-9,]+) users online$',
      '$1 位用户在线'
    ],
    // Min endorsements: 300,000
    [
      '^Min endorsements: (.+)$',
      '最小认可数：$1'
    ],
    // Max endorsements: 1,000,000
    [
      '^Max endorsements: (.+)$',
      '最大认可数：$1'
    ],
    // Number of endorsements: 3,470
    [
      '^Number of endorsements: ([0-9,]+)$',
      '认可数：$1'
    ],
    // Keyword: Seasonal Outfits
    [
      '^Keyword: (.+)$',
      '关键词：$1'
    ],
    // Uploader: 321
    [
      '^Uploader: (.+)$',
      '上传者：$1'
    ],
    // 游戏图片分类标题："Stardew Valley images" -> "Stardew Valley 图片"
    [
      '^(.+) images$',
      '$1 图片'
    ],
    // 游戏视频分类标题："Stardew Valley videos" -> "Stardew Valley 视频"
    [
      '^(.+) videos$',
      '$1 视频'
    ],
    // 竞赛卡片副标题："Competition  •  24 Nov 2025" -> "竞赛  •  2025-11-24"
    [
      '^Competition\\s+•\\s+(\\d{1,2}) (\\w{3}) (\\d{4})$',
      '竞赛  •  {Y}-{M}-{D}',
      'date_en_dMY'
    ],
    // 模组新闻副标题："Mod News  •  20 Nov 2025" -> "模组新闻  •  2025-11-20"
    [
      '^Mod News\\s+•\\s+(\\d{1,2}) (\\w{3}) (\\d{4})$',
      '模组新闻  •  {Y}-{M}-{D}',
      'date_en_dMY'
    ],
    // 站点新闻副标题："Site News  •  1 Dec 2025" -> "站点新闻  •  2025-12-01"
    [
      '^Site News\\s+•\\s+(\\d{1,2}) (\\w{3}) (\\d{4})$',
      '站点新闻  •  {Y}-{M}-{D}',
      'date_en_dMY'
    ],
    // 新增文件日期："New files added on: 15 November 2025" -> "在 2025-11-15 添加的新文件"
    [
      '^New files added on: (\\d{1,2}) ([A-Za-z]{4,}) (\\d{4})$',
      '在 {Y}-{M}-{D} 添加的新文件',
      'date_en_dFY'
    ],
    // 站点统计汇总："Mods: 26377, Files: 145306" -> "模组：26377，文件：145306"
    [
      '^Mods:\\s*([0-9,]+),\\s*Files:\\s*([0-9,]+)$',
      '模组：$1，文件：$2'
    ],
    // 文件数量："0 files" / "1 file" / "25 files" -> "0 个文件" / "1 个文件" / "25 个文件"
    [
      '^([0-9,]+) files?$',
      '$1 个文件'
    ],
    // 投票数量："3 Votes" / "1 Vote" -> "3 票" / "1 票"
    [
      '^([0-9,]+) Votes?$',
      '$1 票'
    ],
    // 关注提示："You are now tracking Content Patcher" -> "你正在关注 Content Patcher"
    [
      '^You are now tracking (.+)$',
      '你正在关注 $1'
    ],
    // 取消关注提示："You are no longer tracking Content Patcher" -> "你已取消关注 Content Patcher"
    [
      '^You are no longer tracking (.+)$',
      '你已取消关注 $1'
    ],
    // 时间范围："Time range: 7 Days" / "Time range: 24 Hours" / "Time range: 1 Year"
    //        -> "时间范围：7 天" / "时间范围：24 小时" / "时间范围：1 年"
    [
      '^Time range:\\s*([0-9,]+)\\s+(Hours?|Days?|Years?)$',
      '时间范围：$1 $2',
      'time_range_en'
    ],
    // You last downloaded a file from this mod on 15 Nov 2025
    [
      '^You last downloaded a file from this mod on (\\d{1,2}) (\\w{3}) (\\d{4})$',
      '你上次从此模组下载文件是在 {Y}-{M}-{D}',
      'date_en_dMY'
    ],

    // Included in 1,860 collections / Included in 515 collections
    [
      '^Included in ([0-9,]+) collections?$',
      '包含在 $1 个合集中'
    ],

    // <time class="dst-date-adjust">15 November 2025, 9:16AM</time>
    // 以及类似 "15 November 2025, 9:44 pm"
    // 转换为：2025-11-15 09:16（yyyy-mm-dd hh:mm）
    [
      '^(\\d{1,2}) ([A-Za-z]+) (\\d{4}), (\\d{1,2}):(\\d{2}) ?([AaPp][Mm])$',
      '{Y}-{M}-{D} {h}:{m}',
      'date_en_dFYGis'
    ],

    // This page was last updated on 15 November 2025, 1:17AM
    // -> 此页面最后更新于 2025-11-15 01:17
    [
      '^This page was last updated on (\\d{1,2}) ([A-Za-z]+) (\\d{4}), (\\d{1,2}):(\\d{2}) ?([AaPp][Mm])$',
      '此页面最后更新于 {Y}-{M}-{D} {h}:{m}',
      'date_en_dFYGis'
    ],

    // Last comment at : 16 Nov 2025, 3:32PM
    // -> 最后评论于：2025-11-16 15:32
    [
      '^Last comment at : (\\d{1,2}) (\\w{3}) (\\d{4}), (\\d{1,2}):(\\d{2})([AaPp][Mm])$',
      '最后评论于：{Y}-{M}-{D} {h}:{m}',
      'date_en_dMYhm_action'
    ],

    // 仅日期，完整月份："04 November 2025" -> "2025-11-04"
    [
      '^(\\d{1,2}) ([A-Za-z]{4,}) (\\d{4})$',
      '{Y}-{M}-{D}',
      'date_en_dFY'
    ],

    // 仅日期，完整月份在前（带逗号）："December 11, 2024" -> "2024-12-11"
    [
      '^([A-Za-z]+) (\\d{1,2}), (\\d{4})$',
      '{Y}-{M}-{D}',
      'date_en_FdY'
    ],

    // Premium 免费试用结束时间："Your free trial ends Dec 9, 2025"
    // -> "你的免费试用将于 2025-12-09 结束"
    [
      '^Your free trial ends ([A-Za-z]+) (\\d{1,2}), (\\d{4})$',
      '你的免费试用将于 {Y}-{M}-{D} 结束',
      'date_en_FdY'
    ],

    // 仅日期，完整月份在前（不带逗号）："November 24 2025" -> "2025-11-24"
    [
      '^([A-Za-z]+) (\\d{1,2}) (\\d{4})$',
      '{Y}-{M}-{D}',
      'date_en_FdY'
    ],

    // 仅月份和年份："November 2025" / "Nov 2025" -> "2025-11"
    [
      '^([A-Za-z]+) (\\d{4})$',
      '{Y}-{M}',
      'date_en_FY'
    ],

    // 仅月份 + 日期："November 10" / "Nov 10" -> "11-10"（统一使用数字月份和两位日期）
    [
      '^([A-Za-z]+) (\\d{1,2})$',
      '{M}-{D}',
      'date_en_Fd'
    ],

    // <time class="dst-date-adjust">15 Nov 2025</time>
    // 转换为：2025-11-15（yyyy-mm-dd）
    [
      '^(\\d{1,2}) (\\w{3}) (\\d{4})$',
      '{Y}-{M}-{D}',
      'date_en_dMY'
    ],

    // "16 Nov 2025, 1:55PM | Action by:" -> "2025-11-16 13:55 | 操作："
    [
      '^(\\d{1,2}) (\\w{3}) (\\d{4}), (\\d{1,2}):(\\d{2})(AM|PM) \\| Action by:$',
      '{Y}-{M}-{D} {h}:{m} | 操作：',
      'date_en_dMYhm_action'
    ],

    // "Uploaded at 21:21 03 Nov 2025" -> "上传于 2025-11-03 21:21"
    [
      '^Uploaded at (\\d{1,2}):(\\d{2}) (\\d{1,2}) (\\w{3}) (\\d{4})$',
      '上传于 {Y}-{M}-{D} {h}:{m}',
      'date_en_time_dMY'
    ],

    // 仅时间，带 AM/PM："10:02PM" -> "22:02"
    [
      '^(\\d{1,2}):(\\d{2})(AM|PM)$',
      '{h}:{m}',
      'time_en_hmAP'
    ],

    // 昨天 + 时间："Yesterday at 03:26 AM" -> "昨天 03:26"
    [
      '^Yesterday at (\\d{1,2}):(\\d{2})\\s*([AaPp][Mm])$',
      '昨天 {h}:{m}',
      'time_en_hmAP'
    ],

    // 星期几 + 时间："Sunday at 08:55 PM" -> "周日 20:55"
    [
      '^Sunday at (\\d{1,2}):(\\d{2})\\s*([AaPp][Mm])$',
      '周日 {h}:{m}',
      'time_en_hmAP'
    ],
    [
      '^Monday at (\\d{1,2}):(\\d{2})\\s*([AaPp][Mm])$',
      '周一 {h}:{m}',
      'time_en_hmAP'
    ],
    [
      '^Tuesday at (\\d{1,2}):(\\d{2})\\s*([AaPp][Mm])$',
      '周二 {h}:{m}',
      'time_en_hmAP'
    ],
    [
      '^Wednesday at (\\d{1,2}):(\\d{2})\\s*([AaPp][Mm])$',
      '周三 {h}:{m}',
      'time_en_hmAP'
    ],
    [
      '^Thursday at (\\d{1,2}):(\\d{2})\\s*([AaPp][Mm])$',
      '周四 {h}:{m}',
      'time_en_hmAP'
    ],
    [
      '^Friday at (\\d{1,2}):(\\d{2})\\s*([AaPp][Mm])$',
      '周五 {h}:{m}',
      'time_en_hmAP'
    ],
    [
      '^Saturday at (\\d{1,2}):(\\d{2})\\s*([AaPp][Mm])$',
      '周六 {h}:{m}',
      'time_en_hmAP'
    ],

    // "View all (6)" / "View all (123)" -> "查看全部（6）" / "查看全部（123）"
    [
      '^View all \\((\\d+)\\)$',
      '查看全部（$1）'
    ],

    // 搜索结果数量："4,115 results" / "1 result" -> "4,115 个结果" / "1 个结果"
    [
      '^([0-9,]+)\\s+results?$',
      '$1 个结果'
    ],

    // 搜索结果标题："Search results for “Seasonal Outfits”"
    //               -> "“Seasonal Outfits”的搜索结果"
    // 兼容直引号和弯引号两种形式
    [
      '^Search results for ["“](.+)["”]$',
      '“$1” 的搜索结果'
    ],

    // 相对时间："4 weeks ago" / "1 day ago" / "2 years ago" / "3 months ago" 等
    // -> "4 周前" / "1 天前" / "2 年前" / "3 个月前"
    // 使用宽松匹配，单位在代码中进行归一化，兼容 "yrs"、"mos" 等写法
    [
      '^(\\d+)\\s+(\\w+)\\s+ago$',
      '{N}{UNIT}',
      'rel_time_en'
    ],

    // 相对时间（拆分形式）：例如 <time>2 years</time><span>ago</span>
    // 只处理 second/minute/hour/day/week/month/year 等相关单位，避免误伤 "2 mods" 之类文本
    [
      '^(\\d+)\\s+(seconds?|minutes?|hours?|days?|weeks?|months?|years?|secs?|mins?|hrs?|wks?|mos?|yrs?)$',
      '{N}{UNIT}',
      'rel_time_en_partial'
    ],

    // 拆分形式的 "ago"：例如 <span>ago</span>，在前一个节点已经翻译为 "2 年前" 的情况下，这里直接清空
    [
      '^ago$',
      '',
      'rel_time_ago_tail'
    ],

    // 动态上传按钮："Upload to Stardew Valley" / "Upload to Skyrim" -> "上传到 Stardew Valley" / "上传到 Skyrim"
    [
      '^Upload to (.+)$',
      '上传到 $1'
    ],

    // "View all (6)" / "View all (123)" -> "查看全部（6）" / "查看全部（123）"
    [
      '^View all \\((\\d+)\\)$',
      '查看全部（$1）'
    ],

    // "View all 62 authors" -> "查看全部 62 位作者"
    [
      '^View all (\\d+) authors$',
      '查看全部 $1 位作者'
    ],

    // 回复数量："5 Replies" / "1 Reply" -> "5 条回复" / "1 条回复"
    [
      '^([0-9,]+)\\s+Repl(?:y|ies)$',
      '$1 条回复'
    ],

    // 讨论数量："0 Discussions" / "1 Discussion" -> "0 个讨论" / "1 个讨论"
    [
      '^([0-9,]+)\\s+[Dd]iscussions?$',
      '$1 个讨论'
    ],

    // 分页计数："1 of 1" / "3 of 10" / "67 of 10,727" -> "1 / 1" / "3 / 10" / "67 / 10,727"
    [
      '^([0-9,]+) of ([0-9,]+)$',
      '$1 / $2'
    ],

    // "All games (0)" -> "所有游戏（0）"
    [
      '^All games \\((\\d+)\\)$',
      '所有游戏（$1）'
    ],

    // "Media Gallery (6)" -> "媒体库（6）"
    [
      '^Media Gallery \\((\\d+)\\)$',
      '媒体库（$1）'
    ],

    // 媒体待处理数量："Media (0 pending)" -> "媒体（0 个待处理）"
    [
      '^Media \\((\\d+) pending\\)$',
      '媒体（$1 个待处理）'
    ],

    // 列表分页说明：
    // "Showing 1 to 20 of 370 entries" -> "显示第 1 到 20 条，共 370 条"
    [
      '^Showing (\\d+) to (\\d+) of (\\d+) entries$',
      '显示第 $1 到 $2 条，共 $3 条'
    ],

    // Leaderboard 说明："Showing content with the highest reputation since 10/25/25 in Posts"
    [
      '^Showing content with the highest reputation since ([0-9/]+) in Posts$',
      '显示自 $1 起在帖子中的最高声誉内容'
    ],

    // Showing content with the highest reputation since 10/25/25 in Topics
    [
      '^Showing content with the highest reputation since ([0-9/]+) in Topics$',
      '显示自 $1 起在主题中的最高声誉内容'
    ],

    // Showing content with the highest reputation since 10/25/25 in Event Comments
    [
      '^Showing content with the highest reputation since ([0-9/]+) in Event Comments$',
      '显示自 $1 起在事件评论中的最高声誉内容'
    ],

    // Showing content with the highest reputation since 10/25/25 in Events
    [
      '^Showing content with the highest reputation since ([0-9/]+) in Events$',
      '显示自 $1 起在事件中的最高声誉内容'
    ],

    // Showing content with the highest reputation since 10/25/25 in all areas
    [
      '^Showing content with the highest reputation since ([0-9/]+) in all areas$',
      '显示自 $1 起在所有区域中的最高声誉内容'
    ],


    // 修订版本："Revision 96" -> "修订版本 96"
    [
      '^Revision (\\d+)$',
      '修订 $1'
    ],

    // Donation Points 待入账："0 DP pending" / "123 DP pending"
    [
      '^([0-9,]+) DP pending$',
      '$1 DP 待入账'
    ],

    // Donation Points 选项提示（动态模组名称）
    [
      '^You are opting "(.+)" into our Donation Point system\\. You can choose to keep all the DP this mod earns in the future for yourself, or share the DP this mod earns with other users below\\.$',
      '你正在将 "$1" 加入我们的捐赠点系统。你可以选择保留此模组未来赚取的所有 DP，或者在下方将这些 DP 与其他用户分享。'
    ],

    // 页面响应时间："Served in 1.041s" -> "加载耗时 1.041s"
    [
      '^Served in ([0-9.]+)s$',
      '加载耗时 $1s'
    ],

    // 下载倒计时："Your download will start in 5 seconds..." -> "你的下载将在 5 秒后开始。"
    [
      '^Your download will start in (\\d+) seconds?(?:\\.\\.\\.)?$',
      '你的下载将在 $1 秒后开始。'
    ],

    // 2 reputation points
    [
      '^([0-9,]+) reputation points$',
      '$1 声誉点数'
    ],

    // 作者标记："by RimeNovi" -> "作者 RimeNovi"
    [
      '^by (.+)$',
      '作者 $1'
    ],

    // 欢迎语："Welcome back *" -> "欢迎回来 SychO3"
    [
      '^Welcome back (.+)$',
      '欢迎回来 $1'
    ],

    // 动态用户名活动提示："* has no recent activity to show" -> "SychO3 最近没有任何活动"
    [
      '^(.+) has no recent activity to show$',
      '$1 最近没有任何活动'
    ],

    // 条目数量："1 items" / "3 items" / "1 item" -> "1 条" / "3 条" / "1 条"
    [
      '^([0-9,]+)\\s+items?$',
      '$1 条'
    ],

    // 模组数量："520 mods" / "1 mod" -> "520 个模组" / "1 个模组"
    [
      '^([0-9,]+)\\s+mods?$',
      '$1 个模组'
    ],

    // 评论数量："0 Comments" / "4281 comments" / "1 comment" -> "0 条评论" / "4281 条评论" / "1 条评论"
    [
      '^([0-9,]+)\\s+[Cc]omments?$',
      '$1 条评论'
    ],

    // 标题 + 括号内评论数量：
    // 括号左边整段视为标题，原样保留；只翻译括号里的 "X comments"
    [
      '^(.+?) \\(([0-9,]+) comments?\\)$',
      '$1（$2 条评论）'
    ],

    // 帖子数量："70.7k posts" / "859 posts" 等 -> "70.7k 帖子" / "859 帖子"
    [
      '^([0-9.,]+k?)\\s+posts$',
      '$1 帖子'
    ],

    // Kudos 数量："743 kudos" / "1 Kudos" / "2,072 kudos" -> "743 个赞誉" / "1 个赞誉" / "2,072 个赞誉"
    [
      '^([0-9,]+)\\s+[Kk]udos$',
      '点赞数 $1'
    ],

    // 关注者数量："0 Followers" / "12 followers" -> "0 位关注者" / "12 位关注者"
    [
      '^([0-9,]+)\\s+[Ff]ollowers?$',
      '$1 位关注者'
    ],

    // 警告点数："0 warning points" / "2 warning points" -> "0 个警告点数" / "2 个警告点数"
    [
      '^([0-9,]+) warning points$',
      '$1 个警告点数'
    ],

    // "(and 1 more)" / "(and 3 more)" -> "（和另外 1 个）" / "（和另外 3 个）"
    [
      '^\\(and ([0-9,]+) more\\)$',
      '（和另外 $1 个）'
    ],

    // About SychO3
    [
      '^About (.+)$',
      '关于 $1'
    ],

    // Viewing Profile: SychO3
    [
      '^Viewing Profile: (.+)$',
      '查看资料：$1'
    ],

    // 22 profile views
    [
      '^([0-9,]+) profile views$',
      '$1 次资料浏览'
    ],

    // 0 attachments
    [
      '^([0-9,]+) attachments$',
      '$1 个附件'
    ],

    // 附件配额使用情况：
    // "You have used 0 B of your 4.88 MB attachment limit."
    // -> "你已使用 0 B / 4.88 MB 的附件配额。"
    [
      '^You have used ([0-9.,]+\\s*[KMG]?B) of your ([0-9.,]+\\s*[KMG]?B) attachment limit\\.$',
      '你已使用 $1 / $2 的附件配额。'
    ],

    // 私信存储配额："Used 0% messenger storage" -> "消息存储空间已使用 0%"
    [
      '^Used ([0-9]+)% messenger storage$',
      '消息存储空间已使用 $1%'
    ],

    // <time class="dst-date-adjust">06:31, 16 Nov 2025</time>
    // 转换为：2025-11-16 06:31（yyyy-mm-dd hh:mm）
    [
      '^(\\d{1,2}):(\\d{2}),\\s+(\\d{1,2}) (\\w{3}) (\\d{4})$',
      '{Y}-{M}-{D} {h}:{m}',
      'date_en_GijMY'
    ],

    // 仅日期+时间（24 小时制）："26 Dec 2021, 03:06" -> "2021-12-26 03:06"
    [
      '^(\\d{1,2}) (\\w{3}) (\\d{4}), (\\d{1,2}):(\\d{2})$',
      '{Y}-{M}-{D} {h}:{m}',
      'date_en_dMYhm'
    ],

    // 发布时间："Published 19 Nov 2025, 00:07" -> "发布于 2025-11-19 00:07"
    [
      '^Published (\\d{1,2}) (\\w{3}) (\\d{4}), (\\d{1,2}):(\\d{2})$',
      '发布于 {Y}-{M}-{D} {h}:{m}',
      'date_en_dMYhm'
    ],

    // Uploaded 02 Apr 2016, 10:23 -> 上传于 2016-04-02 10:23
    [
      '^Uploaded (\\d{1,2}) (\\w{3}) (\\d{4}), (\\d{1,2}):(\\d{2})$',
      '上传于 {Y}-{M}-{D} {h}:{m}',
      'date_en_dMYhm'
    ],

    // Updated 15 Jul 2025, 09:53 -> 更新于 2025-07-15 09:53
    [
      '^Updated (\\d{1,2}) (\\w{3}) (\\d{4}), (\\d{1,2}):(\\d{2})$',
      '更新于 {Y}-{M}-{D} {h}:{m}',
      'date_en_dMYhm'
    ],

    // 认证作者信息："This user is a verified Mod Author and has a total of 15,158 unique downloads across all of their mods."
    // -> "该用户是认证模组作者，所有模组共有 15,158 次独立下载。"
    [
      '^This user is a verified Mod Author and has a total of ([0-9,]+) unique downloads across all of their mods\\.$',
      '该用户是认证模组作者，所有模组共有 $1 次独立下载。'
    ],

    // 评论跟踪中心说明（动态评论主题数量）
    [
      '^The comment tracking centre lists all the comment and discussion threads related to all your uploaded files on this site\\.\\s+It is listed in the order of the time of the last post, with the most recent post at the top\\. You have ([0-9,]+) comment topics across all your files\\.$',
      '评论关注中心列出了所有与你在这个网站上上传的文件相关的评论和讨论主题。它按照最后回复的时间顺序列出，最近的回复在最上面。你在这个网站上的所有文件共有 $1 个评论主题。'
    ],

    // Open Community  ·  2830 members
    [
      '^Open Community · ([0-9,]+) members$',
      '开放社区 · $1 位成员'
    ],

    // 1 member / 2 members
    [
      '^([0-9,]+) members?$',
      ' $1 位成员'
    ],
    
    // Page 1 of 278
    [
      '^Page ([0-9,]+) of ([0-9,]+)$',
      '$1 / $2 页'
    ],

    // go to page 2
    [
      '^Go to page ([0-9,]+)$',
      '前往第 $1 页'
    ],

    // 139 Members / 139 Member
    [
      '^([0-9,]+) Members?$',
      '$1 位成员'
    ],
    
    // , 5 Anonymous, 1159 Guests
    [
      '^, ([0-9,]+) Anonymous, ([0-9,]+) Guests$',
      '，$1 位匿名用户，$2 位访客'
    ],

    // 1 reply / 2 replies
    [
      '^([0-9,]+)\\s+repl(?:y|ies)$',
      '$1 条回复'
    ],
    

    // You will receive a notification when karurawasabi posts new content.
    [
      '^You will receive a notification when (.+) posts new content\\.$',
      '你将在 $1 发布新内容时收到通知。'
    ],

    // Let others see that I follow karurawasabi
    [
      '^Let others see that I follow (.+)$',
      '让其他人看到我关注 $1'
    ],

    // Follow karurawasabi
    [
      '^Follow (.+)$',
      '关注 $1'
    ],

    // karurawasabi's Achievements
    [
      '^(.+)\'s Achievements$',
      '$1 的成就'
    ],

    // Everything posted by karurawasabi
    [
      '^Everything posted by (.+)$',
      '所有由 $1 发布的内容'
    ],

    // Ignoring ArtKing1239
    [
      '^Ignoring (.+)$',
      '忽略 $1'
    ],

    // e.g. "3 - DELETED has been deleted." -> "3 - DELETED 已被删除。"
    [
      '^(.+?) has been deleted\\.$',
      '$1 已被删除。'
    ]



  ];
})(window);


