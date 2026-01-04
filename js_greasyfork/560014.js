// ==UserScript==
// @name         Upper Tiers: Discord UI Adjustments
// @namespace    http://tampermonkey.net/
// @license      Unlicense
// @version      0.1.5
// @description  Options to adjust various Discord-related things.
// @author       20kdc
// @match        https://discordapp.com/*
// @match        https://discord.com/*
// @grant GM.getValue
// @grant GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/560014/Upper%20Tiers%3A%20Discord%20UI%20Adjustments.user.js
// @updateURL https://update.greasyfork.org/scripts/560014/Upper%20Tiers%3A%20Discord%20UI%20Adjustments.meta.js
// ==/UserScript==

/*
 * This is free and unencumbered software released into the public domain.
 *
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 *
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * For more information, please refer to <http://unlicense.org>
*/

/**
 * Hunter:
 *  Cooperative multitasker.
 */
class Hunter {
    constructor(brand) {
        this.brand = brand + " Hunter";
        this._lambda = () => this._runHunt();
        this._hunter = setInterval(this._lambda, 1000);
        this.clockRate = 1000;
        this._currentTask = null;
        this._tasks = [];
        this._perfHistIndex = 0;
        this.perfHist = [];
        for (let i = 0; i < 4; i++)
            this.perfHist.push(0);
    }
    /**
     * Sets Hunter's clockrate.
     * DO NOT CALL FROM MODULES!
     */
    setClockRate(clockRate) {
        if (clockRate == this.clockRate)
            return;
        if (this._hunter !== null) {
            clearInterval(this._hunter);
            this._hunter = null;
        }
        if (clockRate > 0)
            this._hunter = setInterval(this._lambda, clockRate);
        this.clockRate = clockRate;
    }
    _runHunt() {
        let perfData = {};
        let start = performance.now();
        // Run hunts.
        let i = 0;
        while (i < this._tasks.length) {
            let task = this._tasks[i++];
            if (task) {
                let taskStart = performance.now();
                try {
                    this._currentTask = task;
                    task.task();
                } catch (ex) {
                    console.error(this.brand + ": Error in task", task.name, ex);
                } finally {
                    this._currentTask = null;
                }
                let taskEnd = performance.now();
                perfData["task " + task.name] = taskEnd - taskStart;
            }
        }
        let end = performance.now();
        perfData["total"] = end - start;
        if ((end - start) > 10)
            console.warn(this.brand + ": Slowdown", perfData);
        this._perfHistIndex = (this._perfHistIndex + 1) % this.perfHist.length;
        this.perfHist[this._perfHistIndex] = perfData;
    }
    /**
     * Adds a task to Hunter.
     */
    addTask(callback, name) {
        if (!name) {
            name = "[ANONYMOUS HUNTER TASK, FIXME]";
            console.warn(this.brand + ": Anonymous Hunter task created. These are deprecated as of dragonequus 7.1!");
        }
        this._tasks.push({
            name: name,
            task: callback
        });
    }
    /**
     * Removes a task from Hunter.
     */
    delTask(callback) {
        let taskIdx = -1;
        for (let i = 0; i < this._tasks.length; i++) {
            if (this._tasks[i].task === callback) {
                taskIdx = i;
                break;
            }
        }
        if (taskIdx != -1) {
            this._tasks.splice(taskIdx, 1);
        }
    }
}

/**
 * Dragonequus:
 *  Abstraction layer for indirectly manipulating Discord UI.
 */
