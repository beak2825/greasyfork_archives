// ==UserScript==
// @name         Librus – Średnia ważona + roczna + banner
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  Liczy średnią ważoną z ocen i średnią roczną w Librusie, dodaje banner w lewym górnym rogu
// @match        https://synergia.librus.pl/przegladaj_oceny/uczen
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561980/Librus%20%E2%80%93%20%C5%9Arednia%20wa%C5%BCona%20%2B%20roczna%20%2B%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/561980/Librus%20%E2%80%93%20%C5%9Arednia%20wa%C5%BCona%20%2B%20roczna%20%2B%20banner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function liczSrednie() {
        const tabela = document.getElementsByClassName('decorated stretch')[1]?.children[1];
        if (!tabela) return;

        let sumaRoczna = 0;
        let sumaWagRoczna = 0;

        for (let i = 0; i < tabela.children.length - 2; i += 2) {
            let suma = 0;
            let sumaWag = 0;

            const komorkaOcen = tabela.children[i].children[2];
            if (!komorkaOcen) continue;

            const oceny = komorkaOcen.children;

            for (let j = 0; j < oceny.length; j++) {
                const el = oceny[j].children[0];
                if (!el) continue;

                const title = el.getAttribute("title");
                if (!title || !title.includes("Licz do średniej: t")) continue;

                const wagaMatch = title.match(/Waga:\s*(\d+)/);
                if (!wagaMatch) continue;

                let waga = parseInt(wagaMatch[1], 10);
                let tekstOceny = el.innerText.trim();

                let ocena = parseInt(tekstOceny, 10);
                if (tekstOceny.includes("+")) ocena += 0.5;
                if (tekstOceny.includes("-")) ocena -= 0.25;

                suma += ocena * waga;
                sumaWag += waga;
            }

            // Średnia przedmiotu
            const wynik = sumaWag > 0 ? (suma / sumaWag).toFixed(2) : "-";
            tabela.children[i].children[3].innerText = wynik;

            // Dodajemy do średniej rocznej
            if (sumaWag > 0) {
                sumaRoczna += suma;
                sumaWagRoczna += sumaWag;
            }
        }

        // Średnia roczna
        const sredniaRoczna = sumaWagRoczna > 0 ? (sumaRoczna / sumaWagRoczna).toFixed(2) : "-";

        // Wstawiamy banner w lewym górnym rogu
        if (!document.getElementById('sredniaBanner')) {
            const banner = document.createElement('div');
            banner.id = 'sredniaBanner';
            banner.style.position = 'fixed';
            banner.style.top = '10px';
            banner.style.left = '10px';
            banner.style.display = 'flex';
            banner.style.alignItems = 'center';
            banner.style.backgroundColor = 'rgba(255,255,255,0.9)';
            banner.style.padding = '5px 10px';
            banner.style.borderRadius = '8px';
            banner.style.zIndex = '9999';
            banner.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

            const img = document.createElement('img');
            img.src = 'https://files.catbox.moe/zlyqku.png';
            img.style.height = '40px';
            img.style.marginRight = '10px';
            banner.appendChild(img);

            const text = document.createElement('span');
            text.innerText = `WAŻONA: ${sredniaRoczna}`;
            text.style.fontWeight = 'bold';
            text.style.fontSize = '18px';
            text.style.background = 'linear-gradient(90deg, #ff80bf, #b580ff)';
            text.style.webkitBackgroundClip = 'text';
            text.style.webkitTextFillColor = 'transparent';
            banner.appendChild(text);

            document.body.appendChild(banner);
        }
    }

    setTimeout(liczSrednie, 2000);
})();