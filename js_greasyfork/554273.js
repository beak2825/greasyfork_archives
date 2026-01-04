// ==UserScript==
// @name         AVI
// @namespace    https://www.cdzero.cn
// @author       Zero
// @version      1.1.0
// @description  翻译指定区域为中文、数据记录、数据看板、数据统计！
// @icon         data:image/x-icon;base64,R0lGODlhPwA/AMQQAH/Kx+/4+BCdlr/l40Cwq2C+uTCqpN/y8VC3siCjnXDEwM/r6q/e3J/X1Y/RzgCWj////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAA/AD8AAAX/ICSOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwWGskEAHijfB4DJQ2phNakz6pMys227xuYdovigEoe8MQcjm5XTTfCQDEeigI3g/E141vGgxNdn15YmQECYODBggAbGIiA4CJBQePKQiDDZYqAXdvcpsqAG8CjqEnB28FpyUBDQWSfQIEAAubdYm5CZpbAQq5wE0JXkQLsU0IDgOmCwwKiHgOSgueDwKNLANSgUOdb0gwDNWgQLHkMNRvDECjTQo16damOt6ENgOfPr/WlTf7pTzqnashkEeDN/Nq7EvAA9ODVTr4PLClw9O6HdCk5ZCY0MY+PTkOPmBoUJiOdgR6qeBr0spBmZcwO4po945HKpYkCgQDeYJmCQUELtJ4Q2xbIpI9m6QcsVKADXUkoBkgQPWQ0hQiHzi6acCGJIgQbk4Z8TWFWI2QHMh08Y+NTmskxPJCIUVAPx1iV0kEO6cJwBQrHxigqMNhnmr9AhgeeGJfIAZ3bRyo9kbtAAXVurZ4G6yz584G1ppo97m0aXAwDig4Zho0AASUExQgxqq27du4c+vezbs3lBAAOw==
// @match        *://36.151.66.66*/*
// @connect      www.cdzero.cn
// @connect      yandex.net
// @connect      google.com
// @connect      googleapis.com
// @connect      microsoft.com
// @connect      microsofttranslator.com
// @connect      localhost
// @connect      10.10.0.150
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554273/AVI.user.js
// @updateURL https://update.greasyfork.org/scripts/554273/AVI.meta.js
// ==/UserScript==
(function () {
    "use strict";
    // unsafeWindow.ymfApiOrigin = "http://localhost:3000";
    unsafeWindow.ymfApiOrigin = "http://10.10.0.150:6080";
    autoCaptcha();
    addRootStyle();
    addDataBoard();
    addGoogleTranslate();
})();

