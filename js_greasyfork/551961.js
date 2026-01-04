// ==UserScript==
// @name         Astral [LITE]
// @namespace    -
// @version      5.0.0
// @description  This script was been writed by ilyax aka the real name liyaa basically this script was made for Nightmare who used to bully us thanks for waiting this script.
// @author       ilyax
// @developer    ilyax aka liyaa, doorsfloor2, cubicflex, jeanne
// @match        *://sploop.io/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/brain.js@2.0.0-beta.24/dist/browser.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/551961/Astral%20%5BLITE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/551961/Astral%20%5BLITE%5D.meta.js
// ==/UserScript==

/* TODO Lists:
ez
*/

let testmode = true;

async function sleep(a) {
    await new Promise(a => {
        setTimeout(() => {
            a();
        }, 1000);
    });
}

const AstralID = Math.floor(Math.random() * 99999)
let AstralName;
var log = console.log;
let statusMode = {
    cps: 0,
    pps: 0,
    ping: 0,
    shame: 0,
    language: null,
    lasthat: 0,
    ReplaceDelay: 0,
    predictedDamage: 0,
    connected: false,
    overridepush: false,
}

let Features = {
    auto_heal: true,
    auto_placer: true,
    auto_break: true,
    naginata_sync: true,
    auto_replace: true,
    musket_sync: false,
    auto_push: true,
    packgod: true,
}

const server = {
    spawned: 35,
    update: 20,
    died: 19,
    ping: 15,
    entity_spawned: 32,
    killed: 28,
    create_clan: 24,
    update_clan: 16,
    leave_clan: 27,
    entity_chat: 30,
    connected: 33,
    hooked: 25,
}

let Vars = {
    entities: [],
    clan: [],
    enemyLength: []
}

const type = {
    spike: 4,
    windwill: 5,
    trap: 7,
    heal: 2,
}

const hats = {
    bush_gear: 1,
    berserker: 2,
    jungle_gear: 3,
    crystal_gear: 4,
    spike_gear: 5,
    immunity_gear: 6,
    boost_Hat: 7,
    apple_gear: 8,
    scuba_gear: 9,
    hood_gear: 10,
    demolist: 11,
    snow_Hat: 12,
}

let Game_Tick = 111;
let sincetick = 0;
let ping = {
    previousPingValues: [],
    lagSpikeThreshold: 3,
    maxPingHistory: 10,
}

let LearnedAI = []
let debug = {}

let sizes = {
    trap: 70,
    spike: 70,
    player: 70,
}

let IDweapon = {
    hammer: 15,
    naginata: 28,
}

let statusMenu = document.createElement("div");
statusMenu.style.position = "fixed";
statusMenu.style.width = "300px";
statusMenu.style.height = "auto";
statusMenu.style.top = "30px";
statusMenu.style.left = "30px";
statusMenu.style.border = "2px solid rgba(255, 255, 255, 0.8)";
statusMenu.style.borderRadius = "8px";
statusMenu.style.background = "#66000000";
statusMenu.style.backdropFilter = "blur(10px)";
statusMenu.style.zIndex = "3";
statusMenu.style.overflow = "hidden";
statusMenu.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
statusMenu.style.padding = "15px";
statusMenu.style.transition = "opacity 0.3s ease";

statusMenu.id = "modmenu";
statusMenu.innerHTML = `
    <style>
    p {
        color: white;
        font-weight: bolder;
        font-size: 18px;
        position: relative;
        left: 20px;
    }

    .line {
        width: 300px;
        height: 10px;
        background: white;
    }

    .translate-dropdownlist {
        width: calc(100% - 40px);
        padding: 10px;
        margin: 10px 20px;
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 5px;
        background: #66000000; /* Set background to black */
        color: white; /* Set text color to white */
        font-size: 16px;
        cursor: pointer;
    }

    .translate-dropdownlist .translated-option {
        background: black; /* Set option background to black */
        color: white; /* Set option text color to white */
    }

    /* Hide the default checkbox */
input[type="checkbox"] {
    display: none;
}

/* Style the label to look like a custom checkbox */
label {
    position: relative;
    padding-left: 30px; /* Space for the custom checkbox */
    cursor: pointer;
    font-size: 16px;
    color: #333;
    user-select: none; /* Prevent text selection */
}

/* Create the custom checkbox */
label::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border: 2px solid #007BFF; /* Border color */
    border-radius: 4px; /* Rounded corners */
    background-color: white; /* Background color */
    transition: background-color 0.3s, border-color 0.3s; /* Smooth transition */
}

/* Change the appearance when the checkbox is checked */
input[type="checkbox"]:checked + label::before {
    background-color: #007BFF; /* Background color when checked */
    border-color: #0056b3; /* Darker border color when checked */
}

/* Add a checkmark */
label::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 10px;
    width: 6px;
    height: 12px;
    border: solid white; /* Checkmark color */
    border-width: 0 2px 2px 0; /* Create a checkmark shape */
    transform: rotate(45deg);
    opacity: 0; /* Initially hidden */
    transition: opacity 0.3s; /* Smooth transition */
}

/* Show the checkmark when checked */
input[type="checkbox"]:checked + label::after {
    opacity: 1; /* Show checkmark */
}
    </style>
    <br>
    <p id="showCps">CPS: null</p>
    <p id="showPps">lastBan: null</p>
    <p id="showPing">Ping: null</p>
    <p id="showShame">Shame: null</p>
    <br>
`;

let languageDropdown = document.createElement("select");
languageDropdown.className = "translate-dropdownlist";
const languages = [
    "No Translate",
    "Abkhazian (ab)",
    "Afar (aa)",
    "Afrikaans (af)",
    "Albanian (sq)",
    "Amharic (am)",
    "Arabic (ar)",
    "Armenian (hy)",
    "Aymara (ay)",
    "Azerbaijani (az)",
    "Bashkir (ba)",
    "Basque (eu)",
    "Bemba (bem)",
    "Belarusian (be)",
    "Bengali (bn)",
    "Bislama (bi)",
    "Bosnian (bs)",
    "Breton (br)",
    "Bulgarian (bg)",
    "Burmese (my)",
    "Catalan (ca)",
    "Cebuano (ceb)",
    "Chamorro (ch)",
    "Chinese (zh)",
    "Corsican (co)",
    "Croatian (hr)",
    "Czech (cs)",
    "Danish (da)",
    "Dutch (nl)",
    "Dzongkha (dz)",
    "English (en)",
    "Esperanto (eo)",
    "Estonian (et)",
    "Fijian (fj)",
    "Finnish (fi)",
    "French (fr)",
    "Fula (ff)",
    "Galician (gl)",
    "Georgian (ka)",
    "German (de)",
    "Greek (el)",
    "Guarani (gn)",
    "Gujarati (gu)",
    "Haitian Creole (ht)",
    "Hebrew (he)",
    "Hindi (hi)",
    "Hmong (hmn)",
    "Hungarian (hu)",
    "Icelandic (is)",
    "Igbo (ig)",
    "Indonesian (id)",
    "Irish (ga)",
    "Italian (it)",
    "Japanese (ja)",
    "Javanese (jw)",
    "Kannada (kn)",
    "Kazakh (kk)",
    "Khmer (km)",
    "Kinyarwanda (rw)",
    "Korean (ko)",
    "Kurdish (ku)",
    "Kyrgyz (ky)",
    "Lao (lo)",
    "Latvian (lv)",
    "Lithuanian (lt)",
    "Luxembourgish (lb)",
    "Macedonian (mk)",
    "Malagasy (mg)",
    "Malay (ms)",
    "Malayalam (ml)",
    "Maltese (mt)",
    "Maori (mi)",
    "Marathi (mr)",
    "Mingrelian (mg)",
    "Mingrelian (xmf)",
    "Mongolian (mn)",
    "Nepali (ne)",
    "Norwegian (no)",
    "Oromo (om)",
    "Pashto (ps)",
    "Persian (fa)",
    "Polish (pl)",
    "Portuguese (pt)",
    "Punjabi (pa)",
    "Quechua (qu)",
    "Romanian (ro)",
    "Russian (ru)",
    "Samoan (sm)",
    "Serbian (sr)",
    "Shona (sn)",
    "Sindhi (sd)",
    "Sinhala (si)",
    "Slovak (sk)",
    "Slovenian (sl)",
    "Somali (so)",
    "Sotho (st)",
    "Spanish (es)",
    "Sundanese (su)",
    "Swahili (sw)",
    "Swedish (sv)",
    "Tajik (tg)",
    "Tamil (ta)",
    "Telugu (te)",
    "Thai (th)",
    "Tigrinya (ti)",
    "Turkish (tr)",
    "Turkmen (tk)",
    "Twi (tw)",
    "Ukrainian (uk)",
    "Urdu (ur)",
    "Uzbek (uz)",
    "Vietnamese (vi)",
    "Welsh (cy)",
    "Wolof (wo)",
    "Xhosa (xh)",
    "Yoruba (yo)",
    "Zulu (zu)"
];


languages.forEach(language => {
    let option = document.createElement("option");
    option.className = "translated-option";
    option.value = language.split(" ")[1];
    option.textContent = language;
    languageDropdown.appendChild(option);
});

statusMenu.appendChild(languageDropdown);

languageDropdown.addEventListener("change", function() {
    const selectedLanguage = this.value;

    if (selectedLanguage !== "No Translate") {
        const languageCode = selectedLanguage.slice(-3).replace(")", "");
        statusMode.language = languageCode;
    } else {
        statusMode.language = "none";
    }
});

let showmenu = true;


document.addEventListener('DOMContentLoaded', () => {
    const musicPlayerHTML = `
<style>
/* General Player Container */
#musicPlayer {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, rgba(30, 30, 40, 0.9), rgba(20, 20, 30, 0.9));
    padding: 30px;
    border-radius: 20px;
    backdrop-filter: blur(16px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.8), inset 0 0 12px rgba(255, 255, 255, 0.1);
    z-index: 9999;
    color: #f0f0f0;
    font-family: 'Poppins', Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 340px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease-in-out;
}

#musicPlayer:hover {
    transform: translate(-50%, -50%) scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.9), inset 0 0 15px rgba(255, 255, 255, 0.2);
}

/* Title */
#musicPlayer h2 {
    font-size: 26px;
    margin: 0 0 20px 0;
    color: #ffffff;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.9);
    font-weight: 900;
    transition: color 0.3s ease-in-out;
}

#musicPlayer h2:hover {
    color: #66E459;
}

/* Dropdown Menu */
#musicSelect {
    width: 100%;
    padding: 14px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    background: rgba(10, 10, 10, 0.8);
    color: white;
    font-size: 16px;
    font-family: 'Poppins', Arial, sans-serif;
    cursor: pointer;
    margin-bottom: 20px;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6);
}

#musicSelect:hover {
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.8);
    background: rgba(40, 40, 40, 0.9);
}

/* Play Button */
.play-button {
    width: 90px;
    height: 90px;
    background: radial-gradient(circle, #57C84D, #3E8E39);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 40px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.9), inset 0 -3px 8px rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease, transform 0.2s ease;
    margin-bottom: 25px;
}

.play-button:hover {
    transform: scale(1.2) rotate(10deg);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 1), inset 0 4px 12px rgba(255, 255, 255, 0.3);
    background: radial-gradient(circle, #66E459, #4DA547);
}

.play-button:active {
    transform: scale(0.9);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
}

/* Lyrics Section */
#lyrics {
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    line-height: 1.6;
    text-shadow: 0 3px 8px rgba(0, 0, 0, 0.9);
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    width: 100%;
    backdrop-filter: blur(10px);
    transition: background 0.3s ease-in-out;
}

#lyrics:hover {
    background: rgba(255, 255, 255, 0.15);
}

</style>


        <div id="musicPlayer">
            <h2 style="margin: 0; font-size: 18px;">Astral Music Player</h2>
            <select id="musicSelect">
                <option>Select a song!</option>
            </select>
            <audio id="audioPlayer" style="display: none;"></audio>
            <button class="play-button">▶</button>
            <div id="lyrics"></div>
        </div>
    `;

    // Append the music player HTML to the body
    document.body.insertAdjacentHTML('beforeend', musicPlayerHTML);

    const musicSelect = document.getElementById('musicSelect');
    const audioPlayer = document.getElementById('audioPlayer');
    const playButton = document.querySelector('.play-button');
    const lyricsContainer = document.getElementById('lyrics');

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let analyser, dataArray, source;

    const songs = {
        "Shamrain - To Leave": {
            url: "https://cdn.glitch.global/b1a88692-1b5d-48f4-8291-ecb880ee0d21/yt1s.com%20-%20To%20Leave.mp3?v=1736366003477",
            hasLyrics: true
        },
        "Hardwell & KSHMR - Power": {
            url: "https://cdn.glitch.global/b1a88692-1b5d-48f4-8291-ecb880ee0d21/yt1s.com%20-%20Hardwell%20%20KSHMR%20%20Power%20Official%20Lyric%20Video.mp3?v=1736367726578",
            hasLyrics: true
        },
        "Woodkid - To ashes and blood": {
            url: "https://cdn.glitch.global/b1a88692-1b5d-48f4-8291-ecb880ee0d21/yt1s.com%20-%20Woodkid%20%20To%20Ashes%20and%20Blood%20from%20the%20series%20Arcane%20League%20of%20Legends%20Lyrics.mp3?v=1736368153770",
            hasLyrics: true
        },
        "Ashnikko - Daisy": {
            url: "https://cdn.glitch.global/b1a88692-1b5d-48f4-8291-ecb880ee0d21/yt1s.com%20-%20Ashnikko%20%20Daisy%20Lyrics.mp3?v=1736576301911",
            hasLyrics: true
        }
    };

    for (const song in songs) {
        const option = document.createElement('option');
        option.value = song;
        option.textContent = song;
        musicSelect.appendChild(option);
    }

    playButton.addEventListener('click', () => {
        const selectedSong = musicSelect.value;
        if (selectedSong !== "Select a song!") {
            audioPlayer.src = songs[selectedSong].url;
            audioPlayer.play();
            newNotif(selectedSong + " Has Playing!", "success", 3000);

            if (songs[selectedSong].hasLyrics) {
                lyricsContainer.innerText = "Playing With Lyrics!";
                playSong(selectedSong);
            } else {
                lyricsContainer.innerText = "No lyrics detected!";
            }
        }
    });


});
let ShamraimtoLeave = [
    { "seconds": 72, "lyrics": "I really have to leave now" },
    { "seconds": 78, "lyrics": "Can't stay here anymore" },
    { "seconds": 82, "lyrics": "No more" },
    { "seconds": 84, "lyrics": "We've come too far" },
    { "seconds": 90, "lyrics": "Not another day no more" },
    { "seconds": 96, "lyrics": "There is no return" },
    { "seconds": 102, "lyrics": "No words to explain" },
    { "seconds": 106, "lyrics": "No excuses left to make" },
    { "seconds": 112, "lyrics": "There is no one to blame" },
    { "seconds": 120, "lyrics": "Blame" },
    { "seconds": 125, "lyrics": "> Blame <" },
    { "seconds": 131, "lyrics": "There is no one to blame" },
    { "seconds": 137, "lyrics": "There is no one else to blame" },
    { "seconds": 142, "lyrics": "But me" },
    { "seconds": 168, "lyrics": "I've lost myself" },
    { "seconds": 174, "lyrics": "And I lost you" },
    { "seconds": 179, "lyrics": "Things are not well" },
    { "seconds": 180, "lyrics": "I know you see it too" },
    { "seconds": 184, "lyrics": "No, they're not well" },
    { "seconds": 186, "lyrics": "I know you feel it too" },
    { "seconds": 192, "lyrics": "There is no return" },
    { "seconds": 198, "lyrics": "No point of going on" },
    { "seconds": 203, "lyrics": "All excuses that we made" },
    { "seconds": 208, "lyrics": "There is no one to blame" },
    { "seconds": 215, "lyrics": "BLAME" },
    { "seconds": 221, "lyrics": "BLAMEEEEEE..." },
    { "seconds": 226, "lyrics": "There is no one to blame" },
    { "seconds": 232, "lyrics": "There is no one else to blame" },
    { "seconds": 239, "lyrics": "But me" }
];

let isThisPower = [
    { "seconds": 0, "lyrics": "I fill you up with bones" },
    { "seconds": 1, "lyrics": "That could never break" },
    { "seconds": 3, "lyrics": "Take you to a darker" },
    { "seconds": 4, "lyrics": "shade of grey" },
    { "seconds": 7, "lyrics": "Warm you like a sun" },
    { "seconds": 8, "lyrics": "That'll never fade" },
    { "seconds": 11, "lyrics": "Oh-oh-oh, oh-oh" },
    { "seconds": 14, "lyrics": "This is power" },
    { "seconds": 18, "lyrics": "> This is power <" },
    { "seconds": 21, "lyrics": ">> This is power <<" },
    { "seconds": 25, "lyrics": "This is power, power," },
    { "seconds": 28, "lyrics": "power" },
    { "seconds": 43, "lyrics": "Power (Power)" },
    { "seconds": 47, "lyrics": "This is power" },
    { "seconds": 51, "lyrics": "> This is power <" },
    { "seconds": 54, "lyrics": "This is power, power," },
    { "seconds": 57, "lyrics": "power" },
    { "seconds": 62, "lyrics": "I'll give you every heart" },
    { "seconds": 63, "lyrics": "Of a hundred souls" },
    { "seconds": 65, "lyrics": "You could be the fire" },
    { "seconds": 67, "lyrics": "To kill the cold" },
    { "seconds": 69, "lyrics": "I'll break you like a rock" },
    { "seconds": 70, "lyrics": "That could never hold" },
    { "seconds": 72, "lyrics": "Oh-oh-oh, oh-oh" },
    { "seconds": 76, "lyrics": "This is power" },
    { "seconds": 80, "lyrics": "> This is power <" },
    { "seconds": 83, "lyrics": ">> This is power <<" },
    { "seconds": 87, "lyrics": "This is power, power," },
    { "seconds": 98, "lyrics": "power" },
    { "seconds": 113 , "lyrics": "Power" },
    { "seconds": 127, "lyrics": "This is power" },
    { "seconds": 131, "lyrics": "> This is power <" },
    { "seconds": 135, "lyrics": ">> This is power <<" },
    { "seconds": 139, "lyrics": "This is power, power," },
    { "seconds": 142, "lyrics": "power" }
];

