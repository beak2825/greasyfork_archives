// ==UserScript==
// @name         Yamibo 漫画阅读器
// @namespace    https://bbs.yamibo.com/
// @version      3.6.4
// @author       hitori酱
// @description  一键进入漫画阅读器，支持自动生成系列目录，智能匹配章节标题。
// @match        https://bbs.yamibo.com/thread-*
// @match        https://bbs.yamibo.com/forum.php?mod=viewthread&*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @connect      bbs.yamibo.com
// @require      https://cdn.jsdelivr.net/npm/localforage@1.10.0
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/cn2t.js
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/t2cn.js
// @run-at       document-start
// @noframes
// @license      MIT License
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB2AAAAdgB+lymcgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAr3SURBVHic7Zt7cNTVFcc/v32H7Ca72c2LhEcS5JFIgUB5JSioQCvKWOVRqSMjxAeoVaYKdapFaccq0OfUOlrKjLUUR1HGUstDMSIJRAyEAAnQvNk8NgnJPvLYTbK7v/6xyYbFZMluNgaK35nfzO7v3HvOud/fueeee3+70D9UwO8AEyDeoJcJ+C2g7G+Qgh8CtgM/Cw+TExsdToXRglSQMDpS56fL9QVTa4vY3tUpANuAjX218UdATZhKFl+R84QQawhHMW4bMWEaqjf8akicHQqYWm0k/+kV7M6uWiChrzYSP/1jDboRQqwhfGi8+xYQp47AMEINENtfG38E3BT4joDhdmC48R0Bw+3AcOM7AobbgeHGTU+ALFSKutwudpw6zq6z+Zy/bEIqSEiNjuPhKTNZPWUmUsHDtUt0c6SylANl5/m69hIV5ibMjnYANAol4/UxPHjrdB5Nn+uj3yW6eafwBH8vPEFxowmX6GaSIY6fTJ5BVvoc5BJpUH6HhIC6Vhv37n6Lk3VGj1KpR+2RqlKOVJWysyCP3Q+s5r1zp/h9XjZ1rTaf/nKZHIlEQmtbCzUtVkrarNw2dxa3dEhxuVw029u5//0dHDNW+OjPNZaTayznbwXH2ffg48SrIwL2fdAEdLld3sEbIvWkJqehVUcCYLaZOVdeRK6xnLF/fBm3KCIIAjG6GGKjYoiLjic+Jg6pzPP03KKb1rZWVEoVr+cXoteqOfT5J5ytrERERKfRcWtKGjqNZ0NmabVSVF7EyTojS997m2NrNgQcCYPOATsL8jhZZ0QfqWf25NnewQPoInRERUZ1D04kITqB+em3M/vWWSQlJDEytnfwABJBQoQ6AoVcAUCTpRWUGkREr76ewQNo1ZHMmTwbfaSe/NpL7CzIC9j/QROw62w+AGnJqUgEX3UF/z1NWXUZcpmc70+awfSJ6WhGaABQKBRIpNd+WtPT0lmUsRCVUkV5TTkFFwt8ByBISEtO9fElEAyagPOXTcikMrRqre/9ygsY642oFCpumzqPeEO8j1yp6veM4htIiE3gnvlLUI9QY2yo5nzlBR+5Vq1FJpVR1FgXsP+DJkAplSGKbm+YAjSYGygxlqCQK5gzeQ7hYb5bakEQkMvlAdnRhGtYnLkIlVJFibGEBnODVyYiIooiKllgOiEEBEyKjsPldtNsNQPgcrkoLDkDwJRx30Pj2Y9TWFLIsbPHAZDKpAhC71nMl19/SfZX2X3qP3z8MLmncgGIUEeQOT3To6/0DC6XC4BmqxmX20VqdFzA/g+agDVTZwNQVF6Ey+2iylSFvcPOyOiR3rDvcnZxqd5Im70NANlVT8poqqa2oe/wNdvMlFSV0tnVCcCouESSEpOwO+xUmqpwuV0UlRcBkDVtTsD+D5qA5anTWDD2FiytFnJO51BaUwbAhFHjvW2arE2IoohBawBAJhu42ThDHKIoYrps8t5LT52GIAiU1ZSRczoHS6uFO5PGsyx1asD+D5oAmUTCRyuyuCt5AtY2G44OB9HaaDThGm+bZptnehgi9R6jA8j+PYg1eMK6oal3zkeoIxgZE4+jw4G1zcbC5InsWb7WW20GgpDsBbSqMA49tJ6Vaekep6NifOTtDk/oq7vzgUQycLNajaeuaGlr8bk/ZuQYAFampXPwoXVoVWFB+R6yzZCAgLXDDoC++0n3oK271g9XeVaDQAjQqD2RdDUBMXoPyRaHHcHv4bZ/hGwzBHCuO5H1ZPseOJ1OAA7nfw7gswIA3gS3a98/+9XdbDX3KT/bUBu8w4SQgPauTmpsVgRBQB1+VZEjqPz2De//xY1fudPmpLbFSmtnB2rFwAurKxEyAsrNTYiIhCkVNOb7PilppCFUZnygHnsHbe0OKixNTI4ZGZSOkOWAcvNlAOyOTiy2Nl+h2x0qM16YLS20tTu6bTcFrSd0BFh6nTDWNvrIPj1ygi3bd+Lo6AxYb0dnF1u27+Q/n/nmleq63mWxrJv8YBDyCAD47NhpH9k/PtjP5q07WLT8GQqLSr336xubudxs8X5vMlsxNfQSeaa4lIXLfsrmrTvY/dEhH52Hsk94P1cMIgJCmgN68K/PvmLDmvu833+z8REKz1dwNK+QqQseJiE+GplUSlW1ibQJSZw7uguAjCWPc7H0EmMS43C6XNTUeSJpSto4tr38lI+9jw982Wvbch1FQLwmgtyTxZy7WOWVxeo05H3yFtteforUCUnUNzZTVW0iZWwCjz3cS9STax5gXFIiVdUm6hubSZ2QxNbNT5J3YAdxMb21xdnzZeSeOOM9AitrDp6AkESAiEilpZnoEWp+nrGQZw58yAvb32HfX3/pbaHAxXPrV/Hc+lU4nS5cbjdKhe+m6Oms5TydtZyOzi6kEgkyWd8l88ZX3sDtFnkhcxG/PnqQSkszblFEIgReEIUkAmpbbNidXSTp9DyaPpcx2ij2f5HPRwePeduITgeiy1MQyWTSbwz+SigV8n4Hv2dfNgc+z2NMZBRZ6XNI1unpcDmpabH02f5aCAkBPeGfojMQJpOz895VCILAmo1/4OyFSk8jEdztNhDF/hVdA8UXK1j77KsIgsDb9/yYMJmc5O4dZrCJMEQEeIwnaT3z9I6k8bw4bzGt7Q7ufXQLZy54jrNxu3G3twCBk1BYVMoPVm7A1tLGS/MWsyhlIgDJOo/NYJfCkEZAjzMAW+bfzePTM6g2Xea2lZu800F0duJuawkoEvbsyyZjyWMYaxt4Ynomr8y/2yvrsRlsMRTSCEjR+Za8by5ZwWt3LqXd3sGKp15j8eqXOF1cjujsxNVqQXR1+dVbfLGCFVkvsnztL2i3d7Ap4y7euHu5T5vkbpsVluAICMkq0LMOJ+l8t8ECApsy7mJaXCJP7v+Aw8cKmfmjDcxJn8TSO2exMHMqiaNGYoiLRZDIaDJbqa5t5NMjJ/h4/1GOfX0Gt1tkXFQ0f/7hMhanTPqG7cFOgZAQUGFuQiGVkhih7VO+KGUi59a9wJv5ObyZn0NufjG5+cVset0jVyk9L0KuLpXH62NYNyOTdTMyUUr7djVBo0UplQWdBENCQOboFEbI5X6PpJRSGc/Oms8zs24n51I52ZUl5Fwqp9pmpsnuOTBJ0ugYFakjY1QyC8beQubo5GsedkgEgVWTZ9Bkb/Pbrj+EhID3lz0y4LYCAvNGpzBvdEooTAOwc+mqoPve9L8PuOkJGPAUWLJgHNFNQ3OyM5wYMAF7/3I/vBvcsdP1jJt+CgyYgNUb/83T+/cMpS/DggETsHtfMXsvFA6lL8OC/+spUNNipbG9VQT6rZP9lVlOlVImnTROj7Wl44b8x0iNzUqH5xBmO/B8oP2dDP9/fgZ7uYGt+Fnt/EaAUiGXnjnyLuNTRl+LrOsOo6beR3VtgxPw+7sZvzkgJjrqhhx8IBhwIbT22Vf5IvfUUPoSUlz5gsUfBkxAfWMz5VWDexV9PcJvDhiVECu9VLD3GwJV4u1EaSTU7p3ncz98UTZqdQT1xZ+E2M3AEYocUH+5yUJdffDv3W4E+JsCu+yOjudTZi4T42P0PpHS2eUEFNdUvn7jdg5mB/773VCgOwdIgR1AVjA6lHj+clpDH2tsvF4plr2XId4z1yAumx8jGj+cJ45QSkVBEBpEy1GdaDmqUyrln/bV91u+9gcz+GvBoZRLxPAwqbvHUKRa5pZKBBGoHwqD1xscgChAF7AZeJ3eyvGmIOAL4AQw5Yp7s4BC4OPhcChY/A/fkn/A85DrtAAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/556075/Yamibo%20%E6%BC%AB%E7%94%BB%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556075/Yamibo%20%E6%BC%AB%E7%94%BB%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 旧版本缓存清理
  const currentVersion = GM_info.script.version;
  const lastVersion = GM_getValue("script_version", "0.0.0");
  if (currentVersion !== lastVersion) {
    console.log(`检测到脚本更新: 从 v${lastVersion} 更新到 v${currentVersion}`);
    const keys = GM_listValues();
    keys.forEach((key) => {
      if (key !== "script_version") {
        // 保留版本号字段
        GM_deleteValue(key);
      }
    });
    console.log("已清除旧版本缓存数据");
    GM_setValue("script_version", currentVersion);
  }

  // 静态常量预编译
  const EXCLUDE_WORDS_REGEX =
    /个人汉化|汉化组|汉化|个人翻译|個人翻譯|个汉|提灯喵|翻译|生肉|未翻译|填坑组|粮食组|保护协会|創作百合|创作百合|熟肉|字幕|工作室|社团|官方中字|出版|同人志|汉化工房|漫画屋|同好會|翻译组|汉化委员会|渣翻渣嵌|合作汉化|完结|连载|短篇|短篇合集|百合短篇合集|同人|raw|韩漫|杂志|英译|单行本|插画|特典|番外|外传|彩页|合订本|猫岛汉化组|和菓子漫画屋|大友同好會|透明声彩汉化组|最终|终章|序章|尾声/i;
  const FATAL_KEYWORDS_REGEX =
    /汉化|翻译|个人|组|工作室|社团|同人|英译|中字|生肉|raw|sample|合同志|填坑|粮食|发布|校对|嵌字|图源|扫图|合集|短篇|短篇集|连载/i;
  const BLOCK_IMG_REGEX =
    /\/uc_server\/data\/avatar\/|avatar|user_avatar|usericon|static\/image\/common\/|static\/image\/smiley\/|template\/|none\.gif|loading\.gif|logo\.png|logo\.gif|qq\.gif|qq_big\.gif|qq_group|userinfo\.gif|forumlink\.gif|online_admin|online_member|online_team|icon_quote|collapse|expand|rating|score|grade|star|magic/i;
  const NUM_CHAR = "[\\d①-⑳一二三四五六七八九十百千万零〇]";
  const NUM_RANGE_UNIT = `(?:${NUM_CHAR}|[-~—–])`;

  // 样式常量预编译
  const BUTTON_CSS = `
    /* === 入口按钮 === */
    #reader-toggle {
      position: fixed; top: 20%; right: 10px; transform: translateY(-50%);
      z-index: 99999; width: 60px; height: 60px; border-radius: 60px;
      background: white; border: none; cursor: pointer;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      display: flex; justify-content: center; align-items: center;
      transition: 0.5s;
      font-family: "IBM Plex Sans SC", "PingFang SC", "Microsoft YaHei", Arial, sans-serif !important;
    }
    #reader-toggle:hover { width: 180px; box-shadow: none; }

    /* 渐变背景层 */
    #reader-toggle::before, #reader-toggle::after {
      content: ""; position: absolute; border-radius: 40px;
      background: linear-gradient(45deg, #56CCF2, #2F80ED); opacity: 0; transition: 0.5s;
    }
    #reader-toggle::before { inset: 0; }
    #reader-toggle::after { top: 10px; width: 100%; height: 100%; filter: blur(15px); z-index: -1; }

    #reader-toggle:hover::before { opacity: 1; }
    #reader-toggle:hover::after { opacity: 0.5; }

    /* 图标与文字 */
    #reader-toggle .icon {
      position: absolute; left: 0; top: 0; width: 60px; height: 60px;
      display: flex; align-items: center; justify-content: center;
      font-size: 2em; color: #777; transition: 0.5s;
    }
    #reader-toggle .icon ion-icon { width: 24px; height: 24px; }

    #reader-toggle .title {
      position: absolute; color: #fff; font-size: 1.4em; letter-spacing: 0.1em;
      transform: scale(0); transition: 0.5s;
    }

    #reader-toggle:hover .icon { transform: scale(0); }
    #reader-toggle:hover .title { transform: scale(1); transition-delay: 0.2s; }

    /* === 目录侧边栏 === */
    #directory-sidebar {
      position: fixed; top: 0; right: -400px; width: 400px; height: 100%;
      background: #1e293b; /* 纯色性能更好，且配合阅读器暗色 */
      z-index: 2147483647; transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: -15px 0 40px rgba(0,0,0,0.4);
      display: flex; flex-direction: column; color: white; border: none;
    }
    #directory-sidebar.open { right: 0; }

    /* 侧边栏头部 */
    #directory-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 15px 20px; border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    #directory-title { font-size: 16px; font-weight: 600; letter-spacing: 0.5px; }
    #directory-close {
      background: rgba(255,255,255,0.1); border: none; color: white; cursor: pointer;
      width: 32px; height: 32px; border-radius: 6px; font-size: 18px;
      display: flex; align-items: center; justify-content: center; transition: 0.2s;
    }
    #directory-close:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }

    /* 目录列表内容 */
    #directory-content {
      flex: 1; overflow-y: auto; padding: 10px 0;
      scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent;
    }
    #directory-content::-webkit-scrollbar { width: 6px; }
    #directory-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 3px; }

    #directory-list { list-style: none; padding: 0 16px; margin: 0; }

    .directory-item {
      display: block; padding: 12px 16px; margin-bottom: 8px;
      background: rgba(255,255,255,0.05); border-radius: 8px;
      color: rgba(255,255,255,0.8); text-decoration: none !important;
      font-size: 14px; transition: all 0.2s; cursor: pointer; position: relative; overflow: hidden;
    }

    /* 悬停高亮 */
    .directory-item:hover {
      background: rgba(255,255,255,0.1); color: #fff; transform: translateX(5px);
    }
    /* 当前章节 */
    .directory-item.current {
      background: linear-gradient(135deg, #FF6B6B, #FF8E53);
      color: white; font-weight: 600; box-shadow: 0 4px 12px rgba(255,107,107,0.3);
    }
    /* 主楼特殊样式 */
    .directory-item.mainpost { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; }

    /* 状态提示 */
    #directory-loading, #directory-empty {
      text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.6); font-size: 15px;
    }
    #directory-loading::before { content: '📚'; display: block; font-size: 32px; margin-bottom: 10px; animation: pulse 1.5s infinite; }
    #directory-empty::before { content: '📖'; display: block; font-size: 32px; margin-bottom: 10px; opacity: 0.5; }
    @keyframes pulse { 50% { opacity: 0.6; } }

    /* === 遮罩层 === */
    #directory-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.6); z-index: 2147483646;
      opacity: 0; visibility: hidden; transition: 0.3s; backdrop-filter: blur(2px);
    }
    #directory-overlay.show { opacity: 1; visibility: visible; }
`;
  const READER_CSS = `
    /* === 全局基础 === */
    html, body {
    margin: 0;
    padding: 0;
    background: #616161;
    overflow-y: auto;
    color: #fff;
    font-family: "IBM Plex Sans SC", "PingFang SC", "Microsoft YaHei", Arial, sans-serif !important;
    }
    body {
  --img-width: 35vw;
}
body.light-bg {
  background: #f5f5f5 !important;
  color: #222 !important;
}
body.light-bg #cw-title-bar {
  color: #222 !important;
}
   /* === 图片容器 === */
    #cw-container {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      padding: 20px 0 60px !important;
      gap: 20px !important;
      margin: 0 auto !important;
      will-change: transform;
    }

    #cw-title-bar {
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 0;
  padding-left: 0;
  font-size: 1.25em;
  font-weight: bold;
  font-family: "IBM Plex Sans SC", "PingFang SC", "Microsoft YaHei", Arial, sans-serif !important;
  color: #fff;
  background: none;
  border: none;
  border-radius: 0;
  text-align: left;
  letter-spacing: 0.04em;
  box-shadow: none;
  position: relative;
  z-index: 1;
  user-select: text;
  word-break: break-all;
  width: fit-content;
  max-width: 100vw;
  transition: color 0.3s;
}

    #cw-container img {
      display: block !important;
       width: var(--img-width) !important;
      height: auto !important;
      content-visibility: auto !important;
      contain-intrinsic-size: var(--img-width, 35vw) calc(var(--img-width, 35vw) * 1.5) !important;
      min-height: 650px !important;
      
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;

      background-color: #e0e0e0 !important;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23999999'%3E图片加载中……%3C/text%3E%3C/svg%3E") !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
      background-size: contain !important;
      border-radius: 0 !important;
      user-select: none !important;
      margin: 0 auto !important;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    #cw-container img.loaded {
      background-image: none !important; 
      background-color: transparent !important;
      min-height: 0 !important;}
    #cw-container img[data-original-size="small"] {
      width: auto !important;
      max-width: var(--img-width, 35vw) !important;
      aspect-ratio: auto !important; /* 小图可能不是漫画页，重置比例 */
    }
    /* === 悬浮控件基础 (退出/刷新/工具栏/底部栏) === */
    #cw-exit, #cw-refresh, #cw-toolbar, #cw-bottom-bar {
        position: fixed; z-index: 2147483647; pointer-events: auto;
    }

    /* 左上退出与刷新 */
    #cw-exit {
      top: 15px; left: 20px; background: rgba(0,0,0,0.6); color: #fff; border: none;
      padding: 6px 10px; border-radius: 5px; cursor: pointer; font-size: 14px; backdrop-filter: blur(4px);
    }
    #cw-refresh {
      position: fixed; top: 65px; left: 20px; z-index: 2147483647; background: rgba(0,0,0,0.6); color: #fff; border: none;
      padding: 6px 10px; width: 32px; text-align: center; border-radius: 5px; cursor: pointer; font-size: 14px; backdrop-filter: blur(4px);
      transition: 0.2s;
    }
    #cw-refresh:hover { background: rgba(0,0,0,0.8); transform: scale(1.05); }
    /* 右上工具栏 */
    #cw-toolbar { top: 15px; right: 20px; display: flex; flex-direction: column; gap: 10px; }

    /* 底部栏 */
    #cw-bottom-bar {
      bottom: 15px; right: 20px; left: auto !important; width: auto;
      display: flex; align-items: center; gap: 15px;
      background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 5px;
      font-size: 14px; backdrop-filter: blur(4px); white-space: nowrap;
      z-index: 2147483650; /* 最高层级 */
    }

    /* 通用按钮样式 */
    #cw-toolbar button, #cw-bottom-bar button {
        color: #fff; border: none; cursor: pointer; transition: 0.2s;
        display: flex; align-items: center; justify-content: center;
    }
    #cw-toolbar button {
        background: rgba(0,0,0,0.6); padding: 6px; width: 32px; height: 32px;
        border-radius: 5px; font-size: 14px; backdrop-filter: blur(4px);
    }
    #cw-bottom-bar button {
        background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 3px; font-size: 12px;
    }

    /* 悬停效果 */
    #cw-toolbar button:hover { background: rgba(0,0,0,0.8); transform: scale(1.05); }
    #cw-bottom-bar button:hover { background: rgba(255,255,255,0.3); }

    /* 缩放组 */
    #cw-zoom { display: flex; flex-direction: column; gap: 5px; }
    #cw-zoom-in, #cw-zoom-out { font-size: 20px !important; font-weight: bold !important; }
    #cw-full[data-fullscreen="true"] { font-size: 24px !important; line-height: 1; }
    #cw-page-info { font-weight: bold; color: #fff; }

    /* === 全屏模式 === */
    /* 合并全屏选择器 */
    :is(:fullscreen, :-webkit-full-screen) #cw-toolbar, 
    :is(:fullscreen, :-webkit-full-screen) #cw-exit, 
    :is(:fullscreen, :-webkit-full-screen) #cw-refresh { opacity: 0; pointer-events: none; transition: 0.3s; }
    :is(:fullscreen, :-webkit-full-screen).tools-visible #cw-toolbar, 
    :is(:fullscreen, :-webkit-full-screen).tools-visible #cw-exit, 
    :is(:fullscreen, :-webkit-full-screen).tools-visible #cw-refresh { opacity: 1; pointer-events: auto; }
    /* 全屏下提高 Tooltip 层级 */
    :is(:fullscreen, :-webkit-full-screen) [data-tooltip]:hover::after,
    :is(:fullscreen, :-webkit-full-screen) [data-tooltip]:hover::before {
        z-index: 2147483649 !important;
    }

    /* === Tooltip  === */
    @keyframes tooltipFadeIn { from { opacity: 0; transform: translate(-50%, 5px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes tooltipFadeInRight { from { opacity: 0; transform: translate(5px, -50%); } to { opacity: 1; transform: translate(0, -50%); } }

    [data-tooltip] { position: relative; overflow: visible !important; }

    /* 共有样式 */
    [data-tooltip]:hover::after {
        content: attr(data-tooltip); position: absolute;
        background: rgba(0,0,0,0.9); color: #fff; padding: 6px 10px;
        border-radius: 4px; font-size: 12px; white-space: nowrap;
        z-index: 2147483648; pointer-events: none; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        opacity: 0;
    }
    [data-tooltip]:hover::before {
        content: ''; position: absolute; z-index: 2147483648; pointer-events: none; opacity: 0;
        border: 6px solid transparent;
    }

    /* 1. 退出按钮随工具栏统一样式显示 */

    /* 2. 左侧显示 (右上工具栏) */
    #cw-toolbar [data-tooltip]:hover::after {
        top: 50%; right: 100%; transform: translateY(-50%); margin-right: 10px;
        animation: tooltipFadeInRight 0.2s ease forwards;
    }
    #cw-toolbar [data-tooltip]:hover::before {
        top: 50%; right: 100%; transform: translateY(-50%); margin-right: -2px;
        border-left-color: rgba(0,0,0,0.9); animation: tooltipFadeInRight 0.2s ease forwards;
    }

    /* 2.a 退出与刷新按钮在右侧显示 */
    #cw-exit[data-tooltip]:hover::after,
    #cw-refresh[data-tooltip]:hover::after {
        top: 50%; left: 100%; transform: translateY(-50%); margin-left: 10px;
        animation: tooltipFadeInRight 0.2s ease forwards;
    }
    #cw-exit[data-tooltip]:hover::before,
    #cw-refresh[data-tooltip]:hover::before {
        top: 50%; left: 100%; transform: translateY(-50%); margin-left: -2px;
        border-right-color: rgba(0,0,0,0.9); animation: tooltipFadeInRight 0.2s ease forwards;
    }

    /* 3. 上方显示 (底部栏) */
    #cw-bottom-bar [data-tooltip]:hover::after {
        bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 10px;
        animation: tooltipFadeIn 0.2s ease forwards;
    }
    #cw-bottom-bar [data-tooltip]:hover::before {
        bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: -2px;
        border-top-color: rgba(0,0,0,0.9); animation: tooltipFadeIn 0.2s ease forwards;
    }
`;

  // 阅读器全局变量定义
  let isReading = false;
  let images = [];
  let bgIsBlack = true;
  let zoomLevel = 35; // 默认缩放比例35%
  let autoReaderEnabled = false; // 全局阅读器开关

  // 目录识别相关变量
  let seriesDirectory = [];
  let currentSeriesKey = "";
  let isDirectoryMode = false;
  let savedThreadTitle = "";
  let originalSeriesTitle = "";
  let searchCache = new Map();
  let directoryMemoryCache = new Map();

  // 保存原始页面HTML
  let readerStartUrl = ""; // 记录进入阅读器时的 URL
  let originalPageHTML = "";
  let originalPageTitle = "";

  // 事件处理与状态
  let readerEventHandlers = {};
  let readerEventsBound = false;
  let readerToolsTimer = null;
  let unbindReaderEvents = null;

  // 缓存前缀与过期时长
  const CACHE_PREFIX = "yamibo-directory-cache-";
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

  // 持久化缓存索引键
  const GM_INDEX_KEY = CACHE_PREFIX + "gm-index";

  // 通用存储封装
  function storageGet(key, defaultVal = null) {
    try {
      if (typeof GM_getValue === "function") {
        let val;
        try {
          val = GM_getValue(key, undefined);
        } catch (e) {
          val = undefined;
        }
        if (val === undefined) {
        } else if (val === null) {
          return defaultVal;
        } else if (typeof val === "string") {
          try {
            return JSON.parse(val);
          } catch (e) {
            return val;
          }
        } else {
          return val;
        }
      }
    } catch (e) {}

    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  function storageSet(key, value) {
    try {
      if (typeof GM_setValue === "function") {
        try {
          GM_setValue(key, value);
        } catch (e) {
          try {
            GM_setValue(key, JSON.stringify(value));
          } catch (ee) {
            throw ee;
          }
        }

        try {
          let idx = GM_getValue(GM_INDEX_KEY, undefined);
          if (idx === undefined || idx === null) idx = [];
          if (typeof idx === "string") {
            try {
              idx = JSON.parse(idx);
            } catch (e) {
              idx = [];
            }
          }
          if (!Array.isArray(idx)) idx = [];
          if (!idx.includes(key)) {
            idx.push(key);
            GM_setValue(GM_INDEX_KEY, idx);
          }
        } catch (e) {}
        return true;
      }
    } catch (e) {}

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("⚠️ storageSet 失败:", e);
      return false;
    }
  }

  function storageRemove(key) {
    try {
      if (typeof GM_deleteValue === "function") {
        try {
          GM_deleteValue(key);
        } catch (e) {
          try {
            GM_setValue(key, null);
          } catch (ee) {}
        }

        try {
          let idx = GM_getValue(GM_INDEX_KEY, undefined);
          if (typeof idx === "string") {
            try {
              idx = JSON.parse(idx);
            } catch (e) {
              idx = [];
            }
          }
          if (!Array.isArray(idx)) idx = [];
          const newIdx = idx.filter((k) => k !== key);
          GM_setValue(GM_INDEX_KEY, newIdx);
        } catch (e) {}

        return true;
      }
    } catch (e) {}

    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  // 清理过期缓存：同时支持 sessionStorage 前缀与 GM 索引
  function cleanExpiredCache() {
    let cleanedCount = 0;

    // 1) 清理 sessionStorage 前缀缓存
    try {
      const sKeys = Object.keys(sessionStorage).filter((k) =>
        k.startsWith(CACHE_PREFIX)
      );
      sKeys.forEach((key) => {
        try {
          const raw = sessionStorage.getItem(key);
          if (!raw) return;
          const obj = JSON.parse(raw);
          const ts = obj.ts || obj.timestamp || 0;
          if (Date.now() - ts > CACHE_EXPIRY) {
            sessionStorage.removeItem(key);
            cleanedCount++;
          }
        } catch (e) {
          try {
            sessionStorage.removeItem(key);
            cleanedCount++;
          } catch (ee) {}
        }
      });
    } catch (e) {}

    // 2) 清理 GM_* 存储（使用索引枚举）
    try {
      if (
        typeof GM_getValue === "function" &&
        typeof GM_setValue === "function"
      ) {
        let idx = GM_getValue(GM_INDEX_KEY, undefined);
        if (typeof idx === "string") {
          try {
            idx = JSON.parse(idx);
          } catch (e) {
            idx = [];
          }
        }
        if (!Array.isArray(idx)) idx = [];

        const remaining = [];
        for (const key of idx) {
          try {
            const stored = storageGet(key, null);
            if (!stored) continue;
            const ts = stored.ts || stored.timestamp || 0;
            if (Date.now() - ts > CACHE_EXPIRY) {
              storageRemove(key);
              cleanedCount++;
            } else {
              remaining.push(key);
            }
          } catch (e) {
            try {
              storageRemove(key);
              cleanedCount++;
            } catch (ee) {}
          }
        }

        // 更新索引为剩余项
        try {
          GM_setValue(GM_INDEX_KEY, remaining);
        } catch (e) {}
      }
    } catch (e) {}

    if (cleanedCount > 0)
      console.log("🧹 清理了", cleanedCount, "个过期缓存 (session+GM)");
    return cleanedCount;
  }

  // 在配额不足或需要收缩时清理最旧的缓存（同时支持 sessionStorage 与 GM）
  function cleanOldestCache() {
    try {
      const entries = [];

      // 收集 sessionStorage 条目
      try {
        Object.keys(sessionStorage).forEach((key) => {
          if (!key.startsWith(CACHE_PREFIX)) return;
          try {
            const obj = JSON.parse(sessionStorage.getItem(key));
            const ts = obj.ts || obj.timestamp || 0;
            entries.push({ key, ts, source: "session" });
          } catch (e) {
            entries.push({ key, ts: 0, source: "session" });
          }
        });
      } catch (e) {}

      // 收集 GM_* 条目 via index
      try {
        if (typeof GM_getValue === "function") {
          let idx = GM_getValue(GM_INDEX_KEY, undefined);
          if (typeof idx === "string") {
            try {
              idx = JSON.parse(idx);
            } catch (e) {
              idx = [];
            }
          }
          if (!Array.isArray(idx)) idx = [];

          for (const key of idx) {
            try {
              const stored = storageGet(key, null);
              const ts = stored ? stored.ts || stored.timestamp || 0 : 0;
              entries.push({ key, ts, source: "gm" });
            } catch (e) {
              entries.push({ key, ts: 0, source: "gm" });
            }
          }
        }
      } catch (e) {}

      if (entries.length === 0) return 0;

      // 按时间戳排序，最旧的在前
      entries.sort((a, b) => (a.ts || 0) - (b.ts || 0));

      const toDelete = Math.ceil(entries.length / 2);
      for (let i = 0; i < toDelete; i++) {
        const e = entries[i];
        try {
          if (e.source === "session") sessionStorage.removeItem(e.key);
          else storageRemove(e.key);
        } catch (err) {}
      }

      return toDelete;
    } catch (e) {
      console.warn("cleanOldestCache failed", e);
      return 0;
    }
  }

  // === 全局搜索限流控制器 ===
  // 防止

  const SEARCH_INTERVAL_MS = 12000; // 限制间隔 12 秒 (论坛限制 10 秒，留 2 秒缓冲)
  const MAX_WAIT_TIME = 60000; // 最大等待时间 60 秒，超过则放弃排队

  /**
   * 安全的搜索请求包装器
   * @param {Function} requestFn - 真正执行请求的函数，需要返回 Promise
   * @returns {Promise<any>}
   */
  async function safeSearchRequest(requestFn) {
    let lastTime = 0;
    try {
      if (typeof GM_getValue === "function") {
        lastTime = GM_getValue("last_search_time", 0);
      } else {
        lastTime = parseInt(
          localStorage.getItem("yamibo_last_search_time") || "0"
        );
      }
    } catch (e) {
      lastTime = 0;
    }

    const now = Date.now();
    let waitTime = 0;

    // 计算需要等待的时间
    if (now - lastTime < SEARCH_INTERVAL_MS) {
      waitTime = SEARCH_INTERVAL_MS - (now - lastTime);
      // 添加随机抖动
      waitTime += Math.random() * 1000;
    }

    // 异常等待时间重置
    if (waitTime > MAX_WAIT_TIME) {
      console.warn(`[限流] 等待时间过长 (${waitTime}ms)，重置计时器`);
      waitTime = 1000;
    }

    // 执行等待 (静默模式)
    if (waitTime > 0) {
      console.log(
        `[限流] 搜索请求过于频繁，后台静默排队 ${(waitTime / 1000).toFixed(
          1
        )} 秒...`
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    // 更新全局时间戳 (抢锁)
    try {
      const newNow = Date.now();
      if (typeof GM_setValue === "function") {
        GM_setValue("last_search_time", newNow);
      } else {
        localStorage.setItem("yamibo_last_search_time", newNow.toString());
      }
    } catch (e) {
      console.error("[限流] 更新时间戳失败", e);
    }

    // 执行真正的请求
    return await requestFn();
  }

  // 检查是否启用了全局阅读器模式
  function checkAutoReaderStatus() {
    const stored = localStorage.getItem("yamibo-auto-reader");
    return stored === "true";
  }

  // 设置全局阅读器模式
  function setAutoReaderStatus(enabled) {
    autoReaderEnabled = enabled;
    localStorage.setItem("yamibo-auto-reader", enabled.toString());
    console.log("🔧 全局阅读器模式:", enabled ? "开启" : "关闭");
  }

  /*** 标题标准化函数  ***/
  function normalizeSeriesTitle(rawTitle) {
    if (!rawTitle) return "";

    // 首先清理页面title的后缀
    let title = rawTitle;
    if (title.includes(" - ")) {
      title = title.split(" - ")[0].trim();
    }

    // 移除页数标注
    title = title.replace(/[（(]\s*\d+\s*p\s*[）)]\s*$/i, "");

    // 移除章节标识 - 参考脚本的模式
    title = title.replace(
      /第[\d一二三四五六七八九十百千万〇零兩两1234567890\.]+[话話章节節回卷篇]/gi,
      " "
    );
    title = title.replace(/\d+(?:\.\d+)?\s*[话話章节節回卷篇]/gi, " ");
    title = title.replace(
      /\d+(?:\.\d+)?\s*[上下前后前後左右中篇部卷期全完]+(?:\s*[+＋&和及與并並,，/]\s*[上下前后前後左右中篇部卷期全完]+)+/gi,
      " "
    );
    title = title.replace(
      /[（(][上下前后前後中全完]+(?:\s*[,，+＋&和及與并並/]\s*[上下前后前後中全完]+)*[）)]/g,
      " "
    );
    title = title.replace(
      /\d+(?:\.\d+)?\s*[上下前后前後左右中篇部卷期全完]+/gi,
      " "
    );
    title = title.replace(
      /(?:\s+|[-‐‑‒–—―－~～·•_、:：])?\d+(?:\.\d+)*(?:\s*[上下前后前後左右中篇部卷期話话节節全完])?\s*$/g,
      " "
    );
    title = title.replace(/[-－—–~～\u2013\u2014\s]+$/g, " ");
    title = title.replace(/[\[\]【】（）()]/g, " ");
    title = title.replace(/\s+/g, " ").trim();

    if (!title) {
      return rawTitle.trim();
    }
    return title;
  }

  function buildSeriesKey(title) {
    const normalized = normalizeSeriesTitle(title || "");
    const base = normalized || (title || "").trim();
    return base.toLowerCase();
  }

  function generateSeriesKey(title) {
    try {
      const k = buildSeriesKey(title || "");
      // 限制长度并移除特殊字符，避免存储键过长或包含非法字符
      return k.replace(/[\s\/:\\#\?&=\+%\*\|<>"'`]/g, "-").substring(0, 120);
    } catch (e) {
      return String(title || "")
        .toLowerCase()
        .substring(0, 120);
    }
  }

  // 统一的排除词汇列表，避免重复定义
  const EXCLUDE_WORDS = [
    "个人汉化",
    "汉化组",
    "汉化",
    "个人翻译",
    "個人翻譯",
    "个汉",
    "翻译",
    "生肉",
    "未翻译",
    "填坑组",
    "粮食组",
    "保护协会",
    "創作百合",
    "创作百合",
    "熟肉",
    "字幕",
    "工作室",
    "提灯喵",
    "社团",
    "官方中字",
    "出版",
    "汉化工房",
    "猫岛汉化组",
    "和菓子漫画屋",
    "大友同好會",
    "透明声彩汉化组",
    "翻译组",
    "汉化委员会",
    "渣翻渣嵌",
    "合作汉化",
    "完结",
    "连载",
    "短篇",
    "合集",
    "同人",
    "raw",
    "韩漫",
    "杂志",
    "英译",
    "单行本",
    "插画",
    "特典",
    "番外",
    "外传",
    "彩页",
    "合订本",
  ].map((s) => s.toLowerCase());

  // 统一的文本过滤函数：检查是否为噪音词汇
  function isNoiseText(text) {
    if (!text || typeof text !== "string") return true;
    // [优化] 直接使用预编译正则，替代循环 includes
    if (EXCLUDE_WORDS_REGEX.test(text)) return true;

    // 常见格式判断：纯数字视为噪音
    if (/^\d+$/.test(text)) return true;

    // 智能长度检查
    const hasCJK =
      /[\u4e00-\u9fa5\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/.test(text);
    const minLength = hasCJK ? 2 : 3;
    if (text.length < minLength) return true;

    return false;
  }

  // 保持向后兼容的 isGenericTag 函数
  function isGenericTag(text) {
    return isNoiseText(text);
  }

  function getCachedDirectory(seriesKey) {
    // 🚫 临时禁用缓存读取，强制测试双语解析逻辑
    console.log("🔄 缓存读取已禁用，将执行新的双语解析逻辑");
    return null;

    if (!seriesKey) return null;

    // 1) 先检查内存缓存
    try {
      if (directoryMemoryCache && directoryMemoryCache.has(seriesKey)) {
        const cached = directoryMemoryCache.get(seriesKey);
        if (cached && cached.ts && Date.now() - cached.ts < CACHE_EXPIRY) {
          return cached.data || cached.d || null;
        } else {
          directoryMemoryCache.delete(seriesKey);
        }
      }
    } catch (e) {}

    const key = CACHE_PREFIX + seriesKey;

    // 2) 尝试 GM_getValue
    try {
      if (typeof GM_getValue === "function") {
        let stored = GM_getValue(key, undefined);
        if (typeof stored === "string") {
          try {
            stored = JSON.parse(stored);
          } catch (e) {
            /* leave as-is */
          }
        }
        if (stored && (stored.d || stored.data)) {
          const ts = stored.ts || stored.timestamp || 0;
          if (Date.now() - ts < CACHE_EXPIRY) {
            try {
              directoryMemoryCache.set(seriesKey, {
                d: stored.d || stored.data,
                data: stored.d || stored.data,
                ts: ts || Date.now(),
              });
            } catch (e) {}
            return stored.d || stored.data;
          } else {
            try {
              storageRemove(key);
            } catch (e) {}
            return null;
          }
        }
      }
    } catch (e) {}

    // 3) 尝试 sessionStorage
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        let obj = raw;
        try {
          obj = JSON.parse(raw);
        } catch (e) {
          obj = raw;
        }
        if (obj && (obj.d || obj.data)) {
          const ts = obj.ts || obj.timestamp || 0;
          if (Date.now() - ts < CACHE_EXPIRY) {
            try {
              directoryMemoryCache.set(seriesKey, {
                d: obj.d || obj.data,
                data: obj.d || obj.data,
                ts: ts || Date.now(),
              });
            } catch (e) {}
            return obj.d || obj.data;
          } else {
            try {
              sessionStorage.removeItem(key);
            } catch (e) {}
            return null;
          }
        }
      }
    } catch (e) {}

    return null;
  }

  function setCachedDirectory(seriesKey, directory) {
    if (!seriesKey || !directory) return false;
    const key = CACHE_PREFIX + seriesKey;
    const payload = { ts: Date.now(), data: directory, d: directory };

    try {
      directoryMemoryCache.set(seriesKey, {
        d: directory,
        data: directory,
        ts: payload.ts,
      });
    } catch (e) {}

    try {
      if (typeof GM_setValue === "function") {
        try {
          GM_setValue(key, payload);
        } catch (e) {
          try {
            GM_setValue(key, JSON.stringify(payload));
          } catch (ee) {
            /* ignore */
          }
        }
        return true;
      }
    } catch (e) {}

    try {
      sessionStorage.setItem(key, JSON.stringify(payload));
      return true;
    } catch (e) {
      console.warn("⚠️ setCachedDirectory 写入失败:", e);
      return false;
    }
  }

  /*** 相似度计算辅助函数  ***/

  // 简繁体标准化函数 - 使用 OpenCC 库
  let converter = null;

  function normalizeChineseVariants(text) {
    try {
      // 初始化转换器（繁体转简体）
      if (!converter && typeof OpenCC !== "undefined") {
        converter = OpenCC.Converter({ from: "tw", to: "cn" });
      }

      if (converter) {
        return converter(text);
      }

      return text;
    } catch (error) {
      console.warn("简繁转换失败，使用原文本:", error);
      return text;
    }
  }
  //中外语种统一判断
  function isForeignText(str) {
    return (
      /[A-Za-z\u3040-\u30FF\uAC00-\uD7AF]/.test(str) &&
      !/[\u4e00-\u9fa5]/.test(str)
    );
  }
  // 提取有意义的关键词（排除常见无关词汇）
  function extractMeaningfulKeywords(title) {
    const core = extractCoreWorkName(title);
    if (typeof core === "object" && core._dualLanguage) {
      return [core._dualLanguage.chinese, core._dualLanguage.foreign].filter(
        Boolean
      );
    }
    if (Array.isArray(core)) {
      return core.filter(Boolean);
    }
    return [core.toString().trim()];
  }
  // 生成搜索关键词
  function generateSearchTerms(seriesTitle) {
    if (!seriesTitle) return [];
    const core = extractCoreWorkName(seriesTitle);
    if (typeof core === "object" && core._dualLanguage) {
      return [core._dualLanguage.foreign, core._dualLanguage.chinese].filter(
        Boolean
      );
    }
    if (Array.isArray(core)) {
      return core.filter(Boolean);
    }
    return [core.toString().trim()];
  }

  // 计算核心作品名相似度
  function calculateCoreWorkSimilarity(core1, core2) {
    const arr1 = Array.isArray(core1) ? core1 : [core1];
    const arr2 = Array.isArray(core2) ? core2 : [core2];
    let maxScore = 0;
    for (const s1 of arr1) {
      for (const s2 of arr2) {
        const a = s1.toString().trim().toLowerCase();
        const b = s2.toString().trim().toLowerCase();
        if (!a || !b) continue;
        if (a === b) return 1.0;
        if (a.includes(b) || b.includes(a)) {
          const longer = a.length > b.length ? a : b;
          const shorter = a.length <= b.length ? a : b;
          maxScore = Math.max(
            maxScore,
            (shorter.length / longer.length) * 0.95
          );
        }
        // 最长公共子串
        let maxCommonLength = 0;
        for (let i = 0; i < a.length; i++) {
          for (let j = 0; j < b.length; j++) {
            let commonLength = 0;
            while (
              i + commonLength < a.length &&
              j + commonLength < b.length &&
              a[i + commonLength] === b[j + commonLength]
            ) {
              commonLength++;
            }
            maxCommonLength = Math.max(maxCommonLength, commonLength);
          }
        }
        const minLength = Math.min(a.length, b.length);
        if (maxCommonLength >= 4) {
          const similarity = (maxCommonLength / minLength) * 0.9;
          maxScore = Math.max(maxScore, similarity);
        }
      }
    }
    return maxScore;
  }

  // 检查关键词匹配（排除翻译组等无关信息）
  function checkKeywordMatch(core1, core2) {
    const kws1 = extractMeaningfulKeywords(core1);
    const kws2 = extractMeaningfulKeywords(core2);
    let bestMatch = 0;
    for (const kw1 of kws1) {
      for (const kw2 of kws2) {
        if (kw1.length >= 2 && kw2.length >= 2) {
          if (kw1 === kw2) {
            return 0.95;
          } else if (kw1.includes(kw2) || kw2.includes(kw1)) {
            const longer = kw1.length > kw2.length ? kw1 : kw2;
            const shorter = kw1.length <= kw2.length ? kw1 : kw2;
            const match = shorter.length / longer.length;
            bestMatch = Math.max(bestMatch, match * 0.9);
          }
        }
      }
    }
    return bestMatch;
  }

  // 提取核心作品名
  function extractCoreWorkName(title) {
    console.log(`   🔍 重构版标题处理: "${title}"`);
    if (!title || typeof title !== "string") return "";

    // === 0. 引用全局噪音 ===

    function getScriptType(str) {
      const hasKana = /[\u3040-\u30FF]/.test(str);
      const hasHanzi = /[\u4e00-\u9fa5]/.test(str);
      const hasLatin = /[a-zA-Z]/.test(str);
      const hasKorean = /[\uAC00-\uD7AF]/.test(str);
      if (hasKorean) return "KR";
      if (hasKana) return "JP";
      if (hasHanzi && !hasKana) return "ZH";
      if (hasLatin) return "EN";
      return "OTHER";
    }

    function isFatalNoise(text) {
      return FATAL_KEYWORDS_REGEX.test(text);
    }

    // === 1. 去头 ===
    let body = title.trim();
    while (
      body.match(/^(\s*【[^】]*】\s*)+/) ||
      body.match(/^(\s*\[[^\]]*\]\s*)+/) ||
      body.match(/^(\s*[\[【（(][^\]】）)]*[\]】）)]\s*)+/)
    ) {
      body = body
        .replace(/^(\s*【[^】]*】\s*)+/g, "")
        .replace(/^(\s*\[[^\]]*\]\s*)+/g, "")
        .replace(/^(\s*[\[【（(][^\]】）)]*[\]】）)]\s*)+/g, "")
        .replace(/^[\]】）)]\s*/, "")
        .trim();
    }
    if (!body) body = title.trim();

    // === 1.5 枢轴切割 ===
    const fatalSource = FATAL_KEYWORDS_REGEX.source;
    const pivotRegex = new RegExp(
      `[【\\[][^\\]】]*(?:${fatalSource})[^\\]】]*[】\\]]`,
      "gi"
    );
    const pivotParts = body.split(pivotRegex);

    if (pivotParts.length > 1) {
      const lastSegment = pivotParts[pivotParts.length - 1].trim();
      // 检查最后一段是否包含有效字符 (字母、数字、汉字)，防止只剩下 " / " 这种符号
      if (/[a-zA-Z0-9\u4e00-\u9fa5]/.test(lastSegment)) {
        console.log(
          `   ✂️ Step 1.5 枢轴切割: 丢弃左侧元数据，保留 "${lastSegment}"`
        );
        body = lastSegment;
      }
    }

    // === 2. 断尾 ===
    let coreCandidate = body;

    // [修正] 使用 {1,20} 替代 +，避免 Nothing to repeat 错误
    const explicitRe = new RegExp(
      `(` +
        `(?:最终|完结|后日谈|前日谈|特别|番外|短篇|尾声|序章|终章)[话話章节節篇]?|` +
        `第?${NUM_RANGE_UNIT}{1,20}[话話章节節回卷篇期部]|` +
        `(?:Vol|Part|Ch|Ep|Ex|番外|篇)\\.?\\s*${NUM_RANGE_UNIT}{1,20}|` +
        `[#＃]${NUM_RANGE_UNIT}{1,20}` +
        `)`,
      "i"
    );

    const spaceNumRe = new RegExp(
      `\\s+${NUM_RANGE_UNIT}{1,20}(?:[.．]\\d+)?(?:\\s+|$)`
    );
    const stickyNumRe = new RegExp(
      `([^a-zA-Z0-9\\s])(${NUM_CHAR}{1,4}(?:[.．]\\d+)?)(?:\\s+|$)`
    );

    const mExplicit = body.match(explicitRe);
    const mSpace = body.match(spaceNumRe);
    const mSticky = body.match(stickyNumRe);

    let splitIndex = body.length;
    let splitType = "";

    if (mExplicit && mExplicit.index < splitIndex) {
      splitIndex = mExplicit.index;
      splitType = "显式章节";
    }
    if (mSpace && mSpace.index < splitIndex) {
      splitIndex = mSpace.index;
      splitType = "隐式空格数字";
    }
    if (mSticky) {
      const stickyCutIndex = mSticky.index + mSticky[1].length;
      if (stickyCutIndex < splitIndex) {
        splitIndex = stickyCutIndex;
        splitType = "粘连数字";
      }
    }

    // 后方保护
    if (splitIndex < body.length) {
      const remainingPart = body.substring(splitIndex);
      if (/[\/|｜／]/.test(remainingPart)) {
        console.log(`   🛡️ Step 2 触发后方保护: 检测到分隔符，跳过断尾`);
      } else {
        const potentialTitle = body.substring(0, splitIndex).trim();
        if (potentialTitle.length >= 1) {
          console.log(
            `   🗡️ Step 2 ${splitType}切割: 保留左侧 "${potentialTitle}"`
          );
          coreCandidate = potentialTitle;
        }
      }
    }

    // === 3. 分词 ===
    coreCandidate = coreCandidate.replace(/\s+[-_—–]\s+/g, "/");
    coreCandidate = coreCandidate.replace(
      /([^\x00-\x7F])\s*[-_—–]\s*([^\x00-\x7F])/g,
      "$1/$2"
    );
    coreCandidate = coreCandidate.replace(
      /([^\x00-\x7F])\s*[-_—–]\s*([a-zA-Z0-9])/g,
      "$1/$2"
    );
    coreCandidate = coreCandidate.replace(
      /([a-zA-Z0-9])\s*[-_—–]\s*([^\x00-\x7F])/g,
      "$1/$2"
    );

    const SPLIT_RE = /[\/|｜／（）()\[\]【】]+/;
    let rawParts = coreCandidate
      .split(SPLIT_RE)
      .map((p) => p.trim())
      .filter(Boolean);

    // === 4. 清洗 ===
    function cleanTitlePart(str) {
      if (!str) return "";
      let s = str.trim();
      if (isFatalNoise(s)) return "";

      s = s.replace(/「[^」]*」/g, "");
      s = s.replace(/『[^』]*』/g, "");
      s = s.replace(/C\d{2,3}/gi, "");
      // [优化] 使用全局正则替换噪音词
      s = s.replace(EXCLUDE_WORDS_REGEX, "");

      // 移除章节号 [修正正则]
      s = s.replace(
        new RegExp(
          `第?${NUM_RANGE_UNIT}{1,20}[话話章节節回卷篇期部](?:[\\s\\d]+)?`,
          "g"
        ),
        ""
      );
      s = s.replace(new RegExp(`其${NUM_RANGE_UNIT}+`, "g"), "");
      s = s.replace(
        /(?:最终|完结|后日谈|前日谈|特别|番外|短篇|尾声|序章|终章)[话話章节節篇]?/g,
        ""
      );
      s = s.replace(
        new RegExp(
          `(?:Vol|Part|Ch|Ep|Ex|番外|篇)\\.?\\s*${NUM_RANGE_UNIT}{1,20}`,
          "ig"
        ),
        ""
      );
      s = s.replace(new RegExp(`[#＃]${NUM_RANGE_UNIT}{1,20}`, "g"), "");

      s = s.trim();
      // 移除末尾版本号/数字
      s = s.replace(/v\d+(\.\d+)?/gi, "");
      s = s.replace(
        new RegExp(`\\s+${NUM_RANGE_UNIT}{1,20}(\\.\\d+)?$`, "g"),
        ""
      );
      s = s.replace(
        new RegExp(`(${NUM_RANGE_UNIT}{1,20}(\\.\\d+)?)$`, "g"),
        ""
      );
      s = s.replace(/[①-⑳]$/, "");
      s = s.replace(/[-~—–]+$/g, "");

      return s.trim();
    }

    let validParts = [];
    let seen = new Set();

    for (const p of rawParts) {
      const cleaned = cleanTitlePart(p);
      const isCJK = /[\u4e00-\u9fa5\u3040-\u30FF]/.test(cleaned);
      if (cleaned && !/^\d+$/.test(cleaned) && !seen.has(cleaned)) {
        if ((isCJK && cleaned.length >= 2) || (!isCJK && cleaned.length >= 3)) {
          validParts.push(cleaned);
          seen.add(cleaned);
        }
      }
    }
    console.log(`   🧺 Step 3 清洗后候选词: ${JSON.stringify(validParts)}`);

    // === 5. 输出 ===
    const zhParts = [];
    const foreignParts = [];

    for (const part of validParts) {
      const type = getScriptType(part);
      if (type === "ZH") zhParts.push(part);
      else if (type === "JP" || type === "EN" || type === "KR")
        foreignParts.push(part);
      else {
        if (/[\u4e00-\u9fa5]/.test(part)) zhParts.push(part);
        else foreignParts.push(part);
      }
    }

    if (zhParts.length > 0 && foreignParts.length > 0) {
      const bestChinese = zhParts.sort((a, b) => b.length - a.length)[0];
      const bestForeign = foreignParts[0];
      const result = new String(bestChinese);
      result._dualLanguage = { chinese: bestChinese, foreign: bestForeign };
      return result;
    }

    if (zhParts.length > 0) {
      if (zhParts.length >= 2) {
        const result = zhParts;
        result._multiChinese = true;
        return result;
      }
      return zhParts[0];
    }

    if (foreignParts.length > 0) {
      if (foreignParts.length >= 2) {
        if (foreignParts[1].includes(foreignParts[0])) return foreignParts[1];
        if (foreignParts[0].includes(foreignParts[1])) return foreignParts[0];
        const result = [foreignParts[0], foreignParts[1]];
        result._multiForeign = true;
        return result;
      }
      return foreignParts[0];
    }

    if (validParts.length === 0) {
      return coreCandidate || body;
    }

    return validParts[0];
  }

  // 智能相似度匹配函数 - 专注核心作品名匹配
  function calculateSimilarity(searchTitle, resultTitle) {
    console.log(`🔄 计算相似度: "${searchTitle}" vs "${resultTitle}"`);

    // 提取两个标题的核心作品名（去除翻译组、章节号等干扰信息）
    const searchCore = extractCoreWorkName(searchTitle);
    const resultCore = extractCoreWorkName(resultTitle);

    console.log(`   📝 搜索核心: "${searchCore}"`);
    console.log(`   📝 结果核心: "${resultCore}"`);

    // 调试：检查是否有双语信息
    if (typeof searchCore === "object" && searchCore._dualLanguage) {
      console.log(
        `   🌐 搜索核心双语信息: 中文="${searchCore._dualLanguage.chinese}" 外文="${searchCore._dualLanguage.foreign}"`
      );
    }
    if (typeof resultCore === "object" && resultCore._dualLanguage) {
      console.log(
        `   🌐 结果核心双语信息: 中文="${resultCore._dualLanguage.chinese}" 外文="${resultCore._dualLanguage.foreign}"`
      );
    }

    // 智能长度检查：CJK字符2个即有效，英文需要3个
    function isValidCore(core) {
      if (!core) return false;
      const coreStr = core.toString();
      const hasCJK =
        /[\u4e00-\u9fa5\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/.test(coreStr);
      return hasCJK ? coreStr.length >= 2 : coreStr.length >= 3;
    }

    if (!isValidCore(searchCore) || !isValidCore(resultCore)) {
      console.log(`   ❌ 核心标题无效，跳过`);
      return 0;
    }

    // 检查是否有关键词直接匹配（排除翻译组等无关词汇）
    const keywordMatch = checkKeywordMatch(searchCore, resultCore);
    if (keywordMatch > 0) {
      console.log(`   ✅ 关键词匹配度: ${(keywordMatch * 100).toFixed(1)}%`);
      return keywordMatch;
    }

    // 计算核心作品名的相似度
    const similarity = calculateCoreWorkSimilarity(searchCore, resultCore);
    console.log(`   ✅ 核心作品相似度: ${(similarity * 100).toFixed(1)}%`);

    return similarity;
  }

  /*** 目录识别功能 ***/

  /*** 搜索流程 ***/
  // 解析搜索结果页面 HTML，返回原始结果列表
  function parseSearchHtml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const results = [];
    const seenUrls = new Set();

    // 兼容多种选择器，覆盖不同主题和页面结构
    const selectors = [
      "#threadlist li.pbw h3.xs3 a",
      "#threadlist ul li.pbw h3.xs3 a",
      "#threadlist .slst ul li.pbw h3 a",
      "#threadlist li h3.xs3 a",
      "#threadlist .xst",
      "a.xst",
      "#threadlist tbody .subject a",
      ".threadlist .title a",
      'tbody[id^="normalthread"] .xst',
    ];

    selectors.forEach((selector) => {
      const elements = doc.querySelectorAll(selector);
      elements.forEach((link) => {
        let url = link.href;
        const title = link.textContent.trim();

        // 基础过滤
        if (!url || !title || title === "快速") return;

        // URL 补全
        if (url.startsWith("/")) {
          url = `https://bbs.yamibo.com${url}`;
        } else if (url.startsWith("forum.php")) {
          url = `https://bbs.yamibo.com/${url}`;
        }

        // 提取 Thread ID
        const threadId =
          url.match(/tid=(\d+)/)?.[1] || url.match(/thread-(\d+)-/)?.[1];
        if (!threadId) return;

        // 去重
        if (!seenUrls.has(threadId)) {
          seenUrls.add(threadId);
          results.push({
            threadId,
            title, // 原始标题
            url,
          });
        }
      });
    });

    // 检查是否有下一页
    const hasNextPage = !!doc.querySelector('.nxt, .next, a[href*="page=2"]');

    return { results, hasNextPage };
  }
  // 执行单次关键词搜索 (修正翻页逻辑)
  async function fetchSearchResults(searchTerm, forumId) {
    console.log(`🔍 执行搜索: "${searchTerm}" (fid=${forumId})`);
    const allResults = [];

    // 1. 获取 FormHash
    let formHash = getFormHash();
    if (!formHash) {
      try {
        const preRes = await fetch("https://bbs.yamibo.com/search.php");
        const preHtml = await preRes.text();
        const m = preHtml.match(/name="formhash"\s+value="([^"]+)"/);
        if (m) formHash = m[1];
      } catch (e) {}
    }

    // 2. 准备第一页请求 (这算一次搜索，受限流控制)

    const performFirstPage = async () => {
      const encodedTerm = encodeURIComponent(searchTerm);
      // 尝试 GET 搜索
      const getUrl = `https://bbs.yamibo.com/search.php?mod=forum&srchtxt=${encodedTerm}&formhash=${formHash}&srchfid=${forumId}&orderby=dateline&ascdesc=desc&searchsubmit=yes`;

      let response = await fetch(getUrl, {
        method: "GET",
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });

      // GET 失败尝试 POST
      if (!response.ok) {
        const formData = new FormData();
        formData.append("formhash", formHash);
        formData.append("srchtxt", searchTerm);
        formData.append("srchfid[]", forumId);
        formData.append("orderby", "dateline");
        formData.append("ascdesc", "desc");
        formData.append("searchsubmit", "yes");

        response = await fetch("https://bbs.yamibo.com/search.php?mod=forum", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
      }
      return response;
    };

    try {
      // === 第1页搜索 (消耗限流配额) ===
      const response = await safeSearchRequest(performFirstPage);

      if (!response.ok) {
        console.warn(`❌ 搜索请求失败: ${response.status}`);
        return [];
      }

      // **关键点：获取最终 URL 以提取 searchid**
      // fetch 会自动跟随重定向，response.url 就是最终的 searchid URL
      const finalUrl = response.url;
      console.log(`   🔗 搜索结果URL: ${finalUrl}`);

      const html = await response.text();
      if (html.includes("需要登录")) return [];

      const { results, hasNextPage } = parseSearchHtml(html);
      allResults.push(...results);
      console.log(`   📄 第1页找到 ${results.length} 个结果`);

      // === 第2页搜索 (利用 searchid 翻页，不消耗限流配额) ===
      if (hasNextPage) {
        const searchIdMatch = finalUrl.match(/searchid=(\d+)/);

        if (searchIdMatch) {
          const searchId = searchIdMatch[1];
          console.log(
            `   📄 检测到第2页，使用 searchid=${searchId} 快速翻页 (不触发限流)`
          );

          // 构造纯翻页链接
          const page2Url = `https://bbs.yamibo.com/search.php?mod=forum&searchid=${searchId}&orderby=dateline&ascdesc=desc&searchsubmit=yes`;

          try {
            const page2Res = await fetch(page2Url, {
              method: "GET",
              credentials: "include",
            });

            if (page2Res.ok) {
              const page2Html = await page2Res.text();
              const page2Data = parseSearchHtml(page2Html);
              allResults.push(...page2Data.results);
              console.log(`   📄 第2页找到 ${page2Data.results.length} 个结果`);
            }
          } catch (e) {
            console.warn("⚠️ 快速翻页失败:", e);
          }
        } else {
          console.warn("⚠️ 未能提取 searchid，跳过第2页以避免限流");
        }
      }
    } catch (error) {
      console.error(`❌ 搜索词 "${searchTerm}" 执行出错:`, error);
    }

    return allResults;
  }
  // 主搜索流程
  async function searchSeriesDirectory(seriesTitle) {
    if (!seriesTitle) return [];

    // 1. 检查内存缓存
    if (searchCache.has(seriesTitle)) {
      console.log("📦 命中内存缓存");
      return searchCache.get(seriesTitle);
    }

    // 2. 检查持久化缓存
    const seriesKey = generateSeriesKey(seriesTitle);
    const cached = getCachedDirectory(seriesKey);
    if (cached && cached.length > 0) {
      console.log("📦 命中持久化缓存");
      searchCache.set(seriesTitle, cached);
      return cached;
    }

    console.log("🔍 开始搜索系列目录:", seriesTitle);
    const forumId = detectForumId();

    // 3. 生成关键词列表
    // 直接使用 extractCoreWorkName 的结果，不做多余的双语判断
    const coreName = extractCoreWorkName(seriesTitle);
    let searchTerms = [];

    if (typeof coreName === "object" && coreName._dualLanguage) {
      // 双语对象：分别搜中文和外文
      searchTerms = [
        coreName._dualLanguage.chinese,
        coreName._dualLanguage.foreign,
      ];
    } else if (Array.isArray(coreName)) {
      // 多中文别名：全部加入
      searchTerms = coreName;
    } else {
      // 单语：直接搜
      searchTerms = [coreName.toString()];
    }

    // 过滤空词和重复词
    searchTerms = [...new Set(searchTerms)].filter((t) => t && t.length >= 2);
    console.log("🎯 生成搜索关键词:", searchTerms);

    // 4. 执行搜索并合并结果
    // 使用 Map 按 threadId 去重，保留相似度高的
    const resultMap = new Map();

    // 限制最多搜前2个词 (避免请求过多)
    const termsToSearch = searchTerms.slice(0, 2);

    for (const term of termsToSearch) {
      const results = await fetchSearchResults(term, forumId);

      results.forEach((item) => {
        // 计算相似度
        const similarity = calculateSimilarity(seriesTitle, item.title);
        console.log(
          `   [匹配] "${item.title}" 相似度: ${(similarity * 100).toFixed(1)}%`
        );

        // 只有相似度达标才保留 (0.7 阈值)
        if (similarity > 0.7) {
          const existing = resultMap.get(item.threadId);
          // 如果是新结果，或者新结果相似度更高，则更新
          if (!existing || similarity > existing.similarity) {
            resultMap.set(item.threadId, {
              ...item,
              originalTitle: item.title, // 保持字段兼容
              normalizedTitle: normalizeSeriesTitle(item.title),
              similarity,
              searchTerm: term,
            });
          }
        }
      });
    }

    // 5. 结果排序与转换
    let directory = Array.from(resultMap.values());

    // 按 Thread ID 升序 (老帖子在前，新帖子在后，符合漫画章节发布顺序)
    directory.sort((a, b) => parseInt(a.threadId) - parseInt(b.threadId));

    console.log(`📊 最终筛选结果: ${directory.length} 个章节`);

    // 6. 兜底策略：如果没搜到，返回当前页作为单章节目录
    if (directory.length === 0) {
      const currentTid = getCurrentThreadId();
      if (currentTid) {
        console.log("🔧 搜索无果，使用当前章节兜底");
        return [
          {
            threadId: currentTid,
            title: seriesTitle,
            originalTitle: seriesTitle,
            url: window.location.href,
            normalizedTitle: normalizeSeriesTitle(seriesTitle),
            similarity: 1.0,
            searchTerm: "current",
          },
        ];
      }
    } else {
      // 写入缓存
      searchCache.set(seriesTitle, directory);
      setCachedDirectory(seriesKey, directory);
    }

    return directory;
  }

  // 提取章节号（支持小数格式和复杂排序）
  function extractChapterNumber(title) {
    if (!title || typeof title !== "string") return 0;
    // 特殊章节（番外/彩页等）放到最后
    const specialPatterns = [
      /番外|外传|特别篇|SP|特典|彩页|后记|前记|预告|PV|CM/i,
      /extra|special|omake|bonus/i,
    ];
    for (const p of specialPatterns) {
      if (p.test(title)) return 99999;
    }

    const patterns = [
      {
        regex: /(?:第\s*)?(\d+\.\d+)\s*[话話章节節回卷篇期]?/i,
        priority: 1,
        type: "decimal",
      },
      {
        regex: /第\s*(\d+)\s*[话話章节節回卷篇]/i,
        priority: 2,
        type: "standard",
      },
      { regex: /(\d+)\s*[话話章节節]/i, priority: 3, type: "numbered" },
      {
        regex: /[\[\(（](\d+(?:\.\d+)?)[\]\)）]/,
        priority: 4,
        type: "bracketed",
      },
      { regex: /(?:第\s*)?(\d+)\s*卷/i, priority: 5, type: "volume" },
      { regex: /\s(\d+(?:\.\d+)?)$/, priority: 6, type: "trailing" },
      { regex: /^(\d+(?:\.\d+)?)\s/, priority: 7, type: "leading" },
      { regex: /(\d+(?:\.\d+)?)/, priority: 8, type: "any" },
    ];

    let bestMatch = null;
    let bestPriority = Infinity;
    for (const p of patterns) {
      const m = title.match(p.regex);
      if (m && p.priority < bestPriority) {
        bestMatch = m[1];
        bestPriority = p.priority;
      }
    }

    if (bestMatch != null) {
      if (bestMatch.includes(".")) {
        // 小数章如 9.5 -> 9500（保持整数比较）
        const v = parseFloat(bestMatch);
        if (!isNaN(v)) return Math.round(v * 1000);
      } else {
        const v = parseInt(bestMatch, 10);
        if (!isNaN(v)) return v;
      }
    }

    // 简单中文数字映射（可扩展）
    const chineseNumbers = {
      零: 0,
      一: 1,
      二: 2,
      三: 3,
      四: 4,
      五: 5,
      六: 6,
      七: 7,
      八: 8,
      九: 9,
      十: 10,
      十一: 11,
      十二: 12,
      十三: 13,
      十四: 14,
      十五: 15,
      十六: 16,
      十七: 17,
      十八: 18,
      十九: 19,
      二十: 20,
    };
    for (const [ch, num] of Object.entries(chineseNumbers)) {
      if (
        title.includes(`第${ch}`) ||
        title.includes(`${ch}话`) ||
        title.includes(`${ch}章`)
      ) {
        return num;
      }
    }

    return 0;
  }

  function getFormHash() {
    if (isReading) {
      console.log("🔑 FormHash: 阅读模式下跳过FormHash");
      return "";
    }
    const formHashInput = document.querySelector('input[name="formhash"]');
    return formHashInput ? formHashInput.value : "";
  }

  // 从URL识别帖子所属版块
  function detectForumId(url = window.location.href) {
    // 方式1: 从URL参数中提取 fid
    const fidMatch = url.match(/[?&]fid=(\d+)/);
    if (fidMatch) {
      const fid = fidMatch[1];
      console.log(`📍 从URL参数识别版块: fid=${fid}`);
      return fid;
    }

    // 方式2: 从forum.php路径中提取
    const forumMatch = url.match(/forum-(\d+)-/);
    if (forumMatch) {
      const fid = forumMatch[1];
      console.log(`📍 从forum路径识别版块: fid=${fid}`);
      return fid;
    }

    // 方式3: 从thread URL中推断（访问页面时检查页面元素）
    try {
      const breadcrumbs = document.querySelectorAll('.z a[href*="forum"]');
      const forumIds = [];

      for (const breadcrumb of breadcrumbs) {
        // 尝试从 forum-数字- 格式提取
        const breadcrumbMatch1 = breadcrumb.href.match(/forum-(\d+)-/);
        if (breadcrumbMatch1) {
          const fid = breadcrumbMatch1[1];
          const name = breadcrumb.textContent.trim();
          forumIds.push({ fid, name, element: breadcrumb });
          continue;
        }
        // 尝试从 fid= 参数提取
        const breadcrumbMatch2 = breadcrumb.href.match(/fid=(\d+)/);
        if (breadcrumbMatch2) {
          const fid = breadcrumbMatch2[1];
          const name = breadcrumb.textContent.trim();
          forumIds.push({ fid, name, element: breadcrumb });
        }
      }

      // ✨ 选择最后一个版块（最精确的子版块）
      if (forumIds.length > 0) {
        const lastForum = forumIds[forumIds.length - 1];
        console.log(
          `📍 从面包屑导航识别版块: fid=${lastForum.fid} (${lastForum.name})`
        );
        if (forumIds.length > 1) {
          console.log(
            `   💡 跳过了 ${forumIds.length - 1} 个父级版块，选择最精确的子版块`
          );
        }
        return lastForum.fid;
      }
    } catch (e) {
      console.log("⚠️ 无法从面包屑导航识别版块:", e.message);
    }

    // 方式4: 从当前页面的返回链接中提取
    try {
      const backLinks = document.querySelectorAll('a[href*="forum"]');
      for (const backLink of backLinks) {
        const linkMatch = backLink.href.match(/fid=(\d+)/);
        if (linkMatch) {
          const fid = linkMatch[1];
          console.log(`📍 从返回链接识别版块: fid=${fid}`);
          return fid;
        }
      }
    } catch (e) {
      // ignore
    }

    // 默认返回中文百合漫画区 (fid=30)
    console.log("📍 无法识别版块，默认使用中文百合漫画区 (fid=30)");
    return "30";
  }

  // 获取版块名称（用于日志显示）
  function getForumName(fid) {
    const forumNames = {
      30: "中文百合漫画区",
      37: "百合漫画图源区",
    };
    return forumNames[fid] || `版块${fid}`;
  }

  // 与本贴相似度匹配检查
  function containsSimilarWords(title1, title2) {
    const words1 = title1
      .toLowerCase()
      .split(/[\s\-_]+/)
      .filter((w) => w.length > 1);
    const words2 = title2
      .toLowerCase()
      .split(/[\s\-_]+/)
      .filter((w) => w.length > 1);

    console.log(`🔍 词汇比较: "${title1}" vs "${title2}"`);
    console.log(`   词汇1: [${words1.join(", ")}]`);
    console.log(`   词汇2: [${words2.join(", ")}]`);

    let commonWords = 0;
    const matchedPairs = [];

    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1.includes(word2) || word2.includes(word1)) {
          commonWords++;
          matchedPairs.push(`"${word1}" ⟷ "${word2}"`);
          break;
        }
      }
    }

    const threshold = Math.min(2, Math.min(words1.length, words2.length));
    const isMatch = commonWords >= threshold;

    console.log(`   匹配词汇: ${matchedPairs.join(", ")}`);
    console.log(
      `   匹配数量: ${commonWords}/${threshold} (需要: ${threshold})`
    );
    console.log(`   结果: ${isMatch ? "✅ 匹配" : "❌ 不匹配"}`);

    return isMatch;
  }

  /*** 悬浮按钮 ***/
  const ioniconsModule = document.createElement("script");
  ioniconsModule.type = "module";
  ioniconsModule.src =
    "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js";
  document.head.appendChild(ioniconsModule);

  const ioniconsNomodule = document.createElement("script");
  ioniconsNomodule.noModule = true;
  ioniconsNomodule.src =
    "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js";
  document.head.appendChild(ioniconsNomodule);

  const fontLink = document.createElement("link");
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  const button = document.createElement("button");
  button.id = "reader-toggle";
  button.innerHTML = `
    <span class="icon"><ion-icon name="book-outline"></ion-icon></span>
    <span class="title">进入阅读模式</span>
  `;

  document.body.appendChild(button);

  GM_addStyle(BUTTON_CSS);

  // 添加快捷键：Ctrl+Shift+R 切换阅读模式
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "r") {
      e.preventDefault();
      if (!isReading) enterReader();
      else exitReader();
    }
  });

  button.addEventListener("click", () => {
    if (!isReading) {
      enterReader();
      setAutoReaderStatus(true); // 开启全局阅读器模式
    } else {
      exitReader();
    }
  });

  /*** 目录功能 ***/
  async function showDirectoryModal() {
    // 创建遮罩层
    const overlay = document.createElement("div");
    overlay.id = "directory-overlay";

    // 创建侧边栏
    const sidebar = document.createElement("div");
    sidebar.id = "directory-sidebar";
    sidebar.innerHTML = `
      <div id="directory-header">
        <div id="directory-title">目录</div>
        <button id="directory-close">×</button>
      </div>
      <div id="directory-content">
        <div id="directory-loading">正在搜索相关章节...</div>
        <ul id="directory-list" style="display: none;"></ul>
        <div id="directory-empty" style="display: none;">未找到相关章节</div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

    // 显示遮罩和侧边栏
    setTimeout(() => {
      overlay.classList.add("show");
      sidebar.classList.add("open");
    }, 10);

    // 关闭按钮事件
    const closeBtn = sidebar.querySelector("#directory-close");
    closeBtn.addEventListener("click", closeSidebar);

    // 点击遮罩关闭
    overlay.addEventListener("click", closeSidebar);

    function closeSidebar() {
      overlay.classList.remove("show");
      sidebar.classList.remove("open");

      setTimeout(() => {
        overlay.remove();
        sidebar.remove();
      }, 300);
    }

    // 开始搜索目录
    loadSeriesDirectory(sidebar);
  }

  async function loadSeriesDirectory(modal) {
    console.log("📖 开始加载系列目录...");

    // 如果已有预加载的目录，直接使用
    if (seriesDirectory.length > 0) {
      console.log("✅ 使用预加载的目录:", seriesDirectory.length, "个章节");
      displayDirectory(modal, seriesDirectory);
      return;
    }

    // 如果预加载目录为空，先检查持久化缓存
    if (originalSeriesTitle || savedThreadTitle) {
      const titleToCheck = originalSeriesTitle || savedThreadTitle;
      const seriesKey = generateSeriesKey(titleToCheck);
      const cachedDirectory = getCachedDirectory(seriesKey);
      if (cachedDirectory && cachedDirectory.length > 0) {
        console.log(
          "✅ 从持久化缓存加载目录:",
          cachedDirectory.length,
          "个章节"
        );
        seriesDirectory = cachedDirectory;
        displayDirectory(modal, seriesDirectory);
        return;
      }
    }

    // 尝试多种方式获取页面标题
    let titleElement = null;
    let threadTitle = "";

    console.log("🔍 尝试查找页面标题...");

    // 简化标题提取逻辑
    const h1Element = document.querySelector("h1.ts");
    if (h1Element) {
      const subjectSpan = h1Element.querySelector(
        '#thread_subject, span[id^="thread_subject"]'
      );
      if (subjectSpan) {
        threadTitle = subjectSpan.textContent.trim();
        console.log(`✅ 找到标题: "${threadTitle}"`);
      } else {
        threadTitle = h1Element.textContent.trim();
        console.log(`✅ 找到h1文本: "${threadTitle}"`);
      }
    } else {
      // 兜底：使用原有逻辑
      const titleSelectors = [
        "#thread_subject",
        'span[id^="thread_subject"]',
        ".ts a",
        "h1.ts",
        ".ntn a",
        ".ntn",
        ".bm .mbm h1",
        ".ts",
      ];

      for (const selector of titleSelectors) {
        titleElement = document.querySelector(selector);
        if (titleElement) {
          threadTitle = titleElement.textContent.trim();
          console.log(`✅ 找到标题元素: "${selector}" -> "${threadTitle}"`);
          break;
        } else {
          console.log(`❌ 未找到: "${selector}"`);
        }
      }
    }

    // 在阅读模式下，优先使用原始系列标题进行目录搜索（避免使用错误的标题）
    if (isReading) {
      if (originalSeriesTitle) {
        threadTitle = originalSeriesTitle;
        console.log("🎯 阅读模式下使用原始系列标题:", threadTitle);
      } else if (savedThreadTitle) {
        threadTitle = savedThreadTitle;
        console.log("📦 阅读模式下使用预存标题:", threadTitle);
      }
    } else if (!threadTitle && originalSeriesTitle) {
      threadTitle = originalSeriesTitle;
      console.log("🎯 使用原始系列标题:", threadTitle);
    } else if (!threadTitle && savedThreadTitle) {
      threadTitle = savedThreadTitle;
      console.log("📦 使用预存标题:", threadTitle);
    }
    // 如果还是没找到，尝试从页面title获取
    if (!threadTitle) {
      const pageTitle = document.title;
      console.log("🔍 尝试从页面title获取:", pageTitle);

      // 移除论坛名称等后缀，只保留漫画标题部分
      if (pageTitle.includes(" - ")) {
        threadTitle = pageTitle.split(" - ")[0].trim();
        console.log("📝 从页面title提取:", threadTitle);
      } else {
        threadTitle = pageTitle.replace(/\s*-\s*百合会.*$/, "").trim();
        console.log("📝 清理后的标题:", threadTitle);
      }
    }

    const currentThreadId = getCurrentThreadId();

    console.log("📋 当前页面信息:");
    console.log("   标题元素:", titleElement ? "✅ 找到" : "❌ 未找到");
    console.log("   页面标题:", threadTitle);
    console.log("   线程ID:", currentThreadId);

    // 调试：打印页面中所有可能的标题元素
    if (!titleElement) {
      console.log("🔍 调试：查找所有可能的标题元素...");

      const allH1 = document.querySelectorAll("h1");
      const allSpans = document.querySelectorAll(
        'span[id*="thread"], span[id*="subject"]'
      );
      const allTs = document.querySelectorAll(".ts, .ntn");

      console.log("  - h1元素数量:", allH1.length);
      allH1.forEach((h1, index) => {
        if (index < 5) {
          console.log(
            `    h1[${index}]: "${h1.textContent
              .trim()
              .substring(0, 50)}" (class: ${h1.className})`
          );
        }
      });

      console.log("  - 包含thread/subject的span数量:", allSpans.length);
      allSpans.forEach((span, index) => {
        if (index < 5) {
          console.log(
            `    span[${index}]: id="${span.id}", text="${span.textContent
              .trim()
              .substring(0, 50)}"`
          );
        }
      });

      console.log("  - .ts/.ntn元素数量:", allTs.length);
      allTs.forEach((ts, index) => {
        if (index < 5) {
          console.log(
            `    ts[${index}]: class="${ts.className}", text="${ts.textContent
              .trim()
              .substring(0, 50)}"`
          );
        }
      });
    }

    if (!threadTitle) {
      console.log("❌ 页面标题为空，显示空状态");
      showDirectoryEmpty(modal);
      return;
    }

    try {
      console.log("🔍 开始搜索目录...");
      const directory = await searchSeriesDirectory(threadTitle);

      console.log("📊 搜索结果:", directory.length, "个章节");

      if (directory.length === 0) {
        console.log("❌ 未找到章节，显示空状态");
        showDirectoryEmpty(modal);
        return;
      }

      console.log("✅ 找到章节，开始显示目录界面");
      displayDirectory(modal, directory, threadTitle);
    } catch (error) {
      console.error("❌ 加载目录失败:", error);
      console.error("错误详情:", error.message);
      console.error("错误堆栈:", error.stack);
      showDirectoryEmpty(modal, "加载失败，请稍后重试");
    }
  }

  function displayDirectory(modal, directory, threadTitle = "") {
    // 显示目录
    const loading = modal.querySelector("#directory-loading");
    const list = modal.querySelector("#directory-list");
    const title = modal.querySelector("#directory-title");

    loading.style.display = "none";
    list.style.display = "block";

    // 获取页面标题（如果没有提供）
    if (!threadTitle) {
      if (savedThreadTitle) {
        threadTitle = savedThreadTitle;
      } else {
        threadTitle = document.title.split(" - ")[0] || "漫画目录";
      }
    }

    // 简化标题，只显示"目录"
    title.textContent = "目录";

    console.log("📝 目录标题: 目录");

    list.innerHTML = "";

    const currentThreadId = getCurrentThreadId();

    directory.forEach((item, index) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.className = "directory-item";
      if (item.source === "mainpost") {
        link.classList.add("mainpost");
      }

      link.href = item.url;

      // 为主楼提取的目录优化显示格式
      if (item.source === "mainpost") {
        let displayText = item.title;

        // 识别不同的章节格式并优化显示
        if (item.title.match(/^\d{1,2}$/)) {
          displayText = `第${String(item.title).padStart(2, "0")}话`;
        } else if (item.title.match(/^\d+\.\d+$/)) {
          displayText = `第${item.title}话`;
        } else if (item.title.match(/^\d+[话話章节節回卷篇]/i)) {
          displayText = item.title;
        } else if (item.title.match(/卷|番外|彩页|特典/i)) {
          displayText = item.title;
        } else if (item.title.match(/^0\d+$/)) {
          displayText = `第${item.title}话`;
        }

        link.textContent = displayText;
      } else {
        link.textContent = item.title;
      }

      // 添加点击事件处理，无缝加载新章节内容
      link.addEventListener("click", async (e) => {
        e.preventDefault();
        console.log("🔄 正在加载章节:", item.title);

        // 关闭侧边栏
        const overlay = document.getElementById("directory-overlay");
        const sidebar = document.getElementById("directory-sidebar");
        if (overlay && sidebar) {
          overlay.classList.remove("show");
          sidebar.classList.remove("open");
          setTimeout(() => {
            overlay.remove();
            sidebar.remove();
          }, 300);
        }

        // 无缝加载新章节内容
        await loadNewChapter(item.url, item.title);
      });

      // 高亮当前章节
      if (item.threadId === currentThreadId) {
        link.classList.add("current");
        console.log(`⭐ 当前章节: ${item.title}`);
      }

      li.appendChild(link);
      list.appendChild(li);

      console.log(`📄 章节 ${index + 1}: ${item.title}`);
    });

    console.log("✅ 目录界面显示完成");
  }

  function showDirectoryEmpty(modal, message = "未找到相关章节") {
    const loading = modal.querySelector("#directory-loading");
    const empty = modal.querySelector("#directory-empty");

    loading.style.display = "none";
    empty.style.display = "block";
    empty.textContent = message;
  }

  function getCurrentThreadId() {
    const href = window.location.href;
    let match = href.match(/thread-(\d+)-/);
    if (match) {
      return match[1];
    }

    try {
      const url = new URL(href);
      const tidParam = url.searchParams.get("tid");
      if (tidParam) {
        return tidParam;
      }
    } catch (e) {
      // ignore
    }

    match = href.match(/[?&]tid=(\d+)/);
    return match ? match[1] : null;
  }

  // 清理所有缓存，并清空内存缓存
  function clearAllCache() {
    console.log("🧹 清理所有目录缓存 (session + GM) ...");
    let cleanedCount = 0;

    // 1) 清理 sessionStorage 前缀条目
    try {
      const sKeys = Object.keys(sessionStorage).filter((k) =>
        k.startsWith(CACHE_PREFIX)
      );
      sKeys.forEach((k) => {
        try {
          sessionStorage.removeItem(k);
          cleanedCount++;
        } catch (e) {}
      });
    } catch (e) {}

    // 2) 清理 GM_* 条目（通过索引枚举）
    try {
      if (
        typeof GM_getValue === "function" &&
        typeof GM_setValue === "function"
      ) {
        let idx = GM_getValue(GM_INDEX_KEY, undefined);
        if (typeof idx === "string") {
          try {
            idx = JSON.parse(idx);
          } catch (e) {
            idx = [];
          }
        }
        if (!Array.isArray(idx)) idx = [];

        for (const key of idx) {
          try {
            storageRemove(key);
            cleanedCount++;
          } catch (e) {}
        }

        try {
          GM_setValue(GM_INDEX_KEY, []);
        } catch (e) {}
      }
    } catch (e) {}

    // 3) 清理内存缓存
    try {
      if (searchCache && searchCache.clear) searchCache.clear();
    } catch (e) {}
    try {
      if (directoryMemoryCache && directoryMemoryCache.clear)
        directoryMemoryCache.clear();
    } catch (e) {}

    console.log(`✅ 已清理 ${cleanedCount} 个持久化缓存条目，且已清空内存缓存`);
    return cleanedCount;
  }

  // 查看缓存状态（session + GM 索引 + 内存统计）
  function viewCacheStatus() {
    console.log("📊 缓存状态统计:");

    // sessionStorage 条目
    let sessionList = [];
    try {
      sessionList = Object.keys(sessionStorage).filter((k) =>
        k.startsWith(CACHE_PREFIX)
      );
    } catch (e) {
      sessionList = [];
    }

    // GM 索引条目
    let gmList = [];
    try {
      if (typeof GM_getValue === "function") {
        let idx = GM_getValue(GM_INDEX_KEY, undefined);
        if (typeof idx === "string") {
          try {
            idx = JSON.parse(idx);
          } catch (e) {
            idx = [];
          }
        }
        if (Array.isArray(idx)) gmList = idx.slice();
      }
    } catch (e) {
      gmList = [];
    }

    console.log(`📦 sessionStorage 缓存数量: ${sessionList.length}`);
    console.log(`📦 GM_* 缓存数量 (index): ${gmList.length}`);
    console.log(
      `🧠 内存缓存 (searchCache): ${
        typeof searchCache !== "undefined" && searchCache.size !== undefined
          ? searchCache.size
          : "未知"
      }`
    );
    console.log(
      `🧠 内存目录缓存 (directoryMemoryCache): ${
        typeof directoryMemoryCache !== "undefined" &&
        directoryMemoryCache.size !== undefined
          ? directoryMemoryCache.size
          : "未知"
      }`
    );

    if (sessionList.length > 0) {
      console.log("\n📋 sessionStorage 详情:");
      sessionList.forEach((k, i) => {
        try {
          const obj = JSON.parse(sessionStorage.getItem(k));
          const age = Math.round(
            (Date.now() - (obj.ts || obj.timestamp || 0)) / (1000 * 60 * 60)
          );
          const count = obj.d || obj.data ? (obj.d || obj.data).length : "未知";
          console.log(
            `   ${i + 1}. ${k.replace(
              CACHE_PREFIX + "session-",
              ""
            )}: ${count}章, ${age}小时前`
          );
        } catch (e) {
          console.log(`   ${i + 1}. ${k} (无法解析)`);
        }
      });
    }

    if (gmList.length > 0) {
      console.log("\n📋 GM_* 详情 (由索引列出):");
      gmList.forEach((k, i) => {
        try {
          const obj = storageGet(k, null);
          const age = obj
            ? Math.round(
                (Date.now() - (obj.ts || obj.timestamp || 0)) / (1000 * 60 * 60)
              )
            : "未知";
          const count = obj
            ? obj.d || obj.data
              ? (obj.d || obj.data).length
              : "未知"
            : "未知";
          console.log(
            `   ${i + 1}. ${k.replace(
              CACHE_PREFIX,
              ""
            )}: ${count}章, ${age}小时前`
          );
        } catch (e) {
          console.log(`   ${i + 1}. ${k} (无法读取)`);
        }
      });
    }

    return {
      sessionCount: sessionList.length,
      gmCount: gmList.length,
      memorySearchCount:
        typeof searchCache !== "undefined" && searchCache.size !== undefined
          ? searchCache.size
          : null,
      memoryDirCount:
        typeof directoryMemoryCache !== "undefined" &&
        directoryMemoryCache.size !== undefined
          ? directoryMemoryCache.size
          : null,
    };
  }

  // 智能图片收集函数：强力过滤 + 智能兜底
  function collectImagesFromDocument(doc = document) {
    try {
      // URL 标准化
      const normalizeUrl = (u) => {
        if (!u) return null;
        u = String(u).trim();
        if (!u) return null;
        if (u.startsWith("//")) u = (location.protocol || "https:") + u;
        if (!/^https?:\/\//i.test(u))
          u = "https://bbs.yamibo.com/" + u.replace(/^\/+/, "");
        u = u.replace(/^https?:\/\/https?:\/\//, "https://");
        return u;
      };

      // 强力噪音判定
      const isIgnoredImage = (img, src) => {
        try {
          if (!src && !img) return true;
          if (BLOCK_IMG_REGEX.test(src)) return true;

          // === 1. 文件名与路径黑名单 (精准打击) ===
          const blockKeywords = [
            // 基础UI
            "/uc_server/data/avatar/",
            "avatar",
            "user_avatar", // 头像
            "static/image/common/",
            "static/image/smiley/", // 系统图标/表情
            "template/", // 模板图片 (如 userinfo.gif, forumlink.gif)

            // 具体文件名特征
            "none.gif",
            "loading.gif",
            "logo.png",
            "logo.gif",
            "qq.gif",
            "qq_big.gif",
            "qq_group", // QQ相关
            "userinfo.gif",
            "forumlink.gif", // 用户资料/网站链接
            "online_admin",
            "online_member",
            "online_team", // 在线状态
            "icon_quote",
            "collapse",
            "expand", // 引用/折叠图标

            // 评分与功能
            "rating",
            "score",
            "grade",
            "star",
            "magic",
          ];

          if (blockKeywords.some((kw) => s.includes(kw))) return true;

          // === 2. CSS 类名/ID 过滤 ===
          const cls = img && img.className ? img.className : "";
          if (/avatar|logo|vm|authicn/i.test(cls)) return true;
          const id = img && img.id ? img.id : "";
          if (/authicon|logo/i.test(id)) return true;

          // === 3. 容器过滤 (防止误杀正文，但要排除侧边栏等) ===
          if (
            img &&
            (img.closest(".postrate") ||
              img.closest(".post-ratings") ||
              img.closest(".postratedby") ||
              img.closest(".poster") ||
              img.closest(".author") ||
              img.closest(".avatar") ||
              img.closest(".user") ||
              img.closest(".pls") || // .pls 是用户信息侧边栏
              img.closest(".p_pop") || // 弹出菜单
              img.closest("#ft") || // 页脚
              img.closest(".po") || // 帖子底部操作栏
              img.closest(".a_pr")) // 广告位
          ) {
            return true;
          }

          // === 4. 尺寸过滤 (针对未被上述规则命中的漏网之鱼) ===
          const wAttr = img && (img.getAttribute("width") || img.width);
          const hAttr = img && (img.getAttribute("height") || img.height);
          const w = wAttr ? parseInt(wAttr, 10) : 0;
          const h = hAttr ? parseInt(hAttr, 10) : 0;

          // 只有当宽高都非常明确且很小时才过滤 (小于 100px 通常是图标)
          // 漫画图片通常宽度远大于 100
          if (w > 0 && h > 0 && (w < 100 || h < 100)) return true;

          // 还可以检测 style 属性中的宽高
          if (img && img.style) {
            const styleW = parseInt(img.style.width || "0");
            const styleH = parseInt(img.style.height || "0");
            if (styleW > 0 && styleH > 0 && (styleW < 100 || styleH < 100))
              return true;
          }

          return false;
        } catch (e) {
          return false;
        }
      };

      // 优先选择器 (大图通常有的属性)
      const preferredSelectors = [
        "ignore_js_op img",
        ".savephotop img",
        "div.t_f img",
        "td.t_f img",
        ".pcb img",
        "img[zoomfile]",
        "img[file]",
        "img[aid]",
        "img.zoom",
      ];

      // 辅助：执行收集
      const doCollect = (context, selectors) => {
        const list = [];
        const visited = new Set();

        // 尝试优先选择器
        for (const sel of selectors) {
          const imgs = context.querySelectorAll(sel);
          imgs.forEach((img) => {
            const u = normalizeUrl(
              img.getAttribute("zoomfile") ||
                img.getAttribute("file") ||
                img.getAttribute("src")
            );
            if (u && !visited.has(u) && !isIgnoredImage(img, u)) {
              visited.add(u);
              list.push(u);
            }
          });
        }

        // 如果优先选择器没找到，尝试所有图片但严格过滤
        if (list.length === 0) {
          const allImgs = context.querySelectorAll("img");
          allImgs.forEach((img) => {
            const u = normalizeUrl(img.getAttribute("src"));
            // 这里只收录有 zoomfile 或看起来很大的图
            const hasZoom =
              img.getAttribute("zoomfile") || img.getAttribute("file");
            if (u && !visited.has(u) && !isIgnoredImage(img, u)) {
              if (hasZoom) {
                visited.add(u);
                list.push(u);
              }
            }
          });
        }
        return list;
      };

      let resultsA = [];
      let resultsB = [];

      // === 策略 A: 按楼主 UID 过滤 (增强版) ===
      let authorUid = null;

      // 1. 查找所有帖子楼层
      const allPostDivs = Array.from(doc.querySelectorAll('div[id^="post_"]'));
      // 过滤干扰项，只留真正楼层
      const realPosts = allPostDivs.filter(
        (p) => p.id && /^post_\d+$/.test(p.id)
      );

      // 2. 尝试从主楼 (一楼) 提取 UID
      if (realPosts.length > 0) {
        const firstPost = realPosts[0];
        const links = firstPost.querySelectorAll(
          'a[href*="uid"], a[href*="space"]'
        );
        for (const a of links) {
          const href = a.getAttribute("href");
          const m = href.match(/(?:uid[=-]|space-uid-)(\d+)/);
          if (m) {
            authorUid = m[1];
            break;
          }
        }
      }

      // 3. 备用: 全局查找 "楼主" 标识
      if (!authorUid) {
        const louzhu = doc.querySelector('.authicn[title="楼主"], .louzhu');
        if (louzhu) {
          const parent = louzhu.closest(".pi") || louzhu.closest(".authi");
          if (parent) {
            const a = parent.querySelector('a[href*="uid"]');
            if (a) {
              const m = a.href.match(/(?:uid[=-]|space-uid-)(\d+)/);
              if (m) authorUid = m[1];
            }
          }
        }
      }

      // 4. 如果找到了 UID，收集所有该 UID 的楼层
      if (authorUid) {
        const authorPosts = realPosts.filter((p) => {
          // 检查楼层内的用户信息链接是否包含该 UID
          // 这种检查方式比 innerHTML includes 更快且更准
          const userLink = p.querySelector(
            `a[href*="uid=${authorUid}"], a[href*="uid-${authorUid}"]`
          );
          return !!userLink;
        });

        authorPosts.forEach((p) => {
          const imgs = doCollect(p, preferredSelectors);
          resultsA.push(...imgs);
        });
      }

      // === 策略 B: 兜底模式 (扫描所有内容区域 .t_f) ===
      // Discuz 的帖子内容通常都在 .t_f 或 .pcb 中
      const contentAreas = doc.querySelectorAll(".t_f, .pcb");
      contentAreas.forEach((area) => {
        const imgs = doCollect(area, preferredSelectors);
        resultsB.push(...imgs);
      });

      // === 决策 ===

      // 去重合并
      const uniqueA = [...new Set(resultsA)];
      const uniqueB = [...new Set(resultsB)];

      console.log(
        `📊 图片提取: 楼主模式=${uniqueA.length}, 兜底模式=${uniqueB.length}`
      );

      if (uniqueA.length > 0) {
        // 如果楼主模式找到了图，通常比较准
        return uniqueA;
      } else {
        // 否则使用兜底模式
        if (uniqueB.length > 0) {
          console.log("⚠️ 楼主模式未找到图片，使用兜底结果");
        }
        return uniqueB;
      }
    } catch (e) {
      console.warn("collectImagesFromDocument error", e);
      return [];
    }
  }
  // ====== localForage 图片缓存工具函数 ======
  async function getCachedImageUrl(imgUrl) {
    const cached = await localforage.getItem(imgUrl);
    if (cached) {
      return URL.createObjectURL(cached);
    }
    const resp = await fetch(imgUrl);
    const blob = await resp.blob();
    await localforage.setItem(imgUrl, blob);
    return URL.createObjectURL(blob);
  }
  // 初始化时检查全局阅读器状态
  function initAutoReader() {
    autoReaderEnabled = checkAutoReaderStatus();
    console.log("🚀 初始化全局阅读器状态:", autoReaderEnabled);

    // 清理过期缓存
    cleanExpiredCache();

    // 检查是否有漫画内容，优先检测主楼
    const comicImages = collectImagesFromDocument(document);
    if (comicImages && comicImages.length > 0) {
      console.log("🎯 检测到漫画内容，立即开始预取目录...");

      // 立即开始预取目录信息，不管是否进入阅读模式
      preloadDirectoryInfo();

      // 如果全局阅读器开启，自动进入阅读模式
      if (autoReaderEnabled && !isReading) {
        console.log("🎯 自动进入阅读模式");
        setTimeout(() => {
          if (button && button.parentNode) {
            button.remove();
          }
          enterReader();
        }, 1000);
      }
    } else {
      console.log("🔍 尝试预取目录信息...");
      preloadDirectoryInfo();
    }
  }
  // 预加载目录信息
  async function preloadDirectoryInfo() {
    if (seriesDirectory.length > 0) {
      console.log("� 目录已预加载，跳过重复加载");
      return;
    }

    try {
      console.log("�📚 开始预加载目录信息...");

      // 获取当前页面标题
      let threadTitle = "";
      const h1Element = document.querySelector("h1.ts");
      if (h1Element) {
        const subjectSpan = h1Element.querySelector(
          '#thread_subject, span[id^="thread_subject"]'
        );
        if (subjectSpan) {
          threadTitle = subjectSpan.textContent.trim();
        } else {
          threadTitle = h1Element.textContent.trim();
        }
      } else {
        const titleElement = document.querySelector(
          '#thread_subject, span[id^="thread_subject"]'
        );
        if (titleElement) {
          threadTitle = titleElement.textContent.trim();
        } else {
          const pageTitle = document.title;
          threadTitle = pageTitle.includes(" - ")
            ? pageTitle.split(" - ")[0].trim()
            : pageTitle.replace(/\s*-\s*百合会.*$/, "").trim();
        }
      }

      if (threadTitle) {
        // 保存标题信息
        savedThreadTitle = threadTitle;
        originalSeriesTitle = threadTitle;

        console.log("📖 开始预取目录，使用标题:", threadTitle);

        // 先检查持久化缓存
        const seriesKey = generateSeriesKey(threadTitle);
        const cachedDirectory = getCachedDirectory(seriesKey);
        if (cachedDirectory && cachedDirectory.length > 0) {
          console.log(
            "✅ 从持久化缓存预加载完成:",
            cachedDirectory.length,
            "个章节"
          );
          seriesDirectory = cachedDirectory;
          return;
        }

        // 如果没有缓存，立即开始异步搜索目录
        searchSeriesDirectory(threadTitle)
          .then((directory) => {
            if (directory && directory.length > 0) {
              seriesDirectory = directory;
              console.log("✅ 预加载完成，获得", directory.length, "个章节");
            } else {
              console.log("⚠️ 预加载未找到目录");
            }
          })
          .catch((error) => {
            console.warn("⚠️ 预加载目录失败:", error.message);
          });
        console.log("🚀 预加载任务已启动，后台进行中...");
      } else {
        console.log("⚠️ 无法获取页面标题，跳过预加载");
      }
    } catch (error) {
      console.warn("⚠️ 预加载目录失败:", error.message);
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(initAutoReader, 1000); // 确保页面元素完全加载
    });
  } else {
    setTimeout(initAutoReader, 1000); // 给页面充足时间渲染
  }

  /*** 进入阅读模式 ***/
  function enterReader() {
    console.log("[enterReader] called");
    isReading = true;

    // 保存原始页面HTML和标题
    readerStartUrl = window.location.href;
    originalPageHTML = document.body.innerHTML;
    originalPageTitle = document.title;
    console.log("💾 已保存原始页面内容");

    button.remove();

    // 修复 Discuz 原生 JS (showWindow) 依赖的容器
    if (!document.getElementById("append_parent")) {
      const ap = document.createElement("div");
      ap.id = "append_parent";
      document.body.appendChild(ap);
    }
    if (!document.getElementById("ajaxwaitid")) {
      const aw = document.createElement("div");
      aw.id = "ajaxwaitid";
      aw.style.display = "none";
      document.body.appendChild(aw);
    }

    // 在替换页面内容之前，先提取并保存标题
    console.log("🔍 进入阅读模式，保存页面标题...");

    // 简化标题提取逻辑
    const h1Element = document.querySelector("h1.ts");
    if (h1Element) {
      const subjectSpan = h1Element.querySelector(
        '#thread_subject, span[id^="thread_subject"]'
      );
      if (subjectSpan) {
        savedThreadTitle = subjectSpan.textContent.trim();
        console.log("💾 保存标题:", savedThreadTitle);
      } else {
        savedThreadTitle = h1Element.textContent.trim();
        console.log("💾 保存h1文本:", savedThreadTitle);
      }
    } else {
      // 兜底：尝试其他方式
      const threadTitleElement = document.querySelector(
        '#thread_subject, span[id^="thread_subject"]'
      );
      if (threadTitleElement) {
        savedThreadTitle = threadTitleElement.textContent.trim();
        console.log("💾 保存标题元素:", savedThreadTitle);
      } else {
        // 最后兜底用<title>
        const pageTitle = document.title;
        savedThreadTitle = pageTitle.includes(" - ")
          ? pageTitle.split(" - ")[0].trim()
          : pageTitle.replace(/\s*-\s*百合会.*$/, "").trim();
        console.log("💾 从页面title保存:", savedThreadTitle);
      }
    }

    // 保存原始系列标题，用于后续目录搜索
    originalSeriesTitle = savedThreadTitle;
    console.log("🎯 保存原始系列标题:", originalSeriesTitle);

    // === 图片提取逻辑 ===
    // 只用 collectImagesFromDocument，避免复用噪音图片
    images = collectImagesFromDocument(document)
      .map((u) => {
        let url = String(u);
        if (url.startsWith("//")) url = "https:" + url;
        if (!/^https?:\/\//i.test(url))
          url = "https://bbs.yamibo.com/" + url.replace(/^\/+/, "");
        if (url.startsWith("http://"))
          url = url.replace(/^http:\/\//, "https://");
        url = url.replace(/^https?:\/\/https?:\/\//, "https://");
        return url;
      })
      .filter(Boolean);
    console.log("📸 提取到", images.length, "张图片，URL已处理为HTTPS");
    // 新增：预加载首图，加速 LCP
    if (images.length > 0) {
      const preload = document.createElement("link");
      preload.rel = "preload";
      preload.as = "image";
      preload.href = images[0];
      document.head.appendChild(preload);
    }
    // 检查是否已有预加载的目录数据
    if (seriesDirectory.length > 0) {
      console.log("✅ 使用预加载的目录数据:", seriesDirectory.length, "个章节");
      // 新增：如果在阅读模式，立即启用按钮
      if (isReading) {
        const prevBtn = document.getElementById("cw-prev");
        const nextBtn = document.getElementById("cw-next");
        if (prevBtn) prevBtn.disabled = !seriesDirectory.length;
        if (nextBtn) nextBtn.disabled = !seriesDirectory.length;
      }
    } else {
      // 检查持久化缓存
      const seriesKey = generateSeriesKey(savedThreadTitle);
      const cachedDirectory = getCachedDirectory(seriesKey);
      if (cachedDirectory && cachedDirectory.length > 0) {
        console.log(
          "📦 从持久化缓存加载目录:",
          cachedDirectory.length,
          "个章节"
        );
        seriesDirectory = cachedDirectory;
        // 新增：如果在阅读模式，立即启用按钮
        if (isReading) {
          const prevBtn = document.getElementById("cw-prev");
          const nextBtn = document.getElementById("cw-next");
          if (prevBtn) prevBtn.disabled = !seriesDirectory.length;
          if (nextBtn) nextBtn.disabled = !seriesDirectory.length;
        }
      } else {
        // 缓存也没有，异步搜索
        console.log("🔍 开始异步搜索目录...");
        searchSeriesDirectory(savedThreadTitle)
          .then((directory) => {
            seriesDirectory = directory;
            console.log("📋 异步获取到目录:", seriesDirectory.length, "个章节");
            // 新增：如果在阅读模式，提示用户按钮已可用
            if (isReading) {
              showErrorMessage("目录已加载完毕");
              const prevBtn = document.getElementById("cw-prev");
              const nextBtn = document.getElementById("cw-next");
              if (prevBtn) prevBtn.disabled = !seriesDirectory.length;
              if (nextBtn) nextBtn.disabled = !seriesDirectory.length;
            }
          })
          .catch((error) => {
            console.error("❌ 异步获取目录失败:", error);
          });
      }
    }

    // 渲染阅读器UI
    document.body.innerHTML = `
      <button id="cw-exit" data-tooltip="退出阅读模式">⏻</button>
      <button id="cw-refresh" data-tooltip="手动刷新 (R)">↻</button>
      <div id="cw-toolbar">
        <button id="cw-full" data-tooltip="全屏模式 (F)">⛶</button>
        <button id="cw-bg" data-tooltip="切换背景色 (B)">◐</button>
        <div id="cw-zoom">
          <button id="cw-zoom-in" data-tooltip="放大图片 (+)">﹢</button>
          <button id="cw-zoom-out" data-tooltip="缩小图片 (-)">﹣</button>
        </div>
        <button id="cw-directory" data-tooltip="查看目录 (M)">☰</button>
        <button id="cw-prev" data-tooltip="上一话">≪</button>
        <button id="cw-next" data-tooltip="下一话">≫</button>
        <button id="cw-favorite" data-tooltip="收藏">☆</button>
        <button id="cw-comment" data-tooltip="去评论">❞</button>
      </div>
      <div id="cw-container">
        <div id="cw-title-bar" class="cw-title-bar">${savedThreadTitle}</div>
        <div id="cw-image-list"></div>
      </div>
      <div id="cw-bottom-bar">
        <span id="cw-page-info">1/${images.length}</span>
        <button id="cw-to-top" data-tooltip="返回顶部 (T)">⬆</button>
      </div>
    `;
    // 重新插入阅读器样式和依赖脚本
    if (!document.getElementById("yamibo-reader-style")) {
      const styleElement = GM_addStyle(READER_CSS);
      if (styleElement) styleElement.id = "yamibo-reader-style";
    }
    if (!document.getElementById("yamibo-ionicons-module")) {
      const ioniconsModule = document.createElement("script");
      ioniconsModule.type = "module";
      ioniconsModule.src =
        "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js";
      ioniconsModule.id = "yamibo-ionicons-module";
      document.head.appendChild(ioniconsModule);
    }
    if (!document.getElementById("yamibo-ionicons-nomodule")) {
      const ioniconsNomodule = document.createElement("script");
      ioniconsNomodule.noModule = true;
      ioniconsNomodule.src =
        "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js";
      ioniconsNomodule.id = "yamibo-ionicons-nomodule";
      document.head.appendChild(ioniconsNomodule);
    }
    if (!document.getElementById("yamibo-font-link")) {
      const fontLink = document.createElement("link");
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
      fontLink.rel = "stylesheet";
      fontLink.id = "yamibo-font-link";
      document.head.appendChild(fontLink);
    }
    if (!document.getElementById("yamibo-plex-sc-font-link")) {
      const ibmFontLink = document.createElement("link");
      ibmFontLink.rel = "stylesheet";
      ibmFontLink.href =
        "https://cdn.jsdelivr.net/npm/@ibm/plex-sans-sc/css/ibm-plex-sans-sc.min.css";
      ibmFontLink.id = "yamibo-plex-sc-font-link";
      document.head.appendChild(ibmFontLink);
    }
    setTimeout(() => {
      try {
        initReaderUI(); // 渲染图片
        console.log("✅ 阅读器 UI 初始化完成");
      } catch (err) {
        console.error("❌ 初始化阅读器UI失败:", err);
      }
    }, 0);
  }

 // ====== 渲染图片统一函数 ======
  function renderImages(imgList, images) {
    if (!imgList) return;
    imgList.innerHTML = "";
    images.forEach((url, idx) => {
      const img = document.createElement("img");
      img.alt = ""; 
      img.dataset.index = String(idx + 1);
      
      img.onload = function () {
        img.classList.add("loaded"); // ✅ 加载成功后，添加 loaded 类
      };
      
      img.onerror = function () {
        img.style.backgroundImage =
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23ff6b6b'%3E图片加载失败%3C/text%3E%3C/svg%3E\")";
        img.style.backgroundColor = "#f8d7da";
        img.removeAttribute("src");
        img.dataset.error = "1";
      };
      
      imgList.appendChild(img); // 图片添加到 DOM

      getCachedImageUrl(url)
        .then((blobUrl) => {
          img.src = blobUrl;
        })
        .catch(() => {
          img.src = url;
        });
    });
  }

  // ====== 初始化阅读器UI（渲染图片并绑定按钮） ======
  function initReaderUI() {
    console.log("[initReaderUI] start");
    const container = document.getElementById("cw-container");
    if (!container) {
      console.warn("⚠️ cw-container 未找到，无法渲染图片");
      return;
    }
    // 保证有图片列表容器
    let imgList = document.getElementById("cw-image-list");
    if (!imgList) {
      imgList = document.createElement("div");
      imgList.id = "cw-image-list";
      container.appendChild(imgList);
    }
    // 设置初始缩放（使用 CSS 变量控制宽度）
    const applyZoom = () => {
      const vw = Math.max(10, Math.min(90, zoomLevel));
      document.body.style.setProperty("--img-width", `${vw}vw`);
    };
    applyZoom();
    // ===== 新增：插入标题区 =====
    let titleDiv = document.getElementById("cw-title-bar");
    if (!titleDiv) {
      titleDiv = document.createElement("div");
      titleDiv.id = "cw-title-bar";
      titleDiv.className = "cw-title-bar";
      const titleText =
        savedThreadTitle ||
        originalSeriesTitle ||
        document.title.split(" - ")[0] ||
        "漫画标题";
      titleDiv.textContent = titleText;
      container.insertBefore(titleDiv, container.firstChild);
    } else {
      const titleText =
        savedThreadTitle ||
        originalSeriesTitle ||
        document.title.split(" - ")[0] ||
        "漫画标题";
      titleDiv.textContent = titleText;
    }
    // 渲染图片列表
    renderImages(imgList, images);

    // 更新页码显示（靠近视口中心的图片）
    const pageInfo = document.getElementById("cw-page-info");
    function updateCurrentPageInfo() {
      const imgs = container.querySelectorAll("img");
      if (!imgs.length) return;
      if (window.scrollY < 50) {
        if (pageInfo) pageInfo.textContent = `1/${imgs.length}`;
        return;
      }

      const viewportMid = window.innerHeight / 2;
      let current = 1;
      let minDist = Infinity;

      imgs.forEach((img, i) => {
        const rect = img.getBoundingClientRect();
        const imgMidRel = rect.top + rect.height / 2;
        const dist = Math.abs(imgMidRel - viewportMid);

        if (dist < minDist) {
          minDist = dist;
          current = i + 1;
        }
      });

      if (pageInfo) pageInfo.textContent = `${current}/${imgs.length}`;
    }
    // 退出、目录、全屏、背景、缩放、回顶部
    readerEventHandlers.onExitClick = () => exitReader();
    readerEventHandlers.onDirectoryClick = () => {
      const overlay = document.getElementById("directory-overlay");
      const sidebar = document.getElementById("directory-sidebar");
      if (overlay || sidebar) {
        try {
          if (overlay) overlay.classList.remove("show");
          if (sidebar) sidebar.classList.remove("open");
          setTimeout(() => {
            try {
              if (overlay) overlay.remove();
            } catch (e) {}
            try {
              if (sidebar) sidebar.remove();
            } catch (e) {}
          }, 300);
        } catch (e) {}
        return;
      }
      showDirectoryModal();
    };
    readerEventHandlers.onFullClick = async () => {
      try {
        if (!document.fullscreenElement)
          await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch (e) {
        console.warn("全屏切换失败:", e);
      }
    };
    readerEventHandlers.onBgClick = () => {
      bgIsBlack = !bgIsBlack;
      if (bgIsBlack) {
        document.body.classList.remove("light-bg");
      } else {
        document.body.classList.add("light-bg");
      }
    };
    readerEventHandlers.onZoomIn = () => {
      zoomLevel = Math.min(90, zoomLevel + 5);
      applyZoom();
    };
    readerEventHandlers.onZoomOut = () => {
      zoomLevel = Math.max(10, zoomLevel - 5);
      applyZoom();
    };
    readerEventHandlers.onToTop = () =>
      window.scrollTo({ top: 0, behavior: "smooth" });

    const throttle = (fn, wait = 100) => {
      let t = null;
      return (...args) => {
        if (t) return;
        t = setTimeout(() => {
          fn(...args);
          t = null;
        }, wait);
      };
    };

    readerEventHandlers.updateCurrentPageInfo = throttle(
      updateCurrentPageInfo,
      120
    );

    // 工具栏显示控制
    readerEventHandlers.showTools = function () {
      try {
        document.documentElement.classList.add("tools-visible");
        if (readerToolsTimer) clearTimeout(readerToolsTimer);
        readerToolsTimer = setTimeout(() => {
          document.documentElement.classList.remove("tools-visible");
          readerToolsTimer = null;
        }, 3000);
      } catch (e) {
        // ignore
      }
    };

    readerEventHandlers.onMousemove = readerEventHandlers.showTools;
    readerEventHandlers.onKeydown = function (e) {
      try {
        // 工具栏显示
        readerEventHandlers.showTools();

        // 输入框内不触发快捷键
        const tag = e.target && e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;

        // 避免与浏览器系统刷新等冲突（Cmd/Ctrl 修饰键）
        if (e.metaKey || e.ctrlKey) return;

        const k = e.key;
        // 刷新图片 (R)
        if (k === "r" || k === "R") {
          e.preventDefault();
          manualRefresh();
          return;
        }
        // 全屏 (F)
        if (k === "f" || k === "F") {
          e.preventDefault();
          readerEventHandlers.onFullClick();
          return;
        }
        // 背景色切换 (B)
        if (k === "b" || k === "B") {
          e.preventDefault();
          readerEventHandlers.onBgClick();
          return;
        }
        // 目录 (M)
        if (k === "m" || k === "M") {
          e.preventDefault();
          readerEventHandlers.onDirectoryClick();
          return;
        }
        // 放大 (+ 或 =)
        if (k === "+" || k === "=") {
          e.preventDefault();
          readerEventHandlers.onZoomIn();
          return;
        }
        // 缩小 (-)
        if (k === "-" || k === "_") {
          e.preventDefault();
          readerEventHandlers.onZoomOut();
          return;
        }
        // 返回顶部 (T)
        if (k === "t" || k === "T") {
          e.preventDefault();
          readerEventHandlers.onToTop();
          return;
        }
      } catch (err) {}
    };

    readerEventHandlers.onFullscreen = function () {
      if (document.fullscreenElement) {
        readerEventHandlers.showTools();
      } else {
        document.documentElement.classList.remove("tools-visible");
        if (readerToolsTimer) {
          clearTimeout(readerToolsTimer);
          readerToolsTimer = null;
        }
      }
    };

    // ===== 工具栏按钮事件统一绑定 =====
    function initToolbarEvents() {
      const exitBtn = document.getElementById("cw-exit");
      if (exitBtn)
        exitBtn.addEventListener("click", readerEventHandlers.onExitClick);

      const dirBtn = document.getElementById("cw-directory");
      if (dirBtn)
        dirBtn.addEventListener("click", readerEventHandlers.onDirectoryClick);

      const fullBtn = document.getElementById("cw-full");
      if (fullBtn)
        fullBtn.addEventListener("click", readerEventHandlers.onFullClick);

      const bgBtn = document.getElementById("cw-bg");
      if (bgBtn) bgBtn.addEventListener("click", readerEventHandlers.onBgClick);

      const zoomIn = document.getElementById("cw-zoom-in");
      const zoomOut = document.getElementById("cw-zoom-out");
      if (zoomIn)
        zoomIn.addEventListener("click", readerEventHandlers.onZoomIn);
      if (zoomOut)
        zoomOut.addEventListener("click", readerEventHandlers.onZoomOut);

      const toTop = document.getElementById("cw-to-top");
      if (toTop) toTop.addEventListener("click", readerEventHandlers.onToTop);

      const refreshBtn = document.getElementById("cw-refresh");
      if (refreshBtn) refreshBtn.addEventListener("click", manualRefresh);

      // 上一话、下一话、收藏、去评论
      const prevBtn = document.getElementById("cw-prev");
      const nextBtn = document.getElementById("cw-next");
      // 初始时根据目录数据禁用/启用
      if (prevBtn) prevBtn.disabled = !seriesDirectory.length;
      if (nextBtn) nextBtn.disabled = !seriesDirectory.length;
      const favBtn = document.getElementById("cw-favorite");
      const commentBtn = document.getElementById("cw-comment");

      // 上一话
      if (prevBtn)
        prevBtn.onclick = async () => {
          const currentTid = String(getCurrentThreadId());
          const idx = seriesDirectory.findIndex(
            (item) => String(item.threadId) === currentTid
          );
          if (idx > 0) {
            const prevItem = seriesDirectory[idx - 1];
            await loadNewChapter(prevItem.url, prevItem.title);
          } else {
            showErrorMessage("已经是第一话了");
          }
        };

      // 下一话
      if (nextBtn)
        nextBtn.onclick = async () => {
          const currentTid = String(getCurrentThreadId());
          const idx = seriesDirectory.findIndex(
            (item) => String(item.threadId) === currentTid
          );
          if (idx !== -1 && idx < seriesDirectory.length - 1) {
            const nextItem = seriesDirectory[idx + 1];
            await loadNewChapter(nextItem.url, nextItem.title);
          } else {
            showErrorMessage("已经是最后一话了");
          }
        };

      // 收藏
      if (favBtn)
        favBtn.onclick = async () => {
          if (favBtn.dataset.loading) return;
          favBtn.dataset.loading = true;
          favBtn.style.opacity = "0.7";
          // 兼容<i>或纯文本
          const iTag = favBtn.querySelector("i");
          const originalText = iTag ? iTag.innerText : favBtn.innerText;
          if (iTag) iTag.innerText = "...";
          else favBtn.innerText = "...";
          const tid = getCurrentThreadId();
          const href = `/home.php?mod=spacecp&ac=favorite&type=thread&id=${tid}`;
          try {
            const res = await fetch(href + "&infloat=yes&handlekey=k_favorite");
            const text = await res.text();
            if (text.includes("成功") || text.includes("succeed")) {
              showErrorMessage("收藏成功");
              favBtn.classList.add("active");
              if (iTag) iTag.innerText = "★";
              else favBtn.innerText = "★";
            } else if (text.includes("重复") || text.includes("repeat")) {
              showErrorMessage("已收藏");
              if (iTag) iTag.innerText = "★";
              else favBtn.innerText = "★";
            } else {
              showErrorMessage("请求已发送");
              if (iTag) iTag.innerText = originalText;
              else favBtn.innerText = originalText;
            }
          } catch (err) {
            showErrorMessage("请求失败");
            if (iTag) iTag.innerText = originalText;
            else favBtn.innerText = originalText;
          } finally {
            favBtn.dataset.loading = false;
            favBtn.style.opacity = "1";
          }
        };

      // 去评论
      if (commentBtn)
        commentBtn.onclick = () => {
          exitReader();
          setTimeout(() => {
            const fastpost = document.getElementById("fastpostmessage");
            if (fastpost) {
              fastpost.scrollIntoView({ behavior: "smooth", block: "center" });
              fastpost.focus();
            }
          }, 500);
        };
    }

    // ====== 绑定所有工具栏事件 ======
    initToolbarEvents();
    // 全局事件绑定
    if (!readerEventsBound) {
      window.addEventListener(
        "scroll",
        readerEventHandlers.updateCurrentPageInfo,
        { passive: true }
      );
      window.addEventListener("mousemove", readerEventHandlers.onMousemove, {
        passive: true,
      });
      window.addEventListener("keydown", readerEventHandlers.onKeydown, {
        passive: true,
      });
      
      document.addEventListener(
        "fullscreenchange",
        readerEventHandlers.onFullscreen
      );
      readerEventsBound = true;
    }

    // 立即更新一次页码并短暂显示工具栏
    setTimeout(updateCurrentPageInfo, 200);
    readerEventHandlers.showTools();

    // 提供解绑函数，供 exitReader 调用
      unbindReaderEvents = function () {
        try {
          if (!readerEventsBound) return;

        // 移除 DOM 绑定
        try {
          if (exitBtn)
            exitBtn.removeEventListener(
              "click",
              readerEventHandlers.onExitClick
            );
        } catch (e) {}
        try {
          if (dirBtn)
            dirBtn.removeEventListener(
              "click",
              readerEventHandlers.onDirectoryClick
            );
        } catch (e) {}
        try {
          if (fullBtn)
            fullBtn.removeEventListener(
              "click",
              readerEventHandlers.onFullClick
            );
        } catch (e) {}
        try {
          if (bgBtn)
            bgBtn.removeEventListener("click", readerEventHandlers.onBgClick);
        } catch (e) {}
        try {
          if (zoomIn)
            zoomIn.removeEventListener("click", readerEventHandlers.onZoomIn);
        } catch (e) {}
        try {
          if (zoomOut)
            zoomOut.removeEventListener("click", readerEventHandlers.onZoomOut);
        } catch (e) {}
        try {
          if (toTop)
            toTop.removeEventListener("click", readerEventHandlers.onToTop);
        } catch (e) {}

        // 移除全局事件
        try {
          window.removeEventListener(
            "scroll",
            readerEventHandlers.updateCurrentPageInfo,
            { passive: true }
          );
        } catch (e) {}
        try {
          window.removeEventListener(
            "mousemove",
            readerEventHandlers.onMousemove,
            { passive: true }
          );
        } catch (e) {}
        try {
          window.removeEventListener("keydown", readerEventHandlers.onKeydown, {
            passive: true,
          });
        } catch (e) {}
        try {
          document.removeEventListener(
            "fullscreenchange",
            readerEventHandlers.onFullscreen
          );
        } catch (e) {}
      } catch (e) {
        // ignore
      }
      // 清理定时器与状态
      if (readerToolsTimer) {
        clearTimeout(readerToolsTimer);
        readerToolsTimer = null;
      }
      readerEventHandlers = {};
      readerEventsBound = false;
      unbindReaderEvents = null;
    };

    // 立即初始化阅读器 UI
    //  initReaderUI();
  }

  /*** 退出阅读模式 ***/
  function exitReader() {
    isReading = false;
    setAutoReaderStatus(false); // 关闭全局阅读器模式

    // 解绑阅读器事件
    try {
      if (typeof unbindReaderEvents === "function") unbindReaderEvents();
    } catch (e) {}

    // 退出全屏
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((e) => {});
    }
    // 如果当前 URL 和进入时的 URL 不一致，说明用户切换了章节
    if (readerStartUrl && window.location.href !== readerStartUrl) {
      window.location.reload();
      return;
    }

    // 如果 URL 没变，说明还是原来那个帖子，直接恢复 DOM 快照（秒开，无需刷新）
    if (originalPageHTML) {
      console.log("🔄 恢复原始页面内容...");

      // 移除阅读器样式
      const readerStyle = document.getElementById("yamibo-reader-style");
      if (readerStyle) {
        readerStyle.remove();
        console.log("🧹 已移除阅读器样式");
      }

      const loaderStyle = document.getElementById("chapter-loader-style");
      if (loaderStyle) loaderStyle.remove();

      document.body.innerHTML = originalPageHTML;
      document.title = originalPageTitle;

      // 重新绑定入口按钮事件
      const restoredButton = document.getElementById("reader-toggle");
      if (restoredButton) {
        restoredButton.addEventListener("click", () => {
          if (!isReading) {
            enterReader();
            setAutoReaderStatus(true);
          } else {
            exitReader();
          }
        });
      }
      console.log("✅ 页面内容已恢复");
    } else {
      location.reload();
    }
  }
  // 无缝章节加载：加载提示与错误显示
  function showLoadingIndicator(message = "正在加载章节...") {
    try {
      // 移除已存在的加载提示
      const existing = document.getElementById("chapter-loader");
      if (existing) existing.remove();

      const loader = document.createElement("div");
      loader.id = "chapter-loader";
      loader.innerHTML = `
        <div class="loader-content">
          <div class="loader-spinner"></div>
          <div class="loader-text">${message}</div>
        </div>
      `;

      const style = document.createElement("style");
      style.id = "chapter-loader-style";
      style.textContent = `
        #chapter-loader, #chapter-error-msg { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:2147483648; }
        #chapter-loader .loader-content, #chapter-error-msg .loader-content { color:#fff; padding:18px 24px; border-radius:10px; background: rgba(0,0,0,0.45); text-align:center; }
        #chapter-loader .loader-spinner, #chapter-error-msg .loader-spinner { width:30px; height:30px; border:3px solid rgba(255,255,255,0.25); border-top:3px solid #fff; border-radius:50%; animation: yamibo-spin 1s linear infinite; margin:0 auto 8px }
        @keyframes yamibo-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        #chapter-loader .loader-text, #chapter-error-msg .loader-text { font-size:14px; }
      `;

      document.head.appendChild(style);
      document.body.appendChild(loader);
    } catch (e) {
      console.warn("showLoadingIndicator error", e);
    }
  }

  function hideLoadingIndicator() {
    try {
      const loader = document.getElementById("chapter-loader");
      if (loader) {
        loader.remove();
      }
      const style = document.getElementById("chapter-loader-style");
      if (style) style.remove();
    } catch (e) {
      // ignore
    }
  }
// ====== 刷新和工具函数 (新添加) ======

  function manualRefresh() {
    // 1. 获取图片容器（ID 在 initReaderUI 中定义）
    const cwContainer = document.getElementById('cw-container');
    
    // 2. 检查全局图片列表 'images' 和容器是否存在
    // 假设 'images' 是全局变量，存储了当前章节的图片 URL 数组
    if (!cwContainer || !Array.isArray(images) || images.length === 0) {
        console.error("❌ 无法重新渲染图片：图片容器或图片列表为空。");
        showErrorMessage("图片列表为空或容器未找到。");
        return;
    }

    // 3. 调用图片渲染函数
    console.log("手动刷新：重新渲染图片...");
    showLoadingIndicator(); 
    
    // 假设 renderImages(containerElement, imageListArray)
    // 这是您脚本中实际渲染图片的函数
    renderImages(cwContainer, images); 
    
    // 滚动到顶部 (可选)
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 延迟隐藏加载指示器，给用户一个反馈
    setTimeout(hideLoadingIndicator, 300);
}

  

  function showErrorMessage(message) {
    try {
      const id = "chapter-error-msg";
      const existing = document.getElementById(id);
      if (existing) existing.remove();

      let style = document.getElementById("chapter-loader-style");
      if (!style) {
        style = document.createElement("style");
        style.id = "chapter-loader-style";
        style.textContent = `
          #chapter-loader, #chapter-error-msg { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:2147483648; }
          #chapter-loader .loader-content, #chapter-error-msg .loader-content { color:#fff; padding:18px 24px; border-radius:10px; background: rgba(0,0,0,0.45); text-align:center; }
          #chapter-loader .loader-spinner, #chapter-error-msg .loader-spinner { width:30px; height:30px; border:3px solid rgba(255,255,255,0.25); border-top:3px solid #fff; border-radius:50%; animation: yamibo-spin 1s linear infinite; margin:0 auto 8px }
          @keyframes yamibo-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          #chapter-loader .loader-text, #chapter-error-msg .loader-text { font-size:14px; }
        `;
        document.head.appendChild(style);
      }

      const el = document.createElement("div");
      el.id = id;
      el.innerHTML = `
        <div class="loader-content">
          <div class="loader-text">${message}</div>
        </div>
      `;
      document.body.appendChild(el);
      setTimeout(() => {
        try {
          el.remove();
        } catch (e) {}
      }, 2500);
    } catch (e) {
      console.warn("showErrorMessage error", e);
    }
  }

  // 无缝章节切换
  async function loadNewChapter(chapterUrl, chapterTitle) {
    try {
      console.log("📖 开始无缝加载章节:", chapterTitle);
      showLoadingIndicator("正在加载章节...");

      const response = await fetch(chapterUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3",
          Referer: window.location.href,
          "User-Agent": navigator.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // 提取图片 URL
      const newImages = collectImagesFromDocument(doc)
        .map((u) => {
          if (!u) return null;
          let url = String(u);
          if (url.startsWith("//")) url = "https:" + url;
          if (!/^https?:\/\//i.test(url))
            url = "https://bbs.yamibo.com/" + url.replace(/^\/+/, "");
          if (url.startsWith("http://"))
            url = url.replace(/^http:\/\//, "https://");
          url = url.replace(/^https?:\/\/https?:\/\//, "https://");
          return url;
        })
        .filter(Boolean);

      if (!newImages || newImages.length === 0) {
        hideLoadingIndicator();
        showErrorMessage("未找到漫画图片，已跳转到原帖");
        location.href = chapterUrl;
        return;
      }

      // 更新全局图片数组
      images = newImages;
      // 更新标题栏
      const titleDiv = document.getElementById("cw-title-bar");
      if (titleDiv)
        titleDiv.textContent =
          savedThreadTitle ||
          originalSeriesTitle ||
          document.title.split(" - ")[0] ||
          "漫画标题";
      // 尝试提取并保存新章节标题
      const newH1 = doc.querySelector("h1.ts");
      if (newH1) {
        const subjectSpan = newH1.querySelector(
          '#thread_subject, span[id^="thread_subject"]'
        );
        savedThreadTitle = subjectSpan
          ? subjectSpan.textContent.trim()
          : newH1.textContent.trim();
      } else {
        const newTitleEl = doc.querySelector(
          '#thread_subject, span[id^="thread_subject"]'
        );
        if (newTitleEl) savedThreadTitle = newTitleEl.textContent.trim();
      }

      // 更新浏览器地址栏（不刷新页面）
      try {
        window.history.pushState({}, "", chapterUrl);
      } catch (e) {
        /* ignore */
      }

      // 统一刷新UI（标题、图片、缩放、按钮等）
      initReaderUI();
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: "smooth" });

      hideLoadingIndicator();

      console.log("🎉 章节加载完成:", chapterTitle);
    } catch (error) {
      console.error("❌ 加载章节失败:", error);
      hideLoadingIndicator();
      showErrorMessage(
        "加载章节失败: " +
          (error && error.message ? error.message : String(error))
      );
      // 若失败，1s 后回退到原帖（避免卡死在阅读器）
      setTimeout(() => {
        try {
          location.href = chapterUrl;
        } catch (e) {}
      }, 1000);
    }
  }

  // 手动清理缓存功能
  if (typeof unsafeWindow !== "undefined") {
    unsafeWindow.clearAllCache = clearAllCache;
    unsafeWindow.viewCacheStatus = viewCacheStatus;
  } else {
    window.clearAllCache = clearAllCache;
    window.viewCacheStatus = viewCacheStatus;
  }
})();