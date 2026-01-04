// ==UserScript==
// @name         FMP Position Attribute Highlighter (Universal Multi-Language)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Highlights attributes based on player position. Automatically detects skills in 39+ languages using keyword matching.
// @license      MIT
// @author       kalenderadam
// @match        https://footballmanagerproject.com/Team/Player*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557446/FMP%20Position%20Attribute%20Highlighter%20%28Universal%20Multi-Language%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557446/FMP%20Position%20Attribute%20Highlighter%20%28Universal%20Multi-Language%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .fmp-primary-skill {
            background-color: #ffd700 !important;
            color: #000 !important;
            font-weight: bold;
            border-radius: 4px;
        }
        .fmp-secondary-skill {
            background-color: #b0e0e6 !important;
            color: #000 !important;
            font-weight: bold;
            border-radius: 4px;
        }
        #playerdata .skilltable th, #playerdata .skilltable td {
            padding: 4px 2px;
        }
    `);

    // --- EVRENSEL SÖZLÜK (Tüm Diller İçin Kökler) ---
    // Buradaki kelimeler, o yeteneğin farklı dillerdeki karşılıklarının ortak parçalarıdır.
    // Örneğin 'VEL' hem 'Velocity', 'Velocidad', 'Velocita' kelimelerini yakalar.
    const skillDictionary = {
        // --- KALECİ YETENEKLERİ ---
        GK_POS: ['Poz', 'Pos', 'Posi', 'Place', 'Ste'], // Positioning, Pozisyon, Posición
        GK_1V1: ['1e1', '1v1', '1on1', '1vs1', 'Face', 'Duel', 'Uno'], // One on One, Bire bir
        GK_HAN: ['ElK', 'Han', 'Man', 'Pre', 'Pri', 'Cat'], // Handling, Elle Kontrol, Manos, Presa
        GK_REF: ['Ref', 'Rif'], // Reflexes, Refleks, Riflessi
        GK_AER: ['HH', 'Aer', 'Air', 'Aér', 'Com'], // Aerial, Hava Hakimiyeti
        GK_JUM: ['Sçr', 'Jum', 'Sal', 'Det', 'Spr', 'Bal'], // Jumping, Sıçrama, Salto

        // --- FİZİKSEL ---
        PHY_SPE: ['Hız', 'Spe', 'Pac', 'Vel', 'Vit', 'Acc', 'Sch'], // Speed/Pace, Hız, Vitesse, Schnelligkeit
        PHY_STA: ['Day', 'Sta', 'Res', 'End', 'Aus', 'Con'], // Stamina, Dayanıklılık, Endurance
        PHY_STR: ['Güç', 'Str', 'Fue', 'For', 'Pui', 'Kra'], // Strength, Güç, Fuerza, Kraft

        // --- SAVUNMA ---
        DEF_MRK: ['Mrk', 'Mrj', 'Mar', 'Dec', 'Deck'], // Marking, Markaj, Marcaje
        DEF_TAC: ['TpK', 'Tac', 'Tack', 'Ent', 'Con', 'Zwe'], // Tackling, Top Kapma, Entradas
        DEF_HEA: ['Kaf', 'Hea', 'Cab', 'Têt', 'Tes', 'Kop'], // Heading, Kafa, Cabeceo, Tête

        // --- TEKNİK / HÜCUM ---
        ATT_PAS: ['Pas'], // Passing, Pas, Pase, Passen (Neredeyse tüm dillerde 'Pas' kökü var)
        ATT_CRO: ['Ort', 'Cro', 'Cen', 'Tra', 'Fla', 'Cr'], // Crossing, Orta, Centros, Traversen
        ATT_TEC: ['Tek', 'Tec', 'Teck'], // Technique, Teknik, Técnica
        ATT_FIN: ['Bit', 'Fin', 'Rem', 'Abs', 'Mat'], // Finishing, Bitiricilik, Remate, Abschluss
        ATT_LON: ['Uza', 'Lon', 'Lej', 'Loi', 'Fer', 'Dis', 'Sht'] // Long Shots, Uzaktan, Lejanos, Distanza
    };

    // Pozisyon -> Yetenek Kodları Eşleşmesi
    const positionSkills = {
        GK:  { primary:['GK_POS','GK_1V1','GK_HAN'], secondary:['GK_REF','GK_AER','GK_JUM','PHY_SPE'] },
        DC:  { primary:['DEF_MRK','DEF_TAC','GK_POS'], secondary:['DEF_HEA','PHY_STA','PHY_SPE'] },
        DL:  { primary:['DEF_TAC','ATT_CRO','GK_POS'], secondary:['ATT_PAS','ATT_TEC','PHY_SPE'] },
        DR:  { primary:['DEF_TAC','ATT_CRO','GK_POS'], secondary:['ATT_PAS','ATT_TEC','PHY_SPE'] },
        DMC: { primary:['DEF_MRK','DEF_TAC','GK_POS'], secondary:['DEF_HEA','ATT_PAS','PHY_STA'] },
        MC:  { primary:['ATT_PAS','ATT_TEC','GK_POS'], secondary:['DEF_TAC','DEF_HEA','PHY_STA'] },
        ML:  { primary:['ATT_CRO','ATT_PAS','GK_POS'], secondary:['ATT_TEC','DEF_HEA','PHY_SPE'] },
        MR:  { primary:['ATT_CRO','ATT_PAS','GK_POS'], secondary:['ATT_TEC','DEF_HEA','PHY_SPE'] },
        AMC: { primary:['ATT_PAS','ATT_FIN','ATT_TEC'], secondary:['ATT_CRO','ATT_LON','GK_POS'] },
        AML: { primary:['ATT_CRO','ATT_PAS','GK_POS'], secondary:['ATT_TEC','ATT_FIN','PHY_SPE'] },
        AMR: { primary:['ATT_CRO','ATT_PAS','GK_POS'], secondary:['ATT_TEC','ATT_FIN','PHY_SPE'] },
        FC:  { primary:['ATT_FIN','DEF_HEA'],           secondary:['ATT_LON','GK_POS','PHY_SPE'] }
    };

    // Tablodaki metni analiz edip hangi yetenek kodu olduğunu bulan akıllı fonksiyon
    function detectSkillKey(headerText) {
        if (!headerText) return null;
        // Metni temizle ve küçük harfe çevir
        const cleanText = headerText.trim().toLowerCase();

        for (const [key, aliases] of Object.entries(skillDictionary)) {
            // Alias listesindeki her bir kök kelime için kontrol et
            for (const alias of aliases) {
                // Eğer tablodaki yazı bu kök kelimeyi içeriyorsa (örn: "Velocidad" -> "vel" içerir)
                if (cleanText.includes(alias.toLowerCase())) {
                    return key;
                }
            }
        }
        return null;
    }

    function highlightSkills() {
        const posElement = document.querySelector('.pitch-position');
        if (!posElement) return;

        const playerPos = posElement.textContent.trim();
        const cfg = positionSkills[playerPos];
        if (!cfg) return;

        const table = document.querySelector('#playerdata .skilltable');
        if (!table) return;

        // Başlıkları (th) gez
        table.querySelectorAll('th').forEach((th, i) => {
            const cellText = th.textContent;
            const skillKey = detectSkillKey(cellText);

            if (!skillKey) return; // Tanınmayan bir sütunsa atla

            const isPrimary = cfg.primary.includes(skillKey);
            const isSecondary = cfg.secondary.includes(skillKey);

            if (isPrimary || isSecondary) {
                const className = isPrimary ? 'fmp-primary-skill' : 'fmp-secondary-skill';

                // Başlığı boya
                th.classList.add(className);

                // Değer hücresini boya (th'nin altındaki td'yi bulur)
                const valueRow = th.parentElement.nextElementSibling;
                if (!valueRow) return;

                const cell = valueRow.children[i];
                if (cell) {
                    const span = cell.querySelector('.num');
                    if (span) {
                        span.classList.add(className);
                    } else {
                        cell.classList.add(className);
                    }
                }
            }
        });
    }

    setTimeout(highlightSkills, 500);
})();