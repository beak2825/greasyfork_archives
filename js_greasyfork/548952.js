// ==UserScript==
// @name         RakuenForMobile
// @version      0.3
// @description  优化手机端超展开浏览
// @author       kedvfu
// @include     http*://bgm.tv/*
// @include     http*://chii.in/*
// @include     http*://bangumi.tv/*
// @license      MIT
// @run-at       document-end
// @namespace https://greasyfork.org/users/1302565
// @downloadURL https://update.greasyfork.org/scripts/548952/RakuenForMobile.user.js
// @updateURL https://update.greasyfork.org/scripts/548952/RakuenForMobile.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const url = window.location.pathname + window.location.search;
    const top = window.top;
    const mainDocument = top.document;
    const $container = $(mainDocument).find("#container");
    const $rakuenHeader = $(mainDocument).find("#rakuenHeader");
    const $listFrameWrapper = $(mainDocument).find("#listFrameWrapper");
    const $contentFrameWrapper = $(mainDocument).find("#contentFrameWrapper");
    const $rakuenNav = $(mainDocument).find("ul.rakuen_nav");
    const $windowBody = $(mainDocument).find("body");
    const $windowHtml = $(mainDocument).find("html");
    const rakuenHeaderHeight = 60;


    const addRakuenTabFocus = (url) => {
        switch (url) {
            case "/rakuen/topiclist":
                $("#topiclistAll").addClass("focus");
                break;
            case "/rakuen/topiclist?type=group":
                $("#topiclistGroup").addClass("focus");
                break;
            case "/rakuen/topiclist?type=subject":
                $("#topiclistSubject").addClass("focus");
                break;
            case "/rakuen/topiclist?type=ep":
                $("#topiclistEp").addClass("focus");
                break;
            case "/rakuen/topiclist?type=mono":
                $("#topiclistMono").addClass("focus");
                break;
            default:
                break;
        }
    }
    const loadRight = (itemHref) => {
        window.top.isNewRakuenRightLoaded = false;
        $contentFrameWrapper.find("iframe").attr("src", itemHref);
        $listFrameWrapper.fadeOut(100);
        Object.defineProperty(window.top, 'isNewRakuenRightLoaded', {
            set(value) {
                if (value === true) {
                    $contentFrameWrapper.fadeIn(100);
                }
                this._isNewRakuenRightLoaded = value;
            },
            get() {
                return this._isNewRakuenRightLoaded;
            }
        });
    }
    const hideRight = () => {
        $contentFrameWrapper.fadeOut(100);
        $listFrameWrapper.fadeIn(100);
    }
    const newRakuenListStyle = `
    body {
    
        background: none;
        margin: 10px 10px 0;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 0 0 2px rgba(0,0,0,.04);
        -webkit-box-shadow: 0 0 0 2px rgba(0,0,0,.04);
    }
    #newRakuenTab {
        padding: 10px;

    }
    ul.new-rakuen-tabs {
        
    }
    ul.new-rakuen-tabs li {
        float: left;
        font-size: 20px;
    }
    ul.new-rakuen-tabs li a {
        margin: 5px 5px 5px 0;
        padding: 2px 10px;
        border: none;
        border-radius:100px;
    }
    
    ul.new-rakuen-tabs li a.focus {
        color: #fff;
        background-color: var(--primary-color,#f09199);
    }
    
    
    `
    const $backToListBtn = $(`<div id="backToListBtn" class="rr"><input class="inputBtn" type="button"></div>`)

    // 判断是否为手机端
    if (!navigator.userAgent.match(/Mobile/)) {

        return;
    }

    if (typeof window.top.isNewRakuenLoaded === "undefined") {
        window.top.isNewRakuenLoaded = false;
    }
    if (typeof window.top.isNewRakuenRightLoaded === "undefined") {
        window.top.isNewRakuenRightLoaded = false;
    }
    if (window.frameElement && window.frameElement.id === "right") {
        if (window.location.pathname === "/rakuen/home") {
            hideRight();
        } else {
            $listFrameWrapper.fadeOut(100);
        }
        window.top.isNewRakuenRightLoaded = true;
    }
    if (url.includes('/rakuen') && !window.top.isNewRakuenLoaded) {

        $windowHtml.css({

            "overflow-y": "hidden"
        })
        $windowBody.css({
           // "max-width":"640px",
            "width": "100%",
            "min-width": "0",


        })
        $container.css({
            "width":"100%",
            "display": "block",
        });

        $rakuenHeader.css({
            "height": rakuenHeaderHeight + "px",
        });
        $listFrameWrapper.css("height", "calc(100% - " + rakuenHeaderHeight + "px)");
        $listFrameWrapper.css({
            "width": "100%",

        });
        $contentFrameWrapper.css({
            "height": `calc(100% - ${rakuenHeaderHeight}px)`,
            "position": "absolute",
            "top": `${rakuenHeaderHeight}px`,
          //  "max-width": "640px",
            "width": "100%",
            "left": "0"
        })

        $contentFrameWrapper.hide();
        window.top.isNewRakuenLoaded = true;
    }
    if (url.includes('/rakuen/topiclist')) {
        document.head.appendChild(document.createElement('style')).textContent = newRakuenListStyle;
        const $rr = $("body > div.rr");
        const $rakuen_infobox = $("#rakuen_infobox");
        const $rakuenTab = $("#rakuenTab");
        const $edenTpcList = $("#eden_tpc_list")
        const $listItems = $edenTpcList.find("li.item_list")
        const $titleAvatarL = $("div a.title.avatar.l")

        const $newRakuenTab = $(`
    <div id="newRakuenTab">
        <ul id="newRakuenTabs" class="new-rakuen-tabs clearit">
            <li><a class="topiclistA" id="topiclistAll" href="/rakuen/topiclist">全部</a></li>
            <li><a class="topiclistA" id="topiclistGroup" href="/rakuen/topiclist?type=group">小组</a></li>
            <li><a class="topiclistA" id="topiclistSubject" href="/rakuen/topiclist?type=subject">条目</a></li>
            <li><a class="topiclistA" id="topiclistEp" href="/rakuen/topiclist?type=ep">章节</a></li>    
            <li><a class="topiclistA" id="topiclistMono" href="/rakuen/topiclist?type=mono">人物</a></li>
        </ul>
    </div>`);


        $rr.remove()
        $rakuen_infobox.remove()
        $rakuenTab.remove()
        $edenTpcList.before($newRakuenTab)
        // $edenTpcList.css({
        //
        // })
        $titleAvatarL.css({
            "font-size": "20px",
            "height": "60px",
        })
        $(".topiclistA").css({
            "height": "50px",
            "line-height": "50px",
            "font-size": "32px"
        })
        $(".newRakuenTabs").css({
            "padding":"10px"
        })

        addRakuenTabFocus(url)

        $listItems.each((index, item) => {
            const $item = $(item)
            const itemHref = $item.find("div.inner a.title").attr("href")
            // const itemTitle = $item.find("div.inner a.title").text()
            // const itemImage = $item.find("span.avatarNeue").attr("style").match(/url\((.*?)\)/)[1]
            // const itemSourceHref = $item.find("div.inner span.row a").attr("href")
            // const itemSourceTitle = $item.find("div.inner span.row a").text()
            // const itemCommentCount = $item.find("div.inner small.grey").text().match(/\d+/)[0]
            // const itemUpdatedTime = $item.find("div.inner span.row small.grey").text()
            $item.on("click", () => {
                loadRight(itemHref)
            })

        })
    }
})();