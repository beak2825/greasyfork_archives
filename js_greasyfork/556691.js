// ==UserScript==
// @name         HomDGCatBeautified
// @icon         https://homdgcat.wiki/favicon.ico
// @namespace    https://github.com/lucisurbe/js
// @version      33
// @description  Reform the ugly styles in homdgcat.wiki.
// @author       LucisUrbe
// @run-at       document-end
// @match        *://homdgcat.wiki/*
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/556691/HomDGCatBeautified.user.js
// @updateURL https://update.greasyfork.org/scripts/556691/HomDGCatBeautified.meta.js
// ==/UserScript==

'use strict';

/*\
|*|
|*|	:: cookies.js ::
|*|
|*|	A complete cookies reader/writer framework with full unicode support.
|*|
|*|	Revision #8 - February 18th, 2020
|*|
|*|	https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|	https://developer.mozilla.org/User:fusionchess
|*|	https://github.com/madmurphy/cookies.js
|*|
|*|	This framework is released under the GNU Public License, version 3 or later.
|*|	http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|	Syntaxes:
|*|
|*|	* docCookies.setItem(name, value[, end[, path[, domain[, secure[, same-site]]]]])
|*|	* docCookies.getItem(name)
|*|	* docCookies.removeItem(name[, path[, domain[, secure[, same-site]]]])
|*|	* docCookies.hasItem(name)
|*|	* docCookies.keys()
|*|	* docCookies.clear([path[, domain[, secure[, same-site]]]])
|*|
\*/

(function () {
    function makeSetterString(sKey, sValue, vEnd, sPath, sDomain, bSecure, vSameSite) {
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    /*
                    Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
                    version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
                    the end parameter might not work as expected. A possible solution might be to convert the the
                    relative time to an absolute time. For instance you could replace the previous line with:

                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
                    */
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        return encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires +
            (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "") +
            (
                !vSameSite || vSameSite.toString().toLowerCase() === "no_restriction"
                    ? "" : vSameSite.toString().toLowerCase() === "lax" || Math.ceil(vSameSite) === 1 || vSameSite === true
                        ? "; samesite=lax" : vSameSite.toString().toLowerCase() === "none" || vSameSite < 0
                            ? "; samesite=none" : "; samesite=strict"
            );
    }

    var reURIAllowed = /[\-\.\+\*]/g, reCNameAllowed = /^(?:expires|max\-age|path|domain|secure|samesite|httponly)$/i;

    window.docCookies = {
        "getItem": function (sKey) {
            if (!sKey) { return null; }
            return decodeURIComponent(
                document.cookie.replace(
                    new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(reURIAllowed, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"),
                    "$1"
                )
            ) || null;
        },
        "setItem": function (sKey, sValue, vEnd, sPath, sDomain, bSecure, vSameSite) {
            if (!sKey || reCNameAllowed.test(sKey)) { return false; }
            document.cookie = makeSetterString(sKey, sValue, vEnd, sPath, sDomain, bSecure, vSameSite);
            return true;
        },
        "removeItem": function (sKey, sPath, sDomain, bSecure, vSameSite) {
            if (!this.hasItem(sKey)) { return false; }
            document.cookie = makeSetterString(sKey, "", "Thu, 01 Jan 1970 00:00:00 GMT", sPath, sDomain, bSecure, vSameSite);
            return true;
        },
        "hasItem": function (sKey) {
            if (!sKey || reCNameAllowed.test(sKey)) { return false; }
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(reURIAllowed, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        "keys": function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
                aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
            }
            return aKeys;
        },
        "clear": function (sPath, sDomain, bSecure, vSameSite) {
            for (var aKeys = this.keys(), nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
                this.removeItem(aKeys[nIdx], sPath, sDomain, bSecure, vSameSite);
            }
        }
    };
})();

function insertCSS(cssString) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = cssString;
    document.head.appendChild(style);
}

