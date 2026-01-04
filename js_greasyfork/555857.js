// ==UserScript==
// @name         PipyPipy
// @namespace    https://ez118.github.io/
// @version      0.0.5
// @description  将移动端B站网页用作软件
// @author       ZZY_WISU
// @match        *://m.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @license      GPLv3
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @require      https://unpkg.com/mithril/mithril.min.js
// @downloadURL https://update.greasyfork.org/scripts/555857/PipyPipy.user.js
// @updateURL https://update.greasyfork.org/scripts/555857/PipyPipy.meta.js
// ==/UserScript==

const ICON = {
    'home':     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"></path></svg>',
    'search':   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"></path></svg>',
    'star':     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"></path></svg>',
    'sync':     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M160-160v-80h110l-16-14q-52-46-73-105t-21-119q0-111 66.5-197.5T400-790v84q-72 26-116 88.5T240-478q0 45 17 87.5t53 78.5l10 10v-98h80v240H160Zm400-10v-84q72-26 116-88.5T720-482q0-45-17-87.5T650-648l-10-10v98h-80v-240h240v80H690l16 14q49 49 71.5 106.5T800-482q0 111-66.5 197.5T560-170Z"></path></svg>',

    'back':     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"></path></svg>'
};


/* 用于对接浏览器接口（便于后续代码用于浏览器扩展、electron等场景） */
const native = {
    requestGet: function(url) {
        if(typeof(window.via) == "object" || typeof(window.mbrowser) == "object") {
            return fetch(url).then(function(response) {
                return response.text();
            }).then(function(data) {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    return data;
                }
            }).catch(function(error) {
                console.error('Fetch error:', error);
                throw error;
            });
        } else {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    // 重要：设置 responseType 为 'text' 以获取原始文本
                    responseType: "text",

                    // 请求成功时的回调
                    onload: function(response) {
                        try {
                            // 尝试解析 JSON
                            if (response.response && response.response.trim()) {
                                // 检查响应是否为有效 JSON（避免空字符串或纯空白）
                                const data = JSON.parse(response.response);
                                resolve(data);
                            } else {
                                // 如果是空响应，返回空对象或空字符串，根据需求决定
                                resolve(""); // 或者 resolve(null); 或 resolve({});
                            }
                        } catch (e) {
                            // 解析失败，返回原始文本
                            resolve(response.response);
                        }
                    },

                    // 请求失败时的回调
                    onerror: function(error) {
                        console.error('GM_xmlhttpRequest error:', error);
                        reject(error);
                    },

                    // 超时处理（可选）
                    timeout: 10000, // 10秒超时
                });
            });
        }
    },
    storageGet(key, callback) {
        // 获取本地存储项（同步）
        var ls = localStorage.getItem(key);
        try {
            return JSON.parse(ls);
        } catch (e) {
            return ls; // 如果解析失败，返回原始字符串
        }
    },
    storageSet(key, value) {
        // 设置本地存储项（同步）
        try {
            // 尝试将值转换为 JSON 字符串
            value = JSON.stringify(value);
        } catch (e) { }
        localStorage.setItem(key, value);
    },
    storageRemove(key) {
        // 移除本地存储项
        localStorage.removeItem(key);
    }
}

/* 对接B站的API */
class BiliApi {
    constructor() {
        this.baseUrl = 'https://api.bilibili.com/';
        this.baseLiveUrl = 'https://api.live.bilibili.com/';
        this.baseChatUrl = 'https://api.vc.bilibili.com/';

        this.rcmdCnt = 0;
    }

    getHomeRecommend() {
        this.rcmdCnt ++;
        return native.requestGet(`${this.baseUrl}x/web-interface/wbi/index/top/feed/rcmd?web_location=1430650&y_num=5&fresh_type=4&feed_version=V8&fresh_idx_1h=${this.rcmdCnt}&fetch_row=${(this.rcmdCnt * 3 + 1)}&fresh_idx=${this.rcmdCnt}&brush=${(this.rcmdCnt - 1)}&homepage_ver=1&ps=12&y_num=4&last_y_num=5&device=win`)
            .then((data) => {
            return data.data.item.map((item) => ({
                bvid: item.bvid,
                aid: item.id,
                pic: item.pic,
                title: item.title,
                desc: item.title,
                author: { uid: item.owner.mid, name: item.owner.name },
            }));
        })
            .catch(error => console.error('Error fetching data:', error));
    }

