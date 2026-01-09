// ==UserScript==
// @name         Dragon Cave - Large Dragons
// @namespace    https://github.com/BleatBytes/DragCave-Large-Dragons
// @version      v1.9
// @description  Makes dragons in Dragon Cave appear larger on their View page, on a User's page, and on a user's Dragons page.
// @author       Valen
// @match        *://dragcave.net/account
// @match        *://dragcave.net/view*
// @match        *://dragcave.net/user*
// @match        *://dragcave.net/dragons*
// @match        *://dragcave.net/group*
// @icon         https://icons.duckduckgo.com/ip2/dragcave.net.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/558846/Dragon%20Cave%20-%20Large%20Dragons.user.js
// @updateURL https://update.greasyfork.org/scripts/558846/Dragon%20Cave%20-%20Large%20Dragons.meta.js
// ==/UserScript==

const refObjs = [
    { name:'listCheck', default: true, title:'Make dragons in scrolls and groups larger', explanation:'Makes dragons appear larger in "/dragons/", "/group/", and "/user/" pages.' },
    { name:'listSize1', default: 2, title:'Make adult dragons in scrolls and groups larger by:', explanation:'Will multiply adult dragon size by the set amount.' },
    { name:'listSize2', default: 1, title:'Make hatchlings and eggs in scrolls and groups larger by:', explanation:'Will multiply hatchling/egg size by the set amount.  Leave as "1" to keep eggs/hatchlings small.' },
    { name:'viewCheck', default: true, title:'Make dragons in view pages larger', explanation:'Makes dragons appear larger in their individual "/view/" pages.' },
    { name:'viewSize1', default: 2, title:'Make adult dragons in view pages larger by:', explanation:'Will multiply adult dragon size by the set amount.' },
    { name:'viewSize2', default: 1, title:'Make hatchlings and eggs in view pages larger by:', explanation:'Will multiply hatchling/egg size by the set amount. Leave as "1" to keep eggs/hatchlings small.' }
];
const themeObjs = [
    { title:"Default theme", keyword: "def", button1: "#886945", button2: "#a7432d", buttontxt: "#fff", collp1: "#fff0", collp2: "#44300b", collptxt: "#000", border: "#fff0" },
    { title:"Portal 2", keyword: "p2", button1: "#378db0", button2: "#d38333", buttontxt: "#fff", collp1: "#fff0", collp2: "#fff", collptxt: "#ddd", border: "#a4a4a473" },
    { title:"Portal 2 Light", keyword: "p2l", button1: "#2db2e6", button2: "#ff9315", buttontxt: "#fff", collp1: "#fff0", collp2: "#000", collptxt: "#000", border: "#a49a8e38" },
    { title:"St. Patrick's Day", keyword: "spd", button1: "#b1f7b5", button2: "#639c63", buttontxt: "#153e15", collp1: "#fff0", collp2: "#153e15", collptxt: "#153e15", border: "#b1f7b5" },
    { title:"1960s", keyword: "six", button1: "#782e15", button2: "#782e15", buttontxt: "#f9f9f9", collp1: "#fff0", collp2: "#6e2910", collptxt: "#000", border: "#fff0" },
];

const initMem = function() {
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
    if (GM_getValue("UIstyle") == undefined) {
        GM_setValue("UIstyle", "def")
    }
}();

