// ==UserScript==
// @name        Bilibili 动态页按关注分组显示当前所有直播
// @description 显示当前所有直播
// @version     1.5
// @author      XIAYUE
// @license     MIT
// @match       t.bilibili.com/*
// @icon        https://www.bilibili.com/favicon.ico
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/localforage@1.9.0/dist/localforage.min.js

// @namespace https://greasyfork.org/users/473806
// @downloadURL https://update.greasyfork.org/scripts/560700/Bilibili%20%E5%8A%A8%E6%80%81%E9%A1%B5%E6%8C%89%E5%85%B3%E6%B3%A8%E5%88%86%E7%BB%84%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E6%89%80%E6%9C%89%E7%9B%B4%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/560700/Bilibili%20%E5%8A%A8%E6%80%81%E9%A1%B5%E6%8C%89%E5%85%B3%E6%B3%A8%E5%88%86%E7%BB%84%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E6%89%80%E6%9C%89%E7%9B%B4%E6%92%AD.meta.js
// ==/UserScript==

const singerKeywords = [];
/**
 * 打开面板
 */
async function moreBtn() {
  // localforage.setItem('usersData', []);
  // 基底div
  const base = document.createElement('div');
  base.className = 'sml-base'
  base.id = 'sml-base';
  base.innerHTML = `
<style class="sml-style" id="sml-style">
  :has(.sml-mask):not(.sml-mask) {
    overflow: hidden;
  }

  .sml-mask {
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #0000007f;
    z-index: 10000;
  }

  .sml-mainbox {
    margin: auto;
    --width: 1230px;
    --height: 710px;
    width: var(--width);
    height: var(--height);
    border-radius: 4px;
    background-color: var(--bg1, #fff);
  }

  .sml-livepanel {
    height: calc(100% - 108px);
    width: 100%;
    overflow: auto;
  }

  @media screen and (max-width:1030px) {
    .sml-mainbox {
      --width: 756px;
    }
  }

  @media screen and (max-width:786px) {
    .sml-mainbox {
      --width: 512px;
    }
  }

  @media screen and (max-width:542px) {
    .sml-mainbox {
      --width: 268px;
    }
  }

  @media screen and (max-height:690px) {
    .sml-mainbox {
      --height: 590px;
    }
  }

  @media screen and (max-height:614px) {
    .sml-mainbox {
      --height: 514px;
    }
  }

  @media screen and (max-height:538px) {
    .sml-mainbox {
      --height: 438px;
    }
  }

  @media screen and (max-height:462px) {
    .sml-mainbox {
      --height: 362px;
    }
  }

  @media screen and (max-height:386px) {
    .sml-mainbox {
      --height: 286px;
    }
  }

  @media screen and (max-height:310px) {
    .sml-mainbox {
      --height: 210px;
    }
  }

  @media screen and (max-height:234px) {
    .sml-mainbox {
      --height: 134px;
    }
  }

  .sml-title {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: var(--text1, #18191c);
    border-bottom: 1px solid var(--graph_bg_thick, #e3e5e7);
  }

  .sml-titlesp2 {
    color: var(--text3, #9499a0);
    letter-spacing: 0;
    font-size: 14px;
    flex-grow: 1;
  }

  .sml-title>button {
    flex: 0;
    margin-left: 24px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    stroke: var(--text3, #9499a0);
    padding: 0;
    background: none;
    border: none;
    box-shadow: none;
    stroke: var(--text3, #9499a0);
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke-width: 1
  }

  .sml-title>button:hover {
    stroke: var(--brand_blue, #00a0d8);
  }

  .sml-tab-container {
    display: flex;
    align-items: normal;
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: var(--text1, #18191c);
    border-bottom: 1px solid var(--graph_bg_thick, #e3e5e7);
  }

  .sml-tab {
    font-size: 14px;
    padding: 0 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    border-bottom: 3px solid transparent;
    position: relative;
    user-select: none;
  }
  
  .sml-tab:hover {
    color: #495057;
    background: rgba(0, 0, 0, 0.03);
  }
  
  .sml-tab.active {
    color: #00a0d8;
    border-bottom-color: #00a0d8;
    font-weight: 600;
    font-size: 15px;
  }

  .sml-content-item {
    display: none;
    animation: fadeIn 0.5s ease;
  }
  
  .sml-content-item.active {
    display: flex;
    gap: 30px;
  }

  .sml-livecontainer {
    display: inline-flex;
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
    margin-bottom: 10px;
    margin-top: 10px;
    margin-left: 16px;
    height: 56px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    width: 224px;
  }

  .sml-a1 {
    width: 38px;
    height: 38px;
    border-radius: 22px;
    position: relative;
    margin: 1px;
    margin-right: 11px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    background-size: cover;
    background-color: var(--Ga3, #c9cdd0);
    box-shadow: 0 0 0 1px var(--brand_pink, #f69);
    -webkit-box-shadow: 0 0 0 1px var(--brand_pink, #f69);
    border: 1px solid var(--bg1, #fff);
  }

  .sml-a2 {
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: keep-all;
    max-width: 176px;
    padding-right: 16px;
    letter-spacing: 0;
  }

  .sml-upname {
    font-size: 14px;
    color: var(--text1, #18191c);
    line-height: 20px;
    max-height: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }

  .sml-upname:hover {
    color: var(--brand_blue, #00aeec);
  }

  .sml-areaname {
    font-size: 12px;
    color: var(--text3, #9499a0);
    line-height: 20px;
    max-height: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }

  .sml-livename {
    font-size: 14px;
    color: var(--text2, #64666d);
    line-height: 16px;
    word-break: break-all;
    word-break: break-word;
    text-overflow: ellipsis;
    max-height: 32px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .sml-singer .sml-livename,
  #sml-titlesp3 {
    color: #00a0d8;
  }

  .sml-word {
    word-break: break-all;
    word-break: break-word;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .sml-center {
    text-align: center;
  }

  .sml-block {
    display: block;
  }

  .sml-hide {
    display: none;
  }

  .sml-loading {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;     /* 垂直居中 */
    justify-content: center; /* 水平居中 */
  }
</style>
<div class="sml-mask" id="sml-mask">
  <div class="sml-mainbox sml-block" id="sml-mainbox">
    <div class="sml-title"><!--
   --><span>正在直播</span><!--
   --><span class="sml-titlesp2">&nbsp;<span id="sml-titlesp2">(0)</span> | <span id="sml-titlesp3">(0)</span></span><!--
   --><button class="sml-refresh"><!--
     --><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path d="M6.343145750507619 10A6 6 0 0 1 17.65685424949238 10v-3m0 3l-2.5917778669 -1.5108566617" />
          <path d="M17.65685424949238 14A6 6 0 0 1 6.343145750507619 14v3m0 -3l2.5917778669 1.5108566617" />
        </svg><!--
   --></button><!--
   --><button class="sml-exit"><!--
     --><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path d="M6 6l12 12m0-12L6 18" />
        </svg><!--
   --></button><!--
 --></div>
    <div class="sml-tab-container" id="sml-tabscontainer"></div>
    <div class="sml-livepanel sml-block" id="sml-contentcontainer"></div>
  </div>
</div>
`;
  const refresh = base.querySelector('.sml-refresh');
  refresh.addEventListener('click', initTabs);
  const exit = base.querySelector('.sml-exit');
  exit.addEventListener('click', exitBtn);
  document.body.appendChild(base);
  await initTabs();
}


