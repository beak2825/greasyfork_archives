// ==UserScript==
// @name         YMF
// @namespace    https://www.cdzero.cn
// @author       Zero
// @version      1.0.3
// @description  高亮BOSS直聘页面中的文字（对钉钉用户实时同步）！
// @icon         data:image/png;base64,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
// @match        *://*.zhipin.com/*
// @connect      cdzero.cn
// @connect      localhost
// @connect      10.10.0.150
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        window.close
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555602/YMF.user.js
// @updateURL https://update.greasyfork.org/scripts/555602/YMF.meta.js
// ==/UserScript==
(function () {
    "use strict";
    // 重写GM_addStyle函数
    const newGM_addStyle = GM_addStyle;
    GM_addStyle = function (css) {
        const allStyles = document.querySelectorAll("style");
        for (const styleDom of allStyles) {
            if (styleDom.textContent === css) {
                return false;
            }
        }
        newGM_addStyle(css);
    }
    CSS_mainPage();
    plugSetting();
    const host = window.location.host; // 获取host
    unsafeWindow.ymfApiOrigin = "http://10.10.0.150:6080";

    // BOSS页面
    if (host.includes("zhipin.com")) {
        Plug_highlight();
        Plug_highlightCanvas();
    }
})();

function plugSetting() {
    if (window.self !== window.top) {
        return false;
    }
    const configArr = [{
        name: "文字高亮",
        type: "highlight",
        config: {
            value: [],
            color: "#ff0000",
            state: true
        },
        longConfig: {
            default: []
        }
    }, {
        name: "功能设置",
        switch: [{
            label: "独立简历姓名",
            key: "User-Name-HTML",
            state: true,
            info: "查看简历时，如果是Canvas渲染则把姓名独立成一个元素，解决不能高亮的问题"
        }]
    }]
    const version = GM_info.script.version;
    const switchConfigTest = GM_getValue("switchConfig", {});
    if (switchConfigTest.version !== version) {
        setConfig(configArr);
    }
    function setConfig(configData) {
        const switchConfig = GM_getValue("switchConfig", {});
        for (const listObj of configData) {
            if (listObj.switch) {
                markSwitch(listObj.switch);
            }
            if (listObj.input) {
                for (const list of listObj.input) {
                    const oldValue = switchConfig[list.key] || {};
                    switchConfig[list.key] = {
                        ...oldValue,
                        value: oldValue.value || list.value,
                        version: version
                    }
                }
            }
            if (!!listObj.type) {
                if (listObj.type === "highlight") {
                    const oldData = switchConfig[listObj.type];
                    if (oldData && Array.isArray(oldData.value) && typeof oldData.value[0] !== "object") {
                        oldData.value = [{ name: "未命名分组", value: oldData.value }];
                    }
                }
                switchConfig[listObj.type] = {
                    ...listObj.config,
                    ...switchConfig[listObj.type],
                    ...listObj.longConfig,
                    version: version
                }
            }
        }
        function markSwitch(params) {
            for (const list of params) {
                if (list.switch) {
                    markSwitch(list.switch);
                }
                const minList = { ...list };
                delete minList.label;
                delete minList.info;
                delete minList.key;
                delete minList.switch;
                if (!switchConfig[list.key] || switchConfig[list.key].default === switchConfig[list.key].state) {
                    switchConfig[list.key] = {
                        ...minList,
                        ...switchConfig[list.key],
                        freeValue: list.freeValue,
                        state: list.state,
                        default: list.state,
                        version: version
                    }
                } else {
                    switchConfig[list.key] = {
                        ...minList,
                        ...switchConfig[list.key],
                        freeValue: list.freeValue,
                        version: version
                    }
                }
            }
        }
        function filterObjectByKey(obj, key) {
            const filteredObj = Object.fromEntries(Object.entries(obj).filter(([v, k]) => k.version === key));
            return filteredObj;
        }
        const overConfig = filterObjectByKey(switchConfig, version);
        GM_setValue("switchConfig", { ...overConfig, version: version });
    }
    const versionDom = Plug_versionPlug();
    GM_registerMenuCommand("🏀 设置", () => {
        CSS_settingPage();
        plugSettingPage(configArr, versionDom);
    })
}

// 设置模态框
async function plugSettingPage(configArr, versionDom) {
    const { AddDOM, RemoveDom, ThrottleOver, MessageTip, MessageBox, RunFrame, ObjectProperty, closeDialog, GM_XHR } = Plug_fnClass();
    const isDialog = closeDialog("plug-setting");
    if (isDialog) {
        return false;
    }
    const { Tooltip, SwitchBox } = Plug_Components();
    const plugName = GM_info.script.name;
    const switchConfig = GM_getValue("switchConfig", {});
    const highlightConfig = switchConfig["highlight"];
    const { menuNodeList, pageNodeList } = markPage(configArr);
    // 记录高亮历史
    let oldHighlight = JSON.stringify(highlightConfig.value);
    const { element: settingDom, close: closeBox } = await MessageBox({
        id: "plug-setting",
        title: plugName,
        body: [{
            name: "div",
            id: "menu",
            add: [{
                name: "div",
                id: "menu-list",
                style: menuNodeList.length <= 1 ? "display: none;" : "",
                add: menuNodeList
            }, {
                name: "div",
                id: "page",
                add: pageNodeList
            }]
        }],
        footer: [{
            name: "div",
            add: versionDom
        }, {
            name: "button",
            style: "margin-left: auto;",
            className: "gm-button danger",
            innerHTML: "保存",
            click: async (_, element) => {
                if (element.classList.contains("loading")) {
                    return false;
                }
                element.classList.add("loading");
                const closeSetting = (type = true) => {
                    GM_setValue("switchConfig", switchConfig);
                    element.classList.remove("loading");
                    type && closeBox();
                };
                const nowHighlight = JSON.stringify(highlightConfig.value);
                if (oldHighlight !== nowHighlight) {
                    const diffConfig = HighlightDiff(JSON.parse(oldHighlight), JSON.parse(nowHighlight));
                    await GM_XHR({
                        url: unsafeWindow.ymfApiOrigin + "/api/ymf/config",
                        method: "POST",
                        data: {
                            type: "UPDATE",
                            name: "ymf-highlight",
                            config: diffConfig
                        }
                    }).then((res) => JSON.parse(res.responseText)).then(async ({ code, msg }) => {
                        if (code === 200) {
                            oldHighlight = nowHighlight;
                            HighlightGetData();
                            closeSetting();
                        } else {
                            throw msg;
                        }
                    }).catch((error) => {
                        console.log(error);
                        MessageTip("❌", typeof error === "string" ? `保存到服务器失败：${error}` : "保存到服务器失败", 3).open(settingDom);
                        closeSetting(false);
                    });
                } else {
                    closeSetting();
                }
            }
        }, {
            name: "button",
            className: "gm-button",
            innerHTML: "关闭",
            click: () => closeBox()
        }],
        closeback: () => {
            window.removeEventListener("resize", throttleAutoShadow);
        }
    }, 0)
    const throttleAutoShadow = ThrottleOver(autoShadow, 100);
    // 自动阴影
    autoShadow();
    window.addEventListener("resize", throttleAutoShadow);
    function autoShadow(element = {}) {
        element = element.tagName || settingDom.querySelector("#page-list.active");
        const parentNode = element.parentNode;
        const isTop = element.scrollTop === 0;
        const isBottom = element.scrollTop + element.clientHeight + 1 >= element.scrollHeight;
        parentNode.classList.toggle("shadow-top", !isTop);
        parentNode.classList.toggle("shadow-bottom", !isBottom);
    }
    // 制作设置页面
    function markPage(configArr) {
        const arrNode = { menuNodeList: [], pageNodeList: [] };
        configArr.forEach((list, index) => {
            const { pageNode, callbackBlock } = pageList(list, index);
            const menuNode = menuList(list, index, callbackBlock);
            arrNode.pageNodeList.push(pageNode);
            arrNode.menuNodeList.push(menuNode);
        });
        return arrNode;
        function menuList(keyArr, i, callbackBlock) {
            function toClick(event) {
                const active = settingDom.querySelectorAll("#menu-list>div");
                addActive(active);
                const activePage = settingDom.querySelectorAll("#page>div");
                addActive(activePage);
                function addActive(activeArr) {
                    activeArr.forEach((item, index) => {
                        item.className = "";
                        if (i === index) {
                            item.className = "active";
                            autoShadow();
                            if (callbackBlock.length > 0) {
                                for (const callback of callbackBlock) {
                                    callback(event);
                                }
                                callbackBlock = [];
                            }
                        }
                    })
                }
            }
            return {
                name: "div",
                className: i === 0 ? "active" : "",
                innerHTML: keyArr.name,
                click: toClick,
                ...keyArr.nodeConfig
            }
        }
        function pageList(keyArr, i) {
            const { pageNode, callbackBlock } = addThis(keyArr);
            return {
                callbackBlock,
                pageNode: {
                    name: "div",
                    id: "page-list",
                    className: i === 0 ? "active" : "",
                    add: pageNode,
                    function: (element) => {
                        element.addEventListener("scroll", ThrottleOver(autoShadow, 100));
                    }
                }
            }
        }
        // 页面生成函数选择器
        function addThis(params) {
            const pageNode = [];
            const callbackBlock = [];
            if (params.switch) {
                const nodeArr = pageSwitchList({ switchArr: params.switch });
                pageNode.push(...nodeArr);
            }
            if (params.type === "highlight") {
                const nodeArr = pageHighlight(params);
                pageNode.push(...nodeArr);
            }
            return { pageNode, callbackBlock };
        }
    }
    // 开关类型生成器
    function pageSwitchList({ switchArr, switchType, switchChange, nodeConfig }) {
        return switchArr.map(list => ({
            name: "div",
            id: "page-item",
            ...nodeConfig,
            add: [{
                name: "div",
                className: "plug-center",
                add: [SwitchBox({
                    checked: switchType !== undefined ? switchType : switchConfig[list.key].state,
                    function: (event) => {
                        event.addEventListener("change", () => {
                            if (switchChange) {
                                switchChange(event);
                            } else {
                                switchConfig[list.key].state = event.checked;
                            }
                        })
                    }
                }), {
                    name: "span",
                    id: "label",
                    innerHTML: list.label
                }]
            }, {
                name: "span",
                id: "info",
                innerHTML: list.info
            }, otherSwitch(list)]
        }))
    }
    // 开关其他嵌入组件
    function otherSwitch(list) {
        function heightAnimation(element, switchObj, defHeight) {
            const isAuto = defHeight === "auto" || !defHeight;
            element.style.transition = "height 0.25s";
            element.style.overflow = "hidden";
            RunFrame(() => ObjectProperty(switchObj, "state", setHeight));
            function setHeight(params) {
                if (isAuto) {
                    if (params.value) {
                        element.style.overflow = "auto";
                        element.style.height = "auto";
                        const height = element.clientHeight;
                        element.style.overflow = "hidden";
                        element.style.height = 0;
                        element.clientHeight;
                        element.style.height = `${height}px`;
                        setTimeout(() => {
                            if (switchObj.state) {
                                element.style.height = "auto";
                            }
                        }, 250)
                    } else {
                        element.style.height = "auto";
                        const height = element.clientHeight;
                        element.style.height = `${height}px`;
                        element.clientHeight;
                        element.style.height = 0;
                    }
                } else {
                    if (params.value) {
                        element.style.height = defHeight;
                    } else {
                        element.style.height = 0;
                    }
                }
            }
        }
        const otherDom = [];
        if (list.key === "Label-Fast" || list.key === "Label-Auto-Qc") {
            const openState = {
                textarea: switchConfig[list.key].textarea.join("\n")
            }
            otherDom.push({
                name: "div",
                className: "plug-center",
                style: "height: 135px",
                add: [{
                    name: "textarea",
                    className: "gm-textarea",
                    style: "width: 50%;height: 100%",
                    value: [openState, "textarea"],
                    placeholder: list.placeholder || "",
                    function: (element) => {
                        const ThrottleBcak = ThrottleOver(() => openState.textarea = element.value, 200);
                        element.addEventListener("input", ThrottleBcak);
                        ObjectProperty(openState, "textarea", (params) => {
                            if (params.value !== undefined) {
                                const valueArr = params.value.split("\n").filter((item) => item !== "");
                                switchConfig[list.key].textarea = valueArr;
                            }
                        })
                    }
                }, {
                    name: "button",
                    className: "gm-button small danger",
                    style: "margin-left: 15px;",
                    innerHTML: "重置",
                    click: () => openState.textarea = list.textarea.join("\n")
                }]
            });
        }
        if (list.key === "Video-Rate-Fast") {
            function chunkArray(size) {
                const arr = Array.from({ length: 8 }, (_, i) => (i * 0.5 + 0.5));
                const result = [];
                for (let i = 0; i < arr.length; i += size) {
                    result.push(arr.slice(i, i + size));
                }
                return result;
            }
            const rateArr = chunkArray(4);
            const rateObj = {};
            const valueArr = switchConfig[list.key];
            function setSwitch() {
                const data = Object.entries(rateObj).filter((i) => i[1] === true).map((k) => Number(k[0])).sort((a, b) => b - a);
                valueArr.value = data;
            }
            otherDom.push({
                name: "div",
                style: "gap: 15px;height: auto;",
                className: "plug-center",
                add: [{
                    name: "div",
                    className: "switch-video-rate-list",
                    add: rateArr.map((itemArr) => ({
                        name: "div",
                        className: "switch-video-rate-item",
                        add: itemArr.map((item) => {
                            rateObj[item] = valueArr.value.includes(item);
                            return {
                                name: "span",
                                className: [rateObj, item.toString()],
                                innerHTML: item.toFixed(1),
                                click() {
                                    const editType = !rateObj[item];
                                    if (valueArr.value.length >= 8 && editType) {
                                        return MessageTip("❌", "最多设置8个", 3).open(settingDom);
                                    }
                                    rateObj[item] = editType;
                                    setSwitch();
                                }
                            }
                        })
                    }))
                }, {
                    name: "button",
                    className: "gm-button small danger",
                    style: "margin-left: 0;",
                    innerHTML: "重置",
                    click: () => {
                        const oldRate = [4, 3, 2, 1.5, 1, 0.5];
                        for (const key in rateObj) {
                            if (Object.hasOwnProperty.call(rateObj, key)) {
                                if (oldRate.includes(Number(key))) {
                                    rateObj[key] = true;
                                } else {
                                    rateObj[key] = false;
                                }
                            }
                        }
                        setSwitch();
                    }
                }]
            });
        }
        if (list.key === "Label-Size-Change") {
            const data = switchConfig[list.key];
            otherDom.push({
                name: "div",
                style: "gap: 15px;height: auto;",
                className: "plug-center",
                add: [{
                    name: "div",
                    className: "switch-label-size-item",
                    add: data.value.map((item) => {
                        !item.active && (item.active = false);
                        return {
                            name: "span",
                            className: [item, "active"],
                            innerHTML: item.name,
                            click() {
                                data.value.forEach((i) => i.active = false);
                                item.active = true;
                            }
                        }
                    })
                }]
            })
        }
        if (list.switch) {
            otherDom.push(...pageSwitchList({ switchArr: list.switch, nodeConfig: { style: "padding: 0;margin-top: 20px;" } }));
        }
        return {
            name: "div",
            style: "display: flex;",
            function: (element) => switchConfig[list.key] && heightAnimation(element, switchConfig[list.key]),
            add: [{
                name: "div",
                style: "height: auto;margin-right: 10px;box-shadow: 0 0 10px 3px #cccccc;"
            }, {
                name: "div",
                style: "width: calc(100% - 10px);",
                add: otherDom
            }]
        };
    }
    // 文字高亮
    function pageHighlight(params) {
        const { config } = params;
        let addGroupBack = () => { };
        GM_addStyle(`
            #page-highlight .highlight-config {
                gap: 10px;
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                overflow-y: auto;
                padding: 0 0 0 10px;
            }
            #page-highlight .highlight-config.loading::before {
                content: "";
                top: 50%;
                left: 50%;
                width: 50px;
                height: 50px;
                position: absolute;
                border: 2px solid rgba(0, 0, 0, 0);
                border-radius: 50px;
                border-top-color: #bbbbbb;
                animation: gm-highlight-config-loading 1s linear infinite;
            }
            @keyframes gm-highlight-config-loading {
                0%{
                    transform: translate(-50%, -50%) rotate(0deg);
                }
                100%{
                    transform: translate(-50%, -50%) rotate(360deg);
                }
            }
            #page-highlight .highlight-config>div {
                border: 1px solid #bbbbbb;
                border-radius: 8px;
                padding: 5px;
                display: flex;
                flex-direction: column;
                width: calc(33.3% - 7px);
            }
            #page-highlight .highlight-config>div .highlight-delete {
                width: 0;
                height: 24px;
                border-radius: 5px;
                padding: 0;
                overflow: hidden;
                transition: 0.2s;
            }
            #page-highlight .highlight-config>div:hover .highlight-delete {
                width: 24px;
            }
            #page-highlight .highlight-config .highlight-config-group-list label:hover {
                width: 32px !important;
                color: #ffffff !important;
            }
        `)
        return [{
            name: "div",
            id: "page-highlight",
            add: [...pageSwitchList({
                switchArr: [{
                    label: "高亮开关",
                    info: "高亮指定关键字"
                }],
                switchType: highlightConfig.state,
                switchChange: (event) => {
                    highlightConfig.state = event.checked;
                },
                nodeConfig: {
                    style: "margin-bottom: 5px;"
                }
            }), {
                name: "div",
                id: "page-item",
                style: "margin-bottom: 5px",
                add: [{
                    name: "div",
                    style: "gap: 10px",
                    className: "plug-center",
                    add: [Tooltip({
                        text: "修改高亮颜色",
                        open: () => settingDom,
                        node: [{
                            name: "label",
                            style: "margin-right: 0;position: relative;display: block;cursor: pointer;",
                            add: [{
                                name: "span",
                                className: "gm-highlight-light test-highlight-span",
                                style: `background: ${highlightConfig.color || ""}`,
                                innerHTML: "示例文本"
                            }, {
                                name: "input",
                                type: "color",
                                className: "test-highlight-input",
                                value: highlightConfig.color || "",
                                style: "position: absolute;left: 0;bottom: -6px;visibility: hidden;width: 0;height: 0;",
                                function: (event) => {
                                    event.addEventListener("input", () => {
                                        const span = document.querySelector(".test-highlight-span");
                                        span.style.background = event.value;
                                        highlightConfig.color = event.value;
                                        const groupList = document.querySelectorAll(".highlight-config-group-list");
                                        groupList.forEach((group) => group._updateColor(event.value));
                                    })
                                }
                            }]
                        }]
                    }), Tooltip({
                        text: "重置颜色",
                        open: () => settingDom,
                        node: [{
                            name: "button",
                            className: "gm-button small",
                            style: "margin-left: 0;",
                            innerHTML: "重置",
                            click: () => {
                                const span = document.querySelector(".test-highlight-span");
                                const input = document.querySelector(".test-highlight-input");
                                input.value = config.color;
                                span.style.background = config.color;
                                highlightConfig.color = config.color;
                                const groupList = document.querySelectorAll(".highlight-config-group-list");
                                groupList.forEach((group) => group._updateColor(config.color));
                            }
                        }]
                    }), Tooltip({
                        text: "添加新分组",
                        open: () => settingDom,
                        node: [{
                            name: "button",
                            className: "gm-button small",
                            style: "margin-left: 0;",
                            innerHTML: "添加",
                            click: () => addGroupBack()
                        }]
                    })]
                }]
            }, {
                name: "div",
                className: "highlight-config",
                function(element) {
                    element.classList.add("loading");
                    HighlightGetData((msg) => {
                        MessageTip(...msg).open(settingDom);
                    }).then((content) => {
                        if (content && content.value && content.value.length > 0) {
                            highlightConfig.value = content.value;
                            oldHighlight = JSON.stringify(highlightConfig.value)
                        }
                        if (content && content.default && content.default.length > 0) {
                            highlightConfig.default = content.default;
                        }
                        element.classList.remove("loading");
                        const groupDefault = highlightConfig.default || [];
                        for (let index = groupDefault.length - 1; index >= 0; index--) {
                            const data = groupDefault[index];
                            addGroup(data, true);
                        }
                        const groupValue = highlightConfig.value || [];
                        for (let index = groupValue.length - 1; index >= 0; index--) {
                            addGroup(groupValue[index]);
                        }
                        addGroupBack = () => {
                            const newData = { name: "未命名分组", value: [] };
                            highlightConfig.value.push(newData);
                            addGroup(newData);
                        };
                        async function addGroup(data, isDef) {
                            if (!data.value) {
                                console.error("高亮关键字的数据结构不正确")
                                return false;
                            }
                            const groupDom = await AddDOM({
                                addData: [{
                                    name: "div",
                                    className: "highlight-config-group-list",
                                    style: isDef ? "background: #f8f8f8;" : "",
                                    add: [{
                                        name: "div",
                                        style: "gap: 5px;display: flex;align-items: center;",
                                        add: [Tooltip({
                                            text: "自定义颜色(右键重置)",
                                            open: () => settingDom,
                                            node: [{
                                                name: "label",
                                                className: "gm-button small",
                                                style: "padding: 0 2px;position: relative;transition: width 0.2s;white-space: nowrap;overflow: hidden;display: block;height: 19px;line-height: 19px;width: 8px;",
                                                add: [{
                                                    name: "span",
                                                    innerText: "示例"
                                                }, {
                                                    name: "input",
                                                    type: "color",
                                                    style: "position: absolute;left: 0;bottom: -4px;visibility: hidden;width: 0;height: 0;",
                                                    function: (element) => {
                                                        const labelDom = element.parentNode;
                                                        const throttle = ThrottleOver((value) => {
                                                            labelDom.style.color = value;
                                                            labelDom.style.width = "8px";
                                                        }, 1000);
                                                        const updateColor = (value, isChange) => {
                                                            if (data.isFree && !isChange) {
                                                                return false;
                                                            }
                                                            labelDom.style.background = value;
                                                            element.value = value;
                                                            data.color = value;
                                                            labelDom.style.color = "#ffffff";
                                                            labelDom.style.width = "32px";
                                                            throttle(value);
                                                        };
                                                        updateColor(data.color || highlightConfig.color || "", true);
                                                        RunFrame(() => groupDom._updateColor = updateColor);
                                                        element.addEventListener("input", () => (data.isFree = true) && updateColor(element.value, true));
                                                        labelDom.addEventListener("contextmenu", (e) => {
                                                            e.preventDefault();
                                                            data.isFree = false;
                                                            updateColor(highlightConfig.color);
                                                            MessageTip("✔️", "颜色已重置", 3).open(settingDom);
                                                        });
                                                    }
                                                }]
                                            }]
                                        }), {
                                            name: "input",
                                            type: "text",
                                            className: "gm-input",
                                            style: "width: 100%;padding: 3px 0;border: none;border-bottom: 1px dashed #bbbbbb;border-radius: 0;",
                                            disabled: !!isDef,
                                            placeholder: "输入分组名称",
                                            value: data.name,
                                            function(element) {
                                                element.addEventListener("input", () => {
                                                    data.name = element.value;
                                                })
                                            }
                                        }, !isDef && Tooltip({
                                            text: "删除",
                                            open: () => settingDom,
                                            node: [{
                                                name: "button",
                                                className: "gm-button danger small highlight-delete",
                                                innerText: "X",
                                                click: () => {
                                                    const newGroup = highlightConfig.value.filter((item) => item !== data);
                                                    if (highlightConfig.value.length - newGroup.length === 1) {
                                                        highlightConfig.value = newGroup;
                                                        RemoveDom(groupDom, "all");
                                                    }
                                                }
                                            }]
                                        })]
                                    }, {
                                        name: "textarea",
                                        className: "gm-textarea",
                                        style: "height: 170px;border: none;",
                                        disabled: !!isDef,
                                        placeholder: "关键字，一行一个或空格隔开",
                                        value: data.value.join("\n"),
                                        function(element) {
                                            const ThrottleBcak = ThrottleOver(() => {
                                                const valueArr = element.value.split(/\n|\s+/).filter((item) => item !== "");
                                                data.value = valueArr;
                                            }, 200);
                                            element.addEventListener("input", ThrottleBcak);
                                        }
                                    }]
                                }]
                            }).then((div) => {
                                element.insertBefore(div, element.firstChild);
                                return div;
                            });
                        }
                    });
                }
            }]
        }]
    }
}

