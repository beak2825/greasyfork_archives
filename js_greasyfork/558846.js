// ==UserScript==
// @name         Dragon Cave - Large Dragons
// @namespace    https://github.com/BleatBytes/DragCave-Large-Dragons
// @version      v2.0.5
// @description  Makes dragons in Dragon Cave appear larger on their View page, on a User's page, and on a user's Dragons page.
// @author       Valen
// @match        *://dragcave.net/account
// @match        *://dragcave.net/notifications
// @match        *://dragcave.net/view*
// @match        *://dragcave.net/user*
// @match        *://dragcave.net/dragons*
// @match        *://dragcave.net/group*
// @icon         https://icons.duckduckgo.com/ip2/dragcave.net.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/558846/Dragon%20Cave%20-%20Large%20Dragons.user.js
// @updateURL https://update.greasyfork.org/scripts/558846/Dragon%20Cave%20-%20Large%20Dragons.meta.js
// ==/UserScript==

const refObjs = [
    { name:'listCheck', default: true, header: 'Scrolls and groups', title:'Make dragons in scrolls and groups larger', explanation:'Makes dragons appear larger in "/dragons/", "/group/", and "/user/" pages.', mobile: false },
    { name:'listSize1', default: 2, mobile: false },
    { name:'listSize2', default: 1, mobile: false },
    { name:'viewCheck', default: true, header: 'Individual view pages', title:'Make dragons in view pages larger', explanation:'Makes dragons appear larger in their individual "/view/" pages.' },
    { name:'viewSize1', default: 2 },
    { name:'viewSize2', default: 1 },
    { name:'notifCheck', default: true, header: 'Notifications page', title:'Make dragons in the notifications page larger', explanation:'Makes dragons appear larger in the "/notifications/" page.' },
    { name:'notifSize1', default: 1 },
    { name:'notifSize2', default: 2 }
];
const themeObjs = [
    { title:"Default theme", keyword: "def", titleFont: '"FQ","PT Serif","Times New Roman","Times",serif', textFont: '14px/19.6px "PT Serif","Times New Roman","Times",serif', buttonIdle: "#886945", buttonActive: "#a7432d", buttonText: "#fff", buttonTextActive: "#fff", collBackground: "#F1E5CB; background: linear-gradient(90deg,rgba(197, 181, 153, 1) 0%, rgba(230, 218, 193, 1) 10%, rgba(241, 229, 203, 1) 15%, rgba(233, 218, 185, 1) 85%, rgba(219, 200, 163, 1) 90%, rgba(181, 170, 140, 1) 100%)", listTitle: "#44300b", collText: "#000", divBorder: "none; box-shadow: 0 0 3px rgba(0,0,0,0.75) inset,0 0 5px #E4E5E7 inset,0 0 5px #E4E5E7 inset,-1px 4px 4px rgba(0,0,0,0.25)", aColor: "#44300b; text-decoration: underline" },
    { title:"Portal 2", keyword: "p2", titleFont: '"DIN","Arial",sans-serif', textFont: '"Arial",sans-serif', buttonIdle: "#00a7ce", buttonActive: "#ff9315", buttonText: "#fff", buttonTextActive: "#fff", collBackground: "rgb(43, 44, 44); background: linear-gradient(180deg,rgb(53, 55, 56) 0%, rgb(19, 20, 20) 100%)", listTitle: "#fff", collText: "#ddd", divBorder: "1px solid #575757; border-radius: 6px", aColor: "#2DB2E6" },
    { title:"Portal 2 Light", keyword: "p2l", titleFont: '"DIN","Arial",sans-serif', textFont: '"Arial",sans-serif', buttonIdle: "#464646", buttonActive: "#2db2e6", buttonText: "#fff", buttonTextActive: "#fff", collBackground: "#dedfe1", listTitle: "#000", collText: "#000", divBorder: "none; box-shadow: 0 0 3px rgba(0,0,0,0.75) inset,0 0 5px #E4E5E7 inset,0 0 5px #E4E5E7 inset,-1px 4px 4px rgba(0,0,0,0.25)", aColor: "#2DB2E6" },
    { title:"St. Patrick's Day", keyword: "spd", titleFont: '"Crimson Text","Times New Roman","Times",serif', textFont: '14.667px/1.4 "Times New Roman","Times",serif', buttonIdle: "#b1f7b5", buttonActive: "#9bd79b", buttonText: "#153e15", buttonTextActive: "#397d39", collBackground: "#e7ffe8", listTitle: "#153e15", collText: "#153e15", divBorder: "1px solid #b1f5ae", aColor: "#153E15; text-decoration: underline" },
    { title:"1960s", keyword: "six", titleFont: '"Times New Roman","Times",serif', textFont: '"Times New Roman","Times",serif', buttonIdle: "#782e15", buttonActive: "#a04f2f", buttonText: "#f9f9f9", buttonTextActive: "#fff", collBackground: "#FAFAFA; background: linear-gradient(180deg,rgb(250, 250, 250) 90%, rgb(222, 222, 222) 100%)", listTitle: "#6e2910", collText: "#000", divBorder: "1px solid rgb(222, 222, 222); box-shadow: 0 0 3px rgba(0,0,0,0.75) inset,0 0 5px #E4E5E7 inset,0 0 5px #E4E5E7 inset,-1px 4px 4px rgba(0,0,0,0.25)", aColor: "#000; text-decoration: underline" },
    { title:"Mobile", keyword: "mob", titleFont: '"Roboto",-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif', textFont: '"Roboto",-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif', buttonIdle: "#2562cc", buttonActive: "#2562cc", buttonText: "#fff", buttonTextActive: "#fff", collBackground: "#fff", listTitle: "#000", collText: "#000", divBorder: "none; box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1),0 0 2px inset transparent", aColor: "#2562cc" }
];

