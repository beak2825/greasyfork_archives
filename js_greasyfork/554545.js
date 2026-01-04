// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-11-02
// @description  Im using this script to learn new things
// @author       You
// @match        https://janitorai.com/chats/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=janitorai.com
// @grant        GM_webRequest
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/554545/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/554545/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockedSelector = 'https://assets.janitorai.com/SkeletonLoader-B3nIIU2O.css';

    GM_webRequest([
        { selector: blockedSelector, action: 'cancel' },
    ], (info, message, details) => {
       console.log('GET request to blocked URL blocked:', info, message, details);
    });

    const customCSS = `
/* Fuente global de Discord - GG Sans */
* { font-family: "GG Sans", sans-serif !important; }

._chatInputContainer_14uqx_1 {
    position: fixed;
    bottom: 0;
    z-index: 10;
    width: 100%;
    padding-left: 0;
    padding-right: 0
}

@media (min-width: 768px) {
    ._chatInputContainer_14uqx_1 {
        padding-left:1rem;
        padding-right: 1rem
    }
}

._chatInputWrapper_14uqx_17 {
    display: flex;
    justify-content: center;
    padding-bottom: .5rem;
    background: transparent
}

@media (min-width: 768px) {
    ._chatInputWrapper_14uqx_17 {
        padding-bottom:1.5rem
    }
}

._chatInputInner_14uqx_30 {
    display: flex;
    width: 100%;
    max-width: 42rem;
    margin-left: .5rem;
    margin-right: .5rem;
    background: transparent;
    border: 0px solid #805ad5;
    border-radius: .5rem;
    position: relative
}

@media (min-width: 768px) {
    ._chatInputInner_14uqx_30 {
        margin-left:0;
        margin-right: 0
    }
}

@property --a {
    syntax: "<angle>";
    inherits: false;
    initial-value: 90deg;
}

._prideRainbowBorder_14uqx_57 {
    border: none;
    background: #ffffff
}

._prideRainbowBorder_14uqx_57:before,._prideRainbowBorder_14uqx_57:after {
    content: "";
    display: block;
    position: absolute;
    inset: -.15rem;
    border-radius: .7rem;
    --a: 0deg;
    background-image: conic-gradient(from var(--a) at 50% 50% in oklch longer hue,oklch(70% .3 0) 0%,oklch(70% .3 0) 100%);
    animation: _animatedBgAngle_14uqx_1 5s linear;
    animation-iteration-count: infinite
}

._prideRainbowBorder_14uqx_57:before {
    z-index: -1
}

._prideRainbowBorder_14uqx_57:after {
    z-index: -2;
    filter: blur(10px);
    opacity: .35
}

@supports not (background-image: conic-gradient(from 0deg at 50% 50% in oklch longer hue,oklch(70% .3 0) 0%,oklch(70% .3 0) 100%)) {
    ._prideRainbowBorder_14uqx_57:before,._prideRainbowBorder_14uqx_57:after {
        background-image:conic-gradient(from var(--a) at 50% 50%,rgba(255,0,0,1) 0%,rgba(255,154,0,1) 10%,rgba(208,222,33,1) 20%,rgba(79,220,74,1) 30%,rgba(63,218,216,1) 40%,rgba(47,201,226,1) 50%,rgba(28,127,238,1) 60%,rgba(95,21,242,1) 70%,rgba(186,12,248,1) 80%,rgba(251,7,217,1) 90%,rgba(255,0,0,1) 100%)
    }
}

@keyframes _animatedBgAngle_14uqx_1 {
    0% {
        --a: 0deg
    }

    to {
        --a: 360deg
    }
}

._stopButton_17cr1_1 {
    position: absolute;
    right: .5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 6px;
    border: 1px solid rgba(255,100,100,.4);
    background: #ff64641a;
    color: #ff7878e6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .15s ease;
    font-size: .875rem;
    z-index: 10
}

._stopButton_17cr1_1:hover {
    background: #ff646426;
    border-color: #ff646499;
    color: #ff7878
}

@media (prefers-reduced-motion: reduce) {
    ._stopButton_17cr1_1 {
        animation: none
    }
}

._menuButton_17cr1_32 {
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.75rem;
    height: 1.75rem;
    color: #946ee9;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: all .15s ease;
    z-index: 10
}

._menuButton_17cr1_32:hover {
    background: #5b5a63;
    border-color: #805ad599;
    color: #946ee9
}

._popoverContainer_17cr1_48 {
    position: relative;
    display: inline-block
}

._popoverContent_17cr1_53 {
    position: absolute;
    bottom: 100%;
    left: 0;
    margin-bottom: .5rem;
    width: 180px;
    display: none;
    z-index: 20
}

._popoverContent_17cr1_53._open_17cr1_63 {
    display: block
}

._popoverInner_17cr1_67 {
    background: #80808033;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,.1)
}

._popoverList_17cr1_75 {
    margin: 0;
    list-style-type: none;
    font-family: "GG Sans",sans-serif
}

._enhanceButton_17cr1_81 {
    width: 100%;
    display: flex;
    border: 0;
    background: transparent;
    padding: .5rem;
    margin: 0;
    font-family: "GG Sans",sans-serif;
    font-weight: 700;
    color: #ffffffe6;
    cursor: pointer;
    border-radius: 6px;
    font-size: .875rem;
    transition: background-color .2s ease
}

._enhanceButton_17cr1_81:hover:not(:disabled) {
    background: #ffffff1a
}

._enhanceButton_17cr1_81:disabled {
    opacity: .5;
    cursor: not-allowed
}

._sendButton_17cr1_106 {
    position: absolute;
    right: .5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.75rem;
    height: 1.75rem;
    background: #none;
    border: none;
    color: #946ee9;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: all .15s ease;
    font-size: .875rem;
    z-index: 10
}

._sendButton_17cr1_106:hover:not(:disabled) {
    background: none;
    border-color: none;
    color: #946ee9
}

._sendButton_17cr1_106:active:not(:disabled) {
    background: #805ad540
}

._sendButton_17cr1_106:disabled {
     display:none
}

._frameContainer_mce39_1 {
    position: absolute;
    pointer-events: none;
    z-index: 4
}

._frameContainer_mce39_1._right_mce39_7 {
    top: -43px;
    right: -26px
}

._frameContainer_mce39_1._left_mce39_12 {
    bottom: -25px;
    left: -17px
}

._frameImage_mce39_17 {
    width: 210px;
    height: auto;
    display: block
}

._chatTextarea_dzva7_1 {
    flex: 1;
    width: 100%;
    padding: 1rem 2.5rem 1rem 3rem;
    border-radius: .5rem;
    background: #393a41;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    border: none;
    resize: none;
    overflow: auto;
    font-family: inherit;
    font-size: inherit;
    line-height: 1.5;
    color: inherit;
    outline: none;
    transition: border-color .2s;
    box-shadow: 0 10px 5px none;
    touch-action: manipulation;
    height: 56px !important;
}

._chatTextarea_dzva7_1:focus {
    outline: none;
    border-color: #ae99ff
}

._chatTextarea_dzva7_1:disabled {
    opacity: .6;
    cursor: not-allowed
}

._chatTextarea_dzva7_1::placeholder {
    color: #ffffff80
}

._chatLayoutWrapper_tront_1 {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100vh
}

._chatLayoutContainer_tront_8 {
    display: grid;
    padding-top: 0;
    height: 100vh;
    align-content: space-between;
    width: 100%;
    background: #323339;
    position: relative
}

._chatLayoutBackground_tront_18 {
    width: 100%;
    height: 100%;
    position: absolute;
    background-size: cover;
    background-position: center;
    filter: blur(var(--blur-amount, 0px))
}

._deniedMessageText_146hx_1 {
    text-align: center;
    padding: 2rem;
    font-size: 1rem
}

._deniedMessageText_146hx_1 a {
    color: #805ad5;
    text-decoration: underline
}

._deniedMessageText_146hx_1 a:hover {
    color: #6b46c1
}

._srOnly_1k67a_4 {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0
}

._accordionContainer_1k67a_17 {
    position: relative;
    width: 100%
}

._accordionPanel_1k67a_23 {
    position: absolute;
    left: 50%;
    width: calc(100vw - 2rem);
    max-width: 500px;
    background: #2e2e2e;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 12px;
    box-shadow: 0 8px 32px #0000004d,inset 0 1px #ffffff1a;
    z-index: 20;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transform: translate(-50%) translateY(-10px);
    transition: all .3s cubic-bezier(.4,0,.2,1)
}

._accordionPanel_1k67a_23._expanded_1k67a_43 {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%) translateY(0)
}

._panelContent_1k67a_50 {
    padding: 1.25rem;
    max-height: 50vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,.2) transparent
}

._panelContent_1k67a_50::-webkit-scrollbar {
    width: 6px
}

._panelContent_1k67a_50::-webkit-scrollbar-track {
    background: transparent
}

._panelContent_1k67a_50::-webkit-scrollbar-thumb {
    background: #fff3;
    border-radius: 3px
}

._panelContent_1k67a_50::-webkit-scrollbar-thumb:hover {
    background: #ffffff4d
}

@media (min-width: 768px) {
    ._panelContent_1k67a_50 {
        padding:1.5rem
    }
}

@media (max-width: 768px) {
    ._accordionPanel_1k67a_23 {
        width:calc(100vw - 1rem)
    }

    ._panelContent_1k67a_50 {
        padding: 1rem;
        max-height: 45vh
    }
}

@media (max-width: 480px) {
    ._accordionPanel_1k67a_23 {
        width:calc(100vw - .5rem)
    }

    ._panelContent_1k67a_50 {
        padding: .875rem;
        max-height: 40vh
    }
}

@media (prefers-reduced-motion: reduce) {
    ._accordionPanel_1k67a_23 {
        transition: none
    }
}

@media (prefers-contrast: high) {
    ._accordionPanel_1k67a_23 {
        border: 2px solid rgba(255,255,255,.2);
        background: #000000e6
    }
}

._alertOverlay_1gk2a_1 {
    position: fixed;
    inset: 0;
    background-color: #000000b3;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000000;
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px)
}

._alertContainer_1gk2a_15 {
    background: linear-gradient(135deg,#1a1a1a,#2d2d2d);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px #0000001a,0 10px 10px -5px #0000000a;
    max-width: 28rem;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    animation: _alertDialogIn_1gk2a_1 .2s ease-out
}

._alertContent_1gk2a_29 {
    display: flex;
    flex-direction: column
}

._alertHeader_1gk2a_34 {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,.1);
    font-family: "GG Sans",sans-serif
}

._alertTitle_1gk2a_40 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #fffffff2;
    margin: 0
}

._alertBody_1gk2a_47 {
    padding: 1.5rem;
    color: #ffffffe6;
    font-size: .875rem;
    font-weight: 500;
    line-height: 1.5
}

._alertFooter_1gk2a_55 {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255,255,255,.1);
    display: flex;
    gap: .75rem;
    justify-content: flex-end
}

._alertButton_1gk2a_63 {
    padding: .5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    font-size: .875rem;
    cursor: pointer;
    transition: all .2s ease;
    border: none;
    min-width: 80px
}

._alertButton_1gk2a_63._cancel_1gk2a_74 {
    background: #ffffff0d;
    color: #ffffffe6;
    border: 1px solid rgba(255,255,255,.16)
}

._alertButton_1gk2a_63._cancel_1gk2a_74:hover {
    background: #ffffff1a;
    transform: translateY(-1px)
}

._alertButton_1gk2a_63._confirm_1gk2a_85 {
    background: var(--purple-600, #6b46c1);
    color: #fff
}

._alertButton_1gk2a_63._confirm_1gk2a_85:hover {
    background: var(--purple-700, #553c9a);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px #6b46c14d
}

._alertButton_1gk2a_63:active {
    transform: scale(.98)
}

@keyframes _alertDialogIn_1gk2a_1 {
    0% {
        opacity: 0;
        transform: scale(.95)
    }

    to {
        opacity: 1;
        transform: scale(1)
    }
}

@media (max-width: 480px) {
    ._alertContainer_1gk2a_15 {
        width:95%;
        margin: 1rem
    }

    ._alertHeader_1gk2a_34,._alertBody_1gk2a_47 {
        padding: 1.25rem
    }

    ._alertFooter_1gk2a_55 {
        padding: 1rem;
        flex-direction: column-reverse
    }

    ._alertButton_1gk2a_63 {
        width: 100%
    }
}

@media (prefers-reduced-motion: reduce) {
    ._alertContainer_1gk2a_15 {
        animation: none
    }
}

@media (prefers-contrast: high) {
    ._alertContainer_1gk2a_15 {
        border: 2px solid white
    }

    ._alertButton_1gk2a_63:focus {
        outline: 2px solid white;
        outline-offset: 2px
    }
}

._modalHeader_gr49m_1 {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,.1)
}

._heading_gr49m_6 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 .5rem;
    font-family: "GG Sans",sans-serif;
    color: #fffffff2
}

._modalBody_gr49m_14 {
    padding: 1.5rem;
    overflow-y: auto;
    max-height: 70vh
}

._modalContent_gr49m_20 {
    display: flex;
    flex-direction: column;
    gap: 1.5rem
}

._radioGroup_gr49m_26 {
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
    align-items: flex-start;
    justify-content: flex-start
}

._helpText_gr49m_35 {
    margin-top: .75rem;
    font-size: .875rem;
    color: #ffffffb3
}

._strongText_gr49m_41 {
    font-weight: 600
}

._modalFooter_gr49m_45 {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255,255,255,.1);
    display: flex;
    gap: .75rem;
    justify-content: flex-end
}

._button_gr49m_53 {
    padding: .5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    font-size: .875rem;
    cursor: pointer;
    transition: all .2s ease;
    min-width: 100px;
    border: 1px solid rgba(255,255,255,.16)
}

._button_gr49m_53._ghost_gr49m_64 {
    background: transparent;
    color: #ffffffe6
}

._button_gr49m_53._ghost_gr49m_64:hover {
    background: #ffffff0d;
    transform: translateY(-1px)
}

._button_gr49m_53._primary_gr49m_74 {
    background: transparent;
    color: #ffffffe6;
    border-color: var(--purple-600, #6b46c1)
}

._button_gr49m_53._primary_gr49m_74:hover {
    background: #6b46c11a;
    transform: translateY(-1px)
}

._button_gr49m_53:active {
    transform: scale(.98)
}

._button_gr49m_53:disabled {
    opacity: .6;
    cursor: not-allowed;
    transform: none
}

._button_gr49m_53:disabled:hover {
    background: transparent;
    transform: none
}

._editingWarning_gr49m_100 {
    margin: 0 auto 0 0;
    color: #fbbf24;
    font-size: .875rem;
    font-weight: 500;
    display: flex;
    align-items: center
}

@media (max-width: 768px) {
    ._modalHeader_gr49m_1,._modalBody_gr49m_14 {
        padding:1.25rem
    }

    ._radioGroup_gr49m_26 {
        gap: .75rem
    }

    ._modalFooter_gr49m_45 {
        padding: 1rem;
        flex-direction: column-reverse
    }

    ._button_gr49m_53 {
        width: 100%
    }
}

@media (max-width: 480px) {
    ._heading_gr49m_6 {
        font-size:1.125rem
    }

    ._modalBody_gr49m_14 {
        max-height: 60vh
    }
}

@media (prefers-contrast: high) {
    ._button_gr49m_53:focus {
        outline: 2px solid white;
        outline-offset: 2px
    }
}

._formControl_1mhqu_1 {
    display: flex;
    flex-direction: column;
    gap: .5rem
}

._label_1mhqu_7 {
    font-size: .875rem;
    font-weight: 500;
    color: #ffffffe6;
    margin: 0
}

._radioGroup_1mhqu_14 {
    display: flex;
    gap: 1rem;
    align-items: center;
    max-width: 75%
}

._radioLabel_1mhqu_21 {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    cursor: pointer;
    color: #ffffffe6;
    font-size: .875rem
}

._radioInput_1mhqu_30 {
    width: 16px;
    height: 16px;
    accent-color: var(--purple-600, #6b46c1);
    cursor: pointer
}

._select_1mhqu_37 {
    max-width: 75%;
    padding: .5rem .75rem;
    background: #ffffff0d;
    border: 1px solid var(--purple-500, #805ad5);
    border-radius: 6px;
    color: #fff;
    font-size: .875rem;
    transition: all .2s ease;
    cursor: pointer
}

._select_1mhqu_37:focus {
    outline: none;
    border-color: var(--purple-400, #9f7aea);
    background: #ffffff14;
    box-shadow: 0 0 0 3px #9f7aea1a
}

._select_1mhqu_37 option {
    background: #1a1a1a;
    color: #fff
}

._input_1mhqu_61 {
    padding: .5rem .75rem;
    background: #ffffff0d;
    border: 1px solid var(--purple-500, #805ad5);
    border-radius: 6px;
    color: #fff;
    font-size: .875rem;
    transition: all .2s ease
}

._input_1mhqu_61:focus {
    outline: none;
    border-color: var(--purple-400, #9f7aea);
    background: #ffffff14;
    box-shadow: 0 0 0 3px #9f7aea1a
}

._input_1mhqu_61::placeholder {
    color: #fff6
}

@media (max-width: 768px) {
    ._radioGroup_1mhqu_14,._select_1mhqu_37 {
        max-width:100%
    }

    ._radioGroup_1mhqu_14 {
        flex-direction: column;
        align-items: flex-start;
        gap: .5rem
    }
}

@media (prefers-contrast: high) {
    ._select_1mhqu_37,._input_1mhqu_61 {
        border: 2px solid currentColor
    }

    ._select_1mhqu_37:focus,._input_1mhqu_61:focus {
        outline: 2px solid white;
        outline-offset: 2px
    }
}

._container_jh88z_3 {
    display: flex;
    flex-direction: column
}

._heading_jh88z_8 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: #fffffff2;
    font-family: "GG Sans",sans-serif
}

._subHeading_jh88z_16 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: #ffffffe6
}

._formControl_jh88z_23 {
    display: flex;
    flex-direction: column;
    gap: .5rem
}

._label_jh88z_29 {
    font-size: .875rem;
    font-weight: 500;
    color: #ffffffe6;
    margin-top: .5rem
}

._input_jh88z_36 {
    width: 100%;
    padding: .5rem .75rem;
    background: #ffffff0d;
    border: 1px solid var(--purple-500, #805ad5);
    border-radius: 6px;
    color: #fff;
    font-size: .875rem;
    transition: all .2s ease
}

._input_jh88z_36:focus {
    outline: none;
    border-color: var(--purple-400, #9f7aea);
    background: #ffffff14;
    box-shadow: 0 0 0 3px #9f7aea1a
}

._input_jh88z_36::placeholder {
    color: #fff6
}

._helpText_jh88z_58 {
    color: #fff9;
    font-size: .875rem;
    margin: 0;
    line-height: 1.5
}

._errorText_jh88z_65 {
    color: #ef4444;
    font-size: .875rem;
    margin: 0
}

._warningText_jh88z_71 {
    color: #f59e0b;
    font-size: .875rem;
    margin: 0
}

._successText_jh88z_77 {
    color: #10b981;
    font-size: .875rem;
    margin: 0
}

._link_jh88z_83 {
    color: var(--purple-500, #805ad5);
    text-decoration: underline;
    transition: color .2s ease
}

._link_jh88z_83:hover {
    color: var(--purple-400, #9f7aea)
}

._strongText_jh88z_93 {
    font-weight: 600
}

._presetButtons_jh88z_97 {
    display: flex;
    flex-wrap: wrap;
    gap: .25rem;
    margin-top: .5rem
}

._presetButton_jh88z_97 {
    padding: .375rem .75rem;
    font-size: .875rem;
    background: #ffffff0d;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 4px;
    color: #ffffffe6;
    cursor: pointer;
    transition: all .2s ease
}

._presetButton_jh88z_97:hover {
    background: #ffffff1a;
    border-color: #ffffff4d
}

._presetButton_jh88z_97:active {
    transform: scale(.98)
}

._advancedButton_jh88z_124 {
    padding: .375rem .75rem;
    font-size: .875rem;
    background: #ffffff0d;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 4px;
    color: #ffffffe6;
    cursor: pointer;
    transition: all .2s ease;
    font-weight: 500;
    align-self: flex-start;
    margin-top: .5rem
}

._advancedButton_jh88z_124:hover {
    background: #ffffff1a;
    transform: translateY(-1px)
}

._checkButton_jh88z_143 {
    padding: .5rem 1rem;
    background: var(--purple-600, #6b46c1);
    border: none;
    border-radius: 6px;
    color: #fff;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s ease;
    min-width: 150px;
    position: relative;
    overflow: hidden
}

._checkButton_jh88z_143:hover:not(:disabled) {
    background: var(--purple-700, #553c9a);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px #6b46c14d
}

._checkButton_jh88z_143:disabled {
    opacity: .6;
    cursor: not-allowed
}

._checkButton_jh88z_143._loading_jh88z_168:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border: 2px solid transparent;
    border-top-color: #fff;
    border-radius: 50%;
    animation: _spin_jh88z_1 .8s linear infinite
}

._checkButton_jh88z_143._loading_jh88z_168 {
    color: transparent
}

@keyframes _spin_jh88z_1 {
    to {
        transform: rotate(360deg)
    }
}

@media (max-width: 768px) {
    ._container_jh88z_3 {
        gap:1rem
    }

    ._heading_jh88z_8 {
        font-size: 1rem
    }

    ._checkButton_jh88z_143 {
        width: 100%
    }

    ._presetButtons_jh88z_97 {
        gap: .5rem
    }

    ._presetButton_jh88z_97 {
        font-size: .8rem;
        padding: .3rem .6rem
    }
}

._solidgaterBanner_jh88z_217 {
    background: linear-gradient(135deg,#9333ea1a,#ec48991a);
    border: 1px solid transparent;
    background-origin: border-box;
    background-clip: padding-box,border-box;
    position: relative;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    overflow: hidden;
    animation: _solidgaterGlow_jh88z_1 3s ease-in-out infinite
}

._solidgaterBanner_jh88z_217:before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,#9333ea4d,#ec48994d);
    border-radius: 8px;
    padding: 1px;
    -webkit-mask: linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: _solidgaterBorderRotate_jh88z_1 4s linear infinite
}

@keyframes _solidgaterGlow_jh88z_1 {
    0%,to {
        box-shadow: 0 0 20px #9333ea4d,0 0 40px #ec489933
    }

    50% {
        box-shadow: 0 0 30px #9333ea66,0 0 60px #ec48994d
    }
}

@keyframes _solidgaterBorderRotate_jh88z_1 {
    0% {
        background: linear-gradient(135deg,#9333ea4d,#ec48994d)
    }

    25% {
        background: linear-gradient(225deg,#ec48994d,#9333ea4d)
    }

    50% {
        background: linear-gradient(315deg,#9333ea4d,#ec48994d)
    }

    75% {
        background: linear-gradient(45deg,#ec48994d,#9333ea4d)
    }

    to {
        background: linear-gradient(135deg,#9333ea4d,#ec48994d)
    }
}

._solidgaterHeader_jh88z_308 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .5rem
}

._solidgaterBadge_jh88z_315 {
    font-size: 1.125rem;
    font-weight: 700;
    background: linear-gradient(135deg,#9333ea,#ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: "GG Sans",sans-serif;
    letter-spacing: .5px
}

._contextLength_jh88z_326 {
    padding: .25rem .75rem;
    background: #9333ea33;
    border: 1px solid rgba(147,51,234,.3);
    border-radius: 20px;
    font-size: .875rem;
    font-weight: 600;
    color: #e9d5ff;
    animation: _pulse_jh88z_1 2s ease-in-out infinite
}

@keyframes _pulse_jh88z_1 {
    0%,to {
        transform: scale(1);
        opacity: 1
    }

    50% {
        transform: scale(1.05);
        opacity: .9
    }
}

._solidgaterText_jh88z_349 {
    font-size: .875rem;
    color: #e9d5ffe6;
    font-weight: 500
}

@media (prefers-contrast: high) {
    ._input_jh88z_36,._checkButton_jh88z_143,._advancedButton_jh88z_124,._presetButton_jh88z_97 {
        border: 2px solid currentColor
    }

    ._input_jh88z_36:focus {
        outline: 2px solid white;
        outline-offset: 2px
    }
}

._container_waqi9_2 {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 100%
}

._headerSection_waqi9_11 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .5rem
}

._heading_waqi9_18 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: #fffffff2;
    font-family: "GG Sans",sans-serif
}

._addNewButton_waqi9_26 {
    display: flex;
    align-items: center;
    gap: .375rem;
    padding: .375rem .75rem;
    background: transparent;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 6px;
    color: #ffffffb3;
    font-size: .825rem;
    font-weight: 400;
    cursor: pointer;
    transition: all .15s ease
}

._addNewButton_waqi9_26:hover {
    background: #ffffff0d;
    border-color: #fff3;
    color: #ffffffe6
}

._addIcon_waqi9_47 {
    font-size: 1rem;
    font-weight: 400
}

._configurationsList_waqi9_53 {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    margin-bottom: 1rem
}

._configItem_waqi9_60 {
    background: transparent;
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 8px;
    overflow: hidden;
    transition: all .2s ease;
    position: relative;
    display: flex;
    align-items: stretch;
    flex-direction: column
}

._configItem_waqi9_60:hover {
    border-color: #ffffff1f
}

._configItem_waqi9_60._selected_waqi9_76 {
    background: #6b46c114;
    border-color: #6b46c14d
}

._configItem_waqi9_60._dragging_waqi9_81 {
    opacity: .8;
    background: #6b46c133;
    border-color: #6b46c166;
    pointer-events: none;
    transform: scale(1.05);
    z-index: 100;
    cursor: grabbing
}

._configItemContent_waqi9_91 {
    padding: .875rem 1rem;
    cursor: pointer;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .5rem
}

._configItemHeader_waqi9_100 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%
}

._configItemName_waqi9_107 {
    font-size: .9rem;
    font-weight: 500;
    color: #ffffffe6
}

._activeIndicator_waqi9_113 {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--purple-500, #805ad5);
    color: #fff;
    padding: .1rem .75rem;
    font-size: .7rem;
    font-weight: 500;
    border-radius: 0 8px;
    text-transform: uppercase;
    letter-spacing: .05em
}

._configItemDetails_waqi9_127 {
    display: flex;
    align-items: center;
    gap: .75rem;
    font-size: .8rem;
    color: #ffffff80
}

._configItem_waqi9_60:hover ._configItemDetails_waqi9_127,._configItem_waqi9_60._selected_waqi9_76 ._configItemDetails_waqi9_127 {
    max-width: calc(100% - 21em)
}

._configItemModel_waqi9_140 {
    display: inline-flex;
    align-items: center;
    padding: .125rem .375rem;
    background: transparent;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 4px;
    color: #fff9;
    font-weight: 400;
    font-size: .7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
}

._configItemUrl_waqi9_155 {
    color: #fff6;
    font-family: SF Mono,Monaco,Inconsolata,Roboto Mono,Consolas,monospace;
    font-size: .7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1
}

._configItemActions_waqi9_166 {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: .5rem;
    opacity: 0;
    transition: opacity .2s ease;
    pointer-events: none
}

._configItemActions_waqi9_166._visible_waqi9_178 {
    opacity: 1;
    pointer-events: auto
}

._deleteButton_waqi9_183,._editButton_waqi9_184,._testButton_waqi9_185 {
    padding: .5rem .875rem;
    font-size: .825rem;
    font-weight: 500;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 6px;
    cursor: pointer;
    transition: all .15s ease;
    background: transparent
}

._deleteButton_waqi9_183 {
    color: #ffffffb3
}

._deleteButton_waqi9_183:hover {
    background: #ffffff0d;
    color: #ef4444e6;
    border: 1px solid rgba(239,68,68,.9)
}

._editButton_waqi9_184 {
    color: #ffffffb3
}

._editButton_waqi9_184:hover {
    background: #ffffff0d;
    color: #ffffffe6
}

._testButton_waqi9_185 {
    margin-right: .6rem;
    color: #ffffffb3
}

._testButton_waqi9_185:hover:not(:disabled) {
    background: #ffffff0d;
    color: #ffffffe6
}

._testButton_waqi9_185:disabled {
    opacity: .5;
    cursor: not-allowed
}

._reorderButtonsContainer_waqi9_230 {
    position: absolute;
    top: 1.3rem;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: .25rem;
    transition: opacity .2s ease
}

._reorderButton_waqi9_230 {
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: #ffffffb3;
    cursor: pointer;
    transition: all .15s ease;
    font-size: .75rem
}

._reorderButton_waqi9_230:hover {
    background: #ffffff0d
}

._formSection_waqi9_258 {
    background: #ffffff0d;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 16px #0003,inset 0 1px #ffffff1a
}

._formTitle_waqi9_268 {
    font-size: 1rem;
    font-weight: 600;
    color: #fffffff2;
    margin: 0 0 1.25rem
}

._formControl_waqi9_275 {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    margin-bottom: 1rem
}

._collapsedCustomPrompt_waqi9_282 {
    max-height: 10rem
}

._labelRow_waqi9_286 {
    display: flex;
    align-items: center;
    gap: .5rem;
    flex-wrap: wrap
}

._label_waqi9_286 {
    font-size: .875rem;
    font-weight: 500;
    color: #ffffffe6
}

._addButton_waqi9_299 {
    padding: .25rem .5rem;
    font-size: .75rem;
    background: #ffffff0d;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 4px;
    color: #ffffffe6;
    cursor: pointer;
    transition: all .2s ease;
    font-weight: 500
}

._addButton_waqi9_299:hover {
    background: #ffffff1a;
    transform: translateY(-1px)
}

._inputWithDropdown_waqi9_316 {
    position: relative;
    width: 100%
}

._dropdownList_waqi9_321 {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 200px;
    margin-top: 2px;
    background: #0000004f;
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 8px;
    overflow-y: auto;
    z-index: 1000;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 16px #0000004d
}

._dropdownItem_waqi9_338 {
    padding: .625rem .875rem;
    cursor: pointer;
    color: #ffffffe6;
    font-size: .875rem;
    transition: all .2s ease;
    border-bottom: 1px solid rgba(255,255,255,.05)
}

._dropdownItem_waqi9_338:last-child {
    border-bottom: none
}

._dropdownItem_waqi9_338:hover {
    background: #6b46c133;
    color: #fff
}

._dropdownItem_waqi9_338:first-child {
    border-radius: 7px 7px 0 0
}

._dropdownItem_waqi9_338:last-child {
    border-radius: 0 0 7px 7px
}

._dropdownList_waqi9_321::-webkit-scrollbar {
    width: 8px
}

._dropdownList_waqi9_321::-webkit-scrollbar-track {
    background: #ffffff0d;
    border-radius: 4px
}

._dropdownList_waqi9_321::-webkit-scrollbar-thumb {
    background: #fff3;
    border-radius: 4px
}

._dropdownList_waqi9_321::-webkit-scrollbar-thumb:hover {
    background: #ffffff4d
}

._input_waqi9_316 {
    width: 100%;
    padding: .625rem .875rem;
    background: #0000004d;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 8px;
    color: #fff;
    font-size: .875rem;
    transition: all .2s ease
}

._input_waqi9_316:focus {
    outline: none;
    border-color: var(--purple-400, #9f7aea);
    background: #0006;
    box-shadow: 0 0 0 3px #9f7aea1a
}

._input_waqi9_316::placeholder {
    color: #fff6
}

._errorText_waqi9_405 {
    color: #ef4444;
    font-size: .8rem;
    margin: 0
}

._formActions_waqi9_411 {
    display: flex;
    justify-content: flex-end;
    gap: .75rem;
    margin-top: 1.5rem
}

._cancelButton_waqi9_418,._saveButton_waqi9_419 {
    padding: .5rem 1.25rem;
    font-size: .875rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all .2s ease;
    border: none
}

._cancelButton_waqi9_418 {
    background: #ffffff1a;
    color: #ffffffe6
}

._cancelButton_waqi9_418:hover {
    background: #ffffff26;
    transform: translateY(-1px)
}

._saveButton_waqi9_419 {
    background: var(--purple-600, #6b46c1);
    color: #fff
}

._saveButton_waqi9_419:hover {
    background: var(--purple-700, #553c9a);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px #6b46c14d
}

._emptyState_waqi9_451 {
    text-align: center;
    padding: 3rem 1rem;
    background: #ffffff08;
    border: 1px dashed rgba(255,255,255,.1);
    border-radius: 12px
}

._emptyStateText_waqi9_459 {
    font-size: 1rem;
    color: #ffffffb3;
    margin: 0 0 .5rem
}

._emptyStateSubtext_waqi9_465 {
    font-size: .875rem;
    color: #ffffff80;
    margin: 0
}

._legacyPromptBox_waqi9_472 {
    margin-top: 1rem;
    background: #60a5fa0d;
    border: 1px solid rgba(96,165,250,.2);
    border-radius: 8px;
    overflow: hidden
}

._legacyPromptHeader_waqi9_480 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .75rem 1rem;
    background: #60a5fa14;
    border-bottom: 1px solid rgba(96,165,250,.15)
}

._legacyPromptLabel_waqi9_489 {
    font-size: .875rem;
    font-weight: 500;
    color: #60a5fa
}

._legacyPromptButton_waqi9_495 {
    padding: .25rem .75rem;
    font-size: .75rem;
    background: transparent;
    border: 1px solid rgba(96,165,250,.3);
    border-radius: 4px;
    color: #60a5fa;
    cursor: pointer;
    transition: all .15s ease
}

._legacyPromptButton_waqi9_495:hover {
    background: #60a5fa26;
    border-color: #60a5fa80
}

._legacyPromptContent_waqi9_511 {
    padding: 1rem;
    font-size: .8rem;
    color: #fffc;
    line-height: 1.5;
    font-family: SF Mono,Monaco,Inconsolata,Roboto Mono,Consolas,monospace;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto
}

._legacyPromptContent_waqi9_511::-webkit-scrollbar {
    width: 6px
}

._legacyPromptContent_waqi9_511::-webkit-scrollbar-track {
    background: #ffffff0d;
    border-radius: 3px
}

._legacyPromptContent_waqi9_511::-webkit-scrollbar-thumb {
    background: #60a5fa4d;
    border-radius: 3px
}

._legacyPromptContent_waqi9_511::-webkit-scrollbar-thumb:hover {
    background: #60a5fa66
}

._warningsSection_waqi9_544 {
    margin-top: 1rem;
    padding: 1rem;
    background: #fbbf240d;
    border: 1px solid rgba(251,191,36,.1);
    border-radius: 8px
}

._warningText_waqi9_552 {
    color: #fffc;
    font-size: .8rem;
    line-height: 1.5;
    margin: 0
}

._strongText_waqi9_559 {
    font-weight: 600;
    color: #fbbf24
}

._checkButton_waqi9_565 {
    padding: .5rem 1rem;
    background: var(--purple-600, #6b46c1);
    border: none;
    border-radius: 6px;
    color: #fff;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s ease;
    min-width: 150px;
    position: relative;
    overflow: hidden
}

._checkButton_waqi9_565:hover:not(:disabled) {
    background: var(--purple-700, #553c9a);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px #6b46c14d
}

._checkButton_waqi9_565:disabled {
    opacity: .6;
    cursor: not-allowed
}

._checkButton_waqi9_565._loading_waqi9_590:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border: 2px solid transparent;
    border-top-color: #fff;
    border-radius: 50%;
    animation: _spin_waqi9_1 .8s linear infinite
}

._checkButton_waqi9_565._loading_waqi9_590 {
    color: transparent
}

@keyframes _spin_waqi9_1 {
    to {
        transform: rotate(360deg)
    }
}

@media (max-width: 768px) {
    ._headerSection_waqi9_11 {
        flex-direction:column;
        align-items: flex-start;
        gap: .75rem
    }

    ._addNewButton_waqi9_26 {
        width: 100%;
        justify-content: center
    }

    ._configItemUrl_waqi9_155 {
        max-width: 200px
    }

    ._configItemActions_waqi9_166 {
        flex-wrap: wrap;
        transform: translateY(-30%)
    }

    ._configItemDetails_waqi9_127 {
        align-items: flex-start
    }

    ._configItem_waqi9_60._selected_waqi9_76 ._configItemModel_waqi9_140,._configItem_waqi9_60:hover ._configItemModel_waqi9_140 {
        max-width: calc(100% + 1em)
    }

    ._configItem_waqi9_60:hover ._configItemDetails_waqi9_127,._configItem_waqi9_60._selected_waqi9_76 ._configItemDetails_waqi9_127 {
        max-width: calc(100% - 19em)
    }

    ._configItem_waqi9_60._selected_waqi9_76 ._configItemUrl_waqi9_155,._configItem_waqi9_60:hover ._configItemUrl_waqi9_155 {
        max-width: calc(100% + 17.5em)
    }

    ._formSection_waqi9_258 {
        padding: 1.25rem
    }

    ._formActions_waqi9_411 {
        flex-direction: column
    }

    ._cancelButton_waqi9_418,._saveButton_waqi9_419 {
        width: 100%
    }

    ._testButton_waqi9_185 {
        margin-right: 0
    }

    ._activeIndicator_waqi9_113 {
        padding: .25rem .75rem
    }

    ._reorderButtonsContainer_waqi9_230 {
        top: 30%
    }
}

@media (max-width: 480px) {
    ._configItem_waqi9_60 {
        border-radius:10px
    }

    ._configItemContent_waqi9_91 {
        padding: .875rem
    }

    ._configItemActions_waqi9_166 {
        padding: 0 .875rem .875rem;
        gap: .375rem
    }

    ._editButton_waqi9_184,._testButton_waqi9_185,._deleteButton_waqi9_183 {
        padding: .3rem .6rem;
        font-size: .75rem
    }

    ._configItemDetails_waqi9_127 {
        flex-direction: column;
        gap: .5rem
    }

    ._configItemUrl_waqi9_155 {
        max-width: 100%
    }

    ._formSection_waqi9_258 {
        padding: 1rem;
        border-radius: 10px
    }

    ._heading_waqi9_18 {
        font-size: 1rem
    }

    ._formTitle_waqi9_268 {
        font-size: .9rem
    }
}

@media (prefers-contrast: high) {
    ._configItem_waqi9_60,._formSection_waqi9_258 {
        border: 2px solid rgba(255,255,255,.3)
    }

    ._input_waqi9_316 {
        border: 2px solid rgba(255,255,255,.5)
    }

    ._input_waqi9_316:focus {
        outline: 2px solid white;
        outline-offset: 2px
    }
}

@media (prefers-reduced-motion: reduce) {
    ._addNewButton_waqi9_26,._configItem_waqi9_60,._editButton_waqi9_184,._testButton_waqi9_185,._deleteButton_waqi9_183,._cancelButton_waqi9_418,._saveButton_waqi9_419,._input_waqi9_316 {
        transition: none
    }
}

._helpText_waqi9_757 {
    color: #fff9;
    font-size: .8rem;
    line-height: 1.5;
    margin: .25rem 0 0
}

._link_waqi9_764 {
    color: var(--purple-500, #805ad5);
    text-decoration: underline;
    transition: color .2s ease
}

._link_waqi9_764:hover {
    color: var(--purple-400, #9f7aea)
}

._presetButtons_waqi9_775 {
    display: flex;
    flex-wrap: wrap;
    gap: .25rem;
    margin-top: .5rem
}

._presetButton_waqi9_775 {
    padding: .375rem .75rem;
    font-size: .875rem;
    background: #ffffff0d;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 4px;
    color: #ffffffe6;
    cursor: pointer;
    transition: all .2s ease
}

._presetButton_waqi9_775:hover {
    background: #ffffff1a;
    border-color: #ffffff4d
}

._presetButton_waqi9_775:active {
    transform: scale(.98)
}

._popupOverlay_waqi9_803 {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000000bf;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px)
}

._popupContent_waqi9_817 {
    background: #ffffff0d;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 12px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 8px 32px #0006
}

._popupContent_waqi9_817 h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #fffffff2;
    margin: 0 0 .5rem
}

._popupContent_waqi9_817 p {
    font-size: .875rem;
    color: #ffffffb3;
    margin: 0 0 1.5rem
}

._popupActions_waqi9_841 {
    display: flex;
    justify-content: center;
    gap: 1rem
}

._confirmDeleteButton_waqi9_847 {
    background: #ef4444e6;
    color: #fff;
    padding: .625rem 1.5rem;
    font-size: .875rem;
    font-weight: 500;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all .2s ease
}

._confirmDeleteButton_waqi9_847:hover {
    background: #f93c3ccc;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px #ef44444d
}

._cancelDeleteButton_waqi9_865 {
    background: transparent;
    color: #ffffffb3;
    padding: .625rem 1.5rem;
    font-size: .875rem;
    font-weight: 500;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,.2);
    cursor: pointer;
    transition: all .2s ease
}

._cancelDeleteButton_waqi9_865:hover {
    background: #ffffff1a;
    transform: translateY(-1px)
}

._radioCardLabel_op7n0_1 {
    position: relative;
    display: inline-block
}

._radioCardInput_op7n0_6 {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0
}

._radioCard_op7n0_1 {
    display: inline-block;
    padding: .25rem .5rem;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 6px;
    font-family: "GG Sans",sans-serif;
    font-weight: 700;
    box-shadow: 0 10px 15px -3px #0000001a,0 4px 6px -2px #0000000d;
    transition: all .2s ease;
    background: #ffffff0d;
    color: #ffffffe6;
    -webkit-user-select: none;
    user-select: none
}

._radioCard_op7n0_1:hover {
    background: #ffffff14;
    transform: translateY(-1px);
    box-shadow: 0 20px 25px -5px #0000001a,0 10px 10px -5px #0000000a
}

._radioCardInput_op7n0_6:checked+._radioCard_op7n0_1 {
    background: var(--purple-700, #553c9a);
    color: #fff;
    border-color: var(--purple-600, #6b46c1);
    box-shadow: inset 0 2px 4px #0000000f
}

@media (prefers-reduced-motion: reduce) {
    ._radioCard_op7n0_1 {
        transition: none
    }
}

@media (prefers-contrast: high) {
    ._radioCard_op7n0_1 {
        border: 2px solid currentColor
    }

    ._radioCardInput_op7n0_6:checked+._radioCard_op7n0_1 {
        outline: 2px solid white;
        outline-offset: -2px
    }
}

._menuTrigger_162rw_2 {
    display: inline-block;
    cursor: pointer
}

._menuList_162rw_8 {
    position: absolute;
    z-index: 1000;
    min-width: 220px;
    max-width: 340px;
    background: #313338;
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 8px;
    box-shadow: 0 8px 20px #0006;
    padding: .25rem;
    display: none;
    overflow: hidden
}

._menuList_162rw_8._open_162rw_22 {
    display: block;
    animation: _menuFadeIn_162rw_1 .15s ease
}

._menuList_162rw_8._bottom_162rw_28 {
    transform-origin: top right
}

._menuList_162rw_8._top_162rw_32 {
    transform-origin: bottom right
}

._menuList_162rw_8._left_162rw_36 {
    transform-origin: right center
}

._menuList_162rw_8._right_162rw_40 {
    transform-origin: left center
}

._menuItem_162rw_45 {
    width: 100%;
    padding: .75rem 1rem;
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: .875rem;
    text-align: left;
    color: #fffffff2;
    font-size: 1rem;
    font-weight: 500;
    transition: background .15s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: "GG Sans",sans-serif
}

._menuItem_162rw_45:hover:not(._disabled_162rw_66) {
    background: #ffffff1f;
    color: #fff
}

._menuItem_162rw_45:active:not(._disabled_162rw_66) {
    background: #ffffff2e
}

._menuItem_162rw_45._disabled_162rw_66 {
    opacity: .5;
    cursor: not-allowed
}

._menuItemIcon_162rw_81 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    color: #fffc
}

._menuItem_162rw_45:hover:not(._disabled_162rw_66) ._menuItemIcon_162rw_81 {
    color: #fffffff2
}

._menuItemContent_162rw_96 {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis
}

._menuDivider_162rw_104 {
    height: 1px;
    background: #ffffff26;
    margin: .375rem -.25rem
}

@keyframes _menuFadeIn_162rw_1 {
    0% {
        opacity: 0;
        transform: scale(.98)
    }

    to {
        opacity: 1;
        transform: scale(1)
    }
}

@media (max-width: 768px) {
    ._menuList_162rw_8 {
        min-width:200px;
        max-width: calc(100vw - 32px);
        padding: .25rem
    }

    ._menuItem_162rw_45 {
        padding: .625rem .875rem;
        font-size: .95rem;
        gap: .75rem
    }

    ._menuItemIcon_162rw_81 {
        width: 20px;
        height: 20px
    }
}

@media (max-width: 480px) {
    ._menuList_162rw_8 {
        min-width:180px;
        max-width: calc(100vw - 24px);
        border-radius: 6px
    }

    ._menuItem_162rw_45 {
        padding: .5rem .75rem;
        font-size: .9rem;
        gap: .625rem;
        border-radius: 4px
    }

    ._menuItemIcon_162rw_81 {
        width: 18px;
        height: 18px
    }
}

@media (prefers-reduced-motion: reduce) {
    ._menuList_162rw_8._open_162rw_22 {
        animation: none
    }
}

._accordion_1s1g8_2 {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: #ffffff05;
    border: 1px solid rgba(255,255,255,.08)
}

._accordionItem_1s1g8_11 {
    border-bottom: 1px solid rgba(255,255,255,.05)
}

._accordionItem_1s1g8_11:last-child {
    border-bottom: none
}

._accordionButton_1s1g8_20 {
    width: 100%;
    padding: 1rem 1.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    transition: background-color .2s ease;
    color: #ffffffe6;
    font-size: .95rem;
    font-weight: 500;
    min-height: 56px
}

._accordionButton_1s1g8_20:hover {
    background: #ffffff08
}

._accordionButton_1s1g8_20:focus {
    outline: none;
    background: #ffffff0d
}

._accordionButtonContent_1s1g8_46 {
    flex: 1;
    margin-right: 1rem
}

._accordionIcon_1s1g8_52 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    color: #fff9;
    transition: transform .3s ease
}

._accordionIcon_1s1g8_52._expanded_1s1g8_63 {
    transform: rotate(180deg)
}

._accordionPanel_1s1g8_68 {
    max-height: 0;
    overflow: hidden;
    transition: max-height .3s ease-out
}

._accordionPanel_1s1g8_68._expanded_1s1g8_63 {
    max-height: 2000px;
    transition: max-height .5s ease-in
}

._accordionPanelContent_1s1g8_79 {
    padding: 0 1.25rem 1.25rem;
    color: #fffc;
    font-size: .875rem;
    line-height: 1.6
}

._accordionPanelContent_1s1g8_79>*:first-child {
    margin-top: 0
}

._accordionPanelContent_1s1g8_79>*:last-child {
    margin-bottom: 0
}

@media (max-width: 768px) {
    ._accordionButton_1s1g8_20 {
        padding:.875rem 1rem;
        font-size: .9rem;
        min-height: 52px
    }

    ._accordionIcon_1s1g8_52 {
        width: 20px;
        height: 20px
    }

    ._accordionPanelContent_1s1g8_79 {
        padding: 0 1rem 1rem;
        font-size: .8rem
    }
}

@media (max-width: 480px) {
    ._accordion_1s1g8_2 {
        border-radius:10px
    }

    ._accordionButton_1s1g8_20 {
        padding: .75rem;
        font-size: .85rem;
        min-height: 48px
    }

    ._accordionButtonContent_1s1g8_46 {
        margin-right: .75rem
    }

    ._accordionIcon_1s1g8_52 {
        width: 18px;
        height: 18px
    }

    ._accordionPanelContent_1s1g8_79 {
        padding: 0 .75rem .75rem;
        font-size: .75rem
    }
}

@media (prefers-reduced-motion: reduce) {
    ._accordionIcon_1s1g8_52,._accordionPanel_1s1g8_68 {
        transition: none
    }

    ._accordionPanel_1s1g8_68._expanded_1s1g8_63 {
        max-height: none
    }
}

@media (prefers-contrast: high) {
    ._accordion_1s1g8_2 {
        border: 2px solid rgba(255,255,255,.3)
    }

    ._accordionItem_1s1g8_11 {
        border-bottom: 2px solid rgba(255,255,255,.2)
    }

    ._accordionButton_1s1g8_20:focus {
        outline: 2px solid rgba(255,255,255,.8);
        outline-offset: -2px
    }
}

._accordionButton_13t4p_2 {
    width: 100%;
    padding: 1rem 1.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    transition: background-color .2s ease;
    color: #ffffffe6
}

._accordionButton_13t4p_2:hover {
    background: #ffffff08
}

._accordionTitle_13t4p_20 {
    font-size: 1rem;
    font-weight: 700;
    font-family: monospace;
    color: #d3d3d3;
    margin: 0
}

._accordionPanel_13t4p_28 {
    padding: 0 1.25rem 1.25rem
}

._formControl_13t4p_33 {
    margin-bottom: 1rem
}

._formError_13t4p_37 {
    font-size: .8rem;
    color: #f87171;
    margin-top: .5rem
}

._sliderContainer_13t4p_44 {
    transition: opacity .3s ease
}

._sliderContainer_13t4p_44._disabled_13t4p_48 {
    opacity: .1;
    pointer-events: none
}

@media (max-width: 768px) {
    ._accordionButton_13t4p_2 {
        padding:.875rem 1rem
    }

    ._accordionTitle_13t4p_20 {
        font-size: .9rem
    }

    ._accordionPanel_13t4p_28 {
        padding: 0 1rem 1rem
    }

    ._formError_13t4p_37 {
        font-size: .75rem
    }
}

@media (max-width: 480px) {
    ._accordionButton_13t4p_2 {
        padding:.75rem
    }

    ._accordionTitle_13t4p_20 {
        font-size: .85rem
    }

    ._accordionPanel_13t4p_28 {
        padding: 0 .75rem .75rem
    }

    ._formError_13t4p_37 {
        font-size: .7rem
    }
}

._modalHeader_8hnjc_2 {
    font-family: "GG Sans",sans-serif;
    font-weight: 700;
    color: var(--purple-500, #805ad5);
    font-size: 1.25rem
}

._accordionSection_8hnjc_10 {
    margin-bottom: .5rem
}

._accordionTitle_8hnjc_14 {
    font-size: 1rem;
    font-weight: 700;
    font-family: monospace;
    color: #d3d3d3;
    margin: 0
}

._textPreview_8hnjc_23 {
    padding: 1rem;
    background: #0000004d;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,.08);
    margin-bottom: 1.5rem
}

._previewLabel_8hnjc_31 {
    font-size: .75rem;
    font-weight: 600;
    color: #fff9;
    text-transform: uppercase;
    letter-spacing: .05em;
    margin-bottom: .75rem;
    font-family: "GG Sans",sans-serif
}

._previewContent_8hnjc_41 {
    line-height: 1.5;
    transition: all .2s ease
}

._colorPickerContainer_8hnjc_46 {
    margin-top: 1rem
}

._resetButton_8hnjc_50 {
    width: 100%;
    padding: .5rem 1rem;
    background: #ffffff1a;
    border: none;
    border-radius: 6px;
    color: #ffffffe6;
    font-size: .875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s ease
}

._resetButton_8hnjc_50:hover {
    background: #ffffff26;
    color: #fff
}

._themeGrid_8hnjc_69 {
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(150px,1fr));
    gap: 1rem;
    margin-top: .5rem
}

._themeItem_8hnjc_76 {
    display: flex;
    flex-direction: column;
    gap: .375rem
}

._themeLabel_8hnjc_82 {
    font-size: .875rem;
    font-weight: 600;
    font-family: "GG Sans",sans-serif;
    margin: 0
}

._themeLabel_8hnjc_82._clouds_8hnjc_89 {
    color: #00bcd4
}

._themeLabel_8hnjc_82._beginning_8hnjc_93 {
    color: #ff9800
}

._themeLabel_8hnjc_82._pride_8hnjc_97 {
    color: #e91e63
}

._modalFooter_8hnjc_102 {
    display: flex;
    justify-content: flex-end;
    gap: .5rem;
    padding: 1rem 1.25rem;
    border-top: 1px solid rgba(255,255,255,.08)
}

._cancelButton_8hnjc_110 {
    padding: .5rem 1rem;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: #ffffffe6;
    font-size: .875rem;
    font-weight: 500;
    font-family: "GG Sans",sans-serif;
    cursor: pointer;
    transition: all .2s ease
}

._cancelButton_8hnjc_110:hover {
    background: #ffffff14
}

._saveButton_8hnjc_127 {
    padding: .5rem 1rem;
    background: var(--purple-600, #6b46c1);
    border: none;
    border-radius: 6px;
    color: #fff;
    font-size: .875rem;
    font-weight: 600;
    font-family: "GG Sans",sans-serif;
    cursor: pointer;
    transition: all .2s ease;
    display: flex;
    align-items: center;
    gap: .5rem
}

._saveButton_8hnjc_127:hover:not(:disabled) {
    background: var(--purple-700, #553c9a)
}

._saveButton_8hnjc_127:disabled {
    opacity: .6;
    cursor: not-allowed
}

._saveButton_8hnjc_127._loading_8hnjc_152 {
    position: relative
}

._saveButton_8hnjc_127._loading_8hnjc_152:after {
    content: "";
    position: absolute;
    right: .5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    border: 2px solid transparent;
    border-top-color: #fff;
    border-radius: 50%;
    animation: _spin_8hnjc_1 .8s linear infinite
}

._saveButtonHighlight_8hnjc_170 {
    background: var(--purple-500, #805ad5);
    border-color: var(--purple-400, #9f7aea)
}

._colorPickerWrapper_8hnjc_176 {
    margin-top: .75rem;
    padding: 1rem;
    background: #0003;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,.08);
    animation: _slideDown_8hnjc_1 .3s ease
}

._colorResetButton_8hnjc_185 {
    width: 100%;
    padding: .5rem;
    margin-top: .75rem;
    background: #ffffff14;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 4px;
    color: #fffc;
    font-size: .75rem;
    font-weight: 500;
    font-family: "GG Sans",sans-serif;
    cursor: pointer;
    transition: all .2s ease
}

._colorResetButton_8hnjc_185:hover {
    background: #ffffff1f;
    border-color: #fff3;
    color: #fff
}

@keyframes _slideDown_8hnjc_1 {
    0% {
        opacity: 0;
        transform: translateY(-10px)
    }

    to {
        opacity: 1;
        transform: translateY(0)
    }
}

._colorLabel_8hnjc_217 {
    display: block;
    font-size: .875rem;
    font-weight: 600;
    color: #ffffffe6;
    margin-bottom: .5rem;
    font-family: "GG Sans",sans-serif
}

._colorSection_8hnjc_226 {
    margin-top: 1rem
}

._colorToggleButton_8hnjc_230 {
    width: 100%;
    padding: .75rem 1rem;
    background: #ffffff14;
    border: none;
    border-radius: 6px;
    color: #ffffffe6;
    font-size: .875rem;
    font-weight: 600;
    font-family: "GG Sans",sans-serif;
    cursor: pointer;
    transition: all .2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center
}

._colorToggleButton_8hnjc_230:hover {
    background: #ffffff1f;
    color: #fff
}

._toggleIcon_8hnjc_252 {
    font-size: .75rem;
    transition: transform .3s ease
}

._toggleIcon_8hnjc_252._expanded_8hnjc_257 {
    transform: rotate(180deg)
}

._colorToggleLeft_8hnjc_261 {
    display: flex;
    align-items: center;
    gap: .75rem
}

._colorPreview_8hnjc_267 {
    width: 24px;
    aspect-ratio: 1;
    border-radius: 4px;
    border: 2px solid rgba(255,255,255,.2);
    box-shadow: 0 2px 4px #0003;
    flex-shrink: 0
}

._colorToggleButton_8hnjc_230:hover ._colorPreview_8hnjc_267 {
    border-color: #fff6;
    box-shadow: 0 2px 8px #0000004d
}

._fontFamilyLabel_8hnjc_281 {
    display: block;
    font-size: .875rem;
    font-weight: 600;
    color: #ffffffe6;
    margin-bottom: .5rem;
    font-family: "GG Sans",sans-serif
}

._selectWrapper_8hnjc_290 {
    position: relative
}

._selectWrapper_8hnjc_290 select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none
}

._selectWrapper_8hnjc_290 ._toggleIcon_8hnjc_252 {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: .875rem
}

._selectWrapper_8hnjc_290 select option {
    background: #3e3e3e;
    color: #fff
}

@media (max-width: 768px) {
    ._modalHeader_8hnjc_2 {
        font-size:1.125rem
    }

    ._themeGrid_8hnjc_69 {
        grid-template-columns: repeat(auto-fit,minmax(120px,1fr));
        gap: .75rem
    }

    ._themeLabel_8hnjc_82 {
        font-size: .8rem
    }

    ._resetButton_8hnjc_50,._cancelButton_8hnjc_110,._saveButton_8hnjc_127 {
        font-size: .8rem;
        padding: .4rem .875rem
    }

    ._colorToggleButton_8hnjc_230 {
        font-size: .8rem;
        padding: .625rem .875rem
    }

    ._colorPreview_8hnjc_267 {
        width: 20px
    }

    ._colorToggleLeft_8hnjc_261 {
        gap: .625rem
    }
}

@media (max-width: 480px) {
    ._modalHeader_8hnjc_2 {
        font-size:1rem
    }

    ._themeGrid_8hnjc_69 {
        grid-template-columns: 1fr 1fr;
        gap: .625rem
    }

    ._themeLabel_8hnjc_82 {
        font-size: .75rem
    }

    ._colorPickerWrapper_8hnjc_176 {
        padding: .75rem
    }

    ._resetButton_8hnjc_50,._cancelButton_8hnjc_110,._saveButton_8hnjc_127 {
        font-size: .75rem;
        padding: .375rem .75rem
    }

    ._modalFooter_8hnjc_102 {
        padding: .875rem 1rem
    }

    ._colorToggleButton_8hnjc_230 {
        font-size: .75rem;
        padding: .5rem .75rem
    }

    ._colorPreview_8hnjc_267 {
        width: 18px
    }

    ._colorToggleLeft_8hnjc_261 {
        gap: .5rem
    }
}

@keyframes _spin_8hnjc_1 {
    to {
        transform: translateY(-50%) rotate(360deg)
    }
}

._menuWrapper_hs488_2 {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: .5rem;
    position: relative
}

._apiTag_hs488_11 {
    display: inline-flex;
    align-items: center;
    padding: .25rem .5rem;
    font-size: .8rem;
    border-radius: .4rem;
    border: 1px solid #805ad5;
    font-family: "GG Sans",sans-serif;
    font-weight: 900;
    cursor: pointer;
    transition: all .2s ease;
    -webkit-user-select: none;
    user-select: none;
    white-space: nowrap
}

._apiTag_hs488_11._ready_hs488_26 {
    color: #fff;
    background: #805ad51a
}

._apiTag_hs488_11._ready_hs488_26:hover {
    background: #805ad533;
    border-color: #805ad599
}

._apiTag_hs488_11._error_hs488_36 {
    background: #ef444433;
    border-color: #ef444499;
    color: #fffffff2
}

._apiTag_hs488_11._error_hs488_36:hover {
    background: #ef44444d;
    border-color: #ef4444cc;
    transform: scale(1.02)
}

._apiTag_hs488_11._forbidden_hs488_48 {
    background: #ef444433;
    border-color: #ef444499;
    color: #fffffff2
}

._apiTag_hs488_11._forbidden_hs488_48:hover {
    background: #ef44444d;
    border-color: #ef4444cc
}

._menuButton_hs488_60 {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: .2rem .3rem;
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all .2s ease;
    color: #fffc;
    position: relative
}

._menuButton_hs488_60:hover {
    background: #ffffff14;
    color: #fff
}

._menuButton_hs488_60:active {
    transform: scale(.95)
}

._menuButton_hs488_60[aria-expanded=true] {
    background: #ffffff1a;
    color: #fff
}

._menuIcon_hs488_88 {
    width: 1.5rem;
    height: 1.5rem
}

._menuItemSwitch_hs488_94 {
    display: flex;
    align-items: center;
    gap: .75rem;
    width: 100%;
    padding: .625rem .875rem;
    font-size: .875rem;
    color: #ffffffe6;
    border-radius: 6px;
    transition: background .2s ease;
    cursor: default
}

._menuItemSwitch_hs488_94:hover {
    background: #ffffff0d
}

._menuItemLabel_hs488_111 {
    flex: 1
}

._loadingIcon_hs488_116 {
    animation: _spin_hs488_1 1s linear infinite
}

@keyframes _spin_hs488_1 {
    0% {
        transform: rotate(0)
    }

    to {
        transform: rotate(360deg)
    }
}

._premiumBadge_hs488_130 {
    display: inline-flex;
    align-items: center;
    margin-left: .5rem;
    padding: .125rem .5rem;
    background: linear-gradient(135deg,#9333ea40,#ec489940);
    border: 1px solid rgba(147,51,234,.4);
    border-radius: 12px;
    font-size: .7rem;
    font-weight: 700;
    font-family: "GG Sans",sans-serif;
    letter-spacing: .3px;
    color: #e9d5ff;
    white-space: nowrap;
    animation: _premiumPulse_hs488_1 3s ease-in-out infinite
}

@keyframes _premiumPulse_hs488_1 {
    0%,to {
        box-shadow: 0 0 8px #9333ea4d,inset 0 0 8px #9333ea1a
    }

    50% {
        box-shadow: 0 0 12px #9333ea66,inset 0 0 12px #9333ea26
    }
}

@media (max-width: 768px) {
    ._menuWrapper_hs488_2 {
        gap:.375rem
    }

    ._apiTag_hs488_11 {
        font-size: .75rem;
        padding: .2rem .4rem
    }

    ._premiumBadge_hs488_130 {
        font-size: .65rem;
        padding: .1rem .4rem;
        margin-left: .375rem
    }

    ._menuButton_hs488_60 {
        padding: .375rem .5rem
    }

    ._menuIcon_hs488_88 {
        width: 1.375rem;
        height: 1.375rem
    }

    ._menuItemSwitch_hs488_94 {
        padding: .5rem .75rem;
        font-size: .8rem;
        gap: .625rem
    }
}

@media (max-width: 480px) {
    ._menuWrapper_hs488_2 {
        gap:.25rem
    }

    ._apiTag_hs488_11 {
        font-size: .7rem;
        padding: .15rem .35rem;
        border-radius: .3rem
    }

    ._premiumBadge_hs488_130 {
        font-size: .6rem;
        padding: .075rem .3rem;
        margin-left: .25rem;
        border-radius: 8px
    }

    ._menuButton_hs488_60 {
        padding: .3rem .4rem
    }

    ._menuIcon_hs488_88 {
        width: 1.25rem;
        height: 1.25rem
    }

    ._menuItemSwitch_hs488_94 {
        padding: .4rem .625rem;
        font-size: .75rem;
        gap: .5rem
    }
}

@media (prefers-reduced-motion: reduce) {
    ._loadingIcon_hs488_116 {
        animation: none
    }

    ._apiTag_hs488_11,._menuButton_hs488_60 {
        transition: none
    }
}

@media (prefers-contrast: high) {
    ._apiTag_hs488_11 {
        border: 2px solid currentColor
    }

    ._menuButton_hs488_60:focus {
        outline: 2px solid white;
        outline-offset: 2px
    }

    ._apiTag_hs488_11:focus {
        outline: 2px solid white;
        outline-offset: 2px
    }
}

@media (prefers-color-scheme: dark) {
    ._apiTag_hs488_11._ready_hs488_26 {
        background:#none;
        border-color: #805ad566
    }

    ._apiTag_hs488_11._error_hs488_36,._apiTag_hs488_11._forbidden_hs488_48 {
        background: #ef444426;
        border-color: #ef444466
    }
}

._modalHeader_1v2pp_2 {
    font-family: "GG Sans",sans-serif;
    font-weight: 600;
    color: #fffffff2;
    font-size: 1.125rem
}

._loadingContainer_1v2pp_10 {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px
}

._spinner_1v2pp_17 {
    width: 2rem;
    height: 2rem;
    border: 3px solid rgba(255,255,255,.1);
    border-top-color: var(--purple-500, #805ad5);
    border-radius: 50%;
    animation: _spin_1v2pp_17 .8s linear infinite
}

._chatListWrapper_1v2pp_27 {
    max-height: 60vh;
    overflow-y: auto;
    padding: .5rem
}

@keyframes _spin_1v2pp_17 {
    to {
        transform: rotate(360deg)
    }
}

._chatListWrapper_1v2pp_27::-webkit-scrollbar {
    width: 6px
}

._chatListWrapper_1v2pp_27::-webkit-scrollbar-track {
    background: #ffffff0d;
    border-radius: 3px
}

._chatListWrapper_1v2pp_27::-webkit-scrollbar-thumb {
    background: #fff3;
    border-radius: 3px
}

._chatListWrapper_1v2pp_27::-webkit-scrollbar-thumb:hover {
    background: #ffffff4d
}

@media (max-width: 768px) {
    ._modalHeader_1v2pp_2 {
        font-size:1rem
    }

    ._loadingContainer_1v2pp_10 {
        min-height: 150px
    }

    ._spinner_1v2pp_17 {
        width: 1.75rem;
        height: 1.75rem
    }
}

@media (max-width: 480px) {
    ._modalHeader_1v2pp_2 {
        font-size:.9rem
    }

    ._loadingContainer_1v2pp_10 {
        min-height: 120px
    }

    ._spinner_1v2pp_17 {
        width: 1.5rem;
        height: 1.5rem;
        border-width: 2px
    }

    ._chatListWrapper_1v2pp_27 {
        max-height: 50vh
    }
}

@media (prefers-reduced-motion: reduce) {
    ._spinner_1v2pp_17 {
        animation: none;
        opacity: .8
    }
}

._description_duix7_2 {
    font-size: .875rem;
    color: #fffc;
    line-height: 1.5;
    margin-bottom: 1rem
}

._statusText_duix7_9 {
    font-size: .875rem;
    color: #ffffffb3;
    margin-bottom: 1rem
}

._statusText_duix7_9 strong {
    color: #fffffff2;
    font-weight: 600
}

._buttonGroup_duix7_23 {
    display: flex;
    flex-direction: column;
    gap: .75rem;
    margin-bottom: 1rem
}

._autoButton_duix7_30 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    padding: .625rem 1.25rem;
    background: #ffffff14;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 8px;
    color: #ffffffe6;
    font-size: .875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s ease;
    position: relative
}

._autoButton_duix7_30:hover:not(:disabled) {
    background: #ffffff1f;
    border-color: #fff3;
    color: #fff
}

._autoButton_duix7_30:active:not(:disabled) {
    transform: scale(.98)
}

._autoButton_duix7_30:disabled {
    opacity: .6;
    cursor: not-allowed
}

._autoButton_duix7_30._loading_duix7_62:after {
    content: "";
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: _spin_duix7_1 .8s linear infinite
}

._buttonIcon_duix7_76 {
    width: 1rem;
    height: 1rem
}

._footerButtons_duix7_82 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-top: 1rem
}

._cancelButton_duix7_90 {
    padding: .5rem 1rem;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: #ffffffe6;
    font-size: .875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s ease
}

._cancelButton_duix7_90:hover {
    background: #ffffff14
}

._saveButton_duix7_106 {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .5rem 1rem;
    background: transparent;
    border: 1px solid var(--purple-600, #6b46c1);
    border-radius: 6px;
    color: #ffffffe6;
    font-size: .875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s ease
}

._saveButton_duix7_106:hover {
    background: #9f7aea1a;
    border-color: var(--purple-500, #805ad5);
    color: #fff
}

@media (max-width: 768px) {
    ._description_duix7_2,._statusText_duix7_9 {
        font-size:.8rem
    }

    ._textarea_duix7_134 {
        font-size: .8rem;
        padding: .625rem;
        min-height: 150px
    }

    ._autoButton_duix7_30 {
        font-size: .8rem;
        padding: .5rem 1rem
    }

    ._cancelButton_duix7_90,._saveButton_duix7_106 {
        font-size: .8rem;
        padding: .4rem .875rem
    }

    ._buttonIcon_duix7_76 {
        width: .875rem;
        height: .875rem
    }
}

@media (max-width: 480px) {
    ._description_duix7_2,._statusText_duix7_9 {
        font-size:.75rem
    }

    ._textarea_duix7_134 {
        font-size: .75rem;
        padding: .5rem;
        min-height: 120px
    }

    ._buttonGroup_duix7_23 {
        gap: .5rem
    }

    ._autoButton_duix7_30 {
        font-size: .75rem;
        padding: .4rem .875rem
    }

    ._cancelButton_duix7_90,._saveButton_duix7_106 {
        font-size: .75rem;
        padding: .375rem .75rem
    }

    ._buttonIcon_duix7_76 {
        width: .75rem;
        height: .75rem
    }
}

@keyframes _spin_duix7_1 {
    to {
        transform: translateY(-50%) rotate(360deg)
    }
}

._modalHeader_19hcm_2 {
    font-family: "GG Sans",sans-serif;
    font-weight: 700;
    color: #fffffff2;
    font-size: 1.25rem;
    letter-spacing: -.02em
}

._settingsContainer_19hcm_12 {
    display: flex;
    flex-direction: column;
    gap: .625rem
}

._contextInfo_19hcm_19 {
    font-size: .75rem;
    font-weight: 500;
    color: #92ff77e6;
    text-align: center;
    padding: .375rem .625rem;
    background: #92ff7714;
    border: 1px solid rgba(146,255,119,.2);
    border-radius: .375rem;
    margin: .25rem 0
}

._presetContainer_19hcm_32 {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    margin-top: .5rem;
    padding-top: .75rem;
    border-top: 1px solid rgba(255,255,255,.06)
}

._presetLabel_19hcm_41 {
    font-size: .75rem;
    font-weight: 500;
    color: #fff9;
    text-transform: uppercase;
    letter-spacing: .05em
}

._presetButtons_19hcm_49 {
    display: flex;
    gap: .375rem
}

._presetButton_19hcm_49 {
    flex: 1;
    padding: .5rem .75rem;
    background: #ffffff08;
    border: 1px solid rgba(255,255,255,.06);
    border-radius: .375rem;
    color: #fffc;
    font-size: .75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all .15s ease;
    white-space: nowrap
}

._presetButton_19hcm_49:hover {
    background: #ffffff0f;
    border-color: #ffffff1f;
    color: #fffffff2;
    transform: translateY(-1px)
}

._presetButton_19hcm_49:active {
    transform: translateY(0)
}

._presetButton_19hcm_49._primary_19hcm_80 {
    background: #92ff7714;
    border-color: #92ff7733;
    color: #92ff77e6
}

._presetButton_19hcm_49._primary_19hcm_80:hover {
    background: #92ff771f;
    border-color: #92ff774d;
    color: #92ff77
}

._advancedSection_19hcm_93 {
    margin-top: .75rem;
    padding-top: .75rem;
    border-top: 1px solid rgba(255,255,255,.06)
}

._advancedToggle_19hcm_99 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: .625rem .875rem;
    background: #ffffff05;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: .5rem;
    color: #ffffffb3;
    font-size: .8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all .15s ease;
    letter-spacing: .02em;
    text-transform: uppercase
}

._advancedToggle_19hcm_99:hover {
    background: #ffffff0a;
    border-color: #ffffff1f;
    color: #ffffffe6
}

._advancedToggle_19hcm_99 svg {
    width: 1rem;
    height: 1rem;
    transition: transform .2s ease
}

._advancedContent_19hcm_129 {
    margin-top: .75rem;
    padding: .875rem;
    background: #0003;
    border: 1px solid rgba(255,255,255,.06);
    border-radius: .5rem;
    animation: _slideDown_19hcm_1 .2s ease-out
}

@keyframes _slideDown_19hcm_1 {
    0% {
        opacity: 0;
        transform: translateY(-.5rem)
    }

    to {
        opacity: 1;
        transform: translateY(0)
    }
}

._warningBox_19hcm_149 {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .625rem .875rem;
    background: #ffc10714;
    border: 1px solid rgba(255,193,7,.2);
    border-radius: .375rem;
    margin-bottom: 1rem;
    font-size: .75rem;
    color: #ffc107e6;
    font-weight: 500
}

._warningIcon_19hcm_163 {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0
}

._sliderWrapper_19hcm_170 {
    position: relative;
    margin-bottom: .5rem
}

._sliderHeader_19hcm_175 {
    display: flex;
    align-items: center;
    gap: .375rem;
    margin-bottom: .5rem
}

._advancedSliderHeader_19hcm_183 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: .5rem
}

._sliderHeaderLeft_19hcm_190 {
    display: flex;
    align-items: center;
    gap: .375rem
}

._advancedSliderInput_19hcm_196 {
    width: 4rem;
    padding: .25rem .375rem;
    background: #ffffff0d;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: .25rem;
    color: #ffffffe6;
    font-size: .6875rem;
    font-weight: 500;
    text-align: center;
    transition: all .15s ease
}

._advancedSliderInput_19hcm_196:focus {
    outline: none;
    border-color: #92ff7766;
    background: #92ff7714;
    box-shadow: 0 0 0 2px #92ff771a
}

._advancedSliderInput_19hcm_196:hover {
    border-color: #fff3;
    background: #ffffff14
}

._sliderLabel_19hcm_221 {
    font-size: .75rem;
    font-weight: 500;
    color: #fff9;
    text-transform: uppercase;
    letter-spacing: .05em
}

._infoIcon_19hcm_229 {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: #fff6;
    cursor: pointer;
    padding: 0;
    transition: color .2s ease
}

._infoIcon_19hcm_229:hover {
    color: #92ff77b3
}

._infoIcon_19hcm_229 svg {
    width: .875rem;
    height: .875rem
}

._tooltip_19hcm_250 {
    position: absolute;
    bottom: calc(100% + .75rem);
    left: 50%;
    transform: translate(-50%);
    z-index: 1000;
    animation: _fadeInTooltip_19hcm_1 .2s ease-out
}

@keyframes _fadeInTooltip_19hcm_1 {
    0% {
        opacity: 0;
        transform: translate(-50%) translateY(.25rem)
    }

    to {
        opacity: 1;
        transform: translate(-50%) translateY(0)
    }
}

._tooltipContent_19hcm_270 {
    background: #141414fa;
    border: 1px solid rgba(146,255,119,.2);
    border-radius: .5rem;
    padding: .75rem;
    min-width: 16rem;
    max-width: 20rem;
    box-shadow: 0 8px 24px #0006
}

._tooltipContent_19hcm_270 strong {
    display: block;
    color: #92ff77e6;
    font-size: .8125rem;
    margin-bottom: .375rem;
    font-weight: 600
}

._tooltipContent_19hcm_270 p {
    color: #fffc;
    font-size: .75rem;
    line-height: 1.4;
    margin: 0 0 .5rem
}

._tooltipRecommend_19hcm_295 {
    padding: .375rem .5rem;
    background: #92ff7714;
    border: 1px solid rgba(146,255,119,.15);
    border-radius: .25rem;
    text-align: center
}

._tooltipRecommend_19hcm_295 span {
    color: #92ff77e6;
    font-size: .6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .03em
}

._saveButton_19hcm_312 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .375rem;
    width: 100%;
    padding: .625rem 1rem;
    background: linear-gradient(135deg,#92ff771a,#7ed3211a);
    border: 1px solid rgba(146,255,119,.3);
    border-radius: .5rem;
    color: #92ff77;
    font-size: .8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s ease;
    letter-spacing: .01em
}

._saveButton_19hcm_312:hover {
    background: linear-gradient(135deg,#92ff7726,#7ed32126);
    border-color: #92ff7766;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px #92ff7726
}

._saveButton_19hcm_312:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px #92ff771a
}

._saveButton_19hcm_312:disabled,._saveButtonLoading_19hcm_351 {
    opacity: .6;
    cursor: not-allowed;
    transform: none!important;
    box-shadow: none!important
}

._saveButton_19hcm_312:disabled:hover,._saveButtonLoading_19hcm_351:hover {
    background: linear-gradient(135deg,#92ff771a,#7ed3211a);
    border-color: #92ff774d;
    transform: none;
    box-shadow: none
}

._saveButtonHighlight_19hcm_370 {
    background: linear-gradient(135deg,#92ff7726,#7ed32126)!important;
    border-color: #92ff7766!important;
    animation: _pulseGlow_19hcm_1 2s ease-in-out infinite
}

@keyframes _pulseGlow_19hcm_1 {
    0%,to {
        box-shadow: 0 4px 12px #92ff7726
    }

    50% {
        box-shadow: 0 4px 16px #92ff7740
    }
}

._saveIcon_19hcm_390 {
    width: .875rem;
    height: .875rem
}

@media (max-width: 768px) {
    ._modalHeader_19hcm_2 {
        font-size:.9375rem
    }

    ._settingsContainer_19hcm_12 {
        gap: .75rem
    }

    ._contextInfo_19hcm_19 {
        font-size: .6875rem;
        padding: .3125rem .5rem
    }

    ._presetLabel_19hcm_41 {
        font-size: .6875rem
    }

    ._presetButton_19hcm_49 {
        font-size: .6875rem;
        padding: .4375rem .625rem
    }

    ._advancedToggle_19hcm_99 {
        font-size: .75rem;
        padding: .5rem .75rem
    }

    ._advancedContent_19hcm_129 {
        padding: .75rem
    }

    ._advancedSliderInput_19hcm_196 {
        width: 3.5rem;
        font-size: .625rem;
        padding: .1875rem .3125rem
    }

    ._warningBox_19hcm_149 {
        font-size: .6875rem;
        padding: .5rem .75rem
    }

    ._infoIcon_19hcm_229 svg {
        width: .8125rem;
        height: .8125rem
    }

    ._tooltipContent_19hcm_270 {
        padding: .625rem;
        min-width: 14rem
    }

    ._tooltipContent_19hcm_270 strong {
        font-size: .75rem
    }

    ._tooltipContent_19hcm_270 p {
        font-size: .6875rem
    }

    ._saveButton_19hcm_312 {
        font-size: .75rem;
        padding: .5625rem .875rem
    }

    ._saveIcon_19hcm_390 {
        width: .8125rem;
        height: .8125rem
    }
}

@media (max-width: 480px) {
    ._modalHeader_19hcm_2 {
        font-size:.875rem
    }

    ._settingsContainer_19hcm_12 {
        gap: .625rem
    }

    ._contextInfo_19hcm_19 {
        font-size: .625rem;
        padding: .25rem .4375rem
    }

    ._presetContainer_19hcm_32 {
        gap: .375rem;
        padding-top: .625rem
    }

    ._presetLabel_19hcm_41 {
        font-size: .625rem
    }

    ._presetButtons_19hcm_49 {
        gap: .25rem
    }

    ._presetButton_19hcm_49 {
        font-size: .625rem;
        padding: .375rem .5rem
    }

    ._advancedSection_19hcm_93 {
        margin-top: .625rem;
        padding-top: .625rem
    }

    ._advancedToggle_19hcm_99 {
        font-size: .6875rem;
        padding: .4375rem .625rem
    }

    ._advancedToggle_19hcm_99 svg {
        width: .875rem;
        height: .875rem
    }

    ._advancedContent_19hcm_129 {
        padding: .625rem;
        margin-top: .625rem
    }

    ._advancedSliderInput_19hcm_196 {
        width: 3rem;
        font-size: .5625rem;
        padding: .1875rem .25rem
    }

    ._advancedSliderHeader_19hcm_183 {
        flex-direction: column;
        align-items: flex-start;
        gap: .375rem
    }

    ._sliderHeaderLeft_19hcm_190 {
        width: 100%;
        justify-content: space-between
    }

    ._warningBox_19hcm_149 {
        font-size: .625rem;
        padding: .4375rem .625rem;
        margin-bottom: .75rem
    }

    ._warningIcon_19hcm_163 {
        width: .875rem;
        height: .875rem
    }

    ._infoIcon_19hcm_229 svg {
        width: .75rem;
        height: .75rem
    }

    ._tooltip_19hcm_250 {
        bottom: calc(100% + .5rem)
    }

    ._tooltipContent_19hcm_270 {
        padding: .5rem;
        min-width: 12rem;
        max-width: 16rem
    }

    ._tooltipContent_19hcm_270 strong {
        font-size: .6875rem;
        margin-bottom: .25rem
    }

    ._tooltipContent_19hcm_270 p {
        font-size: .625rem
    }

    ._tooltipRecommend_19hcm_295 {
        padding: .25rem .375rem
    }

    ._tooltipRecommend_19hcm_295 span {
        font-size: .625rem
    }

    ._saveButton_19hcm_312 {
        font-size: .6875rem;
        padding: .5rem .75rem
    }

    ._saveIcon_19hcm_390 {
        width: .75rem;
        height: .75rem
    }
}

@media (prefers-reduced-motion: reduce) {
    ._presetButton_19hcm_49,._saveButton_19hcm_312,._advancedSliderInput_19hcm_196 {
        transition: none
    }
}

@media (prefers-contrast: high) {
    ._contextInfo_19hcm_19,._presetButton_19hcm_49 {
        border-width: 2px
    }

    ._saveButton_19hcm_312 {
        border-width: 2px;
        font-weight: 700
    }

    ._advancedSliderInput_19hcm_196 {
        border-width: 2px
    }
}

._container_1f6yc_1 {
    display: flex;
    flex-direction: column;
    gap: .75rem;
    position: relative
}

._header_1f6yc_8 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: .25rem
}

._titleWrapper_1f6yc_15 {
    display: flex;
    align-items: center;
    gap: .5rem
}

._title_1f6yc_15 {
    font-size: .8125rem;
    font-weight: 600;
    color: #ffffffe6;
    text-transform: uppercase;
    letter-spacing: .02em;
    margin: 0
}

._infoIcon_1f6yc_30 {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: #fff6;
    cursor: pointer;
    padding: 0;
    transition: color .2s ease
}

._infoIcon_1f6yc_30:hover {
    color: #92ff77b3
}

._infoIcon_1f6yc_30 svg {
    width: .875rem;
    height: .875rem
}

._tooltip_1f6yc_51 {
    position: absolute;
    top: 2.5rem;
    left: 0;
    right: 0;
    z-index: 1000;
    animation: _fadeInTooltip_1f6yc_1 .2s ease-out
}

@keyframes _fadeInTooltip_1f6yc_1 {
    0% {
        opacity: 0;
        transform: translateY(-.25rem)
    }

    to {
        opacity: 1;
        transform: translateY(0)
    }
}

._tooltipContent_1f6yc_71 {
    background: #141414fa;
    border: 1px solid rgba(146,255,119,.2);
    border-radius: .5rem;
    padding: .75rem;
    box-shadow: 0 8px 24px #0006
}

._tooltipContent_1f6yc_71 strong {
    display: block;
    color: #92ff77e6;
    font-size: .8125rem;
    margin-bottom: .375rem;
    font-weight: 600
}

._tooltipContent_1f6yc_71 p {
    color: #fffc;
    font-size: .75rem;
    line-height: 1.4;
    margin: 0 0 .5rem
}

._tooltipExample_1f6yc_94 {
    padding: .375rem .5rem;
    background: #92ff7714;
    border: 1px solid rgba(146,255,119,.15);
    border-radius: .25rem;
    display: flex;
    flex-direction: column;
    gap: .25rem
}

._exampleLabel_1f6yc_104 {
    color: #92ff77e6;
    font-size: .6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .03em
}

._exampleItems_1f6yc_112 {
    color: #ffffffe6;
    font-size: .75rem;
    font-style: italic
}

._counter_1f6yc_118 {
    font-size: .75rem;
    font-weight: 500;
    color: #ffffff80;
    padding: .125rem .375rem;
    background: #ffffff0d;
    border-radius: .25rem
}

._description_1f6yc_127 {
    font-size: .75rem;
    color: #fff9;
    line-height: 1.5;
    margin: 0
}

._inputWrapper_1f6yc_134 {
    display: flex;
    gap: .5rem;
    width: 100%
}

._input_1f6yc_134 {
    flex: 1;
    padding: .5rem .75rem;
    background: #ffffff0d;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: .375rem;
    color: #ffffffe6;
    font-size: .8125rem;
    transition: all .15s ease
}

._input_1f6yc_134::placeholder {
    color: #ffffff4d
}

._input_1f6yc_134:focus {
    outline: none;
    border-color: #92ff7766;
    background: #92ff7714;
    box-shadow: 0 0 0 2px #92ff771a
}

._input_1f6yc_134:hover:not(:disabled) {
    border-color: #fff3;
    background: #ffffff14
}

._input_1f6yc_134:disabled {
    opacity: .5;
    cursor: not-allowed
}

._addButton_1f6yc_172 {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: .5rem;
    background: #92ff771a;
    border: 1px solid rgba(146,255,119,.3);
    border-radius: .375rem;
    color: #92ff77e6;
    cursor: pointer;
    transition: all .15s ease
}

._addButton_1f6yc_172 svg {
    width: 1.25rem;
    height: 1.25rem
}

._addButton_1f6yc_172:hover:not(:disabled) {
    background: #92ff7726;
    border-color: #92ff7766;
    transform: translateY(-1px)
}

._addButton_1f6yc_172:active:not(:disabled) {
    transform: translateY(0)
}

._addButton_1f6yc_172:disabled {
    opacity: .3;
    cursor: not-allowed
}

._error_1f6yc_205 {
    font-size: .6875rem;
    color: #ff6b6be6;
    margin: 0;
    margin-top: -.25rem
}

._warning_1f6yc_212 {
    font-size: .6875rem;
    color: #ffc107e6;
    margin: 0;
    padding: .375rem .5rem;
    background: #ffc10714;
    border: 1px solid rgba(255,193,7,.2);
    border-radius: .25rem;
    text-align: center
}

._wordsList_1f6yc_223 {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
    min-height: 2rem
}

._wordItem_1f6yc_230 {
    display: inline-flex;
    align-items: center;
    gap: .25rem;
    padding: .375rem .5rem;
    background: #ffffff14;
    border: 1px solid rgba(255,255,255,.15);
    border-radius: .375rem;
    animation: _fadeIn_1f6yc_1 .2s ease-out
}

@keyframes _fadeIn_1f6yc_1 {
    0% {
        opacity: 0;
        transform: scale(.95)
    }

    to {
        opacity: 1;
        transform: scale(1)
    }
}

._wordText_1f6yc_252 {
    font-size: .75rem;
    color: #ffffffe6;
    font-weight: 500;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
}

._removeButton_1f6yc_262 {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: #ff6b6bb3;
    cursor: pointer;
    padding: 0;
    transition: all .15s ease
}

._removeButton_1f6yc_262 svg {
    width: 1.125rem;
    height: 1.125rem
}

._removeButton_1f6yc_262:hover {
    color: #ff6b6be6;
    transform: scale(1.1)
}

._removeButton_1f6yc_262:active {
    transform: scale(.95)
}

@media (max-width: 768px) {
    ._titleWrapper_1f6yc_15 {
        gap:.375rem
    }

    ._infoIcon_1f6yc_30 svg {
        width: .8125rem;
        height: .8125rem
    }

    ._tooltipContent_1f6yc_71 {
        padding: .625rem
    }

    ._tooltipContent_1f6yc_71 strong {
        font-size: .75rem
    }

    ._tooltipContent_1f6yc_71 p {
        font-size: .6875rem
    }

    ._exampleLabel_1f6yc_104 {
        font-size: .625rem
    }

    ._exampleItems_1f6yc_112 {
        font-size: .6875rem
    }

    ._title_1f6yc_15 {
        font-size: .75rem
    }

    ._counter_1f6yc_118 {
        font-size: .6875rem;
        padding: .125rem .3125rem
    }

    ._description_1f6yc_127 {
        font-size: .6875rem
    }

    ._input_1f6yc_134 {
        font-size: .75rem;
        padding: .4375rem .625rem
    }

    ._addButton_1f6yc_172 {
        padding: .4375rem
    }

    ._addButton_1f6yc_172 svg {
        width: 1.125rem;
        height: 1.125rem
    }

    ._wordText_1f6yc_252 {
        font-size: .6875rem
    }

    ._wordItem_1f6yc_230 {
        padding: .3125rem .4375rem
    }

    ._error_1f6yc_205,._warning_1f6yc_212 {
        font-size: .625rem
    }
}

@media (max-width: 480px) {
    ._titleWrapper_1f6yc_15 {
        gap:.25rem
    }

    ._infoIcon_1f6yc_30 svg {
        width: .75rem;
        height: .75rem
    }

    ._tooltip_1f6yc_51 {
        top: 2rem
    }

    ._tooltipContent_1f6yc_71 {
        padding: .5rem
    }

    ._tooltipContent_1f6yc_71 strong {
        font-size: .6875rem;
        margin-bottom: .25rem
    }

    ._tooltipContent_1f6yc_71 p {
        font-size: .625rem
    }

    ._tooltipExample_1f6yc_94 {
        padding: .25rem .375rem
    }

    ._exampleLabel_1f6yc_104 {
        font-size: .5625rem
    }

    ._exampleItems_1f6yc_112 {
        font-size: .625rem
    }

    ._container_1f6yc_1 {
        gap: .625rem
    }

    ._title_1f6yc_15 {
        font-size: .6875rem
    }

    ._counter_1f6yc_118 {
        font-size: .625rem;
        padding: .0625rem .25rem
    }

    ._description_1f6yc_127 {
        font-size: .625rem;
        line-height: 1.4
    }

    ._input_1f6yc_134 {
        font-size: .6875rem;
        padding: .375rem .5rem
    }

    ._addButton_1f6yc_172 {
        padding: .375rem
    }

    ._addButton_1f6yc_172 svg {
        width: 1rem;
        height: 1rem
    }

    ._wordsList_1f6yc_223 {
        gap: .375rem
    }

    ._wordText_1f6yc_252 {
        font-size: .625rem
    }

    ._wordItem_1f6yc_230 {
        padding: .25rem .375rem
    }

    ._removeButton_1f6yc_262 svg {
        width: 1rem;
        height: 1rem
    }

    ._error_1f6yc_205,._warning_1f6yc_212 {
        font-size: .5625rem;
        padding: .3125rem .4375rem
    }
}

@media (prefers-reduced-motion: reduce) {
    ._wordItem_1f6yc_230 {
        animation: none
    }

    ._addButton_1f6yc_172,._removeButton_1f6yc_262 {
        transition: none
    }
}

@media (prefers-contrast: high) {
    ._input_1f6yc_134,._addButton_1f6yc_172,._wordItem_1f6yc_230,._warning_1f6yc_212 {
        border-width: 2px
    }
}

._container_1uq3h_1 {
    display: flex;
    flex-direction: column;
    gap: .75rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,.1);
    position: relative
}

._header_1uq3h_11 {
    display: flex;
    justify-content: space-between;
    align-items: center
}

._titleWrapper_1uq3h_17 {
    display: flex;
    align-items: center;
    gap: .5rem
}

._title_1uq3h_17 {
    font-size: .8125rem;
    font-weight: 600;
    color: #ffffffe6;
    text-transform: uppercase;
    letter-spacing: .02em;
    margin: 0
}

._infoIcon_1uq3h_32 {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: #fff6;
    cursor: pointer;
    padding: 0;
    transition: color .2s ease
}

._infoIcon_1uq3h_32:hover {
    color: #92ff77b3
}

._infoIcon_1uq3h_32 svg {
    width: .875rem;
    height: .875rem
}

._toggleWrapper_1uq3h_53 {
    position: relative;
    display: inline-block;
    width: 2.5rem;
    height: 1.375rem;
    cursor: pointer
}

._toggleInput_1uq3h_61 {
    opacity: 0;
    width: 0;
    height: 0
}

._toggleSlider_1uq3h_67 {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: #ffffff1a;
    transition: .3s;
    border-radius: 1.375rem
}

._toggleSlider_1uq3h_67:before {
    position: absolute;
    content: "";
    height: 1rem;
    width: 1rem;
    left: .1875rem;
    bottom: .1875rem;
    background-color: #ffffff80;
    transition: .3s;
    border-radius: 50%
}

._toggleInput_1uq3h_61:checked+._toggleSlider_1uq3h_67 {
    background-color: #92ff774d
}

._toggleInput_1uq3h_61:checked+._toggleSlider_1uq3h_67:before {
    transform: translate(1.125rem);
    background-color: #92ff77e6
}

._content_1uq3h_100 {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    animation: _fadeIn_1uq3h_1 .2s ease-out
}

@keyframes _fadeIn_1uq3h_1 {
    0% {
        opacity: 0;
        transform: translateY(-.25rem)
    }

    to {
        opacity: 1;
        transform: translateY(0)
    }
}

._textarea_1uq3h_118 {
    width: 100%;
    padding: .75rem;
    background: #0000004d;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: .5rem;
    color: #ffffffe6;
    font-size: .875rem;
    font-family: inherit;
    resize: vertical;
    transition: all .2s ease
}

._textarea_1uq3h_118:focus {
    outline: none;
    border-color: #92ff7780;
    background: #0006
}

._textarea_1uq3h_118::placeholder {
    color: #ffffff4d
}

._charCounter_1uq3h_141 {
    align-self: flex-end;
    font-size: .75rem;
    color: #fff6;
    padding: .125rem .375rem;
    background: #ffffff0d;
    border-radius: .25rem
}

._tooltip_1uq3h_150 {
    position: absolute;
    top: 2.5rem;
    left: 0;
    right: 0;
    z-index: 1000;
    animation: _fadeInTooltip_1uq3h_1 .2s ease-out
}

@keyframes _fadeInTooltip_1uq3h_1 {
    0% {
        opacity: 0;
        transform: translateY(-.25rem)
    }

    to {
        opacity: 1;
        transform: translateY(0)
    }
}

._tooltipContent_1uq3h_170 {
    background: #141414fa;
    border: 1px solid rgba(146,255,119,.2);
    border-radius: .5rem;
    padding: .75rem;
    box-shadow: 0 8px 24px #0006
}

._tooltipContent_1uq3h_170 strong {
    display: block;
    color: #92ff77e6;
    font-size: .8125rem;
    margin-bottom: .375rem;
    font-weight: 600
}

._tooltipContent_1uq3h_170 p {
    color: #fffc;
    font-size: .75rem;
    line-height: 1.4;
    margin: 0 0 .5rem
}

._tooltipExample_1uq3h_193 {
    padding: .375rem .5rem;
    background: #92ff7714;
    border: 1px solid rgba(146,255,119,.15);
    border-radius: .25rem;
    display: flex;
    flex-direction: column;
    gap: .25rem
}

._exampleLabel_1uq3h_203 {
    color: #92ff77e6;
    font-size: .6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .03em
}

._exampleItems_1uq3h_211 {
    color: #ffffffe6;
    font-size: .75rem;
    font-style: italic
}

@media (max-width: 768px) {
    ._titleWrapper_1uq3h_17 {
        gap:.375rem
    }

    ._infoIcon_1uq3h_32 svg {
        width: .8125rem;
        height: .8125rem
    }

    ._tooltipContent_1uq3h_170 {
        padding: .625rem
    }

    ._tooltipContent_1uq3h_170 strong {
        font-size: .75rem
    }

    ._tooltipContent_1uq3h_170 p {
        font-size: .6875rem
    }

    ._exampleLabel_1uq3h_203 {
        font-size: .625rem
    }

    ._exampleItems_1uq3h_211 {
        font-size: .6875rem
    }

    ._title_1uq3h_17 {
        font-size: .75rem
    }

    ._textarea_1uq3h_118 {
        font-size: .8125rem;
        padding: .625rem
    }

    ._charCounter_1uq3h_141 {
        font-size: .6875rem
    }
}

@media (max-width: 480px) {
    ._titleWrapper_1uq3h_17 {
        gap:.25rem
    }

    ._infoIcon_1uq3h_32 svg {
        width: .75rem;
        height: .75rem
    }

    ._tooltip_1uq3h_150 {
        top: 2rem
    }

    ._tooltipContent_1uq3h_170 {
        padding: .5rem
    }

    ._tooltipContent_1uq3h_170 strong {
        font-size: .6875rem;
        margin-bottom: .25rem
    }

    ._tooltipContent_1uq3h_170 p {
        font-size: .625rem
    }

    ._tooltipExample_1uq3h_193 {
        padding: .25rem .375rem
    }

    ._exampleLabel_1uq3h_203 {
        font-size: .5625rem
    }

    ._exampleItems_1uq3h_211 {
        font-size: .625rem
    }

    ._container_1uq3h_1 {
        gap: .625rem
    }

    ._title_1uq3h_17 {
        font-size: .6875rem
    }

    ._textarea_1uq3h_118 {
        font-size: .75rem;
        padding: .5rem
    }

    ._charCounter_1uq3h_141 {
        font-size: .625rem
    }
}

._customDivider_7bh05_1 {
    display: none;
    align-items: center;
    margin-bottom: .5rem;
    overflow: hidden;
    width: 100%;
    min-width: 50%;
    justify-content: center;
    position: relative
}

@media (min-width: 640px) {
    ._customDivider_7bh05_1 {
        min-width:80%
    }
}

._customDividerLine_7bh05_18 {
    position: absolute;
    width: 100%;
    left: 0;
    transform: translateY(50%);
    z-index: 0
}

._customDividerText_7bh05_26 {
    padding-left: 0;
    padding-right: 0;
    white-space: normal;
    margin-bottom: 0;
    z-index: 1
}

._headerContainer_1nj3h_1 {
    box-shadow: 0 4px 6px #0000001a,0 2px 4px #0000000f;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    right: 0;
    flex-direction: column;
    background: #313338ba;
    z-index: 11;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px)
}

._headerGrid_1nj3h_17 {
    display: grid;
    grid-template-columns: repeat(2,1fr);
    align-items: center;
    width: 100%;
    max-width: 100%
}

@media (min-width: 768px) {
    ._headerGrid_1nj3h_17 {
        max-width:42rem
    }
}

@media (min-width: 1024px) {
    ._headerGrid_1nj3h_17 {
        max-width:36rem
    }
}

@media (min-width: 1280px) {
    ._headerGrid_1nj3h_17 {
        max-width:42rem
    }
}

._soundcloudPlayer_1nj3h_43 {
    width: 100%;
    max-width: 100%;
    background: #000;
    border-radius: .375rem;
    overflow: hidden;
    opacity: .8;
    margin-bottom: .4rem
}

@media (min-width: 768px) {
    ._soundcloudPlayer_1nj3h_43 {
        max-width:42rem
    }
}

@media (min-width: 1024px) {
    ._soundcloudPlayer_1nj3h_43 {
        max-width:36rem
    }
}

@media (min-width: 1280px) {
    ._soundcloudPlayer_1nj3h_43 {
        max-width:42rem
    }
}

._soundcloudSkeleton_1nj3h_71 {
    height: 20px;
    width: 100%;
    background: linear-gradient(90deg,#553c9a 25%,#4a5568,#553c9a 75%);
    background-size: 200% 100%;
    animation: _shimmer_1nj3h_1 1.5s infinite
}

@keyframes _shimmer_1nj3h_1 {
    0% {
        background-position: 200% 0
    }

    to {
        background-position: -200% 0
    }
}

._botMessageControlWrapper_1kfiv_1 {
    position: absolute;
    bottom: 0;
    z-index: 1
}

._botMessageControlWrapper_1kfiv_1._left_1kfiv_7 {
    left: 0
}

._botMessageControlWrapper_1kfiv_1._right_1kfiv_11 {
    right: 0
}

._botChoicesContainer_sisz1_1 {
    overflow-x: hidden;
    position: relative;
    padding-bottom: .5rem
}

._botChoicesSpacer_sisz1_7 {
    padding-bottom: .75rem
}

._botChoicesSlider_sisz1_11 {
    text-align: left;
    display: flex;
    min-height: 5rem;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch
}

._botChoicesSlider_sisz1_11>* {
    flex: 0 0 100%;
    width: 100%;
    scroll-snap-align: start
}

._botChoiceButton_sisz1_26 {
    background: transparent;
    border: none;
    border-radius: 50%;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    transition: background-color .2s
}

._botChoiceButton_sisz1_26:hover {
    background-color: #805ad51a
}

._botChoiceButton_sisz1_26._right_sisz1_44 {
    margin-left: auto;
    margin-right: .375rem
}

._botChoiceButton_sisz1_26[disabled] {
    opacity: .5
}

._messageCounter_sisz1_53 {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    bottom: .05rem;
    color: #e4e5e977;
    font-size: .875rem;
    font-weight: 900;
    text-align: center;
    font-family: "GG Sans",sans-serif;
    transition: opacity .3s ease-in-out;
    z-index: 0
}

._messageCounter_sisz1_53._visible_sisz1_67 {
    opacity: 1
}

._messageCounter_sisz1_53._hidden_sisz1_71 {
    opacity: 0
}

._thinkTagContainer_ll1ul_2 {
    width: 100%;
    margin: .5rem 0;
    opacity: 0;
    transform: translateY(5px);
    transition: all .3s cubic-bezier(.4,0,.2,1)
}

._thinkTagContainer_ll1ul_2._visible_ll1ul_10 {
    opacity: 1;
    transform: translateY(0)
}

._thinkContent_ll1ul_16 {
    background: #ffffff0d;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px #0003,inset 0 1px #ffffff1a;
    position: relative
}

._thinkHeader_ll1ul_28 {
    display: flex;
    align-items: center;
    gap: .375rem;
    padding: .18rem .375rem;
    background: #ffffff05;
    border-bottom: 1px solid rgba(255,255,255,.05)
}

._thinkIcon_ll1ul_37 {
    font-size: .8rem;
    filter: grayscale(.2);
    animation: _subtle-bounce_ll1ul_1 2s ease-in-out infinite
}

@keyframes _subtle-bounce_ll1ul_1 {
    0%,to {
        transform: translateY(0)
    }

    50% {
        transform: translateY(-2px)
    }
}

._thinkTitle_ll1ul_53 {
    font-size: .65rem;
    font-weight: 600;
    color: #ffffff80;
    letter-spacing: .3px;
    text-transform: uppercase
}

._streamingIndicator_ll1ul_62 {
    display: flex;
    align-items: center;
    gap: 3px;
    margin-left: auto
}

._dot_ll1ul_69 {
    width: 4px;
    height: 4px;
    background: #60a5fa99;
    border-radius: 50%;
    animation: _pulse_ll1ul_1 1.4s ease-in-out infinite
}

._dot_ll1ul_69:nth-child(2) {
    animation-delay: .2s
}

._dot_ll1ul_69:nth-child(3) {
    animation-delay: .4s
}

@keyframes _pulse_ll1ul_1 {
    0%,60%,to {
        opacity: .3;
        transform: scale(1)
    }

    30% {
        opacity: 1;
        transform: scale(1.2)
    }
}

._thinkBody_ll1ul_99 {
    padding: .5rem .75rem;
    font-family: SF Mono,Monaco,Inconsolata,Roboto Mono,Consolas,monospace;
    font-size: .7rem;
    line-height: 1.4;
    color: #fff9;
    white-space: pre-wrap;
    word-break: break-word;
    position: relative;
    max-height: 100px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,.2) transparent
}

._thinkBody_ll1ul_99::-webkit-scrollbar {
    width: 4px
}

._thinkBody_ll1ul_99::-webkit-scrollbar-track {
    background: transparent
}

._thinkBody_ll1ul_99::-webkit-scrollbar-thumb {
    background: #fff3;
    border-radius: 2px
}

._thinkBody_ll1ul_99::-webkit-scrollbar-thumb:hover {
    background: #ffffff4d
}

._thinkContent_ll1ul_16._streamingContainer_ll1ul_134:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to bottom,transparent,rgba(0,0,0,.3));
    pointer-events: none;
    animation: _fade-in-out_ll1ul_1 2s ease-in-out infinite
}

@keyframes _fade-in-out_ll1ul_1 {
    0%,to {
        opacity: 0
    }

    50% {
        opacity: 1
    }
}

._thinkBody_ll1ul_99>* {
    animation: _slide-in_ll1ul_1 .3s ease-out
}

@keyframes _slide-in_ll1ul_1 {
    0% {
        opacity: 0;
        transform: translate(-5px)
    }

    to {
        opacity: 1;
        transform: translate(0)
    }
}

@media (max-width: 768px) {
    ._thinkTagContainer_ll1ul_2 {
        margin:.5rem 0
    }

    ._thinkHeader_ll1ul_28 {
        padding: .375rem .625rem
    }

    ._thinkIcon_ll1ul_37 {
        font-size: .75rem
    }

    ._thinkTitle_ll1ul_53 {
        font-size: .6rem
    }

    ._thinkBody_ll1ul_99 {
        padding: .5rem .625rem;
        font-size: .65rem;
        max-height: 100px
    }

    ._dot_ll1ul_69 {
        width: 3px;
        height: 3px
    }
}

@media (max-width: 480px) {
    ._thinkContent_ll1ul_16 {
        border-radius:10px
    }

    ._thinkHeader_ll1ul_28 {
        padding: .3rem .5rem;
        gap: .25rem
    }

    ._thinkIcon_ll1ul_37 {
        font-size: .7rem
    }

    ._thinkTitle_ll1ul_53 {
        font-size: .55rem
    }

    ._thinkBody_ll1ul_99 {
        padding: .4rem .5rem;
        font-size: .6rem;
        max-height: 80px
    }
}

@media (prefers-reduced-motion: reduce) {
    ._thinkTagContainer_ll1ul_2,._thinkIcon_ll1ul_37,._dot_ll1ul_69,._thinkBody_ll1ul_99>* {
        animation: none!important;
        transition: none!important
    }

    ._thinkTagContainer_ll1ul_2._visible_ll1ul_10 {
        opacity: 1;
        transform: none
    }
}

@media (prefers-contrast: high) {
    ._thinkContent_ll1ul_16 {
        border: 2px solid rgba(255,255,255,.3)
    }

    ._thinkHeader_ll1ul_28 {
        border-bottom: 2px solid rgba(255,255,255,.2)
    }

    ._thinkBody_ll1ul_99 {
        color: #fffc
    }
}

._controlPanel_1v19f_2 {
    display: flex;
    align-items: center;
    gap: 0
}

._controlPanelButton_1v19f_8 {
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all .2s ease-in-out;
    position: relative;
    min-width: 2rem;
    min-height: 2rem;
    font-size: 1rem;
    outline: 2px solid transparent;
    outline-offset: 2px
}

._controlPanelButton_1v19f_8:hover {
    background-color: #ffffff14
}

._controlPanelButton_1v19f_8:active {
    background-color: #ffffff1f
}

._controlPanelButton_1v19f_8 svg {
    width: 1em;
    height: 1em
}

._tooltipContainer_1v19f_40 {
    position: relative;
    display: inline-block
}

._tooltip_1v19f_40 {
    display: none
}

._deletePopoverBackdrop_1v19f_50 {
    position: fixed;
    inset: 0;
    background-color: transparent;
    z-index: 999998;
    border: none;
    padding: 0;
    margin: 0;
    cursor: default
}

._deletePopover_1v19f_50 {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #ffffff1a;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 0 20px 10px #0000004d;
    min-width: 280px;
    max-width: 90vw;
    z-index: 999999;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none
}

._deletePopoverHeader_1v19f_83 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(255,255,255,.08)
}

._deletePopoverHeader_1v19f_83 h3 {
    margin: 0;
    color: #fff;
    font-size: 16px;
    font-weight: 600
}

._deletePopoverClose_1v19f_98 {
    background: none;
    border: none;
    color: #fff9;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all .2s ease
}

._deletePopoverClose_1v19f_98:hover {
    background-color: #ffffff1a;
    color: #fff
}

._deletePopoverBody_1v19f_119 {
    padding: 18px;
    color: #ffffffe6;
    font-size: 14px;
    line-height: 1.5
}

._deletePopoverFooter_1v19f_126 {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 14px 18px
}

._deletePopoverButton_1v19f_133 {
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s ease;
    border: none
}

._deletePopoverButton_1v19f_133._cancel_1v19f_143 {
    background-color: #ffffff1a;
    color: #ffffffe6;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px)
}

._deletePopoverButton_1v19f_133._cancel_1v19f_143:hover {
    background-color: #ffffff26;
    color: #fff
}

._deletePopoverButton_1v19f_133._confirm_1v19f_154 {
    background-color: #e53e3ee6;
    color: #fff;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px)
}

._deletePopoverButton_1v19f_133._confirm_1v19f_154:hover {
    background-color: #c53030f2
}

._deletePopoverButton_1v19f_133._confirm_1v19f_154:active {
    background-color: #9b2c2cf2
}

._editPanel_1v19f_169 {
    display: flex;
    align-items: center;
    gap: 0
}

._editPanelButton_1v19f_175 {
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all .2s ease-in-out;
    min-width: 2rem;
    min-height: 2rem;
    font-size: 1rem;
    outline: 2px solid transparent;
    outline-offset: 2px
}

._editPanelButton_1v19f_175:hover {
    background-color: #ffffff14
}

._editPanelButton_1v19f_175:active {
    background-color: #ffffff1f
}

._editPanelButton_1v19f_175 svg {
    width: 1em;
    height: 1em
}

._editPanelButton_1v19f_175._save_1v19f_205 svg {
    color: #38a169
}

._editPanelButton_1v19f_175._cancel_1v19f_143 svg {
    color: #e53e3e
}

._enlargedAvatarOverlay_1v19f_214 {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    background: #00000045;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    padding: 16px 2px 2px;
    border-radius: 4px;
    box-shadow: 0 10px 15px -3px #0000001a,0 4px 6px -2px #0000000d;
    will-change: transform;
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;
    transform: translateY(10%);
    display: inline-block;
    image-rendering: high-quality
}

@media (min-width: 992px) {
    ._enlargedAvatarOverlay_1v19f_214 {
        top:auto;
        bottom: 0;
        transform: translateY(-10%)
    }
}

._enlargedAvatarImage_1v19f_242 {
    width: 100%;
    height: auto;
    border-radius: 4px;
    object-fit: cover
}

._enlargedAvatarClose_1v19f_249 {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    color: #9560d2;
    background: none;
    border: none;
    font-size: 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center
}

._enlargedAvatarClose_1v19f_249:hover {
    color: #b794f6
}

._nameContainer_1v19f_269 {
    display: flex;
    align-items: center;
    width: 100%
}

._nameText_1v19f_275 {
    font-weight: 600;
    margin-right: 8px;
    font-size: 16.8px
}

._nameIcon_1v19f_281 {
    height: .8em;
    width: auto;
    position: relative;
    bottom: 0;
    display: none;
}

._messageAvatarContainer_1v19f_289 {
    flex: none;
    display: inline-block
}

._messageAvatarContainer_1v19f_289 button {
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    display: block;
    outline: 2px solid transparent;
    outline-offset: 2px;
    transition: all .2s ease-in-out
}

._messageAvatarImage_1v19f_305 {
    border-radius: 6px;
    object-fit: cover;
    cursor: pointer;
    transition: opacity .2s ease-in-out;
    display: block
}

._messageAvatarImage_1v19f_305:hover {
    opacity: .8
}

._messageAvatarImage_1v19f_305 {
    width: 45px;
    height: 45px
}

@media (min-width: 768px) {
    ._messageAvatarImage_1v19f_305 {
        width:65px;
        height: 65px
    }
}

@media (min-width: 992px) {
    ._messageAvatarImage_1v19f_305 {
        width:65px;
        height: 65px
    }
}

._messageAvatarImage_1v19f_305._borderRadiusSm_1v19f_340 {
    border-radius: 2px
}

._messageAvatarImage_1v19f_305._borderRadiusMd_1v19f_344 {
    border-radius: 50%
}

._messageAvatarImage_1v19f_305._borderRadiusLg_1v19f_348 {
    border-radius: 8px
}

._messageAvatarImage_1v19f_305._borderRadiusXl_1v19f_352 {
    border-radius: 12px
}

._messageAvatarImage_1v19f_305._borderRadiusFull_1v19f_356 {
    border-radius: 50%
}

._ratingWrapper_1v19f_361 {
    position: absolute;
    bottom: -1.4rem;
    align-self: flex-end
}

._starRatingContainer_165md_1 {
    display: flex;
    align-items: flex-end
}

._starRatingGroup_165md_6 {
    display: flex;
    gap: .5rem
}

._starRadio_165md_11 {
    display: none
}

._starIcon_165md_15 {
    width: 1rem;
    height: 1rem;
    transition: transform .2s;
    cursor: pointer
}

._starIcon_165md_15._disabled_165md_22 {
    cursor: not-allowed
}

._starIcon_165md_15._jumping_165md_26 {
    animation: _jump_165md_26 .3s
}

@keyframes _jump_165md_26 {
    0% {
        transform: translateY(0)
    }

    50% {
        transform: translateY(-5px)
    }

    to {
        transform: translateY(0)
    }
}

._messageDisplayWrapper_2xqwb_2 {
    width: 100%;
    position: relative;
    flex: 0 0 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    list-style-type: none;
    padding: 12px 12px 12px 0
}

._hasRating_2xqwb_13 {
    margin-bottom: 1rem
}

._messageControls_2xqwb_18 {
    position: absolute;
    right: 0;
    top: .1rem;
    z-index: 10
}

._messageContent_2xqwb_26 {
    width: 100%;
    display: flex;
    gap: 12px;
    position: relative
}

._messageContent_2xqwb_26._hasDecoration_2xqwb_33 {
    padding-left: 12px;
    padding-right: 12px
}

._avatarDecoration_2xqwb_39 {
    position: absolute;
    object-fit: contain;
    pointer-events: none
}

._avatarDecoration_2xqwb_39._mobile_2xqwb_45 {
    top: -13px;
    left: -1px;
    width: 70px;
    height: 70px
}

._avatarDecoration_2xqwb_39._desktop_2xqwb_52 {
    top: -20px;
    left: -7px;
    width: 102px;
    height: 102px
}

._messageBody_2xqwb_60 {
    flex: 1;
    min-width: 0
}

@media (max-width: 767px) {
    ._messageDisplayWrapper_2xqwb_2 {
        padding:8px 8px 8px 0
    }

    ._messageContent_2xqwb_26 {
        gap: 8px
    }
}

._messagesWrapper_1swu7_1 {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: center;
    padding-left: .5rem
}

._messagesMain_1swu7_10 {
    max-width: 100%;
    width: 100%;
    height: 100%
}

@media (min-width: 30em) {
    ._messagesMain_1swu7_10 {
        max-width:42rem
    }
}

._scrollToBottomButton_7mkvk_1 {
    background: #0000004d;
    color: #fff;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    position: absolute;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    margin-top: -2.5rem;
    transition: background-color .2s;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px)
}

@media screen and (max-width: 48em) {
    ._scrollToBottomButton_7mkvk_1 {
        left:.5rem;
        transform: none
    }
}

@media screen and (min-width: 48em) {
    ._scrollToBottomButton_7mkvk_1 {
        left:50%;
        transform: translate(-50%)
    }
}

._skeletonHeader_12v9v_1 {
    display: flex;
    align-items: center;
    justify-content: center
}

._skeletonHeaderFixed_12v9v_7 {
    width: 100vw;
    box-shadow: 0 4px 6px -1px #0000001a;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    flex-direction: column;
    background: #ffffff;
    z-index: 1
}

._skeletonHeaderContent_12v9v_20 {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 100%;
    padding-left: .5rem;
    padding-right: .5rem
}

@media (min-width: 768px) {
    ._skeletonHeaderContent_12v9v_20 {
        max-width:42rem
    }
}

@media (min-width: 1024px) {
    ._skeletonHeaderContent_12v9v_20 {
        max-width:36rem
    }
}

@media (min-width: 1280px) {
    ._skeletonHeaderContent_12v9v_20 {
        max-width:42rem
    }
}

._skeletonHeaderRow_12v9v_48 {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    margin-top: .5rem
}

._skeletonBox_12v9v_56 {
    background: linear-gradient(90deg,#ff001826,#ffa52c26,#ffff4426,#00801826,#0000f926,#86007d26,#ff001826);
    background-size: 200% 100%;
    animation: _shimmer_12v9v_1 2s infinite;
    border-radius: .25rem
}

._skeletonContent_12v9v_72 {
    display: flex;
    width: 100%;
    margin-top: 5rem;
    gap: 1rem;
    padding: .5rem;
    justify-content: flex-start;
    align-items: flex-start
}

@media (min-width: 640px) {
    ._skeletonContent_12v9v_72 {
        padding-left:1rem;
        padding-right: 1rem
    }
}

@media (min-width: 768px) {
    ._skeletonContent_12v9v_72 {
        max-width:100%
    }
}

@media (min-width: 1024px) {
    ._skeletonContent_12v9v_72 {
        max-width:36rem
    }
}

@media (min-width: 1280px) {
    ._skeletonContent_12v9v_72 {
        max-width:42rem
    }
}

._skeletonAvatar_12v9v_107 {
    width: 60px;
    height: 60px;
    border-radius: .5rem;
    flex-shrink: 0
}

._skeletonMessageContent_12v9v_114 {
    width: 100%
}

._skeletonMessageHeader_12v9v_118 {
    width: 120px;
    height: 18px;
    margin-bottom: 1.5rem
}

._skeletonMessageLines_12v9v_124 {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    width: 100%
}

._skeletonLine_12v9v_131 {
    width: 100%;
    height: 12px
}

@keyframes _shimmer_12v9v_1 {
    0% {
        background-position: 200% 0
    }

    to {
        background-position: -200% 0
    }
}

/* Estilos para el header estilo Discord Mobile */
._headerContainer_1nj3h_1 {
    background: #36393e !important;
    border-bottom: 1px solid #424549 !important;
}

._headerGrid_1nj3h_17.discord-modified {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 0.5rem 1rem !important;
    background: #36393e !important;
}

.discord-header-left {
    display: flex !important;
    align-items: center !important;
    gap: 0.75rem !important;
    flex: 1 !important;
}

.discord-header-back {
    color: #dcddde !important;
    padding: 0.25rem !important;
    margin: 0 !important;
    background: transparent !important;
    border: none !important;
}

.discord-header-back:hover {
    background: #424549 !important;
    border-radius: 4px !important;
}

.discord-header-back svg {
    width: 1.5rem !important;
    height: 1.5rem !important;
}

.discord-header-avatar {
    width: 2rem !important;
    height: 2rem !important;
    border-radius: 50% !important;
    object-fit: cover !important;
    flex-shrink: 0 !important;
}

.discord-header-name {
    color: #dcddde !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}

.discord-header-right {
    display: flex !important;
    align-items: center !important;
    gap: 0.5rem !important;
}

.discord-header-right button._apiTag_hs488_11 {
    color: #b9bbbe !important;
    font-size: 0.875rem !important;
    padding: 0.25rem 0.5rem !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer !important;
}

.discord-header-right button._apiTag_hs488_11:hover {
    background: #424549 !important;
    border-radius: 4px !important;
}


    `;

    // Crea el elemento <style>
    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;

    // Añádelo al <head> del documento
    document.head.appendChild(styleElement);

    // Zona de modificación del placeholder del chat - Cambia el placeholder del textarea para mostrar "Message @nombre" usando el título de la página y establece el height a 56px
    const updateChatPlaceholder = () => { const pageTitle = document.title; const chatTextarea = document.querySelector('textarea._chatTextarea_dzva7_1'); if (chatTextarea) { chatTextarea.placeholder = `Message @${pageTitle}`; chatTextarea.style.height = '56px'; } };
    // Zona de modificación del botón de menú - Cambia el icono del botón a un "+" y asegura que esté posicionado correctamente a la izquierda
    const updateMenuButton = () => { const menuButton = document.querySelector('button._menuButton_17cr1_32'); if (menuButton) { const svg = menuButton.querySelector('svg'); if (svg) { if (svg.getAttribute('viewBox') !== '0 0 24 24') { svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none'); svg.setAttribute('stroke-width', '2'); svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round'); svg.innerHTML = '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'; } svg.setAttribute('stroke', '#eaeaeb'); } } };
    // Zona de modificación del botón de envío - Reemplaza el SVG del botón de envío con una imagen personalizada (Base64 o SVG)
    const updateSendButton = () => { const sendButton = document.querySelector('button._sendButton_17cr1_106'); if (sendButton) { const svg = sendButton.querySelector('svg'); if (svg && !svg.classList.contains('custom-icon')) { const imageBase64 = 'data:image/png;base64,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'; if (imageBase64) { const img = document.createElement('img'); img.src = imageBase64; img.style.width = '5em'; sendButton.innerHTML = ''; sendButton.appendChild(img); } else { svg.classList.add('custom-icon'); } } } };
    // Zona de extracción de avatar del bot - Extrae y muestra la URL del avatar del bot cuando se encuentra
    const extractedAvatars = new Set(); let botAvatarUrl = null;
    const extractBotAvatar = () => {
        if (botAvatarUrl) { return; }
        const avatarImages = document.querySelectorAll('img._messageAvatarImage_1v19f_305[src*="bot-avatars"]');
        avatarImages.forEach(img => {
            const avatarUrl = img.getAttribute('src');
            if (avatarUrl && !extractedAvatars.has(avatarUrl)) {
                console.log('URL del avatar del bot:', avatarUrl);
                extractedAvatars.add(avatarUrl);
                if (!botAvatarUrl) { botAvatarUrl = avatarUrl; }
            }
        });
        if (!botAvatarUrl) {
            const characterAvatar = document.querySelector('img[src*="character-avatars"]');
            if (characterAvatar) { botAvatarUrl = characterAvatar.getAttribute('src'); }
        }
        if (!botAvatarUrl) {
            const anyAvatar = document.querySelector('img[src*="avatars"]');
            if (anyAvatar) { botAvatarUrl = anyAvatar.getAttribute('src'); }
        }
    };
    // Zona de modificación del header estilo Discord Mobile - Transforma el header para que se parezca a Discord Mobile
    const updateDiscordHeader = () => {
        const headerContainer = document.querySelector('._headerContainer_1nj3h_1');
        const headerGrid = document.querySelector('._headerGrid_1nj3h_17');
        if (!headerContainer || !headerGrid) { return; }
        const leftContainer = headerGrid.querySelector('.discord-header-left');
        if (leftContainer && botAvatarUrl && !leftContainer.querySelector('.discord-header-avatar')) {
            const avatarImg = document.createElement('img');
            avatarImg.src = botAvatarUrl;
            avatarImg.className = 'discord-header-avatar';
            avatarImg.alt = 'Avatar';
            const backButton = leftContainer.querySelector('.discord-header-back');
            if (backButton) {
                leftContainer.insertBefore(avatarImg, backButton.nextSibling);
            } else {
                leftContainer.insertBefore(avatarImg, leftContainer.firstChild);
            }
            return;
        }
        if (headerGrid.classList.contains('discord-modified')) { return; }
        const backButton = headerGrid.querySelector('button[style*="align-items: center"]');
        const nameButton = document.querySelector('button#character-name-button');
        const apiTag = headerGrid.querySelector('button._apiTag_hs488_11');
        const menuWrapper = headerGrid.querySelector('._menuWrapper_hs488_2');
        if (!nameButton) { return; }
        const name = nameButton.textContent.trim();
        headerGrid.classList.add('discord-modified');
        const newLeftContainer = document.createElement('div');
        newLeftContainer.className = 'discord-header-left';
        if (backButton) {
            const clonedBackButton = backButton.cloneNode(true);
            clonedBackButton.classList.add('discord-header-back');
            const span = clonedBackButton.querySelector('span');
            if (span) { span.style.display = 'none'; }
            newLeftContainer.appendChild(clonedBackButton);
            clonedBackButton.addEventListener('click', () => { backButton.click(); });
        }
        if (botAvatarUrl) {
            const avatarImg = document.createElement('img');
            avatarImg.src = botAvatarUrl;
            avatarImg.className = 'discord-header-avatar';
            avatarImg.alt = 'Avatar';
            newLeftContainer.appendChild(avatarImg);
        }
        const nameDiv = document.createElement('div');
        nameDiv.className = 'discord-header-name';
        nameDiv.textContent = name || document.title;
        newLeftContainer.appendChild(nameDiv);
        const rightContainer = document.createElement('div');
        rightContainer.className = 'discord-header-right';
        if (apiTag) {
            const clonedApiTag = apiTag.cloneNode(true);
            clonedApiTag.textContent = '*';
            clonedApiTag.innerHTML = '*';
            rightContainer.appendChild(clonedApiTag);
            clonedApiTag.addEventListener('click', () => { apiTag.click(); });
        }
        if (menuWrapper) {
            rightContainer.appendChild(menuWrapper.cloneNode(true));
        }
        const fragment = document.createDocumentFragment();
        fragment.appendChild(newLeftContainer);
        fragment.appendChild(rightContainer);
        headerGrid.innerHTML = '';
        headerGrid.appendChild(fragment);
    };
    const updateAll = () => { updateChatPlaceholder(); updateMenuButton(); updateSendButton(); extractBotAvatar(); updateDiscordHeader(); };
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', updateAll); } else { updateAll(); }
    const observer = new MutationObserver(() => { updateAll(); }); observer.observe(document.body, { childList: true, subtree: true });
})();