// 图标
function Plug_ICO() {
    class ico {
        constructor() {
            // 复制图标
            this.redCopyIco = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="32" height="32"><path fill="%23fa7679" d="m658.5 719.5v19.6c0 16.1-13.1 29.2-29.3 29.2h-307.6c-16.2 0-29.3-13.1-29.3-29.2v-380.9c0-16.2 13.1-29.3 29.3-29.3h19.5v361.3c0 16.2 13.1 29.3 29.3 29.3z"/><path fill="%23fa7679" d="m731.7 388.3v277.5c0 16.2-13.1 29.3-29.3 29.3h-307.6c-16.2 0-29.3-13.1-29.3-29.3v-380.9c0-16.1 13.1-29.2 29.3-29.2h204.3c2.6 0 5.1 1 6.9 2.8l122.9 122.9c1.8 1.8 2.8 4.3 2.8 6.9z"/><path fill="%23fde8e8" d="m593.4 374.5v-109.1l128.6 128.6h-109.1c-10.8 0-19.5-8.8-19.5-19.5z"/></svg>';
            // 白点图标
            this.whiteDropIco = 'data:image/svg+xml;utf8,<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="2" fill="white" /></svg>';
            // 时间图标
            this.blackTimeIco = 'data:image/svg+xml;utf8,<svg viewBox="60 64 896 896" xmlns="http://www.w3.org/2000/svg"><path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z" style="fill:hsla(0, 0%, 0%, 0.62)"></path></svg>';
            // 时间图标
            this.whiteTimeIco = 'data:image/svg+xml;utf8,<svg viewBox="60 64 896 896" xmlns="http://www.w3.org/2000/svg"><path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z" style="fill:hsl(0, 0%, 100%)"></path></svg>';
            // 问题图标
            this.questionIco = '<svg viewBox="64 64 896 896" xmlns="http://www.w3.org/2000/svg"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/><path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"/></svg>';
            // 左箭头图标
            this.leftArrowIco = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M783.36 1003.52c30.72-30.72 30.72-76.8 0-107.52L404.48 512l378.88-378.88c30.72-30.72 30.72-76.8 0-107.52-30.72-30.72-76.8-30.72-107.52 0L240.64 455.68c-30.72 30.72-30.72 76.8 0 107.52l435.2 435.2c30.72 30.72 76.8 30.72 107.52 5.12z"/></svg>';
            // 分享图标
            this.shareAltIco = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M204.8 1023.931733a204.8 204.8 0 0 1-204.8-204.8v-614.4a204.8 204.8 0 0 1 204.8-204.8h136.533333a68.266667 68.266667 0 1 1 0 136.533334H204.8a68.266667 68.266667 0 0 0-68.266667 68.266666v614.4a68.266667 68.266667 0 0 0 68.266667 68.266667h614.4a68.266667 68.266667 0 0 0 68.266667-68.266667v-136.533333a68.266667 68.266667 0 0 1 136.533333 0v136.533333a204.8 204.8 0 0 1-204.8 204.8z m88.2688-292.864a68.266667 68.266667 0 0 1 0-96.6656l497.8688-497.595733H614.4a68.266667 68.266667 0 0 1 0-136.533333h341.333333a68.266667 68.266667 0 0 1 68.266667 68.266666v341.333334a68.266667 68.266667 0 0 1-136.533333 0V233.198933l-497.8688 498.346667a68.744533 68.744533 0 0 1-96.529067 0z"/></svg>';
        }
        // 密码小眼睛图标
        passwdIco() {
            const icoObj = {
                none: '<svg viewBox="64 64 896 896" width="14px" height="14px" fill="currentColor"><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z"></path><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z"></path></svg>',
                block: '<svg viewBox="64 64 896 896" width="14px" height="14px" fill="currentColor"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>'
            }
            return icoObj;
        }
    }
    const plug = new ico();
    Plug_ICO = () => plug;
    return plug;
}