class Dragonequus {
    // -- constructor --
    constructor(brand, hunter) {
        this.version = 7.1;
        this.debug = false;
        this.brand = brand + " dragonequus";
        this._getAllClassesLen = 0;
        this._getAllClassesCache = [];
        this._getAllClassesCacheDict = {};
        this._getAllClassesScannedCache = new Map();
        // Increments when a Discord class appears that was previously unknown.
        this.cssVer = 0;
        this._toDiscordClassesCache = {};
        this.hasDiscordLoaded = false;
        this._onDiscordLoadedCollection = [];
        this.hunter = hunter;
        this._discordLoadTask = () => {
            // Wait until Discord has loaded.
            // We have to do this via a special mechanism since Discord is installing CSS files by the dozen at this point.
            // Once sidebarList has appeared, we know Discord has 'stabilized' and we can proceed.
            let found = false;
            for (let div of document.querySelectorAll("div")) {
                for (let cls of div.classList) {
                    if (this.isValidDC(cls, "sidebarList")) {
                        found = true;
                        break;
                    }
                }
                if (found)
                    break;
            }
            this.hasDiscordLoaded = true;
            this.hunterDelTask(this._discordLoadTask);
            let dlc = this._onDiscordLoadedCollection;
            this._onDiscordLoadedCollection = null;
            for (let i = 0; i < dlc.length; i++) {
                try {
                    dlc[i]();
                } catch (ex) {
                    console.error(this.brand + ": error in onDiscordLoaded callback", ex);
                }
            }
        };
        this.hunterAddTask(this._discordLoadTask, "Discord load detector");
        // declare the bind points and their tasks in one place
        this.bindGuildSeparator = this.hunterAddElementTracker("bindGuildSeparator", () => this.findByDiscordClass("guildSeparator"));
        this.bindSidebar = this.hunterAddElementTracker("bindSidebar", () => this.findByDiscordClass("sidebar"));
    }
    // -- class scanner --
    getAllClasses() {
        var sheets = document.styleSheets;
        if (sheets.length == this._getAllClassesLen) {
            return this._getAllClassesCache;
        }
        this._toDiscordClassesCache = {};
        var workspace = [];
        var seen = {};
        for (var k = 0; k < sheets.length; k++) {
            var sheet = sheets[k];
            // try to avoid scanning the same sheet twice
            let res = this._getAllClassesScannedCache.get(sheet);
            if (res === sheet.cssRules.length)
                continue;
            this._getAllClassesScannedCache.set(sheet, sheet.cssRules.length);
            // ...
            for (var k2 = 0; k2 < sheet.cssRules.length; k2++) {
                var rule = sheet.cssRules[k2];
                if (rule.type == CSSRule.STYLE_RULE) {
                    // .A:I .B:I, .A .B
                    var majors = rule.selectorText.split(",");
                    for (var k3 = 0; k3 < majors.length; k3++) {
                        var minors = majors[k3].split(" ");
                        for (var k4 = 0; k4 < minors.length; k4++) {
                            // Minor starts off as say .A:B
                            var minor = minors[k4];
                            // Must be class
                            if (!minor.startsWith("."))
                                continue;
                            // Cut off any : and remove .
                            var selectorBreak = minor.indexOf(":");
                            if (selectorBreak != -1) {
                                minor = minor.substring(1, selectorBreak);
                            } else {
                                minor = minor.substring(1);
                            }
                            if (seen[minor])
                                continue;
                            seen[minor] = true;
                            workspace.push(minor);
                        }
                    }
                }
            }
        }
        let hasIncrementedCSSVer = false;
        for (let v of workspace) {
            if (!this._getAllClassesCacheDict[v]) {
                this._getAllClassesCache.push(v);
                this._getAllClassesCacheDict[v] = true;
                if (!hasIncrementedCSSVer) {
                    this.cssVer++;
                    hasIncrementedCSSVer = true;
                }
            }
        }
        this._getAllClassesLen = sheets.length;
        return this._getAllClassesCache;
    }
    // -- class reversal --
    isValidDC(obfuscated, real) {
        // _(hex)-real
        if (obfuscated.startsWith("_") && obfuscated.endsWith("-" + real))
            return true;
        // (16 chars of hex)-real (for some reason)
        if (obfuscated.endsWith("-" + real) && obfuscated.length == real.length + 17)
            return true;
        // legacy stuff
        if (obfuscated.startsWith(real + "-") || obfuscated.startsWith(real + "_"))
            if (obfuscated.length == real.length + 7)
                return true;
        return false;
    }
    findAllByDiscordClass(name) {
        var q = [];
        var q2 = document.querySelectorAll("." + name);
        for (var k2 = 0; k2 < q2.length; k2++)
            q.push(q2[k2]);
        var classes = this.getAllClasses();
        for (var k in classes) {
            var n = classes[k];
            if (this.isValidDC(n, name)) {
                q2 = document.querySelectorAll("." + n);
                for (var k2 = 0; k2 < q2.length; k2++)
                    q.push(q2[k2]);
            }
        }
        return q;
    }
    findByDiscordClass(name) {
        var all = this.findAllByDiscordClass(name);
        if (all.length > 0)
            return all[0];
        return null;
    }
    toDiscordClasses(name) {
        let cached = this._toDiscordClassesCache[name];
        if (cached)
            return cached;
        var classes = this.getAllClasses();
        var all = [];
        for (var k in classes) {
            var n = classes[k];
            if (this.isValidDC(n, name))
                all.push(n);
        }
        all.push(name);
        this._toDiscordClassesCache[name] = all;
        return all;
    }
    toDiscordClass(name) {
        return this.toDiscordClasses(name)[0];
    }
    /**
     * Checks if an element has a Discord class, and if so returns the true name.
     */
    hasDiscordClass(element, name) {
        for (let cls of element.classList)
            if (this.isValidDC(cls, name))
                return cls;
        return null;
    }
    /**
     * Scans a container for a Discord class, then grabs it. Falls back to toDiscordClass on failure.
     * This is useful for UI integration.
     */
    toDiscordClassUsingContainer(element, name) {
        for (let c of element.children) {
            let f = this.hasDiscordClass(c, name);
            if (f !== null)
                return f;
        }
        return this.toDiscordClasses(name)[0];
    }
    // -- discord load detection / the hunter --
    onDiscordLoaded(fn) {
        if (this._onDiscordLoadedCollection) {
            this._onDiscordLoadedCollection.push(fn);
        } else {
            fn();
        }
    }
    hunterAddTask(callback, name) {
        return this.hunter.addTask(callback, name);
    }
    hunterDelTask(callback) {
        return this.hunter.delTask(callback);
    }
    /**
     * Creates an element tracker.
     * This tries to avoid redundant searches by reusing the same element until it leaves the DOM.
     */
    hunterAddElementTracker(refName, finder) {
        let dq = this;
        let obj;
        obj = {
            element: null,
            hunterTask: () => {
                // Don't activate element trackers until Discord has loaded.
                // This prevents calls to the class finder during early load.
                if (!this.hasDiscordLoaded)
                    return;
                if (obj.element) {
                    if (document.contains(obj.element))
                        return;
                    if (dq.debug) {
                        console.log(this.brand + ": tracked element '" + refName + "' lost");
                    }
                    obj.element = null;
                }
                if (!obj.element) {
                    obj.element = finder();
                    if (obj.element && dq.debug) {
                        console.log(this.brand + ": tracked element '" + refName + "' found", obj.element);
                    }
                }
            }
        };
        this.hunterAddTask(obj.hunterTask, refName);
        return obj;
    }
    // -- CSS injection --
    injectCSSRules(rules) {
        if (this.debug) {
            console.log(this.brand + ": CSS:", rules);
        }
        var styleElm = document.createElement('style');
        document.body.appendChild(styleElm);
        for (var i = 0; i < rules.length; i++)
            styleElm.sheet.insertRule(rules[i], 0);
        return styleElm;
    }
    injectCSSForClass(clazz, css) {
        return this.injectCSSRules(function () {
            var classes = this.toDiscordClasses(clazz);
            var total = [];
            for (var i = 0; i < classes.length; i++) {
                // This is stupid.
                // This is really, really stupid.
                total.push(".visual-refresh ." + classes[i] + " { " + css + " }");
                total.push("." + classes[i] + " { " + css + " }");
            }
            return total;
        });
    }
};

