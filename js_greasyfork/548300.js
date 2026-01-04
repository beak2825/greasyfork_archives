// ==UserScript==
// @name         Weed Out Reddit Posts
// @namespace    github.com/JasonAMelancon
// @version      2025-09-06
// @description  Remove unwanted posts from (new) Reddit
// @author       Jason Melancon
// @license      GNU AGPLv3
// @match        http*://www.reddit.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/548300/Weed%20Out%20Reddit%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/548300/Weed%20Out%20Reddit%20Posts.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const DEBUG = false;
    // The msg is in a lambda expression body so that string interpolation only happens if we
    // actually print the message (lazy evaluation).
    function debugLog(lambdifiedMsg) {
        if (DEBUG) console.log(lambdifiedMsg());
    }

    /* REMOVE UNWANTED ELEMENTS */

    let regexList = GM_getValue("regexList", /*default = */[]);
    let logRemovals = GM_getValue("logRemovals", /*default = */true);
    let namedSubredditLists = {};
    let subredditList = []; // parsed anew each line of options; restricts post removal to these subreddits
    let articles = document.querySelectorAll("article");
    const Target = Object.freeze({
        Title: "Title", // enum value
        Flair: "Flair"  // enum value
    });

    // try to get named lists of subreddits from options
    function parseSubredditLists(lines) {
        for (let line of lines) {
            let matches = [];
            if (matches = line.match(/(\w+)\s*=\s*\{\s*(.*?)\s*}\s*$/)) {
                let stringSplit = matches[2].split(/[,;| ]/).map(x => x.trim()).filter(x => !!x);
                namedSubredditLists["_" + matches[1]] = stringSplit;
            }
        }
    }

    // get pattern, intended search target, and subreddit list --
    // assemble list of subreddits to use with the current RegExp in options
    //     options lines have three parts: /pattern/ %= target =% { subreddits }
    //     everything is optional; if the pattern is absent, it will be ""
    function parseRegExpLine(line) {
        // already handled by previous parse for named lists
        if (/\w+\s*=\s*{.*}/.test(line)) {
            return [null, null];
        }

        let matches, pattern, target, intendedTarget, list;
        if (matches = line.match(/^\s*(.*?)(?:\s*%=\s*(\w+)\s*=%\s*)?(?:\s+{\s*(.*?)\s*})?\s*$/)) {
            pattern = matches[1] ?? "";
            intendedTarget = matches[2];
            list = matches[3];

            // determine what to search in -- currently, title (default) or flair
            target = Target.Title; // search for matching title by default
            if (intendedTarget) {
                // get key by value
                let key = Object.keys(Target)
                                .find(key => Target[key].toLowerCase() === intendedTarget.toLowerCase());
                target = Target[key] ?? Target.Title; // default again if user specified bogus target
            }

            // split list
            if (list) {
                subredditList = list.split(/[,;| ]/).map(x => x.trim()).filter(x => !!x);
                debugLog(() => `sub list = ${list}`); // DEBUG
            } else {
                debugLog(() => "emptying subredditList"); // DEBUG
                subredditList = [];
            }

            // replace named list with its contents
            let token;
            let subredditListLen = subredditList.length;
            for (let i = 0; i < subredditListLen; i++) {
                token = "_" + subredditList[i];
                if (namedSubredditLists[token]) {
                    subredditList.splice(i, 1);
                    subredditList.push(...namedSubredditLists[token]);
                    // you can't put one named group inside another, so stop
                    // before you reach the replaced ones
                    i--;
                    subredditListLen--;
                }
            }
        }
        return [pattern, target];
    }

    function removeArticles(articles, optionsLines) {
        for (let i = 0; i < articles.length; i++) {
            let target, pattern;
            for (let line of optionsLines) {
                [pattern, target] = parseRegExpLine(line);
                if (pattern === null) continue; // not a regex line

                try {
                    new RegExp(pattern); // validate RegExp
                } catch (_) {
                    let err = `Invalid RegExp: ${pattern}`;
                    console.log(err);
                    alert(err);
                    return;
                }

                let postTitle = articles[i].getAttribute("aria-label");
                let flairList = [];
                let targetText = "";
                let deletePost = false;
                switch (target) {
                    case Target.Flair:
                        // this is complicated by the fact that Reddit posts can have
                        //   - no flair
                        //   - empty flair
                        //   - multiple flairs, any of which can be empty
                        flairList = Array.from(articles[i].querySelectorAll(".flair-content")).map(el => el.textContent);
                        // if the pattern is length 0 and the post has no flair,
                        // remove the post (this is the only way to remove posts with no flair)
                        if (flairList.length === 0 && pattern.length === 0) {
                            targetText = "";
                            deletePost = true;
                            break;
                        }
                        // get rid of all empty flair (including strange unprintable things)
                        flairList = flairList.map(f => f.trim())
                                             .filter(f => !f.match(/^[^a-zA-Z0-9!@#\$%\^&\*\(\)\[\]\{\}\?\.;,\+-\\\/':"`~<>]*$/));
                        // if the flairs are all empty and the pattern matches an empty string,
                        // remove the post
                        if (flairList.length === 0 && "".match(pattern)) {
                            targetText = "";
                            deletePost = true;
                            break;
                        }
                        // from here onward, an empty pattern isn't helpful
                        if (pattern.length === 0) {
                            break;
                        }
                        // if there is at least one non-empty flair that matches the non-empty pattern,
                        // remove the post
                        for (let j = 0; j < flairList.length; ++j) {
                            if (flairList[j].match(pattern)) {
                                targetText = flairList[j];
                                deletePost = true;
                                break;
                            }
                        }
                        break;
                    case Target.Title:
                    default:
                        if (pattern && postTitle.match(pattern)) {
                            targetText = postTitle;
                            deletePost = true;
                        }
                        break;
                }
                debugLog(() => `article ${i}: ${postTitle}|${pattern}|${flairList}|{${subredditList}}`); // DEBUG
                if (!deletePost) continue;

                debugLog(() => `Match! ${targetText} == ${pattern}`); // DEBUG
                let subreddit = articles[i].querySelector("shreddit-post").getAttribute("subreddit-name");
                if (subredditList.length > 0) {
                    if (!subredditList.map(x => x.toLowerCase()).includes(subreddit.toLowerCase())) {
                        debugLog(() => `Not removed: sub = ${subreddit}`) // DEBUG
                        continue; // subreddit list doesn't include this post's subreddit
                    }
                }
                const hr = articles[i].nextElementSibling;
                if (hr && hr.tagName == "HR") {
                    hr.remove();
                }
                articles[i].remove();
                if (logRemovals) {
                    let flairs = (target === Target.Flair) ? ` (flair:${flairList.join(", ")})` : "";
                    console.log(`Userscript removed "${postTitle}"${flairs} in r/${subreddit}`);
                }
                break;
            }
        }
    }

    // get named lists of subreddits
    parseSubredditLists(regexList);

    // remove articles from initial page load, before scrolling
    removeArticles(articles, regexList);

    // remove articles that appear when scrolling
    new MutationObserver(mutationList => {
        debugLog(() => `${mutationList.length} new mutations`); // DEBUG
        for (let mutation of mutationList) {
            if (mutation.type == "childList") {
                const additions = Array.from(mutation.addedNodes);
                articles = additions.reduce((accumulator, currentNode) => {
                    // added nodes could be articles, elements that contain articles, or neither
                    if (currentNode.nodeType === Node.ELEMENT_NODE) {
                        if (currentNode.tagName === "ARTICLE") {
                            return accumulator.concat(currentNode); // added node is article
                        }
                        const containedArticles = Array.from(currentNode.querySelectorAll("article"));
                        return accumulator.concat(containedArticles); // added node has possible descendent articles
                    }
                    return accumulator; // added node is not an element
                }, []);
                debugLog(() => `${articles.length} new articles`); // DEBUG
                if (articles.length == 0) {
                    continue;
                }
                regexList = GM_getValue("regexList", /*default = */[]); // refresh in case user updated options
                removeArticles(articles, regexList);
            }
        }
    }).observe(document.body, { childList: true, subtree: true });

    /* SET SCRIPT OPTIONS */

    // create the options page
    const optionsHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Script Options</title>
            <style>
                #options {
                    /* for some reason this is required for checkbox alignment */
                }
                #options label {
                    all: unset;
                    font-size: 9pt;
                }
                #options label[for="regexList"] {
                    display: block;
                    margin-bottom: 10px;
                }
                #options textarea {
                    background-color: black;
                    display: block;
                    margin-bottom: 5px;
                    font-size: 9pt;
                    font-family: 'Lucida Console', Monaco, monospace;
                }
                #options button {
                    margin-top: 10px;
                    border-radius: 4px;
                    padding-left: 10px;
                    padding-right: 10px;
                }
                #options input[type="checkbox"],
                #options input[type="checkbox"] + label {
                    margin-top: 12px;
                    display: inline-block;
                }
                #options input[type="checkbox"] {
                    margin-left: 0px;
                    position: relative;
                    top: -6px;
                }
                #options p {
                    line-height: initial;
                    font-size: 8pt;
                    margin-top: 5pt;
                    margin-bottom: 5pt;
                }
                #options p#note {
                    color: color-mix(in srgb, currentColor, red 20%);
                }
                #options p > span {
                    font-family: 'Lucida Console', Monaco, monospace;
                }
                #options p > span#jokes {
                    font-family: unset;
                    white-space: nowrap;
                }
                #options form div {
                    max-width: 350px;
                    box-sizing: border-box;
                }
                #options div:has( > code) {
                    line-height: initial;
                    background-color: black;
                }
                #options code {
                    all: unset;
                    font-size: 8pt;
                    font-family: 'Lucida Console', Monaco, monospace;
                    color: inherit;
                    background-color: inherit;
                    border: 0px;
                }
            </style>
        </head>
        <body>
            <div id="options">
                <h1>Script Options</h1>
                <form id="optionsForm">
                    <label for="regexList">
                        Posts will be hidden if title matches one of these <a><strong>reg</strong>ular <strong>ex</strong>pressions</a>:
                    </label>
                    <textarea id="regexList" name="regexList" rows="5" cols="33" spellcheck="false"></textarea>
                    <div>
                        <p>You can follow a <a><strong>regex</strong></a> with a list of subreddits in curly braces. In that case,
                            the pattern will only be used to remove posts from those subreddits.</p>
                        <p>Not only that, but you can add lines that create named lists of subreddits, and then put
                            these names after a regex in place of the list they represent, like so:<p>
                        <div>
                            <code>favorites = { funny, politics }<br>
                                  [tT]rump { favorites, rant }</code>
                        </div>
                        <p>If you'd rather search in something other than the post title, enclose the alternative search target like
                            <span>%= this =%</span> after the regex but before any list of subreddits. Currently, the target can either be
                            <span>title</span> or <span>flair</span>. The following example removes all jokes except ones with "long" flair in
                            <span id="jokes">r/jokes:</span></p>
                        <div>
                            <code>^(?!\\s*[Ll]ong\\s*$)(?!\\s*$).+ %= flair=% {jokes}<br>
                                  %= flair<wbr>&nbsp;<wbr>&nbsp;<wbr>=%<wbr>&nbsp;<wbr>&nbsp;<wbr>&nbsp;<wbr>{ jokes }</code>
                        </div>
                        <p>The second line above takes care of removing posts with no flair at all.</p>
                        <p id="note">Note: Do not enclose your regex in <span>/slashes/</span> unless the slashes are part of the search!</p>
                    </div>
                    <input id="logCheckbox" name="logCheckbox" type="checkbox">
                    <label for="logCheckbox">
                        Log removed items to the Developer Tools console
                    </label>
                    <div>
                        <button type="submit">Save</button>
                        <button id="closeOptions">Close</button>
                    </div>
                </form>
            <div>
        </body>
        </html>
    `;

    function openOptionsInterface() {
        // create a modal for the options interface. Use an in-page modal because
        // - it doesn't use GM_openInTab because Firefox doesn't allow data: URLs,
        //   so the HTML would have to be in a separate file
        // - it doesn't use a separate HTML file, because I have no idea how to install
        //   that along with a userscript, and the userscript can't generate one
        // - it doesn't use a popup window, because those are typically blocked on a
        //   per-site basis by the browser settings
        const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        modal.style.zIndex = "9999";
        modal.style.display = "flex";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";

        const scrollBox = document.createElement("div");
        scrollBox.style.maxHeight = "100vh";
        scrollBox.style.overflowY = "auto";
        scrollBox.style.scrollbarGutter = "stable";
        scrollBox.style.padding = "0px";
        scrollBox.style.border = "0px";
        scrollBox.style.margin = "0px";

        const optionsBox = document.createElement("div");
        optionsBox.id = "options";
        optionsBox.style.backgroundColor = "hsl(from thistle h s calc(l - .90*l))";
        optionsBox.style.padding = "20px";
        optionsBox.style.borderRadius = "5px";
        optionsBox.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.8)";
        optionsBox.innerHTML = optionsHtml;

        // fill text entry with saved value, if any
        const regexArea = optionsBox.querySelector("textarea");
        regexArea.value = GM_getValue("regexList", /*default = */[]).join("\n");
        // place text entry cursor
        if (typeof regexArea.setSelectionRange === "function") {
            regexArea.focus();
            regexArea.setSelectionRange(0, 0);
        } else if (typeof regexArea.createTextRange === "function") {
            const range = regexArea.createTextRange();
            range.moveStart('character', 0);
            range.select();
        }

        // set checkbox to saved value (defaults to checked)
        const logCheckbox = optionsBox.querySelector("input#logCheckbox");
        logCheckbox.checked = GM_getValue("logRemovals", /*default = */true);

        // set up explanatory links about regular expressions
        const regexLinks = optionsBox.querySelectorAll("a");
        regexLinks.forEach(a => {
            a.href = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions";
            a.target = "_blank";
            a.style.color = "inherit";
        });

        modal.appendChild(scrollBox);
        scrollBox.appendChild(optionsBox);
        document.body.appendChild(modal);

        regexArea.focus();

        // set up example text style
        optionsBox.querySelectorAll("#options div:has( > code)").forEach(el => {
            el.style.width = "100%";
            el.style.padding = "10px";
            el.style.paddingTop = "3px";
            el.style.paddingBottom = "6px";
        });

        // add button event listeners to set handlers
        // (button listeners are removed when the modal is removed/closed)
        function addButtonHandlers() {
            const form = document.getElementById("optionsForm");
            if (form) {
                // handle form submission (save options)
                form.addEventListener("submit", function handleFormSubmit(event) {
                    event.preventDefault();
                    let newRegexList = document.getElementById("regexList").value.split("\n");
                    newRegexList = newRegexList.filter(item => item.trim() !== "");
                    GM_setValue("regexList", newRegexList);
                    GM_setValue("logRemovals", logCheckbox.checked);
                    alert("Options saved!");
                });
                // close modal
                document.getElementById("closeOptions").addEventListener("click", function() {
                    document.body.removeChild(modal);
                    // update display using new settings
                    regexList = GM_getValue("regexList", /*default = */[]);
                    logRemovals = GM_getValue("logRemovals", /*default = */true);
                    parseSubredditLists(regexList);
                    removeArticles(articles, regexList);
                });
            }
            // opening options adds this new listener every time, so remove every time
            document.removeEventListener("DOMContentLoaded", addButtonHandlers);
        }

        // decide when to add form's event listeners
        if (document.readyState === "loading") {
            // loading hasn't finished yet
            document.addEventListener("DOMContentLoaded", addButtonHandlers);
        } else {
            // DOMContentLoaded has already fired
            addButtonHandlers();
        }
    }

    // set the options handler
    GM_registerMenuCommand("Options", openOptionsInterface);

})();