    getHomePopular(page) {
        return native.requestGet(`${this.baseUrl}x/web-interface/popular?ps=40&pn=${page}`)
            .then((data) => {
            return data.data.list.map((item) => ({
                bvid: item.bvid,
                aid: item.aid,
                pic: item.pic,
                title: item.title,
                desc:
                `- 点赞数量: ${item.stat.like}\n- 视频简介: ${item.desc ? item.desc : "无简介"
            }` +
                (item.rcmd_reason.content
                 ? `\n- 推荐原因: ${item.rcmd_reason.content}`
                            : ""),
                author: { uid: item.owner.mid, name: item.owner.name },
            }));
        })
            .catch(error => console.error('Error fetching data:', error));
    }

    getHomeLiveRooms(page) {
        return native.requestGet(`${this.baseLiveUrl}room/v1/Index/getShowList?page=${page}&page_size=20&platform=web`)
            .then((data) => {
            return data.data.map((item) => ({
                roomid: item.roomid,
                pic: item.user_cover,
                title: item.title,
                desc: `- 分区: ${item.area_name}/${item.area_v2_name}`,
                author: { uid: item.uid, name: item.uname },
            }));
        })
            .catch(error => console.error('Error fetching data:', error));
    }

    getDynamicUpList() {
        return native.requestGet(`${this.baseUrl}x/polymer/web-dynamic/v1/portal?up_list_more=0`)
            .then((data) => {
            return data.data.up_list.map((item) => ({
                uid: item.mid,
                name: item.uname,
                pic: item.face,
                has_update: item.has_update
            }));
        })
            .catch(error => console.error('Error fetching data:', error));
    }

    getAllDynamics() {
        let jsonList = [];
        let promises = [];
        let offset = null;

        for (let page = 1; page <= 3; page++) {
            promises.push(
                native.requestGet(`${this.baseUrl}x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&offset=${offset || ""}&type=video&platform=web&page=${page}`)
                .then((data) => {
                    jsonList = jsonList.concat(data.data.items.map(item => ({
                        bvid: item.modules.module_dynamic.major.archive.bvid,
                        aid: item.modules.module_dynamic.major.archive.aid,
                        pic: item.modules.module_dynamic.major.archive.cover,
                        title: item.modules.module_dynamic.major.archive.title,
                        desc: (item.modules.module_dynamic.desc ? ("动态内容: " + item.modules.module_dynamic.desc.text + "\n") : "") +
                        '点赞数量: ' + item.modules.module_stat.like.count + '\n视频简介: ' +
                        item.modules.module_dynamic.major.archive.desc,
                        author: { uid: item.modules.module_author.mid, name: item.modules.module_author.name }
                    })));

                    offset = data.data.offset;
                })
                .catch(error => { throw error; })
            );
        }

        return Promise.all(promises)
            .then(() => {
            return jsonList;
        })
            .catch((error) => console.error("Error fetching data:", error))
    }

    getSingleDynamics(uid) {
        return native.requestGet(`${this.baseUrl}x/polymer/web-dynamic/v1/feed/space?offset=&host_mid=${uid}&timezone_offset=-480&platform=web&type=video`)
            .then((data) => {
            return data.data.items.map(item => ({
                bvid: item.modules.module_dynamic.major.archive.bvid,
                aid: item.modules.module_dynamic.major.archive.aid,
                pic: item.modules.module_dynamic.major.archive.cover,
                title: item.modules.module_dynamic.major.archive.title,
                desc: (item.modules.module_dynamic.desc ? ("动态内容: " + item.modules.module_dynamic.desc.text + "\n") : "") +
                '点赞数量: ' + item.modules.module_stat.like.count + '\n视频简介: ' +
                item.modules.module_dynamic.major.archive.desc,
                author: { uid: item.modules.module_author.mid, name: item.modules.module_author.name }
            }));
        })
            .catch(error => console.error('Error fetching data:', error));
    }

