// ==UserScript==
// @name         Better SteamPYPlus
// @namespace    https://space.bilibili.com/93654843
// @version      0.0.0
// @description  Better SteamPY基础上增加了绝版游戏筛选、自动翻页功能
// @author       FiNNiER、ZY
// @match        *://steampy.com/*
// @icon         https://steampy.com/img/logo.63413a4f.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      gitee.com
// @connect      api.steampowered.com
// @connect      store.steampowered.com
// @connect      steam-tracker.com
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/562523/Better%20SteamPYPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/562523/Better%20SteamPYPlus.meta.js
// ==/UserScript==
var Saves = {
  wishlist: [],
  ownedApps: [],
  familygameList: [],
  lastupdatetime: 0,
};
var limitedApps = [];
var noGameList = [];
var delistedGamesData = null; // 存储下架游戏数据
var noDlc = false;
var noownedGames = false;
var noRestrictedGames = false;
var onlyDelistedGames = false; // 只显示下架游戏
var delistedTypes = []; // 选中的下架类型
var autoSkipTimer = null; // 用于防抖的计时器
var isAutoSkipping = false; // 防止重复触发翻页
var lastGameIds = ''; // 记录上一次的游戏ID列表，用于检测数据是否更新
var autoSkipTargetPage = 0; // 自动跳页的目标页码


(function () {
  'use strict';
  load();
  observePageChanges();
  // 强制加载下架游戏数据
  setTimeout(() => {
    if (!delistedGamesData || !delistedGamesData.removed_apps) {
      console.log('[Better Steampy] 强制加载下架游戏数据');
      getDelistedGamesList();
    }
  }, 2000);
})();

