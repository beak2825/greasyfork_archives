// ==UserScript==
// @name         RGT Repo Tweaks
// @namespace    https://retrogametalk.com/
// @version      0.6
// @description  Various tweaks for RGT Repo
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
        "baseball",
        "basketball",
        "beat-em-up",
        "board-game",
        "bootleg",
        "bowling",
        "boxing",
        "card-battle",
        "card-game",
        "compilation",
        "construction",
        "dating-sim",
        "driving",
        "fighting",
        "first-person-shooter",
        "flight-simulator",
        "football",
        "fmv",
        "fishing",
        "game-show",
        "golf",
        "hack",
        "hack-slash",
        "homebrew",
        "indie",
        "interactive-movie",
        "light-gun",
        "mini-games",
        "miscellaneous",
        "music",
        "otome",
        "party",
        "platformer-2d",
        "platformer-3d",
        "point-and-click",
        "puzzle",
        "racing",
        "rail-shooter",
        "rhythm",
        "rpg",
        "run-and-gun",
        "shoot-em-up",
        "shooter",
        "simulation",
        "skateboarding",
        "soccer",
        "sports",
        "stealth",
        "strategy",
        "survival",
        "survival-horror",
        "tactical-rpg",
        "tennis",
        "third-person-shooter",
        "vehicular-combat",
        "visual-novel",
        "wrestling",
        "hockey"
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
        const toggle = li.querySelector('.dropdown-toggle');

        // Desktop: hover abre o submenu
        li.addEventListener('mouseenter', () => {
            rootSub.scrollTop = 0;
        });
        // Desktop/Mobile: clique ou toque no botão toggle abre o submenu
        toggle.addEventListener('click', (e) => {
            // apenas quando abre o submenu, não ao clicar em item
            setTimeout(() => {
                rootSub.scrollTop = 0;
            }, 10);
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
    <option value="baseball">Baseball</option>
    <option value="basketball">Basketball</option>
    <option value="beat-em-up">Beat 'Em Up</option>
    <option value="board-game">Board Game</option>
    <option value="bootleg">Bootleg</option>
    <option value="bowling">Bowling</option>
    <option value="boxing">Boxing</option>
    <option value="card-battle">Card Battle</option>
    <option value="card-game">Card Game</option>
    <option value="compilation">Compilation</option>
    <option value="construction">Construction</option>
    <option value="dating-sim">Dating Sim</option>
    <option value="driving">Driving</option>
    <option value="fighting">Fighting</option>
    <option value="first-person-shooter">First Person Shooter</option>
    <option value="flight-simulator">Flight Simulator</option>
    <option value="football">Football</option>
    <option value="fmv">FMV</option>
    <option value="fishing">Fishing</option>
    <option value="gamblling">Gambling</option>
    <option value="game-show">Game Show</option>
    <option value="golf">Golf</option>
    <option value="hack">Hack</option>
    <option value="hack-slash">Hack & Slash</option>
    <option value="homebrew">Homebrew</option>
    <option value="indie">Indie</option>
    <option value="interactive-movie">Interactive Movie</option>
    <option value="light-gun">Light Gun</option>
    <option value="mini-games">Mini Games</option>
    <option value="miscellaneous">Miscellaneous</option>
    <option value="music">Music</option>
    <option value="otome">Otome</option>
    <option value="party">Party</option>
    <option value="platformer-2d">Platformer 2D</option>
    <option value="platformer-3d">Platformer 3D</option>
    <option value="point-and-click">Point & Click</option>
    <option value="puzzle">Puzzle</option>
    <option value="racing">Racing</option>
    <option value="rail-shooter">Rail Shooter</option>
    <option value="rhythm">Rhythm</option>
    <option value="rpg">RPG</option>
    <option value="run-and-gun">Run & Gun</option>
    <option value="shoot-em-up">Shoot 'Em Up</option>
    <option value="shooter">Shooter</option>
    <option value="simulation">Simulation</option>
    <option value="skateboarding">Skateboarding</option>
    <option value="soccer">Soccer</option>
    <option value="sports">Sports</option>
    <option value="stealth">Stealth</option>
    <option value="strategy">Strategy</option>
    <option value="survival">Survival</option>
    <option value="survival-horror">Survival Horror</option>
    <option value="tactical-rpg">Tactical RPG</option>
    <option value="tennis">Tennis</option>
    <option value="third-person-shooter">Third Person Shooter</option>
    <option value="vehicular-combat">Vehicular Combat</option>
    <option value="visual-novel">Visual Novel</option>
    <option value="wrestling">Wrestling</option>
    <option value="hockey">Hockey</option>
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

        //searchbar.style.width = '50%';

        options.style.textAlign = 'inherit';

        /*
        let filterForm = document.querySelector('form#filter.search-filter');

        if (!filterForm) {
            filterForm = createFilterForm();
            options.insertBefore(filterForm, searchbar);
        } else {
            options.insertBefore(filterForm, searchbar);
            ensureGenreSelect(filterForm);
        }
        */

        // 🔥 Remove qualquer filtro nativo existente
        document.querySelectorAll('form#filter.search-filter').forEach(f => f.remove());

        // 🔥 Sempre cria o SEU filtro
        let filterForm = createFilterForm();
        options.insertBefore(filterForm, searchbar);
        adjustFilterByPage(filterForm);
        // --- ADICIONAR O BOTÃO DE CLEAR FILTERS ---
        if (!document.getElementById('clear-filters')) {
            const clearBtn = document.createElement('button');
            clearBtn.id = 'clear-filters';
            clearBtn.type = 'button';
            clearBtn.className = 'button-icons';
            clearBtn.textContent = '✖'; // você pode trocar por ícone se quiser
            clearBtn.style.marginLeft = '0.5em'; // ajuste visual
            clearBtn.style.fontSize = '1.3em';
            clearBtn.style.height = '35px';
            clearBtn.style.marginLeft = 7;
            clearBtn.style.marginRight = 0;
            clearBtn.title = 'Clear all filters';

            // Seleciona o container que envolve searchbar e sort
            const searchBarDiv = document.querySelector('.searchbar');
            const sortDiv = document.querySelector('.sort');

            if (searchBarDiv && sortDiv) {
                // Insere o botão entre searchbar e sort
                sortDiv.parentNode.insertBefore(clearBtn, sortDiv);

                clearBtn.addEventListener('click', () => {
                    filterForm.reset(); // reseta selects e checkbox
                    const searchInput = document.querySelector('.searchbar input[name="s"]');
                    if (searchInput) searchInput.value = '';
                });
            }
        }

        // --- BOTÃO RANDOM GAME ---
        if (!document.getElementById('random-game')) {
            const randomBtn = document.createElement('button');
            randomBtn.id = 'random-game';
            randomBtn.type = 'button';
            randomBtn.className = 'button-icons';
            randomBtn.textContent = '🎲';
            randomBtn.title = 'Random Game by filters';

            randomBtn.style.fontSize = '1.3em';
            randomBtn.style.height = '35px';
            randomBtn.style.marginLeft = '0.4em';
            randomBtn.style.marginRight = '0';

            const sortDiv = document.querySelector('.sort');
            const clearBtn = document.getElementById('clear-filters');

            if (sortDiv && clearBtn) {
                sortDiv.parentNode.insertBefore(randomBtn, sortDiv);
            }

            randomBtn.addEventListener('click', runRandomGame);
        }


        const desc = filterForm.querySelector('.home-loop-description');
        if (desc) desc.remove();

        //filterForm.style.width = '85%';
        filterForm.style.width = 'auto';

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



    const sortForm = document.getElementById('sort-form');

    if (sortForm) {
        sortForm.addEventListener('change', function () {
            const filterForm = document.querySelector('form#filter');
            if (!filterForm) return;

            // Recupera base e query (já inclui sorted)
            const { base, query } = buildQuery(filterForm);

            // Redireciona sem adicionar sorted de novo
            const finalUrl = '/repo/' + base + (query ? '?' + query : '');
            window.location.href = finalUrl;
        });
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

/* ================================
   SEARCHBAR + BUTTONS RESPONSIVE
   ================================ */

.options {
    display: flex !important;
    align-items: center;
    flex-wrap: wrap;              /* permite quebrar linha */
    gap: 0.5em;
}

/* SEARCHBAR ocupa o máximo possível */
.options > .searchbar {
    flex: 1 1 0 !important;     /* ocupa apenas o espaço restante */
    min-width: 200px;           /* limite mínimo */
}

/* input da busca */
.searchbar .search-field {
    width: 100%;
    min-width: 180px;
}

/* BOTÕES (Clear, Random, Sort) */
#clear-filters,
#random-game,
.options > .sort {
    flex: 0 0 auto;               /* nunca quebram individualmente */
    white-space: nowrap;
}

#sort-form {
    display: inline-flex !important;
    align-items: center;
    margin: 0 !important;
}

/* 🔽 Quando a tela ficar pequena */
@media (max-width: 900px) {
    .options {
        align-items: stretch;
    }

    /* 🔥 garante que TODOS permaneçam na mesma linha */
    .options > * {
        max-width: 100%;
    }
}

/* 🔽 Telas muito pequenas */
@media (max-width: 600px) {
    .options {
        gap: 0.4em;
    }

    #clear-filters,
    #random-game {
        height: 34px;
        font-size: 1.2em;
    }
}

/* ================================
   SORT INLINE FIX (OBRIGATÓRIO)
   ================================ */

/* Garante que o sort fique inline com os botões */
#sort-form {
    display: inline-flex !important;
    align-items: center;
    flex: 0 0 auto;
    margin: 0 !important;
}