    getSearchResults(keyword, search_type, page = 1) {
        return native.requestGet(`${this.baseUrl}x/web-interface/wbi/search/all/v2?keyword=${encodeURIComponent(keyword)}&page=${page}&page_size=20&web_location=1280306&platform=h5`)
            .then((data) => {
            console.log(data.data)
            if (!data.data.result[11].data || data.data.result[11].data.length == 0) { return []; }

            switch (search_type) {
                case "video":
                    return data.data.result[11].data.map(item => ({
                        bvid: item.bvid,
                        aid: item.aid,
                        pic: item.pic.includes("://") ? item.pic : "https:" + item.pic,
                        title: item.title,
                        desc: item.description,
                        author: { uid: item.mid, name: item.author }
                    }));

                case "bili_user":
                    return data.data.result.map(item => ({
                        uid: item.mid,
                        name: item.uname,
                        pic: item.upic.includes("://") ? item.upic : "https:" + item.upic,
                        desc: item.usign,
                        sign: item.usign
                    }));

                case "live":
                    return data.data.result.live_room.map(item => ({
                        roomid: item.roomid,
                        pic: item.cover.includes("://") ? item.cover : "https:" + item.cover,
                        title: item.title,
                        desc: '- 开始时间: ' + item.live_time,
                        author: { uid: item.uid, name: item.uname }
                    }));

                default:
                    console.error('Unsupported search type:', search_type);
                    break;
            }
        })
            .catch(error => console.error('Error fetching search results:', error));
    }

    getAtMe() {
        return native.requestGet(`${this.baseUrl}x/msgfeed/at?build=0&mobi_app=web`)
            .then((data) => {
            return data.data.items.map(item => ({
                content: item.item.source_content,
                desc: "在" + item.item.business + "中@了你",
                quote: {
                    video: {
                        bvid: null,
                        aid: item.item.subject_id,
                        title: item.item.title,
                        pic: item.item.image || null,
                        desc: null,
                        author: null
                    }
                },
                user: { uid: item.user.mid, name: item.user.nickname, pic: item.user.avatar }
            }));
        }).catch(error => console.error('Error fetching data:', error));
    }

    getMsgSessions() {
        /* 获取聊天列表 */
        return native.requestGet(`${this.baseChatUrl}session_svr/v1/session_svr/get_sessions?session_type=1&group_fold=1&unfollow_fold=0&sort_rule=2&mobi_app=web`)
            .then((sessionInfo) => {
            var uidList = [];
            $.each(sessionInfo.data.session_list, (index, item) => {
                uidList.push(item.talker_id);
            });
            return this.getUsersInfo(uidList)
                .then((userInfo) => {
                return sessionInfo.data.session_list.map(item => ({
                    uid: item.talker_id,
                    name: userInfo[item.talker_id].name,
                    pic: userInfo[item.talker_id].face
                }));
            });
        }).catch(error => console.error('Error fetching data:', error));
    }

    getMsgSessionDetail(uid) {
        return native.requestGet(`${this.baseChatUrl}svr_sync/v1/svr_sync/fetch_session_msgs?talker_id=${uid}&session_type=1&size=60`)
            .then((msgInfo) => {
            let result = [];
            msgInfo.data.messages.forEach(item => {
                let msgCard = JSON.parse(item.content);

                result.unshift({
                    content: msgCard.content,
                    quote: {
                        video: {
                            bvid: null,
                            aid: msgCard.id,
                            pic: msgCard.thumb,
                            title: msgCard.title,
                            desc: msgCard.title,
                            author: { uid: item.sender_uid, name: msgCard.author }
                        }
                    },
                    user: { uid: item.sender_uid }
                });
            });

            return result;
        }).catch(error => console.error('Error fetching data:', error));
    }

