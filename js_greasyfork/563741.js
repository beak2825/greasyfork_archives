// ==UserScript==
// @name         洛谷私信表情包替换器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在洛谷私信页面检测特定关键词并替换为自定义GIF表情，排除链接，修复卡死bug
// @author       cxm1024
// @match        https://www.luogu.com.cn/chat*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563741/%E6%B4%9B%E8%B0%B7%E7%A7%81%E4%BF%A1%E8%A1%A8%E6%83%85%E5%8C%85%E6%9B%BF%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563741/%E6%B4%9B%E8%B0%B7%E7%A7%81%E4%BF%A1%E8%A1%A8%E6%83%85%E5%8C%85%E6%9B%BF%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 表情映射列表
    const emojiMap = {
        "/aini": "https://qqemoji.pages.dev/aini.gif",
        "/aiq": "https://qqemoji.pages.dev/aiq.gif",
        "/am": "https://qqemoji.pages.dev/am.gif",
        "/azgc": "https://qqemoji.pages.dev/azgc.gif",
        "/baiy": "https://qqemoji.pages.dev/baiy.gif",
        "/bangbangt": "https://qqemoji.pages.dev/bangbangt.gif",
        "/baojin": "https://qqemoji.pages.dev/baojin.gif",
        "/bb": "https://qqemoji.pages.dev/bb.gif",
        "/bkx": "https://qqemoji.pages.dev/bkx.gif",
        "/bl": "https://qqemoji.pages.dev/bl.gif",
        "/bobo": "https://qqemoji.pages.dev/bobo.gif",
        "/bp": "https://qqemoji.pages.dev/bp.gif",
        "/bq": "https://qqemoji.pages.dev/bq.gif",
        "/bs": "https://qqemoji.pages.dev/bs.gif",
        "/bt": "https://qqemoji.pages.dev/bt.gif",
        "/bu": "https://qqemoji.pages.dev/bu.gif",
        "/bz": "https://qqemoji.pages.dev/bz.gif",
        "/cengyiceng": "https://qqemoji.pages.dev/cengyiceng.gif",
        "/ch": "https://qqemoji.pages.dev/ch.gif",
        "/chi": "https://qqemoji.pages.dev/chi.gif",
        "/cj": "https://qqemoji.pages.dev/cj.gif",
        "/cp": "https://qqemoji.pages.dev/cp.gif",
        "/dan": "https://qqemoji.pages.dev/dan.gif",
        "/dao": "https://qqemoji.pages.dev/dao.gif",
        "/db": "https://qqemoji.pages.dev/db.gif",
        "/dg": "https://qqemoji.pages.dev/dg.gif",
        "/dgg": "https://qqemoji.pages.dev/dgg.gif",
        "/dk": "https://qqemoji.pages.dev/dk.gif",
        "/dl": "https://qqemoji.pages.dev/dl.gif",
        "/doge": "https://qqemoji.pages.dev/doge.gif",
        "/dx": "https://qqemoji.pages.dev/dx.gif",
        "/dy": "https://qqemoji.pages.dev/dy.gif",
        "/dz": "https://qqemoji.pages.dev/dz.gif",
        "/ee": "https://qqemoji.pages.dev/ee.gif",
        "/fad": "https://qqemoji.pages.dev/fad.gif",
        "/fade": "https://qqemoji.pages.dev/fade.gif",
        "/fan": "https://qqemoji.pages.dev/fan.gif",
        "/fd": "https://qqemoji.pages.dev/fd.gif",
        "/fendou": "https://qqemoji.pages.dev/fendou.gif",
        "/fj": "https://qqemoji.pages.dev/fj.gif",
        "/fn": "https://qqemoji.pages.dev/fn.gif",
        "/fw": "https://qqemoji.pages.dev/fw.gif",
        "/gg": "https://qqemoji.pages.dev/gg.gif",
        "/gy": "https://qqemoji.pages.dev/gy.gif",
        "/gz": "https://qqemoji.pages.dev/gz.gif",
        "/hanx": "https://qqemoji.pages.dev/hanx.gif",
        "/haob": "https://qqemoji.pages.dev/haob.gif",
        "/hb": "https://qqemoji.pages.dev/hb.gif",
        "/hc": "https://qqemoji.pages.dev/hc.gif",
        "/hd": "https://qqemoji.pages.dev/hd.gif",
        "/hec": "https://qqemoji.pages.dev/hec.gif",
        "/hn": "https://qqemoji.pages.dev/hn.gif",
        "/hp": "https://qqemoji.pages.dev/hp.gif",
        "/hq": "https://qqemoji.pages.dev/hq.gif",
        "/hsh": "https://qqemoji.pages.dev/hsh.gif",
        "/ht": "https://qqemoji.pages.dev/ht.gif",
        "/huaix": "https://qqemoji.pages.dev/huaix.gif",
        "/hx": "https://qqemoji.pages.dev/hx.gif",
        "/jd": "https://qqemoji.pages.dev/jd.gif",
        "/jh": "https://qqemoji.pages.dev/jh.gif",
        "/jiaybb": "https://qqemoji.pages.dev/jiaybb.gif",
        "/jiaybs": "https://qqemoji.pages.dev/jiaybs.gif",
        "/jie": "https://qqemoji.pages.dev/jie.gif",
        "/jk": "https://qqemoji.pages.dev/jk.gif",
        "/jw": "https://qqemoji.pages.dev/jw.gif",
        "/jx": "https://qqemoji.pades.dev/jx.gif",
        "/jy": "https://qqemoji.pages.dev/jy.gif",
        "/ka": "https://qqemoji.pages.dev/ka.gif",
        "/kb": "https://qqemoji.pages.dev/kb.gif",
        "/kel": "https://qqemoji.pages.dev/kel.gif",
        "/kf": "https://qqemoji.pages.dev/kf.gif",
        "/kg": "https://qqemoji.pages.dev/kg.gif",
        "/kk": "https://qqemoji.pages.dev/kk.gif",
        "/kl": "https://qqemoji.pages.dev/kl.gif",
        "/kt": "https://qqemoji.pages.dev/kt.gif",
        "/kuk": "https://qqemoji.pages.dev/kuk.gif",
        "/kun": "https://qqemoji.pages.dev/kun.gif",
        "/kzht": "https://qqemoji.pages.dev/kzht.gif",
        "/lb": "https://qqemoji.pages.dev/lb.gif",
        "/lengh": "https://qqemoji.pages.dev/lengh.gif",
        "/lh": "https://qqemoji.pages.dev/lh.gif",
        "/ll": "https://qqemoji.pages.dev/ll.gif",
        "/lm": "https://qqemoji.pages.dev/lm.gif",
        "/lq": "https://qqemoji.pages.dev/lq.gif",
        "/lw": "https://qqemoji.pages.dev/lw.gif",
        "/meigui": "https://qqemoji.pages.dev/mg.gif",
        "/mm": "https://qqemoji.pages.dev/mm.gif",
        "/ng": "https://qqemoji.pages.dev/ng.gif",
        "/oh": "https://qqemoji.pages.dev/oh.gif",
        "/ou": "https://qqemoji.pages.dev/ou.gif",
        "/pch": "https://qqemoji.pages.dev/pch.gif",
        "/pj": "https://qqemoji.pages.dev/pj.gif",
        "/pp": "https://qqemoji.pages.dev/pp.gif",
        "/pt": "https://qqemoji.pages.dev/pt.gif",
        "/px": "https://qqemoji.pages.dev/px.gif",
        "/qd": "https://qqemoji.pages.dev/qd.gif",
        "/qiang": "https://qqemoji.pages.dev/qiang.gif",
        "/qiao": "https://qqemoji.pages.dev/qiao.gif",
        "/qidao": "https://qqemoji.pages.dev/qidao.gif",
        "/qq": "https://qqemoji.pages.dev/qq.gif",
        "/qt": "https://qqemoji.pages.dev/qt.gif",
        "/ruo": "https://qqemoji.pages.dev/ruo.gif",
        "/sa": "https://qqemoji.pages.dev/sa.gif",
        "/se": "https://qqemoji.pages.dev/se.gif",
        "/sh": "https://qqemoji.pages.dev/sh.gif",
        "/shd": "https://qqemoji.pages.dev/shd.gif",
        "/shl": "https://qqemoji.pages.dev/shl.gif",
        "/shuai": "https://qqemoji.pages.dev/shuai.gif",
        "/shui": "https://qqemoji.pages.dev/shui.gif",
        "/shxi": "https://qqemoji.pages.dev/shxi.gif",
        "/sr": "https://qqemoji.pages.dev/sr.gif",
        "/tiao": "https://qqemoji.pages.dev/tiao.gif",
        "/tl": "https://qqemoji.pages.dev/tl.gif",
        "/tnl": "https://qqemoji.pages.dev/tnl.gif",
        "/tp": "https://qqemoji.pages.dev/tp.gif",
        "/ts": "https://qqemoji.pages.dev/ts.gif",
        "/tsh": "https://qqemoji.pages.dev/tsh.gif",
        "/tuu": "https://qqemoji.pages.dev/tuu.gif",
        "/tx": "https://qqemoji.pages.dev/tx.gif",
        "/taiyang": "https://qqemoji.pages.dev/ty.gif",
        "/tyt": "https://qqemoji.pages.dev/tyt.gif",
        "/wbk": "https://qqemoji.pages.dev/wbk.gif",
        "/wl": "https://qqemoji.pages.dev/wl.gif",
        "/wn": "https://qqemoji.pages.dev/wn.gif",
        "/wq": "https://qqemoji.pages.dev/wq.gif",
        "/ws": "https://qqemoji.pages.dev/ws.gif",
        "/wx": "https://qqemoji.pages.dev/wx.gif",
        "/wzm": "https://qqemoji.pages.dev/wzm.gif",
        "/xhx": "https://qqemoji.pages.dev/xhx.gif",
        "/xia": "https://qqemoji.pages.dev/xia.gif",
        "/xig": "https://qqemoji.pages.dev/xig.gif",
        "/xin": "https://qqemoji.pages.dev/xin.gif",
        "/xjj": "https://qqemoji.pages.dev/xjj.gif",
        "/xk": "https://qqemoji.pages.dev/xk.gif",
        "/xs": "https://qqemoji.pages.dev/xs.gif",
        "/xu": "https://qqemoji.pages.dev/xu.gif",
        "/xw": "https://qqemoji.pages.dev/xw.gif",
        "/xy": "https://qqemoji.pages.dev/xy.gif",
        "/xyx": "https://qqemoji.pages.dev/xyx.gif",
        "/yao": "https://qqemoji.pages.dev/yao.gif",
        "/yb": "https://qqemoji.pages.dev/yb.gif",
        "/yhh": "https://qqemoji.pages.dev/yhh.gif",
        "/yiw": "https://qqemoji.pages.dev/yiw.gif",
        "/yl": "https://qqemoji.pages.dev/yl.gif",
        "/youl": "https://qqemoji.pages.dev/youl.gif",
        "/youtj": "https://qqemoji.pages.dev/youtj.gif",
        "/yt": "https://qqemoji.pages.dev/yt.gif",
        "/yun": "https://qqemoji.pages.dev/yun.gif",
        "/yx": "https://qqemoji.pages.dev/yx.gif",
        "/zhd": "https://qqemoji.pages.dev/zhd.gif",
        "/zhem": "https://qqemoji.pages.dev/zhem.gif",
        "/zhh": "https://qqemoji.pages.dev/zhh.gif",
        "/zhm": "https://qqemoji.pages.dev/zhm.gif",
        "/zhq": "https://qqemoji.pages.dev/zhq.gif",
        "/zj": "https://qqemoji.pages.dev/zj.gif",
        "/zk": "https://qqemoji.pages.dev/zk.gif",
        "/zq": "https://qqemoji.pages.dev/zq.gif",
        "/zt": "https://qqemoji.pages.dev/zt.gif",
        "/zuotj": "https://qqemoji.pages.dev/zuotj.gif",
        "/zyj": "https://qqemoji.pages.dev/zyj.gif",
        "/QQmua": "https://qqemoji.pages.dev/QQmua.gif",
        "/QQ比心": "https://qqemoji.pages.dev/QQ比心.gif",
        "/QQ车身": "https://qqemoji.pages.dev/QQ车身.gif",
        "/QQ扯": "https://qqemoji.pages.dev/QQ扯.gif",
        "/QQ大笑": "https://qqemoji.pages.dev/QQ大笑.gif",
        "/QQ袋子": "https://qqemoji.pages.dev/QQ袋子.gif",
        "/QQ得意": "https://qqemoji.pages.dev/QQ得意.gif",
        "/QQ灯泡": "https://qqemoji.pages.dev/QQ灯泡.gif",
        "/QQ凋谢": "https://qqemoji.pages.dev/QQ凋谢.gif",
        "/QQ发财": "https://qqemoji.pages.dev/QQ发财.gif",
        "/QQ方块": "https://qqemoji.pages.dev/QQ方块.gif",
        "/QQ肥皂": "https://qqemoji.pages.dev/QQ肥皂.gif",
        "/QQ风车": "https://qqemoji.pages.dev/QQ风车.gif",
        "/QQ滚": "https://qqemoji.pages.dev/QQ滚.gif",
        "/QQ戒指": "https://qqemoji.pages.dev/QQ戒指.gif",
        "/QQ卷纸": "https://qqemoji.pages.dev/QQ卷纸.gif",
        "/QQ考虑中": "https://qqemoji.pages.dev/QQ考虑中.gif",
        "/QQ狂笑": "https://qqemoji.pages.dev/QQ狂笑.gif",
        "/QQ栗子": "https://qqemoji.pages.dev/QQ栗子.gif",
        "/QQ厉害": "https://qqemoji.pages.dev/QQ厉害.gif",
        "/QQ略略": "https://qqemoji.pages.dev/QQ略略.gif",
        "/QQ面条": "https://qqemoji.pages.dev/QQ面条.gif",
        "/QQ面无表情": "https://qqemoji.pages.dev/QQ面无表情.gif",
        "/QQ闹钟": "https://qqemoji.pages.dev/QQ闹钟.gif",
        "/QQ气球": "https://qqemoji.pages.dev/QQ气球.gif",
        "/QQ汽车": "https://qqemoji.pages.dev/QQ汽车.gif",
        "/QQ青蛙": "https://qqemoji.pages.dev/QQ青蛙.gif",
        "/QQ扔粪": "https://qqemoji.pages.dev/QQ扔粪.gif",
        "/QQ伞": "https://qqemoji.pages.dev/QQ伞.gif",
        "/QQ沙发": "https://qqemoji.pages.dev/QQ沙发.gif",
        "/QQ扇脸": "https://qqemoji.pages.dev/QQ扇脸.gif",
        "/QQ帅": "https://qqemoji.pages.dev/QQ帅.gif",
        "/QQ哇哦": "https://qqemoji.pages.dev/QQ哇哦.gif",
        "/QQ下雨": "https://qqemoji.pages.dev/QQ下雨.gif",
        "/QQ香蕉": "https://qqemoji.pages.dev/QQ香蕉.gif",
        "/QQ享受": "https://qqemoji.pages.dev/QQ享受.gif",
        "/QQ信封": "https://qqemoji.pages.dev/QQ信封.gif",
        "/QQ熊猫": "https://qqemoji.pages.dev/QQ熊猫.gif",
        "/QQ右车头": "https://qqemoji.pages.dev/QQ右车头.gif",
        "/QQ云": "https://qqemoji.pages.dev/QQ云.gif",
        "/QQ左车头": "https://qqemoji.pages.dev/QQ左车头.gif",
        "/cy": "https://s21.ax1x.com/2024/05/05/pkAotn1.png",
        "/mgx": "https://z3.ax1x.com/2021/05/30/2VGyU1.png",
        "/oy": "https://z3.ax1x.com/2021/05/30/2VJ4zT.png",
        "/whl": "https://z3.ax1x.com/2021/05/30/2VJHeJ.png",
        "/tt": "https://z3.ax1x.com/2021/05/30/2VJIQU.png",
        "/banzz": "https://z3.ax1x.com/2021/05/30/2VJMPx.png",
        "/mdfq": "https://z3.ax1x.com/2021/05/30/2VJQG6.png",
        "/cs": "https://z3.ax1x.com/2021/05/30/2VJWiq.png",
        "/wul": "https://z3.ax1x.com/2021/05/30/2VJfJ0.png",
        "/lyj": "https://z3.ax1x.com/2021/05/30/2VJhWV.png",
        "/emm": "https://z3.ax1x.com/2021/05/30/2VJjW6.png",
        "/nkt": "https://z3.ax1x.com/2021/05/30/2VJrQS.png",
        "/cg": "https://z3.ax1x.com/2021/05/30/2VJxSK.png",
        "/zy": "https://z3.ax1x.com/2021/05/30/2VNIQf.png",
        "/nzqk": "https://z3.ax1x.com/2021/05/30/2VNQGq.png",
        "/qdqd": "https://z3.ax1x.com/2021/05/30/2VNTOS.png",
        "/bx": "https://z3.ax1x.com/2021/05/30/2VNbwQ.png",
        "/psj": "https://z3.ax1x.com/2021/05/30/2VNjWq.png",
        "/nqct": "https://z3.ax1x.com/2021/05/30/2VNlR0.png",
        "/na": "https://z3.ax1x.com/2021/05/30/2VNqoj.png",
        "/mjl": "https://z3.ax1x.com/2021/05/30/2VNuIs.png",
        "/hs": "https://z3.ax1x.com/2021/05/30/2VNzlV.png",
        "/wosl": "https://z3.ax1x.com/2021/05/30/2VUSyT.png",
        "/ybyb": "https://z3.ax1x.com/2021/05/30/2VUvAH.png",
        "/jl": "https://z3.ax1x.com/2021/05/30/2VY5tI.png",
        "/wyx": "https://z3.ax1x.com/2021/05/30/2VY8f0.png",
        "/ww": "https://z3.ax1x.com/2021/05/30/2VYiTA.png",
        "/hhd": "https://z3.ax1x.com/2021/05/30/2VYpOe.png",
        "/kx": "https://z3.ax1x.com/2021/05/30/2VYvAs.png",
        "/my": "https://z3.ax1x.com/2021/05/30/2VtGEd.png",
        "/cb": "https://z3.ax1x.com/2021/05/30/2Vtagf.png",
        "/mwbq": "https://z3.ax1x.com/2021/05/30/2Vtu36.png",
        "/gun": "https://z3.ax1x.com/2021/05/30/2VtyUs.png"
    };

    // 正则构建
    const sortedKeys = Object.keys(emojiMap).sort((a, b) => b.length - a.length);
    const keysPatternStr = sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|");
    // Group 1: URL, Group 2: Keywords
    const combinedPattern = new RegExp(`(https?:\\/\\/[^\\s]+)|(${keysPatternStr})`, "g");

    function replaceTextWithImage(textNode) {
        const text = textNode.nodeValue;

        // 1. 快速检查：如果连可能的字符都没有，直接跳过
        combinedPattern.lastIndex = 0;
        if (!combinedPattern.test(text)) return;

        // 2. 模拟运行，检查是否真的有“关键词”被匹配到
        // 如果只有 URL 而没有表情关键词，千万不能替换，否则会造成死循环
        combinedPattern.lastIndex = 0;
        let hasEmojiMatch = false;
        let tempMatch;
        while ((tempMatch = combinedPattern.exec(text)) !== null) {
            if (tempMatch[2]) { // Group 2 是表情关键词
                hasEmojiMatch = true;
                break;
            }
        }

        // 关键修复：如果没有表情需要替换（例如纯文本或只有URL），直接返回，不要触碰DOM
        if (!hasEmojiMatch) return;

        // 3. 确实有表情，开始构建 Fragment 进行替换
        combinedPattern.lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = combinedPattern.exec(text)) !== null) {
            const preText = text.substring(lastIndex, match.index);
            if (preText) fragment.appendChild(document.createTextNode(preText));

            if (match[1]) {
                // 是 URL，当做普通文本保留
                fragment.appendChild(document.createTextNode(match[1]));
            } else if (match[2]) {
                // 是表情，替换为图片
                const img = document.createElement('img');
                img.src = emojiMap[match[2]];
                img.style.maxHeight = '28px';
                img.style.verticalAlign = 'middle';
                img.style.margin = '0 2px';
                img.title = match[2];
                fragment.appendChild(img);
            }

            lastIndex = combinedPattern.lastIndex;
        }

        const postText = text.substring(lastIndex);
        if (postText) fragment.appendChild(document.createTextNode(postText));

        textNode.parentNode.replaceChild(fragment, textNode);
    }

    function traverseAndReplace(node) {
        if (node.nodeType === 1) { // Element
            const tagName = node.tagName.toUpperCase();
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'A'].includes(tagName) || node.isContentEditable) {
                return;
            }
            Array.from(node.childNodes).forEach(traverseAndReplace);
        } else if (node.nodeType === 3) { // Text
            if (node.parentNode && node.parentNode.tagName.toUpperCase() === 'A') return;
            replaceTextWithImage(node);
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                traverseAndReplace(node);
            });
        });
    });

    traverseAndReplace(document.body);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();