// 组件
function Plug_Components() {
    const { AddDOM, RemoveDom, RunFrame } = Plug_fnClass();
    const { questionIco } = Plug_ICO();
    class Components {
        constructor() {
            Object.getOwnPropertyNames(this.constructor.prototype)
                .filter(name => name !== "constructor" && typeof this[name] === "function")
                .forEach(methodName => this[methodName] = this[methodName].bind(this));
        }

        /**
         * 开关组件
         * @param {object} params - 配置对象
         * @param {string} [params.style] - 样式
         * @param {boolean} params.checked - checked 状态
         * @param {function} params.function - 元素被创建的回调
         * @param {boolean} [params.loading] - 是否加载中
         * @param {boolean} [params.disabled] - 是否禁用
         * @returns 返回节点信息，用于 AddDOM 注入
         */
        SwitchBox(params = {}) {
            return {
                "msg-tip": params["msg-tip"] || "",
                name: "label",
                style: params.style || "",
                className: "gm-switch",
                add: [{
                    name: "input",
                    loading: !!params.loading,
                    checked: !!params.checked,
                    disabled: !!params.disabled,
                    type: "checkbox",
                    function(event) {
                        params.function && params.function(event, async (callback) => {
                            if (!event._isLoading) {
                                event._isLoading = true;
                                event.checked = !event.checked;
                                event.setAttribute("loading", true);
                                event.setAttribute("disabled", true);
                                await callback();
                                event._isLoading = false;
                                event.setAttribute("loading", false);
                                event.removeAttribute("disabled")
                            }
                        });
                    }

                }, {
                    name: "span",
                    className: "gm-slider",
                }]
            }
        }

        /**
         * Tooltip创建器
         * @param {object} params - 文本，内部dom {text,node,style,place:top|bottom,open}
         * @param {string} params.text - tooltip 文本内容
         * @param {HTMLElement} params.node - 需要显示 tooltip 的元素
         * @param {string} [params.style] - 样式
         * @param {'top'|'bottom'} [params.place] - 位置，默认top
         * @param {HTMLElement|function} [params.open] - 元素挂载的位置，默认挂载到 body 上
         * @returns {object} 返回节点信息，用于 AddDOM 注入
         */
        Tooltip(params = {}) {
            if (params.node instanceof HTMLElement) {
                _run(params.node);
            } else {
                return {
                    name: "span",
                    className: "gm-tooltip",
                    add: params.node,
                    style: params.style || "",
                    function: _run
                }
            }
            function _run(element) {
                if (!params.node) {
                    element.classList.add("question");
                    element.innerHTML = questionIco;
                }
                let isMouseOver = false;
                let mouseX = 0;
                let mouseY = 0;
                let messageBox = null;
                let tipInterval = null;
                function tipSetpage() {
                    let place = ["top", "bottom"].includes(params.place) ? params.place : "top";
                    // 获取位置
                    const rect = element.getBoundingClientRect();
                    // 计算Tooltip的位置
                    const Width = () => messageBox.offsetWidth;
                    const Height = () => messageBox.offsetHeight;
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    // 箭头信息
                    const arrowSize = 8;
                    const rWidth = rect.width / 2;
                    // 位置信息
                    const bubble = {
                        top: rect.top + rect.height + arrowSize,
                        left: rect.left + rWidth - Width() / 2,
                        bottom: screenHeight - rect.top + arrowSize,
                        arrowX: Width() / 2 - arrowSize,
                    };
                    // 左边不够
                    if (bubble.left < 0) {
                        bubble.arrowX = Width() / 2 - arrowSize + bubble.left - 5;
                        bubble.left = 5;
                        setPage(bubble);
                    }
                    // 右边不够
                    if (bubble.left + Width() > screenWidth) {
                        bubble.arrowX = Width() / 2 - arrowSize + (bubble.left + Width()) - screenWidth + 5;
                        bubble.left = screenWidth - Width() - 5;
                        setPage(bubble);
                    }
                    if (place === "top") {
                        // 上不够，设置下
                        if (rect.top - Height() - arrowSize < 0) {
                            place = "bottom";
                            setPage(bubble);
                        }
                    }
                    if (place === "bottom") {
                        // 下不够，设置上
                        if (bubble.top + Height() > screenHeight) {
                            place = "top";
                            setPage(bubble);
                        }
                    }
                    setPage(bubble);
                    function setPage(placeData) {
                        const { top, left, bottom, arrowX } = placeData;
                        messageBox.style.setProperty("--tooltip-top", place === "bottom" ? -arrowSize + "px" : "none");
                        messageBox.style.setProperty("--tooltip-bottom", place === "top" ? -arrowSize + "px" : "none");
                        messageBox.style.setProperty("--tooltip-left", arrowX + "px");
                        messageBox.style.setProperty("--tooltip-rotate", (place === "top" ? 180 : 0) + "deg");
                        // 更新Tooltip的位置和内容
                        if (place === "bottom") {
                            messageBox.style.top = top + "px";
                            messageBox.style.left = left + "px";
                            messageBox.style.bottom = "auto";
                        } else {
                            messageBox.style.top = "auto";
                            messageBox.style.left = left + "px";
                            messageBox.style.bottom = bottom + "px";
                        }
                    }
                }
                // 移除Tip
                function tipClose() {
                    RemoveDom(messageBox, "all");
                    messageBox = null;
                    isMouseOver = false;
                    clearInterval(tipInterval);
                }
                // 循环监听元素是否存在
                function tipLoopRun() {
                    clearInterval(tipInterval);
                    tipInterval = setInterval(() => {
                        if (isMouseOver) {
                            const rect = element.getBoundingClientRect();
                            const isOver =
                                mouseY + 2 < rect.top ||
                                mouseX + 2 < rect.left ||
                                mouseX > rect.right + 2 ||
                                mouseY > rect.bottom + 2;
                            if (isOver || element.offsetWidth === 0 || element.offsetHeight === 0) {
                                tipClose();
                            } else {
                                tipSetpage();
                            }
                        }
                    }, 50)
                }
                // 鼠标进入元素时处理title属性
                element.addEventListener("mousemove", async (e) => {
                    if (!isMouseOver) {
                        mouseX = e.clientX;
                        mouseY = e.clientY;
                        isMouseOver = true;
                        messageBox = await AddDOM({
                            addNode: document.body,
                            addData: [{
                                name: "div",
                                className: "gm-tooltip-info",
                                innerText: Array.isArray(params.text) ? "" : params.text || "无",
                                add: !Array.isArray(params.text) ? "" : params.text || [],
                                function: params.function || function () { }
                            }]
                        }).then((tipDiv) => {
                            if (params.open instanceof HTMLElement) {
                                params.open.appendChild(tipDiv);
                            } else if (typeof params.open === "function") {
                                params.open().appendChild(tipDiv);
                            }
                            return tipDiv;
                        });
                        tipSetpage();
                        // 循环监听元素
                        tipLoopRun();
                    }
                });
                // 鼠标离开元素
                document.addEventListener("mouseout", () => {
                    if (isMouseOver) {
                        tipClose();
                    }
                });
            }
        }

        /**
         * 图片懒加载
         * @param {object} params - 配置对象
         * @param {string} params.src - 图片元素数组
         * @param {string} params.style - 图片样式
         * @param {number} [params.threshold] - 图片出现在屏幕的比例，默认0.3才加载
         * @returns {object} 图片元素对象，用于 AddDOM 注入
         */
        lazyLoadImg(params = {}) {
            function observerImg(element) {
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const target = entry.target;
                            target.src = target.dataset.src;
                            observer.unobserve(target);
                        }
                    });
                }, {
                    threshold: params.threshold || 0.3
                });
                observer.observe(element);
            }
            return {
                name: "img",
                style: params.style && params.style || "",
                "data-src": params.src,
                function: observerImg
            };
        }

        /**
         * 创建右侧卡片
         * @param {object} param - 配置对象
         * @param {HTMLElement} param.addNode - 注入页面的父元素
         * @param {string} param.title - 卡片标题
         * @param {object} param.body - 卡片内容，AddDOM 的 addData 格式
         * @returns {HTMLElement} 卡片元素
         */
        antcapCard({ addNode, title, body }) {
            return AddDOM({
                addNode,
                addData: [{
                    name: "div",
                    className: "antcap-card",
                    add: [{
                        name: "div",
                        className: "antcap-card-head",
                        add: [{
                            name: "div",
                            className: "antcap-card-head-wrapper",
                            add: [{
                                name: "div",
                                className: "antcap-card-head-title",
                                ...title
                            }]
                        }]
                    }, {
                        name: "div",
                        className: "antcap-card-body",
                        ...body
                    }]
                }]
            });
        }

        /**
         * 直播监看折叠卡片
         * @returns {{setCardName:function, setCardNameStyle:function, setBody:function, setPage:function, open:function}} 操作方法
         * - setCardName(string) 设置卡片名称
         * - setCardNameStyle(string) 设置卡片名称样式
         * - setBody(addData) 设置卡片内容，AddDOM 的 addData 格式
         * - setPage(callback(element)) 元素创建成功后的回调，由该回调决定注入页面的方式
         * - open(boolean) 打开/关闭卡片
         */
        collapseCard() {
            const cardConfig = {
                cardName: "",
                cardStyle: "",
                bodyElement: null,
                item: "antcap-collapse-item",
                content: "antcap-collapse-content antcap-collapse-content-inactive",
            };
            const cardPage = AddDOM({
                addData: [{
                    name: "div",
                    className: [cardConfig, "item"],
                    add: [{
                        name: "div",
                        className: "antcap-collapse-header",
                        innerHTML: `<i aria-label="图标: right" class="anticon anticon-right antcap-collapse-arrow"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true" style=""><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></i>`,
                        add: [{
                            name: "span",
                            style: [cardConfig, "cardStyle"],
                            innerHTML: [cardConfig, "cardName"],
                        }],
                        function(element) {
                            cardConfig.open = (isOpen) => {
                                const isInactive = typeof isOpen === "boolean" ? isOpen : cardConfig.content.includes("inactive");
                                element.querySelector("svg").style = isInactive ? "transform: rotate(90deg);" : "";
                                cardConfig.content = `antcap-collapse-content antcap-collapse-content-${isInactive ? "active" : "inactive"}`;
                            }
                        },
                        click: () => cardConfig.open()
                    }, {
                        name: "div",
                        className: [cardConfig, "content"],
                        add: [{
                            name: "div",
                            className: "antcap-collapse-content-box",
                            style: "display: flex;flex-direction: column;gap: 15px;",
                            function(element) {
                                cardConfig.bodyElement = element;
                            }
                        }]
                    }]
                }]
            })
            return {
                setCardName: (params) => cardConfig.cardName = params,
                setCardNameStyle: (params) => cardConfig.cardStyle = params,
                setBody: (params) => RunFrame(() => {
                    RemoveDom(cardConfig.bodyElement);
                    AddDOM({
                        addNode: cardConfig.bodyElement,
                        addData: params
                    })
                }),
                setPage: (params) => cardPage.then((element) => params(element)),
                open: (params) => RunFrame(() => cardConfig.open(params))
            }
        }
    }
    GM_addStyle(`
        .gm-tooltip.question {
            height: 20px;
            width: 20px;
            border: 1px solid #cccccc;
            border-radius: 50%;
            cursor: help;
        }
        .gm-tooltip.question svg {
            fill: #888888;
        }
        .gm-tooltip.question:hover svg {
            fill: #666666;
        }
        .gm-tooltip-info {
            position: fixed;
            transition: top 50ms, left 50ms, bottom 50ms;
            color: #ffffff;
            z-index: 2000000;
            padding: 6px 8px !important;
            font-size: 14px;
            font-weight: initial;
            line-height: 1.4;
            max-width: 450px;
            text-align: left;
            border-radius: 5px;
            pointer-events: none;
            background: rgba(0,0,0,0.75);
            box-shadow: 0 2px 8px rgba(0,0,0,.15);
        }
        .gm-tooltip-info::before {
            content: "";
            position: absolute;
            top: var(--tooltip-top, -8px);
            bottom: var(--tooltip-bottom, -8px);
            left: var(--tooltip-left, 10px);
            transform: rotate(var(--tooltip-rotate, 0deg));
            height: 8px;
            width: 16px;
            background: inherit;
            clip-path: path('M 0 8 A 4 4 0 0 0 2.82842712474619 6.82842712474619 L 6.585786437626905 3.0710678118654755 A 2 2 0 0 1 9.414213562373096 3.0710678118654755 L 13.17157287525381 6.82842712474619 A 4 4 0 0 0 16 8 Z');
        }
    `)
    const plug = new Components();
    // 捕获msg-tip属性
    document.addEventListener("mouseenter", (e) => {
        const target = e.target;
        if (target && target instanceof HTMLElement) {
            const title = target.getAttribute("msg-tip");
            if (title && !target._isTooltipRun) {
                target._isTooltipRun = true;
                const place = target.getAttribute("msg-place");
                plug.Tooltip({ text: title, node: target, place: place });
            }
        }
    }, true);
    Plug_Components = () => plug;
    return plug;
}

