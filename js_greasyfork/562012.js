// ==UserScript==
// @name         RGT Repo Tweaks
// @namespace    https://retrogametalk.com/
// @version      0.2
// @description  Combina: menu By Genre (A–Z opcional) + filtro sempre visível com Genre, No Hacks e ajustes de header
// @match        https://retrogametalk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562012/RGT%20Repo%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/562012/RGT%20Repo%20Tweaks.meta.js
// ==/UserScript==


/* ======================================================================
   SCRIPT 1 — RGT - By Genre (Grouped A-Z)
   (NÃO ALTERADO)
   ====================================================================== */
(function () {
    'use strict';

    const GROUP_BY_LETTER = false;

    const genres = [
        "action",
        "action-adventure",
        "action-rpg",
        "adventure",
        "arcade",
        "beat-em-up",
        "board-game",
        "bootleg",
        "boxing",
        "card-game",
        "compilation",
        "dating-sim",
        "fighting",
        "first-person-shooter",
        "golf",
        "hack",
        "hack-slash",
        "homebrew",
        "interactive-movie",
        "light-gun",
        "miscellaneous",
        "party",
        "platformer-2d",
        "platformer-3d",
        "point-and-click",
        "puzzle",
        "racing",
        "rhythm",
        "rpg",
        "run-and-gun",
        "shoot-em-up",
        "shooter",
        "simulation",
        "soccer",
        "sports",
        "stealth",
        "strategy",
        "survival-horror",
        "tactical-rpg",
        "third-person-shooter",
        "vehicular-combat",
        "visual-novel",
        "wrestling"
    ];

    function prettify(slug) {
        return slug
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }

    function groupByLetter(list) {
        const groups = {};
        list.forEach(g => {
            const letter = g.charAt(0).toUpperCase();
            (groups[letter] ||= []).push(g);
        });
        return groups;
    }

    function createMenu() {
        const mainMenu = document.querySelector('#menu-main-menu');
        const byPlatform = document.querySelector('#menu-item-173032');
        if (!mainMenu || !byPlatform) return;
        if (document.getElementById('menu-item-by-genre')) return;

        const li = document.createElement('li');
        li.id = 'menu-item-by-genre';
        li.className = 'menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children';
        li.setAttribute('aria-haspopup', 'true');

        li.innerHTML = `
            <a href="/repo/">By Genre</a>
            <button class="dropdown-toggle" aria-expanded="false">
                <span class="screen-reader-text">expand child menu</span>
            </button>
            <ul class="sub-menu"></ul>
        `;

        const rootSub = li.querySelector('.sub-menu');

        li.addEventListener('mouseenter', () => {
    rootSub.scrollTop = 0;
});

        li.addEventListener('click', () => {
    rootSub.scrollTop = 0;
});

        if (GROUP_BY_LETTER) {
            // 🔠 AGRUPADO A–Z
            const grouped = groupByLetter(genres);

            Object.keys(grouped).sort().forEach(letter => {
                const letterLi = document.createElement('li');
                letterLi.className = 'menu-item menu-item-has-children';
                letterLi.setAttribute('aria-haspopup', 'true');

                letterLi.innerHTML = `
                    <a href="#">${letter}</a>
                    <button class="dropdown-toggle"></button>
                    <ul class="sub-menu"></ul>
                `;

                const letterSub = letterLi.querySelector('.sub-menu');

                letterSub.style.maxHeight = '60vh';
letterSub.style.overflowY = 'auto';

                grouped[letter].sort().forEach(genre => {
                    const gLi = document.createElement('li');
                    gLi.className = 'menu-item';
                    gLi.innerHTML = `
                        <a href="/repo/?genre=${genre}">
                            ${prettify(genre)}
                        </a>
                    `;
                    letterSub.appendChild(gLi);
                });

                rootSub.appendChild(letterLi);
            });

        } else {
            // 📃 LISTA FLAT
            rootSub.style.maxHeight = '72vh';
            rootSub.style.overflowY = 'auto';
            genres.slice().sort().forEach(genre => {
                const gLi = document.createElement('li');
                gLi.className = 'menu-item';
                gLi.innerHTML = `
                    <a href="/repo/?genre=${genre}">
                        ${prettify(genre)}
                    </a>
                `;
                rootSub.appendChild(gLi);
            });
        }

        // Insere ao lado do By Platform
        byPlatform.parentNode.insertBefore(li, byPlatform.nextSibling);
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', createMenu)
        : createMenu();
})();



/* ======================================================================
   SCRIPT 2 — RGT - Always Show Search Filter with Genre
   ====================================================================== */

(function () {
    'use strict';

    const FLAG = '__RGT_FILTER_MOVED__';

    function createFilterForm() {
        const form = document.createElement('form');
        form.id = 'filter';
        form.className = 'search-filter';
        form.action = '/repo/';
        form.innerHTML = `
            <input type="hidden" name="s" value="">

            <select id="platform" name="platform" class="filter-dropdown">
                <option value="">All Platforms</option>
                <optgroup label="Sony">
                    <option value="vita">VITA</option>
                    <option value="psp">PSP</option>
                    <option value="psx-iso">PSX</option>
                    <option value="ps2-iso">PS2</option>
                    <option value="psx2psp">PSP Eboots</option>
                </optgroup>
                <optgroup label="Nintendo">
                    <option value="nes-roms">NES</option>
                    <option value="snes-rom">SNES</option>
                    <option value="gcn-iso">Gamecube</option>
                    <option value="gba-roms">GBA</option>
                    <option value="n64-roms">N64</option>
                    <option value="gbc_roms">GBC</option>
                    <option value="gb_roms">GB</option>
                    <option value="famicom_disk_system">FDS</option>
                    <option value="nds-roms">NDS</option>
                    <option value="wii-iso">Wii</option>
                </optgroup>
                <optgroup label="SEGA">
                    <option value="dc-iso">Dreamcast</option>
                    <option value="sega_saturn_isos">Saturn</option>
                    <option value="sega_cd_isos">Sega CD</option>
                    <option value="sega_32x_roms">32X</option>
                    <option value="game-gear">Game Gear</option>
                    <option value="sega_genesis_roms">Genesis</option>
                    <option value="sms_roms">Master System</option>
                    <option value="sega-pico">SEGA Pico</option>
                </optgroup>
                <optgroup label="NEC">
                    <option value="pc-fx">PC-FX</option>
                    <option value="turbografx-cd">Turbografx-CD</option>
                    <option value="turbografx-16">Turbografx-16</option>
                    <option value="pc-98">PC-98</option>
                    <option value="pc-88">PC-88</option>
                </optgroup>
                <optgroup label="SNK">
                    <option value="neo-geo-pocket">Neo Geo Pocket Color</option>
                    <option value="neo-geo-cd">Neo Geo CD</option>
                </optgroup>
                <optgroup label="PC">
                    <option value="windows">Windows</option>
                    <option value="msdos">MS-DOS</option>
                    <option value="scummvm">ScummVM</option>
                </optgroup>
                <optgroup label="Other">
                    <option value="arcade">Arcade</option>
                    <option value="3do-iso">3DO</option>
                    <option value="wonderswan">Wonderswan</option>
                    <option value="msx-roms">MSX</option>
                </optgroup>
            </select>

            <!-- Genre Select -->
            <select id="genre" name="genre" class="filter-dropdown">
                <option value="">All Genres</option>
                <option value="action">Action</option>
                <option value="action-adventure">Action-Adventure</option>
                <option value="action-rpg">Action-RPG</option>
                <option value="adventure">Adventure</option>
                <option value="arcade">Arcade</option>
                <option value="beat-em-up">Beat-em-up</option>
                <option value="board-game">Board Game</option>
                <option value="bootleg">Bootleg</option>
                <option value="boxing">Boxing</option>
                <option value="card-game">Card Game</option>
                <option value="compilation">Compilation</option>
                <option value="dating-sim">Dating Sim</option>
                <option value="fighting">Fighting</option>
                <option value="first-person-shooter">First Person Shooter</option>
                <option value="golf">Golf</option>
                <option value="hack">Hack</option>
                <option value="hack-slash">Hack & Slash</option>
                <option value="homebrew">Homebrew</option>
                <option value="interactive-movie">Interactive Movie</option>
                <option value="light-gun">Light Gun</option>
                <option value="miscellaneous">Miscellaneous</option>
                <option value="platformer-2d">Platformer 2D</option>
                <option value="platformer-3d">Platformer 3D</option>
                <option value="point-and-click">Point & Click</option>
                <option value="puzzle">Puzzle</option>
                <option value="racing">Racing</option>
                <option value="rhythm">Rhythm</option>
                <option value="rpg">RPG</option>
                <option value="run-and-gun">Run & Gun</option>
                <option value="shoot-em-up">Shoot-em-up</option>
                <option value="shooter">Shooter</option>
                <option value="simulation">Simulation</option>
                <option value="soccer">Soccer</option>
                <option value="sports">Sports</option>
                <option value="stealth">Stealth</option>
                <option value="strategy">Strategy</option>
                <option value="survival-horror">Survival Horror</option>
                <option value="tactical-rpg">Tactical RPG</option>
                <option value="third-person-shooter">Third Person Shooter</option>
                <option value="vehicular-combat">Vehicular Combat</option>
                <option value="visual-novel">Visual Novel</option>
                <option value="wrestling">Wrestling</option>
            </select>

            <select id="language" name="language" class="filter-dropdown">
                <option value="">All Languages</option>
                <option value="english">English</option>
                <option value="english-machine-translation">English (MT)</option>
                <option value="japanese">Japanese</option>
                <option value="french">French</option>
                <option value="spanish">Spanish</option>
                <option value="german">German</option>
                <option value="italian">Italian</option>
                <option value="dutch">Dutch</option>
                <option value="portuguese">Portuguese</option>
                <option value="swedish">Swedish</option>
                <option value="undub">Undub</option>
            </select>

            <select id="region" name="region" class="filter-dropdown">
                <option value="">All Regions</option>
                <option value="usa">USA</option>
                <option value="europe">Europe</option>
                <option value="japan">Japan</option>
            </select>

            <label>
                <input class="filter-checkbox" type="checkbox" name="nohacks" value="true"> No hacks
            </label>

            <input type="hidden" name="sorted" value="">
        `;
        return form;
    }

    function ensureFilter() {
        if (window[FLAG]) return;

        const options = document.querySelector('.options');
        const searchbar = options?.querySelector('.searchbar');
        if (!options || !searchbar) return;

                searchbar.style.width = '86%';

        options.style.textAlign = 'inherit';

        let filterForm = document.querySelector('form#filter.search-filter');

        if (!filterForm) {
            filterForm = createFilterForm();
            options.insertBefore(filterForm, searchbar);
        } else {
            options.insertBefore(filterForm, searchbar);
            ensureGenreSelect(filterForm);
        }

        const desc = filterForm.querySelector('.home-loop-description');
        if (desc) desc.remove();

        filterForm.style.width = '100%';
        filterForm.style.margin = '0';

        // Ajusta o padding do input search-field
const searchInput = document.querySelector('.search-field');
if (searchInput) {
    searchInput.style.padding = '0.5em 0.4375em';
}


        ['platform', 'genre', 'language', 'region'].forEach(id => {
            const el = filterForm.querySelector(`#${id}`);
            if (el) el.style.margin = '0';
        });

            // **Aqui aplicamos a margem na label do checkbox de forma segura**
    const noHacksLabel = filterForm.querySelector('input[name="nohacks"]')?.parentElement;
    if (noHacksLabel) {
        noHacksLabel.style.marginLeft = '0.15em';
    }

        disableNativeSubmit(filterForm);

        window[FLAG] = true;
    }



    const style = document.createElement('style');
style.textContent = `
/* Botão X */
.button-icons.x-follow-icon {
    margin: 0 !important;
    padding-left: 10px !important;
}

/* Espaçamento do header */
.site-branding,
.site-header-menu,
.header-image {
    margin-bottom: 0.8em !important;
}



/* Conteúdo */
.site-content {
    padding: 1% 2% !important;
}

#darkmode {
    padding: 00.84375em 0.875em 0.78125em !important;
}

/* ===== AJUSTES DE TEXTO ===== */
.game-title {
    line-height: 1.30 !important;
}

.bottom-section {
    line-height: normal !important;
}

.details {
padding: 0px 5px;
}
.downloads {
    display: inline-flex;
    align-items: center;
    gap: 0.25em; /* espaço entre ícone e número */
}

.score {
    display: inline-flex;
    align-items: center;
    gap: 0.25em; /* espaço entre ícone e número */
}

.comments {
    display: inline-flex;
    align-items: center;
    gap: 0.25em; /* espaço entre ícone e número */
}

.flags {
    width: 26px;
}

`;
document.head.appendChild(style);


    function ensureGenreSelect(form) {
        if (!form.querySelector('#genre')) {
            const genreSelect = document.createElement('select');
            genreSelect.id = 'genre';
            genreSelect.name = 'genre';
            genreSelect.className = 'filter-dropdown';
            genreSelect.innerHTML = `
                <option value="">All Genres</option>
                <option value="action">Action</option>
                <option value="action-adventure">Action-Adventure</option>
                <option value="action-rpg">Action-RPG</option>
                <option value="adventure">Adventure</option>
                <option value="arcade">Arcade</option>
                <option value="beat-em-up">Beat-em-up</option>
                <option value="board-game">Board Game</option>
                <option value="bootleg">Bootleg</option>
                <option value="boxing">Boxing</option>
                <option value="card-game">Card Game</option>
                <option value="compilation">Compilation</option>
                <option value="dating-sim">Dating Sim</option>
                <option value="fighting">Fighting</option>
                <option value="first-person-shooter">First Person Shooter</option>
                <option value="golf">Golf</option>
                <option value="hack">Hack</option>
                <option value="hack-slash">Hack & Slash</option>
                <option value="homebrew">Homebrew</option>
                <option value="interactive-movie">Interactive Movie</option>
                <option value="light-gun">Light Gun</option>
                <option value="miscellaneous">Miscellaneous</option>
                <option value="platformer-2d">Platformer 2D</option>
                <option value="platformer-3d">Platformer 3D</option>
                <option value="point-and-click">Point & Click</option>
                <option value="puzzle">Puzzle</option>
                <option value="racing">Racing</option>
                <option value="rhythm">Rhythm</option>
                <option value="rpg">RPG</option>
                <option value="run-and-gun">Run & Gun</option>
                <option value="shoot-em-up">Shoot-em-up</option>
                <option value="shooter">Shooter</option>
                <option value="simulation">Simulation</option>
                <option value="soccer">Soccer</option>
                <option value="sports">Sports</option>
                <option value="stealth">Stealth</option>
                <option value="strategy">Strategy</option>
                <option value="survival-horror">Survival Horror</option>
                <option value="tactical-rpg">Tactical RPG</option>
                <option value="third-person-shooter">Third Person Shooter</option>
                <option value="vehicular-combat">Vehicular Combat</option>
                <option value="visual-novel">Visual Novel</option>
                <option value="wrestling">Wrestling</option>
            `;
            const languageSelect = form.querySelector('#language');
            if (languageSelect) {
                languageSelect.insertAdjacentElement('beforebegin', genreSelect);
            } else {
                form.appendChild(genreSelect);
            }
        }
    }

    function disableNativeSubmit(form) {
        const elements = form.querySelectorAll('select, input[type="checkbox"]');
        elements.forEach(el => {
            el.addEventListener('change', e => {
                e.stopImmediatePropagation();
            }, true);
        });
        form.addEventListener('submit', e => e.preventDefault());
    }

     function removeExtraButtons() {
         const buttons = document.querySelectorAll('.button-icons');
         buttons.forEach(btn => btn.remove());
     }

    // --- NOVO: Monta query e envia ao clicar no botão ---
function buildQuery(form) {
    const params = new URLSearchParams();
    const selects = form.querySelectorAll('select');
    selects.forEach(sel => {
        if (sel.value) params.append(sel.name, sel.value);
    });
    const checkbox = form.querySelector('input[name="nohacks"]');
    if (checkbox && checkbox.checked) params.append(checkbox.name, checkbox.value);

    // ---- pega termo digitado na barra de busca ----
const searchInput = document.querySelector('.searchbar input[name="s"]');
const sValue = searchInput ? searchInput.value.trim() : '';
params.append('s', sValue);
    return params.toString();
}


    function setupSearchButton() {
        const searchButton = document.querySelector('.searchbar button[type="submit"], .searchbar input[type="submit"]');
        const filterForm = document.querySelector('form#filter');
        if (!searchButton || !filterForm) return;
        searchButton.addEventListener('click', e => {
            e.preventDefault();
            const query = buildQuery(filterForm);
            const action = filterForm.action || '/repo/';
            const url = action + (query ? '?' + query : '');
            window.location.href = url;
        });
    }
    // -------------------------------------------

function moveHeaderButtons() {
    const masthead = document.querySelector('#masthead.site-header');
    if (!masthead) return;

    const headerMain = masthead.querySelector('.site-header-main');
    if (!headerMain) return;

    const buttons = document.querySelectorAll(
        'button.button-icons[onclick="openKoFiLink()"], button.button-icons.x-follow-icon[onclick="openXFollow()"]'
    );

    buttons.forEach(btn => {
        if (btn.parentElement !== masthead) {
            masthead.insertBefore(btn, headerMain.nextSibling);
        }
    });
}

function moveDarkmode() {
    const darkBtn = document.querySelector('#darkmode');
    if (!darkBtn) return;

    const menu = document.querySelector('#menu-main-menu.primary-menu');
    if (!menu) return;

    // evita duplicar / sumir
    if (darkBtn.closest('#menu-main-menu')) return;

    // cria <li> SEMÂNTICO igual ao WP
    const li = document.createElement('li');
    li.className = 'menu-item menu-item-type-custom darkmode-menu-item';

    li.appendChild(darkBtn);
    menu.appendChild(li);
}



    // Observa DOM
    const observer = new MutationObserver(() => {
        ensureFilter();
        //removeExtraButtons();
        setupSearchButton();
        moveHeaderButtons();
        moveDarkmode();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function restoreGenreFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const genre = params.get('genre');
    if (genre) {
        const genreSelect = document.querySelector('#genre');
        if (genreSelect) genreSelect.value = genre;
    }
}

    // Tentativa inicial
ensureFilter();
restoreGenreFromQuery();
//removeExtraButtons();
setupSearchButton();
    moveHeaderButtons();
    moveDarkmode();
})();
