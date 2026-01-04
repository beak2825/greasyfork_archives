// ==UserScript==
// @name         DarkTheme
// @namespace    http://tampermonkey.net/
// @version      2025-11-10
// @description  просто цвет на тёмный меняет <3
// @author       .hilkach.
// @license MIT
// @match        https://pixelbattles.ru/*
// @match        https://pixelbattles.ru/timelapse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555388/DarkTheme.user.js
// @updateURL https://update.greasyfork.org/scripts/555388/DarkTheme.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const infoBox = document.createElement("div");
    infoBox.innerHTML = `
        <div id="hilkachInfo" style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.85);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 0 12px rgba(0,0,0,0.6);
            z-index: 30000;
            font-family: 'Segoe UI', sans-serif;
            text-align: center;
            width: 320px;
            animation: fadeIn 0.6s ease;
        ">
            <div style="font-weight: bold; font-size: 18px; margin-bottom: 6px;">хилкач не делал это XD</div>
            <div style="font-size: 14px; margin-bottom: 8px; line-height: 1.5;">
                Discord: <span style="color:#5cc87f;">.hilkach.</span><br>
                YouTube: <a href="https://www.youtube.com/@hilkashosho" target="_blank" style="color:#4d90e3; text-decoration:none;">youtube.com/@hilkashosho</a><br>
                Twitch: <a href="https://www.twitch.tv/mreklick" target="_blank" style="color:#a754ba; text-decoration:none;">twitch.tv/mreklick</a>
            </div>
            <button id="closeInfoBtn" style="
                background: #ec5427;
                color: white;
                border: none;
                padding: 6px 10px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
            ">Закрыть</button>
        </div>
        <style>
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -20px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
        </style>
    `;
    document.body.appendChild(infoBox);

    document.getElementById("closeInfoBtn").addEventListener("click", () => {
        infoBox.remove();
    });

    const style = document.createElement('style');
