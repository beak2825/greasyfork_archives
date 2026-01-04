// ==UserScript==
// @name         Automatic HSE mark setter v2.0
// @namespace    http://tampermonkey.net/
// @version      2025-11-11
// @description  Set HSE marks automatically
// @author       BigRedEye
// @match        https://my.hse.ru/marketplace/*/journal/statements/*
// @match        https://exam.hse.ru/exam-sheets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hse.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555515/Automatic%20HSE%20mark%20setter%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/555515/Automatic%20HSE%20mark%20setter%20v20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getTable() {
        return document.querySelector('.t-content > table')
    }

    function getTableBody() {
        return document.querySelector('.t-content > table > tbody')
    }

    function parseCSVScores(text) {
        let scores = {}

        let lines = text.split('\n')
        for (const line of lines) {
            if (line == "") {
                continue
            }

            let kv = line.split('\t')
            if (kv.length != 2) {
                throw new Error(`Неожиданная строка "${line}", ожидается ровно один \\t`)
            }
            let name = kv[0]
            let score = parseInt(kv[1])
            console.log(name, '->', score, '(', kv[1], ')')
            if (scores.hasOwnProperty(name)) {
                throw new Error(`Студент ${name} встречается больше одного раза`);
            }
            scores[name] = score
        }

        return scores
    }

    async function fillTable(text) {
        var unknownUsers = [];
        var markCount = 0;
        var totalCount = 0;

        let scores = parseCSVScores(text)
        let table = getTable()
        for (const row of table.rows) {
            totalCount += 1;

            let name = row.children[4].innerText
            let score = scores[name]
            if (score === undefined) {
                console.log('Unknown user', name)
                unknownUsers.push(name)
                continue
            }

            console.log('Set score', score, 'for user', name)

            let clickEvent = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                clientX: 150,
                clientY: 150
            });

            let but = row.children[6].children[0].children[0].children[score]
            but.dispatchEvent(clickEvent)
            but.click()

            await sleep(500)
            markCount += 1;
        }

        if (unknownUsers.length == 0) {
            alert(`Выставлено ${markCount} оценок. Из-за технических ограничений часть оценок могла не записаться на сервер. Пожалуйста, обновите страницу и проверьте, что все оценки проставлены. При необходимости повторите процедуру.`)
        } else {
            alert(`Внимание: не найдено ${unknownUsers.length} пользователей! Проверьте имена студентов в консоли разработчика.\n\nВыставлено ${markCount}/${totalCount} оценок. Из-за технических ограничений часть оценок могла не записаться на сервер. Пожалуйста, обновите страницу и проверьте, что все оценки проставлены. При необходимости повторите процедуру.`)
        }
    }

    function loadFile() {
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = async function(_) {
            let text = await input.files[0].text();
            try {
                await fillTable(text)
            } catch (e) {
                console.log(e)
                alert(`${e.message}! Оценки не будут проставлены. Пожалуйста, поправьте исходные данные и повторите ещё раз`)
            }
        };
        input.click();
    }

    function parseHTML(html) {
        var t = document.createElement('template');
        t.innerHTML = html;
        return t.content;
    }

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function downloadStudentNames() {
        let body = ""
        let table = getTable()
        for (const row of table.rows) {
            body += row.children[4].innerText
            body += "\n"
        }
        download("students.txt", body)
    }

    function downloadStudentScores() {
        let body = ""
        let table = getTableBody()
        for (const row of table.rows) {
            body += row.children[4].innerText
            body += "\t"

            let score = -1
            for (let i = 0; i <= 10; i++) {
                if (row.children[6].children[0].children[0].children[i].classList.contains("active")) {
                    score = i
                }
            }
            body += score.toString()
            body += "\t"
            body += row.children[5].innerText
            body += "\n"
        }
        download("students.tsv", body)
    }

    setTimeout(function() {
        let tooltip = document.querySelectorAll('.sheet-tab-button-container > .h-end')[0]

        var button = parseHTML(`<button tuiappearance="" tuiicons="" appearance="base-white-blue" size="l" tuibutton="" type="button" class="indent-left ng-star-inserted" data-appearance="base-white-blue" data-size="l">
  <span>
    Установить оценки из TSV
  </span>
</button>`);
        button.childNodes[0].onclick = loadFile

        tooltip.appendChild(button)

        var button2 = parseHTML(`<button tuiappearance="" tuiicons="" appearance="base-white-blue" size="l" tuibutton="" type="button" class="indent-left ng-star-inserted" data-appearance="base-white-blue" data-size="l">
  <span>
    Скачать оценки студентов
  </span>
</button>`);
        button2.childNodes[0].onclick = downloadStudentScores

        tooltip.appendChild(button2)
    }, 1000)
})();