// ==UserScript==
// @name         KhanHack
// @namespace    http://khan.dyntech.cc
// @version      7.2
// @description  Một sản phẩm chống làm bài tập về nhà cho những kẻ lười biếng. Đã thêm tính năng tự động điền đáp án.
// @author       DynTech & Gemini
// @match        *://*.khanacademy.org/*
// @oicon        https://dyntech.cc/favicon?q=khan.dyntech.cc
// @icon         https://cdn.dyntech.cc/r/khanhack.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549606/KhanHack.user.js
// @updateURL https://update.greasyfork.org/scripts/549606/KhanHack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function() {
    const originalFetch = window.fetch;

    // --- BẮT ĐẦU: CÁC HÀM TỰ ĐỘNG ĐIỀN ĐÁP ÁN ---

    // Hàm này giúp điền giá trị vào các ô input được quản lý bởi React
    function setReactInputValue(inputElement, value) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(inputElement, value);
        const event = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(event);
    }

    // Hàm chính để xử lý việc tự động điền
    function autoFillAnswer(widgetType, answer) {
        // Chỉ chạy nếu người dùng đã bật tính năng
        const autoFillEnabled = document.getElementById('autoFillToggle')?.checked;
        if (!autoFillEnabled) {
            return;
        }

        try {
            if (widgetType === 'radio') {
                // Đối với câu hỏi trắc nghiệm
                const choices = document.querySelectorAll('label > span');
                choices.forEach(choice => {
                    const choiceText = cleanLatexExpression(choice.textContent || "");
                    if (answer.includes(choiceText)) {
                        // Tìm input radio liên quan và click vào nó
                        const radioInput = choice.closest('label')?.querySelector('input[type="radio"]');
                        if (radioInput) {
                            radioInput.click();
                        }
                    }
                });
            } else if (widgetType === 'input-number' || widgetType === 'numeric-input' || widgetType === 'expression') {
                // Đối với câu hỏi nhập số hoặc biểu thức
                const inputFields = document.querySelectorAll('input[type="text"], input[type="number"]');
                // Giả định rằng ô input đầu tiên tìm thấy là ô cần điền
                if (inputFields.length > 0) {
                    // Nếu có nhiều đáp án, điền vào các ô tương ứng
                     if (Array.isArray(answer) && answer.length > 1 && inputFields.length >= answer.length) {
                        answer.forEach((ans, index) => {
                            setReactInputValue(inputFields[index], ans);
                        });
                    } else {
                        // Nếu chỉ có một đáp án
                        setReactInputValue(inputFields[0], Array.isArray(answer) ? answer[0] : answer);
                    }
                }
            }
        } catch (error) {
            console.error("Lỗi khi tự động điền đáp án:", error);
        }
    }

    // --- KẾT THÚC: CÁC HÀM TỰ ĐỘNG ĐIỀN ĐÁP ÁN ---


    // Kiểm tra container đã tồn tại chưa và khôi phục nếu nó bị thu nhỏ
    let mainContainer = document.getElementById('questionDataContainer');
    if (mainContainer) {
        if (mainContainer.classList.contains('minimized')) {
            mainContainer.classList.remove('minimized');
            document.getElementById('restoreButton').classList.remove('minimized');
            document.getElementById('minimizeButton').style.display = 'block';
        }
        return;
    }

    mainContainer = document.createElement('div');
    mainContainer.id = 'questionDataContainer';
    if (document.body) {
        document.body.appendChild(mainContainer);
    } else {
        window.addEventListener('DOMContentLoaded', () => document.body.appendChild(mainContainer));
    }

    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');
        #questionDataContainer { position: fixed; top: 10px; right: 10px; width: 300px; height: 500px; overflow-y: auto; background-color: #1a1a1a; border: 2px solid #131313; padding: 10px; z-index: 9999; font-family: Poppins, sans-serif; font-size: 12px; border-radius: .8vw; color: white; transition: all .3s ease; }
        #questionDataContainer::-webkit-scrollbar { width: .6vw; }
        #questionDataContainer::-webkit-scrollbar-track { background: #141414; }
        #questionDataContainer::-webkit-scrollbar-thumb { background-color: #24c39d; border-radius: 1vw; }
        #questionDataContainer.minimized { width: 67px; height: 38px; overflow: hidden; border-radius: 10px; padding: 0; }
        #minimizeButton { position: absolute; top: 5px; right: 5px; background-color: #333; color: white; border: none; border-radius: 5px; font-size: 12px; padding: 5px; cursor: pointer; font-family: Poppins, sans-serif; transition: all .3s ease; }
        #minimizeButton:hover { background-color: #444; }
        #questionDataContainer.minimized #khanHackHeader, #questionDataContainer.minimized #controlsContainer { opacity: 0; }
        #khanHackHeader { text-align: center; font-family: Poppins, sans-serif; margin-bottom: 0px; font-size: 28px; color: #fff; }
        #khanHackHeader span { color: #24c39d; }
        .question-div { margin-bottom: 10px; padding: 10px; border-radius: 5px; color: black; overflow: hidden; }
        .radio-div { background-color: #e0ffe0; } .expression-div { background-color: #fff0f0; } .dropdown-div { background-color: #f0f0ff; } .orderer-div { background-color: #f5f5dc; } .input-div { background-color: #ffefd5; } .plotter-div { background-color: #ffe4b5; } .no-support-div { background-color: #ffcccc; }
        #controlsContainer { display: flex; justify-content: space-around; align-items: center; margin: 10px 0; }
        #answerToggle, #refreshButton { padding: 5px; font-size: 14px; background-color: #333; color: white; border: 1px solid #444; cursor: pointer; border-radius: 5px; font-family: Poppins, sans-serif; font-weight: 400; transition: all .3s ease; }
        #answerToggle:hover, #refreshButton:hover { background-color: #444; }
        #autoFillContainer { display: flex; align-items: center; font-size: 14px; }
        #autoFillContainer input { margin-right: 5px; }
        #answerContainer { display: block; }
        #restoreButton { display: none; position: absolute; top: 5px; right: 5px; background-color: #333; color: white; border: none; border-radius: 5px; font-size: 12px; padding: 5px; cursor: pointer; font-family: Poppins, sans-serif; }
        #restoreButton.minimized { display: block; }
        img.img-ans { max-width: 100%; height: auto; border-radius: 5px; margin-top: 10px; }
    `;
    document.head.appendChild(style);

    const header = document.createElement('h1');
    header.id = 'khanHackHeader';
    header.innerHTML = 'Khan<span>Hack</span>';

    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'controlsContainer';

    const answerToggle = document.createElement('button');
    answerToggle.id = 'answerToggle';
    answerToggle.textContent = 'Ẩn Đáp Án';
    let answersVisible = true;

    const refreshButton = document.createElement('button');
    refreshButton.id = 'refreshButton';
    refreshButton.textContent = 'Làm Mới';

    const autoFillContainer = document.createElement('div');
    autoFillContainer.id = 'autoFillContainer';
    autoFillContainer.innerHTML = `<input type="checkbox" id="autoFillToggle" title="Tự động điền đáp án khi có thể"><label for="autoFillToggle">Tự động điền</label>`;

    const minimizeButton = document.createElement('button');
    minimizeButton.id = 'minimizeButton';
    minimizeButton.textContent = 'Thu Nhỏ';

    const restoreButton = document.createElement('button');
    restoreButton.id = 'restoreButton';
    restoreButton.textContent = 'Phục Hồi';

    const answerContainer = document.createElement('div');
    answerContainer.id = 'answerContainer';

    controlsContainer.appendChild(answerToggle);
    controlsContainer.appendChild(refreshButton);

    mainContainer.appendChild(minimizeButton);
    mainContainer.appendChild(header);
    mainContainer.appendChild(controlsContainer);
    mainContainer.appendChild(autoFillContainer);
    mainContainer.appendChild(answerContainer);
    mainContainer.appendChild(restoreButton);

    answerToggle.addEventListener('click', () => {
        answersVisible = !answersVisible;
        answerContainer.style.display = answersVisible ? 'block' : 'none';
        answerToggle.textContent = answersVisible ? 'Ẩn Đáp Án' : 'Hiện Đáp Án';
    });
    refreshButton.addEventListener('click', () => location.reload());
    minimizeButton.addEventListener('click', () => {
        mainContainer.classList.add('minimized');
        restoreButton.classList.add('minimized');
        minimizeButton.style.display = 'none';
    });
    restoreButton.addEventListener('click', () => {
        mainContainer.classList.remove('minimized');
        restoreButton.classList.remove('minimized');
        minimizeButton.style.display = 'block';
    });

    function decimalToFraction(decimal) { if (decimal === 0) return "0"; let negative = decimal < 0; decimal = Math.abs(decimal); let whole = Math.trunc(decimal); let fraction = decimal - whole; const gcd = (a, b) => b ? gcd(b, a % b) : a; const precision = 1000000; let numerator = Math.round(fraction * precision); let denominator = precision; let commonDenominator = gcd(numerator, denominator); numerator /= commonDenominator; denominator /= commonDenominator; let fractionString = numerator === 0 ? '' : `${Math.abs(numerator)}/${denominator}`; let result = whole !== 0 ? `${whole} ${fractionString}`.trim() : fractionString; if (negative && result) result = `-${result}`; if (whole === 0 && numerator !== 0) result = `${negative ? '-' : ''}${numerator}/${denominator}`; return result; }
    function replaceGraphieImage(content) { const imageRegex = /!\[.*?\]\(web\+graphie:\/\/cdn.kastatic.org\/ka-perseus-graphie\/([a-f0-9]+)\)/; const match = content.match(imageRegex); if (match && match[1]) { return `<img src="https://cdn.kastatic.org/ka-perseus-graphie/${match[1]}.svg" class="img-ans" />`; } return content; }
    function appendToGUI(content, questionType) { try { const div = document.createElement('div'); div.className = `question-div ${questionType}-div`; div.innerHTML = replaceGraphieImage(content); answerContainer.appendChild(div); } catch (error) { console.error("Không thể thêm nội dung vào GUI:", error); } }
    function cleanLatexExpression(expr) { if (typeof expr !== 'string') return expr; return expr.replace(/\\dfrac{(.+?)}{(.+?)}/g, '$1/$2').replace(/\\frac{(.+?)}{(.+?)}/g, '$1/$2').replace(/\\dfrac(\d+)(\d+)/g, '$1/$2').replace(/\\frac(\d+)(\d+)/g, '$1/$2').replace(/\\left\(/g, '(').replace(/\\right\)/g, ')').replace(/\\cdot/g, '*').replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\\\/g, '').replace(/\\,/g, '').replace(/\\sqrt{(.+?)}(.*?)/g, '√($1)').replace(/\\sqrt/g, '√').replace(/\\cos/g, 'cos').replace(/\\sin/g, 'sin').replace(/\\tan/g, 'tan').replace(/\\degree/g, '°').replace(/\\\[/g, '[').replace(/\\\]/g, ']').replace(/\$/g, ''); }

    window.fetch = function() {
        return originalFetch.apply(this, arguments).then(async (response) => {
            if (response.url.includes("/getAssessmentItem")) {
                try {
                    const clonedResponse = response.clone();
                    const jsonData = await clonedResponse.json();
                    const itemData = jsonData.data.assessmentItem.item.itemData;
                    const questionData = JSON.parse(itemData).question;

                    console.log('Toàn bộ dữ liệu câu hỏi:', questionData);

                    const combinedAnswersPerQuestion = {};
                    let numericInputAnswers = [];

                    Object.keys(questionData.widgets).forEach(widgetKey => {
                        const widget = questionData.widgets[widgetKey];
                        let answer = "Không có đáp án";

                        try {
                            if (widget.type === "input-number" || widget.type === "numeric-input") {
                                let answers = widget.options?.answers?.map(a => a.value) || [];
                                if (answers.length > 0) {
                                    numericInputAnswers.push(...answers);
                                    autoFillAnswer(widget.type, answers); // Tự động điền
                                }
                            } else if (widget.type === "grapher" || widget.type === "interactive-graph") {
                                if (widget.options?.correct?.coords) {
                                    const coords = widget.options.correct.coords.map(coord => `(${coord.join(", ")})`);
                                    appendToGUI(`Đồ thị: Tọa độ đúng: ${coords.join(" và ")}`, 'plotter');
                                }
                            } else if (widget.type === "label-image") {
                                appendToGUI("Không hỗ trợ hack cho bài toán này", 'no-support');
                            } else if (widget.type === "dropdown") {
                                if (widget.options?.choices) {
                                    answer = widget.options.choices.filter(c => c.correct).map(c => cleanLatexExpression(c.content));
                                    const questionContent = questionData.content;
                                    if (!combinedAnswersPerQuestion[questionContent]) combinedAnswersPerQuestion[questionContent] = [];
                                    combinedAnswersPerQuestion[questionContent].push(...answer);
                                }
                            } else if (widget.type === "expression") {
                                answer = widget.options.answerForms.filter(af => af.considered === "correct").map(af => cleanLatexExpression(af.value));
                                appendToGUI(`Biểu thức: Đáp án: ${JSON.stringify(answer, null, 2)}`, 'expression');
                                autoFillAnswer(widget.type, answer); // Tự động điền
                            } else if (widget.type === "orderer") {
                                if (widget.options?.correctOptions) {
                                    const correctOrder = widget.options.correctOptions.map(option => option.content);
                                    appendToGUI(`Sắp xếp: Thứ tự đúng: ${JSON.stringify(correctOrder, null, 2)}`, 'orderer');
                                }
                            } else if (widget.type === "radio") {
                                if (widget.options?.choices) {
                                    answer = widget.options.choices.filter(c => c.correct).map(c => cleanLatexExpression(c.content || "Không có đáp án nào ở trên"));
                                    appendToGUI(`Trắc nghiệm: Đáp án: ${answer.map(a => replaceGraphieImage(a)).join(', ')}`, 'radio');
                                    autoFillAnswer(widget.type, answer); // Tự động điền
                                }
                            } else if (widget.type === "plotter") {
                                const correctAnswers = widget.options?.correct || [];
                                appendToGUI(`Điểm dữ liệu: Đáp án: ${correctAnswers.join(", ")}`, 'plotter');
                            }
                        } catch (innerError) {
                            console.error("Lỗi khi xử lý widget:", widget, innerError);
                        }
                    });

                    if (numericInputAnswers.length > 0) {
                        appendToGUI(`Nhập số: Đáp án: [${numericInputAnswers.join(', ')}]`, 'input');
                    }

                    Object.keys(combinedAnswersPerQuestion).forEach(questionContent => {
                        const finalCombinedAnswers = combinedAnswersPerQuestion[questionContent];
                        appendToGUI(`Đáp án kết hợp: ${JSON.stringify(finalCombinedAnswers, null, 2)}`, 'dropdown');
                    });
                } catch (error) {
                    console.error('Không thể lấy dữ liệu đánh giá:', error);
                }
            }
            retur;
        }).catch((error) => {
            console.error("Lỗi mạng hoặc fetch:", error);
            return Promise.reject(error);
        });
    };
})();
})();