/* ---- Globals ---- */

var hunter;
hunter = new Hunter("UpperTiers");

var dragonequus;
dragonequus = new Dragonequus("UpperTiers", hunter);

/* ---- UI Helper ---- */

var uxie = {};

uxie.button = (text, callback) => {
    let button = document.createElement("button");
    button.type = "button";
    button.innerText = text;
    button.addEventListener("click", callback);
    return button;
};

/* ---- Module Class ---- */

let config = {};

/**
 * Module for Upper Tiers.
 * Not all modules are uninstallable.
 */
class UTModule {
    constructor(id, name) {
        this.id = id;
        this.hunterPrefix = "module " + id + ": ";
        this.name = name;
        this.desc = "A module.";
        this.temporary = false;
        this.enabled = false;
    }
    install() {
    }
    uninstall() {
    }
    /**
     * Note that this is only called while enabled.
     */
    cssChange() {
    }
    setEnabled(v) {
        if (dragonequus.debug)
            console.log("UpperTiers: " + this.id + " state " + this.enabled + " -> " + (!!v));
        if (v) {
            if (!this.enabled) {
                this.enabled = true;
                try {
                    this.install();
                } catch (ex) {
                    console.log(ex);
                    alert("UpperTiers: Error enabling module " + this.id + " (check console for details)");
                }
            }
        } else {
            if (this.enabled) {
                try {
                    this.uninstall();
                } catch (ex) {
                    console.log(ex);
                    alert("UpperTiers: Error disabling module " + this.id + " (check console for details)");
                }
                this.enabled = false;
            }
        }
    }
    getConfigEnabled() {
        if (this.temporary)
            return false;
        return !!config["enable_" + this.id];
    }
    setConfigEnabled(v) {
        if (!this.temporary)
            config["enable_" + this.id] = !!v;
    }
    notifyCSSChange() {
        if (this.enabled) {
            try {
                this.cssChange();
            } catch (ex) {
                console.warn("UpperTiers: Error updating CSS of module " + this.id, ex);
            }
        }
    }
}

