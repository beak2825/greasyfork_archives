// ==UserScript==
// @name         SC
// @namespace    LA
// @license      MIT
// @version      2.0.1
// @description  cheese
// @author       Azie
// @match        https://app.subject.com/lti/enrollments/*
// @match        https://app.time4learning.com/App/Admin/ParentAdminV3/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=subject.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564153/SC.user.js
// @updateURL https://update.greasyfork.org/scripts/564153/SC.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const API_URL = "https://answer-keys-api.azie.workers.dev/";

    const api = {};

    api.get = async (url) => {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        return response.json();
    };

    api.post = async (url, data) => {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    };

    api.delete = async (url) => {
        const response = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        return response.json();
    };

    window.apiCleanup = () => {
        api.delete(API_URL);
    };

    document.waitFor = (selector, index = 0) => {
        return new Promise((resolve, _) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > index) return resolve(elements[index]);

            const observer = new MutationObserver((_, observer) => {
                const found = document.querySelectorAll(selector);
                if (found.length > index) {
                    observer.disconnect();
                    resolve(found[index]);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    };

    const docStyle = `
        .userscriptBtn {
            background-color: rgba(0,0,0,0);
            border: 0.8px solid rgb(84, 90, 100);
            color: rgb(255, 255, 255);
            height: 40px;
            min-width: 80px;
            padding: 0 16px;
            border-radius: 5px;
            box-sizing: border-box;
            font-size: 14px;
            font-weight: 600;
            font-family: "Suisse Intl", sans-serif;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.2s, border-color 0.2s;
        }

        .userscriptBtn:hover {
            background-color: rgb(48, 50, 54);
            border-color: rgb(48, 50, 54);
        }

        .userscriptTextbox {
            box-sizing: border-box;
            height: 28px;
            padding: 2px 6px;

            border-radius: 6px;
            border-width: 1px;
            border-style: solid;
            border-color: #ccc;
            outline: none;

            font-family: inherit;
            font-size: 14px;
            color: #000;
        }

        .userscriptSpinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .userscriptBtn.loading {
            pointer-events: none;
            opacity: 0.7;
        }

        .userscriptBtn.loading:hover {
            cursor: not-allowed;
        }
    `;

    const exportAK = () => {
        const data = {};

        const url = new URL(window.location.href);

        const regex = /\/lessons\/([^/]+)/;
        const lessonId = url.pathname.match(regex)?.[1];

        const form = document.querySelector("form");

        if (!form) return { success: false };

        const questions = Array.from(form.firstElementChild.children);

        questions.forEach((question) => {
            const questionId = question.id;
            const choices = question.querySelector(".css-0");

            const aChoices = choices.lastElementChild.lastElementChild;
            const answers = aChoices.querySelectorAll(":scope > div");

            let qChoices = choices.firstElementChild;
            if (qChoices.getAttribute("role") === "radiogroup") {
                qChoices = qChoices.firstElementChild;
            }

            data[questionId] = [];

            answers.forEach((answer) => {
                const aIndex = Array.from(aChoices.children).indexOf(answer);
                const input = qChoices.children[aIndex].querySelector("input");

                if (!input) return;

                data[questionId].push(input.value);
            });
        });

        return api.post(API_URL + lessonId, data);
    };

    const importAK = () => {
        const url = new URL(window.location.href);

        const regex = /\/lessons\/([^/]+)/;
        const lessonId = url.pathname.match(regex)?.[1];

        return api
            .get(API_URL + lessonId)
            .then((data) => {
                const form = document.querySelector("form");

                if (!form) throw new Error("Form not found");

                for (const [questionId, answers] of Object.entries(data)) {
                    const question = form.querySelector(`#${questionId}`);

                    if (!question) continue;

                    answers.forEach((answerId) => {
                        const answer = question.querySelector(`input[value="${answerId}"]`);
                        if (answer && !answer.checked) answer.click();
                    });
                }
            })
            .finally(() => {
                api.post(API_URL + lessonId, {});
            });
    };

    const initParent = async () => {
        const hideOnPrint = await document.waitFor(".hide-on-print");
        const exportBtn = document.createElement("button");
        exportBtn.style.marginRight = "5px";
        exportBtn.innerText = "Export";
        exportBtn.className = "userscriptBtn";

        hideOnPrint.insertBefore(exportBtn, hideOnPrint.children[1]);
        exportBtn.addEventListener("click", async () => {
            const reset = () => {
                exportBtn.classList.remove("loading", "success", "error");
                exportBtn.innerText = "Export";
            };

            exportBtn.classList.add("loading");
            exportBtn.innerHTML = `<div class="userscriptSpinner"></div>`;

            try {
                const result = await exportAK();

                if (result.success) {
                    exportBtn.classList.remove("loading");
                    exportBtn.classList.add("success");
                    exportBtn.innerText = "✓ Exported";
                } else {
                    throw new Error("Export failed");
                }
            } catch (e) {
                exportBtn.classList.remove("loading");
                exportBtn.classList.add("error");
                exportBtn.innerText = "✕ Failed";
            }

            setTimeout(reset, 2000);
        });
    };

    const initStudent = async () => {
        await document.waitFor("form");

        const hideOnPrint = await document.waitFor("#work-sample-element-assessment-modal > :first-child > :first-child");
        const importBtn = document.createElement("button");
        importBtn.style.marginRight = "5px";
        importBtn.innerText = "Import";
        importBtn.className = "userscriptBtn";

        hideOnPrint.insertBefore(importBtn, hideOnPrint.children[2]);
        importBtn.addEventListener("click", async () => {
            const reset = () => {
                importBtn.classList.remove("loading", "success", "error");
                importBtn.innerText = "Import";
            };

            importBtn.classList.add("loading");
            importBtn.innerHTML = `<div class="userscriptSpinner"></div>`;

            try {
                await importAK();
            } catch (e) {
                importBtn.classList.remove("loading");
                importBtn.classList.add("error");
                importBtn.innerText = "✕ Failed";
                setTimeout(reset, 2000);
                return;
            }

            importBtn.classList.remove("loading");
            importBtn.classList.add("success");
            importBtn.innerText = "✓ Imported";

            setTimeout(reset, 2000);
        });
    };

    const initParentAdmin = async () => {
        const topbar = await document.waitFor("#main-header-1 > div > div > div");
        const search = document.createElement("input");
        search.type = "url";
        search.name = "answer-key-search";
        search.placeholder = "Assignment link…";
        search.className = "userscriptTextbox";

        search.style.alignSelf = "center";
        search.style.flex = "0 0 33.3%";
        search.style.minWidth = "0";

        topbar.insertBefore(search, topbar.children[1]);

        Array.from(topbar.children).forEach((child) => {
            child.style.maxWidth = "33.3%";
        });

        search.addEventListener("focus", () => {
            search.value = "";
        });

        search.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();

                const url = search.value.trim();
                if (!url) return;

                const parsedUrl = new URL(url);
                const pathname = parsedUrl.pathname;

                const regex = /\/courses\/([^\/]+)\/lessons\/([^\/]+)/;
                const match = pathname.match(regex);

                const courseId = match[1];
                const lessonId = match[2];

                const newUrl = `https://app.time4learning.com/App/Admin/ActivityPlanner/SubjectLtiParentPreview.ashx?type=activity&activity=${lessonId.toUpperCase()}&grade=0&ltiurl=https://app.subject.com/courses/${courseId}/lesson/${lessonId}&ep=lessonplans-answer-key`;

                window.open(newUrl, "_blank");
            }
        });
    };

    const host = window.location.hostname;
    const style = document.createElement("style");
    style.textContent = docStyle;

    document.head.appendChild(style);

    if (host.includes("time4learning.com")) {
        initParentAdmin();
    } else if (host.includes("subject.com")) {
        const ltiLaunchTab = new URLSearchParams(location.search).get("ltiLaunchTab");

        if (ltiLaunchTab === "lesson") initStudent();
        else initParent();
    }
})();