// 常用方法
function Plug_fnClass() {
    class Plug_Plug {
        constructor() {
            Object.getOwnPropertyNames(this.constructor.prototype)
                .filter(name => name !== "constructor" && typeof this[name] === "function")
                .forEach(methodName => this[methodName] = this[methodName].bind(this));
        }

        /**
         * 插件开关设置
         * @param {string | object} name - 开关名称
         * @param {string} saveName - 开关键名（key）
         * @param {number} initial - 默认开、关，不设置为1（开）
         * @param {boolean} click - 点击标识，反转开关（不可传参）
         * @returns {boolean} 返回当前开关状态
         */
        SwitchPrompt(name, saveName, initial = true, click) {
            const state = ["❌ ", "✔️ "];
            const isOpen = GM_getValue(saveName, initial);
            let configName = state[Number(isOpen)] + name;
            if (typeof name === "object") {
                configName = name[Number(isOpen)];
            }
            GM_registerMenuCommand(configName, () => { this.SwitchPrompt(name, saveName, isOpen, true) });
            if (!!click) {
                GM_setValue(saveName, !initial);
                location.reload();
            }
            return isOpen;
        }

        /**
         * 读取开关设置
         * @param {string} name - 开关名称
         * @returns {{state: boolean}} 返回当前开关状态
         */
        SwitchRead(name) {
            const switchConfig = GM_getValue("switchConfig", {});
            return switchConfig[name] || {};
        }

        /**
         * 修改开关设置
         * @param {string} name - 开关名称
         * @param {object} config - 开关配置
         * @returns {{state: boolean}} 返回当前开关状态
         */
        SwitchWrite(name, config) {
            const switchConfig = GM_getValue("switchConfig", {});
            if (typeof config === "object") {
                switchConfig[name] = config;
                GM_setValue("switchConfig", switchConfig);
            }
            return switchConfig[name] || {};
        }

        /**
         * 读取存储
         * @param {string} name - 存储的键名
         * @param {string|object} def - 为空的默认返回内容，不填返回undefined
         * @returns {string|object} 返回GET的值
         */
        GET_DATA(name, def = undefined) {
            if (!name) {
                return def;
            }
            return JSON.parse(localStorage.getItem(name)) || def;
        }

        /**
         * 存储写入
         * @param {string} name - 存储的键名，GM_CONFIG 特殊处理，只更新内部字段，不会完整替换
         * @param {string|object} data - 存储的内容
         * @returns {string|object} 返回写入的值
         */
        SET_DATA(name, data) {
            if (!name) {
                return data;
            }
            if (name === "GM_CONFIG") {
                const oldData = this.GET_DATA(name);
                data = { ...oldData, ...data };
            }
            localStorage.setItem(name, JSON.stringify(data));
            return data;
        }

        /**
         * JavaScript代码压缩
         * @param {string} code - JavaScript的代码
         * @returns {string} 压缩后的代码
         */
        CompressCode(code) {
            // 首先转义字符串中的内容，避免误删
            const stringList = [];
            const protectedCode = code.replace(/'(.*?)'|"(.*?)"|`(.*?)`/g, (match) => {
                stringList.push(match);
                return `__STRING__${stringList.length - 1}__`;
            });
            // 删除单行注释
            const noCommentsCode = protectedCode.replace(/\/\/.*?[\r\n]/g, "\n").replace(/\/\*[\s\S]*?\*\//g, "");
            // 恢复字符串内容
            const finalCode = noCommentsCode.replace(/__STRING__(\d+)__/g, (_, index) => stringList[index]);
            // 删除多余的空格和换行符
            return finalCode.replace(/\s+/g, " ").trim();
        }

        /**
         * 复制数据到剪贴板
         * @param {string|HTMLElement} content - 需要复制的数据
         * @returns {Promise<boolean>} 返回复制函数的异步结果
         */
        CopyText(content) {
            return new Promise((resolve, reject) => {
                if (typeof content === "string") {
                    handleCopy(content);
                } else if (content instanceof HTMLElement) {
                    handleCopy(content.innerText);
                } else {
                    reject("不支持的数据格式，仅支持字符串和HTML元素");
                }
                function handleCopy(textToCopy) {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(textToCopy).then(() => {
                            resolve(true);
                        }).catch((error) => {
                            console.error("现代复制失败，使用旧方法");
                            fallbackCopy(textToCopy);
                        });
                    } else {
                        fallbackCopy(textToCopy);
                    }
                }
                function fallbackCopy(textToCopy) {
                    try {
                        const input = document.createElement("textarea");
                        input.value = textToCopy;
                        input.style.position = "fixed";
                        document.body.appendChild(input);
                        input.focus();
                        input.select();
                        document.execCommand("copy");
                        document.body.removeChild(input);
                        resolve(true);
                    } catch (error) {
                        reject(error);
                        console.error("旧复制方法失败", error);
                    }
                }
            })
        }

        /**
         * 格式化时间
         * @param {string} format - 时间格式，默认YYYY-MM-DD
         * @param {Date} date - 可选，传入一个时间对象
         * @returns {string} 返回格式化后的时间格式
         */
        FormatTime(format = "YYYY-MM-DD", date) {
            const time = date && new Date(date) || new Date();
            const year = time.getFullYear();
            const month = (time.getMonth() + 1).toString().padStart(2, "0");
            const day = time.getDate().toString().padStart(2, "0");
            const hour = time.getHours().toString().padStart(2, "0");
            const minute = time.getMinutes().toString().padStart(2, "0");
            const second = time.getSeconds().toString().padStart(2, "0");
            const formattedDate = format
                .replace("YYYY", year)
                .replace("MM", month)
                .replace("DD", day)
                .replace("HH", hour)
                .replace("hh", hour)
                .replace("mm", minute)
                .replace("ss", second);
            return formattedDate;
        }

        /**
         * 天数加减法
         * @param {string|Date} date - 需要运算的时间
         * @param {number} day - 需要减去的天数
         * @param {string} [format] - 时间格式，默认YYYY-MM-DD
         * @returns {string} 返回格式化后的时间格式
         */
        DiffDay(date, day, format = "YYYY-MM-DD") {
            const oldTime = new Date(date);
            oldTime.setDate(oldTime.getDate() - day);
            return this.FormatTime(format, oldTime);
        }

        /**
         * 分割时间范围为多个区间
         * @param {array} timeArr 时间范围数组，格式为 ["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD HH:mm:ss"]
         * @param {number} parts 要分割的区间数量
         * @returns 包含多个区间的数组，每个区间为 ["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD HH:mm:ss"] 格式
         */
        TimeRange(timeArr, parts) {
            const [startTime, endTime] = timeArr;
            const startSeconds = new Date(startTime).getTime() / 1000;
            const endSeconds = new Date(endTime).getTime() / 1000;
            const interval = Math.ceil((endSeconds - startSeconds) / parts); // 每个区间的秒数
            const result = [];
            for (let i = 0; i < parts; i++) {
                const rangeStart = Math.min(startSeconds + i * interval, endSeconds);
                const rangeEnd = Math.min(rangeStart + interval - 1, endSeconds);
                result.push([
                    this.FormatTime("YYYY-MM-DD HH:mm:ss", rangeStart * 1000),
                    this.FormatTime("YYYY-MM-DD HH:mm:ss", rangeEnd * 1000)
                ]);
            }
            return result;
        }

        /**
         * 获取Cookie
         * @param {string} cookieName - Cookie键名
         * @returns {string} 返回对应键值的名称
         */
        GetCookie(cookieName) {
            const cookieRegex = new RegExp("(?:(?:^|.*;\\s*)" + cookieName + "\\s*\\=\\s*([^;]*).*$)|^.*$");
            const cookieValue = document.cookie.replace(cookieRegex, "$1");
            return cookieValue;
        }

        /**
         * 复制dom元素为图片
         * @param {string|HTMLElement} element - 节点选择器字符串 或 dom元素
         * @returns {Promise<boolean>} 返回一个Promise，成功为True
         */
        CopyHtml2Img(element) {
            return new Promise(function (resolve, reject) {
                if (typeof element === "string") {
                    element = document.querySelector(element);
                }
                snapdom.toBlob(element, {
                    scale: 2, // 缩放比例,默认为1
                    type: "png"
                }).then((blob) => {
                    try {
                        const blobIMG = new ClipboardItem({ [blob.type]: blob });
                        navigator.clipboard.write([blobIMG]).then(() => {
                            resolve(true);
                        }).catch((error) => {
                            console.error("无法复制：", error);
                            reject("leave");
                        })
                    } catch (error) {
                        console.error("无法复制：", error);
                        reject(false);
                    }
                });
            })
        }

        /**
         * 跨域的网络请求
         * @param {object} config 请求配置
         * @param {string} config.url 请求地址（必选）
         * @param {string} [config.method] 请求方法（可选，如 "GET", "POST" 等）
         * @param {string|object} [config.data] 请求数据（可选，GET 通常不需要）
         * @param {object} [config.header] 请求头配置（可选，默认会带基础头信息）
         * @param {number} [config.timeout=10000] 超时时间（可选，单位 ms，默认 5000ms）
         * @param {string} [config.cookie] 携带的 Cookie 信息（可选）
         * @param {boolean} [config.anonymous=false] 是否匿名请求（可选，默认 false）
         * @param {function} [config.onprogress] 请求取得了一些进展，则执行
         * @param {function} callback 请求的回调
         * @returns {Promise<object>} 使用then方法获取结果或者await
         */
        GM_XHR({ method, url, data, header, timeout = 10000, cookie = "", anonymous = false, onprogress = () => { } }, callback = () => { }) {
            const headers = {}
            headers["Content-Type"] = "application/json";
            for (const head in header) {
                if (header.hasOwnProperty(head)) {
                    headers[head] = header[head];
                }
            }
            if (
                !!data &&
                typeof data === "object" &&
                !(data instanceof ArrayBuffer) &&
                !(data instanceof FormData) &&
                !(data instanceof URLSearchParams) &&
                !(data instanceof Blob)
            ) {
                data = JSON.stringify(data);
            }
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: method || "GET",
                    url: url,
                    data: data,
                    headers: header,
                    timeout: timeout,
                    cookie: cookie,
                    anonymous: anonymous,
                    onprogress,
                    onload: function (data) {
                        if (data.readyState == 4) {
                            callback(data);
                            resolve(data);
                        }
                    },
                    onerror: function (error) {
                        callback(error);
                        reject(error);
                    },
                    ontimeout: function (out) {
                        callback(out);
                        reject(out);
                    }
                })
            })
        }

        /**
         * XMLHttpRequest方法
         * @param {object} config - 请求配置
         * @param {string} config.url - 请求地址
         * @param {string} [config.method] - 可选，请求方法，默认GET（如 "GET", "POST" 等）
         * @param {string|object} [config.data] - 可选，请求数据（GET 通常不需要）
         * @param {object} [config.header] - 可选，请求头配置（默认会带基础头信息）
         * @param {boolean} [config.isWith=false] - 可选，是否携带 Cookie 信息（默认 false）
         * @param {function} callback - 请求的回调
         * @returns {Promise<XMLHttpRequest>} 使用then方法获取结果或者await
         */
        HTTP_XHR({ method, url, data = null, header, isWith = false, controller = () => { } }, callback = () => { }) {
            return new Promise(function (resolve, reject) {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.withCredentials = isWith;
                    xhr.open(method || "GET", url, true);
                    for (const headKey in header) {
                        if (header.hasOwnProperty(headKey)) {
                            xhr.setRequestHeader(headKey, header[headKey]);
                        }
                    }
                    // 添加信号到xhr请求
                    xhr.upload.onabort = () => {
                        reject("请求被用户取消");
                        callback("请求被取消");
                    };
                    xhr.upload.onerror = (e) => {
                        reject(e);
                        callback(e);
                    };
                    xhr.onload = function () {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.readyState === 4) {
                            resolve(xhr);
                        } else {
                            reject(xhr);
                        }
                        callback(xhr);
                    }
                    xhr.onerror = function () {
                        reject(xhr);
                        callback(xhr);
                    };
                    xhr.send(typeof data === "object" ? JSON.stringify(data) : data);
                    controller(xhr);
                } catch (err) {
                    console.error(err);
                    callback(err);
                    reject({ msg: "失败" });
                }
            })
        }

        /**
         * 等待元素出现在页面中
         * @param {string|function} nodeData - 选择器元素的名称，或者函数
         * @param {boolean} showType - 可选，是否启用窗口在前台才继续？默认关闭
         * @param {function} callback - 可选，由函数控制元素是否应该加载，无法保证返回元素，返回一个结束函数，传入true则完成等待
         * @returns {Promise<HTMLElement|null>} 返回Promise，成功则返回等待的元素
         */
        AwaitSelectorShow(nodeData, showType, callback) {
            const ObserverDOM = this.ObserverDOM;
            const config = {
                type: !showType,
                node: undefined,
                observer: null,
                over: false,
                callback: null
            }
            callback && (config.callback = callback);
            return new Promise(function (resolve, reject) {
                function _over(params) {
                    config.over = true;
                    config.node = params || null;
                    return _backRun();
                }
                queryNode();
                async function queryNode() {
                    const node = typeof nodeData === "function" ? await nodeData() : document.querySelector(nodeData);
                    if (node) {
                        if (config.callback) {
                            return config.callback(_over, node);
                        }
                        _over(node);
                    } else if (!config.observer) {
                        config.observer = ObserverDOM(queryNode).observe(document, {
                            childList: true,
                            subtree: true,
                            attributes: true
                        });
                    }
                }
                showNode();
                function showNode() {
                    const visible = document.visibilityState === "visible";
                    if (visible) {
                        document.removeEventListener("visibilitychange", showNode);
                        config.type = visible;
                        return _backRun();
                    } else if (!config.typeEvent) {
                        config.typeEvent = true;
                        document.addEventListener("visibilitychange", showNode);
                    }
                }
                function _backRun() {
                    if (!!config.over && !!config.type) {
                        config.observer && config.observer.stop();
                        resolve(config.node);
                    }
                }
            })
        }

        /**
         * 等待img加载完成
         * @param {number} time - 时间参数，单位ms，不管图片是否完成加载
         * @returns {Promise<boolean>} 返回Promise，成功则返回true
         */
        AwaitImgLoaded(time) {
            return new Promise(function (resolve, reject) {
                if (time) {
                    setTimeout(() => resolve(true), time)
                }
                const images = document.querySelectorAll("img");
                const loadedCount = [];
                for (const img of images) {
                    if (img.complete) {
                        loadedCount.push(0);
                    } else {
                        img.onload = () => {
                            loadedCount.push(0);
                            if (loadedCount.length === images.length) {
                                resolve(true);
                            }
                        }
                    }
                }
                if (loadedCount.length === images.length) {
                    resolve(true);
                }
            })
        }

        /**
         * 进行编码
         * @param {string} data - 需要编码的内容
         * @returns {{run: function, decode: function}} 返回转换的方法
         * - run() 编码
         * - decode() 解码
         */
        Encode(data) {
            return {
                run: () => {
                    const ascii = btoa(data);
                    data = encodeURIComponent(ascii);
                    return data;
                },
                decode: () => {
                    const ascii = decodeURIComponent(data);
                    data = atob(ascii);
                    return data;
                },
            }
        }

        /**
         * 获取当前网页url参数值
         * @param {null|string} name - 键值的名称 null 全部数据，string 全部字符数据
         * @param {string} text - （可选）从自定义参数结构
         * @returns {object|string|null}返回键值
         */
        GetQueryString(name, text) {
            const search = (text || window.location.href).match(/\?(.*)/);
            if (!!search && search.length > 1) {
                const urlParams = new URLSearchParams(search[1]);
                return _run(urlParams);
            }
            if (text) {
                const urlParams = new URLSearchParams(text);
                return _run(urlParams);
            }
            function _run(urlParams) {
                if (name === "string") {
                    return toData(urlParams, "str");
                }
                if (name === null || name === "null") {
                    return toData(urlParams);
                }
                return toData(urlParams)[name];
            }
            function toData(urlParams, type) {
                let urlParamsStr = "";
                const urlParamsObj = {};
                urlParams.forEach((value, key) => {
                    urlParamsObj[key] = value;
                    if (type === "str") {
                        urlParamsStr && (urlParamsStr += "&");
                        urlParamsStr += `${key}=${value}`;
                    }
                });
                return urlParamsStr || urlParamsObj;
            }
            return null;
        }

        /**
         * 更新链接参数
         * @param {string} url - 需要更新的链接
         * @param {object} params - 需要更新的数据，写成对象
         * @returns {string} 返回修改后的链接
         */
        UpdateUrlParam(url, params) {
            const urlObj = new URL(url);
            const searchParams = urlObj.searchParams;
            for (const key in params) {
                if (Object.hasOwnProperty.call(params, key)) {
                    searchParams.set(key, params[key]);
                }
            }
            urlObj.search = searchParams.toString();
            return urlObj.href;
        }

        /**
         * 气泡提示
         * @param {string} ico - 提示气泡的emoji
         * @param {string} text - 提示文字
         * @param {number} time - 气泡显示时间
         * @param {number} place - 气泡的位置，默认1，中间
         * @returns {function|{ node: HTMLElement, remove: function, open: function, text: function, ico: function}} - 返回创建的气泡，以及修改气泡位置的回调函数
         * - node 气泡元素
         * - remove(time) 移除气泡，单位秒
         * - open(element) 打开气泡到某个元素中
         * - text(data) 修改气泡文字
         * - ico(data) 修改气泡图标
         */
        MessageTip(ico, text, time, place = 1) {
            const RemoveDom = this.RemoveDom;
            if (ico === undefined) {
                let msgTip = null;
                return (ico, text, time, place) => {
                    if (msgTip && msgTip.ico) {
                        msgTip.ico(ico);
                        msgTip.text(text);
                    } else {
                        msgTip = this.MessageTip(ico, text, null, place);
                    }
                    msgTip.remove(time);
                    return msgTip;
                }
            }
            const openEnd = [
                "margin-left: 0;margin-top: 0;",//左上
                "margin-top: 0;margin-top: 0;",//居中
                "margin-right: 0;",//右上
                "margin-right: 0;margin-bottom: 0;",//右下
                "margin-left: 0;margin-bottom: 0;",//左下
            ][place];
            const middle = [
                "margin-left: 30px;margin-top: 15px;",//左上
                "margin-top: 15px;",//居中
                "margin-right: 30px;margin-top: 15px;",//右上
                "margin-right: 30px;margin-bottom: 15px;",//右下
                "margin-left: 30px;margin-bottom: 15px;",//左下
            ][place];
            const inRunFrame = this.RunFrame;
            const createTip = async (addNode) => {
                const className = "gm-message-place-" + place;
                const tipDom = addNode.querySelector(`:scope>.${className}`);
                if (tipDom) { return tipDom };
                return this.AddDOM({
                    addNode: addNode,
                    addData: [{
                        name: "div",
                        className: "gm-message " + className
                    }]
                });
            }
            const createBody = async (addNode, body) => {
                return createTip(addNode).then(tipDiv => {
                    if (body instanceof HTMLElement) {
                        tipDiv.appendChild(body);
                        display(body);
                        return body;
                    } else {
                        return this.AddDOM({
                            addNode: tipDiv,
                            addData: body
                        }).then(div => {
                            display(div);
                            return div;
                        })
                    }
                })
            }
            const msgDem = createBody(document.body, [{
                name: "div",
                className: "gm-message-main",
                style: "opacity: 1;height: 30px;",
                add: [{
                    name: "div",
                    className: "gm-message-body",
                    add: [{
                        name: "div",
                        className: "gm-message-ico",
                        innerHTML: ico
                    }, {
                        name: "div",
                        className: "gm-message-text",
                        innerHTML: typeof text === "string" ? text : "",
                        add: Array.isArray(text) ? text : [],
                    }]
                }]
            }])
            const callObj = {
                node: msgDem,
                remove: (time) => remove(time),
                open: (element) => msgDem.then(div => createBody(element, div)),
                text: (data) => editDom(data, ".gm-message-text"),
                ico: (data) => editDom(data, ".gm-message-ico")
            };
            let clearTime = null;
            time && remove(time);
            function display(div) {
                div.style = "height: auto;";
                const height = div.clientHeight;
                div.style = `opacity: 0;${openEnd}`;
                inRunFrame(() => {
                    div.style = `opacity: 1;height: ${height}px;${middle}`;
                })
            }
            async function remove(reTime = 0.6) {
                const fadeTime = 300; // 淡出动画时间
                const totalTime = reTime * 1000; // 总延迟转换为毫秒
                const fadeOutDelay = totalTime > fadeTime ? totalTime - fadeTime : 0;
                const div = await msgDem;
                clearTimeout(clearTime);
                clearTime = setTimeout(() => {
                    div.style = `opacity: 0;${openEnd}`;
                    RemoveDom(div, "all", fadeTime + 50);
                    Object.keys(callObj).forEach((key) => delete callObj[key]);
                }, fadeOutDelay);
            }
            function editDom(params, className) {
                msgDem.then(div => {
                    const textDom = div.querySelector(className);
                    if (Array.isArray(params)) {
                        textDom.innerHTML = "";
                        this.AddDOM({
                            addNode: textDom,
                            addData: params
                        })
                    } else {
                        textDom.innerHTML = params;
                    }
                })
            }
            return callObj;
        }

        /**
         * 只允许一个插件弹窗
         * @param {string} idName - 弹窗的id
         * @returns {boolean} - 是否有弹窗打开
         */
        closeDialog(idName) {
            const dialog = document.querySelectorAll("dialog");
            let isOpen = false;
            for (const item of dialog) {
                if (item.id !== idName && item.className === "gm-plug-message-box") {
                    item.close && item.close();
                } else if (item.id === idName) {
                    isOpen = true;
                }
            }
            return isOpen;
        }

        /**
         * 弹窗
         * @param {object} params -必须{ id, title, body, footer }，可选{ closeback }
         * @param {string} params.id - 弹窗的id
         * @param {string} params.title - 弹窗的标题
         * @param {object} params.body - 弹窗的内容，AddDOM的addData格式
         * @param {object} params.footer - 弹窗的底部，AddDOM的addData格式
         * @param {string} [params.style] - 弹窗的样式
         * @param {string} [params.isAutoClose] - 是否自动关闭已存在的弹窗，且有同id弹窗已打开会阻止当前弹窗，默认true
         * @param {function(HTMLElement)} params.closeback - 弹窗关闭时的回调函数，返回弹窗元素
         * @returns {Promise<{ element: HTMLElement, close: function}>} - 返回生成的元素和关闭方法
         * - element - 弹窗元素
         * - close() - 关闭弹窗
         */
        async MessageBox(params) {
            const { id, style, title, body, footer, isAutoClose = true, closeback } = params;
            if (isAutoClose && this.closeDialog(id)) {
                return false;
            };
            for (const key of ["id", "title", "body", "footer"]) {
                if (!params[key]) {
                    return console.error(`MessageBox: ${key}字段是必须的`);
                }
            }
            const AddDOM = this.AddDOM;
            const RemoveDom = this.RemoveDom;
            return AddDOM({
                addNode: document.body,
                addData: [{
                    name: "dialog",
                    id: id,
                    className: "gm-plug-message-box",
                    style: style,
                    add: [{
                        name: "div",
                        className: "title",
                        innerHTML: title
                    }, {
                        name: "div",
                        className: "body",
                        add: body
                    }, {
                        name: "div",
                        className: "footer",
                        add: footer
                    }]
                }]
            }).then((element) => {
                element.showModal && element.showModal();
                element.addEventListener("cancel", closeDdialog);
                // 关闭弹窗
                function closeDdialog() {
                    element.removeEventListener("cancel", closeDdialog);
                    RemoveDom(element, "all");
                    closeback && closeback(element);
                }
                element.close = closeDdialog;
                return { element, close: closeDdialog };
            })
        }

        /**
         * 
         * 窗口移动函数
         * @param {HTMLElement} dome - 触发的dom元素
         * @param {HTMLElement} frame - 需要变化位置的元素
         * @param {function({top, bottom, left, right})} callback - 各方向的回调事件
         * - top 顶部距离
         * - bottom 底部距离
         * - left 左侧距离
         * - right 右侧距离
         */
        WindowMove(dome, frame, callback) {
            dome.addEventListener("mousedown", function (down) {
                const diffLeft = down.clientX - frame.offsetLeft;
                const diffTop = down.clientY - frame.offsetTop;
                const innerWidth = frame.offsetParent.clientWidth;
                const innerHeight = frame.offsetParent.clientHeight;
                document.addEventListener("mousemove", setMove);
                document.addEventListener("mouseup", setOver);
                function setMove(move) {
                    const factorHeight = innerHeight - frame.offsetHeight;
                    const factorWidth = innerWidth - frame.offsetWidth;
                    const top = check(move.clientY - diffTop, factorHeight);
                    const bottom = check(factorHeight - move.clientY + diffTop, factorHeight);
                    const left = check(move.clientX - diffLeft, factorWidth);
                    const right = check(factorWidth - move.clientX + diffLeft, factorWidth);
                    function check(value, factor) {
                        if (value < 0) {
                            value = 0;
                        } else if (value > factor) {
                            value = factor;
                        }
                        return value;
                    }
                    if (move.preventDefault) {
                        move.preventDefault();
                    }
                    if (callback) {
                        callback({
                            top, bottom, left, right
                        })
                    }
                }
                function setOver() {
                    document.removeEventListener("mousemove", setMove);
                    document.removeEventListener("mouseup", setOver);
                }
            })
        }

        /**
         * 节点创建函数
         * @param {object} nodeObject - 需要创建的元素结构 { addNode, addData }
         * @param {object[]} nodeObject.addData - 元素结构，值中传入数组可解析成动态数据 [对象, 对象索引, 自定义函数]
         * @param {HTMLElement} [nodeObject.addNode] - 可选，添加到对应元素内部
         * @param {number} [index] - 可选，返回元素的配置，默认返回第一个元素，传入下标则返回指定元素，"true"为所有元素
         * @returns {Promise<HTMLElement|HTMLElement[]>} - 返回指定下标的元素（或全部）
         */
        async AddDOM({ addNode, addData }, index = 0) {
            const ObjectProperty = this.ObjectProperty;
            const All = [];
            for (const node of addData) {
                if (typeof node === "object" && node.name) {
                    const removeBackArr = [];
                    const elem = document.createElement(node.name); // 创建元素
                    elem._remove = () => {
                        removeBackArr.forEach((callback) => callback());
                        elem.remove();
                    }
                    if (!!addNode) {
                        addNode.appendChild(elem);
                    }
                    const setRule = {
                        function: async (key) => {
                            await node[key](elem);
                        },
                        click: (key) => {
                            const callback = (e) => { node[key](e, elem) };
                            elem.addEventListener("click", callback, false);
                        },
                        default: (key) => {
                            if (key !== "add") {
                                const values = node[key];
                                if (Array.isArray(values) && typeof values[0] === "object") {
                                    if (!Array.isArray(values[1])) {
                                        values[1] = [values[1]];
                                    }
                                    for (const item of values[1]) {
                                        let isAddRemove = false;
                                        ObjectProperty(values[0], item, (params) => {
                                            if (!isAddRemove) {
                                                isAddRemove = true;
                                                removeBackArr.push(params.stop);
                                            }
                                            if (typeof values[2] === "function") {
                                                return values[2](params.value, setValue);
                                            }
                                            if (params.value !== undefined && params.value !== null) {
                                                setValue(params.value);
                                            } else {
                                                setValue("");
                                            }
                                        })
                                    }
                                } else {
                                    setValue(values);
                                }
                            }
                            function setValue(value) {
                                if (elem[key] === undefined) {
                                    elem.setAttribute(key, value);
                                } else {
                                    elem[key] = value;
                                }
                            }
                        }
                    }
                    const keys = Object.keys(node);
                    for (const key of keys) {
                        if (key !== "name") {
                            const ruleBack = setRule[key];
                            if (ruleBack) {
                                await ruleBack(key);
                            } else {
                                setRule.default(key);
                            }
                        }
                    }
                    // 递归创建子元素
                    if (!!node.add && node.add.length > 0) {
                        await this.AddDOM({
                            addNode: elem,
                            addData: node.add
                        });
                    }
                    All.push(elem);
                }
            }
            if (index === true) {
                return All;
            }
            return All[index];
        }

        /**
         * 节点清除器
         * @param {HTMLElement} element - 需求移除的元素
         * @param {'all'|'child'} [type] - 可选，需要移除的选项(默认child)
         * - all 移除当前+子元素
         * - child 仅移除子元素
         * @param {number} [reTime] - 可选，延迟删除，单位ms
         */
        RemoveDom(element, type = "child", reTime) {
            if (!element) {
                return false;
            }
            function removeList(list) {
                if (list && list.children) {
                    Array.from(list.children).forEach((item) => {
                        removeList(item);
                        item._remove ? item._remove() : item.remove();
                    })
                }
            }
            function run() {
                removeList(element);
                if (type.toLowerCase() === "all") {
                    element._remove ? element._remove() : element.remove();
                }
                element = null;
            }
            if (!reTime) {
                run();
            } else {
                setTimeout(run, reTime);
            }
        }

        /**
         * 点击任意位置隐藏元素
         * @param {HTMLElement[]} domArr - 排除元素被点击不能隐藏
         * @param {HTMLElement} children - 需要隐藏的元素
         */
        DisplayWindow(domArr, children) {
            document.addEventListener("mousedown", (event) => {
                if (!event.isTrusted) {
                    return false;
                }
                const isContains = domArr.filter((list) => {
                    if (list) {
                        const isWork = list.contains(event.target);
                        return isWork;
                    }
                })
                const rect = children.getBoundingClientRect();
                const x = event.clientX;
                const y = event.clientY;
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    return false;
                } else if (isContains.length <= 0) {
                    children.style.display = "none";
                }
            });
        }

        /**
         * 对象变化监听
         * @param {object} obj - 需要监听的对象
         * @param {string} property - 监听的键名
         * @param {function({name: string, value: any, stop: function()})} callback - 变化时的回调
         * - name 变化的键名
         * - value 变化后的值
         * - stop() 停止监听该属性变化
         */
        ObjectProperty(obj, property, callback) {
            if (typeof property === "string") {
                property = [property];
            }
            const objArr = property.map((objKey) => {
                // 如果还没有为该属性创建回调数组，则初始化为空数组
                const callbacksKey = `__${objKey}_callbacks`;
                if (!obj.hasOwnProperty(callbacksKey)) {
                    Object.defineProperty(obj, callbacksKey, {
                        value: [],
                        enumerable: false,
                        writable: true
                    })
                    let value = obj[objKey];
                    Object.defineProperty(obj, objKey, {
                        get: function () {
                            return value;
                        },
                        set: function (newValue) {
                            value = newValue;
                            // 当属性值改变时，遍历并执行所有回调函数
                            obj[callbacksKey].forEach((callObj) => {
                                callObj.callback({
                                    name: objKey,
                                    value: newValue,
                                    stop: () => stop(callObj.uuid)
                                })
                            })
                        }
                    })
                }
                function stop(uuid) {
                    const taskObj = obj[callbacksKey].filter(item => item.uuid !== uuid);
                    obj[callbacksKey] = taskObj;
                }
                const callObj = { callback, uuid: crypto.randomUUID() };
                // 将新的回调添加到回调数组中
                obj[callbacksKey].push(callObj);
                // 立即执行回调函数
                callback({
                    name: objKey,
                    value: obj[objKey],
                    stop: () => stop(callObj.uuid)
                });
                // 返回当前的属性值
                return {
                    name: objKey,
                    value: obj[objKey]
                }
            })
            return objArr;
        }

        /**
         * 节流器，指定时间内频繁触发，只运行最后一次
         * @param {function} callback - 节流的回调函数
         * @param {number} delay - 节流时间
         * @returns {{time:function}|function} - 返回节流器的触发函数
         * - time(time): 更新 delay 节流时间
         */
        ThrottleOver(callback, delay) {
            let timer = null;
            function runCallback() {
                if (delay === undefined) {
                    return false;
                }
                const context = this;
                const args = arguments;
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    callback.apply(context, args);
                    timer = null;
                }, delay || 300);
            }
            runCallback.time = (time) => {
                delay = time;
            }
            return runCallback;
        }

        /**
         * 网络请求监听器
         * @param {WaylayHTTPConfig|WaylayHTTPConfig[]} params - 拦截配置数组，每个元素为一个配置对象
         * @example
         * WaylayHTTP([{
         *     method: string, // 可选，请求类型
         *     url: RegExp|string|function, // 拦截的url字符、正则、或回调函数
         *     body: RegExp|string|function, // 可选，拦截的body字符、正则、或回调函数
         *     stop: boolean, // 可选，是否拦截请求
         *     callback: function // 触发拦截/数据响应的回调
         * }]);
         * @typedef {object} WaylayHTTPConfig - 拦截配置项
         * @property {string} [method] - 可选，请求类型
         * @property {RegExp|string|function} url - 拦截的url字符、正则、或回调函数
         * @property {RegExp|string|function} [body] - 可选，拦截的body字符、正则、或回调函数
         * @property {boolean} [stop] - 可选，是否拦截请求
         * @property {function(WaylayHTTPCallback): void} callback - 触发拦截/数据响应的回调
         * @typedef {object} WaylayHTTPCallback - 回调函数参数列表
         * @property {string} type - 拦截的类型
         * @property {string} sendBody - 发送的body数据
         * @property {object} data - 响应数据
         * @property {object} openParam - open参数
         * @property {function} stop - 停止监听
         * @property {function(boolean, string): Promise<WaylayHTTPCallbackBack>} send - 手动发送请求
         * - arg0 是否允许发起方触发响应，false时，必须使用back返回数据
         * - arg1 自定义发送的body数据
         * @property {function(WaylayHTTPCallbackBack): void} back - 返回自定义数据
         * @typedef {object} WaylayHTTPCallbackBack - 返回自定义数据
         * @property {string} response - 响应数据
         */
        WaylayHTTP(params) {
            const win = unsafeWindow;
            if (!win.waylayHTTPConfig) {
                win.waylayHTTPConfig = [];
                rewriteXMLHttpRequest();
            }
            for (const list of params) {
                win.waylayHTTPConfig.push({ ...list, uuid: crypto.randomUUID() });
            }
            function rewriteXMLHttpRequest() {
                // 保存并重写xhr原型
                const xhrProto = win.XMLHttpRequest.prototype;
                const originalOpen = xhrProto.open;
                const originalSend = xhrProto.send;
                // 重写open
                xhrProto.open = function () {
                    this._waylay_openParam = [...arguments];
                    originalOpen.apply(this, arguments);
                }
                // 重写send
                xhrProto.send = function (sendBody) {
                    try {
                        const self = this;
                        const config = win.waylayHTTPConfig;
                        const stopList = [];
                        const sendConfig = { isSend: false, isOnchange: false };
                        const sendWork = () => {
                            if (self._waylay_readyState === 4) {
                                self.dispatchEvent(new Event("load"));
                            }
                            // 如果有一个onchange是false就不要复原
                            if (stopList.every(item => item.onchange) && !sendConfig.isOnchange) {
                                sendConfig.isOnchange = true;
                                if (self._waylay_onreadystatechange) {
                                    self._waylay_onreadystatechange();
                                    self._waylay_set_onreadystatechange(self._waylay_onreadystatechange)
                                }
                            }
                            // 如果有一个send是false就不要发送
                            if (stopList.every(item => item.send) && !sendConfig.isSend) {
                                sendConfig.isSend = true;
                                originalSend.apply(self, arguments);
                            }
                        };
                        for (let index = 0; index < config.length; index++) {
                            const list = config[index];
                            if (!list.method || list.method === "*" || list.method === self._waylay_openParam[0]) {
                                if (isWaylay(list, self._waylay_openParam[1], sendBody)) {
                                    const stopObj = {
                                        send: false,
                                        onchange: false,
                                    };
                                    const backData = {
                                        type: "stop",
                                        sendBody: sendBody,
                                        data: self,
                                        openParam: self._waylay_openParam,
                                        stop: () => stop(list),
                                        back: (data) => {
                                            if (list.stop) {
                                                self._waylay_backFreeData(data);
                                                stopObj.onchange = true;
                                                sendWork();
                                            }
                                        },
                                        send: (onchange) => {
                                            if (list.stop) {
                                                stopObj.send = true;
                                                stopObj.onchange = onchange === undefined ? true : onchange;
                                                sendWork();
                                                return new Promise((resolve, reject) => addLoad(resolve));
                                            }
                                        }
                                    }
                                    if (!!list.stop) {
                                        stopObj.callback = () => list.callback.bind(self)(backData);
                                        stopList.push(stopObj);
                                        continue;
                                    }
                                    addLoad(list.callback);
                                    function addLoad(callback) {
                                        function loadOver() {
                                            callback.bind(self)({ ...backData, data: self });
                                            self.removeEventListener("load", loadOver);
                                        }
                                        self.addEventListener("load", loadOver);
                                    }
                                }
                            }
                        }
                        for (let index = 0; index < stopList.length; index++) {
                            const list = stopList[index];
                            list.callback && list.callback();
                            delete list.callback;
                        }
                        sendWork();
                    } catch (error) {
                        console.error(error);
                    }
                }
                // 重写返回值
                xhrProto._waylay_backFreeData = function (backObj = {}) {
                    const xhrObj = {
                        readyState: backObj.readyState || 4,
                        status: backObj.status || 200,
                        statusText: backObj.statusText || "OK",
                        response: backObj.response || backObj.responseText || "",
                        responseText: backObj.responseText || backObj.response || "",
                    };
                    Object.keys(xhrObj).forEach((key) => {
                        this[`_waylay_${key}`] = typeof xhrObj[key] === "object" ? JSON.stringify(xhrObj[key]) : xhrObj[key];
                    });
                }
                // 对原型字段监听get set
                for (const prop of ["readyState", "status", "statusText", "response", "responseText", "onreadystatechange"]) {
                    const originalDes = Object.getOwnPropertyDescriptor(xhrProto, prop); // 原属性的描述符
                    if (!originalDes) return; // 跳过不存在的属性
                    Object.defineProperty(xhrProto, prop, {
                        get: function () {
                            if (!/^_waylay_/.test(prop) && this[`_waylay_${prop}`] && prop !== "onreadystatechange") {
                                return this[`_waylay_${prop}`];
                            }
                            return originalDes.get.call(this);
                        },
                        set: function (value) {
                            if (originalDes.set) {
                                if (prop === "onreadystatechange") {
                                    this[`_waylay_set_${prop}`] = (onValue) => {
                                        originalDes.set.call(this, onValue);
                                    };
                                    return this[`_waylay_${prop}`] = value;
                                }
                                return originalDes.set.call(this, value);
                            }
                        },
                        configurable: originalDes.configurable,
                        enumerable: originalDes.enumerable
                    });
                }
            }
            // 停止监听
            function stop(list) {
                const taskObj = win.waylayHTTPConfig.filter(item => item.uuid !== list.uuid);
                win.waylayHTTPConfig = taskObj;
            }
            // 判断是否需要拦截
            function isWaylay(obj, urlStr, bodyStr) {
                const { url, body } = obj;
                const testUrl = paramTest(url, urlStr);
                const testBody = paramTest(body, bodyStr);
                return !!testUrl && !!testBody;
            }
            function paramTest(value, data) {
                if (!value || !data) {
                    return true;
                }
                if (typeof value === "string") {
                    return data.includes(value);
                }
                if (value instanceof RegExp) {
                    return value.test(data);
                }
                if (typeof value === "function") {
                    try {
                        return value(data);
                    } catch (error) {
                        console.error(error);
                    }
                }
                return false;
            }
        }

        /**
         * setTimeOut监听器
         * @param {object[]} params - 传入一个配置对象，键名：[{ callString: function.string(), delay, callback }]
         * @param {string} params.callString - 函数字符串
         * @param {number} params.delay - 延迟时间
         * @param {function} params.callback - 回调函数
         */
        WaylaySetTimeOut(params) {
            const win = unsafeWindow;
            if (!win.waylayTimeOutConfig) {
                win.waylayTimeOutConfig = [];
                const originalSetTimeout = unsafeWindow.setTimeout;
                unsafeWindow.setTimeout = function (funback, delay) {
                    const configArr = win.waylayTimeOutConfig;
                    for (const list of configArr) {
                        if (funback.toString().includes(list.callString) && (list.delay === undefined || list.delay === delay)) {
                            function reScore() {
                                const newConfigArr = configArr.filter(item => item.delay !== list.delay && item.callString !== list.callString);
                                win.waylayTimeOutConfig = newConfigArr;
                            }
                            const config = {
                                list: configArr,
                                score: list,
                                reScore
                            }
                            list.callback({ funback, delay, config });
                            return false;
                        }
                    }
                    return originalSetTimeout(funback, delay);
                };
            }
            win.waylayTimeOutConfig.push(...params);
        }

        /**
         * JSON.parse监听器
         * @param {object} params - 配置参数
         * @param {RegExp} params.match - 正则匹配字符串
         * @param {'array'|'object'} params.type-  匹配类型
         * @param {function} params.callback - 回调函数，需要 return 返回数据（不返回则使用原数据）
         * - data 命中规则的数据
         * - config 监听的配置
         * - stop() 停止监听
         */
        WaylayJsonParse(params) {
            const parse = unsafeWindow.JSON.parse;
            unsafeWindow.JSON.parse = function (...args) {
                const data = parse(...args);
                const list = params;
                if (list.type === "array" && !Array.isArray(data)) {
                    return data;
                }
                if (list.type === "object" && typeof data !== "object") {
                    return data;
                }
                if (!list.match || list.match.test(args)) {
                    const config = {
                        waylay: list
                    };
                    return list.callback({
                        data, config,
                        stop() {
                            unsafeWindow.JSON.parse = parse;
                        }
                    }) || data;
                }
                return data;
            };
        }

        /**
         * 导出为EXCEl文件
         * @param {string} excelName - 文件名称
         * @returns {{play:function, sheet:function}} - 回调方法 { play, sheet }
         * - play(data, sheetName) 开始执行导出
         * - sheet([{ sheetData, sheetName }]) 多Sheet导出
         */
        ExportToExcel(excelName) {
            // 创建工作簿对象
            const workbook = XLSX.utils.book_new();
            // 添加数据到表
            function pushData(data, sheetName = "数据") {
                // 创建一个工作表
                const worksheet = XLSX.utils.json_to_sheet(data);
                // 将工作表添加到工作簿
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            }
            // 导出Excel文件
            function download(downName = excelName) {
                const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
                const excelData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(excelData);
                link.download = downName || "data.xlsx";
                link.click();
                link.remove();
            }
            /**
             * 下载数据
             * @param {object} data 表数据
             * @param {string} sheetName Sheet名称
             */
            function play(data, sheetName) {
                pushData(data, sheetName);
                download();
            }
            /**
             * 多Sheet下载
             * @param {object[]} params 表数据参数[{ sheetData, sheetName }]
             */
            function sheet(params) {
                for (const list of params) {
                    const { sheetData, sheetName } = list;
                    pushData(sheetData, sheetName);
                }
                download();
            }
            return { play, sheet }
        }

        /**
         * 异步队列并发管理器
         * @param {number} maxRun - 并发数量，默认1个
         * @param {number} maxRetry - 错误最大运行次数，默认1次，使用catch捕获的错误，请在函数抛出错误
         * @returns {{push:function, stop:function, play:function, endBack:function, errorBack:function}} - 回调方法 { push, stop, play, endBack, errorBack }
         * - push(task) 添加任务，task为异步函数，返回Promise
         * - stop() 停止运行
         * - play() 继续运行
         * - endBack(callback) 设置完成后的回调
         * - errorBack(callback) 设置错误后的回调
         */
        QueueTaskRunner(maxRun = 1, maxRetry = 1) {
            const params = {
                isRun: false, // 是否运行
                isStop: false, // 终止
                maxRun, // 最大并发数
                maxRetry, // 最大并发数
                running: 0, // 当前正在执行的请求数
                runCallback: [], // 请求的数据，队列
                endCallback: () => { }, // 完成后的回调
                errCallback: () => { } // 执行中途错误的回调
            }
            const RunFrame = this.RunFrame;
            async function _run() {
                while (!params.isStop && params.running < params.maxRun && params.runCallback.length > 0) {
                    const task = params.runCallback.shift();
                    params.running++;
                    _executeTask(task);
                }
            }
            async function _executeTask(task, attempt = 1) {
                const { callback, resolve, reject } = task;
                callback().then(result => {
                    resolve(result);
                    _taskCompleted();
                }).catch(error => {
                    if (attempt < params.maxRetry) {
                        console.error("队列重试:", attempt, error);
                        _executeTask(task, attempt + 1);
                    } else {
                        console.error("Task Error:", error);
                        params.errCallback(error);
                        reject(error);
                        _taskCompleted();
                    }
                });
            }
            function _taskCompleted() {
                params.running--;
                _run();
                RunFrame(_runEnd);
            }
            async function _runEnd() {
                if (params.isRun && !params.isStop && params.running === 0 && params.runCallback.length === 0) {
                    params.isRun = false;
                    params.endCallback();
                }
            }
            const functionAll = {
                /**
                 * 添加队列函数
                 * @param {function} callback 函数
                 * @returns 返回执行结果 - Promise
                 */
                push(callback) {
                    params.isRun = true;
                    return new Promise((resolve, reject) => {
                        params.runCallback.push({ callback, resolve, reject });
                        _run();
                    });
                },
                /**
                 * 终止队列
                 */
                stop() {
                    params.isStop = true;
                },
                /**
                 * 开始队列
                 */
                play() {
                    params.isStop = false;
                    _run();
                },
                /**
                 * 队列完成的回调
                 * @param {function} callback 函数
                 * @returns 返回所有方法
                 */
                endBack(callback) {
                    params.endCallback = callback;
                    _runEnd();
                    return functionAll;
                },
                /**
                 * 队列错误的回调
                 * @param {function} callback 函数
                 * @returns 返回所有方法
                 */
                error(callback) {
                    params.errCallback = callback;
                    return functionAll;
                }
            }
            return functionAll;
        }

        /**
         * 页面渲染时运行函数
         * @param {function} callback - 回调函数
         * @param {number} index - 运行帧，默认直接（0）
         */
        RunFrame(callback, index = 0) {
            return new Promise((resolve, reject) => {
                let count = 0;
                function frame() {
                    if (count === index || index < 0) {
                        resolve(callback());
                    } else if (count < index) {
                        count++;
                        requestAnimationFrame(frame);
                    } else {
                        reject(new Error("Index超过帧数"));
                    }
                }
                requestAnimationFrame(frame);
            })
        }

        /**
         * 输入文本验证器
         * @param {string} text - 需要匹配的按键
         * @param {function} callback - 成功的回调函数
         * @param {boolean} isMany - 是否允许多次触发？默认只触发一次
         */
        InputAuth(text, callback, isMany) {
            text = text.toUpperCase();
            let input = "";
            document.addEventListener("keydown", isText);
            function isText({ key, target }) {
                if (["input", "textarea", "select"].includes(target.tagName.toLowerCase())) {
                    return false;
                }
                if (!key || key.length !== 1) {
                    return false;
                }
                const strUp = key.toUpperCase();
                if (strUp === text[input.length]) {
                    input += strUp;
                } else {
                    input = strUp === text[0] ? strUp : "";
                }
                if (input === text) {
                    callback();
                    if (!isMany) {
                        document.removeEventListener("keydown", isText);
                    }
                }
            }
        }

        /**
         * 同域跨标签通信
         * @param {string} cName - 频道名称
         * @returns {{postMessage:function, callback:function, callbackError:function, close:function}} - 上下文方法
         * - postMessage(params) 发送消息
         * - callback(callback) 接收消息
         * - callbackError(callback) 接收错误消息
         * - close() 关闭频道
         */
        WebLocalMessage(cName) {
            const channel = new BroadcastChannel(cName);
            const backModel = {
                postMessage: (params) => {
                    channel.postMessage(params);
                    return backModel;
                },
                callback: (callback) => {
                    channel.addEventListener("message", callback);
                    return backModel;
                },
                callbackError: (callback) => {
                    channel.addEventListener("messageerror", callback);
                    return backModel;
                },
                close: () => {
                    channel.close();
                }
            }
            return backModel;
        }

        /**
         * 元素变化观察器         * 
         * @param {function} runback 需要运行的回调（mutation）
         * @returns {{observe:ObserveMethod, stop:function, callback:function}} - 返回实例功能
         * - observe(element, config) 开始观察
         * - stop() 停止观察
         * - callback(callback) 回调函数
         * @typedef {(element: HTMLElement, config: ObserveConfig) => void} ObserveMethod
         * @typedef {object} ObserveConfig
         * @property {boolean} config.attributes - 监视属性的变化
         * @property {boolean} config.childList - 监视子节点的变化
         * @property {boolean} config.subtree - 监视整个子树
         * @property {boolean} config.characterData - 监视节点内容或文本的变化
         * @property {boolean} config.attributeOldValue - 记录属性变化前的值
         * @property {boolean} config.characterDataOldValue - 记录文本内容变化前的值
         */
        ObserverDOM(runback = () => { }) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(runback);
            })
            const result = {
                /**
                 * 开始观察元素变化
                 * @param {*} element 观察的元素
                 * @param {*} config 观察配置
                 * @returns 返回实例功能
                 */
                observe: (element, config) => {
                    observer.observe(element, config);
                    return result;
                },
                stop: () => {
                    observer.disconnect();
                    return result;
                },
                callback: (callback) => {
                    runback = callback;
                    return result;
                }
            }
            return result;
        }
    }
    // uuid函数覆盖
    crypto.randomUUID = crypto.randomUUID || (() => {
        // RFC4122 version 4 form
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })
    })
    // 气泡消息
    GM_addStyle(`
        .gm-message {
            position: fixed;
            display: flex;
            z-index: 2000000;
            pointer-events: none;
            font-size: 16px;
        }
        .gm-message-place-0,
        .gm-message-place-2 {
            top: 0;
            left: 0;
            flex-direction: column;
        }
        .gm-message-place-2 {
            right: 0;
        }
        .gm-message-place-3,
        .gm-message-place-4 {
            bottom: 0;
            left: 0;
            flex-direction: column-reverse;
            margin-bottom: 30px;
        }
        .gm-message-place-3 {
            right: 0;
        }
        .gm-message-place-1 {
            top: 0;
            left: 0;
            right: 0;
            align-items: center;
            flex-direction: column;
        }
        .gm-message-main {
            opacity: 0;
            margin: auto;
            height: 0;
            transition: 0.3s;
            overflow: hidden;
            border-radius: 6px;
            box-shadow: 0 1px 6px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
        }
        .gm-message-body {
            display: flex;
            padding: 12px 12px;
            text-align: center;
            line-height: 1;
            color: #000000;
            background: #ffffff;
            pointer-events: auto;
            user-select: text;
        }
        .gm-message-ico,
        .gm-message-text {
            top: 0;
            bottom: 0;
            margin: auto;
            padding: 0 5px;
        }
        .gm-message-text {
            font-size: 16px;
            line-height: 1.2;
        }
    `)
    // 弹窗
    GM_addStyle(`
        .gm-plug-message-box {
            width: 500px;
            border-radius: 10px;
            border-width: 1px;
            border-color: #bbbbbb;
            display: flex;
            align-items: flex-end;
            flex-direction: column;
            overflow: hidden;
            color: rgba(0,0,0,0.9);
            padding: 20px;
            outline: none;
            margin: auto;
            font-size: 14px;
            min-height: 50px;
        }
        .gm-plug-message-box::backdrop {
            background: rgba(0,0,0,0.2);
        }
        .gm-plug-message-box .title {
            width: 100%;
            font-size: 20px;
            text-align: center;
            font-weight: bold;
            min-height: 50px;
        }
        .gm-plug-message-box .body {
            width: 100%;
            height: calc(100% - 50px - 40px);
        }
        .gm-plug-message-box .footer {
            width: 100%;
            min-height: 40px;
            gap: 30px;
            display: flex;
            justify-content: center;
            align-items: flex-end;
        }
        /*滚动条样式*/
        .gm-plug-message-box ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        .gm-plug-message-box ::-webkit-scrollbar-track-piece {
            background-color: rgba(0,0,0,0);
        }
        .gm-plug-message-box ::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background-color: rgba(160,169,173,0.45);
        }
        .gm-plug-message-box ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(160,169,173,0.8);
        }
    `)
    const plug = new Plug_Plug();
    Plug_fnClass = () => plug;
    return plug;
}