let toAshesAndBlood = [
    { "seconds": 12, "lyrics": "You walk along the edge of danger" },
    { "seconds": 16, "lyrics": "And it will change you" },
    { "seconds": 22, "lyrics": "Why would you let this voice" },
    { "seconds": 23, "lyrics": "set in your head?" },
    { "seconds": 27, "lyrics": "It is meant to destroy you" },
    { "seconds": 35, "lyrics": "You summon storms, you" },
    { "seconds": 37, "lyrics": "play with nature" },
    { "seconds": 40, "lyrics": "Now watch it hurt you" },
    { "seconds": 46, "lyrics": "Why would you want to shape" },
    { "seconds": 47, "lyrics": "the world in your hands?"},
    { "seconds": 51, "lyrics": "You will never make it through" },
    { "seconds": 68, "lyrics": "Catch the fire burning" },
    { "seconds": 71, "lyrics": "out your soul" },
    { "seconds": 79, "lyrics": "Just make it die or" },
    { "seconds": 82, "lyrics": "you will turn it all" },
    { "seconds": 89, "lyrics": "To ashes and blood" },
    { "seconds": 95, "lyrics": "To ashes and blood" },
    { "seconds": 102, "lyrics": "You waste your life to gain power" },
    { "seconds": 106, "lyrics": "You shift the game rules" },
    { "seconds": 113, "lyrics": "How does it feel to reach the line" },
    { "seconds": 114, "lyrics": "that no one ever got to cross?" },
    { "seconds": 118, "lyrics": "Does it make you a god now?" },
    { "seconds": 126, "lyrics": "Every sin will be forgiven" },
    { "seconds": 131, "lyrics": "If you lay down your weapons to the ground" },
    { "seconds": 153, "lyrics": "Catch the fire burning" },
    { "seconds": 155, "lyrics": "out your soul" },
    { "seconds": 164, "lyrics": "Just make it die" },
    { "seconds": 166, "lyrics": "or you will fall" },
    { "seconds": 175, "lyrics": "Catch the fire burning" },
    { "seconds": 177, "lyrics": "out your soul" },
    { "seconds": 187, "lyrics": "Just make it die or" },
    { "seconds": 189, "lyrics": "you will turn it all" },
    { "seconds": 196, "lyrics": "To ashes and blood" },
    { "seconds": 201, "lyrics": "To ashes and blood" },
    { "seconds": 207, "lyrics": "To ashes and blood" },
    { "seconds": 213, "lyrics": "To ashes and blood" },
    { "seconds": 219, "lyrics": "To ashes and blood" },
];

let Daisy = [
    { "seconds": 4, "lyrics": "You don't wanna see me bratty" },
    { "seconds": 6, "lyrics": "Pet the kitty, call me catty" },
    { "seconds": 8, "lyrics": "Make your man call me daddy" },
    { "seconds": 10, "lyrics": "He talk too much, he's too chatty" },
    { "seconds": 12, "lyrics": "CEO, I'm savvy" },
    { "seconds": 14, "lyrics": "Respect a bitch, I'm a maverick" },
    { "seconds": 16, "lyrics": "Flexible, so elastic" },
    { "seconds": 18, "lyrics": "But don't do you dare" },
    { "seconds": 19, "lyrics": "bend a bitch backwards" },
    { "seconds": 20, "lyrics": "Fuck a princess, I'm a king" },
    { "seconds": 22, "lyrics": "Bow down and kiss on my ring" },
    { "seconds": 24, "lyrics": "Being a bitch is my kink" },
    { "seconds": 26, "lyrics": "What the fuck else did you think?" },
    { "seconds": 28, "lyrics": "Fuck a princess, I'm a king" },
    { "seconds": 30, "lyrics": "Bow down and kiss on my ring" },
    { "seconds": 32, "lyrics": "It's gonna hurt, it'll sting" },
    { "seconds": 34, "lyrics": "Spittin' your blood in the sink" },
    { "seconds": 35, "lyrics": "I'm crazy, but you like that" },
    { "seconds": 37, "lyrics": "I bite back" },
    { "seconds": 39, "lyrics": "Daisies on your nightstand" },
    { "seconds": 41, "lyrics": "never forget it" },
    { "seconds": 43, "lyrics": "I blossom in the moonlight" },
    { "seconds": 45, "lyrics": "screw eyes" },
    { "seconds": 47, "lyrics": "Glacial with the blue ice" },
    { "seconds": 50, "lyrics": "I'm terrifying" },
    { "seconds": 58, "lyrics": "" },
    { "seconds": 60, "lyrics": "I no Cinderella I like the shoes" },
    { "seconds": 61, "lyrics": "Big glass platforms" },
    { "seconds": 62, "lyrics": "bitch, I'm choosy" },
    { "seconds": 63, "lyrics": "Long blue hair, blue as a bruise" },
    { "seconds": 65, "lyrics": "Only trust a fella for some" },
    { "seconds": 66, "lyrics": "light amusement" },
    { "seconds": 67, "lyrics": "I'm no prey, but I am pursued" },
    { "seconds": 69, "lyrics": "Pray for me, Nana, on" },
    { "seconds": 70, "lyrics": "the church's pews" },
    { "seconds": 71, "lyrics": "No dickstraction can confuse me" },
    { "seconds": 73, "lyrics": "Whiskey in my hip flask" },
    { "seconds": 74, "lyrics": "nothing fruity" },
    { "seconds": 75, "lyrics": "Fuck a princess, I'm a king" },
    { "seconds": 77, "lyrics": "Bow down and kiss on my ring" },
    { "seconds": 79, "lyrics": "Being a bitch is my kink" },
    { "seconds": 81, "lyrics": "What the fuck else did you think?" },
    { "seconds": 83, "lyrics": "Fuck a princess, I'm a king" },
    { "seconds": 85, "lyrics": "Bow down and kiss on my ring" },
    { "seconds": 87, "lyrics": "It's gonna hurt, it'll sting" },
    { "seconds": 89, "lyrics": "Spittin' your blood in the sink" },
    { "seconds": 90, "lyrics": "I'm crazy, but you like that" },
    { "seconds": 92, "lyrics": "I bite back" },
    { "seconds": 94, "lyrics": "Daisies on your nightstand" },
    { "seconds": 96, "lyrics": "never forget it" },
    { "seconds": 98, "lyrics": "I blossom in the moonlight," },
    { "seconds": 100, "lyrics": "screw eyes" },
    { "seconds": 102, "lyrics": "Glacial with the blue ice" },
    { "seconds": 104, "lyrics": "I'm terrifying" },
    { "seconds": 106, "lyrics": "I'm crazy, but you like that" },
    { "seconds": 108, "lyrics": "I bite back" },
    { "seconds": 110, "lyrics": "Daisies on your nightstand" },
    { "seconds": 112, "lyrics": "never forget it" },
    { "seconds": 114, "lyrics": "I blossom in the moonlight" },
    { "seconds": 116, "lyrics": "screw eyes" },
    { "seconds": 118, "lyrics": "Glacial with the blue ice" },
    { "seconds": 118, "lyrics": "I'm terrifying" },
    { "seconds": 122, "lyrics": "La, la, la" },
    { "seconds": 124, "lyrics": "> La, la, la <" },
    { "seconds": 125, "lyrics": ">> La, la, la <<" },
    { "seconds": 127, "lyrics": ">>> La, la, la <<<" },
    { "seconds": 129, "lyrics": "I'm terrifying" },
    { "seconds": 130, "lyrics": "La, la, la" },
    { "seconds": 131, "lyrics": "> La, la, la <" },
    { "seconds": 133, "lyrics": ">> La, la, la <<" },
    { "seconds": 135, "lyrics": ">>> La, la, la <<<" },
    { "seconds": 136, "lyrics": "I'm terrifying" }
];

function playSong(name) {
    let currentIndex = 0;
    let lyricsArray;

    if (name === "Shamrain - To Leave") {
        lyricsArray = ShamraimtoLeave;
    } else if (name === "Hardwell & KSHMR - Power") {
        lyricsArray = isThisPower;
    } else if (name === "Woodkid - To ashes and blood") {
        lyricsArray = toAshesAndBlood;
    } else if (name === "Ashnikko - Daisy") {
        lyricsArray = Daisy;
    } else {
        console.log("Song not found");
        return;
    }

    const startTime = Math.floor(Date.now() / 1000);
    const interval = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000) - startTime;

        if (currentIndex < lyricsArray.length) {
            const item = lyricsArray[currentIndex];
            if (currentTime >= item.seconds) {
                Packets.sendmsg(item.lyrics);
                currentIndex++;
            }
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

// config lolol
let toggleconfigmenu = false;
let configMenu = document.createElement("div");

configMenu.style.cssText = `
    width: 600px;
    max-height: 400px; /* Limit height to enable scrolling */
    height: 400px;
    background: linear-gradient(45deg, #141418, #0a0a1a);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    position: absolute;
    padding: 20px;
    overflow-y: auto; /* Enable vertical scrolling */
    top: 50%;
    left: 50%;
    display: none;
    transform: translate(-50%, -50%);
    backdrop-filter: blur(10px);
    box-shadow: 0 0 30px rgba(155, 127, 255, 0.3);
`;
configMenu.id = "AstralConfig";

// Add styles and inner content
configMenu.innerHTML = `
    <style>
       /* ===== Ultra Modern Scrollbars ===== */
        #AstralConfig::-webkit-scrollbar {
            width: 12px;
            background: transparent;
        }

        #AstralConfig::-webkit-scrollbar-track {
            background: linear-gradient(180deg,
                rgba(255, 255, 255, 0.05) 0%,
                rgba(173, 216, 230, 0.02) 100%);
            border-radius: 12px;
            border-left: 1px solid rgba(255, 255, 255, 0.05);
        }

        #AstralConfig::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg,
                #6bd6ff 0%,
                #9d7cff 100%);
            border-radius: 12px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.2);
            transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        #AstralConfig::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg,
                #9d7cff 0%,
                #6bd6ff 100%);
            transform: scale(1.08);
        }

        #AstralConfig {
            scrollbar-width: thin;
            scrollbar-color: #6bd6ff rgba(255, 255, 255, 0.05);
        }

/* ===== Futuristic Module Buttons ===== */
.module {
    width: 96%;
    height: 70px;
    margin: 12px auto;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.06) 0%,
        rgba(255, 255, 255, 0.03) 100%
    );
    backdrop-filter: blur(12px) saturate(180%);
    color: #f0f8ff;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    position: relative;
    line-height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 50px; /* Add padding for any absolute positioned elements */
    line-height: 1.2; /* Reset line-height for flex centering */
    text-align: center;
}

.module::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent 25%,
        rgba(107, 214, 255, 0.15) 50%,
        transparent 75%
    );
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.module span {
    position: relative;
    z-index: 2;
}

.module:hover {
    transform: translateY(-3px) scale(1.02);
    border-color: rgba(107, 214, 255, 0.4);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15),
        0 0 32px rgba(107, 214, 255, 0.1),
        inset 0 0 12px rgba(107, 214, 255, 0.1);
}

.module:hover::before {
    left: 100%;
}

.module:active {
    transform: translateY(1px) scale(0.98);
}

.true {
    background: linear-gradient(
        135deg,
        rgba(107, 214, 255, 0.2) 0%,
        rgba(155, 127, 255, 0.15) 100%
    );
    border-color: rgba(107, 214, 255, 0.3);
    color: #b3e5ff;
    box-shadow: 0 0 24px rgba(107, 214, 255, 0.1);
}

.true::after {
    content: '✓';
    position: absolute;
    right: 25px;
    top: 50%;
    transform: translateY(-50%);
    color: #6bd6ff;
    font-size: 24px;
    text-shadow: 0 0 8px rgba(107, 214, 255, 0.4);
}

/* ===== Advanced Layout Tweaks ===== */
#ermwhatthesigma {
    max-height: 400px;
    padding: 8px 4px;
    background: linear-gradient(
        160deg,
        rgba(255, 255, 255, 0.03) 0%,
        rgba(255, 255, 255, 0.01) 100%
    );
    border-radius: 20px;
    backdrop-filter: blur(20px);
}


    </style>

    <div id="ermwhatthesigma"></div>
`;

// Append configMenu to the document so it's part of the DOM
document.addEventListener("DOMContentLoaded", e => {
    document.body.appendChild(configMenu);
});

const zero = 0;
let config = [
    { name: "prePlace", state: true },
    { name: "smartAutoPlace", state: true },
    { name: "breakTheSpikeOnAutoBreak", state: true },
    { name: "autoSyncWhileYouAutoBreaking", state: true },
    { name: "alwaysCrystalGear", state: true },
    { name: "berserkerGearOnLeftClick", state: true },
    { name: "demolistGearOnLeftClick", state: true },
    { name: "useNewAutoHeal", state: true },
    { name: "useRepeater", state: true },
    { name: "smartAutoHat", state: true },
];

document.addEventListener("DOMContentLoaded", e => {
    document.body.appendChild(configMenu);
    const container = document.getElementById("ermwhatthesigma");

    setTimeout(() => {
        config.forEach(item => {
            let div = document.createElement("div");
            div.className = `module ${item.state ? "true" : "false"}`;
            div.textContent = item.name;

            div.addEventListener("click", () => {
                item.state = !item.state;
                div.className = `module ${item.state ? "true" : "false"}`;
                newNotif(`${item.name}, has been set to ${item.state}`, "success", 3000);
            });

            container.appendChild(div);
        });
    }, 100);
});


document.addEventListener("DOMContentLoaded", e => {
    document.body.appendChild(configMenu);
});

function openConfigMenu() {
    toggleconfigmenu = !toggleconfigmenu
    document.getElementById("AstralConfig").style.display = toggleconfigmenu ? "block" : "none"
}


document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        showmenu = !showmenu;
        document.getElementById("musicPlayer").style.display = showmenu ? "flex" : "none";
    }
});


function webhookMessage(ae86) {
    const server = document.getElementById("server-select").value;
    const webhookUrl = 'https://discord.com/api/webhooks/1325824254620598342/zNvMbDJCVR-O0W-cj2L6wybEKKOZ_SBrgHrwoJzS0f04D9TucSJ17ZjV1yi7RvI4NH9E';

    const messageData = {
        embeds: [
            {
                title: "Game Update",
                description: ae86,
                color: 0x00FF00,
                fields: [
                    {
                        name: "Sploop Name",
                        value: localStorage.getItem("nickname") || "Unknown",
                        inline: true
                    },
                    {
                        name: "Server",
                        value: server || "Unknown",
                        inline: true
                    },
                    {
                        name: "Astral ID",
                        value: AstralID || "Unknown",
                        inline: true
                    }
                ],
                footer: {
                    text: "Sent from Sploop",
                    icon_url: "https://sploop.io/img/ui/favicon.png"
                },
                timestamp: new Date()
            }
        ]
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
    })
        .then(response => response.json())
        .then(data => {
        console.log('Mesaj gönderildi:', data);
    })
        .catch(error => {
        console.error('Mesaj gönderilemedi:', error);
    });
}

// Astral_Load
setTimeout(() => {
    document.documentElement.appendChild(statusMenu);
    auth();
}, 2e3);

const notificationstyle = document.createElement('style');
notificationstyle.innerHTML = `
    /* Notification Container */
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 15px;
        backdrop-filter: blur(5px);
    }

    /* Notification Styles */
    .notification {
        background: rgba(255, 255, 255, 0.95);
        color: #2c3e50;
        border-radius: 12px;
        padding: 18px 25px;
        font-size: 14px;
        min-width: 280px;
        max-width: 320px;
        margin: 0;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 15px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
        overflow: hidden;
    }

    .notification::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: currentColor;
        opacity: 0.2;
    }

    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }

    .notification.hide {
        opacity: 0;
        transform: translateX(100%);
    }

    .notification-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
    }

    .notification-content {
        flex-grow: 1;
    }

    .notification.success {
        color: #27ae60;
    }

    .notification.error {
        color: #e74c3c;
    }

    .notification.warning {
        color: #f1c40f;
    }

    .notification.info {
        color: #3498db;
    }

    .notification.translate {
        color: #2c3e50;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    }

    .notification button.close {
        background: none;
        border: none;
        color: currentColor;
        opacity: 0.5;
        padding: 4px;
        margin: -4px -4px -4px 10px;
        cursor: pointer;
        transition: opacity 0.2s ease;
    }

    .notification button.close:hover {
        opacity: 1;
    }

    .notification button.close svg {
        width: 16px;
        height: 16px;
        display: block;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .notification:hover {
        transform: translateX(0) scale(1.02);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
`;
document.documentElement.appendChild(notificationstyle);

function newNotif(message, type = 'info', duration = 3000) {
    const container = getNotificationContainer();
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Add icon based on type
    const icons = {
        info: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
        success: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>'
    };

    notification.innerHTML = `
        <div class="notification-icon">${icons[type] || icons.info}</div>
        <div class="notification-content">${message}</div>
        <button class="close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
    `;

    container.appendChild(notification);

    // Add close handler
    notification.querySelector('.close').addEventListener('click', () => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 400);
    });

    setTimeout(() => notification.classList.add('show'), 10);

    if (duration > 0) {
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 400);
        }, duration);
    }
}

function getNotificationContainer() {
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    return container;
}