async function renderAvatarMats(name, skillDays, skillMat) {
    async function fetchItemNameById(id) {
        try {
            const itemResponse = await fetch('https://homdgcat.wiki/gi/CH/item.js');
            if (!itemResponse.ok) {
                console.warn(`[HomDGCatBeautified] Failed to fetch item data`);
                return;
            }
            const itemText = await itemResponse.text();
            // Create a local scope for _items to safely evaluate
            const code = `(function() {
                let window = {};
                ${itemText}
                return typeof _items !== 'undefined' ? _items : window._items;
            })()`;

            const _items = eval(code);

            if (Array.isArray(_items) && _items[3]) {
                const item = _items[3].find(obj => obj._id === id);
                return item ? item.Name.slice(0, 4) : '???';
            } else {
                return '???';
            }
        } catch (error) {
            console.error('[HomDGCatBeautified] Error fetching or processing the item.js file:', error);
            return '???';
        }
    }

    function accumulateMats(list) {
        const result = {};
        for (const stage of list) {
            for (const [k, v] of Object.entries(stage)) {
                result[k] = (result[k] || 0) + v;
            }
        }
        return result;
    }

    function buildMatBlock(title, matDict) {
        const matIconPath = '../../homdgcat-res/Mat/UI_ItemIcon_';
        const matLinkPrefix = '/gi/item/';
        const matSuffix = '?lang=CH';

        const p = document.createElement('p');
        p.style.cssText = 'width: 100%; text-align: center;';
        p.textContent = title;

        const wrap = document.createElement('div');
        wrap.id = 'ascension_mat';
        wrap.style.cssText = 'display: flex; justify-content: center; flex-wrap: wrap; margin: 0px 0px 15px;';

        const matDiv = document.createElement('div');
        matDiv.className = 'avatar_mat';

        for (const [id, count] of Object.entries(matDict)) {
            const a = document.createElement('a');
            a.className = 'mat_a hover-shadow';
            a.href = `${matLinkPrefix}${id}${matSuffix}`;

            const img = document.createElement('img');
            img.loading = 'lazy';
            img.src = `${matIconPath}${id}.png`;
            img.className = 'img_2';

            const span = document.createElement('span');
            span.className = 'mat_num';
            span.textContent = count;

            a.appendChild(img);
            a.appendChild(span);
            matDiv.appendChild(a);
        }

        wrap.appendChild(matDiv);
        return [p, wrap];
    }

    const expMaterials = {
        '202': 1673400,
        '104001': 22,
        '104002': 13,
        '104003': 414
    };

    const promMats = accumulateMats(_AvatarMats_[name]?.Promotion || []);
    const talentMats = accumulateMats(_AvatarMats_[name]?.E || []);

    // Merge exp materials with promotion mats
    const fullPromMats = { ...promMats };
    for (const [id, count] of Object.entries(expMaterials)) {
        fullPromMats[id] = (fullPromMats[id] || 0) + count;
    }

    // Append to .after_1
    const target = document.querySelector('.after_1');
    if (!target) return;

    const [p1, d1] = buildMatBlock('角色突破满级素材', fullPromMats);
    const [p2, d2] = buildMatBlock('单个天赋满级素材', talentMats);

    target.appendChild(p1);
    target.appendChild(d1);
    target.appendChild(p2);
    const skillMatDetails = document.createElement('p');
    skillMatDetails.style.cssText = 'width: 100%; text-align: center; font-size: 14px;';
    const skillMatName = await fetchItemNameById(skillMat);
    skillMatDetails.textContent = `天赋素材：${skillMatName}     获取日：${computer_.AvatarTalentConfig[skillDays].CH}`;
    target.appendChild(skillMatDetails);
    target.appendChild(d2);
}

function fillInfoContainer(label, statValue, infoContainer) {
    infoContainer.style.display = 'flex';
    infoContainer.style.flexWrap = 'wrap';
    infoContainer.style.justifyContent = 'space-between';
    infoContainer.style.margin = '15px';
    const statDiv = document.createElement('div');
    statDiv.style.flex = '1 1 100px'; // flexible width, min 100px
    statDiv.style.display = 'flex';
    statDiv.style.flexDirection = 'column';
    statDiv.style.alignItems = 'center';
    const statKeySpan = document.createElement('span');
    statKeySpan.textContent = label;
    statKeySpan.id = 'statKeySpan';
    statKeySpan.style.fontWeight = 'bold';
    statKeySpan.style.color = '#aaa';
    const statValueSpan = document.createElement('span');
    statValueSpan.textContent = statValue;
    statValueSpan.id = 'statValueSpan';
    statDiv.appendChild(statKeySpan);
    statDiv.appendChild(statValueSpan);
    infoContainer.appendChild(statDiv);
}

