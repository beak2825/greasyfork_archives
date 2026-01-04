// ==UserScript==
// @name         华中科技大学实验室安全考试自动化答题
// @namespace    shiyi
// @version      1.0.1
// @description  实验室安全网上考试答案自动填充，支持单位：华中科技大学
// @author       shiyi
// @match        http://labsafe.hust.edu.cn/redir.php?catalog_id=6&cmd=dati*
// @match        https://labsafe.hust.edu.cn/redir.php?catalog_id=6&cmd=dati*
// @require      https://greasyfork.org/scripts/391129-nuist-examsafety-question-bank/code/NUIST%20examsafety%20Question%20Bank.js?version=996976
// @run-at       document-end
// @grant        none
// @compatible   chrome
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/552149/%E5%8D%8E%E4%B8%AD%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%8C%96%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/552149/%E5%8D%8E%E4%B8%AD%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%8C%96%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var host = window.location.host;
    if (host != "10.66.100.207" && host != "172.26.0.150") {
        var questions = document.getElementsByClassName("shiti");
        var _question, question, index, answer;
        var notfounds = new Array(), dislocations = new Array();
        var notfound = 0, dislocation = 0;
        for (let i = 0, __qlength__ = questions.length; i < __qlength__; ++i) {
            _question = questions[i].children[0].textContent.split("\u3001");
            index = _question.shift();
            question = _question.join("\u3001").replace(/[^0-9A-Za-z\u4e00-\u9fff]/g, "").replace(/^(\u5224\u65ad|\u5355\u9009|\u591a\u9009)\u9898/, "");
            answer = findAnswer(question);
            var _text, _c, c, answers;
            var answered = false;
            if (answer != "") {
                answers = answer.split("\u000a");
                for (let choice = 0, __clength__ = questions[i].children[1].childElementCount; choice < __clength__; ++choice) {
                    var ipt = document.getElementById("ti_" + index + "_" + String(choice));
                    _text = ipt.parentNode.children[1].textContent.replace(/[\s\?]/g, "");
                    if (_text.length == 0) {
                        dislocations[dislocation++] = String(index);
                        questions[i].children[0].setAttribute("style", "color: red");
                    } else {
                        _c = _text.replace(/\./, "\u3001").replace(/\uff0e/, "\u3001").split("\u3001");
                        if (_c.length > 1) {
                            _c.shift();
                        }
                        c = _c.join("\u3001");
                        c = c.replace("\u6b63\u786e", "\u5bf9").replace("\u9519\u8bef", "\u9519");
                        for (let ai = 0, __alength__ = answers.length; ai < __alength__; ++ai) {
                            if (answers[ai] == c) {
                                ipt.click();
                                answered = true;
                                break;
                            }
                        }
                    }
                }
                if (!answered) {
                    notfounds[notfound++] = String(index);
                    questions[i].children[0].setAttribute("style", "color: red");
                }
            } else {
                notfounds[notfound++] = String(index);
                questions[i].children[0].setAttribute("style", "color: red");
            }
        }
        if (notfound > 0 || dislocation > 0) {
            if (notfound > 0) {
                alert("\u6b64\u9875\u9762\u5171\u6709" + String(notfound) + "\u9053\u9898\u672a\u80fd\u81ea\u52a8\u586b\u5145\uff1a" + notfounds.join("\u3001"));
            }
            if (dislocation > 0) {
                alert("\u6b64\u9875\u9762\u5171\u6709" + String(dislocation) + "\u9053\u9898\u7531\u4e8e\u9009\u9879\u9519\u4f4d\uff0c\u5df2\u9009\u62e9\u6b63\u786e\u4f46\u4e0d\u5f97\u5206\u9009\u9879\uff1a" + dislocations.join("\u3001"));
            }
        } else {
            var next = document.getElementsByClassName("nav")[0].children[0];
            if (next && next.value == "\u4e0b\u4e00\u9875") {
                next.click();
            } else {
                document.getElementsByClassName("nav")[0].children[1].click();
            }
        }
    } else {
        let Qs = new Array();
        let __QsLen__ = 0;
        if (document.getElementById("DataGridA")) {
            for (let i = 0, __Q__ = document.getElementById("DataGridA").children[0], __QLen__ = __Q__.childElementCount; i < __QLen__; ++i) {
                Qs[__QsLen__++] = __Q__.children[i];
            }
        }
        if (document.getElementById("DataGridB")) {
            for (let i = 0, __Q__ = document.getElementById("DataGridB").children[0], __QLen__ = __Q__.childElementCount; i < __QLen__; ++i) {
                Qs[__QsLen__++] = __Q__.children[i];
            }
        }
        if (document.getElementById("DataGridC")) {
            for (let i = 0, __Q__ = document.getElementById("DataGridC").children[0], __QLen__ = __Q__.childElementCount; i < __QLen__; ++i) {
                Qs[__QsLen__++] = __Q__.children[i];
            }
        }
        let notfounds = new Array();
        let notfound = 0;
        for (let i = 0; i < __QsLen__; ++i) {
            let t = Qs[i].children[0].children[0].children[0];
            let _Q = t.children[0].children[0].children[0].textContent.split("\u3001");
            let index = _Q.shift();
            let Q = _Q.join("\u3001").replace(/[^0-9A-Za-z\u4e00-\u9fff]/g, "");
            let A = findAnswer(Q);
            let As = A.split("\u000a");
            let Cs = t.children[1].children[0].children[0].children[0].children[0];
            let answered = false;
            for (let j = 0, __CsLen__ = Cs.childElementCount; j < __CsLen__; ++j) {
                let _C = Cs.children[j].children[1].textContent.replace(/\./, "\u3001").replace(/\uff0e/, "\u3001").split("\u3001");
                if (_C.length > 1) {
                    _C.shift();
                }
                let C = _C.join("\u3001");
                C = C.replace("\u6b63\u786e", "\u5bf9").replace("\u9519\u8bef", "\u9519");
                for (let k = 0, __AsLen__ = As.length; k < __AsLen__; ++k) {
                    if (C == As[k]) {
                        Cs.children[j].children[0].click();
                        answered = true;
                        break;
                    }
                }
            }
            if (!answered) {
                notfounds[notfound++] = String(index);
                t.children[0].children[0].children[0].setAttribute("style", "color: red");
            }
        }
        if (notfound > 0) {
            alert("\u6b64\u9875\u9762\u5171\u6709" + String(notfound) + "\u9053\u9898\u672a\u80fd\u81ea\u52a8\u586b\u5145\uff1a" + notfounds.join("\u3001"));
        }
    }
})();