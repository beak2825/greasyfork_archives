// ==UserScript==
// @name         FV - Clinic Mini-game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      2.4
// @description  Clinic but better (joking)
// @match        https://www.furvilla.com/villager/455848
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558946/FV%20-%20Clinic%20Mini-game.user.js
// @updateURL https://update.greasyfork.org/scripts/558946/FV%20-%20Clinic%20Mini-game.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- TARGET ---
    const target = [...document.querySelectorAll('.profanity-filter')]
        .find(div => div.textContent.includes('testGameHere'));
    if (!target) return;

    target.innerHTML = '';
    target.style.maxWidth = '540px';
    target.style.fontFamily = 'Verdana, sans-serif';

    // --- DATA ---
    const villagers = [
        158,159,160,161,162,163,164,165,166,167,
        168,169,170,171,172,450,220,324,12
    ].map(id => `https://www.furvilla.com/img/villagers/0/${id}-4.png`);

    const illnesses = [
        {
            name: 'Hypothermia',
            symptoms: {
                shivers: [
                    "I-I haven't stopped shiverin' since this morning!",
                    "My whole body keeps shaking…",
                    "I can't stop shivering!"
                ],
                cold: [
                    "It's too cold!",
                    "C-Cold! Way too cold!",
                    "I feel freezing…"
                ],
                stiff: [
                    "My body feels stiff and slow.",
                    "I can barely move, everything feels tight."
                ]
            },
            cure: 'Mini Sun Capsule',
            img: 'https://www.furvilla.com/img/items/0/57-mini-sun-capsule.png',
            desc: 'Treats extreme cold exposure.'
        },
        {
            name: 'Broken Limb',
            symptoms: {
                weakness: [
                    "I feel really weak…",
                    "I can barely put weight on it."
                ],
                stiffness: [
                    "Everything feels stiff when I move.",
                    "It hurts to bend at all."
                ],
                "joint pain": [
                    "Everything hurts… my joints ache.",
                    "Sharp pain in my joints!"
                ]
            },
            cure: 'Medicinal Gauze',
            img: 'https://www.furvilla.com/img/items/0/27-medicinal-gauze.png',
            desc: 'Stabilizes broken bones.'
        },
        {
            name: 'Plague',
            symptoms: {
                weakness: [
                    "I'm so tired… I can barely stand.",
                    "I feel drained of all strength."
                ],
                coughing: [
                    "I've been coughing all day!",
                    "*cough* *cough* It won't stop!"
                ],
                sneezing: [
                    "I keep sneezing nonstop!",
                    "Achoo! Sorry…"
                ]
            },
            cure: 'Anti-Plague Potion',
            img: 'https://www.furvilla.com/img/items/0/37-anti-plague-potion.png',
            desc: 'Cures infectious diseases.'
        },
        {
            name: "Neptune's Disease",
            symptoms: {
                sneezing: [
                    "I can't stop sneezing!",
                    "Achoo! It's embarrassing…"
                ],
                "joint pain": [
                    "My joints ache like they're rusted.",
                    "It hurts deep in my bones."
                ],
                shivers: [
                    "I feel cold, but not normal cold…",
                    "My body keeps shuddering."
                ]
            },
            cure: 'Seadollar Salve',
            img: 'https://www.furvilla.com/img/items/0/17-seadollar-salve.png',
            desc: 'Soothes ocean-borne illnesses.'
        },
        {
            name: 'Ferality',
            symptoms: {
                "joint pain": [
                    "My joints burn with pain!",
                    "It hurts to move at all!"
                ],
                growling: [
                    "Grrr… I can't control these sounds…",
                    "I keep growling without meaning to."
                ],
                stiffness: [
                    "My body feels tense… too tense.",
                    "Everything feels locked up."
                ]
            },
            cure: 'Silver Concoction',
            img: 'https://www.furvilla.com/img/items/0/47-silver-concoction.png',
            desc: 'Suppresses feral transformations.'
        }
    ];

    const personalities = {
        Stoic: l => l,
        Nervous: l => `I-I think… ${l}`,
        Grumpy: l => `${l} Can we hurry?`,
        Cheerful: l => `${l} Heh…`,
        Liar: l => `...${l}`
    };

    // --- GAME STATE ---
    let patient, questionsLeft, revealedSymptoms;
    let score = 0, streak = 0, strikes = 0;
    const journal = {};

    const ui = document.createElement('div');
    target.appendChild(ui);

    function newPatient() {
        questionsLeft = 3;
        revealedSymptoms = [];

        const illness = illnesses[Math.floor(Math.random() * illnesses.length)];

        let personality;
        if (Math.random() < 0.15) {
            personality = 'Liar';
        } else {
            const normal = ['Stoic', 'Nervous', 'Grumpy', 'Cheerful'];
            personality = normal[Math.floor(Math.random() * normal.length)];
        }

        patient = {
            villager: villagers[Math.floor(Math.random() * villagers.length)],
            illness,
            personality,
            withheldSymptom: null
        };

        if (personality === 'Liar') {
            const keys = Object.keys(illness.symptoms);
            patient.withheldSymptom = keys[Math.floor(Math.random() * keys.length)];
        }

        render();
    }

    function render() {
        ui.innerHTML = `
            <div style="border:3px solid #6b4f2c; background:#e8dcc4; padding:8px;">
                <b>Score:</b> ${score} |
                <b>Streak:</b> ${streak} |
                <b>Strikes:</b> ${strikes}/3

                <div style="display:flex; margin-top:6px;">
                    <div style="flex:1; text-align:center;">
                        <img src="${patient.villager}" width="120">
                    </div>
                    <div style="flex:2; background:#fff; padding:6px;" id="dialogue">
                        "Please help me, doctor…"
                    </div>
                </div>

                <button id="ask" ${questionsLeft === 0 ? 'disabled' : ''}>
                    Ask how they feel (${questionsLeft})
                </button>

                <hr>
                <b>Medicine Shelf</b>
                <div id="meds"></div>

                <hr>
                <b>Medical Journal</b>
                <div id="journal">${renderJournal()}</div>
            </div>
        `;

        document.getElementById('ask').onclick = askQuestion;
        renderMedicines();
    }

    function askQuestion() {
        if (questionsLeft <= 0) return;
        questionsLeft--;

        const symptomKeys = Object.keys(patient.illness.symptoms)
            .filter(s => s !== patient.withheldSymptom);

        const remaining = symptomKeys.filter(s => !revealedSymptoms.includes(s));

        const symptom = remaining.length
            ? remaining[Math.floor(Math.random() * remaining.length)]
            : symptomKeys[Math.floor(Math.random() * symptomKeys.length)];

        revealedSymptoms.push(symptom);

        const lines = patient.illness.symptoms[symptom];
        const line = lines[Math.floor(Math.random() * lines.length)];
        const finalLine = personalities[patient.personality](line);

        document.getElementById('dialogue').textContent = `"${finalLine}"`;

        const askBtn = document.getElementById('ask');
        askBtn.textContent = `Ask how they feel (${questionsLeft})`;
        askBtn.disabled = questionsLeft === 0;
    }

    function renderMedicines() {
        const m = document.getElementById('meds');
        m.innerHTML = '';

        illnesses.forEach(i => {
            const img = document.createElement('img');
            img.src = i.img;
            img.width = 40;
            img.style.margin = '4px';
            img.style.cursor = 'pointer';
            img.onclick = () => inspectMedicine(i);
            m.appendChild(img);
        });
    }

    function inspectMedicine(med) {
        document.getElementById('dialogue').textContent =
            `${med.cure}: ${med.desc}`;

        if (confirm(`Use ${med.cure}?`)) applyMedicine(med);
    }

    function applyMedicine(med) {
        if (med.name === patient.illness.name) {
            let gained = 10;
            if (patient.personality === 'Liar') gained += 10;

            score += gained;
            streak++;
            journal[med.name] = patient.illness;

            document.getElementById('dialogue').textContent =
                patient.personality === 'Liar'
                    ? `"You figured it out anyway… impressive."`
                    : `"I feel so much better now!"`;
        } else {
            strikes++;
            streak = 0;
            document.getElementById('dialogue').textContent =
                `"That didn't help at all…"`;
        }

        strikes >= 3 ? gameOver() : setTimeout(newPatient, 1200);
    }

    function renderJournal() {
        let html = `
            <div style="font-size:12px; margin-bottom:6px;">
                <i>Some patients may withhold symptoms.</i>
            </div>
        `;

        if (!Object.keys(journal).length) {
            html += '<i>No illnesses recorded yet.</i>';
        } else {
            html += Object.values(journal).map(i => `
                <div style="margin-bottom:6px;">
                    <b>${i.name}</b><br>
                    Symptoms: ${Object.keys(i.symptoms).join(', ')}<br>
                    Cure: ${i.cure}
                </div>
            `).join('');
        }

        return html;
    }

    function gameOver() {
        ui.innerHTML = `
            <div style="border:3px solid #900; background:#f5d0d0; padding:10px;">
                <h3>Game Over</h3>
                <p>Final Score: ${score}</p>
                <button id="restart">Restart Clinic</button>
            </div>
        `;
        document.getElementById('restart').onclick = () => {
            score = streak = strikes = 0;
            for (let k in journal) delete journal[k];
            newPatient();
        };
    }

    newPatient();
})();
