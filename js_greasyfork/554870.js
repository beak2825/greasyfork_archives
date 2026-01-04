// ==UserScript==
// @name                万能超星学习通助手（免费）｜可调倍数｜💯自动答题｜▶️自动刷课｜AI辅助答题｜功能齐全｜收录题库｜解放双手⚡一键操作｜✨字体解密｜📝最新题库自动更新）｜支持AI搜题｜🔔课桌通知
// @version             1.0.0
// @description         超星万能助手（免费）是一个功能强大的浏览器脚本，旨在帮助用户更高效地完成超星学习通平台上的学习任务。本项目基于开源技术，使用ChatGPT智能引擎进行答题，使用自有收录题库。一键安装，一键使用，内置详细使用教程，支持单选题，多选题，填空题，图文题，视频倍数，简答题，章节测验，课后测验，听力题，期末考试等，本脚本仅供个人研究学习使用，请勿用于非法用途，产生一切法律责任用户自行承担。具体的功能请查看脚本悬浮窗中的教程页面，蜜雪冰城官网题库 https://tk.mixuelo.cc/ 群聊2：623921548 官网题库 https://tk.mixuelo.cc/
// @author            
// @namespace           https://github.com/MiXue-Lo/MiXue-ChaoXing
// @license             MIT
// @supportURL          https://github.com/MiXue-Lo/MiXue-ChaoXing/issues
// @match               *://*.chaoxing.com/*
// @match               *://*.edu.cn/*
// @match               *://*.nbdlib.cn/*
// @match               *://*.uooc.net.cn/*
// @connect             tk.mixuelo.cc
// @connect             tk.mixuelo.cc
// @run-at              document-end
// @grant               unsafeWindow
// @grant               GM_xmlhttpRequest
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_info
// @grant               GM_getResourceText
// @grant               GM_notification
// @grant               GM_registerMenuCommand
// @grant               GM_openInTab
// @grant               GM_addStyle
// @icon                https://scriptcat.org/api/v2/users/165553/avatar
// @require             https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require             https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32
// @require  		    https://code.jquery.com/jquery-3.7.1.js5@0.8.3/src/md5.min.js
// @compatible          chrome 80以上版本
// @compatible          firefox 75以上版本
// @compatible          edge 最新版本
// @downloadURL https://update.greasyfork.org/scripts/554870/%E4%B8%87%E8%83%BD%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B%EF%BC%88%E5%85%8D%E8%B4%B9%EF%BC%89%EF%BD%9C%E5%8F%AF%E8%B0%83%E5%80%8D%E6%95%B0%EF%BD%9C%F0%9F%92%AF%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BD%9C%E2%96%B6%EF%B8%8F%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BD%9CAI%E8%BE%85%E5%8A%A9%E7%AD%94%E9%A2%98%EF%BD%9C%E5%8A%9F%E8%83%BD%E9%BD%90%E5%85%A8%EF%BD%9C%E6%94%B6%E5%BD%95%E9%A2%98%E5%BA%93%EF%BD%9C%E8%A7%A3%E6%94%BE%E5%8F%8C%E6%89%8B%E2%9A%A1%E4%B8%80%E9%94%AE%E6%93%8D%E4%BD%9C%EF%BD%9C%E2%9C%A8%E5%AD%97%E4%BD%93%E8%A7%A3%E5%AF%86%EF%BD%9C%F0%9F%93%9D%E6%9C%80%E6%96%B0%E9%A2%98%E5%BA%93%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%EF%BC%89%EF%BD%9C%E6%94%AF%E6%8C%81AI%E6%90%9C%E9%A2%98%EF%BD%9C%F0%9F%94%94.user.js
// @updateURL https://update.greasyfork.org/scripts/554870/%E4%B8%87%E8%83%BD%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B%EF%BC%88%E5%85%8D%E8%B4%B9%EF%BC%89%EF%BD%9C%E5%8F%AF%E8%B0%83%E5%80%8D%E6%95%B0%EF%BD%9C%F0%9F%92%AF%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BD%9C%E2%96%B6%EF%B8%8F%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BD%9CAI%E8%BE%85%E5%8A%A9%E7%AD%94%E9%A2%98%EF%BD%9C%E5%8A%9F%E8%83%BD%E9%BD%90%E5%85%A8%EF%BD%9C%E6%94%B6%E5%BD%95%E9%A2%98%E5%BA%93%EF%BD%9C%E8%A7%A3%E6%94%BE%E5%8F%8C%E6%89%8B%E2%9A%A1%E4%B8%80%E9%94%AE%E6%93%8D%E4%BD%9C%EF%BD%9C%E2%9C%A8%E5%AD%97%E4%BD%93%E8%A7%A3%E5%AF%86%EF%BD%9C%F0%9F%93%9D%E6%9C%80%E6%96%B0%E9%A2%98%E5%BA%93%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%EF%BC%89%EF%BD%9C%E6%94%AF%E6%8C%81AI%E6%90%9C%E9%A2%98%EF%BD%9C%F0%9F%94%94.meta.js
// ==/UserScript==

// 定义API基础URL，方便统一管理和修改
const API_BASE_URL = (() => {
  // 确保API URL使用与当前页面相同的协议（避免混合内容问题）
  const baseUrl = "tk.mixuelo.cc/api.php";
  const protocol = window.location.protocol; // 当前页面的协议
  if (protocol === 'https:') {
    return "https://" + baseUrl;
  } else {
    return "http://" + baseUrl;
  }
})();

/*
 * 超星万能助手
 * 版本: 1.0.0
 * 
 * 功能特色:
 * 1. 智能AI答题系统 - 使用先进算法匹配选项
 * 2. 人工智能匹配 - 多种方式识别正确答案
 * 3. 桌面通知系统 - 任务完成提醒
 * 4. 自定义界面 - 可拖拽面板
 * 5. 优化的字体解密功能
 * 6. 支持大部分高校超星系统
 * 
 * 答题优先级说明:
 * 1. 系统首先尝试在题库中查找答案
 * 2. 若题库中未找到答案，根据设置尝试使用AI回答
 * 3. 若AI未开启或无法提供答案，会尝试随机答题(如已开启)
 * 4. 所有方法都失败时，将提示用户手动选择答案
 * 
 * 更新日志:
 * v1.0.0 - 首次发布
 * 
 * 项目主页: https://github.com/MiXue-Lo/MiXue-ChaoXing
 */

/*********************************自定义配置区******************************************************** */
var setting = {
  // 基础界面设置
  showBox: 1,             // 显示脚本浮窗，0为关闭，1为开启
  darkMode: 0,            // 深色模式，0为关闭，1为开启
  panelPosition: 'right', // 控制面板位置，可选 'left', 'right'

  // 任务处理设置
  task: 0,                // 只处理任务点任务，0为关闭，1为开启
  taskInterval: 3000,     // 任务切换间隔时间，默认3秒

  // 媒体处理设置
  video: 1,               // 处理视频，0为关闭，1为开启
  audio: 1,               // 处理音频，0为关闭，1为开启
  rate: 2,                // 视频/音频倍速，0为秒过，1为正常速率，最高16倍
  muteMedia: 0,           // 静音播放，0为关闭，1为开启
  review: 0,              // 复习模式，0为关闭，1为开启可以补挂视频时长

  // 答题设置
  work: 1,                // 测验自动处理，0为关闭，1为开启
  time: 1000,             // 答题时间间隔，默认1s=1000ms
  randomTime: 0,          // 随机答题时间，0为关闭，1为开启，在time基础上随机±500ms
  sub: 0,                 // 测验自动提交，0为关闭,1为开启
  force: 0,               // 测验强制提交，0为关闭，1为开启
  share: 0,               // 自动收录答案，0为关闭，1为开启
  decrypt: 1,             // 字体解密，0为关闭，1为开启

  // 考试设置
  examTurn: 0,            // 考试自动跳转下一题，0为关闭，1为开启
  examTurnTime: 0,        // 考试自动跳转下一题随机间隔时间(3-7s)之间，0为关闭，1为开启
  goodStudent: 1,         // 好学生模式,不自动选择答案,仅提示答案
  alterTitle: 1,          // 修改题目,将AI回复的答案插入题目中

  // AI设置
  aiMode: 'smart',        // AI模式: 'smart'-智能匹配, 'letter'-优先识别字母, 'content'-优先内容匹配
  aiConfidence: 80,       // AI匹配置信度，低于此值会提示可能不准确，范围0-100

  // 通知设置
  desktopNotify: 1,       // 桌面通知，0为关闭，1为开启
  soundNotify: 0,         // 声音通知，0为关闭，1为开启

  // 登录设置
  autoLogin: 0,           // 自动登录，0为关闭，1为开启
  phone: '',              // 登录手机号/超星号
  password: ''            // 登录密码
}

// 高级设置 - 请勿修改除非您知道您在做什么
var advancedSetting = {
  apiEndpoint: 'http://tk.mixuelo.cc/api/v1',
  apiTimeout: 10000,
  apiRetry: 2,
  debugMode: 0
}

var _w = unsafeWindow,
  _l = location,
  _d = _w.document,
  $ = _w.jQuery || top.jQuery,
  md5 = md5 || window.md5,
  UE = _w.UE,
  Swal = Swal || window.Swal,
  _host = "";

var _host = "http://tk.mixuelo.cc";
var _mlist, _defaults, _domList, $subBtn, $saveBtn, $frame_c;
var reportUrlChange = 0;


const style = document.createElement('style');
style.id = 'gpt-box-styles';
style.textContent = `
    .gpt-box {
        position: fixed !important;
        top: 80px !important;  
        right: 10px !important;
        width: 300px !important;
        max-height: 400px !important;
        overflow-y: auto !important;
        background: rgba(255, 255, 255, 0.95) !important;
        border-radius: 10px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        z-index: 2147483647 !important; 
        padding: 15px !important;
        font-family: "Microsoft YaHei", sans-serif !important;
        transition: all 0.3s ease !important;
        animation: slideIn 0.5s ease !important;
        cursor: move !important; 
        transform: none !important;
        margin: 0 !important;
    }
    
    
    .gpt-box-header {
        cursor: move;
        padding: 5px 0;
        margin-bottom: 10px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .gpt-box-title {
        font-weight: bold;
        color: #FC3A72;
    }
    
    .gpt-box-actions {
        display: flex;
        gap: 8px;
    }
    
    .gpt-box-actions button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 12px;
        color: #888;
        padding: 2px 5px;
        border-radius: 3px;
    }
    
    .gpt-box-actions button:hover {
        background: #f5f5f5;
        color: #FC3A72;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .gpt-box:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    
    .gpt-box::-webkit-scrollbar {
        width: 6px;
    }
    .gpt-box::-webkit-scrollbar-thumb {
        background: #FC3A72;
        border-radius: 3px;
    }
    .gpt-message {
        margin: 8px 0;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        line-height: 1.5;
        word-break: break-all;
    }
    .gpt-message.pink {
        background: #fce4ec;
        color: #e91e63;
        border-left: 4px solid #e91e63;
    }
    .gpt-message.orange {
        background: #fff3e0;
        color: #ff9800;
        border-left: 4px solid #ff9800;
    }
    .gpt-message.red {
        background: #ffebee;
        color: #f44336;
        border-left: 4px solid #f44336;
    }
    .gpt-message.purple {
        background: #f3e5f5;
        color: #9c27b0;
        border-left: 4px solid #9c27b0;
    }
    .gpt-message.green {
        background: #e8f5e9;
        color: #4caf50;
        border-left: 4px solid #4caf50;
    }
    .gpt-message.blue {
        background: #e3f2fd;
        color: #2196f3;
        border-left: 4px solid #2196f3;
    }
    .gpt-messages-container {
        max-height: 350px;
        overflow-y: auto;
    }
`;
document.head.appendChild(style);


function logger(str, color = 'black') {

  let targetDocument = document;
  let targetBody = document.body;

  try {

    if (window !== window.top && window.top.document) {
      targetDocument = window.top.document;
      targetBody = targetDocument.body;


      if (!targetDocument.querySelector('style#gpt-box-styles')) {
        const topStyle = targetDocument.createElement('style');
        topStyle.id = 'gpt-box-styles';
        topStyle.textContent = style.textContent;
        targetDocument.head.appendChild(topStyle);
      }
    }
  } catch (e) {
    console.error('\u65e0\u6cd5\u8bbf\u95ee\u7236\u6587\u6863，\u4f7f\u7528\u5f53\u524d\u6587\u6863');
  }


  let box = targetDocument.querySelector('.gpt-box');
  if (!box) {

    box = targetDocument.createElement('div');
    box.className = 'gpt-box';


    const boxStyle = `
      position: fixed !important;
      top: 80px !important;
      right: 10px !important;
      left: auto !important;
      bottom: auto !important;
      z-index: 2147483647 !important;
      transform: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: rgba(255, 255, 255, 0.98) !important;
      border-radius: 10px !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
      width: 320px !important;
      height: auto !important;
      max-height: 500px !important;
      overflow: hidden !important;
      font-family: "Microsoft YaHei", sans-serif !important;
      cursor: move !important;
      user-select: none !important;
      transition: box-shadow 0.3s ease !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      display: block !important;
    `;


    box.setAttribute('style', boxStyle);


    box.style.setProperty('position', 'fixed', 'important');
    box.style.setProperty('z-index', '2147483647', 'important');
    box.style.setProperty('top', '80px', 'important');
    box.style.setProperty('right', '10px', 'important');
    box.style.setProperty('left', 'auto', 'important');
    box.style.setProperty('display', 'block', 'important');


    const header = targetDocument.createElement('div');
    header.className = 'gpt-box-header';
    header.style.cssText = `
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 10px 15px !important;
      background: linear-gradient(135deg, #56cabf 0%, #4a90e2 100%) !important;
      color: white !important;
      border-radius: 10px 10px 0 0 !important;
      cursor: move !important;
      user-select: none !important;
    `;

    const title = targetDocument.createElement('div');
    title.className = 'gpt-box-title';
    title.textContent = '\u4e07\u80fd\u8d85\u661f\u5b66\u4e60\u901a\u52a9\u624b';
    title.style.cssText = `
      font-weight: bold !important;
      font-size: 16px !important;
      color: white !important;
      display: flex !important;
      align-items: center !important;
    `;


    const icon = targetDocument.createElement('span');
    icon.innerHTML = '📝';
    icon.style.cssText = `
      margin-right: 8px !important;
      font-size: 18px !important;
    `;
    title.prepend(icon);

    const actions = targetDocument.createElement('div');
    actions.className = 'gpt-box-actions';
    actions.style.cssText = `
      display: flex !important;
      gap: 8px !important;
    `;

    const clearBtn = targetDocument.createElement('button');
    clearBtn.textContent = '\u6e05\u7a7a';
    clearBtn.title = '\u6e05\u7a7a\u65e5\u5fd7';
    clearBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.2) !important;
      border: none !important;
      border-radius: 4px !important;
      padding: 3px 8px !important;
      color: white !important;
      cursor: pointer !important;
      font-size: 12px !important;
      transition: background 0.3s !important;
    `;
    clearBtn.onmouseover = function () {
      this.style.background = 'rgba(255, 255, 255, 0.3) !important';
    };
    clearBtn.onmouseout = function () {
      this.style.background = 'rgba(255, 255, 255, 0.2) !important';
    };
    clearBtn.onclick = function (e) {
      e.stopPropagation();
      const container = box.querySelector('.gpt-messages-container');
      if (container) {
        container.innerHTML = '';
        logger('\u65e5\u5fd7\u5df2\u6e05\u7a7a', 'green');
      }
    };

    const minBtn = targetDocument.createElement('button');
    minBtn.textContent = '\u9690\u85cf';
    minBtn.title = '\u9690\u85cf\u9762\u677f';
    minBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.2) !important;
      border: none !important;
      border-radius: 4px !important;
      padding: 3px 8px !important;
      color: white !important;
      cursor: pointer !important;
      font-size: 12px !important;
      transition: background 0.3s !important;
    `;
    minBtn.onmouseover = function () {
      this.style.background = 'rgba(255, 255, 255, 0.3) !important';
    };
    minBtn.onmouseout = function () {
      this.style.background = 'rgba(255, 255, 255, 0.2) !important';
    };
    minBtn.onclick = function (e) {
      e.stopPropagation();
      box.style.display = 'none';
      localStorage.setItem('GPTJsSetting.hideGptBox', 'true');
    };

    actions.appendChild(clearBtn);
    actions.appendChild(minBtn);

    header.appendChild(title);
    header.appendChild(actions);


    const messagesContainer = targetDocument.createElement('div');
    messagesContainer.className = 'gpt-messages-container';
    messagesContainer.style.cssText = `
      padding: 10px 15px !important;
      max-height: 400px !important;
      overflow-y: auto !important;
      background: white !important;
      border-radius: 0 0 10px 10px !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
      color: #333 !important;
    `;

    box.appendChild(header);
    box.appendChild(messagesContainer);


    if (localStorage.getItem('GPTJsSetting.hideGptBox') === 'true') {
      box.style.display = 'none';
    }


    targetBody.appendChild(box);


    try {
      const savedPosition = localStorage.getItem('GPTJsSetting.boxPosition');
      if (savedPosition) {
        const position = JSON.parse(savedPosition);
        if (position.left && position.top) {
          box.style.setProperty('left', position.left, 'important');
          box.style.setProperty('top', position.top, 'important');
          box.style.setProperty('right', 'auto', 'important');
        }
      }
    } catch (err) {
      console.error('\u65e0\u6cd5\u6062\u590d\u65e5\u5fd7\u6846\u4f4d\u7f6e', err);
    }


    let isDragging = false;
    let dragOffsetX, dragOffsetY;


    box.addEventListener('mousedown', function (e) {

      if (e.target.tagName === 'BUTTON') {
        return;
      }

      isDragging = true;
      dragOffsetX = e.clientX - box.getBoundingClientRect().left;
      dragOffsetY = e.clientY - box.getBoundingClientRect().top;


      box.style.setProperty('transition', 'none', 'important');


      box.style.setProperty('z-index', '2147483647', 'important');


      box.style.setProperty('box-shadow', '0 12px 48px rgba(0, 0, 0, 0.4)', 'important');
      box.style.setProperty('opacity', '0.95', 'important');


      e.preventDefault();


      e.stopPropagation();
    }, true);


    const mouseMoveHandler = function (e) {
      if (isDragging) {
        const newLeft = e.clientX - dragOffsetX;
        const newTop = e.clientY - dragOffsetY;


        const maxX = window.innerWidth - box.offsetWidth;
        const maxY = window.innerHeight - box.offsetHeight;


        box.style.setProperty('left', Math.max(0, Math.min(newLeft, maxX)) + 'px', 'important');
        box.style.setProperty('top', Math.max(0, Math.min(newTop, maxY)) + 'px', 'important');
        box.style.setProperty('right', 'auto', 'important');
        box.style.setProperty('bottom', 'auto', 'important');


        e.stopPropagation();
        e.preventDefault();
      }
    };

    const mouseUpHandler = function (e) {
      if (isDragging) {
        isDragging = false;


        box.style.setProperty('transition', 'all 0.3s ease', 'important');
        box.style.setProperty('box-shadow', '0 8px 32px rgba(0, 0, 0, 0.3)', 'important');
        box.style.setProperty('opacity', '1', 'important');


        e.stopPropagation();


        try {
          localStorage.setItem('GPTJsSetting.boxPosition', JSON.stringify({
            left: box.style.left,
            top: box.style.top
          }));
        } catch (err) {
          console.error('\u65e0\u6cd5\u4fdd\u5b58\u65e5\u5fd7\u6846\u4f4d\u7f6e', err);
        }
      }
    };


    targetDocument.addEventListener('mousemove', mouseMoveHandler, true);
    targetDocument.addEventListener('mouseup', mouseUpHandler, true);


    try {
      const frames = targetDocument.querySelectorAll('iframe');
      frames.forEach(frame => {
        try {
          const frameDoc = frame.contentDocument || frame.contentWindow.document;
          frameDoc.addEventListener('mousemove', mouseMoveHandler, true);
          frameDoc.addEventListener('mouseup', mouseUpHandler, true);
        } catch (e) {

        }
      });
    } catch (e) {
      console.error('\u65e0\u6cd5\u4e3aiframe\u6dfb\u52a0\u4e8b\u4ef6\u76d1\u542c\u5668', e);
    }


    targetDocument.addEventListener('keydown', function (e) {
      if (e.key === 'F9' || e.keyCode === 120) {
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
      }
    });
  }


  let displayMessage = str;


  if (str.includes('\u53d1\u9001\u8bf7\u6c42\u6570\u636e:')) {
    try {

      const jsonStr = str.substring(str.indexOf('{'));
      const jsonData = JSON.parse(jsonStr);
      const model = jsonData.model;
      const question = jsonData.messages.find(m => m.role === 'user')?.content || '';
      displayMessage = `\u53d1\u9001\u8bf7\u6c42：\u4f7f\u7528\u6a21\u578b ${model}，\u95ee\u9898："${question.substring(0, 50)}${question.length > 50 ? '...' : ''}"`;
    } catch (e) {

    }
  }

  else if (str.includes('\u6536\u5230\u54cd\u5e94:')) {
    try {

      const jsonStr = str.substring(str.indexOf('{'), str.lastIndexOf('}') + 1);
      const jsonData = JSON.parse(jsonStr);

      if (jsonData.code === 200) {
        displayMessage = `\u6536\u5230\u54cd\u5e94：\u8bf7\u6c42\u6210\u529f，\u670d\u52a1\u5668\u72b6\u6001\u6b63\u5e38`;
      } else {
        displayMessage = `\u6536\u5230\u54cd\u5e94：${jsonData.msg || "\u670d\u52a1\u5668\u8fd4\u56de\u672a\u77e5\u72b6\u6001"}`;
      }
    } catch (e) {

      displayMessage = "\u6536\u5230\u670d\u52a1\u5668\u54cd\u5e94";
    }
  }


  const message = targetDocument.createElement('div');
  message.className = `gpt-message ${color}`;


  const baseStyle = `
    margin-bottom: 8px !important;
    padding: 6px 10px !important;
    border-radius: 6px !important;
    font-size: 13px !important;
    line-height: 1.4 !important;
    word-break: break-all !important;
    border-left: 3px solid ${color === 'black' ? '#333' : color} !important;
    background-color: #f8f8f8 !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
  `;


  let specificStyle = '';
  switch (color) {
    case 'red':
      specificStyle = `
        color: #d32f2f !important;
        background-color: #ffebee !important;
      `;
      break;
    case 'green':
      specificStyle = `
        color: #388e3c !important;
        background-color: #e8f5e9 !important;
      `;
      break;
    case 'blue':
      specificStyle = `
        color: #1976d2 !important;
        background-color: #e3f2fd !important;
      `;
      break;
    case 'orange':
      specificStyle = `
        color: #e65100 !important;
        background-color: #fff3e0 !important;
      `;
      break;
    default:
      specificStyle = `
        color: #333333 !important;
        background-color: #f5f5f5 !important;
      `;
  }


  message.style.cssText = baseStyle + specificStyle;


  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const timeSpan = targetDocument.createElement('span');
  timeSpan.style.cssText = `
    color: #888 !important;
    font-size: 11px !important;
    margin-right: 6px !important;
  `;
  timeSpan.textContent = `[${timestamp}] `;


  const contentSpan = targetDocument.createElement('span');
  contentSpan.innerHTML = displayMessage;

  message.appendChild(timeSpan);
  message.appendChild(contentSpan);


  const messagesContainer = box.querySelector('.gpt-messages-container') || box;
  messagesContainer.appendChild(message);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

window.onload = function () {





  const selectElement = $('#modelSelect');

  selectElement.on('change', function () {

    const selectedModel = selectElement.val();

    localStorage.setItem('GPTJsSetting.model', selectedModel);
  });

  const lastSelectedModel = localStorage.getItem('GPTJsSetting.model');
  if (lastSelectedModel) {
    selectElement.val(lastSelectedModel);
  }


  enhanceNe21BoxExperience();
};


function enhanceNe21BoxExperience() {
  setTimeout(function () {
    const neBox = document.getElementById('ne-21box');
    if (neBox) {

      neBox.addEventListener('mouseover', function () {
        this.style.boxShadow = '0 12px 42px 0 rgba(31, 38, 135, 0.5)';
      });

      neBox.addEventListener('mouseout', function () {
        this.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
      });


      if (!neBox.style.left || neBox.style.left === '') {
        neBox.style.right = 'auto';
        neBox.style.left = '20px';
        neBox.style.top = '20px';
      }


      neBox.style.setProperty('z-index', '2147483646', 'important');
    }
  }, 1500);
}


$(document).keydown(function (e) {
  if (e.keyCode == 120 && $('#ne-21notice')[0] != undefined) {

    if (localStorage.getItem('GPTJsSetting.showBox') == 'hide') {
      $('#ne-21box').css('display', show = 'block');
      $('#ne-21box').css('opacity', '1');
      localStorage.setItem('GPTJsSetting.showBox', 'show');
    } else {
      $('#ne-21box').css('display', show = 'none');
      localStorage.setItem('GPTJsSetting.showBox', 'hide');
    }
  }
});


$('.navshow').find('a:contains(\u4f53\u9a8c\u65b0\u7248)')[0] ? $('.navshow').find('a:contains(\u4f53\u9a8c\u65b0\u7248)')[0].click() : '';

setting.decrypt ? convertEncryptedFont() : '';

if (_l.hostname == 'i.mooc.chaoxing.com' || _l.hostname == "i.chaoxing.com") {

} else if (_l.pathname == '/login' && setting.autoLogin) {
  showBox()
  setTimeout(() => { autoLogin() }, 3000)
} else if (_l.pathname.includes('/mycourse/studentstudy')) {
  showBox()
  $('#ne-21log', window.parent.document).html('\u521d\u59cb\u5316\u5b8c\u6bd5！')
} else if (_l.pathname.includes('/knowledge/cards')) {
  var params = getTaskParams()
  if (params == null || params == '$mArg' || $.parseJSON(params)['attachments'].length <= 0) {
    logger('\u65e0\u4efb\u52a1\u70b9\u53ef\u5904\u7406，\u5373\u5c06\u8df3\u8f6c\u9875\u9762', 'red')
    toNext()
  } else {
    setTimeout(() => {
      top.checkJob ? top.checkJob = () => false : true
      _domList = []
      _mlist = $.parseJSON(params)['attachments']
      _defaults = $.parseJSON(params)['defaults']
      $.each($('.wrap .ans-cc .ans-attach-ct'), (i, t) => {
        _domList.push($(t).find('iframe'))
      })
      initializeTaskSystem()
    }, 3000)
  }
} else if (_l.pathname.includes('/exam/test/reVersionTestStartNew')) {

  const shouldHideBox = localStorage.getItem('GPTJsSetting.showBox') === 'hide';
  if (shouldHideBox) {

    setTimeout(() => {
      showBox();
      missonExam();
    }, 3000);
  } else {
    showBox();
    setTimeout(() => { missonExam() }, 3000);
  }
} else if (_l.pathname.includes('/exam/test/reVersionPaperMarkContentNew')) {
  setting.share && (() => {
    showBox()
    setTimeout(() => { uploadExam() }, 3000)
  })()
} else if (_l.pathname.includes('/mooc2/work/dowork')) {

  const shouldHideBox = localStorage.getItem('GPTJsSetting.showBox') === 'hide';
  if (shouldHideBox) {

    setTimeout(() => {
      showBox();
      missonHomeWork();
    }, 3000);
  } else {
    showBox();
    setTimeout(() => { missonHomeWork() }, 3000);
  }
} else if (_l.pathname.includes('/mooc2/work/view') || _l.pathname.includes('/mooc-ans/mooc2/work/view')) {


  const shouldHideBox = localStorage.getItem('GPTJsSetting.showBox') === 'hide';
  if (!shouldHideBox) {
    showBox();
  }

  if (_l.pathname.includes('/mooc-ans/mooc2/work/view')) {

    setTimeout(() => { doWorkView() }, 1000)
  } else {
    setTimeout(() => { uploadHomeWork() }, 3000)
  }
} else if (_l.pathname.includes('/mooc-ans/mooc2/work/')) {


  const shouldHideBox = localStorage.getItem('GPTJsSetting.showBox') === 'hide';
  if (!shouldHideBox) {
    showBox();
  }

  setTimeout(() => {
    if (shouldHideBox) {
      showBox();
    }
    doWorkView();
  }, 1000)
} else if (_l.pathname.includes('/work/phone/doHomeWork')) {
  _oldal = _w.alert
  _w.alert = function (msg) {
    if (msg == '\u4fdd\u5b58\u6210\u529f') {
      return;
    }
    return _oldal(msg)
  }
  _oldcf = _w.confirm
  _w.confirm = function (msg) {
    if (msg.includes('\u786e\u8ba4\u63d0\u4ea4') || msg.includes('\u672a\u505a\u5b8c')) {
      return true
    }
    return _oldcf(msg)
  }
} else if (_l.pathname.includes('/mooc2/exam/exam-list')) {

} else if (_l.pathname == '/mycourse/stu') {
  checkBrowser()
} else {

}

function checkBrowser() {
  var userAgent = navigator.userAgent
  if (userAgent.indexOf('Chrome') == -1 || GM_info.scriptHandler != 'ScriptCat') {

  }
}

function http2https(url) {
  _url = url.replace(/^http:/, 'https:')
  return _url
}

function parseUrlParams() {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  let _p = {}
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    _p[pair[0]] = pair[1]
  }
  return _p
}

function showTips() {
  GM_xmlhttpRequest({
    method: 'GET',
    url: _host + '/api/v1/tips',
    timeout: 5000,
    onload: function (xhr) {
      if (xhr.status == 200) {
        var obj = $.parseJSON(xhr.responseText) || {};
        var _msg = obj.data.msg;

      }
    },
    ontimeout: function () {
      var _msg = "\u94fe\u63a5\u4e0d\u5230\u4e91\u7aef\u670d\u52a1\u5668，\u53ef\u80fd\u662f\u60a8\u4f7f\u7528\u7684\u811a\u672c\u7248\u672c\u8fc7\u4f4e，\u8bf7\u5c3d\u5feb\u66f4\u65b0，\u6700\u65b0\u811a\u672c\u66f4\u65b0\u53d1\u5e03\u5b98";

    }
  });
}

function sleep(time) {
  var timeStamp = new Date().getTime();
  var endTime = timeStamp + time;
  while (true) {
    if (new Date().getTime() > endTime) {
      return;
    }
  }
}

/**
 * \u5b89\u5168\u5730\u6267\u884c\u9875\u9762\u4e0a\u7684\u51fd\u6570
 * @param {string} funcName - \u8981\u6267\u884c\u7684\u51fd\u6570\u540d
 * @param {Array} args - \u51fd\u6570\u53c2\u6570
 * @returns {boolean} - \u662f\u5426\u6210\u529f\u6267\u884c
 */
function safeExecutePageFunction(funcName, args = []) {
  try {

    if (typeof window[funcName] === 'function') {
      window[funcName].apply(window, args);
      return true;
    }


    if (typeof unsafeWindow !== 'undefined') {

      if (typeof unsafeWindow[funcName] === 'function') {
        unsafeWindow[funcName].apply(unsafeWindow, args);
        return true;
      }
    }


    const script = document.createElement('script');
    script.textContent = `
      try {
        if(typeof ${funcName} === 'function') {
          ${funcName}();
          document.dispatchEvent(new CustomEvent('xxt_function_executed', { detail: { success: true, function: '${funcName}' } }));
        } else {
          document.dispatchEvent(new CustomEvent('xxt_function_executed', { detail: { success: false, function: '${funcName}', error: 'Function not found' } }));
        }
      } catch(e) {
        document.dispatchEvent(new CustomEvent('xxt_function_executed', { detail: { success: false, function: '${funcName}', error: e.message } }));
      }
    `;
    document.head.appendChild(script);
    script.remove();
    return true;
  } catch (e) {
    logger(`\u6267\u884c\u9875\u9762\u51fd\u6570 ${funcName} \u5931\u8d25: ${e.message}`, 'red');
    return false;
  }
}


var moreSettingsBtn = document.getElementById('moreSettingsBtn');
var moreSettings = document.getElementById('moreSettings');
var userInfo = document.getElementById('userInfo');
var isSettingsVisible = false;

moreSettingsBtn.addEventListener('click', function () {
  userInfo.style.display = isSettingsVisible ? 'block' : 'none';
  moreSettings.style.display = isSettingsVisible ? 'none' : 'block';

  newFeaturePanel.style.display = 'none';
  tutorialPanel.style.display = 'none';

  moreSettingsBtn.textContent = isSettingsVisible ? '\u8bbe\u7f6e' : '\u8fd4\u56de';

  if (isSettingsVisible) {
    newFeatureBtn.textContent = 'AI\u529f\u80fd';
    tutorialBtn.textContent = '\u6559\u7a0b';
  }
  isSettingsVisible = !isSettingsVisible;
  isFeatureVisible = false;
  isTutorialVisible = false;
});


var newFeatureBtn = document.getElementById('newFeatureBtn');
var newFeaturePanel = document.getElementById('newFeaturePanel');
var isFeatureVisible = false;

newFeatureBtn.addEventListener('click', function () {
  userInfo.style.display = isFeatureVisible ? 'block' : 'none';
  newFeaturePanel.style.display = isFeatureVisible ? 'none' : 'block';

  moreSettings.style.display = 'none';
  tutorialPanel.style.display = 'none';

  newFeatureBtn.textContent = isFeatureVisible ? 'AI\u529f\u80fd' : '\u8fd4\u56de';

  if (isFeatureVisible) {
    moreSettingsBtn.textContent = '\u8bbe\u7f6e';
    tutorialBtn.textContent = '\u6559\u7a0b';
  }
  isFeatureVisible = !isFeatureVisible;
  isSettingsVisible = false;
  isTutorialVisible = false;
});


var tutorialBtn = document.getElementById('tutorialBtn');
var tutorialPanel = document.getElementById('tutorialPanel');
var isTutorialVisible = false;

tutorialBtn.addEventListener('click', function () {
  userInfo.style.display = isTutorialVisible ? 'block' : 'none';
  tutorialPanel.style.display = isTutorialVisible ? 'none' : 'block';

  moreSettings.style.display = 'none';
  newFeaturePanel.style.display = 'none';

  tutorialBtn.textContent = isTutorialVisible ? '\u6559\u7a0b' : '\u8fd4\u56de';

  if (isTutorialVisible) {
    moreSettingsBtn.textContent = '\u8bbe\u7f6e';
    newFeatureBtn.textContent = 'AI\u529f\u80fd';
  }
  isTutorialVisible = !isTutorialVisible;
  isSettingsVisible = false;
  isFeatureVisible = false;
});


['sub', 'force', 'examTurn', 'goodStudent', 'alterTitle', 'hideGptBox', 'notification', 'skipTest', 'useAI', 'randomAnswer', 'useTiku', 'autoSave', 'autoSubmit'].forEach(function (settingId) {
  var checkbox = document.getElementById('GPTJsSetting.' + settingId);
  checkbox.addEventListener('change', updateLocalStorage);
  checkbox.checked = localStorage.getItem('GPTJsSetting.' + settingId) === 'true';


  if (localStorage.getItem('GPTJsSetting.' + settingId) === null) {

    if (settingId === 'sub') {
      localStorage.setItem('GPTJsSetting.' + settingId, setting.sub ? 'true' : 'false');
      checkbox.checked = setting.sub === 1;
    } else if (settingId === 'force') {
      localStorage.setItem('GPTJsSetting.' + settingId, setting.force ? 'true' : 'false');
      checkbox.checked = setting.force === 1;
    } else if (settingId === 'alterTitle') {
      localStorage.setItem('GPTJsSetting.' + settingId, 'true');
    } else if (settingId === 'hideGptBox') {
      localStorage.setItem('GPTJsSetting.' + settingId, 'false');
    } else if (settingId === 'notification') {
      localStorage.setItem('GPTJsSetting.' + settingId, 'true');
    } else if (settingId === 'skipTest') {
      localStorage.setItem('GPTJsSetting.' + settingId, 'false');
    } else if (settingId === 'useAI') {
      localStorage.setItem('GPTJsSetting.' + settingId, 'false');
    } else if (settingId === 'randomAnswer') {
      localStorage.setItem('GPTJsSetting.' + settingId, 'false');
    } else if (settingId === 'useTiku') {
      localStorage.setItem('GPTJsSetting.' + settingId, 'true');
    } else if (settingId === 'autoSave') {
      localStorage.setItem('GPTJsSetting.' + settingId, 'true');
    } else if (settingId === 'autoSubmit') {
      localStorage.setItem('GPTJsSetting.' + settingId, 'false');
    }
  }


  if (settingId === 'hideGptBox' && checkbox.checked) {
    const gptBoxes = document.querySelectorAll('.gpt-box');
    gptBoxes.forEach(box => {
      box.style.display = 'none';
    });
  }
});

function updateLocalStorage(event) {
  var checkbox = event.target;
  localStorage.setItem(checkbox.id, checkbox.checked);


  if (checkbox.id === 'GPTJsSetting.hideGptBox') {
    const gptBoxes = document.querySelectorAll('.gpt-box');
    gptBoxes.forEach(box => {
      box.style.display = checkbox.checked ? 'none' : 'block';
    });
  }


  if (checkbox.id === 'GPTJsSetting.autoSubmit') {
    if (checkbox.checked) {
      logger('\u5df2\u542f\u7528\u81ea\u52a8\u63d0\u4ea4\u4f5c\u4e1a\u529f\u80fd', 'green');
    } else {
      logger('\u5df2\u7981\u7528\u81ea\u52a8\u63d0\u4ea4\u4f5c\u4e1a\u529f\u80fd', 'blue');
    }
  }
}

/**
 * \u521d\u59cb\u5316\u6240\u6709\u8bbe\u7f6e\u590d\u9009\u6846\u7684\u72b6\u6001
 */
function initCheckboxSettings() {

  const settingCheckboxes = [
    'GPTJsSetting.sub',
    'GPTJsSetting.force',
    'GPTJsSetting.hideGptBox',
    'GPTJsSetting.examTurn',
    'GPTJsSetting.goodStudent',
    'GPTJsSetting.alterTitle',
    'GPTJsSetting.notification',
    'GPTJsSetting.skipTest',
    'GPTJsSetting.useAI',
    'GPTJsSetting.randomAnswer',
    'GPTJsSetting.useTiku',
    'GPTJsSetting.autoSave',
    'GPTJsSetting.autoSubmit'
  ];


  if (localStorage.getItem('GPTJsSetting.autoSubmit') === null) {
    localStorage.setItem('GPTJsSetting.autoSubmit', 'false');
  }


  settingCheckboxes.forEach(function (checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {

      const savedValue = localStorage.getItem(checkboxId);
      if (savedValue !== null) {
        checkbox.checked = savedValue === 'true';
      }


      checkbox.addEventListener('change', updateLocalStorage);


      if (checkboxId === 'GPTJsSetting.autoSubmit' && checkbox.checked) {
        logger('\u5df2\u542f\u7528\u81ea\u52a8\u63d0\u4ea4\u4f5c\u4e1a\u529f\u80fd', 'green');
      }
    }
  });
}


const modelSelect = document.getElementById('GPTJsSetting.model');
if (modelSelect) {

  const savedModel = localStorage.getItem('GPTJsSetting.model');
  if (savedModel) {
    modelSelect.value = savedModel;
  } else {

    localStorage.setItem('GPTJsSetting.model', modelSelect.value);
  }


  modelSelect.addEventListener('change', function () {
    localStorage.setItem('GPTJsSetting.model', this.value);
    logger('AI\u6a21\u578b\u5df2\u66f4\u6539\u4e3a: ' + this.value, '#1890ff');
  });
}


const modelSelect2 = document.getElementById('GPTJsSetting.model');
if (modelSelect2) {

  const savedModel = localStorage.getItem('GPTJsSetting.model');
  if (savedModel) {
    modelSelect2.value = savedModel;
  } else {

    localStorage.setItem('GPTJsSetting.model', modelSelect2.value);
  }


  modelSelect2.addEventListener('change', function () {
    localStorage.setItem('GPTJsSetting.model', this.value);
    logger('AI\u6a21\u578b\u5df2\u66f4\u6539\u4e3a: ' + this.value, '#1890ff');
  });
}

function showBox() {
  const box = document.querySelector('.gpt-box');
  if (box) {
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  }


  let targetDocument = document;

  try {

    if (window !== window.top && window.top.document) {
      targetDocument = window.top.document;
    }
  } catch (e) {
    logger('\u65e0\u6cd5\u8bbf\u95ee\u7236\u6587\u6863，\u4f7f\u7528\u5f53\u524d\u6587\u6863', 'orange');
  }


  const existingBox = targetDocument.querySelector('#ne-21box');
  if (existingBox) {
    logger('\u754c\u9762\u5df2\u5b58\u5728，\u4e0d\u91cd\u590d\u521b\u5efa', 'blue');


    setTimeout(function () {
      initCheckboxSettings();
    }, 500);

    return;
  }


  if (setting.showBox) {

    const shouldHide = localStorage.getItem('GPTJsSetting.showBox') === 'hide';
    const initialDisplay = shouldHide ? 'none' : 'block';
    const initialOpacity = shouldHide ? '0' : '1';
    var box_html = `<div id="ne-21box" style="box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            opacity: ${initialOpacity};
            width: 330px;
            position: fixed;
            top: 20px;
            left: 20px;
            right: auto;
            z-index: 99999;
            overflow-x: auto;
            display: ${initialDisplay};
            border-radius: 10px;
            cursor: move;
            user-select: none;
            transition: box-shadow 0.3s ease;">
            <div class="ne-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              padding: 10px;
                background: rgba(255, 255, 255, 0.75);
                border-radius: 10px 10px 0 0;
                border-bottom: 2px solid #e8eaf6;">
                
                <div class="ne-title" style="
                    display: flex;
                    align-items: center;
                    gap: 10px;">
                    <img src="https://mx.mixuelo.cc/index/pengzi/images/\u601d\u80032.gif" style="width: 24px; height: 24px;">
                  
                    <h3 style="
                        margin: 0;
                        color: #56cabf;
                        font-size: 18px;
                        font-weight: 600;
                        font-family: 'Microsoft YaHei', sans-serif;">
                        \u4e07\u80fd\u8d85\u661f\u5b66\u4e60\u901a\u52a9\u624b
                    </h3>
                </div>
                
                <div id="ne-21close" style="
                    color: #9fa8da;
                    font-size: 14px;
                    cursor: pointer;
                    padding: 5px 10px;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                    background: #e8eaf6;
                    font-weight: 500;"
                    onmouseover="this.style.background='#c5cae9'"
                    onmouseout="this.style.background='#e8eaf6'"
                    title="\u6309F9\u952e\u5373\u53ef\u6062\u590d\u9762\u677f">
                    F9\u663e\u9690\u9762\u677f
                </div>
            </div>
            <div style="padding: 10px;">
            
            <div id="ne-21notice" style="
                margin: 10px 0;
                padding: 10px;
                background: #f5f5f5;
                border-radius: 8px;
                font-size: 14px;
                line-height: 1.5;"></div>

            <div id="userInfo" style="
                margin: 10px 0;
                padding: 10px;
                background: #e3f2fd;
                border-radius: 8px;
                font-size: 14px;
                color: #1976d2;"></div>

            <div id="moreSettings" style="
                display: none;
                margin: 10px 0;
                padding: 15px;
                background: #fafafa;
                border-radius: 8px;">
                
                <div style="margin-bottom: 15px;">
                    <div style="margin-bottom: 10px;">
                        <label for="GPTJsSetting.key" style="color: #555;">Key:</label>
                        <input type="text" id="GPTJsSetting.key" style="
                            width: 200px;
                            padding: 5px;
                            border: 1px solid #ddd;
                            border-radius: 4px;">
                        <button id="saveKeyBtn" style="
                            margin-left: 10px;
                            padding: 5px 10px;
                            background-color: #FC3D74;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            ">
                            \u4fdd\u5b58
                        </button>
                        <div id="saveKeyMsg" style="
                            margin-top: 8px;
                            padding: 6px 10px;
                            border-radius: 4px;
                            font-size: 13px;
                            color: white;
                            background-color: #FC3A72;
                            display: none;
                            opacity: 0;
                            transform: translateY(-10px);
                            transition: all 0.3s ease;
                        "></div>
                    </div>
                </div>

                <div style="
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    font-size: 14px;">
                    <div>
                        <input type="checkbox" id="GPTJsSetting.sub">
                        <label for="GPTJsSetting.sub">\u6d4b\u9a8c\u81ea\u52a8\u63d0\u4ea4</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.force">
                        <label for="GPTJsSetting.force">\u6d4b\u9a8c\u5f3a\u5236\u63d0\u4ea4</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.hideGptBox">
                        <label for="GPTJsSetting.hideGptBox">\u9690\u85cf\u7b54\u6848\u76d2\u5b50</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.examTurn">
                        <label for="GPTJsSetting.examTurn">\u8003\u8bd5\u81ea\u52a8\u8df3\u8f6c</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.goodStudent">
                        <label for="GPTJsSetting.goodStudent">\u7b54\u6848\u52a0\u7c97\u4e0d\u9009\u62e9</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.alterTitle" checked>
                        <label for="GPTJsSetting.alterTitle">\u7b54\u6848\u63d2\u5165\u9898\u76ee\u540e</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.notification" checked>
                        <label for="GPTJsSetting.notification">\u684c\u9762\u901a\u77e5</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.skipTest">
                        <label for="GPTJsSetting.skipTest">\u4e0d\u505a\u6d4b\u9a8c</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.useAI">
                        <label for="GPTJsSetting.useAI">AI\u81ea\u52a8\u7b54\u9898</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.randomAnswer">
                        <label for="GPTJsSetting.randomAnswer">\u968f\u673a\u7b54\u9898</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.useTiku" checked>
                        <label for="GPTJsSetting.useTiku">\u9898\u5e93\u7b54\u9898</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.autoSave" checked>
                        <label for="GPTJsSetting.autoSave">\u81ea\u52a8\u4fdd\u5b58\u4f5c\u4e1a\u7b54\u6848</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.autoSubmit">
                        <label for="GPTJsSetting.autoSubmit">\u81ea\u52a8\u63d0\u4ea4\u4f5c\u4e1a</label>
                    </div>
                </div>
            </div>

            <div style="margin-top: 15px;">
                <label for="GPTJsSetting.model" style="color: #555;">AI\u6a21\u578b:</label>
                <select id="GPTJsSetting.model" style="
                    width: 200px;
                    padding: 5px;
                    border: 1px solid #ddd;
                    border-radius: 4px;">
                    <option value="Doubao-1.5-lite-32k">Doubao-1.5-lite-32k</option>
                    <option value="gpt-4o-mini">GPT-4o-Mini</option>
                    <option value="deepseek-chat">DeepSeek</option>
                    <option value="glm-4-flash">\u667a\u8c31GLM-4</option>
                </select>
            </div>

            
            <div id="newFeaturePanel" style="
                display: none;
                margin: 10px 0;
                padding: 15px;
                background: #fff0f6;
                border-radius: 8px;">
                
                <h4 style="
                    margin-top: 0;
                    color: #fc3d74;
                    border-bottom: 1px solid #ffd6e7;
                    padding-bottom: 8px;
                ">
                    AI \u52a9\u624b
                </h4>
                
                <div style="margin-bottom: 12px;">
                    <div style="color: #555; font-size: 13px; margin-bottom: 5px;">\u9009\u62e9\u6a21\u578b：</div>
                    <select style="width: 100%; border: 1px solid #ffadd2; border-radius: 4px; padding: 6px; font-size: 14px;" id="modelSelect">
                        <option value="Doubao-1.5-lite-32k">Doubao-1.5-lite-32k (\u7ecf\u6d4e\u5b9e\u7528)</option>
                        <option value="deepseek-chat">DeepSeek-Chat (\u63a8\u8350)</option>
                        <option value="gpt-4o-mini">GPT-4o-Mini (\u9ad8\u6027\u4ef7\u6bd4)</option>
                        <option value="glm-4-flash">GLM-4-Flash (\u901f\u5ea6\u4f18\u5148)</option>
                    </select>
                </div>
                
                <div class="ai-question-section" style="margin-bottom: 10px;">
                    <div style="color: #555; font-size: 13px; margin-bottom: 5px;">\u8f93\u5165\u95ee\u9898：</div>
                    <textarea id="ai-question" style="
                        width: 95%;
                        min-height: 60px;
                        padding: 8px;
                        border: 1px solid #ffadd2;
                        border-radius: 4px;
                        resize: vertical;
                        font-size: 14px;
                        background-color: #fff;
                        color: #333;
                        margin-bottom: 8px;
                    "></textarea>
                    <div style="display: flex; justify-content: flex-end;">
                        <button id="ai-send-btn" style="
                            padding: 6px 12px;
                            background-color: #FC3D74;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        ">\u83b7\u53d6\u7b54\u6848</button>
                    </div>
                </div>
                
                <div class="ai-answer-section">
                    <div style="
                        color: #555; 
                        font-size: 13px; 
                        margin-bottom: 5px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <span>AI \u56de\u7b54：</span>
                        <button id="ai-copy-btn" style="
                            padding: 3px 8px;
                            background-color: #722ed1;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                        ">\u590d\u5236\u7b54\u6848</button>
                    </div>
                    <div id="ai-answer" style="
                       
                        min-height: 100px;
                        max-height: 250px;
                        padding: 10px;
                        border: 1px solid #d3adf7;
                        border-radius: 4px;
                        background-color: #f9f0ff;
                        overflow-y: auto;
                        font-size: 14px;
                        line-height: 1.5;
                        color: #333;
                        margin-bottom: 10px;
                    ">AI \u52a9\u624b\u5df2\u51c6\u5907\u5c31\u7eea，\u8bf7\u8f93\u5165\u60a8\u7684\u95ee\u9898...</div>
                    
                    
                    <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <button id="ai-log-toggle" style="
                            padding: 6px 12px;
                            background-color: #8c8c8c;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        ">\u663e\u793a\u65e5\u5fd7</button>
                        <span style="font-size: 12px; color: #888;">\u63a7\u5236\u65e5\u5fd7\u7a97\u53e3\u663e\u793a/\u9690\u85cf</span>
                    </div>
                </div>
            </div>

            
            <div id="tutorialPanel" style="
                display: none;
                margin: 10px 0;
                padding: 15px;
                background: #e6f7f5;
                border-radius: 8px;">
                
                
                <div id="usageTutorial" style="display: none;">
                    <h4 style="
                        margin-top: 0;
                        color: #56CABF;
                        border-bottom: 1px solid #a8e6e0;
                        padding-bottom: 8px;
                    ">
                        \u811a\u672c\u4f7f\u7528\u6559\u7a0b
                    </h4>
                    
                    <div style="margin-bottom: 12px; font-size: 14px; line-height: 1.6; color: #333;">
                        <p style="margin-bottom: 10px;"><strong>\u811a\u672c\u529f\u80fd\u5b8c\u5168\u514d\u8d39，\u4e0d\u5b58\u5728\u4ed8\u8d39\u60c5\u51b5，\u8fdb\u5165\u76f8\u5e94\u9875\u9762\u5373\u53ef\u4f7f\u7528。</strong></p>
                        <p style="margin-bottom: 10px;">\u811a\u672c\u6ca1\u6709\u5f00\u53d1\u81ea\u5df1\u7684\u9898\u5e93，\u800c\u662f\u63a5\u5165\u4e86\u591a\u4e2a\u7b2c\u4e09\u65b9\u9898\u5e93，\u5982\u9700\u586b\u5199\u5bc6\u94a5，\u4f9d\u6b21\u64cd\u4f5c：[1] \u70b9\u51fb\u6807\u7b7e\u9875"\u7b54\u9898" --> [2] \u5728\u6587\u672c\u6846\u5185\u586b\u5199 --> [3] \u5237\u65b0</p>
                        <p style="margin-bottom: 10px; color: #ff4d4f;"><strong>\u6ce8\u610f\u4e8b\u9879：</strong></p>
                        <ul style="margin-left: 20px; color: #666;">
                            <li style="margin-bottom: 8px;">\u811a\u672c\u51fa\u73b0\u76f8\u5173\u95ee\u9898，\u8bf7\u5728\u811a\u672c\u53cd\u9988\u533a\u53cd\u9988，\u6216\u8005\u79c1\u4fe1\u4f5c\u8005\u4fee\u590d。</li>
                            <li style="margin-bottom: 8px;">\u9898\u5e93\u5bc6\u94a5\u8bf7\u786e\u8ba4\u80fd\u591f\u641c\u7d22\u5230\u9898\u76ee\u518d\u83b7\u53d6，\u9898\u5e93\u5747\u4e3a\u7f51\u7edc\u6536\u96c6\u7684\u7b2c\u4e09\u65b9\u9898\u5e93，\u51fa\u73b0\u4efb\u4f55\u95ee\u9898\u4e0e\u811a\u672c\u65e0\u5173。\u5982\u679c\u4f60\u662f\u7a0b\u5e8f\u5458，\u53ef\u4ee5\u81ea\u884c\u63a5\u5165\u81ea\u5df1\u7684\u9898\u5e93，\u8fd9\u91cc\u4e0d\u63d0\u4f9b\u4efb\u4f55\u6559\u7a0b，\u4e5f\u4e0d\u4f1a\u56de\u590d\u4efb\u4f55\u8be2\u95ee，\u8bf7\u81ea\u884c\u67e5\u770b\u6e90\u4ee3\u7801\u4fee\u6539\u5373\u53ef，\u4e0d\u4f1a\u6539\u7684\u7ed5\u9053。</li>
                        </ul>
                    </div>
                </div>

                
                <div id="agreement" style="display: none;">
                    <h4 style="
                        margin-top: 0;
                        color: #56CABF;
                        border-bottom: 1px solid #a8e6e0;
                        padding-bottom: 8px;
                    ">
                        \u514d\u8d23\u58f0\u660e
                    </h4>
                    
                    <div style="margin-bottom: 12px; font-size: 14px; line-height: 1.6; color: #333;">
                        <p style="margin-bottom: 10px;">1、\u672c\u811a\u672c\u4ec5\u4f9b\u5b66\u4e60\u548c\u7814\u7a76\u76ee\u7684\u4f7f\u7528，\u5e76\u5e94\u572824\u5c0f\u65f6\u5185\u5220\u9664。\u811a\u672c\u7684\u4f7f\u7528\u4e0d\u5e94\u8fdd\u53cd\u4efb\u4f55\u6cd5\u5f8b\u6cd5\u89c4\u53ca\u5b66\u672f\u9053\u5fb7\u6807\u51c6。</p>
                        <p style="margin-bottom: 10px;">2、\u7528\u6237\u5728\u4f7f\u7528\u811a\u672c\u65f6，\u5fc5\u987b\u9075\u5b88\u6240\u6709\u9002\u7528\u7684\u6cd5\u5f8b\u6cd5\u89c4。\u4efb\u4f55\u7531\u4e8e\u4f7f\u7528\u811a\u672c\u800c\u5f15\u8d77\u7684\u8fdd\u6cd5\u884c\u4e3a\u6216\u4e0d\u5f53\u884c\u4e3a，\u5176\u4ea7\u751f\u7684\u4e00\u5207\u540e\u679c\u7531\u7528\u6237\u81ea\u884c\u627f\u62c5。</p>
                        <p style="margin-bottom: 10px;">3、\u5f00\u53d1\u8005\u4e0d\u5bf9\u7528\u6237\u4f7f\u7528\u811a\u672c\u6240\u4ea7\u751f\u7684\u4efb\u4f55\u76f4\u63a5\u6216\u95f4\u63a5\u540e\u679c\u8d1f\u8d23。\u7528\u6237\u5e94\u81ea\u884c\u8bc4\u4f30\u4f7f\u7528\u811a\u672c\u7684\u98ce\u9669，\u5e76\u5bf9\u4efb\u4f55\u53ef\u80fd\u7684\u8d1f\u9762\u5f71\u54cd\u627f\u62c5\u5168\u8d23。</p>
                        <p style="margin-bottom: 10px;">4、\u672c\u58f0\u660e\u7684\u76ee\u7684\u5728\u4e8e\u63d0\u9192\u7528\u6237\u6ce8\u610f\u76f8\u5173\u6cd5\u5f8b\u6cd5\u89c4\u4e0e\u98ce\u9669，\u786e\u4fdd\u7528\u6237\u5728\u660e\u667a、\u5408\u6cd5\u7684\u524d\u63d0\u4e0b\u4f7f\u7528\u811a\u672c。</p>
                        <p style="margin-bottom: 10px;">5、\u5982\u7528\u6237\u5728\u4f7f\u7528\u811a\u672c\u7684\u8fc7\u7a0b\u4e2d\u6709\u4efb\u4f55\u7591\u95ee，\u5efa\u8bae\u7acb\u5373\u505c\u6b62\u4f7f\u7528，\u5e76\u5220\u9664\u6240\u6709\u76f8\u5173\u6587\u4ef6。</p>
                        <p style="margin-bottom: 10px;">6、\u672c\u514d\u8d23\u58f0\u660e\u7684\u6700\u7ec8\u89e3\u91ca\u6743\u5f52\u811a\u672c\u5f00\u53d1\u8005\u6240\u6709。</p>
                    </div>
                </div>

                
                <div style="display: flex; gap: 10px;">
                    <button onclick="document.getElementById('usageTutorial').style.display='block';document.getElementById('agreement').style.display='none';" 
                            style="padding: 5px 10px; background: #56CABF; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        \u4f7f\u7528\u6559\u7a0b
                    </button>
                    <button onclick="document.getElementById('agreement').style.display='block';document.getElementById('usageTutorial').style.display='none';" 
                            style="padding: 5px 10px; background: #56CABF; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        \u514d\u8d23\u58f0\u660e
                    </button>
                </div>
            </div>

            <div id="ne-21log" style="
                max-height: 200px;
                overflow-y: auto;
                margin-top: 10px;
                padding: 10px;
                background: #fff;
                border-radius: 8px;
                border: 1px solid #e0e0e0;"></div>
        </div>`;


    try {
      if (targetDocument === document) {
        $(box_html).appendTo('body');
      } else {

        $(targetDocument).find('body').append(box_html);
      }
    } catch (e) {

      logger('\u6dfb\u52a0\u5230\u76ee\u6807\u6587\u6863\u5931\u8d25，\u4f7f\u7528\u5f53\u524d\u6587\u6863: ' + e.message, 'orange');
      $(box_html).appendTo('body');
    }
    $('#ne-21close').click(function () {
      let show = $('#ne-21box').css('display');
      $('#ne-21box').css('display', show == 'block' ? 'none' : 'block');


      localStorage.setItem('GPTJsSetting.showBox', show == 'block' ? 'hide' : 'show');


      if (show == 'block') {
        $('.tiku-settings-btn').parent().css('display', 'flex');

        moreSettingsBtn.textContent = '\u8bbe\u7f6e';
        newFeatureBtn.textContent = 'AI\u529f\u80fd';
        tutorialBtn.textContent = '\u6559\u7a0b';

        isSettingsVisible = false;
        isFeatureVisible = false;
        isTutorialVisible = false;
      } else {
        $('.tiku-settings-btn').parent().css('display', 'none');
      }
    })


    const $doc = (targetDocument === document) ? $ : function (selector) { return $(targetDocument).find(selector); };


    $doc('#GPTJsSetting\\.key').val(localStorage.getItem('GPTJsSetting.key') || '');


    const notificationEnabled = localStorage.getItem('GPTJsSetting.notification') !== 'false';
    $doc('#GPTJsSetting\\.notification').prop('checked', notificationEnabled);


    $doc('#GPTJsSetting\\.notification').change(function () {
      localStorage.setItem('GPTJsSetting.notification', this.checked);


      const saveKeyMsg = document.getElementById('saveKeyMsg');
      saveKeyMsg.innerText = this.checked ? '\u684c\u9762\u901a\u77e5\u5df2\u5f00\u542f' : '\u684c\u9762\u901a\u77e5\u5df2\u5173\u95ed';
      saveKeyMsg.style.backgroundColor = this.checked ? '#4CAF50' : '#FF9800';
      saveKeyMsg.style.display = 'block';


      setTimeout(function () {
        saveKeyMsg.style.opacity = '1';
        saveKeyMsg.style.transform = 'translateY(0)';
      }, 10);


      setTimeout(function () {
        saveKeyMsg.style.opacity = '0';
        saveKeyMsg.style.transform = 'translateY(-10px)';
        setTimeout(function () {
          saveKeyMsg.style.display = 'none';
        }, 300);
      }, 3000);
    });


    $doc('#saveKeyBtn').click(function () {
      const key = $doc('#GPTJsSetting\\.key').val().trim();
      if (!key) {

        const saveKeyMsg = document.getElementById('saveKeyMsg');
        saveKeyMsg.innerText = '\u8bf7\u8f93\u5165Key！';
        saveKeyMsg.style.backgroundColor = '#f44336';
        saveKeyMsg.style.display = 'block';

        setTimeout(function () {
          saveKeyMsg.style.opacity = '1';
          saveKeyMsg.style.transform = 'translateY(0)';
        }, 10);

        showDesktopNotification('\u8bf7\u8f93\u5165Key！', '\u8bf7\u8f93\u5165Key！', '');

        setTimeout(function () {
          saveKeyMsg.style.opacity = '0';
          saveKeyMsg.style.transform = 'translateY(-10px)';
          setTimeout(function () {
            saveKeyMsg.style.display = 'none';
          }, 300);
        }, 3000);
        return;
      }


      GM_xmlhttpRequest({
        url: API_BASE_URL + "?act=verify_key",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: "key=" + encodeURIComponent(key),
        onload: function (response) {
          try {
            const result = JSON.parse(response.responseText);
            const saveKeyMsg = document.getElementById('saveKeyMsg');

            if (result.code === 1) {

              localStorage.setItem('GPTJsSetting.key', key);
              localStorage.setItem('tiku_key', key);


              saveKeyMsg.innerText = 'API Key \u4fdd\u5b58\u6210\u529f！';
              saveKeyMsg.style.backgroundColor = '#4CAF50';
              saveKeyMsg.style.display = 'block';

              setTimeout(function () {
                saveKeyMsg.style.opacity = '1';
                saveKeyMsg.style.transform = 'translateY(0)';
              }, 10);

              showDesktopNotification('API Key \u4fdd\u5b58\u6210\u529f！', '\u60a8\u7684API Key\u5df2\u6210\u529f\u4fdd\u5b58', '');
            } else {

              saveKeyMsg.innerText = result.msg || 'Key\u9a8c\u8bc1\u5931\u8d25';
              saveKeyMsg.style.backgroundColor = '#f44336';
              saveKeyMsg.style.display = 'block';

              setTimeout(function () {
                saveKeyMsg.style.opacity = '1';
                saveKeyMsg.style.transform = 'translateY(0)';
              }, 10);

              showDesktopNotification('Key\u9a8c\u8bc1\u5931\u8d25', result.msg || 'Key\u9a8c\u8bc1\u5931\u8d25', '');
            }


            setTimeout(function () {
              saveKeyMsg.style.opacity = '0';
              saveKeyMsg.style.transform = 'translateY(-10px)';
              setTimeout(function () {
                saveKeyMsg.style.display = 'none';
              }, 300);
            }, 3000);
          } catch (e) {
            alert('\u9a8c\u8bc1\u8bf7\u6c42\u5931\u8d25，\u8bf7\u7a0d\u540e\u91cd\u8bd5');
          }
        },
        onerror: function () {
          alert('\u9a8c\u8bc1\u8bf7\u6c42\u5931\u8d25，\u8bf7\u68c0\u67e5\u7f51\u7edc\u8fde\u63a5');
        }
      });
    });
  } else {
    $('#ne-21log', window.parent.document).html('')
  }
  let _u = getCk('_uid') || getCk('UID')
  $('#ne-21notice').html(`<div>
    <div>\u5f53\u524d\u5b66\u4e60\u901a\u8d26\u53f7UID:`+ _u + `</div>
     <div style="color: #56CABF; font-size: 12px; margin-top: 5px;">\u6302\u673a\u4e0d\u662f\u6316\u77ff，\u6240\u4ee5\u4e0d\u5efa\u8bae\u957f\u65f6\u95f4\u6700\u5c0f\u5316\u7a97\u53e3</div>
    <a target="_blank" href="`+ _host + `?uid=` + _u + `"><button
            style="display: inline-block; padding: 4px 8px; font-size: 10px; border-radius: 4px; text-align: center; text-decoration: none; cursor: pointer; transition: background-color 0.3s ease; color: #fff; background-color: #56CABF; border: none;"
            onmouseover="this.style.backgroundColor='#FC3D74'" onmouseout="this.style.backgroundColor='#3A8BFF'"
            onmousedown="this.style.backgroundColor='#3e8e41'"
            onmouseup="this.style.backgroundColor='#3A8BFF'">\u871c\u96ea\u9898\u5e93\u5b98\u7f51</button></a>
    <button id="moreSettingsBtn"
        style="display: inline-block; padding: 4px 8px; font-size: 10px; border-radius: 4px; text-align: center; text-decoration: none; cursor: pointer; transition: background-color 0.3s ease; color: #fff; background-color:rgb(64, 158, 255); border: none;transform: translateX(5px);">\u8bbe\u7f6e</button>
    <button id="newFeatureBtn"
        style="display: inline-block; padding: 4px 8px; font-size: 10px; border-radius: 4px; text-align: center; text-decoration: none; cursor: pointer; transition: background-color 0.3s ease; color: #fff; background-color:#FC3D74; border: none;transform: translateX(10px);">AI\u529f\u80fd</button>
    <button id="tutorialBtn"
        style="display: inline-block; padding: 4px 8px; font-size: 10px; border-radius: 4px; text-align: center; text-decoration: none; cursor: pointer; transition: background-color 0.3s ease; color: #fff; background-color:#56CABF; border: none;transform: translateX(15px);">\u6559\u7a0b</button>
</div>`);

  GM_xmlhttpRequest({
    method: 'GET',
    url: _host + '/api/v1/auth?uid=' + _u + '&v=' + GM_info['script']['version'],
    timeout: 10000,
    onload: function (xhr) {
      if (xhr.status == 200) {
        var obj = $.parseJSON(xhr.responseText) || {};
        var notice = obj.data.notice;
        var score = obj.data.score;
        $('#userInfo').html(notice + "\u79ef\u5206\u4f59\u989d:" + score);
        if (obj.data.models) {
          var selectedValue = $('#modelSelect').val();
          $('#modelSelect').html(obj.data.models);
          $('#modelSelect').val(selectedValue);
        }
      }
    },
    ontimeout: function () {
      $('#userInfo').html("\u6b22\u8fce\u4f7f\u7528，\u83b7\u53d6\u670d\u52a1\u5668\u516c\u544a\u8d85\u65f6！");
    }
  });


  setTimeout(function () {
    initCheckboxSettings();
  }, 500);
}

function getStr(str, start, end) {
  let res = str.match(new RegExp(`${start}(.*?)${end}`))
  return res ? res[1] : null
}

function getTaskParams() {
  try {
    var _iframeScripts = _d.scripts,
      _p = null;
    for (let i = 0; i < _iframeScripts.length; i++) {
      if (_iframeScripts[i].innerHTML.indexOf('mArg = "";') != -1 && _iframeScripts[i].innerHTML.indexOf('==UserScript==') == -1) {
        _p = getStr(_iframeScripts[i].innerHTML.replace(/\s/g, ""), 'try{mArg=', ';}catch');
        return _p
      }
    }
    return _p
  } catch (e) {
    return null
  }

}

function getCk(name) {
  return document.cookie.match(`[;\s+]?${name}=([^;]*)`)?.pop();
}


function autoLogin() {
  logger('\u7528\u6237\u5df2\u8bbe\u7f6e\u81ea\u52a8\u767b\u5f55', 'green')
  if (setting.phone.length <= 0 || setting.password.length <= 0) {
    logger('\u7528\u6237\u672a\u8bbe\u7f6e\u767b\u5f55\u4fe1\u606f', 'red')
    return
  }
  setTimeout(() => {
    $('#phone').val(setting.phone)
    $('#pwd').val(setting.password)
    $('#loginBtn').click()
  }, 3000)
}

function toNext() {
  refreshCourseList().then((res) => {
    if (setting.review || !setting.work) {
      setTimeout(() => {
        $('#ne-21log', window.parent.document).html('')
        if (top.document.querySelector('#mainid > .prev_next.next') == undefined) {
          top.document.querySelector('#prevNextFocusNext').click();
          return
        }
        top.document.querySelector('#mainid > .prev_next.next').click();
      }, 5000)
      return
    }
    let _t = []
    $.each($(res).find('li'), (_, t) => {
      let curid = $(t).find('.posCatalog_select').attr('id'),
        status = $(t).find('.prevHoverTips').text(),
        name = $(t).find('.posCatalog_name').attr('title');
      if (curid.indexOf('cur') != -1) {
        _t.push({ 'curid': curid, 'status': status, 'name': name })
      }
    })

    let _curChaterId = $('#coursetree', window.parent.document).find('.posCatalog_active').attr('id')
    let _curIndex = _t.findIndex((item) => item['curid'] == _curChaterId)
    for (_curIndex; _curIndex < _t.length - 1; _curIndex++) {
      if (_t[_curIndex]['status'].indexOf('\u5f85\u5b8c\u6210') != -1) {
        let c_tabs = top.document.querySelectorAll('#prev_tab li')
        let c_active_tab = top.document.querySelector('#prev_tab li.active')
        if (c_tabs && c_active_tab) {
          let c_active_tab_id = c_active_tab.getAttribute("id").replace(/dct/, '')
          if (c_active_tab_id != c_tabs.length) {
            setTimeout(() => {
              $('#ne-21log', window.parent.document).html('')
              if (top.document.querySelector('#mainid > .prev_next.next') == undefined) {
                top.document.querySelector('#prevNextFocusNext').click();
                return
              }
              top.document.querySelector('#mainid > .prev_next.next').click();
            }, 5000)
            return
          }
        }
      }
      let t = _t[_curIndex + 1]
      if (t['status'].indexOf('\u5f85\u5b8c\u6210') != -1) {

        showDesktopNotification('\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u4e2a\u4efb\u52a1', `\u5373\u5c06\u5207\u6362\u5230: ${t['name']}`, '');

        setTimeout(() => {
          $('#ne-21log', window.parent.document).html('')
          if (top.document.querySelector('#mainid > .prev_next.next') == undefined) {
            top.document.querySelector('#prevNextFocusNext').click();
            return
          }
          top.document.querySelector('#mainid > .prev_next.next').click();
          showBox()
        }, 5000)
        return
      } else if (t['status'].indexOf('\u95ef\u5173') != -1) {
        logger('\u5f53\u524d\u4e3a\u95ef\u5173\u6a21\u5f0f，\u5b58\u5728\u672a\u5b8c\u6210\u4efb\u52a1\u70b9，\u811a\u672c\u5df2\u6682\u505c\u8fd0\u884c，\u8bf7\u624b\u52a8\u5b8c\u6210\u5e76\u70b9\u51fb\u4e0b\u4e00\u7ae0\u8282', 'red')
        return
      } else if (t['status'].indexOf('\u5f00\u653e') != -1) {
        logger('\u7ae0\u8282\u672a\u5f00\u653e', 'red')
        return
      } else {

      }
    }

    showDesktopNotification('\u8bfe\u7a0b\u5b8c\u6210', '\u6b64\u8bfe\u7a0b\u6240\u6709\u4efb\u52a1\u70b9\u5df2\u5904\u7406\u5b8c\u6bd5', '');
    logger('\u6b64\u8bfe\u7a0b\u5904\u7406\u5b8c\u6bd5', 'green')
    return
  })
}

function initializeTaskSystem() {
  try {
    showBox()
    if (_mlist.length <= 0) {

      showDesktopNotification('\u4efb\u52a1\u70b9\u5b8c\u6210', '\u6b64\u9875\u9762\u6240\u6709\u4efb\u52a1\u70b9\u5df2\u5904\u7406\u5b8c\u6bd5，\u51c6\u5907\u8df3\u8f6c\u9875\u9762', '');
      logger('\u6b64\u9875\u9762\u4efb\u52a1\u5904\u7406\u5b8c\u6bd5，\u51c6\u5907\u8df3\u8f6c\u9875\u9762', 'green')
      return toNext()
    }
    let _type = _mlist[0]['type'],
      _dom = _domList[0],
      _task = _mlist[0];
    if (_type == undefined) {
      _type = _mlist[0]['property']["module"]
    }

    logger('\u6b63\u5728\u5904\u7406\u4efb\u52a1\u7c7b\u578b: ' + _type, 'blue');

    switch (_type) {
      case "video":
        if (_mlist[0]['property']['module'] == 'insertvideo') {
          logger('\u5f00\u59cb\u5904\u7406\u89c6\u9891', 'purple')
          processVideoTask(_dom, _task)
          break
        } else if (_mlist[0]['property']['module'] == 'insertaudio') {
          logger('\u5f00\u59cb\u5904\u7406\u97f3\u9891', 'purple')
          processAudioTask(_dom, _task)
          break
        } else {
          logger('\u672a\u77e5\u7c7b\u578b\u4efb\u52a1，\u8bf7\u8054\u7cfb\u4f5c\u8005，\u8df3\u8fc7', 'red')
          switchMission()
          break
        }
      case "workid":
        logger('\u5f00\u59cb\u5904\u7406\u6d4b\u9a8c', 'purple')

        if (localStorage.getItem('GPTJsSetting.skipTest') === 'true') {
          logger('\u5df2\u8bbe\u7f6e\u4e0d\u505a\u6d4b\u9a8c，\u8df3\u8fc7\u6d4b\u9a8c\u4efb\u52a1', 'orange')
          return toNext()
        } else {
          missonWork(_dom, _task)
        }
        break
      case "document":
        logger('\u5f00\u59cb\u5904\u7406\u6587\u6863', 'purple')
        missonDoucument(_dom, _task)
        break
      case "read":
        logger('\u5f00\u59cb\u5904\u7406\u9605\u8bfb', 'purple')
        missonRead(_dom, _task)
        break
      case "insertbook":
        logger('\u5f00\u59cb\u5904\u7406\u8bfb\u4e66', 'purple')
        missonBook(_dom, _task)
        break
      default:
        let GarbageTasks = ['insertimage']
        if (GarbageTasks.indexOf(_type) != -1) {
          logger('\u53d1\u73b0\u65e0\u9700\u5904\u7406\u4efb\u52a1，\u8df3\u8fc7。', 'red')
          switchMission()
        } else {
          logger('\u6682\u4e0d\u652f\u6301\u5904\u7406\u6b64\u7c7b\u578b:' + _type + '，\u8df3\u8fc7。', 'red')
          switchMission()
        }
    }
  } catch (e) {
    logger('\u521d\u59cb\u5316\u4efb\u52a1\u7cfb\u7edf\u51fa\u9519: ' + e, 'red');


    try {
      if (_mlist && _mlist.length > 0) {
        _mlist.splice(0, 1);
      }
      if (_domList && _domList.length > 0) {
        _domList.splice(0, 1);
      }


      logger('\u5c06\u57285\u79d2\u540e\u5c1d\u8bd5\u7ee7\u7eed\u6267\u884c\u4efb\u52a1\u7cfb\u7edf', 'orange');
      setTimeout(() => {
        try {
          initializeTaskSystem();
        } catch (e2) {
          logger('\u65e0\u6cd5\u6062\u590d\u4efb\u52a1\u7cfb\u7edf，\u8bf7\u5237\u65b0\u9875\u9762: ' + e2, 'red');
        }
      }, 5000);
    } catch (e2) {
      logger('\u6062\u590d\u8fc7\u7a0b\u5931\u8d25，\u8bf7\u5237\u65b0\u9875\u9762: ' + e2, 'red');
    }
  }
}


function processAudioTask(dom, obj) {
  if (!setting.audio) {
    logger('\u7528\u6237\u8bbe\u7f6e\u4e0d\u5904\u7406\u97f3\u9891\u4efb\u52a1，\u51c6\u5907\u5f00\u59cb\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'red')
    try {

      switchMission();
    } catch (e) {
      logger('\u97f3\u9891\u4efb\u52a1\u5207\u6362\u5931\u8d25: ' + e, 'red');

      setTimeout(() => {
        try {
          switchMission();
        } catch (e2) {

          logger('\u4f7f\u7528initializeTaskSystem\u4f5c\u4e3a\u5907\u9009', 'orange');
          setTimeout(initializeTaskSystem, 2000);
        }
      }, 3000);
    }
    return
  }
  let isDo;
  if (setting.task) {
    logger("\u5f53\u524d\u53ea\u5904\u7406\u4efb\u52a1\u70b9\u4efb\u52a1", 'red')
    if (obj['jobid'] == undefined ? false : true) {
      isDo = true
    } else {
      isDo = false
    }
  } else {
    logger("\u5f53\u524d\u9ed8\u8ba4\u5904\u7406\u6240\u6709\u4efb\u52a1（\u5305\u62ec\u975e\u4efb\u52a1\u70b9\u4efb\u52a1）", 'red')
    isDo = true
  }
  if (isDo) {
    let classId = _defaults['clazzId'],
      userId = _defaults['userid'],
      fid = _defaults['fid'],
      reportUrl = _defaults['reportUrl'],
      isPassed = obj['isPassed'],
      otherInfo = obj['otherInfo'],
      jobId = obj['property']['_jobid'],
      name = obj['property']['name'],
      objectId = obj['property']['objectid'];
    if (setting.maskImg) {
      let ifs = $(dom).attr('style');
      $(dom).contents().find('body').find('.main').attr('style', 'visibility:hidden;')
      $(dom).contents().find('body').prepend('<img src="https://pic.521daigua.cn/bg.jpg!/format/webp" style="' + ifs + 'display:block;width:100%;"/>')
    }
    if (!setting.review && isPassed == true) {
      logger('\u97f3\u9891：' + name + '\u68c0\u6d4b\u5df2\u5b8c\u6210，\u51c6\u5907\u5904\u7406\u4e0b\u4e00\u4e2a\u4efb\u52a1', 'green')
      switchMission()
      return
    } else if (setting.review) {
      logger('\u5df2\u5f00\u542f\u590d\u4e60\u6a21\u5f0f，\u5f00\u59cb\u5904\u7406\u97f3\u9891：' + name, 'pink')
    }
    $.ajax({
      url: _l.protocol + '//' + _l.host + "/ananas/status/" + objectId + '?k=' + fid + '&flag=normal&_dc=' + String(Math.round(new Date())),
      type: "GET",
      success: function (res) {
        try {
          let duration = res['duration'],
            dtoken = res['dtoken'],
            clipTime = '0_' + duration,
            playingTime = 0,
            isdrag = 3;
          var _rt = 0.9;
          if (setting.rate == 0) {
            logger('\u5df2\u5f00\u542f\u97f3\u9891\u79d2\u8fc7，99.9%\u4f1a\u5bfc\u81f4\u8fdb\u5ea6\u91cd\u7f6e、\u6302\u79d1\u7b49\u95ee\u9898。', 'red')
            logger('\u5df2\u5f00\u542f\u97f3\u9891\u79d2\u8fc7，\u8bf7\u7b49\u5f855\u79d2！！！', 'red')
          } else if (setting.rate > 1 && setting.rate <= 16) {
            logger('\u5df2\u5f00\u542f\u97f3\u9891\u500d\u901f，\u5f53\u524d\u500d\u901f：' + setting.rate + ',99.9%\u4f1a\u5bfc\u81f4\u8fdb\u5ea6\u91cd\u7f6e、\u6302\u79d1\u7b49\u95ee\u9898。', 'red')
            logger('\u5df2\u5f00\u542f\u97f3\u9891\u500d\u901f，\u8fdb\u5ea640\u79d2\u66f4\u65b0\u4e00\u6b21，\u8bf7\u7b49\u5f85！', 'red')
          } else if (setting.rate > 16) {
            setting.rate = 1
            logger('\u8d85\u8fc7\u5141\u8bb8\u8bbe\u7f6e\u7684\u6700\u5927\u500d\u6570，\u5df2\u91cd\u7f6e\u4e3a1\u500d\u901f。', 'red')
          } else {
            logger("\u97f3\u9891\u8fdb\u5ea6\u6bcf\u969440\u79d2\u66f4\u65b0\u4e00\u6b21，\u8bf7\u7b49\u5f85\u8010\u5fc3\u7b49\u5f85...", 'blue')
          }
          logger("\u97f3\u9891：" + name + "\u5f00\u59cb\u64ad\u653e")
          updateAudio(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt).then((status) => {
            switch (status) {
              case 1:
                logger("\u97f3\u9891：" + name + "\u5df2\u64ad\u653e" + String((playingTime / duration) * 100).slice(0, 4) + '%', 'purple')
                isdrag = 0
                break
              case 3:
                _rt = 1
                break
              default:
                console.log(status)
            }
          })
          let _loop = setInterval(() => {
            playingTime += 40 * setting.rate
            if (playingTime >= duration || setting.rate == 0) {
              clearInterval(_loop)
              playingTime = duration
              isdrag = 4
            } else if (rt = 1 && playingTime == 40 * setting.rate) {
              isdrag = 3
            } else {
              isdrag = 0
            }
            updateAudio(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt).then((status) => {
              switch (status) {
                case 0:
                  playingTime -= 40
                  break
                case 1:
                  logger("\u97f3\u9891：" + name + "\u5df2\u64ad\u653e" + String((playingTime / duration) * 100).slice(0, 4) + '%', 'purple')
                  break
                case 2:
                  clearInterval(_loop)
                  logger("\u97f3\u9891：" + name + "\u68c0\u6d4b\u64ad\u653e\u5b8c\u6bd5，\u51c6\u5907\u5904\u7406\u4e0b\u4e00\u4e2a\u4efb\u52a1。", 'green')
                  switchMission()
                  break
                case 3:
                  playingTime -= 40
                  _rt = Number(_rt) == 1 ? 0.9 : 1
                  break
                default:
                  console.log(status)
              }
            })
          }, setting.rate == 0 ? 5000 : 40000)
        } catch (e) {
          logger('\u53d1\u751f\u9519\u8bef：' + e, 'red')
        }
      }
    });
  } else {
    logger('\u7528\u6237\u8bbe\u7f6e\u53ea\u5904\u7406\u5c5e\u4e8e\u4efb\u52a1\u70b9\u7684\u4efb\u52a1，\u51c6\u5907\u5904\u7406\u4e0b\u4e00\u4e2a\u4efb\u52a1', 'green')
    switchMission()
    return
  }
}

function processVideoTask(dom, obj) {
  if (!setting.video) {
    logger('\u7528\u6237\u8bbe\u7f6e\u4e0d\u5904\u7406\u89c6\u9891\u4efb\u52a1，\u51c6\u5907\u5f00\u59cb\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'red')
    try {

      switchMission();
    } catch (e) {
      logger('\u89c6\u9891\u4efb\u52a1\u5207\u6362\u5931\u8d25: ' + e, 'red');

      setTimeout(() => {
        try {
          switchMission();
        } catch (e2) {

          logger('\u4f7f\u7528initializeTaskSystem\u4f5c\u4e3a\u5907\u9009', 'orange');
          setTimeout(initializeTaskSystem, 2000);
        }
      }, 3000);
    }
    return
  }
  let classId = _defaults["clazzId"], userId = _defaults["userid"], fid = _defaults["fid"], reportUrl = _defaults["reportUrl"], isPassed = obj["isPassed"], otherInfo = obj["otherInfo"], jobId = obj["property"]["_jobid"], name = obj["property"]["name"], objectId = obj["property"]["objectid"];
  if (!setting.review && isPassed == true) {
    logger("\u89c6\u9891：" + name + "\u68c0\u6d4b\u5df2\u5b8c\u6210，\u51c6\u5907\u5904\u7406\u4e0b\u4e00\u4e2a\u4efb\u52a1", "green");
    switchMission();
    return;
  }
  const iframe = $("iframe").get(0);
  const iframeSrc = iframe.src;
  const iframeDocument = iframe.contentDocument;
  if (iframeSrc.includes("video")) {
    logger("\u53d1\u73b0\u4e00\u4e2a\u89c6\u9891，\u6b63\u5728\u89e3\u6790");
    let isExecuted = false;
    const intervalId = setInterval(() => {
      const video = iframeDocument.documentElement.querySelector("video");
      if (video && !isExecuted) {
        logger("\u64ad\u653e\u6210\u529f");
        if (!video) return;
        video.pause();
        video.muted = true;


        if (setting.rate > 1 && setting.rate <= 16) {
          video.playbackRate = setting.rate;
          logger(`\u89c6\u9891\u500d\u901f\u5df2\u8bbe\u7f6e\u4e3a: ${setting.rate}x`, 'blue');
        } else if (setting.rate == 0) {
          video.playbackRate = 16;
          logger('\u89c6\u9891\u79d2\u8fc7\u6a21\u5f0f，\u500d\u901f\u8bbe\u7f6e\u4e3a16x', 'red');
        } else {
          video.playbackRate = 1;
        }

        video.play();
        const listener = () => {
          sleep(2000).then(() => {
            video.play();
          });
        };
        video.addEventListener("pause", listener);
        video.addEventListener("ended", () => {
          logger("\u89c6\u9891\u5df2\u64ad\u653e\u5b8c\u6210");
          video.removeEventListener("pause", listener);
          resolve();
        });
        isExecuted = true;
        clearInterval(intervalId);
      }
    }, 2500);
  } else if (iframeSrc.includes("audio")) {
    logger("\u53d1\u73b0\u4e00\u4e2a\u97f3\u9891，\u6b63\u5728\u89e3\u6790");
    let isExecuted = false;
    const intervalId = setInterval(() => {
      const audio = iframeDocument.documentElement.querySelector("audio");
      if (audio && !isExecuted) {
        logger("\u64ad\u653e\u6210\u529f");
        if (!audio) return;
        audio.pause();
        audio.muted = true;


        if (setting.rate > 1 && setting.rate <= 16) {
          audio.playbackRate = setting.rate;
          logger(`\u97f3\u9891\u500d\u901f\u5df2\u8bbe\u7f6e\u4e3a: ${setting.rate}x`, 'blue');
        } else if (setting.rate == 0) {
          audio.playbackRate = 16;
          logger('\u97f3\u9891\u79d2\u8fc7\u6a21\u5f0f，\u500d\u901f\u8bbe\u7f6e\u4e3a16x', 'red');
        } else {
          audio.playbackRate = 1;
        }

        audio.play();
        const listener = () => {
          sleep(2000).then(() => {
            audio.play();
          });
        };
        audio.addEventListener("pause", listener);
        audio.addEventListener("ended", () => {
          logger("\u97f3\u9891\u5df2\u64ad\u653e\u5b8c\u6210");
          audio.removeEventListener("pause", listener);
          resolve();
        });
        isExecuted = true;
        clearInterval(intervalId);
      }
    }, 2500);
  }
}



function missonBook(dom, obj) {
  if (setting.task) {
    if (obj['jobid'] == undefined) {
      logger("\u5f53\u524d\u53ea\u5904\u7406\u4efb\u52a1\u70b9\u4efb\u52a1,\u8df3\u8fc7", 'red')
      try {

        switchMission();
      } catch (e) {
        logger('\u4e66\u7c4d\u4efb\u52a1\u5207\u6362\u5931\u8d25: ' + e, 'red');

        setTimeout(() => {
          try {
            switchMission();
          } catch (e2) {

            logger('\u4f7f\u7528initializeTaskSystem\u4f5c\u4e3a\u5907\u9009', 'orange');
            setTimeout(initializeTaskSystem, 2000);
          }
        }, 3000);
      }
      return
    }
  }
  let jobId = obj['property']['jobid'],
    name = obj['property']['bookname'],
    jtoken = obj['jtoken'],
    knowledgeId = _defaults['knowledgeid'],
    courseId = _defaults['courseid'],
    clazzId = _defaults['clazzId'];
  if (obj['job'] == undefined) {
    logger('\u8bfb\u4e66：' + name + '\u68c0\u6d4b\u5df2\u5b8c\u6210，\u51c6\u5907\u6267\u884c\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
    switchMission()
    return
  }
  $.ajax({
    url: _l.protocol + "//" + _l.host + '/ananas/job?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
    method: 'GET',
    success: function (res) {
      if (res.status) {
        logger('\u8bfb\u4e66：' + name + res.msg + ',\u51c6\u5907\u6267\u884c\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
      } else {
        logger('\u8bfb\u4e66：' + name + '\u5904\u7406\u5f02\u5e38,\u8df3\u8fc7。', 'red')
      }
      switchMission()
      return
    },
  })
}

function missonLive(dom, obj) {

}

function missonDoucument(dom, obj) {
  if (setting.task) {
    if (obj['jobid'] == undefined) {
      logger("\u5f53\u524d\u53ea\u5904\u7406\u4efb\u52a1\u70b9\u4efb\u52a1,\u8df3\u8fc7", 'red')
      switchMission()
      return
    }
  }
  let jobId = obj['property']['jobid'],
    name = obj['property']['name'],
    jtoken = obj['jtoken'],
    knowledgeId = _defaults['knowledgeid'],
    courseId = _defaults['courseid'],
    clazzId = _defaults['clazzId'];
  if (obj['job'] == undefined) {
    logger('\u6587\u6863：' + name + '\u68c0\u6d4b\u5df2\u5b8c\u6210，\u51c6\u5907\u6267\u884c\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
    try {

      switchMission();
    } catch (e) {
      logger('\u6587\u6863\u4efb\u52a1\u5207\u6362\u5931\u8d25: ' + e, 'red');

      setTimeout(() => {
        try {
          switchMission();
        } catch (e2) {

          logger('\u4f7f\u7528initializeTaskSystem\u4f5c\u4e3a\u5907\u9009', 'orange');
          setTimeout(initializeTaskSystem, 2000);
        }
      }, 3000);
    }
    return
  }
  $.ajax({
    url: _l.protocol + "//" + _l.host + '/ananas/job/document?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
    method: 'GET',
    success: function (res) {
      if (res.status) {
        logger('\u6587\u6863：' + name + res.msg + ',\u51c6\u5907\u6267\u884c\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
      } else {
        logger('\u6587\u6863：' + name + '\u5904\u7406\u5f02\u5e38,\u8df3\u8fc7。', 'red')
      }
      try {

        switchMission();
      } catch (e) {
        logger('\u6587\u6863\u4efb\u52a1\u5207\u6362\u5931\u8d25: ' + e, 'red');

        setTimeout(() => {
          try {
            switchMission();
          } catch (e2) {

            logger('\u4f7f\u7528initializeTaskSystem\u4f5c\u4e3a\u5907\u9009', 'orange');
            setTimeout(initializeTaskSystem, 2000);
          }
        }, 3000);
      }
      return
    },
  })
}

function missonRead(dom, obj) {
  if (setting.task) {
    if (obj['jobid'] == undefined) {
      logger("\u5f53\u524d\u53ea\u5904\u7406\u4efb\u52a1\u70b9\u4efb\u52a1,\u8df3\u8fc7", 'red')
      try {

        switchMission();
      } catch (e) {
        logger('\u9605\u8bfb\u4efb\u52a1\u5207\u6362\u5931\u8d25: ' + e, 'red');

        setTimeout(() => {
          try {
            switchMission();
          } catch (e2) {

            logger('\u4f7f\u7528initializeTaskSystem\u4f5c\u4e3a\u5907\u9009', 'orange');
            setTimeout(initializeTaskSystem, 2000);
          }
        }, 3000);
      }
      return
    }
  }
  let jobId = obj['property']['jobid'],
    name = obj['property']['title'],
    jtoken = obj['jtoken'],
    knowledgeId = _defaults['knowledgeid'],
    courseId = _defaults['courseid'],
    clazzId = _defaults['clazzId'];
  if (obj['job'] == undefined) {
    logger('\u9605\u8bfb：' + name + ',\u68c0\u6d4b\u5df2\u5b8c\u6210，\u51c6\u5907\u6267\u884c\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
    try {

      switchMission();
    } catch (e) {
      logger('\u9605\u8bfb\u4efb\u52a1\u5207\u6362\u5931\u8d25: ' + e, 'red');

      setTimeout(() => {
        try {
          switchMission();
        } catch (e2) {

          logger('\u4f7f\u7528initializeTaskSystem\u4f5c\u4e3a\u5907\u9009', 'orange');
          setTimeout(initializeTaskSystem, 2000);
        }
      }, 3000);
    }
    return
  }
  $.ajax({
    url: _l.protocol + '//' + _l.host + '/ananas/job/readv2?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
    method: 'GET',
    success: function (res) {
      if (res.status) {
        logger('\u9605\u8bfb：' + name + res.msg + ',\u51c6\u5907\u6267\u884c\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
      } else {
        logger('\u9605\u8bfb：' + name + '\u5904\u7406\u5f02\u5e38,\u8df3\u8fc7。', 'red')
      }
      try {

        switchMission();
      } catch (e) {
        logger('\u9605\u8bfb\u4efb\u52a1\u5207\u6362\u5931\u8d25: ' + e, 'red');

        setTimeout(() => {
          try {
            switchMission();
          } catch (e2) {

            logger('\u4f7f\u7528initializeTaskSystem\u4f5c\u4e3a\u5907\u9009', 'orange');
            setTimeout(initializeTaskSystem, 2000);
          }
        }, 3000);
      }
      return
    }
  })
}

function missonWork(dom, obj) {
  if (!setting.work) {
    logger('\u7528\u6237\u8bbe\u7f6e\u4e0d\u81ea\u52a8\u5904\u7406\u6d4b\u9a8c，\u51c6\u5907\u5904\u7406\u4e0b\u4e00\u4e2a\u4efb\u52a1', 'green')
    try {

      switchMission();
    } catch (e) {
      logger('\u6d4b\u9a8c\u4efb\u52a1\u5207\u6362\u5931\u8d25: ' + e, 'red');

      setTimeout(() => {
        try {
          switchMission();
        } catch (e2) {

          logger('\u4f7f\u7528initializeTaskSystem\u4f5c\u4e3a\u5907\u9009', 'orange');
          setTimeout(initializeTaskSystem, 2000);
        }
      }, 3000);
    }
    return
  }
  let isDo;
  if (setting.task) {
    logger("\u5f53\u524d\u53ea\u5904\u7406\u4efb\u52a1\u70b9\u4efb\u52a1", 'red')
    if (obj['jobid'] == undefined ? false : true) {
      isDo = true
    } else {
      isDo = false

      try {
        logger('\u975e\u4efb\u52a1\u70b9\u6d4b\u9a8c，\u8df3\u8fc7', 'orange');
        switchMission();
      } catch (e) {
        logger('\u4efb\u52a1\u5207\u6362\u5931\u8d25: ' + e, 'red');
        setTimeout(initializeTaskSystem, 3000);
      }
      return;
    }
  } else {
    logger("\u5f53\u524d\u9ed8\u8ba4\u5904\u7406\u6240\u6709\u4efb\u52a1（\u5305\u62ec\u975e\u4efb\u52a1\u70b9\u4efb\u52a1）", 'red')
    isDo = true
  }
  if (isDo) {
    if (obj['jobid'] !== undefined) {
      var phoneWeb = _l.protocol + '//' + _l.host + '/work/phone/work?workId=' + obj['jobid'].replace('work-', '') + '&courseId=' + _defaults['courseid'] + '&clazzId=' + _defaults['clazzId'] + '&knowledgeId=' + _defaults['knowledgeid'] + '&jobId=' + obj['jobid'] + '&enc=' + obj['enc']

      setTimeout(() => { startDoPhoneCyWork(0, dom, phoneWeb) }, 3000)
    } else {
      setTimeout(() => { startDoCyWork(0, dom) }, 3000)
    }



  } else {
    logger('\u7528\u6237\u8bbe\u7f6e\u53ea\u5904\u7406\u5c5e\u4e8e\u4efb\u52a1\u70b9\u7684\u4efb\u52a1，\u51c6\u5907\u5904\u7406\u4e0b\u4e00\u4e2a\u4efb\u52a1', 'green')
    switchMission()
    return
  }
}

function doPhoneWork($dom) {
  let $cy = $dom.find('.Wrappadding form')
  $subBtn = $cy.find('.zquestions .zsubmit .btn-ok-bottom')
  $okBtn = $dom.find('#okBtn')
  $saveBtn = $cy.find('.zquestions .zsubmit .btn-save')
  let TimuList = $cy.find('.zquestions .Py-mian1')
  startDoPhoneTimu(0, TimuList)
}

function startDoPhoneTimu(index, TimuList) {
  if (index == TimuList.length) {
    if (localStorage.getItem('GPTJsSetting.sub') === 'true') {
      logger('\u6d4b\u9a8c\u5904\u7406\u5b8c\u6210，\u51c6\u5907\u81ea\u52a8\u63d0\u4ea4。', 'green')
      setTimeout(() => {
        $subBtn.click()
        setTimeout(() => {
          logger('\u63d0\u4ea4\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
          _mlist.splice(0, 1)
          _domList.splice(0, 1)
          setTimeout(() => { switchMission() }, 3000)
        }, 3000)
      }, 5000)
    } else if (localStorage.getItem('GPTJsSetting.force') === 'true') {
      logger('\u6d4b\u9a8c\u5904\u7406\u5b8c\u6210，\u5b58\u5728\u65e0\u7b54\u6848\u9898\u76ee,\u7531\u4e8e\u7528\u6237\u8bbe\u7f6e\u4e86\u5f3a\u5236\u63d0\u4ea4，\u51c6\u5907\u81ea\u52a8\u63d0\u4ea4。', 'red')
      setTimeout(() => {
        $subBtn.click()
        setTimeout(() => {
          $okBtn.click()
          logger('\u63d0\u4ea4\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
          _mlist.splice(0, 1)
          _domList.splice(0, 1)
          setTimeout(() => { switchMission() }, 3000)
        }, 3000)
      }, 5000)
    } else {
      logger('\u6d4b\u9a8c\u5904\u7406\u5b8c\u6210，\u5b58\u5728\u65e0\u7b54\u6848\u9898\u76ee\u6216\u7528\u6237\u8bbe\u7f6e\u4e0d\u81ea\u52a8\u63d0\u4ea4，\u81ea\u52a8\u4fdd\u5b58！', 'green')
      setTimeout(() => {
        logger('\u4fdd\u5b58\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
        $saveBtn.click()
        setTimeout(() => {
          logger('\u4fdd\u5b58\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
          _mlist.splice(0, 1)
          _domList.splice(0, 1)


          try {
            logger('\u6b63\u5728\u6267\u884c\u4efb\u52a1\u5207\u6362...', 'blue');

            initializeTaskSystem();
          } catch (e) {
            logger('\u4efb\u52a1\u5207\u6362\u51fa\u9519: ' + e, 'red');

            setTimeout(() => {
              try {
                switchMission();
              } catch (e2) {
                logger('\u901a\u8fc7switchMission\u5207\u6362\u4efb\u52a1\u4e5f\u5931\u8d25: ' + e2, 'red');
                logger('\u5c06\u57285\u79d2\u540e\u91cd\u8bd5，\u5982\u4ecd\u5931\u8d25\u8bf7\u5237\u65b0\u9875\u9762', 'orange');

                setTimeout(() => {
                  try {
                    toNext();
                  } catch (e3) {
                    logger('\u65e0\u6cd5\u81ea\u52a8\u5207\u6362，\u8bf7\u624b\u52a8\u5207\u6362\u5230\u4e0b\u4e00\u4efb\u52a1', 'red');
                  }
                }, 5000);
              }
            }, 3000);
          }
        }, 3000)
      }, 5000)
    }
    return
  }
  let questionFull = $(TimuList[index]).find('.Py-m1-title').html()
  let _question = formatQuestionText(questionFull).replace(/.*?\[.*?\u9898\]\s*\n\s*/, '').trim()
  let _type = ({ \u5355\u9009\u9898: 0, \u591a\u9009\u9898: 1, \u586b\u7a7a\u9898: 2, \u5224\u65ad\u9898: 3, \u7b80\u7b54\u9898: 4, \u9009\u62e9\u9898: 5 })[questionFull.match(/.*?\[(.*?)]|$/)[1]]
  let _a = []
  let _answerTmpArr
  var check_answer_flag = 0;
  switch (_type) {
    case 0:

      _answerTmpArr = $(TimuList[index]).find('.answerList.singleChoice li')
      var mergedAnswers = [];
      _answerTmpArr.each(function () {
        var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
        mergedAnswers.push(answerText);
      });
      mergedAnswers = mergedAnswers.join("|");


      logger("\u5355\u9009\u9898: " + _question + '\n' + mergedAnswers, 'blue');

      let phoneQuestionWithOptions = _question + '\n' + mergedAnswers;


      for (var i = 0; i < _answerTmpArr.length; i++) {
        if ($(_answerTmpArr[i]).attr('aria-label')) {
          logger(index + 1 + '\u6b64\u9898\u5df2\u4f5c\u7b54，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          check_answer_flag = 1;
          setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 300)
          break
        }
      }
      if (check_answer_flag == 0) {
        getAnswer(_type, phoneQuestionWithOptions).then((agrs) => {
          _answerTmpArr = $(TimuList[index]).find('.answerList.singleChoice li')
          $.each(_answerTmpArr, (i, t) => {
            _a.push(cleanTextContent($(t).html()).replace(/^[A-Z]\s*\n\s*/, '').trim())
          })


          let _i = -1;


          if (!agrs || agrs.trim() === '') {
            logger('\u672a\u83b7\u53d6\u5230\u6709\u6548\u7b54\u6848，\u8df3\u8fc7\u6b64\u9898', 'red');
            localStorage.setItem('GPTJsSetting.sub', false);
            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time);
            return;
          }


          if (/^[A-D]$/i.test(agrs.trim())) {

            let letterIndex = agrs.trim().toUpperCase().charCodeAt(0) - 65;
            if (letterIndex >= 0 && letterIndex < _answerTmpArr.length) {
              _i = letterIndex;

            }
          }

          else if (/\u7b54\u6848：?[A-D]/i.test(agrs)) {
            let match = agrs.match(/\u7b54\u6848：?([A-D])/i);
            if (match && match[1]) {
              let letterIndex = match[1].toUpperCase().charCodeAt(0) - 65;
              if (letterIndex >= 0 && letterIndex < _answerTmpArr.length) {
                _i = letterIndex;
                logger('\u4ece\u7b54\u6848\u6587\u672c\u4e2d\u63d0\u53d6\u9009\u9879: ' + match[1] + '，\u5bf9\u5e94\u7d22\u5f15: ' + _i, 'green');
              }
            }
          }

          else {

            _i = _a.findIndex((item) => item == agrs);


            if (_i == -1 && !agrs.includes('\u672a\u627e\u5230\u7b54\u6848') && agrs !== '\u6682\u65e0\u7b54\u6848') {
              for (let j = 0; j < _a.length; j++) {
                if (agrs.includes(_a[j]) || _a[j].includes(agrs)) {
                  _i = j;
                  logger('\u4f7f\u7528\u5185\u5bb9\u6a21\u7cca\u5339\u914d\u627e\u5230\u9009\u9879，\u7d22\u5f15: ' + _i, 'green');
                  break;
                }
              }
            }
          }

          if (_i == -1) {
            logger('\u65e0\u6cd5\u5339\u914d\u6b63\u786e\u7b54\u6848,\u8bf7\u624b\u52a8\u9009\u62e9，\u8df3\u8fc7\u6b64\u9898', 'red')

            localStorage.setItem('GPTJsSetting.sub', false)
            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
          } else {
            $(_answerTmpArr[_i]).click()
            logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
          }
        }).catch((agrs) => {
          logger('\u7b54\u6848\u83b7\u53d6\u5931\u8d25，\u8df3\u8fc7\u6b64\u9898', 'red');
          if (agrs['c'] == 0) {
            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
          }
        })
      }
      break
    case 1:

      _answerTmpArr = $(TimuList[index]).find('.answerList.multiChoice li')
      var mergedAnswers = [];
      _answerTmpArr.each(function () {
        var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
        mergedAnswers.push(answerText);
      });
      mergedAnswers = mergedAnswers.join("|");


      logger("\u591a\u9009\u9898: " + _question + '\n' + mergedAnswers, 'blue');

      let phoneMultiQuestionWithOptions = _question + '\n' + mergedAnswers;


      for (var i = 0; i < _answerTmpArr.length; i++) {
        if ($(_answerTmpArr[i]).attr('aria-label')) {
          logger(index + 1 + '\u6b64\u9898\u5df2\u4f5c\u7b54，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          check_answer_flag = 1;
          setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 300)
          break
        }
      }
      if (check_answer_flag == 0) {
        getAnswer(_type, phoneMultiQuestionWithOptions).then((agrs) => {

          if (!agrs || agrs.trim() === '' || agrs.includes('\u672a\u627e\u5230\u7b54\u6848') || agrs === '\u6682\u65e0\u7b54\u6848') {
            logger('\u672a\u83b7\u53d6\u5230\u6709\u6548\u7b54\u6848，\u8df3\u8fc7\u6b64\u9898', 'red')

            localStorage.setItem('GPTJsSetting.sub', false)
            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
            return;
          } else {
            _answerTmpArr = $(TimuList[index]).find('.answerList.multiChoice li')


            if (/^[A-D]+$/i.test(agrs.trim())) {

              let letters = agrs.trim().toUpperCase().split('');
              logger('\u8bc6\u522b\u5230\u591a\u9009\u9898\u9009\u9879\u5b57\u6bcd: ' + letters.join(','), 'green');

              letters.forEach(letter => {
                let index = letter.charCodeAt(0) - 65;
                if (index >= 0 && index < _answerTmpArr.length) {
                  setTimeout(() => { $(_answerTmpArr[index]).click() }, 300);
                }
              });
            }

            else if (/\u7b54\u6848：?[A-D]+/i.test(agrs)) {
              let match = agrs.match(/\u7b54\u6848：?([A-D]+)/i);
              if (match && match[1]) {
                let letters = match[1].toUpperCase().split('');
                logger('\u4ece\u7b54\u6848\u6587\u672c\u4e2d\u63d0\u53d6\u9009\u9879: ' + letters.join(','), 'green');

                letters.forEach(letter => {
                  let index = letter.charCodeAt(0) - 65;
                  if (index >= 0 && index < _answerTmpArr.length) {
                    setTimeout(() => { $(_answerTmpArr[index]).click() }, 300);
                  }
                });
              }
            }

            else {

              let aiAnswers = agrs.split('###').map(ans => ans.trim());
              logger(`\u4f7f\u7528AI\u8fd4\u56de\u7684\u5b8c\u6574\u9009\u9879\u5185\u5bb9: ${agrs}`, 'blue');
              logger(`\u6700\u7ec8\u5904\u7406\u540e\u7684AI\u7b54\u6848: ${agrs}`, 'blue');

              $.each(_answerTmpArr, (i, t) => {
                let _tt = cleanTextContent($(t).html()).replace(/^[A-Z]\s*\n\s*/, '').trim();


                let matched = false;


                for (let aiAnswer of aiAnswers) {
                  if (_tt === aiAnswer) {
                    matched = true;
                    logger(`\u7cbe\u786e\u5339\u914d\u9009\u9879 ${i + 1}: "${_tt}" = "${aiAnswer}"`, 'green');
                    break;
                  }
                }


                if (!matched) {
                  for (let aiAnswer of aiAnswers) {
                    if (aiAnswer.indexOf(_tt) !== -1) {
                      matched = true;
                      logger(`\u5305\u542b\u5339\u914d\u9009\u9879 ${i + 1}: "${_tt}" \u5305\u542b\u5728 "${aiAnswer}"`, 'green');
                      break;
                    }
                  }
                }


                if (!matched) {
                  for (let aiAnswer of aiAnswers) {
                    if (_tt.indexOf(aiAnswer) !== -1) {
                      matched = true;
                      logger(`\u53cd\u5411\u5305\u542b\u5339\u914d\u9009\u9879 ${i + 1}: "${aiAnswer}" \u5305\u542b\u5728 "${_tt}"`, 'green');
                      break;
                    }
                  }
                }


                if (!matched) {
                  let cleanTt = _tt.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
                  for (let aiAnswer of aiAnswers) {
                    let cleanAiAnswer = aiAnswer.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
                    if (cleanTt === cleanAiAnswer) {
                      matched = true;
                      logger(`\u6a21\u7cca\u5339\u914d\u9009\u9879 ${i + 1}: "${cleanTt}" = "${cleanAiAnswer}"`, 'green');
                      break;
                    }
                  }
                }

                if (matched) {
                  setTimeout(() => { $(_answerTmpArr[i]).click() }, 300 + i * 100);
                }
              });
            }

            let check = 0
            setTimeout(() => {
              $.each(_answerTmpArr, (i, t) => {
                if ($(t).attr('class').indexOf('cur') != -1) {
                  check = 1
                }
              })
              if (check) {
                logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
              } else {
                logger('\u672a\u80fd\u6b63\u786e\u9009\u62e9\u7b54\u6848，\u8bf7\u624b\u52a8\u9009\u62e9，\u8df3\u8fc7\u6b64\u9898', 'red')

                localStorage.setItem('GPTJsSetting.sub', false)
              }
              setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
            }, 1000)
          }
        }).catch((agrs) => {
          if (agrs['c'] == 0) {
            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
          }
        })
      }
      break
    case 2:

      let isNewFramework = $(TimuList[index]).find('.blankList2').length > 0;
      let tkList;

      if (isNewFramework) {

        tkList = $(TimuList[index]).find('.blankList2 .Briefanswer');
        logger('\u68c0\u6d4b\u5230\u65b0\u6d4b\u9a8c\u6846\u67b6，\u4f7f\u7528\u5bcc\u6587\u672c\u7f16\u8f91\u5668\u5904\u7406\u586b\u7a7a\u9898', 'blue');
      } else {

        tkList = $(TimuList[index]).find('.blankList2 input');
        logger('\u68c0\u6d4b\u5230\u539f\u59cb\u6d4b\u9a8c\u6846\u67b6，\u4f7f\u7528input\u5143\u7d20\u5904\u7406\u586b\u7a7a\u9898', 'blue');
      }


      let isAnswered = false;
      if (isNewFramework) {

        tkList.each(function () {
          let editorId = $(this).find('iframe').attr('id');
          if (editorId) {
            try {
              let editorInstance = window.UE && window.UE.getEditor && window.UE.getEditor(editorId.replace('ueditor_', 'ueditorInstant'));
              if (editorInstance && editorInstance.getContent && editorInstance.getContent().trim() !== '') {
                isAnswered = true;
                return false;
              }
            } catch (e) {

              let content = $(this).find('iframe').contents().find('body').text().trim();
              if (content !== '') {
                isAnswered = true;
                return false;
              }
            }
          }
        });
      } else {

        if (tkList.length > 0 && $(tkList[0]).val() !== null && $(tkList[0]).val().trim() !== '') {
          isAnswered = true;
        }
      }

      if (isAnswered) {
        logger("\u6b64\u9898\u5df2\u4f5c\u7b54,\u8df3\u8fc7", "green");
        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 300);
        break;
      }

      getAnswer(_type, _question).then((agrs) => {
        if (agrs == '\u6682\u65e0\u7b54\u6848' || agrs === '') {
          logger('AI\u65e0\u6cd5\u5b8c\u7f8e\u5339\u914d\u6b63\u786e\u7b54\u6848,\u8bf7\u624b\u52a8\u9009\u62e9，\u8df3\u8fc7\u6b64\u9898', 'red')
          localStorage.setItem('GPTJsSetting.sub', false)
          setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
          return
        }


        let processedAnswer = agrs;


        if (processedAnswer.includes('\u7b54\u6848：')) {
          let parts = processedAnswer.split('\u7b54\u6848：');
          if (parts.length > 1) {
            processedAnswer = parts[1].trim();

            let lines = processedAnswer.split(/[\n\r]+/);
            processedAnswer = lines[0].trim();
            logger('\u4eceAI\u56de\u7b54\u4e2d\u63d0\u53d6\u586b\u7a7a\u7b54\u6848: ' + processedAnswer, 'green');
          }
        }


        let answers;


        if (processedAnswer.includes('#')) {
          answers = processedAnswer.split('#');
          logger('\u4f7f\u7528#\u53f7\u5206\u9694\u586b\u7a7a\u7b54\u6848', 'green');
        }

        else if (processedAnswer.includes('，') || processedAnswer.includes(',')) {
          answers = processedAnswer.split(/[,，]/);
          logger('\u4f7f\u7528\u9017\u53f7\u5206\u9694\u586b\u7a7a\u7b54\u6848', 'green');
        }

        else if (processedAnswer.includes(' ') || processedAnswer.includes('\t')) {
          answers = processedAnswer.split(/[\s\t]+/);
          logger('\u4f7f\u7528\u7a7a\u683c\u5206\u9694\u586b\u7a7a\u7b54\u6848', 'green');
        }

        else if (processedAnswer.includes('；') || processedAnswer.includes(';')) {
          answers = processedAnswer.split(/[;；]/);
          logger('\u4f7f\u7528\u5206\u53f7\u5206\u9694\u586b\u7a7a\u7b54\u6848', 'green');
        }

        else {
          answers = [processedAnswer];
          logger('\u586b\u7a7a\u7b54\u6848\u65e0\u5206\u9694\u7b26，\u4f5c\u4e3a\u5355\u4e2a\u7b54\u6848\u5904\u7406', 'green');
        }

        if (isNewFramework) {

          logger('\u5f00\u59cb\u586b\u5145\u65b0\u6846\u67b6\u586b\u7a7a\u9898\u7b54\u6848', 'blue');
          tkList.each(function (i) {
            if (i < answers.length) {
              let answer = answers[i].trim();

              answer = answer.replace(/^\s*[\(（]?\d+[\)）\.]?\s*/, '');

              let editorDiv = $(this);
              let editorId = editorDiv.find('iframe').attr('id');

              if (editorId) {
                setTimeout(() => {
                  try {

                    let editorInstanceId = editorId.replace('ueditor_', 'ueditorInstant');
                    let editorInstance = window.UE && window.UE.getEditor && window.UE.getEditor(editorInstanceId);

                    if (editorInstance && editorInstance.setContent) {

                      editorInstance.setContent(answer);

                      if (editorInstance.fireEvent) {
                        editorInstance.fireEvent('contentchange');
                      }
                      logger(`\u6210\u529f\u901a\u8fc7UEditor API\u586b\u5145\u7b2c${i + 1}\u7a7a: ${answer}`, 'green');
                    } else {

                      let iframe = editorDiv.find('iframe')[0];
                      if (iframe && iframe.contentDocument) {
                        let body = iframe.contentDocument.body;
                        if (body) {

                          if (body.hasAttribute('placeholder-attr')) {
                            body.removeAttribute('placeholder-attr');
                          }

                          if (body.classList.contains('empty')) {
                            body.classList.remove('empty');
                          }

                          body.innerHTML = `<p>${answer}</p>`;

                          let inputEvent = new Event('input', { bubbles: true });
                          body.dispatchEvent(inputEvent);
                          logger(`\u6210\u529f\u901a\u8fc7iframe\u76f4\u63a5\u586b\u5145\u7b2c${i + 1}\u7a7a: ${answer}`, 'green');
                        }
                      }
                    }
                  } catch (e) {
                    logger(`\u586b\u5145\u7b2c${i + 1}\u7a7a\u65f6\u51fa\u9519: ${e.message}`, 'red');
                  }
                }, 200 * (i + 1));
              }
            }
          });
        } else {

          logger('\u5f00\u59cb\u586b\u5145\u539f\u59cb\u6846\u67b6\u586b\u7a7a\u9898\u7b54\u6848', 'blue');
          $.each(tkList, (i, t) => {
            if (i < answers.length) {
              let answer = answers[i].trim();

              answer = answer.replace(/^\s*[\(（]?\d+[\)）\.]?\s*/, '');
              setTimeout(() => { $(t).val(answer) }, 200)
            }
          });
        }

        logger('\u586b\u7a7a\u9898\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
      }).catch((agrs) => {
        if (agrs['c'] == 0) {
          setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
        }
      })
      break
    case 3:

      logger("\u5224\u65ad\u9898(\u53ea\u56de\u7b54\u6b63\u786e\u6216\u9519\u8bef): " + _question, 'blue');
      getAnswer(_type, _question).then((agrs) => {

        if (!agrs || agrs.trim() === '' || agrs.includes('\u672a\u627e\u5230\u7b54\u6848') || agrs === '\u6682\u65e0\u7b54\u6848') {
          logger('\u672a\u83b7\u53d6\u5230\u6709\u6548\u7b54\u6848，\u8df3\u8fc7\u6b64\u9898', 'red')

          localStorage.setItem('GPTJsSetting.sub', false)
          setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
          return
        }
        let _true = '\u6b63\u786e|\u662f|\u5bf9|√|T|ri|true|yes'
        let _false = '\u9519\u8bef|\u5426|\u9519|×|F|wr|false|no'
        _answerTmpArr = $(TimuList[index]).find('.answerList.panduan li')


        let cleanAnswer = agrs;
        if (agrs.includes('\u7b54\u6848：')) {
          cleanAnswer = agrs.split('\u7b54\u6848：')[1].trim().split(/[\n\r]/)[0].trim();
          logger('\u4eceAI\u56de\u7b54\u4e2d\u63d0\u53d6\u5224\u65ad\u7ed3\u679c: ' + cleanAnswer, 'green');
        }


        let isTrue = false;
        let isFalse = false;


        _true.split('|').forEach(keyword => {
          if (cleanAnswer.toLowerCase().includes(keyword.toLowerCase())) {
            isTrue = true;
          }
        });


        _false.split('|').forEach(keyword => {
          if (cleanAnswer.toLowerCase().includes(keyword.toLowerCase())) {
            isFalse = true;
          }
        });

        if (isTrue && !isFalse) {
          logger('\u5224\u65ad\u4e3a"\u6b63\u786e"', 'green');
          $.each(_answerTmpArr, (i, t) => {
            if ($(t).attr('val-param') == 'true') {
              $(t).click()
            }
          })
        } else if (isFalse && !isTrue) {
          logger('\u5224\u65ad\u4e3a"\u9519\u8bef"', 'green');
          $.each(_answerTmpArr, (i, t) => {
            if ($(t).attr('val-param') == 'false') {
              $(t).click()
            }
          })
        } else if (_true.indexOf(cleanAnswer) != -1) {

          logger('\u4f7f\u7528\u539f\u6709\u903b\u8f91\u5224\u65ad\u4e3a"\u6b63\u786e"', 'green');
          $.each(_answerTmpArr, (i, t) => {
            if ($(t).attr('val-param') == 'true') {
              $(t).click()
            }
          })
        } else {

          logger('\u9ed8\u8ba4\u5224\u65ad\u4e3a"\u9519\u8bef"', 'orange');
          $.each(_answerTmpArr, (i, t) => {
            if ($(t).attr('val-param') == 'false') {
              $(t).click()
            }
          })
        }

        logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
      }).catch((agrs) => {
        if (agrs['c'] == 0) {
          setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
        }
      })
      break
    case 4:

      logger("\u5224\u65ad\u9898(\u53ea\u56de\u7b54\u6b63\u786e\u6216\u9519\u8bef): " + _question, 'blue');
      getAnswer(_type, _question).then((agrs) => {

        if (!agrs || agrs.trim() === '' || agrs.includes('\u672a\u627e\u5230\u7b54\u6848') || agrs === '\u6682\u65e0\u7b54\u6848') {
          logger('\u672a\u83b7\u53d6\u5230\u6709\u6548\u7b54\u6848，\u8df3\u8fc7\u6b64\u9898', 'red')

          localStorage.setItem('GPTJsSetting.sub', false)
          setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
          return
        }
        let _true = '\u6b63\u786e|\u662f|\u5bf9|√|T|ri|true|yes'
        let _false = '\u9519\u8bef|\u5426|\u9519|×|F|wr|false|no'
        _answerTmpArr = $(TimuList[index]).find('.answerList.panduan li')


        let cleanAnswer = agrs;
        if (agrs.includes('\u7b54\u6848：')) {
          cleanAnswer = agrs.split('\u7b54\u6848：')[1].trim().split(/[\n\r]/)[0].trim();
          logger('\u4eceAI\u56de\u7b54\u4e2d\u63d0\u53d6\u5224\u65ad\u7ed3\u679c: ' + cleanAnswer, 'green');
        }


        let isTrue = false;
        let isFalse = false;


        _true.split('|').forEach(keyword => {
          if (cleanAnswer.toLowerCase().includes(keyword.toLowerCase())) {
            isTrue = true;
          }
        });


        _false.split('|').forEach(keyword => {
          if (cleanAnswer.toLowerCase().includes(keyword.toLowerCase())) {
            isFalse = true;
          }
        });

        if (isTrue && !isFalse) {
          logger('\u5224\u65ad\u4e3a"\u6b63\u786e"', 'green');
          $.each(_answerTmpArr, (i, t) => {
            if ($(t).attr('val-param') == 'true') {
              $(t).click()
            }
          })
        } else if (isFalse && !isTrue) {
          logger('\u5224\u65ad\u4e3a"\u9519\u8bef"', 'green');
          $.each(_answerTmpArr, (i, t) => {
            if ($(t).attr('val-param') == 'false') {
              $(t).click()
            }
          })
        } else if (_true.indexOf(cleanAnswer) != -1) {

          logger('\u4f7f\u7528\u539f\u6709\u903b\u8f91\u5224\u65ad\u4e3a"\u6b63\u786e"', 'green');
          $.each(_answerTmpArr, (i, t) => {
            if ($(t).attr('val-param') == 'true') {
              $(t).click()
            }
          })
        } else {

          logger('\u9ed8\u8ba4\u5224\u65ad\u4e3a"\u9519\u8bef"', 'orange');
          $.each(_answerTmpArr, (i, t) => {
            if ($(t).attr('val-param') == 'false') {
              $(t).click()
            }
          })
        }

        logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
      }).catch((agrs) => {
        if (agrs['c'] == 0) {
          setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
        }
      })
      break
    case 5:
      getAnswer(_type, _question).then((agrs) => {

        localStorage.setItem('GPTJsSetting.sub', false)
        logger('\u6b64\u7c7b\u578b\u9898\u76ee\u65e0\u6cd5\u533a\u5206\u5355/\u591a\u9009，\u8bf7\u624b\u52a8\u9009\u62e9\u7b54\u6848', 'red')
        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
      }).catch((agrs) => {
        if (agrs['c'] == 0) {
          setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
        }
      })
      break
    default:
      logger('\u6682\u4e0d\u652f\u6301\u5904\u7406\u6b64\u7c7b\u578b\u9898\u76ee：' + questionFull.match(/.*?\[(.*?)]|$/)[1] + ',\u8df3\u8fc7！\u8bf7\u624b\u52a8\u4f5c\u7b54。', 'red')

      localStorage.setItem('GPTJsSetting.sub', false)
      setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
      break
  }
}

function startDoPhoneCyWork(index, doms, phoneWeb) {
  if (index == doms.length) {
    logger('\u6b64\u9875\u9762\u5168\u90e8\u6d4b\u9a8c\u5df2\u5904\u7406\u5b8c\u6bd5！\u51c6\u5907\u8fdb\u884c\u4e0b\u4e00\u9879\u4efb\u52a1')
    setTimeout(missonStart, 5000)
    return
  }
  logger('\u7b49\u5f85\u6d4b\u9a8c\u6846\u67b6\u52a0\u8f7d...', 'purple')
  getElement($(doms[index]).contents()[0], 'iframe').then(element => {
    let workIframe = element
    if (workIframe.length == 0) {
      setTimeout(() => { startDoPhoneCyWork(index, doms) }, 5000)
    }

    let workStatus = $(workIframe).contents().find('.newTestCon .newTestTitle .testTit_status').text().trim()

    if (!workStatus) {
      _domList.splice(0, 1)
      setTimeout(missonStart, 2000)
      return
    }
    if (setting.share && workStatus.indexOf("\u5df2\u5b8c\u6210") != -1) {
      logger('\u6d4b\u9a8c：' + (index + 1) + ',\u68c0\u6d4b\u5230\u6b64\u6d4b\u9a8c\u5df2\u5b8c\u6210,\u51c6\u5907\u6536\u5f55\u7b54\u6848。', 'green')
      setTimeout(() => { upLoadWork(index, doms, workIframe) }, 2000)
    } else if (workStatus.indexOf("\u5f85\u505a") != -1 || workStatus.indexOf("\u5f85\u5b8c\u6210") != -1 || workStatus.indexOf("\u672a\u8fbe\u5230\u53ca\u683c\u7ebf") != -1) {
      logger('\u6d4b\u9a8c：' + (index + 1) + ',\u51c6\u5907\u5904\u7406\u6b64\u6d4b\u9a8c...', 'purple')
      $(workIframe).attr('src', phoneWeb)
      getElement($(doms[index]).contents()[0], 'iframe[src="' + phoneWeb + '"]').then((element) => {
        setTimeout(() => { doPhoneWork($(element).contents()) }, 3000)
      })
    } else if (workStatus.indexOf('\u5f85\u6279\u9605') != -1) {
      _mlist.splice(0, 1)
      _domList.splice(0, 1)
      logger('\u6d4b\u9a8c：' + (index + 1) + ',\u6d4b\u9a8c\u5f85\u6279\u9605,\u8df3\u8fc7', 'red')
      setTimeout(() => { startDoPhoneCyWork(index + 1, doms, phoneWeb) }, 5000)
    } else {
      _mlist.splice(0, 1)
      _domList.splice(0, 1)
      logger('\u6d4b\u9a8c：' + (index + 1) + ',\u672a\u77e5\u72b6\u6001\u6216\u7528\u6237\u9009\u62e9\u4e0d\u6536\u5f55\u7b54\u6848,\u8df3\u8fc7', 'red')
      setTimeout(() => { startDoPhoneCyWork(index + 1, doms, phoneWeb) }, 5000)
    }
  })
}

function startDoCyWork(index, doms) {
  if (index == doms.length) {
    logger('\u6b64\u9875\u9762\u5168\u90e8\u6d4b\u9a8c\u5df2\u5904\u7406\u5b8c\u6bd5！\u51c6\u5907\u8fdb\u884c\u4e0b\u4e00\u9879\u4efb\u52a1')
    setTimeout(missonStart, 5000)
    return
  }
  logger('\u7b49\u5f85\u6d4b\u9a8c\u6846\u67b6\u52a0\u8f7d...', 'purple')
  getElement($(doms[index]).contents()[0], 'iframe').then(element => {
    let workIframe = element
    if (workIframe.length == 0) {
      setTimeout(() => { startDoCyWork(index, doms) }, 5000)
    }
    let workStatus = $(workIframe).contents().find(".newTestCon .newTestTitle .testTit_status").text().trim()
    if (!workStatus) {
      _domList.splice(0, 1)
      setTimeout(missonStart, 2000)
      return
    }
    if (setting.share && workStatus.indexOf("\u5df2\u5b8c\u6210") != -1) {
      logger('\u6d4b\u9a8c：' + (index + 1) + ',\u68c0\u6d4b\u5230\u6b64\u6d4b\u9a8c\u5df2\u5b8c\u6210,\u51c6\u5907\u6536\u5f55\u7b54\u6848。', 'green')
      setTimeout(() => { upLoadWork(index, doms, workIframe) }, 2000)
    } else if (workStatus.indexOf("\u5f85\u505a") != -1 || workStatus.indexOf("\u5f85\u5b8c\u6210") != -1) {
      logger('\u6d4b\u9a8c：' + (index + 1) + ',\u51c6\u5907\u5904\u7406\u6b64\u6d4b\u9a8c...', 'purple')
      setTimeout(() => { doWork(index, doms, workIframe) }, 5000)
    } else if (workStatus.indexOf('\u5f85\u6279\u9605') != -1) {
      _mlist.splice(0, 1)
      _domList.splice(0, 1)
      logger('\u6d4b\u9a8c：' + (index + 1) + ',\u6d4b\u9a8c\u5f85\u6279\u9605,\u8df3\u8fc7', 'red')
      setTimeout(() => { startDoCyWork(index + 1, doms) }, 5000)
    } else {
      _mlist.splice(0, 1)
      _domList.splice(0, 1)
      logger('\u6d4b\u9a8c：' + (index + 1) + ',\u672a\u77e5\u72b6\u6001\u6216\u7528\u6237\u9009\u62e9\u4e0d\u6536\u5f55\u7b54\u6848,\u8df3\u8fc7', 'red')
      setTimeout(() => { startDoCyWork(index + 1, doms) }, 5000)
    }
  })
}



function getElement(parent, selector, timeout = 0) {
  /**
   * Author   cxxjackie
   * From     https:
   */
  return new Promise(resolve => {
    let result = parent.querySelector(selector);
    if (result) return resolve(result);
    let timer;
    const mutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
    if (mutationObserver) {
      const observer = new mutationObserver(mutations => {
        for (let mutation of mutations) {
          for (let addedNode of mutation.addedNodes) {
            if (addedNode instanceof Element) {
              result = addedNode.matches(selector) ? addedNode : addedNode.querySelector(selector);
              if (result) {
                observer.disconnect();
                timer && clearTimeout(timer);
                return resolve(result);
              }
            }
          }
        }
      });
      observer.observe(parent, {
        childList: true,
        subtree: true
      });
      if (timeout > 0) {
        timer = setTimeout(() => {
          observer.disconnect();
          return resolve(null);
        }, timeout);
      }
    } else {
      const listener = e => {
        if (e.target instanceof Element) {
          result = e.target.matches(selector) ? e.target : e.target.querySelector(selector);
          if (result) {
            parent.removeEventListener('DOMNodeInserted', listener, true);
            timer && clearTimeout(timer);
            return resolve(result);
          }
        }
      };
      parent.addEventListener('DOMNodeInserted', listener, true);
      if (timeout > 0) {
        timer = setTimeout(() => {
          parent.removeEventListener('DOMNodeInserted', listener, true);
          return resolve(null);
        }, timeout);
      }
    }
  });
}

function missonHomeWork() {
  logger('\u5f00\u59cb\u5904\u7406\u4f5c\u4e1a', 'green')
  let $_homeworktable = $('.mark_table').find('form')
  let TimuList = $_homeworktable.find('.questionLi')


  window._homeworkTimuList = TimuList
  window._homeworkTable = $_homeworktable


  if (typeof saveWork === 'function' && !window._originalSaveWork) {
    window._originalSaveWork = saveWork
  }

  doHomeWork(0, TimuList)
}

function doHomeWork(index, TiMuList) {
  if (index == TiMuList.length) {
    logger('\u4f5c\u4e1a\u9898\u76ee\u5df2\u5168\u90e8\u5b8c\u6210', 'green')


    if (localStorage.getItem('GPTJsSetting.autoSave') !== 'false') {

      try {
        logger('\u6b63\u5728\u81ea\u52a8\u4fdd\u5b58\u4f5c\u4e1a\u7b54\u6848...', 'blue')


        if (safeExecutePageFunction('saveWork')) {
          logger('\u7b54\u6848\u4fdd\u5b58\u6210\u529f！', 'green')
        } else {

          const saveBtn = $('.btnGray_1:visible') || $('button:contains("\u4fdd\u5b58"):visible') || $('.saveBtn:visible');
          if (saveBtn && saveBtn.length > 0) {
            saveBtn.click();
            logger('\u5df2\u70b9\u51fb\u4fdd\u5b58\u6309\u94ae', 'green')
          } else {

            const form = $('.mark_table').find('form');
            if (form && form.length > 0) {
              logger('\u5c1d\u8bd5\u901a\u8fc7\u8868\u5355\u63d0\u4ea4\u4fdd\u5b58\u7b54\u6848...', 'blue');
              form.submit();
              logger('\u8868\u5355\u5df2\u63d0\u4ea4，\u7b54\u6848\u5e94\u5df2\u4fdd\u5b58', 'green');
            } else {
              logger('\u672a\u627e\u5230\u4fdd\u5b58\u6309\u94ae\u6216\u8868\u5355，\u8bf7\u624b\u52a8\u4fdd\u5b58', 'red')
            }
          }
        }


        if (localStorage.getItem('GPTJsSetting.autoSubmit') === 'true') {
          logger('\u51c6\u5907\u81ea\u52a8\u63d0\u4ea4\u4f5c\u4e1a\u7b54\u6848...', 'green');
          setTimeout(() => {
            try {

              let submitBtn = null;


              const submitSelectors = [

                '#submitBtn:visible',
                '#btnSubmit:visible',
                '#submit:visible',


                '.jb_btn:visible',
                '.jb_btn_92:visible',
                '.fr.fs14:visible',
                '.fs14:contains("\u63d0\u4ea4"):visible',
                '.fr:contains("\u63d0\u4ea4"):visible',


                '.Btn_blue_1:visible',
                'button.bluebtn:visible',
                '.btnBlue:visible',
                '.ZY_sub .btnSubmit:visible',
                '.submiting:visible',
                'button.submitBtn:visible',
                'a.bluebtn:contains("\u63d0\u4ea4"):visible',


                'button:contains("\u63d0\u4ea4"):visible',
                'input[type="submit"]:visible',
                'button.btn-submit:visible',
                'input[value="\u63d0\u4ea4"]:visible',
                '[onclick*="submit"]:visible',
                '.fs14:contains("\u786e\u5b9a"):visible'
              ];


              for (const selector of submitSelectors) {
                const btn = $(selector);
                if (btn && btn.length > 0) {
                  submitBtn = btn;
                  logger(`\u627e\u5230\u63d0\u4ea4\u6309\u94ae(${selector})`, 'green');


                  if (btn.hasClass('jb_btn')) {
                    logger('\u4f18\u5148\u4f7f\u7528jb_btn\u7c7b\u63d0\u4ea4\u6309\u94ae', 'blue');
                    break;
                  }


                  if (btn.text().includes('\u63d0\u4ea4')) {
                    logger('\u4f18\u5148\u4f7f\u7528\u5305\u542b"\u63d0\u4ea4"\u6587\u672c\u7684\u6309\u94ae', 'blue');
                    break;
                  }


                }
              }


              if (submitBtn && submitBtn.length > 0) {
                logger('\u627e\u5230\u63d0\u4ea4\u6309\u94ae，\u70b9\u51fb\u63d0\u4ea4...', 'green');


                if (submitBtn.hasClass('jb_btn') || submitBtn.hasClass('fr') || submitBtn.hasClass('fs14')) {
                  logger('\u68c0\u6d4b\u5230\u7279\u6b8a\u63d0\u4ea4\u6309\u94ae，\u4f7f\u7528\u591a\u79cd\u65b9\u5f0f\u70b9\u51fb', 'blue');
                  try {

                    submitBtn[0].click();

                    submitBtn.trigger('click');

                    const event = document.createEvent('MouseEvents');
                    event.initEvent('click', true, true);
                    submitBtn[0].dispatchEvent(event);
                  } catch (e) {
                    logger(`\u7279\u6b8a\u5904\u7406\u70b9\u51fb\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5e38\u89c4\u70b9\u51fb`, 'orange');
                    submitBtn.click();
                  }
                } else {

                  submitBtn.click();
                }


                setTimeout(() => {

                  const confirmSelectors = [

                    '#popok:visible',
                    '#btnConfirm:visible',
                    '#confirmBtn:visible',
                    '#confirm:visible',


                    '.jb_btn:contains("\u63d0\u4ea4"):visible',
                    '.jb_btn:contains("\u786e\u5b9a"):visible',
                    '.jb_btn_92:visible',


                    '.bluebtn:visible',
                    '#confirmSubWin .bluebtn:visible',
                    '.btnBlue:visible',
                    '.layui-layer-btn0:visible',
                    '.layui-layer-btn a:eq(0):visible',


                    'button:contains("\u786e\u5b9a"):visible',
                    'a:contains("\u786e\u5b9a"):visible',
                    'input[value="\u786e\u5b9a"]:visible',
                    'a:contains("\u63d0\u4ea4"):visible',
                    'button:contains("\u63d0\u4ea4"):visible'
                  ];


                  let confirmBtn = null;
                  for (const selector of confirmSelectors) {
                    const btn = $(selector);
                    if (btn && btn.length > 0) {
                      confirmBtn = btn;
                      logger(`\u627e\u5230\u786e\u8ba4\u6309\u94ae(${selector})`, 'green');


                      if (btn.attr('id') === 'popok') {
                        logger('\u4f18\u5148\u4f7f\u7528#popok\u786e\u8ba4\u6309\u94ae', 'blue');
                        break;
                      }


                      if (btn.hasClass('jb_btn')) {
                        logger('\u4f18\u5148\u4f7f\u7528jb_btn\u7c7b\u786e\u8ba4\u6309\u94ae', 'blue');
                        break;
                      }


                    }
                  }

                  if (confirmBtn && confirmBtn.length > 0) {
                    logger('\u70b9\u51fb\u786e\u8ba4\u63d0\u4ea4...', 'green');


                    if (confirmBtn.attr('id') === 'popok') {
                      logger('\u68c0\u6d4b\u5230popok\u786e\u8ba4\u6309\u94ae，\u4f7f\u7528\u7279\u6b8a\u5904\u7406', 'blue');
                      try {

                        confirmBtn[0].click();

                        confirmBtn.trigger('click');

                        const event = document.createEvent('MouseEvents');
                        event.initEvent('click', true, true);
                        confirmBtn[0].dispatchEvent(event);
                      } catch (e) {
                        logger(`\u7279\u6b8a\u5904\u7406\u70b9\u51fb\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5e38\u89c4\u70b9\u51fb`, 'orange');
                        confirmBtn.click();
                      }
                    } else {

                      confirmBtn.click();
                    }

                    logger('\u4f5c\u4e1a\u5df2\u81ea\u52a8\u63d0\u4ea4！', 'green');
                  } else {

                    logger('\u672a\u68c0\u6d4b\u5230\u786e\u8ba4\u5bf9\u8bdd\u6846，\u63d0\u4ea4\u53ef\u80fd\u5df2\u5b8c\u6210', 'blue');
                  }
                }, 1000);
              } else {
                logger('\u672a\u627e\u5230\u63d0\u4ea4\u6309\u94ae，\u8bf7\u624b\u52a8\u63d0\u4ea4', 'red');


                const allButtons = $('button, input[type="submit"], .btn, a.btn, .Btn_blue_1, .bluebtn').filter(':visible');
                if (allButtons && allButtons.length > 0) {
                  logger(`\u9875\u9762\u4e0a\u6709 ${allButtons.length} \u4e2a\u53ef\u89c1\u6309\u94ae，\u4f46\u672a\u627e\u5230\u5339\u914d\u7684\u63d0\u4ea4\u6309\u94ae`, 'orange');
                }
              }
            } catch (e) {
              logger(`\u81ea\u52a8\u63d0\u4ea4\u5931\u8d25: ${e.message}，\u8bf7\u624b\u52a8\u63d0\u4ea4`, 'red');
            }
          }, 2000);
        }
      } catch (e) {
        logger('\u81ea\u52a8\u4fdd\u5b58\u5931\u8d25: ' + e.message + '，\u8bf7\u624b\u52a8\u4fdd\u5b58', 'red')
      }
    } else {
      logger('\u81ea\u52a8\u4fdd\u5b58\u5df2\u7981\u7528，\u8bf7\u624b\u52a8\u4fdd\u5b58\u7b54\u6848', 'blue')


      if (localStorage.getItem('GPTJsSetting.autoSubmit') === 'true') {
        logger('\u51c6\u5907\u81ea\u52a8\u63d0\u4ea4\u4f5c\u4e1a\u7b54\u6848...', 'green');
        setTimeout(() => {
          try {

            let submitBtn = null;


            const submitSelectors = [
              '.Btn_blue_1:visible',
              'button.bluebtn:visible',
              'button:contains("\u63d0\u4ea4"):visible',
              'input[type="submit"]:visible',
              'button.btn-submit:visible',
              '.btnBlue:visible',
              '.ZY_sub .btnSubmit:visible',
              '.submiting:visible',
              'button.submitBtn:visible',
              'a.bluebtn:contains("\u63d0\u4ea4"):visible',
              'input[value="\u63d0\u4ea4"]:visible',
              '[onclick*="submit"]:visible',
              '.jb_btn:visible',
              '.jb_btn_92:visible',
              '.fr.fs14:visible',
              '.fs14:contains("\u63d0\u4ea4"):visible',
              '.fs14:contains("\u786e\u5b9a"):visible',
              '.fr:contains("\u63d0\u4ea4"):visible'
            ];


            for (const selector of submitSelectors) {
              const btn = $(selector);
              if (btn && btn.length > 0) {
                submitBtn = btn;
                logger(`\u627e\u5230\u63d0\u4ea4\u6309\u94ae(${selector})`, 'green');


                if (btn.hasClass('jb_btn')) {
                  logger('\u4f18\u5148\u4f7f\u7528jb_btn\u7c7b\u63d0\u4ea4\u6309\u94ae', 'blue');
                  break;
                }


                if (btn.text().includes('\u63d0\u4ea4')) {
                  logger('\u4f18\u5148\u4f7f\u7528\u5305\u542b"\u63d0\u4ea4"\u6587\u672c\u7684\u6309\u94ae', 'blue');
                  break;
                }


              }
            }


            if (submitBtn && submitBtn.length > 0) {
              logger('\u627e\u5230\u63d0\u4ea4\u6309\u94ae，\u70b9\u51fb\u63d0\u4ea4...', 'green');


              if (submitBtn.hasClass('jb_btn') || submitBtn.hasClass('fr') || submitBtn.hasClass('fs14')) {
                logger('\u68c0\u6d4b\u5230\u7279\u6b8a\u63d0\u4ea4\u6309\u94ae，\u4f7f\u7528\u591a\u79cd\u65b9\u5f0f\u70b9\u51fb', 'blue');
                try {

                  submitBtn[0].click();

                  submitBtn.trigger('click');

                  const event = document.createEvent('MouseEvents');
                  event.initEvent('click', true, true);
                  submitBtn[0].dispatchEvent(event);
                } catch (e) {
                  logger(`\u7279\u6b8a\u5904\u7406\u70b9\u51fb\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5e38\u89c4\u70b9\u51fb`, 'orange');
                  submitBtn.click();
                }
              } else {

                submitBtn.click();
              }


              setTimeout(() => {

                const confirmSelectors = [
                  '.bluebtn:visible',
                  '.layui-layer-btn0:visible',
                  'button:contains("\u786e\u5b9a"):visible',
                  'a:contains("\u786e\u5b9a"):visible',
                  '#confirmSubWin .bluebtn:visible',
                  '.btnBlue:visible',
                  'input[value="\u786e\u5b9a"]:visible',
                  '.layui-layer-btn a:eq(0):visible',
                  '#popok:visible',
                  '.jb_btn:contains("\u63d0\u4ea4"):visible',
                  '.jb_btn:contains("\u786e\u5b9a"):visible'
                ];


                let confirmBtn = null;
                for (const selector of confirmSelectors) {
                  const btn = $(selector);
                  if (btn && btn.length > 0) {
                    confirmBtn = btn;
                    logger(`\u627e\u5230\u786e\u8ba4\u6309\u94ae(${selector})`, 'green');


                    if (btn.attr('id') === 'popok') {
                      logger('\u4f18\u5148\u4f7f\u7528#popok\u786e\u8ba4\u6309\u94ae', 'blue');
                      break;
                    }


                    if (btn.hasClass('jb_btn')) {
                      logger('\u4f18\u5148\u4f7f\u7528jb_btn\u7c7b\u786e\u8ba4\u6309\u94ae', 'blue');
                      break;
                    }


                  }
                }

                if (confirmBtn && confirmBtn.length > 0) {
                  logger('\u70b9\u51fb\u786e\u8ba4\u63d0\u4ea4...', 'green');


                  if (confirmBtn.attr('id') === 'popok') {
                    logger('\u68c0\u6d4b\u5230popok\u786e\u8ba4\u6309\u94ae，\u4f7f\u7528\u7279\u6b8a\u5904\u7406', 'blue');
                    try {

                      confirmBtn[0].click();

                      confirmBtn.trigger('click');

                      const event = document.createEvent('MouseEvents');
                      event.initEvent('click', true, true);
                      confirmBtn[0].dispatchEvent(event);
                    } catch (e) {
                      logger(`\u7279\u6b8a\u5904\u7406\u70b9\u51fb\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5e38\u89c4\u70b9\u51fb`, 'orange');
                      confirmBtn.click();
                    }
                  } else {

                    confirmBtn.click();
                  }

                  logger('\u4f5c\u4e1a\u5df2\u81ea\u52a8\u63d0\u4ea4！', 'green');
                } else {

                  logger('\u672a\u68c0\u6d4b\u5230\u786e\u8ba4\u5bf9\u8bdd\u6846，\u63d0\u4ea4\u53ef\u80fd\u5df2\u5b8c\u6210', 'blue');
                }
              }, 1000);
            } else {
              logger('\u672a\u627e\u5230\u63d0\u4ea4\u6309\u94ae，\u8bf7\u624b\u52a8\u63d0\u4ea4', 'red');


              const allButtons = $('button, input[type="submit"], .btn, a.btn, .Btn_blue_1, .bluebtn').filter(':visible');
              if (allButtons && allButtons.length > 0) {
                logger(`\u9875\u9762\u4e0a\u6709 ${allButtons.length} \u4e2a\u53ef\u89c1\u6309\u94ae，\u4f46\u672a\u627e\u5230\u5339\u914d\u7684\u63d0\u4ea4\u6309\u94ae`, 'orange');
              }
            }
          } catch (e) {
            logger(`\u81ea\u52a8\u63d0\u4ea4\u5931\u8d25: ${e.message}，\u8bf7\u624b\u52a8\u63d0\u4ea4`, 'red');
          }
        }, 2000);
      }
    }
    return
  }
  let _type = ({ \u5355\u9009\u9898: 0, \u591a\u9009\u9898: 1, \u586b\u7a7a\u9898: 2, \u5224\u65ad\u9898: 3, \u7b80\u7b54\u9898: 4, \u5199\u4f5c\u9898: 5, \u7ffb\u8bd1\u9898: 6 })[$(TiMuList[index]).attr('typename')]
  let _questionFull = $(TiMuList[index]).find('.mark_name').html()


  let _question = formatQuestionText(_questionFull)


  _question = _question.replace(/^\s*[\(（【\[]?\s*(\u5355\u9009\u9898|\u591a\u9009\u9898|\u5224\u65ad\u9898|\u586b\u7a7a\u9898|\u7b80\u7b54\u9898|\u8bba\u8ff0\u9898|\u5206\u6790\u9898)[\s\.\:：,，]*[\d\.]*\u5206?[\)）\]\】]?\s*/i, '')


  _question = _question.replace(/^\s*\d+[\.\、\:：]\s*/, '')


  _question = _question.trim()
  let _a = []
  let _answerTmpArr, _textareaList
  var check_answer_flag = 0;
  switch (_type) {
    case 0:
      _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')


      var mergedAnswers = [];
      _answerTmpArr.each(function () {
        var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
        mergedAnswers.push(answerText);
      });
      mergedAnswers = mergedAnswers.join("|");
      _question = "\u5355\u9009\u9898:" + _question + '\n' + mergedAnswers

      for (var i = 0; i < _answerTmpArr.length; i++) {
        if ($(_answerTmpArr[i]).parent().find('span').attr('class').indexOf('check_answer') == -1) {

        } else {
          logger(index + 1 + '\u6b64\u9898\u5df2\u4f5c\u7b54，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          check_answer_flag = 1;
          setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 300)
          break
        }
      }
      if (check_answer_flag == 0) {
        getAnswer(_type, _question).then((agrs) => {
          $.each(_answerTmpArr, (i, t) => {
            _a.push(cleanTextContent($(t).html()))
          })
          let _i = _a.findIndex((item) => item == agrs)

          if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {

            let timuele = $(TiMuList[index]).find('.mark_name')

            timuele.html(timuele.html() + "<p></p>" + agrs)
          }
          if (_i == -1) {
            logger('AI\u65e0\u6cd5\u5b8c\u7f8e\u5339\u914d\u6b63\u786e\u7b54\u6848,\u8bf7\u624b\u52a8\u9009\u62e9，\u8df3\u8fc7\u6b64\u9898', 'red')
            setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
          } else {
            setTimeout(() => {
              let check = $(_answerTmpArr[_i]).parent().find('span').attr('class')
              if (check.indexOf('check_answer') == -1) {
                $(_answerTmpArr[_i]).parent().click()
              }
              logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
              setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
            }, 300)
          }
        }).catch((agrs) => {
          if (agrs['c'] == 0) {
            setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
          }
        })
      }
      break

    case 1:
      _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')

      var mergedAnswers = [];
      _answerTmpArr.each(function () {
        var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
        mergedAnswers.push(answerText);
      });
      mergedAnswers = mergedAnswers.join("|");
      _question = "\u591a\u9009\u9898:" + _question + '\n' + mergedAnswers

      for (var i = 0; i < _answerTmpArr.length; i++) {
        if ($(_answerTmpArr[i]).parent().find('span').attr('class').indexOf('check_answer') == -1) {

        } else {
          logger(index + 1 + '\u6b64\u9898\u5df2\u4f5c\u7b54，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          check_answer_flag = 1;
          setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 300)
          break
        }
      }
      if (check_answer_flag == 0) {
        getAnswer(_type, _question).then((agrs) => {
          if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {

            let timuele = $(TiMuList[index]).find('.mark_name')

            timuele.html(timuele.html() + "<p></p>" + agrs)
          }
          $.each(_answerTmpArr, (i, t) => {
            if (agrs.indexOf(cleanTextContent($(t).html())) != -1) {
              setTimeout(() => {
                let check = $(_answerTmpArr[i]).parent().find('span').attr('class')
                if (check.indexOf('check_answer_dx') == -1) {
                  $(_answerTmpArr[i]).parent().click()
                }
              }, 300)
            }
          })
          logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
        }).catch((agrs) => {
          if (agrs['c'] == 0) {
            setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
          }
        })
      }
      break
    case 2:
      _question = "\u586b\u7a7a\u9898,\u7528\"|\"\u5206\u5272\u591a\u4e2a\u7b54\u6848:" + _question;
      _textareaList = $(TiMuList[index]).find('.stem_answer').find('.Answer .divText .textDIV textarea');

      let _id = $(_textareaList).attr('id');
      if (UE.getEditor(_id).getContent() !== '') {
        logger(index + 1 + '\u6b64\u9898\u5df2\u4f5c\u7b54，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green');
        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 300);
      } else {
        getAnswer(_type, _question).then((agrs) => {
          $.each(_textareaList, (i, t) => {
            let _currentId = $(t).attr('id');
            if (UE.getEditor(_currentId).getContent() === '') {
              let _answerTmpArr = agrs.split('|');
              setTimeout(() => { UE.getEditor(_currentId).setContent(_answerTmpArr[i]) }, 300);
            }
          });
          setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
          logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green');
        });
      }
      break;

    case 3:
      let _true = '\u6b63\u786e|\u662f|\u5bf9|√|T|ri'
      let _false = '\u9519\u8bef|\u5426|\u9519|×|F|wr'
      let _i = 0
      _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')
      _question = "\u5224\u65ad\u9898(\u53ea\u56de\u7b54\u6b63\u786e\u6216\u9519\u8bef):" + _question + '\n' + _answerTmpArr.text()
      $.each(_answerTmpArr, (i, t) => {
        _a.push($(t).text().trim())
      })

      for (var i = 0; i < _answerTmpArr.length; i++) {
        if ($(_answerTmpArr[i]).parent().find('span').attr('class').indexOf('check_answer') == -1) {

        } else {
          logger(index + 1 + '\u6b64\u9898\u5df2\u4f5c\u7b54，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          check_answer_flag = 1;
          setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 300)
          break
        }
      }
      if (check_answer_flag == 0) {
        getAnswer(_type, _question).then((agrs) => {
          if (_true.indexOf(agrs) != -1) {
            _i = _a.findIndex((item) => _true.indexOf(item) != -1)
          } else if (_false.indexOf(agrs) != -1) {
            _i = _a.findIndex((item) => _false.indexOf(item) != -1)
          } else {
            logger('\u7b54\u6848\u5339\u914d\u51fa\u9519，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
            setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
            return
          }
          setTimeout(() => {
            let check = $(_answerTmpArr[_i]).parent().find('span').attr('class')
            if (check.indexOf('check_answer') == -1) {
              $(_answerTmpArr[_i]).parent().click()
            }
          }, 300)
          logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
        }).catch((agrs) => {
          if (agrs['c'] == 0) {
            setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
          }
        })
      }
      break
    case 4:

      _textareaList = $(TiMuList[index]).find('.stem_answer').find('.eidtDiv textarea');

      $.each(_textareaList, (i, t) => {
        let _id = $(t).attr('id');

        const editor = UE.getEditor(_id);
        if (editor) {

          const currentContent = editor.getContent();
          if (currentContent && currentContent !== '') {
            logger(index + 1 + '\u9898\u76ee\u5df2\u6709\u5185\u5bb9，\u5c06\u6e05\u7a7a\u5e76\u91cd\u65b0\u586b\u5199', 'orange');
            editor.setContent('');
          }
        }


        getAnswer(_type, _question).then((agrs) => {
          setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
          logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green');
          setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
        }).catch((agrs) => {
          if (agrs['c'] == 0) {
            setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
          }
        });
      });
      break;
    case 5:
      _answerEle = $_ansdom.find('.subEditor textarea')
      jdt = "\u7528\u82f1\u6587\u6839\u636e\u9898\u76ee\u8fdb\u884c\u5199\u4f5c:" + _question
      $.each(_answerEle, (i, t) => {
        getAnswer(_qType, jdt).then((agrs) => {
          let _id = $(t).attr('name')
          setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
        });
      });
      break
    case 6:
      _answerEle = $_ansdom.find('.subEditor textarea')
      jdt = "\u4e2d\u6587\u82f1\u6587\u7ffb\u8bd1\u9898:" + _question
      $.each(_answerEle, (i, t) => {
        getAnswer(_qType, jdt).then((agrs) => {
          let _id = $(t).attr('name')
          setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
        });
      });
      break
    default:
      _answerEle = $_ansdom.find('.subEditor textarea')
      if (_answerEle !== null) {
        jdt = $(TiMuList[index]).attr('typename') + ':' + _question
        $.each(_answerEle, (i, t) => {
          getAnswer(_qType, jdt).then((agrs) => {
            let _id = $(t).attr('name')
            setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
          });
        });
      } else {
        logger('\u6682\u4e0d\u652f\u6301\u5904\u7406\u6b64\u9898\u578b：' + $(TiMuList[index]).attr('typename') + ',\u8df3\u8fc7。', 'red')
        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
      }
  }
}

function missonExam() {
  logger('\u5f00\u59cb\u5904\u7406\u8003\u8bd5', 'green')
  logger('\u7b49\u5f85\u6d4b\u9a8c\u6846\u67b6\u52a0\u8f7d...', 'blue')


  if ($('.mark_table').length === 0 || $('.mark_table').find('.whiteDiv').length === 0) {

    logger('\u6d4b\u9a8c\u9875\u9762\u5143\u7d20\u5c1a\u672a\u52a0\u8f7d\u5b8c\u6210，\u7b49\u5f85\u91cd\u8bd5...', 'orange')
    setTimeout(missonExam, 1000)
    return
  }

  let $_examtable = $('.mark_table').find('.whiteDiv')
  let _questionFull = cleanTextContent($_examtable.find('h3.mark_name').html().trim())


  let $_ansdom = $_examtable.find('#submitTest').find('.stem_answer')
  let isAnswered = false



  let $selectedRadios = $_ansdom.find('input[type="radio"]:checked, input[type="checkbox"]:checked')
  let $selectedSpans = $_ansdom.find('.clearfix.answerBg span.check_answer_dx, .clearfix.answerBg span.check_answer, .clearfix.answerBg span[class*="check"], .clearfix.answerBg .chosen, .clearfix.answerBg .selected')

  if ($selectedRadios.length > 0 || $selectedSpans.length > 0) {
    isAnswered = true
    logger('\u68c0\u6d4b\u5230\u6b64\u9898\u5df2\u4f5c\u7b54，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
  }


  if (!isAnswered) {
    let $textInputs = $_ansdom.find('input[type="text"], textarea')
    $textInputs.each(function () {
      if ($(this).val() && $(this).val().trim() !== '') {
        isAnswered = true
        return false
      }
    })
    if (isAnswered) {
      logger('\u68c0\u6d4b\u5230\u6b64\u9898\u5df2\u586b\u5199\u7b54\u6848，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
    }
  }


  if (isAnswered && localStorage.getItem('GPTJsSetting.examTurn') === 'true') {
    toNextExam()
    return
  }


  let _qType = undefined
  let typeText = ''



  let spanMatch = _questionFull.match(/[(（](.*?)[,，].*?\u5206[)）]/);
  if (spanMatch && spanMatch[1]) {
    typeText = spanMatch[1].trim()
    logger(`\u4ecespan\u6807\u7b7e\u63d0\u53d6\u5230\u9898\u578b: ${typeText}`, 'blue')
  }


  if (!typeText) {
    let typeNameInput = $_examtable.find('input[name*="typeName"]')
    if (typeNameInput.length > 0) {
      typeText = typeNameInput.val()
      logger(`\u4ece\u9690\u85cfinput\u63d0\u53d6\u5230\u9898\u578b: ${typeText}`, 'blue')
    }
  }


  if (!typeText) {
    let oldMatch = _questionFull.match(/[(](.*?),.*?\u5206[)]|$/)
    if (oldMatch && oldMatch[1]) {
      typeText = oldMatch[1].trim()
      logger(`\u4f7f\u7528\u539f\u6709\u6b63\u5219\u63d0\u53d6\u5230\u9898\u578b: ${typeText}`, 'blue')
    }
  }


  const typeMapping = {
    \u5355\u9009\u9898: 0, \u591a\u9009\u9898: 1, \u586b\u7a7a\u9898: 2, \u5224\u65ad\u9898: 3, \u7b80\u7b54\u9898: 4,
    \u8bba\u8ff0\u9898: 4, \u5199\u4f5c\u9898: 5, \u7ffb\u8bd1\u9898: 6
  }

  _qType = typeMapping[typeText]


  if (_qType === undefined) {
    logger(`\u65e0\u6cd5\u8bc6\u522b\u9898\u578b，\u539f\u59cbHTML: ${_questionFull}`, 'red')
    logger(`\u63d0\u53d6\u7684\u9898\u578b\u6587\u672c: ${typeText}`, 'red')
    logger(`\u4f20\u9012\u7ed9AI\u7684\u9898\u578b: \u672a\u77e5\u9898\u578b`, 'red')
    _qType = 0
  } else {
    logger(`\u4f20\u9012\u7ed9AI\u7684\u9898\u578b: ${typeText}`, 'green')
  }

  let _question = formatQuestionText(_questionFull.replace(/[(（].*?\u5206[)）]/, '').replace(/^\s*/, ''))

  let _answerTmpArr;
  let _a = []
  switch (_qType) {
    case 0:
      _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p')

      var mergedAnswers = [];
      _answerTmpArr.each(function () {
        var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
        mergedAnswers.push(answerText);
      });
      mergedAnswers = mergedAnswers.join("|");
      _question = "\u5355\u9009\u9898:" + _question + '\n' + mergedAnswers
      _question = formatQuestionText(_question.replace(/[(].*?\u5206[)]/, '').replace(/^\s*/, ''))
      logger(`\u4f20\u9012\u7ed9AI\u7684\u9898\u578b: \u5355\u9009\u9898`, 'green')

      getAnswer(_qType, _question).then((agrs) => {
        $.each(_answerTmpArr, (i, t) => {
          _a.push(cleanTextContent($(t).html()))
        })
        if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {

          let timuele = $_examtable.find('h3.mark_name')

          timuele.html(timuele.html() + agrs)
        }

        let _i = _a.findIndex((item) => item == agrs)
        if (_i == -1) {
          logger('AI\u65e0\u6cd5\u5b8c\u7f8e\u5339\u914d\u6b63\u786e\u7b54\u6848,\u8bf7\u624b\u52a8\u9009\u62e9，\u8df3\u8fc7\u6b64\u9898', 'red')
          setTimeout(toNextExam, 5000)
        } else {
          setTimeout(() => {

            let $optionParent = $(_answerTmpArr[_i]).parent()
            let $optionSpan = $optionParent.find('span')
            let $optionRadio = $optionParent.find('input[type="radio"]')
            let isOptionSelected = $optionSpan.hasClass('check_answer') ||
              $optionSpan.hasClass('check_answer_dx') ||
              $optionSpan.attr('class').indexOf('check') !== -1 ||
              $optionRadio.is(':checked')

            if (!isOptionSelected) {

              if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                $optionSpan.css('font-weight', 'bold');
              } else {
                setTimeout(() => { $(_answerTmpArr[_i]).parent().click() }, 300)
              }
              logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
              toNextExam()
            } else {
              logger('\u6b64\u9898\u5df2\u4f5c\u7b54，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
              toNextExam()
            }
          }, 300)
        }
      }).catch((agrs) => {
        if (agrs['c'] == 0) {
          toNextExam()
        }
      })
      break
    case 1:
      _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p')

      var mergedAnswers = [];
      _answerTmpArr.each(function () {
        var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
        mergedAnswers.push(answerText);
      });
      mergedAnswers = mergedAnswers.join("|");
      _question = "\u591a\u9009\u9898:" + _question + '\n' + mergedAnswers
      logger(`\u4f20\u9012\u7ed9AI\u7684\u9898\u578b: \u591a\u9009\u9898`, 'green')
      getAnswer(_qType, _question).then((agrs) => {
        if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {

          let timuele = $_examtable.find('h3.mark_name')

          timuele.html(timuele.html() + agrs)
        }


        let $selectedMultiRadios = $_ansdom.find('input[type="radio"]:checked, input[type="checkbox"]:checked')
        let $selectedMultiSpans = $_ansdom.find('.clearfix.answerBg span.check_answer_dx, .clearfix.answerBg span.check_answer, .clearfix.answerBg span[class*="check"]')
        if ($selectedMultiRadios.length > 0 || $selectedMultiSpans.length > 0) {
          logger('\u6b64\u9898\u5df2\u4f5c\u7b54，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          toNextExam()
        } else {
          $.each(_answerTmpArr, (i, t) => {
            if (agrs.indexOf(cleanTextContent($(t).html())) != -1) {

              if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold');
              } else {
                setTimeout(() => { $(_answerTmpArr[i]).parent().click() }, 300)
              }
            }
          });
          logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          toNextExam()
        }
      }).catch((agrs) => {
        if (agrs['c'] == 0) {
          toNextExam()
        }
      })
      break
    case 2:
      _question = "\u586b\u7a7a\u9898,\u7528\"|\"\u5206\u5272\u591a\u4e2a\u7b54\u6848:" + _question;
      logger(`\u4f20\u9012\u7ed9AI\u7684\u9898\u578b: \u586b\u7a7a\u9898`, 'green')
      let _textareaList = $_ansdom.find('.Answer .divText .subEditor textarea')

      getAnswer(_qType, _question).then((agrs) => {
        let _answerTmpArr = agrs.split('|')
        $.each(_textareaList, (i, t) => {

          let _id = $(t).attr('id')
          setTimeout(() => { UE.getEditor(_id).setContent(_answerTmpArr[i]) }, 300)
        })
        logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
        toNextExam()
      })
      break
    case 3:
      let _true = '\u6b63\u786e|\u662f|\u5bf9|√|T|ri'
      let _false = '\u9519\u8bef|\u5426|\u9519|×|F|wr'
      let _i = 0
      _question = "\u5224\u65ad\u9898(\u53ea\u56de\u7b54\u6b63\u786e\u6216\u9519\u8bef):" + _question;
      logger(`\u4f20\u9012\u7ed9AI\u7684\u9898\u578b: \u5224\u65ad\u9898`, 'green')
      _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p')
      $.each(_answerTmpArr, (i, t) => {
        _a.push($(t).text().trim())
      })
      getAnswer(_qType, _question).then((agrs) => {
        if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {

          let timuele = $_examtable.find('h3.mark_name')

          timuele.html(timuele.html() + agrs)
        }

        if (_true.indexOf(agrs) != -1) {
          _i = _a.findIndex((item) => _true.indexOf(item) != -1)
        } else if (_false.indexOf(agrs) != -1) {
          _i = _a.findIndex((item) => _false.indexOf(item) != -1)
        } else {
          logger('\u7b54\u6848\u5339\u914d\u51fa\u9519，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          toNextExam()
          return
        }
        if ($(_answerTmpArr[_i]).parent().find('span').attr('class').indexOf('check_answer') == -1) {

          if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
            setTimeout(() => { $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold'); }, 300)
          } else {
            $(_answerTmpArr[_i]).parent().click()
          }
          logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          toNextExam()
        } else {
          logger(index + 1 + '\u6b64\u9898\u5df2\u4f5c\u7b54，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          toNextExam()
        }
      }).catch((agrs) => {
        if (agrs['c'] == 0) {
          toNextExam()
        }
      })
      break
    case 4:
      _answerEle = $_ansdom.find('.subEditor textarea')
      jdt = _question
      logger(`\u4f20\u9012\u7ed9AI\u7684\u9898\u578b: \u7b80\u7b54\u9898`, 'green')
      $.each(_answerEle, (i, t) => {
        getAnswer(_qType, jdt).then((agrs) => {
          let _id = $(t).attr('name')
          setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
          toNextExam()
        });
      });
      break
    case 5:
      _answerEle = $_ansdom.find('.subEditor textarea')
      jdt = "\u7528\u82f1\u6587\u6839\u636e\u9898\u76ee\u8fdb\u884c\u5199\u4f5c:" + _question
      logger(`\u4f20\u9012\u7ed9AI\u7684\u9898\u578b: \u5199\u4f5c\u9898`, 'green')
      $.each(_answerEle, (i, t) => {
        getAnswer(_qType, jdt).then((agrs) => {
          let _id = $(t).attr('name')
          setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
          toNextExam()
        });
      });
      break
    case 6:
      _answerEle = $_ansdom.find('.subEditor textarea')
      jdt = "\u4e2d\u6587\u82f1\u6587\u7ffb\u8bd1\u9898:" + _question
      logger(`\u4f20\u9012\u7ed9AI\u7684\u9898\u578b: \u7ffb\u8bd1\u9898`, 'green')
      $.each(_answerEle, (i, t) => {
        getAnswer(_qType, jdt).then((agrs) => {
          let _id = $(t).attr('name')
          setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
          toNextExam()
        });
      });
      break
    default:
      _answerEle = $_ansdom.find('.Answer .divText .subEditor textarea')
      if (typeof _answerEle !== 'undefined') {
        jdt = _questionFull.match(/[(](.*?),.*?\u5206[)]|$/)[1] + ":" + "\u586b\u7a7a\u9898,\u7528\"|\"\u5206\u5272\u591a\u4e2a\u7b54\u6848:" + _question
        getAnswer(_qType, _question).then((agrs) => {
          let _answerTmpArr = agrs.split('|')
          $.each(_answerEle, (i, t) => {
            let _id = $(t).attr('id')
            setTimeout(() => { UE.getEditor(_id).setContent(_answerTmpArr[i]) }, 300)
          })
          logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          toNextExam()
        })
      }
      else {
        logger('\u6682\u4e0d\u652f\u6301\u5904\u7406\u6b64\u9898\u578b：' + $(TiMuList[index]).attr('typename') + ',\u8df3\u8fc7。', 'red')
        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
      }
  }
}

function toNextExam() {
  if (localStorage.getItem('GPTJsSetting.examTurn') === 'true') {
    let $_examtable = $('.mark_table').find('.whiteDiv')
    let $nextbtn = $_examtable.find('.nextDiv a.jb_btn')
    setTimeout(() => {
      $nextbtn.click()
    }, setting.examTurnTime ? 2000 + (Math.floor(Math.random() * 5 + 1) * 1000) : 2000)
  } else {
    logger('\u7528\u6237\u8bbe\u7f6e\u4e0d\u81ea\u52a8\u8df3\u8f6c\u4e0b\u4e00\u9898，\u8bf7\u624b\u52a8\u70b9\u51fb', 'blue')
  }
}

function uploadExam() {
  logger('\u8003\u8bd5\u7b54\u6848\u6536\u5f55\u529f\u80fd\u5904\u4e8ebate\u9636\u6bb5，\u9047\u5230bug\u8bf7\u53ca\u65f6\u53cd\u9988!!', 'red')
  logger('\u8003\u8bd5\u7b54\u6848\u6536\u5f55\u529f\u80fd\u5904\u4e8ebate\u9636\u6bb5，\u9047\u5230bug\u8bf7\u53ca\u65f6\u53cd\u9988!!', 'red')
  logger('\u5f00\u59cb\u6536\u5f55\u8003\u8bd5\u7b54\u6848', 'green')
  let TimuList = $('.mark_table .mark_item .questionLi')
  let data = []
  $.each(TimuList, (i, t) => {
    let _a = {}
    let _answer
    let _answerTmpArr, _answerList = []
    let TiMuFull = formatQuestionText($(t).find('h3').html())
    let _type = ({ \u5355\u9009\u9898: 0, \u591a\u9009\u9898: 1, \u586b\u7a7a\u9898: 2, \u5224\u65ad\u9898: 3, \u7b80\u7b54\u9898: 4 })[TiMuFull.match(/[(](.*?)[)]|$/)[1].replace(/,.*?\u5206/, '')]
    let _question = TiMuFull.replace(/^[(].*?[)]|$/, '').trim()
    let _rightAns = $(t).find('.mark_answer').find('.colorGreen').text().replace(/\u6b63\u786e\u7b54\u6848[:：]/, '').trim()
    switch (_type) {
      case 0:
        if (_rightAns.length <= 0) {
          _isTrue = $(t).find('.mark_answer').find('.mark_score span').attr('class')
          _isZero = $(t).find('.mark_answer').find('.mark_score .totalScore.fr i').text()
          if (_isTrue == 'marking_dui' || _isZero != '0') {
            _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()
          } else {
            break
          }
        }
        _answerTmpArr = $(t).find('.mark_letter li')
        $.each(_answerTmpArr, (a, b) => {
          _answerList.push(cleanTextContent($(b).html()).replace(/[A-Z].\s*/, ''))
        })
        let _i = ({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 })[_rightAns]
        _answer = _answerList[_i]
        _a['question'] = _question
        _a['type'] = _type
        _a['answer'] = _answer
        data.push(_a)
        break
      case 1:
        _answer = []
        if (_rightAns.length <= 0) {
          _isTrue = $(t).find('.mark_answer').find('.mark_score span').attr('class')
          _isZero = $(t).find('.mark_answer').find('.mark_score .totalScore.fr i').text()
          if (_isTrue == 'marking_dui' || _isTrue == 'marking_bandui' || _isZero != '0') {
            _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()
          } else {
            break
          }
        }
        _answerTmpArr = $(t).find('.mark_letter li')
        $.each(_answerTmpArr, (a, b) => {
          _answerList.push(cleanTextContent($(b).html()).replace(/[A-Z].\s*/, ''))
        })
        $.each(_rightAns.split(''), (c, d) => {
          let _i = ({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 })[d]
          _answer.push(_answerList[_i])
        })
        _a['question'] = _question
        _a['type'] = _type
        _a['answer'] = _answer.join("#")
        data.push(_a)
        break
      case 2:
        _answerTmpArr = []
        let answers = $(t).find('.mark_answer').find('.colorDeep').find('dd')
        if (_rightAns.length <= 0) {
          $.each(answers, (i, t) => {
            _isTrue = $(t).find('span:eq(1)').attr('class')
            if (_isTrue == 'marking_dui') {
              _rightAns = $(t).find('span:eq(0)').html()
              _answerTmpArr.push(_rightAns.replace(/[(][0-9].*?[)]/, '').replace(/\u7b2c.*?\u7a7a:/, '').trim())
            } else {
              return
            }
          })
          _answer = _answerTmpArr.join('#')
        } else {
          _answer = _rightAns.replace(/\s/g, '').replace(/[(][0-9].*?[)]/g, '#').replace(/\u7b2c.*?\u7a7a:/g, '#').replace(/^#*/, '')
        }
        if (_answer.length != 0) {
          _a['question'] = _question
          _a['type'] = _type
          _a['answer'] = _answer
          data.push(_a)
        }
        break
      case 3:
        if (_rightAns.length <= 0) {
          _isTrue = $(t).find('.mark_answer').find('.mark_score span').attr('class')
          _isZero = $(t).find('.mark_answer').find('.mark_score .totalScore.fr i').text()
          if (_isTrue == 'marking_dui' || _isZero != '0') {
            _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()
          } else {
            let _true = '\u6b63\u786e|\u662f|\u5bf9|√|T|ri'
            _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()
            if (_true.indexOf(_rightAns) != -1) {
              _rightAns = '\u9519'
            } else {
              _rightAns = '\u5bf9'
            }
          }
        }
        _a['question'] = _question
        _a['type'] = _type
        _a['answer'] = _rightAns
        data.push(_a)
        break
      case 4:
        if (_rightAns.length <= 0) {
          break
        }
        _a['question'] = _question
        _a['type'] = _type
        _a['answer'] = _rightAns
        data.push(_a)
        break
      default:
        break
    }
  })
  setTimeout(() => { uploadAnswer(data) }, 1500)

}

function refreshCourseList() {
  let _p = parseUrlParams()
  return new Promise((resolve, reject) => {
    $.ajax({
      url: _l.protocol + '//' + _l.host + '/mycourse/studentstudycourselist?courseId=' + _p['courseid'] + '&chapterId=' + _p['knowledgeid'] + '&clazzid=' + _p['clazzid'] + '&mooc2=1',
      type: 'GET',
      dateType: 'html',
      success: function (res) {
        resolve(res)
      }
    })
  })

}

function updateAudio(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt) {
  return new Promise((resolve, reject) => {
    getEnc(classId, userId, jobId, objectId, playingTime, duration, clipTime).then((enc) => {
      if (reportUrlChange) {
        reportUrl = http2https(reportUrl)
      }
      $.ajax({
        url: reportUrl + '/' + dtoken + '?clazzId=' + classId + '&playingTime=' + playingTime + '&duration=' + duration + '&clipTime=' + clipTime + '&objectId=' + objectId + '&otherInfo=' + otherInfo + '&jobid=' + jobId + '&userid=' + userId + '&isdrag=' + isdrag + '&view=pc&enc=' + enc + '&rt=' + Number(_rt) + '&dtype=Audio&_t=' + String(Math.round(new Date())),
        type: 'GET',
        success: function (res) {
          try {
            if (res['isPassed']) {
              if (setting.review && playingTime != duration) {
                resolve(1)
              } else {
                resolve(2)
              }
            } else {
              if (setting.rate == 0 && playingTime == duration) {
                resolve(2)
              } else {
                resolve(1)
              }
            }
          } catch (e) {
            logger('\u53d1\u751f\u9519\u8bef：' + e, 'red')
            resolve(0)
          }
        },
        error: function (xhr) {
          if (xhr.status == 403) {
            logger('\u8d85\u661f\u8fd4\u56de\u9519\u8bef\u4fe1\u606f，\u5c1d\u8bd5\u66f4\u6362\u53c2\u6570，40s\u540e\u5c06\u91cd\u8bd5，\u8bf7\u7b49\u5f85...', 'red')
            resolve(3)
          } else {
            reportUrlChange = 1;
            logger('\u8d85\u661f\u8fd4\u56de\u9519\u8bef\u4fe1\u606f，\u5982\u679c\u6301\u7eed\u51fa\u73b0，\u8bf7\u8054\u7cfb\u4f5c\u8005', 'red')
          }
        }
      })
    })
  })
}

function updateVideo(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt) {
  return new Promise((resolve, reject) => {
    getEnc(classId, userId, jobId, objectId, playingTime, duration, clipTime).then((enc) => {
      if (reportUrlChange) {
        reportUrl = http2https(reportUrl)
      }
      $.ajax({
        url: reportUrl + '/' + dtoken + '?clazzId=' + classId + '&playingTime=' + playingTime + '&duration=' + duration + '&clipTime=' + clipTime + '&objectId=' + objectId + '&otherInfo=' + otherInfo + '&jobid=' + jobId + '&userid=' + userId + '&isdrag=' + isdrag + '&view=pc&enc=' + enc + '&rt=' + Number(_rt) + '&dtype=Video&_t=' + String(Math.round(new Date())),
        type: 'GET',
        success: function (res) {
          try {
            if (res['isPassed']) {
              if (setting.review && playingTime != duration) {
                resolve(1)
              } else {
                resolve(2)
              }
            } else {
              if (setting.rate == 0 && playingTime == duration) {
                resolve(2)
              } else {
                resolve(1)
              }
            }
          } catch (e) {
            logger('\u53d1\u751f\u9519\u8bef：' + e, 'red')
            resolve(0)
          }
        },
        error: function (xhr) {
          if (xhr.status == 403) {
            logger('\u8d85\u661f\u8fd4\u56de\u9519\u8bef\u4fe1\u606f，\u5c1d\u8bd5\u66f4\u6362\u53c2\u6570，40s\u540e\u5c06\u91cd\u8bd5，\u8bf7\u7b49\u5f85...', 'red')
            resolve(3)
          } else {
            reportUrlChange = 1;
            logger('\u8d85\u661f\u8fd4\u56de\u9519\u8bef\u4fe1\u606f，\u5982\u679c\u6301\u7eed\u51fa\u73b0，\u8bf7\u8054\u7cfb\u4f5c\u8005', 'red')
          }
        }
      })
    })
  })
}

function upLoadWork(index, doms, dom) {
  let $CyHtml = $(dom).contents().find('.CeYan')
  let TiMuList = $CyHtml.find('.TiMu')
  let data = []
  for (let i = 0; i < TiMuList.length; i++) {
    let _a = {}
    let questionFull = $(TiMuList[i]).find('.Zy_TItle.clearfix > div.clearfix').html().trim()
    let _question = formatQuestionText(questionFull)
    let _TimuType = ({ \u5355\u9009\u9898: 0, \u591a\u9009\u9898: 1, \u586b\u7a7a\u9898: 2, \u5224\u65ad\u9898: 3, \u7b80\u7b54\u9898: 4 })[questionFull.match(/^【(.*?)】|$/)[1]]
    _a['question'] = _question
    _a['type'] = _TimuType
    let _selfAnswerCheck = $(TiMuList[i]).find('.Py_answer.clearfix > i').attr('class')
    switch (_TimuType) {
      case 0:
        if (_selfAnswerCheck == "fr dui") {
          let _selfAnswer = ({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 })[$(TiMuList[i]).find('.Py_answer.clearfix > span').html().trim().replace(/\u6b63\u786e\u7b54\u6848[:：]/, '').replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()]
          let _answerForm = $(TiMuList[i]).find('.Zy_ulTop li')
          let _answer = $(_answerForm[_selfAnswer]).find('a.fl').html()
          _a['answer'] = cleanTextContent(_answer)
        }
        break
      case 1:
        let _answerArr = $(TiMuList[i]).find('.Py_answer.clearfix > span').html().trim().replace(/\u6b63\u786e\u7b54\u6848[:：]/, '').replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()
        let _answerForm = $(TiMuList[i]).find('.Zy_ulTop li')
        let _answer = []
        if (_selfAnswerCheck == "fr dui" || _selfAnswerCheck == "fr bandui") {
          for (let i = 0; i < _answerArr.length; i++) {
            let _answerIndex = ({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 })[_answerArr[i]]
            _answer.push($(_answerForm[_answerIndex]).find('a.fl').html())
          }
        } else {
          break
        }
        _a['answer'] = cleanTextContent(_answer.join('#'))
        break
      case 2:
        let _TAnswerArr = $(TiMuList[i]).find('.Py_answer.clearfix .clearfix')
        let _TAnswer = []
        for (let i = 0; i < _TAnswerArr.length; i++) {
          let item = _TAnswerArr[i];
          if ($(item).find('i').attr('class') == 'fr dui') {
            _TAnswer.push($(item).find('p').html().replace(/[(][0-9].*?[)]/, '').replace(/\u7b2c.*?\u7a7a:/, '').trim())
          }
        }
        if (_TAnswer.length <= 0) { break }
        _a['answer'] = cleanTextContent(_TAnswer.join('#'))
        break
      case 3:
        if (_selfAnswerCheck == "fr dui") {
          let _answer = $(TiMuList[i]).find('.Py_answer.clearfix > span > i').html().replace(/\u6b63\u786e\u7b54\u6848[:：]/, '').replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()
          _a['answer'] = cleanTextContent(_answer)
        } else {
          if ($(TiMuList[i]).find('.Py_answer.clearfix > span > i').html()) {
            let _answer = $(TiMuList[i]).find('.Py_answer.clearfix > span > i').html().replace(/\u6b63\u786e\u7b54\u6848[:：]/, '').replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()
            _a['answer'] = (cleanTextContent(_answer) == '√' ? 'x' : '√')
          } else {
            break
          }
        }
        break
      case 4:
        break
    }
    if (_a['answer'] != undefined) {
      data.push(_a)
    } else {
      continue
    }
  }
  uploadAnswer(data).then(() => {
    _mlist.splice(0, 1)
    _domList.splice(0, 1)
    setTimeout(() => { startDoCyWork(index + 1, doms) }, 3000)
  })
}


function uploadHomeWork() {
  logger('\u5f00\u59cb\u6536\u5f55\u7b54\u6848', 'green')


  let $_homeworktable = $('.mark_table')
  if ($_homeworktable.length === 0) {

    $_homeworktable = $('.mark_cont')
    if ($_homeworktable.length === 0) {
      logger('\u672a\u627e\u5230\u4f5c\u4e1a\u8868\u683c，\u53ef\u80fd\u662f\u9875\u9762\u7ed3\u6784\u4e0d\u5339\u914d', 'red')
      return
    }
  }


  let TiMuList = $_homeworktable.find('.mark_item').find('.questionLi')
  if (TiMuList.length === 0) {

    TiMuList = $_homeworktable.find('.questionLi')
    if (TiMuList.length === 0) {
      logger('\u672a\u627e\u5230\u9898\u76ee\u5217\u8868，\u53ef\u80fd\u662f\u9875\u9762\u7ed3\u6784\u4e0d\u5339\u914d', 'red')
      return
    }
  }

  logger(`\u627e\u5230 ${TiMuList.length} \u9053\u9898\u76ee`, 'green')
  let data = []
  $.each(TiMuList, (i, t) => {
    let _a = {}
    let _answer
    let _answerTmpArr, _answerList = []


    let titleElem = $(t).find('h3.mark_name')
    if (titleElem.length === 0) {
      titleElem = $(t).find('.mark_name')
      if (titleElem.length === 0) {
        logger(`\u7b2c${i + 1}\u9898\u672a\u627e\u5230\u9898\u76ee\u6807\u9898，\u8df3\u8fc7`, 'orange')
        return
      }
    }

    let TiMuFull = formatQuestionText(titleElem.html())

    let typeMatch = TiMuFull.match(/[(](.*?)[)]|$/)
    let typeText = typeMatch && typeMatch[1] ? typeMatch[1].replace(/, .*?\u5206/, '') : ''
    let TiMuType = ({ \u5355\u9009\u9898: 0, \u591a\u9009\u9898: 1, \u586b\u7a7a\u9898: 2, \u5224\u65ad\u9898: 3, \u7b80\u7b54\u9898: 4 })[typeText] || 4

    let TiMu = TiMuFull.replace(/^[(].*?[)]|$/, '').trim()


    let rightAnsElem = $(t).find('.mark_answer').find('.colorGreen')
    let _rightAns = rightAnsElem.length > 0 ? rightAnsElem.text().replace(/\u6b63\u786e\u7b54\u6848[:：]/, '').trim() : ''

    switch (TiMuType) {
      case 0:
        if (_rightAns.length <= 0) {
          let _isTrue = $(t).find('.mark_answer').find('.mark_score span').attr('class') || ''
          let _isZero = $(t).find('.mark_answer').find('.mark_score .totalScore.fr i').text() || '0'
          if (_isTrue == 'marking_dui' || _isZero != '0') {
            _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()
          } else {
            return
          }
        }
        _answerTmpArr = $(t).find('.mark_letter li')
        $.each(_answerTmpArr, (a, b) => {
          _answerList.push(cleanTextContent($(b).html()).replace(/[A-Z].\s*/, ''))
        })
        let _i = ({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 })[_rightAns]
        if (_i !== undefined && _i < _answerList.length) {
          _answer = _answerList[_i]
          _a['question'] = TiMu
          _a['type'] = TiMuType
          _a['answer'] = _answer
          data.push(_a)
        } else {
          logger(`\u7b2c${i + 1}\u9898\u5355\u9009\u9898\u7b54\u6848\u63d0\u53d6\u5931\u8d25: ${_rightAns}`, 'orange')
        }
        break
      case 1:
        _answer = []
        if (_rightAns.length <= 0) {
          let _isTrue = $(t).find('.mark_answer').find('.mark_score span').attr('class') || ''
          let _isZero = $(t).find('.mark_answer').find('.mark_score .totalScore.fr i').text() || '0'
          if (_isTrue == 'marking_dui' || _isTrue == 'marking_bandui' || _isZero != '0') {
            _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()
          } else {
            break
          }
        }
        _answerTmpArr = $(t).find('.mark_letter li')
        $.each(_answerTmpArr, (a, b) => {
          _answerList.push(cleanTextContent($(b).html()).replace(/[A-Z].\s*/, ''))
        })
        let validLetters = true
        $.each(_rightAns.split(''), (c, d) => {
          let _i = ({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 })[d]
          if (_i !== undefined && _i < _answerList.length) {
            _answer.push(_answerList[_i])
          } else {
            validLetters = false
          }
        })
        if (validLetters && _answer.length > 0) {
          _a['question'] = TiMu
          _a['type'] = TiMuType
          _a['answer'] = _answer.join("#")
          data.push(_a)
        } else {
          logger(`\u7b2c${i + 1}\u9898\u591a\u9009\u9898\u7b54\u6848\u63d0\u53d6\u5931\u8d25: ${_rightAns}`, 'orange')
        }
        break
      case 2:
        _answerTmpArr = []
        let answers = $(t).find('.mark_answer').find('.colorDeep').find('dd')
        if (_rightAns.length <= 0) {
          $.each(answers, (i, t) => {
            let _isTrue = $(t).find('span:eq(1)').attr('class') || ''
            if (_isTrue == 'marking_dui') {
              _rightAns = $(t).find('span:eq(0)').html() || ''
              _answerTmpArr.push(_rightAns.replace(/[(][0-9].*?[)]/, '').replace(/\u7b2c.*?\u7a7a:/, '').trim())
            } else {
              return
            }
          })
          _answer = _answerTmpArr.join('#')
        } else {
          _answer = _rightAns.replace(/\s/g, '').replace(/[(][0-9].*?[)]/g, '#').replace(/\u7b2c.*?\u7a7a:/g, '#').replace(/^#*/, '')
        }
        if (_answer && _answer.length != 0) {
          _a['question'] = TiMu
          _a['type'] = TiMuType
          _a['answer'] = _answer
          data.push(_a)
        } else {
          logger(`\u7b2c${i + 1}\u9898\u586b\u7a7a\u9898\u7b54\u6848\u63d0\u53d6\u5931\u8d25`, 'orange')
        }
        break
      case 3:
        if (_rightAns.length <= 0) {
          let _isTrue = $(t).find('.mark_answer').find('.mark_score span').attr('class') || ''
          let _isZero = $(t).find('.mark_answer').find('.mark_score .totalScore.fr i').text() || '0'
          if (_isTrue == 'marking_dui' || _isZero != '0') {
            _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()
          } else {
            let _true = '\u6b63\u786e|\u662f|\u5bf9|√|T|ri'
            _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()
            if (_true.indexOf(_rightAns) != -1) {
              _rightAns = '\u9519'
            } else {
              _rightAns = '\u5bf9'
            }
          }
        }
        if (_rightAns && _rightAns.length > 0) {
          _a['question'] = TiMu
          _a['type'] = TiMuType
          _a['answer'] = _rightAns
          data.push(_a)
        } else {
          logger(`\u7b2c${i + 1}\u9898\u5224\u65ad\u9898\u7b54\u6848\u63d0\u53d6\u5931\u8d25`, 'orange')
        }
        break
      case 4:
        if (_rightAns.length <= 0) {

          let altAnsElem = $(t).find('.mark_answer').find('.colorDeep')
          if (altAnsElem.length > 0) {
            _rightAns = altAnsElem.text().replace(/\u6211\u7684\u7b54\u6848[:：]/, '').trim()
          }

          if (_rightAns.length <= 0) {
            logger(`\u7b2c${i + 1}\u9898\u7b80\u7b54\u9898\u672a\u627e\u5230\u7b54\u6848，\u8df3\u8fc7`, 'orange')
            break
          }
        }
        _a['question'] = TiMu
        _a['type'] = TiMuType
        _a['answer'] = _rightAns
        data.push(_a)
        break
    }
  })

  if (data.length > 0) {
    logger(`\u6210\u529f\u63d0\u53d6 ${data.length} \u9053\u9898\u76ee\u7b54\u6848，\u51c6\u5907\u4e0a\u4f20`, 'green')
    setTimeout(() => { uploadAnswer(data) }, 1500)
  } else {
    logger('\u672a\u80fd\u63d0\u53d6\u5230\u4efb\u4f55\u9898\u76ee\u7b54\u6848，\u8bf7\u68c0\u67e5\u9875\u9762\u7ed3\u6784\u6216\u624b\u52a8\u6536\u5f55', 'red')
  }
}

function getEnc(a, b, c, d, e, f, g) {






























}


function getAnswer(_t, _q) {

  let cleanedQuestion = _q;


  cleanedQuestion = cleanedQuestion.replace(/^\s*[\(（【\[]?\s*(\u5355\u9009\u9898|\u591a\u9009\u9898|\u5224\u65ad\u9898|\u586b\u7a7a\u9898|\u7b80\u7b54\u9898|\u8bba\u8ff0\u9898|\u5206\u6790\u9898)[\s\.\:：,，]*[\d\.]*\u5206?[\)）\]\】]?\s*/i, '');
  cleanedQuestion = cleanedQuestion.replace(/\(\s*\d+\.\d+\s*\u5206\s*\)/g, '');
  cleanedQuestion = cleanedQuestion.replace(/（\s*\d+\.\d+\s*\u5206\s*）/g, '');

  logger('\u9898\u76ee:' + cleanedQuestion, 'pink');




  return new Promise((resolve, reject) => {

    let processedQuestion = cleanedQuestion;
    let extractedType = _t;


    if (_q.startsWith('\u5355\u9009\u9898:')) {
      extractedType = '0';
      processedQuestion = _q.substring(4);
      logger('\u4ece\u9898\u76ee\u4e2d\u63d0\u53d6\u9898\u578b: \u5355\u9009\u9898', 'blue');
    } else if (_q.startsWith('\u591a\u9009\u9898:')) {
      extractedType = '1';
      processedQuestion = _q.substring(4);
      logger('\u4ece\u9898\u76ee\u4e2d\u63d0\u53d6\u9898\u578b: \u591a\u9009\u9898', 'blue');
    } else if (_q.startsWith('\u5224\u65ad\u9898:')) {
      extractedType = '3';
      processedQuestion = _q.substring(4);
      logger('\u4ece\u9898\u76ee\u4e2d\u63d0\u53d6\u9898\u578b: \u5224\u65ad\u9898', 'blue');
    }


    let userKey = localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || '';


    if (!userKey) {
      logger('\u672a\u914d\u7f6eKey，\u8bf7\u5728\u8bbe\u7f6e\u4e2d\u914d\u7f6e\u60a8\u7684Key', 'red');
      reject('\u8bf7\u5728\u8bbe\u7f6e\u4e2d\u914d\u7f6e\u60a8\u7684Key');
      return;
    }





    if (localStorage.getItem('GPTJsSetting.useTiku') !== 'true') {
      logger('\u9898\u5e93\u7b54\u9898\u529f\u80fd\u5df2\u5173\u95ed，\u8df3\u8fc7\u9898\u5e93\u67e5\u8be2', 'orange');


      logger('\u9898\u5e93\u7b54\u9898\u529f\u80fd\u72b6\u6001：' + (localStorage.getItem('GPTJsSetting.useTiku') === 'true' ? '\u5df2\u5f00\u542f' : '\u672a\u5f00\u542f'), '#1890ff');
      logger('AI\u7b54\u9898\u529f\u80fd\u72b6\u6001：' + (localStorage.getItem('GPTJsSetting.useAI') === 'true' ? '\u5df2\u5f00\u542f' : '\u672a\u5f00\u542f'), '#1890ff');
      logger('\u968f\u673a\u7b54\u9898\u529f\u80fd\u72b6\u6001：' + (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true' ? '\u5df2\u5f00\u542f' : '\u672a\u5f00\u542f'), '#1890ff');
      logger('\u4f7f\u7528\u6a21\u578b：' + (localStorage.getItem('GPTJsSetting.model') || 'Doubao-1.5-lite-32k'), '#1890ff');


      let typeNames = {
        '0': '\u5355\u9009\u9898',
        '1': '\u591a\u9009\u9898',
        '2': '\u586b\u7a7a\u9898',
        '3': '\u5224\u65ad\u9898',
        '4': '\u7b80\u7b54\u9898',
        '5': '\u9009\u62e9\u9898'
      };
      let typeName = typeNames[extractedType] || '\u672a\u77e5\u9898\u578b';
      logger('\u9898\u76ee\u7c7b\u578b: ' + typeName, '#1890ff');


      if (localStorage.getItem('GPTJsSetting.useAI') === 'true') {

        logger('\u5df2\u5f00\u542fAI\u7b54\u9898\u529f\u80fd，\u51c6\u5907\u83b7\u53d6AI\u7b54\u6848...', '#1890ff');
        logger('\u4f20\u9012\u7ed9AI\u7684\u9898\u578b: ' + typeName, '#1890ff');


        let aiAnswerTimeout = setTimeout(() => {
          logger('AI\u7b54\u9898\u7cfb\u7edf\u54cd\u5e94\u8d85\u65f6，\u5207\u6362\u5230\u968f\u673a\u7b54\u9898...', 'red');
          if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {

            logger('\u5c1d\u8bd5\u4f7f\u7528\u968f\u673a\u7b54\u9898\u529f\u80fd\u4f5c\u4e3a\u5907\u9009...', '#1890ff');
            const randomAnswer = getRandomAnswer(typeName);
            logger('\u6210\u529f\u751f\u6210\u968f\u673a\u7b54\u6848: ' + randomAnswer, 'green');
            resolve(randomAnswer);
          } else {

            localStorage.setItem('GPTJsSetting.sub', false);

            resolve('');
          }
        }, 30000);

        getAIAnswer(processedQuestion, typeName)
          .then(aiAnswer => {

            clearTimeout(aiAnswerTimeout);


            logger('AI\u6210\u529f\u56de\u7b54，\u7ee7\u7eed\u5904\u7406...', 'green');
            resolve(aiAnswer);
          })
          .catch(error => {

            clearTimeout(aiAnswerTimeout);


            logger('AI\u56de\u7b54\u5931\u8d25: ' + error, 'red');


            if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {

              logger('\u5c1d\u8bd5\u4f7f\u7528\u968f\u673a\u7b54\u9898\u529f\u80fd\u4f5c\u4e3a\u5907\u9009...', '#1890ff');
              const randomAnswer = getRandomAnswer(typeName);
              logger('\u6210\u529f\u751f\u6210\u968f\u673a\u7b54\u6848: ' + randomAnswer, 'green');
              resolve(randomAnswer);
            } else {

              localStorage.setItem('GPTJsSetting.sub', false);

              resolve('');
            }
          });
        return;
      }


      if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {

        logger('\u5df2\u5f00\u542f\u968f\u673a\u7b54\u9898\u529f\u80fd，\u51c6\u5907\u751f\u6210\u968f\u673a\u7b54\u6848...', '#1890ff');
        const randomAnswer = getRandomAnswer(typeName);
        logger('\u6210\u529f\u751f\u6210\u968f\u673a\u7b54\u6848: ' + randomAnswer, 'green');
        resolve(randomAnswer);
        return;
      }


      logger('\u672a\u5f00\u542fAI\u7b54\u9898\u548c\u968f\u673a\u7b54\u9898\u529f\u80fd，\u7559\u7a7a\u5e76\u7ee7\u7eed\u4e0b\u4e00\u9898...', 'red');


      localStorage.setItem('GPTJsSetting.sub', false);


      resolve('');
      return;
    }


    let options = '';
    try {


      const optionSelectors = [
        '.option-content',
        '.el-radio__label',
        '.el-checkbox__label',
        '.ant-radio-wrapper',
        '.ant-checkbox-wrapper',
        'label.option',
        '.option-item',
        '.answer-item',
        '.subject-item',
        'li.option',
        'div[class*="option"]',
        'span[class*="option"]',
        'input[type="radio"] + label',
        'input[type="checkbox"] + label'
      ];


      const optionsElements = document.querySelectorAll(optionSelectors.join(', '));

      if (optionsElements && optionsElements.length > 0) {
        const optionsArray = [];
        optionsElements.forEach(el => {

          let text = el.textContent.trim();
          text = text.replace(/^[A-Z][\.\、\s]+/i, '').trim();

          if (text && !optionsArray.includes(text)) {
            optionsArray.push(text);
          }
        });


        if (optionsArray.length === 0) {

          const questionMatch = _q.match(/\(([^)]+)\)/);
          if (questionMatch && questionMatch[1]) {

            optionsArray.push(...questionMatch[1].split(/[|,，、]/));
          } else {

            const endOptionsMatch = _q.match(/[A-D][\.、][\s\S]+?[A-D][\.、][\s\S]+/);
            if (endOptionsMatch) {
              optionsArray.push(...endOptionsMatch[0].split(/[A-D][\.、]/));
            }


            const splitOptions = _q.split(/[|,，、]/);
            if (splitOptions.length > 1) {

              const lastPart = splitOptions[splitOptions.length - 1];

              if (lastPart.match(/[A-D]/)) {
                optionsArray.push(...splitOptions);
              }
            }
          }
        }

        options = optionsArray.join('|');
        logger('\u63d0\u53d6\u5230\u9009\u9879: ' + options, 'blue');
      }
    } catch (e) {
      logger('\u63d0\u53d6\u9009\u9879\u5931\u8d25: ' + e, 'red');
    }


    let extractedOptions = '';


    const optionsSeparatorIndex = processedQuestion.lastIndexOf(' ');
    if (optionsSeparatorIndex !== -1) {
      const possibleOptions = processedQuestion.substring(optionsSeparatorIndex + 1);

      if (possibleOptions.includes('|')) {
        processedQuestion = processedQuestion.substring(0, optionsSeparatorIndex);
        extractedOptions = possibleOptions;
        logger('\u4ece\u9898\u76ee\u4e2d\u63d0\u53d6\u9009\u9879: ' + extractedOptions, 'blue');
      }
    }


    if (!extractedOptions) {
      const bracketMatch = processedQuestion.match(/\(\)[\s]*([^()]+)$/);
      if (bracketMatch && bracketMatch[1]) {
        const afterBracket = bracketMatch[1].trim();
        if (afterBracket.includes('|')) {
          extractedOptions = afterBracket;

          processedQuestion = processedQuestion.replace(/\(\)[\s]*[^()]+$/, '()');
          logger('\u4ece\u9898\u76ee\u62ec\u53f7\u540e\u63d0\u53d6\u9009\u9879: ' + extractedOptions, 'blue');
        }
      }
    }




    let typeNames = {
      '0': '\u5355\u9009\u9898',
      '1': '\u591a\u9009\u9898',
      '2': '\u586b\u7a7a\u9898',
      '3': '\u5224\u65ad\u9898',
      '4': '\u7b80\u7b54\u9898',
      '5': '\u9009\u62e9\u9898'
    };

    let typeName = typeNames[extractedType] || '\u672a\u77e5\u9898\u578b';
    logger('\u9898\u76ee\u7c7b\u578b: ' + typeName, 'green');

    if (extractedOptions) {
      logger('\u4f7f\u7528\u9898\u76ee\u4e2d\u63d0\u53d6\u7684\u9009\u9879: ' + extractedOptions, 'green');
    } else if (options) {
      logger('\u4f7f\u7528\u9875\u9762\u5143\u7d20\u63d0\u53d6\u7684\u9009\u9879: ' + options, 'green');
    }


    let requestData = "key=" + encodeURIComponent(userKey) +
      "&question=" + encodeURIComponent(processedQuestion) +
      "&type=" + encodeURIComponent(extractedType);


    if (extractedOptions) {
      requestData += "&options=" + encodeURIComponent(extractedOptions);
    } else if (options) {
      requestData += "&options=" + encodeURIComponent(options);
    }




    GM_xmlhttpRequest({
      method: "POST",
      url: API_BASE_URL + "?act=xxt",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + userKey
      },
      data: requestData,
      timeout: 120000,
      onload: function (response) {
        if (response.status == 200) {
          try {




            if (!response.responseText) {
              logger('\u670d\u52a1\u5668\u54cd\u5e94\u5185\u5bb9\u4e3a\u7a7a', 'red');
              reject('\u670d\u52a1\u5668\u54cd\u5e94\u5185\u5bb9\u4e3a\u7a7a');
              return;
            }

            let res = JSON.parse(response.responseText);




            if (res.msg && res.msg.includes('\u672a\u627e\u5230\u7b54\u6848')) {

              logger('\u9898\u5e93\u8fd4\u56de：' + res.msg + '，\u51c6\u5907\u4f7f\u7528AI\u5c1d\u8bd5\u56de\u7b54...', 'orange');


              logger('\u9898\u5e93\u7b54\u9898\u529f\u80fd\u72b6\u6001：' + (localStorage.getItem('GPTJsSetting.useTiku') === 'true' ? '\u5df2\u5f00\u542f' : '\u672a\u5f00\u542f'), '#1890ff');
              logger('AI\u7b54\u9898\u529f\u80fd\u72b6\u6001：' + (localStorage.getItem('GPTJsSetting.useAI') === 'true' ? '\u5df2\u5f00\u542f' : '\u672a\u5f00\u542f'), '#1890ff');
              logger('\u968f\u673a\u7b54\u9898\u529f\u80fd\u72b6\u6001：' + (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true' ? '\u5df2\u5f00\u542f' : '\u672a\u5f00\u542f'), '#1890ff');
              logger('\u4f7f\u7528\u6a21\u578b：' + (localStorage.getItem('GPTJsSetting.model') || 'Doubao-1.5-lite-32k'), '#1890ff');


              showDesktopNotification('\u9898\u5e93\u65e0\u7b54\u6848', `\u9898\u578b: ${typeName}\n\u9898\u76ee: ${processedQuestion.substring(0, 30)}...`, '');


              if (localStorage.getItem('GPTJsSetting.useAI') === 'true') {

                logger('\u5df2\u5f00\u542fAI\u7b54\u9898\u529f\u80fd，\u51c6\u5907\u83b7\u53d6AI\u7b54\u6848...', '#1890ff');
                getAIAnswer(processedQuestion, typeName)
                  .then(aiAnswer => {

                    logger('AI\u6210\u529f\u56de\u7b54，\u7ee7\u7eed\u5904\u7406...', 'green');
                    resolve(aiAnswer);
                  })
                  .catch(error => {

                    logger('AI\u56de\u7b54\u5931\u8d25: ' + error, 'red');


                    if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {

                      logger('\u5c1d\u8bd5\u4f7f\u7528\u968f\u673a\u7b54\u9898\u529f\u80fd\u4f5c\u4e3a\u5907\u9009...', '#1890ff');
                      const randomAnswer = getRandomAnswer(typeName);
                      logger('\u6210\u529f\u751f\u6210\u968f\u673a\u7b54\u6848: ' + randomAnswer, 'green');
                      resolve(randomAnswer);
                    } else {

                      localStorage.setItem('GPTJsSetting.sub', false);

                      resolve('');
                    }
                  });
                return;
              } else if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {

                logger('\u672a\u5f00\u542fAI\u7b54\u9898\u4f46\u5df2\u5f00\u542f\u968f\u673a\u7b54\u9898，\u51c6\u5907\u751f\u6210\u968f\u673a\u7b54\u6848...', '#1890ff');
                const randomAnswer = getRandomAnswer(typeName);
                logger('\u6210\u529f\u751f\u6210\u968f\u673a\u7b54\u6848: ' + randomAnswer, 'green');
                resolve(randomAnswer);
                return;
              } else {

                logger('\u672a\u5f00\u542fAI\u7b54\u9898\u548c\u968f\u673a\u7b54\u9898\u529f\u80fd，\u7559\u7a7a\u5e76\u7ee7\u7eed\u4e0b\u4e00\u9898...', 'red');

                localStorage.setItem('GPTJsSetting.sub', false);

                resolve('');
                return;
              }
            }


            if (res.code === 0) {
              logger('\u9519\u8bef: ' + res.msg, 'red');

              if (res.msg.includes('Key\u9a8c\u8bc1\u5931\u8d25') || res.msg.includes('\u8bf7\u63d0\u4f9b\u6709\u6548\u7684Key')) {
                logger('\u8bf7\u5728\u8bbe\u7f6e\u4e2d\u914d\u7f6e\u6b63\u786e\u7684Key', 'red');


                showDesktopNotification('Key\u9a8c\u8bc1\u5931\u8d25', '\u8bf7\u68c0\u67e5\u60a8\u7684Key\u662f\u5426\u6b63\u786e，\u5e76\u5728\u8bbe\u7f6e\u4e2d\u91cd\u65b0\u914d\u7f6e', '');


                const notification = document.createElement('div');
                notification.textContent = 'Key\u9a8c\u8bc1\u5931\u8d25，\u8bf7\u68c0\u67e5\u60a8\u7684Key\u662f\u5426\u6b63\u786e';
                notification.style.cssText = `
                  position: fixed;
                  top: 20px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: #F56C6C;
                  color: white;
                  padding: 10px 20px;
                  border-radius: 4px;
                  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
                  z-index: 10000;
                  transition: all 0.3s;
                `;
                document.body.appendChild(notification);
                setTimeout(() => {
                  notification.style.opacity = '0';
                  setTimeout(() => {
                    document.body.removeChild(notification);
                  }, 500);
                }, 3000);
                reject(res.msg);
                return;
              }


              if (res.msg.includes('\u672a\u627e\u5230\u7b54\u6848') || res.msg.includes('\u9898\u76ee\u627e\u5230\u4f46\u7b54\u6848\u65e0\u6548') || res.msg.includes('\u672a\u627e\u5230\u6709\u6548\u7b54\u6848')) {
                logger('\u9898\u5e93\u8fd4\u56de: ' + res.msg + '，\u5c1d\u8bd5\u4f7f\u7528AI\u7b54\u9898...', 'orange');


                logger('AI\u7b54\u9898\u529f\u80fd\u72b6\u6001：' + (localStorage.getItem('GPTJsSetting.useAI') === 'true' ? '\u5df2\u5f00\u542f' : '\u672a\u5f00\u542f'), '#1890ff');
                logger('\u968f\u673a\u7b54\u9898\u529f\u80fd\u72b6\u6001：' + (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true' ? '\u5df2\u5f00\u542f' : '\u672a\u5f00\u542f'), '#1890ff');


                if (localStorage.getItem('GPTJsSetting.useAI') === 'true') {

                  logger('\u5df2\u5f00\u542fAI\u7b54\u9898\u529f\u80fd，\u51c6\u5907\u83b7\u53d6AI\u7b54\u6848...', '#1890ff');
                  getAIAnswer(processedQuestion, typeName)
                    .then(aiAnswer => {

                      logger('AI\u6210\u529f\u56de\u7b54，\u7ee7\u7eed\u5904\u7406...', 'green');
                      resolve(aiAnswer);
                    })
                    .catch(error => {

                      logger('AI\u56de\u7b54\u5931\u8d25: ' + error, 'red');


                      if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {

                        logger('\u5c1d\u8bd5\u4f7f\u7528\u968f\u673a\u7b54\u9898\u529f\u80fd\u4f5c\u4e3a\u5907\u9009...', '#1890ff');
                        const randomAnswer = getRandomAnswer(typeName);
                        logger('\u6210\u529f\u751f\u6210\u968f\u673a\u7b54\u6848: ' + randomAnswer, 'green');
                        resolve(randomAnswer);
                      } else {

                        localStorage.setItem('GPTJsSetting.sub', false);

                        resolve('');
                      }
                    });
                  return;
                } else if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {

                  logger('\u672a\u5f00\u542fAI\u7b54\u9898\u4f46\u5df2\u5f00\u542f\u968f\u673a\u7b54\u9898，\u51c6\u5907\u751f\u6210\u968f\u673a\u7b54\u6848...', '#1890ff');
                  const randomAnswer = getRandomAnswer(typeName);
                  logger('\u6210\u529f\u751f\u6210\u968f\u673a\u7b54\u6848: ' + randomAnswer, 'green');
                  resolve(randomAnswer);
                  return;
                } else {

                  logger('\u672a\u5f00\u542fAI\u7b54\u9898\u548c\u968f\u673a\u7b54\u9898\u529f\u80fd，\u7559\u7a7a\u5e76\u7ee7\u7eed\u4e0b\u4e00\u9898...', 'red');

                  localStorage.setItem('GPTJsSetting.sub', false);

                  resolve('');
                  return;
                }
              }


              reject(res.msg);
              return;
            }


            if ((res.code == 200 || res.code == 1000) && res.data) {

              if (res.data.answer !== undefined) {

                if (res.data.answer === 0 || res.data.answer === "0" || res.data.answer) {
                  logger('\u7b54\u6848:' + res.data.answer, 'pink');
                  resolve(String(res.data.answer));
                  return;
                }
              }


              logger('\u9898\u5e93\u8fd4\u56de\u7b54\u6848\u4e3a\u7a7a\u6216\u65e0\u6548，\u51c6\u5907\u4f7f\u7528AI\u5c1d\u8bd5\u56de\u7b54...', 'orange');


              logger('AI\u7b54\u9898\u529f\u80fd\u72b6\u6001：' + (localStorage.getItem('GPTJsSetting.useAI') === 'true' ? '\u5df2\u5f00\u542f' : '\u672a\u5f00\u542f'), '#1890ff');
              logger('\u968f\u673a\u7b54\u9898\u529f\u80fd\u72b6\u6001：' + (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true' ? '\u5df2\u5f00\u542f' : '\u672a\u5f00\u542f'), '#1890ff');
              logger('\u4f7f\u7528\u6a21\u578b：' + (localStorage.getItem('GPTJsSetting.model') || 'Doubao-1.5-lite-32k'), '#1890ff');


              showDesktopNotification('\u9898\u5e93\u65e0\u7b54\u6848', `\u9898\u578b: ${typeName}\n\u9898\u76ee: ${processedQuestion.substring(0, 30)}...`, '');


              if (localStorage.getItem('GPTJsSetting.useAI') === 'true') {

                logger('\u5df2\u5f00\u542fAI\u7b54\u9898\u529f\u80fd，\u51c6\u5907\u83b7\u53d6AI\u7b54\u6848...', '#1890ff');
                getAIAnswer(processedQuestion, typeName)
                  .then(aiAnswer => {

                    logger('AI\u6210\u529f\u56de\u7b54，\u7ee7\u7eed\u5904\u7406...', 'green');
                    resolve(aiAnswer);
                  })
                  .catch(error => {

                    logger('AI\u56de\u7b54\u5931\u8d25: ' + error, 'red');


                    if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {

                      logger('\u5c1d\u8bd5\u4f7f\u7528\u968f\u673a\u7b54\u9898\u529f\u80fd\u4f5c\u4e3a\u5907\u9009...', '#1890ff');
                      const randomAnswer = getRandomAnswer(typeName);
                      logger('\u6210\u529f\u751f\u6210\u968f\u673a\u7b54\u6848: ' + randomAnswer, 'green');
                      resolve(randomAnswer);
                    } else {

                      localStorage.setItem('GPTJsSetting.sub', false);

                      resolve('');
                    }
                  });
                return;
              }


              if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {

                logger('\u5df2\u5f00\u542f\u968f\u673a\u7b54\u9898\u529f\u80fd，\u51c6\u5907\u751f\u6210\u968f\u673a\u7b54\u6848...', '#1890ff');
                const randomAnswer = getRandomAnswer(typeName);
                logger('\u6210\u529f\u751f\u6210\u968f\u673a\u7b54\u6848: ' + randomAnswer, 'green');
                resolve(randomAnswer);
                return;
              }


              logger('\u672a\u5f00\u542fAI\u7b54\u9898\u548c\u968f\u673a\u7b54\u9898\u529f\u80fd，\u7559\u7a7a\u5e76\u7ee7\u7eed\u4e0b\u4e00\u9898...', 'red');


              localStorage.setItem('GPTJsSetting.sub', false);


              resolve('');
            }
          } catch (e) {
            logger('\u89e3\u6790\u54cd\u5e94\u51fa\u9519: ' + e, 'red');


            showDesktopNotification('\u89e3\u6790\u54cd\u5e94\u51fa\u9519', `\u9519\u8bef\u4fe1\u606f: ${e}`, '');

            reject(e);
          }
        } else {
          logger('\u8bf7\u6c42\u5931\u8d25，\u72b6\u6001\u7801: ' + response.status, 'red');


          showDesktopNotification('\u8bf7\u6c42\u5931\u8d25', `\u72b6\u6001\u7801: ${response.status}`, '');

          reject('\u8bf7\u6c42\u5931\u8d25，\u72b6\u6001\u7801: ' + response.status);
        }
      },
      onerror: function (error) {
        logger('\u8bf7\u6c42\u51fa\u9519: ' + (error.statusText || '\u7f51\u7edc\u9519\u8bef'), 'red');





        showDesktopNotification('\u8bf7\u6c42\u51fa\u9519', `\u9519\u8bef\u4fe1\u606f: ${error.statusText || '\u7f51\u7edc\u9519\u8bef'}`, '');

        reject(error.statusText || '\u7f51\u7edc\u9519\u8bef');
      },
      ontimeout: function () {
        logger('\u8bf7\u6c42\u8d85\u65f6，\u670d\u52a1\u5668\u54cd\u5e94\u65f6\u95f4\u8fc7\u957f', 'red');
        logger('\u5c1d\u8bd5\u91cd\u65b0\u8fde\u63a5\u5230\u670d\u52a1\u5668...', 'orange');


        showDesktopNotification('\u8bf7\u6c42\u8d85\u65f6', '\u8bf7\u6c42\u7b54\u6848\u8d85\u65f6，\u6b63\u5728\u5c1d\u8bd5\u4f7f\u7528\u5907\u9009\u65b9\u6848', '');


        if (localStorage.getItem('GPTJsSetting.useAI') === 'true') {
          logger('\u5c1d\u8bd5\u4f7f\u7528AI\u56de\u7b54...', 'orange');
          getAIAnswer(processedQuestion, typeName)
            .then(aiAnswer => {
              logger('AI\u56de\u7b54\u6210\u529f，\u7ee7\u7eed\u5904\u7406...', 'green');
              resolve(aiAnswer);
            })
            .catch(error => {

              logger('AI\u56de\u7b54\u5931\u8d25: ' + error, 'red');

              if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {
                const randomAnswer = getRandomAnswer(typeName);
                logger('\u4f7f\u7528\u968f\u673a\u7b54\u6848: ' + randomAnswer, 'green');
                resolve(randomAnswer);
              } else {
                reject('\u8bf7\u6c42\u8d85\u65f6，\u4e14\u5907\u7528\u65b9\u6848\u5931\u8d25');
              }
            });
        } else if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {
          const randomAnswer = getRandomAnswer(typeName);
          logger('\u4f7f\u7528\u968f\u673a\u7b54\u6848: ' + randomAnswer, 'green');
          resolve(randomAnswer);
        } else {
          reject('\u8bf7\u6c42\u8d85\u65f6');
        }
      }
    });
  });
}


function doWork(index, doms, dom) {
  $frame_c = $(dom).contents();
  let $CyHtml = $frame_c.find('.CeYan')
  let TiMuList = $CyHtml.find('.TiMu')
  $subBtn = $frame_c.find(".ZY_sub").find(".btnSubmit");
  $saveBtn = $frame_c.find(".ZY_sub").find(".btnSave");
  startDoWork(index, doms, 0, TiMuList)
}

function startDoWork(index, doms, c, TiMuList) {
  if (c == TiMuList.length) {
    if (localStorage.getItem('GPTJsSetting.sub') === 'true') {
      logger('\u6d4b\u9a8c\u5904\u7406\u5b8c\u6210，\u51c6\u5907\u81ea\u52a8\u63d0\u4ea4。', 'green')
      setTimeout(() => {
        if ($subBtn && $subBtn.length > 0) {
          $subBtn.click()
          setTimeout(() => {
            const confirmBtn = $frame_c.find('#confirmSubWin > div > div > a.bluebtn');
            if (confirmBtn && confirmBtn.length > 0) {
              confirmBtn.click()
              logger('\u63d0\u4ea4\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
            } else {
              logger('\u672a\u627e\u5230\u786e\u8ba4\u6309\u94ae，\u53ef\u80fd\u5df2\u81ea\u52a8\u786e\u8ba4', 'orange')
            }
            _mlist.splice(0, 1)
            _domList.splice(0, 1)
            setTimeout(() => { startDoCyWork(index + 1, doms) }, 3000)
          }, 3000)
        } else {
          logger('\u672a\u627e\u5230\u63d0\u4ea4\u6309\u94ae，\u8bf7\u624b\u52a8\u63d0\u4ea4', 'red')
          _mlist.splice(0, 1)
          _domList.splice(0, 1)
          setTimeout(() => { startDoCyWork(index + 1, doms) }, 3000)
        }
      }, 5000)
    } else if (localStorage.getItem('GPTJsSetting.force') === 'true') {
      logger('\u6d4b\u9a8c\u5904\u7406\u5b8c\u6210，\u5b58\u5728\u65e0\u7b54\u6848\u9898\u76ee,\u7531\u4e8e\u7528\u6237\u8bbe\u7f6e\u4e86\u5f3a\u5236\u63d0\u4ea4，\u51c6\u5907\u81ea\u52a8\u63d0\u4ea4。', 'red')
      setTimeout(() => {
        if ($subBtn && $subBtn.length > 0) {
          $subBtn.click()
          setTimeout(() => {
            const confirmBtn = $frame_c.find('#confirmSubWin > div > div > a.bluebtn');
            if (confirmBtn && confirmBtn.length > 0) {
              confirmBtn.click()
              logger('\u63d0\u4ea4\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
            } else {
              logger('\u672a\u627e\u5230\u786e\u8ba4\u6309\u94ae，\u53ef\u80fd\u5df2\u81ea\u52a8\u786e\u8ba4', 'orange')
            }
            _mlist.splice(0, 1)
            _domList.splice(0, 1)
            setTimeout(() => { startDoCyWork(index + 1, doms) }, 3000)
          }, 3000)
        } else {
          logger('\u672a\u627e\u5230\u63d0\u4ea4\u6309\u94ae，\u8bf7\u624b\u52a8\u63d0\u4ea4', 'red')
          _mlist.splice(0, 1)
          _domList.splice(0, 1)
          setTimeout(() => { startDoCyWork(index + 1, doms) }, 3000)
        }
      }, 5000)
    } else {
      logger('\u6d4b\u9a8c\u5904\u7406\u5b8c\u6210，\u5b58\u5728\u65e0\u7b54\u6848\u9898\u76ee\u6216\u8005\u7528\u6237\u8bbe\u7f6e\u4e0d\u63d0\u4ea4，\u81ea\u52a8\u4fdd\u5b58！', 'green')
      setTimeout(() => {
        $saveBtn.click()
        setTimeout(() => {
          logger('\u4fdd\u5b58\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
          _mlist.splice(0, 1)
          _domList.splice(0, 1)
          setTimeout(() => { startDoCyWork(index + 1, doms) }, 3000)
        }, 3000)
      }, 5000)
    }
    return
  }
  let questionFull = $(TiMuList[c]).find('.Zy_TItle.clearfix > div').html()
  questionFull = formatQuestionText(questionFull).replace("/<span.*?>.*?</span>/", "");
  let _question = formatQuestionText(questionFull)
  let _TimuType = { \u5355\u9009\u9898: 0, \u591a\u9009\u9898: 1, \u586b\u7a7a\u9898: 2, \u5224\u65ad\u9898: 3, \u7b80\u7b54\u9898: 4 }[questionFull.match(/^【(.*?)】|$/)[1]]
  let _a = []
  let _answerTmpArr
  switch (_TimuType) {
    case 0:
      _answerTmpArr = $(TiMuList[c]).find('.Zy_ulTop li').find('a')

      var mergedAnswers = [];
      _answerTmpArr.each(function () {
        var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
        mergedAnswers.push(answerText);
      });
      mergedAnswers = mergedAnswers.join("|");

      logger("\u5355\u9009\u9898: " + _question + '\n' + mergedAnswers, 'blue');

      let questionWithOptions = _question + '\n' + mergedAnswers;
      $.each(_answerTmpArr, (i, t) => {
        _a.push(cleanTextContent($(t).html()))
      })
      getAnswer(_TimuType, questionWithOptions).then((agrs) => {
        if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {

          let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
          timuele.html(timuele.html() + agrs)
        }


        if (!agrs || agrs.trim() === '' || agrs.includes('\u672a\u627e\u5230\u7b54\u6848') || agrs === '\u6682\u65e0\u7b54\u6848') {
          logger('\u672a\u83b7\u53d6\u5230\u6709\u6548\u7b54\u6848，\u8df3\u8fc7\u6b64\u9898', 'red');
          localStorage.setItem('GPTJsSetting.sub', false);
          setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time);
          return;
        }

        $.each(_answerTmpArr, (i, t) => {
          if (agrs.indexOf(cleanTextContent($(t).html())) != -1) {
            $(_answerTmpArr[i]).parent().click();
            _a.push(['A', 'B', 'C', 'D', 'E', 'F', 'G'][i])
          }
        })
        let id = getStr($(TiMuList[c]).find('.Zy_ulTop li:nth-child(1)').attr('onclick'), 'addcheck(', ');').replace('(', '').replace(')', '')
        if (_a.length <= 0) {
          logger('\u65e0\u6cd5\u5339\u914d\u6b63\u786e\u7b54\u6848,\u8bf7\u624b\u52a8\u9009\u62e9，\u8df3\u8fc7', 'red')

          localStorage.setItem('GPTJsSetting.sub', false)
        } else {
          $(TiMuList[c]).find('.Zy_ulTop').parent().find('#answer' + id).val(_a.join(""))
        }
        setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
      }).catch((agrs) => {
        logger('\u7b54\u6848\u83b7\u53d6\u5931\u8d25，\u8df3\u8fc7\u6b64\u9898', 'red');
        setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
      })
      break
    case 1:
      _answerTmpArr = $(TiMuList[c]).find('.Zy_ulTop li').find('a')

      var mergedAnswers = [];
      _answerTmpArr.each(function () {
        var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
        mergedAnswers.push(answerText);
      });
      mergedAnswers = mergedAnswers.join("|");

      logger("\u591a\u9009\u9898,\u7528\"#\"\u5206\u5272\u591a\u4e2a\u7b54\u6848: " + _question + '\n' + mergedAnswers, 'blue');

      let multiQuestionWithOptions = _question + '\n' + mergedAnswers;
      getAnswer(_TimuType, multiQuestionWithOptions).then((agrs) => {
        if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {

          let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
          timuele.html(timuele.html() + agrs)
        }


        if (!agrs || agrs.trim() === '' || agrs.includes('\u672a\u627e\u5230\u7b54\u6848') || agrs === '\u6682\u65e0\u7b54\u6848') {
          logger('\u672a\u83b7\u53d6\u5230\u6709\u6548\u7b54\u6848，\u8df3\u8fc7\u6b64\u9898', 'red');
          localStorage.setItem('GPTJsSetting.sub', false);
          setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time);
          return;
        }


        _a = [];


        $.each(_answerTmpArr, (i, t) => {
          const optionText = cleanTextContent($(t).html());
          if (agrs.indexOf(optionText) !== -1) {
            $(_answerTmpArr[i]).parent().click();
            _a.push(['A', 'B', 'C', 'D', 'E', 'F', 'G'][i]);
            logger(`\u76f4\u63a5\u5339\u914d\u5230\u9009\u9879 ${['A', 'B', 'C', 'D', 'E', 'F', 'G'][i]}: ${optionText}`, 'green');
          }
        });


        if (_a.length === 0) {
          logger('\u76f4\u63a5\u5339\u914d\u5931\u8d25，\u5c1d\u8bd5\u5173\u952e\u8bcd\u5339\u914d...', 'orange');


          const answerKeywords = agrs
            .replace(/[.,，。、；;:：!！?？()（）\[\]【】\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .toLowerCase()
            .split(' ')
            .filter(k => k.length > 1);

          logger(`\u63d0\u53d6\u7684\u5173\u952e\u8bcd: ${answerKeywords.join(', ')}`, 'blue');


          const scores = [];

          $.each(_answerTmpArr, (i, t) => {
            const optionText = cleanTextContent($(t).html()).toLowerCase();
            let matchScore = 0;


            for (const keyword of answerKeywords) {
              if (keyword.length < 2) continue;

              if (optionText.includes(keyword)) {
                matchScore += 1;
              } else {

                for (const word of optionText.split(/\s+/)) {
                  if (word.length < 2) continue;

                  if (calculateSimilarity(word, keyword) > 0.7) {
                    matchScore += 0.5;
                    break;
                  }
                }
              }
            }

            scores.push({
              index: i,
              score: matchScore,
              label: ['A', 'B', 'C', 'D', 'E', 'F', 'G'][i],
              text: optionText
            });
          });


          scores.sort((a, b) => b.score - a.score);


          logger('\u5173\u952e\u8bcd\u5339\u914d\u7ed3\u679c:', 'blue');
          scores.forEach(item => {
            logger(`\u9009\u9879 ${item.label}: \u5f97\u5206 ${item.score.toFixed(2)} - ${item.text.substring(0, 20)}...`, 'blue');
          });


          if (scores.length > 0 && scores[0].score > 0) {
            const highestScore = scores[0].score;

            scores.forEach(item => {
              if (item.score >= highestScore * 0.7) {
                $(_answerTmpArr[item.index]).parent().click();
                _a.push(item.label);
                logger(`\u901a\u8fc7\u5173\u952e\u8bcd\u5339\u914d\u9009\u62e9\u9009\u9879 ${item.label}，\u5f97\u5206: ${item.score.toFixed(2)}`, 'green');
              }
            });
          }
        }


        if (_a.length === 0) {
          logger('\u5173\u952e\u8bcd\u5339\u914d\u5931\u8d25，\u5c1d\u8bd5\u76f8\u4f3c\u5ea6\u5339\u914d...', 'orange');

          const similarities = [];

          $.each(_answerTmpArr, (i, t) => {
            const optionText = cleanTextContent($(t).html());
            const similarity = calculateSimilarity(optionText, agrs);

            similarities.push({
              index: i,
              similarity: similarity,
              label: ['A', 'B', 'C', 'D', 'E', 'F', 'G'][i],
              text: optionText
            });
          });


          similarities.sort((a, b) => b.similarity - a.similarity);


          logger('\u76f8\u4f3c\u5ea6\u5339\u914d\u7ed3\u679c:', 'blue');
          similarities.forEach(item => {
            logger(`\u9009\u9879 ${item.label}: \u76f8\u4f3c\u5ea6 ${item.similarity.toFixed(2)} - ${item.text.substring(0, 20)}...`, 'blue');
          });


          if (similarities.length > 0 && similarities[0].similarity > 0.4) {
            const highestSimilarity = similarities[0].similarity;

            similarities.forEach(item => {
              if (item.similarity >= Math.max(0.4, highestSimilarity * 0.7)) {
                $(_answerTmpArr[item.index]).parent().click();
                _a.push(item.label);
                logger(`\u901a\u8fc7\u76f8\u4f3c\u5ea6\u5339\u914d\u9009\u62e9\u9009\u9879 ${item.label}，\u76f8\u4f3c\u5ea6: ${item.similarity.toFixed(2)}`, 'green');
              }
            });
          }
        }

        let id = getStr($(TiMuList[c]).find('.Zy_ulTop li:nth-child(1)').attr('onclick'), 'addcheck(', ');').replace('(', '').replace(')', '')
        if (_a.length <= 0) {
          logger('\u6240\u6709\u5339\u914d\u7b56\u7565\u5747\u5931\u8d25，\u65e0\u6cd5\u786e\u5b9a\u6b63\u786e\u9009\u9879，\u8bf7\u624b\u52a8\u9009\u62e9，\u8df3\u8fc7\u6b64\u9898', 'red')
          localStorage.setItem('GPTJsSetting.sub', false)
        } else {
          $(TiMuList[c]).find('.Zy_ulTop').parent().find('#answer' + id).val(_a.join(""))
        }
        setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
      }).catch((agrs) => {
        logger('\u7b54\u6848\u83b7\u53d6\u5931\u8d25，\u8df3\u8fc7\u6b64\u9898', 'red');
        localStorage.setItem('GPTJsSetting.sub', false);
        setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
      })
      break
    case 2:
      let _textareaList = $(TiMuList[c]).find('.Zy_ulTk .XztiHover1')
      getAnswer(_TimuType, _question).then((agrs) => {
        if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {

          let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
          timuele.html(timuele.html() + agrs)
        }
        let _answerList = agrs.split("#")
        $.each(_textareaList, (i, t) => {
          setTimeout(() => {
            $(t).find('#ueditor_' + i).contents().find('.view p').html(_answerList[i]);
            $(t).find('textarea').html('<p>' + _answerList[i] + '</p>')
          }, 300)
        })
        setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
      }).catch((agrs) => {
        setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
      })
      break
    case 3:
      _answerTmpArr = $(TiMuList[c]).find(".Zy_ulTop li").find("a");
      let _true = "\u6b63\u786e|\u662f|\u5bf9|√|T|ri";
      $.each(_answerTmpArr, (i, t) => {
        _a.push(cleanTextContent($(t).html()));
      });

      logger("\u5224\u65ad\u9898，\u53ea\u56de\u7b54\u6b63\u786e\u6216\u9519\u8bef: " + _question, 'blue');
      getAnswer(_TimuType, _question).then((agrs) => {
        if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {

          let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
          timuele.html(timuele.html() + agrs)
        }


        if (!agrs || agrs.trim() === '' || agrs.includes('\u672a\u627e\u5230\u7b54\u6848') || agrs === '\u6682\u65e0\u7b54\u6848') {
          logger('\u672a\u83b7\u53d6\u5230\u6709\u6548\u7b54\u6848，\u8df3\u8fc7\u6b64\u9898', 'red');
          localStorage.setItem('GPTJsSetting.sub', false);
          setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time);
          return;
        }

        agrs = _true.indexOf(agrs) != -1 ? "\u5bf9" : "\u9519";
        let _i = _a.findIndex((item) => item == agrs);
        if (_i == -1) {
          logger("\u672a\u5339\u914d\u5230\u6b63\u786e\u7b54\u6848，\u8df3\u8fc7", "red");
          localStorage.setItem('GPTJsSetting.sub', false)
        } else {
          $(_answerTmpArr[_i]).parent().click();
        }
        setTimeout(() => {
          startDoWork(index, doms, c + 1, TiMuList);
        }, setting.time);
      }).catch((agrs) => {
        logger('\u7b54\u6848\u83b7\u53d6\u5931\u8d25，\u8df3\u8fc7\u6b64\u9898', 'red');
        setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
      })
      break;
    case 4:
      let _textareaLista = $(TiMuList[c]).find('.Zy_ulTk .XztiHover1')
      getAnswer(_TimuType, _question).then((agrs) => {
        if (agrs == '\u6682\u65e0\u7b54\u6848') {

          localStorage.setItem('GPTJsSetting.sub', false)
        }
        let _answerList = agrs.split("#")
        $.each(_textareaLista, (i, t) => {
          setTimeout(() => {
            $(t).find('#ueditor_' + i).contents().find('.view p').html(_answerList[i]);
            $(t).find('textarea').html('<p>' + _answerList[i] + '</p>')
          }, 300)
        })
        setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
      }).catch((agrs) => {
        setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
      })
      break
  }
}

function uploadAnswer(a) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url: API_BASE_URL + '/api/v1/save?v=' + GM_info['script']['version'],
      data: 'data=' + encodeURIComponent(JSON.stringify(a)),
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function (xhr) {
        try {
          let res = $.parseJSON(xhr.responseText)
          if (res['code'] == 200) {
            logger('\u7b54\u6848\u6536\u5f55\u6210\u529f！！\u6b64\u6b21\u6536\u5f55' + res['data']['total'] + '\u9053\u9898\u76ee，\u51c6\u5907\u5904\u7406\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'green')
          } else {
            logger('\u7b54\u6848\u6536\u5f55\u5931\u8d25\u4e86，\u8bf7\u5411\u4f5c\u8005\u53cd\u9988，\u51c6\u5907\u5904\u7406\u4e0b\u4e00\u4e2a\u4efb\u52a1。', 'red')
          }
          resolve()
        } catch {
          let res = xhr.responseText
          if (res.indexOf('\u9632\u706b\u5899') != -1) {
            logger('\u7b54\u6848\u6536\u5f55\u5931\u8d25\u4e86，\u5df2\u88ab\u9632\u706b\u5899\u62e6\u622a，\u8bf7\u8054\u7cfb\u4f5c\u8005\u624b\u52a8\u6536\u5f55。', 'red')
          } else {
            logger('\u7b54\u6848\u6536\u5f55\u5931\u8d25\u4e86，\u672a\u77e5\u9519\u8bef，\u8bf7\u5411\u4f5c\u8005\u53cd\u9988。', 'red')
          }
          resolve()
        }
      }
    })

  })

}

function switchMission() {
  if (_mlist.length > 0) {
    let taskName = '';
    try {
      taskName = _mlist[0]['property']['name'] || '\u4efb\u52a1\u70b9';
    } catch (e) {
      taskName = '\u4efb\u52a1\u70b9';
    }

    showDesktopNotification('\u5b8c\u6210\u4e00\u4e2a\u4efb\u52a1\u70b9', `\u5df2\u5b8c\u6210: ${taskName}`, '');
  } else {

    showDesktopNotification('\u6ca1\u6709\u4efb\u52a1\u70b9', '\u5f53\u524d\u9875\u9762\u6ca1\u6709\u53ef\u5904\u7406\u7684\u4efb\u52a1\u70b9', '');
  }

  _mlist.splice(0, 1)
  _domList.splice(0, 1)

  setTimeout(initializeTaskSystem, 5000)
}


function missonStart() {

  logger('\u901a\u8fc7missonStart\u522b\u540d\u8c03\u7528initializeTaskSystem', 'blue');
  try {
    initializeTaskSystem();
  } catch (e) {
    logger('\u901a\u8fc7missonStart\u8c03\u7528initializeTaskSystem\u5931\u8d25: ' + e, 'red');

    showBox();
    if (_mlist.length <= 0) {

      showDesktopNotification('\u4efb\u52a1\u70b9\u5b8c\u6210', '\u6b64\u9875\u9762\u6240\u6709\u4efb\u52a1\u70b9\u5df2\u5904\u7406\u5b8c\u6bd5，\u51c6\u5907\u8df3\u8f6c\u9875\u9762', '');
      logger('\u6b64\u9875\u9762\u4efb\u52a1\u5904\u7406\u5b8c\u6bd5，\u51c6\u5907\u8df3\u8f6c\u9875\u9762', 'green');
      return toNext();
    }

    let _type = _mlist[0]['type'],
      _dom = _domList[0],
      _task = _mlist[0];
    if (_type == undefined) {
      _type = _mlist[0]['property']["module"];
    }

    logger('\u5c1d\u8bd5\u7ee7\u7eed\u6267\u884c\u4efb\u52a1: ' + _type, 'orange');
    setTimeout(() => { switchMission(); }, 5000);
  }
}

function cleanTextContent(textString) {
  if (!textString) return null;


  let cleaned = textString.replace(/<(?!img).*?>/g, "");


  cleaned = cleaned
    .replace(/^【.*?】\s*/, '')
    .replace(/\s*（\d+\.\d+\u5206）$/, '')
    .replace(/\s*\(\d+\.\d+\u5206\)$/, '')
    .replace(/\s*[\(（].*?\u5206[\)）]/, '')
    .replace(/&nbsp;/g, '')
    .replace(new RegExp("&nbsp;", ("gm")), '')
    .replace(/\s*\([\d\.]+\)\s*$/, '')
    .replace(/\s*（[\d\.]+）\s*$/, '')
    .replace(/^\s*\d+[\.\、]\s*/, '')
    .replace(/^\s*[\(（].*?[\)）]\s*/, '')
    .trim()
    .replace(/^\s+/, '')
    .replace(/\s+$/, '');

  return cleaned;
}

function formatQuestionText(questionText) {
  if (!questionText) return null;


  let formatted = cleanTextContent(questionText);


  formatted = formatted
    .replace(/^\d+[\.、]/, '')
    .replace(/^\s*[\(（【\[]?\s*(\u5355\u9009\u9898|\u591a\u9009\u9898|\u5224\u65ad\u9898|\u586b\u7a7a\u9898|\u7b80\u7b54\u9898|\u8bba\u8ff0\u9898|\u5206\u6790\u9898)[\s\.\:：,，]*[\d\.]*\u5206?[\)）\]\】]?\s*/i, '')
    .replace(/\(\s*\d+\.\d+\s*\u5206\s*\)/g, '')
    .replace(/（\s*\d+\.\d+\s*\u5206\s*）/g, '')
    .replace('javascript:void(0);', '')
    .trim();

  return formatted;
}

/**
 * \u8ba1\u7b97\u4e24\u4e2a\u5b57\u7b26\u4e32\u7684\u76f8\u4f3c\u5ea6
 * @param {string} str1 - \u7b2c\u4e00\u4e2a\u5b57\u7b26\u4e32
 * @param {string} str2 - \u7b2c\u4e8c\u4e2a\u5b57\u7b26\u4e32
 * @returns {number} - \u76f8\u4f3c\u5ea6，\u8303\u56f40-1
 */
function calculateSimilarity(str1, str2) {

  if (!str1 || !str2) {
    return 0;
  }


  const cleanStr = (s) => String(s)
    .toLowerCase()
    .replace(/[.,，。、；;:：!！?？()（）\[\]【】\s]/g, '')
    .replace(/[""'']/g, '');

  const s1 = cleanStr(str1);
  const s2 = cleanStr(str2);


  if (s1 === s2) {
    return 1;
  }


  if (s1.includes(s2)) {
    return 0.9 * (s2.length / s1.length);
  }

  if (s2.includes(s1)) {
    return 0.9 * (s1.length / s2.length);
  }


  const keywords1 = s1.split(/\d+/).filter(k => k.length > 1);
  const keywords2 = s2.split(/\d+/).filter(k => k.length > 1);

  let keywordMatches = 0;
  let totalKeywords = keywords1.length;

  for (const k1 of keywords1) {
    if (k1.length < 2) continue;

    for (const k2 of keywords2) {
      if (k2.length < 2) continue;

      if (k1.includes(k2) || k2.includes(k1) ||
        levenshteinDistance(k1, k2) / Math.max(k1.length, k2.length) < 0.3) {
        keywordMatches++;
        break;
      }
    }
  }

  const keywordScore = totalKeywords > 0 ? keywordMatches / totalKeywords : 0;


  const len1 = s1.length;
  const len2 = s2.length;


  if (Math.abs(len1 - len2) > Math.min(len1, len2)) {
    return keywordScore * 0.7;
  }


  let commonChars = 0;
  for (let i = 0; i < len1; i++) {
    if (s2.includes(s1[i])) {
      commonChars++;
    }
  }

  const charScore = commonChars / Math.max(len1, len2);


  let longestSubstring = findLongestCommonSubstring(s1, s2);
  const substringScore = longestSubstring.length > 1 ?
    longestSubstring.length / Math.min(len1, len2) : 0;


  return Math.max(
    keywordScore * 0.5 + charScore * 0.3 + substringScore * 0.2,
    keywordScore * 0.7,
    substringScore * 0.8
  );
}

/**
 * \u8ba1\u7b97\u4e24\u4e2a\u5b57\u7b26\u4e32\u7684\u7f16\u8f91\u8ddd\u79bb
 */
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;


  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));


  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;


  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * \u67e5\u627e\u4e24\u4e2a\u5b57\u7b26\u4e32\u7684\u6700\u957f\u516c\u5171\u5b50\u4e32
 */
function findLongestCommonSubstring(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  let maxLength = 0;
  let endIndex = 0;


  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));


  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        if (dp[i][j] > maxLength) {
          maxLength = dp[i][j];
          endIndex = i - 1;
        }
      }
    }
  }

  return maxLength > 0 ? str1.substring(endIndex - maxLength + 1, endIndex + 1) : "";
}

function convertEncryptedFont() {
  /**
  * Author   wyn665817
  * From     https:
  */
  var $tip = $('style:contains(font-cxsecret)');
  if (!$tip.length) return;
  var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
  font = Typr.parse(convertBase64ToArray(font))[0];
  var table = JSON.parse(GM_getResourceText('Table'));
  var match = {};
  for (var i = 19968; i < 40870; i++) {
    $tip = Typr.U.codeToGlyph(font, i);
    if (!$tip) continue;
    $tip = Typr.U.glyphToPath(font, $tip);
    $tip = md5(JSON.stringify($tip)).slice(24);
    match[i] = table[$tip];
  }
  $('.font-cxsecret').html(function (index, html) {
    $.each(match, function (key, value) {
      key = String.fromCharCode(key);
      key = new RegExp(key, 'g');
      value = String.fromCharCode(value);
      html = html.replace(key, value);
    });
    return html;
  }).removeClass('font-cxsecret');
}

function convertBase64ToArray(base64) {
  var data = window.atob(base64);
  var buffer = new Uint8Array(data.length);
  for (var i = 0; i < data.length; ++i) {
    buffer[i] = data.charCodeAt(i);
  }
  return buffer;
}


$(document).ready(function () {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;


  function savePosition() {
    const box = document.getElementById('ne-21box');
    if (box) {
      const position = {
        left: parseInt(box.style.left) || 20,
        top: parseInt(box.style.top) || 5
      };
      localStorage.setItem('GPTJsSetting.boxPosition', JSON.stringify(position));
    }
  }


  function loadPosition() {
    const box = document.getElementById('ne-21box');
    if (box) {

      let storedPosition = localStorage.getItem('GPTJsSetting.boxPosition');
      let position = { left: 20, top: 5 };

      if (storedPosition) {
        try {
          position = JSON.parse(storedPosition);
        } catch (e) {
          console.error('\u65e0\u6cd5\u89e3\u6790\u5b58\u50a8\u7684\u4f4d\u7f6e\u4fe1\u606f');
        }
      }


      box.style.right = 'auto';
      box.style.left = position.left + 'px';
      box.style.top = position.top + 'px';
    }
  }


  $(document).on('mousedown', '.ne-header', function (e) {
    isDragging = true;
    const box = document.getElementById('ne-21box');


    initialX = e.clientX - (parseInt(box.style.left) || 0);
    initialY = e.clientY - (parseInt(box.style.top) || 0);

    if (e.target === box) {
      box.style.cursor = 'move';
    }
  });

  $(document).on('mousemove', function (e) {
    if (isDragging) {
      e.preventDefault();


      const newLeft = e.clientX - initialX;
      const newTop = e.clientY - initialY;


      const box = document.getElementById('ne-21box');
      const maxX = window.innerWidth - box.offsetWidth;
      const maxY = window.innerHeight - box.offsetHeight;


      box.style.right = 'auto';
      box.style.left = Math.max(0, Math.min(newLeft, maxX)) + 'px';
      box.style.top = Math.max(0, Math.min(newTop, maxY)) + 'px';
    }
  });

  $(document).on('mouseup', function (e) {
    if (isDragging) {
      isDragging = false;
      const box = document.getElementById('ne-21box');
      if (box) {
        box.style.cursor = '';
      }
      savePosition();
    }
  });


  setTimeout(loadPosition, 1000);
});


function setTikuKey() {
  let currentKey = localStorage.getItem('GPTJsSetting.key') || '';
  let newKey = prompt('\u8bf7\u8f93\u5165\u60a8\u7684\u9898\u5e93 API Key:', currentKey);

  if (newKey !== null) {
    if (newKey.trim() === '') {
      alert('\u8bf7\u8f93\u5165Key');
    } else {

      GM_xmlhttpRequest({
        url: API_BASE_URL + "?act=verify_key",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: "key=" + encodeURIComponent(newKey.trim()),
        onload: function (response) {
          try {
            const result = JSON.parse(response.responseText);
            if (result.code === 1) {

              localStorage.setItem('GPTJsSetting.key', newKey.trim());
              localStorage.setItem('tiku_key', newKey.trim());


              if (document.getElementById('GPTJsSetting.key')) {
                document.getElementById('GPTJsSetting.key').value = newKey.trim();
              }

              alert('API Key \u4fdd\u5b58\u6210\u529f！');
              showDesktopNotification('API Key \u4fdd\u5b58\u6210\u529f！', '\u60a8\u7684API Key\u5df2\u6210\u529f\u4fdd\u5b58', '');
            } else {
              alert(result.msg || 'Key\u9a8c\u8bc1\u5931\u8d25');
              showDesktopNotification('Key\u9a8c\u8bc1\u5931\u8d25', result.msg || 'Key\u9a8c\u8bc1\u5931\u8d25', '');
            }
          } catch (e) {
            alert('\u9a8c\u8bc1\u8bf7\u6c42\u5931\u8d25，\u8bf7\u7a0d\u540e\u91cd\u8bd5');
          }
        },
        onerror: function () {
          alert('\u9a8c\u8bc1\u8bf7\u6c42\u5931\u8d25，\u8bf7\u68c0\u67e5\u7f51\u7edc\u8fde\u63a5');
        }
      });
    }
  }
}


function addTikuKeyButton() {

  if (document.querySelector('.tiku-settings-btn')) {
    return;
  }


  const currentKey = localStorage.getItem('tiku_key');
  const isDefaultKey = !localStorage.getItem('tiku_key');


  const settingsContainer = document.createElement('div');

  const shouldHideBox = localStorage.getItem('GPTJsSetting.showBox') === 'hide';
  const containerDisplay = shouldHideBox ? 'flex' : 'none';

  settingsContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: ${containerDisplay};
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    z-index: 9999;
  `;


  const statusIndicator = document.createElement('div');
  statusIndicator.textContent = isDefaultKey ? '\u672a\u914d\u7f6e' : 'F9\u663e\u793a\u9762\u677f';
  statusIndicator.style.cssText = `
    background: ${isDefaultKey ? '#FC3D74' : '#FC3D74'};
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s;
  `;


  const settingsBtn = document.createElement('div');
  settingsBtn.className = 'tiku-settings-btn';
  settingsBtn.innerHTML = '🔎';
  settingsBtn.style.cssText = `
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #20e5fe;
    color: white;
    border-radius: 50%;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    cursor: pointer;
    transition: all 0.3s ease;
  `;


  settingsBtn.onmouseover = function () {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 4px 12px 0 rgba(0,0,0,0.2)';
    statusIndicator.style.opacity = '1';
    statusIndicator.style.transform = 'translateY(0)';
  };

  settingsBtn.onmouseout = function () {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 2px 12px 0 rgba(0,0,0,0.1)';
    statusIndicator.style.opacity = '0';
    statusIndicator.style.transform = 'translateY(10px)';
  };


  settingsBtn.onclick = function () {

    let neBox = document.getElementById('ne-21box');
    if (!neBox) {

      showBox();
      neBox = document.getElementById('ne-21box');
    }


    if (neBox) {
      let show = neBox.style.display === 'none' || neBox.style.display === '';
      neBox.style.display = show ? 'block' : 'none';


      localStorage.setItem('GPTJsSetting.showBox', show ? 'show' : 'hide');


      settingsContainer.style.display = show ? 'none' : 'flex';
    }
  };


  settingsContainer.appendChild(statusIndicator);
  settingsContainer.appendChild(settingsBtn);
  document.body.appendChild(settingsContainer);


  document.addEventListener('keydown', function (e) {
    if (e.key === 'F9') {

      e.preventDefault();


      let neBox = document.getElementById('ne-21box');
      if (!neBox) {

        showBox();
        neBox = document.getElementById('ne-21box');
      }


      if (neBox) {
        let show = neBox.style.display === 'none' || neBox.style.display === '';
        neBox.style.display = show ? 'block' : 'none';


        localStorage.setItem('GPTJsSetting.showBox', show ? 'show' : 'hide');


        settingsContainer.style.display = show ? 'none' : 'flex';
      }
    }
  });








}


window.addEventListener('load', function () {
  setTimeout(addTikuKeyButton, 1000);
});




window.addEventListener('load', function () {

  initTikuConfig();

  setTimeout(addTikuKeyButton, 1000);
});


function initTikuConfig() {

  if (window.tikuInitialized) {
    return;
  }
  window.tikuInitialized = true;


  let currentKey = localStorage.getItem('GPTJsSetting.key') || '';


  if (!localStorage.getItem('tiku_key') && currentKey) {
    localStorage.setItem('tiku_key', currentKey);
  } else if (localStorage.getItem('tiku_key') && !currentKey) {

    localStorage.setItem('GPTJsSetting.key', localStorage.getItem('tiku_key'));
    currentKey = localStorage.getItem('tiku_key');
  }



  /*
  setTimeout(() => {
    const tikuInfo = document.createElement('div');
    tikuInfo.innerHTML = `
      <div style="position: fixed; top: 10px; right: 10px; background: rgba(255, 255, 255, 0.9); 
                  padding: 8px 12px; border-radius: 4px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); 
                  font-size: 12px; color: #666; z-index: 9998; display: flex; align-items: center;">
        <span style="color: #409EFF; margin-right: 5px;">✓</span> 
        \u9898\u5e93\u5df2\u8fde\u63a5 (Key: ${currentKey.substring(0, 3)}***)
      </div>
    `;
 

    setTimeout(() => {
      if (document.body.contains(tikuInfo)) {
        tikuInfo.style.opacity = '0';
        tikuInfo.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          if (document.body.contains(tikuInfo)) {
            document.body.removeChild(tikuInfo);
          }
        }, 500);
      }
    }, 3000);
 
    document.body.appendChild(tikuInfo);
  }, 2000);
  */


  addNotificationToggleToGptBox();
}


function showDesktopNotification(title, message, icon = '') {

  if (localStorage.getItem('GPTJsSetting.notification') === 'false') {
    return;
  }


  if (!("Notification" in window)) {
    logger('\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u684c\u9762\u901a\u77e5', 'red');
    return;
  }


  const defaultIcon = 'https://mx.mixuelo.cc/index/pengzi/images/\u601d\u80032.gif';
  const notificationIcon = icon || defaultIcon;


  if (Notification.permission === "granted") {

    new Notification(title, {
      body: message,
      icon: notificationIcon
    });
  } else if (Notification.permission !== "denied") {

    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {

        new Notification(title, {
          body: message,
          icon: notificationIcon
        });
      } else {
        logger('\u60a8\u62d2\u7edd\u4e86\u901a\u77e5\u6743\u9650', 'red');
      }
    });
  }
}


function testNotification() {
  showDesktopNotification('\u901a\u77e5\u6d4b\u8bd5', '\u5982\u679c\u60a8\u770b\u5230\u8fd9\u6761\u6d88\u606f，\u8bf4\u660e\u901a\u77e5\u529f\u80fd\u6b63\u5e38\u5de5\u4f5c！', '');
}


$('#GPTJsSetting\\.notification').change(function () {
  localStorage.setItem('GPTJsSetting.notification', this.checked);


  const saveKeyMsg = document.getElementById('saveKeyMsg');
  saveKeyMsg.innerText = this.checked ? '\u684c\u9762\u901a\u77e5\u5df2\u5f00\u542f' : '\u684c\u9762\u901a\u77e5\u5df2\u5173\u95ed';
  saveKeyMsg.style.backgroundColor = this.checked ? '#4CAF50' : '#FF9800';
  saveKeyMsg.style.display = 'block';


  setTimeout(function () {
    saveKeyMsg.style.opacity = '1';
    saveKeyMsg.style.transform = 'translateY(0)';
  }, 10);


  if (this.checked) {
    testNotification();
  }


  setTimeout(function () {
    saveKeyMsg.style.opacity = '0';
    saveKeyMsg.style.transform = 'translateY(-10px)';
    setTimeout(function () {
      saveKeyMsg.style.display = 'none';
    }, 300);
  }, 3000);
});


function addNotificationToggleToGptBox() {

  const gptBoxes = document.querySelectorAll('.gpt-box');


  gptBoxes.forEach(box => {

    if (box.querySelector('.notification-toggle-btn')) {
      return;
    }


    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'notification-toggle-btn';


    const notificationEnabled = localStorage.getItem('GPTJsSetting.notification') !== 'false';


    toggleBtn.innerHTML = notificationEnabled ?
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>' :
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';

    toggleBtn.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${notificationEnabled ? '#4CAF50' : '#FF9800'};
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 12px;
      z-index: 1000;
      opacity: 0.7;
      transition: all 0.3s ease;
    `;


    toggleBtn.addEventListener('mouseover', () => {
      toggleBtn.style.opacity = '1';
    });

    toggleBtn.addEventListener('mouseout', () => {
      toggleBtn.style.opacity = '0.7';
    });


    toggleBtn.addEventListener('click', () => {

      const currentStatus = localStorage.getItem('GPTJsSetting.notification') !== 'false';
      localStorage.setItem('GPTJsSetting.notification', !currentStatus);


      toggleBtn.innerHTML = !currentStatus ?
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>' :
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';

      toggleBtn.style.backgroundColor = !currentStatus ? '#4CAF50' : '#FF9800';


      const checkbox = document.getElementById('GPTJsSetting.notification');
      if (checkbox) {
        checkbox.checked = !currentStatus;
      }


      const message = !currentStatus ? '\u684c\u9762\u901a\u77e5\u5df2\u5f00\u542f' : '\u684c\u9762\u901a\u77e5\u5df2\u5173\u95ed';


      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${!currentStatus ? '#4CAF50' : '#FF9800'};
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
        z-index: 10000;
        transition: all 0.3s;
      `;
      document.body.appendChild(notification);


      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 500);
      }, 3000);
    });


    box.style.position = 'relative';
    box.appendChild(toggleBtn);
  });
}


function setupNotificationToggleObserver() {

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList && node.classList.contains('gpt-box')) {

            addNotificationToggleToGptBox();
          }
        });
      }
    });
  });


  const config = { childList: true, subtree: true };


  observer.observe(document.body, config);


  addNotificationToggleToGptBox();
}


window.addEventListener('load', setupNotificationToggleObserver);












document.getElementById('ai-send-btn').addEventListener('click', getAiAnswer);
document.getElementById('ai-copy-btn').addEventListener('click', copyAiAnswer);


function getAiAnswer() {
  const questionText = document.getElementById('ai-question').value.trim();
  if (!questionText) {
    document.getElementById('ai-answer').innerText = '\u8bf7\u8f93\u5165\u95ee\u9898\u5185\u5bb9';
    return;
  }

  document.getElementById('ai-answer').innerText = '\u6b63\u5728\u601d\u8003\u4e2d，\u8bf7\u7a0d\u5019...';


  const model = document.getElementById('modelSelect').value;


  let userKey = localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || '';


  if (!userKey) {
    document.getElementById('ai-answer').innerText = '\u8bf7\u5728\u8bbe\u7f6e\u4e2d\u914d\u7f6e\u60a8\u7684Key';
    logger('\u672a\u914d\u7f6eKey，\u8bf7\u5728\u8bbe\u7f6e\u4e2d\u914d\u7f6e\u60a8\u7684Key', 'red');
    return;
  }

  logger('\u4f7f\u7528\u6a21\u578b: ' + model, '#1890ff');


  const data = {
    messages: [
      {
        role: "system",
        search: "true",
        content: "\u4f60\u662f\u4e00\u4e2a\u4e13\u4e1a\u7684\u7b54\u9898\u52a9\u624b,\u8bf7\u5e2e\u6211\u89e3\u7b54\u4ee5\u4e0b\u95ee\u9898。"
      },
      {
        role: "user",
        content: questionText
      }
    ],
    model: model
  };




  GM_xmlhttpRequest({
    method: 'POST',
    url: API_BASE_URL + '?act=ai',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + userKey,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data),
    timeout: 10000,
    onload: function (response) {
      try {



        const result = JSON.parse(response.responseText);
        if (response.status === 200) {

          if (result.code === 1001) {
            document.getElementById('ai-answer').innerText = '\u9519\u8bef: ' + result.msg;
            logger('AI\u56de\u7b54\u5931\u8d25: ' + result.msg, 'red');
            return;
          }


          if ((result.code === 1000 || result.code === 200) && result.data && result.data.answer) {
            const answer = result.data.answer;
            document.getElementById('ai-answer').innerText = answer;
            logger('AI\u56de\u7b54\u6210\u529f', '#10b981');
          } else {
            document.getElementById('ai-answer').innerText = '\u83b7\u53d6\u7b54\u6848\u5931\u8d25: API\u8fd4\u56de\u683c\u5f0f\u9519\u8bef';
            logger('AI\u56de\u7b54\u5931\u8d25: API\u8fd4\u56de\u683c\u5f0f\u9519\u8bef', 'red');
          }
        } else {
          document.getElementById('ai-answer').innerText = '\u83b7\u53d6\u7b54\u6848\u5931\u8d25: \u670d\u52a1\u5668\u54cd\u5e94\u9519\u8bef ' + response.status;
          logger('AI\u56de\u7b54\u5931\u8d25: \u670d\u52a1\u5668\u54cd\u5e94\u9519\u8bef ' + response.status, 'red');
        }
      } catch (error) {
        document.getElementById('ai-answer').innerText = '\u83b7\u53d6\u7b54\u6848\u5931\u8d25: ' + error.message;
        logger('AI\u56de\u7b54\u5931\u8d25: ' + error.message, 'red');
      }
    },
    onerror: function (error) {
      document.getElementById('ai-answer').innerText = '\u83b7\u53d6\u7b54\u6848\u5931\u8d25，\u8bf7\u68c0\u67e5\u7f51\u7edc\u8fde\u63a5';
      logger('AI\u8bf7\u6c42\u9519\u8bef: ' + error.message, 'red');
    },
    ontimeout: function () {
      document.getElementById('ai-answer').innerText = '\u83b7\u53d6\u7b54\u6848\u5931\u8d25，\u8bf7\u6c42\u8d85\u65f6';
      logger('AI\u8bf7\u6c42\u8d85\u65f6', 'red');
    }
  });
}


function copyAiAnswer() {
  const answerText = document.getElementById('ai-answer').innerText;
  if (answerText && answerText !== '\u6b63\u5728\u601d\u8003\u4e2d，\u8bf7\u7a0d\u5019...' && answerText !== 'AI \u52a9\u624b\u5df2\u51c6\u5907\u5c31\u7eea，\u8bf7\u8f93\u5165\u60a8\u7684\u95ee\u9898...') {
    navigator.clipboard.writeText(answerText)
      .then(() => {
        logger('\u7b54\u6848\u5df2\u590d\u5236\u5230\u526a\u8d34\u677f', '#10b981');

        const copyBtn = document.getElementById('ai-copy-btn');
        const originalText = copyBtn.innerText;
        copyBtn.innerText = '\u590d\u5236\u6210\u529f';
        copyBtn.style.backgroundColor = '#52c41a';
        setTimeout(() => {
          copyBtn.innerText = originalText;
          copyBtn.style.backgroundColor = '#722ed1';
        }, 1500);
      })
      .catch(err => {
        logger('\u590d\u5236\u5931\u8d25: ' + err, 'red');
      });
  }
}


function toggleLogWindow() {
  const logBox = document.querySelector('.gpt-box');
  const logToggleBtn = document.getElementById('ai-log-toggle');

  if (!logBox) return;


  if (logBox.style.display === 'none') {
    logBox.style.display = 'block';
    logToggleBtn.innerText = '\u9690\u85cf\u65e5\u5fd7';
    logToggleBtn.style.backgroundColor = '#1890ff';
    localStorage.setItem('GPTJsSetting.hideGptBox', 'false');
  } else {
    logBox.style.display = 'none';
    logToggleBtn.innerText = '\u663e\u793a\u65e5\u5fd7';
    logToggleBtn.style.backgroundColor = '#8c8c8c';
    localStorage.setItem('GPTJsSetting.hideGptBox', 'true');
  }
}


function initLogToggleButton() {
  const logToggleBtn = document.getElementById('ai-log-toggle');
  if (!logToggleBtn) return;


  logToggleBtn.addEventListener('click', toggleLogWindow);


  const isHidden = localStorage.getItem('GPTJsSetting.hideGptBox') === 'true';
  if (isHidden) {
    logToggleBtn.innerText = '\u663e\u793a\u65e5\u5fd7';
    logToggleBtn.style.backgroundColor = '#8c8c8c';
  } else {
    logToggleBtn.innerText = '\u9690\u85cf\u65e5\u5fd7';
    logToggleBtn.style.backgroundColor = '#1890ff';
  }
}


document.getElementById('ai-send-btn').addEventListener('click', getAiAnswer);
document.getElementById('ai-copy-btn').addEventListener('click', copyAiAnswer);


setTimeout(() => {
  const logToggleBtn = document.getElementById('ai-log-toggle');
  if (logToggleBtn) {
    initLogToggleButton();
  }
}, 1000);


function getAIAnswer(question, typeName) {
  return new Promise((resolve, reject) => {
    if (!question || question.trim() === '') {
      reject('\u95ee\u9898\u4e0d\u80fd\u4e3a\u7a7a');
      return;
    }

    logger(`\u5c1d\u8bd5\u4f7f\u7528AI\u56de\u7b54\u95ee\u9898: ${question.substring(0, 30)}...`, '#1890ff');
    logger(`\u9898\u578b: ${typeName || '\u672a\u77e5\u9898\u578b'}`, '#1890ff');


    const model = localStorage.getItem('GPTJsSetting.model') || 'Doubao-1.5-lite-32k';
    logger(`\u4f7f\u7528\u6a21\u578b: ${model}`, '#1890ff');


    let userKey = localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || '';


    if (!userKey) {
      logger('\u672a\u914d\u7f6eKey，\u65e0\u6cd5\u4f7f\u7528AI\u56de\u7b54', 'red');
      reject('\u672a\u914d\u7f6eKey');
      return;
    }


    let processedQuestion = question;


    if (question.includes('\n') && question.includes('|')) {

      logger('\u9898\u76ee\u5df2\u5305\u542b\u9009\u9879\u4fe1\u606f，\u76f4\u63a5\u4f20\u9012\u7ed9AI', 'blue');
    } else if (typeName && (typeName.includes("\u5355\u9009\u9898") || typeName.includes("\u591a\u9009\u9898"))) {

      logger('\u5c1d\u8bd5\u4ece\u5f53\u524d\u9875\u9762\u83b7\u53d6\u9009\u9879\u4fe1\u606f...', 'blue');

      try {

        let options = [];


        const optionSelectors = [
          '.Zy_ulTop li a',
          '.answerList.multiChoice li',
          '.answerList.singleChoice li',
          '.clearfix.answerBg .fl.answer_p',
          '.stem_answer .answer_p',
          '.answerList li',
          '.mark_letter li',
          '.option-content',
          'div[class*="answer"]'
        ];

        for (const selector of optionSelectors) {
          const elements = $(selector);
          if (elements.length > 0) {
            elements.each(function () {
              let optionText = $(this).text().trim();


              optionText = optionText.replace(/^[ABCDEFG][\.\s]*/, '');
              optionText = optionText.replace(/^\s*[A-G]\s*[\.\)]\s*/, '');
              optionText = optionText.replace(/^\s*[（\(][A-G][）\)]\s*/, '');
              optionText = optionText.trim();


              if (optionText && optionText.length > 1 && !options.includes(optionText)) {
                options.push(optionText);
              }
            });

            if (options.length > 0) {
              logger(`\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230 ${options.length} \u4e2a\u9009\u9879: ${options.join(' | ')}`, 'green');
              break;
            }
          }
        }


        if (options.length > 0) {
          processedQuestion = question + '\n' + options.join('|');
          logger(`\u5df2\u5c06\u9009\u9879\u4fe1\u606f\u6dfb\u52a0\u5230\u9898\u76ee\u4e2d: ${options.join('|')}`, 'green');
        } else {
          logger('\u672a\u80fd\u4ece\u9875\u9762\u83b7\u53d6\u5230\u9009\u9879\u4fe1\u606f，\u4f7f\u7528\u539f\u59cb\u9898\u76ee', 'orange');
        }
      } catch (e) {
        logger(`\u83b7\u53d6\u9009\u9879\u4fe1\u606f\u65f6\u51fa\u9519: ${e.message}`, 'red');
      }
    }


    let systemPrompt = "\u4f60\u662f\u4e00\u4e2a\u4e13\u4e1a\u7684\u7b54\u9898\u52a9\u624b。";
    if (typeName) {
      systemPrompt += `\u8fd9\u662f\u4e00\u9053${typeName}，\u8bf7\u7ed9\u51fa\u51c6\u786e\u7b54\u6848。`;


      if (typeName.includes("\u5355\u9009\u9898")) {
        systemPrompt += "\u8bf7\u76f4\u63a5\u7ed9\u51fa\u6b63\u786e\u9009\u9879\u7684\u5b8c\u6574\u5185\u5bb9，\u4e0d\u8981\u8fd4\u56de\u9009\u9879\u5b57\u6bcd（\u5982A/B/C/D）。\u5982\u679c\u9898\u76ee\u5305\u542b\u9009\u9879，\u8bf7\u4ece\u7ed9\u51fa\u7684\u9009\u9879\u4e2d\u9009\u62e9\u6b63\u786e\u7b54\u6848。";
      } else if (typeName.includes("\u591a\u9009\u9898")) {
        systemPrompt += "\u8bf7\u76f4\u63a5\u7ed9\u51fa\u6240\u6709\u6b63\u786e\u9009\u9879\u7684\u5b8c\u6574\u5185\u5bb9，\u7528###\u5206\u9694，\u4e0d\u8981\u8fd4\u56de\u9009\u9879\u5b57\u6bcd。\u5982\u679c\u9898\u76ee\u5305\u542b\u9009\u9879，\u8bf7\u4ece\u7ed9\u51fa\u7684\u9009\u9879\u4e2d\u9009\u62e9\u6b63\u786e\u7b54\u6848。";
      } else if (typeName.includes("\u5224\u65ad\u9898")) {
        systemPrompt += "\u8bf7\u76f4\u63a5\u56de\u7b54'\u6b63\u786e'\u6216'\u9519\u8bef'。";
      } else if (typeName.includes("\u586b\u7a7a\u9898")) {
        systemPrompt += "\u8bf7\u76f4\u63a5\u7ed9\u51fa\u586b\u7a7a\u5185\u5bb9，\u65e0\u9700\u989d\u5916\u8bf4\u660e。";
      }
    }




    let requestTimedOut = false;
    const timeoutId = setTimeout(() => {
      requestTimedOut = true;
      logger('AI\u8bf7\u6c42\u8d85\u65f6，\u672a\u6536\u5230\u54cd\u5e94', 'red');


      if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {
        logger('\u8f6c\u4e3a\u4f7f\u7528\u968f\u673a\u7b54\u9898...', 'orange');
        const randomAnswer = getRandomAnswer(typeName);
        resolve(randomAnswer);
      } else {
        reject('\u8bf7\u6c42\u8d85\u65f6，\u672a\u6536\u5230\u54cd\u5e94');
      }
    }, 130000);

    try {
      GM_xmlhttpRequest({
        method: 'POST',
        url: API_BASE_URL + '?act=aimodel',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + userKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `key=${encodeURIComponent(userKey)}&model=${encodeURIComponent(model)}&question=${encodeURIComponent(processedQuestion)}`,
        timeout: 120000,
        onload: function (response) {
          clearTimeout(timeoutId);
          if (requestTimedOut) return;

          try {


            if (!response.responseText) {

              resolve("");
              return;
            }


            const result = JSON.parse(response.responseText);


            if (response.status === 200) {

              if (result.code === 1001) {
                logger('AI\u56de\u7b54\u5931\u8d25: ' + result.msg + '，\u7ee7\u7eed\u5904\u7406', 'orange');

                resolve("");
                return;
              }


              if (result.code === 1 && result.data) {
                const answer = result.data;




                if (!answer.trim() || answer.trim() === '\u65e0\u6cd5\u56de\u7b54' || answer.trim() === '\u6211\u4e0d\u77e5\u9053') {
                  logger('AI\u56de\u7b54\u5185\u5bb9\u4e3a\u7a7a\u6216\u65e0\u610f\u4e49，\u76f4\u63a5\u8fd4\u56de\u539f\u59cb\u56de\u7b54', 'orange');
                  resolve(answer.trim());
                  return;
                }


                let processedAnswer = answer;
                let answerExtracted = false;


                if (typeName && (typeName.includes("\u5355\u9009\u9898") || typeName.includes("\u591a\u9009\u9898"))) {

                  if (/^[A-D]$/i.test(answer.trim())) {

                    logger('\u8b66\u544a：AI\u8fd4\u56de\u4e86\u9009\u9879\u5b57\u6bcd\u800c\u4e0d\u662f\u9009\u9879\u5185\u5bb9: ' + answer, 'orange');
                  }


                  if (answer.length > 100) {

                    const shortAnswer = answer.split(/[。.;；\n\r]/)[0].trim();
                    if (shortAnswer && shortAnswer.length < 100) {
                      processedAnswer = shortAnswer;
                      logger('\u63d0\u53d6\u7b80\u77ed\u7b54\u6848: ' + processedAnswer, 'orange');
                      answerExtracted = true;
                    }
                  } else {

                    processedAnswer = answer.trim();
                    answerExtracted = true;
                    logger('\u4f7f\u7528AI\u8fd4\u56de\u7684\u5b8c\u6574\u9009\u9879\u5185\u5bb9: ' + processedAnswer, '#10b981');
                  }
                }

                else if (typeName && typeName.includes("\u5224\u65ad\u9898")) {
                  if (answer.includes("\u6b63\u786e") || /^(\u5bf9|\u662f|√|T|ri|true|yes)$/i.test(answer.trim())) {
                    processedAnswer = "\u6b63\u786e";


                    answerExtracted = true;
                  } else if (answer.includes("\u9519\u8bef") || /^(\u9519|\u5426|×|F|wr|false|no)$/i.test(answer.trim())) {
                    processedAnswer = "\u9519\u8bef";


                    answerExtracted = true;
                  }
                }

                else if (typeName && typeName.includes("\u586b\u7a7a\u9898")) {

                  if (answer.includes('\u7b54\u6848：') || answer.includes('\u7b54\u6848:')) {
                    const parts = answer.split(/\u7b54\u6848[:：]/);
                    if (parts.length > 1) {
                      processedAnswer = parts[1].trim();

                      const lines = processedAnswer.split(/[\n\r]+/);
                      processedAnswer = lines[0].trim();


                      answerExtracted = true;
                    }
                  }


                  processedAnswer = processedAnswer.replace(/^['"\[\(（【]|['"\]\)）】]$/g, '');
                  answerExtracted = true;
                }

                else if (typeName && (typeName.includes("\u7b80\u7b54\u9898") || typeName.includes("\u8bba\u8ff0\u9898") || typeName.includes("\u5206\u6790\u9898"))) {

                  processedAnswer = answer;


                  processedAnswer = processedAnswer.replace(/\*\*([^*]+)\*\*/g, '$1');
                  processedAnswer = processedAnswer.replace(/^\d+\.\s*/gm, '');
                  processedAnswer = processedAnswer.replace(/^[•·]\s*/gm, '');
                  processedAnswer = processedAnswer.replace(/^[-*]\s*/gm, '');
                  processedAnswer = processedAnswer.replace(/\u7b54\u6848[:：]\s*/g, '');
                  processedAnswer = processedAnswer.replace(/^[A-D][\.\:：]\s*/gm, '');


                  const lines = processedAnswer.split(/[\n\r]+/).filter(line => line.trim());
                  if (lines.length > 1) {
                    processedAnswer = lines.map(line => line.trim()).join('。');

                    if (!processedAnswer.endsWith('。') && !processedAnswer.endsWith('.')) {
                      processedAnswer += '。';
                    }
                  }


                  processedAnswer = processedAnswer.replace(/\s+/g, ' ').trim();
                  processedAnswer = processedAnswer.replace(/。+/g, '。');


                  answerExtracted = true;
                }


                answerExtracted = true;

                logger('\u6700\u7ec8\u5904\u7406\u540e\u7684AI\u7b54\u6848: ' + processedAnswer, 'green');
                resolve(processedAnswer);
              } else {

                logger('AI\u54cd\u5e94\u683c\u5f0f\u4e0d\u6b63\u786e\u6216\u7b54\u6848\u4e3a\u7a7a，\u8fd4\u56de\u7a7a\u5b57\u7b26\u4e32', 'orange');

                resolve("");
              }
            } else {
              logger('AI\u8bf7\u6c42\u8fd4\u56de\u975e200\u72b6\u6001\u7801: ' + response.status + '，\u8fd4\u56de\u7a7a\u5b57\u7b26\u4e32', 'orange');

              resolve("");
            }
          } catch (e) {
            logger('\u5904\u7406AI\u54cd\u5e94\u65f6\u51fa\u9519: ' + e.message + '，\u8fd4\u56de\u7a7a\u5b57\u7b26\u4e32', 'orange');

            resolve("");
          }
        },
        onerror: function (error) {
          clearTimeout(timeoutId);
          if (requestTimedOut) return;

          logger('AI\u8bf7\u6c42\u53d1\u9001\u5931\u8d25: ' + (error.statusText || error), 'red');


          if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {
            logger('\u8bf7\u6c42\u5931\u8d25，\u8f6c\u4e3a\u4f7f\u7528\u968f\u673a\u7b54\u9898...', 'orange');
            const randomAnswer = getRandomAnswer(typeName);
            resolve(randomAnswer);
          } else {

            logger(`\u8bf7\u6c42\u53d1\u9001\u5931\u8d25，\u8fd4\u56de\u7a7a\u5b57\u7b26\u4e32`, 'orange');
            resolve("");
          }
        },
        ontimeout: function () {
          clearTimeout(timeoutId);
          if (requestTimedOut) return;

          logger('AI\u8bf7\u6c42\u8d85\u65f6', 'red');


          if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {
            logger('\u8bf7\u6c42\u8d85\u65f6，\u8f6c\u4e3a\u4f7f\u7528\u968f\u673a\u7b54\u9898...', 'orange');
            const randomAnswer = getRandomAnswer(typeName);
            resolve(randomAnswer);
          } else {

            const defaultAnswer = '6666';
            logger(`\u8bf7\u6c42\u8d85\u65f6，\u4f7f\u7528\u9ed8\u8ba4\u7b54\u6848: ${defaultAnswer}`, 'orange');
            resolve(defaultAnswer);
          }
        }
      });
    } catch (e) {
      clearTimeout(timeoutId);
      logger('\u53d1\u9001AI\u8bf7\u6c42\u65f6\u51fa\u9519: ' + e.message, 'red');


      if (localStorage.getItem('GPTJsSetting.randomAnswer') === 'true') {
        logger('\u5f02\u5e38\u9519\u8bef，\u8f6c\u4e3a\u4f7f\u7528\u968f\u673a\u7b54\u9898...', 'orange');
        const randomAnswer = getRandomAnswer(typeName);
        resolve(randomAnswer);
      } else {

        const defaultAnswer = '6666';
        logger(`\u53d1\u9001\u8bf7\u6c42\u5931\u8d25，\u4f7f\u7528\u9ed8\u8ba4\u7b54\u6848: ${defaultAnswer}`, 'orange');
        resolve(defaultAnswer);
      }
    }
  });
}

/**
 * \u751f\u6210\u968f\u673a\u7b54\u6848
 * @param {string} typeName - \u9898\u76ee\u7c7b\u578b
 * @returns {string} - \u751f\u6210\u7684\u968f\u673a\u7b54\u6848
 */
function getRandomAnswer(typeName) {
  logger('\u51c6\u5907\u4f7f\u7528\u968f\u673a\u7b54\u9898\u529f\u80fd...', 'orange');


  if (!typeName) {
    typeName = '\u672a\u77e5\u9898\u578b';
    logger('\u9898\u578b\u672a\u77e5，\u9ed8\u8ba4\u4f7f\u7528\u5355\u9009\u9898\u968f\u673a\u7b54\u6848', 'orange');
  }

  let randomAnswer = '';


  if (typeName.includes('\u5355\u9009\u9898')) {

    const options = ['A', 'B', 'C', 'D'];
    randomAnswer = options[Math.floor(Math.random() * options.length)];
    logger('\u968f\u673a\u751f\u6210\u5355\u9009\u9898\u7b54\u6848: ' + randomAnswer, '#E6A23C');
  } else if (typeName.includes('\u591a\u9009\u9898')) {

    const options = ['A', 'B', 'C', 'D'];
    const numChoices = Math.floor(Math.random() * 3) + 1;

    const shuffled = [...options].sort(() => 0.5 - Math.random());

    randomAnswer = shuffled.slice(0, numChoices).sort().join('');
    logger('\u968f\u673a\u751f\u6210\u591a\u9009\u9898\u7b54\u6848: ' + randomAnswer, '#E6A23C');
  } else if (typeName.includes('\u5224\u65ad\u9898')) {

    randomAnswer = Math.random() > 0.5 ? '\u6b63\u786e' : '\u9519\u8bef';
    logger('\u968f\u673a\u751f\u6210\u5224\u65ad\u9898\u7b54\u6848: ' + randomAnswer, '#E6A23C');
  } else if (typeName.includes('\u586b\u7a7a\u9898')) {

    randomAnswer = '6666';
    logger('\u4e3a\u586b\u7a7a\u9898\u8bbe\u7f6e\u9ed8\u8ba4\u7b54\u6848: ' + randomAnswer, '#E6A23C');
  } else if (typeName.includes('\u7b80\u7b54\u9898') || typeName.includes('\u8bba\u8ff0\u9898') || typeName.includes('\u5206\u6790\u9898') || typeName.includes('\u5199\u4f5c\u9898')) {

    randomAnswer = '6666';
    logger('\u4e3a\u7b80\u7b54\u9898\u8bbe\u7f6e\u9ed8\u8ba4\u7b54\u6848: ' + randomAnswer, '#E6A23C');
  } else {

    randomAnswer = '6666';
    logger('\u4e3a\u672a\u77e5\u9898\u578b\u8bbe\u7f6e\u9ed8\u8ba4\u7b54\u6848: ' + randomAnswer, '#E6A23C');
  }


  showDesktopNotification('\u968f\u673a\u7b54\u9898', `\u9898\u578b: ${typeName}\n\u968f\u673a\u7b54\u6848: ${randomAnswer}`, '');

  return randomAnswer;
}

/**
 * \u5904\u7406/mooc-ans/mooc2/work/view\u9875\u9762\u7684\u7b54\u9898\u529f\u80fd
 * \u9002\u914d\u4f5c\u4e1a\u7f51\u9875\u7684DOM\u7ed3\u6784
 */
function doWorkView() {
  logger('\u5f00\u59cb\u5904\u7406\u4f5c\u4e1a\u9875\u9762\u7b54\u9898', 'green');


  logger('\u7b49\u5f85\u4f5c\u4e1a\u6846\u67b6\u52a0\u8f7d...', 'blue');


  const currentUrl = window.location.href;
  logger(`\u5f53\u524d\u9875\u9762URL: ${currentUrl}`, 'blue');


  const isPlatform5500 = currentUrl.includes('5500') ||
    document.body.innerHTML.includes('5500') ||
    document.body.innerHTML.includes('platform=5500');

  if (isPlatform5500) {
    logger('\u68c0\u6d4b\u5230\u5e73\u53f0ID:5500\u7684\u4f5c\u4e1a\u9875\u9762，\u4f7f\u7528\u7279\u6b8a\u5904\u7406', 'orange');
  }


  const neBox = document.getElementById('ne-21box');
  const shouldHideBox = localStorage.getItem('GPTJsSetting.showBox') === 'hide';

  if (!neBox || (neBox.style.display === 'none' && !shouldHideBox)) {

    logger('\u5c1d\u8bd5\u6fc0\u6d3bAI\u7b54\u9898\u6846\u67b6...', 'orange');
    try {

      const aiButtons = document.querySelectorAll('button');
      let aiButton = null;
      for (const btn of aiButtons) {
        if (btn.innerText && (
          btn.innerText.includes('AI\u7b54\u9898') ||
          btn.innerText.includes('\u667a\u80fd\u7b54\u9898') ||
          btn.innerText.includes('\u667a\u80fd\u89e3\u6790') ||
          btn.innerText.includes('\u8f85\u52a9\u89e3\u7b54')
        )) {
          aiButton = btn;
          break;
        }
      }

      if (aiButton) {
        logger('\u627e\u5230AI\u7b54\u9898\u6309\u94ae，\u70b9\u51fb\u6fc0\u6d3b\u6846\u67b6...', 'green');
        aiButton.click();

        setTimeout(doWorkView, 2000);
        return;
      } else {
        logger('\u672a\u627e\u5230AI\u7b54\u9898\u6309\u94ae，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u5f0f\u6fc0\u6d3b\u6846\u67b6', 'orange');


        const possibleAiElements = [
          ...document.querySelectorAll('[class*="ai"]'),
          ...document.querySelectorAll('[id*="ai"]'),
          ...document.querySelectorAll('[class*="assistant"]'),
          ...document.querySelectorAll('[id*="assistant"]'),
          ...document.querySelectorAll('[class*="help"]'),
          ...document.querySelectorAll('[id*="help"]')
        ];

        for (const element of possibleAiElements) {
          if (element.tagName === 'BUTTON' ||
            element.tagName === 'A' ||
            element.tagName === 'DIV' ||
            element.tagName === 'SPAN') {
            logger(`\u5c1d\u8bd5\u70b9\u51fb\u53ef\u80fd\u7684AI\u5165\u53e3: ${element.tagName}`, 'orange');
            try {
              element.click();
              setTimeout(() => {
                const neBox = document.getElementById('ne-21box');
                const shouldHideBox = localStorage.getItem('GPTJsSetting.showBox') === 'hide';
                if (neBox && (neBox.style.display !== 'none' || shouldHideBox)) {
                  logger('\u6210\u529f\u6fc0\u6d3bAI\u7b54\u9898\u6846\u67b6', 'green');
                  setTimeout(doWorkView, 1000);
                  return;
                }
              }, 500);
            } catch (e) {

            }
          }
        }
      }
    } catch (e) {
      logger(`\u5c1d\u8bd5\u6fc0\u6d3bAI\u7b54\u9898\u6846\u67b6\u5931\u8d25: ${e.message}`, 'red');
    }
  }


  if ($('.mark_cont').length === 0 && $('.mark_table').length === 0) {

    logger('\u9875\u9762\u5143\u7d20\u5c1a\u672a\u52a0\u8f7d\u5b8c\u6210，\u7b49\u5f85\u91cd\u8bd5...', 'orange')
    setTimeout(doWorkView, 1000)
    return
  }


  let $_homeworktable = $('.mark_cont')
  if ($_homeworktable.length === 0) {
    $_homeworktable = $('.mark_table')


    if ($_homeworktable.length === 0) {
      const possibleTableSelectors = [
        '.mark_cont', '.mark_table', '.work_content',
        '.homework-content', '.workContent',
        '.homework-container', '.work-container',
        '.work-content-main', '.homework-box',
        '.work_question_list', '#work-content'
      ];

      for (const selector of possibleTableSelectors) {
        $_homeworktable = $(selector);
        if ($_homeworktable.length > 0) {
          logger(`\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230\u4f5c\u4e1a\u8868\u683c`, 'green');
          break;
        }
      }


      if ($_homeworktable.length === 0) {
        try {
          const iframes = document.querySelectorAll('iframe');
          logger(`\u5c1d\u8bd5\u5728 ${iframes.length} \u4e2aiframe\u4e2d\u67e5\u627e\u4f5c\u4e1a\u8868\u683c`, 'blue');

          for (const iframe of iframes) {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;


              for (const selector of possibleTableSelectors) {
                const iframeTable = iframeDoc.querySelector(selector);
                if (iframeTable) {
                  $_homeworktable = $(iframeTable);
                  logger(`\u5728iframe\u4e2d\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230\u4f5c\u4e1a\u8868\u683c`, 'green');
                  break;
                }
              }

              if ($_homeworktable.length > 0) break;
            } catch (e) {

              continue;
            }
          }
        } catch (e) {
          logger('\u5c1d\u8bd5\u5728iframe\u4e2d\u67e5\u627e\u4f5c\u4e1a\u8868\u683c\u5931\u8d25: ' + e.message, 'red');
        }
      }


      if ($_homeworktable.length === 0) {
        $_homeworktable = $('body');
        logger('\u672a\u627e\u5230\u4e13\u7528\u4f5c\u4e1a\u8868\u683c，\u4f7f\u7528body\u4f5c\u4e3a\u5bb9\u5668\u7ee7\u7eed\u67e5\u627e\u9898\u76ee', 'orange');
      }
    }
  }


  let TiMuList = $_homeworktable.find('.questionLi')


  if (TiMuList.length === 0) {
    const possibleQuestionSelectors = [
      '.questionLi', '.mark_item', '.mark_question',
      '.homework_question', '.work-question-item',
      '.work_question', '.question-item', '.question',
      '.mark_li', '.que-item', '.que-box',
      '.questionItem', '.question-box'
    ];

    for (const selector of possibleQuestionSelectors) {
      TiMuList = $_homeworktable.find(selector);
      if (TiMuList.length > 0) {
        logger(`\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230 ${TiMuList.length} \u9053\u9898\u76ee`, 'green');
        break;
      }
    }


    if (TiMuList.length === 0) {
      TiMuList = $_homeworktable.find('[class*="question"], [class*="mark_"], [class*="work_"]');
      if (TiMuList.length > 0) {
        logger(`\u4f7f\u7528\u901a\u914d\u9009\u62e9\u5668\u627e\u5230 ${TiMuList.length} \u4e2a\u53ef\u80fd\u7684\u9898\u76ee\u5143\u7d20`, 'orange');
      }
    }
  }


  if (TiMuList.length === 0) {
    logger('\u672a\u627e\u5230\u9898\u76ee\u5217\u8868，\u5c1d\u8bd5\u91cd\u65b0\u52a0\u8f7d\u6846\u67b6...', 'red');
    setTimeout(doWorkView, 2000);
    return;
  }

  logger(`\u6210\u529f\u627e\u5230 ${TiMuList.length} \u9053\u9898\u76ee，\u51c6\u5907\u5f00\u59cb\u7b54\u9898`, 'green');


  if ($_homeworktable.find('.Py-mian1').text().includes('\u5df2\u6279\u9605') ||
    $_homeworktable.find('.Py-mian1').text().includes('\u5f85\u6279\u9605')) {
    logger('\u672c\u4f5c\u4e1a\u5df2\u63d0\u4ea4，\u65e0\u9700\u518d\u6b21\u7b54\u9898', 'green')
    return
  }

  logger(`\u627e\u5230 ${TiMuList.length} \u9053\u9898\u76ee，\u5f00\u59cb\u81ea\u52a8\u7b54\u9898`, 'green')


  const submitBtn = $('.Btn_blue_1')
  if (submitBtn.length > 0) {
    logger('\u5df2\u627e\u5230\u63d0\u4ea4\u6309\u94ae，\u5c06\u5728\u7b54\u9898\u5b8c\u6210\u540e\u81ea\u52a8\u63d0\u4ea4', 'green')

    window._submitWorkBtn = submitBtn
  }


  if (localStorage.getItem('GPTJsSetting.autoSubmit') === 'true') {
    logger('\u5df2\u542f\u7528\u81ea\u52a8\u63d0\u4ea4\u529f\u80fd', 'green')
  }

  doWorkViewQuestion(0, TiMuList)
}

/**
 * \u9012\u5f52\u5904\u7406\u4f5c\u4e1a\u9875\u9762\u4e2d\u7684\u6bcf\u4e2a\u9898\u76ee
 * @param {number} index - \u5f53\u524d\u5904\u7406\u7684\u9898\u76ee\u7d22\u5f15
 * @param {Array} TiMuList - \u9898\u76ee\u5217\u8868
 */
function doWorkViewQuestion(index, TiMuList) {
  if (index == TiMuList.length) {
    logger('\u4f5c\u4e1a\u9898\u76ee\u5df2\u5168\u90e8\u5b8c\u6210', 'green')


    if (localStorage.getItem('GPTJsSetting.autoSave') !== 'false') {

      try {
        logger('\u6b63\u5728\u81ea\u52a8\u4fdd\u5b58\u4f5c\u4e1a\u7b54\u6848...', 'blue')


        if (safeExecutePageFunction('saveWork')) {
          logger('\u7b54\u6848\u4fdd\u5b58\u6210\u529f！', 'green')
        } else {

          const saveBtn = $('.btnGray_1:contains("\u4fdd\u5b58")') || $('button:contains("\u4fdd\u5b58")') || $('.saveBtn');
          if (saveBtn && saveBtn.length > 0) {
            saveBtn.click();
            logger('\u5df2\u70b9\u51fb\u4fdd\u5b58\u6309\u94ae', 'green')
          } else {

            const form = $('form#submitForm');
            if (form && form.length > 0) {
              logger('\u5c1d\u8bd5\u901a\u8fc7\u8868\u5355\u63d0\u4ea4\u4fdd\u5b58\u7b54\u6848...', 'blue');


              let saveUrl = form.attr('action');
              if (saveUrl) {
                saveUrl += '&pyFlag=1&ua=pc&formType=post&saveStatus=1&version=1';


                $.ajax({
                  type: form.attr('method') || 'POST',
                  url: saveUrl,
                  data: form.serialize(),
                  dataType: 'json',
                  success: function (data) {
                    if (data && data.status) {
                      logger('\u7b54\u6848\u4fdd\u5b58\u6210\u529f！', 'green');
                    } else {
                      logger('\u7b54\u6848\u4fdd\u5b58\u5931\u8d25: ' + (data ? data.msg : '\u672a\u77e5\u9519\u8bef'), 'red');
                    }
                  },
                  error: function () {
                    logger('\u7b54\u6848\u4fdd\u5b58\u8bf7\u6c42\u5931\u8d25，\u8bf7\u624b\u52a8\u4fdd\u5b58', 'red');
                  }
                });
              } else {
                logger('\u65e0\u6cd5\u83b7\u53d6\u8868\u5355\u63d0\u4ea4URL，\u8bf7\u624b\u52a8\u4fdd\u5b58', 'red');
              }
            } else {
              logger('\u672a\u627e\u5230\u4fdd\u5b58\u6309\u94ae\u6216\u8868\u5355，\u8bf7\u624b\u52a8\u4fdd\u5b58', 'red')
            }
          }
        }
      } catch (e) {
        logger('\u81ea\u52a8\u4fdd\u5b58\u5931\u8d25: ' + e.message + '，\u8bf7\u624b\u52a8\u4fdd\u5b58', 'red')
      }


      if (localStorage.getItem('GPTJsSetting.autoSubmit') === 'true') {
        logger('\u51c6\u5907\u81ea\u52a8\u63d0\u4ea4\u4f5c\u4e1a...', 'green')
        setTimeout(() => {
          try {

            let submitBtn = window._submitWorkBtn;
            if (!submitBtn || submitBtn.length === 0) {
              submitBtn = $('.Btn_blue_1');
            }
            if (!submitBtn || submitBtn.length === 0) {
              submitBtn = $('button:contains("\u63d0\u4ea4")');
            }
            if (!submitBtn || submitBtn.length === 0) {
              submitBtn = $('input[type="submit"]');
            }
            if (!submitBtn || submitBtn.length === 0) {
              submitBtn = $('button.btn-submit');
            }
            if (!submitBtn || submitBtn.length === 0) {
              submitBtn = $('.btnGray_1');
            }

            if (submitBtn && submitBtn.length > 0) {
              logger('\u627e\u5230\u63d0\u4ea4\u6309\u94ae，\u70b9\u51fb\u63d0\u4ea4...', 'green')
              submitBtn.click();


              setTimeout(() => {
                const confirmBtn = $('.bluebtn') || $('.layui-layer-btn0') || $('button:contains("\u786e\u5b9a")');
                if (confirmBtn && confirmBtn.length > 0) {
                  logger('\u70b9\u51fb\u786e\u8ba4\u63d0\u4ea4...', 'green');
                  confirmBtn.click();
                }
                logger('\u4f5c\u4e1a\u5df2\u81ea\u52a8\u63d0\u4ea4！', 'green')
              }, 1000);
            } else {
              logger('\u672a\u627e\u5230\u63d0\u4ea4\u6309\u94ae，\u8bf7\u624b\u52a8\u63d0\u4ea4', 'red');
            }
          } catch (e) {
            logger(`\u81ea\u52a8\u63d0\u4ea4\u5931\u8d25: ${e.message}，\u8bf7\u624b\u52a8\u63d0\u4ea4`, 'red');
          }
        }, 2000)
      } else {
        logger('\u5df2\u5b8c\u6210\u6240\u6709\u9898\u76ee\u5e76\u5c1d\u8bd5\u4fdd\u5b58，\u5982\u9700\u63d0\u4ea4\u8bf7\u624b\u52a8\u70b9\u51fb\u63d0\u4ea4\u6309\u94ae', 'blue')
      }
      return
    } else {
      logger('\u81ea\u52a8\u4fdd\u5b58\u5df2\u7981\u7528，\u8bf7\u624b\u52a8\u4fdd\u5b58\u7b54\u6848', 'blue')


      if (localStorage.getItem('GPTJsSetting.autoSubmit') === 'true') {
        logger('\u51c6\u5907\u81ea\u52a8\u63d0\u4ea4\u4f5c\u4e1a...', 'green')
        setTimeout(() => {
          try {

            let submitBtn = window._submitWorkBtn;
            if (!submitBtn || submitBtn.length === 0) {
              submitBtn = $('.Btn_blue_1');
            }
            if (!submitBtn || submitBtn.length === 0) {
              submitBtn = $('button:contains("\u63d0\u4ea4")');
            }
            if (!submitBtn || submitBtn.length === 0) {
              submitBtn = $('input[type="submit"]');
            }
            if (!submitBtn || submitBtn.length === 0) {
              submitBtn = $('button.btn-submit');
            }
            if (!submitBtn || submitBtn.length === 0) {
              submitBtn = $('.btnGray_1');
            }

            if (submitBtn && submitBtn.length > 0) {
              logger('\u627e\u5230\u63d0\u4ea4\u6309\u94ae，\u70b9\u51fb\u63d0\u4ea4...', 'green')
              submitBtn.click();


              setTimeout(() => {
                const confirmBtn = $('.bluebtn') || $('.layui-layer-btn0') || $('button:contains("\u786e\u5b9a")');
                if (confirmBtn && confirmBtn.length > 0) {
                  logger('\u70b9\u51fb\u786e\u8ba4\u63d0\u4ea4...', 'green');
                  confirmBtn.click();
                }
                logger('\u4f5c\u4e1a\u5df2\u81ea\u52a8\u63d0\u4ea4！', 'green')
              }, 1000);
            } else {
              logger('\u672a\u627e\u5230\u63d0\u4ea4\u6309\u94ae，\u8bf7\u624b\u52a8\u63d0\u4ea4', 'red');
            }
          } catch (e) {
            logger(`\u81ea\u52a8\u63d0\u4ea4\u5931\u8d25: ${e.message}，\u8bf7\u624b\u52a8\u63d0\u4ea4`, 'red');
          }
        }, 2000)
      } else {
        logger('\u5df2\u5b8c\u6210\u6240\u6709\u9898\u76ee，\u8bf7\u624b\u52a8\u4fdd\u5b58\u548c\u63d0\u4ea4', 'blue')
      }
      return
    }
  }


  let typeNameElem = $(TiMuList[index]).attr('typename')
  if (!typeNameElem) {
    let typeMatch = $(TiMuList[index]).find('.mark_name').find('.colorShallow').text()
    if (typeMatch) {
      typeNameElem = typeMatch.replace(/[()（）]/g, '')
    }
  }

  let _type = ({ \u5355\u9009\u9898: 0, \u591a\u9009\u9898: 1, \u586b\u7a7a\u9898: 2, \u5224\u65ad\u9898: 3, \u7b80\u7b54\u9898: 4, \u5199\u4f5c\u9898: 5, \u7ffb\u8bd1\u9898: 6 })[typeNameElem] || 4


  let _questionFull = $(TiMuList[index]).find('.mark_name').html()


  let _question = formatQuestionText(_questionFull)


  _question = _question.replace(/^\s*[\(（【\[]?\s*(\u5355\u9009\u9898|\u591a\u9009\u9898|\u5224\u65ad\u9898|\u586b\u7a7a\u9898|\u7b80\u7b54\u9898|\u8bba\u8ff0\u9898|\u5206\u6790\u9898)[\s\.\:：,，]*[\d\.]*\u5206?[\)）\]\】]?\s*/i, '')


  _question = _question.replace(/^\s*\d+[\.\、\:：]\s*/, '')


  _question = _question.trim()

  logger(`\u6b63\u5728\u5904\u7406\u7b2c ${index + 1} \u9898: ${_question.substring(0, 30)}...`, 'blue')


  switch (_type) {
    case 0:
      handleSingleChoice(index, TiMuList, _question, _type)
      break

    case 1:
      handleMultiChoice(index, TiMuList, _question, _type)
      break

    case 2:
      handleFillBlank(index, TiMuList, _question, _type)
      break

    case 3:
      handleJudgment(index, TiMuList, _question, _type)
      break

    case 4:
    case 5:
    case 6:
      handleEssay(index, TiMuList, _question, _type)
      break

    default:
      logger(`\u6682\u4e0d\u652f\u6301\u5904\u7406\u6b64\u9898\u578b：${typeNameElem}，\u8df3\u8fc7`, 'red')
      setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time)
  }
}

/**
 * \u5904\u7406\u5355\u9009\u9898
 */
function handleSingleChoice(index, TiMuList, _question, _type) {

  let _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')


  let isWorkPage2Format = false;


  if (_answerTmpArr.length === 0) {
    _answerTmpArr = $(TiMuList[index]).find('.mark_letter').find('li')


    if (_answerTmpArr.length === 0) {
      _answerTmpArr = $(TiMuList[index]).find('.mark_letter li')
    }

    if (_answerTmpArr.length === 0) {
      _answerTmpArr = $(TiMuList[index]).find('ul.mark_letter li')
    }

    if (_answerTmpArr.length === 0) {
      _answerTmpArr = $(TiMuList[index]).find('.mark_letter > li')
    }


    if (_answerTmpArr.length === 0) {
      const answerBgElements = $(TiMuList[index]).find('.clearfix.answerBg');
      if (answerBgElements.length > 0) {
        _answerTmpArr = answerBgElements;
        isWorkPage2Format = true;
        logger('\u68c0\u6d4b\u5230\u4f5c\u4e1a\u7f51\u9875\u6e90\u4ee3\u78012\u683c\u5f0f\u7684\u9898\u76ee', 'blue');
      }
    }
  }


  if (_answerTmpArr.length === 0) {
    _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('li')
  }


  if (_answerTmpArr.length === 0) {
    _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.fl')

    if (_answerTmpArr.length === 0) {
      logger(`\u7b2c ${index + 1} \u9898\u65e0\u6cd5\u627e\u5230\u9009\u9879\u5217\u8868，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u5f0f`, 'orange')


      const possibleSelectors = [
        'ul.ulTop li',
        'ul li',
        '.mark_option li',
        '.mark_option div',
        '.mark_option > div',
        '.mark_option .option',
        '.que-answer li',
        '.que-answer .option',
        '.que-answer-content li',
        '.que-answer-options li',
        '.mark_letter .mark_letter_item',
        '.mark_cont li',
        '.clearfix.answerBg',
        '.stem_answer .clearfix',
        '.stem_answer [class*="answer"]',
        '[class*="option"]',
        '[class*="choice"]',
        '[role="radio"]'
      ];


      for (const selector of possibleSelectors) {
        _answerTmpArr = $(TiMuList[index]).find(selector);
        if (_answerTmpArr.length > 0) {
          logger(`\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230\u4e86\u9009\u9879\u5217\u8868`, 'green');
          break;
        }
      }


      if (_answerTmpArr.length === 0) {
        try {
          const iframes = document.querySelectorAll('iframe');
          for (const iframe of iframes) {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
              const iframeQuestion = $(iframeDoc).find(TiMuList[index].selector);
              if (iframeQuestion.length > 0) {
                for (const selector of possibleSelectors) {
                  _answerTmpArr = $(iframeQuestion).find(selector);
                  if (_answerTmpArr.length > 0) {
                    logger(`\u5728iframe\u4e2d\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230\u4e86\u9009\u9879\u5217\u8868`, 'green');
                    break;
                  }
                }
              }
              if (_answerTmpArr.length > 0) break;
            } catch (e) {

              continue;
            }
          }
        } catch (e) {
          logger('\u5c1d\u8bd5\u5728iframe\u4e2d\u67e5\u627e\u9009\u9879\u5931\u8d25: ' + e.message, 'red');
        }
      }
    }
  }


  if (_answerTmpArr.length === 0) {
    logger(`\u7b2c ${index + 1} \u9898\u65e0\u6cd5\u627e\u5230\u9009\u9879\u5217\u8868，\u8df3\u8fc7\u6b64\u9898`, 'red')
    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time)
    return
  }


  logger(`\u627e\u5230 ${_answerTmpArr.length} \u4e2a\u9009\u9879`, 'blue')


  let isAnswered = false;
  for (var i = 0; i < _answerTmpArr.length; i++) {

    const $option = $(_answerTmpArr[i]);
    const $parent = $option.parent();
    const $grandparent = $parent.parent();

    if (

      ($parent.find('span.check_answer').length > 0) ||
      ($parent.find('span.check_answer_dx').length > 0) ||
      ($option.find('span.check_answer').length > 0) ||
      ($option.find('span.check_answer_dx').length > 0) ||

      ($option.hasClass('chosen')) ||
      ($option.hasClass('selected')) ||
      ($option.hasClass('checked')) ||
      ($option.hasClass('active')) ||
      ($option.hasClass('on')) ||
      ($parent.hasClass('chosen')) ||
      ($parent.hasClass('selected')) ||
      ($parent.hasClass('checked')) ||
      ($parent.hasClass('active')) ||
      ($parent.hasClass('on')) ||

      ($option.attr('aria-selected') === 'true') ||
      ($option.attr('checked') === 'checked') ||
      ($option.attr('selected') === 'selected') ||
      ($option.attr('data-checked') === 'true') ||

      ($option.css('background-color') !== 'transparent' && $option.css('background-color') !== 'rgba(0, 0, 0, 0)') ||
      ($option.css('color') === 'rgb(255, 255, 255)') ||

      ($option.find('input[type="radio"]:checked').length > 0) ||
      ($parent.find('input[type="radio"]:checked').length > 0) ||
      ($grandparent.find('input[type="radio"]:checked').length > 0) ||

      ($option.find('i.icon-check').length > 0) ||
      ($option.find('[class*="check"]').length > 0) ||
      ($option.find('[class*="selected"]').length > 0) ||
      ($parent.find('i.icon-check').length > 0) ||
      ($parent.find('[class*="check"]').length > 0) ||
      ($parent.find('[class*="selected"]').length > 0)
    ) {
      logger(`\u7b2c ${index + 1} \u9898\u5df2\u4f5c\u7b54，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898`, 'green');
      isAnswered = true;
      break;
    }
  }

  if (isAnswered) {
    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, 300);
    return;
  }


  var mergedAnswers = []
  _answerTmpArr.each(function () {
    var answerText = $(this).text().replace(/[ABCD]/g, '').trim()
    mergedAnswers.push(answerText)
  })
  mergedAnswers = mergedAnswers.join("|")
  _question = "\u5355\u9009\u9898:" + _question + '\n' + mergedAnswers


  getAnswer(_type, _question).then((agrs) => {
    let _a = []
    let _optionLabels = []


    if (agrs.includes('\u672a\u627e\u5230\u7b54\u6848') || agrs === '\u6682\u65e0\u7b54\u6848' || agrs.includes('\u9519\u8bef:') || agrs.includes('\u9898\u76ee\u627e\u5230\u4f46\u7b54\u6848\u65e0\u6548') || agrs.includes('\u672a\u627e\u5230\u6709\u6548\u7b54\u6848')) {

      logger('\u9898\u5e93\u8fd4\u56de\u9519\u8bef\u4fe1\u606f，\u5c1d\u8bd5\u968f\u673a\u9009\u62e9', 'orange');

      const randomIndex = Math.floor(Math.random() * _answerTmpArr.length);
      logger(`\u968f\u673a\u9009\u62e9\u9009\u9879: ${randomIndex + 1}`, 'orange');


      setTimeout(() => {
        try {
          const $option = $(_answerTmpArr[randomIndex]);


          if (isWorkPage2Format) {

            if (typeof addChoice === 'function') {
              logger('\u5c1d\u8bd5\u76f4\u63a5\u8c03\u7528addChoice\u51fd\u6570', 'green');
              try {
                addChoice($option[0]);
                logger('addChoice\u51fd\u6570\u8c03\u7528\u6210\u529f', 'green');


                const questionId = $option.attr('qid') || $(TiMuList[index]).attr('id') || $(TiMuList[index]).attr('data');
                if (questionId) {

                  const answerInput = $(`#answer${questionId}`);
                  if (answerInput.length > 0) {

                    let optionLabel = $option.find('.num_option').attr('data') ||
                      $option.find('.num_option').text().trim();


                    answerInput.val(optionLabel);
                    logger(`\u8bbe\u7f6e\u7b54\u6848\u8f93\u5165\u6846\u503c: ${optionLabel}`, 'green');


                    answerInput.trigger('change');
                  }


                  $option.find('.num_option').addClass('check_answer');


                  $option.attr('aria-checked', 'true');
                  $option.attr('aria-pressed', 'true');
                }
              } catch (e) {
                logger(`addChoice\u51fd\u6570\u8c03\u7528\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u6cd5`, 'red');
                $option.click();
              }
            } else {
              $option.click();
            }
          } else {
            $option.click();
          }


          setTimeout(() => {
            logger('\u51c6\u5907\u5904\u7406\u4e0b\u4e00\u9898...', 'green');
            index += 1;
            if (index < TiMuList.length) {
              doWorkViewQuestion(index, TiMuList);
            } else {
              logger('\u6240\u6709\u9898\u76ee\u5904\u7406\u5b8c\u6210', 'green');

              if (localStorage.getItem('GPTJsSetting.sub') === 'true') {
                uploadAnswer();
              }
            }
          }, 500);
        } catch (e) {
          logger(`\u70b9\u51fb\u968f\u673a\u9009\u9879\u5931\u8d25: ${e.message}，\u7ee7\u7eed\u5904\u7406\u4e0b\u4e00\u9898`, 'red');


          setTimeout(() => {
            index += 1;
            if (index < TiMuList.length) {
              doWorkViewQuestion(index, TiMuList);
            } else {
              logger('\u6240\u6709\u9898\u76ee\u5904\u7406\u5b8c\u6210', 'green');

              if (localStorage.getItem('GPTJsSetting.sub') === 'true') {
                uploadAnswer();
              }
            }
          }, 500);
        }
      }, 500);

      return;
    }


    $.each(_answerTmpArr, (i, t) => {
      const $option = $(t);
      let optionText = cleanTextContent($option.html());
      _a.push(optionText);


      let optionLabel = '';


      const $numOption = $option.find('.num_option');
      if ($numOption.length > 0) {
        optionLabel = $numOption.attr('data') || $numOption.text().trim();
      }


      if (!optionLabel) {
        const firstChar = $option.text().trim().charAt(0);
        if (/[A-D]/i.test(firstChar)) {
          optionLabel = firstChar.toUpperCase();
        }
      }


      if (!optionLabel) {
        optionLabel = String.fromCharCode(65 + i);
      }

      _optionLabels.push(optionLabel);
    });


    logger(`\u83b7\u53d6\u5230\u7b54\u6848: ${agrs}`, 'blue')
    logger(`\u6700\u7ec8\u5904\u7406\u540e\u7684AI\u7b54\u6848: ${agrs}`, 'blue')
    logger(`\u9009\u9879\u5217\u8868: ${_a.join(' | ')}`, 'blue')
    logger(`\u9009\u9879\u6807\u7b7e: ${_optionLabels.join(', ')}`, 'blue')


    if (!agrs || agrs.trim() === '' || agrs.includes('\u672a\u627e\u5230\u7b54\u6848') || agrs === '\u6682\u65e0\u7b54\u6848' || agrs.includes('\u9519\u8bef:') || agrs.includes('\u9898\u76ee\u627e\u5230\u4f46\u7b54\u6848\u65e0\u6548') || agrs.includes('\u672a\u627e\u5230\u6709\u6548\u7b54\u6848')) {
      logger('\u672a\u83b7\u53d6\u5230\u6709\u6548\u7b54\u6848\u6216\u9898\u5e93\u8fd4\u56de\u9519\u8bef，\u8df3\u8fc7\u6b64\u9898', 'red');
      localStorage.setItem('GPTJsSetting.sub', false);
      setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
      return;
    }




    let _i = -1;
    const directLabelMatch = agrs.trim().toUpperCase();


    if (/^[A-D]$/i.test(directLabelMatch)) {

      const upperLabel = directLabelMatch.toUpperCase();
      _i = _optionLabels.findIndex(label => label.toUpperCase() === upperLabel);
      if (_i !== -1) {
        logger(`\u7b54\u6848\u76f4\u63a5\u5339\u914d\u9009\u9879\u6807\u7b7e: ${upperLabel}`, 'green');
      }
    }


    if (_i === -1) {
      _i = _a.findIndex((item) => {

        const cleanOption = item.replace(/\s+/g, '').toLowerCase();
        const cleanAnswer = agrs.replace(/\s+/g, '').toLowerCase();
        return cleanOption === cleanAnswer || cleanOption.includes(cleanAnswer) || cleanAnswer.includes(cleanOption);
      });

      if (_i !== -1) {
        logger(`\u7b54\u6848\u5185\u5bb9\u5339\u914d\u9009\u9879: ${_optionLabels[_i]}`, 'green');
      }
    }


    if (_i === -1) {

      const labelMatch = agrs.match(/^([A-D])$/i) ||
        agrs.match(/^\u9009\u9879\s*([A-D])$/i) ||
        agrs.match(/^\u7b54\u6848\s*[\u662f\u4e3a:：]\s*([A-D])$/i) ||
        agrs.match(/\u9009\u62e9\s*([A-D])\s*[\u9879\u9009]?/i) ||

        agrs.match(/\u6b63\u786e\u7b54\u6848[\u662f\u4e3a:：]?\s*([A-D])/i) ||
        agrs.match(/([A-D])[\u662f\u4e3a]\u6b63\u786e\u7684?/i) ||
        agrs.match(/([A-D])[\u9009\u9879]?\u6700\u5408\u9002/i) ||
        agrs.match(/\u5e94[\u8be5\u5f53]?[\u662f\u9009]([A-D])/i) ||
        agrs.match(/\u6211[\u8ba4\u89c9]\u4e3a[\u662f\u5e94\u8be5\u9009]([A-D])/i) ||
        agrs.match(/\u6211\u9009([A-D])/i) ||
        agrs.match(/\u9009\u62e9([A-D])[\u9009\u9879]?/i) ||
        agrs.match(/([A-D])(?:\.|\s|$)/i);

      if (labelMatch && labelMatch[1]) {
        const upperLabel = labelMatch[1].toUpperCase();
        _i = _optionLabels.findIndex(label => label.toUpperCase() === upperLabel);
        if (_i !== -1) {
          logger(`\u7b2c\u4e00\u5c42：\u589e\u5f3a\u5339\u914d\u5230\u9009\u9879\u6807\u7b7e ${upperLabel}`, 'green');
        }
      } else {

        const singleLetter = agrs.trim().toUpperCase();
        if (/^[A-D]$/.test(singleLetter)) {
          _i = _optionLabels.findIndex(label => label.toUpperCase() === singleLetter);
          if (_i !== -1) {
            logger(`\u7b2c\u4e00\u5c42：\u76f4\u63a5\u5339\u914d\u5230\u9009\u9879\u6807\u7b7e ${singleLetter}`, 'green');
          }
        }
      }
    }


    if (_i === -1) {
      let bestMatchIndex = -1;
      let bestMatchScore = 0;
      let bestMatchReason = '';

      _a.forEach((option, idx) => {
        const cleanOption = option.replace(/\s+/g, '').toLowerCase();
        const cleanAnswer = agrs.replace(/\s+/g, '').toLowerCase();
        let matchScore = 0;
        let matchReason = '';


        if (cleanOption.includes(cleanAnswer)) {
          matchScore = cleanAnswer.length / cleanOption.length * 0.9;
          matchReason = '\u7b54\u6848\u5b8c\u5168\u5305\u542b\u5728\u9009\u9879\u4e2d';
        }
        else if (cleanAnswer.includes(cleanOption)) {
          matchScore = cleanOption.length / cleanAnswer.length * 0.8;
          matchReason = '\u9009\u9879\u5b8c\u5168\u5305\u542b\u5728\u7b54\u6848\u4e2d';
        }


        if (matchScore < 0.7) {

          const optionKeywords = cleanOption.replace(/[.,，。、；;:：!！?？()（）\[\]【】]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 1);

          const answerKeywords = cleanAnswer.replace(/[.,，。、；;:：!！?？()（）\[\]【】]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 1);


          let keywordMatches = 0;
          let totalKeywords = Math.max(optionKeywords.length, 1);

          for (const keyword of optionKeywords) {
            for (const answerWord of answerKeywords) {
              if (keyword.includes(answerWord) || answerWord.includes(keyword) ||
                calculateSimilarity(keyword, answerWord) > 0.7) {
                keywordMatches++;
                break;
              }
            }
          }

          const keywordScore = keywordMatches / totalKeywords * 0.85;
          if (keywordScore > matchScore) {
            matchScore = keywordScore;
            matchReason = `\u5173\u952e\u8bcd\u5339\u914d\u5ea6: ${(keywordScore * 100).toFixed(1)}%`;
          }
        }


        const optionNumbers = option.match(/\d+(\.\d+)?/g);
        const answerNumbers = agrs.match(/\d+(\.\d+)?/g);

        if (optionNumbers && answerNumbers) {
          for (const optNum of optionNumbers) {
            if (answerNumbers.includes(optNum)) {
              const numberScore = 0.95;
              if (numberScore > matchScore) {
                matchScore = numberScore;
                matchReason = `\u6570\u503c\u7cbe\u786e\u5339\u914d: ${optNum}`;
              }
              break;
            }
          }
        }


        const specialChars = ['√', '×', '\u5bf9', '\u9519', '\u662f', '\u5426', 'T', 'F', '\u6b63\u786e', '\u9519\u8bef'];
        for (const char of specialChars) {
          if (cleanOption.includes(char.toLowerCase()) && cleanAnswer.includes(char.toLowerCase())) {
            const specialScore = 0.9;
            if (specialScore > matchScore) {
              matchScore = specialScore;
              matchReason = `\u7279\u6b8a\u5b57\u7b26\u5339\u914d: ${char}`;
            }
            break;
          }
        }


        if (matchScore > bestMatchScore) {
          bestMatchScore = matchScore;
          bestMatchIndex = idx;
          bestMatchReason = matchReason;
        }
      });


      if (bestMatchIndex !== -1 && bestMatchScore > 0.5) {
        logger(`\u7b2c\u4e09\u5c42C：\u5185\u5bb9\u5339\u914d\u6210\u529f，\u9009\u9879 ${_optionLabels[bestMatchIndex]}，\u539f\u56e0: ${bestMatchReason}，\u5f97\u5206: ${bestMatchScore.toFixed(2)}`, 'green');
        _i = bestMatchIndex;
      }
    }


    if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
      let timuele = $(TiMuList[index]).find('.mark_name')
      timuele.html(timuele.html() + "<p></p>" + agrs)
    }


    if (_i == -1) {
      logger('\u7cbe\u786e\u5339\u914d\u5931\u8d25，\u542f\u52a8\u4e09\u5c42\u5339\u914d\u7b56\u7565...', 'orange')


      const directLabelMatch = agrs.trim().toUpperCase();
      if (/^[A-D]$/.test(directLabelMatch)) {
        _i = _optionLabels.findIndex(label => label.toUpperCase() === directLabelMatch);
        if (_i !== -1) {
          logger(`\u7b2c\u4e00\u5c42：\u76f4\u63a5\u5339\u914d\u5230\u9009\u9879\u6807\u7b7e ${directLabelMatch}`, 'green');
        }
      }


      if (_i === -1) {
        const possibleLabel = agrs.match(/^[A-D][\.、\s:：]/i);
        if (possibleLabel) {
          const labelToFind = possibleLabel[0].charAt(0).toUpperCase();
          const labelIndex = _optionLabels.findIndex(label => label.toUpperCase() === labelToFind);

          if (labelIndex !== -1) {
            logger(`\u7b2c\u4e8c\u5c42：\u4ece\u7b54\u6848\u4e2d\u63d0\u53d6\u5230\u9009\u9879\u6807\u7b7e ${labelToFind}`, 'green');
            _i = labelIndex;
          }
        }
      }


      if (_i === -1) {

        let bestMatchIndex = -1;
        let bestMatchScore = 0;

        _a.forEach((option, idx) => {

          const similarity = calculateSimilarity(option, agrs);
          logger(`\u9009\u9879 ${_optionLabels[idx]} \u76f8\u4f3c\u5ea6: ${similarity}`, 'blue');

          if (similarity > bestMatchScore && similarity > 0.5) {
            bestMatchScore = similarity;
            bestMatchIndex = idx;
          }
        });


        if (bestMatchIndex !== -1) {
          logger(`\u7b2c\u4e09\u5c42A：\u627e\u5230\u6700\u4f73\u5339\u914d\u9009\u9879: ${_optionLabels[bestMatchIndex]}，\u76f8\u4f3c\u5ea6: ${bestMatchScore}`, 'green');
          _i = bestMatchIndex;
        }
      }


      if (_i === -1) {
        let bestMatchIndex = -1;
        let bestMatchScore = 0;

        _a.forEach((option, idx) => {

          const cleanOption = option.replace(/[.,，。、；;:：!！?？()（）\[\]【】]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
          const cleanAnswer = agrs.replace(/[.,，。、；;:：!！?？()（）\[\]【】]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();


          const optionKeywords = cleanOption.split(/\s+/).filter(word => word.length > 1);
          const answerKeywords = cleanAnswer.split(/\s+/).filter(word => word.length > 1);


          let matchCount = 0;
          let totalWeight = 0;

          for (const keyword of optionKeywords) {
            const keywordWeight = keyword.length > 3 ? 2 : 1;
            totalWeight += keywordWeight;

            for (const ak of answerKeywords) {
              if (ak.includes(keyword) || keyword.includes(ak) ||
                calculateSimilarity(ak, keyword) > 0.7) {
                matchCount += keywordWeight;
                break;
              }
            }
          }


          const matchScore = totalWeight > 0 ? matchCount / totalWeight : 0;
          logger(`\u9009\u9879 ${_optionLabels[idx]} \u5173\u952e\u8bcd\u5339\u914d\u5f97\u5206: ${matchScore.toFixed(2)}`, 'blue');


          if (matchScore > bestMatchScore && matchScore > 0.4) {
            bestMatchScore = matchScore;
            bestMatchIndex = idx;
          }
        });

        if (bestMatchIndex !== -1) {
          logger(`\u7b2c\u4e09\u5c42B：\u901a\u8fc7\u5173\u952e\u8bcd\u5339\u914d\u627e\u5230\u9009\u9879: ${_optionLabels[bestMatchIndex]}，\u5f97\u5206: ${bestMatchScore.toFixed(2)}`, 'green');
          _i = bestMatchIndex;
        }
      }


      if (_i === -1) {
        let bestMatchIndex = -1;
        let bestMatchScore = 0;
        let bestMatchReason = '';

        _a.forEach((option, idx) => {
          const cleanOption = option.replace(/\s+/g, '').toLowerCase();
          const cleanAnswer = agrs.replace(/\s+/g, '').toLowerCase();
          let matchScore = 0;
          let matchReason = '';


          if (cleanOption.includes(cleanAnswer)) {
            matchScore = cleanAnswer.length / cleanOption.length * 0.9;
            matchReason = '\u7b54\u6848\u5b8c\u5168\u5305\u542b\u5728\u9009\u9879\u4e2d';
          }
          else if (cleanAnswer.includes(cleanOption)) {
            matchScore = cleanOption.length / cleanAnswer.length * 0.8;
            matchReason = '\u9009\u9879\u5b8c\u5168\u5305\u542b\u5728\u7b54\u6848\u4e2d';
          }


          if (matchScore < 0.7) {

            const optionKeywords = cleanOption.replace(/[.,，。、；;:：!！?？()（）\[\]【】]/g, ' ')
              .split(/\s+/)
              .filter(word => word.length > 1);

            const answerKeywords = cleanAnswer.replace(/[.,，。、；;:：!！?？()（）\[\]【】]/g, ' ')
              .split(/\s+/)
              .filter(word => word.length > 1);


            let keywordMatches = 0;
            let totalKeywords = Math.max(optionKeywords.length, 1);

            for (const keyword of optionKeywords) {
              for (const answerWord of answerKeywords) {
                if (keyword.includes(answerWord) || answerWord.includes(keyword) ||
                  calculateSimilarity(keyword, answerWord) > 0.7) {
                  keywordMatches++;
                  break;
                }
              }
            }

            const keywordScore = keywordMatches / totalKeywords * 0.85;
            if (keywordScore > matchScore) {
              matchScore = keywordScore;
              matchReason = `\u5173\u952e\u8bcd\u5339\u914d\u5ea6: ${(keywordScore * 100).toFixed(1)}%`;
            }
          }


          const optionNumbers = option.match(/\d+(\.\d+)?/g);
          const answerNumbers = agrs.match(/\d+(\.\d+)?/g);

          if (optionNumbers && answerNumbers) {
            for (const optNum of optionNumbers) {
              if (answerNumbers.includes(optNum)) {
                const numberScore = 0.95;
                if (numberScore > matchScore) {
                  matchScore = numberScore;
                  matchReason = `\u6570\u503c\u7cbe\u786e\u5339\u914d: ${optNum}`;
                }
                break;
              }
            }
          }


          if (matchScore > bestMatchScore) {
            bestMatchScore = matchScore;
            bestMatchIndex = idx;
            bestMatchReason = matchReason;
          }
        });


        if (bestMatchIndex !== -1 && bestMatchScore > 0.5) {
          logger(`\u7b2c\u4e09\u5c42C：\u5185\u5bb9\u5339\u914d\u6210\u529f，\u9009\u9879 ${_optionLabels[bestMatchIndex]}，\u539f\u56e0: ${bestMatchReason}，\u5f97\u5206: ${bestMatchScore.toFixed(2)}`, 'green');
          _i = bestMatchIndex;
        }
      }


      if (_i === -1) {

        const numericAnswer = agrs.match(/\d+(\.\d+)?/);
        if (numericAnswer) {
          const answerNum = numericAnswer[0];
          logger(`\u5c1d\u8bd5\u5339\u914d\u6570\u5b57\u7b54\u6848: ${answerNum}`, 'blue');

          _a.forEach((option, idx) => {
            const numericOption = option.match(/\d+(\.\d+)?/);
            if (numericOption && numericOption[0] === answerNum) {
              logger(`\u7b2c\u4e09\u5c42D：\u6570\u5b57\u5339\u914d\u6210\u529f，\u9009\u9879 ${_optionLabels[idx]} \u5305\u542b\u76f8\u540c\u6570\u5b57 ${answerNum}`, 'green');
              _i = idx;
              return false;
            }
          });
        }
      }


      if (_i === -1) {
        const specialChars = ['√', '×', '\u5bf9', '\u9519', '\u662f', '\u5426', 'T', 'F', '\u6b63\u786e', '\u9519\u8bef'];
        const lowerAnswer = agrs.toLowerCase();

        for (const char of specialChars) {
          if (lowerAnswer.includes(char.toLowerCase())) {
            _a.forEach((option, idx) => {
              if (option.toLowerCase().includes(char.toLowerCase())) {
                logger(`\u7b2c\u4e09\u5c42E：\u7279\u6b8a\u5b57\u7b26\u5339\u914d\u6210\u529f，\u9009\u9879 ${_optionLabels[idx]} \u4e0e\u7b54\u6848\u90fd\u5305\u542b ${char}`, 'green');
                _i = idx;
                return false;
              }
            });
            if (_i !== -1) break;
          }
        }
      }


      if (_i === -1) {
        let bestMatchIndex = -1;
        let bestMatchScore = 0.3;

        _a.forEach((option, idx) => {
          const similarity = calculateSimilarity(option, agrs);
          logger(`\u9009\u9879 ${_optionLabels[idx]} \u6700\u7ec8\u76f8\u4f3c\u5ea6\u8bc4\u5206: ${similarity.toFixed(2)}`, 'blue');

          if (similarity > bestMatchScore) {
            bestMatchScore = similarity;
            bestMatchIndex = idx;
          }
        });

        if (bestMatchIndex !== -1) {
          logger(`\u7b2c\u4e09\u5c42F：\u6700\u7ec8\u9009\u62e9\u6700\u9ad8\u76f8\u4f3c\u5ea6\u9009\u9879 ${_optionLabels[bestMatchIndex]}，\u76f8\u4f3c\u5ea6: ${bestMatchScore.toFixed(2)}`, 'green');
          _i = bestMatchIndex;
        }
      }


      if (_i === -1) {
        logger('\u6240\u6709\u5339\u914d\u7b56\u7565\u5747\u5931\u8d25，\u5c1d\u8bd5\u968f\u673a\u9009\u62e9\u4e00\u4e2a\u9009\u9879', 'orange');

        _i = Math.floor(Math.random() * _answerTmpArr.length);
        logger(`\u968f\u673a\u9009\u62e9\u9009\u9879: ${_i + 1}`, 'orange');
      }


      logger(`AI\u6210\u529f\u56de\u7b54，\u7ee7\u7eed\u5904\u7406,`, 'green');
      if (_i === -1) {
        logger(`AI\u65e0\u6cd5\u5b8c\u7f8e\u5339\u914d\u6b63\u786e\u7b54\u6848,\u8bf7\u624b\u52a8\u9009\u62e9，\u8df3\u8fc7\u6b64\u9898`, 'red');
        setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
        return;
      }
    }

    setTimeout(() => {
      try {

        const $option = $(_answerTmpArr[_i]);
        const $parent = $option.parent();


        const optionText = $option.text().trim();
        logger(`\u70b9\u51fb\u9009\u9879 ${_optionLabels[_i]}: ${optionText.substring(0, 20)}${optionText.length > 20 ? '...' : ''}`, 'green');


        try {

          $option[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
          logger('\u5df2\u6eda\u52a8\u5230\u9009\u9879\u4f4d\u7f6e', 'green');


          $option.css('background-color', '#f0f7ff');
          $option.css('border', '1px solid #1890ff');
        } catch (e) {
          logger(`\u6eda\u52a8\u5230\u9009\u9879\u5931\u8d25: ${e.message}`, 'orange');
        }


        const $grandparent = $parent.parent();


        let questionId = '';


        if (isWorkPage2Format) {

          questionId = $option.attr('qid') || $(TiMuList[index]).attr('id') || $(TiMuList[index]).attr('data');

          if (questionId) {
            logger(`\u68c0\u6d4b\u5230\u9898\u76eeID: ${questionId}`, 'green');

            try {

              if (typeof addChoice === 'function') {
                logger('\u5c1d\u8bd5\u76f4\u63a5\u8c03\u7528addChoice\u51fd\u6570', 'green');
                try {

                  addChoice($option[0]);
                  logger('addChoice\u51fd\u6570\u8c03\u7528\u6210\u529f', 'green');
                } catch (e) {
                  logger(`addChoice\u51fd\u6570\u8c03\u7528\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u6cd5`, 'red');
                }
              }


              const answerInput = $(`#answer${questionId}`);
              if (answerInput.length > 0) {

                let optionLabel = '';
                const qtype = $option.attr('qtype') || '0';

                if (qtype === '3') {

                  optionLabel = $option.find('.num_option').attr('data') || '';
                  logger(`\u5224\u65ad\u9898\u9009\u9879\u503c: ${optionLabel}`, 'green');
                } else {

                  optionLabel = $option.find('.num_option').attr('data') ||
                    $option.find('.num_option').text().trim() ||
                    _optionLabels[_i] ||
                    String.fromCharCode(65 + _i);
                  logger(`\u5355\u9009\u9898\u9009\u9879\u503c: ${optionLabel}`, 'green');
                }


                answerInput.val(optionLabel);
                logger(`\u8bbe\u7f6e\u7b54\u6848\u8f93\u5165\u6846\u503c: ${optionLabel}, \u9898\u578b: ${qtype || '\u672a\u77e5'}`, 'green');


                answerInput.trigger('input').trigger('change').trigger('blur');


                try {
                  const inputElement = answerInput[0];
                  if (inputElement) {
                    inputElement.value = optionLabel;

                    inputElement.defaultValue = optionLabel;

                    inputElement.setAttribute('value', optionLabel);

                    const event = new Event('change', { bubbles: true });
                    inputElement.dispatchEvent(event);
                    logger('\u4f7f\u7528\u539f\u751fDOM\u65b9\u6cd5\u8bbe\u7f6e\u503c\u6210\u529f', 'green');
                  }
                } catch (e) {
                  logger(`\u4f7f\u7528\u539f\u751fDOM\u65b9\u6cd5\u8bbe\u7f6e\u503c\u5931\u8d25: ${e.message}`, 'orange');
                }


                $option.find('.num_option').addClass('check_answer');
              }


              const optionClass = `choice${questionId}`;
              $(`.${optionClass}`).removeClass('on check_answer');
              const $numOption = $option.find(`.${optionClass}`);
              if ($numOption.length > 0) {
                $numOption.addClass('on check_answer');
                logger(`\u4e3a\u9009\u9879\u6dfb\u52a0\u9009\u4e2d\u6837\u5f0f: ${optionClass}`, 'green');
              } else {

                const $anyNumOption = $option.find('.num_option');
                if ($anyNumOption.length > 0) {
                  $anyNumOption.addClass('on check_answer');
                  logger(`\u4e3a\u9009\u9879\u6dfb\u52a0\u9009\u4e2d\u6837\u5f0f: .num_option`, 'green');
                }
              }


              $option.attr('aria-checked', 'true');
              $option.attr('aria-pressed', 'true');


              const onclickAttr = $option.attr('onclick');
              if (onclickAttr && onclickAttr.includes('addChoice')) {
                logger('\u5c1d\u8bd5\u76f4\u63a5\u6267\u884conclick\u5c5e\u6027\u4e2d\u7684\u51fd\u6570', 'green');
                try {


                  try {
                    eval(`(function() { ${onclickAttr} }).call($option[0])`);
                    logger('\u901a\u8fc7eval\u6267\u884conclick\u6210\u529f', 'green');
                  } catch (e) {
                    logger(`eval\u6267\u884conclick\u5931\u8d25: ${e.message}`, 'red');
                  }


                  try {
                    const clickFunc = new Function('this.addChoice(this)');
                    clickFunc.call($option[0]);
                    logger('\u901a\u8fc7Function\u6784\u9020\u51fd\u6570\u6267\u884c\u6210\u529f', 'green');
                  } catch (e) {
                    logger(`Function\u6784\u9020\u51fd\u6570\u6267\u884c\u5931\u8d25: ${e.message}`, 'red');
                  }


                  try {
                    if (typeof window.addChoice === 'function') {
                      window.addChoice($option[0]);
                      logger('\u901a\u8fc7window.addChoice\u8c03\u7528\u6210\u529f', 'green');
                    }
                  } catch (e) {
                    logger(`window.addChoice\u8c03\u7528\u5931\u8d25: ${e.message}`, 'red');
                  }
                } catch (e) {
                  logger(`\u6240\u6709onclick\u6267\u884c\u65b9\u6cd5\u5747\u5931\u8d25: ${e.message}`, 'red');
                }
              }


              logger('\u6a21\u62df\u70b9\u51fb\u4e8b\u4ef6\u5e8f\u5217', 'green');
              ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                const event = new MouseEvent(eventType, {
                  bubbles: true,
                  cancelable: true,
                  view: window
                });
                $option[0].dispatchEvent(event);
              });


              $option.trigger('mousedown').trigger('mouseup').trigger('click');


              $option.attr('aria-checked', 'true');
              $option.attr('aria-pressed', 'true');


              try {

                const rect = $option[0].getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;


                const mouseEvents = [
                  new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window, clientX: centerX, clientY: centerY }),
                  new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, clientX: centerX, clientY: centerY }),
                  new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, clientX: centerX, clientY: centerY }),
                  new MouseEvent('click', { bubbles: true, cancelable: true, view: window, clientX: centerX, clientY: centerY })
                ];

                mouseEvents.forEach(event => $option[0].dispatchEvent(event));
                logger('\u6a21\u62df\u7528\u6237\u70b9\u51fb\u884c\u4e3a\u5b8c\u6210', 'green');
              } catch (e) {
                logger(`\u6a21\u62df\u7528\u6237\u70b9\u51fb\u884c\u4e3a\u5931\u8d25: ${e.message}`, 'red');
              }

              logger('\u5df2\u5c1d\u8bd5\u591a\u79cd\u65b9\u6cd5\u9009\u4e2d\u7b54\u6848', 'green');


              setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
              return;
            } catch (e) {
              logger(`\u5904\u7406\u4f5c\u4e1a\u7f51\u9875\u6e90\u4ee3\u78012\u683c\u5f0f\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u6cd5`, 'red');
            }
          }
        }


        const $radio = $option.find('input[type="radio"]');
        const $checkbox = $option.find('input[type="checkbox"]');


        if ($radio.length > 0) {
          logger(`\u627e\u5230radio\u8f93\u5165\u5143\u7d20，\u8bbe\u7f6echecked`, 'green');
          $radio.prop('checked', true);
          $radio.attr('checked', 'checked');
          $radio.trigger('change');
          $radio.click();
        } else if ($checkbox.length > 0) {
          logger(`\u627e\u5230checkbox\u8f93\u5165\u5143\u7d20，\u8bbe\u7f6echecked`, 'green');
          $checkbox.prop('checked', true);
          $checkbox.attr('checked', 'checked');
          $checkbox.trigger('change');
          $checkbox.click();
        }


        if (typeof addChoice === 'function') {
          try {
            logger('\u68c0\u6d4b\u5230addChoice\u51fd\u6570，\u5c1d\u8bd5\u76f4\u63a5\u8c03\u7528', 'green');

            addChoice($option[0]);


            const questionId = $option.attr('qid') || $(TiMuList[index]).attr('id') || $(TiMuList[index]).attr('data');
            if (questionId) {

              const answerInput = $(`#answer${questionId}`);
              if (answerInput.length > 0) {

                let optionLabel = $option.find('.num_option').attr('data') ||
                  $option.find('.num_option').text().trim();


                answerInput.val(optionLabel);
                logger(`\u8bbe\u7f6e\u7b54\u6848\u8f93\u5165\u6846\u503c: ${optionLabel}`, 'green');


                answerInput.trigger('change');
              }


              $option.find('.num_option').addClass('check_answer');


              $option.attr('aria-checked', 'true');
              $option.attr('aria-pressed', 'true');
            }
          } catch (e) {
            logger(`addChoice\u51fd\u6570\u8c03\u7528\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u6cd5`, 'red');
          }
        }


        const $clickTarget = $option.find('a.check') ||
          $option.find('input[type="radio"]') ||
          $option.find('.check_answer') ||
          $option.find('[class*="check"]') ||
          $option;


        $clickTarget.click();


        setTimeout(() => {
          $option.click();
        }, 50);


        setTimeout(() => {
          $parent.click();
        }, 100);


        setTimeout(() => {
          $grandparent.click();
        }, 150);


        setTimeout(() => {

          ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            const event = new MouseEvent(eventType, {
              bubbles: true,
              cancelable: true,
              view: window
            });
            _answerTmpArr[_i].dispatchEvent(event);
          });
        }, 200);


        setTimeout(() => {
          $option.trigger('mousedown').trigger('mouseup').trigger('click');
        }, 250);


        setTimeout(() => {
          const radioBtn = $option.find('input[type="radio"]')[0];
          if (radioBtn) {
            radioBtn.checked = true;
            radioBtn.dispatchEvent(new Event('change', { bubbles: true }));
            logger('\u901a\u8fc7\u8bbe\u7f6e\u5355\u9009\u6309\u94aechecked\u5c5e\u6027\u5b8c\u6210\u9009\u62e9', 'green');
          }
        }, 300);


        setTimeout(() => {
          $option.addClass('chosen selected checked active on');
          $parent.addClass('chosen selected checked active on');
        }, 350);


        setTimeout(() => {
          const $possibleMarks = $option.find('span, i, em, b, strong, label, div');
          if ($possibleMarks.length > 0) {
            $possibleMarks.click();
          }
        }, 400);


        setTimeout(() => {

          const onclickAttr = $option.attr('onclick');
          if (onclickAttr) {
            logger(`\u68c0\u6d4b\u5230onclick\u5c5e\u6027: ${onclickAttr}`, 'green');


            if (onclickAttr.includes('addChoice')) {
              try {

                const qid = $option.attr('qid');
                const qtype = $option.attr('qtype');

                if (qid && qtype) {
                  logger(`\u627e\u5230qid=${qid}, qtype=${qtype}，\u5c1d\u8bd5\u624b\u52a8\u8bbe\u7f6e\u7b54\u6848`, 'green');


                  const answerInput = $(`#answer${qid}`);
                  if (answerInput.length > 0) {
                    const optionLabel = $option.find('.num_option').attr('data') || '';
                    answerInput.val(optionLabel);
                    logger(`\u5df2\u8bbe\u7f6e\u7b54\u6848\u8f93\u5165\u6846\u7684\u503c\u4e3a: ${optionLabel}`, 'green');
                  }
                }
              } catch (e) {
                logger(`\u5904\u7406\u7279\u6b8a\u5c5e\u6027\u5931\u8d25: ${e.message}`, 'red');
              }
            }
          }
        }, 450);


        setTimeout(() => {

          const questionId = $(TiMuList[index]).attr('id') || $(TiMuList[index]).attr('data');
          if (questionId) {
            const numericId = questionId.replace(/\D/g, '');
            if (numericId) {

              const answerInput = $(`#answer${numericId}`);
              if (answerInput.length > 0) {
                const answerType = $(`#answertype${numericId}`).val();
                if (answerType === '0') {
                  const optionLabel = _optionLabels[_i];
                  answerInput.val(optionLabel);
                  logger(`\u76f4\u63a5\u8bbe\u7f6e\u7b54\u6848\u8868\u5355\u503c: ${optionLabel}`, 'green');
                }
              }
            }
          }
        }, 450);

        logger('\u5df2\u5c1d\u8bd5\u591a\u79cd\u65b9\u5f0f\u70b9\u51fb\u9009\u9879，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green');
        setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
      } catch (e) {
        logger(`\u70b9\u51fb\u9009\u9879\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5907\u7528\u65b9\u6cd5`, 'red');

        try {

          $(_answerTmpArr[_i]).trigger('click');
          logger('\u4f7f\u7528jQuery\u89e6\u53d1\u70b9\u51fb\u6210\u529f', 'green');


          $(_answerTmpArr[_i]).addClass('chosen selected');
          $(_answerTmpArr[_i]).css('background-color', '#f0f7ff');
          $(_answerTmpArr[_i]).find('input[type="radio"]').prop('checked', true);

          logger('\u5df2\u901a\u8fc7\u591a\u79cd\u65b9\u5f0f\u5c1d\u8bd5\u9009\u4e2d\u9009\u9879', 'green');
        } catch (err) {
          logger(`\u6240\u6709\u70b9\u51fb\u65b9\u6cd5\u90fd\u5931\u8d25: ${err.message}，\u8df3\u8fc7\u6b64\u9898`, 'red');
        }

        setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
      }
    }, 300)
  }).catch((error) => {
    logger(`\u83b7\u53d6\u7b54\u6848\u5931\u8d25: ${error}，\u5c1d\u8bd5\u968f\u673a\u9009\u62e9\u5e76\u7ee7\u7eed\u5904\u7406\u4e0b\u4e00\u9898`, 'red');


    const randomIndex = Math.floor(Math.random() * _answerTmpArr.length);
    logger(`\u968f\u673a\u9009\u62e9\u9009\u9879: ${randomIndex + 1}`, 'orange');


    try {
      const $option = $(_answerTmpArr[randomIndex]);


      if (isWorkPage2Format) {

        if (typeof addChoice === 'function') {
          logger('\u5c1d\u8bd5\u76f4\u63a5\u8c03\u7528addChoice\u51fd\u6570', 'green');
          try {
            addChoice($option[0]);
            logger('addChoice\u51fd\u6570\u8c03\u7528\u6210\u529f', 'green');
          } catch (e) {
            logger(`addChoice\u51fd\u6570\u8c03\u7528\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u6cd5`, 'red');
            $option.click();
          }
        } else {
          $option.click();
        }
      } else {
        $option.click();
      }
    } catch (e) {
      logger(`\u70b9\u51fb\u968f\u673a\u9009\u9879\u5931\u8d25: ${e.message}`, 'red');
    }


    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
  })
}

/**
 * \u5904\u7406\u591a\u9009\u9898
 */
function handleMultiChoice(index, TiMuList, _question, _type) {

  let _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')


  let isWorkPage2Format = false;


  if (_answerTmpArr.length === 0) {
    _answerTmpArr = $(TiMuList[index]).find('.mark_letter').find('li')


    if (_answerTmpArr.length === 0) {
      _answerTmpArr = $(TiMuList[index]).find('.mark_letter li')
    }

    if (_answerTmpArr.length === 0) {
      _answerTmpArr = $(TiMuList[index]).find('ul.mark_letter li')
    }

    if (_answerTmpArr.length === 0) {
      _answerTmpArr = $(TiMuList[index]).find('.mark_letter > li')
    }


    if (_answerTmpArr.length === 0) {
      const answerBgElements = $(TiMuList[index]).find('.clearfix.answerBg');
      if (answerBgElements.length > 0) {
        _answerTmpArr = answerBgElements;
        isWorkPage2Format = true;
        logger('\u68c0\u6d4b\u5230\u4f5c\u4e1a\u7f51\u9875\u6e90\u4ee3\u78012\u683c\u5f0f\u7684\u591a\u9009\u9898', 'blue');
      }
    }
  }


  if (_answerTmpArr.length === 0) {
    _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('li')
  }


  if (_answerTmpArr.length === 0) {
    _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.fl')

    if (_answerTmpArr.length === 0) {
      logger(`\u7b2c ${index + 1} \u9898\u65e0\u6cd5\u627e\u5230\u9009\u9879\u5217\u8868，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u5f0f`, 'orange')


      const possibleSelectors = [
        'ul.ulTop li',
        'ul li',
        '.mark_option li',
        '.mark_option div',
        '.mark_option > div',
        '.mark_option .option',
        '.que-answer li',
        '.que-answer .option',
        '.que-answer-content li',
        '.que-answer-options li',
        '.mark_letter .mark_letter_item',
        '.mark_cont li',
        '.clearfix.answerBg',
        '.stem_answer .clearfix',
        '.stem_answer [class*="answer"]',
        '[class*="option"]',
        '[class*="choice"]',
        '[role="checkbox"]'
      ];


      for (const selector of possibleSelectors) {
        _answerTmpArr = $(TiMuList[index]).find(selector);
        if (_answerTmpArr.length > 0) {
          logger(`\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230\u4e86\u9009\u9879\u5217\u8868`, 'green');
          break;
        }
      }
    }
  }


  if (_answerTmpArr.length === 0) {
    logger(`\u7b2c ${index + 1} \u9898\u65e0\u6cd5\u627e\u5230\u9009\u9879\u5217\u8868，\u8df3\u8fc7\u6b64\u9898`, 'red')
    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time)
    return
  }


  let isAnswered = false;
  let answeredCount = 0;
  for (var i = 0; i < _answerTmpArr.length; i++) {

    const $option = $(_answerTmpArr[i]);
    const $parent = $option.parent();

    if (
      ($parent.find('span.check_answer').length > 0) ||
      ($parent.find('span.check_answer_dx').length > 0) ||
      ($option.hasClass('chosen')) ||
      ($option.hasClass('selected')) ||
      ($option.attr('aria-selected') === 'true')
    ) {
      answeredCount++;
    }
  }


  if (answeredCount > 0) {
    logger(`\u7b2c ${index + 1} \u9898\u5df2\u4f5c\u7b54(${answeredCount}\u4e2a\u9009\u9879)，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898`, 'green')
    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, 300);
    return;
  }


  var mergedAnswers = []
  _answerTmpArr.each(function () {
    var answerText = $(this).text().replace(/[ABCD]/g, '').trim()
    mergedAnswers.push(answerText)
  })
  mergedAnswers = mergedAnswers.join("|")
  _question = "\u591a\u9009\u9898:" + _question + '\n' + mergedAnswers


  getAnswer(_type, _question).then((agrs) => {

    logger(`\u83b7\u53d6\u5230\u7b54\u6848: ${agrs}`, 'blue')


    if (!agrs || agrs.trim() === '' || agrs.includes('\u672a\u627e\u5230\u7b54\u6848') || agrs === '\u6682\u65e0\u7b54\u6848' || agrs.includes('\u9519\u8bef:') || agrs.includes('\u9898\u76ee\u627e\u5230\u4f46\u7b54\u6848\u65e0\u6548') || agrs.includes('\u672a\u627e\u5230\u6709\u6548\u7b54\u6848')) {
      logger('\u672a\u83b7\u53d6\u5230\u6709\u6548\u7b54\u6848\u6216\u9898\u5e93\u8fd4\u56de\u9519\u8bef，\u8df3\u8fc7\u6b64\u9898', 'red');
      localStorage.setItem('GPTJsSetting.sub', false);
      setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
      return;
    }


    if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
      let timuele = $(TiMuList[index]).find('.mark_name')
      timuele.html(timuele.html() + "<p></p>" + agrs)
    }


    let selectedOptions = 0;
    $.each(_answerTmpArr, (i, t) => {
      const optionText = cleanTextContent($(t).html());
      const $option = $(_answerTmpArr[i]);
      const $parent = $option.parent();


      if (agrs.indexOf(optionText) !== -1) {
        selectedOptions++;
        logger(`\u5339\u914d\u9009\u9879 ${i + 1}: ${optionText}`, 'green');


        setTimeout(() => {
          try {

            if (isWorkPage2Format) {

              const questionId = $option.attr('qid');

              if (questionId) {
                logger(`\u68c0\u6d4b\u5230\u9898\u76eeID: ${questionId}`, 'green');

                try {

                  if (typeof addChoice === 'function') {
                    logger('\u5c1d\u8bd5\u76f4\u63a5\u8c03\u7528addChoice\u51fd\u6570', 'green');
                    try {

                      addChoice($option[0]);
                      logger('addChoice\u51fd\u6570\u8c03\u7528\u6210\u529f', 'green');
                    } catch (e) {
                      logger(`addChoice\u51fd\u6570\u8c03\u7528\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u6cd5`, 'red');
                    }
                  }


                  const optionLabel = $option.find('.num_option').attr('data') || '';


                  const answerInput = $(`#answer${questionId}`);
                  if (answerInput.length > 0) {

                    const currentValue = answerInput.val() || '';

                    if (!currentValue.includes(optionLabel)) {
                      const newValue = currentValue ? (currentValue + optionLabel) : optionLabel;
                      answerInput.val(newValue);
                      logger(`\u8bbe\u7f6e\u591a\u9009\u7b54\u6848\u8868\u5355\u503c: ${newValue}`, 'green');


                      answerInput.trigger('change');
                    }
                  }


                  const optionClass = `choice${questionId}`;
                  $option.find(`.${optionClass}`).addClass('on');


                  const onclickAttr = $option.attr('onclick');
                  if (onclickAttr && onclickAttr.includes('addChoice')) {
                    logger('\u5c1d\u8bd5\u76f4\u63a5\u6267\u884conclick\u5c5e\u6027\u4e2d\u7684\u51fd\u6570', 'green');
                    try {

                      const clickFunc = new Function($option[0], onclickAttr);
                      clickFunc($option[0]);
                      logger('onclick\u51fd\u6570\u6267\u884c\u6210\u529f', 'green');
                    } catch (e) {
                      logger(`onclick\u51fd\u6570\u6267\u884c\u5931\u8d25: ${e.message}`, 'red');
                    }
                  }


                  logger('\u6a21\u62df\u70b9\u51fb\u4e8b\u4ef6', 'green');
                  const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                  });
                  $option[0].dispatchEvent(clickEvent);


                  $option.click();

                  logger('\u5df2\u5c1d\u8bd5\u591a\u79cd\u65b9\u6cd5\u9009\u4e2d\u7b54\u6848', 'green');

                  return;
                } catch (e) {
                  logger(`\u5904\u7406\u4f5c\u4e1a\u7f51\u9875\u6e90\u4ee3\u78012\u683c\u5f0f\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u6cd5`, 'red');
                }
              }
            }


            if (typeof addChoice === 'function' && $option.attr('onclick') && $option.attr('onclick').includes('addChoice')) {
              try {
                logger('\u68c0\u6d4b\u5230addChoice\u51fd\u6570，\u5c1d\u8bd5\u76f4\u63a5\u8c03\u7528', 'green');
                addChoice($option[0]);
              } catch (e) {
                logger(`addChoice\u51fd\u6570\u8c03\u7528\u5931\u8d25: ${e.message}`, 'red');
              }
            }


            $option.click();


            setTimeout(() => {
              $parent.click();
            }, 50);


            setTimeout(() => {
              const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
              });
              _answerTmpArr[i].dispatchEvent(clickEvent);
            }, 100);


            setTimeout(() => {
              $option.trigger('click');
            }, 150);


            setTimeout(() => {

              const questionId = $(TiMuList[index]).attr('id') || $(TiMuList[index]).attr('data');
              const optionLabel = $option.find('.num_option').attr('data') ||
                $option.find('.num_option').text().trim() ||
                String.fromCharCode(65 + i);

              if (questionId) {
                const numericId = questionId.replace(/\D/g, '');
                if (numericId) {

                  const answerInput = $(`#answer${numericId}`);
                  if (answerInput.length > 0) {

                    const currentValue = answerInput.val() || '';

                    if (!currentValue.includes(optionLabel)) {
                      const newValue = currentValue ? (currentValue + optionLabel) : optionLabel;
                      answerInput.val(newValue);
                      logger(`\u8bbe\u7f6e\u591a\u9009\u7b54\u6848\u8868\u5355\u503c: ${newValue}`, 'green');
                    }
                  }
                }
              }
            }, 200);
          } catch (e) {
            logger(`\u70b9\u51fb\u9009\u9879 ${i + 1} \u5931\u8d25: ${e.message}`, 'red');
          }
        }, 300 + (i * 200));
      } else {

        const similarity = calculateSimilarity(optionText, agrs);
        if (similarity > 0.7) {
          selectedOptions++;
          logger(`\u6a21\u7cca\u5339\u914d\u9009\u9879 ${i + 1}: ${optionText}，\u76f8\u4f3c\u5ea6: ${similarity}`, 'green');

          setTimeout(() => {
            try {
              $option.click();
              setTimeout(() => { $parent.click(); }, 50);
            } catch (e) {
              logger(`\u70b9\u51fb\u9009\u9879 ${i + 1} \u5931\u8d25: ${e.message}`, 'red');
            }
          }, 300 + (i * 200));
        }
      }
    });

    if (selectedOptions > 0) {
      logger(`\u81ea\u52a8\u9009\u62e9\u4e86 ${selectedOptions} \u4e2a\u9009\u9879，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898`, 'green');
    } else {
      logger('\u672a\u80fd\u5339\u914d\u5230\u4efb\u4f55\u9009\u9879，\u53ef\u80fd\u9700\u8981\u624b\u52a8\u9009\u62e9', 'red');
    }


    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time + (selectedOptions * 200));
  }).catch((agrs) => {
    logger('\u83b7\u53d6\u7b54\u6848\u5931\u8d25，\u8df3\u8fc7\u6b64\u9898', 'red');
    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
  })
}

/**
 * \u5904\u7406\u586b\u7a7a\u9898
 */
function handleFillBlank(index, TiMuList, _question, _type) {
  logger(`\u5f00\u59cb\u5904\u7406\u7b2c ${index + 1} \u9898\u586b\u7a7a\u9898`, 'blue');


  const currentQuestion = $(TiMuList[index]);
  const questionId = currentQuestion.attr('id') || currentQuestion.attr('data');


  if (questionId) {
    const answerTypeInput = currentQuestion.find(`#answertype${questionId}`);
    if (answerTypeInput.length > 0) {
      const answerType = answerTypeInput.val();
      if (answerType === '2') {

        return handleWorkPageFillBlank(index, TiMuList, currentQuestion, questionId, _question, _type);
      }
    }
  }


  let _textareaList = [];


  const possibleSelectors = [

    '.stem_answer .Answer .divText .textDIV textarea',
    '.stem_answer textarea',

    '.mark_answer input[type="text"]',
    '.mark_answer textarea',
    '.mark_answer .blank',
    '.mark_answer [class*="blank"]',
    '.mark_answer [class*="fill"]',
    '.mark_answer .fillblank',
    '.mark_answer .fill_answer',

    'input[type="text"]',
    'textarea.blank',
    '.blank',
    '[class*="blank"]',
    '[class*="fill"]'
  ];


  for (const selector of possibleSelectors) {
    const elements = $(TiMuList[index]).find(selector);
    if (elements.length > 0) {
      logger(`\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230 ${elements.length} \u4e2a\u586b\u7a7a\u6846`, 'green');
      _textareaList = elements.toArray();
      break;
    }
  }


  if (_textareaList.length === 0) {
    logger('\u5728\u9898\u76ee\u5185\u672a\u627e\u5230\u586b\u7a7a\u6846，\u5c1d\u8bd5\u5728\u6574\u4e2a\u6587\u6863\u4e2d\u67e5\u627e', 'orange');


    const questionId = $(TiMuList[index]).attr('id') || '';
    const questionIndex = index + 1;

    for (const selector of possibleSelectors) {

      let elements = $(`[id*="${questionId}"] ${selector}, [id*="question${questionIndex}"] ${selector}, [id*="q${questionIndex}"] ${selector}`);


      if (elements.length === 0) {
        elements = $(selector);
      }

      if (elements.length > 0) {
        logger(`\u5728\u6587\u6863\u4e2d\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230 ${elements.length} \u4e2a\u586b\u7a7a\u6846`, 'green');
        _textareaList = elements.toArray();
        break;
      }
    }


    if (_textareaList.length === 0) {
      try {
        const iframes = document.querySelectorAll('iframe');
        logger(`\u5c1d\u8bd5\u5728 ${iframes.length} \u4e2aiframe\u4e2d\u67e5\u627e\u586b\u7a7a\u6846`, 'blue');

        for (const iframe of iframes) {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;


            for (const selector of possibleSelectors) {
              const elements = $(iframeDoc).find(selector);
              if (elements.length > 0) {
                logger(`\u5728iframe\u4e2d\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230 ${elements.length} \u4e2a\u586b\u7a7a\u6846`, 'green');
                _textareaList = elements.toArray();
                break;
              }
            }

            if (_textareaList.length > 0) break;
          } catch (e) {

            continue;
          }
        }
      } catch (e) {
        logger(`\u5728iframe\u4e2d\u67e5\u627e\u586b\u7a7a\u6846\u65f6\u51fa\u9519: ${e.message}`, 'red');
      }
    }
  }


  if (_textareaList.length === 0) {
    logger(`\u7b2c ${index + 1} \u9898\u672a\u627e\u5230\u586b\u7a7a\u6846，\u8df3\u8fc7\u6b64\u9898`, 'red');
    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
    return;
  }

  logger(`\u627e\u5230 ${_textareaList.length} \u4e2a\u586b\u7a7a\u6846`, 'green');



  for (const textarea of _textareaList) {
    const $textarea = $(textarea);
    const _id = $textarea.attr('id');


    if (_id && typeof UE !== 'undefined' && UE.getEditor && UE.getEditor(_id)) {
      const editor = UE.getEditor(_id);
      const content = editor.getContent();
      if (content && content !== '') {
        logger(`\u6e05\u7a7a\u7b2c ${index + 1} \u9898\u5df2\u6709\u5185\u5bb9，\u51c6\u5907\u91cd\u65b0\u586b\u5199`, 'orange');
        editor.setContent('');
      }
    } else if ($textarea.is('input') || $textarea.is('textarea')) {

      if ($textarea.val() && $textarea.val().trim() !== '') {
        $textarea.val('');
        $textarea.trigger('input').trigger('change');
      }
    }
  }


  _question = "\u586b\u7a7a\u9898,\u7528\"|\"\u5206\u5272\u591a\u4e2a\u7b54\u6848:" + _question;


  getAnswer(_type, _question).then((agrs) => {
    logger(`\u83b7\u53d6\u5230\u7b54\u6848: ${agrs}`, 'green');


    let _answerTmpArr = agrs.split('|');
    logger(`\u89e3\u6790\u51fa ${_answerTmpArr.length} \u4e2a\u7b54\u6848`, 'blue');


    let filledCount = 0;

    for (let i = 0; i < _textareaList.length; i++) {
      const textarea = _textareaList[i];
      const $textarea = $(textarea);
      const _currentId = $textarea.attr('id');


      const answerText = _answerTmpArr[i] || _answerTmpArr[0];

      try {

        if (_currentId && typeof UE !== 'undefined' && UE.getEditor) {
          try {
            let editor = UE.getEditor(_currentId);
            if (editor) {
              setTimeout(() => {
                try {
                  editor.setContent(answerText);
                  logger(`\u4f7f\u7528UEditor\u6210\u529f\u586b\u5199\u7b2c ${i + 1} \u4e2a\u7a7a: ${answerText}`, 'green');
                  filledCount++;
                } catch (e) {
                  logger(`\u4f7f\u7528UEditor\u586b\u5199\u7b2c ${i + 1} \u4e2a\u7a7a\u5931\u8d25: ${e.message}`, 'red');
                }
              }, 300);
              continue;
            }
          } catch (e) {
            logger(`\u4f7f\u7528UEditor\u586b\u5199\u7b2c ${i + 1} \u4e2a\u7a7a\u65f6\u51fa\u9519: ${e.message}`, 'red');
          }
        }


        if ($textarea.is('input') || $textarea.is('textarea')) {
          $textarea.val(answerText);


          $textarea.trigger('input').trigger('change');

          logger(`\u76f4\u63a5\u8bbe\u7f6e\u7b2c ${i + 1} \u4e2a\u7a7a\u7684\u503c\u6210\u529f: ${answerText}`, 'green');
          filledCount++;
        } else {

          $textarea.text(answerText);
          $textarea.attr('value', answerText);
          logger(`\u5c1d\u8bd5\u5176\u4ed6\u65b9\u6cd5\u8bbe\u7f6e\u7b2c ${i + 1} \u4e2a\u7a7a\u7684\u503c: ${answerText}`, 'orange');
          filledCount++;
        }
      } catch (e) {
        logger(`\u586b\u5199\u7b2c ${i + 1} \u4e2a\u7a7a\u65f6\u51fa\u9519: ${e.message}`, 'red');
      }
    }

    if (filledCount > 0) {
      logger(`\u6210\u529f\u586b\u5199\u4e86 ${filledCount}/${_textareaList.length} \u4e2a\u7a7a，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898`, 'green');
    } else {
      logger('\u586b\u5199\u7b54\u6848\u53ef\u80fd\u4e0d\u6210\u529f，\u4f46\u4ecd\u5c06\u7ee7\u7eed\u4e0b\u4e00\u9898', 'orange');
    }

    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
  }).catch((error) => {
    logger(`\u83b7\u53d6\u7b54\u6848\u5931\u8d25: ${error}，\u4f7f\u7528\u9ed8\u8ba4\u7b54\u6848`, 'orange');


    const defaultAnswer = '6666';
    logger(`\u4f7f\u7528\u9ed8\u8ba4\u7b54\u6848: ${defaultAnswer}`, 'orange');


    let filledCount = 0;

    for (let i = 0; i < _textareaList.length; i++) {
      const textarea = _textareaList[i];
      const $textarea = $(textarea);
      const _currentId = $textarea.attr('id');

      try {

        if (_currentId && typeof UE !== 'undefined' && UE.getEditor) {
          try {
            let editor = UE.getEditor(_currentId);
            if (editor) {
              setTimeout(() => {
                try {
                  editor.setContent(defaultAnswer);
                  logger(`\u4f7f\u7528UEditor\u6210\u529f\u586b\u5199\u7b2c ${i + 1} \u4e2a\u7a7a: ${defaultAnswer}`, 'green');
                  filledCount++;
                } catch (e) {
                  logger(`\u4f7f\u7528UEditor\u586b\u5199\u7b2c ${i + 1} \u4e2a\u7a7a\u5931\u8d25: ${e.message}`, 'red');
                }
              }, 300);
              continue;
            }
          } catch (e) {
            logger(`\u4f7f\u7528UEditor\u586b\u5199\u7b2c ${i + 1} \u4e2a\u7a7a\u65f6\u51fa\u9519: ${e.message}`, 'red');
          }
        }


        if ($textarea.is('input') || $textarea.is('textarea')) {
          $textarea.val(defaultAnswer);


          $textarea.trigger('input').trigger('change');

          logger(`\u76f4\u63a5\u8bbe\u7f6e\u7b2c ${i + 1} \u4e2a\u7a7a\u7684\u503c\u6210\u529f: ${defaultAnswer}`, 'green');
          filledCount++;
        } else {

          $textarea.text(defaultAnswer);
          $textarea.attr('value', defaultAnswer);
          logger(`\u5c1d\u8bd5\u5176\u4ed6\u65b9\u6cd5\u8bbe\u7f6e\u7b2c ${i + 1} \u4e2a\u7a7a\u7684\u503c: ${defaultAnswer}`, 'orange');
          filledCount++;
        }
      } catch (e) {
        logger(`\u586b\u5199\u7b2c ${i + 1} \u4e2a\u7a7a\u65f6\u51fa\u9519: ${e.message}`, 'red');
      }
    }

    if (filledCount > 0) {
      logger(`\u6210\u529f\u586b\u5199\u4e86 ${filledCount}/${_textareaList.length} \u4e2a\u7a7a，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898`, 'green');
    } else {
      logger('\u586b\u5199\u7b54\u6848\u53ef\u80fd\u4e0d\u6210\u529f，\u4f46\u4ecd\u5c06\u7ee7\u7eed\u4e0b\u4e00\u9898', 'orange');
    }

    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
  });
}

/**
 * \u5904\u7406\u4f5c\u4e1a\u9875\u9762\u7684\u586b\u7a7a\u9898
 * \u4e13\u95e8\u5904\u7406answertype=2\u7684\u586b\u7a7a\u9898
 */
function handleWorkPageFillBlank(index, TiMuList, currentQuestion, questionId, _question, _type) {
  logger(`\u5f00\u59cb\u5904\u7406\u4f5c\u4e1a\u9875\u9762\u7684\u586b\u7a7a\u9898，\u9898\u76eeID: ${questionId}`, 'blue');


  const tiankongSizeInput = currentQuestion.find(`input[name="tiankongsize${questionId}"]`);
  const blankCount = parseInt(tiankongSizeInput.val() || "1");
  logger(`\u586b\u7a7a\u9898\u6709 ${blankCount} \u4e2a\u7a7a`, 'blue');


  _question = "\u586b\u7a7a\u9898,\u7528\"|\"\u5206\u5272\u591a\u4e2a\u7b54\u6848:" + _question;


  getAnswer(_type, _question).then((agrs) => {
    logger(`\u83b7\u53d6\u5230\u7b54\u6848: ${agrs}`, 'green');


    if (!agrs || agrs.trim() === '' || agrs.includes('\u672a\u627e\u5230\u7b54\u6848') || agrs === '\u6682\u65e0\u7b54\u6848' || agrs.includes('\u9519\u8bef:') || agrs.includes('\u9898\u76ee\u627e\u5230\u4f46\u7b54\u6848\u65e0\u6548') || agrs.includes('\u672a\u627e\u5230\u6709\u6548\u7b54\u6848')) {
      logger('\u83b7\u53d6\u5230\u7684\u7b54\u6848\u65e0\u6548，\u4f7f\u7528\u9ed8\u8ba4\u7b54\u6848: 6666', 'orange');
      agrs = '6666';
    }


    let blankAnswers = [];


    if (agrs.includes('###')) {
      blankAnswers = agrs.split('###');
    } else if (agrs.includes('；')) {
      blankAnswers = agrs.split('；');
    } else if (agrs.includes(';')) {
      blankAnswers = agrs.split(';');
    } else if (agrs.includes('、')) {
      blankAnswers = agrs.split('、');
    } else if (agrs.includes(',')) {
      blankAnswers = agrs.split(',');
    } else if (agrs.includes('，')) {
      blankAnswers = agrs.split('，');
    } else if (agrs.includes('|')) {
      blankAnswers = agrs.split('|');
    } else {

      blankAnswers = [agrs];
    }


    blankAnswers = blankAnswers.map(ans => ans.trim()).filter(ans => ans);
    logger(`\u89e3\u6790\u51fa ${blankAnswers.length} \u4e2a\u7a7a\u7684\u7b54\u6848`, 'blue');


    let filledCount = 0;

    for (let i = 1; i <= blankCount; i++) {
      const editorId = `answerEditor${questionId}${i}`;


      const answerContent = (i <= blankAnswers.length) ?
        blankAnswers[i - 1] :
        (blankAnswers.length > 0 ? blankAnswers[0] : "");

      try {

        if (typeof UE !== 'undefined' && UE.getEditor) {
          let editor = UE.getEditor(editorId);
          if (editor) {
            setTimeout(() => {
              try {
                editor.setContent(`<p>${answerContent}</p>`);
                editor.sync();
                logger(`\u6210\u529f\u586b\u5199\u7b2c ${i} \u4e2a\u7a7a: ${answerContent}`, 'green');
                filledCount++;
              } catch (e) {
                logger(`\u586b\u5199\u7b2c ${i} \u4e2a\u7a7a\u5931\u8d25: ${e.message}`, 'red');
              }
            }, 300 * i);
          } else {

            const formField = $(`#${editorId}`);
            if (formField.length > 0) {
              formField.val(`<p>${answerContent}</p>`);
              formField.trigger('change');
              logger(`\u76f4\u63a5\u8bbe\u7f6e\u7b2c ${i} \u4e2a\u7a7a\u7684\u8868\u5355\u503c: ${answerContent}`, 'green');
              filledCount++;
            } else {
              logger(`\u672a\u627e\u5230\u7b2c ${i} \u4e2a\u7a7a\u7684\u7f16\u8f91\u5668\u6216\u8868\u5355\u5b57\u6bb5`, 'red');
            }
          }
        } else {
          logger('UEditor\u672a\u5b9a\u4e49，\u65e0\u6cd5\u586b\u5199\u7b54\u6848', 'red');
        }
      } catch (e) {
        logger(`\u5904\u7406\u7b2c ${i} \u4e2a\u7a7a\u65f6\u51fa\u9519: ${e.message}`, 'red');
      }
    }

    if (filledCount > 0) {
      logger(`\u6210\u529f\u586b\u5199\u4e86 ${filledCount}/${blankCount} \u4e2a\u7a7a，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898`, 'green');
    } else {
      logger('\u586b\u5199\u7b54\u6848\u53ef\u80fd\u4e0d\u6210\u529f，\u4f46\u4ecd\u5c06\u7ee7\u7eed\u4e0b\u4e00\u9898', 'orange');
    }

    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time + (blankCount * 300));
  }).catch((error) => {
    logger(`\u83b7\u53d6\u7b54\u6848\u5931\u8d25: ${error}，\u4f7f\u7528\u9ed8\u8ba4\u7b54\u6848`, 'orange');


    const defaultAnswer = '6666';
    logger(`\u4f7f\u7528\u9ed8\u8ba4\u7b54\u6848: ${defaultAnswer}`, 'orange');


    let filledCount = 0;

    for (let i = 1; i <= blankCount; i++) {
      const editorId = `answerEditor${questionId}${i}`;

      try {

        if (typeof UE !== 'undefined' && UE.getEditor) {
          let editor = UE.getEditor(editorId);
          if (editor) {
            setTimeout(() => {
              try {
                editor.setContent(`<p>${defaultAnswer}</p>`);
                editor.sync();
                logger(`\u6210\u529f\u586b\u5199\u7b2c ${i} \u4e2a\u7a7a: ${defaultAnswer}`, 'green');
                filledCount++;
              } catch (e) {
                logger(`\u586b\u5199\u7b2c ${i} \u4e2a\u7a7a\u5931\u8d25: ${e.message}`, 'red');
              }
            }, 300 * i);
          } else {

            const formField = $(`#${editorId}`);
            if (formField.length > 0) {
              formField.val(`<p>${defaultAnswer}</p>`);
              formField.trigger('change');
              logger(`\u76f4\u63a5\u8bbe\u7f6e\u7b2c ${i} \u4e2a\u7a7a\u7684\u8868\u5355\u503c: ${defaultAnswer}`, 'green');
              filledCount++;
            } else {
              logger(`\u672a\u627e\u5230\u7b2c ${i} \u4e2a\u7a7a\u7684\u7f16\u8f91\u5668\u6216\u8868\u5355\u5b57\u6bb5`, 'red');
            }
          }
        } else {
          logger('UEditor\u672a\u5b9a\u4e49，\u65e0\u6cd5\u586b\u5199\u7b54\u6848', 'red');
        }
      } catch (e) {
        logger(`\u5904\u7406\u7b2c ${i} \u4e2a\u7a7a\u65f6\u51fa\u9519: ${e.message}`, 'red');
      }
    }

    if (filledCount > 0) {
      logger(`\u6210\u529f\u586b\u5199\u4e86 ${filledCount}/${blankCount} \u4e2a\u7a7a，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898`, 'green');
    } else {
      logger('\u586b\u5199\u7b54\u6848\u53ef\u80fd\u4e0d\u6210\u529f，\u4f46\u4ecd\u5c06\u7ee7\u7eed\u4e0b\u4e00\u9898', 'orange');
    }

    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time + (blankCount * 300));
  });
}

/**
 * \u5904\u7406\u5224\u65ad\u9898
 */
function handleJudgment(index, TiMuList, _question, _type) {

  let _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')


  if (_answerTmpArr.length === 0) {
    _answerTmpArr = $(TiMuList[index]).find('.mark_letter').find('li')
  }


  if (_answerTmpArr.length === 0) {
    _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('li')
  }


  if (_answerTmpArr.length === 0) {

    const answerBgElements = $(TiMuList[index]).find('.clearfix.answerBg');
    if (answerBgElements.length > 0) {
      _answerTmpArr = answerBgElements;
      logger('\u68c0\u6d4b\u5230\u4f5c\u4e1a\u7f51\u9875\u6e90\u4ee3\u78012\u683c\u5f0f\u7684\u5224\u65ad\u9898', 'blue');
    } else {

      const answerBgWorkTextElements = $(TiMuList[index]).find('.clearfix.answerBg.workTextWrap');
      if (answerBgWorkTextElements.length > 0) {
        _answerTmpArr = answerBgWorkTextElements;
        logger('\u68c0\u6d4b\u5230\u4f5c\u4e1a\u7f51\u9875\u6e90\u4ee3\u78012\u683c\u5f0f\u7684\u5355\u9009\u9898\u4f5c\u4e3a\u5224\u65ad\u9898\u5904\u7406', 'blue');
      }
    }
  }


  if (_answerTmpArr.length === 0) {
    _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.fl')
    if (_answerTmpArr.length === 0) {
      logger(`\u7b2c ${index + 1} \u9898\u65e0\u6cd5\u627e\u5230\u9009\u9879\u5217\u8868，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u5f0f`, 'orange')
      _answerTmpArr = $(TiMuList[index]).find('ul.ulTop li')
      if (_answerTmpArr.length === 0) {
        _answerTmpArr = $(TiMuList[index]).find('ul li')
      }
    }
  }


  if (_answerTmpArr.length === 0) {
    logger(`\u7b2c ${index + 1} \u9898\u65e0\u6cd5\u627e\u5230\u9009\u9879\u5217\u8868，\u8df3\u8fc7\u6b64\u9898`, 'red')
    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time)
    return
  }


  let isAnswered = false;
  for (var i = 0; i < _answerTmpArr.length; i++) {

    const $option = $(_answerTmpArr[i]);
    const $parent = $option.parent();

    if (
      ($parent.find('span.check_answer').length > 0) ||
      ($parent.find('span.check_answer_dx').length > 0) ||
      ($option.hasClass('chosen')) ||
      ($option.hasClass('selected')) ||
      ($option.attr('aria-selected') === 'true')
    ) {
      logger(`\u7b2c ${index + 1} \u9898\u5df2\u4f5c\u7b54，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898`, 'green')
      isAnswered = true;
      break;
    }
  }

  if (isAnswered) {
    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, 300);
    return;
  }


  _question = "\u5224\u65ad\u9898(\u53ea\u56de\u7b54\u6b63\u786e\u6216\u9519\u8bef):" + _question
  if (_answerTmpArr.length > 0) {
    _question += '\n' + _answerTmpArr.text()
  }

  let _a = []
  $.each(_answerTmpArr, (i, t) => {
    _a.push($(t).text().trim())
  })


  getAnswer(_type, _question).then((agrs) => {
    let _true = '\u6b63\u786e|\u662f|\u5bf9|√|T|ri'
    let _false = '\u9519\u8bef|\u5426|\u9519|×|F|wr'
    let _i = -1


    if (agrs.includes('\u672a\u627e\u5230\u7b54\u6848') || agrs === '\u6682\u65e0\u7b54\u6848' || agrs.includes('\u9519\u8bef:') || agrs.includes('\u9898\u76ee\u627e\u5230\u4f46\u7b54\u6848\u65e0\u6548') || agrs.includes('\u672a\u627e\u5230\u6709\u6548\u7b54\u6848')) {

      logger('\u9898\u5e93\u8fd4\u56de\u9519\u8bef\u4fe1\u606f，\u5c1d\u8bd5\u968f\u673a\u9009\u62e9', 'orange');

      _i = Math.floor(Math.random() * _answerTmpArr.length);
      logger(`\u968f\u673a\u9009\u62e9\u9009\u9879: ${_i + 1}`, 'orange');
    } else if (_true.indexOf(agrs) != -1) {
      _i = _a.findIndex((item) => _true.indexOf(item) != -1)
      logger(`\u5339\u914d\u5230"\u6b63\u786e"\u9009\u9879`, 'green');
    } else if (_false.indexOf(agrs) != -1) {
      _i = _a.findIndex((item) => _false.indexOf(item) != -1)
      logger(`\u5339\u914d\u5230"\u9519\u8bef"\u9009\u9879`, 'green');
    } else {
      logger('\u7b54\u6848\u5339\u914d\u51fa\u9519，\u5c1d\u8bd5\u968f\u673a\u9009\u62e9', 'red')

      _i = Math.floor(Math.random() * _answerTmpArr.length);
      logger(`\u968f\u673a\u9009\u62e9\u9009\u9879: ${_i + 1}`, 'orange');
    }


    if (_i === -1) {
      logger('\u6240\u6709\u5339\u914d\u65b9\u6cd5\u5747\u5931\u8d25，\u968f\u673a\u9009\u62e9\u4e00\u4e2a\u9009\u9879', 'orange');
      _i = Math.floor(Math.random() * _answerTmpArr.length);
      logger(`\u968f\u673a\u9009\u62e9\u9009\u9879: ${_i + 1}`, 'orange');
    }

    if (_i !== -1) {
      setTimeout(() => {
        try {

          const $option = $(_answerTmpArr[_i]);
          const $parent = $option.parent();
          const $grandparent = $parent.parent();

          logger(`\u70b9\u51fb\u5224\u65ad\u9898\u9009\u9879: ${_i + 1}`, 'green');


          const questionId = $(TiMuList[index]).attr('id') || $(TiMuList[index]).attr('data');
          if (questionId) {
            logger(`\u9898\u76eeID: ${questionId}`, 'green');


            if (typeof addChoice === 'function') {
              logger('\u5c1d\u8bd5\u76f4\u63a5\u8c03\u7528addChoice\u51fd\u6570', 'green');
              try {

                addChoice($option[0]);
                logger('addChoice\u51fd\u6570\u8c03\u7528\u6210\u529f', 'green');
              } catch (e) {
                logger(`addChoice\u51fd\u6570\u8c03\u7528\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u6cd5`, 'red');
              }
            }


            const answerInput = $(`#answer${questionId}`);
            if (answerInput.length > 0) {

              let optionLabel = $option.find('.num_option').attr('data') || '';


              answerInput.val(optionLabel);
              logger(`\u8bbe\u7f6e\u7b54\u6848\u8f93\u5165\u6846\u503c: ${optionLabel}`, 'green');


              answerInput.trigger('change');


              $option.find('.num_option').addClass('check_answer');
            }


            $option.attr('aria-checked', 'true');
            $option.attr('aria-pressed', 'true');
          }


          $option.click();


          setTimeout(() => {
            $parent.click();
          }, 50);


          setTimeout(() => {
            $grandparent.click();
          }, 100);


          setTimeout(() => {

            ['mousedown', 'mouseup', 'click'].forEach(eventType => {
              const event = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window
              });
              _answerTmpArr[_i].dispatchEvent(event);
            });
          }, 150);


          setTimeout(() => {
            $option.trigger('mousedown').trigger('mouseup').trigger('click');
          }, 200);


          setTimeout(() => {
            try {

              const rect = $option[0].getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;


              const mouseEvents = [
                new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window, clientX: centerX, clientY: centerY }),
                new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, clientX: centerX, clientY: centerY }),
                new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, clientX: centerX, clientY: centerY }),
                new MouseEvent('click', { bubbles: true, cancelable: true, view: window, clientX: centerX, clientY: centerY })
              ];

              mouseEvents.forEach(event => $option[0].dispatchEvent(event));
              logger('\u6a21\u62df\u7528\u6237\u70b9\u51fb\u884c\u4e3a\u5b8c\u6210', 'green');
            } catch (e) {
              logger(`\u6a21\u62df\u7528\u6237\u70b9\u51fb\u884c\u4e3a\u5931\u8d25: ${e.message}`, 'red');
            }
          }, 250);

          logger('\u81ea\u52a8\u7b54\u9898\u6210\u529f，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898', 'green')
          setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time)
        } catch (e) {
          logger(`\u70b9\u51fb\u9009\u9879\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5907\u7528\u65b9\u6cd5`, 'red')
          try {

            $(_answerTmpArr[_i]).trigger('click');
            logger('\u4f7f\u7528jQuery\u89e6\u53d1\u70b9\u51fb\u6210\u529f', 'green')
          } catch (err) {
            logger(`\u6240\u6709\u70b9\u51fb\u65b9\u6cd5\u90fd\u5931\u8d25: ${err.message}，\u8df3\u8fc7\u6b64\u9898`, 'red')
          }
          setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time)
        }
      }, 300)
    } else {
      logger('\u65e0\u6cd5\u627e\u5230\u5339\u914d\u7684\u5224\u65ad\u9009\u9879，\u8df3\u8fc7\u6b64\u9898', 'red')
      setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time)
    }
  }).catch((error) => {
    logger(`\u83b7\u53d6\u7b54\u6848\u5931\u8d25: ${error}，\u5c1d\u8bd5\u968f\u673a\u9009\u62e9\u5e76\u7ee7\u7eed\u5904\u7406\u4e0b\u4e00\u9898`, 'red');


    const randomIndex = Math.floor(Math.random() * _answerTmpArr.length);
    logger(`\u968f\u673a\u9009\u62e9\u9009\u9879: ${randomIndex + 1}`, 'orange');


    try {
      const $option = $(_answerTmpArr[randomIndex]);


      if (typeof addChoice === 'function') {
        logger('\u5c1d\u8bd5\u76f4\u63a5\u8c03\u7528addChoice\u51fd\u6570', 'green');
        try {
          addChoice($option[0]);
          logger('addChoice\u51fd\u6570\u8c03\u7528\u6210\u529f', 'green');
        } catch (e) {
          logger(`addChoice\u51fd\u6570\u8c03\u7528\u5931\u8d25: ${e.message}，\u5c1d\u8bd5\u5176\u4ed6\u65b9\u6cd5`, 'red');
          $option.click();
        }
      } else {
        $option.click();
      }
    } catch (e) {
      logger(`\u70b9\u51fb\u968f\u673a\u9009\u9879\u5931\u8d25: ${e.message}`, 'red');
    }


    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
  })
}

/**
 * \u5904\u7406\u7b80\u7b54\u9898、\u5199\u4f5c\u9898、\u7ffb\u8bd1\u9898\u7b49\u9700\u8981\u6587\u672c\u8f93\u5165\u7684\u9898\u76ee
 */
function handleEssay(index, TiMuList, _question, _type) {
  logger(`\u5f00\u59cb\u5904\u7406\u7b2c ${index + 1} \u9898\u7b80\u7b54\u9898`, 'blue');


  let _textareaList = [];
  let editorFound = false;


  const possibleSelectors = [

    '.stem_answer .eidtDiv textarea',
    '.stem_answer textarea',

    '.mark_answer textarea',
    '.mark_answer .edui-editor',
    '.mark_answer .edui',
    '.mark_answer [class*="editor"]',
    '.mark_answer [id*="editor"]',
    '.mark_answer .answer_p textarea',
    '.mark_answer .textDIV textarea',
    '.mark_answer .textDIV',
    '.mark_answer [contenteditable="true"]',

    'textarea',
    '.edui-editor',
    '[contenteditable="true"]',
    '[class*="editor"]',
    '[id*="editor"]'
  ];


  logger(`\u5c1d\u8bd5\u67e5\u627e\u7b80\u7b54\u9898\u6587\u672c\u6846...`, 'blue');


  try {

    if (typeof UE !== 'undefined' && UE.instants) {
      const editorIds = Object.keys(UE.instants);
      if (editorIds.length > 0) {
        logger(`\u627e\u5230 ${editorIds.length} \u4e2aUEditor\u5b9e\u4f8b`, 'green');


        const currentEditorIds = [];
        for (const editorId of editorIds) {
          const editorElement = document.getElementById(editorId);
          if (editorElement) {

            const $editor = $(editorElement);
            const $question = $(TiMuList[index]);

            if ($question.find($editor).length > 0 || $question.has($editor).length > 0 ||
              $editor.parents().filter($question).length > 0) {
              currentEditorIds.push(editorId);
              logger(`\u627e\u5230\u5f53\u524d\u9898\u76ee\u7684\u7f16\u8f91\u5668: ${editorId}`, 'green');


              const textarea = document.getElementById(editorId);
              if (textarea) {
                _textareaList.push(textarea);
                editorFound = true;
              }
            }
          }
        }


        if (currentEditorIds.length === 0 && editorIds.length > 0) {
          logger(`\u672a\u627e\u5230\u5f53\u524d\u9898\u76ee\u4e13\u5c5e\u7f16\u8f91\u5668，\u4f7f\u7528\u7b2c\u4e00\u4e2a\u53ef\u7528\u7684: ${editorIds[0]}`, 'orange');
          const textarea = document.getElementById(editorIds[0]);
          if (textarea) {
            _textareaList.push(textarea);
            editorFound = true;
          }
        }
      }
    }
  } catch (e) {
    logger(`\u67e5\u627eUEditor\u5b9e\u4f8b\u65f6\u51fa\u9519: ${e.message}`, 'red');
  }


  if (!editorFound) {

    for (const selector of possibleSelectors) {
      const elements = $(TiMuList[index]).find(selector);
      if (elements.length > 0) {
        logger(`\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230 ${elements.length} \u4e2a\u6587\u672c\u6846`, 'green');
        _textareaList = elements.toArray();
        break;
      }
    }


    if (_textareaList.length === 0) {
      logger('\u5728\u9898\u76ee\u5185\u672a\u627e\u5230\u6587\u672c\u6846，\u5c1d\u8bd5\u5728\u6574\u4e2a\u6587\u6863\u4e2d\u67e5\u627e', 'orange');


      const questionId = $(TiMuList[index]).attr('id') || '';
      const questionIndex = index + 1;

      for (const selector of possibleSelectors) {

        let elements = $(`[id*="${questionId}"] ${selector}, [id*="question${questionIndex}"] ${selector}, [id*="q${questionIndex}"] ${selector}`);


        if (elements.length === 0) {
          elements = $(selector);
        }

        if (elements.length > 0) {
          logger(`\u5728\u6587\u6863\u4e2d\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230 ${elements.length} \u4e2a\u6587\u672c\u6846`, 'green');
          _textareaList = elements.toArray();
          break;
        }
      }
    }


    if (_textareaList.length === 0) {
      try {
        const iframes = document.querySelectorAll('iframe');
        logger(`\u5c1d\u8bd5\u5728 ${iframes.length} \u4e2aiframe\u4e2d\u67e5\u627e\u586b\u7a7a\u6846`, 'blue');

        for (const iframe of iframes) {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;


            for (const selector of possibleSelectors) {
              const elements = $(iframeDoc).find(selector);
              if (elements.length > 0) {
                logger(`\u5728iframe\u4e2d\u4f7f\u7528\u9009\u62e9\u5668 "${selector}" \u627e\u5230 ${elements.length} \u4e2a\u586b\u7a7a\u6846`, 'green');
                _textareaList = elements.toArray();
                break;
              }
            }

            if (_textareaList.length > 0) break;
          } catch (e) {

            continue;
          }
        }
      } catch (e) {
        logger(`\u5728iframe\u4e2d\u67e5\u627e\u586b\u7a7a\u6846\u65f6\u51fa\u9519: ${e.message}`, 'red');
      }
    }
  }


  if (_textareaList.length === 0) {
    logger(`\u7b2c ${index + 1} \u9898\u672a\u627e\u5230\u586b\u7a7a\u6846，\u8df3\u8fc7\u6b64\u9898`, 'red');
    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
    return;
  }

  logger(`\u627e\u5230 ${_textareaList.length} \u4e2a\u586b\u7a7a\u6846`, 'green');



  for (const textarea of _textareaList) {
    const $textarea = $(textarea);
    const _id = $textarea.attr('id');


    if (_id && typeof UE !== 'undefined' && UE.getEditor && UE.getEditor(_id)) {
      const editor = UE.getEditor(_id);
      const content = editor.getContent();
      if (content && content !== '') {
        logger(`\u6e05\u7a7a\u7b2c ${index + 1} \u9898\u5df2\u6709\u5185\u5bb9，\u51c6\u5907\u91cd\u65b0\u586b\u5199`, 'orange');
        editor.setContent('');
      }
    } else if ($textarea.is('input') || $textarea.is('textarea')) {

      if ($textarea.val() && $textarea.val().trim() !== '') {
        $textarea.val('');
        $textarea.trigger('input').trigger('change');
      }
    }
  }


  _question = "\u586b\u7a7a\u9898,\u7528\"|\"\u5206\u5272\u591a\u4e2a\u7b54\u6848:" + _question;


  getAnswer(_type, _question).then((agrs) => {
    logger(`\u83b7\u53d6\u5230\u7b54\u6848: ${agrs}`, 'green');


    let _answerTmpArr = agrs.split('|');
    logger(`\u89e3\u6790\u51fa ${_answerTmpArr.length} \u4e2a\u7b54\u6848`, 'blue');


    let filledCount = 0;

    for (let i = 0; i < _textareaList.length; i++) {
      const textarea = _textareaList[i];
      const $textarea = $(textarea);
      const _currentId = $textarea.attr('id');


      const answerText = _answerTmpArr[i] || _answerTmpArr[0];

      try {

        if (_currentId && typeof UE !== 'undefined' && UE.getEditor) {
          try {
            let editor = UE.getEditor(_currentId);
            if (editor) {
              setTimeout(() => {
                try {
                  editor.setContent(answerText);
                  logger(`\u4f7f\u7528UEditor\u6210\u529f\u586b\u5199\u7b2c ${i + 1} \u4e2a\u7a7a: ${answerText}`, 'green');
                  filledCount++;
                } catch (e) {
                  logger(`\u4f7f\u7528UEditor\u586b\u5199\u7b2c ${i + 1} \u4e2a\u7a7a\u5931\u8d25: ${e.message}`, 'red');
                }
              }, 300);
              continue;
            }
          } catch (e) {
            logger(`\u4f7f\u7528UEditor\u586b\u5199\u7b2c ${i + 1} \u4e2a\u7a7a\u65f6\u51fa\u9519: ${e.message}`, 'red');
          }
        }


        if ($textarea.is('input') || $textarea.is('textarea')) {
          $textarea.val(answerText);


          $textarea.trigger('input').trigger('change');

          logger(`\u76f4\u63a5\u8bbe\u7f6e\u7b2c ${i + 1} \u4e2a\u7a7a\u7684\u503c\u6210\u529f: ${answerText}`, 'green');
          filledCount++;
        } else {

          $textarea.text(answerText);
          $textarea.attr('value', answerText);
          logger(`\u5c1d\u8bd5\u5176\u4ed6\u65b9\u6cd5\u8bbe\u7f6e\u7b2c ${i + 1} \u4e2a\u7a7a\u7684\u503c: ${answerText}`, 'orange');
          filledCount++;
        }
      } catch (e) {
        logger(`\u586b\u5199\u7b2c ${i + 1} \u4e2a\u7a7a\u65f6\u51fa\u9519: ${e.message}`, 'red');
      }
    }

    if (filledCount > 0) {
      logger(`\u6210\u529f\u586b\u5199\u4e86 ${filledCount}/${_textareaList.length} \u4e2a\u7a7a，\u51c6\u5907\u5207\u6362\u4e0b\u4e00\u9898`, 'green');
    } else {
      logger('\u586b\u5199\u7b54\u6848\u53ef\u80fd\u4e0d\u6210\u529f，\u4f46\u4ecd\u5c06\u7ee7\u7eed\u4e0b\u4e00\u9898', 'orange');
    }

    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
  }).catch((error) => {
    logger(`\u83b7\u53d6\u7b54\u6848\u5931\u8d25: ${error}，\u4f46\u4ecd\u5c06\u7ee7\u7eed\u4e0b\u4e00\u9898`, 'orange');
    setTimeout(() => { doWorkViewQuestion(index + 1, TiMuList) }, setting.time);
  });
}