// 记录审核量
async function addDataBoard() {
    const { whiteTimeIco, blackTimeIco, GET_DATA, SET_DATA, GM_XHR, HTTP_XHR, GetCookie, WaylayHTTP, MessageTip, AddDOM, WindowMove, DisplayWindow, ObjectProperty, ThrottleOver, AwaitSelectorShow, FormatTime } = Plug_fnClass();
    WaylayHTTP([{
        // 标注
        url: /dev-api\/project\/(annotationBrandDetailOnline|annotationBrandDetail)/i,
        callback(params) {
            if (!params.sendBody) {
                return false;
            }
            if (params.data.status !== 200) {
                return false;
            }
            const data = JSON.parse(params.data.responseText) || {};
            if (data.code !== 200) {
                return false;
            }
            const body = JSON.parse(params.sendBody) || {};
            const remarks = (body.remarks || "").replace(/\s/g, "");
            if (remarks) {
                if (/^\d+$/.test(remarks)) {
                    submitPush({ qcPass: 1 });
                } else {
                    submitPush({ qcBack: 1 });
                }
            } else {
                submitPush({ annotation: 1 });
            }
        }
    }, {
        // 复核
        url: /dev-api\/project\/reviewBrandDetailOnline/i,
        callback() {
            // submitPush({ review: 1 });
        }
    }, {
        // 退回
        url: /dev-api\/project\/project\/backData/i,
        callback() {
            // submitPush({ back: 1 });
        }
    }]);
    const getToken = (resolve) => {
        const token = GetCookie("Admin-Token");
        if (token) {
            resolve(token);
        } else {
            setInterval(() => getToken(resolve), 1000);
        }
    }
    const adminToken = await new Promise(getToken);
    const { nickName, userName } = await HTTP_XHR({
        method: "GET",
        url: "/dev-api/system/user/getInfo",
        header: {
            "authorization": "Bearer " + adminToken,
        },
    }).then((res) => {
        const content = JSON.parse(res.responseText);
        return { nickName: content.user.nickName, userName: content.user.userName };
    }).catch((error) => {
        console.error(error);
        const username = (GetCookie("username") || "").trim().toLocaleLowerCase();
        return { nickName: username, userName: username };
    });
    const data = {
        timeBoard: FormatTime(),
        userBoard: "",
        time: FormatTime(),
        user: userName,
        annotation: 0,
        qcPass: 0,
        qcBack: 0,
        total: 0,
        setLoading: false,
        getLoading: false,
        getBoardLoading: false,
        error: false,
        dataList: GET_DATA("GM_DATA") || [],
        submitList: GET_DATA("GM_DATA_SUBMIT") || [],
        boardData: [],
    };
    function getData() {
        if (!data.time) {
            return MessageTip("❌", "时间不能为空", 3);
        }
        if (data.getLoading) {
            return false;
        }
        data.getLoading = true;
        let find = data.dataList.find((item) => item.user === data.user && item.time === data.time);
        GM_XHR({
            method: "POST",
            url: unsafeWindow.ymfApiOrigin + "/api/avi/data",
            data: JSON.stringify({
                type: "GET",
                data: {
                    user: data.user,
                    time: data.time,
                }
            }),
        }).then((res) => {
            const content = JSON.parse(res.responseText);
            if (res.status === 200 && content.code === 200 && content.data) {
                if (!find) {
                    data.dataList.push(content.data);
                    find = content.data;
                } else {
                    find.annotation = content.data.annotation || find.annotation || 0;
                    find.qcPass = content.data.qcPass || find.qcPass || 0;
                    find.qcBack = content.data.qcBack || find.qcBack || 0;
                }
                submitSave();
            }
        }).catch((error) => {
            console.error(error);
            MessageTip("❌", "获取数据失败", 3);
        }).finally(() => {
            data.getLoading = false;
            data.annotation = find?.annotation || 0;
            data.qcPass = find?.qcPass || 0;
            data.qcBack = find?.qcBack || 0;
            data.total = data.annotation + data.qcPass + data.qcBack;
        });
    }
    function setData() {
        if (data.setLoading || data.submitList.length === 0) {
            return false;
        }
        data.setLoading = true;
        GM_XHR({
            method: "POST",
            url: unsafeWindow.ymfApiOrigin + "/api/avi/data",
            data: JSON.stringify({
                type: "SET",
                data: data.submitList
            }),
        }).then((res) => {
            const content = JSON.parse(res.responseText);
            if (res.status === 200 && content.code === 200) {
                content.data.forEach((list) => {
                    const find = data.submitList.find((item) => item.user === list.user && item.time === list.time);
                    if (find) {
                        Object.keys(list).forEach((key) => {
                            const value = list[key];
                            if (typeof value === "number") {
                                find[key] -= value;
                            }
                        });
                    }
                });
                submitSave();
                setTimeout(setData, 200);
                data.error = false;
            } else {
                throw new Error("提交数据失败", content);
            }
        }).catch((error) => {
            data.error = true;
            console.error(error);
            MessageTip("❌", "保存到数据库失败", 3);
        }).finally(() => {
            getData();
            data.setLoading = false;
        });
    }
    function submitSave() {
        // 最多2000条缓存
        data.dataList = data.dataList.slice(data.dataList.length - 2000);
        SET_DATA("GM_DATA", data.dataList);
        // 筛选出submitList中所有值不为0的项
        data.submitList = data.submitList.filter((item) => item.time && item.user && Object.values(item).every((value) => typeof value !== "number" || value !== 0));
        SET_DATA("GM_DATA_SUBMIT", data.submitList);
        return { dataList: data.dataList, submitList: data.submitList };
    }
    function submitPush(params) {
        const { dataList, submitList } = data;
        const keys = Object.keys(params);
        const time = FormatTime();
        const findData = dataList.find((item) => item.user === userName && item.time === time);
        const findSunmit = submitList.find((item) => item.user === userName && item.time === time);
        [[findData, dataList], [findSunmit, submitList]].forEach(([list, listPush]) => {
            if (list) {
                keys.forEach((key) => list[key] = (list[key] || 0) + params[key]);
            } else {
                listPush.push({
                    time: time,
                    user: userName,
                    nick: nickName,
                    ...params,
                });
            }
        });
        submitSave();
        setData();
    };
    setData();
    const throttleGet = ThrottleOver(getData, 100);
    throttleGet();
    ObjectProperty(data, ["time", "user"], throttleGet);
    const scrollbarWrapper = await AwaitSelectorShow(".scrollbar-wrapper");
    scrollbarWrapper.style.position = "relative";
    scrollbarWrapper.style.height = "calc(100% - 1.042vw)";
    AddDOM({
        addNode: scrollbarWrapper,
        addData: [{
            name: "div",
            className: "gm-data-board gm-data-root",
            add: [{
                name: "div",
                style: "position: relative;font-size: .75vw;font-weight: bold;",
                add: [{
                    name: "div",
                    style: "text-align: center;",
                    innerText: "数据看板"
                }, {
                    name: "div",
                    style: "position: absolute;top: 0;left: .2vw;color: #2090ff;cursor: pointer;user-select: none;",
                    innerText: "统计",
                    click: (event) => {
                        getDataBoard();
                        const dataTotal = document.querySelector("#gm-data-total");
                        if (!!dataTotal) {
                            dataTotal.style.display = "";
                            return false;
                        }
                        addDataTotal(event.target, "gm-data-total");
                    }
                }, {
                    name: "div",
                    style: "position: absolute;top: 0;right: .2vw;cursor: pointer;display: flex;gap: .2vw;",
                    add: [{
                        name: "div",
                        className: "gm-loading",
                        style: [data, "getLoading", (value) => `display: ${value ? "block" : "none"};`],
                    }, {
                        name: "div",
                        className: "gm-loading",
                        style: [data, "setLoading", (value) => `display: ${value ? "block" : "none"};`],
                    }, {
                        name: "div",
                        className: "gm-error",
                        style: [data, "error", (value) => `display: ${value && !data.setLoading ? "flex" : "none"};`],
                        innerText: "!",
                        "msg-tip": "数据推送失败"
                    }]
                }]
            }, {
                name: "div",
                style: "display: flex;justify-content: space-between;",
                add: [{
                    name: "input",
                    type: "date",
                    autocomplete: "off",
                    value: [data, "time"],
                    function(element) {
                        element.addEventListener("input", (event) => {
                            data.time = event.target.value;
                        })
                    }
                }, {
                    name: "button",
                    className: "gm-button small",
                    innerText: "今天",
                    click: () => data.time = FormatTime()
                }, {
                    name: "button",
                    className: "gm-button small",
                    innerText: "查询",
                    click: () => getData()
                }]
            }, {
                name: "div",
                style: "display: flex;justify-content: space-between;",
                add: [{
                    name: "input",
                    type: "text",
                    autocomplete: "off",
                    placeholder: "账号名",
                    value: [data, "user"],
                    function(element) {
                        element.addEventListener("input", (event) => {
                            data.user = event.target.value;
                        })
                    }
                }, {
                    name: "button",
                    className: "gm-button warning small",
                    innerText: "自己",
                    click: async () => data.user = userName
                }, {
                    name: "button",
                    className: "gm-button warning small",
                    innerText: "清除",
                    click: () => data.user = ""
                }]
            }, {
                name: "table",
                cellspacing: 0,
                add: [{
                    name: "tbody",
                    add: [{
                        name: "tr",
                        add: [{
                            name: "th",
                            style: "width: 50%;text-align: center;",
                            innerText: "类型"
                        }, {
                            name: "th",
                            style: "width: 50%;text-align: center;",
                            innerText: "数量"
                        }]
                    }, ...[["标注", "annotation"], ["质检通过", "qcPass"], ["质检退回", "qcBack"]].map(([name, key]) => ({
                        name: "tr",
                        add: [{
                            name: "td",
                            style: "text-align: center;",
                            innerText: name
                        }, {
                            name: "td",
                            style: "text-align: center;",
                            innerText: [data, key]
                        }]
                    })), {
                        name: "tr",
                        add: [{
                            name: "th",
                            style: "text-align: center;",
                            innerText: "合计"
                        }, {
                            name: "th",
                            style: "text-align: center;",
                            innerText: [data, "total"]
                        }]
                    }]
                }],
            }]
        }]
    });
    function getDataBoard() {
        if (!data.timeBoard) {
            return MessageTip("❌", "时间不能为空", 3);
        }
        if (data.getBoardLoading) {
            return false;
        }
        data.getBoardLoading = true;
        GM_XHR({
            method: "POST",
            url: unsafeWindow.ymfApiOrigin + "/api/avi/data",
            data: JSON.stringify({
                type: "GET-BOARD",
                data: {
                    user: data.userBoard,
                    time: data.timeBoard,
                }
            }),
        }).then((res) => {
            const content = JSON.parse(res.responseText);
            if (res.status === 200 && content.code === 200 && content.data) {
                data.boardData = content.data;
            } else {
                throw "空数据";
            }
        }).catch((error) => {
            data.boardData = [];
            console.error(error);
            MessageTip("❌", "获取数据失败", 3);
        }).finally(() => {
            data.getBoardLoading = false;
        });
    }
    function addDataTotal(work, id) {
        AddFloatWindow({
            addNode: document.body,
            otherData: {
                id: id
            },
            addData: [{
                name: "div",
                className: "gm-data-total gm-data-root",
                add: [{
                    name: "div",
                    style: "display: flex;align-items: center;gap: .5vw;margin: .5vw 0",
                    add: [{
                        name: "input",
                        style: "height: 1.4vw;",
                        type: "date",
                        autocomplete: "off",
                        value: [data, "timeBoard"],
                        function(element) {
                            element.addEventListener("input", (event) => {
                                data.timeBoard = event.target.value;
                                getDataBoard();
                            })
                        }
                    }, {
                        name: "input",
                        style: "height: 1.4vw;",
                        type: "text",
                        autocomplete: "off",
                        placeholder: "账号名",
                        value: [data, "userBoard"],
                        function(element) {
                            element.addEventListener("input", (event) => {
                                data.userBoard = event.target.value;
                                getDataBoard();
                            })
                        }
                    }, {
                        name: "button",
                        style: "width: 4vw;",
                        className: [data, "getBoardLoading", (value) => "gm-button" + (value ? " gm-loading disabled" : "")],
                        innerText: "查询",
                        click: () => getDataBoard()
                    }]
                }, {
                    name: "div",
                    style: "height: 22vw;width: 26vw;overflow-y: auto;",
                    add: [{
                        name: "table",
                        style: "width: 100%;",
                        cellspacing: 0,
                        add: [{
                            name: "thead",
                            add: [{
                                name: "tr",
                                add: [{
                                    name: "th",
                                    style: "width: 22%;text-align: center;",
                                    innerText: "账号"
                                }, {
                                    name: "th",
                                    style: "width: 18%;text-align: center;",
                                    innerText: "昵称"
                                }, {
                                    name: "th",
                                    style: "width: 15%;text-align: center;",
                                    innerText: "标注"
                                }, {
                                    name: "th",
                                    style: "width: 15%;text-align: center;",
                                    innerText: "质检通过"
                                }, {
                                    name: "th",
                                    style: "width: 15%;text-align: center;",
                                    innerText: "质检退回"
                                }, {
                                    name: "th",
                                    style: "width: 15%;text-align: center;",
                                    innerText: "合计"
                                }]
                            }]
                        }, {
                            name: "tbody",
                            function(element) {
                                function addTd() {
                                    element.innerHTML = "";
                                    const tdDom = data.boardData.map((item) => ({
                                        name: "tr",
                                        add: [{
                                            name: "td",
                                            style: "text-align: center;",
                                            innerText: item.user
                                        }, {
                                            name: "td",
                                            style: "text-align: center;",
                                            innerText: item.nick || "无"
                                        }, {
                                            name: "td",
                                            style: "text-align: center;",
                                            innerText: item.annotation || 0
                                        }, {
                                            name: "td",
                                            style: "text-align: center;",
                                            innerText: item.qcPass || 0
                                        }, {
                                            name: "td",
                                            style: "text-align: center;",
                                            innerText: item.qcBack || 0
                                        }, {
                                            name: "td",
                                            style: "text-align: center;",
                                            innerText: (item.annotation || 0) + (item.qcPass || 0) + (item.qcBack || 0)
                                        }]
                                    }));
                                    AddDOM({
                                        addNode: element,
                                        addData: tdDom.length > 0 ? tdDom : [{
                                            name: "tr",
                                            add: [{
                                                name: "td",
                                                colspan: 6,
                                                style: "text-align: center;height: 2vw;",
                                                innerText: "暂无数据"
                                            }]
                                        }]
                                    })
                                }
                                addTd();
                                ObjectProperty(data, "boardData", (params) => {
                                    if (!params) {
                                        return false;
                                    }
                                    addTd();
                                });
                            }
                        }]
                    }]
                }]
            }]
        }).then((workWindow) => {
            DisplayWindow([workWindow, work], workWindow);
        });
    }
    // 功能窗口
    async function AddFloatWindow(params) {
        const floatWindow = await AddDOM({
            addNode: params.addNode,
            addData: [{
                name: "div",
                className: "gm-float-window",
                add: [{
                    name: "div",
                    className: "gm-float-move-bar"
                },
                ...params.addData
                ],
                ...params.otherData
            }]
        }, 0)
        const moveBar = floatWindow.querySelector(".gm-float-move-bar");
        WindowMove(moveBar, moveBar.parentNode, (place) => {
            moveBar.parentNode.style.left = place.left + "px";
            moveBar.parentNode.style.bottom = place.bottom + "px";
        })
        return floatWindow;
    }
    GM_addStyle(`
        .gm-float-window {
            position: absolute;
            background: #fafafa;
            border-radius: .6vw;
            padding: .6vw;
            box-shadow: 0 1px 6px rgb(0,0,0,0.5);
            bottom: .6vw;
            left: .6vw;
            z-index: 2000;
        }
        .gm-float-move-bar {
            position: absolute;
            top: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 15%;
            min-width: 3.125vw;
            max-width: 4.69vw;
            height: .365vw;
            padding: 0 !important;
            border-radius: .365vw;
            background: #cccccc;
            transition: ease-in 0.2s;
            user-select: none;
            cursor: grab;
        }
        .gm-float-move-bar:hover {
            background: #aaaaaa;
        }
        .gm-float-move-bar:active {
            cursor: grabbing;
            background: #888888;
            transition: all ease-in 0.1s;
        }

        .gm-data-board {
            width: 100%;
            max-width: 10.417vw;
            position: absolute;
            bottom: 0;
            font-size: .75vw;
            gap: .2vw;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 10px 0 #888888;
            padding-top: .2vw;
            border-radius: .5vw .5vw 0 0;
            white-space: nowrap;
        }

        .hideSidebar .gm-data-board table tr>th:nth-child(1),
        .hideSidebar .gm-data-board table tr>td:nth-child(1),
        .hideSidebar .gm-data-board>div {
            display: none !important;
        }
        .hideSidebar .gm-data-board {
            box-shadow: none;
            padding-top: 0;
            border-radius: 0;
        }

        .gm-data-total .gm-loading::before,
        .gm-data-board .gm-loading::before {
            content: "";
            display: block;
            width: 1vw;
            height: 1vw;
            border-radius: 50%;
            border: 0.2vw solid #eeeeee;
            border-top-color: #cacaca;
            animation: gm-loading 1s linear infinite;
        }
        .gm-data-total .gm-loading {
            position: relative;
        }
        .gm-data-total .gm-loading::before {
            width: 1vw;
            height: 1vw;
            position: absolute;
            top: calc(50% - .5vw);
            left: calc(50% - .5vw);
            z-index: 1;
        }
        @keyframes gm-loading {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        .gm-data-board .gm-error {
            width: 1vw;
            height: 1vw;
            display: flex;
            align-items: center;
            background: #ff0000;
            justify-content: center;
            color: #ffffff;
            border-radius: 1vw;
        }

        .gm-data-root input {
            width: 55%;
            border: 1px solid #767676;
            border-radius: .2vw;
            outline: none;
            font-size: .75vw;
            height: 1.2vw;
            font-family: unset;
        }
        .gm-data-root input:hover {
            border: 1px solid #40a9ff;
        }
        .gm-data-root input:focus-visible {
            border: 1px solid #ff0000;
        }
        .gm-data-root input::placeholder {
            color: rgba(153,153,153,0.5);
        }

        /*date时间输入框样式*/
        .gm-data-root input::-webkit-datetime-edit-year-field,
        .gm-data-root input::-webkit-datetime-edit-month-field,
        .gm-data-root input::-webkit-datetime-edit-day-field {
            cursor: pointer;
            border-radius: .2vw;
            transition: background-color ease-in 0.2s, color ease-in 0.2s;
        }
        .gm-data-root input::-webkit-datetime-edit-year-field:hover,
        .gm-data-root input::-webkit-datetime-edit-month-field:hover,
        .gm-data-root input::-webkit-datetime-edit-day-field:hover{
            color: #ffffff;
            background-color: #faad14;
        }
        .gm-data-root input::-webkit-calendar-picker-indicator {
            cursor: pointer;
            width: .75vw;
            height: .75vw;
            margin-right: .15vw;
            border-radius: .2vw;
            transition: background-color ease-in 0.2s;
            background-image: url('${blackTimeIco}');
        }
        .gm-data-root input::-webkit-calendar-picker-indicator:hover {
            background-color: #faad14;
            background-image: url('${whiteTimeIco}');
        }

        /*表格样式*/
        .gm-data-root table {
            border-left: 0.1px solid #000000;
        }
        .gm-data-root th {
            background: #6bbbff;
            border: 0.1px solid #000000;
            color: rgba(0,0,0,0.9);
            font-family: "微软雅黑";
            border-left: none;
            position: sticky;
            top: 0;
        }
        .gm-data-root td {
            border: 0.1px solid #000000;
            color: rgba(0,0,0,0.9);
            font-family: "微软雅黑";
            border-top: none;
            border-left: none;
        }
        .gm-data-board table {
            border-top: 0.1px solid #000000;
        }
        .gm-data-board th {
            border-top: none;
        }
    `)
}

