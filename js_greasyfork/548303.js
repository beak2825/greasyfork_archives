// ==UserScript==
// @name         2025年全国网课助手【学习通 U校园ai 知到 英华系列 清华社】【学起 青书 柠檬 睿学 慕享 慕华 良师 联大】【国开 广开【运动世界校园】等平台通用视频加速服务  微信客服:wkds857
// @namespace    2025年全国网课助手
// @version      1.0.0
// @description  辅助各大网课平台学习，包括视频/音频、繁体字识别、复习、PPT、阅读、章节测试、作业、考试等功能。
// @author       用户昵称 // 替换成你的昵称
// @match        ://.xuexitong.com/*  // 学习通 (示例，需要根据各平台规则添加)
// @match        ://.zhihuishu.com/*  // 智慧树 (示例，需要根据各平台规则添加)
// @match        ://.uyuan.com/*     // U 校园 (示例，需要根据各平台规则添加)
// @match        ://.tsinghua.com/*    // 清华社  (示例，需要根据各平台规则添加)
// @match        ://.zhihui6.com/*     // 智慧教  (示例，需要根据各平台规则添加)
// @match        ://.sportingworld.com/* // 运动世界校园 (示例，需要根据各平台规则添加)
// @match        ://.lunwen.com/*      // 论文辅助AI (示例，需要根据各平台规则添加)
// @match        ://.xxqg.com/*       // 学习强国 (示例，需要根据各平台规则添加)
// @match        ://.fif.com/*       // fif (示例，需要根据各平台规则添加)
// @match        ://.chicun.com/*   // 池馆 (示例，需要根据各平台规则添加)
// @match        ://.yuketang.com/*   // 雨课堂 (示例，需要根据各平台规则添加)
// @match        ://.xtonline.com/*   // 学堂在线 (示例，需要根据各平台规则添加)
// @match        ://.youyuan.com/*   // 优学院 (示例，需要根据各平台规则添加)
// @match        ://.shehuigongyi.com/*   // 社会公益 (示例，需要根据各平台规则添加)
// @match        ://.utalk.com/*   // Utalk (示例，需要根据各平台规则添加)
// @match        ://.welear.com/*   // welear (示例，需要根据各平台规则添加)
// @match        ://.anqquan.com/*   // 安全微伴 (示例，需要根据各平台规则添加)
// @match        ://.cqedu.cn/*   // 重庆高校 (示例，需要根据各平台规则添加)
// @match        ://.ehuixue.com/*   // e会学 (示例，需要根据各平台规则添加)
// @match        ://.cnu.edu.cn/*   // 川农在线 (示例，需要根据各平台规则添加)
// @match        ://.alphaprogramming.com/*   // 阿尔法编程 (示例，需要根据各平台规则添加)
// @match        ://.xiaoya.com/*   // 小雅 (示例，需要根据各平台规则添加)
// @match        ://.icourse163.org/*   // 中国大学mooc (示例，需要根据各平台规则添加)
// @match        ://.ixue.com/*   // i学 (示例，需要根据各平台规则添加)
// @match        ://.speexx.com/*   // speexx (示例，需要根据各平台规则添加)
// @match        ://.muma.com/*   // 木玛 (示例，需要根据各平台规则添加)
// @match        ://.renweimuke.com/*   // 人卫慕课 (示例，需要根据各平台规则添加)
// @match        ://.gaoxiaobang.com/*   // 高校邦 (示例，需要根据各平台规则添加)
// @match        ://.zhijiao.com/*   // 智慧职教 (示例，需要根据各平台规则添加)
// @match        ://.pfw.com/*   // 普法网 (示例，需要根据各平台规则添加)
// @match        ://.bhu.edu.cn/*   // 北华大学 (示例，需要根据各平台规则添加)
// @match        ://.zaizhe.com/*   // 在浙学 (示例，需要根据各平台规则添加)
// @match        ://.xuexigongshe.com/*   // 学习公社 (示例，需要根据各平台规则添加)
// @match        ://.xuexizg.com/*   // 国家开放大学 (示例，需要根据各平台规则添加)
// @match        ://.gkshiyan.com/*   // 国开实验学院 (示例，需要根据各平台规则添加)
// @match        ://.xueqi.com/*   // 学起 (示例，需要根据各平台规则添加)
// @match        ://.qingshuedu.com/*   // 青书学堂 (示例，需要根据各平台规则添加)
// @match        ://.gkong.com/*   // 广开 (示例，需要根据各平台规则添加)
// @match        ://.yunshanghekai.com/*   // 云上河开 (示例，需要根据各平台规则添加)
// @match        ://.xunwang.com/*   // 讯网 (示例，需要根据各平台规则添加)
// @match        ://.dianzhongzaixian.com/*   // 电中在线 (示例，需要根据各平台规则添加)
// @match        ://.gxu.edu.cn/*   // 广西开放大学 (示例，需要根据各平台规则添加)
// @match        ://.dreams.com/*   // 梦想在线 (示例，需要根据各平台规则添加)
// @match        ://.huaxinxuetang.com/*   // 华莘学堂 (示例，需要根据各平台规则添加)
// @match        ://.yunbanke.com/*   // 云班课 (示例，需要根据各平台规则添加)
// @match        ://.dfcf.com/*   // 东财会计系列 (示例，需要根据各平台规则添加)
// @match        ://.zhaom.com/*   // 朝明在线 (示例，需要根据各平台规则添加)
// @match        ://.mymoon.com/*   // 麦能网 (示例，需要根据各平台规则添加)
// @match        ://.rongxue.com/*   // 融学 (示例，需要根据各平台规则添加)
// @match        ://.168net.com/*   // 168网校 (示例，需要根据各平台规则添加)
// @match        ://.lianda.com/*   // 联大 (示例，需要根据各平台规则添加)
// @match        ://.nimeng.com/*   // 柠檬文才 (示例，需要根据各平台规则添加)
// @match        ://.youkexuetang.com/*   // 优课学堂 (示例，需要根据各平台规则添加)
// @match        ://.ahjxjy.com/*   // 安徽继续教育 (示例，需要根据各平台规则添加)
// @match        ://.shanghai.edu.cn/*   // 上海开放大学 (示例，需要根据各平台规则添加)
// @match        ://.siniao.com/*   // 思钮教育 (示例，需要根据各平台规则添加)
// @match        ://.chunfengyu.com/*   // 春风雨 (示例，需要根据各平台规则添加)
// @match        ://.longzhi.com/*   // 龙知网 (示例，需要根据各平台规则添加)
// @match        ://.yiluxue.com/*   // 一路学 (示例，需要根据各平台规则添加)
// @match        ://.muhua.com/*   // 慕华 (示例，需要根据各平台规则添加)
// @match        ://.xinjingren.com/*   // 新京人 (示例，需要根据各平台规则添加)
// @match        ://.dianmodyun.com/*   // 点墨云 (示例，需要根据各平台规则添加)
// @match        ://.huakt.com/*   // 画课堂 (示例，需要根据各平台规则添加)
// @match        ://.kcb.com/*   // 课程伴侣 (示例，需要根据各平台规则添加)
// @match        ://.chutout.com/*   // 出头科技 (示例，需要根据各平台规则添加)
// @match        ://.liangshionline.com/*   // 良师在线 (示例，需要根据各平台规则添加)
// @match        ://.zaizhe.com/*   // 在浙学 (示例，需要根据各平台规则添加)
// @match        ://.mianhuatang.com/*   // 棉花糖 (示例，需要根据各平台规则添加)
// @match        ://.zhaom.com/*   // 朝明在线 (示例，需要根据各平台规则添加)
// @match        ://.gspedu.com/*   // 国培网 (示例，需要根据各平台规则添加)
// @match        ://.henanjsj.com/*   // 河南宗教 (示例，需要根据各平台规则添加)
// @match        ://.ruixue.com/*   // 睿学 (示例，需要根据各平台规则添加)
// @match        ://.lanzhou.com/*   // 兰州继教 (示例，需要根据各平台规则添加)
// @match        ://.wending.com/*   // 文鼎 (示例，需要根据各平台规则添加)
// @match        ://.168online.com/*   // 168网校 (示例，需要根据各平台规则添加)
// @match        ://.woxuexi.com/*   // 我学习 (示例，需要根据各平台规则添加)
// @match        ://.hexue.com/*   // 和学在线 (示例，需要根据各平台规则添加)
// @match        ://.muxiang.com/*   // 慕享 (示例，需要根据各平台规则添加)
// @match        ://.hanhongmuke.com/*   // 含弘慕课 (示例，需要根据各平台规则添加)
// @match        ://.yiboshi.com/*   // 医博士 (示例，需要根据各平台规则添加)
// @match        ://.weizhik.com/*   // 微知库 (示例，需要根据各平台规则添加)
// @match        ://.aopeng.com/*   // 奥鹏 (示例，需要根据各平台规则添加)
// @match        ://.sps.com.cn/*   // 国家智慧中小学 (示例，需要根据各平台规则添加)
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/548303/2025%E5%B9%B4%E5%85%A8%E5%9B%BD%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%20U%E6%A0%A1%E5%9B%ADai%20%E7%9F%A5%E5%88%B0%20%E8%8B%B1%E5%8D%8E%E7%B3%BB%E5%88%97%20%E6%B8%85%E5%8D%8E%E7%A4%BE%E3%80%91%E3%80%90%E5%AD%A6%E8%B5%B7%20%E9%9D%92%E4%B9%A6%20%E6%9F%A0%E6%AA%AC%20%E7%9D%BF%E5%AD%A6%20%E6%85%95%E4%BA%AB%20%E6%85%95%E5%8D%8E%20%E8%89%AF%E5%B8%88%20%E8%81%94%E5%A4%A7%E3%80%91%E3%80%90%E5%9B%BD%E5%BC%80%20%E5%B9%BF%E5%BC%80%E3%80%90%E8%BF%90%E5%8A%A8%E4%B8%96%E7%95%8C%E6%A0%A1%E5%9B%AD%E3%80%91%E7%AD%89%E5%B9%B3%E5%8F%B0%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E6%9C%8D%E5%8A%A1%20%20%E5%BE%AE%E4%BF%A1%E5%AE%A2%E6%9C%8D%3Awkds857.user.js
// @updateURL https://update.greasyfork.org/scripts/548303/2025%E5%B9%B4%E5%85%A8%E5%9B%BD%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%20U%E6%A0%A1%E5%9B%ADai%20%E7%9F%A5%E5%88%B0%20%E8%8B%B1%E5%8D%8E%E7%B3%BB%E5%88%97%20%E6%B8%85%E5%8D%8E%E7%A4%BE%E3%80%91%E3%80%90%E5%AD%A6%E8%B5%B7%20%E9%9D%92%E4%B9%A6%20%E6%9F%A0%E6%AA%AC%20%E7%9D%BF%E5%AD%A6%20%E6%85%95%E4%BA%AB%20%E6%85%95%E5%8D%8E%20%E8%89%AF%E5%B8%88%20%E8%81%94%E5%A4%A7%E3%80%91%E3%80%90%E5%9B%BD%E5%BC%80%20%E5%B9%BF%E5%BC%80%E3%80%90%E8%BF%90%E5%8A%A8%E4%B8%96%E7%95%8C%E6%A0%A1%E5%9B%AD%E3%80%91%E7%AD%89%E5%B9%B3%E5%8F%B0%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E6%9C%8D%E5%8A%A1%20%20%E5%BE%AE%E4%BF%A1%E5%AE%A2%E6%9C%8D%3Awkds857.meta.js
// ==/UserScript==
(function() {
'use strict';
// --- 全局变量 ---
let currentPlatform = null; // 当前平台标识
const platformMap = { // 这个是平台识别，需要修改
"learning-xuexitong": {  // 学习通 (示例)
matchPatterns: ["xuexitong.com"],
videoSelector: 'video.jw_video',  // 假设学习通的视频选择器
nextButtonSelector: '.next-button',//下个按钮选择器
controlPanel: {
//...控制面板代码
}
},
"wisdomtree": {  // 智慧树(示例)
videoSelector: 'video.video-js',
nextButtonSelector: '.next-button',
controlPanel: {
//...控制面板代码
}
},
};
// 存储当前任务状态 (用于开机自启，如果用户关闭浏览器，会清空)
let taskState =  {
isPlaying: false,
isAutoNext: true ,
speed:1,
};
// --- 工具函数 ---
// 延迟函数 (用于模拟人眼观看)
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}
// 显示通知 (使用 SweetAlert2)
function showNotification(title, message, icon = 'info') {
Swal.fire({  // 使用 SweetAlert2
title: title,
text: message,
icon: icon, // 'success', 'error', 'warning', 'info', 'question'
confirmButtonText: '好的'
});
}
// 判断当前平台 (根据匹配规则)
function identifyPlatform() {
const url = window.location.href;
for (const platform in platformMap) {
if (platformMap.hasOwnProperty(platform)) {
const matchPatterns = platformMap[platform].matchPatterns;
if(matchPatterns){
for(let i = 0 ; i<matchPatterns.length;i++){
if (url.includes(matchPatterns[i])) {
return platform;
}
}
}
}
}
return null;
}
//  强制破除网站不可复制文字
function unlockCopy() {
document.body.style.userSelect = 'text !important';
document.body.style.webkitUserSelect = 'text !important';
document.body.style.mozUserSelect = 'text !important';
document.body.style.msUserSelect = 'text !important';
}
// 获取视频元素
function getVideoElement(platform) {
if (platformMap[platform] && platformMap[platform].videoSelector) {
return document.querySelector(platformMap[platform].videoSelector);
}
return null;
}
//获取下个按钮元素
function getNextButtonElement(platform){
if (platformMap[platform] && platformMap[platform].nextButtonSelector) {
return document.querySelector(platformMap[platform].nextButtonSelector);
}
return null;
}
// 自动切换任务点、自动登录等 (需要根据不同平台实现具体的逻辑)
async function autoActions(platform) {
if (!platform) return;
showNotification("启动自动任务", "正在自动化...");
while(taskState.isAutoNext){
// 1. 获取视频元素
const video = getVideoElement(platform);
if (!video) {

await sleep(5000); // 5秒后重试
continue; // 跳过这次循环
}
// 3. 控制视频播放速度
if (taskState.speed != video.playbackRate) {
video.playbackRate = taskState.speed;

}
// 2. 播放视频
if(taskState.isPlaying) {
if (video.paused) {
video.play();
console.log("开始播放");
}
}else{
if (!video.paused) {
console.log("暂停");
video.pause();
}
}
// 4. 等待视频播放完毕 (或达到指定时间)
await new Promise((resolve) => {
video.addEventListener('ended', resolve, { once: true });
if (video.currentTime >= video.duration) {
resolve();
} else {
// 模拟播放完成
setTimeout(resolve, (video.duration - video.currentTime) * 1000 + 1000); // 多等待1秒
}
});
// 5. 点击 "下一个" 按钮
const nextButton = getNextButtonElement(platform);
if (nextButton) {
console.log("点击下一集");
nextButton.click();
await sleep(3000);
} else {

taskState.isAutoNext = false; // 暂停自动
showNotification("提示", "未找到“下一集”按钮，暂停自动播放", "warning");
break;
}
} // end while
showNotification("自动任务完成", "已处理完当前任务", "success");
}
// --- 初始化 ---
(function initialize() {
currentPlatform = identifyPlatform();
if (currentPlatform) {

unlockCopy(); // 破除复制限制
// 创建控制面板 (简化示例)
createControlPanel(currentPlatform);
// 启动自动操作
autoActions(currentPlatform);
} else {
showNotification("网课助手", "未检测到支持的网课平台。");
}
// 监听页面变化 (例如，观察 DOM 是否发生变化)
const observer = new MutationObserver(mutations => {
// 在页面变化时，检查是否有新的元素被加载
if (currentPlatform) {
// 重新激活功能，比如监控视频播放情况等
// 可以调用 autoActions() 等函数
}
});
observer.observe(document.body, { childList: true, subtree: true });
})();
// --- UI 控制面板 (可自定义) ---
function createControlPanel(platform) {
const panel = document.createElement('div');
panel.style.position = 'fixed';
panel.style.top = '10px';
panel.style.left = '10px';
panel.style.zIndex = '10000'; // 确保在其他元素之上
panel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
panel.style.color = 'white';
panel.style.padding = '10px';
panel.style.borderRadius = '5px';
panel.style.fontFamily = 'sans-serif';
//控制面板元素
let panelHtml =`
 
 <input type="checkbox" id="autoPlay" ${taskState.isPlaying ? 'checked' : ''}> 自动播放 
 <input type="checkbox" id="autoNext" ${taskState.isAutoNext ? 'checked' : ''}> 自动下一集 
 
 
播放速度:
- 
${taskState.speed}x 
+ 
 
 
扩展功能 
 

 个人微信: wkds857 
 
`;
panel.innerHTML = panelHtml;
document.body.appendChild(panel);
// 事件监听
panel.querySelector('#autoPlay').addEventListener('change', (event) => {
taskState.isPlaying = event.target.checked;
if(taskState.isPlaying){
showNotification("提示", 已开始自动播放);
}else {
showNotification("提示", 已暂停播放);
}
});
panel.querySelector('#autoNext').addEventListener('change', (event) => {
taskState.isAutoNext = event.target.checked;
if(taskState.isAutoNext){
showNotification("提示", 已开启自动下一集);
}else {
showNotification("提示", 已暂停自动下一集);
}
});
panel.querySelector('#speedDown').addEventListener('click', () => {
taskState.speed  = Math.max(0.5, taskState.speed - 0.5);

});
panel.querySelector('#speedUp').addEventListener('click', () => {
taskState.speed = Math.min(5.0, taskState.speed + 0.5);

});
panel.querySelector('#customButton').addEventListener('click', () => {
showNotification("暂不支持", "扩展功能正在开发中...");
});
}
})();