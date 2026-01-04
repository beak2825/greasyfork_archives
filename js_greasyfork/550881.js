// ==UserScript==
// @name         네이버 카페 댓글 모아보기
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  네이버 카페 게시물에서 특정 유저 댓글을 모아보기 
// @author       로시커여워
// @match        https://cafe.naver.com/*
// @icon         https://littledeep.com/wp-content/uploads/2020/09/naver-icon-style.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550881/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EB%8C%93%EA%B8%80%20%EB%AA%A8%EC%95%84%EB%B3%B4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/550881/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EB%8C%93%EA%B8%80%20%EB%AA%A8%EC%95%84%EB%B3%B4%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_USERS = ["챈나", "주머기", "정키마"];

    function loadUsers() {
        const saved = localStorage.getItem("targetUsers");
        return saved ? JSON.parse(saved) : [...DEFAULT_USERS];
    }

    function saveUsers(users) {
        localStorage.setItem("targetUsers", JSON.stringify(users));
    }

    let targetUsers = loadUsers();
    let listContainer = null;
    const seenComments = new Set();
    const userColors = new Map();
    let collapsed = false;

    function getUserColor(name) {
        if (userColors.has(name)) return userColors.get(name);
        const color = `hsl(${Math.floor(Math.random()*360)}, 70%, 50%)`;
        userColors.set(name, color);
        return color;
    }

    function removeModal() {
        const modal = window.top.document.querySelector("#commentModal");
        if (modal) modal.remove();
        const settings = window.top.document.querySelector("#settingsModal");
        if (settings) settings.remove();
        listContainer = null;
        seenComments.clear();
    }

    function openSettings() {
        if (window.top.document.querySelector("#settingsModal")) return;

        const settingsBox = window.top.document.createElement("div");
        settingsBox.id = "settingsModal";
        settingsBox.style.cssText = `
            position: fixed !important;
            top: 160px;
            left: 50%;
            transform: translateX(-50%);
            width: 360px;
            height: 280px;
            background: #fff;
            border: 2px solid #444;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 2147483647 !important;
            display: flex;
            flex-direction: column;
            font-family: sans-serif;
        `;

        settingsBox.innerHTML = `
            <div id="settingsHeader" style="
                cursor: move;
                padding: 10px;
                background: #2c7;
                color: #fff;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            ">
                <span>멤버 설정</span>
                <button id="closeSettingsBtn" style="background:none;border:none;color:#fff;font-size:14px;cursor:pointer;">✕</button>
            </div>
            <div style="flex:1; padding:10px; display:flex; flex-direction:column; gap:10px;">
                <textarea id="userListInput" style="flex:1; resize:none; font-size:14px; padding:5px;">${targetUsers.join("\n")}</textarea>
                <button id="saveUsersBtn" style="align-self:flex-end; padding:5px 12px; cursor:pointer; border:1px solid #ccc; border-radius:4px; background:#f5f5f5;">저장</button>
            </div>
        `;

        window.top.document.body.appendChild(settingsBox);

        settingsBox.querySelector("#saveUsersBtn").addEventListener("click", () => {
            const newList = settingsBox.querySelector("#userListInput").value
                .split("\n")
                .map(s => s.trim())
                .filter(Boolean);
            targetUsers = newList;
            saveUsers(newList);
            settingsBox.remove();
        });

        settingsBox.querySelector("#closeSettingsBtn").addEventListener("click", () => {
            settingsBox.remove();
        });

        const header = settingsBox.querySelector("#settingsHeader");
        let isDragging = false, offsetX = 0, offsetY = 0;

        header.addEventListener("mousedown", (e) => {
            if (e.target.tagName === "BUTTON") return;
            isDragging = true;
            const rect = settingsBox.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            window.top.document.body.style.userSelect = "none";
        });

        window.top.document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                settingsBox.style.left = `${e.clientX - offsetX}px`;
                settingsBox.style.top = `${e.clientY - offsetY}px`;
                settingsBox.style.right = "auto";
                settingsBox.style.transform = "none";
            }
        });

        window.top.document.addEventListener("mouseup", () => {
            isDragging = false;
            window.top.document.body.style.userSelect = "";
        });
    }

    function openModal() {
        if (window.top.document.querySelector("#commentModal")) return;

        const modalBox = window.top.document.createElement("div");
        modalBox.id = "commentModal";
        modalBox.style.cssText = `
            position: fixed !important;
            top: 100px;
            right: 10px;
            width: 420px;
            height: 600px;
            background: #fff;
            border: 2px solid #444;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 2147483647 !important;
            display: flex;
            flex-direction: column;
            font-family: sans-serif;
            transition: height 0.3s ease;
        `;

        modalBox.innerHTML = `
            <div id="modalHeader" style="
                cursor: move;
                padding: 10px;
                background: #2c7;
                color: #fff;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            ">
                <span>멤버 댓글 모아보기</span>
                <div>
                    <button id="openSettingsBtn" style="background:none;border:none;color:#fff;font-size:14px;cursor:pointer;margin-right:5px;">멤버설정⚙</button>
                    <button id="toggleModal" style="background:none;border:none;color:#fff;font-size:14px;cursor:pointer;">⬆숨기기</button>
                </div>
            </div>
            <div id="comment-list" style="flex:1; overflow-y:auto; padding:5px; font-size:14px; line-height:1.4;"></div>
        `;

        window.top.document.body.appendChild(modalBox);

        listContainer = modalBox.querySelector("#comment-list");

        modalBox.querySelector("#openSettingsBtn").addEventListener("click", openSettings);

        modalBox.querySelector("#toggleModal").addEventListener("click", (e) => {
            collapsed = !collapsed;
            if (collapsed) {
                modalBox.style.height = "50px";
                modalBox.style.overflow = "hidden";
                e.target.innerText = "⬇펼치기";
            } else {
                modalBox.style.height = "600px";
                modalBox.style.overflow = "visible";
                e.target.innerText = "⬆숨기기";
            }
        });

        const header = modalBox.querySelector("#modalHeader");
        let isDragging = false, offsetX = 0, offsetY = 0;

        header.addEventListener("mousedown", (e) => {
            if (e.target.tagName === "BUTTON") return;
            isDragging = true;
            const rect = modalBox.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            window.top.document.body.style.userSelect = "none";
        });

        window.top.document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                modalBox.style.left = `${e.clientX - offsetX}px`;
                modalBox.style.top = `${e.clientY - offsetY}px`;
                modalBox.style.right = "auto";
            }
        });

        window.top.document.addEventListener("mouseup", () => {
            isDragging = false;
            window.top.document.body.style.userSelect = "";
        });
    }

    function collectComments() {
        openModal();

        const comments = document.querySelectorAll(".comment_area, li.CommentItem, div.CommentItem");

        comments.forEach(comment => {
            const nicknameEl = comment.querySelector('[class*="nickname"], .comment_nickname');
            const textEl = comment.querySelector('[class*="text"], .text_comment');
            const timeEl = comment.querySelector('[class*="date"], .comment_date, .comment_info_date');
            const avatarEl = comment.querySelector("img");

            const nickname = (nicknameEl?.innerText || "").trim();
            const content = (textEl?.innerText || "").trim();
            const time = (timeEl?.innerText || "").trim();

            if (nickname && content && targetUsers.includes(nickname)) {
                const key = nickname + "::" + content + "::" + time;
                if (seenComments.has(key)) return;
                seenComments.add(key);

                const color = getUserColor(nickname);

                const item = document.createElement("div");
                item.style.borderBottom = "1px solid #eee";
                item.style.padding = "5px 0";

                const id = "comment-" + Math.random().toString(36).slice(2);
                comment.setAttribute("data-comment-id", id);

                let avatarHTML = "";
                if (avatarEl) {
                    avatarHTML = `<img src="${avatarEl.src}" style="width:25px;height:25px;border-radius:50%;margin-right:3px;">`;
                }

                item.innerHTML = `
                    <div style="font-weight:bold;margin-bottom:3px;display:flex;align-items:center;gap:6px;">
                        ${avatarHTML}
                        <span style="color:${color};">${nickname}</span>
                        <span style="color:#888;font-size:12px;margin-left:auto;">${time}</span>
                        <button style="margin-left:6px;padding:2px 6px;font-size:12px;cursor:pointer;border:1px solid #ccc;border-radius:4px;background:#f5f5f5;" data-target="${id}">이동</button>
                    </div>
                    <div>${content}</div>
                `;

                listContainer.appendChild(item);

                item.querySelector("button").addEventListener("click", (e) => {
                    const targetId = e.target.getAttribute("data-target");
                    const targetEl = document.querySelector(`[data-comment-id="${targetId}"]`);
                    if (targetEl) {
                        targetEl.scrollIntoView({behavior: "smooth", block: "center"});
                        targetEl.style.backgroundColor = "yellow";
                        setTimeout(() => targetEl.style.backgroundColor = "", 1000);
                    }
                });
            }
        });
    }

    function debounce(func, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            removeModal();
        }
    }).observe(document, {subtree: true, childList: true});

    window.addEventListener("load", () => {
        openModal();
        collectComments();

        const commentContainer = document.querySelector(".comment_list_area") || document.body;
        const observer = new MutationObserver(
            debounce(() => {
                collectComments();
            }, 500)
        );
        observer.observe(commentContainer, { childList: true, subtree: true });
    });
})();
