// ==UserScript==
// @name         AtCoder JavaScript Tester
// @namespace    http://axtech.dev/
// @version      0.6.1
// @description  AtCoderでJavaScript・TypeScriptコードをテスト実行するためのユーザースクリプト
// @author       AXT-AyaKoto
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/554278/AtCoder%20JavaScript%20Tester.user.js
// @updateURL https://update.greasyfork.org/scripts/554278/AtCoder%20JavaScript%20Tester.meta.js
// ==/UserScript==
(async function () {
    'use strict';

    // config定数
    const TIMEOUT_BUFFER_RATE = 1.1; // タイムアウト判定のためのバッファ率 (例: 1.1なら10%増しでタイムアウト判定)

    // 中間定数
    const path = window.location.pathname;

    // あとでMonaco Editorを容易に取得できるようにletを用意しておく
    let monaco_editor;

    // CSS挿入
    const customCss = `
        #main-container {
            width: max(750px, 50%);
            margin-left: 6rem;
        }

        #ajt_container {
            width: calc(100% - 14rem - max(750px, 50%));
            position: fixed;
            right: 6rem;
            top: calc(50px + 2rem);
            bottom: calc(80px + 2rem);
            border-radius: 16px;
            padding: 8px;
            box-shadow: 0px 0px 8px 2px #4444;
            background-color: #ffffff;
            z-index: 1000;

            display: block grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 5fr 2fr 32px 2fr;
            gap: 16px;
            grid-template-areas:
                "editor editor editor"
                "stdin answer settings"
                "controls controls controls"
                "status stdout stderr";
            
            &>.monaco-editor-container {
                grid-area: editor;
                border-radius: 8px;
                box-shadow: 0px 0px 4px 1px #0002;
            }

            &>*>h3 {
                user-select: none;
                margin: 0 0 4px 0;
                font-size: 1.2rem;
                font-weight: bold;
                color: #333;
            }

            &>:is(.section_stdin, .section_answer, .section_stdout, .section_stderr) {
                display: flex;
                flex-direction: column;
                &>textarea {
                    flex-grow: 1;
                    width: 100%;
                    border-radius: 8px;
                    border: 1px solid #aaa;
                    padding: 4px;
                    font-family: monospace;
                    font-size: 12px;
                    resize: none;
                }
            }

            &>.section_stdin {
                grid-area: stdin;
            }

            &>.section_answer {
                grid-area: answer;
            }

            &>.section_stdout {
                grid-area: stdout;
            }

            &>.section_stderr {
                grid-area: stderr;
            }

            &>.section_settings {
                grid-area: settings;
                &>.settings_list {
                    font-size: 12px;
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    &>.setting_item {
                        margin-bottom: 8px;

                        &>label {
                            margin-right: 4px;
                            width: calc(60% - 4px);
                        }
                        &>input {
                            width: 40%;
                        }
                    }
                }
            }

            &>.section_controls {
                grid-area: controls;
                display: flex;
                justify-content: left;
                align-items: center;
                gap: 8px;
                & * {
                    font-size: 12px;
                    height: 100%;
                }
                &>.controls_group {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    &>h4 {
                        margin: 0;
                        line-height: 30px;
                        font-weight: normal;
                        user-select: none;
                    }
                    &>button {
                        padding-inline: 4px;
                        border-radius: 8px;
                        border: 1px solid #888;
                        background-color: #eee;
                        cursor: pointer;
                        transition: background-color 0.12s;

                        &:hover {
                            background-color: #ddd;
                        }

                        &:active {
                            background-color: #ccc;
                        }

                        &:disabled {
                            background-color: #aaa;
                            border-color: #888;
                            cursor: not-allowed;
                        }
                    }
                }
                &>hr {
                    width: 2px;
                    height: 24px;
                    margin: 0;
                    background-color: #8888;
                    border: none;
                }
            }

            &>.section_status {
                grid-area: status;
                &>table {
                    width: 100%;
                    font-size: 12px;
                    border-collapse: collapse;
                    &>tbody>tr>:is(th, td) {
                        padding: 2px 4px;
                        border: 1px solid #ccc;
                        &:is(th) {
                            text-align: left;
                            background-color: #f0f0f0;
                        }
                        &:is(td) {
                            text-align: center;
                            font-family: monospace;
                        }
                        &:is(td#ajt_status_result) {
                            font-weight: bold;
                            &::before {
                                content: attr(data-result-value);
                                color: #fff;
                                display: inline-block;
                                padding-inline: 6px;
                                border-radius: 4px;
                            }
                            &[data-result-value="--"]::before,
                            &[data-result-value="WJ"]::before {
                                background-color: #888888;
                            }
                            &[data-result-value="AC"]::before {
                                background-color: #4caf50;
                            }
                            &[data-result-value="WA"]::before {
                                background-color: #f44336;
                            }
                            &[data-result-value="TLE"]::before {
                                background-color: #ff9800;
                            }
                            &[data-result-value="RE"]::before {
                                background-color: #2196f3;
                            }
                        }
                    }
                }
            }
        }
    `;
    GM_addStyle(customCss);

    // コンテナdiv追加
    const container_div = document.createElement('div');
    container_div.id = 'ajt_container';
    document.querySelector("#main-container").appendChild(container_div);

    // Monaco Editor**以外**の要素を追加
    const insertHTML = `\
<div class="section_stdin">
    <h3>Standard Input</h3>
    <textarea id="ajt_stdin"></textarea>
</div>
<div class="section_answer">
    <h3>Expected Answer</h3>
    <textarea id="ajt_answer"></textarea>
</div>
<div class="section_settings">
    <h3>Settings</h3>
    <ul class="settings_list">
        <li class="setting_item"><label for="ajt_timeout">Time Limit(ms):</label><input type="number" id="ajt_timeout" value="2000"></li>
        <li class="setting_item"><label for="ajt_allowable_error">Allowable Error:</label><input type="text" id="ajt_allowable_error" value="1e-6"></li>
        <li class="setting_item"><label for="ajt_ts_check_enabled">ts-check (Need Reload):</label><input type="checkbox" id="ajt_ts_check_enabled"></li>
        <li class="setting_item"><label for="ajt_typescript_enabled">TypeScript (Need Reload):</label><input type="checkbox" id="ajt_typescript_enabled"></li>
    </ul>
</div>
<div class="section_controls">
    <div class="controls_group">
        <button id="ajt_run_button">Run Test</button>
        <button id="ajt_prepare_submit_button">Prepare Submit</button>
    </div>
    <hr>
    <div class="controls_group">
        <h4>Insert Template:</h4>
        <button id="ajt_insert_nodejs_button">Node.js</button>
        <button id="ajt_insert_deno_button">Deno</button>
        <button id="ajt_insert_bun_button">Bun</button>
    </div>
</div>
<div class="section_status">
    <h3>Status</h3>
    <table>
        <tbody>
            <tr><th>Result</th><td id="ajt_status_result" data-result-value="--"></td></tr>
            <tr><th>Execution Time</th><td id="ajt_status_time">-</td></tr>
        </tbody>
    </table>
</div>
<div class="section_stdout">
    <h3>Standard Output</h3>
    <textarea id="ajt_stdout" readonly></textarea>
</div>
<div class="section_stderr">
    <h3>Standard Error</h3>
    <textarea id="ajt_stderr" readonly></textarea>
</div>
`;
    container_div.insertAdjacentHTML('beforeend', insertHTML);

    // ajt_ts_check_enabledを更新
    const is_ts_check_enabled = GM_getValue("ajt_ts_check_enabled", "true");
    if (is_ts_check_enabled === "true") {
        document.querySelector("#ajt_ts_check_enabled").checked = true;
    } else {
        document.querySelector("#ajt_ts_check_enabled").checked = false;
    }
    document.querySelector("#ajt_ts_check_enabled").addEventListener('click', (event) => {
        const checked = event.target.checked;
        if (checked) {
            GM_setValue("ajt_ts_check_enabled", "true");
        } else {
            GM_setValue("ajt_ts_check_enabled", "false");
        }
    });

    // ajt_typescript_enabledを更新
    const is_typescript_enabled = GM_getValue("ajt_typescript_enabled", "false");
    if (is_typescript_enabled === "true") {
        document.querySelector("#ajt_typescript_enabled").checked = true;
    } else {
        document.querySelector("#ajt_typescript_enabled").checked = false;
    }
    document.querySelector("#ajt_typescript_enabled").addEventListener('click', (event) => {
        const checked = event.target.checked;
        if (checked) {
            GM_setValue("ajt_typescript_enabled", "true");
        } else {
            GM_setValue("ajt_typescript_enabled", "false");
        }
    });

    // Monaco Editorへ入れるコードについて、過去に保存されていればそれを持ってくる(なければ空文字)
    const savedCode = GM_getValue(`monaco_editor_code_${path}`, "");

    const MONACO_VERSION = 'latest';

    // Monaco Editorの読み込み
    await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/min/vs/loader.js`;
        script.onload = resolve;
        document.body.appendChild(script);
    });
    console.log('loader.js の読み込み完了。');
    require.config({
        paths: {
            'vs': `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/min/vs`
        }
    });
    await new Promise((resolve, reject) => {
        require(['vs/editor/editor.main'], () => {
            try {
                const extra_types = `
// Console (本来はlib: domにあるが、domをimportするとwindowやdocumentを怒ってくれないのでここで再定義)
declare var console: {
    log(...data: any[]): void;
    error(...data: any[]): void;
    warn(...data: any[]): void;
    info(...data: any[]): void;
    debug(...data: any[]): void;
};

// Node.js, Deno, Bunで標準入力に使うAPIの型定義
declare module 'fs' {
    export function readFileSync(path: string, encoding: 'utf8'): string;
}
declare var require: {
    (moduleName: 'fs'): typeof import('fs');
};
declare namespace Deno {
    function readTextFile(path: string): Promise<string>;
}
declare namespace Bun {
    function file(path: string): {
        text(): Promise<string>;
    };
}
`;
                // 型チェックを有効化する場合の設定
                if (GM_getValue("ajt_ts_check_enabled", "true") === "true") {
                    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                        noSemanticValidation: false
                    });
                    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                        ...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
                        checkJs: true,
                        strictNullChecks: true,
                        target: monaco.languages.typescript.ScriptTarget.ESNext,
                        lib: ['esnext'],
                        module: monaco.languages.typescript.ModuleKind.ESNext
                    });
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(extra_types, 'ts:runtime-apis.d.ts');
                }
                // TypeScriptモードを有効化する場合の設定
                if (GM_getValue("ajt_typescript_enabled", "false") === "true") {
                    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                        ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
                        target: monaco.languages.typescript.ScriptTarget.ESNext,
                        lib: ['esnext'],
                        module: monaco.languages.typescript.ModuleKind.ESNext,
                        strict: true,
                    });
                    monaco.languages.typescript.typescriptDefaults.addExtraLib(extra_types, 'ts:runtime-apis.d.ts');
                }

                const editorContainer = document.createElement('div');
                editorContainer.style.width = '100%';
                editorContainer.style.height = '100%';
                editorContainer.classList.add('monaco-editor-container');
                container_div.appendChild(editorContainer);
                const language_mode = GM_getValue("ajt_typescript_enabled", "false") === "true" ? 'typescript' : 'javascript';
                const editor = monaco.editor.create(editorContainer, {
                    value: savedCode,
                    language: language_mode, // 言語モード
                    theme: 'vs-dark',       // テーマ (vs-dark, vs-lightなど)
                    automaticLayout: true,  // コンテナサイズ変更時に自動リサイズ
                    minimap: { enabled: false } // ミニマップの表示を無効化
                });
                console.log(`Monaco Editorの生成に成功しました。言語モード: ${language_mode}`);
                monaco_editor = editor;
                resolve();

            } catch (e) {
                console.error('Monaco Editorの生成に失敗しました:', e);
                reject(e);
            }
        });
    });

    // TypeScriptモードの場合、トランスパイル用にSucraseを読み込んでおく
    if (GM_getValue("ajt_typescript_enabled", "false") === "true") {
        await new Promise(async (resolve) => {
            // 下記URLはES Module形式でSucraseを提供している
            const SUCRASE_URL = "https://esm.sh/sucrase@3.35.1/?target=esnext";
            const module = await import(SUCRASE_URL);
            window.Sucrase = module;
            resolve();
        });
        // test: Sucraseが正しく読み込まれたか確認
        console.log('Sucraseの読み込みに成功しました。', window.Sucrase);
    }

    // テンプレートコードの事前準備
    /** @type {(environment: ("Node.js" | "Deno" | "Bun"), language: ("JavaScript" | "TypeScript")) => string} */
    const getTemplateCode = (environment, language) => {
        const comment_section = `\
// ================================================================
// ${document.querySelector("nav .contest-title").innerText.trim()}
// ${document.title.trim()}
// (URL: ${window.location.href})
// ${language} (${environment}) Submission
// ================================================================
`;
        const main_function_section = {
            "JavaScript": `\
/** @type {(inputText: string) => void} */
function Main(inputText) {
    /** @type {string[][]} */
    const input = inputText.trim().split("\\n").map(row => row.split(" "));
    // Add your code here
}
`,
            "TypeScript": `\
function Main(inputText: string): void {
    const input: string[][] = inputText.trim().split("\\n").map(row => row.split(" "));
    // Add your code here
}
`
        }[language];
        const stdin_section = {
            "Node.js": `\
Main(require("fs").readFileSync("/dev/stdin", "utf8"));
`,
            "Deno": `\
export {}; // <- An empty export is required so that ts-check can determine it as a module.
Main(await Deno.readTextFile("/dev/stdin"));
`,
            "Bun": `\
export {}; // <- An empty export is required so that ts-check can determine it as a module.
Main(await Bun.file("/dev/stdin").text());
`
        }[environment];
        return `${comment_section}${main_function_section}\n${stdin_section}`;
    };
    const language_mode = GM_getValue("ajt_typescript_enabled", "false") === "true" ? "TypeScript" : "JavaScript";
    // 「このページで挿入される可能性のあるテンプレートコードのSet」を作る
    const possibleTemplateCodes = new Set();
    ["Node.js", "Deno", "Bun"].forEach(env => {
        possibleTemplateCodes.add(getTemplateCode(env, "JavaScript"));
        possibleTemplateCodes.add(getTemplateCode(env, "TypeScript"));
    });
    possibleTemplateCodes.add(""); // 空文字列も追加
    // #ajt_insert_*_button を押下したときの処理を追加
    // もし現在のコードがテンプレートコードのいずれかと一致していなければ、確認ダイアログを出す
    document.querySelector("#ajt_insert_nodejs_button").addEventListener("click", () => {
        const currentCode = monaco_editor.getValue();
        if (!possibleTemplateCodes.has(currentCode)) {
            const proceed = window.confirm("If you insert it now, the current code will be lost. Do you want to proceed?");
            if (!proceed) return;
        }
        const newCode = getTemplateCode("Node.js", language_mode);
        monaco_editor.setValue(newCode);
    });
    document.querySelector("#ajt_insert_deno_button").addEventListener("click", () => {
        const currentCode = monaco_editor.getValue();
        if (!possibleTemplateCodes.has(currentCode)) {
            const proceed = window.confirm("If you insert it now, the current code will be lost. Do you want to proceed?");
            if (!proceed) return;
        }
        const newCode = getTemplateCode("Deno", language_mode);
        monaco_editor.setValue(newCode);
    });
    document.querySelector("#ajt_insert_bun_button").addEventListener("click", () => {
        const currentCode = monaco_editor.getValue();
        if (!possibleTemplateCodes.has(currentCode)) {
            const proceed = window.confirm("If you insert it now, the current code will be lost. Do you want to proceed?");
            if (!proceed) return;
        }
        const newCode = getTemplateCode("Bun", language_mode);
        monaco_editor.setValue(newCode);
    });

    // 問題文の"入力例 n"セクションに[Copy IO]ボタンを追加する処理
    (() => {
        const sampleIOs = {
            I_pre: new Map(),
            I_el: new Map(),
            O_pre: new Map(),
            nums: new Set()
        };
        document.querySelectorAll(".lang-ja section:has(h3~pre)").forEach(sect => {
            const sample_h3_text = sect.querySelector("h3").childNodes[0].textContent;
            const sample_pre_text = sect.querySelector("pre").childNodes[0].textContent;
            if (sample_h3_text.startsWith("入力例 ")) {
                const sample_number = Number(sample_h3_text.slice(4));
                sampleIOs.I_pre.set(sample_number, sample_pre_text);
                sampleIOs.I_el.set(sample_number, sect.querySelector("h3"));
                sampleIOs.nums.add(sample_number);
            }
            if (sample_h3_text.startsWith("出力例 ")) {
                const sample_number = Number(sample_h3_text.slice(4));
                sampleIOs.O_pre.set(sample_number, sample_pre_text);
                sampleIOs.nums.add(sample_number);
            }
        });
        sampleIOs.nums.forEach(num => {
            const input_section_h3 = sampleIOs.I_el.get(num);
            if (!input_section_h3) return;
            const input_text = sampleIOs.I_pre.get(num) || "";
            const output_text = sampleIOs.O_pre.get(num) || "";
            const copy_button = document.createElement("span");
            copy_button.classList.add("btn", "btn-default", "btn-sm", "btn-copy", "ml-1");
            copy_button.textContent = "Copy IO";
            // 対応するh3要素の最後の子要素として追加
            input_section_h3.appendChild(copy_button);
            // クリック時、ajt_stdinとajt_answerにそれぞれinput_textとoutput_textをセットする
            copy_button.addEventListener("click", () => {
                document.querySelector("#ajt_stdin").value = input_text;
                document.querySelector("#ajt_answer").value = output_text;
            });
        });
    })();

    // 問題ページのソースコード欄に文字列をsetする関数
    const setSourceCode = (code) => {
        // #sourceCode の中には #editor(Ace Editor)と #plain-textarea(textarea)がある
        // 今どっちかを取得 displayがnoneじゃないほう
        const currentEditor = document.querySelector("#sourceCode #editor").style.display !== "none"
            ? document.querySelector("#sourceCode #editor")
            : document.querySelector("#sourceCode #plain-textarea");
        // currentEditorがAce Editorの場合、.btn-toggle-editorを押す→ textareaにセット → .btn-toggle-editorをもう一回押す でいける
        // currentEditorがtextareaの場合、そのままセットすればOK
        if (currentEditor.id === "editor") document.querySelector(".btn-toggle-editor").click();
        document.querySelector("#sourceCode #plain-textarea").value = code;
        if (currentEditor.id === "editor") document.querySelector(".btn-toggle-editor").click();
    };
    // #ajt_prepare_submit_button を押下したときの処理を追加
    document.querySelector("#ajt_prepare_submit_button").addEventListener("click", () => {
        const code = monaco_editor.getValue();
        // Clipboard APIを使ってクリップボードにコピー
        navigator.clipboard.writeText(code).then(() => {
            console.log("Code copied to clipboard.");
        }).catch((err) => {
            console.error("Failed to copy code to clipboard:", err);
        });
        // #sourceCode までスクロール
        document.querySelector("#sourceCode").scrollIntoView({ behavior: 'smooth' });
        // #sourceCode にコードをセット
        setSourceCode(code);
    });


    // Monaco Editorの内容が変化したら保存するようにする
    const saveEditorContent = () => {
        const code = monaco_editor.getValue();
        GM_setValue(`monaco_editor_code_${path}`, code);
    };
    monaco_editor.getModel().onDidChangeContent(saveEditorContent);

    // Runボタン押下時、Workerを動的に生成してコードテストを実行して結果を反映する処理
    // 1. Worker側のコードを用意する関数
    const createWorkerScript = () => {
        // Editorのコードを取得
        let userCode = monaco_editor.getValue();
        // TypeScriptモードの場合、SucraseでJavaScriptにトランスパイルする (型を消すだけでOK)
        if (GM_getValue("ajt_typescript_enabled", "false") === "true") {
            const transformed = window.Sucrase.transform(userCode, {
                transforms: ['typescript'],
                disableESTransforms: true
            });
            userCode = transformed.code;
        }
        // `Main(require("fs").readFileSync("/dev/stdin", "utf8"));`, `Main(await Deno.readTextFile("/dev/stdin"));`, `Main(await Bun.file("/dev/stdin").text());`があれば削除する
        const deleteTargets = [
            'Main(require("fs").readFileSync("/dev/stdin", "utf8"));',
            'Main(await Deno.readTextFile("/dev/stdin"));',
            'Main(await Bun.file("/dev/stdin").text());',
            'export {};'
        ];
        deleteTargets.forEach(target => {
            userCode = userCode.replace(target, '');
        });
        // Workerが"run"メッセージでstdinを受け取る → Main関数に渡してstdout/stderrを記録する → "result"メッセージで返す、という流れを実装するコードを生成
        const workerCommonScript = `\
importScripts("https://cdn.jsdelivr.net/npm/node-inspect-extracted/dist/inspect.js");
const formatValue = value => {
    if (typeof value === 'string') {
        return value;
    }
    if (typeof self.util === 'object' && typeof self.util.inspect === 'function') {
        return self.util.inspect(value, { depth: null });
    }
    return String(value);
};
self.onmessage = async function(event) {
    if (event.data.type === "run") {
        const stdin = event.data.stdin;
        const stdout = [];
        const stderr = [];
        console.log = (...args) => {
            stdout.push(args.map(formatValue).join(" "));
        };
        console.error = (...args) => {
            stderr.push(args.map(formatValue).join(" "));
        };
        try {
            await Main(stdin);
        } catch (e) {
            stderr.push(\`Error: \${e.message} (@L:\${e.lineno ?? "??"})\`);
        }
        self.postMessage({
            type: "result",
            stdout: stdout.join("\\n"),
            stderr: stderr.join("\\n")
        });
    }
};
`;
        // 最終的なWorkerスクリプトを生成して返す
        return `\
${userCode}
${workerCommonScript}
`;
    };
    // 2. 返ってきた結果をもとにUIを更新する関数
    /**
     * @typedef {Object} ExecutionResult
     * @property {string} stdout - 標準出力の内容
     * @property {string} stderr - 標準エラー出力の内容
     * @property {number|null} execTime - 実行時間 (ms)。タイムアウト時はnull
     */
    /** @type {(arg0: ExecutionResult) => void} */
    const updateUIWithResult = ({ stdout, stderr, execTime }) => {
        // とりあえずstdout/stderrを反映
        document.querySelector("#ajt_stdout").value = stdout;
        document.querySelector("#ajt_stderr").value = stderr;
        // 実行時間を反映 ただし、execTimeがnullか実行時間制限のTIMEOUT_BUFFER_RATE倍以上の場合は`≦ ${実行制限時間 * TIMEOUT_BUFFER_RATE} ms`と表示
        const timeoutLimit = parseInt(document.querySelector("#ajt_timeout").value);
        if (execTime !== null && execTime < timeoutLimit * TIMEOUT_BUFFER_RATE) {
            document.querySelector("#ajt_status_time").textContent = `${execTime.toFixed(0)} ms`;
        } else {
            document.querySelector("#ajt_status_time").textContent = `≦ ${Math.floor(timeoutLimit * TIMEOUT_BUFFER_RATE)} ms`;
        }
        // 結果を判定して反映
        const expectedAnswer = document.querySelector("#ajt_answer").value.trim();
        let resultValue = "--";
        if (execTime === null || execTime >= timeoutLimit) {
            resultValue = "TLE";
        } else if (stderr.length > 0) {
            resultValue = "RE";
        } else {
            // stdoutとexpectedAnswerを比較
            // 改行・スペース区切りで2次元配列にして比較。各要素が数値の場合は許容誤差内での比較を行う
            const parseOutput = (text) => text.trim().split("\n").map(row => row.trim().split(/\s+/));
            const outputArray = parseOutput(stdout);
            const answerArray = parseOutput(expectedAnswer);
            const allowableError = Number.parseFloat(document.querySelector("#ajt_allowable_error").value);
            const twoDimensionalArrayEqual = (arr1, arr2) => {
                if (arr1.length !== arr2.length) return false;
                for (let i = 0; i < arr1.length; i++) {
                    if (arr1[i].length !== arr2[i].length) return false;
                    for (let j = 0; j < arr1[i].length; j++) {
                        const val1 = arr1[i][j];
                        const val2 = arr2[i][j];
                        const num1 = Number.parseFloat(val1);
                        const num2 = Number.parseFloat(val2);
                        if (!Number.isNaN(num1) && !Number.isNaN(num2)) {
                            // 数値として比較
                            if (Math.abs(num1 - num2) > allowableError) return false;
                        } else {
                            // 文字列として比較
                            if (val1 !== val2) return false;
                        }
                    }
                }
                return true;
            };
            if (twoDimensionalArrayEqual(outputArray, answerArray)) {
                resultValue = "AC";
            } else {
                resultValue = "WA";
            }
        }
        const resultCell = document.querySelector("#ajt_status_result");
        resultCell.setAttribute("data-result-value", resultValue);
    };
    // 3. Runボタン押下時の処理を追加
    document.querySelector("#ajt_run_button").addEventListener("click", async () => {
        // ボタンを一時的にdisabledにする
        const runButton = document.querySelector("#ajt_run_button");
        runButton.disabled = true;
        // Workerスクリプトを生成
        const workerScript = createWorkerScript();
        const blob = new Blob([workerScript], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);
        // stdinを取得
        const stdin = document.querySelector("#ajt_stdin").value;
        // runメッセージでWorkerにstdinを送信・実行開始
        const startTime = performance.now();
        worker.postMessage({ type: "run", stdin: stdin });
        // ExecutionResultは、Promise.raceで勝ったほうを採用する形にする
        const executionResult = await Promise.race([
            // 順当にWorkerからの結果を待つPromise
            new Promise((resolve) => {
                worker.onmessage = (event) => {
                    if (event.data.type === "result") {
                        const endTime = performance.now();
                        const execTime = endTime - startTime;
                        resolve({
                            stdout: event.data.stdout,
                            stderr: event.data.stderr,
                            execTime: Math.ceil(execTime)
                        });
                    }
                };
            }),
            // Workerでerrorが発生した場合にREとして扱うPromise
            new Promise((resolve) => {
                worker.onerror = (error) => {
                    const endTime = performance.now();
                    const execTime = endTime - startTime;
                    resolve({
                        stdout: "",
                        stderr: `Error: ${error.message ?? "??"} (@L:${error.lineno ?? "??"})`,
                        execTime: Math.ceil(execTime)
                    });
                };
            }),
            // 実行時間制限 × TIMEOUT_BUFFER_RATEミリ秒後にタイムアウトとするPromise
            new Promise((resolve) => {
                const timeLimit = parseInt(document.querySelector("#ajt_timeout").value);
                const timeoutLimit = timeLimit * TIMEOUT_BUFFER_RATE;
                setTimeout(() => {
                    resolve({
                        stdout: "",
                        stderr: "Error: Execution timed out.",
                        execTime: null
                    });
                }, timeoutLimit);
            })
        ]);
        // Workerを終了・URLを解放
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        // UIを更新
        updateUIWithResult(executionResult);
        // ボタンを再度有効化
        runButton.disabled = false;
    });

    // 実行時間制限を問題文から取得して input#ajt_timeout にセットする処理
    // .row > .col-sm-12の序盤に「実行時間制限: <number> sec」のように書かれているので、innerTextから正規表現でその文字列を抜き出す 時間は小数の可能性もある
    const problemInfoDivs = document.querySelectorAll(".row > .col-sm-12");
    for (const div of problemInfoDivs) {
        const text = div.innerText;
        const match = text.match(/実行時間制限:\s*([\d.]+)\s*sec/);
        if (match) {
            const timeLimitSec = Number.parseFloat(match[1]);
            if (!Number.isNaN(timeLimitSec)) {
                const timeLimitMs = Math.ceil(timeLimitSec * 1000);
                document.querySelector("#ajt_timeout").value = timeLimitMs.toString();
                console.log(`Detected time limit from problem statement: ${timeLimitMs} ms`);
                break;
            }
        }
    }
})();