style.textContent = `
._1s_2Dq_root {
    box-sizing: border-box;
    background: #36393f;
    border: 3px solid #2f3136;
    border-color: #40444b #2f3136 #2f3136 #40444b;
    border-radius: 3px;
    flex-direction: column;
    gap: 3px;
    padding: 4px;
    display: flex;
    position: absolute
}

._1s_2Dq_button {
    box-sizing: border-box;
    cursor: pointer;
    background-color: #4f545c;
    border: 2px solid #2f3136;
    border-color: #40444b #2f3136 #2f3136 #40444b;
    border-radius: 3px;
    padding: 5px;
    line-height: 0
}

._1s_2Dq_button:hover {
    background-color: #5d6269
}

._1s_2Dq_button:active {
    background-color: #36393f;
    border-color: #2f3136 #40444b #40444b #2f3136;
    padding: 6px 4px 4px 6px
}

._1s_2Dq_draggable {
    cursor: grab;
    background-image: linear-gradient(#0000 0% 49.9%,#2f3136 50% 74.9%,#72767d 75% 100%);
    background-size: 4px 4px;
    width: 100%;
    height: 16px;
    margin-bottom: 5px
}

.bZsByG_root {
    background-color: #2f3136;
    background-image: repeating-conic-gradient(#36393f 0% 25%,#40444b 0% 50%);
    background-position: 0 0,16px 16px;
    background-size: 32px 32px;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden
}

.bZsByG_workbench {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0
}

.bZsByG_draggable {
    position: absolute
}

.bZsByG_draggable:before {
    content: "";
    z-index: -1;
    background-image: url(corner.cd942008.webp);
    width: 448px;
    height: 448px;
    position: absolute;
    top: -224px;
    left: -224px;
    transform: scale(.02)
}

.bZsByG_canvas {
    image-rendering: pixelated;
    cursor: crosshair
}

.bZsByG_coordinates {
    color: #ffffff;
    text-shadow: 2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000;
    font-family: Custom Font,monospace;
    font-size: 18px;
    font-weight: 700;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%)
}

.bZsByG_countdown {
    background: #000000;
    margin: -5px -10px;
    padding: 5px 10px;
    position: relative
}

.bZsByG_countdownProgress {
    background-color: #43b581;
    width: 0%;
    height: 100%;
    display: inline;
    position: absolute;
    top: 0;
    left: 0
}

.bZsByG_countdownLabel {
    color: #ffffff;
    padding: 5px 10px;
    position: absolute;
    top: 0;
    left: 0
}

.bZsByG_pixel {
    cursor: crosshair;
    position: absolute
}

.bZsByG_tooltip {
    color: #ffffff;
    white-space: pre;
    background: #18191c;
    border: 1px solid #000000;
    width: max-content;
    padding: 2px 4px;
    line-height: 16px;
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translate(-50%)
}

.bZsByG_tooltip:after {
    content: "";
    background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' height='20' width='20' style='transform:rotate(-60deg);' viewBox='90 80 400 250'%3E%3Cpolygon points='250,60 190,250 385,300' style='fill:none;stroke:%23000;stroke-width:20px;fill:%2318191c;stroke-dasharray:870;stroke-dashoffset:470;' /%3E%3C/svg%3E");
    width: 20px;
    height: 20px;
    position: absolute;
    bottom: -11px;
    left: 50%;
    transform: translate(-50%)
}

.bZsByG_tooltipName {
    align-items: center;
    gap: 3px;
    display: flex
}

.bZsByG_tooltipName svg {
    width: 12px;
    height: 12px
}

.bZsByG_pixelInside {
    background-color: var(--bg-color);
    border-color: var(--border-color);
    box-sizing: border-box;
    border-style: solid;
    border-width: 1px;
    width: 100%;
    height: 100%
}

@keyframes bZsByG_moveAnimation {
    0% {
        transform: translate(0)
    }

    to {
        transform: translate(2000px,-1000px)
    }
}

@keyframes bZsByG_scaleAndRotateAnimation {
    0% {
        opacity: 1;
        transform: scale(1)rotate(0)
    }

    to {
        opacity: 0;
        transform: scale(15)rotate(360deg)
    }
}

.bZsByG_animated {
    animation: .5s linear forwards bZsByG_moveAnimation
}

.bZsByG_animated>div {
    animation: .5s linear forwards bZsByG_scaleAndRotateAnimation
}

.bZsByG_image404 {
    image-rendering: pixelated;
    animation-name: bZsByG_fade;
    animation-duration: 1s;
    animation-iteration-count: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%)
}

@keyframes bZsByG_fade {
    0% {
        opacity: 0
    }

    50% {
        opacity: 0
    }

    to {
        opacity: 1
    }
}

.bZsByG_inactive {
    cursor: pointer
}

.bZsByG_select {
    box-sizing: border-box;
    background-color: #5865f299;
    border: 1px solid #5865f2;
    position: absolute
}

.mobile .bZsByG_root {
    width: 100%;
    height: 100%;
    margin: 0
}

.mobile .bZsByG_coordinates {
    bottom: 70px
}

.E3mhTa_root {
    box-sizing: border-box;
    z-index: 1;
    background: #36393f;
    border: 3px solid #2f3136;
    border-color: #40444b #2f3136 #2f3136 #40444b;
    border-radius: 3px;
    flex-direction: column;
    gap: 3px;
    padding: 4px;
    display: flex;
    position: absolute
}

.E3mhTa_draggable {
    cursor: grab;
    background-image: linear-gradient(#0000 0% 49.9%,#2f3136 50% 74.9%,#72767d 75% 100%);
    background-size: 4px 4px;
    width: 100%;
    height: 16px;
    margin-bottom: 5px;
    position: relative
}

.E3mhTa_content {
    color: #ffffff;
    scrollbar-width: thin;
    scrollbar-color: #4f545c #fff0;
    background: #2f3136;
    border: 2px solid #40444b;
    border-color: #2f3136 #40444b #40444b #2f3136;
    border-radius: 5px;
    width: 300px;
    height: calc(100vh - 220px);
    padding: 3px;
    position: relative;
    overflow: hidden auto
}

.E3mhTa_content::-webkit-scrollbar {
    background-color: #fff0;
    width: 8px;
    height: 6px
}

.E3mhTa_content::-webkit-scrollbar-button {
    display: none
}

.E3mhTa_content::-webkit-scrollbar-track {
    background-color: #fff0
}

.E3mhTa_content::-webkit-scrollbar-thumb {
    background-color: #4f545c
}

.E3mhTa_message {
    margin: 0 -3px;
    padding: 5px 3px
}

.E3mhTa_message:hover {
    background-color: #36393f
}

.E3mhTa_clickable {
    cursor: pointer
}

.E3mhTa_title {
    letter-spacing: 1px;
    justify-content: space-between;
    align-items: baseline;
    display: flex
}

.E3mhTa_title svg {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    transform: translateY(4px)
}

.E3mhTa_text b {
    color: #000000;
    background: #ffffff
}

.E3mhTa_publisher {
    position: relative
}

.E3mhTa_button {
    box-sizing: border-box;
    cursor: pointer;
    background-color: #4f545c;
    border: 2px solid #2f3136;
    border-color: #40444b #2f3136 #2f3136 #40444b;
    border-radius: 3px;
    width: 26px;
    height: 26px;
    padding: 0;
    position: absolute;
    bottom: 2px;
    right: 2px
}

.E3mhTa_button:hover {
    background-color: #5d6269
}

.E3mhTa_button:active {
    background-color: #36393f;
    border-color: #2f3136 #40444b #40444b #2f3136;
    padding: 0
}

.E3mhTa_input {
    box-sizing: border-box;
    color: #ffffff;
    background: #40444b;
    border: 2px solid #40444b;
    border-color: #2f3136 #40444b #40444b #2f3136;
    border-radius: 5px;
    width: 100%;
    padding: 5px 25px 5px 5px;
    font-family: Custom Font,monospace;
    font-size: 16px;
    font-weight: 700
}

.E3mhTa_input:focus {
    outline: none
}

.E3mhTa_input:focus::placeholder {
    color: #0000
}

.E3mhTa_input::placeholder {
    color: #72767d;
    text-transform: uppercase
}

.E3mhTa_close {
    box-sizing: border-box;
    cursor: pointer;
    background-color: #4f545c;
    border: 2px solid #2f3136;
    border-color: #40444b #2f3136 #2f3136 #40444b;
    border-radius: 3px;
    outline: 4px solid #36393f;
    padding: 10px 30px;
    position: absolute;
    top: -2px;
    right: 1px
}

.E3mhTa_close:hover {
    background-color: #5d6269
}

.E3mhTa_close:active {
    background-color: #36393f;
    border-color: #2f3136 #40444b #40444b #2f3136;
    padding: 12px 28px 8px 32px
}

.E3mhTa_close,.E3mhTa_close:active {
    padding: 0 3px
}

.E3mhTa_delimiter {
    z-index: 1;
    background: #2f3136;
    justify-content: center;
    width: calc(100% + 6px);
    margin: -3px;
    display: flex;
    position: sticky;
    top: -3px
}

.sbOmwG_root {
    width: 100%
}

.WYK2Ka_root {
    box-sizing: border-box;
    color: #ffffff;
    background: #36393f;
    border: 3px solid #2f3136;
    border-color: #40444b #2f3136 #2f3136 #40444b;
    border-radius: 3px;
    gap: 8px;
    padding: 6px;
    display: flex;
    position: absolute
}

.WYK2Ka_paletteContent {
    flex-direction: column;
    gap: 6px;
    display: flex
}

.WYK2Ka_paletteControls {
    gap: 6px;
    display: flex
}

.WYK2Ka_draggable {
    cursor: grab;
    background-image: linear-gradient(#0000 0% 49.9%,#2f3136 50% 74.9%,#72767d 75% 100%);
    background-size: 4px 4px;
    width: 16px;
    height: 42px;
    display: inline-block
}

.WYK2Ka_currentColorWrapper {
    box-sizing: border-box;
    background-color: #40444b;
    background-image: repeating-conic-gradient(#36393f 0% 25%,#40444b 0% 50%);
    background-position: 0 0,2px 2px;
    background-size: 4px 4px;
    border: 2px solid #40444b;
    border-color: #2f3136 #40444b #40444b #2f3136;
    border-radius: 3px;
    justify-content: center;
    align-items: center;
    width: 42px;
    height: 42px;
    display: flex
}

.WYK2Ka_currentColor {
    box-sizing: border-box;
    border: 2px solid #2f3136;
    border-color: #40444b #2f3136 #2f3136 #40444b;
    border-radius: 3px;
    width: 26px;
    height: 26px
}

.WYK2Ka_colors {
    grid-template-rows: repeat(2,1fr);
    grid-template-columns: repeat(auto-fill,1fr);
    grid-auto-flow: column;
    gap: 1px;
    display: grid
}

.WYK2Ka_color {
    box-sizing: border-box;
    cursor: pointer;
    border: 2px solid #40444b;
    border-color: #2f3136 #40444b #40444b #2f3136;
    border-radius: 3px;
    width: 20px;
    height: 20px;
    transition: transform .2s
}

.WYK2Ka_color:hover {
    transform: scale(1.2)
}

.mobile .WYK2Ka_root {
    border-width: 2px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    width: 100%;
    padding: 3px;
    bottom: 0;
    left: 0
}

.mobile .WYK2Ka_colors {
    grid-template-rows: 1fr;
    max-width: calc(100vw - 10px);
    padding: 3px 0;
    overflow: auto hidden
}

.mobile .WYK2Ka_color {
    border-radius: 12px;
    width: 8vw;
    height: 8vw
}

.mobile .WYK2Ka_color:hover {
    transform: unset
}

.mobile .WYK2Ka_currentColorWrapper {
    display: none
}

.mobile .WYK2Ka_currentColor {
    width: 10vw;
    height: 10vw
}

.mobile .WYK2Ka_active {
    box-shadow: 0 0 0 3px #ffffff
}

.gYMkMG_root {
    margin-bottom: 3px
}

.gYMkMG_title {
    cursor: pointer;
    background: #2f3136;
    border: 1px solid #40444b
}

.gYMkMG_title,.gYMkMG_title:active,.gYMkMG_title:hover {
    padding: 5px 3px
}

.gYMkMG_content {
    color: #ffffff;
    box-sizing: border-box;
    background: #2f3136;
    border: 1px solid #40444b;
    border-top: 0;
    padding: 3px
}

.gYMkMG_content a,.gYMkMG_content a:active,.gYMkMG_content a:visited,.gYMkMG_content a:hover {
    color: #ffffff;
    font-weight: 700
}

.gYMkMG_content button {
    color: #ffffff;
    cursor: pointer;
    background: #2f3136;
    border: 1px solid #40444b;
    margin: 1px;
    padding: 3px
}

.gYMkMG_content button:disabled {
    opacity: .5
}

.gYMkMG_content input {
    color: #ffffff;
    background: #2f3136;
    border: 1px solid #40444b;
    border-bottom-width: 2px
}

.rwQW0q_root {
    z-index: 1;
    background: #00000080;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    top: 0;
    left: 0
}

.rwQW0q_window {
    box-sizing: border-box;
    color: #ffffff;
    background: #36393f;
    border: 3px solid #2f3136;
    border-color: #40444b #2f3136 #2f3136 #40444b;
    border-radius: 3px;
    max-width: 100%;
    max-height: 100%;
    padding: 15px;
    position: relative
}

.rwQW0q_close {
    box-sizing: border-box;
    cursor: pointer;
    color: #ffffff;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    padding: 2px;
    font-size: 23px;
    display: flex;
    position: absolute;
    top: 10px;
    right: 10px
}

.rwQW0q_close:hover {
    color: #ed4245;
    border: 2px solid #2f3136;
    border-color: #40444b #2f3136 #2f3136 #40444b
}

.rwQW0q_close:active {
    background-color: #36393f;
    border-color: #2f3136 #40444b #40444b #2f3136;
    padding: 3px 1px 1px 3px
}

.dXrxXq_users,.dXrxXq_uuids {
    max-height: 200px;
    overflow: hidden auto
}

.dXrxXq_list {
    background-color: #2f3136;
    max-height: 200px;
    overflow-y: auto
}

._50GOQW_item {
    justify-content: space-between;
    display: flex
}

._50GOQW_item>span {
    cursor: pointer;
    padding: 3px
}

._50GOQW_item:hover {
    background: #ffffff1a
}

._50GOQW_list {
    max-height: 200px;
    overflow: auto
}

._50GOQW_toggleButton {
    cursor: pointer
}

.irZiKa_scrollable {
    max-height: calc(100% - 50px);
    overflow: auto
}

.irZiKa_month {
    background: #2f3136;
    margin: 3px 0 0 3px;
    display: inline-block
}

.irZiKa_week {
    display: flex
}

.irZiKa_day {
    white-space: nowrap;
    outline: 1px solid #40444b;
    flex-direction: column;
    justify-content: center;
    align-items: end;
    width: 45px;
    height: 45px;
    padding: 3px;
    display: flex
}

.irZiKa_day div {
    color: #ffffff;
    text-align: right;
    white-space: nowrap;
    cursor: default;
    font-size: 1.3vh
}

.irZiKa_day div:first-child {
    font-weight: 700
}

.irZiKa_tooltip {
    color: #ffffff
}

.irZiKa_hours {
    grid-template-rows: repeat(6,1fr);
    grid-auto-flow: column;
    gap: 2px;
    display: grid
}

.irZiKa_hours>div {
    color: #ffffff;
    border: 1px solid #40444b;
    padding: 0 4px
}

.irZiKa_chart {
    justify-content: center;
    display: flex
}

.irZiKa_chart svg {
    outline: 1px solid #40444b
}

.QBdNnW_list {
    color: #ffffff;
    background: #2f3136;
    max-height: 300px;
    overflow: auto
}

.QBdNnW_item {
    position: relative
}

.QBdNnW_item:nth-child(odd) {
    background-color: #36393f
}

.QBdNnW_item:hover {
    background-color: #40444b
}

.QBdNnW_item:hover .QBdNnW_controls {
    display: flex
}

.QBdNnW_controls {
    display: none;
    position: absolute;
    top: 0;
    right: 0
}

.QBdNnW_controls button {
    padding: unset;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    display: flex
}

.G-PUzG_row {
    grid-template-columns: 50px 1fr 26px;
    gap: 1px;
    padding: 1px;
    display: grid
}

.G-PUzG_addButton {
    width: 100%
}

.VygWpW_root {
    background: #2f3136;
    border: 1px solid #40444b;
    flex-direction: column;
    gap: 3px;
    padding: 4px 4px 0;
    display: flex;
    position: absolute;
    box-shadow: 0 0 20px #000
}

.VygWpW_root,.VygWpW_root button {
    font-family: monospace;
    font-size: 10pt
}

.VygWpW_root button:active {
    color: #ffffff;
    background: #40444b
}

.VygWpW_draggable {
    cursor: grab;
    background-image: linear-gradient(#0000 0% 49.9%,#2f3136 50% 74.9%,#40444b 75% 100%);
    background-size: 4px 4px;
    width: calc(100% - 20px);
    height: 16px;
    margin-bottom: 5px
}

.VygWpW_content {
    color: #ffffff;
    background: #2f3136;
    width: 300px;
    max-height: 600px;
    font-family: monospace;
    font-size: 10pt;
    overflow: hidden auto
}

.VygWpW_close {
    color: #40444b;
    cursor: pointer;
    background: #2f3136;
    border: 1px solid #40444b;
    position: absolute;
    top: 5px;
    right: 4px
}

.VygWpW_close,.VygWpW_close:active {
    padding: 0 3px
}

.VygWpW_close>div {
    rotate: -90deg
}

.VygWpW_toggled>div {
    rotate: 90deg
}

.WxBbNq_root {
    box-sizing: border-box;
    z-index: 1;
    background: #36393f;
    border: 3px solid #2f3136;
    border-color: #40444b #2f3136 #2f3136 #40444b;
    border-radius: 3px;
    flex-direction: column;
    gap: 3px;
    padding: 4px;
    display: flex;
    position: absolute
}

.WxBbNq_draggable {
    cursor: grab;
    background-image: linear-gradient(#0000 0% 49.9%,#2f3136 50% 74.9%,#72767d 75% 100%);
    background-size: 4px 4px;
    width: 100%;
    height: 16px;
    margin-bottom: 5px
}

.WxBbNq_content {
    color: #ffffff;
    scrollbar-width: thin;
    scrollbar-color: #4f545c #fff0;
    background: #2f3136;
    border: 2px solid #40444b;
    border-color: #2f3136 #40444b #40444b #2f3136;
    border-radius: 5px;
    width: 300px;
    max-height: calc(100vh - 300px);
    padding: 10px;
    overflow: hidden auto
}

.WxBbNq_content::-webkit-scrollbar {
    background-color: #fff0;
    width: 8px;
    height: 6px
}

.WxBbNq_content::-webkit-scrollbar-button {
    display: none
}

.WxBbNq_content::-webkit-scrollbar-track {
    background-color: #fff0
}

.WxBbNq_content::-webkit-scrollbar-thumb {
    background-color: #4f545c
}

.WxBbNq_leaderBoardItem {
    justify-content: space-between;
    align-items: center;
    margin: 0 -10px;
    padding: 0 10px 3px;
    display: flex
}

.WxBbNq_leaderBoardItem:hover {
    background-color: #36393f
}

.WxBbNq_leaderBoardItem svg {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    transform: translateY(4px)
}

.WxBbNq_close {
    box-sizing: border-box;
    cursor: pointer;
    background-color: #4f545c;
    border: 2px solid #2f3136;
    border-color: #40444b #2f3136 #2f3136 #40444b;
    border-radius: 3px;
    outline: 4px solid #36393f;
    padding: 10px 30px;
    position: absolute;
    top: 2px;
    right: 5px
}

.WxBbNq_close:hover {
    background-color: #5d6269
}

.WxBbNq_close:active {
    background-color: #36393f;
    border-color: #2f3136 #40444b #40444b #2f3136;
    padding: 12px 28px 8px 32px
}

.WxBbNq_close,.WxBbNq_close:active {
    padding: 0 3px
}

.WxBbNq_space {
    width: 20px;
    display: inline-block
}

.WxBbNq_title {
    margin: 10px 0 5px
}

.TlG9MG_root {
    color: #ffffff;
    white-space: pre-wrap;
    text-shadow: 2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000;
    padding: 10px;
    font-size: 48px;
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translate(-50%)
}

.TlG9MG_timeout {
    background: #000000;
    top: 50px
}

.TlG9MG_timeout a,.TlG9MG_timeout a:visited,.TlG9MG_timeout a:active {
    color: #ffffff
}

.TlG9MG_timeout a:hover {
    color: #5865f2
}

.mobile .TlG9MG_timeout {
    white-space: break-spaces;
    text-align: center;
    z-index: 1;
    width: 90%;
    font-size: 16pt
}

.A3QuhW_root {
    box-sizing: border-box;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 4px;
    display: flex;
    position: absolute;
    top: 0;
    left: 0
}

.A3QuhW_title {
    white-space: nowrap;
    grid-column-gap: 8px;
    grid-row-gap: 0px;
    grid-template-columns: 30px 1fr;
    grid-template-areas: "A3QuhW_logo A3QuhW_title""A3QuhW_logo A3QuhW_subtitle";
    text-decoration: none;
    display: grid
}

.A3QuhW_title>h1 {
    grid-area: A3QuhW_title
}

.A3QuhW_title>h2 {
    grid-area: A3QuhW_subtitle
}

.A3QuhW_logo {
    grid-area: A3QuhW_logo;
    width: 32px;
    height: 32px
}

h1,h2 {
    color: #ffffff;
    text-shadow: 2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000;
    margin: 0
}

h1 {
    font-size: 20px
}

h2 {
    font-size: 12px
}

.mobile .A3QuhW_title {
    grid-template-areas: "A3QuhW_logo"
}

.mobile .A3QuhW_title>h1,.mobile .A3QuhW_title>h2 {
    display: none
}

.mcXSSq_root {
    box-sizing: border-box;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 4px 8px;
    display: flex;
    position: absolute;
    top: 0;
    right: 0
}

.mcXSSq_controlsWrapper,.mcXSSq_controls {
    align-items: center;
    gap: 10px;
    display: flex
}

.mcXSSq_disabled {
    pointer-events: none;
    opacity: .5
}

.mcXSSq_blinked {
    animation: 1s linear infinite mcXSSq_blinkAnimation
}

.mcXSSq_badge:after {
    content: "";
    background: #ed4245;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    animation-name: mcXSSq_circle-size-animation;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    position: absolute;
    bottom: 80%;
    left: 80%
}

.mcXSSq_userName {
    color: #ffffff;
    text-shadow: 2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000;
    text-overflow: ellipsis;
    max-width: calc(100vw - 252px);
    padding-left: 2px;
    font-family: Custom Font,monospace;
    font-size: 20px;
    overflow: hidden
}

.mcXSSq_iconButton {
    cursor: pointer;
    width: 32px;
    height: 32px
}

.mcXSSq_iconWrapper {
    position: relative
}

.mobile .mcXSSq_controlsWrapper {
    flex-direction: column-reverse;
    align-items: end;
    gap: 2px;
    display: flex
}

.pvgGma_loginTitle {
    color: #ffffff;
    justify-content: center;
    margin-bottom: 20px;
    font-size: 16pt;
    display: flex
}

.pvgGma_loginList {
    background: #2f3136;
    border: 2px solid #40444b;
    border-color: #2f3136 #40444b #40444b #2f3136;
    border-radius: 5px;
    flex-direction: column;
    display: flex;
    overflow: hidden
}

.pvgGma_loginList a,.pvgGma_loginList a:visited {
    color: #5865f2;
    align-items: center;
    gap: 20px;
    padding: 5px;
    font-size: 18pt;
    text-decoration: none;
    display: flex
}

.pvgGma_loginList a:hover {
    color: #ffffff;
    background: #36393f;
    text-decoration: underline
}

.pvgGma_loginList svg {
    width: 40px;
    height: 40px
}

.B2wDDG_root {
    height: 100%
}

.B2wDDG_footer {
    -webkit-user-select: none;
    user-select: none;
    gap: 8px;
    padding: 10px;
    display: flex;
    position: absolute;
    bottom: 0;
    right: 0
}

.B2wDDG_footer a {
    transition: transform .2s
}

.B2wDDG_footer a:hover {
    transform: scale(1.2)
}

.B2wDDG_footer svg {
    width: 32px;
    height: 32px
}

.B2wDDG_paused {
    color: #ffffff;
    white-space: pre-wrap;
    background: #000000;
    padding: 10px;
    font-size: 48px;
    position: absolute;
    top: 50px;
    left: 50px
}

.mobile .B2wDDG_footer {
    display: none
}
`;
document.head.appendChild(style);
})();