// 版本控制器
function Plug_versionPlug() {
    const { GM_XHR, GET_DATA, SET_DATA, MessageTip } = Plug_fnClass();
    const gmConfig = GET_DATA("GM_CONFIG", {});
    const plugName = GM_info.script.name;
    const version = GM_info.script.version;
    const plugId = "555602";
    const getMetaUrl = `https://www.cdzero.cn/greasyfork/${plugId}/${plugName}.meta.js`;
    const plugUpDateUrl = `https://www.cdzero.cn/greasyfork/${plugId}/${plugName}.user.js`;
    const plugVersionsUrl = `https://www.cdzero.cn/greasyfork/versions/${plugId}-${plugName}`;
    const newMessageTip = (...args) => {
        const messageBox = document.querySelector(".gm-plug-message-box");
        if (messageBox) {
            MessageTip(...args).open(messageBox);
        } else {
            MessageTip(...args);
        }
    }
    const config = {
        loading: null,
    };
    document.upDatePlug = () => {
        if (!!config.loading) {
            return newMessageTip("❌", "新版插件下载中，请稍后...", 3);
        }
        const toTime = (new Date()).getTime();
        config.loading = window.open(plugUpDateUrl + "?time=" + toTime, "", "", true);
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "visible") {
                location.reload();
            }
        })
    }
    function clickPlug(click) {
        if (config.innerText === "有更新") {
            return document.upDatePlug();
        }
        if (config.innerText === "检测中") {
            return newMessageTip("❌", "正在检测中，请稍后...", 3);
        }
        config.style = "color: red;";
        config.innerText = "检测中";
        return updatesPlug(click);
    }
    function checkPlug(obj, click) {
        if (!obj) {
            isNew();
            return newMessageTip("❌", `${plugName}检测更新失败！`, 3);
        }
        const oldVer = Number(version.replace(/[\s.]+/g, ""));
        const newVer = Number(obj.plugver.replace(/[\s.]+/g, ""));
        if (!!obj.plugver && newVer > oldVer) {
            isUpdata();
            newMessageTip("❌", `${plugName}发现新的版本：${obj.plugver} <a style="color: #1890ff;cursor: pointer;" onclick="document.upDatePlug();">更新助手</a>`, 6);
        } else if (!!obj.plugver) {
            isNew();
            !!click && newMessageTip("✔️", `${plugName}已经是最新版本！`, 3);
        }
        function isNew() {
            config.style = "";
            config.innerText = "最新版";
        }
        function isUpdata() {
            config.style = "color: red;";
            config.innerText = "有更新";
        }
    }
    function updatesPlug(click) {
        const toTime = (new Date()).getTime();
        if (!gmConfig.plugver || toTime - gmConfig.plugtime >= 1000 * 60 * 60 * 12 || !!click) {
            GM_XHR({
                method: "GET",
                url: getMetaUrl + "?time=" + toTime,
                timeout: 10000
            }).then((xhr) => {
                const regex = /\/\/\s*@version\s*(\d+\.\d+\.\d+)/g;
                const newVer = regex.exec(xhr.responseText)[1];
                gmConfig.plugtime = toTime;
                gmConfig.plugver = newVer;
                checkPlug(gmConfig, true);
            }).catch(() => {
                checkPlug(null, true);
            }).finally(() => {
                SET_DATA("GM_CONFIG", gmConfig);
            })
        } else {
            checkPlug(gmConfig);
        }
    }
    clickPlug();
    // 插件信息
    GM_addStyle(`
        #MyPlugVer {
            padding-bottom: 3px;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #MyPlugVer #click {
            cursor: pointer;
            color: green;
        }
        #MyPlugVer a,
        #MyPlugVer span {
            border-radius: 3px;
            padding: 2px 3px;
            line-height: 1;
            transition: 0.3s ease-in-out;
        }
        #MyPlugVer a:hover,
        #MyPlugVer #click:hover {
            background: #F44336 !important;
            color: #fff !important;
            user-select: none;
        }
    `)
    return [{
        name: "div",
        id: "MyPlugVer",
        add: [{
            name: "span",
            innerHTML: `V${version}`
        }, {
            name: "span",
            id: "click",
            style: [config, "style"],
            innerText: [config, "innerText"],
            click: () => {
                clickPlug(true);
            }
        }, {
            name: "a",
            href: plugVersionsUrl,
            target: "_blank",
            innerHTML: "版本信息"
        }]
    }];
}