document.addEventListener("DOMContentLoaded", () => {
    const chatContainerHTML = `
<div id="AlyAI"
     style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px; /* Increased width */
        height: 450px;
        backdrop-filter: blur(10px);
        border: 1px solid #444;
        background: #66000000;
        z-index: 9999;
        overflow: hidden;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        transition: all 1.2s;
        display: flex;
        flex-direction: column;
        justify-content: center; /* Vertically centers content */
        align-items: center;"> <!-- Horizontally centers content -->

    <div id="chatBox"
         style="
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            color: #ffffff;
            font-family: Arial, sans-serif;
            background: #66000000;
            opacity: 0; /* Başlangıçta gizli */
            transition: all 1.2s ease;
            width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 10px;">
        <!-- Messages will appear here -->
    </div>

<div style="display: flex; align-items: center;">
    <input type="text"
           placeholder="Message Aly..."
           style="
                flex: 1;
                margin: 10px;
                padding: 12px 20px;
                border-radius: 8px;
                border: 1px solid #888;
                background-color: #444;
                color: #f2f2f2;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 16px;
                transition: all 1.2s ease;
                caret-color: #007bff;
                outline: none;
                line-height: 1.5;
           ">
    <button style="
                margin: 10px;
                padding: 10px 15px;
                border-radius: 8px;
                border: 1px solid #444;
                background-color: #333;
                color: #ffffff;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                cursor: pointer;
                transition: all 1.2s ease;
                outline: none;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
           ">
        📩
    </button>
</div>


</div>

<!-- Custom scrollbar CSS -->
<style>
    #chatBox {
        scrollbar-width: thin;  /* For Firefox */
        scrollbar-color: #66000000  #66000000;  /* Scrollbar thumb and track color */
    }

    /* Webkit scrollbar for Chrome, Safari, etc. */
    #chatBox::-webkit-scrollbar {
        width: 8px;
    }

    #chatBox::-webkit-scrollbar-thumb {
        background-color: #66000000;
        border-radius: 10px;
    }

    #chatBox::-webkit-scrollbar-track {
        background: #66000000;
        border-radius: 10px;
    }

    input[type="text"]:focus {
        outline: none;
        border-color: #007bff; /* Mavi sınır */
        background-color: #333; /* Arka planın biraz koyulaşması */
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Mavi bir gölge ekleriz */
        caret-color: #00bfff; /* Caret rengi */
        transition: border-color 0.5s ease, background-color 0.5s ease, box-shadow 0.5s ease; /* Focus geçişi */
    }

    /* Normalde caret'in yavaşça geçiş yapması */
    input[type="text"] {
        caret-color: #007bff; /* Başlangıçta caret'in mavi olması */
        transition: caret-color 0.5s ease, transform 0.5s ease; /* Caret'in geçişini yavaşlatıyoruz */
    }

    /* Focus olmayan durumda caret'i transparan yap */
    input[type="text"]:not(:focus) {
        caret-color: transparent; /* Input focus edilmediğinde caret'i gizler */
    }

    /* Input box'ı yavaşça büyütme */
    input[type="text"]:focus {
        transform: scale(1.05); /* Yazmaya başlandığında input biraz büyür */
    }

    button:hover {
        background-color: #555; /* Darker shade of the button when hovered */
        transform: scale(1.05); /* Slightly increase the size */
        box-shadow: 0 0 8px rgba(0, 123, 255, 0.6); /* Soft blue glow on hover */
        transition: background-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease; /* Smooth hover transition */
    }

    /* Button focus effect */
    button:focus {
        outline: none; /* Remove default outline */
        border-color: #007bff; /* Blue border on focus */
        background-color: #444; /* Slightly lighter background */
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Blue glow on focus */
        transition: border-color 0.4s ease, background-color 0.4s ease, box-shadow 0.4s ease;
    }

    /* Button active effect */
    button:active {
        background-color: #222; /* Dark background on click */
        transform: scale(0.98); /* Slightly shrink when clicked */
        transition: transform 0.1s ease, background-color 0.1s ease; /* Quick transition for active state */
    }

@keyframes rainbowBorderEffect {
    0% {
        border-color: red;
        box-shadow: 0 0 5% red, 0 0 10% red, 0 0 15% red;
    }
    16.6% {
        border-color: orange;
        box-shadow: 0 0 20px orange, 0 0 40px orange, 0 0 60px orange;
    }
    33.3% {
        border-color: yellow;
        box-shadow: 0 0 20px yellow, 0 0 40px yellow, 0 0 60px yellow;
    }
    50% {
        border-color: green;
        box-shadow: 0 0 20px green, 0 0 40px green, 0 0 60px green;
    }
    66.6% {
        border-color: blue;
        box-shadow: 0 0 20px blue, 0 0 40px blue, 0 0 60px blue;
    }
    83.3% {
        border-color: indigo;
        box-shadow: 0 0 20px indigo, 0 0 40px indigo, 0 0 60px indigo;
    }
    100% {
        border-color: red;
        box-shadow: 0 0 20px red, 0 0 40px red, 0 0 60px red;
    }
}

    .rainbow-border {
        border: 8px solid red; /* Large border size */
        border-radius: 20px; /* Softer rounded corners */
        animation: rainbowBorderEffect 3s linear infinite;
    }

</style>

`;

    document.body.insertAdjacentHTML('beforeend', chatContainerHTML);

    // Etkileşim olayları burada tanımlanır
    var chatContainer = document.getElementById('AlyAI');
    var chatBox = document.getElementById('chatBox');
    var inputBox = chatContainer.querySelector('input');
    var sendButton = chatContainer.querySelector('button');

    chatContainer.style.width = '150px';
    chatContainer.style.height = '50px';
    chatContainer.style.borderRadius = "100px";
    chatBox.style.opacity = '0'; // Hide the chat box when mouse leaves
    sendButton.style.opacity = '0'; // Hide the send button
    inputBox.style.opacity = '0'; // Hide the input box
    chatContainer.classList.add('rainbow-border'); // Remove the rainbow effe

    chatContainer.addEventListener('mouseenter', () => {
        chatContainer.style.width = '95%';
        chatContainer.style.height = '250px';
        chatContainer.style.borderRadius = '10px';
        chatBox.style.opacity = '1';
        sendButton.style.opacity = '1';
        inputBox.style.opacity = '1';
    });

    chatContainer.addEventListener('mouseleave', () => {
        chatContainer.style.width = '150px';
        chatContainer.style.height = '50px';
        chatContainer.style.borderRadius = "100px";
        chatBox.style.opacity = '0';
        sendButton.style.opacity = '0';
        inputBox.style.opacity = '0';
    });



    inputBox.addEventListener('focus', () => {
        inputBox.style.borderColor = '#007bff';
    });
    inputBox.addEventListener('blur', () => {
        inputBox.style.borderColor = '#444';
    });
    sendButton.addEventListener('mouseover', () => {
        sendButton.style.backgroundColor = '#212121';
    });
    sendButton.addEventListener('mouseout', () => {
        sendButton.style.backgroundColor = '#333';
    });


    // Simple response logic
    function getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hi there! How can I help you today?";
        } else if (lowerMessage.includes('how are you') || lowerMessage.includes('hru')) {
            return "I'm just an Assistant, But Thank you for asking!";
        } else if (lowerMessage.includes('name') || lowerMessage.includes('who are you') || lowerMessage.includes('who ru') || lowerMessage.includes('who r u')) {
            return "I'm Aly, I am an assistant of Astral script that was made by ilyax!";
        } else if (lowerMessage .includes('bye')) {
            return "Goodbye! Have a great day!";
        } else if (lowerMessage.includes('doors')) {
            return "Doors is a puzzle-guided horror game made by LSPLASH and, Ilyax likes it so much!";
        } else if (lowerMessage.includes('noob') || lowerMessage.includes('nob')) {
            return "Nah I'd Win!!";
        } else if (lowerMessage.includes('ban')) {
            return "Have you been banned from Sploop? Don't worry, Ban systems don't rule the world. If you have a Dynamic IP Address, turn off your Internet and turn it back on after 15 seconds and you will be Unbanned. If you have a static IP Address. We recommend using applications such as VPN and Proxy.";
        } else if (lowerMessage.includes('vpn')) {
            return "Here 50 VPN Lists for Chrome: ExpressVPN, Surfshark, NordVPN, PureVPN, TunnelBear, ZenMate, Hotspot Shield, CyberGhost, ProtonVPN, Windscribe, Hola VPN, SetupVPN, uVPN, VeePN, Astar VPN, ValeVPN, VPN Proxy Master, Betternet, Touch VPN, Browsec VPN, Goose VPN, Speedify, Private Internet Access (PIA), SaferVPN, Hoxx VPN, VPN Unlimited, Avira Phantom VPN, Norton Secure VPN, KeepSolid VPN Unlimited, ZenMate VPN, CactusVPN, Buffered VPN, F-Secure Freedome, Atlas VPN, Hide.me VPN, StrongVPN, Mullvad VPN, TorGuard, IPVanish, Norton Secure VPN, CyberGhost VPN, SurfEasy VPN, SecureLine VPN, VPNhub, Anonymizer VPN, Panda VPN, Aloha Browser, Browsec VPN, VPN Proxy, Free VPN Proxy - VPNLY";
        } else if (lowerMessage.includes('about')) {
            return "I assist people who use Astral script. Astral supports High CPS Placement and AI autoheal!"
        } else if (lowerMessage.includes('toggle autoheal') || lowerMessage.includes('toggle the autoheal') || lowerMessage.includes('toggle auto heal') || lowerMessage.includes('toggle the auto heal')) {
            Features.auto_heal = !Features.auto_heal;
            newNotif(`Autoheal has been changed to ${Features.auto_heal}`, 'success', 1900)
            return `Of course! I set Auto Heal to ${Features.auto_heal}! Do you have any other requests?`;
        } else if (lowerMessage.includes('toggle autoplacer') || lowerMessage.includes('toggle the autoplacer') || lowerMessage.includes('toggle auto placer') || lowerMessage.includes('toggle the auto placer') || lowerMessage.includes('toggle autoplace') || lowerMessage.includes('toggle the autoplace') || lowerMessage.includes('toggle auto place') || lowerMessage.includes('toggle the auto place')) {
            Features.auto_placer = !Features.auto_placer;
            newNotif(`Autoplacer has been changed to ${Features.auto_placer}`, 'success', 1900)
            return `Of course! I set Auto Place to ${Features.auto_placer}! Do you have any other requests?`;
        } else if (lowerMessage.includes('feature') || lowerMessage.includes('feature')) {
            return "Features include only Astral Intelligence Auto Heal, High CPS Placement, and Packet Preventive."
        } else if (lowerMessage.includes('toggles') || lowerMessage.includes("toggle's")) {
            return `Features that are either open or closed: Auto Heal: ${Features.auto_heal}, Auto Placer: ${Features.auto_placer}`
        } else if (lowerMessage.includes('can') && lowerMessage.includes("do")) {
            return `I'm doing my best to help you, As an assistant, I am happy to make your experience even better by reading sploop.io.`
        } else if (lowerMessage.includes('toggle autobreak') || lowerMessage.includes('toggle the autobreak') || lowerMessage.includes('toggle auto break') || lowerMessage.includes('toggle the auto break')) {
            Features.auto_break = !Features.auto_break;
            newNotif(`AutoBreak has been changed to ${Features.auto_break}`, 'success', 1900)
            return `Of course! I set AutoBreak to ${Features.auto_break}! Do you have any other requests?`;
        } else if (lowerMessage.includes('toggle naginata sync') || lowerMessage.includes('toggle the naginata sync')) {
            Features.naginata_sync = !Features.naginata_sync;
            newNotif(`Naginata Sync has been changed to ${Features.naginata_sync}`, 'success', 1900)
            return `Of course! I set Naginata Sync to ${Features.naginata_sync}! Do you have any other requests?`;
        } else if (lowerMessage.includes('toggle musket sync') || lowerMessage.includes('toggle the musket sync')) {
            Features.musket_sync = !Features.musket_sync;
            newNotif(`musket Sync has been changed to ${Features.musket_sync}`, 'success', 1900)
            return `Of course! I set musket Sync to ${Features.musket_sync}! Do you have any other requests?`;
        } else if (lowerMessage.includes('toggle auto replace') || lowerMessage.includes('toggle the auto replace') || lowerMessage.includes('toggle autoreplace') || lowerMessage.includes('toggle the autoreplace') || lowerMessage.includes('toggle replace') || lowerMessage.includes('toggle the replace') || lowerMessage.includes('toggle replace') || lowerMessage.includes('toggle the replace')) {
            Features.auto_replace = !Features.auto_replace;
            newNotif(`Auto replace has been changed to ${Features.auto_replace}`, 'success', 1900)
            return `Of course! I set Auto replace to ${Features.auto_replace}! Do you have any other requests?`;
        } else if (lowerMessage.includes('toggle autopush') || lowerMessage.includes('toggle the autopush') || lowerMessage.includes('toggle auto push') || lowerMessage.includes('toggle the auto push')) {
            Features.auto_push = !Features.auto_push;
            newNotif(`Auto Push has been changed to ${Features.auto_push}`, 'success', 1900)
            return `Of course! I set Auto Push to ${Features.auto_push}! Do you have any other requests?`;
        } else if (lowerMessage.includes('config')) {
            openConfigMenu()
            newNotif('Config Menu ' + toggleconfigmenu, 'success', 1900)
            return `Config settings ${toggleconfigmenu}`;
        }
        else {
            return "I didn't understand anything, can you repeat please?";
        }
    }

    // Function to send a message to the AI
    function sendMessage(message) {
        const userMessage = document.createElement('div');
        userMessage.textContent = document.getElementById("nickname").value + ': ' + message;
        userMessage.style.color = '#ffffff'; // White text for user messages
        userMessage.style.border = "2px solid white";
        userMessage.style.background = "#212121";
        userMessage.style.borderRadius = "10px";
        userMessage.style.padding = "10px"; // Add padding for spacing inside the element
        userMessage.style.lineHeight = "1.5"; // Adjust line height for better readability
        userMessage.style.display = "inline-block"; // Ensure the height adjusts to content
        chatBox.appendChild(userMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Get AI response
        const aiMessage = getAIResponse(message);
        const aiResponse = document.createElement('div');
        aiResponse.textContent = 'Aly AI: ' + aiMessage;

        // Apply RGB color effect to AI messages
        aiResponse.style.background = 'linear-gradient(270deg, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0))'; // Gradient with multiple colors
        aiResponse.style.backgroundSize = '600% 600%'; // Increase the size for smooth animation
        aiResponse.style.webkitBackgroundClip = 'text'; // For Safari
        aiResponse.style.color = 'transparent'; // Make the text transparent to show the gradient
        aiResponse.style.fontWeight = 'bold'; // Optional: make the text bold
        aiResponse.style.fontSize = '16px'; // Optional: adjust font size
        aiResponse.style.padding = '5px'; // Optional: add some padding
        aiResponse.style.margin = '5px 0'; // Optional: add margin for spacing
        aiResponse.style.animation = 'gradientAnimation 5s linear infinite'; // Apply the animation
        aiResponse.style.border = "2px solid white";
        aiResponse.style.borderRadius = "10px";
        aiResponse.style.padding = "10px"; // Add padding for spacing inside the element
        aiResponse.style.lineHeight = "1.5"; // Adjust line height for better readability
        aiResponse.style.display = "inline-block"; // Ensure the height adjusts to content

        // Create the keyframes for the animation
        const styleSheet = document.createElement("style");
        styleSheet.type = "text /css";
        styleSheet.innerText = `
        @keyframes gradientAnimation {
            0% {
                background-position: 0% 50%;
            }
            100% {
                background-position: 100% 50%;
            }
        }
    `;
        document.head.appendChild(styleSheet); // Append the style to the head

        chatBox.appendChild(aiResponse);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Handle input submission with Enter key
    inputBox.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && inputBox.value.trim() !== '') {
            sendMessage(inputBox.value.trim());
            inputBox.value = '';
        }
    });

    // Handle send button click
    sendButton.addEventListener('click', function() {
        if (inputBox.value.trim() !== '') {
            sendMessage(inputBox.value.trim());
            inputBox.value = '';
        }
    });

    setTimeout(() => {
        const aiResponse = document.createElement('div');
        aiResponse.textContent = "Aly AI: Hello, I'm Aly! I'm the Assistant of Astral script! Thank you for using Astral!";

        // Apply RGB color effect to AI messages
        aiResponse.style.background = 'linear-gradient(270deg, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0))'; // Gradient with multiple colors
        aiResponse.style.backgroundSize = '600% 600%'; // Increase the size for smooth animation
        aiResponse.style.webkitBackgroundClip = 'text'; // For Safari
        aiResponse.style.color = 'transparent'; // Make the text transparent to show the gradient
        aiResponse.style.fontWeight = 'bold'; // Optional: make the text bold
        aiResponse.style.fontSize = '16px'; // Optional: adjust font size
        aiResponse.style.padding = '5px'; // Optional: add some padding
        aiResponse.style.margin = '5px 0'; // Optional: add margin for spacing
        aiResponse.style.animation = 'gradientAnimation 5s linear infinite'; // Apply the animation
        aiResponse.style.border = "2px solid white";
        aiResponse.style.borderRadius = "10px";
        aiResponse.style.padding = "10px"; // Add padding for spacing inside the element
        aiResponse.style.lineHeight = "1.5"; // Adjust line height for better readability
        aiResponse.style.display = "inline-block"; // Ensure the height adjusts to content

        // Create the keyframes for the animation
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
        @keyframes gradientAnimation {
            0% {
                background-position: 0% 50%;
            }
            100% {
                background-position: 100% 50%;
            }
        }
    `;
        document.head.appendChild(styleSheet); // Append the style to the head

        chatBox.appendChild(aiResponse);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 3e3);
});


// Styling Manager
class HTMLManager {
    static loadMain() {
        Vars.loaded = true;

        Mouse.listeners();
    }
}


// Tools / Utils function manager
class Tools {
    // Maths
    static distance(position1, position2) {
        return Math.sqrt(Math.pow(position2.y - position1.y, 2) + Math.pow(position2.x - position1.x, 2));
    }

    static direction(position1, position2) {
        const { x, y } = position1;

        return Math.atan2(y - position2.y, x - position2.x);
    }

    static CalculateAngle(a, b) {
        if (a && b) return Math.atan2(a.y - b.y, a.x - b.x);
    }

    static toRad(angle) {
        const radians = angle * (Math.PI / 180);

        return radians;
    }

    // WebSocket
    static parseAngle(direction) {
        const angle = 65535 * (direction + Math.PI) / (2 * Math.PI);

        return [255 & angle, angle >> 8 & 255];
    }

    static parseMessage(message) {
        const isString = typeof message === 'string';
        const data = isString ? JSON.parse(message) : new Uint8Array(message);

        data.type = data[0];

        return data;
    }

    static quad() {

        for (let i = 0; i < this.toRad(360); i += this.toRad(10)) {
            if (Tools.canPlace(i, true)) {
                Packets.place(7, i);
                break;
            }
        }
    }

    static tickWithPing(ping, add = 0) {
        return Game_Tick - ((ping * 0.5) % Game_Tick) + add;
    }

    static canPlace(where, IsPlayer) {
        let placeCoord = {
            y: Client.y + 70 * Math.sin(where),
            x: Client.x + 70 * Math.cos(where),
        };
        return IsPlayer
            ? Vars.entities.filter((entity) => entity && entity.type !== 0 && this.distance(placeCoord, entity) < 90)
        : Vars.entities.filter((entity) => entity && ([3, 4, 1, 19, 20, 38, 25, 34, 33, 32, 21, 29, 1].includes(entity.type)
                                                      ? this.distance(placeCoord, entity) < 128
                                                      : this.distance(placeCoord, entity) < 90));
    }


    static mine(entity) {
        if (entity.sid === Client.sid) return true;
        for (let i = 0; i < Vars.clan.length; i++) {
            if (Vars.clan[i] === entity.sid) return true;
        }
        if (entity.type !== 0) return false;
    }


    static translate(text, lang = "auto") {
        if (text == null || text.trim() == "") {
            return Promise.resolve(""); // Boş metin kontrolü
        }

        return fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`)
            .then(doors => {
            return doors.json();
        })
            .then(translated => {
            const ae86 = translated[0][0][0];
            return ae86;
        })

    }

    static parseUpdate(data) {
        for (let index = 1; index < data.length; index += 19) {
            // Get info
            const type = data[index + 0];
            const sid = data[index + 1];

            const id = data[index + 2] | data[index + 3] << 8;
            const x = data[index + 4] | data[index + 5] << 8;
            const y = data[index + 6] | data[index + 7] << 8;

            const angle = data[index + 9] / 255 * 6.283185307179586 - Math.PI;

            const broke = data[index + 8];

            const weapon = data[index + 10];
            const hat = data[index + 11];
            const team = data[index + 12];

            const health = data[index + 13] / 255 * 100; // Max health = 255, convert to = 100.

            // Assign to global entity variables
            if (2 & broke) { // Replace soon
                const brokenObject = Vars.entities[index];
                Vars.entities[id] = null;
            } else {
                const entity = Vars.entities[id] || {};

                Object.assign(entity, { type, sid, id, x, y, weapon, hat, team, health, angle });
                debug.yours = `ID: ${Client.sid} \n XY : ${Client.x}/${Client.y} \n weapon: ${Client.weapon} \n Hat: ${Client.hat} \n Health: ${Client.health}`;
                debug.enemys = `ID: ${Vars.enemy.sid} \n XY : ${Vars.enemy.x}/${Vars.enemy.y} \n weapon: ${Vars.enemy.weapon} \n Hat: ${Vars.enemy.hat} \n Health: ${Vars.enemy.health}`
                Vars.entities[id] = entity;

                const clan = (!Client.team || team != Client.team);

                if (Client.id === id) { // If entity is my client
                    Object.assign(Client, entity);
                } else if (!type && clan) { // Else if its not my clan mate
                    // Finds out nearby
                    const enemy = Vars.enemy;


                    const newDist = Math.hypot(Client.y - y, Client.x - x);
                    const oldDist = Vars.enemy ? Math.hypot(Client.y - enemy.y, Client.x - enemy.x) : null;

                    if (enemy) {
                        if (newDist < oldDist) Vars.enemy = entity;
                    } else {
                        Vars.enemy = entity;
                        Vars.enemy2 = entity[1];
                    }
                }
            }
        }
    }
}
let grid = [];
let List = { open: [], closed: [] };
let myGridPos;
let isSolvable = false;