function handleAbyss() {
    const beforeSpan = document.createElement('span');
    const afterSpan = document.createElement('span');
    beforeSpan.textContent = '深境螺旋 第';
    afterSpan.textContent = '层';
    document.querySelector('p:has(> .f_o)').insertBefore(beforeSpan, document.querySelector('.f_o'));
    document.querySelector('p:has(> .f_o)').insertBefore(afterSpan, document.querySelector('.f_r'));
    insertCSS(`
        .result { padding: 20px; }
        .eachets > :nth-child(2) { visibility: visible !important; opacity: 1 !important; } /* mouse hover indicators*/
    `);
    document.querySelectorAll('.bossguide_p').forEach((e) => {
        if (e.style.textAlign === 'center') e.remove();
    });
    document.querySelectorAll('.dps-show').forEach((e) => {
        e.firstChild.textContent = e.firstChild.textContent.replace('HP', '本间总生命值');
    });
    document.querySelector('.hp_coeff').firstChild.textContent = '生命值系数 ';
}

function handle3Boss() {
    document.querySelectorAll('img.elem[src="/homdgcat-res/UI/check.png"], img.elem[src="/homdgcat-res/UI/close.png"]').forEach(img => {
        const isYes = img.getAttribute('src').includes('check.');
        const parent = img.parentNode;
        parent.style.borderRadius = '99px';
        parent.style.backgroundColor = isYes ? '#44725d' : '#724444';
        parent.style.paddingLeft = '7px';
        parent.style.paddingRight = '7px';
        parent.style.lineHeight = '35px';
        const vtText = parent.querySelector('.vt_text');
        vtText.style.display = 'flex';
        vtText.style.alignItems = 'center';
        vtText.innerHTML = (isYes ? '👍&nbsp;' : '👎&nbsp;') + vtText.innerHTML;
        vtText.querySelectorAll('.elem').forEach(imgElem => {
            imgElem.className = '';
            imgElem.style.width = '35px';
        });
        img.remove();
    });
    const difDescList = {
        'N1': '普通',
        'N2': '进阶',
        'N3': '困难',
        'N4': '险恶',
        'N5': '无畏',
        'N6': '绝境',
        'N5/6': '无畏」/「绝境'
    };
    const difficulty = document.querySelector('.f_o');
    const difDesc = difDescList[difficulty.textContent];
    difficulty.textContent = `幽境危战 难度${difficulty.textContent.slice(1)}「${difDesc}」`;
    // Add explicit titles and change colors.
    document.querySelectorAll('.mon_hp_div > .desc_hp').forEach((e) => {
        e.querySelectorAll('color').forEach(c => c.style = 'color: #FFD780;');
        e.innerHTML = '生命值 ' + e.innerHTML;
    });
    // Add CSS styles.
    insertCSS(`
        /* Hide self-advertisements. */
        .block_2 > .mon_buff_bigger:nth-child(4) { display: none !important; }
        /* Make monsters show as cards. */
        .block_1 {
            background-color: #27363e;
            border-radius: 5px;
            margin: 4px;
            padding: 10px 15px 10px;
            color: #eeeeee;
        }
        @media screen and (min-width: 1000px) {
            .block_1 { width: calc((100% / 3) - 10px); }
        }
        /* Fix colors. */
        .f_o, .ver { color: white; }
        .ver_text { border-color: white; }
        .hp_a { color: #FFD780 !important; }
    `);
    // Swap the positions of the toggles.
    // Note: If width is bigger than 1000px, there are only 1 such card pair.
    // Note: If width is smaller than or equal to 1000px, there are 3 such card pairs.
    const pairs = window.innerWidth > 1000 ?
        [['.area_guide_hdg', '.area_guide_official']]:
        [
            ['.area_guide_hdg:nth-child(2)', '.area_guide_official:nth-child(3)'],
            ['.area_guide_hdg:nth-child(5)', '.area_guide_official:nth-child(6)'],
            ['.area_guide_hdg:nth-child(8)', '.area_guide_official:nth-child(9)']
        ];
    pairs.forEach((pair, index) => {
        const [selector1, selector2] = pair;
        const element1 = document.querySelector(selector1);
        const element2 = document.querySelector(selector2);
        if (element1 && element2) {
            const parent1 = element1.parentNode;
            const parent2 = element2.parentNode;
            const nextSibling1 = element1.nextSibling;
            const nextSibling2 = element2.nextSibling;
            if (nextSibling1 === element2) { // element1 is immediately before element2
                parent1.insertBefore(element2, element1);
            } else if (nextSibling2 === element1) { // element2 is immediately before element1
                parent2.insertBefore(element1, element2);
            } else { // General case - elements may be in different parents
                parent1.insertBefore(element2, nextSibling1);
                parent2.insertBefore(element1, nextSibling2);
            }
            console.log(`[HomDGCat Beautified] Successfully swapped pair ${index + 1}`);
        } else {
            console.warn(`[HomDGCat Beautified] Pair ${index + 1} - Elements not found:`, selector1, selector2);
        }
    });
    // Also, expand all cards by clicking if width is smaller than or equal to 800.
    if (window.innerWidth <= 800) document.querySelectorAll('.b1_plus, .b2_plus').forEach(e => e.click());
}