// 检测当前页是否为空，如果为空则自动翻页
function checkAndAutoSkip() {
  // 清除之前的计时器，防抖处理
  if (autoSkipTimer) {
    clearTimeout(autoSkipTimer);
  }

  autoSkipTimer = setTimeout(() => {
    // 只选择包含 cdkGameIcon 的游戏块（CDKey列表），排除火热预售等广告区域
    const cdkGameIcons = document.querySelectorAll('.cdkGameIcon');
    const allGames = Array.from(cdkGameIcons).map(icon => icon.closest('.gameblock')).filter(el => el !== null);
    const visibleGames = allGames.filter(el => {
      // 检查元素是否可见（display 不是 none）
      const style = el.style.display;
      return style !== 'none';
    });

    // 获取当前页面游戏的ID列表（用于检测数据是否更新）
    const currentGameIds = Array.from(cdkGameIcons).map(icon => {
      const src = icon.getAttribute('data-src') || '';
      const match = src.match(/\/apps\/(\d+)\//);
      return match ? match[1] : '';
    }).join(',');

    // 检测数据是否变化
    const dataChanged = currentGameIds !== lastGameIds && lastGameIds !== '';

    // 如果正在自动跳页，检测数据是否已更新
    if (isAutoSkipping) {
      if (!dataChanged) {
        // 数据还没更新，继续等待
        return;
      }
      // 数据已更新，重置自动跳页状态继续检测
      isAutoSkipping = false;
    } else if (dataChanged) {
      // 不是自动跳页但数据变了，说明是手动翻页
      // 重置目标页码，让它从新页面重新开始计数
      autoSkipTargetPage = 0;
    }

    // 记录当前游戏ID
    lastGameIds = currentGameIds;

    // 如果页面有游戏但全部被隐藏了
    if (allGames.length > 0 && visibleGames.length === 0) {
      // 检查是否已到最后一页
      let isLastPage = false;

      // 从 zpagenav 获取当前页码和总页数
      const activePageEl = document.querySelector('.zpagenav .page-ul li.active');
      console.log('[Better Steampy] activePageEl:', activePageEl);

      if (activePageEl) {
        const currentPageNum = parseInt(activePageEl.textContent) || 1;

        // 查找所有页码元素，找出最大页码
        const allPageNums = Array.from(document.querySelectorAll('.zpagenav .page-ul li'))
          .map(li => parseInt(li.textContent))
          .filter(num => !isNaN(num));

        const maxPage = Math.max(...allPageNums);

        console.log('[Better Steampy] 当前页:', currentPageNum, '最大页:', maxPage, '所有页码:', allPageNums);

        // 如果当前页码等于最大页码，说明到最后一页了
        if (currentPageNum >= maxPage) {
          isLastPage = true;
        }
      }

      // 如果还没开始自动跳页，从页面获取真实页码
      if (autoSkipTargetPage === 0) {
        // 从 zpagenav 组件获取当前页码
        if (activePageEl) {
          autoSkipTargetPage = parseInt(activePageEl.textContent) || 1;
        } else {
          autoSkipTargetPage = 1;
        }
      }
      const nextPage = autoSkipTargetPage + 1;

      console.log('[Better Steampy] 是否最后一页:', isLastPage, '目标页码:', autoSkipTargetPage, '下一页:', nextPage);

      if (!isLastPage) {
        iview.Notice.info({
          title: 'Better Steampy',
          desc: `第 ${autoSkipTargetPage} 页无符合条件的游戏，自动跳转第 ${nextPage} 页`,
          duration: 2
        });

        // 更新目标页码
        autoSkipTargetPage = nextPage;
        isAutoSkipping = true;

        // 通过 Vue 组件直接调用翻页方法
        try {
          const pageComp = document.querySelector('.ivu-page').__vue__;
          console.log('[Better Steampy] 分页组件:', pageComp);

          // 尝试不同层级的父组件
          let parentComp = null;
          let methodFound = false;

          for (let i = 1; i <= 6; i++) {
            let comp = pageComp;
            for (let j = 0; j < i; j++) {
              comp = comp.$parent;
              if (!comp) break;
            }

            if (comp) {
              console.log(`[Better Steampy] 第${i}层父组件:`, comp);
              console.log(`[Better Steampy] 第${i}层父组件方法:`, Object.keys(comp).filter(k => typeof comp[k] === 'function'));

              if (comp.pageHandler) {
                console.log('[Better Steampy] 在第' + i + '层找到 pageHandler');
                parentComp = comp;
                methodFound = true;
                break;
              } else if (comp.changePage) {
                console.log('[Better Steampy] 在第' + i + '层找到 changePage');
                parentComp = comp;
                methodFound = true;
                break;
              }
            }
          }

          if (methodFound && parentComp) {
            if (parentComp.pageHandler) {
              console.log('[Better Steampy] 调用 pageHandler，参数:', nextPage);
              parentComp.pageHandler(nextPage);
            } else if (parentComp.changePage) {
              console.log('[Better Steampy] 调用 changePage，参数:', nextPage);
              parentComp.changePage(nextPage);
            }
          } else {
            console.error('[Better Steampy] 未找到翻页方法');
            // 尝试直接点击下一页按钮
            const nextButton = document.querySelector('.ivu-page-next:not(.ivu-page-disabled)');
            if (nextButton) {
              console.log('[Better Steampy] 尝试点击下一页按钮');
              nextButton.click();
            } else {
              console.error('[Better Steampy] 也没找到可点击的下一页按钮');
              isAutoSkipping = false;
              autoSkipTargetPage = 0;
            }
          }
        } catch (e) {
          console.error('[Better Steampy] 翻页失败:', e);
          isAutoSkipping = false;
          autoSkipTargetPage = 0;
        }
      } else {
        iview.Notice.warning({
          title: 'Better Steampy',
          desc: '当前页无符合条件的游戏，已到最后一页',
          duration: 3
        });
        isAutoSkipping = false;
        autoSkipTargetPage = 0;
      }
    } else {
      // 找到有可见游戏的页面，重置状态
      isAutoSkipping = false;
      autoSkipTargetPage = 0;
    }
  }, 500);
}

// 重置自动跳页状态（用于手动翻页时调用）
function resetAutoSkipState() {
  isAutoSkipping = false;
  autoSkipTargetPage = 0;
}

//读取个人库存及愿望单并储存
function getOwnAndWish() {
  return new Promise((resolve, reject) => {
    var wishlist = [];
    var ownedApps = [];
    GM_xmlhttpRequest({
      method: 'GET',
      url:
        'https://store.steampowered.com/dynamicstore/userdata/?t=' +
        Math.trunc(Date.now() / 1000),
      responseType: 'json',
      onload: function (response) {
        let data = JSON.parse(response.responseText);
        wishlist = data.rgWishlist;
        ownedApps = data.rgOwnedApps;
        let previousSaves = GM_getValue('Saves');
        let newSave = {
          wishlist: wishlist,
          ownedApps: ownedApps,
          familygameList: previousSaves.familygameList,
          lastupdatetime: new Date().getTime(),
        };
        GM_setValue('Saves', newSave);
        Saves = newSave;
        iview.Notice.success({
          title: `Better Steampy`,
          desc: `已加载 ${ownedApps.length} 个库存游戏及DLC，${wishlist.length} 个愿望单游戏`,
        });
        resolve(newSave);
      },
    });
  });
}

//读取家庭库并储存
function getFamilyGame() {
  return new Promise((resolve, reject) => {
    var access_token;
    var family_groupid;
    var familygameList = [];
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://store.steampowered.com/pointssummary/ajaxgetasyncconfig',
      responseType: 'json',
      onload: function (response) {
        let data = JSON.parse(response.responseText);
        access_token = data.data.webapi_token; // access_token
        GM_xmlhttpRequest({
          method: 'GET',
          url: `https://api.steampowered.com/IFamilyGroupsService/GetFamilyGroupForUser/v1/?access_token=${access_token}`,
          responseType: 'json',
          onload: function (response) {
            let data = JSON.parse(response.responseText);
            family_groupid = data.response.family_groupid; // family_groupid
            GM_xmlhttpRequest({
              method: 'GET',
              url: `https://api.steampowered.com/IFamilyGroupsService/GetSharedLibraryApps/v1/?access_token=${access_token}&family_groupid=${family_groupid}&include_own=true`,
              responseType: 'json',
              onload: function (response) {
                let data = JSON.parse(response.responseText);
                data.response.apps.forEach((app) => {
                  if (app.exclude_reason == 0) {
                    familygameList.push(app.appid);
                  }
                });
                let previousSaves = GM_getValue('Saves');
                let newSave = {
                  wishlist: previousSaves.wishlist,
                  ownedApps: previousSaves.ownedApps,
                  familygameList: familygameList,
                  lastupdatetime: new Date().getTime(),
                };
                GM_setValue('Saves', newSave);
                Saves = newSave;
                iview.Notice.success({
                  title: `Better Steampy`,
                  desc: `已加载 ${familygameList.length} 个家庭库游戏`,
                });
                resolve(familygameList);
              },
            });
          },
        });
      },
    });
  });
}

