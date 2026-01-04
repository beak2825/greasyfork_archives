// ==UserScript==
// @name         SchoodingPlus
// @namespace    http://tampermonkey.net/
// @version      2025-09-27
// @description  userscript pour schooding
// @author       PieroLB
// @match        https://www.schooding.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=schooding.fr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551242/SchoodingPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/551242/SchoodingPlus.meta.js
// ==/UserScript==

class IFrame {
    constructor(id) {
        this.id = id;
        this.isLoaded = false;
    }
    load() {
        return new Promise((resolve) => {
            if (this.isLoaded) resolve();
            let iframe = document.querySelector(`iframe[data-exoid="${this.id}"]`);
            iframe.addEventListener("load", () => {
                this.isLoaded = true;
                resolve();
            });
        });
    }
    update() {
        let iframe = document.querySelector(`iframe[data-exoid="${this.id}"]`);
        if (iframe) {
            this.iframe = iframe;
            this.iframeWindow = this.iframe.contentWindow;
            this.iframeDoc =
                this.iframe.contentDocument || this.iframeWindow.document;
        }
    }
    getCodeData() {
        return new Promise((resolve) => {
            const script = this.iframeDoc.createElement("script");
            script.textContent = `
       window.parent.postMessage({
         type: "getIDE",
         initialCode: ide.getContent(),
         language: ide.language,
       }, "*");
      `;
        this.iframeDoc.body.appendChild(script);
        const messageEvent = (event) => {
            if (event.data?.type === "getIDE") {
                const { initialCode, language } = event.data;
                resolve({ initialCode: initialCode, language: language });
            }
            window.removeEventListener("message", messageEvent);
        };
        window.addEventListener("message", messageEvent);
    });
  }
    getQuestionsData() {
        let questions = [];
        const form = this.iframeDoc.getElementById("form");
        if (form) {
            const questionElements = form.querySelectorAll(".form-group");
            if (questionElements)
                questionElements.forEach((questionsElement) => {
                    let question = {
                        title: questionsElement.querySelector(
                            ".card-header.bg-info.text-white"
                        ).textContent,
                        enonce: questionsElement.querySelector(
                            ".question-wording.langvarhtml"
                        ).innerText,
                        reponses: [],
                    };
                    questionsElement
                        .querySelectorAll(
                        ".list-group-item.checkbox.form-check.checkbox-xl"
                    )
                        .forEach((reponseElement) => {
                        question.reponses.push({
                            text: reponseElement.querySelector("label").innerText,
                            input: reponseElement.querySelector("input"),
                        });
                    });
                    questions.push(question);
                });
        }
        return questions;
    }
    insertCode(title, code) {
        console.log(title, code);
        const script = this.iframeDoc.createElement("script");
        script.textContent = `
    var fillCode = (event)=>{
        const { code } = event.data;
        const editor = ide.editors[ide.currentFilename];
        editor.completers = editor.completers || [];
        editor.completers.push({
          getCompletions: function(editor, session, pos, prefix, callback) {
            callback(null, [
              {
                caption: "${title}",
                value: code,
              }
            ]);
          }
});
        //editor.setValue(code, -1);
        //const session = editor.getSession();
        //const lines = session.getDocument().getAllLines();
        ////if (lines.length > 2) {
        ////  session.removeFullLines(0, 0); // remove first line
        ////  session.removeFullLines(session.getLength() - 1, session.getLength() - 1); // remove last line
        ////}
        window.removeEventListener("message", fillCode);
    }
    window.addEventListener("message", fillCode);`;
      this.iframeDoc.body.appendChild(script);
      this.iframeWindow.postMessage({ type: "fillCode", code: code }, "*");
      script.remove();
  }
    getValidators() {
        let isCompleted = true;
        const validators = [];
        const resultElements = this.iframeDoc.querySelectorAll(
            "#resultContentBody>a"
        );
        resultElements.forEach((resultElement) => {
            let validator = {};
            if (resultElement.classList.contains("text-success")) {
                validator.state = "success";
            } else if (resultElement.classList.contains("text-danger")) {
                isCompleted = false;
                let detailsElement = resultElement.parentElement.querySelector(
                    resultElement.getAttribute("data-target")
                );
                if (detailsElement) {
                    let details = detailsElement.innerText;
                    validator.content = details;
                    if (details.slice(0, 5) == "CRASH") {
                        validator.state = "error";
                    } else {
                        validator.state = "incorrect";
                    }
                }
            } else return;
            if (resultElement.id == "head-compilPart") {
                validator.type = "compil";
            } else if (resultElement.id.includes("head-test")) {
                validator.type = "test";
            } else return;
            validators.push(validator);
        });
        return { validators: validators, isCompleted: isCompleted };
    }
}

