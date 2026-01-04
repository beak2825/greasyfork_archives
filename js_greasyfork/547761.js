// ==UserScript==
// @name         Flight Rising: Quick Ping
// @namespace    https://github.com/dragonjpg
// @version      1.0.1
// @description  Adds a button to the post controls that functions like Quick Reply. It appends a ping for the author of the post using FR's existing function for appending BBCode tags to textareas.
// @author       dragon.jpg
// @license      MIT
// @match        https://www1.flightrising.com/forums/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547761/Flight%20Rising%3A%20Quick%20Ping.user.js
// @updateURL https://update.greasyfork.org/scripts/547761/Flight%20Rising%3A%20Quick%20Ping.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // try to select all the posts on the page
    var posts = document.querySelectorAll(".post .post-frame");

    // if posts exist we're in a thread
    if (posts.length > 0) {
        console.log(`quick ping button script: adding buttons to ${posts.length} post(s).`);
        // set up ping button template to clone
        const pingButton = document.createElement("div");
        pingButton.className = "post-action";
        pingButton.classList.add("post-action-quick-ping");
        pingButton.style = "cursor: pointer; position: relative;";
        pingButton.innerHTML = `<img src="/static/cms/icons/484.png" alt="Ping">`;

        // adding css for pseudo tooltips
        var css = `.post-action-quick-ping::after { content: attr(data-tip); width: 180px; height: auto; line-height: 120%;
        color: var(--text, #000); background: var(--tooltip-bg, #fff); border-radius: 10px;
        font-size: inherit; position: absolute; border:1px solid var(--borders, #888);box-shadow:rgba(0, 0, 0, 0.5) 1px 1px 6px;
        top: calc(100% + 6px); left: calc(50% - 40px); padding: 8px; box-sizing: border-box; z-index: 2; display: none; }
        .post-action-quick-ping:hover::after, .post-action-quick-ping:focus::after { display: block; }
        .thread-locked { pointer-events: none !important; user-select: none; opacity: 0.5; }`,
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            me = document.querySelector("#namespan span").innerText,
            thread_locked = false;

        head.appendChild(style);
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));

        // checking if thread is locked
        if (document.querySelector("#lockmsg") != null) {
            console.log("thread is locked.");
            thread_locked = true
        }

        // loop thru posts, skipping blocked posts or our own posts
        posts.forEach((post) => {
            //skip our own posts or blocked posts
            if (post.querySelector(".post-author-username") == null) {
                console.log("blocked post, skipping");
            } else if (post.querySelector(".post-author-username").innerText.localeCompare(me) == 0) {
                console.log("it's your post, skipping");
                if (thread_locked) {
                    post.querySelector(".post-action-quote").setAttribute("disabled","disabled");
                    post.querySelector(".post-action-quote").classList.add("thread-locked");
                }
            } else {
                //clone the premade button
                var copiedPingButton = pingButton.cloneNode(true);

                // set data-name & title
                copiedPingButton.setAttribute("data-name",post.querySelector(".post-author-username").innerText);
                copiedPingButton.setAttribute("data-tip",`Click to ping ${copiedPingButton.getAttribute("data-name")} in a quick reply.`);

                // add the button to the page and insert it into the post header after the quote button
                post.querySelector(".post-header .post-actions").appendChild(copiedPingButton);
                post.querySelector(".post-header .post-actions .post-action-quote").after(copiedPingButton);

                // if thread is locked we're gonna disable the quote & ping buttons because they don't do anything anyways. this is kinda just for looks lol
                if (thread_locked) {
                    [post.querySelector(".post-action-quote"), copiedPingButton].forEach((ele) => {
                        ele.setAttribute("disabled","disabled");
                        ele.classList.add("thread-locked");
                    });
                } else {
                    // otherwise we'll add a click event
                    copiedPingButton.addEventListener("click",function (e) {
                        // grab username
                        var username = this.getAttribute("data-name");
                        // use the existing site function that's used to add BBCode tags to textareas to append the ping to the reply box.
                        doAddTags(`@${username} `,'','message');
                        // like the quote button, will immediately focus the reply box after appending ping
                        document.querySelector("#message").focus();
                    });
                }
            }
        });
        console.log("quick ping button script: done!");
    } else { // otherwise skip, since we must be looking at the topic list/making a thread/editing a reply
        console.log("quick ping button script: not in a thread, skipping.");
    }
})();
