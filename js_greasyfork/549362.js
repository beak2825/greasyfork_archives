// ==UserScript==
// @name         GitIngest - Turn any Git repo to LLM prompt
// @name:zh-CN   GitIngest - 将Git仓库转换为LLM提示
// @name:zh-TW   GitIngest - 將Git倉庫轉換為LLM提示
// @name:ja      GitIngest - GitリポジトリをLLMプロンプトに変換
// @name:ko      GitIngest - Git 저장소를 LLM 프롬프트로 변환
// @name:es      GitIngest - Convierte cualquier repo Git en prompt LLM
// @name:fr      GitIngest - Convertir tout dépôt Git en prompt LLM
// @name:de      GitIngest - Git-Repository in LLM-Prompt umwandeln
// @name:it      GitIngest - Trasforma qualsiasi repo Git in prompt LLM
// @name:pt      GitIngest - Transformar repo Git em prompt LLM
// @name:ru      GitIngest - Превратить Git-репозиторий в LLM-промпт
// @name:ar      GitIngest - تحويل مستودع Git إلى موجه LLM
// @name:hi      GitIngest - Git रेपो को LLM प्रॉम्प्ट में बदलें
// @name:th      GitIngest - แปลง Git repo เป็น LLM prompt
// @name:vi      GitIngest - Chuyển repo Git thành prompt LLM
// @name:id      GitIngest - Ubah repo Git menjadi prompt LLM
// @name:ms      GitIngest - Tukar repo Git kepada prompt LLM
// @name:tl      GitIngest - I-convert ang Git repo sa LLM prompt
// @name:tr      GitIngest - Git deposunu LLM prompt'una dönüştür
// @name:nl      GitIngest - Zet elke Git repo om naar LLM prompt
// @name:sv      GitIngest - Förvandla Git repo till LLM prompt
// @name:da      GitIngest - Omdann Git repo til LLM prompt
// @name:no      GitIngest - Gjør Git repo til LLM prompt
// @name:fi      GitIngest - Muuta Git repo LLM promptiksi
// @name:pl      GitIngest - Przekształć repo Git w prompt LLM
// @name:cs      GitIngest - Převést Git repo na LLM prompt
// @name:sk      GitIngest - Premeniť Git repo na LLM prompt
// @name:hu      GitIngest - Git repo átalakítása LLM prompttá
// @name:ro      GitIngest - Transformă repo Git în prompt LLM
// @name:bg      GitIngest - Превърни Git хранилище в LLM подкана
// @name:hr      GitIngest - Pretvori Git repo u LLM prompt
// @name:sl      GitIngest - Pretvori Git repo v LLM prompt
// @name:et      GitIngest - Muuda Git repo LLM promptiks
// @name:lv      GitIngest - Pārveidot Git repo par LLM uzvedni
// @name:lt      GitIngest - Paversti Git repo į LLM raginimą
// @name:uk      GitIngest - Перетворити Git репозиторій на LLM промпт
// @name:be      GitIngest - Ператварыць Git рэпазіторый у LLM промпт
// @name:mk      GitIngest - Претвори Git репозиториум во LLM промпт
// @name:sq      GitIngest - Kthej repo Git në prompt LLM
// @name:mt      GitIngest - Ibdel repo Git għal prompt LLM
// @name:eu      GitIngest - Git errepositoriorik LLM gonbitean bihurtu
// @name:ca      GitIngest - Converteix qualsevol repo Git en prompt LLM
// @name:gl      GitIngest - Converter calquera repo Git en prompt LLM
// @name:cy      GitIngest - Troi unrhyw repo Git yn anogaeth LLM
// @name:ga      GitIngest - Tiontaigh stór Git ar bith go pras LLM
// @name:is      GitIngest - Breyta Git geymslu í LLM kvaðningu
// @name:fo      GitIngest - Broyt Git goymslu til LLM tilmæli
// @name:gd      GitIngest - Atharraich stòr Git gu brosnachadh LLM
// @name:br      GitIngest - Treiñ ur maven Git d'ur prompt LLM
// @name:kw      GitIngest - Chaunjya repo Git dhe prompt LLM
// @name:lb      GitIngest - Git Repository an LLM Prompt ëmwandelen
// @namespace    https://github.com/lcandy2/gitingest-extension
// @version      1.0.1
// @description  Turn any Git repository into a prompt-friendly text ingest for LLMs. By replacing hub with ingest to access a corresponding digest.
// @description:zh-CN 将任何Git仓库转换为LLM友好的文本摘要。通过将hub替换为ingest来访问相应的摘要。
// @description:zh-TW 將任何Git倉庫轉換為LLM友好的文本摘要。通過將hub替換為ingest來訪問相應的摘要。
// @description:ja 任意のGitリポジトリをLLMフレンドリーなテキスト要約に変換します。hubをingestに置き換えて対応するダイジェストにアクセスします。
// @description:ko 모든 Git 저장소를 LLM 친화적인 텍스트 요약으로 변환합니다. hub를 ingest로 바꿔 해당 다이제스트에 액세스합니다.
// @description:es Convierte cualquier repositorio Git en un resumen de texto amigable para LLMs. Reemplaza hub con ingest para acceder al resumen correspondiente.
// @description:fr Transforme n'importe quel dépôt Git en résumé textuel adapté aux LLMs. Remplace hub par ingest pour accéder au résumé correspondant.
// @description:de Wandelt jedes Git-Repository in eine LLM-freundliche Textzusammenfassung um. Ersetzt hub durch ingest, um auf die entsprechende Zusammenfassung zuzugreifen.
// @description:it Trasforma qualsiasi repository Git in un riassunto testuale adatto agli LLM. Sostituisce hub con ingest per accedere al riassunto corrispondente.
// @description:pt Transforma qualquer repositório Git em um resumo de texto amigável para LLMs. Substitui hub por ingest para acessar o resumo correspondente.
// @description:ru Превращает любой Git-репозиторий в дружественную для LLM текстовую сводку. Заменяет hub на ingest для доступа к соответствующему дайджесту.
// @description:ar تحويل أي مستودع Git إلى ملخص نصي مناسب لنماذج اللغة الكبيرة. يستبدل hub بـ ingest للوصول إلى الملخص المقابل.
// @description:hi किसी भी Git रिपॉजिटरी को LLM-अनुकूल टेक्स्ट सारांश में बदलें। संबंधित डाइजेस्ट तक पहुंचने के लिए hub को ingest से बदलें।
// @description:th แปลงที่เก็บ Git ใดๆ เป็นข้อความสรุปที่เหมาะสำหรับ LLM โดยแทนที่ hub ด้วย ingest เพื่อเข้าถึงสรุปที่สอดคล้องกัน
// @description:vi Chuyển đổi bất kỳ kho Git nào thành tóm tắt văn bản thân thiện với LLM. Thay thế hub bằng ingest để truy cập tóm tắt tương ứng.
// @description:id Mengubah repositori Git apa pun menjadi ringkasan teks yang ramah LLM. Mengganti hub dengan ingest untuk mengakses ringkasan yang sesuai.
// @description:ms Tukar mana-mana repositori Git kepada ringkasan teks mesra LLM. Gantikan hub dengan ingest untuk mengakses ringkasan yang berkaitan.
// @description:tl I-convert ang anumang Git repository sa LLM-friendly na text summary. Palitan ang hub ng ingest para ma-access ang kaukulang digest.
// @description:tr Herhangi bir Git deposunu LLM dostu metin özetine dönüştürür. İlgili özete erişmek için hub'ı ingest ile değiştirir.
// @description:nl Zet elke Git-repository om naar een LLM-vriendelijke tekstsamenvatting. Vervangt hub door ingest om toegang te krijgen tot de bijbehorende samenvatting.
// @description:sv Förvandla vilket Git-förråd som helst till en LLM-vänlig textsammanfattning. Ersätter hub med ingest för att komma åt motsvarande sammandrag.
// @description:da Omdanner ethvert Git-repository til et LLM-venligt tekstresumé. Erstatter hub med ingest for at få adgang til det tilsvarende resumé.
// @description:no Gjør ethvert Git-repository om til et LLM-vennlig tekstsammendrag. Erstatter hub med ingest for å få tilgang til tilsvarende sammendrag.
// @description:fi Muuttaa minkä tahansa Git-arkiston LLM-ystävälliseksi tekstiyhteenvedoksi. Korvaa hub sanalla ingest päästäksesi vastaavaan tiivistelmään.
// @description:pl Przekształca dowolne repozytorium Git w przyjazne dla LLM streszczenie tekstowe. Zastępuje hub słowem ingest, aby uzyskać dostęp do odpowiedniego streszczenia.
// @description:cs Převede libovolný Git repozitář na LLM-přátelský textový souhrn. Nahrazuje hub slovem ingest pro přístup k odpovídajícímu souhrnu.
// @description:sk Prevedie akýkoľvek Git repozitár na LLM-priateľský textový súhrn. Nahrádza hub slovom ingest pre prístup k príslušnému súhrnu.
// @description:hu Bármely Git repozitóriumot LLM-barát szöveges összefoglalóvá alakít. A hub szót ingest-re cseréli a megfelelő összefoglaló eléréséhez.
// @description:ro Transformă orice depozit Git într-un rezumat text prietenos cu LLM. Înlocuiește hub cu ingest pentru a accesa rezumatul corespunzător.
// @description:bg Превръща всяко Git хранилище в LLM-приятелско текстово резюме. Заменя hub с ingest за достъп до съответното резюме.
// @description:hr Pretvara bilo koji Git repozitorij u LLM-prijazan tekstni sažetak. Zamjenjuje hub s ingest za pristup odgovarajućem sažetku.
// @description:sl Pretvori kateri koli Git repozitorij v LLM-prijazen besedilni povzetek. Zamenja hub z ingest za dostop do ustreznega povzetka.
// @description:et Muudab iga Git hoidla LLM-sõbralikuks tekstikokkuvõtteks. Asendab hub sõnaga ingest vastavale kokkuvõttele ligipääsuks.
// @description:lv Pārveido jebkuru Git krātuvi par LLM draudzīgu teksta kopsavilkumu. Aizstāj hub ar ingest, lai piekļūtu atbilstošajam kopsavilkumam.
// @description:lt Paverčia bet kurį Git saugyklą į LLM palankų teksto santrauką. Pakeičia hub į ingest, kad galėtų pasiekti atitinkamą santrauką.
// @description:uk Перетворює будь-який Git репозиторій на дружній до LLM текстовий підсумок. Замінює hub на ingest для доступу до відповідного підсумку.
// @description:be Ператварае любы Git рэпазіторый у сяброўскую для LLM тэкставую зводку. Замяняе hub на ingest для доступу да адпаведнай зводкі.
// @description:mk Претвора било кој Git репозиториум во LLM пријателски текстуален резиме. Ја заменува hub со ingest за пристап до соодветниот резиме.
// @description:sq Kthen çdo depo Git në një përmbledhje teksti miqësore për LLM. Zëvendëson hub me ingest për të hyrë në përmbledhjen përkatëse.
// @description:mt Jibdel kwalunkwe repożitorju Git f'sommarju ta' test li jaqbel ma' LLM. Jibdel hub b'ingest biex jaċċessa s-sommarju korrispondenti.
// @description:eu Edozein Git errepositoriorik LLM-rekin adiskidetasun duen testu laburpen bihurtzen du. hub ingest-ekin ordezkatzen du dagokion laburpena atzitzeko.
// @description:ca Converteix qualsevol repositori Git en un resum de text amigable per a LLMs. Substitueix hub per ingest per accedir al resum corresponent.
// @description:gl Converte calquera repositorio Git nun resumo de texto amigable para LLMs. Substitúe hub por ingest para acceder ao resumo correspondente.
// @description:cy Yn troi unrhyw storfa Git yn grynodeb testun sy'n gyfeillgar i LLMs. Yn disodli hub gydag ingest i gael mynediad at y crynodeb cyfatebol.
// @description:ga Tiontaíonn sé stór Git ar bith go achoimre téacs a bhfuil LLM-chairdiúil. Cuireann sé ingest in ionad hub chun rochtain a fháil ar an achoimre chomhfhreagrach.
// @description:is Breytir hvaða Git geymslu sem er í LLM-vænlegt textasamantekt. Skiptir út hub fyrir ingest til að fá aðgang að samsvarandi samantekt.
// @description:fo Broytir hvørja Git goymslu sum helst í LLM-vinaliga tekstsamantekt. Skiftir hub við ingest fyri at fáa atgongd til viðkomandi samantekt.
// @description:gd Atharraichidh e stòr Git sam bith gu geàrr-chunntas teacsa a tha càirdeil do LLM. Cuiridh e ingest an àite hub gus faighinn chun a' gheàrr-chunntais fhreagarraich.
// @description:br Treiñ a ra ur maven Git bennak d'ur berradenn destenn a zo mignoned gant LLM. Erlec'hiañ a ra hub gant ingest evit tizhout ar berradenn kenglotus.
// @description:kw Chaunjya kres Git pyth yw dhe verkskrif test a yw kowethek dhe LLM. Chaunjya hub dhe ingest rag hedhas an verkskrif kehevelek.
// @description:lb Wandelt all Git Repository an eng LLM-frëndlech Text Zesummefaassung ëm. Ersat hub mat ingest fir op déi entspriechend Zesummefaassung ze kommen.
// @icon       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
// @author       coderamp-labs(lcandy2), aspen138(using Claude Code)
// @match        *://*.github.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://unpkg.com/react@18/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
// @homepageURL  https://github.com/lcandy2/gitingest-extension
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549362/GitIngest%20-%20Turn%20any%20Git%20repo%20to%20LLM%20prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/549362/GitIngest%20-%20Turn%20any%20Git%20repo%20to%20LLM%20prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Storage helpers using Tampermonkey's GM API
    const storage = {
        async getItem(key) {
            return GM_getValue(key, null);
        },
        async setItem(key, value) {
            GM_setValue(key, value);
        }
    };

    // Throttle function to limit the rate of execution
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };

    // Page Observer Class
    class PageObserver {
        constructor(callback) {
            this.callback = throttle(callback, 250);
            this.setupObservers();
            this.setupNavigationEvents();
        }

        setupObservers() {
            // Main content observer
            this.observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        this.callback();
                        break;
                    }
                }
            });

            // Observe initial container if it exists
            this.observeMainContainer();

            // Watch for container changes
            this.bodyObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        this.observeMainContainer();
                    }
                }
            });

            this.bodyObserver.observe(document.body, { childList: true });
        }

        observeMainContainer() {
            const mainContainer = document.querySelector('#js-repo-pjax-container');
            if (mainContainer && !this.observer.takeRecords().length) {
                this.observer.observe(mainContainer, {
                    childList: true,
                    subtree: true
                });
            }
        }

        setupNavigationEvents() {
            window.addEventListener('popstate', this.callback);
            window.addEventListener('pushstate', this.callback);
            window.addEventListener('replacestate', this.callback);
        }

        disconnect() {
            this.observer.disconnect();
            this.bodyObserver.disconnect();
            window.removeEventListener('popstate', this.callback);
            window.removeEventListener('pushstate', this.callback);
            window.removeEventListener('replacestate', this.callback);
        }
    }

    // Create GitIngest Button
    async function createGitIngestButton() {
        // Add custom styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 1200px) {
                .gitingest-text-full {
                    display: none !important;
                }
                .gitingest-text-short {
                    display: inline !important;
                }
            }
            @media (min-width: 1201px) {
                .gitingest-text-full {
                    display: inline !important;
                }
                .gitingest-text-short {
                    display: none !important;
                }
            }
        `;
        if (!document.querySelector('#gitingest-styles')) {
            style.id = 'gitingest-styles';
            document.head.appendChild(style);
        }

        // Create button container
        const li = document.createElement('li');

        // Create link with GitHub's button style
        const link = document.createElement('a');
        link.className = 'btn-sm btn';
        link.id = 'gitingest_btn';
        link.setAttribute('aria-describedby', 'gitingest_tooltip');

        // Get custom base URL and window preference from storage
        const baseUrl = await storage.getItem('baseUrl') || 'gitingest.com';
        const openInNewWindow = await storage.getItem('openInNewWindow') || false;

        // Set URL
        link.href = window.location.href.replace('github.com', baseUrl);

        // Set target based on preference
        if (openInNewWindow) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }

        const tooltipText = openInNewWindow
            ? 'Turn this to a LLM-friendly prompt in a new tab'
            : 'Turn this to a LLM-friendly prompt';

        // Create spans for different screen sizes
        const linkContent = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" class="octicon octicon-file-moved mr-2">
                <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-3.5a.75.75 0 0 1 0-1.5h3.5a.25.25 0 0 0 .25-.25V4.664a.25.25 0 0 0-.073-.177l-2.914-2.914a.25.25 0 0 0-.177-.073H3.75a.25.25 0 0 0-.25.25v6.5a.75.75 0 0 1-1.5 0v-6.5Z"></path>
                <path d="m5.427 15.573 3.146-3.146a.25.25 0 0 0 0-.354L5.427 8.927A.25.25 0 0 0 5 9.104V11.5H.75a.75.75 0 0 0 0 1.5H5v2.396c0 .223.27.335.427.177Z"></path>
            </svg>
            <span class="gitingest-text-full">Open in GitIngest</span>
            <span class="gitingest-text-short">GitIngest</span>
        `;
        link.innerHTML = linkContent;

        // Create tooltip
        const tooltip = document.createElement('tool-tip');
        tooltip.setAttribute('for', 'gitingest_btn');
        tooltip.id = 'gitingest_tooltip';
        tooltip.setAttribute('popover', 'manual');
        tooltip.className = 'position-absolute sr-only';
        tooltip.setAttribute('role', 'tooltip');
        tooltip.textContent = tooltipText;

        // Add button and tooltip to container
        const div = document.createElement('div');
        div.className = 'float-left';
        div.appendChild(link);
        div.appendChild(tooltip);
        li.appendChild(div);
        li.id = 'git-ingest-button';

        return li;
    }

    function appendGitIngestButton(button) {
        const actionsList = document.querySelector('#repository-details-container > ul');
        if (actionsList) {
            if (actionsList.children.length >= 2) {
                actionsList.insertBefore(button, actionsList.children[1]);
            } else {
                actionsList.insertBefore(button, actionsList.firstChild);
            }
        }
    }

    // Main content script logic
    function main() {
        // Function to check if we're on a repository page
        const isRepoPage = () => window.location.pathname.match(/^\/[^/]+\/[^/]+/);

        // Function to manage button visibility
        let isCreatingButton = false;  // Flag to prevent concurrent button creation

        const manageButton = () => {
            const existingButton = document.getElementById('git-ingest-button');

            if (isRepoPage()) {
                if (!existingButton && !isCreatingButton) {
                    isCreatingButton = true;
                    // Handle async operation
                    createGitIngestButton()
                        .then(button => {
                            appendGitIngestButton(button);
                            isCreatingButton = false;
                        })
                        .catch(error => {
                            console.error(error);
                            isCreatingButton = false;
                        });
                }
            } else {
                existingButton?.remove();
            }
        };

        // Initial check
        manageButton();

        // Setup page observer
        new PageObserver(manageButton);
    }

    // Settings Menu Commands
    GM_registerMenuCommand('Configure Base URL', function() {
        const currentUrl = GM_getValue('baseUrl', 'gitingest.com');
        const newUrl = prompt('Enter the base URL for GitIngest service:', currentUrl);
        if (newUrl !== null && newUrl.trim() !== '') {
            GM_setValue('baseUrl', newUrl.trim());
            alert('Base URL updated! Refresh the page to see changes.');
        }
    });

    GM_registerMenuCommand('Toggle New Window', function() {
        const current = GM_getValue('openInNewWindow', false);
        GM_setValue('openInNewWindow', !current);
        alert(`Open in new window: ${!current ? 'Enabled' : 'Disabled'}. Refresh the page to see changes.`);
    });

    GM_registerMenuCommand('Reset Settings', function() {
        if (confirm('Reset all settings to default?')) {
            GM_setValue('baseUrl', 'gitingest.com');
            GM_setValue('openInNewWindow', false);
            alert('Settings reset! Refresh the page to see changes.');
        }
    });

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();