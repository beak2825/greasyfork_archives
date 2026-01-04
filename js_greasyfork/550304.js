// ==UserScript==
// @name         Civitai中文翻译插件
// @namespace    https://github.com/ling552/
// @version      0.1.1
// @description  将Civitai网站翻译为简体中文
// @author       Ling
// @match        https://civitai.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550304/Civitai%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/550304/Civitai%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 翻译词典
    const translations = {
        // 导航栏
        'home': '首页',
        'models': '模型',
        'images': '图片',
        'videos': '视频',
        'posts': '帖子',
        'articles': '文章',
        'bounties': '悬赏',
        'challenges': '挑战',
        'events': '活动',
        'updates': '更新',
        'shop': '商店',
        'More': '更多',
        'Create': '创建',
        'Sign In': '登录',
        'Pro': '专业版',
//更多
        'Image': '图片',
        'Video': '视频',
        'REMIX':'二次创作',
        'Modifiers': '修改器',
        'period': '周期',
        'blur': '模糊',
        'Blur': '模糊',
        'mature':'成人',
        'Select the levels of content you want to see': '选择要查看的内容级别',
        'Browsing': '浏览',
        'With X or XXX enabled, some content may be hidden.': '启用x或xxx时，可能会隐藏某些内容。',
        'Learn': '学习',
        'swap': '替换',
        'Prompt': '提示词',
        'Steps': '步数',
        'Seed': '种子',
        'Priority': '优先级',
        'Aspect Ratio': '比例',
        'Square': '方形',
        'Sampler': '采样器',
        'Fast': '快速',
        'Random': '随机',
        'Balanced': '平衡',
        'High': '高',
        'Precise': '精确',
        'Workflow': '工作流',
        'Claim': '声称',
        'View generation queue': '视图生成队列',
        'Quantity': '数量',
        'Buzzing!': '活跃!',
        'Additional Resources': '额外资源',
        'No resources selected': '未选择资源',
        'Generation Type': '创建类型',
        'Reactions': '反应',
        'Liked': '喜欢',
        'Disliked' :'不喜欢',
        'Favorited' :'收藏',
        'Remix (with seed)' :'二次创作（带种子）',
        'Background Removal' :'去除背景',
        'Face fix' :'面部修复',
        'Hi-res fix' :'高清修复',
        'Upscale' :'放大',
        'Variations (img2img)' :'变化（图像到图像）',
        'Image To Video' :'图像转视频',
        'Open in New Tab' :'在新界面打开',
        'Save image to collection' :'保存图片到收藏',
        'View Post' :'查看帖子',
        'Report image' :'举报图片',
        'Hide this image' :'隐藏此图片',
        'Hide content from this user' :'隐藏此用户内容',


        // 模型相关
        'Featured Models': '精选模型',
        'Explore all models': '浏览所有模型',
        'A list of all featured models on the site.': '网站上所有精选模型的列表。',
        'Highest Rated': '最高评分',
        'Early Access': '抢先体验',
        'Filters': '筛选器',
        'Checkpoint': '检查点',
        'LoRA': 'LoRA',
        'base model': '基础模型',
        'character': '角色',
        'style': '风格',
        'concept': '概念',
        'clothing': '服装',
        'poses': '姿势',
        'background': '背景',
        'tool': '工具',
        'vehicle': '载具',
        'buildings': '建筑',
        'objects': '物体',
        'assets': '素材',
        'animal': '动物',
        'action': '动作',

        // 图片相关
        'Featured Images': '精选图片',
        'Explore all images': '浏览所有图片',
        'All sorts of cool pictures created by our community, from simple shapes to detailed landscapes or human faces. A virtual canvas where you can unleash your creativity or get inspired.': '我们社区创建的各种酷图，从简单的形状到详细的风景或人脸。一个虚拟画布，您可以在这里释放创造力或获得灵感。',
        'Get Featured': '获得推荐',

        // 创作者相关
        'Top Creators': '顶级创作者',
        'View more': '查看更多',
        'Creators (Flux)': '创作者 (Flux)',
        'Creators (Pony)': '创作者 (Pony)',
        'Creators (SDXL)': '创作者 (SDXL)',
        'Creators': '创作者',
        'New Creators': '新创作者',
        'Guardians': '守护者',
        'Writers': '作家',
        'Comedians': '喜剧演员',
        'Master Generators': '大师生成器',
        'New Master Generators': '新大师生成器',
        'Base Model Creators': '基础模型创作者',
        'Style Creators': '风格创作者',
        'Clothing Creators': '服装创作者',
        'Character Creators': '角色创作者',
        'Architecture Creators': '建筑创作者',
        'Background Creators': '背景创作者',
        'Poses Creators': '姿势创作者',
        'Vehicle Creators': '载具创作者',
        'Asset Creators': '素材创作者',
        'Tool Creators': '工具创作者',

        // 文章相关
        'Featured Articles': '精选文章',
        'Explore all articles': '浏览所有文章',
        'Find information, guides and tutorials, analysis on particular topics and much more. From the community, for the community.': '查找信息、指南和教程、特定主题的分析等等。来自社区，服务社区。',

        // 其他功能
        'Buzz Beggars Board': 'Buzz求助板',
        'Beg or Give': '求助或给予',
        'Ran out of Buzz while playing? Or want to be generous? Jump in.': '游戏时Buzz用完了？或者想要慷慨一些？快来参与吧。',
        'View auctions': '查看拍卖',
        'On Socials': '社交媒体',
        'The latest from us and collaborators in the community. Follow us to stay up to date with the latest updates.': '来自我们和社区合作者的最新消息。关注我们以了解最新更新。',
        'All': '全部',

        // 竞赛相关
        'The Boomer Bamboozle Contest': 'Boomer困惑大赛',
        'is live! Show us your most absurdly believable AI images and videos to win big! Live now until Sept. 30th!': '正在进行中！向我们展示您最荒诞但令人信服的AI图片和视频来赢得大奖！现在开始，截止到9月30日！',
        'Read the rules': '阅读规则',

        // 会员相关
        'Become a Member to turn off ads today.': '今天就成为会员来关闭广告。',
        'Do It': '立即行动',

        // 页脚
        'Terms of Service': '服务条款',
        'Privacy': '隐私',
        'Safety': '安全',
        'Newsroom': '新闻室',
        'API': 'API',
        'Status': '状态',
        'Education': '教育',
        'Careers': '招聘',
        'Support': '支持',
        'Users': '用户',
        'Collections': '收藏',
        'Tools': '工具',

        // 常用动作词
        'Download': '下载',
        'Upload': '上传',
        'Save': '保存',
        'Share': '分享',
        'Like': '喜欢',
        'Follow': '关注',
        'Comment': '评论',
        'Reply': '回复',
        'Edit': '编辑',
        'Delete': '删除',
        'Report': '举报',
        'Search': '搜索',
        'Filter': '筛选',
        'Sort': '排序',
        'Load more': '加载更多',
        'Show more': '显示更多',
        'Show less': '显示更少',
        'View all': '查看全部',

        // 时间相关
        'ago': '前',
        'minute': '分钟',
        'minutes': '分钟',
        'hour': '小时',
        'hours': '小时',
        'day': '天',
        'days': '天',
        'week': '周',
        'weeks': '周',
        'month': '月',
        'months': '月',
        'year': '年',
        'years': '年',

        // 数量单位
        'k': 'k',
        'M': 'M',
        'B': 'B',

        // 模型类型和标签
        'NSFW': 'NSFW',
        'SFW': 'SFW',
        'Anime': '动漫',
        'Realistic': '写实',
        'Fantasy': '奇幻',
        'Sci-Fi': '科幻',
        'Portrait': '肖像',
        'Landscape': '风景',
        'Abstract': '抽象',
        'Digital Art': '数字艺术',
        'Photography': '摄影',
        '3D': '3D',
        '2D': '2D'
    };

    // 扩展翻译
    const additionalTranslations = {
        'Loading': '加载中',
        'Error': '错误',
        'Success': '成功',
        'Warning': '警告',
        'Info': '信息',
        'Close': '关闭',
        'Cancel': '取消',
        'Confirm': '确认',
        'Yes': '是',
        'No': '否',
        'OK': '确定',
        'Submit': '提交',
        'Reset': '重置',
        'Clear': '清除',
        'Next': '下一个',
        'Previous': '上一个',
        'First': '第一个',
        'Last': '最后一个',
        'Page': '页面',
        'of': '共',
        'Results': '结果',
        'No results found': '未找到结果',
        'Try again': '重试',
        'Refresh': '刷新',
        'Settings': '设置',
        'Profile': '个人资料',
        'Account': '账户',
        'Login': '登录',
        'Register': '注册',
        'Logout': '退出登录',
        'Password': '密码',
        'Email': '邮箱',
        'Username': '用户名',
        'Name': '姓名',
        'Description': '描述',
        'Title': '标题',
        'Content': '内容',
        'Category': '分类',
        'Tag': '标签',
        'Tags': '标签',
        'Rating': '评分',
        'Reviews': '评价',
        'Comments': '评论',
        'Replies': '回复',
        'Votes': '投票',
        'Views': '查看',
        'Downloads': '下载',
        'Favorites': '收藏',
        'Bookmarks': '书签',
        'History': '历史',
        'Notifications': '通知',
        'Messages': '消息',
        'Inbox': '收件箱',
        'Sent': '已发送',
        'Draft': '草稿',
        'Trash': '垃圾箱',
        'Archive': '存档',
        'Trending': '热门',
        'Popular': '流行',
        'Latest': '最新',
        'Recent': '最近',
        'Featured': '精选',
        'Recommended': '推荐',
        'Hot': '热门',
        'New': '新',
        'Top': '顶部',
        'Best': '最佳',
        'Quality': '质量',
        'Size': '大小',
        'Format': '格式',
        'Resolution': '分辨率',
        'Duration': '时长',
        'Date': '日期',
        'Time': '时间',
        'Author': '作者',
        'Creator': '创作者',
        'Artist': '艺术家',
        'Model': '模型',
        'Version': '版本',
        'Update': '更新',
        'Changelog': '更新日志',
        'License': '许可证',
        'Copyright': '版权',
        'Terms': '条款',
        'Conditions': '条件',
        'Agreement': '协议',
        'Policy': '政策',
        'Guidelines': '指南',
        'Rules': '规则',
        'Help': '帮助',
        'FAQ': '常见问题',
        'Documentation': '文档',
        'Tutorial': '教程',
        'Guide': '指南',
        'Examples': '示例',
        'Demo': '演示',
        'Preview': '预览',
        'Sample': '样本',
        'Template': '模板',
        'Theme': '主题',
        'Layout': '布局',
        'Design': '设计',
        'Style': '样式',
        'Color': '颜色',
        'Font': '字体',
        'Size': '大小',
        'Width': '宽度',
        'Height': '高度',
        'Margin': '边距',
        'Padding': '内边距',
        'Border': '边框',
        'Background': '背景',
        'Foreground': '前景',
        'Opacity': '透明度',
        'Visibility': '可见性',
        'Display': '显示',
        'Position': '位置',
        'Alignment': '对齐',
        'Justify': '对齐',
        'Center': '居中',
        'Left': '左',
        'Right': '右',
        'Top': '顶部',
        'Bottom': '底部',
        'Middle': '中间',
        'Start': '开始',
        'End': '结束',
        'Full': '完整',
        'Half': '一半',
        'Quarter': '四分之一',
        'Third': '三分之一',
        'Auto': '自动',
        'Manual': '手动',
        'Custom': '自定义',
        'Default': '默认',
        'None': '无',
        'All': '全部',
        'Any': '任意',
        'Other': '其他',
        'More': '更多',
        'Less': '更少',
        'Show': '显示',
        'Hide': '隐藏',
        'Open': '打开',
        'Close': '关闭',
        'Expand': '展开',
        'Collapse': '折叠',
        'Minimize': '最小化',
        'Maximize': '最大化',
        'Restore': '恢复',
        'Toggle': '切换',
        'Switch': '切换',
        'Change': '更改',
        'Modify': '修改',
        'Add': '添加',
        'Remove': '移除',
        'Insert': '插入',
        'Append': '追加',
        'Prepend': '前置',
        'Replace': '替换',
        'Move': '移动',
        'Copy': '复制',
        'Cut': '剪切',
        'Paste': '粘贴',
        'Duplicate': '复制',
        'Clone': '克隆',
        'Import': '导入',
        'Export': '导出',
        'Backup': '备份',
        'Restore': '恢复',
        'Sync': '同步',
        'Connect': '连接',
        'Disconnect': '断开连接',
        'Online': '在线',
        'Offline': '离线',
        'Available': '可用',
        'Unavailable': '不可用',
        'Active': '活跃',
        'Inactive': '非活跃',
        'Enabled': '启用',
        'Disabled': '禁用',
        'On': '开启',
        'Off': '关闭',
        'True': '真',
        'False': '假',
        'Valid': '有效',
        'Invalid': '无效',
        'Required': '必需',
        'Optional': '可选',
        'Empty': '空',
        'Full': '满',
        'Complete': '完成',
        'Incomplete': '未完成',
        'Finished': '已完成',
        'Unfinished': '未完成',
        'Done': '完成',
        'Pending': '待处理',
        'Processing': '处理中',
        'Failed': '失败',
        'Cancelled': '已取消',
        'Expired': '已过期',
        'Deleted': '已删除',
        'Archived': '已存档',
        'Published': '已发布',
        'Unpublished': '未发布',
        'Draft': '草稿',
        'Private': '私人',
        'Public': '公开',
        'Shared': '共享',
        'Personal': '个人',
        'Professional': '专业',
        'Business': '商业',
        'Enterprise': '企业',
        'Free': '免费',
        'Premium': '高级',
        'Pro': '专业版',
        'Basic': '基础',
        'Standard': '标准',
        'Advanced': '高级',
        'Expert': '专家',
        'Beginner': '初学者',
        'Intermediate': '中级',
        'Level': '等级',
        'Rank': '排名',
        'Score': '分数',
        'Points': '积分',
        'Credits': '积分',
        'Coins': '金币',
        'Tokens': '代币',
        'Balance': '余额',
        'Wallet': '钱包',
        'Payment': '支付',
        'Purchase': '购买',
        'Buy': '购买',
        'Sell': '出售',
        'Price': '价格',
        'Cost': '成本',
        'Value': '价值',
        'Amount': '数量',
        'Total': '总计',
        'Subtotal': '小计',
        'Tax': '税',
        'Discount': '折扣',
        'Coupon': '优惠券',
        'Promotion': '促销',
        'Offer': '优惠',
        'Deal': '交易',
        'Sale': '销售',
        'Special': '特殊',
        'Limited': '限制',
        'Exclusive': '独家',
        'Bonus': '奖金',
        'Reward': '奖励',
        'Gift': '礼品',
        'Prize': '奖品',
        'Winner': '获胜者',
        'Contest': '竞赛',
        'Competition': '比赛',
        'Challenge': '挑战',
        'Event': '活动',
        'Campaign': '活动',
        'Program': '计划',
        'Project': '项目',
        'Task': '任务',
        'Job': '工作',
        'Mission': '任务',
        'Goal': '目标',
        'Objective': '目标',
        'Purpose': '目的',
        'Reason': '原因',
        'Cause': '原因',
        'Effect': '影响',
        'Result': '结果',
        'Outcome': '结果',
        'Consequence': '后果',
        'Impact': '影响',
        'Influence': '影响',
        'Benefit': '好处',
        'Advantage': '优势',
        'Disadvantage': '劣势',
        'Pros': '优点',
        'Cons': '缺点',
        'Positive': '正面',
        'Negative': '负面',
        'Good': '好',
        'Bad': '坏',
        'Better': '更好',
        'Worse': '更差',
        'Best': '最好',
        'Worst': '最差',
        'Excellent': '优秀',
        'Great': '很好',
        'Amazing': '惊人',
        'Awesome': '棒',
        'Fantastic': '太棒了',
        'Wonderful': '精彩',
        'Perfect': '完美',
        'Outstanding': '杰出',
        'Remarkable': '卓越',
        'Impressive': '令人印象深刻',
        'Brilliant': '聪明',
        'Creative': '创意',
        'Innovative': '创新',
        'Original': '原创',
        'Unique': '独特',
        'Special': '特殊',
        'Rare': '稀有',
        'Common': '常见',
        'Popular': '流行',
        'Famous': '著名',
        'Known': '知名',
        'Unknown': '未知',
        'Anonymous': '匿名',
        'Guest': '访客',
        'Member': '会员',
        'User': '用户',
        'Admin': '管理员',
        'Moderator': '版主',
        'Staff': '员工',
        'Team': '团队',
        'Group': '组',
        'Community': '社区',
        'Organization': '组织',
        'Company': '公司',
        'Brand': '品牌',
        'Product': '产品',
        'Service': '服务',
        'Feature': '功能',
        'Function': '功能',
        'Capability': '能力',
        'Ability': '能力',
        'Skill': '技能',
        'Talent': '天赋',
        'Experience': '经验',
        'Knowledge': '知识',
        'Information': '信息',
        'Data': '数据',
        'Details': '详情',
        'Specification': '规格',
        'Requirements': '要求',
        'Conditions': '条件',
        'Criteria': '标准',
        'Standards': '标准',
        'Quality': '质量',
        'Performance': '性能',
        'Speed': '速度',
        'Efficiency': '效率',
        'Accuracy': '准确性',
        'Precision': '精确',
        'Reliability': '可靠性',
        'Stability': '稳定性',
        'Security': '安全',
        'Privacy': '隐私',
        'Protection': '保护',
        'Safety': '安全',
        'Risk': '风险',
        'Danger': '危险',
        'Warning': '警告',
        'Alert': '警报',
        'Notice': '通知',
        'Announcement': '公告',
        'News': '新闻',
        'Update': '更新',
        'Upgrade': '升级',
        'Improvement': '改进',
        'Enhancement': '增强',
        'Optimization': '优化',
        'Modification': '修改',
        'Adjustment': '调整',
        'Configuration': '配置',
        'Setup': '设置',
        'Installation': '安装',
        'Download': '下载',
        'Upload': '上传',
        'Transfer': '传输',
        'Share': '分享',
        'Send': '发送',
        'Receive': '接收',
        'Get': '获取',
        'Fetch': '获取',
        'Retrieve': '检索',
        'Access': '访问',
        'Enter': '进入',
        'Exit': '退出',
        'Leave': '离开',
        'Return': '返回',
        'Back': '返回',
        'Forward': '前进',
        'Continue': '继续',
        'Proceed': '继续',
        'Stop': '停止',
        'Pause': '暂停',
        'Resume': '恢复',
        'Restart': '重启',
        'Reload': '重新加载',
        'Refresh': '刷新',
        'Update': '更新',
        'Sync': '同步',
        'Save': '保存',
        'Load': '加载',
        'Import': '导入',
        'Export': '导出',
        'Print': '打印',
        'Preview': '预览',
        'View': '查看',
        'Show': '显示',
        'Display': '显示',
        'Present': '展示',
        'Demonstrate': '演示',
        'Explain': '解释',
        'Describe': '描述',
        'Define': '定义',
        'Clarify': '澄清',
        'Specify': '指定',
        'Indicate': '指示',
        'Point': '指向',
        'Select': '选择',
        'Choose': '选择',
        'Pick': '选择',
        'Decide': '决定',
        'Determine': '确定',
        'Set': '设置',
        'Adjust': '调整',
        'Modify': '修改',
        'Change': '更改',
        'Alter': '改变',
        'Transform': '转换',
        'Convert': '转换',
        'Translate': '翻译',
        'Interpret': '解释',
        'Understand': '理解',
        'Comprehend': '理解',
        'Realize': '实现',
        'Recognize': '识别',
        'Identify': '识别',
        'Locate': '定位',
        'Find': '查找',
        'Search': '搜索',
        'Look': '查看',
        'Seek': '寻找',
        'Hunt': '搜寻',
        'Explore': '探索',
        'Discover': '发现',
        'Uncover': '揭露',
        'Reveal': '揭示',
        'Expose': '暴露',
        'Show': '显示',
        'Hide': '隐藏',
        'Conceal': '隐藏',
        'Cover': '覆盖',
        'Protect': '保护',
        'Secure': '保护',
        'Guard': '守护',
        'Defend': '防御',
        'Shield': '保护',
        'Block': '阻挡',
        'Prevent': '防止',
        'Avoid': '避免',
        'Escape': '逃避',
        'Flee': '逃离',
        'Run': '运行',
        'Walk': '走',
        'Move': '移动',
        'Go': '去',
        'Come': '来',
        'Arrive': '到达',
        'Depart': '离开',
        'Travel': '旅行',
        'Journey': '旅程',
        'Trip': '旅行',
        'Visit': '访问',
        'Stay': '停留',
        'Remain': '保持',
        'Keep': '保持',
        'Maintain': '维护',
        'Preserve': '保存',
        'Conserve': '保护',
        'Protect': '保护',
        'Care': '关心',
        'Support': '支持',
        'Help': '帮助',
        'Assist': '协助',
        'Aid': '帮助',
        'Guide': '指导',
        'Lead': '领导',
        'Direct': '指导',
        'Manage': '管理',
        'Control': '控制',
        'Handle': '处理',
        'Deal': '处理',
        'Treat': '处理',
        'Process': '处理',
        'Execute': '执行',
        'Perform': '执行',
        'Accomplish': '完成',
        'Achieve': '实现',
        'Reach': '达到',
        'Attain': '获得',
        'Obtain': '获得',
        'Acquire': '获得',
        'Gain': '获得',
        'Earn': '赚取',
        'Win': '赢得',
        'Lose': '失去',
        'Miss': '错过',
        'Fail': '失败',
        'Succeed': '成功',
        'Pass': '通过',
        'Complete': '完成',
        'Finish': '完成',
        'End': '结束',
        'Conclude': '结束',
        'Close': '关闭',
        'Shut': '关闭',
        'Open': '打开',
        'Start': '开始',
        'Begin': '开始',
        'Commence': '开始',
        'Initiate': '启动',
        'Launch': '启动',
        'Create': '创建',
        'Make': '制作',
        'Build': '构建',
        'Construct': '建造',
        'Develop': '开发',
        'Design': '设计',
        'Plan': '计划',
        'Prepare': '准备',
        'Ready': '准备',
        'Set': '设置',
        'Organize': '组织',
        'Arrange': '安排',
        'Schedule': '安排',
        'Book': '预订',
        'Reserve': '预留',
        'Order': '订购',
        'Request': '请求',
        'Ask': '询问',
        'Question': '问题',
        'Answer': '答案',
        'Reply': '回复',
        'Respond': '回应',
        'React': '反应',
        'Interact': '交互',
        'Communicate': '沟通',
        'Talk': '谈话',
        'Speak': '说话',
        'Say': '说',
        'Tell': '告诉',
        'Inform': '通知',
        'Notify': '通知',
        'Alert': '提醒',
        'Remind': '提醒',
        'Warn': '警告',
        'Advise': '建议',
        'Suggest': '建议',
        'Recommend': '推荐',
        'Propose': '提议',
        'Offer': '提供',
        'Provide': '提供',
        'Supply': '提供',
        'Deliver': '交付',
        'Give': '给予',
        'Present': '赠送',
        'Grant': '授予',
        'Allow': '允许',
        'Permit': '允许',
        'Enable': '启用',
        'Disable': '禁用',
        'Activate': '激活',
        'Deactivate': '停用',
        'Turn on': '开启',
        'Turn off': '关闭',
        'Switch on': '打开',
        'Switch off': '关闭'
    };

    // 站点定制翻译
    const siteSpecificTranslations = {
        // 顶部筛选/排序
        'Everyone': '所有人',
        'Following': '关注的人',
        'Followed': '关注的人',
        'Most Reactions': '最多互动',
        'Most Reaction': '最多互动',
        'Most Comments': '最多评论',
        'Most Collected': '最多收藏',
        'Most Buzz': '最多 Buzz',
        
        // 创建菜单
        'Generate': '生图',
        'Post Images': '发布图片',
        'Post Videos': '发布视频',
        'Upload a Model': '上传模型',
        'Train a LoRA': '训练 LoRA',
        'Write an Article': '写文章',
        'Create a Bounty': '创建悬赏',

        // 侧边菜单
        'Your Profile': '你的个人资料',
        'Training': '训练',
        'My': '我的',
        'My Collections': '我的收藏',
        'Liked Models': '喜欢的模型',
        'Bookmarked Articles': '收藏的文章',
        'My Bounties': '我的悬赏',
        'Buzz Dashboard': 'Buzz仪表板',
        'My Vault': '我的保险库',
        'Leaderboard': '排行榜',
        'Auctions': '拍卖',
        'Knights': '骑士',
        'Knights Update': '骑士更新',
        'Download Link App': '下载 Link 应用',
        'Link App': 'Link 应用',
        'Creators You Follow': '你关注的创作者',
        'Download History': '下载历史',
        'Getting Started': '新手入门',

        // 导航标签页
        'Pro': '专业版',
        'Buzz': 'Buzz',
        'Sign In': '登录',
        'Create': '创建',
        'Models': '模型',
        'Images': '图片',
        'Videos': '视频',
        'Articles': '文章',
        'Bounties': '悬赏',
        'Shop': '商店',
        'Contests': '竞赛',

        // 页面元素
        'Contests': '竞赛',
        'Contest': '竞赛',
        'Competition': '比赛',
        'Prize': '奖品',
        'Reward': '奖励',
        'Winner': '获胜者',
        'Entry': '参赛作品',
        'Entries': '参赛作品',
        'Submission': '投稿',
        'Submissions': '投稿',
        'Deadline': '截止日期',
        'Voting': '投票',
        'Results': '结果',

        // 创建下拉菜单
        'Post Image': '发布图片',
        'Post Video': '发布视频',
        'Write Article': '写文章',
        'Upload Model': '上传模型',
        'Create Bounty': '创建悬赏',
        'Train LoRA': '训练 LoRA',

        // 分类标签（复数形式补充）
        'WOMEN': '女性',
        'Women': '女性',
        'woman': '女性',
        'MEN': '男性',
        'Men': '男性',
        'man': '男性',
        'CLOTHING': '服装',
        'Clothing': '服装',
        'clothing': '服装',
        'ANIME': '动漫',
        'Anime': '动漫',
        'anime': '动漫',
        'OUTDOORS': '户外',
        'Outdoors': '户外',
        'outdoors': '户外',
        'COMICS': '漫画',
        'Comics': '漫画',
        'comics': '漫画',
        'PHOTOGRAPHY': '摄影',
        'Photography': '摄影',
        'photography': '摄影',
        'COSTUME': '服饰',
        'Costume': '服饰',
        'costume': '服饰',
        'SWIMWEAR': '游泳装',
        'Swimwear': '游泳装',
        'swimwear': '游泳装',
        'ARMOR': '盔甲',
        'Armor': '盔甲',
        'armor': '盔甲',
        'TRANSPORTATION': '交通工具',
        'Transportation': '交通工具',
        'transportation': '交通工具',
        'ARCHITECTURE': '建筑',
        'Architecture': '建筑',
        'architecture': '建筑',
        'CITY': '城市',
        'City': '城市',
        'city': '城市',
        'CARTOON': '卡通',
        'Cartoon': '卡通',
        'cartoon': '卡通',
        'CAR': '汽车',
        'Car': '汽车',
        'car': '汽车',
        'FOOD': '食物',
        'Food': '食物',
        'food': '食物',
        'ASTRONOMY': '天文',
        'Astronomy': '天文',
        'astronomy': '天文',
        'MODERN ART': '现代艺术',
        'Modern Art': '现代艺术',
        'modern art': '现代艺术',
        'CAT': '猫',
        'Cat': '猫',
        'cat': '猫',
        'FANTASY': '奇幻',
        'Fantasy': '奇幻',
        'fantasy': '奇幻',
        'NATURE': '自然',
        'Nature': '自然',
        'nature': '自然',
        'PORTRAIT': '肖像',
        'Portrait': '肖像',
        'portrait': '肖像',
        'LANDSCAPE': '风景',
        'Landscape': '风景',
        'landscape': '风景',

        // 筛选器相关
        'Filters': '筛选器',
        'Filter': '筛选',
        'Filter by': '筛选依据',
        'Sort by': '排序依据',
        'Sort': '排序',
        'Order': '排序',
        'Newest': '最新',
        'Oldest': '最早',
        'Latest': '最新',
        'Recent': '最近',
        'Popular': '热门',
        'Trending': '趋势',
        'Hot': '热门',
        'Top': '热门',
        'Best': '最佳',
        'Highest Rated': '最高评分',
        'Most Downloaded': '最多下载',
        'Most Liked': '最多点赞',
        'Most Commented': '最多评论',
        'Most Viewed': '最多查看',

        // 按钮和操作
        'Download': '下载',
        'Like': '点赞',
        'Unlike': '取消点赞',
        'Bookmark': '收藏',
        'Unbookmark': '取消收藏',
        'Share': '分享',
        'Comment': '评论',
        'Reply': '回复',
        'Report': '举报',
        'Flag': '标记',
        'Follow': '关注',
        'Unfollow': '取消关注',
        'Subscribe': '订阅',
        'Unsubscribe': '取消订阅',
        'Block': '屏蔽',
        'Unblock': '取消屏蔽',
        'Edit': '编辑',
        'Delete': '删除',
        'Remove': '移除',
        'Add': '添加',
        'Upload': '上传',
        'Submit': '提交',
        'Publish': '发布',
        'Draft': '草稿',
        'Save': '保存',
        'Cancel': '取消',
        'Confirm': '确认',
        'Apply': '应用',
        'Reset': '重置',
        'Clear': '清除',

        // 状态和标签
        'Published': '已发布',
        'Unpublished': '未发布',
        'Draft': '草稿',
        'Pending': '待审核',
        'Approved': '已批准',
        'Rejected': '已拒绝',
        'Featured': '精选',
        'Sponsored': '赞助',
        'Premium': '高级',
        'Free': '免费',
        'Paid': '付费',
        'NSFW': 'NSFW',
        'SFW': 'SFW',
        'New': '新',
        'Updated': '已更新',
        'Hot': '热门',
        'Trending': '趋势',
        'Rising': '上升',

        // 数量和统计
        'views': '查看次数',
        'likes': '点赞数',
        'downloads': '下载次数',
        'comments': '评论数',
        'followers': '粉丝数',
        'following': '关注数',
        'bounties': '悬赏数',
        'collections': '收藏数',

        // 时间相关
        'ago': '前',
        'minute': '分钟',
        'minutes': '分钟',
        'hour': '小时',
        'hours': '小时',
        'day': '天',
        'days': '天',
        'week': '周',
        'weeks': '周',
        'month': '月',
        'months': '月',
        'year': '年',
        'years': '年',
        'just now': '刚刚',
        'recently': '最近',
        'today': '今天',
        'yesterday': '昨天',
        'tomorrow': '明天',

        // 页面标题和描述
        'Home': '首页',
        'Browse': '浏览',
        'Explore': '探索',
        'Discover': '发现',
        'Search': '搜索',
        'Profile': '个人资料',
        'Settings': '设置',
        'Dashboard': '仪表板',
        'Notifications': '通知',
        'Messages': '消息',
        'Help': '帮助',
        'Support': '支持',
        'About': '关于',
        'Contact': '联系',
        'Terms': '条款',
        'Privacy': '隐私',
        'Guidelines': '指南',
        'Rules': '规则',
        'FAQ': '常见问题'
    };

    // 合并所有翻译
    const allTranslations = { ...translations, ...siteSpecificTranslations, ...additionalTranslations };

    const lowerCaseTranslations = {};
    for (const [k, v] of Object.entries(allTranslations)) {
        lowerCaseTranslations[k.toLowerCase()] = v;
    }

    // 追加常见缺失词条（筛选/短语变体/所有格）
    Object.assign(siteSpecificTranslations, {
        'Filters': '筛选器',
        'Filter by': '筛选依据',
        'Sort by': '排序依据',
        'Newest': '最新',
        'Oldest': '最早',
        // 创建菜单变体
        'Upload a model': '上传模型',
        'Upload model': '上传模型',
        'Upload Model': '上传模型',
        'Train LoRA': '训练 LoRA',
        'Create Bounty': '创建悬赏'
    });
    Object.assign(additionalTranslations, {
        'Your': '你的'
    });
    // 同步更新大小写映射
    for (const [k, v] of Object.entries(siteSpecificTranslations)) lowerCaseTranslations[k.toLowerCase()] = v;
    for (const [k, v] of Object.entries(additionalTranslations)) lowerCaseTranslations[k.toLowerCase()] = v;

    const translationCache = new Map();

    function translateText(text) {
        if (!text || typeof text !== 'string') return text;

        if (translationCache.has(text)) {
            return translationCache.get(text);
        }

        let translatedText = text;

        if (allTranslations[text]) {
            translatedText = allTranslations[text];
        } else if (lowerCaseTranslations[text.toLowerCase()]) {
            translatedText = lowerCaseTranslations[text.toLowerCase()];
        } else {

            const words = text.split(/(\s+)/);
            let hasTranslation = false;

            for (let i = 0; i < words.length; i++) {
                const raw = words[i];
                const word = raw.trim();
                if (!word) continue;
                const lc = word.toLowerCase();
                const repl = allTranslations[word] || lowerCaseTranslations[lc];
                if (repl) {
                    words[i] = raw.replace(word, repl);
                    hasTranslation = true;
                }
            }

            if (hasTranslation) {
                translatedText = words.join('');
            }
        }

        translationCache.set(text, translatedText);
        return translatedText;
    }

    function tryTranslateCompoundPhraseForElement(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
        if (node.hasAttribute('data-civi-cn-compound')) return false; // 已处理

        const combinedRaw = (node.textContent || '').trim();
        if (!combinedRaw) return false;
        if (combinedRaw.length > 80) return false; 
        if (!/\s/.test(combinedRaw)) return false;

        const combinedNormalized = combinedRaw.replace(/\s+/g, ' ').trim();
        const lookup = (s) => (allTranslations[s] || lowerCaseTranslations[s.toLowerCase()]);
        let repl = lookup(combinedRaw);
        if (!repl) repl = lookup(combinedNormalized);
        if (!repl || repl === combinedRaw) return false;

        const textNodes = [];
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
        let current;
        while ((current = walker.nextNode())) {
            if ((current.textContent || '').trim() === '') continue;
            textNodes.push(current);
        }
        if (textNodes.length === 0) return false;

        textNodes[0].textContent = repl;
        for (let i = 1; i < textNodes.length; i++) {
            textNodes[i].textContent = '';
        }
        node.setAttribute('data-civi-cn-compound', '1');
        return true;
    }

    function translateNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const originalText = node.textContent.trim();
            if (originalText) {
                const translatedText = translateText(originalText);
                if (translatedText !== originalText) {
                    node.textContent = translatedText;
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            if (['script', 'style', 'noscript', 'code', 'pre'].includes(tagName)) {
                return;
            }
            tryTranslateCompoundPhraseForElement(node);

            const attributesToTranslate = ['title', 'alt', 'placeholder', 'aria-label'];
            attributesToTranslate.forEach(attr => {
                if (node.hasAttribute(attr)) {
                    const originalValue = node.getAttribute(attr);
                    const translatedValue = translateText(originalValue);
                    if (translatedValue !== originalValue) {
                        node.setAttribute(attr, translatedValue);
                    }
                }
            });

            const childNodes = Array.from(node.childNodes);
            childNodes.forEach(child => {
                translateNode(child);
            });
        }
    }

    function translatePage() {
        try {
            translateNode(document.body);
        } catch (error) {
            console.warn('Civitai翻译脚本遇到错误:', error);
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedTranslate = debounce(translatePage, 500);

    const observer = new MutationObserver((mutations) => {
        let shouldTranslate = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        shouldTranslate = true;
                    }
                });
            } else if (mutation.type === 'characterData') {
                shouldTranslate = true;
            }
        });

        if (shouldTranslate) {
            debouncedTranslate();
        }
    });

    function initializeTranslation() {
        translatePage();

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: false
        });

        let currentUrl = window.location.href;
        const checkForUrlChange = () => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                setTimeout(() => {
                    translatePage();
                }, 1000);
            }
        };

        window.addEventListener('popstate', checkForUrlChange);
        
        setInterval(checkForUrlChange, 2000);

        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            return originalFetch.apply(this, args).then((response) => {
                setTimeout(debouncedTranslate, 1000);
                return response;
            });
        };

        console.log('Civitai中文翻译脚本已启动');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTranslation);
    } else {
        initializeTranslation();
    }

    const style = document.createElement('style');
    style.textContent = `
        /* 防止翻译过程中的闪烁 */
        .translating {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });

    if (window.location.href.includes('debug=true')) {
        window.civitaiTranslate = {
            translatePage,
            translateText,
            clearCache: () => translationCache.clear(),
            cacheSize: () => translationCache.size
        };
        console.log('调试模式：可使用 window.civitaiTranslate 对象进行手动控制');
    }
})();