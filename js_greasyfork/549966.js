// ==UserScript==
// @name         Old Facebook Home/Profile Page Beta (2013)
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Brings back the old home/profile pages from Facebook (2013)
// @author       Avolition
// @match        https://www.facebook.com/*
// @match        https://web.facebook.com/*
// @match        https://apps.facebook.com/*
// @icon         https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/social-facebook-icon.png
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549966/Old%20Facebook%20HomeProfile%20Page%20Beta%20%282013%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549966/Old%20Facebook%20HomeProfile%20Page%20Beta%20%282013%29.meta.js
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';

    function createThirdColumnWrapper() {

        if (!document.querySelector('.ThirdColumnWrapper') && document.querySelector('.x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1iyjqo2.xs83m0k.xeuugli.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1iplk16.x1mfogq2.xsfy40s.x1wi7962.xpi1e93')) {

            let div = document.createElement('div');
            let style = document.createElement('style');
            div.className = "ThirdColumnWrapper";
            document.querySelector('.x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1iyjqo2.xs83m0k.xeuugli.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1iplk16.x1mfogq2.xsfy40s.x1wi7962.xpi1e93').append(div);
            style.innerHTML = `
                .ThirdColumnWrapper {
                    width: 244px;
                    display: block;
                    position: sticky;
                    top: 43px;
                    border-right: 1px solid rgb(204, 204, 204);

                }

            `;

            document.head.appendChild(style);

            let div2 = document.createElement('div');
            let style2 = document.createElement('style');
            div2.className = "ThirdColumn";
            document.querySelector('.ThirdColumnWrapper').append(div2);
            style2.innerHTML = `
                .ThirdColumn {
                    position: sticky;
                    top: 43px;
                    margin-top: 16px;

                }

            `;

            document.head.appendChild(style2);

        }

    }

    function createSidebarWrapper() {

        if (!document.querySelector('.SidebarWrapper')) {

            if (document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xedcshv.x1t2pt76')) {

                let div = document.createElement('div');
                let style = document.createElement('style');
                div.className = "SidebarWrapper";
                document.querySelector('.x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1iyjqo2.xs83m0k.xeuugli.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1iplk16.x1mfogq2.xsfy40s.x1wi7962.xpi1e93').prepend(div);
                style.innerHTML = `
                    .SidebarWrapper {
                        position: sticky;
                        height: 100%;
                        background: transparent;
                        top: 43px;

                    }

                `;

                document.head.appendChild(style);

            }

            if (document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xedcshv.x1t2pt76')) {

                let sourceElement = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xedcshv.x1t2pt76');
                let targetElement = document.querySelector('.SidebarWrapper');

                targetElement.prepend(sourceElement);

            }

            setTimeout(() => {

                if (document.querySelector('.SidebarWrapper')
                    && !document.querySelector('.SidebarButtonList')
                    && !document.querySelector('.FavoritesText')) {

                    let span = document.createElement('span');
                    let style2 = document.createElement('style');
                    span.innerText = "Favorites"
                    span.className = "FavoritesText";
                    document.querySelector('.SidebarWrapper ul:first-child li:first-child').append(span);
                    style2.innerHTML = `
                        .FavoritesText {
                            display: block;
                            position: relative;
                            width: fit-content;
                            margin: 12px 0px 0px 14px;
                            font-size: 9px;
                            font-weight: bold;
                            text-transform: uppercase;
                            color: rgb(153, 153, 153);

                        }

                    `;

                    document.head.appendChild(style2);

                    let ul = document.createElement('ul');
                    let style = document.createElement('style');
                    ul.className = "SidebarButtonList";
                    document.querySelector('.SidebarWrapper ul:first-child li:first-child').append(ul);
                    style.innerHTML = `
                        .SidebarButtonList {
                            display: block;
                            position: relative;
                            height: auto;
                            width: auto;
                            margin-top: 10px;

                        }

                    `;

                    document.head.appendChild(style);

                }

                if (!document.querySelector('.SidebarExtraButton')) {

                    const numberOfElements = 1;
                    const className = 'SidebarExtraButton';

                    Array.from({ length: numberOfElements }).forEach(() => {

                        let li = document.createElement('div');
                        li.style.display = "flex";
                        li.style.position = "relative";
                        li.style.width = "186px";
                        li.style.height = "21px";
                        li.style.bottom = "0px";

                        li.classList.add(className);

                        document.querySelector('.SidebarButtonList')?.append(li);

                    });

                    if (!document.querySelector('.NewsFeedButton') && document.querySelector('.SidebarExtraButton')) {

                        let a = document.createElement('a');
                        let style = document.createElement('style');
                        a.className = "NewsFeedButton";
                        a.href = "#";
                        document.querySelector('.SidebarButtonList .SidebarExtraButton:first-child').append(a);
                        style.innerHTML = `
                            .NewsFeedButton {
                                display: list-item;
                                position: absolute;
                                width: 161px;
                                height: 20px;
                                background: rgb(216, 223, 234);
                                border-bottom: 1px solid #fff;
                                border-radius: 0px;
                                padding: 0 8px;
                                margin-bottom: 1px;
                                right: 1px;

                            }

                        `;

                        document.head.appendChild(style);

                        let img = document.createElement('img');
                        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA3VDE4OjI0OjEzKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wN1QxODoyOToyMiswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wN1QxODoyOToyMiswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNDc0MmZhMC1lMGI5LWE2NGEtYTg0MC05MTIwYTAzNWZiM2QiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmMWZjZjdkYS1iZDBjLWRmNGQtYTBjOC1jMTA0OTEyMTM0OWMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMjFkMjQwYy1iYzUwLWIwNDQtOTg3ZS0xNjM4ODUxZGRkZDQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmUyMWQyNDBjLWJjNTAtYjA0NC05ODdlLTE2Mzg4NTFkZGRkNCIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wN1QxODoyNDoxMyswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNDc0MmZhMC1lMGI5LWE2NGEtYTg0MC05MTIwYTAzNWZiM2QiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDdUMTg6Mjk6MjIrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5BaVfsAAAAcElEQVQokWNggILMzMzTQPyfBHwarmnatGn/SQEgPSDN/2/cewXWfO/evf9r1qwhiEHqMDRTZDMItE1cBsYgcOLCI6yYNpqRAUWah7GfX+7duxcc8e/fv4fjuw+eYcUgOWgiuQvSnAMygMR0fRekDwDB4mtVmECG8AAAAABJRU5ErkJggg==";
                        img.style.backgroundPosition = "0px 0px";
                        img.style.width = "16px";
                        img.style.height = "16px";
                        img.style.marginTop = "2px";
                        img.style.marginRight = "5px";

                        document.querySelector('.SidebarButtonList .SidebarExtraButton:first-child .NewsFeedButton').append(img);

                        let span = document.createElement('span');
                        let style2 = document.createElement('style');
                        span.innerText = "News Feed"
                        span.className = "NewsFeedText";
                        document.querySelector('.SidebarButtonList .SidebarExtraButton:first-child .NewsFeedButton').append(span);
                        style2.innerHTML = `
                            .NewsFeedText {
                                display: inline-block;
                                position: relative;
                                bottom: 4px;
                                font-size: 11px;
                                font-weight: bold;
                                color: #1d2129;

                            }

                        `;

                        document.head.appendChild(style2);

                    }

                }

            }, 1000);

            setTimeout(() => {

                document.querySelectorAll('.SidebarWrapper .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1j85h84').forEach((span) => {

                    span.textContent = span.textContent.replace(/Your shortcuts/g, "Shortcuts");

                });

            }, 1000);

            if (document.querySelector('.x1iyjqo2 ul:first-child li:first-child .x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.x1qughib.x6s0dn4.xozqiw3.x1q0g3np .x78zum5.xdt5ytf.xz62fqu.x16ldp7u')
                && !document.querySelector('.EditProfile')) {

                let a = document.createElement('a');
                let style = document.createElement('style');
                a.className = "EditProfile";
                document.querySelector('.x1iyjqo2 ul:first-child li:first-child .x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.x1qughib.x6s0dn4.xozqiw3.x1q0g3np .x78zum5.xdt5ytf.xz62fqu.x16ldp7u').append(a);
                a.innerText = "Edit Profile";
                a.href = "https://www.facebook.com/me/about/?section=work&ref=bookmarks";
                style.innerHTML = `
                    .EditProfile {
                        display: block;
                        position: relative;
                        margin-top: 2px;
                        margin-left: -6px;
                        color: rgb(59, 89, 152);
                        font-size: 11px;
                        font-weight: normal;
                        cursor: pointer;

                    }

                `;

                document.head.appendChild(style);

            }

        }

    }

    function centerBlueBar() {

        if (!document.querySelector('.TopBarContentWrapper')) {

            let div = document.createElement('div');
            let style = document.createElement('style');
            div.className = "TopBarContentWrapper";
            document.querySelector('.xuk3077.x78zum5.x1iyjqo2.xl56j7k.xe11lzi.x1vy8oqc.x88anuq').prepend(div);
            style.innerHTML = `
                .TopBarContentWrapper {
                    display: flex;
                    justify-content: space-between;
                    position: absolute;
                    margin-right: 141px;
                    width: 1012px;
                    height: 43px;

                }

                `;

            document.head.appendChild(style);

            let div2 = document.createElement('div');
            let style2 = document.createElement('style');
            div2.className = "FirstTopBarContentContainer";
            document.querySelector('.TopBarContentWrapper').append(div2);
            style2.innerHTML = `
                .FirstTopBarContentContainer {
                    display: flex;
                    position: relative;
                    width: auto;
                    height: 43px;

                }

                `;

            document.head.appendChild(style2);

            let div3 = document.createElement('div');
            let style3 = document.createElement('style');
            div3.className = "SecondTopBarContentContainer";
            document.querySelector('.TopBarContentWrapper').append(div3);
            style3.innerHTML = `
                .SecondTopBarContentContainer {
                    display: flex;
                    position: relative;
                    width: auto;
                    height: 43px;
                    margin-right: 40px;

                }

                `;

            document.head.appendChild(style3);

            let div4 = document.createElement('div');
            let style4 = document.createElement('style');
            div4.className = "TopBarButtonsWrapper";
            document.querySelector('.SecondTopBarContentContainer').append(div4);
            style4.innerHTML = `
                .TopBarButtonsWrapper {
                    display: flex;
                    position:relative;
                    width: auto;
                    height: 43px;
                    margin-left: 8px;
                    margin-right: 8px;
                    margin-top: 6px;

                }

                `;

            document.head.appendChild(style4);

            let a = document.createElement('a');
            a.innerText = "Find Friends";
            a.style.display = "block";
            a.style.position = "relative";
            a.style.height = "31px";
            a.style.lineHeight = "29px";
            a.style.padding = "0px 8px";
            a.style.fontSize = "11px";
            a.style.fontWeight = "bold";
            a.style.color = "rgb(216, 223, 234)";
            a.style.cursor = "pointer";
            a.style.borderRadius = "2px";
            a.style.textDecoration = "none";

            a.className = "FindFriends";

            a.addEventListener('click', (e) => {
                e.preventDefault();
                let newUrl = "https://www.facebook.com/friends";;
                window.history.pushState({}, '', newUrl);

                window.dispatchEvent(new PopStateEvent('popstate'));

            });

            if (document.querySelector('[aria-label="Account Controls and Settings"]')) {

                document.querySelector('[aria-label="Account Controls and Settings"]').append(a);

            } else {

                document.querySelector('[aria-label="Account controls and settings"]').append(a);

            }

            a.addEventListener('mouseover', () => {
                a.style.background = 'rgba(0, 0, 0, .1)';

            });

            a.addEventListener('mouseout', () => {
                a.style.background = 'transparent';

            });

            let originalbtn = document.querySelector('[aria-label="Home"]');

            let btn = document.createElement('div');
            btn.innerText = "Home";
            btn.style.display = "block";
            btn.style.position = "relative";
            btn.style.height = "31px";
            btn.style.lineHeight = "29px";
            btn.style.padding = "0px 8px";
            btn.style.fontSize = "11px";
            btn.style.fontWeight = "bold";
            btn.style.color = "rgb(216, 223, 234)";
            btn.style.cursor = "pointer";
            btn.style.borderRadius = "2px";

            btn.className = "HomeButton";

            if (document.querySelector('[aria-label="Account Controls and Settings"]')) {

                document.querySelector('[aria-label="Account Controls and Settings"]').append(btn);

            } else {

                document.querySelector('[aria-label="Account controls and settings"]').append(btn);

            }

            btn.addEventListener("click", function() {
                originalbtn.click();

            });

            btn.addEventListener('mouseover', () => {
                btn.style.background = 'rgba(0, 0, 0, .1)';

            });

            btn.addEventListener('mouseout', () => {
                btn.style.background = 'transparent';

            });

            let btn2 = document.createElement('a');
            btn2.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJCAYAAAAGuM1UAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA5VDE3OjQ2OjI2KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wOVQxOTowNTowMyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wOVQxOTowNTowMyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NzJmZThhMC01MGY2LTcyNDAtYWZjOC1lZTY1YWZiZTBkY2YiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkYzg4YTFkNS1jYzA4LTYyNDktOTVkMS1mN2QyZDUyYzE5ODMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkNzZhZTZmZC0wMTI4LTNkNGItOWJjMy03ZDM5MjA2YzdhNGQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQ3NmFlNmZkLTAxMjgtM2Q0Yi05YmMzLTdkMzkyMDZjN2E0ZCIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wOVQxNzo0NjoyNiswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NzJmZThhMC01MGY2LTcyNDAtYWZjOC1lZTY1YWZiZTBkY2YiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDlUMTk6MDU6MDMrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Vo5l/AAAAnUlEQVQYlX1QyQ3DMAzTBBkj7zw6QpfMHBkh6Lso+lA+1gDKCEGR0g7joy0qgLBsUhJlEcQSfNDg98X8BTxwv8i/gCiKJxRdgQkFT77vyBOUJwvWDWQfcxC9koBgBDemk5Dcybxj3uVOP+0En7UeazmfOTHbipycIq18cuLOiYcdO0A7ayNuFvyMLztWbFX7ZU3aoREW8nb+lIZi6w1ysBCEylY2pwAAAABJRU5ErkJggg==)";
            btn2.style.display = "block";
            btn2.style.position = "relative";
            btn2.style.height = "9px";
            btn2.style.width = "12px";
            btn2.style.marginLeft = "12px"
            btn2.style.marginRight = "0px";

            btn2.className = "QuickHelp";

            if (document.querySelector('[aria-label="Account Controls and Settings"]')) {

                document.querySelector('[aria-label="Account Controls and Settings"]').append(btn2);

            } else {

                document.querySelector('[aria-label="Account controls and settings"]').append(btn2);

            }

            let btn3 = document.createElement('a');
            btn3.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA5VDE3OjQ2OjI2KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wOVQxOTowOTo0NCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wOVQxOTowOTo0NCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNWFiZDk0MC1kMjQyLWUwNDUtYTIwZS00NzU3Y2Q1OTE2ZGQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5OTNlOGFlYS1jYWZkLTE1NDctOTczZi1jOTZjYmU0NGM5YTciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4YjI4YzdjMy0zNjA0LTg3NDktYTAxMS05OGNjZTU0YjE0ZGEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjhiMjhjN2MzLTM2MDQtODc0OS1hMDExLTk4Y2NlNTRiMTRkYSIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wOVQxNzo0NjoyNiswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNWFiZDk0MC1kMjQyLWUwNDUtYTIwZS00NzU3Y2Q1OTE2ZGQiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDlUMTk6MDk6NDQrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7xeWFmAAAAR0lEQVQYlWNgQAOb9934D8Lo4hiSN+69+g/CWDXBJEGC2NgopsIE0TGGtegSyCaDrcdlAk6T0U3A6j5kCXSM1df42BgAlyQAZqbT1TYTRX0AAAAASUVORK5CYII=)";
            btn3.style.backgroundRepeat = "no-repeat";
            btn3.style.display = "block";
            btn3.style.position = "relative";
            btn3.style.height = "10px";
            btn3.style.width = "10px";

            btn3.className = "SettingsButton";

            if (document.querySelector('[aria-label="Account Controls and Settings"]')) {

                document.querySelector('[aria-label="Account Controls and Settings"]').append(btn3);

            } else {

                document.querySelector('[aria-label="Account controls and settings"]').append(btn3);

            }

            let ul = document.createElement('ul');
            ul.style.display = "none";
            ul.style.position = "absolute";
            ul.style.height = "216px";
            ul.style.maxWidth = "200px";
            ul.style.width = "200px";
            ul.style.height = "auto";
            ul.style.padding = "5px 0px";
            ul.style.background = "#fff";
            ul.style.border = "1px solid rgba(100, 100, 100, .4)";
            ul.style.borderRadius = "0 0 2px 2px";
            ul.style.boxShadow = "0 3px 8px rgba(0, 0, 0, .25)";
            ul.style.transform = "translate(25px, 38px)";

            ul.className = "SettingsDropdownMenu";

            document.querySelector('.TopBarButtonsWrapper').prepend(ul);

            let div6 = document.createElement('div')
            div6.style.display = "block";
            div6.style.position = "absolute";
            div6.style.width = "20px";
            div6.style.height = "11px";
            div6.style.top = "-11px";
            div6.style.right = "0px";
            div6.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB/Ca1DAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAyLTA2VDIwOjMxOjQ5KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0wNlQyMDozMzowNyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMi0wNlQyMDozMzowNyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphMDEwZjZmYS1jNTllLTE0NDMtYTE3Ni1lOTY3YWJmZjZiNDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YTAxMGY2ZmEtYzU5ZS0xNDQzLWExNzYtZTk2N2FiZmY2YjQ0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTAxMGY2ZmEtYzU5ZS0xNDQzLWExNzYtZTk2N2FiZmY2YjQ0Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphMDEwZjZmYS1jNTllLTE0NDMtYTE3Ni1lOTY3YWJmZjZiNDQiIHN0RXZ0OndoZW49IjIwMjUtMDItMDZUMjA6MzE6NDkrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6GRwLQAAAAXklEQVQokWPwySxkIISTk5NbQZgYtUQZdujQodMgTIyhRBn2HwqIMZRow4g1lCTDiDGUZMMIGUqWYfgMRTasghTD0AytQDEQKJBDjmFohuaADSTXZbhcykANw5ANBQBHxSyZWqRR1AAAAABJRU5ErkJggg==)";

            document.querySelector('.SettingsDropdownMenu').prepend(div6);

            const numberOfElements = 8;
            const className = 'SettingsMenuListItem';
            const items = [
                {text: "Create Page", href: "https://www.facebook.com/pages/create/"},
                {text: "Manage Pages", href: "https://www.facebook.com/pages/?category=your_pages&ref=bookmarks"},
                "separator",
                {text: "Create Group", href: "https://www.facebook.com/groups/create/"},
                {text: "Manage Groups", href: "http://www.facebook.com/bookmarks/groups?ref_type=logout_gear"},
                "separator",
                {text: "Activity Log", href: "https://www.facebook.com/you/allactivity/?category_key=ALL&entry_point=profile_shortcut&should_load_landing_page=1"},
                {text: "News Feed Preferences", href: "#"},
                {text: "Settings", href: "https://www.facebook.com/settings"},
                "separator",
                {text: "Log Out", href: "#"}
            ];

            const menu = document.querySelector('.SettingsDropdownMenu');

            items.forEach((item) => {
                if (item === "separator") {
                    let div = document.createElement('div');
                    div.style.display = "block";
                    div.style.height = "1px";
                    div.style.backgroundColor = "#e9ebee";
                    div.style.margin = "5px 7px 6px";
                    menu.appendChild(div);
                    return;

                }

                let a = document.createElement('a');
                a.href = item.href;
                a.style.display = "block";
                a.style.position = "relative";
                a.style.maxWidth = "200px";
                a.style.height = "24px";
                a.style.padding = "0px 22px";
                a.style.cursor = "pointer";
                a.style.textDecoration = "none";
                a.classList.add(className);

                const span = document.createElement('span');
                span.textContent = item.text;
                span.style.padding = "0 12px";
                span.style.lineHeight = "22px";
                span.style.cursor = "pointer";
                span.style.color = "rgb(29, 33, 41)";
                span.style.textDecoration = "none";
                span.className = "SettingsListItemText";

                a.appendChild(span);

                if (item.text === "Log Out") {
                    a.setAttribute("role", "button");

                }

                menu.appendChild(a);

            });

            const SettingsButton = document.querySelector('.SettingsButton');
            const SettingsMenu = document.querySelector('.SettingsDropdownMenu');

            SettingsButton.addEventListener('click', () => {
                if (SettingsMenu.style.display === "block") {
                    SettingsMenu.style.display = "none";
                    SettingsButton.setAttribute("aria-expanded", "false");

                } else {

                    SettingsMenu.style.display = "block";
                    SettingsButton.setAttribute("aria-expanded", "true");

                }

            });

            document.addEventListener('click', e => {
                if(!SettingsMenu.contains(e.target) && e.target !== SettingsButton) {
                    SettingsMenu.style.display = "none";
                    SettingsButton.setAttribute("aria-expanded", "false");

                }

            });

            $('[role="banner"] .x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1fmog5m.xu25z0z.x140muxe.xo1y3bh.x1q0g3np.x87ps6o.x1lku1pv.x1rg5ohu.x1a2a7pz.x1hc1fzr.x1k90msu.x6o7n8i.xbxq160:first').detach().appendTo('.FirstTopBarContentContainer:first');

            $('[role="banner"] .x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1xegmmw').detach().appendTo('.FirstTopBarContentContainer');

            $('[role="banner"] .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x9f619.xdt5ytf.xh8yej3.x1lliihq.x1n2onr6.xhq5o37.x1qxoq08.x1cpjm7i.xtyp5od.x1682cnc.x124lp2h.x1hmns74.x1y3wzot').detach().appendTo('.FirstTopBarContentContainer:First');

            $('[aria-label="Account Controls and Settings"]:first').detach().appendTo('.TopBarButtonsWrapper');

            $('[aria-label="Account controls and settings"]:first').detach().appendTo('.TopBarButtonsWrapper');

        }

        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svgElement.setAttribute("width", "16");
        svgElement.setAttribute("height", "16");
        svgElement.setAttribute("viewBox", "0 0 24 24");

        const NotificationIcon = document.createElementNS("http://www.w3.org/2000/svg", "image");

        NotificationIcon.setAttribute("href", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA5VDE3OjQ2OjI2KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wOVQxNzo0NzozNyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wOVQxNzo0NzozNyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4YjZlM2U4ZS0xZTExLTUyNGUtYTAzYy1kNTE3ODhmYWUzZjUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxNjU1YjkxYy02YTc3LWRiNDktODZmMi1mYzhjYjYxODM5MmIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4NzNkY2E3Ni1hZDg0LTJmNDctYTE4My04Mzc4MTI4YTk0NzYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg3M2RjYTc2LWFkODQtMmY0Ny1hMTgzLTgzNzgxMjhhOTQ3NiIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wOVQxNzo0NjoyNiswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4YjZlM2U4ZS0xZTExLTUyNGUtYTAzYy1kNTE3ODhmYWUzZjUiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDlUMTc6NDc6MzcrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6fICrcAAABF0lEQVQ4jY1SbQ7CIAzlDkamUeYFjD9V/NjmjYwXMFE25m9jdhCzM5mdAnkaFoaw2KQJtO+9lhZCHKOr88Kco02u4JSLRnsV8cvcxXcs4uI+3hUK5yEXz9nhpuBxdlPTRCrkKL8+QuQaIHNn++IjwNLyhLsRA4ZuRP1TWQMV6TGWyqMRAbbtBO+CKhJoOyQw2X8xnU4wr9E2r2xl7/P0IG2ycXC1ctHYQZsEH3Cx9JHh4BJM2A6CZA8Nkw8JgEt8CVekz8ksK5s+EViclU9/B/JFWCKroHpgje3QNfezxpCA3YVPpP3aLJP3f7qw/wI4nV3Hqaz7BKL1ta0OrP+7ejpxq/9Udm2alHM93cpsBzG6FifEkHPxb56iMJ3MK/taAAAAAElFTkSuQmCC");
        NotificationIcon.setAttribute("width", "24");
        NotificationIcon.setAttribute("height", "24");
        NotificationIcon.setAttribute("class", "OldNotificationIcon");

        svgElement.appendChild(NotificationIcon);

        const targetElement = document.querySelector('.FirstTopBarContentContainer .x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1xegmmw:nth-child(4) .x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.x1iwo8zk.x1033uif.x179ill4.x1b60jn0.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x78zum5.xl56j7k.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x1vqgdyp.x100vrsf.x1qhmfi1 .x14rh7hd.x1lliihq.x1tzjh5l.x1k90msu.x2h7rmj.x1qfuztq');
        const targetElementAlt = document.querySelector('.FirstTopBarContentContainer .x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1xegmmw:nth-child(3) .x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.x1iwo8zk.x1033uif.x179ill4.x1b60jn0.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x78zum5.xl56j7k.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x1vqgdyp.x100vrsf.x1qhmfi1 .x14rh7hd.x1lliihq.x1tzjh5l.x1k90msu.x2h7rmj.x1qfuztq');

        if (targetElement && !document.querySelector('.x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1emribx.xfff67h.xu1161g.x12ca73t.x5vlmd')) {
            targetElement.parentNode.replaceChild(svgElement, targetElement);

        } else if (targetElement && document.querySelector('.x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1emribx.xfff67h.xu1161g.x12ca73t.x5vlmd')) {

            targetElementAlt.parentNode.replaceChild(svgElement, targetElementAlt);

        }

        const svgElement2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svgElement2.setAttribute("width", "16");
        svgElement2.setAttribute("height", "16");
        svgElement2.setAttribute("viewBox", "0 0 24 24");

        const MessengerIcon = document.createElementNS("http://www.w3.org/2000/svg", "image");

        MessengerIcon.setAttribute("href", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA5VDE3OjQ2OjI2KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wOVQxNzo1NDoxMiswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wOVQxNzo1NDoxMiswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDI2MTMwZi1iMWUzLTMyNDYtOWQ2Yi01MzNmZDczODIyYmEiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1ZGExNjEzMi00NWJlLTkwNDUtOTFjNC02NGY0YTRlOTk4YjMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyZDFkY2VmNy0wYzQ3LTQzNGEtYmMxOC1hYmUyNzllNmVhYzIiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJkMWRjZWY3LTBjNDctNDM0YS1iYzE4LWFiZTI3OWU2ZWFjMiIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wOVQxNzo0NjoyNiswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDI2MTMwZi1iMWUzLTMyNDYtOWQ2Yi01MzNmZDczODIyYmEiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDlUMTc6NTQ6MTIrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5kTLyMAAAARklEQVQ4EWP4//8/AyUYA4hbtf4nBWMYIO/Y+Z8UPAgMQPcPyQagO2fUAPwAq1pkQWJSHF4DiE0wBBMQAzmAIs04nUUEAACVBltuxxlXJAAAAABJRU5ErkJggg==");
        MessengerIcon.setAttribute("width", "24");
        MessengerIcon.setAttribute("height", "24");
        MessengerIcon.setAttribute("class", "OldMessengerIcon");

        svgElement2.appendChild(MessengerIcon);

        const targetElement2 = document.querySelector('.FirstTopBarContentContainer .x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1xegmmw:nth-child(3) .x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.x1iwo8zk.x1033uif.x179ill4.x1b60jn0.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x78zum5.xl56j7k.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x1vqgdyp.x100vrsf.x1qhmfi1 .x14rh7hd.x1lliihq.x1tzjh5l.x1k90msu.x2h7rmj.x1qfuztq');
        const targetElementAlt2 = document.querySelector('.FirstTopBarContentContainer .x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1xegmmw:nth-child(2) .x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.x1iwo8zk.x1033uif.x179ill4.x1b60jn0.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x78zum5.xl56j7k.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x1vqgdyp.x100vrsf.x1qhmfi1 .x14rh7hd.x1lliihq.x1tzjh5l.x1k90msu.x2h7rmj.x1qfuztq');

        if (targetElement2 && !document.querySelector('.x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1emribx.xfff67h.xu1161g.x12ca73t.x5vlmd')) {
            targetElement2.parentNode.replaceChild(svgElement2, targetElement2);

        } else if (targetElement2 && document.querySelector('.x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1emribx.xfff67h.xu1161g.x12ca73t.x5vlmd')) {

            targetElementAlt2.parentNode.replaceChild(svgElement2, targetElementAlt2);

        }

        const svgElement3 = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svgElement3.setAttribute("width", "16");
        svgElement3.setAttribute("height", "16");
        svgElement3.setAttribute("viewBox", "0 0 24 24");

        const FriendsIcon = document.createElementNS("http://www.w3.org/2000/svg", "image");

        FriendsIcon.setAttribute("href", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA5VDE3OjQ2OjI2KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wOVQxNzo1NjowNSswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wOVQxNzo1NjowNSswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplNTYwMWVmMC1lMTllLTUwNGItOWU5OC0wZmI2MjRlZmZkNjUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxM2E5MzhiMC0xNDA3LWI5NDItODRmYy02MzU5NzA4YTdiODkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiYzA0NDEzNC0xZDI5LTRlNDgtYjE4Mi1mODZlZjMwOGZhODEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmJjMDQ0MTM0LTFkMjktNGU0OC1iMTgyLWY4NmVmMzA4ZmE4MSIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wOVQxNzo0NjoyNiswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplNTYwMWVmMC1lMTllLTUwNGItOWU5OC0wZmI2MjRlZmZkNjUiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDlUMTc6NTY6MDUrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7RkO2JAAAAuUlEQVQ4y51SWw6CMBDsJcQPA56jfFg8mgFDPY7hFJyqOpgh69JW6ib7sRvmwXaMiVRl+/lgh8n8U8f2HurOh9r5UAx+Kz/P10dgF7uAqiSQLuAMnSWQYDb2cMIZLosJpLPsbVIEsV20Gjd+HbHp/FREoD9ejmeHWRNgt5sAmdAE2MVDpNSoJH8tqYyn0mqYGSbcI2l/AbutVT6bJCFp1fa3Nb4psCRhgDifLuOH+BdYB2iz2wPOheoFrkMOs1WSTakAAAAASUVORK5CYII=");
        FriendsIcon.setAttribute("width", "24");
        FriendsIcon.setAttribute("height", "24");
        FriendsIcon.setAttribute("class", "OldFriendsIcon");

        svgElement3.appendChild(FriendsIcon);

        const targetElement3 = document.querySelector('.FirstTopBarContentContainer .x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1xegmmw:nth-child(2) .x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.x1iwo8zk.x1033uif.x179ill4.x1b60jn0.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x78zum5.xl56j7k.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x1vqgdyp.x100vrsf.x1qhmfi1 .x14rh7hd.x1lliihq.x1tzjh5l.x1k90msu.x2h7rmj.x1qfuztq');
        const targetElementAlt3 = document.querySelector('.FirstTopBarContentContainer .x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1xegmmw:nth-child(1) .x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.x1iwo8zk.x1033uif.x179ill4.x1b60jn0.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x78zum5.xl56j7k.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x1vqgdyp.x100vrsf.x1qhmfi1 .x14rh7hd.x1lliihq.x1tzjh5l.x1k90msu.x2h7rmj.x1qfuztq');
        const extraElement = document.querySelector('.x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1emribx.xfff67h.xu1161g.x12ca73t.x5vlmd')

        if (targetElement3 && !extraElement) {
            targetElement3.parentNode.replaceChild(svgElement3, targetElement3);

        } else if (!targetElement3 && extraElement) {

            targetElementAlt3.parentNode.replaceChild(svgElement3, targetElementAlt3);

        }

    }

    function getUserName() {

        if(document.querySelector('[aria-label="Facebook"]')
           && !document.querySelector('.Username')) {

            setTimeout(() => {

                const getUserName = () => {

                    const profileLink = document.querySelector('a[aria-label$="Timeline"]');

                    if (!profileLink) return null;

                    const ariaLabel = profileLink.getAttribute("aria-label");

                    const name = ariaLabel.split(" ")[0];

                    console.log(name);
                    return name;

                };

                let a = document.createElement('a');
                a.textContent = `${getUserName()}`;
                a.style.fontSize = "11px";
                a.style.fontWeight = "bold";
                a.style.color = "rgb(216, 223, 234)";
                a.style.padding = "0px 6px";
                a.className = "Username";

                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    let newUrl = "/me";
                    window.history.pushState({}, '', newUrl);

                    window.dispatchEvent(new PopStateEvent('popstate'));

                });

                document.querySelector('.TopBarButtonsWrapper .html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x4k7w5x.x1h91t0o.x1h9r5lt.x1jfb8zj.xv2umb2.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1qrby5j').append(a);

            }, 1000);

        }

    }

    let birthdaysContainerRemoved = false;

    function createBirthdaysContainer() {

        const thirdColumn = document.querySelector('.ThirdColumnWrapper');
        const birthdaysContainer = document.querySelector('.BirthdaysContainer');

        if (!thirdColumn || birthdaysContainer || birthdaysContainerRemoved) return;

        let div = document.createElement('div');
        let style = document.createElement('style');
        div.className = "BirthdaysContainer";
        document.querySelector('.ThirdColumn').append(div);
        style.innerHTML = `
            .BirthdaysContainer {
                width: auto;
                height: fit-content;
                min-height: 40px;
                position: relative;
                display: block;

            }

                `;

        document.head.appendChild(style);

        setTimeout(() => {

            if (document.querySelector('[href*="/events/birthdays/"]')) {

                $('[role="complementary"] [href*="/events/birthdays/"] .x6s0dn4.xkh2ocl.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x9f619.x78zum5.x1q0g3np.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.x2lwn1j.xeuugli.x18d9i69.xyri2b.x1c1uobl.xexx8yu.x1n2onr6.x1ja2u2z').detach().appendTo('.BirthdaysContainer');

                $('.BirthdaysContainer .x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h:contains(have birthdays today.)').html(function(index, oldhtml) {
                    return oldhtml.replace('have birthdays today.', '');

                });

                let img = new Image();
                img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA3LTEwVDE2OjEzOjU3KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wNy0xMFQxNjo1MzowNyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNy0xMFQxNjo1MzowNyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNTBjMGUyYi1kNzMxLThjNDktODEyYy0wZDEwMWRjMGU4OWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxZjk0YjZjZC02OThlLTI1NDYtYjhhMi01ODA0NWVjZGQ4NGYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiMTE3NDk3Zi1mYjg1LTU5NDYtODFmOS1mY2EzMmJiY2M5ZDAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIxMTc0OTdmLWZiODUtNTk0Ni04MWY5LWZjYTMyYmJjYzlkMCIgc3RFdnQ6d2hlbj0iMjAyNC0wNy0xMFQxNjoxMzo1NyswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozNTBjMGUyYi1kNzMxLThjNDktODEyYy0wZDEwMWRjMGU4OWMiIHN0RXZ0OndoZW49IjIwMjQtMDctMTBUMTY6NTM6MDcrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Xf7dnAAACk0lEQVRIie2UXUhTcRjGRTY107a13Jxr4WhIpUlUSA4jIiMkIigGgtJV0EVehDFQk+gLL1YLSgXTPkQZelONkJG12UBkGPTlaShTt5xjrG0pZqGp9LbnH4tlwpnGbqKLh3M4HJ7f+z7v//8mEVFSIpVQ838QIBAI/tD3OU60NHnWOPGw+KXPWHMxVFVlHDtf3fDR+V60/N9VA4JNTZWuuoP2kH4PuUr30rOCfOpQb2FqPlYyMPWuq3RNgMXQo/2hB0d6R/dpvDekYmqRZVF/roLuKuSkl2ZQS66ELCc2kL85jfz38zzBJxXtgPEConEsulThub4cmjl9mF5rtazigcKdrAMA8ERHjgoRuQ2p5L6VSZ7OkgFewMKHoz1LbjlBn80SinTAjGEKNRatZ9Xj2+NsOZm3SunVGQm5DCk03llm4QeMlFkW3ogJmm5REZevZtHcKxbR83PprFKuWkh95WlkPZDNIPaT62j4UjJNPq2v5QXMu+vq5x1igoLXsuhtjpJBYDxlllGg7ScEQjztm8RkPZ5CXG0yBfobK/k7CLTqUH0sAB0gZ5hjqDB3XRWyymMBcQ0ZpwfmgIRuR/JVKqhXLWWGMPfdTGWw4QvJ7BRFAUM16fRpyKyNGwABgOoxSAwRHQCAd2SOObTJRb8A0yO27XEArAVfX2wkaCUAiwgdLANwVzTeL35nBi/gW9ChigxzFkcU1SIekzrzt4g8DUIWURRgO6XxIp64b/KMXdcd7pbNwgjmECqOmgOGoQLQtXvHqM/eW7jqVYFO/D36y6aibeO4WKg4ao533IXB6jxPrPmalh02ptN0R+fu0HWPX98chjnkNOziZicGlX+9TWMFQ3Q11nrItpJ5XIBE6D+AVz8AAM+o4xqSjREAAAAASUVORK5CYII=';
                img.style.backgroundPosition = "0 0";
                img.style.position = "relative";
                img.style.width = "24px";
                img.style.height = "24px";
                img.style.marginLeft = "-2px";

                document.querySelector('.BirthdaysContainer .x6s0dn4.xkh2ocl.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x9f619.x78zum5.x1q0g3np.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.x2lwn1j.xeuugli.x18d9i69.xyri2b.x1c1uobl.xexx8yu.x1n2onr6.x1ja2u2z').prepend(img);

            } else if (!document.querySelector('[href*="/events/birthdays/"]')) {

                const elementToRemove = document.querySelector('.BirthdaysContainer');

                if (elementToRemove) {
                    elementToRemove.remove();

                    birthdaysContainerRemoved = true;

                }

            }

        }, 1000);

    }

    function createStoriesContainerAndMakeAdjustments() {

        if (!document.querySelector('.StoriesContainer') && document.querySelector('.ThirdColumnWrapper')) {

            let div = document.createElement('div');
            let style = document.createElement('style');
            div.className = "StoriesContainer";
            document.querySelector('.ThirdColumn').append(div);
            style.innerHTML = `
                .StoriesContainer {
                    border-radius: 3px;
                    width: 244px;
                    height: fit-content;
                    position: relative;
                    display: block;

                }

                `;

            document.head.appendChild(style);

            let span = document.createElement('span');
            span.innerText = 'Stories';
            span.style.fontSize = "11px";
            span.style.fontWeight = "bold";
            span.style.color = "#616770";
            span.style.display = "block";
            span.style.background = "rgb(242, 242, 242)";
            span.style.borderTop = "1px solid rgb(226, 226, 226)";
            span.style.marginBottom = "8px";
            span.style.padding = "3px 6px";

            span.className = "StoriesText";

            document.querySelector('.StoriesContainer').append(span);

            let div2 = document.createElement('div');
            div2.style.display = "flex";
            div2.style.position = "relative";
            div2.style.minHeight = "56px";
            div2.style.marginBottom = "8px";

            div2.className = "StoryButtonsWrapper";

            document.querySelector('.StoriesContainer').append(div2);

            let div3 = document.createElement('div');
            div3.style.display = "block";
            div3.style.position = "relative";
            div3.style.minHeight = "56px";
            div3.style.marginLeft = "8px";
            div3.style.width = "220px";

            div3.className = "StoryTextWrapper";

            document.querySelector('.StoryButtonsWrapper').append(div3);

            setTimeout(() => {

                if (document.querySelectorAll('[aria-label="Stories"]').length > 0) {

                    const numberOfElements = 3;
                    const className = 'StoriesWrapper';

                    Array.from({ length: numberOfElements }).forEach(() => {

                        let div = document.createElement('div');
                        div.style.display = "flex";
                        div.style.position = "relative";
                        div.style.width = "244px";
                        div.style.minHeight = "56px";
                        div.style.height = "fit-content";

                        div.classList.add(className);

                        document.querySelector('.StoriesContainer').append(div);

                    });

                    const numberOfElements2 = 3;
                    const subClassName = 'StoryNamesWrapper';

                    const wrappers = document.querySelectorAll('.StoriesWrapper');

                    Array.from({ length: numberOfElements2 }).forEach((_, i) => {

                        let div2 = document.createElement('div');
                        div2.style.display = "block";
                        div2.style.position = "relative";
                        div2.style.width = "180px";
                        div2.style.minHeight = "56px";
                        div2.style.height = "fit-content";

                        div2.classList.add(subClassName);

                        wrappers[i].append(div2);

                    });

                }

            }, 1000);

            setTimeout(() => {

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(3) .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x1wpzbip.xvs2etk.xg3wpu6.x1jwbhkm.xgg4q86.x9f619.x78zum5.x1vqgdyp.xl56j7k.x6ikm8r.x10wlt62.x100vrsf.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1gp4ovq.x9p2oo0.x1h2mt7u.x56jcm7.x1tz4bnf.x1yqjg3l.x25epmt.xkkygvr:first').detach().prependTo('.StoriesContainer .StoriesWrapper:first');

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(3) .x78zum5.xdt5ytf.xz62fqu.x16ldp7u:first').detach().prependTo('.StoriesContainer .StoryNamesWrapper:first');

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(4) .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x1wpzbip.xvs2etk.xg3wpu6.x1jwbhkm.xgg4q86.x9f619.x78zum5.x1vqgdyp.xl56j7k.x6ikm8r.x10wlt62.x100vrsf.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1gp4ovq.x9p2oo0.x1h2mt7u.x56jcm7.x1tz4bnf.x1yqjg3l.x25epmt.xkkygvr:first').detach().prependTo($('.StoriesContainer .StoriesWrapper').eq(1));

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(4) .x78zum5.xdt5ytf.xz62fqu.x16ldp7u:first').detach().prependTo($('.StoriesContainer .StoryNamesWrapper').eq(1));

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(5) .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x1wpzbip.xvs2etk.xg3wpu6.x1jwbhkm.xgg4q86.x9f619.x78zum5.x1vqgdyp.xl56j7k.x6ikm8r.x10wlt62.x100vrsf.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1gp4ovq.x9p2oo0.x1h2mt7u.x56jcm7.x1tz4bnf.x1yqjg3l.x25epmt.xkkygvr:first').detach().prependTo($('.StoriesContainer .StoriesWrapper').eq(2));

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(5) .x78zum5.xdt5ytf.xz62fqu.x16ldp7u:first').detach().prependTo($('.StoriesContainer .StoryNamesWrapper').eq(2));

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(3) .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x6s0dn4.x1wpzbip.xlid4zk.x13tp074.x1qns1p2.xipx5yg.x9f619.x78zum5.x1vqgdyp.xl56j7k.x6ikm8r.x10wlt62.x100vrsf.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x1gp4ovq.xdio9jc.x1h2mt7u.x7g060r.xsdn2ir.x16rfsbj.x13awxeq.x16sykr7:first').detach().prependTo('.StoriesContainer .StoriesWrapper:first');

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(4) .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x6s0dn4.x1wpzbip.xlid4zk.x13tp074.x1qns1p2.xipx5yg.x9f619.x78zum5.x1vqgdyp.xl56j7k.x6ikm8r.x10wlt62.x100vrsf.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x1gp4ovq.xdio9jc.x1h2mt7u.x7g060r.xsdn2ir.x16rfsbj.x13awxeq.x16sykr7:first').detach().prependTo($('.StoriesContainer .StoriesWrapper').eq(1));

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(5) .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x6s0dn4.x1wpzbip.xlid4zk.x13tp074.x1qns1p2.xipx5yg.x9f619.x78zum5.x1vqgdyp.xl56j7k.x6ikm8r.x10wlt62.x100vrsf.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x1gp4ovq.xdio9jc.x1h2mt7u.x7g060r.xsdn2ir.x16rfsbj.x13awxeq.x16sykr7:first').detach().prependTo($('.StoriesContainer .StoriesWrapper').eq(2));

            }, 1000);

            let originalbtn = document.querySelector('[aria-label="Create story"]');

            let btn = document.createElement('a');
            btn.innerText = "Add to Your Story";
            btn.style.position = "relative";
            btn.style.color = "#365899";
            btn.style.fontSize = "11px";
            btn.style.cursor = "pointer";
            btn.style.fontWeight = "bold";
            btn.style.right = "5px"

            btn.className = "AddToStory";

            document.querySelector('.StoryTextWrapper').prepend(btn);

            btn.addEventListener("click", function() {
                originalbtn.click();

            });

            let span3 = document.createElement('span');
            span3.innerText = "Share a photo, video or write something";
            span3.style.fontSize = "11px";
            span3.style.color = "#8d949e";
            span3.style.wordBreak = "break-word";
            span3.style.fontWeight = "400";
            span3.style.display = "block";
            span3.style.position = "relative";
            span3.style.width = "167px";
            span3.style.marginTop = "3px";
            span3.style.right = "5px";

            document.querySelector('.StoryTextWrapper').append(span3);

        }

    }

    let sponsoredContainerRemoved = false;

    function createSponsoredContainer() {

        const thirdColumn = document.querySelector('.ThirdColumnWrapper');
        const sponsoredContainer = document.querySelector('.SponsoredContainer');
        if (!thirdColumn || sponsoredContainer || sponsoredContainerRemoved) return;

        let div = document.createElement('div');
        let style = document.createElement('style');
        div.className = "SponsoredContainer";
        document.querySelector('.ThirdColumn').append(div);
        style.innerHTML = `
            .SponsoredContainer {
                border-radius: 3px;
                width: 244px;
                height: fit-content;
                display: block;
                position: relative;

            }

        `;

        document.head.appendChild(style);

        let span = document.createElement('span');
        span.innerText = 'Sponsored';
        span.style.fontSize = "11px";
        span.style.lineHeight = "13px";
        span.style.fontWeight = "bold";
        span.style.color = "#616770";
        span.style.display = "block";
        span.style.background = "rgb(242, 242, 242)";
        span.style.borderTop = "1px solid rgb(226, 226, 226)";
        span.style.marginBottom = "8px";
        span.style.padding = "3px 6px";

        span.className = "SponsoredText";

        document.querySelector('.SponsoredContainer').append(span);

        let div2 = document.createElement('div');
        div2.style.width = "244px";
        div2.style.height = "fit-content";
        div2.style.display = "block";
        div2.style.position = "relative";

        div2.className = "WrapperForAds";

        document.querySelector('.SponsoredContainer').append(div2);

        setTimeout(() => {

            if (document.querySelector('[role="complementary"] .xwib8y2.x1y1aw1k')) {

                $('[role="complementary"] .xwib8y2.x1y1aw1k:first').detach().appendTo('.WrapperForAds');

                $('.SponsoredContainer .xwib8y2.x1y1aw1k :last-child .x78zum5.xdt5ytf.xz62fqu.x16ldp7u').detach().prependTo('.WrapperForAds div ~ div .x1n2onr6:first');

                $('.WrapperForAds div ~ div .x1n2onr6:first .x78zum5.xdt5ytf.xz62fqu.x16ldp7u:first').detach().prependTo('.WrapperForAds div :first .x1n2onr6:first');

            } else if (!document.querySelector('[role="complementary"] .xwib8y2.x1y1aw1k')) {

                const elementToRemove = document.querySelector('.SponsoredContainer');

                if (elementToRemove) {
                    elementToRemove.remove();

                    sponsoredContainerRemoved = true;

                }

            }

        }, 1000);

        setTimeout(() => {

            $('.x2lah0s.xyamay9.xv54qhq.x1l90r2v.xf7dkkf:first').detach().appendTo('.ThirdColumn');

        }, 1000);

    }

    function makeFurtherAdjustments() {

        if (!document.querySelector('.CreatePostTopPart')
            && !document.querySelector('.CreatePostBottomPart')
            && document.querySelector('[role="main"] .x193iq5w.xvue9z.xq1tmr.x1ceravr')) {

            let i = document.createElement('i');
            i.style.display = "block";
            i.style.position = "absolute";
            i.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAABZCAMAAAAEj4TKAAAAb1BMVEUAAAD///87WZjr7vRLZ6Cqqqp2i7dthLSRosWcrdCMnsa+x9pac6hheaxFYp6js9jR0dG4uLj8/Py0tLTq6up6jrnEzeDh5/O2wdisrKzu7u7t7e3k5ORgeKufrsxPaqNieq3a2tr6+vpSbqZrgbF+bqpmAAAAAXRSTlMAQObYZgAAAN1JREFUeF7N0OeKhTAQhmFnJs1yet/e7v8aN1FD1A83cArs+0d4SBuLx2RRrAXx3UFWBGfbE+Ftq+I/5lTMRVIUU7NUlvekSoU8KNeTt5BKTyj7KhUoYfv9GRLMCHJtCx60aIlHjehViCYkBBQgR9Q2IhEikczGLC1tF5H/LOcIx749fp/KBwEx8UTeDFA3z6E/ZPi/OmLnekhkzPXEbI6BmnSjyDl4I8Vsn19AercH0nq9BdKbJyB9ecmsimfhjfiufDXKcw1C0ZJQtCQT89JZ8VffMTRch3vxvCLTL0VkDlOQUDf0AAAAAElFTkSuQmCC)";
            i.style.backgroundPosition = "0px -76px";
            i.style.backgroundRepeat = "no-repeat";
            i.style.height = "6px";
            i.style.width = "9px";
            i.style.left = "4px";
            i.style.top = "28px";

            i.className = "PostArrow";

            document.querySelector('[role="main"] .x1n2onr6.x1ja2u2z.x1jx94hy.xw5cjc7.x1dmpuos.x1vsv7so.xau1kf4.x9f619.xh8yej3.x6ikm8r.x10wlt62.xquyuld').prepend(i);

            let div = document.createElement('div');
            div.style.display = 'block';
            div.style.position = 'relative';
            div.style.height = 'auto';
            div.style.padding = "5px 0px 10px";
            div.style.right = "16px";

            div.className = "CreatePostTopPart";

            document.querySelector('[role="main"] .x1n2onr6.x1ja2u2z.x1jx94hy.xw5cjc7.x1dmpuos.x1vsv7so.xau1kf4.x9f619.xh8yej3.x6ikm8r.x10wlt62.xquyuld').prepend(div);

            let div2 = document.createElement('div');
            div2.style.display = 'table-cell';
            div2.style.position = 'relative';
            div2.style.background = 'rgb(242, 242, 242)';
            div2.style.height = '30px';
            div2.style.width = '511px';
            div2.style.border = "1px solid rgb(180, 187, 205)";
            div2.style.borderRadius = "0px";

            div2.className = "CreatePostBottomPart";

            document.querySelector('[role="main"] .x1n2onr6.x1ja2u2z.x1jx94hy.xw5cjc7.x1dmpuos.x1vsv7so.xau1kf4.x9f619.xh8yej3.x6ikm8r.x10wlt62.xquyuld').append(div2);

            let span = document.createElement('span');
            span.innerText = 'Update Status';
            span.style.display= "inline-block";
            span.style.paddingLeft = "21px";
            span.style.fontSize = "11px";
            span.style.fontWeight = "bold";
            span.style.color = "rgb(51, 51, 51)";
            span.style.cursor = "default";

            span.className = "UpdateStatus";

            document.querySelector('.CreatePostTopPart').append(span);

            let i2 = document.createElement('i');
            i2.style.display = "inline-block";
            i2.style.position = "relative";
            i2.style.verticalAlign = "middle";
            i2.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTEwVDAwOjIzOjQxKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0xMFQwMDoyNDozOCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0xMFQwMDoyNDozOCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyOGU2MTYzMy1kMmZmLTZiNDUtODliNC0xODhmNDVmN2I4ZTAiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmOTgzOGJiOS04M2ViLWJkNDEtYjIwOC03NzE1NzU1YjRmYjgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkMTJkMjUxYi1jMDU1LWVlNDItYmM5Yi00NjU3NTg0ZmE4YTgiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQxMmQyNTFiLWMwNTUtZWU0Mi1iYzliLTQ2NTc1ODRmYThhOCIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0xMFQwMDoyMzo0MSswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyOGU2MTYzMy1kMmZmLTZiNDUtODliNC0xODhmNDVmN2I4ZTAiIHN0RXZ0OndoZW49IjIwMjUtMDMtMTBUMDA6MjQ6MzgrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6jWBpXAAAAeUlEQVQokWNY3Jt6Foj/k4jPMoAYP59uJAmD9FCm8dutuSRhuMa/n0+ThKmnccvCDpyYNjae3TsfA1Pkx0sHpsLx8U3t/2fV+JwlysbTO3r/v7q9CYyBmv4zMDDwEGUjTCNcEwgQo/HQmgZUTSAAci9IkAA+i6IJCACxo2Gb2dh5IAAAAABJRU5ErkJggg==)";
            i2.style.backgroundPosition = "0 0";
            i2.style.backgroundRepeat = "no-repeat";
            i2.style.height = "16px";
            i2.style.width = "16px";
            i2.style.left = "-3px";

            i2.className = "StatusIcon";

            document.querySelector('.UpdateStatus').prepend(i2);

            let span2 = document.createElement('span');
            span2.innerText = 'Add Photos/Video';
            span2.style.display= "inline-block";
            span2.style.paddingLeft = "21px";
            span2.style.fontSize = "11px";
            span2.style.fontWeight = "bold";
            span2.style.color = "rgb(59, 89, 152)";
            span2.style.cursor = "pointer";

            span2.className = "AddPhotosAndVideos";

            document.querySelector('.CreatePostTopPart').append(span2);

            let i3 = document.createElement('i');
            i3.style.display = "inline-block";
            i3.style.position = "relative";
            i3.style.verticalAlign = "middle";
            i3.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTEwVDAwOjMzOjQxKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0xMFQwMDozNDoxNSswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0xMFQwMDozNDoxNSswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyN2JkNjFmOC02ODg0LWRlNGYtOGFjOS03MjdkOThlNzEzZTAiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1OTEzZjM1My0yYzkxLWU3NDEtYTZiMC05ZmU3MjZhNDkwM2UiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MjZhNzlkNS01N2M0LTBkNDQtOGNhYS05ZjFkOWVjYzM4MmEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUyNmE3OWQ1LTU3YzQtMGQ0NC04Y2FhLTlmMWQ5ZWNjMzgyYSIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0xMFQwMDozMzo0MSswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyN2JkNjFmOC02ODg0LWRlNGYtOGFjOS03MjdkOThlNzEzZTAiIHN0RXZ0OndoZW49IjIwMjUtMDMtMTBUMDA6MzQ6MTUrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4SiJYjAAAAzklEQVQoFWOYPHny/9raWqIxSD0DMgAJvn///j8xAKQOpB7DABCYu+Y0QQwCeA0gyzvIBpDlHXQDQOD1oX44frwy8f+qHLn/C9Jk/9/q04OLw71DyIBtJYr/6wLEwbgtVOL/q33tYEyUAS/3tsI1wzDIRUQbAMLLs+TgmqfESWN3ASzgsIbBijiw00EG7KtUwgwD9KhDNwCEF6XLgg241auLacDnz5/BLoBFCwg8XpX8/2q72v8tRQr/J8ZIoQQiSOxQjTLuREVRsiYnJQIAtU90vJYDnn8AAAAASUVORK5CYII=)";
            i3.style.backgroundPosition = "0 0";
            i3.style.backgroundRepeat = "no-repeat";
            i3.style.height = "16px";
            i3.style.width = "16px";
            i3.style.left = "-6px";

            i3.className = "PhotosAndVideosIcon";

            document.querySelector('.AddPhotosAndVideos').prepend(i3);

            let div3 = document.createElement('div');
            div3.style.display = "block";
            div3.style.position = "relative";
            div3.style.float = "right";
            div3.style.margin = "4px";
            div3.style.padding = "0px";

            div3.className = "PostButtonWrapper";

            document.querySelector('.CreatePostBottomPart').append(div3);

            let originalbtn = document.querySelector('[aria-label="Create a post"] [role="button"]');

            let btn = document.createElement('button');
            btn.innerText = "Post";
            btn.style.display = "inline-block";
            btn.style.position = "relative";
            btn.style.height = "22px"
            btn.style.lineHeight = "20px";
            btn.style.padding = "0px 16px";
            btn.style.backgroundColor = "rgb(91, 116, 168)";
            btn.style.backgroundPosition = "352px -495px";
            btn.style.backgroundRepeat = "no-repeat";
            btn.style.border = "1px solid";
            btn.style.borderColor = "rgb(41, 68, 126) rgb(41, 68, 126) rgb(26, 53, 110)";
            btn.style.boxShadow = "rgba(0, 0, 0, 0.0976562) 0px 1px 0px";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "11px";
            btn.style.fontWeight = "bold";
            btn.style.color = "#fff";

            btn.className = "PostButton";

            document.querySelector('.PostButtonWrapper').append(btn);

            btn.addEventListener("click", function() {
                originalbtn.click();

            });

            btn.addEventListener('mouseover', () => {
                btn.style.background = 'rgb(91 116 168 / 80%)';

            });

            btn.addEventListener('mouseout', () => {
                btn.style.background = 'rgb(91, 116, 168)';

            });

            $('.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x676frb.x1nxh6w3.x1sibtaa.xo1l8bm.xi81zsa:contains(Meta © 2025)').html(function(index, oldhtml) {
                return oldhtml.replace('Meta © 2025', 'Facebook © 2013');

            });

            $('[placeholder="Search Facebook"]').attr('placeholder','Search for people, places and things');

        }

    }

    function modifyProfileButtons() {

        if (!document.querySelector('.ProfileButtonsWrapper')
            && document.querySelector('.x78zum5.xdt5ytf.x1t2pt76')
            && document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xf7dkkf.xv54qhq.xqdwrps.x16i7wwg.x1y5dvz6')
            && !document.querySelector('[aria-label="Joined"]')
            && !document.querySelector('[aria-label="Join group"]')
            && !document.querySelector('[aria-label="Event Permalink"]')
            && !document.querySelector('[aria-label="View profile"]')) {

            $('.x78zum5.xdt5ytf.x1t2pt76 .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xf7dkkf.xv54qhq.xqdwrps.x16i7wwg.x1y5dvz6 .x1itg65n.x6ikm8r.x10wlt62.x1n2onr6.xh8yej3.x1ja2u2z.x1a2a7pz:first').detach().appendTo('.x6s0dn4.x78zum5.xvrxa7q.x9w375v.xxfedj9.x1roke11.x1es02x0:first');

            $('[aria-label="Profile settings see more options"]').detach().appendTo('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy .xdwrcjd.x2fvf9.x1xmf6yo.x1w6jkce.xusnbm3:last');

            let div = document.createElement('div');
            let style = document.createElement('style');
            div.className = "ProfileButtonsWrapper";
            document.querySelector('.x78zum5.xdt5ytf.x1t2pt76 .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xf7dkkf.xv54qhq.xqdwrps.x16i7wwg.x1y5dvz6').append(div);
            style.innerHTML = `
                .ProfileButtonsWrapper {
                    display: flex;
                    position: relative;
                    width: 851px;
                    min-height: 76px;
                    right: 16px;

                }

            `;

            document.head.appendChild(style);

            let div2 = document.createElement('div');
            let style2 = document.createElement('style');
            div2.className = "AboutSectionWrapper";
            document.querySelector('.ProfileButtonsWrapper').append(div2);
            style2.innerHTML = `
                .AboutSectionWrapper {
                    display: block;
                    position: relative;
                    height: 110px;
                    width: 449px;
                    padding: 1px 1px 1px 0px;
                    cursor: pointer;

                }

            `;

            document.head.appendChild(style2);

            let div3 = document.createElement('div');
            let style3 = document.createElement('style');
            div3.className = "AboutSectionContainer";
            document.querySelector('.AboutSectionWrapper').append(div3);
            style3.innerHTML = `
                .AboutSectionContainer {
                    display: block;
                    position: relative;
                    height: 70px;
                    padding: 3px 0px 0px 26px;
                    border-top-left-radius: 0px;
                    border-bottom-left-radius: 0px;
                    border-top-right-radius: 2px 2px;
                    border-bottom-right-radius: 2px 2px;
                    border-width: 1px 1px 1px 0px;
                    border-style: solid solid solid none;
                    border-color: rgb(229, 231, 235) rgb(229, 231, 235) rgb(229, 231, 235);
                    background-color: rgb(241, 243, 248);

                }

            `;

            document.head.appendChild(style3);

            const numberOfElements = 3;
            const className = 'TabsWrapper';

            Array.from({ length: numberOfElements }).forEach(() => {

                let div4 = document.createElement('div');
                let style4 = document.createElement('style');
                div4.className = "TabsWrapper";
                document.querySelector('.ProfileButtonsWrapper').append(div4);
                style4.innerHTML = `
                    .TabsWrapper {
                        display: block;
                        position: relative;
                        width: 113px;
                        height: 110px;
                        padding-left: 6px;
                        cursor: pointer;

                    }

                `;

                document.head.appendChild(style4);

            });

            const numberOfElements2 = 3
            const subClassName = 'TabContainer';

            const wrappers = document.querySelectorAll('.TabsWrapper');

            Array.from({ length: numberOfElements2 }).forEach((_, i) => {

                let div5 = document.createElement('div');
                let style5 = document.createElement('style');
                document.querySelector('.TabsWrapper').append(div5);
                style5.innerHTML = `
                    .TabContainer {
                        display: flex;
                        flex-wrap: wrap;
                        position: relative;
                        justify-content: center;
                        width: 111px;
                        height: 73px;
                        background-color: rgb(241, 243, 248);
                        border: 1px solid rgba(0, 0, 0, 0.148438);
                        border-radius: 2px;

                    }

                `;

                document.head.appendChild(style5);

                div5.classList.add(subClassName);

                wrappers[i].append(div5);

            });

            let div6 = document.createElement('div');
            let style6 = document.createElement('style');
            div6.className = "MoreButtonWrapper";
            document.querySelector('.ProfileButtonsWrapper').append(div6);
            style6.innerHTML = `
                .MoreButtonWrapper {
                    display: block;
                    position: relative;
                    width: 38px;
                    height: 75px;
                    padding-left: 6px;
                    cursor: pointer;

                }

            `;

            document.head.appendChild(style6);

            let div7 = document.createElement('div');
            let style7 = document.createElement('style');
            div7.className = "MoreButtonContainer";
            document.querySelector('.MoreButtonWrapper').append(div7);
            style7.innerHTML = `
                .MoreButtonContainer {
                    display: flex;
                    position: relative;
                    justify-content: center;
                    width: 36px;
                    height: 71px;
                    background-color: rgb(241, 243, 248);
                    border: 1px solid rgba(0, 0, 0, 0.148438);
                    border-right: none!important;
                    border-radius: 2px;
                    border-top-right-radius: 0px;
                    border-bottom-right-radius: 0px;
                    margin-right: 0px;
                    border-width: 1px 0px 1px 1px;
                    border-style: solid none solid solid;
                    padding: 1px 0px 1px 1px;
                    border-color: rgb(229, 231, 235) white rgb(229, 231, 235) rgb(229, 231, 235);

                }

            `;

            document.head.appendChild(style7);

            let div8 = document.createElement('div');
            let style8 = document.createElement('style');
            div8.className = "SeeMoreButton";
            document.querySelector('.MoreButtonContainer').append(div8);
            style8.innerHTML = `
               .SeeMoreButton {
                   background-color: #fff;
                   border: 1px solid #a6a6a6;
                   margin-top: -9px;
                   margin-left: -17px;
                   position: absolute;
                   top: 50%;
                   border-radius: 1px;
                   box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
                   padding: 1px 4px;
                   height: 14px;
                   width: 17px;

               }

            `;

            document.head.appendChild(style8);

        }

    }

    function addFunctionalityToProfileButtons(id) {

        if(document.querySelector('.ProfileButtonsWrapper')
           && !document.querySelector('.AboutButton')
           && !document.querySelector('.FriendsButton')
           && !document.querySelector('.PhotosButton')
           && !document.querySelector('.VideosButton')) {

            let span = document.createElement('span');
            let style = document.createElement('style');
            span.className = "AboutButton";
            span.textContent = "About";
            document.querySelector('.AboutSectionWrapper').append(span);
            style.innerHTML = `
                .AboutButton {
                    display: inline-block;
                    font-size: 11px;
                    font-weight: normal;
                    color: rgb(59, 89, 152);
                    padding-top: 4px;
                    padding-left: 43px;

                }

            `;

            document.head.appendChild(style);

            let span2 = document.createElement('span');
            span2.className = "PhotosButton";
            span2.textContent = "Photos";

            let span3 = document.createElement('span');
            span3.className = "FriendsButton";
            span3.textContent = "Friends";

            let span4 = document.createElement('span');
            span4.className = "VideosButton";
            span4.textContent = "Videos";

            let span5 = document.createElement('span');
            span5.className = "FollowersButton";
            span5.textContent = "Followers";

            let style2 = document.createElement('style');
            style2.innerHTML = `
                .PhotosButton, .FriendsButton, .VideosButton, .FollowersButton {
                    display: inline-block;
                    font-size: 11px;
                    font-weight: normal;
                    color: rgb(59, 89, 152);
                    height: 17px;
                    padding-top: 4px;

                }

            `;

            document.head.appendChild(style2);

            let aboutButton = document.querySelector('.AboutSectionWrapper');

            aboutButton.addEventListener('click', (e) => {
                e.preventDefault();
                let newUrl = `/profile.php?id=${id}&sk=about`;
                window.history.pushState({}, '', newUrl);

                window.dispatchEvent(new PopStateEvent('popstate'));

            });

            let tabs = document.querySelectorAll('.ProfileButtonsWrapper .TabsWrapper');

            tabs[0].append(span2);

            tabs[0].addEventListener('click', (e) => {
                e.preventDefault();
                let newUrl = `/profile.php?id=${id}&sk=photos`;
                window.history.pushState({}, '', newUrl);

                window.dispatchEvent(new PopStateEvent('popstate'));

            });

            if(document.querySelector('[href*="/friends"]')
               && !document.querySelector('[href*="/followers/"]')) {

                tabs[1]?.append(span3);

                tabs[1].addEventListener('click', (e) => {
                    e.preventDefault();
                    let newUrl = `/profile.php?id=${id}&sk=friends`;
                    window.history.pushState({}, '', newUrl);

                    window.dispatchEvent(new PopStateEvent('popstate'));

                });

            } else if(document.querySelector('[href*="/friends"]')
                      && document.querySelector('[href*="/followers/"]')) {

                tabs[1]?.append(span5);

                tabs[1].addEventListener('click', (e) => {
                    e.preventDefault();
                    let newUrl = `/profile.php?id=${id}&sk=followers`;
                    window.history.pushState({}, '', newUrl);

                    window.dispatchEvent(new PopStateEvent('popstate'));

                });

            }

            if(document.querySelector('[href*="/friends"]')) {

                tabs[2]?.append(span4);

                tabs[2].addEventListener('click', (e) => {
                    e.preventDefault();
                    let newUrl = `/profile.php?id=${id}&sk=videos`;
                    window.history.pushState({}, '', newUrl);

                    window.dispatchEvent(new PopStateEvent('popstate'));

                });

            } else if(!document.querySelector('[href*="/friends"]')) {

                tabs[1]?.append(span4);

                tabs[1].addEventListener.addEventListener('click', (e) => {
                    e.preventDefault();
                    let newUrl = `/profile.php?id=${id}&sk=videos`;
                    window.history.pushState({}, '', newUrl);

                    window.dispatchEvent(new PopStateEvent('popstate'));

                });

            }

        }

    }

    function appendDropdownMenuToSeeMore(id) {

        if (document.querySelector('.SeeMoreButton')
            && !document.querySelector('.SeeMoreButtonDropdown')) {

            let ul = document.createElement('ul');
            ul.style.display = "none";
            ul.style.position = "absolute";
            ul.style.height = "auto";
            ul.style.maxWidth = "104px";
            ul.style.width = "104px";
            ul.style.padding = "5px 0px";
            ul.style.background = "#fff";
            ul.style.border = "1px solid rgba(100, 100, 100, 0.4)";
            ul.style.borderRadius = "0px";
            ul.style.transform = "translate(-5px, 15px)";

            ul.className = "SeeMoreButtonDropdown";

            document.querySelector('.SeeMoreButton').append(ul);

            let btn = document.querySelector('.MoreButtonContainer');

            btn.addEventListener('click', () => {
                if (ul.style.display === "block") {

                    ul.style.display = "none";
                    btn.setAttribute("aria-expanded", "false");

                } else {

                    ul.style.display = "block";
                    btn.setAttribute("aria-expanded", "true");

                }

            });

            document.addEventListener('click', e => {

                if(!ul.contains(e.target) && e.target !== btn) {

                    ul.style.display = "none";
                    btn.setAttribute("aria-expanded", "false");

                }

            });

            const numberOfElements = 6;
            const className = 'SeeMoreDropdownListItem';
            const items = [

                { text: "Timeline", href: `/profile.php?id=${id}` },
                { text: "Following", href: `/profile.php?id=${id}&sk=following` },
                { text: "Likes", href: `/profile.php?id=${id}&sk=likes` },
                { text: "Events", href: `/profile.php?id=${id}&sk=events` },
                { text: "Music", href: `/profile.php?id=${id}&sk=music` },
                { text: "Apps and games", href: `/profile.php?id=${id}&sk=games` }

            ];

            Array.from({ length: numberOfElements }).forEach((_, index) => {

                let text = document.createElement('a');
                text.href = items[index].href;
                text.style.display = "block";
                text.style.position = "relative";
                text.style.width = "auto";
                text.style.height = "18px";
                text.style.padding = "1px 11px 1px 11px";
                text.style.cursor = "pointer";
                text.style.textDecoration = "none";

                text.classList.add(className);

                document.querySelector('.SeeMoreButtonDropdown').append(text);

                const span = document.createElement('span');
                span.textContent = items[index].text;
                span.style.fontSize = "11px";
                span.style.fontWeight = "normal"
                span.style.lineHeight = "18px";
                span.style.cursor = "pointer";
                span.style.color = "rgb(59, 89, 152)";
                span.style.textDecoration = "none";

                span.className = "SeeMoreDropdownText";

                text.appendChild(span);

            });

        }

    }

    function getId() {

        if (location.pathname == '/profile.php') {

            addFunctionalityToProfileButtons(new URLSearchParams(location.search).get('id'));
            appendDropdownMenuToSeeMore(new URLSearchParams(location.search).get('id'));

        } else if (location.pathname == '/friends/suggestions/') {

            addFunctionalityToProfileButtons(new URLSearchParams(location.search).get('profile_id'));
            appendDropdownMenuToSeeMore(new URLSearchParams(location.search).get('id'));

        } else {

            GM.xmlHttpRequest({
                method: 'get',
                url: location.origin + location.pathname,
                onload: response => {

                    const userId = response.responseText?.match(/(?<=userID":")\d*/g)?.[0];
                    if (userId) addFunctionalityToProfileButtons(userId);
                    if (userId) appendDropdownMenuToSeeMore(userId);

                }

            });

        }

    }

    var url;

    setInterval(() => {

        if (url != location.href) {
            url = location.href;

            setTimeout(() => {

                if (!document.querySelector('#mpLink') &&

                    !location.pathname.match(/^\/$|\/groups*|\/messages*|\/marketplace*|\/watch*|\/reel*|\/events*|\/gaming*|\/memories*|\/saved*|\/fundraisers*|\/pages*|\/settings*|\/help*|\/ads*/g) &&
                    document.querySelectorAll('circle[cx="84"]')) {
                    getId();

                }

            }, 900);

        }

    }, 200);

    function moveListIntoAboutContainer() {

        if (document.querySelector('.xieb3on ul')
            && document.querySelector('.AboutSectionContainer')) {

            const list = document.querySelector('.xieb3on ul');
            const aboutContainer = document.querySelector('.AboutSectionContainer');

            if (aboutContainer && list) {

                if (!aboutContainer.querySelector('a')) aboutContainer.appendChild(list.cloneNode(true));

            } else {

                setTimeout(moveListIntoAboutContainer(), 500);

            }

        }

    }

    function createProfileButtons() {

        if (document.querySelector('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy .xdwrcjd.x2fvf9.x1xmf6yo.x1w6jkce.xusnbm3:first-child')
            && !document.querySelector('[aria-label="Suggestions"]')
            && !document.querySelector('[aria-label="temp heading"]')
            && !document.querySelector('[aria-label="Event Permalink"]')
            && !document.querySelector('.UpdateInfo')
            && !document.querySelector('.ActivityLog')
            && !document.querySelector('[aria-label="Message"]')
            && !document.querySelector('[aria-label="Search"]')) {

            let btn = document.createElement('button');
            btn.innerText = "Update Info";
            btn.style.display = "block";
            btn.style.position = "relative";
            btn.style.border = "1px solid #ced0d4";
            btn.style.background = "transparent";
            btn.style.backgroundImage = "url(data:image/png;base64,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)";
            btn.style.height = "19px";
            btn.style.padding = "2px 6px";
            btn.style.boxSizing = "content-box";
            btn.style.borderRadius = "3px";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "13px";
            btn.style.fontWeight = "bold";
            btn.style.color = "#4b4f56";

            btn.className = "UpdateInfo";

            document.querySelector('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy .xdwrcjd.x2fvf9.x1xmf6yo.x1w6jkce.xusnbm3:first-child').append(btn);

            btn.addEventListener('click', () => {
                window.location.href = "/me/about";

            });

            btn.addEventListener('mouseover', () => {
                btn.style.backgroundColor = 'rgb(233, 235, 238)';

            });

            btn.addEventListener('mouseout', () => {
                btn.style.backgroundColor = 'transparent';

            });

            let btn2 = document.createElement('button');
            btn2.innerText = "Activity Log";
            btn2.style.display = "block";
            btn2.style.position = "relative";
            btn2.style.border = "1px solid #ced0d4";
            btn2.style.background = "transparent";
            btn2.style.backgroundImage = "url(data:image/png;base64,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)";
            btn2.style.height = "19px";
            btn2.style.padding = "2px 6px";
            btn2.style.boxSizing = "content-box";
            btn2.style.borderRadius = "2px";
            btn2.style.cursor = "pointer";
            btn2.style.fontSize = "13px";
            btn2.style.fontWeight = "bold";
            btn2.style.color = "#4b4f56";

            btn2.className = "ActivityLog";

            document.querySelector('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy .xdwrcjd.x2fvf9.x1xmf6yo.x1w6jkce.xusnbm3:nth-child(2)').append(btn2);

            btn2.addEventListener('click', () => {
                window.location.href = "https://www.facebook.com/you/allactivity/?category_key=ALL&entry_point=profile_shortcut&should_load_landing_page=1";

            });

            btn2.addEventListener('mouseover', () => {
                btn2.style.backgroundColor = 'rgb(233, 235, 238)';

            });

            btn2.addEventListener('mouseout', () => {
                btn2.style.backgroundColor = 'transparent';

            });

        }

    }

    function createProfileIcons() {

        if (document.querySelector('.x7wzq59')
            && !document.querySelector('.IconContainer')) {

            let IconContainers = [];

            for (let i = 0; i < 2; i++) {
                let IconContainer = document.createElement('div');
                IconContainer.style.display = "inline-block";
                IconContainer.style.position = "relative";
                IconContainer.style.height = "32px";
                IconContainer.style.width = "32px";
                IconContainer.style.top = "6px";
                IconContainer.style.marginRight = "7px";
                IconContainer.className = "IconContainer";
                IconContainers.push(IconContainer);

            }

            if (document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/photos"]')) {
                document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/photos"]').prepend(IconContainers[0]);

            }

            if (document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/friends"]')) {
                document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/friends"]').prepend(IconContainers[1]);

            }

            if (document.querySelector('.IconContainer')
                && !document.querySelector('.PhotoIcon')
                && !document.querySelector('.FriendsIcon')) {

                if (document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/photos"] .IconContainer')) {

                    let photoIcon = document.createElement('i')
                    photoIcon.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA3VDAyOjIwOjIwKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wN1QwMzo0NToxOCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wN1QwMzo0NToxOCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMjU1NjI1MC0xYzIwLTM4NGMtYWRlOS0zMTFhYjBjNTEzYTUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0MTcxNTg5YS1hZjZhLWIyNDQtYTVlMS1jNTc1YmQ3Y2Q1OTkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3ODg0Zjk4Mi1mM2JkLTc1NDktYTc1MC03ZGRlNzQyMWZiOTMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjc4ODRmOTgyLWYzYmQtNzU0OS1hNzUwLTdkZGU3NDIxZmI5MyIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wN1QwMjoyMDoyMCswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozMjU1NjI1MC0xYzIwLTM4NGMtYWRlOS0zMTFhYjBjNTEzYTUiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDdUMDM6NDU6MTgrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Zs2QHAAABGklEQVRIx+WWzQqCQBCAe4aetQcIOnXon/BoP1CXJAoqhPBQaRRFh4KIiCDIc9dCmRrJsNI1V9eCFj5WHHc+xl2WiRRrY+4GMISL2A0Mni8aMzD/74rb0jowPIt7w41vqMW8MINsRaYmXRpBQ1waJIqS/YGzE+Ni5vv+s2JR3gaGZ/FguvcNtfhwPAEOnEMVa7puiHEOt2L1XrEacsVf22OvCOIKuPrEAJ+ZiyVlB9XWAjIlGXIVxSBTloFvzv2JXyuxld5E+aryRIofkcUI3rWvYqdK8B3GSFJXsQle7lYxKakpJ0mpxJ3BxjUpxkhxJ/FbzxUv9B8f4aFwS/oJb2IcsWQ3asX6F4KQOopJzUEQUirx33SezJv8K3PmxtLejlyJAAAAAElFTkSuQmCC)';
                    photoIcon.style.backgroundRepeat = "no-repeat";
                    photoIcon.style.display = "block";
                    photoIcon.style.position = "relative";
                    photoIcon.style.height = "32px";
                    photoIcon.style.width = "32px";

                    photoIcon.className = "PhotoIcon";

                    document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/photos"] .IconContainer').append(photoIcon);

                }

            }

            if (document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/friends"] .IconContainer')) {

                let friendsIcon = document.createElement('i')
                friendsIcon.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAbCAYAAAAdx42aAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA3VDAyOjIwOjIwKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wN1QwMzo0OTo0MCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wN1QwMzo0OTo0MCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMzE3YmE1OC0xNDZlLTliNDMtYjNjYy1hYjJkYjI5N2E2MGMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDowZDhiZGE1Ni04NGQ5LWEwNDQtOTA1ZC05MjliMDI2MTNlNGUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMTAxZGU2Zi03MmJkLWRhNGYtOTI3Yy0zZWIxMzc5OWNmMDMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmUxMDFkZTZmLTcyYmQtZGE0Zi05MjdjLTNlYjEzNzk5Y2YwMyIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wN1QwMjoyMDoyMCswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozMzE3YmE1OC0xNDZlLTliNDMtYjNjYy1hYjJkYjI5N2E2MGMiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDdUMDM6NDk6NDArMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4sTE+YAAACtElEQVRIx+2WvU9TURjGG8PsYIwxDsTJgcE4GGIcHBwcnByMYfBPMI1xMuwkDfUrSvzgcgGRehGw0pZahWBLC6UFsX6V0mA1MemgaIhxIo05Pk9p9fb0ftVYXGzyDD3v0/P80vPe816Xy+LT3RdvgY5BXVACCnDNtR0fBB2Hpr1qQtwYTopB/7JQRhcF11hrdngHgtf7x5+Lx/F8jbjGGj3NCt/drcYLI+FXdeFVsUYPvc0AaPeq8dJkbNUUgDV66DXaw9Mb64CWoA1oATrdCMARbL4ZjOZMAVijh14peCdUvDI4J8KAXM4WRfBZTlwemBNYX4NanAAcxubfAzMrpgCs0UOvBBB5EHkt3n38UqfhQIYQmhOAgzjfjUfTWVMA1uihVxe+Ayqtvv9sCJDJFQnwzQnA+WtD86bhVdFDrw6g1aPMGoZX5emdJcQuO4BzV+/aA9BDrw6gzRZAKQO0OmnCr36LI2CNHn0TYuOj+O4EoM3JMYT6xhZNAVijR2rAM+x2KwDeqvCdcALgtuqDyvm7JQDvnZG0JUCPb4EAF50A7EGX57TJl3XhXGONHgkgOzW/ZgnA+4MXk9MLaWbgYf0s4BprUvgBuwaUnoS9TuZBXjOYB9rWHMjr5wA2dPP8J3BBmd0DK4VP5ea91F/ug7N2ABdwzj/CBvOAa6zRI/0Lp6CEL5ipu4wYjn9uE/UodNIu/BAesfTQxAvTJmSNHnoNBtEYIGoAeGxYV2ynIKRi43WrcAmC7wWqfioi6JY6vlQDcFtLEaDLLHg/pHCzm/dTwj/11jb814UEL39TAVG4F4LSIXS7HmD0yRsCPDUE6PElPzQabAZy/V6yJIdLEBzJ7TLAHwfL4l5Wj2A0VeAjTJAItG/bAariO0NlLnT+E4Dfl1JM/Acoj142xt9Q5VwbUegne09sfwVDLloAAAAASUVORK5CYII=)';
                friendsIcon.style.backgroundPosition = "0px 0px";
                friendsIcon.style.backgroundRepeat = "no-repeat";
                friendsIcon.style.display = "block";
                friendsIcon.style.position = "relative";
                friendsIcon.style.width = "32px";
                friendsIcon.style.height = "32px";

                friendsIcon.className = "FriendsIcon";

                document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/friends"] .IconContainer').append(friendsIcon);

            }

            const friendsLink = document.querySelector('[href*="/friends/"]');
            const followersLink = document.querySelector('[href*="/followers/"]');
            const friendsIcon = document.querySelector('.TabsWrapper .ProfileFriendsIcon')
            const followersIcon = document.querySelector('.TabsWrapper .ProfileFollowersIcon')
            const followers = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1cy8zhl.xyamay9 span [href*="/followers/"]');
            const friends = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1cy8zhl.xyamay9 span [href*="/friends/"]');

            if (!friendsIcon && friendsLink && !followersLink) {

                let i = document.createElement('i');
                i.style.display = "inline-block";
                i.style.position = "relative";
                i.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAbCAYAAAAdx42aAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTEwVDAwOjIzOjQxKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0xNlQyMjoyMjoxOCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0xNlQyMjoyMjoxOCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplYTU4OTkzMy03ZmMxLTVlNDItYWVkYi1jMWQ0OWYxMTRmNTQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkY2NlY2ZmOC05ZTA5LTZlNDEtYTUzZS1lMjAxYjgzNzg0NDYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MjhmZTJjNS1kMjgxLTA3NGItOWM4OS1iZTEwNWI3ZjM2N2YiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQyOGZlMmM1LWQyODEtMDc0Yi05Yzg5LWJlMTA1YjdmMzY3ZiIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0xMFQwMDoyMzo0MSswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplYTU4OTkzMy03ZmMxLTVlNDItYWVkYi1jMWQ0OWYxMTRmNTQiIHN0RXZ0OndoZW49IjIwMjUtMDMtMTZUMjI6MjI6MTgrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5HG9ooAAACtElEQVRIx+2WvU9TURjGG8PsYIwxDsTJgcE4GGIcHBwcnByMYfBPMI1xMuwkDfUrSvzgcgGRehGw0pZahWBLC6UFsX6V0mA1MemgaIhxIo05Pk9p9fb0ftVYXGzyDD3v0/P80vPe816Xy+LT3RdvgY5BXVACCnDNtR0fBB2Hpr1qQtwYTopB/7JQRhcF11hrdngHgtf7x5+Lx/F8jbjGGj3NCt/drcYLI+FXdeFVsUYPvc0AaPeq8dJkbNUUgDV66DXaw9Mb64CWoA1oATrdCMARbL4ZjOZMAVijh14peCdUvDI4J8KAXM4WRfBZTlwemBNYX4NanAAcxubfAzMrpgCs0UOvBBB5EHkt3n38UqfhQIYQmhOAgzjfjUfTWVMA1uihVxe+Ayqtvv9sCJDJFQnwzQnA+WtD86bhVdFDrw6g1aPMGoZX5emdJcQuO4BzV+/aA9BDrw6gzRZAKQO0OmnCr36LI2CNHn0TYuOj+O4EoM3JMYT6xhZNAVijR2rAM+x2KwDeqvCdcALgtuqDyvm7JQDvnZG0JUCPb4EAF50A7EGX57TJl3XhXGONHgkgOzW/ZgnA+4MXk9MLaWbgYf0s4BprUvgBuwaUnoS9TuZBXjOYB9rWHMjr5wA2dPP8J3BBmd0DK4VP5ea91F/ug7N2ABdwzj/CBvOAa6zRI/0Lp6CEL5ipu4wYjn9uE/UodNIu/BAesfTQxAvTJmSNHnoNBtEYIGoAeGxYV2ynIKRi43WrcAmC7wWqfioi6JY6vlQDcFtLEaDLLHg/pHCzm/dTwj/11jb814UEL39TAVG4F4LSIXS7HmD0yRsCPDUE6PElPzQabAZy/V6yJIdLEBzJ7TLAHwfL4l5Wj2A0VeAjTJAItG/bAariO0NlLnT+E4Dfl1JM/Acoj142xt9Q5VwbUegne09sfwVDLloAAAAASUVORK5CYII=)";
                i.style.backgroundRepeat = "no-repeat";
                i.style.height = "32px";
                i.style.width = "32px";
                i.style.marginTop = "21px";

                i.className = "ProfileFriendsIcon";

                document.querySelectorAll('.TabContainer')[1]?.append(i);

            } else if (!followersIcon && friendsLink && followersLink) {

                let i = document.createElement('i');
                i.style.display = "inline-block";
                i.style.position = "relative";
                i.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAABJCAIAAAC8Uu8cAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTA5LTE5VDIyOjQ1OjIzKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wOS0yNFQwMjo0Nzo1MSswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wOS0yNFQwMjo0Nzo1MSswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MjRmN2ZlNC05N2MwLWM1NDgtOTFmNC0wZDk0ZjM2NGRkNGIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmNDg5YjZmMC1iMTg3LWZjNGYtYjI1Mi1lZDNmYmFlMTI1ZmEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozNDdhOTg3ZC02ZTIyLTU4NDMtYWZmMy0wZmM5NWVhZmRmNmUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0N2E5ODdkLTZlMjItNTg0My1hZmYzLTBmYzk1ZWFmZGY2ZSIgc3RFdnQ6d2hlbj0iMjAyNS0wOS0xOVQyMjo0NToyMyswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MjRmN2ZlNC05N2MwLWM1NDgtOTFmNC0wZDk0ZjM2NGRkNGIiIHN0RXZ0OndoZW49IjIwMjUtMDktMjRUMDI6NDc6NTErMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4IFr8OAAAEmUlEQVR42u2c3XbaQAyEef8nLAklYH5CbGNCQu/7QZOTnF60Gu1qbQzn7LWxx9JopJGZ/JjX95PrTO4Q3NEcPJrt4Vf503Sn9e71YdHc0cx2Xtr3p3U3KjTr7tRcTl+YrnfHaw/SLzQfl+2MU7Xz1Z5IWWy65fZAGm7rt13zXhdBmSCdr7qRV6HpUwPWP6v9Bd8j4IaG8Or5lV+8lZrOoxLFBC/IEk0RgD43b7y/m1NID08NzAAhZIe13p+48o3qzQus3bY+ZiQBLrXYHG5avUMC1XPOUIVGb70XQutQsnaZMIWgr6IuxXaWpD+YZolTOGT4gJbo04lTcj9dsVLoBy7vy0094FPia9yAlp4h0WUlJj692WBTvoeJHMFFVRklh/Y236SVSmFS3scdzb+ZlJZ/TDq059k7Eiol6wnwgaI5q84TucdlC68VZqVqe3C3noPq5b/QbD6nxdAZZZfSSdSgE6nCoPwQjC9R5mvwudXhaCark3HB90hjQwgH3QpR5gMUETqQEi/7QjwwpYOYjYAVQOu9B9BqGBXJ77IBK0FBhuYlAV6SA9CBEGgGzxISoIxkJK9zhOopPwQCzeYAE1BnTDPFqY9De5f0mf10AiSXBuQ6jhvo1/IM2U5AXWWpUQ4duiPf+6vvUbse5ClYpN/f5uV4RfU9dnOGIE00cgk0tZfnRc56co/D95DSjVxIQ61INBqj3eoCi2Va1i82h6uQn+V25BLpTHVB6Cz6RBNxQ1aGrsmtd35A4V+1RyofnpPvBgPn8XNN7mOBq828wJUisFUFWj48J8YFLhIt19JhSoQiEoYcnsLs/WN9o3nvkUPV+g76g3YyppftLZIoEVD3uhahrWnPqh0umt+d8ZQ1I7eIIUUkzik5Ckly2YhT2kd3mXLP0CAKoX3oTsUmdRk8S1LJTaa+pkUNz2JLoHkc4BQj19cmSeHJy74+P92X9b4hBbrY/lvFalHm7QSfkevLdykbyozp8u96UOsdgDq+ZZO0J/KjgEscsjkD66uA+p5Wkr0Fkj1qD0mqEu5yJE3qCiR74FaXakK86JaOJJUKDEEC0TybEGKz5BCG9rkn5BP9fVzsxqFqizvYUxrTRX+3/YUmtMWd/az2efuwlUigqiEuJXvKMNDpZHBz2/oNKZ7F+eNppc8GHNrTPvSMbor+5QuRpFSSdGEhJaOD3ZbmJYboCcj/XTYej2xNWaCYiuVIrUWwk52dQ6fxVs+SHEkJUik81YH5mTrNBtxye+gfzT9p4n6xhLadPRs9H+3UGTo81vz0FNdf6o5UKWO/eKiGl7cTyClfrZ8pMzRVyoC+/f7jCpFn1wMO9c1j7CN6VcrA6UPY+XJuzvgmCFWYlLFr+NAVJSeavjccJ2WmymJi3Bdw/q0uR5dGZbdLGfWZ7eOPOJHkR9PXV9jnu+pHqXZjI27QmbRx6EgZ+xBEbdjtIilOciahSRev/p69p1Y7IvuVHbddAk3HtHy+6oJ0mL15jVv1SkLTUdntRqP6rYpdwMfN5VI3tRE9QR2RWuXGgKbaUIOm/eISmuhTu18yzn+iGNm5o5nz/AbDVO2q+AE83gAAAABJRU5ErkJggg==)";
                i.style.backgroundRepeat = "no-repeat";
                i.style.height = "74px";
                i.style.width = "100%";

                i.className = "ProfileFollowersIcon";

                document.querySelectorAll('.TabContainer')[1]?.append(i);

            }

            if(followers || followersIcon) {

                setTimeout(() => {

                    $('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1cy8zhl.xyamay9 span [href*="/followers/"]').clone().appendTo('.ProfileFollowersIcon');

                    let followersElement = document.querySelector('.ProfileFollowersIcon a');

                    if (followersElement) {

                        followersElement.textContent = followersElement.textContent.replace(/\s*followers/i, '').trim();

                    }

                }, 1000);

            }

            if(friends || friendsIcon) {

                setTimeout(() => {

                    $('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1cy8zhl.xyamay9 span [href*="/friends/"]').clone().appendTo('.FriendsButton');

                    let friendsElement = document.querySelector('.FriendsButton a');

                    if (friendsElement) {

                        friendsElement.textContent = friendsElement.textContent.replace(/\s*friends/i, '').trim();

                    }

                }, 1000);

            }

            const photosLink = document.querySelector('[href*="/photos"]');
            const icon2 = document.querySelector('.TabsWrapper .ProfilePhotosIcon');

            if(!icon2 && photosLink) {

                let i = document.createElement('i');
                i.style.display = "inline-block";
                i.style.position = "relative";
                i.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTE2VDIyOjA3OjU1KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0xNlQyMjowODo1NSswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0xNlQyMjowODo1NSswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmYjhjNmE1Yi1mNmNkLWVkNGItYTUyMC05MjFlM2ZkOGVjNjkiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplMzJkNzkzZC1iMmRkLTliNGQtOGFjYi1hMjBlM2M3ODUyMDciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4M2E2YjUzMC05YmM4LTJmNDAtOTU3My02NDMwNDU2Y2I0YmEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjgzYTZiNTMwLTliYzgtMmY0MC05NTczLTY0MzA0NTZjYjRiYSIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0xNlQyMjowNzo1NSswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmYjhjNmE1Yi1mNmNkLWVkNGItYTUyMC05MjFlM2ZkOGVjNjkiIHN0RXZ0OndoZW49IjIwMjUtMDMtMTZUMjI6MDg6NTUrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7q/NDJAAABhklEQVRIic2W2U7CQBSGeQaf1ZfwCbjxwrjhEolVKREiBAGRxVIKLRREcGHxETQmx/lHm9Q6Ni12kk7yJ01n+eYsc2YS6rWdZCKJSiZEDZ1v7x/ShPXjC74zZ5EpNNiwF//WyuDi7ZiUK2tlpfMmNbovXFvpljjhRGBMlh732II7g3lg6f05adbsz/7Q4P741VeYd1kZ0oFqUKY0EI6JHFxpTWn/XKfdszalMh1KXehUqI3lgnuj5ReM6TBrcMHqPbYJ3TMvUnB3uOCWAuYG41+rN5MJXorBSpuvJQ2M8V4wtH2q0Y32KBmsiME1/UluVmMsMtmBOolm3ofMagi1Nii43JzQDrPQAcP1+eoo3HFyhOIeFOyNsyi+UsAFdpMhzo7FOMPZsh0I/OvNtXncDASuG88/4sqP03dBqTKrLT8w2vqGuuaW2wteMKpVmZXJk1yPx9YNdcPh8iP2Xaw/8IQVgv0eB+7bpdSY8AzGoqjPAPgJY7E5uD/HEi4UWNp9HDew9Ef+J+JxQnLLXgBOAAAAAElFTkSuQmCC)";
                i.style.backgroundRepeat = "no-repeat";
                i.style.height = "32px";
                i.style.width = "30px";
                i.style.marginTop = "21px";

                i.className = "ProfilePhotosIcon";

                document.querySelector('.TabContainer:first-child').append(i);

                setTimeout(() => {

                }, 1000);

            }

            const icon3 = document.querySelector('.TabsWrapper .ProfileVideosIcon');
            let i = document.createElement('i');

            if(!icon3 && friendsLink) {

                i.style.display = "inline-block";
                i.style.position = "relative";
                i.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTA5LTE5VDA3OjEyOjMzKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wOS0xOVQxODo1MzoyMyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wOS0xOVQxODo1MzoyMyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplOWY0MmU1NC0xMzE5LTA2NGUtOWIyNS1mMzcyZGZlYjJmY2MiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDozMTA0ODYzYS0wMDdlLTU2NGYtOWE5Ni04OTk4YWY4N2I4Y2YiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphMGQ0MTQ5My00YTU5LTdlNDMtODVjYS0yN2Y3N2QzOTE2OGYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmEwZDQxNDkzLTRhNTktN2U0My04NWNhLTI3Zjc3ZDM5MTY4ZiIgc3RFdnQ6d2hlbj0iMjAyNS0wOS0xOVQwNzoxMjozMyswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplOWY0MmU1NC0xMzE5LTA2NGUtOWIyNS1mMzcyZGZlYjJmY2MiIHN0RXZ0OndoZW49IjIwMjUtMDktMTlUMTg6NTM6MjMrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7BKWinAAABGklEQVRIx+WWzQqCQBCAe4aetQcIOnXon/BoP1CXJAoqhPBQaRRFh4KIiCDIc9dCmRrJsNI1V9eCFj5WHHc+xl2WiRRrY+4GMISL2A0Mni8aMzD/74rb0jowPIt7w41vqMW8MINsRaYmXRpBQ1waJIqS/YGzE+Ni5vv+s2JR3gaGZ/FguvcNtfhwPAEOnEMVa7puiHEOt2L1XrEacsVf22OvCOIKuPrEAJ+ZiyVlB9XWAjIlGXIVxSBTloFvzv2JXyuxld5E+aryRIofkcUI3rWvYqdK8B3GSFJXsQle7lYxKakpJ0mpxJ3BxjUpxkhxJ/FbzxUv9B8f4aFwS/oJb2IcsWQ3asX6F4KQOopJzUEQUirx33SezJv8K3PmxtLejlyJAAAAAElFTkSuQmCC)";
                i.style.backgroundRepeat = "no-repeat";
                i.style.height = "32px";
                i.style.width = "30px";
                i.style.marginTop = "21px";

                i.className = "ProfileVideosIcon";

                document.querySelectorAll('.TabContainer')[2]?.append(i);

            } else if (!icon3 && !friendsLink) {

                document.querySelectorAll('.TabContainer')[1]?.append(i);

            }

            if (document.querySelector('.MoreButtonContainer')
                && !document.querySelector('.MoreButtonContainer .SeeMoreIcon')) {

                let i = document.createElement('i');
                i.textContent = "6";
                i.style.fontWeight = "bold";
                i.style.fontStyle = "normal";
                i.style.height = "14px";
                i.style.display = "block";
                i.style.position = "relative";
                i.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAGBAMAAAD9IJlFAAAAGFBMVEX////8/PxKYqB7jblwg7NLY6Bofa9KY6Bz1hlAAAAAAnRSTlMAAHaTzTgAAAAfSURBVAgdY2AAgdAiJQUGMWMzAQZBZ0cgISIoABYHACvPAoQH0yMlAAAAAElFTkSuQmCC)";
                i.style.backgroundRepeat = "no-repeat";
                i.style.backgroundPosition = "100% 4px";
                i.style.color = "#3b5998";
                i.style.paddingRight = "10px";
                i.style.right = "9px";
                i.style.top = "30px";

                i.className = "SeeMoreIcon";

                document.querySelector('.MoreButtonContainer').append(i);

            }

        }

        if(document.querySelector('.x78zum5.xdt5ytf.x12upk82.xod5an3 img')
           && document.querySelector('.TabContainer .ProfileFriendsIcon')
           && !document.querySelector('.TabContainer .ClonedFriends')) {

            $('.x78zum5.xdt5ytf.x12upk82.xod5an3 img').clone().removeAttr('class').addClass('ClonedFriends').appendTo($('.TabContainer').eq(1));

            let friendsIcon = document.querySelector('.TabContainer .ProfileFriendsIcon');

            friendsIcon.style.setProperty('display', 'none', 'important');
            friendsIcon.style.setProperty('height', '0px', 'important');
            friendsIcon.style.setProperty('margin', '0px', 'important');

        }

        if(document.querySelector('.x78zum5.x12nagc.x1n2onr6.x1s6qhgt img')
           && document.querySelector('.TabContainer .ProfilePhotosIcon')
           && !document.querySelector('.TabContainer .ClonedPhoto')) {

            $('.x78zum5.x12nagc.x1n2onr6.x1s6qhgt img').first().clone().removeAttr('class').addClass('ClonedPhoto').appendTo($('.TabContainer').eq(0));

            let photosIcon = document.querySelector('.TabContainer .ProfilePhotosIcon');

            photosIcon.style.setProperty('display', 'none', 'important');
            photosIcon.style.setProperty('height', '0px', 'important');
            photosIcon.style.setProperty('margin', '0px', 'important');

        }

    }

    function modifyGroupLayout() {

        if(document.querySelector('.x78zum5.xdt5ytf.x1iyjqo2')
           && !document.querySelector('.ProfileButtonsWrapper')
           && !document.querySelector('[aria-label="Event Permalink"]')) {

            $('.x78zum5.xdt5ytf.x1n2onr6.xat3117.xxzkxad .x9f619.x1ja2u2z.x78zum5.x1n2onr6.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1ve1bff.xvo6coq.x2lah0s [aria-orientation="horizontal"]').detach().prependTo('.x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.x13a6bvl.x6s0dn4.xozqiw3.x1q0g3np.x1lxpwgx.x165d6jo.x4vbgl9.x1rdy4ex');

            $('.x78zum5.xdt5ytf.x1n2onr6.xat3117.xxzkxad .x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.x1qughib.x1qjc9v5.xozqiw3.x1q0g3np.x1lxpwgx.x165d6jo.x4vbgl9.x1rdy4ex .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xeuugli.x11lfxj5.x135b78x').detach().appendTo('.x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.x13a6bvl.x6s0dn4.xozqiw3.x1q0g3np.x1lxpwgx.x165d6jo.x4vbgl9.x1rdy4ex');
        }

        if(!document.querySelector('.GroupAboutSectionWrapper')
           && document.querySelector('.x78zum5.xdt5ytf.x1iyjqo2')
           && document.querySelector('.x78zum5.xdt5ytf.x1n2onr6.xat3117.xxzkxad .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xf7dkkf.xv54qhq.xqdwrps.x16i7wwg.x1y5dvz6')
           && !document.querySelector('.ProfileButtonsWrapper')
           && !document.querySelector('[aria-label="Event Permalink"]')) {

            setTimeout(() => {

                let div = document.createElement('div');
                let style = document.createElement('style');
                div.className = "GroupAboutSectionWrapper";
                document.querySelector('.x78zum5.xdt5ytf.x1n2onr6.xat3117.xxzkxad .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xf7dkkf.xv54qhq.xqdwrps.x16i7wwg.x1y5dvz6').append(div);
                style.innerHTML = `
                    .GroupAboutSectionWrapper {
                        display: block;
                        position: relative;
                        margin: 0px -16px 10px;
                        padding: 20px 9px 0px;
                        width: 783px;

                    }

                `;

                document.head.appendChild(style);

                let div2 = document.createElement('div');
                let style2 = document.createElement('style');
                div2.className = "GroupAboutSectionTextWrapper";
                document.querySelector('.GroupAboutSectionWrapper').append(div2);
                style2.innerHTML = `
                    .GroupAboutSectionTextWrapper {
                        display: block;
                        position: relative;
                        width: 511px;

                    }

                `;

                document.head.appendChild(style2);

                $('.x78zum5.xdt5ytf.x1n2onr6.xat3117.xxzkxad .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xeuugli.x14vy60q.xyiysdx.x1120s5i.x1nn3v0j:first').detach().prependTo('.GroupAboutSectionWrapper');

                $('.x7wzq59 .html-div.xdj266r.x14z9mp.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1yztbdb.x2ayxl8:first .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5').detach().appendTo('.GroupAboutSectionTextWrapper');

            }, 1000);

        }

    }

    function modifyEventsLayout() {

        if(document.querySelector('[aria-label="Event Permalink"] .x9f619.x1ja2u2z.x2lah0s.x1n2onr6.x1qjc9v5.x78zum5.xl56j7k.x15zctf7.x1a02dak.x9otpla.x1w5wx5t.x1wsgfga.x1qfufaz')
           && !document.querySelector('.EventsPhotoSectionContainer')) {

            setTimeout(() => {

                let div = document.createElement('div');
                let style = document.createElement('style');
                div.className = "EventsPhotoSectionContainer";
                document.querySelector('[aria-label="Event Permalink"] .x9f619.x1ja2u2z.x2lah0s.x1n2onr6.x1qjc9v5.x78zum5.xl56j7k.x15zctf7.x1a02dak.x9otpla.x1w5wx5t.x1wsgfga.x1qfufaz').append(div);
                style.innerHTML = `
                    .EventsPhotoSectionContainer {
                        display: block;
                        float: left;
                        width: 179px;
                        padding: 30px 0px 0px 2px;
                        margin-left: 22px;
                        border-right: 1px solid rgb(204, 204, 204);

                    }

                `;

                document.head.appendChild(style);

                let div2 = document.createElement('div');
                let style2 = document.createElement('style');
                div2.className = "EventsGuestsSectionContainer";
                document.querySelector('.EventsPhotoSectionContainer').append(div2);
                style2.innerHTML = `
                    .EventsGuestsSectionContainer {
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        overflow: hidden;
                        width: 179px;
                        height: 132px;
                        margin-top: 10px;
                        border-right: 1px solid rgb(204, 204, 204);

                    }

                `;

                document.head.appendChild(style2);

                let div3 = document.createElement('div');
                let style3 = document.createElement('style');
                div3.className = "EventsGuestsGoing";
                document.querySelector('.EventsGuestsSectionContainer').append(div3);
                style3.innerHTML = `
                .EventsGuestsGoing {
                    display: flex;
                    justify-content: flex-start;
                    width: 179px;
                    height: 56px;
                    margin-top: 10px;
                    margin-bottom: 20px;

                }

                `;

                document.head.appendChild(style3);

                let div4 = document.createElement('div');
                let style4 = document.createElement('style');
                div4.className = "EventsGuestsInterested";
                document.querySelector('.EventsGuestsSectionContainer').append(div4);
                style4.innerHTML = `
                .EventsGuestsInterested {
                    display: flex;
                    justify-content: flex-start;
                    width: 179px;
                    height: 56px;
                    margin-top: 10px;
                    margin-bottom: 20px;

                }

                `;

                document.head.appendChild(style4);

                if(div3 && div4) {

                    const numberOfElements = 2;
                    const className = 'EventsGuestsHeader';
                    const targets = [

                        document.querySelector('.EventsGuestsGoing'),
                        document.querySelector('.EventsGuestsInterested')

                    ];

                    targets.forEach(target => {

                        if(target) {

                            const div = document.createElement('div');
                            div.className = className;
                            div.style.display = "flex";
                            div.style.flexDirection = "row";
                            div.style.height = "14px";
                            div.style.width = "179px";

                            target.appendChild(div);

                        }

                    });

                }

                if(document.querySelector('.html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x78zum5.xng8ra.xh8yej3')) {

                    let btn = document.createElement('button');
                    btn.innerText = "Events";
                    btn.style.display = "block";
                    btn.style.position = "relative";
                    btn.style.border = "1px solid #ced0d4";
                    btn.style.background = "transparent";
                    btn.style.backgroundImage = "url(data:image/png;base64,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)";
                    btn.style.height = "19px";
                    btn.style.padding = "2px 6px";
                    btn.style.boxSizing = "content-box";
                    btn.style.borderRadius = "0px";
                    btn.style.cursor = "pointer";
                    btn.style.fontSize = "11px";
                    btn.style.fontWeight = "bold";
                    btn.style.color = "#333333";

                    btn.className = "EventsButton";

                    document.querySelector('.html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x78zum5.xng8ra.xh8yej3').prepend(btn);

                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        let newUrl = "https://www.facebook.com/events/";
                        window.history.pushState({}, '', newUrl);

                        window.dispatchEvent(new PopStateEvent('popstate'));

                    });

                    btn.addEventListener('mouseover', () => {
                        btn.style.backgroundColor = 'rgb(233, 235, 238)';

                    });

                    btn.addEventListener('mouseout', () => {
                        btn.style.backgroundColor = 'transparent';

                    });

                }

                $('[aria-label="Event Permalink"] .x6ikm8r.x10wlt62.x1n2onr6.xh8yej3.xric181.xde0f50.x15x8krk.x1qq2va3.x1qpcq7s').detach().prependTo('[aria-label="Event Permalink"] .EventsPhotoSectionContainer')

                $('[aria-label="Event Permalink"] .x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.x1qughib.xuk3077.xozqiw3.x1q0g3np.xpdmqnj.x1g0dm76.xyamay9.x1w5wx5t.x1qfufaz.x1wsgfga.x9otpla').detach().prependTo('[aria-label="Event Permalink"] .x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.x19h7ccj.xu9j1y6.x7ep2pv');

                $('[aria-label="Event Permalink"] .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x78zum5.xng8ra.xh8yej3').detach().prependTo('[aria-label="Event Permalink"] .x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.xnp8db0.x1d1medc.x7ep2pv.x1xzczws');

                $('[aria-label="Event Permalink"] .x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.x1qughib.x1qjc9v5.xozqiw3.x1q0g3np.xexx8yu :nth-child(1) .x6s0dn4.x78zum5.xdt5ytf.x1l90r2v.xf159sx.xmzvs34.xyamay9:first').detach().appendTo('[aria-label="Event Permalink"] .EventsGuestsGoing .EventsGuestsHeader');

                $('[aria-label="Event Permalink"] .x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.x1qughib.x1qjc9v5.xozqiw3.x1q0g3np.xexx8yu :nth-child(2) .x6s0dn4.x78zum5.xdt5ytf.x1l90r2v.xf159sx.xmzvs34.xyamay9').detach().appendTo('[aria-label="Event Permalink"] .EventsGuestsInterested .EventsGuestsHeader');

                $('[aria-label="Event Permalink"] [role="listitem"]:last').detach().appendTo('[aria-label="Event Permalink"] .x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.x1qughib.xuk3077.xozqiw3.x1q0g3np.xpdmqnj.x1g0dm76.xyamay9.x1w5wx5t.x1qfufaz.x1wsgfga.x9otpla .x1e56ztr.x1xmf6yo:last');

                $('[aria-label="Event Permalink"] .x1i10hfl.xjbqb8w.x1ejq31n.x18oe1m7.x1sy0etr.xstzfhl.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x1ypdohk.xt0psk2.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x16tdsg8.x1hl2dhg.xggy1nq.x1fmog5m.xu25z0z.x140muxe.xo1y3bh.x1n2onr6.x87ps6o.x1lku1pv.x1a2a7pz .html-div.x14z9mp.x1lziwak.xyri2b.x1c1uobl.x78zum5.x1q0g3np.xhsvlbd.x16pr9af.x6ikm8r.x889kno.x1a8lsjc.x1n2onr6').detach().appendTo('[aria-label="Event Permalink"] .EventsGuestsGoing');

                const numberOfElements = 2;
                const className = 'EventsGuestsLine';
                const targets = [

                    document.querySelector('.EventsGuestsGoing .EventsGuestsHeader'),
                    document.querySelector('.EventsGuestsInterested .EventsGuestsHeader')

                ];

                targets.forEach(target => {

                    if(target) {

                        const div = document.createElement('div');
                        div.className = className;
                        div.style.height = "1px";
                        div.style.width = "100%";
                        div.style.minWidth = "118px";
                        div.style.background = "rgb(217, 217, 217)";
                        div.style.marginBlockEnd = "3px";
                        div.style.marginBlockStart = "3px";

                        target.appendChild(div);

                    }

                });

            }, 500);

        }

    }

    let isProcessing = false;

    function processMutations() {

        if (isProcessing) return;
        isProcessing = true;

        createThirdColumnWrapper();
        createSidebarWrapper();
        centerBlueBar();
        getUserName();
        createBirthdaysContainer();
        createStoriesContainerAndMakeAdjustments();
        createSponsoredContainer();
        makeFurtherAdjustments();
        modifyProfileButtons();
        getId();
        createProfileButtons()
        createProfileIcons();
        moveListIntoAboutContainer();
        modifyGroupLayout();
        modifyEventsLayout();

        setTimeout(() => {
            isProcessing = false;

        }, 1000);

    }

    const observer = new MutationObserver(() => {
        if (!isProcessing) processMutations();

    });

    const config = { childList: true, subtree: true };
    const page = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z');

    processMutations();
    observer.observe(page, config);

    GM_addStyle ( `

    div [class="AboutSectionWrapper"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm x6u5lvz x2b8uid"],
        div [class="AboutSectionWrapper"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h"],
            div [class="AboutSectionWrapper"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x6prxxf xvq8zen xo1l8bm xzsf02u"],
                div [class="AboutSectionWrapper"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u"],
                    div [class="AboutSectionWrapper"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x676frb x1nxh6w3 x1sibtaa xo1l8bm xi81zsa x1yc453h"],
                        div [class="AboutSectionWrapper"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm x1fey0fg x1yc453h"],
                            div [class="AboutSectionWrapper"] a[class="x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj xzsf02u x1s688f"],
                                div [class="AboutSectionWrapper"] a[class="x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj x1fey0fg x1s688f"] {
                                    font-size: 11px !important;
                                    font-weight: normal;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                    line-height: 22px;

                                }

    div [class="AboutSectionWrapper"] img[src="https://static.xx.fbcdn.net/rsrc.php/v4/yS/r/jV4o8nAgIEh.png"] {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAICAYAAAAvOAWIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA3VDAyOjIwOjIwKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wN1QwMjoyNToyMyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wN1QwMjoyNToyMyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiM2I4ZWMxMi1kYTExLWZlNDQtODc5OS0yNGIyMzYyNjVkNDkiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmMDU0NWQ1OC0yNzA5LTJlNDQtOTFjYS1jNGM5YjdjNzJkMDMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplYzExNjYwOS0zMGU4LTVjNGMtOGI0MC1kMWFkN2IzYzI0ZTciPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmVjMTE2NjA5LTMwZTgtNWM0Yy04YjQwLWQxYWQ3YjNjMjRlNyIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wN1QwMjoyMDoyMCswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiM2I4ZWMxMi1kYTExLWZlNDQtODc5OS0yNGIyMzYyNjVkNDkiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDdUMDI6MjU6MjMrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Yvb0dAAAAWUlEQVQYGWNgAILy8nIeIL4MxP+xYJA4BwMMADkbkRVcu3YNXcNqmMJWHCai4woGIhWCMcO6dev+g2zYunXrf1wY7l6YYrwm4lA8GYiNoHwDKB9FcSMDkQAAuPma8bMlSiUAAAAASUVORK5CYII=);
        background-repeat: repeat-x;
        width: 0px!important;
        height: 0px!important;
        padding: 6px;

    }

    div [class="AboutSectionWrapper"] img[src="https://static.xx.fbcdn.net/rsrc.php/v4/y5/r/VMZOiSIJIwn.png"] {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAJCAYAAAAPU20uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA2VDIxOjAzOjM1KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wN1QwMjoyMTowMSswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wN1QwMjoyMTowMSswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiMWU2YmVhMi1jNzkxLWU2NDQtODBiNi0wN2FmOGZiYzUzNjIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5NzA0OTY2ZC0wY2ExLTE4NGQtYTVlMC02ODE3MzdjMTdjYzciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMjk1MTNhYi03MDRkLTgyNDMtODA0ZC1lNmQxMTQwNDNhMzgiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmYyOTUxM2FiLTcwNGQtODI0My04MDRkLWU2ZDExNDA0M2EzOCIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wNlQyMTowMzozNSswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMWU2YmVhMi1jNzkxLWU2NDQtODBiNi0wN2FmOGZiYzUzNjIiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDdUMDI6MjE6MDErMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5sm1XbAAAAPElEQVQYGWNgwALKy8v/M+ACIEkYRhaciS6JogjIOIukwAuZBgnuhaneunUrpgnIqvEp+E+Rgu14FGwHAAUShfrG2JgUAAAAAElFTkSuQmCC);
        background-repeat: no-repeat;
        width: 0px!important;
        height: 0px!important;
        padding: 6px;

    }

    div [class="AboutSectionWrapper"] img[src="https://static.xx.fbcdn.net/rsrc.php/v4/yc/r/-e1Al38ZrZL.png"] {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA3VDAyOjIwOjIwKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wN1QwMjoyNzoyMyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wN1QwMjoyNzoyMyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphYTY4YzBmNS05MTZiLTcwNDktOGFlOS1iYzY2MzNlZGM5OTciIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxM2Q3YmRhYi04NDRjLTA2NGEtOTQ0My1mZDFjODY0ODA1YjMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5OWNkNWYyZS02YjQyLTVjNGItYjllMS03ZTEzMmUxNThmNWMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjk5Y2Q1ZjJlLTZiNDItNWM0Yi1iOWUxLTdlMTMyZTE1OGY1YyIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wN1QwMjoyMDoyMCswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphYTY4YzBmNS05MTZiLTcwNDktOGFlOS1iYzY2MzNlZGM5OTciIHN0RXZ0OndoZW49IjIwMjUtMDMtMDdUMDI6Mjc6MjMrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz41R9RFAAAAOklEQVQYlWNgQAPl5eX/0cVgEjNhCmAYm6KzyAqwKsSmAEUhPgVEK8RmnRdMAp+i//gUbcehaDuIDQAf1Xp00J8xcAAAAABJRU5ErkJggg==);
                              background-repeat: no-repeat;
                              width: 0px!important;
                              height: 0px!important;
                              padding: 6px;

                              }

    div [class="AboutSectionWrapper"] img[src="https://static.xx.fbcdn.net/rsrc.php/v4/yq/r/S0aTxIHuoYO.png"] {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA3VDAyOjIwOjIwKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wN1QwMjozMToxNCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wN1QwMjozMToxNCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNjVkODMxNS02MTBjLTU4NDMtYjE0Mi1lOWMxNzc3ZWY0NzUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplYWZkZjA1NC0xNjc1LWNhNDAtOGNhNC1mYzBiMTVkYWM1ZjciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3NGQzNGZlYi01NzYyLWM2NGItYjIyOC02YmY5YmE4MDIxYjYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjc0ZDM0ZmViLTU3NjItYzY0Yi1iMjI4LTZiZjliYTgwMjFiNiIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wN1QwMjoyMDoyMCswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNjVkODMxNS02MTBjLTU4NDMtYjE0Mi1lOWMxNzc3ZWY0NzUiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDdUMDI6MzE6MTQrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6qWGV3AAAAX0lEQVQYlWMoLy+XAuKNQPwTSpuh8aUYgMRuIP6PBx9kgOrAp+gvSNFbAoqegxStJqBoMQPUobis/AvEBgwgAGSk4VBUxIAMgAJJQPwRKvkZxGfABoASQkBcBcRyyOIAa5qZTVFzaQAAAAAASUVORK5CYII=);
        background-repeat: no-repeat;
        width: 0px!important;
        height: 0px!important;
        padding: 6px;

    }

    div [class="AboutSectionWrapper"] img[src="https://static.xx.fbcdn.net/rsrc.php/v4/yp/r/Q9Qu4uLgzdm.png"] {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAICAYAAAArzdW1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA3VDAyOjIwOjIwKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wN1QwMjozNjowNyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wN1QwMjozNjowNyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0YmE3MjhlOC0wMTUzLWY2NGMtYTc1Ni01NjlhNjZlYjU1NTIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMzc3Yzc3NS0yZDFmLTY3NDEtOGY1Yi00NjU0MjhmNDUwMWQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4OWE2ODI4Yi1jZTgwLTk3NDMtOWIwMC0xM2ZkYWFmZjMzOWMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg5YTY4MjhiLWNlODAtOTc0My05YjAwLTEzZmRhYWZmMzM5YyIgc3RFdnQ6d2hlbj0iMjAyNS0wMy0wN1QwMjoyMDoyMCswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0YmE3MjhlOC0wMTUzLWY2NGMtYTc1Ni01NjlhNjZlYjU1NTIiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDdUMDI6MzY6MDcrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ka5O3AAAAMUlEQVQYGWNggILy8vK9QPwfCe9lQAcgCZx8LCb8xzARxlm4cCGKJDJ/ABRtJ+Dw7QD4HZQtQ4MafAAAAABJRU5ErkJggg==);
        background-repeat: no-repeat;
        width: 0px!important;
        height: 0px!important;
        padding: 6px;

    }

    div [class="AboutSectionWrapper"] img[class="x1b0d499 xuo83w3"] {
        height: 9px;
        width: 9px;
    }

    div [class="AboutSectionWrapper"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xamitd3 x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] {
        padding: 1px;
        bottom: 2px;

    }

    div [class="AboutSectionWrapper"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1nhvcw1 x1qjc9v5 xozqiw3 x1q0g3np xyri2b x1c1uobl x18d9i69 xyamay9 x1ws5yxj xw01apr x4cne27 xifccgj"] {
        padding: 0px;

    }

    div [class="AboutSectionWrapper"] ul div:nth-child(5),
        div [class="AboutSectionWrapper"] ul div:nth-child(6),
            div [class="AboutSectionWrapper"] ul div:nth-child(7),
                div [class="AboutSectionWrapper"] ul div:nth-child(8),
                    div [class="AboutSectionWrapper"] ul div:nth-child(9),
                        div [class="AboutSectionWrapper"] ul div:nth-child(10),
                            div [class="AboutSectionWrapper"] ul div:nth-child(11),
                                div [class="AboutSectionWrapper"] ul div:nth-child(12) {
                                    display: none;

                                }

    div [class="AboutSectionWrapper"] strong[class="html-strong xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1hl2dhg x16tdsg8 x1vvkbs x1s688f"] {
        font-weight: normal;

    }

    div [class="SidebarWrapper"] svg[class="x3ajldb"]:has([style^="height: 36px"]),
        div [class="SidebarWrapper"] svg[aria-hidden="true"],
            div [class="SidebarWrapper"] image[style*="height: 36px"],
                div [class="SidebarWrapper"] image[preserveAspectRatio*="xMidYMid slice"] {
                    height: 16px!important;
                    width: 16px!important;

                }

    div [class="SidebarWrapper"] ul a[class="x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1lliihq"] {
        width: 177px;

    }

    div [class="SidebarWrapper"] div ]class="x1n2onr6 x1ja2u2z x9f619 x78zum5 xdt5ytf x2lah0s x193iq5w xjkvuk6 x1cnzs8"] {
        padding-bottom: 0px;

    }

    div [class="SidebarWrapper"] div [class="x1iyjqo2"] div [class="xwib8y2"] {
        padding-bottom: 4px;

    }

    div [class="SidebarWrapper"] div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xedcshv x1t2pt76"] {
        width: 194px;
        position: relative;
        left: 10px;

    }

    div [class="x193iq5w xvue9z x17zi3g0 x1ceravr x1v0nzow"] {
        width: 511px!important;
        padding: 0px 25px 20px 18px;

    }

    div [role="main"] div [aria-label="Stories"] {
        display: none;

    }

    div [class="WrapperForAds"] span {
        font-weight: bold;
        font-size: 11px!important;
        color: rgb(59, 89, 152);
        overflow: visible;

    }

    div [class="SponsoredContainer"] div [class="x1kyqaxf"] {
        font-size: 11px;

    }

    div [class="SponsoredContainer"] img,
        div [class="SponsoredContainer"] div [class="x1obq294 x5a5i1n xde0f50 x15x8krk x6ikm8r x10wlt62 x1n2onr6"] {
            max-width: 97px;
            width: 97px;
            height: 75px;
            border-radius: 0px;
            border: none;

        }

    div [class="SponsoredContainer"] div [aria-label="More"] {
        display: none;

    }

    div [class="SponsoredContainer"] div [class="x1ey2m1c xds687c x17qophe x47corl x10l6tqk x13vifvy x19991ni x1dhq9h x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1hc1fzr x1mq3mr6 x1wpzbip"] {
        display: none!important;

    }

    div [class="SponsoredContainer"] .x8du52y:hover {
        background: transparent!important;

    }

    div [class="SponsoredContainer"] div [class="html-div x78zum5 x6umtig x12wdn4z xaqea5y x1f0uuog x1i5p2am x1whfx0g xr2y4jy x1ihp6rs x1ypdohk xjb2p0i xdj266r x1xegmmw xat24cr x13fj5qh x1yc453h x1y1aw1k xf159sx xwib8y2 xmzvs34 x1164lod x8du52y"] {
        padding-right: 0px;
        padding-left: 0px;
        margin-left: 0px;
        margin-right: 0px;

    }

    div [class="SponsoredContainer"] div [class="xwib8y2 x1y1aw1k"] div:nth-child(2) div [class="x1n2onr6"] {
        margin-bottom: 8px;
        padding-right: 4px;
        padding-top: 8px;
        border-top: 1px solid rgb(233, 233, 233);
        border-bottom: 1px solid rgb(233, 233, 233);

    }

    div [class="ThirdColumnWrapper"] div[class="x2lah0s xyamay9 x1pi30zi x1l90r2v x1swvt13"] {
        padding: 0px;
        margin-top: 2px;
        margin-left: 3px;
        width: 244px;

    }

    div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="x9f619 x1n2onr6 x1ja2u2z"] {
        border-left: 1px solid rgb(204, 204, 204);

    }

    *[class*="fb-dark-mode"] div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="x9f619 x1n2onr6 x1ja2u2z"] {
        border-left: 1px solid #393939;

    }

    *[class*="fb-dark-mode"] div [class="ThirdColumnWrapper"] {
        border-right: 1px solid #393939;

    }

    div [class="x1yztbdb x1n2onr6 xh8yej3 x1ja2u2z"] div [class="x9f619 x1n2onr6 x1ja2u2z"] {
        border-left: none!important;

    }

    div [class="StoriesContainer"] div [class="StoryNamesWrapper"] span :last-child > :last-child {
        font-size: 11px;
        color: #365899;
        padding: 0px 16px;
        cursor: pointer;

    }

    div [class="StoriesContainer"] span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6 x1j85h84"]:hover {
        text-decoration: underline;

    }

    div [class="StoriesContainer"] div [class="x9f619 x1n2onr6 x1ja2u2z x6zyg47 x1xm1mqw xpn8fn3 xtct9fg xyi19xy x1ccrb07 xtf3nb5 x1pc53ja x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi xamhcws xol2nv xlxy82 x19p7ews x78zum5 x1kgmq87 xwrv7xz xmgb6t1 x8182xy x1kpxq89 xsmyaan xv9rvxn"] {
        display: none;

    }

    div [class="SponsoredContainer"] div [class="x1n2onr6"] {
        margin-left: 2px;

    }

    div [class="StoriesContainer"] img[class="xz74otr x15mokao x1ga7v0g x16uus16 xbiv7yw"],
        div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x1wpzbip xvs2etk xg3wpu6 x1jwbhkm xgg4q86 x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1gp4ovq x9p2oo0 x1h2mt7u x56jcm7 x1tz4bnf x1yqjg3l x25epmt xkkygvr"],
            div [class="StoriesContainer"] div [class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x6s0dn4 x1wpzbip xlid4zk x13tp074 x1qns1p2 xipx5yg x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x1gp4ovq xdio9jc x1h2mt7u x7g060r xsdn2ir x16rfsbj x13awxeq x16sykr7"],
                div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x1wpzbip xvs2etk xg3wpu6 x1jwbhkm xgg4q86 x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1gp4ovq x9p2oo0 x1h2mt7u x56jcm7 xsdn2ir xpkn66y x13awxeq xuxekev"] {
                    width: 26px;
                    height: 26px;
                    border-radius: 0px;

                }

    div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x1wpzbip xvs2etk xg3wpu6 x1jwbhkm xgg4q86 x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1gp4ovq x9p2oo0 x1h2mt7u x56jcm7 x1tz4bnf x1yqjg3l x25epmt xkkygvr"] {
        border: none;
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px #0866ff;

    }

    div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x1wpzbip xvs2etk xg3wpu6 x1jwbhkm xgg4q86 x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1gp4ovq x9p2oo0 x1h2mt7u x56jcm7 xsdn2ir xpkn66y x13awxeq xuxekev"] {
        border: none;
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px #84878b;

    }

    div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x1wpzbip xvs2etk xg3wpu6 x1jwbhkm xgg4q86 x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1gp4ovq x9p2oo0 x1h2mt7u x56jcm7 x1tz4bnf x1yqjg3l x25epmt xkkygvr"],
        div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x1wpzbip xvs2etk xg3wpu6 x1jwbhkm xgg4q86 x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1gp4ovq x9p2oo0 x1h2mt7u x56jcm7 xsdn2ir xpkn66y x13awxeq xuxekev"] {
            left: 6px;
            position: relative;
            cursor: pointer;

        }

    div [class="SidebarWrapper"] div [class="x9f619 x1s85apg xds687c xg01cxk xexx8yu x18d9i69 x1e558r4 x150jy0e x47corl x10l6tqk x13vifvy x1n4smgl x1d8287x x19991ni xwji4o3 x1kky2od"],
        div [class="SidebarWrapper"] div [class="x9f619 x1s85apg xds687c xexx8yu x18d9i69 x1e558r4 x150jy0e x47corl x10l6tqk x13vifvy x1n4smgl x19991ni xwji4o3 x1kky2od x1hc1fzr x1p6kkr5"] {
            display: none!important;

        }

    div [class="BirthdaysContainer"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h"] {
        font-size: 11px!important;
        color: gray;

    }

    div [class="BirthdaysContainer"] b[class="html-b xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x1s688f"],
        div [class="BirthdaysContainer"] span[class="xzsf02u x1ypdohk x1s688f"] {
            color: rgb(59, 89, 152);

        }

    div [class="x1y1aw1k"] div [class="x1n2onr6"]:nth-child(2),
        div [class="x1y1aw1k"] div [class="x1n2onr6"]:nth-child(3) {
            display: none;

        }

    a[class="x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xc5r6h4 xqeqjp1 x1phubyo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xdl72j9 x2lah0s x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak x2lwn1j xeuugli xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1fmog5m xu25z0z x140muxe xo1y3bh x1q0g3np x87ps6o x1lku1pv x1rg5ohu x1a2a7pz x1hc1fzr x1k90msu x6o7n8i xbxq160"] {
        z-index: 1;
        top: 14px;
        margin-left: 0px !important;

    }

    div [aria-label="Account Controls and Settings"], div [aria-label="Account controls and settings"] {
        z-index: 1;
        flex: 0 0 auto;
        justify-content: flex-end;

    }

    div [class="TopBarContentWrapper"] label[class="x1a2a7pz x1qjc9v5 xal68kn x51dqfy x1w4cqa3 x1byqp33 x9f619 x78zum5 x1fns5xo x1n2onr6 xh8yej3 x1ba4aug xmjcpbm"] {
        left: -20px !important;
        top: 5px;
        z-index: 1;

    }

    div [aria-label="Account Controls and Settings"] :nth-child(4),
        div [aria-label="Account controls and settings"] :nth-child(4) {
            right: 10px !important;
            margin-right: -5px;

        }

    .x1p8ty84, div [class="html-div xdj266r x11i5rnm x1mh8g0r xexx8yu x18d9i69 x6s0dn4 x9f619 x78zum5 x1s65kcs x1wsgfga x1pi30zi x1swvt13"] {
        border-bottom: none!important;

    }

    div [class="TopBarContentWrapper"] div [class="xds687c x1pi30zi x1e558r4 xixxii4 x13vifvy xzkaem6"],
        div [class="TopBarContentWrapper"] div [class="x6s0dn4 x78zum5 x5yr21d xl56j7k x1xegmmw"] {
            margin: 0px;

        }

    div [class="TopBarContentWrapper"] div [class="x6s0dn4 x78zum5 x5yr21d xl56j7k x1xegmmw"] {
        display: flex;
        order: 0!important;
        width: 24px;
        top: 2px;
        position: relative;

    }

    div [class="TopBarContentWrapper"] div [class="x6s0dn4 x78zum5 x5yr21d xl56j7k x1xegmmw"] div [class="x1i10hfl xjqpnuy xc5r6h4 xqeqjp1 x1phubyo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1ypdohk xdl72j9 x2lah0s x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak x2lwn1j xeuugli x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x1iwo8zk x1033uif x179ill4 x1b60jn0 x972fbf x10w94by x1qhh985 x14e42zd x9f619 x78zum5 xl56j7k xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x1vqgdyp x100vrsf x1qhmfi1"],
        div [class="TopBarContentWrapper"] div [class="x1i10hfl xjqpnuy xc5r6h4 xqeqjp1 x1phubyo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1ypdohk xdl72j9 x2lah0s x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak x2lwn1j xeuugli x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x1iwo8zk x1033uif x179ill4 x1b60jn0 x972fbf x10w94by x1qhh985 x14e42zd x9f619 x78zum5 xl56j7k xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x1vqgdyp x100vrsf x1qhmfi1"],
            div [class="TopBarContentWrapper"] div [class="x1i10hfl xjqpnuy xc5r6h4 xqeqjp1 x1phubyo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1ypdohk xdl72j9 x2lah0s x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak x2lwn1j xeuugli x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x1iwo8zk x1033uif x179ill4 x1b60jn0 x972fbf x10w94by x1qhh985 x14e42zd x9f619 x78zum5 xl56j7k xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x1vqgdyp x100vrsf x1hr4nm9"],
                div [class="TopBarContentWrapper"] div [class="x6s0dn4 x78zum5 x5yr21d xl56j7k x1xegmmw"] div [class="x1i10hfl xjqpnuy xc5r6h4 xqeqjp1 x1phubyo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1ypdohk xdl72j9 x2lah0s x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak x2lwn1j xeuugli x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x1iwo8zk x1033uif x179ill4 x1b60jn0 x972fbf x10w94by x1qhh985 x14e42zd x9f619 x78zum5 xl56j7k xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x1vqgdyp x100vrsf x1hr4nm9"] {
                    right: 0px!important;

                }

    div [class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x6s0dn4 xzolkzo x12go9s9 x1rnf11y xprq8jg x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x78zum5 xl56j7k xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1vqgdyp x100vrsf x1qhmfi1"], div [class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x6s0dn4 xzolkzo x12go9s9 x1rnf11y xprq8jg x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x78zum5 xl56j7k xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1vqgdyp x100vrsf x1hr4nm9"] {
        width: 24px;
        height: 31px;

    }

    div [class="HomeButton"]:before,
        div [class="FindFriends"]:before {
            content: '';
            display: block;
            height: 13px;
            left: -1px;
            position: absolute;
            top: 9px;
            width: 1px;
            background: rgb(82, 109, 164);

        }

    div [class="TopBarContentWrapper"] div [aria-expanded="true"] image[class="OldNotificationIcon"],
        div [class="TopBarContentWrapper"] div [aria-expanded="true"] image[class="OldMessengerIcon"],
            div [class="TopBarContentWrapper"] div [aria-expanded="true"] image[class="OldFriendsIcon"] {
                filter: brightness(0) invert(1);

            }

    div [class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r x1jx94hy x30kzoy x9jhf4c x9f619 x78zum5 xdt5ytf x1iyjqo2 x1iofjn4 x1y1aw1k x1sxyh0 xwib8y2 xurb0ha"] {
        top: 6px!important;
        left: -12px!important;

    }

    div [class="x9f619 x1s65kcs x17qophe x16xn7b0 xixxii4 x13vifvy x1m258z3 xoegz02 xmy5rp x1jx94hy"],
        div [class="x9f619 x1s65kcs x17qophe x16xn7b0 xixxii4 x13vifvy xoegz02 x1cvmir6 xkreb8t x1jx94hy"] {
            background: none;

        }

    div [class="TopBarContentWrapper"] span[class="html-span xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1hl2dhg x16tdsg8 x1vvkbs x4k7w5x x1h91t0o x1h9r5lt x1jfb8zj xv2umb2 x1beo9mf xaigb6o x12ejxvf x3igimt xarpa2k xedcshv x1lytzrv x1t2pt76 x7ja8zs x1qrby5j"] {
        margin-right: 2px;

    }

    div [role="banner"] li[class="x1iyjqo2 xmlsiyf x1hxoosp x1l38jg0 x1awlv9s x1gz44f"] {
        display: none;

    }

    div [aria-label="Account Controls and Settings"] a[aria-expanded="true"],
        div [aria-label="Account controls and settings"] a[aria-expanded="true"] {
            filter: brightness(0) invert(1);

        }

    a[class="QuickHelp"]:active,
        a[class="SettingsButton"]:active {
            transform: scale(0.96);

        }

    div [class="x6s0dn4 x78zum5 x5yr21d xl56j7k x1emribx"]:nth-child(3) span[class="x14yjl9h xudhj91 x18nykt9 xww2gxu x3nfvp2 x1nxh6w3 xk50ysn xhvdbge xo5v014 xnyloks xdi0jry"] {
        height: 12px;
        width: 7px;
        min-width: 7px;
        padding: 0px 1px;
        border-radius: 2px;
        position: relative;
        top: 4px!important;
        right: 10px!important;
        background: rgb(240, 61, 37);
        border: 1px solid;
        border-color: rgb(226, 57, 35) rgb(216, 55, 34) rgb(192, 49, 30);

    }

    div [class="x6s0dn4 x78zum5 x5yr21d xl56j7k x1emribx"]:nth-child(4) span[class="x14yjl9h xudhj91 x18nykt9 xww2gxu x3nfvp2 x1nxh6w3 xk50ysn xhvdbge xo5v014 xnyloks xdi0jry"] {
        height: 12px;
        width: 7px;
        min-width: 7px;
        padding: 0px 1px;
        border-radius: 2px;
        position: relative;
        top: 6px;
        right: 11px;
        background: rgb(240, 61, 37);
        border: 1px solid;
        border-color: rgb(226, 57, 35) rgb(216, 55, 34) rgb(192, 49, 30);

    }

    div [aria-label="Create a post"] {
        border-bottom: none!important;

    }

    *[class*="fb-dark-mode"] span[class="StoriesText"],
        *[class*="fb-dark-mode"] span[class="SponsoredText"] {
            background: #333334!important;
            border-top: #222!important;
            color: #e2e5e9!important;

        }

    *[class*="fb-dark-mode"] div [class="AboutSectionContainer"],
        *[class*="fb-dark-mode"] div [class="TabContainer"],
            *[class*="fb-dark-mode"] div [class="MoreButtonContainer"] {
                background: rgba(255,255,255,.1)!important;
                border-color: #555!important;

            }

    *[class*="fb-dark-mode"] div [class="SeeMoreButton"]  {
        background: #252728!important;
        border-color: #555!important;

    }

    *[class*="fb-dark-mode"] a[class="AddToStory"],
        *[class*="fb-dark-mode"] div [class="SponsoredContainer"] div[class="WrapperForAds"] span,
            *[class*="fb-dark-mode"] div [class="StoriesContainer"] div [class="StoryNamesWrapper"] span,
                *[class*="fb-dark-mode"] div [class="BirthdaysContainer"] b,
                    *[class*="fb-dark-mode"] footer span,
                        *[class*="fb-dark-mode"] footer a {
                            color: #7083b3!important;

                        }

    *[class*="fb-dark-mode"] div [class="CreatePostBottomPart"] {
        background: #333334!important;
        border: 1px solid #393939!important;

    }

    *[class*="fb-dark-mode"] div [class="SponsoredContainer"] div [class="xwib8y2 x1y1aw1k"] div:nth-child(2) div [class="x1n2onr6"] {
        border-top: 1px solid #333;
        border-bottom: 1px solid #333;

    }

    div [class="ProfileButtonsWrapper"] div [aria-orientation="horizontal"] {
        position: absolute;
        transform: translate(10px, 66px);

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="ProfileButtonsWrapper"] div [aria-orientation="horizontal"] :nth-child(2) {
        display: none;

    }

    div [class="x78zum5 xdt5ytf x1iyjqo2 x1us19tq"] a[href*="https://www.facebook.com/?filter=all&sk=h_chr"] {
        display: none;

    }

    *[class*="fb-dark-mode"] span[class="UpdateStatus"] {
        color: #e2e5e9!important;

    }

    *[class*="fb-dark-mode"] span[class="AddPhotosAndVideos"] {
        color: #7083b3!important;

    }

    *[class*="fb-dark-mode"] i[class="PostArrow"] {
        filter: brightness(0.21);

    }

    div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="html-div xdj266r x11i5rnm x1mh8g0r x18d9i69 x1cy8zhl x78zum5 x1q0g3np xod5an3 xz9dl7a x1ye3gou xn6708d"] {
        margin-bottom: 10px!important;

    }

    div [class="x1y1aw1k"] > div > span div [class="x1n2onr6"] {
        display: none;

    }

    div [class="TopBarContentWrapper"] a[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x1tlxs6b x1g8br2z x1gn5b1j x230xth x78zum5 x1q0g3np xc9qbxq xl56j7k xn6708d x1ye3gou x1n2onr6 xh8yej3 x1qhmfi1"] {
        display: none;

    }

    div [class="ProfileButtonsWrapper"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen x1s688f xi81zsa"] {
        font-size: 11px;
        font-weight: normal;
        color: rgb(59, 89, 152);

    }

    div [class="ProfileButtonsWrapper"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen x1s688f xi81zsa"]:hover {
        text-decoration: underline;

    }

    div [class="ProfileButtonsWrapper"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu x18d9i69 x6s0dn4 x9f619 x78zum5 x2lah0s x1hshjfz x1n2onr6 xng8ra xf7dkkf xv54qhq"],
        div [class="ProfileButtonsWrapper"] a[class="x1i10hfl x3ct3a4 xggy1nq x1fmog5m xu25z0z x140muxe xo1y3bh x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1heor9g x1ypdohk xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg x1vjfegm x3nfvp2 x1kmio9f x1itg65n x16dsc37"] {
            height: 17px!important;
            padding: 0px;

        }

    div [class="ProfileButtonsWrapper"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x91jh78 xkqq1k2 x1ey2m1c x13np604 xtijo5x x1o0tod x10l6tqk xl8spv7"] {
        display: none;

    }

    div [class="AboutSectionWrapper"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] {
        height: 24px;
        width: 24px;

    }

    div [class="x78zum5 x1a02dak x165d6jo x1lxpwgx x9otpla x1ke80iy"] div [aria-label="Add to story"],
        div [class="x78zum5 x1a02dak x165d6jo x1lxpwgx x9otpla x1ke80iy"] div [aria-label="Edit profile"] {
            display: none;

        }

    div [role="banner"] div[class="x9f619 x1s65kcs x17qophe x16xn7b0 xixxii4 x13vifvy xj35x94 xhtitgo xmy5rp"] {
        display: none;

    }

    div [class="TopBarContentWrapper"] div [class="x6s0dn4 x78zum5 x5yr21d xl56j7k x1emribx xfff67h xu1161g x12ca73t x5vlmd"] {
        display: none;

    }

    div [class="SidebarWrapper"] div [class="xb57i2i x1q594ok x5lxg6s x78zum5 xdt5ytf x6ikm8r x1ja2u2z x1pq812k x1rohswg xfk6m8 x1yqm8si xjx87ck x1l7klhg x1iyjqo2 xs83m0k x2lwn1j xx8ngbg xwo3gff x1oyok0e x1odjw0f x1e4zzel x1n2onr6 xq1qtft"] div [class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x14yjl9h xudhj91 x18nykt9 xww2gxu x6s0dn4 x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x3nfvp2 xl56j7k x1n2onr6 x1qhmfi1 xc9qbxq x14qfxbe"] {
        width: 16px;
        height: 16px;
        background: transparent;

    }

    *[class*="fb-dark-mode"] div [class="SidebarWrapper"] a[class="EditProfile"] {
        color: #7083b3!important;

    }

    *[class*="fb-dark-mode"] div [class="SidebarWrapper"] a[class="NewsFeedButton"] {
        background: #333334!important;
        border-bottom: 1px solid #393939!important;

    }

    *[class*="fb-dark-mode"] div [class="SidebarWrapper"] span[class="NewsFeedText"] {
        color: #e2e5e9!important;

    }

    div [class="PostButton"] {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfUAAAKiCAYAAADPK0XDAAAekklEQVR42uzVwSpEYRiA4c/xO3PmDCZShCJRpKY0JSQsbKxsrGxsLGwsLJTi4vVzbuKr563nGt6I0bQHAJL7q1vrAYDkagvjjR4ASG2Y+mSrBwByi1qzstMDAKkNU5/u9wBAblFbXD/sAIDcolY2TjoAILeolc1ZBwDkFrWl7XkHAOQWtXb3sgMAUhumvnfTAgC5RW10cN8CALlFrTt6aAGA3KI2Pn5sAYDUhqmfPhUAILeo9bPnAgDkFrXJ2UsBAFIbpj5/LQBAblFbPn8rAEBuUVu5eC8AQGrD1K8+CgCQW9RWrz8bACC3/6nffDUAQGrD1G+/GwAgt6hN734aACA1UwcAUwcATB0AMHUAwNQBftmvmwyEojiMw8dxXbfPdUQiV5KUltCkSYMmDRo0iIho9Tk6m/jreXnW8POCqAMAog4AiDoAIOoAIOoAgKgDAKIOAIg6ACDqACDqAICoAwCiDgCIOgCIOgAg6gCAqAMAog4A/x51MzMziz9PHQCq6FLZ9PDJAEBoNer7dwYAQqtR370yABBbKptsnw0AENsv6ptHAwDElsrG63sDAIRWo766tQBAbKls1F9bACC0GvXlpQUAYktlw8W5AwBiS2WD+akDAEKrUZ8dO/iyV++oCUVRAEWPJsZPHjfPhyIJQUgEixRpLGzS2KRx/vORA3cSB9aGNYYNQG2Rrc73DQBQW2TL0/8GACitT/3rNgAAtUX2cvwbAIDS+tQ/rwMAUFtki/dLAwBqi+z58NsAgNL61Pc/DQCoLbKn6dwAgNL61MfvBgDUFtm8HUcAoLbI5sPHCADUFtns9TACAKX1qa93EwBQW2Sz1XYCAGqLyJZvEwBQmqkDgKkDAKYOAJg6AGDqAGDqAICpAwCmDgCYOgCYOgBg6gCAqQMApg4AmDoAPNirYxMAgSCKgvZfhw0cBiYqmJgZiQg2cy5mYmBgtDADj2OvgW/UJUmSUZckSUZdkiQZdUmSjLokSUoUAAAAAAAAAAAAAAAAAAAAAAAAAAAAf7VlrV81AEAOZdjquJyv4t+gA0A23bQ/Bj1ugw4AWfXzcQ96vAYdALIz6AAAAAAAAAAAAAAAAAAAAAAAAAAAXOzDSw3CABAFwOeSr4kCtYAGPNAiAmPLauC2yUwyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwj9f3Warq7ElbP9dSVWdP2rpfSlWdPWmP/Vyq6uxJu2+nUlVnT9ptO5aqOnvSlveh/LFXJzYJAEAUBX9/oqBRW+CQw6a4i1y2jU3mJVPDA4DZku7/+VsAwGxJd3r8FAAwW9Id798FAMyWdIf7VwEAsyXd/vZZAMBsSfd3WxUAMFvS7a7LAgBmS7rt9aMAgNmSbnt5LwBgtqTbXBYFAMyWdJvzogCA2ZJufX4rAGA0UwcAUwcATB0AMHUAwNQBwNQBAFMHAEwdADB1ADB1AMDUAQBTBwBMHQAwdQAwdQDA1AEAUwcATB2AFzt3iAIgDIBhdOfzGhoWrSKYzF7ACwgGk+fyCHOYBINBDIP34EM0rvysKKMuSZKMuiRJMuqSJMmoS5Jk1B2EJElGXZIkGXVJkmTUJUmSUZckyahLkiSjLkmS/i4AAAAAAAAAAAAAAAAAAAAAAAAAAADwRdXM6SW/ggWAUtTdkvppf5S/G3QAKE0c1uM+6DG/BwCgTO24XYOen27oAFA6gw4AAAAAAAAAwMkeHAgAAAAAAPm/NoKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsJeHatmDUdhHD7Gv2ma2n4ohYoKiigoQkEKpS3SOrjo4uLk4mCHLoIOglJxcvYGvAHBwcnrq5ySRQRbXfodeH7wEBJy5ve/WpiNAEBxxw2XRgCguOzc4uoIAJQ2jfrSlREAqC2ybvnaCADUFlk3uzkCALVFdv7y7QEAqC2ytnpvAABqi6ytrQ8AQG2RXbi6MQAAZ+vp/tejk/ztPrL++vYAAJy9Vx++HR1++fmH/H7SbWT9jd0eAJgPB5++/zbo+X6au8gWbj3uAYD58ebzj+NBz+dpbyIb7jzpAYD5koP+L/9Htnj3WQ8AlDaN+v3nDQCoLbJx/UUDAGqLbOnBywYAlDaN+sZ+AwBqi+zi5kEDAGqLbHnrdQMASptGfedtAwBqi2zl4bsOAKgtspXd9x0AUNo06nuHHQBQW2SzRx87AKA0ow4ARh0AMOoAgFEHAIw68Iv9ukdpIIrCMHwZhmH8SdYREEFERERJb2OTxsJGRcRCEARRwSW4ATcgWGd9CQduEwLGLh58PniKuXDqlwFEHQAQdQBA1AEAUQcAUQcARB0AEHUAQNQBAFEHAFEHAEQdABB1AEDUAUDUAQBRBwBEHQAQdQD471E3MzOz/POnDgBVdiU2HL82AEBqNeqnzw0AkFqN+slTAwDkVmKD48cWAMitxAZHDy0AkFuJbR/etwBAajXqB7cdAJBbiW3tX3UAQGo16nuXHQCwXmc3n7NVfrovsc3dix4AWL/rl6/Z28d0Sbyvui2xjZ1JDwD8DXfv3wtBj+9f3NWoj8575uzVPUpDYRCG0TH+JMbL5/WiBEUCKqSwsElhY2Nj42ZchPvJEiOD3wJSZuC8cJhq6gcAjsfP726fQc976E/kFpvvJQBwXDLoeQ8VufnL1xIAKK1H/elzAABqi9zF+mMAAErrUX98HwCA2iJ3fr9tAEBtkTtbvTUAoLQe9bvXBgDUFrnTadMAgNJ61MfnBgDUFrlZW48AQG2Rmw0PIwBQW+ROrlYjAFBaj/rl7QQA1PYf9cXNBADUFpGbX08AQGmiDgCiDgCIOgAg6gCAqAOAqAMAog4AiDoAIOoAIOoAgKgDAKIOAIg6ACDqAPyxVwc1AAAgEMPwbxos8CNc2mQaJlOXJEmmLkmSTF2SJJm6JEmmLkmSHgUAAAAAAAAAAAAAAAAAAAAAAADAkV4oAOAHQweAIIYOAEEMHQCCGDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAw7NVBDQAACAMx/3ZnACzsC2mT03AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEDhqyQjSZJuZ+qSJJm6JEkydUmSZOqSJMnUJUladu1WBUAYCsDo+7+HLzAMFhUstiURwZdRbhOL+boTDmOLKx/7EXUAQNQBAFEHgLZ0pX4RdQDIoozbNa3nW6w7qQNANv28P4Mec9fvAJDVsBwR9Bi9qQPAD8LuoxwA+P0OAIg6ACDqAICoAwCiDgCiDgCIOgAg6gCAqAOAqAMAog4AiDoAIOoAIOo2AgBEHQAQdQBA1AEAUQcAUQcARB0AEHUAQNQBQNQBbvbqIElBAAaAYP7/zhVQWAEBr7HyBI+xeqr6DQOYOgBg6gCAqQMApg4Apg4AmDoAYOoAgKkDgKkDAKYOAJg6APCNkCRJP1RKkqT2RXW93wkA9BbVdV4JAPQW1XmeCQD0FtVxnAkA9BbV8ToSAOgtqv21JwDQW1TbviUA0FtU27YlANBbVOu6JgDQW1TP538CAL1FtSxLAgC9RbXMSwIAvUU1z48EAHqL6nG/JwDQW1TTNCUA0FtU4zgmANBbVMMwJADQW1R/t1vyYa8OTiCGYQAIqv8W7cQ+X/pQUAl5CmZhalgA6C2q5/knANBbVOecBAB6i+q3dwIAvUW190oAoLeo1r0SAOgtqvu6EgDoLao5ZwIAvUU1xkgAoDVTBwBTBwBMHQAwdQDA1AHA1AEAUwcATB0AMHUAMHUAwNQBAFMHAEwdADB1ADB1AMDUAQBTBwBMHQBMHQAwdQDA1AGA8lVIkvSyV3c3CQRAFEanTFFElA4QUaEDa+Cd5ccmbGzYeaEGZ3NucpLbwWcT2s/hLwGA3qK22v8mANCaqAOAqAMA/y/qb7trAgC9Re11PABAb1Fbfl8SAGhN1AFgUlF/+bokANCZqAPAtKK++DwnANBb1J635wQAeova/OOUAEBvUZtvTgkA9Ba1p82QAEBvUXscDwDQW9Rm70MCAL1FbbYeEgDo7B71YwIArYk6AEwq6g/jAQAaE3UAEHUAQNQBAFEHAEQdAEQdABB1AEDUAQBRBwBRB27s1bFNA0EQhtGpjzZwQAsIiRLcAA0gEdPV4dvz7TkdNAkBAXZmr3mf9IJbaZJLfgCjDgAYdQDAqAMARh0AjDoAYNQBAKMOABh1ADDqAIBRBwCMOgBg1AHAqP/3nwAARh0AMOoAgFEHAIw6ANyvkCRJd1RKkqThi2o7nRIAGFtUW98SABhbVL33BADGFtW69gQAxhbVelwTABhbVMtxSQBgbFG1pSUAMLaoWmsJAFzXw+7tnD/vo5rnOQGA63t8fs+X/edv9X72NqrD4SsBgNvw9PpRQ/6jvi+5i2qapgQAbsc3e3Vw4yAAQ1HQJaeI7ScFQQJhCZCQHrxyBzmupfnSyCef3+XnWkGv+/VP1D7nJwGAf6WCXvdrUTvPdwIAvUXt/XolANBb1I7jSACgt6jt+54AQG9R27YtAYDeorY+nwkA9Ba1df1NAKC3qC3LkgBAb1F7zHMCAL1FbZ6nBAB6i9p0nxIA6C1q99stAYDeojaOYwIAvUVtGIYEAFoTdQAQdQBA1AEAUQcARB0ARB0AEHUAQNQBAFEHAFEHAEQdABB1AEDUAQBRBwBRBwBEHeCPnTtWiSOK4jB+qxC2skxlkcLKIuwL2IdgFSKkWoQMNml8AkNSbOGWQcwTmHrTWFlIsEmzZap9B8Ei1ck9cAcOw925O0cvq/L94M/suGRgqy8za8IYI+qMMcYYI+qMMcYYUWeMMcYYUWeMMcYYUWeMMcaYZwEAADwzItLEzeP+pmMTMg4ODkZxTdwiTvSYzkfBYTqdSljTj4s/0hl/KwEAoBP0c8mbZYI+j5PM5vr+0KCrIWEn6AAA9N+hqxt9bX6m56oxUW9MwPX1th5N6JuBQVeDw07QAQDIR/3KxDsX+ysT9YWNdyb2C0fQbdiJNQAAXiKylGjFe2pp4i1po8xjedGFNchqRB0AgIJPF28mcZdxd+k4aQM7L9ypzwfdqQMAgNpB/xcnZno+0XgfF75TP+75Tn2r853619Ldec8jeR6/AwBQkO7MJbPLNrg/ZbUbE/UtE/DcFt6oz2YziSPqAAD0SI/cJbM7G90vcb/jlnpM5ze5sGf+nfp3e07UAQDYwJ16SS7sNvDm9XY37FKgj9vbtVHX1zyKBwDA8Z16Ugy7LvSzYT9fI+oa8ey4awcAwPHb7w6lsL/S8fgdAIAnjl+UAwCAqBN1AAAAAACCPBPP67PUJyI7Yuh56Dg5ORnHidk4dDRNI176Z9tr3N7eumav8fnbL8/SNYrGQQcARJ2oP8Koqx0zCR1tyM0kFzuNojPoY3MNb9DtNbxBH5eCfnp6KjrCDoCoE3VP1F+HiroRXxX1nnN32LshdYS97xpVgp4QdgBEnag/3qhL1Bf13NEX9nzQHWFf5xo1gk7YARB1ol4t6rtx+3GTdNx1RD177Iu67449H3RH2Idc4yGDTtgBEHWiXi3qb+OatA/peKQ/32DUbVCLQXeE3XONhwg6YQdA1Il6tajvpoi/i3sZp16koB/p+5uNug17PuiOsN/nGvcJOmEHQNSJetWov09RH4XEhP1Q3x8adVWKus6erxlUR4yrXMMTdMIOgKgT9epRn8R97An+4cCo77Trifq4nf15hX/bvdFrmKB7ws7/hgjgaUR9b29Prq+vpaazszNZLpcbibp+Nv2MFeln089Y+079P3vnH5PVdcbxG9KgaQxZTNdlJjOLWflrrcti+s/c2pLVOtM4YrpNt5VZp0ibtIkK/YVrMgN/zNLghHfpuyq0CmEClY1XwMQYccSa1r5zqXFYVylDWxtRKUXGmINn55ucmz25Odzzvjf3IC97Psk3995zDuTeg/Lhub/ezVlU6oVkpjD48hlDpCoVBEHIValjGOJS7hUVFQiTu1upc5nr43Mqc318cV5TXwuRM6Gv1tfUv5XdW+V4zG+V4xGhC4IgzA+pu5I7l3pkuXuKCDLncSVzHhd3vz+hZV6qlz/2UMULgiAIInWb1HkqKyudSJ3n6NGjcUod+zzj8cQE9nmm43H1nHqxygMq6yF3EbsgCIJIPWOpr1y5knp7e51W6olEgi5duuSiUse+4xhcVurYdxyDO6mbuZs9t17sCYIgCCL1AK5kzrHIPA6p2+WucSN391LnYn9cZZUnCIIgiNQDMJk7IyhzB1K3y13jUu7ZSV0QBEEQ5Dl1+UAXQRAEQaQuUhepC4IgCCJ1kXpMyJvJBEEQBJG6SF0QBEEQqYvUReqCIAiCSF2kLlIXBEEQROoidZG6IAiCIFIXqQuCIAiCIAiCIAj/B+QZkxsQMkfniHRmjavDX1AwXhZ892fJn6v0qZDOu2jzMmDXrl1pFbLFy02+XVNTQ1jBEtveHebB9UlaU9YU63x+Z0OyTYWyTJsXA61lXy5VISy92eMelUJD0G5H/3tAsL5u3boOlT/ZgrFYZpAOz4Bqf1ClVKVaJaHS4o/FUm8ndH8pxoedrb148SK1tbXhzZcI1tEmZxBzWOh36c/iXq3fHb4CbTkgdwKOxZnH5miFnp/VmC82R273z73UIfNqleHvlbxx9rnOAXr+/bFzu0//9HZ581P0yKbXz6m+qyovW6ROIyMjoamurkZC9+mHzxxMqVCGSXmaZ6uOpFQoQlKZCJ1f6rnTYi954TBNT0+7kDpFSUxSJ7rVSVh6s8c3zFJHu52mpia6du0al3pLzFJvCch8hUptxO9bi68P/oI6ceIEdXZ20uDgIE1MTCBYRxv6ROo5KPSF+mM8SwMpVimYw2KnCxcuMGk6FXoB5sMwR2v1/OWFSR37ifXZkvqh7g/82KQOmXeoUNGWtz7UMic/Ne+sodfeeYgQyH3V078bVmMnVfZ7mld+VZlWobDU19cTl3p3d3eo2CHrgaGbdPPzf4YGYzCWSZ1GRsfpi7GJjIPx+LpMhM6lno3Y8fkC+OVvC8ZlU6VD6ljOptQ3vthO10fGySco9XQ6TQcPHjTuE9rRP1OV/v6bTxCkjmUM1XqhJVraWDfA2vfu3YuftSkQelDqiZilnuBCj+P7crH39/dTV1cXTU1NkU9jYyMBtKVSKfz+EqnnmNSLIKji4uKd6gd8dmBgoH/Dhg2/5mJnFelcE7o7qevqnAsd84L5wTxhvvQcFVmkPqtih8iD8WbAl/nWjo/GmcxNUmdy30iPboXck6SlTjYwhkudZyapD336eUYJSv3GyC1TlHhep7VPHzD1aanbhc6lno3Ymbit8TLgjbYztGN3dyxSP3bsGGUjdS50LnUubj/YtrQHq3QkrFovgIwtoi6wyFqTmdT37NkDafNwmZukXh2z1KuZ1Gtj+r61nqalpYWuXLlCICh1cPnyZVJjROo5RD7EtGDBgrLR0dFh0qjTL2MOxO5A6Fzq7oWOeSEN5gvzpuco3yZ1Lva5JHU/JTs7KKxSV6fiJ/eeqThLN8qIrt7/SVDq+9rTxnCpB1NVVRUq9ZqGPlOylvovXmglYJG6Vehc6max26UOwrazqdJ9qfupePUoZSt0P5lKXRNsDxM437ZW6c89sjSsWr9X/19bahD6Ut13T5xSx8+2vb2deNCGCpeFS700ZqmXsmvo8X1ffY29trZWV+lmqaNPjRGp5xCLIKXly5dvJ40DsbsUOpe6e6EHwLyhH/Nok3p0sbuXOs/qbW2nIPeKd0ev7j69fqruzLZ/pC/+5KwS+aQK+clW6g0NDbR//37at28fBaV+eOuulAr5ibtSR5UOsLRIPSh0i9TtYudSZxi3keB1c8iaRwvdGPRFFXqcUuci57FdS+dSR9BuEO3XVRbyG9ywzmWfodSXZSL1uro6SiaTGUndlXwd/rHApQ6ZIyL1HCfPF9f58+fTDsTuROh2SboXOuaLzUueg312eE3dLPWHnvw94m9rgZsTZ6UOkQ/2psmPrVLXyUjqiebT9PyrPVapW4RulToXu61SD8L7gxX5a2+eQrjMs5Y6xG0RulXqM2GWurlit1TpXOrGaj1wmv1LKndD8Fjnp+XjrNT9at0UnJo/efIk9fX1EbZdnSZ3dlqfn343gz45/Z6DUn8AciooKHjGgdjnrdAxXxij5y/Pwb47vPvdLPXPro/RtZu3XEgdN+PgBjnEJvVYK3WI3Afrfsp/0x2UOhe6Veo2sRulbq7Yw6SOa+dIZKlzgduEDsKupSMafztSpW6u0s1Bf8jNb0sQtu1E6qjWITd+Pd2XeHNzM8Sut93c0ObqBjx+oxz+/QRBG/rUGJF6Dj7O9rATsc9/oT/M5sHxMbiXOsByLlTq5z78zCp0jPGlrkSdVqFgZgB9d0TqBpxKnYvcIvTZvqbOq3RDpW6s1gsziWFsvsqykLvfjeFSx13gvsz9BCt5V4+euXxUjhTHjx8nHN/Q0BB/pA1t6JNH2nJY7EUOxD6fhV7Ejt/xsbiX+q3xSadSP3LkCPX09GRUqVdW/ZEgax5ImAs9+Jw6+n974BTCZW6VuvvT79Gvqeub3yJJ3Vaxxyb16He/8yrdWq1nKXVOoRb6opCKncmfSZ8RqNCNuHpJjMuX2vDfQ62trfzlM2iTl8/kuNjzHYh9Pgs9H1/v9pjcS33LKx30eNlbhHXwr8nb5Ev9P91LLk1/cF+KPvnmyTCphxCpUkf+2nmCeA5sfImL3a/QF6ss0lLHtXMkgtTd3yhnv/vdXqkjftuf3/uYglL/0bZDlMnjaw6kHuU5dUg91bT5XrIF47zoQOgLQ/oXG/8wQDsDf5DqilwEJ4jYRehRj8291FdtaqCSF9to887DrFLXUu/4yv/SteTY9Ln7kvTp/T1K6lPoz+blM/p6Ok7pWaRuDsZA4JAxk7ommtT5G+VcP9Jmj/3ud0/T3fsRKnjeFxB6dB7d1EjPVnfNGB/ehq/xorEI8rQG46JzlycIIvboYhehOzhGt6ffb2P52C8bCDz18tv02OZG4lLn+ffhr47+rX4x+VLnQNKQtSVhj7QFRc7jixdij0XqXBoOXj4T7Y1yLnAvdaleBUHEnvtCdy/26FL/++CwVepa7F0qoyoTve8N0A+2NNLGl9opKPWxtq8RZP79kvobqu+QZwBviMtW6rxi41KvW1NKtmotTOqI33bqL4Mmqfd7DAevic1Fon+giyAIIvZcFvpcFbsv9L4zH2OZzQe6JLTcx/np9+t/WEaQedGTiRHVlvRC2LFjR3r79u1UXl5Oat0aNTbtMSB1JnQmcQvmu9+X6JSopAJ9/ejzGJE/0EUQhP+yd8cqakRRHMYXkSXFYOdWPsK2NlYSIogsKVPF1iKkSBFCWNKlyCPkaUIKkZBG1JBKEaxCiCGoDzCZP9yByUFc3Ow9DvL94Fa7y5w9zceMoiDsBD3W/54HXULYj/3q1VfZ+ZmHvf38oyL/4YFeI7UnsVHPg85XrwJACcNO0F3CboMuxbDzmicA4GHCTtCjh90GnbADACKE/fSfi15xDbp/2G3QCTsAwDXsiihBPyLs2pd+dkfQCTsAIGrYe9mpOgXdqur6PkH3D7sirXOM8DeEHQBwXNjb7fbbwjeZeQddrnV9zeEQdM+wE2UAQJywNxqNl7vd7k9qTKfTryGYT+66U5/NZjFipesOJpPJl9TQvJq7pEHXPgg6AMA16kl2niqM8/n8W2qs1+sfIZrPbLSy3/cIu6470BypoXnDbJo/MVEvW9A1L0EHAESMergTrtfrL7bb7e/UGI/Ho8KdsJUul8vYYdd1B5ojNTSv5s6fJJiolyno2hNBBwD4BH2xWHzf93i72Wy+DtG8vhD/sOu6A82heVJDc+8LO0EHABD0QtB7vd67EMuuefe7Z9ir4foDzXNM2Ak6AICg/xv0m+wkJpKeYa+E69/cJ+wEHQBA0EPQ7QfPnDDstfuGnaADAAh6HnQdwznslf8NO0EHABB0nYCwE3QAwBkEnbATdADAGQSdsBN0AMAZBJ2wE3QAAEEvfdgJOgCAoJ9R2Ak6AICgn1HYCToAgKA/XNhNIEsVdoIOAHANejU7jyME3SHsJur+Ydfeqgf2QNABAK5Rb0cIul/YbdT9w94+sAuCDgBwc6kw1Wq1CEGPLl2tVibqvmHX3sJuLg9EXXMSdABAdFeKUr/ffx8h6B5M1H3Drr2F/VwdmI+gAwBcPMofvW82m18Rgu7BRNMn7NpX4RG89rgPQQcAuKnkb5JrtVpvhsPhp9Fo9LnT6dxGCLqDuGHXXrQf7Un7KrxZrnIBAMCJVcJdZleBMkchS1yCXv6wJ3nYzelqf0QdAADgb3twSAAAAAAg6P9rTxgBABYBEswNy/C9U98AAAAASUVORK5CYII=)!important;

                              }

    *[class*="fb-dark-mode"] div [class="UpdateInfo"],
        *[class*="fb-dark-mode"] div [class="ActivityLog"] {
            border: 1px solid #312f2b!important;
            color: #e8eaee!important;

        }

    div [class="PostButton"]:active,
        div [class="UpdateInfo"]:active,
            div [class="ActivityLog"]:active {
                scale: 0.95;

            }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1emribx x1e56ztr x1i64zmx xnp8db0 x1d1medc x7ep2pv x1xzczws"] div > div > div:first-child div [class="x1yztbdb"]:first-child {
        display: none;

    }

    div [aria-label="Shortcuts"] {
        display: none;

    }

    div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="html-div xdj266r x14z9mp x1lziwak x18d9i69 x1cy8zhl x78zum5 x1q0g3np xod5an3 xz9dl7a x1g0dm76 xpdmqnj"] image[preserveAspectRatio*="xMidYMid slice"],
        div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="html-div xdj266r x14z9mp x1lziwak x18d9i69 x1cy8zhl x78zum5 x1q0g3np xod5an3 xz9dl7a x1g0dm76 xpdmqnj"] [style*="height: 40px"],
            div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="html-div xdj266r x14z9mp x1lziwak x18d9i69 x1cy8zhl x78zum5 x1q0g3np xod5an3 xz9dl7a x1g0dm76 xpdmqnj"] div [class="x1vqgdyp x100vrsf"] {
                width: 50px!important;
                height: 50px!important;

            }

    div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="html-div xdj266r x14z9mp x1lziwak x18d9i69 x1cy8zhl x78zum5 x1q0g3np xod5an3 xz9dl7a x1g0dm76 xpdmqnj"] {
        margin-bottom: 4px;

    }

    div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="html-div xdj266r x14z9mp x1lziwak x18d9i69 x1cy8zhl x78zum5 x1q0g3np xod5an3 xz9dl7a x1g0dm76 xpdmqnj"] div [class="x78zum5 xdt5ytf xz62fqu x16ldp7u"] {
        margin-top: 0px;
        margin-left: 2px;

    }

    div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="x1n2onr6 x1ja2u2z x1jx94hy xw5cjc7 x1dmpuos x1vsv7so xau1kf4 x9f619 xh8yej3 x6ikm8r x10wlt62 xquyuld"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl"]:nth-child(3),
        div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="xabvvm4 xeyy32k x1ia1hqs x1a2w583 x6ikm8r x10wlt62"],
            div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="x15mokao x1ga7v0g xde0f50 x15x8krk x6ikm8r x10wlt62"] {
                width: 411px;
                margin-left: 72px;

            }

    div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="x6s0dn4 x78zum5 xz9dl7a xpdmqnj xsag5q8 x1g0dm76"] {
        width: 411px;
        margin-left: 60px;

    }

    div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="html-div xdj266r xat24cr xexx8yu xyri2b x18d9i69 x1c1uobl x1jx94hy x8cjs6t x3sou0m x80vd3b x12u81az x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x178xt8z x1lun4ml xso031l xpilrb4 xrx5xu5 x1vn23mh xrws0fy x16azbe4 x6ikm8r x10wlt62 x1diwwjn xbmvrgn"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl"],
        div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="xabvvm4 xeyy32k x1ia1hqs x1a2w583 x6ikm8r x10wlt62"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl"] {
            margin-left: 0px!important;

        }

    div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="html-div xdj266r xat24cr xexx8yu xyri2b x18d9i69 x1c1uobl x1jx94hy x8cjs6t x3sou0m x80vd3b x12u81az x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x178xt8z x1lun4ml xso031l xpilrb4 xrx5xu5 x1vn23mh xrws0fy x16azbe4 x6ikm8r x10wlt62 x1diwwjn xbmvrgn"] {
        margin: 0px;

    }

    div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [class="x1l90r2v x1iorvi4 x1g0dm76 xpdmqnj"] {
        padding-left: 0px;

    }

    div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] div [style*="min-width: 500px"] {
        min-width: 411px!important;

    }

    div [class="AboutSectionContainer"] a[class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj xzsf02u x1s688f"] {
        font-weight: normal;

    }

    div [class="ProfileButtonsWrapper"] div [class="x78zum5 xdt5ytf xz62fqu x16ldp7u"] div[class="xu06os2 x1ok221b"]:nth-child(2) {
        display: none;
    }

    div [class="AboutSectionWrapper"]:hover div[class="AboutSectionContainer"],
        div [class="TabsWrapper"]:hover div[class="TabContainer"]:nth-child(1),
            div [class="TabsWrapper"]:hover div[class="TabContainer"]:nth-child(2),
                div [class="TabsWrapper"]:hover div[class="TabContainer"]:nth-child(3),
                    div [class="MoreButtonWrapper"]:hover div[class="MoreButtonContainer"] {
                        border: 1px solid #e5e7eb!important;

                    }

    *[class*="fb-dark-mode"] div [class="AboutSectionWrapper"]:hover div[class="AboutSectionContainer"],
        *[class*="fb-dark-mode"] div [class="TabsWrapper"]:hover div[class="TabContainer"]:nth-child(1),
            *[class*="fb-dark-mode"] div [class="TabsWrapper"]:hover div[class="TabContainer"]:nth-child(2),
                *[class*="fb-dark-mode"] div [class="TabsWrapper"]:hover div[class="TabContainer"]:nth-child(3),
                    *[class*="fb-dark-mode"] div [class="MoreButtonWrapper"]:hover div[class="MoreButtonContainer"] {
                        border: 1px solid #65686c!important;

                    }

    div [aria-label="See recommendations"] {
        display: none;

    }

    div [class="html-div xdj266r x14z9mp xat24cr x1lziwak x1jx94hy xde0f50 x15x8krk x9f619 x78zum5 xdt5ytf x1iyjqo2 x1iofjn4 x1y1aw1k xf159sx xwib8y2 xmzvs34"] {
        left: -4px!important;
        position: relative;
        border-bottom-left-radius: 2px!important;
        border-bottom-right-radius: 2px!important;
        top: 7px;

    }

    div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl xn0vg7t xys98vm x10l6tqk"] {
        display: none;

    }

    div [role="complementary"] div [class="x78zum5 xdt5ytf x1iyjqo2 x1n2onr6"] div [class="x1n2onr6 x1uc6qws xyen2ro"]:nth-child(2),
        div [role="complementary"] div [class="x78zum5 xdt5ytf x1iyjqo2 x1n2onr6"] div [class="x1n2onr6 x1ja2u2z x9f619 x78zum5 xdt5ytf x2lah0s x193iq5w xjkvuk6 x1cnzs8"] {
            display: none;

        }

    div [role="complementary"] div [class="x78zum5 xdt5ytf x1iyjqo2 x1n2onr6"] div [data-visualcompletion="ignore-dynamic"] div [class="x1n2onr6 x1ja2u2z x9f619 x78zum5 xdt5ytf x2lah0s x193iq5w xjkvuk6 x1cnzs8"] {
        display: block!important;

    }

    span[class="html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x4k7w5x x1h91t0o x1h9r5lt x1jfb8zj xv2umb2 x1beo9mf xaigb6o x12ejxvf x3igimt xarpa2k xedcshv x1lytzrv x1t2pt76 x7ja8zs x1qrby5j"] > div[class="x78zum5 x1n2onr6"]:after {
        display: none!important;

    }

    svg[aria-label="Your profile"] {
        margin: 0px!important;

    }

    div [role="banner"] div[class="x9f619 x1s65kcs x1o0tod x16xn7b0 xixxii4 x13vifvy xj35x94 xhtitgo xmy5rp"] {
        display: none;

    }

    div [class="AboutSectionContainer"] a {
        font-weight: normal;

    }

    *[class*="fb-dark-mode"] div [class="AboutSectionWrapper"] span[class="AboutButton"],
        *[class*="fb-dark-mode"] div [class="TabsWrapper"] span {
            color: #7083b3;

        }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div[aria-orientation="horizontal"],
        div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1ve1bff xvo6coq x2lah0s"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu x18d9i69 x6s0dn4 x9f619 x78zum5 x2lah0s x1hshjfz x1n2onr6 xng8ra xf7dkkf xv54qhq"],
            div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1ve1bff xvo6coq x2lah0s"] a[class="x1i10hfl x3ct3a4 xggy1nq x1fmog5m xu25z0z x140muxe xo1y3bh x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1heor9g x1ypdohk xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg x1vjfegm x3nfvp2 x1kmio9f x1itg65n x16dsc37"],
                div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1ve1bff xvo6coq x2lah0s"] div [class="x1i10hfl x3ct3a4 xggy1nq x1fmog5m xu25z0z x140muxe xo1y3bh x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1heor9g x1ypdohk x78zum5 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg x1vjfegm x1itg65n x1o0tod x10l6tqk x13vifvy"] {
                    height: 30px;

                }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1icxu4v x25sj25 x1yrsyyn x17upfok xdl72j9 x1iyjqo2 x1l90r2v x13a6bvl"] {
        height: 30px;
        padding: 0px;
        margin-right: -10px;
        margin-bottom: 10px;
        background-color: rgb(242, 242, 242);
        border-bottom: 1px solid rgb(204, 204, 204);
        border-top: 1px solid rgb(255, 255, 255);

    }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [aria-label="Share"],
        div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [aria-label="See recommended groups"],
            div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [aria-label="See Recommended Groups"],
                div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [aria-label="Invite"] {
                    display: none;

                }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu x18d9i69 x6s0dn4 x9f619 x78zum5 x2lah0s x1hshjfz x1n2onr6 xng8ra xf7dkkf xv54qhq"] {
        padding: 7px 10px 8px;
        height: 26px;
        border-left: 1px solid rgb(219, 219, 219);

    }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] a,
        div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1i10hfl x3ct3a4 xggy1nq x1fmog5m xu25z0z x140muxe xo1y3bh x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1heor9g x1ypdohk x78zum5 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg x1vjfegm x1itg65n x1o0tod x10l6tqk x13vifvy"],
            div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x14ju556 x1n2onr6"] {
                height: 26px;

            }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div[aria-orientation="horizontal"] {
        height: 30px;
        width: -webkit-fill-available;
        position: absolute;

    }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1icxu4v x25sj25 x1yrsyyn x17upfok xdl72j9 x1iyjqo2 x1l90r2v x13a6bvl"] div [aria-orientation="horizontal"] a[aria-selected="true"] {
        background: #fff;

    }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [aria-orientation="horizontal"] a[id="lookingforplayers"],
        div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [aria-orientation="horizontal"] a[id="buysellgroupdiscussions"],
            div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [aria-orientation="horizontal"] a[id="questions"] {
                display: none;

            }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1icxu4v x25sj25 x1yrsyyn x17upfok xdl72j9 x1iyjqo2 x1l90r2v x13a6bvl"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu x18d9i69 x6s0dn4 x9f619 x78zum5 x2lah0s x1hshjfz x1n2onr6 xng8ra xf7dkkf xv54qhq"] span {
        color: rgb(86, 86, 86)!important;
        font-weight: bold!important;

    }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1l90r2v x1ve1bff"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xs83m0k x1icxu4v x25sj25 x1yrsyyn x1r8uery x1dh0t33 x17upfok x1l90r2v"] {
        padding: 14px 0px 0px 0px!important;
        margin-top: 16px;
        margin-right: 0px!important;
        min-width: 204px;
        max-width: 204px;
        height: 30px;

    }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1ve1bff xvo6coq x2lah0s"],
        div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x78zum5 xdt5ytf x1wsgfga x9otpla"] div[class="x1e56ztr x1xmf6yo"]:nth-child(2),
            div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ey2m1c xtijo5x x1o0tod x47corl x10l6tqk x13vifvy x19991ni x1dhq9h x1fmog5m xu25z0z x140muxe xo1y3bh x1hc1fzr x1mq3mr6 x1wpzbip"] {
                display: none;

            }

    *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1icxu4v x25sj25 x1yrsyyn x17upfok xdl72j9 x1iyjqo2 x1l90r2v x13a6bvl"] {
        background: #0d0d0d;
        border-bottom: 1px solid #333333;
        border-top: 1px solid #000000;

    }

    *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1icxu4v x25sj25 x1yrsyyn x17upfok xdl72j9 x1iyjqo2 x1l90r2v x13a6bvl"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu x18d9i69 x6s0dn4 x9f619 x78zum5 x2lah0s x1hshjfz x1n2onr6 xng8ra xf7dkkf xv54qhq"] span,
        *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 xpdmqnj x1g0dm76 xtvsq51 x1r1pt67"] span,
            *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 xpdmqnj x1g0dm76 x1qhmfi1 x1r1pt67"] span {
                color: #e2e5e9!important;

            }

    *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu x18d9i69 x6s0dn4 x9f619 x78zum5 x2lah0s x1hshjfz x1n2onr6 xng8ra xf7dkkf xv54qhq"] {
        border-left: 1px solid rgba(100, 100, 100, .4);

    }

    *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1icxu4v x25sj25 x1yrsyyn x17upfok xdl72j9 x1iyjqo2 x1l90r2v x13a6bvl"] div [aria-orientation="horizontal"] a[aria-selected="true"] {
        background: #333334;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1ve1bff xvo6coq x2lah0s"] {
        display: flex!important;

    }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] .x9f619:nth-child(2) > .x78zum5 > .x78zum5 > div > .x9f619:nth-child(2) > .x9f619 > div:nth-child(1),
        div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl xh8yej3"] {
            height: 30px;

        }

    div [class="GroupAboutSectionWrapper"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1gslohp x12nagc xzboxd6 x14l7nz5"]:first-child,
        div [class="GroupAboutSectionWrapper"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1gslohp x12nagc xzboxd6 x14l7nz5"] :nth-child(2),
            div [class="GroupAboutSectionWrapper"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1gslohp x12nagc xzboxd6 x14l7nz5"] :nth-child(3),
                div [class="GroupAboutSectionWrapper"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1gslohp x12nagc xzboxd6 x14l7nz5"] :nth-child(4),
                    div [class="GroupAboutSectionWrapper"] a[aria-label="Learn more"],
                        div [class="GroupAboutSectionWrapper"] div [class="x78zum5 xdt5ytf x1xmf6yo x1e56ztr xbmvrgn x1n2onr6 xqcrz7y"] {
                            display: none;

                        }

    div [class="GroupAboutSectionWrapper"] div [data-visualcompletion="ignore-dynamic"] {
        padding: 0px!important;

    }

    div [class="GroupAboutSectionWrapper"] div [dir="auto"] {
        font-size: 11px;

    }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x78zum5 xdt5ytf x1iyjqo2"] div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh xnp8db0 x1d1medc x7ep2pv x1xzczws"],
        div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x78zum5 xdt5ytf x1iyjqo2"] div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] {
            margin-top: -16px!important;

        }

    div [class="GroupAboutSectionWrapper"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli x14vy60q xyiysdx x1120s5i x1nn3v0j"] {
        font-size: 11px;
        font-weight: bold;
        color: gray;
        text-transform: capitalize;

    }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="html-div x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl xw7yly9"] {
        margin-top: 0px;

    }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 xpdmqnj x1g0dm76 xtvsq51 x1r1pt67"],
        div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1qhmfi1 x1r1pt67 x7at6mh xkde5i4"],
            div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 xpdmqnj x1g0dm76 x1qhmfi1 x1r1pt67"] {
                height: 18px!important;
                background: transparent!important;
                border-top: none!important;
                border-bottom: none!important;
                border-right: 1px solid rgb(219, 219, 219);
                border-left: 1px solid rgb(219, 219, 219);
                border-radius: 0px;
                bottom: 3px;

            }

    *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 xpdmqnj x1g0dm76 xtvsq51 x1r1pt67"],
        *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1qhmfi1 x1r1pt67 x7at6mh xkde5i4"],
            *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 xpdmqnj x1g0dm76 x1qhmfi1 x1r1pt67"] {
                border-right: 1px solid rgba(100, 100, 100, .4);
                border-left: 1px solid rgba(100, 100, 100, .4);

            }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 xpdmqnj x1g0dm76 xtvsq51 x1r1pt67"] span,
        div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 xpdmqnj x1g0dm76 x1qhmfi1 x1r1pt67"] span {
            color: rgb(51, 51, 51)!important;
            font-size: 11px;

        }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1qhmfi1 x1r1pt67 x7at6mh xkde5i4"] i[style*="background-position: 0px -1021px"],
        div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1qhmfi1 x1r1pt67 x7at6mh xkde5i4"] i[style*="background-position:0 -1021px"] {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF6GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTA5LTIwVDIwOjQ5OjA2KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wOS0yMFQyMDo1MCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wOS0yMFQyMDo1MCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1ODU3MjMxYS02YjM5LTBhNDMtYjY4My05YjNkYWQ3Zjg4YzMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDowOTk3MmVlZC0wN2YwLTc0NDgtYTI2OC1iNGFjMmM2MDFjZDUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphMTViMmFjMC0yZmEzLWE2NGQtYWQzYS0wOWUxYTQ3YzI3ODciPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmExNWIyYWMwLTJmYTMtYTY0ZC1hZDNhLTA5ZTFhNDdjMjc4NyIgc3RFdnQ6d2hlbj0iMjAyNS0wOS0yMFQyMDo0OTowNiswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ODU3MjMxYS02YjM5LTBhNDMtYjY4My05YjNkYWQ3Zjg4YzMiIHN0RXZ0OndoZW49IjIwMjUtMDktMjBUMjA6NTArMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz50kEiVAAAAbklEQVQYGWNgAILw8HAuIE4D4otA/B9Kg/hcDMgAqnAzVBE63oyiAWoCTALEloPSMAPSkBVfxBBENeQisiDMSi4szgPLkW0yupsF0NzcjKxYAE9ooJqMpAE9nKci8xmwAZBGJLYcQQ1ommEaZgIAaMWC2gMGybQAAAAASUVORK5CYII=)!important;
            background-position: 0px 0px!important;
            width: 11px!important;
            height: 14px!important;

        }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1qhmfi1 x1r1pt67 x7at6mh xkde5i4"] i[style*="background-position: 0px -970px"],
        div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1qhmfi1 x1r1pt67 x7at6mh xkde5i4"] i[style*="background-position:0 -970px"] {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTA5LTIwVDIwOjU5OjA5KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wOS0yMFQyMTowMDowNyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wOS0yMFQyMTowMDowNyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjODM0ZWUwMS1lY2UzLTdjNGUtYTY0Ny0wMWJjYjdmZDk5YTQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiMTMzNGRiMi0wNTExLTYxNDYtODJlMS05ZmRmZGE1MjI5MDMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyZDUzZmYyYi01YjQyLTk4NDMtODdmZC00MDkwMzU1NThiNDAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJkNTNmZjJiLTViNDItOTg0My04N2ZkLTQwOTAzNTU1OGI0MCIgc3RFdnQ6d2hlbj0iMjAyNS0wOS0yMFQyMDo1OTowOSswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjODM0ZWUwMS1lY2UzLTdjNGUtYTY0Ny0wMWJjYjdmZDk5YTQiIHN0RXZ0OndoZW49IjIwMjUtMDktMjBUMjE6MDA6MDcrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6FbrpVAAAARklEQVQYlWNgQAMBAQH/QRhdHEMyPDz8Pwhj1QSTBAliY6OYChNExxjWoksgmwy2HpcJOE1GNwGr+5Al0DFWX+NjYwBckgBMlXehbCC67AAAAABJRU5ErkJggg==)!important;
            background-position: 0px 0px!important;
            width: 10px!important;
            height: 14px!important;

        }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [aria-label="Join group"] div [class="x9f619 x1n2onr6 x1ja2u2z x193iq5w xeuugli x6s0dn4 x78zum5 x2lah0s xsqbvy7 xb9jzoj"]:nth-child(1),
        div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [aria-label="Joined"] div [class="x9f619 x1n2onr6 x1ja2u2z x193iq5w xeuugli x6s0dn4 x78zum5 x2lah0s xsqbvy7 xb9jzoj"]:nth-child(1),
            div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [aria-label="Joined"] div [class="x9f619 x1n2onr6 x1ja2u2z x193iq5w xeuugli x6s0dn4 x78zum5 x2lah0s xsqbvy7 xb9jzoj"]:nth-child(3) {
                display: none;

            }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [aria-label="Join group"] div [class="x9f619 x1n2onr6 x1ja2u2z x193iq5w xeuugli x6s0dn4 x78zum5 x2lah0s xsqbvy7 xb9jzoj"]:nth-child(2) {
        margin: 0px;
        padding: 2px 6px;

    }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli x11lfxj5 x135b78x xjkvuk6 x1iorvi4"]:nth-child(3),
        div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli x11lfxj5 x135b78x xjkvuk6 x1iorvi4"]:nth-child(4) {
            padding: 0px;

        }

    div [class="x78zum5 xdt5ytf x1n2onr6 xat3117 xxzkxad"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] {
        margin-inline-start: 0px;
        margin-inline-end: 0px;

    }

    div [class="ThirdColumnWrapper"] div [class="x2lah0s xyamay9 xv54qhq x1l90r2v xf7dkkf"] {
        padding: 0px;

    }

    ul[class="SettingsDropdownMenu"] a[class="SettingsMenuListItem"]:hover,
        ul[class="SortingOptionsDropdown"] a[class="SortingMenuListItem"]:hover {
            background: rgb(59, 89, 152);

        }

    ul[class="SettingsDropdownMenu"] a[class="SettingsMenuListItem"]:hover span[class="SettingsListItemText"],
        ul[class="SeeMoreButtonDropdown"] a[class="SeeMoreDropdownListItem"]:hover span[class="SeeMoreDropdownText"] {
            color: #fff!important;

        }

    div [class="x1y1aw1k"] div [class="x1n2onr6"]:nth-child(2),
        div [class="x1y1aw1k"] div [class="x1n2onr6"]:nth-child(3) {
            display: none;

        }

    ul[class="SeeMoreButtonDropdown"] a:hover {
        background: rgb(59, 89, 152);

    }

    div [class="x9f619 x1ja2u2z x6ikm8r x10wlt62 x1n2onr6"] {
        overflow: visible;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z xhb22t3 x11xpdln x1jrttnq"] {
        display: none;

    }

    div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1l90r2v x1ve1bff"],
        div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1ve1bff xvo6coq x2lah0s"] {
            background: none;
            box-shadow: none;

        }

    div [class="x78zum5 x1a02dak x165d6jo x1lxpwgx x9otpla x1ke80iy"] div[class="xdwrcjd x2fvf9 x1xmf6yo x1w6jkce xusnbm3"]:last-child {
        display: flex;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1l90r2v x1ve1bff"] {
        z-index: 1;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x6s0dn4 x78zum5 xdt5ytf x193iq5w"] {
        overflow: visible;
        z-index: 0;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k xf7dkkf xv54qhq xqdwrps x16i7wwg x1y5dvz6"] div [aria-orientation="horizontal"] {
        visibility: hidden;
        height: 0px;
        width: 0px;

    }

    *[class*="fb-dark-mode"] ul[class="SettingsDropdownMenu"],
        *[class*="fb-dark-mode"] ul[class="SeeMoreButtonDropdown"] {
            background: #252728!important;

        }

    *[class*="fb-dark-mode"] ul[class="SettingsDropdownMenu"] a span,
        *[class*="fb-dark-mode"] ul[class="SeeMoreButtonDropdown"] a span {
            color: #7083b3!important;

        }

    *[class*="fb-dark-mode"] div [class="TabContainer"] i {
        filter: brightness(0.3);

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x7wzq59"] div > :first-child div [class="x1yztbdb"]:first-child {
        display: none;

    }

    i[class="ProfileFollowersIcon"] a {
        font-size: 30px!important;
        font-weight: bold!important;
        font-family: helvetica, arial, sans-serif!important;
        font-style: normal;
        color: rgb(28, 42, 71);
        margin: 17px 0px 17px;
        display: flow;
        position: relative;
        text-align: center;

    }

    span[class="FriendsButton"] a {
        display: inline-block;
        height: 17px;
        vertical-align: top;
        color: rgb(153, 153, 153);
        padding-left: 3px;

    }

    div [role="banner"] div [class="x9f619 x1s65kcs x1o0tod x16xn7b0 xixxii4 x13vifvy xj35x94 xhtitgo xkreb8t"],
        div [role="banner"] div [class="x9f619 x1s65kcs x1o0tod x16xn7b0 xixxii4 x13vifvy xj35x94 xhtitgo xkreb8t"] {
            display: none;

        }

    *[class*="fb-dark-mode"] div [class="MoreButtonWrapper"] div [class="SeeMoreIcon"] {
        color: #7083b3!important;

    }

    div [class="TabContainer"] img[class="ClonedPhoto"] {
        border-radius: 0px;
        width: 100%;
        height: 100%;
        object-fit: cover;

    }

    div [class="TabContainer"] img[class="ClonedFriends"] {
        border-radius: 0px;
        width: 37px;
        height: 37px;
        display: block;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] {
        margin-left: 40px;

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1ve1bff xvo6coq x2lah0s"],
        div [aria-label="Event Permalink"] div [class="x78zum5 xdt5ytf x1wsgfga x9otpla"] div[class="x1e56ztr x1xmf6yo"]:nth-child(2),
            div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x13a6bvl x6s0dn4 xozqiw3 x1q0g3np x1lxpwgx x165d6jo x4vbgl9 x1rdy4ex"] div [class="x1ey2m1c xtijo5x x1o0tod x47corl x10l6tqk x13vifvy x19991ni x1dhq9h x1fmog5m xu25z0z x140muxe xo1y3bh x1hc1fzr x1mq3mr6 x1wpzbip"] {
                display: flex!important;

            }

    div [aria-label="Event Permalink Left Rail"],
        div [aria-label="Event Permalink"] div [class="x9f619 x1n2onr6 x1ja2u2z x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x78zum5 xdt5ytf"],
            div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1ve1bff"],
                div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1ve1bff xvo6coq x2lah0s"],
                    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1l90r2v x1ve1bff"] {
                        display: none!important;

                    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x2lah0s x1n2onr6 x1qjc9v5 x78zum5 xl56j7k x15zctf7 x1a02dak x9otpla x1w5wx5t x1wsgfga x1qfufaz"] {
        max-width: fit-content;

    }

    div [aria-label="Event Permalink"] div [class="EventsPhotoSectionContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xyri2b x18d9i69 x1c1uobl xqtp20y x1n2onr6 xh8yej3 x6ikm8r x10wlt62 x1jm3axb"] {
        padding-bottom: 5px!important;

    }

    div [aria-label="Event Permalink"] .xric181,
        div [aria-label="Event Permalink"] .xric181 div,
            div [aria-label="Event Permalink"] .xric181 a,
                div [aria-label="Event Permalink"] .xric181 img {
                    height: 119px!important;
                    max-width: 180px!important;
                    right: 0px!important;
                    padding: 0px!important;
                    object-fit: cover;

                }

    div [class="x9f619 x1n2onr6 x1ja2u2z xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x78zum5 x1t2pt76"] .x7ep2pv {
        right: -10px!important;

    }

    div [aria-label="Event Permalink"] {
        background: #fff;

    }

    *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] {
        background: #252728;

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh xnp8db0 x1d1medc x7ep2pv x1xzczws"] {
        max-width: 244px!important;
        padding-right: 20px;
        border-right: 1px solid rgb(204, 204, 204);

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib xuk3077 xozqiw3 x1q0g3np xpdmqnj x1g0dm76 xyamay9 x1w5wx5t x1qfufaz x1wsgfga x9otpla"] span[class="html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs"],
        div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib xuk3077 xozqiw3 x1q0g3np xpdmqnj x1g0dm76 xyamay9 x1w5wx5t x1qfufaz x1wsgfga x9otpla"] span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6 xg8j3zb"] {
            font-size: 16px;

        }

    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib xuk3077 xozqiw3 x1q0g3np xpdmqnj x1g0dm76 xyamay9 x1w5wx5t x1qfufaz x1wsgfga x9otpla"] span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1j85h84"] {
        font-size: 11px;
        line-height: 7px;
        margin-left: -7px;
        color: rgb(59, 89, 152);
        overflow: visible;

    }

    div [aria-label="Event Permalink"] div [class="x1n2onr6 x1ja2u2z x1jx94hy xw5cjc7 x1dmpuos x1vsv7so xau1kf4 x9f619 xh8yej3 x6ikm8r x10wlt62 xquyuld"] {
        box-shadow: none!important;

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib xuk3077 xozqiw3 x1q0g3np xpdmqnj x1g0dm76 xyamay9 x1w5wx5t x1qfufaz x1wsgfga x9otpla"] {
        padding-bottom: 16px;

    }

    div [aria-label="Event Permalink"] div [class="EventsGuestsSectionContainer"] div[class="x6s0dn4 x78zum5 xdt5ytf x1l90r2v xf159sx xmzvs34 xyamay9"] {
        flex-direction: row-reverse;
        height: fit-content;
        padding-left: 0px;
        padding-right: 5px;
        padding-top: 0px;
        padding-bottom: 0px;

    }

    div [aria-label="Event Permalink"] div [class="EventsGuestsSectionContainer"] div[class="x6s0dn4 x78zum5 xdt5ytf x1l90r2v xf159sx xmzvs34 xyamay9"] span {
        font-size: 11px;
        font-weight: bold;
        white-space: nowrap;
        color: rgb(59, 89, 152);

    }

    div [aria-label="Event Permalink"] div [class="EventsGuestsSectionContainer"] div [class="xdk7pt"] {
        height: 0px;
        width: 4px;

    }

    div [aria-label="Event Permalink"] div [class="html-div xdj266r x14z9mp xat24cr xexx8yu xyri2b x18d9i69 x1c1uobl x13fj5qh"]:last-child {
        display: none;

    }

    div [aria-label="Event Permalink"] div [class="x7wzq59"] div [class="html-div xuk3077 x1q0q8m5 x1qhh985 x18b5jzi x10w94by x1t7ytsu x14e42zd x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x14z9mp x1lziwak xdj266r x2lwn1j xeuugli x1l90r2v xv54qhq xf7dkkf x1iorvi4 x1n2onr6 x1ja2u2z"] {
        margin-bottom: 5px;
        background-color: rgb(242, 242, 242);
        border-top-color: rgb(226, 226, 226);
        margin-left: 0px;
        border-width: 1px medium medium;
        border-style: solid none none;
        padding: 4px 6px 5px;
        height: 24px;

    }

    *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] div [class="x7wzq59"] div [class="html-div xuk3077 x1q0q8m5 x1qhh985 x18b5jzi x10w94by x1t7ytsu x14e42zd x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x14z9mp x1lziwak xdj266r x2lwn1j xeuugli x1l90r2v xv54qhq xf7dkkf x1iorvi4 x1n2onr6 x1ja2u2z"] {
        background: #333334!important;
        border-top: #222!important;

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="html-div xuk3077 x1q0q8m5 x1qhh985 x18b5jzi x10w94by x1t7ytsu x14e42zd x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x14z9mp x1lziwak xdj266r x2lwn1j xeuugli x1l90r2v xv54qhq xf7dkkf x1iorvi4 x1n2onr6 x1ja2u2z"] {
        display: none;

    }

    div [aria-label="Event Permalink"] div [class="html-div xdj266r x14z9mp x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1yztbdb"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xyri2b x1c1uobl x1l90r2v xyamay9"] {
        border-top: 1px solid rgb(204, 204, 204);

    }

    div [aria-label="Event Permalink"] div [class="html-div xdj266r x14z9mp x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1yztbdb"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xyri2b x1c1uobl x1l90r2v xyamay9"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] svg {
        height: 16px!important;
        width: 16px!important;
        color: #c0bfbf!important;

    }

    div [aria-label="Event Permalink"] div [aria-label="Interested"] span,
        div [aria-label="Event Permalink"] div [aria-label="Going"] span {
            font-size: 11px;

        }

    div [aria-label="Event Permalink"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xf159sx xmzvs34 xwib8y2 x1y1aw1k"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen x1xlr1w8 x1a1m0xk x1yc453h"] {
        font-size: 13px;
        font-weight: normal;
        color: rgb(59, 89, 152);

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib xuk3077 xozqiw3 x1q0g3np xpdmqnj x1g0dm76 xyamay9 x1w5wx5t x1qfufaz x1wsgfga x9otpla"] div [class="x1e56ztr x1xmf6yo"]:last-child {
        display: flex;
        flex-direction: row-reverse;

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib xuk3077 xozqiw3 x1q0g3np xpdmqnj x1g0dm76 xyamay9 x1w5wx5t x1qfufaz x1wsgfga x9otpla"] div [class="x1e56ztr x1xmf6yo"]:last-child span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h"] {
        font-size: 11px;
        overflow: visible;
        width: -webkit-fill-available;

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib xuk3077 xozqiw3 x1q0g3np xpdmqnj x1g0dm76 xyamay9 x1w5wx5t x1qfufaz x1wsgfga x9otpla"] div [role="listitem"] div {
        padding: 0px;

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib xuk3077 xozqiw3 x1q0g3np xpdmqnj x1g0dm76 xyamay9 x1w5wx5t x1qfufaz x1wsgfga x9otpla"] div [role="listitem"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] {
        padding-left: 5px;
        padding-right: 5px;

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib xuk3077 xozqiw3 x1q0g3np xpdmqnj x1g0dm76 xyamay9 x1w5wx5t x1qfufaz x1wsgfga x9otpla"] div [role="listitem"] div svg {
        width: 12px!important;
        height: 12px!important;

    }

    div [aria-label="Event Permalink"] div [class="EventsGuestsSectionContainer"] div [role="list"] {
        height: 35px;
        min-width: 184px;
        padding: 0px;
        margin-top: 10px;
        margin-bottom: 20px;
        transform: translate(-180px, 10px);
        overflow: hidden;

    }

    div [aria-label="Event Permalink"] div [class="EventsGuestsSectionContainer"] div [role="listitem"] {
        height: 32px;
        margin-left: 2px;

    }

    div [aria-label="Event Permalink"] div [class="EventsGuestsSectionContainer"] div [role="listitem"] div [class="x6s0dn4 x1q0q8m5 x1qhh985 x18b5jzi x10w94by x1t7ytsu x14e42zd x1c9tyrk xeusxvb x1pahc9y x1ertn4p x13fuv20 x972fbf x9f619 x78zum5 xdt5ytf x1iyjqo2 xs83m0k xl56j7k xat24cr x14z9mp x1lziwak xdj266r x2lwn1j xeuugli x6ikm8r x10wlt62 x18d9i69 xyri2b x1c1uobl xexx8yu x1n2onr6 x1ja2u2z x1v9usgg x6jxa94"] {
        display: none;

    }

    div [aria-label="Event Permalink"] div [class="x7wzq59"] div [class="html-div x14z9mp x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1yztbdb xw7yly9"],
        div [aria-label="Event Permalink"] div [class="x7wzq59"] div [class="html-div xat24cr xexx8yu xyri2b x18d9i69 x1c1uobl x14nfmen xjm9jq1 xyqm7xq x1ys307a x1xmf6yo"] {
            display: none;

        }

    div [aria-label="Event Permalink"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x78zum5 xng8ra xh8yej3"] div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np x14ldlfn x1b1wa69 xws8118 x5fzff1 x972fbf x10w94by x1qhh985 x14e42zd x9f619 xpdmqnj x1g0dm76 x1qhmfi1 x1r1pt67"] div [class="x9f619 x1n2onr6 x1ja2u2z x193iq5w xeuugli x6s0dn4 x78zum5 x2lah0s xsqbvy7 xb9jzoj"]:first-child {
        display: none;
        margin: 0px;

    }

    div [aria-label="Event Permalink"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x78zum5 xng8ra xh8yej3"] {
        justify-content: flex-end;

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xyri2b x1c1uobl x1l90r2v xyamay9"] div [class="x78zum5 xdt5ytf xz62fqu x16ldp7u"] span,
        div [aria-label="Event Permalink"] div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xyri2b x1c1uobl x1l90r2v xyamay9"] div [class="x78zum5 xdt5ytf xz62fqu x16ldp7u"] div,
            div [aria-label="Event Permalink"] div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xyri2b x1c1uobl x1l90r2v xyamay9"] div [class="x78zum5 xdt5ytf xz62fqu x16ldp7u"] a {
                font-weight: normal;

            }

    *[class*="fb-dark-mode"] div [class="EventsPhotoSectionContainer"],
        *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh xnp8db0 x1d1medc x7ep2pv x1xzczws"],
            *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] div [class="html-div xdj266r x14z9mp x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1yztbdb"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xyri2b x1c1uobl x1l90r2v xyamay9"] {
                border-color: #393939!important;

            }

    *[class*="fb-dark-mode"] div [class="EventsGuestsLine"] {
        background: #393939!important;

    }

    *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] div [class="x78zum5 xdt5ytf x4cne27 xifccgj"] span {
        color: #e2e5e9!important;

    }

    *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] div [class="EventsButton"] {
        color: #e8eaee!important;
        border: 1px solid #312f2b!important;

    }

    *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] div [class="EventsGuestsSectionContainer"] div[class="x6s0dn4 x78zum5 xdt5ytf x1l90r2v xf159sx xmzvs34 xyamay9"] span,
        *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib xuk3077 xozqiw3 x1q0g3np xpdmqnj x1g0dm76 xyamay9 x1w5wx5t x1qfufaz x1wsgfga x9otpla"] span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1j85h84"],
            *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xf159sx xmzvs34 xwib8y2 x1y1aw1k"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen x1xlr1w8 x1a1m0xk x1yc453h"] {
                color: #7083b3;

            }

    ` );

})();