function markList(list) {
  const singerKeywords_ = singerKeywords || [];
  if(singerKeywords_.length === 0) {
    return list;
  }
  const keywordRegex = new RegExp(singerKeywords.join('|'));
  const markedList = list.map(item => {
    const fieldValue = String(item.title || '');
    const isMatched = keywordRegex.test(fieldValue);
    return {
      ...item,
      matched: isMatched
    }
  });
  return markedList;
}


function convertTagData(data) {
  const result = {};
  let index = 1;
  for (const [key, value] of Object.entries(data)) {
    result[`tag${index}Id`] = key;
    result[`tag${index}Name`] = value;
    index++;
  }
  return result;
}

const getFromArray = (array, uid) => {
  if (!array || array.length === 0) {
    return null;
  }
  return array.find(item => item.uid === uid);
};

async function loadData() {
  const localData = await localforage.getItem('usersData');
  const userList = [];
  let liveCount = 0;
  let hasMore = true;
  let page = 1;
  let maxPage = 1;
  while (hasMore && page <= maxPage) {
    const resp = await fetch(`https://api.live.bilibili.com/xlive/web-ucenter/user/following?page_size=29&page=${page}`, {
      credentials: 'include'
    });
    if (resp.ok) {
      const json = await resp.json();
      const jsondata = json.data;
      maxPage = jsondata.totalPage;
      for (const user of jsondata.list) {
        const userData = getFromArray(localData, user.uid);
        if (user.live_status == 0) {
          hasMore = false;
          break;
        } else if (userData) {
          liveCount++;
          userList.push(userData);
          continue;
        }

        await fetch(`https://api.bilibili.com/x/relation/tag/user?fid=${user.uid}`, {
          credentials: 'include'
        }).then(async resp => {
          if (!resp.ok) {
            return;
          }
          const json = await resp.json();
          const tagData = convertTagData(json.data);
          user.tagId = tagData.tag1Id || 0;
          user.tagName = tagData.tag1Name || "默认关注";
        });

        // await fetch(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${user.roomid}`, {
        //   credentials: 'include'
        // }).then(async resp => {
        //   if (!resp.ok) {
        //     return;
        //   }
        //   const json = await resp.json();
        //   const jsondata = json.data.room_info;
        //   user.areaname = jsondata.area_name;
        //   areaname.href = `https://live.bilibili.com/p/eden/area-tags?parentAreaId=${jsondata.parent_area_id}&areaId=${jsondata.area_id}`;
        // });

        liveCount++;
        userList.push(user);
      }
    }
    page++;
  }
  return [markList(userList), liveCount];
}

