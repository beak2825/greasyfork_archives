// ==UserScript==
// @name         Reddit quick mute subreddit
// @version      1.0
// @description  Allows muting a subreddit directly from the feed.
// @author       yojc
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.com
// @downloadURL https://update.greasyfork.org/scripts/562112/Reddit%20quick%20mute%20subreddit.user.js
// @updateURL https://update.greasyfork.org/scripts/562112/Reddit%20quick%20mute%20subreddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const requestUrl = "https://www.reddit.com/svc/shreddit/graphql";

    function getCsrfToken() {
        return Object.fromEntries(document.cookie.split('; ').map(x => x.split('='))).csrf_token;
    }

    function askToMuteSubreddit(event) {
        //console.log(event, this);
        const subredditName = this.dataset.subName;

        if (confirm(`Do you want to mute subreddit r/${subredditName}?`)) {
            const idRequestPayload = {
                csrf_token: getCsrfToken(),
                operation: "SubredditByName",
                variables: {
                    name: subredditName.toLowerCase()
                }
            };

            fetch(requestUrl, {
                method: "POST",
                body: JSON.stringify(idRequestPayload),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
            .then(function(res) {
                return res.json();
            })
            .then(function(data) {
                const subredditFetchedName = data.data.subredditInfoByName.prefixedName;
                const subredditId = data.data.subredditInfoByName.id;
                //console.log(`${subredditFetchedName} => ${subredditId}`);

                const muteRequestPayload = {
                    csrf_token: getCsrfToken(),
                    operation: "UpdateSubredditMuteSettings",
                    variables: {
                        input: {
                            subredditId
                        }
                    }
                };

                fetch(requestUrl, {
                    method: "POST",
                    body: JSON.stringify(muteRequestPayload),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                .then(function(res) {
                    return res.json();
                })
                .then(function(data) {
                    //console.log(data);
                    alert("OK");
                });
            });
        }
    }

    function appendMuteButtons() {
        for (const redditPost of document.querySelectorAll("shreddit-post:not([data-mute-processed])")) {
            const subredditName = redditPost.querySelector("[data-post-click-location=\"subreddit-link\"] a").textContent.trim().split("/")[1];

            if (!redditPost.querySelector("shreddit-post-overflow-menu") || !redditPost.querySelector("shreddit-post-overflow-menu").shadowRoot) {
                //console.log("shadowroot is null:", redditPost);
                continue;
            }

            const menuList = redditPost.querySelector("shreddit-post-overflow-menu").shadowRoot.querySelector("faceplate-menu");

            if (!menuList) {
                //console.log("menuList is null:", redditPost);
                continue;
            }

            redditPost.dataset.muteProcessed = true;

            const muteButton = document.createElement("li");
            muteButton.classList.add("relative", "list-none", "mt-0");
            muteButton.innerHTML = `
		<div tabindex="-1" class="flex justify-between relative px-md gap-[0.5rem] text-secondary hover:text-secondary-hover active:bg-interactive-pressed hover:bg-neutral-background-hover hover:no-underline cursor-pointer  py-2xs  -outline-offset-1 " style="padding-right:16px">
			<span class="flex items-center gap-xs min-w-0 shrink">
				<span class="flex shrink-0 items-center justify-center h-xl w-xl text-20 leading-4" style="fill: var(--color-secondary)">
					<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 20 20" width="20" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit;">
						<path
     d="M 10,0 C 15.52,0 20,4.48 20,10 20,15.52 15.52,20 10,20 4.48,20 0,15.52 0,10 0,4.48 4.48,0 10,0 Z M 1,10 c 0,2.31 0.87,4.41 2.29,6 L 16,3.29 C 14.41,1.87 12.31,1 10,1 5.03,1 1,5.03 1,10 Z M 16.71,4 4,16.71 c 1.59,1.42 3.69,2.29 6,2.29 4.97,0 9,-4.03 9,-9 0,-2.31 -0.87,-4.41 -2.29,-6 z"
     fill-rule="evenodd"
     id="path2" />
					</svg>
				</span>
				<span class="flex flex-col justify-center min-w-0 shrink py-[var(--rem6)]">
					<span class="text-14">Mute</span>
					<span class="text-12 text-secondary-weak"></span>
				</span>
			</span>
		<span class="flex items-center shrink-0">
			<span class="flex items-center justify-center h-lg"></span>
		</span>
	</div>`;

            muteButton.onclick = askToMuteSubreddit;
            muteButton.dataset.subName = subredditName;

            menuList.appendChild(muteButton);
        }
    }

    let oldHref = window.location.href;

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != window.location.href) {
                oldHref = window.location.href;
            }

            appendMuteButtons();
        });
    });

    function init(bodyList) {
        //console.log("Running init");
        
        const config = {
            childList: true,
            subtree: true
        };

        observer.observe(bodyList, config);
        appendMuteButtons();
    }

    const initInterval = setInterval(function() {
        const bodyList = document.querySelector("body");

        if (bodyList) {
            clearInterval(initInterval);
            init(bodyList);
        }
    }, 100);

})();
