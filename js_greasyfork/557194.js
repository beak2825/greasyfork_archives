// ==UserScript==
// @name         MochiFitter网站汉化
// @namespace    mochifitter-zh
// @version      1.2.1
// @description  MochiFitter兼容虚拟形象查询网站汉化脚本
// @author       Fallen_ice
// @match        https://mochifitter.eringi.me/*
// @icon         https://mochifitter.eringi.me/icon/icon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557194/MochiFitter%E7%BD%91%E7%AB%99%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/557194/MochiFitter%E7%BD%91%E7%AB%99%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

// 精确匹配
var data = JSON.parse(
    '{"もちふぃった～プロファイル一覧":"MochiFitter适配资料一览","VRChatアバター用 もちふぃった～プロファイル情報まとめ":"VRChat用虚拟形象适配MochiFitter资料汇总","(WIP)軽量版ページへ":"轻量版页面(开发中)","もちふぃった～とは？":"MochiFitter是什么？","もちふぃった～は、VRChat用の3Dアバター向けの衣装を自動で合わせるためのツールです。":"MochiFitter是一款为VRChat的3D虚拟形象自动匹配服装的工具。","アバター向けの衣装を、もちふぃった～Templateに合わせることで、他のアバターにも着せることができます。":"通过将虚拟角色的服装调整为契合MochiFitter模板的规格，即可让其他虚拟角色穿戴该服装。","順方向":"顺方向",": Templateから別のアバターへ自動で合わせる":"：从模板自动适配到其他虚拟形象",": アバター用衣装をTemplateに自動で合わせる":"：自动将虚拟角色服装适配至模板","購入ページは":"购买链接在","こちら":"这里","最終更新":"最终更新时间","プロファイル登録要望":"适配资料注册请求","新しいアバタープロファイルの登録をご希望の方は、こちらのフォームからリクエストしてください。":"如需注册新的虚拟形象适配资料，请通过此表单提交申请。","登録要望フォームを開く":"打开注册申请表","公式":"官方","非公式":"非官方","順方向対応":"支持顺方向","逆方向対応":"支持逆方向","プロファイル一覧":"适配资料一览","備考":"备注","販売休止中":"停止贩卖中","アバター作者":"虚拟形象作者","プロファイル作者":"适配文件作者","DL方法":"下载方式","価格":"价格","アバター同梱":"虚拟形象同捆","順方向: 対応":"顺方向：支持","順方向: 未対応":"顺方向：不支持","逆方向: 対応":"逆方向：支持","逆方向: 未対応":"逆方向：不支持","ダウンロード":"下载","もちふぃった～同梱":"MochiFitter同捆","アバター同梱、もちふぃった～同梱":"虚拟形象、MochiFitter同捆","無料":"免费","森羅本体は販売休止中":"森罗本体停止贩卖中","GoogleDrive":"谷歌云盘","スプレッドシート":"电子表格","単体有料":"单独贩卖","逆方向対応不明":"逆方向支持未知","読み込み中...":"读取中…","もちふぃった～プロファイル一覧（軽量版）":"MochiFitter适配资料一览(轻量版)","通常版へ":"返回普通版","最終更新:":"最终更新时间：","表示中:":"显示中：","登録日":"登录日期","更新日":"更新日期","アバター名":"虚拟形象名称","DLリンク":"下载链接","DL":"下载","該当するプロファイルが見つかりませんでした":"未找到匹配的适配资料","検索条件やフィルターを変更してみてください":"请尝试更改搜索条件或筛选器。","新しいアバタープロファイルの登録をご希望の方は、こちらのフォームからリクエストしてください。機能追加の要望などを書いていただいても構いません。":"如需注册新的虚拟形象适配资料，请通过此表单提交申请。也可在此填写功能增补等需求。","プロファイル価格":"适配文件价格","アバター価格":"虚拟形象价格","未登録":"未收录","Twitter":"X (推特)","全て":"全部","双方向対応":"支持双方向","非公開":"未公开","Discordファンサーバー限定公開":"Discord粉丝服务器限定公开","Discord限定公開":"Discord限定公开","アバター公開順（ID順）":"虚拟形象公开顺序(ID)","アバター公開順（Booth ID順）":"虚拟形象公开顺序(BOOTH ID)","プロファイル公開順（Booth ID順）":"适配资料公开顺序(BOOTH ID)","最終更新日順（新しい順）":"最后更新日期顺序(从新到旧)","最終更新日順（古い順）":"最后更新日期顺序(从旧到新)","アバター名順（あいうえお順）":"虚拟形象名称顺序(五十音)","アバター作者名順（あいうえお順）":"虚拟形象作者名称顺序(五十音)","プロファイル作者名順（あいうえお順）":"适配资料作者名称顺序(五十音)","利用規約":"使用条款","準備中":"准备中","利用規約は現在準備中です。":"使用条款现在准备中。","トップページに戻る":"返回首页","軽量版ページへ":"轻量版页面","AAA":"BBB","AAA":"BBB"}'
);

