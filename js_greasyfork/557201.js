// ==UserScript==
// @name         Forum Notifier
// @namespace    mavri
// @version      1.0.2
// @author       MAVRI [2402357]
// @description  Notifies you when a new post is posted in a specific forum.
// @license      GPLv3
// @copyright    2025, diicot.cc
// @match        https://www.torn.com/index.php
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557201/Forum%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/557201/Forum%20Notifier.meta.js
// ==/UserScript==

const API_KEY = "CHANGE ME TO YOUR API KEY"; /*should look like this: const API_KEY = "156pu1bh5pb215u2ib"; */

(function () {
  'use strict';

  class Logger {
    prefix;
    level;
    colors = {
      debug: "#7f8c8d",
      // gray
      info: "#3498db",
      // blue
      warn: "#f39c12",
      // orange
      error: "#e74c3c"
      // red
    };
    constructor(prefix = "", level = 1 /* INFO */) {
      this.prefix = prefix;
      this.level = level;
    }
    setLevel(level) {
      this.level = level;
    }
    debug(...args) {
      if (this.level <= 0 /* DEBUG */) {
        console.debug(
          `%c${this.formatPrefix("DEBUG")}`,
          `color: ${this.colors.debug}; font-weight: bold`,
          ...args
        );
      }
    }
    info(...args) {
      if (this.level <= 1 /* INFO */) {
        console.info(
          `%c${this.formatPrefix("INFO")}`,
          `color: ${this.colors.info}; font-weight: bold`,
          ...args
        );
      }
    }
    warn(...args) {
      if (this.level <= 2 /* WARN */) {
        console.warn(
          `%c${this.formatPrefix("WARN")}`,
          `color: ${this.colors.warn}; font-weight: bold`,
          ...args
        );
      }
    }
    error(...args) {
      if (this.level <= 3 /* ERROR */) {
        console.error(
          `%c${this.formatPrefix("ERROR")}`,
          `color: ${this.colors.error}; font-weight: bold`,
          ...args
        );
      }
    }
    group(label, collapsed = false) {
      if (this.level < 4 /* NONE */) {
        if (collapsed) {
          console.groupCollapsed(this.formatPrefix(""), label);
        } else {
          console.group(this.formatPrefix(""), label);
        }
      }
    }
    groupEnd() {
      if (this.level < 4 /* NONE */) {
        console.groupEnd();
      }
    }
    child(subPrefix) {
      const childPrefix = this.prefix ? `${this.prefix}:${subPrefix}` : subPrefix;
      return new Logger(childPrefix, this.level);
    }
    formatPrefix(level) {
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      const prefix = this.prefix ? `[${this.prefix}]` : "";
      return level ? `[${timestamp}]${prefix}[${level}]` : `[${timestamp}]${prefix}`;
    }
  }
  const logger = new Logger("Forum Notify", 0 /* DEBUG */);

  async function getForumSubscriptionData(apiKey) {
    const data = await fetch(
      `https://api.torn.com/v2/user/forumsubscribedthreads?key=${apiKey}`
    );
    const response = await data.json().catch(null);
    if ("error" in response) {
      logger.warn("Failed to fetch subscription info", response);
      return null;
    }
    return response;
  }

  class Storage {
    prefix;
    constructor(_prefix) {
      this.prefix = _prefix;
    }
    set(key, value, expirationMinutes) {
      try {
        const item = {
          value,
          expiration: expirationMinutes ? Date.now() + expirationMinutes * 60 * 1e3 : null
        };
        localStorage.setItem(this.prefix + key, JSON.stringify(item));
      } catch (error) {
        console.error(`Error storing item [${key}]:`, error);
      }
    }
    get(key) {
      try {
        const itemStr = localStorage.getItem(this.prefix + key);
        if (!itemStr) return null;
        const item = JSON.parse(itemStr);
        if (item.expiration && Date.now() > item.expiration) {
          this.remove(key);
          return null;
        }
        return item.value;
      } catch (error) {
        console.error(`Error retrieving item [${key}]:`, error);
        return null;
      }
    }
    remove(key) {
      try {
        localStorage.removeItem(this.prefix + key);
      } catch (error) {
        console.error(`Error removing item [${key}]:`, error);
      }
    }
    has(key) {
      return this.get(key) !== null;
    }
    clearAll() {
      try {
        Object.keys(localStorage).filter((key) => key.startsWith(this.prefix)).forEach((key) => localStorage.removeItem(key));
      } catch (error) {
        console.error("Error clearing storage:", error);
      }
    }
  }
  const storage = new Storage("mavri.");

  async function main() {
    const postData = await getForumSubscriptionData(API_KEY);
    if (!postData) return;
    for (const sub of postData.forumSubscribedThreads) {
      const threadId = sub.id.toString();
      const newPostCount = sub.posts.total;
      const localPostCount = storage.get(threadId);
      if (!localPostCount) {
        storage.set(threadId, newPostCount);
        logger.info(
          `Set post count for '${sub.title}' - ${newPostCount.toLocaleString()}`
        );
        continue;
      }
      if (localPostCount === newPostCount) continue;
      storage.set(threadId, newPostCount);
      logger.info(
        `'${sub.title}' has new ${newPostCount - localPostCount} new posts!`
      );
      GM_notification({
        tag: threadId,
        highlight: true,
        title: `${newPostCount - localPostCount} post in ${sub.title}`,
        text: "Click me to go to the forum post!",
        url: `https://www.torn.com/forums.php#/p=threads&f=${sub.forum_id}&t=${sub.id}`
      });
      logger.debug("After notification send");
    }
  }
  setInterval(main, 3e4);
  main();

})();