class Code {
    static codes = [];
    constructor(id, tab) {
        this.id = id;
        this.tab = tab;
        this.state = 1;
        this.n = 1;
        this.type = "code";
        this.iframe = new IFrame(this.id);
        this.enonce = null;
        this.initialCode = "";
        this.language = "";
        this.messages = [];
        this.validators = [];

        Code.codes.push(this);
        exos.push(this);
    }
    go() {
        return new Promise((resolve) => {
            if (this.id == 0) {
                if (this.state == 1) {
                    actionneur.write();
                    this.state += 1;
                    resolve();
                } else if (this.state == 2) {
                    matiere = actionneur.element.textContent;
                    actionneur.element.textContent = actionneur.valueElementBefore;
                    document.removeEventListener("keydown", actionneur.keyDownListener);
                    this.state += 1;
                    resolve();
                } else if (this.state == 3) {
                    actionneur.write();
                    this.state += 1;
                    resolve();
                } else if (this.state == 4) {
                    infosSup = actionneur.element.textContent;
                    actionneur.element.textContent = actionneur.valueElementBefore;
                    document.removeEventListener("keydown", actionneur.keyDownListener);
                    this.state += 1;
                    console.log(infosSup);
                    resolve();
                }
            } else {
                // Récupérations des infos de l'exo
                if (this.state == 1) {
                    this.enonce =
                        this.iframe.iframeDoc.getElementById("wording").innerText;
                    this.iframe.getCodeData().then((data) => {
                        this.initialCode = data.initialCode;
                        this.iframe.insertCode(`Code initial`, this.initialCode);
                        this.language = data.language;
                        this.state += 1;
                        resolve();
                    });
                }
                // Send to GPT
                else if (this.state == 2) {
                    this.messages = [
                        {
                            role: "system",
                            content: `Nous allons travailler sur la matière "${matiere}". ${
                infosSup.length > 0
                            ? `Voici quelques infos supplémentaires : ${infosSup}`
                  : ""
                        }. De plus tu es mon assistant expert en ${
                this.language
                        }. Tu dois uniquement compléter la fonction donnée dans le code actuel pour qu'elle réponde précisément à l'énoncé fourni. Ne retourne que le code final, sans aucune explication.`,
                        },
                        {
                            role: "user",
                            content: `Énoncé :
            ${this.enonce}

            Code actuel :
            ${this.initialCode}`,
            },
          ];
            this.fetchGPT().then(() => {
                this.state += 1;
                resolve();
            });
        }
          // Analyse les validators
          else if (this.state == 3) {
              const { validators, isCompleted } = this.iframe.getValidators();
              this.validators = validators;
              this.state += !isCompleted ? 1 : 2;
              resolve();
          }
          // ReSend to GPT with errors
          else if (this.state == 4) {
              let message = {
                  role: "system",
                  content: `Le code que tu m'as donnée a échoué. Voilà les erreurs détaillées :\n`,
              };
              this.validators.forEach((validator) => {
                  message.content += ` - ${
              validator.state == "error"
                      ? "Erreur du programme"
                  : "Le test a échoué"
              } : ${validator.content}`;
              });
              this.messages.push(message);
              this.n += 1;
              this.fetchGPT().then(() => {
                  this.state -= 1;
                  resolve();
              });
          }
      }
    });
  }
    fetchGPT() {
        return new Promise((resolve) => {
            const apiKey =
                  "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";
            fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    temperature: 0,
                    messages: this.messages,
                }),
            })
                .then((data) => data.json())
                .then((data) => {
                const gptCode = data.choices[0].message.content;
                this.messages.push({ role: "assistant", content: gptCode });
                let lines = gptCode.split("\n");
                let codeFormated = gptCode;
                if (lines.length > 2) {
                    codeFormated = lines.slice(1, -1).join("\n");
                }
                this.iframe.insertCode(`Solution n°${this.n}`, codeFormated);
                resolve();
            });
        });
    }
}
class QCM {
    static qcms = [];
    constructor(id, tab) {
        this.id = id;
        this.tab = tab;
        this.state = 1;
        this.type = "qcm";
        this.iframe = new IFrame(this.id);
        this.title = null;
        this.questions = [];
        this.messages = [];
        this.validators = [];

        QCM.qcms.push(this);
        exos.push(this);
    }
    go() {
        return new Promise((resolve) => {
            // Récupérations des infos de l'exo
            if (this.state == 1) {
                this.title = this.iframe.iframeDoc.querySelector(
                    "#mainContainer .page-header h1"
                ).textContent;
                this.questions = this.iframe.getQuestionsData();
                this.state += 1;
                resolve();
            }
            // Send to GPT
            else if (this.state == 2) {
                let questionsForGPT = this.questions.map((question) => {
                    return {
                        title: question.title,
                        enonce: question.enonce,
                        reponses: question.reponses.map((reponse) => {
                            return { text: reponse.text };
                        }),
                    };
                });
                this.messages = [
                    {
                        role: "system",
                        content: `Tu es mon assistant. Tu dois m'aider à répondre à un QCM. Voici le format que tu dois me retourner : [{title:"Question #1", bonneReponses:["le contenu de la 1ere bonne réponse", "le contenu de la 2ème bonne réponse"]},{title:"Question #2", bonneReponses:["le contenu de la 1ere bonne réponse", "le contenu de la 2ème bonne réponse"]}]. Ne retourne que cette array, sans aucune explication. N'oublie pas que si la question est au pluriel il y aura plusieurs bonnes réponses`,
                    },
                    {
                        role: "user",
                        content: `Titre du QCM : ${this.title}

            Questions du QCM : ${JSON.stringify(questionsForGPT)}
            `,
                    },
                ];
                this.fetchGPT().then(() => {
                    this.state += 1;
                    resolve();
                });
            }
            // Analyse les validators
            else if (this.state == 3) {
                const { validators, isCompleted } = this.iframe.getValidators();
                this.validators = validators;
                this.state += !isCompleted ? 1 : 2;
                resolve();
            }
            // ReSend to GPT with errors
            else if (this.state == 4) {
                let message = {
                    role: "system",
                    content: `Le code que tu m'as donnée a échoué. Voilà les erreurs détaillées :\n`,
                };
                this.validators.forEach((validator) => {
                    message.content += ` - ${
            validator.state == "error"
              ? "Erreur du programme"
          : "Le test a échoué"
        } : ${validator.content}`;
        });
          this.messages.push(message);
          this.fetchGPT().then(() => {
              this.state -= 1;
              resolve();
          });
      }
    });
  }
    fetchGPT() {
        return new Promise((resolve) => {
            const apiKey =
                  "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";
            fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    temperature: 0,
                    messages: this.messages,
                }),
            })
                .then((data) => data.json())
                .then((data) => {
                const gptReponses = data.choices[0].message.content;
                const gptReponsesParsed = JSON.parse(gptReponses);
                console.log(gptReponsesParsed);
                if (gptReponsesParsed) {
                    gptReponsesParsed.forEach((question) => {
                        let questionObject = this.questions.find(
                            (q) => q.title == question.title
                        );
                        if (questionObject) {
                            question.bonneReponses.forEach((bonneReponse) => {
                                let bonneReponseObject = questionObject.reponses.find(
                                    (r) => r.text == bonneReponse
                                );
                                if (bonneReponseObject) {
                                    bonneReponseObject.input.addEventListener(
                                        "mouseover",
                                        function () {
                                            this.checked = true;
                                        }
                                    );
                                }
                            });
                        }
                    });
                }
                // this.messages.push({ role: "assistant", content: gptCode });
                // console.log(gptCode);
                // this.iframe.insertCode(gptCode);
                resolve();
            });
        });
    }
}