function handleMaze() {
    // Show all random choices.
    insertCSS(`
        .rotate_child {
            display: flex !important;
            border-style: solid;
            border-width: 1px;
            border-color: #79b7cf;
        }
    `);
    // Rename buttons.
    document.querySelectorAll('.typ > .sch').forEach((e) => {
        if (e.innerHTML === '拍照动作') e.innerHTML = '表演诀窍';
    });
    // Hide refresh button if only 1 choice.
    document.querySelectorAll('.rotate').forEach((e) => {
        if (e.getAttribute('data-id') === '1') {
            const refreshButton = e.parentNode.querySelector('p > .rel');
            if (refreshButton) refreshButton.style.display = 'none';
        }
    });
    // Rename non-standard words.
    document.querySelectorAll('.card_flex > .tip_ > b').forEach((e) => {
        e.innerHTML = e.innerHTML.replace('s', '秒').replace('x', '×');
    });
    document.querySelectorAll(`
        .card_3 > p[style*=color]:not(.mon_desc),
        .card_4 > p[style*=color]:not(.mon_desc)
    `).forEach(e => 
        e.firstChild.textContent = e.firstChild.textContent.replace('Lv', 'Lv. ')
    );
    document.querySelectorAll('.card_2:nth-child(6) > div > .card_4 > p[style*=bold]')
        .forEach(
            e => e.innerHTML = e.innerHTML
                .replace('圣牌一', '圣牌1（第四幕出现）')
                .replace('圣牌二', '圣牌2（第七幕出现）')
        );
    // Move boss descriptions inside.
    document.querySelectorAll('.mon_desc').forEach((e, index) => {
        if (index === 4) {
            const targetCard = e?.parentElement?.previousSibling?.firstChild;
            if (targetCard) targetCard.appendChild(e);
        }
        else {
            const targetCard = e?.parentElement?.previousSibling?.lastChild;
            if (targetCard) targetCard.appendChild(e);
        }
    });
}

function handleChange() {
    document.querySelectorAll(
        'h3:has(> .title), p.countdown, schedule.hover-shadow, section.cl, section.cl2, section.select_parts, div.common-area'
    ).forEach(e => e.remove());
    document.querySelectorAll('div.a_section_head.head_withimg > p').forEach((p) => {
        p.lastChild.textContent = p.lastChild.textContent.replace(' +', '');
        p.click();
    });
}