function setHTML() {
    let $container = document.getElementById('middle');

    GM_addStyle(`
#largeDragons {
  margin-bottom: 10px;
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
.LDarrow {
  font-size: 16pt;
  transition: transform 0.2s ease-out;
}
.LDarrow.active {
  transform: rotate(90deg);
  transition: transform 0.2s ease-out;
}
._13_0.warning::before {
  content: '${"\\21".toString()}';
  margin: 2px;
  padding: 1px 5px;
  border: 1px solid #000;
  border-radius: 50%;
  color: #000;
  background-color: #ffbf00;
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
    $arrow.textContent = "\u{23F5}";
    $titlecont.append($title, $arrow);

    $button.addEventListener("click", function() {
        this.classList.toggle("active");
        $arrow.classList.toggle("active");
        if ($collapsible.style.maxHeight) {
            $collapsible.style.maxHeight = null;
        } else {
            $collapsible.style.maxHeight = $collapsible.scrollHeight + "px";
        }
    })

    const $subtitle = document.createElement('span');
    $subtitle.classList.add("_7i_6");
    $subtitle.textContent = `These settings belong to the script "${GM_info.script.name}". The script's settings save automatically. Using round numbers is recommended.`;

    const $warning = document.createElement('i');
    $warning.classList.add("_13_0", "warning");
    $warning.setAttribute("aria-hidden", "true");
    $subtitle.prepend($warning);

    const $list = document.createElement('ul');
    $list.classList.add("_7i_0");
    $list.setAttribute("style", "padding-top: 10px;");

    $button.append($titlecont, $subtitle);
    $collapsible.append($list);
    $root.append($button, $collapsible)
    $container.prepend($root)
    return $list
}

async function setHTMLInputs() {
    let $mobile = document.querySelector('body').classList.contains('mobile');
    let $ul = await setHTML();
    let $il = refObjs;

    for(let i = 0; i < $il.length; i++) {
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
            } else if (typeof GM_getValue($this.name) == 'number') {
                aux.type = "number";
                aux.name = $this.name;
                aux.placeholder = "2";
                aux.min = "1";
                aux.value = GM_getValue($this.name, $this.default);
                aux.step = "1";

                $li.dataset.role = $command;
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

        let $explanation = document.createElement('span');
        $explanation.classList.add("_7i_6");
        $explanation.textContent = $this.explanation;

        let $title = document.createElement('span');
        $title.classList.add("_7i_4");
        $title.textContent = $this.title;
        $explanation.prepend($title);

        let $inspan = document.createElement('span');
        $inspan.classList.add("_7i_7", "LDinspan");
        $inspan.append($input);

        let $container = document.createElement('label');
        $container.classList.add("_7i_5");
        $container.append($explanation, $inspan);

        $li.classList.add("_7i_8", "LDlist", $input.type);
        $li.append($container);
        $ul.append($li);
    }
    if ($mobile) {
        let $invalidchecks = Array.from(document.querySelectorAll('.LDlist[data-role="listCheck"]'));
        let $nonoLI = document.createElement('li');
        $nonoLI.classList.add("_7i_8", "LDlist")
        $ul.prepend($nonoLI);
        for(let i = 0; i < $invalidchecks.length; i++) {
            let $check = $invalidchecks[i];
            $check.remove();
        }
        let $explanation = document.createElement('span');
        $explanation.classList.add("_7i_4");
        $explanation.textContent = `Due to the mobile site's layout, you can only change the size of dragons in their individual "/view/" pages.`
        $nonoLI.append($explanation);
    }
    return $ul
}

async function setHTMLSelect() {
    let $last = await setHTMLInputs();
    let $sel = themeObjs;
    let $active = GM_getValue("UIstyle");
    let $current;

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

    GM_addStyle(`
#largeDragons {
  border: 2px solid ${$current.border};
}
#LDbutton h3 {
  color: ${$current.buttontxt};
}
#LDbutton {
  color: ${$current.buttontxt};
  background-color: ${$current.button1};
}
#LDbutton.active, #LDbutton:hover {
  background-color: ${$current.button2};
}
#LDcollapsible {
  color: ${$current.collptxt};
  background-color: ${$current.collp1};
}
.LDlist ._7i_4 {
  color: ${$current.collp2};
}
`);

    $select.addEventListener("change", (event) => {
        GM_setValue("UIstyle", event.target.value)
    });

    const $li = document.createElement('li');
    $li.classList.add("_7i_8", "LDlist", "select");
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
    $container.classList.add("_7i_5");
    $container.append($explanation, $selspan);
    $li.append($container);
};

function genEnlarge(el, n) {
    let w;
    let h;
    if (el.hasAttribute('width') && el.hasAttribute('height')){
        w = el.getAttribute('width');
        h = el.getAttribute('height');
        el.setAttribute('width', w * n);
        el.setAttribute('height', h * n);
    } else {
        let newImg = new Image();
        newImg.onload = function(){
            const imgWidth = this.width;
            const imgHeight = this.height;
            el.setAttribute('width', imgWidth * n);
            el.setAttribute('height', imgHeight * n);
        };
        newImg.src = el.src;
    };
};

const exec = function() {
    let views = GM_getValue("viewCheck");
    let lists = GM_getValue("listCheck");

    switch(true) {
        case /\/(account)$/.test(location.href):
            setHTMLSelect()
            break;
        case (views == true && /\/(view)\S+/.test(location.href)):
            turnBig("img[class='spr _6i_2']", "viewSize1", "viewSize2");
            break;
        //case ((GM_getValue("listCheck") && document.querySelector('body').classList.contains('mobile') == false)) && :
        case (lists == true && document.querySelector('body').classList.contains('mobile') == false) && /\/(dragons)(\S+){0,}/.test(location.href):
            turnBig("#dragonlist img[class='_11_2']", "listSize1", "listSize2");
            break;
        case (lists == true && document.querySelector('body').classList.contains('mobile') == false) && /\/(user)(\S+){0,}/.test(location.href):
            //await fakeID(); // <- Haciendo trampa (?
            turnBig("._1l_0 img[class='_11_2']", "listSize1", "listSize2");
            break;
        case (lists == true && document.querySelector('body').classList.contains('mobile') == false) && /\/(group)\/\d+/.test(location.href):
            turnBig("#udragonlist img[class='_11_2']", "listSize1", "listSize2");
            break;
        default:
            console.log(`${GM_info.script.name}: no valid action (can't find dragon/s to resize.)`);
    }
}();

async function turnBig(imgselector, adult, baby) {
    let regex = /^(((h|H)atchling)|((e|E)gg))/
    let dragons = await Array.from(document.querySelectorAll(imgselector));
    console.log(imgselector, "/", dragons)
    let adultN = GM_getValue(adult);
    let babyN = GM_getValue(baby);

    if (dragons[0].closest("table") == null) { // <- Sólo va a ser null si se está en /view/
        dragons = dragons.reduce(x => x);
        let growthCheck = document.querySelector("._6i_0 section > p").textContent.match(regex);

        if ( !growthCheck && (1 <= adultN)){ // <- Si es un adulto con valor mayor o igual a 1
            genEnlarge(dragons, adultN);
        } else if (growthCheck && (1 <= babyN)) { // <- Si es un bebé con valor mayor o igual a 1
            genEnlarge(dragons, babyN);
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