//获取受限游戏列表
function getLimitedGamesList() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://gitee.com/Finnier/getSteamRestrictedGameLIst/raw/main/data/normalist.json',
      responseType: 'json',
      onload: function (response) {
        var data = JSON.parse(response.responseText);
        var limitedGames = data;
        GM_setValue('limitedApps', limitedGames);
        iview.Notice.success({
          title: `Better Steampy`,
          desc: `已加载 ${limitedGames.length} 个非受限游戏`,
        });
        resolve(limitedGames);
      },
    });
  });
}

//获取非游戏列表
function getNogameList() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://gitee.com/Finnier/getSteamAppListWithType/raw/main/data/Listwithnogame.json',
      responseType: 'json',
      onload: function (response) {
        var data = JSON.parse(response.responseText);
        var nogamelistdata = Object.keys(data).map(Number);
        GM_setValue('NoGameList', nogamelistdata);
        noGameList = nogamelistdata;
        iview.Notice.success({
          title: `Better Steampy`,
          desc: `已加载 ${nogamelistdata.length} 个DLC及原声带`,
        });
        resolve(nogamelistdata);
      },
    });
  });
}

//获取下架游戏列表（尝试从 SWI 插件缓存读取）
function getDelistedGamesList() {
  return new Promise((resolve, reject) => {
    console.log('[Better Steampy] 开始获取下架游戏数据...');

    // 尝试从 chrome.storage 读取 SWI 插件的缓存数据
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['swi_decommissioned'], function(result) {
        if (result.swi_decommissioned && result.swi_decommissioned.removed_apps) {
          console.log('[Better Steampy] 从 SWI 插件缓存读取下架游戏数据');
          delistedGamesData = result.swi_decommissioned;
          GM_setValue('DelistedGamesData', delistedGamesData);
          const count = Object.keys(delistedGamesData.removed_apps).length;
          console.log('[Better Steampy] 成功加载下架游戏数据，共', count, '个');
          iview.Notice.success({
            title: `Better Steampy`,
            desc: `已从 SWI 插件加载 ${count} 个下架游戏数据`,
          });
          resolve(delistedGamesData);
        } else {
          // SWI 插件没有缓存，尝试从 API 获取
          fetchFromAPI();
        }
      });
    } else {
      // 不支持 chrome.storage，直接从 API 获取
      fetchFromAPI();
    }

    function fetchFromAPI() {
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://steam-tracker.com/api?action=GetAppListV3',
        responseType: 'json',
        timeout: 10000,
        onload: function (response) {
          try {
            console.log('[Better Steampy] API 响应状态:', response.status);

            var data = JSON.parse(response.responseText);
            console.log('[Better Steampy] 解析后的数据结构:', Object.keys(data));

            // 转换数组格式为对象格式，方便查询
            if (data.removed_apps && Array.isArray(data.removed_apps)) {
              const removed_apps_obj = {};
              data.removed_apps.forEach(app => {
                removed_apps_obj[app.appid] = {
                  name: app.name,
                  category: app.category,
                  type: app.type
                };
              });

              const convertedData = {
                removed_apps: removed_apps_obj
              };

              GM_setValue('DelistedGamesData', convertedData);
              delistedGamesData = convertedData;
              const count = Object.keys(removed_apps_obj).length;
              console.log('[Better Steampy] 成功加载下架游戏数据，共', count, '个');

              iview.Notice.success({
                title: `Better Steampy`,
                desc: `已加载 ${count} 个下架游戏数据`,
              });
              resolve(convertedData);
            } else {
              throw new Error('数据格式不正确');
            }
          } catch (e) {
            console.error('[Better Steampy] 解析下架游戏数据失败:', e);
            iview.Notice.error({
              title: `Better Steampy`,
              desc: `加载下架游戏数据失败: ${e.message}`,
            });
            reject(e);
          }
        },
        onerror: function(error) {
          console.error('[Better Steampy] 请求下架游戏数据失败:', error);
          iview.Notice.error({
            title: `Better Steampy`,
            desc: `请求下架游戏数据失败，请检查网络连接`,
          });
          reject(error);
        },
        ontimeout: function() {
          console.error('[Better Steampy] 请求下架游戏数据超时');
          iview.Notice.error({
            title: `Better Steampy`,
            desc: `请求下架游戏数据超时`,
          });
          reject(new Error('timeout'));
        }
      });
    }
  });
}