// 正则表达式匹配规则
var regexReplacements = [
  { pattern: /\bSearch through\s+(\d+)\s*items?\b/gi, replace: "搜寻$1个物品" },
  { pattern: /(\d+)\s*items?\b indexed\s/gi, replace: "$1个物品索引" },
  { pattern: /(\d+)\s*free items?\b indexed\s/gi, replace: "$1个免费物品索引" },
  { pattern: /(\d+)\s*items?\b displayed\s/gi, replace: "$1个物品已陈列 " },
  { pattern: /(\d+)\s*items?/gi, replace: "$1个物品" }, // 匹配数字+items
  { pattern: /\b(\d+)\s* CNY?\b/gi, replace: "$1人民币" },
  { pattern: /(\d+)\s* JPY?/gi, replace: "$1日元" },
  { pattern: /\bBrowse up to\s+(\d+)\s*avatars?\b/gi, replace: "探索$1个虚拟形象" },
  { pattern: /(\d+)\s*avatars?\b indexed\s/gi, replace: "$1个虚拟形象索引" },
  { pattern: /(\d+)\s*avatars?\b displayed\s/gi, replace: "$1个虚拟形象已陈列 " },
  { pattern: /(\d+)\s*avatars?/gi, replace: "$1个虚拟形象" },
  { pattern: /(\d+)\s*face tracking avatars?\b indexed\s/gi, replace: "$1个面部追踪虚拟形象索引" },
  { pattern: /(\d+)\s*free avatars?\b indexed\s/gi, replace: "$1个免费虚拟形象索引" },
  { pattern: /(\d+)\s*male avatars?\b indexed\s/gi, replace: "$1个男性虚拟形象索引" },
  { pattern: /(\d+)\s*mobile avatars?\b indexed\s/gi, replace: "$1个移动端虚拟形象索引" },
  { pattern: /(\d+)\s*world assets?\b indexed\s/gi, replace: "$1个世界预制件索引" },
  { pattern: /\bLook through\s+(\d+)\s*world assets?\b/gi, replace: "查找$1个世界预制件" },
  { pattern: /\bSold by\s/gi, replace: "店铺：" },
  { pattern: /\bis listed at\s/gi, replace: "列于 " },
  { pattern: /\bMore by\s/gi, replace: "更多来自" },
  { pattern: /\bPosted\s/gi, replace: "公布于" },
  { pattern: /\bPage rendered and loaded in\s/gi, replace: "页面加载时长为" },
  { pattern: /\bseconds.\s/gi, replace: "秒。" },
  { pattern: /\bJanuary\s/gi, replace: "1月" },
  { pattern: /\bFebruary\s/gi, replace: "2月" },
  { pattern: /\bMarch\s/gi, replace: "3月" },
  { pattern: /\bApril\s/gi, replace: "4月" },
  { pattern: /\bMay\s/gi, replace: "5月" },
  { pattern: /\bJune\s/gi, replace: "6月" },
  { pattern: /\bJuly\s/gi, replace: "7月" },
  { pattern: /\bAugust\s/gi, replace: "8月" },
  { pattern: /\bSeptember\s/gi, replace: "9月" },
  { pattern: /\bOctober\s/gi, replace: "10月" },
  { pattern: /\bNovember\s/gi, replace: "11月" },
  { pattern: /\bDecember\s/gi, replace: "12月" },
  { pattern: /(\d+)\s*st?/gi, replace: "$1日" },
  { pattern: /(\d+)\s*rd?/gi, replace: "$1日" },
  { pattern: /(\d+)\s*th?/gi, replace: "$1日" },
  { pattern: /\bBOOTHPLORER is\s/gi, replace: "BOOTHPLORER" },
  { pattern: /\baffiliated with BOOTH, pixiv or VRChat.\s/gi, replace: "隶属于BOOTH、pixiv或VRChat。" },
];

// 替换函数
function replaceText() {
  var elements = document.getElementsByTagName("*");
  for (var i = 0; i < elements.length; i++) {
    var nodes = elements[i].childNodes;
    for (var j = 0; j < nodes.length; j++) {
      if (nodes[j].nodeType === Node.TEXT_NODE) {
        var originalText = nodes[j].nodeValue;
        var trimmedText = originalText.trim();

        // 先执行精确匹配
        for (var key in data) {
          if (trimmedText === key) {
            nodes[j].parentNode.setAttribute("title", originalText);
            nodes[j].nodeValue = data[key];
            originalText = data[key]; // 更新文本内容
            break; // 精确匹配只需执行一次
          }
        }

        // 执行正则表达式替换
        regexReplacements.forEach(function(rule) {
          var newText = originalText.replace(rule.pattern, rule.replace);
          if (newText !== originalText) {
            nodes[j].parentNode.setAttribute("data-original", originalText);
            nodes[j].nodeValue = newText;
            originalText = newText; // 更新当前文本
          }
        });
      }
    }
  }
}

// 剩余代码
(function () {
  "use strict";

  var observer = new MutationObserver(function (mutations) {
    for (var mutation of mutations) {
      if (mutation.type === "childList") {
        replaceText();
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();