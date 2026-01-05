// ==UserScript==
// @name         Grupowanie z całej mapy (android)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Dodaje klanowiczów i przyjaciół z całej mapy do grupy. Wersja bez komunikatów + widget.
// @author       NSP
// @match        https://*.margonem.pl/*
// @match        http://*.margonem.pl/*
// @match        https://*.margonem.com/*
// @match        http://*.margonem.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561385/Grupowanie%20z%20ca%C5%82ej%20mapy%20%28android%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561385/Grupowanie%20z%20ca%C5%82ej%20mapy%20%28android%29.meta.js
// ==/UserScript==
 
function run(Engine) {
 
    /* ================== FILTR KOMUNIKATÓW ================== */
 
    const FILTER_PATTERNS = [
        /wysłano zaproszenie/i,
        /zaproszenie.*wysłane/i,
        /już.*członkiem.*(grupy|drużyny)/i,
        /already.*(party|group)/i,
        /player.*already/i
    ];
 
    const matchesFilter = txt =>
        txt && FILTER_PATTERNS.some(re => re.test(String(txt)));
 
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!node) continue;
 
                let text = "";
                try {
                    text = node.innerText || node.textContent || "";
                } catch {}
 
                if (matchesFilter(text)) {
                    try { node.remove(); } catch {}
                }
            }
        }
    });
 
    observer.observe(document.body, { childList: true, subtree: true });
 
    /* ================== LOGIKA GRUPOWANIA ================== */
 
    function isInParty(id) {
        if (!Engine.party) return false;
        return Object.keys(Engine.party.getMembers()).includes(String(id));
    }
 
    function groupFromMap() {
        if (!Engine?.others) return;
 
        const list = Engine.others.getDrawableList();
 
        for (const o of list) {
            if (!o.isPlayer) continue;
 
            const rel = o.d.relation;
            const isFriend = [2, 4, 5].includes(rel);
            const isClanMate = rel === 3;
 
            if ((isFriend || isClanMate) && !isInParty(o.d.id)) {
                _g(`party&a=inv&id=${o.d.id}`);
            }
        }
    }
 
    /* ================== WIDGET GRE ================== */
 
    const defaultPosition = [5, 'bottom-right-additional'];
 
    const addWidgetToDefaultWidgetSet = function () {
        Engine.widgetManager.addKeyToDefaultWidgetSet(
            'groupmap',
            defaultPosition[0],
            defaultPosition[1],
            'Grupa',
            'green',
            groupFromMap
        );
    };
 
    /* ====== IKONA: LITERA "G" ====== */
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .main-buttons-container .widget-button .icon.groupmap {
                background: #2f8f2f;
                color: #fff;
                font-weight: bold;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .main-buttons-container .widget-button .icon.groupmap::after {
                content: "G";
            }
        </style>
    `);
 
    const addWidgetButtons = Engine.widgetManager.addWidgetButtons;
    Engine.widgetManager.addWidgetButtons = function (additionalBarHide) {
        addWidgetButtons.call(Engine.widgetManager, additionalBarHide);
        addWidgetToDefaultWidgetSet();
        createWidget();
        Engine.widgetManager.addWidgetButtons = addWidgetButtons;
    };
 
    if (Engine.interfaceStart) {
        addWidgetToDefaultWidgetSet();
        createWidget();
    }
 
    function createWidget() {
        if (
            Engine.interfaceStart &&
            Object.keys(Engine.widgetManager.getDefaultWidgetSet()).includes('groupmap')
        ) {
            let pos = defaultPosition;
            const stored = Engine.serverStorage.get(
                Engine.widgetManager.getPathToHotWidgetVersion()
            );
            if (stored && stored.groupmap) pos = stored.groupmap;
 
            Engine.widgetManager.createOneWidget(
                'groupmap',
                { groupmap: pos },
                true,
                []
            );
 
            Engine.widgetManager.setEnableDraggingButtonsWidget(false);
        } else {
            setTimeout(createWidget, 500);
        }
    }
}
 
/* ================== START (ANDROID SAFE) ================== */
 
(function waitForEngine() {
    if (window.Engine && Engine.widgetManager) {
        run(window.Engine);
    } else {
        setTimeout(waitForEngine, 500);
    }
})();