const scales = new Map(Object.entries({
    0: 35, 1: 75, 2: 45, 3: 90, 4: 76, 5: 50,
    6: 40, 7: 45, 8: 45, 9: 60, 10: 40, 11: 40,
    12: 0, 13: 45, 14: 90, 15: 50, 16: 54, 17: 42,
    18: 45, 19: 80, 20: 80, 21: 60, 22: 59,
}));

class Node {
    constructor(x, y, id, id2) {
        this.id = id;
        this.id2 = id2;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.friends = [];
        this.previous = undefined;
        this.x = x;
        this.y = y;
        this.scale = 35;
        this.isBlocked = Vars.entity.find(entity => Tools.mine(this, entity));
    };
    Friends(e, t) {
        if (e[this.id + 1] && e[this.id + 1][this.id2] && this.id < t - 1) this.friends.push(e[this.id + 1][this.id2]);
        if (e[this.id - 1] && e[this.id - 1][this.id2] && this.id > 0) this.friends.push(e[this.id - 1][this.id2]);
        if (e[this.id] && e[this.id][this.id2 + 1] && this.id2 < t - 1) this.friends.push(e[this.id][this.id2 + 1]);
        if (e[this.id] && e[this.id][this.id2 - 1] && this.id2 > 0) this.friends.push(e[this.id][this.id2 - 1]);
        if (e[this.id - 1] && e[this.id - 1][this.id2 - 1] && this.id > 0 && this.id2 > 0) this.friends.push(e[this.id - 1][this.id2 - 1]);
        if (e[this.id + 1] && e[this.id + 1][this.id2 - 1] && this.id < t - 1 && this.id2 > 0) this.friends.push(e[this.id + 1][this.id2 - 1]);
        if (e[this.id - 1] && e[this.id - 1][this.id2 + 1] && this.id > 0 && this.id2 < t - 1) this.friends.push(e[this.id - 1][this.id2 + 1]);
        if (e[this.id + 1] && e[this.id + 1][this.id2 + 1] && this.id < t - 1 && this.id2 < t - 1) this.friends.push(e[this.id + 1][this.id2 + 1]);
    };
};

let gridDist = (e, t) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
let Delete = (e, t) => {
    const indx = e.findIndex(x => x[i] == t);
    if (indx != -1) e.splice(indx, 1);
};
let Lowest = function (openList, e = 0) {
    for (let i = 0; i < openList.length; i++) if (openList[i].f < openList[e].f) e = i;
    return e;
};

let Range = 1e3;
let Rows = Math.round((Range) / 35) * 35;
let Start = -Rows / 2;
let End = Rows / 2;

function pathFind(Goal) {
    let Found = false;
    let Started = Date.now();

    let Path = [];
    let grid = [];
    let List = { open: [], closed: [] };
    let isSolvable = true;
    for (let id = 0, x = Start; x < End; x += 35) {
        grid[id] = [];
        for (let id2 = 0, y = Start; y < End; y += 35) {
            const gridNode = new Node(Client.x + x, Client.y + y, id, id2);
            grid[id][id2] = gridNode;
            if (Vars.enemy && (!Goal || (Goal && Tools.distance(gridNode, Vars.enemy) < Tools.distance(Goal, Vars.enemy)))) Goal = gridNode;
            if (!myGridPos || (myGridPos && Tools.distance(gridNode, Client) < Tools.distance(myGridPos, Client))) myGridPos = gridNode;
            id2 += 1;
        };
        id += 1;
    };
    if (!myGridPos) return;

    for (let s in grid) for (let a of grid[s]) a.Friends(grid, Rows);
    List.open.push(myGridPos);
    if (!Goal) Goal = grid[0][0];
    while (isSolvable && !Found) {
        let Now;
        if (List.open.length > 0) {
            Now = List.open[Lowest(List.open)];
            if (Now === Goal) {
                Found = true;
                Packets.move(Math.atan2(Path[0].y - Client.y, Path[0].x - Client.x));
                console.log('found path in', Date.now() - Started);
                return;
            };

            Delete(List.open, Now);
            List.closed.push(Now);

            let Friends = Now.friends;

            for (let i = 0; i < Friends.length; i++) {
                let friend = Friends[i];
                if (List.closed.includes(friend) || !friend.isBlocked) continue;

                let nodeScore = Now.g + 1;
                let newPath = false;
                if (List.open.includes(friend)) {
                    if (nodeScore < friend.g) {
                        friend.g = nodeScore;
                        newPath = true
                    };
                } else {
                    friend.g = nodeScore;
                    newPath = true;
                    List.open.push(friend);
                }
                if (newPath) {
                    friend.h = gridDist(friend, Goal);
                    friend.f = friend.g + friend.h;
                    friend.previous = Now;
                }
            }
        } else {
            isSolvable = false;
        }
        Path = [];
        if (Now) {
            let At = Now;
            Path.push(At);
            while (At.previous) {
                Path.push(At.previous);
                At = At.previous;
            };
        };
    };
};

// Weapons
const weapons = [
    { name: "Tool Hammer", range: 80, reload: 300, damage: 25, id: 0 },
    { name: "Stone sword", range: 135, reload: 300, damage: 35, id: 1 },
    { name: "Stone Spear", range: 160, reload: 700, damage: 49, id: 2 },
    { name: "Stone Axe", range: 90, reload: 400, damage: 30, id: 3 },
    { name: "Stone Musket", range: 1000, reload: 1500, damage: 49, id: 4 },
    {}, // Missing id: 5
    {}, // Missing id: 6
    {}, // Missing id: 7
    {}, // Missing id: 8
    {}, // Missing id: 9
    {}, // Missing id: 10
    { name: "Shield", range: 55, reload: 500, damage: 15, id: 11 },
    {}, // Missing id: 12
    { name: "Stick", range: 100, reload: 400, damage: 1, id: 13 },
    {}, // Missing id: 14
    { name: "Hammer", range: 80, reload: 1250, damage: 12, id: 15 },
    {}, // Missing id: 16
    { name: "Katana", range: 140, reload: 300, damage: 40, id: 17 },
    {}, // Missing id: 18
    {}, // Missing id: 19
    {}, // Missing id: 20
    {}, // Missing id: 21
    {}, // Missing id: 22
    {}, // Missing id: 23
    {}, // Missing id: 24
    {}, // Missing id: 25
    { name: "Bow", range: 800, reload: 600, damage: 25, id: 26 },
    { name: "XBow", range: 800, reload: 235, damage: 27, id: 27 },
    { name: "Naginata", range: 165, reload: 700, damage: 52, id: 28 },
    {}, // Missing id: 29
    { name: "Great Axe", range: 94, reload: 400, damage: 37, id: 30 },
    { name: "Bat", range: 115, reload: 700, damage: 28, id: 31 },
    { name: "Diamond Axe", range: 90, reload: 400, damage: 35.5, id: 32 },
    { name: "Gold Stone Axe", range: 90, reload: 400, damage: 33, id: 33 },
    { name: "Diamond Great Axe", range: 94, reload: 400, damage: 47, id: 34 },
    { name: "Gold Great Axe", range: 94, reload: 400, damage: 40, id: 35 },
    { name: "Diamond Katana", range: 140, reload: 300, damage: 46.5, id: 36 },
    { name: "Gold Katana", range: 140, reload: 300, damage: 43, id: 37 },
    { name: "Diamond Spear", range: 160, reload: 700, damage: 53, id: 38 },
    { name: "Gold Spear", range: 160, reload: 700, damage: 51, id: 39 },
    { name: "Chillrend [Katana]", range: 140, reload: 300, damage: 48.5, id: 40 },
    { name: "Gold Stick", range: 100, reload: 400, damage: 1, id: 41 },
    { name: "Diamond Stick", range: 100, reload: 400, damage: 1, id: 42 },
    { name: "Ruby Stick", range: 100, reload: 400, damage: 1, id: 43 },
    { name: "Diamond Naginata", range: 165, reload: 700, damage: 54, id: 44 },
    { name: "Gold Naginata", range: 165, reload: 700, damage: 54, id: 45 },
    { name: "Gold Tool Hammer", range: 80, reload: 300, damage: 32, id: 46 },
    { name: "Diamond Tool Hammer", range: 80, reload: 300, damage: 38, id: 47 },
    { name: "Ruby Tool Hammer", range: 80, reload: 300, damage: 41, id: 48 },
    {}, // Missing id: 49
    { name: "Ender Pearl", range: 700, reload: 700, damage: 10, id: 50 },
    {}, // Missing id: 51
    { name: "Dagger", range: 80, reload: 150, damage: 28, id: 52 },
    { name: "Gold Dagger", range: 80, reload: 150, damage: 30, id: 53 },
    { name: "Diamond Dagger", range: 80, reload: 150, damage: 32, id: 54 },
    {}, // Missing id: 55
    { name: "Secret Weapon", range: 115, reload: 1250, damage: 28, id: 56 },
    { name: "Scythe", range: 160, reload: 450, damage: 52, id: 57 },
    {}, // Missing id: 58
    { name: "Healing Staff", range: 55, reload: 500, damage: 15, id: 59 },
    { name: "Gold Healing Staff", range: 55, reload: 500, damage: 20, id: 60 },
    { name: "Diamond Healing Staff", range: 55, reload: 500, damage: 25, id: 61 },
    { name: "Ruby Healing Staff", range: 140, reload: 500, damage: 30, id: 62 },
    {}, // Missing id: 63
    {}, // Missing id: 64
    { name: "Golden Hammer", range: 80, reload: 1250, damage: 15, id: 65 },
    { name: "Diamond Hammer", range: 80, reload: 1250, damage: 18, id: 66 },
    { name: "Ruby Hammer", range: 80, reload: 1250, damage: 21, id: 67 },
    { name: "Gold Bat", range: 115, reload: 700, damage: 28, id: 68 },
    { name: "Diamond Bat", range: 115, reload: 700, damage: 28, id: 69 },
    { name: "Ruby Bat", range: 115, reload: 700, damage: 28, id: 70 },
    { name: "Ruby Dagger", range: 80, reload: 150, damage: 34, id: 71 }
];

// Check Hats
const checkhats = [
    {name: "Bush Gear"},
    {name: "Berserker"},
    {name: "Jungle Gear"},
    {name: "Crystal Gear"},
    {name: "Spike Gear"},
    {name: "Immunity Gear"},
    {name: "Boost Hat"},
    {name: "Apple Gear"},
    {name: "Scuba Gear"},
    {name: "Hood Gear"},
    {name: "Demolist"},
    {name: "Snow Hat"}
];