var utModules;
utModules = [];

/* ---- Module Base Classes ---- */

/**
 * CSS module base.
 * Auto-injects .visual-refresh workaround.
 */
class UTCSSModule extends UTModule {
    constructor(id, name) {
        super(id, name);
        this.css = null;
    }
    genCSSRules() {
        return [];
    }
    install() {
        this.cssChange();
    }
    uninstall() {
        if (this.css) {
            this.css.remove();
            this.css = null;
        }
    }
    cssChange() {
        if (this.css) {
            this.css.remove();
            this.css = null;
        }
        let modifiedRules = [];
        for (let v of this.genCSSRules()) {
            modifiedRules.push(v);
            modifiedRules.push(".visual-refresh " + v);
        }
        this.css = dragonequus.injectCSSRules(modifiedRules);
    }
}

/* ---- Modules ---- */

class UTModuleHideGift extends UTCSSModule {
    constructor() {
        super("hideGift", "Hide Chatbox Gift");
        this.desc = "Hides the 'gift' button in the chatbox.";
    }
    genCSSRules() {
        var total = [];
        var classes = dragonequus.toDiscordClasses("button");
        for (var i = 0; i < classes.length; i++) {
            total.push("." + classes[i] + "[aria-label=\"Send a gift\"] { display: none; }");
        }
        return total;
    }
}
utModules.push(new UTModuleHideGift());

class UTModuleHideApps extends UTCSSModule {
    constructor() {
        super("hideApps", "Hide Chatbox Apps");
        this.desc = "Hides the 'apps' button in the chatbox.";
    }
    genCSSRules() {
        var total = [];
        // not obf'd right now, but who wants to bet on that staying the case?
        var classes = dragonequus.toDiscordClasses("app-launcher-entrypoint");
        for (var i = 0; i < classes.length; i++) {
            total.push("." + classes[i] + " { display: none; }");
        }
        return total;
    }
}
utModules.push(new UTModuleHideApps());

class UTModuleHideTitlebar extends UTCSSModule {
    constructor() {
        super("hideTitlebar", "Hide Obnoxious Titlebar");
        this.desc = "Hides the obnoxious 'extra titlebar'. Also implicitly hides the buttons on it.";
    }
    genCSSRules() {
        var total = [];
        var classes = dragonequus.toDiscordClasses("bar");
        for (var i = 0; i < classes.length; i++) {
            total.push("." + classes[i] + " { display: none; }");
        }
        classes = dragonequus.toDiscordClasses("base");
        for (var i = 0; i < classes.length; i++) {
            total.push("." + classes[i] + " { grid-template-rows: [top] 0fr [titleBarEnd] 0fr [noticeEnd] 1fr [end]; }");
        }
        return total;
    }
}
utModules.push(new UTModuleHideTitlebar());

