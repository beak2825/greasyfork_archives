// ==UserScript==
// @name         TornCast
// @description  Raycast style page launcher
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @version      1.1
// @author       Upsilon [3212478]
// @match        https://www.torn.com/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560082/TornCast.user.js
// @updateURL https://update.greasyfork.org/scripts/560082/TornCast.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const HOTKEYS = [
        { alt: true, ctrl: false, shift: false, key: "k" },
        { alt: false, ctrl: true, shift: false, key: "k" },
    ];

    const COMMANDS = [
        // --- CITY ---
        { type: "nav", title: "Education", url: "https://www.torn.com/education.php#/step=main" },
        { type: "nav", title: "Gym", url: "https://www.torn.com/gym.php", aliases: ["g"] },
        { type: "nav", title: "Travel Agency", url: "https://www.torn.com/travelagency.php" },
        { type: "nav", title: "Casino", url: "https://www.torn.com/casino.php" },
        { type: "nav", title: "Dump", url: "https://www.torn.com/dump.php" },
        { type: "nav", title: "Loan Shark", url: "https://www.torn.com/loan.php" },
        { type: "nav", title: "Missions", url: "https://www.torn.com/loader.php?sid=missions" },
        { type: "nav", title: "Raceway", url: "https://www.torn.com/page.php?sid=racing" },
        { type: "nav", title: "Auction House", url: "https://www.torn.com/amarket.php#itemtab=weapons&start=0", aliases: ["ah", "auction", "auctions"] },
        { type: "nav", title: "Bazaar Directory", url: "https://www.torn.com/page.php?sid=bazaar" },
        { type: "nav", title: "Church", url: "https://www.torn.com/church.php" },
        { type: "nav", title: "Item Market", url: "https://www.torn.com/page.php?sid=ItemMarket" },
        { type: "nav", title: "Points Building", url: "https://www.torn.com/points.php" },
        { type: "nav", title: "Points Market", url: "https://www.torn.com/pmarket.php" },
        { type: "nav", title: "Estate Agents", url: "https://www.torn.com/estateagents.php" },
        { type: "nav", title: "Chronicle Archives", url: "https://www.torn.com/archives.php" },
        { type: "nav", title: "City Hall", url: "https://www.torn.com/citystats.php" },
        { type: "nav", title: "Community Center", url: "https://www.torn.com/fans.php" },
        { type: "nav", title: "Hospital", url: "https://www.torn.com/hospitalview.php" },
        { type: "nav", title: "Jail", url: "https://www.torn.com/jailview.php" },
        { type: "nav", title: "Player Committee", url: "https://www.torn.com/committee.php#/step=main" },
        { type: "nav", title: "Staff", url: "https://www.torn.com/staff.php" },
        { type: "nav", title: "Visitor Center", url: "https://www.torn.com/wiki" },
        { type: "nav", title: "Bank", url: "https://www.torn.com/bank.php" },
        { type: "nav", title: "Donator House", url: "https://www.torn.com/donator.php" },
        { type: "nav", title: "Messaging Inc", url: "https://www.torn.com/messageinc.php" },
        { type: "nav", title: "Stock Market", url: "https://www.torn.com/page.php?sid=stocks" },
        { type: "nav", title: "Big Al's Gun Shop", url: "https://www.torn.com/bigalgunshop.php" },
        { type: "nav", title: "Bits 'n' Bobs", url: "https://www.torn.com/shops.php?step=bitsnbobs" },
        { type: "nav", title: "Cyber Force", url: "https://www.torn.com/shops.php?step=cyberforce" },
        { type: "nav", title: "Docks", url: "https://www.torn.com/shops.php?step=docks" },
        { type: "nav", title: "Jewelry Store", url: "https://www.torn.com/shops.php?step=jewelry" },
        { type: "nav", title: "Nikeh Sports", url: "https://www.torn.com/shops.php?step=nikeh" },
        { type: "nav", title: "Pawn Shop", url: "https://www.torn.com/shops.php?step=pawnshop" },
        { type: "nav", title: "Pharmacy", url: "https://www.torn.com/shops.php?step=pharmacy" },
        { type: "nav", title: "Post Office", url: "https://www.torn.com/shops.php?step=postoffice" },
        { type: "nav", title: "Print Store", url: "https://www.torn.com/shops.php?step=printstore" },
        { type: "nav", title: "Recycling Center", url: "https://www.torn.com/shops.php?step=recyclingcenter" },
        { type: "nav", title: "Super Store", url: "https://www.torn.com/shops.php?step=super" },
        { type: "nav", title: "Sweet Shop", url: "https://www.torn.com/shops.php?step=candy" },
        { type: "nav", title: "TC Clothing", url: "https://www.torn.com/shops.php?step=clothes" },

        // --- PERSONAL ---
        { type: "nav", title: "Home", url: "https://www.torn.com/home.php"},
        { type: "nav", title: "Inventory", url: "https://www.torn.com/item.php"},
        { type: "nav", title: "Trade", url: "https://www.torn.com/trade.php"},
        { type: "nav", title: "Properties", url: "https://www.torn.com/properties.php"},
        { type: "nav", title: "Job", url: "https://www.torn.com/jobs.php"},
        { type: "nav", title: "Message", url: "https://www.torn.com/messages.php"},
        { type: "nav", title: "Event", url: "https://www.torn.com/page.php?sid=events"},
        { type: "nav", title: "Log", url: "https://www.torn.com/page.php?sid=log"},
        { type: "nav", title: "Friends", url: "https://www.torn.com/page.php?sid=list&type=friends"},
        { type: "nav", title: "Enemies", url: "https://www.torn.com/page.php?sid=list&type=enemies"},
        { type: "nav", title: "Targets", url: "https://www.torn.com/page.php?sid=list&type=targets"},

        // --- OTHER ---
        { type: "nav", title: "News", url: "https://www.torn.com/newspaper.php"},
        { type: "nav", title: "Bounties", url: "https://www.torn.com/bounties.php#!p=main"},
        { type: "nav", title: "Calendar", url: "https://www.torn.com/calendar.php"},
        { type: "nav", title: "Hall Of Fame", url: "https://www.torn.com/page.php?sid=hof"},

        // --- CATEGORY ---
        {
            title: "Crimes",
            items: [
                { type: "nav", title: "Search For Cash", url: "https://www.torn.com/page.php?sid=crimes#/searchforcash" },
                { type: "nav", title: "Bootlegging", url: "https://www.torn.com/page.php?sid=crimes#/bootlegging" },
                { type: "nav", title: "Graffiti", url: "https://www.torn.com/page.php?sid=crimes#/graffiti" },
                { type: "nav", title: "Shoplifting", url: "https://www.torn.com/page.php?sid=crimes#/shoplifting" },
                { type: "nav", title: "Pickpocketing", url: "https://www.torn.com/page.php?sid=crimes#/pickpocketing" },
                { type: "nav", title: "Card Skimming", url: "https://www.torn.com/page.php?sid=crimes#/cardskimming" },
                { type: "nav", title: "Burglary", url: "https://www.torn.com/page.php?sid=crimes#/burglary" },
                { type: "nav", title: "Hustling", url: "https://www.torn.com/page.php?sid=crimes#/hustling" },
                { type: "nav", title: "Disposal", url: "https://www.torn.com/page.php?sid=crimes#/disposal" },
                { type: "nav", title: "Cracking", url: "https://www.torn.com/page.php?sid=crimes#/cracking" },
                { type: "nav", title: "Forgery", url: "https://www.torn.com/page.php?sid=crimes#/forgery" },
                { type: "nav", title: "Scamming", url: "https://www.torn.com/page.php?sid=crimes#/scamming" },
                { type: "nav", title: "Arson", url: "https://www.torn.com/page.php?sid=crimes#/arson" }
            ],
        },
        {
            title: "Company",
            items: [
                { type: "nav", title: "Income Chart", url: "https://www.torn.com/companies.php#/option=income-chart" },
                { type: "nav", title: "Employees", url: "https://www.torn.com/companies.php#/option=employees" },
                { type: "nav", title: "Company Positions", url: "https://www.torn.com/companies.php#/option=company-positions" },
                { type: "nav", title: "Applications", url: "https://www.torn.com/companies.php#/option=applications" },
                { type: "nav", title: "Pricing", url: "https://www.torn.com/companies.php#/option=pricing" },
                { type: "nav", title: "Stock", url: "https://www.torn.com/companies.php#/option=stock" },
                { type: "nav", title: "Advertising", url: "https://www.torn.com/companies.php#/option=advertising" },
                { type: "nav", title: "Funds", url: "https://www.torn.com/companies.php#/option=funds" },
                { type: "nav", title: "Upgrades", url: "https://www.torn.com/companies.php#/option=upgrades" },
                { type: "nav", title: "Edit Profile", url: "https://www.torn.com/companies.php#/option=edit-profile" },
                { type: "nav", title: "Change Director", url: "https://www.torn.com/companies.php#/option=change-director" },
                { type: "nav", title: "Sell Company", url: "https://www.torn.com/companies.php#/option=sell-company" },
            ]
        },
        {
            title: "Faction",
            items: [
                { type: "nav", title: "Home", url: "https://www.torn.com/factions.php?step=your&type=1" },
                { type: "nav", title: "Info", url: "https://www.torn.com/factions.php?step=your&type=1#/tab=info" },
                { type: "nav", title: "Territory", url: "https://www.torn.com/factions.php?step=your&type=5#/tab=territory" },
                { type: "nav", title: "Rank", url: "https://www.torn.com/factions.php?step=your&type=12#/tab=rank" },
                { type: "nav", title: "Crimes", url: "https://www.torn.com/factions.php?step=your&type=12#/tab=crimes" },
                { type: "nav", title: "Upgrades", url: "https://www.torn.com/factions.php?step=your&type=12#/tab=upgrades" },
                { type: "nav", title: "Armory", url: "https://www.torn.com/factions.php?step=your&type=12#/tab=armoury" },
                { type: "nav", title: "Controls", url: "https://www.torn.com/factions.php?step=your&type=12#/tab=controls&option=members" },
            ]
        },


        // --- SUB CATEGORY EXAMPLE ---
        {
            title: "Utilities",
            items: [
                {
                    type: "group",
                    title: "Scroll",
                    items: [
                        { type: "action", title: "Top", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
                        { type: "action", title: "Bottom", run: () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }) },
                    ],
                },
                { type: "action", title: "Copy current URL", run: () => navigator.clipboard.writeText(location.href) },
                { type: "action", title: "Reload", run: () => location.reload() },
            ],
        },
    ];

    let isOpen = false;
    let root, input, list, header;
    let filtered = [];
    let searchIndex = [];
    let selectedIndex = 0;
    let usingKeyboard = true;

    const pathStack = [{ title: "Root", items: buildRootItems(COMMANDS) }];

    function resetTree() {
        pathStack.length = 1;
        pathStack[0].title = "Root";
        pathStack[0].items = buildRootItems(COMMANDS);
    }

    function buildRootItems(commands) {
        const items = [];

        for (const x of commands) {
            const isCategory = x && typeof x === "object" && !x.type && Array.isArray(x.items) && typeof x.title === "string";
            if (isCategory) {
                items.push({ type: "group", title: x.title, items: x.items });
            } else {
                items.push(x);
            }
        }

        return items.filter(Boolean);
    }

    const normalize = (s) => (s || "").toLowerCase().trim();

    function toast(msg) {
        const t = document.createElement("div");
        t.textContent = msg;
        t.style.cssText =
            "position:fixed;bottom:16px;left:16px;z-index:2147483647;" +
            "background:rgba(0,0,0,.75);color:white;padding:10px 12px;border-radius:10px;" +
            "font:13px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif";
        document.documentElement.appendChild(t);
        setTimeout(() => t.remove(), 1200);
    }

    function goTo(url) {
        if (!url) return;
        const finalUrl = url.startsWith("http") ? url : new URL(url, location.origin).toString();
        location.assign(finalUrl);
    }

    function looksLikeMath(q) {
        const s = (q || "").replace(/^=\s*/, "").trim();
        if (!s) return false;

        if (!/[0-9]/.test(s)) return false;
        return /[+\-*/()%]/.test(s);
    }

    function safeCalc(q) {
        const raw = (q || "").replace(/^=\s*/, "").trim();
        const parsed = parseAndEvalExpression(raw);
        return parsed;
    }

    function parseAndEvalExpression(expr) {
        const { tokens, format } = tokenize(expr);
        if (!tokens.length) throw new Error("Empty expression");

        const rpn = toRPN(tokens);
        const value = evalRPN(rpn);

        if (typeof value !== "number" || !isFinite(value)) throw new Error("Bad result");

        return {
            value,
            formatted: formatResult(value, format),
        };
    }

    function tokenize(expr) {
        const s = (expr || "").trim();
        let i = 0;

        const tokens = [];
        const format = {
            currency: null,
            maxDecimalsSeen: 0,
            anyCommaFormatting: false,
        };

        const isWS = (c) => c === " " || c === "\t" || c === "\n" || c === "\r";
        const isDigit = (c) => c >= "0" && c <= "9";

        const prevTokenType = () => (tokens.length ? tokens[tokens.length - 1].type : "start");

        const isUnaryMinusPosition = () => {
            const t = prevTokenType();
            return t === "start" || t === "op" || t === "(";
        };

        function readNumber(startIndex, signed) {
            let j = startIndex;

            let sign = 1;
            if (signed) {
                sign = -1;
                j++;
                while (j < s.length && isWS(s[j])) j++;
            }

            let currency = null;
            if (s[j] === "$") {
                currency = "$";
                j++;
                while (j < s.length && isWS(s[j])) j++;
            }

            let hasDigits = false;
            let hasDot = false;
            let sawComma = false;
            let numStr = "";

            if (s[j] === ".") {
                hasDot = true;
                numStr += ".";
                j++;
            }

            while (j < s.length) {
                const c = s[j];
                if (isDigit(c)) {
                    hasDigits = true;
                    numStr += c;
                    j++;
                    continue;
                }
                if (c === ",") {
                    sawComma = true;
                    numStr += ",";
                    j++;
                    continue;
                }
                if (c === ".") {
                    if (hasDot) break;
                    hasDot = true;
                    numStr += ".";
                    j++;
                    continue;
                }
                break;
            }

            if (!hasDigits) return null;

            if (currency) format.currency = format.currency || currency;
            if (sawComma) format.anyCommaFormatting = true;

            const decimals = (() => {
                const idx = numStr.indexOf(".");
                return idx >= 0 ? (numStr.length - idx - 1) : 0;
            })();
            format.maxDecimalsSeen = Math.max(format.maxDecimalsSeen, decimals);

            const normalized = numStr.replace(/,/g, "");
            const n = Number(normalized);
            if (!isFinite(n)) throw new Error("Invalid number");

            return { token: { type: "num", value: sign * n }, nextIndex: j };
        }

        while (i < s.length) {
            const c = s[i];

            if (isWS(c)) { i++; continue; }

            if (c === "(") { tokens.push({ type: "(" }); i++; continue; }
            if (c === ")") { tokens.push({ type: ")" }); i++; continue; }

            if (c === "+" || c === "*" || c === "/") {
                tokens.push({ type: "op", op: c });
                i++;
                continue;
            }

            if (c === "-") {
                if (isUnaryMinusPosition()) {
                    const attempt = readNumber(i, true);
                    if (attempt) {
                        tokens.push(attempt.token);
                        i = attempt.nextIndex;
                        continue;
                    }
                    tokens.push({ type: "num", value: 0 });
                    tokens.push({ type: "op", op: "-" });
                    i++;
                    continue;
                } else {
                    tokens.push({ type: "op", op: "-" });
                    i++;
                    continue;
                }
            }

            if (c === "%") {
                tokens.push({ type: "pct" });
                i++;
                continue;
            }

            if (c === "$" || c === "." || isDigit(c)) {
                const attempt = readNumber(i, false);
                if (!attempt) throw new Error("Invalid number format");
                tokens.push(attempt.token);
                i = attempt.nextIndex;
                continue;
            }

            throw new Error(`Invalid character: ${c}`);
        }

        return { tokens, format };
    }

    function toRPN(tokens) {
        const output = [];
        const stack = [];

        const precedence = (t) => {
            if (t.type === "pct") return 3;
            if (t.type === "op" && (t.op === "*" || t.op === "/")) return 2;
            if (t.type === "op" && (t.op === "+" || t.op === "-")) return 1;
            return 0;
        };

        for (const t of tokens) {
            if (t.type === "num") {
                output.push(t);
                continue;
            }

            if (t.type === "pct") {
                output.push(t);
                continue;
            }

            if (t.type === "op") {
                while (stack.length) {
                    const top = stack[stack.length - 1];
                    if (top.type === "op" && precedence(top) >= precedence(t)) {
                        output.push(stack.pop());
                    } else {
                        break;
                    }
                }
                stack.push(t);
                continue;
            }

            if (t.type === "(") { stack.push(t); continue; }

            if (t.type === ")") {
                while (stack.length && stack[stack.length - 1].type !== "(") {
                    output.push(stack.pop());
                }
                if (!stack.length) throw new Error("Mismatched parentheses");
                stack.pop();
                continue;
            }

            throw new Error("Unknown token");
        }

        while (stack.length) {
            const top = stack.pop();
            if (top.type === "(" || top.type === ")") throw new Error("Mismatched parentheses");
            output.push(top);
        }

        return output;
    }

    function evalRPN(rpn) {
        const st = [];

        for (const t of rpn) {
            if (t.type === "num") {
                st.push(t.value);
                continue;
            }

            if (t.type === "pct") {
                if (st.length < 1) throw new Error("Bad %");
                const a = st.pop();
                st.push(a / 100);
                continue;
            }

            if (t.type === "op") {
                if (st.length < 2) throw new Error("Bad operator usage");
                const b = st.pop();
                const a = st.pop();
                let r;

                if (t.op === "+") r = a + b;
                else if (t.op === "-") r = a - b;
                else if (t.op === "*") r = a * b;
                else if (t.op === "/") r = a / b;
                else throw new Error("Unknown operator");

                st.push(r);
                continue;
            }

            throw new Error("Unknown RPN token");
        }

        if (st.length !== 1) throw new Error("Bad expression");
        return st[0];
    }

    function formatResult(value, format) {
        const currency = format.currency;
        const decimals = format.maxDecimalsSeen > 0 ? format.maxDecimalsSeen : 0;
        const abs = Math.abs(value);
        const sign = value < 0 ? "-" : "";

        const formattedNumber = abs.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });

        return `${sign}${formattedNumber}`;
    }


    function ensureUI() {
        if (root) return;

        root = document.createElement("div");
        root.id = "ups-raycast-root";
        root.innerHTML = `
      <div class="ups-backdrop"></div>
      <div class="ups-panel" role="dialog" aria-modal="true">
        <div class="ups-header"><div class="ups-breadcrumb"></div></div>
        <input class="ups-input" type="text" placeholder="Search… (math like 23*42 works too)" />
        <div class="ups-hint">Alt+K / Ctrl+K • ↑↓ • Enter • Esc • Backspace(empty)=back</div>
        <div class="ups-list" role="listbox"></div>
      </div>
    `;

        const style = document.createElement("style");
        style.textContent = `
      #ups-raycast-root{position:fixed;inset:0;z-index:2147483647;display:none}
      #ups-raycast-root .ups-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.35);backdrop-filter:blur(4px)}
      #ups-raycast-root .ups-panel{position:absolute;top:12vh;left:50%;transform:translateX(-50%);
        width:min(760px,92vw);background:rgba(20,20,22,.98);border:1px solid rgba(255,255,255,.08);
        border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.45);color:#fff;overflow:hidden;
        font:14px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}
      #ups-raycast-root .ups-header{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.06)}
      #ups-raycast-root .ups-breadcrumb{opacity:.9;font-size:12px}
      #ups-raycast-root .ups-input{width:100%;box-sizing:border-box;padding:14px;border:none;outline:none;
        background:rgba(255,255,255,.06);color:#fff;font-size:15px}
      #ups-raycast-root .ups-hint{padding:8px 14px;opacity:.65;font-size:12px;border-bottom:1px solid rgba(255,255,255,.06)}
      #ups-raycast-root .ups-list{max-height:52vh;overflow:auto}
      #ups-raycast-root .ups-item{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.06);cursor:pointer}
      #ups-raycast-root .ups-item .title{font-weight:600}
      #ups-raycast-root .ups-item .subtitle{opacity:.7;font-size:12px;margin-top:2px}
      #ups-raycast-root .ups-item.selected{background:rgba(255,255,255,.10)}
    `;
        document.documentElement.appendChild(style);
        document.documentElement.appendChild(root);

        input = root.querySelector(".ups-input");
        list = root.querySelector(".ups-list");
        header = root.querySelector(".ups-breadcrumb");

        root.addEventListener("mousemove", () => {
            usingKeyboard = false;
        });

        root.querySelector(".ups-backdrop").addEventListener("click", close);

        input.addEventListener("input", () => {
            selectedIndex = 0;
            render();
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Escape") { e.preventDefault(); close(); return; }

            if (e.key === "Backspace" && input.value.length === 0) {
                if (pathStack.length > 1) {
                    e.preventDefault();
                    pathStack.pop();
                    selectedIndex = 0;
                    render();
                }
                return;
            }

            if (e.key === "ArrowDown") { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1); render(); return; }
            if (e.key === "ArrowUp") { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, 0); render(); return; }
            if (e.key === "Enter") { e.preventDefault(); runSelected(); return; }
        });
    }

    function breadcrumbText() {
        return pathStack.map(p => p.title).join("  ›  ");
    }

    function open() {
        ensureUI();
        isOpen = true;
        root.style.display = "block";
        input.value = "";
        selectedIndex = 0;
        render();
        setTimeout(() => input.focus(), 0);
    }

    function close() {
        isOpen = false;
        if (root) root.style.display = "none";
    }

    function currentItems() {
        return pathStack[pathStack.length - 1].items || [];
    }

    function norm(s) {
        return (s || "")
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function initialsOf(title) {
        return norm(title)
            .split(/[\s\-_/]+/)
            .filter(Boolean)
            .map(w => w[0])
            .join("");
    }

    function buildSearchIndex() {
        const rootItems = buildRootItems(COMMANDS);
        const out = [];

        function visit(items, breadcrumb) {
            for (const it of items || []) {
                if (!it) continue;

                const isGroup = it.type === "group" && Array.isArray(it.items);
                const title = it.title || "";
                const url = it.url || "";
                const aliases = Array.isArray(it.aliases) ? it.aliases : [];
                const bc = [...breadcrumb, title].filter(Boolean);
                const bcText = bc.join(" › ");

                const hayParts = [
                    title,
                    url,
                    bcText,
                    ...aliases
                ].map(norm);

                out.push({
                    item: it,
                    breadcrumb: bc,
                    breadcrumbText: bcText,
                    hay: hayParts.join(" "),
                    initials: initialsOf(title),
                    aliasInitials: aliases.map(initialsOf),
                });

                if (isGroup) {
                    visit(it.items, bc);
                }
            }
        }

        visit(rootItems, []);
        searchIndex = out;
    }

    function scoreMatch(q, entry) {
        const t = norm(entry.item.title);
        const hay = entry.hay;
        const init = entry.initials;

        if (!q) return -Infinity;

        let score = -Infinity;

        if (t === q) score = Math.max(score, 1000);
        if (t.startsWith(q)) score = Math.max(score, 850);
        if (hay.includes(q)) score = Math.max(score, 500);
        if (init && init === q) score = Math.max(score, 900);
        if (init && init.startsWith(q)) score = Math.max(score, 820);

        const aliases = Array.isArray(entry.item.aliases) ? entry.item.aliases.map(norm) : [];
        if (aliases.includes(q)) score = Math.max(score, 920);
        if (aliases.some(a => a.startsWith(q))) score = Math.max(score, 830);
        if (aliases.some(a => a.includes(q))) score = Math.max(score, 620);

        const bc = norm(entry.breadcrumbText);
        if (bc.includes(q)) score = Math.max(score, score + 20);
        if (!t.includes(q) && !aliases.some(a => a.includes(q)) && hay.includes(q)) {
            score -= 30;
        }

        return score;
    }

    function globalSearch(qRaw) {
        const q = norm(qRaw);
        if (!q) return [];

        const results = [];

        for (const entry of searchIndex) {
            const sc = scoreMatch(q, entry);
            if (sc > 0) {
                results.push({ entry, score: sc });
            }
        }

        results.sort((a, b) => b.score - a.score);

        return results.slice(0, 80).map(r => ({
            ...r.entry.item,
            _breadcrumb: r.entry.breadcrumbText,
            _score: r.score,
        }));
    }

    function render() {
        header.textContent = breadcrumbText();
        const q = normalize(input.value);

        let calcItem = null;
        if (q && looksLikeMath(q)) {
            try {
                const { value, formatted } = safeCalc(q);
                calcItem = {
                    type: "action",
                    title: `Result: ${formatted}`,
                    subtitle: "Enter to copy result",
                    run: () => navigator.clipboard.writeText(String(formatted)),
                };
            } catch (e) {
                calcItem = {
                    type: "noop",
                    title: "Calculator: invalid expression",
                    subtitle: "Allowed: 0-9 + - * / ( ) . %  (you can type '23*42')",
                    run: () => {},
                };
            }
        }

        let items;
        if (!q) {
            items = currentItems();
            filtered = items.filter((it) => {
                if (!q) return true;
                const url = it.url || "";
                const subtitle = it.subtitle || (it.type === "group" ? "Open category" : "");
                const hay = normalize(it.title + " " + url + " " + subtitle);
                return hay.includes(q);
            });
        } else {
            filtered = globalSearch(q);
        }

        if (calcItem) filtered = [calcItem, ...filtered];

        list.innerHTML = "";
        if (!filtered.length) {
            list.innerHTML = `<div class="ups-item"><div class="title">No results</div><div class="subtitle">Try another query</div></div>`;
            return;
        }

        filtered.forEach((a, idx) => {
            const item = document.createElement("div");
            item.className = "ups-item" + (idx === selectedIndex ? " selected" : "");
            const breadcrumb = a._breadcrumb || ""; // ajouté par globalSearch
            const subtitle =
                q
                    ? (breadcrumb || (a.type === "nav" ? a.url : (a.subtitle || (a.type === "group" ? "Open category" : ""))))
                    : (a.type === "nav" ? a.url : (a.subtitle || (a.type === "group" ? "Open category" : "")));
            item.innerHTML = `<div class="title"></div><div class="subtitle"></div>`;
            item.querySelector(".title").textContent = a.title;
            item.querySelector(".subtitle").textContent = subtitle || "";
            item.addEventListener("mouseenter", () => {
                if (usingKeyboard) return;
                selectedIndex = idx;
                render();
            });
            item.addEventListener("click", () => {
                usingKeyboard = false;
                selectedIndex = idx;
                runSelected();
            });
            list.appendChild(item);
        });
    }

    function runSelected() {
        const a = filtered[selectedIndex];
        if (!a) return;

        if (a.type === "group") {
            pathStack.push({ title: a.title, items: a.items || [] });
            input.value = "";
            selectedIndex = 0;
            render();
            return;
        }

        resetTree();
        close();

        try {
            if (a.type === "nav") goTo(a.url);
            else if (a.type === "action") a.run?.();
            else a.run?.();
        } catch (e) {
            console.error(e);
            toast("Error: check console");
        }
    }

    function isTypingInField(target) {
        const el = target || document.activeElement;
        if (!el) return false;

        const tag = (el.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return true;
        if (el.isContentEditable) return true;

        return false;
    }

    function matchesHotkey(e) {
        const key = (e.key || "").toLowerCase();
        return HOTKEYS.some((h) =>
            key === h.key &&
            e.altKey === !!h.alt &&
            e.ctrlKey === !!h.ctrl &&
            e.shiftKey === !!h.shift
        );
    }

    function onKeydown(e) {
        if (!matchesHotkey(e)) return;
        if (!isOpen && isTypingInField(e.target)) return;

        e.preventDefault();
        e.stopPropagation();

        isOpen ? close() : open();
    }

    buildSearchIndex();
    window.addEventListener("keydown", onKeydown, true);
})();