function handleWeapon() {
    const verSelected = document.querySelector('.stat_ver_choose_w').firstChild;
    const weaponVersion = verSelected.options[verSelected.selectedIndex].text;
    const weaponDataObject = JSON.parse(
        JSON.stringify(
            _WeaponConfig?.find(
                e => e.Name === document.querySelector('.a_section_head')?.firstChild?.innerHTML
            )
        )
    );
    const weaponGrade = weaponDataObject['Rank'];
    const verInfoNode = document.querySelector('.stat_ver_choose_w');
    verInfoNode.style.textAlign = 'center';
    verInfoNode.innerHTML = '<p style="font-size: 14px">稀有度：' + weaponGrade + '星     数据版本：' + weaponVersion + '</p>';
    document.querySelector('.nsc').appendChild(verInfoNode);
}

async function handleAvatar(attribute) {
    console.log('[HomDGCatBeautified] Change on attribute active: ' + attribute);
    if (document.querySelector('#statKeySpan')) {
        console.log('[HomDGCatBeautified] Already beautified: ' + attribute);
    }
    else if (attribute === 'Skills') {
        // Phase A: add splitters.
        const splitters = [
            ['战斗天赋', '.shows_1'],
            ['固有天赋', '.shows_2'],
            ['命之座', '.shows_3']
        ];
        if (document.querySelectorAll('.a_section:not(.shows)').length > 5) {
            splitters.push(['相关效果', '.a_section:has(> .a_section_head)']);
        }
        splitters.forEach(([title, anchor]) => {
            const headingDiv = document.createElement('div');
            headingDiv.style.fontSize = '1.2rem';
            headingDiv.innerHTML = title;
            document.querySelector('.a_data').insertBefore(headingDiv, document.querySelectorAll(anchor)[0]);
        });
        // Phase B: add word explanations.
        document.querySelectorAll('.avatar_stats:not([style])').forEach((e) => {
            const levelTag = e.firstChild.lastChild.firstChild.firstChild.firstChild;
            levelTag.textContent = levelTag.textContent.replace('Lv', 'Lv. ');
            const bonusStat = e.lastChild.lastChild.firstChild;
            // Note that these are &nbsp; Not typical spaces.
            bonusStat.textContent = bonusStat.textContent.replace('   ', '   突破提升：');
        });
        const baseEMStat = document.querySelector('.avatar_stats[style]')?.firstChild?.firstChild?.firstChild;
        if (baseEMStat) baseEMStat.textContent = baseEMStat.textContent.replace('元素精通', '基础元素精通');
        document.querySelectorAll('.skill_lv_show')?.forEach((e) => {
            e.innerHTML = e.innerHTML.replace('Lv', '详细属性（Lv. ') + '）';
        });
        document.querySelectorAll('.skill_lv_up')?.forEach((e) => {
            e.addEventListener('mouseup', () => {
                setTimeout(() => {
                    document.querySelectorAll('.skill_lv_show')?.forEach((e) => {
                        e.innerHTML = e.innerHTML.replace('Lv', '详细属性（Lv. ') + '）';
                    });
                }, 300);
            });
        });
        document.querySelectorAll('.skill_lv_down')?.forEach((e) => {
            e.addEventListener('mouseup', () => {
                setTimeout(() => {
                    document.querySelectorAll('.skill_lv_show')?.forEach((e) => {
                        e.innerHTML = e.innerHTML.replace('Lv', '详细属性（Lv. ') + '）';
                    });
                }, 300);
            });
        });
        // Phase C: add missing statistics.
        const avatarDataObject = JSON.parse(
            JSON.stringify(
                __AvatarInfoConfig?.find(
                    e => e.Name === document.querySelector('.as_right')?.firstChild?.innerHTML
                )
            )
        );
        // C.1 Version
        let verSelected = document.querySelector('.stat_ver_choose').firstChild;
        avatarDataObject.Version = verSelected.options[verSelected.selectedIndex].text;
        // C.2 Element
        const elements = {
            'Fire': '火',
            'Water': '水',
            'Elec': '雷',
            'Ice': '冰',
            'Wind': '风',
            'Rock': '岩',
            'Grass': '草',
        };
        if (avatarDataObject?.Element in elements) {
            avatarDataObject.Element = elements[avatarDataObject.Element];
        }
        // C.3 Weapon
        const weapons = {
            'Sword': '单手剑',
            'Claymore': '双手剑',
            'Catalyst': '法器',
            'Pole': '长柄武器',
            'Bow': '弓',
        };
        if (avatarDataObject?.Weapon in weapons) {
            avatarDataObject.Weapon = weapons[avatarDataObject.Weapon];
        }
        // C.4 Type
        const types = {
            'Girl': '少女',
            'Lady': '成女',
            'Loli': '萝莉',
            'Boy': '少男',
            'Male': '成男',
        };
        if (avatarDataObject?.Type in types) {
            avatarDataObject.Type = types[avatarDataObject.Type];
        }
        // C.5 Nation
        const nations = {
            'Mondstadt': '蒙德',
            'Liyue': '璃月',
            'Inazuma': '稻妻',
            'Sumeru': '须弥',
            'Fontaine': '枫丹',
            'Natlan': '纳塔',
        };
        if (avatarDataObject?.Nation in nations) {
            avatarDataObject.Nation = nations[avatarDataObject.Nation];
        }
        // C.6 Grade
        if (!avatarDataObject?.Grade?.toString()?.includes('星')) {
            avatarDataObject.Grade = avatarDataObject?.Grade?.toString() + '星';
        }
        // C.7 Birthday
        if (avatarDataObject?.Birthday && avatarDataObject?.Birthday !== '1/1') {
            avatarDataObject.Birthday = avatarDataObject.Birthday.replace('/', '月') + '日';
        }
        // C.8 Origin
        avatarDataObject.Origin = 'HomDGCat';
        // C.9 Results
        const infoContainer = document.createElement('div');
        [
            ['Version', '数据版本'],
            ['Grade', '稀有度'],
            ['Element', '元素'],
            ['Weapon', '武器类型'],
            ['Constellation', '命之座'],
            ['Type', '角色体型'],
            ['Title', '角色标题'],
            ['Nation', '所属区域'],
            ['Birthday', '生日'],
            ['Belong', '所属'],
            ['Desc', '介绍'],
            ['Origin', '游戏内容来源'],
        ].forEach(([key, label]) => {
            let statValue = avatarDataObject[key]?.toString() || '';
            if (statValue !== '' && statValue !== '1/1' && statValue !== '？？？' && statValue !== '???') {
                fillInfoContainer(label, statValue, infoContainer);
            }
        });
        const infoContainerWrapper = document.createElement('div');
        infoContainerWrapper.classList.add('a_section');
        infoContainerWrapper.appendChild(infoContainer);
        document.querySelector('.a_data').insertBefore(infoContainerWrapper, document.querySelector('.a_section:has(> .as_2)'));
        // Phase D: add clear materials
        await renderAvatarMats(avatarDataObject._name, avatarDataObject.TalentMat, avatarDataObject.TalentMatt);
        // Phase E: modify skill titles
        const skillTypes = ['普通攻击', '元素战技', '元素爆发'];
        document.querySelectorAll('.battle_desc').forEach((e, index) => {
            const skillType = document.createElement('p');
            skillType.innerHTML = skillTypes[index];
            skillType.style.paddingTop = '15px';
            skillType.style.paddingLeft = '15px';
            skillType.style.fontSize = '15px';
            // skillType.style.color = '#9fc9e0';
            e.insertBefore(skillType, e.firstElementChild);
        });
        document.querySelectorAll('.shows_2 > .a_section_head > .head_right').forEach((e, index) => {
            e.innerHTML = (index + 1) + '. ' + e.innerHTML;
        });
        document.querySelectorAll('.shows_3 > .a_section_head > .head_right').forEach((e, index) => {
            e.innerHTML = e.innerHTML.replace((index + 1), (index + 1) + '.');
        });
        document.querySelector('span.active').setAttribute('beautified', 'YES');
    }
    else if ([
        'Passives Constellations',
        'Material Calculator',
        'Track Updates',
        'HomDGCat\'s Notes',
        'Stories',
        'Voicelines'
    ].includes(attribute)) {
        let infoContainer = document.createElement('div');
        fillInfoContainer('游戏内容来源', 'HomDGCat', infoContainer);
        document.querySelector('div:has(> .as)')?.appendChild(infoContainer);
        document.querySelectorAll('#statKeySpan, #statValueSpan').forEach((e) => {
            e.style.fontSize = '12px';
            e.style.lineHeight = '1.2';
        });
        document.querySelector('#statKeySpan').parentNode.parentNode.style.margin = '0px';
        document.querySelector('span.active').setAttribute('beautified', 'YES');
    }
    else console.log(`[HomDGCatBeautified] ${attribute} is not a desired tab, skipping.`);
}