class UTModuleHideChannelList extends UTModule {
    constructor() {
        super("hideChannelList", "Hide Channel List");
        this.desc = "Hides the channel list.";
        this.temporary = true;
    }
    install() {
        const v2 = dragonequus.findByDiscordClass("sidebarList");
        const v3 = dragonequus.findByDiscordClass("panels");
        if (v2)
            v2.style.display = "none";
        if (v3)
            v3.style.display = "none";
    }
    uninstall() {
        const v2 = dragonequus.findByDiscordClass("sidebarList");
        const v3 = dragonequus.findByDiscordClass("panels");
        if (v2)
            v2.style.display = "inherit";
        if (v3)
            v3.style.display = "initial";
    }
}
utModules.push(new UTModuleHideChannelList());

class UTModuleHideButtonByLink extends UTCSSModule {
    constructor(id, name, url) {
        super(id, name);
        this.desc = "Hides links to '" + url + "'.";
        this.url = url;
    }
    genCSSRules() {
        return ["a[href=\"" + this.url + "\"] { display: none; }"];
    }
}
utModules.push(new UTModuleHideButtonByLink("hideNitro", "Hide 'Nitro' Button", "/store"));
utModules.push(new UTModuleHideButtonByLink("hideShop", "Hide 'Shop' Button", "/shop"));
utModules.push(new UTModuleHideButtonByLink("hideQuests", "Hide 'Quests' Button", "/quest-home"));

class UTModuleHideBotIndicators extends UTCSSModule {
    constructor() {
        super("hideBotIndicators", "Hide 'APP' Indicator");
        this.desc = "Hides the 'app' indicator. (Useful w/ PK, etc.)";
    }
    genCSSRules() {
        var total = [];
        var classes = dragonequus.toDiscordClasses("botTag");
        for (var i = 0; i < classes.length; i++) {
            total.push("." + classes[i] + " { display: none; }");
        }
        return total;
    }
}
utModules.push(new UTModuleHideBotIndicators());

class UTModuleHideAvatarDecorations extends UTCSSModule {
    constructor() {
        super("hideAvatarDecorations", "Hide Avatar Decorations");
        this.desc = "Hides avatar decorations.";
    }
    genCSSRules() {
        var total = [];
        var classes = dragonequus.toDiscordClasses("avatarDecoration");
        for (var i = 0; i < classes.length; i++) {
            total.push("." + classes[i] + " { display: none; }");
        }
        return total;
    }
}
utModules.push(new UTModuleHideAvatarDecorations());

class UTModuleHideProfileEffects extends UTCSSModule {
    constructor() {
        super("hideProfileEffects", "Hide Profile Effects");
        this.desc = "Hides the 'profile effects' so you can actually read people's profiles.";
    }
    genCSSRules() {
        var total = [];
        var classes = dragonequus.toDiscordClasses("profileEffects");
        for (var i = 0; i < classes.length; i++) {
            total.push("." + classes[i] + " { display: none; }");
        }
        return total;
    }
}
utModules.push(new UTModuleHideProfileEffects());

