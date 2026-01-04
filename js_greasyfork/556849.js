// ==UserScript==
// @name         逮捕中国五毛自干五大外宣（Tampermonkey 版）
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  识别并标记 X（Twitter）上的中国五毛、自干五和大外宣账号，显示用户真实位置
// @author       ChatGPT / Gemini (@Toyler_d)
// @license      MIT
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/556849/%E9%80%AE%E6%8D%95%E4%B8%AD%E5%9B%BD%E4%BA%94%E6%AF%9B%E8%87%AA%E5%B9%B2%E4%BA%94%E5%A4%A7%E5%A4%96%E5%AE%A3%EF%BC%88Tampermonkey%20%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556849/%E9%80%AE%E6%8D%95%E4%B8%AD%E5%9B%BD%E4%BA%94%E6%AF%9B%E8%87%AA%E5%B9%B2%E4%BA%94%E5%A4%A7%E5%A4%96%E5%AE%A3%EF%BC%88Tampermonkey%20%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS
    const css = `
/* ============================================ 
   X 用户标签增强 - 样式表
   ============================================ */

/* 徽章容器 */
.inty-wumao-badge-container {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
  font-size: 13px;
  vertical-align: middle;
}

/* 位置徽章 */
.inty-wumao-location-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background-color: rgba(29, 155, 240, 0.1);
  color: rgb(29, 155, 240);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  white-space: nowrap;
  transition: background-color 0.2s ease;
  user-select: none;
  animation: inty-wumaoFadeIn 0.3s ease-out;
}

.inty-wumao-location-badge:hover {
  background-color: rgba(29, 155, 240, 0.15);
}

.inty-wumao-location-badge svg {
  flex-shrink: 0;
  vertical-align: middle;
  opacity: 0.8;
}

/* 中国用户特殊标记 */
.inty-wumao-location-badge.china-user {
  background-color: rgba(244, 67, 54, 0.15);
  color: rgb(244, 67, 54);
  font-weight: 600;
  border: 1px solid rgba(244, 67, 54, 0.3);
  box-shadow: 0 0 8px rgba(244, 67, 54, 0.2);
  animation: inty-wumaoFadeIn 0.3s ease-out, inty-wumaoChinaPulse 2s ease-in-out infinite;
}

.inty-wumao-location-badge.china-user:hover {
  background-color: rgba(244, 67, 54, 0.25);
  box-shadow: 0 0 12px rgba(244, 67, 54, 0.3);
}

/* 台湾用户特殊标记 */
.inty-wumao-location-badge.taiwan-user {
  background-color: rgba(33, 150, 243, 0.15);
  color: rgb(33, 150, 243);
  font-weight: 600;
  border: 1px solid rgba(33, 150, 243, 0.3);
  box-shadow: 0 0 8px rgba(33, 150, 243, 0.2);
  animation: inty-wumaoFadeIn 0.3s ease-out, inty-wumaoTaiwanPulse 2s ease-in-out infinite;
}

.inty-wumao-location-badge.taiwan-user:hover {
  background-color: rgba(33, 150, 243, 0.25);
  box-shadow: 0 0 12px rgba(33, 150, 243, 0.3);
}

/* 标签徽章 */
.inty-wumao-label-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: #fff3cd;
  color: #856404;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #ffeaa7;
  user-select: none;
  animation: inty-wumaoFadeIn 0.3s ease-out;
}

/* 编辑按钮 */
.inty-wumao-edit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: #f7f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.inty-wumao-edit-btn:hover {
  background: #e1e8ed;
  transform: scale(1.1);
}

/* 编辑对话框遮罩 */
.inty-wumao-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  animation: inty-wumaoDialogFadeIn 0.2s;
}

/* 对话框内容 */
.inty-wumao-dialog-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 450px;
  animation: inty-wumaoSlideUp 0.3s;
}

/* 对话框头部 */
.inty-wumao-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e1e8ed;
}

.inty-wumao-dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f1419;
}

.inty-wumao-dialog-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #536471;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.inty-wumao-dialog-close:hover {
  background: #f7f9fa;
}

/* 对话框主体 */
.inty-wumao-dialog-body {
  padding: 20px;
}

.inty-wumao-dialog-body label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0f1419;
  margin-bottom: 8px;
}

.inty-wumao-input {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.2s;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.inty-wumao-input:focus {
  outline: none;
  border-color: #1d9bf0;
}

.inty-wumao-dialog-info {
  margin-top: 12px;
  padding: 10px;
  background: #f7f9fa;
  border-radius: 6px;
}

.inty-wumao-dialog-info small {
  color: #536471;
  font-size: 13px;
}

/* 对话框底部 */
.inty-wumao-dialog-footer {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid #e1e8ed;
  gap: 10px;
}

.inty-wumao-btn-delete,
.inty-wumao-btn-save {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.inty-wumao-btn-delete {
  background: #f7f9fa;
  color: #f4212e;
  flex: 0 0 auto;
}

.inty-wumao-btn-delete:hover {
  background: #ffe1e3;
}

.inty-wumao-btn-save {
  background: #1d9bf0;
  color: white;
  flex: 1;
}

.inty-wumao-btn-save:hover {
  background: #1a8cd8;
}

/* 动画 */
@keyframes inty-wumaoFadeIn {
  from {
    opacity: 0;
    transform: translateX(-5px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes inty-wumaoDialogFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes inty-wumaoSlideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes inty-wumaoChinaPulse {
  0%, 100% {
    box-shadow: 0 0 8px rgba(244, 67, 54, 0.2);
  }
  50% {
    box-shadow: 0 0 16px rgba(244, 67, 54, 0.4);
  }
}

@keyframes inty-wumaoTaiwanPulse {
  0%, 100% {
    box-shadow: 0 0 8px rgba(33, 150, 243, 0.2);
  }
  50% {
    box-shadow: 0 0 16px rgba(33, 150, 243, 0.4);
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .inty-wumao-location-badge {
    background-color: rgba(29, 155, 240, 0.15);
    color: rgb(29, 155, 240);
  }

  .inty-wumao-location-badge:hover {
    background-color: rgba(29, 155, 240, 0.2);
  }

  .inty-wumao-location-badge.china-user {
    background-color: rgba(244, 67, 54, 0.2);
    color: rgb(255, 107, 107);
    border: 1px solid rgba(244, 67, 54, 0.4);
  }

  .inty-wumao-location-badge.china-user:hover {
    background-color: rgba(244, 67, 54, 0.3);
  }

  .inty-wumao-location-badge.taiwan-user {
    background-color: rgba(33, 150, 243, 0.2);
    color: rgb(100, 181, 246);
    border: 1px solid rgba(33, 150, 243, 0.4);
  }

  .inty-wumao-location-badge.taiwan-user:hover {
    background-color: rgba(33, 150, 243, 0.3);
  }

  .inty-wumao-label-badge {
    background: #5c4a1f;
    color: #ffd95a;
    border-color: #7d6a33;
  }

  .inty-wumao-edit-btn {
    background: #2c3640;
    border-color: #3d4f5c;
  }

  .inty-wumao-edit-btn:hover {
    background: #3d4f5c;
  }

  .inty-wumao-dialog-content {
    background: #15202b;
    color: #ffffff;
  }

  .inty-wumao-dialog-header {
    border-bottom-color: #38444d;
  }

  .inty-wumao-dialog-header h3,
  .inty-wumao-dialog-body label {
    color: #ffffff;
  }

  .inty-wumao-dialog-close {
    color: #8b98a5;
  }

  .inty-wumao-dialog-close:hover {
    background: #1e2732;
  }

  .inty-wumao-input {
    background: #192734;
    border-color: #38444d;
    color: #ffffff;
  }

  .inty-wumao-input:focus {
    border-color: #1d9bf0;
  }

  .inty-wumao-dialog-info {
    background: #192734;
  }

  .inty-wumao-dialog-info small {
    color: #8b98a5;
  }

  .inty-wumao-dialog-footer {
    border-top-color: #38444d;
  }

  .inty-wumao-btn-delete {
    background: #2c3640;
  }

  .inty-wumao-btn-delete:hover {
    background: #5a2630;
  }
}

/* 移动端适配 */
@media (max-width: 500px) {
  .inty-wumao-badge-container {
    gap: 4px;
    margin-left: 4px;
  }

  .inty-wumao-location-badge,
  .inty-wumao-label-badge {
    font-size: 12px;
    padding: 1px 6px;
  }

  .inty-wumao-location-badge svg {
    width: 12px;
    height: 12px;
  }

  .inty-wumao-edit-btn {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }
}

/* 确保徽章在用户名容器中正确对齐 */
[data-testid="User-Name"] .inty-wumao-badge-container {
  margin-top: 2px;
}
    `;
    GM_addStyle(css);

    // 1. Inject translations.js content
    const LOCATION_TRANSLATIONS_EXTENDED = `
United States|美国|🇺🇸
USA|美国|🇺🇸
US|美国|🇺🇸
United Kingdom|英国|🇬🇧
UK|英国|🇬🇧
Great Britain|英国|🇬🇧
England|英格兰|🏴󠁧󠁢󠁥󠁮󠁧󠁿
Scotland|苏格兰|🏴󠁧󠁢󠁳󠁣󠁴󠁿
Wales|威尔士|🏴󠁧󠁢󠁷󠁬󠁳󠁿
China|中国|🇨🇳
PRC|中国|🇨🇳
People's Republic of China|中国|🇨🇳
Taiwan|台湾|🇹🇼
ROC|台湾|🇹🇼
Hong Kong|香港|🇭🇰
Macau|澳门|🇲🇴
Macao|澳门|🇲🇴
Japan|日本|🇯🇵
South Korea|韩国|🇰🇷
Korea|韩国|🇰🇷
North Korea|朝鲜|🇰🇵
Singapore|新加坡|🇸🇬
Malaysia|马来西亚|🇲🇾
Thailand|泰国|🇹🇭
Vietnam|越南|🇻🇳
Indonesia|印度尼西亚|🇮🇩
Philippines|菲律宾|🇵🇭
India|印度|🇮🇳
Pakistan|巴基斯坦|🇵🇰
Bangladesh|孟加拉国|🇧🇩
Myanmar|缅甸|🇲🇲
Cambodia|柬埔寨|🇰🇭
Laos|老挝|🇱🇦
Mongolia|蒙古|🇲🇳
Nepal|尼泊尔|🇳🇵
Sri Lanka|斯里兰卡|🇱🇰
Israel|以色列|🇮🇱
Palestine|巴勒斯坦|🇵🇸
Saudi Arabia|沙特阿拉伯|🇸🇦
UAE|阿联酋|🇦🇪
United Arab Emirates|阿联酋|🇦🇪
Qatar|卡塔尔|🇶🇦
Kuwait|科威特|🇰🇼
Iran|伊朗|🇮🇷
Iraq|伊拉克|🇮🇶
Syria|叙利亚|🇸🇾
Lebanon|黎巴嫩|🇱🇧
Jordan|约旦|🇯🇴
Turkey|土耳其|🇹🇷
Germany|德国|🇩🇪
France|法国|🇫🇷
Italy|意大利|🇮🇹
Spain|西班牙|🇪🇸
Russia|俄罗斯|🇷🇺
Netherlands|荷兰|🇳🇱
Belgium|比利时|🇧🇪
Switzerland|瑞士|🇨🇭
Austria|奥地利|🇦🇹
Sweden|瑞典|🇸🇪
Norway|挪威|🇳🇴
Denmark|丹麦|🇩🇰
Finland|芬兰|🇫🇮
Poland|波兰|🇵🇱
Czech Republic|捷克|🇨🇿
Hungary|匈牙利|🇭🇺
Romania|罗马尼亚|🇷🇴
Greece|希腊|🇬🇷
Portugal|葡萄牙|🇵🇹
Ireland|爱尔兰|🇮🇪
Ukraine|乌克兰|🇺🇦
Belarus|白俄罗斯|🇧🇾
Iceland|冰岛|🇮🇸
Canada|加拿大|🇨🇦
Mexico|墨西哥|🇲🇽
Brazil|巴西|🇧🇷
Argentina|阿根廷|🇦🇷
Chile|智利|🇨🇱
Colombia|哥伦比亚|🇨🇴
Peru|秘鲁|🇵🇪
Venezuela|委内瑞拉|🇻🇪
Cuba|古巴|🇨🇺
Jamaica|牙买加|🇯🇲
Australia|澳大利亚|🇦🇺
New Zealand|新西兰|🇳🇿
Egypt|埃及|🇪🇬
South Africa|南非|🇿🇦
Nigeria|尼日利亚|🇳🇬
Kenya|肯尼亚|🇰🇪
Ethiopia|埃塞俄比亚|🇪🇹
Morocco|摩洛哥|🇲🇦
Algeria|阿尔及利亚|🇩🇿
Beijing|北京|🇨🇳
Shanghai|上海|🇨🇳
Guangzhou|广州|🇨🇳
Shenzhen|深圳|🇨🇳
Chengdu|成都|🇨🇳
Chongqing|重庆|🇨🇳
Hangzhou|杭州|🇨🇳
Wuhan|武汉|🇨🇳
Nanjing|南京|🇨🇳
Xi'an|西安|🇨🇳
Tianjin|天津|🇨🇳
Suzhou|苏州|🇨🇳
Changsha|长沙|🇨🇳
Shenyang|沈阳|🇨🇳
Qingdao|青岛|🇨🇳
Zhengzhou|郑州|🇨🇳
Dalian|大连|🇨🇳
Jinan|济南|🇨🇳
Xiamen|厦门|🇨🇳
Fuzhou|福州|🇨🇳
Kunming|昆明|🇨🇳
Harbin|哈尔滨|🇨🇳
Changchun|长春|🇨🇳
Shijiazhuang|石家庄|🇨🇳
Hefei|合肥|🇨🇳
Nanchang|南昌|🇨🇳
Guiyang|贵阳|🇨🇳
Taiyuan|太原|🇨🇳
Lanzhou|兰州|🇨🇳
Hohhot|呼和浩特|🇨🇳
Urumqi|乌鲁木齐|🇨🇳
Yinchuan|银川|🇨🇳
Xining|西宁|🇨🇳
Lhasa|拉萨|🇨🇳
Haikou|海口|🇨🇳
Sanya|三亚|🇨🇳
Ningbo|宁波|🇨🇳
Wenzhou|温州|🇨🇳
Dongguan|东莞|🇨🇳
Foshan|佛山|🇨🇳
Zhuhai|珠海|🇨🇳
Nanning|南宁|🇨🇳
Guangdong|广东|🇨🇳
Zhejiang|浙江|🇨🇳
Jiangsu|江苏|🇨🇳
Sichuan|四川|🇨🇳
Hubei|湖北|🇨🇳
Hunan|湖南|🇨🇳
Hebei|河北|🇨🇳
Henan|河南|🇨🇳
Shandong|山东|🇨🇳
Shaanxi|陕西|🇨🇳
Liaoning|辽宁|🇨🇳
Jilin|吉林|🇨🇳
Heilongjiang|黑龙江|🇨🇳
Anhui|安徽|🇨🇳
Fujian|福建|🇨🇳
Jiangxi|江西|🇨🇳
Shanxi|山西|🇨🇳
Inner Mongolia|内蒙古|🇨🇳
Xinjiang|新疆|🇨🇳
Tibet|西藏|🇨🇳
Ningxia|宁夏|🇨🇳
Qinghai|青海|🇨🇳
Gansu|甘肃|🇨🇳
Yunnan|云南|🇨🇳
Guizhou|贵州|🇨🇳
Hainan|海南|🇨🇳
Taipei|台北|🇹🇼
Kaohsiung|高雄|🇹🇼
Taichung|台中|🇹🇼
Tainan|台南|🇹🇼
Hsinchu|新竹|🇹🇼
Keelung|基隆|🇹🇼
Chiayi|嘉义|🇹🇼
Taoyuan|桃园|🇹🇼
Changhua|彰化|🇹🇼
Pingtung|屏东|🇹🇼
Yilan|宜兰|🇹🇼
Hualien|花莲|🇹🇼
Taitung|台东|🇹🇼
Penghu|澎湖|🇹🇼
Kinmen|金门|🇹🇼
Matsu|马祖|🇹🇼
New York|纽约|🇺🇸
NYC|纽约|🇺🇸
Los Angeles|洛杉矶|🇺🇸
LA|洛杉矶|🇺🇸
San Francisco|旧金山|🇺🇸
SF|旧金山|🇺🇸
Chicago|芝加哥|🇺🇸
Washington|华盛顿|🇺🇸
DC|华盛顿特区|🇺🇸
Seattle|西雅图|🇺🇸
Boston|波士顿|🇺🇸
Miami|迈阿密|🇺🇸
Atlanta|亚特兰大|🇺🇸
Houston|休斯顿|🇺🇸
Dallas|达拉斯|🇺🇸
Phoenix|凤凰城|🇺🇸
Philadelphia|费城|🇺🇸
San Diego|圣地亚哥|🇺🇸
Las Vegas|拉斯维加斯|🇺🇸
Denver|丹佛|🇺🇸
Portland|波特兰|🇺🇸
Austin|奥斯汀|🇺🇸
Nashville|纳什维尔|🇺🇸
Detroit|底特律|🇺🇸
San Jose|圣何塞|🇺🇸
Texas|德克萨斯|🇺🇸
California|加利福尼亚|🇺🇸
Florida|佛罗里达|🇺🇸
New York State|纽约州|🇺🇸
Illinois|伊利诺伊|🇺🇸
Pennsylvania|宾夕法尼亚|🇺🇸
Ohio|俄亥俄|🇺🇸
Georgia|乔治亚|🇺🇸
Michigan|密歇根|🇺🇸
Massachusetts|马萨诸塞|🇺🇸
Virginia|弗吉尼亚|🇺🇸
Colorado|科罗拉多|🇺🇸
Oregon|俄勒冈|🇺🇸
Washington State|华盛顿州|🇺🇸
Toronto|多伦多|🇨🇦
Vancouver|温哥华|🇨🇦
Montreal|蒙特利尔|🇨🇦
Ottawa|渥太华|🇨🇦
Calgary|卡尔加里|🇨🇦
Edmonton|埃德蒙顿|🇨🇦
London|伦敦|🇬🇧
Manchester|曼彻斯特|🇬🇧
Birmingham|伯明翰|🇬🇧
Liverpool|利物浦|🇬🇧
Edinburgh|爱丁堡|🏴󠁧󠁢󠁳󠁣󠁴󠁿
Glasgow|格拉斯哥|🏴󠁧󠁢󠁳󠁣󠁴󠁿
Oxford|牛津|🇬🇧
Cambridge|剑桥|🇬🇧
Tokyo|东京|🇯🇵
Osaka|大阪|🇯🇵
Kyoto|京都|🇯🇵
Yokohama|横滨|🇯🇵
Nagoya|名古屋|🇯🇵
Sapporo|札幌|🇯🇵
Fukuoka|福冈|🇯🇵
Kobe|神户|🇯🇵
Hiroshima|广岛|🇯🇵
Nara|奈良|🇯🇵
Seoul|首尔|🇰🇷
Busan|釜山|🇰🇷
Incheon|仁川|🇰🇷
Daegu|大邱|🇰🇷
Daejeon|大田|🇰🇷
Bangkok|曼谷|🇹🇭
Hanoi|河内|🇻🇳
Ho Chi Minh|胡志明市|🇻🇳
Saigon|西贡|🇻🇳
Jakarta|雅加达|🇮🇩
Manila|马尼拉|🇵🇭
Kuala Lumpur|吉隆坡|🇲🇾
Yangon|仰光|🇲🇲
Phnom Penh|金边|🇰🇭
Mumbai|孟买|🇮🇳
Delhi|德里|🇮🇳
Bangalore|班加罗尔|🇮🇳
Kolkata|加尔各答|🇮🇳
Chennai|金奈|🇮🇮🇳
Hyderabad|海得拉巴|🇮🇳
Karachi|卡拉奇|🇵🇰
Islamabad|伊斯兰堡|🇵🇰
Dhaka|达卡|🇧🇩
Kathmandu|加德满都|🇳🇵
Dubai|迪拜|🇦🇪
Abu Dhabi|阿布扎比|🇦🇪
Riyadh|利雅得|🇸🇦
Doha|多哈|🇶🇦
Tel Aviv|特拉维夫|🇮🇱
Jerusalem|耶路撒冷|🇮🇱
Tehran|德黑兰|🇮🇷
Baghdad|巴格达|🇮🇶
Damascus|大马士革|🇸🇾
Beirut|贝鲁特|🇱🇧
Istanbul|伊斯坦布尔|🇹🇷
Ankara|安卡拉|🇹🇷
Paris|巴黎|🇫🇷
Marseille|马赛|🇫🇷
Lyon|里昂|🇫🇷
Nice|尼斯|🇫🇷
Berlin|柏林|🇩🇪
Munich|慕尼黑|🇩🇪
Frankfurt|法兰克福|🇩🇪
Hamburg|汉堡|🇩🇪
Cologne|科隆|🇩🇪
Rome|罗马|🇮🇹
Milan|米兰|🇮🇹
Venice|威尼斯|🇮🇹
Florence|佛罗伦萨|🇮🇹
Naples|那不勒斯|🇮🇹
Madrid|马德里|🇪🇸
Barcelona|巴塞罗那|🇪🇸
Valencia|瓦伦西亚|🇪🇸
Seville|塞维利亚|🇪🇸
Amsterdam|阿姆斯特丹|🇳🇱
Rotterdam|鹿特丹|🇳🇱
Brussels|布鲁塞尔|🇧🇪
Zurich|苏黎世|🇨🇭
Geneva|日内瓦|🇨🇭
Vienna|维也纳|🇦🇹
Stockholm|斯德哥尔摩|🇸🇪
Oslo|奥斯陆|🇳🇴
Copenhagen|哥本哈根|🇩🇰
Helsinki|赫尔辛基|🇫🇮
Warsaw|华沙|🇵🇱
Prague|布拉格|🇨🇿
Budapest|布达佩斯|🇭🇺
Bucharest|布加勒斯特|🇷🇴
Athens|雅典|🇬🇷
Lisbon|里斯本|🇵🇹
Dublin|都柏林|🇮🇪
Moscow|莫斯科|🇷🇺
St Petersburg|圣彼得堡|🇷🇺
Kyiv|基辅|🇺🇦
Kiev|基辅|🇺🇦
Mexico City|墨西哥城|🇲🇽
Sao Paulo|圣保罗|🇧🇷
Rio de Janeiro|里约热内卢|🇧🇷
Buenos Aires|布宜诺斯艾利斯|🇦🇷
Santiago|圣地亚哥|🇨🇱
Bogota|波哥大|🇨🇴
Lima|利马|🇵🇪
Caracas|加拉加斯|🇻🇪
Havana|哈瓦那|🇨🇺
Sydney|悉尼|🇦🇺
Melbourne|墨尔本|🇦🇺
Brisbane|布里斯班|🇦🇺
Perth|珀斯|🇦🇺
Adelaide|阿德莱德|🇦🇺
Auckland|奥克兰|🇳🇿
Wellington|惠灵顿|🇳🇿
Cairo|开罗|🇪🇬
Cape Town|开普敦|🇿🇦
Johannesburg|约翰内斯堡|🇿🇦
Lagos|拉各斯|🇳🇬
Nairobi|内罗毕|🇰🇪
Addis Ababa|亚的斯亚贝巴|🇪🇹
Casablanca|卡萨布兰卡|🇲🇦
Algiers|阿尔及尔|🇩🇿
    `.trim();

    function parseTranslations() {
      const translations = {};
      const lines = LOCATION_TRANSLATIONS_EXTENDED.split('\n');

      for (const line of lines) {
        const parts = line.split('|');
        if (parts.length === 3) {
          const [en, cn, flag] = parts;
          translations[en] = { cn, flag };
        }
      }
      return translations;
    }
    const PARSED_TRANSLATIONS = parseTranslations();
    console.log('[Inty-Wumao] 加载了', Object.keys(PARSED_TRANSLATIONS).length, '个位置翻译');


    // 2. Inject interceptor.js content into the main world
    const interceptorScript = document.createElement('script');
    interceptorScript.textContent = `
(function() {
  console.log('[Interceptor] 🎯 Started');

  const found = new Map();

  // Intercept fetch
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    const url = args[0];
    
    if (typeof url === 'string' && url.includes('/i/api/graphql/')) {
      try {
        const clone = response.clone();
        const data = await clone.json();
        extractLocations(data);
      } catch (e) {}
    }
    
    return response;
  };

  // Intercept XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this._url = url;
    return originalOpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.send = function(...args) {
    this.addEventListener('load', function() {
      if (this._url && this._url.includes('/i/api/graphql/')) {
        try {
          const data = JSON.parse(this.responseText);
          extractLocations(data);
        } catch (e) {}
      }
    });
    return originalSend.apply(this, args);
  };

  function extractLocations(obj, depth = 0) {
    if (depth > 20 || !obj || typeof obj !== 'object') return;

    // Find user objects
    if (obj.legacy?.screen_name) {
      const username = obj.legacy.screen_name;
      const location = obj.legacy.location || obj.about_profile?.account_based_in;

      // Silently detect users

      if (location && typeof location === 'string' && location.trim()) {
        const loc = location.trim();
        const key = username.toLowerCase();

        if (found.get(key) !== loc) {
          found.set(key, loc);
          window.postMessage({
            type: 'INTY_WUMAO_LOCATION_INTERCEPTED',
            username: username,
            location: loc
          }, '*');
          console.log('[Interceptor] ✅ Found location:', username, '→', loc);
        }
      }
    }

    // Recurse
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        extractLocations(obj[key], depth + 1);
      }
    }
  }

  console.log('[Interceptor] ✅ Ready');
})();
    `;
    document.documentElement.appendChild(interceptorScript);
    interceptorScript.remove(); // Clean up script tag

    // 3. background.js logic integration (for active API query)
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 小时

    function isValidUsername(username) {
      if (!username || typeof username !== 'string') return false;
      return /^[a-zA-Z0-9_]{1,15}$/.test(username);
    }

    function sanitizeLocation(location) {
      if (!location || typeof location !== 'string') return null;
      const trimmed = location.trim();
      if (trimmed.length < 1 || trimmed.length > 100) return null;
      if (['null', 'undefined', 'N/A', 'n/a'].includes(trimmed.toLowerCase())) return null;
      return trimmed;
    }

    async function getCachedLocation(username) {
      const cached = await GM_getValue(`loc_${username}`, null);
      if (cached && cached.timestamp && typeof cached.timestamp === 'number') {
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
          const sanitized = sanitizeLocation(cached.location);
          return sanitized;
        }
      }
      return null;
    }

    async function cacheLocation(username, location) {
      const sanitized = sanitizeLocation(location);
      if (!sanitized || !isValidUsername(username)) {
        return;
      }
      await GM_setValue(`loc_${username}`, {
        location: sanitized,
        timestamp: Date.now()
      });
    }

    async function getCsrfTokenFromCookies() {
      return new Promise(resolve => {
        GM_xmlhttpRequest({
          method: "GET",
          url: "https://x.com", // Or any twitter.com domain
          onload: function(response) {
            // GM_xmlhttpRequest might not expose Set-Cookie headers in `responseHeaders` for security reasons
            // Rely on document.cookie for same-origin cookies, though it might not include httpOnly cookies
            const docCookies = document.cookie.split('; ');
            const ct0FromDoc = docCookies.find(c => c.startsWith('ct0='));
            if (ct0FromDoc) {
                resolve(ct0FromDoc.substring(4)); // "ct0=".length is 4
                return;
            }
            resolve(null);
          },
          onerror: function() {
            resolve(null);
          }
        });
      });
    }
    
    // Fallback for getting CSRF from document.cookie directly, less reliable for Tampermonkey's isolation
    // Userscript usually runs in a sandbox, so document.cookie might not contain httpOnly cookies.
    // The GM_xmlhttpRequest method is preferred, but this can serve as a secondary attempt.
    function getCsrfFromDocumentCookie() {
        const docCookies = document.cookie.split('; ');
        const ct0FromDoc = docCookies.find(c => c.startsWith('ct0='));
        if (ct0FromDoc) {
            return ct0FromDoc.substring(4);
        }
        return null;
    }


    async function fetchLocationFromAPI(username) {
      try {
        if (!isValidUsername(username)) {
          return null;
        }

        const cached = await getCachedLocation(username);
        if (cached) {
          return cached;
        }
        
        // Try getting token via GM_xmlhttpRequest, then fallback to document.cookie (less reliable)
        let csrfToken = await getCsrfTokenFromCookies();
        if (!csrfToken) {
             csrfToken = getCsrfFromDocumentCookie(); // Fallback
        }
        
        if (!csrfToken) {
          console.log('[X-Buddy] 无法获取 CSRF Token');
          return null;
        }

        const queryId = 'XRqGa7EeokUU5kppkh13EA'; // This might change and need update
        const variables = JSON.stringify({ screenName: username });
        const url = `https://x.com/i/api/graphql/${queryId}/AboutAccountQuery?variables=${encodeURIComponent(variables)}`;

        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    'accept': '*/*',
                    'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
                    'content-type': 'application/json',
                    'x-csrf-token': csrfToken,
                    'x-twitter-active-user': 'yes',
                    'x-twitter-auth-type': 'OAuth2Session',
                    'x-twitter-client-language': 'en',
                },
                // credentials: 'include' is handled by Tampermonkey automatically including cookies for same-origin
                onload: async function(response) {
                    if (response.status !== 200) {
                        if (response.status === 429) {
                            console.error(`[X-Buddy] ⚠️ 速率限制！API 请求过于频繁，请稍后再试`);
                            console.error(`[X-Buddy] 建议：等待几分钟后刷新页面`);
                        } else {
                            console.error(`[X-Buddy] API 请求失败: ${response.status}`);
                            console.error(`[X-Buddy] 错误详情:`, response.responseText.substring(0, 200));
                        }
                        console.error(`[X-Buddy] 请求的用户名:`, username);
                        resolve(null);
                        return;
                    }

                    try {
                        const data = JSON.parse(response.responseText);
                        console.log(`[X-Buddy] ✅ API 响应成功:`, username);
                        console.log(`[X-Buddy] 📦 完整数据:`, data);

                        const userResult = data?.data?.user_result_by_screen_name?.result;
                        console.log(`[X-Buddy] 👤 User result:`, userResult);

                        let location = userResult?.about_profile?.account_based_in;
                        console.log(`[X-Buddy] 🔍 Path 1 (about_profile.account_based_in):`, location);

                        if (!location) {
                            location = userResult?.legacy?.location;
                            console.log(`[X-Buddy] 🔍 Path 2 (legacy.location):`, location);
                        }

                        if (location && typeof location === 'string' && location.trim().length > 0) {
                            const sanitized = sanitizeLocation(location);
                            if (sanitized) {
                                console.log(`[X-Buddy] ✅ 获取到位置:`, username, '→', sanitized);
                                await cacheLocation(username, sanitized);
                                resolve(sanitized);
                                return;
                            }
                        }

                        console.log(`[X-Buddy] ❌ 用户无位置信息:`, username);
                        console.log(`[X-Buddy] 📄 API 返回数据结构:`, JSON.stringify(data).substring(0, 500));
                        resolve(null);

                    } catch (parseError) {
                        console.error('[X-Buddy] 解析 API 响应失败:', parseError);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error('[X-Buddy] GM_xmlhttpRequest 请求失败:', error);
                    resolve(null);
                }
            });
        });

      } catch (error) {
        console.error('[X-Buddy] 获取位置失败:', error);
        return null;
      }
    }

    async function clearOldCache() {
      const allKeys = await GM_listValues(); // Tampermonkey API to list all stored keys
      const keysToRemove = [];
      const now = Date.now();

      for (const key of allKeys) {
        if (key.startsWith('loc_')) {
          const value = await GM_getValue(key, null);
          if (value && typeof value === 'object' && value.timestamp && typeof value.timestamp === 'number') {
            if (now - value.timestamp > CACHE_DURATION) {
              keysToRemove.push(key);
            }
          }
        }
      }

      for (const key of keysToRemove) {
        await GM_deleteValue(key);
      }
      if (keysToRemove.length > 0) {
        console.log(`[X-Buddy] 清理了 ${keysToRemove.length} 个过期缓存`);
      }
    }

    // 启动时清理旧缓存
    clearOldCache();

    // 每小时定期清理一次
    setInterval(clearOldCache, 60 * 60 * 1000);
    console.log('[X-Buddy] 后台功能已启动 (Tampermonkey)');


    // 4. content/content.js logic integration
    console.log('[X-Location] 🚀 Content script loaded (Viewport-aware mode)');

    const cache = new Map();
    const processed = new Map();
    let requestCount = 0;
    const MAX_REQUESTS_PER_MINUTE = 40;
    const RETRY_FAILED_AFTER = 60000;

    setInterval(() => {
      const now = Date.now();
      let cleared = 0;
      for (const [id, timestamp] of processed.entries()) {
        if (now - timestamp > RETRY_FAILED_AFTER) {
          processed.delete(id);
          cleared++;
        }
      }
      if (cleared > 0) {
        console.log(`[X-Location] 🧹 Cleared ${cleared} expired processed items`);
      }
    }, 10000);
    
    setInterval(() => { requestCount = 0; }, 60000);

    // Listen to interceptor
    window.addEventListener('message', (e) => {
      if (e.source !== window) return;
      if (e.data.type !== 'INTY_WUMAO_LOCATION_INTERCEPTED') return;

      const { username, location } = e.data;
      if (username && location) {
        cache.set(username.toLowerCase(), location);
        console.log('[X-Location] 📥 Intercepted:', username, '→', location);
        updateUI(username, location);
      }
    });

    async function getLocation(username) {
      const key = username.toLowerCase();

      if (cache.has(key)) {
        return cache.get(key);
      }

      // Check storage (using GM_getValue)
      const stored = await GM_getValue(`loc_${key}`, null);
      if (stored?.location) {
        const loc = stored.location;
        cache.set(key, loc);
        return loc;
      }

      if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
        console.warn('[X-Location] ⛔ Rate limit reached:', requestCount, '/', MAX_REQUESTS_PER_MINUTE);
        return null;
      }

      try {
        requestCount++;
        console.log('[X-Location] 🌐 API request:', username, `(${requestCount}/${MAX_REQUESTS_PER_MINUTE})`);
        
        // Direct call to fetchLocationFromAPI
        const location = await fetchLocationFromAPI(username);

        if (location) {
          cache.set(key, location);
          await cacheLocation(username, location); // Cache after successful API fetch
          console.log('[X-Location] ✅', username, '→', location);
          return location;
        }
      } catch (e) {
        console.error('[X-Location] ⚠️ API error:', e.message);
      }

      return null;
    }

    function extractUsername(tweet) {
      try {
        const selectors = [
          'a[href^="/"][role="link"]',
          '[data-testid="User-Name"] a',
          'a[role="link"]'
        ];

        for (const selector of selectors) {
          const links = tweet.querySelectorAll(selector);
          for (const link of links) {
            const href = link.getAttribute('href');
            if (!href) continue;
            const match = href.match(`^/([a-zA-Z0-9_]{1,15})(?:/|$)`);
            if (match) {
              const username = match[1];
              const blacklist = ['home', 'notifications', 'messages', 'explore', 'compose', 'i', 'search', 'settings'];
              if (!blacklist.includes(username)) {
                return username;
              }
            }
          }
        }
      } catch (e) {
        console.error('[X-Location] Extract error:', e);
      }
      return null;
    }

    function translate(location) {
      const translations = PARSED_TRANSLATIONS || {}; // Use local constant
      for (const [eng, obj] of Object.entries(translations)) {
        if (location.includes(eng)) {
          return { text: location.replace(eng, obj.cn), flag: obj.flag };
        }
      }
      return { text: location, flag: '' };
    }

    function createBadge(location) {
      const { text, flag } = translate(location);
      const badge = document.createElement('span');
      badge.className = 'inty-wumao-location-badge';
      badge.textContent = (flag || '📍') + ' ' + text;

      const lower = location.toLowerCase();
      if (lower.includes('china') || lower.includes('beijing') || lower.includes('中国')) {
        badge.classList.add('china-user');
      } else if (lower.includes('taiwan') || lower.includes('台湾')) {
        badge.classList.add('taiwan-user');
      }
      return badge;
    }

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;

      return (
        rect.top < windowHeight &&
        rect.bottom > 0 &&
        rect.left < windowWidth &&
        rect.right > 0
      );
    }

    async function processTweet(tweet) {
      if (!isVisible(tweet)) {
        return;
      }

      const username = extractUsername(tweet);
      if (!username) {
        return;
      }

      const container = tweet.querySelector('[data-testid="User-Name"]');
      if (!container) {
        return;
      }

      if (container.querySelector('.inty-wumao-badge-container')) {
        return;
      }

      if (container.dataset.intyWumaoProcessed) {
        return;
      }
      container.dataset.intyWumaoProcessed = 'processing';

      console.log('[X-Location] 🔍 Processing:', username);
      const location = await getLocation(username);

      if (!location) {
        container.dataset.intyWumaoProcessed = 'failed';
        return;
      }

      container.dataset.intyWumaoProcessed = 'success';

      const wrapper = document.createElement('div');
      wrapper.className = 'inty-wumao-badge-container';
      wrapper.appendChild(createBadge(location));
      container.appendChild(wrapper);
      console.log('[X-Location] ✅ Badge added:', username, '→', location);
    }

    function updateUI(username, location) {
      document.querySelectorAll('article[data-testid="tweet"]').forEach(tweet => {
        const tweetUser = extractUsername(tweet);
        if (tweetUser && tweetUser.toLowerCase() === username.toLowerCase()) {
          const container = tweet.querySelector('[data-testid="User-Name"]');
          if (container && !container.querySelector('.inty-wumao-badge-container') && !container.dataset.intyWumaoProcessed) {
            container.dataset.intyWumaoProcessed = 'success';
            const wrapper = document.createElement('div');
            wrapper.className = 'inty-wumao-badge-container';
            wrapper.appendChild(createBadge(location));
            container.appendChild(wrapper);
            console.log('[X-Location] ✅ Badge added via interceptor:', username, '→', location);
          }
        }
      });
    }

    function scan() {
      const tweets = document.querySelectorAll('article[data-testid="tweet"]');
      const visibleTweets = Array.from(tweets).filter(isVisible);

      if (visibleTweets.length === 0) return;

      visibleTweets.forEach((tweet, index) => {
        processTweet(tweet);
      });
    }

    function init() {
      const observer = new MutationObserver(() => {
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');
        const visibleTweets = Array.from(tweets).filter(isVisible);
        visibleTweets.forEach(processTweet);
      });

      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        setTimeout(init, 100);
        return;
      }

      setTimeout(scan, 2000);
      setInterval(scan, 10000);

      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(scan, 300);
      }, { passive: true });

      console.log('[X-Location] ✅ Ready');
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      setTimeout(init, 100);
    }

})();