//初始化脚本配置菜单
function init() {
  const settings = document.createElement('div');
  settings.innerHTML = `
      <div id="settings" class="ml-20-rem">
      <div class="withdraw" @click="modal=true, updateValues()">脚本设置</div>
        <Modal v-model="modal">
          <br />
          <Card>
            <template #title><h2>拥有状态标记</h2></template>
            <Alert type="warning" show-icon>暂时不支持捆绑包标记</Alert>
            <p>
              上次更新于
              <i-time :time="lastUpdateTime" :interval="1"></i-time>
              (每24小时执行一次自动更新)
            </p>
            <p>已加载 {{ownedApps}} 个库存游戏及DLC</p>
            <p>已加载 {{wishlist}} 个愿望单游戏</p>
            <p>已加载 {{familygameList}} 个家庭库游戏</p>
            <div>
              是否加入了家庭组：<i-Switch
                v-model="isInFamilyGroup"
                @on-change="isInFamilyGroup_change"
              />
            </div>
            <br />
            <button-group size="large" shape="circle">
              <i-Button @click="reloadSaves" :loading="refershSaves_loading"
                >重载存档</i-Button
              >
              <i-Button @click="clearSaves">清除存档</i-Button>
            </button-group>
          </Card>
          <Card>
            <template #title><h2>个人资料功能受限标记</h2></template>
            <Alert show-icon
              >数据来源于https://github.com/F1NN1ER/getSteamRestrictedGameLIst</Alert
            >
            <Alert show-icon>数据每日更新，可能尚有部分未及时标记</Alert>
            <div>
              是否启用受限游戏标注：<i-Switch
                v-model="checkIsProfileFeatureLimited"
                @on-change="checkIsProfileFeatureLimited_change"
              />
            </div>
            <p>目前共加载{{limitedApps}}个非受限游戏(跟随拥有状态自动更新)</p>
            <i-Button
              @click="reloadLimitedSaves"
              :loading="reloadLimitedSaves_loading"
              >刷新</i-Button
            >
          </Card>
          <Card>
            <template #title><h2>标记颜色设置</h2></template>
            <div>
              已拥有
              <Color-Picker
                v-model="ownedAppsColor"
                size="small"
                :colors="defaultcolors"
                @on-change="ownedAppsColor_change"
              />
            </div>
            <div>
              在愿望单中
              <Color-Picker
                v-model="wishlistColor"
                size="small"
                :colors="defaultcolors"
                @on-change="wishlistColor_change"
              />
            </div>
            <div>
              在家庭库中
              <Color-Picker
                v-model="familygameColor"
                size="small"
                :colors="defaultcolors"
                @on-change="familygameColor_change"
              />
            </div>
            <div>
              未拥有
              <Color-Picker
                v-model="unownedColor"
                size="small"
                :colors="defaultcolors"
                @on-change="unownedColor_change"
              />
            </div>
          </Card>
          <Card>
            <template #title><h2>网页优化</h2></template>
            <div>
              是否关闭网页右下方推广侧栏：<i-Switch
                v-model="isSuspensionOff"
                @on-change="isSuspensionOff_change"
              />
            </div>
          </Card>
        </Modal>
      </div>
  `;
  const filter = document.createElement('div');
  filter.innerHTML = `
  <div id="filter" class="ml-20-rem">
  <Space direction="vertical" size="large">
        <div id="filter" style="position: relative;">
          <Checkbox-Group v-model="filter"  @on-change="filterChange">
            <Checkbox label="noOwnedGames" border>不显示已拥有游戏</Checkbox>
            <Checkbox label="noRestrictedGames" border >不显示资料受限游戏</Checkbox>
            <Checkbox label="noDlc" border>不显示DLC及原声带</Checkbox>
            <div style="display: inline-block; position: relative;">
              <Checkbox label="onlyDelistedGames" border>只显示下架游戏</Checkbox>
              <span
                v-if="showDelistedTypes"
                @click.stop.prevent="toggleDelistedTypesPanel"
                style="cursor: pointer; margin-left: 4px; padding: 4px 8px; transition: transform 0.2s; display: inline-block; vertical-align: middle; user-select: none;"
                :style="{ transform: delistedTypesPanelExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }">▼</span>
              <div v-if="showDelistedTypes && delistedTypesPanelExpanded"
                   style="position: absolute; left: 100%; top: 0; margin-left: 10px; background: white; border: 1px solid #dcdee2; border-radius: 4px; padding: 8px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 1000; min-width: 180px;">
                <Checkbox-Group v-model="delistedTypes" @on-change="delistedTypesChange" style="display: flex; flex-direction: column; gap: 6px;">
                  <Checkbox label="purchase disabled" style="display: block; margin: 0; white-space: nowrap;">Purchase Disabled</Checkbox>
                  <Checkbox label="delisted" style="display: block; margin: 0; white-space: nowrap;">Delisted</Checkbox>
                  <Checkbox label="f2p" style="display: block; margin: 0; white-space: nowrap;">F2P (Unavailable)</Checkbox>
                  <Checkbox label="unreleased" style="display: block; margin: 0; white-space: nowrap;">Unreleased</Checkbox>
                  <Checkbox label="test app" style="display: block; margin: 0; white-space: nowrap;">Test App</Checkbox>
                  <Checkbox label="retail only" style="display: block; margin: 0; white-space: nowrap;">Retail Only</Checkbox>
                  <Checkbox label="pre-order exclusive" style="display: block; margin: 0; white-space: nowrap;">Pre-order Exclusive</Checkbox>
                  <Checkbox label="banned" style="display: block; margin: 0; white-space: nowrap;">Banned</Checkbox>
                </Checkbox-Group>
              </div>
            </div>
          </Checkbox-Group>
    </Space>
      `;
  const targetElement = document.querySelector('.balanceTitle > div');
  targetElement.appendChild(settings);
  targetElement.appendChild(filter);
  new Vue({
    el: '#settings',
    data() {
      return {
        reloadLimitedSaves_loading: false,
        refershSaves_loading: false,
        modal: false,
        lastUpdateTime: Saves.lastupdatetime,
        ownedApps: Saves.ownedApps.length,
        wishlist: Saves.wishlist.length,
        familygameList: Saves.familygameList.length,
        limitedApps: limitedApps.length,
        isInFamilyGroup: JSON.parse(localStorage.getItem('isInfamily')),
        checkIsProfileFeatureLimited: JSON.parse(
          localStorage.getItem('IsProfileFeatureLimited')
        ),
        isSuspensionOff: JSON.parse(localStorage.getItem('isSuspensionOff')),
        ownedAppsColor: localStorage.getItem('ownedColor'),
        wishlistColor: localStorage.getItem('wishlistColor'),
        familygameColor: localStorage.getItem('familygameColor'),
        unownedColor: localStorage.getItem('unownedColor'),
        defaultcolors: ['#0c8918', '#177cb0', '#ff8936', '#ff2e63'],
      };
    },
    methods: {
      updateValues() {
        this.ownedApps = Saves.ownedApps.length;
        this.wishlist = Saves.wishlist.length;
        this.familygameList = Saves.familygameList.length;
        this.limitedApps = limitedApps.length;
        this.lastUpdateTime = Saves.lastupdatetime;
      },
      isInFamilyGroup_change(status) {
        if (status) {
          localStorage.setItem('isInfamily', JSON.stringify(true));
        } else {
          localStorage.removeItem('isInfamily');
        }
      },
      checkIsProfileFeatureLimited_change(status) {
        if (status) {
          localStorage.setItem('IsProfileFeatureLimited', JSON.stringify(true));
          Saves = GM_getValue('Saves');
          const elements = document.querySelectorAll('.cdkGameIcon');
          elements.forEach((element) => {
            cdkeyGameChecker(element);
          });
          checkAndAutoSkip(); // 添加自动跳页检测
        } else {
          localStorage.removeItem('IsProfileFeatureLimited');
          const elements = document.querySelectorAll('.ProfileFeaturesLimited');
          elements.forEach((element) => {
            element.parentNode.removeChild(element);
          });
        }
      },
      isSuspensionOff_change(status) {
        if (status) {
          localStorage.setItem('isSuspensionOff', JSON.stringify(true));
          GM_addStyle('.suspension{display:none}');
        } else {
          GM_addStyle('.suspension{display:block}');
          localStorage.removeItem('isSuspensionOff');
        }
      },
      ownedAppsColor_change(color) {
        ownedColor = color;
        localStorage.setItem('ownedColor', color);
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
      },
      wishlistColor_change(color) {
        wishlistColor = color;
        localStorage.setItem('wishlistColor', color);
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
      },
      familygameColor_change(color) {
        familygameColor = color;
        localStorage.setItem('familygameColor', color);
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
      },
      unownedColor_change(color) {
        unownedColor = color;
        localStorage.setItem('unownedColor', color);
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
      },
      async reloadSaves() {
        this.$Notice.info({
          title: '正在重载存档',
        });
        this.refershSaves_loading = true;
        await Promise.all([
          getOwnAndWish(),
          this.isInFamilyGroup ? getFamilyGame() : Promise.resolve(),
        ]);
        Saves = GM_getValue('Saves');
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
        this.updateValues();
        this.refershSaves_loading = false;
        this.$Notice.success({
          title: '重载完毕',
        });
        checkAndAutoSkip(); // 添加自动跳页检测
      },
      async reloadLimitedSaves() {
        this.$Notice.info({
          title: '正在加载受限游戏列表',
        });
        this.reloadLimitedSaves_loading = true;
        await getLimitedGamesList();
        await getNogameList();
        limitedApps = GM_getValue('limitedApps');
        this.updateValues();
        this.reloadLimitedSaves_loading = false;
        this.$Notice.success({
          title: '加载完毕',
        });
        checkAndAutoSkip(); // 添加自动跳页检测
      },
      clearSaves() {
        this.$Notice.info({
          title: '存档已清除',
        });
        let nullSaves = {
          wishlist: [],
          ownedApps: [],
          familygameList: [],
          lastupdatetime: 0,
        };
        Saves = nullSaves;
        GM_setValue('Saves', nullSaves);
        this.updateValues();
      },
    },
  });
  new Vue({
    el: '#filter',
    data() {
      return {
        filter: [],
        delistedTypes: ['purchase disabled', 'delisted', 'f2p', 'unreleased', 'test app', 'retail only', 'pre-order exclusive', 'banned'],
        showDelistedTypes: false,
        delistedTypesPanelExpanded: false, // 下架类型面板是否展开
      };
    },
    computed: {
    },
    methods: {
      filterChange() {
        noownedGames = this.filter.includes('noOwnedGames');
        noRestrictedGames = this.filter.includes('noRestrictedGames');
        noDlc = this.filter.includes('noDlc');
        onlyDelistedGames = this.filter.includes('onlyDelistedGames');
        this.showDelistedTypes = onlyDelistedGames;
        // 勾选"只显示下架游戏"时自动展开面板
        if (onlyDelistedGames) {
          this.delistedTypesPanelExpanded = true;
        }
        delistedTypes = this.delistedTypes;
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
        checkAndAutoSkip();
      },
      delistedTypesChange() {
        delistedTypes = this.delistedTypes;
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
        checkAndAutoSkip();
      },
      toggleDelistedTypesPanel() {
        this.delistedTypesPanelExpanded = !this.delistedTypesPanelExpanded;
      },
    },
  });
  if (localStorage.getItem('isSuspensionOff') === 'true') {
    GM_addStyle('.suspension{display:none}');
  }
}