function addStyles(choice) {
    insertCSS(`
        #back_2, /* back badge */ hr.shows, /* white split lines */ .pic_dl, .to_mtc, /* useless buttons */
        .avd, .a_section:has(> .as_2), /* self introduction advertisement banner */
        .c1.c_f, .c2.c_f, .age, .emote, .keq_emote_div, .emote_block_, .emote_, .game_img, /* psoriasis */
        .stat_ver_choose, /* version dropdown menu */
        #skill_mat { display: none !important; } /* inaccurate materials */
        select { appearance: none; text-align-last: center; } /* select dropdown menu arrows */
        .up, .down, .skill_lv_up, .skill_lv_down, .dl_button, .show_up, .yunli_button,
        .f_l, .f_r, .v_l, .v_r { opacity: 0; } /* download button and arrows */
        body, html { height: unset !important; overflow: unset !important; } /* oppose non-standard scrolling */
    `);
    if (choice === 'GI') {
        insertCSS(`
            @font-face {
                font-family: 'HYWenHei';
                font-weight: 300;
                src: url(https://cdn.jsdelivr.net/gh/PaiGramTeam/PaiGram@main/resources/fonts/HYWenHei-35W.ttf)
                /* This repository has 35W to 85W */
            }
            @font-face {
                font-family: 'HYWenHei';
                font-weight: 400;
                src: url(https://cdn.jsdelivr.net/gh/PaiGramTeam/PaiGram@main/resources/fonts/HYWenHei-55W.ttf)
            }
            @font-face {
                font-family: 'HYWenHei';
                font-weight: 600;
                src: url(https://cdn.jsdelivr.net/gh/PaiGramTeam/PaiGram@main/resources/fonts/HYWenHei-65W.ttf)
            }
            @font-face {
                font-family: 'HYWenHei';
                font-weight: 800;
                src: url(https://sdk.mihoyo.com/hk4e/fonts/zh-cn.ttf)
            }
            body {
                font-family: HYWenHei, serif !important;
                -webkit-font-smoothing: antialiased;
            }
            divv, .avatar-rarity, .countdown, .sch, .sch_2, .home_select, .kingdom > kingdom,
            .select > schedule, .content > .ttl, .content > p.hits { color: white; } /* header font color */
            .bg { background: #161719 !important; } /* outer BG */
            .content, .content_2 { background-color: #161719 !important; } /* white gaps */
            /* inner blocks START */
            .a_section, .a_section_small, .a_section_small_1, .a_section_small_2 { background-color: #1c2c35 !important; padding: 10px; }
            .after_1 { background-color: #1c2c35 !important; }
            .battle_desc { background-color: #1c2c35 !important; padding: 10px; border-radius: 20px !important; }
            .battle_stat { background-color: #1c2c35 !important; padding: 10px; border-radius: 20px !important; }
            /* inner blocks END */
            .mat_num { top: 12px !important; border-style: solid; border-color: #555; border-width: thin; } /* fix overlayed numbers */
            .a_data { margin-left: 40px; margin-right: 40px; } /* more sides space */
            .attack_div > table > tbody > tr:nth-child(odd) { background-color: #333333 !important; }
            .ach-table > table > tbody > tr:nth-child(even),
            .content > .results { background-color: white !important; }
            .result { background-color: white; color: black; } /* fix for abyss */
            .d1, .d2 { border-bottom: unset !important; } /* black lines */
            .cl > schedule, .cl2 > schedule, span.active, schedule.panel,
            schedule.active, kingdom.active { background-color: #888888 !important; } /* button active color */
            schedule > span > b { color: black; } /* menu game button */
            kingdom { background-color: #333; } /* monster page inactive button color */
        `);
    }
    if (choice === 'SR') {
        insertCSS(`
            @font-face {
                font-family: 'HYRunYuan';
                font-weight: 300;
                src: url(https://cdn.jsdelivr.net/gh/bogerchan/National-Geography@master/app/src/main/assets/font/HYRunYuan-35W.ttf)
            }
            @font-face {
                font-family: 'HYRunYuan';
                font-weight: 500;
                src: url(https://cdn.jsdelivr.net/gh/Moonlark-Dev/XDbot2@master/src/plugins/Core/font/HYRunYuan-55W.ttf)
            }
            @font-face {
                font-family: 'HYRunYuan';
                font-weight: 600;
                src: url(https://cdn.jsdelivr.net/gh/LZY2275/teajourney@main/src/assets/font/HYRunYuan-65W.ttf)
            }
            @font-face {
                font-family: 'HYRunYuan';
                font-weight: 700;
                src: url(https://cdn.jsdelivr.net/gh/sdy623/nana@master/manual/fonts/HYRunYuan-75W.ttf)
            }
            body {
                font-family: HYRunYuan, serif !important;
                -webkit-font-smoothing: antialiased;
            }
        `);
    }
}