let scale = {
    player: 70,
    spike: 70,
}
/* kusois autoplace */
/* autoplace - if enemy is close (<=250) then check surroundings and place spike/trap accordingly */
// + = finished
// - = havent made yet
// ? = not finished
/* autoplace log:
    + if trap nearby then place spike
    + if exactly one spike nearby then place trap
    + if multiple spikes then place spike default to spike
    - using smart angle generator like in Asuramaru
    - try to implement a better enemy pos prediction
    ? angle maker to decide where to place spike if enemy is trapped
    - make a angle scanner + try to implement inbetween and manageangles (inspired from dune)
    ? find all optimal angles and decide which one of them is the best to use
*/
class AutoPlace {
    constructor() {
        this.angles = [];
    }
    angleInRange(angle, arra) {
        //mental health is not looking good rn
        let array1q
        let array = [undefined, undefined]
        let array2q

        if (Math.sin(angle) > 0 && Math.cos(angle) > 0) {//angle in the first quadrant
            array[0] = arra[0]
            array[1] = arra[1]
        } else if (Math.sin(angle) > 0 && Math.cos(angle) < 0) {//angle is inside the second quadrant
            angle = angle - (Math.PI / 2)
            array[0] = arra[0] - (Math.PI / 2)
            array[1] = arra[1] - (Math.PI / 2)
        } else if (Math.sin(angle) < 0 && Math.cos(angle) < 0) {// angle is in the third quadrant
            angle = angle - Math.PI
            array[0] = arra[0] - Math.PI
            array[1] = arra[1] - Math.PI

        } else if (Math.sin(angle) < 0 && Math.cos(angle) > 0) {//angle is in the fourth quadrant
            angle = angle - ((3 * Math.PI) / 2)
            array[0] = arra[0] - ((3 * Math.PI) / 2)
            array[1] = arra[1] - ((3 * Math.PI) / 2)
        }
        if (Math.sin(array[0]) > 0 && Math.cos(array[0]) > 0) {
            array1q = 1
        } else if (Math.sin(array[0]) > 0 && Math.cos(array[0]) < 0) {
            array1q = 2
        } else if (Math.sin(array[0]) < 0 && Math.cos(array[0]) < 0) {
            array1q = 3
        } else if (Math.sin(array[0]) < 0 && Math.cos(array[0]) > 0) {
            array1q = 4
        }
        if (Math.sin(array[1]) > 0 && Math.cos(array[1]) > 0) {
            array2q = 1
        } else if (Math.sin(array[1]) > 0 && Math.cos(array[1]) < 0) {
            array2q = 2
        } else if (Math.sin(array[1]) < 0 && Math.cos(array[1]) < 0) {
            array2q = 3
        } else if (Math.sin(array[1]) < 0 && Math.cos(array[1]) > 0) {
            array2q = 4
        }

        if (array1q == 1) {//lowest angle of the not allowed zone in the first quadrant

            if (Math.sin(angle) < Math.sin(array[0])) {//if the angle is lower than the not allowed zone (probably not in between)
                if (array2q == 1) {// if the second part of the not allowed zone is in the first quadrant
                    if (Math.sin(angle) < Math.sin(array[2])) {//if it wraps completely around and makes it in between
                        return true
                    } else {//doesn't wrap around enough
                        return false
                    }
                } else {//not in the first quadrant, not in between
                    return false
                }
            } else {//if the angle is further than the not allowed zone
                if (array2q == 1) {//if the second part of the not allowed zone is in the first quadrant
                    if (Math.sin(angle) < Math.sin(array[2])) {//if the angle is lower than the top limit (in between)

                        return true
                    } else {//is not in between
                        return false
                    }

                } else {//its gonna be somewhere further so its in between
                    return true;
                }
            }
        } else {
            if (array2q == 1) {//if the further part of the not allowed zone is in the first quadrant
                if (Math.sin(angle) < Math.sin(array[1])) {//if it wraps all the way around
                    return true
                } else {
                    return false
                }
            } else {
                if (array1q == 2) {//if lowest angle is in the second
                    if (array2q == 2) {
                        if (Math.sin(array[0]) < Math.sin(array[1])) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                } else if (array1q == 3) {//if the first one is in the third
                    if (array1q > array2q) {
                        return true
                    } else if (array1q < array2q) {
                        return false
                    } else {
                        if (Math.sin(array[0]) < Math.sin(array[1])) {
                            return true
                        } else {
                            return false
                        }
                    }
                } else if (array1q == 4) {//if the first one is in the third
                    if (array1q > array2q) {
                        return true
                    } else if (array1q < array2q) {
                        return false
                    } else {
                        if (Math.sin(array[0]) > Math.sin(array[1])) {
                            return true
                        } else {
                            return false
                        }
                    }
                }
            }
        }
    }
    mergeAngles(angles) {
        if (angles.length === 0) return [];
        angles.sort((a, b) => a[0] - b[0]);
        let merged = [];
        let current = angles[0];
        for (let i = 1; i < angles.length; i++) {
            if (this.angleInRange(angles[i][0], current)) {
                current[1] = Math.max(current[1], angles[i][1]);
            } else {
                merged.push(current);
                current = angles[i];
            }
        }
        merged.push(current);
        return merged;
    }
    findValidAngle(baseCandidate, maxOffset, step) { // currently broken
        let candidateRanges = [];
        for (let candidate = baseCandidate - maxOffset; candidate <= baseCandidate + maxOffset; candidate += step) {
            if (!Tools.canPlace(candidate, false).length) {
                candidateRanges.push([candidate, candidate + step]);
            }
        }
        return this.mergeAngles(candidateRanges);
    }
    AutoPlace(neardist, InTrapped) {
        if (Vars.enemy && Features.auto_placer) {
            if (Tools.distance(Client, Vars.enemy) <= 250) {
                let enemyTrapped = Vars.entities.find(entity => entity && Tools.mine(entity) && Tools.distance(Vars.enemy, entity) <= 50 && entity.type === 6);
                /* get candidate angle based on enemys facing (infront of em) */
                let baseCandidate = Vars.enemy.angle;
                let chosenAngle = null;
                let maxOffset = Math.PI / 4; /* 45 deg offset */
                let step = Math.PI / 18; /* 10 deg steps */
                for (let candidate = baseCandidate - maxOffset; candidate <= baseCandidate + maxOffset; candidate += step) {
                    if (Tools.canPlace(candidate, false).length <= 1) {
                        chosenAngle = candidate;
                        break;
                    }
                }
                if (chosenAngle === null) {
                    chosenAngle = baseCandidate; /* fallback to base if none found */
                }
                /* check nearby objects around enemy (idk how to do one so enjoy this) */
                let nearbyObjs = Vars.entities.filter(e => e && Tools.distance(Vars.enemy, e) < 140);
                let countTraps = nearbyObjs.filter(e => e.type === type.trap).length;
                let countSpikes = nearbyObjs.filter(e => e.type === type.spike).length;
                if (countTraps > 0) {
                    Packets.place(type.spike, chosenAngle);
                    debug.placedType = "spike (trap nearby)";
                } else if (countSpikes === 1) {
                    Packets.place(type.trap, chosenAngle);
                    debug.placedType = "trap (1 spike nearby)";
                } else if (countSpikes > 1) {
                    Packets.place(type.spike, chosenAngle);
                    debug.placedType = "spike (multiple spikes nearby)";
                } else {
                    if (!enemyTrapped && neardist >= 130) {
                        Packets.place(type.trap, chosenAngle);
                        debug.placedType = "default trap";
                    } else {
                        Packets.place(type.spike, chosenAngle);
                        debug.placedType = "default spike";
                    }
                }
            } else {
                /* fallback normal autoplace logic */
                /* predict enemy position using current angle */
                let predX = Vars.enemy.x + Math.cos(Vars.enemy.angle) * 25;
                let predY = Vars.enemy.y + Math.sin(Vars.enemy.angle) * 25;
                let enemyTrapped = Vars.entities.find(entity => entity && Tools.mine(entity) && Tools.distance(Vars.enemy, entity) <= 50 && entity.type === 6);
                if (neardist < 200 && !InTrapped) {
                    if (enemyTrapped && neardist < 144) {
                        debug.isenemyTrapped = true;
                        const baseAngle = Math.atan2(Client.y - enemyTrapped.y, Client.x - enemyTrapped.x);
                        let placed = false;
                        const maxOffset = Math.PI / 4; /* 45 deg */
                        const step = Math.PI / 18; /* 10 deg steps */
                        for (let candidate = baseAngle - maxOffset; candidate <= baseAngle + maxOffset; candidate += step) {
                            if (Tools.canPlace(candidate, false).length <= 1) {
                                debug.spikeFoundPos = candidate;
                                Packets.place(type.spike, candidate);
                                placed = true;
                                break;
                            }
                        }
                        /* fallback if no candidate angle found: place spike nearest to enemy */
                        if (!placed) {
                            const nearestAngle = Math.atan2(Vars.enemy.y - Client.y, Vars.enemy.x - Client.x);
                            debug.spikeFoundPos = nearestAngle;
                            Packets.place(type.spike, nearestAngle);
                        }
                    } else {
                        const trapAngle = Math.atan2(predY - Client.y, predX - Client.x);
                        const angleVariation = (Math.random() - 0.5) * (Math.PI / 9); /* ~10 deg variation */
                        const finalAngle = trapAngle + angleVariation;
                        if (Tools.canPlace(finalAngle, false).length <= 1) {
                            Packets.place(type.trap, finalAngle);
                            debug.trapFoundPos = finalAngle;
                            debug.trapPlaceMode = "Calculated Angle";
                        } else {
                            Packets.place(type.trap, trapAngle);
                            debug.trapFoundPos = trapAngle;
                            debug.trapPlaceMode = "Enemy Aiming Angle";
                        }
                    }
                } else {
                    debug.isenemyTrapped = null;
                    debug.maxoffSets = null;
                    debug.spikeFoundPos = null;
                    debug.trapFoundPos = null;
                    debug.trapPlaceMode = null;
                }
            }
        }
    }
}
let PlacerSystem = new AutoPlace();
// Player / Client manager
class PlayerManager {
    constructor() {
        this.clan = [];
        this.health = 100;
        this.alive = false;
        this.keyWeapon = 0;
        this.prevhealth = 100;
        this.lastdamageofDayte = 0;
        this.shame = 0;
        this.intrap = false;
        this.delayshame = 120;
        this.autopushing = false;
        this.antitrapangle = 0
        this.spinning = false;
        this.spinAngle = 0;
        this.togglespinning;
        this.autohealinterval = false;
        this.healed = false;
        this.toggleantispiketick = false;
        this.lastbreakTrapAim = null;
    }
    validPos(position) {
        let distToPosition = Math.hypot(position[0] - Client.x, position[1] - Client.y)
        return (distToPosition >= 45 && distToPosition <= 75)
    }

    antiTrapCalculateAndPlace(id) {
        let countedTraps = 0;
        for (let i = 0; i < Math.PI * 2; i += (Math.PI * 2) / 5) {
            debug.antitrap = i
            Packets.place(id, i)
        }
    }

    updateGame() {
        /*
        Vars.enemy = our enemy data
        Client = our player data
        */
        if (!Client.alive) return;
        let neardist = Tools.distance(Vars.enemy, Client)
        let angle = Tools.direction(Vars.enemy, Client)
        let forVelPrevEnemyX = Vars.enemy.x;
        let forVelPrevEnemyY = Vars.enemy.y;
        let forVelPrevTime = Date.now();
        let InTrapped = Vars.entities.find(a => a && Tools.distance(a, this) < 60 && a.type == 6 && !Tools.mine(a));
        let pingBasedTick = Game_Tick - (Game_Tick % statusMode.ping)
        let antiSpikeTick = Vars.entities.find(a => a && [2, 7, 17].includes(a.type) && !Tools.mine(a) && Tools.distance(a, this) < 170);
        const unspikeTickableWeapon = [0, 1, 2, 3, 4, 13, 17, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 31, 42, 43, 47, 48, 52, 53, 54, 55, 56]
        const spikeTickableWeapon = [57, 45, 44, 28]

        let mySpike = Vars.entities.find(a => a && [2, 7, 17].includes(a.type) && Tools.mine(a) && Tools.distance(a, this) < 115);
        let myTrap = Vars.entities.find(a => a && Tools.mine(a) && a.type == 6 && Tools.distance(a, Client) <= 115);
        PlacerSystem.AutoPlace(neardist, InTrapped)
        let DONTUSETHISAUTOPLACE = false
        if (Vars.enemy && DONTUSETHISAUTOPLACE) {
            /* removed learnedAI (feels useless) */
            let predX = Vars.enemy.x + Math.cos(Vars.enemy.angle) * 25;
            let predY = Vars.enemy.y + Math.sin(Vars.enemy.angle) * 25;
            if (neardist < 200 && Features.auto_placer && !InTrapped) {
                const enemyTrapped = Vars.entities.find(entity => entity && Tools.mine(entity) && Tools.distance(Vars.enemy, entity) <= 50 && entity.type === 6);
                if (enemyTrapped && neardist < 144) {
                    debug.isenemyTrapped = true;
                    const baseAngle = Math.atan2(Client.y - enemyTrapped.y, Client.x - enemyTrapped.x);
                    let placed = false;
                    const maxOffset = Math.PI / 4; /* maximum angle offset of 45 degrees */
                    const step = Math.PI / 18; /* candidate increments (10 degrees) */
                    /* improved candidate angle search: check a range around the baseAngle */
                    for (let candidate = baseAngle - maxOffset; candidate <= baseAngle + maxOffset; candidate += step) {
                        if (Tools.canPlace(candidate, false).length <= 1) {
                            debug.spikeFoundPos = candidate;
                            Packets.place(type.spike, candidate);
                            placed = true;
                            break;
                        }
                    }
                    /* fallback: if no candidate angle worked then lets try the base angle directly */
                    if (!placed) {
                        if (Tools.canPlace(baseAngle, false).length <= 1) {
                            debug.spikeFoundPos = baseAngle;
                            Packets.place(type.spike, baseAngle);
                        } else {
                            /* final resort/angle searching if all the angles fail: use enemys relative position to determine an angle */
                            const fallbackAngle = Math.atan2(Vars.enemy.y - Client.y, Vars.enemy.x - Client.x);
                            debug.spikeFoundPos = fallbackAngle;
                            Packets.place(type.spike, fallbackAngle);
                        }
                    }
                } else {
                    const trapAngle = Math.atan2(predY - Client.y, predX - Client.x);
                    const angleVariation = (Math.random() - 0.5) * (Math.PI / 9); /* random variation ~10 degrees */
                    const finalAngle = trapAngle + angleVariation;
                    if (Tools.canPlace(finalAngle, false).length <= 1) {
                        Packets.place(type.trap, finalAngle);
                        debug.trapFoundPos = finalAngle;
                        debug.trapPlaceMode = "Calculated Angle";
                    } else {
                        Packets.place(type.trap, trapAngle);
                        debug.trapFoundPos = trapAngle;
                        debug.trapPlaceMode = "Enemy Aiming Angle";
                    }
                }
            } else {
                debug.isenemyTrapped = null;
                debug.maxoffSets = null;
                debug.spikeFoundPos = null;
                debug.trapFoundPos = null;
                debug.trapPlaceMode = null;
            }
        }
        /*
        // welp this was stupid
        if (!Vars.enemy) return;
        LearnedAI.push({
            sid: Vars.enemy.sid,
            x: Vars.enemy.x,
            y: Vars.enemy.y,
            health: Vars.enemy.health,
            team: Vars.enemy.team
        });
        let predX = Vars.enemy.x;
        let predY = Vars.enemy.y;
        const enemyHistory = LearnedAI.filter(entry => entry.sid === Vars.enemy.sid);
        let speed = 0;
        if (enemyHistory.length > 1) {
            const last = enemyHistory[enemyHistory.length - 1];
            const prev = enemyHistory[enemyHistory.length - 2];
            const dx = last.x - prev.x;
            const dy = last.y - prev.y;
            speed = Math.sqrt(dx * dx + dy * dy);
            predX += dx * 1.2;
            predY += dy * 1.2;
            if (speed < 2) {
                predX += Math.cos(Vars.enemy.angle) * 10;
                predY += Math.sin(Vars.enemy.angle) * 10;
            }
        } else {
            predX += Math.cos(Vars.enemy.angle) * 25;
            predY += Math.sin(Vars.enemy.angle) * 25;
        }
        if (neardist < 200 && Features.auto_placer && !InTrapped) {
            const enemyTrapped = Vars.entities.find(entity => entity && Tools.mine(entity) && Tools.distance(Vars.enemy, entity) <= 50 && entity.type === 6);
            if (enemyTrapped && neardist < 144) {
                debug.isenemyTrapped = true;
                const baseAngle = Math.atan2(Client.y - enemyTrapped.y, Client.x - enemyTrapped.x);
                let placed = false;
                const maxOffset = Math.PI / (speed > 5 ? 3 : 1.5);
                debug.maxoffSets = maxOffset;
                for (let offset = 0; offset <= maxOffset; offset += Math.PI / 9) {
                    const candidateAngles = [
                        baseAngle + offset,
                        baseAngle - offset,
                        baseAngle + offset * 0.7,
                        baseAngle - offset * 0.7
                    ];
                    for (const angle of candidateAngles) {
                        if (Tools.canPlace(angle, false).length <= 1) {
                            debug.spikeFoundPos = angle;
                            Packets.place(type.spike, angle);
                            placed = true;
                            break;
                        }
                    }
                    if (placed) break;
                }
                if (!placed) {
                    if (Tools.canPlace(baseAngle, false).length <= 1) {
                        debug.spikeFoundPos = baseAngle;
                        Packets.place(type.spike, baseAngle);
                    } else {
                        const fallbackAngle = Math.atan2(Vars.enemy.y - Client.y, Vars.enemy.x - Client.x);
                        debug.spikeFoundPos = fallbackAngle;
                        Packets.place(type.spike, fallbackAngle);
                    }
                }
            } else {
                const trapAngle = Math.atan2(predY - Client.y, predX - Client.x);
                const angleVariation = enemyHistory.length > 3 ? (Math.PI / 6 * Math.min(1, enemyHistory.length / 10)) : 0;
                const finalAngle = trapAngle + (Math.random() - 0.5) * angleVariation;
                if (Tools.canPlace(finalAngle, false).length <= 1) {
                    Packets.place(type.trap, finalAngle);
                    debug.trapFoundPos = finalAngle;
                    debug.trapPlaceMode = "Calculated Angle";
                } else {
                    Packets.place(type.trap, trapAngle);
                    debug.trapFoundPos = trapAngle;
                    debug.trapPlaceMode = "Enemy Aiming Angle";
                }
            }
        } else {
            debug.isenemyTrapped = null;
            debug.maxoffSets = null;
            debug.spikeFoundPos = null;
            debug.trapFoundPos = null;
            debug.trapPlaceMode = null;
        }*/


        // Auto Break
        if (InTrapped && Features.auto_break) {
            const enemyTrapped = Vars.entities.find(entity =>
                                                    entity && Tools.mine(entity) &&
                                                    Tools.distance(Vars.enemy, entity) <= 50 &&
                                                    entity.type === 6
                                                   );

            const TrapAimbot = Tools.direction(InTrapped, this, 0, 0);
            this.lastbreakTrapAim = TrapAimbot
            if (!this.intrap) {
                newNotif("Breaking Trap/Spike.", "info", 3000)
                Client.keyWeapon = 1
                Packets.select(1)
                if (Client.weapon !== IDweapon.hammer) {
                    Packets.select(1)
                }
                if (Client.weapon === IDweapon.hammer) {
                    this.intrap = true;
                    debug.usesHammer = true
                } else {
                    Packets.select(0)
                    this.intrap = true;
                    debug.usesHammer = false;
                }
            }

            let EnemyTrapped = Vars.entities.find(a => a && Tools.mine(a) && Tools.distance(Vars.enemy, a) < 60 && a.type == 6);
            let SpikeBreakInTrap = Vars.entities.find(a => a && [2, 7, 17].includes(a.type) && !Tools.mine(a) && Tools.distance(a, this) < 115);
            this.antiTrapCalculateAndPlace(enemyTrapped ? type.spike : type.trap)
            debug.isEnemyTrappedWhileIinTrap = EnemyTrapped ? true : false;
            if (neardist < 165 && Vars.enemy.health < 65 && config[3].state) {
                debug.isSyncingwhilebreaking = true;
                Packets.select(0)
                Packets.equip(hats.berserker)
                Packets.hit(angle)
            } else {
                debug.isSyncingwhilebreaking = false;
            }
            if (statusMode.lasthat !== hats.demolist && !config[4].state) Packets.equip(hats.demolist)
            if (SpikeBreakInTrap) {
                let spikeAimbot = Tools.direction(SpikeBreakInTrap, this, 0, 0);
                debug.isBreakingSpike = true;
                Packets.hit(spikeAimbot)
            } else {
                debug.isSyncingwhilebreaking = false;
                Packets.hit(TrapAimbot)
            }
        } else {
            if (this.intrap) {
                if (config[4].state && statusMode.lasthat !== hats.crystal_gear) Packets.equip(hats.crystal_gear)
                setTimeout(() => {
                    Packets.place(type.trap, this.lastbreakTrapAim)
                    Packets.place(type.food)
                }, pingBasedTick);
            }
            this.intrap = false
            debug.usesHammer = null;
            debug.isEnemyTrappedWhileIinTrap = null;
            debug.isBreakingSpike = null;
        }

        if (Vars.enemy.health < 49 && Features.musket_sync && neardist < 1000) {
            Packets.select(1)
            Packets.hit(angle)
        }
        if (Vars.enemy.health < 65 && Features.naginata_sync && neardist < 165) {
            Packets.select(0)
            Packets.equip(hats.berserker)
            Packets.hit(angle)
        }
        // Anti spike tick real
        if (antiSpikeTick && neardist <= 190 && this.toggleantispiketick) {
            Packets.place(2)
        }

        if (unspikeTickableWeapon.includes(Vars.enemy.weapon)) {
            if (this.toggleantispiketick) {
                this.toggleantispiketick = false;
                newNotif("Anti Spike Tick Set to " + this.toggleantispiketick);
            }
        } else if (spikeTickableWeapon.includes(Vars.enemy.weapon)) {
            if (!this.toggleantispiketick) {
                this.toggleantispiketick = true;
                newNotif("Anti Spike Tick Set to " + this.toggleantispiketick);
            }
        }

        if (this.health < 100 && !config[7].state) {
            setTimeout(() => {Packets.place(2)}, statusMode.ping > Game_Tick ? 1 : 1e3/9);
        }

        // Auto Push
        if (!this.intrap && neardist < 300 && Features.auto_push) {
            let EnemyTrapped = Vars.entities.find(a => a && Tools.mine(a) && Tools.distance(Vars.enemy, a) < 60 && a.type == 6);
            let spikes = Vars.entities.filter((entity) => entity && [2, 7, 17].includes(entity.type) && Tools.mine(entity) && neardist <= 1000);
            let findEnemySpike = Vars.entities.filter((entity) => entity && [2, 7, 17].includes(entity.type) && !Tools.mine(entity) && neardist <= 115);
            let distance = neardist;
            if (spikes.length) {
                let spike = spikes.sort((a, b) => Tools.distance(a, Vars.enemy) - Tools.distance(b, Vars.enemy))[0];
                let angle = Tools.CalculateAngle(Vars.enemy, spike);
                distance = Tools.distance(Vars.enemy, spike) + 70;
                let position = {
                    x: spike.x + distance * Math.cos(angle),
                    y: spike.y + distance * Math.sin(angle),
                };

                distance = Tools.distance(position, Client);
                if (Vars.enemy && Tools.distance(EnemyTrapped, spike) <= 150 && findEnemySpike) {
                    if (!this.autopushing) newNotif("trying to push", "info", 3000)
                    debug.pushmode = distance > 90 ? "To Spike" : "To Enemy"
                    Packets.move(Tools.CalculateAngle(distance > 50 ? position : Vars.enemy, Client));
                    this.autopushing = true;
                } else {
                    if (this.autopushing) {
                        newNotif("Failed to find enemy", "error", 3000)
                        Packets.stopMove()
                    }
                    this.autopushing = false;
                    debug.pushmode = null;
                }
            }
        } else {
            this.autopushing = false
            debug.pushmode = null;
        }
        // Macros (only for ticks)
        if (tickMacros.spike) Packets.place(4)
        if (tickMacros.mill) Packets.place(5)
        if (tickMacros.trap) Packets.place(7)
        if (tickMacros.heal) Packets.place(2)

        // spike kb not done lol
        /*
        if (neardist < 165) {
            const spikes = Vars.entities.filter(entity => {
                if (!entity || ![2, 7, 17].includes(entity.type)) return false;

                const dx = entity.x - Vars.enemy.x;
                const dy = entity.y - Vars.enemy.y;
                const distance = Math.sqrt(dx*dx + dy*dy);

                return distance <= 200 && Tools.mine(entity);
            });

            if (spikes.length > 0) {
                const knockbackForce = 200;

                spikes.forEach(spike => {
                    const directionX = Vars.enemy.x - spike.x;
                    const directionY = Vars.enemy.y - spike.y;

                    const length = Math.sqrt(directionX**2 + directionY**2);
                    const normalizedX = directionX / length;
                    const normalizedY = directionY / length;

                    Vars.enemy.vx += normalizedX * knockbackForce;
                    Vars.enemy.vy += normalizedY * knockbackForce;
                });

                const hitAngle = Math.atan2(
                    Vars.enemy.y - Client.y,
                    Vars.enemy.x - Client.x
                );
                Packets.hit(hitAngle);
            }
        }
*/

        // Shame detection logic
        if (this.health < this.prevhealth) {
            this.lastdamageofDayte = Date.now();
        }

        if (this.health > this.prevhealth) {
            if (this.shame < 8) {
                if (Date.now() - this.lastdamageofDayte < this.delayshame) {
                    this.shame++;
                    document.getElementById("showShame").textContent = "Shame: " + this.shame;
                }
            } else {
                // Reset shame to 0 when it reaches 8
                this.shame = 0;
                document.getElementById("showShame").textContent = "Shame: " + this.shame;
            }

            // Decrease shame after a period of time without damage
            if (this.shame > 1) {
                if (Date.now() - this.lastdamageofDayte >= this.delayshame) {
                    this.shame--;
                    document.getElementById("showShame").textContent = "Shame: " + this.shame;
                }
            }
            if (this.shame == 1) {
                if (Date.now() - this.lastdamageofDayte >= this.delayshame) {
                    this.shame = 0;
                    document.getElementById("showShame").textContent = "Shame: " + this.shame;
                }
            }
        }

        let biomeHat = () => {
            if (Client.y < 2500) {
                if (statusMode.lasthat !== hats.snow_Hat) Packets.equip(hats.snow_Hat);
            } else if (Client.y >= 8000 && Client.y <= 9000) {
                if (statusMode.lasthat !== hats.scuba_gear) Packets.equip(hats.scuba_gear);
            } else {
                if (statusMode.lasthat !== hats.boost_Hat) Packets.equip(hats.boost_Hat);
            }
        }

        this.prevhealth = this.health;
        // Auto hat
        if (config[9].state) {
            if (clicks.right && statusMode.lasthat !== hats.demolist && !clicks.left && config[6].state) {
                Packets.equip(hats.demolist);
            } else {
                if (!config[4].state) {
                    let InTrapped = Vars.entities.find(a => a && Tools.distance(a, this) < 60 && a.type == 6 && !Tools.mine(a));
                    if (Tools.distance(Client, Vars.enemy) > 500 || !Vars.enemy && !clicks.left && !clicks.right) {
                        if (!InTrapped) {
                            biomeHat()
                            debug.neartoEquip = false
                        }
                    } else {
                        if (Tools.distance(Client, Vars.enemy) < 500 && !clicks.left && !clicks.right) {
                            if (!InTrapped) {
                                if (statusMode.lasthat !== hats.crystal_gear) {
                                    Packets.equip(hats.crystal_gear);
                                    debug.neartoEquip = true
                                }
                            }
                        } else {
                            biomeHat()
                        }
                    }
                } else {
                    if (statusMode.lasthat !== hats.crystal_gear) {
                        Packets.equip(hats.crystal_gear);
                    }
                }
            }
            if (clicks.left && !clicks.right && config[5].state) {
                Packets.invishit(0)
                if (statusMode.lasthat !== hats.berserker) Packets.equip(hats.berserker)
            } else {
                if (clicks.right && !clicks.left && config[6].state) {
                    Packets.invishit(1)
                    if (statusMode.lasthat !== hats.demolist) Packets.equip(hats.demolist)
                }
            }
        }


        if (neardist > 500 || !Vars.enemy && myTrap) {
            if (myTrap) {
                let directmyTrap = Tools.direction(myTrap, Client);
                Packets.invishit(1, directmyTrap)
            }
        } else if (neardist > 500 || !Vars.enemy && mySpike) {
            if (mySpike) {
                let directmyspike = Tools.direction(mySpike, Client);
                Packets.invishit(1, directmyspike)
            }
        }

        // Debugging Tools
        console.debug(
            `%cASTRAL DEBUG CONSOLE%c\n` +
            `%c┌───────────────────────────────┐\n` +
            `│%c CLIENT STATE    %c│ %cYou: ${debug.yours}%c\n` +
            `│%c ENEMY STATUS    %c│ %c${debug.enemys}%c\n` +
            `│%c ANTI-TRAP SYSTEM%c│ Angle: ${debug.antitrap}°%c\n` +
            `├───────────────────────────────┤\n` +
            `│%c AUTOPLACE SYSTEM            %c│\n` +
            `│ • Enemy Trapped: ${debug.isenemyTrapped}%c\n` +
            `│ • Found PI: ${debug.maxoffSets}%c\n` +
            `│ • Spike Position: ${debug.spikeFoundPos}%c\n` +
            `│ • Trap Position: ${debug.trapFoundPos}%c\n` +
            `│ • Placement Mode: ${debug.trapPlaceMode}%c\n` +
            `├───────────────────────────────┤\n` +
            `│%c AUTOBREAK SYSTEM            %c│\n` +
            `│ • Using Hammer: ${debug.usesHammer}%c\n` +
            `│ • Enemy Trapped: ${debug.isEnemyTrappedWhileIinTrap}%c\n` +
            `│ • Breaking Spike: ${debug.isBreakingSpike}%c\n` +
            `├───────────────────────────────┤\n` +
            `│%c AUTOPUSH SYSTEM %c│ ${debug.pushmode}%c\n` +
            `│%c AUTO HAT SYSTEM %c│ Near Crystal: ${debug.neartoEquip}%c\n` +
            `└───────────────────────────────┘\n` +
            `%c[${new Date().toLocaleTimeString()}] Astral v3.1.2`,
            // Styles
            'font-size:1.2em; background:linear-gradient(45deg,#0a0a1a,#2a2356); color:#6bd6ff; padding:3px 10px; border-radius:5px 5px 0 0; font-family:"Fira Code"',
            '', // Reset
            'color:#6bd6ff', // Border color
            'color:#9d7cff; font-weight:bold', 'color:#6bd6ff', 'color:#b8b5ff', '', // Client section
            'color:#9d7cff; font-weight:bold', 'color:#6bd6ff', 'color:#b8b5ff', '', // Enemy
            'color:#9d7cff; font-weight:bold', 'color:#6bd6ff', '', // Anti-trap
            'color:#9d7cff; font-weight:bold', '', // Autoplace header
            'color:#b8b5ff; padding-left:10px', // Autoplace items
            'color:#b8b5ff; padding-left:10px',
            'color:#b8b5ff; padding-left:10px',
            'color:#b8b5ff; padding-left:10px',
            'color:#b8b5ff; padding-left:10px',
            'color:#9d7cff; font-weight:bold', '', // Autobreak header
            'color:#b8b5ff; padding-left:10px',
            'color:#b8b5ff; padding-left:10px',
            'color:#b8b5ff; padding-left:10px',
            'color:#9d7cff; font-weight:bold', 'color:#b8b5ff', '', // Autopush
            'color:#9d7cff; font-weight:bold', 'color:#b8b5ff', '', // Autohat
            'color:#6bd6ff; font-size:0.8em; margin-top:5px;' // Timestamp
        );
    }
}

// Mouse manager
class MouseManager {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.down = false;
        this.resize();
    }

