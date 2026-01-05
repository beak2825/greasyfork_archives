// ==UserScript==
// @name         MiWiFi in English
// @namespace    http://saiful.im/
// @version      0.8
// @description  MiWiFi Chinese To English Translation With JS
// @author       Saiful Islam
// @match        http://miwifi.com/*
// @match        http://192.168.31.1/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9912/MiWiFi%20in%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/9912/MiWiFi%20in%20English.meta.js
// ==/UserScript==
function transl(){
console.log("Translating...");
var str = document.documentElement.innerHTML;
var str = replaceAll("关机中，请等待路由器指示灯熄灭后再断开电源", "Wait till router lights go off before disconnecting the power.", str);
var str = replaceAll("正在升级中", "We are Upgrading", str);
var str = replaceAll("优先级模式下路由器会动态调整带宽分配，保证优先级较高的设备网络体验流畅", "Under Priority mode router dynamically adjusts bandwidth allocation to ensure that higher priority device experience smooth internet experience.", str);
var str = replaceAll("正在测速，请等待。", "Please Wait , Testing Network", str);
var str = replaceAll("请手工选择需要的工作模式", "Manually select the desired operating mode", str);
var str = replaceAll("普通路由器工作模式\（创建一个无线网络", "Ordinary router mode", str);
var str = replaceAll("有线中继工作模式\（扩展现有的网络", "Wired relay operating modes", str);
var str = replaceAll("您所访问的站点内部发生错误", "The site you trying to access has internal error!", str);
var str = replaceAll("你访问的页面地址出错了\(404\)", "Ops, Page Not Found!", str);
var str = replaceAll("你访问的页面", "Your Accessed Page ", str);
var str = replaceAll("出错了", " Does't Exist! ", str);
var str = replaceAll("网络正常，", "Internet Working Properly , ", str);
var str = replaceAll("对不起，小米路由器出现网络连接问题无法打开网页", "Sorry , Limited Internet Connectivity.", str);
var str = replaceAll("小米路由器技术支持", "MiWiFi router support", str);
var str = replaceAll("立即进行网络诊断", "Test Network Now", str);
var str = replaceAll("路由器正常工作情况下建议使用系统升级检测进行升级，在当系统无法升级或需要降级到前一版本时使用手动上传rom包进行升级。", "Under normal operating conditions it is recommended to use a router upgrade detection system upgrade, use the manual upload rom package upgrade when the system can not be upgraded or need to downgrade to the previous version.", str);
var str = replaceAll("请选择固件:", "Please select the firmware:", str);
var str = replaceAll("开始升级", "Begin upgrading", str);

var str = replaceAll("路由器重启需要等待十几秒或更多时间，重启过程中将会断开网络连接，稍后将自动重新连接网络。", "Reboot the router to wait ten seconds or more time, the restart process will be disconnected from the network, the network will automatically reconnect later.", str);
var str = replaceAll("关闭路由器将断开其他设备的数据访问和网络连接，之后便可以安全的断开电源。\（再次启动需要手工连接电源\）", "Turn off the router will disconnect other equipment data access and network connection, after they can safely disconnect the power. (Start again need to manually connect the power supply)", str);
var str = replaceAll("关闭路由器", "Shutdown Router", str);
var str = replaceAll("体检过程大约需要几秒至几分钟不等\(视硬盘情况而定\)", " The examination process takes about a few seconds to several minutes (depending on the hard disk case may be)", str);
var str = replaceAll("体检过程中涉及到硬盘的功能将暂时无法使用\(插件、文件读写等\)", " The examination process functions related to the hard disk will be temporarily unavailable (plug-ins, document literacy, etc.)", str);
var str = replaceAll("恢复出厂设置", "Restore factory settings", str);
var str = replaceAll("经过检测，建议使用", "After testing, it is recommended ", str);
var str = replaceAll("方式\(系统自动分配IP地址\)", "Mode (the system automatically assign IP addresses)", str);
var str = replaceAll("清除硬盘中的全部用户数据，例如视频或图片", "Remove the hard drive of all user data, such as video or picture", str);
var str = replaceAll("建议正在使用SSH连接路由器的用户不要开启此功能", "We recommend using SSH to connect users to the router to open this feature", str);
var str = replaceAll("开启此功能后小米路由器将在硬盘非工作状态下使其进入休眠状态，以延长硬盘使用寿命。", "Open this feature MiWiFi router will make it hard to sleep at a non-working state to extend drive life.", str);
var str = replaceAll("格式化硬盘", "Format hard disk", str);
var str = replaceAll("你的浏览器禁止了Javascript功能，会造成无法使用系统进行路由器管理，请开启。", "Your browser disabled Javascript function will cause the system can not be used for router management.", str);


var str = replaceAll("指示灯重新变蓝", "Indicator turns blue again", str);
var str = replaceAll("可以通过", "go to ", str);
var str = replaceAll("路由状态", "Routing status", str);
var str = replaceAll("存储状态", "Storage status", str);
var str = replaceAll("常用设置", "Common Settings", str);
var str = replaceAll("高级设置", "Advanced Settings", str);
var str = replaceAll("终端设备", "Terminal Equipment", str);
var str = replaceAll("路由器信息", "Router Information", str);
var str = replaceAll("路由器型号", "Router models", str);
var str = replaceAll("小米路由器", "MiWiFi router ", str);
var str = replaceAll("系统ROM版本", "System ROM version", str);
var str = replaceAll("开发版", "Developer Edition", str);
var str = replaceAll("当前CPU负载", "Current CPU load", str);
var str = replaceAll("当前CPU状态", "The current CPU status", str);
var str = replaceAll("当前网络状态", "Current network status", str);
var str = replaceAll("下载速度", "Download speed", str);
var str = replaceAll("上传速度", "Upload speed", str);
var str = replaceAll("终端流量统计", "Terminal Traffic Statistics", str);
var str = replaceAll("当前终端", "Current client", str);
var str = replaceAll("平均网速", "Average speed", str);
var str = replaceAll("最快下载", "Fastest speed", str);
var str = replaceAll("总下载量", "Total downloads", str);
var str = replaceAll("总上传量", "Total uploads", str);
var str = replaceAll("累计终端", "Cumulative terminal", str);
var str = replaceAll("当前内存状态", "Current memory status", str);
var str = replaceAll("当前内存占用", "Current memory usage", str);
var str = replaceAll("核心数", "Number of cores", str);
var str = replaceAll("核心频率", "Core frequency", str);
var str = replaceAll("内存容量", "Memory Capacity", str);
var str = replaceAll("内存类型", "Memory Type", str);
var str = replaceAll("内存频率", "Memory frequency", str);
var str = replaceAll("互联网", "Internet", str);
var str = replaceAll("外网状态", "External network state", str);
var str = replaceAll("外网带宽", " Outside The Network Bandwidth", str);
var str = replaceAll("连接类型", "Connection Type", str);
var str = replaceAll("IP地址", "IP addresses", str);
var str = replaceAll("下载带宽", "Download bandwidth", str);
var str = replaceAll("上传带宽", "Upload Bandwidth", str);
var str = replaceAll("网关地址", "Gateway Address", str);
var str = replaceAll("重新测速", "Re-speed test", str);
var str = replaceAll("手工修改", "Manual changes", str);
var str = replaceAll("网线连网设备", "LAN devices", str);
var str = replaceAll("5G连网设备", "5G networking equipment", str);
var str = replaceAll("MAC地址", " MAC address ", str);
var str = replaceAll("访问外网", "Internet Access", str);
var str = replaceAll("访问硬盘", "Disk Access", str);
var str = replaceAll("修改路由器名称", "Modify router name", str);
var str = replaceAll("系统升级", "System Upgrade", str);
var str = replaceAll("下载客户端", "Download Client", str);
var str = replaceAll("修改路由器名称", "Modify router name", str);
var str = replaceAll("路由器名称", "Router name", str);
var str = replaceAll("路由器位置", "Router Position", str);
var str = replaceAll("位置", "Position", str);
var str = replaceAll("系统版本", "System Version", str);
var str = replaceAll("开发版", "Developer Edition", str);
var str = replaceAll("MAC地址", " MAC address ", str);

var str = replaceAll("官方网站", "Official Website", str);
var str = replaceAll("官方微博", "Official blog", str);
var str = replaceAll("官方微信", "Official micro letter ", str);
var str = replaceAll("用户社区", "User Community", str);
var str = replaceAll("服务热线", "Service Hotline", str);
var str = replaceAll("文件系统", "File System", str);
var str = replaceAll("运行时间", "Run Time", str);
var str = replaceAll("硬盘转速", "Hard disk rotational speed", str);
var str = replaceAll("硬盘接口", "Hard drive interface", str);
var str = replaceAll("硬盘型号", "Hard drive model", str);
var str = replaceAll("本地存储", "Local Storage", str);
var str = replaceAll("您的硬盘已经", "Your hard disk has not tested in ", str);
var str = replaceAll("建议每隔15天执行一次硬盘体检", " days, testing is recommended every 15 days to perform a hard examination", str);
var str = replaceAll("天没有进行过检测，", "", str);
var str = replaceAll("上次体检为", "Last Check: ", str);
var str = replaceAll("立即体检", "Check Now", str);
var str = replaceAll("文件类型存储统计", "File storage statistics", str);
var str = replaceAll("总容量", "Total capacity ", str);
var str = replaceAll("硬盘读写状态", "Hard disk R/W status", str);
var str = replaceAll("硬盘自动休眠", "Hard autosleep", str);
var str = replaceAll("清除硬盘中的全部用户数据，此过程不可恢复，是否确认格式化硬盘？", "Clear all user data in the hard disk, this process can not be restored, confirm whether Format the hard drive?", str);
var str = replaceAll("详细体检报告", "Detailed Report", str);
var str = replaceAll("硬盘体检总得分", "Hard physical examination total score", str);
var str = replaceAll("优", "Excellent", str);
var str = replaceAll("恭喜，您的硬盘很健康！", "Congratulations, your hard disk is healthy!", str);
var str = replaceAll("硬盘体检结论", "Hard physical examination conclusion", str);
var str = replaceAll("1. 您的硬盘目前状态正佳，运转正常，性能优异！", "1. Your hard disk is currently in-form, in normal operation, excellent performance!", str);
var str = replaceAll("开始硬盘体检", "Start hard physical examination", str);

// Comom

var str = replaceAll("设置", " Setup ", str);
var str = replaceAll("上网设置", "Internet settings", str);
var str = replaceAll("安全中心", "Security Center", str);
var str = replaceAll("局域网设置", "LAN Settings", str);
var str = replaceAll("系统状态", "System Status", str);
var str = replaceAll("隐藏网络不被发现", "Hide network", str);
var str = replaceAll("混合加密(WPA/WPA2个人版)", "WPA / WPA2 Personal Edition", str);
var str = replaceAll("强加密(WPA2个人版)", "WPA2 Personal Edition", str);
var str = replaceAll("无加密(允许所有人连接)", "No encryption", str);
var str = replaceAll("无线信道", "Wireless channel", str);
var str = replaceAll("节能", "Energy Saving", str);
var str = replaceAll("信号强度", "Signal Strength", str);
var str = replaceAll("上网方式", "Internet access methods", str);
var str = replaceAll("连接类型", "Connection Type", str);
var str = replaceAll("子网掩码", "Subnet Mask", str);
var str = replaceAll("默认网关", "Default Gateway", str);
var str = replaceAll("WAN口速率", "WAN port speed", str);
var str = replaceAll("自动（推荐）", "Automatic (recommended)", str);
var str = replaceAll("MAC地址克隆", "MAC地址克隆", str);
var str = replaceAll("当前使用的MAC地址是", "Current MAC address : ", str);
var str = replaceAll("MAC地址", " MAC address ", str);
var str = replaceAll("当前管理终端的MAC地址，可以手动更改为其他MAC地址", "MAC address of the current management of the terminal, you can manually change to another MAC address", str);
var str = replaceAll("工作模式切换", "Operating mode switching", str);
var str = replaceAll("在路由器工作模式和中继工作模式之间进行切换", "Between the router and the relay operating mode operating mode switch", str);

//
var str = replaceAll("无线访问控制", "Wireless Access Control", str);
var str = replaceAll("控制模式", "Control Mode", str);
var str = replaceAll("黑名单模式（不允许列表中设备访问）", "Blacklist mode", str);
var str = replaceAll("白名单模式（只允许列表中设备访问）", "Whitelist mode", str);
var str = replaceAll("黑名单设备列表", "Blacklisted Device List", str);
var str = replaceAll("还没有设备添加进来", "No Device Added", str);
var str = replaceAll("从在线列表添加", "Add from the online list", str);
var str = replaceAll("手工添加", "Manually add", str);
var str = replaceAll("保存并生效", "Save and Activate", str);
var str = replaceAll("修改路由器密码", "Modify router password", str);
var str = replaceAll("原密码", "Old Password", str);
var str = replaceAll("新密码", "New Password", str);
var str = replaceAll("确认密码", "Confirm Password", str);

//
var str = replaceAll("DHCP服务", "DHCP Service", str);
var str = replaceAll("开始IP", "Start IP", str);
var str = replaceAll("结束IP", "End IP", str);
var str = replaceAll("租约(分)", "Lease (sub)", str);
var str = replaceAll("局域网IP地址", "LAN IP address", str);
var str = replaceAll("局域网IP", "LAN IP", str);

//
var str = replaceAll("升级检测", "Upgrade detection", str);
var str = replaceAll("系统版本", "System Version", str);
var str = replaceAll("当前版本", "Current version ", str);
var str = replaceAll("你的版本是最新的，无需升级。", "Your firmware version is up to date and no need to upgrade.", str);
var str = replaceAll("手动升级", "Manually Upgrade", str);
var str = replaceAll("上传日志", "Upload log", str);
var str = replaceAll("下载日志", "Download Log", str);
var str = replaceAll("立即恢复", "Restore now", str);

//
var str = replaceAll("QoS智能限速", "QoS smart speed", str);
var str = replaceAll("DHCP静态IP分配", "DHCP static IP", str);
var str = replaceAll("端口转发", "Port Forwarding", str);
var str = replaceAll("外网带宽状态", "External network Bandwidth state", str);
var str = replaceAll("外网带宽", "External network Bandwidth", str);
var str = replaceAll("上传带宽", "Upload Bandwidth", str);
var str = replaceAll("下载带宽", "Download bandwidth", str);
var str = replaceAll("重新测速", "Re-speed", str);
var str = replaceAll("手工修改", "Manually modify", str);
var str = replaceAll("当外网下载带宽超过50Mbps时，建议无需开启QoS功能", "When the External network download bandwidth of more than 50Mbps, without opening the QoS function is recommended", str);
var str = replaceAll("设备限速状态", "Device speed state", str);
var str = replaceAll("当前QoS服务暂未开启", "Current QoS service not open", str);
var str = replaceAll("应用限速状态", "Application limit state", str);
var str = replaceAll("应用名称", "Application Name", str);
var str = replaceAll("当前速度", "当前速度", str);
var str = replaceAll("限速模式", "Speed mode", str);
var str = replaceAll("迅雷", "Thunder", str);
var str = replaceAll("无限制", "Unlimited", str);
var str = replaceAll("编辑", "Edit", str);
//
var str = replaceAll("已绑定的设备列表", "Bound to a list of device", str);
var str = replaceAll("设备名称", "Device Name", str);
var str = replaceAll("没有设置信息", "Information not provided", str);
var str = replaceAll("解绑选中", "Select unbundling", str);

//
var str = replaceAll("服务列表", "Service List", str);
var str = replaceAll("服务提供商及主机名称", "ISP and the host name", str);
var str = replaceAll("最近更新", "Last Updated", str);
var str = replaceAll("状态", "Status", str);
var str = replaceAll("操作", "Operating", str);
var str = replaceAll("还没有服务添加进来", "No Service Added", str);
var str = replaceAll("添加服务", "Add Service", str);

//
var str = replaceAll("端口转发规则列表", "Port forwarding rules list", str);
var str = replaceAll("外部端口", "External ports", str);
var str = replaceAll("内部IP地址", "Internal IP address", str);
var str = replaceAll("内部端口", "Internal Port", str);
var str = replaceAll("范围转发规则列表", "Range Forwarding list of rules", str);
var str = replaceAll("结束端口", "End Port", str);
var str = replaceAll("起始端口", "Start Port", str);
var str = replaceAll("添加规则", "Add Rule", str);
var str = replaceAll("保存并生效", "Save And Apply", str);
var str = replaceAll("开启DMZ功能可以将内网某一个设备的IP映射到外网，方便从外网访问到该设备。", "IP one device within the network can be mapped to the external network open DMZ function, easy access from External network to the device.", str);

//
var str = replaceAll("协议类型", "Protocol Type", str);
var str = replaceAll("服务器地址", "Server Address", str);
var str = replaceAll("用户名", "User name", str);
var str = replaceAll("没有设置信息", "Information not available", str);
var str = replaceAll("添加服务", "Add Service", str);

//
var str = replaceAll("UPnP状态", "UPnP Status", str);
var str = replaceAll("UPnP设备列表", "UPnP Device List", str);
var str = replaceAll("开发者选项", "Developer Options", str);
var str = replaceAll("插件开发环境", "Plug-in Development Environment", str);
var str = replaceAll("小米Router器", "MiWiFi Router", str);
var str = replaceAll("硬盘读写", "Hard disk R/W", str);
var str = replaceAll("强加密(WPA2个人版)", "WEP Encryption", str);
var str = replaceAll("混合加密(WPA/WPA2个人版)", "WPA/WPA2 Encryption", str);
var str = replaceAll("无加密(允许所有人连接)", "No Encryption (Open)", str);
var str = replaceAll("发现新版本,升级包大小为", "Found New version of firmware package. Size: ", str);
var str = replaceAll("请立即升级。", "Please upgrade immediately.", str);
var str = replaceAll("更新日志", "Update Log", str);
var str = replaceAll("开发版", " Developer Edition", str);
var str = replaceAll("立即升级", "Upgrade Now", str);

//SMALL
var str = replaceAll("请输入", "Please Enter ", str);
var str = replaceAll("器管理", "", str);
var str = replaceAll("当前", "Current", str);
var str = replaceAll("路由", "Router ", str);
var str = replaceAll("状态", "Status", str);
var str = replaceAll("负载", "Load", str);
var str = replaceAll("台", " sets", str);
var str = replaceAll("已连接", "Connected", str);
var str = replaceAll("小时", " hour ", str);
var str = replaceAll("分", " minutes ", str);
var str = replaceAll("天", " Day", str);
var str = replaceAll("秒", " seconds", str);
var str = replaceAll("重启", "Reboot ", str);
var str = replaceAll("关机", "Shutdown ", str);
var str = replaceAll("注销", "Logout", str);
var str = replaceAll("保存", "Save", str);
var str = replaceAll("已用", "Used ", str);
var str = replaceAll("剩余", "Empty ", str);
var str = replaceAll("读取", "Read", str);
var str = replaceAll("写入", "Write", str);
var str = replaceAll("图片", "Picture", str);
var str = replaceAll("视频", "Video", str);
var str = replaceAll("音乐", "Music", str);
var str = replaceAll("文档", "File", str);
var str = replaceAll("其他", "Other", str);
var str = replaceAll("确定格式化", "OK Format", str);
var str = replaceAll("取消", "Cancel", str);
var str = replaceAll("体检报告", "Report", str);
var str = replaceAll("确定", "OK", str);
var str = replaceAll("取消", "Cancel", str);
var str = replaceAll("开关", "Switch", str);
var str = replaceAll("开启", "On", str);
var str = replaceAll("关闭", "Off ", str);
var str = replaceAll("名称", " Name ", str);
var str = replaceAll("加密方式", "Encryption", str);
var str = replaceAll("密码", " Password ", str);
var str = replaceAll("与", " & ", str);
var str = replaceAll("自动", "Automatic", str);
var str = replaceAll("穿墙", "Wall", str);
var str = replaceAll("标准", "Standard", str);
var str = replaceAll("保存", "Save", str);
var str = replaceAll("访客", "Visitors ", str);
var str = replaceAll("修改上网方式", "Change", str);
var str = replaceAll("静态IP", "Static IP", str);
var str = replaceAll("速率", "Rate", str);
var str = replaceAll("切换", "Switch", str);
var str = replaceAll("克隆", "Clone", str);
var str = replaceAll("恢复", "Restore", str);
var str = replaceAll("设备名称", "Device Name", str);
var str = replaceAll("操作", "Operating", str);
var str = replaceAll("其他", "Other", str);
var str = replaceAll("名称", "Name", str);
var str = replaceAll("协议", "Rule", str);
var str = replaceAll("客户端IP", "Client IP", str);
var str = replaceAll("内部端口", "Internal Port", str);
var str = replaceAll("外部端口", "External ports", str);
var str = replaceAll("本机", "PC", str);
var str = replaceAll("秒", "Second", str);
var str = replaceAll("系统", "System ", str);
var str = replaceAll("局域网", "LAN ", str);
var str = replaceAll("上网", " Internet access ", str);
var str = replaceAll("修改", "Modify ", str);
var str = replaceAll("租约", "Lease ", str);
var str = replaceAll("成功正在", "Success ", str);
var str = replaceAll("需要", "Need ", str);
var str = replaceAll("使用的", "", str);
var str = replaceAll("是", "", str);
var str = replaceAll("方式", "", str);
var str = replaceAll("管理终端的", "", str);
var str = replaceAll("可以手动更改为", "", str);
var str = replaceAll("配", "", str);
var str = replaceAll("小米路由器", "MiWiFi Router", str);
var str = replaceAll("地址", " Address", str);
var str = replaceAll("技术支持", " Technical Support", str);
var str = replaceAll("使用", "Use ", str);
var str = replaceAll("置", " Set ", str);
var str = replaceAll("应用", "Apply ", str);
var str = replaceAll("账号", "User ID", str);
var str = replaceAll("网关", "Gateway", str);
var str = replaceAll("必填", "Required", str);
var str = replaceAll("下一步", "Next", str);
var str = replaceAll("提示信息", "Message", str);
var str = replaceAll("成功", " Success", str);
var str = replaceAll("确认", "Confirm", str);
var str = replaceAll("切换", "Switching", str);
var str = replaceAll("网络速度", "Network Speed", str);
var str = replaceAll("正在测速...", "Testing...", str);
var str = replaceAll("检测", " Detection", str);
var str = replaceAll("完成", "Complete", str);
var str = replaceAll("手工", "Manual ", str);
var str = replaceAll("上传", "Upload", str);
var str = replaceAll("下载", "Download", str);
var str = replaceAll("先级模式", " Priority mode ", str);
var str = replaceAll("模式", " Mode ", str);
var str = replaceAll("会根据", " According to ", str);
var str = replaceAll("网络", " Network ", str);
var str = replaceAll("会动态调整带宽", " Dynamically bandwidth adjustment ", str);
var str = replaceAll("保证网络体验流畅", " To Ensure smooth Web experience.", str);
var str = replaceAll("设备列表", "Device List", str);
var str = replaceAll("设备信息", "Device Information", str);
var str = replaceAll("网速", " Network Speed", str);
var str = replaceAll("限速", " Speed Limit", str);
var str = replaceAll("速度", " Speed", str);
var str = replaceAll("当外网", "When the external network ", str);
var str = replaceAll("超过", " Exceed ", str);
var str = replaceAll("保证", " Ensure ", str);
var str = replaceAll("先级", " Priority ", str);
var str = replaceAll("中", " During ", str);
var str = replaceAll("先级较高的设备", " higher priority device ", str);
var str = replaceAll("体验流畅", " To experience smooth ", str);
var str = replaceAll("时，建议无需OnQoS功能", ", It is recommended to function without QoS", str);
var str = replaceAll("恭喜", ",Congratulations", str);
var str = replaceAll("连接正常", " connection is normal", str);
var str = replaceAll("诊断", " Diagnosis", str);
var str = replaceAll("未发现错误", " No Errors Found", str);
var str = replaceAll("升级注意", " Upgrade", str);
var str = replaceAll("请勿断开", "Do not disconnect the ", str);
var str = replaceAll("电源", " power supply", str);
var str = replaceAll("升级过程大约", " Update may take about ", str);
var str = replaceAll("升级过程大约", " Update may take about ", str);
var str = replaceAll("钟", "", str);
var str = replaceAll("指示灯重新变蓝，可以通过", " Indicator turns blue again, you can", str);
var str = replaceAll("进入管理", " to enter management", str);
var str = replaceAll("当刷回较低版本时，建议您同时清除掉用户", "When the brush back to an earlier version, it is recommended that you also removed the user", str);
var str = replaceAll("当刷回较低版本时，建议您同时清除掉用户", "When the brush back to an earlier version, it is recommended that you also removed the user", str);
var str = replaceAll("以防止版本兼容性引起的异常故障", " to prevent the abnormal version compatibility caused", str);
var str = replaceAll("清除", "Remove ", str);
var str = replaceAll("所有用户", " Users ", str);
var str = replaceAll("请先阅读", "Please read the ", str);
var str = replaceAll("你连接的路由器还未初始化", "", str);
var str = replaceAll("你连接的路由器还未初始化", "", str);
var str = replaceAll("请稍候，会自动为你跳转到引导页面...", "Wait for you want automatically redirect to the guide page ...", str);
var str = replaceAll("如果未能跳转，请直接访问", "If not redirect, please visit ", str);
var str = replaceAll("如果未能跳转，请直接访问", "If not redirect, please visit ", str);
var str = replaceAll("《用户体验改进计划》", "(User Experience Improvement Program)", str);
var str = replaceAll("《用户体验改进计划》", "(User Experience Improvement Program)", str);
var str = replaceAll("加入", " Added ", str);
var str = replaceAll("同意，继续", "Agreed to continue", str);
var str = replaceAll("与", " Versus ", str);
var str = replaceAll("与", " Versus ", str);
var str = replaceAll("请等待", "Please wait  ", str);
var str = replaceAll("连入以无线", " Connected to wireless ", str);
var str = replaceAll("为你创建了两个无线", " create two wireless ", str);
var str = replaceAll("更稳定", " More Stable ", str);
var str = replaceAll("更稳定", " More Stable ", str);
var str = replaceAll("更快", " Faster ", str);
var str = replaceAll("适合电视、盒子包括距离", " For television, the box includes a distance ", str);
var str = replaceAll("较近的设备", " Nearby equipment ", str);
var str = replaceAll("你的", "Your ", str);
var str = replaceAll("信息", " Information ", str);
var str = replaceAll("请注意", "Please Note", str);
var str = replaceAll("升级将会使所有", "Upgrade will make all ", str);
var str = replaceAll("设备的", " Device ", str);
var str = replaceAll("断，升级过程", " the upgrade process ", str);
var str = replaceAll("或", " Or ", str);
var str = replaceAll("本页面！", " This Page! ", str);
var str = replaceAll("升级失败", "Upgrade fails", str);
var str = replaceAll("正在", " is ", str);
var str = replaceAll("升级包", " Firmware Update ", str);
var str = replaceAll("升级", " Upgrade ", str);
var str = replaceAll("可用", "Available", str);
var str = replaceAll("您还没有进行过硬盘体检，建议立即执行", "You have not been hard physical examination, immediate implementation of the recommendations", str);


//Search
var str = replaceAll("试试搜索", "Search", str);
var str = replaceAll("硬盘体检结果", "Hard Disk physical examination results", str);
var str = replaceAll("良好", "Good", str);
var str = replaceAll("您的硬盘良好，不过存在一些问题", "Good on your hard disk, but there are some problems", str);
var str = replaceAll("家", "Home", str);
var str = replaceAll("百度一下", "Baidu!", str);
var str = replaceAll("客户端", " Client", str);
var str = replaceAll("器", "", str);
var str = replaceAll("下", "", str);
var str = replaceAll("后", "", str);

// var str = replaceAll("", "");
document.open('text/html');document.write(str);document.close();
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

function errorFix()
{
	console.log("Fixing CSS...");
	$(".title img, .icons img").attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUgAAAB8CAYAAAALiCk8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAFe1JREFUeNrsnduTHNV9xz+rCyBjYY8BgWU5JksgvgrDLgYBQkLe5X4RmHWSqlSeUstbXlcp5y1JlfQXpHYf8ppEazBgDBZaCyFkQGiXOzbG7NjGYK7ScEdIaCcPv9+pORrm0t3TPX265/et6uqRti/n1t/z+53f5QzV63UCxz/r+b+BJQYDy4BtWt/tEe/5CTAE/EeX6/4VOAn49xK05zLgv4BPgX8JoDzLgf8BjgD/1OXau/R8W8Rn/xy4RPuYCGd6vLbb/3X6+6+BTV3qs0+v3RjyAFtRgI9gnTbkd4DnBoQgR4FzmgZeN5wf8fozgLXABcBTBW+nDcB64JVAyrMJGAH+EOHai2P27yUF6pco9boiZv2NICM06PNAnXJjCLgmw+fvA/4e+GEJCPIWPf8ikPL8nZ5/muE7zsTQVxWlKDgb+JsB6JPvAF/P8PkPA8eBC4FKgdvpDOAyrUsIBLkGuErLc6dRixFkXlJk2XFtxs9/VyXH5XRfJwoZ12sdfg0cCqA8t2l59gBvG7UYQfYbR5B1ua+XuD/OBc4DPs74PXv0vIUCrAO1WYa4WX/fE0h5nHr9v0YrRpB54Ak9byxxf7i1x70Zv+cZlbrOUpW+aBhFDE1vAo8HUJ7LdOJ+HVnjNRhB9h0HgGOItXZNCftiLWKRPQb8KuN3LQEP6e8fFrCtbtLzfYThqvRjPc8yOK5oRpCB4UNk7Sx436kepEfnQ/ZBgvtfAn4f4/q9iEfAD4DVBWqnLyFrp0tKkHmjAlyt5YljvT6ox6Biv471oLGiYI36qKpX3wPmgPdKMli+gvjFLQG7Ez7jP2Ne/46q2t8HriQcV5luuBZYqar1GwGUZ6uWZx/wWoz7bmOwcaVJkOmjhvhCLgMuL9FgGdc6HVTi6hf2FFDNdsaZewMpj1Ov/88UUlOxQxHN60jEwhdK0AdfRNyX6sCuPr97XqXwdcDfFqCt1iOeDId1HOSNUcQ39x2yXzc2GEFGwpvIWttKJNSs6NiidXk+poqWBo7TsJiPFaCtnHHmfuCzAMozoec7AymPwQgSgEf0fAmSeKGoOBnYrL935VSGh1R6vTRwifyLSKRKnTCMM6uB67Q8P8VgBBkQ/qTHKYhxo6jYCKwCXtYjD7wO/FbJOuRIpXHt76cJIznFTdp3B4mWnMJgBJmLFHk5EuJVNKygYRzZlXNZ3PpZyMYap16HYpxx6rVFzhhBBonfI+uRqxFXlaLhEsSn7zVk/TFPPI74mQ7rERq+iQQIvE/2UUZR8F0kAuk94EGjESPIEFH3pMiNFCumeEhVRvQDyzuF2zGvLUM01tzgSdpHAyjP7Xq+B0nWazCCDBLPI76Rp1OsmOILkXDJQ4irTRr4CfBvKajZG5H1yFBwijeZhGCcWeWp+zt7eM5dNLKKDyL2eZOyEWRGWKLhD1ek8MOr9byb9GJ3z9cjKV7RZYtVSPKFULAFOBX4DbAYQHmuRyzqzwC/6+E5FyNhnoOKKyhA+sJlJWjop4CPkGQP5xagvN9EMr+8DzwWWNnm9BySseYGT50NAU69tsgZU7ELgWMe0RQhvtNJj3u17CHhUeATj8Tzxl8jcfdLSCb0vHEecJFOyPcbfRhBFgUHkMXyYSRsLlR8AwnpOxLIB9+MI96SRQjGmhu9cbo+IOnxPrJPamwwgkz1w36iAFKkkx4fUUktRDhjzSYkBDIvrOTEzcu25twuJ9HYJGzWqMMIsmh4DImH/RZh7vx2Fo2EuA8F3I4vI1FKq5Hww7xwJXAa4id6TMuSZ6LkceDLiGHmOaMOI8ii4QMkDC3UhLrjWrYDhJ/H0uWkzNNY44wzO5HEqss8lTtP9doiZ4wgC4tHkAX9C5AolVBQoZEQd64g7XgUMZCcncP7v4YYQz5VsnYW7BtzGrN/pRLsEcLwxTQYQSbCYeAFJDY7pIS6V2mZnqYYW4J+pEsWQ+RjrLlB370XCYFcUFV7DfmkuLtdy7MLcc8yGEEWFvuQ0L1RwkjfdSrieF2nWHG7Ts3eQn+TgSynsTf4z/Vc937f0ud2WA7cqr/NOGMEWXi8jhgaTiJfI4PDlUjo3m+BVwvUji+q1PZlnWz6hQ3IHj2vcKIx5H7yMdZsBs5AUpotGGUYQZZFinQfW54JdU+m4Xa0u2BtWPfKPN7H9zpDzH2cmMTDbbOwnEYsdL/UaxBjUT2Afnlbj3f0OKTHYT1q3vGuHu/p8b4eH+jxoXd8pMfH3vGJHke841MaexkZQRYUfwD+rCr2aI7l2IDE7f6ReFuyhoK9iOvURSpFZY01SHzyMVrnyLzXI9F+jN2zEY+IY4QT6hgChgaloitKXLd9wD8iAfEHkP1X+onliHGmiNKjw/uIA/7liMtP1vHH1ynx7VPJpxkLwF8QK/elSGhklviRlme3Smch4EwMJkGmgBeBtxB3nwtyeP8o4t7zBsV2LPYTWGQpOQwpQUL7PbqXPClyax++DWecsT1njCBLhzqNtcgr+6wW+O4xuwlj7SopntGJ5kwkj2VWuBiJNnqDzsaQX6jav4FsjTWXIRmiXiO8rEsGI8hU8KyqamuAb/fxvd/Tj71G8S2f/TLW3OARYKccmb6xJsvImts96XHJqMIIsow4TiM7zaY+vtdJj3vo/9pnFnhI6/EDxO0nbVRUYjsOPBDh+rv1fHNGY/h0ZP34uPcugxFkKTGPuC+soz8bUp2HpDX7qESq2SEkMfFysonPvhYxGD6BuK5E6dO/qJSeRWTNVi3PI8jGcAYjyNLCT6jbDynSSY8PE8YGU2lht1e/NNdzfeNM1Dhn31hzc8r1HAJu098WOWMEORB4TMnqPGThPSusQ7Jxf0rDQFQWLCDrf2tJd4O09dpuhxB3rKhwxprLSdf1ZQQ4BzFM7TOKMIIcBHxCI6Hu5j5Ij49SvozTx2kk0706xec648wDxFuvPaQq8PKUpUhnnPkZ5Vg/NhhBRsJ+HfDfJZuokDMQf8vjhJ0QtxfMIVbtDUhC3V6xGolUqZNsjxcX3XJTSmP5S4ilfonB3pLVMIAE+T5iaBgim20ZnCP1QcJPiJsUbyKuUyelJImP67OeRJKMxMVBxFhzNukkJrkRiZ8/QLESixiMIFOBS4V2UUoSkMNpiAtM3VNDy4oHU1Szr9dz0h0Clzwp8tYUyvMjPd9p1GAYRIJ8h0ZC3TS3Zdisz3wWWdwvMx5Xadzt0JgU30K2dX0PWUtMivt1WeNyels6WY8Y8WoUI+u7wQgyE7jtVi8BVqXwvFU0spcPwof1GY10V9f08JzrPIn0sx4nvTSMNc615x7C26/cYATZN7xKI6FuGk7GVyDrVi8hKdYGAc4ncmPCSeYLNDId3Z9Cee7W8y0Jx/SpHmGbem0YaIIEyXOISn697P28kobBZ5DUsleB3wCnkMz5/iol1ueRzOG94gnEyHN2wknvOiXtJ5FcogbDQBPkon7kpyJZZJLiUiQh7p9Vghwk9GKs6ZbWLC6WmqTIpOq1ufYYjCAVD3tq4rKEbXfVAEqPDvuRePPzkMiTqBhGjDsfen2QBu5DjDUbiRdZcz7iG/sBrbOYG4wgBxIvIHt7VIDvJ7j/Ir33LcR6PWg46hHcdTHuc649e5CQzLTgG2vi7FlzmyfNHjFKMBhBCureB76ZeAkYhjzpcQ/FTojbC3Z57Rdlc7STaWQD+kUG5XE+kVsjju2TaeSUNOOMwQiyCU8hfnhnIUkmouLbwFf13vkBbr8qshnZqYg1vxs2Imu2LyHrwGnjccRY81WiRdaMIwEDLyBbdBgMRpAe/IS6V8W4z0lBe7GEBs7lJ4pPpFOvH8ioLL6xJkpkjYuc+ZlRgcEIsjUOIJl3voFEdnTDMGKU+Bjbq8RNEkdUql7X4bp1SJq0T8h2X2XfWNMpsuYcZI+dj0nHF9NgBFlKHKWxfWgUKXKLnveTrpGhqPgEMY4MdZEir9VrHibbVHBvEy2y5lYtz4OIRd1gMIJsg0eVKM9H1q/aYS2yVnmU3uKHy4Zd3tJDq73WV9Dwl3ygD+VxavbWNmN8pUee5vtoMILsgo+QaIyhLlLkFr3mgN5jELwI/AnJp9gqkuUy/dsfkQicrPEYYqxZi8TcN2Mz4qL1MrKtrcFgBNkFjyBrV+uRXe2acTqNhLh7rbk+BxdZc00b9Rrgl30qS7c0aM730YwzBiPIiHgXeFrbpFV88Sb925NISizDidijSw8XIm5TDmchTvXH6G/E0b06mW3iRGONkyqPEn2TMIMRpAExINSRjZtO8/5/NRKzXae82yn0ig+QtdxmY801+n/7kTyS/cLb+s7myJqtOu5/pZOiwWAEGRFvImtkKznR8Xmj/t8L2D7JneCMNeNKTMs9snwgh/Lc5anZy7Q8tzT9zWBoixXWBJ/DQ4i/3qWetLjBUyMN7fEcskfMWmBU/+90/b884tWdseZrqlavANYg2ZfmrbsMJkHGxytIGNwqJclL9fciYqk1tEedhrHmWhpJLH5JPvHqS8haJIhhxjfO1K27DEaQyaVIp1pfYdJjLLgtFC7W47hHmnngHhrGmiv0973WTQYjyOR4CXgNMc6cpr9/Z80SCe8ifqJuDfJx8rX6v4W4cK3Q8uxFUqMZDEaQKUiRzb8N0aRIPPU6b/j+jndb9xiioghGmleIl6sxLTxLYxOuPAwML8es90sBTXjzyH4z7nfeeBRJbVenEXefNw7G7N8DOX0HWWF/EQS0oXrd1qoNBoPBVGyDwWAwgjQYDAYjSIPBYDCCNBgMBiNIg8FgMII0GAwGI0iDwWAwgjQYDAYjSIPBYDCCNBgMBiNIg8FgMBhBGgwGQ/kIchjJxlJHsntXUnruIpZduhumtY2mCzA2khw7S9ZfU1qvyT7353Z97pgRZP4fxJTxVl/buwiYRVKCxT1+XNL+qvW5PytlG/hF3LRr1iPIWWAhhWdWjQM7Yrwg5bT9yqO1x7j1Q3klyJrO+DVVjSr2HRgMNlENOkFWmiS+HSmp2hWTPGwJoKQwzWgACdJ1+g5VsaeACSNIgxGC9YOp2CfiDiW36R5VbSNIQxkl6lpO7zUJMhDUlCQrJHNZqMQcSGP6Huca5B/z+rdOg2SnXptE4h3x3pXk/l7e7dxCWtVtETgco50W9W9FcAXJo25T+ox5WrskHda/T+uYSDLxd+pPR3TT+q52ZYj6zpEO9XF1CdYjpYgqdnMHzKq6PZGgoaNKnWPawbv1nhk+7yoyp4Nh0buOFmUl4Qc00TTo4s7sE6r6zGY0Ubn3uHZyEn5zO81q+XfrtaEb2fpRt4pHWpPeWGnlkjSj10/qOyZT1oomdQwPA9valOErEdqr4rVDu/rs0Ou263UjwfV+vV4vyjFZF0y2+FulXq8v1uv1w/V6fTjGM4f1mdMR3jsf8dljWo7FNtcf1iNu/Q9rOecT3D/Voe2iHLv1/lZ/q3t1PazXVmL053zGY6OXox9188fLZII+nWjTX4sJ+tN9D9t7GCeuvRa1/lHaayTh95v5UZZQQ+f6UyFeVESly6LyhM7sc8BoxMXnOcTPbLiN2u8kgDiq7oQnuc7p7ziz7ZS20UyGi/I7vbpHkV5mVEIZoTcjW9bIsm5jKmVVdXzNJBz7aa0FOml0R4/tNY34J49GbK8Fb6ksKHW7iARZ7dDIblBGbeRuKtB2j3zjwJVlrIUKNNtCZY5CkAt6zMVU0ye1njt6bPdalw+9ooM8DmYSLhn0E1nVbViJdyEG8bYiwWqK/VlJqb1GErTXnLZFUJNlUf0g22GHNvL2FD66SR2EOxKu57QjwgVvIFQi1nvCe96clicqQU6kJD3WIrR9LcEzqyn0VVxjW1xkUbdpj3izKHc1QX9WE0zerUh7JmGdFkJbky5jNh8n7fUaZTPWRHRJBuiCJ4G0Is/JGGrPTNNsOxahfmN6zPT4EQ5HmLRmA+h7Z6mPc4zkUDe/X3oNlU0iCQ53kHprKQgYs2UhkzKp2P7ftxEtyqaTv5iz+vbi9LrQRs2aiTFTO+mx1uK5YxHuhXTWHqsdPsQFwvAlHSd+ooqFLgSZRd0mUiCSSo+qcrUN2bq1/N0kd1daoCQoaz7IXqNsRlLq6GqbGbtGwyVkuEs5Rlp8SHNtiLeZ/CeVHLOObMg7cqJSsLq5ZY+5AOvsjFGOJKdilmmhTERStHyQcbCN5FE2Wa9p+dLDRIQPabbFDL3QRUVPU3qsdJFUeiWRWgrlS5vMsqrbsD57LoXyVTt8J9UE/emTpPPa2E7D9zPpOOm1TkaQGczoVbpH2bT7CIZT/uBqbQiy1oXkJjsQXCd3H+cuMZfSjN6NIHtd3wwx1DOruqUVBjicQX82T8KjNNbR++HUH1zQQNm3XJhVgokbZVNNYRBGIdoZvWasjQRYof06Vad1SHfvjj61c94El6XEHyp590PaqtHwzxxRkuxmsCtVwpCyufm0U7WrSpDDMT+KXme0kS6DppOa7fs+tpMg2907xYk+k1m1e1oTSFoqdppkFkrdOo2rJOVOMqbvoGH43Jmh9DdsKnb/1yc6Rdm0G8TOcjnWY3lHaPgttpMCW/lENvs+tquXM/T4945pvWZSbPdukkGvJBByNqW061aLQHLdMBahbNWUJb0dxA/EMAmyABKkI6IdHTq31kZCq/RAkpNNUmKnZYDm0MNWvo9R1ewpHfwzfeyTWg592jzR1QpSNzf5jiSsf8UbH7UM27QdSVbbaC1prdkaQeb0MW0jXpTNjEc4Scoalaha+URO8nnfx05q9pgnlYylTI6VgPs0ZCm0EqHPJxM8d6pLfSsZt3m1zTPSWuYwFTvHj8DFh7oom+Eu5DOjhBOXJN3z74hYp1lPNXbnKE7EThqZ8D64tJNS9IMgawGXMYu6uYiVOOvibhKdopEmLI+2ymqdMMhku0Xzg+z1Q3JJJJoz7dQ6EOqcSp3TEQffvJLcHUQ3kvihh5O09n3sRORORZ8keex4L4M6bxU7C4tulnWrcmLEShSNZkon3hk6eydkadF3hD5TkElq4CTItNZRnGEkymL3uN7jEom2yho+SSMDc0XviSPF+T6REzHvdeuQ001k20+iyJMgs/4ws6qbi1hBJ9WdLVRu58M7r5P0tiatpJpif7rs3ttb3DOm5XNlmM1IMjUVOxDxO276sm1IFuU5LUtzuv1p77pzSeZeM+sNsjj3z3kDdKbPA6ySMwn5ZRgjfqKKOu2jRPpRtzkdL37UV/OWBM4Xdohofq1Jyz3q3d/cRju1fOeSnW9tkBLoUL1ex2AwFApukt5G/4IBBhLLrAkMBoPBCNJgKJMEaTCCNBgMHQiyak1hBGkwGFoT5Jw1RbYwI43BUCxUEAON2+zLYBKkwWBQTNHfVHYDjRXWBAZDYbATCSTYZuq1SZAGQ9klQRe9Mk37eH8XpeV2YLzDpMf+wdYgDYb8MMaJiUZaYcE7ZqzJjCANBoPBVGyDwWAwgjQYDAYjSIPBYDCCNBgMhoEgyH/w/m2/7bf9tt/2W3///wCwJU15rt+b0AAAAABJRU5ErkJggg==');
	$(".recomsites").hide();
	$(".hotwords").hide();
	$("#nav li a ").css( "font-size", 16);
	$(".dropmenu").css( "width", 160);
	$("#trafficChart > svg:nth-child(2)").remove();
	$("#cpuChart > svg:nth-child(2)").remove();
	$("#cpuChart > svg:nth-child(2)").remove();
	$("#memChart > svg:nth-child(2)").remove();
	$("#piechart > svg:nth-child(2)").remove();
	$("#piechartcat > svg:nth-child(2)").remove();
	$("#ioStatus > svg:nth-child(2)").remove();
	$('input:text').css('height', 40, 'important');
	$('input:text').css('width', 330, 'important');
	$('input:password').css('height', 40, 'important');
	$('.form-item .ipt-text').css('width', 330, 'important');
	$('.form-item-select .k').css('width', 300, 'important');
	$('.form-item .k').css('width', 300, 'important');
	clearInterval(document.intR);
}

function fixModal(){
	console.log("Fixing Modal..."); 
	var height = (window.innerHeight - $(".panel").height())/2;
	console.log(height); 
	$(".panel").css( "top", height);
	$(".panel").css( "left", '25% !important');
	$("body").animate({ scrollTop: 0 }, "slow");
}

$(document).bind('DOMNodeInserted', function(e) {
	if($('.panel').length==1 )
	{
		var delay = ( function() {
		    var timer = 0;
		    return function(callback, ms) {
		        clearTimeout (timer);
		        timer = setTimeout(callback, ms);
		    };
		})();
		delay(function(){
		   fixModal();
		}, 100 );
	}

	if($('input:text').width() != 330 )
	{ 
		var delay = ( function() {
		    var timer = 0;
		    return function(callback, ms) {
		        clearTimeout (timer);
		        timer = setTimeout(callback, ms);
		    };
		})();
		delay(function(){
		   errorFix();
		}, 50 );
	}
});


$( document ).ready(function() {
	$("#logo").css('bottom',-16);
	$("#doc").css('position','relative');
	$("#doc").css('min-height','97%');
	$("#ft").css('padding-bottom','5px');
	// $("#doc").css('position','relative');
	$(".panel-mask, .panel-loading").hide();
	transl();
	$( "<div align=\"center\" style=\"color: #8cb9f0; text-decoration: none; width:100%; position:absolute bottom: 10px; padding-bottom:15px;\"><p>Translated By: <a style=\"text-decoration: none; color: #8cb9f0;\" href=\"http://saiful.im/\">Saiful Islam</a> | <a style=\"text-decoration: none; color: #8cb9f0;\" href=\"https://github.com/saaiful/MiWiFi-English\">Source</a></p></div>" ).insertAfter( "#doc" );
});

delay(function(){
	errorFix();
}, 1000 );