async function listenTabs() {
    document.querySelector('.a_select')?.childNodes.forEach((e) => {
        e.addEventListener('click', async () => {
            await handleAvatar(e.getAttribute('data-s'));
        });
    });
    // Simulate a mouse click switching.
    let initialActive = document.querySelector('.a_select > .active');
    if (initialActive) {
        await handleAvatar(initialActive.getAttribute('data-s'));
    }
}

function listenWeaponCards() {
    document.querySelector('.avatar-area-weapon-reserved')?.childNodes.forEach((e) => {
        e.addEventListener('click', () => {
            setTimeout(handleWeapon, 500);
        });
    });
}

function listenAvatarCards() {
    document.querySelectorAll('section.cl > schedule').forEach((e) => {
        e.addEventListener('click', () => {
            setTimeout(handleChange, 500);
        });
    });
    document.querySelectorAll('section.cl2 > schedule').forEach((e) => {
        e.addEventListener('click', () => {
            setTimeout(handleChange, 500);
        });
    });
    document.querySelector('.avatar-area')?.childNodes.forEach((e) => {
        e.addEventListener('click', () => {
            setTimeout(async () => { await listenTabs(); }, 500);
        });
    });
}

function listenWeaponButton() {
    document.querySelectorAll('.generation > schedule')[1]?.addEventListener('click', () => {
        setTimeout(listenWeaponCards, 500);
    });
}