    getUsersInfo(uids) {
        let uidstr = "";
        uids.map(item => uidstr += item + ",");

        return native.requestGet(`https://api.bilibili.com/x/polymer/pc-electron/v1/user/cards?uids=${uidstr.slice(0, -1)}&mobi_app=web`)
            .then((data) => {
            return data.data;
        }).catch(error => console.error('Error fetching data:', error));
    }

    getUserInfo(uid) {
        if (uid) {
            return native.requestGet(`${this.baseUrl}x/web-interface/card?mid=${uid}`)
                .then((data) => {
                return {
                    "name": data.data.card.name,
                    "uid": data.data.card.mid,
                    "face": data.data.card.face,
                    "sex": data.data.card.sex,
                    "fans": data.data.card.fans,
                    "sign": data.data.card.sign,
                    "level": data.data.card.level_info.current_level,
                    "coins": null
                };
            })
                .catch(error => {
                console.error("Error fetching user profile: ", error);
            });
        } else {
            return native.requestGet(`${this.baseUrl}x/space/v2/myinfo?`)
                .then((data) => {
                if (data.code == -101) {
                    return { "name": null, "uid": null, "face": null, "sign": "未登录" };
                }
                return {
                    "name": data.data.profile.name,
                    "uid": data.data.profile.mid,
                    "face": data.data.profile.face,
                    "sex": data.data.profile.sex,
                    "fans": data.data.follower,
                    "sign": data.data.profile.sign,
                    "level": data.data.profile.level,
                    "coins": data.data.coins
                };
            })
                .catch(error => {
                console.error("Error fetching user profile: ", error);
            });
        }
    }
}
const api = new BiliApi();



const Player = {
    videoUrl: "",
    oninit(vnode) {
        vnode.tag.videoUrl = "";
    },
    play(option){
        document.querySelector("#player").style.display = "block";
        Player.videoUrl = `https://www.bilibili.com/blackboard/html5mobileplayer.html?bvid=${option.bvid || ""}&aid=${option.aid || ""}`;
    },
    close() {
        document.querySelector("#player").style.display = "none";
        Player.videoUrl = ``;
    },
    view(vnode) {
        return [
            m("button.close-btn", { title: "返回", onclick: () => vnode.tag.close() }, m.trust(ICON.back)),
            m("iframe.player-video", { src: vnode.tag.videoUrl })
        ]
    }
}

class NavView {
    constructor() {
        this.navItem = [
            { name: "首页", icon: "home", route: "/home" },
            { name: "动态", icon: "sync", route: "/dynamics" },
            { name: "搜索", icon: "search", route: "/search" },
            { name: "收藏", icon: "star", route: "/collection" }
        ];
        this.selected = "/home";
    }

    oninit() {
        // 获取当前选中项
        setTimeout(() => {
            this.selected = m.route.get() || "/home";
            m.redraw();
        }, 100);
    }

    view(vnode) {
        return this.navItem.map(item => {
            return m(
                m.route.Link,
                {
                    href: item.route,
                    title: item.name,
                    options: {replace: true},
                    onclick: () => {this.selected = item.route}
                },
                m("div", { class: `item${(this.selected == item.route ? " selected" : "")}` }, m.trust(ICON[item.icon]))
            )
        })
    }
}