class UTModuleSquavatars extends UTCSSModule {
    constructor(isGuilds) {
        super(isGuilds ? "squareGuilds" : "squareAvatars", isGuilds ? "Square Guilds" : "Square Avatars");
        this.desc = "And they said you couldn't square the circle.";
        this.isGuilds = isGuilds;
        let eraseMasks = (v, depth) => {
            if (v) {
                // remove all direct masks and defs in children
                let removeThese = [];
                for (let child of v.children) {
                    if ((child.tagName === "mask") || (child.tagName === "defs")) {
                        removeThese.push(child);
                    }
                }
                for (let child of removeThese)
                    child.remove();
                try {
                    v.removeAttribute("mask");
                } catch (ex) {
                    // nope
                }
                // only descend along first-child line so we don't hit the layered status icons
                if (depth < 8) {
                    eraseMasks(v.firstChild, depth + 1);
                }
            }
            return false;
        };
        let wrapperDiscordClassQueue = [[]];
        this._hunterTask = () => {
            // To hopefully maximize performance, try to be as selective as possible.
            // Find avatars, and then only scan those for SVG elements.
            // avatar class for parent isn't detected (not styled?)
            if (wrapperDiscordClassQueue[0].length == 0)
                wrapperDiscordClassQueue[0] = dragonequus.toDiscordClasses("wrapper").slice();
            for (let i = 0; i < 4; i++) {
                let avatarClass = wrapperDiscordClassQueue[0].shift();
                if (avatarClass) {
                    for (let v of document.querySelectorAll("." + avatarClass)) {
                        if (dragonequus.hasDiscordClass(v.parentElement, isGuilds ? "blobContainer" : "avatar")) {
                            eraseMasks(v, 0);
                        }
                    }
                }
            }
        };
    }
    genCSSRules() {
        var total = [];
        var classes1 = dragonequus.toDiscordClasses(this.isGuilds ? "blobContainer" : "avatar");
        var classes2 = dragonequus.toDiscordClasses("wrapper");
        for (let class1 of classes1) {
            total.push("." + class1 + " { border-radius: initial; }");
            // The 'full profile' modal has this...
            for (let class2 of classes2) {
                total.push("." + class1 + " ." + class2 + " { border-radius: initial; }");
            }
        }
        return total;
    }
    install() {
        super.install();
        dragonequus.hunterAddTask(this._hunterTask, this.hunterPrefix + "mask remover");
    }
    uninstall() {
        super.uninstall();
        dragonequus.hunterDelTask(this._hunterTask);
    }
}
utModules.push(new UTModuleSquavatars(true));
utModules.push(new UTModuleSquavatars(false));

class UTModuleNaturalCollapseChannelList extends UTModule {
    constructor() {
        super("naturalCollapseChannelList", "Naturally Collapse Channel List");
        this.desc = "Naturally collapses the channel list. Essentially a natural way to control the Hide Channel List module.";
        this._hunterTask = () => {
            if (dragonequus.bindSidebar.element) {
                // this is dodgy and might need to be reviewed to see if there's a better way
                let intendedClosed = dragonequus.bindSidebar.element.style.width === "264px";
                utModules.find((v) => v.id === "hideChannelList").setEnabled(intendedClosed);
            }
        };
    }
    install() {
        dragonequus.hunterAddTask(this._hunterTask, this.hunterPrefix + "reactor");
    }
    uninstall() {
        dragonequus.hunterDelTask(this._hunterTask);
        utModules.find((v) => v.id === "hideChannelList").setEnabled(false);
    }
}
utModules.push(new UTModuleNaturalCollapseChannelList());

/* ---- Config ---- */

let configLoadAttemptedYet = false;
let saveConfigIsScheduled = false;
let scheduleSaveConfig = () => {
    if (!saveConfigIsScheduled) {
        saveConfigIsScheduled = true;
        // don't try to save before load, or we'll wipe config
        if (!configLoadAttemptedYet)
            return;
        setTimeout(() => {
            saveConfigIsScheduled = false;
            GM.setValue("UpperTiersCore_Config", JSON.stringify(config)).then(() => {});
        }, 100);
    }
};

let weAreShowingConfig = null;
function doConfig() {
    if (weAreShowingConfig) {
        weAreShowingConfig.remove();
        weAreShowingConfig = null;
        return;
    }
    // build the UI
    let configDiv = document.createElement("div");
    configDiv.style.display = "flex";
    configDiv.style.flexDirection = "column";
    configDiv.style.alignItems = "start";
    configDiv.style.position = "absolute";
    configDiv.style.top = "5vw";
    configDiv.style.left = "5vh";
    configDiv.style.width = "90vw";
    configDiv.style.height = "90vh";
    configDiv.style.background = "black";
    configDiv.style.border = "2pt solid grey";
    configDiv.style.padding = "2pt";
    configDiv.style.overflow = "scroll";
    configDiv.style.zIndex = "1000";
    configDiv.style.color = "white";

    for (let pass = 0; pass < 2; pass++) {
        for (let module of utModules) {
            // this sorts temporary modules before permanent ones
            if (module.temporary != (pass == 0))
                continue;

            let fieldDiv = document.createElement("div");

            let checkId = "uppertiers-module-" + module.id;
            let check = document.createElement("input");
            check.type = "checkbox";
            check.name = checkId;
            check.id = checkId;
            check.checked = module.enabled;
            check.addEventListener("click", () => {
                let desiredState = !!check.checked;
                module.setEnabled(desiredState);
                if (!module.temporary)
                    module.setConfigEnabled(desiredState);
                scheduleSaveConfig();
            });
            let label = document.createElement("label");
            label.htmlFor = checkId;
            let nameAdj = module.name;
            if (module.temporary)
                nameAdj = nameAdj + " (not saved)";
            label.innerText = nameAdj;

            fieldDiv.appendChild(check);
            fieldDiv.appendChild(label);
            configDiv.appendChild(fieldDiv);
        }
        configDiv.appendChild(document.createElement("br"));
    }

    configDiv.appendChild(uxie.button("Close", doConfig));

    document.body.appendChild(configDiv);
    weAreShowingConfig = configDiv;
}