const initMem = async function() {
    let $localRef = refObjs;
    for(let i = 0; i < $localRef.length; i++) {
        let $this = $localRef[i];
        let $mem = GM_getValue(`${$this.name}`);
        if ($mem == undefined) {
            GM_setValue(`${$this.name}`, $this.default)
        } else {
            continue
        }
    }
}();

function initUI() {
    return new Promise((resolve) => {
        if (GM_getValue("UIstyle") == undefined) {
            function detectTheme() {
                const siteThemes = [
                    { theme: "default", discriminator: "p", keyword: "def" },
                    { theme: "portalD", discriminator: "k", keyword: "p2" },
                    { theme: "portalL", discriminator: "v", keyword: "p2l" },
                    { theme: "stpatrick", discriminator: "i", keyword: "spd" },
                    { theme: "sixties", discriminator: "r", keyword: "six" },
                    { theme: "mobile", discriminator: "x", keyword: "mob"}
                ];
                const nav = document.getElementsByTagName("nav")[0];
                let thm;
                for (const obj of siteThemes) {
                    const regex = new RegExp(obj.discriminator);
                    if (regex.test(nav.classList[0]) == false) {
                        continue;
                    };
                    thm = obj;
                };
                if (thm == undefined) {
                    thm = siteThemes[0];
                };
                return new Promise(resolve => resolve(thm))
            };

            detectTheme().then(async (obj) => {
                let thms = await themeObjs
                let res = thms.filter(x => x.keyword == obj.keyword);
                return res[0]
            }).then(x => {
                GM_setValue("UIstyle", x.keyword);
                resolve(GM_getValue("UIstyle", x.keyword))
            });
        } else {
            resolve(GM_getValue("UIstyle", "def"))
        };
    });
};

function elChivo() {
    const container = document.createElement('div');
    const p = document.createElement('p');
    p.classList.add("LDpromo");
GM_addStyle(`.LDpromo {text-align: center;} .LDpromo ._bold {font-weight:bold;} .LDpromo ._info {font-weight:bold;font-style:italic;text-decoration:underline dotted;}`)
    container.append(p);
    p.innerHTML = `<span class="_info">${GM_info.script.name} - ${GM_info.script.version}</span><br><span class="_bold">Enjoy this script?</span> Please <a href="https://greasyfork.org/en/scripts/558846-dragon-cave-large-dragons/feedback">rate it</a> and <a href="https://greasyfork.org/en/scripts/558846-dragon-cave-large-dragons">share it</a> with your friends!<br><span class="_bold">Find any issues? Have any suggestions?</span> Please let me know on <a href="https://greasyfork.org/en/scripts/558846-dragon-cave-large-dragons/feedback">GreasyFork</a> or <a href="https://github.com/BleatBytes/DragCave-Large-Dragons">Github</a>!`;
    return container
}