class HomeView {
    constructor() {}
    oninit(vnode) {
        this.cardList = [];
        this.loadPage("rcmd");
    }
    loadPage(tabname) {
        if (tabname == "rcmd") {
            api.getHomeRecommend().then((data) => {
                this.cardList = data;
                m.redraw();
            }).catch((error) => {
                console.error("Error fetching recommended videos:", error);
            });
        } else if (tabname == "popular") {
            api.getHomePopular(1).then((data) => {
                this.cardList = data;
                m.redraw();
            }).catch((error) => {
                console.error("Error fetching popular videos:", error);
            });
        } else {
            console.error("Unknown tab")
        }
    }
    view() {
        return [
            m("h1.main-title", "PipyPipy"),
            m("div.tabs", [
                m("button.tab", {
                    onclick: () => {
                        this.loadPage("rcmd")
                    }
                }, "推荐"),
                m("button.tab", {
                    onclick: () => {
                        this.loadPage("popular")
                    }
                }, "热门")
            ]),
            m("div.flex-container",
              this.cardList.map(item => {
                return m("div.video-card", {
                    onclick: () => {
                        Player.play(item);
                    },
                }, [
                    m("img.cover", { src: item.pic + "@309w_174h_1c.webp", loading:"eager" }),
                    m("p.title", item.title),
                    m("p.author", item.author.name),
                ])
            })
             )
        ]
    }
}

class DynamicView {
    oninit(vnode) {
        this.cardList = [];
        this.loadPage("all");
    }
    loadPage(uid) {
        if (uid == "all") {
            api.getAllDynamics().then((data) => {
                this.cardList = data;
                m.redraw();
            }).catch((error) => {
                console.error("Error fetching all dynamics:", error);
            });
        } else {
            console.error("Unknown operation")
        }
    }
    view() {
        return [
            m("h1.main-title", "视频动态"),
            m("div.flex-container",
              this.cardList.map(item => {
                return m("div.video-card", {
                    onclick: () => {
                        Player.play(item);
                    },
                }, [
                    m("img.cover", { src: item.pic + "@309w_174h_1c.webp", loading:"eager" }),
                    m("p.title", item.title),
                    m("p.author", item.author.name),
                ])
            })
             ),
            m("div.tabs", [
                m("button.tab", {
                    onclick: () => {
                        this.loadPage("all");
                    }
                }, "点此刷新")
            ]),
        ]
    }
}

class SearchView {
    oninit(vnode) {
        this.cardList = [];
        this.keyword = "";
    }
    loadSearchResult(kw) {
        if(!kw.trim()) {
            this.cardList = [];
            m.redraw();
            return;
        }
        api.getSearchResults(kw, "video", 1).then((data) => {
            this.cardList = data;
            m.redraw();
        }).catch((error) => {
            console.error("Error fetching search results:", error);
        });
    }
    view() {
        return [
            m("h1.main-title", "搜索"),
            m("input.search-input[type='text']", {
                placeholder: "键入以搜索...",
                onkeypress: (event) => {
                    if (event.keyCode === 13) {
                        this.loadSearchResult(event.target.value);
                    }
                }
            }),
            m("div.flex-container",
              this.cardList.map(item => {
                return m("div.video-card", {
                    onclick: () => {
                        Player.play(item);
                    },
                }, [
                    m("img.cover", { src: item.pic + "@309w_174h_1c.webp", loading:"eager" }),
                    m("p.title", item.title.replace(/<[^>]+>/g, "")),
                    m("p.author", item.author.name),
                ])
            })
             )
        ]
    }
}

class CollectionView {
    view() {
        return [
            m("h1.main-title", "收藏"),
        ]
    }
}

