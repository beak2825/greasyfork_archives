// ==UserScript==
// @name         Babel Audio happyglue's QoL
// @namespace    http://violentmonkey.net/
// @version      1.15.10
// @description  Audio QA Team: Hotkeys, UI enhancements, Bug fixes, etc.
// @author       happyglue
// @match        https://davidai.retool.com/*
// @match        https://retool-edge.com/custom-component-collections.html
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553247/Babel%20Audio%20happyglue%27s%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/553247/Babel%20Audio%20happyglue%27s%20QoL.meta.js
// ==/UserScript==
!function(){"use strict";var e;let t=!1,a=!1,n=[],i=null,r=null,o=!1,l=!1,s,d,c=null,p=!1,u={rating:{KeyZ:1,KeyX:2,KeyC:3},timestamp:{Digit1:0,Digit2:1,KeyQ:2,KeyW:3,KeyA:4,Digit3:5,Digit4:6,KeyE:7,KeyR:8,KeyD:9,Digit5:10,Digit6:11,KeyT:12,KeyY:13,KeyG:14,Digit7:15,Digit8:16,KeyU:17,KeyI:18,KeyJ:19,Digit9:20,Digit0:21,KeyO:22,KeyP:23,KeyL:24,AltDigit1:25,AltDigit2:26,AltQ:27,AltW:28,AltA:29},feedback:{Numpad0:"Clarity",Numpad1:"Clarity",Numpad4:"Clarity",Numpad7:"Clarity",Numpad2:"Noise",Numpad5:"Noise",Numpad8:"Noise",NumpadDivide:"Noise",Numpad6:"Echo",Numpad9:"Network",NumpadMultiply:"Voice"},forward:["KeyB","KeyN","KeyM","Comma","Period","Slash","Equal","Minus","Space","ArrowLeft","ArrowRight","BracketLeft","BracketRight","Quote","Backslash"]},b={mainContentArea:'[data-testid^="RetoolGrid::Main"]',claimContainerParent:'[data-testid^="RetoolGrid:conferenceAuditingV"][data-testid$="::conferenceClaiming2"]',ratingSectionParent:'[data-testid^="RetoolGrid:conferenceAuditingV"][data-testid$="::tabbedContainer1"]',ratingContainerParent:'[data-testid^="RetoolGrid:conferenceAuditingV"][data-testid$="::gradingRubricV"]:not([data-testid*="::table7"])',tableContainer:'[id^="conferenceAuditing"][id*="::gradingRubricV"][id$="::table5--0"]',overallRatingContainerParent:'[data-testid^="RetoolGrid:conferenceAuditingV"][data-testid$="::eloRanking1"]',spinner:'[class="spinner retool-icon retool-icon-Loading retool-icon-loading spinner"]',iframeSelector:'iframe[src*="retool-edge.com"]',nextButton:'[data-testid="Component::Action-button2--0"]',row:"[data-item-index]",categoryColumn:'[data-column-id="7f5aa"]',ratedStarColumn:'[data-column-id="81da2"]',timestampDeleteButton:'button[aria-label="Delete"]',rubricTab:'[data-testid^="Tabs::Tab::1"]',hideSidebarButton:'[data-testid^="Component::Action-conferenceAuditing"][data-testid$="::toggleButton2--0"]',sortCategoryHeader:'[role="columnheader"][data-column-id="7f5aa"]',auditConferenceId:'[data-testid^="Component::Text-conferenceAuditingV"][data-testid$="::containerTitle1--0"] code',reviewerToggle:'[data-testid^="Component::Action-conferenceAuditingV"][data-testid*="::gradingRubricV"][data-testid$="::switch1--0"]',reviewerSelect:'[data-testid^="RetoolGrid:conferenceAuditingV"][data-testid*="::gradingRubricV"][data-testid$="::select1"]',draggable:{parent:'[data-testid^="RetoolStack::conferenceAuditingV"][data-testid$="::stack1"]',leftPanel:'[data-testid^="RetoolGrid:conferenceAuditingV"][data-testid$="::container3"]',rightPanel:'[data-testid^="RetoolGrid:conferenceAuditingV"][data-testid$="::tabbedContainer1"]'},toggleInput:'input[id^="conferenceAuditingV"][id*="toggle_compressed_delivery_audio"]',toggleWidget:'[data-testid^="RetoolGrid:conferenceAuditingV"][data-testid*="::toggle_compressed_delivery_audio"]',audioPlayerAny:'[data-testid^="RetoolGrid:conferenceAuditingV"][data-testid*="multiChannelAudioPlayer"]',tabsToHide:'[data-testid^="RetoolGrid:conferenceAuditingV"][data-testid$="::tabs2"]',oldHeaderFallback:'header:has([data-grid-id*="::tabbedContainer2____0__header"])',oldHeaderInternal:'[data-grid-id$="::tabbedContainer2____0__header"]',topHeaders:'[data-testid^="ContainerWidget_conferenceAuditingV"][data-testid*="::container1"] header',titleContainer:'[data-testid^="RetoolGrid:conferenceAuditingV"][data-testid$="::containerTitle1"]',resizeAudioWidget:'[data-testid^="RetoolWidget:DynamicWidget_AudioPlayer"][data-testid$="_MultiChannelAudioPlayer"]',resizeTargetGrid:'[data-testid="RetoolGrid::Main"][data-retool-main-frame-scroll-content="true"]',rating:{cell:'[data-column-id="38908"]',starStep:'[data-testid^="RatingStep"]'},timestampContainerParent:'[data-testid^="RetoolGrid:conferenceAuditingV"][data-testid*="::gradingRubricV"][data-testid$="::table7"]',timestampButton:"button[aria-label='Timestamp']",flagHeader:'[data-column-id="a34d1"][role="columnheader"]',timeHeader:'[data-column-id="5d85e"][role="columnheader"]',timestampGridScrollable:'[id^="conferenceAuditing"][id*="::gradingRubricV"][id$="::table7--0"] [data-testid="TableWrapper::ScrollableContainer"]',timestampRows:'[id^="conferenceAuditing"][id*="::gradingRubricV"][id$="::table7--0"] [data-testid="TableWrapper::ScrollableContainer"] [role="rowgroup"]',feedback:{cell:'[data-column-id="5dfa2"]',clickableContainer:'[data-is-cell-contents="true"]',starRatingContainer:'[data-testid="RatingGroup"]',filledStar:'[data-testid*="-filled"]'},jttButtonSelector:'[id^="conferenceAuditing"][id$="::button4--0"] > div > button',claimSelector:'div[data-testid="Alert::Body"]',statusText:'h3[data-testid="Alert::Title"]',saveButtonSelector:'[data-testid="BulkAction::Save"]',submitOverallButton:'[data-testid^="conferenceAuditingV"][data-testid$="::eloRanking1::button1--0"] button'},f={IS_MAC:navigator.userAgentData?"macOS"===navigator.userAgentData.platform:navigator.platform.toUpperCase().indexOf("MAC")>=0,CATEGORIES_PER_SPEAKER:5,CATEGORY_DEFINITIONS:[{key:"bgv",offset:0,matcher:e=>e.includes("background")&&e.includes("voice")},{key:"bgn",offset:1,matcher:e=>e.includes("background")&&e.includes("noise")},{key:"net",offset:2,matcher:e=>e.includes("network")&&e.includes("connection")},{key:"echo",offset:3,matcher:e=>e.includes("echo")},{key:"ac",offset:4,matcher:e=>e.includes("audio")&&e.includes("clarity")}],CATEGORY_ROW_INDICES:{Voice:{left:0,right:5,third:10,fourth:15,fifth:20,sixth:25},Noise:{left:1,right:6,third:11,fourth:16,fifth:21,sixth:26},Network:{left:2,right:7,third:12,fourth:17,fifth:22,sixth:27},Echo:{left:3,right:8,third:13,fourth:18,fifth:23,sixth:28},Clarity:{left:4,right:9,third:14,fourth:19,fifth:24,sixth:29}},FEEDBACK_LABELS:{Numpad0:"Muffle",Numpad1:"Saturation/Distortion",Numpad4:"Reverb",Numpad7:"Overlap",Numpad2:"Plosives",Numpad5:"Movement",Numpad8:"Outside Noise",NumpadDivide:"Breathing/Vocal Sounds",Numpad6:"Echo",Numpad9:"Network Connection",NumpadMultiply:"Background Voice"},REQUIRED_CLAIM_TEXT:"Claimed by you",SCROLL_DURATION_MS:100,OBSERVER_TIMEOUT_MS:8e3,INITIAL_DELAY_MS:200,MAX_PROCESSED_IDS:10,BRH_MULTIPLIERS:{2:.6,3:.6,4:.99,5:.99,6:.99},SPEAKER_COLOR_MAP:{"#1abc9c":0,"#3498db":1,"#e67e22":2,"#f1c40f":3,"#9b59b6":4,"#e84393":5}},m={PRIMARY:f.IS_MAC?"⌘Cmd":"Ctrl",ALT:f.IS_MAC?"⌥Opt":"Alt"},g={settings:{rating:!0,timestamps:!0,cursorLine:!0,audioSafety:!0,enhancedReset:!0,saveReview:!0,feedback:!0,panner:!0,zoomAndNavigation:!0,uiEnhancements:!0},ratingRows:[],standardizedRows:[],ratingIndex:0,tableContainer:null,isInitialized:!1,currentConferenceId:null,wasLoading:!1,iframeElement:null,rowObserver:null,hasInitialAudioCheckStarted:!1,conferenceLoadTimestamp:null,modifierState:{ControlLeft:!1,ControlRight:!1,AltLeft:!1,AltRight:!1,MetaLeft:!1,MetaRight:!1,ShiftLeft:!1,ShiftRight:!1,Minus:!1,Equal:!1},activeTimestampKey:null,timestampKeyUsedInCombo:!1,eventQueue:[],learnedSortMode:null,learnedSpeakerTemplate:[],layoutObserver:null,speakerCount:2,ratingQueue:[],isQueueLocked:!1,isRatingBusy:!1,eloOptimistic:null,isPasting:!1,actionQueue:[],claimObserver:null,isClaimConfirmed:!1,areRowsReady:!1,totalMinutes:0,totalBrh:0,processedIds:[],isWaitingForSave:!1,pendingConferenceId:null,conferenceCount:0,isBrhCollapsed:!0,lastRatedCount:0,isAnalyticsPanelOpen:!1,timestampList:[],pendingTimestampIndex:null,isScriptInitiatedDelete:!1,idObserver:null,idObserverTimeout:null,idContentObserver:null};window.isBabelFeedbackPasting=()=>g.isPasting;let y={Numpad0:"Your audio sounds a bit muffled. Adjusting mic distance and position may help — too close can cause bass buildup. Also, ensure the mic isn't blocked, and consider using one with better clarity if possible. Small tweaks can help a lot! ",Numpad1:"There’s some distortion or saturation in your audio. Try to check your input levels and lowering the mic gain or recording volume slightly. Also, make sure you're not too close to the mic to avoid clipping. These tweaks can really polish your sound! ",Numpad4:"It sounds like your audio has some reverb. Try recording in a room with beds, furniture, curtains, or lots of clothes—closets can work well. Loud levels capture more reverb, so record at a moderate level. This could make a noticeable improvement! ",Numpad7:"Your voice sounds a bit muffled, distorted or completely cuts out when others talk. Try to turn off any “voice enhancement” or “auto volume” options, keep the same distance from the mic and face it. Your audio will sound clean and clear throughout! ",Numpad2:"Your mic picks up breath and popping sounds (like Ps or Bs), often from being too close or centered. Try placing it to the side and about a hand’s width away. A pop filter can also make a big difference. Small tweaks often yield great results! ",Numpad5:"There are some background noises like typing, clicking, or mic handling — even body or clothing movement can be picked up. Try to stay as still and focused as possible while recording. Your voice will come through clear and more professionally! ",Numpad8:"There's a bit of outside noise sneaking into your recording — maybe from a nearby window or door. Recording in a more insulated room (thick curtains, rugs, closing doors/windows) can really help. A quieter space can take your quality further! ",Numpad9:"Your network connection seems a bit unstable, causing dropouts or delays. Try using Ethernet or a stronger WiFi, test your speed, or restart your router if needed. Closing other apps can help too. With these adjustments, your calls will sound great! ",NumpadDivide:"There are some breathing noises (like sniffing, sneezing, continuous and loud breathing) throughout the call. Try to stay focused and keep from producing these noises as much as you can to achieve a smoother conversation! ",Numpad6:"There are some instances of echo — this can happen when sound from your speakers or headset leaks into your mic. Try using a properly plugged-in headset, lowering playback volume, and keeping the mic 6–10 inches away. This should smooth things out! ",NumpadMultiply:"There’s another voice or background conversation in your audio. If possible, record in a quiet and isolated space, and let others know you're on an important call. This will reduce distractions and keep your voice clear! "},h={};function $(e){return new Promise(t=>setTimeout(t,e))}function v(e){try{return new URL(e).searchParams.get("conference_id")}catch(t){return console.error("Could not parse URL:",e,t),null}}function k(){return new Promise(e=>requestAnimationFrame(e))}function S(e){let t=Object.keys(e||{}).find(e=>e.startsWith("__reactFiber"));return t?e[t]:null}function _(e){if(!e)return!1;let t=(e=>{let t=Object.keys(e||{}).find(e=>e.startsWith("__reactFiber"));return t?e[t]:null})(e),a=null;for(let n=0;n<20&&t;n++){let i=t.memoizedProps;if(i&&"function"==typeof i.onClick){if(i.pluginType){try{i.onClick()}catch(r){console.error("Babel: Phantom Click error:",r)}return!0}a||(a=i)}t=t.return}if(a)try{return a.onClick({stopPropagation(){},preventDefault(){}}),!0}catch(o){console.error("Babel: Phantom Click (Backup) error:",o)}return console.warn("Babel: React prop not found. Falling back to DOM click."),e.click(),"function"==typeof e.blur&&e.blur(),!1}function w(e){return!!e&&"true"===e.getAttribute("aria-checked")}GM_addStyle(`
        .babel-no-hover { pointer-events: none !important; }
        .gm-elegant-warning { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(145deg, #E53935, #C62828); color: white; padding: 14px 28px; border-radius: 12px; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.2); box-shadow: 0 5px 15px rgba(0,0,0,0.25); animation: gm-fade-in-out 2s ease-in-out forwards; text-align: center; border: 1px solid rgba(255,255,255,0.2); }
        .gm-elegant-warning.warning-red { background: linear-gradient(145deg, #E53935, #C62828); }
        .gm-elegant-warning.warning-yellow { background: linear-gradient(145deg, #FFC107, #FFB300); color: #212121; /* Darker text for better contrast on yellow */ text-shadow: none; }

        @keyframes gm-fade-in-out {
            0%    { opacity: 0; top: 0; }
            15%   { opacity: 1; top: 20px; }
            85%   { opacity: 1; top: 20px; }
            100%  { opacity: 0; top: 0; }
        }

        /* --- GLOBAL CONFIGURATIONS --- */
        /* Hide 'Double Click to Timestamp' */
        [data-testid$="::text9"] { display: none !important; }
        /* Hide Useless 'End time' Column */
        [data-column-id="d4453"] { display: none !important; }
        /* 2. Force External Feedback to expand */
        [data-column-id="5dfa2"] {
            flex-grow: 1 !important;      /* Allow it to grow to fill space */
            flex-basis: auto !important;  /* Reset base size */
            width: auto !important;       /* Override fixed pixel width */
            max-width: none !important;   /* Remove restriction */
        }
        /* --- GLOBAL CONFIGURATIONS END --- */

        #babel-ui-container { position: fixed; bottom: 20px; right: 20px; z-index: 999998; display: flex; flex-direction: column; align-items: flex-end; gap: 5px; pointer-events: none;}
        #babel-brh-counter { background: rgba(242, 242, 247, 0.6); backdrop-filter: blur(2px) saturate(180%); cursor: pointer; user-select: none; visibility: hidden; opacity: 0;
          -webkit-backdrop-filter: blur(6px) saturate(180%); padding: 0; border-radius: 16px; border: 1px solid rgba(0, 0, 0, 0.1); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1d1d1f; font-size: 16px; font-weight: 500; }
        #brh-collapsed-content { display: none; }
        #babel-brh-counter.collapsed-view #brh-expanded-content { display: none; }
        #babel-brh-counter.collapsed-view #brh-collapsed-content { display: block; }
        /* --- BRH Final Header & Carets --- */
        #babel-brh-counter {
            box-sizing: border-box;
            padding: 0;
        }
        /* DIFFERENT PADDING for each state */
        #brh-collapsed-content {
            padding: 10px 12px; /* Less horizontal padding for a compact look */
        }
        #brh-expanded-content {
            padding: 10px 18px 0 18px; /* More padding for the wider view */
        }
        /* WHEN EXPANDED: Force a minimum width */
        #babel-brh-counter:not(.collapsed-view) {
            min-width: 220px;
        }

        /* --- Layout (Unchanged) --- */
        .brh-header-content {
            display: flex;
            align-items: center;
        }
        .brh-text {
            font-weight: 700;
            text-align: center;
            margin: 0 10px;
        }
        .brh-spacer {
            flex-grow: 1;
        }

        /* --- Caret Styles (Unchanged) --- */
        .brh-caret {
            display: inline-block;
            width: 8px;
            height: 8px;
            border: solid #888;
            border-width: 0 2px 2px 0;
            transition: transform 0.3s ease-in-out;
        }
        .brh-caret-left {
            transform: rotate(-45deg);
        }
        #babel-brh-counter:not(.collapsed-view) .brh-caret {
            transform: rotate(45deg);
        }

        #babel-brh-counter{ pointer-events: auto; }

        @keyframes fancyFadeUp { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(-60px) scale(0.5); } }

        /* --- Settings Menu Divider --- */
        #babel-settings-divider {
            border: 0;
            height: 1px;
            background: rgba(0, 0, 0, 0.1);
            margin: 8px 0;
        }
        /* --- Settings Menu Styles --- */
        #babel-settings-menu {
            margin-top: 12px;
            display: none; /* Hidden by default, shown when expanded */
            width: 220px;
            text-align: left;
            padding: 0 18px 20px 18px; /* Added padding */
            box-sizing: border-box;
        }
        .setting-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            font-size: 14px;
        }
        .setting-label {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .setting-info {
            position: relative;
            display: inline-block;
            cursor: pointer;
            color: #888;
        }
        .setting-info .tooltip-text {
            visibility: hidden;
            width: 250px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 8px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -125px; /* Use half of the width to center the tooltip */
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 12px;
            font-weight: 400;
            line-height: 1.6;
        }
        .setting-info:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
        }
        /* --- Toggle Switch Styles --- */
        .setting-toggle { position: relative; display: inline-block; width: 34px; height: 20px; }
        .setting-toggle input { opacity: 0; width: 0; height: 0; }
        .setting-toggle .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; border-radius: 20px; transition: .3s; }
        .setting-toggle .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; border-radius: 50%; background-image: none; transition: .3s; }
        .setting-toggle input:checked + .slider { background-color: #FB4302; }
        .setting-toggle input:checked + .slider:before { transform: translateX(14px); background-image: none; }
        /* --- Tooltip Key Highlight --- */
        .tooltip-text .tooltip-key {
            color: #FDB813; /* A nice amber/gold color */
            font-weight: 600;
            background-color: rgba(255, 255, 255, 0.1);
            padding: 1px 5px;
            border-radius: 4px;
            font-family: "SF Mono", "Menlo", "Courier New", monospace; /* A monospaced font for keys */
        }
        /* --- Tooltip Speaker Colors --- */
        .speaker-1 { color: #19B898; font-weight: 600; background-color: rgba(255, 255, 255, 0.15); padding: 1px 5px; border-radius: 4px; margin-right: 5px; }
        .speaker-2 { color: #3394D6; font-weight: 600; background-color: rgba(255, 255, 255, 0.15); padding: 1px 5px; border-radius: 4px; }
        .speaker-3 { color: #E17B21; font-weight: 600; background-color: rgba(255, 255, 255, 0.15); padding: 1px 5px; border-radius: 4px; }
        .speaker-4 { color: #EBBF0F; font-weight: 600; background-color: rgba(255, 255, 255, 0.15); padding: 1px 5px; border-radius: 4px; }
        .speaker-5 { color: #9757B2; font-weight: 600; background-color: rgba(255, 255, 255, 0.15); padding: 1px 5px; border-radius: 4px; }
        .speaker-6 { color: #e84393; font-weight: 600; background-color: rgba(255, 255, 255, 0.15); padding: 1px 5px; border-radius: 4px; }
        /* --- Tooltip Keyboard Layout (Timestamps) --- */
        .tooltip-keyboard {
            margin-top: 10px;
            padding: 12px 6px 12px 6px;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .keyboard-row {
            display: flex;
            justify-content: center;
            gap: 5px;
        }
        .keyboard-key {
            font-family: "SF Mono", "Menlo", "Courier New", monospace;
            font-size: 11px;
            font-weight: bold;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(to bottom, #6a6a6a, #555); /* Softer gradient */
            color: #ddd;
            border-radius: 4px;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 0 #333; /* Softer 3D effect */
            -webkit-font-smoothing: antialiased; /* Better font rendering */
            -moz-osx-font-smoothing: grayscale;
            transition: all 0.05s linear; /* For press animation */
        }
        .tooltip-keyboard .keyboard-row:nth-child(3) > .keyboard-key:first-child {
            margin-top: 13px; /* Adds extra space just above the 'A' key */
        }
        /* Adds a "press" effect when you click a key */
        .keyboard-key:active {
            transform: translateY(1px);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        /* Updated Color Overrides with matching shadows */
        .keyboard-key.speaker-1 {
            background: linear-gradient(135deg, #19B898 51%, #e84393 49%); /* S1 Color (left) / S6 Color (right) */
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 0 #117e6a; /* S1 shadow */
            color: #fff;
        }
        .keyboard-key.speaker-2 { background: #3394D6; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 0 #2476b0; color: #fff; }
        .keyboard-key.speaker-3 { background: #E17B21; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 0 #b5621a; color: #fff; }
        .keyboard-key.speaker-4 { background: #EBBF0F; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 0 #c29d0c; color: #000; }
        .keyboard-key.speaker-5 { background: #9757B2; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 0 #7a458f; color: #fff; }
        .keyboard-key.speaker-6 { background: #e84393; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 0 #c2387a; color: #fff; }
        /* --- Keyboard Key Labels & Positioning Context --- */
        .keyboard-key {
            position: relative;
            font-family: "SF Mono", "Menlo", "Courier New", monospace;
            font-size: 11px;
            font-weight: bold;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(to bottom, #6a6a6a, #555);
            color: #ddd;
            border-radius: 4px;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 0 #333;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            transition: all 0.05s linear;
        }
        .key-label {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            font-weight: 600;
            color: #ccc;
            white-space: nowrap;
            letter-spacing: 0.8px;
        }
        .key-label-top {
            bottom: 100%;
            margin-bottom: 3px;
        }
        .key-label-bottom {
            top: 100%;
            margin-top: 3px;
        }

        /* --- Feedback Editor Styles --- */
        .feedback-edit-btn {
            cursor: pointer;
            margin-left: 5px;
            font-size: 14px;
            opacity: 0.6;
            filter: brightness(0.6);
            transition: opacity 0.15s;
        }
        .feedback-edit-btn:hover {
            opacity: 0.8;
        }
        .modal-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 1000000;
            backdrop-filter: blur(5px);
        }
        .modal-close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            font-weight: bold;
            line-height: 1;
            color: #888;
            cursor: pointer;
            transition: color 0.2s;
        }
        .modal-close-btn:hover {
            color: #333;
        }
        #feedback-editor-modal {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 700px;
            max-height: 80vh;
            background: #f0f0f5;
            color: #1d1d1f;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 1000001;
            display: flex;
            flex-direction: column;
        }
        .modal-header {
            padding: 15px 20px;
            font-size: 18px;
            font-weight: 600;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .modal-content {
            padding: 20px;
            overflow-y: auto;
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
        }
        .feedback-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .feedback-item label {
            font-family: "SF Mono", "Menlo", "Courier New", monospace;
            font-weight: 600;
            font-size: 13px;
            opacity: 0.8;
        }
        .feedback-item textarea {
            width: 100%;
            min-height: 80px;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-size: 14px;
            resize: none;
            overflow-y: hidden;
        }
        .modal-footer {
            padding: 15px 20px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            border-top: 1px solid rgba(0,0,0,0.1);
        }
        .modal-btn {
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            border: none;
        }
        .modal-btn-primary { background-color: #FB4302; color: white; }
        .modal-btn-secondary { background-color: #e5e5ea; color: black; }

        /* --- Keyboard Layout Selector Tooltip --- */
        .lang-toggle {
            position: relative; /* Establishes a positioning context for the tooltip */
        }
        .lang-tooltip-text {
            visibility: hidden;
            opacity: 0;
            width: 180px;
            background-color: #666;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px 8px;
            position: absolute;
            z-index: 101;
            bottom: 125%; /* Position it above the "EN | ESP" text */
            left: 50%;
            margin-left: -90px; /* Centers the tooltip (half of its width) */
            transition: opacity 0.2s;
            font-size: 12px;
            font-weight: 400;
            pointer-events: none; /* Prevents the tooltip from interfering with clicks */
        }
        /* This is the magic: Show the tooltip only when hovering the .lang-toggle div */
        .lang-toggle:hover .lang-tooltip-text {
            visibility: visible;
            opacity: 1;
        }

       /* --- START: Unified Panel CSS --- */
      /* --- Main Container & Responsive Width --- */
      #babel-rubric-container {
          position: fixed;
          bottom: 80px;
          left: 0px;
          z-index: 999996;
          display: flex;
          align-items: stretch;
          /* Defines a variable for panel width that adapts to screen size */
          --panel-width: clamp(300px, 24vw, 450px);
      }

      /* --- Tab & Panel Base Styles --- */
      #babel-rubric-tab {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          padding: 12px 8px;
          background: #333;
          color: #f5f5f7;
          border-radius: 12px 0 0 12px;
          cursor: pointer;
          font-weight: 600;
          user-select: none;
          margin-right: -1px;
          z-index: 2;
          align-self: flex-end;
          transition: background-color 0.2s ease;
      }
      #babel-rubric-tab:hover,
      #babel-analytics-tab:hover {
          background-color: #505055;
      }
      #babel-rubric-panel, #babel-analytics-panel {
          display: none;
          background: #333;
          color: #e0e0e0;
          border-radius: 12px;
          border: 3px solid rgba(255, 255, 255, 0.15);
          width: var(--panel-width); /* Use the responsive width */
          box-sizing: border-box;
          /* Make the padding inside the panels responsive */
          padding: clamp(12px, 2vw, 15px);
      }
      #babel-rubric-panel {
          position: relative; /* Context for the button */
          z-index: 1;
      }

      /* --- Corner Filler --- */
      #babel-rubric-corner-filler {
          display: none;
          position: absolute;
          bottom: 0;
          left: 20px;
          width: 20px;
          height: 10px;
          background: #333;
          z-index: 1;
          border-bottom: 3px solid rgba(255, 255, 255, 0.15);
      }
      #babel-rubric-container.expanded #babel-rubric-corner-filler {
          display: block;
      }


      /* --- Vertical Analytics Tab Style --- */
      #babel-analytics-tab {
          position: absolute; /* Takes the tab out of the document flow */
          left: 0;
          transform: translateX(calc(var(--panel-width) + 27px));
          top: 30px;
          writing-mode: vertical-rl;
          padding: 12px 8px;
          background: #3a3a3a;
          color: #F5F5F7;
          border-radius: 0 12px 12px 0;
          cursor: pointer;
          font-weight: 600;
          user-select: none;
          z-index: 2;
          transition: transform 0.4s ease, background-color 0.2s ease;
          height: 120px;
          display: none; /* It is now controlled by JS */
      }
      #babel-analytics-tab.disabled {
          background-color: #444;
          color: #888;
          cursor: not-allowed;
      }
      /* This is the "pull-out" animation */
      #babel-rubric-container.analytics-expanded #babel-analytics-tab {
          transform: translateX(calc(var(--panel-width) * 2 + 27px));
      }


      /* --- Unified & Responsive Table Layout for BOTH Panels --- */
      .rubric-table {
          table-layout: fixed;
          width: 100%;
          border-collapse: collapse;
      }
      /* Give the Category column 40% of the table width */
      .rubric-table th:nth-child(1), .rubric-table td:nth-child(1) {
          width: 30%;
          text-align: center;
      }
      /* Allow text in all cells to wrap gracefully and be responsive */
      .rubric-table td, .rubric-table th {
          word-break: break-word;
          white-space: normal;
          vertical-align: middle;
          text-align: center;
          font-size: clamp(10px, 0.6vw, 13px) !important;
          padding: clamp(6px, 1vw, 8px) 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: background-color 0.15s;
          box-sizing: border-box;
      }
      .rubric-table tbody tr:last-child td {
          border-bottom: none;
      }
      .rubric-table th {
          font-weight: 700;
          color: white;
      }

      /* --- Cell & Header Colors --- */
      .rubric-good { background-color: rgba(46, 139, 87, 0.3); }
      .rubric-ok   { background-color: rgba(255, 215, 0, 0.25); }
      .rubric-bad  { background-color: rgba(220, 20, 60, 0.3); }

      .header-speaker-1 { background-color: #3e9c8a; color: #e0e0e0; }
      .header-speaker-2 { background-color: #428bba; color: #e0e0e0; }
      .header-speaker-3 { background-color: #d4721c; color: #e0e0e0; }
      .header-speaker-4 { background-color: #cca80d; color: #e0e0e0; }
      .header-speaker-5 { background-color: #8958a0; color: #e0e0e0; }
      .header-speaker-6 { background-color: #e84393; color: #e0e0e0; }

      /* Column Hiding */
      .speakers-2 th:nth-child(n+4), .speakers-2 td:nth-child(n+4) { display: none; }
      .speakers-3 th:nth-child(n+5), .speakers-3 td:nth-child(n+5) { display: none; }
      .speakers-4 th:nth-child(n+6), .speakers-4 td:nth-child(n+6) { display: none; }
      .speakers-5 th:nth-child(n+7), .speakers-5 td:nth-child(n+7) { display: none; }

      /* --- Analytics Panel Sync Button --- */
      .babel-analytics-footer {
          padding-top: 10px;
          margin-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
      }
      #babel-sync-warning {
          font-size: 11px;
          color: #f0f0f0;
          opacity: 0.6;
          font-style: italic;
      }
      #babel-sync-timestamps-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #f0f0f0;
          cursor: pointer;
          border-radius: 6px;
          padding: 5px 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          transition: background-color 0.2s;
      }
      #babel-sync-timestamps-btn:hover {
          background: rgba(255, 255, 255, 0.2);
      }
      #babel-sync-timestamps-btn svg {
          width: 12px;
          height: 12px;
          fill: currentColor;
      }
      #babel-sync-timestamps-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: rgba(0, 0, 0, 0.2);
      }
      #babel-sync-timestamps-btn.syncing-animation svg {
           animation: gm-spin 1s linear infinite;
      }
      @keyframes gm-spin {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
      }

      /* --- END: Unified Panel & Table CSS --- */

      /* --- START: LANGUAGE OVERLAY --- */
      .babel-lang-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(250, 250, 250, 0.85);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          z-index: 100;
          border-radius: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
      }
      .babel-lang-box {
          text-align: center;
          color: #1d1d1f;
      }
      .babel-lang-box p {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 12px;
      }
      .babel-lang-btn {
          font-weight: 600;
          font-size: 14px;
          padding: 8px 16px;
          margin: 0 5px;
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.2);
          border-radius: 8px;
          background-color: rgba(255,255,255,0.5);
          transition: background-color 0.2s, transform 0.2s;
      }
      .babel-lang-btn:hover {
          background-color: rgba(255,255,255,0.9);
          transform: scale(1.05);
      }
      /* --- END: LANGUAGE OVERLAY --- */
      /* --- START: LANGUAGE TOGGLE --- */
      .lang-toggle {
          position: absolute;
          bottom: 12px;
          left: 18px;
          font-size: 10px; /* Smaller font size */
          font-weight: 700;
          cursor: pointer;
          user-select: none;
      }
      .lang-option {
          color: #888;
          padding: 2px 4px;
          transition: color 0.2s;
      }
      .lang-option.selected {
          color: #FB4302; /* Babel orange color */
      }
      /* --- END: LANGUAGE TOGGLE --- */

      /* --- START: Feedback Overlay Styles --- */
      .babel-feedback-overlay {
          position: absolute;
          top: 2px;
          left: 0;
          right: 0;
          bottom: 3px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 15px;
          color: #F0F0F0;
          font-size: 13px;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          z-index: 1000;
          pointer-events: none;
          border-radius: 8px; /* Match row radius */
          animation: babel-fade-out 1.5s forwards;
          opacity: 1;
      }
      .babel-overlay-add {
          background-color: rgba(39, 174, 96, 0.9); /* Green */
      }
      .babel-overlay-remove {
          background-color: rgba(192, 57, 43, 0.9); /* Red */
      }
      @keyframes babel-fade-out {
          0%   { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; }
      }
      /* --- END: Feedback Overlay Styles --- */
    `);let x="babel-layout-styles";if(!document.getElementById(x)){let E=`
            /* UNLOCK OVERFLOW on Main Stack (Keep fixed height, allow spillover) */
            [data-testid="RetoolGrid::Main"] > [data-testid="RetoolGrid::Content"] > [data-testid*="::stack1"] {
                overflow: visible !important;
                z-index: 100 !important; /* Ensure spilled content is on top */
            }

            /* Parent Grid Layout */
            .babel-snap-layout {
                display: grid !important;
                grid-template-columns: 25% 1fr !important;
                grid-template-rows: min-content max-content !important;
                gap: 15px !important;
                align-items: start !important;
                overflow: visible !important; /* Critical */
            }

            /* UNLOCK OVERFLOW on Rubric Container */
            [data-testid*="conferenceAuditingV"][data-testid$="::tabbedContainer1"] {
                overflow: visible !important;
                /* Do not touch height here to avoid breaking flex layout */
            }

            /* --- Tabbed Container Header Height (35px) --- */
            [data-testid*="ContainerWidget_conferenceAuditing"][data-testid*="::tabbedContainer1"] > section > header {
                height: 35px !important;
                min-height: 35px !important;
            }

            /* Children Reset & Positioning */
            .babel-snap-layout > [data-testid$="::eloRanking1"],
            .babel-snap-layout > [data-testid$="::text9"],
            .babel-snap-layout > [data-testid*="::gradingRubricV"] {
                position: relative !important;
                top: auto !important;
                left: auto !important;
                width: auto !important;
                height: auto !important;
            }

            /* ELO Slider (Left Column - Spans Full Height) */
            .babel-snap-layout > [data-testid$="::eloRanking1"] {
                grid-column: 1 !important;
                grid-row: 1 !important;
            }

            /* Rubric Table (Right Column - Bottom) */
            .babel-snap-layout > [data-testid*="::gradingRubricV"] {
                grid-column: 2 !important;
                grid-row: 1 !important;
            }

            /* Rubric Internals (Flex Layout) */
            /* Target the 'section' tag. If that changes, target any div containing the rubric table */
            .babel-snap-layout [data-testid*="::gradingRubricV"] section,
            .babel-snap-layout [data-testid*="::gradingRubricV"] > div:has([data-testid*="::table5"]) {
                display: flex !important;
                flex-direction: row !important;
                gap: 0px !important;
            }

            /* Rubric Body (The Main Table) */
            /* Target the direct child that CONTAINS the table5 (Rubric) */
            .babel-snap-layout [data-testid*="::gradingRubricV"] section > :has([data-testid*="::table5"]),
            .babel-snap-layout [data-testid*="::gradingRubricV"] > div > :has([data-testid*="::table5"]) {
                flex: 1 1 auto !important;
                width: 0 !important;
            }

            /* Force Table 5 to Expand */
            .babel-snap-layout [data-testid*="::gradingRubricV"] [data-testid*="::table5"] {
                position: relative !important;
                top: auto !important;
                /* Override Retool's fixed pixel height */
                height: auto !important;
                min-height: auto !important;
                overflow: visible !important;
            }

            /* Fixed height for timestamp table */
            /* Targets table7 */
            .babel-snap-layout [data-testid*="::gradingRubricV"] [data-testid*="::table7"] {
                height: 283px !important;
                min-height: 283px !important;
                width: 100% !important;
            }

            /* Timestamp Container (Footer) */
            /* Target the footer tag OR the child containing table7 (Timestamps) */
            .babel-snap-layout [data-testid*="::gradingRubricV"] footer,
            .babel-snap-layout [data-testid*="::gradingRubricV"] section > :has([data-testid*="::table7"]) {
                /* Set preferred width */
                flex: 0 0 30% !important;
            }

            /* Timestamp Container (Footer) Internal Padding */
            .babel-snap-layout [data-testid*="::gradingRubricV"] footer [data-testid="RetoolGrid::Main"],
            .babel-snap-layout [data-testid*="::gradingRubricV"] section > :has([data-testid*="::table7"]) [data-testid="RetoolGrid::Main"] {
                padding: 0px !important;
                --retool-padding: 0px !important;
            }
        `,C=document.createElement("style");C.id=x,C.textContent=E,document.head.appendChild(C)}function R(){let e=document.querySelector(b.ratingSectionParent);if(!e)return;let t=e.querySelector('[data-grid-id$="__body"]');t&&!t.classList.contains("babel-snap-layout")&&t.classList.add("babel-snap-layout")}function A(){if(p)return;p=!0,R();let e=document.querySelector(b.ratingSectionParent);e&&(c=new MutationObserver(()=>{p&&R()})).observe(e,{childList:!0,subtree:!0})}function L(){p=!1,c&&(c.disconnect(),c=null);let e=document.querySelector(b.ratingSectionParent);if(!e)return;let t=e.querySelector('[data-grid-id$="__body"]');t&&t.classList.remove("babel-snap-layout")}async function I(){let e=document.querySelector(b.reviewerToggle);if(!e)return console.error("❌ [FlashPeek] Critical: Toggle Button not found."),"unknown";function t(e){let t=Object.keys(e).find(e=>e.startsWith("__reactFiber"));if(!t)return null;let a=e[t];for(let n=0;n<10&&a;n++){let i=a.memoizedProps;if(i&&"boolean"==typeof i.value)return i.value;a=a.return}return null}async function a(a){if(t(e)!==a){document.body.classList.add("babel-no-hover");try{document.activeElement&&"function"==typeof document.activeElement.blur&&document.activeElement.blur();for(let n=1;n<=3;n++){e.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0})),e.click();for(let i=0;i<25;i++){if(t(e)===a)return;await new Promise(e=>setTimeout(e,20))}console.warn(`⚠️ [FlashPeek] Click attempt ${n} failed.`)}}finally{document.body.classList.remove("babel-no-hover")}}}function n(e){if(!e)return null;let t=0,a=e=>{if(!e)return null;let t=e;for(let a=0;a<20&&t;a++){let n=t.memoizedProps;if(n){let i=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;if("string"==typeof n.value&&i.test(n.value))return{status:"human",email:n.value};if(n.selectedItem&&"object"==typeof n.selectedItem){let r=Object.values(n.selectedItem),o=r.find(e=>"string"==typeof e&&e.includes("@"));if(o)return{status:"human",email:o}}if(Array.isArray(n.data)){if(n.data.length>0){let l=n.data[0],s=Object.values(l).find(e=>"string"==typeof e&&e.includes("@"));if(s)return{status:"human",email:s}}else{if(!0===n.isFetching||!0===n.isLoading)return null;return{status:"empty"}}}}t=t.return}return null},n=Object.keys(e).find(e=>e.startsWith("__reactFiber"));if(n){let i=a(e[n]);if(i)return i}let r=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT),o;for(;(o=r.nextNode())&&!(++t>1e3);){let l=Object.keys(o).find(e=>e.startsWith("__reactFiber"));if(l){let s=a(o[l]);if(s)return s}}return null}await a(!0);let i="ai";try{let r=Date.now();for(;Date.now()-r<3e3;){let o=document.querySelector(b.reviewerSelect);if(o){let l=n(o);if(l){if("human"===l.status){i="human";break}if("empty"===l.status&&Date.now()-r>20){i="ai";break}}if(o.textContent.includes("@")){i="human";break}}await new Promise(e=>setTimeout(e,20))}}finally{await a(!1)}return"function"==typeof e.blur&&e.blur(),i}function T(e,t,a){let n=e===window,i=n?window.scrollY:e.scrollTop,r=t-i,o=0,l=e=>e<.5?2*e*e:-1+(4-2*e)*e,s=t=>{0===o&&(o=t);let d=t-o,c=l(Math.min(d/a,1)),p=i+r*c;n?window.scrollTo(0,p):e.scrollTop=p,d<a&&requestAnimationFrame(s)};requestAnimationFrame(s)}function B(e){if(!e)return null;let t=e.toLowerCase();for(let a of f.CATEGORY_DEFINITIONS)if(a.matcher(t))return{key:a.key,offset:a.offset};return null}function O(e){let t={isReady:!1,speakerCount:0,sortMode:"UNKNOWN"};if(e.length<5)return t;let a={bgv:0,bgn:0,net:0,echo:0,ac:0},n=[];for(let i of e){let r=i.querySelector(b.categoryColumn);if(!r)continue;let o=r.textContent,l=B(o);l&&(a[l.key]++,n.length<2&&n.push(l.key))}let s=Object.values(a),d=s[0],c=s.every(e=>e===d&&e>0);return c&&(t.isReady=!0,t.speakerCount=d,n.length>=2&&(t.sortMode=n[0]===n[1]?"CATEGORY":"SPEAKER")),t}function P(){return f.IS_MAC?g.modifierState.MetaLeft||g.modifierState.MetaRight:g.modifierState.ControlLeft||g.modifierState.ControlRight}function M(e){let t=g.modifierState.AltLeft||g.modifierState.AltRight;if(t)switch(e){case"Digit1":return"AltDigit1";case"Digit2":return"AltDigit2";case"KeyQ":return"AltQ";case"KeyW":return"AltW";case"KeyA":return"AltA"}return e}async function N(e){let t=g.tableContainer;t&&t.classList.add("babel-no-hover");let a=u.rating[e],n=g.activeTimestampKey;if(void 0!==u.timestamp[n]){let i=u.timestamp[n],r=g.standardizedRows[i];r&&await U(r,a)}g.timestampKeyUsedInCombo=!0}async function q(e){let t=u.feedback[e],a=function e(){let t=f.IS_MAC?g.modifierState.MetaLeft:g.modifierState.ControlLeft,a=f.IS_MAC?g.modifierState.MetaRight:g.modifierState.ControlRight;return a?"sixth":g.modifierState.AltRight?"fifth":t&&g.modifierState.AltLeft?"fourth":t?"third":g.modifierState.AltLeft?"right":"left"}(),n=f.CATEGORY_ROW_INDICES[t][a],i=g.standardizedRows[n],r=f.FEEDBACK_LABELS[e];i&&await Z(i,h[e],t,"toggle",r)}async function D(){let e=P();if(e&&g.settings.saveReview){if(g.isWaitingForSave)return;let t=document.querySelector(b.submitOverallButton);t?_(t):console.warn("Babel Helper: Could not find the new Submit button. Check selector."),await $(200),ev()}}function z(e,t){if(g.settings.timestamps&&e===g.activeTimestampKey){if(g.timestampKeyUsedInCombo)g.timestampKeyUsedInCombo=!1;else{let a=u.timestamp[e],n=g.standardizedRows[a];n&&(g.pendingTimestampIndex=a,g.iframeElement?.contentWindow.postMessage("get_current_time","*"),n.dispatchEvent(new MouseEvent("mouseover",{bubbles:!0,cancelable:!0})),X(n,a))}g.activeTimestampKey=null}else g.settings.timestamps&&g.activeTimestampKey&&g.activeTimestampKey.endsWith(t||e)&&(g.activeTimestampKey=null,g.timestampKeyUsedInCombo=!1)}function K(){let e=document.querySelector(b.overallRatingContainerParent);if(!e)return null;let t=e.querySelector("input");if(!t)return null;let a=S(t);for(let n=0;n<15&&a;n++){let i=a.memoizedProps;if(i&&"SliderWidget2"===i.pluginType&&"number"==typeof i.value&&"function"==typeof i.onChange)return i;a=a.return}return null}function F(e,t){return new Promise((a,n)=>{let i=e.querySelector(b.rating.cell);if(!i)return n(Error("Could not find rating cell for row."));let r=`${b.rating.starStep}[data-testid$='-${t}']`,o=i.querySelector(r);if(o)return a(o);e.dispatchEvent(new MouseEvent("mouseenter",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new MouseEvent("mouseover",{bubbles:!0,cancelable:!0}));let l=new MutationObserver((e,t)=>{let n=i.querySelector(r);n&&(t.disconnect(),a(n))});l.observe(i,{childList:!0,subtree:!0}),setTimeout(()=>{l.disconnect(),n(Error(`Timed out waiting for star ${t} on row.`))},2e3)})}async function W(e){if(!g.ratingRows[g.ratingIndex])return;let t=g.ratingRows[g.ratingIndex],a=g.ratingIndex;try{let n=await F(t,e);n.click();let i=new CustomEvent("babel-rating-applied",{detail:{row:t,rating:e}});document.dispatchEvent(i),document.activeElement&&document.activeElement.blur(),window.getSelection().removeAllRanges(),g.ratingIndex=(a+1)%g.ratingRows.length}catch(r){console.error("Rating Tool Error:",r),g.ratingQueue.length=0}}async function U(e,t){if(!e.isConnected){console.warn("Babel: Detected stale row reference. Refreshing targets..."),eA();return}if(e&&!g.isRatingBusy){g.isRatingBusy=!0;try{let a=await F(e,t);a.click();let n=new CustomEvent("babel-rating-applied",{detail:{row:e,rating:t}});document.dispatchEvent(n),document.activeElement&&document.activeElement.blur(),window.getSelection().removeAllRanges(),e.dispatchEvent(new MouseEvent("mouseout",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new MouseEvent("mouseleave",{bubbles:!0,cancelable:!0}))}catch(i){console.error("Babel Combo-Rating Error:",i)}finally{if(g.isRatingBusy=!1,0===g.ratingQueue.length){let r=g.tableContainer;r&&r.classList.remove("babel-no-hover")}}}}async function H(){if(g.isRatingBusy||window.isBabelFeedbackPasting&&window.isBabelFeedbackPasting())return;for(g.isRatingBusy=!0;g.ratingQueue.length>0;){let e=g.ratingQueue.shift();try{await W(e)}catch(t){console.error("Rating Error:",t)}await k()}g.isRatingBusy=!1;let a=g.tableContainer;a&&a.classList.remove("babel-no-hover")}let G={active:!1,snapshotA:null,pendingIntents:[],lastActionTime:0};function V(e){e.disabled=!1,e.classList.remove("syncing-animation")}function Y(){let e=document.querySelector(b.timestampGridScrollable+' [role="row"]');if(e){let t=S(e),a=null,n=null,i=null;for(let r=0;r<50&&t;r++){let o=t.memoizedProps;if(o&&(Array.isArray(o.rowBackgroundColor)&&o.rowBackgroundColor.length>0&&(i=o.rowBackgroundColor),Array.isArray(o.children)&&o.children.forEach(e=>{let t=e?.props?.column;t&&(("flag"===t.key||"a34d1"===t.id)&&Array.isArray(t.valueOverride)&&(a=t.valueOverride),("time"===t.key||"5d85e"===t.id)&&Array.isArray(t.valueOverride)&&(n=t.valueOverride))})),a&&n&&i)break;t=t.return}if(a&&n&&i)return{flags:a,times:n,colors:i}}let l=document.querySelector(b.timestampGridScrollable);return l?{flags:[],times:[],colors:[]}:null}function j(){let e=Y(),t=new Map;if(!e)return t;let a=Math.min(e.flags.length,e.times.length,e.colors.length);for(let n=0;n<a;n++){let i=e.flags[n],r=e.times[n],o=e.colors[n];if(!i||!r)continue;let l=f.SPEAKER_COLOR_MAP[o];void 0===l&&(l=0);let s=B(i),d=s?s.key:"bgv",c=`${l}|${d}|${r}`;t.set(c,(t.get(c)||0)+1)}return t}function Q(e,t,a){let n=g.timestampList.findLastIndex(n=>n.speakerIndex===e&&n.categoryKey===t&&n.time===a);-1===n&&(n=g.timestampList.findLastIndex(a=>a.speakerIndex===e&&a.categoryKey===t)),-1!==n&&g.timestampList.splice(n,1)}async function X(e){if(!e)return;let t=e.querySelector(b.timestampButton);if(t){t.click();return}let a=e.children,n=a[a.length-1],i=!1;if(n){let r=S(n);for(let o=0;o<15&&r;o++){let l=r.memoizedProps;if(l&&"function"==typeof l.onOpen){try{l.onOpen(),i=!0}catch(s){console.error("Babel: React trigger failed.",s)}break}r=r.return}}if(i)for(let d=0;d<20;d++){if(t=e.querySelector(b.timestampButton)){t.click(),document.activeElement&&document.activeElement.blur(),window.getSelection().removeAllRanges();return}await new Promise(e=>setTimeout(e,10))}let c=new MutationObserver((a,n)=>{(t=e.querySelector(b.timestampButton))&&(n.disconnect(),t.click(),document.activeElement&&document.activeElement.blur())});c.observe(e,{childList:!0,subtree:!0}),i||e.dispatchEvent(new MouseEvent("mousemove",{bubbles:!0})),setTimeout(()=>c.disconnect(),1e3)}async function Z(e,t,a,n="toggle",i=null){if(g.isPasting){g.actionQueue.push({row:e,textToPaste:t,category:a,mode:n,feedbackLabel:i});return}g.isPasting=!0,await J(e,t,a,n,i)}async function J(e,t,a,n="toggle",i=null){if(!e)return;let r=document.querySelector(b.tableContainer),o=r?r.querySelector('[data-testid="TableWrapper::ScrollableContainer"]'):null,l=0;o&&(l=o.scrollLeft);try{let s=e.querySelector(b.feedback.cell),d=s?.querySelector(b.feedback.clickableContainer);if(!d)return;d.click(),o&&(o.scrollLeft=l),await k(),o&&(o.scrollLeft=l);let c=document.activeElement;if(!c||c===document.body)return;let p="echo"===a||"background_voice"===a,u=c.value||"",f;if(f="set"===n?t:p?u.trim()===t.trim()?"":t:u.includes(t)?u.replace(t,""):u+t,i&&"toggle"===n){let m,y;p?u.trim()===t.trim()?(m=`${i} FB removed`,y="remove"):(m=`${i} FB added`,y="add"):u.includes(t)?(m=`${i} FB removed`,y="remove"):(m=`${i} FB added`,y="add"),function e(t,a,n){if(!t)return;t.style.position="relative";let i=document.createElement("div");i.className=`babel-feedback-overlay babel-overlay-${n}`,i.textContent=a,t.appendChild(i),setTimeout(()=>{i.remove(),t.style.position=""},1500)}(e,m,y)}if(void 0!==c.value){let h=Object.getPrototypeOf(c),v=Object.getOwnPropertyDescriptor(h,"value").set;v.call(c,f),c.dispatchEvent(new Event("input",{bubbles:!0})),c.dispatchEvent(new Event("change",{bubbles:!0}))}else c.isContentEditable&&(c.textContent=f);if(c.blur){c.blur(),await $(5);let S=document.querySelector("h1")||document.body;S.setAttribute("tabindex","-1"),S.focus(),await k(),S.removeAttribute("tabindex")}}catch(_){console.error("Error during universal paste:",_)}finally{if(g.isPasting=!1,o&&(o.scrollLeft=l),g.actionQueue.length>0){let w=g.actionQueue.shift();await Z(w.row,w.textToPaste,w.category,w.mode,w.feedbackLabel)}}}async function ee(e){if(!g.settings.feedback||!g.isInitialized)return;let{row:t,rating:a}=e.detail,n=t.querySelector(b.categoryColumn);if(!n)return;let i=n.textContent.toLowerCase(),r=null;if(i.includes("echo")?r="echo":i.includes("background")&&i.includes("voice")?r="background_voice":i.includes("network")&&i.includes("connection")&&(r="network_connection"),!r)return;let o={};Object.keys(u.feedback).forEach(e=>{let t=u.feedback[e];"Echo"===t&&(o.echo=e),"Voice"===t&&(o.background_voice=e),"Network"===t&&(o.network_connection=e)});let l=o[r];a<3&&l?await Z(t,h[l],r,"set"):3===a&&await Z(t,"",r,"set")}async function et(){if(!g.isInitialized){console.warn("Cannot fill ratings, rows not ready.");return}let e=null;function t(t){if(e||(e=Object.keys(t||{}).find(e=>e.startsWith("__reactFiber"))),!e)return null;let a=t[e];for(let n=0;n<6&&a;n++){let i=a.memoizedProps;if(i&&(void 0!==i.isEditable||void 0!==i.rawValue))return i;a=a.return}return null}if(g.isRatingBusy)return;g.isRatingBusy=!0;let a=g.tableContainer;a&&a.classList.add("babel-no-hover");let n=null;try{document.activeElement&&"function"==typeof document.activeElement.blur&&document.activeElement.blur();let i=K();if(i){let r=i.max||5;i.onChange(r),g.eloOptimistic=r}for(let o of g.ratingRows){let l=o.querySelector(b.rating.cell);if(!l)continue;let s=t(l);if(s&&(!1===s.isEditable||"false"===s.isEditable||3===s.rawValue))continue;l.dispatchEvent(new MouseEvent("mouseover",{bubbles:!0})),n=l;let d=`${b.rating.starStep}[data-testid$='-3']`,c=null;for(let p=0;p<15&&!(c=l.querySelector(d));p++)await new Promise(e=>setTimeout(e,0));if(!c){let u=l.querySelectorAll(b.rating.starStep);u.length>=3&&(c=u[2])}if(c){c.dispatchEvent(new MouseEvent("click",{bubbles:!0}));for(let f=0;f<30&&t(l)?.rawValue!==3;f++)5===f&&c.dispatchEvent(new MouseEvent("click",{bubbles:!0})),await new Promise(e=>setTimeout(e,0))}}}finally{n&&n.dispatchEvent(new MouseEvent("mouseout",{bubbles:!0})),document.activeElement&&document.activeElement.blur&&document.activeElement.blur(),g.isRatingBusy=!1,a&&a.classList.remove("babel-no-hover")}}function ea(e){if(g.isPasting)return;let t=e.target.closest(b.rating.starStep);t&&setTimeout(()=>{let e=t.getAttribute("data-testid");if(!e)return;let a=e.split("-").pop(),n=parseInt(a,10);if(!isNaN(n)){let i=t.closest(b.row);if(!i)return;let r=new CustomEvent("babel-rating-applied",{detail:{row:i,rating:n}});document.dispatchEvent(r)}},10)}function en(){let e=document.querySelector(b.claimContainerParent),t=document.querySelector(b.tableContainer),a=document.querySelector("main");if(!a){console.error("Babel Scroll Error: The main scroll container (<main>) was not found.");return}if(!e){console.error("Babel Scroll Error: The Claim Container was not found.");return}if(!t){console.error("Babel Scroll Error: The Rubric container was not found.");return}let n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),r=Math.min(n.top,i.top),o=Math.max(n.bottom,i.bottom),l=a.scrollTop,s=l+(r+(o-r)/2)-window.innerHeight/2;T(a,s,f.SCROLL_DURATION_MS)}function ei(e,t,a="red"){let n=document.createElement("div");n.className=`gm-elegant-warning warning-${a}`,n.textContent=e,document.body.appendChild(n),setTimeout(()=>{n.remove()},t)}function er(){if(!g.isClaimConfirmed||!g.areRowsReady||g.hasInitialAudioCheckStarted)return;g.hasInitialAudioCheckStarted=!0;let e=g.iframeElement;e&&e.contentWindow?e.contentWindow.postMessage("wait_for_audio_and_report_back","*"):console.error("Babel: Could not find iframe to start audio check.")}function eo(){g.claimObserver&&g.claimObserver.disconnect();let e=e=>{let t=0,a=()=>{let a=e.querySelectorAll(b.statusText);if(0===a.length)return!1;let n=null;for(let i of a)if(i.offsetHeight>0||i.offsetWidth>0){n=i;break}if(!n)return!1;let r=n.textContent.trim(),o=r===f.REQUIRED_CLAIM_TEXT||"Claimed by NaN"===r||r.startsWith("Claimed by ");return(!o||1!=++t)&&(t>=2&&r!==f.REQUIRED_CLAIM_TEXT?(g.settings.audioSafety&&ei("Audio Already Claimed",2e3),!0):r===f.REQUIRED_CLAIM_TEXT&&t>=2&&(g.isClaimConfirmed=!0,er(),!0))};if(a())return;g.claimObserver=new MutationObserver(()=>{a()&&g.claimObserver.disconnect()}),g.claimObserver.observe(e,{childList:!0,subtree:!0,characterData:!0});let n=setTimeout(()=>{g.claimObserver&&"function"==typeof g.claimObserver.disconnect&&g.claimObserver.disconnect()},f.OBSERVER_TIMEOUT_MS),i=g.claimObserver.disconnect;g.claimObserver.disconnect=function(){i.apply(this,arguments),clearTimeout(n)}},t=document.querySelector(b.claimSelector);if(t)e(t);else{console.warn("Parent Debug: Claim status box not found. Waiting for it to appear...");let a=new MutationObserver((t,a)=>{let n=document.querySelector(b.claimSelector);n&&(a.disconnect(),e(n))});a.observe(document.body,{childList:!0,subtree:!0}),setTimeout(()=>a.disconnect(),1e4)}}function el(){localStorage.setItem("babelMaster_settings",JSON.stringify(g.settings)),sessionStorage.setItem("babelBrh_totalMinutes",g.totalMinutes),sessionStorage.setItem("babelBrh_totalBrh",g.totalBrh),sessionStorage.setItem("babelBrh_processedIds",JSON.stringify(Array.from(g.processedIds))),sessionStorage.setItem("babelBrh_conferenceCount",g.conferenceCount)}function es(){let e=document.getElementById("babel-analytics-tab");e&&(g.currentConferenceId?(e.textContent="Current Call",e.classList.remove("disabled")):(e.textContent="No Current Call",e.classList.add("disabled")))}function ed(){let e=document.querySelector("#babel-rubric-panel"),t=document.querySelector("#babel-analytics-panel");if(!e||!t||"none"===t.style.display)return;let a=e.querySelector(".rubric-table tbody"),n=t.querySelector(".rubric-table tbody");if(a&&n){let i=a.querySelectorAll("tr"),r=n.querySelectorAll("tr");if(i.length===r.length){let o=[];for(let l=0;l<i.length;l++)o.push(i[l].offsetHeight);for(let s=0;s<i.length;s++){let d=r[s].querySelectorAll("td"),c=`${o[s]}px`;d.forEach(e=>{e.style.height=c})}}}}function ec(){let e=g.speakerCount,t=Array(e).fill(0).map(()=>({bgv:0,bgn:0,net:0,echo:0,ac:0}));for(let a of g.timestampList)t[a.speakerIndex]&&void 0!==t[a.speakerIndex][a.categoryKey]&&t[a.speakerIndex][a.categoryKey]++;[{key:"bgv",thresholds:{good:0,ok:2}},{key:"bgn",thresholds:{good:4,ok:17}},{key:"net",thresholds:{good:1,ok:2}},{key:"echo",thresholds:{good:0,ok:2}},{key:"ac",thresholds:{good:0,ok:4}}].forEach(e=>{for(let a=0;a<6;a++){let n=t[a]?t[a][e.key]:0,i=document.getElementById(`babel-count-${e.key}-${a}`);if(i){i.textContent=n||"0";let r=i.parentElement;r.className="",n<=e.thresholds.good?r.classList.add("rubric-good"):n<=e.thresholds.ok?r.classList.add("rubric-ok"):r.classList.add("rubric-bad")}}});let n=document.querySelector("#babel-analytics-panel .rubric-table");n&&(n.className=`rubric-table speakers-${e}`)}function ep(){let e=g.totalBrh.toFixed(3),t=g.conferenceCount,a=`
            <div id="brh-expanded-content" style="padding: 10px 18px 0 18px;">
                <div class="brh-header-content">
                    <span class="brh-caret brh-caret-left"></span>
                    <span class="brh-spacer"></span>
                    <span class="brh-text">${t} | ${e}</span>
                    <span class="brh-spacer"></span>
                </div>
                <hr id="babel-settings-divider" style="margin-top: 8px;">
                <div id="babel-settings-menu"></div>
            </div>`,n=`
            <div id="brh-collapsed-content">
                 <div class="brh-header-content">
                     <span class="brh-caret brh-caret-left"></span>
                     <span class="brh-spacer"></span>
                     <span class="brh-text">${t} | ${e}</span>
                     <span class="brh-spacer"></span>
                 </div>
            </div>`;s&&(s.innerHTML=a+n,ey())}function eu(){let e=document.createElement("div");e.className="babel-lang-overlay",e.innerHTML=`
            <div class="babel-lang-box">
                <p>Select Your Keyboard Layout:</p>
                <button class="babel-lang-btn" data-lang="en-us">ENG (US)</button>
                <button class="babel-lang-btn" data-lang="es">ESP (LAT)</button>
            </div>
        `,e.querySelectorAll(".babel-lang-btn").forEach(t=>{t.addEventListener("click",()=>{let a=t.dataset.lang;event.stopPropagation(),localStorage.setItem("babel_user_layout",a),em(),e.remove()})});let t=document.getElementById("babel-settings-menu");t&&(t.style.position="relative",t.appendChild(e))}let eb={zoomAndNavigation:'<b>Enable Zoom Hotkeys:</b><br><span class="tooltip-key">-</span> (out), <span class="tooltip-key">=</span> (in).<br>Hold down <span class="tooltip-key">Any Zoom Key</span>+<span class="tooltip-key">Scroll Wheel</span> for precise zoom.<br><b>Enable Next Conference Hotkey:</b><br><span class="tooltip-key">{{PRIMARY}}+Arrow Down</span>.',panner:'<b>Enable Solo Hotkeys:</b><br><span class="tooltip-key">B</span>, <span class="tooltip-key">N</span>, <span class="tooltip-key">M</span>, <span class="tooltip-key">,</span>, <span class="tooltip-key">.</span>, for speakers 1-5.<br><span class="speaker-6">Speaker 6</span>: <span class="tooltip-key">{{ALT}}</span> + <span class="speaker-1">Speaker 1</span> key.<br><span class="tooltip-key">/</span> to reset volumes.<br><span class="tooltip-key">Double Press</span> to soft Solo'},ef={zoomAndNavigation:'<b>Enable Zoom Hotkeys:</b><br><span class="tooltip-key">\'</span> (out), <span class="tooltip-key">\xbf</span> (in).<br>Hold down <span class="tooltip-key">Any Zoom Key</span>+<span class="tooltip-key">Scroll Wheel</span> for precise zoom.<br><b>Enable Next Conference Hotkey:</b><br><span class="tooltip-key">{{PRIMARY}}+Arrow Down</span>.',panner:'<b>Enable Solo Hotkeys:</b><br><span class="tooltip-key">B</span>, <span class="tooltip-key">N</span>, <span class="tooltip-key">M</span>, <span class="tooltip-key">,</span>, <span class="tooltip-key">.</span>, for speakers 1-5.<br><span class="speaker-6">Speaker 6</span>: <span class="tooltip-key">{{ALT}}</span> + <span class="speaker-1">Speaker 1</span> key.<br><span class="tooltip-key">-</span> to reset volumes.<br><span class="tooltip-key">Double Press</span> to soft Solo'};function em(){let e=localStorage.getItem("babel_user_layout"),t="es"===e,a=t?ef:eb,n=document.querySelector("#toggle-zoomAndNavigation")?.closest(".setting-row").querySelector(".tooltip-text");n&&(n.innerHTML=a.zoomAndNavigation.replace(/{{PRIMARY}}/g,m.PRIMARY).replace(/{{ALT}}/g,m.ALT));let i=document.querySelector("#toggle-panner")?.closest(".setting-row").querySelector(".tooltip-text");i&&(i.innerHTML=a.panner.replace(/{{PRIMARY}}/g,m.PRIMARY).replace(/{{ALT}}/g,m.ALT));let r=document.querySelector('.lang-option[data-lang="en-us"]'),o=document.querySelector('.lang-option[data-lang="es"]');r&&o&&(r.classList.toggle("selected",!t),o.classList.toggle("selected",t))}async function eg(){if(localStorage.getItem("babel_user_layout")){em();return}if(!navigator.keyboard||"function"!=typeof navigator.keyboard.getLayoutMap){eu();return}try{if(!document.hasFocus())return;let e=await navigator.keyboard.getLayoutMap(),t="\xf1"===e.get("Semicolon");localStorage.setItem("babel_user_layout",t?"es":"en-us"),em()}catch(a){console.warn("Babel Helper: Keyboard Layout API failed. Falling back to manual selection.",a),eu()}}async function ey(){let e=document.getElementById("babel-settings-menu");if(!e)return;let t=[{key:"rating",label:"Rating",info:'<b>Enable Rating Hotkeys:</b><br><span class="tooltip-key">Z</span>, <span class="tooltip-key">X</span>, <span class="tooltip-key">C</span> for 1, 2, 3 stars. <br>Combine Timestamp key with Rating key to rate a specific category.<br><span class="tooltip-key">{{PRIMARY}}+Arrow Left/Right</span> to select overall quality rating. <br>Press <span class="tooltip-key">V</span> to set overall quality to 5 and rate all 3 stars.'},{key:"timestamps",label:"Timestamps",info:`<b>Enable Timestamp Hotkeys:</b><br><span class="tooltip-key">1</span>: Background Voice,  <span class="tooltip-key">2</span>: Background Noise,  <span class="tooltip-key">Q</span>: Network, <span class="tooltip-key">W</span>: Echo, <span class="tooltip-key">A</span>: Audio Clarity.<br>Same pattern for speakers 2-5.<br><span class="speaker-6">Speaker 6</span>: <span class="tooltip-key">{{ALT}}</span> + <span class="speaker-1">Speaker 1</span> keys.<br>
         <b><i>Keyboard Layout:</i></b>
         <div class="tooltip-keyboard">
           <div class="keyboard-row">
             <span class="keyboard-key speaker-1"><span class="key-label key-label-top">BGV</span>1</span>
             <span class="keyboard-key speaker-1"><span class="key-label key-label-top">BGN</span>2</span>
             <span class="keyboard-key speaker-2">3</span><span class="keyboard-key speaker-2">4</span>
             <span class="keyboard-key speaker-3">5</span><span class="keyboard-key speaker-3">6</span>
             <span class="keyboard-key speaker-4">7</span><span class="keyboard-key speaker-4">8</span>
             <span class="keyboard-key speaker-5">9</span><span class="keyboard-key speaker-5">0</span>
           </div>
           <div class="keyboard-row">
             <span class="keyboard-key speaker-1">Q<span class="key-label key-label-bottom">Net</span></span>
             <span class="keyboard-key speaker-1">W<span class="key-label key-label-bottom">Echo</span></span>
             <span class="keyboard-key speaker-2">E</span><span class="keyboard-key speaker-2">R</span>
             <span class="keyboard-key speaker-3">T</span><span class="keyboard-key speaker-3">Y</span>
             <span class="keyboard-key speaker-4">U</span><span class="keyboard-key speaker-4">I</span>
             <span class="keyboard-key speaker-5">O</span><span class="keyboard-key speaker-5">P</span>
           </div>
           <div class="keyboard-row">
           <span class="keyboard-key speaker-1">A<span class="key-label key-label-bottom">AC</span></span><span class="keyboard-key speaker-1" style="visibility: hidden;">S</span>
           <span class="keyboard-key speaker-2">D</span><span class="keyboard-key" style="visibility: hidden;">F</span>
           <span class="keyboard-key speaker-3">G</span><span class="keyboard-key" style="visibility: hidden;">H</span>
           <span class="keyboard-key speaker-4">J</span><span class="keyboard-key" style="visibility: hidden;">K</span>
           <span class="keyboard-key speaker-5">L</span><span class="keyboard-key" style="visibility: hidden;">;</span>
           </div>
         </div>`},{key:"feedback",label:'<span>Feedback<span class="feedback-edit-btn" title="Edit Feedback">⚙️</span></span>',info:'<b>Enable Feedback Hotkeys:</b><br><span class="speaker-1">Speaker 1</span>:<span class="tooltip-key">Numpad</span>, <span class="speaker-2">S2</span>:<span class="tooltip-key">{{ALT}} Left+Num</span>, <span class="speaker-3">S3</span>:<span class="tooltip-key">{{PRIMARY}} Left+Num</span>, <span class="speaker-4">S4</span>:<span class="tooltip-key">{{ALT}}+{{PRIMARY}}+Num</span>, <span class="speaker-5">S5</span>:<span class="tooltip-key">{{ALT}} Right+Num</span>, <span class="speaker-6">S6</span>:<span class="tooltip-key">{{PRIMARY}} Right+Num</span><br><b>Numpad:</b><br><span class="tooltip-key">0</span>: Muffled, <span class="tooltip-key">1</span>: Distortion, <span class="tooltip-key">4</span>: Reverb, <span class="tooltip-key">7</span>: Overlap; <span class="tooltip-key">2</span>: Plosives, <span class="tooltip-key">5</span>: Movement, <span class="tooltip-key">8</span>: Outside noise, <span class="tooltip-key">/</span>: breathing, mouth or vocal noises; <span class="tooltip-key">6</span>: Echo; <span class="tooltip-key">*</span>: Background Voice. <br>Auto-feedback for Background Voice and Echo.'},{key:"saveReview",label:"Save Review",info:'<b>Enable Save Hotkey:</b><br><span class="tooltip-key">{{PRIMARY}}+Enter</span> to submit overall quality and save ratings.'},{key:"cursorLine",label:"Cursor Line",info:"Shows a vertical line following the cursor inside the waveform."},{key:"panner",label:"Panner Keys",info:eb.panner},{key:"zoomAndNavigation",label:"Zoom & Nav Keys",info:eb.zoomAndNavigation},{key:"audioSafety",label:"Audio Safety",info:"Auto-reset and play to avoid false audio loading.<br>Alerts for already reviewed/claimed conferences.<br>Centers the waveform automatically if audio is unreviewed."},{key:"enhancedReset",label:"Enhanced Reset",info:'<b>Enable Reset Hotkey:</b><br><span class="tooltip-key">{{PRIMARY}}+Click</span> on reset button to jump to topic, scroll to playhead and play.'},{key:"uiEnhancements",label:"UI Enhancements",info:"<b>Enable Ui Enhancements:</b><br>Enable/Disable useless Ui elements.<br>Resize rubric table with draggable handle between spectrogram | table.<br><b><i>YOU MUST REFRESH FOR CHANGES TO TAKE EFFECT.</i></b>"},],a="";t.forEach(e=>{let t=e.info.replace(/{{PRIMARY}}/g,m.PRIMARY).replace(/{{ALT}}/g,m.ALT);a+=`
                <div class="setting-row">
                    <div class="setting-label">
                        <span>${e.label}</span>
                        <div class="setting-info">
                            ?
                            <span class="tooltip-text">${t}</span>
                        </div>
                    </div>
                    <label class="setting-toggle">
                        <input type="checkbox" id="toggle-${e.key}" data-key="${e.key}" ${g.settings[e.key]?"checked":""}>
                        <span class="slider"></span>
                    </label>
                </div>
            `}),e.innerHTML=a;let n=`
            <div class="lang-toggle">
                <span class="lang-option" data-lang="en-us">EN</span> |
                <span class="lang-option" data-lang="es">ESP</span>
                <span class="lang-tooltip-text">Select Your Keyboard Layout</span>
            </div>
        `;e.insertAdjacentHTML("beforeend",n);let i=document.querySelector(".lang-toggle");i&&i.addEventListener("click",e=>{e.stopPropagation();let t=localStorage.getItem("babel_user_layout");localStorage.setItem("babel_user_layout","es"===t?"en-us":"es"),em()}),em(),t.forEach(e=>{let t=document.getElementById(`toggle-${e.key}`);t&&t.addEventListener("change",e=>{let t=e.target.dataset.key;g.settings[t]=e.target.checked,el(),["cursorLine","enhancedReset","panner","zoomAndNavigation"].includes(t)&&e$()})})}function eh(){let e=document.getElementById("feedback-editor-modal"),t=document.querySelector(".modal-overlay");e&&e.remove(),t&&t.remove()}function e$(){g.iframeElement&&g.iframeElement.contentWindow&&g.iframeElement.contentWindow.postMessage({type:"babel_settings",settings:g.settings},"*")}function ev(){if(g.isWaitingForSave)return;let e=0;for(let t of g.ratingRows)t&&t.querySelector(b.rating.cell+" "+b.feedback.filledStar)&&e++;g.lastRatedCount=e,g.isWaitingForSave=!0;let a=document.querySelector(b.saveButtonSelector),n=g.currentConferenceId;if(!a||!n){console.error("Babel Counter: Could not find Save Button or Conference ID. Check selectors."),g.isWaitingForSave=!1;return}let i=g.processedIds.includes(n);_(a);let r=new MutationObserver((e,t)=>{document.querySelector(b.saveButtonSelector)||(t.disconnect(),i?(console.warn(`Babel Counter: Duplicate ID "${n}". Not counting points.`),g.isWaitingForSave=!1):(g.pendingConferenceId=n,g.conferenceCount++,g.iframeElement&&g.iframeElement.contentWindow?(g.iframeElement.contentWindow.postMessage("get_work_duration","*"),setTimeout(()=>{g.isWaitingForSave&&g.pendingConferenceId===n&&(console.warn(`Babel Save: Iframe response timeout for ${n}. Releasing save lock.`),g.isWaitingForSave=!1,g.pendingConferenceId=null)},1e4)):(console.error("Babel Counter: No iframe found. Cannot get duration."),g.isWaitingForSave=!1)),setTimeout(()=>{let e=document.querySelector("main");e?T(e,0,f.SCROLL_DURATION_MS):T(window,0,f.SCROLL_DURATION_MS)},100))});r.observe(document.body,{childList:!0,subtree:!0}),function e(t,a){let n,i,r=4e4,o=()=>{n&&(window.clearTimeout(n),n=null,r-=Date.now()-i)},l=()=>{n||(i=Date.now(),n=window.setTimeout(()=>{t(),document.removeEventListener("visibilitychange",s)},r))},s=()=>{document.hidden?(console.log(`[${new Date().toLocaleTimeString()}] ⏸️ Tab hidden, pausing timeout.`),o()):(console.log(`[${new Date().toLocaleTimeString()}] ▶️ Tab visible, resuming timeout.`),l())};return document.addEventListener("visibilitychange",s),l(),()=>{window.clearTimeout(n),document.removeEventListener("visibilitychange",s)}}(()=>{if(g.isWaitingForSave){let e=document.querySelector(b.saveButtonSelector);e&&(console.warn("[DIAGNOSTIC] Observer timed out after 40 visible seconds. Releasing lock."),r.disconnect(),g.isWaitingForSave=!1)}},4e4)}function ek(e){let t=e.target.closest(b.overallRatingContainerParent);t&&setTimeout(()=>{let e=K();e&&"number"==typeof e.value&&(g.eloOptimistic=e.value)},50);let a=e.target.closest("#babel-sync-timestamps-btn");if(a){e.preventDefault(),function e(t=null){t&&(t.disabled=!0,t.classList.add("syncing-animation"));let a=Y();if(!a){t&&V(t);return}let{flags:n,times:i,colors:r}=a,o=[],l=Math.min(n.length,i.length,r.length);for(let s=0;s<l;s++){let d=n[s],c=i[s],p=r[s];if(!d||!c)continue;let u=f.SPEAKER_COLOR_MAP[p];void 0===u&&(u=0);let b=B(d),m=b?b.key:"bgv";o.push({speakerIndex:u,categoryKey:m,time:c})}g.timestampList=o,ec(),console.log(`✅ Sync Complete. Loaded ${o.length} items.`),t&&V(t)}(a);return}let n=e.target.closest(b.timestampDeleteButton);if(n){!function e(t){let a=t.target.closest(b.row);if(!a)return;let n=a.getAttribute("data-item-index");if(null===n)return;let i=parseInt(n,10),r=Y();if(!r)return;let o=r.colors[i],l=r.flags[i],s=r.times[i];if(!o||!l)return;let d=f.SPEAKER_COLOR_MAP[o];void 0===d&&(d=0);let c=B(l),p=c?c.key:"bgv";G.lastActionTime=Date.now(),G.active||(G.active=!0,G.snapshotA=j(),G.pendingIntents=[],function e(){let t="",a=0,n=setInterval(()=>{if(Date.now()-G.lastActionTime<150){a=0;return}let e=Y();if(!e)return;let i=JSON.stringify(e);i===t?a++:(a=0,t=i),a>=3&&(clearInterval(n),function e(){let t=G.snapshotA,a=j(),n=G.pendingIntents;if(!t||!a){G.active=!1;return}n.forEach(e=>{Q(e.speaker,e.cat,e.time);let a=`${e.speaker}|${e.cat}|${e.time}`,n=t.get(a)||0;n>0&&t.set(a,n-1)}),t.forEach((e,t)=>{let n=a.get(t)||0,i=e-n;if(i>0){let[r,o,l]=t.split("|"),s=parseInt(r,10);for(let d=0;d<i;d++)Q(s,o,l)}}),ec(),G.active=!1,G.snapshotA=null,G.pendingIntents=[]}())},50)}()),G.pendingIntents.push({speaker:d,cat:p,time:s})}(e);return}let i=e.target.closest(b.saveButtonSelector);if(i){setTimeout(ev,50);return}let r=e.target.closest(b.timestampButton);if(r){let o=e.target.closest(b.row);if(!o)return;let l=g.standardizedRows.findIndex(e=>e===o);-1!==l&&(g.pendingTimestampIndex=l,g.iframeElement?.contentWindow.postMessage("get_current_time","*"));return}let s=e.target.closest(b.hideSidebarButton);s&&(console.log("\uD83D\uDD04 'Hide Sidebar' clicked. Re-running row discovery..."),eL());let d=e.target.closest(b.rubricTab);d&&(console.log("\uD83D\uDD04 'Rubric' tab clicked. Re-running row discovery..."),eL());let c=e.target.closest(b.sortCategoryHeader);c&&(console.log("\uD83D\uDD04 Column header clicked. Re-running row discovery after a short delay."),g.ratingIndex=0,eL())}function eS(e,t){if(t&&("ArrowLeft"===e||"ArrowRight"===e)){let a=K();if(!a)return!0;null===g.eloOptimistic&&(g.eloOptimistic=void 0!==a.value?a.value:0);let n=a.step||1,i=a.min||1,r=a.max||5,o=g.eloOptimistic;return"ArrowLeft"===e?o-=n:o+=n,(o=Math.max(i,Math.min(r,o)))!==g.eloOptimistic&&(a.onChange(o),g.eloOptimistic=o),!0}return!1}function e_(e){(e.code in g.modifierState||"Minus"===e.code||"Equal"===e.code)&&(g.modifierState[e.code]=!0);let t=e.target,a=t&&t.getAttribute("role"),n=e.code,i=M(n),r=P(),o=!1,l=!1;if("INPUT"===t.tagName)["range","checkbox","radio","button","submit","reset","color","file","image"].includes(t.type)?l=!0:o=!0;else if("TEXTAREA"===t.tagName||t.isContentEditable)o=!0;else if("searchbox"===a||"combobox"===a||"textbox"===a){let s=t.querySelector('input[type="range"], input[type="checkbox"], input[type="radio"]');s?l=!0:o=!0}if(o)return;if(eS(n,r)){e.preventDefault(),e.stopImmediatePropagation();return}if(l){let d=P();if(d&&("ArrowLeft"===n||"ArrowRight"===n))return;let c=u.forward.includes(n),p=u.rating[i]||"KeyV"===n||void 0!==u.timestamp[i]||u.feedback[i]||"Enter"===n||"NumpadEnter"===n||"Tab"===n||"ArrowDown"===i&&d||c;if(!p)return;if(e.preventDefault(),e.stopImmediatePropagation(),t.blur(),c){g.iframeElement?.contentWindow.postMessage({type:"parent_keydown",key:e.key,code:e.code,ctrlKey:e.ctrlKey,metaKey:e.metaKey,shiftKey:e.shiftKey,altKey:e.altKey},"*");return}}if(document.activeElement===g.iframeElement)return;if(!g.isInitialized){if(e.ctrlKey||e.altKey||e.metaKey)return;let b=u.rating[n]||"KeyV"===n||u.timestamp[n]||u.feedback[n];b?(e.preventDefault(),e.stopImmediatePropagation(),g.eventQueue.length>50&&g.eventQueue.shift(),g.eventQueue.push({type:"keydown",event:new KeyboardEvent(e.type,e)})):console.error("Parent Debug: Key press ignored because the script is not initialized. See previous errors.");return}let f=ex(n,i);if(f)e.preventDefault();else if(u.forward.includes(e.code)){e.preventDefault();let m=g.iframeElement;m&&m.contentWindow&&m.contentWindow.postMessage({type:"parent_keydown",key:e.key,code:e.code,ctrlKey:e.ctrlKey,metaKey:e.metaKey,shiftKey:e.shiftKey,altKey:e.altKey},"*")}}function ew(e){(e.code in g.modifierState||"Minus"===e.code||"Equal"===e.code)&&(g.modifierState[e.code]=!1);let t=e.target,a=t.closest('input, textarea, [contenteditable="true"]');if(a){let n="INPUT"===a.tagName&&["range","checkbox","radio","button","submit"].includes(a.type);if(!n)return}if(!g.isInitialized){let i=e.code;u.timestamp[i]&&(e.preventDefault(),e.stopImmediatePropagation(),g.eventQueue.push({type:"keyup",event:new KeyboardEvent(e.type,e)}));return}let r=e.code,o=M(r);if("Minus"===r||"Equal"===r){let l=g.iframeElement;l&&l.contentWindow&&l.contentWindow.postMessage({type:"parent_keyup",code:r},"*")}g.settings.timestamps&&o===g.activeTimestampKey?z(o,r):g.settings.timestamps&&g.activeTimestampKey&&g.activeTimestampKey.endsWith(r)&&(g.activeTimestampKey=null,g.timestampKeyUsedInCombo=!1)}function ex(e,t){let a=g.modifierState.ControlLeft||g.modifierState.ControlRight||g.modifierState.AltLeft||g.modifierState.AltRight||g.modifierState.MetaLeft||g.modifierState.MetaRight;if(g.settings.rating&&u.rating[t]&&g.activeTimestampKey)return N(t),!0;if(g.settings.rating&&u.rating[t]&&!a)!function e(t){if(g.isQueueLocked)return;let a=g.tableContainer;a&&a.classList.add("babel-no-hover");let n=g.speakerCount*f.CATEGORIES_PER_SPEAKER;g.ratingQueue.push(u.rating[t]),H(),g.ratingQueue.length>=n&&(g.isQueueLocked=!0)}(t);else if(g.settings.rating&&"KeyV"===t&&!a)et();else if(g.settings.timestamps&&void 0!==u.timestamp[t]){var n;n=t,g.activeTimestampKey||(g.activeTimestampKey=n,g.timestampKeyUsedInCombo=!1)}else if(g.settings.feedback&&u.feedback[t])q(t);else if("Enter"===e||"NumpadEnter"===e)D();else if(g.settings.zoomAndNavigation&&"ArrowDown"===t&&P())!function e(){let t=document.querySelector(b.nextButton);t?_(t):console.error("Babel: Could not find the 'Next' button. Check the selector.")}();else{if("Tab"!==e||a)return!1;let i=document.getElementById("babel-rubric-container");if(i){let r=i.querySelector("#babel-rubric-panel"),o=i.querySelector("#babel-analytics-tab"),l=i.querySelector("#babel-analytics-panel");if(r&&o&&l){let s="block"===r.style.display,d=s?"none":"block";r.style.display=d,o.style.display=d,s?(l.style.display="none",i.classList.remove("analytics-expanded")):g.isAnalyticsPanelOpen&&(l.style.display="block",i.classList.add("analytics-expanded"))}}}return!0}function eE(e){let t=e.target.closest(b.jttButtonSelector);t&&(g.iframeElement?.contentWindow.postMessage("calculate_duration_on_jump","*"),setTimeout(()=>{let e=document.querySelector(b.iframeSelector);e?e.focus():document.activeElement&&document.activeElement.blur()},50))}async function eC(e){let t=function e(){let t=g.ratingRows,a=t.length;if(0===a)return!1;let n=0,i=b.ratedStarColumn+" "+b.feedback.filledStar;for(let r of t)r&&r.querySelector(i)&&n++;let o=n===a;return o&&console.warn(`Babel Debug: isTableFull() returned TRUE. All ${a} rateable rows have been rated.`),o}(),a=function e(){let t=g.ratingRows;if(0===t.length)return!1;let a=b.ratedStarColumn+" "+b.feedback.filledStar;for(let n of t)if(n.querySelector(a))return!0;return!1}();if(!a){g.settings.audioSafety&&(en(),e&&e.postMessage("start_sequence","*"));return}let n="human";try{n=await I()}catch(i){console.error("[FlashPeek] ❌ ERROR during checkReviewerIdentity:",i)}"ai"===n?g.settings.audioSafety&&(en(),e&&e.postMessage("start_sequence","*")):t?g.settings.audioSafety&&ei("Audio Already Reviewed",2e3,"red"):g.settings.audioSafety&&ei("Partially Reviewed",2e3,"yellow")}function eR(e){if(e.data&&"object"==typeof e.data){if("iframe_keydown"===e.data.type&&e.data.code in g.modifierState)g.modifierState[e.data.code]=!0;else if("iframe_keyup"===e.data.type&&e.data.code in g.modifierState)g.modifierState[e.data.code]=!1;else if("iframe_keyup"===e.data.type){let t=M(e.data.code);z(t,e.data.code)}}if(e.data&&"iframe_ready"===e.data.type){if(g.iframeElement=document.querySelector(b.iframeSelector),g.iframeElement){if(e$(),g.iframeElement.contentWindow.postMessage({type:"os_info",isMac:f.IS_MAC},"*"),g.currentConferenceId){let a=document.querySelector(b.toggleInput),n=!!a&&w(a);g.iframeElement.contentWindow.postMessage({type:"babel_new_conference",isTrimmed:n},"*")}}else console.error("PARENT ERROR: Received 'iframe_ready' but couldn't find iframe.");return}if(g.iframeElement&&e.source===g.iframeElement.contentWindow){if("string"==typeof e.data){if("audio_is_ready"===e.data){if(g.conferenceLoadTimestamp&&Date.now()-g.conferenceLoadTimestamp>25e3){console.warn("Babel Master: Sequence blocked due to timeout.");return}let i=()=>{g.areRowsReady&&0!==g.ratingRows.length?eC(e.source):window.addEventListener("babel-rows-ready",t=>{t.detail.conferenceId===g.currentConferenceId&&g.ratingRows.length>0&&eC(e.source)},{once:!0})},r=document.querySelector(b.ratingSectionParent+" "+b.spinner);if(r){let o=new MutationObserver(()=>{document.querySelector(b.ratingSectionParent+" "+b.spinner)||(o.disconnect(),i())});r.parentElement&&o.observe(r.parentElement,{childList:!0})}else i()}else if("rejump_to_topic"===e.data){let l=document.querySelector(b.toggleInput);if(l&&l.checked){g.iframeElement.contentWindow.postMessage({type:"rejump_complete",skipped:!0},"*");return}let s=0,d=setInterval(()=>{let e=document.querySelector(b.jttButtonSelector);e?(clearInterval(d),_(e),g.iframeElement.contentWindow.postMessage({type:"rejump_complete",skipped:!1},"*")):++s>=40&&(clearInterval(d),g.iframeElement.contentWindow.postMessage({type:"rejump_complete",skipped:!1},"*"))},50)}return}if(!g.isInitialized){let c=e.data.code,p=e.data.type;"iframe_keydown"===p&&(u.rating[c]||"KeyV"===c||u.timestamp[c]||u.feedback[c])?g.eventQueue.push({type:"iframe_message",eventData:e.data}):"iframe_keyup"===p&&u.timestamp[c]&&g.eventQueue.push({type:"iframe_message",eventData:e.data});return}switch(e.data.type){case"iframe_keydown":let m=e.data.code,y=M(m),h=P();if(eS(m,h))return;if(m.startsWith("Numpad")){ex(m,y);return}ex(m,y);break;case"babel_force_jump_for_duration":setTimeout(()=>{let e=document.querySelector(b.jttButtonSelector),t=e&&!e.disabled&&"true"!==e.getAttribute("aria-disabled");t&&_(e),g.iframeElement.contentWindow.postMessage("calculate_duration_on_jump","*")},100);break;case"work_duration_response":let{minutes:$}=e.data;if(g.pendingConferenceId){var v;let k=0;g.lastRatedCount>=2&&(k=$);let S=f.BRH_MULTIPLIERS[g.speakerCount]||f.BRH_MULTIPLIERS[2];g.totalBrh+=k/60*S,v=k,g.totalMinutes+=v,el(),g.processedIds.push(g.pendingConferenceId),g.processedIds.length>f.MAX_PROCESSED_IDS&&g.processedIds.shift(),g.lastRatedCount=0}ep(),g.isWaitingForSave=!1,g.pendingConferenceId=null;break;case"current_time_response":if(null!==g.pendingTimestampIndex){let x=g.pendingTimestampIndex,E=Math.floor(x/f.CATEGORIES_PER_SPEAKER),C=["bgv","bgn","net","echo","ac"][x%f.CATEGORIES_PER_SPEAKER],R=e.data.time,A=function e(t){if(!t||"string"!=typeof t)return 0;let a=t.split(":").map(Number);return 2!==a.length||a.some(isNaN)?0:60*a[0]+a[1]}(R);if(0!==A||"00:00.000"===R){let L=e=>{let t=Math.max(0,e);return String(Math.floor(t/60)).padStart(2,"0")+":"+String((t%60).toFixed(3)).padStart(6,"0")};g.timestampList.push({speakerIndex:E,categoryKey:C,time1:L(A-1),time2:L(A-2)}),g.pendingTimestampIndex=null,ec()}}}}}let e3=new MutationObserver(()=>{let e=null!==document.querySelector(b.spinner);if(g.wasLoading&&!e){let t=document.querySelector(b.tableContainer);t&&null!==t.offsetParent&&(console.log(`🔄 Spinner disappeared on Rubric tab. Re-running row discovery`),setTimeout(eA,250))}g.wasLoading=e});function e0(){let e={childList:!0,subtree:!0};function t(){let t=document.querySelector(b.claimContainerParent),a=document.querySelector(b.ratingSectionParent);return t&&!o&&(e3.observe(t,e),o=!0),a&&!l&&(e3.observe(a,e),l=!0),o&&l}!t()&&(console.warn("Babel Master: Specific containers not found. Waiting for them to appear..."),i=new MutationObserver(()=>{t()&&(i&&i.disconnect(),i=null,r&&clearTimeout(r),r=null)}),r=setTimeout(()=>{i&&i.disconnect(),i=null,r=null,t()||(console.warn("Babel Master: Could not find specific spinner containers after 10s, falling back to observing the whole document body."),e3.observe(document.body,e))},1e4),i&&i.observe(document.body,e))}function eA(e){g.isInitialized=!1;let t=document.querySelector(b.tableContainer);if(!t||null===t.offsetParent)return;e&&0!==e.length||(e=Array.from(t.querySelectorAll(b.row)));let a=O(e);if(!a.isReady){console.warn("Babel: Table not ready for mapping yet (counts mismatch).");return}g.speakerCount=a.speakerCount;let n={bgv:0,bgn:0,net:0,echo:0,ac:0},i=[];e.forEach(e=>{let t=e.querySelector(b.categoryColumn);if(!t)return;let a=t.textContent,r=B(a);if(r){let o=n[r.key],l=o*f.CATEGORIES_PER_SPEAKER+r.offset;i[l]=e,n[r.key]++}}),g.standardizedRows=i;let r=g.speakerCount*f.CATEGORIES_PER_SPEAKER,o=g.standardizedRows.filter(e=>e).length;o===r?(g.ratingRows=g.standardizedRows,g.isInitialized=!0,function e(){let t=[0,2,3,5,7,8];for(let a=2;a<g.speakerCount;a++){let n=a*f.CATEGORIES_PER_SPEAKER,i=[n,n+2,n+3];t.push(...i)}t.forEach(e=>{let t=g.standardizedRows[e];t&&(t.removeEventListener("mousedown",ea),t.addEventListener("mousedown",ea))})}(),console.log(`✅ Babel: Mapped ${o} rows for ${g.speakerCount} speakers.`),window.dispatchEvent(new CustomEvent("babel-rows-ready",{detail:{conferenceId:g.currentConferenceId}})),ec()):console.error(`Babel: Mapping mismatch. Expected ${r}, found ${o}.`)}function eL(){let e=e=>{g.rowObserver&&(g.rowObserver.disconnect(),g.rowObserver=null);let t=()=>{let t=e.querySelectorAll(b.row);if(0===t.length)return!1;let a=O(t);return a.isReady},a=null,n=0,i=()=>{t()?(g.rowObserver?.disconnect(),function e(){if(g.isInitialized=!1,g.tableContainer=document.querySelector(b.tableContainer),!g.tableContainer){console.error("Parent Debug: Could not find the main table container. Check SELECTORS.tableContainer."),g.isInitialized=!1;return}let t=Array.from(g.tableContainer.querySelectorAll(b.row)),a=O(t),n=a.sortMode;if(g.learnedSortMode=n,g.speakerCount=a.speakerCount||2,"SPEAKER"===n){let i=[],r=new Set;for(let o of t){let l=o.querySelector(b.categoryColumn);if(!l)continue;let s=l.textContent.toLowerCase().trim();if(r.has(s))break;r.add(s);let d={text:s,isRateable:!1,categoryOffset:-1},c=B(s);c&&(d.isRateable=!0,d.categoryOffset=c.offset),i.push(d)}g.learnedSpeakerTemplate=i,eA(t)}else eA(t)}()):a=null};n=e.querySelectorAll(b.row).length,t()&&(a=setTimeout(i,300)),g.rowObserver=new MutationObserver(()=>{let r=e.querySelectorAll(b.row).length;(r!==n||!a)&&(n=r,a&&(clearTimeout(a),a=null),t()&&(a=setTimeout(i,300)))}),g.rowObserver.observe(e,{childList:!0,subtree:!0}),setTimeout(()=>g.rowObserver?.disconnect(),8e3)},t=()=>{let t=new MutationObserver((t,a)=>{let n=document.querySelector(b.tableContainer);n&&(a.disconnect(),e(n))});t.observe(document.body,{childList:!0,subtree:!0}),setTimeout(()=>t.disconnect(),1e4)},a=document.querySelector(b.tableContainer);if(a){let n=!1,i=null,r=new MutationObserver(()=>{document.contains(a)||(n=!0,clearTimeout(i),r.disconnect(),t())});i=setTimeout(()=>{r.disconnect(),n||e(a)},150),r.observe(document.body,{childList:!0,subtree:!0})}else t()}async function e8(e){g.claimObserver&&(g.claimObserver.disconnect(),g.claimObserver=null),g.rowObserver&&(g.rowObserver.disconnect(),g.rowObserver=null),g.idObserver&&(g.idObserver.disconnect(),g.idObserver=null),g.idObserverTimeout&&(clearTimeout(g.idObserverTimeout),g.idObserverTimeout=null),g.idContentObserver&&(g.idContentObserver.disconnect(),g.idContentObserver=null),e3.disconnect(),i&&(i.disconnect(),i=null),r&&(clearTimeout(r),r=null),o=!1,l=!1,e0();let a=e;if(a||(a=await new Promise(e=>{let t=b.auditConferenceId,a=document.querySelector(t);if(a&&a.textContent){e(a.textContent.trim());return}g.idObserver=new MutationObserver(()=>{(a=document.querySelector(t))&&a.textContent&&(g.idObserver&&g.idObserver.disconnect(),g.idObserverTimeout&&clearTimeout(g.idObserverTimeout),g.idObserver=null,g.idObserverTimeout=null,e(a.textContent.trim()))}),g.idObserver.observe(document.body,{childList:!0,subtree:!0}),g.idObserverTimeout=setTimeout(()=>{g.idObserver&&g.idObserver.disconnect(),g.idObserver=null,g.idObserverTimeout=null,console.warn("Babel Helper: Timed out waiting for Conference ID in DOM."),e(null)},1e4)})),a&&a!==g.currentConferenceId){console.log(`👣 Tracking NEW ID: ${a}`),g.isInitialized=!1,g.ratingRows=[],g.standardizedRows=[],g.ratingQueue.length=0,g.ratingIndex=0,g.learnedSortMode=null,g.learnedSpeakerTemplate=[],g.currentConferenceId=a,es(),g.conferenceLoadTimestamp=Date.now(),g.isClaimConfirmed=!1,g.areRowsReady=!1,g.tableContainer=null,g.hasInitialAudioCheckStarted=!1,g.timestampList=[];let n=document.getElementById("babel-analytics-panel");n&&n.querySelectorAll('[id^="babel-count-"]').forEach(e=>{e.textContent="0",e.parentElement&&(e.parentElement.className="")}),window.addEventListener("babel-rows-ready",function e(t){t.detail.conferenceId===g.currentConferenceId&&(g.areRowsReady=!0,er())},{once:!0}),setTimeout(eo,f.INITIAL_DELAY_MS),eL(),function e(a=0){if(!t)return;g.toggleObserver&&(g.toggleObserver.disconnect(),g.toggleObserver=null);let n=document.querySelector(b.toggleInput);if(!n){a<20?setTimeout(()=>{t&&e(a+1)},100):console.warn("Babel: Toggle button not found after retries. Observer not attached.");return}if(n.dataset.babelObserverAttached)return;n.dataset.babelObserverAttached="true";let i=new MutationObserver(e=>{e.forEach(e=>{"attributes"===e.type&&"aria-checked"===e.attributeName&&(g.hasInitialAudioCheckStarted=!1,setTimeout(()=>{let e=w(n);g.iframeElement?.contentWindow.postMessage({type:"babel_toggle_update",isTrimmed:e},"*")},0))})});i.observe(n,{attributes:!0}),g.toggleObserver=i}();let s=document.querySelector(b.toggleInput),d=!!s&&w(s);g.iframeElement?.contentWindow.postMessage({type:"babel_new_conference",isTrimmed:d},"*");let c=document.querySelector(b.auditConferenceId);c&&(g.idContentObserver=new MutationObserver(e=>{for(let t of e)if("characterData"===t.type||"childList"===t.type&&t.addedNodes.length>0){let a=c.textContent.trim();if(a&&a!==g.currentConferenceId){e8(a);break}}}),g.idContentObserver.observe(c,{characterData:!0,childList:!0,subtree:!0}))}else a||(g.currentConferenceId||console.log(`👣 No conference ID found. Setting tab to 'No conference'.`),g.currentConferenceId=null,g.isInitialized=!1,g.ratingRows=[],g.standardizedRows=[],es())}async function eI(){if(function e(){if(!g.settings.uiEnhancements)return;if(!document.getElementById("babel-layout-css")){let t=document.createElement("style");t.id="babel-layout-css",t.textContent=`
              /* 1. Set up the parent stack */
              [data-testid="RetoolStack::conferenceAuditingV1::stack1"] {
                  display: flex !important;
                  flex-direction: row !important;
                  /* This is the key: stops children from stretching to the tallest height */
                  align-items: flex-start !important;
              }

              /* 2. Style the draggable handle (Height is now set by JS) */
              #babel-drag-handle {
                  width: 8px;
                  background: #c0c0c0;
                  cursor: col-resize;
                  z-index: 100;
                  opacity: 0.3;
                  transition: opacity 0.2s, background-color 0.2s;
                  position: relative;
                  /* Height will be set by the new JavaScript */
              }
              #babel-drag-handle:hover {
                  opacity: 1;
                  background: #FB4302;
              }

              /* 3. Style the gripper icon */
              #babel-drag-handle::after {
                  content: '⋮';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  font-size: 24px;
                  line-height: 0;
                  color: #000;
                  opacity: 1;
                  transition: opacity 0.2s, color 0.2s, text-shadow 0.2s;
                  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
              }
              #babel-drag-handle:hover::after {
                  color: #fff;
                  opacity: 1;
                  text-shadow: 0 0 2px rgba(0, 0, 0, 0.3); /* Shadow for the white icon */
              }

              /* 4. Reset the panels (removes old overrides) */
              [data-testid="RetoolGrid:conferenceAuditingV1::container3"] {
                  flex-grow: 0 !important;
                  flex-shrink: 0 !important;
                  /* Remove any height overrides */
              }
              [data-testid="RetoolGrid:conferenceAuditingV1::tabbedContainer1"] {
                  flex-grow: 1 !important;
                  flex-shrink: 1 !important;
                  flex-basis: 0% !important;
                  min-width: 300px;
                  /* Remove any height overrides */
              }

              /* --- HEADER OVERLAP & CLICKABILITY --- */
              /* 1. Make the Main Header ignore mouse interaction */
              /* This lets clicks pass through the invisible "Claimed by you" overflow so they hit the Jump buttons. */
              [data-testid^="ContainerWidget_conferenceAuditingV"][data-testid*="::container1"] header {
                  pointer-events: none !important;
              }

              /* 2. RESCUE: Re-enable interaction for specific items INSIDE that header */
              /* This fixes the "Workers", "Rubric", and "Review Queue" tabs that got disabled */
              [role="tablist"],
              [data-testid^="Tabs::Tab"],
              /* This fixes the Next Button */
              [data-testid="Component::Action-button2--0"],
              [data-testid="Component::Action-button2--0"] *,
              /* This fixes the Conference ID selection */
              [data-testid$="::containerTitle1--0"],
              [data-testid$="::containerTitle1--0"] *,
              /* This fixes links inside the Claim Alert */
              div[data-testid="Alert::Body"] a {
                  pointer-events: auto !important;*/
              }
            `,document.head.appendChild(t)}let a="babel_divider_left_percent",n,i,r,o,l,s=0,d=!1,c=new ResizeObserver(e=>{if(!d)for(let t of e){let a=t.contentRect.height;a>0&&r&&(r.style.height=`${a}px`)}});function p(){if(d=!1,document.body.style.userSelect="",document.body.style.cursor="",document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",p),o&&(o.style.pointerEvents="auto"),n){localStorage.setItem(a,n.style.flexBasis);let e=l.getBoundingClientRect().width,t=f(e);if(null!==t){let i=parseFloat(n.style.flexBasis);.1>Math.abs(i-t/e*100)?localStorage.setItem("babel_divider_is_maxed","true"):localStorage.setItem("babel_divider_is_maxed","false")}else localStorage.setItem("babel_divider_is_maxed","false");c.observe(n)}}let u,f,m=new MutationObserver((e,t)=>{if((l=document.querySelector(b.draggable.parent))&&(n=l.querySelector(b.draggable.leftPanel),i=l.querySelector(b.draggable.rightPanel),n&&(o=n.querySelector(b.iframeSelector)),n&&i&&o)){if(t.disconnect(),n.style.setProperty("flex-grow","0","important"),n.style.setProperty("flex-shrink","0","important"),i.style.setProperty("flex-grow","1","important"),i.style.setProperty("flex-shrink","1","important"),i.style.setProperty("flex-basis","0%","important"),document.getElementById("babel-drag-handle"))return;(r=document.createElement("div")).id="babel-drag-handle",l.insertBefore(r,i),f=e=>{if(!i||!r)return null;let t=r.getBoundingClientRect(),a=document.querySelector(b.tableContainer);if(!a)return null;let n=a.querySelector(b.ratedStarColumn),o=a.querySelector('[data-testid="TableWrapper::ScrollableContainer"]');if(n&&o){let l=n.offsetLeft+n.offsetWidth;return e-(l+30)-t.width}return e-400-t.width},u=e=>{if(!d||!l)return;let t=l.getBoundingClientRect(),i=t.width,r=parseFloat(n.style.flexBasis);if(r>=99){let o=e.clientX-s;if(o<-2){L();let c=f(i);if(c){let u=c/i*100;n.style.flexBasis=`${u}%`,localStorage.setItem(a,`${u}%`),localStorage.setItem("babel_divider_is_maxed","true"),p()}else n.style.flexBasis="95%"}return}let b=e.clientX-s,m=e.clientX-t.left,g=m/i*100,y=f(i);null===y&&(y=.8*i);let h=y/i*100;g>=h+4&&(b>0||g>99)?(n.style.flexBasis="100%",A()):g>h?(n.style.flexBasis=`${h}%`,L()):Math.abs(g-50)<25/i*100?(n.style.flexBasis="50%",L()):g<15?(n.style.flexBasis="15%",L()):(n.style.flexBasis=`${g}%`,L()),s=e.clientX};let m=localStorage.getItem(a);m?(n.style.flexBasis=m,parseFloat(m)>=99&&A()):n.style.flexBasis="50%",r.addEventListener("mousedown",e=>{e.preventDefault(),d=!0,s=e.clientX,o&&(o.style.pointerEvents="none"),c.disconnect(),document.body.style.userSelect="none",document.body.style.cursor="col-resize",document.addEventListener("mousemove",u),document.addEventListener("mouseup",p)}),c.observe(n);let g=()=>{if(!l||!n)return;let e=l.getBoundingClientRect().width,t=parseFloat(n.style.flexBasis);if(isNaN(t))return;let i="true"===localStorage.getItem("babel_divider_is_maxed"),r=f(e);if(null===r)return;let o=r/e*100;(i||t>o)&&t<99&&(n.style.flexBasis=`${o}%`,n.offsetHeight,localStorage.setItem(a,n.style.flexBasis))},y;window.addEventListener("resize",()=>{clearTimeout(y),y=setTimeout(()=>{g()},100)})}});m.observe(document.body,{childList:!0,subtree:!0})}(),e8(v(location.href)),window.navigation)window.navigation.addEventListener("navigate",e=>{e8(v(e.destination.url))});else{console.warn("Rating Tool: window.navigation API not found. Falling back to history patching for compatibility.");let e=location.href,t=()=>{location.href!==e&&(e=location.href,e8(v(location.href)))},a=e=>{let a=history[e];return function(...e){a.apply(this,e),t()}};history.pushState=a("pushState"),history.replaceState=a("replaceState"),window.addEventListener("popstate",t)}e0()}let eT,eB=(e=ed,function(){let t=arguments;eT||(e.apply(this,t),eT=!0,setTimeout(()=>eT=!1,30))});function eO(){t&&(t=!1,n.forEach(e=>e()),n=[],g.currentConferenceId=null,es(),g.isInitialized=!1,g.ratingRows=[],g.standardizedRows=[],g.currentConferenceId=null,g.iframeElement=null,g.layoutObserver&&(g.layoutObserver.disconnect(),g.layoutObserver=null),console.log("⚪ Babel Master (Tools) disabled."))}function eP(){let e=location.href.startsWith("https://davidai.retool.com/apps/a53801c8-d94c-11ef-be02-eb390bc730a8/Call%20Reviews/Audio%20Reviewing"),i=location.href.startsWith("https://davidai.retool.com/apps/c77aaa6c-b3c4-11f0-a971-af897fc4c949/Audio%20Reviewing%20-%20Indic"),r=location.href.startsWith("https://davidai.retool.com/apps/a53801c8-d94c-11ef-be02-eb390bc730a8/Call%20Reviews/Audio%20Reviewing/audit"),o=document.getElementById("babel-ui-container");if(e||i||r){!function e(){if(a)return;a=!0;let t=localStorage.getItem("babelMaster_settings");t&&(g.settings=Object.assign({},g.settings,JSON.parse(t))),g.totalMinutes=parseFloat(sessionStorage.getItem("babelBrh_totalMinutes")||"0"),g.totalBrh=parseFloat(sessionStorage.getItem("babelBrh_totalBrh")||"0"),g.processedIds=JSON.parse(sessionStorage.getItem("babelBrh_processedIds")||"[]"),g.conferenceCount=parseInt(sessionStorage.getItem("babelBrh_conferenceCount")||"0",10);let n=localStorage.getItem("babel_custom_feedback");n?h=JSON.parse(n):(h={...y},localStorage.setItem("babel_custom_feedback",JSON.stringify(h))),(s=document.createElement("div")).id="babel-brh-counter",(d=document.createElement("div")).id="babel-rubric-container",function e(){let t=`
            <div id="babel-rubric-corner-filler"></div>
            <div id="babel-rubric-tab">Audit Rubric</div>
            <div id="babel-rubric-panel">

                <table class="rubric-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th class="rubric-good">Good</th>
                            <th class="rubric-ok">OK</th>
                            <th class="rubric-bad">Bad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>BGV</strong> <br>(Background Voice)</td>
                            <td class="rubric-good">None</td>
                            <td class="rubric-ok">1-2 minor (very faint)</td>
                            <td class="rubric-bad">&gt;2 minor / 1 major</td>
                        </tr>
                        <tr>
                            <td><strong>BGN</strong> <br>(Background Noise)</td>
                            <td class="rubric-good">1-4 minor</td>
                            <td class="rubric-ok">5-17 minor / 1 major*</td>
                            <td class="rubric-bad">&gt;17 minor / &gt;1 major*</td>
                        </tr>
                        <tr>
                            <td><strong>Net</strong> <br>(Network Connection)</td>
                            <td class="rubric-good">Few minor (not very noticeable)</td>
                            <td class="rubric-ok">1-2 medium (~1s)</td>
                            <td class="rubric-bad">&gt;2 medium / 1 major (&gt;2s)</td>
                        </tr>
                        <tr>
                            <td><strong>Echo</strong></td>
                            <td class="rubric-good">None</td>
                            <td class="rubric-ok">1-2 minor (very faint)</td>
                            <td class="rubric-bad">&gt;2 minor / 1 major</td>
                        </tr>
                        <tr>
                            <td><strong>AC</strong> <br>(Audio Clarity)</td>
                            <td class="rubric-good">Light (present - not distracting)</td>
                            <td class="rubric-ok">Moderate (present - not unpleasant)</td>
                            <td class="rubric-bad">Major (difficult to understand - unpleasant)</td>
                        </tr>
                    </tbody>
                </table>
                <p style="font-size: 11px; opacity: 0.7; margin-top: 10px; text-align: right;">*Non-human sounds, coughs, sneezes are considered major BGN.</p>
                <p style="font-size: 11px; opacity: 0.7; margin-top: 10px; text-align: right;">**This is a guide, use your judgment for final rating.</p>
            </div>

            <div id="babel-analytics-tab" style="display: none;">Current Call</div>

            <div id="babel-analytics-panel" style="display: none;">
                <div id="current-call-content-panel"></div>
            </div>
        `;d&&(d.innerHTML=t)}(),document.body.appendChild(d);let i=document.createElement("div");i.id="babel-analytics-panel",i.style.display="none",document.body.appendChild(i),function e(){let t=`
            <table class="rubric-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th class="header-speaker-1">Speaker 1</th>
                        <th class="header-speaker-2">Speaker 2</th>
                        <th class="header-speaker-3">Speaker 3</th>
                        <th class="header-speaker-4">Speaker 4</th>
                        <th class="header-speaker-5">Speaker 5</th>
                        <th class="header-speaker-6">Speaker 6</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>BGV</strong> <br>(Background Voice)</td>
                        <td><span id="babel-count-bgv-0">0</span></td>
                        <td><span id="babel-count-bgv-1">0</span></td>
                        <td><span id="babel-count-bgv-2">0</span></td>
                        <td><span id="babel-count-bgv-3">0</span></td>
                        <td><span id="babel-count-bgv-4">0</span></td>
                        <td><span id="babel-count-bgv-5">0</span></td>
                    </tr>
                    <tr>
                        <td><strong>BGN</strong> <br>(Background Noise)</td>
                        <td><span id="babel-count-bgn-0">0</span></td>
                        <td><span id="babel-count-bgn-1">0</span></td>
                        <td><span id="babel-count-bgn-2">0</span></td>
                        <td><span id="babel-count-bgn-3">0</span></td>
                        <td><span id="babel-count-bgn-4">0</span></td>
                        <td><span id="babel-count-bgn-5">0</span></td>
                    </tr>
                    <tr>
                        <td><strong>Net</strong> <br>(Network Connection)</td>
                        <td><span id="babel-count-net-0">0</span></td>
                        <td><span id="babel-count-net-1">0</span></td>
                        <td><span id="babel-count-net-2">0</span></td>
                        <td><span id="babel-count-net-3">0</span></td>
                        <td><span id="babel-count-net-4">0</span></td>
                        <td><span id="babel-count-net-5">0</span></td>
                    </tr>
                    <tr>
                        <td><strong>Echo</strong></td>
                        <td><span id="babel-count-echo-0">0</span></td>
                        <td><span id="babel-count-echo-1">0</span></td>
                        <td><span id="babel-count-echo-2">0</span></td>
                        <td><span id="babel-count-echo-3">0</span></td>
                        <td><span id="babel-count-echo-4">0</span></td>
                        <td><span id="babel-count-echo-5">0</span></td>
                    </tr>
                    <tr>
                        <td><strong>AC</strong> <br>(Audio Clarity)</td>
                        <td><span id="babel-count-ac-0">0</span></td>
                        <td><span id="babel-count-ac-1">0</span></td>
                        <td><span id="babel-count-ac-2">0</span></td>
                        <td><span id="babel-count-ac-3">0</span></td>
                        <td><span id="babel-count-ac-4">0</span></td>
                        <td><span id="babel-count-ac-5">0</span></td>
                    </tr>
                </tbody>
            </table>
            <div class="babel-analytics-footer">
                <span id="babel-sync-warning">Note: Sync requires timestamp colors to be loaded.</span>
                <button id="babel-sync-timestamps-btn" title="Sync with Conference Flags list">
                    <svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg>
                    Sync
                </button>
            </div>
        `,a=document.getElementById("current-call-content-panel");a&&(a.innerHTML=t)}();let r=document.createElement("div");r.id="babel-ui-container",r.appendChild(s),document.body.appendChild(r),ep(),ey();let o=document.getElementById("babel-settings-menu");if(o&&(o.style.display=g.isBrhCollapsed?"none":"block"),s.classList.toggle("collapsed-view",g.isBrhCollapsed),s.addEventListener("click",e=>{if(e.target.closest("#babel-settings-menu"))return;g.isBrhCollapsed=!g.isBrhCollapsed,s.classList.toggle("collapsed-view",g.isBrhCollapsed),g.isBrhCollapsed||eg();let t=document.getElementById("babel-settings-menu");t&&(t.style.display=g.isBrhCollapsed?"none":"block"),el()}),document.body.addEventListener("click",e=>{e.target.classList.contains("feedback-edit-btn")&&function e(){eh();let t=document.createElement("div");t.className="modal-overlay",t.onclick=eh;let a=document.createElement("div");a.id="feedback-editor-modal";let n="";[{type:"header",text:"Background Voice"},{type:"feedback",key:"NumpadMultiply"},{type:"header",text:"Background Noise"},{type:"feedback",key:"Numpad2"},{type:"feedback",key:"Numpad5"},{type:"feedback",key:"Numpad8"},{type:"feedback",key:"NumpadDivide"},{type:"header",text:"Network Connection"},{type:"feedback",key:"Numpad9"},{type:"header",text:"Echo"},{type:"feedback",key:"Numpad6"},{type:"header",text:"Audio Clarity"},{type:"feedback",key:"Numpad0"},{type:"feedback",key:"Numpad1"},{type:"feedback",key:"Numpad4"},{type:"feedback",key:"Numpad7"},].forEach(e=>{if("header"===e.type)n+=`<h3 style="margin-top: 15px; border-bottom: 1px solid rgba(127,127,127,0.3); padding-bottom: 5px; font-size: 15px; font-weight: 600;">${e.text}</h3>`;else if("feedback"===e.type){let t=e.key;n+=`
                    <div class="feedback-item">
                        <label for="feedback-editor-${t}">${f.FEEDBACK_LABELS[t]||t} (${t})</label>
                        <textarea id="feedback-editor-${t}">${h[t]||""}</textarea>
                    </div>
                `}}),a.innerHTML=`
            <div class="modal-header">
                Edit Feedback
                <span id="feedback-close-btn" class="modal-close-btn" title="Close (discards changes)">&times;</span>
            </div>
            <div class="modal-content">${n}</div>
            <div class="modal-footer">
                <button id="feedback-default-btn" class="modal-btn modal-btn-secondary">Reset to Default</button>
                <button id="feedback-save-btn" class="modal-btn modal-btn-primary">Save Changes</button>
            </div>
        `,document.body.appendChild(t),document.body.appendChild(a),document.getElementById("feedback-save-btn").onclick=()=>{let e={};for(let t in y){let a=document.getElementById(`feedback-editor-${t}`);a&&(e[t]=a.value)}localStorage.setItem("babel_custom_feedback",JSON.stringify(e)),h=e,eh()},document.getElementById("feedback-default-btn").onclick=()=>{for(let e in y){let t=document.getElementById(`feedback-editor-${e}`);t&&(t.value=y[e])}},document.getElementById("feedback-close-btn").onclick=eh;let i=a.querySelectorAll("textarea");function r(e){e&&(e.style.height="auto",e.style.height=e.scrollHeight+"px")}i.forEach(r),a.addEventListener("input",e=>{"textarea"===e.target.tagName.toLowerCase()&&r(e.target)})}()}),d){let l=d.querySelector("#babel-rubric-tab"),c=d.querySelector("#babel-rubric-panel"),p=d.querySelector("#babel-analytics-tab"),u=d.querySelector("#babel-analytics-panel");l&&c&&p&&u&&l.addEventListener("click",function e(){let t=d.querySelector("#babel-rubric-panel"),a=d.querySelector("#babel-analytics-tab"),n=d.querySelector("#babel-analytics-panel");if(!t||!a||!n)return;let i="block"===t.style.display,r=i?"none":"block";t.style.display=r,a.style.display=r,i?(n.style.display="none",d.classList.remove("analytics-expanded")):g.isAnalyticsPanelOpen&&(n.style.display="block",d.classList.add("analytics-expanded"))}),p&&u&&p.addEventListener("click",()=>{if(p.classList.contains("disabled"))return;let e="block"===u.style.display;u.style.display=e?"none":"block",d.classList.toggle("analytics-expanded",!e),g.isAnalyticsPanelOpen=!e,e||ed()})}es(),setTimeout(()=>{s.style.visibility="visible",s.style.opacity="1"},100),console.log("✅ Babel Persistent UI Loaded.")}();let l=document.getElementById("babel-ui-container");l&&(l.style.display="flex"),d&&(d.style.display="flex");let c=v(location.href),p=null!==c&&""!==c.trim();r||p?function e(){let a=e=>{let t=e.target.closest(b.ratingSectionParent),a=e.target.closest('button, input, textarea, a, [role="button"], label');t&&!a&&document.activeElement&&document.activeElement!==document.body&&document.activeElement.blur()};if(t)return;t=!0,console.log("✅ Babel Master (Tools) enabled on",location.href);let i=()=>{g.modifierState.ControlLeft=!1,g.modifierState.ControlRight=!1,g.modifierState.AltLeft=!1,g.modifierState.AltRight=!1,g.modifierState.MetaLeft=!1,g.modifierState.MetaRight=!1,g.modifierState.ShiftLeft=!1,g.modifierState.ShiftRight=!1,g.activeTimestampKey=null,g.timestampKeyUsedInCombo=!1},r=e=>{(g.modifierState.Minus||g.modifierState.Equal)&&(e.preventDefault(),g.iframeElement&&g.iframeElement.contentWindow&&g.iframeElement.contentWindow.postMessage({type:"parent_wheel",deltaY:e.deltaY},"*"))};document.addEventListener("keydown",e_,!0),document.addEventListener("keyup",ew,!0),window.addEventListener("message",eR),document.addEventListener("babel-rating-applied",ee),document.body.addEventListener("click",ek,!0),document.body.addEventListener("click",eE,!0),window.addEventListener("blur",i),document.addEventListener("wheel",r,{passive:!1}),window.addEventListener("resize",eB),document.addEventListener("mousedown",a,!0),eI(),g.layoutObserver=function e(){if(!g.settings.uiEnhancements)return null;let t=new MutationObserver(e=>{let t=!1;for(let a of e)if("childList"===a.type&&a.addedNodes.length>0){t=!0;break}if(!t)return;let n=document.querySelector(b.toggleInput),i=null;if(n){if((i=n.closest("header"))&&(i.style.setProperty("padding","0","important"),i.style.setProperty("margin","0","important"),i.style.setProperty("min-height","24px","important"),i.style.setProperty("height","24px","important"),i.style.setProperty("max-height","24px","important"),i.style.setProperty("display","block","important"),i.style.setProperty("pointer-events","auto","important"),i.style.setProperty("visibility","visible","important"),i.style.setProperty("opacity","1","important"),i.style.setProperty("overflow","hidden","important"),i.firstElementChild)){let r=i.firstElementChild;r.style.setProperty("min-height","24px","important"),r.style.setProperty("height","24px","important"),r.style.setProperty("margin","0","important"),r.style.setProperty("padding","0","important")}let o=n.closest(b.toggleWidget);o&&(o.style.setProperty("position","relative","important"),o.style.setProperty("top","auto","important"),o.style.setProperty("left","auto","important"),o.style.setProperty("transform","none","important"),o.style.setProperty("margin","0","important"));let l=document.querySelector(b.tabsToHide);l&&l.style.setProperty("display","none","important")}else{let s=document.querySelector(b.oldHeaderFallback);s&&(s.style.display="none")}let d=document.querySelector(b.audioPlayerAny);if(d){let c=d.closest(b.mainContentArea);c&&c.style.setProperty("padding","0px","important")}let p=document.querySelectorAll(b.topHeaders);p.forEach(e=>{(!i||e!==i)&&(e.querySelector(b.oldHeaderInternal)||"55px"===e.style.minHeight||(e.style.minHeight="55px",e.style.height="55px"))});let u=document.querySelector(b.titleContainer);u&&"0px"!==u.style.top&&(u.style.top="0px");let f=document.querySelector('[data-test-scope$="::stack1:body"]');f&&!f.dataset.babelScrollJail&&(f.dataset.babelScrollJail="true",f.addEventListener("scroll",function(){0!==this.scrollTop&&(this.scrollTop=0),0!==this.scrollLeft&&(this.scrollLeft=0)},{passive:!1}),f.style.setProperty("overflow","hidden","important"));let m=document.querySelector(b.resizeAudioWidget);if(m&&!m.dataset.babelResizeAttached){let g=document.querySelector(b.draggable.leftPanel),y=g?g.querySelector(b.resizeTargetGrid):null;if(y){m.dataset.babelResizeAttached="true";let h=new MutationObserver(e=>{e.forEach(e=>{if("style"===e.attributeName){let t=e.target,a=t.style.minHeight,n="important"===t.style.getPropertyPriority("min-height");if(a&&!n){let i=parseFloat(a);if(!isNaN(i)&&i>100){let r=i-140;h.disconnect(),t.style.setProperty("min-height",`${r}px`,"important"),t.style.setProperty("height",`${r}px`,"important"),t.style.setProperty("flex-grow","0","important"),t.style.setProperty("flex","0 0 auto","important"),h.observe(t,{attributes:!0,attributeFilter:["style"]})}}}})});h.observe(y,{attributes:!0,attributeFilter:["style"]}),y._babelStyleObserver=h}}let $=document.querySelector(b.ratingSectionParent);$&&"-1"!==$.getAttribute("tabindex")&&($.setAttribute("tabindex","-1"),$.style.setProperty("outline","none","important"))});return t.observe(document.body,{childList:!0,subtree:!0}),t}(),(n=[]).push(()=>document.removeEventListener("keydown",e_,!0)),n.push(()=>document.removeEventListener("keyup",ew,!0)),n.push(()=>window.removeEventListener("message",eR)),n.push(()=>document.removeEventListener("babel-rating-applied",ee)),n.push(()=>document.body.removeEventListener("click",ek,!0)),n.push(()=>document.body.removeEventListener("click",eE,!0)),n.push(()=>{try{e3.disconnect()}catch(e){}}),n.push(()=>window.removeEventListener("resize",eB)),n.push(()=>window.removeEventListener("blur",i)),n.push(()=>document.removeEventListener("wheel",r)),n.push(()=>document.removeEventListener("mousedown",a,!0))}():eO()}else eO(),o&&(o.style.display="none"),d&&(d.style.display="none")}window.addEventListener("resize",eB);let eM=history.pushState;history.pushState=function(){eM.apply(this,arguments),setTimeout(eP,50)};let eN=history.replaceState;history.replaceState=function(){eN.apply(this,arguments),setTimeout(eP,50)},window.addEventListener("popstate",eP);let eq=new MutationObserver((e,t)=>{let a=document.querySelector("main");a&&(t.disconnect(),eP())});document.querySelector("main")?eP():(eq.observe(document.body,{childList:!0,subtree:!0}),setTimeout(()=>{eq.disconnect(),a||(console.warn("Babel Master: Timed out waiting for <main> element. Attempting to run anyway."),eP())},5e3))}(),location.href.startsWith("https://retool-edge.com")&&function(){"use strict";let e={zoomSlider:"#root > div > div > div.player-toolbar > div:nth-child(2) > label > input",pannerSlider1:"#root > div > div > div.channels-container > div.channels-controls-sidebar > div:nth-child(1) > div.volume-slider-container > input",pannerSlider2:"#root > div > div > div.channels-container > div.channels-controls-sidebar > div:nth-child(2) > div.volume-slider-container > input",pannerSlider3:"#root > div > div > div.channels-container > div.channels-controls-sidebar > div:nth-child(3) > div.volume-slider-container > input",pannerSlider4:"#root > div > div > div.channels-container > div.channels-controls-sidebar > div:nth-child(4) > div.volume-slider-container > input",pannerSlider5:"#root > div > div > div.channels-container > div.channels-controls-sidebar > div:nth-child(5) > div.volume-slider-container > input",pannerSlider6:"#root > div > div > div.channels-container > div.channels-controls-sidebar > div:nth-child(6) > div.volume-slider-container > input",cursorLine_mainContainer:"#root > div > div > div.channels-container > div.channels-visualizations-wrapper > div > div.all-visualizations-container",loadingOverlay:"#root > div > div > div.loading-overlay",playButton:"#root > div > div > div.player-toolbar > div.toolbar-group.always-visible > button.play-button",refreshButton:"#root > div > div > div.player-toolbar > div.toolbar-group.always-visible > button.reset-button",timerDisplay:"#root > div > div > div.player-toolbar > div.toolbar-group.always-visible > div > div.time-display",timerContainer:"div.player-toolbar",scrollWindowPath:["#root > div > div > div.channels-container > div.channels-visualizations-wrapper > div"],playheadPath:["#global-cursor"]},t={DOUBLE_PRESS_THRESHOLD:200,ZOOM_STEP:8,CURSOR_LINE_COLOR:"rgba(255, 191, 0, 1)",CURSOR_LINE_WIDTH:1.5,CURSOR_LINE_X_OFFSET:2,CURSOR_GLOW_BORDER_COLOR:"rgb(150, 21, 133)",CURSOR_GLOW_SHADOW_COLOR:"rgba(199, 21, 133, 0.5)",SCROLL_DURATION_MS:200},a={isMac:!1,settings:{cursorLine:!0,enhancedReset:!0,panner:!0,zoomAndNavigation:!0},isCompressedMode:!1,timerObserver:null,zoomSliderElement:null,pressTimers:{zoom_in:null,zoom_out:null},zoomKeyState:{Minus:!1,Equal:!1,scrolled:!1},lastCalculatedMinutes:0,isPerformingSequence:!1,hasAttemptedDurationFallback:!1,durationRetries:0},n=null;GM_addStyle(`
        /* When hovering over the waveform area, force the cursor to be hidden for ALL elements inside it */
        html.babel-cursor-line-enabled ${e.cursorLine_mainContainer}:hover * {
            cursor: none;
        }
    `);let i=document.createElement("div");i.id="lowest-latency-cursor-line",i.style.position="fixed",i.style.width=`${t.CURSOR_LINE_WIDTH}px`,i.style.backgroundColor=t.CURSOR_LINE_COLOR,i.style.zIndex="50",i.style.pointerEvents="none",i.style.display="none",i.style.transform="translateX(-20px)",document.body.appendChild(i);let r=document.createElement("div");function o(){let e=document.querySelector(".play-button")||document.querySelector(".pause-button");if(!e)return null;let t=(e=>{let t=Object.keys(e||{}).find(e=>e.startsWith("__reactFiber"));return t?e[t]:null})(e);for(let a=0;a<20&&t;a++){let n=t.memoizedProps;if(n&&"function"==typeof n.onPlayPause&&"boolean"==typeof n.isPlaying)return n;t=t.return}return null}function l(e,t){if(!e||void 0===t)return;let a=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set;a.call(e,t),e.dispatchEvent(new Event("input",{bubbles:!0}))}function s(){a.zoomSliderElement&&(a.zoomSliderElement.dispatchEvent(new Event("mousedown",{bubbles:!0})),a.zoomSliderElement.dispatchEvent(new Event("mouseup",{bubbles:!0})),a.zoomSliderElement.dispatchEvent(new Event("change",{bubbles:!0})),a.zoomSliderElement.blur())}function d(e){if(!a.zoomSliderElement)return;let t=parseInt(a.zoomSliderElement.value,10);if(isNaN(t))return;let n;n=e<0?t+1:t-1;let i=parseFloat(a.zoomSliderElement.max)||100,r=parseFloat(a.zoomSliderElement.min)||0;n=Math.max(r,Math.min(i,n)),l(a.zoomSliderElement,String(n))}r.id="cursor-glow-dot",r.style.position="fixed",r.style.width="12px",r.style.height="12px",r.style.background="transparent",r.style.backgroundImage="linear-gradient(to right, transparent calc(50% - 0.75px), #ffbf00 calc(50% - 0.75px), #ffbf00 calc(50% + 0.75px), transparent calc(50% + 0.75px))",r.style.border=`1px solid ${t.CURSOR_GLOW_BORDER_COLOR}`,r.style.boxSizing="border-box",r.style.borderRadius="50%",r.style.boxShadow="none",r.style.zIndex="51",r.style.pointerEvents="none",r.style.display="none",document.body.appendChild(r);let c=e=>new Promise(t=>setTimeout(t,e));function p(e){if(!a.settings.zoomAndNavigation||!a.zoomSliderElement)return;let n=`zoom_${e}`;if(a.pressTimers[n]){clearTimeout(a.pressTimers[n]),a.pressTimers[n]=null;let i=parseFloat(a.zoomSliderElement.max)||100,r=parseFloat(a.zoomSliderElement.min)||0,o="in"===e?String(i):String(r);l(a.zoomSliderElement,o),s();return}a.pressTimers[n]=setTimeout(()=>{let i=parseInt(a.zoomSliderElement.value,10);if(isNaN(i))return;let r;r="in"===e?i+t.ZOOM_STEP:i-t.ZOOM_STEP;let o=parseFloat(a.zoomSliderElement.max)||100,d=parseFloat(a.zoomSliderElement.min)||0;r=Math.max(d,Math.min(o,r)),l(a.zoomSliderElement,String(r)),s(),a.pressTimers[n]=null},t.DOUBLE_PRESS_THRESHOLD)}function u(e,t,a){let n=a?"0.03":"0";e.forEach((e,a)=>{e&&(l(e,a===t?"1":n),e.blur())})}function b(n){["KeyB","KeyN","KeyM","Comma","Period","Slash"].includes(n.code)&&function n(i){if(!a.settings.panner)return;let{code:r,altKey:o,ctrlKey:s,metaKey:d,shiftKey:c}=i,p={KeyB:0,KeyN:1,KeyM:2,Comma:3,Period:4},b=-1,f=null;"KeyB"===r&&o?(b=5,f="AltB"):void 0===p[r]||o||(b=p[r],f=r);let m="Slash"===r&&!o&&!s&&!d&&!c;if(-1===b&&!m)return;let g=function e(){let t=document.querySelector('[class*="channels-controls-sidebar"]');if(!t)return null;let a=(e=>{let t=Object.keys(e||{}).find(e=>e.startsWith("__reactFiber"));return t?e[t]:null})(t);for(let n=0;n<20&&a;n++){let i=a.memoizedProps;if(i&&"function"==typeof i.handleChannelSolo&&"function"==typeof i.handleChannelVolume)return i;a=a.return}return null}();if(g){let y=g.channels?g.channels.length:6,h=g.channelStates?g.channelStates.current:[],$=()=>{h&&h.length>0&&h.forEach((e,t)=>{e&&e.isSolo&&g.handleChannelSolo(t)})};if(m){$();for(let v=0;v<y;v++)g.handleChannelVolume(v,1);return}let k=`pan_${f}`;if(a.pressTimers[k]){clearTimeout(a.pressTimers[k]),a.pressTimers[k]=null,$();for(let S=0;S<y;S++){let _=S===b?1:.03;g.handleChannelVolume(S,_)}}else a.pressTimers[k]=setTimeout(()=>{a.pressTimers[k]=null;for(let e=0;e<y;e++)g.handleChannelVolume(e,1);g.handleChannelSolo(b)},t.DOUBLE_PRESS_THRESHOLD);return}let w=[document.querySelector(e.pannerSlider1),document.querySelector(e.pannerSlider2),document.querySelector(e.pannerSlider3),document.querySelector(e.pannerSlider4),document.querySelector(e.pannerSlider5),document.querySelector(e.pannerSlider6)].filter(e=>e);if(0===w.length)return;if(m){w.forEach(e=>{l(e,"1"),e.blur()});return}let x=`pan_${f}`;a.pressTimers[x]?(clearTimeout(a.pressTimers[x]),a.pressTimers[x]=null,u(w,b,!0)):a.pressTimers[x]=setTimeout(()=>{u(w,b,!1),a.pressTimers[x]=null},t.DOUBLE_PRESS_THRESHOLD)}(n)}function f(e){let t=document;for(let a=0;a<e.length;a++){let n=e[a];if(a>0&&!(t=t.shadowRoot)||!(t=t.querySelector(n)))return null}return t}let m=null;function g(e,t,a){return m&&m(),new Promise(n=>{let i=e.scrollLeft,r=t-i,o=0,l,s=e=>e<.5?2*e*e:-1+(4-2*e)*e,d=t=>{0===o&&(o=t);let c=t-o,p=Math.min(c/a,1),u=s(p);e.scrollLeft=i+r*u,c<a?l=requestAnimationFrame(d):(m=null,n())};m=()=>{cancelAnimationFrame(l),m=null,n()},l=requestAnimationFrame(d)})}function y(e){if(!e)return 0;let t=window.getComputedStyle(e),a=new DOMMatrix(t.transform);return a.m41}function h(){return new Promise((t,a)=>{let n=0,i=setInterval(()=>{let r=document.querySelector(e.loadingOverlay);if(r){clearInterval(i);let o=0,l=setInterval(()=>{document.querySelector(e.loadingOverlay)?(o+=100)>=15e3&&(clearInterval(l),console.warn("Babel: Loading spinner is stuck. Aborting sequence."),a("Spinner stuck")):(clearInterval(l),t())},100)}else(n+=100)>=3e3&&(clearInterval(i),t())},100)})}async function $(){if(a.isPerformingSequence){console.error("Iframe: Sequence already in progress. Ignoring duplicate request.");return}a.isPerformingSequence=!0;let i=a.isCompressedMode;try{let r=document.querySelector(e.refreshButton);if(!r)return console.error("Iframe Debug: Could not find Refresh button in sequence. Check SELECTORS.refreshButton.");r.click(),r.blur();try{await h()}catch(l){a.isPerformingSequence=!1;return}if(a.isCompressedMode!==i){console.warn("Babel: Mode switched during load. Aborting ghost sequence."),a.isPerformingSequence=!1;return}let s=f(e.playheadPath),d=y(s),p=!1;if(a.isCompressedMode)p=!0;else try{p=await new Promise((e,t)=>{n=e,window.parent.postMessage("rejump_to_topic","*"),setTimeout(()=>{t(Error("Parent rejump timed out after 5 seconds"))},5e3)})}catch(u){console.error(u)}n=null;let b=0;if(!p)for(;b<100;){let m=y(s);if(m!==d)break;b++,await c(50)}b>=100&&console.error("Iframe Debug: Timed out waiting for playhead to move.");let $=document.querySelector(e.playButton);if(!$)return console.error("Babel Iframe ERROR: Sequence failed. Could not find the Play button after resetting the audio. Check SELECTORS.playButton.");if($){let v=f(e.scrollWindowPath),S=f(e.playheadPath);if(v&&S){if(a.isCompressedMode)await g(v,0,t.SCROLL_DURATION_MS);else{let _,w=0;for(;w<20&&!((_=y(S))>1);)w++,await c(50);if(_>1){let x=_-50;await g(v,Math.max(0,x),t.SCROLL_DURATION_MS)}else console.error("Iframe Debug: FAILED to get a valid playhead position (Untrimmed). Scrolling to start as a fallback."),await g(v,0,t.SCROLL_DURATION_MS)}}await c(50),await new Promise(e=>{if("visible"===document.visibilityState)e();else{let t=()=>{"visible"===document.visibilityState&&(document.removeEventListener("visibilitychange",t),e())};document.addEventListener("visibilitychange",t)}});let E="suspended"===function e(){if(window.__BABEL_TOOLS__&&window.__BABEL_TOOLS__.nodes.length>0)return window.__BABEL_TOOLS__.nodes[0].context.state;try{let t=window.AudioContext||window.webkitAudioContext;if(!t)return"running";let a=new t,n=a.state;return a.close(),n}catch(i){return"running"}}(),C=!navigator.userActivation||navigator.userActivation.hasBeenActive;if(E||!C){console.warn("Babel: Audio blocked (Suspended or No Activation). Sequence aborted to prevent Ghost Play."),a.isPerformingSequence=!1;return}if(a.isCompressedMode!==i)return;let R=o();if(R)R.isPlaying||R.onPlayPause();else{let A=document.querySelector(e.playButton);A&&(A.click(),A.blur())}k()}else console.error("Iframe Debug: Could not find Play button in sequence. Check SELECTORS.playButton.")}finally{a.isPerformingSequence=!1}}function v(e="00:00"){let t=String(e).split(":").map(Number);return t.some(isNaN)?(console.error(`TIMER DEBUG: timeToSeconds failed to parse. Input "${e}" resulted in NaN.`),0):2===t.length?60*t[0]+t[1]:(console.error(`TIMER DEBUG: timeToSeconds failed to split. Input "${e}" did not have a colon.`),0)}function k(){let t=document.querySelector(e.timerDisplay);if(!t)return;let n=t.textContent.split("/");if(n.length<2)return;let i=n[0].trim(),r=n[1].trim();if(a.isCompressedMode){let o=v(r),l=o/60;a.lastCalculatedMinutes=l,console.log(`🕰️ (Trimmed) Duration: ${l.toFixed(2)} minutes.`),S()}else{let s=v(i),d=v(r),c=(d-s)/60;isNaN(c)||(a.lastCalculatedMinutes=c,console.log(`🕰️ Calculated Duration: ${c.toFixed(2)} minutes.`))}}function S(){0===a.lastCalculatedMinutes&&console.error("Iframe Debug: Sending duration to parent, but the calculated value is still 0. The calculation likely failed or was never triggered."),window.parent.postMessage({type:"work_duration_response",minutes:a.lastCalculatedMinutes},"*")}let _=null,w=!1,x=new MutationObserver(()=>{if(_&&!_.isConnected&&(_=null),_)return;let l=document.querySelector(e.pannerSlider1),u=document.querySelector(e.pannerSlider2),f=document.querySelector(e.zoomSlider),m=document.querySelector(e.cursorLine_mainContainer);l&&u&&f&&m&&(w?a.zoomSliderElement=f:(a.zoomSliderElement=f,function t(){let l=new MutationObserver((t,n)=>{let i=document.querySelector(e.refreshButton);i&&(i.addEventListener("click",e=>{let t=a.isMac?e.metaKey:e.ctrlKey;t&&a.settings.enhancedReset&&(e.preventDefault(),e.stopPropagation(),$())}),n.disconnect())});l.observe(document.body,{childList:!0,subtree:!0}),document.addEventListener("keydown",t=>{let n=t.target,i=n&&n.getAttribute("role"),r=!1;if("INPUT"===n.tagName)["range","checkbox","radio","button","submit","reset","color","file","image"].includes(n.type)?(n.blur(),t.preventDefault()):r=!0;else if("TEXTAREA"===n.tagName||n.isContentEditable)r=!0;else if("searchbox"===i||"combobox"===i||"textbox"===i){let l=n.querySelector('input[type="range"], input[type="checkbox"], input[type="radio"]');l?(n.blur(),t.preventDefault()):r=!0}if(r)return;if(n&&"function"==typeof n.blur&&n.blur(),"{"===t.key||"}"===t.key){t.preventDefault(),t.stopImmediatePropagation();let s="{"===t.key?"[":"]",d="{"===t.key?"BracketLeft":"BracketRight",c=new KeyboardEvent("keydown",{key:s,code:d,shiftKey:!1,bubbles:!0,cancelable:!0});t.target.dispatchEvent(c);return}if("Space"===t.code){t.stopImmediatePropagation(),t.preventDefault();let p=o();if(p)p.onPlayPause();else{let u=document.querySelector(e.playButton);u&&(u.click(),u.blur())}return}if("Minus"===t.code||"Equal"===t.code){a.zoomKeyState[t.code]||(a.zoomKeyState[t.code]=!0,a.zoomKeyState.scrolled=!1),t.preventDefault(),t.stopImmediatePropagation();let f={type:"iframe_keydown",code:t.code};window.parent.postMessage(f,"*");return}if("Tab"===t.code&&!t.ctrlKey&&!t.altKey&&!t.metaKey){t.preventDefault(),t.stopImmediatePropagation(),window.parent.postMessage({type:"iframe_keydown",code:"Tab"},"*");return}let m=["ArrowDown"].includes(t.code),g=("Enter"===t.code||"NumpadEnter"===t.code)&&(t.ctrlKey||t.metaKey),y=(t.ctrlKey||t.metaKey)&&("ArrowLeft"===t.code||"ArrowRight"===t.code);(m||g||y)&&(t.preventDefault(),t.stopPropagation()),["Numpad0","Numpad1","Numpad2","Numpad4","Numpad5","Numpad6","Numpad7","Numpad8","NumpadDivide","NumpadMultiply"].includes(t.code)&&(t.preventDefault(),t.stopImmediatePropagation());let h={type:"iframe_keydown",code:t.code};window.parent.postMessage(h,"*"),b(t)},!0),document.addEventListener("keyup",e=>{("Minus"===e.code||"Equal"===e.code)&&(a.zoomKeyState[e.code]=!1,a.zoomKeyState.scrolled?s():"Equal"===e.code?p("in"):"Minus"===e.code&&p("out"),a.zoomKeyState.scrolled=!1);let t={type:"iframe_keyup",code:e.code};window.parent.postMessage(t,"*")}),document.addEventListener("wheel",e=>{(a.zoomKeyState.Minus||a.zoomKeyState.Equal)&&(e.preventDefault(),e.stopImmediatePropagation(),a.zoomKeyState.scrolled=!0,d(e.deltaY))},{passive:!1,capture:!0}),window.addEventListener("message",async t=>{if(t.data&&"babel_settings"===t.data.type)a.settings=Object.assign({},a.settings,t.data.settings),document.documentElement.classList.toggle("babel-cursor-line-enabled",a.settings.cursorLine),i&&(i.style.display=a.settings.cursorLine?"block":"none",r.style.display=a.settings.cursorLine?"block":"none");else if(t.data&&"parent_keyup"===t.data.type)("Minus"===t.data.code||"Equal"===t.data.code)&&(a.zoomKeyState[t.data.code]=!1,a.zoomKeyState.scrolled?s():"Equal"===t.data.code?p("in"):"Minus"===t.data.code&&p("out"),a.zoomKeyState.scrolled=!1);else if(t.data&&"parent_wheel"===t.data.type)(a.zoomKeyState.Minus||a.zoomKeyState.Equal)&&(a.zoomKeyState.scrolled=!0,d(t.data.deltaY));else if("get_current_time"===t.data){let o=document.querySelector(e.timerDisplay);if(o&&o.textContent.includes("/")){let l=o.textContent.split("/")[0].trim(),u=l.split(":").map(Number);if(2===u.length){let f=60*u[0]+u[1];f=Math.max(0,f);let m=Math.floor(f/60),g=f%60,y=String(m).padStart(2,"0")+":"+String(g.toFixed(3)).padStart(6,"0");window.parent.postMessage({type:"current_time_response",time:y},"*")}}}else if(t.data&&"parent_keydown"===t.data.type){let v=t.data;if("Minus"===v.code||"Equal"===v.code){a.zoomKeyState[v.code]||(a.zoomKeyState[v.code]=!0,a.zoomKeyState.scrolled=!1);return}if(["Space","ArrowLeft","ArrowRight","BracketLeft","BracketRight","Quote","Backslash"].includes(v.code)){if("{"===v.key||"}"===v.key){let _="{"===v.key?"[":"]",w="{"===v.key?"BracketLeft":"BracketRight",x=new KeyboardEvent("keydown",{key:_,code:w,shiftKey:!1,bubbles:!0,cancelable:!0});document.dispatchEvent(x),setTimeout(()=>{document.activeElement&&document.activeElement!==document.body&&document.activeElement.blur()},0)}else if(["Space","ArrowLeft","ArrowRight","BracketLeft","BracketRight"].includes(v.code)){let E=v.shiftKey,C=v.key;"BracketLeft"===v.code&&(C="[",E=!1),"BracketRight"===v.code&&(C="]",E=!1);let R=new KeyboardEvent("keydown",{key:C,code:v.code,shiftKey:E,bubbles:!0,cancelable:!0});document.dispatchEvent(R),setTimeout(()=>{document.activeElement&&document.activeElement!==document.body&&document.activeElement.blur()},0)}}else b(t.data)}else if("start_sequence"===t.data)$();else if("rejump_complete"===t.data||t.data&&"rejump_complete"===t.data.type){let A=t.data&&!0===t.data.skipped;a.isCompressedMode=A,n&&n(A)}else if("wait_for_audio_and_report_back"===t.data)await h(),await c(200),window.parent.postMessage("audio_is_ready","*");else if("babel_new_conference"===t.data||t.data&&"babel_new_conference"===t.data.type)a.lastCalculatedMinutes=0,void 0!==t.data.isTrimmed&&(a.isCompressedMode=t.data.isTrimmed),a.isCompressedMode&&!a.isPerformingSequence&&h().then(()=>{k()}).catch(e=>console.warn("Babel: Sequence aborted (New Conference):",e));else if(t.data&&"babel_toggle_update"===t.data.type)a.isCompressedMode=t.data.isTrimmed,a.toggleUpdateTimer&&clearTimeout(a.toggleUpdateTimer),a.isPerformingSequence=!1,a.toggleUpdateTimer=setTimeout(()=>{h().then(()=>{$()}).catch(e=>console.warn("Babel: Sequence aborted (Toggle Update):",e))},300);else if("get_work_duration"===t.data)0===a.lastCalculatedMinutes||isNaN(a.lastCalculatedMinutes)?a.durationRetries<3?(a.durationRetries++,console.warn(`Iframe Debug: Duration is 0 (Attempt ${a.durationRetries}). Attempting 'Jump to Topic' fallback...`),a.lastCalculatedMinutes=0,a.hasAttemptedDurationFallback=!0,window.parent.postMessage({type:"babel_force_jump_for_duration"},"*")):(console.error(`Iframe Debug: Duration calculation FAILED after ${a.durationRetries} retries. Sending duration 0.`),S(),a.durationRetries=0):(S(),a.durationRetries=0);else if("calculate_duration_on_jump"===t.data){if(!a.isPerformingSequence)try{await new Promise((t,n)=>{a.timerObserver&&(a.timerObserver.disconnect(),a.timerObserver=null);let i=document.querySelector(e.timerDisplay),r=document.querySelector(e.timerContainer);if(!i||!r){console.error("Iframe: Cannot wait for timer change, elements missing."),n();return}let o=i.textContent,l=new MutationObserver(()=>{let e=i.textContent;if(e!==o&&e.includes("/")){let n=e.split("/"),r=n[0].trim(),s=n[1].trim(),d;(d=a.isCompressedMode?("00:00"===r||"0:00"===r)&&"00:00"!==s:"00:00"!==r&&"0:00"!==r)&&(l.disconnect(),k(),t())}});a.timerObserver=l,l.observe(r,{childList:!0,subtree:!0,characterData:!0}),setTimeout(()=>{l.disconnect(),t()},5e3)}),a.hasAttemptedDurationFallback&&(a.hasAttemptedDurationFallback=!1)}catch(L){console.error("[DEBUG FAIL] Iframe: Error during 'calculate_duration_on_jump'",L),a.hasAttemptedDurationFallback&&(a.hasAttemptedDurationFallback=!1)}}else t.data&&"os_info"===t.data.type&&(a.isMac=t.data.isMac)})}(),w=!0,window.parent.postMessage({type:"iframe_ready"},"*")),function e(n){let o=[],l=null,s=new ResizeObserver(()=>{o=[],l=n.getBoundingClientRect();let e=l;i.style.top=`${e.top}px`,i.style.height=`${e.height}px`;let t=n.querySelectorAll(":scope > div");t.forEach(e=>{let t=e.querySelector(".spectrogram-container"),a=e.querySelector(".waveform-container");if(t&&a){let n=t.getBoundingClientRect(),i=a.getBoundingClientRect();o.push({top:Math.min(n.top,i.top),bottom:Math.max(n.bottom,i.bottom),left:Math.min(n.left,i.left),right:Math.max(n.right,i.right)})}})});s.observe(n),n.addEventListener("mouseenter",()=>{a.settings.cursorLine&&(i.style.display="block",r.style.display="block")});let d=null;n.addEventListener("mousemove",e=>{if(!a.settings.cursorLine||d)return;let n=e.clientX,s=e.clientY;d=requestAnimationFrame(()=>{let e=null;for(let a=0;a<o.length;a++){let c=o[a];if(s>=c.top&&s<=c.bottom&&n>=c.left&&n<=c.right){e=!0;break}}e?(r.style.transition="box-shadow 0.3s ease, border-color 0.3s ease",r.style.boxShadow=`0 0 2px 2px ${t.CURSOR_GLOW_SHADOW_COLOR}`,r.style.borderColor=t.CURSOR_GLOW_BORDER_COLOR):(r.style.boxShadow=`0 0 2px 2px ${t.CURSOR_GLOW_SHADOW_COLOR}`,r.style.borderColor=t.CURSOR_GLOW_BORDER_COLOR);let p=l;if(!p){d=null;return}i.style.transform=`translateX(${n+t.CURSOR_LINE_X_OFFSET}px)`,r.style.left=`${n-3.25}px`,s>=p.top&&s<=p.bottom&&(r.style.top=`${s-6}px`),d=null})})}(m),_=m)});x.observe(document.body,{childList:!0,subtree:!0})}();