function setHTML() {
    let $parent = document.getElementById('middle');
    let $sibling = document.querySelector('#middle section');

    GM_addStyle(`
#largeDragons {
  margin-bottom: 10px;
  overflow: hidden;
}
#LDbutton {
  cursor: pointer;
  padding: 10px;
}
#LDbutton h3 {
  margin-top: 0!important;
}
#LDcollapsible {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  padding: 0 12px;
}
#LDtitle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.LDLabel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.LDLabel ._7i_6 {
  flex: 0 0 70%;
}
.LDarrow {
  font-size: 16pt;
  transition: transform 0.2s ease-out;
}
.LDarrow.active {
  transform: rotate(90deg);
  transition: transform 0.2s ease-out;
}
._13_0.warning::before {
  content: '\u26A0';
  color: #ffbf00;
  display: inline-block;
  margin-right: 7px;
}
.LDul {
  padding-top: 10px;
  padding-left: 5px;
}
.LDinput[type="number"] {
  width: 70%;
}
.LDdisabled {
  filter: opacity(.5);
  pointer-events: none;
}
`);

    const $root = document.createElement('div');
    $root.id = "largeDragons";

    const $collapsible = document.createElement('div');
    $collapsible.id = "LDcollapsible";
    const $button = document.createElement('div');
    $button.id = "LDbutton";

    const $title = document.createElement('h3');
    $title.textContent = `"${GM_info.script.name}" Settings`;
    const $titlecont = document.createElement('div');
    $titlecont.id = "LDtitle";
    const $arrow = document.createElement('span');
    $arrow.classList.add("LDarrow");
    $arrow.textContent = "\u2794";
    $titlecont.append($title, $arrow);

    $button.addEventListener("click", function() {
        this.classList.toggle("active");
        $arrow.classList.toggle("active");
        if ($collapsible.style.maxHeight) {
            $collapsible.style.maxHeight = null;
        } else {
            $collapsible.style.maxHeight = $collapsible.scrollHeight + "px";
        }
    });

    const $subtitle = document.createElement('span');
    $subtitle.classList.add("_7i_6");
    $subtitle.textContent = `These settings belong to the script "${GM_info.script.name}". The script's settings save automatically. Using round numbers is recommended.`;

    const $warning = document.createElement('i');
    $warning.classList.add("_13_0", "warning");
    $warning.setAttribute("aria-hidden", "true");
    $subtitle.prepend($warning);

    const $list = document.createElement('ul');
    $list.classList.add("_7i_0", "LDul");

    const chivo = elChivo();

    $button.append($titlecont, $subtitle);
    $collapsible.append($list);
    $collapsible.append(chivo);
    $root.append($button, $collapsible)
    $parent.insertBefore($root, $sibling)
    return $list
};