// 自动解析验证码
function autoCaptcha() {
    const { ObserverDOM, ThrottleOver, GM_XHR } = Plug_fnClass();
    const config = {
        img: "",
    };
    const observer = ObserverDOM(ThrottleOver(runCode, 100));
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    async function runCode() {
        const loginCode = document.querySelector(".login-code");
        if (!loginCode) {
            return false;
        }
        const img = loginCode.querySelector("img");
        const input = loginCode.parentElement.querySelector("input");
        if (!img || !input) {
            return false;
        }
        if (config.img === img.src || !/^data\:image/i.test(img.src)) {
            return false;
        }
        config.img = img.src;
        img.parentNode.classList.add("get-captcha-loading");
        const data = await getCaptcha();
        img.parentNode.classList.remove("get-captcha-loading");
        if (data && config.img === img.src) {
            input.value = data.captcha;
            input.dispatchEvent(new Event("input"));
        }
    }
    async function getCaptcha() {
        return GM_XHR({
            method: "POST",
            url: `${unsafeWindow.ymfApiOrigin}/api/ai/captcha`,
            data: {
                img: config.img
            },
        }).then((xhr) => {
            const data = JSON.parse(xhr.response);
            if (data.code === 200) {
                return data.data;
            }
            throw "获取失败";
        }).catch((error) => {
            console.error(error);
            return null;
        })
    }
    GM_addStyle(`
        .get-captcha-loading::before {
            content: "AI识别中...";
            top: 100%;
            position: absolute;
            text-align: center;
            line-height: initial;
            pointer-events: none;
            color: rgba(255, 0, 0, .7);
        }
    `)
}