/**
 * 对比高亮配置差异
 * @param {array} config1 旧配置
 * @param {array} config2 新配置
 * @return {array} 差异配置
 */
function HighlightDiff(config1, config2) {
    const data = [];
    const runDiff = (params1, params2, type) => {
        for (const list of params1) {
            const find = params2.find((item) => item.uuid && item.uuid === list.uuid);
            if (find) {
                const diffValue = [];
                for (const value of list.value) {
                    if (!find.value.includes(value)) {
                        diffValue.push(value);
                    }
                }
                if (diffValue.length > 0) {
                    data.push({ data: { ...list, value: diffValue }, type: `${type}-VALUE` });
                }
            } else {
                data.push({ data: list, type: `${type}-GROUP` });
            }
        }
    }
    runDiff(config2, config1, "ADD");
    runDiff(config1, config2, "DEL");
    return data;
}

// 获取配置
async function HighlightGetData(callback) {
    if (document.visibilityState !== "visible") {
        return false;
    }
    const { GM_XHR, SwitchRead, SwitchWrite, MessageTip } = Plug_fnClass();
    const lightConfig = SwitchRead("highlight");
    return GM_XHR({
        url: unsafeWindow.ymfApiOrigin + "/api/ymf/config",
        method: "POST",
        data: { type: "GET", name: "ymf-highlight" }
    }).then(({ response }) => {
        const content = JSON.parse(response);
        if (content.data) {
            const colorObj = Array.isArray(lightConfig.default) ? Object.fromEntries(lightConfig.default.map(item => [item.name, { color: item.color, isFree: !!item.isFree }])) : {};
            if (content.data.default && content.data.default.length > 0) {
                lightConfig.default = content.data.default.map((item) => ({ ...item, color: colorObj[item.name]?.color || lightConfig.color, isFree: !!colorObj[item.name]?.isFree }));
            }
            if (content.data.value && content.data.value.length > 0) {
                lightConfig.value = content.data.value;
            }
            // 保存配置
            SwitchWrite("highlight", lightConfig);
            return content.data;
        }
    }).catch((error) => {
        console.error(error);
        const msg = ["❌", "获取配置失败，使用本地配置", 3];
        if (callback) {
            callback(msg);
        } else {
            MessageTip(...msg);
        }
    });
}