async function setHTMLInputs() {
    let $mobile = document.querySelector('body').classList.contains('mobile');
    let $ul = await setHTML();
    let $il = refObjs;
    let sub;

    for(let i = 0; i < $il.length; i++) {
        if (("mobile" in $il[i]) && $mobile){
            continue
        } else {
            let $this = $il[i];
            let $li = document.createElement('li');
            let $command;
            let $input = function(){
                let aux = document.createElement('input');
                aux.classList.add("LDinput");
                if (typeof GM_getValue($this.name) == 'boolean') {
                    aux.type = "checkbox";
                    aux.name = $this.name;
                    aux.checked = GM_getValue($this.name, $this.default);
                    $command = $this.name;
                    $li.dataset.role = $this.name;
                    sub = $this.name;
                    aux.addEventListener('change', (event) => {
                        for (const itm of Array.from(document.querySelectorAll(`[data-sub="${$this.name}"]`))) { itm.classList.toggle("LDdisabled") };
                    });
                } else if (typeof GM_getValue($this.name) == 'number') {
                    aux.type = "number";
                    aux.name = $this.name;
                    aux.placeholder = "2";
                    aux.min = "1";
                    aux.value = GM_getValue($this.name, $this.default);
                    aux.step = "1";
                    $li.dataset.sub = sub;
                    if (GM_getValue(sub) == false) { $li.classList.add("LDdisabled") };
                } else {
                    console.error(`"${GM_info.script.name}" - Couldn't assign value to variable "$input" (stored value is neither 'boolean' nor 'number').`)
                }
                return aux
            }();
            $input.addEventListener('change', (event) => {
                if (typeof GM_getValue($this.name) == 'boolean') {
                    GM_setValue($this.name, $input.checked)
                } else {
                    GM_setValue($this.name, Number($input.value))
                }
            });

            let $container = document.createElement('label');
            $container.classList.add("_7i_5", "LDLabel");

            let $explanation = document.createElement('span');
            $explanation.classList.add("_7i_6");
            let $title = document.createElement('span');
            $title.classList.add("_7i_4");
            $explanation.prepend($title);

            if ("header" in $this) {
                let $header = document.createElement("h3");
                $header.textContent = $this.header;
                $li.prepend($header);
                $explanation.textContent = $this.explanation;
                $title.textContent = $this.title;
            } else {
                let det = function(){
                    if (/(1)/.test($this.name)) { return "adult dragons"} else { return "eggs and hatchlings"}
                }();
                $title.textContent = `Multiply the size of ${det} by:`;
                $input.title = `Multiplies the size of ${det} by the set amount (for example, a value of "2" would make ${det} twice as large). Leave at 1 to not change their size.`;
            };

            let $inspan = document.createElement('span');
            $inspan.classList.add("_7i_7", "LDinspan");

            $inspan.append($input);
            $container.append($explanation, $inspan);
            $li.classList.add("_7i_8");
            $li.append($container);
            $ul.append($li);
        };
    };

    if ($mobile) {
        let $nonoLI = document.createElement('li');
        $nonoLI.classList.add("_7i_8")
        let $explanation = document.createElement('span');
        $explanation.classList.add("_7i_4");
        $explanation.textContent = `Due to the mobile site's layout, you can only change the size of dragons in their individual "/view/" pages and on the "/notifications/" page.`
        $nonoLI.append($explanation);
        $ul.prepend($nonoLI)
    };
    return $ul
};

async function setHTMLSelect() {
    let $last = await setHTMLInputs();
    let $sel = themeObjs;

    let $active = await Promise.resolve(initUI())
    let $current = $sel.filter(x => x.keyword == $active)[0];

    const $select = document.createElement('select');
    $select.name = "LDselect";
    $select.classList.add("LDselect");

    for (let i = 0; i < $sel.length; i++) {
        let $this = $sel[i];
        let $op = document.createElement('option');
        $op.value = $this.keyword;
        $op.textContent = $this.title;
        if ($op.value == $active) {
            $op.setAttribute("selected", "selected");
            $current = $sel[i];
        }
        $select.append($op)
    };

    function evalNumb(str) {
        if (/\d/.test(str)) {return "font"} else {return "font-family"}
    };

    GM_addStyle(`
#largeDragons {
  ${evalNumb($current.textFont)}: ${$current.textFont};
  border: ${$current.divBorder};
}
#LDbutton h3 {
  ${evalNumb($current.titleFont)}: ${$current.titleFont};
  color: ${$current.buttonText};
}
#LDbutton {
  color: ${$current.buttonText};
  background: ${$current.buttonIdle};
}
#LDbutton.active, #LDbutton:hover {
  color: ${$current.buttonTextActive};
  background: ${$current.buttonActive};
}
#LDbutton.active h3, #LDbutton:hover h3 {
  color: ${$current.buttonTextActive};
}
#LDcollapsible {
  color: ${$current.collText};
  background: ${$current.collBackground};
}
#LDcollapsible h3 {
  ${evalNumb($current.titleFont)}: ${$current.titleFont};
  color: ${$current.listTitle};
}
#LDcollapsible a {
  color: ${$current.aColor};
}
.LDLabel {
  color: ${$current.collText};
}
.LDul ._7i_4 {
  color: ${$current.listTitle};
}
`);

    $select.addEventListener("change", (event) => {
        GM_setValue("UIstyle", event.target.value)
    });

    const $li = document.createElement('li');
    $li.classList.add("_7i_8");
    $last.append($li);

    const $explanation = document.createElement('span');
    $explanation.classList.add("_7i_6");
    $explanation.textContent = "Change the script's theme to another one based on the site's themes. Will change on page reload.";

    const $title = document.createElement('span');
    $title.classList.add("_7i_4");
    $title.textContent = "Script settings theme"
    $explanation.prepend($title);

    const $selspan = document.createElement('span');
    $selspan.classList.add("_7i_7", "LDselspan");
    $selspan.append($select);

    const $container = document.createElement('label');
    $container.classList.add("_7i_5", "LDLabel");
    $container.append($explanation, $selspan);
    $li.append($container);

    let $header = document.createElement("h3");
    $header.textContent = "Script settings";
    $li.prepend($header);
};