// 添加翻译
function addGoogleTranslate() {
    const { arrowIco, microsoftIco, googleIco, yandexIco, closeIco, GET_DATA, SET_DATA, GM_XHR, AddDOM, SwitchBox, DropdownMenu, queryElement, MessageTip, ThrottleOver, ObserverDOM, AwaitSelectorShow } = Plug_fnClass();
    const isBilingual = GET_DATA("GM_CONFIG", {})?.isBilingual;
    const config = {
        async translate() {
            MessageTip("❌", "未选择翻译模型", 3);
        },
        isTranslate: false,
        isBilingual: typeof isBilingual === "boolean" ? isBilingual : true,
    };
    // 设置翻译容器
    (async () => {
        await AddDOM({
            addData: [{
                name: "div",
                className: "translate-root",
                add: [{
                    name: "div",
                    function: versionPlug
                }, {
                    name: "div",
                    function: translateModel
                }],
            }]
        }).then(async (div) => {
            const rightMenu = await AwaitSelectorShow(".right-menu");
            rightMenu.style.position = "relative";
            rightMenu.insertBefore(div, rightMenu.firstChild);
        })
        setupTranslationRules();
    })();

    // 配置翻译模型
    function translateModel(element) {
        const modelConfig = {
            model: GET_DATA("GM_CONFIG", {})?.translate || "微软翻译",
            selectModel: null,
            selectModelIco: null,
            microsoftToken: null,
            googleJs: null,
            googleToken: null,
            yandexIndex: 0,
            yandexToken: null,
            tokenTimeOut: 1000 * 60 * 60,
        };
        async function microsoft(textArr) {
            if (!modelConfig.microsoftToken) {
                await GM_XHR({
                    url: "https://edge.microsoft.com/translate/auth"
                }).then((response) => {
                    if (response.status === 200) {
                        modelConfig.microsoftToken = response.responseText;
                        setTimeout(() => {
                            modelConfig.microsoftToken = null;
                        }, modelConfig.tokenTimeOut);
                    }
                }).catch((error) => {
                    console.error(error);
                })
                if (!modelConfig.microsoftToken) {
                    MessageTip("❌", "获取微软翻译Token失败", 3);
                    return false;
                }
            }
            return GM_XHR({
                url: "https://api-edge.cognitive.microsofttranslator.com/translate?to=zh-Hans&api-version=3.0",
                method: "POST",
                header: {
                    "authorization": "Bearer " + modelConfig.microsoftToken,
                    "content-type": "application/json; charset=UTF-8",
                },
                data: JSON.stringify(textArr.map((item) => ({
                    Text: item,
                }))),
            }).then((response) => {
                const result = JSON.parse(response.responseText);
                return result.map((item) => item.translations[0].text);
            }).catch((error) => {
                console.error(error);
                return [];
            })
        }
        async function google(textArr) {
            if (!modelConfig.googleJs) {
                await GM_XHR({
                    url: "https://translate.google.com/translate_a/element.js"
                }).then((response) => {
                    const result = response.responseText
                        .replace(/\\x3d/g, "=")
                        .replace(/\\/g, "")
                        .match(/https:\/\/translate.googleapis.com\/_\/translate_http\/_\/js([\s\S]*?)el_main/i);
                    if (result) {
                        modelConfig.googleJs = result[0];
                        setTimeout(() => {
                            modelConfig.googleJs = null;
                        }, modelConfig.tokenTimeOut);
                    }
                }).catch((error) => {
                    console.error(error);
                })
                if (!modelConfig.googleJs) {
                    MessageTip("❌", "获取谷歌翻译Token失败", 3);
                    return false;
                }
            }
            if (!modelConfig.googleToken) {
                await GM_XHR({
                    url: modelConfig.googleJs
                }).then((response) => {
                    const result = response.responseText
                        .replace(/\\/g, "")
                        .replace(/\\x3d/g, "")
                        .match(/['|"]X-goog-api-key['|"]:['|"](.*?)['|"]/i);
                    if (result) {
                        modelConfig.googleToken = result[1];
                        setTimeout(() => {
                            modelConfig.googleToken = null;
                        }, modelConfig.tokenTimeOut);
                    }
                }).catch((error) => {
                    console.error(error);
                })
                if (!modelConfig.googleToken) {
                    MessageTip("❌", "获取谷歌翻译Token失败", 3);
                    return false;
                }
            }
            return GM_XHR({
                url: "https://translate-pa.googleapis.com/v1/translateHtml",
                method: "POST",
                header: {
                    "content-type": "application/json+protobuf",
                    "x-goog-api-key": modelConfig.googleToken,
                },
                data: JSON.stringify([[textArr, "auto", "zh-CN"], "te"]),
            }).then((response) => {
                const result = JSON.parse(response.responseText);
                return result[0] || [];
            }).catch((error) => {
                console.error(error);
                return [];
            })
        }
        async function yandex(textArr) {
            if (!modelConfig.yandexToken) {
                await GM_XHR({
                    url: "https://translate.yandex.net/website-widget/v1/widget.js"
                }).then((response) => {
                    const result = response.responseText
                        .match(/sid:.*['|"](.*?)['|"]/i);
                    if (result) {
                        modelConfig.yandexToken = result[1];
                        setTimeout(() => {
                            modelConfig.yandexToken = null;
                        }, modelConfig.tokenTimeOut);
                    }
                }).catch((error) => {
                    console.error(error);
                })
                if (!modelConfig.yandexToken) {
                    MessageTip("❌", "获取Yandex翻译Token失败", 3);
                    return false;
                }
            }
            const groupText = [];
            let itemText = [];
            let itemLang = 0;
            let maxLang = 1000;
            for (const text of textArr) {
                itemLang += text.length;
                if (itemLang > maxLang) {
                    groupText.push(itemText);
                    itemText = [text];
                    itemLang = text.length;
                    continue;
                }
                itemText.push(text);
            }
            groupText.push(itemText);
            return Promise.all(groupText.map(async (texts) => {
                const text = texts.map((item) => `text=${encodeURIComponent(item)}`).join("&");
                return GM_XHR({
                    url: `https://translate.yandex.net/api/v1/tr.json/translate?${text}&id=${modelConfig.yandexToken}-${modelConfig.yandexIndex++}-0&lang=zh&format=html&srv=tr-url-widget`,
                }).then((response) => {
                    const result = JSON.parse(response.responseText);
                    return result.text || [];
                }).catch((error) => {
                    console.error(error);
                    return [];
                })
            })).then((result) => {
                return result.flat();
            })
        }
        const select = [{
            name: "微软翻译",
            ico: microsoftIco,
            callback: microsoft,
        }, {
            name: "谷歌翻译",
            ico: googleIco,
            callback: google,
        }, {
            name: "Yandex翻译",
            ico: yandexIco,
            callback: yandex,
        }, {
            name: "关闭翻译",
            ico: closeIco,
            callback: () => { },
        }];
        const setSelect = (index) => {
            const value = select[index];
            SET_DATA("GM_CONFIG", {
                translate: value.name,
            });
            config.translate = value.callback;
            modelConfig.selectModel = value.name;
            modelConfig.selectModelIco = value.ico;
        }
        element.style = "display: flex;align-items: center;gap: .5vw;";
        AddDOM({
            addNode: element,
            addData: [SwitchBox({
                "msg-tip": "翻译显示原文+译文",
                style: [modelConfig, "selectModel", (value) => `display: ${value === select[select.length - 1].name ? "none" : "block"}`],
                checked: !!config.isBilingual,
                function: (event) => {
                    event.addEventListener("change", () => {
                        config.isBilingual = event.checked;
                        SET_DATA("GM_CONFIG", {
                            isBilingual: event.checked,
                        });
                    });
                }
            }), {
                name: "div",
                className: "translate-select",
                add: [{
                    name: "div",
                    style: "width: .75vw;",
                    innerHTML: [modelConfig, "selectModelIco"],
                }, {
                    name: "div",
                    innerHTML: [modelConfig, "selectModel"],
                }, {
                    name: "div",
                    style: "transform: rotate(270deg);width: .6vw;",
                    innerHTML: arrowIco,
                }],
                function(div) {
                    DropdownMenu({
                        element: div,
                        style: "font-size: .75vw;",
                        mouse: ["l", "r"],
                        clickBack: (({ rect, setTop }) => setTop(rect.top + rect.height)),
                        node: select.map((list, index) => {
                            const selected = list.name === modelConfig.model;
                            if (selected || index === 0) {
                                setSelect(index);
                            }
                            return {
                                name: "div",
                                style: "gap: .25vw;display: flex;align-items: center;",
                                click: () => {
                                    setSelect(index);
                                },
                                add: [{
                                    name: "div",
                                    style: "width: .75vw;display: flex;align-items: center;",
                                    innerHTML: list.ico,
                                }, {
                                    name: "div",
                                    innerHTML: list.name,
                                }],
                            }
                        })
                    })
                }
            }]
        })
    }

    // 翻译
    function translateClass(elementAll) {
        let isRun = false;
        let zhText = [];
        const oldText = elementAll.map((element) => element.innerHTML);
        return {
            async translate() {
                config.isTranslate = true;
                if (zhText.length === 0) {
                    if (isRun) {
                        return false;
                    }
                    isRun = true;
                    elementAll.forEach((element) => element.classList.add("translate-loading"));
                    const translateText = await config.translate(oldText);
                    elementAll.forEach((element) => element.classList.remove("translate-loading"));
                    if (translateText && translateText.length === oldText.length) {
                        zhText = translateText;
                    } else if (translateText) {
                        MessageTip("❌", "翻译失败", 3);
                    }
                    isRun = false;
                }
                if (config.isTranslate) {
                    for (let index = 0; index < elementAll.length; index++) {
                        const value = zhText[index];
                        if (!value) {
                            continue;
                        }
                        if (config.isBilingual) {
                            elementAll[index].innerHTML = `<div style="display: inline-flex;flex-direction: column;"><span style="font-size: .85vw;color: #bbbbbb;">${oldText[index]}</span>${value}</div>`;
                        } else {
                            elementAll[index].innerHTML = value
                        }
                    }
                }
            },
            reTranslate() {
                config.isTranslate = false;
                for (let index = 0; index < elementAll.length; index++) {
                    const value = oldText[index];
                    value && (elementAll[index].innerHTML = value);
                }
            }
        }
    }

    // 设置翻译规则
    async function setupTranslationRules() {
        const app = await AwaitSelectorShow("#app");
        // 设置翻译区域
        const setTranslateHTML = ThrottleOver((node) => {
            // 设置翻译、还原按钮
            const shopee = node.querySelector(".shopee-detail-container");
            const section = node.querySelector(".detail-info-section");
            if (!shopee || !section) {
                return;
            }
            const title = section.querySelector(".product-title");
            const content = section.querySelector(".description-content");
            if (!content || !title || /^无商品/.test(title.innerText)) {
                return;
            }
            const skuSpan = section.querySelectorAll(".product-sku span");
            const gridSpan = section.querySelectorAll(".attributes-grid span");
            content.innerHTML = content.innerText.split("\n").map((char) => `<div>${char}</div>`).join("");
            const { translate, reTranslate } = translateClass([title, ...skuSpan, ...content.querySelectorAll("div"), ...gridSpan].filter((item) => item.innerText));
            if (!config.isBilingual) {
                AddDOM({
                    addData: [{
                        name: "div",
                        className: "translate-operation",
                        add: [{
                            name: "button",
                            style: "padding: .521vw 1.042vw;",
                            className: [config, "isTranslate", (v, setValue) => setValue(`el-button ${v ? "el-button--info" : "el-button--primary"}`)],
                            innerText: [config, "isTranslate", (v, setValue) => setValue(v ? "还原" : "翻译")],
                            click: () => config.isTranslate ? reTranslate() : translate(),
                        }]
                    }]
                }).then((div) => {
                    shopee.parentNode.insertBefore(div, shopee);
                });
            }
            translate();
        }, 100);
        ObserverDOM((mutation) => {
            if (mutation.type === "childList") {
                mutation.addedNodes && mutation.addedNodes.forEach((node) => {
                    if (queryElement(node, ".el-dialog__body")) {
                        setTranslateHTML(node);
                    }
                });
            }
        }).observe(app, {
            childList: true,
            subtree: true,
        });
    }

    // 版本控制器
    function versionPlug(children) {
        const gmConfig = GET_DATA("GM_CONFIG", {});
        const plugName = GM_info.script.name;
        const version = GM_info.script.version;
        const plugId = "554273";
        const getMetaUrl = `https://www.cdzero.cn/greasyfork/${plugId}/${plugName}.meta.js`;
        const plugUpDateUrl = `https://www.cdzero.cn/greasyfork/${plugId}/${plugName}.user.js`;
        const plugVersionsUrl = `https://www.cdzero.cn/greasyfork/versions/${plugId}-${plugName}`;
        AddDOM({
            addNode: children,
            addData: [{
                name: "div",
                id: "MyPlugVer",
                add: [{
                    name: "span",
                    innerHTML: `V${version}`
                }, {
                    name: "span",
                    id: "click",
                    innerHTML: "初始化",
                    function: (element) => {
                        clickPlug(element);
                    },
                    click: (e) => {
                        clickPlug(e.target, true);
                    }
                }, {
                    name: "a",
                    href: plugVersionsUrl,
                    target: "_blank",
                    innerHTML: "版本信息"
                }]
            }]
        })
        let loading = null;
        document.upDatePlug = () => {
            if (!!loading) {
                return MessageTip("❌", "新版插件下载中，请稍后...", 3);
            }
            const toTime = (new Date()).getTime();
            loading = window.open(plugUpDateUrl + "?time=" + toTime, "", "", true);
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === "visible") {
                    location.reload();
                }
            })
        }
        function clickPlug(element, click) {
            if (element.innerText === "有更新") {
                return document.upDatePlug();
            }
            if (element.innerText === "检测中") {
                return MessageTip("❌", "正在检测中，请稍后...", 3);
            }
            element.style = "color: red;";
            element.innerText = "检测中";
            return updatesPlug(element, click);
        }
        function checkPlug(element, obj, click) {
            if (!obj) {
                isNew();
                return MessageTip("❌", `${plugName}检测更新失败！`, 3);
            }
            const oldVer = Number(version.replace(/[\s.]+/g, ""));
            const newVer = Number(obj.plugver.replace(/[\s.]+/g, ""));
            if (!!obj.plugver && newVer > oldVer) {
                isUpdata();
                MessageTip("❌", `${plugName}发现新的版本：${obj.plugver} <a style="color: #1890ff;" onclick="document.upDatePlug();">更新助手</a>`, 6);
            } else if (!!obj.plugver) {
                isNew();
                !!click && MessageTip("✔️", `${plugName}已经是最新版本！`, 3);
            }
            function isNew() {
                element.style = "";
                element.innerText = "最新版";
            }
            function isUpdata() {
                element.style = "color: red;";
                element.innerText = "有更新";
            }
        }
        function updatesPlug(element, click) {
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
                    checkPlug(element, gmConfig, true);
                }).catch((error) => {
                    checkPlug(element, null, true);
                }).finally(() => {
                    SET_DATA("GM_CONFIG", gmConfig);
                })
            } else {
                checkPlug(element, gmConfig);
            }
        }
    }
}