(function() {
    'use strict';

    /* 先将B站原先页面内容清空并初始化DOM */
    // window.stop()
    document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <link rel="icon" type="image/vnd.microsoft.icon" href="https://static.hdslb.com/images/favicon.ico">
                <title>PipyPipy</title>
                <style>
                    body{
    	                background-color:#17181a; color: #FFF;
	                    user-select:none; overflow:hidden auto;
                        font-family:"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
	                    height:100%; width:100%; margin:0; padding:0;
	                    overscroll-behavior:none; -webkit-appearance:none;
                        -webkit-tap-highlight-color:transparent;
                    }
                    html{ height:100%; width:100%; touch-action:pan-x pan-y;}
                    *{ box-sizing:border-box; scroll-behavior:smooth; }
                    img{ -webkit-user-drag:none; }
                    a{ text-decoration:none; color:inherit; }

                    nav{
                        --nav-size: 56px;
                        position:fixed; z-index:100;
                        bottom:10px; left:50%; transform:translateX(-50%);
                        width:fit-content; height:var(--nav-size); background:inherit;
                        border:1px solid #88888855; border-radius:var(--nav-size);
                        display:flex;flex-direction:row;justify-content:center;align-items:center; gap:0;
                    }
                    nav .item {
                        display:flex; justify-content:center; align-items:center;
                        width:calc(var(--nav-size) - 8px); height:calc(var(--nav-size) - 8px); border-radius:50%; margin:4px;
                    }
                    nav .item.selected {
                        background:#88888833;
                    }
                    nav .item svg {
                        color:inherit; stroke:currentColor; fill:currentColor;
                        height:28px; width:28px;
                    }

                    main {
                        width:100vw; height:fit-content;
                        padding:0 5px 74px 5px;
                    }
                    main>.main-title {
                        margin:15px 6px; font-size:2em;
                    }

                    .flex-container{display:flex;flex-wrap:wrap;justify-content:flex-start;align-content:flex-start;}

                    .tabs {
                        width:100%; margin:5px 0; height:calc(0.9em + 6px + 10px + 6px); padding:0 3px;
                        background:rgba(255,255,255,0.02);
                        border-radius:1.8em;
                        display:flex; flex-direction:row; align-items:center; justify-content:center; gap:5px;
                    }
                    .tabs .tab {
                        margin:3px 0; padding:5px; flex:1;
                        background:rgba(255,255,255,0.00); color:inherit;
                        outline:1px solid rgba(255,255,255,0.05);
                        border-radius:1.8em; border:none;
                        cursor:pointer; font-size:0.9em;
                    }
                    .tabs .tab:focus {
                        background:rgba(255,255,255,0.05);
                    }

                    .video-card {
                        width:calc(50% - 10px); height:fit-content; min-height:145px; margin:5px;
                        background:rgba(255,255,255,0.05);
                        border-radius:12px; overflow:hidden;
                        transition:opacity 0.15s; cursor:pointer;
                    }
                    .video-card:active {
                        opacity:0.8;
                    }
                    .video-card .cover {
                        width:100%; object-fit:cover;
                    }
                    .video-card .title {
                        font-size:0.9em; margin:3px 5px; padding:0;
                        overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
                    }
                    .video-card .author {
                        font-size:0.8em; margin:5px; padding:0; opacity:0.6;
                        overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
                    }

                    .search-input {
                        width:100%; margin:5px 0; height:calc(0.9em + 6px + 10px + 6px); padding:0 10px;
                        background:rgba(255,255,255,0.02); color:inherit;
                        border-radius:1.8em; outline:none; border: none;
                    }

                    #player {
                        display:block; position:fixed;
                        top:0; left:0; right:0; bottom:0; z-index:110;
                        background:inherit; color:inherit;
                    }

                    #player .close-btn {
                        width:36px; height:36px; padding:6px;
                        border-radius:50%; border:1px solid rgba(255,255,255,0.1);
                        background:inherit; color:inherit; outline:none;
                        position:fixed; top:6px; left:6px; cursor:pointer;
                    }
                    #player .close-btn svg {
                        width:24px; height:24px;
                        color:inherit; stroke:currentColor; fill:currentColor;
                    }

                    #player .player-video {
                        width:100%; height:250px;
                        border:0; margin-bottom:5px;
                        border-bottom:1px solid rgba(255,255,255,0.1);
                    }
                </style>
            </head>
            <body>
                <main></main>
                <nav></nav>
                <div id="player" style="display:none;"></div>
            </body>
        </html>
    `);
    document.close();

    setTimeout(() => {
        m.mount(document.querySelector("nav"), NavView);

        m.mount(document.querySelector("#player"), Player);

        m.route(document.querySelector("main"), "/home", {
            "/home": HomeView,
            "/dynamics": DynamicView,
            "/search": SearchView,
            "/collection": CollectionView,
        })
    }, 100);
})();