// 制作正则表达式
function HighlightMarkRegex() {
    const { SwitchRead } = Plug_fnClass();
    const lightConfig = SwitchRead("highlight");
    const keyMap = {};
    const auto = lightConfig.default || [];
    const value = lightConfig.value || [];
    // 构建键值对映射（忽略大小写）
    [...auto, ...value].forEach((item) => {
        item.value && item.value.forEach((key) => {
            const lowerKey = key.toLowerCase();
            if (!keyMap[lowerKey]) {
                keyMap[lowerKey] = { name: item.name, color: item.color };
            }
        });
    });
    const valueKey = Object.keys(keyMap);
    if (valueKey.length <= 0) {
        return false;
    }
    valueKey.sort((a, b) => b.length - a.length); // 优先匹配长字符
    const joinText = "gm-highlight" + crypto.randomUUID();
    const regexText = valueKey.join(joinText).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(new RegExp(joinText, "g"), "|");
    const regex = new RegExp(regexText, "gi"); // 构建正则表达式
    return {
        keyMap,
        regex
    }
}

// 工作页
async function Plug_highlight() {
    Plug_Components();
    const { ObserverDOM, SwitchRead, ThrottleOver, AwaitSelectorShow } = Plug_fnClass();
    await AwaitSelectorShow("div");
    // 文字高亮
    const lightConfig = SwitchRead("highlight");
    if (!lightConfig.state) {
        return false;
    }
    function areRegExpsEqual(reg1, reg2) {
        if (!(reg1 instanceof RegExp) || !(reg2 instanceof RegExp)) {
            return false;
        }
        // 比较模式
        if (reg1.source !== reg2.source) {
            return false;
        }
        // 比较修饰符（i: 忽略大小写, g: 全局匹配, m: 多行模式, u: Unicode, y: 粘性匹配）
        const flags = ["i", "g", "m", "u", "y"];
        return flags.every(flag => reg1.hasOwnProperty(flag) === reg2.hasOwnProperty(flag));
    }
    let isGet = false;
    async function getConfig() {
        if (!isGet) {
            isGet = true;
            await HighlightGetData();
            isGet = false;
        }
    }
    getConfig();
    setInterval(getConfig, 1000 * 60);
    let oldRegex = null;
    function highlightKeywords() {
        const { keyMap, regex } = HighlightMarkRegex();
        const reRun = areRegExpsEqual(oldRegex, regex);
        oldRegex = regex;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        const excluDom = [
            document.body.querySelector(".gm-tooltip-info"),
            document.body.querySelector("#plug-setting"),
            ...document.body.querySelectorAll("script"),
            ...document.body.querySelectorAll("style")
        ];
        function isChildOfAny(parents, child) {
            return parents.some(parent => parent && parent !== child && parent.contains(child));
        }
        function mergeTextNodes(node, index = 0) {
            while (index < node.childNodes.length - 1) {
                const current = node.childNodes[index];
                const next = node.childNodes[index + 1];
                if (current.nodeType === Node.TEXT_NODE && next.nodeType === Node.TEXT_NODE) {
                    current.textContent += next.textContent;
                    node.removeChild(next);
                } else {
                    index++;
                }
            }
        }
        let textNode = null;
        const removeHighlight = [];
        while ((textNode = walker.nextNode()) !== null) {
            const originalText = textNode.nodeValue;
            if (!regex) {
                continue;
            }
            if ((originalText === textNode["_lightValue"] && !reRun) || isChildOfAny(excluDom, textNode) || originalText === "") {
                continue;
            }
            const parentNode = textNode.parentNode || { insertBefore() { } };
            const classList = parentNode.classList || [];
            const isHighlight = classList.contains("gm-highlight");
            // 使用 replace() 方法，在匹配到的关键字前后添加 <span> 元素并设置样式
            const highlightText = originalText.replace(regex, function (match) {
                return `<em class="gm-highlight" msg-tip="${keyMap[match.toLowerCase()].name}" style="background: ${keyMap[match.toLowerCase()].color || lightConfig.color}">${match}</em>`;
            });
            textNode["_lightValue"] = originalText;
            if (highlightText === originalText && isHighlight) {
                removeHighlight.push({ parentNode, originalText });
            }
            if (highlightText !== originalText && !isHighlight) {
                textNode.nodeValue = "";
                const newNode = document.createElement("span");
                newNode.innerHTML = highlightText;
                while (newNode.firstChild) {
                    parentNode.insertBefore(newNode.firstChild, textNode);
                }
                newNode.remove();
            }
        }
        removeHighlight.forEach(({ parentNode, originalText }) => {
            const parent = parentNode.parentNode;
            const text = document.createTextNode(originalText);
            parent && parent.replaceChild(text, parentNode);
            parent && mergeTextNodes(parent);
        });
    }
    // const highlightThrottleOver = ThrottleOver(highlightKeywords, 100);
    // MutationObserver监视器
    // const observer = ObserverDOM((mutation) => {
    //     if (mutation.type === "childList") {
    //         highlightThrottleOver();
    //     }
    // })
    // const container = document.body;
    // 配置观察器选项
    // const config = { childList: true, subtree: true };
    // observer.observe(container, config);
    // 无限循环调用
    function runInterval() {
        highlightKeywords();
        setTimeout(runInterval, 500);
    }
    runInterval();
}