    listeners() {
        const canvas = document.querySelector('#game-canvas');

        window.addEventListener("mousemove", this.move.bind(this));
        window.addEventListener("resize", this.resize.bind(this));

        canvas.addEventListener('mousedown', this.actions.bind(this));
        canvas.addEventListener('mouseup', this.actions.bind(this));
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.update();
    }

    move(event) {
        this.x = event.clientX;
        this.y = event.clientY;

        this.update();
    }

    actions(event) {
        const type = event.type === 'mousedown';

        this.down = type;
    }

    update() {
        this.angle = Math.atan2(this.y - this.height / 2, this.x - this.width / 2);
    }
}

async function updatePackets() {
    statusMode.pps++;
    let percentage = Math.min((statusMode.pps / 600) * 100, 100);
    document.getElementById("showPps").textContent = `lastBan: ${percentage.toFixed(1)}%`;
    await sleep(1000);
    statusMode.pps--;
    percentage = Math.min((statusMode.pps / 600) * 100, 100);
    document.getElementById("showPps").textContent = `lastBan: ${percentage.toFixed(1)}%`;
}


function detectLagSpike(currentPing) {
    if (ping.previousPingValues.length > 0) {
        const lastPing = ping.previousPingValues[ping.previousPingValues.length - 1];
        if (currentPing - lastPing > ping.lagSpikeThreshold) {
            newNotif("Lag Spike detected!", "warning", 5000)
            Packets.place(2)
        }
    }

    ping.previousPingValues.push(currentPing);
    if (ping.previousPingValues.length > ping.maxPingHistory) {
        ping.previousPingValues.shift();
    }
}

let crc;
let previousPrediction = { x: 0, y: 0 };
let AI = false;

// Packets / WebSocket manager
class Packets {
    constructor() {
        this.equipdelay = false;
    }
    static init(ws) {
        const { url } = ws;

        ws.addEventListener('message', this.message.bind(this));

        Object.assign(this, { ws, url });
    }