function genEnlarge(el, n) {
    let h;
    if (el.hasAttribute('width') && el.hasAttribute('height')){
        h = el.getAttribute('height');
        el.setAttribute('width', el.getAttribute('width') * n);
        el.setAttribute('height', el.getAttribute('height') * n);
    } else {
        let newImg = new Image();
        newImg.onload = function(){
            h = this.height;
            el.setAttribute('width', this.width * n);
            el.setAttribute('height',this.height * n);
        };
        newImg.src = el.src;
    };
    if (/(max\-height)/.test(el.getAttribute("style"))) { el.setAttribute("style", `max-height: ${h * n}px!important; width: auto;`) }
};

const exec = function() {
    const ops = [
        {
            name: "view",
            boss: true,
            regex: /\/(view)\S+/,
            use: function(){ if (GM_getValue("viewCheck", false) == true) {turnBig("img[class='spr _6i_2']", "viewSize1", "viewSize2", "._6i_0 section > p")} }
        }, {
            name: "notif",
            boss: true,
            regex: /\/(notifications)/,
            use: function(){ if(GM_getValue("notifCheck", false) == true) { turnBig("._6c_6 img", "notifSize1", "notifSize2", "._6c_3 a")} }
        }, {
            name: "dragons",
            boss: true,
            regex: /\/((dragons)(\S+){0,})|((user)(\S+){0,})|((group)\/\d+)/,
            mobile: false,
            use: function(){ if (GM_getValue("listCheck", false) == true) {turnBig("._1l_0 img[class='_11_2']", "listSize1", "listSize2")} }
        }, {
            name: "account",
            regex: /\/(account)$/,
            use: function(){ setHTMLSelect() }
        }
    ];
    for (const item of ops) {
        if ("boss" in item) { // <- si depende de un toggle y el toggle es "true"
            if (!("mobile" in item) && (item.regex).test(location.href)) { // <- si no es exclusivo de desktop y la url coincide con el regex
                item.use();
            } else if (("mobile" in item) && (document.querySelector('body').classList.contains('mobile') == false)) { // <- si depende de la interfaz de la web y si no es la interfaz móvil
                (item.regex).test(location.href) && item.use();
            }
        } else if ((item.regex).test(location.href)) {
                item.use();
        }
    };
}();

async function turnBig(imgselector, adult, baby, secsel = "") {
    let regex = /((Hatchling)|(Egg)|(Your egg)|(their trade))/
    let dragons = await Array.from(document.querySelectorAll(imgselector));
    let adultN = GM_getValue(adult);
    let babyN = GM_getValue(baby);

    if (dragons[0].closest("table") == null) { // <- Sólo va a ser null si se está en /view/ o /notifications/
        let ages = Array.from(document.querySelectorAll(secsel));
        for (let i = 0; i < dragons.length; i++) {
            let dragon = dragons[i];
            let age = ages[i];
            let growthCheck = regex.test(age.textContent);

            if (growthCheck && (1 <= babyN)){ // <- Si es un adulto con valor mayor o igual a 1
                genEnlarge(dragon, babyN);
            } else if (!growthCheck && (1 <= adultN)) { // <- Si es un bebé con valor mayor o igual a 1
                genEnlarge(dragon, adultN);
            };
        };
    } else { // <- Asumiendo que se trata de una página con elementos de tabla (/dragons/, /group/, etc etc)
        let table = dragons[0].closest("table");

        for (var i = 1, row; row = table.rows[i]; i++) {
            let img = row.cells[0].querySelector("img");
            let age = row.cells[2].textContent;
            let ageCheck = age.match(regex);

            if ( !ageCheck && (1 <= adultN)){ // <- Si es un adulto con valor mayor o igual a 1
                genEnlarge(img, adultN);
            } else if (ageCheck && (1 <= babyN)) { // <- Si es un bebé con valor mayor o igual a 1
                genEnlarge(img, babyN);
            };
        };
    };
    GM_addStyle(`${imgselector} { image-rendering: crisp-edges; }`);
};
