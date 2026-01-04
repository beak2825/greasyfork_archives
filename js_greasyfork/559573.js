// ==UserScript==
// @name         全网净化与拦截助手-终极优化版V4
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  精准匹配防误伤+强制渲染金句+模块化存储
// @author       Gemini Partner
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559573/%E5%85%A8%E7%BD%91%E5%87%80%E5%8C%96%E4%B8%8E%E6%8B%A6%E6%88%AA%E5%8A%A9%E6%89%8B-%E7%BB%88%E6%9E%81%E4%BC%98%E5%8C%96%E7%89%88V4.user.js
// @updateURL https://update.greasyfork.org/scripts/559573/%E5%85%A8%E7%BD%91%E5%87%80%E5%8C%96%E4%B8%8E%E6%8B%A6%E6%88%AA%E5%8A%A9%E6%89%8B-%E7%BB%88%E6%9E%81%E4%BC%98%E5%8C%96%E7%89%88V4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "block_domain_list_v4";
    
    // 基础黑名单（保持你原本的列表）
    const DEFAULT_BLACKLIST = [
        "yangdex.com", "mrfldh.com", "baozougif.com", "mmz.moe", "tom.ynydsm.com", "m.wmtxt.com",
        "m.changdusk.com", "sosadfun.net", "m.rmxs8.com", "wap.bxshuku.com",
        "m.fashuwx.com", "xiaomixiaoshuo.com", "pornhub", "1024z.cc", "phncdn.com",
        "p.eikuaitao.com", "m2.ddbiquge.cc", "m.wrshuw.com", "m.xuankuks.com",
        "m.xtxt99.com", "wap.baimoge.com", "img.ypqrgim.cn", "sydswxx.com",
        "dibaqu123.com", "wap.ddsge.com", "m.ucwxs.com", "m.ddshubao.cc",
        "m.heiyan.la", "ysiqmzfr.eileader.cn", "jj.shzpkc.cn", "hongqiao668.com",
        "lingyun-chain.com", "m.qududu.cc", "m.zaohuatu.com", "tesexiaoshuo.com",
        "xwbiquge.cc", "minguoqiren.info", "xvideos", "porn", "91short",
        "nineonebuf", "2xmzazd.cn", "nineone", "faloo.com", "aabqg520.com",
        "bstatic.pgpfp.com", "shushudu.com", "182135.com", "yandex.com",
        "mohvxrvd.xyz", "maihuo.org", "utezxmpb.xyz", "heiliao", "glb112.cc",
        "toutiaocc.com", "dqhevnpya9a75", "wvwvon.com", "lldh5.buzz", "lldh.top",
        "88ghl.live", "yxz2.huainani.cn", "gs5.fun", "ilebjy.com", "hlcg1.com",
        "obifixjub.tips", "jxz4k8.com", "hlsxzz.com", "911blw.net", "zpixtngk.xyz",
        "8ghl.me", "abh2g.cc", "pic.jfcskx.cn", "ibdy33.com", "3x5usfan.tips",
        "a1x.net", "mshu8.com", "biqge6.cc", "qishuta.org", "wap.bishige.com",
        "bqyd.cc", "91-av.com", "st10.gs2.fun", "yuzhaiw.cc", "biquge365.net",
        "m.cuhebook.com", "kanunu.info", "m.okbiq.com", "m.qidian.com",
        "sxxs.cc", "m.qidiansk.com", "m.dswang.org", "babynovel.com", "gua04.fun",
        "lyspzc.com.cn", "811765.com", "biqukan.co", "lxjhigzgg.com", "cgw10.cc",
        "hllrweg.2024ents.life", "tumblr.com", "52cg1.fit", "mrds1.life",
        "renqixiaoshuo.net", "zmhxs.com", "qozdwvjr.com", "dingdian666.com",
        "aixuwens.com", "fxxs2.com", "nongcunxsw.cc", "diyishu.cc", "51baoliao01.com",
        "hlw04.cc", "uukojlk.com", "cmdseacf.com", "nj1ssyiu.net", "ggxtnua.org",
        "smzaspg.org", "zvecvgl.com", "m.hbpas.org", "zrhvwdpq.com", "bi53.cc",
        "51cg1.com", "mshu88.com", "aguxs.com", "bxrwdyrb.com", "199833.xyz",
        "jrgtil.com", "m.ltxs520.net", "huangsexiaoshuo.net", "m.nilxs.com",
        "erifeng.com", "gugexs.com", "dubmmdpw.com", "aaccnn.com", "dmdbjywe.com",
        "mrds66.com", "doublejoy.cyou", "putaoks.com", "feifanks.com", "renqixiaoshuo.net",
        "n.cn", "shenmuxsw.cc", "qqdrjkjx.cc", "ihlw35.com", "tantanread.com",
        "nf8hlbk.com", "hlbk11.com", "lsxs.org", "hl23.co", "ranwennovel.com",
        "51bl3.me", "cloudfront.net", "jpbqg6.com", "cgw321.com", "w2.sn11a.cc",
        "juemm3.top", "mvll8.cc", "91blc.com", "fshlkq.jpds3.makeup", "ifxqgc.flsp2.homes",
        "eld.aavv9.com", "nvhai13.top", "mmzx12.cc", "lds15.cc"
    ];

    let blackList = GM_getValue(STORAGE_KEY, DEFAULT_BLACKLIST);

    const CONFIG = {
        cleanRules: {
            "yinxiang.com": ".sc-jWBwVP, .eBgsec, .sc-cMljjf, .sc-hSdWYo, img[src*='yx-icon@300.png']",
            "flomoapp.com": ".LaunchAppTop, .LaunchAppBottom",
            "weread.qq.com": ".wr_tabBar_item_App, .wr_tabBar",
            "jianshu.com": ".jianshu-header, img[src*='assets.xiaozuowen.net'], #jianshu-header",
            "zsxq.com": "app-header > .header-container, footer, .qrcode-container, .enter-group, #header, .user-info",
            "dedao.cn": ".iget-invoke-app-bar, .logo, .update-reminder"
        },
        alertQuotes: [
            "停下，去做那件你一直逃避的事。",
            "浏览的快乐是暂时的，把事做成的成就感才是长久的。",
            "现在偷的懒，都会变成日后焦虑的根源；<strong>关掉它，行动才是解药。</strong>",
            "你的时间很贵，别浪费在让你堕落的网页上；<strong>要么做，要么滚去做。</strong>",
            "你在小说和欲望里浪费的每一分钟，都是在给未来的焦虑铺路。",
            "屏蔽无用诱惑是顶级自律，先完成再完美是务实智慧。",
            "放纵的快感只有几秒，完成目标的底气却能撑很久。"
        ]
    };

    // ========== 菜单功能 ==========
    GM_registerMenuCommand("📌 拦截当前域名", () => {
        const host = window.location.hostname;
        if (!blackList.includes(host)) {
            blackList.push(host);
            GM_setValue(STORAGE_KEY, blackList);
            location.reload();
        }
    });

    GM_registerMenuCommand("🗑️ 重置黑名单", () => {
        GM_setValue(STORAGE_KEY, DEFAULT_BLACKLIST);
        location.reload();
    });

    // ========== 核心渲染 ==========
    function renderBlockPage() {
        window.stop();
        const quote = CONFIG.alertQuotes[Math.floor(Math.random() * CONFIG.alertQuotes.length)];
        const style = `
            <style>
                html, body { background: #e0e5ec !important; height: 100% !important; margin: 0 !important; overflow: hidden !important; }
                .container { height: 100vh; display: flex; justify-content: center; align-items: center; font-family: sans-serif; }
                .card { 
                    max-width: 80%; padding: 40px; border-radius: 30px; 
                    background: #e0e5ec; 
                    box-shadow: 20px 20px 60px #bec3c9, -20px -20px 60px #ffffff;
                    text-align: center;
                }
                .text { font-size: 1.5rem; color: #313b48; line-height: 1.6; margin-bottom: 20px; }
                .text strong { color: #e53e3e; }
                .timer { font-weight: bold; color: #e53e3e; font-size: 1.2rem; }
            </style>
        `;
        const content = `
            <div class="container">
                <div class="card">
                    <div class="text" id="quote">${quote}</div>
                    <div class="timer"> <span id="cd">10</span>s </div>
                </div>
            </div>
        `;
        document.documentElement.innerHTML = `<head><title>专注</title>${style}</head><body>${content}</body>`;

        let count = 10;
        setInterval(() => {
            count--;
            const cdEl = document.getElementById('cd');
            const quoteEl = document.getElementById('quote');
            if(cdEl) cdEl.textContent = count;
            if (count <= 0) {
                count = 10;
                if(quoteEl) quoteEl.innerHTML = CONFIG.alertQuotes[Math.floor(Math.random() * CONFIG.alertQuotes.length)];
            }
        }, 1000);
    }

    // ========== 核心判定 ==========
    const Engine = {
        isBlacklisted() {
            const host = window.location.hostname;
            return blackList.some(item => host === item || host.endsWith('.' + item));
        },
        applyClean() {
            const host = window.location.hostname;
            for (const [key, css] of Object.entries(CONFIG.cleanRules)) {
                if (host.includes(key)) GM_addStyle(`${css} { display: none !important; }`);
            }
        },
        init() {
            if (this.isBlacklisted()) {
                renderBlockPage();
            } else {
                this.applyClean();
            }
        }
    };

    Engine.init();
})();