/* Remove qualquer quebra interna */
#sort-form * {
    white-space: nowrap;
}


/* ===== DISABLED FILTER VISUAL ===== */
.filter-dropdown:disabled,
.filter-checkbox:disabled,
.filter-dropdown[disabled],
.filter-checkbox[disabled] {
    opacity: 0.45;
    filter: grayscale(100%);
    cursor: not-allowed;
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
        const path = window.location.pathname;

        const isSpecialPage =
              path.startsWith('/repo/translations') ||
              path.startsWith('/repo/romhacks');

        // filtros normais
        ['genre', 'language', 'region'].forEach(id => {
            const el = form.querySelector(`#${id}`);
            if (el && el.value) params.append(el.name, el.value);
        });

        // nohacks
        const checkbox = form.querySelector('input[name="nohacks"]');
        if (checkbox && checkbox.checked) {
            params.append(checkbox.name, checkbox.value);
        }

        // search
        const searchInput = document.querySelector('.searchbar input[name="s"]');
        const sValue = searchInput ? searchInput.value.trim() : '';
        if (sValue) params.append('s', sValue);

        // sorted
        const sortedInput =
              document.querySelector('input[name="sorted"]:checked') ||
              document.querySelector('input[name="sorted"]');
        if (sortedInput && sortedInput.value) {
            params.append('sorted', sortedInput.value);
        }

        // ===============================
        // PLATFORM (REGRA NOVA)
        // ===============================
        const platformSelect = form.querySelector('#platform');
        let base = '';

        if (platformSelect && platformSelect.value) {
            if (isSpecialPage) {
                // 🔥 vira query
                params.append('platform', platformSelect.value);
            } else {
                // 🔥 vira path
                base = platformSelect.value + '/';
            }
        }

        return {
            base,
            query: params.toString()
        };
    }






    function setupSearchButton() {
        const searchButton =
              document.querySelector('.searchbar button[type="submit"], .searchbar input[type="submit"]');
        const filterForm = document.querySelector('form#filter');
        if (!searchButton || !filterForm) return;

        searchButton.addEventListener('click', e => {
            e.preventDefault();

            const { base, query } = buildQuery(filterForm);

            // 🔥 USA A ACTION DO FORM
            let action = filterForm.action.replace(/\/+$/, '');

            const url =
                  action +
                  '/' +
                  base +
                  (query ? '?' + query : '');

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

    function addPageInputWithButton() {
        const nav = document.querySelector('nav.navigation.pagination .nav-links');
        if (!nav || nav.querySelector('#page-input-go')) return; // evita duplicar

        // Página atual
        const match = window.location.pathname.match(/\/page\/(\d+)\//);
        const currentPage = match ? parseInt(match[1]) : 1;

        // Input
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'page-input-go';
        input.value = currentPage;
        input.placeholder = 'Page';
        input.style.height = '1.8em'; // mesma altura do search
        input.style.padding = '0.4em 0.6em';
        input.style.marginLeft = '0.5em';
        input.style.border = '1px solid #bd7435';
        input.style.borderRadius = '3px';
        input.style.fontSize = '1em';
        input.style.verticalAlign = 'middle';
        input.style.width = '60px';
        input.style.textAlign = 'center';

        // Botão Go
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Go';
        btn.style.height = '1.8em';
        btn.style.padding = '0.4em 0.8em';
        btn.style.marginLeft = '0.2em';
        btn.style.border = '1px solid #bd7435';
        btn.style.borderRadius = '3px';
        btn.style.background = '#bd7435';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '1em';
        btn.style.verticalAlign = 'middle';

        function goToPage() {
            let page = parseInt(input.value);
            if (!page || page < 1) page = 1;

            const platformSelect = document.querySelector('#platform');
            const platformPath = platformSelect && platformSelect.value ? platformSelect.value + '/' : '';
            const base = '/repo/' + platformPath;

            const filterForm = document.querySelector('form#filter');
            let url = base + 'page/' + page + '/';

            if (filterForm) {
                const { query } = buildQuery(filterForm);
                if (query) url += '?' + query;
            }

            window.location.href = url;
        }

        btn.addEventListener('click', goToPage);
        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') goToPage();
        });

        nav.appendChild(input);
        nav.appendChild(btn);
    }


    function adjustFilterByPage(filterForm) {
        const path = window.location.pathname;

        const nativeSearchInput = document.querySelector(
            'form.search-form input.search-field[type="search"]'
        );
        const selects = filterForm.querySelectorAll('select.filter-dropdown');
        const noHacksCheckbox = filterForm.querySelector('input[name="nohacks"]');

        // 🔎 form de busca NATIVO (lupa)
        const searchForm = document.querySelector('form.search-form');

        // =====================================================
        // RESET PADRÃO
        // =====================================================
        filterForm.action = 'https://retrogametalk.com/repo/';

        if (searchForm) {
            searchForm.action = 'https://retrogametalk.com/repo/';
        }

        if (nativeSearchInput) {
            nativeSearchInput.name = 's';
            nativeSearchInput.placeholder = 'Search';
        }

        selects.forEach(sel => {
            sel.disabled = false;
        });

        if (noHacksCheckbox) {
            noHacksCheckbox.disabled = false;
        }

        // =====================================================
        // TRANSLATIONS
        // =====================================================
        if (path.startsWith('/repo/translations')) {
            filterForm.action = 'https://retrogametalk.com/repo/translations/';

            if (searchForm) {
                searchForm.action = 'https://retrogametalk.com/repo/translations/';
            }

            if (nativeSearchInput) {
                nativeSearchInput.name = 'search';
                nativeSearchInput.placeholder = 'Search Translations';
            }

            selects.forEach(sel => {
                const allowed = sel.id === 'language' || sel.id === 'platform';
                sel.disabled = !allowed;
                if (!allowed) sel.value = '';
            });

            if (noHacksCheckbox) {
                noHacksCheckbox.checked = false;
                noHacksCheckbox.disabled = true;
            }

            return;
        }

        // =====================================================
        // ROMHACKS
        // =====================================================
        if (path.startsWith('/repo/romhacks/')) {
            filterForm.action = 'https://retrogametalk.com/repo/romhacks/';

            if (searchForm) {
                searchForm.action = 'https://retrogametalk.com/repo/romhacks/';
            }

            if (nativeSearchInput) {
                nativeSearchInput.name = 'search';
                nativeSearchInput.placeholder = 'Search Romhacks';
            }

            selects.forEach(sel => {
                const allowed = sel.id === 'platform';
                sel.disabled = !allowed;
                if (!allowed) sel.value = '';
            });

            if (noHacksCheckbox) {
                noHacksCheckbox.checked = false;
                noHacksCheckbox.disabled = true;
            }

            return;
        }
    }



    /* =====================================================
       1️⃣ MÉTODO PRINCIPAL (BOTÃO 🎲)
       ===================================================== */
    async function runRandomGame() {

        /* ===============================
           2️⃣ MÉTODOS AUXILIARES
           =============================== */

        function buildFetchUrl() {
            const form = document.querySelector('form#filter');
            if (!form) return null;

            const params = new URLSearchParams();

            ['genre', 'language', 'region'].forEach(id => {
                const el = form.querySelector(`#${id}`);
                if (el && el.value) params.append(el.name, el.value);
            });

            const nohacks = form.querySelector('input[name="nohacks"]');
            if (nohacks && nohacks.checked) params.append('nohacks', 'true');

            const searchInput = document.querySelector('.searchbar input[name="s"]');
            if (searchInput && searchInput.value.trim()) {
                params.append('s', searchInput.value.trim());
            }

            const sorted =
                  document.querySelector('input[name="sorted"]:checked') ||
                  document.querySelector('input[name="sorted"]');

            if (sorted && sorted.value) params.append('sorted', sorted.value);

            const platform = form.querySelector('#platform')?.value || '';

            const basePath =
                  '/repo/' +
                  (platform ? platform + '/' : '');

            return location.origin + basePath + (params.toString() ? '?' + params.toString() : '');
        }

        function parseHtml(html) {
            return new DOMParser().parseFromString(html, 'text/html');
        }

        function extractGameUrls(doc) {
            const urls = new Set();

            doc.querySelectorAll('.game-container').forEach(container => {
                const link =
                      container.querySelector('a.cover-link') ||
                      container.querySelector('.game-title')?.closest('a');

                if (link?.href) urls.add(link.href);
            });

            return [...urls];
        }

        function getTotalPages(doc) {
            const nav = doc.querySelector('nav.navigation.pagination');
            if (!nav) return 1;

            let maxPage = 1;

            nav.querySelectorAll('.page-numbers').forEach(el => {
                const match = el.textContent.match(/\d+/);
                if (match) {
                    const num = parseInt(match[0], 10);
                    if (num > maxPage) maxPage = num;
                }
            });

            return maxPage;
        }


        function buildPageUrl(baseUrl, pageNumber) {
            if (pageNumber === 1) return baseUrl;

            const url = new URL(baseUrl);

            // garante que o path termina com /
            let path = url.pathname;
            if (!path.endsWith('/')) path += '/';

            path += `page/${pageNumber}/`;
            url.pathname = path;

            return url.toString();
        }

        /* ===============================
           3️⃣ LÓGICA PRINCIPAL
           =============================== */

        const baseUrl = buildFetchUrl();
        if (!baseUrl) return;

        console.log('FIRST FETCH:', baseUrl);

        const firstRes = await fetch(baseUrl, { credentials: 'same-origin' });
        const firstHtml = await firstRes.text();
        const firstDoc = parseHtml(firstHtml);

        const totalPages = getTotalPages(firstDoc);
        console.log('TOTAL PAGES:', totalPages);

        let finalDoc = firstDoc;
        let chosenPage = 1;

        if (totalPages > 1) {
            chosenPage = Math.floor(Math.random() * totalPages) + 1;

            if (chosenPage !== 1) {
                const pageUrl = buildPageUrl(baseUrl, chosenPage);
                console.log('SECOND FETCH (RANDOM PAGE):', pageUrl);

                const res = await fetch(pageUrl, { credentials: 'same-origin' });
                const html = await res.text();
                finalDoc = parseHtml(html);
            }
        }

        const gameUrls = extractGameUrls(finalDoc);

        console.log('CHOSEN PAGE:', chosenPage);
        console.log('GAME URLS:', gameUrls);
        console.log('TOTAL GAMES:', gameUrls.length);

        if (gameUrls.length > 0) {
            const randomIndex = Math.floor(Math.random() * gameUrls.length);
            let randomGame = gameUrls[randomIndex];

            // 🔹 reaproveita os filtros usados no fetch
            const baseQuery = new URL(baseUrl).search;

            if (baseQuery) {
                randomGame += (randomGame.includes('?') ? '&' : '?') + baseQuery.slice(1);
            }

            // 🔹 verifica se plataforma NÃO foi selecionada
            const platformSelected =
                  document.querySelector('#platform')?.value || '';

            if (!platformSelected) {
                randomGame +=
                    (randomGame.includes('?') ? '&' : '?') +
                    'ignore_platform=true';
            }

            console.log('🎲 Random game WITH FILTERS:', randomGame);

            window.location.href = randomGame;
            return randomGame;
        }
        else {
            alert('No games found with the selected filters.');
            console.warn('No games found with the selected filters.');
            return null;
        }

    }
    // Observa DOM
    const observer = new MutationObserver(() => {
        ensureFilter();
        //removeExtraButtons();
        setupSearchButton();
        moveHeaderButtons();
        moveDarkmode();
        addPageInputWithButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function restoreFiltersFromQuery() {
        const params = new URLSearchParams(window.location.search);
        const ignorePlatform = params.get('ignore_platform') === 'true';

        const platformSelect = document.querySelector('#platform');

        if (platformSelect) {
            if (ignorePlatform) {
                platformSelect.value = '';
            } else {
                let platform = params.get('platform') || null;

                if (!platform) {
                    const match = window.location.pathname.match(/^\/repo\/([^\/]+)(\/|$)/);
                    if (match && !match[1].startsWith('page')) {
                        platform = match[1];
                    }
                }

                if (platform) {
                    const exists = [...platformSelect.options].some(
                        opt => opt.value === platform
                    );

                    platformSelect.value = exists ? platform : '';
                } else {
                    platformSelect.value = '';
                }
            }
        }

        // Outros selects
        ['genre', 'language', 'region'].forEach(id => {
            const el = document.querySelector(`#${id}`);
            if (el) el.value = params.get(id) || '';
        });

        // Checkbox No Hacks
        const nohacks = document.querySelector('input[name="nohacks"]');
        if (nohacks) nohacks.checked = params.get('nohacks') === 'true';

        // Campo de busca
        const searchInput = document.querySelector('.searchbar input[name="s"]');
        if (searchInput) searchInput.value = params.get('s') || '';
    }


    function restoreSortFromQuery() {
        const params = new URLSearchParams(window.location.search);
        const sorted = params.get('sorted');
        if (!sorted) return;

        // Se for radio buttons
        const radio = document.querySelector(`input[name="sorted"][value="${sorted}"]`);
        if (radio) {
            radio.checked = true;
        }

        // Se for um input hidden
        const hidden = document.querySelector('input[name="sorted"]');
        if (hidden) {
            hidden.value = sorted;
        }
    }



    // Tentativa inicial
    ensureFilter();
    restoreFiltersFromQuery();
    //removeExtraButtons();
    setupSearchButton();
    moveHeaderButtons();
    moveDarkmode();
    //addPageInput();
})();