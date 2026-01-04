// ==UserScript==
// @name         91Huayi Get Answer
// @namespace    https://yinr.cc/
// @version      0.1.0
// @description  Get Exam Answer for 91 Huayi
// @author       Yinr
// @license      MIT
// @match        https://zppx.91huayi.com/exercise/ExerciseExam/HomeWorkIndex*
// @icon         https://zppx.91huayi.com/favicon.ico
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/548540/91Huayi%20Get%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/548540/91Huayi%20Get%20Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getAnswer = async () => {
        const search = new URLSearchParams(document.location.search)
        const learn_courseware_id = search.get('learn_courseware_id')
        const url = new URL('GetHomeWorkList', document.location.href)
        url.searchParams.set('learn_courseware_id', learn_courseware_id)
        url.searchParams.set('_', Number(new Date()).toString())
        const test = await fetch(url).then(res => res.json())
        console.log(test)
        /**
         * @type {{name: string, questions: string[]}[]}
         */
        const answer = test.map(testGroup => ({name: testGroup.question_type_name, questions: testGroup.questions.map((item, i) => `第 ${i + 1} 题： ${item.answer}`)}))
        console.log(answer.map(g => `${g.name}\n${g.questions.join('\n')}`).join('\n'))
        return answer
    }

    const addAnswerBtn = () => {
        const container = document.querySelector("body > div.box > div.test_rightbox")
        const div = document.createElement('div')
        div.classList.add('right_part01')
        div.id = 'getAnswer'
        container.append(div)
        const span = document.createElement('span')
        span.classList.add('right_part01_span')
        div.append(span)
        /**
         * @param {string} text
         * @param {string[]} className
         */
        const appendAnswerText = (text, ...className) => {
            const span = document.createElement('span')
            span.classList.add('right_part01_span')
            if (className.length > 0) {
                span.classList.add(...className)
            }
            span.innerText = text
            div.append(span)
        }
        const btn = document.createElement('button')
        btn.innerText = '获取答案'
        btn.style.cursor = 'pointer'
        btn.addEventListener('click', async () => {
            const ansClass = 'get-answer'
            div.querySelectorAll(`span.${ansClass}`).forEach(el => {
                el.remove()
            });
            const answer = await getAnswer()
            for (let group of answer) {
                appendAnswerText(group.name, ansClass)
                group.questions.forEach(ques => {
                    appendAnswerText(ques, ansClass)
                });
            }
        })
        span.append(btn)
        return appendAnswerText
    }

    addAnswerBtn()
    GM_registerMenuCommand('获取答案', () => { getAnswer() })
})();