function Plug_highlightCanvas() {
    const { SwitchRead } = Plug_fnClass();
    const userNameHtml = SwitchRead("User-Name-HTML");
    if (!userNameHtml.state) {
        return false;
    }
    class CanvasTextMerger {
        constructor() {
            this.fontSizeThreshold = 20; // 仅>=20px的行才渲染
        }
        // 添加字符到缓存，触发行合并判断
        addChar(text, x, y, font, canvas) {
            const fontSize = this.parseFontSize(font);
            if (fontSize < this.fontSizeThreshold) {
                return false;
            }
            if (!canvas._textMergerConfig) {
                canvas._textMergerConfig = {
                    elements: [],
                    currentLine: [],
                    throttleTime: null,
                };
            }
            const config = canvas._textMergerConfig;
            const data = {
                x: x, // 行的起始X坐标（第一个字符的X）
                y: y, // 行的Y基线
                chars: [], // 字符数组
                font: font, // 行的字体
                fontSize: fontSize,
            };
            let find = config.currentLine.find((item) => item.y === data.y && item.font === data.font);
            if (!find) {
                find = data;
                config.currentLine.push(data);
            }
            if (find.x === x) {
                find.chars = [];
            }
            find.chars.push({ text, x, y });
            this.throttleRun(canvas);
        }
        // 节流运行
        throttleRun(canvas) {
            const config = canvas._textMergerConfig;
            clearTimeout(config.throttleTime);
            config.throttleTime = setTimeout(() => {
                this.renderCurrentLine(canvas);
            }, 100);
        }
        // 解析字号
        parseFontSize(fontStr) {
            const fontSizeMatch = fontStr.match(/(\d+(\.\d+)?)(px|em|rem|pt|%)/);
            if (!fontSizeMatch) return 0;
            const [, value, , unit] = fontSizeMatch;
            const numValue = parseFloat(value);
            const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            switch (unit) {
                case "px": return numValue;
                case "em": case "rem": return numValue * rootFontSize;
                case "pt": return numValue * 1.333;
                case "%": return numValue * 0.01 * 16;
                default: return numValue;
            }
        }
        // 获取文字尺寸等信息
        measureText(font, text) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            ctx.font = font;
            const data = ctx.measureText(text);
            canvas.remove();
            return data;
        }
        // 渲染当前行（合并字符为一个div）
        renderCurrentLine(canvas) {
            const { elements, currentLine } = canvas._textMergerConfig;
            // 找到Canvas容器
            const wrapper = canvas.parentElement;
            if (!wrapper) {
                return;
            }
            wrapper.className = "gm-canvas-overlay";
            for (const { x, y, chars, font, fontSize } of currentLine) {
                // 合并字符为整行文本
                const fullText = chars.map((char) => char.text).join("");
                if (!fullText) return;
                // 是否已存在，不存在则创建
                const key = `${fullText}-${x}-${y}-${font}`;
                const elData = elements.find((data) => data.key === key) || {
                    key: key,
                };
                if (!elData.element) {
                    elData.element = document.createElement("div");
                    elData.element.className = "gm-canvas-overlay-text";
                    elData.element.textContent = fullText;
                    elements.push(elData);
                }
                const textEl = elData.element;
                if (!wrapper.contains(textEl)) {
                    wrapper.appendChild(textEl);
                }
                textEl.style.setProperty("--gm-line-height", `${fontSize + 4}px`, "important");
                // 同步样式+计算偏移
                textEl.style.font = font;
                textEl.offsetHeight; // 强制重排
                // 基于Canvas上下文计算基线偏移
                const metrics = this.measureText(font, fullText);
                const textAscent = metrics.actualBoundingBoxAscent;
                textEl.style.left = `${x}px`;
                textEl.style.top = `${y - textAscent}px`;
            }
        }
    }
    const textMerger = new CanvasTextMerger();
    // 保存原始的fillText方法
    const originalFillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, x, y) {
        const font = this.font;
        const canvas = this.canvas;
        originalFillText.apply(this, arguments);
        textMerger.addChar(text, x, y, font, canvas);
    };
    GM_addStyle(`
        .gm-canvas-overlay {
            position: relative;
            display: inline-block;
        }
        .gm-canvas-overlay-text {
            position: absolute;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            line-height: var(--gm-line-height) !important;
            vertical-align: baseline !important;
            white-space: nowrap !important;
            pointer-events: none !important;
            color: rgba(0,0,0,0);
            z-index: 10;
            transform: translate(-2px, -2px);
        }
        .gm-canvas-overlay-text:has(.gm-highlight){
            pointer-events: auto !important;
        }
    `);
}

// 设置样式
function CSS_settingPage() {
    // 设置模态框样式
    GM_addStyle(`
        #plug-setting * {
            -webkit-box-sizing: border-box; /* 兼容早期 WebKit 浏览器 */
            -moz-box-sizing: border-box;    /* 兼容早期 Firefox 浏览器 */
            box-sizing: border-box;         /* 标准属性（现代浏览器） */
        }
        #plug-setting .active {
            color: rgba(0, 0, 0, 0.9);
        }
        #plug-setting {
            height: 75%;
            min-height: 600px;
            width: 50%;
            min-width: 800px;
        }
        #plug-setting #menu {
            width: 100%;
            height: 100%;
            display: flex;
        }
        #plug-setting #menu-list {
            width: 110px;
            min-width: 110px;
            padding-right: 10px;
            user-select: none;
        }
        #plug-setting #menu-list div {
            font-size: 14px;
            padding: 15px 0;
            background: #eeeeee;
            border-radius: 5px;
            line-height: 1;
            margin-bottom: 10px;
            text-align: center;
            cursor: pointer;
            transition: 0.25s;
        }
        #plug-setting #menu-list div:hover {
            background: #dddddd;
        }
        #plug-setting #menu-list div:active {
            background: #cccccc;
        }
        #plug-setting #menu-list .active {
            color: #ffffff;
            background: #4296f4 !important;
        }
        #plug-setting #page {
            width: 100%;
            overflow: hidden;
            border-radius: 3px;
            position: relative;
        }
        #plug-setting #page::before,
        #plug-setting #page::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            height: 0px;
            transition: 0.25s;
        }
        #plug-setting #page::before {
            top: 0;
            background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0));
        }
        #plug-setting #page::after {
            bottom: 0;
            background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.1));
        }
        #plug-setting #page.shadow-top::before,
        #plug-setting #page.shadow-bottom::after {
            height: 15px;
        }
        #plug-setting #page-list {
            height: 100%;
            overflow-x: auto;
            display: none;
            outline: none;
        }
        #plug-setting #page-list.active {
            gap: 20px;
            display: flex;
            flex-direction: column;
        }
        #plug-setting #page-item {
            padding: 0 10px;
            display: flex;
            flex-direction: column;
        }
        #plug-setting #page-item .plug-center {
            display: flex;
            align-items: center;
        }
        #plug-setting #page-item label {
            margin-right: 10px;
        }
        #plug-setting #page-item #label {
            font-size: 16px;
            font-weight: bolder;
        }
        #plug-setting #page-item #info {
            margin-top: 5px;
            color: rgba(0,0,0,0.65);
        }
        #plug-setting #page-item #password {
            padding: 3px 8px;
            border: 1px solid #bbbbbb;
            border-radius: 5px;
            transition: 0.25s;
            display: flex;
            align-items: center;
        }
        #plug-setting #page-item #password:hover {
            border-color: #40a9ff;
        }
        #plug-setting #page-item #password input {
            border: none;
            outline: none;
            padding: 0;
            font-size: 13px;
        }
        #plug-setting #page-item #password span {
            display: flex;
            cursor: pointer;
            margin-left: 5px;
            user-select: none;
        }
        #plug-setting #page-item #password svg {
            fill: #bbbbbb;
            transition: 0.25s;
        }
        #plug-setting #page-item #password svg:hover {
            fill: #40a9ff;
        }
        #plug-setting #debug {
            display: none;
        }
        #page-highlight {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        #page-textarea {
            display: flex;
            justify-content: center;
            height: 100%;
            gap: 10px;
            padding-left: 10px;
        }
    `)
    // 设置代码编辑器样式
    GM_addStyle(`
        .gm-code-page {
            width: 100%;
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .gm-code {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        .gm-code textarea {
            width: 100%;
            height: 100%;
        }
        .gm-code>.CodeMirror {
            width: 100%;
            height: 100%;
            border-radius: 5px;
        }
        .gm-code * {
            scroll-behavior: unset !important;
            font-family: Consolas, "Source Han SerifCN", Georgia, Times, "SimSun" !important;
        }
        .CodeMirror-scrollbar-filler {
            display: none !important;
        }
    `)
    // 倍速选项样式
    GM_addStyle(`
        .switch-video-rate-list {
            gap: 5px;
            display: flex;
            flex-direction: column;
            align-items: flex-start !important;
        }
        .switch-label-size-item,
        .switch-video-rate-item {
            gap: 5px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
        }
        .switch-label-size-item>span,
        .switch-video-rate-item>span {
            width: 45px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            background: #eeeeee;
            border-radius: 4px;
            cursor: pointer;
            user-select: none;
            transition: 0.25s;
        }
        .switch-label-size-item>span {
            width: 60px;
            height: 28px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .switch-label-size-item>span:hover,
        .switch-video-rate-item>span:hover {
            background: #dddddd;
        }
        .switch-label-size-item>span:active,
        .switch-video-rate-item>span:active {
            background: #cccccc;
        }
        .switch-label-size-item>span.true,
        .switch-video-rate-item>span.true {
            background: #aaaaaa;
            color: #ffffff;
        }
    `)
    const codemirrorCSS = GM_getResourceText("codemirrorCSS");
    const codemirrorTheme = GM_getResourceText("codemirrorTheme");
    GM_addStyle(codemirrorCSS);
    GM_addStyle(codemirrorTheme);
}

// 全局样式
function CSS_mainPage() {
    // 全局高亮
    GM_addStyle(`
        .gm-highlight,
        .gm-highlight-light {
            color: #ffffff !important;
            border-radius: 4px;
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
            padding: 0px 2px;
            display: inline-block !important;
            background: #ffb300;
            text-indent: 0;
            font-style: normal;
            flex: none !important;
        }
    `)
    // 全局input样式
    GM_addStyle(`
        .gm-input {
            padding: 3px 8px;
            border: 1px solid #bbbbbb;
            border-radius: 5px;
            outline: none;
            transition: border-color 0.25s;
            color: #333333;
        }
        .gm-input:hover {
            border-color: #40a9ff;
        }
        .gm-input:focus-visible {
            border-color: #ff0000;
        }
        .gm-input[disabled] {
            cursor: not-allowed;
            background: #f8f8f8;
            color: #888888;
        }
    `);
    // 全局textarea样式
    GM_addStyle(`
        .gm-textarea {
            width: 100%;
            height: 100%;
            padding: 3px;
            border-radius: 5px;
            resize: none;
            font-size: 14px;
            outline: none;
            border: 1px solid #bbbbbb;
            color: #333333;
            transition: 0.25s;
            box-sizing: border-box;
            font-family: sans-serif;
            overflow-y: auto;
            line-height: initial !important;
        }
        .gm-textarea:hover {
            border-color: #40a9ff;
        }
        .gm-textarea:focus-visible {
            border-color: #ff0000;
        }
        .gm-textarea[disabled] {
            cursor: not-allowed;
            background: #f8f8f8;
            color: #888888;
        }
    `);
    // 全局checkbox样式
    GM_addStyle(`
        .gm-switch {
            --button-width: 40px;
            --button-height: 20px;
            --toggle-diameter: 16px;
            --loading-diameter: 14px;
            --button-toggle-offset: calc((var(--button-height) - var(--toggle-diameter)) / 2);
            --button-loading-offset: calc((var(--button-height) - var(--loading-diameter)) / 2);
            --toggle-shadow-offset: 10px;
            --toggle-wider: 20px;
            --color-grey: #cccccc;
            --color-green: #4296f4;
        }
        .gm-slider {
            display: inline-block;
            width: var(--button-width);
            height: var(--button-height);
            background-color: var(--color-grey);
            border-radius: calc(var(--button-height) / 2);
            position: relative;
            transition: 0.3s all ease-in-out;
            cursor: pointer;
            display: flex;
        }
        .gm-switch input[type="checkbox"][loading="true"] + .gm-slider::before,
        .gm-slider::after {
            content: "";
            display: inline-block;
            border-radius: calc(var(--toggle-diameter) / 2);
            position: absolute;
            transition: 0.3s all ease-in-out;
        }
        .gm-slider::after {
            width: var(--toggle-diameter);
            height: var(--toggle-diameter);
            background-color: #ffffff;
            top: var(--button-toggle-offset);
            box-shadow: var(--toggle-shadow-offset) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0,0,0,0.1);
            transform: translateX(var(--button-toggle-offset));
        }
        .gm-switch input[type="checkbox"]:checked + .gm-slider {
            background-color: var(--color-green);
        }
        .gm-switch input[type="checkbox"]:checked + .gm-slider::after {
            box-shadow: calc(var(--toggle-shadow-offset) * -1) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0,0,0,0.1);
            transform: translateX(calc(var(--button-width) - var(--toggle-diameter) - var(--button-toggle-offset)));
        }
        .gm-switch input[type="checkbox"] {
            display: none;
        }
        .gm-switch input[type="checkbox"]:active + .gm-slider::after {
            width: var(--toggle-wider);
        }
        .gm-switch input[type="checkbox"]:checked:active + .gm-slider::after {
            transform: translateX(calc(var(--button-width) - var(--toggle-wider) - var(--button-toggle-offset)));
        }
        .gm-switch input[type="checkbox"][disabled="true"] + .gm-slider {
            cursor: no-drop;
            background-color: var(--color-grey);
        }
        .gm-switch input[type="checkbox"][loading="true"] + .gm-slider::before {
            z-index: 1;
            width: var(--loading-diameter);
            height: var(--loading-diameter);
            background-color: rgba(0, 0, 0, 0);
            top: var(--button-loading-offset);
            border: 2px solid rgba(0, 0, 0, 0);
            border-top-color: #cacaca;
            --loading-transform: translateX(var(--button-loading-offset));
            transform: var(--loading-transform);
            animation: gm-switch-loading 1s linear infinite;
        }
        .gm-switch input[type="checkbox"][loading="true"]:checked + .gm-slider::before {
            --loading-transform: translateX(calc(var(--button-width) - var(--loading-diameter) - var(--button-loading-offset)));
            transform: var(--loading-transform);
        }
        @keyframes gm-switch-loading{
            0%{
                transform: var(--loading-transform) rotate(0deg);
            }
            100%{
                transform: var(--loading-transform) rotate(360deg);
            }
        }
    `)
    // 全局按钮样式
    GM_addStyle(`
        .gm-button {
            color: #ffffff;
            border: 0 solid rgba(0,0,0,0);
            outline: none;
            cursor: pointer;
            text-align: center;
            transition: ease-in 0.2s;
            user-select: none;
            position: relative;
        }
        .gm-button.disabled {
            transition: none;
            cursor: no-drop !important;
            filter: brightness(0.8) !important;
        }
        .gm-button {
            height: 32px;
            line-height: 32px;
            padding: 0 20px;
            border-radius: 5px;
        }
        .gm-button.small {
            height: 24px;
            line-height: 24px;
            padding: 0 7px;
            border-radius: 3px;
        }
        .gm-button.large {
            height: 40px;
            line-height: 40px;
            padding: 0 30px;
            border-radius: 5px;
        }
        .gm-button {
            background: #40a9ff;
        }
        .gm-button:not(.disabled):hover {
            background: #1890ff;
        }
        .gm-button:not(.disabled):active {
            background: #096dd9;
            transition: all ease-in 0.1s;
        }
        .gm-button.warning {
            background: #ffb300;
        }
        .gm-button.warning:not(.disabled):hover {
            background: #ffca28;
        }
        .gm-button.warning:not(.disabled):active {
            background: #ff8f00;
            transition: all ease-in 0.1s;
        }
        .gm-button.danger {
            background: #ff6060;
        }
        .gm-button.danger:not(.disabled):hover {
            background: #ff4d4f;
        }
        .gm-button.danger:not(.disabled):active {
            background: #d9363e;
            transition: all ease-in 0.1s;
        }
        .gm-button.loading {
            background: #cacaca !important;
            cursor: not-allowed !important;
        }
        .gm-button.loading::before {
            content: "";
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            position: absolute;
            border: 2px solid rgba(0, 0, 0, 0);
            border-radius: 20px;
            border-top-color: #bbbbbb;
            animation: gm-button-loading 1s linear infinite;
        }
        @keyframes gm-button-loading {
            0%{
                transform: translate(-50%, -50%) rotate(0deg);
            }
            100%{
                transform: translate(-50%, -50%) rotate(360deg);
            }
        }
    `)
}