// 函数Class
function Plug_fnClass() {
    class Plug_Plug {
        constructor() {
            Object.getOwnPropertyNames(this.constructor.prototype)
                .filter(name => name !== "constructor" && typeof this[name] === "function")
                .forEach(methodName => this[methodName] = this[methodName].bind(this));
            // 复制图标
            this.redCopyIco = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="32" height="32"><path fill="%23fa7679" d="m658.5 719.5v19.6c0 16.1-13.1 29.2-29.3 29.2h-307.6c-16.2 0-29.3-13.1-29.3-29.2v-380.9c0-16.2 13.1-29.3 29.3-29.3h19.5v361.3c0 16.2 13.1 29.3 29.3 29.3z"/><path fill="%23fa7679" d="m731.7 388.3v277.5c0 16.2-13.1 29.3-29.3 29.3h-307.6c-16.2 0-29.3-13.1-29.3-29.3v-380.9c0-16.1 13.1-29.2 29.3-29.2h204.3c2.6 0 5.1 1 6.9 2.8l122.9 122.9c1.8 1.8 2.8 4.3 2.8 6.9z"/><path fill="%23fde8e8" d="m593.4 374.5v-109.1l128.6 128.6h-109.1c-10.8 0-19.5-8.8-19.5-19.5z"/></svg>';
            // 白点图标
            this.whiteDropIco = 'data:image/svg+xml;utf8,<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="2" fill="white" /></svg>';
            // 时间图标
            this.blackTimeIco = 'data:image/svg+xml;utf8,<svg viewBox="60 64 896 896" xmlns="http://www.w3.org/2000/svg"><path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z" style="fill:hsla(0, 0%, 0%, 0.62)"></path></svg>';
            // 时间图标
            this.whiteTimeIco = 'data:image/svg+xml;utf8,<svg viewBox="60 64 896 896" xmlns="http://www.w3.org/2000/svg"><path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z" style="fill:hsl(0, 0%, 100%)"></path></svg>';
            // 左箭头图标
            this.arrowIco = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M783.36 1003.52c30.72-30.72 30.72-76.8 0-107.52L404.48 512l378.88-378.88c30.72-30.72 30.72-76.8 0-107.52-30.72-30.72-76.8-30.72-107.52 0L240.64 455.68c-30.72 30.72-30.72 76.8 0 107.52l435.2 435.2c30.72 30.72 76.8 30.72 107.52 5.12z"/></svg>';
            // 微软图标
            this.microsoftIco = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h487.070625v487.070625H0V0z m0 0" fill="#F25022"></path><path d="M537.143975 0h486.426825v487.070625h-486.426825q-0.357667-243.571079 0-487.070625z m0 0" fill="#80BA01"></path><path d="M0 536.786308h487.070625v487.070625H0z m0 0" fill="#02A4EF"></path><path d="M536.857841 536.857841h486.999092v487.070626H536.857841V536.857841z m0 0" fill="#FFB902"></path></svg>';
            // 谷歌图标
            this.googleIco = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M213.333902 516.067556c0-33.536 5.603556-65.678222 15.616-95.829334L53.476124 287.431111A512 512 0 0 0 0.000569 516.067556c0 82.147556 19.2 159.630222 53.390222 228.408888l175.388445-133.006222a302.648889 302.648889 0 0 1-15.473778-95.402666" fill="#FBBC05"></path><path d="M521.529458 211.143111c69.916444-0.142222 137.728 23.864889 192 67.982222l151.694222-150.129777C772.779236 49.294222 654.222791 0 521.529458 0 315.449458 0 138.297458 116.821333 53.476124 287.431111l175.587556 132.835556c40.419556-121.656889 155.676444-209.152 292.522667-209.152" fill="#EA4335"></path><path d="M523.748124 814.193778c-137.528889 0-253.354667-86.926222-294.030222-207.815111l-176.355555 131.982222C138.581902 907.975111 316.587236 1024 523.748124 1024c127.800889 0 249.827556-44.458667 341.447112-127.800889l-167.452445-126.833778c-47.217778 29.155556-106.695111 44.856889-174.023111 44.856889" fill="#34A853"></path><path d="M1024.000569 511.203556c0-30.321778-4.778667-62.976-11.918222-93.269334h-488.391111v198.144h281.116444c-14.023111 67.584-52.252444 119.495111-107.036444 153.287111l167.424 126.833778C961.422791 808.675556 1024.000569 678.371556 1024.000569 511.203556" fill="#4285F4"></path></svg>';
            // Yandex图标
            this.yandexIco = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 1024c282.781538 0 512-229.218462 512-512S794.781538 0 512 0 0 229.218462 0 512s229.218462 512 512 512z" fill="#FC3F1D"></path><path d="M526.966154 569.619692c31.980308 68.253538 40.487385 91.726769 40.487384 174.907077v108.819693h-110.907076v-183.492924L247.453538 213.346462h115.2l164.273231 356.27323z m136.507077-356.27323l-136.546462 309.326769h113.073231l136.546462-309.326769h-113.073231z" fill="#FFFFFF"></path></svg>';
            // 关闭图标
            this.closeIco = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M509.960159 0C228.462151 0 0 228.462151 0 509.960159s228.462151 509.960159 509.960159 509.96016 509.960159-228.462151 509.96016-509.96016-228.462151-509.960159-509.96016-509.960159z m257.019921 766.98008c-10.199203 10.199203-24.478088 16.318725-40.796813 16.318725-14.278884 0-30.59761-6.119522-40.796813-16.318725L509.960159 589.513944l-177.466135 177.466136c-10.199203 10.199203-24.478088 16.318725-40.796813 16.318725-14.278884 0-30.59761-6.119522-40.796813-16.318725-22.438247-22.438247-22.438247-59.155378 0-81.593626l177.466136-177.466135-177.466136-177.466136c-22.438247-22.438247-22.438247-59.155378 0-81.593625s59.155378-22.438247 81.593626 0l177.466135 177.466135 177.466136-177.466135c22.438247-22.438247 59.155378-22.438247 81.593625 0s22.438247 59.155378 0 81.593625L591.553785 507.920319l177.466135 177.466135c20.398406 24.478088 20.398406 59.155378-2.03984 81.593626z" fill="#F90000"></path></svg>';
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
         * 查询元素，若元素匹配选择器就返回该元素，否则返回子元素中匹配的第一个
         * @param {HTMLElement} element - 要查询的元素
         * @param {string} selector - 要匹配的选择器
         * @returns {HTMLElement|null} - 返回匹配的元素或null
         */
        queryElement(element, selector) {
            try {
                // 先判断当前元素是否匹配选择器
                if (element.matches(selector)) {
                    return element;
                }
                // 再查找子元素
                return element.querySelector(selector);
            } catch (error) {
                return null;
            }
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
                                                const data = values[2](params.value, setValue);
                                                if (data !== undefined) {
                                                    setValue(data);
                                                }
                                                return false;
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
         * 下拉列表
         * @param {object} params 配置参数
         * @param {'l'|'r'|['l','r']} params.mouse 列表显示的位置
         * @param {HTMLElement} params.element 触发下拉列表的元素
         * @param {object} params.node 下拉列表的节点配置
         * @param {string} params.style 下拉列表的样式
         * @param {function} params.clickBack 下拉列表点击回调函数
         */
        async DropdownMenu({ mouse = "l", element, node, style, clickBack = () => { } }) {
            const AddDOM = this.AddDOM;
            const listener = { l: "click", r: "contextmenu" };
            mouse = Array.isArray(mouse) ? mouse : [mouse];
            function displayMenu(event, elem) {
                event.preventDefault();
                document.body.appendChild(elem);
                const rect = element.getBoundingClientRect();
                elem.style.display = "block";
                setPlace(elem, "top", rect.top);
                setPlace(elem, "left", rect.left);
                document.addEventListener("click", _removeMenu, true);
                document.addEventListener("contextmenu", _removeMenu, true);
                function _removeMenu() {
                    elem.remove();
                    document.removeEventListener("click", _removeMenu);
                    document.removeEventListener("contextmenu", _removeMenu);
                }
                clickBack({
                    rect: element.getBoundingClientRect(),
                    setTop: (value) => setPlace(elem, "top", value),
                    setLeft: (value) => setPlace(elem, "left", value),
                })
            }
            function setPlace(elem, place, value) {
                const w2h = { top: "Height", left: "Width" };
                elem.style[place] = Math.min(value, window["inner" + w2h[place]] - elem["client" + w2h[place]]) + "px";
            }
            return AddDOM({
                addData: [{
                    name: "div",
                    className: "gm-dropdown-menu",
                    style: style || "",
                    add: node
                }]
            }).then((div) => {
                for (const item of mouse) {
                    element.addEventListener(listener[item] || "click", (event) => displayMenu(event, div));
                }
            })
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
            if (ico === undefined) {
                let msgTip = null;
                return (ico, text, time, place) => {
                    if (msgTip && msgTip.ico) {
                        msgTip.ico(ico);
                        msgTip.text(text);
                    } else {
                        msgTip = MessageTip(ico, text, null, place);
                    }
                    msgTip.remove(time);
                    return msgTip;
                }
            }
            const AddDOM = this.AddDOM;
            const RunFrame = this.RunFrame;
            const RemoveDom = this.RemoveDom;
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
            const createTip = async (addNode) => {
                const className = "gm-message-place-" + place;
                const tipDom = addNode.querySelector(`:scope>.${className}`);
                if (tipDom) { return tipDom };
                return AddDOM({
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
                        return AddDOM({
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
                RunFrame(() => {
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
                        AddDOM({
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
            const AddDOM = this.AddDOM;
            const RemoveDom = this.RemoveDom;
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
    }
    GM_addStyle(`
        .gm-tooltip.question {
            height: 1vw;
            width: 1vw;
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
            padding: .3vw .5vw !important;
            font-size: .75vw;
            font-weight: initial;
            line-height: 1.4;
            max-width: 25vw;
            text-align: left;
            border-radius: .3vw;
            pointer-events: none;
            background: rgba(0,0,0,0.75);
            box-shadow: 0 .3vw .5vw rgba(0,0,0,.15);
        }
        .gm-tooltip-info::before {
            content: "";
            position: absolute;
            top: var(--tooltip-top, -.5vw);
            bottom: var(--tooltip-bottom, -.5vw);
            left: var(--tooltip-left, .6vw);
            transform: rotate(var(--tooltip-rotate, 0deg));
            height: .5vw;
            width: .975vw;
            background: inherit;
            clip-path: path('M 0 8 A 4 4 0 0 0 2.82842712474619 6.82842712474619 L 6.585786437626905 3.0710678118654755 A 2 2 0 0 1 9.414213562373096 3.0710678118654755 L 13.17157287525381 6.82842712474619 A 4 4 0 0 0 16 8 Z');
        }
    `)
    // uuid函数覆盖
    crypto.randomUUID = crypto.randomUUID || (() => {
        // RFC4122 version 4 form
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })
    })
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
    const plug = new Plug_Plug();
    Plug_fnClass = () => plug;
    return plug;
}

// 样式
function addRootStyle() {
    GM_addStyle(`
        body {
            top: 0 !important;
        }
        .translate-root {
            gap: 10px;
            height: 100%;
            display: flex;
            align-items: center;
            position: absolute;
            right: calc(100%);
            white-space: nowrap; /* 禁止换行 */
            overflow: hidden;    /* 隐藏溢出内容（可选） */
        }
        .translate-operation {
            gap: 15px;
            display: flex;
            justify-content: center;
            position: sticky;
            top: 0;
            padding: 5px 0;
            background: #ffffff;
        }
        .translate-select {
            gap: .3vw;
            display: flex;
            align-items: center;
            line-height: 0;
            padding: .4vw .3vw;
            cursor: pointer;
            border-radius: .3vw;
            border: 1px solid #ccc;
            font-size: .75vw;
        }
        .translate-loading {
            position: relative;
        }
        .translate-loading::before {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            display: block;
            width: 1.1vw;
            height: 1.1vw;
            border-radius: 50%;
            border: 0.2vw solid #eeeeee;
            border-top-color: #cacaca;
            animation: translate-loading-frames 1s linear infinite;
        }
        @keyframes translate-loading-frames {
            0% {
                transform: translateY(-50%) translateX(calc(-100% - 0.2vw)) rotate(0deg);
            }
            100% {
                transform: translateY(-50%) translateX(calc(-100% - 0.2vw)) rotate(360deg);
            }
        }
    `);
    // .translate-loading::before {
    //     content: "";
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     width: 1vw;
    //     height: 100%;
    //     background: linear-gradient(
    //         to right,
    //         rgba(0, 0, 0, 0) 0%,
    //         rgba(3, 169, 244, 0.8) 50%,
    //         rgba(0, 0, 0, 0) 100%
    //     );
    //     animation: translate-loading-frames 6s linear infinite;
    // }
    // @keyframes translate-loading-frames {
    //     0% {
    //         left: 0;
    //     }
    //     50% {
    //         left: 100%;
    //     }
    //     100% {
    //         left: 0;
    //     }
    // }
    GM_addStyle(`
        .app-container {
            height: calc(100vh - 4.375vw);
            display: flex;
            flex-direction: column;
        }
        .app-container .el-table {
            height: auto !important;
        }
        .app-container .pagination-container {
            height: auto !important;
            display: flex;
            justify-content: flex-end;
            margin: 0;
            padding-bottom: 0 !important;
        }
        .app-container .pagination-container .el-pagination {
            position: unset;
        }
    `)
    // 下拉菜单
    GM_addStyle(`
        .gm-dropdown-menu {
            display: none;
            top: 22px;
            left: 18px;
            z-index: 16;
            position: absolute;
            background: #ffffff;
            color: rgba(0,0,0,.65);
            padding: 0.25vw 0;
            border-radius: 5px;
            box-shadow: 0 1px 6px rgba(0,0,0,.5);
        }
        .gm-dropdown-menu>div {
            padding: 0.2vw 0.5vw;
            cursor: pointer;
        }
        .gm-dropdown-menu>div:hover{
            background: #e6f7ff;
            color: #1890ff;
        }
    `)
    // 插件信息
    GM_addStyle(`
        #MyPlugVer {
            font-size: .729vw;
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
    // 全局checkbox样式
    GM_addStyle(`
        .gm-switch {
            --button-width: 2.085vw;
            --button-height: 1.0417vw;
            --toggle-diameter: .8334vw;
            --loading-diameter: .72955vw;
            --button-toggle-offset: calc((var(--button-height) - var(--toggle-diameter)) / 2);
            --button-loading-offset: calc((var(--button-height) - var(--loading-diameter)) / 2);
            --toggle-shadow-offset: .5209vw;
            --toggle-wider: 1.0417vw;
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
            border: .1vw solid rgba(0, 0, 0, 0);
            border-top-color: #cacaca;
            --loading-transform: translateX(var(--button-loading-offset));
            transform: var(--loading-transform);
            animation: gm-switch-loading 1s linear infinite;
        }
        .gm-switch input[type="checkbox"][loading="true"]:checked + .gm-slider::before {
            --loading-transform: translateX(calc(var(--button-width) - var(--loading-diameter) - var(--button-loading-offset)));
            transform: var(--loading-transform);
        }
        @keyframes gm-switch-loading {
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
        }
        .gm-button.disabled {
            transition: none;
            cursor: no-drop !important;
            filter: brightness(0.8) !important;
        }
        .gm-button {
            height: 1.4vw;
            line-height: 1.4vw;
            font-size: .75vw;
            padding: 0 0.8vw;
            border-radius: 0.25vw;
        }
        .gm-button.small {
            height: 1.2vw;
            line-height: 1.15vw;
            font-size: .65vw;
            padding: 0 0.4vw;
            border-radius: 0.2vw;
        }
        .gm-button.large {
            height: 1.8vw;
            line-height: 1.75vw;
            font-size: .75vw;
            padding: 0 1vw;
            border-radius: 0.25vw;
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
    `)
}