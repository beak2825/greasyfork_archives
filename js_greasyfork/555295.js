// ==UserScript==
// @name         Twitter AgeVerification Bypass
// @namespace    meowabyte.twitter-ageverif
// @version      1.0.0
// @license      MIT
// @description  Completely gets over Twitter's Age Verification. No strings attached
// @author       meowabyte
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/555295/Twitter%20AgeVerification%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/555295/Twitter%20AgeVerification%20Bypass.meta.js
// ==/UserScript==

(()=>{
    /** Different structures used by Twitter to serve tweet */
    const MODIFY_MODE = Object.freeze({
        TWEET_DETAIL: Symbol(),
        USER_TWEETS: Symbol(),
        SEARCH_TIMELINE: Symbol(),
        HOME_LATEST: Symbol(),
        BOOKMARKS: Symbol()
    })

    /**
     * Modifiers of response structures
     * @type {Record<symbol, (this: string) => string>}
     */
    const MODIFY_METHOD = Object.freeze({
        [MODIFY_MODE.TWEET_DETAIL]() {
            const json = JSON.parse(this)
            modifyTimelineInstructions(json.data?.threaded_conversation_with_injections_v2?.instructions)
            return JSON.stringify(json)
        },
        [MODIFY_MODE.USER_TWEETS](){
            const json = JSON.parse(this)
            modifyTimelineInstructions(json.data?.user?.result?.timeline?.timeline?.instructions)
            return JSON.stringify(json)
        },
        [MODIFY_MODE.SEARCH_TIMELINE]() {
            const json = JSON.parse(this)
            modifyTimelineInstructions(json.data?.search_by_raw_query?.search_timeline?.timeline?.instructions)
            return JSON.stringify(json)
        },
        [MODIFY_MODE.HOME_LATEST]() {
            const json = JSON.parse(this)
            modifyTimelineInstructions(json.data?.home?.home_timeline_urt?.instructions)
            return JSON.stringify(json)
        },
        [MODIFY_MODE.BOOKMARKS]() {
            const json = JSON.parse(this)
            modifyTimelineInstructions(json.data?.bookmark_timeline_v2?.timeline?.instructions)
            return JSON.stringify(json)
        }
    })

    /**
     * Modifies timeline instructions that depend on tweets
     * @param instructions Timeline instructions
     */
    const modifyTimelineInstructions = (instructions) => {
        if (!instructions) return;

        instructions
            .filter(instruction => ["TimelineAddEntries", "TimelinePinEntry"].includes(instruction.type))
            .forEach(instruction => {
                if ("entries" in instruction) instruction.entries.forEach(e => modifyTweetEntry(e));
                else if ("entry" in instruction) modifyTweetEntry(instruction.entry);
            })
    }

    /**
     * Modifies related tweet entries with non-restricted value
     * @param entries Timeline entries
     */
    const modifyTweetEntry = (entries) => {
        const tweets = [];
        switch(entries.entryId.split("-").shift()) {
            case "tweet": // Main tweet
                tweets.push(entries.content.itemContent);
                break;
            case "conversationthread": // Replies
                tweets.push(...entries.content.items.map(x => x.item.itemContent));
                break;
        }

        tweets.forEach(t => {
            const results = t.tweet_results
            if (results?.result?.__typename === "TweetWithVisibilityResults") {
                results.result = results.result.tweet
                results.result.__typename = "Tweet"
            }
        })
    }

    // Cache responses in a WeakMap to prevent additional compute
    const cachedResponses = new WeakMap()
    unsafeWindow.XMLHttpRequest = class extends unsafeWindow.XMLHttpRequest {
        open() {
            // Request check
            const [method, fullUrl] = arguments;
            const url = URL.parse(fullUrl, location.origin)

            if (url && method === "GET") {
                const action = url.pathname.split("/").pop()
                switch (action) {
                    case "TweetDetail": this.modifyMode = MODIFY_MODE.TWEET_DETAIL; break;
                    case "UserTweets":
                    case "Likes": this.modifyMode = MODIFY_MODE.USER_TWEETS; break;
                    case "SearchTimeline": this.modifyMode = MODIFY_MODE.SEARCH_TIMELINE; break;
                    case "HomeLatestTimeline": this.modifyMode = MODIFY_MODE.HOME_LATEST; break;
                    case "Bookmarks": this.modifyMode = MODIFY_MODE.BOOKMARKS; break;
                }
            }

            return super.open(...arguments)
        }

        get responseText() {
            if (!this.modifyMode) return super.responseText;
            if (cachedResponses.has(this)) return cachedResponses.get(this)

            // Bind modify method to request's mode
            const moddedResponse =
                MODIFY_METHOD[this.modifyMode]?.bind(super.responseText)()
                ?? super.responseText

            cachedResponses.set(this, moddedResponse)
            return moddedResponse
        }
    }
})();