function initGI() {
    let count1 = 0;
    let intID1 = setInterval(async () => {
        count1++;
        if (count1 > 2) clearInterval(intID1);
        if (document.querySelector('.content_2')?.style?.display !== 'none') {
            clearInterval(intID1);
            await listenTabs();
        } // if
        if (document.querySelector('.stat_ver_choose_w')) {
            clearInterval(intID1);
            handleWeapon();
        } // if
        if (document.querySelector('.avatar-area')?.childElementCount !== 0) {
            clearInterval(intID1);
            listenAvatarCards();
            listenWeaponButton(); // Never switch to weapon page from loading.
        } // if
        if (window.location.href.includes('/abyss')) {
            clearInterval(intID1);
            handleAbyss();
        } // if
        if (window.location.href.includes('/3boss')) {
            clearInterval(intID1);
            setTimeout(handle3Boss, 500);
        } // if
        if (window.location.href.includes('/maze')) {
            clearInterval(intID1);
            setTimeout(handleMaze, 500);
        } // if
        if (window.location.href.includes('/change')) {
            clearInterval(intID1);
            setTimeout(handleChange, 500);
        } // if
    }, 5000); // setInterval
}

(function () {
    let choice = '';
    console.log('[HomDGCat Beautified] Read game cookie: ' + docCookies.getItem('game'));
    if (window.location.href.includes('/gi/')) choice = 'GI';
    else if (window.location.href.includes('/sr/')) choice = 'SR';
    else if (docCookies.getItem('game') === 'GI') choice = 'GI';
    else if (docCookies.getItem('game') === 'SR') choice = 'SR';
    else return; // if
    addStyles(choice);
    if (window.location.href.includes('/gi/')) initGI();
    else if (window.location.href.includes('/sr/')) /* TODO: initSR(); */;
})();
