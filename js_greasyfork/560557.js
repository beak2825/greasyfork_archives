// ==UserScript==
// @name         小红书网页直播界面美化
// @namespace    https://greasyfork.org/zh-CN/users/1553511
// @version      1.3.0
// @description  1.自动点击播放，去除底部打开APP按钮。2.调整视频为全屏显示，弹幕区域悬浮在左下
// @author       Ling77 & MAXLZ
// @license      MIT
// @icon         https://www.xiaohongshu.com/favicon.ico
// @match        https://www.xiaohongshu.com/livestream/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://update.greasyfork.org/scripts/561258/1726820.js
// @homepageURL  https://greasyfork.org/zh-CN/users/1553511-ling77
// @downloadURL https://update.greasyfork.org/scripts/560557/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%9B%B4%E6%92%AD%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560557/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%9B%B4%E6%92%AD%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  let CONFIG = {
    danmuArea: {
      display: true,
      height: '60%',
      width: '30%',
      position: '左下',
      opacity: 1,
      alignRight: false
    }
  };
  const ScriptName = '小红书网页直播界面美化';
  const Position = [ {
    label: '左上',
    inset: '20px auto auto 20px'
  }, {
    label: '左下',
    inset: 'auto auto 20px 20px'
  }, {
    label: '右上',
    inset: '20px 20px auto auto'
  }, {
    label: '右下',
    inset: 'auto 20px 20px auto'
  } ];
  function parseConfig() {
    let result = {
      danmuArea: {
        ...CONFIG.danmuArea
      }
    };
    result.danmuArea.inset = Position.find(item => item.label === result.danmuArea.position)?.inset;
    delete result.danmuArea.display;
    delete result.danmuArea.position;
    return result;
  }
  function settingPage() {
    const myConfigData = {
      title: ScriptName + ' - 脚本设置',
      desp: '不会对设置项进行验证，如果输错导致界面显示异常请重置数据',
      fields: {
        a: {
          groups: {
            danmuArea: {
              label: '弹幕区域',
              desp: '弹幕区域显示效果自定义',
              items: {
                display: {
                  label: '显示弹幕',
                  type: "boolean"
                },
                height: {
                  label: "高度",
                  desp: "支持绝对像素值 (500px) 和相对百分比 (50%)",
                  type: "text"
                },
                width: {
                  label: "宽度",
                  desp: "支持绝对像素值 (500px) 和相对百分比 (50%)",
                  type: "text"
                },
                position: {
                  label: "位置",
                  type: "select",
                  style: "dropdown",
                  options: Position.map(({label}) => label)
                },
                alignRight: {
                  label: '弹幕靠右时右对齐',
                  type: "boolean"
                },
                opacity: {
                  label: "透明度",
                  desp: "0-1，0为完全透明，1为完全不透胆",
                  type: "number",
                  min: 0,
                  max: 1,
                  step: .1
                }
              }
            }
          }
        }
      }
    };
    const settings = new GM_ConfigUI({
      config: myConfigData,
      onSave: data => {
        CONFIG = data.a;
        GM_setValue("config", JSON.stringify(CONFIG));
      },
      defaultData: {
        a: CONFIG
      }
    });
    if (!GM_getValue("config")) GM_setValue("config", JSON.stringify(CONFIG)); else {
      CONFIG = JSON.parse(GM_getValue("config"));
      settings.updateData({
        a: CONFIG
      });
    }
    GM_registerMenuCommand("打开设置", () => settings.open());
  }
  function addStyle(cssCode) {
    const style = document.createElement('style');
    style.innerHTML = cssCode;
    document.head.appendChild(style);
  }
  function isMobile() {
    return /Android|iPhone|iPad|Mobile|Phone/i.test(navigator.userAgent);
  }
  function bootstrap() {
    const title = document.querySelector(".livestream-container .title");
    if (title && title.textContent.includes("直播已结束")) return;
    document.body.style.width = "100%";
    window.addEventListener("load", function() {
      const playerEl = document.querySelector("#playerEl");
      if (!playerEl) return;
      const startDom = playerEl.querySelector(".xgplayer-start");
      const videoDom = playerEl.querySelector("video");
      if (startDom) if (!isMobile()) startDom.click(); else startDom.dispatchEvent(new Event('touchend', {
        bubbles: true,
        cancelable: true
      }));
      const bottomButton = document.querySelector(".fixed-bottom-button.live-fixed-bottom-button");
      const poster = playerEl.querySelector(".xgplayer-poster");
      const livestreamContainer = document.querySelector(".livestream-container");
      if (livestreamContainer) {
        const callback = mutationList => {
          mutationList.forEach(mutation => {
            if (mutation.type === "childList") {
              const addedNodes = mutation.addedNodes;
              for (let index = 0; index < addedNodes.length; index++) {
                const node = addedNodes[index];
                if (node instanceof HTMLElement && node.classList.contains("comment-container")) {
                  if (!CONFIG.danmuArea.display) node.style.display = 'none'; else {
                    Object.assign(node.style, parseConfig().danmuArea, {
                      position: 'fixed',
                      zIndex: '9999',
                      '-webkit-mask-image': 'none'
                    });
                    if (CONFIG.danmuArea.alignRight && CONFIG.danmuArea.position.startsWith('右')) addStyle('.comment-item { align-self: flex-end !important }');
                  }
                  mutationObserver.disconnect();
                }
              }
            }
          });
        };
        const mutationObserver = new MutationObserver(callback);
        mutationObserver.observe(livestreamContainer, {
          attributes: false,
          subtree: false,
          childList: true
        });
      }
      if (videoDom) videoDom.style.objectFit = "contain";
      bottomButton?.remove();
      if (poster) {
        const matches = poster.style.backgroundImage.match(/http(s?).*(?="\))/);
        if (!matches) return;
        const img = matches[0];
        const backgroundPosterId = "backgroundPoster";
        if (!playerEl.querySelector(`#${backgroundPosterId}`)) {
          const backgroundDiv = document.createElement("div");
          backgroundDiv.id = backgroundPosterId;
          backgroundDiv.setAttribute("style", `position: absolute; width: 100%; height: 100%; background: center / cover no-repeat url(${img}); filter: blur(30px);`);
          playerEl.appendChild(backgroundDiv);
        }
      }
    });
  }
  settingPage();
  bootstrap();
})();