async function loadTags() {
  return await fetch(`https://api.bilibili.com/x/relation/tags`, {
    credentials: 'include'
  }).then(async resp => {
    const json = await resp.json();
    return json.data;
  });
}

// 切换标签
function switchTab(groupId) {
  const content = document.querySelector(`#sml-content-${groupId}`);
  const count = content.dataset.groupcount;
  const titlesp3 = document.getElementById('sml-titlesp3');
  titlesp3.innerHTML = `(${count})`;
  // 更新标签状态
  document.querySelectorAll('.sml-tab').forEach(tab => {
    tab.classList.toggle('active', parseInt(tab.dataset.id) === groupId);
  });
  // 更新内容显示
  document.querySelectorAll('.sml-content-item').forEach(item => {
    item.classList.toggle('active', item.id === `sml-content-${groupId}`);
  });
}

async function initTabs() {
  const tabsContainer = document.getElementById('sml-tabscontainer');
  const contentContainer = document.getElementById('sml-contentcontainer');
  const titlesp2 = document.getElementById('sml-titlesp2');
  const titlesp3 = document.getElementById('sml-titlesp3');
  titlesp3.innerHTML = `(0)`;
  tabsContainer.innerHTML = "";
  contentContainer.innerHTML = "<div class='sml-loading'>Loading...</div>";
  const groupsData = await loadTags();
  const [usersData, liveCount] = await loadData();
  localforage.setItem('usersData', usersData);
  contentContainer.innerHTML = '';
  // 生成标签
  groupsData.forEach((group, index) => {
    const tab = document.createElement('div');
    tab.className = `sml-tab ${index === 1 ? 'active' : ''}`;
    tab.textContent = group.name;
    tab.dataset.id = group.tagid;
    tab.addEventListener('click', () => switchTab(group.tagid));
    tabsContainer.appendChild(tab);
  });

  // 生成内容
  groupsData.forEach((group, index) => {
    let groupCount = 0;
    const contentItem = document.createElement('div');
    contentItem.className = `sml-content-item ${index === 1 ? 'active' : ''}`;
    contentItem.id = `sml-content-${group.tagid}`;
    
    // 获取该分组的用户
    const groupUsers = usersData.filter(user => {
      return parseInt(user.tagId) === group.tagid;
    });
    groupCount = groupUsers.length || 0;
    contentItem.dataset.groupcount = groupCount;
    //
    contentItem.innerHTML = `
      <div class="sml-livepanel sml-block">
        ${groupUsers.map(user => `
          <div class="sml-livecontainer ${user.matched ? 'sml-singer' : ''}">
            <a class="sml-block sml-a1" href="https://live.bilibili.com/${user.roomid}" target="_blank" style="background-image: url(${user.face}@50w_50h.png);"></a>
            <a class="sml-block sml-a2" href="https://live.bilibili.com/${user.roomid}" target="_blank">
              <div class="sml-word sml-block sml-upname">${user.uname}</div>
              <div class="sml-word sml-block sml-livename">${user.title}</div>
            </a>
          </div>
        `).join('')}
      </div>
    `;
    // <div class="sml-word sml-block sml-areaname">${user.areaname}</div>
    contentContainer.appendChild(contentItem);
  });
  titlesp2.innerHTML = `(${liveCount})`;
}

/**
 * 退出面板
 */
function exitBtn() {
  document.body.removeChild(document.querySelector('#sml-base'));
}

/**
 * 重新放置元素，清除事件处理器
 * @param {Element} oldEelement
 * @returns {Element}
 */
function replaceElement(oldEelement) {
  const newElement = document.createElement(oldEelement.tagName);
  for (const t of oldEelement.attributes) {
    newElement.setAttribute(t.name, t.value);
  }
  for (const t of oldEelement.childNodes) {
    newElement.appendChild(t);
  }
  const parent = oldEelement.parentElement;
  const next = oldEelement.nextSibling;
  parent.removeChild(oldEelement);
  parent.insertBefore(newElement, next);
  return newElement;
}

/**
 * 替换按钮功能
 */
function replaceBtnFunc() {
  const moreBtnEle = document.querySelector('.bili-dyn-live-users__more');
  if (moreBtnEle) {
    if (!document.querySelector('#sml-stop-event')) {
      const moreBtnEleNew = replaceElement(moreBtnEle);
      moreBtnEleNew.id = 'sml-stop-event';
      moreBtnEleNew.addEventListener('click', moreBtn);
    }
    window.removeEventListener('keydown', replaceBtnFunc);
    window.removeEventListener('mousemove', replaceBtnFunc);
    window.removeEventListener('mousedown', replaceBtnFunc);
  }
}

window.addEventListener('keydown', replaceBtnFunc);
window.addEventListener('mousemove', replaceBtnFunc);
window.addEventListener('mousedown', replaceBtnFunc);