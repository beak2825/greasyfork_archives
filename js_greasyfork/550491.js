// ==UserScript==
// @name         Duelingbook Deck Cost Tracker (Userscript)
// @namespace    zayn-db-costs
// @version      1.5
// @description  Displays custom point costs on cards in Duelingbook's deck editor and search results.
// @match        https://www.duelingbook.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550491/Duelingbook%20Deck%20Cost%20Tracker%20%28Userscript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550491/Duelingbook%20Deck%20Cost%20Tracker%20%28Userscript%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MAX_COST = 100;
  const DEFAULT_COST = 0;

  const cardCosts = {
    "abyss dweller": 100,
    "adamancipator risen - dragite": 20,
    "agido the ancient sentinel": 50,
    "albion the sanctifire dragon": 33,
    "allure of darkness": 5,
    "amorphactor pain, the imagination dracoverlord": 100,
    "ancient gear advance": 33,
    "ancient gear statue": 33,
    "and the band played on": 100,
    "angel o7": 100,
    "anti-spell fragrance": 100,
    "appointer of the red lotus": 50,
    "arahime the manifested mikanko": 33,
    "arcana force xxi - the world": 100,
    "archlord kristya": 100,
    "archnemeses eschatos": 100,
    "archnemeses protos": 100,
    "artifact scythe": 100,
    "asceticism of the six samurai": 10,
    "ash blossom & joyous spring": 15,
    "assault synchron": 5,
    "astral kuriboh": 3,
    "atlantean dragoons": 40,
    "azamina ilia silvia": 20,
    "azamina mu rcielago": 33,
    "bahamut shark": 81,
    "baronne de fleur": 85,
    "barrier of the voiceless voice": 33,
    "barrier statue of the abyss": 60,
    "barrier statue of the drought": 60,
    "barrier statue of the heavens": 60,
    "barrier statue of the inferno": 60,
    "barrier statue of the stormwinds": 60,
    "barrier statue of the torrent": 60,
    "beatrice, lady of the eternal": 100,
    "big welcome labrynth": 33,
    "blackwing - boreastorm the wicked wind": 20,
    "blackwing - chinook the snow blast": 5,
    "blackwing - zephyros the elite": 15,
    "blaster, dragon ruler of infernos": 7,
    "blaze fenix, the burning bombardment bird": 70,
    "blazing cartesia, the virtuous": 3,
    "block dragon": 40,
    "bonfire": 33,
    "book of eclipse": 5,
    "book of moon": 7,
    "brain research lab": 100,
    "branded expulsion": 33,
    "branded fusion": 33,
    "branded lost": 66,
    "brilliant fusion": 33,
    "butterfly dagger - elma": 1,
    "bystial baldrake": 30,
    "bystial dis pater": 10,
    "bystial druiswurm": 30,
    "bystial magnamhut": 33,
    "bystial saronir": 20,
    "called by the grave": 20,
    "card destruction": 40,
    "card of demise": 40,
    "card of safe return": 40,
    "catapult turtle": 100,
    "centur-ion auxila": 33,
    "centur-ion primera": 5,
    "centur-ion trudea": 3,
    "chain strike": 50,
    "change of heart": 10,
    "chaofeng, phantom of the yang zing": 13,
    "chaos angel": 20,
    "chaos dragon levianeer": 10,
    "chaos ruler, the chaotic magical dragon": 50,
    "chaos space": 40,
    "charge of the light brigade": 33,
    "cold wave": 100,
    "confiscation": 100,
    'contact "c"': 100,
    "cornfield coatl": 33,
    "cosmic blazar dragon": 1,
    "creature swap": 1,
    "crimson dragon": 100,
    "crossout designator": 10,
    "crystron inclusion": 33,
    "crystron smiger": 5,
    "crystron sulfador": 3,
    "crystron thystvern": 5,
    "cyber angel benten": 40,
    "cyber dragon infinity": 20,
    "cyber jar": 33,
    "cyber-stein": 27,
    "d/d/d duo-dawn king kali yuga": 77,
    "d/d/d wave high king caesar": 20,
    "daigusto emeral": 1,
    "danger! bigfoot!": 3,
    "danger! chupacabra!": 3,
    "danger! dogman!": 3,
    "danger! mothman!": 3,
    "danger! nessie!": 7,
    "danger! ogopogo!": 3,
    "danger! thunderbird!": 3,
    "danger!? jackalope?": 7,
    "danger!? tsuchinoko?": 7,
    "dark end evaporation dragon": 5,
    "dark hole": 3,
    "dark world archives": 5,
    "deception of the sinful spoils": 33,
    "deck lockdown": 100,
    "deep sea aria": 33,
    "delinquent duo": 100,
    "denglong, first of the yang zing": 33,
    "denko sekka": 20,
    "destiny hero - destroyer phoenix enforcer": 20,
    "destiny hero - plasma": 20,
    "destructive daruma karma cannon": 5,
    "diabell, queen of the white forest": 25,
    "diabellstar the black witch": 20,
    "different dimension ground": 10,
    "dimension fusion": 45,
    "dimension shifter": 5,
    "dimensional barrier": 100,
    "dinomorphia intact": 1,
    "dinomorphia rexterm": 91,
    "dinowrestler pankratops": 10,
    "divine arsenal aa-zeus - sky thunder": 20,
    "diviner of the herald": 33,
    "djinn releaser of rituals": 100,
    "dogmatika ecclesia, the virtuous": 3,
    "domain of the true monarchs": 50,
    "dominus impulse": 30,
    "dominus purge": 10,
    "dracotail arthalion": 10,
    "dracotail faimena": 20,
    "dracotail mululu": 5,
    "dragon master magia": 100,
    "dragonic diagram": 33,
    "dragonmaid sheou": 20,
    "dragonmaid tidying": 10,
    "dragon's bind": 100,
    "dragon's light and darkness": 7,
    "droll & lock bird": 7,
    "drytron alpha thuban": 33,
    "drytron mu beta fafnir": 33,
    "duality": 10,
    "eclipse wyvern": 33,
    "effect veiler": 7,
    "el shaddoll apkallone": 10,
    "el shaddoll winda": 60,
    "elder entity norden": 91,
    "elder entity n'tss": 7,
    "elemental hero stratos": 3,
    "elzette, azamina of the white forest": 22,
    "emergency teleport": 40,
    "emergency!": 33,
    "eva": 1,
    "evenly matched": 10,
    "ext ryzeal": 25,
    "f.a. dawn dragster": 20,
    "fairy tail - snow": 85,
    "fiber jar": 30,
    "final countdown": 100,
    "fire formation - tenki": 40,
    "fire king courtier ulcanix": 20,
    "fire king high avatar kirin": 10,
    "fishborg blaster": 33,
    "floowandereeze & robina": 33,
    "floowandereeze and the advent of adventure": 33,
    "floowandereeze and the magnificent map": 33,
    "foolish burial": 33,
    "forbidden chalice": 5,
    "forbidden droplet": 10,
    "forbidden lance": 3,
    "fossil dig": 40,
    "fossil dyna pachycephalo": 100,
    "frightfur patchwork": 33,
    "fusion destiny": 33,
    "gallant granite": 33,
    "gateway of the six": 100,
    "gem-knight master diamond": 66,
    "ghost belle & haunted mansion": 5,
    "ghost meets girl - a masterful mayakashi shiranui saga": 100,
    "ghost mourner & moonlit chill": 7,
    "ghost ogre & snow rabbit": 5,
    "ghost sister & spooky dogwood": 3,
    "giant trunade": 40,
    "gigantic spright": 20,
    "gimmick puppet nightmare": 70,
    "give and take": 91,
    "gladiator beast gyzarus": 20,
    "gladiator beast tamer editor": 20,
    "gladiator proving ground": 33,
    "gladiator rejection": 20,
    "glow-up bulb": 21,
    "goblin biker grand entrance": 33,
    "gold sarcophagus": 10,
    "gozen match": 100,
    "graceful charity": 40,
    "grapha, dragon lord of dark world": 5,
    "grapha, dragon overlord of dark world": 5,
    "gruesome grave squirmer": 1,
    "guardian chimera": 33,
    "guiding quem, the virtuous": 3,
    "harpie's feather duster": 33,
    "harpie's feather storm": 100,
    "heart of the blue-eyes": 5,
    "heat wave": 100,
    "heavy storm": 25,
    "herald of the arc light": 50,
    "hot red dragon archfiend king calamity": 1,
    "hyper rank-up-magic utopiforce": 1,
    "ice ryzeal": 20,
    "ido the supreme magical force": 100,
    "imperial order": 100,
    "imsety, glory of horus": 33,
    "incoming machine!": 33,
    "incredible ecclesia, the virtuous": 3,
    "infernal flame banshee": 33,
    "infernity launcher": 88,
    "infinite impermanence": 15,
    "inspector boarder": 20,
    "instant fusion": 100,
    "interrupted kaiju slumber": 33,
    "into the void": 1,
    "invoked caliga": 90,
    "jet synchron": 1,
    "jowgen the spiritualist": 100,
    "junk speeder": 100,
    'k9-17 "ripper"': 20,
    "k9-17 izuna": 20,
    "k9-øø lupis": 5,
    "kaiser colosseum": 100,
    "kashtira arise-heart": 97,
    "kashtira fenrir": 30,
    "kashtira unicorn": 30,
    "kelbek the ancient vanguard": 50,
    "keldo the sacred protector": 1,
    "king of the feral imps": 33,
    "king's sarcophagus": 33,
    "knight armed dragon, the armored knight dragon": 3,
    "knightmare corruptor iblee": 100,
    "koa'ki meiru drago": 75,
    "koa'ki meiru guardian": 3,
    "koa'ki meiru overload": 3,
    "koa'ki meiru sandman": 3,
    "koa'ki meiru wall": 3,
    "lady labrynth of the silver castle": 33,
    "lady's dragonmaid": 20,
    "last turn": 75,
    "last will": 100,
    "lavalval chain": 80,
    "legendary fire king ponix": 10,
    "legendary lord six samurai - shi en": 10,
    "legendary six samurai - shi en": 10,
    "level eater": 100,
    "life equalizer": 100,
    "light and darkness dragonlord": 20,
    "light barrier": 1,
    "light end sublimation dragon": 5,
    "lightning storm": 40,
    "lonefire blossom": 33,
    "lose 1 turn": 100,
    "lubellion the searing dragon": 33,
    "lyrilusc - independent nightingale": 1,
    "magical explosion": 75,
    "magical mid-breaker field": 60,
    "magical scientist": 95,
    "magician of black chaos max": 100,
    "majesty's fiend": 100,
    "mansion of the dreadful dolls": 100,
    "masked hero dark law": 70,
    "mass driver": 100,
    "master peace, the true dracoslaying king": 33,
    'maxx "c"': 50,
    "meizen the battle ninja": 20,
    "mementomictlan tecuhtlica - creation king": 33,
    "mementotlan bone party": 33,
    "mementotlan twin dragon": 33,
    "metamorphosis": 10,
    "mikanko water arabesque": 10,
    "millennium ankh": 3,
    "mind drain": 100,
    "mind master": 1,
    "mirage of nightmare": 10,
    "mirrorjade the iceblade dragon": 33,
    "miscellaneousaurus": 75,
    "mistake": 100,
    "mitsurugi prayers": 60,
    "mitsurugi ritual": 60,
    "monster gate": 50,
    "monster reborn": 20,
    "morphing jar": 33,
    "morphtronic telefon": 55,
    "moulinglacia the elemental lord": 100,
    "mudora the sword oracle": 1,
    "mulcharmy fuwalos": 7,
    "mulcharmy meowls": 5,
    "mulcharmy purulia": 10,
    "m-x-saber invoker": 33,
    "mystic mine": 100,
    "nadir servant": 33,
    "naturia barkion": 10,
    "naturia beast": 50,
    "naturia exterio": 100,
    "necrovalley": 40,
    "neptabyss, the atlantean prince": 33,
    "nibiru, the primal being": 10,
    "nightmare apprentice": 33,
    "nightmare throne": 50,
    "number 1: infection buzzking": 85,
    "number 1: numeron gate ekam": 10,
    "number 100: numeron dragon": 1,
    "number 16: shock master": 100,
    "number 2: numeron gate dve": 10,
    "number 3: numeron gate trini": 10,
    "number 38: hope harbinger dragon titanic galaxy": 10,
    "number 4: numeron gate catvari": 10,
    "number 40: gimmick puppet of strings": 50,
    "number 41: bagooska the terribly tired tapir": 100,
    "number 43: manipulator of souls": 100,
    "number 59: crooked cook": 100,
    "number 75: bamboozling gossip shadow": 70,
    "number 86: heroic champion - rhongomyniad": 31,
    "number 89: diablosis the mind hacker": 85,
    "number 90: galaxy-eyes photon lord": 10,
    "number 95: galaxy-eyes dark matter dragon": 50,
    "number 97: draglubion": 100,
    "number c1: numeron chaos gate sunya": 10,
    "number c40: gimmick puppet of dark strings": 50,
    "number s0: utopic zexal": 100,
    "numeron calling": 30,
    "numeron network": 33,
    "obedience schooled": 40,
    "one day of peace": 11,
    "one for one": 91,
    "onomatopaira": 33,
    "original sinful spoils - snake-eye": 100,
    "outer entity azathot": 100,
    "painful choice": 95,
    "phantom knights' rank-up-magic force": 1,
    "phantom of yubel": 50,
    "pilgrim reaper": 50,
    "pot of desires": 20,
    "pot of greed": 30,
    "pot of prosperity": 40,
    "powersink stone": 100,
    "premature burial": 27,
    "preparation of rites": 5,
    "pre-preparation of rites": 10,
    "pressured planet wraitsoth": 33,
    "primeval planet perlereino": 50,
    "primite lordly lode": 33,
    "psychic end punisher": 20,
    "psy-framegear delta": 7,
    "psy-framegear epsilon": 7,
    "psy-framegear gamma": 15,
    "psy-framelord omega": 100,
    "purrely": 15,
    "purrely sleepy memory": 15,
    "purrelyly": 10,
    "quick launch": 33,
    "raidraptor - vanishing lanius": 5,
    "raigeki": 7,
    "rank-up-magic - the seventh one": 1,
    "rank-up-magic admiration of the thousands": 1,
    "rank-up-magic argent chaos force": 5,
    "rank-up-magic astral force": 1,
    "rank-up-magic barian's force": 1,
    "rank-up-magic cipher ascension": 1,
    "rank-up-magic doom double force": 1,
    "rank-up-magic limited barian's force": 1,
    "rank-up-magic magical force": 1,
    "rank-up-magic numeron force": 1,
    "rank-up-magic quick chaos": 1,
    "rank-up-magic raid force": 1,
    "rank-up-magic raptor's force": 1,
    "rank-up-magic revolution force": 1,
    "rank-up-magic skip force": 5,
    "rank-up-magic soul shave force": 5,
    "rank-up-magic zexal force": 1,
    "ra's disciple": 1,
    "reasoning": 50,
    "red reboot": 50,
    "red-eyes dark dragoon": 100,
    "redox, dragon ruler of boulders": 7,
    "regenesis": 33,
    "reinforcement of the army": 40,
    "rescue-ace air lifter": 10,
    "rescue-ace preventer": 10,
    "return from the different dimension": 50,
    "return of the dragon lords": 10,
    "rise rank-up-magic raidraptor's force": 1,
    "rite of aramesir": 5,
    "ritual beast tamer elder": 10,
    "rivalry of warlords": 100,
    "ronintoadin": 60,
    "royal decree": 10,
    "royal magical library": 100,
    "royal oppression": 100,
    "ryzeal detonator": 20,
    "ryzeal duo drive": 20,
    "sangen kaimen": 50,
    "sangen summoning": 100,
    "sauravis, the ancient and ascended": 5,
    "schwarzschild infinity dragon": 33,
    "secret village of the spellcasters": 100,
    "self-destruct button": 100,
    "sengenjin wakes from a millennium": 33,
    "set rotation": 33,
    "shaddoll schism": 10,
    "shien's dojo": 10,
    "shien's smoke signal": 33,
    "shooting riser dragon": 33,
    "sillva, warlord of dark world": 100,
    "sixth sense": 65,
    "skill drain": 100,
    "smoke grenade of the thief": 87,
    "snake-eye ash": 5,
    "snake-eyes poplar": 5,
    "snatch steal": 7,
    "snoww, unlight of dark world": 33,
    "solemn judgment": 7,
    "solemn strike": 5,
    "solemn warning": 5,
    "songs of the dominators": 10,
    "soul charge": 50,
    "soul drain": 100,
    "speedroid terrortop": 3,
    "spell canceller": 20,
    "spiritual beast tamer lara": 10,
    "spright starter": 20,
    "stand up centur-ion!": 5,
    "stardust sifr divine dragon": 1,
    "starliege seyfert": 33,
    "stray purrely street": 5,
    "substitoad": 60,
    "subterror guru": 5,
    "summon limit": 100,
    "super polymerization": 10,
    "super starslayer ty-phon - sky crisis": 10,
    "supreme king dragon starving venom": 1,
    "swap frog": 33,
    "sword ryzeal": 20,
    "swordsoul emergence": 33,
    "swordsoul grandmaster - chixiao": 33,
    "swordsoul of mo ye": 3,
    "swordsoul strategist longyuan": 5,
    "t.g. hyper librarian": 33,
    "tearlaments havnis": 50,
    "tearlaments kitkallos": 50,
    "tearlaments merrli": 50,
    "tearlaments reinoheart": 50,
    "tearlaments scheiren": 50,
    "telekinetic charging cell": 100,
    "tellarknight ptolemaeus": 100,
    "tempest, dragon ruler of storms": 7,
    "tenpai dragon chundra": 50,
    "tenpai dragon genroku": 25,
    "tenyi spirit - ashuna": 33,
    "terraforming": 33,
    "that grass looks greener": 50,
    "the black goat laughs": 10,
    "the bystial lubellion": 30,
    "the forceful sentry": 100,
    "the gates of dark world": 5,
    "the hidden city": 33,
    "the last warrior from another planet": 100,
    "the melody of awakening dragon": 33,
    "the monarchs erupt": 50,
    "the phantom knights' rank-up-magic launch": 1,
    "the tyrant neptune": 100,
    "the unstoppable exodia incarnate": 20,
    "the zombie vampire": 50,
    "there can be only one": 100,
    "thunder dragon colossus": 67,
    "thunder king rai-oh": 20,
    "tidal, dragon ruler of waterfalls": 7,
    "toadally awesome": 20,
    "tour guide from the underworld": 3,
    "trap dustshoot": 94,
    "traptrix rafflesia": 10,
    "triple tactics talent": 93,
    "triple tactics thrust": 13,
    "trishula, dragon of the ice barrier": 3,
    "true king of all calamities": 100,
    "tyrant's tirade": 100,
    "ultimaya tzolkin": 100,
    "union hangar": 33,
    "vanity's emptiness": 100,
    "vanity's fiend": 100,
    "vanity's ruler": 100,
    "varudras, the final bringer of the end times": 20,
    "virtual world kyubi - shenshen": 20,
    "virtual world mai-hime - lulu": 3,
    "wandering gryphon rider": 20,
    "wanted: seeker of sinful spoils": 33,
    "water enchantress of the temple": 5,
    "welcome labrynth": 33,
    "wind-up carrier zenmaity": 33,
    "wind-up hunter": 75,
    "wishes for eyes of blue": 33,
    "witch of the white forest": 33,
    "yaguramaru the armor ninja": 20,
    "zaborg the mega monarch": 80,
    "zoodiac barrage": 33,
    "zoodiac broadbull": 66,
    "zoodiac drident": 20,
    "zoodiac ratpier": 50
  };

  function ensureTotalDisplay() {
    let totalDisplay = document.getElementById('deck-cost-display');
    if (!totalDisplay) {
      totalDisplay = document.createElement('div');
      totalDisplay.id = 'deck-cost-display';
      totalDisplay.style.position = 'fixed';
      totalDisplay.style.top = '40px';
      totalDisplay.style.right = '10px';
      totalDisplay.style.zIndex = '9999';
      totalDisplay.style.fontSize = '18px';
      totalDisplay.style.fontWeight = 'bold';
      totalDisplay.style.padding = '6px 12px';
      totalDisplay.style.borderRadius = '6px';
      totalDisplay.style.background = 'rgba(0,0,0,0.7)';
      totalDisplay.style.color = 'white';
      document.body.appendChild(totalDisplay);
    }
    return totalDisplay;
  }

  function ensureToggleButton() {
    let btn = document.getElementById('deck-cost-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'deck-cost-toggle';
      btn.textContent = 'Hide Costs';
      btn.style.position = 'fixed';
      btn.style.top = '10px';
      btn.style.right = '10px';
      btn.style.zIndex = '10000';
      btn.style.padding = '4px 10px';
      btn.style.borderRadius = '6px';
      btn.style.background = 'black';
      btn.style.color = 'white';
      btn.style.fontWeight = 'bold';
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', () => {
        costsEnabled = !costsEnabled;
        btn.textContent = costsEnabled ? 'Hide Costs' : 'Show Costs';
        updateDeckCosts();
      });
      document.body.appendChild(btn);
    }
    return btn;
  }

  let costsEnabled = true;

  function getOrCreateLabel(cardEl, cardId) {
    let label = cardEl.querySelector('.cost-label');

    const pos = getComputedStyle(cardEl).position;
    if (pos === 'static') {
      cardEl.style.position = 'relative';
    }

    let bottom = '50px';
    let background = 'rgba(0,0,0,0)';
    let color = 'rgba(0.2,0.2,0.2,0)';

    if (cardId === 'search_card17' || cardId === 'search_card18' || cardId === 'search_card19') {
      bottom = '350px';
      background = 'rgba(0,0,0,0.3)';
      color = 'yellow';
    }

    if (!label) {
      label = document.createElement('div');
      label.className = 'cost-label';
      label.style.position = 'absolute';
      label.style.bottom = bottom;
      label.style.left = '100px';
      label.style.background = background;
      label.style.color = color;
      label.style.fontSize = '200px';
      label.style.padding = '2px 4px';
      label.style.borderRadius = '4px';
      label.style.textShadow = `
        -2px -2px 0 black,
         2px -2px 0 black,
        -2px  2px 0 black,
         2px  2px 0 black,
         0px  0px 4px black
      `;
      label.style.fontWeight = '9000';
      cardEl.appendChild(label);
    }
    return label;
  }

  function updateDeckCosts() {
    ensureToggleButton();

    const selectors = ['.deck_card', '.extra_card', '.side_card', '.search_card'];
    let total = 0;

    for (const selector of selectors) {
      const cards = document.querySelectorAll(selector);
      for (const cardEl of cards) {
        if (!cardEl || cardEl.style.display === 'none') continue;

        const rawName = cardEl.querySelector('.name_txt')?.textContent?.trim() ?? '';
        const cost = cardCosts[rawName.toLowerCase()] ?? DEFAULT_COST;

        if (selector !== '.search_card') {
          total += cost;
        }

        const label = getOrCreateLabel(cardEl, cardEl.id);
        label.textContent = (costsEnabled && cost > 0) ? String(cost) : '';

        const scale = cardEl.querySelector('.scale_left_txt');
        if (scale && scale.style && scale.style.display !== 'none') {
          label.textContent = costsEnabled ? 'X' : '';
        }

        const image = cardEl.querySelector('.card_color');
        if (image && image.src === 'https://images.duelingbook.com/card/link_front2.webp') {
          label.textContent = costsEnabled ? 'X' : '';
        }
      }
    }

    const display = ensureTotalDisplay();
    display.style.display = costsEnabled ? 'block' : 'none';
    display.textContent = `Deck Cost: ${total} / ${MAX_COST}`;
    display.style.color = total > MAX_COST ? 'red' : 'lightgreen';
  }

  let updateScheduled = false;
  const observer = new MutationObserver(() => {
    if (!updateScheduled) {
      updateScheduled = true;
      requestAnimationFrame(() => {
        updateDeckCosts();
        updateScheduled = false;
      });
    }
  });

  function start() {
    if (!document.body) {
      requestAnimationFrame(start);
      return;
    }
    observer.observe(document.body, { childList: true, subtree: true });
    updateDeckCosts();
  }

  start();
})();