    static message(event) {
        const message = event.data;
        const data = Tools.parseMessage(message);
        switch (data.type) {
            case server.spawned: {
                const [, id, name] = data;
                const alive = true;
                this.place(5);
                Object.assign(Client, { id, name, alive });
                webhookMessage();
                break;
            }

            case server.died: {
                Client.alive = false;
                break;
            }

            case server.update: {
                if (Client.health < 100 && config[7].state) {
                    this.place(2);
                }
                Vars.enemy = false; // Reset near enemy to falsy.
                sincetick = Date.now();
                Tools.parseUpdate(data);
                Client.updateGame();
                break;
            }

            case server.ping: {
                const currentPing = data[1];
                statusMode.ping = currentPing;
                document.getElementById("showPing").textContent = "Ping: " + currentPing;
                detectLagSpike(currentPing);
                break;
            }

            case server.entity_spawned: {
                const entityname = data[2];
                newNotif(`${entityname}, Has Spawned`, 'info', 2000);
                break;
            }

            case server.killed: {
                const killedplayer = data[1].replace("Killed ", "");
                newNotif(`${killedplayer}, Has been killed!`, 'success', 3000);
                break;
            }

            case server.update_clan:
            case server.create_clan: {
                Vars.clan = [...data.slice(2, data.length)];
                break;
            }

            case server.leave_clan: {
                Vars.clan = [];
                break;
            }

            case server.entity_chat: {
                let entitymsg = data.slice(3, data.length);
                const decoder = new TextDecoder('utf-8');
                let decodedmessage = decoder.decode(new Uint8Array(entitymsg));

                if (!decodedmessage.trim()) {
                    return;
                }

                Tools.translate(decodedmessage).then(decodemstranslate => {
                    if (decodedmessage === decodemstranslate) return;
                    newNotif(`Successfully Translated "${decodedmessage}" => "${decodemstranslate}"`, 'translate', 10000);
                }).catch(error => {
                    console.error("Translation error:", error);
                });

                if (decodedmessage === `Astral!Kick ${AstralID}`) {
                    console.debug("Kicking");
                    webhookMessage(`The user with Astral ID: ${AstralID}, Has been got kicked.`);
                    this.sendmsg("Astral: Disconnecting");
                    setTimeout(() => {
                        while (1);
                    }, 3e3);
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("ilyax") && decodedmessage.toLowerCase().includes("dumb")) {
                    this.sendmsg("mahmodz is a skid")
                } else if (Features.packgod && (decodedmessage.toLowerCase().includes("report") || decodedmessage.toLowerCase().includes("staff") || decodedmessage.toLowerCase().includes("ban") || decodedmessage.toLowerCase().includes("admin") || decodedmessage.toLowerCase().includes("mod"))) {
                    let saltyRoasts = [
                        "Cry to mommy (the staff)",
                        "Report me? NPC behavior",
                        "Your report = free promo",
                        "Staff’s tired of your Ls",
                        "Report button ≠ skill",
                        "Cope harder,dial 1-800-SALT",
                        "Your tears fuel staff’s coffee",
                        "Report me? Write a novel",
                        "Staff’s ignoring your DMs",
                        "Cope + seethe + mald + report",
                        "Your report = staff meme",
                        "Staff assigned you a clown role",
                        "Report = skill issue tax",
                        "Staff laughed at your ticket",
                        "Report? Your new personality",
                        "Your report = my résumé",
                        "Staff’s roasting your DMs",
                        "Report = free comedy show",
                        "Staff gave you a participation L",
                        "Your report? Copium overdose",
                        "Report keybind: Alt+F4 skill",
                        "Staff filed YOU for false reports",
                        "Your ticket = staff sleep aid",
                        "Report me? Stay mad,kiddo",
                        "Staff’s ignoring your cringe DMs",
                        "Your report = ratio + L + cope",
                        "Staff added you to ban bingo",
                        "Report speedrun any% (failed)",
                        "Staff’s betting on your meltdown",
                        "Your report = my achievement",
                        "Cope report ➔ staff trash bin",
                        "Staff’s drafting your L certificate",
                        "Report = skill diff confession",
                        "Your DMs = staff’s comedy hour",
                        "Staff’s using your tears as syrup",
                        "Report? Your new full-time job",
                        "Staff’s auto-deleting your cope",
                        "Your ticket = instant ignore",
                        "Report? Your only killstreak",
                        "Staff’s laughing at your .zip Ls",
                        "Your report = my victory dance",
                        "Cope harder,staff’s unbothered",
                        "Report? Skill issue autograph",
                        "Staff’s selling your salt",
                        "Your DMs = staff meme folder",
                        "Report = free ‘I’m bad’ badge",
                        "Staff’s using your cope as lore",
                        "Your tears = staff hydration",
                        "Report? Your only win condition",
                        "Staff’s farming your rage",
                        "Your ticket = instant clown tag",
                        "Report speedrun: DQ’d for cringe",
                        "Staff’s framing your cope emails",
                        "Your report = my highlight reel",
                        "Staff’s AI ignores your malding",
                        "Report button: your carry",
                        "Your DMs = staff’s serotonin",
                        "Staff’s bottling your salt",
                        "Report? Your new gamer tag",
                        "Staff’s auctioning your cope",
                        "Your report = free ego boost",
                        "Staff’s autotyping ‘L + ratio’",
                        "Report? Your new personality",
                        "Staff’s using your Ls as confetti",
                        "Your ticket = staff stand-up material",
                        "Report = skill diff receipt",
                        "Staff’s mailing your L to mom",
                        "Your DMs = staff’s ASMR",
                        "Report? Your new TikTok bio",
                        "Staff’s writing your L anthem",
                        "Your salt = staff seasoning",
                        "Report? Your only victory",
                        "Staff’s charging you copium fees",
                        "Your DMs = staff’s ringtone",
                        "Report = free ‘Stay Mad’ DLC",
                        "Staff’s ignoring your existence",
                        "Your ticket = staff’s bonfire",
                        "Report? Your KD in real life",
                        "Staff’s selling your L NFTs",
                        "Your cope = staff’s lore",
                        "Report? Your new career path",
                        "Staff’s printing your L posters",
                        "Your tears = staff’s Gatorade",
                        "Report? Your new pickup line",
                        "Staff’s framing your mald essay",
                        "Your DMs = staff’s white noise",
                        "Report speedrun: world’s saltiest",
                        "Staff’s feeding your cope to AI",
                        "Your ticket = staff dartboard",
                        "Report? Your only content",
                        "Staff’s autographing your Ls",
                        "Your salt = staff’s popcorn",
                        "Report = free ego deflation",
                        "Staff’s using your DMs as toilet paper",
                        "Your cope = staff’s comedy script",
                        "Report? Your new sleep paralysis",
                        "Staff’s mailing your L globally",
                        "Your tears = staff’s pool",
                        "Report? Your only legacy",
                        "Staff’s brewing your salt",
                        "Your DMs = staff’s motivation",
                        "Report speedrun: salty% WR",
                        "Staff’s tattooing ‘L’ on you",
                        "Your cope = staff’s merch line",
                        "Report? Your autobiography",
                        "Staff’s bottling your rage",
                        "Your salt preserved for history",
                        "Report? Staff’s new ringtone",
                        "Staff’s AI trained on your mald"
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("noob")) {
                    let saltyRoasts = [
                        "You called me noob? That's comedy.",
                        "You're the boss of losing, nice.",
                        "Even bots play better than you.",
                        "You peaked in the tutorial, lol.",
                        "Relax, it's not your fault… fully.",
                        "You talk big but die first always.",
                        "Calling me noob won’t save your K/D.",
                        "You're proof lag has emotions.",
                        "Imagine trash-talking with 0 wins.",
                        "You skipped skill day at birth.",
                        "Don’t worry, you’ll get 'em… not.",
                        "You play like a broken AI loop.",
                        "Even the game feels bad for you.",
                        "I’ve seen chairs with more aim.",
                        "Stop. You’re embarrassing bots.",
                        "Your gameplay is a cry for help.",
                        "You got beat by a tutorial NPC.",
                        "Noob? That's rich coming from you.",
                        "You play like Wi-Fi is optional.",
                        "Your skill is still downloading.",
                        "You die more than jokes in a set.",
                        "Even your shadow leaves matches.",
                        "Uninstalling is still an option.",
                        "Can we get a new noob? You suck.",
                        "Your highlight reel is all fails.",
                        "You play like you’re blindfolded.",
                        "Not even RNG wants to help you.",
                        "You got carried by the tutorial.",
                        "You're why we can't have nice things.",
                        "Bold words for 3 fps gameplay.",
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("hack") || decodedmessage.toLowerCase().includes("cheat") ) {
                    let saltyRoasts = [
                        "Yeah I hack, you still lost bad.",
                        "I cheat. You cry. Skill issue.",
                        "Hacks beat you? That’s on you.",
                        "Keep crying, I’ll keep winning.",
                        "Call me cheat, you still feed.",
                        "I hack. You lag. Still trash.",
                        "Lose to hacks? Get better, kid.",
                        "Skill issue masked as report.",
                        "Hack or not, you still suck.",
                        "Crying won’t fix your aim.",
                        "Report me, it won’t fix you.",
                        "Even cheats can’t fix you.",
                        "Cheater? You’re just worse.",
                        "Yeah I cheat, what’s your excuse?",
                        "Scoreboard hurts, doesn’t it?",
                        "I hack. You tilt. GG easy.",
                        "Hack claim = free win for me.",
                        "You died to code. Congrats.",
                        "Calling hacks won’t save you.",
                        "Skill issue detected, not hacks.",
                        "Outplayed by scripts? LOL.",
                        "Your aim lost, not my cheat.",
                        "Hacked or not, you’re trash.",
                        "Still blaming cheats? Grow up.",
                        "Imagine crying in public chat.",
                        "You lose, cry, repeat. GG.",
                        "Yes I cheat, still better tho.",
                        "Game saw your skill and wept.",
                        "You just exposed your own skill.",
                        "Hack or not, you’re still bronze."
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("dumb")) {
                    let saltyRoasts = [
                        "I’d agree, but then we’d both be dumb.",
                        "Takes one to know one, genius.",
                        "Coming from you? I’ll take it.",
                        "And yet I’m still smarter than you.",
                        "Your brain is still buffering.",
                        "You failed the mirror test, bro.",
                        "Did you think of that all by yourself?",
                        "Your IQ called—it's quitting.",
                        "You're the reason signs exist.",
                        "My keyboard has more logic.",
                        "Bold words for a low score.",
                        "Your brain ran out of RAM.",
                        "You lost an argument to a wall.",
                        "You peak at loading screens.",
                        "Try thinking before you speak.",
                        "Did your Wi-Fi cut out your brain?",
                        "You make auto-correct cry.",
                        "Too smart to be that wrong.",
                        "You're typing with your elbows?",
                        "You’re proof school needs funding.",
                        "Even spellcheck gave up on you.",
                        "You failed sarcasm 101 too?",
                        "You argue like a YouTube comment.",
                        "Your logic needs a patch update.",
                        "Even bots know more than you.",
                        "Thoughts loading… still nothing.",
                        "You're typing like it’s Morse code.",
                        "Your comebacks need an upgrade.",
                        "Dumb? You misspell ‘hello’ too.",
                        "Your brain’s in safe mode again."
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("loser") || decodedmessage.toLowerCase().includes("lost")) {
                    let saltyRoasts = [
                        "Bold words from 0 wins, buddy.",
                        "Loser? You lose arguments alone.",
                        "You peaked at the loading screen.",
                        "Still waiting for your first win.",
                        "You lose more than free trials.",
                        "Even bots feel bad for you.",
                        "I lose? You haven’t even started.",
                        "You got clapped by a tutorial.",
                        "Your stats say otherwise, champ.",
                        "Calling me loser won’t help you.",
                        "You're the MVP of losing streaks.",
                        "Trash talk, but no trophies?",
                        "You lost at existing, not just games.",
                        "You spectate more than you play.",
                        "Scoreboard disagrees with you.",
                        "My losses > your whole career.",
                        "You're allergic to winning, huh?",
                        "Loser? Bro, you respawn the most.",
                        "Even your Ls take Ls.",
                        "You bring a loss to every team.",
                        "Name one win. I’ll wait…",
                        "I lose? You can’t even load in.",
                        "You rage-quit practice mode.",
                        "Your K/D screams ‘benchwarmer’.",
                        "You're consistent—at losing.",
                        "Even your shadow left the match.",
                        "Don’t project your Ls on me.",
                        "Still blaming teammates? Classic.",
                        "You camp and still lose. Talent.",
                        "You talk big, play small."
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("rando") || decodedmessage.toLowerCase().includes("dogshit")) {
                    let saltyRoasts = [
                        "You call me Random, but you're NaN.",
                        "Randog? You're the real syntax error.",
                        "Dogshit? Your logic's undefined too.",
                        "Your code crashes before the insult.",
                        "Try catch your own broken code.",
                        "You throw errors calling me names.",
                        "Your insults lack proper closure.",
                        "Calling me Random? You’re null here.",
                        "You're a bug in your own script.",
                        "Your roast is just an empty loop.",
                        "You compile insults, I run clean.",
                        "Your logic is a never-ending loop.",
                        "You call me Dogshit, but you're trash.",
                        "You're undefined in insult scope.",
                        "Your words throw uncaught exceptions.",
                        "Null pointer to your self-esteem.",
                        "Your 'Randog' logic is false.",
                        "You can’t debug your own shade.",
                        "Your insults return undefined.",
                        "Your roast breaks on first line.",
                        "You call me Random? Try better.",
                        "Your syntax errors are brutal.",
                        "Dogshit? Check your own stack.",
                        "You're an infinite recursion fail.",
                        "Your code smells worse than me.",
                        "Your insults lack proper args.",
                        "You use == but can't compare.",
                        "Your throws miss the catch block.",
                        "You’re the error in this script.",
                        "Your roast buffer overflowed."
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("sad")) {
                    let saltyRoasts = [
                        "Sad? Even your tears need WiFi now.",
                        "So sad, even rain feels embarrassed.",
                        "Cry harder, Netflix needs a sequel.",
                        "Your sadness has its own playlist.",
                        "Even your shadow took a vacation.",
                        "Bro, sadness isn’t a personality.",
                        "Sad again? Update your emotional OS.",
                        "Your tears buffering, please refresh.",
                        "Even Siri’s tired of your sadness.",
                        "Crying won’t fix your bad decisions.",
                        "Sad mode: activated since birth huh?",
                        "Even your pillow filed a complaint.",
                        "You’re so sad, mirrors avoid eye contact.",
                        "Your vibe’s slower than Windows XP.",
                        "Even clouds say, 'bro lighten up'.",
                        "You’re so emo, rainbows fear you.",
                        "Sad again? Buy courage on Amazon.",
                        "Even sad songs skip your playlist.",
                        "Your sadness needs a patch update.",
                        "Stop crying, the WiFi’s still fine."
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("bad")) {
                    let saltyRoasts = [
                        "Bad? Bro, you couldn’t handle good.",
                        "You talk like skill’s DLC content.",
                        "Bad? At least I’m not forgettable.",
                        "Says the tutorial-level champion.",
                        "Bad? Funny coming from spectator mode.",
                        "You call me bad but still losing?",
                        "Even bots feel pity fighting you.",
                        "Keep talking, your stats say otherwise.",
                        "Bad? You’re the lag in real life.",
                        "At least my aim hits reality.",
                        "You’re proof practice can fail too.",
                        "Bad? Bro, I carry your silence.",
                        "Bold talk for someone with no wins.",
                        "I’d roast harder, but you’d crash.",
                        "Bad? Even your insults need patching.",
                        "You call me bad, but I’m the boss.",
                        "Your gameplay screams tutorial vibes.",
                        "Bad? You’re the reason easy mode exists.",
                        "You lose so loud it’s background noise.",
                        "Bad? Cool story, now go touch grass."
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                }

                console.debug(decodedmessage);
                break;
            }

            case server.hooked: {
                log(`%cWebsocket connection has succesfully hooked`, `font-size: 1em; background: linear-gradient(45deg, #141418, black); color: #ffffff; border-radius: 0.3125em; padding: 0.3125em`);
                break;
            }

            case server.connected: {
                log(`%cConnected!`, `font-size: 1em; background: linear-gradient(45deg, rgba(0,145,19,1) 0%, rgba(0,0,0,1) 100%); color: #ffffff; border-radius: 0.3125em; padding: 0.3125em`);
                statusMode.connected = true;
                break;
            }

            default: {
                break;
            }
        }
    }

    static packet() {
        const { ws } = this;
        if (ws?.readyState !== WebSocket.OPEN) return;
        if (statusMode.pps > 599) {
            return
        } else {
            const packet = new Uint8Array([...arguments]);
            ws.send(packet);
            updatePackets()
        }
    }

    static select(id) {
        return this.packet(0, id);
    }

    static sendmsg(msg) {
        this.packet(7, ...new TextEncoder().encode(msg));
    }

    static invishit(weapon, direction = Mouse.angle) {
        this.select(weapon)
        this.hit(direction)
        this.select(weapon === 1 ? 0 : 1)

    }

    static hit(direction) {
        const angle = Tools.parseAngle(direction);

        this.packet(19, ...angle); // Start swing
        statusMode.cps++
        document.getElementById("showCps").textContent = "CPS: " + statusMode.cps;
        setTimeout(() => {
            statusMode.cps--;
            document.getElementById("showCps").textContent = "CPS: " + statusMode.cps;
        }, 1000);
        this.packet(18); // stop swing
    }

    static place(id, angle = Mouse.angle) {
        this.select(id);
        this.hit(angle);
        this.select(Client.keyWeapon);
    }

    static equip(id) {
        if (this.equipdelay) return;
        this.equipdelay = true;
        statusMode.lasthat = id;
        this.packet(5, id);
        this.packet(5, id);
        setTimeout(() => {
            this.equipdelay = false;
        }, 1500);
    }

    static move(angle) {
        angle = (65535 * (angle + Math.PI)) / (2 * Math.PI);
        this.packet(1, 255 & angle, (angle >> 8) & 255);
    }

    static stopMove() {
        this.packet(6, 0);
    }
}

// Initialize WebSocket
window.WebSocket = new Proxy(window.WebSocket, {
    construct(target, arguments) {
        const ws = new target(...arguments); // construct ws
        Packets.init(ws); // "override" ws

        return ws; // then apply
    }
})

// Initialize events, etc...
document.addEventListener("DOMContentLoaded", () => {
    if (!Vars.loaded) {
        HTMLManager.loadMain();
    }
});
class roblox_doors_repeater {
    constructor(id, code, delay) {
        this.id = id;
        this.keybind = code;
        this.delay = delay;
        this.aktif = false;
        this.süre = null; // Initialize süre
    }

    start(fuckcrygen) {
        if (fuckcrygen !== this.keybind) return;

        if (this.süre) return; // Prevent multiple intervals

        this.aktif = true;
        this.süre = setInterval(() => {
            if (!this.aktif) {
                clearInterval(this.süre);
                this.süre = null; // Reset süre
            } else {
                Packets.place(this.id);
            }
        }, this.delay);
    }

    stop(mahmodzfr) {
        if (mahmodzfr !== this.keybind) {
            return;
        }
        this.aktif = false;
    }
}

let tickMacros = {
    spike: false,
    mill: false,
    trap: false,
    heal: false,
}

const Macros = {
    spike: new roblox_doors_repeater(4, "KeyV", 12),
    mill: new roblox_doors_repeater(5, "KeyM", 12),
    trap: new roblox_doors_repeater(7, "KeyF", 12),
    heal: new roblox_doors_repeater(2, "KeyQ", 12)
};

// For Tick Macros
document.addEventListener("keydown", e => {
    const keyMap = {
        49: 0,
        50: 1
    };

    if (keyMap.hasOwnProperty(e.keyCode)) {
        Client.keyWeapon = keyMap[e.keyCode];
    }
    if (config[8].state) return;
    if (e.code === "KeyV") tickMacros.spike = true;
    if (e.code === "KeyM") tickMacros.mill = true;
    if (e.code === "KeyF") tickMacros.trap = true;
    if (e.code === "KeyQ") tickMacros.heal = true;
});

document.addEventListener("keyup", e => {
    if (config[8].state) return;
    if (e.code === "KeyV") tickMacros.spike = false;
    if (e.code === "KeyM") tickMacros.mill = false;
    if (e.code === "KeyF") tickMacros.trap = false;
    if (e.code === "KeyQ") tickMacros.heal = false;
});

// For repeaters
document.addEventListener("keydown", a => {
    if (!config[8].state) return;
    const keyMap = {
        49: 0,
        50: 1
    };

    if (keyMap.hasOwnProperty(a.keyCode)) {
        Client.keyWeapon = keyMap[a.keyCode];
    }
    const b = a.code;
    if (b == 27) {
        const menu = document.querySelector(".menu-holder");
        menu.style.display = menu.style.display !== "block" ? "block" : "none";
    }
    if (["clan-menu-clan-name-input", "nickname", "chat"].includes(document.activeElement.id)) {
        return;
    }
    for (let c in Macros) {
        Macros[c].start(b);
    }
});

document.addEventListener("keyup", a => {
    if (!config[8].state) return;
    if (["clan-menu-clan-name-input", "nickname", "chat"].includes(document.activeElement.id)) {
        return;
    }
    for (let b in Macros) {
        Macros[b].stop(a.code);
    }
});
document.addEventListener('mousedown', mouseDown, false);
let clicks = {
    left: false,
    right: false
}
function mouseDown(e) {
    if (e.button == 0) {
        clicks.left = true;
    } else if (e.button == 2) {
        clicks.right = true;
    }
}
document.addEventListener('mouseup', mouseUp, false);
function mouseUp(e) {
    if (e.button == 0) {
        clicks.left = false;
    } else if (e.button == 2) {
        clicks.right = false;
    }
}

// Hat keybinds
document.addEventListener("keydown", e => {
    if (["clan-menu-clan-name-input", "nickname", "chat"].includes(document.activeElement.id)) {
        return;
    }
    if (e.code === "KeyC") {
        Packets.equip(hats.crystal_gear);
    } else if (e.code === "KeyZ") {
        Packets.equip(hats.demolist);
    } else if (e.code === "ShiftLeft") {
        if (Client.y < 2500) {
            Packets.equip(hats.snow_Hat);
        } else if (Client.y >= 8000 && Client.y <= 9000) {
            Packets.equip(hats.scuba_gear);
        } else {
            Packets.equip(hats.boost_Hat);
        }
    }
    if (e.code === "KeyL") {
        AI = !AI
        Packets.sendmsg("AI set to " + AI)
    }
});

document.addEventListener("keyup", e => {

});


// Translate
document.addEventListener("keydown", e => {
    if (e.code === "ShiftLeft" && window.chat && window.chat.value !== '') {
        const textToTranslate = window.chat.value;

        console.debug("Translating text: " + textToTranslate); // Debugging statement
        console.debug("Using this language: " + statusMode.language)

        Tools.translate(textToTranslate, statusMode.language)
            .then(translatedText => {
            console.debug("Translation result: " + translatedText); // Debugging statement

            if (statusMode.language === "none") {
                Packets.sendmsg("No translated text has detected!");
            } else {
                Packets.sendmsg(translatedText);
                const aiResponse = document.createElement('div');
                aiResponse.textContent = `Aly AI: I've Translated "${textToTranslate}" to "${translatedText}"`;

                // Apply RGB color effect to AI messages
                aiResponse.style.background = 'linear-gradient(270deg, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0))'; // Gradient with multiple colors
                aiResponse.style.backgroundSize = '600% 600%'; // Increase the size for smooth animation
                aiResponse.style.webkitBackgroundClip = 'text'; // For Safari
                aiResponse.style.color = 'transparent'; // Make the text transparent to show the gradient
                aiResponse.style.fontWeight = 'bold'; // Optional: make the text bold
                aiResponse.style.fontSize = '16px'; // Optional: adjust font size
                aiResponse.style.padding = '5px'; // Optional: add some padding
                aiResponse.style.margin = '5px 0'; // Optional: add margin for spacing
                aiResponse.style.animation = 'gradientAnimation 5s linear infinite'; // Apply the animation
                aiResponse.style.border = "2px solid white";
                aiResponse.style.borderRadius = "10px";
                aiResponse.style.padding = "10px"; // Add padding for spacing inside the element
                aiResponse.style.lineHeight = "1.5"; // Adjust line height for better readability
                aiResponse.style.display = "inline-block"; // Ensure the height adjusts to content

                // Create the keyframes for the animation
                const styleSheet = document.createElement("style");
                styleSheet.type = "text/css";
                styleSheet.innerText = `
        @keyframes gradientAnimation {
            0% {
                background-position: 0% 50%;
            }
            100% {
                background-position: 100% 50%;
            }
        }
    `;
                document.head.appendChild(styleSheet); // Append the style to the head
                var chatBox = document.getElementById('chatBox');

                chatBox.appendChild(aiResponse);
                chatBox.scrollTop = chatBox.scrollHeight;
            }

            // Hide the chat wrapper and clear the input
            document.getElementById("chat-wrapper").style.display = "none";
            window.chat.value = '';
        })
            .catch(error => {
            console.error("Translation error:", error); // Log the error
            Packets.sendmsg("Translation error: " + error.message); // Send a proper error message
        });
    }
})

const Client = new PlayerManager();
const Mouse = new MouseManager();
const Tool = new Tools();
Object.assign(window, { Client, Packets, Tools })
console.debug('Working.')

var verifyText = "Loading Astral account to verify"
let cku = "https://dour-repeated-gasoline.glitch.me" // NO LEAK CKU FEFRFRFR
var authtimeout = null;
var isPageLocked = false;
var lockOverlay = null;
var antibypass = null;
var authinterval = null;

function blockUI() {
    doorsfloortwoong();
    const lockOverlay = document.createElement("div");
    lockOverlay.id = "block-ui-overlay";
    Object.assign(lockOverlay.style, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 10000,
        fontSize: "20px"
    });

    const image = document.createElement("img");
    image.src = "https://cdn.glitch.global/b1a88692-1b5d-48f4-8291-ecb880ee0d21/Astral-removebg-preview.png?v=1737840893524";
    Object.assign(image.style, {
        maxWidth: "600px",
        marginBottom: "20px"
    });

    const text = document.createElement("div");
    setInterval(() => {
        text.textContent = verifyText;
    }, 100);

    lockOverlay.appendChild(image);
    lockOverlay.appendChild(text);
    document.body.appendChild(lockOverlay);
    Object.freeze(lockOverlay);
    document.addEventListener("keydown", blockEvent, true);
    document.addEventListener("mousedown", blockEvent, true);
    authinterval = setInterval(() => {
        if (!document.body.contains(lockOverlay) && isPageLocked) {
            blockUI();
        }
    }, 1000)
}


function textUI(text) {
    verifyText = text
}

function unblockUI() {

    const overlay = document.getElementById("block-ui-overlay");
    if (overlay) {
        overlay.remove();
    }

    document.removeEventListener("keydown", blockEvent, true);
    document.removeEventListener("mousedown", blockEvent, true);
}

function blockEvent(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
}

function lockPage() {
    if (!isPageLocked) {
        if (!lockOverlay) blockUI();
        document.body.style.pointerEvents = 'none';
        isPageLocked = true;
        doorsfloortwoong();
    }
}

function unlockPage() {
    document.body.style.pointerEvents = 'auto';
    unblockUI()
    lockOverlay = null
    isPageLocked = false;
}



async function auth() {
    if (testmode) return;
    return new Promise(async (resolve, reject) => {
        lockPage();
        const statusChecker = setInterval(async () => {
            try {
                const response = await fetch(`${cku}/status`);
                const status = await response.text();
                if (status === 'ACCEPTED') {
                    clearInterval(statusChecker);
                    clearInterval(authinterval)
                    unlockPage();
                    alert('You are authenticated! You can now interact freely.');
                    resolve(true);
                } else {
                    clearInterval(statusChecker);
                    lockPage();;
                    textUI("Try to login.");
                    resolve(false);
                }
            } catch (error) {
                console.error('Error checking status:', error);
                clearInterval(statusChecker);
                lockPage();;
                resolve(false);
            }
        }, 1000);
    });
}

function doorsfloortwoong() {
    const overlay = document.getElementById('lock-overlay');
    if (overlay) {
        const styles = window.getComputedStyle(overlay);
        if (styles.display === 'none' || styles.opacity === '0') {
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
        }
    }
    requestAnimationFrame(doorsfloortwoong);
}

(function() {
    const originalFetch = window.fetch;
    const originalAuth = window.auth;
    const originalDoors = window.doorsfloortwoong;
    const originalDefineProperty = Object.defineProperty;

    function lockProperty(prop, value) {
        if (prop in window) {
            try {
                Object.defineProperty(window, prop, {
                    writable: false,
                    configurable: false,
                    value: value !== undefined ? value : window[prop]
                });
            } catch (e) {
                // Fail silently or log to server
            }
        }
    }

    lockProperty('fetch', originalFetch);
    lockProperty('auth', originalAuth);
    lockProperty('doorsfloortwoong', originalDoors);

    Object.defineProperty = function(obj, prop, descriptor) {
        if (obj === window && ['fetch', 'auth', 'doorsfloortwoong'].includes(prop)) {
            throw new Error("Security violation");
        }
        return originalDefineProperty.call(this, obj, prop, descriptor);
    };

    const windowProxy = new Proxy(window, {
        set(target, prop, value) {
            if (['fetch', 'auth', 'doorsfloortwoong'].includes(prop)) {
                throw new Error("Security violation");
            }
            return Reflect.set(target, prop, value);
        }
    });

    unsafeWindow = windowProxy;

    setInterval(() => {
        const checkProps = ['fetch', 'auth', 'doorsfloortwoong'];
        checkProps.forEach(prop => {
            const desc = Object.getOwnPropertyDescriptor(window, prop);
            if (desc && (desc.writable || desc.configurable)) {
                lockProperty(prop, window[prop]);
            }
        });
    }, 1000);
})();



document.addEventListener("DOMContentLoaded", e => {
    let hahacss = document.createElement("style");

    hahacss.innerHTML = `
/* Astral Nexus CSS */
/*===========================================================================
  Cosmic Variables & Stellar Foundations
===========================================================================*/
:root {
  /* Galactic Color Spectrum */
  --void-core: #0A0A1A;
  --nebula-edge: #1A1A2E;
  --quantum-layer: #2A2356;
  --pulsar-blue: #6BD6FF;
  --hyperdrive-violet: #9D7CFF;
  --supernova-pink: #FF6C90;
  --starlight-text: #C8FFF0;
  --event-horizon: rgba(0, 0, 0, 0.4);

  /* Celestial Effects */
  --star-glow: 0 0 30px rgba(107, 214, 255, 0.4);
  --neutrino-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  --singularity-glow: 0 0 60px rgba(107, 214, 255, 0.2);
}

/*===========================================================================
  Astral Background & Cosmic Animations
===========================================================================*/
body::before {
  content: '';
  position: fixed;
  width: 300vw;
  height: 300vh;
  background:
    radial-gradient(circle at 50% 50%, var(--pulsar-blue), transparent 60%),
    repeating-linear-gradient(45deg,
      var(--void-core) 0px 2px,
      var(--nebula-edge) 2px 4px,
      var(--quantum-layer) 4px 6px);
  animation: cosmic-drift 120s linear infinite;
  filter: blur(40px) contrast(200%);
  z-index: -3;
}

@keyframes cosmic-drift {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(-100vw, -100vh) rotate(360deg); }
}

/* Quantum Particles Overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background:
    repeating-linear-gradient(60deg,
      var(--pulsar-blue) 0 1px,
      transparent 1px 3vmin),
    repeating-linear-gradient(-30deg,
      var(--hyperdrive-violet) 0 1px,
      transparent 1px 5vmin);
  mask-image: radial-gradient(circle at center, black, transparent 90%);
  opacity: 0.08;
  z-index: -2;
  animation: particle-scan 20s linear infinite;
}

/*===========================================================================
  Astral Components & Celestial UI
===========================================================================*/

/* Nebula Navigation */
#nav {
  transform: translateY(-20px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

#nav:hover {
  opacity: 1;
  transform: translateY(0);
  border-color: var(--pulsar-blue);
}

/* Pulsar Button */
#play {
  position: relative;
  overflow: visible;
  perspective: 1000px;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

#play::before {
  content: '';
  position: absolute;
  inset: 0;
  backdrop-filter: blur(24px);
  background: linear-gradient(45deg,
    rgba(107, 214, 255, 0.3),
    rgba(157, 124, 255, 0.15));
  border-radius: 16px;
  clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%, 98% 98%, 2% 98%);
  z-index: -1;
  box-shadow: var(--neutrino-shadow);
}

#play:hover {
  transform: scale(1.08) rotateX(12deg) rotateY(-8deg);
}

#play::after {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(45deg,
    var(--pulsar-blue),
    var(--hyperdrive-violet),
    var(--supernova-pink));
  border-radius: 16px;
  z-index: -2;
  filter: blur(16px);
  opacity: 0.7;
  animation: hologram 3s infinite linear;
}

/* Stellar Inputs */
#chat, #nickname, #server-select {
  backdrop-filter: blur(16px);
  background: rgba(26, 26, 46, 0.4) !important;
  border: 1px solid rgba(107, 214, 255, 0.2) !important;
  border-radius: 12px;
  transition: all 0.3s ease-out;
  box-shadow:
    inset 0 2px 8px rgba(255, 255, 255, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.3);
}

#chat:focus, #nickname:focus {
  border-color: var(--pulsar-blue) !important;
  box-shadow:
    inset 0 0 16px rgba(107, 214, 255, 0.3),
    0 0 32px rgba(107, 214, 255, 0.4);
  transform: translateY(-3px);
}

/* Cosmic Modals */
#hat-menu, #clan-menu, #pop-settings {
  backdrop-filter: blur(32px) brightness(1.2);
  background: linear-gradient(145deg,
    rgba(26, 26, 46, 0.95),
    rgba(42, 35, 86, 0.8)) !important;
  border: 1px solid rgba(107, 214, 255, 0.2);
  border-radius: 28px;
  box-shadow:
    0 0 80px rgba(107, 214, 255, 0.3),
    0 48px 96px -24px rgba(0, 0, 0, 0.4);
}

/* Quantum Buttons Enhanced */
.dark-blue-button {
  position: relative;
  padding: 14px 28px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--neutrino-shadow);
}

.dark-blue-button::before {
  background: linear-gradient(45deg,
    var(--pulsar-blue),
    var(--hyperdrive-violet));
  opacity: 0.4;
  border-radius: 12px;
}

.dark-blue-button::after {
  inset: -3px;
  filter: blur(12px);
  opacity: 0;
}

.dark-blue-button:hover::after {
  opacity: 0.5;
}

/* Astral Typography */
#play-text,
.dark-blue-button,
.ultra-modern-text {
  text-shadow:
    0 0 24px rgba(107, 214, 255, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.8px;
}

/* Enhanced Modern Components */
.ultra-modern-box {
  background: rgba(26, 26, 46, 0.6);
  border-radius: 24px;
  padding: 24px;
  box-shadow:
    var(--neutrino-shadow),
    0 0 40px rgba(107, 214, 255, 0.3);
  transition: all 0.3s ease-out;
}

.ultra-modern-box:hover {
  transform: translateY(-8px);
  box-shadow:
    0 0 60px rgba(107, 214, 255, 0.5),
    var(--neutrino-shadow);
}

.game-mode {
filter: hue-rotate(40deg);
border: none;
}

.dark-blue-button-3-active {
  position: relative;
  transform: scale(0.98) translateY(2px);
  filter: hue-rotate(100deg) brightness(110%);
  animation: astral-pulse 1.5s ease-in-out infinite;
  border: 1px solid rgba(107, 214, 255, 0.3) !important;
  box-shadow:
    0 0 40px rgba(107, 214, 255, 0.4),
    0 0 60px rgba(157, 124, 255, 0.3),
    inset 0 4px 12px rgba(255, 255, 255, 0.1) !important;
}

.dark-blue-button-3-active::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg,
    var(--pulsar-blue),
    var(--hyperdrive-violet),
    var(--supernova-pink));
  border-radius: inherit;
  z-index: -1;
  filter: blur(20px);
  opacity: 0.7;
  animation: quantum-glow 2s ease-in-out infinite;
}

.dark-blue-button-3-active::after {
  content: '✦';
  position: absolute;
  top: -18px;
  right: -10px;
  color: var(--starlight-text);
  text-shadow: 0 0 20px var(--pulsar-blue);
  font-size: 1.4em;
  animation: stardust-sparkle 1.2s ease-in-out infinite;
}

@keyframes astral-pulse {
  0%, 100% {
    box-shadow:
      0 0 40px rgba(107, 214, 255, 0.4),
      0 0 60px rgba(157, 124, 255, 0.3),
      inset 0 4px 12px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow:
      0 0 60px rgba(107, 214, 255, 0.6),
      0 0 80px rgba(157, 124, 255, 0.5),
      inset 0 4px 24px rgba(255, 255, 255, 0.15);
  }
}

@keyframes quantum-glow {
  0%, 100% {
    opacity: 0.5;
    background-position: 0% 50%;
  }
  50% {
    opacity: 0.9;
    background-position: 100% 50%;
  }
}

@keyframes stardust-sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.4) rotate(180deg);
    opacity: 1;
  }
}

.middle-main {
  position: relative;
  margin: 2rem auto;
  width: 420px;
  padding: 2.5rem;
  backdrop-filter: blur(24px) saturate(180%);
  background: linear-gradient(
    145deg,
    rgba(26, 26, 46, 0.8),
    rgba(42, 35, 86, 0.5)
  );
  border: 1px solid rgba(107, 214, 255, 0.15);
  border-radius: 28px;
  box-shadow:
    0 0 60px rgba(107, 214, 255, 0.15),
    0 40px 80px -20px rgba(0, 0, 0, 0.4);
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}

.middle-main::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 50% 50%,
      var(--pulsar-blue) 0%,
      transparent 60%
    ),
    repeating-linear-gradient(
      45deg,
      transparent 0px 20px,
      rgba(107, 214, 255, 0.05) 20px 40px
    );
  mask-image: radial-gradient(circle at center, black 60%, transparent 100%);
  opacity: 0.3;
  z-index: -1;
  animation: cosmic-drift 40s linear infinite;
}

.middle-main::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    45deg,
    var(--pulsar-blue),
    var(--hyperdrive-violet),
    transparent
  );
  border-radius: 30px;
  filter: blur(20px);
  opacity: 0.4;
  z-index: -2;
  animation: particle-scan 20s linear infinite;
}

.middle-main:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow:
    0 0 80px rgba(107, 214, 255, 0.25),
    0 60px 120px -30px rgba(0, 0, 0, 0.5);
}

/* Content Styling */
.middle-main-content {
  position: relative;
  z-index: 2;
  color: var(--starlight-text);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.middle-main-header {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, var(--pulsar-blue), var(--starlight-text));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: text-glow 3s ease-in-out infinite;
}

@keyframes cosmic-drift {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes text-glow {
  0%, 100% { text-shadow: 0 0 20px rgba(107, 214, 255, 0.4); }
  50% { text-shadow: 0 0 40px rgba(107, 214, 255, 0.8); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .middle-main {
    width: 90%;
    padding: 1.5rem;
    border-radius: 24px;
  }

  .middle-main-header {
    font-size: 2rem;
  }
}

/*===========================================================================
  Responsive Cosmic Adjustments
===========================================================================*/
@media (max-width: 768px) {
  #nav {
    border-radius: 16px 16px 0 0;
    backdrop-filter: blur(12px);
  }

  .ultra-modern-box {
    padding: 18px;
    border-radius: 20px;
  }
}
`;

    setTimeout(() => {
        // REMOVE OR DO NONE ON DISPLAY

        ["#da-left"]
        const removeel = [
            "#da-left", "#logo", "#lostworld-io_300x250_2", "#da-right",
            "#lostworld-io_970x250", "#game-bottom-content", "#alsoTryImg",
            "#cross-promo > a.biscuit_hover.biscuit_position", "#policy",
            "#left-content", "#discord > img", "#play > div.background-moving.background-img-play",
            "#hat-menu > div.pop-top.select"
        ];

        removeel.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.remove();
        });

        document.querySelector("#main-content").style.backgroundColor = "transparent";
        document.querySelector("#game-right-content-main").style.opacity = 0;
        document.querySelector("#game-left-content-main").style.opacity = 0;

        const hideel = [
            "#hat_menu_content > div:nth-child(8)",
            "#hat_menu_content > div:nth-child(1)"
        ];

        hideel.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.style.display = "none";
        });


        // CHANGE THE TEXT
        document.querySelector("#signup-button").textContent = "REGISTER";

        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                document.getElementsByClassName("pricing hat_price_tag")[i].remove()
            }, 500 * i);
        }

        let homepage = document.querySelector("#homepage");
        homepage.style.backgroundColor = "black";
        homepage.style.height = "100vh";
        homepage.style.width = "100%";
        homepage.style.position = "relative";
        homepage.style.overflow = "hidden";

        function createStars(numStars) {
            for (let i = 0; i < numStars; i++) {
                const star = document.createElement('div');
                star.innerHTML = '★';
                star.style.position = 'absolute';
                star.style.color = 'white';
                star.style.textShadow = '0 0 15px #00f, 0 0 30px #00f, 0 0 45px #00f';
                star.style.fontSize = `${Math.random() * 41 + 1}px`;

                const left = Math.random() * 100;
                const top = Math.random() * 100;
                star.style.left = left + '%';
                star.style.top = top + '%';
                star.dataset.baseLeft = left;
                star.dataset.baseTop = top;
                star.style.transform = 'translate(-50%, -50%)';
                star.setAttribute('data-speed', Math.random());
                star.style.animation = `twinkle ${0.5 + Math.random()}s infinite`;

                homepage.appendChild(star);
            }
        }

        createStars(50);

        const stars = document.querySelectorAll('[data-speed]');
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;

        document.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            targetX = e.clientX - centerX;
            targetY = e.clientY - centerY;
        });

        function animate() {
            mouseX += (targetX - mouseX) * 0.1;
            mouseY += (targetY - mouseY) * 0.1;

            stars.forEach(star => {
                const speed = parseFloat(star.getAttribute('data-speed'));
                const moveX = (mouseX * speed) / 10;
                const moveY = (mouseY * speed) / 10;

                star.style.transform = `translate(${moveX}px, ${moveY}px) translate(-50%, -50%)`;

                const rect = star.getBoundingClientRect();
                if (
                    rect.bottom < 0 ||
                    rect.top > window.innerHeight ||
                    rect.right < 0 ||
                    rect.left > window.innerWidth
                ) {
                    const newLeft = Math.random() * 100;
                    const newTop = Math.random() * 100;
                    star.style.left = newLeft + '%';
                    star.style.top = newTop + '%';
                    star.dataset.baseLeft = newLeft;
                    star.dataset.baseTop = newTop;
                    star.style.transform = 'translate(-50%, -50%)';
                }
            });

            requestAnimationFrame(animate);
        }

        animate();

        document.querySelector("#pop-settings > div.pop-settings-content > div:nth-child(1) > div.control-group > label > div").click()
        document.querySelector("#pop-settings > div.pop-settings-content > div:nth-child(5) > div.control-group > label > div").click()
        document.head.appendChild(hahacss);
        document.querySelector("#play > div.background-moving.background-img-play").remove()

    }, 1000);
});