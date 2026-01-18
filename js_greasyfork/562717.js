// ==UserScript==
// @name         JAV-JHS English
// @namespace    JAV-JHS English
// @version      3.3.6.013
// @author       JAV-JHS English
// @description  Jav-JHS (Jav-Censor): Collect, Block, Mark as Downloaded; Block Tags, Block Actresses, Sync Favorite Actresses, New Work Detection; Free VIP viewing of Hot, Top250 charts, Fc2ppv, View all comments, Related lists; Cloud drive backup support; Image search; Subtitle search; JavDb|JavBus
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javdb.com
// @match        https://javdb.com/*
// @match        https://www.javbus.com/*
// @include      https://javdb*.com/*
// @include      https://*javbus*/*
// @include      https://*javsee*/*
// @include      https://*seejav*/*
// @include      https://javtrailers.com/*
// @include      https://subtitlecat.com/*
// @include      https://www.aliyundrive.com/*
// @include      https://www.alipan.com/*
// @include      https://115.com/*
// @exclude      https://*javbus*/forum/*
// @exclude      https://*javbus*/*actresses
// @exclude      https://*javsee*/forum/*
// @exclude      https://*javsee*/*actresses
// @exclude      https://*seejav*/forum/*
// @exclude      https://*seejav*/*actresses
// @require      https://update.greasyfork.org/scripts/515994/1478507/gh_2215_make_GM_xhr_more_parallel_again.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/tabulator-tables@6.3.1/dist/js/tabulator.min.js
// @require      https://cdn.jsdelivr.net/npm/layui-layer@1.0.9/dist/layer.min.js
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.19.0/js/md5.min.js
// @require      https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js
// @require      https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js
// @require      https://cdn.jsdelivr.net/npm/viewerjs@1.11.1/dist/viewer.min.js
// @require      https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js
// @connect      xunlei.com
// @connect      geilijiasu.com
// @connect      aliyundrive.com
// @connect      aliyundrive.net
// @connect      ja.wikipedia.org
// @connect      beta.magnet.pics
// @connect      jdforrepam.com
// @connect      cc3001.dmm.co.jp
// @connect      cc3001.dmm.com
// @connect      www.dmm.co.jp
// @connect      www.dmm.com
// @connect      api.dmm.com
// @connect      special.dmm.co.jp
// @connect      adult.contents.fc2.com
// @connect      fc2ppvdb.com
// @connect      123av.com
// @connect      u3c3.com
// @connect      u9a9.com
// @connect      btsow.lol
// @connect      sukebei.nyaa.si
// @connect      javstore.net
// @connect      javbest.net
// @connect      missav.live
// @connect      jable.tv
// @connect      www.av.gl
// @connect      jav.rs
// @connect      javtrailers.com
// @connect      javdb.com
// @connect      javbus.com
// @connect      supjav.com
// @connect      115.com
// @connect      127.0.0.1
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562717/JAV-JHS%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/562717/JAV-JHS%20English.meta.js
// ==/UserScript==

var _a,
  _StorageManager_instances,
  setItem_fn,
  saveFilterItem_fn,
  __defProp = Object.defineProperty,
  __typeError = (msg) => {
    throw TypeError(msg);
  },
  __publicField = (obj, key, value) =>
    ((obj, key, value) =>
      key in obj
        ? __defProp(obj, key, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: value,
          })
        : (obj[key] = value))(
      obj,
      'symbol' != typeof key ? key + '' : key,
      value,
    ),
  __privateMethod = (obj, member, method) => (
    ((obj, member, msg) => {
      member.has(obj) || __typeError('Cannot ' + msg);
    })(obj, member, 'access private method'),
    method
  );

const currentHref = window.location.href,
  isJavDb = currentHref.includes('javdb'),
  isJavBus =
    currentHref.includes('javbus') ||
    currentHref.includes('seejav') ||
    currentHref.includes('bus') ||
    currentHref.includes('javsee') ||
    'javbus' ===
      (null == (_a = $('.hidden-xs').attr('alt'))
        ? void 0
        : _a.trim().toLowerCase()),
  isSearchPage =
    currentHref.includes('/search?q') ||
    currentHref.includes('/search/') ||
    currentHref.includes('/users/'),
  Status_FILTER = 'filter',
  Status_FAVORITE = 'favorite',
  Status_HAS_DOWN = 'hasDown',
  Status_HAS_WATCH = 'hasWatch',
  NO = 'no',
  YES = 'yes',
  qualityOptions = [
    {
      id: 'video-mhb',
      quality: 'dmb_w',
      text: 'Old video source - medium quality widescreen (404p)',
      canSelect: !1,
    },
    {
      id: 'video-mhb',
      quality: 'sm_s',
      text: 'Old video source - low quality (240p)',
      canSelect: !1,
    },
    {
      id: 'video-mhb',
      quality: 'dm_s',
      text: 'Old video source - medium quality (360p)',
      canSelect: !1,
    },
    {
      id: 'video-mhb',
      quality: 'dmb_s',
      text: 'Old video source - medium quality (480p)',
      canSelect: !1,
    },
    {
      id: 'video-mhb',
      quality: 'mhb_w',
      text: 'Old video source - high quality widescreen (404p)',
      canSelect: !1,
    },
    {
      id: 'video-mmb',
      quality: 'mmb',
      text: 'Medium quality (432p)',
      canSelect: !0,
    },
    {
      id: 'video-mhb',
      quality: 'mhb',
      text: 'High quality (576p)',
      canSelect: !0,
    },
    {
      id: 'video-hmb',
      quality: 'hmb',
      text: 'HD (720p)',
      canSelect: !0,
    },
    {
      id: 'video-hhb',
      quality: 'hhb',
      text: 'FullHD (1080p)',
      canSelect: !0,
    },
    {
      id: 'video-hhbs',
      quality: 'hhbs',
      text: 'FullHD (1080p60fps)',
      canSelect: !0,
    },
    {
      id: 'video-4k',
      quality: '4k',
      text: '4K (2160p)',
      canSelect: !0,
    },
    {
      id: 'video-4ks',
      quality: '4ks',
      text: '4K (2160p60fps)',
      canSelect: !0,
    },
  ];

let detailPageCss$1 = '';

window.location.href.includes('hideNav=1') &&
  (detailPageCss$1 =
    '\n         .navbar-default {\n            display: none !important;\n        }\n        body {\n            padding-top:0px!important;\n        }\n    ');

const javBusStyle = `\n<style>\n    .top-bar {\n        z-index: 12345689 !important;\n    }\n    \n    .overlay-contentscale {\n        z-index: 12345699 !important;\n    }\n    \n    ${detailPageCss$1}\n\n    .masonry {\n        height: 100% !important;\n        width: 100% !important;\n        padding: 0 15px !important;\n    }\n    .masonry {\n        display: grid;\n        column-gap: 10px; /* Column gap*/\n        row-gap: 10px; /* Row gap */\n        grid-template-columns: repeat(4, minmax(0, 1fr));\n        align-items: start;\n    }\n    .masonry .item {\n        /*position: initial !important;*/\n        top: initial !important;\n        left: initial !important;\n        float: none !important;\n        background-color:#c4b1b1;\n        position: relative !important;\n    }\n    \n    .masonry .item:hover {\n        box-shadow: 0 .5em 1em -.125em rgba(10, 10, 10, .1), 0 0 0 1px #485fc7;\n    }\n    .masonry .movie-box{\n        width: 100% !important;\n        height: 100% !important;\n        margin: 0 !important;\n        overflow: inherit !important;\n    }\n    .masonry .movie-box .photo-frame {\n        /*height: 70% !important;*/\n        height:auto !important;\n        margin: 0 !important;\n        position:relative; /* Convenient for video preview positioning*/\n    }\n    .masonry .movie-box img {\n        max-height: 500px;\n        height: 100% !important;\n        object-fit: contain;\n        object-position: top;\n    }\n    .masonry .movie-box img:hover {\n      transform: scale(1.04);\n      transition: transform 0.3s;\n    }\n    .masonry .photo-info{\n        /*height: 30% !important;*/\n    }\n    .masonry .photo-info span {\n      display: inline-block; /* Or block */\n      max-width: 100%;      /* Limit width based on parent container */\n      white-space: nowrap;  /* Prevent line breaks */\n      overflow: hidden;     /* Hide overflow content */\n      text-overflow: ellipsis; /* Display ellipsis */\n    }\n    \n    /* Styles for uncensored pages */\n    .photo-frame .mheyzo,\n    .photo-frame .mcaribbeancom2{\n        margin-left: 0 !important;\n    }\n    .avatar-box{\n        width: 100% !important;\n        display: flex !important;\n        margin:0 !important;\n    }\n    .avatar-box .photo-info{\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        gap: 30px;\n        flex-direction: row;\n        background-color:#fff !important;\n    }\n    \n    footer{\n        display: none!important;\n    }\n    \n        \n    .video-title {\n        white-space: normal !important;\n        height: 75px; /* Fixed height so container doesn't have uneven heights*/\n        \n        display: -webkit-box !important; /* Must be set for subsequent properties to take effect */\n        -webkit-box-orient: vertical; /* Stack lines vertically */\n        -webkit-line-clamp: 3; /* Set maximum number of lines to display*/\n    }\n\n    \n</style>\n`;

let detailPageCss = '';

window.location.href.includes('hideNav=1') &&
  (detailPageCss =
    '\n        .main-nav,#search-bar-container {\n            display: none !important;\n        }\n        \n        html {\n            padding-top:0px!important;\n        }\n    ');

const javdbStyle = `\n<style>\n    ${detailPageCss}\n    \n    .navbar {\n        z-index: 12345679 !important;\n        padding: 0 0;\n    }\n    \n    .navbar-link:not(.is-arrowless) {\n        padding-right: 33px;\n    }\n    \n    .sub-header,\n    /*#search-bar-container, !*Search box*!*/\n    #footer,\n    /*.search-recent-keywords, !*Hot search terms at the bottom of the search box*!*/\n    .app-desktop-banner,\n    div[data-controller="movie-tab"] .tabs,\n    h3.main-title,\n    div.video-detail > div:nth-child(4) > div > div.tabs.no-bottom > ul > li:nth-child(3), /* Related lists*/\n    div.video-detail > div:nth-child(4) > div > div.tabs.no-bottom > ul > li:nth-child(2), /* Short comment button*/\n    div.video-detail > div:nth-child(4) > div > div.tabs.no-bottom > ul > li:nth-child(1), /*Magnet panel button*/\n    .top-meta,\n    .float-buttons {\n        display: none !important;\n    }\n    \n    div.tabs.no-bottom,\n    .tabs ul {\n        border-bottom: none !important;\n    }\n    \n    \n    /* Video list item relative to relative for absolute positioning of tags*/\n    .movie-list .item {\n        position: relative !important;\n    }\n    \n    .video-title {\n        white-space: normal !important;\n        height: 80px; /* Fixed height so container doesn't have uneven heights*/\n        \n        display: -webkit-box; /* Must be set for subsequent properties to take effect */\n        -webkit-box-orient: vertical; /* Stack lines vertically */\n        -webkit-line-clamp: 3; /* Set maximum number of lines to display*/\n    }\n    \n    /* Adaptive classification at the top of the list page */\n    .main-tabs, .tabs {\n        overflow-x:hidden;\n        flex-wrap: wrap;\n        justify-content: flex-start;\n    }\n    \n    .main-tabs ul, .tabs ul {\n        flex-wrap: wrap;\n        flex-grow: 0;\n    }\n    \n    \n    /* Secondary toolbar: large/small cover, playable, with magnet links...*/\n    .toolbar {\n        display: flex;\n    }\n\n</style>\n`;

const mainCss = `\n<style>\n    /* Global common styles */\n    .fr-btn {\n        float: right;\n        margin-left: 4px !important;\n    }\n    \n    .menu-box {\n        position: fixed;\n        right: 10px;\n        top: 50%;\n        transform: translateY(-50%);\n        display: flex;\n        flex-direction: column;\n        z-index: 1000;\n        gap: 6px;\n    }\n    \n    .menu-btn {\n        display: inline-block;\n        min-width: 80px;\n        padding: 7px 12px;\n        border-radius: 4px;\n        color: white !important;\n        text-decoration: none;\n        font-weight: bold;\n        font-size: 12px;\n        text-align: center;\n        cursor: pointer;\n        transition: all 0.3s ease;\n        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);\n        border: none;\n        line-height: 1.3;\n        margin: 0;\n    }\n    \n    .menu-btn:hover {\n        transform: translateY(-1px);\n        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);\n        opacity: 0.9;\n    }\n    \n    .menu-btn:active {\n        transform: translateY(0);\n        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);\n    }\n    \n    .do-hide {\n        display: none !important;\n    }\n    \n    .main-tab-btn {\n        border-bottom:none !important; \n        border-radius:3px !important; \n        height: 30px; \n        margin-left: 5px !important; \n    }\n\n    .jhs-icon {\n        width: 16px;\n        height: 16px;\n    }\n    \n    .tool-box .jhs-icon {\n        width: 1.5rem;\n        height: 1.5rem; \n    }\n     \n    .tabulator{\n        margin: 0 !important;\n    }\n    \n    /* Prevent table buttons from overflowing and being hidden*/\n    .tabulator .tabulator-row .action-cell-dropdown {\n        overflow: visible !important;\n    }\n    /* Remove mouse pointer hand on rows*/\n    .tabulator .tabulator-row.tabulator-selectable:hover {\n        cursor: default !important;\n    }\n    \n    /* Sort arrow color */\n    .tabulator .tabulator-col.tabulator-sortable[aria-sort="ascending"] .tabulator-arrow {\n        border-bottom-color: #337ab7 !important;\n    }\n    .tabulator .tabulator-col.tabulator-sortable[aria-sort="descending"] .tabulator-arrow {\n        border-top-color: #337ab7 !important;\n    }\n    \n    /* Modify styles for collapsed row containers or content */\n    .tabulator-responsive-collapse {\n        border-top: none !important;\n    }\n    \n    .tabulator-responsive-collapse table{\n        margin-left: 50px !important;\n    }\n    \n    .tabulator-cell {\n        height:auto !important;\n    }\n    \n    /* Allow column text to wrap, remove ellipsis */\n    .tabulator .tabulator-cell {\n        white-space: normal !important; \n        text-overflow: clip !important; \n    }\n    \n    .tabulator-tableholder {\n        overflow-x: hidden !important;\n    }\n\n    ${(function () {
  const changeScrollbarClassList = [
      '.jhs-scrollbar',
      '.content-panel',
      '.tabulator-tableholder',
      '.has-navbar-fixed-top',
      '.layui-layer-content',
    ],
    createSelectorList = (classList, pseudoElement) =>
      classList.map((className) => `${className}${pseudoElement}`).join(','),
    pseudoElements_track = '::-webkit-scrollbar-track',
    pseudoElements_thumb = '::-webkit-scrollbar-thumb',
    pseudoElements_hover = '::-webkit-scrollbar-thumb:hover';
  return `\n    ${createSelectorList(
    changeScrollbarClassList,
    '::-webkit-scrollbar',
  )}{width:6px;height:6px;}\n    ${createSelectorList(
    changeScrollbarClassList,
    pseudoElements_track,
  )}{background:#f1f1f1;border-radius:10px;}\n    ${createSelectorList(
    changeScrollbarClassList,
    pseudoElements_thumb,
  )}{background:#888;border-radius:10px;}\n    ${createSelectorList(
    changeScrollbarClassList,
    pseudoElements_hover,
  )}{background:#555;}\n    `
    .trim()
    .replace(/\n/g, '');
})()}\n</style>\n`;

function insertStyle(css) {
  if (css)
    if (css.includes('<style>'))
      document.head.insertAdjacentHTML('beforeend', css);
    else {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    }
}

isJavBus && insertStyle(javBusStyle);

isJavDb && insertStyle(javdbStyle);

insertStyle(
  '\n<style>\n    .a-normal, /* White */\n    .a-primary, /* Light blue */\n    .a-success, /* Light green */\n    .a-danger, /* Light pink */\n    .a-warning, /* Light orange */\n    .a-info /* Gray */\n    {\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        padding: 6px 14px;\n        margin-right: 10px;\n        border-radius: 6px;\n        text-decoration: none;\n        font-size: 13px;\n        font-weight: 500;\n        transition: all 0.2s ease;\n        cursor: pointer;\n        border: 1px solid rgba(0, 0, 0, 0.08);\n        white-space: nowrap;\n    }\n    \n    .a-primary {\n        background: #e0f2fe;\n        color: #0369a1;\n        border-color: #bae6fd;\n    }\n    \n    .a-primary:hover {\n        background: #bae6fd;\n    }\n    \n    .a-success {\n        background: #dcfce7;\n        color: #166534;\n        border-color: #bbf7d0;\n    }\n    \n    .a-success:hover {\n        background: #bbf7d0;\n    }\n    \n    .a-danger {\n        background: #fee2e2;\n        color: #b91c1c;\n        border-color: #fecaca;\n    }\n    \n    .a-danger:hover {\n        background: #fecaca;\n    }\n    \n    .a-warning {\n        background: #ffedd5;\n        color: #9a3412;\n        border-color: #fed7aa;\n    }\n    \n    .a-warning:hover {\n        background: #fed7aa;\n    }\n    \n    .a-info {\n        background: #e2e8f0;\n        color: #334155;\n        border-color: #cbd5e1;\n    }\n    \n    .a-info:hover {\n        background: #cbd5e1;\n    }\n    \n    .a-normal {\n        background: transparent;\n        color: #64748b;\n        border-color: #cbd5e1;\n    }\n    \n    .a-normal:hover {\n        background: #f8fafc;\n    }\n</style>\n',
);

insertStyle(mainCss);

_StorageManager_instances = new WeakSet();

setItem_fn = async function (key, data) {
  key === this.favorite_actresses_key &&
    window.clean_cacheFavoriteActressList();
  key === this.blacklist_car_list_key && window.clean_cacheBlacklistCarList();
  key === this.setting_key && window.clean_cacheSettingObj();
  key === this.car_list_key && window.clean_cacheCarList();
  await this.forage.setItem(key, data);
};

saveFilterItem_fn = async function (items, storageKey, itemName) {
  let itemList;
  if (Array.isArray(items)) itemList = [...items];
  else {
    itemList = (await this.forage.getItem(storageKey)) || [];
    if (itemList.includes(items)) {
      const errorMsg = `${items} ${itemName} already exists`;
      show.error(errorMsg);
      throw new Error(errorMsg);
    }
    itemList.push(items);
  }
  await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
    this,
    storageKey,
    itemList,
  );
  return itemList;
};

let StorageManager = class _StorageManager {
  constructor() {
    (obj = this),
      (member = _StorageManager_instances).has(obj)
        ? __typeError('Cannot add the same private member more than once')
        : member instanceof WeakSet
        ? member.add(obj)
        : member.set(obj, value);
    var obj, member, value;
    __publicField(this, 'car_list_key', 'car_list');
    __publicField(this, 'filter_keyword_title_key', 'filter_keyword_title');
    __publicField(this, 'filter_keyword_review_key', 'filter_keyword_review');
    __publicField(this, 'setting_key', 'setting');
    __publicField(this, 'blacklist_key', 'blacklist');
    __publicField(this, 'blacklist_car_list_key', 'blacklist_car_list');
    __publicField(this, 'favorite_actresses_key', 'favorite_actresses');
    __publicField(this, 'highlighted_tags_key', 'highlighted_tags');
    __publicField(
      this,
      'forage',
      localforage.createInstance({
        driver: localforage.INDEXEDDB,
        name: 'JAV-JHS',
        version: 1,
        storeName: 'appData',
      }),
    );
    __publicField(this, 'cacheCarList', null);
    __publicField(this, 'cacheBlacklistCarList', null);
    __publicField(this, 'cacheFavoriteActressList', null);
    __publicField(this, 'cacheSettingObj', null);
    if (_StorageManager.instance)
      throw new Error('StorageManager has already been instantiated!');
    _StorageManager.instance = this;
  }
  async getCarList() {
    if (this.cacheCarList) return utils.copyObj(this.cacheCarList);
    this.cacheCarList = (await this.forage.getItem(this.car_list_key)) || [];
    return utils.copyObj(this.cacheCarList);
  }
  async getCar(carNum2) {
    return (await this.getCarList()).find((item) => item.carNum === carNum2);
  }
  _handleSingleCar(carParam, carList) {
    let {
      carNum: carNum2,
      url: url,
      names: names,
      actionType: actionType,
      publishTime: publishTime,
      starId: starId,
    } = carParam;
    if (!carNum2) {
      show.error('Car number is empty!');
      throw new Error('Car number is empty!');
    }
    if (!url) {
      show.error('URL is empty!');
      throw new Error('URL is empty!');
    }
    url.includes('http') || (url = window.location.origin + url);
    names && (names = names.trim());
    let carData = carList.find((item) => item.carNum === carNum2);
    if (carData) {
      names && (carData.names = names);
      url && (carData.url = url);
      publishTime && (carData.publishTime = publishTime);
      carData.updateDate = utils.getNowStr();
    } else {
      let nowStr = utils.getNowStr();
      carData = {
        carNum: carNum2,
        url: url,
        names: names,
        status: '',
        createDate: nowStr,
        updateDate: nowStr,
        publishTime: publishTime,
      };
      starId && (carData.starId = starId);
      carList.push(carData);
    }
    switch (actionType) {
      case Status_FILTER:
        if (carData.status === Status_FILTER) {
          const msg2 = `${carNum2} is already in the block list`;
          show.error(msg2);
          throw new Error(msg2);
        }
        carData.status = Status_FILTER;
        break;

      case Status_FAVORITE:
        if (carData.status === Status_FAVORITE) {
          const msg2 = `${carNum2} is already in the favorites list`;
          show.error(msg2);
          throw new Error(msg2);
        }
        carData.status = Status_FAVORITE;
        break;

      case Status_HAS_DOWN:
        carData.status = Status_HAS_DOWN;
        break;

      case Status_HAS_WATCH:
        carData.status = Status_HAS_WATCH;
        break;

      default:
        const msg =
          'actionType error, please contact the author for correction: ' +
          actionType;
        show.error(msg);
        throw new Error(msg);
    }
  }
  async saveCar(carData) {
    const carList = (await this.forage.getItem(this.car_list_key)) || [];
    this._handleSingleCar(carData, carList);
    await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
      this,
      this.car_list_key,
      carList,
    );
    await this.removeNewVideoList([carData.carNum]);
  }
  async updateCarInfo(carParam) {
    let {
      carNum: carNum2,
      url: url,
      names: names,
      actionType: actionType,
      publishTime: publishTime,
      remark: remark,
    } = carParam;
    if (!carNum2) {
      show.error('Car number is empty!');
      throw new Error('Car number is empty!');
    }
    if (!url) {
      show.error('URL is empty!');
      throw new Error('URL is empty!');
    }
    names && (names = names.trim());
    const carList = (await this.forage.getItem(this.car_list_key)) || [];
    let carData = carList.find((item) => item.carNum === carNum2);
    if (!carData) {
      const msg = 'Data does not exist: ' + carNum2;
      show.error(msg);
      throw new Error(msg);
    }
    carData.names = names;
    carData.url = url;
    carData.remark = remark;
    carData.updateDate = utils.getNowStr();
    switch (actionType) {
      case Status_FILTER:
        carData.status = Status_FILTER;
        break;

      case Status_FAVORITE:
        carData.status = Status_FAVORITE;
        break;

      case Status_HAS_DOWN:
        carData.status = Status_HAS_DOWN;
        break;

      case Status_HAS_WATCH:
        carData.status = Status_HAS_WATCH;
        break;

      default:
        const msg =
          'actionType error, please contact the author for correction: ' +
          actionType;
        show.error(msg);
        throw new Error(msg);
    }
    await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
      this,
      this.car_list_key,
      carList,
    );
  }
  async saveCarList(carRecords) {
    if (!carRecords || !Array.isArray(carRecords) || 0 === carRecords.length) {
      show.error('Record list is empty!');
      throw new Error('Record list is empty!');
    }
    const carList = (await this.forage.getItem(this.car_list_key)) || [];
    for (const record of carRecords)
      try {
        this._handleSingleCar(record, carList);
      } catch (error) {
        throw error;
      }
    await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
      this,
      this.car_list_key,
      carList,
    );
  }
  async removeNewVideoList(carNumList) {
    const favoriteActressesList = await this.getFavoriteActressList();
    let hasAnyListBeenModified = !1;
    const updatedActressList = favoriteActressesList.map((actress) => {
      if (!actress.newVideoList || !Array.isArray(actress.newVideoList))
        return actress;
      const newFilteredVideoList = actress.newVideoList.filter(
        (carNumString) => {
          const isRemoved = carNumList.includes(carNumString);
          if (isRemoved) {
            clog.log(
              'Removing related actress new work',
              actress.name,
              carNumString,
            );
            hasAnyListBeenModified = !0;
          }
          return !isRemoved;
        },
      );
      return {
        ...actress,
        newVideoList: newFilteredVideoList,
      };
    });
    hasAnyListBeenModified &&
      (await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
        this,
        this.favorite_actresses_key,
        updatedActressList,
      ));
  }
  async removeCar(carNum2) {
    const carList = await this.getCarList(),
      initialLength = carList.length,
      updatedList = carList.filter((car) => car.carNum !== carNum2);
    if (updatedList.length === initialLength) {
      show.error(`${carNum2} does not exist`);
      return !1;
    }
    await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
      this,
      this.car_list_key,
      updatedList,
    );
    return !0;
  }
  async batchRemoveCars(carNumList) {
    if (!carNumList || 0 === carNumList.length)
      throw new Error('No parameters passed');
    const carList = await this.getCarList(),
      initialLength = carList.length,
      carNumsSet = new Set(carNumList),
      updatedList = carList.filter((car) => !carNumsSet.has(car.carNum)),
      removedCount = initialLength - updatedList.length;
    if (0 === removedCount) return removedCount;
    await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
      this,
      this.car_list_key,
      updatedList,
    );
    return removedCount;
  }
  async getBlacklist() {
    return (await this.forage.getItem(this.blacklist_key)) || [];
  }
  async addBlacklistItem(item) {
    let {
      starId: starId,
      name: name2,
      allName: allName,
      role: role,
      movieType: movieType,
      url: url,
    } = item;
    if (!starId) throw new Error('Missing starId');
    if (!name2) throw new Error('Missing name');
    if (!role) throw new Error('Missing role');
    const blacklist = await this.getBlacklist(),
      existData = blacklist.find((item2) => item2.starId === starId);
    if (existData) {
      existData.url = url;
      existData.role = role;
      existData.movieType = movieType;
      clog.log('Updating blacklist actor information', existData);
    } else {
      const info = {
        starId: starId,
        name: name2,
        allName: allName || [name2],
        createTime: utils.getNowStr(),
        role: role,
        movieType: movieType,
        url: url,
      };
      blacklist.push(info);
      clog.log('Adding blacklist actor information', info);
    }
    await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
      this,
      this.blacklist_key,
      blacklist,
    );
  }
  async updateBlacklistItem(item) {
    if (!item || !item.starId) throw new Error('Incomplete parameters');
    const filterActorActressInfoList = await this.getBlacklist(),
      waitUpdateObj = filterActorActressInfoList.find(
        (i) => i.starId === item.starId,
      );
    if (!waitUpdateObj)
      throw new Error(
        `Blacklist actor information not found: ${item.name} ${item.starId}`,
      );
    item.checkTime && (waitUpdateObj.checkTime = item.checkTime);
    item.lastPublishTime &&
      (waitUpdateObj.lastPublishTime = item.lastPublishTime);
    await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
      this,
      this.blacklist_key,
      filterActorActressInfoList,
    );
  }
  async deleteBlacklistItem(starId) {
    const blacklist = await this.getBlacklist(),
      updatedList = blacklist.filter((item) => item.starId !== starId);
    blacklist.length !== updatedList.length &&
      (await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
        this,
        this.blacklist_key,
        updatedList,
      ));
  }
  async getBlacklistCarList() {
    if (this.cacheBlacklistCarList && this.cacheBlacklistCarList.length > 0)
      return utils.deepFreeze(this.cacheBlacklistCarList);
    this.cacheBlacklistCarList =
      (await this.forage.getItem(this.blacklist_car_list_key)) || [];
    setTimeout(() => {
      utils.deepFreeze(this.cacheBlacklistCarList);
    }, 0);
    return this.cacheBlacklistCarList;
  }
  async batchSaveBlacklistCarList(carDataList) {
    const carList = await this.getCarList();
    let blacklistCarList = await this.getBlacklistCarList(),
      hasChanged = !1,
      copyBlacklistCarList = null,
      carNumList = [];
    for (const carData of carDataList) {
      let existBlacklistCarData = blacklistCarList.find(
        (item) => item.carNum === carData.carNum,
      );
      if (existBlacklistCarData) {
        console.log('Already in identification record', existBlacklistCarData);
        continue;
      }
      let existCarData = carList.find((item) => item.carNum === carData.carNum);
      if (existCarData)
        console.log('Already in identification record', existCarData);
      else {
        copyBlacklistCarList ||
          (copyBlacklistCarList = utils.copyObj(blacklistCarList));
        this._handleSingleCar(carData, copyBlacklistCarList);
        clog.log(
          `Blocking actress car number: <span style="color: #f40">${carData.names} ${carData.carNum}</span>`,
        );
        hasChanged = !0;
        carNumList.push(carData.carNum);
      }
    }
    if (hasChanged) {
      if (!copyBlacklistCarList)
        throw new Error(
          'Program error, blacklist car number data object is empty!',
        );
      await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
        this,
        this.blacklist_car_list_key,
        copyBlacklistCarList,
      );
      await this.removeNewVideoList(carNumList);
    }
  }
  async removeBlacklistCarList(starId) {
    const filterActorActressCarList = await this.getBlacklistCarList(),
      newList = filterActorActressCarList.filter(
        (car) => car.starId !== starId,
      );
    newList.length !== filterActorActressCarList.length &&
      (await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
        this,
        this.blacklist_car_list_key,
        newList,
      ));
  }
  async batchRemoveBlacklistCars(carNumList) {
    if (!carNumList || 0 === carNumList.length)
      throw new Error('No parameters passed');
    const blacklistCarList = await this.getBlacklistCarList(),
      initialLength = blacklistCarList.length,
      carNumsSet = new Set(carNumList),
      updatedList = blacklistCarList.filter(
        (car) => !carNumsSet.has(car.carNum),
      ),
      removedCount = initialLength - updatedList.length;
    if (0 === removedCount) return removedCount;
    await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
      this,
      this.blacklist_car_list_key,
      updatedList,
    );
    return removedCount;
  }
  async getFavoriteActressList() {
    if (this.cacheFavoriteActressList)
      return utils.copyObj(this.cacheFavoriteActressList);
    this.cacheFavoriteActressList =
      (await this.forage.getItem(this.favorite_actresses_key)) || [];
    return utils.copyObj(this.cacheFavoriteActressList);
  }
  async addFavoriteActressList(actressList) {
    const favoriteActressesInfoList = await this.getFavoriteActressList();
    let resultCount = 0;
    for (const actress of actressList) {
      let {
        starId: starId,
        name: name2,
        allName: allName,
        avatar: avatar,
        lastCheckTime: lastCheckTime,
        lastPublishTime: lastPublishTime,
        actressType: actressType,
      } = actress;
      if (!starId) throw new Error('Missing starId');
      if (!name2) throw new Error('Missing name');
      allName || (allName = [name2]);
      const uncensoredText = '(無碼)'; // Uncensored
      if (!actressType) {
        actressType =
          name2.includes(uncensoredText) ||
          allName.some((element) => element.includes(uncensoredText))
            ? 'uncensored'
            : 'censored';
      }
      name2 = name2.replace(uncensoredText, '');
      allName = allName.map((n) => n.replace(uncensoredText, ''));
      let favoriteActresses = favoriteActressesInfoList.find(
        (item) => item.starId === starId,
      );
      if (favoriteActresses) {
        if (
          (!favoriteActresses.avatar ||
            !favoriteActresses.avatar.includes('https')) &&
          avatar
        ) {
          clog.log(avatar);
          favoriteActresses.avatar = avatar;
          clog.log(
            `<span style="color: #f40">Completing actress avatar: ${name2}</span>`,
          );
          resultCount++;
        }
        if (!favoriteActresses.actressType && actressType) {
          favoriteActresses.actressType = actressType;
          clog.log(
            `<span style="color: #f40">Completing actress category: ${name2} ${actressType}</span>`,
          );
          resultCount++;
        }
        if (favoriteActresses.name.includes(uncensoredText)) {
          favoriteActresses.name = name2;
          favoriteActresses.allName = allName;
          clog.log(
            `<span style="color: #f40">Correcting actress name: ${name2} ${allName}</span>`,
          );
          resultCount++;
        }
        continue;
      }
      const nowStr = utils.getNowStr();
      favoriteActressesInfoList.push({
        starId: starId,
        name: name2,
        allName: allName,
        avatar: avatar,
        lastCheckTime: lastCheckTime,
        lastPublishTime: lastPublishTime,
        createDate: nowStr,
        updateDate: nowStr,
        actressType: actressType,
      });
      clog.log(
        `<span style="color: #f40">Syncing favorited actresses from JavDB: ${name2}</span>`,
      );
      resultCount++;
    }
    resultCount > 0
      ? await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
          this,
          this.favorite_actresses_key,
          favoriteActressesInfoList,
        )
      : clog.log(
          'Information already recorded, no actresses need to be synced for collection',
        );
    return resultCount;
  }
  async removeFavoriteActress(starId) {
    const favoriteActressesInfoList = await this.getFavoriteActressList(),
      initialLength = favoriteActressesInfoList.length,
      updatedList = favoriteActressesInfoList.filter(
        (car) => car.starId !== starId,
      );
    if (updatedList.length === initialLength) {
      clog.error(`Failed to remove actress, ${starId} does not exist`);
      return !1;
    }
    await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
      this,
      this.favorite_actresses_key,
      updatedList,
    );
    return !0;
  }
  async updateFavoriteActress(actress) {
    const favoriteActressesInfoList = await this.getFavoriteActressList(),
      {
        starId: starId,
        name: name2,
        allName: allName,
        avatar: avatar,
        lastCheckTime: lastCheckTime,
        newVideoList: newVideoList,
        lastPublishTime: lastPublishTime,
        actressType: actressType,
        remark: remark,
      } = actress;
    if (!starId) throw new Error('Missing starId');
    let favoriteActresses = favoriteActressesInfoList.find(
      (item) => item.starId === starId,
    );
    if (!favoriteActresses) {
      clog.error('Actress information not found', starId, name2);
      return !1;
    }
    name2 && (favoriteActresses.name = name2);
    allName && (favoriteActresses.allName = allName);
    avatar && (favoriteActresses.avatar = avatar);
    null != actressType && (favoriteActresses.actressType = actressType);
    lastCheckTime && (favoriteActresses.lastCheckTime = lastCheckTime);
    newVideoList && (favoriteActresses.newVideoList = newVideoList);
    lastPublishTime && (favoriteActresses.lastPublishTime = lastPublishTime);
    remark && (favoriteActresses.remark = remark);
    favoriteActresses.updateDate = utils.getNowStr();
    await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
      this,
      this.favorite_actresses_key,
      favoriteActressesInfoList,
    );
  }
  async getHighlightedTags() {
    return (await this.forage.getItem(this.highlighted_tags_key)) || [];
  }
  async setHighlightedTags(highlightedTags) {
    return await __privateMethod(
      this,
      _StorageManager_instances,
      setItem_fn,
    ).call(this, this.highlighted_tags_key, highlightedTags);
  }
  async saveTitleFilterKeyword(keywords) {
    await __privateMethod(
      this,
      _StorageManager_instances,
      saveFilterItem_fn,
    ).call(this, keywords, this.filter_keyword_title_key, 'Title keyword');
    if (Array.isArray(keywords)) return null;
    const favoriteActressesList = await this.getFavoriteActressList();
    let hasAnyListBeenModified = !1;
    const updatedActressList = favoriteActressesList.map((actress) => {
      if (!actress.newVideoList || !Array.isArray(actress.newVideoList))
        return actress;
      const newFilteredVideoList = actress.newVideoList.filter(
        (carNumString) => {
          const isRemoved = carNumString.startsWith(keywords);
          if (isRemoved) {
            clog.log(
              'Removing related actress new work',
              actress.name,
              carNumString,
            );
            hasAnyListBeenModified = !0;
          }
          return !isRemoved;
        },
      );
      return {
        ...actress,
        newVideoList: newFilteredVideoList,
      };
    });
    hasAnyListBeenModified &&
      (await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
        this,
        this.favorite_actresses_key,
        updatedActressList,
      ));
  }
  async getTitleFilterKeyword() {
    return (await this.forage.getItem(this.filter_keyword_title_key)) || [];
  }
  async getReviewFilterKeywordList() {
    return (await this.forage.getItem(this.filter_keyword_review_key)) || [];
  }
  async saveReviewFilterKeyword(keywords) {
    return __privateMethod(
      this,
      _StorageManager_instances,
      saveFilterItem_fn,
    ).call(this, keywords, this.filter_keyword_review_key, 'Comment keyword');
  }
  async getSetting(attribute = null, defaultVal) {
    this.cacheSettingObj ||
      (this.cacheSettingObj =
        (await this.forage.getItem(this.setting_key)) || {});
    let settingObj = utils.copyObj(this.cacheSettingObj);
    if (null === attribute) return settingObj;
    const value = settingObj[attribute];
    return value
      ? 'true' === value || 'false' === value
        ? 'true' === value.toLowerCase()
        : 'string' != typeof value ||
          '' === value.trim() ||
          isNaN(Number(value))
        ? value
        : Number(value)
      : defaultVal;
  }
  async saveSetting(settingObj) {
    settingObj
      ? await __privateMethod(this, _StorageManager_instances, setItem_fn).call(
          this,
          this.setting_key,
          settingObj,
        )
      : show.error('Setting object is empty');
  }
  async saveSettingItem(key, value) {
    if (!key) {
      show.error('Key cannot be empty');
      return;
    }
    let settingObj = await this.getSetting();
    settingObj[key] = value;
    await this.saveSetting(settingObj);
  }
  async importData(jsonData) {
    await this.forage.clear();
    const importPromises = [];
    for (const key in jsonData) {
      const value = jsonData[key],
        setPromise = __privateMethod(
          this,
          _StorageManager_instances,
          setItem_fn,
        ).call(this, key, value);
      importPromises.push(setPromise);
    }
    await Promise.all(importPromises);
  }
  async exportData() {
    const dataMap = {};
    await this.forage.iterate((value, key) => {
      dataMap[key] = value;
    });
    if (0 === Object.keys(dataMap).length) throw new Error('No data to export');
    return dataMap;
  }
};

const apiUrl = 'https://jdforrepam.com/api';

function buildSignature() {
  const curr = Math.floor(Date.now() / 1e3),
    stored_sign = localStorage.getItem('jhs_jdsignature');
  if (stored_sign) {
    const parts = stored_sign.split('.');
    if (3 === parts.length) {
      if (curr - parseInt(parts[0]) <= 300) return stored_sign;
    }
  }
  const sign = `${curr}.lpw6vgqzsp.${md5(
    `${curr}71cf27bb3c0bcdf207b64abecddc970098c7421ee7203b9cdae54478478a199e7d5a6e1a57691123c1a931c057842fb73ba3b3c83bcd69c17ccf174081e3d8aa`,
  )}`;
  localStorage.setItem('jhs_jdsignature', sign);
  return sign;
}

const _updateImgServer = (originalStr) =>
    originalStr.replace(
      /https:\/\/.*?\/rhe951l4q/g,
      'https://c0.jdbstatic.com',
    ),
  javDbApi = {
    getReviews: async (movieId, pageNum = 1, pageSize = 20) => {
      let url = `${apiUrl}/v1/movies/${movieId}/reviews`,
        headers = {
          jdSignature: await buildSignature(),
        };
      return (
        await gmHttp.get(
          url,
          {
            page: pageNum,
            sort_by: 'hotly',
            limit: pageSize,
          },
          headers,
        )
      ).data.reviews;
    },
    searchMovie: async (keyword) => {
      let url = `${apiUrl}/v2/search`,
        headers = {
          'user-agent': 'Dart/3.5 (dart:io)',
          'accept-language': 'zh-TW', // Traditional Chinese
          host: 'jdforrepam.com',
          jdsignature: await buildSignature(),
        },
        params = {
          q: keyword,
          page: 1,
          type: 'movie',
          limit: 1,
          movie_type: 'all',
          from_recent: 'false',
          movie_filter_by: 'all',
          movie_sort_by: 'relevance',
        };
      return (await gmHttp.get(url, params, headers)).data.movies;
    },
    getMovieDetail: async (movieId) => {
      let url = `${apiUrl}/v4/movies/${movieId}`,
        headers = {
          jdSignature: await buildSignature(),
        };
      const res = await gmHttp.get(url, null, headers);
      if (!res.data) {
        show.error('Failed to get video details: ' + res.message);
        throw new Error(res.message);
      }
      const movie = res.data.movie,
        preview_images = movie.preview_images,
        imgList = [];
      preview_images.forEach((item) => {
        const newSrc = _updateImgServer(item.large_url);
        imgList.push(newSrc);
      });
      return {
        movieId: movie.id,
        actors: movie.actors,
        duration: movie.duration,
        title: movie.origin_title,
        carNum: movie.number,
        score: movie.score,
        releaseDate: movie.release_date,
        watchedCount: movie.watched_count,
        imgList: imgList,
      };
    },
    related: async (movieId, page = 1, limit = 20) => {
      let url = `${apiUrl}/v1/lists/related?movie_id=${movieId}&page=${page}&limit=${limit}`,
        headers = {
          jdSignature: await buildSignature(),
        };
      const res = await gmHttp.get(url, null, headers),
        dataList = [];
      res.data.lists.forEach((item) => {
        dataList.push({
          relatedId: item.id,
          name: item.name,
          movieCount: item.movies_count,
          collectionCount: item.collections_count,
          viewCount: item.views_count,
          createTime: utils.formatDate(item.created_at),
        });
      });
      return dataList;
    },
    getMagnets: async (movieId) => {
      let url = `${apiUrl}/v1/movies/${movieId}/magnets`,
        headers = {
          jdSignature: await buildSignature(),
        };
      return (await gmHttp.get(url, null, headers)).data.magnets;
    },
    playback: async (period = 'daily', filter_by = 'high_score') => {
      let url = `${apiUrl}/v1/rankings/playback?period=${period}&filter_by=${filter_by}`,
        headers = {
          jdSignature: await buildSignature(),
        };
      return (await gmHttp.get(url, null, headers)).data.movies;
    },
    login: async (username, password) => {
      let url = `${apiUrl}/v1/sessions?username=${encodeURIComponent(
          username,
        )}&password=${encodeURIComponent(
          password,
        )}&device_uuid=04b9534d-5118-53de-9f87-2ddded77111e&device_name=iPhone&device_model=iPhone&platform=ios&system_version=17.4&app_version=official&app_version_number=1.9.29&app_channel=official`,
        headers = {
          'user-agent': 'Dart/3.5 (dart:io)',
          'accept-language': 'zh-TW', // Traditional Chinese
          'content-type':
            'multipart/form-data; boundary=--dio-boundary-2210433284',
          jdsignature: await buildSignature(),
        };
      return await gmHttp.post(url, null, headers);
    },
    top250: async (type = 'all', type_value = '', page = 1, limit = 40) => {
      let url = `${apiUrl}/v1/movies/top?start_rank=1&type=${type}&type_value=${type_value}&ignore_watched=false&page=${page}&limit=${limit}`,
        headers = {
          'user-agent': 'Dart/3.5 (dart:io)',
          'accept-language': 'zh-TW', // Traditional Chinese
          host: 'jdforrepam.com',
          authorization:
            'Bearer ' + localStorage.getItem('jhs_appAuthorization'),
          jdsignature: await buildSignature(),
        };
      return await gmHttp.get(url, null, headers);
    },
    buildSignature: buildSignature,
    markDataListHtml: (movies) => {
      let moviesHtml = '';
      movies.forEach((movie) => {
        const newSrc = _updateImgServer(movie.cover_url);
        moviesHtml += `\n            <div class="item" id="${
          movie.id
        }">\n                <a href="/v/${movie.id}" class="box" title="${
          movie.origin_title
        }">\n                    <div class="cover ">\n                        <img loading="lazy" src="${newSrc}" alt="">\n                    </div>\n                    <div class="video-title"><strong>${
          movie.number
        }</strong> ${
          movie.origin_title
        }</div>\n                    <div class="score" id="score_${
          movie.id
        }">\n                    </div>\n                    <div class="meta">\n                        ${
          movie.release_date
        }\n                    </div>\n                    <div class="tags has-addons">\n                       ${
          movie.has_cnsub
            ? '<span class="tag is-warning">Contains Chinese subtitle magnet link</span>'
            : movie.magnets_count > 0
            ? '<span class="tag is-success">Contains magnet link</span>'
            : '<span class="tag is-info">No magnet link</span>'
        }\n                       ${
          movie.new_magnets
            ? '<span class="tag is-info">New seed today</span>'
            : ''
        }\n                    </div>\n                </a>\n            </div>\n        `;
      });
      return moviesHtml;
    },
  };

class Utils {
  constructor() {
    __publicField(this, 'intervalContainer', {});
    __publicField(this, 'mimeTypes', {
      txt: 'text/plain',
      html: 'text/html',
      css: 'text/css',
      csv: 'text/csv',
      json: 'application/json',
      xml: 'application/xml',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      mp4: 'video/mp4',
      webm: 'video/webm',
      ogg: 'audio/ogg',
    });
    __publicField(this, 'timers', new Map());
    __publicField(this, 'insertStyle', (css) => {
      if (css) {
        -1 === css.indexOf('<style>') && (css = '<style>' + css + '</style>');
        $('head').append(css);
      }
    });
    __publicField(this, 'layerIndexStack', []);
    Utils.instance || (Utils.instance = this);
    return Utils.instance;
  }
  importResource(url) {
    let tag;
    if (url.indexOf('css') >= 0) {
      tag = document.createElement('link');
      tag.setAttribute('rel', 'stylesheet');
      tag.href = url;
    } else {
      tag = document.createElement('script');
      tag.setAttribute('type', 'text/javascript');
      tag.src = url;
    }
    document.documentElement.appendChild(tag);
  }
  openPage(url, title, shadeClose, event) {
    if (!url) throw new Error('URL not provided');
    shadeClose = shadeClose ?? !0;
    if (event && (event.ctrlKey || event.metaKey)) {
      GM_openInTab(url.includes('http') ? url : window.location.origin + url, {
        insert: 0,
      });
      return;
    }
    let finalUrl = url;
    url.includes('/actors/') ||
      url.includes('/star/') ||
      (finalUrl = url.includes('?') ? `${url}&hideNav=1` : `${url}?hideNav=1`);
    layer.open({
      type: 2,
      title: title,
      content: finalUrl,
      scrollbar: !1,
      shadeClose: shadeClose,
      area: this.getResponsiveArea(['85%', '90%']),
      isOutAnim: !1,
      anim: -1,
      success: (layero, index) => {
        this.setupEscClose(index);
      },
    });
  }
  _handleGlobalEscKey(e) {
    if ('Escape' !== e.key && 27 !== e.keyCode) return;
    if (0 === this.layerIndexStack.length) return;
    const topLayerIndex = this.layerIndexStack[this.layerIndexStack.length - 1],
      $layer = $(`#layui-layer${topLayerIndex}`);
    let viewerExists = !1;
    if ($layer.find('.viewer-container').length > 0) viewerExists = !0;
    else {
      const iframe = $layer.find(`#layui-layer-iframe${topLayerIndex}`)[0];
      if (iframe && iframe.contentDocument)
        try {
          $(iframe.contentDocument).find('.viewer-container').length > 0 &&
            (viewerExists = !0);
        } catch (error) {
          clog.warn(
            'Cannot check for .viewer-container inside cross-origin iframe',
          );
        }
    }
    if (!viewerExists) {
      this.layerIndexStack.pop();
      layer.close(topLayerIndex);
    }
  }
  setupEscClose(layerIndex) {
    var _a2;
    if (!this._boundHandler) {
      this._boundHandler = this._handleGlobalEscKey.bind(this);
      $(document).off('keydown.globalLayerEsc');
      $(document).on('keydown.globalLayerEsc', this._boundHandler);
    }
    -1 === this.layerIndexStack.indexOf(layerIndex) &&
      this.layerIndexStack.push(layerIndex);
    const $iframe = $(`#layui-layer-iframe${layerIndex}`),
      eventNamespace = `keydown.layerEsc${layerIndex}`;
    try {
      const iframeDocument =
        null == (_a2 = $iframe[0]) ? void 0 : _a2.contentDocument;
      if (iframeDocument) {
        if ('yes' === $iframe.attr('data-esc-bound')) return;
        $(iframeDocument).off(eventNamespace);
        $(iframeDocument).on(eventNamespace, this._boundHandler);
        $iframe.attr('data-esc-bound', 'yes');
      }
    } catch (e) {
      clog.error('iframe listening failed (cross-origin or not loaded):', e);
    }
  }
  closePage() {
    storageManager.getSetting('needClosePage', 'yes').then((needClosePage) => {
      if ('yes' !== needClosePage) return;
      parent.document.documentElement.style.overflow = 'auto';
      ['.layui-layer-shade', '.layui-layer-move', '.layui-layer'].forEach(
        function (selector) {
          const elements = parent.document.querySelectorAll(selector);
          if (elements.length > 0) {
            const elementToRemove =
              elements.length > 1 ? elements[elements.length - 1] : elements[0];
            elementToRemove.parentNode.removeChild(elementToRemove);
          }
        },
      );
      window.close();
    });
  }
  loopDetector(
    condition,
    after,
    detectInterval = 20,
    timeout = 1e4,
    runWhenTimeout = !0,
  ) {
    const uuid = Math.random(),
      start = new Date().getTime(),
      stopAndRun = (shouldRun) => {
        clearInterval(this.intervalContainer[uuid]);
        shouldRun && after && after();
        delete this.intervalContainer[uuid];
      };
    this.intervalContainer[uuid] = setInterval(() => {
      const timeElapsed = new Date().getTime() - start;
      condition()
        ? stopAndRun(!0)
        : timeElapsed >= timeout && stopAndRun(runWhenTimeout);
    }, detectInterval);
  }
  rightClick(container, targetSelector, callback) {
    let containerElement;
    'string' == typeof container
      ? (containerElement = document.querySelector(container))
      : container instanceof HTMLElement && (containerElement = container);
    if (!containerElement) {
      console.warn(
        'rightClick(), Invalid or no container provided, will use document.body for global delegation.',
      );
      containerElement = document.body;
    }
    'string' == typeof targetSelector && '' !== targetSelector.trim()
      ? containerElement.addEventListener('contextmenu', (event) => {
          const targetElement = event.target.closest(targetSelector);
          targetElement && callback(event, targetElement);
        })
      : console.error('rightClick(), A valid targetSelector must be provided.');
  }
  q(event, msg, fun, cancelFun) {
    let x, y;
    if (event) {
      x = event.clientX - 130;
      y = event.clientY - 120;
    } else {
      x = window.innerWidth / 2 - 120;
      y = window.innerHeight / 2 - 120;
    }
    let confirmIndex = layer.confirm(
      msg,
      {
        offset: [y, x],
        title: 'Hint', // Changed from '提示'
        btn: ['Confirm', 'Cancel'], // Changed from ['确定', '取消']
        shade: 0,
        zIndex: 999999991,
      },
      function () {
        fun && fun();
        layer.close(confirmIndex);
      },
      function () {
        cancelFun && cancelFun();
      },
    );
  }
  alert(event, msg, yesFun) {
    let offset;
    event && (offset = [event.clientX - 200, event.clientY - 120]);
    let confirmIndex = layer.alert(
      msg,
      {
        offset: offset,
        shade: 0,
        zIndex: 999999991,
      },
      function () {
        yesFun && yesFun();
        layer.close(confirmIndex);
      },
    );
  }
  getNowStr(dateSplitStr = '-', timeSplitStr = ':', dateString = null) {
    let now;
    now = dateString ? new Date(dateString) : new Date();
    const year = now.getFullYear(),
      month = String(now.getMonth() + 1).padStart(2, '0'),
      day = String(now.getDate()).padStart(2, '0'),
      hours = String(now.getHours()).padStart(2, '0'),
      minutes = String(now.getMinutes()).padStart(2, '0'),
      seconds = String(now.getSeconds()).padStart(2, '0');
    return `${[year, month, day].join(dateSplitStr)} ${[
      hours,
      minutes,
      seconds,
    ].join(timeSplitStr)}`;
  }
  formatDate(date, dateSplitStr = '-', timeSplitStr = ':') {
    let targetDate;
    if (date instanceof Date) targetDate = date;
    else {
      if ('string' != typeof date)
        throw new Error(
          'Invalid date input: must be Date object or date string',
        );
      targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) throw new Error('Invalid date string');
    }
    const year = targetDate.getFullYear(),
      month = String(targetDate.getMonth() + 1).padStart(2, '0'),
      day = String(targetDate.getDate()).padStart(2, '0'),
      hours = String(targetDate.getHours()).padStart(2, '0'),
      minutes = String(targetDate.getMinutes()).padStart(2, '0'),
      seconds = String(targetDate.getSeconds()).padStart(2, '0');
    return `${[year, month, day].join(dateSplitStr)} ${[
      hours,
      minutes,
      seconds,
    ].join(timeSplitStr)}`;
  }
  getHourDifference(date1, date2) {
    const timestamp1 = date1.getTime(),
      timestamp2 = date2.getTime(),
      differenceInHours = Math.abs(timestamp2 - timestamp1) / 36e5;
    return Math.floor(differenceInHours);
  }
  download(data, fileName) {
    show.info('Starting download request...'); // Changed from '开始请求下载...'
    const fileExtension = fileName.split('.').pop().toLowerCase();
    let blob,
      mimeType = this.mimeTypes[fileExtension] || 'application/octet-stream';
    if (data instanceof Blob) blob = data;
    else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data))
      blob = new Blob([data], {
        type: mimeType,
      });
    else if ('string' == typeof data && data.startsWith('data:')) {
      const byteString = atob(data.split(',')[1]),
        arrayBuffer = new ArrayBuffer(byteString.length),
        uintArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++)
        uintArray[i] = byteString.charCodeAt(i);
      blob = new Blob([uintArray], {
        type: mimeType,
      });
    } else
      blob = new Blob([data], {
        type: mimeType,
      });
    const url = URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
  smoothScrollToTop(duration = 500) {
    return new Promise((resolve) => {
      const start = performance.now(),
        startPosition = window.pageYOffset;
      window.requestAnimationFrame(function scrollStep(timestamp) {
        const elapsed = timestamp - start,
          progress = Math.min(elapsed / duration, 1),
          easeInOutCubic =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        window.scrollTo(0, startPosition * (1 - easeInOutCubic));
        progress < 1 ? window.requestAnimationFrame(scrollStep) : resolve();
      });
    });
  }
  simpleId() {
    return crypto.randomUUID().replace('-', '');
  }
  isUrl(urlString) {
    try {
      new URL(urlString);
      return !0;
    } catch (_) {
      return !1;
    }
  }
  setHrefParam(key, val) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set(key, val);
    window.history.pushState({}, '', newUrl.toString());
  }
  getUrlParam(url, key) {
    const searchString = url.split('?')[1];
    if (!searchString) return null;
    const regex = new RegExp(`(?:^|&)${key}=([^&]*)`),
      match = searchString.match(regex);
    let value = '';
    match &&
      match[1] &&
      (value = decodeURIComponent(match[1].replace(/\+/g, ' ')));
    return value
      ? 'true' === value || 'false' === value
        ? 'true' === value.toLowerCase()
        : 'string' != typeof value ||
          '' === value.trim() ||
          isNaN(Number(value))
        ? value
        : Number(value)
      : value;
  }
  reBuildSignature() {
    return javDbApi.buildSignature();
  }
  getResponsiveArea(defaultArea) {
    const screenWidth = window.innerWidth;
    return screenWidth >= 1200
      ? defaultArea || this.getDefaultArea()
      : screenWidth >= 768
      ? ['70%', '90%']
      : ['95%', '95%'];
  }
  getDefaultArea() {
    return ['85%', '90%'];
  }
  isMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    return [
      'iphone',
      'ipod',
      'ipad',
      'android',
      'blackberry',
      'windows phone',
      'nokia',
      'webos',
      'opera mini',
      'mobile',
      'mobi',
      'tablet',
    ].some((keyword) => userAgent.includes(keyword));
  }
  copyToClipboard(type, text) {
    navigator.clipboard
      .writeText(text)
      .then(() => show.info(`${type} copied to clipboard, ${text}`)) // Changed from '已复制到剪切板'
      .catch((err) => console.error('Copy failed: ', err)); // Changed from '复制失败'
  }
  htmlTo$dom(html) {
    const parser = new DOMParser();
    return $(parser.parseFromString(html, 'text/html'));
  }
  addCookie(cookieStr, options = {}) {
    const {
      maxAge: maxAge = 604800,
      path: path = '/',
      domain: domain = '',
      secure: secure = !1,
      sameSite: sameSite = 'Lax',
    } = options;
    cookieStr.split(';').forEach((cookie) => {
      const trimmed = cookie.trim();
      if (trimmed) {
        const parts = trimmed.split('=');
        if (parts.length >= 2 && parts[0].trim()) {
          let cookieParts = [`${parts[0].trim()}=${parts.slice(1).join('=')}`];
          maxAge > 0 && cookieParts.push(`max-age=${maxAge}`);
          cookieParts.push(`path=${path}`);
          domain && cookieParts.push(`domain=${domain}`);
          secure && cookieParts.push('Secure');
          sameSite && cookieParts.push(`SameSite=${sameSite}`);
          console.log("document.cookie = '" + cookieParts.join('; ') + "'");
          document.cookie = cookieParts.join('; ');
        }
      }
    });
  }
  isHidden(el) {
    const element = el.jquery ? el[0] : el;
    return (
      !element ||
      (element.offsetWidth <= 0 && element.offsetHeight <= 0) ||
      'none' === window.getComputedStyle(element).display
    );
  }
  time(label = 'default', unit = 's', precision = 2) {
    if (this.timers.has(label)) {
      const timer = this.timers.get(label),
        elapsedTime = performance.now() - timer.startTime;
      let formattedTime, unitLabel;
      if ('s' === timer.unit) {
        formattedTime = (elapsedTime / 1e3).toFixed(timer.precision);
        unitLabel = 'seconds'; // Changed from '秒'
      } else {
        formattedTime = elapsedTime.toFixed(timer.precision);
        unitLabel = 'milliseconds'; // Changed from '毫秒'
      }
      this.timers.delete(label);
      return `${label}: ${formattedTime}${unitLabel}`;
    }
    this.timers.set(label, {
      startTime: performance.now(),
      unit: unit,
      precision: precision,
    });
  }
  sleep(ms = 1e3) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  genericSort(arr, sortRules, emptyLast = !0) {
    if (!Array.isArray(arr) || 0 === arr.length) return [];
    if (!Array.isArray(sortRules) || 0 === sortRules.length) return [...arr];
    const sortedArr = [...arr],
      safeDateConvert = (value) => {
        if (value instanceof Date) return value;
        if ('string' == typeof value) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) return date;
        }
        return value;
      };
    return sortedArr.sort((a, b) => {
      for (const rule of sortRules) {
        const { key: key, order: order = 'asc' } = rule;
        let valA = a,
          valB = b;
        if (null != key)
          if ('function' == typeof key) {
            valA = key(a);
            valB = key(b);
          } else {
            valA = a && 'object' == typeof a ? a[key] : void 0;
            valB = b && 'object' == typeof b ? b[key] : void 0;
          }
        const dateA = safeDateConvert(valA),
          dateB = safeDateConvert(valB);
        let comparison = 0;
        const aIsNull = null == valA,
          bIsNull = null == valB;
        if (aIsNull && bIsNull) return 0;
        if (aIsNull) return emptyLast ? 1 : -1;
        if (bIsNull) return emptyLast ? 1 : -1;
        comparison =
          dateA instanceof Date && dateB instanceof Date
            ? dateA.getTime() - dateB.getTime()
            : 'number' == typeof valA && 'number' == typeof valB
            ? valA - valB
            : 'string' == typeof valA && 'string' == typeof valB
            ? valA.localeCompare(valB)
            : String(valA).localeCompare(String(valB));
        'desc' === order && (comparison *= -1);
        if (0 !== comparison) return comparison;
      }
      return 0;
    });
  }
  async retry(fun, tryCount = 3) {
    let runCount = 0;
    for (; runCount < tryCount; )
      try {
        const result = await fun();
        runCount > 0 &&
          clog.debug(`[Retry] Success, made ${runCount + 1} attempts.`); // Changed from '成功，共发起'
        return result;
      } catch (e) {
        let errorString = String(e);
        errorString.startsWith('Error: ') &&
          (errorString = errorString.replace('Error: ', ''));
        if (
          errorString.includes('Just a moment') ||
          errorString.includes('redirect') || // Changed from '重定向'
          errorString.toLowerCase().includes('404 page not found') ||
          errorString.toLowerCase().includes('404 not found')
        )
          throw e;
        runCount++;
        if (runCount === tryCount) {
          clog.debug(
            `[Retry] Reached maximum retry count (${tryCount}), ultimately failed:`,
            e,
          ); // Changed from '达到最大重试次数'
          throw e;
        }
        clog.debug(
          `[Retry] Preparing for the ${
            runCount + 1
          }th retry, error message: ${errorString}`, // Changed from '准备第' and '次重试, 错误信息:'
        );
      }
  }
  copyObj(data) {
    return JSON.parse(JSON.stringify(data));
  }
  deepFreeze(obj) {
    if (null === obj || 'object' != typeof obj || Object.isFrozen(obj))
      return obj;
    const propNames = Object.getOwnPropertyNames(obj);
    for (const name2 of propNames) {
      const value = obj[name2];
      value && 'object' == typeof value && this.deepFreeze(value);
    }
    return Object.freeze(obj);
  }
}
unsafeWindow.utils = window.utils = new Utils();

unsafeWindow.gmHttp = window.gmHttp = new (class {
  async get(url, params = {}, headers = {}, noRedirect) {
    return this.gmRequest('GET', url, null, params, headers, noRedirect);
  }
  post(url, data = {}, headers = {}) {
    headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
    let jsonData = JSON.stringify(data);
    return this.gmRequest('POST', url, jsonData, null, headers);
  }
  postForm(url, data = {}, headers = {}) {
    headers || (headers = {});
    headers['Content-Type'] ||
      (headers['Content-Type'] = 'application/x-www-form-urlencoded');
    let body = '';
    data &&
      Object.keys(data).length > 0 &&
      (body = Object.entries(data)
        .map(([key, value]) => `${key}=${value}`)
        .join('&'));
    return this.gmRequest('POST', url, body, null, headers);
  }
  postFileFormData(url, data = {}, headers = {}) {
    headers || (headers = {});
    const boundary = `----WebKitFormBoundary${Math.random()
      .toString(36)
      .substring(2)}`;
    headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
    let body = '';
    data &&
      Object.keys(data).length > 0 &&
      (body = Object.entries(data)
        .map(
          ([key, value]) =>
            `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`,
        )
        .join(''));
    body += `--${boundary}--`;
    return this.gmRequest('POST', url, body, null, headers);
  }
  async downloadFileInChunks(url, headers = {}) {
    const httpTimeout = await storageManager.getSetting('httpTimeout', 5e3),
      httpRetryCount = await storageManager.getSetting('httpRetryCount', 3);
    clog.log('Fetching file size...'); // Changed from '正在获取文件大小...'
    let fileSize, mimeType;
    try {
      const sizeResponse = await utils.retry(
        () =>
          new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: 'GET',
              url: url,
              headers: {
                ...headers,
                Range: 'bytes=0-0',
              },
              timeout: httpTimeout,
              onload: resolve,
              onerror: (e) =>
                reject(new Error('Network error: Failed to get file size')), // Changed from '网络错误：无法获取文件大小'
              ontimeout: () =>
                reject(new Error('Timeout: Failed to get file size')), // Changed from '超时：获取文件大小'
            });
          }),
        httpRetryCount,
      );
      if (206 !== sizeResponse.status && 200 !== sizeResponse.status)
        throw new Error(
          `Failed to request file size, status code: ${sizeResponse.status}`,
        ); // Changed from '请求文件大小失败，状态码:'
      {
        const rangeHeader = sizeResponse.responseHeaders.match(
            /content-range:\s*bytes\s*\d+-\d+\/(\d+)/i,
          ),
          typeHeader = sizeResponse.responseHeaders.match(
            /content-type:\s*([^\s;]+)/i,
          );
        if (rangeHeader && rangeHeader[1])
          fileSize = parseInt(rangeHeader[1], 10);
        else {
          if (
            !sizeResponse.responseHeaders.match(/content-length:\s*(\d+)/i) ||
            200 !== sizeResponse.status
          )
            throw new Error(
              'Failed to get total file size from response header, server may not support Range requests.', // Changed from '无法从响应头中获取文件总大小，服务器可能不支持 Range 请求。'
            );
          {
            const lengthHeader = sizeResponse.responseHeaders.match(
              /content-length:\s*(\d+)/i,
            );
            fileSize = parseInt(lengthHeader[1], 10);
            clog.warn(
              'Server returned 200 status code, may not support Range requests. Will attempt full download.', // Changed from '服务器返回 200 状态码，可能不支持 Range 请求。将尝试完整下载。'
            );
          }
        }
        typeHeader && typeHeader[1] && (mimeType = typeHeader[1]);
        clog.log(
          `Total file size: ${(fileSize / 1024 / 1024).toFixed(
            2,
          )} MB, MIME type: ${
            // Changed from '文件总大小：' and 'MIME 类型:'
            mimeType || 'Unknown' // Changed from '未知'
          }`,
        );
      }
    } catch (e) {
      clog.error('Failed to get file size:', e.message); // Changed from '获取文件大小失败:'
      throw e;
    }
    if (!fileSize || fileSize <= 0)
      throw new Error(
        'Obtained file size is invalid or server refused to provide size information.',
      ); // Changed from '获取到的文件大小无效或服务器拒绝提供大小信息。'
    const numChunks = Math.ceil(fileSize / 1048576),
      chunkPromises = [],
      downloadedChunks = new Array(numChunks);
    clog.log(
      `File will be divided into ${numChunks} chunks for download (approximately ${(1).toFixed(
        2,
      )} MB per chunk)`, // Changed from '文件将被分为' and '块进行下载 (每块约'
    );
    for (let i = 0; i < numChunks; i++) {
      const start = 1048576 * i,
        rangeHeader = `bytes=${start}-${Math.min(
          start + 1048576 - 1,
          fileSize - 1,
        )}`,
        chunkPromise = await utils.retry(
          () =>
            new Promise((resolve, reject) => {
              const currentHeaders = {
                ...headers,
                Range: rangeHeader,
                Accept: 'application/octet-stream',
              };
              GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: currentHeaders,
                timeout: httpTimeout,
                responseType: 'arraybuffer',
                onload: (response) => {
                  if (206 === response.status || 200 === response.status)
                    if (response.response instanceof ArrayBuffer) {
                      downloadedChunks[i] = response.response;
                      clog.log(
                        `Successfully downloaded chunk ${
                          i + 1
                        }/${numChunks} (${rangeHeader})`, // Changed from '成功下载第' and '块'
                      );
                      resolve();
                    } else
                      reject(
                        new Error(
                          `Chunk ${i + 1} response is not ArrayBuffer.`,
                        ),
                      );
                  // Changed from '块响应不是 ArrayBuffer。'
                  else
                    reject(
                      new Error(
                        `Chunk ${i + 1} request failed, status code: ${
                          response.status
                        }`, // Changed from '块请求失败，状态码:'
                      ),
                    );
                },
                onerror: (error) =>
                  reject(
                    new Error(`Chunk ${i + 1} network error: ${error.error}`),
                  ), // Changed from '块网络错误:'
                ontimeout: () => reject(new Error(`Chunk ${i + 1} timeout.`)), // Changed from '块超时。'
              });
            }),
          httpRetryCount,
        );
      chunkPromises.push(chunkPromise);
    }
    try {
      await Promise.all(chunkPromises);
      clog.log('All chunks downloaded, starting merge...'); // Changed from '所有分块下载完成，开始合并...'
    } catch (e) {
      clog.error('Error during chunk download:', e.message); // Changed from '分块下载过程中发生错误:'
      throw e;
    }
    const finalBlob = new Blob(downloadedChunks);
    finalBlob.size !== fileSize &&
      clog.warn(
        `Warning: Merged Blob size (${finalBlob.size}) does not match expected file size (${fileSize})!`, // Changed from '警告：合并后的 Blob 大小' and '与预期文件大小' and '不匹配！'
      );
    return await finalBlob.text();
  }
  async gmRequest(
    method,
    url,
    data = {},
    params = {},
    headers = {},
    noRedirect = !1,
  ) {
    if (params && Object.keys(params).length) {
      const queryString = new URLSearchParams(params).toString();
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
    const httpTimeout = await storageManager.getSetting('httpTimeout', 5e3),
      httpRetryCount = await storageManager.getSetting('httpRetryCount', 3);
    data || (data = void 0);
    return await utils.retry(
      () =>
        new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: method,
            url: url,
            headers: headers,
            timeout: httpTimeout,
            data: data,
            onload: (response) => {
              try {
                noRedirect &&
                  response.finalUrl !== url &&
                  reject('Request was redirected, URL is:' + response.finalUrl); // Changed from '请求被重定向了,URL是:'
                if (response.status >= 200 && response.status < 300)
                  if (response.responseText)
                    try {
                      resolve(JSON.parse(response.responseText));
                    } catch (e) {
                      resolve(response.responseText);
                    }
                  else resolve(response.responseText || response);
                else {
                  clog.error(
                    'Request failed, status code:',
                    response.status,
                    url,
                  ); // Changed from '请求失败,状态码:'
                  if (response.responseText)
                    try {
                      const errorData = JSON.parse(response.responseText);
                      reject(errorData);
                    } catch {
                      reject(
                        new Error(
                          response.responseText ||
                            `Request failed with error ${response.status}`, // Changed from '请求发生错误'
                        ),
                      );
                    }
                  else
                    reject(
                      new Error(`Request failed with error ${response.status}`),
                    ); // Changed from '请求发生错误'
                }
              } catch (e) {
                reject(e);
              }
            },
            onerror: (error) => {
              clog.error('Network error:', url); // Changed from '网络错误:'
              reject(new Error(error.error || 'Network error')); // Changed from '网络错误'
            },
            ontimeout: () => {
              reject(new Error('Request timeout: ' + url)); // Changed from '请求超时:'
            },
          });
        }),
      httpRetryCount,
    );
  }
})();

unsafeWindow.storageManager = window.storageManager = new StorageManager();

const senderChannel = new BroadcastChannel('jhs-channel');

window.refresh = function () {
  senderChannel.postMessage({
    type: 'refresh',
  });
};

window.clean_cacheBlacklistCarList = function () {
  storageManager.cacheBlacklistCarList &&
    (storageManager.cacheBlacklistCarList = null);
  senderChannel.postMessage({
    type: 'clean_cacheBlacklistCarList',
  });
};

window.clean_cacheSettingObj = function () {
  storageManager.cacheSettingObj && (storageManager.cacheSettingObj = null);
  senderChannel.postMessage({
    type: 'clean_cacheSettingObj',
  });
};

window.clean_cacheFavoriteActressList = function () {
  storageManager.cacheFavoriteActressList &&
    (storageManager.cacheFavoriteActressList = null);
  senderChannel.postMessage({
    type: 'clean_cacheFavoriteActressList',
  });
};

window.clean_cacheCarList = function () {
  storageManager.cacheCarList && (storageManager.cacheCarList = null);
  senderChannel.postMessage({
    type: 'clean_cacheCarList',
  });
};

new BroadcastChannel('jhs-channel').addEventListener(
  'message',
  async (event) => {
    let dataType = event.data.type;
    if ('refresh' === dataType) {
      const listPagePlugin = window.pluginManager.getBean('ListPagePlugin');
      await listPagePlugin.doFilter();
      const historyPlugin = window.pluginManager.getBean('HistoryPlugin');
      historyPlugin.tableObj && historyPlugin.tableObj.setData();
      const newVideoPlugin = window.pluginManager.getBean('NewVideoPlugin');
      if (newVideoPlugin) {
        newVideoPlugin.showNewVideoCount().then();
        newVideoPlugin.loadData();
      }
    } else
      'clean_cacheBlacklistCarList' === dataType
        ? storageManager.cacheBlacklistCarList &&
          (storageManager.cacheBlacklistCarList = null)
        : 'clean_cacheSettingObj' === dataType
        ? storageManager.cacheSettingObj &&
          (storageManager.cacheSettingObj = null)
        : 'clean_cacheFavoriteActressList' === dataType
        ? storageManager.cacheFavoriteActressList &&
          (storageManager.cacheFavoriteActressList = null)
        : 'clean_cacheCarList' === dataType &&
          storageManager.cacheCarList &&
          (storageManager.cacheCarList = null);
  },
);

!(function () {
  document.head.insertAdjacentHTML(
    'beforeend',
    '\n        <style>\n            .loading-container {\n                position: fixed;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                display: flex;\n                flex-direction: column; /* Vertical arrangement */\n                justify-content: center;\n                align-items: center;\n                background-color: rgba(0, 0, 0, 0.1);\n                z-index: 99999999;\n            }\n    \n            .loading-animation {\n                position: relative;\n                width: 60px;\n                height: 12px;\n                background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);\n                border-radius: 6px;\n                animation: loading-animate 1.8s ease-in-out infinite;\n                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n                margin-bottom: 30px; /* Space between animation and button */\n            }\n    \n            .loading-animation:before,\n            .loading-animation:after {\n                position: absolute;\n                display: block;\n                content: "";\n                animation: loading-animate 1.8s ease-in-out infinite;\n                height: 12px;\n                border-radius: 6px;\n                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n            }\n    \n            .loading-animation:before {\n                top: -20px;\n                left: 10px;\n                width: 40px;\n                background: linear-gradient(90deg, #ff758c 0%, #ff7eb3 100%);\n            }\n    \n            .loading-animation:after {\n                bottom: -20px;\n                width: 35px;\n                background: linear-gradient(90deg, #ff9a9e 0%, #fad0c4 100%);\n            }\n            \n            /* New button style */\n            .loading-close-btn {\n                padding: 8px 15px;\n                border: none;\n                border-radius: 4px;\n                background-color: #f44336; /* Red background */\n                color: white;\n                cursor: pointer;\n                font-size: 14px;\n                opacity: 0; /* Hidden by default */\n                transition: opacity 0.3s ease; /* Fade effect */\n            }\n\n            .loading-close-btn.visible {\n                opacity: 1; /* Show after 3 seconds */\n            }\n    \n            @keyframes loading-animate {\n                0% {\n                    transform: translateX(40px);\n                }\n                50% {\n                    transform: translateX(-30px);\n                }\n                100% {\n                    transform: translateX(40px);\n                }\n            }\n        </style>\n    ',
  );
  unsafeWindow.loading = window.loading = function () {
    const container = document.createElement('div');
    container.className = 'loading-container';
    const animation = document.createElement('div');
    animation.className = 'loading-animation';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'loading-close-btn';
    closeBtn.textContent = 'Close'; // Changed from '关闭'
    closeBtn.addEventListener('click', () => {
      close();
    });
    setTimeout(() => {
      closeBtn.classList.add('visible');
    }, 3e3);
    container.appendChild(animation);
    container.appendChild(closeBtn);
    document.body.appendChild(container);
    const close = () => {
      container &&
        container.parentNode &&
        container.parentNode.removeChild(container);
    };
    return {
      close: close,
    };
  };
})();

!(function () {
  const showMessage = (
    msg,
    type,
    gravityOrOptions,
    positionOrOptions,
    options,
  ) => {
    let finalOptions;
    if ('object' == typeof gravityOrOptions) finalOptions = gravityOrOptions;
    else {
      finalOptions =
        'object' == typeof positionOrOptions
          ? positionOrOptions
          : options || {};
      finalOptions.gravity = gravityOrOptions || 'top';
      finalOptions.position =
        'string' == typeof positionOrOptions ? positionOrOptions : 'center';
    }
    (finalOptions.gravity && 'center' !== finalOptions.gravity) ||
      (finalOptions.offset = {
        y: 'calc(50vh - 150px)',
      });
    const colors_infoStart = '#60A5FA',
      colors_infoEnd = '#93C5FD',
      colors_successStart = '#10B981',
      colors_successEnd = '#6EE7B7',
      colors_errorStart = '#EF4444',
      colors_errorEnd = '#FCA5A5',
      commonStyles = {
        borderRadius: '12px',
        color: 'white',
        padding: '12px 16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minWidth: '150px',
        textAlign: 'center',
        zIndex: 999999999,
      },
      defaultConfig = {
        text: msg,
        duration: 1e3,
        close: !1,
        gravity: 'top',
        position: 'center',
        style: {
          info: {
            ...commonStyles,
            background: `linear-gradient(to right, ${colors_infoStart}, ${colors_infoEnd})`,
          },
          success: {
            ...commonStyles,
            background: `linear-gradient(to right, ${colors_successStart}, ${colors_successEnd})`,
          },
          error: {
            ...commonStyles,
            background: `linear-gradient(to right, ${colors_errorStart}, ${colors_errorEnd})`,
          },
        }[type],
        stopOnFocus: !0,
        oldestFirst: !1,
        ...finalOptions,
      };
    -1 === defaultConfig.duration && (defaultConfig.close = !0);
    const toast = Toastify(defaultConfig);
    toast.showToast();
    toast.closeShow = () => {
      toast.toastElement.remove();
    };
    return toast;
  };
  unsafeWindow.show = window.show = {
    ok: (msg, gravityOrOptions = 'center', positionOrOptions, options) =>
      showMessage(msg, 'success', gravityOrOptions, positionOrOptions, options),
    error: (msg, gravityOrOptions = 'center', positionOrOptions, options) =>
      showMessage(msg, 'error', gravityOrOptions, positionOrOptions, options),
    info: (msg, gravityOrOptions = 'center', positionOrOptions, options) =>
      showMessage(msg, 'info', gravityOrOptions, positionOrOptions, options),
  };
})();

!(function () {
  document.head.insertAdjacentHTML(
    'beforeend',
    '\n        <style>\n            .viewer-canvas {\n                overflow: auto !important;\n            }\n            \n            .viewer-close {\n                background: rgba(255,0,0,0.6) !important;\n            }\n            .viewer-close:hover {\n                background: rgba(255,0,0,0.8) !important;\n            }\n        </style>\n    ',
  );
  function smartToggleBodyScroll2(waitTime = 10) {
    setTimeout(() => {
      const openLayerCount =
        document.querySelectorAll('.layui-layer-shade').length;
      document.documentElement.style.overflow =
        openLayerCount > 0 ? 'hidden' : '';
    }, waitTime);
  }
  window.showImageViewer = function (imgUrlOrContainer, altText = '') {
    let $container = null,
      isTempContainer = !1;
    if (
      'string' == typeof imgUrlOrContainer ||
      imgUrlOrContainer instanceof String
    ) {
      $container = $('<div class="temporary-container" style="display:none;">')
        .append(`<img src="${imgUrlOrContainer}" alt="${altText}">`)
        .appendTo('body');
      isTempContainer = !0;
    } else $container = $(imgUrlOrContainer);
    const options = {
        zIndex: 999999990,
        navbar: !1,
        zoomOnWheel: !1,
        zoomRatio: 0.1,
        toggleOnDblclick: !1,
        toolbar: {
          zoomIn: 1,
          zoomOut: 1,
          reset: 1,
          rotateLeft: 0,
          rotateRight: 0,
          flipHorizontal: 0,
          flipVertical: 0,
        },
        title: !1,
        keyboard: !1,
        viewed() {
          viewerInstance.zoomTo(1.4);
          let left =
            (viewerInstance.viewerData.width - viewerInstance.imageData.width) /
            2;
          viewerInstance.moveTo(left, 0);
        },
        shown() {
          isTempContainer && $container.remove();
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
          viewerInstance.handleKeydown = function (e) {
            if ('Escape' === e.key || ' ' === e.key) {
              e.preventDefault();
              e.stopPropagation();
              viewerInstance.destroy();
              document.removeEventListener(
                'keydown',
                viewerInstance.handleKeydown,
              );
              document.documentElement.style.overflow = '';
              document.body.style.overflow = '';
              smartToggleBodyScroll2();
            }
          };
          document.addEventListener('keydown', viewerInstance.handleKeydown);
        },
        hidden() {
          viewerInstance &&
            viewerInstance.handleKeydown &&
            document.removeEventListener(
              'keydown',
              viewerInstance.handleKeydown,
            );
          viewerInstance.destroy();
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          smartToggleBodyScroll2();
        },
      },
      viewerInstance = new Viewer($container[0], options);
    viewerInstance.show();
  };
})();

window.ImageHoverPreview = class {
  constructor(options = {}) {
    this.config = {
      selector: '.hover-preview',
      dataAttribute: 'data-full',
      maxWidth: 1e3,
      maxHeight: 1e3,
      offsetX: 20,
      offsetY: 20,
      zIndex: 9999999999,
      transition: 0.2,
      autoAdjustPosition: !0,
      ...options,
    };
    this.preview = null;
    this.currentTarget = null;
    this.timer = null;
    this.imgElement = null;
    this.boundElements = new WeakSet();
    this.init();
  }
  init() {
    this.injectStyles();
    this.createPreviewElement();
    this.bindEvents();
  }
  injectStyles() {
    const css = `\n                <style>\n                    .image-hover-preview {\n                        position: fixed;\n                        display: none;\n                        z-index: ${
      this.config.zIndex
    };\n                        border-radius: 4px;\n                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n                        overflow: hidden;\n                        pointer-events: none;\n                        opacity: 0;\n                        transition: opacity ${
      this.config.transition
    }s ease;\n                        background-color: #fff;\n                    }\n                    \n                    .image-hover-preview.active {\n                        opacity: 1;\n                    }\n                    \n                    .image-hover-preview img {\n                        max-width: ${
      this.config.maxWidth + 'px'
    };\n                        max-height: ${
      this.config.maxHeight + 'px'
    };\n                        display: block;\n                        object-fit: contain;\n                    }\n                    \n                    .image-hover-preview::after {\n                        content: '';\n                        position: absolute;\n                        top: 0;\n                        left: 0;\n                        right: 0;\n                        bottom: 0;\n                        background: rgba(0, 0, 0, 0.03);\n                        pointer-events: none;\n                    }\n                    \n                    .image-hover-preview.loading::before {\n                        content: 'Loading...';\n                        position: absolute;\n                        top: 50%;\n                        left: 50%;\n                        transform: translate(-50%, -50%);\n                        color: #666;\n                        font-size: 14px;\n                    }\n                </style>\n            `;
    document.head.insertAdjacentHTML('beforeend', css);
  }
  createPreviewElement() {
    this.preview = document.createElement('div');
    this.preview.className = 'image-hover-preview';
    document.body.appendChild(this.preview);
  }
  bindEvents() {
    document.querySelectorAll(this.config.selector).forEach((el) => {
      if (!this.boundElements.has(el)) {
        el.addEventListener('mouseenter', (e) => this.handleMouseEnter(e));
        el.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        el.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.boundElements.add(el);
      }
    });
  }
  handleMouseEnter(e) {
    clearTimeout(this.timer);
    this.currentTarget = e.currentTarget;
    const imgUrl =
      this.currentTarget.getAttribute(this.config.dataAttribute) ||
      this.currentTarget.src;
    if (!imgUrl) return;
    this.preview.innerHTML = '';
    this.preview.classList.add('loading');
    this.preview.style.display = 'block';
    this.preview.classList.remove('active');
    const img = new Image();
    img.onload = () => {
      this.preview.classList.remove('loading');
      this.preview.innerHTML = `<img src="${imgUrl}" alt="Preview image">`; // Changed from '预览图'
      this.imgElement = this.preview.querySelector('img');
      const { width: width, height: height } = this.calculateImageSize(img);
      this.preview.style.width = `${width}px`;
      this.preview.style.height = `${height}px`;
      this.preview.offsetHeight;
      this.preview.classList.add('active');
      this.handleMouseMove(e);
    };
    img.onerror = () => {
      this.preview.classList.remove('loading');
      this.preview.innerHTML =
        '<div style="padding:10px;color:#f00;">Image failed to load</div>'; // Changed from '图片加载失败'
    };
    img.src = imgUrl;
  }
  calculateImageSize(img) {
    let width = img.naturalWidth,
      height = img.naturalHeight;
    if (width > this.config.maxWidth || height > this.config.maxHeight) {
      const ratio = Math.min(
        this.config.maxWidth / width,
        this.config.maxHeight / height,
      );
      width *= ratio;
      height *= ratio;
    }
    return {
      width: width,
      height: height,
    };
  }
  handleMouseMove(e) {
    if (!this.currentTarget || !this.preview.classList.contains('active'))
      return;
    let { offsetX: offsetX, offsetY: offsetY } = this.config,
      left = e.clientX + offsetX,
      top = e.clientY + offsetY;
    if (this.config.autoAdjustPosition) {
      const previewWidth = this.preview.offsetWidth,
        previewHeight = this.preview.offsetHeight;
      left + previewWidth > window.innerWidth &&
        (left = e.clientX - previewWidth - offsetX);
      top + previewHeight > window.innerHeight &&
        (top = e.clientY - previewHeight - offsetY);
      left = Math.max(0, left);
      top = Math.max(0, top);
    }
    this.preview.style.left = `${left}px`;
    this.preview.style.top = `${top}px`;
  }
  handleMouseLeave() {
    this.preview.classList.remove('active');
    this.preview.style.display = 'none';
    this.currentTarget = null;
    this.imgElement = null;
  }
  destroy() {
    document.querySelectorAll(this.config.selector).forEach((el) => {
      if (this.boundElements.has(el)) {
        el.removeEventListener('mouseenter', this.handleMouseEnter);
        el.removeEventListener('mouseleave', this.handleMouseLeave);
        el.removeEventListener('mousemove', this.handleMouseMove);
        this.boundElements.delete(el);
      }
    });
    this.preview &&
      this.preview.parentNode &&
      this.preview.parentNode.removeChild(this.preview);
  }
};

!(async function () {
  document.head.insertAdjacentHTML(
    'beforeend',
    "\n        <style>\n            .console-logger-container {\n                position: fixed;\n                bottom: 0;\n                right: 0;\n                z-index: 99999999;\n                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n                display: flex;\n                flex-direction: column; \n                align-items: flex-end;\n                width: fit-content;\n            }\n\n            .console-logger-toggle {\n                width: 40px;\n                height: 30px;\n                background: #2c3e50;\n                border-radius: 120px 10px 0 0;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                cursor: pointer;\n                box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);\n                transition: all 0.3s ease;\n                color: white;\n                font-size: 16px;\n            }\n\n            .console-logger-toggle:hover {\n                background: #34495e;\n            }\n\n            .console-logger-toggle::after {\n                content: '▼';\n                transition: transform 0.3s ease;\n            }\n\n            .console-logger-toggle.collapsed::after {\n                content: '▲';\n            }\n\n            .console-logger-window {\n                width: 400px;\n                height: 400px;\n                background: white;\n                border-radius: 10px 0 10px 10px;\n                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);\n                display: flex;\n                flex-direction: column;\n                overflow: hidden;\n                transform: translateY(0);\n                opacity: 1;\n                /* Simplified transition properties */\n                transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease, transform 0.3s ease;\n            }\n\n            .console-logger-window.maximized {\n                width: 600px !important;\n                height: 85vh !important;\n                border-radius: 10px 0 0 10px; /* Adjust border-radius to match bottom right */\n            }\n\n            .console-logger-window.collapsed {\n                height: 0 !important;\n                min-height: 0 !important; \n                opacity: 0;\n            }\n\n            .console-logger-header {\n                background: #2c3e50;\n                color: white;\n                padding: 12px 15px;\n                display: flex;\n                justify-content: space-between;\n                align-items: center;\n                flex-shrink: 0;\n            }\n\n            .console-logger-title {\n                font-weight: 600;\n                font-size: 16px;\n            }\n\n            .console-logger-controls {\n                display: flex;\n                gap: 10px;\n            }\n\n            .console-logger-controls button {\n                background: transparent;\n                border: 1px solid rgba(255, 255, 255, 0.3);\n                padding: 5px 10px;\n                font-size: 12px;\n                color: white;\n                border-radius: 4px;\n                cursor: pointer;\n                transition: background 0.3s;\n            }\n\n            .console-logger-controls button:hover {\n                background: rgba(255, 255, 255, 0.1);\n            }\n\n            /* New button styles */\n            .console-logger-maximize-toggle {\n                line-height: 1;\n                font-size: 14px !important; /* Make arrow look larger */\n                padding: 5px 8px !important;\n            }\n            .console-logger-maximize-toggle::before {\n                content: '⇱'; /* Unicode symbol for maximized */\n            }\n            .console-logger-maximize-toggle.active::before {\n                content: '⇲'; /* Unicode symbol for minimized */\n            }\n\n\n            .console-logger-filters {\n                display: flex;\n                align-items: center;\n                gap: 5px;\n                padding: 10px;\n                background: #f8f9fa;\n                border-bottom: 1px solid #e9ecef;\n                flex-shrink: 0;\n                overflow-x: hidden; \n            }\n\n            /* Added: Container for filter button group, responsible for scrolling */\n            .console-logger-filter-group {\n                display: flex;\n                gap: 5px;\n                overflow-x: auto; /* Allow filter buttons to scroll */\n                flex-grow: 1; /* Occupy remaining space */\n                padding-right: 10px; /* Prevent scrollbar from affecting buttons */\n            }\n\n            .console-logger-filter {\n                padding: 5px 10px;\n                font-size: 12px;\n                border-radius: 15px;\n                background: #ecf0f1;\n                color: #7f8c8d;\n                border: 1px solid #ddd;\n                cursor: pointer;\n                transition: all 0.3s;\n                white-space: nowrap;\n                flex-shrink: 0; /* Ensure it is not compressed */\n            }\n\n            .console-logger-filter.active {\n                background: #3498db;\n                color: white;\n                border-color: #3498db;\n            }\n\n            /* Added: Style for scroll-to-bottom button (on the right inside filtersContainer) */\n            .console-logger-scroll-to-bottom {\n                background: #3498db;\n                border: none;\n                padding: 5px 10px;\n                font-size: 12px;\n                color: white;\n                border-radius: 4px;\n                cursor: pointer;\n                transition: background 0.3s;\n                line-height: 1;\n                height: fit-content;\n                white-space: nowrap;\n                margin-left: auto; /* Push button to the far right */\n                flex-shrink: 0; /* Ensure it is not compressed */\n            }\n\n            .console-logger-scroll-to-bottom:hover {\n                background: #2980b9;\n            }\n\n\n            .console-logger-content {\n                flex: 1;\n                overflow-y: auto;\n                padding: 10px;\n                background: #ffffff;\n                word-wrap: break-word;\n                text-align: left;\n            }\n\n            .console-logger-entry {\n                padding: 8px 10px;\n                margin-bottom: 3px;\n                border-radius: 4px;\n                font-size: 12px;\n                line-height: 1.4;\n                /*animation: consoleFadeIn 0.3s ease;*/\n                border-left: 3px solid transparent;\n            }\n\n            @keyframes consoleFadeIn {\n                from { opacity: 0; transform: translateY(5px); }\n                to { opacity: 1; transform: translateY(0); }\n            }\n\n            .console-logger-timestamp {\n                color: #7f8c8d;\n                font-size: 11px;\n                margin-right: 2px;\n            }\n\n            @media (max-width: 768px) {\n                .console-logger-container {\n                    right: 10px;\n                    bottom: 10px;\n                }\n\n                .console-logger-window {\n                    width: calc(100vw - 20px);\n                    height: 300px;\n                }\n            }\n            \n            .console-logger-message[data-type=\"json\"] {\n                white-space: pre-wrap; \n            }\n        </style>\n    ",
  );
  const groupTypes = {
      base: {
        label: 'Info', // Changed from '信息'
        background: '#e8f4fd',
        borderLeftColor: '#3498db',
      },
      warn: {
        label: 'Warning', // Changed from '警告'
        background: '#fef9e7',
        borderLeftColor: '#f39c12',
      },
      error: {
        label: 'Error', // Changed from '错误'
        background: '#fdedec',
        borderLeftColor: '#e74c3c',
      },
      debug: {
        label: 'Debug', // Changed from '调试'
        background: '#f4f6f6',
        borderLeftColor: '#95a5a6',
      },
    },
    filterMap = {
      base: ['base', 'warn', 'error'],
      warn: ['warn'],
      error: ['error'],
      debug: ['base', 'warn', 'error', 'debug'],
    },
    maxEntries = await storageManager.getSetting('clogMsgCount', 2e3);
  class CLog {
    constructor() {
      const storedFilter = localStorage.getItem('jhs_clog_filter');
      this.currentFilter =
        storedFilter && groupTypes[storedFilter] ? storedFilter : 'base';
      this.logs = [];
      this.isInitialized = !1;
      this.userScrolledUp = !1;
    }
    tryInitialize() {
      if ('loading' === document.readyState) return !1;
      if (this.isInitialized) return !0;
      this.init();
      this.isInitialized = !0;
      return !0;
    }
    init() {
      this.createContainer();
      this.bindEvents();
      this.checkInitialMaximizeState();
      this.checkInitialCollapseState();
    }
    createContainer() {
      this.container = document.createElement('div');
      this.container.className = 'console-logger-container';
      this.container.style.display = 'none';
      this.toggleBtn = document.createElement('div');
      this.toggleBtn.className = 'console-logger-toggle collapsed';
      this.container.appendChild(this.toggleBtn);
      this.window = document.createElement('div');
      this.window.className = 'console-logger-window collapsed';
      const header = document.createElement('div');
      header.className = 'console-logger-header';
      const title = document.createElement('div');
      title.className = 'console-logger-title';
      title.textContent = 'JHS V3.3.6.008';
      const controls = document.createElement('div');
      controls.className = 'console-logger-controls';
      this.maximizeBtn = document.createElement('button');
      this.maximizeBtn.textContent = '';
      this.maximizeBtn.classList.add('console-logger-maximize-toggle');
      controls.appendChild(this.maximizeBtn);
      const clearBtn = document.createElement('button');
      clearBtn.textContent = 'Clear'; // Changed from '清空'
      clearBtn.addEventListener('click', () => this.clear());
      controls.appendChild(clearBtn);
      header.appendChild(title);
      header.appendChild(controls);
      this.filtersContainer = document.createElement('div');
      this.filtersContainer.className = 'console-logger-filters';
      this.filterButtonGroup = document.createElement('div');
      this.filterButtonGroup.className = 'console-logger-filter-group';
      this.filtersContainer.appendChild(this.filterButtonGroup);
      this.scrollToBottomBtn = document.createElement('button');
      this.scrollToBottomBtn.className = 'console-logger-scroll-to-bottom';
      this.scrollToBottomBtn.textContent = 'To Bottom'; // Changed from '到底部'
      this.filtersContainer.appendChild(this.scrollToBottomBtn);
      this.content = document.createElement('div');
      this.content.className = 'console-logger-content jhs-scrollbar';
      this.window.appendChild(header);
      this.window.appendChild(this.filtersContainer);
      this.window.appendChild(this.content);
      this.container.appendChild(this.window);
      document.body.appendChild(this.container);
      Object.keys(groupTypes).forEach((type) => {
        const filterBtn = document.createElement('div');
        filterBtn.className = 'console-logger-filter';
        type === this.currentFilter && filterBtn.classList.add('active');
        filterBtn.textContent = groupTypes[type].label;
        filterBtn.dataset.type = type;
        filterBtn.addEventListener('click', () => this.setFilter(type));
        this.filterButtonGroup.appendChild(filterBtn);
      });
    }
    bindEvents() {
      this.toggleBtn.addEventListener('click', () => {
        this.toggleExpandCollapsed();
      });
      this.maximizeBtn.addEventListener('click', () => this.toggleMaximize());
      this.scrollToBottomBtn.addEventListener('click', () => {
        this.content.scrollTop = this.content.scrollHeight;
        this.userScrolledUp = !1;
      });
      this.content.addEventListener('scroll', () => {
        const isAtBottom =
          this.content.scrollHeight - this.content.clientHeight <=
          this.content.scrollTop + 5;
        this.userScrolledUp = !isAtBottom;
      });
      this.content.addEventListener(
        'wheel',
        (e) => {
          const isAtTop = 0 === this.content.scrollTop,
            isAtBottom =
              this.content.scrollHeight - this.content.clientHeight <=
              this.content.scrollTop + 1;
          if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
        {
          passive: !1,
        },
      );
    }
    toggleExpandCollapsed() {
      const isCollapsed = this.window.classList.toggle('collapsed');
      this.toggleBtn.classList.toggle('collapsed');
      if (isCollapsed) localStorage.setItem('jhs_clog_expand', 'no');
      else {
        localStorage.setItem('jhs_clog_expand', 'yes');
        this.reRenderAllLogs();
      }
    }
    checkInitialCollapseState() {
      const expandStatus = localStorage.getItem('jhs_clog_expand');
      if (expandStatus && 'no' !== expandStatus) {
        this.window.classList.toggle('collapsed');
        this.toggleBtn.classList.toggle('collapsed');
        setTimeout(() => {
          this.content.scrollTop = this.content.scrollHeight;
        }, 0);
      } else {
        this.window.classList.add('collapsed');
        this.toggleBtn.classList.add('collapsed');
      }
    }
    checkInitialMaximizeState() {
      if ('maximized' === localStorage.getItem('jhs_clog_maximize')) {
        this.window.classList.add('maximized');
        this.maximizeBtn.classList.add('active');
      }
    }
    toggleMaximize() {
      const isMaximized = this.window.classList.toggle('maximized');
      this.maximizeBtn.classList.toggle('active', isMaximized);
      isMaximized
        ? localStorage.setItem('jhs_clog_maximize', 'maximized')
        : localStorage.setItem('jhs_clog_maximize', 'minimized');
      this.window.classList.contains('collapsed') ||
        (this.content.scrollTop = this.content.scrollHeight);
    }
    addLog(primaryContent, type = 'base', ...optionalParams) {
      const initialized = this.tryInitialize();
      let logType,
        extraParams = [];
      if (groupTypes[type]) {
        logType = type;
        extraParams = optionalParams;
      } else {
        logType = 'base';
        extraParams = [type, ...optionalParams];
      }
      logType = groupTypes[logType] ? logType : 'base';
      const allContents = [primaryContent, ...extraParams];
      let messageType = 'msg';
      const processedParts = [];
      allContents.forEach((content) => {
        if ('[object Error]' === Object.prototype.toString.call(content))
          processedParts.push(String(content));
        else if ('object' == typeof content && null !== content)
          try {
            processedParts.push('<br/>' + JSON.stringify(content, null, 2));
            messageType = 'json';
          } catch (e) {
            processedParts.push(String(content));
            messageType = 'msg';
          }
        else processedParts.push(String(content));
      });
      let formattedMessage = processedParts.join('  ');
      formattedMessage = formattedMessage.replace(
        /(?:(?:https?|ftp):\/\/|www\.|(?:\/\/))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/gi,
        (url) => {
          const isFullProtocol =
              url.startsWith('http') || url.startsWith('ftp'),
            isProtocolRelative = url.startsWith('//'),
            isWww = url.startsWith('www.');
          let fullUrl = url;
          isProtocolRelative
            ? (fullUrl = `http:${url}`)
            : !isFullProtocol && isWww && (fullUrl = `http://${url}`);
          return `<a href="${fullUrl}" target="_blank">${url}</a>`;
        },
      );
      const logEntry = {
        message: formattedMessage,
        messageType: messageType,
        type: logType,
        timestamp: new Date(),
        id: Date.now() + Math.random(),
      };
      this.logs.push(logEntry);
      if (this.logs.length > maxEntries) {
        const firstLog = this.logs[0];
        if (initialized) {
          const elementToRemove = this.content.querySelector(
            `.console-logger-entry[data-id="${firstLog.id}"]`,
          );
          if (elementToRemove) {
            this.logs.shift();
            this.content.removeChild(elementToRemove);
          }
        }
      }
      initialized && this.renderLog(logEntry);
    }
    log(...message) {
      const [mainMessage, ...optionalParams] = message;
      setTimeout(() => {
        this.addLog(mainMessage, 'base', ...optionalParams);
      }, 0);
    }
    error(...message) {
      const [mainMessage, ...optionalParams] = message;
      console.error(...message);
      setTimeout(() => {
        this.addLog(mainMessage, 'error', ...optionalParams);
      }, 0);
    }
    warn(...message) {
      const [mainMessage, ...optionalParams] = message;
      setTimeout(() => {
        this.addLog(mainMessage, 'warn', ...optionalParams);
      }, 0);
    }
    debug(...message) {
      const [mainMessage, ...optionalParams] = message;
      setTimeout(() => {
        this.addLog(mainMessage, 'debug', ...optionalParams);
      }, 0);
    }
    renderLog(logEntry) {
      if ('none' === this.container.style.display) return;
      if (this.window.classList.contains('collapsed')) return;
      if (!(filterMap[this.currentFilter] || []).includes(logEntry.type))
        return;
      const entryEl = this._createLogElement(logEntry);
      this.content.appendChild(entryEl);
      this.window.classList.contains('collapsed') ||
        this.userScrolledUp ||
        (this.content.scrollTop = this.content.scrollHeight);
    }
    reRenderAllLogs() {
      'none' !== this.container.style.display &&
        (this.window.classList.contains('collapsed') ||
          setTimeout(() => {
            this.content.innerHTML = '';
            if (0 === this.logs.length) return;
            const allowedTypes = filterMap[this.currentFilter] || [],
              fragment = document.createDocumentFragment();
            this.logs.forEach((logEntry) => {
              if (allowedTypes.includes(logEntry.type)) {
                const entryEl = this._createLogElement(logEntry);
                fragment.appendChild(entryEl);
              }
            });
            this.content.appendChild(fragment);
            this.content.scrollTop = this.content.scrollHeight;
          }, 0));
    }
    _createLogElement(logEntry) {
      const entryEl = document.createElement('div');
      entryEl.className = 'console-logger-entry';
      entryEl.dataset.type = logEntry.type;
      entryEl.dataset.id = logEntry.id;
      const config = groupTypes[logEntry.type] || groupTypes.base;
      entryEl.style.borderLeft = '3px solid ' + config.borderLeftColor;
      entryEl.style.background = config.background;
      const timeStr = (
        logEntry.timestamp instanceof Date
          ? logEntry.timestamp
          : new Date(logEntry.timestamp)
      )
        .toTimeString()
        .split(' ')[0];
      entryEl.innerHTML = `\n                <span class="console-logger-timestamp">[${timeStr}]</span>\n                <span class="console-logger-message" data-type="${logEntry.messageType}">${logEntry.message}</span>\n            `;
      return entryEl;
    }
    setFilter(type) {
      if (this.currentFilter === type) return;
      this.currentFilter = type;
      localStorage.setItem('jhs_clog_filter', type);
      this.filterButtonGroup
        .querySelectorAll('.console-logger-filter')
        .forEach((btn) => {
          btn.dataset.type === type
            ? btn.classList.add('active')
            : btn.classList.remove('active');
        });
      this.reRenderAllLogs();
    }
    clear() {
      this.logs = [];
      this.content.innerHTML = '';
    }
    show() {
      if (this.isInitialized && this.container) {
        this.container.style.display = '';
        this.reRenderAllLogs();
      } else if (this.tryInitialize() && this.container) {
        this.container.style.display = '';
        this.reRenderAllLogs();
      }
    }
    hide() {
      this.isInitialized &&
        this.container &&
        (this.container.style.display = 'none');
    }
    lowZIndex() {
      this.isInitialized &&
        this.container &&
        (this.container.style.zIndex = '12345678');
    }
    highZIndex() {
      this.isInitialized &&
        this.container &&
        (this.container.style.zIndex = '999999999');
    }
  }
  if (isJavBus || isJavDb) {
    try {
      unsafeWindow.parent.clog &&
      'function' == typeof unsafeWindow.parent.clog.log
        ? (window.clog = unsafeWindow.clog = unsafeWindow.parent.clog)
        : (window.clog = unsafeWindow.clog = new CLog());
    } catch (e) {
      console.error('An exception occurred while creating the log console', e); // Changed from '创建日志控制台出现异常'
      window.clog = unsafeWindow.clog = new CLog();
    }
    !(function () {
      const clog2 = window.clog || console;
      window.addEventListener('error', function (errorEvent) {
        const filename = errorEvent.filename,
          message = errorEvent.message;
        filename.includes('javdb') ||
          filename.includes('javbus') ||
          clog2.error(
            `[Global Error Exception Caught] ${message} Source: ${filename}`,
          ); // Changed from '[全局 Error 异常捕获]' and '来源:'
      });
      window.addEventListener('unhandledrejection', function (event) {
        const reason = event.reason,
          message = (null == reason ? void 0 : reason.message) ?? '';
        if (message.includes('play()')) return;
        if (message.includes('The element has no supported sources')) {
          show.error(
            'Playback failed, please check if node shunting is enabled?',
          ); // Changed from '播放失败, 请检查是否已对节点分流?'
          clog2.error(
            'Playback failed, please check if node shunting is enabled?',
          ); // Changed from '播放失败, 请检查是否已对节点分流?'
          return;
        }
        if (
          message.includes('<span>1005</span>') &&
          message.includes('fc2ppvdb')
        )
          return;
        const errorMessage = `[Global Promise Exception Caught] ${
          // Changed from '[全局 Promise 异常捕获]'
          reason.message || reason
        }`;
        clog2.error(errorMessage, reason);
        event.preventDefault();
      });
    })();
    document.addEventListener('mousedown', (event) => {
      const clog2 = window.clog;
      if (!clog2.isInitialized || !clog2.container) return;
      const target = event.target,
        whitelistSelector = [
          '.console-logger-container',
          '.layui-layer-shade',
          '.loading-container',
        ].join(',');
      target.closest(whitelistSelector)
        ? clog2.highZIndex()
        : clog2.lowZIndex();
    });
  }
})();
!(function () {
  document.head.insertAdjacentHTML(
    'beforeend',
    '\n        <style>\n            .js-tooltip {\n                /* General styles */\n                position: fixed;\n                padding: 8px 12px; \n                border-radius: 6px; \n                white-space: normal;\n                max-width: 600px; \n                \n                pointer-events: none;\n                font-size: 14px;\n                line-height: 1.5;\n                z-index: 9999999999;\n                \n                background: #F0FDF4; \n                color: #166534;      \n                border: none; \n                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); \n                \n                display: none; \n            }\n            .js-tooltip.is-active {\n                display: block !important;\n            }\n\n        </style>\n    ',
  );
  function positionTooltip(target, content, preferredPosition) {
    const el = (function (content) {
      const el = document.createElement('div');
      el.classList.add('js-tooltip');
      const contentEl = document.createElement('div');
      contentEl.innerHTML = content;
      el.appendChild(contentEl);
      document.body.appendChild(el);
      return el;
    })(content);
    el.style.display = 'block';
    const targetRect = target.getBoundingClientRect(),
      tooltipRect = el.getBoundingClientRect();
    el.style.display = 'none';
    const viewportWidth = window.innerWidth,
      viewportHeight = window.innerHeight;
    let finalLeft,
      finalTop,
      finalPosition = preferredPosition;
    const fitsVertical = (y) =>
        y >= 8 && y + tooltipRect.height <= viewportHeight - 8,
      fitsHorizontal = (x) =>
        x >= 8 && x + tooltipRect.width <= viewportWidth - 8,
      centerHorizontal =
        targetRect.left + targetRect.width / 2 - tooltipRect.width / 2,
      centerVertical =
        targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
    switch (preferredPosition) {
      case 'top':
        finalTop = targetRect.top - tooltipRect.height - 0;
        if (finalTop < 8 && fitsVertical(targetRect.bottom + 0)) {
          finalTop = targetRect.bottom + 0;
          finalPosition = 'bottom';
        }
        break;

      case 'bottom':
        finalTop = targetRect.bottom + 0;
        if (
          finalTop + tooltipRect.height > viewportHeight - 8 &&
          fitsVertical(targetRect.top - tooltipRect.height - 0)
        ) {
          finalTop = targetRect.top - tooltipRect.height - 0;
          finalPosition = 'top';
        }
        break;

      case 'left':
        finalLeft = targetRect.left - tooltipRect.width - 0;
        if (finalLeft < 8 && fitsHorizontal(targetRect.right + 0)) {
          finalLeft = targetRect.right + 0;
          finalPosition = 'right';
        }
        break;

      case 'right':
        finalLeft = targetRect.right + 0;
        if (
          finalLeft + tooltipRect.width > viewportWidth - 8 &&
          fitsHorizontal(targetRect.left - tooltipRect.width - 0)
        ) {
          finalLeft = targetRect.left - tooltipRect.width - 0;
          finalPosition = 'left';
        }
    }
    const isHorizontal = 'left' === finalPosition || 'right' === finalPosition;
    if ('top' === finalPosition || 'bottom' === finalPosition) {
      finalLeft = centerHorizontal;
      finalLeft < 8
        ? (finalLeft = 8)
        : finalLeft + tooltipRect.width > viewportWidth - 8 &&
          (finalLeft = viewportWidth - tooltipRect.width - 8);
    } else if (isHorizontal) {
      finalTop = centerVertical;
      finalTop < 8
        ? (finalTop = 8)
        : finalTop + tooltipRect.height > viewportHeight - 8 &&
          (finalTop = viewportHeight - tooltipRect.height - 8);
    }
    el.style.left = `${finalLeft}px`;
    el.style.top = `${finalTop}px`;
    el.classList.add('is-active');
    target.tooltipElement = el;
  }
  const selector =
    '[data-tip-top], [data-tip-bottom], [data-tip-left], [data-tip-right], [data-tip]';
  document.addEventListener('mouseover', (event) => {
    const target = event.target.closest(selector);
    if (target && !target.tooltipElement) {
      let tipContent,
        preferredPosition = 'top';
      if (target.hasAttribute('data-tip-bottom')) {
        tipContent = target.getAttribute('data-tip-bottom');
        preferredPosition = 'bottom';
      } else if (target.hasAttribute('data-tip-left')) {
        tipContent = target.getAttribute('data-tip-left');
        preferredPosition = 'left';
      } else if (target.hasAttribute('data-tip-right')) {
        tipContent = target.getAttribute('data-tip-right');
        preferredPosition = 'right';
      } else if (target.hasAttribute('data-tip-top')) {
        tipContent = target.getAttribute('data-tip-top');
        preferredPosition = 'top';
      } else if (target.hasAttribute('data-tip')) {
        tipContent = target.getAttribute('data-tip');
        preferredPosition = 'top';
      }
      if (!tipContent) return;
      target.hoverTimeout = setTimeout(() => {
        target.matches(':hover') &&
          !target.tooltipElement &&
          positionTooltip(target, tipContent, preferredPosition);
      }, 50);
    }
  });
  document.addEventListener('mouseout', (event) => {
    const target = event.target.closest(selector);
    if (target) {
      if (target.hoverTimeout) {
        clearTimeout(target.hoverTimeout);
        target.hoverTimeout = null;
      }
      if (!target.contains(event.relatedTarget) && target.tooltipElement) {
        (el = target.tooltipElement) && el.parentNode && el.remove();
        target.tooltipElement = null;
      }
    }
    var el;
  });
})();

class PluginManager {
  constructor() {
    this.plugins = new Map();
  }
  register(pluginClass) {
    if ('function' != typeof pluginClass)
      throw new Error('Plugin must be a class'); // Changed from '插件必须是一个类'
    const instance = new pluginClass();
    instance.pluginManager = this;
    const lowerName = instance.getName();
    if (this.plugins.has(lowerName))
      throw new Error(`Plugin "${name}" already registered`); // Changed from '插件"${name}"已注册'
    this.plugins.set(lowerName, instance);
  }
  getBean(name2) {
    return this.plugins.get(name2);
  }
  async processCss() {
    const failedCssLoads = (
      await Promise.allSettled(
        Array.from(this.plugins).map(async ([name2, instance]) => {
          try {
            if ('function' == typeof instance.initCss) {
              const css = await instance.initCss();
              css && utils.insertStyle(css);
              return {
                name: name2,
                status: 'fulfilled',
              };
            }
            return {
              name: name2,
              status: 'skipped',
            };
          } catch (e) {
            console.error(`Plugin ${name2} failed to load CSS`, e); // Changed from '插件 ${name2} 加载 CSS 失败'
            return {
              name: name2,
              status: 'rejected',
              error: e,
            };
          }
        }),
      )
    ).filter((r) => 'rejected' === r.status);
    failedCssLoads.length &&
      console.error(
        'CSS loading failed for the following plugins:', // Changed from '以下插件的 CSS 加载失败：'
        failedCssLoads.map((p) => p.value.name),
      );
  }
  async processPlugins() {
    const failedPlugins = (
      await Promise.allSettled(
        Array.from(this.plugins).map(async ([name2, instance]) => {
          try {
            if ('function' == typeof instance.handle) {
              await instance.handle();
              return {
                name: name2,
                status: 'fulfilled',
              };
            }
          } catch (e) {
            clog.error(`Plugin ${name2} failed to execute`, e); // Changed from '插件 ${name2} 执行失败'
            return {
              name: name2,
              status: 'rejected',
              error: e,
            };
          }
        }),
      )
    ).filter((r) => 'rejected' === r.status);
    failedPlugins.length &&
      console.error(
        'The following plugins failed to execute:', // Changed from '以下插件执行失败：'
        failedPlugins.map((p) => p.value.name),
      );
  }
}

class BasePlugin {
  constructor() {
    __publicField(this, 'pluginManager', null);
    __publicField(
      this,
      'settingSvg',
      '<svg t="1760926954860" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4947" width="200" height="200" fill="#FFFFFF"><path d="M511.099222 365.825763c-80.7786 0-146.26579 65.482515-146.26579 146.259556 0 80.7786 65.48719 146.259556 146.26579 146.259556 80.777041 0 146.259556-65.480957 146.259556-146.259556C657.358779 431.308278 591.876263 365.825763 511.099222 365.825763L511.099222 365.825763zM511.099222 585.215097c-40.391637 0-73.136012-32.742816-73.136012-73.129778 0-40.391637 32.742816-73.129778 73.136012-73.129778 40.386962 0 73.129778 32.738141 73.129778 73.129778C584.229 552.472281 551.486184 585.215097 511.099222 585.215097L511.099222 585.215097zM511.099222 585.215097M900.893017 568.24369l-26.451395-15.268032c3.065451-27.021784 3.138697-54.472139 0.077922-81.822754l26.373473-15.225955c69.953678-40.391637 93.920921-129.844512 53.533959-199.799749-40.390079-69.95212-129.839837-93.925596-199.799749-53.533959l-26.373473 15.225955c-22.153219-16.330888-45.963059-29.99217-70.896534-40.843585l0-30.545416c0-80.777041-65.48719-146.259556-146.26579-146.259556-80.7786 0-146.259556 65.482515-146.259556 146.259556l0 30.515806c-12.377127 5.421811-24.587501 11.55583-36.562551 18.473743-11.97505 6.917913-23.396854 14.420242-34.277879 22.432179l-26.431136-15.258682c-69.958353-40.391637-159.406553-16.424395-199.79819 53.533959C27.378272 326.082437 51.343956 415.535311 121.299193 455.922273l26.449837 15.275825c-3.063892 27.020226-3.137139 54.465905-0.077922 81.822754l-26.373473 15.224397c-69.953678 40.391637-93.920921 129.841395-53.533959 199.799749 40.391637 69.95212 129.839837 93.920921 199.79819 53.533959l26.375032-15.224397c22.153219 16.32933 45.963059 29.984378 70.896534 40.843585l0 30.537624c0 80.7786 65.48719 146.26579 146.26579 146.26579 80.777041 0 146.259556-65.48719 146.259556-146.26579l0-30.515806c12.377127-5.415577 24.587501-11.55583 36.567226-18.467509 11.97505-6.917913 23.398412-14.420242 34.277879-22.432179l26.423343 15.258682c69.959912 40.391637 159.408111 16.418162 199.799749-53.533959C994.813938 698.085085 970.848254 608.635327 900.893017 568.24369L900.893017 568.24369zM891.096666 731.474653c-20.198936 34.982294-64.923035 46.962019-99.900654 26.770875l-63.331869-36.567226 0 0 0 0-7.988562-4.611422c-18.134004 18.450366-39.024886 34.787489-62.516805 48.353705-23.49971 13.559983-48.091888 23.482568-73.129778 29.964118l0 9.222846 0 0 0 65.828489 0 7.301289c0 40.391637-32.742816 73.136012-73.136012 73.136012-40.386962 0-73.129778-32.742816-73.129778-73.136012l0-7.402588 0-65.72719 0 0 0-9.300768c-50.682014-13.090892-97.855981-39.682547-135.652816-78.232109l-7.983886 4.606747 0 0-63.331869 36.567226c-34.977618 20.191144-79.706394 8.206743-99.900654-26.770875-20.192702-34.977618-8.206743-79.701718 26.770875-99.899095l6.341291-3.657657 0 0 64.972905-37.516316c-14.487254-52.005129-13.929333-106.151555 0.073247-156.593569l-8.057133-4.650384 0 0-63.331869-36.567226c-34.982294-20.192702-46.963578-64.923035-26.770875-99.900654 20.192702-34.97606 64.923035-46.962019 99.900654-26.763083l6.324148 3.649866 0 0 64.996282 37.528784c18.132445-18.450366 39.024886-34.790606 62.516805-48.353705 23.493477-13.559983 48.085654-23.485685 73.129778-29.964118l0-9.229079L437.960093 153.739276l0-7.309082c0-40.385404 32.742816-73.129778 73.129778-73.129778 40.391637 0 73.129778 32.744375 73.129778 73.129778l0 7.404147 0 65.72719 0 9.307001c50.686689 13.086217 97.862215 39.684106 135.657491 78.232109l48.487732-27.997368 22.828023-13.176607c34.977618-20.192702 79.701718-8.212977 99.89442 26.763083 20.198936 34.982294 8.212977 79.706394-26.764641 99.900654l-30.822819 17.79738-32.50905 18.769847 0 0 0 0-7.983886 4.605189c14.488813 52.009805 13.929333 106.159347-0.077922 156.599803l64.979139 37.511641 0 0 6.414537 3.701294C899.303409 651.772936 911.289368 696.498594 891.096666 731.474653L891.096666 731.474653zM891.096666 731.474653M197.330785 324.240361c-1.932465 3.232203-3.824411 6.497135-5.649343 9.785442L197.330785 324.240361 197.330785 324.240361zM197.330785 324.240361M830.515443 690.133926l-5.655577 9.804144C826.793889 696.699632 828.685835 693.433143 830.515443 690.133926L830.515443 690.133926zM830.515443 690.133926M505.297151 146.430195l11.304921 0C512.835324 146.369416 509.067017 146.374091 505.297151 146.430195L505.297151 146.430195zM505.297151 146.430195M516.898176 877.740444l-11.31583 0C509.350653 877.796547 513.125193 877.796547 516.898176 877.740444L516.898176 877.740444zM516.898176 877.740444" p-id="4948"></path></svg>',
    );
    __publicField(
      this,
      'editSvg',
      '<svg t="1760920692801" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3545" width="200" height="200"><path d="M1013.929675 128.26571a143.759824 143.759824 0 0 1 10.44409 53.858738 84.576649 84.576649 0 0 1-5.836403 30.308339 92.870485 92.870485 0 0 1-18.635533 29.284408 1314.726599 1314.726599 0 0 1-24.983901 24.574329c-7.372299 7.06512-13.82306 13.311095-19.249891 18.737926-6.143582 6.143582-12.082378 11.672806-17.406817 16.382886L720.266444 82.598415c9.317766-8.601015 20.478607-18.942712 33.277737-31.02509s23.448006-21.604931 31.946628-28.67005a102.085858 102.085858 0 0 1 68.193763-22.731255c11.263234 0.307179 22.116896 2.047861 32.560985 5.222045 10.546483 3.071791 19.659463 6.655547 27.441334 10.546483 16.280493 8.601015 34.301667 23.550399 54.063524 45.052936 19.864249 21.502538 35.120812 43.82422 46.076867 67.272226z m-907.20231 570.943576l32.560986-33.38013c17.099637-17.509209 38.397389-39.216533 64.098041-64.917186l84.986221-85.395793 94.303987-94.815953 250.350976-251.477299L850.817567 389.163169 600.46659 640.640468l-93.177663 94.815953c-31.02509 30.410732-58.978389 58.364031-83.859898 83.655111-24.779115 25.29108-45.360116 46.17926-61.743001 62.562146a504.797674 504.797674 0 0 1-55.804206 50.274981c-10.239304 7.884264-20.581 14.130239-31.537055 18.737926a507.152714 507.152714 0 0 1-47.715156 19.86425 1609.311367 1609.311367 0 0 1-131.063087 42.185931c-20.478607 5.426831-35.837563 8.908194-45.974474 10.546483-20.88818 2.35504-34.813633-0.819144-41.981145-9.42016-6.860333-8.601015-8.805801-22.93604-5.73401-43.312254a396.261054 396.261054 0 0 1 11.058448-47.305584c5.836403-20.683394 12.082378-42.185931 18.635532-64.40522 6.553154-22.219289 13.003916-42.697897 19.249891-61.435822 6.143582-18.635533 11.263234-31.537055 15.15417-38.602176 4.607687-10.853662 9.829732-20.785787 15.666135-29.796373a192.49891 192.49891 0 0 1 25.086294-29.796374z" fill="#FF9500" p-id="3546"></path></svg>',
    );
    __publicField(
      this,
      'deleteSvg',
      '<svg t="1760921450746" class="jhs-icon icon" viewBox="0 0 1194 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4530" width="200" height="200"><path d="M761.086847 36.028779s309.754321-147.538628 424.952209 231.50509c2.047962 6.570546 71.337359 253.862013-220.838618 415.139055-12.970429 7.167869-267.515096 145.746661-370.339877 341.327076 0 0-90.963666-205.649563-393.379455-351.566888-6.399883-3.071944-304.549083-156.583796-163.751664-487.2444 3.669266-8.533177 163.666333-336.20717 466.423449-99.411511l24.575549 27.391498L387.931021 324.279495l237.648977 159.570408-109.139333 145.746661L625.579998 849.069874l-30.719437-205.820227 166.226286-169.81022-216.486698-168.103585L761.086847 36.028779z" fill="#F4382E" p-id="4531"></path></svg>',
    );
    __publicField(
      this,
      'checkSvg',
      '<svg t="1760921633527" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5603" width="200" height="200"><path d="M924.928 544A413.76 413.76 0 0 1 544 924.736v3.264h-64v-3.2A413.696 413.696 0 0 1 99.072 544H96v-64h3.072A413.696 413.696 0 0 1 480 99.2V96h64v3.2a413.76 413.76 0 0 1 380.928 380.8h3.072v64h-3.072z m-64-64A350.016 350.016 0 0 0 544 163.2V288h-64V163.2A350.016 350.016 0 0 0 163.072 480H288v64H163.072A350.016 350.016 0 0 0 480 860.8V736h64v124.8a350.016 350.016 0 0 0 316.928-316.8H736v-64h124.928zM512 544a32 32 0 1 1 32-32 32 32 0 0 1-32 32z" fill="#333333" p-id="5604"></path></svg>',
    );
    __publicField(
      this,
      'actressSvg',
      '<svg t="1760926744637" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1948" width="200" height="200"><path d="M265.950168 668.467036V209.809493A209.809493 209.809493 0 0 1 475.759661 0h40.949536A209.809493 209.809493 0 0 1 726.564189 209.809493v440.435" p-id="1949"></path><path d="M916.558657 825.861124a193.463804 193.463804 0 0 0-137.442564-155.83573l-186.001889-45.795231-10.487631-124.293214H424.106373L412.231008 624.025416l-170.623063 44.44162a193.452429 193.452429 0 0 0-133.666108 154.698244L76.410695 1023.192384h871.189985z" fill="#FFE7D9" p-id="1950"></path><path d="M668.472724 265.682859c68.431223-29.187919 96.140409 100.349111 5.20969 151.774902z" fill="#FFCFB5" p-id="1951"></path><path d="M676.378259 334.421203c1.137487-99.814492-38.674561-172.158671-38.674561-172.15867l-59.740822 11.920865a493.805894 493.805894 0 0 1-80.761583 9.099896 493.669396 493.669396 0 0 1-80.761583-9.099896l-59.683948-11.88674s-39.812048 72.344179-38.776934 172.15867l-1.080613 92.05683c5.209691 56.271486 92.4777 121.381247 195.022161 119.163147 61.196805 0.034125 165.59537-51.573665 165.59537-119.197272z" fill="#FFE7D9" p-id="1952"></path><path d="M322.198905 274.703131c-68.419848-29.187919-96.140409 100.349111-5.209691 151.774902z" fill="#FFCFB5" p-id="1953"></path><path d="M297.390311 812.461526H742.034014a38.458438 38.458438 0 0 1 38.458438 38.458439V1020.325917H258.931873V850.90859a38.458438 38.458438 0 0 1 38.458438-38.447064z" fill="#FFD527" p-id="1954"></path><path d="M690.539973 92.284327c-20.645391 84.287793-275.613121 235.323328-424.589805 117.525166l104.955934-95.548915 139.399042-64.529643z" p-id="1955"></path><path d="M285.321573 383.708519h33.624119v177.118114h-33.624119zM675.855015 383.708519h33.624118v177.118114h-33.624118z" fill="#FFD527" p-id="1956"></path></svg>',
    );
    __publicField(
      this,
      'newSvg',
      '<svg t="1760926857487" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3954" width="200" height="200"><path d="M508.330667 733.994667c-11.008-7.338667-13.44-17.109333-7.338667-29.333334 28.117333-37.888 41.557333-98.986667 40.341333-183.317333v-165.013333c0-14.656 7.338667-23.210667 21.994667-25.664 37.888-1.216 82.496-5.504 133.845333-12.842667 13.44-2.432 21.376 3.072 23.829334 16.512 1.216 12.224-4.266667 19.562667-16.512 21.994667a1787.093333 1787.093333 0 0 1-113.664 11.008c-6.101333 0-9.173333 3.669333-9.173334 10.986666v84.330667h135.68c12.224 1.237333 18.944 7.957333 20.16 20.181333-1.216 10.986667-7.936 17.109333-20.16 18.346667h-36.672v223.658667c-1.216 12.202667-7.936 18.944-20.16 20.16-11.008-1.216-17.109333-7.957333-18.346666-20.16V501.162667h-60.48v18.346666c1.216 92.885333-13.44 161.92-44.010667 207.146667-6.101333 12.224-15.893333 14.677333-29.333333 7.338667z m-131.989334-282.325334c-1.237333 0-2.453333 0.618667-3.669333 1.834667h45.824a522.666667 522.666667 0 0 0 16.512-31.168c7.317333-12.224 12.224-20.778667 14.656-25.664 6.122667-11.008 15.274667-14.677333 27.52-11.008 9.770667 6.122667 12.202667 14.058667 7.317333 23.829333-4.906667 9.792-13.44 24.448-25.664 44.010667h49.493334c9.770667 1.216 15.274667 6.72 16.512 16.490667-1.237333 11.008-6.741333 17.109333-16.512 18.346666h-82.496a12.437333 12.437333 0 0 1 3.669333 9.173334v38.485333h69.653333c9.792 1.216 15.296 6.72 16.512 16.490667-1.216 11.008-6.72 17.130667-16.512 18.346666h-69.653333v108.16c0 34.218667-15.274667 51.946667-45.845333 53.162667h-16.490667a195.157333 195.157333 0 0 1-20.16 1.834667c-12.224 0-19.562667-6.72-22.016-20.16 1.237333-12.224 7.338667-18.944 18.346667-20.16 2.432 0 6.101333 0.597333 10.986666 1.834666h11.008c15.893333 0 23.829333-8.554667 23.829334-25.685333v-98.986667H314.026667c-11.008-1.216-17.109333-7.338667-18.346667-18.346666 1.237333-9.770667 7.338667-15.274667 18.346667-16.490667h75.157333V497.493333c0-3.669333 1.216-6.72 3.669333-9.173333h-89.813333c-11.029333-1.216-17.130667-7.317333-18.346667-18.325333 1.216-9.770667 7.317333-15.274667 18.346667-16.490667h56.810667c-3.669333-1.216-6.72-4.266667-9.173334-9.173333-1.216-1.216-3.050667-4.266667-5.482666-9.173334a758.336 758.336 0 0 0-14.677334-23.829333c-4.885333-9.770667-3.050667-17.706667 5.504-23.829333 11.008-3.669333 19.562667-1.216 25.664 7.338666 2.453333 2.432 6.122667 7.338667 11.008 14.656 6.101333 8.554667 9.770667 14.08 10.986667 16.512 4.906667 9.770667 2.453333 18.346667-7.317333 25.664z m-60.501333-71.509333c-9.792-1.216-15.274667-7.317333-16.512-18.346667 1.237333-9.749333 6.72-15.253333 16.512-16.490666h75.157333c-3.669333-12.202667-7.338667-21.973333-10.986666-29.333334-1.237333-12.202667 3.648-19.541333 14.656-21.973333 12.224-2.453333 21.397333 1.216 27.52 10.986667 0 1.216 0.597333 3.669333 1.813333 7.338666 4.906667 15.872 9.173333 26.88 12.842667 32.981334h60.48c11.008 1.237333 17.130667 6.741333 18.346666 16.512-1.216 11.008-7.338667 17.109333-18.346666 18.346666h-181.482667z m-14.677333 311.68c-8.533333-6.122667-10.986667-14.08-7.338667-23.829333a1659.648 1659.648 0 0 0 33.002667-66.005334c4.906667-9.792 12.224-12.842667 22.016-9.173333 9.770667 4.906667 13.44 12.224 10.986666 21.994667-3.669333 6.122667-9.173333 17.728-16.490666 34.837333-8.554667 15.893333-14.677333 27.52-18.346667 34.837333-4.885333 8.554667-12.821333 11.008-23.829333 7.338667z m201.664-25.664c-9.770667 4.885333-18.346667 2.432-25.664-7.338667a1138.56 1138.56 0 0 1-27.498667-44.010666c-4.885333-8.533333-3.050667-16.490667 5.504-23.829334 9.770667-3.669333 18.346667-1.216 25.664 7.338667l14.677333 21.994667c6.101333 9.770667 10.389333 17.109333 12.821334 21.994666 4.906667 8.554667 3.050667 16.512-5.504 23.850667z" fill="#333333" p-id="3955"></path><path d="M675.328 117.717333A425.429333 425.429333 0 0 0 512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667c0-56.746667-11.093333-112-32.384-163.328a21.333333 21.333333 0 0 0-39.402667 16.341333A382.762667 382.762667 0 0 1 896 512c0 212.074667-171.925333 384-384 384S128 724.074667 128 512 299.925333 128 512 128c51.114667 0 100.8 9.984 146.986667 29.12a21.333333 21.333333 0 0 0 16.341333-39.402667z" fill="#333333" p-id="3956"></path></svg>',
    );
    __publicField(
      this,
      'refreshSvg',
      '<svg t="1760926993643" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5942" width="200" height="200"><path d="M511.966722 0a511.966722 511.966722 0 1 0 179.828311 32.445891l-22.46254 59.964102A447.970882 447.970882 0 1 1 511.966722 63.99584a31.99792 31.99792 0 0 0 0-63.99584z" fill="#333333" p-id="5943"></path><path d="M649.2378 9.151405A30.909991 30.909991 0 0 1 671.316364 0h193.267438a31.99792 31.99792 0 0 1 31.357962 31.99792c0 17.662852-13.759106 31.99792-31.357962 31.99792H703.954243v160.629559a31.99792 31.99792 0 0 1-31.99792 31.357962 31.485953 31.485953 0 0 1-31.99792-31.357962V31.357962c0-8.511447 3.647763-16.318939 9.343392-21.950573z" fill="#333333" p-id="5944"></path></svg>',
    );
    __publicField(
      this,
      'blacklistSvg',
      '<svg t="1761386375897" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1936" width="200" height="200"><path d="M513.199827 65.667605c-246.537999 0-446.399933 199.861934-446.399933 446.399933 0 246.553349 199.861934 446.399933 446.399933 446.399933 246.553349 0 446.399933-199.846584 446.399933-446.399933C959.599759 265.529539 759.753175 65.667605 513.199827 65.667605zM513.199827 894.697075c-211.320916 0-382.629537-171.322947-382.629537-382.628514 0-94.183056 34.029024-180.417069 90.461291-247.080352l165.389818 165.389818c4.320399 39.651069 26.816762 73.840752 58.981323 94.068446-72.189136 27.369348-123.517151 97.156784-123.517151 178.936345l337.541643 0 100.846826 100.846826C693.608709 860.664981 607.375719 894.697075 513.199827 894.697075zM805.362956 759.14175 697.264982 651.0448c-16.556071-58.332547-60.10082-105.306394-116.275213-126.601396 35.888372-22.570042 59.752896-62.511729 59.752896-108.032482 0-70.436212-57.108672-127.542838-127.542838-127.542838-48.218188 0-90.184999 26.765597-111.865787 66.245773L266.120498 219.900316c66.663282-56.432267 152.897296-90.461291 247.079328-90.461291 211.304544 0 382.628514 171.308621 382.628514 382.629537C895.82834 606.244454 861.796246 692.476421 805.362956 759.14175z" fill="#272636" p-id="1937"></path></svg>',
    );
    __publicField(
      this,
      'removeSvg',
      '<svg t="1761958343616" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1939" width="200" height="200"><path d="M405.312 736a32 32 0 0 1-32-32V448a32 32 0 0 1 64 0v256a32 32 0 0 1-32 32zM650.688 448a32 32 0 0 0-64 0v256a32 32 0 1 0 64 0V448z" fill="#333333" p-id="1940"></path><path d="M514.816 53.312h-2.752c-21.504 0-39.808 0-55.04 1.408a116.672 116.672 0 0 0-45.568 12.352c-5.76 3.008-11.2 6.528-16.32 10.496a116.608 116.608 0 0 0-30.144 36.352c-7.552 13.248-15.168 29.888-24.128 49.536l-17.856 39.232H128a32 32 0 0 0 0 64h32V832A160 160 0 0 0 320 992h384a160 160 0 0 0 160-160V266.688h32a32 32 0 0 0 0-64h-190.912l-20.992-43.264c-9.152-18.944-16.896-35.008-24.576-47.744a116.608 116.608 0 0 0-30.208-35.072 117.376 117.376 0 0 0-16.064-10.112 116.608 116.608 0 0 0-44.736-11.84c-14.784-1.28-32.64-1.28-53.696-1.28zM800 266.688V832a96 96 0 0 1-96 96H320A96 96 0 0 1 224 832V266.688h576z m-166.016-64h-240.64l5.184-11.456c9.664-21.184 16.064-35.2 22.016-45.568a54.144 54.144 0 0 1 13.568-17.28 53.312 53.312 0 0 1 7.424-4.8 54.144 54.144 0 0 1 21.312-5.12c11.968-1.088 27.328-1.152 50.624-1.152 22.72 0 37.76 0 49.344 1.088 11.072 0.96 16.704 2.752 20.928 4.928 2.56 1.28 4.992 2.88 7.36 4.608 3.776 2.816 7.808 7.168 13.504 16.64 6.016 10.048 12.608 23.488 22.528 43.968l6.848 14.08z" fill="#333333" p-id="1941"></path></svg>',
    );
    __publicField(
      this,
      'copySvg',
      '<svg t="1749017229420" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9184" width="200" height="200"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" fill="#666666" p-id="9185"></path><path d="M512 512m-42.666667 0a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 1 0-85.333334 0Z" fill="#666666" p-id="9186"></path><path d="M341.333333 512m-42.666666 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" fill="#666666" p-id="9187"></path><path d="M682.666667 512m-42.666667 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" fill="#666666" p-id="9188"></path></svg>',
    );
    __publicField(
      this,
      'titleSvg',
      '<svg t="1747553289744" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7507" width="200" height="200" fill="#FFFFFF"><path d="M959.8 150.8c0-2.3-1.9-4.2-4.2-4.2H253.3c-2.3 0-4.2 1.9-4.2 4.2v115.9c0 2.3 1.9 4.2 4.2 4.2h702.3c2.3 0 4.2-1.9 4.2-4.2V150.8z" fill="" p-id="7508"></path><path d="M126.4 208.8m-62.2 0a62.2 62.2 0 1 0 124.4 0 62.2 62.2 0 1 0-124.4 0Z" fill="" p-id="7509"></path><path d="M851.5 453.7c0-2.1-1.8-3.9-3.9-3.9H252.9c-2.1 0-3.9 1.7-3.9 3.9v116.6c0 2.1 1.7 3.9 3.9 3.9h594.7c2.1 0 3.9-1.7 3.9-3.9V453.7z" fill="" p-id="7510"></path><path d="M126.4 512m-62.2 0a62.2 62.2 0 1 0 124.4 0 62.2 62.2 0 1 0-124.4 0Z" fill="" p-id="7511"></path><path d="M851.5 756.9c0-2.1-1.8-3.9-3.9-3.9H252.9c-2.1 0-3.9 1.8-3.9 3.9v116.6c0 2.1 1.7 3.9 3.9 3.9h594.7c2.1 0 3.9-1.7 3.9-3.9V756.9z" fill="" p-id="7512"></path><path d="M126.4 815.2m-62.2 0a62.2 62.2 0 1 0 124.4 0 62.2 62.2 0 1 0-124.4 0Z" fill="" p-id="7513"></path></svg>',
    );
    __publicField(
      this,
      'carNumSvg',
      '<svg t="1747552574854" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3539" width="200" height="200" fill="#FFFFFF"><path d="M920.337035 447.804932c-6.067182-6.067182-10.918677-11.643178-16.985859-17.71036l48.536436-30.334889-42.469254-109.207238-121.340579 12.134365c-6.067182-6.067182-6.067182-12.134365-12.134365-18.201547-12.134365-12.134365-18.201547-24.267706-24.267706-30.334889-24.26873-36.402071-30.334889-42.469254-54.603619-42.469254H339.116511c-18.201547 0-24.267706 6.067182-54.603619 42.469254-6.067182 6.067182-12.134365 18.201547-24.267706 30.334889 0 0-6.067182 6.067182-12.134365 18.201547l-115.27442-12.134365-48.536436 109.207238 51.090608 24.378223c-6.067182 6.067182-30.334889 34.660404-30.334889 34.660405l-15.542998 22.280446-12.282744 17.018605c-6.067182 12.134365-5.064342 10.868535-5.064342 29.070082v224.480635c0 36.402071 18.201547 60.670801 54.603618 60.670801h115.273397c36.402071 0 54.603619-24.267706 54.603619-54.603619v-18.201547h424.693562v18.201547c0 30.334889 18.201547 54.603619 54.603618 54.603619h115.273397c36.402071 0 60.670801-24.267706 60.670801-60.670801V539.300786c0-42.469254 0.685615-46.662763-11.44875-64.863287-4.731768-6.744611-11.94403-16.196891-20.101827-26.632567z m-35.186383-78.381161l-30.334889 18.201547-12.134365-12.134365c-6.067182-8.899694-12.134365-12.134365-12.134365-18.201547l42.469254-6.067183 12.134365 18.201548z m-533.899776-97.072873h339.755054l78.871325 103.140055H272.378527l78.872349-103.140055zM175.305655 357.290429h36.402071c-6.067182 6.067182-6.067182 12.134365-12.134365 18.201547l-18.201547 6.067183-18.201547-12.134365 12.135388-12.134365z m667.375743 394.35765h-54.603619V678.843936H242.043638v72.804143H132.837424V527.167444c0-12.134365-0.041956-20.662599 1.216711-23.556508 1.258667-2.89391 9.955746-16.924461 21.193695-29.173437l35.722596-38.276768h639.576607l21.917172 20.938891c6.067182 6.067182 21.847587 21.366633 25.712615 28.732392 7.621585 9.996678 6.973832 10.999518 13.041014 23.133883v242.682182h-48.536436zM242.043638 533.234627h133.474944v60.670801H242.043638v-60.670801z m412.559197 0h133.474944v60.670801H654.602835v-60.670801z" p-id="3540"></path></svg>',
    );
    __publicField(
      this,
      'downSvg',
      '<svg t="1747552626242" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4551" width="200" height="200" fill="#FFFFFF"><path d="M641.6 660l-8.64-64 32-4.32a211.2 211.2 0 0 0-26.72-420.32 215.36 215.36 0 0 0-213.12 192 94.56 94.56 0 0 0 0 11.52v41.28h-64V384v-7.04a153.12 153.12 0 0 1 0-19.52A279.84 279.84 0 0 1 636.16 108H640A275.2 275.2 0 0 1 673.28 656z" fill="#333333" p-id="4552"></path><path d="M490.4 446.24l-7.52-39.84a182.4 182.4 0 0 1 107.52-162.88l29.12-13.28L646.08 288l-29.12 13.28a117.92 117.92 0 0 0-70.08 101.28l6.24 30.4zM392.96 652.32h-78.72A202.24 202.24 0 0 1 256 256l30.72-9.12 18.24 61.28-30.72 9.12a138.24 138.24 0 0 0 39.68 270.72h78.72zM479.2 512h64v320h-64z" fill="#333333" p-id="4553"></path><path d="M510.4 908l-156.32-147.68 43.84-46.4 112.48 106.08 112.8-106.08 43.84 46.56-156.64 147.52z" fill="#333333" p-id="4554"></path></svg>',
    );
    __publicField(
      this,
      'handleSvg',
      '<svg t="1749106236917" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2628" width="200" height="200" fill="#FFFFFF"><path d="M838 989.48a32 32 0 0 1-22.5-9.22L519.3 687.6 207.48 980.8a32 32 0 0 1-54-23.32V136.52A98.54 98.54 0 0 1 252 38.1h519.6A98.52 98.52 0 0 1 870 136.52v820.96a32 32 0 0 1-32 32zM252 102.1a34.46 34.46 0 0 0-34.42 34.42v746.96L498 619.84a32 32 0 0 1 44.42 0.56L806 880.88V136.52a34.46 34.46 0 0 0-34.4-34.42z" p-id="2629"></path><path d="M648 604.92a28 28 0 0 1-16.46-5.34l-112.84-82-112.84 82a28 28 0 0 1-43.08-31.32l43.1-132.64-112.84-82a28 28 0 0 1 16.46-50.66h139.48L492 170.34a28 28 0 0 1 53.26 0l43.1 132.64h139.48a28 28 0 0 1 16.46 50.66l-112.84 82 43.1 132.64A28 28 0 0 1 648 604.92z m-129.3-150a27.86 27.86 0 0 1 16.46 5.36l59.58 43.28-22.76-70a28 28 0 0 1 10.02-31.28l59.58-43.3H568a28 28 0 0 1-26.64-19.34l-22.76-70-22.76 70a28 28 0 0 1-26.62 19.34h-73.64l59.58 43.3a28 28 0 0 1 10.16 31.3l-22.76 70 59.58-43.28a28 28 0 0 1 16.46-5.32z" p-id="2630"></path></svg>',
    );
    __publicField(
      this,
      'siteSvg',
      '<svg t="1749107903569" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12439" width="200" height="200"><path d="M882.758621 133.674884C882.758621 59.84828 822.91034 0 749.083736 0 675.25715 0 615.40887 59.84828 615.40887 133.674884 615.40887 163.358402 625.152318 191.656395 642.813352 214.773283L670.872117 193.336726 648.314739 166.170836 253.911693 493.666092 276.469054 520.831982 302.371681 496.834595C277.256669 469.725608 241.995388 453.990153 204.295574 453.990153 130.46897 453.990153 70.62069 513.838433 70.62069 587.66502 70.62069 661.491624 130.46897 721.339904 204.295574 721.339904 255.555319 721.339904 301.619094 692.208675 324.036714 647.136344L276.646223 663.002394 706.082022 877.440106 721.856794 845.849335 690.37312 829.861888C680.932829 848.452414 675.940882 869.068818 675.940882 890.325116 675.940882 964.15172 735.789162 1024 809.615766 1024 883.442353 1024 943.290633 964.15172 943.290633 890.325116 943.290633 874.050807 940.36533 858.125365 934.723584 843.16446L868.645076 868.0826C871.294817 875.109252 872.669943 882.595452 872.669943 890.325116 872.669943 925.14899 844.439623 953.37931 809.615766 953.37931 774.791892 953.37931 746.561571 925.14899 746.561571 890.325116 746.561571 880.245089 748.902894 870.575616 753.340487 861.836782L769.436089 830.140063 737.631567 814.258564 308.195769 599.820853 276.554929 584.02108 260.805279 615.686903C250.212352 636.984797 228.494795 650.719214 204.295574 650.719214 169.4717 650.719214 141.241379 622.488894 141.241379 587.66502 141.241379 552.841163 169.4717 524.610842 204.295574 524.610842 222.12269 524.610842 238.680594 531.99985 250.566444 544.829369L273.29589 569.363385 299.026432 547.997855 693.429478 220.502616 719.514606 198.84265 698.930882 171.900169C690.596687 160.991373 686.029559 147.727007 686.029559 133.674884 686.029559 98.85101 714.25988 70.62069 749.083736 70.62069 783.90761 70.62069 812.137931 98.85101 812.137931 133.674884 812.137931 148.208022 807.249885 161.899255 798.379608 172.996785L853.543883 217.089695C872.331935 193.584128 882.758621 164.379366 882.758621 133.674884ZM749.083736 196.729062C729.149334 196.729062 710.818745 187.460449 698.930882 171.900169L642.813352 214.773283C667.922573 247.639305 706.904064 267.349751 749.083736 267.349751 790.225902 267.349751 828.357809 248.599782 853.543883 217.089695L798.379608 172.996785C786.455411 187.915034 768.530291 196.729062 749.083736 196.729062ZM337.970441 587.66502C337.970441 553.551854 325.093782 521.360666 302.371681 496.834595L250.566444 544.829369C261.309069 556.424898 267.349751 571.526356 267.349751 587.66502 267.349751 597.565263 265.091478 607.069184 260.805279 615.686903L324.036714 647.136344C333.156105 628.801148 337.970441 608.540036 337.970441 587.66502ZM809.615766 756.650249C758.753986 756.650249 712.986006 785.330865 690.37312 829.861888L753.340487 861.836782C764.027215 840.791658 785.603302 827.270938 809.615766 827.270938 836.08553 827.270938 859.461862 843.730308 868.645076 868.0826L934.723584 843.16446C915.252259 791.529949 865.714547 756.650249 809.615766 756.650249Z" fill="#389BFF" p-id="12440"></path></svg>',
    );
    __publicField(
      this,
      'videoSvg',
      '<svg t="1749003664455" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1952" width="200" height="200"><path d="M825.6 153.6H198.4C124.5 153.6 64 214.1 64 288v448c0 73.9 60.5 134.4 134.4 134.4h627.2c73.9 0 134.4-60.5 134.4-134.4V288c0-73.9-60.5-134.4-134.4-134.4z m-138.2 44.8l112 112H706l-112-112h93.4z m-156.8 0l112 112H526.7l-112-112h115.9z m-179.2 0l112 112H347.5l-112-112h115.9zM108.8 288c0-41.4 28.4-76.1 66.7-86.3l108.7 108.7H108.8V288z m806.4 448c0 49.4-40.2 89.6-89.6 89.6H198.4c-49.4 0-89.6-40.2-89.6-89.6V355.2h806.4V736z m0-425.6h-52.5l-112-112h74.9c49.4 0 89.6 40.2 89.6 89.6v22.4z" p-id="1953"></path><path d="M454 687.2l149.3-77.6c27.5-13.8 27.5-53 0-66.8L468 472.2c-31.2-15.6-68 7.1-68 42v139.6c0 27.8 29.2 45.8 54 33.4zM444.8 512l134.4 67.2-134.4 67.2V512z" p-id="1954"></path></svg>',
    );
    __publicField(
      this,
      'screenSvg',
      '<svg t="1750691468062" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2693" width="200" height="200"><path d="M288 160a64 64 0 0 0-64 64v576a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64v-576a64 64 0 0 0-64-64h-448m0-64h448a128 128 0 0 1 128 128v576a128 128 0 0 1-128 128h-448a128 128 0 0 1-128-128v-576a128 128 0 0 1 128-128z" fill="#4078FD" p-id="2694"></path><path d="M416 352m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#FE9C23" p-id="2695"></path><path d="M352 732.448a32 32 0 0 1-32-32v-160a32 32 0 0 1 44.224-29.568l130.112 53.632 153.952-169.984a32 32 0 0 1 55.712 21.472v284.448a32 32 0 0 1-32 32z m0-32h320z" fill="#4078FD" opacity=".2" p-id="2696"></path><path d="M672 416l-169.088 186.656-150.912-62.208v160h320V416m0-32a32 32 0 0 1 32 32v284.448a32 32 0 0 1-32 32h-320a32 32 0 0 1-32-32v-160a32 32 0 0 1 44.192-29.6l130.112 53.632 153.984-169.984a32 32 0 0 1 23.712-10.496z" fill="#4078FD" p-id="2697"></path></svg>',
    );
    __publicField(
      this,
      'recoveryVideoSvg',
      '<svg t="1749003779161" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8204" width="200" height="200"><path d="M938.666667 553.92V768c0 64.8-52.533333 117.333333-117.333334 117.333333H202.666667c-64.8 0-117.333333-52.533333-117.333334-117.333333V256c0-64.8 52.533333-117.333333 117.333334-117.333333h618.666666c64.8 0 117.333333 52.533333 117.333334 117.333333v297.92z m-64-74.624V256a53.333333 53.333333 0 0 0-53.333334-53.333333H202.666667a53.333333 53.333333 0 0 0-53.333334 53.333333v344.48A290.090667 290.090667 0 0 1 192 597.333333a286.88 286.88 0 0 1 183.296 65.845334C427.029333 528.384 556.906667 437.333333 704 437.333333c65.706667 0 126.997333 16.778667 170.666667 41.962667z m0 82.24c-5.333333-8.32-21.130667-21.653333-43.648-32.917333C796.768 511.488 753.045333 501.333333 704 501.333333c-121.770667 0-229.130667 76.266667-270.432 188.693334-2.730667 7.445333-7.402667 20.32-13.994667 38.581333-7.68 21.301333-34.453333 28.106667-51.370666 13.056-16.437333-14.634667-28.554667-25.066667-36.138667-31.146667A222.890667 222.890667 0 0 0 192 661.333333c-14.464 0-28.725333 1.365333-42.666667 4.053334V768a53.333333 53.333333 0 0 0 53.333334 53.333333h618.666666a53.333333 53.333333 0 0 0 53.333334-53.333333V561.525333zM320 480a96 96 0 1 1 0-192 96 96 0 0 1 0 192z m0-64a32 32 0 1 0 0-64 32 32 0 0 0 0 64z" fill="#000000" p-id="8205"></path></svg>',
    );
  }
  getName() {
    throw new Error(`${this.constructor.name} getName() not implemented`); // Changed from '未显示getName()'
  }
  getBean(name2) {
    return this.pluginManager.getBean(name2);
  }
  async initCss() {
    return '';
  }
  async handle() {}
  getPageInfo() {
    let carNum2,
      url,
      actress,
      actors,
      publishTime,
      currentHref2 = window.location.href;
    if (isJavDb) {
      carNum2 = $('a[title="Copy ID"]').attr('data-clipboard-text'); // Changed from '複製番號'
      url = currentHref2.split('?')[0].split('#')[0];
      actress = $('.female')
        .prev()
        .map((i, el) => $(el).text())
        .get()
        .join(' ');
      actors = $('.male')
        .prev()
        .map((i, el) => $(el).text())
        .get()
        .join(' ');
      publishTime = $('strong:contains("Date:")') // Changed from '日期:'
        .parent('.panel-block')
        .find('.value')
        .text()
        .trim();
    }
    if (isJavBus) {
      url = currentHref2.split('?')[0];
      carNum2 = url
        .split('/')
        .filter(Boolean)
        .pop()
        .replace(/_\d{4}-\d{2}-\d{2}$/, '');
      actress = $('span[onmouseover*="star_"] a')
        .map((i, el) => $(el).text())
        .get()
        .join(' ');
      actors = '';
      publishTime = $('span.header:contains("Release Date:")') // Changed from '發行日期:'
        .parent('p')
        .text()
        .trim()
        .replace('Release Date:', '') // Changed from '發行日期:'
        .trim();
    }
    return {
      carNum: carNum2,
      url: url,
      actress: actress,
      actors: actors,
      publishTime: publishTime,
    };
  }
  getActressId() {
    const match = currentHref.match(/\/actors\/([^/?]+)/);
    return match && match.length > 1 ? match[1] : null;
  }
  getActressPageInfo() {
    let currentHref2 = window.location.href;
    if (!currentHref2.includes('/actors/') && !currentHref2.includes('/star/'))
      throw new Error('API call error, not an actress detail page'); // Changed from '接口调用错误, 非演员详情页'
    let nameList = [],
      $actor = isJavDb
        ? $('.actor-section-name')
        : $('.avatar-box .photo-info .pb10');
    $actor.length &&
      $actor
        .text()
        .trim()
        .split(',')
        .forEach((name2) => {
          nameList.push(name2.trim());
        });
    let $sectionMeta = $(".section-meta:not(:contains('Movies'))"); // Changed from '影片'
    $sectionMeta.length &&
      $sectionMeta
        .text()
        .trim()
        .split(',')
        .forEach((name2) => {
          nameList.push(name2.trim());
        });
    let role =
        $(".section-meta:contains('Actor')").length > 0 ? 'actor' : 'actress', // Changed from '男優'
      movieType = 'censored';
    nameList.some((n) => n.includes('Uncensored')) &&
      (movieType = 'uncensored'); // Changed from '無碼'
    currentHref2.includes('uncensored') && (movieType = 'uncensored');
    let blacklistUrl = null,
      starId = null;
    const urlObj = new URL(currentHref2);
    if (isJavDb) {
      starId = urlObj.pathname
        .split('/')
        .filter((segment) => '' !== segment.trim())
        .pop();
      const params = urlObj.searchParams;
      params.delete('sort_type');
      params.delete('page');
      blacklistUrl = urlObj.toString();
    } else if (isJavBus) {
      const splitStr = '/star/',
        parts = currentHref2.split(splitStr);
      if (parts.length < 2) throw new Error('Failed to extract actress URL'); // Changed from '提取演员url失败'
      const host = parts[0];
      starId = parts[1].split('/')[0];
      blacklistUrl = host + splitStr + starId;
    }
    return {
      starId: starId,
      name: nameList[0],
      allName: nameList,
      role: role,
      movieType: movieType,
      blacklistUrl: blacklistUrl,
    };
  }
  getSelector(type) {
    const key = type || (isJavDb ? 'javdb' : isJavBus ? 'javbus' : null),
      selectors = {
        javdb: {
          boxSelector: '.movie-list',
          itemSelector: '.movie-list .item',
          coverImgSelector: '.cover img',
          requestDomItemSelector: '.movie-list .item',
          nextPageSelector: '.pagination-next',
        },
        javbus: {
          boxSelector: '.masonry',
          itemSelector: '.masonry .item',
          coverImgSelector: '.masonry .movie-box .photo-frame img',
          requestDomItemSelector: '#waterfall .item',
          nextPageSelector: '#next',
        },
      };
    if (!key || !selectors[key])
      throw new Error(
        'Type error: Unable to determine selector type (JavDb or JavBus)',
      ); // Changed from '类型错误: 无法确定选择器类型 (JavDb 或 JavBus)'
    return selectors[key];
  }
  parseMovieId(href) {
    return href.split('/').pop().split(/[?#]/)[0];
  }
  getBoxCarInfo($box2) {
    var _a2, _b, _c;
    const $aLink = $box2.find('a'),
      url = $aLink.attr('href');
    let carNum2 = null,
      title = null,
      publishTime = null;
    const $videoTitleEle = $box2.find('.video-title');
    if ($videoTitleEle.length > 0) {
      const $strongEle = $videoTitleEle.find('strong');
      $strongEle.length > 0 && (carNum2 = $strongEle.text().trim());
      title = null == (_a2 = $aLink.attr('title')) ? void 0 : _a2.trim();
      if (!title) {
        const fullTitleText = $videoTitleEle.text().trim();
        title =
          carNum2 && fullTitleText.includes(carNum2)
            ? fullTitleText.replace(carNum2, '').trim()
            : fullTitleText;
      }
      publishTime = $box2.find('.meta').text().trim();
    }
    if (!carNum2) {
      const $imgEle = $box2.find('img');
      $imgEle.length > 0 &&
        (title =
          (null == (_b = $imgEle.attr('title')) ? void 0 : _b.trim()) ||
          (null == (_c = $imgEle.attr('data-title')) ? void 0 : _c.trim()));
      const dateElements = $box2
          .find('date')
          .map((i, el) => $(el).text().trim())
          .get(),
        isDate = (s) => /^\d{4}-\d{1,2}-\d{1,2}$/.test(s);
      publishTime = dateElements.find(isDate) || null;
      carNum2 = dateElements.find((i) => !isDate(i)) || null;
    }
    if (!carNum2) {
      const msg = 'Failed to extract car number information: carNum is empty'; // Changed from '提取番号信息失败: carNum 为空'
      console.error(
        'Error in getBoxCarInfo:',
        msg,
        'Box Element:',
        $box2.get(0),
      );
      show.error(msg);
      throw new Error(msg);
    }
    return {
      carNum: carNum2,
      url: url || '',
      aHref: url || '',
      title: title || '',
      publishTime: publishTime || '',
    };
  }
  getBoxCarInfoList($boxList = null) {
    $boxList || ($boxList = $(this.getSelector().itemSelector));
    if (0 === $boxList.length) {
      clog.error(
        'Failed to get car number information for all items on the current list page!',
      ); // Changed from '获取当前列表页所有item的番号信息失败!'
      return [];
    }
    const results = [];
    $boxList.each((index, element) => {
      const $box2 = $(element);
      try {
        const carInfo = this.getBoxCarInfo($box2);
        results.push(carInfo);
      } catch (error) {
        clog.error(
          '[getBoxCarInfoList] Failed to extract single boxCar information:', // Changed from '提取单个 boxCar 信息失败:'
          error.message,
          'Element index:', // Changed from '元素索引:'
          index,
        );
      }
    });
    return results;
  }
  checkDuplicateCarNumbers(currentList, newList) {
    if (!isJavDb) return !1;
    if (
      !currentList ||
      0 === currentList.length ||
      !newList ||
      0 === newList.length
    )
      return !1;
    const currentCarNums = new Set(
      currentList.map((item) => item.carNum).filter((n) => n),
    );
    if (0 === currentCarNums.size) return !1;
    let consecutiveDuplicates = 0;
    for (let i = 0; i < newList.length; i++) {
      const newCarNum = newList[i] ? newList[i].carNum : null;
      if (newCarNum && currentCarNums.has(newCarNum)) {
        consecutiveDuplicates++;
        if (consecutiveDuplicates >= 2) {
          clog.warn(
            'Warning: Consecutive duplicate car number information detected, this category may be limited in page numbers.',
          ); // Changed from '警告: 检测到连续番号信息重复, 该类别可能已被限制页码。'
          return !0;
        }
      } else consecutiveDuplicates = 0;
    }
    return !1;
  }
}

class DetailPagePlugin extends BasePlugin {
  getName() {
    return 'DetailPagePlugin';
  }
  constructor() {
    super();
  }
  handle() {
    if (window.isDetailPage) {
      $('.video-meta-panel a').each(function () {
        const href = $(this).attr('href');
        href &&
          (href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('/')) &&
          $(this).attr('target', '_blank');
      });
      this.handleFancyBox();
    }
  }
  handleFancyBox() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('.fancybox-button--thumbs')) {
        const isVisible = !$('.fancybox-thumbs').is(':hidden');
        localStorage.setItem('jhs_fancyboxThumbs', isVisible.toString());
        unsafeWindow.$.fancybox.defaults.thumbs.autoStart = isVisible;
      }
    });
    if (void 0 !== unsafeWindow.$.fancybox) {
      const savedState = localStorage.getItem('jhs_fancyboxThumbs');
      unsafeWindow.$.fancybox.defaults.thumbs.autoStart = 'true' === savedState;
    }
  }
}

const selectDefaultQuality = (dmmVideoQualityList, intendedDefault) => {
    if (!dmmVideoQualityList || 0 === dmmVideoQualityList.length) return null;
    const availableSet = new Set(dmmVideoQualityList);
    if (availableSet.has(intendedDefault)) return intendedDefault;
    const priorityOrder = qualityOptions
      .map((option) => option.quality)
      .reverse();
    for (const quality of priorityOrder)
      if (availableSet.has(quality)) return quality;
    return dmmVideoQualityList[0];
  },
  CACHE_KEY = 'jhs_dmm_video';

class DmmVideoFetcher {
  constructor(carNum2, showErrorMessages = !0) {
    this.carNum = carNum2;
    this.showErrorMessages = showErrorMessages;
  }
  _checkCache() {
    const cachedData = localStorage.getItem(CACHE_KEY)
      ? JSON.parse(localStorage.getItem(CACHE_KEY))
      : {};
    if (cachedData[this.carNum]) {
      clog.debug(
        'Preview video information exists in cache',
        cachedData[this.carNum],
      ); // Changed from '缓存中存在预览视频信息'
      return cachedData[this.carNum];
    }
    return null;
  }
  _updateCache(videoMap) {
    const cachedData = localStorage.getItem(CACHE_KEY)
      ? JSON.parse(localStorage.getItem(CACHE_KEY))
      : {};
    cachedData[this.carNum] = videoMap;
    clog.debug('Successfully parsed preview video and cached:', videoMap); // Changed from '成功解析出预览视频并已缓存:'
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
  }
  async _searchContentIds() {
    const carNum2 = this.carNum,
      carNumNoHyphen = carNum2.replace(/-/g, ''),
      keywordAttempts = [
        {
          keyword: carNum2.replace('-', '00'),
          name: '00-Replacement keyword', // Changed from '00-替换关键词'
        },
        {
          keyword: carNum2,
          name: 'Original car number keyword', // Changed from '原始番号关键词'
        },
        {
          keyword: carNumNoHyphen,
          name: 'No hyphen keyword', // Changed from '无连字符关键词'
        },
      ],
      carNumLower = carNum2.toLowerCase();
    for (const attempt of keywordAttempts) {
      const { keyword: keyword, name: name2 } = attempt,
        currentTempCarNumLower = keyword.toLowerCase(),
        apiUrl2 = `https://api.dmm.com/affiliate/v3/ItemList?${new URLSearchParams(
          {
            api_id: 'UrwskPfkqQ0DuVry2gYL',
            affiliate_id: '10278-996',
            output: 'json',
            site: 'FANZA',
            sort: 'match',
            keyword: keyword,
          },
        ).toString()}`;
      let response;
      try {
        response = await gmHttp.get(apiUrl2);
      } catch (e) {
        clog.error(`API request failed, skipping ${name2}:`, e); // Changed from 'API 请求失败，跳过'
        continue;
      }
      if (!response || !response.result || !response.result.result_count) {
        clog.debug(
          `API search with ${name2} (${keyword}) returned no results, trying next keyword.`, // Changed from '使用 ${name2} (${keyword}) 进行 API 搜索 返回无结果，尝试下一个关键词。'
        );
        continue;
      }
      const newItems = [];
      for (const item of response.result.items) {
        if (newItems.length >= 2) break;
        const contentId = item.content_id || '',
          makerProduct = item.maker_product || '';
        if (
          contentId.includes(currentTempCarNumLower.replace('-', '')) ||
          carNumLower === makerProduct.toLowerCase() ||
          contentId.includes(carNumNoHyphen.toLowerCase())
        ) {
          newItems.push({
            serviceCode: item.service_code,
            floorCode: item.floor_code,
            contentId: contentId,
            pageUrl: item.URL,
          });
          clog.debug(
            `[${name2}] cid|makerProduct matched successfully:`, // Changed from 'cid|makerProduct 匹配成功:'
            contentId,
            makerProduct,
          );
        }
      }
      if (newItems.length > 0) {
        clog.debug(`--- Successfully found Content IDs via ${name2} ---`); // Changed from '--- 成功通过 ${name2} 找到 Content IDs ---'
        const $btn2 = $('#fanzaBtn');
        let url = `https://www.dmm.co.jp/search/=/searchstr=${keyword}`,
          type = 'single';
        if (newItems.length > 1) {
          $btn2.attr('href', url);
          $btn2.append(
            '<span class="site-tag" style="top:-15px">Multiple results</span>', // Changed from '多结果'
          );
          $btn2.css('backgroundColor', '#7bc73b');
          type = 'multiple';
        } else {
          url = newItems[0].pageUrl;
          $btn2.attr('href', url);
          $btn2.css('backgroundColor', '#7bc73b');
        }
        const dmmCacheKey = 'jhs_other_site_dmm',
          dmmCacheData = localStorage.getItem(dmmCacheKey)
            ? JSON.parse(localStorage.getItem(dmmCacheKey))
            : {};
        dmmCacheData[this.carNum] = {
          type: type,
          url: url,
        };
        localStorage.setItem(dmmCacheKey, JSON.stringify(dmmCacheData));
        return newItems;
      }
      clog.debug(
        `[${name2}] API returned ${response.result.result_count} results, but no exact Content ID match.`, // Changed from 'API 返回结果数' and '但无精确匹配的 Content ID。'
      );
    }
    clog.warn(
      'No matching Content ID found after trying all keywords, failed to parse Dmm video',
    ); // Changed from '所有关键词尝试均未找到匹配的Content ID, 解析Dmm视频失败'
    const $btn = $('#fanzaBtn');
    $btn.attr(
      'href',
      `https://www.dmm.co.jp/search/=/searchstr=${this.carNum}`,
    );
    $btn.attr('title', 'Not found, click to go to search page'); // Changed from '未查询到, 点击前往搜索页'
    $btn.css('backgroundColor', '#de3333');
    return null;
  }
  async _extractTrailerLinks({
    contentId: contentId,
    serviceCode: serviceCode,
    floorCode: floorCode,
  }) {
    const trailerPageUrl = `https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/cid=${contentId}/mtype=AhRVShI_/service=${serviceCode}/floor=${floorCode}/mode=/`,
      htmlContent = await gmHttp.get(trailerPageUrl, null, {
        'accept-language': 'ja-JP,ja;q=0.9',
        Cookie: 'age_check_done=1',
      });
    if ('string' != typeof htmlContent) {
      clog.error(htmlContent);
      throw new Error(
        'Failed to parse playback page content, not text content',
      ); // Changed from '解析播放页内容失败, 非文本内容'
    }
    if (htmlContent.includes('このサービスはお住まいの地域からは'))
      throw new Error(
        'Node unavailable, please shunt DMM domain to a Japanese IP',
      ); // Changed from '节点不可用，请将DMM域名分流到日本ip'
    const match = htmlContent.match(/const\s+args\s+=\s+(.*);/);
    if (!match)
      throw new Error('Could not find const args = ... variable in script'); // Changed from '未在脚本中找到 const args = ... 变量'
    let bitrates;
    try {
      ({ bitrates: bitrates } = JSON.parse(match[1]));
    } catch (e) {
      throw new Error(`Failed to parse player script JSON: ${e.message}`); // Changed from '解析播放器脚本 JSON 失败:'
    }
    const finalQualityMap = {},
      qualityKeys = qualityOptions.map((o) => o.quality).join('|'),
      qualityNameRegex = new RegExp(`(${qualityKeys})\\.mp4$`);
    if (!Array.isArray(bitrates)) {
      clog.error(
        'Failed to parse quality links: bitrates field is not an array or does not exist',
      ); // Changed from '解析画质链接失败: bitrates 字段不是一个数组或不存在'
      throw new Error(
        'Failed to parse quality links: bitrates field is not an array or does not exist',
      ); // Changed from '解析画质链接失败: bitrates 字段不是一个数组或不存在'
    }
    clog.debug('Original data returned:', bitrates); // Changed from '原始数据返回:'
    for (const item of bitrates) {
      const url = null == item ? void 0 : item.src;
      if (!url || 'string' != typeof url || !url.endsWith('.mp4')) continue;
      const qualityMatch = url.match(qualityNameRegex);
      let qualityKey = '';
      qualityMatch && qualityMatch[1] && (qualityKey = qualityMatch[1]);
      qualityKey &&
        !finalQualityMap[qualityKey] &&
        (finalQualityMap[qualityKey] = url);
    }
    if (0 === Object.keys(finalQualityMap).length)
      throw new Error('No preview quality video found matching requirements'); // Changed from '未找到匹配要求的预览画质视频'
    return finalQualityMap;
  }
  async fetchVideo() {
    const cachedResult = this._checkCache();
    if (cachedResult) return cachedResult;
    let contentItems;
    try {
      const testCarNum = this.carNum.toLowerCase();
      if (
        testCarNum.startsWith('heyzo') ||
        /^(n\d+|\d+(-\d+)*)$/.test(testCarNum) ||
        /^n\d+$/.test(testCarNum)
      )
        throw new Error('Uncensored car number type, cancelling dmm parsing'); // Changed from '无码番号类型, 取消dmm解析'
      if (this.carNum.includes('VR-'))
        throw new Error('VR type, cancelling dmm parsing'); // Changed from 'VR类型, 取消dmm解析'
      contentItems = await this._searchContentIds();
    } catch (e) {
      clog.error('DMM API search failed:', e); // Changed from 'DMM API 搜索失败:'
      const $btn = $('#fanzaBtn');
      $btn.attr(
        'href',
        `https://www.dmm.co.jp/search/=/searchstr=${this.carNum}`,
      );
      $btn.attr('title', 'Not found, click to go to search page'); // Changed from '未查询到, 点击前往搜索页'
      $btn.css('backgroundColor', '#de3333');
      return null;
    }
    if (!contentItems || 0 === contentItems.length) return null;
    try {
      const finalVideoMap = await Promise.any(
        contentItems.map((item) => this._extractTrailerLinks(item)),
      );
      this._updateCache(finalVideoMap);
      return finalVideoMap;
    } catch (error) {
      const errors = error.errors || [error];
      if (errors.some((err) => err.message.includes('Node unavailable')))
        // Changed from '节点不可用'
        this.showErrorMessages &&
          show.error(
            'Node unavailable, please shunt DMM domain to a Japanese IP',
          );
      // Changed from '节点不可用，请将DMM域名分流到日本ip'
      else {
        const displayError = errors[0].message || errors[0];
        clog.error(`Parsing failed: ${displayError}`, errors); // Changed from '解析失败:'
        this.showErrorMessages && show.error(`Parsing failed: ${displayError}`); // Changed from '解析失败:'
      }
      const $btn = $('#fanzaBtn');
      $btn.attr(
        'href',
        `https://www.dmm.co.jp/search/=/searchstr=${this.carNum}`,
      );
      $btn.attr('title', 'Not found, click to go to search page'); // Changed from '未查询到, 点击前往搜索页'
      $btn.css('backgroundColor', '#de3333');
      return null;
    }
  }
}

const getDmmVideo = async (carNum2, showErrorMessages = !0) =>
  new DmmVideoFetcher(carNum2, showErrorMessages).fetchVideo();

class PreviewVideoPlugin extends BasePlugin {
  getName() {
    return 'PreviewVideoPlugin';
  }
  async initCss() {
    return '\n            .video-control-btn {\n                min-width:120px;\n                padding: 7px 12px;\n                font-size: 12px;\n                background: rgba(0,0,0,0.7);\n                color: white;\n                border: none;\n                border-radius: 4px;\n                cursor: pointer;\n            }\n            .video-control-btn.active {\n                background-color: #1890ff;\n                color: white;\n                font-weight: bold;\n                border: 2px solid #096dd9;\n            }\n        ';
  }
  async handle() {
    if (!isDetailPage) return;
    let settingObj = await storageManager.getSetting();
    this.filterHotKey = settingObj.filterHotKey;
    this.favoriteHotKey = settingObj.favoriteHotKey;
    this.speedVideoHotKey = settingObj.speedVideoHotKey;
    let $preview = $('.preview-video-container');
    $preview.on('click', (event) => {
      utils.loopDetector(
        () => $('.fancybox-content #preview-video').length > 0,
        () => {
          this.handleVideo().then();
        },
      );
    });
    (await storageManager.getSetting('enableLoadPreviewVideo', YES)) !== YES ||
      currentHref.includes('autoPlay=1') ||
      this.initDmm().then();
    let href = window.location.href;
    (href.includes('gallery-1') || href.includes('gallery-2')) &&
      utils.loopDetector(
        () => $('.fancybox-content #preview-video').length > 0,
        () => {
          $('.fancybox-content #preview-video').length > 0 &&
            this.handleVideo().then();
        },
      );
    href.includes('autoPlay=1') && $preview.length > 0 && $preview[0].click();
  }
  async initDmm() {
    try {
      const dmmVideoMap = await getDmmVideo(this.getPageInfo().carNum, !1);
      if (!dmmVideoMap) return;
      let settingDefaultVideoQuality = await storageManager.getSetting(
        'videoQuality',
      );
      clog.debug(
        'Parsing other quality preview videos', // Changed from '解析其它画质预览视频'
        'Setting-Expected Quality', // Changed from '设置-期望画质'
        settingDefaultVideoQuality,
      );
      const defaultVideoUrl =
        dmmVideoMap[
          selectDefaultQuality(
            Object.keys(dmmVideoMap),
            settingDefaultVideoQuality,
          )
        ];
      clog.log('Switching to other quality preview video: ', defaultVideoUrl); // Changed from '切换其它画质预览视频:'
      const $previewVideoEL = $('#preview-video'),
        videoEl = $previewVideoEL.length ? $previewVideoEL[0] : null,
        isVideoElementHidden = !videoEl || utils.isHidden($previewVideoEL);
      if ($previewVideoEL.length) {
        if (videoEl) {
          const currentTime = videoEl.currentTime;
          $previewVideoEL.attr('src', defaultVideoUrl);
          if (!isVideoElementHidden) {
            clog.debug(
              'Player has been manually opened, changing progress bar',
            ); // Changed from '播放器已手动打开, 变更进度条'
            videoEl.currentTime = currentTime;
            videoEl.play();
          }
        }
      } else {
        clog.debug(
          'JavDB has no video playback element, starting to create...',
        ); // Changed from 'JavDB没有视频播放元素, 开始创建...'
        const videoCoverSrc = $('.column-video-cover img').attr('src');
        $('.preview-images').prepend(
          `\n                    <a class="preview-video-container" data-fancybox="gallery" href="#preview-video">\n                        <span>Trailer</span>\n                        <img src="${videoCoverSrc}" class="video-cover" style="width: 150px; height: auto;" alt="">\n                    </a>\n                `,
        );
        $('.preview-video-container').on('click', (event) => {
          utils.loopDetector(
            () => $('.fancybox-content #preview-video').length > 0,
            async () => {
              await this.handleVideo();
            },
          );
        });
      }
    } catch (error) {
      clog.error('Preloading dmm failed:', error); // Changed from '预加载dmm失败:'
    }
  }
  async handleVideo() {
    if ((await storageManager.getSetting('enableLoadPreviewVideo', YES)) === NO)
      return;
    const $videoEl = $('#preview-video');
    if (!$videoEl.length) return;
    const $videoContainer = $videoEl.parent();
    $videoContainer.css('position', 'relative');
    const videoEl = $videoEl[0],
      jhs_videoMuted = localStorage.getItem('jhs_videoMuted');
    jhs_videoMuted && (videoEl.muted = 'yes' === jhs_videoMuted);
    videoEl.addEventListener('volumechange', function () {
      localStorage.setItem('jhs_videoMuted', videoEl.muted ? 'yes' : 'no');
    });
    videoEl.play();
    let carNum2 = this.getPageInfo().carNum;
    const dmmVideoMap = await getDmmVideo(carNum2);
    let $bottomToolbar = $('<div></div>')
        .attr('id', 'video-bottom-toolbar')
        .css({
          display: 'flex',
          gap: '5px',
          'align-items': 'center',
          'flex-wrap': 'wrap',
        }),
      $qualityButtonGroup = $('<div></div>').css({
        display: 'flex',
        gap: '5px',
        'align-items': 'center',
      }),
      defaultVideoQuality = null;
    if (dmmVideoMap) {
      let storedQuality = await storageManager.getSetting('videoQuality');
      defaultVideoQuality = selectDefaultQuality(
        Object.keys(dmmVideoMap),
        storedQuality,
      );
      let defaultVideoUrl = dmmVideoMap[defaultVideoQuality];
      if ($videoEl.attr('src') !== defaultVideoUrl) {
        $videoEl.attr('src', defaultVideoUrl);
        videoEl.load();
        videoEl.play();
      }
      qualityOptions.forEach((option) => {
        let dmmVideoUrl = dmmVideoMap[option.quality];
        if (dmmVideoUrl) {
          const isActive = defaultVideoQuality === option.quality;
          let qualityButton = $(
            `\n                    <button class="video-control-btn${
              isActive ? ' active' : ''
            }" \n                            id="${
              option.id
            }" \n                            data-quality="${
              option.quality
            }"\n                            data-video-src="${dmmVideoUrl}"\n                            style="min-width: 40px; border: 1px solid #ccc; background-color: ${
              isActive ? '#007bff' : '#fff'
            }; color: ${
              isActive ? 'white' : 'black'
            };">\n                        ${
              option.text
            }\n                    </button>\n                `,
          );
          $qualityButtonGroup.append(qualityButton);
        }
      });
    }
    $bottomToolbar.append($qualityButtonGroup);
    let $functionButtonGroup = $('<div></div>').css({
        display: 'flex',
        gap: '5px',
        'align-items': 'center',
        'margin-left': 'auto',
      }),
      filterButton = $(
        `<button class="menu-btn" id="video-filterBtn" style="min-width: 120px; background-color:#de3333;">Block ${
          // Changed from '屏蔽'
          this.filterHotKey ? '(' + this.filterHotKey + ')' : ''
        }</button>`,
      );
    $functionButtonGroup.append(filterButton);
    let favoriteButton = $(
      `<button class="menu-btn" id="video-favoriteBtn" style="min-width: 120px; background-color:#25b1dc;">Collect ${
        // Changed from '收藏'
        this.favoriteHotKey ? '(' + this.favoriteHotKey + ')' : ''
      }</button>`,
    );
    $functionButtonGroup.append(favoriteButton);
    let speedButton = $(
      `<button class="menu-btn" id="speed-btn" style="min-width: 120px; background-color:#76b45d;">Fast Forward ${
        // Changed from '快进'
        this.speedVideoHotKey ? '(' + this.speedVideoHotKey + ')' : ''
      }</button>`,
    );
    $functionButtonGroup.append(speedButton);
    $bottomToolbar.append($functionButtonGroup);
    $videoContainer.append($bottomToolbar);
    $bottomToolbar.on('click', '.video-control-btn', async (e) => {
      const $button = $(e.currentTarget),
        videoSrc = $button.data('video-src');
      if (!$button.hasClass('active'))
        try {
          const currentTime = videoEl.currentTime;
          $videoEl.attr('src', videoSrc);
          videoEl.load();
          videoEl.currentTime = currentTime;
          await videoEl.play();
          $bottomToolbar.find('.video-control-btn').removeClass('active').css({
            'background-color': '#fff',
            color: 'black',
          });
          $button.addClass('active').css({
            'background-color': '#007bff',
            color: 'white',
          });
        } catch (error) {
          console.error('Failed to switch quality:', error); // Changed from '切换画质失败:'
        }
    });
    $('#speed-btn').on('click', () => {
      this.getBean('DetailPageButtonPlugin').speedVideo();
    });
    utils.rightClick(document.body, '#speed-btn', (event) => {
      this.getBean('DetailPageButtonPlugin').filterOne(event);
    });
    $('#video-filterBtn').on('click', (event) => {
      this.getBean('DetailPageButtonPlugin').filterOne(event);
    });
    $('#video-favoriteBtn').on('click', (event) => {
      this.getBean('DetailPageButtonPlugin').favoriteOne(event);
    });
  }
}

const _HotkeyManager = class _HotkeyManager {
  constructor() {
    if (new.target === _HotkeyManager)
      throw new Error('HotkeyManager cannot be instantiated.');
  }
  static registerHotkey(hotkeyString, callback, keyupCallback = null) {
    if (Array.isArray(hotkeyString)) {
      let id_list = [];
      hotkeyString.forEach((hotkey) => {
        if (!this.isHotkeyFormat(hotkey))
          throw new Error('Hotkey format error'); // Changed from '快捷键格式错误'
        let id = this.recordHotkey(hotkey, callback, keyupCallback);
        id_list.push(id);
      });
      return id_list;
    }
    if (!this.isHotkeyFormat(hotkeyString))
      throw new Error('Hotkey format error'); // Changed from '快捷键格式错误'
    return this.recordHotkey(hotkeyString, callback, keyupCallback);
  }
  static recordHotkey(hotkeyString, callback, keyupCallback) {
    let id = Math.random().toString(36).substr(2);
    this.registerHotKeyMap.set(id, {
      hotkeyString: hotkeyString,
      callback: callback,
      keyupCallback: keyupCallback,
    });
    return id;
  }
  static unregisterHotkey(id) {
    this.registerHotKeyMap.has(id) && this.registerHotKeyMap.delete(id);
  }
  static isHotkeyFormat(hotkeyString) {
    return hotkeyString
      .toLowerCase()
      .split('+')
      .map((k) => k.trim())
      .every((k) => ['ctrl', 'shift', 'alt'].includes(k) || 1 === k.length);
  }
  static judgeHotkey(hotkeyString, event) {
    const keyList = hotkeyString
        .toLowerCase()
        .split('+')
        .map((k) => k.trim()),
      ctrl = keyList.includes('ctrl'),
      shift = keyList.includes('shift'),
      alt = keyList.includes('alt'),
      key = keyList.find((k) => 'ctrl' !== k && 'shift' !== k && 'alt' !== k);
    return (
      (this.isMac ? event.metaKey : event.ctrlKey) === ctrl &&
      event.shiftKey === shift &&
      event.altKey === alt &&
      event.key.toLowerCase() === key
    );
  }
};

__publicField(_HotkeyManager, 'isMac', 0 === navigator.platform.indexOf('Mac'));

__publicField(_HotkeyManager, 'registerHotKeyMap', new Map());

__publicField(_HotkeyManager, 'handleKeydown', (event) => {
  for (const [id, data] of _HotkeyManager.registerHotKeyMap) {
    let hotkeyString = data.hotkeyString,
      callback = data.callback;
    _HotkeyManager.judgeHotkey(hotkeyString, event) && callback(event);
  }
});

__publicField(_HotkeyManager, 'handleKeyup', (event) => {
  for (const [id, data] of _HotkeyManager.registerHotKeyMap) {
    let hotkeyString = data.hotkeyString,
      keyupCallback = data.keyupCallback;
    keyupCallback &&
      _HotkeyManager.judgeHotkey(hotkeyString, event) &&
      keyupCallback(event);
  }
});

let HotkeyManager = _HotkeyManager;

document.addEventListener('keydown', (event) => {
  HotkeyManager.handleKeydown(event);
});

document.addEventListener('keyup', (event) => {
  HotkeyManager.handleKeyup(event);
});

class JavTrailersPlugin extends BasePlugin {
  getName() {
    return 'JavTrailersPlugin';
  }
  constructor() {
    super();
    this.hasBand = !1;
  }
  handle() {
    let href = window.location.href;
    if (!href.includes('handle=1')) return;
    if ($("h1:contains('Page not found')").length) {
      console.log('Car number cannot be matched, skipping to search'); // Changed from '番号无法匹配, 跳搜索'
      let keyword = href
        .split('?')[0]
        .split('video/')[1]
        .toLowerCase()
        .replace('00', '-');
      window.location.href =
        '/search/' + encodeURIComponent(keyword) + window.location.search;
      return;
    }
    let findList = $('.videos-list .video-link').toArray();
    if (findList.length) {
      const keyword = href.split('?')[0].split('search/')[1].toLowerCase(),
        matchedLink = findList.find((el) =>
          $(el).find('.vid-title').text().toLowerCase().includes(keyword),
        );
      if (matchedLink) {
        window.location.href =
          $(matchedLink).attr('href') + window.location.search;
        return;
      }
    }
    this.handlePlayJavTrailers();
    $('#videoPlayerContainer').on('click', () => {
      this.handlePlayJavTrailers();
    });
    window.addEventListener('message', (event) => {
      let videoEl = document.getElementById('vjs_video_3_html5_api');
      videoEl && (videoEl.currentTime += 5);
    });
    const urlParams = new URLSearchParams(window.location.search),
      filterHotKey = urlParams.get('filterHotKey'),
      favoriteHotKey = urlParams.get('favoriteHotKey'),
      speedVideoHotKey = urlParams.get('speedVideoHotKey');
    filterHotKey &&
      HotkeyManager.registerHotkey(filterHotKey, () =>
        window.parent.postMessage(filterHotKey, '*'),
      );
    favoriteHotKey &&
      HotkeyManager.registerHotkey(favoriteHotKey, () =>
        window.parent.postMessage(favoriteHotKey, '*'),
      );
    speedVideoHotKey &&
      HotkeyManager.registerHotkey(speedVideoHotKey, () => {
        const videoEl = document.getElementById('vjs_video_3_html5_api');
        videoEl && (videoEl.currentTime += 5);
      });
  }
  handlePlayJavTrailers() {
    if (!this.hasBand) {
      utils.loopDetector(
        () => 0 !== $('#vjs_video_3_html5_api').length,
        () => {
          setTimeout(() => {
            this.hasBand = !0;
            let videoEl = document.getElementById('vjs_video_3_html5_api');
            console.log(videoEl);
            videoEl.play();
            videoEl.currentTime = 5;
            videoEl.addEventListener('timeupdate', function () {
              videoEl.currentTime >= 14 &&
                videoEl.currentTime < 16 &&
                (videoEl.currentTime += 2);
            });
            $('#vjs_video_3_html5_api').css({
              position: 'fixed',
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              zIndex: '999999999',
            });
            $('.vjs-control-bar').css({
              position: 'fixed',
              bottom: '20px',
              zIndex: '999999999',
            });
          }, 100);
        },
      );
      utils.loopDetector(
        () => $('#vjs_video_3 canvas').length > 0,
        () => {
          0 !== $('#vjs_video_3 canvas').length &&
            $('#vjs_video_3 canvas').css({
              position: 'fixed',
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              top: '0',
              right: '0',
              zIndex: '999999998',
            });
        },
      );
    }
  }
}

class SubTitleCatPlugin extends BasePlugin {
  getName() {
    return 'SubTitleCatPlugin';
  }
  handle() {
    $('.t-banner-inner').hide();
    $('#navbar').hide();
    let keyword = new URLSearchParams(window.location.search)
        .get('search')
        .toLowerCase(),
      findList = $('.sub-table tr td a').toArray(),
      visibleCount = 0;
    findList.forEach((el) => {
      let item = $(el);
      item.text().toLowerCase().includes(keyword)
        ? visibleCount++
        : item.parent().parent().hide();
    });
    0 === visibleCount && show.error('No subtitles for this car number!'); // Changed from '该番号无字幕!'
    const $secTitle = $('.sec-title'),
      newHTML = $secTitle.html().replace(/^\d+/, visibleCount);
    $secTitle.html(newHTML);
  }
}

class Fc2Plugin extends BasePlugin {
  getName() {
    return 'Fc2Plugin';
  }
  async initCss() {
    return '\n            <style>\n                /* Pop-up layer style */\n                .movie-detail-layer .layui-layer-title {\n                    font-size: 18px;\n                    color: #333;\n                    background: #f8f8f8;\n                }\n                \n                \n                /* Container style */\n                .movie-detail-container {\n                    margin: 40px;\n                    height: 100%;\n                    background: #fff;\n                }\n                \n                .movie-poster-container {\n                    flex: 0 0 60%;\n                    padding: 15px;\n                }\n                \n                .right-box {\n                    flex: 1;\n                    padding: 20px;\n                    overflow-y: auto;\n                }\n                \n                /* Trailer iframe */\n                .movie-trailer {\n                    width: 100%;\n                    height: 100%;\n                    min-height: 400px;\n                    background: #000;\n                    border-radius: 4px;\n                }\n                \n                /* Movie info style */\n                .movie-title {\n                    font-size: 24px;\n                    margin-bottom: 15px;\n                    color: #333;\n                }\n                \n                .movie-meta {\n                    margin-bottom: 20px;\n                    color: #666;\n                }\n                \n                .movie-meta span {\n                    margin-right: 15px;\n                }\n                \n                /* Actor list */\n                .actor-list {\n                    display: flex;\n                    flex-wrap: wrap;\n                    gap: 8px;\n                    margin-top: 10px;\n                }\n                \n                .actor-tag {\n                    padding: 4px 12px;\n                    background: #f0f0f0;\n                    border-radius: 15px;\n                    font-size: 12px;\n                    color: #555;\n                }\n                \n                /* Image list */\n                .image-list {\n                    display: flex;\n                    flex-wrap: wrap;\n                    gap: 10px;\n                    margin-top: 10px;\n                }\n                \n                .movie-image-thumb {\n                    width: 120px;\n                    height: 80px;\n                    object-fit: cover;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    transition: transform 0.3s;\n                }\n                \n                .movie-image-thumb:hover {\n                    transform: scale(1.05);\n                }\n                \n                /* Loading and error states */\n                .search-loading, .movie-error {\n                    padding: 40px;\n                    text-align: center;\n                    color: #999;\n                }\n                \n                .movie-error {\n                    color: #f56c6c;\n                }\n                \n                .fancybox-container{\n                    z-index:99999999\n                 }\n                 \n                 \n                 /* Error message style */\n                .movie-not-found, .movie-error {\n                    text-align: center;\n                    padding: 30px;\n                    color: #666;\n                }\n                \n                .movie-not-found h3, .movie-error h3 {\n                    color: #f56c6c;\n                    margin: 15px 0;\n                }\n                \n                .icon-warning, .icon-error {\n                    font-size: 50px;\n                    color: #e6a23c;\n                }\n                \n                .icon-error {\n                    color: #f56c6c;\n                }\n                \n                .fc2-movie-panel-info .panel-block {\n                    padding: 0 !important;\n                }\n            </style>\n        ';
  }
  handle() {
    let fc2Url = '/advanced_search?type=3&score_min=0&d=1';
    $('.navbar-item:contains("FC2")').attr('href', fc2Url);
    $('.tabs a:contains("FC2")').attr('href', fc2Url);
    if (currentHref.includes('advanced_search?type=3')) {
      $('h2.section-title').contents().first().replaceWith('Fc2PPV');
      $('.section .container > .box').remove();
    }
    if (currentHref.includes('collection_codes?movieId')) {
      $('section').html('');
      const urlParams = new URLSearchParams(window.location.search);
      let movieId = urlParams.get('movieId'),
        carNum2 = urlParams.get('carNum'),
        url = urlParams.get('url');
      movieId && carNum2 && url && this.openFc2Dialog(movieId, carNum2, url);
    }
  }
  openFc2Dialog(movieId, carNum2, href) {
    let tempCarNum = carNum2.replace('FC2-', '');
    if (href.includes('123av')) {
      this.getBean('Fc2By123AvPlugin').open123AvFc2Dialog(carNum2, href);
      return;
    }
    layer.open({
      type: 1,
      title: carNum2,
      content:
        '\n            <div class="movie-detail-container">\n                \x3c!--<div class="movie-poster-container">\n                    <iframe class="movie-trailer" frameborder="0" allowfullscreen scrolling="no"></iframe>\n                </div>--\x3e\n               \x3c!-- <div class="right-box">--\x3e\n                    <div class="movie-info-container">\n                        <div class="search-loading">Loading...</div>\n                    </div>\n                    \n                    <div class="movie-panel-info fc2-movie-panel-info" style="margin-top:20px"><strong>Third-party resources: </strong></div>\n                    \n                    <div style="margin: 30px 0">\n                        <a id="filterBtn" class="menu-btn" style="background-color:#de3333"><span>🚫 Block</span></a>\n                        <a id="favoriteBtn" class="menu-btn" style="background-color:#25b1dc"><span>⭐ Collect</span></a>\n                        <a id="hasDownBtn" class="menu-btn" style="background-color:#7bc73b"><span>📥️ Downloaded</span></a>\n                        <a id="hasWatchBtn" class="menu-btn" style="background-color:#d7a80c;"><span>🔍 Watched</span></a>\n                        \n                        <a id="search-subtitle-btn" class="menu-btn fr-btn" style="background:linear-gradient(to bottom, #8d5656, rgb(196,159,91))">\n                            <span>Subtitle (SubTitleCat)</span>\n                        </a>\n                        <a id="xunLeiSubtitleBtn" class="menu-btn fr-btn" style="background:linear-gradient(to left, #375f7c, #2196F3)">\n                            <span>Subtitle (XunLei)</span>\n                        </a>\n                        <a id="magnetSearchBtn" class="menu-btn fr-btn" style="width: 120px; background: linear-gradient(to right, rgb(245,140,1), rgb(84,161,29)); color: white; text-align: center; padding: 8px 0;">\n                            <span>Magnet Search</span>\n                        </a>\n                    </div>\n                    <div class="message video-panel" style="margin-top:20px">\n                        <div id="magnets-content" class="magnet-links" style="margin: 0 0.75rem">\n                            <div class="search-loading">Loading...</div>\n                        </div>\n                    </div>\n                    <div id="reviews-content">\n                    </div>\n                    <div id="related-content">\n                    </div>\n                    <span id="data-actress" style="display: none"></span>\n                \x3c!--</div>--\x3e\n            </div>\n        ',
      area: utils.getResponsiveArea(['70%', '90%']),
      skin: 'movie-detail-layer',
      scrollbar: !1,
      success: (layero, index) => {
        this.loadData(movieId, carNum2);
        $('#favoriteBtn').on('click', async (event) => {
          const actress = $('#data-actress').text(),
            publishTime = $('#data-releaseDate').text();
          await storageManager.saveCar({
            carNum: carNum2,
            url: href,
            names: actress,
            actionType: Status_FAVORITE,
            publishTime: publishTime,
          });
          window.refresh();
          layer.closeAll();
        });
        $('#filterBtn').on('click', (event) => {
          utils.q(event, `Block ${carNum2}?`, async () => {
            // Changed from `是否屏蔽${carNum2}?`
            const actress = $('#data-actress').text(),
              publishTime = $('#data-releaseDate').text();
            await storageManager.saveCar({
              carNum: carNum2,
              url: href,
              names: actress,
              actionType: Status_FILTER,
              publishTime: publishTime,
            });
            window.refresh();
            layer.closeAll();
            window.location.href.includes('collection_codes?movieId') &&
              utils.closePage();
          });
        });
        $('#hasDownBtn').on('click', async (event) => {
          const actress = $('#data-actress').text(),
            publishTime = $('#data-releaseDate').text();
          await storageManager.saveCar({
            carNum: carNum2,
            url: href,
            names: actress,
            actionType: Status_HAS_DOWN,
            publishTime: publishTime,
          });
          window.refresh();
          layer.closeAll();
        });
        $('#hasWatchBtn').on('click', async (event) => {
          const actress = $('#data-actress').text(),
            publishTime = $('#data-releaseDate').text();
          await storageManager.saveCar({
            carNum: carNum2,
            url: href,
            names: actress,
            actionType: Status_HAS_WATCH,
            publishTime: publishTime,
          });
          window.refresh();
          layer.closeAll();
        });
        $('#search-subtitle-btn').on('click', (event) =>
          utils.openPage(
            `https://subtitlecat.com/index.php?search=${carNum2}`,
            carNum2,
            !1,
            event,
          ),
        );
        $('#xunLeiSubtitleBtn').on('click', () =>
          this.getBean('DetailPageButtonPlugin').searchXunLeiSubtitle(carNum2),
        );
        $('#magnetSearchBtn').on('click', () => {
          let magnetHub =
            this.getBean('MagnetHubPlugin').createMagnetHub(carNum2);
          layer.open({
            type: 1,
            title: 'Magnet Search', // Changed from '磁力搜索'
            content: '<div id="magnetHubBox"></div>',
            area: utils.getResponsiveArea(['60%', '80%']),
            scrollbar: !1,
            success: () => {
              $('#magnetHubBox').append(magnetHub);
            },
          });
        });
        this.getBean('OtherSitePlugin')
          .loadOtherSite(tempCarNum, carNum2)
          .then();
        utils.setupEscClose(index);
      },
      end() {
        window.location.href.includes('collection_codes?movieId') &&
          utils.closePage();
      },
    });
  }
  loadData(movieId, carNum2) {
    let tempCarNum = carNum2.replace('FC2-', '');
    this.handleMovieDetail(movieId);
    this.handleLongImg(tempCarNum);
    this.handleMagnets(movieId);
    this.getBean('ReviewPlugin')
      .showReview(movieId, $('#reviews-content'))
      .then();
    this.getBean('RelatedPlugin')
      .showRelated($('#related-content'), movieId)
      .then();
  }
  handleMovieDetail(movieId) {
    javDbApi
      .getMovieDetail(movieId)
      .then((res) => {
        const actors = res.actors || [],
          imgList = res.imgList || [];
        let actorsHtml = '';
        if (actors.length > 0) {
          let actress = '';
          for (let i = 0; i < actors.length; i++) {
            let actor = actors[i];
            actorsHtml += `<span class="actor-tag"><a href="/actors/${actor.id}" target="_blank">${actor.name}</a></span>`;
            0 === actor.gender && (actress += actor.name + ' ');
          }
          $('#data-actress').text(actress);
        } else
          actorsHtml =
            '<span class="no-data">No actor information available</span>'; // Changed from '暂无演员信息'
        let imagesHtml = '';
        imagesHtml =
          Array.isArray(imgList) && imgList.length > 0
            ? imgList
                .map(
                  (img, index) =>
                    `\n                <a href="${img}" data-fancybox="movie-gallery" data-caption="Still photo ${
                      // Changed from '剧照'
                      index + 1
                    }">\n                    <img src="${img}" class="movie-image-thumb"  alt=""/>\n                </a>\n            `,
                )
                .join('')
            : '<div class="no-data">No still photos available</div>'; // Changed from '暂无剧照'
        $('.movie-info-container').html(
          `\n                <h3 class="movie-title"><strong class="current-title">${
            res.title || 'No Title' // Changed from '无标题'
          }</strong></h3>\n                <div class="movie-meta">\n                    <span><strong>Car No.: </strong>${
            // Changed from '番号:'
            res.carNum || 'Unknown' // Changed from '未知'
          }</span>\n                    <span><strong>Year: </strong>${
            // Changed from '年份:'
            res.releaseDate || 'Unknown' // Changed from '未知'
          }</span>\n                    <span><strong>Rating: </strong>${
            // Changed from '评分:'
            res.score || 'None' // Changed from '无'
          }</span>\n                    <span><strong>Duration: </strong>${
            // Changed from '时长:'
            res.duration + ' m' || 'None' // Changed from '无'
          }</span>\n                </div>\n                <div class="movie-meta">\n                    <span>\n                        <strong>Site: </strong>\n                        <a href="https://fc2ppvdb.com/articles/${res.carNum.replace(
            // Changed from '站点:'
            'FC2-',
            '',
          )}" target="_blank">fc2ppvdb</a>\n                        <a style="margin-left: 5px;" href="https://adult.contents.fc2.com/article/${res.carNum.replace(
            'FC2-',
            '',
          )}/" target="_blank">fc2 digital marketplace</a>\n                    </span>\n                </div>\n                <div class="movie-actors">\n                    <div class="actor-list"><strong>Starring: </strong>${actorsHtml}</div>\n                </div>\n                <div class="movie-gallery" style="margin-top:10px">\n                    <strong>Still photos: </strong>\n                    <div class="image-list">${imagesHtml}</div>\n                </div>\n                <div id="data-releaseDate" style="display: none">${
            res.releaseDate || ''
          }</div>\n            `,
        );
        this.getBean('TranslatePlugin').translate(res.carNum, !1).then();
      })
      .catch((err) => {
        console.error(err);
        $('.movie-info-container').html(
          `\n                <div class="movie-error">Loading failed: ${err.message}</div>\n            `, // Changed from '加载失败:'
        );
      });
  }
  handleLongImg(carNum2) {
    utils.loopDetector(
      () => $('.movie-gallery .image-list').length > 0,
      async () => {
        $('.movie-gallery .image-list').prepend(
          ' <a class="tile-item screen-container" style="overflow:hidden;max-height: 150px;max-width:150px; text-align:center;"><div style="margin-top: 50px;color: #000;cursor: auto">Loading thumbnail</div></a> ', // Changed from '正在加载缩略图'
        );
        const screenShotPlugin = this.getBean('ScreenShotPlugin'),
          imgUrl = await screenShotPlugin.getScreenshot(carNum2);
        imgUrl && (await screenShotPlugin.addImg('Thumbnail', imgUrl)); // Changed from '缩略图'
      },
    );
  }
  handleMagnets(movieId) {
    javDbApi
      .getMagnets(movieId)
      .then((magnetList) => {
        let magnetsHtml = '';
        if (magnetList.length > 0)
          for (let i = 0; i < magnetList.length; i++) {
            let magnet = magnetList[i],
              oddClass = '';
            i % 2 == 0 && (oddClass = 'odd');
            magnetsHtml += `\n                        <div class="item columns is-desktop ${oddClass}">\n                            <div class="magnet-name column is-four-fifths">\n                                <a href="magnet:?xt=urn:btih:${
              magnet.hash
            }" title="Right click and select &quot;Copy link address&quot;">\n                                    <span class="name">${
              // Changed from '右鍵點擊並選擇「複製鏈接地址」'
              magnet.name
            }</span>\n                                    <br>\n                                    <span class="meta">\n                                        ${(
              magnet.size / 1024
            ).toFixed(2)}GB, ${
              magnet.files_count
            } files \n                                     </span>\n                                    <br>\n                                    <div class="tags">\n                                        ${
              magnet.hd
                ? '<span class="tag is-primary is-small is-light">HD</span>' // Changed from '高清'
                : ''
            }\n                                        ${
              magnet.cnsub
                ? '<span class="tag is-warning is-small is-light">Subtitle</span>' // Changed from '字幕'
                : ''
            }\n                                    </div>\n                                </a>\n                            </div>\n                            <div class="buttons column">\n                                <button class="button is-info is-small copy-to-clipboard" data-clipboard-text="magnet:?xt=urn:btih:${
              magnet.hash
            }" type="button">&nbsp;Copy&nbsp;</button>\n                            </div>\n                            <div class="date column"><span class="time">${
              // Changed from '複製'
              magnet.created_at
            }</span></div>\n                        </div>\n                    `;
          }
        else
          magnetsHtml =
            '<span class="no-data">No magnet information available</span>'; // Changed from '暂无磁力信息'
        $('#magnets-content').html(magnetsHtml);
        $(".buttons button[data-clipboard-text*='magnet:']").each((i, el) => {
          $(el)
            .parent()
            .append(
              $('<button>')
                .text('115 Offline Download') // Changed from '115离线下载'
                .addClass('button is-info is-small')
                .click(async (event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  let loadObj = loading();
                  try {
                    await this.getBean('WangPan115TaskPlugin').handleAddTask(
                      $(el).attr('data-clipboard-text'),
                    );
                  } catch (e) {
                    show.error('An error occurred:' + e); // Changed from '发生错误:'
                    console.error(e);
                  } finally {
                    loadObj.close();
                  }
                }),
            );
        });
      })
      .catch((err) => {
        console.error(err);
        $('#magnets-content').html(
          `\n                <div class="movie-error">Loading failed: ${err.message}</div>\n            `, // Changed from '加载失败:'
        );
      });
  }
  async openFc2Page(movieId, carNum2, url) {
    const otherSitePlugin = this.getBean('OtherSitePlugin');
    let javDbUrl = await otherSitePlugin.getJavDbUrl();
    window.open(
      `${javDbUrl}/users/collection_codes?movieId=${movieId}&carNum=${carNum2}&url=${url}`,
    );
  }
}
class HighlightMagnetPlugin extends BasePlugin {
  getName() {
    return 'HighlightMagnetPlugin';
  }
  doFilterMagnet() {
    this.handleDb();
    this.handleBus();
  }
  handleDb() {
    if (!isJavDb) return;
    let magnetNameList = $('#magnets-content .name');
    if (0 === magnetNameList.length) return;
    const HIGH_QUALITY_KEYWORDS = ['4k', '-c', '-u', '-uc'];
    let hasHighQuality = !1;
    magnetNameList.each((_, el) => {
      const $el = $(el),
        text = $el.text().toLowerCase(),
        isHighQuality = HIGH_QUALITY_KEYWORDS.some((keyword) =>
          text.includes(keyword),
        );
      $el.parent().parent().parent().addClass('magnet-row');
      text.includes('4k') && $el.css('color', '#f40');
      if (isHighQuality) {
        hasHighQuality = !0;
        $el.parent().parent().parent().addClass('high-quality');
      }
    });
    hasHighQuality
      ? $('#magnets-content .magnet-row').not('.high-quality').hide()
      : $('#enable-magnets-filter').addClass('do-hide');
  }
  handleBus() {
    isJavBus &&
      isDetailPage &&
      utils.loopDetector(
        () => $('#magnet-table td a').length > 0,
        () => {
          const rows = $('#magnet-table tr'),
            QUALITY_KEYWORDS = ['4k', '-c', '-u', '-uc'];
          let hasHighQuality = !1;
          rows.each((_, row) => {
            const $row = $(row),
              $firstTd = $row.find('td:first-child'),
              $firstLink = $firstTd.find('a:first-child'),
              $secondLink = $firstTd.find('a:nth-child(2)'),
              linkText = $firstLink.text().toLowerCase();
            linkText.includes('4k') && $firstLink.css('color', '#f40');
            if (
              QUALITY_KEYWORDS.some((keyword) => linkText.includes(keyword)) ||
              ($secondLink.length && $secondLink.text().includes('Subtitle')) // Changed from '字幕'
            ) {
              hasHighQuality = !0;
              $row.addClass('high-quality');
            }
          });
          hasHighQuality
            ? rows.each((_, row) => {
                const $row = $(row);
                $row.hasClass('high-quality') || $row.hide();
              })
            : $('#enable-magnets-filter').addClass('do-hide');
        },
      );
  }
  showAll() {
    if (isJavDb) {
      $('#magnets-content .item')
        .toArray()
        .forEach((el) => $(el).show());
    }
    isJavBus &&
      $('#magnet-table tr')
        .toArray()
        .forEach((el) => $(el).show());
  }
}

class FoldCategoryPlugin extends BasePlugin {
  getName() {
    return 'FoldCategoryPlugin';
  }
  async initCss() {
    const settingObj = await storageManager.getSetting();
    return `\n            <style>\n                #tags a.tag, .tags a.tag {\n                    position:relative;\n                }\n                .highlight-btn {\n                    position: absolute;\n                    top: -10px;\n                    right: -10px;\n                    background-color: #4CAF50;\n                    color: white;\n                    border: none;\n                    border-radius: 50%;\n                    width: 24px;\n                    height: 24px;\n                    font-size: 14px;\n                    line-height: 24px;\n                    text-align: center;\n                    cursor: pointer;\n                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\n                    display: none;\n                    z-index: 999;\n                }\n                /* When parent element is highlighted, button changes color */\n                .highlighted .highlight-btn {\n                    background-color: #FF5722;\n                }\n                /* Tag style in highlighted state */\n                .highlighted {\n                    /* Light yellow */\n                    border: ${
      settingObj.highlightedTagNumber || 1
    }px solid ${
      settingObj.highlightedTagColor || '#ce2222'
    };\n                }\n            </style>\n        `;
  }
  async handle() {
    if (window.isListPage && !currentHref.includes('advanced_search')) {
      this.highlightTag();
      utils.loopDetector(
        () => $('#waitCheckBtn').length,
        () => {
          this.createFoldBtn();
        },
        1,
        1e4,
        !0,
      );
      $('#tags .tag-category .tag-expand').each((index, el) => {
        $(el).parent().hasClass('collapse') && el.click();
      });
    }
  }
  highlightTag() {
    (async () => {
      const tags = await storageManager.getHighlightedTags();
      tags &&
        tags.forEach((text) => {
          $(`#tags a.tag:contains(${text})`).addClass('highlighted');
          $(`.tags a.tag:contains(${text})`).addClass('highlighted');
        });
    })().then();
    $('#tags a.tag, .tags a.tag').hover(
      function () {
        const $tag = $(this),
          button = $(
            '<button class="highlight-btn" title="Highlight">★</button>', // Changed from '高亮显示'
          );
        $tag.append(button);
        button.fadeIn(0);
      },
      function () {
        $(this)
          .find('.highlight-btn')
          .fadeOut(0, function () {
            $(this).remove();
          });
      },
    );
    $(document).on('click', '.highlight-btn', async function (e) {
      e.stopPropagation();
      e.preventDefault();
      const $tag = $(this).closest('a.tag'),
        clonedTag = $tag.clone();
      clonedTag.find('.highlight-btn').remove();
      const tagText = clonedTag
        .text()
        .trim()
        .replace(/\s*\(\d+\)$/, '');
      let highlightedTags = await storageManager.getHighlightedTags();
      if (highlightedTags.includes(tagText)) {
        highlightedTags = highlightedTags.filter((item) => item !== tagText);
        $tag.removeClass('highlighted');
      } else {
        highlightedTags.push(tagText);
        $tag.addClass('highlighted');
      }
      await storageManager.setHighlightedTags(highlightedTags);
    });
  }
  async createFoldBtn() {
    const foldCategoryHotKey = await storageManager.getSetting(
      'foldCategoryHotKey',
    );
    let $subTags = $('#tags'),
      checkTagStr = $('#tags dl div.tag.is-info')
        .map(function () {
          return $(this).text().replaceAll('\n', '').replaceAll(' ', '');
        })
        .get()
        .join(' ');
    if (!checkTagStr) return;
    $('.tabs').append(
      `\n            <div style="display: flex;align-items: center;flex-grow:1;justify-content: flex-end;">\n                <div>Selected categories: <span id="jhs-check-tag">${checkTagStr}</span></div>\n                <a class="menu-btn  main-tab-btn" id="foldCategoryBtn" style="background-color:#d23e60 !important;">\n                    <span></span>\n                    ${
        foldCategoryHotKey ? ` (${foldCategoryHotKey})` : ''
      }\n                    <i style="margin-left: 10px"></i>\n                </a>\n\n            </div>\n        `,
    );
    let $section = $('h2.section-title');
    if ($section.length > 0) {
      $section.append(
        '\n                <div id="foldCategoryBtn">\n                    <a class="menu-btn" style="background-color:#d23e60 !important;margin-left: 20px;border-bottom:none !important;border-radius:3px;">\n                        <span></span>\n                        <i style="margin-left: 10px"></i>\n                    </a>\n                </div>\n            ',
      );
      $subTags = $('section > div > div.box');
    }
    if (!$subTags) return;
    let $foldCategoryBtn = $('#foldCategoryBtn'),
      isFolded = localStorage.getItem('jhs_foldCategory') === YES,
      [newText, newIcon] = isFolded
        ? ['Expand', 'icon-angle-double-down'] // Changed from '展开'
        : ['Fold', 'icon-angle-double-up']; // Changed from '折叠'
    $foldCategoryBtn
      .find('span')
      .text(newText)
      .end()
      .find('i')
      .attr('class', newIcon);
    window.location.href.includes('noFold=1') ||
      $subTags[isFolded ? 'hide' : 'show']();
    $foldCategoryBtn.on('click', async (event) => {
      event.preventDefault();
      isFolded = !isFolded;
      localStorage.setItem('jhs_foldCategory', isFolded ? YES : NO);
      const [newText2, newIcon2] = isFolded
        ? ['Expand', 'icon-angle-double-down'] // Changed from '展开'
        : ['Fold', 'icon-angle-double-up']; // Changed from '折叠'
      $foldCategoryBtn
        .find('span')
        .text(newText2)
        .end()
        .find('i')
        .attr('class', newIcon2);
      $subTags[isFolded ? 'hide' : 'show']();
    });
  }
}

class ActressInfoPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'apiUrl', 'https://ja.wikipedia.org/wiki/');
  }
  getName() {
    return 'ActressInfoPlugin';
  }
  async handle() {
    'yes' ===
      (await storageManager.getSetting('enableLoadActressInfo', 'yes')) &&
      this.loadActressInfo();
  }
  loadActressInfo() {
    this.handleDetailPage().then();
    this.handleStarPage().then();
  }
  async initCss() {
    return '\n            <style>\n                .info-tag {\n                    background-color: #ecf5ff;\n                    display: inline-block;\n                    height: 32px;\n                    padding: 0 10px;\n                    line-height: 30px;\n                    font-size: 12px;\n                    color: #409eff;\n                    border: 1px solid #d9ecff;\n                    border-radius: 4px;\n                    box-sizing: border-box;\n                    white-space: nowrap;\n                }\n            </style>\n        ';
  }
  async handleDetailPage() {
    if ($('.actress-info').length > 0) return;
    let nameList = $('.female')
      .prev()
      .map((i, el) => $(el).text().trim())
      .get();
    if (!nameList.length) return;
    const cacheKey = 'jhs_actress_info',
      cacheData = localStorage.getItem(cacheKey)
        ? JSON.parse(localStorage.getItem(cacheKey))
        : {};
    let result = null,
      infoHtml = '';
    for (let i = 0; i < nameList.length; i++) {
      let name2 = nameList[i];
      result = cacheData[name2];
      if (!result)
        try {
          result = await this.searchInfo(name2);
          result && (cacheData[name2] = result);
        } catch (e) {
          console.error('This name query failed, trying other names'); // Changed from '该名称查询失败,尝试其它名称'
        }
      let contentHtml = '';
      contentHtml = result
        ? `\n                    <div class="panel-block actress-info">\n                        <strong>${name2}:</strong>\n                        <a href="${result.url}" style="margin-left: 5px" target="_blank">\n                            <span class="info-tag">${result.birthday} ${result.age}</span>\n                            <span class="info-tag">${result.height} ${result.weight}</span>\n                            <span class="info-tag">${result.threeSizeText} ${result.braSize}</span>\n                        </a>\n                    </div>\n                `
        : `<div class="panel-block actress-info"><a href="${
            this.apiUrl + name2
          }" target="_blank"><strong>${name2}:</strong></a></div> `;
      infoHtml += contentHtml;
    }
    $('strong:contains("Actors")').parent().after(infoHtml); // Changed from '演員'
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  }
  async handleStarPage() {
    if ($('.actress-info').length > 0) return;
    let nameList = [],
      $actor = $('.actor-section-name');
    $actor.length &&
      $actor
        .text()
        .trim()
        .split(',')
        .forEach((name2) => {
          nameList.push(name2.trim());
        });
    let $sectionMeta = $(".section-meta:not(:contains('Movies'))"); // Changed from '影片'
    $sectionMeta.length &&
      $sectionMeta
        .text()
        .trim()
        .split(',')
        .forEach((name2) => {
          nameList.push(name2.trim());
        });
    if (!nameList.length) return;
    const cacheKey = 'jhs_actress_info',
      cacheData = localStorage.getItem(cacheKey)
        ? JSON.parse(localStorage.getItem(cacheKey))
        : {};
    let result = null;
    for (let i = 0; i < nameList.length; i++) {
      let name2 = nameList[i];
      result = cacheData[name2];
      if (result) break;
      try {
        result = await this.searchInfo(name2);
      } catch (e) {
        console.error('This name query failed, trying other names'); // Changed from '该名称查询失败,尝试其它名称'
      }
      if (result) break;
    }
    result &&
      nameList.forEach((name2) => {
        cacheData[name2] = result;
      });
    let contentHtml =
      '<div class="actress-info" style="font-size: 17px; font-weight: normal; margin-top: 5px;">No related actress information</div>'; // Changed from '无此相关演员信息'
    result &&
      (contentHtml = `\n                <a class="actress-info" href="${result.url}" target="_blank">\n                    <div style="font-size: 17px; font-weight: normal; margin-top: 5px;">\n                        <div style="display: flex; margin-bottom: 10px;">\n                            <span style="width: 300px;">Date of Birth: ${result.birthday}</span>\n                            <span style="width: 200px;">Age: ${result.age}</span>\n                            <span style="width: 200px;">Height: ${result.height}</span>\n                        </div>\n                        <div style="display: flex; margin-bottom: 10px;">\n                            <span style="width: 300px;">Weight: ${result.weight}</span>\n                            <span style="width: 200px;">Bust-Waist-Hips: ${result.threeSizeText}</span>\n                            <span style="width: 200px;">Bra Size: ${result.braSize}</span>\n                        </div>\n                    </div>\n                </a>\n            `);
    $actor.parent().append(contentHtml);
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  }
  async searchInfo(name2) {
    '三上悠亞' === name2 && (name2 = '三上悠亜'); // Keeping this specific name transformation
    let url = this.apiUrl + name2;
    const html = await gmHttp.get(url),
      parser = new DOMParser(),
      $dom = $(parser.parseFromString(html, 'text/html'));
    let birthday = $dom
        .find('a[title="誕生日"]') // Birthday
        .parent()
        .parent()
        .find('td')
        .text()
        .trim(),
      age = $dom.find("th:contains('現年齢')").parent().find('td').text().trim() // Current Age
        ? parseInt(
            $dom
              .find("th:contains('現年齢')")
              .parent()
              .find('td')
              .text()
              .trim(),
          ) + ' years old' // Changed from '岁'
        : '',
      height =
        $dom.find('tr:has(a[title="身長"]) td').text().trim().split(' ')[0] + // Height
        'cm',
      weight = $dom
        .find('tr:has(a[title="体重"]) td') // Weight
        .text()
        .trim()
        .split('/')[1]
        .trim();
    '― kg' === weight && (weight = '');
    return {
      birthday: birthday,
      age: age,
      height: height,
      weight: weight,
      threeSizeText: $dom
        .find('a[title="スリーサイズ"]') // Three sizes (Bust-Waist-Hips)
        .closest('tr')
        .find('td')
        .text()
        .replace('cm', '')
        .trim(),
      braSize: $dom
        .find('th:contains("ブラサイズ")') // Bra size
        .next('td')
        .contents()
        .first()
        .text()
        .trim(),
      url: url,
    };
  }
}

class AliyunPanPlugin extends BasePlugin {
  getName() {
    return 'AliyunPanPlugin';
  }
  handle() {
    $('body').append(
      '<a class="a-success" id="refresh-token-btn" style="position:fixed; right: 0; top:50%;z-index:99999">Get refresh_token</a>', // Changed from '获取refresh_token'
    );
    $('#refresh-token-btn').on('click', (event) => {
      let tokenStr = localStorage.getItem('token');
      if (!tokenStr) {
        alert('Please log in first!'); // Changed from '请先登录!'
        return;
      }
      let refresh_token = JSON.parse(tokenStr).refresh_token;
      navigator.clipboard
        .writeText(refresh_token)
        .then(() => {
          alert(
            'Copied to clipboard. If it fails, please copy manually: ' +
              refresh_token,
          ); // Changed from '已复制到剪切板 如失败, 请手动复制:'
        })
        .catch((err) => {
          console.error('Failed to copy refresh token: ', err);
        });
    });
  }
}

class HitShowPlugin extends BasePlugin {
  constructor() {
    super();
    __publicField(this, '$contentBox', $('.section .container'));
  }
  getName() {
    return 'HitShowPlugin';
  }
  handle() {
    $('a[href*="rankings/playback"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.location.href = '/advanced_search?handlePlayback=1&period=daily';
    });
    this.handlePlayback().then();
  }
  hookPage() {
    let $h2 = $('h2.section-title');
    $h2.contents().first().replaceWith('Hot'); // Changed from '热播'
    $h2.css('marginBottom', '0');
    $('.empty-message').remove();
    $('.section .container .box').remove();
    $('#sort-toggle-btn').remove();
    this.$contentBox.append(
      '<div class="tool-box" style="margin-top: 10px"></div>',
    );
    this.$contentBox.append(
      '<div class="movie-list h cols-4 vcols-8" style="margin-top: 10px"></div>',
    );
  }
  async handlePlayback() {
    if (!window.location.href.includes('handlePlayback=1')) return;
    let period = new URLSearchParams(window.location.search).get('period');
    this.toolBar(period);
    this.hookPage();
    let $movieBox = $('.movie-list');
    $movieBox.html('');
    let loadObj = loading();
    try {
      const movies = await javDbApi.playback(period);
      let moviesHtml = javDbApi.markDataListHtml(movies);
      $movieBox.html(moviesHtml);
    } catch (e) {
      clog.error('An error occurred:', e); // Changed from '发生错误:'
    } finally {
      loadObj.close();
    }
  }
  toolBar(period) {
    let conditionHtml = `\n            <div class="button-group" style="margin-top:18px">\n                <div class="buttons has-addons" id="conditionBox">\n                    <a style="padding:18px 18px !important;" class="button is-small ${
      'daily' === period ? 'is-info' : ''
    }" href="/advanced_search?handlePlayback=1&period=daily">Daily Chart</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${
      'weekly' === period ? 'is-info' : ''
    }" href="/advanced_search?handlePlayback=1&period=weekly">Weekly Chart</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${
      'monthly' === period ? 'is-info' : ''
    }" href="/advanced_search?handlePlayback=1&period=monthly">Monthly Chart</a>\n                </div>\n            </div>\n        `; // Changed from '日榜', '周榜', '月榜'
    this.$contentBox.append(conditionHtml);
  }
  getStarRating(score) {
    let stars = '';
    const fullStars = Math.floor(score);
    for (let i = 0; i < fullStars; i++) stars += '<i class="icon-star"></i>';
    for (let i = 0; i < 5 - fullStars; i++)
      stars += '<i class="icon-star gray"></i>';
    return stars;
  }
  loadScore(movies) {
    if (0 === movies.length) return;
    (async () => {
      for (const movie of movies)
        try {
          const movieId = movie.id;
          if (!$(`#score_${movieId}`).length) return;
          if ($(`#${movieId}`).is(':hidden')) continue;
          const cacheData = localStorage.getItem('jhs_score_info')
              ? JSON.parse(localStorage.getItem('jhs_score_info'))
              : {},
            cached = cacheData[movieId];
          if (cached) {
            this.appendScoreHtml(movieId, cached);
            continue;
          }
          for (; !document.hasFocus(); )
            await new Promise((r) => setTimeout(r, 500));
          const res = await javDbApi.getMovieDetail(movieId);
          let score = res.score,
            watchedCount = res.watchedCount,
            html = `\n                        <span class="value">\n                            <span class="score-stars">${this.getStarRating(
              score,
            )}</span> \n                            &nbsp; ${score} points, rated by ${watchedCount} people\n                        </span>\n                    `; // Changed from '分，由' and '人評價'
          this.appendScoreHtml(movieId, html);
          cacheData[movieId] = html;
          localStorage.setItem('jhs_score_info', JSON.stringify(cacheData));
          await new Promise((r) => setTimeout(r, 500));
        } catch (err) {
          clog.error(
            `🚨 Failed to parse score data | ID: ${movie.number}\n`, // Changed from '解析评分数据失败 | 编号:'
            `Error details: ${err.message}\n`, // Changed from '错误详情:'
            err.stack ? `Call stack:\n${err.stack}` : '', // Changed from '调用栈:'
          );
        }
    })();
  }
  appendScoreHtml(movieId, scoreHtml) {
    let $scoreBox = $(`#score_${movieId}`);
    $scoreBox.length &&
      '' === $scoreBox.html().trim() &&
      $scoreBox.slideUp(0, function () {
        $(this).html(scoreHtml).slideDown(500);
      });
  }
}

class TOP250Plugin extends BasePlugin {
  constructor() {
    super();
    __publicField(this, 'has_cnsub', '');
    __publicField(this, '$contentBox', $('.section .container'));
    __publicField(this, 'movies', []);
  }
  getName() {
    return 'TOP250Plugin';
  }
  handle() {
    $('.main-tabs ul li:contains("You May Like")').html(
      // Changed from '猜你喜歡'
      '<a href="/rankings/top"><span>Top250</span></a>',
    );
    $('a[href*="rankings/top"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const $target = $(event.target),
        href = ($target.is('a') ? $target : $target.closest('a')).attr('href');
      let queryString = href.includes('?') ? href.split('?')[1] : href;
      const urlParams = new URLSearchParams(queryString);
      this.checkLogin(event, urlParams);
    });
    this.handleTop().then();
  }
  hookPage() {
    $('h2.section-title').contents().first().replaceWith('Top250');
    $('.empty-message').remove();
    $('.section .container .box').remove();
    $('#sort-toggle-btn').remove();
    this.$contentBox.append(
      '<div class="tool-box" style="margin-top: 10px"></div>',
    );
    this.$contentBox.append(
      '<div class="movie-list h cols-4 vcols-8" style="margin-top: 10px"></div>',
    );
    this.renderPagination();
  }
  renderPagination() {
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get('page')) || 1;
    this.$contentBox.append(
      ((page) => {
        const isNextDisabled = page >= 5;
        let paginationListHTML = '';
        for (let i = 1; i <= 5; i++) {
          paginationListHTML += `<li><a class="pagination-link ${
            page === i ? 'is-current' : ''
          }" data-page="${i}">${i}</a></li>`;
        }
        return `\n                <nav class="pagination">\n                    <a class="pagination-previous ${
          page <= 1 ? 'do-hide' : ''
        }" data-page="${
          page - 1
        }">Previous Page</a>\n                    <a class="pagination-next ${
          isNextDisabled ? 'do-hide' : ''
        }" data-page="${
          page + 1
        }">Next Page</a>\n                    \n                    <ul class="pagination-list">\n                        ${paginationListHTML}\n                    </ul>\n                </nav>\n            `; // Changed from '上一頁' and '下一頁'
      })(currentPage),
    );
    this.$contentBox.on(
      'click',
      '.pagination-link, .pagination-previous, .pagination-next',
      (event) => {
        event.preventDefault();
        const newPage = parseInt($(event.currentTarget).data('page'));
        !isNaN(newPage) &&
          newPage > 0 &&
          ((newPage) => {
            urlParams.set('page', newPage);
            window.history.pushState({}, '', '?' + urlParams.toString());
            window.location.reload();
          })(newPage);
      },
    );
  }
  async handleTop() {
    if (!window.location.href.includes('handleTop=1')) return;
    const urlParams = new URLSearchParams(window.location.search);
    let type = urlParams.get('handleType') || 'all',
      type_value = urlParams.get('type_value') || '';
    this.has_cnsub = urlParams.get('has_cnsub') || '';
    let page = urlParams.get('page') || 1;
    this.toolBar(type, type_value, page);
    this.hookPage();
    let $movieBox = $('.movie-list');
    $movieBox.html('');
    let loadObj = loading();
    try {
      const res = await javDbApi.top250(type, type_value, page, 50);
      let successFlag = res.success,
        message = res.message,
        action = res.action;
      if (1 === successFlag) {
        let dataList = res.data.movies;
        if (0 === dataList.length) {
          show.error('No data'); // Changed from '无数据'
          loadObj.close();
          return;
        }
        this.movies = dataList;
        const filter_movies = dataList.filter((item) =>
          '1' === this.has_cnsub
            ? item.has_cnsub
            : '0' !== this.has_cnsub || !item.has_cnsub,
        );
        let moviesHtml = javDbApi.markDataListHtml(filter_movies);
        $movieBox.html(moviesHtml);
      } else {
        clog.error(res);
        $movieBox.html(`<h3>${message}</h3>`);
        show.error(message);
        if ('JWTVerificationError' === action) {
          await localStorage.removeItem('jhs_appAuthorization');
          await this.checkLogin(
            null,
            new URLSearchParams(window.location.search),
          );
        }
      }
    } catch (e) {
      clog.error('An error occurred:', e); // Changed from '发生错误:'
    } finally {
      loadObj.close();
    }
  }
  toolBar(type, type_value, currentPage) {
    '5' === currentPage.toString() && $('.pagination-next').remove();
    $('.pagination-ellipsis').closest('li').remove();
    $('.pagination-list li a').each(function () {
      parseInt($(this).text()) > 5 && $(this).closest('li').remove();
    });
    let yearHtml = '';
    for (let year = new Date().getFullYear(); year >= 2008; year--)
      yearHtml += `\n                <a style="padding:18px 18px !important;" \n                   class="button is-small ${
        type_value === year.toString() ? 'is-info' : ''
      }" \n                   href="/advanced_search?handleTop=1&handleType=year&type_value=${year}&has_cnsub=${
        this.has_cnsub
      }">\n                  ${year}\n                </a>\n            `;
    let conditionHtml = `\n            <div class="button-group">\n                <div class="buttons has-addons" id="conditionBox" style="margin-bottom: 0!important;">\n                    <a style="padding:18px 18px !important;" class="button is-small ${
      'all' === type ? 'is-info' : ''
    }" href="/advanced_search?handleTop=1&handleType=all&type_value=&has_cnsub=${
      this.has_cnsub
    }">All</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${
      '0' === type_value ? 'is-info' : ''
    }" href="/advanced_search?handleTop=1&handleType=video_type&type_value=0&has_cnsub=${
      this.has_cnsub
    }">Censored</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${
      '1' === type_value ? 'is-info' : ''
    }" href="/advanced_search?handleTop=1&handleType=video_type&type_value=1&has_cnsub=${
      this.has_cnsub
    }">Uncensored</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${
      '2' === type_value ? 'is-info' : ''
    }" href="/advanced_search?handleTop=1&handleType=video_type&type_value=2&has_cnsub=${
      this.has_cnsub
    }">Western</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${
      '3' === type_value ? 'is-info' : ''
    }" href="/advanced_search?handleTop=1&handleType=video_type&type_value=3&has_cnsub=${
      this.has_cnsub
    }">Fc2</a>\n                    \n                    <a style="padding:18px 18px !important;margin-left: 50px" class="button is-small ${
      '1' === this.has_cnsub ? 'is-info' : ''
    }" data-cnsub-value="1">With Chinese Subtitles</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${
      '0' === this.has_cnsub ? 'is-info' : ''
    }" data-cnsub-value="0">No Subtitles</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-cnsub-value="">Reset</a>\n                </div>\n                \n                <div class="buttons has-addons" id="conditionBox">\n                    ${yearHtml}\n                </div>\n            </div>\n        `; // Changed from '全部', '有码', '无码', '欧美', '含中字磁鏈', '无字幕', '重置'
    this.$contentBox.append(conditionHtml);
    $('a[data-cnsub-value]').on('click', (event) => {
      const cnsubValue = $(event.currentTarget).data('cnsub-value');
      this.has_cnsub = cnsubValue.toString();
      $('a[data-cnsub-value]').removeClass('is-info');
      $(event.currentTarget).addClass('is-info');
      $('.toolbar a.button')
        .not('[data-cnsub-value]')
        .each((index, element) => {
          const $link = $(element),
            url = new URL($link.attr('href'), window.location.origin);
          url.searchParams.set('has_cnsub', cnsubValue);
          $link.attr('href', url.toString());
        });
      const filter_movies = this.movies.filter((item) =>
        '1' === this.has_cnsub
          ? item.has_cnsub
          : '0' !== this.has_cnsub || !item.has_cnsub,
      );
      let moviesHtml = javDbApi.markDataListHtml(filter_movies);
      $('.movie-list').html(moviesHtml);
    });
  }
  async checkLogin(event, urlParams) {
    if (!localStorage.getItem('jhs_appAuthorization')) {
      show.error('This category depends on mobile API, please log in first'); // Changed from '该类别依赖移动端接口，请先完成登录'
      this.openLoginDialog();
      return;
    }
    let type = 'all',
      type_value = '',
      t = urlParams.get('t') || '';
    if (/^y\d+$/.test(t)) {
      type = 'year';
      type_value = t.substring(1);
    } else if ('' !== t) {
      type = 'video_type';
      type_value = t;
    }
    let url = `/advanced_search?handleTop=1&handleType=${type}&type_value=${type_value}`;
    event && (event.ctrlKey || event.metaKey)
      ? GM_openInTab(window.location.origin + url, {
          insert: 0,
        })
      : (window.location.href = url);
  }
  openLoginDialog() {
    layer.open({
      type: 1,
      title: 'JavDB',
      closeBtn: 1,
      area: ['360px', 'auto'],
      shadeClose: !1,
      content:
        '\n                <div style="padding: 30px; font-family: \'Helvetica Neue\', Arial, sans-serif;">\n                    <div style="margin-bottom: 25px;">\n                        <input type="text" id="username" name="username" \n                            style="width: 100%; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 4px; \n                                   box-sizing: border-box; transition: all 0.3s; font-size: 14px;\n                                   background: #f9f9f9; color: #333;"\n                            placeholder="Username | Email"\n                            onfocus="this.style.borderColor=\'#4a8bfc\'; this.style.background=\'#fff\'"\n                            onblur="this.style.borderColor=\'#e0e0e0\'; this.style.background=\'#f9f9f9\'">\n                    </div>\n                    \n                    <div style="margin-bottom: 15px;">\n                        <input type="password" id="password" name="password" \n                            style="width: 100%; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 4px; \n                                   box-sizing: border-box; transition: all 0.3s; font-size: 14px;\n                                   background: #f9f9f9; color: #333;"\n                            placeholder="Password"\n                            onfocus="this.style.borderColor=\'#4a8bfc\'; this.style.background=\'#fff\'"\n                            onblur="this.style.borderColor=\'#e0e0e0\'; this.style.background=\'#f9f9f9\'">\n                    </div>\n                    \n                    <button id="loginBtn" \n                            style="width: 100%; padding: 12px; background: #4a8bfc; color: white; \n                                   border: none; border-radius: 4px; font-size: 15px; cursor: pointer;\n                                   transition: background 0.3s;"\n                            onmouseover="this.style.background=\'#3a7be0\'"\n                            onmouseout="this.style.background=\'#4a8bfc\'">\n                        Login\n                    </button>\n                </div>\n            ', // Changed from '用户名 | 邮箱', '密码', '登录'
      success: (layero, index) => {
        $('#loginBtn').click(function () {
          const username = $('#username').val(),
            password = $('#password').val();
          if (!username || !password) {
            show.error('Please enter username and password'); // Changed from '请输入用户名和密码'
            return;
          }
          let loadObj = loading();
          javDbApi
            .login(username, password)
            .then(async (res) => {
              let success = res.success;
              if (0 === success) show.error(res.message);
              else {
                if (1 !== success) {
                  clog.error('Login failed', res); // Changed from '登录失败'
                  throw new Error(res.message);
                }
                {
                  let token = res.data.token;
                  await localStorage.setItem('jhs_appAuthorization', token);
                  show.ok('Login successful'); // Changed from '登录成功'
                  layer.close(index);
                  window.location.href =
                    '/advanced_search?handleTop=1&period=daily';
                }
              }
            })
            .catch((err) => {
              clog.error('Login exception:', err); // Changed from '登录异常:'
              show.error(err.message);
            })
            .finally(() => {
              loadObj.close();
            });
        });
      },
    });
  }
}

class NavBarPlugin extends BasePlugin {
  getName() {
    return 'NavBarPlugin';
  }
  async initCss() {
    return '\n            .highlight-red {\n    /* Core requirement: highlight text in red */\n    color: red !important; \n    \n    /* Suggestion: add bold font, for more obvious effect */\n    font-weight: bold;\n    \n    /* Suggestion: add background color, for more prominent effect */\n    /* background-color: yellow; */ \n}\n        ';
  }
  handle() {
    this.margeNav();
    this.hookSearch();
    this.hookOldSearch();
    this.toggleOtherNavItem();
    $(window).resize(this.toggleOtherNavItem);
    if (window.location.href.includes('/search')) {
      const urlParams = new URLSearchParams(window.location.search);
      let q = urlParams.get('q'),
        f = urlParams.get('f');
      $('#search-keyword').val(q);
      f && $('#jhs-search-type').val(f);
      q && this.highlightKeyword(q);
    }
  }
  highlightKeyword(keyword) {
    const trimedKeyword = keyword.trim();
    if (!trimedKeyword) return;
    const lowerCaseKeyword = trimedKeyword.toLowerCase();
    $('.video-title strong, .actor-box strong').each(function () {
      $strongElement.text().toLowerCase().includes(lowerCaseKeyword) &&
        $strongElement.addClass('highlight-red');
    });
  }
  hookSearch() {
    $('#navbar-menu-hero').after(
      '\n            <div class="navbar-menu" id="search-box">\n                <div class="navbar-start" style="display: flex; align-items: center; gap: 5px;">\n                    <select id="jhs-search-type" style="padding: 8px 12px; border: 1px solid #555; border-radius: 4px; background-color: #333; color: #eee; font-size: 14px; outline: none;">\n                        <option value="all">Movies</option>\n                        <option value="actor">Actors</option>\n                        <option value="series">Series</option>\n                        <option value="maker">Producers</option>\n                        <option value="director">Directors</option>\n                        <option value="code">ID</option>\n                        <option value="list">Lists</option>\n                    </select>\n                    <input id="search-keyword" type="text" placeholder="Enter movie ID, actor name, or other keywords to search" style="padding: 8px 12px; border: 1px solid #555; border-radius: 4px; flex-grow: 1; font-size: 14px; background-color: #333; color: #eee; outline: none;">\n                    <a href="/advanced_search?noFold=1" title="Advanced Search" style="padding: 6px 12px; background-color: #444; border-radius: 4px; text-decoration: none; color: #ddd; font-size: 14px; border: 1px solid #555;"><span>...</span></a>\n                    <a id="search-img-btn" style="padding: 6px 16px; background-color: #444; color: #fff; border-radius: 4px; text-decoration: none; font-weight: 500; cursor: pointer; border: 1px solid #555;">Image Search</a>\n                    <a id="search-btn" style="padding: 6px 16px; background-color: #444; color: #fff; border-radius: 4px; text-decoration: none; font-weight: 500; cursor: pointer; border: 1px solid #555;">Search</a>\n                </div>\n            </div>\n        ', // Changed from '影片', '演員', '系列', '片商', '導演', '番號', '清單', '輸入影片番號，演員名等關鍵字進行檢索', '進階檢索', '识图', '檢索'
    );
    $('#search-keyword')
      .on('paste', (event) => {
        const items = event.originalEvent.clipboardData.items;
        for (let i = 0; i < items.length; i++)
          if (-1 !== items[i].type.indexOf('image')) {
            const blob = items[i].getAsFile();
            $('#search-keyword').blur();
            const imageRecognitionPlugin = this.getBean(
              'ImageRecognitionPlugin',
            );
            imageRecognitionPlugin.open(() => {
              imageRecognitionPlugin.handleImageFile(blob);
              imageRecognitionPlugin.resetSearchUI();
            });
            return;
          }
        setTimeout(() => {
          $('#search-btn').click();
        }, 0);
      })
      .on('keypress', (event) => {
        'Enter' === event.key &&
          setTimeout(() => {
            $('#search-btn').click();
          }, 0);
      });
    $('#search-btn').on('click', (event) => {
      let keyword = $('#search-keyword').val(),
        searchCurrentType = $('#jhs-search-type option:selected').val();
      '' !== keyword &&
        (window.location.href.includes('/search')
          ? (window.location.href =
              '/search?q=' + keyword + '&f=' + searchCurrentType)
          : window.open('/search?q=' + keyword + '&f=' + searchCurrentType));
    });
    $('#search-img-btn').on('click', () => {
      this.getBean('ImageRecognitionPlugin').open();
    });
  }
  hookOldSearch() {
    const searchImage = document.querySelector('.search-image');
    if (!searchImage) return;
    const clonedImage = searchImage.cloneNode(!0);
    searchImage.parentNode.replaceChild(clonedImage, searchImage);
    $('#button-search-image').attr('data-tooltip', 'Image Search'); // Changed from '以图识图'
    $('.search-image').on('click', (event) => {
      this.getBean('ImageRecognitionPlugin').open();
    });
  }
  margeNav() {
    $('a[href*="/feedbacks/new"]').remove();
    $('a[href*="theporndude.com"]').remove();
    $('a.navbar-link[href="/makers"]').parent().after(
      '\n            <div class="navbar-item has-dropdown is-hoverable">\n                <a class="navbar-link">Other</a>\n                <div class="navbar-dropdown is-boxed">\n                  <a class="navbar-item" href="/feedbacks/new" target="_blank" >Feedback</a>\n                  <a class="navbar-item" rel="nofollow noopener" target="_blank" href="https://theporndude.com/zh">ThePornDude</a>\n                </div>\n              </div>\n        ', // Changed from '其它', '反饋'
    );
  }
  toggleOtherNavItem() {
    let $searchBox = $('#search-box'),
      $oldSearchBox = $('#search-bar-container');
    if ($(window).width() < 1600 && $(window).width() > 1023) {
      $searchBox.hide();
      $oldSearchBox.show();
    }
    if ($(window).width() > 1600) {
      $searchBox.show();
      $oldSearchBox.hide();
    }
  }
}

class AsyncQueue {
  constructor() {
    this.queue = Promise.resolve();
  }
  addTask(fun) {
    this.queue = this.queue
      .then(() => fun())
      .catch((e) => {
        clog.error('Failed to execute async queue task:', e); // Changed from '执行异步队列任务失败:'
      });
  }
  async waitAllFinished() {
    return this.queue;
  }
}

class OtherSitePlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'okBackgroundColor', '#7bc73b');
    __publicField(this, 'errorBackgroundColor', '#de3333');
    __publicField(this, 'warnBackgroundColor', '#d7a80c');
    __publicField(this, 'domainErrorBackgroundColor', '#d7780c');
    __publicField(this, 'asyncQueue', new AsyncQueue());
    __publicField(this, 'siteConfigs', [
      {
        id: 'javTrailersBtn',
        getBaseUrl: async () => await this.getJavTrailersUrl(),
        itemSelector: '.videos-list .video-link',
        searchPath: (baseUrl, carNum2) => `${baseUrl}/search/${carNum2}`,
        getDetailPageHref: ($box2) => $box2.attr('href'),
        findCarNumOrTitle: ($box2) => $box2.find('p.card-text').text(),
      },
      {
        id: '123AvBtn',
        getBaseUrl: async () => (await this.getAv123Url()) + '/ja',
        itemSelector: '.box-item',
        searchPath: (baseUrl, carNum2) =>
          `${baseUrl}/search?keyword=${carNum2}`,
        getDetailPageHref: ($box2) => $box2.find('.detail a').attr('href'),
        findCarNumOrTitle: ($box2) => $box2.find('img').attr('title'),
      },
      {
        id: 'jableBtn',
        getBaseUrl: async () => await this.getjableUrl(),
        itemSelector: '#list_videos_videos_list_search_result .detail .title a',
        searchPath: (baseUrl, carNum2) => `${baseUrl}/search/${carNum2}/`,
        getDetailPageHref: ($box2) => $box2.attr('href'),
        findCarNumOrTitle: ($box2) => $box2.text(),
      },
      {
        id: 'avgleBtn',
        getBaseUrl: async () => await this.getAvgleUrl(),
        itemSelector: '.text-secondary',
        searchPath: (baseUrl, carNum2) =>
          `${baseUrl}/vod/search.html?wd=${carNum2}`,
        getDetailPageHref: ($box2) => $box2.attr('href'),
        findCarNumOrTitle: ($box2) => $box2.text(),
      },
      {
        id: 'missAvBtn',
        getBaseUrl: async () => await this.getMissAvUrl(),
        itemSelector: '.text-secondary',
        searchPath: (baseUrl, carNum2) => `${baseUrl}/search/${carNum2}`,
        getDetailPageHref: ($box2) => $box2.attr('href'),
        findCarNumOrTitle: ($box2) => $box2.text(),
      },
      {
        id: 'supJavBtn',
        getBaseUrl: async () => await this.getSupJavUrl(),
        itemSelector: '.posts post',
        searchPath: (baseUrl, carNum2) => `${baseUrl}/?s=${carNum2}`,
        getDetailPageHref: ($box2, baseUrl, carNum2) => $box2.attr('href'),
        findCarNumOrTitle: ($box2) => $box2.attr('title'),
      },
      {
        id: 'javDbBtn',
        getBaseUrl: async () => await this.getJavDbUrl(),
        itemSelector: '.movie-list .item',
        searchPath: (baseUrl, carNum2) => `${baseUrl}/search?q=${carNum2}`,
        getDetailPageHref: ($box2) => $box2.find('a').attr('href'),
        findCarNumOrTitle: ($box2) => $box2.find('.video-title').text(),
        condition: (sourceCarNum) => isJavBus,
      },
      {
        id: 'javBusBtn',
        getBaseUrl: async () => await this.getJavBusUrl(),
        itemSelector: '.container h3',
        searchPath: (baseUrl, carNum2) => `${baseUrl}/${carNum2}`,
        getDetailPageHref: ($box2, baseUrl, carNum2) => `${baseUrl}/${carNum2}`,
        findCarNumOrTitle: ($box2) => $box2.text(),
        condition: (sourceCarNum) =>
          isJavDb && sourceCarNum && !sourceCarNum.includes('FC2'),
      },
      {
        id: 'fanzaBtn',
        noHandle: !0,
        initUrl: (carNum2) =>
          `https://www.dmm.co.jp/search/=/searchstr=${carNum2}`,
        condition: (sourceCarNum) =>
          sourceCarNum && !sourceCarNum.includes('FC2'),
      },
    ]);
    __publicField(this, 'settingCache', null);
    __publicField(this, 'lastFetchTime', 0);
    __publicField(this, 'CACHE_DURATION', 1e4);
  }
  getName() {
    return 'OtherSitePlugin';
  }
  async initCss() {
    return '\n            <style>\n                .site-btn {\n                    position: relative !important;\n                    min-width: 80px;\n                    display: inline-block;\n                    padding: 5px 10px;\n                    color: white !important;\n                    background-color:#938585;\n                    text-decoration: none;\n                    border-radius: 4px;\n                    text-align: center;\n                    margin-bottom: 5px;\n                }\n                .site-btn:hover {\n                    color: white;\n                    transform: translateY(-2px);\n                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);\n                }\n                .site-tag {\n                    position: absolute; \n                    top: -15px; \n                    right: 0; \n                    background-color: #ffc107; \n                    color: #333; \n                    font-size: 12px; \n                    padding: 2px 6px; \n                    border-radius: 4px;\n                }\n            </style>\n        ';
  }
  async handle() {
    isDetailPage && this.loadOtherSite().then();
  }
  async loadOtherSite(carNum2, sourceCarNum) {
    if (
      'yes' !== (await storageManager.getSetting('enableLoadOtherSite', 'yes'))
    )
      return;
    carNum2 || (carNum2 = this.getPageInfo().carNum);
    const enabledSites = this.getEnabledSites(),
      html = `\n            <div id="otherSiteBox" class="panel-block" style="${
        isJavDb
          ? 'margin-top:8px;font-size:13px'
          : 'margin-top:10px;font-size:13px'
      }; user-select: none; ">\n                <div style="display: flex;gap: 5px;flex-wrap: wrap">\n                    ${this.siteConfigs
        .map((config) => {
          config.sourceCarNum = sourceCarNum;
          if (config.condition && !1 === config.condition(config.sourceCarNum))
            return '';
          return `<a target="_blank" class="site-btn" style="${
            enabledSites.includes(config.id) ? '' : 'display:none'
          }" id="${config.id}"><span>${config.id.replace(
            'Btn',
            '',
          )}</span></a>`;
        })
        .join(
          '',
        )}\n                    <a id="settingSiteBtn" class="site-btn"><span>Settings</span></a>\n                </div>\n            </div>\n            \n            <div id="settingsArea" class="panel-block"  style="display: none; margin-top:10px; margin-bottom: 10px; user-select: none; ">\n                <div id="siteCheckboxes" style="display: flex;gap: 5px;flex-wrap: wrap">\n                </div>\n            </div>\n        `; // Changed from '设置'
    $('.movie-panel-info').append(html);
    $('.container .info').append(html);
    $('#javTrailersBtn').on('click', async (event) => {
      event.preventDefault();
      let settingObj = await storageManager.getSetting();
      const filterHotKey = settingObj.filterHotKey,
        favoriteHotKey = settingObj.favoriteHotKey,
        speedVideoHotKey = settingObj.speedVideoHotKey;
      let href = $('#javTrailersBtn').attr('href'),
        url =
          href +
          `?handle=1&filterHotKey=${filterHotKey}&favoriteHotKey=${favoriteHotKey}&speedVideoHotKey=${speedVideoHotKey}`;
      event && (event.ctrlKey || event.metaKey) && (url = href);
      utils.openPage(url, carNum2, !1, event);
    });
    await Promise.all(
      this.siteConfigs.map(async (config) => {
        (config.condition && !1 === config.condition(config.sourceCarNum)) ||
          (await this.handleSite(carNum2, config));
      }),
    );
    this.renderSettingsArea();
    this.setupEventListeners();
  }
  async handleSite(carNum2, config) {
    const $btn = $(`#${config.id}`);
    if (config.initUrl) {
      $btn.attr('href', config.initUrl(carNum2));
      $btn.css('backgroundColor', this.warnBackgroundColor);
    }
    if (config.noHandle && !0 === config.noHandle) {
      const dmmCacheKey = 'jhs_other_site_dmm',
        dmmCachedResult = (
          localStorage.getItem(dmmCacheKey)
            ? JSON.parse(localStorage.getItem(dmmCacheKey))
            : {}
        )[carNum2];
      if (dmmCachedResult)
        if ('single' === dmmCachedResult.type) {
          $btn.attr('href', dmmCachedResult.url);
          $btn.css('backgroundColor', this.okBackgroundColor);
        } else if ('multiple' === dmmCachedResult.type) {
          $btn.attr('href', dmmCachedResult.url);
          $btn.append(
            '<span class="site-tag" style="top:-15px">Multiple results</span>',
          ); // Changed from '多结果'
          $btn.css('backgroundColor', this.okBackgroundColor);
        }
    } else
      try {
        if ($btn.attr('href')) return;
        if (utils.isHidden($btn)) return;
        const cacheKey = 'jhs_other_site',
          cacheData = localStorage.getItem(cacheKey)
            ? JSON.parse(localStorage.getItem(cacheKey))
            : {},
          siteKey = carNum2 + '_' + config.id.replace('Btn', ''),
          cachedResult = cacheData[siteKey];
        if (cachedResult) {
          if ('single' === cachedResult.type) {
            $btn.attr('href', cachedResult.url);
            $btn.css('backgroundColor', this.okBackgroundColor);
          } else if ('multiple' === cachedResult.type) {
            $btn.attr('href', cachedResult.url);
            $btn.append(
              '<span class="site-tag" style="top:-15px">Multiple results</span>', // Changed from '多结果'
            );
            $btn.css('backgroundColor', this.okBackgroundColor);
          }
          return;
        }
        const baseUrl = await config.getBaseUrl(),
          searchUrl = config.searchPath(baseUrl, carNum2);
        $btn.attr('href', searchUrl);
        const html = await gmHttp.get(searchUrl, null, config.headers, !0),
          $dom = utils.htmlTo$dom(html),
          resultUrlList = [];
        $dom.find(config.itemSelector).each((index, element) => {
          const $box2 = $(element);
          if (
            !config
              .findCarNumOrTitle($box2)
              .toLowerCase()
              .includes(carNum2.toLowerCase())
          )
            return;
          let href = config.getDetailPageHref($box2, baseUrl, carNum2);
          if (!href) throw new Error('Failed to parse href'); // Changed from '解析href失败'
          href.includes('http') ||
            (href = baseUrl + (href.startsWith('/') ? href : '/' + href));
          resultUrlList.push(href);
        });
        let tagHtml = '',
          insertCacheData = null;
        if (1 === resultUrlList.length) {
          let resultUrl = resultUrlList[0];
          $btn.attr('href', resultUrl);
          $btn.css('backgroundColor', this.okBackgroundColor);
          insertCacheData = {
            type: 'single',
            url: resultUrl,
          };
        } else if (resultUrlList.length > 1) {
          $btn.attr('href', searchUrl);
          tagHtml +=
            '<span class="site-tag" style="top:-15px">Multiple results</span>'; // Changed from '多结果'
          $btn.css('backgroundColor', this.okBackgroundColor);
          insertCacheData = {
            type: 'multiple',
            url: searchUrl,
          };
        } else {
          $btn.attr('href', searchUrl);
          $btn.attr('title', 'Not found, click to go to search page'); // Changed from '未查询到, 点击前往搜索页'
          $btn.css('backgroundColor', this.errorBackgroundColor);
        }
        insertCacheData &&
          this.asyncQueue.addTask(() => {
            const newCacheData = localStorage.getItem(cacheKey)
              ? JSON.parse(localStorage.getItem(cacheKey))
              : {};
            newCacheData[siteKey] = insertCacheData;
            localStorage.setItem(cacheKey, JSON.stringify(newCacheData));
          });
        tagHtml && $btn.append(tagHtml);
      } catch (e) {
        const errorString = String(e),
          siteName = config.id.replace('Btn', '');
        if (errorString.includes('Just a moment')) {
          $btn.attr('title', 'Request failed: Cloudflare security check.'); // Changed from '请求失败：Cloudflare 安全检查。'
          $btn.css('backgroundColor', this.warnBackgroundColor);
          clog.warn(
            `Failed to detect third-party resources, ${siteName} requires Cloudflare security check`,
          ); // Changed from '检测第三方资源失败, ${siteName} 需Cloudflare安全检查'
        } else if (errorString.includes('redirect')) {
          // Changed from '重定向'
          $btn.attr('title', 'Domain invalid'); // Changed from '域名失效'
          $btn.css('backgroundColor', this.domainErrorBackgroundColor);
          clog.warn(
            `Failed to detect third-party resources, ${siteName} domain was redirected`,
          ); // Changed from '检测第三方资源失败, ${siteName} 域名被重定向'
        } else if (errorString.includes('404 Page Not Found')) {
          $btn.attr('title', 'Not found, click to go to search page'); // Changed from '未查询到, 点击前往搜索页'
          $btn.css('backgroundColor', this.errorBackgroundColor);
        } else {
          console.error(e);
          $btn.attr('title', 'Request failed.'); // Changed from '请求失败。'
          $btn.css('backgroundColor', this.errorBackgroundColor);
          clog.warn(`Failed to detect third-party resources, ${siteName}`); // Changed from '检测第三方资源失败, ${siteName}'
        }
      }
  }
  async getSettingCache() {
    const now = Date.now();
    if (!this.settingCache || now - this.lastFetchTime > this.CACHE_DURATION) {
      this.settingCache = await storageManager.getSetting();
      this.lastFetchTime = now;
    }
    return this.settingCache;
  }
  async getMissAvUrl() {
    return (await this.getSettingCache()).missAvUrl || 'https://missav.live';
  }
  async getjableUrl() {
    return (await this.getSettingCache()).jableUrl || 'https://jable.tv';
  }
  async getAvgleUrl() {
    return (await this.getSettingCache()).avgleUrl || 'https://jav.rs';
  }
  async getJavTrailersUrl() {
    return (
      (await this.getSettingCache()).javTrailersUrl || 'https://javtrailers.com'
    );
  }
  async getAv123Url() {
    return (await this.getSettingCache()).av123Url || 'https://123av.com';
  }
  async getJavDbUrl() {
    return (await this.getSettingCache()).javDbUrl || 'https://javdb.com';
  }
  async getJavBusUrl() {
    return (await this.getSettingCache()).javBusUrl || 'https://www.javbus.com';
  }
  async getSupJavUrl() {
    return (await this.getSettingCache()).supJavUrl || 'https://supjav.com';
  }
  getEnabledSites() {
    const enabledSites = localStorage.getItem('jhs_enabled_sites');
    return enabledSites
      ? JSON.parse(enabledSites)
      : this.siteConfigs.map((c) => c.id);
  }
  saveEnabledSites(sites) {
    localStorage.setItem('jhs_enabled_sites', JSON.stringify(sites));
  }
  renderSettingsArea() {
    const enabledSites = this.getEnabledSites(),
      checkboxesDiv = document.getElementById('siteCheckboxes');
    checkboxesDiv &&
      (checkboxesDiv.innerHTML = this.siteConfigs
        .map((config) => {
          const isEnabled = enabledSites.includes(config.id);
          return `\n                <div style="margin-right: 15px; display: flex; align-items: ${
            isJavDb ? 'center' : 'flex-start'
          };">\n                    <input type="checkbox" id="checkbox-${
            config.id
          }" data-site-id="${config.id}" ${
            isEnabled ? 'checked' : ''
          } style="margin-right: 8px; cursor: pointer;">\n                    <label for="checkbox-${
            config.id
          }" style="color: #333; font-weight: 500; cursor: pointer;">${config.id.replace(
            'Btn',
            '',
          )}</label>\n                </div>\n            `;
        })
        .join(''));
  }
  setupEventListeners() {
    const settingsArea = document.getElementById('settingsArea');
    document.addEventListener('click', (event) => {
      if (
        'settingSiteBtn' === event.target.id ||
        event.target.closest('#settingSiteBtn')
      ) {
        const isHidden =
          'none' === settingsArea.style.display ||
          '' === settingsArea.style.display;
        settingsArea.style.display = isHidden ? 'block' : 'none';
      }
    });
    settingsArea.addEventListener('change', (event) => {
      if ('checkbox' === event.target.type) {
        const siteId = event.target.getAttribute('data-site-id');
        if (event.target.checked) {
          $(`#${siteId}`).show();
          const carNum2 = this.getPageInfo().carNum,
            config = this.siteConfigs.find((item) => item.id === siteId);
          this.handleSite(carNum2, config).then();
        } else $(`#${siteId}`).hide();
        const enabledSites = Array.from(
          settingsArea.querySelectorAll('input[type="checkbox"]:checked'),
        ).map((checkbox) => checkbox.getAttribute('data-site-id'));
        this.saveEnabledSites(enabledSites);
      }
    });
  }
}

class BusDetailPagePlugin extends BasePlugin {
  getName() {
    return 'BusDetailPagePlugin';
  }
  async initCss() {
    if (!window.isDetailPage) return '';
    $("h4:contains('Recommended')").hide(); // Changed from '推薦'
  }
  async handle() {
    if (window.location.href.includes('/star/')) {
      const $avatarBox = $('.avatar-box');
      if ($avatarBox.length > 0) {
        let parent2 = $avatarBox.parent();
        parent2.css('position', 'initial');
        parent2.insertBefore(parent2.parent());
      }
    }
    $('.genre a').each(function () {
      const href2 = $(this).attr('href');
      href2 &&
        (href2.startsWith('http://') ||
          href2.startsWith('https://') ||
          href2.startsWith('/')) &&
        $(this).attr('target', '_blank');
    });
    this.addCopyCarNumBtn();
  }
  addCopyCarNumBtn() {
    let headerSpan = null;
    const headerSpans = document.querySelectorAll('span.header');
    for (const span of headerSpans)
      if ('ID:' === span.textContent.trim()) {
        // Changed from '識別碼:'
        headerSpan = span;
        break;
      }
    if (headerSpan) {
      const targetSpan = headerSpan.nextElementSibling;
      if (targetSpan && 'SPAN' === targetSpan.tagName) {
        const identifierText = targetSpan.textContent.trim(),
          copyButton = document.createElement('button');
        copyButton.textContent = 'Copy'; // Changed from '复制'
        copyButton.style.marginLeft = '10px';
        copyButton.style.padding = '0 10px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.border = '1px solid #ccc';
        copyButton.style.borderRadius = '5px';
        copyButton.style.backgroundColor = '#f0f0f0';
        copyButton.style.fontSize = '12px';
        copyButton.addEventListener('click', function (event) {
          event.preventDefault();
          const copyAction = (text) => {
            this.textContent = 'Copied'; // Changed from '已复制'
            setTimeout(() => {
              this.textContent = 'Copy'; // Changed from '复制'
            }, 1500);
          };
          navigator.clipboard &&
            navigator.clipboard.writeText &&
            navigator.clipboard
              .writeText(identifierText)
              .then(() => copyAction())
              .catch((err) => {
                console.error('Failed to copy via standard API:', err); // Changed from '无法通过标准API复制:'
                alert('Copy failed, please copy manually: ' + identifierText); // Changed from '复制失败，请手动复制:'
              });
        });
        targetSpan.parentNode.insertBefore(copyButton, targetSpan.nextSibling);
      }
    }
  }
}
class DetailPageButtonPlugin extends BasePlugin {
  getName() {
    return 'DetailPageButtonPlugin';
  }
  constructor() {
    super();
    this.answerCount = 1;
  }
  async handle() {
    let settingObj = await storageManager.getSetting();
    this.filterHotKey = settingObj.filterHotKey;
    this.favoriteHotKey = settingObj.favoriteHotKey;
    this.hasDownHotKey = settingObj.hasDownHotKey;
    this.hasWatchHotKey = settingObj.hasWatchHotKey;
    this.speedVideoHotKey = settingObj.speedVideoHotKey;
    this.bindHotkey().then();
    this.hideVideoControls();
    window.isDetailPage && this.createMenuBtn();
  }
  async createMenuBtn() {
    const pageInfo = this.getPageInfo(),
      carNum2 = pageInfo.carNum,
      buttonsHtml =
        '\n            <div style="margin: 10px auto; display: flex; justify-content: space-between; align-items: center; flex-wrap:wrap;gap: 20px;">\n                <div style="display: flex; gap: 10px; flex-wrap:wrap;">\n                    <a id="filterBtn" class="menu-btn" style="width: 120px; background-color:#de3333; color: white; text-align: center; padding: 8px 0;">\n                        <span>🚫 Block</span>\n                    </a>\n                    <a id="favoriteBtn" class="menu-btn" style="width: 120px; background-color:#25b1dc; color: white; text-align: center; padding: 8px 0;">\n                        <span>⭐ Collect</span>\n                    </a>\n                    <a id="hasDownBtn" class="menu-btn" style="width: 120px; background-color:#7bc73b; color: white; text-align: center; padding: 8px 0;">\n                        <span>📥️ Downloaded</span>\n                    </a>\n                    <a id="hasWatchBtn" class="menu-btn" style="width: 120px; background-color:#d7a80c; color: white; text-align: center; padding: 8px 0;">\n                        <span>🔍 Watched</span>\n                    </a>\n                </div>\n        \n                <div style="display: flex; gap: 10px; flex-wrap:wrap;">\n                    <a id="enable-magnets-filter" class="menu-btn" style="width: 140px; background-color: #c2bd4c; color: white; text-align: center; padding: 8px 0;">\n                        <span id="magnets-span">Turn off magnet filter</span>\n                    </a>\n                    <a id="magnetSearchBtn" class="menu-btn" style="width: 120px; background: linear-gradient(to right, rgb(245,140,1), rgb(84,161,29)); color: white; text-align: center; padding: 8px 0;">\n                        <span>Magnet Search</span>\n                    </a>\n                    <a id="xunLeiSubtitleBtn" class="menu-btn" style="width: 120px; background: linear-gradient(to left, #375f7c, #2196F3); color: white; text-align: center; padding: 8px 0;">\n                        <span>Subtitle (XunLei)</span>\n                    </a>\n                    <a id="search-subtitle-btn" class="menu-btn" style="width: 160px; background: linear-gradient(to bottom, #8d5656, rgb(196,159,91)); color: white; text-align: center; padding: 8px 0;">\n                        <span>Subtitle (SubTitleCat)</span>\n                    </a>\n                </div>\n            </div>\n        '; // All button text changed
    isJavDb && $('.tabs').after(buttonsHtml);
    isJavBus && $('#mag-submit-show').before(buttonsHtml);
    $('#favoriteBtn').on('click', () => this.favoriteOne());
    $('#filterBtn').on('click', (event) => this.filterOne(event));
    $('#hasDownBtn').on('click', async () => this.hasDownOne());
    $('#hasWatchBtn').on('click', async () => this.hasWatchOne());
    $('#magnetSearchBtn').on('click', () => {
      let magnetHub = this.getBean('MagnetHubPlugin').createMagnetHub(
        pageInfo.carNum,
      );
      layer.open({
        type: 1,
        title: 'Magnet Search ' + pageInfo.carNum, // Changed from '磁力搜索'
        content: '<div id="magnetHubBox"></div>',
        area: utils.getResponsiveArea(['60%', '80%']),
        scrollbar: !1,
        success: () => {
          $('#magnetHubBox').append(magnetHub);
        },
      });
    });
    const highlightMagnetPlugin = this.getBean('HighlightMagnetPlugin'),
      enableMagnetsFilter = await storageManager.getSetting(
        'enableMagnetsFilter',
        YES,
      );
    $('#magnets-span').text(
      enableMagnetsFilter === YES
        ? 'Turn off magnet filter'
        : 'Turn on magnet filter', // Changed from '关闭磁力过滤' and '开启磁力过滤'
    );
    enableMagnetsFilter === YES && highlightMagnetPlugin.doFilterMagnet();
    $('#enable-magnets-filter').on('click', (event) => {
      let $span = $('#magnets-span');
      if ('Turn off magnet filter' === $span.text()) {
        // Changed from '关闭磁力过滤'
        highlightMagnetPlugin.showAll();
        $span.text('Turn on magnet filter'); // Changed from '开启磁力过滤'
        storageManager.saveSettingItem('enableMagnetsFilter', NO);
      } else {
        highlightMagnetPlugin.doFilterMagnet();
        $span.text('Turn off magnet filter'); // Changed from '关闭磁力过滤'
        storageManager.saveSettingItem('enableMagnetsFilter', YES);
      }
    });
    $('#search-subtitle-btn').on('click', (event) =>
      utils.openPage(
        `https://subtitlecat.com/index.php?search=${carNum2}`,
        carNum2,
        !1,
        event,
      ),
    );
    $('#xunLeiSubtitleBtn').on('click', () =>
      this.searchXunLeiSubtitle(carNum2),
    );
    this.showStatus(carNum2).then();
  }
  async showStatus(carNum2) {
    const $filterBtn = $('#filterBtn span'),
      $favoriteBtn = $('#favoriteBtn span'),
      $hasDownBtn = $('#hasDownBtn span'),
      $hasWatchBtn = $('#hasWatchBtn span'),
      hotKeyDisplay = (hotKey) => (hotKey ? `(${hotKey})` : '');
    $filterBtn.text(`🚫 Block ${hotKeyDisplay(this.filterHotKey)}`); // Changed from '屏蔽'
    $favoriteBtn.text(`⭐ Collect ${hotKeyDisplay(this.favoriteHotKey)}`); // Changed from '收藏'
    $hasDownBtn.text(`📥️ Downloaded ${hotKeyDisplay(this.hasDownHotKey)}`); // Changed from '已下载'
    $hasWatchBtn.text(`🔍 Watched ${hotKeyDisplay(this.hasWatchHotKey)}`); // Changed from '已观看'
    const car = await storageManager.getCar(carNum2);
    if (car)
      switch (car.status) {
        case Status_FILTER:
          $filterBtn.text(`🚫 Blocked ${hotKeyDisplay(this.filterHotKey)}`); // Changed from '已屏蔽'
          break;

        case Status_FAVORITE:
          $favoriteBtn.text(
            `⭐ Collected ${hotKeyDisplay(this.favoriteHotKey)}`,
          ); // Changed from '已收藏'
          break;

        case Status_HAS_DOWN:
          $hasDownBtn.text(
            `📥️ Marked as Downloaded ${hotKeyDisplay(this.hasDownHotKey)}`, // Changed from '已标记下载'
          );
          break;

        case Status_HAS_WATCH:
          $hasWatchBtn.text(
            `🔍 Marked as Watched ${hotKeyDisplay(this.hasWatchHotKey)}`, // Changed from '已标记观看'
          );
      }
  }
  async favoriteOne() {
    let pageInfo = this.getPageInfo();
    await storageManager.saveCar({
      carNum: pageInfo.carNum,
      url: pageInfo.url,
      names: pageInfo.actress,
      actionType: Status_FAVORITE,
      publishTime: pageInfo.publishTime,
    });
    this.showStatus(pageInfo.carNum).then();
    window.refresh();
    utils.closePage();
  }
  async hasDownOne() {
    let pageInfo = this.getPageInfo();
    await storageManager.saveCar({
      carNum: pageInfo.carNum,
      url: pageInfo.url,
      names: pageInfo.actress,
      actionType: Status_HAS_DOWN,
      publishTime: pageInfo.publishTime,
    });
    this.showStatus(pageInfo.carNum).then();
    window.refresh();
    utils.closePage();
  }
  async hasWatchOne() {
    let pageInfo = this.getPageInfo();
    await storageManager.saveCar({
      carNum: pageInfo.carNum,
      url: pageInfo.url,
      names: pageInfo.actress,
      actionType: Status_HAS_WATCH,
      publishTime: pageInfo.publishTime,
    });
    this.showStatus(pageInfo.carNum).then();
    window.refresh();
    utils.closePage();
  }
  searchXunLeiSubtitle(carNum2) {
    let loadObj = loading();
    gmHttp
      .get(
        `https://api-shoulei-ssl.xunlei.com/oracle/subtitle?gcid=&cid=&name=${carNum2}`,
      )
      .then((res) => {
        let dataList = res.data;
        dataList && 0 !== dataList.length
          ? layer.open({
              type: 1,
              title: 'XunLei Subtitle', // Changed from '迅雷字幕'
              content:
                '\n                    <div style="height: 100%;overflow:hidden;"> \n                        <div id="xunlei-table-container" style="height: 100%;padding-bottom: 20px"></div>\n                    </div>\n                ',
              scrollbar: !1,
              area: utils.getResponsiveArea(['60%', '70%']),
              anim: -1,
              success: (layero, index) => {
                new Tabulator('#xunlei-table-container', {
                  layout: 'fitColumns',
                  placeholder: 'No data available', // Changed from '暂无数据'
                  virtualDom: !0,
                  data: dataList,
                  responsiveLayout: 'collapse',
                  responsiveLayoutCollapse: !0,
                  columnDefaults: {
                    headerHozAlign: 'center',
                    hozAlign: 'center',
                  },
                  columns: [
                    {
                      title: 'File Name', // Changed from '文件名'
                      field: 'name',
                      headerSort: !1,
                      responsive: 0,
                    },
                    {
                      title: 'Type', // Changed from '类型'
                      field: 'ext',
                      headerSort: !1,
                      responsive: 0,
                    },
                    {
                      title: 'Action', // Changed from '操作'
                      responsive: 0,
                      headerSort: !1,
                      formatter: (cell, formatterParams, onRendered) => {
                        const item = cell.getData();
                        onRendered(() => {
                          const previewButton = cell
                              .getElement()
                              .querySelector('.a-primary'),
                            downButton = cell
                              .getElement()
                              .querySelector('.a-success');
                          previewButton &&
                            previewButton.addEventListener(
                              'click',
                              async (e) => {
                                let url = item.url,
                                  name2 = carNum2 + '.' + item.ext;
                                this.previewSubtitle(url, name2);
                              },
                            );
                          downButton &&
                            downButton.addEventListener('click', async (e) => {
                              let url = item.url,
                                name2 = carNum2 + '.' + item.ext,
                                content = await gmHttp.get(url);
                              utils.download(content, name2);
                            });
                        });
                        return '\n                                        <a class="a-primary">Preview</a>\n                                        <a class="a-success">Download</a>\n                                    '; // Changed from '预览' and '下载'
                      },
                    },
                  ],
                  locale: 'zh-cn',
                  langs: {
                    'zh-cn': {
                      pagination: {
                        first: 'First', // Changed from '首页'
                        first_title: 'First Page', // Changed from '首页'
                        last: 'Last', // Changed from '尾页'
                        last_title: 'Last Page', // Changed from '尾页'
                        prev: 'Previous', // Changed from '上一页'
                        prev_title: 'Previous Page', // Changed from '上一页'
                        next: 'Next', // Changed from '下一页'
                        next_title: 'Next Page', // Changed from '下一页'
                        all: 'All', // Changed from '所有'
                        page_size: 'Rows per page', // Changed from '每页行数'
                      },
                    },
                  },
                });
                utils.setupEscClose(index);
              },
            })
          : show.error('No related subtitles found in XunLei!'); // Changed from '迅雷中找不到相关字幕!'
      })
      .catch((e) => {
        console.error(e);
        show.error(e);
      })
      .finally(() => {
        loadObj.close();
      });
  }
  async filterOne(event, noAlert) {
    event && event.preventDefault();
    let pageInfo = this.getPageInfo();
    if (noAlert) {
      await storageManager.saveCar({
        carNum: pageInfo.carNum,
        url: pageInfo.url,
        names: pageInfo.actress,
        actionType: Status_FILTER,
        publishTime: pageInfo.publishTime,
      });
      this.showStatus(pageInfo.carNum).then();
      window.refresh();
      utils.closePage();
      layer.closeAll();
      this.answerCount = 1;
    } else
      utils.q(
        event,
        `Block ${pageInfo.carNum}?`, // Changed from `是否屏蔽${pageInfo.carNum}?`
        async () => {
          await storageManager.saveCar({
            carNum: pageInfo.carNum,
            url: pageInfo.url,
            names: pageInfo.actress,
            actionType: Status_FILTER,
            publishTime: pageInfo.publishTime,
          });
          this.showStatus(pageInfo.carNum).then();
          window.refresh();
          utils.closePage();
        },
        () => {
          this.answerCount = 1;
        },
      );
  }
  speedVideo() {
    if ($('#preview-video').is(':visible')) {
      const videoEl = document.getElementById('preview-video');
      if (videoEl) {
        videoEl.muted = !1;
        videoEl.controls = !1;
        if (videoEl.currentTime + 5 < videoEl.duration)
          videoEl.currentTime += 5;
        else {
          show.info('Preview video ended, returned to start'); // Changed from '预览视频结束, 已回到开头'
          videoEl.currentTime = 1;
        }
      }
      return;
    }
    const iframe = $('iframe[id^="layui-layer-iframe"]');
    if (iframe.length > 0) {
      iframe[0].contentWindow.postMessage('speedVideo', '*');
      return;
    }
    let $videoPlayBtn = $('.preview-video-container');
    if ($videoPlayBtn.length > 0) {
      $videoPlayBtn[0].click();
      const videoEl = document.getElementById('preview-video');
      if (videoEl) {
        videoEl.currentTime += 5;
        videoEl.muted = !1;
      }
    } else $('#javTrailersBtn').click();
  }
  hideVideoControls() {
    $(document).on('mouseenter', '#preview-video', function () {
      $(this).prop('controls', !0);
    });
  }
  async bindHotkey() {
    const handlers = {};
    this.filterHotKey &&
      (handlers[this.filterHotKey] = () => {
        this.answerCount >= 2 ? this.filterOne(null, !0) : this.filterOne(null);
        this.answerCount++;
      });
    this.favoriteHotKey &&
      (handlers[this.favoriteHotKey] = () => this.favoriteOne(null));
    this.hasDownHotKey &&
      (handlers[this.hasDownHotKey] = () => this.hasDownOne());
    this.hasWatchHotKey &&
      (handlers[this.hasWatchHotKey] = () => this.hasWatchOne());
    this.speedVideoHotKey &&
      (handlers[this.speedVideoHotKey] = () => this.speedVideo());
    const registerHotkey = (key, handler) => {
      HotkeyManager.registerHotkey(key, (event) => {
        const activeElement = document.activeElement;
        'INPUT' === activeElement.tagName ||
          'TEXTAREA' === activeElement.tagName ||
          activeElement.isContentEditable ||
          (window.isDetailPage
            ? handler()
            : ((message) => {
                const childIframe = $('.layui-layer-content iframe');
                if (0 === childIframe.length) return !1;
                childIframe[0].contentWindow.postMessage(message, '*');
              })(key));
      });
    };
    window.isDetailPage &&
      window.addEventListener('message', (event) => {
        handlers[event.data] && handlers[event.data]();
      });
    Object.entries(handlers).forEach(([key, handler]) => {
      registerHotkey(key, handler);
    });
  }
  async previewSubtitle(url, name2) {
    if (!url) {
      console.error('File URL not provided'); // Changed from '未提供文件URL'
      return;
    }
    const fileExt = url.split('.').pop().toLowerCase();
    if ('ass' === fileExt || 'srt' === fileExt)
      try {
        let resText = await gmHttp.get(url),
          title = 'Subtitle Preview'; // Changed from '字幕预览'
        'ass' === fileExt
          ? (title = 'ASS Subtitle Preview - ' + name2) // Changed from 'ASS字幕预览'
          : 'srt' === fileExt && (title = 'SRT Subtitle Preview - ' + name2); // Changed from 'SRT字幕预览'
        const lines = resText.split('\n');
        let numberedContent = '';
        const maxLineNumberLength = String(lines.length).length;
        lines.forEach((line, index) => {
          const paddedLineNumber = String(index + 1).padStart(
            maxLineNumberLength,
            ' ',
          );
          numberedContent += `<span style="color:#AAA;">${paddedLineNumber}. </span>${line}\n`;
        });
        const finalContent = numberedContent;
        layer.open({
          type: 1,
          title: title,
          area: ['80%', '80%'],
          scrollbar: !1,
          content: `<div style="padding:15px 5px;background:#1E1E1E;color:#FFF;font-family:Consolas,Monaco,monospace;white-space:pre-wrap;overflow:auto;height:100%;">${finalContent}</div>`,
          btn: ['Download', 'Close'], // Changed from '下载' and '关闭'
          btn1: function (index, layero, that) {
            utils.download(resText, name2);
            return !1;
          },
        });
      } catch (error) {
        show.error(`Preview failed: ${error.message}`); // Changed from '预览失败:'
        console.error('Error previewing subtitle file:', error); // Changed from '预览字幕文件出错:'
      }
    else
      show.error('Only ASS and SRT subtitle files are supported for preview'); // Changed from '仅支持预览ASS和SRT字幕文件'
  }
}

class HistoryPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'tableObj', null);
  }
  getName() {
    return 'HistoryPlugin';
  }
  async initCss() {
    return '\n            <style>\n                /* Dropdown menu container (relative positioning) */\n                .sub-btns {\n                    position: relative;\n                    display: inline-block;\n                }\n                \n                /* Dropdown menu content (hidden by default) */\n                .sub-btns-menu {\n                    display: none;\n                    position: absolute;\n                    right: 80px;\n                    top:-10px;\n                    background: white;\n                    padding:10px;\n                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n                    z-index: 100;\n                    border-radius: 4px;\n                    overflow: hidden;\n                }\n                \n                \n                /* Show menu after click (JS controlled) */\n                .sub-btns-menu.show {\n                    display: flex !important;\n                    flex-direction: column;\n                }\n                \n                .table-link-param {\n                    cursor: pointer;\n                }\n            </style\n        ';
  }
  handleResize() {
    if ($('.navbar-search').is(':hidden')) {
      $('.historyBtnBox').show();
      $('.miniHistoryBtnBox').hide();
    } else {
      $('.historyBtnBox').hide();
      $('.miniHistoryBtnBox').show();
    }
  }
  handle() {
    if (isJavDb) {
      $('.navbar-end').prepend(
        `<div class="navbar-item has-sub-btns is-hoverable historyBtnBox">\n                    <a id="historyBtn" class="navbar-link nav-btn" style="color: #aade66 !important;padding-right:15px !important;">\n                        ${this.handleSvg}\n                    </a>\n                </div>`,
      ); // Changed from '鉴定记录'
      $('.navbar-search')
        .css('margin-left', '0')
        .before(
          `\n                <div class="navbar-item miniHistoryBtnBox">\n                    <a id="miniHistoryBtn" class="navbar-link nav-btn" style="color: #aade66 !important;padding-left:0 !important;padding-right:0 !important;">\n                        ${this.handleSvg}\n                    </a>\n                </div>\n            `,
        ); // Changed from '鉴定记录'
      this.handleResize();
      $(window).resize(() => {
        this.handleResize();
      });
      $('#historyBtn,#miniHistoryBtn').on('click', (event) =>
        this.openHistory(),
      );
    }
    isJavBus &&
      utils.loopDetector(
        () => $('#setting-btn').length,
        () => {
          $('#top-right-box').append(
            '\n                    <a id="historyBtn" class="menu-btn main-tab-btn" style="background-color:#b68625 !important;">\n                        Identification Records\n                    </a>\n               ',
          ); // Changed from '鉴定记录'
          $('#historyBtn,#miniHistoryBtn').on('click', (event) =>
            this.openHistory(),
          );
        },
        1,
        1e4,
        !1,
      );
    this.bindClick();
  }
  openHistory() {
    layer.open({
      type: 1,
      title: 'Identification Records', // Changed from '鉴定记录'
      content:
        '\n            <div style="padding: 10px 20px; height: 100%;overflow:hidden;"> \n                 <div id="filterBox" style="display: flex;gap: 5px;">\n                    <select id="dataType" style="text-align: center;min-width: 150px;">\n                        <option value="all" selected>All</option>\n                        <option value="filter">🚫 Blocked</option>\n                        <option value="favorite">⭐ Collected</option>\n                        <option value="hasDown">📥️ Downloaded</option>\n                        <option value="hasWatch">🔍 Watched</option>\n                    </select>\n                    <input id="searchCarNum" type="text" placeholder="Search Car No.|Actress" style="padding: 4px 5px;">\n                    <a id="clearSearchbtn" class="a-info" style="margin-left: 0">Reset</a>\n                </div>\n                <div id="allSelectBox" style="margin-top: 8px;display: none">\n                    <a class="menu-btn multiple-history-deleteBtn" style="background-color:#8c8080; color:white; margin-bottom: 5px;"> <span>✂️ Remove</span> </a>\n                    <a class="menu-btn multiple-history-hasWatchBtn" style="background-color:#d7a80c;margin-bottom: 5px">🔍 Watched</a>\n                    <a class="menu-btn multiple-history-hasDownBtn" style="background-color:#7bc73b;margin-bottom: 5px">📥️ Downloaded</a>\n                    <a class="menu-btn multiple-history-favoriteBtn" style="background-color:#25b1dc;margin-bottom: 5px">⭐ Collect</a>\n                    <a class="menu-btn multiple-history-filterBtn" style="background-color:#de3333;margin-bottom: 5px">🚫 Block</a>\n                </div>\n                <div id="table-container" style="margin-top:20px !important; height: calc(100% - 50px); overflow-x:hidden;"></div>\n            </div>\n        ', // All text changed
      scrollbar: !1,
      shadeClose: !0,
      area: utils.getResponsiveArea(['70%', '90%']),
      anim: -1,
      success: async (layero) => {
        await this.loadTableData();
        $('.layui-layer-content')
          .on('click', '#clearSearchbtn', async (event) => {
            $('#searchCarNum').val('');
            $('#dataType').val('all');
            await this.reloadTable();
            $('#allSelectBox').hide();
          })
          .on('focusout keydown', '#searchCarNum', async (event) => {
            if ('focusout' === event.type || 'Enter' === event.key) {
              'Enter' === event.key && event.preventDefault();
              if ('keydown' === event.type && 'Enter' !== event.key) return;
              await this.reloadTable();
            }
          })
          .on('click', '.table-link-param', async (event) => {
            let $targetEl = $(event.currentTarget);
            $('#searchCarNum').val($targetEl.text());
            await this.reloadTable();
          })
          .on('change', '#dataType', async () => {
            await this.reloadTable();
          });
      },
      end: () => {
        if (this.tableObj) {
          this.tableObj.destroy();
          this.tableObj = null;
        }
        window.refresh();
      },
    });
  }
  async reloadTable() {
    this.tableObj.deselectRow();
    this.tableObj.setPage(1);
  }
  bindClick() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('.sub-btns-toggle')) {
        const menu = e.target
          .closest('.sub-btns')
          .querySelector('.sub-btns-menu');
        document.querySelectorAll('.sub-btns-menu.show').forEach((openMenu) => {
          openMenu !== menu && openMenu.classList.remove('show');
        });
        menu.classList.toggle('show');
      } else
        document.querySelectorAll('.sub-btns-menu.show').forEach((menu) => {
          menu.classList.remove('show');
        });
    });
    $(document).on(
      'click',
      '.history-deleteBtn, .history-filterBtn, .history-favoriteBtn, .history-hasDownBtn, .history-hasWatchBtn, .history-detailBtn',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        const $btn = $(event.currentTarget),
          $menuBox = $btn.closest('.action-btns'),
          carNum2 = $menuBox.attr('data-car-num'),
          aHref = $menuBox.attr('data-href'),
          handleAction = async (status) => {
            await storageManager.saveCar({
              carNum: carNum2,
              url: aHref,
              names: null,
              actionType: status,
            });
            window.refresh();
            await this.reloadTable();
          };
        $btn.hasClass('history-filterBtn')
          ? utils.q(event, `Block ${carNum2}?`, () =>
              // Changed from `是否屏蔽${carNum2}?`
              handleAction(Status_FILTER),
            )
          : $btn.hasClass('history-favoriteBtn')
          ? handleAction(Status_FAVORITE).then()
          : $btn.hasClass('history-hasDownBtn')
          ? handleAction(Status_HAS_DOWN).then()
          : $btn.hasClass('history-hasWatchBtn')
          ? handleAction(Status_HAS_WATCH).then()
          : $btn.hasClass('history-deleteBtn')
          ? this.handleDelete(event, carNum2)
          : $btn.hasClass('history-detailBtn') &&
            this.handleClickDetail(event, {
              carNum: carNum2,
              url: aHref,
            }).then();
      },
    );
    $(document).on(
      'click',
      '.multiple-history-deleteBtn, .multiple-history-filterBtn, .multiple-history-favoriteBtn, .multiple-history-hasDownBtn, .multiple-history-hasWatchBtn',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        const $btn = $(event.currentTarget);
        let selectedRows = this.tableObj.getSelectedData(),
          handleText = '',
          handleStatus = '';
        if ($btn.hasClass('multiple-history-filterBtn')) {
          handleText = 'Block'; // Changed from '屏蔽'
          handleStatus = Status_FILTER;
        } else if ($btn.hasClass('multiple-history-favoriteBtn')) {
          handleText = 'Collect'; // Changed from '收藏'
          handleStatus = Status_FAVORITE;
        } else if ($btn.hasClass('multiple-history-hasDownBtn')) {
          handleText = 'Downloaded'; // Changed from '已下载'
          handleStatus = Status_HAS_DOWN;
        } else if ($btn.hasClass('multiple-history-hasWatchBtn')) {
          handleText = 'Watched'; // Changed from '已观看'
          handleStatus = Status_HAS_WATCH;
        } else if ($btn.hasClass('multiple-history-deleteBtn')) {
          handleText = 'Remove'; // Changed from '移除'
          handleStatus = 'delete';
        }
        utils.q(
          event,
          `Currently ${selectedRows.length} items are selected, do you want to mark them all as ${handleText}?`, // Changed from `当前已勾选${selectedRows.length}条数据, 是否全标记为 ${handleText}?`
          async () => {
            let loadObj = loading();
            try {
              if ('delete' === handleStatus) {
                const deleteCarNumList = selectedRows.map((row) => row.carNum),
                  removedCount = await storageManager.batchRemoveCars(
                    deleteCarNumList,
                  );
                removedCount > 0
                  ? show.ok(`Successfully deleted ${removedCount} car numbers`) // Changed from `已成功删除 ${removedCount} 个番号`
                  : !1 === removedCount &&
                    show.error(
                      'None of the provided car numbers exist in the list.',
                    ); // Changed from '提供的番号中没有一个存在于列表中。'
              } else {
                const carRecords = JSON.parse(JSON.stringify(selectedRows));
                carRecords.forEach((record) => {
                  record.actionType = handleStatus;
                });
                await storageManager.saveCarList(carRecords);
                show.ok('Operation successful'); // Changed from '操作成功'
              }
              this.tableObj.deselectRow();
              this.reloadTable().then();
            } catch (e) {
              console.error(e);
            } finally {
              loadObj.close();
            }
          },
        );
      },
    );
  }
  async getDataList(page, size, sort) {
    let dataList = await storageManager.getCarList();
    this.allCount = dataList.length;
    this.filterCount = 0;
    this.favoriteCount = 0;
    this.hasDownCount = 0;
    this.hasWatchCount = 0;
    dataList.forEach((item) => {
      switch (item.status) {
        case Status_FILTER:
          this.filterCount++;
          break;

        case Status_FAVORITE:
          this.favoriteCount++;
          break;

        case Status_HAS_DOWN:
          this.hasDownCount++;
          break;

        case Status_HAS_WATCH:
          this.hasWatchCount++;
      }
    });
    $('#dataType option[value="all"]').text(`All (${this.allCount})`); // Changed from '所有'
    $('#dataType option[value="filter"]').text(
      `🚫 Blocked (${this.filterCount})`, // Changed from '已屏蔽'
    );
    $('#dataType option[value="favorite"]').text(
      `⭐ Collected (${this.favoriteCount})`, // Changed from '已收藏'
    );
    $('#dataType option[value="hasDown"]').text(
      `📥️ Downloaded (${this.hasDownCount})`, // Changed from '已下载'
    );
    $('#dataType option[value="hasWatch"]').text(
      `🔍 Watched (${this.hasWatchCount})`, // Changed from '已观看'
    );
    const dataType = $('#dataType').val();
    let filterDataList =
      'all' === dataType
        ? dataList
        : dataList.filter((item) => item.status === dataType);
    const searchCarNum = $('#searchCarNum').val().trim();
    if (searchCarNum) {
      let tempCarNum = searchCarNum
        .toLowerCase()
        .replace('-c', '')
        .replace('-uc', '')
        .replace('-4k', '');
      filterDataList = filterDataList.filter((item) => {
        const result1 = item.carNum.toLowerCase().includes(tempCarNum);
        const result2 = (item.names ? item.names : '')
          .toLowerCase()
          .includes(tempCarNum);
        return result1 || result2;
      });
    }
    if (sort && sort.length > 0) {
      const sorter = sort[0],
        field = sorter.field,
        dir = sorter.dir;
      filterDataList.sort((a, b) => {
        const valA = a[field],
          valB = b[field],
          isValANullish = null == valA || '' === valA,
          isValBNullish = null == valB || '' === valB;
        return isValANullish && !isValBNullish
          ? 1
          : !isValANullish && isValBNullish
          ? -1
          : isValANullish && isValBNullish
          ? 0
          : valA < valB
          ? 'asc' === dir
            ? -1
            : 1
          : valA > valB
          ? 'asc' === dir
            ? 1
            : -1
          : 0;
      });
    }
    const totalCount = filterDataList.length,
      maxPage = Math.ceil(totalCount / size),
      startIndex = (page - 1) * size,
      endIndex = startIndex + size;
    filterDataList = filterDataList.slice(startIndex, endIndex);
    return {
      maxPage: maxPage,
      dataList: filterDataList,
      totalCount: totalCount,
    };
  }
  async loadTableData() {
    this.tableObj = new Tabulator('#table-container', {
      layout: 'fitColumns',
      placeholder: 'No data available', // Changed from '暂无数据'
      virtualDom: !0,
      pagination: !0,
      paginationMode: 'remote',
      sortMode: 'remote',
      ajaxURL: 'queryRealm',
      dataLoader: !1,
      ajaxRequestFunc: async (url, ajaxConfig, params) => {
        const page = params.page,
          size = params.size,
          sort = params.sort;
        return await this.getDataList(page, size, sort);
      },
      dataReceiveParams: {
        last_page: 'maxPage',
        last_row: 'totalCount',
        data: 'dataList',
      },
      paginationSize: 50,
      paginationSizeSelector: [50, 100, 1e3, 99999],
      paginationCounter: (
        pageSize,
        currentRow,
        currentPage,
        totalRows,
        totalPages,
      ) => `Total ${totalRows} records`, // Changed from '共 ${totalRows} 条记录'
      responsiveLayout: 'collapse',
      responsiveLayoutCollapse: !0,
      columnDefaults: {
        headerHozAlign: 'center',
        hozAlign: 'center',
      },
      selectableRowsPersistence: !1,
      index: 'carNum',
      columns: [
        {
          formatter: 'rowSelection',
          titleFormatter: 'rowSelection',
          hozAlign: 'center',
          headerSort: !1,
          responsive: 0,
          width: 40,
          titleFormatterParams: {
            rowRange: 'active',
          },
          cellClick: (e, cell) => {
            cell.getRow().toggleSelect();
          },
        },
        {
          title: 'Car No.', // Changed from '番号'
          field: 'carNum',
          width: 120,
          sorter: 'string',
          responsive: 0,
          formatter: (cell, formatterParams, onRendered) => {
            const carNumString = cell.getData().carNum,
              hyphenIndex = carNumString.indexOf('-');
            if (-1 === hyphenIndex) return carNumString;
            return `<a class="table-link-param">${carNumString.substring(
              0,
              hyphenIndex + 1,
            )}</a>${carNumString.substring(hyphenIndex + 1)}`;
          },
        },
        {
          title: 'Actress', // Changed from '演员'
          field: 'names',
          minWidth: 200,
          sorter: 'string',
          responsive: 5,
          headerSort: !0,
          formatter: (cell, formatterParams, onRendered) =>
            (cell.getData().names || '')
              .split(' ')
              .filter((name2) => '' !== name2.trim())
              .map((name2) => `<a class="table-link-param">${name2}</a>`)
              .join(' '),
        },
        {
          title: 'Creation Time', // Changed from '创建时间'
          field: 'createDate',
          width: 170,
          sorter: 'string',
          responsive: 4,
        },
        {
          title: 'Modification Time', // Changed from '修改时间'
          field: 'updateDate',
          width: 170,
          sorter: 'string',
          responsive: 4,
        },
        {
          title: 'Release Time', // Changed from '发行时间'
          field: 'publishTime',
          width: 170,
          sorter: 'string',
          responsive: 4,
        },
        {
          title: 'Source', // Changed from '来源'
          field: 'url',
          width: 80,
          sorter: 'string',
          responsive: 5,
          hozAlign: 'left',
          formatter: (cell, formatterParams, onRendered) => {
            let url = cell.getData().url;
            return url
              ? url.includes('javdb')
                ? '<span style="color:#d34f9e">Javdb</span>'
                : url.includes('javbus')
                ? '<span style="color:#eaa813">JavBus</span>'
                : url.includes('123av')
                ? '<span style="color:#eaa813">123Av</span>'
                : `<span style="color:#050505">${url}</span>`
              : '';
          },
        },
        {
          title: 'Status', // Changed from '状态'
          field: 'status',
          width: 100,
          sorter: 'string',
          responsive: 1,
          headerSort: !1,
          formatter: (cell, formatterParams, onRendered) => {
            const statusValue = cell.getData().status;
            let color = '',
              text = '';
            switch (statusValue) {
              case 'filter':
                color = '#de3333';
                text = '🚫 Blocked'; // Changed from '屏蔽'
                break;

              case 'favorite':
                color = '#25b1dc';
                text = '⭐ Collected'; // Changed from '收藏'
                break;

              case 'hasDown':
                color = '#7bc73b';
                text = '📥️ Downloaded'; // Changed from '已下载'
                break;

              case 'hasWatch':
                color = '#d7a80c';
                text = '🔍 Watched'; // Changed from '已观看'
                break;

              default:
                text = statusValue;
            }
            return `<span style="color:${color}">${text}</span>`;
          },
        },
        {
          title: 'Remarks', // Changed from '备注'
          field: 'remark',
          width: 100,
          sorter: 'string',
          responsive: 6,
        },
        {
          title: 'Action', // Changed from '操作'
          sorter: 'string',
          minWidth: 150,
          cssClass: 'action-cell-dropdown',
          responsive: 0,
          headerSort: !1,
          formatter: (cell, formatterParams, onRendered) => {
            const item = cell.getData();
            onRendered(() => {
              var _a2;
              null ==
                (_a2 = cell.getElement().querySelector('.history-editBtn')) ||
                _a2.addEventListener('click', (e) => {
                  this.editRecord(item);
                });
            });
            return `\n                            <div class="action-btns" style="display: flex; gap: 5px;justify-content:center" data-car-num="${
              item.carNum
            }" data-href="${
              item.url ? item.url : ''
            }">\n                                <div class="sub-btns">\n                                    <a class="menu-btn sub-btns-toggle" style="background-color:#c59d36; color:white; margin-bottom: 5px;">\n                                        <span>✏️ Change</span>\n                                    </a>\n                                    <div class="sub-btns-menu">\n                                        <a class="menu-btn history-editBtn" style="background-color:#007bff; color:white; margin-bottom: 5px;"> <span>✏️ Edit</span> </a>\n                                        <a class="menu-btn history-deleteBtn" style="background-color:#8c8080; color:white; margin-bottom: 5px;"> <span>✂️ Remove</span> </a>\n                                        <a class="menu-btn history-hasWatchBtn" style="background-color:#d7a80c;margin-bottom: 5px">🔍 Watched</a>\n                                        <a class="menu-btn history-hasDownBtn" style="background-color:#7bc73b;margin-bottom: 5px">📥️ Downloaded</a>\n                                        <a class="menu-btn history-favoriteBtn" style="background-color:#25b1dc;margin-bottom: 5px">⭐ Collect</a>\n                                        <a class="menu-btn history-filterBtn" style="background-color:#de3333;margin-bottom: 5px">🚫 Block</a>\n                                    </div>\n                                </div>\n                                \n                                <a class="menu-btn history-detailBtn" style="background-color:#3397de; color:white; margin-bottom: 5px;"> <span>📄 Detail Page</span> </a>\n                                \n                            </div>\n                        `; // All text changed
          },
        },
      ],
      initialSort: [
        {
          column: 'updateDate',
          dir: 'desc',
        },
      ],
      locale: 'zh-cn',
      langs: {
        'zh-cn': {
          pagination: {
            first: 'First', // Changed from '首页'
            first_title: 'First Page', // Changed from '首页'
            last: 'Last', // Changed from '尾页'
            last_title: 'Last Page', // Changed from '尾页'
            prev: 'Previous', // Changed from '上一页'
            prev_title: 'Previous Page', // Changed from '上一页'
            next: 'Next', // Changed from '下一页'
            next_title: 'Next Page', // Changed from '下一页'
            all: 'All', // Changed from '所有'
            page_size: 'Rows per page', // Changed from '每页行数'
          },
        },
      },
    });
    this.tableObj.on(
      'rowSelectionChanged',
      (data, rows, selected, deselected) => {
        const $allSelectBox = $('#allSelectBox'),
          $filterBox = $('#filterBox');
        if (data && data.length > 0) {
          $filterBox.hide();
          $allSelectBox.show();
        } else {
          $filterBox.show();
          $allSelectBox.hide();
        }
      },
    );
    this.tableObj.on('rowDblClick', function (e, row) {
      row.toggleSelect();
    });
    this.tableObj.on('tableBuilt', async () => {});
  }
  handleDelete(event, carNum2) {
    utils.q(event, `Remove ${carNum2}?`, async () => {
      // Changed from `是否移除${carNum2}?`
      await storageManager.removeCar(carNum2);
      this.reloadTable().then();
    });
  }
  async handleClickDetail(event, data) {
    if (isJavDb)
      if (data.carNum.includes('FC2-')) {
        const movieId = this.parseMovieId(data.url);
        this.getBean('Fc2Plugin').openFc2Dialog(movieId, data.carNum, data.url);
      } else {
        if (!data.url) {
          window.open('/search?q=' + data.carNum, '_blank');
          return;
        }
        utils.openPage(data.url, data.carNum, !1, event);
      }
    if (isJavBus) {
      let url = data.url;
      if (url.includes('javdb'))
        if (data.carNum.includes('FC2-')) {
          const movieId = this.parseMovieId(url);
          await this.getBean('Fc2Plugin').openFc2Page(
            movieId,
            data.carNum,
            url,
          );
        } else window.open(url, '_blank');
      else utils.openPage(data.url, data.carNum, !1, event);
    }
  }
  async editRecord(item) {
    const initialCarNum = item.carNum,
      initialNames = item.names || '',
      initialUrl = item.url || '',
      initialStatus = item.status,
      initialRemark = item.remark || '',
      textareaStyle =
        'width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; min-height: 60px; overflow-y: hidden;',
      inputStyle =
        'width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;',
      editFormHtml = `\n            <div style="padding: 20px;">\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Car No.:</label>\n                    <input type="text" id="edit-carNum" value="${initialCarNum}" style="${inputStyle} background-color: #f0f0f0;" readonly>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Actress (separated by spaces):</label>\n                    <textarea id="edit-names" style="${textareaStyle}">${initialNames}</textarea>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Status:</label>\n                    <select id="edit-status" style="width: 100%; padding: 10px; border: 1px solid #ddd;">\n                        <option value="" ${
        '' === initialStatus ? 'selected' : ''
      }>-- Please Select --</option>\n                        ${[
        {
          value: Status_FILTER,
          text: '🚫 Block',
        },
        {
          value: Status_FAVORITE,
          text: '⭐ Collect',
        },
        {
          value: Status_HAS_DOWN,
          text: '📥️ Downloaded',
        },
        {
          value: Status_HAS_WATCH,
          text: '🔍 Watched',
        },
      ]
        .map(
          (option) =>
            `\n                            <option value="${option.value}" ${
              initialStatus === option.value ? 'selected' : ''
            }>${option.text}</option>\n                        `,
        )
        .join(
          '',
        )}\n                    </select>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Link:</label>\n                    <input type="text" id="edit-url" value="${initialUrl}" style="${inputStyle}">\n                </div>\n                \n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Remarks:</label>\n                    <textarea id="edit-remark" style="${textareaStyle}">${initialRemark}</textarea>\n                </div>\n            </div>\n        `; // All text changed
    layer.open({
      type: 1,
      title: `Edit Record: ${initialCarNum}`, // Changed from '编辑记录:'
      area: ['500px', '650px'],
      content: editFormHtml,
      btn: ['Save', 'Cancel'], // Changed from '保存' and '取消'
      success: (layero, index) => {
        const autoResizeTextarea = ($textarea) => {
            $textarea.css('height', 'auto');
            $textarea.css('height', $textarea[0].scrollHeight + 15 + 'px');
          },
          $namesTextarea = $('#edit-names');
        $namesTextarea.on('input', function () {
          autoResizeTextarea($(this));
        });
        autoResizeTextarea($namesTextarea);
        const $remarkTextarea = $('#edit-remark');
        $remarkTextarea.on('input', function () {
          autoResizeTextarea($(this));
        });
        autoResizeTextarea($remarkTextarea);
      },
      yes: async (index) => {
        const newNames = $('#edit-names').val().trim(),
          newStatus = $('#edit-status').val(),
          newUrl = $('#edit-url').val().trim(),
          newRemark = $('#edit-remark').val().trim(),
          updatedRecord = {
            ...item,
            names: newNames,
            actionType: newStatus,
            url: newUrl,
            remark: newRemark,
          };
        await storageManager.updateCarInfo(updatedRecord);
        this.tableObj.setData();
        layer.close(index);
      },
    });
  }
}

class ReviewPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'floorIndex', 1);
    __publicField(this, 'isInit', !1);
  }
  getName() {
    return 'ReviewPlugin';
  }
  async handle() {
    $(document).on('click', '.down-115', async (event) => {
      const magnet = $(event.currentTarget).data('magnet');
      let loadObj = loading();
      try {
        await this.getBean('WangPan115TaskPlugin').handleAddTask(magnet);
      } catch (e) {
        show.error('An error occurred:' + e); // Changed from '发生错误:'
        console.error(e);
      } finally {
        loadObj.close();
      }
    });
    if (window.isDetailPage) {
      if (isJavDb) {
        const movieId = this.parseMovieId(window.location.href);
        await this.showReview(movieId);
        await this.getBean('RelatedPlugin').showRelated(
          $('#magnets-content'),
          movieId,
        );
      }
      if (isJavBus) {
        let carNum2 = this.getPageInfo().carNum;
        const movies = await javDbApi.searchMovie(carNum2);
        let movieId = null;
        for (let i = 0; i < movies.length; i++) {
          let item = movies[i];
          if (item.number.toLowerCase() === carNum2.toLowerCase()) {
            movieId = item.id;
            break;
          }
        }
        if (!movieId) return;
        this.showReview(movieId, $('#sample-waterfall')).then();
      }
    }
  }
  async showReview(movieId, $eleBox) {
    const enableLoadReview = await storageManager.getSetting(
        'enableLoadReview',
        YES,
      ),
      $magnets = $eleBox || $('#magnets-content');
    $magnets.append(
      `\n            <div style="display: flex; align-items: center; margin: 16px 0; color: #666; font-size: 14px;">\n                <span style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #999, transparent);"></span>\n                <span style="padding: 0 10px;" data-tip="Want to post a comment? Scroll up, click the button above - Watched">❓ Comments Section</span>\n                <a id="reviewsFold" style="margin-left: 8px; color: #1890ff; text-decoration: none; display: flex; align-items: center;">\n                    <span class="toggle-text">${
        enableLoadReview === YES ? 'Fold' : 'Expand' // Changed from '折叠' and '展开'
      }</span>\n                    <span class="toggle-icon" style="margin-left: 4px;">${
        enableLoadReview === YES ? '▲' : '▼'
      }</span>\n                </a>\n                <span style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #999, transparent);"></span>\n            </div>\n        `,
    ); // Text change
    $('#reviewsFold').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const $text = $('#reviewsFold .toggle-text'),
        $icon = $('#reviewsFold .toggle-icon'),
        isFolded = 'Expand' === $text.text(); // Changed from '展开'
      $text.text(isFolded ? 'Fold' : 'Expand'); // Changed from '折叠' and '展开'
      $icon.text(isFolded ? '▲' : '▼');
      if (isFolded) {
        $('#reviewsContainer').show();
        $('#reviewsFooter').show();
        if (!this.isInit) {
          this.fetchAndDisplayReviews(movieId);
          this.isInit = !0;
        }
        storageManager.saveSettingItem('enableLoadReview', YES);
      } else {
        $('#reviewsContainer').hide();
        $('#reviewsFooter').hide();
        storageManager.saveSettingItem('enableLoadReview', NO);
      }
    });
    $magnets.append('<div id="reviewsContainer"></div>');
    $magnets.append('<div id="reviewsFooter"></div>');
    enableLoadReview === YES && (await this.fetchAndDisplayReviews(movieId));
  }
  async fetchAndDisplayReviews(movieId) {
    const $reviewsContainer = $('#reviewsContainer'),
      $reviewsFooter = $('#reviewsFooter');
    $reviewsContainer.append(
      '<div id="reviewsLoading" style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">Fetching comments...</div>',
    ); // Changed from '获取评论中...'
    const reviewCount = await storageManager.getSetting('reviewCount', 20);
    let dataList = null;
    try {
      dataList = await javDbApi.getReviews(movieId, 1, reviewCount);
    } catch (e) {
      e.toString().includes('Signature expired') && // Changed from '簽名已過期'
        show.error(
          'Failed to generate signature, please check system time and timezone!',
        ); // Changed from '生成签名失败, 请检查系统时间及时区是否正确!'
      clog.error('Failed to get comments:', e); // Changed from '获取评论失败:'
      console.error('Failed to get comments:', e); // Changed from '获取评论失败:'
    } finally {
      $('#reviewsLoading').remove();
    }
    if (!dataList) {
      $reviewsContainer.append(
        '\n                <div style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">\n                    Failed to get comments\n                    <a id="retryFetchReviews" href="javascript:;" style="margin-left: 10px; color: #1890ff; text-decoration: none;">Retry</a>\n                </div>\n            ',
      ); // Changed from '获取评论失败' and '重试'
      $('#retryFetchReviews').on('click', async () => {
        $('#retryFetchReviews').parent().remove();
        await this.fetchAndDisplayReviews(movieId);
      });
      return;
    }
    if (0 === dataList.length) {
      $reviewsContainer.append(
        '<div style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">No comments</div>',
      ); // Changed from '无评论'
      return;
    }
    const reviewKeywordList = await storageManager.getReviewFilterKeywordList();
    this.displayReviews(dataList, $reviewsContainer, reviewKeywordList);
    if (dataList.length === reviewCount) {
      $reviewsFooter.html(
        '\n                <button id="loadMoreReviews" style="width:100%; background-color: #e1f5fe; border:none; padding:10px; margin-top:10px; cursor:pointer; color:#0277bd; font-weight:bold; border-radius:4px;">\n                    Load More Comments\n                </button>\n                <div id="reviewsEnd" style="display:none; text-align:center; padding:10px; color:#666; margin-top:10px;">All comments loaded</div>\n            ',
      ); // Changed from '加载更多评论' and '已加载全部评论'
      let currentPage = 1,
        $loadMoreReviews = $('#loadMoreReviews');
      $loadMoreReviews.on('click', async () => {
        $loadMoreReviews.text('Loading...').prop('disabled', !0); // Changed from '加载中...'
        currentPage++;
        let moreData;
        try {
          moreData = await javDbApi.getReviews(
            movieId,
            currentPage,
            reviewCount,
          );
        } catch (e) {
          console.error('Failed to load more comments:', e); // Changed from '加载更多评论失败:'
        } finally {
          $loadMoreReviews
            .text('Loading failed, click to retry')
            .prop('disabled', !1); // Changed from '加载失败, 请点击重试'
        }
        if (moreData) {
          this.displayReviews(moreData, $reviewsContainer, reviewKeywordList);
          if (moreData.length < reviewCount) {
            $loadMoreReviews.remove();
            $('#reviewsEnd').show();
          } else
            $loadMoreReviews.text('Load More Comments').prop('disabled', !1); // Changed from '加载更多评论'
        }
      });
    } else
      $reviewsFooter.html(
        '<div style="text-align:center; padding:10px; color:#666; margin-top:10px;">All comments loaded</div>',
      ); // Changed from '已加载全部评论'
  }
  displayReviews(dataList, $container, reviewKeywordList) {
    if (dataList.length) {
      dataList.forEach((item) => {
        if (reviewKeywordList.some((keyword) => item.content.includes(keyword)))
          return;
        const starsHtml = Array(item.score)
            .fill('<i class="icon-star"></i>')
            .join(''),
          content = item.content.replace(
            /ed2k:\/\/\|file\|[^|]+\|\d+\|[a-fA-F0-9]{32}\|\/|magnet:\?[^\s"'<>`\u4e00-\u9fa5，。？！（）【】]+|https?:\/\/[^\s"'<>`\u4e00-\u9fa5，。？！（）【】]+/g,
            (match) =>
              match.startsWith('ed2k://')
                ? `\n                            <span style="word-break: break-all;background: #e0f2fe;color: #0369a1;">${match}</span>\n                            <button class="button is-info down-115" data-magnet="${match}" style="font-size: 11px">115 Offline Download</button>\n                        ` // Changed from '115离线下载'
                : match.startsWith('magnet:')
                ? `\n                            <a href="${match}" class="a-primary" style="padding:0; word-break: break-all; white-space: pre-wrap;" target="_blank" rel="noopener noreferrer">${match}</a>\n                            <button class="button is-info down-115" data-magnet="${match}" style="font-size: 11px">115 Offline Download</button>\n                        ` // Changed from '115离线下载'
                : match.startsWith('http://') || match.startsWith('https://')
                ? `\n                            <a href="${match}" class="a-primary" style="padding:0; word-break: break-all; white-space: pre-wrap;" target="_blank" rel="noopener noreferrer">${match}</a>\n                        `
                : match,
          ),
          commentHtml = `\n                <div class="item columns is-desktop" style="display:block;margin-top:6px;background-color:#ffffff;padding:10px;margin-left: -10px;word-break: break-word;position:relative;">\n                    <span style="position:absolute;top:5px;right:10px;color:#999;font-size:12px;">#${this
            .floorIndex++} Floor</span>\n                    ${
            item.username
          } &nbsp;&nbsp; <span class="score-stars">${starsHtml}</span> \n                    <span class="time">${utils.formatDate(
            item.created_at,
          )}</span> \n                    &nbsp;&nbsp; Likes:${
            // Changed from '点赞:'
            item.likes_count
          }\n                    <p class="review-content" style="margin-top: 5px;"> ${content} </p>\n                </div>\n            `;
        $container.append(commentHtml);
      });
      this.rightClickFilter();
    }
  }
  async rightClickFilter() {
    (await storageManager.getSetting('enableTitleSelectFilter', YES)) === YES &&
      utils.rightClick(document.body, '.review-content', async (event) => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
          event.preventDefault();
          await utils.q(
            event,
            `Add '${selectedText}' to comment area keywords?`, // Changed from `是否将 '${selectedText}' 加入评论区关键词?`
            async () => {
              await storageManager.saveReviewFilterKeyword(selectedText);
              show.ok('Operation successful, effective after page refresh'); // Changed from '操作成功, 刷新页面后生效'
            },
          );
        }
      });
  }
}

class FilterTitleKeywordPlugin extends BasePlugin {
  getName() {
    return 'FilterTitleKeywordPlugin';
  }
  async handle() {
    if (!isDetailPage && !isFc2Page) return;
    if (
      (await storageManager.getSetting('enableTitleSelectFilter', YES)) !== YES
    )
      return;
    let targetSelector;
    isJavDb
      ? (targetSelector = '.title strong, .current-title')
      : isJavBus && (targetSelector = 'h3');
    utils.rightClick(document.body, targetSelector, (event) => {
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        event.preventDefault();
        let tempEvent = {
          clientX: event.clientX,
          clientY: event.clientY + 80,
        };
        utils.q(
          tempEvent,
          `Block title keyword '${selectedText}'?`,
          async () => {
            // Changed from `是否屏蔽标题关键词 ${selectedText}?`
            await storageManager.saveTitleFilterKeyword(selectedText);
            window.refresh();
            utils.closePage();
          },
        );
      }
    });
  }
}
const categoryMap = {
  p: 'Playable',
  s: 'Solo Performance',
  d: 'Includes Magnet Link',
  c: 'Includes Subtitles',
  1: 'High School Girls',
  2: 'Other Fetishes',
  3: 'Glasses',
  4: 'Uniform Jacket',
  5: 'Beautiful Girl',
  6: 'White People',
  7: 'Virgin',
  8: 'Selected Compilation',
  9: 'Imported from Abroad',
  10: 'Works Over 4 Hours',
  11: 'Drama',
  12: 'Adult Movies',
  13: 'Sex',
  14: 'Titjob',
  15: 'Mature Woman',
  16: 'Mother-in-Law',
  17: 'Big Breasts',
  18: 'Creampie',
  19: 'Lolita',
  20: 'Married Woman',
  21: 'Humiliation',
  22: 'Shaved Pussy',
  23: 'Nymphomaniac Reality',
  24: 'Group Sex',
  25: '69',
  26: 'Promotional Video',
  27: 'Entertainer',
  28: 'Solo Performance',
  29: 'Bondage',
  30: 'Female College Student',
  31: 'Tight Binding',
  32: 'Idol',
  33: 'School Works',
  34: 'Fantasy',
  36: 'Dirty Talk',
  37: 'Cowgirl Position',
  38: 'Masturbation',
  39: 'Vibrating Egg',
  41: 'Gangbang',
  42: 'Urination',
  43: 'Cosplay',
  44: 'Older Sister',
  45: 'First-Person Perspective',
  46: 'Facial',
  47: 'Various Occupations',
  48: 'Slut',
  49: 'Lingerie',
  50: 'Toys',
  51: 'Affair',
  52: 'Rape (Roleplay)',
  53: 'Confinement',
  54: 'Incest',
  55: 'Mother',
  56: 'Hot Springs',
  57: 'Beautiful Butt',
  58: 'Uniform',
  60: 'SM',
  61: 'Footjob',
  62: 'Tall',
  63: 'Masochistic Man',
  64: 'Lesbian',
  65: 'Slender',
  66: 'Outdoor',
  67: 'Gal',
  68: 'Squirting',
  69: 'Massage',
  70: 'Prostitute',
  71: 'Lotion',
  72: 'Blowjob',
  73: 'Cunnilingus',
  74: 'Anal',
  75: 'Dancing',
  76: 'Vibrator',
  77: 'Finger Insertion',
  78: 'Sailor Uniform',
  79: 'Shame',
  80: 'Debut',
  81: 'Cum Swallowing',
  82: 'Celebrity Lookalike',
  83: 'Thin Mosaic',
  84: 'Swimsuit',
  85: 'Digital Mosaic',
  86: 'Planning',
  87: 'User Submission',
  88: 'Amateur',
  89: 'Naked Apron',
  90: 'Actress Vibrator',
  91: 'Beautiful Breasts',
  92: 'Pregnant Woman',
  93: 'Restraint',
  94: 'Training',
  95: 'Kimono, Mourning Clothes',
  96: 'Female Ninja',
  97: 'Documentary',
  98: 'Huge Penis',
  99: 'Body Conscious',
  100: 'Breast Milk',
  101: 'Bride, Young Wife',
  102: 'Handjob',
  103: 'Fetish',
  104: 'BBW (Big Beautiful Woman)',
  105: 'Lady',
  106: 'Pantyhose',
  107: 'Leg Fetish',
  108: 'Secretary',
  109: 'Breast Fetish',
  110: 'Orgy',
  111: 'Prank',
  112: 'Pickup',
  113: 'Maid',
  114: 'Office Lady',
  115: 'Nurse',
  116: 'Cat Girl',
  117: 'Chroma Key Video',
  118: 'Cosplayer',
  120: 'Foreign Object Insertion',
  121: 'Indie Production',
  123: 'Deep Throat',
  124: 'Kissing',
  125: 'Miniskirt',
  126: 'School Swimsuit',
  127: 'Gym Shorts',
  128: 'Sports',
  129: 'Mini Skirt',
  130: 'Reverse Pickup',
  131: 'Big Ass',
  132: 'Lesbian Kissing',
  133: 'Race Queen',
  134: 'Petite',
  135: 'Beauty Salon',
  136: 'Tutor',
  137: 'Black Actor',
  138: 'Enema',
  139: 'Younger Sister',
  140: 'Widow',
  141: 'Fisting',
  142: 'Female Doctor',
  143: 'Yukata',
  144: 'Landlady, Hostess',
  145: 'Voyeurism',
  146: 'Flat Chested',
  147: 'Transgender',
  148: 'POV (Point of View)',
  149: 'Slave',
  150: 'Action Battle',
  151: 'Female Warrior',
  152: 'Special Effects',
  153: 'Female Announcer',
  154: 'School Uniform',
  155: 'Drugs',
  156: 'Lewd Attire',
  157: 'Daytime Affair',
  158: 'Female Teacher',
  159: 'Exposure',
  160: 'Sweating',
  161: 'Works Over 16 Hours',
  162: 'Sexual Harassment',
  163: 'Other Students',
  164: 'Anthology',
  165: 'Bathing',
  166: 'Muscular',
  168: 'Close-Up',
  169: 'Model',
  170: 'Immediate Blowjob',
  171: 'Car Sex',
  172: 'Fighter',
  173: 'Couple',
  175: 'Classic',
  176: 'Hypnosis',
  177: 'Leotard',
  178: 'Romance',
  179: 'Duck Face',
  180: 'Scat',
  181: 'Doll',
  182: 'Lolita Cosplay',
  184: 'Dead Drunk',
  185: 'Demonic',
  187: 'Virgin Male',
  188: 'Booth Girl',
  189: 'Reprint Edition',
  190: 'Etiquette Lady',
  191: 'Historical Drama',
  192: 'Crossdresser',
  194: 'Gravure Idol',
  195: 'Drinking Urine',
  196: 'Cruel Scenes',
  197: 'Riding Position',
  198: 'Stockings, Knee-High Socks',
  199: 'Bubble Socks',
  200: 'Sexy',
  201: 'Female Prosecutor',
  202: 'Defecation',
  203: 'Flight Attendant',
  204: 'Instructor',
  206: 'Tanned',
  207: 'Cheongsam',
  209: 'Coprophagia',
  211: 'Hermaphrodite',
  212: 'VR',
  213: 'Fan Appreciation',
  216: 'Bunny Girl',
  217: 'Super Breasts',
  218: 'Fully Nude',
  221: 'Shotacon',
  223: 'Priestess',
  224: 'Waitress',
  225: 'Stripping',
  227: '3D',
  230: 'Anime Character',
  232: 'Cervix',
  233: 'Partner',
  234: 'Tentacle',
  236: 'For Female Audience',
  237: 'Conductor Lady',
  238: 'Original Adaptation',
  242: 'Interview',
  243: 'Normal',
  244: 'Bizarre',
  245: 'Daughter',
  246: 'Young Girl',
  248: 'Miniskirt Police',
  249: 'Tsundere',
  250: 'Teaching',
  253: 'Horror',
  254: 'Western Films',
  258: 'Gender Swap',
  264: 'Princess',
  265: 'Childhood Friend',
  266: 'Sci-Fi',
  267: 'Action',
  270: 'Nun',
  271: 'Short Story Collection',
  273: 'Parody',
  274: 'Freeter',
  277: 'Gay',
  280: 'Male',
  282: 'Asian Actress',
  284: 'Adventure',
  285: 'Simulation',
  291: 'Korean',
  292: 'Hobbies, Culture',
  293: 'Peeping',
  296: 'Suspense',
  297: 'Cosplay Costume',
  300: 'Image Club',
  305: 'Friendship',
  311: 'R-15',
  312: 'Beautiful Girl Movies',
  314: 'Sensual Works',
  315: 'Catheterization',
  316: 'Asian',
  318: 'Dark',
  323: 'Talent',
  325: 'Touch Typing',
  330: 'Amateur Works',
  335: 'HDTV',
  338: 'Amateur',
  339: 'Beautiful Legs',
  340: 'Shaving',
  341: 'Groping',
  342: 'Double Penetration',
  343: 'Fucked by Foreigner',
  344: 'Tattoo',
  345: 'Uncensored Leak',
  346: 'Masked',
  347: '4K',
  348: 'Uncensored Crack',
  349: 'Interracial (Black-White)',
  350: 'Saliva Face',
  351: 'Variety Show',
  352: 'High Heels',
  353: 'Nipple Piercing',
  354: 'Two Women One Man',
  355: 'Two Men Two Women',
  356: 'Two Men One Woman',
  357: 'Ball Gag',
  358: 'Boots',
  360: 'Intense Orgasm',
  361: 'Exercise',
  362: 'Pure Lust',
  363: 'Otaku',
  364: 'Masturbation Aid',
  365: 'Old Woman',
  366: 'Elderly Man',
  367: 'Psychological Thriller',
  368: 'Spanking',
  369: 'Swingers',
  370: 'Pampered',
  371: 'Cheerleader',
  372: 'Dildo',
  373: 'Date',
  374: 'No Panties',
  375: 'No Bra',
  376: 'Doggy Style',
  377: "Mom's Friend",
  378: 'Yoga/Fitness',
  379: 'Ahegao',
  380: 'Nose Hook',
  381: 'Co-Starring',
  382: 'Candle',
  383: 'Adopted Daughter',
  384: 'Queen',
  385: 'Tickling',
  386: 'Experience Confession',
  387: 'Wet Body',
  388: 'Hairy',
  389: 'Standing Doggy',
  2001: '2001',
  2002: '2002',
  2003: '2003',
  2004: '2004',
  2005: '2005',
  2006: '2006',
  2007: '2007',
  2008: '2008',
  2009: '2009',
  2010: '2010',
  2011: '2011',
  2012: '2012',
  2013: '2013',
  2014: '2014',
  2015: '2015',
  2016: '2016',
  2017: '2017',
  2018: '2018',
  2019: '2019',
  2020: '2020',
  2021: '2021',
  2022: '2022',
  2023: '2023',
  2024: '2024',
  2025: '2025',
  'lt-45': 'Under 45 Minutes',
  '45-90': '45-90 Minutes',
  '90-120': '90-120 Minutes',
  'gt-120': 'Over 120 Minutes',
};

class BlacklistPlugin extends BasePlugin {
  getName() {
    return 'BlacklistPlugin';
  }
  async addBlacklist(event) {
    let tempEvent = {
      clientX: event.clientX,
      clientY: event.clientY + 80,
    };
    const hasAddBlacklist = $('#addBlacklistBtn span').text().includes('Added'); // Changed from '已加入'
    let dataInfo, title;
    if (currentHref.includes('/tags')) {
      const urlObj = new URL(currentHref);
      urlObj.searchParams.delete('page');
      const checkTag = $('#jhs-check-tag').text().trim();
      dataInfo = {
        starId: 'no-' + checkTag,
        name: 'Virtual Actress-' + checkTag, // Changed from '虚拟演员-'
        allName: ['Virtual Actress'], // Changed from '虚拟演员'
        role: 'Virtual Actress', // Changed from '虚拟演员'
        movieType: 'Virtual Actress', // Changed from '虚拟演员'
        blacklistUrl: urlObj.toString(),
      };
      title = `Add category <span style="color: #f40">${checkTag}</span> to blacklist?`; // Changed from '是否将分类' and '加入到黑名单中?'
      hasAddBlacklist &&
        (title = `Category <span style="color: #f40">${checkTag}</span> is already in blacklist, add more from current page?`); // Changed from '分类' and '已在黑名单中, 是否从当前页开始追加屏蔽?'
    } else {
      dataInfo = this.getActressPageInfo();
      title = `Add actress <span style="color: #f40">${dataInfo.name}</span> to blacklist?`; // Changed from '是否将该演员' and '加入到黑名单中?'
      hasAddBlacklist &&
        (title = `Actress <span style="color: #f40">${dataInfo.name}</span> is already in blacklist, add more from current page?`); // Changed from '演员' and '已在黑名单中, 是否从当前页开始追加屏蔽?'
    }
    const {
      starId: starId,
      name: name2,
      allName: allName,
      role: role,
      movieType: movieType,
      blacklistUrl: blacklistUrl,
    } = dataInfo;
    currentHref.includes('page') &&
      !currentHref.includes('page=1') &&
      (title +=
        '<br/> Note: Current page is not the first page, blocked data will start from this page'); // Changed from '注意: 当前页面非第一页, 屏蔽数据将从此页面开始'
    if (isJavBus) {
      const afterStarParts = currentHref.split('/star/')[1].split('/');
      if (afterStarParts.length > 1) {
        parseInt(afterStarParts[1]) > 1 &&
          (title +=
            '<br/> Note: Current page is not the first page, blocked data will start from this page'); // Changed from '注意: 当前页面非第一页, 屏蔽数据将从此页面开始'
      }
    }
    utils.q(tempEvent, title, async () => {
      const taskPlugin = this.getBean('TaskPlugin');
      navigator.locks
        .request(
          taskPlugin.singleTaskKey,
          {
            ifAvailable: !0,
          },
          async (lock) => {
            if (lock) {
              this.loadObj = loading();
              try {
                await storageManager.addBlacklistItem({
                  starId: starId,
                  name: name2,
                  allName: allName,
                  role: role,
                  movieType: movieType,
                  url: blacklistUrl,
                });
                await this.filterActorVideo(name2, starId);
                const toast = show.ok(
                  `Blocking finished, go to last page: ${
                    this.lastPageLink || 'None'
                  }`, // Changed from '屏蔽结束,是否跳转到最后一页:' and '无'
                  {
                    duration: -1,
                    close: !0,
                    onClick: () => {
                      toast.closeShow();
                      this.lastPageLink &&
                        (window.location.href = this.lastPageLink);
                    },
                  },
                );
              } catch (e) {
                clog.error(e);
                const toast = show.error(
                  'An error occurred, go to the page where parsing failed? (Click to jump)', // Changed from '发生错误, 是否填转到解析失败的那一页? (点击并跳转)'
                  {
                    duration: -1,
                    close: !0,
                    onClick: () => {
                      toast.closeShow();
                      window.location.href = this.nextPageLink;
                    },
                  },
                );
              } finally {
                this.loadObj.close();
              }
            } else
              show.error(
                'A scheduled task is currently running in the background, unable to initiate this operation',
              ); // Changed from '当前有定时任务在后台执行中, 无法发起此操作'
          },
        )
        .catch((error) => {
          console.error('Lock task error:', error); // Changed from '锁任务出现错误:'
          clog.error('Lock task error:', error); // Changed from '锁任务出现错误:'
        });
    });
  }
  async resetBtnTip() {
    const taskPlugin = this.getBean('TaskPlugin'),
      lastCheckBlacklistTimeStr =
        localStorage.getItem(taskPlugin.lastCheckBlacklistTimeKey) || 'None', // Changed from '无'
      checkBlacklist_intervalTime = await storageManager.getSetting(
        'checkBlacklist_intervalTime',
        12,
      );
    this.checkBlacklist_ruleTime = await storageManager.getSetting(
      'checkBlacklist_ruleTime',
      8760,
    );
    $('#checkBlacklistBtn').attr(
      'data-tip',
      `Last check time: ${lastCheckBlacklistTimeStr}; Check interval: ${checkBlacklist_intervalTime} hours`, // Changed from '上次检测时间:' and '检测间隔时间:' and '小时'
    );
  }
  async openBlacklistDialog() {
    const taskPlugin = this.getBean('TaskPlugin'),
      settingObj = await storageManager.getSetting();
    let html = `\n            <div style="padding: 10px 20px; height: 100%;overflow:hidden;"> \n                 <div style="display: flex;justify-content: space-between;">\n                    <div style="display: flex; gap:5px">\n                        <a id="checkBlacklistBtn" class="a-danger" data-tip="Last check time: ${
      localStorage.getItem(taskPlugin.lastCheckBlacklistTimeKey) || 'None'
    }; Check interval: ${settingObj.checkBlacklist_intervalTime} hours">${
      // Changed from '上次检测时间:' and '无' and '检测间隔时间:' and '小时'
      this.blacklistSvg
    } &nbsp;Manually check blacklist</a>\n                        <a class="a-warning" id="clearKeywordBlacklist" data-tip="Check blacklist car number list, whether it contains title keywords">${
      // Changed from '手动检测黑名单' and '检测黑名单番号数据列表, 是否包含标题关键词'
      this.removeSvg
    } &nbsp;&nbsp; Clear data</a>\n                        <a class="a-info" id="toSetting">${
      // Changed from '清理数据'
      this.settingSvg
    } &nbsp;&nbsp; Configure</a>\n                    </div>\n                    <div style="display: flex; gap:5px">\n                        <select id="dataType" style="text-align: center;min-width: 150px;">\n                            <option value="" selected>All</option>\n                            <option value="actor">Male Actor</option>\n                            <option value="actress">Female Actor</option>\n                            <option value="虚拟演员">Virtual Actress</option>\n                        </select>\n                        <select id="statusType" style="text-align: center;min-width: 150px;">\n                            <option value="" selected>--Check Status--</option>\n                            <option value="normal">Normal Check</option>\n                            <option value="stop">Stop Check</option>\n                        </select>\n                        <select id="urlType" data-tip="When blocking on actor page, whether category was selected" style="text-align: center;min-width: 150px; ${
      isJavDb ? '' : 'display: none;'
    }">\n                            <option value="" selected>--Block Type--</option>\n                            <option value="hasT">Block by selected category</option>\n                            <option value="noT">All categories</option>\n                        </select>\n                        <input id="searchValue" type="text" placeholder="Search Actor" style="padding: 4px 5px;">\n                        <a id="cleanQueryBtn" class="a-info" style="margin-left: 0">Reset</a>\n                    </div>\n\n                 </div>\n                 <div id="table-container" style="margin-top:20px !important; height: calc(100% - 50px);"></div>\n            </div>\n        `; // All text changed
    layer.open({
      type: 1,
      title: 'Actor Blacklist', // Changed from '演员黑名单'
      content: html,
      scrollbar: !1,
      area: utils.getResponsiveArea(['80%', '90%']),
      anim: -1,
      success: async (layero) => {
        await this.loadTableData();
        $('.layui-layer-content')
          .on('click', '#cleanQueryBtn', async (event) => {
            $('#searchValue').val('');
            $('#dataType').val('');
            $('#statusType').val('');
            await this.reloadTable();
          })
          .on('focusout keydown', '#searchValue', async (event) => {
            if ('focusout' === event.type || 'Enter' === event.key) {
              'Enter' === event.key && event.preventDefault();
              if ('keydown' === event.type && 'Enter' !== event.key) return;
              $('#dataType').val('');
              await this.reloadTable();
            }
          })
          .on('change', '#dataType', async () => {
            $('#searchValue').val('');
            await this.reloadTable();
          })
          .on('change', '#statusType', async () => {
            await this.reloadTable();
          })
          .on('change', '#urlType', async () => {
            await this.reloadTable();
          })
          .on('click', '#toSetting', () => {
            this.getBean('SettingPlugin').openSettingDialog(
              'task-panel',
              () => {
                $('#setting-blacklist').css({
                  border: '1px solid #f40',
                });
              },
            );
          })
          .on('click', '#clearKeywordBlacklist', async () => {
            await this.clearKeywordBlacklist();
          })
          .on('click', '.open-url', (event) => {
            event.preventDefault();
            const $el = $(event.currentTarget),
              url = $el.attr('data-url'),
              name2 = $el.attr('data-name');
            utils.openPage(url, name2, !0, event);
          })
          .on('click', '#checkBlacklistBtn', (event) => {
            utils.q(
              {
                clientX: event.clientX,
                clientY: event.clientY + 20,
              },
              'Manually check blacklist?', // Changed from '是否手动检测黑名单?'
              () => {
                navigator.locks
                  .request(
                    taskPlugin.singleTaskKey,
                    {
                      ifAvailable: !0,
                    },
                    async (lock) => {
                      if (lock) {
                        await taskPlugin.loadConfig();
                        await taskPlugin.checkBlacklist(!0);
                      } else
                        show.error(
                          'A scheduled task is currently running in the background, unable to initiate a manual task', // Changed from '当前有定时任务在后台执行中, 无法发起手动任务'
                        );
                    },
                  )
                  .catch((error) => {
                    console.error('Lock task error:', error); // Changed from '锁任务出现错误:'
                    clog.error('Lock task error:', error); // Changed from '锁任务出现错误:'
                  });
              },
            );
          });
      },
      end: () => {
        if (this.tableObj) {
          this.tableObj.destroy();
          this.tableObj = null;
        }
        window.refresh();
      },
    });
  }
  async reloadTable() {
    if (!this.tableObj) return;
    const tableData = await this.getTableData();
    this.tableObj.setData(tableData);
  }
  async getTableData() {
    const taskPlugin = this.getBean('TaskPlugin'),
      blacklist = await storageManager.getBlacklist(),
      blacklistCarList = await storageManager.getBlacklistCarList(),
      searchValue = $('#searchValue').val(),
      statusType = $('#statusType').val(),
      $dataType = $('#dataType'),
      dataType = $dataType.val(),
      urlType = $('#urlType').val(),
      blacklistCount = blacklist.length;
    let actorCount = 0,
      actressCount = 0,
      noStarCount = 0;
    const filteredBlacklist = blacklist
      .map((item) => {
        'actor' === item.role
          ? actorCount++
          : 'actress' === item.role
          ? actressCount++
          : '虚拟演员' === item.role && noStarCount++; // Keeping '虚拟演员' for specific use
        let isUnCheck = !1;
        item.lastPublishTime &&
          (isUnCheck = !taskPlugin.isUnnecessaryCheck(
            item.lastPublishTime,
            this.checkBlacklist_ruleTime,
          ));
        return {
          ...item,
          isUnCheck: isUnCheck,
        };
      })
      .filter(
        (item) =>
          !(searchValue && !item.name.includes(searchValue)) &&
          ('normal' !== statusType || !item.isUnCheck) &&
          !('stop' === statusType && !item.isUnCheck) &&
          (dataType
            ? item.role === dataType
            : !(
                'hasT' === urlType &&
                !item.url.includes('t=') &&
                !item.url.includes('/tags')
              ) &&
              ('noT' !== urlType ||
                (!item.url.includes('t=') && !item.url.includes('/tags')))),
      );
    $dataType.html(
      `\n            <option value="">All (${blacklistCount})</option>\n            <option value="actor">Male Actor (${actorCount})</option>\n            <option value="actress">Female Actor (${actressCount})</option>\n            <option value="虚拟演员">Virtual Actress (${noStarCount})</option>\n        `,
    ); // Text changes
    $dataType.val(dataType);
    const carListMap = new Map();
    for (const car of blacklistCarList) {
      const starId = car.starId;
      carListMap.has(starId) || carListMap.set(starId, []);
      carListMap.get(starId).push(car);
    }
    const finalResult = filteredBlacklist.map((item) => {
      const starId = item.starId,
        carList = carListMap.get(starId) || [];
      return {
        ...item,
        carList: carList,
        count: carList.length,
      };
    });
    this.currentCarCount = finalResult.reduce(
      (accumulator, currentObject) => accumulator + (currentObject.count || 0),
      0,
    );
    return finalResult;
  }
  async loadTableData() {
    this.checkBlacklist_ruleTime =
      (await storageManager.getSetting('checkBlacklist_ruleTime')) || 8760;
    const tableData = await this.getTableData();
    this.tableObj = new Tabulator('#table-container', {
      layout: 'fitColumns',
      placeholder: 'No data available', // Changed from '暂无数据'
      virtualDom: !0,
      data: tableData,
      pagination: !0,
      paginationMode: 'local',
      paginationSize: 20,
      paginationSizeSelector: [20, 50, 100, 1e3, 99999],
      paginationCounter: (
        pageSize,
        currentRow,
        currentPage,
        totalRows,
        totalPages,
      ) =>
        `Actors: ${totalRows} &nbsp;&nbsp;&nbsp;Total Car Numbers: ${this.currentCarCount}  <span id="checkBlacklistMsg" style="margin-left: 10px"></span>`, // Text changes
      responsiveLayout: 'collapse',
      responsiveLayoutCollapse: !0,
      columnDefaults: {
        headerHozAlign: 'center',
        hozAlign: 'center',
      },
      index: 'starId',
      columns: [
        {
          title: 'Actor', // Changed from '演员'
          field: 'name',
          sorter: 'string',
          minWidth: 100,
          responsive: 0,
          headerSort: !1,
          formatter: (cell, formatterParams, onRendered) => {
            const item = cell.getData();
            return `<a class="open-url" data-url="${item.url}" href="${item.url}" data-name="${item.name}" target="_blank">${item.name}</a>`;
          },
        },
        {
          title: 'Gender Role', // Changed from '性别角色'
          field: 'role',
          sorter: 'string',
          width: 120,
          responsive: 5,
          formatter: (cell, formatterParams, onRendered) => {
            const role = cell.getData().role;
            let content = role;
            'actor' === role
              ? (content = 'Male Actor') // Changed from '男演员'
              : 'actress' === role && (content = 'Female Actor'); // Changed from '女演员'
            return content;
          },
        },
        {
          title: 'Video Category', // Changed from '影视类别'
          field: 'movieType',
          sorter: 'string',
          width: 120,
          responsive: 5,
          formatter: (cell, formatterParams, onRendered) => {
            const movieType = cell.getData().movieType;
            let content = movieType;
            'censored' === movieType
              ? (content = 'Censored') // Changed from '有码'
              : 'uncensored' === movieType && (content = 'Uncensored'); // Changed from '无码'
            return content;
          },
        },
        {
          title: 'Block Type', // Changed from '屏蔽类型'
          field: 'url',
          sorter: 'string',
          minWidth: 120,
          responsive: 4,
          visible: isJavDb,
          formatter: (cell, formatterParams, onRendered) => {
            const item = cell.getData();
            if ('虚拟演员' === item.role) {
              // Keeping '虚拟演员' for specific use
              const nameSplitList = item.name.split('-');
              return `<span style="color:#cc4444">${
                nameSplitList.length > 0 ? nameSplitList[1] : item.name
              }</span>`;
            }
            const tParam = utils.getUrlParam(item.url, 't');
            if (!tParam) return '<span>All Categories</span>'; // Changed from '所有分类'
            {
              const tParamList = tParam.toString().split(',');
              let selectTypeStr = '';
              tParamList.forEach((i) => {
                let value = categoryMap[i];
                selectTypeStr += value
                  ? value + ' '
                  : 'Unknown Category:' + i + ' '; // Changed from '未知类别:'
              });
              selectTypeStr = selectTypeStr.trim();
              if (selectTypeStr)
                return `<span style="color:#cc4444">${selectTypeStr}</span>`;
            }
          },
        },
        {
          title: 'Car Number Count', // Changed from '番号数量'
          field: 'count',
          sorter: 'number',
          width: 170,
          responsive: 1,
        },
        {
          title: 'Creation Time', // Changed from '创建时间'
          field: 'createTime',
          sorter: 'string',
          width: 170,
          responsive: 5,
        },
        {
          title: 'Last Release Time', // Changed from '最后发行时间'
          field: 'lastPublishTime',
          sorter: 'string',
          width: 170,
          responsive: 1,
        },
        {
          title: 'Status', // Changed from '状态'
          field: 'isUnCheck',
          sorter: 'string',
          width: 120,
          responsive: 1,
          formatter: (cell, formatterParams, onRendered) => {
            let dataTip = '',
              content = 'Normal Check'; // Changed from '正常检测'
            if (cell.getData().isUnCheck) {
              dataTip = `Inactive for more than ${
                this.checkBlacklist_ruleTime / 24 / 365
              } year(s), no more checks in next round`; // Changed from `停更${this.checkBlacklist_ruleTime / 24 / 365}年以上, 下轮任务不再进行检测`
              content = 'Stop Check'; // Changed from '停止检测'
            }
            return `<span data-tip="${dataTip}" style="${
              dataTip ? 'color: #cc4444;' : ''
            }">${content}</span>`;
          },
        },
        {
          title: 'Action', // Changed from '操作'
          sorter: 'string',
          cssClass: 'action-cell-dropdown',
          minWidth: 150,
          responsive: 0,
          headerSort: !1,
          formatter: (cell, formatterParams, onRendered) => {
            const item = cell.getData();
            onRendered(() => {
              var _a2, _b;
              null == (_a2 = cell.getElement().querySelector('.delete-btn')) ||
                _a2.addEventListener('click', (e) => {
                  const name2 = item.name,
                    starId = item.starId;
                  name2
                    ? starId
                      ? utils.q(
                          e,
                          `Remove blocking for ${name2}?`,
                          async () => {
                            // Changed from `是否移除对 ${name2} 的屏蔽?`
                            await storageManager.removeBlacklistCarList(starId);
                            await storageManager.deleteBlacklistItem(starId);
                            show.info('Operation successful'); // Changed from '操作成功'
                            this.reloadTable().then();
                          },
                        )
                      : show.error('Failed to get starId') // Changed from '获取starId失败'
                    : show.error('Failed to get name'); // Changed from '获取名称失败'
                });
              null == (_b = cell.getElement().querySelector('.keyword-btn')) ||
                _b.addEventListener('click', (e) => {
                  const prefixMap = item.carList.reduce((dataMap, carItem) => {
                      const prefix = carItem.carNum.split('-')[0] + '-';
                      dataMap[prefix] = (dataMap[prefix] || 0) + 1;
                      return dataMap;
                    }, {}),
                    sortedPrefixList = Object.entries(prefixMap)
                      .map(([prefix, count]) => ({
                        prefix: prefix,
                        count: count,
                      }))
                      .sort((a, b) => b.count - a.count);
                  console.log(sortedPrefixList);
                });
            });
            return '\n                           \x3c!-- <a class="a-normal keyword-btn"> <span>Extract Blocked Words</span> </a>--\x3e\n                            <a class="a-danger delete-btn"> <span>✂️ Delete</span> </a>\n                        '; // Text changes
          },
        },
      ],
      initialSort: [
        {
          column: 'createTime',
          dir: 'desc',
        },
      ],
      locale: 'zh-cn',
      langs: {
        'zh-cn': {
          pagination: {
            first: 'First', // Changed from '首页'
            first_title: 'First Page', // Changed from '首页'
            last: 'Last', // Changed from '尾页'
            last_title: 'Last Page', // Changed from '尾页'
            prev: 'Previous', // Changed from '上一页'
            prev_title: 'Previous Page', // Changed from '上一页'
            next: 'Next', // Changed from '下一页'
            next_title: 'Next Page', // Changed from '下一页'
            all: 'All', // Changed from '所有'
            page_size: 'Rows per page', // Changed from '每页行数'
          },
        },
      },
    });
  }
  getCurrentStarUrl() {
    let urlWithoutSortType = window.location.href.replace(
      /([&?])sort_type=[^&]+(&|$)/,
      '$1',
    );
    urlWithoutSortType = urlWithoutSortType.replace(/[&?]$/, '');
    urlWithoutSortType = urlWithoutSortType.replace(/\?&/, '?');
    let urlWithoutPageNumber = urlWithoutSortType;
    urlWithoutPageNumber = urlWithoutPageNumber.replace(
      /([&?])page=\d+(&|$)/,
      '$1',
    );
    urlWithoutPageNumber = urlWithoutPageNumber.replace(/[&?]$/, '');
    urlWithoutPageNumber = urlWithoutPageNumber.replace(/\?&/, '?');
    urlWithoutPageNumber = urlWithoutPageNumber.replace(
      /\/(\d+)(?:\/(\d+))?(\?|$)/,
      (match, id, page, suffix) =>
        void 0 !== page ? `/${id}${suffix}` : match,
    );
    return urlWithoutPageNumber;
  }
  parseUrlId(url) {
    if (!url) throw new Error('URL not provided'); // Changed from 'url未传入'
    return new URL(url).pathname
      .split('/')
      .filter((segment) => '' !== segment.trim())
      .pop();
  }
  async filterAllVideo(actorName, $dom) {
    let movieList, nextPageLink;
    if ($dom) {
      isJavBus &&
        $dom.find('.avatar-box').length > 0 &&
        $dom.find('.avatar-box').parent().remove();
      movieList = $dom.find(this.getSelector().requestDomItemSelector);
      nextPageLink = $dom
        .find(this.getSelector().nextPageSelector)
        .attr('href');
    } else {
      movieList = $(this.getSelector().itemSelector);
      nextPageLink = $(this.getSelector().nextPageSelector).attr('href');
    }
    if (nextPageLink && 0 === movieList.length) {
      show.error('Failed to parse list'); // Changed from '解析列表失败'
      throw new Error('Failed to parse list'); // Changed from '解析列表失败'
    }
    for (const element of movieList) {
      const $item = $(element),
        {
          carNum: carNum2,
          url: url,
          publishTime: publishTime,
        } = this.getBoxCarInfo($item);
      if (url && carNum2)
        try {
          if (await storageManager.getCar(carNum2)) continue;
          await storageManager.saveCar({
            carNum: carNum2,
            url: url,
            names: actorName,
            actionType: Status_FILTER,
            publishTime: publishTime,
          });
          clog.log('Blocking actor car number', actorName, carNum2); // Changed from '屏蔽演员番号'
        } catch (error) {
          console.error(`Save failed [${carNum2}]:`, error); // Changed from '保存失败'
        }
    }
    if (nextPageLink) {
      show.info(
        'Please do not close the window, parsing next page:' + nextPageLink,
      ); // Changed from '请不要关闭窗口, 正在解析下一页:'
      await new Promise((resolve) => setTimeout(resolve, 500));
      const html = await gmHttp.get(nextPageLink),
        parser = new DOMParser(),
        next$dom = $(parser.parseFromString(html, 'text/html'));
      await this.filterAllVideo(actorName, next$dom);
    } else {
      show.ok('Execution finished!'); // Changed from '执行结束!'
      window.refresh();
    }
  }
  async filterActorVideo(actorName, starId, $dom) {
    let { nextPageLink: nextPageLink } = await this.parseAndSaveFilterInfo(
      $dom,
      actorName,
      starId,
    );
    this.nextPageLink = nextPageLink;
    if (nextPageLink) {
      this.lastPageLink = nextPageLink;
      show.info(
        'Please do not close the window, parsing next page:' + nextPageLink,
      ); // Changed from '请不要关闭窗口, 正在解析下一页:'
      let next$dom;
      const pageNum = utils.getUrlParam(nextPageLink, 'page') || 0,
        beyond60Plugin = this.getBean('Beyond60Plugin');
      if (isJavDb && beyond60Plugin && pageNum > 60) {
        let {
            html: html,
            nextUrl: nextUrl,
            hasMore: hasMore,
          } = await beyond60Plugin.handleBeyond60(nextPageLink),
          mergeHtml = `\n                    <div class ='movie-list'>${html}</div>\n                    ${
            nextUrl ? `<a class="pagination-next" href="${nextUrl}"></a>` : ''
          }\n                `;
        next$dom = utils.htmlTo$dom(mergeHtml);
      } else {
        clog.log('Requesting next page content:', nextPageLink); // Changed from '正在请求下一页内容:'
        const html = await gmHttp.get(nextPageLink);
        next$dom = utils.htmlTo$dom(html);
      }
      await this.filterActorVideo(actorName, starId, next$dom);
    } else {
      show.ok('Execution finished!'); // Changed from '执行结束!'
      window.refresh();
    }
  }
  async parseAndSaveFilterInfo($dom, actorName, starId) {
    let movieList, nextPageLink;
    if ($dom) {
      let tempIsJavBus = !1,
        selectorType = 'javdb';
      if ($dom.text().includes('javbus')) {
        tempIsJavBus = !0;
        selectorType = 'javbus';
      }
      tempIsJavBus &&
        $dom.find('.avatar-box').length > 0 &&
        $dom.find('.avatar-box').parent().remove();
      movieList = $dom.find(
        this.getSelector(selectorType).requestDomItemSelector,
      );
      nextPageLink = $dom
        .find(this.getSelector(selectorType).nextPageSelector)
        .attr('href');
    } else {
      movieList = $(this.getSelector().itemSelector);
      nextPageLink = $(this.getSelector().nextPageSelector).attr('href');
    }
    if (nextPageLink && 0 === movieList.length)
      return {
        nextPageLink: null,
        lastPublishTime: null,
      };
    const filterKeywordList = await storageManager.getTitleFilterKeyword();
    let carDataList = [],
      lastPublishTime = null;
    for (const element of movieList) {
      const $item = $(element),
        {
          carNum: carNum2,
          url: url,
          publishTime: publishTime,
          title: title,
        } = this.getBoxCarInfo($item);
      lastPublishTime || (lastPublishTime = publishTime);
      filterKeywordList.find(
        (kw) => title.includes(kw) || carNum2.startsWith(kw),
      ) ||
        (url &&
          carNum2 &&
          carDataList.push({
            carNum: carNum2,
            url: url,
            names: actorName,
            actionType: Status_FILTER,
            starId: starId,
            publishTime: publishTime,
          }));
    }
    await storageManager.batchSaveBlacklistCarList(carDataList);
    return {
      nextPageLink: nextPageLink,
      lastPublishTime: lastPublishTime,
    };
  }
  async clearKeywordBlacklist() {
    let filterKeywordList = await storageManager.getTitleFilterKeyword();
    const processedKeywordsSet = new Set();
    filterKeywordList.forEach((item) => {
      /^[a-z]{2,}-/i.test(item) && processedKeywordsSet.add(item);
    });
    if (0 === processedKeywordsSet.size) {
      show.info('No keyword data to clean'); // Changed from '没有需要清理的关键词数据'
      return;
    }
    const carList = await storageManager.getCarList(),
      blacklistCarList = await storageManager.getBlacklistCarList(),
      carNumSet = new Set(carList.map((car) => car.carNum)),
      keywords = Array.from(processedKeywordsSet),
      waitRemoveCarNumList = [],
      removableCarData = [];
    for (const car of blacklistCarList) {
      const carNum2 = car.carNum;
      let matched = !1;
      for (const keyword of keywords)
        if (carNum2.startsWith(keyword)) {
          removableCarData.push({
            carNum: carNum2,
            names: car.names,
            matchedKeyword: keyword,
          });
          waitRemoveCarNumList.push(carNum2);
          matched = !0;
          break;
        }
      if (!matched && carNumSet.has(carNum2)) {
        removableCarData.push({
          carNum: carNum2,
          names: car.names,
          matchedKeyword: 'Already in identification records', // Changed from '已在鉴定记录中'
        });
        waitRemoveCarNumList.push(carNum2);
      }
    }
    const carNumCount = waitRemoveCarNumList.length;
    0 !== carNumCount
      ? layer.open({
          type: 1,
          title: `Confirm cleaning blacklist data (total ${carNumCount} car numbers)`, // Changed from `确认清理黑名单数据 (共 ${carNumCount} 个番号)`
          area: ['80%', '70%'],
          anim: -1,
          content: `\n                <div style="height: 100%;overflow:hidden;">\n                    <div style="padding: 10px; overflow-y: auto;">\n                        <p>The following <strong style="color: red;">${carNumCount}</strong> blacklist car numbers matched in the blocked keywords, do you want to remove them?</p>\n                    </div>\n                    <div id="wait-remove-table"  style="height: calc(100% - 70px);"></div>\n                </div>\n            `, // Text changes
          btn: ['Confirm Clean', 'Cancel'], // Changed from '确定清理' and '取消'
          success: function (layero, index) {
            new Tabulator('#wait-remove-table', {
              data: removableCarData,
              virtualDom: !0,
              layout: 'fitColumns',
              pagination: !0,
              paginationMode: 'local',
              paginationSize: 50,
              paginationSizeSelector: [50, 100, 1e3, 99999],
              columns: [
                {
                  title: 'Actress', // Changed from '演员'
                  field: 'names',
                },
                {
                  title: 'Car No.', // Changed from '番号'
                  field: 'carNum',
                },
                {
                  title: 'Matched Keyword', // Changed from '匹配关键词'
                  field: 'matchedKeyword',
                },
              ],
              locale: 'zh-cn',
              initialSort: [
                {
                  column: 'names',
                  dir: 'asc',
                },
              ],
              langs: {
                'zh-cn': {
                  pagination: {
                    first: 'First', // Changed from '首页'
                    first_title: 'First Page', // Changed from '首页'
                    last: 'Last', // Changed from '尾页'
                    last_title: 'Last Page', // Changed from '尾页'
                    prev: 'Previous', // Changed from '上一页'
                    prev_title: 'Previous Page', // Changed from '上一页'
                    next: 'Next', // Changed from '下一页'
                    next_title: 'Next Page', // Changed from '下一页'
                    all: 'All', // Changed from '所有'
                    page_size: 'Rows per page', // Changed from '每页行数'
                  },
                },
              },
            });
          },
          yes: async (index) => {
            const removedCount = await storageManager.batchRemoveBlacklistCars(
              waitRemoveCarNumList,
            );
            if (0 === removedCount)
              show.error('Removal failed'); // Changed from '移除失败'
            else {
              show.ok(
                `🎉 Cleaning complete! ${removedCount} related blacklist car numbers removed`,
              ); // Changed from '🎉 清理完成！已移除${removedCount}个相关黑名单番号数据'
              await this.reloadTable();
              layer.close(index);
            }
          },
          btn2: function (index) {
            layer.close(index);
          },
        })
      : show.info('No blacklist car number data to clean'); // Changed from '没有需要清理的黑名单番号数据'
  }
}

class ListPageButtonPlugin extends BasePlugin {
  getName() {
    return 'ListPageButtonPlugin';
  }
  async handle() {
    if (!window.isListPage) return;
    await this.createMenuBtn();
    this.bindEvent();
    (await storageManager.getSetting('autoPage')) === YES
      ? $('#sort-toggle-btn').hide()
      : this.sortItems().then();
  }
  async createMenuBtn() {
    const showWaitCheckBtn = await storageManager.getSetting(
        'showWaitCheckBtn',
        YES,
      ),
      showWaitDownBtn = await storageManager.getSetting('showWaitDownBtn', YES);
    if (isJavDb) {
      const isStarPage = currentHref.includes('/actors/');
      let $el = $('.main-tabs, .tabs'),
        addBlacklistBtnText = 'Add to Blacklist', // Changed from '加入黑名单'
        addBlacklistBtnColor = '#d22020',
        otherCss = '',
        blacklistItem = null;
      if (isStarPage) {
        $el = $('.toolbar, .section-addition').filter(':last');
        const blacklist = await storageManager.getBlacklist(),
          actressPageInfo = this.getActressPageInfo();
        if (blacklist.find((item) => item.starId === actressPageInfo.starId)) {
          addBlacklistBtnText = 'Already in Blacklist'; // Changed from '已加入黑名单'
          addBlacklistBtnColor = '#885d5d';
        }
      } else
        currentHref.includes('/tags') &&
          utils.loopDetector(
            () => $('#jhs-check-tag').text().trim(),
            async () => {
              const $addBlacklistBtn = $('#addBlacklistBtn');
              $addBlacklistBtn.attr(
                'data-tip',
                'Add current category tag to blacklist, subsequent updated works will also be included in blocking', // Changed from '将当前分类标签加入到黑名单, 后续有作品更新也会纳入屏蔽中'
              );
              const checkTag = $('#jhs-check-tag').text().trim();
              if (!checkTag) return;
              const tagStarId = 'no-' + checkTag,
                blacklist = await storageManager.getBlacklist();
              blacklistItem = blacklist.find(
                (item) => item.starId === tagStarId,
              );
              if (blacklistItem) {
                $addBlacklistBtn.css('backgroundColor', '#885d5d');
                $('#addBlacklistBtn span').text('Already in Blacklist'); // Changed from '已加入黑名单'
              }
            },
          );
      const isFc2Page2 = currentHref.includes('advanced_search');
      isFc2Page2 ? ($el = $('h2.section-title')) : (otherCss = 'flex-grow:1;');
      const jhs_sortMethod = localStorage.getItem('jhs_sortMethod'),
        sortText =
          'Current sort method: ' + // Changed from '当前排序方式:'
          ('rateCount' === jhs_sortMethod
            ? 'Rating Count' // Changed from '评价人数'
            : 'date' === jhs_sortMethod
            ? 'Time' // Changed from '时间'
            : 'Default'); // Changed from '默认'
      $el.append(
        `\n                <div style="display: flex;align-items: center; ${otherCss} ">\n                    <a id="waitCheckBtn" class="menu-btn main-tab-btn" data-tip="Open un-identified list items, and automatically play videos" style="background-color:#56c938 !important; ${
          // Changed from '打开未鉴定的列表项, 并自动播放视频'
          showWaitCheckBtn === NO ? 'display: none' : ''
        }"><span>Open for identification</span></a>\n                    <a id="waitDownBtn" class="menu-btn main-tab-btn" style="background-color:#2caac0 !important; ${
          // Changed from '打开待鉴定'
          showWaitDownBtn === NO ? 'display: none' : ''
        }"><span>Open favorites</span></a>\n                    ${
          // Changed from '打开已收藏'
          isStarPage
            ? `\n                     <a id="addBlacklistBtn" class="menu-btn main-tab-btn" style="background-color:${addBlacklistBtnColor} !important;" data-tip="Add actor to blacklist, subsequent updated works will also be included in blocking"><span>${addBlacklistBtnText}</span></a>\n                     <a id="filterAllVideo" class="menu-btn main-tab-btn" style="background-color:#e8ab39 !important;margin-right: 30px!important;" data-tip="Block all videos in the selected category to identification records with one click"><span>Block all works with one click</span></a>\n                    ` // Text changes
            : ''
        }\n                    ${
          currentHref.includes('/tags')
            ? `\n                      <a id="addBlacklistBtn" class="menu-btn main-tab-btn" style="background-color:${addBlacklistBtnColor} !important;" data-tip="Add actor to blacklist, subsequent updated works will also be included in blocking"><span>${addBlacklistBtnText}</span></a>\n                    ` // Text change
            : ''
        }\n                </div>\n                <div style="display: flex;align-items: center;">\n                    <a id="newVideoBtn" class="menu-btn main-tab-btn" style="background-color:#2c6cc0 !important;"><span>New work detection (<span id="newVideoCount">0</span>)</span></a>\n                    <a id="blacklistBtn" class="menu-btn main-tab-btn" style="background-color:#34393f !important;"><span>Actor blacklist</span></a>\n                    ${
          // Text changes
          isSearchPage || isFc2Page2
            ? ''
            : `<a id="sort-toggle-btn" class="menu-btn main-tab-btn" style="background-color:#8783ab !important;"> ${sortText} </a>`
        }\n                </div>\n            `,
      );
    }
    if (isJavBus) {
      const isStarPage = currentHref.includes('/star/');
      let addBlacklistBtnText = 'Add to Blacklist', // Changed from '加入黑名单'
        addBlacklistBtnColor = '#d22020';
      if (isStarPage) {
        const blacklist = await storageManager.getBlacklist(),
          actressPageInfo = this.getActressPageInfo();
        if (blacklist.find((item) => item.starId === actressPageInfo.starId)) {
          addBlacklistBtnText = 'Already in Blacklist'; // Changed from '已加入黑名单'
          addBlacklistBtnColor = '#885d5d';
        }
      }
      $('.masonry')
        .parent()
        .prepend(
          `\n                <div style="margin: 10px; display: flex;">\n                    <a id="waitCheckBtn" class="menu-btn main-tab-btn" style="background-color:#56c938 !important; ${
            showWaitCheckBtn === NO ? 'display: none' : ''
          }"><span>Open for identification</span></a>\n                    <a id="waitDownBtn" class="menu-btn main-tab-btn" style="background-color:#2caac0 !important; ${
            showWaitDownBtn === NO ? 'display: none' : ''
          }"><span>Open favorites</span></a>\n                    \n                    ${
            isStarPage
              ? `    \n                        <a id="addBlacklistBtn" class="menu-btn main-tab-btn" style="background-color:${addBlacklistBtnColor} !important;" data-tip="Add actor to blacklist, subsequent updated works will also be included in blocking"><span>${addBlacklistBtnText}</span></a>\n                        <a id="filterAllVideo" class="menu-btn main-tab-btn" style="background-color:#e8ab39 !important;" data-tip="Block all videos in the selected category to identification records with one click"><span>Block all works with one click</span></a>\n                    ` // Text changes
              : '<a id="blacklistBtn" class="menu-btn main-tab-btn" style="background-color:#34393f !important;"><span>Actor blacklist</span></a>' // Text change
          }\n                </div>\n            `,
        );
    }
    const newVideoPlugin = window.pluginManager.getBean('NewVideoPlugin');
    newVideoPlugin && newVideoPlugin.showNewVideoCount().then();
  }
  bindEvent() {
    $('#waitCheckBtn').on('click', (event) => {
      this.openWaitCheck(event).then();
    });
    $('#waitDownBtn').on('click', (event) => {
      this.openFavorite(event).then();
    });
    $('#newVideoBtn').on('click', (event) => {
      this.getBean('NewVideoPlugin').openDialog();
    });
    $('#blacklistBtn').on('click', (event) => {
      this.getBean('BlacklistPlugin').openBlacklistDialog();
    });
    $('#sort-toggle-btn').on('click', (event) => {
      const currentMethod = localStorage.getItem('jhs_sortMethod');
      let newMethod;
      newMethod =
        currentMethod && 'default' !== currentMethod
          ? 'rateCount' === currentMethod
            ? 'date'
            : 'default'
          : 'rateCount';
      const methodText = {
        default: 'Default', // Changed from '默认'
        rateCount: 'Rating Count', // Changed from '评价人数'
        date: 'Time', // Changed from '时间'
      }[newMethod];
      $(event.target).text(`Current sort method: ${methodText}`); // Changed from '当前排序方式:'
      localStorage.setItem('jhs_sortMethod', newMethod);
      this.sortItems().then();
    });
    const blacklistPlugin = this.getBean('BlacklistPlugin');
    $('#addBlacklistBtn').on('click', async (event) => {
      await blacklistPlugin.addBlacklist(event);
    });
    $('#filterAllVideo').on('click', async (event) => {
      let tempEvent = {
          clientX: event.clientX,
          clientY: event.clientY + 80,
        },
        $actor = isJavDb
          ? $('.actor-section-name')
          : $('.avatar-box .photo-info .pb10');
      if (0 === $actor.length) {
        show.error('Failed to get actor name'); // Changed from '获取演员名称失败'
        return;
      }
      let actorName = $actor.text().trim().split(',')[0];
      utils.q(
        tempEvent,
        'Block all videos in the selected category to identification records with one click?', // Changed from '一键屏蔽已选分类的视频列表至鉴定记录中?'
        async () => {
          this.loadObj = loading();
          try {
            await blacklistPlugin.filterAllVideo(actorName);
            window.refresh();
          } catch (e) {
            console.error(e);
          } finally {
            this.loadObj.close();
          }
        },
      );
    });
  }
  async sortItems() {
    if (
      currentHref.includes('handle') ||
      currentHref.includes('advanced_search')
    )
      return;
    const autoPage = await storageManager.getSetting('autoPage');
    if (isSearchPage || autoPage === YES) return;
    const method = localStorage.getItem('jhs_sortMethod');
    if (!method) return;
    $('.movie-list .item').each(function (index) {
      $(this).attr('data-original-index') ||
        $(this).attr('data-original-index', index);
    });
    const $container = $('.movie-list'),
      $items = $('.item', $container);
    if ('default' === method)
      $items
        .sort(function (a, b) {
          return $(a).data('original-index') - $(b).data('original-index');
        })
        .appendTo($container);
    else {
      const items = $items.get();
      items.sort(function (a, b) {
        if ('rateCount' === method) {
          const getScore = (el) => {
            const match = $(el)
              .find('.score .value')
              .text()
              .match(/rated by (\d+) people/); // Changed from /由(\d+)人/
            return match ? parseFloat(match[1]) : 0;
          };
          return getScore(b) - getScore(a);
        }
        {
          const getDate = (el) => {
            const dateStr = $(el).find('.meta').text().trim();
            return new Date(dateStr);
          };
          return getDate(b) - getDate(a);
        }
      });
      $container.empty().append(items);
    }
  }
  async openWaitCheck(event) {
    const maxCount = await storageManager.getSetting('waitCheckCount', 5);
    let count = 0;
    $(`${this.getSelector().itemSelector}:visible`).each((i, el) => {
      if (count >= maxCount) return !1;
      const $box2 = $(el);
      if ($box2.find('.status-tag').length > 0) return;
      const { carNum: carNum2, aHref: aHref } = this.getBoxCarInfo($box2);
      if (carNum2.includes('FC2-')) {
        const movieId = this.parseMovieId(aHref);
        this.getBean('Fc2Plugin').openFc2Page(movieId, carNum2, aHref);
      } else {
        let url = aHref + (aHref.includes('?') ? '&autoPlay=1' : '?autoPlay=1');
        window.open(url);
      }
      count++;
    });
    0 === count && show.info('No videos to be identified'); // Changed from '没有需鉴定的视频'
  }
  async openFavorite() {
    let favoriteList,
      openCount = await storageManager.getSetting('waitCheckCount', 5),
      randomOpenWaitDown = await storageManager.getSetting(
        'randomOpenWaitDown',
        NO,
      ),
      dataList = await storageManager.getCarList();
    favoriteList =
      randomOpenWaitDown === YES
        ? dataList
            .filter((item) => item.status === Status_FAVORITE)
            .sort(() => Math.random() - 0.5)
        : dataList
            .filter((item) => item.status === Status_FAVORITE)
            .sort((a, b) => b.createDate - a.createDate);
    for (let i = 0; i < openCount; i++) {
      if (i >= favoriteList.length) return;
      let data = favoriteList[i],
        carNum2 = data.carNum,
        url = data.url;
      if (carNum2.includes('FC2-')) {
        const movieId = this.parseMovieId(url);
        await this.getBean('Fc2Plugin').openFc2Page(movieId, carNum2, url);
      } else window.open(url);
      clog.debug('Opening favorites', carNum2, url); // Changed from '打开已收藏'
    }
  }
}
const translateText = async (text, sourceLang = 'ja', targetLang = 'en') => {
    if (!text) throw new Error('Translation text cannot be empty');
    const url =
        'https://translate-pa.googleapis.com/v1/translate?' +
        new URLSearchParams({
          'params.client': 'gtx',
          dataTypes: 'TRANSLATION',
          key: 'AIzaSyDLEeFI5OtFBwYBIoK_jj5m32rZK5CkCXA',
          'query.sourceLanguage': sourceLang,
          'query.targetLanguage': targetLang,
          'query.text': text,
        }),
      res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()).translation;
  },
  TAG_STYLES = {
    IS_FILTERED: {
      text: '🚫 Filtered',
      color: '#de3333',
      reasonType: 'Single ID Filter',
      isCounted: !0,
      countKey: 'currentPageFilterCount',
    },
    IS_FAVORITE: {
      text: '⭐ Favorite',
      color: '#25b1dc',
      reasonType: '',
      isCounted: !0,
      countKey: 'currentPageFavoriteCount',
    },
    IS_HAS_DOWN: {
      text: '📥️ Downloaded',
      color: '#7bc73b',
      reasonType: '',
      isCounted: !0,
      countKey: 'currentPageHasDownCount',
    },
    IS_HAS_WATCH: {
      text: '🔍 Watched',
      color: '#d7a80c',
      reasonType: '',
      isCounted: !0,
      countKey: 'currentPageHasWatchCount',
    },
    IS_KEYWORD_FILTER: {
      text: '❌ Keyword Filter',
      color: '#de3333',
      reasonType: '',
      isCounted: !0,
      countKey: 'currentPageKeywordFilterCount',
    },
    IS_ACTOR_FILTER: {
      text: '♂️ Male Actor Filter',
      color: '#b22222',
      reasonType: '',
      isCounted: !0,
      countKey: 'currentPageActorFilterCount',
    },
    IS_ACTRESS_FILTER: {
      text: '♀️ Female Actor Filter',
      color: '#cd5c5c',
      reasonType: '',
      isCounted: !0,
      countKey: 'currentPageActorFilterCount',
    },
    IS_WAIT_CHECK: {
      text: '',
      color: '',
      reasonType: '',
      isCounted: !0,
      countKey: 'currentPageWaitCheckCount',
    },
  };

class ListPagePlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'currentPageFilterCount', 0);
    __publicField(this, 'currentPageFavoriteCount', 0);
    __publicField(this, 'currentPageHasDownCount', 0);
    __publicField(this, 'currentPageHasWatchCount', 0);
    __publicField(this, 'currentPageKeywordFilterCount', 0);
    __publicField(this, 'currentPageActorFilterCount', 0);
    __publicField(this, 'currentPageWaitCheckCount', 0);
    __publicField(this, 'currentPageTotalCount', 0);
    __publicField(
      this,
      'cache',
      localStorage.getItem('jhs_translate')
        ? JSON.parse(localStorage.getItem('jhs_translate'))
        : {},
    );
    __publicField(this, 'writeQueue', Promise.resolve());
  }
  getName() {
    return 'ListPagePlugin';
  }
  async handle() {
    this.cleanRepeatId();
    this.replaceHdImg();
    this.addJumpPageControl();
    this.fixBusTitleBox();
    await this.doFilter();
    this.bindClick().then();
    this.bindListPageHotKey().then();
    this.rememberTagExpand();
    $(this.getSelector().itemSelector + ' a').attr('target', '_blank');
    this.checkDom();
  }
  rememberTagExpand() {
    if (!window.location.href.includes('actors')) return;
    const $expandButton = $('.tag-expand');
    if (0 === $expandButton.length) return;
    const isExpanded = 'true' === localStorage.getItem('jhs_tag_expand'),
      $actorTagsContent = $('.actor-tags .content');
    isExpanded &&
      $actorTagsContent.hasClass('collapse') &&
      $expandButton[0].click();
    $expandButton.on('click', function () {
      const newState = !$actorTagsContent.hasClass('collapse');
      localStorage.setItem('jhs_tag_expand', newState.toString());
    });
  }
  checkDom() {
    if (!window.isListPage) return;
    const selector = this.getSelector(),
      targetNode = document.querySelector(selector.boxSelector);
    if (!targetNode) {
      console.error('Container node not found!');
      return;
    }
    const observer = new MutationObserver(async (mutations) => {
        observer.disconnect();
        try {
          this.replaceHdImg();
          this.addJumpPageControl();
          this.fixBusTitleBox();
          await this.doFilter();
          await this.getBean('ListPageButtonPlugin').sortItems();
          this.getBean('CoverButtonPlugin').addSvgBtn().then();
          $(this.getSelector().itemSelector + ' a').attr('target', '_blank');
          this.getBean('AutoPagePlugin').checkLoad();
        } finally {
          observer.observe(targetNode, config);
        }
      }),
      config = {
        childList: !0,
        subtree: !1,
      };
    observer.observe(targetNode, config);
  }
  fixBusTitleBox() {
    if (!isJavBus) return;
    $(this.getSelector().itemSelector)
      .toArray()
      .forEach((ele) => {
        var _a2;
        let $box2 = $(ele);
        if ($box2.find('.avatar-box').length > 0) return;
        const title =
          (null == (_a2 = $box2.find('img').attr('title'))
            ? void 0
            : _a2.trim()) || '';
        $box2
          .find('.photo-info span:first')
          .contents()
          .first()
          .wrap(`<span class="video-title" title="${title}">${title}</span>`);
        $box2.find('br').remove();
      });
  }
  cleanRepeatId() {
    if (!isJavBus) return;
    $('#waterfall_h').removeAttr('id').attr('id', 'no-page');
    const $waterfalls = $('[id="waterfall"]');
    0 !== $waterfalls.length &&
      $waterfalls.each(function () {
        const $current = $(this);
        if (!$current.hasClass('masonry')) {
          $current.children().insertAfter($current);
          $current.remove();
        }
      });
  }
  async doFilter() {
    if (!window.isListPage) return;
    let movieList = $(this.getSelector().itemSelector).toArray();
    if (movieList.length) {
      await this.filterMovieList(movieList);
      await this.getBean('WangPan115MatchPlugin').matchMovieList(movieList);
      isJavBus && (await this.getBean('BusImgPlugin').logImageHeightsByRow());
    }
  }
  async filterMovieList(movieList) {
    utils.time('Total time elapsed');
    utils.time('Time to read data');
    const [
        carList,
        filterKeywordList,
        blacklist,
        blacklistCarList,
        settingObj,
      ] = await Promise.all([
        storageManager.getCarList(),
        storageManager.getTitleFilterKeyword(),
        storageManager.getBlacklist(),
        storageManager.getBlacklistCarList(),
        storageManager.getSetting(),
      ]),
      t1 = utils.time('Time to read data'),
      carNumSets = carList.reduce(
        (dataMap, item) => {
          const statusKey = item.status;
          dataMap.hasOwnProperty(statusKey) &&
            dataMap[statusKey].add(item.carNum);
          return dataMap;
        },
        {
          [Status_FILTER]: new Set(),
          [Status_FAVORITE]: new Set(),
          [Status_HAS_DOWN]: new Set(),
          [Status_HAS_WATCH]: new Set(),
        },
      );
    utils.time('Time to assemble data');
    const starIdToRoleMap = new Map(
        blacklist.map((item) => [item.starId, item.role]),
      ),
      {
        actorCarNumToNameMap: actorCarNumToNameMap,
        actressCarNumToNameMap: actressCarNumToNameMap,
      } = blacklistCarList.reduce(
        (dataMap, carItem) => {
          const role = starIdToRoleMap.get(carItem.starId);
          if (!role) {
            clog.error(
              'Blacklist data source missing actor information',
              carItem,
            );
            return dataMap;
          }
          const targetMap =
            'actor' === role
              ? dataMap.actorCarNumToNameMap
              : dataMap.actressCarNumToNameMap;
          targetMap.has(carItem.carNum) ||
            targetMap.set(carItem.carNum, carItem.names);
          return dataMap;
        },
        {
          actorCarNumToNameMap: new Map(),
          actressCarNumToNameMap: new Map(),
        },
      ),
      t2 = utils.time('Time to assemble data'),
      settings = {
        showFilterItem:
          (null == settingObj ? void 0 : settingObj.showFilterItem) ?? NO,
        showFilterActorItem:
          (null == settingObj ? void 0 : settingObj.showFilterActorItem) ?? NO,
        showFilterKeywordItem:
          (null == settingObj ? void 0 : settingObj.showFilterKeywordItem) ??
          NO,
        showFavoriteItem:
          (null == settingObj ? void 0 : settingObj.showFavoriteItem) ?? YES,
        showHasDownItem:
          (null == settingObj ? void 0 : settingObj.showHasDownItem) ?? YES,
        showHasWatchItem:
          (null == settingObj ? void 0 : settingObj.showHasWatchItem) ?? YES,
        showAllItem:
          (null == settingObj ? void 0 : settingObj.showAllItem) ?? NO,
        tagPosition:
          (null == settingObj ? void 0 : settingObj.tagPosition) || 'rightTop',
        movieShowType:
          (null == settingObj ? void 0 : settingObj.movieShowType) || 'hide',
      };
    this.currentPageFilterCount = 0;
    this.currentPageFavoriteCount = 0;
    this.currentPageHasDownCount = 0;
    this.currentPageHasWatchCount = 0;
    this.currentPageKeywordFilterCount = 0;
    this.currentPageActorFilterCount = 0;
    this.currentPageWaitCheckCount = 0;
    this.currentPageTotalCount = 0;
    utils.time('Time to process page');
    await Promise.all(
      movieList.map(async (ele) => {
        let $box2 = $(ele);
        if (isJavBus && $box2.find('.avatar-box').length > 0) return;
        const { carNum: carNum2, title: title } = this.getBoxCarInfo($box2),
          {
            filter: filter,
            favorite: favorite,
            hasDown: hasDown,
            hasWatch: hasWatch,
          } = carNumSets,
          isFavorite = favorite.has(carNum2),
          isHasDown = hasDown.has(carNum2),
          isHasWatch = hasWatch.has(carNum2),
          isFiltered = filter.has(carNum2),
          isFilterActorMale = actorCarNumToNameMap.has(carNum2),
          isFilterActorFemale = actressCarNumToNameMap.has(carNum2),
          isFilterActor = isFilterActorMale || isFilterActorFemale,
          foundKeyword = filterKeywordList.find(
            (kw) => title.includes(kw) || carNum2.startsWith(kw),
          ),
          isFilterKeyword = !!foundKeyword;
        if (!isSearchPage) {
          let shouldHide =
            (settings.showFavoriteItem === NO && isFavorite) ||
            (settings.showHasDownItem === NO && isHasDown) ||
            (settings.showHasWatchItem === NO && isHasWatch) ||
            (settings.showFilterItem === NO &&
              isFiltered &&
              !(isFavorite || isHasDown || isHasWatch)) ||
            (settings.showFilterActorItem === NO && isFilterActor) ||
            (settings.showFilterKeywordItem === NO && isFilterKeyword);
          if ($box2.attr('data-movieShowType') !== settings.movieShowType) {
            $box2.css('border', '');
            $box2.children().css('visibility', '');
            $box2.removeAttr('data-hide');
            $box2.show();
          }
          const isCurrentlyHidden = $box2.attr('data-hide') === YES;
          settings.showAllItem === YES && (shouldHide = !1);
          if (shouldHide !== isCurrentlyHidden) {
            shouldHide
              ? $box2.attr('data-hide', YES)
              : $box2.removeAttr('data-hide');
            if ('hide' === settings.movieShowType)
              shouldHide ? $box2.hide() : $box2.show();
            else {
              if ('visibility' !== settings.movieShowType)
                throw new Error(
                  'movieShowType value is invalid:' + settings.movieShowType,
                );
              {
                const $content = $box2.children(),
                  borderStyle = shouldHide
                    ? '1px solid rgb(192 176 176)'
                    : 'none',
                  visibilityValue = shouldHide ? 'hidden' : 'visible';
                $box2.css('border', borderStyle);
                $content.css('visibility', visibilityValue);
              }
            }
            $box2.attr('data-movieShowType') !== settings.movieShowType &&
              $box2.attr('data-movieShowType', settings.movieShowType);
          }
        }
        let tag = TAG_STYLES.IS_WAIT_CHECK,
          filterReason = null;
        if (isFiltered) tag = TAG_STYLES.IS_FILTERED;
        else if (isFavorite) tag = TAG_STYLES.IS_FAVORITE;
        else if (isHasDown) tag = TAG_STYLES.IS_HAS_DOWN;
        else if (isHasWatch) tag = TAG_STYLES.IS_HAS_WATCH;
        else if (isFilterKeyword) {
          tag = TAG_STYLES.IS_KEYWORD_FILTER;
          filterReason = foundKeyword || 'Unknown';
        } else if (isFilterActorMale) {
          tag = TAG_STYLES.IS_ACTOR_FILTER;
          filterReason = actorCarNumToNameMap.get(carNum2) || '';
        } else if (isFilterActorFemale) {
          tag = TAG_STYLES.IS_ACTRESS_FILTER;
          filterReason = actressCarNumToNameMap.get(carNum2) || '';
        }
        filterReason || (filterReason = tag.reasonType);
        tag.isCounted && this[tag.countKey]++;
        this.currentPageTotalCount++;
        $box2.find('.status-tag').remove();
        const tagPositionCss =
          'rightTop' === settings.tagPosition
            ? 'right: 0; top:5px;'
            : 'left: 0; top:5px;';
        if (tag.text) {
          const tagHtml = isJavDb
            ? `<span class="tag is-success status-tag" data-tip="${filterReason}" title=""\n                        style="margin-right: 5px; border-radius:10px; position:absolute; \n                        z-index:10; background-color: ${tag.color} !important; ${tagPositionCss}">\n                        ${tag.text}\n                    </span>`
            : `<a class="a-primary status-tag" data-tip="${filterReason}"  title=""\n                        style="margin-right: 5px; padding: 0 5px; color: #fff !important; border-radius:10px; position:absolute; \n                        z-index:10; background-color: ${tag.color} !important; ${tagPositionCss}">\n                        <span class="tag" style="color:#fff !important;">${tag.text}</span>\n                    </a>`;
          isJavDb && $box2.find('.tags').append(tagHtml);
          if (isJavBus) {
            const $itemTag = $box2.find('.item-tag');
            $itemTag.length
              ? $itemTag.append(tagHtml)
              : $box2.find('.photo-info > span > div').append(tagHtml);
          }
        }
        await this.translate($box2);
      }),
    );
    const t3 = utils.time('Time to process page'),
      t4 = utils.time('Total time elapsed');
    $('#waitDownBtn span').text(`Open Favorites (${carNumSets.favorite.size})`);
    clog.log(
      `\n            <table class="countTable" style='border-collapse: collapse; width: 100%'>\n                <tr>\n                    <td colspan="2" style='padding: 3px; border: 1px solid #ccc;'>${t1}</td>\n                    <td colspan="2" style='padding: 3px; border: 1px solid #ccc;'>${t2}</td>\n                </tr>\n                \n                <tr>\n                    <td colspan="2" style='padding: 3px; border: 1px solid #ccc;'>${t3}</td>\n                    <td colspan="2" style='padding: 3px; border: 1px solid #ccc;'>${t4}</td>\n                </tr>\n                <tr>\n                    <td style='padding: 3px; border: 1px solid #ccc; font-weight: bold;'>Item</td>\n                    <td style='padding: 3px; border: 1px solid #ccc; font-weight: bold;'>Count</td>\n                    <td style='padding: 3px; border: 1px solid #ccc; font-weight: bold;'>Item</td>\n                    <td style='padding: 3px; border: 1px solid #ccc; font-weight: bold;'>Count</td>\n                </tr>\n                \n                <tr>\n                    <td style='padding: 3px; border: 1px solid #ccc;'>Filtered by ID</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageFilterCount}</strong></td>\n                     <td style='padding: 3px; border: 1px solid #ccc;'>Favorites</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageFavoriteCount}</strong></td>\n                </tr>\n                \n                <tr>\n                    <td style='padding: 3px; border: 1px solid #ccc;'>Filtered Actors</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageActorFilterCount}</strong></td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'>Downloaded</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageHasDownCount}</strong></td>\n                </tr>\n                \n                <tr>\n                    <td style='padding: 3px; border: 1px solid #ccc;'>Filtered Keywords</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageKeywordFilterCount}</strong></td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'>Watched</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageHasWatchCount}</strong></td>\n                </tr>\n                \n                <tr>\n                    <td style='padding: 3px; border: 1px solid #ccc;'>Pending Identification</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageWaitCheckCount}</strong></td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'></td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'></td>\n                </tr>\n        \n                <tr>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>Total</strong></td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageTotalCount}</strong></td>\n                </tr>\n            </table>\n        `,
    );
  }
  async bindClick() {
    let selector = this.getSelector();
    $(selector.boxSelector).on('click', '.item img', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if ($(event.target).closest('div.meta-buttons').length) return;
      const $box2 = $(event.target).closest('.item'),
        { carNum: carNum2, aHref: aHref } = this.getBoxCarInfo($box2);
      let dialogOpenDetail = await storageManager.getSetting(
        'dialogOpenDetail',
        YES,
      );
      if (carNum2.includes('FC2-')) {
        let movieId = this.parseMovieId(aHref);
        this.getBean('Fc2Plugin').openFc2Dialog(movieId, carNum2, aHref);
      } else if (dialogOpenDetail === YES) {
        utils.openPage(aHref, carNum2, !0, event);
        this.$currentImage = null;
      } else window.open(aHref);
    });
    $(selector.boxSelector).on('click', '.item video', async (event) => {
      const video = event.currentTarget;
      video.paused
        ? video.play().catch((e) => console.error('Playback failed:', e))
        : video.pause();
      event.preventDefault();
      event.stopPropagation();
    });
    $(selector.boxSelector).on('click', '.item .video-title', async (event) => {
      if ($(event.target).closest('[class^="jhs-match-"]').length) return;
      const $box2 = $(event.currentTarget).closest('.item'),
        { carNum: carNum2, aHref: aHref } = this.getBoxCarInfo($box2);
      if (carNum2.includes('FC2-')) {
        event.preventDefault();
        let movieId = this.parseMovieId(aHref);
        this.getBean('Fc2Plugin').openFc2Dialog(movieId, carNum2, aHref);
      }
    });
    $(selector.boxSelector).on(
      'contextmenu',
      '.item img, .item video',
      async (event) => {
        event.preventDefault();
        const $box2 = $(event.target).closest('.item'),
          {
            carNum: carNum2,
            url: url,
            publishTime: publishTime,
          } = this.getBoxCarInfo($box2);
        let $actor = isJavDb
            ? $('.actor-section-name')
            : $('.avatar-box .photo-info .pb10'),
          actorName = '';
        $actor.length &&
          (actorName = $actor
            .text()
            .trim()
            .split(',')[0]
            .replace('(無碼)', ''));
        utils.q(event, `Block ID ${carNum2}?`, async () => {
          setTimeout(async () => {
            actorName || (actorName = await this.parseActressName(url));
            await storageManager.saveCar({
              carNum: carNum2,
              url: url,
              names: actorName,
              actionType: Status_FILTER,
              publishTime: publishTime,
            });
            window.refresh();
            show.ok('Operation successful');
          });
        });
      },
    );
  }
  async parseActressName(url) {
    let actorName = null;
    if (
      (await storageManager.getSetting('enableSaveActressCarInfo', NO)) === YES
    ) {
      clog.debug(
        'Identification and recording of actor information - enabled, starting to parse detail page',
      );
      clog.debug('Starting to parse actor detail page', url);
      const html = await gmHttp.get(url),
        $dom = utils.htmlTo$dom(html);
      isJavDb
        ? (actorName = $dom
            .find('.female')
            .prev()
            .map((i, el) => $(el).text())
            .get()
            .join(' '))
        : isJavBus &&
          (actorName = $dom
            .find('span[onmouseover*="star_"] a')
            .map((i, el) => $(el).text())
            .get()
            .join(' '));
      clog.debug('Parsed name:', actorName);
    }
    return actorName;
  }
  async bindListPageHotKey() {
    this.$currentImage = null;
    $(document)
      .on('mouseenter', this.getSelector().coverImgSelector, (e) => {
        this.$currentImage = $(e.currentTarget);
      })
      .on('mouseleave', this.getSelector().coverImgSelector, () => {
        this.$currentImage = null;
      });
    let settingObj = await storageManager.getSetting();
    this.filterHotKey = settingObj.filterHotKey;
    this.favoriteHotKey = settingObj.favoriteHotKey;
    this.hasDownHotKey = settingObj.hasDownHotKey;
    this.hasWatchHotKey = settingObj.hasWatchHotKey;
    this.enableImageHotKey = settingObj.enableImageHotKey || NO;
    this.clogHotKey = settingObj.clogHotKey;
    this.foldCategoryHotKey = settingObj.foldCategoryHotKey;
    this.showFilterItemHotKey = settingObj.showFilterItemHotKey;
    this.showFilterActorItemHotKey = settingObj.showFilterActorItemHotKey;
    this.showFilterKeywordItemHotKey = settingObj.showFilterKeywordItemHotKey;
    this.showFavoriteItemHotKey = settingObj.showFavoriteItemHotKey;
    this.showHasDownItemHotKey = settingObj.showHasDownItemHotKey;
    this.showHasWatchItemHotKey = settingObj.showHasWatchItemHotKey;
    this.showAllItemHotKey = settingObj.showAllItemHotKey;
    const HOTKEY_REGISTRY = {
        showFilterItemHotKey: 'showFilterItem',
        showFilterActorItemHotKey: 'showFilterActorItem',
        showFilterKeywordItemHotKey: 'showFilterKeywordItem',
        showFavoriteItemHotKey: 'showFavoriteItem',
        showHasDownItemHotKey: 'showHasDownItem',
        showHasWatchItemHotKey: 'showHasWatchItem',
        showAllItemHotKey: 'showAllItem',
      },
      registerToggleHotkey = (hotkeyName, settingKey) => {
        const hotkeyString = this[hotkeyName];
        hotkeyString &&
          HotkeyManager.registerHotkey(hotkeyString, async (event) => {
            const newVal =
              (await storageManager.getSetting(settingKey)) === YES ? NO : YES;
            await storageManager.saveSettingItem(settingKey, newVal);
            window.refresh();
          });
      };
    for (const hotkeyName in HOTKEY_REGISTRY)
      if (HOTKEY_REGISTRY.hasOwnProperty(hotkeyName)) {
        registerToggleHotkey(hotkeyName, HOTKEY_REGISTRY[hotkeyName]);
      }
    if (this.enableImageHotKey === NO) return;
    const handleAction = async (boxInfo, status) => {
        setTimeout(async () => {
          let actorName = await this.parseActressName(boxInfo.url);
          await storageManager.saveCar({
            carNum: boxInfo.carNum,
            url: boxInfo.url,
            names: actorName,
            actionType: status,
            publishTime: boxInfo.publishTime,
          });
          window.refresh();
          show.ok('Operation successful');
        });
      },
      handlers = {};
    this.filterHotKey &&
      (handlers[this.filterHotKey] = (boxInfo) => {
        handleAction(boxInfo, Status_FILTER);
      });
    this.favoriteHotKey &&
      (handlers[this.favoriteHotKey] = (boxInfo) => {
        handleAction(boxInfo, Status_FAVORITE);
      });
    this.hasDownHotKey &&
      (handlers[this.hasDownHotKey] = (boxInfo) => {
        handleAction(boxInfo, Status_HAS_DOWN);
      });
    this.hasWatchHotKey &&
      (handlers[this.hasWatchHotKey] = (boxInfo) => {
        handleAction(boxInfo, Status_HAS_WATCH);
      });
    this.clogHotKey &&
      HotkeyManager.registerHotkey(this.clogHotKey, (event) => {
        clog.toggleExpandCollapsed();
      });
    this.foldCategoryHotKey &&
      HotkeyManager.registerHotkey(this.foldCategoryHotKey, (event) => {
        const $btn = $('#foldCategoryBtn');
        $btn.length && $btn[0].click();
      });
    const registerImageHotkey = (key, handler) => {
      HotkeyManager.registerHotkey(key, (event) => {
        const activeElement = document.activeElement;
        if (
          !(
            'INPUT' === activeElement.tagName ||
            'TEXTAREA' === activeElement.tagName ||
            activeElement.isContentEditable
          ) &&
          this.$currentImage
        ) {
          const $box2 = this.$currentImage.closest('.item'),
            boxInfo = this.getBoxCarInfo($box2);
          handler(boxInfo);
        }
      });
    };
    Object.entries(handlers).forEach(([key, handler]) => {
      registerImageHotkey(key, handler);
    });
  }
  replaceHdImg(coverImgNodeList) {
    coverImgNodeList &&
      'string' == typeof coverImgNodeList.jquery &&
      (coverImgNodeList = coverImgNodeList.toArray());
    coverImgNodeList ||
      (coverImgNodeList = document.querySelectorAll(
        this.getSelector().coverImgSelector,
      ));
    isJavDb &&
      coverImgNodeList.forEach((img) => {
        img.src = img.src.replace('thumbs', 'covers');
        img.title = '';
      });
    if (isJavBus) {
      const THUMB_PATH_REGEX = /\/(imgs|pics)\/(thumb|thumbs)\//,
        IMG_EXT_REGEX = /(\.jpg|\.jpeg|\.png)$/i,
        replaceWithHd = (img) => {
          if (
            img.src &&
            THUMB_PATH_REGEX.test(img.src) &&
            'true' !== img.dataset.hdReplaced
          ) {
            img.src = img.src
              .replace(THUMB_PATH_REGEX, '/$1/cover/')
              .replace(IMG_EXT_REGEX, '_b$1');
            img.dataset.hdReplaced = 'true';
            img.dataset.title = img.title;
            img.title = '';
          }
        },
        DMM_THUMB_REGEX = /ps(\.jpg|\.jpeg|\.png)$/i,
        replaceWithHdForDMM = (img) => {
          if (
            img.src &&
            DMM_THUMB_REGEX.test(img.src) &&
            'true' !== img.dataset.hdReplaced
          ) {
            img.src = img.src.replace(DMM_THUMB_REGEX, 'pl$1');
            img.dataset.hdReplaced = 'true';
            img.dataset.title = img.title;
            img.title = '';
          }
        };
      coverImgNodeList.forEach((img) => {
        replaceWithHd(img);
        replaceWithHdForDMM(img);
      });
    }
    storageManager.getSetting('hoverBigImg', NO).then((hoverBigImg) => {
      hoverBigImg === YES &&
        (window.imageHoverPreviewObj
          ? window.imageHoverPreviewObj.bindEvents()
          : (window.imageHoverPreviewObj = new ImageHoverPreview({
              selector: this.getSelector().coverImgSelector,
            })));
    });
  }
  async translate($box2) {
    if ((await storageManager.getSetting('translateTitle', YES)) !== YES)
      return;
    let content,
      carNum2,
      $title = $box2.find('.video-title');
    if (isJavDb) {
      content = $title
        .contents()
        .filter(
          (i, node) => 3 === node.nodeType && '' !== node.textContent.trim(),
        )
        .text()
        .trim();
      carNum2 = $box2.find('.video-title strong').text().trim();
    } else {
      content = $box2.find('img').attr('data-title').trim();
      carNum2 = $box2
        .find('a')
        .attr('href')
        .split('/')
        .filter(Boolean)
        .pop()
        .trim();
    }
    if (this.cache[carNum2]) {
      let _this = this;
      $title.contents().each(function () {
        3 === this.nodeType &&
          '' !== this.textContent.trim() &&
          (this.textContent = ' ' + _this.cache[carNum2] + ' ');
      });
      $title.attr('title', _this.cache[carNum2]);
    } else
      translateText(content)
        .then((result) => {
          if (isJavDb) {
            $title.contents().each(function () {
              3 !== this.nodeType ||
                '' === this.textContent.trim() ||
                this.textContent.includes(carNum2) ||
                (this.textContent = ' ' + result + ' ');
            });
            $title.attr('title', result);
          } else $title.text(result);
          this.writeQueue = this.writeQueue.then(() => {
            this.cache[carNum2] = result;
            localStorage.setItem('jhs_translate', JSON.stringify(this.cache));
          });
        })
        .catch((error) => {
          console.error('Translation failed:', error);
        });
  }
  async revertTranslation() {
    $(this.getSelector().itemSelector)
      .toArray()
      .forEach((ele) => {
        let $box2 = $(ele);
        const originalContent =
          $box2.find('.box').attr('title') ||
          $box2.find('.video-title').attr('title') ||
          $box2.find('img').attr('data-title');
        let carNum2;
        isJavDb && (carNum2 = $box2.find('.video-title strong').text().trim());
        const $title = $box2.find('.video-title');
        $title.contents().each(function () {
          3 !== this.nodeType ||
            '' === this.textContent.trim() ||
            this.textContent.includes(carNum2) ||
            (this.textContent = ' ' + originalContent + ' ');
        });
        $title.removeAttr('title');
      });
  }
  addJumpPageControl() {
    if ($('#gemini-jump-page-control').length > 0) return;
    if (0 === $('.pagination-link.is-current').length) return;
    const currentPageNum = utils.getUrlParam(currentHref, 'page') || 1,
      $input = $('<input>', {
        type: 'number',
        id: 'jumpPageInput',
        placeholder: 'Page No.',
        min: '1',
        style:
          'width: 60px; margin-left: 10px; padding: 10px; border: 1px solid #ccc; font-size: 14px;',
        value: currentPageNum + 1,
      }),
      $button = $('<button>', {
        text: 'Jump',
        style:
          'margin-left: 5px; padding: 9px 8px; cursor: pointer; border: 1px solid #ccc; background-color: #f0f0f0; font-size: 14px;',
      }),
      $jumpLi = $('<li>', {
        id: 'gemini-jump-page-control',
      })
        .append($input)
        .append($button);
    $('.pagination-list').append($jumpLi);
    const jumpToPage = () => {
      const pageNumber = parseInt($input.val(), 10);
      if (isNaN(pageNumber) || pageNumber < 1) {
        $input.focus();
        return;
      }
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('page', pageNumber.toString());
      window.location.href = newUrl.toString();
    };
    $button.on('click', jumpToPage);
    $input.on('keypress', function (e) {
      if (13 === e.which) {
        jumpToPage();
        e.preventDefault();
      }
    });
  }
}

class AutoPagePlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'preloadDistance', 500);
    __publicField(this, 'currentPage', this.getInitialPageNumber());
    __publicField(this, 'pageItems', []);
  }
  getName() {
    return 'AutoPagePlugin';
  }
  async initCss() {
    return '\n            <style>\n                .jhs-scroll {\n                    text-align: center;\n                    padding-top: 20px;\n                    font-size: 14px;\n                }\n                .jhs-scroll.waterfall-loading { color: #000; }\n                .jhs-scroll.waterfall-error { color: #f44336; cursor: pointer; }\n                .jhs-scroll.waterfall-no-more { color: #4CAF50; }\n            </style>\n        ';
  }
  async handle() {
    this.waterfall().then();
  }
  getInitialPageNumber() {
    if (isJavBus) {
      const match = currentHref.match(/\/(page|star\/[^/]+)\/(\d+)/);
      return match ? parseInt(match[2], 10) : 1;
    }
    if (isJavDb) {
      const match = currentHref.match(/[?&]page=(\d+)/);
      return match ? parseInt(match[1], 10) : 1;
    }
    return 1;
  }
  async waterfall() {
    if (await this.shouldDisablePaging()) return;
    const selector = this.getSelector();
    this.container = document.querySelector(selector.boxSelector);
    if (!this.container) {
      console.error('Container node not found, stopping waterfall!');
      return;
    }
    this.loader = document.createElement('div');
    this.loader.className = 'jhs-scroll';
    this.container.parentNode.insertBefore(
      this.loader,
      this.container.nextSibling,
    );
    this.pageItems.push({
      page: this.currentPage,
      top: 0,
      url: window.location.href,
    });
    this.loader.addEventListener('click', () => {
      this.loader.classList.contains('waterfall-error') &&
        this.loadNextPage().then();
    });
    window.addEventListener('scroll', () => {
      this.checkLoad();
      this.checkScrollPosition();
    });
    const nextLink = document.querySelector(selector.nextPageSelector);
    this.nextUrl = null == nextLink ? void 0 : nextLink.href;
    this.hasMore = !!this.nextUrl;
    setTimeout(() => {
      this.checkLoad();
    }, 1e3);
    this.hasMore || this.setState('waterfall-no-more', 'End of content');
  }
  async loadNextPage() {
    var _a2;
    if ((await storageManager.getSetting('autoPage', YES)) === NO) {
      this.setState('waterfall-loading', '');
      return;
    }
    if (this.isLoading || !this.nextUrl) return;
    this.isLoading = !0;
    this.setState('waterfall-loading', 'Loading...');
    const selector = this.getSelector();
    try {
      const pageNum = utils.getUrlParam(this.nextUrl, 'page');
      let maxPage = 60;
      currentHref.includes('c11') && (maxPage = 30);
      if ((isJavDb && pageNum > maxPage) || currentHref.includes('month')) {
        const beyond60Plugin = this.getBean('Beyond60Plugin');
        if (beyond60Plugin) {
          const {
            html: html2,
            nextUrl: nextUrl,
            hasMore: hasMore,
          } = await beyond60Plugin.handleBeyond60(this.nextUrl);
          if (html2) {
            const pageTop2 = this.container.scrollHeight;
            this.pageItems.push({
              page: this.currentPage + 1,
              top: pageTop2,
              url: this.nextUrl,
            });
            $('.movie-list').append(html2);
          }
          this.hasMore = hasMore;
          this.nextUrl = nextUrl;
          const $ul = beyond60Plugin.createPagination(pageNum, hasMore);
          $('.pagination').html($ul);
          this.setState('waterfall-loading', '');
          this.hasMore || this.setState('waterfall-no-more', 'End of content');
          return;
        }
      }
      const html = await gmHttp.get(this.nextUrl);
      clog.log('Requesting next page content:', this.nextUrl);
      const $dom = utils.htmlTo$dom(html);
      isJavBus &&
        $dom.find('.avatar-box').length > 0 &&
        $dom.find('.avatar-box').parent().remove();
      let itemList = $dom.find(this.getSelector().requestDomItemSelector);
      const currentBoxCarInfoList = this.getBoxCarInfoList(),
        nextPageBoxCarInfoList = this.getBoxCarInfoList(itemList);
      if (
        this.checkDuplicateCarNumbers(
          currentBoxCarInfoList,
          nextPageBoxCarInfoList,
        )
      ) {
        this.nextUrl = null;
        this.hasMore = !1;
        this.setState(
          'waterfall-error',
          'Duplicate data found on next page, homepage may have new videos or page number is limited by JavDB, stopping waterfall',
        );
        return;
      }
      const pageTop = this.container.scrollHeight;
      this.pageItems.push({
        page: this.currentPage + 1,
        top: pageTop,
        url: this.nextUrl,
      });
      const listPagePlugin = this.getBean('ListPagePlugin');
      let coverImgNodeList = $dom.find(this.getSelector().coverImgSelector);
      listPagePlugin.replaceHdImg(coverImgNodeList);
      $(this.getSelector().boxSelector).append(itemList);
      this.nextUrl =
        null == (_a2 = $dom.find(selector.nextPageSelector))
          ? void 0
          : _a2.attr('href');
      this.hasMore = !!this.nextUrl;
      let pagination = $dom.find('.pagination');
      $('.pagination').replaceWith(pagination);
      this.setState('waterfall-loading', '');
      this.hasMore || this.setState('waterfall-no-more', 'End of content');
    } catch (e) {
      clog.error('Failed to load:', e);
      this.setState('waterfall-error', 'Failed to load, click to retry');
    } finally {
      this.isLoading = !1;
    }
  }
  checkScrollPosition() {
    const scrollPosition = window.scrollY;
    for (let i = this.pageItems.length - 1; i >= 0; i--) {
      const page = this.pageItems[i];
      if (scrollPosition >= page.top) {
        if (this.currentPage !== page.page) {
          this.currentPage = page.page;
          this.updatePageUrl(page.url);
        }
        break;
      }
    }
  }
  checkLoad() {
    if (!this.loader) return;
    this.loader.getBoundingClientRect().top <
      window.innerHeight + this.preloadDistance && this.loadNextPage().then();
  }
  async shouldDisablePaging() {
    if (!window.isListPage) return !0;
    await storageManager.getSetting('autoPage', YES);
    return [
      'search?q',
      'handlePlayback=1',
      'handleTop=1',
      '/want_watch_videos',
      '/watched_videos',
      '/advanced_search?type=100',
    ].some((path) => currentHref.includes(path));
  }
  updatePageUrl_old(href) {
    window.history.pushState({}, '', href);
    if (isJavBus) {
      const match = href.match(/\/(page|star\/.*?)\/(\d+)/),
        pageNumber = match ? parseInt(match[2], 10) : null;
      document.title = document.title.replace(/第\d+頁/, 'Page ' + pageNumber);
    }
  }
  updatePageUrl(url) {
    window.history.replaceState({}, '', url);
    isJavBus &&
      (document.title = document.title.replace(
        /第\d+頁/,
        `Page ${this.currentPage}`,
      ));
  }
  setState(state, text) {
    this.loader.className = `jhs-scroll ${state}`;
    this.loader.textContent = text;
  }
}

class AliyunApi {
  constructor(refresh_token) {
    this.baseApiUrl = 'https://api.aliyundrive.com';
    this.refresh_token = refresh_token;
    this.authorization = null;
    this.default_drive_id = null;
    this.backupFolderId = null;
  }
  async getDefaultDriveId() {
    if (this.default_drive_id) return this.default_drive_id;
    this.userInfo = await this.getUserInfo();
    this.default_drive_id = this.userInfo.default_drive_id;
    return this.default_drive_id;
  }
  async getHeaders() {
    if (this.authorization)
      return {
        authorization: this.authorization,
      };
    this.authorization = await this.getAuthorization();
    return {
      authorization: this.authorization,
    };
  }
  async getAuthorization() {
    let url = this.baseApiUrl + '/v2/account/token',
      data = {
        refresh_token: this.refresh_token,
        grant_type: 'refresh_token',
      };
    try {
      return 'Bearer ' + (await gmHttp.post(url, data)).access_token;
    } catch (e) {
      throw e.message.includes('is not valid')
        ? new Error('Invalid refresh_token, please re-enter and save')
        : e;
    }
  }
  async getUserInfo() {
    const headers = await this.getHeaders();
    let url = this.baseApiUrl + '/v2/user/get';
    return await gmHttp.post(url, {}, headers);
  }
  async deleteFile(file_id, drive_id = null) {
    if (!file_id) throw new Error('file_id not provided');
    drive_id || (drive_id = await this.getDefaultDriveId());
    let data = {
        file_id: file_id,
        drive_id: drive_id,
      },
      url = this.baseApiUrl + '/v2/recyclebin/trash';
    const headers = await this.getHeaders();
    await gmHttp.post(url, data, headers);
    return {};
  }
  async createFolder(name2, drive_id = null, parent_folder_id = 'root') {
    drive_id || (drive_id = await this.getDefaultDriveId());
    let url = this.baseApiUrl + '/adrive/v2/file/createWithFolders',
      data = {
        name: name2,
        type: 'folder',
        parent_file_id: parent_folder_id,
        check_name_mode: 'auto_rename',
        content_hash_name: 'sha1',
        drive_id: drive_id,
      };
    const headers = await this.getHeaders();
    return await gmHttp.post(url, data, headers);
  }
  async getFileList(parent_folder_id = 'root', drive_id = null) {
    drive_id || (drive_id = await this.getDefaultDriveId());
    let url = this.baseApiUrl + '/adrive/v3/file/list';
    const data = {
        drive_id: drive_id,
        parent_file_id: parent_folder_id,
        limit: 200,
        all: !1,
        url_expire_sec: 14400,
        image_thumbnail_process: 'image/resize,w_256/format,avif',
        image_url_process: 'image/resize,w_1920/format,avif',
        video_thumbnail_process:
          'video/snapshot,t_120000,f_jpg,m_lfit,w_256,ar_auto,m_fast',
        fields: '*',
        order_by: 'updated_at',
        order_direction: 'DESC',
      },
      headers = await this.getHeaders();
    return (await gmHttp.post(url, data, headers)).items;
  }
  async uploadFile(folder_id, fileName, uploadContent, drive_id = null) {
    show.info('Requesting storage space...');
    let createFileUrl = this.baseApiUrl + '/adrive/v2/file/createWithFolders';
    drive_id || (drive_id = await this.getDefaultDriveId());
    let data = {
      drive_id: drive_id,
      part_info_list: [
        {
          part_number: 1,
        },
      ],
      parent_file_id: folder_id,
      name: fileName,
      type: 'file',
      check_name_mode: 'auto_rename',
    };
    const headers = await this.getHeaders(),
      createFileResult = await gmHttp.post(createFileUrl, data, headers),
      upload_id = createFileResult.upload_id,
      upload_file_id = createFileResult.file_id,
      upload_url = createFileResult.part_info_list[0].upload_url;
    show.info('Starting file upload...');
    await this._doUpload(upload_url, uploadContent);
    await gmHttp.post(
      'https://api.aliyundrive.com/v2/file/complete',
      (data = {
        drive_id: drive_id,
        file_id: upload_file_id,
        upload_id: upload_id,
      }),
      headers,
    );
  }
  _doUpload(upload_url, uploadContent) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'PUT',
        url: upload_url,
        data: uploadContent,
        contentType: ' ',
        processData: !1,
        success: (res, status, xhr) => {
          200 === xhr.status ? resolve({}) : reject(xhr);
        },
        error: (xhr) => {
          clog.error('Upload failed', xhr.responseText);
          reject(xhr);
        },
      });
    });
  }
  async getDownloadUrl(file_id, drive_id = null) {
    drive_id || (drive_id = await this.getDefaultDriveId());
    let url = this.baseApiUrl + '/v2/file/get_download_url';
    const headers = await this.getHeaders();
    let data = {
      file_id: file_id,
      drive_id: drive_id,
    };
    return (await gmHttp.post(url, data, headers)).url;
  }
  async _createBackupFolder(folderName) {
    const fileList = await this.getFileList();
    let folderObj = null;
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      if (file.name === folderName) {
        folderObj = file;
        break;
      }
    }
    if (!folderObj) {
      show.info('Backup directory does not exist, creating it');
      folderObj = await this.createFolder(folderName);
    }
    this.backupFolderId = folderObj.file_id;
  }
  async backup(folderName, fileName, uploadContent) {
    if (this.backupFolderId)
      await this.uploadFile(this.backupFolderId, fileName, uploadContent);
    else {
      await this._createBackupFolder(folderName);
      await this.uploadFile(this.backupFolderId, fileName, uploadContent);
    }
  }
  async getBackupList(folderName) {
    let dataList;
    if (this.backupFolderId)
      dataList = await this.getFileList(this.backupFolderId);
    else {
      await this._createBackupFolder(folderName);
      dataList = await this.getFileList(this.backupFolderId);
    }
    const fileList = [];
    dataList.forEach((data) => {
      fileList.push({
        name: data.name,
        fileId: data.file_id,
        createTime: data.created_at,
        size: data.size,
      });
    });
    return fileList;
  }
}
class WebDavApi {
  constructor(davUrl, username, password) {
    this.davUrl = davUrl.endsWith('/') ? davUrl : davUrl + '/';
    this.username = username;
    this.password = password;
    this.folderName = null;
  }
  _getAuthHeaders() {
    return {
      Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
      Depth: '1',
    };
  }
  _sendRequest(method, path, headers = {}, data) {
    return new Promise((resolve, reject) => {
      const url = this.davUrl + path,
        allHeaders = {
          ...this._getAuthHeaders(),
          ...headers,
        };
      GM_xmlhttpRequest({
        method: method,
        url: url,
        headers: allHeaders,
        data: data,
        onload: (response) => {
          if (response.status >= 200 && response.status < 300)
            resolve(response);
          else {
            console.error(response);
            reject(
              new Error(
                `Request failed ${response.status}: ${response.statusText}`,
              ),
            );
          }
        },
        onerror: (response) => {
          console.error('Error occurred when requesting WebDav:', response);
          reject(
            new Error(
              'WebDav request failed, please check if the service is running and credentials are correct',
            ),
          );
        },
      });
    });
  }
  async backup(folderName, fileName, uploadContent) {
    await this._sendRequest('MKCOL', folderName);
    const path = folderName + '/' + fileName;
    await this._sendRequest(
      'PUT',
      path,
      {
        'Content-Type': 'text/plain',
      },
      uploadContent,
    );
  }
  async getFileList(folderName) {
    var _a2, _b, _c;
    const xmlResponse = (
        await this._sendRequest(
          'PROPFIND',
          folderName,
          {
            'Content-Type': 'application/xml',
          },
          '<?xml version="1.0"?>\n                <d:propfind xmlns:d="DAV:">\n                    <d:prop>\n                        <d:displayname />\n                        <d:getcontentlength />\n                        <d:creationdate />\n                        <d:getlastmodified />\n                        <d:iscollection />\n                    </d:prop>\n                </d:propfind>\n            ',
        )
      ).responseText,
      items = new DOMParser()
        .parseFromString(xmlResponse, 'text/xml')
        .getElementsByTagNameNS('DAV:', 'response'),
      fileList = [];
    for (let i = 0; i < items.length; i++) {
      if (0 === i) continue;
      let item = items[i];
      console.log(item);
      const name2 = item.getElementsByTagNameNS('DAV:', 'displayname')[0]
          .textContent,
        size =
          (null ==
          (_a2 = item.getElementsByTagNameNS('DAV:', 'getcontentlength')[0])
            ? void 0
            : _a2.textContent) || '0',
        createTime =
          (null == (_b = item.getElementsByTagNameNS('DAV:', 'creationdate')[0])
            ? void 0
            : _b.textContent) ||
          (null ==
          (_c = item.getElementsByTagNameNS('DAV:', 'getlastmodified')[0])
            ? void 0
            : _c.textContent) ||
          '';
      '0' !== size &&
        fileList.push({
          fileId: name2,
          name: name2,
          size: Number(size),
          createTime: createTime,
        });
    }
    fileList.reverse();
    return fileList;
  }
  async deleteFile(fileId) {
    let path = this.folderName + '/' + encodeURI(fileId);
    await this._sendRequest('DELETE', path, {
      'Cache-Control': 'no-cache',
    });
  }
  async getBackupList(folderName) {
    this.folderName = folderName;
    await this._sendRequest('MKCOL', folderName);
    return this.getFileList(folderName);
  }
  async getFileContent(filePath) {
    let path = this.folderName + '/' + filePath;
    return (
      await this._sendRequest('GET', path, {
        Accept: 'application/octet-stream',
      })
    ).responseText;
  }
}

class SettingPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'folderName', 'JHS-DataBackup');
    __publicField(this, 'cacheItems', [
      {
        key: 'jhs_dmm_video',
        text: '🎥 Preview Video Cache',
        title: 'Preview video cache',
      },
      {
        key: 'jhs_other_site',
        text: '🌍 Third-party Site Cache',
        title:
          'Third-party site resource detection results, such as missav, 123Av, etc.',
      },
      {
        key: 'jhs_screenShot',
        text: '🖼️ Thumbnail Cache',
        title: 'Thumbnail cache',
      },
      {
        key: 'jhs_translate',
        text: '🆎 Title Translation',
        title: 'Title translation',
      },
      {
        key: 'jhs_actress_info',
        text: '👩 Actress Information',
        title: 'Actress age, measurements and other data information',
      },
      {
        key: 'jhs_score_info',
        text: '⭐ Top250|Trending Score Data',
        title: 'Top250 and trending score data',
      },
    ]);
  }
  getName() {
    return 'SettingPlugin';
  }
  async initCss() {
    const settingObj = await storageManager.getSetting();
    let containerWidth =
        (null == settingObj ? void 0 : settingObj.containerWidth) ?? '100',
      containerColumns =
        utils.isMobile() && window.innerWidth < 1e3
          ? 1
          : (null == settingObj ? void 0 : settingObj.containerColumns) ?? 5;
    this.applyImageMode().then();
    let containerWidthCss = `\n            section .container{\n                max-width: 1000px !important;\n                min-width: ${containerWidth}%;\n            }\n            .movie-list, .movie-list.v{\n                grid-template-columns: repeat(${containerColumns}, minmax(0, 1fr));\n            }\n        `;
    isJavBus &&
      (containerWidthCss = `\n                .container-fluid .row{\n                    max-width: 1000px !important;\n                    min-width: ${containerWidth}%;\n                    margin: auto auto;\n                }\n                \n                .container {\n                    max-width: 1000px !important;\n                    min-width: 80%;\n                    margin: auto auto;\n                }\n                \n                .masonry {\n                    grid-template-columns: repeat(${containerColumns}, minmax(0, 1fr));\n                }\n            `);
    return `\n            <style>\n                ${containerWidthCss}\n                .nav-btn::after {\n                    content:none !important;\n                }\n                \n                #cache-data-display pre {\n                    font-family: Consolas, Monaco, 'Andale Mono', monospace;\n                    white-space: pre-wrap;\n                    word-wrap: break-word;\n                    line-height: 1.5;\n                    color: #333;\n                    border: 1px solid #ddd;\n                }\n                \n                .cache-item {\n                    transition: all 0.2s ease;\n                }\n                .cache-item:hover {\n                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n                    transform: translateY(-2px);\n                }\n\n                .tooltip-icon {\n                    display: inline-block;\n                    width: 16px;\n                    height: 16px;\n                    line-height: 16px;\n                    text-align: center;\n                    border-radius: 50%;\n                    background-color: #ccc;\n                    color: white;\n                    font-size: 12px;\n                    margin-right: 5px;\n                    cursor: help;\n                }\n                .setting-item {\n                    display: flex;\n                    align-items: baseline;\n                    justify-content: space-between;\n                    margin-bottom: 3px;\n                    padding: 3px;\n                    /*border: 1px solid #ddd;\n                    border-radius: 5px;*/\n                }\n                .simple-setting .setting-item{\n                    align-items:center;\n                }\n                .setting-label {\n                    font-size: 14px;\n                    min-width: 160px;\n                    font-weight: bold;\n                    margin-right: 10px;\n                }\n                .form-content{\n                    max-width: 160px;\n                    min-width: 160px;\n                }\n                .form-content * {\n                    width: 100%;\n                    padding: 5px;\n                    margin-right: 10px;\n                    text-align: center;\n                }\n                \n                .keyword-label {\n                    display: inline-flex;\n                    align-items: center;\n                    padding: 4px 8px;\n                    border-radius: 4px;\n                    font-size: 14px;\n                    position: relative;\n                    margin-left: 8px;\n                    margin-bottom: 5px;\n                }\n                .keyword-remove {\n                    margin-left: 6px;\n                    cursor: pointer;\n                    font-size: 12px;\n                    line-height: 1;\n                }\n                .keyword-input {\n                    padding: 6px 12px;\n                    border: 1px solid #ccc;\n                    border-radius: 4px;\n                    font-size: 14px;\n                    float:right;\n                }\n                .add-tag-btn {\n                    padding: 6px 12px;\n                    background-color: #e2e8f0;\n                    color: #334155;\n                    border: none;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 14px;\n                    margin-left: 8px;\n                    float:right;\n                }\n                .add-tag-btn:hover {\n                    background-color: #cbd5e1;\n                }\n                .tag-box {\n                    margin-top:15px;\n                }\n                \n                \n                #saveBtn,#moreBtn,#helpBtn,#clean-all {\n                    padding: 8px 20px;\n                    background-color: #4CAF50;\n                    color: white;\n                    border: none;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 16px;\n                    margin-top: 10px;\n                }\n                #saveBtn:hover {\n                    background-color: #45a049;\n                }\n                #moreBtn {\n                    background-color: #5cb85c;\n                    color: white;\n                }\n                #moreBtn:hover {\n                    background-color: #4cae4c;\n                }\n                #helpBtn {\n                    background-color: #e67e22;\n                    color: white;\n                }\n                #helpBtn:hover {\n                    background-color: #d35400;\n                }\n                .simple-setting, .mini-simple-setting {\n                    display: none;\n                    background: rgba(255,255,255,1); \n                    position: absolute;\n                    top: ${
      isJavDb ? '35px' : '25px'
    };\n                    right: ${
      isJavDb ? '-300%' : '0'
    };\n                    z-index: 1000;\n                    border: 1px solid #ddd;\n                    border-radius: 4px;\n                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n                    padding: 0;\n                    margin-top: 5px; /* Slightly pull away */\n                    color: #333;\n                }\n                \n                .mini-switch {\n                  appearance: none;\n                  -webkit-appearance: none;\n                  width: 40px;\n                  height: 20px;\n                  background: #e0e0e0;\n                  border-radius: 20px;\n                  position: relative;\n                  cursor: pointer;\n                  outline: none;\n                  /*transition: all 0.2s ease;*/\n                }\n                \n                .mini-switch:checked {\n                  background: #4CAF50;\n                }\n                \n                .mini-switch::before {\n                  content: "";\n                  position: absolute;\n                  width: 16px;\n                  height: 16px;\n                  border-radius: 50%;\n                  background: white;\n                  top: 2px;\n                  left: 2px;\n                  box-shadow: 0 1px 3px rgba(0,0,0,0.2);\n                  /*transition: all 0.2s ease;*/\n                }\n                \n                .mini-switch:checked::before {\n                  left: calc(100% - 18px);\n                }\n                \n                .side-menu-item {\n                    padding: 12px 12px;\n                    cursor: pointer;\n                    color: #333;\n                    border-left: 3px solid transparent;\n                    transition: all 0.2s;\n                    display: flex;\n                    gap: 5px;\n                }\n                \n                .side-menu-item .icon {\n                     height: 24px; \n                     width: 24px;\n                }\n                \n                .side-menu-item:hover {\n                    background-color: #e9e9e9;\n                }\n                \n                .side-menu-item.active {\n                    background-color: #e0e0e0;\n                    border-left: 3px solid #5d87c2;\n                    font-weight: bold;\n                }\n                \n                .content-panel {\n                    display: none;\n                    margin-top:20px;\n                    padding: 0 10px 10px 0;\n                    height: 100%;\n                    overflow-x: hidden;\n                    overflow-y: auto;\n                }\n                \n                .content-panel.active {\n                    display: block;\n                }\n                \n                input[type="checkbox"]:disabled {\n                    opacity: 0.6; \n                    cursor: default !important;\n                }\n            </style>\n        `;
  }
  async handle() {
    (await storageManager.getSetting('enableClog', YES)) === YES && clog.show();
    if (isJavDb) {
      let handleResize2 = function () {
        if ($('.navbar-search').is(':hidden')) {
          $('.mini-setting-box').hide();
          $('.setting-box').show();
        } else {
          $('.mini-setting-box').show();
          $('.setting-box').hide();
        }
      };
      $('#navbar-menu-user .navbar-end').prepend(
        `<div class="navbar-item has-dropdown is-hoverable setting-box" style="position:relative;">\n                    <a id="setting-btn" class="navbar-link nav-btn" style="color: #ff8400 !important;padding-right:15px !important;">\n                        ${this.settingSvg}\n                    </a>\n                    <div class="simple-setting"></div>\n                </div>`,
      );
      utils.loopDetector(
        () => $('#miniHistoryBtn').length > 0,
        () => {
          $('.miniHistoryBtnBox').before(
            `\n                    <div class="navbar-item mini-setting-box" style="position:relative;margin-left: auto;">\n                        <a id="mini-setting-btn" class="navbar-link nav-btn" style="color: #ff8400 !important;padding-left:0 !important;padding-right:0 !important;">\n                        ${this.settingSvg}\n                    </a>\n                        <div class="mini-simple-setting"></div>\n                    </div>\n                `,
          );
          handleResize2();
        },
      );
      $(window).resize(handleResize2);
    }
    if (isJavBus) {
      utils.loopDetector(
        () => $('#waitCheckBtn').length,
        () => {
          $('#waitCheckBtn')
            .parent()
            .append(
              '\n                    <div id="top-right-box" style="position: relative; display: flex; flex-grow: 1;justify-content: flex-end;z-index: 12345679 !important;">\n                        <div class="setting-box">\n                            <a id="setting-btn" class="menu-btn main-tab-btn" style="background-color:#6e685e !important;">\n                                <span>Settings</span>\n                            </a>\n                            <div class="simple-setting"></div>\n                        </div>\n                    </div>\n               ',
            );
        },
        1,
        1e4,
        !1,
      );
      isDetailPage &&
        $('h3').before(
          '\n                    <div class="container-fluid" style="margin-top:20px">\n                        <div id="top-right-box" style="position: relative; display: flex; flex-grow: 1;justify-content: flex-end;z-index: 12345679 !important;">\n                            <div class="setting-box">\n                                <a id="setting-btn" class="menu-btn main-tab-btn" style="background-color:#6e685e !important;">\n                                    <span>Settings</span>\n                                </a>\n                                <div class="simple-setting"></div>\n                            </div>\n                        </div>\n                    </div>\n               ',
        );
    }
    $('.main-nav, .container-fluid').on(
      'click',
      '#setting-btn, #mini-setting-btn',
      () => {
        clog.lowZIndex();
        this.openSettingDialog();
      },
    );
    $('.main-nav, .container-fluid')
      .on('mouseenter', '.setting-box', async () => {
        $('.simple-setting')
          .html(await this.simpleSetting())
          .show();
        this.initSimpleSettingForm().then();
        clog.lowZIndex();
      })
      .on('mouseleave', '.setting-box', () => {
        $('.simple-setting').html('').hide();
      });
    $('.main-nav, .container-fluid')
      .on('mouseenter', '.mini-setting-box', async () => {
        $('.mini-simple-setting')
          .html(await this.simpleSetting())
          .show();
        this.initSimpleSettingForm().then();
        clog.lowZIndex();
      })
      .on('mouseleave', '.mini-setting-box', () => {
        $('.mini-simple-setting').html('').hide();
      });
  }
  async openSettingDialog(defaultActivePanel = 'backup-panel', fun) {
    const buttonsHTML = this.cacheItems
      .map(
        (item) =>
          `\n            <div class="cache-item" style="border: 1px solid #eee; border-radius: 8px; padding: 12px;">\n                <div style="font-weight: bold; margin-bottom: 8px;">${item.text}</div>\n                <div style="display: flex; gap: 8px;">\n                    <a class="menu-btn clean-btn" data-key="${item.key}" style="background-color:#448cc2; flex:1; text-align:center;" title="${item.title}">\n                        <span>Clear</span>\n                    </a>\n                    <a class="menu-btn view-btn" data-key="${item.key}" style="background-color:#b2bec0; flex:1; text-align:center;" >\n                        <span>View</span>\n                    </a>\n                </div>\n            </div>\n        `,
      )
      .join('');
    let videoQualityHtml = '';
    qualityOptions.forEach((option) => {
      option.canSelect &&
        (videoQualityHtml += `<option value="${option.quality}">${option.text}</option>`);
    });
    const coverButtonPlugin = this.getBean('CoverButtonPlugin');
    let settingHtml = `\n            <div style="display: flex; height: 100%;">\n                <div style="width: 140px; flex-shrink: 0; padding: 15px 0; background: #f5f5f5; border-right: 1px solid #ddd;">\n                    <div class="side-menu-item ${
      'backup-panel' === defaultActivePanel ? 'active' : ''
    }" data-panel="backup-panel">💾 Data Backup</div>\n                    <div class="side-menu-item ${
      'base-panel' === defaultActivePanel ? 'active' : ''
    }" data-panel="base-panel">⚙️ Basic Settings</div>\n                    <div class="side-menu-item ${
      'filter-panel' === defaultActivePanel ? 'active' : ''
    }" data-panel="filter-panel">🚫 Filter Settings</div>\n                    <div class="side-menu-item ${
      'task-panel' === defaultActivePanel ? 'active' : ''
    }" data-panel="task-panel">📋 Scheduled Tasks</div>\n                    <div class="side-menu-item ${
      'domain-panel' === defaultActivePanel ? 'active' : ''
    }" data-panel="domain-panel" title="Third-party video resource domain configuration">🌐 External Websites</div>\n                    <div class="side-menu-item ${
      'hotkey-panel' === defaultActivePanel ? 'active' : ''
    }" data-panel="hotkey-panel">⌨️ Hotkey Settings</div>\n                    <div class="side-menu-item ${
      'cache-panel' === defaultActivePanel ? 'active' : ''
    }" data-panel="cache-panel">🧹 Clear Cache</div>\n                    <div class="side-menu-item ${
      'tip-author-panel' === defaultActivePanel ? 'active' : ''
    }" data-panel="tip-author-panel">💵 Tip Author</div>\n                </div>\n        \n                <div style="flex: 1; display: flex; flex-direction: column; height: 100%; ">\n                    <div style="flex: 1; margin: 0 10px; padding-bottom: 20px;overflow: hidden">\n                    \n                        \x3c!-- Alibaba Cloud Disk Panel --\x3e\n                        <div id="backup-panel" class="content-panel" style="display: ${
      'backup-panel' === defaultActivePanel ? 'block' : 'none'
    };">\n                            <div style="margin-bottom: 20px">\n                                <a id="importBtn" class="menu-btn" style="background-color:#d25a88"><span>Import Data</span></a>\n                                <a id="exportBtn" class="menu-btn" style="background-color:#85d0a3"><span>Export Data</span></a>\n                                <a id="getRefreshTokenBtn" class="menu-btn fr-btn" style="background-color:#c4a35e"><span>Get refresh_token</span></a>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">Aliyun Drive Backup</span>\n                                <div>\n                                    <a id="backupListBtn" class="menu-btn" style="background-color:#5d87c2"><span>View Backups</span></a>\n                                    <a id="backupBtn" class="menu-btn" style="background-color:#64bb69"><span>Backup Data</span></a>\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">refresh_token:</span>\n                                <div class="form-content">\n                                    <input id="refresh_token">\n                                </div>\n                            </div>\n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">WebDav Backup</span>\n                                <div>\n                                    <a id="webdavBackupListBtn" class="menu-btn" style="background-color:#5d87c2"><span>View Backups</span></a>\n                                    <a id="webdavBackupBtn" class="menu-btn" style="background-color:#64bb69"><span>Backup Data</span></a>\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">Service Address:</span>\n                                <div class="form-content">\n                                    <input id="webDavUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">Username:</span>\n                                <div class="form-content">\n                                    <input id="webDavUsername">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">Password:</span>\n                                <div class="form-content">\n                                    <input id="webDavPassword">\n                                </div>\n                            </div>                            \n                        </div>\n                        \n                        \n                        \x3c!-- Basic Settings Panel --\x3e\n                        <div id="base-panel" class="content-panel" style="display: ${
      'base-panel' === defaultActivePanel ? 'block' : 'none'
    };">\n                            <div class="setting-item">\n                                <span class="setting-label">Identified tag display position:</span>\n                                <div class="form-content">\n                                    <select id="tagPosition">\n                                        <option value="rightTop">Top Right</option>\n                                        <option value="leftTop">Top Left</option>\n                                    </select>\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">Identified content handling method:</span>\n                                <div class="form-content">\n                                    <select id="movieShowType">\n                                        <option value="hide">Hide</option>\n                                        <option value="visibility">Transparent</option>\n                                    </select>\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label" style="display:flex; align-items:center; gap:5px">\n                                    Identify and add actress information <span data-tip="Actress names cannot be obtained when identifying on the list page. If enabled, the detail page will be parsed to supplement actress names, which takes about 1 second longer due to additional requests.">❓</span>\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableSaveActressCarInfo" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div class="setting-item" style="margin-top:10px">\n                                <span class="setting-label">\n                                    List Page Function Buttons\n                                </span>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">Button - Open Pending:</span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="showWaitCheckBtn" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">Button - Open Favorites:</span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="showWaitDownBtn" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">Number of windows for 'Open Pending' | 'Open Favorites':</span>\n                                <div class="form-content">\n                                    <input type="number" id="waitCheckCount" min="1" max="20" style="width: 100%;">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">Randomly open favorites:</span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="randomOpenWaitDown" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div class="setting-item" style="margin-top:10px">\n                                <span class="setting-label">\n                                    Cover Shortcut Buttons\n                                </span>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label" style="display:flex; align-items:center; gap:5px">\n                                    ${
      coverButtonPlugin.screenSvg
    }Long Thumbnail:\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableScreenSvg" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label" style="display:flex; align-items:center; gap:5px">\n                                    ${
      coverButtonPlugin.videoSvg
    }Preview Video:\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableVideoSvg" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label" style="display:flex; align-items:center; gap:5px">\n                                    ${
      coverButtonPlugin.handleSvg
    }Identify Button:\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableHandleSvg" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label" style="display:flex; align-items:center; gap:5px">\n                                    ${
      coverButtonPlugin.siteSvg
    }Third-party Jump:\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableSiteSvg" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label" style="display:flex; align-items:center; gap:5px">\n                                    ${
      coverButtonPlugin.copySvg
    }Copy Button:\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableCopySvg" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n\n                            <div class="setting-item">\n                                <span class="setting-label">Default preview video quality:</span>\n                                <div class="form-content">\n                                    <select id="videoQuality">\n                                        ${videoQualityHtml}\n                                    </select>\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">Number of comments:</span>\n                                <div class="form-content">\n                                    <select id="reviewCount">\n                                        <option value="10">10 entries</option>\n                                        <option value="20">20 entries</option>\n                                        <option value="30">30 entries</option>\n                                        <option value="40">40 entries</option>\n                                        <option value="50">50 entries</option>\n                                    </select>\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item ${
      isJavDb ? '' : 'do-hide'
    }">\n                                <span class="setting-label">\n                                    Highlight favorited actresses <span data-tip="Detail page, highlight favorited actresses with a border">❓</span>\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableFavoriteActresses" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item ${
      isJavDb ? '' : 'do-hide'
    }">\n                                <span id="highlightedTagLabel" class="setting-label">\n                                    Category Tag|Highlighted Actor - Border Style:\n                                </span>\n                                <div class="form-content" style="display: flex; align-items: center;">\n                                    <input type="number" id="highlightedTagNumber" min="0" max="20">\n                                    <input type="color" id="highlightedTagColor">\n                                </div>\n                            </div>\n\n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">Request Timeout (ms):</span>\n                                <div class="form-content">\n                                    <input type="number" id="httpTimeout" min="1000" max="10000" style="width: 100%;">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">Request Failed Retry Count:</span>\n                                <div class="form-content">\n                                    <input type="number" id="httpRetryCount" min="0" max="10" style="width: 100%;">\n                                </div>\n                            </div>\n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">\n                                    Enable Console Log:\n                                </span>\n                                <div class="form-content">\n                                    <select id="enableClog">\n                                        <option value="no">Disable</option>\n                                        <option value="yes">Enable</option>\n                                    </select>\n                                </div>\n                            </div>\n\n                            <div class="setting-item">\n                                <span class="setting-label">Max log lines:</span>\n                                <div class="form-content">\n                                    <input type="number" id="clogMsgCount" min="100" max="3000" style="width: 100%;">\n                                </div>\n                            </div>\n                        </div>\n                        \n                        \x3c!-- Scheduled Tasks --\x3e\n                        <div id="task-panel" class="content-panel" style="display: ${
      'task-panel' === defaultActivePanel ? 'block' : 'none'
    };">\n                        \n                            <div class="setting-item">\n                                <span class="setting-label">Concurrent requests:</span>\n                                <div class="form-content">\n                                    <input type="number" id="checkConcurrencyCount" min="2" max="5" style="width: 100%;">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">Request interval (ms):</span>\n                                <div class="form-content">\n                                    <input type="number" id="checkRequestSleep" min="0" max="3000" style="width: 100%;">\n                                </div>\n                            </div>\n                        \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                        \n                            <div id="setting-blacklist" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;">\n                                <span style="font-size: 14px; font-weight: bold; padding:3px">Automatically detect and filter blacklisted actors</span>\n                                <div class="setting-item">\n                                    <span class="setting-label">\n                                        Task switch: <span data-tip="Changes take effect after page refresh">❓</span> \n                                    </span>\n                                    <div class="form-content">\n                                        <select id="enableCheckBlacklist">\n                                            <option value="no">Disable</option>\n                                            <option value="yes">Enable</option>\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">Task interval:</span>\n                                    <div class="form-content">\n                                         <select id="checkBlacklist_intervalTime">\n                                            <option value="2">Every 2 hours</option>\n                                            <option value="3">Every 3 hours</option>\n                                            <option value="6">Every 6 hours</option>\n                                            <option value="12">Every 12 hours</option>\n                                            <option value="24">Every 24 hours</option>\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">Detection rule:</span>\n                                    <div class="form-content">\n                                         <select id="checkBlacklist_ruleTime">\n                                            <option value="0">Detect all</option>\n                                            <option value="8760">Do not detect inactive for more than 1 year</option>\n                                            <option value="17520">Do not detect inactive for more than 2 years</option>\n                                            <option value="26280">Do not detect inactive for more than 3 years</option>\n                                        </select>\n                                    </div>\n                                </div>\n                            </div>\n                        \n                            <div id="setting-checkFavoriteActress" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;" class="${
      isJavDb ? '' : 'do-hide'
    }">\n                                <span style="font-size: 14px; font-weight: bold; padding:3px">Automatically sync favorited actresses</span>\n                                <div class="setting-item">\n                                    <span class="setting-label">\n                                        Task switch: <span data-tip="Changes take effect after page refresh">❓</span> \n                                    </span>\n                                    <div class="form-content">\n                                        <select id="enableCheckFavoriteActress">\n                                            <option value="no">Disable</option>\n                                            <option value="yes">Enable</option>\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">Task interval:</span>\n                                    <div class="form-content">\n                                         <select id="checkFavoriteActress_IntervalTime">\n                                            <option value="12">Every 12 hours</option>\n                                            <option value="24">Every 24 hours</option>\n                                        </select>\n                                    </div>\n                                </div>\n                            </div>\n                        \n                            <div id="setting-checkNewVideo" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;" class="${
      isJavDb ? '' : 'do-hide'
    }">\n                                <span style="font-size: 14px; font-weight: bold; padding:3px">Automatically detect new works by favorited actresses</span>\n                                <div class="setting-item">\n                                    <span class="setting-label">\n                                        Task switch: <span data-tip="Changes take effect after page refresh">❓</span> \n                                    </span>\n                                    <div class="form-content">\n                                        <select id="enableCheckNewVideo">\n                                            <option value="no">Disable</option>\n                                            <option value="yes">Enable</option>\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">Task interval:</span>\n                                    <div class="form-content">\n                                         <select id="checkNewVideo_intervalTime">\n                                            <option value="2">Every 2 hours</option>\n                                            <option value="3">Every 3 hours</option>\n                                            <option value="6">Every 6 hours</option>\n                                            <option value="12">Every 12 hours</option>\n                                            <option value="24">Every 24 hours</option>\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">Detection rule:</span>\n                                    <div class="form-content">\n                                         <select id="checkNewVideo_ruleTime">\n                                            <option value="0">Detect all</option>\n                                            <option value="8760">Do not detect inactive for more than 1 year</option>\n                                            <option value="17520">Do not detect inactive for more than 2 years</option>\n                                            <option value="26280">Do not detect inactive for more than 3 years</option>\n                                        </select>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>               \n         \n                        \x3c!-- Domain Settings Panel --\x3e\n                        <div id="domain-panel" class="content-panel" style="display: ${
      'domain-panel' === defaultActivePanel ? 'block' : 'none'
    };">\n                            <div class="setting-item">\n                                <span class="setting-label">Domain - MissAv:</span>\n                                <div class="form-content">\n                                    <input id="missAvUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">Domain - Jable:</span>\n                                <div class="form-content">\n                                    <input id="jableUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">Domain - Avgle:</span>\n                                <div class="form-content">\n                                    <input id="avgleUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">Domain - JavTrailer:</span>\n                                <div class="form-content">\n                                    <input id="javTrailersUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">Domain - 123Av:</span>\n                                <div class="form-content">\n                                    <input id="av123Url">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">Domain - JavDb:</span>\n                                <div class="form-content">\n                                    <input id="javDbUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">Domain - JavBus:</span>\n                                <div class="form-content">\n                                    <input id="javBusUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">Domain - SupJav:</span>\n                                <div class="form-content">\n                                    <input id="supJavUrl">\n                                </div>\n                            </div>           \n                        </div>\n                         \n                         \x3c!-- Hotkeys --\x3e\n                        <div id="hotkey-panel" class="content-panel" style="display: ${
      'hotkey-panel' === defaultActivePanel ? 'block' : 'none'
    };">\n                            <p style="color: #c62222; font-size: 14px;font-weight: bold;margin-bottom: 10px;">Hotkeys will take effect after page refresh</p>\n                            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;">\n                                <div class="setting-item">\n                                    <span class="setting-label">🚫 Filter:</span>\n                                    <div class="form-content">\n                                        <input id="filterHotKey" placeholder="Enter hotkey" data-default-hotkey="a">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">⭐ Favorite:</span>\n                                    <div class="form-content">\n                                        <input id="favoriteHotKey" placeholder="Enter hotkey" data-default-hotkey="s">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">📥️ Downloaded:</span>\n                                    <div class="form-content">\n                                        <input id="hasDownHotKey" placeholder="Enter hotkey">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">🔍 Watched:</span>\n                                    <div class="form-content">\n                                        <input id="hasWatchHotKey" placeholder="Enter hotkey">\n                                    </div>\n                                </div>\n                                \n                                <div class="setting-item">\n                                    <span class="setting-label">\n                                        <span data-tip="On list page, hotkeys can be used when mouse is over image">❓ </span> Enable hotkeys on video list page:\n                                    </span>\n                                    <div class="form-content">\n                                        <input type="checkbox" id="enableImageHotKey" class="mini-switch">\n                                    </div>\n                                </div>\n                            </div>\n                            \n                            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;">\n                                <div class="setting-item">\n                                    <span class="setting-label">⏩ Fast Forward:</span>\n                                    <div class="form-content">\n                                        <input id="speedVideoHotKey" placeholder="Enter hotkey" data-default-hotkey="z">\n                                    </div>\n                                </div>\n                                \n                                <div class="setting-item">\n                                    <span class="setting-label">▲ Fold:</span>\n                                    <div class="form-content">\n                                        <input id="foldCategoryHotKey" placeholder="Enter hotkey">\n                                    </div>\n                                </div>\n                                \n                                <div class="setting-item">\n                                    <span class="setting-label">💻 Console:</span>\n                                    <div class="form-content">\n                                        <input id="clogHotKey" placeholder="Enter hotkey">\n                                    </div>\n                                </div>\n                            </div>\n\n\n                            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;">\n                                <span style="font-size: 14px; font-weight: bold; padding:3px">Display identified content</span>\n                                <div class="setting-item">\n                                    <span class="setting-label">Filter by single ID:</span>\n                                    <div class="form-content">\n                                        <input id="showFilterItemHotKey" placeholder="Enter hotkey">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">Filter by actor:</span>\n                                    <div class="form-content">\n                                        <input id="showFilterActorItemHotKey" placeholder="Enter hotkey">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">Filter by keyword:</span>\n                                    <div class="form-content">\n                                        <input id="showFilterKeywordItemHotKey" placeholder="Enter hotkey">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">Favorite:</span>\n                                    <div class="form-content">\n                                        <input id="showFavoriteItemHotKey" placeholder="Enter hotkey">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">Downloaded:</span>\n                                    <div class="form-content">\n                                        <input id="showHasDownItemHotKey" placeholder="Enter hotkey">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">Watched:</span>\n                                    <div class="form-content">\n                                        <input id="showHasWatchItemHotKey" placeholder="Enter hotkey">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">Show all:</span>\n                                    <div class="form-content">\n                                        <input id="showAllItemHotKey" placeholder="Enter hotkey">\n                                    </div>\n                                </div>                                \n                            </div>\n\n                        </div>\n                        \n                        \x3c!-- Filter Settings Panel --\x3e\n                        <div id="filter-panel" class="content-panel" style="display: ${
      'filter-panel' === defaultActivePanel ? 'block' : 'none'
    };">\n                            <div class="setting-item">\n                                <span class="setting-label">\n                                     Enable selection-based filtering <span data-tip="On video detail page, select text in title or comments, right-click to quickly add to filter words">❓ </span>\n                                </span>\n                                <div style="display: flex">\n                                    <input type="checkbox" id="enableTitleSelectFilter" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div id="reviewKeywordContainer">\n                                <div class="setting-item">\n                                    <span class="setting-label">Comment Filter Words:</span>\n                                    <div style="display: flex">\n                                        <input type="text" class="keyword-input" placeholder="Add filter word">\n                                        <button class="add-tag-btn">Add</button>\n                                    </div>\n                                </div>\n                                <div class="tag-box"> </div>\n                            </div>\n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div id="filterKeywordContainer">\n                                <div class="setting-item">\n                                    <span class="setting-label">Video Title Filter Words:</span>\n                                    <div style="display: flex">\n                                        <input type="text" class="keyword-input" placeholder="Add filter word">\n                                        <button class="add-tag-btn">Add</button>\n                                    </div>\n                                </div>\n                                <div class="tag-box"> </div>\n                            </div>\n                        </div>\n                        <div id="cache-panel" class="content-panel" style="display: ${
      'cache-panel' === defaultActivePanel ? 'block' : 'none'
    };">\n                            <h1 style="text-align:center;font-size: 20px;font-weight: bold">The following operations will not affect core data</h1>\n                            <br/>               \n                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;">\n                                ${buttonsHTML}\n                            </div>    \n                            <div id="cache-data-display" style="margin-top: 20px; display: none;">\n                                <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; max-height: 400px; overflow: auto;"></pre>\n                            </div>\n                        </div>                        \n                        <div id="tip-author-panel" class="content-panel" style="display: ${
      'tip-author-panel' === defaultActivePanel ? 'block' : 'none'
    };">\n                            <p style="color: #666; font-size: 0.9em;">If JAV-JHS has brought you convenience and value, please consider offering some support. Your encouragement is my biggest motivation to continue creating! Thank you for your generous support!</p>\n                            <div>\n                                <div style="display: flex; justify-content: space-around; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap;">\n                                    <div style="text-align: center; margin: 10px; flex: 1 1 30%; min-width: 150px;">\n                                        <img src="https://imgur.com/AvF0r3r.png" alt="TRC20-USDT QR Code" style="width: 350px; height: 350px; border: 1px solid #ddd; padding: 5px; display: block; margin: 0 auto 5px;">\n                                        <p>TRC20-USDT</p>\n                                        <input type="text" readonly value="TYphgzpJ2hoDTa3J7kzj5xaHWbcPAyhbd5" onclick="this.select();document.execCommand('copy');alert('Address copied!');" \n                                            style="width: 90%; padding: 5px; margin-top: 5px; border: 1px solid #a99087; background-color: #fff; text-align: center; font-size: 0.8em; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\n                                        <p style="font-size: 0.75em; color: #5a504c; margin-top: 4px;">Click address to copy</p>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    \n                    <div style="flex-shrink: 0; padding: 15px 20px; text-align: right; border-top: 1px solid #eee; background: white;display: flex; justify-content: space-between;align-items: baseline;">   \n                        <div>Current version is 3.3.6 maintenance version. Donors before November 2025 can provide screenshots to get the latest version. TG ID: <a href="https://t.me/t_19527" target="_blank">https://t.me/t_19527</a></div>\n                        <button id="saveBtn">Save Settings</button>\n                        <button id="clean-all" style="display: none">♾️ Clear All Cache</button>\n                    </div>\n                </div>\n            </div>\n        `;
    layer.open({
      type: 1,
      title: 'Settings',
      content: settingHtml,
      area: utils.getResponsiveArea(['55%', '90%']),
      scrollbar: !1,
      success: (layero, index) => {
        $(layero).find('.layui-layer-content').css('position', 'relative');
        this.loadForm();
        this.bindClick();
        utils.setupEscClose(index);
        fun && fun();
      },
      end: () => {
        this.getBean('CoverButtonPlugin').enableSvgBtn();
      },
    });
  }
  async simpleSetting() {
    let settingObj = await storageManager.getSetting();
    const showFilterItemHotKey = settingObj.showFilterItemHotKey,
      showFilterActorItemHotKey = settingObj.showFilterActorItemHotKey,
      showFilterKeywordItemHotKey = settingObj.showFilterKeywordItemHotKey,
      showFavoriteItemHotKey = settingObj.showFavoriteItemHotKey,
      showHasDownItemHotKey = settingObj.showHasDownItemHotKey,
      showHasWatchItemHotKey = settingObj.showHasWatchItemHotKey,
      showAllItemHotKey = settingObj.showAllItemHotKey;
    return `\n             <div class="jhs-scrollbar" style="margin-top:20px;max-height:90vh; overflow-y:auto;">\n                <div style="margin: 0 10px;">\n                    <div class="setting-item">\n                        <span class="setting-label">\n                            Display identified content:\n                        </span>\n                        <div class="form-content" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end;">\n                            <span style="display:inline-block; width: 100px; font-size:13px; font-weight:bold; text-align: left">Filter by single ID${
      showFilterItemHotKey ? `(${showFilterItemHotKey})` : ''
    }: </span><input type="checkbox" id="showFilterItem" class="mini-switch"><br/>\n                            <span style="display:inline-block; width: 100px; font-size:13px; font-weight:bold; text-align: left">Filter by actor${
      showFilterActorItemHotKey ? `(${showFilterActorItemHotKey})` : ''
    }: </span><input type="checkbox" id="showFilterActorItem" class="mini-switch"><br/>\n                            <span style="display:inline-block; width: 100px; font-size:13px; font-weight:bold; text-align: left">Filter by keyword${
      showFilterKeywordItemHotKey ? `(${showFilterKeywordItemHotKey})` : ''
    }: </span><input type="checkbox" id="showFilterKeywordItem" class="mini-switch"><br/>\n                            <span style="display:inline-block; width: 100px; font-size:13px; font-weight:bold; text-align: left">Favorite${
      showFavoriteItemHotKey ? `(${showFavoriteItemHotKey})` : ''
    }: </span><input type="checkbox" id="showFavoriteItem" class="mini-switch"><br/>\n                            <span style="display:inline-block; width: 100px; font-size:13px; font-weight:bold; text-align: left">Downloaded${
      showHasDownItemHotKey ? `(${showHasDownItemHotKey})` : ''
    }: </span><input type="checkbox" id="showHasDownItem" class="mini-switch"><br/>\n                            <span style="display:inline-block; width: 100px; font-size:13px; font-weight:bold; text-align: left">Watched${
      showHasWatchItemHotKey ? `(${showHasWatchItemHotKey})` : ''
    }: </span><input type="checkbox" id="showHasWatchItem" class="mini-switch"><br/>\n                        </div>\n                    </div>\n                    <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="Quickly display all identified content, reducing frequent operations on the above switches">❓ </span> Show All${
      showAllItemHotKey ? `(${showAllItemHotKey})` : ''
    }:\n                        </span>\n                        <div class="form-content" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end;">\n                            <input type="checkbox" id="showAllItem" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                    <hr style="border: 0; height: 1px; margin:10px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="Opening method for cover clicks, pop-up | new window">❓ </span>Open page as pop-up:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                             <input type="checkbox" id="dialogOpenDetail" class="mini-switch">\n                        </div>\n                    </div>      \n                    \n                    <div class="setting-item">\n                        <span class="setting-label">Close page immediately after identification:</span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="needClosePage" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                    <hr style="border: 0; height: 1px; margin:10px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n\n                    <div class="setting-item">\n                        <span class="setting-label">\n                             <span data-tip="Use waterfall mode, sorting method will be adjusted to default">❓ </span>Waterfall Mode:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="autoPage" class="mini-switch">\n                        </div>\n                    </div>\n       \n                    <div class="setting-item">\n                        <span class="setting-label">Enable title translation:</span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="translateTitle" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">Enable hover large image:</span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="hoverBigImg" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                                        \n                    <div class="setting-item">\n                        <span class="setting-label">Enable 115 video matching: </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="enable115Match" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                    <hr style="border: 0; height: 1px; margin:10px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n\n                    ${
      isJavDb
        ? '\n                    <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="Whether to display actress age, measurements, etc. on the detail page">❓ </span>Load actress information:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="enableLoadActressInfo" class="mini-switch">\n                        </div>\n                    </div>'
        : ''
    }\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="Third-party resource detection on detail page, such as missAv, 123AV">❓ </span>Load third-party video resources:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="enableLoadOtherSite" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="Load long thumbnails in the first column of the detail page image area">❓ </span>Load long thumbnails:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="enableLoadScreenShot" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                     <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="Parse more and higher quality preview videos on the detail page">❓ </span>Higher quality preview videos:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="enableLoadPreviewVideo" class="mini-switch">\n                        </div>\n                    </div>\n\n                    <hr style="border: 0; height: 1px; margin:10px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n\n                    <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="Columns 6 and above, it is recommended to enable vertical images">❓ </span>Vertical Image Mode:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="enableVerticalModel" class="mini-switch">\n                        </div>\n                    </div>\n                                    \n                    <div class="setting-item">\n                        <span class="setting-label">Page columns: <span id="showContainerColumns"></span></span>\n                        <div class="form-content">\n                            <input type="range" id="containerColumns" min="2" max="10" step="1" style="padding:5px 0">\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">Page width: <span id="showContainerWidth"></span></span>\n                        <div class="form-content">\n                            <input type="range" id="containerWidth" min="0" max="30" step="1" style="padding:5px 0">\n                        </div>\n                    </div>\n                </div>\n                <div style="padding: 0 20px 15px; text-align: right; border-top: 1px solid #eee;">   \n                    <button id="helpBtn" style="float:left;">Common Issues</button>\n                    <button id="moreBtn">More Settings</button>\n                </div>\n            </div>\n        `;
  }
  async loadForm() {
    let settingObj = await storageManager.getSetting();
    $('#videoQuality').val(settingObj.videoQuality);
    $('#reviewCount').val(settingObj.reviewCount || 20);
    $('#tagPosition').val(settingObj.tagPosition || 'rightTop');
    $('#movieShowType').val(settingObj.movieShowType || 'hide');
    $('#waitCheckCount').val(settingObj.waitCheckCount || 5);
    $('#showWaitCheckBtn').prop(
      'checked',
      !settingObj.showWaitCheckBtn || settingObj.showWaitCheckBtn === YES,
    );
    $('#showWaitDownBtn').prop(
      'checked',
      !settingObj.showWaitDownBtn || settingObj.showWaitDownBtn === YES,
    );
    $('#randomOpenWaitDown').prop(
      'checked',
      !!settingObj.randomOpenWaitDown && settingObj.randomOpenWaitDown === YES,
    );
    $('#checkConcurrencyCount').val(settingObj.checkConcurrencyCount || 2);
    $('#checkRequestSleep').val(settingObj.checkRequestSleep || 100);
    $('#enableCheckBlacklist').val(settingObj.enableCheckBlacklist || YES);
    $('#checkBlacklist_intervalTime').val(
      settingObj.checkBlacklist_intervalTime || 12,
    );
    $('#checkBlacklist_ruleTime').val(
      settingObj.checkBlacklist_ruleTime || 8760,
    );
    $('#enableCheckFavoriteActress').val(
      settingObj.enableCheckFavoriteActress || YES,
    );
    $('#checkFavoriteActress_IntervalTime').val(
      settingObj.checkFavoriteActress_IntervalTime || 24,
    );
    $('#enableCheckNewVideo').val(settingObj.enableCheckNewVideo || YES);
    $('#checkNewVideo_intervalTime').val(
      settingObj.checkNewVideo_intervalTime || 12,
    );
    $('#checkNewVideo_ruleTime').val(settingObj.checkNewVideo_ruleTime || 8760);
    const highlightedTagNumber = settingObj.highlightedTagNumber || 1,
      highlightedTagColor = settingObj.highlightedTagColor || '#ce2222';
    $('#highlightedTagNumber').val(settingObj.highlightedTagNumber || 1);
    $('#highlightedTagColor').val(settingObj.highlightedTagColor || '#ce2222');
    $('#highlightedTagLabel').css(
      'border',
      `${highlightedTagNumber}px solid ${highlightedTagColor}`,
    );
    $('#enableClog').val(settingObj.enableClog || YES);
    $('#clogMsgCount').val(settingObj.clogMsgCount || 2e3);
    $('#refresh_token').val(settingObj.refresh_token || '');
    $('#httpTimeout').val(settingObj.httpTimeout || 5e3);
    $('#httpRetryCount').val(settingObj.httpRetryCount || 3);
    $('#webDavUrl').val(settingObj.webDavUrl || '');
    $('#webDavUsername').val(settingObj.webDavUsername || '');
    $('#webDavPassword').val(settingObj.webDavPassword || '');
    $('#enableTitleSelectFilter').prop(
      'checked',
      !settingObj.enableTitleSelectFilter ||
        settingObj.enableTitleSelectFilter === YES,
    );
    $('#enableFavoriteActresses').prop(
      'checked',
      !settingObj.enableFavoriteActresses ||
        settingObj.enableFavoriteActresses === YES,
    );
    $('#enableSaveActressCarInfo').prop(
      'checked',
      !!settingObj.enableSaveActressCarInfo &&
        settingObj.enableSaveActressCarInfo === YES,
    );
    $('#enableScreenSvg').prop(
      'checked',
      !settingObj.enableScreenSvg || settingObj.enableScreenSvg === YES,
    );
    $('#enableVideoSvg').prop(
      'checked',
      !settingObj.enableVideoSvg || settingObj.enableVideoSvg === YES,
    );
    $('#enableHandleSvg').prop(
      'checked',
      !settingObj.enableHandleSvg || settingObj.enableHandleSvg === YES,
    );
    $('#enableSiteSvg').prop(
      'checked',
      !settingObj.enableSiteSvg || settingObj.enableSiteSvg === YES,
    );
    $('#enableCopySvg').prop(
      'checked',
      !settingObj.enableCopySvg || settingObj.enableCopySvg === YES,
    );
    const otherSitePlugin = this.getBean('OtherSitePlugin'),
      missAvUrl = await otherSitePlugin.getMissAvUrl(),
      jableUrl = await otherSitePlugin.getjableUrl(),
      avgleUrl = await otherSitePlugin.getAvgleUrl(),
      javTrailersUrl = await otherSitePlugin.getJavTrailersUrl(),
      av123Url = await otherSitePlugin.getAv123Url(),
      javDbUrl = await otherSitePlugin.getJavDbUrl(),
      javBusUrl = await otherSitePlugin.getJavBusUrl(),
      supJavUrl = await otherSitePlugin.getSupJavUrl();
    $('#missAvUrl').val(missAvUrl);
    $('#jableUrl').val(jableUrl);
    $('#avgleUrl').val(avgleUrl);
    $('#javTrailersUrl').val(javTrailersUrl);
    $('#av123Url').val(av123Url);
    $('#javDbUrl').val(javDbUrl);
    $('#javBusUrl').val(javBusUrl);
    $('#supJavUrl').val(supJavUrl);
    let reviewKeywordList = await storageManager.getReviewFilterKeywordList(),
      filterKeywordList = await storageManager.getTitleFilterKeyword();
    reviewKeywordList &&
      reviewKeywordList.forEach((reviewKeyword) => {
        this.addLabelTag('#reviewKeywordContainer', reviewKeyword);
      });
    filterKeywordList &&
      filterKeywordList.forEach((reviewKeyword) => {
        this.addLabelTag('#filterKeywordContainer', reviewKeyword);
      });
    ['#reviewKeywordContainer', '#filterKeywordContainer'].forEach(
      (containerId) => {
        $(`${containerId} .add-tag-btn`).on('click', (event) =>
          this.addKeyword(event, containerId),
        );
        $(`${containerId} .keyword-input`).on('keypress', (event) => {
          'Enter' === event.key && this.addKeyword(event, containerId);
        });
      },
    );
    $('#hotkey-panel [id]')
      .map((i, el) => el.id)
      .get()
      .forEach((containerId) => {
        const $element = $(`#${containerId}`),
          defaultValue =
            void 0 !== settingObj[containerId]
              ? settingObj[containerId]
              : $element.attr('data-default-hotkey') || '';
        $element
          .val(defaultValue)
          .on('input', (event) => {
            let value = $(event.target).val();
            if (
              /[\u4e00-\u9fa5]/.test(value) ||
              /^Shift[a-zA-Z0-9]+$/.test(value)
            ) {
              $(event.target).val('');
              show.error(
                'Invalid input: Chinese characters or input method conversion errors are not allowed',
              );
            }
          })
          .on('keydown', (event) => this.handleHotkeyInput(event, $element));
      });
    $('#enableImageHotKey').prop(
      'checked',
      !!settingObj.enableImageHotKey && settingObj.enableImageHotKey === YES,
    );
  }
  handleHotkeyInput(event, $input) {
    event.preventDefault();
    const hotkey = this.parseHotkey(event);
    '' !== hotkey
      ? this.isDuplicateHotkey(hotkey, $input.attr('id'))
        ? show.error('This hotkey is already used by another function!')
        : $input.val(hotkey)
      : $input.val('');
  }
  parseHotkey(event) {
    if ('Backspace' === event.key || 'Process' === event.key) return '';
    const keys = [];
    event.ctrlKey && keys.push('Ctrl');
    event.shiftKey && keys.push('Shift');
    event.altKey && keys.push('Alt');
    event.metaKey && keys.push('Cmd');
    const key =
      {
        ' ': 'Space',
        Control: 'Ctrl',
        Meta: 'Cmd',
        ArrowUp: 'Up',
        ArrowDown: 'Down',
        ArrowLeft: 'Left',
        ArrowRight: 'Right',
      }[event.key] ||
      (event.key.length > 1 ? event.key.replace('Arrow', '') : event.key);
    ['Control', 'Shift', 'Alt', 'Meta'].includes(event.key) || keys.push(key);
    return keys.length > 0 ? keys.join('+') : '';
  }
  isDuplicateHotkey(hotkey, currentInputId) {
    let isDuplicate = !1;
    $('#hotkey-panel [id]').each((i, el) => {
      if (el.id !== currentInputId && hotkey && hotkey === $(el).val()) {
        isDuplicate = !0;
        return !1;
      }
    });
    return isDuplicate;
  }
  async initSimpleSettingForm() {
    let settingObj = await storageManager.getSetting();
    $('#containerColumns').val(settingObj.containerColumns || 5);
    $('#showContainerColumns').text(settingObj.containerColumns || 5);
    $('#containerWidth').val((settingObj.containerWidth || 100) - 70);
    $('#showContainerWidth').text((settingObj.containerWidth || 100) + '%');
    $('#dialogOpenDetail').prop(
      'checked',
      !settingObj.dialogOpenDetail || settingObj.dialogOpenDetail === YES,
    );
    $('#needClosePage').prop(
      'checked',
      !settingObj.needClosePage || settingObj.needClosePage === YES,
    );
    $('#autoPage').prop(
      'checked',
      !settingObj.autoPage || settingObj.autoPage === YES,
    );
    $('#translateTitle').prop(
      'checked',
      !settingObj.translateTitle || settingObj.translateTitle === YES,
    );
    $('#enableLoadActressInfo').prop(
      'checked',
      !settingObj.enableLoadActressInfo ||
        settingObj.enableLoadActressInfo === YES,
    );
    $('#enableLoadOtherSite').prop(
      'checked',
      !settingObj.enableLoadOtherSite || settingObj.enableLoadOtherSite === YES,
    );
    $('#containerColumns').on('input', async (event) => {
      let columns = $('#containerColumns').val();
      $('#showContainerColumns').text(columns);
      if (isJavDb) {
        document.querySelector(
          '.movie-list',
        ).style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
      }
      if (isJavBus) {
        document.querySelector(
          '.masonry',
        ).style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
      }
      await storageManager.saveSettingItem('containerColumns', columns);
      this.applyImageMode();
    });
    $('#containerWidth').on('input', async (event) => {
      let containerWidth = parseInt($(event.target).val());
      const value = containerWidth + 70 + '%';
      $('#showContainerWidth').text(value);
      if (isJavDb) {
        document.querySelector('section .container').style.minWidth = value;
      }
      if (isJavBus) {
        document.querySelector('.container-fluid .row').style.minWidth = value;
      }
      storageManager.saveSettingItem('containerWidth', containerWidth + 70);
    });
    $('#dialogOpenDetail').on('change', (event) => {
      let dialogOpenDetail = $('#dialogOpenDetail').is(':checked') ? YES : NO;
      storageManager.saveSettingItem('dialogOpenDetail', dialogOpenDetail);
    });
    $('#showFilterItem').prop(
      'checked',
      !!settingObj.showFilterItem && settingObj.showFilterItem === YES,
    );
    $('#showFilterActorItem').prop(
      'checked',
      !!settingObj.showFilterActorItem &&
        settingObj.showFilterActorItem === YES,
    );
    $('#showFilterKeywordItem').prop(
      'checked',
      !!settingObj.showFilterKeywordItem &&
        settingObj.showFilterKeywordItem === YES,
    );
    $('#showFavoriteItem').prop(
      'checked',
      !settingObj.showFavoriteItem || settingObj.showFavoriteItem === YES,
    );
    $('#showHasDownItem').prop(
      'checked',
      !settingObj.showHasDownItem || settingObj.showHasDownItem === YES,
    );
    $('#showHasWatchItem').prop(
      'checked',
      !settingObj.showHasWatchItem || settingObj.showHasWatchItem === YES,
    );
    $('#showFilterItem').on('change', async (event) => {
      let showFilterItem = $('#showFilterItem').is(':checked') ? YES : NO;
      await storageManager.saveSettingItem('showFilterItem', showFilterItem);
      window.refresh();
    });
    $('#showFilterActorItem').on('change', async (event) => {
      let showFilterActorItem = $('#showFilterActorItem').is(':checked')
        ? YES
        : NO;
      await storageManager.saveSettingItem(
        'showFilterActorItem',
        showFilterActorItem,
      );
      window.refresh();
    });
    $('#showFilterKeywordItem').on('change', async (event) => {
      let showFilterKeywordItem = $('#showFilterKeywordItem').is(':checked')
        ? YES
        : NO;
      await storageManager.saveSettingItem(
        'showFilterKeywordItem',
        showFilterKeywordItem,
      );
      window.refresh();
    });
    $('#showFavoriteItem').on('change', async (event) => {
      let showFavoriteItem = $('#showFavoriteItem').is(':checked') ? YES : NO;
      await storageManager.saveSettingItem(
        'showFavoriteItem',
        showFavoriteItem,
      );
      window.refresh();
    });
    $('#showHasDownItem').on('change', async (event) => {
      let showHasDownItem = $('#showHasDownItem').is(':checked') ? YES : NO;
      await storageManager.saveSettingItem('showHasDownItem', showHasDownItem);
      window.refresh();
    });
    $('#showHasWatchItem').on('change', async (event) => {
      let showHasWatchItem = $('#showHasWatchItem').is(':checked') ? YES : NO;
      await storageManager.saveSettingItem(
        'showHasWatchItem',
        showHasWatchItem,
      );
      window.refresh();
    });
    const $otherCheckboxes = $(
        '#showFilterItem, #showFilterActorItem, #showFilterKeywordItem, #showFavoriteItem, #showHasDownItem, #showHasWatchItem',
      ),
      updateOtherCheckboxesState = () => {
        const isShowAllChecked = $('#showAllItem').is(':checked');
        $otherCheckboxes.prop('disabled', isShowAllChecked);
        isShowAllChecked
          ? $otherCheckboxes.attr(
              'data-tip',
              'Please turn off "Show All" to click',
            )
          : $otherCheckboxes.removeAttr('data-tip');
      };
    $('#showAllItem').prop(
      'checked',
      !!settingObj.showAllItem && settingObj.showAllItem === YES,
    );
    $('#showAllItem').on('change', async (event) => {
      let showAllItem = $('#showAllItem').is(':checked') ? YES : NO;
      await storageManager.saveSettingItem('showAllItem', showAllItem);
      updateOtherCheckboxesState();
      window.refresh();
    });
    updateOtherCheckboxesState();
    $('#needClosePage').on('change', async (event) => {
      await storageManager.saveSettingItem(
        'needClosePage',
        $('#needClosePage').is(':checked') ? YES : NO,
      );
      window.refresh();
    });
    $('#autoPage').on('change', async (event) => {
      const autoPage = $('#autoPage').is(':checked') ? YES : NO;
      await storageManager.saveSettingItem('autoPage', autoPage);
      autoPage === YES
        ? $('#sort-toggle-btn').hide()
        : $('#sort-toggle-btn').show();
    });
    $('#translateTitle').on('change', async (event) => {
      const translateTitle = $('#translateTitle').is(':checked') ? YES : NO;
      await storageManager.saveSettingItem('translateTitle', translateTitle);
      if (translateTitle === YES) {
        await this.getBean('ListPagePlugin').doFilter();
        isDetailPage && (await this.getBean('TranslatePlugin').translate());
      } else {
        await this.getBean('ListPagePlugin').revertTranslation();
        $('.translated-title').remove();
      }
    });
    $('#hoverBigImg').prop(
      'checked',
      !!settingObj.hoverBigImg && settingObj.hoverBigImg === YES,
    );
    $('#hoverBigImg').on('change', async (event) => {
      const hoverBigImg = $('#hoverBigImg').is(':checked') ? YES : NO;
      await storageManager.saveSettingItem('hoverBigImg', hoverBigImg);
      hoverBigImg === YES
        ? (window.imageHoverPreviewObj = new ImageHoverPreview({
            selector: this.getSelector().coverImgSelector,
          }))
        : window.imageHoverPreviewObj && window.imageHoverPreviewObj.destroy();
    });
    $('#enableLoadActressInfo').on('change', async (event) => {
      const enableLoadActressInfo = $('#enableLoadActressInfo').is(':checked')
        ? YES
        : NO;
      await storageManager.saveSettingItem(
        'enableLoadActressInfo',
        enableLoadActressInfo,
      );
      enableLoadActressInfo === YES
        ? this.getBean('ActressInfoPlugin').loadActressInfo()
        : $('.actress-info').remove();
    });
    $('#enableLoadOtherSite').on('change', async (event) => {
      const enableLoadOtherSite = $('#enableLoadOtherSite').is(':checked')
        ? YES
        : NO;
      await storageManager.saveSettingItem(
        'enableLoadOtherSite',
        enableLoadOtherSite,
      );
      enableLoadOtherSite === YES
        ? this.getBean('OtherSitePlugin').loadOtherSite().then()
        : $('#otherSiteBox').remove();
    });
    $('#enableLoadScreenShot').prop(
      'checked',
      !settingObj.enableLoadScreenShot ||
        settingObj.enableLoadScreenShot === YES,
    );
    $('#enableLoadScreenShot').on('change', async (event) => {
      const enableLoadScreenShot = $('#enableLoadScreenShot').is(':checked')
        ? YES
        : NO;
      await storageManager.saveSettingItem(
        'enableLoadScreenShot',
        enableLoadScreenShot,
      );
      enableLoadScreenShot === YES
        ? this.getBean('ScreenShotPlugin').loadScreenShot().then()
        : $('.screen-container').remove();
    });
    $('#enableLoadPreviewVideo').prop(
      'checked',
      !settingObj.enableLoadPreviewVideo ||
        settingObj.enableLoadPreviewVideo === YES,
    );
    $('#enableLoadPreviewVideo').on('change', async (event) => {
      const enableLoadPreviewVideo = $('#enableLoadPreviewVideo').is(':checked')
        ? YES
        : NO;
      await storageManager.saveSettingItem(
        'enableLoadPreviewVideo',
        enableLoadPreviewVideo,
      );
    });
    $('#enable115Match').prop(
      'checked',
      !!settingObj.enable115Match && settingObj.enable115Match === YES,
    );
    $('#enable115Match').on('change', async (event) => {
      const enable115Match = $('#enable115Match').is(':checked') ? YES : NO;
      await storageManager.saveSettingItem('enable115Match', enable115Match);
      let movieList = $(this.getSelector().itemSelector).toArray();
      await this.getBean('WangPan115MatchPlugin').matchMovieList(movieList);
    });
    $('#enableVerticalModel').prop(
      'checked',
      !!settingObj.enableVerticalModel &&
        settingObj.enableVerticalModel === YES,
    );
    $('#enableVerticalModel').on('change', async (event) => {
      const enableVerticalModel = $('#enableVerticalModel').is(':checked')
        ? YES
        : NO;
      await storageManager.saveSettingItem(
        'enableVerticalModel',
        enableVerticalModel,
      );
      this.applyImageMode();
    });
    $('#moreBtn').on('click', () => {
      $('.simple-setting').html('').hide();
      this.openSettingDialog();
    });
    $('#helpBtn').on('click', () => {
      layer.open({
        type: 1,
        title: '',
        shadeClose: !0,
        scrollbar: !1,
        content: helpHtml,
        area: utils.getResponsiveArea(['50%', '90%']),
      });
    });
  }
  async applyImageMode() {
    $('#verticalImgStyle').remove();
    if ((await storageManager.getSetting('enableVerticalModel', NO)) === YES) {
      let imgPosition = '100% 50% !important';
      window.location.href.includes('/advanced_search?type=100') &&
        (imgPosition = '50% 50% !important');
      const verticalStyle = `\n                .cover {\n                    min-height: 350px !important;\n                    overflow: hidden !important;\n                    padding-top: 142% !important;\n                }\n                \n                .cover img {\n                    object-fit: cover !important;\n                    object-position: ${imgPosition};\n                }\n                \n                /* bus styles */\n                .masonry .movie-box img {\n                    min-height: 500px !important;\n                    object-fit: cover !important;\n                    object-position: top right;\n                }\n            `;
      $('<style>')
        .attr('id', 'verticalImgStyle')
        .text(verticalStyle)
        .appendTo('head');
    } else {
      const horizontalStyle =
        '\n                .cover {\n                    min-height:auto !important;\n                    padding-top: 67% !important;\n                }\n                .cover img {\n                    object-fit: contain !important;\n                    object-position: 50% 50% !important\n                }\n                \n                /* bus styles */\n                 .masonry .movie-box img {\n                    min-height:auto !important;\n                    object-fit: contain !important;\n                    object-position: top;\n                }\n            ';
      $('<style>')
        .attr('id', 'verticalImgStyle')
        .text(horizontalStyle)
        .appendTo('head');
    }
    isJavBus && this.getBean('BusImgPlugin').logImageHeightsByRow();
  }
  bindClick() {
    $('.side-menu-item').on('click', function () {
      $('.side-menu-item').removeClass('active');
      $(this).addClass('active');
      $('.content-panel').hide();
      const panelId = $(this).data('panel');
      $('#' + panelId).show();
      if ('cache-panel' === panelId) {
        $('#saveBtn').hide();
        $('#clean-all').show();
      } else {
        $('#saveBtn').show();
        $('#clean-all').hide();
      }
    });
    $('#importBtn').on('click', (event) => this.importData(event));
    $('#exportBtn').on('click', (event) => this.exportData(event));
    $('#backupBtn').on('click', (event) => this.backupData(event));
    $('#backupListBtn').on('click', (event) => this.backupListBtn(event));
    $('#webdavBackupBtn').on('click', (event) =>
      this.backupDataByWebDav(event),
    );
    $('#webdavBackupListBtn').on('click', (event) =>
      this.backupListBtnByWebDav(event),
    );
    $('#getRefreshTokenBtn').on('click', (event) =>
      layer.alert(
        'You are about to jump to Aliyun Drive. After logging in, click the floating button on the far right to get refresh_token',
        {
          yes: function (index, layero, that) {
            window.open('https://www.aliyundrive.com/drive/home');
            layer.close(index);
          },
        },
      ),
    );
    $('#saveBtn').on('click', () => this.saveForm());
    $('.clean-btn').on('click', (event) => {
      const key = $(event.currentTarget).data('key'),
        cacheItem = this.cacheItems.find((item) => item.key === key);
      localStorage.removeItem(key);
      show.ok(`${cacheItem.text} cleaned successfully`);
      $('#cache-data-display').hide();
      'jhs_dmm_video' === key && localStorage.removeItem('jhs_other_site_dmm');
    });
    $('#clean-all').on('click', () => {
      this.cacheItems.forEach((item) => localStorage.removeItem(item.key));
      show.ok('All cache cleared');
      $('#cache-data-display').hide();
      localStorage.removeItem('jhs_other_site_dmm');
    });
    $('.view-btn').on('click', (event) => {
      const key = $(event.currentTarget).data('key'),
        data = localStorage.getItem(key),
        displayDiv = $('#cache-data-display'),
        pre = displayDiv.find('pre');
      displayDiv.show();
      if (data)
        try {
          const parsedData = JSON.parse(data);
          pre.text(JSON.stringify(parsedData, null, 2));
        } catch {
          pre.text(data);
        }
      else pre.text('No data');
    });
    const $widthInput = $('#highlightedTagNumber'),
      $colorPicker = $('#highlightedTagColor'),
      $previewBox = $('#highlightedTagLabel');
    function updateBorder() {
      const currentWidth = $widthInput.val(),
        currentColor = $colorPicker.val();
      $previewBox.css('border', `${currentWidth}px solid ${currentColor}`);
    }
    $widthInput.on('input', updateBorder);
    $colorPicker.on('input', updateBorder);
  }
  async saveForm() {
    let settingObj = await storageManager.getSetting();
    settingObj.videoQuality = $('#videoQuality').val();
    settingObj.reviewCount = $('#reviewCount').val();
    settingObj.tagPosition = $('#tagPosition').val();
    settingObj.movieShowType = $('#movieShowType').val();
    settingObj.waitCheckCount = $('#waitCheckCount').val();
    settingObj.refresh_token = $('#refresh_token').val();
    settingObj.highlightedTagNumber = $('#highlightedTagNumber').val();
    settingObj.highlightedTagColor = $('#highlightedTagColor').val();
    settingObj.showWaitCheckBtn = $('#showWaitCheckBtn').is(':checked')
      ? YES
      : NO;
    settingObj.showWaitCheckBtn === YES
      ? $('#waitCheckBtn').show()
      : $('#waitCheckBtn').hide();
    settingObj.showWaitDownBtn = $('#showWaitDownBtn').is(':checked')
      ? YES
      : NO;
    settingObj.showWaitDownBtn === YES
      ? $('#waitDownBtn').show()
      : $('#waitDownBtn').hide();
    settingObj.randomOpenWaitDown = $('#randomOpenWaitDown').is(':checked')
      ? YES
      : NO;
    settingObj.checkConcurrencyCount = $('#checkConcurrencyCount').val();
    settingObj.checkRequestSleep = $('#checkRequestSleep').val();
    settingObj.enableCheckBlacklist = $('#enableCheckBlacklist').val();
    settingObj.checkBlacklist_intervalTime = $(
      '#checkBlacklist_intervalTime',
    ).val();
    settingObj.checkBlacklist_ruleTime = $('#checkBlacklist_ruleTime').val();
    settingObj.enableCheckFavoriteActress = $(
      '#enableCheckFavoriteActress',
    ).val();
    settingObj.checkFavoriteActress_IntervalTime = $(
      '#checkFavoriteActress_IntervalTime',
    ).val();
    settingObj.enableCheckNewVideo = $('#enableCheckNewVideo').val();
    settingObj.checkNewVideo_intervalTime = $(
      '#checkNewVideo_intervalTime',
    ).val();
    settingObj.checkNewVideo_ruleTime = $('#checkNewVideo_ruleTime').val();
    settingObj.httpTimeout = $('#httpTimeout').val();
    settingObj.httpRetryCount = $('#httpRetryCount').val();
    settingObj.enableClog = $('#enableClog').val();
    settingObj.enableClog === YES ? clog.show() : clog.hide();
    settingObj.clogMsgCount = $('#clogMsgCount').val();
    settingObj.webDavUrl = $('#webDavUrl').val();
    settingObj.webDavUsername = $('#webDavUsername').val();
    settingObj.webDavPassword = $('#webDavPassword').val();
    settingObj.missAvUrl = $('#missAvUrl').val().replace(/\/$/, '');
    settingObj.jableUrl = $('#jableUrl').val().replace(/\/$/, '');
    settingObj.avgleUrl = $('#avgleUrl').val().replace(/\/$/, '');
    settingObj.javTrailersUrl = $('#javTrailersUrl').val().replace(/\/$/, '');
    settingObj.av123Url = $('#av123Url').val().replace(/\/$/, '');
    settingObj.javDbUrl = $('#javDbUrl').val().replace(/\/$/, '');
    settingObj.javBusUrl = $('#javBusUrl').val().replace(/\/$/, '');
    settingObj.supJavUrl = $('#supJavUrl').val().replace(/\/$/, '');
    settingObj.enableTitleSelectFilter = $('#enableTitleSelectFilter').is(
      ':checked',
    )
      ? YES
      : NO;
    settingObj.enableFavoriteActresses = $('#enableFavoriteActresses').is(
      ':checked',
    )
      ? YES
      : NO;
    settingObj.enableSaveActressCarInfo = $('#enableSaveActressCarInfo').is(
      ':checked',
    )
      ? YES
      : NO;
    settingObj.enableScreenSvg = $('#enableScreenSvg').is(':checked')
      ? YES
      : NO;
    settingObj.enableVideoSvg = $('#enableVideoSvg').is(':checked') ? YES : NO;
    settingObj.enableHandleSvg = $('#enableHandleSvg').is(':checked')
      ? YES
      : NO;
    settingObj.enableSiteSvg = $('#enableSiteSvg').is(':checked') ? YES : NO;
    settingObj.enableCopySvg = $('#enableCopySvg').is(':checked') ? YES : NO;
    $('#hotkey-panel [id]')
      .map((i, el) => el.id)
      .get()
      .forEach((containerId) => {
        settingObj[containerId] = $(`#${containerId}`).val();
      });
    settingObj.enableImageHotKey = $('#enableImageHotKey').is(':checked')
      ? YES
      : NO;
    await storageManager.saveSetting(settingObj);
    let reviewKeywordList = [];
    $('#reviewKeywordContainer .keyword-label')
      .toArray()
      .forEach((item) => {
        let keyword = $(item)
          .text()
          .replace('×', '')
          .replace(/[\r\n]+/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .trim();
        reviewKeywordList.push(keyword);
      });
    await storageManager.saveReviewFilterKeyword(reviewKeywordList);
    let filterKeywordList = [];
    $('#filterKeywordContainer .keyword-label')
      .toArray()
      .forEach((item) => {
        let keyword = $(item)
          .text()
          .replace('×', '')
          .replace(/[\r\n]+/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .trim();
        filterKeywordList.push(keyword);
      });
    await storageManager.saveTitleFilterKeyword(filterKeywordList);
    show.ok('Saved successfully');
    window.refresh();
    const newVideoPlugin = this.getBean('NewVideoPlugin');
    newVideoPlugin && newVideoPlugin.resetBtnTip();
    this.getBean('BlacklistPlugin').resetBtnTip();
    this.getBean('BlacklistPlugin').reloadTable();
  }
  addLabelTag(containerId, keyword) {
    const $tagBox = $(`${containerId} .tag-box`);
    let $label,
      color = '#333';
    if (/^[a-z]{2,}-/i.test(keyword) && isJavDb) {
      color = '#3477ad';
      $label = $(
        `\n                <a class="keyword-label" data-keyword="${keyword}" style="background-color: #cbd5e1; color: ${color}" href="/video_codes/${keyword.replace(
          '-',
          '',
        )}" target="_blank">\n                    ${keyword}\n                    <span class="keyword-remove">×</span>\n                </a>\n            `,
      );
    } else
      $label = $(
        `\n                <div class="keyword-label" data-keyword="${keyword}" style="background-color: #cbd5e1; color: ${color}">\n                    ${keyword}\n                    <span class="keyword-remove">×</span>\n                </div>\n            `,
      );
    $label.find('.keyword-remove').click((event) => {
      event.stopPropagation();
      event.preventDefault();
      const $targetEl = $(event.currentTarget);
      const dataKeyword = $targetEl
        .closest('.keyword-label')
        .attr('data-keyword')
        .split(' ')[0];
      utils.q(
        event,
        `Are you sure you want to remove filter word ${dataKeyword}?`,
        async () => {
          $targetEl.parent().remove();
        },
      );
    });
    $tagBox.append($label);
  }
  addKeyword(event, containerId) {
    let $keywordInput = $(`${containerId} .keyword-input`);
    const keyword = $keywordInput.val().trim();
    if (keyword) {
      this.addLabelTag(containerId, keyword);
      $keywordInput.val('');
    }
  }
  importData() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target.result.toString(),
              updateJsonData = JSON.parse(content);
            layer.confirm(
              'Are you sure you want to overwrite and import?',
              {
                icon: 3,
                title: 'Confirm Overwrite',
                btn: ['Confirm', 'Cancel'],
              },
              async function (index) {
                await storageManager.importData(updateJsonData);
                show.ok('Data imported successfully');
                layer.close(index);
                location.reload();
              },
            );
          } catch (err) {
            console.error(err);
            show.error(
              'Import failed: file content is not valid JSON format ' + err,
            );
          }
        };
        reader.onerror = () => {
          show.error('Error reading file');
        };
        reader.readAsText(file);
      };
      document.body.appendChild(input);
      input.click();
      setTimeout(() => document.body.removeChild(input), 1e3);
    } catch (err) {
      console.error(err);
      show.error('Error importing data: ' + err.message);
    }
  }
  async backupData(event) {
    let loadObj = loading();
    try {
      const refresh_token = await storageManager.getSetting('refresh_token');
      if (!refresh_token) {
        show.error(
          'Please fill in refresh_token and save before trying this function',
        );
        return;
      }
      show.info('Organizing data...');
      let fileName = utils.getNowStr('_', '_') + '.json',
        uploadContent = JSON.stringify(await storageManager.exportData());
      uploadContent = simpleEncrypt(uploadContent);
      const aliyunApi = new AliyunApi(refresh_token);
      await aliyunApi.backup(this.folderName, fileName, uploadContent);
      show.ok('Backup complete');
    } catch (e) {
      console.error(e);
      show.error(e.toString());
    } finally {
      loadObj.close();
    }
  }
  async backupListBtn(event) {
    const refresh_token = await storageManager.getSetting('refresh_token');
    if (!refresh_token) {
      show.error(
        'Please fill in refresh_token and save before trying this function',
      );
      return;
    }
    let loadObj = loading();
    try {
      const aliyunApi = new AliyunApi(refresh_token),
        fileList = await aliyunApi.getBackupList(this.folderName);
      this.openFileListDialog(fileList, aliyunApi, 'Aliyun Drive');
    } catch (e) {
      console.error(e);
      show.error(`An error occurred: ${e ? e.message : e}`);
    } finally {
      loadObj.close();
    }
  }
  async backupDataByWebDav(event) {
    const settingObj = await storageManager.getSetting(),
      webDavUrl = settingObj.webDavUrl;
    if (!webDavUrl) {
      show.error(
        'Please fill in the WebDav service address and save before trying this function',
      );
      return;
    }
    const webDavUsername = settingObj.webDavUsername;
    if (!webDavUsername) {
      show.error(
        'Please fill in the WebDav username and save before trying this function',
      );
      return;
    }
    const webDavPassword = settingObj.webDavPassword;
    if (!webDavPassword) {
      show.error(
        'Please fill in the WebDav password and save before trying this function',
      );
      return;
    }
    let fileName = utils.getNowStr('_', '_') + '.json',
      uploadContent = JSON.stringify(await storageManager.exportData());
    uploadContent = simpleEncrypt(uploadContent);
    let loadObj = loading();
    try {
      const webDavApi = new WebDavApi(
        webDavUrl,
        webDavUsername,
        webDavPassword,
      );
      await webDavApi.backup(this.folderName, fileName, uploadContent);
      show.ok('Backup complete');
    } catch (e) {
      console.error(e);
      show.error(e.toString());
    } finally {
      loadObj.close();
    }
  }
  async backupListBtnByWebDav(event) {
    const settingObj = await storageManager.getSetting(),
      webDavUrl = settingObj.webDavUrl;
    if (!webDavUrl) {
      show.error(
        'Please fill in the WebDav service address and save before trying this function',
      );
      return;
    }
    const webDavUsername = settingObj.webDavUsername;
    if (!webDavUsername) {
      show.error(
        'Please fill in the WebDav username and save before trying this function',
      );
      return;
    }
    const webDavPassword = settingObj.webDavPassword;
    if (!webDavPassword) {
      show.error(
        'Please fill in the WebDav password and save before trying this function',
      );
      return;
    }
    let loadObj = loading();
    try {
      const webDavApi = new WebDavApi(
          webDavUrl,
          webDavUsername,
          webDavPassword,
        ),
        fileList = await webDavApi.getBackupList(this.folderName);
      this.openFileListDialog(fileList, webDavApi, 'WebDav');
    } catch (e) {
      console.error(e);
      show.error(`An error occurred: ${e ? e.message : e}`);
    } finally {
      loadObj.close();
    }
  }
  openFileListDialog(fileList, api, apiType) {
    layer.open({
      type: 1,
      title: apiType + ' Backup Files',
      content:
        '\n                <div style="height: 100%;overflow:hidden;"> \n                    <div id="table-container" style="height: calc(100%);"></div>\n                </div>\n            ',
      area: ['800px', '70%'],
      anim: -1,
      success: (layero) => {
        const tableObj = new Tabulator('#table-container', {
          layout: 'fitColumns',
          placeholder: 'No Data Available',
          virtualDom: !0,
          data: fileList,
          responsiveLayout: 'collapse',
          responsiveLayoutCollapse: !0,
          columnDefaults: {
            headerHozAlign: 'center',
            hozAlign: 'center',
          },
          columns: [
            {
              title: 'Filename',
              field: 'name',
              width: 200,
              headerSort: !1,
              responsive: 0,
            },
            {
              title: 'File Size',
              field: 'size',
              responsive: 1,
              headerSort: !1,
              formatter: (cell, formatterParams, onRendered) => {
                const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
                let unitIndex = 0,
                  adjustedSize = cell.getData().size;
                for (; adjustedSize >= 1024 && unitIndex < units.length - 1; ) {
                  adjustedSize /= 1024;
                  unitIndex++;
                }
                return `${
                  adjustedSize % 1 == 0
                    ? adjustedSize.toFixed(0)
                    : adjustedSize.toFixed(2)
                } ${units[unitIndex]}`;
              },
            },
            {
              title: 'Backup Date',
              field: 'createTime',
              responsive: 2,
              headerSort: !1,
              formatter: (cell, formatterParams, onRendered) => {
                const item = cell.getData();
                return `${utils.getNowStr('-', ':', item.createTime)}`;
              },
            },
            {
              title: 'Actions',
              minWidth: 250,
              responsive: 0,
              headerSort: !1,
              formatter: (cell, formatterParams, onRendered) => {
                const item = cell.getData();
                onRendered(() => {
                  const deleteButton = cell
                      .getElement()
                      .querySelector('.a-danger'),
                    downButton = cell.getElement().querySelector('.a-primary'),
                    importButton = cell
                      .getElement()
                      .querySelector('.a-success');
                  deleteButton &&
                    deleteButton.addEventListener('click', (e) => {
                      utils.q(
                        e,
                        `Are you sure you want to delete ${item.name}?`,
                        async (index) => {
                          let loadObj = loading();
                          try {
                            await api.deleteFile(item.fileId);
                            let newFileList = await api.getBackupList(
                              this.folderName,
                            );
                            tableObj.replaceData(newFileList);
                            'Aliyun Drive' === apiType
                              ? utils.alert(
                                  e,
                                  'Moved to recycle bin, please delete again from Aliyun Drive recycle bin',
                                )
                              : utils.alert(e, 'Deleted successfully');
                          } catch (e2) {
                            console.error(e2);
                            show.error(
                              `An error occurred: ${e2 ? e2.message : e2}`,
                            );
                          } finally {
                            loadObj.close();
                          }
                        },
                      );
                    });
                  downButton &&
                    downButton.addEventListener('click', async (e) => {
                      let loadObj = loading();
                      try {
                        if ('Aliyun Drive' === apiType) {
                          show.info('Getting download address...');
                          const url = await api.getDownloadUrl(item.fileId);
                          show.info('Getting file content...');
                          let content = simpleDecrypt(
                            await gmHttp.downloadFileInChunks(url, {
                              Referer: 'https://www.aliyundrive.com/',
                            }),
                          );
                          utils.download(content, item.name);
                        } else {
                          const content = simpleDecrypt(
                            await api.getFileContent(item.fileId),
                          );
                          utils.download(content, item.name);
                        }
                      } catch (e2) {
                        clog.error(e2);
                        show.error('Download failed: ' + e2);
                      } finally {
                        loadObj.close();
                      }
                    });
                  importButton &&
                    importButton.addEventListener('click', async (e) => {
                      layer.confirm(
                        `Are you sure you want to import this cloud backup data ${item.name}?`,
                        {
                          icon: 3,
                          title: 'Prompt',
                          btn: ['Confirm', 'Cancel'],
                        },
                        async (index) => {
                          layer.close(index);
                          let loadObj = loading();
                          try {
                            let respData;
                            if ('Aliyun Drive' === apiType) {
                              show.info('Getting download address...');
                              const downUrl = await api.getDownloadUrl(
                                item.fileId,
                              );
                              show.info('Getting file content...');
                              respData = await gmHttp.downloadFileInChunks(
                                downUrl,
                                {
                                  Referer: 'https://www.aliyundrive.com/',
                                },
                              );
                            } else
                              respData = await api.getFileContent(item.fileId);
                            show.info('Decrypting file content...');
                            const content = simpleDecrypt(respData);
                            show.info(
                              'Decryption complete, starting import...',
                            );
                            const updateJsonData = JSON.parse(content);
                            await storageManager.importData(updateJsonData);
                            show.ok('Import successful!');
                            window.location.reload();
                          } catch (err) {
                            console.error(err);
                            show.error(err);
                          } finally {
                            loadObj.close();
                          }
                        },
                      );
                    });
                });
                return '\n                                    <a class="a-danger">Delete</a>\n                                    <a class="a-primary">Download</a>\n                                    <a class="a-success">Import</a>\n                                ';
              },
            },
          ],
          locale: 'zh-cn',
          langs: {
            'zh-cn': {
              pagination: {
                first: 'First',
                first_title: 'First Page',
                last: 'Last',
                last_title: 'Last Page',
                prev: 'Previous',
                prev_title: 'Previous Page',
                next: 'Next',
                next_title: 'Next Page',
                all: 'All',
                page_size: 'Rows per page',
              },
            },
          },
        });
      },
    });
  }
  async exportData(event) {
    try {
      const backupData = JSON.stringify(await storageManager.exportData()),
        fileName = `${utils.getNowStr('_', '_')}.json`;
      utils.download(backupData, fileName);
      show.ok('Data exported successfully');
    } catch (err) {
      console.error(err);
      show.error('Error exporting data: ' + err.message);
    }
  }
}

const SALT = 'x7k9p3';

function simpleEncrypt(str) {
  return (SALT + str + SALT)
    .split('')
    .map((char) => {
      const code = char.codePointAt(0);
      return String.fromCodePoint(code + 5);
    })
    .join('');
}

function simpleDecrypt(encryptedStr) {
  return encryptedStr
    .split('')
    .map((char) => {
      const code = char.codePointAt(0);
      return String.fromCodePoint(code - 5);
    })
    .join('')
    .slice(SALT.length, -SALT.length);
}

class BusPreviewVideoPlugin extends BasePlugin {
  getName() {
    return 'BusPreviewVideoPlugin';
  }
  async initCss() {
    return '\n            /* Pop-up/Modal Styles */\n            .bus-preview-modal {\n                position: fixed;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                background-color: rgba(0, 0, 0, 0.95); \n                /* Key change: update z-index */\n                z-index: 12345699; \n                display: flex;\n                justify-content: center;\n                align-items: center;\n                opacity: 0; \n                visibility: hidden; \n                transition: opacity 0.2s ease;\n            }\n            .bus-preview-modal.is-open {\n                opacity: 1;\n                visibility: visible;\n            }\n            /* Vertically stack video and buttons, and center them */\n            .bus-preview-modal-content {\n                position: relative;\n                max-width: 95%; \n                max-height: 95%;\n                display: flex; \n                flex-direction: column; \n                align-items: center; \n                gap: 15px; \n            }\n            \n            /* Remove .bus-preview-close-btn styles */\n\n            /* Video player container */\n            .video-player-wrapper {\n                /* Key change: update width and max-height */\n                width: 80vw; \n                max-height: 85vh; \n                aspect-ratio: 16 / 9; \n                position: relative; \n                background-color: black; \n                max-width: 100%; \n            }\n            /* Video element */\n            .video-player-wrapper #preview-video {\n                position: absolute; \n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                display: block;\n            }\n\n            /* Quality control box (bottom buttons) */\n            .video-control-box {\n                display: flex;\n                flex-direction: row; \n                justify-content: center; \n                flex-wrap: wrap; \n                gap: 10px;\n                padding: 10px 0; \n            }\n\n            /* Button styles (retained) */\n            .video-control-btn {\n                min-width:80px;\n                padding: 6px 12px;\n                background: rgba(255,255,255,0.2);\n                color: white;\n                border: 1px solid rgba(255,255,255,0.5);\n                border-radius: 4px;\n                cursor: pointer;\n                text-align: center;\n                font-size: 14px;\n                transition: background-color 0.2s, border-color 0.2s;\n            }\n            .video-control-btn:hover {\n                background: rgba(255,255,255,0.4);\n            }\n            .video-control-btn.active {\n                background-color: #1890ff; \n                color: white;\n                font-weight: bold;\n                border: 1px solid #096dd9;\n            }\n        ';
  }
  initModal() {
    if (0 === $('#bus-preview-modal').length) {
      $('body').append(
        '\n                <div id="bus-preview-modal" class="bus-preview-modal">\n                    <div class="bus-preview-modal-content">\n                        </div>\n                </div>\n            ',
      );
      const $modal = $('#bus-preview-modal');
      $modal.on('click', (e) => {
        'bus-preview-modal' === e.target.id && this.closeVideoModal();
      });
      $(document).on('keydown', (e) => {
        'Escape' === e.key &&
          $modal.hasClass('is-open') &&
          this.closeVideoModal();
      });
    }
  }
  closeVideoModal() {
    const $previewVideo = $('#preview-video');
    $previewVideo.length > 0 && $previewVideo[0].pause();
    $('#bus-preview-modal').removeClass('is-open');
  }
  async handle() {
    if (!isDetailPage) return;
    this.initModal();
    const firstImageSrc = $(
        '#sample-waterfall .sample-box .photo-frame img:first',
      ).attr('src'),
      videoPreview = $(
        `\n            <a class="preview-video-container sample-box" style="cursor: pointer">\n                <div class="photo-frame" style="position:relative;">\n                    <img src="${firstImageSrc}" class="video-cover" alt="">\n                    <div class="play-icon" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); \n                                color:white; font-size:40px; text-shadow:0 0 10px rgba(0,0,0,0.5);">\n                        ▶\n                    </div>\n                </div>\n            </a>`,
      );
    $('#sample-waterfall').prepend(videoPreview);
    'yes' ===
      (await storageManager.getSetting('enableLoadPreviewVideo', 'yes')) &&
      getDmmVideo(this.getPageInfo().carNum, !1).then();
    let isHandlingVideo = !1,
      $preview = $('.preview-video-container');
    $preview.on('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isHandlingVideo) show.info('Loading, please do not click repeatedly');
      else {
        isHandlingVideo = !0;
        try {
          await this.handleVideo();
        } finally {
          isHandlingVideo = !1;
        }
      }
    });
    window.location.href.includes('autoPlay=1') && $preview.trigger('click');
  }
  async handleVideo() {
    const $modal = $('#bus-preview-modal'),
      $modalContent = $modal.find('.bus-preview-modal-content');
    let $previewVideo = $('#preview-video');
    if ($previewVideo.length > 0) {
      $modal.addClass('is-open');
      $previewVideo[0]
        .play()
        .catch((e) =>
          console.warn(
            'Attempted playback failed (possibly blocked by browser):',
            e,
          ),
        );
      return;
    }
    let carNum2 = this.getPageInfo().carNum;
    const dmmVideoMap = await getDmmVideo(carNum2);
    if (dmmVideoMap && 0 !== Object.keys(dmmVideoMap).length) {
      await this.createVideoPlayerAndControls(dmmVideoMap, $modalContent);
      $previewVideo = $('#preview-video');
      if ($previewVideo.length > 0) {
        $modal.addClass('is-open');
        $previewVideo[0]
          .play()
          .catch((e) =>
            console.warn(
              'Attempted playback failed (possibly blocked by browser):',
              e,
            ),
          );
      } else show.error('Video player creation failed.');
    } else show.error('No available video source found.');
  }
  async createVideoPlayerAndControls(dmmVideoMap, $container) {
    let defaultVideoQuality = await storageManager.getSetting('videoQuality');
    defaultVideoQuality = selectDefaultQuality(
      Object.keys(dmmVideoMap),
      defaultVideoQuality,
    );
    let defaultVideoUrl = dmmVideoMap[defaultVideoQuality];
    $container.html(
      `\n            <div class="video-player-wrapper">\n                <video id="preview-video" controls playsinline>\n                    <source src="${defaultVideoUrl}" />\n                </video>\n            </div>\n            <div class="video-control-box">\n                </div>\n        `,
    );
    const $videoEl = $('#preview-video'),
      $previewSource = $videoEl.find('source'),
      $qualityControlsBox = $container.find('.video-control-box');
    if (!$videoEl.length || !$previewSource.length) return;
    const videoEl = $videoEl[0],
      jhs_videoMuted = localStorage.getItem('jhs_videoMuted');
    videoEl.muted = !jhs_videoMuted || 'yes' === jhs_videoMuted;
    videoEl.addEventListener('volumechange', function () {
      localStorage.setItem('jhs_videoMuted', videoEl.muted ? 'yes' : 'no');
    });
    let buttonsHtml = '';
    qualityOptions.forEach((option) => {
      let dmmVideoUrl = dmmVideoMap[option.quality];
      if (dmmVideoUrl) {
        const isActive = defaultVideoQuality === option.quality;
        buttonsHtml += `\n                    <button class="video-control-btn${
          isActive ? ' active' : ''
        }" \n                            data-quality="${
          option.quality
        }"\n                            data-video-src="${dmmVideoUrl}">\n                        ${
          option.text
        }\n                    </button>\n                `;
      }
    });
    $qualityControlsBox.html(buttonsHtml);
    const $buttons = $qualityControlsBox.find('.video-control-btn');
    $qualityControlsBox
      .off('click')
      .on('click', '.video-control-btn', async (e) => {
        try {
          const $button = $(e.currentTarget);
          if ($button.hasClass('active')) return;
          let videoSrc = $button.attr('data-video-src');
          $previewSource.attr('src', videoSrc);
          const currentTime = videoEl.currentTime;
          videoEl.load();
          videoEl.currentTime = currentTime;
          await videoEl.play();
          $buttons.removeClass('active');
          $button.addClass('active');
        } catch (error) {
          console.error('Failed to switch quality:', error);
        }
      });
  }
}
class ImageRecognitionPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'siteList', [
      {
        name: 'Google Old', // Changed from 'Google旧版'
        url: 'https://www.google.com/searchbyimage?image_url={placeholder}&client=firefox-b-d',
        ico: 'https://www.google.com/favicon.ico',
      },
      {
        name: 'Google',
        url: 'https://lens.google.com/uploadbyurl?url={placeholder}',
        ico: 'https://www.google.com/favicon.ico',
      },
      {
        name: 'Yandex',
        url: 'https://yandex.ru/images/search?rpt=imageview&url={placeholder}',
        ico: 'https://yandex.ru/favicon.ico',
      },
    ]);
    __publicField(this, 'isUploading', !1);
  }
  getName() {
    return 'ImageRecognitionPlugin';
  }
  async initCss() {
    return '\n            <style>\n                #upload-area {\n                    border: 2px dashed #85af68;\n                    border-radius: 8px;\n                    padding: 40px;\n                    text-align: center;\n                    margin-bottom: 20px;\n                    transition: all 0.3s;\n                    background-color: #f9f9f9;\n                }\n                #upload-area:hover {\n                    border-color: #76b947;\n                    background-color: #f0f0f0;\n                }\n                /* Dragged in */\n                #upload-area.highlight {\n                    border-color: #2196F3;\n                    background-color: #e3f2fd;\n                }\n                \n                \n                #select-image-btn {\n                    background-color: #4CAF50;\n                    color: white;\n                    border: none;\n                    padding: 10px 20px;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 16px;\n                    transition: background-color 0.3s;\n                }\n                #select-image-btn:hover {\n                    background-color: #45a049;\n                }\n                \n                \n                #handle-btn, #cancel-btn {\n                    padding: 8px 16px;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 14px;\n                    border: none;\n                    transition: opacity 0.3s;\n                }\n                #handle-btn {\n                    background-color: #2196F3;\n                    color: white;\n                }\n                #handle-btn:hover {\n                    opacity: 0.9;\n                }\n                #cancel-btn {\n                    background-color: #f44336;\n                    color: white;\n                }\n                #cancel-btn:hover {\n                    opacity: 0.9;\n                }\n                \n                .search-img-site-btns-container {\n                    display: flex;\n                    flex-wrap: wrap;\n                    gap: 10px;\n                    margin-top: 15px;\n                }\n                .search-img-site-btn {\n                    display: flex;\n                    align-items: center;\n                    padding: 8px 12px;\n                    background-color: #f5f5f5;\n                    border-radius: 4px;\n                    text-decoration: none;\n                    color: #333;\n                    transition: all 0.2s;\n                    font-size: 14px;\n                    border: 1px solid #ddd;\n                }\n                .search-img-site-btn:hover {\n                    background-color: #e0e0e0;\n                    transform: translateY(-2px);\n                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);\n                }\n                .search-img-site-btn img {\n                    width: 16px;\n                    height: 16px;\n                    margin-right: 6px;\n                }\n                .search-img-site-btn span {\n                    white-space: nowrap;\n                }\n            </style>\n        ';
  }
  open(onOpenFun) {
    layer.open({
      type: 1,
      title: 'Image Recognition', // Changed from '以图识图'
      content:
        '\n            <div style="padding: 20px">\n                <div id="upload-area">\n                    <div style="color: #555;margin-bottom: 15px;">\n                        <p>Drag image here or click button to select image</p>\n                        <p>Or directly Ctrl+V paste image or Image URL</p>\n                    </div>\n                    <button id="select-image-btn">Select Image</button>\n                    <input type="file" style="display: none" id="image-file" accept="image/*">\n                </div>\n                \n                <div id="url-input-container" style="margin-top: 15px;display: none;">\n                    <input type="text" id="image-url" placeholder="Paste image URL address..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">\n                </div>\n                \n                <div id="preview-area" style="margin-bottom: 20px; text-align: center; display: none;">\n                    <img id="preview-image" alt="" src="" style="max-width: 100%; max-height: 300px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">\n                    <div style="margin-top: 15px; display: flex; justify-content: center; gap: 10px;" id="action-btns">\n                        <button id="handle-btn">Search Image</button>\n                        <button id="cancel-btn">Cancel</button>\n                    </div>\n                    \n                    <div id="search-results" style="display: none;">\n                        <p style="margin: 20px auto">Please select image recognition website：<a id="openAll" style="cursor: pointer">Open All</a></p>\n                        <div class="search-img-site-btns-container" id="search-img-site-btns-container"></div>\n                    </div>\n                </div>\n                \n            </div>\n        ', // All text changed
      area: utils.isMobile() ? utils.getResponsiveArea() : ['40%', '80%'],
      success: async (layero) => {
        this.initEventListeners();
        onOpenFun && onOpenFun();
      },
      end: () => {
        $(document).off('paste.searchImg');
      },
    });
  }
  initEventListeners() {
    const $uploadArea = $('#upload-area'),
      $fileInput = $('#image-file'),
      $selectBtn = $('#select-image-btn'),
      $previewArea = $('#preview-area'),
      $previewImage = $('#preview-image'),
      $actionBtns = $('#action-btns'),
      $searchImage = $('#handle-btn'),
      $cancelBtn = $('#cancel-btn'),
      $urlInputContainer = $('#url-input-container'),
      $imageUrlInput = $('#image-url'),
      $searchResults = $('#search-results'),
      $siteBtnsContainer = $('#search-img-site-btns-container');
    $uploadArea
      .on('dragover', (e) => {
        e.preventDefault();
        $uploadArea.addClass('highlight');
      })
      .on('dragleave', () => {
        $uploadArea.removeClass('highlight');
      })
      .on('drop', (e) => {
        e.preventDefault();
        $uploadArea.removeClass('highlight');
        if (
          e.originalEvent.dataTransfer.files &&
          e.originalEvent.dataTransfer.files[0]
        ) {
          this.handleImageFile(e.originalEvent.dataTransfer.files[0]);
          this.resetSearchUI();
        }
      });
    $selectBtn.on('click', () => {
      $fileInput.trigger('click');
    });
    $fileInput.on('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleImageFile(e.target.files[0]);
        this.resetSearchUI();
      }
    });
    $(document).on('paste.searchImg', async (e) => {
      const items = e.originalEvent.clipboardData.items;
      for (let i = 0; i < items.length; i++)
        if (-1 !== items[i].type.indexOf('image')) {
          const blob = items[i].getAsFile();
          this.handleImageFile(blob);
          this.resetSearchUI();
          return;
        }
      const text = e.originalEvent.clipboardData.getData('text');
      if (text && utils.isUrl(text)) {
        $urlInputContainer.show();
        $imageUrlInput.val(text);
        $previewImage.attr('src', text);
        $previewArea.show();
        this.resetSearchUI();
      }
    });
    $searchImage.on('click', async () => {
      const imageSrc = $previewImage.attr('src');
      if (imageSrc) {
        if (!this.isUploading) {
          this.isUploading = !0;
          try {
            const imgUrl = await this.searchByImage(imageSrc);
            $actionBtns.hide();
            $searchResults.show();
            $siteBtnsContainer.empty();
            const key = 'jhs_selectedSites',
              selectedSites = JSON.parse(localStorage.getItem(key) || '{}');
            this.siteList.forEach((site) => {
              const siteUrl = site.url.replace(
                  '{placeholder}', // Changed from '{占位符}'
                  encodeURIComponent(imgUrl),
                ),
                isChecked = !1 !== selectedSites[site.name];
              $siteBtnsContainer.append(
                `\n                        <a href="${siteUrl}" class="search-img-site-btn" target="_blank" title="${
                  site.name
                }">\n                        <input type="checkbox" \n                               class="site-checkbox" \n                               data-site-name="${
                  site.name
                }" \n                               style="margin-right: 5px"\n                               ${
                  isChecked ? 'checked' : ''
                }>\n                            <img src="${site.ico}" alt="${
                  site.name
                }">\n                            <span>${
                  site.name
                }</span>\n                        </a>\n                    `,
              );
            });
            $siteBtnsContainer.on('change', '.site-checkbox', function () {
              const siteName = $(this).data('site-name');
              selectedSites[siteName] = $(this).is(':checked');
              localStorage.setItem(key, JSON.stringify(selectedSites));
            });
            $siteBtnsContainer.show();
          } finally {
            this.isUploading = !1;
          }
        }
      } else show.info('Please paste or upload image'); // Changed from '请粘贴或上传图片'
    });
    $cancelBtn.on('click', () => {
      $previewArea.hide();
      $urlInputContainer.hide();
      $fileInput.val('');
      $imageUrlInput.val('');
    });
    $imageUrlInput.on('change', () => {
      if (utils.isUrl($imageUrlInput.val())) {
        $previewImage.attr('src', $imageUrlInput.val());
        $previewArea.show();
      }
    });
    $('#openAll').on('click', () => {
      $('.search-img-site-btn').each(function () {
        $(this).find('.site-checkbox').is(':checked') &&
          window.open($(this).attr('href'));
      });
    });
  }
  resetSearchUI() {
    $('#action-btns').show();
    $('#search-results').hide();
    $('#search-img-site-btns-container').hide().empty();
  }
  handleImageFile(file) {
    const previewImage = document.getElementById('preview-image'),
      previewArea = document.getElementById('preview-area'),
      urlInputContainer = document.getElementById('url-input-container');
    if (!file.type.match('image.*')) {
      show.info('Please select an image file'); // Changed from '请选择图片文件'
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewArea.style.display = 'block';
      urlInputContainer.style.display = 'none';
      $('#handle-btn')[0].click();
    };
    reader.readAsDataURL(file);
  }
  async searchByImage(imageSrc) {
    let loadObj = loading();
    try {
      let imageUrl = imageSrc;
      if (imageSrc.startsWith('data:')) {
        show.info('Starting image upload...'); // Changed from '开始上传图片...'
        const imgurUrl = await (async function (base64Data) {
          var _a2;
          const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
          if (!matches || matches.length < 3)
            throw new Error('Invalid Base64 image data'); // Changed from '无效的Base64图片数据'
          const mimeType = matches[1],
            imageData = matches[2],
            byteCharacters = atob(imageData),
            byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++)
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          const byteArray = new Uint8Array(byteNumbers),
            blob = new Blob([byteArray], {
              type: mimeType,
            }),
            formData = new FormData();
          formData.append('image', blob);
          const response = await fetch('https://api.imgur.com/3/image', {
              method: 'POST',
              headers: {
                Authorization: 'Client-ID d70305e7c3ac5c6',
              },
              body: formData,
            }),
            data = await response.json();
          if (data.success && data.data && data.data.link)
            return data.data.link;
          throw new Error(
            (null == (_a2 = data.data) ? void 0 : _a2.error) ||
              'Failed to upload to Imgur', // Changed from '上传到Imgur失败'
          );
        })(imageSrc);
        if (!imgurUrl) {
          show.error('Upload failed'); // Changed from '上传到失败'
          return;
        }
        imageUrl = imgurUrl;
      }
      return imageUrl;
    } catch (error) {
      show.error(`Search failed: ${error.message}`); // Changed from '搜索失败:'
      console.error('Search failed:', error); // Changed from '搜索失败:'
    } finally {
      loadObj.close();
    }
  }
}

class BusNavBarPlugin extends BasePlugin {
  getName() {
    return 'BusNavBarPlugin';
  }
  handle() {
    $('#navbar > div > div > span').append(
      '\n            <button class="btn btn-default" style="color: #0d9488" id="search-img-btn">Image Search</button>\n       ', // Changed from '识图'
    );
    $('#search-img-btn').on('click', () => {
      this.getBean('ImageRecognitionPlugin').open();
    });
  }
}

class RelatedPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'floorIndex', 1);
    __publicField(this, 'isInit', !1);
  }
  getName() {
    return 'RelatedPlugin';
  }
  async showRelated($eleBox, movieId) {
    const enableLoadRelated = await storageManager.getSetting(
        'enableLoadRelated',
        NO,
      ),
      $magnets = $eleBox;
    if (movieId) {
      $magnets.append(
        `\n            <div style="display: flex; align-items: center; margin: 16px 0; color: #666; font-size: 14px;">\n                <span style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #999, transparent);"></span>\n                <span style="padding: 0 10px;">Related Lists</span>\n                <a id="relatedFold" style="margin-left: 8px; color: #1890ff; text-decoration: none; display: flex; align-items: center;">\n                    <span class="toggle-text">${
          enableLoadRelated === YES ? 'Fold' : 'Expand'
        }</span>\n                    <span class="toggle-icon" style="margin-left: 4px;">${
          enableLoadRelated === YES ? '▲' : '▼'
        }</span>\n                </a>\n                <span style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #999, transparent);"></span>\n            </div>\n        `,
      ); // Text changed
      $('#relatedFold').on('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const $text = $('#relatedFold .toggle-text'),
          $icon = $('#relatedFold .toggle-icon'),
          isFolded = 'Expand' === $text.text();
        $text.text(isFolded ? 'Fold' : 'Expand');
        $icon.text(isFolded ? '▲' : '▼');
        if (isFolded) {
          $('#relatedContainer').show();
          $('#relatedFooter').show();
          if (!this.isInit) {
            this.fetchAndDisplayRelateds(movieId);
            this.isInit = !0;
          }
          storageManager.saveSettingItem('enableLoadRelated', YES);
        } else {
          $('#relatedContainer').hide();
          $('#relatedFooter').hide();
          storageManager.saveSettingItem('enableLoadRelated', NO);
        }
      });
      $magnets.append('<div id="relatedContainer"></div>');
      $magnets.append('<div id="relatedFooter"></div>');
      enableLoadRelated === YES &&
        (await this.fetchAndDisplayRelateds(movieId));
    } else show.error('movieId not provided'); // Changed from '未传入movieId'
  }
  async fetchAndDisplayRelateds(movieId) {
    const $relatedContainer = $('#relatedContainer'),
      $relatedFooter = $('#relatedFooter');
    $relatedContainer.append(
      '<div id="relatedLoading" style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">Fetching lists...</div>',
    ); // Changed from '获取清单中...'
    let dataList = null;
    try {
      dataList = await javDbApi.related(movieId, 1, 20);
    } catch (e) {
      console.error('Failed to get lists:', e); // Changed from '获取清单失败:'
    } finally {
      $('#relatedLoading').remove();
    }
    if (dataList)
      if (0 !== dataList.length) {
        this.displayRelateds(dataList, $relatedContainer);
        if (20 === dataList.length) {
          $relatedFooter.html(
            '\n                <button id="loadMoreRelateds" style="width:100%; background-color: #e1f5fe; border:none; padding:10px; margin-top:10px; cursor:pointer; color:#0277bd; font-weight:bold; border-radius:4px;">\n                    Load More Lists\n                </button>\n                <div id="relatedEnd" style="display:none; text-align:center; padding:10px; color:#666; margin-top:10px;">All lists loaded</div>\n            ',
          ); // Text changed
          let currentPage = 1,
            $loadMoreRelateds = $('#loadMoreRelateds');
          $loadMoreRelateds.on('click', async () => {
            $loadMoreRelateds.text('Loading...').prop('disabled', !0); // Changed from '加载中...'
            currentPage++;
            let moreData;
            try {
              moreData = await javDbApi.related(movieId, currentPage, 20);
            } catch (e) {
              console.error('Failed to load more lists:', e); // Changed from '加载更多清单失败:'
            } finally {
              $loadMoreRelateds
                .text('Loading failed, click to retry') // Changed from '加载失败, 请点击重试'
                .prop('disabled', !1);
            }
            if (moreData) {
              this.displayRelateds(moreData, $relatedContainer);
              if (moreData.length < 20) {
                $loadMoreRelateds.remove();
                $('#relatedEnd').show();
              } else
                $loadMoreRelateds.text('Load More Lists').prop('disabled', !1); // Changed from '加载更多清单'
            }
          });
        } else
          $relatedFooter.html(
            '<div style="text-align:center; padding:10px; color:#666; margin-top:10px;">All lists loaded</div>',
          ); // Changed from '已加载全部清单'
      } else
        $relatedContainer.append(
          '<div style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">No lists</div>',
        );
    // Changed from '无清单'
    else {
      $relatedContainer.append(
        '\n                <div style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">\n                    Failed to get lists\n                    <a id="retryFetchRelateds" href="javascript:;" style="margin-left: 10px; color: #1890ff; text-decoration: none;">Retry</a>\n                </div>\n            ',
      ); // Text changed
      $('#retryFetchRelateds').on('click', async () => {
        $('#retryFetchRelateds').parent().remove();
        await this.fetchAndDisplayRelateds(movieId);
      });
    }
  }
  displayRelateds(dataList, $container) {
    dataList.length &&
      dataList.forEach((item) => {
        let commentHtml = `\n                <div class="item columns is-desktop" style="display:block;margin-top:6px;background-color:#ffffff;padding:10px;margin-left: -10px;word-break: break-word;position:relative;">\n                   <span style="position:absolute;top:5px;right:10px;color:#999;font-size:12px;">#${this
          .floorIndex++}</span>\n                   <span style="position:absolute;bottom:5px;right:10px;color:#999;font-size:12px;">Creation time: ${
          // Changed from '创建时间:'
          item.createTime
        }</span>\n                   <p><a href="/lists/${
          item.relatedId
        }" target="_blank" style="color:#2e8abb">${
          item.name
        }</a></p>\n                   <p style="margin-top: 5px;">Number of videos: ${
          // Changed from '视频个数:'
          item.movieCount
        }</p>\n                   <p style="margin-top: 5px;">Collection times: ${
          // Changed from '收藏次数:'
          item.collectionCount
        } Viewed times: ${
          // Changed from '被查看次数:'
          item.viewCount
        }</p>\n                </div>\n            `;
        $container.append(commentHtml);
      });
  }
}

class WantAndWatchedVideosPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'type', null);
  }
  getName() {
    return 'WantAndWatchedVideosPlugin';
  }
  async handle() {
    if (window.location.href.includes('/want_watch_videos')) {
      $('h3').append(
        '<a class="a-primary" id="wantWatchBtn" style="padding:10px;">Import to JHS</a>', // Changed from '导入至 JHS'
      );
      $('#wantWatchBtn').on('click', (event) => {
        this.type = Status_FAVORITE;
        this.importWantWatchVideos(
          event,
          'Import "Want to Watch" videos to JHS-Favorites?',
        ); // Changed from '是否将 想看的影片 导入到 JHS-收藏?'
      });
    }
    if (window.location.href.includes('/watched_videos')) {
      $('h3').append(
        '<a class="a-success" id="wantWatchBtn" style="padding:10px;">Import to JHS</a>', // Changed from '导入至 JHS'
      );
      $('#wantWatchBtn').on('click', (event) => {
        this.type = Status_HAS_DOWN;
        this.importWantWatchVideos(
          event,
          'Import "Watched" videos to JHS-Downloaded?', // Changed from '是否将 看过的影片 导入到 JHS-已下载?'
        );
      });
    }
  }
  importWantWatchVideos(event, title) {
    utils.q(
      null,
      `${title} <br/> <span style='color: #f40'>Please backup your data before executing this function</span>`, // Changed from `执行此功能前请记得备份数据`
      async () => {
        let loadObj = loading();
        try {
          await this.parseMovieList();
        } catch (e) {
          console.error(e);
        } finally {
          loadObj.close();
        }
      },
    );
  }
  async parseMovieList($dom) {
    let movieList, nextPageLink;
    if ($dom) {
      movieList = $dom.find(this.getSelector().itemSelector);
      nextPageLink = $dom.find('.pagination-next').attr('href');
    } else {
      movieList = $(this.getSelector().itemSelector);
      nextPageLink = $('.pagination-next').attr('href');
    }
    for (const element of movieList) {
      const item = $(element),
        href = item.find('a').attr('href'),
        carNum2 = item.find('.video-title strong').text().trim(),
        publishTime = item.find('.meta').text().trim();
      if (href && carNum2)
        try {
          if (await storageManager.getCar(carNum2)) {
            show.info(`${carNum2} already exists, skipping`); // Changed from '已存在, 跳过'
            continue;
          }
          await storageManager.saveCar({
            carNum: carNum2,
            url: href,
            names: null,
            actionType: this.type,
            publishTime: publishTime,
          });
        } catch (error) {
          console.error(`Save failed [${carNum2}]:`, error); // Changed from '保存失败'
        }
    }
    if (nextPageLink) {
      show.info('Next page found, parsing:' + nextPageLink); // Changed from '发现下一页，正在解析:'
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      $.ajax({
        url: nextPageLink,
        method: 'GET',
        success: (html) => {
          const parser = new DOMParser(),
            next$dom = $(parser.parseFromString(html, 'text/html'));
          this.parseMovieList(next$dom);
        },
        error: function (err) {
          console.error(err);
          show.error('Failed to load next page:' + err.message); // Changed from '加载下一页失败:'
        },
      });
    } else {
      show.ok('Import finished!'); // Changed from '导入结束!'
      window.refresh();
    }
  }
}

class CoverButtonPlugin extends BasePlugin {
  getName() {
    return 'CoverButtonPlugin';
  }
  async initCss() {
    return `\n            <style>\n                .box .tags {\n                    justify-content: space-between;\n                }\n                .tool-box span{\n                    opacity:.3\n                }\n                .tool-box span:hover{\n                    opacity:1\n                }\n                ${
      isJavBus
        ? '.tool-box .icon, .setting-label .icon{ height: 24px; width: 24px; }'
        : ''
    }\n                .tool-box svg path {\n                  fill: blue;\n                }\n                [data-theme="dark"] .tool-box svg path {\n                  fill: white;\n                }\n                \n                \n                /* Elastic animation on hover in */\n                .elastic-in {\n                    animation: elasticIn 0.2s ease-out forwards;  /* Animation name | duration | easing function | stay at final state */\n                }\n                \n                /* Elastic animation on hover out */\n                .elastic-out {\n                    animation: elasticOut 0.2s ease-in forwards;\n                }\n                /* Elastic in animation (like jelly bouncing in) */\n                @keyframes elasticIn {\n                    0% {\n                        opacity: 0;\n                        transform: scale(0.8);  /* Start state: 80% size */\n                    }\n                    50% {\n                        opacity: 1;\n                        transform: scale(1.1);  /* Bounce to 110% (overshoot) */\n                    }\n                    70% {\n                        transform: scale(0.95); /* Bounce back to 95% (simulate elastic damping) */\n                    }\n                    100% {\n                        opacity: 1;\n                        transform: scale(1);    /* Final: restore to normal size */\n                    }\n                }\n                /* Elastic out animation (like jelly bouncing out) */\n                @keyframes elasticOut {\n                    0% {\n                        opacity: 1;\n                        transform: scale(1);    /* Start state: normal size */\n                    }\n                    30% {\n                        transform: scale(1.05); /* Bounce a little bigger (105%) */\n                    }\n                    100% {\n                        opacity: 0;\n                        transform: scale(0.8);  /* Final: shrink and disappear */\n                    }\n                }\n                \n                \n                .loading {\n                    opacity: 0.7;\n                    filter: blur(1px);\n                }\n                .loading-spinner {\n                    position: absolute;\n                    top: 50%;\n                    left: 50%;\n                    transform: translate(-50%, -50%);\n                    width: 40px;\n                    height: 40px;\n                    border: 3px solid rgba(255,255,255,.3);\n                    border-radius: 50%;\n                    border-top-color: #fff;\n                    animation: spin 1s ease-in-out infinite;\n                    z-index: 20;\n                }\n                @keyframes spin {\n                    to { transform: translate(-50%, -50%) rotate(360deg); }\n                }\n            </style>\n        `;
  }
  handle() {
    if (window.isListPage) {
      this.addSvgBtn();
      this.bindClick().then();
    }
  }
  async addSvgBtn() {
    $(this.getSelector().itemSelector)
      .toArray()
      .forEach((ele) => {
        let $box2 = $(ele);
        if (!($box2.find('.tool-box').length > 0)) {
          isJavDb &&
            $box2.find('.tags').append(
              `
                    <div class="tool-box" style="margin-left: auto; display: flex; align-items: center">
                        <span class="screenSvg" title="Long thumbnail" style="margin-right: 15px;">${this.screenSvg}</span>
                        
                        <span class="videoSvg" title="Play video" style="margin-right: 15px;">${this.videoSvg}</span>
                        
                        <div class="more-tools-container handleSvg" style="position: relative; margin-right: 15px;">
                            <div title="Identification processing" style="padding: 5px; margin: -5px;opacity:.3">${this.handleSvg}</div>
                            
                            <div class="more-tools" style=" position: absolute; bottom: 33px; right: -30px; display: none;
                                background-color: rgba(0, 0, 0, 0);z-index: 10;">
                                <a class="menu-btn hasWatchBtn" style="background-color:#d7a80c;color:black !important;margin-bottom: 5px"><span style="opacity: 1;">🔍 Watched</span></a>
                                <a class="menu-btn hasDownBtn" style="background-color:#7bc73b; color:black !important;margin-bottom: 5px"><span style="opacity: 1;">📥️ Downloaded</span></a>
                                <a class="menu-btn favoriteBtn" style="background-color:#25b1dc; color:black !important;margin-bottom: 5px"><span style="opacity: 1;">⭐ Collect</span></a>
                                <a class="menu-btn filterBtn" style="background-color:#de3333;   color:black !important;margin-bottom: 5px"><span style="opacity: 1;">🚫 Block</span></a>
                            </div>
                        </div>
                        
                        <div class="more-tools-container siteSvg"  style="position: relative; margin-right: 15px;">
                            <div title="Third-party websites" style="padding: 5px; margin: -5px;opacity:.3">${this.siteSvg}</div>
                            
                             <div class="more-tools" style=" position: absolute; bottom: 33px; right: -30px; display: none;
                                background-color: rgba(0, 0, 0, 0);z-index: 10;">
                                <a class="site-btn site-jable" style="color:black !important;margin-bottom: 5px;background-color:#71bb59;">
                                    <span style="opacity: 1;">Jable</span>
                                </a>
                                <a class="site-btn site-avgle" style="margin-bottom: 5px;background-color:#71bb59;">
                                    <span style="opacity: 1;">Avgle</span>
                                </a>
                                <a class="site-btn site-miss-av" style="color:black !important;margin-bottom: 5px;background-color:#71bb59;">
                                    <span style="opacity: 1;">MissAv</span>
                                </a>
                                <a class="site-btn site-123-av" style="color:black !important;margin-bottom: 5px;background-color:#71bb59;">
                                    <span style="opacity: 1;">123Av</span>
                                </a>
                            </div>
                        </div>
                        
                        <div class="more-tools-container copySvg" style="position: relative; margin-right: 15px;">
                            <div title="Copy button" style="padding: 5px; margin: -5px;opacity:.3">${this.copySvg}</div>
                            
                            <div class="more-tools" style="
                                position: absolute;
                                bottom: 20px;
                                right: -10px;
                                display: none;
                                background: #333333;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                                border-radius: 20px;
                                padding: 10px 0;
                                margin-bottom: 15px;
                                z-index: 10;
                                color: white;
                            ">
                                <span class="carNumSvg" title="Copy ID" style="padding: 5px 10px; white-space: nowrap; fill: white;">${this.carNumSvg}</span>
                                <span class="titleSvg" title="Copy Title" style="padding: 5px 10px; white-space: nowrap; fill: white;">${this.titleSvg}</span>
                                <span class="downSvg" title="Download Cover" style="padding: 5px 10px; white-space: nowrap; fill: white;">${this.downSvg}</span>
                            </div>
                        </div>
                    </div>
                `,
            );
          if (isJavBus) {
            if ($box2.find('.avatar-box').length > 0) return;
            $box2.find('.photo-info').append(
              `
                    <div class="tool-box" style="display: flex; align-items: center;justify-content: flex-end">
                        <span class="screenSvg" title="Long thumbnail" style="margin-right: 15px;">${this.screenSvg}</span>

                        <span class="videoSvg" title="Play video" style="margin-right: 15px;">${this.videoSvg}</span>
                        
                        <div class="more-tools-container handleSvg" style="position: relative; margin-right: 15px;">
                            <div title="Identification processing" style="padding: 5px; margin: -5px;opacity:.3">${this.handleSvg}</div>
                            
                            <div class="more-tools" style=" position: absolute; bottom: 33px; right: -30px; display: none;
                                background-color: rgba(0, 0, 0, 0);z-index: 10;">
                                <a class="menu-btn hasWatchBtn" style="background-color:#d7a80c;color:white;margin-bottom: 5px"><span style="opacity: 1;display: inline; color:black !important">🔍 Watched</span></a>
                                <a class="menu-btn hasDownBtn" style="background-color:#7bc73b; color:black;margin-bottom: 5px"><span style="opacity: 1;display: inline; color:black !important">📥️ Downloaded</span></a>
                                <a class="menu-btn favoriteBtn" style="background-color:#25b1dc; color:black;margin-bottom: 5px"><span style="opacity: 1;display: inline; color:black !important">⭐ Collect</span></a>
                                <a class="menu-btn filterBtn" style="background-color:#de3333;   color:black;margin-bottom: 5px"><span style="opacity: 1;display: inline; color:black !important">🚫 Block</span></a>
                            </div>
                        </div>
                        
                        <div class="more-tools-container siteSvg" style="position: relative; margin-right: 15px;">
                            <div title="Third-party websites" style="padding: 5px; margin: -5px;opacity:.3">${this.siteSvg}</div>
                            
                             <div class="more-tools" style=" position: absolute; bottom: 33px; right: -30px; display: none;
                                background-color: rgba(0, 0, 0, 0);z-index: 10;">
                                <a class="site-btn site-jable" style="color:black;margin-bottom: 5px;background-color:#71bb59;">
                                    <span style="opacity: 1;display: inline; color:black !important">Jable</span>
                                </a>
                                <a class="site-btn site-avgle" style="margin-bottom: 5px;background-color:#71bb59;">
                                    <span style="opacity: 1;display: inline; color:black !important">Avgle</span>
                                </a>
                                <a class="site-btn site-miss-av" style="color:black;margin-bottom: 5px;background-color:#71bb59;">
                                    <span style="opacity: 1;display: inline; color:black !important">MissAv</span>
                                </a>
                                <a class="site-btn site-123-av" style="color:black;margin-bottom: 5px;background-color:#71bb59;">
                                    <span style="opacity: 1;display: inline; color:black !important">123Av</span>
                                </a>
                            </div>
                        </div>
                      
                        <div class="more-tools-container copySvg" style="position: relative;">
                            <div title="Copy button" style="padding: 5px; margin: -5px;opacity:.3">${this.copySvg}</div>
                            
                            <div class="more-tools" style="
                                max-width: 44px;
                                position: absolute;
                                bottom: 20px;
                                right: -10px;
                                display: none;
                                background: #333333;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                                border-radius: 20px;
                                padding: 10px 0;
                                margin-bottom: 15px;
                                z-index: 10;
                                text-align: center;
                            ">
                                <span class="carNumSvg" title="Copy ID" style="padding: 5px 10px; white-space: nowrap; display: inline; fill: white;">${this.carNumSvg}</span>
                                <span class="titleSvg" title="Copy Title"  style="padding: 5px 10px; white-space: nowrap; display: inline; fill: white;">${this.titleSvg}</span>
                                <span class="downSvg" title="Download Cover"   style="padding: 5px 10px; white-space: nowrap; display: inline; fill: white;">${this.downSvg}</span>
                            </div>
                        </div>
                    </div>
                `,
            );
          }
        }
      });
    this.enableSvgBtn();
  }
  async enableSvgBtn() {
    const settingObj = await storageManager.getSetting(),
      {
        enableScreenSvg: enableScreenSvg = YES,
        enableVideoSvg: enableVideoSvg = YES,
        enableHandleSvg: enableHandleSvg = YES,
        enableSiteSvg: enableSiteSvg = YES,
        enableCopySvg: enableCopySvg = YES,
      } = settingObj;
    [
      {
        selector: '.screenSvg',
        enabled: enableScreenSvg,
      },
      {
        selector: '.videoSvg',
        enabled: enableVideoSvg,
      },
      {
        selector: '.handleSvg',
        enabled: enableHandleSvg,
      },
      {
        selector: '.siteSvg',
        enabled: enableSiteSvg,
      },
      {
        selector: '.copySvg',
        enabled: enableCopySvg,
      },
    ].forEach(({ selector: selector, enabled: enabled }) => {
      $(selector).toggle(enabled === YES);
    });
  }
  async bindClick() {
    this.getSelector();
    const listPagePlugin = this.getBean('ListPagePlugin');
    $(document).on('click', '.more-tools-container', (event) => {
      event.preventDefault();
      var $currentTools = $(event.target)
        .closest('.more-tools-container')
        .find('.more-tools');
      $('.more-tools')
        .not($currentTools)
        .stop(!0, !0)
        .removeClass('elastic-in')
        .addClass('elastic-out')
        .hide();
      $currentTools.is(':visible')
        ? $currentTools
            .stop(!0, !0)
            .removeClass('elastic-in')
            .addClass('elastic-out')
            .hide()
        : $currentTools
            .stop(!0, !0)
            .removeClass('elastic-out')
            .addClass('elastic-in')
            .show();
    });
    $(document).on('click', function (event) {
      $(event.target).closest('.more-tools-container').length ||
        $('.more-tools')
          .stop(!0, !0)
          .removeClass('elastic-in')
          .addClass('elastic-out')
          .hide();
    });
    $(document).on('click', '.videoSvg', (event) => {
      event.preventDefault();
      $('.videoSvg[title!="Play video"]').each((index, element) => {
        // Changed from '播放视频'
        const $otherSvgElement = $(element);
        let $otherBox = $otherSvgElement.closest('.item'),
          $otherImg = $otherBox.find('img'),
          { carNum: carNum2 } = this.getBoxCarInfo($otherBox);
        this.showImg($otherSvgElement, $otherImg, carNum2);
        $otherSvgElement.html(this.videoSvg).attr('title', 'Play video'); // Changed from '播放视频'
      });
      const $currentBox = $(event.target).closest('.item'),
        $svgElement = $currentBox.find('.videoSvg');
      if ('Play video' === $svgElement.attr('title')) {
        // Changed from '播放视频'
        $svgElement
          .html(this.recoveryVideoSvg)
          .attr('title', 'Switch back to cover'); // Changed from '切回封面'
        const { carNum: carNum2 } = this.getBoxCarInfo($currentBox);
        let $img = $currentBox.find('img');
        if (!$img.length) {
          show.error('No image found'); // Changed from '没有找到图片'
          return;
        }
        this.showVideo($svgElement, $img, carNum2).then();
      }
    });
    $(document).on('click', '.screenSvg', async (event) => {
      event.preventDefault();
      let loadObj = loading();
      try {
        const $box2 = $(event.currentTarget).closest('.item');
        let { carNum: carNum2 } = this.getBoxCarInfo($box2);
        carNum2 = carNum2.replace('FC2-', '');
        const imgUrl = await this.getBean('ScreenShotPlugin').getScreenshot(
          carNum2,
        );
        loadObj.close();
        showImageViewer(imgUrl);
      } catch (error) {
        console.error('Image preview error:', error); // Changed from '图片预览出错:'
        show.error('Image preview error:' + error); // Changed from '图片预览出错:'
      } finally {
        loadObj.close();
      }
    });
    $(document).on(
      'click',
      '.filterBtn, .favoriteBtn, .hasDownBtn, .hasWatchBtn',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        const $btn = $(event.target).closest('.menu-btn'),
          $box2 = $btn.closest('.item'),
          {
            carNum: carNum2,
            url: url,
            publishTime: publishTime,
          } = this.getBoxCarInfo($box2),
          handleAction = async (status) => {
            let actress = await listPagePlugin.parseActressName(url);
            await storageManager.saveCar({
              carNum: carNum2,
              url: url,
              names: actress,
              actionType: status,
              publishTime: publishTime,
            });
            window.refresh();
            show.ok('Operation successful'); // Changed from '操作成功'
          };
        $btn.hasClass('filterBtn')
          ? utils.q(event, `Block ${carNum2}?`, () =>
              // Changed from `是否屏蔽${carNum2}?`
              handleAction(Status_FILTER),
            )
          : $btn.hasClass('favoriteBtn')
          ? handleAction(Status_FAVORITE).then()
          : $btn.hasClass('hasDownBtn')
          ? handleAction(Status_HAS_DOWN).then()
          : $btn.hasClass('hasWatchBtn') &&
            handleAction(Status_HAS_WATCH).then();
        $('.more-tools')
          .stop(!0, !0)
          .removeClass('elastic-in')
          .addClass('elastic-out')
          .hide();
      },
    );
    const otherSitePlugin = this.getBean('OtherSitePlugin'),
      missAvUrl = await otherSitePlugin.getMissAvUrl(),
      jableUrl = await otherSitePlugin.getjableUrl(),
      avgleUrl = await otherSitePlugin.getAvgleUrl(),
      av123Url = await otherSitePlugin.getAv123Url();
    $(document).on(
      'click',
      '.site-jable, .site-avgle, .site-miss-av, .site-123-av',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        const $currentTarget = $(event.currentTarget),
          $box2 = $currentTarget.closest('.item'),
          { carNum: carNum2 } = this.getBoxCarInfo($box2);
        let url = null;
        $currentTarget.hasClass('site-jable')
          ? (url = `${jableUrl}/search/${carNum2}/`)
          : $currentTarget.hasClass('site-avgle')
          ? (url = `${avgleUrl}/vod/search.html?wd=${carNum2}`)
          : $currentTarget.hasClass('site-miss-av')
          ? (url = `${missAvUrl}/search/${carNum2}`)
          : $currentTarget.hasClass('site-123-av') &&
            (url = `${av123Url}/ja/search?keyword=${carNum2}`);
        event && (event.ctrlKey || event.metaKey)
          ? GM_openInTab(url, {
              insert: 0,
            })
          : window.open(url);
      },
    );
    $(document).on('click', '.titleSvg, .carNumSvg, .downSvg', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const $box2 = $(event.currentTarget).closest('.item'),
        { carNum: carNum2, title: title } = this.getBoxCarInfo($box2),
        $img = $box2.find(isJavBus ? '.photo-frame img' : '.cover img');
      $(event.currentTarget).hasClass('titleSvg')
        ? utils.copyToClipboard('Title', title) // Changed from '标题'
        : $(event.currentTarget).hasClass('carNumSvg')
        ? utils.copyToClipboard('Car ID', carNum2) // Changed from '番号'
        : $(event.currentTarget).hasClass('downSvg') &&
          fetch($img.attr('src'))
            .then((response) => response.blob())
            .then((blob) => {
              utils.download(blob, carNum2 + ' ' + title + '.jpg');
            });
    });
  }
  showImg($svgElement, $img, carNum2) {
    $svgElement.html(this.videoSvg).attr('title', 'Play video'); // Changed from '播放视频'
    let $video = $(`#${`${carNum2}_preview_video`}`);
    if ($video.length > 0) {
      $video[0].pause();
      $video.parent().hide();
    }
    $img.show();
    $img.removeClass('loading');
    $img.next('.loading-spinner').remove();
  }
  async showVideo($svgElement, $img, carNum2) {
    const id = `${carNum2}_preview_video`;
    let $video = $(`#${id}`);
    if ($video.length > 0) {
      $video.parent().show();
      $video[0].play();
      $img.hide();
      return;
    }
    $img.addClass('loading');
    $img.after('<div class="loading-spinner"></div>');
    const poster = $img.attr('src'),
      dmmVideoMap = await getDmmVideo(carNum2);
    if (!dmmVideoMap) {
      show.error('Video not parsed'); // Changed from '未解析到视频'
      this.showImg($svgElement, $img, carNum2);
      return;
    }
    let defaultVideoQuality = await storageManager.getSetting('videoQuality');
    defaultVideoQuality = selectDefaultQuality(
      Object.keys(dmmVideoMap),
      defaultVideoQuality,
    );
    let videoUrl = dmmVideoMap[defaultVideoQuality],
      videoHtml = `\n            <div style="display: flex; justify-content: center; align-items: center; position: absolute; top:0; left:0; height: 100%; width: 100%; z-index: 10; overflow: hidden">\n                <video \n                    src="${videoUrl}" \n                    poster="${poster}" \n                    id="${id}" \n                    controls \n                    loop \n                    muted \n                    playsinline\n                    style="max-height: 100%; max-width: 100%; object-fit: contain"\n                ></video>\n            </div>\n        `;
    isJavBus &&
      (videoHtml = `\n                <div>\n                    <video \n                        src="${videoUrl}" \n                        poster="${poster}" \n                        id="${id}" \n                        controls \n                        loop \n                        muted \n                        playsinline\n                        style="max-height: 100%; max-width: 100%; object-fit: contain"\n                    ></video>\n                </div>\n            `);
    $img.parent().append(videoHtml);
    $img.hide();
    $img.removeClass('loading');
    $img.next('.loading-spinner').remove();
    $video = $(`#${id}`);
    let videoElement = $video[0];
    videoElement.load();
    videoElement.muted = !1;
    videoElement.play();
    $video.trigger('focus');
  }
}

class Fc2By123AvPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, '$contentBox', $('.section .container'));
    __publicField(
      this,
      'urlParams',
      new URLSearchParams(window.location.search),
    );
    __publicField(
      this,
      'sortVal',
      this.urlParams.get('sort') || 'release_date',
    );
    __publicField(
      this,
      'currentPage',
      this.urlParams.get('page') ? parseInt(this.urlParams.get('page')) : 1,
    );
    __publicField(this, 'maxPage', null);
    __publicField(this, 'keyword', this.urlParams.get('keyword') || null);
  }
  getName() {
    return 'Fc2By123AvPlugin';
  }
  async getBaseUrl() {
    const otherSitePlugin = this.getBean('OtherSitePlugin');
    return (await otherSitePlugin.getAv123Url()) + '/ja';
  }
  handle() {
    $(
      '#navbar-menu-hero > div > div:nth-child(1) > div > a:nth-child(4)',
    ).after(
      '<a class="navbar-item" href="/advanced_search?type=100&released_start=2099-09">123Av-Fc2</a>',
    );
    $('.tabs li:contains("FC2")').after(
      '<li><a href="/advanced_search?type=100&released_start=2099-09"><span>123Av-Fc2</span></a></li>',
    );
    if (currentHref.includes('/advanced_search?type=100')) {
      this.hookPage();
      this.handleQuery().then();
    }
  }
  hookPage() {
    let $h2 = $('h2.section-title');
    $h2.contents().first().replaceWith('123Av');
    $h2.css('marginBottom', '0');
    $h2.append(
      '\n            <div style="margin-left: 100px; width: 400px;">\n                <input id="search-123av-keyword" type="text" placeholder="Search 123Av Fc2ppv content" style="padding: 4px 5px;margin-right: 0">\n                <a id="search-123av-btn" class="a-primary" style="margin-left: 0">Search</a>\n                <a id="clear-123av-btn" class="a-info" style="margin-left: 0">Reset</a>\n            </div>\n        ',
    ); // All text changed
    $('#search-123av-keyword').val(this.keyword);
    $('#search-123av-btn').on('click', async () => {
      let keyword = $('#search-123av-keyword').val().trim();
      if (keyword) {
        this.keyword = keyword;
        utils.setHrefParam('keyword', keyword);
        await this.handleQuery();
      }
    });
    $('#clear-123av-btn').on('click', async () => {
      $('#search-123av-keyword').val('');
      this.keyword = '';
      utils.setHrefParam('keyword', '');
      $('.page-box').show();
      $('.tool-box').show();
      await this.handleQuery();
    });
    $('.empty-message').remove();
    $('#foldCategoryBtn').remove();
    $('.section .container .box').remove();
    $('#sort-toggle-btn').remove();
    this.$contentBox.append(
      '<div class="tool-box" style="margin-top: 10px"></div>',
    );
    this.$contentBox.append(
      '<div class="movie-list h cols-4 vcols-8" style="margin-top: 10px"></div>',
    );
    this.$contentBox.append('<div class="page-box"></div>');
    $('.tool-box').append(
      '\n            <div class="button-group">\n                <div class="buttons has-addons" id="conditionBox">\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="release_date">Release Date</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="recent_update">Recently Updated</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="trending">Trending</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_viewed_today">Most Viewed Today</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_viewed_week">Most Viewed This Week</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_viewed_month">Most Viewed This Month</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_viewed">Most Viewed</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_favourited">Most Favorited</a>\n                </div>\n            </div>\n        ',
    ); // All text changed
    $(`#conditionBox a[data-sort="${this.sortVal}"]`).addClass('is-info');
    utils.setHrefParam('sort', this.sortVal);
    utils.setHrefParam('page', this.currentPage);
    $('#conditionBox').on('click', 'a.button', (e) => {
      let $target = $(e.target);
      this.sortVal = $target.data('sort');
      utils.setHrefParam('sort', this.sortVal);
      $target.siblings().removeClass('is-info');
      $target.addClass('is-info');
      this.handleQuery();
    });
    $('.page-box').append(
      '\n            <nav class="pagination">\n                <a class="pagination-previous">Previous Page</a>\n                <ul class="pagination-list"></ul>\n                <a class="pagination-next">Next Page</a>\n            </nav>\n        ',
    ); // Text changed
    $(document).on('click', '.pagination-link', (e) => {
      e.preventDefault();
      this.currentPage = parseInt($(e.target).data('page'));
      utils.setHrefParam('page', this.currentPage);
      this.renderPagination();
      this.handleQuery();
    });
    $('.pagination-previous').on('click', (e) => {
      e.preventDefault();
      if (this.currentPage > 1) {
        this.currentPage--;
        utils.setHrefParam('page', this.currentPage);
        this.renderPagination();
        this.handleQuery();
      }
    });
    $('.pagination-next').on('click', (e) => {
      e.preventDefault();
      if (this.currentPage < this.maxPage) {
        this.currentPage++;
        utils.setHrefParam('page', this.currentPage);
        this.renderPagination();
        this.handleQuery();
      }
    });
  }
  renderPagination() {
    const $paginationList = $('.pagination-list');
    $paginationList.empty();
    let startPage = Math.max(1, this.currentPage - 2),
      endPage = Math.min(this.maxPage, this.currentPage + 2);
    this.currentPage <= 3
      ? (endPage = Math.min(6, this.maxPage))
      : this.currentPage >= this.maxPage - 2 &&
        (startPage = Math.max(this.maxPage - 5, 1));
    if (startPage > 1) {
      $paginationList.append(
        '<li><a class="pagination-link" data-page="1">1</a></li>',
      );
      startPage > 2 &&
        $paginationList.append(
          '<li><span class="pagination-ellipsis">…</span></li>',
        );
    }
    for (let i = startPage; i <= endPage; i++) {
      const activeClass = i === this.currentPage ? ' is-current' : '';
      $paginationList.append(
        `<li><a class="pagination-link${activeClass}" data-page="${i}">${i}</a></li>`,
      );
    }
    if (endPage < this.maxPage) {
      endPage < this.maxPage - 1 &&
        $paginationList.append(
          '<li><span class="pagination-ellipsis">…</span></li>',
        );
      $paginationList.append(
        `<li><a class="pagination-link" data-page="${this.maxPage}">${this.maxPage}</a></li>`,
      );
    }
  }
  async handleQuery() {
    let loadObj = loading();
    try {
      let pagesToFetch = [];
      pagesToFetch =
        1 === this.currentPage
          ? [1, 2]
          : [2 * this.currentPage - 1, 2 * this.currentPage];
      if (this.keyword) {
        pagesToFetch = [1];
        $('.page-box').hide();
        $('.tool-box').hide();
      }
      const baseUrl = await this.getBaseUrl(),
        fetchPromises = pagesToFetch.map((page) => {
          let url = `${baseUrl}/tags/fc2?sort=${this.sortVal}&page=${page}`;
          this.keyword && (url = `${baseUrl}/search?keyword=${this.keyword}`);
          return gmHttp.get(url);
        }),
        htmlResults = await Promise.all(fetchPromises);
      let dataList = [];
      for (const html of htmlResults) {
        let $dom = $(html);
        $dom.find('.box-item').each((index, element) => {
          const $item = $(element),
            imgSrc = $item.find('img').attr('data-src');
          let carNum2 = $item.find('img').attr('title');
          const detailLink = $item.find('.detail a'),
            link = detailLink.attr('href'),
            href = baseUrl + (link.startsWith('/') ? link : '/' + link),
            title = detailLink
              .text()
              .trim()
              .replace(carNum2 + ' - ', '');
          carNum2 = carNum2.replace('FC2-PPV', 'FC2');
          dataList.push({
            imgSrc: imgSrc,
            carNum: carNum2,
            href: href,
            title: title,
          });
        });
        if (!this.maxPage) {
          let rawMaxPage,
            lastPageItem = $dom.find('.page-item:not(.disabled)').last();
          if (lastPageItem.find('a.page-link').length) {
            let href = lastPageItem.find('a.page-link').attr('href');
            rawMaxPage = parseInt(href.split('page=')[1]);
          } else
            rawMaxPage = parseInt(lastPageItem.find('span.page-link').text());
          this.maxPage = Math.ceil(rawMaxPage / 2);
          this.renderPagination();
        }
      }
      if (0 === dataList.length) {
        console.log(dataList);
        show.error('No results'); // Changed from '无结果'
        let errorUrl = `${baseUrl}/dm4/tags/fc2?sort=${this.sortVal}`;
        this.keyword &&
          (errorUrl = `${baseUrl}/search?keyword=${this.keyword}`);
        console.error('Failed to get data!', errorUrl); // Changed from '获取数据失败!'
      }
      let movieHtml = this.markDataListHtml(dataList);
      $('.movie-list').html(movieHtml);
      await utils.smoothScrollToTop();
    } catch (e) {
      console.error(e);
    } finally {
      loadObj.close();
    }
  }
  async open123AvFc2Dialog(carNum2, href) {
    let otherHtml = '';
    (await storageManager.getSetting('enableLoadOtherSite', YES)) === YES &&
      (otherHtml =
        '<div class="movie-panel-info fc2-movie-panel-info" style="margin-top:20px"><strong>Third-party sites: </strong></div>'); // Changed from '第三方站点:'
    let pageHtml = `\n            <div class="movie-detail-container">\n               \x3c!-- <div class="movie-poster-container">\n                    <iframe class="movie-trailer" frameborder="0" allowfullscreen scrolling="no"></iframe>\n                </div>\n                <div class="right-box">--\x3e\n                    <div class="movie-info-container">\n                        <div class="search-loading">Loading...</div>\n                    </div>\n                    \n                    ${otherHtml}\n                    \n                    <div style="margin: 10px 0">\n                        <a id="filterBtn" class="menu-btn" style="background-color:#de3333"><span>🚫 Block</span></a>\n                        <a id="favoriteBtn" class="menu-btn" style="background-color:#25b1dc"><span>⭐ Collect</span></a>\n                        <a id="hasDownBtn" class="menu-btn" style="background-color:#7bc73b"><span>📥️ Downloaded</span></a>\n                        <a id="hasWatchBtn" class="menu-btn" style="background-color:#d7a80c;"><span>🔍 Watched</span></a>\n                        \n                        <a id="search-subtitle-btn" class="menu-btn fr-btn" style="background:linear-gradient(to bottom, #8d5656, rgb(196,159,91))">\n                            <span>Subtitle (SubTitleCat)</span>\n                        </a>\n                        <a id="xunLeiSubtitleBtn" class="menu-btn fr-btn" style="background:linear-gradient(to left, #375f7c, #2196F3)">\n                            <span>Subtitle (XunLei)</span>\n                        </a>\n                    </div>\n                    <div class="message video-panel" style="margin-top:20px">\n                        <div id="magnets-content" class="magnet-links">\n                        </div>\n                    </div>\n                    <div id="reviews-content">\n                    </div>\n                    <div id="related-content">\n                    </div>\n                    <span id="data-actress" style="display: none"></span>\n               \x3c!-- </div>--\x3e\n            </div>\n        `; // All text changed
    layer.open({
      type: 1,
      title: carNum2,
      content: pageHtml,
      area: utils.getDefaultArea(),
      skin: 'movie-detail-layer',
      scrollbar: !1,
      success: (layero, index) => {
        utils.setupEscClose(index);
        this.loadData(carNum2, href);
        let keyword = carNum2.replace('FC2-', '');
        $('#magnets-content').append(
          this.getBean('MagnetHubPlugin').createMagnetHub(keyword),
        );
        $('#favoriteBtn').on('click', async (event) => {
          const actress = $('#data-actress').text(),
            publishTime = $('#data-publishTime').text();
          await storageManager.saveCar({
            carNum: carNum2,
            url: href,
            names: actress,
            actionType: Status_FAVORITE,
            publishTime: publishTime,
          });
          window.refresh();
          layer.closeAll();
        });
        $('#filterBtn').on('click', (event) => {
          utils.q(event, `Block ${carNum2}?`, async () => {
            // Changed from `是否屏蔽${carNum2}?`
            const actress = $('#data-actress').text(),
              publishTime = $('#data-publishTime').text();
            await storageManager.saveCar({
              carNum: carNum2,
              url: href,
              names: actress,
              actionType: Status_FILTER,
              publishTime: publishTime,
            });
            window.refresh();
            layer.closeAll();
            window.location.href.includes('collection_codes?movieId') &&
              utils.closePage();
          });
        });
        $('#hasDownBtn').on('click', async (event) => {
          const actress = $('#data-actress').text(),
            publishTime = $('#data-publishTime').text();
          await storageManager.saveCar({
            carNum: carNum2,
            url: href,
            names: actress,
            actionType: Status_HAS_DOWN,
            publishTime: publishTime,
          });
          window.refresh();
          layer.closeAll();
        });
        $('#hasWatchBtn').on('click', async (event) => {
          const actress = $('#data-actress').text(),
            publishTime = $('#data-publishTime').text();
          await storageManager.saveCar({
            carNum: carNum2,
            url: href,
            names: actress,
            actionType: Status_HAS_WATCH,
            publishTime: publishTime,
          });
          window.refresh();
          layer.closeAll();
        });
        $('#search-subtitle-btn').on('click', (event) =>
          utils.openPage(
            `https://subtitlecat.com/index.php?search=${carNum2}`,
            carNum2,
            !1,
            event,
          ),
        );
        $('#xunLeiSubtitleBtn').on('click', () =>
          this.getBean('DetailPageButtonPlugin').searchXunLeiSubtitle(carNum2),
        );
        let tempCarNum = carNum2.replace('FC2-', '');
        this.getBean('OtherSitePlugin')
          .loadOtherSite(tempCarNum, carNum2)
          .then();
      },
    });
  }
  async loadData(carNum2, href) {
    let loadObj = loading();
    try {
      const {
        id: id,
        publishDate: publishDate,
        title: title,
        moviePoster: moviePoster,
      } = await this.get123AvVideoInfo(href);
      $('.movie-info-container').html(
        `\n                    <h3 class="movie-title" style="margin-bottom: 10px"><strong class="current-title">${
          title || 'No Title' // Changed from '无标题'
        }</strong></h3>\n                    <div class="movie-meta" style="margin-bottom: 10px">\n                        <span><strong>Car No.: </strong>${
          // Changed from '番号:'
          carNum2 || 'Unknown' // Changed from '未知'
        }</span>\n                        <span><strong>Year: </strong>${
          // Changed from '年份:'
          publishDate || 'Unknown' // Changed from '未知'
        }</span>\n                        <span>\n                            <strong>Site: </strong>\n                            <a href="https://fc2ppvdb.com/articles/${carNum2.replace(
          // Changed from '站点:'
          'FC2-',
          '',
        )}" target="_blank">fc2ppvdb</a>\n                            <a style="margin-left: 5px;" href="https://adult.contents.fc2.com/article/${carNum2.replace(
          'FC2-',
          '',
        )}/" target="_blank">fc2 digital marketplace</a>\n                        </span>\n                    </div>\n                    <div class="movie-actors" style="margin-bottom: 10px">\n                        <div class="actor-list"><strong>Starring: </strong></div>\n                    </div>\n                    <div class="movie-seller" style="margin-bottom: 10px">\n                        <span><strong>Seller: </strong></span>\n                    </div>\n                    <div class="movie-gallery" style="margin-bottom: 10px">\n                        <strong>Still photos: </strong>\n                        <div class="image-list"></div>\n                    </div>\n                    \n                    <div id="data-publishTime" style="display: none">${
          publishDate || ''
        }</div>\n\n                `,
      ); // All text changed
      this.getImgList(carNum2).then();
      this.getActressInfo(carNum2).then();
      this.getBean('TranslatePlugin').translate(carNum2, !1).then();
    } catch (e) {
      console.error(e);
    } finally {
      loadObj.close();
    }
  }
  handleLongImg(carNum2) {
    utils.loopDetector(
      () => $('.movie-gallery .image-list').length > 0,
      async () => {
        $('.movie-gallery .image-list').prepend(
          ' <a class="tile-item screen-container" style="overflow:hidden;max-height: 150px;max-width:150px; text-align:center;"><div style="margin-top: 50px;color: #000;cursor: auto">Loading thumbnail</div></a> ', // Changed from '正在加载缩略图'
        );
        const imgUrl = await this.getBean('ScreenShotPlugin').getScreenshot(
          carNum2,
        );
        if (imgUrl) {
          $('.screen-container').html(
            `<img src="${imgUrl}" alt="" loading="lazy" style="width: 100%;">`,
          );
          $('.screen-container').on('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            showImageViewer(event.currentTarget);
          });
        }
      },
    );
  }
  async get123AvVideoInfo(href) {
    const html = await gmHttp.get(href),
      match = html.match(/v-scope="Movie\({id:\s*(\d+),/),
      id = match ? match[1] : null,
      $dom = utils.htmlTo$dom(html);
    return {
      id: id,
      publishDate: $dom
        .find('span:contains("Release Date:")') // Changed from 'リリース日:'
        .next('span')
        .text(),
      title: $dom.find('h1').text().trim(),
      moviePoster: $dom.find('#player').attr('data-poster'),
    };
  }
  async getActressInfo(fc2Num) {
    let url = `https://fc2ppvdb.com/articles/${fc2Num.replace('FC2-', '')}`;
    const html = await gmHttp.get(url),
      $dom = $(html),
      actressNodeList = $dom.find('div').filter(function () {
        return 0 === $(this).text().trim().indexOf('Actress：'); // Changed from '女優：'
      });
    if (0 === actressNodeList.length || actressNodeList.length > 1) {
      show.error('Failed to parse actress information'); // Changed from '解析女优信息失败'
      return;
    }
    const $actress = $(actressNodeList[0]).find('a');
    let actorsHtml = '<strong>Starring: </strong>'; // Changed from '主演:'
    if ($actress.length > 0) {
      let actress = '';
      $actress.each((index, ele) => {
        let $actor = $(ele),
          name2 = $actor.text(),
          actressHref = $actor.attr('href');
        actorsHtml += `<span class="actor-tag"><a href="https://fc2ppvdb.com${actressHref}" target="_blank">${name2}</a></span>`;
        actress += name2 + ' ';
      });
      $('#data-actress').text(actress);
    } else actorsHtml += '<span>No actor information available</span>'; // Changed from '暂无演员信息'
    $('.actor-list').html(actorsHtml);
    const sellerNodeList = $dom.find('div').filter(function () {
      return 0 === $(this).text().trim().indexOf('Seller：'); // Changed from '販売者：'
    });
    if (sellerNodeList.length > 0) {
      const $sellerA = $(sellerNodeList[0]).find('a');
      if ($sellerA.length > 0) {
        const $seller = $($sellerA[0]);
        let name2 = $seller.text(),
          sellerHref = $seller.attr('href');
        $('.movie-seller').html(
          `<span><strong>Seller: </strong><a href="https://fc2ppvdb.com${sellerHref}" target="_blank">${name2}</a></span>`, // Changed from '販売者:'
        );
      }
    }
  }
  async getImgList(fc2Num) {
    let tempCarNum = fc2Num.replace('FC2-', ''),
      url = `https://adult.contents.fc2.com/article/${fc2Num.replace(
        'FC2-',
        '',
      )}/`;
    const html = await gmHttp.get(url, null, {
      referer: url,
    });
    let imgList = $(html)
        .find('.items_article_SampleImagesArea img')
        .map(function () {
          return $(this).attr('src');
        })
        .get(),
      imagesHtml = '';
    Array.isArray(imgList) && imgList.length > 0
      ? (imagesHtml = imgList
          .map(
            (img, index) =>
              `\n                <a href="${img}" data-fancybox="movie-gallery" data-caption="Still photo ${
                // Changed from '剧照'
                index + 1
              }">\n                    <img src="${img}" class="movie-image-thumb"  alt=""/>\n                </a>\n            `,
          )
          .join(''))
      : $('.movie-gallery').html(
          '<h4>Still photos: No still photos available</h4>',
        ); // Changed from '剧照: 暂无剧照'
    $('.image-list').html(imagesHtml);
    this.handleLongImg(tempCarNum);
  }
  async getMovie(id, moviePoster) {
    let url = `${await this.getBaseUrl()}/ajax/v/${id}/videos`,
      loadObj = loading();
    try {
      let movieList = (await gmHttp.get(url)).result.watch;
      if (movieList.length > 0) {
        movieList.forEach((movieItem) => {
          movieItem.url = movieItem.url + '?poster=' + moviePoster;
        });
        return movieList;
      }
      return null;
    } catch (e) {
      console.error(e);
    } finally {
      loadObj.close();
    }
  }
  markDataListHtml(movies) {
    let moviesHtml = '';
    movies.forEach((movie) => {
      moviesHtml += `\n                <div class="item">\n                    <a href="${
        movie.href
      }" class="box" title="${
        movie.title
      }">\n                        <div class="cover ">\n                            <img loading="lazy" src="${movie.imgSrc.replace(
        '/s360',
        '',
      )}" alt="">\n                        </div>\n                        <div class="video-title"><strong>${
        movie.carNum
      }</strong> ${
        movie.title
      }</div>\n                        <div class="score">\n                        </div>\n                        <div class="meta">\n                        </div>\n                        <div class="tags has-addons">\n                        </div>\n                    </a>\n                </div>\n            `;
    });
    return moviesHtml;
  }
}
class MagnetHubPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'currentEngine', null);
    __publicField(this, 'searchEngines', [
      {
        name: 'U9A9',
        id: 'u9a9',
        url: 'https://u9a9.com/?type=2&search={keyword}',
        targetPage: 'https://u9a9.com/?type=2&search={keyword}',
        parseHtml: this.parseU3C3,
      },
      {
        name: 'U3C3',
        id: 'u3c3',
        url: 'https://u3c3.com/?search2=a8lr16lo&search={keyword}',
        targetPage: 'https://u3c3.com/?search2=a8lr16lo&search={keyword}',
        parseHtml: this.parseU3C3,
      },
      {
        name: 'Sukebei',
        id: 'Sukebei',
        url: 'https://sukebei.nyaa.si/?f=0&c=0_0&q={keyword}',
        targetPage: 'https://sukebei.nyaa.si/?f=0&c=0_0&q={keyword}',
        parseHtml: this.parseSukebei,
      },
    ]);
  }
  getName() {
    return 'MagnetHubPlugin';
  }
  async initCss() {
    return '\n            <style>\n                .magnet-container {\n                    margin: 20px auto;\n                    width: 100%;\n                    font-family: Arial, sans-serif;\n                }\n                .magnet-tabs {\n                    display: flex;\n                    border-bottom: 1px solid #ddd;\n                    margin-bottom: 15px;\n                    justify-content: space-between;\n                }\n                .magnet-tab {\n                    padding: 5px 12px;\n                    cursor: pointer;\n                    border: 1px solid transparent;\n                    border-bottom: none;\n                    margin-right: 5px;\n                    background: #f5f5f5;\n                    border-radius: 5px 5px 0 0;\n                }\n                .magnet-tab.active {\n                    background: #fff;\n                    border-color: #ddd;\n                    border-bottom: 1px solid #fff;\n                    margin-bottom: -1px;\n                    font-weight: bold;\n                }\n                .magnet-tab:hover:not(.active) {\n                    background: #e9e9e9;\n                }\n                \n                .magnet-results {\n                    min-height: 200px;\n                }\n                .magnet-result {\n                    padding: 15px;\n                    border-bottom: 1px solid #eee;\n                    position: relative; \n                }\n                .magnet-result:hover {\n                    background-color: #f9f9f9;\n                }\n                .magnet-title {\n                    font-weight: bold;\n                    margin-bottom: 5px;\n                    white-space: nowrap;\n                    overflow: hidden; \n                    text-overflow: ellipsis;\n                    padding-right: 80px; \n                }\n                .magnet-info {\n                    display: flex;\n                    justify-content: space-between;\n                    font-size: 12px;\n                    color: #666;\n                    margin-bottom: 5px;\n                }\n                .magnet-loading {\n                    text-align: center;\n                    padding: 20px;\n                }\n                .magnet-error {\n                    color: #f44336;\n                    padding: 10px;\n                }\n                \n                .magnet-copy {\n                    position: absolute;\n                    right: 15px;\n                    top: 12px;\n                }\n                .magnet-hub-btn {\n                    background-color: #f0f0f0;\n                    color: #555;\n                    border: 1px solid #ddd;\n                    padding: 3px 8px;\n                    border-radius: 3px;\n                    cursor: pointer;\n                    font-size: 12px;\n                    transition: all 0.2s;\n                    margin-left: 10px;\n                }\n                .magnet-hub-btn:hover {\n                    background-color: #e0e0e0;\n                    border-color: #ccc;\n                }\n                .magnet-hub-btn.copied {\n                    background-color: #4CAF50;\n                    color: white;\n                    border-color: #4CAF50;\n                }\n            </style>\n        ';
  }
  createMagnetHub(keyword) {
    keyword = keyword.replace('FC2-', '');
    const $container = $('<div class="magnet-container"></div>'),
      $tabs = $('<div class="magnet-tabs"></div>'),
      key = 'jhs_magnetHub_selectedEngine',
      savedEngineId = localStorage.getItem(key);
    let defaultEngineIndex = 0;
    const $tabBox = $('<div style="display: flex;"></div>');
    this.searchEngines.forEach((engine, index) => {
      const $tab = $(
        `<div class="magnet-tab" data-engine="${engine.id}">${engine.name}</div>`,
      );
      if (savedEngineId && engine.id === savedEngineId) {
        $tab.addClass('active');
        this.currentEngine = engine;
        defaultEngineIndex = index;
      } else if (0 === index && !savedEngineId) {
        $tab.addClass('active');
        this.currentEngine = engine;
      }
      $tabBox.append($tab);
    });
    $tabs.append($tabBox);
    $tabs.append(
      `<a style="margin-right: 20px;margin-top:3px" id="targetBox" href="${this.currentEngine.targetPage.replace(
        '{keyword}',
        encodeURIComponent(keyword),
      )}" target="_blank">Original Page</a>`,
    );
    $container.append($tabs);
    const $resultsContainer = $('<div class="magnet-results"></div>');
    $container.append($resultsContainer);
    $container.on('click', '.magnet-tab', (e) => {
      const engineId = $(e.target).data('engine');
      this.currentEngine = this.searchEngines.find(
        (engine) => engine.id === engineId,
      );
      $('#targetBox').attr(
        'href',
        this.currentEngine.targetPage.replace(
          '{keyword}',
          encodeURIComponent(keyword),
        ),
      );
      localStorage.setItem(key, engineId);
      $container.find('.magnet-tab').removeClass('active');
      $(e.target).addClass('active');
      this.searchEngine($resultsContainer, this.currentEngine, keyword);
    });
    this.searchEngine(
      $resultsContainer,
      this.currentEngine || this.searchEngines[defaultEngineIndex],
      keyword,
    );
    return $container;
  }
  searchEngine($container, engine, keyword) {
    $container.html(
      `<div class="magnet-loading">Searching "${keyword}" from ${engine.name}...</div>`,
    );
    const cacheKey = `${engine.name}_${keyword}`;
    sessionStorage.getItem(cacheKey);
    const url = engine.url.replace('{keyword}', encodeURIComponent(keyword));
    engine.parseHtml &&
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: (response) => {
          try {
            const results = engine.parseHtml.call(
              this,
              response.responseText,
              keyword,
            );
            results.length > 0 &&
              sessionStorage.setItem(cacheKey, JSON.stringify(results));
            this.displayResults($container, results, engine.name);
          } catch (e) {
            $container.html(
              `<div class="magnet-error">Failed to parse ${engine.name} results: ${e.message}</div>`,
            );
          }
        },
        onerror: (error) => {
          $container.html(
            `<div class="magnet-error">Failed to get data from ${engine.name}: ${error.statusText}</div>`,
          );
        },
      });
    engine.parseJson &&
      engine.parseJson.call(this, $container, engine, keyword, cacheKey);
  }
  displayResults($container, results, engineName) {
    $container.empty();
    if (0 !== results.length) {
      results.forEach((result) => {
        const $result = $(
          `\n                <div class="magnet-result">\n                    <div class="magnet-title"><a href="${
            result.magnet
          }">${
            result.title
          }</a></div>\n                    <div class="magnet-info">\n                        <span>Size: ${
            result.size || 'Unknown'
          }</span>\n                        <span>Date: ${
            result.date || 'Unknown'
          }</span>\n                    </div>\n                    <div class="magnet-copy">\n                        <button class="magnet-hub-btn copy-btn" data-magnet="${
            result.magnet
          }">Copy Link</button>\n                        <button class="magnet-hub-btn down-115" data-magnet="${
            result.magnet
          }">115 Offline Download</button>\n                    </div>\n                </div>\n            `,
        );
        $container.append($result);
      });
      $container.on('click', '.copy-btn', function () {
        const $btn = $(this),
          magnet = $btn.data('magnet');
        navigator.clipboard
          ? navigator.clipboard
              .writeText(magnet)
              .then(() => {
                showCopiedFeedback($btn);
              })
              .catch((err) => {
                fallbackCopy(magnet, $btn);
              })
          : fallbackCopy(magnet, $btn);
      });
      $container.on('click', '.down-115', async (event) => {
        const magnet = $(event.currentTarget).data('magnet');
        let loadObj = loading();
        try {
          await this.getBean('WangPan115TaskPlugin').handleAddTask(magnet);
        } catch (e) {
          show.error('An error occurred:' + e);
          console.error(e);
        } finally {
          loadObj.close();
        }
      });
    } else
      $container.append(
        '<div class="magnet-error">No relevant results found</div>',
      );
    function showCopiedFeedback($btn) {
      const originalText = $btn.text();
      $btn.addClass('copied').text('Copied');
      setTimeout(() => {
        $btn.removeClass('copied').text(originalText);
      }, 2e3);
    }
    function fallbackCopy(text, $btn) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showCopiedFeedback($btn);
      } catch (err) {
        console.error('Copy failed:', err);
        alert('Copy failed, please copy the link manually');
      }
      document.body.removeChild(textarea);
    }
  }
  parseBTSOW($container, engine, keyword, cacheKey) {
    const _this = this;
    GM_xmlhttpRequest({
      method: 'POST',
      url: engine.url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: `[{"search":"${keyword}"},50,1]`,
      onload: (response) => {
        try {
          const dataList = JSON.parse(response.responseText).data,
            results = [];
          for (let i = 0; i < dataList.length; i++) {
            let item = dataList[i];
            results.push({
              title: item.name,
              magnet: 'magnet:?xt=urn:btih:' + item.hash,
              size: (item.size / 1073741824).toFixed(2) + ' GB',
              date: utils.formatDate(new Date(1e3 * item.lastUpdateTime)),
            });
          }
          results.length > 0 &&
            sessionStorage.setItem(cacheKey, JSON.stringify(results));
          _this.displayResults($container, results, engine.name);
        } catch (e) {
          $container.html(
            `<div class="magnet-error">Failed to parse ${engine.name} results: ${e.message}</div>`,
          );
        }
      },
      onerror: (error) => {
        $container.html(
          `<div class="magnet-error">Failed to get data from ${engine.name}: ${error.statusText}</div>`,
        );
      },
    });
  }
  parseU3C3(html, keyword) {
    const $dom = utils.htmlTo$dom(html),
      results = [];
    $dom.find('.torrent-list tbody tr').each((i, el) => {
      const $el = $(el);
      if ($el.text().includes('置顶')) return; // "Pinned"
      const title =
        $el.find('td:nth-child(2) a').attr('title') ||
        $el.find('td:nth-child(2) a').text().trim();
      if (!title.toLowerCase().includes(keyword.toLowerCase())) return;
      const magnet = $el
          .find("td:nth-child(3) a[href^='magnet:']")
          .attr('href'),
        size = $el.find('td:nth-child(4)').text().trim(),
        date = $el.find('td:nth-child(5)').text().trim();
      magnet &&
        results.push({
          title: title,
          magnet: magnet,
          size: size,
          date: date,
        });
    });
    return results;
  }
  parseSukebei(html, keyword) {
    const $dom = utils.htmlTo$dom(html),
      results = [];
    $dom.find('.torrent-list tbody tr').each((i, el) => {
      const $el = $(el);
      if ($el.text().includes('置顶')) return; // "Pinned"
      const title =
        $el.find('td:nth-child(2) a').attr('title') ||
        $el.find('td:nth-child(2) a').text().trim();
      if (!title.toLowerCase().includes(keyword.toLowerCase())) return;
      const magnet = $el
          .find("td:nth-child(3) a[href^='magnet:']")
          .attr('href'),
        size = $el.find('td:nth-child(4)').text().trim(),
        date = $el.find('td:nth-child(5)').text().trim();
      magnet &&
        results.push({
          title: title,
          magnet: magnet,
          size: size,
          date: date,
        });
    });
    return results;
  }
}

class ScreenShotPlugin extends BasePlugin {
  getName() {
    return 'ScreenShotPlugin';
  }
  async handle() {
    this.loadScreenShot().then();
  }
  async loadScreenShot() {
    if (!isDetailPage) return;
    if (
      'yes' !== (await storageManager.getSetting('enableLoadScreenShot', 'yes'))
    )
      return;
    let carNum2 = this.getPageInfo().carNum;
    isJavDb &&
      $('.preview-images .tile-item')
        .first()
        .before(
          ' <a class="tile-item screen-container" style="overflow:hidden;max-height: 215px;text-align:center;"><div style="margin-top: 50px;color: #000;cursor: auto">Loading thumbnail</div></a> ',
        );
    isJavBus &&
      $('#sample-waterfall .sample-box:first').after(
        ' <a class="sample-box screen-container" style="overflow:hidden; height: 110px; text-align:center;"><div style="margin-top: 30px;color: #000;cursor: auto">Loading thumbnail</div></a> ',
      );
    try {
      const imgUrl = await this.getScreenshot(carNum2);
      this.addImg('Thumbnail', imgUrl);
      clog.log('Loading thumbnail:', imgUrl);
    } catch (e) {
      this.showErrorFallback(carNum2, e);
    }
  }
  async getScreenshot(carNum2) {
    const cacheData = localStorage.getItem('jhs_screenShot')
      ? JSON.parse(localStorage.getItem('jhs_screenShot'))
      : {};
    if (cacheData[carNum2]) {
      clog.debug('Thumbnail exists in cache:', carNum2, cacheData[carNum2]);
      return cacheData[carNum2];
    }
    let imgUrl;
    try {
      imgUrl = await Promise.any([this.getJavStoreScreenShot(carNum2)]);
    } catch (e) {
      clog.error('Failed to get thumbnail resource:', imgUrl, e);
      throw e;
    }
    if (!imgUrl) {
      this.showErrorFallback(carNum2, null);
      return null;
    }
    const httpsIndex = imgUrl.indexOf('https://');
    -1 !== httpsIndex && (imgUrl = imgUrl.substring(httpsIndex));
    cacheData[carNum2] = imgUrl;
    clog.log('Thumbnail obtained successfully:', imgUrl);
    localStorage.setItem('jhs_screenShot', JSON.stringify(cacheData));
    return imgUrl;
  }
  async getJavStoreScreenShot(carNum2) {
    let url = `https://javstore.net/search?q=${carNum2}`;
    clog.log('Parsing thumbnail:', url);
    let html = await gmHttp.get(url);
    const $dom = utils.htmlTo$dom(html),
      tempCarNum = carNum2.toLowerCase().replace('fc2-', '').replace('-', '');
    let detailPageUrl = null;
    const $itemList = $dom.find('main .grid a');
    for (let i = 0; i < $itemList.length; i++) {
      const href = $($itemList[i]).attr('href') || '';
      if (
        href
          .toLowerCase()
          .replace(/fc2-(ppv-)?/g, '')
          .replace('-', '')
          .includes(tempCarNum)
      ) {
        detailPageUrl = new URL(href, 'https://javstore.net').href;
        break;
      }
    }
    if (!detailPageUrl) {
      clog.error('JavStore, failed to query ID:', url);
      return null;
    }
    let detailPageHtml = await gmHttp.get(detailPageUrl);
    const $detailPageDom = utils.htmlTo$dom(detailPageHtml);
    let imgUrl =
      $detailPageDom.find("a:contains('CLICK HERE')").attr('href') ||
      $detailPageDom.find("img[src*='_s.jpg']").attr('src');
    if (!imgUrl) {
      clog.error('JavStore, failed to parse preview image:', url);
      return null;
    }
    return imgUrl.replace('.th', '');
  }
  async getJavBestScreenShot(carNum2) {
    let url = `https://javbest.net/?s=${carNum2}`;
    clog.log('Parsing thumbnail:', url);
    let html = await gmHttp.get(url);
    const $dom = utils.htmlTo$dom(html),
      href = $dom.find('.app_loop_thumb a').first().attr('href');
    if (!href) {
      clog.error('Failed to parse JavBest search page:', url);
      throw new Error('Failed to parse JavBest search page');
    }
    const title = $dom.find('.app_loop_thumb a').first().attr('title');
    if (!title.toLowerCase().includes(carNum2.toLowerCase())) {
      clog.error('Failed to parse JavBest search page:', title);
      throw new Error('Failed to parse JavBest search page');
    }
    const detailPageHtml = await gmHttp.get(href);
    let imgUrl = $(detailPageHtml)
      .find('#content a img[src*="_t.jpg"]')
      .attr('src');
    if (!imgUrl) {
      clog.error('Failed to parse JavBest thumbnail:', url);
      throw new Error('Failed to parse JavBest thumbnail');
    }
    imgUrl = imgUrl.replace('_t', '').replace('http:', 'https:');
    return imgUrl;
  }
  async getJavFreeScreenShot(carNum2) {
    let url = `https://javfree.me/search/${carNum2}/`,
      html = await gmHttp.get(url);
    const $itemList = utils.htmlTo$dom(html).find('article h2.entry-title a');
    if (!$itemList || 0 === $itemList.length) {
      clog.error('Failed to parse JavFree search page:', url);
      throw new Error('Failed to parse JavFree search page');
    }
    let detailPageUrl = $($itemList[0]).attr('href'),
      detailPageHtml = await gmHttp.get(detailPageUrl);
    const $imgList = utils
      .htmlTo$dom(detailPageHtml)
      .find('#main > article > .entry-content > p img');
    if (!$imgList || 0 === $imgList.length) {
      clog.error('Failed to parse JavFree detail page:', detailPageUrl);
      throw new Error('Failed to parse JavFree detail page');
    }
    const srcList = $imgList
      .filter(function () {
        const src = $(this).attr('src');
        return src && src.toLowerCase().endsWith('.jpeg');
      })
      .map(function () {
        return $(this).attr('src');
      })
      .get();
    console.log(srcList);
    return srcList.at(-1);
  }
  addImg(title, imgUrl) {
    if (imgUrl) {
      isJavDb &&
        $('.screen-container').html(
          `<img src="${imgUrl}" alt="${title}" loading="lazy" style="width: 100%;">`,
        );
      isJavBus &&
        $('.screen-container').html(
          `<div class="photo-frame"><img src="${imgUrl}" style="height: inherit;width: 100%;" title="${title}" alt="${title}"></div>`,
        );
      $('.screen-container').on('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        showImageViewer(event.currentTarget);
      });
    }
  }
  showErrorFallback(carNum2, error) {
    var _a2;
    console.error(
      'Failed to get thumbnail:',
      null == (_a2 = null == error ? void 0 : error.message)
        ? void 0
        : _a2.substring(0, 100),
    );
    let differentCss = isJavBus ? 'margin-top: 30px' : 'margin-top: 50px';
    $('.screen-container')
      .html(
        `<div style="${differentCss}; cursor:auto;color:#000;">Failed to get thumbnail</div><br/><a href='#' class='retry-link'>Click to retry</a> Or <a class="check-link" href='https://javstore.net/search?q=${carNum2}' target='_blank'>Go to confirm</a>`,
      )
      .off('click', '.retry-link')
      .off('click', '.check-link')
      .on('click', '.retry-link', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        $('.screen-container').html(
          `<div style="${differentCss};cursor:auto;color:#000;">Retrying to load...</div>`,
        );
        try {
          const imgUrl = await this.getScreenshot(carNum2);
          this.addImg('Thumbnail', imgUrl);
        } catch (err) {
          this.showErrorFallback(carNum2, err);
        }
      })
      .on('click', '.check-link', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        window.open(`https://javstore.net/search?q=${carNum2}`, '_blank');
      });
  }
}

const getDownPathList = async () => {
    const res = await gmHttp.get('https://webapi.115.com/offine/downpath');
    return 'object' == typeof res ? res.data : null;
  },
  searchFiles = async (search_value, offset = 0, limit = 30) => {
    const url = `https://webapi.115.com/files/search?search_value=${encodeURIComponent(
      search_value,
    )}&offset=${offset}&limit=${limit}`;
    return await gmHttp.get(url);
  };

class WangPan115TaskPlugin extends BasePlugin {
  getName() {
    return 'WangPan115TaskPlugin';
  }
  async handle() {
    $(".buttons button[data-clipboard-text*='magnet:']").each((i, el) => {
      $(el)
        .parent()
        .append(
          $('<button>')
            .text('115 Offline Download')
            .addClass('button is-info is-small')
            .click(async (event) => {
              event.stopPropagation();
              event.preventDefault();
              let loadObj = loading();
              try {
                await this.handleAddTask($(el).attr('data-clipboard-text'));
              } catch (e) {
                show.error('An error occurred:' + e);
                console.error(e);
              } finally {
                loadObj.close();
              }
            }),
        );
    });
    isJavBus &&
      isDetailPage &&
      utils.loopDetector(
        () => $('#magnet-table td a').length > 0,
        () => {
          this.bus115Down();
        },
      );
  }
  async bus115Down() {
    $('#magnet-table tr').each((i, row) => {
      const magnetLink = $(row).find('td:nth-child(1) a').attr('href');
      if (magnetLink && magnetLink.includes('magnet:')) {
        const actionCell = $('<td>').addClass('action-cell');
        $('<button>')
          .text('115 Offline Download')
          .addClass('button is-info is-small')
          .click(async (event) => {
            event.stopPropagation();
            event.preventDefault();
            let loadObj = loading();
            try {
              await this.handleAddTask(magnetLink);
            } catch (e) {
              show.error('An error occurred:' + e);
              console.error(e);
            } finally {
              loadObj.close();
            }
          })
          .appendTo(actionCell);
        $(row).append(actionCell);
      }
    });
    $('#magnet-table tbody').length > 0 &&
      $('#magnet-table tbody tr').append($('<td>').text('Actions'));
  }
  async getSavePathId(nyName) {
    let savePath115 = await storageManager.getSetting(
      'savePath115',
      'Cloud Download',
    );
    nyName && (savePath115 = savePath115.replaceAll('{ny}', nyName));
    savePath115 = savePath115.replaceAll(
      '{date}',
      utils.formatDate(new Date()),
    );
  }
  async handleAddTask(magnetLink, savePath) {
    const singInfo = await (async () => {
      const res = await gmHttp.get(
        'https://115.com/?ct=offline&ac=space&_=' + new Date().getTime(),
      );
      return 'object' == typeof res ? res : null;
    })();
    if (!singInfo) {
      show.error('Not logged in to 115 cloud drive', {
        close: !0,
        duration: -1,
        callback: async () => {
          window.open('https://115.com');
        },
      });
      return;
    }
    const sign = singInfo.sign,
      time = singInfo.time,
      userId = this.getUserId(),
      result = await (async (magnet, wp_path_id = '', uid, sign, time) => {
        const data = {
          url: encodeURIComponent(magnet),
          wp_path_id: '',
          uid: uid,
          sign: sign,
          time: time,
        };
        return await gmHttp.postForm(
          'https://115.com/web/lixian/?ct=lixian&ac=add_task_url',
          data,
        );
      })(magnetLink, userId, sign, time);
    console.log('Offline download return value:', result);
    let infoHash = result.info_hash,
      fileId = await this.getFileId(userId, sign, time, infoHash),
      openUrl = 'https://115.com/?tab=offline&mode=wangpan';
    fileId &&
      (openUrl = `https://115.com/?cid=${fileId}&offset=0&mode=wangpan`);
    let title = 'Added successfully, do you want to view it?';
    !1 === result.state &&
      (title = result.error_msg + ' Do you want to view it?');
    utils.q(null, title, async () => {
      let fileId2 = await this.getFileId(userId, sign, time, infoHash);
      fileId2 &&
        (openUrl = `https://115.com/?cid=${fileId2}&offset=0&mode=wangpan`);
      window.open(openUrl);
    });
  }
  async getUserId() {
    let downPathList = await getDownPathList();
    if (downPathList && downPathList.length > 0) return downPathList[0].id;
    {
      show.info('No default offline directory, creating...');
      const dirId = (
        await (async (dirName, pid = 0) => {
          const data = {
            pid: pid,
            cname: dirName,
          };
          return await gmHttp.postFileFormData(
            'https://webapi.115.com/files/add',
            data,
          );
        })('Cloud Download')
      ).file_id;
      await (async (dirId) => {
        const data = {
          file_id: dirId,
        };
        return await gmHttp.postFileFormData(
          'https://webapi.115.com/offine/downpath',
          data,
        );
      })(dirId);
      show.info('Creation complete, starting offline download');
      downPathList = await getDownPathList();
      if (downPathList && downPathList.length > 0) return downPathList[0].id;
      throw new Error('Failed to get 115 user ID');
    }
  }
  async getFileId(userId, sign, time, infoHash) {
    const taskList = await (async (uid, sign, time) => {
      const data = {
        page: 1,
        uid: uid,
        sign: sign,
        time: time,
      };
      return (
        await gmHttp.postForm(
          'https://115.com/web/lixian/?ct=lixian&ac=task_lists',
          data,
        )
      ).tasks;
    })(userId, sign, time);
    console.log('Cloud offline list:', taskList);
    let fileId = null;
    for (let i = 0; i < taskList.length; i++) {
      let task = taskList[i];
      if (task.info_hash === infoHash) {
        fileId = task.file_id;
        break;
      }
    }
    return fileId;
  }
}

class WangPan115Plugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'JHS_115_COOKIE', 'jhs_115_cookie');
    __publicField(this, 'JHS_115_MAX_AGE', 'jhs_115_max_age');
  }
  getName() {
    return 'WangPan115Plugin';
  }
  async initCss() {
    return "\n            <style>\n                .login-box .ltab-office {\n                    border: 1px solid #DEE4EE;\n                }\n                \n                .change-bg::before {\n                    background-color:#F9FAFB !important;\n                }\n                \n                .site-login-wrap {\n                    height: auto;\n                }\n                \n                #jhs-cookie-panel {\n                    width: 200px;\n                    position: fixed;\n                    bottom: 20px;\n                    right: 20px;\n                    z-index: 10000;\n                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n                    cursor: pointer;\n                    background-color: #FFFFFF;\n                    color: #333333;\n                    padding: 0;\n                    border-radius: 6px;\n                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n                    transition: all 0.3s ease;\n                    border: 1px solid #E0E0E0;\n                }\n    \n                #jhs-cookie-panel.expanded {\n                    padding: 0;\n                    border-radius: 8px;\n                    background-color: #FFFFFF;\n                    color: #333333;\n                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);\n                }\n    \n                #jhs-cookie-header {\n                    padding: 10px 15px;\n                    background-color: #0078D4;\n                    color: white;\n                    border-radius: 6px 6px 0 0;\n                    display: flex;\n                    justify-content: space-between;\n                    align-items: center;\n                    font-weight: 600;\n                }\n                \n                #jhs-cookie-panel:not(.expanded) #jhs-cookie-header {\n                    border-radius: 6px;\n                    padding: 8px 15px;\n                }\n    \n                #jhs-cookie-content {\n                    max-height: 0;\n                    overflow: hidden;\n                    transition: max-height 0.3s ease-out;\n                    padding: 0 15px;\n                }\n    \n                #jhs-cookie-panel.expanded #jhs-cookie-content {\n                    max-height: 250px;\n                    padding: 15px;\n                }\n    \n                #jhs-cookie-value {\n                    max-height: 100px;\n                    overflow-y: auto;\n                    white-space: pre-wrap;\n                    word-break: break-all;\n                    margin-bottom: 15px;\n                    padding: 10px;\n                    border: 1px solid #CCCCCC;\n                    background-color: #F8F8F8;\n                    font-size: 12px;\n                    border-radius: 4px;\n                    color: #555;\n                }\n    \n                #jhs-copy-btn {\n                    background-color: #10B981;\n                    color: white;\n                    border: none;\n                    padding: 8px 15px;\n                    text-align: center;\n                    text-decoration: none;\n                    display: inline-block;\n                    font-size: 14px;\n                    margin: 0;\n                    cursor: pointer;\n                    border-radius: 4px;\n                    width: 100%;\n                    font-weight: 600;\n                    transition: background-color 0.2s ease;\n                }\n                \n                #jhs-copy-btn:hover {\n                    background-color: #059669;\n                }\n            </style>\n        ";
  }
  async handle() {
    if (!currentHref.includes('&ac=userfile') && currentHref.includes('115')) {
      utils.loopDetector(
        () => $('#js-login-box').length > 0,
        () => {
          if (0 !== $('#js-login-box').length) {
            this.reLogin();
            this.hookPage();
            this.bindClick();
          }
        },
        20,
        4e3,
        !0,
      );
      this.createCookiePanel();
    }
  }
  reLogin() {
    utils.loopDetector(
      () => $('.login-finished').length > 0,
      () => {
        if ($('.login-finished').length > 0 || 0 === $('#js-login-box').length)
          return;
        const jhs_115_cookie = localStorage.getItem(this.JHS_115_COOKIE),
          jhs_115_max_age = localStorage.getItem(this.JHS_115_MAX_AGE);
        document.cookie.includes('SEID') ||
          null === jhs_115_cookie ||
          utils.q(
            null,
            'Detected cached cookie from last login, use it to log in?',
            () => {
              utils.addCookie(jhs_115_cookie, {
                maxAge: parseInt(jhs_115_max_age),
                domain: '.115.com',
              });
              window.location.href =
                'https://115.com/?cid=0&offset=0&mode=wangpan';
            },
          );
      },
      20,
      1500,
      !0,
    );
  }
  hookPage() {
    const $cookieTab = $('<a id="jhs-cookie"><s>🔰 JHS-Scan</s></a>');
    $('.ltab-office').after($cookieTab);
    const $cookieScene = $(
      `\n            <div id="jhs_cookie_box" style="display: none; padding: 0 20px; max-width: 300px; margin: auto;">\n                <div style="margin-bottom: 15px; text-align: center;">\n                    <span style="font-size: 18px; font-weight: bold; color: #333; display: block; margin-bottom: 10px;"> Use 115App to scan code login </span>\n                    <div style="text-align: left;">\n                        <select id="login-115-type" style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ddd; font-size: 14px; box-sizing: border-box; background-color: white;">\n                            <option value="" style="color: #999;">Please select login method</option>\n                            <option value="wechatmini">WeChat Mini Program</option>\n                            <option value="alipaymini">Alipay Mini Program</option>\n                        </select>\n                    </div>\n                </div>\n                \n                <div style="text-align: left;">\n                    <select id="cookie-expiry-select" style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ddd; font-size: 14px; box-sizing: border-box; background-color: white;">\n                        ${[
        {
          label: 'Validity: Session (close browser)',
          value: 0,
        },
        {
          label: 'Validity: 1 Day',
          value: 86400,
        },
        {
          label: 'Validity: 7 Days',
          value: 604800,
        },
        {
          label: 'Validity: 30 Days',
          value: 2592e3,
          default: !0,
        },
        {
          label: 'Validity: 60 Days',
          value: 5184e3,
        },
        {
          label: 'Validity: 180 Days',
          value: 15552e3,
        },
      ]
        .map(
          (c) =>
            `<option value="${c.value}"  ${c.default ? 'selected' : ''} > ${
              c.label
            } </option>`,
        )
        .join(
          '',
        )}\n                    </select>\n                </div>\n                \n                <div id="qrcode-box" style="display: none; justify-content:center; min-height: 100px; border: 1px dashed #aaa; padding: 15px; text-align: center; margin-top: 15px; border-radius: 4px; background-color: #fff; line-height: 70px; color: #666;">\n                    QR Code Placeholder Area\n                </div>\n                \n                                \n                <div style="margin-bottom: 15px; text-align: center; margin-top:50px">\n                    <span style="font-size: 18px; font-weight: bold; color: #333; display: block; margin-bottom: 10px;">Already have a Cookie? Enter it here and press Enter</span>\n                    <div style="text-align: left;">\n                        <input type="text" id="cookie-str-input" style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ddd; font-size: 14px; box-sizing: border-box; background-color: white;">\n                    </div>\n                     <div style="text-align: center;margin-top:5px">\n                        <a class="a-primary" id="submit-cookie-btn">Submit</a>\n                    </div>\n                </div>\n            </div>\n        `,
    );
    $('#js-login_box').find('.login-footer').before($cookieScene);
  }
  bindClick() {
    $('#jhs-cookie').on('click', () => {
      const finishedEl = document.querySelector('[lg_rel="finished"]');
      if (finishedEl) finishedEl.style.display = 'none';
      else {
        document.querySelector('[lg_rel="qrcode"]').style.display = 'none';
        document.querySelector('.login-footer').style.display = 'none';
        document.querySelector('.list-other-login').style.display = 'none';
      }
      document.querySelectorAll('#js-login_way > *').forEach((tab) => {
        tab.classList.remove('current');
      });
      document.querySelector('#jhs_cookie_box').style.display = 'block';
      $('#jhs-cookie').css('background', '#fff');
      $('.ltab-cloud').addClass('change-bg');
    });
    $('.ltab-cloud').on('click', () => {
      document.querySelector('#jhs_cookie_box').style.display = 'none';
      const finishedEl = document.querySelector('[lg_rel="finished"]');
      if (finishedEl) finishedEl.style.display = 'flex';
      else {
        document.querySelector('[lg_rel="qrcode"]').style.display = 'block';
        document.querySelector('.login-footer').style.display = 'block';
        document.querySelector('.list-other-login').style.display = 'block';
      }
      $('#jhs-cookie').css('background', '#F9FAFB');
      $('.ltab-cloud').removeClass('change-bg');
    });
    let loginTimeout = null;
    $('#login-115-type').on('change', async (event) => {
      let login115Type = $('#login-115-type').val();
      if (!login115Type) return;
      const loginInfo = (
          await (async (loginType) => {
            let url = `https://qrcodeapi.115.com/api/1.0/${loginType}/1.0/token/`;
            return await gmHttp.get(url);
          })(login115Type)
        ).data,
        qrcode = loginInfo.qrcode,
        sign = loginInfo.sign,
        time = loginInfo.time,
        uid = loginInfo.uid;
      console.log('Generating QR code:', loginInfo);
      const $qrcodeBox = $('#qrcode-box');
      $qrcodeBox.css('display', 'flex');
      $qrcodeBox.html('');
      new QRCode($qrcodeBox[0], {
        text: qrcode,
        width: 150,
        height: 150,
        correctLevel: QRCode.CorrectLevel.H,
      });
      loginTimeout && clearTimeout(loginTimeout);
      const checkLoginRecursive = async () => {
        try {
          const loginResult = await (async (uid, time, sign) => {
            let url = `https://qrcodeapi.115.com/get/status/?uid=${uid}&time=${time}&sign=${sign}`;
            return await gmHttp.get(url);
          })(uid, time, sign);
          console.log('Scanned QR code, getting results:', loginResult);
          let data = loginResult.data,
            msg = data.msg,
            status = data.status;
          if (msg) {
            console.log(msg);
            show.info(msg);
          }
          if (2 === status) {
            show.ok('QR code login successful');
            const checkResult = await (async (loginType, uid) => {
              const data = {
                  app: loginType,
                  account: uid,
                },
                url = `https://passportapi.115.com/app/1.0/${loginType}/1.0/login/qrcode/`;
              return await gmHttp.postFileFormData(url, data);
            })(login115Type, uid);
            console.log('QR code login successful:', checkResult);
            if (checkResult.data && checkResult.data.cookie) {
              const cookie = checkResult.data.cookie,
                cookieStr = `UID=${cookie.UID}; CID=${cookie.CID}; SEID=${cookie.SEID}; KID=${cookie.KID}`;
              console.log('Parsed cookie:', cookieStr);
              localStorage.setItem(this.JHS_115_COOKIE, cookieStr);
              localStorage.setItem(
                this.JHS_115_MAX_AGE,
                $('#cookie-expiry-select').val(),
              );
              window.location.href =
                'https://115.com/?cid=0&offset=0&mode=wangpan';
            }
            return;
          }
          loginTimeout = setTimeout(checkLoginRecursive, 500);
        } catch (error) {
          console.error('Login check failed:', error);
        }
      };
      await checkLoginRecursive();
    });
    const handleCookie = () => {
        const cookieStr = cookieInput.value,
          expirySelect = document.getElementById('cookie-expiry-select');
        let maxAge = parseInt(expirySelect.value);
        utils.addCookie(cookieStr, {
          maxAge: maxAge,
          domain: '.115.com',
        });
        window.location.href = 'https://115.com/?cid=0&offset=0&mode=wangpan';
      },
      cookieInput = document.getElementById('cookie-str-input');
    cookieInput.addEventListener('keydown', function (event) {
      if ('Enter' === event.key) {
        event.preventDefault();
        handleCookie();
      }
    });
    $('#submit-cookie-btn').on('click', () => {
      handleCookie();
    });
  }
  showMessage(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText =
      '\n            position: fixed;\n            top: 20px;\n            right: 20px;\n            background-color: #333;\n            color: white;\n            padding: 10px 20px;\n            border-radius: 5px;\n            z-index: 20000;\n            opacity: 0;\n            transition: opacity 0.5s ease-in-out;\n        ';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 3e3);
  }
  createCookiePanel() {
    const cookieValue = localStorage.getItem(this.JHS_115_COOKIE);
    if (!cookieValue) return;
    const panel = document.createElement('div');
    panel.id = 'jhs-cookie-panel';
    panel.innerHTML = `\n            <div id="jhs-cookie-header">\n                <span>JHS-115-Cookie</span>\n                <span id="jhs-toggle-icon">▼</span>\n            </div>\n            <div id="jhs-cookie-content">\n                <div id="jhs-cookie-value">${cookieValue}</div>\n                <button id="jhs-copy-btn">Copy Cookie</button>\n            </div>\n        `;
    document.body.appendChild(panel);
    const header = document.getElementById('jhs-cookie-header');
    document.getElementById('jhs-cookie-content');
    const toggleIcon = document.getElementById('jhs-toggle-icon'),
      copyButton = document.getElementById('jhs-copy-btn');
    header.addEventListener('click', () => {
      const isExpanded = panel.classList.toggle('expanded');
      toggleIcon.textContent = isExpanded ? '▲' : '▼';
    });
    copyButton.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(cookieValue);
        this.showMessage('Cookie successfully copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text using clipboard API: ', err);
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = cookieValue;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        this.showMessage('Cookie copied! (fallback solution)');
      }
    });
    panel.classList.remove('expanded');
  }
}

const _WangPan115MatchPlugin = class _WangPan115MatchPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(
      this,
      'loginStatus',
      _WangPan115MatchPlugin.LoginStatus.UNCHECKED,
    );
  }
  getName() {
    return 'WangPan115MatchPlugin';
  }
  async initCss() {
    return "\n            <style>\n                [class^='jhs-match-'] {\n                    padding: 1px 2px;\n                    margin-left: 0;\n                    margin-right: 5px;\n                }\n                \n                .jhs-match-detail {\n                    display: inline-block;\n                    width: 50%;\n                    z-index: 1000;\n                    background: #fff;\n                    border: 1px solid #ddd;\n                    border-radius: 4px;\n                    padding: 10px;\n                    overflow-y: auto;\n                }\n                .jhs-match-detail.isListPage{\n                    position: absolute;\n                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);\n                }\n                .jhs-match-detail table {\n                    width: 100%;\n                    border-collapse: collapse;\n                }\n                .jhs-match-detail th, .jhs-match-detail td {\n                    padding: 4px 8px;\n                    border: 1px solid #eee;\n                    text-align: left;\n                }\n                .jhs-match-detail th {\n                    background-color: #f5f5f5;\n                }\n                .jhs-match-detail tr:hover {\n                    background-color: #f9f9f9;\n                }\n            </style>\n        ";
  }
  async handle() {
    $(document).on('click', '.jhs-match-no-login-btn', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await this.handleLoginRedirect();
    });
    $(document).on('click', '.jhs-match-btn', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.showMatchDetail(event.currentTarget);
    });
    $(document).on('click', '.jhs-match-error-btn', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await this.retryMatch(event.currentTarget);
    });
    await this.matchDetailPage();
    $(document).on('click', '.jhs-match-detail-error-btn', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      $(event.currentTarget).replaceWith(
        '<a class=\'jhs-match-btn\' title="Matching...">Matching...</a>',
      );
      try {
        const carNum2 = this.getPageInfo().carNum,
          matchList = await this.searchFiles(carNum2);
        $('.jhs-115-match-detail').remove();
        await this.matchDetailPage(matchList);
      } catch (error) {
        console.error(`Rematch failed [${carNum}]:`, error);
        this.showMatchError($box, carNum, error);
      }
    });
  }
  async matchDetailPage(matchList) {
    if (!isDetailPage) return;
    if ((await storageManager.getSetting('enable115Match', NO)) === NO) return;
    const $detail = $(
        '\n            <div class="jhs-match-detail jhs-115-match-detail" id="115-match-table">\n                <table>\n                    <thead>\n                        <tr style="text-align: center">\n                            <th colspan="4">115 Match</th>\n                        </tr>\n                        <tr>\n                            <th>Name</th>\n                            <th>Size</th>\n                            <th>Time</th>\n                            <th>Play</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                    </tbody>\n                </table>\n            </div>\n        ',
      ),
      $tbody = $detail.find('tbody');
    try {
      const carNum2 = this.getPageInfo().carNum;
      matchList || (matchList = await this.searchFiles(carNum2));
      await this.checkLoginStatus();
      if (this.loginStatus === _WangPan115MatchPlugin.LoginStatus.LOGGED_OUT)
        $tbody.append(
          `<tr><td colspan="4">\n                     <a class='jhs-match-no-login-btn a-info'\n                        data-keyword="${carNum2}"\n                        title="Not logged in to 115 cloud drive">Not logged in</a>\n                 </td></tr>`,
        );
      else if (matchList.length > 0) {
        const rowsHtml = matchList
          .map(
            (match) =>
              `\n                <tr>\n                    <td>${
                match.name
              }</td>\n                    <td>${this.formatSize(
                match.size,
              )}</td>\n                    <td>${
                match.createTime
              }</td>\n                    <td>\n                        <a href="https://115vod.com/?pickcode=${
                match.videoId
              }&share_id=0"\n                           target="_blank"\n                           class="a-success"\n                           title="Play">Play</a>\n                    </td>\n                </tr>\n            `,
          )
          .join('');
        $tbody.append(rowsHtml);
      } else
        $tbody.append(
          `<tr><td colspan="4">\n                     <a class='jhs-match-detail-error-btn a-info'\n                        data-keyword="${carNum2}"\n                        title="Not matched, click to retry">Not matched</a>\n                 </td></tr>`,
        );
    } catch (error) {
      $tbody.append(
        `<tr><td colspan="4">\n                 <a class="a-danger jhs-match-detail-error-btn" title="${
          error.message || 'Failed to load'
        }">Failed to load, please retry</a>\n             </td></tr>`,
      );
      console.error('Error loading file list:', error);
    }
    if (isJavDb)
      if ($('#all-match-box').length) $('#all-match-box').append($detail);
      else {
        $('#tabs-container').before(
          "<div style='display: flex' id='all-match-box'></div>",
        );
        $('#all-match-box').append($detail);
      }
    else $('#mag-submit-show').before($detail);
  }
  async matchMovieList(movieListElement) {
    if ((await storageManager.getSetting('enable115Match', NO)) !== NO) {
      await this.checkLoginStatus();
      await this.processMovieElements(movieListElement);
    } else $(".video-title [class^='jhs-match-']").remove();
  }
  showMatchDetail(buttonElement) {
    const $el = $(buttonElement),
      matchData = $el.attr('data-match');
    $('.jhs-match-detail').remove();
    const matches = this.parseMatchData(matchData);
    if (0 === matches.length) return;
    if (1 === matches.length) {
      const pickcode = matches[0].videoId;
      window.open(
        `https://115vod.com/?pickcode=${pickcode}&share_id=0`,
        '_blank',
      );
      return;
    }
    const $detail = this.createMatchDetailElement(matches);
    this.positionDetailElement($detail, $el);
    this.addOutsideClickHandler($detail);
    $detail.on('click', (e) => {
      e.stopPropagation();
    });
  }
  parseMatchData(matchData) {
    try {
      return JSON.parse(matchData) || [];
    } catch (e) {
      console.error('Failed to parse match data:', e);
      return [];
    }
  }
  createMatchDetailElement(matches) {
    const $detail = $(
      `\n            <div class="jhs-match-detail isListPage">\n                <table>\n                    <thead>\n                        <tr>\n                            <th>Name</th>\n                            <th>Size</th>\n                            <th>Time</th>\n                            <th>Play</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        ${matches
        .map(
          (match) =>
            `\n                            <tr>\n                                <td>${
              match.name
            }</td>\n                                <td>${this.formatSize(
              match.size,
            )}</td>\n                                <td>${
              match.createTime
            }</td>\n                                <td>\n                                    <a href="https://115vod.com/?pickcode=${
              match.videoId
            }&share_id=0" \n                                       target="_blank" \n                                       class="a-success"\n                                       title="Play">Play</a>\n                                </td>\n                            </tr>\n                        `,
        )
        .join(
          '',
        )}\n                    </tbody>\n                </table>\n            </div>\n        `,
    );
    $('body').append($detail);
    return $detail;
  }
  positionDetailElement($detail, $trigger) {
    const offset = $trigger.offset();
    $detail.css({
      top: offset.top - $detail.outerHeight() + 20,
      left: offset.left,
    });
  }
  addOutsideClickHandler($detail) {
    setTimeout(() => {
      $(document).on('click.jhs-match-detail', (e) => {
        if (!$detail.is(e.target) && 0 === $detail.has(e.target).length) {
          $detail.remove();
          $(document).off('click.jhs-match-detail');
        }
      });
    }, 100);
  }
  async retryMatch(buttonElement) {
    const $el = $(buttonElement),
      $box2 = $el.closest('.movie-box, .item'),
      carNum2 = $el.attr('data-keyword');
    $el.replaceWith(
      '<a class=\'jhs-match-btn\' title="Matching...">Matching...</a>',
    );
    try {
      const matchList = await this.searchFiles(carNum2);
      this.updateMatchStatus($box2, carNum2, matchList);
    } catch (error) {
      console.error(`Rematch failed [${carNum2}]:`, error);
      this.showMatchError($box2, carNum2, error);
    }
  }
  updateMatchStatus($box2, carNum2, matchList) {
    matchList.length > 0
      ? $box2
          .find('.jhs-match-btn')
          .replaceWith(
            `<a class='jhs-match-btn a-success' \n                   data-keyword="${carNum2}"\n                   data-match='${JSON.stringify(
              matchList,
            )}'\n                   title="Click to view match details">Matched ${
              matchList.length
            }</a>`,
          )
      : $box2
          .find('.jhs-match-btn')
          .replaceWith(
            `<a class='jhs-match-error-btn a-info' data-keyword="${carNum2}" \n                  title="Click to retry matching">Not matched</a>`,
          );
  }
  async handleLoginRedirect() {
    window.open('https://115.com');
  }
  async searchFiles(carNum2) {
    var _a2;
    let searchKeyword = carNum2.toLowerCase().replace('fc2-', '');
    return (
      (null == (_a2 = (await searchFiles(searchKeyword)).data)
        ? void 0
        : _a2
            .map((data) => ({
              folderId: data.fid,
              videoId: data.pc,
              name: data.n,
              createTime: utils.formatDate(new Date(1e3 * data.te)),
              size: data.s,
              isVideo: ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv'].some(
                (ext) => {
                  var _a3;
                  return null == (_a3 = data.n)
                    ? void 0
                    : _a3.toLowerCase().endsWith(ext);
                },
              ),
            }))
            .filter(
              (x) =>
                x.folderId &&
                x.isVideo &&
                x.name.toLowerCase().includes(searchKeyword),
            )) || []
    );
  }
  showMatchError($box2, carNum2, error) {
    $box2
      .find('.jhs-match-btn')
      .replaceWith(
        `<a class='jhs-match-error-btn' data-keyword="${carNum2}" \n              title="Matching failed, click to retry">Matching failed</a>`,
      );
    show.error(
      `${carNum2} Matching failed: ${error.message || 'Network error'}`,
    );
  }
  async checkLoginStatus() {
    var _a2;
    if (this.loginStatus === _WangPan115MatchPlugin.LoginStatus.UNCHECKED)
      try {
        const testResult = await searchFiles('test');
        this.loginStatus = (
          null == (_a2 = testResult.error) ? void 0 : _a2.includes('登录')
        )
          ? // "login"
            _WangPan115MatchPlugin.LoginStatus.LOGGED_OUT
          : _WangPan115MatchPlugin.LoginStatus.LOGGED_IN;
      } catch {
        this.loginStatus = _WangPan115MatchPlugin.LoginStatus.LOGGED_OUT;
      }
  }
  async processMovieElements(movieListElement) {
    const promises = Array.from(movieListElement)
      .filter((ele) => !utils.isHidden(ele))
      .filter((ele) => !(isJavBus && $(ele).find('.avatar-box').length > 0))
      .map((ele) => this.processSingleMovieElement(ele));
    await Promise.all(promises);
  }
  async processSingleMovieElement(element) {
    const $box2 = $(element),
      { carNum: carNum2 } = this.getBoxCarInfo($box2);
    if (!($box2.find("[class^='jhs-match-']").length > 0))
      if (this.loginStatus !== _WangPan115MatchPlugin.LoginStatus.LOGGED_OUT)
        try {
          const matchList = await this.searchFiles(carNum2);
          this.addTag($box2, carNum2, matchList);
        } catch (error) {
          console.error(`Search failed [${carNum2}]:`, error);
          this.addTag($box2, carNum2, []);
        }
      else this.addTag($box2, carNum2, []);
  }
  addTag($box2, carNum2, matchList) {
    if (!($box2.find("[class^='jhs-match-']").length > 0))
      if (this.loginStatus === _WangPan115MatchPlugin.LoginStatus.LOGGED_OUT)
        $box2
          .find('.video-title')
          .prepend(
            `<a class='jhs-match-no-login-btn a-info' \n                   data-keyword="${carNum2}" \n                   title="Not logged in to 115 cloud drive">Not logged in</a>`,
          );
      else if (matchList.length > 0) {
        const title =
          1 === matchList.length
            ? 'Click to play directly'
            : `Click to view ${matchList.length} matching results`;
        $box2
          .find('.video-title')
          .prepend(
            `<a class='jhs-match-btn a-success' \n                       data-keyword="${carNum2}"\n                       data-match='${JSON.stringify(
              matchList,
            )}'\n                       title="${title}">Matched ${
              matchList.length
            }</a>`,
          );
      } else
        $box2
          .find('.video-title')
          .prepend(
            `<a class='jhs-match-error-btn a-info' \n                   data-keyword="${carNum2}" \n                   title="Not matched, click to retry">Not matched</a>`,
          );
  }
  formatSize(bytes) {
    if (!bytes) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = parseFloat(bytes),
      unit = 0;
    for (; size >= 1024 && unit < units.length - 1; ) {
      size /= 1024;
      unit++;
    }
    return `${size.toFixed(2)} ${units[unit]}`;
  }
};

__publicField(_WangPan115MatchPlugin, 'LoginStatus', {
  UNCHECKED: -1,
  LOGGED_OUT: 0,
  LOGGED_IN: 1,
});

let WangPan115MatchPlugin = _WangPan115MatchPlugin;

class FavoriteActressesPlugin extends BasePlugin {
  getName() {
    return 'FavoriteActressesPlugin';
  }
  async handle() {
    this.bindEvent();
    await this.highlightActress();
    this.replaceActressAvatar();
  }
  async highlightActress() {
    if (!isDetailPage) return;
    if (
      (await storageManager.getSetting('enableFavoriteActresses', YES)) !== YES
    )
      return;
    const favoriteActressesInfoList =
      await storageManager.getFavoriteActressList();
    if (!favoriteActressesInfoList || 0 === favoriteActressesInfoList.length)
      return;
    const favoriteStarIdSet = new Set();
    favoriteActressesInfoList.forEach((actress) => {
      actress.starId && favoriteStarIdSet.add(String(actress.starId).trim());
    });
    0 !== favoriteStarIdSet.size &&
      $('.female')
        .prev()
        .each((index, element) => {
          const $element = $(element),
            href = $element.attr('href');
          let elementStarId = null;
          if (href) {
            const parts = (href.endsWith('/') ? href.slice(0, -1) : href).split(
                '/',
              ),
              lastPart = parts[parts.length - 1];
            lastPart && (elementStarId = lastPart.trim());
          }
          let isFavorite = !1;
          elementStarId && (isFavorite = favoriteStarIdSet.has(elementStarId));
          if (isFavorite) {
            $element.addClass('highlighted');
            $element.attr(
              'title',
              'Highlighted favorited actress, can be disabled in Settings-Basic Config',
            );
          }
        });
  }
  async removeActorFromStorage(actorId) {
    (await storageManager.removeFavoriteActress(actorId)) &&
      clog.log('Actor removed successfully');
  }
  bindEvent() {
    const listIdRegex = /\/actors\/(\w+)\/(collect|uncollect)/;
    $(document).on(
      'confirm:complete',
      'a[href*="/actors/"][href*="/uncollect"]',
      async (event) => {
        const [userConfirmed] = event.detail;
        if (!userConfirmed) return;
        const match = $(event.currentTarget).attr('href').match(listIdRegex),
          actorId = match ? match[1] : null;
        actorId && (await this.removeActorFromStorage(actorId));
      },
    );
    $('#button-collect-actor').click(async (event) => {
      const match = $('#button-collect-actor').attr('href').match(listIdRegex),
        actorId = match ? match[1] : null;
      let nameList = [],
        $actor = $('.actor-section-name');
      $actor.length &&
        $actor
          .text()
          .trim()
          .split(',')
          .forEach((name2) => {
            nameList.push(name2.trim());
          });
      let $sectionMeta = $(".section-meta:not(:contains('Videos'))");
      $sectionMeta.length &&
        $sectionMeta
          .text()
          .trim()
          .split(',')
          .forEach((name2) => {
            nameList.push(name2.trim());
          });
      if (!nameList) {
        clog.error('Failed to get actor name');
        return;
      }
      const actorName = nameList[0];
      if (!actorId) {
        clog.error('Unable to get actor ID for favorite operation.');
        return;
      }
      const avatar = (
          $('.avatar').first().css('background-image') || ''
        ).replace(/^url\(["']?|["']?\)$/g, ''),
        actressInfo = {
          starId: actorId,
          name: actorName,
          allName: nameList,
          avatar: avatar,
        };
      1 === (await storageManager.addFavoriteActressList([actressInfo]))
        ? clog.log(
            `Favorited actress successfully: ${actorName} (ID: ${actorId})`,
          )
        : clog.log(`Failed to favorite actress: ${actorName} (ID: ${actorId})`);
    });
    $('#button-uncollect-actor').click(async (event) => {
      const match = $('#button-uncollect-actor')
          .attr('href')
          .match(listIdRegex),
        actorId = match ? match[1] : null;
      actorId
        ? await this.removeActorFromStorage(actorId)
        : clog.error('Unable to get actor ID for unfavorite operation.');
    });
  }
  async replaceActressAvatar() {
    const actressId = this.getActressId();
    if (!actressId) return;
    const actress = (await storageManager.getFavoriteActressList()).find(
      (item) => item.starId === actressId,
    );
    if (actress && actress.avatar) {
      const newAvatarUrl = `url('${actress.avatar}')`;
      let $avatarElement = $('.avatar').first();
      if (0 === $avatarElement.length) {
        const newAvatarHtml =
          '<div class="column actor-avatar"> <div class="image"> <span class="avatar"></span> </div> </div>';
        $('.section-columns').prepend(newAvatarHtml);
        $avatarElement = $('.avatar').first();
      }
      if (0 === $avatarElement.length) return;
      if (
        $avatarElement.css('background-image').trim().toLowerCase() !==
        newAvatarUrl.trim().toLowerCase()
      ) {
        $avatarElement.css('background-image', newAvatarUrl);
        $avatarElement.css('background-size', 'cover');
        $avatarElement.css('background-position', 'top center');
        $avatarElement.css('background-repeat', 'no-repeat');
      }
    }
  }
}

class BusImgPlugin extends BasePlugin {
  getName() {
    return 'BusImgPlugin';
  }
  handle() {}
  async getVisibleImageItems(itemSelector, imgSelector) {
    let itemList = [];
    const allItems = document.querySelectorAll(itemSelector);
    for (const item of allItems) {
      if (!utils.isHidden(item)) {
        const imgElement = item.querySelector(imgSelector);
        if (!(imgElement instanceof HTMLImageElement)) continue;
        imgElement.style.removeProperty('height');
        let imageHeight = imgElement.offsetHeight;
        imageHeight > 0 &&
          itemList.push({
            element: item,
            imgElement: imgElement,
            height: imageHeight,
          });
      }
    }
    return itemList;
  }
  async logImageHeightsByRow() {
    if ((await storageManager.getSetting('enableVerticalModel', NO)) === YES)
      return;
    const itemSelector = this.getSelector().itemSelector,
      containerColumns = await storageManager.getSetting('containerColumns', 5),
      itemList = await this.getVisibleImageItems(itemSelector, 'img');
    if (0 === itemList.length) return;
    const groupedItems = [];
    for (let i = 0; i < itemList.length; i++) {
      const rowIndex = Math.floor(i / containerColumns);
      groupedItems[rowIndex] || (groupedItems[rowIndex] = []);
      groupedItems[rowIndex].push(itemList[i]);
    }
    groupedItems.forEach((row, rowIndex) => {
      const originalHeights = row.map((item) => item.height);
      if (originalHeights.length < 2) return;
      const minHeight = Math.min(...originalHeights),
        maxHeight = Math.max(...originalHeights);
      let targetHeight = 0;
      if (maxHeight - minHeight > 50) {
        targetHeight = minHeight;
        row.forEach((item) => {
          if (item.height !== targetHeight) {
            const heightValue = `${targetHeight}px`;
            item.imgElement.style.setProperty(
              'height',
              heightValue,
              'important',
            );
          }
        });
      }
    });
  }
}
class TranslatePlugin extends BasePlugin {
  getName() {
    return 'TranslatePlugin';
  }
  async initCss() {
    return '\n            <style> \n                .translated-title {\n                    margin-top: 8px; \n                    padding: 12px; \n                    border-radius: 5px; \n                    border-left: 4px solid rgb(76, 175, 80);\n                    background: linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%); \n                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);\n                    font-size: 20px;\n                }\n            </style>\n        ';
  }
  handle() {
    isDetailPage && this.translate();
  }
  async translate(carNum2, showCarNum = !0) {
    if ((await storageManager.getSetting('translateTitle', YES)) !== YES)
      return;
    isJavBus && (showCarNum = !1);
    let $titleElement = $('.origin-title');
    $titleElement.length || ($titleElement = $('.current-title'));
    $titleElement.length || ($titleElement = $('h3'));
    if (!$titleElement.length) return;
    const originalText = $titleElement.text().trim();
    if (!originalText) {
      show.error('Failed to get title, cannot translate');
      return;
    }
    $titleElement.after('<div class="translated-title">Translating...</div>');
    const $loadingElement = $titleElement.next('.translated-title');
    carNum2 || (carNum2 = this.getPageInfo().carNum);
    const cache = localStorage.getItem('jhs_translate')
      ? JSON.parse(localStorage.getItem('jhs_translate'))
      : {};
    cache[carNum2]
      ? $loadingElement.html(
          showCarNum
            ? carNum2 + '&nbsp;&nbsp;&nbsp;' + cache[carNum2]
            : cache[carNum2],
        )
      : translateText(originalText, 'ja', 'zh-CN')
          .then((translatedText) => {
            $loadingElement.html(
              showCarNum
                ? carNum2 + '&nbsp;&nbsp;&nbsp;' + translatedText
                : translatedText,
            );
          })
          .catch((error) => {
            console.error('Translation failed:', error);
            $loadingElement.replaceWith(
              `<div class="translated-title" style="color: red;">Translation failed: ${error.message}</div>`,
            );
          });
  }
}

class TaskPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'singleTaskKey', 'checkNewActressActorFilterCar');
    __publicField(this, 'taskConfig', null);
    __publicField(this, 'storageQueue', new AsyncQueue());
    __publicField(
      this,
      'lastCheckFavoriteActressTimeKey',
      'jhs_time_checkFavoriteActress',
    );
    __publicField(this, 'lastCheckBlacklistTimeKey', 'jhs_time_checkBlacklist');
    __publicField(this, 'lastCheckNewVideoTimeKey', 'jhs_time_checkNewVideo');
  }
  getName() {
    return 'TaskPlugin';
  }
  async limitConcurrency(
    taskParamList,
    checkConcurrencyCount,
    checkRequestSleep,
    taskFn,
  ) {
    this.showIsRun();
    const activePromises = [],
      totalItems = taskParamList.length;
    let processedCount = 0;
    for (const taskParam of taskParamList) {
      const p = taskFn(taskParam).finally(() => {
        activePromises.splice(activePromises.indexOf(p), 1);
      });
      activePromises.push(p);
      processedCount++;
      if (activePromises.length >= checkConcurrencyCount) {
        const remainingToStart = totalItems - processedCount;
        clog.debug(
          `Remaining tasks: <span style="color: #f40">${remainingToStart}</span>`,
        );
        await Promise.race(activePromises);
        await utils.sleep(checkRequestSleep);
      }
    }
    await Promise.all(activePromises);
  }
  isUnnecessaryCheck(lastCheckTimeStr, checkIntervalTime) {
    if (!checkIntervalTime) throw new Error('checkIntervalTime not provided');
    checkIntervalTime = parseInt(checkIntervalTime);
    return (
      utils.getHourDifference(new Date(lastCheckTimeStr), new Date()) <
      checkIntervalTime
    );
  }
  handle() {
    this.doTask().then();
  }
  showIsRun() {
    show.info(
      'Detection task is running, please do not close the current window',
      {
        duration: 3e3,
      },
    );
  }
  async doTask() {
    if (isListPage) {
      await this.loadConfig();
      this.javDbUrl = await this.getBean('OtherSitePlugin').getJavDbUrl();
      return navigator.locks
        .request(
          this.singleTaskKey,
          {
            ifAvailable: !0,
          },
          async (lock) => {
            if (lock) {
              if (isListPage) {
                this.taskConfig.enableCheckBlacklist === YES
                  ? await this.checkBlacklist()
                  : clog.warn('Automatic detection of blacklist - disabled');
                if (!isJavBus) {
                  if (this.taskConfig.enableCheckFavoriteActress === YES) {
                    const lastCheckFavoriteActressTimeStr =
                        localStorage.getItem(
                          this.lastCheckFavoriteActressTimeKey,
                        ),
                      checkFavoriteActress_IntervalTime =
                        this.taskConfig.checkFavoriteActress_IntervalTime,
                      isUnCheck =
                        lastCheckFavoriteActressTimeStr &&
                        this.isUnnecessaryCheck(
                          lastCheckFavoriteActressTimeStr,
                          checkFavoriteActress_IntervalTime,
                        ),
                      isLogin = $('a[href*="/users/profile"]').length > 0;
                    isUnCheck &&
                      clog.debug(
                        `Detecting and syncing actresses, last detection time: ${lastCheckFavoriteActressTimeStr} Detection interval: ${checkFavoriteActress_IntervalTime} hours, not yet time`,
                      );
                    !isUnCheck &&
                      isLogin &&
                      (await this.checkFavoriteActress());
                  } else
                    clog.warn(
                      'Automatic synchronization of favorited actresses - disabled',
                    );
                  this.taskConfig.enableCheckNewVideo === YES
                    ? await this.checkNewVideo()
                    : clog.warn(
                        'Automatic detection of new works by favorited actresses - disabled',
                      );
                }
              }
            } else
              clog.debug('Failed to acquire task lock, skipping execution');
          },
        )
        .catch((error) => {
          console.error('Error in lock task:', error);
          clog.error('Error in lock task:', error);
        })
        .finally(() => {
          setTimeout(() => {
            this.doTask();
          }, 3e5);
        });
    }
  }
  async loadConfig() {
    const settingObj = await storageManager.getSetting();
    this.taskConfig = {
      checkConcurrencyCount: settingObj.checkConcurrencyCount
        ? Number(settingObj.checkConcurrencyCount)
        : 2,
      checkRequestSleep: settingObj.checkRequestSleep
        ? Number(settingObj.checkRequestSleep)
        : 100,
      enableCheckBlacklist: settingObj.enableCheckBlacklist || YES,
      checkBlacklist_intervalTime: settingObj.checkBlacklist_intervalTime
        ? Number(settingObj.checkBlacklist_intervalTime)
        : 12,
      checkBlacklist_ruleTime: settingObj.checkBlacklist_ruleTime
        ? Number(settingObj.checkBlacklist_ruleTime)
        : 8760,
      enableCheckFavoriteActress: settingObj.enableCheckFavoriteActress || YES,
      checkFavoriteActress_IntervalTime:
        settingObj.checkFavoriteActress_IntervalTime
          ? Number(settingObj.checkFavoriteActress_IntervalTime)
          : 24,
      enableCheckNewVideo: settingObj.enableCheckNewVideo || YES,
      checkNewVideo_intervalTime: settingObj.checkNewVideo_intervalTime
        ? Number(settingObj.checkNewVideo_intervalTime)
        : 12,
      checkNewVideo_ruleTime: settingObj.checkNewVideo_ruleTime
        ? Number(settingObj.checkNewVideo_ruleTime)
        : 8760,
    };
  }
  async checkBlacklist(isManual) {
    let blacklist = await storageManager.getBlacklist();
    if (0 === blacklist.length) return;
    blacklist = blacklist.sort((a, b) =>
      a.createTime < b.createTime ? 1 : a.createTime > b.createTime ? -1 : 0,
    );
    const checkConcurrencyCount = this.taskConfig.checkConcurrencyCount,
      checkRequestSleep = this.taskConfig.checkRequestSleep,
      checkBlacklist_intervalTime = this.taskConfig.checkBlacklist_intervalTime,
      checkBlacklist_ruleTime = this.taskConfig.checkBlacklist_ruleTime,
      lastCheckBlacklistTimeStr = localStorage.getItem(
        this.lastCheckBlacklistTimeKey,
      );
    if (
      !isManual &&
      lastCheckBlacklistTimeStr &&
      this.isUnnecessaryCheck(
        lastCheckBlacklistTimeStr,
        checkBlacklist_intervalTime,
      )
    ) {
      clog.debug(
        `Detecting blacklist, last detection time: ${lastCheckBlacklistTimeStr} Detection interval: ${checkBlacklist_intervalTime} hours, not yet time`,
      );
      return;
    }
    const taskParamList = [],
      msgList = [];
    for (const blacklistItem of blacklist) {
      let name2 = blacklistItem.name,
        checkTime = blacklistItem.checkTime,
        lastPublishTime = blacklistItem.lastPublishTime,
        url = blacklistItem.url;
      if (new URL(window.location.href).hostname === new URL(url).hostname) {
        if (
          isManual ||
          !checkTime ||
          !this.isUnnecessaryCheck(checkTime, checkBlacklist_intervalTime)
        )
          if (
            !lastPublishTime ||
            0 === checkBlacklist_ruleTime ||
            this.isUnnecessaryCheck(lastPublishTime, checkBlacklist_ruleTime)
          )
            taskParamList.push(blacklistItem);
          else {
            let msg = `Detecting blacklist: ${name2} ${lastPublishTime} has been inactive for over ${
              checkBlacklist_ruleTime / 24 / 365
            } years, skipping detection`;
            msgList.push(msg);
            $('#checkBlacklistMsg').text(msg);
          }
      } else
        clog.log(
          'Blacklist address is not from the same domain, skipping',
          url,
        );
    }
    if (0 === taskParamList.length) return;
    msgList.forEach((msg) => {
      clog.log(msg);
    });
    clog.log(
      `<span style='color: #f40'>Detecting blacklist, total tasks: ${taskParamList.length}, concurrency limit:${checkConcurrencyCount}, request interval:${checkRequestSleep}ms</span>`,
    );
    const blacklistPlugin = this.getBean('BlacklistPlugin');
    await this.limitConcurrency(
      taskParamList,
      checkConcurrencyCount,
      checkRequestSleep,
      async (task) => {
        let { starId: starId, name: name2, url: url } = task;
        try {
          clog.log('Currently screening blacklisted actor:', name2, url);
          $('#checkBlacklistMsg').text(
            `Currently screening blacklisted actor: ${name2} ${url}`,
          );
          const html = await gmHttp.get(url),
            $dom = utils.htmlTo$dom(html);
          this.storageQueue.addTask(async () => {
            let { lastPublishTime: lastPublishTime } =
              await blacklistPlugin.parseAndSaveFilterInfo($dom, name2, starId);
            await storageManager.updateBlacklistItem({
              starId: starId,
              name: name2,
              checkTime: utils.getNowStr(),
              lastPublishTime: lastPublishTime,
            });
          });
        } catch (e) {
          $('#checkBlacklistMsg').text(
            `Error detecting blacklisted actor information: ${url}`,
          );
          clog.error('Error detecting blacklisted actor information:', url, e);
          show.error(
            'Error detecting blacklisted actor information:' + e,
            'bottom',
            'right',
          );
        }
      },
    );
    await this.storageQueue.waitAllFinished();
    const updateLastCheckBlacklistTimeStr = utils.getNowStr();
    localStorage.setItem(
      this.lastCheckBlacklistTimeKey,
      updateLastCheckBlacklistTimeStr,
    );
    clog.log(
      '<span style="color: #f40">-------- END Blacklist Detection END --------</span>',
    );
    $('#checkBlacklistMsg').text('Blacklist detection finished');
    this.getBean('BlacklistPlugin').resetBtnTip().then();
  }
  async checkFavoriteActress() {
    const checkUrl = `${this.javDbUrl}/users/collection_actors`,
      actorInfoList = [];
    await this.scrapeActorInfo(checkUrl, actorInfoList);
    clog.log(
      'All actress information collected, total count:',
      actorInfoList.length,
    );
    $('#checkNewVideoMsg').text('Synchronization complete');
    if (actorInfoList.length > 0) {
      await storageManager.addFavoriteActressList(actorInfoList);
      localStorage.setItem(
        this.lastCheckFavoriteActressTimeKey,
        utils.getNowStr(),
      );
      this.getBean('NewVideoPlugin').resetBtnTip().then();
    }
  }
  async scrapeActorInfo(currentUrl, actorInfoList) {
    clog.log(`Currently crawling page: ${currentUrl}`);
    $('#checkNewVideoMsg').text(
      `Currently parsing favorited actresses: ${currentUrl}`,
    );
    try {
      const html = await gmHttp.get(currentUrl),
        $dom = utils.htmlTo$dom(html);
      $dom.find('#actors .actor-box a').each((i, element) => {
        const $a = $(element),
          title = $a.attr('title'),
          href = $a.attr('href');
        if (title && href) {
          const allName = title
              .split(',')
              .map((name3) => name3.trim())
              .filter((name3) => name3.length > 0),
            name2 = allName[0] || '',
            segments = new URL(href, this.javDbUrl).pathname
              .split('/')
              .filter((s) => s.length > 0);
          let starId = '';
          segments.length > 0 && (starId = segments[segments.length - 1]);
          let actressType = 'censored';
          const avatar = $a.find('img').attr('src'),
            $infoSpan = $a.find('.info');
          $infoSpan.length &&
            $infoSpan.text().trim().includes('無碼') && // "uncensored"
            (actressType = 'uncensored');
          actorInfoList.push({
            starId: starId,
            name: name2,
            allName: allName,
            avatar: avatar,
            actressType: actressType,
            lastCheckTime: null,
            lastUpdateTime: null,
          });
        }
      });
      const nextRelativeUrl = $dom.find('.pagination-next').attr('href');
      if (nextRelativeUrl) {
        const nextAbsoluteUrl = new URL(nextRelativeUrl, this.javDbUrl).href;
        await this.scrapeActorInfo(nextAbsoluteUrl, actorInfoList);
      }
    } catch (error) {
      clog.error(`Error while crawling ${currentUrl}:`, error);
    }
  }
  async checkNewVideo(isManual) {
    const dataActressInfoList = await storageManager.getFavoriteActressList(),
      actressInfoList = utils.genericSort(dataActressInfoList, [
        {
          key: (item) => {
            var _a2;
            return (
              (null == (_a2 = item.newVideoList) ? void 0 : _a2.length) ?? 0
            );
          },
          order: 'desc',
        },
        {
          key: 'lastPublishTime',
          order: 'desc',
        },
      ]),
      checkConcurrencyCount = this.taskConfig.checkConcurrencyCount,
      checkRequestSleep = this.taskConfig.checkRequestSleep,
      checkNewVideo_intervalTime = this.taskConfig.checkNewVideo_intervalTime,
      checkNewVideo_ruleTime = this.taskConfig.checkNewVideo_ruleTime,
      lastCheckNewVideoTimeStr = localStorage.getItem(
        this.lastCheckNewVideoTimeKey,
      );
    if (
      !isManual &&
      lastCheckNewVideoTimeStr &&
      this.isUnnecessaryCheck(
        lastCheckNewVideoTimeStr,
        checkNewVideo_intervalTime,
      )
    ) {
      clog.debug(
        `Detecting new works, last detection time: ${lastCheckNewVideoTimeStr} Detection interval: ${checkNewVideo_intervalTime} hours, not yet time`,
      );
      return;
    }
    const taskParamList = [],
      msgList = [];
    for (const actress of actressInfoList) {
      const {
        lastCheckTime: lastCheckTime,
        lastPublishTime: lastPublishTime,
        name: name2,
      } = actress;
      (!isManual &&
        lastCheckTime &&
        this.isUnnecessaryCheck(lastCheckTime, checkNewVideo_intervalTime)) ||
        (!lastPublishTime ||
        0 === checkNewVideo_ruleTime ||
        this.isUnnecessaryCheck(lastPublishTime, checkNewVideo_ruleTime)
          ? taskParamList.push(actress)
          : msgList.push(
              `Detecting new works: ${name2} ${lastPublishTime} has been inactive for over ${
                checkNewVideo_ruleTime / 24 / 365
              } years, skipping detection`,
            ));
    }
    if (0 === taskParamList.length) return;
    msgList.forEach((msg) => {
      clog.log(msg);
    });
    clog.log(
      `<span style='color: #f40'>Detecting latest works, total tasks: ${taskParamList.length}, concurrency limit:${checkConcurrencyCount}, request interval:${checkRequestSleep}ms</span>`,
    );
    const filterKeywordList = await storageManager.getTitleFilterKeyword(),
      filterActorActressCarList = await storageManager.getBlacklistCarList(),
      filterActorActressCarNumList = new Set(
        filterActorActressCarList.map((car) => car.carNum),
      );
    await this.limitConcurrency(
      taskParamList,
      checkConcurrencyCount,
      checkRequestSleep,
      async (task) => {
        const {
          lastCheckTime: lastCheckTime,
          name: name2,
          starId: starId,
        } = task;
        let url = `${this.javDbUrl}/actors/${starId}?t=d`;
        try {
          clog.log('Currently detecting new works, actress:', name2, url);
          $('#checkNewVideoMsg').text(
            `Currently detecting new works, actress: ${name2}`,
          );
          const html = await gmHttp.get(url),
            $dom = utils.htmlTo$dom(html);
          this.storageQueue.addTask(async () => {
            await this.parsePage(
              $dom,
              starId,
              name2,
              filterKeywordList,
              filterActorActressCarNumList,
            );
          });
        } catch (e) {
          clog.error(
            'Error detecting blacklisted actress information:',
            url,
            e,
          );
          console.error(
            'Error detecting blacklisted actress information:',
            url,
            e,
          );
          show.error(
            'Error detecting blacklisted actress information:' + e,
            'bottom',
            'right',
          );
        }
      },
    );
    await this.storageQueue.waitAllFinished();
    localStorage.setItem(this.lastCheckNewVideoTimeKey, utils.getNowStr());
    clog.log('<span style="color: #f40">New works detection --- END</span>');
    $('#checkNewVideoMsg').text('Detection complete');
    const newVideoPlugin = this.getBean('NewVideoPlugin');
    newVideoPlugin.loadData();
    newVideoPlugin.resetBtnTip().then();
  }
  async parsePage(
    $dom,
    starId,
    name2,
    filterKeywordList,
    filterActorActressCarNumList,
  ) {
    let movieList,
      nextPageLink,
      tempIsJavBus = !1,
      selectorType = 'javdb';
    if ($dom.text().includes('javbus')) {
      tempIsJavBus = !0;
      selectorType = 'javbus';
    }
    tempIsJavBus &&
      $dom.find('.avatar-box').length > 0 &&
      $dom.find('.avatar-box').parent().remove();
    movieList = $dom.find(
      this.getSelector(selectorType).requestDomItemSelector,
    );
    nextPageLink = $dom
      .find(this.getSelector(selectorType).nextPageSelector)
      .attr('href');
    if (nextPageLink && 0 === movieList.length) {
      clog.error('New works detection - failed to parse list');
      show.error('New works detection - failed to parse list');
      throw new Error('New works detection - failed to parse list');
    }
    let carNumList = [],
      lastPublishTime = null;
    for (const element of movieList) {
      const $item = $(element),
        {
          carNum: carNum2,
          url: url,
          title: title,
          publishTime: publishTime,
        } = this.getBoxCarInfo($item);
      if (!carNum2) continue;
      if (
        !filterKeywordList.find(
          (kw) => title.includes(kw) || carNum2.startsWith(kw),
        ) &&
        !filterActorActressCarNumList.has(carNum2)
      ) {
        lastPublishTime || (lastPublishTime = publishTime);
        carNumList.push(carNum2);
      }
    }
    const carList = await storageManager.getCarList(),
      storageCarNumList = new Set(carList.map((car) => car.carNum)),
      nonExistingCarNumList = carNumList.filter(
        (carNum2) => !storageCarNumList.has(carNum2),
      );
    nonExistingCarNumList.length > 0 &&
      clog.log(
        `<span style='color: #f40'>New works detected, ${name2}, total ${nonExistingCarNumList.length} films</span>`,
      );
    await storageManager.updateFavoriteActress({
      starId: starId,
      lastCheckTime: utils.getNowStr(),
      newVideoList: nonExistingCarNumList,
      lastPublishTime: lastPublishTime,
    });
  }
  async checkOneNewVideo(actress) {
    const filterKeywordList = await storageManager.getTitleFilterKeyword(),
      filterActorActressCarList = await storageManager.getBlacklistCarList(),
      filterActorActressCarNumList = new Set(
        filterActorActressCarList.map((car) => car.carNum),
      ),
      { lastCheckTime: lastCheckTime, name: name2, starId: starId } = actress;
    let url = `${this.javDbUrl}/actors/${starId}?t=d`;
    const $checkNewVideoMsg = $('#checkNewVideoMsg');
    try {
      clog.log('Currently detecting new works, actress:', name2, url);
      $checkNewVideoMsg.text(
        `Currently detecting new works, actress: ${name2}`,
      );
      const html = await gmHttp.get(url),
        $dom = utils.htmlTo$dom(html);
      await this.parsePage(
        $dom,
        starId,
        name2,
        filterKeywordList,
        filterActorActressCarNumList,
      );
      clog.log('<span style="color: #f40">New works detection --- END</span>');
      $checkNewVideoMsg.text('Detection complete');
      this.getBean('NewVideoPlugin').loadData();
    } catch (e) {
      clog.error('Error detecting blacklisted actress information:', url, e);
      show.error(
        'Error detecting blacklisted actress information:' + e,
        'bottom',
        'right',
      );
      $checkNewVideoMsg.text(
        `Error detecting blacklisted actress information: ${url}`,
      );
    }
  }
}

const CDN_SOURCES = [
  {
    name: 'jsDelivr (Global CDN)',
    json: 'https://cdn.jsdelivr.net/gh/gfriends/gfriends/Filetree.json',
    base: 'https://cdn.jsdelivr.net/gh/gfriends/gfriends/Content/',
  },
  {
    name: 'GitHub Raw (Fallback)',
    json: 'https://raw.githubusercontent.com/gfriends/gfriends/master/Filetree.json',
    base: 'https://raw.githubusercontent.com/gfriends/gfriends/master/Content/',
  },
];

let currentCdnIndex = parseInt(
  localStorage.getItem('jhs_img_cdn_index') || '0',
  10,
);

(currentCdnIndex >= CDN_SOURCES.length || currentCdnIndex < 0) &&
  (currentCdnIndex = 0);

let G_FRIENDS_JSON_URL = CDN_SOURCES[currentCdnIndex].json,
  CDN_BASE_URL = CDN_SOURCES[currentCdnIndex].base;

const STORE_NAME = 'filetreeStore',
  dbHelper = {
    db: null,
    async open() {
      return this.db
        ? this.db
        : new Promise((resolve, reject) => {
            const request = indexedDB.open('GfriendsAvatarDB', 1);
            request.onupgradeneeded = (event) => {
              this.db = event.target.result;
              this.db.objectStoreNames.contains(STORE_NAME) ||
                this.db.createObjectStore(STORE_NAME);
            };
            request.onsuccess = (event) => {
              this.db = event.target.result;
              resolve(this.db);
            };
            request.onerror = (event) => {
              console.error('IndexedDB open error:', event.target.errorCode);
              reject(new Error('Failed to open IndexedDB'));
            };
          });
    },
    async get(key) {
      await this.open();
      return new Promise((resolve) => {
        const request = this.db
          .transaction([STORE_NAME], 'readonly')
          .objectStore(STORE_NAME)
          .get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      });
    },
    async set(key, value) {
      await this.open();
      return new Promise((resolve, reject) => {
        const request = this.db
          .transaction([STORE_NAME], 'readwrite')
          .objectStore(STORE_NAME)
          .put(value, key);
        request.onsuccess = () => resolve();
        request.onerror = (event) => {
          console.error('IndexedDB set error:', event.target.errorCode);
          reject(new Error('Failed to write to IndexedDB'));
        };
      });
    },
  };

let G_FRIENDS_DATA_CACHE = null,
  G_FRIENDS_AVATAR_MAP = null;

function buildAvatarMap(rawData) {
  if (!rawData || !rawData.Content) return null;
  const map = {},
    contentData = rawData.Content;
  for (const companyName in contentData) {
    const encodedCompany = encodeURIComponent(companyName);
    for (const fileName in contentData[companyName]) {
      let cleanNamePart = fileName.replace(/\.jpg$/i, '').split('-')[0];
      cleanNamePart.startsWith('AI-Fix-') &&
        (cleanNamePart = cleanNamePart.substring(7));
      const actorNameKey = cleanNamePart.toLowerCase().trim();
      if (actorNameKey.length > 0) {
        const actualResourcePath = contentData[companyName][fileName],
          queryIndex = actualResourcePath.indexOf('?');
        let encodedFileNamePart,
          queryString = '';
        if (queryIndex > -1) {
          encodedFileNamePart = encodeURIComponent(
            actualResourcePath.substring(0, queryIndex),
          );
          queryString = actualResourcePath.substring(queryIndex);
        } else encodedFileNamePart = encodeURIComponent(actualResourcePath);
        const fullUrl = `${CDN_BASE_URL}${encodedCompany}/${encodedFileNamePart}${queryString}`;
        map[actorNameKey] || (map[actorNameKey] = []);
        map[actorNameKey].includes(fullUrl) || map[actorNameKey].push(fullUrl);
      }
    }
  }
  return map;
}

async function searchActorAvatars(searchNames) {
  let loadObj = loading();
  try {
    await (async function () {
      if (G_FRIENDS_DATA_CACHE && G_FRIENDS_AVATAR_MAP)
        return G_FRIENDS_DATA_CACHE;
      let cachedData = null;
      try {
        cachedData = await dbHelper.get('filetree_data');
      } catch (e) {
        console.error('Failed to read IndexedDB:', e);
      }
      if (cachedData && cachedData.Content) {
        G_FRIENDS_DATA_CACHE = cachedData;
        G_FRIENDS_AVATAR_MAP = buildAvatarMap(cachedData);
        if (G_FRIENDS_AVATAR_MAP) return G_FRIENDS_DATA_CACHE;
      }
      show.info('Loading avatar data source...');
      const response = await fetch(G_FRIENDS_JSON_URL);
      if (!response.ok)
        throw new Error(`Failed to request avatar source: ${response.status}`);
      const data = await response.json();
      if (data && data.Content) {
        G_FRIENDS_DATA_CACHE = data;
        G_FRIENDS_AVATAR_MAP = buildAvatarMap(data);
        try {
          await dbHelper.set('filetree_data', data);
          clog.debug('Avatar data source loaded and cached successfully!');
        } catch (e) {
          clog.error(e);
          show.error(
            'Failed to write avatar data source to cache, disk may be full or other permission issues.',
          );
        }
        return G_FRIENDS_DATA_CACHE;
      }
      console.log(data);
      throw new Error('Failed to parse avatar data source');
    })();
  } catch (e) {
    show.error(e);
    return [];
  } finally {
    loadObj.close();
  }
  if (!G_FRIENDS_AVATAR_MAP) return [];
  const foundLinks = new Set(),
    searchKeys = searchNames
      .map((name2) => name2.toLowerCase().trim())
      .filter((n) => n.length > 0);
  if (0 === searchKeys.length) return [];
  for (const searchKey of searchKeys) {
    const links = G_FRIENDS_AVATAR_MAP[searchKey];
    links && links.forEach((link) => foundLinks.add(link));
  }
  return Array.from(foundLinks);
}

class NewVideoPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    __publicField(this, 'currentPage', 1);
    __publicField(this, 'pageSize', 30);
  }
  getName() {
    return 'NewVideoPlugin';
  }
  async initCss() {
    return '\n            <style>\n                #actress-card-container {\n                    display: grid;\n                    grid-template-columns: repeat(auto-fill, minmax(243px, 1fr)); /* Responsive 3-5 columns */\n                    gap: 20px;\n                    padding-bottom: 20px;\n                    padding-right: 10px;\n                    background: #f9f9f9;\n                    border-radius: 5px;\n                    overflow-y: auto;\n                }\n                .actress-card {\n                    background: #fff;\n                    border: 1px solid #e0e0e0;\n                    border-radius: 8px;\n                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);\n                    padding: 15px;\n                    text-align: center;\n                    display: flex;\n                    flex-direction: column;\n                    justify-content: space-between;\n                    position: relative;\n                    overflow: hidden;\n                }\n                .actress-card:hover {\n                    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);\n                }\n                .actress-card-name {\n                    font-size: 1.2em;\n                    font-weight: bold;\n                    color: #007bff;\n                    margin-top: 10px;\n                }\n                .actress-card-allname {\n                    font-size: 0.9em;\n                    color: #999;\n                    margin-top: 5px;\n                    height: 30px; /* Ensure consistent height */\n                    overflow: hidden;\n                    white-space: nowrap;      /* Prevent text wrapping */\n                    text-overflow: ellipsis;  /* Display ellipsis when text overflows */\n                }\n                .actress-card-avatar {\n                    width: 100px;\n                    height: 100px;\n                    border-radius: 50%;\n                    object-fit: contain;\n                    margin: 0 auto;\n                    border: 4px solid #f0f0f0;\n                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n                }\n                \n                .card-tag {\n                    position: absolute;\n                    top: 15px; /* Adjust tag distance from top */\n                    right: -50px; /* Adjust tag distance from right, negative value moves it slightly outside */\n                    \n                    width: 150px; /* Tag width, affects diagonal length */\n                    padding: 5px 0; /* Vertical padding */\n                    text-align: center;\n                    \n                    background-color: #ff4757; /* Tag color */\n                    color: white; /* Text color */\n                    font-size: 14px;\n                    font-weight: bold;\n                    z-index: 10; /* Ensure tag is above other content */\n                \n                    /* 3. Core: Rotate tag to make it slanted */\n                    transform: rotate(45deg); /* 45 degree diagonal */\n                    \n                    /* Optional: Add some shadow or border effects */\n                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);\n                }\n                \n                .card-new-count-tag {\n                    position: absolute;\n                    top: 5px;\n                    text-align: center;\n                    font-size: 14px;\n                    font-weight: bold;\n                    z-index: 10;\n                }\n                \n                #actress-pagination {\n                    padding-top: 10px;\n                    text-align: center;\n                    border-top: 1px solid #ddd;\n                }\n                @media (max-width: 600px) {\n                    .page-number-btn {\n                        display: none !important;\n                    }\n                }\n                \n                \n                .card-btn {\n                    width: 44px;\n                    height: 44px;\n                    border-radius: 50%;\n                    display: flex;\n                    justify-content: center;\n                    align-items: center;\n                    text-decoration: none;\n                    border: none;\n                    cursor: pointer;\n                    background: linear-gradient(145deg, #e0e0e0 0%, #f7f7f7 100%);\n                    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08),\n                                -8px -8px 16px rgba(255, 255, 255, 1.0);\n                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\n                }\n                \n                .card-btn svg,\n                .card-btn svg path {\n                    transition: fill 0.3s ease;\n                }\n                \n                .card-btn:hover {\n                    box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.1),\n                                inset -5px -5px 10px rgba(255, 255, 255, 0.9);\n                    transform: scale(0.97);\n                    background: #e0e0e0;\n                }\n                \n                .btn-check-actress svg path {\n                    fill: #4CAF50;\n                }\n                .btn-check-actress:hover svg path {\n                    fill: #388E3C;\n                }\n                \n                .btn-edit-actress svg path {\n                    fill: #FFC107;\n                }\n                .btn-edit-actress:hover svg path {\n                    fill: #FFB300;\n                }\n                \n                .btn-delete-actress svg path {\n                    fill: #F44336;\n                }\n                .btn-delete-actress:hover svg path {\n                    fill: #D32F2F;\n                }\n            </style>\n        ';
  }
  async showNewVideoCount() {
    const totalNewVideoCount = (
      await storageManager.getFavoriteActressList()
    ).reduce((accumulator, actress) => {
      var _a2;
      return (
        accumulator +
        ((null == (_a2 = actress.newVideoList) ? void 0 : _a2.length) ?? 0)
      );
    }, 0);
    $('#newVideoCount').text(`${totalNewVideoCount}`);
  }
  async resetBtnTip() {
    const taskPlugin = this.getBean('TaskPlugin'),
      settingObj = await storageManager.getSetting(),
      lastCheckTimeStr =
        localStorage.getItem(taskPlugin.lastCheckFavoriteActressTimeKey) ||
        'None',
      checkFavoriteActress_IntervalTime =
        settingObj.checkFavoriteActress_IntervalTime,
      lastCheckNewVideoTimeStr =
        localStorage.getItem(taskPlugin.lastCheckNewVideoTimeKey) || 'None',
      checkNewVideo_intervalTime = settingObj.checkNewVideo_intervalTime;
    $('#checkFavoriteActress').attr(
      'data-tip',
      `Last automatic sync time: ${lastCheckTimeStr}; Detection interval: ${checkFavoriteActress_IntervalTime} hours`,
    );
    $('#checkNewVideo').attr(
      'data-tip',
      `Last detection time: ${lastCheckNewVideoTimeStr}; Detection interval: ${checkNewVideo_intervalTime} hours`,
    );
  }
  async openDialog() {
    const taskPlugin = this.getBean('TaskPlugin'),
      settingObj = await storageManager.getSetting(),
      lastCheckTimeStr =
        localStorage.getItem(taskPlugin.lastCheckFavoriteActressTimeKey) ||
        'None',
      checkFavoriteActress_IntervalTime =
        settingObj.checkFavoriteActress_IntervalTime,
      lastCheckNewVideoTimeStr =
        localStorage.getItem(taskPlugin.lastCheckNewVideoTimeKey) || 'None',
      checkNewVideo_intervalTime = settingObj.checkNewVideo_intervalTime;
    let html = `\n            <div class="newVideoToolBox" style="display: flex; flex-direction: column; height: 100%; overflow: hidden; padding:10px">\n                <div style="margin-bottom: 15px;display: flex; justify-content: space-between;">\n                    <div>\n                        <a class="a-danger" id="checkFavoriteActress" data-tip="Last automatic sync time: ${lastCheckTimeStr}; Detection interval: ${checkFavoriteActress_IntervalTime} hours">${this.actressSvg} &nbsp;&nbsp; Manual Sync Actresses</a>\n                        <a class="a-warning" id="checkNewVideo" data-tip="Last detection time: ${lastCheckNewVideoTimeStr}; Detection interval: ${checkNewVideo_intervalTime} hours">${this.newSvg} &nbsp;&nbsp; Manually Detect Latest Works</a>\n                        <a class="a-info" id="toSetting">${this.settingSvg} &nbsp;&nbsp; Configure</a>\n                        <span id="checkNewVideoMsg"></span>\n                    </div>\n                    <div style="display: flex; align-items: flex-start;">\n                        <select id="paramActressType" style="text-align: center; height: 100%; min-width: 150px; border: 1px solid #ddd; margin-right: 10px">\n                            <option value="all" selected>All</option>\n                            <option value="uncensored">Uncensored</option>\n                            <option value="censored">Censored</option>\n                            <option value="">Unknown</option>\n                        </select>\n                        \n                        <a class="a-normal" id="reLoad">${this.refreshSvg} &nbsp;&nbsp; Refresh</a>\n                    </div>\n\n                </div>\n                <div id="actress-card-container" class="jhs-scrollbar"></div>\n                <div id="actress-pagination"></div>\n            </div>\n        `;
    layer.open({
      type: 1,
      title:
        '<span style="padding: 0 10px;" data-tip="Data source: Actress homepage, includes magnet link categories">New Works Detection ❓</span>',
      content: html,
      scrollbar: !1,
      area: utils.getResponsiveArea(['80%', '90%']),
      anim: -1,
      success: async (layero, index) => {
        this.loadData();
        this.bindClick();
        utils.setupEscClose(index);
      },
    });
  }
  bindClick() {
    const taskPlugin = this.getBean('TaskPlugin');
    $('#reLoad').on('click', (event) => {
      this.loadData();
      $('#checkNewVideoMsg').text('');
    });
    $('#toSetting').on('click', (event) => {
      this.getBean('SettingPlugin').openSettingDialog('task-panel', () => {
        $('#setting-checkFavoriteActress').css({
          border: '1px solid #f40',
        });
        $('#setting-checkNewVideo').css({
          border: '1px solid #f40',
        });
      });
    });
    $('#checkFavoriteActress').on('click', (event) => {
      utils.q(
        {
          clientX: event.clientX,
          clientY: event.clientY + 20,
        },
        'Manually sync actresses?',
        () => {
          navigator.locks
            .request(
              taskPlugin.singleTaskKey,
              {
                ifAvailable: !0,
              },
              async (lock) => {
                if (!lock) {
                  show.error(
                    'A scheduled task is currently running in the background, cannot initiate manual task',
                  );
                  return;
                }
                if ($('a[href*="/users/profile"]').length > 0) {
                  await taskPlugin.checkFavoriteActress();
                  this.loadData();
                } else show.error('Not logged in to JavDb, sync failed');
              },
            )
            .catch((error) => {
              console.error('Error in lock task:', error);
              clog.error('Error in lock task:', error);
            });
        },
      );
    });
    $('#checkNewVideo').on('click', (event) => {
      utils.q(
        {
          clientX: event.clientX,
          clientY: event.clientY + 20,
        },
        'Manually detect latest works?',
        () => {
          navigator.locks
            .request(
              taskPlugin.singleTaskKey,
              {
                ifAvailable: !0,
              },
              async (lock) => {
                lock
                  ? await taskPlugin.checkNewVideo(!0)
                  : show.error(
                      'A scheduled task is currently running in the background, cannot initiate manual task',
                    );
              },
            )
            .catch((error) => {
              console.error('Error in lock task:', error);
              clog.error('Error in lock task:', error);
            });
        },
      );
    });
    $('#paramActressType').on('change', (event) => {
      this.loadData();
    });
  }
  loadData() {
    this.currentPage = 1;
    this.renderActressCards().then();
  }
  async renderActressCards() {
    const $actressCardContainer = $('#actress-card-container');
    if (!$actressCardContainer.length) return;
    let favoriteActressesList = await storageManager.getFavoriteActressList();
    const paramActressType = $('#paramActressType').val();
    'all' !== paramActressType &&
      (favoriteActressesList = favoriteActressesList.filter(
        (actress) => actress.actressType === paramActressType,
      ));
    const fullActressList = utils.genericSort(favoriteActressesList, [
        {
          key: (item) => {
            var _a2;
            return (
              (null == (_a2 = item.newVideoList) ? void 0 : _a2.length) ?? 0
            );
          },
          order: 'desc',
        },
        {
          key: 'lastPublishTime',
          order: 'desc',
        },
      ]),
      totalCount = fullActressList.length,
      totalPages = Math.ceil(totalCount / this.pageSize),
      startIndex = (this.currentPage - 1) * this.pageSize,
      endIndex = startIndex + this.pageSize,
      pagedData = fullActressList.slice(startIndex, endIndex),
      javDbUrl = await this.getBean('OtherSitePlugin').getJavDbUrl(),
      taskPlugin = this.getBean('TaskPlugin'),
      checkNewVideo_ruleTime =
        (await storageManager.getSetting('checkNewVideo_ruleTime')) || 8760,
      cardsHtml = pagedData
        .map((data) => {
          var _a2, _b, _c;
          const allNamesStr = Array.isArray(data.allName)
            ? data.allName.join('，')
            : '';
          Array.isArray(data.newVideoList) && data.newVideoList.join('，');
          const detailLink = `${javDbUrl}/actors/${data.starId}?t=d`;
          let isUnCheck = !1;
          data.lastPublishTime &&
            (isUnCheck = !taskPlugin.isUnnecessaryCheck(
              data.lastPublishTime,
              checkNewVideo_ruleTime,
            ));
          let actressTypeText = 'Unknown',
            actressTypeBgc = '#9E9E9E';
          if ('uncensored' === data.actressType) {
            actressTypeText = 'Uncensored';
            actressTypeBgc = '#4CAF50';
          } else if ('censored' === data.actressType) {
            actressTypeText = 'Censored';
            actressTypeBgc = '#FF9800';
          }
          let cardUnnecessaryBtnCss = '';
          isUnCheck &&
            (cardUnnecessaryBtnCss =
              'background: linear-gradient(145deg, #e0e0e0 0%, #cabdbd 100%);box-shadow: none');
          return `\n                <div class="actress-card" data-starId="${
            data.starId
          }" style="${
            isUnCheck ? 'background: #d4cece;' : ''
          } min-height: 370px;">\n                    <a href="${detailLink}" target="_blank" style="text-decoration: none; color: inherit; display: block; flex-grow: 1;">\n                        <img src="${
            data.avatar || 'https://c0.jdbstatic.com/images/actor_unknow.jpg'
          }" alt="${allNamesStr}" class="actress-card-avatar">\n                    </a>\n\n                    <div>\n                        <a href="${detailLink}" target="_blank" style="text-decoration: none; color: inherit; display: block; flex-grow: 1;">\n                            <div class="actress-card-name">${
            data.name
          }</div>\n                        </a>\n                        <div class="actress-card-allname" title="${allNamesStr}">${allNamesStr}</div>\n                    </div>\n                    \n                    <div style="font-size: 0.8em; margin-top: 5px;">\n                         <span>Last checked: ${
            data.lastCheckTime || ''
          }</span>\n                    </div>\n                    <div style="font-size: 0.8em; margin-top: 5px;">\n                         <span>Last released work: ${
            data.lastPublishTime || ''
          }</span>\n                    </div>\n\n                    <div style="font-size: 0.7em; color: #cc4444; margin-top: 5px; min-height: 18px">\n                         <span>${
            isUnCheck
              ? 'Inactive for over ' +
                checkNewVideo_ruleTime / 24 / 365 +
                ' years, will not be checked in next task'
              : ''
          }</span>\n                    </div>\n                    \n                    <div style="font-size: 0.8em; margin-top: 5px; color: #3765c5; min-height: 10px">\n                         <span>${
            data.remark || ''
          }</span>\n                    </div>\n                    \n                    <div style="margin-top: 10px;display: flex; justify-content:center; gap: 10px;">\n                        <a title="Edit" class="card-btn btn-edit-actress" style="${cardUnnecessaryBtnCss}" data-starId="${
            data.starId
          }">${
            this.editSvg
          }</a>\n                        <a title="Unfavorite" class="card-btn btn-delete-actress" style="${cardUnnecessaryBtnCss}" data-starId="${
            data.starId
          }">${
            this.deleteSvg
          }</a>\n                        <a title="Re-check this actress" class="card-btn btn-check-actress" style="${cardUnnecessaryBtnCss}" data-starId="${
            data.starId
          }">${
            this.checkSvg
          }</a>\n                    </div>\n                    \n                    <div class="card-tag" style="background-color:${actressTypeBgc}">${actressTypeText}</div>\n                    <div class="card-new-count-tag" data-tip="Number of latest works: ${
            (null == (_a2 = data.newVideoList) ? void 0 : _a2.length) || 0
          }"\n                        style="${
            (null == (_b = data.newVideoList) ? void 0 : _b.length) > 0
              ? 'color: #4CAF50;'
              : ''
          }"> \n                        🔔 ${
            (null == (_c = data.newVideoList) ? void 0 : _c.length) || 0
          } \n                    </div>\n                </div>\n            `;
        })
        .join('');
    $actressCardContainer.html(cardsHtml);
    $('.btn-delete-actress')
      .off('click')
      .on('click', (e) => {
        e.preventDefault();
        const starId = $(e.currentTarget).attr('data-starId'),
          actress = fullActressList.find((item) => item.starId === starId);
        utils.q(e, `Unfavorite ${actress.name}?`, async () => {
          let deleteActressUrl = `${await this.getBean(
            'OtherSitePlugin',
          ).getJavDbUrl()}/actors/${starId}/uncollect`;
          const csrfToken = document.querySelector(
              'meta[name=csrf-token]',
            ).content,
            res = await gmHttp.post(deleteActressUrl, null, {
              'x-csrf-token': csrfToken,
            });
          if (res.includes('removeClass')) {
            await storageManager.removeFavoriteActress(starId);
            this.loadData();
          } else {
            show.error('Removal failed');
            clog.error('Removal failed, return value:', res);
          }
        });
      });
    $('.btn-edit-actress')
      .off('click')
      .on('click', (e) => {
        e.preventDefault();
        const starId = $(e.currentTarget).attr('data-starId'),
          actress = fullActressList.find((item) => item.starId === starId);
        actress
          ? this.editActress(actress)
          : show.error(`Actress record with starId ${starId} not found.`);
      });
    $('.btn-check-actress')
      .off('click')
      .on('click', (e) => {
        e.preventDefault();
        navigator.locks
          .request(
            taskPlugin.singleTaskKey,
            {
              ifAvailable: !0,
            },
            async (lock) => {
              if (!lock) {
                show.error(
                  'A scheduled task is currently running in the background, cannot initiate manual task',
                );
                return;
              }
              const starId = $(e.currentTarget).attr('data-starId'),
                actress = fullActressList.find(
                  (item) => item.starId === starId,
                );
              await taskPlugin.checkOneNewVideo(actress);
            },
          )
          .catch((error) => {
            console.error('Error in lock task:', error);
            clog.error('Error in lock task:', error);
          });
      });
    this.renderPagination(totalCount, totalPages);
    show.ok('Loading complete');
  }
  async editActress(actress) {
    const initialName = actress.name,
      initialAvatar = actress.avatar,
      initialRemark = actress.remark || '',
      initialAllName = Array.isArray(actress.allName)
        ? actress.allName.join('，')
        : '',
      initialNewVideoList = Array.isArray(actress.newVideoList)
        ? actress.newVideoList.join('，')
        : '',
      starId = actress.starId,
      textareaStyle =
        'width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; min-height: 60px; overflow-y: hidden;',
      initActressType = actress.actressType || '',
      editFormHtml = `\n            <div style="padding: 20px;">\n                <div style="margin-bottom: 15px; text-align: center;">\n                    <img id="edit-avatar-preview" src="${initialAvatar}" alt="Avatar Preview" \n                         style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; border: 2px solid #ddd;">\n                    <div style="text-align: left">\n                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Avatar Link:</label>\n                        <input type="text" id="edit-actress-avatar" value="${initialAvatar}" \n                               style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">\n                       <div style="display: flex; gap: 5px; margin-top: 5px;">\n                            <button type="button" id="search-avatar-btn" \n                                style="flex-grow: 1; padding: 8px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">\n                                Search Avatar\n                            </button>\n                            <button type="button" id="select-cdn-btn" \n                                style="width: 100px; padding: 8px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">\n                                Select CDN Source\n                            </button>\n                        </div>\n                    </div>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Main Name:</label>\n                    <input type="text" id="edit-actress-name" value="${initialName}" \n                           style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">All Aliases (comma separated):</label>\n                    <textarea id="edit-actress-allname" style="${textareaStyle}">${initialAllName}</textarea>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Actress Category:</label>\n                    <select id="actressType" style="width: 100%; padding: 10px; border: 1px solid #ddd;">\n                        <option value="" ${
        '' === initActressType ? 'selected' : ''
      }>Unknown</option>\n                        <option value="censored" ${
        'censored' === initActressType ? 'selected' : ''
      }>Censored</option>\n                        <option value="uncensored" ${
        'uncensored' === initActressType ? 'selected' : ''
      }>Uncensored</option>\n                    </select>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Latest Works (comma separated):</label>\n                    <textarea id="edit-actress-newvideolist" style="${textareaStyle}">${initialNewVideoList}</textarea>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Remarks:</label>\n                   <textarea id="edit-remark" style="${textareaStyle}">${initialRemark}</textarea>\n                </div>\n            </div>\n        `;
    layer.open({
      type: 1,
      title: `Edit Actress: ${initialName} (${starId})`,
      area: ['500px', '750px'],
      content: editFormHtml,
      btn: ['Save', 'Cancel'],
      success: (layero, index) => {
        const autoResizeTextarea = ($textarea) => {
          $textarea.css('height', 'auto');
          $textarea.css('height', $textarea[0].scrollHeight + 15 + 'px');
        };
        $('#edit-actress-avatar').on('input', function () {
          const newUrl = $(this).val();
          $('#edit-avatar-preview').attr('src', newUrl);
        });
        const $allNameTextarea = $('#edit-actress-allname');
        $allNameTextarea.on('input', function () {
          autoResizeTextarea($(this));
        });
        autoResizeTextarea($allNameTextarea);
        const $videoListTextarea = $('#edit-actress-newvideolist');
        $videoListTextarea.on('input', function () {
          autoResizeTextarea($(this));
        });
        autoResizeTextarea($videoListTextarea);
        $('#search-avatar-btn').on('click', async () => {
          await this.searchAvatar();
        });
        $('#select-cdn-btn').on('click', async () => {
          await (async function () {
            const initialIndex = currentCdnIndex,
              radioOptions = CDN_SOURCES.map(
                (source, index) =>
                  `\n        <div style="margin-bottom: 10px;">\n            <input type="radio" id="cdn-${index}" name="cdn-source" value="${index}" ${
                    index === initialIndex ? 'checked' : ''
                  } style="margin-right: 10px;">\n            <label for="cdn-${index}">${
                    source.name
                  } ${
                    source.json.includes('jsdelivr') ? '(Recommended)' : ''
                  }</label>\n        </div>\n    `,
              ).join(''),
              cdnSelectHtml = `\n        <div style="padding: 20px;">\n            <p style="margin-bottom: 15px; font-weight: bold; color: #333;">Please select avatar data source (current: ${CDN_SOURCES[initialIndex].name}):</p>\n            ${radioOptions}\n            <p style="margin-top: 20px; color: #555; font-size: 12px;">Switching sources will clear locally cached data and reload it on next search.</p>\n        </div>\n    `;
            layer.open({
              type: 1,
              title: 'Select CDN Source',
              area: ['400px', 'auto'],
              content: cdnSelectHtml,
              btn: ['Confirm', 'Cancel'],
              success: (layero, index) => {
                utils.setupEscClose(index);
              },
              yes: async (index) => {
                const newIndexStr = $('input[name="cdn-source"]:checked').val(),
                  newIndex = parseInt(newIndexStr, 10);
                if (newIndex !== currentCdnIndex) {
                  currentCdnIndex = newIndex;
                  localStorage.setItem(
                    'jhs_img_cdn_index',
                    newIndex.toString(),
                  );
                  G_FRIENDS_JSON_URL = CDN_SOURCES[newIndex].json;
                  CDN_BASE_URL = CDN_SOURCES[newIndex].base;
                  G_FRIENDS_DATA_CACHE = null;
                  G_FRIENDS_AVATAR_MAP = null;
                  try {
                    await dbHelper.set('filetree_data', null);
                  } catch (e) {
                    clog.error('Failed to clear IndexedDB cache:', e);
                  }
                  show.ok(
                    `CDN source switched to: ${CDN_SOURCES[newIndex].name}`,
                  );
                  layer.close(index);
                } else layer.close(index);
              },
            });
          })();
        });
        utils.setupEscClose(index);
      },
      yes: async (index) => {
        const newAvatar = $('#edit-actress-avatar').val().trim(),
          newName = $('#edit-actress-name').val().trim(),
          newAllNameStr = $('#edit-actress-allname').val().trim(),
          newVideoListStr = $('#edit-actress-newvideolist').val().trim(),
          newRemark = $('#edit-remark').val().trim(),
          newActressType = $('#actressType').val();
        if (!newName) {
          show.error('Main name cannot be empty');
          return !1;
        }
        const newAllName = newAllNameStr
            .split(/[\uff0c,]/)
            .map((n) => n.trim())
            .filter((n) => n.length > 0),
          newVideoList = newVideoListStr
            .split(/[\uff0c,]/)
            .map((n) => n.trim())
            .filter((n) => n.length > 0);
        actress.avatar = newAvatar;
        actress.name = newName;
        actress.allName = newAllName;
        actress.newVideoList = newVideoList;
        actress.actressType = newActressType;
        actress.remark = newRemark;
        if (await storageManager.updateFavoriteActress(actress))
          show.error('Modification failed');
        else {
          show.ok(`Actress ${newName} information updated`);
          await this.renderActressCards();
          layer.close(index);
        }
      },
    });
  }
  renderPagination(totalCount, totalPages) {
    const currentPage = this.currentPage;
    let paginationHtml = '';
    const $actressPagination = $('#actress-pagination');
    if (0 === totalPages) {
      paginationHtml = '<span style="color: #666;">Total 0 records</span>';
      $actressPagination.html(paginationHtml);
      return;
    }
    currentPage > 1 &&
      totalPages > 5 &&
      (paginationHtml +=
        '<button class="pagination-btn" data-page="1" style="padding: 8px 12px; margin: 0 5px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">First</button>');
    currentPage > 1 &&
      (paginationHtml += `<button class="pagination-btn" data-page="${
        currentPage - 1
      }" style="padding: 8px 12px; margin: 0 5px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Previous</button>`);
    let startPage = Math.max(1, currentPage - Math.floor(2.5)),
      endPage = Math.min(totalPages, startPage + 5 - 1);
    endPage - startPage < 4 && (startPage = Math.max(1, endPage - 5 + 1));
    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += `<button class="pagination-btn page-number-btn ${
        i === currentPage ? 'active' : ''
      }" data-page="${i}" style="padding: 8px 12px; margin: 0 3px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; ${
        i === currentPage
          ? 'background: #007bff; color: white; border-color: #007bff;'
          : ''
      }">${i}</button>`;
    }
    currentPage < totalPages &&
      (paginationHtml += `<button class="pagination-btn" data-page="${
        currentPage + 1
      }" style="padding: 8px 12px; margin: 0 5px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Next</button>`);
    currentPage < totalPages &&
      totalPages > 5 &&
      (paginationHtml += `<button class="pagination-btn" data-page="${totalPages}" style="padding: 8px 12px; margin: 0 5px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Last</button>`);
    paginationHtml += `<span style="margin-left: 20px; color: #666;">Total ${totalCount} records (Page ${currentPage}/${totalPages})</span>`;
    $actressPagination.html(paginationHtml);
    $('.pagination-btn')
      .off('click')
      .on('click', (e) => {
        if ($(e.currentTarget).is('[disabled]')) return;
        const newPage = parseInt($(e.currentTarget).data('page'));
        if (
          newPage >= 1 &&
          newPage <= totalPages &&
          newPage !== this.currentPage
        ) {
          this.currentPage = newPage;
          this.renderActressCards();
        }
      });
  }
  async searchAvatar() {
    const $mainNameInput = $('#edit-actress-name'),
      $aliasInput = $('#edit-actress-allname'),
      currentName = $mainNameInput.val().trim(),
      searchNames = $aliasInput
        .val()
        .trim()
        .split(/[\uff0c,]/)
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
    currentName && searchNames.unshift(currentName);
    if (0 === searchNames.length) {
      show.error('Please fill in the actress main name or alias to search.');
      return;
    }
    const loadObj = loading('Searching for avatar...');
    let imageLinks = [];
    try {
      imageLinks = await searchActorAvatars(searchNames);
    } catch (e) {
      show.error(`Avatar data failed to load or search: ${e.message || e}`);
      return;
    } finally {
      loadObj.close();
    }
    if (0 === imageLinks.length) {
      show.error(
        `No avatars found related to '${searchNames.join(
          '、',
        )}'. Please check the name.`,
      );
      return;
    }
    const imageItems = imageLinks
        .map(
          (url, index) =>
            `\n        <div id="wrapper-${index}" class="gfriends-image-item-wrapper">\n            <img alt="" src="${url}" data-url="${url}" class="gfriends-selectable-img" data-wrapper-id="wrapper-${index}" >\n            <div class="gfriends-size-tag" data-size-for="wrapper-${index}">...</div> \n        </div>\n    `,
        )
        .join(''),
      imageListHtml = `\n        <style>\n            /* Keep the beautified styles from the previous answer */\n            #gfriends-image-list-container { padding: 15px; height: 100%; box-sizing: border-box; background-color: #f8f9fa; }\n            #gfriends-prompt { color: #555; font-weight: 500; border-bottom: 1px solid #eee; padding-bottom: 10px; }\n            #gfriends-image-list { display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; }\n            .gfriends-image-item-wrapper {\n                width: 160px; height: 225px; /* Increased height to accommodate size tag */\n                overflow: hidden; border-radius: 6px;\n                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.2s ease, box-shadow 0.2s ease;\n                cursor: pointer; position: relative; \n                padding-bottom: 25px; /* Space for size tag */\n            }\n            .gfriends-selectable-img {\n                width: 100%; height: 200px; /* Fixed image height */\n                object-fit: cover; border: 3px solid transparent; \n                border-radius: 6px; transition: border 0.2s ease;\n            }\n            .gfriends-image-item-wrapper:hover {\n                transform: translateY(-4px) scale(1.02);\n                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);\n            }\n            .gfriends-selectable-img.is-selected {\n                border-color: #ff6347;\n                box-shadow: 0 0 0 3px #ff6347;\n            }\n            /* New: Size tag styles */\n            .gfriends-size-tag {\n                position: absolute;\n                bottom: 0; /* Position at the bottom of the image container */\n                left: 0;\n                right: 0;\n                height: 25px;\n                line-height: 25px;\n                text-align: center;\n                background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent background */\n                color: #fff;\n                font-size: 11px;\n                font-weight: bold;\n                border-bottom-left-radius: 6px;\n                border-bottom-right-radius: 6px;\n                user-select: none;\n            }\n        </style>\n        \n        <div id="gfriends-image-list-container">\n            <p id="gfriends-prompt" style="text-align: center; font-size: 15px; margin-bottom: 15px;">\n                Click on the image to select (initial total ${imageLinks.length} images)\n            </p>\n            <div style="overflow-y: auto; height: calc(100% - 40px);">\n                <div id="gfriends-image-list">\n                    ${imageItems}\n                </div>\n            </div>\n        </div>\n    `;
    let errorCount = 0;
    layer.open({
      type: 1,
      title: `Select Actress Avatar (${imageLinks.length} images)`,
      area: utils.getResponsiveArea(['900px', '85%']),
      content: imageListHtml,
      btn: ['Close'],
      success: (selectionLayero, selectionIndex) => {
        const $container = $(selectionLayero),
          $images = $container.find('.gfriends-selectable-img'),
          $prompt = $container.find('#gfriends-prompt');
        $images.each(function () {
          const $img = $(this),
            wrapperId = $img.data('wrapper-id'),
            $wrapper = $container.find(`#${wrapperId}`),
            $sizeTag = $container.find(
              `.gfriends-size-tag[data-size-for="${wrapperId}"]`,
            );
          $img.on('load', function () {
            const width = this.naturalWidth,
              height = this.naturalHeight;
            $sizeTag.text(`${width} x ${height}`);
          });
          $img.on('error', function () {
            $wrapper.remove();
            errorCount++;
            const validCount = imageLinks.length - errorCount;
            $prompt.text(
              `Click on the image to select (removed ${errorCount} erroneous images, ${validCount} remaining)`,
            );
            if (0 === validCount) {
              show.error(
                'All searched avatar links are invalid, cannot select.',
              );
              layer.close(selectionIndex);
            }
          });
          this.complete &&
            (this.naturalWidth > 0
              ? $img.trigger('load')
              : $img.trigger('error'));
        });
        $images.on('click', function () {
          const $clickedImg = $(this),
            selectedUrl = $clickedImg.data('url');
          $('#edit-actress-avatar').val(selectedUrl);
          $('#edit-avatar-preview').attr('src', selectedUrl);
          $images.removeClass('is-selected');
          $clickedImg.addClass('is-selected');
          setTimeout(() => {
            layer.close(selectionIndex);
          }, 150);
        });
        utils.setupEscClose(selectionIndex);
      },
    });
  }
}

const originalLayerClose = layer.close;

layer.close = function (index) {
  const result = originalLayerClose.call(this, index);
  !(function (waitTime = 10) {
    setTimeout(() => {
      const openLayerCount =
        document.querySelectorAll('.layui-layer-shade').length;
      document.documentElement.style.overflow =
        openLayerCount > 0 ? 'hidden' : '';
    }, waitTime);
  })();
  return result;
};

const originalLayerOpen = layer.open;

layer.open = function (options) {
  const originalSuccess = (options = options || {}).success;
  options.success = function (layero, index) {
    'function' == typeof originalSuccess &&
      originalSuccess.call(this, layero, index);
    utils.setupEscClose(index);
  };
  return originalLayerOpen.call(this, options);
};

utils.importResource(
  'https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css',
);

if (isJavDb || isJavBus) {
  utils.importResource(
    'https://cdn.jsdelivr.net/npm/viewerjs@1.11.1/dist/viewer.min.css',
  );
  utils.importResource(
    'https://cdn.jsdelivr.net/npm/tabulator-tables@6.3.1/dist/css/tabulator_semanticui.min.css',
  );
}

const pluginManager = (function () {
  const pluginManager2 = new PluginManager();
  unsafeWindow.pluginManager = window.pluginManager = pluginManager2;
  let hostname = window.location.hostname;
  if (isJavDb) {
    pluginManager2.register(ListPagePlugin);
    pluginManager2.register(AutoPagePlugin);
    pluginManager2.register(Fc2Plugin);
    pluginManager2.register(FoldCategoryPlugin);
    pluginManager2.register(ListPageButtonPlugin);
    pluginManager2.register(HistoryPlugin);
    pluginManager2.register(SettingPlugin);
    pluginManager2.register(NavBarPlugin);
    pluginManager2.register(HitShowPlugin);
    pluginManager2.register(TOP250Plugin);
    pluginManager2.register(CoverButtonPlugin);
    pluginManager2.register(ImageRecognitionPlugin);
    pluginManager2.register(Fc2By123AvPlugin);
    pluginManager2.register(WangPan115MatchPlugin);
    pluginManager2.register(DetailPagePlugin);
    pluginManager2.register(ReviewPlugin);
    pluginManager2.register(RelatedPlugin);
    pluginManager2.register(DetailPageButtonPlugin);
    pluginManager2.register(HighlightMagnetPlugin);
    pluginManager2.register(PreviewVideoPlugin);
    pluginManager2.register(FilterTitleKeywordPlugin);
    pluginManager2.register(ActressInfoPlugin);
    pluginManager2.register(OtherSitePlugin);
    pluginManager2.register(WangPan115TaskPlugin);
    pluginManager2.register(TranslatePlugin);
    pluginManager2.register(WantAndWatchedVideosPlugin);
    pluginManager2.register(MagnetHubPlugin);
    pluginManager2.register(ScreenShotPlugin);
    pluginManager2.register(BlacklistPlugin);
    pluginManager2.register(FavoriteActressesPlugin);
    pluginManager2.register(NewVideoPlugin);
    pluginManager2.register(TaskPlugin);
  }
  if (isJavBus) {
    pluginManager2.register(ListPagePlugin);
    pluginManager2.register(ListPageButtonPlugin);
    pluginManager2.register(SettingPlugin);
    pluginManager2.register(HistoryPlugin);
    pluginManager2.register(AutoPagePlugin);
    pluginManager2.register(ImageRecognitionPlugin);
    pluginManager2.register(BusNavBarPlugin);
    pluginManager2.register(CoverButtonPlugin);
    pluginManager2.register(WangPan115MatchPlugin);
    pluginManager2.register(BusImgPlugin);
    pluginManager2.register(BusDetailPagePlugin);
    pluginManager2.register(DetailPageButtonPlugin);
    pluginManager2.register(ReviewPlugin);
    pluginManager2.register(FilterTitleKeywordPlugin);
    pluginManager2.register(HighlightMagnetPlugin);
    pluginManager2.register(BusPreviewVideoPlugin);
    pluginManager2.register(MagnetHubPlugin);
    pluginManager2.register(ScreenShotPlugin);
    pluginManager2.register(OtherSitePlugin);
    pluginManager2.register(WangPan115TaskPlugin);
    pluginManager2.register(TranslatePlugin);
    pluginManager2.register(BlacklistPlugin);
    pluginManager2.register(TaskPlugin);
  }
  hostname.includes('javtrailers') &&
    pluginManager2.register(JavTrailersPlugin);
  hostname.includes('subtitlecat') &&
    pluginManager2.register(SubTitleCatPlugin);
  (hostname.includes('aliyundrive') || hostname.includes('alipan')) &&
    pluginManager2.register(AliyunPanPlugin);
  hostname.includes('115.com') && pluginManager2.register(WangPan115Plugin);
  return pluginManager2;
})();

pluginManager.processCss().then();

!(async function () {
  window.isDetailPage = (function () {
    let href = window.location.href;
    return isJavDb
      ? href.split('?')[0].includes('/v/')
      : !!isJavBus && $('#magnet-table').length > 0;
  })();
  window.isListPage = (function () {
    let href = window.location.href;
    return isJavDb
      ? $('.movie-list').length > 0 || href.includes('advanced_search')
      : !!isJavBus && $('.masonry > div .item').length > 0;
  })();
  window.isFc2Page = (function () {
    let href = window.location.href;
    return (
      href.includes('advanced_search?type=3') ||
      href.includes('advanced_search?type=100')
    );
  })();
  pluginManager.processPlugins().then();
})();
