// ==UserScript==
// @name         Neopets: Alert and Post Notifications
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Shows a native browser notification whenever you get an alert, random event, refresh your guild board and there's a new post, or refresh a topic and there's a new post.
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      Unlicense
// @grant        GM.notification
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/553556/Neopets%3A%20Alert%20and%20Post%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/553556/Neopets%3A%20Alert%20and%20Post%20Notifications.meta.js
// ==/UserScript==

// TODO cleanup

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does the following:
    - Adds native browser notifications for the following events (can be turned off individually):
        - Alerts (neomail, pound, trading post, etc)
        - Random events
        - New posts in your guild board
        - New posts in an open topic in the neoboards.
    There's an optional setting to turn off alerts for neomail from theneopetsteam, because it's usually spam.
    New posts are not automatically checked. You must refresh the page yourself. Anything else would be grounds for
    freezing. But at least now you can refresh from another tab without looking at it!

    Please note that there's no way to tell two alerts with the same name apart in the old layout. If you get an alert
    with a specific text, don't get a different alert or clear your alerts, and then get another with the same text,
    without visiting the beta layout for both alerts, you'll only be notified the first time.

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

// Never remove a value from here. Set to false if you want it off, true if you want it on.
const settings = {
    alerts: true,
    randomevents: true,
    tntneomail: true,
    guildmessages: true,
    neoboardmessages: true,
    // So! If you only want the script to check for messages in specific topics, add their urls here, enclosed by quotes
    // and separated by commas. If you do that, no other topic will have notifications! For example,
    // neoboardallowlist: ["https://www.neopets.com/neoboards/topic.phtml?topic=164152582", "https://www.neopets.com/neoboards/topic.phtml?topic=164070442"]
    neoboardallowlist: []
}

const getStoredPost = async (id) => (await GM.getValue("posts", [])).find(post => post.id === id);

const setStoredPost = async (data) => {
    const allPosts = await GM.getValue("posts", []);
    const index = allPosts.findIndex(post => post.id === data.id);
    if(index !== -1) allPosts[index] = data;
    else allPosts.push(data);
    GM.setValue("posts", allPosts);
}

const purgePosts = async () => {
    const now = new Date().getTime();
    const allPosts = await GM.getValue("posts", []);
    const purged = allPosts.filter(post => now - post.timestamp < 36288000000);
    GM.setValue("posts", purged);
}

const notify = (title, message, url) => GM.notification({title: title, text: message, onclick: () => window.open(url, "_blank")});

const parseAlert = (alert) => {
    return {
        message: (alert.querySelector("p") ?? alert.childNodes[2])?.textContent.trim(),
        id: alert.querySelector(".alert-x")?.dataset.delid,
        title: alert.querySelector("b, h4")?.textContent,
        url: alert.getElementsByTagName("a")[0]?.href
    }
}

const getAlertData = (lastAlert) => {
    const alert = document.querySelector(".eventIcon, #alerts li");
    if(!alert) return;
    const alertData = parseAlert(alert);
    if(alertData.message === lastAlert.message) alertData.id ||= lastAlert.id;
    return alertData;
}

const checkForAlerts = async () => {
    const lastAlert = await GM.getValue("alert", {});
    const newAlert = getAlertData(lastAlert);
    if(!newAlert?.message || newAlert.message === lastAlert.message) return;
    if(!settings.tntneomail && newAlert.message.contains("theneopetsteam")) return;
    notify(newAlert.title, newAlert.message, newAlert.url);
    GM.setValue("alert", {message: newAlert.message, id: newAlert.id});
}

const notifyRandomEvent = () => {
    notify("Something has happened!", document.querySelector(".randomEvent .copy").textContent, window.location.href);
}

const sanitizeNeoHTML = neoHTML => neoHTML.replaceAll(/<\/?(b|i|font|div)[^>]*>|<\/p>/g, "").replaceAll(/<img[^>]+>/g, "🖼️").replaceAll(/<br>|<p>/g, "\n");

const parseGuildPost = () => {
    return {
        message: sanitizeNeoHTML(document.querySelector("td[align='left'][valign='top'][width='300'] br + br").nextElementSibling.innerHTML),
        id: parseInt(document.querySelector("td[colspan='2'] td[align='left'] a").href.match(/_id=(\d+)/)[1]),
        url: document.querySelector("td[colspan='2'] td[align='left'] a").href.match(/(.+?)&/)[1],
        title: `${document.querySelector("table[cellspacing='1'] td[align='center'] a font").textContent} in your guild`
    }
}

const checkForGuildPost = async () => {
    if(document.querySelector("td[width='100%'] tr:last-child a font b").textContent === '<< Newer') return;
    const lastId = await GM.getValue("guild", 0);
    const newPost = parseGuildPost();
    if(newPost.id === lastId) return;
    GM.setValue("guild", newPost.id);
    if(lastId) notify(newPost.title, newPost.message, newPost.url);
}

const parseNeoboardPost = () => {
    return {
        message: sanitizeNeoHTML(document.querySelector("div > li:last-of-type .boardPostMessage").innerHTML),
        messageId: parseInt(document.querySelector("div > li:last-of-type button a").href.match(/regarding=(\d+)/)[1]),
        url: window.location.href,
        title: `${document.querySelector("div > li:last-of-type .postAuthorName").textContent} @ ${document.getElementsByTagName("h1")[0].textContent.trim()}`
    }
}

const checkForNeoboardPost = async () => {
    const isCurrentPage = !document.querySelector(".boardPageButton-active") || !document.querySelector(".boardPageButton-active ~ a");
    const currentPage = parseInt(window.location.href.match(/next=(\d+)/)[1] ?? 1);
    const topicId = parseInt(window.location.href.match(/topic.phtml\?topic=(\d+)/)[1]);
    const lastPost = await getStoredPost(topicId);
    if(!isCurrentPage) {
        if(lastPost && !lastPost.warned && currentPage >= lastPost.page) {
            notify("New Page!", `You're no longer in the last page of ${document.getElementsByTagName("h1")[0].textContent.trim()}!`, document.querySelector(".pageNav a:nth-last-child(2)").href);
            lastPost.warned = true;
            lastPost.timestamp = (new Date()).getTime();
            setStoredPost(lastPost);
        }
        return;
    }
    const newPost = parseNeoboardPost();
    if(lastPost?.messageId === newPost.messageId) {
        lastPost.warned = false;
        setStoredPost(lastPost);
        return;
    }
    setStoredPost({id: topicId, messageId: newPost.messageId, warned: false, timestamp: (new Date()).getTime(), page: currentPage});
    if(lastPost?.messageId) notify(newPost.title, newPost.message, newPost.url);
}

const canCheckNeoboardPost = () => {
    if(!settings.neoboardmessages) return false;
    if(!window.location.href.match('topic.phtml\\?topic=')) return false;
    if(settings.neoboardallowlist.length > 0 && !settings.neoboardallowlist.some(l => window.location.href.match(l))) return false;
    return true;
}

const initializeScript = async () => {
    await purgePosts();
    if(settings.alerts && document.querySelector("#header, nav-bell-icon__2020")) checkForAlerts();
    if(settings.randomevents && document.querySelector(".randomEvent")) notifyRandomEvent();
    if(settings.guildmessages && window.location.href.match('guild_board.phtml')) checkForGuildPost();
    if(canCheckNeoboardPost()) checkForNeoboardPost();
}

(function() {
    'use strict';
    initializeScript();
})();
