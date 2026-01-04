// ==UserScript==
// @name         ExamDL
// @namespace    http://tampermonkey.net/
// @version      2025-12-04
// @description  Export your exam submissions
// @author       PsychedelicPalimpsest
// @match        https://osu.instructure.com/courses/*/quizzes/*
// @match        https://osu.instructure.com/courses/*/modules
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @require      https://unpkg.com/client-zip@2.5.0/worker.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558663/ExamDL.user.js
// @updateURL https://update.greasyfork.org/scripts/558663/ExamDL.meta.js
// ==/UserScript==
 
 
(async function() {
    'use strict';


    function downloadJson(name, data) {
        let blob = new Blob([JSON.stringify(data)], {
            type: "application/json",
        });

        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
    }

    async function getSubmissions(course_id, quiz_id) {
        let req = await fetch(`https://osu.instructure.com/api/v1/courses/${course_id}/quizzes/${quiz_id}/submissions/`);
        let jso = await req.json();
        if (req.status != 200) {
            alert("Error: " + JSON.stringify(jso));
            throw "Shit";
        }
        return jso.quiz_submissions;
    }
    async function getSubmission(submission_id) {
        let req = await fetch(`https://osu.instructure.com/api/v1/quiz_submissions/${submission_id}/questions?include=quiz_question`)
        let jso = await req.json();
        if (req.status != 200) {
            alert("Error: " + JSON.stringify(jso));
            throw "Shit";
        }
        return jso;

    }



    async function getLastSubmission(course_id, quiz_id) {
        let subs = await getSubmissions(course_id, quiz_id);

        if (subs.length == 0) {
            alert("You must first submit the quiz!");
            throw 'Shit';
        }
        return await getSubmission(subs[subs.length - 1].id);

    }

    function onExportLastSubmission(course_id, quiz_id) {
        getLastSubmission(course_id, quiz_id).then(r => {
            downloadJson("submission.json", r);
        });
    }

    // https://osu.instructure.com/courses/195866/quizzes/1312570/history?version=1&headless=1
    async function getSubmissionHtml(course_id, quiz_id, version) {
        let req = await fetch(`https://osu.instructure.com/courses/${course_id}/quizzes/${quiz_id}/history?version=${version}&headless=1`);
        let dp = new DOMParser()

        return dp.parseFromString(await req.text(), "text/html")
    }


    async function attemptExport(course_id, quiz_id, noError) {
        let subs = await getSubmissions(course_id, quiz_id);

        if (subs.length == 0) {
            if (noError) return null;
            alert("You must first submit the quiz!");
            throw 'Shit';
        }


        let [sub_json, sub_html] = await Promise.all([
            getSubmission(subs[subs.length - 1].id),
            getSubmissionHtml(course_id, quiz_id, subs.length)
        ]);
        return sub_json.quiz_questions.map((question) => {
            let question_html = sub_html.querySelector(`div#question_${question.id} > div.text > div.answers`);

            switch (question.question_type) {

                case "multiple_choice_question":
                case "multiple_answers_question":
                case "true_false_question":
                    if (!question_html) break;
                    question.answers = question.answers.map((answer) => {
                        answer.is_correct = !!question_html.querySelector(`div.correct_answer#answer_${answer.id}`);
                        return answer;
                    });



                    break;



                default:
                    break;
            }
            return question;


        });



    }

    function onAttemptExport(course_id, quiz_id) {
        attemptExport(course_id, quiz_id).then((answers) => JSON.stringify(downloadJson(ENV.QUIZ.title + ".json", answers), null, 2));
    }

    function quizzes_page() {
        // Path of '/courses/COURSE_ID/quizzes/QUIZ_ID'

        let split = location.pathname.split("/quizzes/");

        let course_id = 1 * split[0].split("/")[split[0].split("/").length - 1];
        let quiz_id = 1 * split[1].split("/")[0];

        let header = document.querySelector("#quiz_title");
        let ref = header.querySelector("button.ally-add-tooltip");

        let btn = document.createElement("button");
        btn.classList.add("bux-button--small")
        btn.textContent = "Export last submission data";
        btn.onclick = onExportLastSubmission.bind(this, course_id, quiz_id);

        header.insertBefore(btn, ref)


        btn = document.createElement("button");
        btn.classList.add("bux-button--small")
        btn.textContent = "Attempt export with answers";
        btn.onclick = onAttemptExport.bind(this, course_id, quiz_id);


        header.insertBefore(btn, ref)
    }

    let downloadElem;

    function addToDownloadElem(text) {
        let p = document.createElement('span');
        p.textContent = text;
        downloadElem.appendChild(p);
        downloadElem.appendChild(document.createElement('br'));

        downloadElem.scrollTo(0, downloadElem.scrollHeight);
    }

    async function* getAllQuizzes(course_id) {
        const PER_PAGE = 10;

        for (let page = 1;; page++) {
            let req = await fetch(`https://osu.instructure.com/api/v1/courses/${course_id}/quizzes?per_page=${PER_PAGE}&page=${page}`);
            let jso = await req.json();
            if (req.status != 200) {
                alert("Error: " + JSON.stringify(jso));
                throw "Shit";
            }
            if (jso.length == 0) break;

            for (let item of jso) {
                yield item;
            }

        }
    }


    async function exportAll(course_id) {
        let files = [];

        for await (let quiz of getAllQuizzes(course_id)) {
            addToDownloadElem(`Starting ${quiz.title}`);

            let answer = await attemptExport(course_id, quiz.id, true);
            if (answer != null)
                files.push({
                    name: quiz.title + ".json",
                    input: JSON.stringify(answer, null, 2)
                });
        }




        let zipBlob = await downloadZip(files).blob();
        let a = document.createElement("a");
        a.href = URL.createObjectURL(zipBlob);
        a.download = "quizes.zip";
        a.click();
    }

    function onExportAll(course_id) {

        downloadElem.classList.add("active");
        downloadElem.textContent = "";


        addToDownloadElem("Starting quiz export!");

        exportAll(course_id).then(_ => {
            downloadElem.classList.remove("active");
        })

    }



    function modules_page() {
        document.head.innerHTML += `
        <style>
    .foldMenu{
        position: absolute;
        width: 100%;
        top: 0px;
        height: 0%;

         z-index: 1000;

        background-color: grey;
        color: white;

        overflow-x: hidden;
        overflow-y: scroll;

        transition: height 0.3s
    }
    .active.foldMenu{
        height: 40%;
        border: double;
    }
        </style>`;



        downloadElem = document.createElement("div");
        downloadElem.classList.add("foldMenu");
        downloadElem.setAttribute("tabindex", "-1"); // Don't mess with tab key
        document.body.insertBefore(downloadElem, document.body.children[0])

        let btn = document.createElement("button");
        btn.textContent = "Export all quizzes";
        btn.classList.add('btn');
        btn.onclick = onExportAll.bind(this, 1 * location.pathname.match(/\/courses\/(\d+)\/modules/)[1]);


        document.querySelector(".header-bar-right > div").appendChild(btn);
    }


    if (location.href.includes("/quizzes/")) quizzes_page();
    if (location.href.includes("/modules")) modules_page();




})();