/* ---- API/Debug ---- */

unsafeWindow.upperTiers = {
    config: config,
    uxie: uxie,
    dragonequus: dragonequus,
    hunter: hunter,
    UTModule: UTModule,
    UTCSSModule: UTCSSModule,
    UTModuleHideButtonByLink: UTModuleHideButtonByLink,
    utModules: utModules,
    forceShowConfig: doConfig,
    scheduleSaveConfig: scheduleSaveConfig,
    // we don't want this as config just in case the system is changed (plus, migration), but it should still be tweakable
    activeClockRate: 100,
    inactiveClockRate: 2000
};

/* ---- Bootloader ---- */

GM.getValue("UpperTiersCore_Config", "{}").then((data) => {
    try {
        config = JSON.parse(data);
    } catch (_) {
        // NOPE!
    }
    configLoadAttemptedYet = true;
    if (dragonequus.debug) {
        console.log("UpperTiers: Config loaded", config);
    }

    dragonequus.onDiscordLoaded(() => {
        if (!config.shownInstallMessage) {
            alert("UpperTiers:\n Install seems OK!\n Boop the cat to configure.");
            config.shownInstallMessage = true;
            scheduleSaveConfig();
        }

        // Create config button
        const configButtonImg = document.createElement("img");
        configButtonImg.draggable = false;
        configButtonImg.src = "/assets/a860a4e9c04e5cc2c8c48ebf51f7ed46.svg";
        // Unscalable, but Discord does (did?) it too
        configButtonImg.width = 24;
        configButtonImg.height = 24;

        const configButton = document.createElement("div");
        configButton.type = "div";
        // Make it a div, listItem & clickable, which makes it similar to other Discord buttons
        configButton.className = dragonequus.toDiscordClass("listItem") + " " + dragonequus.toDiscordClass("clickable");
        configButton.appendChild(configButtonImg);

        configButton.addEventListener("click", () => {
            doConfig();
        });

        dragonequus.hunterAddTask(() => {
            if (!document.body.contains(configButton)) {
                if (dragonequus.bindGuildSeparator.element) {
                    let par1 = dragonequus.bindGuildSeparator.element.parentElement;
                    let theList = par1.parentElement;
                    // there are many listItems
                    let listItemClass = dragonequus.toDiscordClassUsingContainer(theList, "listItem");
                    let clickableClass = dragonequus.toDiscordClassUsingContainer(theList, "clickable");
                    configButton.className = listItemClass + " " + clickableClass;
                    par1.parentElement.insertBefore(configButton, par1);
                }
            }
        }, "core: config button maintenance");

        // actually start configured modules
        for (let mod of utModules)
            if (mod.getConfigEnabled())
                mod.setEnabled(true);

        // clockrate manager
        let lastKnownCSSVer = [dragonequus.cssVer];
        hunter.addTask(() => {
            let desiredClockRate = document.hasFocus() ? unsafeWindow.upperTiers.activeClockRate : unsafeWindow.upperTiers.inactiveClockRate;
            hunter.setClockRate(desiredClockRate);
            dragonequus.getAllClasses();
            if (lastKnownCSSVer[0] !== dragonequus.cssVer) {
                lastKnownCSSVer[0] = dragonequus.cssVer;
                for (let mod of utModules)
                    mod.notifyCSSChange();
            }
        }, "UpperTiers core task");
    });
});