const actionneur = {
    element: null,
    title: "[Instructions] Allez sur un exo",
    exoSelected: null,
    isLoading: false,
    setup: function () {
        this.element = document.querySelector("#time i");
        this.element.style = "user-select: none;";
        this.element.title = this.title;
        this.element.addEventListener("click", () => {
            if (!this.isLoading && this.exoSelected.state != -1) {
                this.loading(true);
                this.exoSelected.go().then(() => {
                    this.loading(false);
                    this.setTitle();
                });
            }
        });
    },
    loading: function (state) {
        this.isLoading = state;
        if (this.isLoading) {
            this.element.style.cursor = "wait";
        } else {
            this.element.style.cursor =
                this.exoSelected.state == 0 ? "default" : "pointer";
        }
    },
    setTitle: function () {
        if (this.exoSelected.id == 0) {
            if (this.exoSelected.state == 1) {
                this.title = `[Instructions] Appuyez pour taper le nom de la matière`;
                this.element.style.cursor = "pointer";
            } else if (this.exoSelected.state == 2) {
                this.title = `[Instructions] Appuyez pour valider le nom de la matière`;
                this.element.style.cursor = "pointer";
            } else if (this.exoSelected.state == 3) {
                this.title = `[Instructions] Appuyez pour renter des informations supplémentaires à donner à notre ami`;
                this.element.style.cursor = "pointer";
            } else if (this.exoSelected.state == 4) {
                this.title = `[Instructions] Appuyez pour valider ces informations`;
                this.element.style.cursor = "pointer";
            } else if (this.exoSelected.state == 5) {
                this.title = `[Instructions] Allez aux exercices`;
                this.element.style.cursor = "default";
            }
        } else if (this.exoSelected.state == 1) {
            this.title = `[Exo ${this.exoSelected.id}] Appuyez pour commencer la récupération des infos de l'exo`;
            this.element.style.cursor = "pointer";
        } else if (this.exoSelected.state == 2) {
            this.title = `[Exo ${this.exoSelected.id}] Appuyez pour demander de l'aide à notre ami`;
            this.element.style.cursor = "pointer";
        } else if (this.exoSelected.state == 3) {
            this.title = `[Exo ${this.exoSelected.id}] Code récupéré ! Appuyez après l'éxécution pour analyser les validators`;
            this.element.style.cursor = "pointer";
        } else if (this.exoSelected.state == 4) {
            this.title = `[Exo ${this.exoSelected.id}] Il y a des erreurs... Appuyez pour redemander de l'aide à notre ami`;
            this.element.style.cursor = "pointer";
        } else if (this.exoSelected.state == 5) {
            this.title = `[Exo ${this.exoSelected.id}] Exercice complété ! N'oubliez pas de relire le code pour le comprendre`;
            this.element.style.cursor = "default";
        } else {
            this.title =
                "Le type de cet exercice est inconnu. On ne pourra vous aider pour résoudre cet exercice.";
            this.element.style.cursor = "default";
        }
        this.element.title = this.title;
    },
    changeExo: function (id) {
        let exo = exos.find((e) => e.id == id);
        if (exo) {
            this.exoSelected = exo;
            this.setTitle();
        }
    },
    write: function () {
        this.valueElementBefore = this.element.textContent;
        this.element.textContent = "";
        this.keyDownListener = (event) => {
            if (event.key === "Backspace") {
                event.preventDefault();
                this.element.textContent = this.element.textContent.slice(0, -1);
            } else if (event.key.length === 1) {
                this.element.textContent += event.key;
            }
        };
        this.keyDownListener = this.keyDownListener.bind();
        document.addEventListener("keydown", this.keyDownListener);
    },
};

