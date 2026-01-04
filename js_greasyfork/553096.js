// ==UserScript==
// @name        哔哩哔哩粉丝勋章墙全部展示
// @namespace   https://space.bilibili.com/9970028
// @version     1.1
// @description 适用于哔哩哔哩平台，粉丝勋章墙最多展示200个，此脚本能显示全部勋章或只显示开播中的勋章。
// @author      9970028
// @match       https://live.bilibili.com/*/live-fansmedal-wall/*
// @icon        https://www.bilibili.com/favicon.ico
// @run-at      document-start
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/553096/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%B2%89%E4%B8%9D%E5%8B%8B%E7%AB%A0%E5%A2%99%E5%85%A8%E9%83%A8%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/553096/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%B2%89%E4%B8%9D%E5%8B%8B%E7%AB%A0%E5%A2%99%E5%85%A8%E9%83%A8%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    if(`${window.location}`.includes("tid")) return
    this.page = 1
    this.enableShowLiveOnly = GM_getValue("enableShowLiveOnly", false)
    GM_registerMenuCommand(`只显示开播中的勋章：${this.enableShowLiveOnly ? "开启" : "关闭"}`, () => {this.enableShowLiveOnly = !this.enableShowLiveOnly; GM_setValue("enableShowLiveOnly", this.enableShowLiveOnly); window.location.reload()})
    const ORIGIN_XHR = unsafeWindow.XMLHttpRequest
    const SPACE_BASEURL = "https://space.bilibili.com/"
    const LIVE_BASEURL = "https://live.bilibili.com/"
    function joinMedal(dom_list, list_datav, single_datav, medal_datav){
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/panel?page=${this.page}&page_size=50`,
            onload: res => {
                res = JSON.parse(res.response)
                if(res.code == 0){
                    let list = res.data.list
                    for(let index = 0; index < list.length; index++){
                        let data = list[index]
                        let uid = data.uinfo_medal.ruid
                        let rid = data.room_info.room_id
                        let status = data.room_info.living_status
                        let name = data.anchor_info.nick_name
                        let avatar = data.anchor_info.avatar
                        let medal = data.uinfo_medal.name
                        let lv = data.uinfo_medal.level
                        let now_intimacy = data.medal.intimacy
                        let next_intimacy = data.medal.next_intimacy
                        let color_text = data.uinfo_medal.v2_medal_color_text
                        let color_border = data.uinfo_medal.v2_medal_color_border
                        let color_start = data.uinfo_medal.v2_medal_color_start
                        let color_end = data.uinfo_medal.v2_medal_color_end
                        let today_feed = data.medal.today_feed
                        let day_limit = data.medal.day_limit
                        let innerHTML = `
                                        <div ${`data-v-${list_datav}`} class="single" onclick="window.open('${status ? LIVE_BASEURL + rid : SPACE_BASEURL + uid}')">
                                            <div ${`data-v-${single_datav}`} class="content item">
                                                <img ${`data-v-${single_datav}`} src="${avatar}" onerror="this.src='//i0.hdslb.com/bfs/face/member/noface.jpg'" class="${status ? 'face living' : 'face'}">
                                                <div ${`data-v-${single_datav}`} class="info guardBg-0">
                                                    <div ${`data-v-${single_datav}`} class="name">${name}</div>
                                                    <div ${`data-v-${medal_datav}`} class="fans-medal-item" style="background-image: linear-gradient(45deg, ${color_start}, ${color_end}); --borderColor: ${color_border};">
                                                        <div ${`data-v-${medal_datav}`} class="fans-medal-label">
                                                            <div ${`data-v-${medal_datav}`} class="fans-medal-content" style="color: ${color_text};">${medal}</div>
                                                        </div>
                                                        <div ${`data-v-${medal_datav}`} class="fans-medal-level">
                                                            <div ${`data-v-${medal_datav}`} class="fans-medal-level-font" style="color: ${color_text};">${lv}</div>
                                                        </div>
                                                    </div>
                                                    <div ${`data-v-${single_datav}`} class="num">亲密度
                                                        <div ${`data-v-${single_datav}`} class="progress">
                                                            <span ${`data-v-${single_datav}`} class="blue" style="width: 41.9841px;"></span>
                                                        </div>
                                                        <span ${`data-v-${single_datav}`} class="rate">${now_intimacy}/${next_intimacy}</span>
                                                    </div>
                                                    <div ${`data-v-${single_datav}`} class="limit">今日上限
                                                        <span ${`data-v-${single_datav}`} class="before">${today_feed}</span>
                                                        <span ${`data-v-${single_datav}`}>/${day_limit}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                        `
                        if(!this.enableShowLiveOnly || this.enableShowLiveOnly && status) dom_list.innerHTML += innerHTML
                    }
                    if(this.page < res.data.page_info.total_page){
                        this.page++
                        joinMedal(dom_list, list_datav, single_datav, medal_datav)
                    }
                }
            }
        })
    }
    unsafeWindow.XMLHttpRequest = function(){
        const XHR = new ORIGIN_XHR()
        const ORIGIN_OPEN = XHR.open
        const ORIGIN_SEND = XHR.send
        let interceptedUrl = null
        XHR.open = function(method, url, ...args){
            interceptedUrl = url
            return ORIGIN_OPEN.call(this, method, url, args)
        }
        XHR.send = function(...args){
            this.addEventListener("load", function(){
                if(interceptedUrl && interceptedUrl.includes("MedalWall")){
                    let dom_list = document.getElementsByClassName("list")[0]
                    let dom_single = document.getElementsByClassName("single")[0]
                    let dom_medal = document.getElementsByClassName("fans-medal-item")[0]
                    let list_datav = dom_list.innerHTML.split("data-v-")[1].split(" ")[0]
                    let single_datav = dom_single.innerHTML.split("data-v-")[1].split(" ")[0]
                    let medal_datav = dom_medal.innerHTML.split("data-v-")[1].split(" ")[0]
                    let style_empty = document.createElement("style")
                    style_empty.textContent = `.empty::after { content: "已经到底了哦~" !important; }`
                    document.head.appendChild(style_empty)
                    dom_list.innerHTML = ""
                    joinMedal(dom_list, list_datav, single_datav, medal_datav)
                }
            })
            return ORIGIN_SEND.apply(this, args)
        }
        return new Proxy(XHR, {
            get(target, prop) {
                const value = target[prop];
                return typeof value === 'function' ? value.bind(target) : value;
            },
            set(target, prop, value) {
                target[prop] = value;
                return true;
            }
        });
    }
})();