//游戏状态标记-CDKEY
function cdkeyGameChecker(element) {
  const isAppOwned = (appId) => Saves.ownedApps.includes(appId);
  const isAppinwishlist = (appId) => Saves.wishlist.includes(appId);
  const isAppShared = (appId) => Saves.familygameList.includes(appId);
  const isNotLimited = (appId) => !limitedApps.includes(appId); // 恢复原来的判断方式
  const isDLC = (appId) => noGameList.includes(appId);
  const getAppId = (url) => (url.match(/\/apps\/(\d+)\//) || [])[1] || null;
  const getBundleId = (url) =>(url.match(/\/bundles\/(\d+)\//) || [])[1] || null;
  const appId = Number(getAppId(element.getAttribute('data-src')));
  const gameNameElement = element
    .closest('.gameblock')
    .querySelector('.gameName');
  const gameBlock = element.closest('.gameblock');

  // 检测游戏是否下架以及下架类型（使用 Steam-Tracker 数据）
  const getDelistedType = () => {
    if (!delistedGamesData || !delistedGamesData.removed_apps) {
      return null;
    }

    const appIdStr = appId.toString();
    const gameData = delistedGamesData.removed_apps[appIdStr];

    if (!gameData) {
      // 不是下架游戏
      return null;
    }

    // Steam-Tracker 的 category 字段对应下架类型
    const category = gameData.category;
    if (!category) {
      return null;
    }

    // 映射 Steam-Tracker 的 category 到我们的类型
    const categoryMap = {
      'Purchase disabled': 'purchase disabled',
      'Delisted': 'delisted',
      'Delisted video': 'delisted',
      'F2P': 'f2p',
      'Unreleased': 'unreleased',
      'Test app': 'test app',
      'Retail only': 'retail only',
      'Pre-order exclusive': 'pre-order exclusive',
      'Banned': 'banned'
    };

    const mappedType = categoryMap[category] || category.toLowerCase();
    return mappedType;
  };

  if (appId != 0) {
    element.parentElement.parentElement.style.display = 'block';

    // 下架游戏筛选逻辑
    if (onlyDelistedGames) {
      const delistedType = getDelistedType();
      if (!delistedType || !delistedTypes.includes(delistedType)) {
        // 不是下架游戏，或者不在选中的下架类型中，隐藏
        element.parentElement.parentElement.style.display = 'none';
        return;
      }
    }

    if (noDlc) {
      if (isDLC(appId)) {
        element.parentElement.parentElement.style.display = 'none';
      }
    }
    if (isAppOwned(appId)) {
      if (noownedGames) {
        element.parentElement.parentElement.style.display = 'none';
      } else {
        gameNameElement.style.color = ownedColor;
      }
    } else if (isAppShared(appId)) {
      gameNameElement.style.color = familygameColor;
    } else if (isAppinwishlist(appId)) {
      gameNameElement.style.color = wishlistColor;
    } else {
      gameNameElement.style.color = unownedColor;
    }
    if (localStorage.getItem('IsProfileFeatureLimited')) {
      const existingDiscountDiv = element.parentElement.querySelector(
        '.ProfileFeaturesLimited'
      );
      if (existingDiscountDiv) {
        existingDiscountDiv.remove();
      }
      // 恢复使用 limitedApps 列表判断（不在列表中=受限）
      if (isNotLimited(appId)) {
        if (noRestrictedGames) {
          element.parentElement.parentElement.style.display = 'none';
        } else {
          const discountDiv = document.createElement('div');
          discountDiv.className = 'ProfileFeaturesLimited';
          discountDiv.textContent = '资料受限';
          element.parentElement.appendChild(discountDiv);
        }
      }
    }

  }
}

//加载存档
function load() {
  var previousSave = GM_getValue('Saves');
  if (previousSave !== undefined) {
    Saves = GM_getValue('Saves');
  } else {
    GM_setValue('Saves', Saves);
  }
  var previousLimitedApps = GM_getValue('limitedApps');
  if (previousLimitedApps !== undefined) {
    limitedApps = GM_getValue('limitedApps');
  } else {
    getLimitedGamesList();
  }
  var previousNoGameList = GM_getValue('NoGameList');
  if (previousNoGameList !== undefined) {
    noGameList = GM_getValue('NoGameList');
  } else {
    getNogameList();
  }
  var previousDelistedGamesData = GM_getValue('DelistedGamesData');
  if (previousDelistedGamesData !== undefined && previousDelistedGamesData !== null && previousDelistedGamesData.removed_apps) {
    delistedGamesData = GM_getValue('DelistedGamesData');
    console.log('[Better Steampy] 从缓存加载下架游戏数据，共', Object.keys(delistedGamesData.removed_apps).length, '个');
  } else {
    console.log('[Better Steampy] 缓存无效，重新获取下架游戏数据');
    getDelistedGamesList();
  }
  //自动更新
  if (new Date().getTime() - Saves.lastupdatetime > 86400000) {
    iview.Notice.info({
      title: '存档自动更新中',
    });
    getOwnAndWish();
    if (JSON.parse(localStorage.getItem('isInfamily'))) {
      getFamilyGame();
    }
    getLimitedGamesList();
    getNogameList();
    getDelistedGamesList();
  }
}

//监听页面变化
function observePageChanges() {
  const config = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-src', 'class', 'title'], // 添加 class 和 title 监听，捕获 SWI 插件的标记
  };
  let hasExecuted = false;
  let pageChangeTimer = null; // 用于检测页面数据加载完成
  let paginationListenerAdded = false; // 是否已添加分页监听

  const callback = function (mutationsList, observer) {
    let hasGameIconChange = false;
    let hasSWIMarkChange = false; // 检测 SWI 插件标记变化

    for (let mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'data-src'
      ) {
        const targetElement = mutation.target;
        if (targetElement.classList.contains('cdkGameIcon')) {
          cdkeyGameChecker(targetElement);
          hasGameIconChange = true;
        }
      }

      // 检测 SWI 插件添加的标记（星星、垃圾桶图标）
      if (mutation.type === 'childList') {
        for (let node of mutation.addedNodes) {
          if (node.nodeType === 1) { // 元素节点
            // 检测是否是 SWI 插件添加的图标
            if (node.classList && (node.classList.contains('swi') || node.querySelector && node.querySelector('.swi'))) {
              hasSWIMarkChange = true;
              break;
            }
          }
        }
      }

      if (!hasExecuted && mutation.type === 'childList') {
        const balanceTitleElement = document.querySelector(
          '.balanceTitle > div'
        );
        if (balanceTitleElement) {
          init();
          hasExecuted = true;
        }
      }
    }

    // 添加分页按钮点击监听（只添加一次）
    if (!paginationListenerAdded) {
      const pagination = document.querySelector('.ivu-page');
      if (pagination) {
        pagination.addEventListener('click', function(e) {
          // 检测是否点击了分页按钮（不是由脚本触发的自动翻页）
          if (!isAutoSkipping) {
            resetAutoSkipState();
          }
        });
        paginationListenerAdded = true;
      }
    }

    // 如果有游戏图标变化，说明页面数据在加载
    if (hasGameIconChange) {
      if (pageChangeTimer) {
        clearTimeout(pageChangeTimer);
      }

      // 等待游戏数据加载完成后检测
      pageChangeTimer = setTimeout(() => {
        // 只有在启用了过滤选项时才检测自动跳页
        if (noownedGames || noRestrictedGames || noDlc || onlyDelistedGames) {
          checkAndAutoSkip();
        }
      }, 800); // 减少等待时间，因为不需要等待 SWI 插件渲染
    }

    // 如果检测到 SWI 插件标记变化，重新检查所有游戏
    if (hasSWIMarkChange) {
      if (pageChangeTimer) {
        clearTimeout(pageChangeTimer);
      }
      pageChangeTimer = setTimeout(() => {
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
        // 检测是否需要自动跳页
        if (noownedGames || noRestrictedGames || noDlc || onlyDelistedGames) {
          checkAndAutoSkip();
        }
      }, 500); // SWI 标记已经渲染，可以快速检测
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(document.body, config);
}
//CSS样式
const style = document.createElement('style');
style.innerHTML = `
    .ProfileFeaturesLimited {
    width: .65rem;
    height: .3rem;
    background: #ed4014;
    position: absolute;
    top: 0;
    color: #fff;
    text-align: center;
    line-height: .3rem;
    font-size: .12rem;
}
`;
document.head.appendChild(style);

//默认颜色
if (!localStorage.getItem('ownedColor')) {
  localStorage.setItem('ownedColor', '#0c8918');
  localStorage.setItem('wishlistColor', '#177cb0');
  localStorage.setItem('familygameColor', '#ff8936');
  localStorage.setItem('unownedColor', '#ff2e63');
}
var ownedColor = localStorage.getItem('ownedColor');
var wishlistColor = localStorage.getItem('wishlistColor');
var familygameColor = localStorage.getItem('familygameColor');
var unownedColor = localStorage.getItem('unownedColor');