if (location.pathname.split("/")[1] == "examen") {
    const consoleLogOriginal = console.log;
    console.log = consoleLogOriginal;
    actionneur.setup();
    var matiere = "";
    var infosSup = "";
    var exos = [];
    // GET TABS
    const listExosTab = document.querySelectorAll(
        ".nav.nav-tabs.schooding.schoodiv>a"
    );
    listExosTab.forEach((exoTab) => {
        if (exoTab.classList.contains("nav-exo")) {
            let id = exoTab.getAttribute("data-exoid");
            let icon = exoTab.querySelector(".material-icons");
            if (icon) {
                let exo;
                if (icon.textContent == "check_box") {
                    exo = new QCM(id, exoTab);
                } else if (icon.textContent == "code") {
                    exo = new Code(id, exoTab);
                }
                if (exo) {
                    exoTab.addEventListener("click", () => {
                        actionneur.loading(true);
                        exo.iframe.load().then(() => {
                            actionneur.loading(false);
                            actionneur.changeExo(exo.id);
                            exo.iframe.update();
                        });
                    });
                } else return;
            }
            exos.push({ id: -1, tab: exoTab, type: "inconnu", state: -1 });
        } else {
            new Code(0, exoTab);
        }
    });
    actionneur.changeExo(0);

    let initImg = document.createElement("img");
    const block = () => {
        examManager.notifyFocusOff =
            examManager.notifyFocusOn =
            examManager.notifyMouseOut =
            examManager.notifyMouseOver =
            examManager.notifyMouseMove =
            examManager.checkWindowSize =
            examManager.checkKey =
            examManager.checkNodeChange =
            function () {};
        const originalAddEvent = examManager.addEvent;
        examManager.addEvent = function (...args) {
            if (args[0] != "page_modification")
                originalAddEvent.apply(examManager, args);
        };
        setTimeout(() => {
            examManager.nodesContent = [];
        }, 3000);
    };
    const init = `
   (${block})();
`;
    initImg.src =
        "https://www.google.fr/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png";
    initImg.setAttribute("onload", init);
    initImg.onload = () => {
        setTimeout(() => {
            initImg.remove();
        }, 1000);
    };
    document.body.appendChild(initImg);
}

// TO DO LIST
// x sécurité et blocages
// x trouver une solution d'insertion du code
// - image dans les énoncés et qcms
// - improve les qcms / créer des modéles
