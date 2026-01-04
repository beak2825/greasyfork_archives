// ==UserScript==
// @name         InfoCompte-Bot
// @namespace    http://openuserjs.org/users/The_Stubbs
// @version      12.0.3
// @description  InfoCompte script for OGame (with early access to new features)
// @author       Vulca, benneb & now The Stubbs
// @license      MIT
// @match        http://212.195.47.38:8080/bots/*/browser/*
// @match        http://192.168.1.88:8080/bots/*/browser/*
// @match        http://5.49.35.107:16387/bots/*/browser/*
// @match        http://79.87.64.111:8080/bots/*/browser/*
// @match        http://87.64.122.4:3005/bots/*/browser/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @mood         http://www.youtube.com/watch?v=M4Mcl_Q9ONE
// @downloadURL https://update.greasyfork.org/scripts/556040/InfoCompte-Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/556040/InfoCompte-Bot.meta.js
// ==/UserScript==

const playerId = document.querySelector('[name=ogame-player-id]').content;
const version = 12;
const key = `${ playerId }.${ version }`;

function get$a() {
  return GM_getValue(key, {});
}
function set$6(data) {
  GM_setValue(key, data);
}
function clear() {
  GM_setValue(key, {});
}

var Storage = {
  get: get$a,
  set: set$6,
  clear
};

const translations = {
  en: {
    1: 'Metal mine',
    2: 'Crystal mine',
    3: 'Deuterium synthetizer',
    4: 'Solar plant',
    12: 'Fusion plant',
    14: 'Robotics factory',
    15: 'Nanite factory',
    21: 'Shipyard',
    22: 'Metal storage',
    23: 'Crystal storage',
    24: 'Deuterium storage',
    31: 'Research laboratory',
    33: 'Terraformer',
    34: 'Alliance depot',
    36: 'Repair dock',
    41: 'Moonbase',
    42: 'Sensor phalanx',
    43: 'Jump gate',
    44: 'Missile silo',
    106: 'Espionage',
    108: 'Computer',
    109: 'Weapons',
    110: 'Shielding',
    111: 'Armour',
    113: 'Energy',
    114: 'Hyperspace',
    115: 'Combustion drive',
    117: 'Impulse drive',
    118: 'Hyperspace drive',
    120: 'Laser',
    121: 'Ion',
    122: 'Plasma',
    123: 'Intergalacticresearch network',
    124: 'Astrophysics',
    199: 'Graviton',
    202: 'Small cargo',
    203: 'Large cargo',
    204: 'Light fighter',
    205: 'Heavy fighter',
    206: 'Cruiser',
    207: 'Battleship',
    208: 'Colony ship',
    209: 'Recycler',
    210: 'Espionage probe',
    211: 'Bomber',
    212: 'Solar satellite',
    213: 'Destroyer',
    214: 'Deathstar',
    215: 'Battlecruiser',
    217: 'Crawler',
    218: 'Reaper',
    219: 'Pathfinder',
    401: 'Rocket launcher',
    402: 'Light laser',
    403: 'Heavy laser',
    404: 'Gauss cannon',
    405: 'Ion cannon',
    406: 'Plasma turret',
    407: 'Small shield dome',
    408: 'Large shield dome',
    502: 'Anti-ballistic missiles',
    503: 'Interplanetary missile',
    11_101: 'Residential Sector',
    11_102: 'Biosphere Farm',
    11_103: 'Research Centre',
    11_104: 'Academy of Sciences',
    11_105: 'Neuro-Calibration Centre',
    11_106: 'High Energy Smelting',
    11_107: 'Food Silo',
    11_108: 'Fusion-Powered Production',
    11_109: 'Skyscraper',
    11_110: 'Biotech Lab',
    11_111: 'Metropolis',
    11_112: 'Planetary Shield',
    11_201: 'Intergalactic Envoys',
    11_202: 'High-Performance Extractors',
    11_203: 'Fusion Drives',
    11_204: 'Stealth Field Generator',
    11_205: 'Orbital Den',
    11_206: 'Research AI',
    11_207: 'High-Performance Terraformer',
    11_208: 'Enhanced Production Technologies',
    11_209: 'Light Fighter Mk II',
    11_210: 'Cruiser Mk II',
    11_211: 'Improved Lab Technology',
    11_212: 'Plasma Terraformer',
    11_213: 'Low-Temperature Drives',
    11_214: 'Bomber Mk II',
    11_215: 'Destructeur Mk II',
    11_216: 'Battlecruiser Mk II',
    11_217: 'Robot Assistants',
    11_218: 'Supercomputer',
    12_101: 'Meditation Enclave',
    12_102: 'Crystal Farm',
    12_103: 'Rune Technologium',
    12_104: 'Rune Forge',
    12_105: 'Oriktorium',
    12_106: 'Magma Forge',
    12_107: 'Disruption Chamber',
    12_108: 'Megalith',
    12_109: 'Crystal Refinery',
    12_110: 'Deuterium Synthesiser',
    12_111: 'Mineral Research Centre',
    12_112: 'Advanced Recycling Plant',
    12_201: 'Magma Refinement',
    12_202: 'Acoustic Scanning',
    12_203: 'High Energy Pump Systems',
    12_204: 'Cargo Hold Expansion',
    12_205: 'Magma-Powered Production',
    12_206: 'Geothermal Power Plants',
    12_207: 'Depth Sounding',
    12_208: 'Ion Crystal Enhancement (Heavy Fighter)',
    12_209: 'Improved Stellarator',
    12_210: 'Hardened Diamond Drill Heads',
    12_211: 'Seismic Mining Technology',
    12_212: 'Magma-Powered Pump Systems',
    12_213: 'Ion Crystal Modules',
    12_214: 'Optimised Silo Construction Method',
    12_215: 'Diamond Energy Transmitter',
    12_216: 'Obsidian Shield Reinforcement',
    12_217: 'Rune Shields',
    12_218: 'Rock’tal Collector Enhancement',
    13_101: 'Assembly Line',
    13_102: 'Fusion Cell Factory',
    13_103: 'Robotics Research Centre',
    13_104: 'Update Network',
    13_105: 'Quantum Computer Centre',
    13_106: 'Automatised Assembly Centre',
    13_107: 'High-Performance Transformer',
    13_108: 'Microchip Assembly Line',
    13_109: 'Production Assembly Hall',
    13_110: 'High-Performance Synthesiser',
    13_111: 'Chip Mass Production',
    13_112: 'Nano Repair Bots',
    13_201: 'Catalyser Technology',
    13_202: 'Plasma Drive',
    13_203: 'Efficiency Module',
    13_204: 'Depot AI',
    13_205: 'General Overhaul (Light Fighter)',
    13_206: 'Automated Transport Lines',
    13_207: 'Improved Drone AI',
    13_208: 'Experimental Recycling Technology',
    13_209: 'General Overhaul (Cruiser)',
    13_210: 'Slingshot Autopilot',
    13_211: 'High-Temperature Superconductors',
    13_212: 'General Overhaul (Battleship)',
    13_213: 'Artificial Swarm Intelligence',
    13_214: 'General Overhaul (Battlecruiser)',
    13_215: 'General Overhaul (Bomber)',
    13_216: 'General Overhaul (Destroyer)',
    13_217: 'Experimental Weapons Technology',
    13_218: 'Mechan General Enhancement',
    14_101: 'Sanctuary',
    14_102: 'Antimatter Condenser',
    14_103: 'Vortex Chamber',
    14_104: 'Halls of Realisation',
    14_105: 'Forum of Transcendence',
    14_106: 'Antimatter Convector',
    14_107: 'Cloning Laboratory',
    14_108: 'Chrysalis Accelerator',
    14_109: 'Bio Modifier',
    14_110: 'Psionic Modulator',
    14_111: 'Ship Manufacturing Hall',
    14_112: 'Supra Refractor',
    14_201: 'Heat Recovery',
    14_202: 'Sulphide Process',
    14_203: 'Psionic Network',
    14_204: 'Telekinetic Tractor Beam',
    14_205: 'Enhanced Sensor Technology',
    14_206: 'Neuromodal Compressor',
    14_207: 'Neuro-Interface',
    14_208: 'Interplanetary Analysis Network',
    14_209: 'Overclocking (Heavy Fighter)',
    14_210: 'Telekinetic Drive',
    14_211: 'Sixth Sense',
    14_212: 'Psychoharmoniser',
    14_213: 'Efficient Swarm Intelligence',
    14_214: 'Overclocking (Large Cargo)',
    14_215: 'Gravitation Sensors',
    14_216: 'Overclocking (Battleship)',
    14_217: 'Psionic Shield Matrix',
    14_218: 'Kaelesh Discoverer Enhancement',
    accountOverview: "Account overview",
    alliance: 'Alliance',
    amortizations: 'Amortizations',
    amortizationsSettings: 'Amortizations settings',
    amortizationsWarning: 'Takes time to complete',
    at: 'at',
    basicIncome: 'Basic income',
    buildings: 'Buildings',
    classes: 'Classes',
    clearAllData: "Clear all data",
    colors: 'Colors',
    costs: 'Costs',
    crystal: 'Crystal',
    dailyProductions: 'Daily productions',
    days: 'jours',
    defences: 'Defences',
    deuterium: 'Deuterium',
    deuteriumEquivalent: 'Deuterium equivalent',
    empire: 'Empire',
    empireOf: "Empire of",
    explorerPlayerClass: 'Discoverer',
    exports: 'Exports',
    exportNotification: 'Export placed in clipboard',
    gameforgeAffiliateLink: 'Gameforge affiliate link',
    generatedOn: 'Generated on',
    highscore: 'Highscore',
    hours: 'hours',
    humans: 'Humans',
    ifDestroyed: 'place(s) if destroyed',
    image: 'Image',
    indestructibles: 'Indestructibles',
    inProduction: 'In production',
    kaelesh: 'Kaelesh',
    kofi: 'Buy me a coffee',
    level: 'Level',
    levels: 'Levels',
    lifeform: 'Lifeform',
    lifeformBuildings: 'Lifeform buildings',
    lifeformLevels: 'Lifeform levels',
    lifeformResearches: 'Lifeform researches',
    lifeformSettings: "Lifefom settings",
    lifeforms: 'Lifeforms',
    maximum: 'maximum',
    maximumTemperatures: 'Maxmimum temperatures',
    mechas: 'Mechas',
    menuTitle: 'Script settings',
    metal: 'Metal',
    minerPlayerClass: 'Collector',
    mines: 'Mines',
    miscellaneous: 'Miscellaneous',
    months: 'months',
    moon: 'Moon',
    moons: 'Moons',
    moonBuildings: 'Moon buildings',
    moonDefences: 'Moon defences',
    neededData: 'Needed data',
    on: 'on',
    placeAccountOverviewOnTop: 'Place account overview on top',
    plainText: 'Plain text',
    planet: 'Planet',
    planetBuildings: 'Planet buildings',
    planetDefences: 'Planet defences',
    planetFields: 'Planet fields',
    planets: 'Planets',
    planetsPointsRepartition: 'Planets points repartition',
    planetsToIgnore: 'Planets to ignore',
    points: 'Points',
    pointsRepartition: 'Points repartition',
    premium: 'Objects & officers',
    production: 'Production',
    productionOf: "Production of",
    productions: 'Productions',
    rates: 'Trade rates',
    researcherAllicanceClass: 'Researcher',
    researches: 'Researches',
    resources: 'Resources',
    resourceSettings: 'Resource settings',
    rocktal: 'Rock’tal',
    settings: 'Settings',
    ships: 'Ships',
    shipyards: 'Shipyards',
    standardUnit: 'Standard unit',
    supportLink: 'http://forum.origin.ogame.gameforge.com/forum/thread/151-infocompte/',
    technologies: 'Technologies',
    textWithBBCode: 'Text with BBCode',
    total: 'Total',
    traderAllicanceClass: 'Trader',
    update: 'Update',
    used: 'used',
    useCompactNumbers: 'Use compact numbers',
    useResourceBoosters: 'Use resource boosters',
    warriorAllicanceClass: 'Warrior',
    warriorPlayerClass: 'General',
    weeks: 'weeks',
    whenUpgraded: 'place(s) when upgraded',
    with: 'with',
    years: 'years'
  },
  fr: {
    1: "Mine de métal",
    2: "Mine de cristal",
    3: "Synthétiseur de deutérium",
    4: "Centrale électrique solaire",
    12: "Centrale électrique de fusion",
    14: "Usine de robots",
    15: "Usine de nanites",
    21: "Chantier spatial",
    22: "Hangar de métal",
    23: "Hangar de cristal",
    24: "Réservoir de deutérium",
    31: "Laboratoire de recherche",
    33: "Terraformeur",
    34: "Dépôt de ravitaillement",
    36: "Dock spatial",
    41: "Base lunaire",
    42: "Phalange de capteur",
    43: "Porte de saut spatial",
    44: "Silo de missiles",
    106: "Espionnage",
    108: "Ordinateur",
    109: "Armes",
    110: "Bouclier",
    111: "Protection",
    113: "Énergie",
    114: "Hyperespace",
    115: "Réacteur à combustion",
    117: "Réacteur à impulsion",
    118: "Propulsion hyperespace",
    120: "Laser",
    121: "Ions",
    122: "Plasma",
    123: "Réseau de recherche",
    124: "Astrophysique",
    199: "Graviton",
    202: "Petit transporteur",
    203: "Grand transporteur",
    204: "Chasseur léger",
    205: "Chasseur lourd",
    206: "Croiseur",
    207: "Vaisseau de bataille",
    208: "Vaisseau de colonisation",
    209: "Recycleur",
    210: "Sonde d'espionnage",
    211: "Bombardier",
    212: "Satellite solaire",
    213: "Destructeur",
    214: "Étoile de la mort",
    215: "Traqueur",
    217: "Foreuses",
    218: "Faucheur",
    219: "Éclaireur",
    401: "Lanceur de missiles",
    402: "Artillerie laser légère",
    403: "Artillerie laser lourde",
    404: "Canon de Gauss",
    405: "Artillerie à ions",
    406: "Lanceur de plasma",
    407: "Petit bouclier",
    408: "Grand bouclier",
    502: "Missile d'interception",
    503: "Missile interplanétaire",
    11_101: "Secteur résidentiel",
    11_102: "Ferme biosphérique",
    11_103: "Centre de recherche",
    11_104: "Académie des sciences",
    11_105: "Centre de neurocalibrage",
    11_106: "Fusion à haute énergie",
    11_107: "Réserve alimentaire",
    11_108: "Extraction par fusion",
    11_109: "Tour d’habitation",
    11_110: "Laboratoire de biotechnologie",
    11_111: "Metropolis",
    11_112: "Bouclier planétaire",
    11_201: "Intergalactic Envoys",
    11_202: "Extracteurs à haute performance",
    11_203: "Moteur à fusion",
    11_204: "Générateur de champ de camouflage",
    11_205: "Planque orbitale",
    11_206: "IA de recherche",
    11_207: "Terraformeur à haute performance",
    11_208: "Technologies d'extraction améliorées",
    11_209: "Chasseur léger Mk II",
    11_210: "Croiseur Mk II",
    11_211: "Technologie de laboratoire améliorée",
    11_212: "Terraformeur à plasma",
    11_213: "Propulseurs à faible température",
    11_214: "Bombardier Mk II",
    11_215: "Destroyer Mk II",
    11_216: "Traqueur Mk II",
    11_217: "Assistants robotiques",
    11_218: "Superordinateur",
    12_101: "Enclave stoïque",
    12_102: "Culture du cristal",
    12_103: "Centre technologique runique",
    12_104: "Forge runique",
    12_105: "Orictorium",
    12_106: "Fusion magmatique",
    12_107: "Chambre de disruption",
    12_108: "Monument rocheux",
    12_109: "Raffinerie de cristal",
    12_110: "Syntoniseur de deutérium",
    12_111: "Centre de recherche sur les minéraux",
    12_112: "Usine de traitement à haut rendement",
    12_201: "Batteries volcaniques",
    12_202: "Sondage acoustique",
    12_203: "Système de pompage à haute énergie",
    12_204: "Extension d'espace fret",
    12_205: "Extraction magmatique",
    12_206: "Centrales géothermiques",
    12_207: "Sondage en profondeur",
    12_208: "Renforcement à cristaux ioniques",
    12_209: "Stellarator amélioré",
    12_210: "Tête de forage en diamant renforcées",
    12_211: "Technologie d'extraction sismique",
    12_212: "Pompes au magma",
    12_213: "Module à cristaux ioniques",
    12_214: "Construction optimisée de silos",
    12_215: "Émetteur d'énergie à diamants",
    12_216: "Intensification du bouclier à l'obsidienne",
    12_217: "Boucliers runiques",
    12_218: "Renfort du collecteur Rocta",
    13_101: "Chaîne de production",
    13_102: "Usine de fusion de cellules",
    13_103: "Centre de recherche en robotique",
    13_104: "Réseau d’actualisation",
    13_105: "Centre d’informatique quantique",
    13_106: "Centre d’assemblage automatisé",
    13_107: "Transformateur hyperpuissant",
    13_108: "Chaîne de production de micropuces",
    13_109: "Atelier de montage",
    13_110: "Synthétiseur à haut rendement",
    13_111: "Production de masse de puces",
    13_112: "Nanorobots réparateurs",
    13_201: "Technique de catalyse",
    13_202: "Moteur à plasma",
    13_203: "Module d'optimisation",
    13_204: "IA du dépôt",
    13_205: "Révision général (chasseur léger)",
    13_206: "Chaîne de production automatisée",
    13_207: "IA de drone améliorée",
    13_208: "Technique de recyclage expérimental",
    13_209: "Révision général (croiseur)",
    13_210: "Pilote automatique Slingshot",
    13_211: "Supraconducteur à haute température",
    13_212: "Révision général (vaisseau de bataille)",
    13_213: "Intelligence artificielle collective",
    13_214: "Révision général (traqueur)",
    13_215: "Révision général (bombardier)",
    13_216: "Révision général (destructeur)",
    13_217: "Technique d'armement expérimental",
    13_218: "Renforcement du général des Mechas",
    14_101: "Refugium",
    14_102: "Condensateur d’antimatière",
    14_103: "Salle à vortex",
    14_104: "Maison du savoir",
    14_105: "Forum de la transcendance",
    14_106: "Convecteur d’antimatière",
    14_107: "Laboratoire de clonage",
    14_108: "Accélérateur par chrysalide",
    14_109: "Biomodificateur",
    14_110: "Modulateur psionique",
    14_111: "Hangar de construction de vaisseau",
    14_112: "Supraréfracteur",
    14_201: "Récupération de chaleur",
    14_202: "Traitement au sulfure",
    14_203: "Réseau psionique",
    14_204: "Faisceau de traction télékinésique ",
    14_205: "Technologie de détection améliorée",
    14_206: "Compresseur neuromodal",
    14_207: "Neuro-interface",
    14_208: "Réseau d'analyse superglobal",
    14_209: "Surcadençage (chasseur lourd)",
    14_210: "Système de propulsion télékinétique",
    14_211: "Sixième sens",
    14_212: "Harmonisateur psychique",
    14_213: "Efficient Swarm Intelligence",
    14_214: "Surcadençage (grand transporteur)",
    14_215: "Capteurs gravitationnels",
    14_216: "Surcadençage (vaisseau de bataille)",
    14_217: "Matrice de protection psionique",
    14_218: "Renforcement d'explorateur Kaelesh",
    accountOverview: "Résumé du compte",
    alliance: "Alliance",
    amortizations: "Amortissements",
    amortizationsSettings: "Options d'amortissement",
    amortizationsWarning: "Prend un certain temps",
    at: "à",
    basicIncome: "Revenu de base",
    buildings: "Bâtiments",
    classes: "Classes",
    clearAllData: "Supprimer toutes les données",
    colors: "Couleurs",
    costs: "Coûts",
    crystal: "Cristal",
    dailyProductions: "Productions journalières",
    days: "jours",
    defences: "Défenses",
    deuterium: "Deutérium",
    deuteriumEquivalent: "Équivalent deutérium",
    empire: "Empire",
    empireOf: "Empire du joueur",
    explorerPlayerClass: "Explorateur",
    exports: "Exports",
    exportNotification: "Export placé dans le presse-papier",
    gameforgeAffiliateLink: "Lien d'affiliation Gameforge",
    generatedOn: "Généré le",
    highscore: "Classement",
    hours: "heures",
    humans: "Humains",
    ifDestroyed: "place(s) si détruit",
    image: "Image",
    indestructibles: "Indestructibles",
    inProduction: "En production",
    kaelesh: "Kaeleshs",
    kofi: "Buy me a coffee",
    level: "Niveau",
    levels: "Niveaux",
    lifeform: "Forme de vie",
    lifeformBuildings: "Bâtiments FDV",
    lifeformLevels: "Niveaux des FDV",
    lifeformResearches: "Recherches FDV",
    lifeformSettings: "Gestionnaire de forme de vie",
    lifeforms: "Formes de vie",
    maximum: "maximum",
    maximumTemperatures: "Températures maximales",
    mechas: "Mécas",
    menuTitle: "Options du script",
    metal: "Métal",
    minerPlayerClass: "Collecteur",
    mines: "Mines",
    miscellaneous: "Divers",
    months: "mois",
    moon: "Lune",
    moons: "Lunes",
    moonBuildings: "Bâtiments lunaires",
    moonDefences: "Défenses lunaires",
    neededData: "Données manquantes",
    on: "sur",
    placeAccountOverviewOnTop: 'Résumé du compte au-dessus',
    plainText: "Texte brut",
    planet: "Planète",
    planetBuildings: "Bâtiments planétaires",
    planetDefences: "Défenses planétaires",
    planetFields: "Cases planétaires",
    planets: "Planètes",
    planetsPointsRepartition: "Répartition des points par planète",
    planetsToIgnore: "Planètes à ignorer",
    points: "Points",
    pointsRepartition: "Répartition des points",
    premium: 'Objets & officiers',
    production: "Production",
    productionOf: "Production du joueur",
    productions: "Productions",
    rates: "Taux de change",
    researcherAllicanceClass: "Chercheur",
    researches: "Recherches",
    resources: "Ressources",
    resourceSettings: "Paramétrage des productions",
    rocktal: "Roctas",
    settings: "Options",
    ships: "Vaisseaux",
    shipyards: "Chantiers spatiaux",
    standardUnit: "Unité standard",
    supportLink: "http://board.fr.ogame.gameforge.com/index.php?thread/746302-infocompte/",
    technologies: "Technologies",
    textWithBBCode: "Texte avec BBCode",
    total: "Total",
    traderAllicanceClass: "Marchand",
    update: "Mettre à jour",
    used: "utilisées",
    useCompactNumbers: "Utiliser les nombres abrégés",
    useResourceBoosters: "Utiliser les boosters de ressources",
    warriorAllicanceClass: "Guerrier",
    warriorPlayerClass: "Général",
    weeks: "semaines",
    whenUpgraded: "place(s) quand terminé",
    with: "avec",
    years: "années"
  },
  de: {
    1: 'Metallmine',
    2: 'Kristallmine',
    3: 'Deuterium-Synthetisierer',
    4: 'Solarkraftwerk',
    12: 'Fusionskraftwerk',
    14: 'Roboterfabrik',
    15: 'Nanitenfabrik',
    21: 'Raumschiffswerft',
    22: 'Metallspeicher',
    23: 'Kristallspeicher',
    24: 'Deuteriumtank',
    31: 'Forschungslabor',
    33: 'Terraformer',
    34: 'Allianzdepot',
    36: 'Raumdock',
    41: 'Mondbasis',
    42: 'Sensorphalanx',
    43: 'Sprungtor',
    44: 'Raketensilo',
    106: 'Spionagetechnik',
    108: 'Computertechnik',
    109: 'Waffentechnik',
    110: 'Schildtechnik',
    111: 'Raumschiffpanzerung',
    113: 'Energietechnik',
    114: 'Hyperraumtechnik',
    115: 'Verbrennungstriebwerk',
    117: 'Impulstriebwerk',
    118: 'Hyperraumantrieb',
    120: 'Lasertechnik',
    121: 'Ionentechnik',
    122: 'Plasmatechnik',
    123: 'Intergalaktisches Forschungsnetzwerk',
    124: 'Astrophysik',
    199: 'Gravitonforschung',
    202: 'Kleiner Transporter',
    203: 'Großer Transporter',
    204: 'Leichter Jäger',
    205: 'Schwerer Jäger',
    206: 'Kreuzer',
    207: 'Schlachtschiff',
    208: 'Kolonieschiff',
    209: 'Recycler',
    210: 'Spionagesonde',
    211: 'Bomber',
    212: 'Solarsatellit',
    213: 'Zerstörer',
    214: 'Todesstern',
    215: 'Schlachtkreuzer',
    217: 'Crawler',
    218: 'Reaper',
    219: 'Pathfinder',
    401: 'Raketenwerfer',
    402: 'Leichtes Lasergeschütz',
    403: 'Schweres Lasergeschütz',
    404: 'Gaußkanone',
    405: 'Ionengeschütz',
    406: 'Plasmawerfer',
    407: 'Kleine Schildkuppel',
    408: 'Große Schildkuppel',
    502: 'Abfangrakete',
    503: 'Interplanetarrakete',
    11_101: 'Wohnsektor',
    11_102: 'Biosphären-Farm',
    11_103: 'Forschungszentrum',
    11_104: 'Akademie der Wissenschaften',
    11_105: 'Neuro-Kalibrierungszentrum',
    11_106: 'Hochenergie-Schmelze',
    11_107: 'Nahrungsspeicher',
    11_108: 'Fusionsbetriebene Förderung',
    11_109: 'Skyscraper',
    11_110: 'Biotech-Labor',
    11_111: 'Metropolis',
    11_112: 'Planetar-Schild',
    11_201: 'Intergalaktische Botschafter',
    11_202: 'Hochleistungs-Extraktoren',
    11_203: 'Fusionstriebwerke',
    11_204: 'Tarnfeld-Generator',
    11_205: 'Orbital-Versteck',
    11_206: 'Forschungs-KI',
    11_207: 'Hochleistungs-Terraformer',
    11_208: 'Verbesserte Förderungstechnologien',
    11_209: 'Leichter Jäger Mk II',
    11_210: 'Kreuzer Mk II',
    11_211: 'Verbesserte Labortechnik',
    11_212: 'Plasma-Terraformer',
    11_213: 'Niedrigtemperatur-Triebwerke',
    11_214: 'Bomber Mk II',
    11_215: 'Zerstörer Mk II',
    11_216: 'Schlachtkreuzer Mk II',
    11_217: 'Roboter-Assistenten',
    11_218: 'Supercomputer',
    12_101: 'Meditationsenklave',
    12_102: 'Kristallzucht',
    12_103: 'Runentechnologikum',
    12_104: 'Runenschmiede',
    12_105: 'Oriktorium',
    12_106: 'Magma-Schmelze',
    12_107: 'Disruptionskammer',
    12_108: 'Felsenmonument',
    12_109: 'Kristall-Raffinerie',
    12_110: 'Deuterium-Syntonisierer',
    12_111: 'Mineral-Forschungszentrum',
    12_112: 'Hochleistungs-Verwertungsanlage',
    12_201: 'Vulkanische Batterien',
    12_202: 'Akustische Sondierung',
    12_203: 'Hochenergie-Pumpsysteme',
    12_204: 'Laderaum-Erweiterung (Zivile Schiffe)',
    12_205: 'Magmabetriebene Förderung',
    12_206: 'Geothermie-Kraftwerke',
    12_207: 'Tiefensondierung',
    12_208: 'Ionenkristall-Verstärkung (Schwerer Jäger)',
    12_209: 'Verbesserter Stellarator',
    12_210: 'Gehärtete Diamant-Bohrköpfe',
    12_211: 'Seismische Abbautechnologien',
    12_212: 'Magmabetriebenes Pumpsystem',
    12_213: 'Ionenkristall-Module',
    12_214: 'Optimierte Silo-Bauweise',
    12_215: 'Diamant-Energietransmitter',
    12_216: 'Obsidian-Schildverstärkung',
    12_217: 'Runenschilde',
    12_218: 'Rocktal-Kollektorverstärkung',
    13_101: 'Fertigungsstraße',
    13_102: 'Fusionszellen-Fabrik',
    13_103: 'Robotik-Forschungszentrum',
    13_104: 'Update-Netzwerk',
    13_105: 'Quanten-Computerzentrum',
    13_106: 'Automatisiertes Montagezentrum',
    13_107: 'Hochleistungs-Transformator',
    13_108: 'Mikrochip-Fertigungsstraße',
    13_109: 'Fließband-Montagehalle',
    13_110: 'Hochleistungs-Synthetisierer',
    13_111: 'Chip-Massenproduktion',
    13_112: 'Nano-Reparaturbots',
    13_201: 'Katalysator-Technik',
    13_202: 'Plasma-Antrieb',
    13_203: 'Effizienz-Modul',
    13_204: 'Depot-KI',
    13_205: 'Generalüberholung (Leichter Jäger)',
    13_206: 'Automatisierte Förderstraßen',
    13_207: 'Verbesserte Drohnen-KI',
    13_208: 'Experimentelle Wiederaufbereitungstechnik',
    13_209: 'Generalüberholung (Kreuzer)',
    13_210: 'Slingshot-Autopilot',
    13_211: 'Hochtemperatur-Supraleiter',
    13_212: 'Generalüberholung (Schlachtschiff)',
    13_213: 'Künstliche Schwarmintelligenz',
    13_214: 'Generalüberholung (Schlachtkreuzer)',
    13_215: 'Generalüberholung (Bomber)',
    13_216: 'Generalüberholung (Zerstörer)',
    13_217: 'Experimentelle Waffentechnik',
    13_218: 'Mecha-Generalverstärkung',
    14_101: 'Refugium',
    14_102: 'Antimaterie-Kondensator ',
    14_103: 'Vortexkammer',
    14_104: 'Hallen der Erkenntnis',
    14_105: 'Forum der Transzendenz',
    14_106: 'Antimaterie-Konvektor',
    14_107: 'Klonlabor',
    14_108: 'Chrysalis-Akzelerator',
    14_109: 'Bio-Modifikator',
    14_110: 'Psionischer Modulator',
    14_111: 'Schiffs-Fabrikationshalle',
    14_112: 'Supra-Refraktor',
    14_201: 'Wärme-Rückgewinnung',
    14_202: 'Sulfid-Prozesstechnik',
    14_203: 'Psionisches Netzwerk',
    14_204: 'Telekinese-Traktorstrahl',
    14_205: 'Verbesserte Sensortechnik',
    14_206: 'Neuromodaler Komprimator',
    14_207: 'Neuro-Interface',
    14_208: 'Superglobales Analysenetzwerk',
    14_209: 'Übertaktung (Schwerer Jäger)',
    14_210: 'Telekinetisches Schubsystem',
    14_211: 'Sechster Sinn',
    14_212: 'Psycho-Harmonisierer',
    14_213: 'Effiziente Schwarmintelligenz',
    14_214: 'Übertaktung (Großer Transporter)',
    14_215: 'Gravitationssensoren',
    14_216: 'Übertaktung (Schlachtschiff)',
    14_217: 'Psionische Schutzmatrix',
    14_218: 'Kaelesh-Entdeckerverstärkung',
    accountOverview: "Account Übersicht",
    alliance: 'Allianz',
    amortizations: 'Amortisation',
    amortizationsSettings: 'Amortisationseinstellungen',
    amortizationsWarning: 'Benötigte Zeit zur Fertigstellung',
    at: 'um',
    basicIncome: 'Grundeinkommen',
    buildings: 'Gebäude',
    classes: 'Klasse',
    clearAllData: "Alle Daten löschen",
    colors: 'Farben',
    costs: 'Kosten',
    crystal: 'Kristall',
    dailyProductions: 'Tägliche Produktion',
    days: 'Tage',
    defences: 'Verteidigung',
    deuterium: 'Deuterium',
    deuteriumEquivalent: 'Deuterium equivalent',
    empire: 'Imperium',
    empireOf: "Imperium von",
    explorerPlayerClass: 'Entdecker',
    exports: 'Exporte',
    exportNotification: 'Export in die Zwischenablage kopiert',
    gameforgeAffiliateLink: 'Gameforge Affiliate-Link',
    generatedOn: 'Erstellt am',
    highscore: 'Highscore',
    hours: 'Stunden',
    humans: 'Menschen',
    ifDestroyed: 'Position(en) wenn zerstört',
    image: 'Bild',
    indestructibles: 'Unzustörbares',
    inProduction: 'In Produktion',
    kaelesh: 'Kaelesh',
    kofi: 'Buy me a coffee',
    level: 'Stufe',
    levels: 'Stufen',
    lifeform: 'Lebensform',
    lifeformBuildings: 'Lebensform Gebäude',
    lifeformLevels: 'Lebensform Stufe',
    lifeformResearches: 'Lebensform Erforschungen',
    lifeformSettings: "Lebensform Einstellungen",
    lifeforms: 'Lebensformen',
    maximum: 'Maximum',
    maximumTemperatures: 'Maximaltemperatur',
    mechas: 'Mechas',
    menuTitle: 'Script Einstellungen',
    metal: 'Metall',
    minerPlayerClass: 'Kollektor',
    mines: 'Minen',
    miscellaneous: 'Verschiedenes',
    months: 'Monate',
    moon: 'Mond',
    moons: 'Monde',
    moonBuildings: 'Mond Gebäude',
    moonDefences: 'Mond Verteidigung',
    neededData: 'Benötigte Daten',
    on: 'auf',
    placeAccountOverviewOnTop: 'Account Übersicht oben anzeigen',
    plainText: 'Reiner Text',
    planet: 'Planet',
    planetBuildings: 'Planeten Gebäude',
    planetDefences: 'Planeten Verteidigung',
    planetFields: 'Planet Felder',
    planets: 'Planeten',
    planetsPointsRepartition: 'Planeten Punkteverteilung',
    planetsToIgnore: 'Planeten ignorieren',
    points: 'Punkte',
    pointsRepartition: 'Punkteverteilung',
    premium: 'Items & Offiziere',
    production: 'Produktion',
    productionOf: "Produktion von",
    productions: 'Produktionen',
    rates: 'Handelskurs',
    researcherAllicanceClass: 'Entdecker',
    researches: 'Forschungen',
    resources: 'Rohstoffe',
    resourceSettings: 'Versorgungseinstellungen',
    rocktal: 'Rock’tal',
    settings: 'Einstellungen',
    ships: 'Schiffe',
    shipyards: 'Raumschiffswerft',
    standardUnit: 'Standardeinheit',
    supportLink: 'http://forum.origin.ogame.gameforge.com/forum/thread/151-infocompte/',
    technologies: 'Technologien',
    textWithBBCode: 'Text mit BBCode',
    total: 'Summe',
    traderAllicanceClass: 'Händler',
    update: 'Update',
    used: 'benutzt',
    useCompactNumbers: 'Benutze kompakte Zahlen',
    useResourceBoosters: 'Benutze Rohstoff-Booster',
    warriorAllicanceClass: 'Krieger',
    warriorPlayerClass: 'General',
    weeks: 'Wochen',
    whenUpgraded: 'Position(en) wenn abgeschlossen',
    with: 'mit',
    years: 'Jahre'
  }
};

var Translation = translations[document.documentElement.lang] || translations.en;

const locale = LocalizationStrings.decimalPoint === '.' ? 'en-US' : 'de-DE';
const options$1 = {
  compact: {
    notation: 'compact' ,
    compactDisplay: 'short',
    maximumFractionDigits: 2
  },
  decimal: {
    style: 'decimal',
    maximumFractionDigits: 2
  },
  percent: {
    style: 'percent',
    minimumFractionDigits: 2
  }
};

function getNumber(value) {
  value = value.replaceAll(LocalizationStrings.thousandSeperator, '');
  value = value.replaceAll(LocalizationStrings.decimalPoint, '.');
  return parseFloat(value);
}
function getFullNumberString$2(value) {
  return value.toLocaleString(locale, options$1.decimal);
}
function getTruncatedNumberString$2(value) {
  value = Math.trunc(value);
  return getFullNumberString$2(value);
}
function getCompactNumberString(value) {
  value = Math.floor(value).toLocaleString('en', options$1.compact);
  return value.replaceAll('.', LocalizationStrings.decimalPoint);
}
function getDurationString(value) {
  let unit;
  if (value === Infinity) {
    return Infinity;
  } else if (value > 8_760) {
    unit = Translation.years;
    value /= 8_760;
  } else if (value > 732) {
    unit = Translation.months;
    value /= 732;
  } else if (value > 168) {
    unit = Translation.weeks;
    value /= 168;
  } else if (value > 24) {
    unit = Translation.days;
    value /= 24;
  } else {
    unit = Translation.hours;
  }
  return `${ getFullNumberString$2(value) } ${ unit }`;
}
function getPercentString$1(value) {
  value ||= 0;
  return value.toLocaleString(locale, options$1.percent);
}
function getReducedObjects(...objects) {
  const result = {};
  for (const object of objects) {
    for (const key in object) {
      if (areObjects(result[key], object[key])) {
        const value = getReducedObjects(result[key], object[key]);
        result[key] = value;
      } else if (object[key] !== undefined) {
        const value = object[key];
        result[key] = value;
      }
    }
  }
  return result;
}
function toArray(value) {
  return value ? Array.isArray(value) ? value : [value] : [];
}
function areObjects(...values) {
  for(const value of values) {
    if (!isObject(value)) {
      return false;
    }
  }
  return true;
}
function isObject(value) {
  return value != null && value.constructor.name === 'Object';
}

var Types = {
  getNumber,
  getFullNumberString: getFullNumberString$2,
  getTruncatedNumberString: getTruncatedNumberString$2,
  getCompactNumberString,
  getDurationString,
  getPercentString: getPercentString$1,
  getReducedObjects,
  toArray,
  areObjects,
  isObject
};

const upgradables = {
};
const mines = {
  all: [1, 2, 3]
};
const buildings = {
  all: [4, 12, 14, 15, 21, 22, 23, 24, 31, 33, 34, 36, 41, 42, 43, 44],
  planet: [4, 12, 14, 15, 21, 22, 23, 24, 31, 33, 34, 36, 44],
  moon: [14, 21, 22, 23, 24, 41, 42, 43]
};
const lifeforms$1 = {
  buildings: {
    humans: [11_101, 11_102, 11_103, 11_104, 11_105, 11_106, 11_107, 11_108, 11_109, 11_110, 11_111, 11_112],
    rocktal: [12_101, 12_102, 12_103, 12_104, 12_105, 12_106, 12_107, 12_108, 12_109, 12_110, 12_111, 12_112],
    mechas: [13_101, 13_102, 13_103, 13_104, 13_105, 13_106, 13_107, 13_108, 13_109, 13_110, 13_111, 13_112],
    kaelesh: [14_101, 14_102, 14_103, 14_104, 14_105, 14_106, 14_107, 14_108, 14_109, 14_110, 14_111, 14_112],
    none: []
  },
  researches: {
    humans: [11_201, 11_202, 11_203, 11_204, 11_205, 11_206, 11_207, 11_208, 11_209, 11_210, 11_211, 11_212, 11_213, 11_214, 11_215, 11_216, 11_217, 11_218],
    rocktal: [12_201, 12_202, 12_203, 12_204, 12_205, 12_206, 12_207, 12_208, 12_209, 12_210, 12_211, 12_212, 12_213, 12_214, 12_215, 12_216, 12_217, 12_218],
    mechas: [13_201, 13_202, 13_203, 13_204, 13_205, 13_206, 13_207, 13_208, 13_209, 13_210, 13_211, 13_212, 13_213, 13_214, 13_215, 13_216, 13_217, 13_218],
    kaelesh: [14_201, 14_202, 14_203, 14_204, 14_205, 14_206, 14_207, 14_208, 14_209, 14_210, 14_211, 14_212, 14_213, 14_214, 14_215, 14_216, 14_217, 14_218],
    none: []
  }
};
const researches = {
  all: [106, 108, 109, 110, 111, 113, 114, 115, 117, 118, 120, 121, 122, 123, 124, 199]
};
const units = {
 defences: {
    all: [
      401, 402, 403, 404, 405, 406, 407, 408,
      502, 503
    ]
  },
  ships: {
    all: [202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 217, 218, 219],
    statics: [212, 217]
  }
};
const resources = {
  producers: [
    1, 2, 3, 4, 12,
    11_101, 11_102,
    12_101, 12_102,
    13_101, 13_102,
    14_101, 14_102
  ],
  increasers: [
    11_106, 11_108, 11_202, 11_208,
    12_106, 12_109, 12_110, 12_202, 12_203, 12_205, 12_207, 12_210, 12_211, 12_212,
    13_110, 13_201, 13_206, 13_213,
    14_202, 14_212
  ],
  enhancers: [
    11_111,
    12_213, 12_218,
    13_107, 13_111
  ]
};
const planet = {
};
const moon = {
};

lifeforms$1.buildings.all = [...lifeforms$1.buildings.humans, ...lifeforms$1.buildings.rocktal, ...lifeforms$1.buildings.mechas, ...lifeforms$1.buildings.kaelesh];
lifeforms$1.researches.all = [...lifeforms$1.researches.humans, ...lifeforms$1.researches.rocktal, ...lifeforms$1.researches.mechas, ...lifeforms$1.researches.kaelesh];
lifeforms$1.all = [...lifeforms$1.buildings.all, ...lifeforms$1.researches.all];
upgradables.planet = [...mines.all, ...buildings.planet, ...lifeforms$1.all];
upgradables.moon = [...buildings.moon];
units.all = [...units.ships.all, ...units.defences.all];
units.ships.planet = units.ships.all;
units.ships.moon = units.ships.planet.filter(id => id !== 217);
units.planet = [...units.ships.planet, ...units.defences.all];
units.moon = [...units.ships.moon, ...units.defences.all];
units.statics = [...units.defences.all, ...units.ships.statics];
planet.all = [...upgradables.planet, ...units.planet];
moon.all = [...upgradables.moon, ...units.moon];

var IDs = {
  planet,
  moon,
  upgradables,
  mines,
  buildings,
  lifeforms: lifeforms$1,
  researches,
  units,
  resources
};

const boosters = {
  'b29918a7d1f313fd91d788c9c444dfbe996640ee': ['metal', .4],
  'ce3bb161706f1788c893b3196834d67102318866': ['metal', .4],
  'e17ff7930eb79c7207502348180a2b4a437474d4': ['metal', .4],
  '780aa9d6619ae572a318dacc29e7bb77ad980380': ['metal', .3],
  '9132f52e224e6ba87677e5ccc5cd1391320cf7d2': ['metal', .3],
  'a0cba1aa5de23e877b10b196f40855bafc91256c': ['metal', .3],
  '1ab70d0954b4ebbb91e020c60afbaacb28707e5d': ['metal', .2],
  '5e62926be58e94ebb28a231ecad87f8e852d0f6d': ['metal', .2],
  '2e4d16cdaec1ea8ba2af28c914bb80f4d0939ce3': ['metal', .2],
  'cea22d098a0b48c8960101e05c0bd2a7fadc72c5': ['metal', .1],
  '5650071c78c9fcf9681fc2c780694de96de29c1b': ['crystal', .4],
  'd3f3321fcd999f657e9dc4ccf9cb34731524123f': ['crystal', .4],
  '5e33a2cfb73e9054540c5172f66b770b28765475': ['crystal', .4],
  '206bc65589c10c31b645c34991c12fc8556165b2': ['crystal', .3],
  '627957046e2d5315bf13104e258ca0ea37ca7489': ['crystal', .3],
  '11d508fc74f136dde21fe9506cad6db3d43149d5': ['crystal', .3],
  'a703be5a40a8fe8128466721f5f925ae1e86d13a': ['crystal', .2],
  '2746f4d2372da032f4daa294606ee88e5ca7a46a': ['crystal', .2],
  '60a0fee6f82b2b4cec6928c1b052ac586f0b2a0d': ['crystal', .2],
  '286f3eaf6072f55d8858514b159d1df5f16a5654': ['crystal', .1],
  '7a10926f00a92b563713ade10f89777a98efd96c': ['deuterium', .4],
  'd9b86d155a459c658cb7bfca594ce4b48e24546b': ['deuterium', .4],
  '55966a0911221acfc9b7a88791a2846f659a1e29': ['deuterium', .4],
  'db408084e3b2b7b0e1fe13d9f234d2ebd76f11c5': ['deuterium', .3],
  '9f8eab23fd888c7d3c5a07e0d250a66f017ecec7': ['deuterium', .3],
  '4c7de7803df3ccb01d546ebce9e71379b1c49719': ['deuterium', .3],
  'd5c2ed6852d80e61359aef62171ec7c932fc3bd7': ['deuterium', .2],
  '14a51990fe394912463be7a591b8c3fd41a47aad': ['deuterium', .2],
  'b4c6a0e05891b6bfd9509bd92b6653d61fdae8e5': ['deuterium', .2],
  'f0e514af79d0808e334e9b6b695bf864b861bdfa': ['deuterium', .1]
};
function getBodyBoostersBonuses(ids) {
  const result = {
    metal: 0,
    crystal: 0,
    deuterium: 0
  };
  for (const id of ids) {
    const booster = boosters[id];
    if (booster) {
      const [key, value] = booster;
      result[key] = value;
    }
  }
  return result;
}
function getCoordinates(string) {
  // The previous method does not work with Infinity under Firefox because square brackets are not always present around coordinates.
  // return string.slice(1, -1);
  return string.replace(/[^0-9:]/g, '');
}

var Shared$1 = {
  getBodyBoostersBonuses,
  getCoordinates
};

function getPositions$1() {
  const type = planetType && 'moon' || 'planet';
  const result = {};
  for (const element of document.querySelectorAll('.planet:not(.summary)')) {
    const coordinates = Shared$1.getCoordinates(element.querySelector('.planetData .coords').textContent);
    result[coordinates] = {
      [type]: getBody(element, type)
    };
  }
  return result;
}
function getBody(element, type) {
  const result = {
    type,
    id: getBodyID$1(element),
    name: getBodyName$1(element),
    fields: getBodyFields$1(element),
    technologies: getTechnologies$1(element.querySelectorAll('.values:not(.items, .resources, .storage, .research) > div'))
  };
  if (type === 'planet') {
    result.position = parseInt(element.querySelector('.coords').textContent.split(':').pop());
    result.temperature = getBodyTemperature$1(element);
    result.resources = getBodyResources$1(element);
    result.boosters = getBodyBoosters$1(element);
  }
  return result;
}
function getBodyID$1(element) {
  return parseInt(element.id.match(/\d+/g)[0]);
}
function getBodyName$1(element) {
  return element.querySelector('.planetname').textContent;
}
function getBodyFields$1(element) {
  const [used, maximum] = element.querySelector('.fields').textContent.match(/\d+/g);
  return {
    used: parseInt(used),
    maximum: parseInt(maximum)
  };
}
function getBodyTemperature$1(element) {
  const { textContent } = element.querySelector('.planetDataBottom');
  const [minimum, maximum] = textContent.match(/-?\d+/g);
  return parseInt(maximum);
}
function getBodyResources$1(element) {
  const result = {};
  if (!planetType) {
    result.energy = getBodyEnergy(element);
  }
  return result;
}
function getBodyEnergy(element) {
  const { textContent } = element.querySelector('.planetData :is(.neutral, .undermark, .overmark)');
  return Types.getNumber(textContent);
}
function getBodyBoosters$1(element) {
  const ids = [];
  for (const item of element.querySelectorAll('.item_img')) {
    ids.push(item.style.background.substring(26, 66));
  }
  return Shared$1.getBodyBoostersBonuses(ids);
}
function getTechnologies$1(elements) {
  const result = {};
  for (const element of elements) {
    const id = parseInt(element.classList[0]);
    const value = Types.getNumber(element.firstChild.textContent);
    const upgrade = getTechnologyUpgrade$1(element, id, value);
    const upgraded = value + upgrade;
    result[id] = {
      value,
      upgrade,
      upgraded
    };
  }
  return result;
}
function getTechnologyUpgrade$1(element, id, currentLevel) {
  if (IDs.units.all.includes(id)) {
    return getUnitUpgrade$1(element);
  } else {
    return getUpgradeableUpgrade$1(element, currentLevel);
  }
}
function getUnitUpgrade$1(element) {
  let result = 0;
  for (const { textContent } of element.querySelectorAll('.active, .loop')) {
    result += parseInt(textContent);
  }
  return result;
}
function getUpgradeableUpgrade$1(element, currentLevel) {
  const targetLevel = parseInt(element.querySelector('.active')?.textContent) || 0;
  return Math.max(0, targetLevel - currentLevel);
}

var Empire$1 = {
  getPositions: getPositions$1,
  getTechnologies: getTechnologies$1
};

const classes = {
  player: {
    miner: 'miner',
    warrior: 'warrior',
    explorer: 'explorer'
  },
  alliance: {
    trader: 'trader',
    warrior: 'warrior',
    explorer: 'researcher'
  }
};
const lifeforms = [
  'humans',
  'rocktal',
  'mechas',
  'kaelesh'
];
const miniatures$1 = {
  '60555c3c87b9eb3b5ddf76780b5712': 202,
  '9e24203ce8e9723008272d51786780': 202,
  'fdbcc505474e3e108d10a3ed4a19f4': 203,
  'f38c9fcab7e958698a7f8013b3cc3e': 203,
  '9ed5c1b6aea28fa51f84cdb8cb1e7e': 204,
  '9091972f8d216eb9ab0b01b31065ff': 204,
  '8266a2cbae5ad630c5fedbdf270f3e': 205,
  'a5931e3e4a1609da1bfe4ea7984758': 205,
  'b7ee4f9d556a0f39dae8d2133e05b7': 206,
  '26d5b34d33384155d541f8e3a56bd0': 206,
  '3f4a081f4d15662bed33473db53d5b': 207,
  '04ae451ca1bbf437b04dcb1689e7ac': 207,
  '41a21e4253d2231f8937ddef1ba43e': 208,
  '875d71d6af78f83966b16fc806f398': 208,
  '6246eb3d7fa67414f6b818fa79dd9b': 209,
  '6bf35a0f61e69a466a0a4691a8e089': 209,
  '347821e80cafc52aec04f27c3a2a4d': 210,
  '4b46516da39af486f25103faacaeae': 210,
  '4d55a520aed09d0c43e7b962f33e27': 211,
  'da0705b3be831864ffa2b5a91d630d': 211,
  '665c65072887153d44a6684ec276e9': 212,
  '5f3ca7e91fc0a9b1ee014c3c01ea41': 212,
  'c2b9fedc9c93ef22f2739c49fbac52': 213,
  '6ba84c9dfcfff57452dcaf77d8f722': 213,
  '155e9e24fc1d34ed4660de8d428f45': 214,
  '6be8cd7c88e3c5510e8a9d8ca64daa': 214,
  '24f511ec14a71e2d83fd750aa0dee2': 215,
  '07f6bd1320f406d474639b7f1f499c': 215,
  '28e8d79a5b489dc795cc47f3adf165': 217,
  'a31e24320e2814bc93a4ebef8f55b4': 217,
  '12d016c8bb0d71e053b901560c17cc': 218,
  '1febaddff40e056ce9bf0c1ac930f8': 218,
  'b8d8d18f2baf674acedb7504c7cc83': 219,
  '56a8934f9a63b45d1294eea63767e5': 219,
  '4c4fbd313bc449e16f5212f23d6311': 401,
  'b5d139528cdf1233e61bd58184e1c5': 401,
  '68e11c389f7f62134def76575b27e5': 402,
  '34b3f95bf2d4e3355fed09a3e1877e': 402,
  '3adede7d38b3ecfc7457375a4cd2a5': 403,
  '9d88c2d9b8e5872bef32a7f8659695': 403,
  '2e7227f88e3601612093ee2e9101e0': 404,
  '0fc6c29d06858b5b9ca0b0a4d1532e': 404,
  '2add2bd4bf0cbcf07f779bf85d43cc': 405,
  '4dd51eeb4ab03af617828169bffd5b': 405,
  'ceed170b2583498228e9ab6b087af1': 406,
  'ea3e0adf01fb3cf64e1938a7c55dfb': 406,
  '58390eb6945e04861c99eb311366cc': 407,
  '4d20894a828929ff5a61f62c757149': 407,
  '1c77121b235b5a9e9591c7c78883d3': 408,
  '533c32ff26f4db6857e3e41c09d443': 408,
  'fb4e438cabd12ef1b0500a0f41abc1': 502,
  '40a392214240328e42014108815526': 502,
  '36221e9493458b9fcc776bf350983e': 503,
  '2cf0473c0bb2e5cf3135358ccc4edf': 503
};

async function get$9() {
  for (let i = 0; i < 5; i++) {
    try {
      const result = {
        player: getPlayer(),
        universe: getUniverse()
      };
      console.log('InfoCompte: Data has been scraped with success', result);
      return result;
    } catch(error) {
      console.warn('InfoCompte: An error occurred while scraping data (see below). The script will retry in an instant');
      console.error(error);
      await new Promise(resolve => setTimeout(resolve, 1_000));
    }
  }
  console.warn('InfoCompte: Data scraping failed');
}
function getPlayer() {
  return {
    name: document.querySelector('[name=ogame-player-name]').content,
    class: getClass$1(),
    officers: getOfficers(),
    lifeforms: getLifeforms(),
    researches: getResearches(),
    positions: getPositions(),
    alliance: {
      class: getAllianceClass()
    },
    points: {
      total: getTotalPoints()
    }
  };
}
function getClass$1() {
  if (currentPage !== 'empire') {
    let result = null;
    for (const key in classes.player) {
      if (document.querySelector(`#characterclass .${ key }`)) {
        result = classes.player[key];
        break;
      }
    }
    return result;
  }
}
function getOfficers() {
  if (currentPage !== 'empire') {
    const result = {
      commander: true,
      admiral: true,
      engineer: true,
      geologist: true,
      technocrat: true
    };
    for (const key in result) {
      if (!document.querySelector(`#officers .on.${ key }`)) {
        result[key] = false;
        result.all = false;
      }
      result.all ??= true;
    }
    return result;
  }
}
function getLifeforms() {
  if (currentPage === 'lfsettings') {
    const result = {};
    for (const element of document.querySelectorAll('.lifeform-item')) {
      const icon = element.querySelector('.lifeform-item-icon');
      const p = element.querySelector('.lifeform-item-wrapper p:nth-last-of-type(2)');
      const key = getLifeformKey(icon.classList[1]);
      const values = p.textContent.match(/\d+/g) || [100, 4_545_000, 4_545_000]; // Lifeform level 100 management
      result[key] = {
        level: parseInt(values[0]),
        xp: {
          current: parseInt(values[1]),
          maximum: parseInt(values[2])
        }
      };
    }
    return result;
  }
}
function getResearches() {
  if (currentPage === 'empire') {
    const planet = document.querySelector('.planet:not(.summary)');
    const researches = planet.querySelectorAll('.research > div');
    return Empire$1.getTechnologies(researches);
  } else if (currentPage === 'research') {
    return getTechnologies();
  }
}
function getPositions() {
  if (currentPage === 'empire') {
    return Empire$1.getPositions();
  } else {
    const result = getPlanetListPositions();
    setBody$1(result);
    return result;
  }
}
function getPlanetListPositions() {
  const result = {};
  for (const element of document.querySelectorAll('#planetList .smallplanet')) {
    const coordinates = Shared$1.getCoordinates(element.querySelector('.planet-koords').textContent);
    const moon = element.querySelector('.moonlink');
    result[coordinates] = {
      planet: {
        type: 'planet',
        id: getBodyID(element.querySelector('.planetlink')),
        name: getBodyName(element.querySelector('.planetPic')),
        position: getBodyPosition(coordinates)
      },
      moon: moon && {
        type: 'moon',
        id: getBodyID(element.querySelector('.moonlink')),
        name: getBodyName(moon.querySelector('.icon-moon'))
      } || null
    };
  }
  return result;
}
function setBody$1(positions) {
  const coordinates = document.querySelector('[name=ogame-planet-coordinates]').content;
  const type = document.querySelector('[name=ogame-planet-type]').content;
  const body = positions[coordinates][type];
  body.fields = getBodyFields();
  body.technologies = getBodyTechnologies();
  if (body.type === 'planet') {
    body.lifeform = getBodyLifeform();
    body.temperature = getBodyTemperature();
    body.boosters = getBodyBoosters();
    body.productions = getBodyProductions();
    body.resources = getBodyResources();
    body.technologies = getBodyTechnologies();
  }
}
function getBodyID(element) {
  return parseInt(new URL(element.href).searchParams.get('cp'));
}
function getBodyName(element) {
  return element.alt;
}
function getBodyPosition(coordinates) {
  return parseInt(coordinates.split(':').pop());
}
function getBodyLifeform() {
  return {
    species: getBodyLifeformSpecies(),
    researches: getBodyLifeformResearches()
  };
}
function getBodyLifeformSpecies() {
  if (document.querySelector('#lifeform')) {
    for (const key of ['lifeform1', 'lifeform2', 'lifeform3', 'lifeform4']) {
      if (document.querySelector(`#lifeform .${ key }`)) {
        return getLifeformKey(key);
      }
    }
    return 'none';
  }
}
function getBodyLifeformResearches() {
  if (currentPage === 'lfresearch') {
    const result = [];
    for (const element of document.querySelectorAll('#technologies .hasDetails')) {
      const id = parseInt(element.dataset.technology);
      result.push(id);
    }
    return result;
  }
}
function getLifeformKey(string) {
  const index = parseInt(string.slice(-1)) - 1;
  return lifeforms[index];
}
function getBodyFields() {
  if (currentPage === 'overview') {
    const [used, maximum] = textContent[1].match(/\d+(?=\D+?\/)|(?<=\/\D+?)\d+/g);
    return {
      used: parseInt(used),
      maximum: parseInt(maximum)
    };
  }
}
function getBodyTemperature() {
  if (currentPage === 'overview') {
    const [minimum, maximum] = textContent[3].match(/-?\d+/g);
    return parseInt(maximum);
  }
}
function getBodyBoosters() {
  const elements = document.querySelectorAll('#buffBar img');
  if (elements) {
    const ids = [];
    for (const { src } of elements) {
      ids.push(src.substring(56, 96));
    }
    return Shared$1.getBodyBoostersBonuses(ids);
  }
}
function getBodyProductions() {
  const element = document.querySelector('.listOfResourceSettingsPerPlanet');
  if (element) {
    const result = {
      basic: getBodyProductionValues(element.querySelector('.alt')),
      mines: {
        metal: getBodyProductionValues(element.querySelector('.\\31')),
        crystal: getBodyProductionValues(element.querySelector('.\\32')),
        deuterium: getBodyProductionValues(element.querySelector('.\\33'))
      },
      fusion:  getBodyProductionValues(element.querySelector('.\\31 2')),
      lifeforms: getBodyLifeformProductions(element.querySelectorAll('.\\31 2 ~ tr')),
      crawlers: getBodyProductionValues(element.querySelector('.\\32 17')),
      plasma: getBodyProductionValues(element.querySelector('.\\31 22')),
      objects: getBodyProductionValues(element.querySelector('.\\31 000')),
      geologist: getBodyProductionValues(element.querySelector('.\\31 001')),
      officers: getBodyProductionValues(element.querySelector('.\\31 003')),
      classes: {
        player: getBodyProductionValues(element.querySelector('.\\31 004')),
        alliance: getBodyProductionValues(element.querySelector('.\\31 005')),
      },
      total: getBodyProductionValues(element.querySelector('.summary'))
    };
    result.mines.total = {
      metal: result.mines.metal.metal,
      crystal: result.mines.crystal.crystal,
      deuterium: result.mines.deuterium.deuterium,
      factor: null
    };
    result.premium = {
      metal: result.objects.metal + result.geologist.metal + result.officers.metal,
      crystal: result.objects.crystal + result.geologist.crystal + result.officers.crystal,
      deuterium: result.objects.deuterium + result.geologist.deuterium + result.officers.deuterium,
      factor: null
    };
    result.classes.total = {
      metal: result.classes.player.metal + result.classes.alliance.metal,
      crystal: result.classes.player.crystal + result.classes.alliance.crystal,
      deuterium: result.classes.player.deuterium + result.classes.alliance.deuterium,
      factor: null
    };
    return result;
  }
}
function getBodyLifeformProductions(elements) {
  const result = {
    metal: 0,
    crystal: 0,
    deuterium: 0,
    factor: null
  };
  for (const element of elements) {
    const id = parseInt(element.classList[element.classList.length - 1]);
    if (id > 1_005) {
      const { metal, crystal, deuterium } = getBodyProductionValues(element);
      result.metal += metal;
      result.crystal += crystal;
      result.deuterium += deuterium;
    }
  }
  return result;
}
function getBodyProductionValues(element) {
  const elements = element.querySelectorAll('td:nth-last-child(-n+5)');
  return {
    metal: getBodyProductionValue(elements[0]),
    crystal: getBodyProductionValue(elements[1]),
    deuterium: getBodyProductionValue(elements[2]),
    factor: getBodyProductionFactor(elements[4])
  };
}
function getBodyProductionValue(element) {
  // before update 11.15:
  // const span = element.querySelector('span');
  // const value = span.title || span.dataset.tooltipTitle || span.dataset.title;
  const value = element.querySelector('span').dataset.tooltipTitle;
  return Types.getNumber(value);
}
function getBodyProductionFactor(element) {
  let result = null;
  if (element.childElementCount) {
    // management of alternative drop downs
    const value = element.querySelector('a')?.dataset.value
               || element.querySelector('option:checked').value;
    result = parseInt(value) * .01;
  }
  return result;
}
function getBodyResources() {
  return {
    energy: resourcesBar.resources.energy.amount
  };
}
function getBodyTechnologies() {
  const hasTechnologies = document.querySelector('#technologies');
  const isResearch = currentPage === 'research';
  if (hasTechnologies && !isResearch) {
    return getTechnologies();
  }
}
function getTechnologies() {
  const result = {};
  for (const element of document.querySelectorAll('#technologies .hasDetails')) {
    const id = parseInt(element.dataset.technology);
    const value = parseInt(element.querySelector('.level, .amount').dataset.value);
    const upgrade = getTechnologyUpgrade(element, id, value);
    const upgraded = value + upgrade;
    result[id] = {
      value,
      upgrade,
      upgraded
    };
  }
  return result;
}
function getTechnologyUpgrade(element, id, currentLevel) {
  if (IDs.units.all.includes(id)) {
    return getUnitUpgrade(element, id);
  } else {
    return getUpgradeableUpgrade(element, currentLevel);
  }
}
function getUnitUpgrade(element, id) {
  let result = 0;
  for (const element of document.querySelectorAll(':is(#productionboxshipyardcomponent, #productionboxextendedshipyardcomponent) :is(.first, .queue td)')) {
    const key = element.querySelector('img').src.substring(32, 62);
    if (miniatures$1[key] === id) {
      result += parseInt(element.textContent);
    }
  }
  return result;
}
function getUpgradeableUpgrade(element, currentLevel) {
  const targetLevel = parseInt(element.querySelector('.targetlevel')?.dataset.value) || 0;
  return Math.max(0, targetLevel - currentLevel);
}
function getAllianceClass() {
  if (currentPage === 'alliance' && alliance.tab !== 'createNewAlliance') {
    const element = document.querySelector('.alliance_class');
    let result = null;
    for (const key in classes.alliance) {
      if (element.classList.contains(key)) {
        result = classes.alliance[key];
        break;
      }
    }
    return result;
  }
}
function getTotalPoints() {
  if (currentPage === 'overview') {
    const [value] = textContent[7].match(/(?<=\>).*?(?=\s)/);
    return Types.getNumber(value);
  }
}
function getUniverse() {
  return {
    language: document.querySelector('[name=ogame-language]').content,
    name: document.querySelector('[name=ogame-universe-name]').content,
    speed: parseInt(document.querySelector('[name=ogame-universe-speed]').content),
    highscores: getUniverseHighscores()
  };
}
function getUniverseHighscores() {
  if (currentPage === 'highscore') {
    return {
      [currentCategory]: {
        [currentType]: {
          players: getPlayersHighscore(),
          player: getPlayerScore()
        }
      }
    };
  }
}
function getPlayersHighscore() {
  // firstChild property of score element is used for compatibility reason with OGLight
  const result = {};
  for (const element of document.querySelectorAll('#ranks tbody tr')) {
    const position = element.querySelector('.position');
    const score = element.querySelector('.score');
    const value = Types.getNumber(score.firstChild.textContent);
    let key = parseInt(position.textContent);
    if (!key) {
      // used for top three places management where there is no text
      key = Array.prototype.indexOf.call(element.parentNode.children, element) + 1;
    }
    result[key] = value;
  }
  return result;
}
function getPlayerScore() {
  // firstChild property of score element is used for compatibility reason with OGLight
  const element = document.querySelector('#ranks .myrank');
  if (element) {
    const position = element.querySelector('.position');
    const score = element.querySelector('.score');
    return {
      position: parseInt(position.textContent),
      points: Types.getNumber(score.firstChild.textContent)
    };
  }
}
function elementHasChanged(selector) {
  return new Promise(function(resolve) {
    const observer = new MutationObserver(function() {
      observer.disconnect();
      resolve();
    });
    observer.observe(document.querySelector(selector), {
      childList: true,
      subtree: true
    });
  });
}

var Scraper = {
  get: get$9,
  elementHasChanged
};

var Colors = {
  main: '#6f9fc8',
  mines: '#eb782d',
  planetBuildings: '#9c3d00',
  moonBuildings: '#83919c',
  lifeformBuildings: '#6c56a3',
  lifeformResearches: '#95559f',
  researches: '#0077b6',
  defences: '#16bd05',
  ships: '#e30613',
  crawlers: '#eb782d',
  upgrade: '#ffd700',
  metal: '#a9a9a9',
  crystal: '#8dceec',
  deuterium: '#6cc6a3'
};

function set$5(data) {
  setScript(data);
  setClass(data);
  setOfficers(data);
  setLifeforms(data);
  setResearches(data);
  setPositions(data);
  setAllianceClass(data);
  setTotalPoints(data);
  setUniverseHighscores(data);
}
function setScript(data) {
  if (data.script === undefined) {
    data.script = {
      amortizations: {
        form: {
          metalMine: true,
          crystalMine: true,
          deuteriumMine: true,
          lifeformBuildings: true,
          lifeformResearches: true,
          plasma: true
        }
      },
      collapsibles: {
      },
      colors: {
      },
      needed: {
        empire: {
        },
        lifeforms: {
          researches: []
        },
        productions: []
      },
      rates: {
        metal: 2,
        crystal: 1.5,
        deuterium: 1,
        unit: 'metal'
      },
      useCompactNumbers: true
    };
    setScriptColors(data.script);
  }
}
function setScriptColors(data) {
  for (const key in Colors) {
    data.colors[key] = Colors[key];
  }
  delete data.colors.main;
  delete data.colors.crawlers;
  delete data.colors.upgrade;
}
function setClass(data) {
  const { player } = data;
  if (player.class === undefined) {
    player.class = null;
  }
}
function setOfficers(data) {
  const { player } = data;
  if (player.officers === undefined) {
    player.officers = {
      commander: false,
      admiral: false,
      engineer: false,
      geologist: false,
      technocrat: false
    };
  }
}
function setLifeforms(data) {
  const { player, script } = data;
  if (player.lifeforms === undefined) {
    const lifeforms = player.lifeforms = {};
    for (const id of ['humans', 'rocktal', 'mechas', 'kaelesh', 'none']) {
      lifeforms[id] = {
        level: 0,
        xp: {
          current: 0,
          maximum: 0
        }
      };
    }
    script.needed.lifeforms.settings = true;
  }
}
function setResearches(data) {
  const { player, script } = data;
  if (player.researches === undefined) {
    const researches = player.researches = {};
    for(const id of IDs.researches.all) {
      researches[id] ||= {
        value: 0,
        upgrade: 0,
        upgraded: 0
      };
    }
    script.needed.empire.planet = true;
  }
}
function setPositions(data) {
  const { player, script } = data;
  const { positions } = player;
  for (const coordinates in positions) {
    const { planet, moon } = positions[coordinates];
    setBody(planet, script);
    if (moon) {
      setBody(moon, script);
    }
  }
}
function setBody(body, script) {
  setBodyFields(body, script);
  setBodyTechnologies(body, script);
  if (body.type === 'planet') {
    setBodyLifeform(body, script);
    setBodyTemperature(body, script);
    setBodyResources(body, script);
    setBodyBoosters(body, script);
    setBodyProductions(body, script);
  }
}
function setBodyLifeform(body, script) {
  body.lifeform ||= {};
  if (body.lifeform.species === undefined) {
    body.lifeform.species = null;
  }
  if (body.lifeform.researches === undefined) {
    body.lifeform.researches = [];
    script.needed.lifeforms.researches.push([body.id, body.name]);
  }
}
function setBodyFields(body, script) {
  if (body.fields === undefined) {
    body.fields = {
      used: 0,
      maximum: 0
    };
    script.needed.empire[body.type] = true;
  }
}
function setBodyTemperature(body, script) {
  if (body.temperature === undefined) {
    body.temperature = 50;
    script.needed.empire[body.type] = true;
  }
}
function setBodyResources(body, script) {
  if (body.resources === undefined) {
    body.resources = {
      energy: 0
    };
    script.needed.empire[body.type] = true;
  }
}
function setBodyBoosters(body, script) {
  if (body.boosters === undefined) {
    body.boosters = {
      metal: 0,
      crystal: 0,
      deuterium: 0
    };
    script.needed.empire[body.type] = true;
  }
}
function setBodyProductions(body, script) {
  if (body.productions === undefined) {
    body.productions = {
      basic: {
        metal: 0,
        crystal: 0,
        deuterium: 0
      },
      mines: {
        metal: {
          metal: 0,
          crystal: 0,
          deuterium: 0
        },
        crystal: {
          metal: 0,
          crystal: 0,
          deuterium: 0
        },
        deuterium: {
          metal: 0,
          crystal: 0,
          deuterium: 0
        },
        total: {
          metal: 0,
          crystal: 0,
          deuterium: 0
        }
      },
      fusion: {
        metal: 0,
        crystal: 0,
        deuterium: 0,
        factor: 1
      },
      lifeforms: {
        metal: 0,
        crystal: 0,
        deuterium: 0
      },
      crawlers: {
        metal: 0,
        crystal: 0,
        deuterium: 0,
        factor: 1
      },
      plasma: {
        metal: 0,
        crystal: 0,
        deuterium: 0
      },
      objects: {
        metal: 0,
        crystal: 0,
        deuterium: 0
      },
      geologist: {
        metal: 0,
        crystal: 0,
        deuterium: 0
      },
      officers: {
        metal: 0,
        crystal: 0,
        deuterium: 0
      },
      classes: {
        player: {
          metal: 0,
          crystal: 0,
          deuterium: 0
        },
        alliance: {
          metal: 0,
          crystal: 0,
          deuterium: 0
        },
        total: {
          metal: 0,
          crystal: 0,
          deuterium: 0
        }
      },
      premium: {
        metal: 0,
        crystal: 0,
        deuterium: 0
      },
      total: {
        metal: 0,
        crystal: 0,
        deuterium: 0
      }
    };
    script.needed.productions.push([body.id, body.name]);
  }
}
function setBodyTechnologies(body, script) {
  body.technologies ||= {};
  for(const id of IDs[body.type].all) {
    if (body.technologies[id] === undefined) {
      body.technologies[id] ||= {
        value: 0,
        upgrade: 0,
        upgraded: 0
      };
      script.needed.empire[body.type] = true;
    }
  }
}
function setAllianceClass(data) {
  const { player, script } = data;
  if (player.alliance.class === undefined) {
    player.alliance.class = null;
    script.needed.alliance = true;
  }
}
function setTotalPoints(data) {
  const { player } = data;
  if (player.points.total === undefined) {
    player.points.total = 0;
  }
}
function setUniverseHighscores(data) {
  const { universe, script } = data;
  if (universe.highscores === undefined) {
    script.needed.highscores = true;
  }
}

var Defaults = {
  set: set$5
};

function set$4(data) {
  if (currentPage === 'highscore') {
    const highscore = data.universe.highscores[1][0];
    if (highscore.player) {
      const indestructibles = data.player.points.values.indestructibles;
      const upgrades = data.player.points.values.upgrades;
      const upgraded = highscore.player.points + upgrades;
      const movements = highscore.player.movements = {
        ifDestroyed: 0,
        whenUpgraded: 0
      };
      for (const key in highscore.players) {
        const value = highscore.players[key];
        if (value < highscore.player.points) {
          if (value > indestructibles) {
            movements.ifDestroyed = parseInt(key) - highscore.player.position;
          } else break;
        }
      }
      for (const key in highscore.players) {
        const value = highscore.players[key];
        if (value > highscore.player.points) {
          if (value < upgraded) {
            movements.whenUpgraded = highscore.player.position - parseInt(key);
            break;
          }
        } else break;
      }
    }
  }
}

var Highscore = {
  set: set$4
};

function clean$1(data) {
  const { positions } = data.player;
  const { needed } = data.script;
  const id = parseInt(document.querySelector('[name=ogame-planet-id]').content);
  cleanObsoleteData(needed, positions);
  cleanEmpire(needed);
  cleanLifeforms(needed, id);
  cleanProductions(needed, id);
  cleanAllianceClass(needed);
  cleanHighscores(needed);
}
function cleanObsoleteData(data, positions) {
  cleanObsoleteIDs(data.lifeforms.researches, positions);
  cleanObsoleteIDs(data.productions, positions);
}
function cleanObsoleteIDs(array, positions) {
  const result = [];
  for (const [id] of array) {
    const element = Object.values(positions).find(({ planet, moon }) => planet.id === id || moon?.id === id);
    if (!element) {
      result.push(id);
    }
  }
  for (const id of result) {
    removeFromArray(array, id);
  }
}
function cleanEmpire(data) {
  if (currentPage === 'empire') {
    if (planetType) {
      data.empire.moon = false;
    } else {
      data.empire.planet = false;
    }
  }
}
function cleanLifeforms(data, id) {
  cleanLifeformResearches(data, id);
  cleanLifeformSettings(data);
}
function cleanLifeformResearches(data, id) {
  if (currentPage === 'lfresearch' || (currentPage === 'lfsettings' && !document.querySelector('#lifeform .lifeform-item-icon'))) {
    removeFromArray(data.lifeforms.researches, id);
  }
}
function cleanLifeformSettings(data) {
  if (currentPage === 'lfsettings' && document.querySelector('#lifeform .lifeform-item-icon')) {
    data.lifeforms.settings = false;
  }
}
function cleanProductions(data, id) {
  if (currentPage === 'resourcesettings') {
    removeFromArray(data.productions, id);
  }
}
function cleanAllianceClass(data) {
  if (currentPage === 'alliance') {
    data.alliance = false;
  }
}
function cleanHighscores(data) {
  if (currentPage === 'highscore') {
    data.highscores = false;
  }
}
function removeFromArray(array, id) {
  const index = array.findIndex(element => element[0] === id);
  array.splice(index, 1);
}

var Needed$1 = {
  clean: clean$1
};

class Resources {
  static getSU(resources, rates) {
    return (resources.metal / rates.metal + resources.crystal / rates.crystal + resources.deuterium) * rates[rates.unit];
  }
  constructor(...args) {
    if (args.length === 3) {
      this.metal = args[0];
      this.crystal = args[1];
      this.deuterium = args[2];
    } else if (args.length === 1) {
      this.metal = args[0].metal;
      this.crystal = args[0].crystal;
      this.deuterium = args[0].deuterium;
    } else {
      this.metal = 0;
      this.crystal = 0;
      this.deuterium = 0;
    }
  }
  add(...costs) {
    for (const cost of costs) {
      this.metal += cost.metal;
      this.crystal += cost.crystal;
      this.deuterium += cost.deuterium;
    }
    return this;
  }
  subtract(...costs) {
    for (const cost of costs) {
      this.metal -= cost.metal;
      this.crystal -= cost.crystal;
      this.deuterium -= cost.deuterium;
    }
    return this;
  }
  divide(value) {
    this.metal /= value;
    this.crystal /= value;
    this.deuterium /= value;
    return this;
  }
  multiply(value) {
    this.metal *= value;
    this.crystal *= value;
    this.deuterium *= value;
    return this;
  }
  trunc() {
    this.metal = Math.trunc(this.metal);
    this.crystal = Math.trunc(this.crystal);
    this.deuterium = Math.trunc(this.deuterium);
    return this;
  }
  toPoints() {
    return (this.metal + this.crystal + this.deuterium) * .001;
  }
  toSU(rates) {
    return (this.metal / rates.metal + this.crystal / rates.crystal + this.deuterium) * rates[rates.unit];
  }
}

const Units = {
  202: {
    metal: 2_000,
    crystal: 2_000,
    deuterium: 0
  },
  203: {
    metal: 6_000,
    crystal: 6_000,
    deuterium: 0
  },
  204: {
    metal: 3_000,
    crystal: 1_000,
    deuterium: 0
  },
  205: {
    metal: 6_000,
    crystal: 4_000,
    deuterium: 0
  },
  206: {
    metal: 20_000,
    crystal: 7_000,
    deuterium: 2_000
  },
  207: {
    metal: 45_000,
    crystal: 15_000,
    deuterium: 0
  },
  208: {
    metal: 10_000,
    crystal: 20_000,
    deuterium: 10_000
  },
  209: {
    metal: 10_000,
    crystal: 6_000,
    deuterium: 2_000
  },
  210: {
    metal: 0,
    crystal: 1_000,
    deuterium: 0
  },
  211: {
    metal: 50_000,
    crystal: 25_000,
    deuterium: 15_000
  },
  212: {
    metal: 0,
    crystal: 2_000,
    deuterium: 500
  },
  213: {
    metal: 60_000,
    crystal: 50_000,
    deuterium: 15_000
  },
  214: {
    metal: 5_000_000,
    crystal: 4_000_000,
    deuterium: 1_000_000
  },
  215: {
    metal: 30_000,
    crystal: 40_000,
    deuterium: 15_000
  },
  217: {
    metal: 2_000,
    crystal: 2_000,
    deuterium: 1_000
  },
  218: {
    metal: 85_000,
    crystal: 55_000,
    deuterium: 20_000
  },
  219: {
    metal: 8_000,
    crystal: 15_000,
    deuterium: 8_000
  },
  401: {
    metal: 2_000,
    crystal: 0,
    deuterium: 0
  },
  402: {
    metal: 1_500,
    crystal: 500,
    deuterium: 0
  },
  403: {
    metal: 6_000,
    crystal: 2_000,
    deuterium: 0
  },
  404: {
    metal: 20_000,
    crystal: 15_000,
    deuterium: 2_000
  },
  405: {
    metal: 5_000,
    crystal: 3_000,
    deuterium: 0
  },
  406: {
    metal: 50_000,
    crystal: 50_000,
    deuterium: 30_000
  },
  407: {
    metal: 10_000,
    crystal: 10_000,
    deuterium: 0
  },
  408: {
    metal: 50_000,
    crystal: 50_000,
    deuterium: 0
  },
  502: {
    metal: 8_000,
    crystal: 0,
    deuterium: 2_000
  },
  503: {
    metal: 12_500,
    crystal: 2_500,
    deuterium: 10_000
  },
  getValues(technologies, id) {
    const { value } = technologies[id];
    return Units.get(id, value);
  },
  getUpgrades(technologies, id) {
    const { upgrade } = technologies[id];
    return Units.get(id, upgrade);
  },
  getUpgraded(technologies, id) {
    const { upgraded } = technologies[id];
    return Units.get(id, upgraded);
  },
  get(id, count) {
    const result = new Resources(Units[id]);
    return result.multiply(count);
  }
};
const Upgradables = {
  1: {
    metal: 60,
    crystal: 15,
    deuterium: 0,
    factor: 1.5
  },
  2: {
    metal: 48,
    crystal: 24,
    deuterium: 0,
    factor: 1.6
  },
  3: {
    metal: 225,
    crystal: 75,
    deuterium: 0,
    factor: 1.5
  },
  4: {
    metal: 75,
    crystal: 30,
    deuterium: 0,
    factor: 1.5
  },
  12: {
    metal: 900,
    crystal: 360,
    deuterium: 180,
    factor: 1.8
  },
  14: {
    metal: 400,
    crystal: 120,
    deuterium: 200,
    factor: 2
  },
  15: {
    metal: 1_000_000,
    crystal: 500_000,
    deuterium: 100_000,
    factor: 2
  },
  21: {
    metal: 400,
    crystal: 200,
    deuterium: 100,
    factor: 2
  },
  22: {
    metal: 1_000,
    crystal: 0,
    deuterium: 0,
    factor: 2
  },
  23: {
    metal: 1_000,
    crystal: 500,
    deuterium: 0,
    factor: 2
  },
  24: {
    metal: 1_000,
    crystal: 1_000,
    deuterium: 0,
    factor: 2
  },
  31: {
    metal: 200,
    crystal: 400,
    deuterium: 200,
    factor: 2
  },
  33: {
    metal: 0,
    crystal: 50_000,
    deuterium: 100_000,
    factor: 2
  },
  34: {
    metal: 20_000,
    crystal: 40_000,
    deuterium: 0,
    factor: 2
  },
  36: {
    metal: 200,
    crystal: 0,
    deuterium: 50,
    factor: 5
  },
  41: {
    metal: 20_000,
    crystal: 40_000,
    deuterium: 20_000,
    factor: 2
  },
  42: {
    metal: 20_000,
    crystal: 40_000,
    deuterium: 20_000,
    factor: 2
  },
  43: {
    metal: 2_000_000,
    crystal: 4_000_000,
    deuterium: 2_000_000,
    factor: 2
  },
  44: {
    metal: 20_000,
    crystal: 20_000,
    deuterium: 1_000,
    factor: 2
  },
  106: {
    metal: 200,
    crystal: 1_000,
    deuterium: 200,
    factor: 2
  },
  108: {
    metal: 0,
    crystal: 400,
    deuterium: 600,
    factor: 2
  },
  109: {
    metal: 800,
    crystal: 200,
    deuterium: 0,
    factor: 2
  },
  110: {
    metal: 200,
    crystal: 600,
    deuterium: 0,
    factor: 2
  },
  111: {
    metal: 1_000,
    crystal: 0,
    deuterium: 0,
    factor: 2
  },
  113: {
    metal: 0,
    crystal: 800,
    deuterium: 400,
    factor: 2
  },
  114: {
    metal: 0,
    crystal: 4_000,
    deuterium: 2_000,
    factor: 2
  },
  115: {
    metal: 400,
    crystal: 0,
    deuterium: 600,
    factor: 2
  },
  117: {
    metal: 2_000,
    crystal: 4_000,
    deuterium: 600,
    factor: 2
  },
  118: {
    metal: 10_000,
    crystal: 20_000,
    deuterium: 6_000,
    factor: 2
  },
  120: {
    metal: 200,
    crystal: 100,
    deuterium: 0,
    factor: 2
  },
  121: {
    metal: 1_000,
    crystal: 300,
    deuterium: 100,
    factor: 2
  },
  122: {
    metal: 2_000,
    crystal: 4_000,
    deuterium: 1_000,
    factor: 2
  },
  123: {
    metal: 240_000,
    crystal: 400_000,
    deuterium: 160_000,
    factor: 2
  },
  124: {
    metal: 4_000,
    crystal: 8_000,
    deuterium: 4_000,
    factor: 1.75
  },
  199: {
    metal: 0,
    crystal: 0,
    deuterium: 0,
    factor: 3
  },
  11_101: {
    metal: 7,
    crystal: 2,
    deuterium: 0,
    factor: 1.2
  },
  11_102: {
    metal: 5,
    crystal: 2,
    deuterium: 0,
    factor: 1.23
  },
  11_103: {
    metal: 20_000,
    crystal: 25_000,
    deuterium: 10_000,
    factor: 1.3
  },
  11_104: {
    metal: 5_000,
    crystal: 3_200,
    deuterium: 1_500,
    factor: 1.7
  },
  11_105: {
    metal: 50_000,
    crystal: 40_000,
    deuterium: 50_000,
    factor: 1.7
  },
  11_106: {
    metal: 9_000,
    crystal: 6_000,
    deuterium: 3_000,
    factor: 1.5
  },
  11_107: {
    metal: 25_000,
    crystal: 13_000,
    deuterium: 7_000,
    factor: 1.09
  },
  11_108: {
    metal: 50_000,
    crystal: 25_000,
    deuterium: 15_000,
    factor: 1.5
  },
  11_109: {
    metal: 75_000,
    crystal: 20_000,
    deuterium: 25_000,
    factor: 1.09
  },
  11_110: {
    metal: 150_000,
    crystal: 30_000,
    deuterium: 15_000,
    factor: 1.12
  },
  11_111: {
    metal: 80_000,
    crystal: 35_000,
    deuterium: 60_000,
    factor: 1.5
  },
  11_112: {
    metal: 250_000,
    crystal: 125_000,
    deuterium: 125_000,
    factor: 1.2
  },
  11_201: {
    metal: 5_000,
    crystal: 2_500,
    deuterium: 500,
    factor: 1.3
  },
  11_202: {
    metal: 7_000,
    crystal: 10_000,
    deuterium: 5_000,
    factor: 1.5
  },
  11_203: {
    metal: 15_000,
    crystal: 10_000,
    deuterium: 5_000,
    factor: 1.3
  },
  11_204: {
    metal: 20_000,
    crystal: 15_000,
    deuterium: 7_500,
    factor: 1.3
  },
  11_205: {
    metal: 25_000,
    crystal: 20_000,
    deuterium: 10_000,
    factor: 1.2
  },
  11_206: {
    metal: 35_000,
    crystal: 25_000,
    deuterium: 15_000,
    factor: 1.5
  },
  11_207: {
    metal: 70_000,
    crystal: 40_000,
    deuterium: 20_000,
    factor: 1.3
  },
  11_208: {
    metal: 80_000,
    crystal: 50_000,
    deuterium: 20_000,
    factor: 1.5
  },
  11_209: {
    metal: 320_000,
    crystal: 240_000,
    deuterium: 100_000,
    factor: 1.5
  },
  11_210: {
    metal: 320_000,
    crystal: 240_000,
    deuterium: 100_000,
    factor: 1.5
  },
  11_211: {
    metal: 120_000,
    crystal: 30_000,
    deuterium: 25_000,
    factor: 1.5
  },
  11_212: {
    metal: 100_000,
    crystal: 40_000,
    deuterium: 30_000,
    factor: 1.3
  },
  11_213: {
    metal: 200_000,
    crystal: 100_000,
    deuterium: 100_000,
    factor: 1.3
  },
  11_214: {
    metal: 160_000,
    crystal: 120_000,
    deuterium: 50_000,
    factor: 1.5
  },
  11_215: {
    metal: 160_000,
    crystal: 120_000,
    deuterium: 50_000,
    factor: 1.5
  },
  11_216: {
    metal: 320_000,
    crystal: 240_000,
    deuterium: 100_000,
    factor: 1.5
  },
  11_217: {
    metal: 300_000,
    crystal: 180_000,
    deuterium: 120_000,
    factor: 1.5
  },
  11_218: {
    metal: 500_000,
    crystal: 300_000,
    deuterium: 200_000,
    factor: 1.3
  },
  12_101: {
    metal: 9,
    crystal: 3,
    deuterium: 0,
    factor: 1.2
  },
  12_102: {
    metal: 7,
    crystal: 2,
    deuterium: 0,
    factor: 1.2
  },
  12_103: {
    metal: 40_000,
    crystal: 10_000,
    deuterium: 15_000,
    factor: 1.3
  },
  12_104: {
    metal: 5_000,
    crystal: 3_800,
    deuterium: 1_000,
    factor: 1.7
  },
  12_105: {
    metal: 50_000,
    crystal: 40_000,
    deuterium: 50_000,
    factor: 1.65
  },
  12_106: {
    metal: 10_000,
    crystal: 8_000,
    deuterium: 1_000,
    factor: 1.4
  },
  12_107: {
    metal: 20_000,
    crystal: 15_000,
    deuterium: 10_000,
    factor: 1.2
  },
  12_108: {
    metal: 50_000,
    crystal: 35_000,
    deuterium: 15_000,
    factor: 1.5
  },
  12_109: {
    metal: 85_000,
    crystal: 44_000,
    deuterium: 25_000,
    factor: 1.4
  },
  12_110: {
    metal: 120_000,
    crystal: 50_000,
    deuterium: 20_000,
    factor: 1.4
  },
  12_111: {
    metal: 250_000,
    crystal: 150_000,
    deuterium: 100_000,
    factor: 1.8
  },
  12_112: {
    metal: 250_000,
    crystal: 125_000,
    deuterium: 125_000,
    factor: 1.5
  },
  12_201: {
    metal: 10_000,
    crystal: 6_000,
    deuterium: 1_000,
    factor: 1.5
  },
  12_202: {
    metal: 7_500,
    crystal: 12_500,
    deuterium: 5_000,
    factor: 1.5
  },
  12_203: {
    metal: 15_000,
    crystal: 10_000,
    deuterium: 5_000,
    factor: 1.5
  },
  12_204: {
    metal: 20_000,
    crystal: 15_000,
    deuterium: 7_500,
    factor: 1.3
  },
  12_205: {
    metal: 25_000,
    crystal: 20_000,
    deuterium: 10_000,
    factor: 1.5
  },
  12_206: {
    metal: 50_000,
    crystal: 50_000,
    deuterium: 20_000,
    factor: 1.5
  },
  12_207: {
    metal: 70_000,
    crystal: 40_000,
    deuterium: 20_000,
    factor: 1.5
  },
  12_208: {
    metal: 160_000,
    crystal: 120_000,
    deuterium: 50_000,
    factor: 1.5
  },
  12_209: {
    metal: 75_000,
    crystal: 55_000,
    deuterium: 25_000,
    factor: 1.5
  },
  12_210: {
    metal: 85_000,
    crystal: 40_000,
    deuterium: 35_000,
    factor: 1.5
  },
  12_211: {
    metal: 120_000,
    crystal: 30_000,
    deuterium: 25_000,
    factor: 1.5
  },
  12_212: {
    metal: 100_000,
    crystal: 40_000,
    deuterium: 30_000,
    factor: 1.5
  },
  12_213: {
    metal: 200_000,
    crystal: 100_000,
    deuterium: 100_000,
    factor: 1.2
  },
  12_214: {
    metal: 220_000,
    crystal: 110_000,
    deuterium: 110_000,
    factor: 1.3
  },
  12_215: {
    metal: 240_000,
    crystal: 120_000,
    deuterium: 120_000,
    factor: 1.3
  },
  12_216: {
    metal: 250_000,
    crystal: 250_000,
    deuterium: 250_000,
    factor: 1.4
  },
  12_217: {
    metal: 500_000,
    crystal: 300_000,
    deuterium: 200_000,
    factor: 1.5
  },
  12_218: {
    metal: 300_000,
    crystal: 180_000,
    deuterium: 120_000,
    factor: 1.7
  },
  13_101: {
    metal: 6,
    crystal: 2,
    deuterium: 0,
    factor: 1.21
  },
  13_102: {
    metal: 5,
    crystal: 2,
    deuterium: 0,
    factor: 1.18
  },
  13_103: {
    metal: 30_000,
    crystal: 20_000,
    deuterium: 10_000,
    factor: 1.3
  },
  13_104: {
    metal: 5_000,
    crystal: 3_800,
    deuterium: 1_000,
    factor: 1.8
  },
  13_105: {
    metal: 50_000,
    crystal: 40_000,
    deuterium: 50_000,
    factor: 1.8
  },
  13_106: {
    metal: 7_500,
    crystal: 7_000,
    deuterium: 1_000,
    factor: 1.3
  },
  13_107: {
    metal: 35_000,
    crystal: 15_000,
    deuterium: 10_000,
    factor: 1.5
  },
  13_108: {
    metal: 50_000,
    crystal: 20_000,
    deuterium: 30_000,
    factor: 1.07
  },
  13_109: {
    metal: 100_000,
    crystal: 10_000,
    deuterium: 3_000,
    factor: 1.14
  },
  13_110: {
    metal: 100_000,
    crystal: 40_000,
    deuterium: 20_000,
    factor: 1.5
  },
  13_111: {
    metal: 55_000,
    crystal: 50_000,
    deuterium: 30_000,
    factor: 1.5
  },
  13_112: {
    metal: 250_000,
    crystal: 125_000,
    deuterium: 125_000,
    factor: 1.4
  },
  13_201: {
    metal: 10_000,
    crystal: 6_000,
    deuterium: 1_000,
    factor: 1.5
  },
  13_202: {
    metal: 7_500,
    crystal: 12_500,
    deuterium: 5_000,
    factor: 1.3
  },
  13_203: {
    metal: 15_000,
    crystal: 10_000,
    deuterium: 5_000,
    factor: 1.5
  },
  13_204: {
    metal: 20_000,
    crystal: 15_000,
    deuterium: 7_500,
    factor: 1.3
  },
  13_205: {
    metal: 160_000,
    crystal: 120_000,
    deuterium: 50_000,
    factor: 1.5
  },
  13_206: {
    metal: 50_000,
    crystal: 50_000,
    deuterium: 20_000,
    factor: 1.5
  },
  13_207: {
    metal: 70_000,
    crystal: 40_000,
    deuterium: 20_000,
    factor: 1.3
  },
  13_208: {
    metal: 160_000,
    crystal: 120_000,
    deuterium: 50_000,
    factor: 1.5
  },
  13_209: {
    metal: 160_000,
    crystal: 120_000,
    deuterium: 50_000,
    factor: 1.5
  },
  13_210: {
    metal: 85_000,
    crystal: 40_000,
    deuterium: 35_000,
    factor: 1.2
  },
  13_211: {
    metal: 120_000,
    crystal: 30_000,
    deuterium: 25_000,
    factor: 1.3
  },
  13_212: {
    metal: 160_000,
    crystal: 120_000,
    deuterium: 50_000,
    factor: 1.5
  },
  13_213: {
    metal: 200_000,
    crystal: 100_000,
    deuterium: 100_000,
    factor: 1.5
  },
  13_214: {
    metal: 160_000,
    crystal: 120_000,
    deuterium: 50_000,
    factor: 1.5
  },
  13_215: {
    metal: 320_000,
    crystal: 240_000,
    deuterium: 100_000,
    factor: 1.5
  },
  13_216: {
    metal: 320_000,
    crystal: 240_000,
    deuterium: 100_000,
    factor: 1.5
  },
  13_217: {
    metal: 500_000,
    crystal: 300_000,
    deuterium: 200_000,
    factor: 1.5
  },
  13_218: {
    metal: 300_000,
    crystal: 180_000,
    deuterium: 120_000,
    factor: 1.7
  },
  14_101: {
    metal: 4,
    crystal: 3,
    deuterium: 0,
    factor: 1.21
  },
  14_102: {
    metal: 6,
    crystal: 3,
    deuterium: 0,
    factor: 1.21
  },
  14_103: {
    metal: 20_000,
    crystal: 15_000,
    deuterium: 15_000,
    factor: 1.3
  },
  14_104: {
    metal: 7_500,
    crystal: 5_000,
    deuterium: 800,
    factor: 1.8
  },
  14_105: {
    metal: 60_000,
    crystal: 30_000,
    deuterium: 50_000,
    factor: 1.8
  },
  14_106: {
    metal: 8_500,
    crystal: 5_000,
    deuterium: 3_000,
    factor: 1.25
  },
  14_107: {
    metal: 15_000,
    crystal: 15_000,
    deuterium: 5_000,
    factor: 1.2
  },
  14_108: {
    metal: 75_000,
    crystal: 25_000,
    deuterium: 30_000,
    factor: 1.05
  },
  14_109: {
    metal: 87_500,
    crystal: 25_000,
    deuterium: 30_000,
    factor: 1.2
  },
  14_110: {
    metal: 150_000,
    crystal: 30_000,
    deuterium: 30_000,
    factor: 1.5
  },
  14_111: {
    metal: 75_000,
    crystal: 50_000,
    deuterium: 55_000,
    factor: 1.2
  },
  14_112: {
    metal: 500_000,
    crystal: 250_000,
    deuterium: 250_000,
    factor: 1.4
  },
  14_201: {
    metal: 10_000,
    crystal: 6_000,
    deuterium: 1_000,
    factor: 1.5
  },
  14_202: {
    metal: 7_500,
    crystal: 12_500,
    deuterium: 5_000,
    factor: 1.5
  },
  14_203: {
    metal: 15_000,
    crystal: 10_000,
    deuterium: 5_000,
    factor: 1.5
  },
  14_204: {
    metal: 20_000,
    crystal: 15_000,
    deuterium: 7_500,
    factor: 1.5
  },
  14_205: {
    metal: 25_000,
    crystal: 20_000,
    deuterium: 10_000,
    factor: 1.5
  },
  14_206: {
    metal: 50_000,
    crystal: 50_000,
    deuterium: 20_000,
    factor: 1.3
  },
  14_207: {
    metal: 70_000,
    crystal: 40_000,
    deuterium: 20_000,
    factor: 1.5
  },
  14_208: {
    metal: 80_000,
    crystal: 50_000,
    deuterium: 20_000,
    factor: 1.2
  },
  14_209: {
    metal: 320_000,
    crystal: 240_000,
    deuterium: 100_000,
    factor: 1.5
  },
  14_210: {
    metal: 85_000,
    crystal: 40_000,
    deuterium: 35_000,
    factor: 1.2
  },
  14_211: {
    metal: 120_000,
    crystal: 30_000,
    deuterium: 25_000,
    factor: 1.5
  },
  14_212: {
    metal: 100_000,
    crystal: 40_000,
    deuterium: 30_000,
    factor: 1.5
  },
  14_213: {
    metal: 200_000,
    crystal: 100_000,
    deuterium: 100_000,
    factor: 1.5
  },
  14_214: {
    metal: 160_000,
    crystal: 120_000,
    deuterium: 50_000,
    factor: 1.5
  },
  14_215: {
    metal: 240_000,
    crystal: 120_000,
    deuterium: 120_000,
    factor: 1.5
  },
  14_216: {
    metal: 320_000,
    crystal: 240_000,
    deuterium: 100_000,
    factor: 1.5
  },
  14_217: {
    metal: 500_000,
    crystal: 300_000,
    deuterium: 200_000,
    factor: 1.5
  },
  14_218: {
    metal: 300_000,
    crystal: 180_000,
    deuterium: 120_000,
    factor: 1.7
  },
  getValues(technologies, id, reductions) {
    const { value } = technologies[id];
    const from = 1;
    const to = value;
    return Upgradables.get(id, from, to, reductions);
  },
  getUpgrades(technologies, id, reductions) {
    const { value, upgraded } = technologies[id];
    const from = value + 1;
    const to = upgraded;
    return Upgradables.get(id, from, to, reductions);
  },
  getUpgraded(technologies, id, reductions) {
    const { upgraded } = technologies[id];
    const from = 1;
    const to = upgraded;
    return Upgradables.get(id, from, to, reductions);
  },
  get(id, from, to, reductions) {
    const { metal, crystal, deuterium, factor } = Upgradables[id];
    const rate = 1 - reductions?.[id] || 1;
    const isLifeform = id > 10_000;
    const result = new Resources();
    for (let level = from; level <= to; level++) {
      const cost = new Resources(metal, crystal, deuterium);
      const multiplier = factor ** (level - 1) * (isLifeform * level || 1) * rate;
      result.add(cost.multiply(multiplier).trunc());
    }
    return result;
  }
};
const Values = {
  get(technologies, ids, reductions) {
    const result = new Resources();
    if (technologies) {
      for (const id of Types.toArray(ids)) {
        if (technologies[id]) {
          const cost = getClass(id).getValues(technologies, id, reductions);
          result.add(cost);
        }
      }
    }
    return result;
  }
};
const Upgrades = {
  get(technologies, ids, reductions) {
    const result = new Resources();
    if (technologies) {
      for (const id of Types.toArray(ids)) {
        if (technologies[id]) {
          const cost = getClass(id).getUpgrades(technologies, id, reductions);
          result.add(cost);
        }
      }
    }
    return result;
  }
};
const Upgraded = {
  get(technologies, ids, reductions) {
    const result = new Resources();
    if (technologies) {
      for (const id of Types.toArray(ids)) {
        if (technologies[id]) {
          const cost = getClass(id).getUpgraded(technologies, id, reductions);
          result.add(cost);
        }
      }
    }
    return result;
  }
};

function getClass(id) {
  if (id < 200 || id > 600) {
    return Upgradables;
  } else {
    return Units;
  }
}

var Costs = {
  Values,
  Upgrades,
  Upgraded
};

function set$3(data) {
  setValues(data);
  setPercents(data);
}
function setValues(data) {
  setPositionsValues(data);
  setAccountValues(data);
  setResearchesValues(data);
  setShipsValues(data);
  setIndestructiblesValues(data);
  setUpgradesValues(data);
}
function setPositionsValues(data) {
  const { positions } = data.player;
  for (const coordinates in positions) {
    const { planet, moon } = positions[coordinates];
    setPlanetValues(planet);
    if (moon) {
      setMoonValues(moon);
    }
  }
}
function setPlanetValues(body) {
  body.points = {};
  body.points.values = {};
  setMinesValues(body);
  setBuildingsValues(body);
  setLifeformsValues(body);
  setUnitsValues(body);
  setStaticsValues(body);
}
function setMoonValues(body) {
  body.points = {};
  body.points.values = {};
  setBuildingsValues(body);
  setUnitsValues(body);
  setStaticsValues(body);
}
function setMinesValues(body) {
  const { technologies, points } = body;
  const metal = Costs.Values.get(technologies, 1).toPoints();
  const crystal = Costs.Values.get(technologies, 2).toPoints();
  const deuterium = Costs.Values.get(technologies, 3).toPoints();
  const all = metal + crystal + deuterium;
  points.values.mines = {
    all,
    metal,
    crystal,
    deuterium
  };
}
function setBuildingsValues(body) {
  const { technologies, points } = body;
  points.values.buildings = {
    all: Costs.Values.get(technologies, IDs.buildings.all).toPoints()
  };
}
function setLifeformsValues(body) {
  const { technologies, points } = body;
  const buildings = Costs.Values.get(technologies, IDs.lifeforms.buildings.all).toPoints();
  const researches = Costs.Values.get(technologies, IDs.lifeforms.researches.all).toPoints();
  const all = buildings + researches;
  points.values.lifeforms = {
    all,
    buildings,
    researches
  };
}
function setUnitsValues(body) {
  const { technologies, points } = body;
  points.values.units = {
    ships: {
      statics: Costs.Values.get(technologies, IDs.units.ships.statics).toPoints()
    },
    defences: {
      all: Costs.Values.get(technologies, IDs.units.defences.all).toPoints()
    }
  };
}
function setStaticsValues(body) {
  const { mines, buildings, lifeforms, units } = body.points.values;
  body.points.values.statics = (mines?.all || 0) + buildings.all + (lifeforms?.all || 0) + units.ships.statics + units.defences.all;
}
function setAccountValues(data) {
  const { positions, points } = data.player;
  const values = points.values = {
    mines: {
      all: 0,
      metal: 0,
      crystal: 0,
      deuterium: 0
    },
    buildings: {
      all: 0,
      planet: 0,
      moon: 0
    },
    lifeforms: {
      all: 0,
      buildings: 0,
      researches: 0
    },
    units: {
      defences: {
        all: 0
      }
    }
  };
  for (const coordinates in positions) {
    const { planet, moon } = positions[coordinates];
    values.mines.all += planet.points.values.mines.all;
    values.mines.metal += planet.points.values.mines.metal;
    values.mines.crystal += planet.points.values.mines.crystal;
    values.mines.deuterium += planet.points.values.mines.deuterium;
    values.buildings.all += planet.points.values.buildings.all;
    values.buildings.planet += planet.points.values.buildings.all;
    values.lifeforms.all += planet.points.values.lifeforms.all;
    values.lifeforms.buildings += planet.points.values.lifeforms.buildings;
    values.lifeforms.researches += planet.points.values.lifeforms.researches;
    values.units.defences.all += planet.points.values.units.defences.all;
    if (moon) {
      values.buildings.all += moon.points.values.buildings.all;
      values.buildings.moon += moon.points.values.buildings.all;
      values.units.defences.all += moon.points.values.units.defences.all;
    }
  }
}
function setResearchesValues(data) {
  const { researches, points } = data.player;
  points.values.researches = {
    all: Costs.Values.get(researches, IDs.researches.all).toPoints()
  };
}
function setShipsValues(data) {
  const { values, total } = data.player.points;
  values.units.ships = {
    all: Math.max(0, total - values.mines.all - values.buildings.all - values.lifeforms.all - values.units.defences.all - values.researches.all)
  };
}
function setIndestructiblesValues(data) {
  const { values, total } = data.player.points;
  values.indestructibles = total - values.buildings.moon - values.units.ships.all - values.units.defences.all;
}
function setUpgradesValues(data) {
  const { positions, researches, points } = data.player;
  const result = new Resources();
  for (const coordinates in positions) {
    const { planet, moon } = positions[coordinates];
    result.add(Costs.Upgrades.get(planet.technologies, IDs.planet.all));
    if (moon) {
      result.add(Costs.Upgrades.get(moon.technologies, IDs.moon.all));
    }
  }
  result.add(Costs.Upgrades.get(researches, IDs.researches.all));
  points.values.upgrades = result.toPoints();
}
function setPercents(data) {
  setPositionsPercents(data);
  setAccountPercents(data);
}
function setPositionsPercents(data) {
  const { positions, points } = data.player;
  const { total } = points;
  for (const coordinates in positions) {
    const { planet, moon } = positions[coordinates];
    planet.points.percents = getPercents(planet.points.values, total);
    if (moon) {
      moon.points.percents = getPercents(moon.points.values, total);
    }
  }
}
function setAccountPercents(data) {
  const { points } = data.player;
  points.percents = getPercents(points.values, points.total);
}
function getPercents(values, total) {
  const result = {};
  for (const key in values) {
    const value = values[key];
    if (Types.isObject(value)) {
      result[key] = getPercents(value, total);
    } else {
      result[key] = Math.trunc(value) / total;
      if (result[key] === Infinity) {
        result[key] = 0;
      }
    }
  }
  return result;
}

var Points = {
  set: set$3
};

function set$2(reduced, scraped) {
  clean(reduced, scraped);
  sort(reduced, scraped);
}
function clean(reduced, scraped) {
  if (currentPage === 'empire') {
    cleanFromEmpire(reduced.player.positions, scraped.player.positions);
  } else {
    cleanFromPlanetList(scraped.player.positions, scraped.player.positions);
  }
}
function cleanFromEmpire(reduced, scraped) {
  for (const coordinates in reduced) {
    if (!scraped[coordinates]) {
      if (planetType) {
        delete reduced[coordinates].moon;
      } else {
        delete reduced[coordinates];
      }
    }
  }
}
function cleanFromPlanetList(reduced, scraped) {
  for (const coordinates in reduced) {
    if (!scraped[coordinates]) {
      delete reduced[coordinates];
    } else if (!scraped[coordinates].moon) {
      delete reduced[coordinates].moon;
    }
  }
}
function sort(reduced, scraped) {
  if (currentPage !== 'empire') {
    const result = {};
    for (const coordinates in scraped.player.positions) {
      result[coordinates] = reduced.player.positions[coordinates];
    }
    reduced.player.positions = result;
  }
}

var Positions$1 = {
  set: set$2
};

function filter(data) {
  const { positions } = data.player;
  const result = [];
  for (const coordinates in positions) {
    const { productions } = positions[coordinates].planet;
    if (productions) {
      result.push(productions);
    }
  }
  return result;
}
function get$8(...productions) {
  const result = {};
  for (const production of productions) {
    for (const key in production) {
      const value = production[key];
      if (Types.isObject(value)) {
        result[key] = get$8(result[key], value);
      } else if (key !== 'factor') {
        result[key] ||= 0;
        result[key] += value;
      }
    }
  }
  return result;
}
function set$1(data) {
  const productions = filter(data);
  data.player.productions = get$8(...productions);
}

var Productions$2 = {
  set: set$1
};

function set(reduced, scraped) {
  Positions$1.set(reduced, scraped);
  Defaults.set(reduced);
  Productions$2.set(reduced);
  Points.set(reduced);
  Highscore.set(reduced);
  Needed$1.clean(reduced);
}

var Transforms = {
  set
};

async function get$7() {
  const stored = Storage.get();
  const scraped = await Scraper.get();
  const reduced = Types.getReducedObjects(stored, scraped);
  Transforms.set(reduced, scraped);
  return reduced;
}

var Data = {
  get: get$7
};

function init$8(data) {
  if (currentPage !== 'empire') {
    setEnergyIconWarning();
    setPlanetsIconsWarnings(data);
  }
}
function setEnergyIconWarning() {
  const element = document.body.querySelector('#energy_box');
  if (element.querySelector('#resources_energy').dataset.raw < 0) {
    element.querySelector('.resourceIcon.energy').classList.add('ic_energy-warning');
  }
}
function setPlanetsIconsWarnings(data) {
  const list = document.querySelectorAll('#planetList .planetPic');
  if (list) {
    const { positions } = data.player;
    let i = 0;
    for (const coordinates in positions) {
      if (positions[coordinates].planet.resources.energy < 0) {
        list[i].classList.add('ic_energy-warning');
      }
      i++;
    }
  }
}
var EnergyWarnings = {
  init: init$8
};

function init$7(data) {
  if (currentPage === 'highscore') {
    setGapPoints(data);
    setEvents$7();
  }
}
function setGapPoints(data) {
  // the existence of player values needs to be tested before due to a game's bug that redirects to the wrong highscore pages when there is to much players with the same rank
  const { player } = data.universe.highscores[currentCategory][currentType];
  if (player) {
    for (const element of document.querySelectorAll('#ranks tbody tr:not(.myrank) .score')) {
      // firstChild property of score element is used for compatibility reason with OGLight
      const value = Types.getNumber(element.firstChild.textContent);
      const difference = value - player.points;
      const prefix = difference > 0 && '+' || '';
      element.title = prefix + Types.getFullNumberString(difference);
      element.classList.add('tooltipRight');
    }
  }
}
async function setEvents$7() {
  await Scraper.elementHasChanged('#stat_list_content');
  await Scraper.elementHasChanged('#stat_list_content');
  const scraped = await Scraper.get();
  const stored = Storage.get();
  const reduced = Types.getReducedObjects(stored, scraped);
  Storage.set(reduced);
  init$7(reduced);
}

var Highscores = {
  init: init$7
};

function init$6() {
  if (currentPage !== 'empire') {
    const template = document.createElement('template');
    template.innerHTML = getHTML$a();
    document.querySelector('#menuTable').appendChild(template.content);
    setEvents$6();
  }
}
function getHTML$a() {
  return `<li>
            <span id="ic_menu_icon-button" class="menu_icon">
              <div id="ic_menu_icon-wrapper" class="tooltipRight" title="${ Translation.menuTitle }">
                <svg viewBox="0 0 1000 1000" height="18" fill="currentColor">
                  <path d="M378 158 195 842H0l183-684h195zm603 0L880 354H733a200 200 0 0 0-185 146c-11 40-6 75 15 104 21 28 51 42 92 42h195l-52 196H603c-95 0-166-34-215-100-49-67-61-148-35-242 25-94 79-175 164-242 85-66 174-100 269-100h195z"/>
                </svg>
              </div>
            </span>
            <a class="menubutton" href="${ Translation.supportLink }" target="_blank">
              <span id="ic_menu_text" class="textlabel">InfoCompte ${ GM_info.script.version }</span>
            </a>
          </li>`;
}
function setEvents$6() {
  document.body.querySelector('#ic_menu_icon-button').addEventListener('click', function() {
    document.body.querySelector('#ic_settings').showModal();
  });
}

var MenuButton = {
  init: init$6
};

function getHTML$9(data) {
  return `<svg viewBox="0 0 100 100" transform="rotate(-90)">
            ${(function() {
              const offset = 25 * Math.PI * 2; // radius * TAU
              let rotation = 0;
              let result = '';
              for (const key in data) {
                const { percent, color } = data[key];
                if (percent) {
                  const circle = `<circle cx="50" cy="50" r="25"
                                          fill="transparent" stroke="${ color }"
                                          stroke-width="50"
                                          stroke-dasharray="${ percent * offset } ${ offset }"
                                          transform="rotate(${ rotation * 360 } 50 50)"/>`;
                  rotation += percent;
                  result += circle;
                }
              }
              return result;
            })()}
          </svg>`;
}

var PieChart = {
  getHTML: getHTML$9
};

let useCompactNumbers;

function setCollapseStates(data) {
  const { collapsibles } = data.script;
  for (const element of document.body.querySelectorAll('.ic_panel')) {
    const { id, dataset } = element;
    const state = collapsibles[id] || dataset.state;
    dataset.state = state;
  }
}
function setCompactNumbers(value) {
  useCompactNumbers = value;
}
function setEvents$5() {
  for (const element of document.body.querySelectorAll('.ic_panel')) {
    element.querySelector('.ic_panel_title').addEventListener( 'click', function() {
      const data = Storage.get();
      const { collapsibles } = data.script;
      const { id, dataset } = element;
      if (dataset.state === 'collapsed') {
        dataset.state = 'expanded';
        collapsibles[id] = 'expanded';
      } else {
        dataset.state = 'collapsed';
        collapsibles[id] = 'collapsed';
      }
      Storage.set(data);
    });
  }
}
function getNumberHTML(value) {
  const truncated = Types.getTruncatedNumberString(value);
  if (useCompactNumbers) {
    const compact = Types.getCompactNumberString(value);
    return `<span class="tooltipRight" title="${ truncated }">${ compact }</span>`;
  } else {
    return `<span>${ truncated }</span>`;
  }
}

var Shared = {
  setCollapseStates,
  setCompactNumbers,
  setEvents: setEvents$5,
  getNumberHTML
};

function getHTML$8(data) {
  const { points, movements } = getData(data);
  const { values, percents } = points;
  return `<div id="ic_account-points-panel" class="ic_panel" data-state="expanded">
            <h3 class="ic_panel_title"><span></span>${ Translation.pointsRepartition }</h3>
            <div class="ic_panel_main">
              <table class="ic_table">
                <tr>
                  <th>${ Translation.mines }</th>
                  <td>${ values.mines.all } — <span class="ic_percent">${ percents.mines.all }</span></td>
                </tr>
                <tr>
                  <th>${ Translation.planetBuildings }</th>
                  <td>${ values.buildings.planet } — <span class="ic_percent">${ percents.buildings.planet }</span></td>
                </tr>
                <tr>
                  <th>${ Translation.moonBuildings }</th>
                  <td>${ values.buildings.moon } — <span class="ic_percent">${ percents.buildings.moon }</span></td>
                </tr>
                <tr>
                  <th>${ Translation.lifeformBuildings }</th>
                  <td>${ values.lifeforms.buildings } — <span class="ic_percent">${ percents.lifeforms.buildings }</span></td>
                </tr>
                <tr>
                  <th>${ Translation.lifeformResearches }</th>
                  <td>${ values.lifeforms.researches } — <span class="ic_percent">${ percents.lifeforms.researches }</span></td>
                </tr>
                <tr>
                  <th>${ Translation.researches }</th>
                  <td>${ values.researches.all } — <span class="ic_percent">${ percents.researches.all }</span></td>
                </tr>
                <tr>
                  <th>${ Translation.ships }</th>
                  <td>${ values.units.ships.all } — <span class="ic_percent">${ percents.units.ships.all }</span></td>
                </tr>
                <tr>
                  <th>${ Translation.defences }</th>
                  <td>${ values.units.defences.all } — <span class="ic_percent">${ percents.units.defences.all }</span></td>
                </tr>
                <tr>
                  <th>${ Translation.indestructibles }</th>
                  <td>
                    <div>${ values.indestructibles } — <span class="ic_percent">${ percents.indestructibles }</span></div>
                    <div>- ${ movements.ifDestroyed } ${ Translation.ifDestroyed }</div>
                  </td>
                </tr>
                <tr>
                  <th>${ Translation.inProduction }</th>
                  <td>
                    <div>${ values.upgrades } — <span class="ic_percent">${ percents.upgrades }</span></div>
                    <div>+ ${ movements.whenUpgraded } ${ Translation.whenUpgraded }</div>
                  </td>
                </tr>
              </table>
              ${ PieChart.getHTML(getPieChartData(data)) }
            </div>
          </div>`;
}
function getData(data) {
  const { player, universe, script } = data;
  const { points } = player;
  const values = getValuesData(points.values);
  const percents = getPercentsData(points.percents);
  const movements = universe.highscores?.[1][0].player?.movements || {
    ifDestroyed: 0,
    whenUpgraded: 0
  };
  return {
    movements,
    points: {
      values,
      percents
    }
  };
}
function getValuesData(values) {
  const result = {};
  for (const key in values) {
    if (Types.isObject(values[key])) {
      result[key] = getValuesData(values[key]);
    } else {
      result[key] = Shared.getNumberHTML(values[key]);
    }
  }
  return result;
}
function getPercentsData(percents) {
  const result = {};
  for (const key in percents) {
    if (Types.isObject(percents[key])) {
      result[key] = getPercentsData(percents[key]);
    } else {
      result[key] = Types.getPercentString(percents[key]);
    }
  }
  return result;
}
function getPieChartData(data) {
  const { percents } = data.player.points;
  const { colors } = data.script;
  return {
    mines: {
      percent: percents.mines.all,
      color: colors.mines
    },
    planetBuildings: {
      percent: percents.buildings.planet,
      color: colors.planetBuildings
    },
    moonBuildings: {
      percent: percents.buildings.moon,
      color: colors.moonBuildings
    },
    lifeformBuildings: {
      percent: percents.lifeforms.buildings,
      color: colors.lifeformBuildings
    },
    lifeformResearches: {
      percent: percents.lifeforms.researches,
      color: colors.lifeformResearches
    },
    researches: {
      percent: percents.researches.all,
      color: colors.researches
    },
    ships: {
      percent: percents.units.ships.all,
      color: colors.ships
    },
    defences: {
      percent: percents.units.defences.all,
      color: colors.defences
    }
  };
}
var Account = {
  getHTML: getHTML$8
};

const Bonuses$1 = {
  Buildings: {
    11_103: [.0025, 0, 0, .25, 0, 0],
    11_106: [.015, 0, 0, 0, 0, 0],
    11_108: [0, .015, .01, 0, 0, 0],
    11_111: [.005, 0, 0, 1, 0, 0],
    12_103: [.0025, 0, 0, .25, 0, 0],
    12_106: [.02, 0, 0, 0, 0, 0],
    12_108: [.01, 0, 0, .5, 0, 0],
    12_109: [0, .02, 0, 0, 0, 0],
    12_110: [0, 0, .02, 0, 0, 0],
    12_111: [.005, 0, 0, .5, 0, 0],
    13_103: [.0025, 0, 0, .25, 0, 0],
    13_107: [0, .003, 0, 0, 0, 0],
    13_110: [0, 0, .02, 0, 0, 0],
    13_111: [.004, 0, 0, 1, 0, 0],
    14_103: [.0025, 0, 0, .25, 0, 0],
    14_107: [.0025, 0, 0, 0, 0, 0],
    get(position) {
      const { lifeform, technologies } = position.planet;
      const { species } = lifeform;
      const result = {};
      for (const id of IDs.lifeforms.buildings[species]) {
        const bonuses = Bonuses$1.Buildings[id];
        if (bonuses) {
          result[id] = [
            bonuses[0] * technologies[id].upgraded,
            bonuses[1] * technologies[id].upgraded,
            bonuses[2] * technologies[id].upgraded
          ];
        }
      }
      Bonuses$1.clamp(result, Bonuses$1.Buildings);
      return result;
    }
  },
  Researches: {
    11_202: [.0006, .0006, .0006, 0, 0, 0],
    11_208: [.0006, .0006, .0006, 0, 0, 0],
    12_202: [0, .0008, 0, 0, 0, 0],
    12_203: [0, 0, .0008, 0, 0, 0],
    12_205: [.0008, .0008, .0008, 0, 0, 0],
    12_207: [.0008, 0, 0, 0, 0, 0],
    12_210: [.0008, 0, 0, 0, 0, 0],
    12_209: [.0015, 0, 0, .5, 0, 0],
    12_211: [0, .0008, 0, 0, 0, 0],
    12_212: [0, 0, .0008, 0, 0, 0],
    12_213: [.001, 0, 0, .5, 0, 0],
    12_218: [.002, 0, 0, 0, 0, 0],
    13_201: [0, 0, .0008, 0, 0, 0],
    13_206: [.0006, .0006, .0006, 0, 0, 0],
    13_213: [.0006, .0006, .0006, 0, 0, 0],
    14_202: [0, 0, .0008, 0, 0, 0],
    14_212: [.0006, .0006, .0006, 0, 0, 0],
    get(data, positions) {
      const result = {};
      for (const coordinates in data.player.positions) {
        const { lifeform, technologies } = data.player.positions[coordinates].planet;
        const { species, researches } = lifeform;
        const lifeformLevelMultiplier = 1 + .001 * data.player.lifeforms[species].level;
        const buildings = positions[coordinates];
        const buildingsMultiplier = 1 + (buildings[11_111]?.[0] || 0) + (buildings[13_107]?.[1] || 0) + (buildings[13_111]?.[0] || 0);
        for (const id of researches) {
          const bonuses = Bonuses$1.Researches[id];
          if (bonuses) {
            const kaeleshBuildingMultiplier = 1 + (IDs.lifeforms.researches.kaelesh.includes(id) && buildings[14_107]?.[0] || 0);
            const multiplier = buildingsMultiplier * kaeleshBuildingMultiplier * lifeformLevelMultiplier * technologies[id].upgraded;
            result[id] ||= [0, 0, 0];
            result[id][0] += bonuses[0] * multiplier;
            result[id][1] += bonuses[1] * multiplier;
            result[id][2] += bonuses[2] * multiplier;
          }
        }
      }
      Bonuses$1.clamp(result, Bonuses$1.Researches);
      return result;
    }
  },
  get(data) {
    const { positions } = data.player;
    const buildings = {};
    for (const coordinates in positions) {
      buildings[coordinates] = Bonuses$1.Buildings.get(positions[coordinates]);
    }
    return {
      buildings,
      researches: Bonuses$1.Researches.get(data, buildings)
    };
  },
  clamp(result, bonuses) {
    for (const key in result) {
      if (bonuses[key][3]) {
        result[key][0] = Math.min(result[key][0], bonuses[key][3]);
      }
      if (bonuses[key][4]) {
        result[key][1] = Math.min(result[key][1], bonuses[key][4]);
      }
      if (bonuses[key][5]) {
        result[key][2] = Math.min(result[key][2], bonuses[key][5]);
      }
    }
  }
};
const Reductions = {
  11_103: IDs.lifeforms.researches.all,
  12_103: IDs.lifeforms.researches.all,
  12_108: IDs.lifeforms.buildings.rocktal,
  12_111: IDs.resources.producers,
  12_209: 122,
  13_103: IDs.lifeforms.researches.all,
  14_103: IDs.lifeforms.researches.all,
  reduce(bonuses) {
    const result = {};
    for (const key in bonuses) {
      const ids = Reductions[key];
      if (ids) {
        for (const id of Types.toArray(ids)) {
          result[id] ||= 0;
          result[id] += bonuses[key][0];
        }
      }
    }
    return result;
  },
  get(bonuses) {
    const buildings = {};
    for (const coordinates in bonuses.buildings) {
      buildings[coordinates] = Reductions.reduce(bonuses.buildings[coordinates]);
    }
    return {
      buildings,
      researches: Reductions.reduce(bonuses.researches)
    };
  }
};

var Lifeforms$2 = {
  Bonuses: Bonuses$1,
  Reductions
};

const Bonuses = {
  Buildings: Lifeforms$2.Bonuses.Buildings,
  Researches: {
    get(data, buildings) {
      const { positions, researches } = data.player;
      const { planetsToIgnoreCount } = data.script.amortizations.form;
      const multiplier = (Math.round(researches[124].upgraded * .5) + 1 - planetsToIgnoreCount) / Object.keys(positions).length;
      const result = Lifeforms$2.Bonuses.Researches.get(data, buildings);
      for (const key in result) {
        result[key][0] *= multiplier;
        result[key][1] *= multiplier;
        result[key][2] *= multiplier;
      }
      Lifeforms$2.Bonuses.clamp(result, Lifeforms$2.Bonuses.Researches);
      return result;
    }
  },
  get(data) {
    const { positions } = data.player;
    const buildings = {};
    for (const coordinates in positions) {
      buildings[coordinates] = Lifeforms$2.Bonuses.Buildings.get(positions[coordinates]);
    }
    const researches = Bonuses.Researches.get(data, buildings);
    return {
      buildings,
      researches
    };
  }
};

var Lifeforms$1 = {
  Bonuses,
  Reductions: Lifeforms$2.Reductions
};

const Basic = {
  get(data) {
    const { speed } = data.universe;
    return new Resources(30 * speed, 15 * speed, 0);
  }
};
const Mines$1 = {
  metal: {
    bonuses: [1.35, 1.23, 1.17, 1],
    get(data, planet) {
      const { position, technologies } = planet;
      const { upgraded } = technologies[1];
      const { speed } = data.universe;
      const index = Math.min(3, Math.abs(position - 8));
      const bonus = Mines$1.metal.bonuses[index];
      const result = new Resources();
      result.metal = Math.trunc(30 * speed * upgraded * 1.1 ** upgraded * bonus);
      return result;
    }
  },
  crystal: {
    bonuses: [1.4, 1.3, 1.2, 1],
    get(data, planet) {
      const { position, technologies } = planet;
      const { upgraded } = technologies[2];
      const { speed } = data.universe;
      const index = Math.min(3, position - 1);
      const bonus = Mines$1.crystal.bonuses[index];
      const result = new Resources();
      result.crystal = Math.trunc(20 * speed * upgraded * 1.1 ** upgraded * bonus);
      return result;
    }
  },
  deuterium: {
    get(data, planet) {
      const { temperature, technologies } = planet;
      const { upgraded } = technologies[3];
      const { speed } = data.universe;
      const bonus = 1.44 - .004 * temperature;
      const result = new Resources();
      result.deuterium = Math.trunc(10 * speed * upgraded * 1.1 ** upgraded * bonus);
      return result;
    }
  },
  get(data, planet) {
    const result = new Resources();
    result.add(
      Mines$1.metal.get(data, planet),
      Mines$1.crystal.get(data, planet),
      Mines$1.deuterium.get(data, planet)
    );
    return result;
  }
};
const Crawlers = {
  get(data, planet, productions, bonuses, count) {
    const result = new Resources(productions);
    return result.multiply(Crawlers.getMultiplier(data, planet, bonuses, count));
  },
  getCurrentCount(data, planet, bonuses) {
    const current = planet.technologies[217].upgraded;
    const maximum = Crawlers.getMaximumCount(data, planet, bonuses);
    return Math.min(current, maximum);
  },
  getMaximumCount(data, planet, bonuses) {
    const { player } = data;
    const { technologies } = planet;
    const levels = technologies[1].upgraded + technologies[2].upgraded + technologies[3].upgraded;
    const multiplier = 1 + (player.class === 'miner' && player.officers.geologist && .1 * (1 + bonuses[12_218]?.[0] || 1) || 0);
    return Math.floor(8 * levels * multiplier);
  },
  getMultiplier(data, planet, bonuses, count) {
    const bb = .0002 * (1 + bonuses[12_213]?.[0] || 1);
    const cb = data.player.class === 'miner' ? .0002 * (.5 * (1 + bonuses[12_218]?.[0] || 1)) : 0;
    const multiplier = (bb + cb) * planet.productions.crawlers.factor;
    return Math.min(count * multiplier, .5);
  }
};
const Lifeforms = {
  get(productions, bonuses, ids) {
    const result = new Resources();
    for (const id of Types.toArray(ids)) {
      if (bonuses[id] && IDs.resources.increasers.includes(id)) {
        result.add(new Resources(
          productions.metal * bonuses[id][0],
          productions.crystal * bonuses[id][1],
          productions.deuterium * bonuses[id][2]
        ));
      }
    }
    return result;
  }
};
const Plasma$1 = {
  get(data, productions) {
    const { upgraded } = data.player.researches[122];
    return new Resources(
      productions.metal * .01 * upgraded,
      productions.crystal * .0066 * upgraded,
      productions.deuterium * .0033 * upgraded
    );
  }
};
const Officers = {
  get(data, productions) {
    const { all, geologist } = data.player.officers;
    const result = new Resources(productions);
    return result.multiply((geologist && .1 || 0) + (all && .02 || 0));
  }
};
const Classes = {
  get(data, productions, bonuses) {
    const result = new Resources(productions);
    return result.multiply(Classes.getMultiplier(data, bonuses));
  },
  getMultiplier(data, bonuses) {
    const { player } = data;
    let result = 0;
    result += player.class === 'miner' && .25 * (1 + bonuses[12_218]?.[0] || 1) || 0;
    result += player.alliance.class === 'trader' && .05 || 0;
    return result;
  }
};
const Boosters = {
  get(productions, bonuses) {
    return new Resources(
      productions.metal * bonuses.metal,
      productions.crystal * bonuses.crystal,
      productions.deuterium * bonuses.deuterium
    );
  }
};

var Productions$1 = {
  Basic,
  Mines: Mines$1,
  Crawlers,
  Lifeforms,
  Plasma: Plasma$1,
  Officers,
  Classes,
  Boosters
};

function getCost$2(data, coordinates, reductions, id) {
  const { technologies } = data.player.positions[coordinates].planet;
  return Costs.Upgrades.get(technologies, id, reductions.buildings[coordinates]);
}
function getProduction$3(data, coordinates, bonuses) {
  const { player, script } = data;
  const position = player.positions[coordinates];
  const { planet } = position;
  const { lifeform, boosters } = planet;
  const { species } = lifeform;
  const { useResourceBoosters } = script.amortizations.form;
  const productions = Productions$1.Mines.get(data, planet);
  const result = new Resources();
  result.add(
    productions,
    Productions$1.Lifeforms.get(productions, bonuses.buildings[coordinates], IDs.lifeforms.buildings[species]),
    Productions$1.Lifeforms.get(productions, bonuses.researches, IDs.resources.increasers),
    Productions$1.Crawlers.get(data, planet, productions, bonuses.researches, Productions$1.Crawlers.getCurrentCount(data, planet, bonuses.researches)),
    Productions$1.Plasma.get(data, productions),
    Productions$1.Officers.get(data, productions),
    Productions$1.Classes.get(data, productions, bonuses.researches)
  );
  if (boosters && useResourceBoosters) {
    result.add(Productions$1.Boosters.get(productions, boosters));
  }
  return result;
}
function get$6(data, coordinates, bonuses, reductions, id) {
  const technology = data.player.positions[coordinates].planet.technologies[id];
  const { rates } = data.script;
  // save inital values before upgrade
  const initialValue = technology.value;
  const initialUpgrade = technology.upgrade;
  const initialUpgraded = technology.upgraded;
  const initialProduction = getProduction$3(data, coordinates, bonuses);
  // set upgrade
  technology.value = technology.upgraded;
  technology.upgraded += 1;
  technology.upgrade = 1;
  // get result
  const level = technology.upgraded;
  const cost = getCost$2(data, coordinates, reductions, id);
  const production = getProduction$3(data, coordinates, bonuses).subtract(initialProduction);
  const amortization = cost.toSU(rates) / production.toSU(rates);
  // restore initial values & result return
  technology.value = initialValue;
  technology.upgrade = initialUpgrade;
  technology.upgraded = initialUpgraded;
  return {
    coordinates,
    id,
    level,
    cost,
    production,
    amortization
  };
}

var Mines = {
  get: get$6
};

const Buildings$1 = {
  getCost(data, coordinates, reductions, id) {
    const { technologies } = data.player.positions[coordinates].planet;
    return Costs.Upgrades.get(technologies, id, reductions.buildings[coordinates]);
  },
  getProduction(data, coordinates, bonuses, id) {
    const { planet } = data.player.positions[coordinates];
    const productions = Productions$1.Mines.get(data, planet);
    return Productions$1.Lifeforms.get(productions, bonuses.buildings[coordinates], id);
  },
  get(data, coordinates, bonuses, reductions, id) {
    const position = data.player.positions[coordinates];
    const { technologies } = position.planet;
    const { rates } = data.script;
    const technology = technologies[id];
    // save inital values before upgrade
    const initialValue = technology.value;
    const initialUpgrade = technology.upgrade;
    const initialUpgraded = technology.upgraded;
    const initialProduction = Buildings$1.getProduction(data, coordinates, bonuses, id);
    // set upgrade
    technology.value = technology.upgraded;
    technology.upgraded += 1;
    technology.upgrade = 1;
    bonuses.buildings[coordinates] = Lifeforms$1.Bonuses.Buildings.get(position);
    // compute needed values
    const level = technology.upgraded;
    const cost = Buildings$1.getCost(data, coordinates, reductions, id);
    const production = Buildings$1.getProduction(data, coordinates, bonuses, id).subtract(initialProduction);
    const amortization = cost.toSU(rates) / production.toSU(rates);
    // restore initial values & result return
    technology.value = initialValue;
    technology.upgrade = initialUpgrade;
    technology.upgraded = initialUpgraded;
    bonuses.buildings[coordinates] = Lifeforms$1.Bonuses.Buildings.get(position);
    return {
      coordinates,
      id,
      level,
      cost,
      production,
      amortization
    };
  }
};
const Researches$1 = {
  getCost(data, coordinates, reductions, id) {
    const { technologies } = data.player.positions[coordinates].planet;
    return Costs.Upgrades.get(technologies, id, reductions.buildings[coordinates]);
  },
  getProduction(data, coordinates, bonuses, id) {
    const { positions } = data.player;
    const result = new Resources();
    for (const coordinates in positions) {
      const { planet } = positions[coordinates];
      const productions = Productions$1.Mines.get(data, planet);
      result.add(Productions$1.Lifeforms.get(productions, bonuses.researches, id));
    }
    return result;
  },
  get(data, coordinates, bonuses, reductions, id) {
    const position = data.player.positions[coordinates];
    const { technologies } = position.planet;
    const { rates } = data.script;
    const technology = technologies[id];
    // save inital values before upgrade
    const initialValue = technology.value;
    const initialUpgrade = technology.upgrade;
    const initialUpgraded = technology.upgraded;
    const initialProduction = Researches$1.getProduction(data, coordinates, bonuses, id);
    // set upgrade
    technology.value = technology.upgraded;
    technology.upgraded += 1;
    technology.upgrade = 1;
    bonuses.researches = Lifeforms$1.Bonuses.Researches.get(data, bonuses.buildings);
    // compute needed values
    const level = technology.upgraded;
    const cost = Researches$1.getCost(data, coordinates, reductions, id);
    const production = Researches$1.getProduction(data, coordinates, bonuses, id).subtract(initialProduction);
    const amortization = cost.toSU(rates) / production.toSU(rates);
    // restore initial values & result return
    technology.value = initialValue;
    technology.upgrade = initialUpgrade;
    technology.upgraded = initialUpgraded;
    bonuses.researches = Lifeforms$1.Bonuses.Researches.get(data, bonuses.buildings);
    return {
      coordinates,
      id,
      level,
      cost,
      production,
      amortization
    };
  }
};

var Increasers = {
  Buildings: Buildings$1,
  Researches: Researches$1
};

function getProduction$2(data, bonuses) {
  const { player, script } = data;
  const { positions, researches } = player;
  const { useResourceBoosters, planetsToIgnoreCount } = script.amortizations.form;
  const result = new Resources();
  for (const coordinates in positions) {
    const position = positions[coordinates];
    const { planet } = position;
    const { boosters } = planet;
    const productions = Productions$1.Mines.get(data, planet);
    result.add(
      Productions$1.Lifeforms.get(productions, bonuses.researches, IDs.resources.increasers),
      Productions$1.Crawlers.get(data, planet, productions, bonuses.researches, Productions$1.Crawlers.getCurrentCount(data, planet, bonuses.researches)),
      Productions$1.Classes.get(data, productions, bonuses.researches)
    );
    if (boosters && useResourceBoosters) {
      result.add(Productions$1.Boosters.get(productions, boosters));
    }
  }
  return result.multiply((Math.round(researches[124].upgraded * .5) + 1 - planetsToIgnoreCount) / Object.keys(positions).length);
}
const Buildings = {
  getCost(data, coordinates, reductions, id) {
    const { technologies } = data.player.positions[coordinates].planet;
    return Costs.Upgrades.get(technologies, id, reductions.buildings[coordinates]);
  },
  get(data, coordinates, bonuses, reductions, id) {
    const position = data.player.positions[coordinates];
    const { technologies } = position.planet;
    const { rates } = data.script;
    const technology = technologies[id];
    // save inital values before upgrade
    const initialValue = technology.value;
    const initialUpgrade = technology.upgrade;
    const initialUpgraded = technology.upgraded;
    const initialProduction = getProduction$2(data, bonuses);
    // set upgrade
    technology.value = technology.upgraded;
    technology.upgraded += 1;
    technology.upgrade = 1;
    bonuses.buildings[coordinates] = Lifeforms$1.Bonuses.Buildings.get(position);
    bonuses.researches = Lifeforms$1.Bonuses.Researches.get(data, bonuses.buildings);
    // compute needed values
    const level = technology.upgraded;
    const cost = Buildings.getCost(data, coordinates, reductions, id);
    const production = getProduction$2(data, bonuses).subtract(initialProduction);
    const amortization = cost.toSU(rates) / production.toSU(rates);
    // restore initial values & result return
    technology.value = initialValue;
    technology.upgrade = initialUpgrade;
    technology.upgraded = initialUpgraded;
    bonuses.buildings[coordinates] = Lifeforms$1.Bonuses.Buildings.get(position);
    bonuses.researches = Lifeforms$1.Bonuses.Researches.get(data, bonuses.buildings);
    return {
      coordinates,
      id,
      level,
      cost,
      production,
      amortization
    };
  }
};
const Researches = {
  getCost(data, coordinates, reductions, id) {
    const { technologies } = data.player.positions[coordinates].planet;
    return Costs.Upgrades.get(technologies, id, reductions.buildings[coordinates]);
  },
  get(data, coordinates, bonuses, reductions, id) {
    const position = data.player.positions[coordinates];
    const { technologies } = position.planet;
    const { rates } = data.script;
    const technology = technologies[id];
    // save inital values before upgrade
    const initialValue = technology.value;
    const initialUpgrade = technology.upgrade;
    const initialUpgraded = technology.upgraded;
    const initialProduction = getProduction$2(data, bonuses);
    // set upgrade
    technology.value = technology.upgraded;
    technology.upgraded += 1;
    technology.upgrade = 1;
    bonuses.researches = Lifeforms$1.Bonuses.Researches.get(data, bonuses.buildings);
    // compute needed values
    const level = technology.upgraded;
    const cost = Researches.getCost(data, coordinates, reductions, id);
    const production = getProduction$2(data, bonuses).subtract(initialProduction);
    const amortization = cost.toSU(rates) / production.toSU(rates);
    // restore initial values & result return
    technology.value = initialValue;
    technology.upgrade = initialUpgrade;
    technology.upgraded = initialUpgraded;
    bonuses.researches = Lifeforms$1.Bonuses.Researches.get(data, bonuses.buildings);
    return {
      coordinates,
      id,
      level,
      cost,
      production,
      amortization
    };
  }
};

var Enhancers = {
  Buildings,
  Researches
};

function getCost$1(data, reductions) {
  return Costs.Upgrades.get(data.player.researches, 122, reductions.researches);
}
function getProduction$1(data) {
  const { positions, researches } = data.player;
  const { planetsToIgnoreCount } = data.script.amortizations.form;
  const result = new Resources();
  for (const coordinates in positions) {
    const { planet } = positions[coordinates];
    const productions = Productions$1.Mines.get(data, planet);
    result.add(Productions$1.Plasma.get(data, productions));
  }
  return result.multiply((Math.round(researches[124].upgraded * .5) + 1 - planetsToIgnoreCount) / Object.keys(positions).length);
}
function get$5(data, reductions) {
  const id = 122;
  const { researches } = data.player;
  const technology = researches[id];
  const { rates } = data.script;
  // save inital values before upgrade
  const initialValue = technology.value;
  const initialUpgrade = technology.upgrade;
  const initialUpgraded = technology.upgraded;
  const initialProduction = getProduction$1(data);
  // set upgrade
  technology.value = technology.upgraded;
  technology.upgraded += 1;
  technology.upgrade = 1;
  // compute needed values
  const level = technology.upgraded;
  const cost = getCost$1(data, reductions);
  const production = getProduction$1(data).subtract(initialProduction);
  const amortization = cost.toSU(rates) / production.toSU(rates);
  // restore initial values & result return
  technology.value = initialValue;
  technology.upgrade = initialUpgrade;
  technology.upgraded = initialUpgraded;
  return {
    id,
    level,
    cost,
    production,
    amortization
  };
}

var Plasma = {
  get: get$5
};

function getCost(data, reductions) {
  const { positions, researches } = data.player;
  const result = new Resources();
  for (const coordinates in positions) {
    const { planet, moon } = positions[coordinates];
    result.add(
      Costs.Upgraded.get(planet.technologies, IDs.upgradables.planet, reductions.buildings[coordinates]),
      Costs.Upgraded.get(planet.technologies, IDs.units.statics)
    );
    if (moon) {
      result.add(
        Costs.Upgraded.get(moon.technologies, IDs.upgradables.moon),
        Costs.Upgraded.get(moon.technologies, IDs.units.statics)
      );
    }
  }
  result.divide(Object.keys(positions).length);
  result.add(Costs.Upgrades.get(researches, 124));
  return result;
}
function getProduction(data, bonuses) {
  const { player, script } = data;
  const { positions, researches } = player;
  const { useResourceBoosters, planetsToIgnoreCount } = script.amortizations.form;
  const result = new Resources();
  for (const coordinates in positions) {
    const position = positions[coordinates];
    const { planet } = position;
    const { lifeform, boosters } = planet;
    const { species } = lifeform;
    const productions = Productions$1.Mines.get(data, planet);
    result.add(
      productions,
      Productions$1.Basic.get(data),
      Productions$1.Lifeforms.get(productions, bonuses.buildings[coordinates], IDs.lifeforms.buildings[species]),
      Productions$1.Lifeforms.get(productions, bonuses.researches, IDs.resources.increasers),
      Productions$1.Crawlers.get(data, planet, productions, bonuses.researches, Productions$1.Crawlers.getCurrentCount(data, planet, bonuses.researches)),
      Productions$1.Plasma.get(data, productions),
      Productions$1.Officers.get(data, productions),
      Productions$1.Classes.get(data, productions, bonuses.researches)
    );
    if (boosters && useResourceBoosters) {
      result.add(Productions$1.Boosters.get(productions, boosters));
    }
  }
  return result.multiply((Math.round(researches[124].upgraded * .5) + 1 - planetsToIgnoreCount) / Object.keys(positions).length);
}
function get$4(data, bonuses, reductions) {
  const id = 124;
  const technology = data.player.researches[id];
  const { rates } = data.script;
  // save inital values before upgrade
  const initialValue = technology.value;
  const initialUpgrade = technology.upgrade;
  const initialUpgraded = technology.upgraded;
  const initialProduction = getProduction(data, bonuses);
  // set upgrade
  technology.upgraded = Math.round(technology.upgraded * .5) * 2 + 1;
  technology.value = Math.max(0, technology.upgraded - 2);
  technology.upgrade = technology.upgraded - technology.value;
  bonuses.researches = Lifeforms$1.Bonuses.Researches.get(data, bonuses.buildings);
  // get result
  const level = `${ technology.upgraded - 1 }/${ technology.upgraded }`;
  const cost = getCost(data, reductions);
  const production = getProduction(data, bonuses).subtract(initialProduction);
  const amortization = cost.toSU(rates) / production.toSU(rates);
  // restore initial values & result return
  technology.value = initialValue;
  technology.upgrade = initialUpgrade;
  technology.upgraded = initialUpgraded;
  bonuses.researches = Lifeforms$1.Bonuses.Researches.get(data, bonuses.buildings);
  return {
    id,
    level,
    cost,
    production,
    amortization
  };
}

var Astrophysics = {
  get: get$4
};

var Technologies = {
	Mines,
	Increasers,
	Enhancers,
	Plasma,
	Astrophysics
};

function removePlanetsToIgnore(data) {
  const { positions } = data.player;
  const { form } = data.script.amortizations;
  const result = [];
  for (const coordinates in positions) {
    if (form[coordinates]) {
      result.push(coordinates);
    }
  }
  for (coordinates of result) {
    delete positions[coordinates];
  }
  form.planetsToIgnoreCount = result.length;
}
function getAll(data) {
  const { positions } = data.player;
  const { form } = data.script.amortizations;
  const bonuses = Lifeforms$1.Bonuses.get(data);
  const reductions = Lifeforms$1.Reductions.get(bonuses);
  const result = [];
  for (const coordinates in positions) {
    const position = positions[coordinates];
    const { lifeform } = position.planet;
    const { species, researches } = lifeform;
    if (form.metalMine) {
      result.push(Technologies.Mines.get(data, coordinates, bonuses, reductions, 1));
    }
    if (form.crystalMine) {
      result.push(Technologies.Mines.get(data, coordinates, bonuses, reductions, 2));
    }
    if (form.deuteriumMine) {
      result.push(Technologies.Mines.get(data, coordinates, bonuses, reductions, 3));
    }
    if (form.lifeformBuildings) {
      for (const id of IDs.lifeforms.buildings[species]) {
        if (IDs.resources.increasers.includes(id)) {
          result.push(Technologies.Increasers.Buildings.get(data, coordinates, bonuses, reductions, id));
        } else if (IDs.resources.enhancers.includes(id)) {
          result.push(Technologies.Enhancers.Buildings.get(data, coordinates, bonuses, reductions, id));
        }
      }
    }
    if (form.lifeformResearches) {
      for (const id of researches) {
        if (IDs.resources.increasers.includes(id)) {
          result.push(Technologies.Increasers.Researches.get(data, coordinates, bonuses, reductions, id));
        } else if (IDs.resources.enhancers.includes(id)) {
          result.push(Technologies.Enhancers.Researches.get(data, coordinates, bonuses, reductions, id));
        }
      }
    }
  }
  if (form.plasma) {
    result.push(Technologies.Plasma.get(data, reductions));
  }
  if (form.astrophysics) {
    result.push(Technologies.Astrophysics.get(data, bonuses, reductions));
  }
  return result;
}
function getNext(technologies) {
  let amortization = Infinity;
  let result;
  for (const technology of technologies) {
    if (technology.amortization < amortization) {
      amortization = technology.amortization;
      result = technology;
    }
  }
  return result;
}
function get$3() {
  const data = Storage.get();
  const { player, script } = data;
  const { positions, researches } = player;
  const result = [];
  removePlanetsToIgnore(data);
  for (let i = 0; i < 50; i++) {
    const next = getNext(getAll(data));
    const technologies = next.coordinates && positions[next.coordinates].planet.technologies || researches;
    const technology = technologies[next.id];
    technology.upgraded = next.id === 124 && Math.round(technology.upgraded * .5) * 2 + 1 || technology.upgraded + 1;
    result.push(next);
  }
  return result;
}

var Amortizations$2 = {
  get: get$3
};

const miniatures = {
  1: 'gf1.geo.gfsrv.net/cdnf0/ab350d9a3da1240ebe36c44fe3e26a',
  2: 'gf2.geo.gfsrv.net/cdn13/fc0b3cbabb11e6835d15a251c93dea',
  3: 'gf2.geo.gfsrv.net/cdnd2/d2c517937cf0726783e1f2f89ce228',
  122: 'gf1.geo.gfsrv.net/cdn6b/60caed2c09b674de10f8315e32c886',
  124: 'gf1.geo.gfsrv.net/cdnf4/29c43039fb192e2af82c78c877c85d'
};

function getHTML$7(data) {
  return `<div id="ic_amortizations-panel" class="ic_panel" data-state="collapsed">
            <h3 class="ic_panel_title"><span></span>${Translation.amortizations}</h3>
            <div class="ic_panel_main">
              <form class="ic_form">
                <fieldset>
                  <button type="button" id="ic_amortizations-panel_settings-button" class="btn_blue ic_button" >${Translation.settings}</button>
                  <button type="button" id="ic_amortizations-panel_update-button" class="btn_blue ic_button tooltipRight" title="⚠ ${Translation.amortizationsWarning}">${Translation.update}</button>
                </fieldset>
              </form>
              <table class="ic_table"><tbody>${getTableHTML(data)}</tbody></table>
            </div>
          </div>`;
}
function getTableHTML(data) {
  const {positions} = data.player;
  const {amortizations, numbers, rates} = data.script;
  const {table} = amortizations;
  let result = '';
  if (table) {
    let i = 0;
    for (const {coordinates, id, level, cost, production, amortization} of table) {
      const isObsolete = coordinates && !positions[coordinates];
      if (!isObsolete) {
        result += `<tr>
                    <td>${++i}.</td>
                    <td>
                      ${(function() {
                        if (coordinates) {
                          return `<div>${positions[coordinates].planet.name}</div>
                                  <div>${coordinates}</div>`;
                      } else {
                          return `<div>${Translation.researches}</div>`;
                      }
                    })()}
                    </td>
                    <td>
                      ${getTechnologyPicture(id)}
                      <div>
                        <div>${Translation[id]}</div>
                        <div>${getTechnologyLevel(level)}</div>
                      </div>
                    </td>
                    <td>
                      <div>${Shared.getNumberHTML(cost.metal, numbers)}</div>
                      <div>${Shared.getNumberHTML(cost.crystal, numbers)}</div>
                      <div>${Shared.getNumberHTML(cost.deuterium, numbers)}</div>
                      <div>${Shared.getNumberHTML(Resources.getSU(cost, rates))}</div>
                    </td>
                    <td>
                      <div>${Shared.getNumberHTML(production.metal, numbers)}</div>
                      <div>${Shared.getNumberHTML(production.crystal, numbers)}</div>
                      <div>${Shared.getNumberHTML(production.deuterium, numbers)}</div>
                      <div>${Shared.getNumberHTML(Resources.getSU(production, rates))}</div>
                    </td>
                    <td>${Types.getDurationString(amortization)}</td>
                  </tr>`;
    }
  }
}
  if (result) {
    result = `<tr><th></th><th></th><th></th><th>${Translation.costs}</th><th>${Translation.productions}</th><th>${Translation.amortizations}</th></tr>
              ${result}`;
}
  return result;
}
function getTechnologyPicture(id) {
  if (IDs.lifeforms.all.includes(id)){
    const abbr = IDs.lifeforms.researches.all.includes(id) ? `<span>${getLifeformResearchAbbreviation(id)}</span>` : '';
    return `<div class="queuePic lifeformqueue lifeformTech${id}">${abbr}</div>`;
  } else {
    return `<img class="queuePic" width="40" height="40" src="http://${miniatures[id]}.jpg"></img>`;
  }
}
function getLifeformResearchAbbreviation(id) {
  const root = id % 1_000 - 200;
  const tier = Math.ceil(root / 6);
  const slot = root % 6 || 6;
  return `${tier}.${slot}`;
}
function getTechnologyLevel(value) {
  const prefix = typeof value === 'number' && Translation.level || Translation.levels;
  return `${prefix} ${value}`;
}
function setEvents$4() {
  setUpdateEvent();
  setSettingsEvent();
}
function setUpdateEvent() {
  document.body.querySelector('#ic_amortizations-panel_update-button').addEventListener('click', function() {
    const data = Storage.get();
    data.script.amortizations.table = Amortizations$2.get();
    document.querySelector('#ic_amortizations-panel tbody').innerHTML = getTableHTML(data);
    Storage.set(data);
  });
}
function setSettingsEvent() {
  document.body.querySelector('#ic_amortizations-panel_settings-button').addEventListener('click', function() {
    document.body.querySelector('#ic_amortizations-panel_settings').showModal();
  });
}

var Amortizations$1 = {
  getHTML: getHTML$7,
  setEvents: setEvents$4
};

function getTitleSection$2(value) {
  const date = new Date();
  const url = `[url=http://board.fr.ogame.gameforge.com/index.php?thread/746302-infocompte/]InfoCompte ${ GM_info.script.version }[/url]`;
  const title = getSized(getColored$2(value, Colors.main), 24);
  const stamp = `${ Translation.generatedOn } ${ date.toLocaleDateString('fr-FR') } ${ Translation.at } ${ date.toLocaleTimeString('de-DE', { timeStyle: 'short' }) } ${ Translation.with } ${ url }`;
  return `${ title }\n${ stamp }\n\n`;
}
function getClassesSection(data) {
  let result = '';
  if (data.player.class) {
    const value = Translation[`${ data.player.class }PlayerClass`];
    result += getColored$2(value, Colors.main);
  }
  if (data.player.alliance.class) {
    const value = Translation[`${ data.player.alliance.class }AllicanceClass`];
    const colored = getColored$2(value, Colors.main);
    result += result ? ` & ${ colored }` : colored;
  }
  if (result) {
    result = getSized(result, 14) + '\n\n';
  }
  return result;
}
function getLifeformLevelsSection(data) {
  const { lifeforms } = data.player;
  let result = '';
  for(const key in lifeforms) {
    if (key !== 'none') {
      const lifeform = lifeforms[key];
      const level = getColored$2(lifeform.level, Colors.main);
      const current = Types.getFullNumberString(lifeform.xp.current);
      const maximum = Types.getFullNumberString(lifeform.xp.maximum);
      result += `${ Translation[key] } : ${ level } · ${ current }/${ maximum } xp\n`;
    }
  }
  if (result) {
    const subtitle = getSectionTitle$1(Translation.lifeformLevels);
    result = `${ subtitle + result }\n`;
  }
  return result;
}
function getSectionTitle$1(value) {
  return getSized(getColored$2(value, Colors.main), 18) + '\n';
}
function getPadding$2(value, length) {
  const count = Math.max(0, length - value.toString().length);
  return '_'.repeat(count);
}
function getColored$2(value, color) {
  return `[color=${ color }]${ value }[/color]`;
}
function getSized(value, size) {
  return `[size=${ size }]${ value }[/size]`;
}
function getAverage$1(array) {
  return Math.round(getSum$1(array) / array.length) + ' Ø';
}
function getSum$1(array) {
  return array.reduce(function(previous, current) {
    return previous + current;
  }, 0);
}

var Exports$2 = {
  getTitleSection: getTitleSection$2,
  getClassesSection,
  getLifeformLevelsSection,
  getSectionTitle: getSectionTitle$1,
  getPadding: getPadding$2,
  getColored: getColored$2,
  getAverage: getAverage$1,
  getSum: getSum$1
};

const { getFullNumberString: getFullNumberString$1, getTruncatedNumberString: getTruncatedNumberString$1, getPercentString } = Types;
const { getPadding: getPadding$1, getColored: getColored$1, getAverage, getSum } = Exports$2;

function get$2(data) {
  return getTitleSection$1(data)
       + Exports$2.getClassesSection(data)
       + Exports$2.getLifeformLevelsSection(data)
       + getPointsSection$1(data)
       + getProductionsSection$1(data)
       + getTemperaturesSection(data)
       + getPlanetFieldsSection(data)
       + getPlanetBuildingsSection(data)
       + getMoonBuildingsSection(data)
       + getLifeformBuildingsSection(data)
       + getLifeformResearches(data)
       + getResearchesSection$1(data)
       + getShipsSection(data)
       + getPlanetDefencesSection(data)
       + getMoonDefencesSection(data);
}
function getTitleSection$1(data) {
  const { player, universe } = data;
  return Exports$2.getTitleSection(`${ Translation.empireOf } ${ player.name } ${ Translation.on } ${ universe.name }.${ universe.language }`);
}
function getPointsSection$1(data) {
  const { values, percents, total } = data.player.points;
  return getBlockSection(Translation.pointsRepartition, [
    [Translation.mines, getTruncatedNumberString$1(values.mines.all), getPercentString(percents.mines.all)],
    [Translation.planetBuildings, getTruncatedNumberString$1(values.buildings.planet), getPercentString(percents.buildings.planet)],
    [Translation.moonBuildings, getTruncatedNumberString$1(values.buildings.moon), getPercentString(percents.buildings.moon)],
    [Translation.lifeformBuildings, getTruncatedNumberString$1(values.lifeforms.buildings), getPercentString(percents.lifeforms.buildings)],
    [Translation.lifeformResearches, getTruncatedNumberString$1(values.lifeforms.researches), getPercentString(percents.lifeforms.researches)],
    [Translation.researches, getTruncatedNumberString$1(values.researches.all), getPercentString(percents.researches.all)],
    [Translation.ships, getTruncatedNumberString$1(values.units.ships.all), getPercentString(percents.units.ships.all)],
    [Translation.defences, getTruncatedNumberString$1(values.units.defences.all), getPercentString(percents.units.defences.all)],
    [Translation.total, getTruncatedNumberString$1(total), `${ getPercentString(percents.indestructibles) } ${ Translation.indestructibles.toLowerCase() }`]
  ]);
}
function getProductionsSection$1(data) {
  const { metal, crystal, deuterium } = data.player.productions.total;
  return getBlockSection(Translation.dailyProductions, [
    [Translation.metal, getTruncatedNumberString$1(metal * 24)],
    [Translation.crystal, getTruncatedNumberString$1(crystal * 24)],
    [Translation.deuterium, getTruncatedNumberString$1(deuterium * 24)]
  ]);
}
function getTemperaturesSection(data) {
  const { positions } = data.player;
  const values = [];
  for(const coordinates in positions) {
    const { temperature } = positions[coordinates].planet;
    values.push(temperature);
  }
  const rows = {
    '': {
      values
    }
  };
  return getInlineSection(Translation.maximumTemperatures, rows, getAverage, 0);
}
function getPlanetFieldsSection(data) {
  const { positions } = data.player;
  const maximum = [];
  const used = [];
  for(const coordinates in positions) {
    const { fields } = positions[coordinates].planet;
    maximum.push(fields.maximum);
    used.push(fields.used);
  }
  const rows = {
    [Translation.maximum]: {
      values: maximum
    },
    [Translation.used]: {
      values: used
    }
  };
  return getInlineSection(Translation.planetFields, rows, getAverage, 3);
}
function getPlanetBuildingsSection(data) {
  const ids = [...IDs.mines.all, ...IDs.buildings.planet];
  const rows = getInlineSectionRows(data, 'planet', ids);
  return getInlineSection(Translation.planetBuildings, rows, getSum, 2);
}
function getLifeformBuildingsSection(data) {
  const rows = getInlineSectionRows(data, 'planet', IDs.lifeforms.buildings.all);
  return getInlineSection(Translation.lifeformBuildings, rows, getSum, 2);
}
function getLifeformResearches(data) {
  const rows = getInlineSectionRows(data, 'planet', IDs.lifeforms.researches.all);
  return getInlineSection(Translation.lifeformResearches, rows, getSum, 2);
}
function getPlanetDefencesSection(data) {
  const rows = getInlineSectionRows(data, 'planet', IDs.units.defences.all);
  return getInlineSection(Translation.planetDefences, rows, getSum, 8);
}
function getMoonBuildingsSection(data) {
  const rows = getInlineSectionRows(data, 'moon', IDs.buildings.moon);
  return getInlineSection(Translation.moonBuildings, rows, getSum, 2);
}
function getMoonDefencesSection(data) {
  const rows = getInlineSectionRows(data, 'moon', IDs.units.defences.all);
  return getInlineSection(Translation.planetDefences, rows, getSum, 8);
}
function getResearchesSection$1(data) {
  // add test if there is no researches before return result
  const { researches } = data.player;
  const rows = [];
  for(const key in researches) {
    const research = researches[key];
    const row = [Translation[key]];
    if (research.upgrade) {
      row.push(research.upgraded, '', Colors.upgrade);
    } else {
      row.push(research.value);
    }
    rows.push(row);
  }
  return getBlockSection(Translation.researches, rows);
}
function getShipsSection(data) {
  const { positions } = data.player;
  const ids = IDs.units.ships.all;
  const values = {};
  const upgraded = {};
  const rows = [];
  for(const coordinates in positions) {
    const { planet, moon } = positions[coordinates];
    for(const key of ids) {
      const technology = planet.technologies[key];
      if (technology) {
        values[key] = values[key] + technology.upgraded || 0;
        upgraded[key] += technology.upgrade ? true : false;
      }
    }
    if (moon) {
      for(const key of ids) {
        const technology = moon.technologies[key];
        if (technology) {
          values[key] = values[key] + technology.upgraded || 0;
          upgraded[key] += technology.upgrade ? true : false;
        }
      }
    }
  }
  for(const key in values) {
    let value = values[key];
    if (value) {
      const row = [];
      row[0] = Translation[key];
      row[1] = Types.getFullNumberString(value);
      if (upgraded[key]) {
        row[2] = Colors.upgrade;
      }
      rows.push(row);
    }
  }
  return getBlockSection(Translation.ships, rows);
}
function getBlockSection(title, rows) {
  let result = '';
  for(const [key, value, suffix, color] of rows) {
    result += `${ key } : `;
    result += getColored$1(value, color || Colors.main);
    if (suffix) {
      result += ` · ${ suffix }`;
    }
    result += `\n`;
  }
  if (result) {
    result = Exports$2.getSectionTitle(title)
           + result
           + '\n';
  }
  return result;
}
function getInlineSection(title, rows, fn, digits) {
  let result = '';
  for(const key in rows) {
    const { values, upgrades } = rows[key];
    let total = fn(values);
    if (total) {
      let hasUpgrade = false;
      for(let i = 0; i < values.length; i++) {
        let value = values[i];
        const padding = getPadding$1(value, digits);
        if (upgrades?.[i]) {
          hasUpgrade = true;
          value = getColored$1(value, Colors.upgrade);
        }
        result += `${ padding + value }, `;
      }
      total = getFullNumberString$1(total);
      total = getColored$1(total, hasUpgrade ? Colors.upgrade : Colors.main);
      result = result.slice(0, -2);
      result += ` · ${ total } ${ key }\n`;
    }
  }
  if (result) {
    result = Exports$2.getSectionTitle(title)
           + result
           + '\n';
  }
  return result;
}
function getInlineSectionRows(data, type, ids) {
  const { positions } = data.player;
  const result = {};
  for(const coordinates in positions) {
    const body = positions[coordinates][type];
    if (body) {
      for(const id of ids) {
        const technology = body.technologies[id];
        if (technology) {
          const key = Translation[id];
          result[key] ||= {
            values: [],
            upgrades: []
          };
          if (technology.upgrade) {
            result[key].values.push(technology.upgraded);
            result[key].upgrades.push(true);
          } else {
            result[key].values.push(technology.value);
            result[key].upgrades.push(false);
          }
        }
      }
    }
  }
  return result;
}

var Empire = {
  get: get$2
};

const { getFullNumberString, getTruncatedNumberString } = Types;
const { getSectionTitle, getPadding, getColored } = Exports$2;

function get$1(data) {
  return getTitleSection(data)
       + Exports$2.getClassesSection(data)
       + Exports$2.getLifeformLevelsSection(data)
       + getPointsSection(data)
       + getPlanetsSection(data)
       + getResearchesSection(data)
       + getProductionsSection(data)
}
function getTitleSection(data) {
  const { player, universe } = data;
  return Exports$2.getTitleSection(`${ Translation.productionOf } ${ player.name } ${ Translation.on } ${ universe.name }.${ universe.language }`);
}
function getPlanetsSection(data) {
  const { positions } = data.player;
  let content = '';
  let i = 1;
  for (const coordinates in positions) {
    const { position, temperature, technologies } = positions[coordinates].planet;
    content += getPlanetNumber(i++);
    content += getPlanetPosition(position);
    content += getPlanetTechnology(technologies[1], Colors.metal, 2);
    content += getPlanetTechnology(technologies[2], Colors.crystal, 2);
    content += getPlanetTechnology(technologies[3], Colors.deuterium, 2);
    content += getPlanetTechnology(technologies[217], Colors.crawlers, 0);
    content += getPlanetTemperature(temperature);
  }
  return getSectionTitle(Translation.planets)
       + content
       + '\n';
}
function getPointsSection(data) {
  const { mines } = data.player.points.values;
  const metal = getColored(getTruncatedNumberString(mines.metal), Colors.metal);
  const crystal = getColored(getTruncatedNumberString(mines.crystal), Colors.crystal);
  const deuterium = getColored(getTruncatedNumberString(mines.deuterium), Colors.deuterium);
  const total = getTruncatedNumberString(mines.all);
  return getSectionTitle(Translation.pointsRepartition)
       + `${ Translation[1] } : ${ metal }\n`
       + `${ Translation[2] } : ${ crystal }\n`
       + `${ Translation[3] } : ${ deuterium }\n`
       + `${ Translation.total } : ${ total }\n\n`;
}
function getProductionsSection(data) {
  const { mines, lifeforms, premium, total } = data.player.productions;
  const mineMetal = getDailyProductionString(mines.metal.metal, Colors.metal);
  const mineCrystal = getDailyProductionString(mines.crystal.crystal, Colors.crystal);
  const mineDeuterium = getDailyProductionString(mines.deuterium.deuterium, Colors.deuterium);
  const lifeformsMetal = getDailyProductionString(lifeforms.metal, Colors.metal);
  const lifeformsrystal = getDailyProductionString(lifeforms.crystal, Colors.crystal);
  const lifeformsDeuterium = getDailyProductionString(lifeforms.deuterium, Colors.deuterium);
  const premiumMetal = getDailyProductionString(premium.metal, Colors.metal);
  const premiumCrystal = getDailyProductionString(premium.crystal, Colors.crystal);
  const premiumDeuterium = getDailyProductionString(premium.deuterium, Colors.deuterium);
  const totalMetal = getDailyProductionString(total.metal, Colors.metal);
  const totalCrystal = getDailyProductionString(total.crystal, Colors.crystal);
  const totalDeuterium = getDailyProductionString(total.deuterium, Colors.deuterium);
  return getSectionTitle(Translation.dailyProductions)
       + `${ Translation.mines } : ${ mineMetal }, ${ mineCrystal }, ${ mineDeuterium }\n`
       + `${ Translation.lifeforms } : ${ lifeformsMetal }, ${ lifeformsrystal }, ${ lifeformsDeuterium }\n`
       + `${ Translation.premium } : ${ premiumMetal }, ${ premiumCrystal }, ${ premiumDeuterium }\n`
       + `${ Translation.total } : ${ totalMetal }, ${ totalCrystal }, ${ totalDeuterium }\n\n`;
}
function getResearchesSection(data) {
  const { researches } = data.player;
  const research = researches[122];
  let result = '';
  if (research) {
    let value;
    let color;
    if (research.upgrade) {
      value = research.upgraded;
      color = Colors.upgrade;
    } else {
      value = research.value;
      color = Colors.main;
    }
    value = getColored(value, color);
    result += `${ Translation[122] } : ${ value }\n`;
  }
  if (result) {
    result = getSectionTitle(Translation.researches)
           + result
           + '\n';
  }
  return result;
}
function getPlanetNumber(value) {
  return `${ value.toString().padStart(2, '0') }. `;
}
function getPlanetPosition(value) {
  return `P${ value.toString().padStart(2, '0') }, `;
}
function getPlanetTechnology(technology, color, padding) {
  let value;
  if (technology.upgrade) {
    value = technology.upgraded;
    color = Colors.upgrade;
  } else {
    value = technology.value;
  }
  return getPadding(value, padding) + getColored(Types.getFullNumberString(value), color) + ', ';
}
function getPlanetTemperature(value) {
  return getColored(value + ' °C', '#f5bbb4') + '\n';
}
function getDailyProductionString(value, color) {
  return getColored(getTruncatedNumberString(value * 24), color);
}

var Production = {
  get: get$1
};

var Exports$1 = {
	Empire,
	Production
};

const keyframes = {
  fadeIn: {
    opacity: [0, 1]
  },
  fadeOut: {
    opacity: [1, 0]
  }
};
const options = {
  slow: {
    delay: 1_000,
    duration: 750
  }
};

function getHTML$6(data) {
  return `<div id="ic_exports-panel" class="ic_panel" data-state="collapsed">
            <h3 class="ic_panel_title"><span></span>${ Translation.exports }</h3>
            <div class="ic_panel_main">
              <form class="ic_form">
                <fieldset>
                  <label><input type="radio" name="format" value="bbcode" checked>${ Translation.textWithBBCode }</label>
                  <label><input type="radio" name="format" value="text">${ Translation.plainText }</label>
                </fieldset>
                <fieldset>
                  <button type="button" id="ic_empire-export-button" class="btn_blue ic_button">${ Translation.empire }</button>
                  <button type="button" id="ic_production-export-button" class="btn_blue ic_button">${ Translation.production }</button>
                </fieldset>
              </form>
              <div id="ic_exports-notification">${ Translation.exportNotification }</div>
            </div>
          </div>`;
}
function setEvents$3() {
  document.body.querySelector('#ic_exports-panel form').addEventListener('click', function(event) {
    const { id } = event.target;
    if (id === 'ic_empire-export-button') {
      const result = Exports$1.Empire.get(Storage.get());
      setExportToClipboard(result);
    } else if (id === 'ic_production-export-button') {
      const result = Exports$1.Production.get(Storage.get());
      setExportToClipboard(result);
    }
  });
}
function setExportToClipboard(text) {
  const { value } = document.querySelector('#ic_exports-panel [name=format]:checked');
  if (value === 'text') {
    text = text.replace(/\[\/?[^\]]*\]/g, '');
  }
  navigator.clipboard.writeText(text);
  animateNotification();
}
async function animateNotification() {
  const form = document.querySelector('#ic_exports-panel form');
  const notification = document.querySelector('#ic_exports-notification');
  const { fadeIn, fadeOut } = keyframes;
  await form.animate(fadeOut, 250).finished;
  form.style.display = 'none';
  notification.style.display = 'inline-flex';
  await notification.animate(fadeIn, 500).finished;
  await notification.animate(fadeOut, options.slow).finished;
  notification.style.display = 'none';
  form.style.display = 'flex';
  form.animate(fadeIn, 250);
}

var Exports = {
  getHTML: getHTML$6,
  setEvents: setEvents$3
};

const root = `${window.location.href.split('?')[0]}?`;

function getHTML$5(data) {
  const { positions } = data.player;
  const { needed } = data.script;
  let result = '';
  result += getLifeformResearchesHTML$1(needed);
  result += getProductionsHTML$1(needed);
  result += getMiscellaneousHTML(needed, positions);
  if (result) {
    result = `<div id="ic_needed-panel" class="ic_panel" data-state="expanded">
              <h3 class="ic_panel_title"><span></span>${ Translation.neededData }</h3>
              <div class="ic_panel_main">${ result  }</div>
            </div>`;
  }
  return result;
}
function getLifeformResearchesHTML$1(data) {
  let result = '';
  if (data.lifeforms.researches.length) {
    const links = [];
    for (const [id, name] of data.lifeforms.researches) {
      links.push(`<a href="${ root }page=ingame&component=lfresearch&cp=${ id }">${ name }</a>`);
    }
    result = `<section><h4>${ Translation.lifeformResearches }</h4><p>${ links.join(', ') }.</p></section>`;
  }
  return result;
}
function getProductionsHTML$1(data) {
  let result = '';
  if (data.productions.length) {
    const links = [];
    for (const [id, name] of data.productions) {
      links.push(`<a href="${ root }page=ingame&component=resourcesettings&cp=${ id }">${ name }</a>`);
    }
    result = `<section><h4>${ Translation.resourceSettings }</h4><p>${ links.join(', ') }.</p></section>`;
  }
  return result;
}
function getMiscellaneousHTML(data, positions) {
  const links = [];
  let result = '';
  if (data.empire.planet) {
    links.push(`<a href="${ root }page=standalone&component=empire" target="_blank">${ Translation.empire } (${ Translation.planets })</a>`);
  }
  if (data.empire.moon) {
    links.push(`<a href="${ root }page=standalone&component=empire&planetType=1" target="_blank">${ Translation.empire } (${ Translation.moons })</a>`);
  }
  if (data.lifeforms.settings) {
    const id = getPlanetID(positions);
    links.push(`<a href="${ root }page=ingame&component=lfsettings&cp=${ id }">${ Translation.lifeformSettings }</a>`); // an planet id is needed because there is no lfsettings if player is on a moon
  }
  if (data.alliance) {
    links.push(`<a href="${ root }page=ingame&component=alliance">${ Translation.alliance }</a>`);
  }
  if (data.highscores) {
    links.push(`<a href="${ root }page=highscore&category=1">${ Translation.highscore }</a>`);
  }
  if (links.length) {
    result = `<section><h4>${ Translation.miscellaneous }</h4><p>${ links.join(', ') }.</p></section>`;
  }
  return result;
}
function getPlanetID(positions) {
  const type = document.querySelector('[name=ogame-planet-type]').content;
  if (type === 'moon') {
    const coordinates = document.querySelector('[name=ogame-planet-coordinates]').content;
    return positions[coordinates].planet.id;
  } else {
    return parseInt(document.querySelector('[name=ogame-planet-id]').content);
  }
}

var Needed = {
  getHTML: getHTML$5
};

function getHTML$4(data) {
  return `<div id="ic_positions-points-panel" class="ic_panel" data-state="collapsed">
            <h3 class="ic_panel_title"><span></span>${ Translation.planetsPointsRepartition }</h3>
            <div class="ic_panel_main">
              <table class="ic_table">
                ${(function() {
                  const { positions } = data.player;
                  let result = '';
                  for (const coordinates in positions) {
                    const position = positions[coordinates];
                    result += `<tr>
                                <th>${ coordinates }</th>
                                <td>${ getNamesHTML(position) }</td>
                                <td>${ getMinesHTML(position) }</td>
                                <td>${ getBuildingsHTML(position) }</td>
                                <td>${ getLifeformBuildingsHTML(position) }</td>
                                <td>${ getLifeformResearchesHTML(position) }</td>
                                <td>${ getDefencesHTML(position) }</td>
                                <td>${ getTotalHTML(position) }</td>
                              </tr>`;
                  }
                  return result;
                })()}
              </table>
            </div>
          </div>`;
}

function getNamesHTML(position) {
  const { planet, moon } = position;
  let result = `<div>${ planet.name }</div>`;
  if (moon) {
    result += `<div>${ moon.name }</div>`;
  }
  return result;
}
function getMinesHTML(position) {
  const points = Shared.getNumberHTML(position.planet.points.values.mines.all);
  return `<div>${ points }</div>`;
}
function getBuildingsHTML(position) {
  const { planet, moon } = position;
  const points = Shared.getNumberHTML(planet.points.values.buildings.all);
  let result = `<div>${ points }</div>`;
  if (moon) {
    const points = Shared.getNumberHTML(moon.points.values.buildings.all);
    result += `<div>${ points }</div>`;
  }
  return result;
}
function getLifeformBuildingsHTML(position) {
  const points = Shared.getNumberHTML(position.planet.points.values.lifeforms.buildings);
  return `<div>${ points }</div>`;
}
function getLifeformResearchesHTML(position) {
  const points = Shared.getNumberHTML(position.planet.points.values.lifeforms.researches);
  return `<div>${ points }</div>`;
}
function getDefencesHTML(position) {
  const { planet, moon } = position;
  const points = Shared.getNumberHTML(planet.points.values.units.defences.all);
  let result = `<div>${ points }</div>`;
  if (moon) {
    const points = Shared.getNumberHTML(moon.points.values.units.defences.all);
    result += `<div>${ points }</div>`;
  }
  return result;
}
function getTotalHTML(position) {
  const { planet, moon } = position;
  const points = Shared.getNumberHTML(planet.points.values.statics);
  const percent = Types.getPercentString(planet.points.percents.statics);
  let result = `<div>${ points } — <span class="ic_percent">${ percent }</span></div>`;
  if (moon) {
    const points = Shared.getNumberHTML(moon.points.values.statics);
    const percent = Types.getPercentString(moon.points.percents.statics);
    result +=`<div>${ points } — <span class="ic_percent">${ percent }</span></div>`;
  }
  return result;
}

var Positions = {
  getHTML: getHTML$4
};

function getHTML$3(data) {
  return `<div id="ic_productions-panel" class="ic_panel" data-state="collapsed">
            <h3 class="ic_panel_title"><span></span>${ Translation.dailyProductions }</h3>
            <div class="ic_panel_main"><table class="ic_table">${ getRowsHTML(data) }</table></div>
          </div>`;
}
function getRowsHTML(data) {
  const { basic, mines, fusion, lifeforms, crawlers, plasma, classes, premium, total } = data.player.productions;
  const { rates } = data.script;
  return `<tr><th>${ Translation.basicIncome }</th>${ getProductionsHTML(basic, total, rates) }</tr>
          <tr><th>${ Translation.mines }</th>${ getProductionsHTML(mines.total, total, rates) }</tr>
          <tr><th>${ Translation[12] }</th>${ getProductionsHTML(fusion, total, rates) }</tr>
          <tr><th>${ Translation.lifeforms }</th>${ getProductionsHTML(lifeforms, total, rates) }</tr>
          <tr><th>${ Translation[217] }</th>${ getProductionsHTML(crawlers, total, rates) }</tr>
          <tr><th>${ Translation[122] }</th>${ getProductionsHTML(plasma, total, rates) }</tr>
          <tr><th>${ Translation.classes }</th>${ getProductionsHTML(classes.total, total, rates) }</tr>
          <tr><th>${ Translation.premium }</th>${ getProductionsHTML(premium, total, rates) }</tr>
          <tr><th>${ Translation.total }</th>${ getProductionsHTML(total, total, rates) }</tr>`;
}
function getProductionsHTML(production, total, rates) {
  const dmp = production.metal * 24;
  const dmt = total.metal * 24;
  const dcp = production.crystal * 24;
  const dct = total.crystal * 24;
  const ddp = production.deuterium * 24;
  const ddt = total.deuterium * 24;
  const dtp = Resources.getSU(production, rates) * 24;
  const dtt = Resources.getSU(total, rates) * 24;
  return `<td><div>${ Shared.getNumberHTML(dmp) }</div><div>${ Types.getPercentString(dmp / dmt) }</div></td>
          <td><div>${ Shared.getNumberHTML(dcp) }</div><div>${ Types.getPercentString(dcp / dct) }</div></td>
          <td><div>${ Shared.getNumberHTML(ddp) }</div><div>${ Types.getPercentString(ddp / ddt) }</div></td>
          <td><div>${ Shared.getNumberHTML(dtp) }</div><div>${ Types.getPercentString(dtp / dtt) }</div></td>`;
}

var Productions = {
  getHTML: getHTML$3
};

var Panels = {
  Account,
  Amortizations: Amortizations$1,
  Exports,
  Needed,
  Positions,
  Productions,
  Shared
};

function init$5(data) {
  if (currentPage === 'overview') {
    const { useCompactNumbers, placeAccountOverviewOnTop } = data.script;
    Panels.Shared.setCompactNumbers(useCompactNumbers);
    const template = document.createElement('template');
    template.innerHTML = getHTML$2(data);
    if (placeAccountOverviewOnTop) {
      document.querySelector('#overviewcomponent').prepend(template.content);
    } else {
      document.querySelector('#middle').appendChild(template.content);
    }
    Panels.Shared.setCollapseStates(data);
    setEvents$2();
  }
}
function getHTML$2(data) {
  const { placeAccountOverviewOnTop } = data.script;
  const positionClass = placeAccountOverviewOnTop && 'ic_top-box' || 'ic_bottom-box';
  return `<div class="ic_box ${ positionClass }">
            <h3 class="ic_box_title">${ Translation.accountOverview }</h3>
            ${ Panels.Needed.getHTML(data) }
            ${ Panels.Account.getHTML(data) }
            ${ Panels.Positions.getHTML(data) }
            ${ Panels.Productions.getHTML(data) }
            ${ Panels.Amortizations.getHTML(data) }
            ${ Panels.Exports.getHTML(data) }
          </div>`;
}
function setEvents$2() {
  Panels.Shared.setEvents();
  Panels.Amortizations.setEvents();
  Panels.Exports.setEvents();
}

var OverviewBox = {
  init: init$5
};

function init$4(data) {
  const template = document.createElement('template');
  template.innerHTML = getHTML$1(data);
  document.body.appendChild(template.content);
  setEvents$1();
}
function getHTML$1(data) {
  const { form } = data.script.amortizations;
  return `<dialog id="ic_amortizations-panel_settings" class="ic_dialog">
            <h1>${ Translation.amortizationsSettings }<span id="ic_amortizations-panel_close-button" class="ui-icon ui-icon-closethick"></span></h1>
            <form class="ic_form">
              <fieldset>
                <legend>${ Translation.technologies }</legend>
                <fieldset>
                  <label>
                    <input type="checkbox" value="metalMine" ${ form.metalMine && 'checked' || '' }>
                    ${ Translation[1] }
                  </label>
                  <label>
                    <input type="checkbox" value="crystalMine" ${ form.crystalMine && 'checked' || '' }>
                    ${ Translation[2] }
                  </label>
                  <label>
                    <input type="checkbox" value="deuteriumMine" ${ form.deuteriumMine && 'checked' || '' }>
                    ${ Translation[3] }
                  </label>
                </fieldset>
                <fieldset>
                  <label>
                    <input type="checkbox" value="lifeformBuildings" ${ form.lifeformBuildings && 'checked' || '' }>
                    ${ Translation.lifeformBuildings }
                  </label>
                  <label>
                    <input type="checkbox" value="lifeformResearches" ${ form.lifeformResearches && 'checked' || '' }>
                    ${ Translation.lifeformResearches }
                  </label>
                </fieldset>
                <fieldset>
                  <label>
                    <input type="checkbox" value="plasma" ${ form.plasma && 'checked' || '' }>
                    ${ Translation[122] }
                  </label>
                  <label>
                    <input type="checkbox" value="astrophysics" ${ form.astrophysics && 'checked' || '' }>
                    ${ Translation[124] }
                  </label>
                </fieldset>
              </fieldset>
              <fieldset>
                <legend>${ Translation.planetsToIgnore }</legend>
                ${(function() {
                  const { positions } = data.player;
                  let result = '';
                  for (const coordinates in positions) {
                    const { name } = positions[coordinates].planet;
                    result += `<label><input type="checkbox" value="${ coordinates }" ${ form[coordinates] && 'checked' || '' }>${ name } - ${ coordinates }</label>`;
                  }
                  return result;
                })()}
              </fieldset>
              <fieldset>
                <legend>${ Translation.miscellaneous }</legend>
                  <label>
                    <input type="checkbox" value="useResourceBoosters" ${ form.useResourceBoosters && 'checked' || '' }>
                    ${ Translation.useResourceBoosters }
                  </label>
              </fieldset>
            </form>
          </dialog>`;
}
function setEvents$1() {
  setFormEvent$1();
  setCloseEvent$1();
}
function setFormEvent$1() {
  const dialog = document.body.querySelector('#ic_amortizations-panel_settings');
  const form = dialog.querySelector('form');
  dialog.addEventListener('close', function() {
    const data = Storage.get();
    const { amortizations } = data.script;
    for (const { value, checked } of form.querySelectorAll('input')) {
      amortizations.form[value] = checked;
    }
    Storage.set(data);
  });
}
function setCloseEvent$1() {
  document.body.addEventListener('click', function(event) {
    const { target } = event;
    const dialog = document.body.querySelector('#ic_amortizations-panel_settings');
    if (target.id === 'ic_amortizations-panel_close-button' || target.contains(dialog)) {
      dialog.close();
    }
  });
}

var Amortizations = {
  init: init$4
};

function init$3(data) {
  const template = document.createElement('template');
  template.innerHTML = getHTML(data);
  document.body.appendChild(template.content);
  setEvents();
}
function getHTML(data) {
  const { colors, rates, useCompactNumbers, placeAccountOverviewOnTop } = data.script;
  return `<dialog id="ic_settings" class="ic_dialog">
            <h1>${ Translation.settings }<span id="ic_settings_close-button" class="ui-icon ui-icon-closethick"></span></h1>
            <form class="ic_form">
              <fieldset id="ic_settings_colors">
                <legend>${ Translation.colors }</legend>
                ${(function() {
                  let result = '';
                  for (const key in colors) {
                    result += `<label>${ Translation[key] }<input type="color" value="${ colors[key] }" data-key="${ key }"></label>`;
                  }
                  return result;
                })()}
              </fieldset>
              <fieldset id="ic_settings_rates">
                <legend>${ Translation.rates }</legend>
                <label>${ Translation.metal }<input type="number" value="${ rates.metal }" data-key="metal"></label>
                <label>${ Translation.crystal }<input type="number"value="${ rates.crystal }" data-key="crystal"></label>
                <label>${ Translation.deuterium }<input type="number" value="1" disabled></label>
              </fieldset>
              <fieldset id="ic_settings_standardUnit">
                <legend>${ Translation.standardUnit }</legend>
                <label><input type="radio" name="standardUnit" value="metal" ${ rates.unit === 'metal' && 'checked' || '' }>${ Translation.metal }</label>
                <label><input type="radio" name="standardUnit" value="crystal" ${ rates.unit === 'crystal' && 'checked' || '' }>${ Translation.crystal }</label>
                <label><input type="radio" name="standardUnit" value="deuterium" ${ rates.unit === 'deuterium' && 'checked' || '' }>${ Translation.deuterium }</label>
              </fieldset>
              <fieldset>
                <legend>${ Translation.miscellaneous }</legend>
                <label><input type="checkbox" id="ic_settings_use-compact-numbers" ${ useCompactNumbers && 'checked' || '' }>${ Translation.useCompactNumbers }</label>
                <label><input type="checkbox" id="ic_settings_place-account-overview-on-top" ${ placeAccountOverviewOnTop && 'checked' || '' }>${ Translation.placeAccountOverviewOnTop }</label>
              </fieldset>
            </form>
            <button type="button" id="ic_settings_clear-button" class="btn_blue">${ Translation.clearAllData }</button>
            <div id="ic_support-links">
              <div><a href="http://hero.li/OGame-The-Stubbs" target="_blank">${ Translation.gameforgeAffiliateLink}</a> 🔥</div>
              <div><a href="http://ko-fi.com/A0A4DEZRA" target="_blank">${ Translation.kofi }</a> ❤️</div>
            </div>
          </dialog>`;
}
function setEvents() {
  setFormEvent();
  setResetEvent();
  setCloseEvent();
}
function setFormEvent() {
  const dialog = document.body.querySelector('#ic_settings');
  const form = dialog.querySelector('form');
  dialog.addEventListener('close', function() {
    const data = Storage.get();
    const { script } = data;
    for (const { dataset, value } of form.querySelectorAll('#ic_settings_colors [type=color]')) {
      script.colors[dataset.key] = value;
    }
    for (const { dataset, value } of form.querySelectorAll('#ic_settings_rates [type=number]:not(:disabled)')) {
      script.rates[dataset.key] = parseFloat(value);
    }
    script.rates.unit = form.querySelector('#ic_settings_standardUnit [type=radio]:checked').value;
    script.useCompactNumbers = form.querySelector('#ic_settings_use-compact-numbers').checked;
    script.placeAccountOverviewOnTop = form.querySelector('#ic_settings_place-account-overview-on-top').checked;
    Storage.set(data);
  });
}
function setResetEvent() {
  document.body.querySelector('#ic_settings_clear-button').addEventListener('click', function() {
    Storage.clear();
    location.reload();
  });
}
function setCloseEvent() {
  document.body.addEventListener('click', function(event) {
    const { target } = event;
    const dialog = document.body.querySelector('#ic_settings');
    if (target.id === 'ic_settings_close-button' || target.contains(dialog)) {
      dialog.close();
    }
  });
}

var Global = {
  init: init$3
};

function init$2(data) {
  if (currentPage !== 'empire') {
  	Amortizations.init(data);
    Global.init(data);
  }
}

var Settings = {
	init: init$2
};

function init$1(data) {
  const result = get(data);
  GM_addStyle(result);
}

function get(data) {
  const { colors } = data.script;
  return `.ic_energy-warning {
            animation: pulse .5s ease-in-out infinite alternate;
            filter: sepia(100%) saturate(500%) brightness(75%) hue-rotate(270deg);
          }
          .ic_button {
            min-width: unset;
          }
          .ic_percent {
            display: inline-block;
            width: 48px;
          }
          .ic_table:first-child tr:nth-child(even) {
            background: #141e26;
          }
          .ic_table:not(:first-child) tr:nth-child(odd) {
            background: #141e26;
          }
          .ic_table :is(th, td) {
            padding: 6px;
            white-space: nowrap;
          }
          .ic_table :is(th, td) > div:not(:last-child) {
            margin-bottom: 6px;
          }
          .ic_form {
            display: flex;
          }
          .ic_form fieldset {
            display: flex;
          }
          .ic_form legend {
            color: #6f9fc8;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .ic_form label {
            align-items: center;
            display: flex;
          }
          .ic_form label:has([type=checkbox], [type=radio]) {
            gap: 4px;
          }
          .ic_form input {
            margin: 0;
          }
          .ic_form [type=color] {
            background: none;
            border: none;
            padding: 0;
            width: 34px;
            height: 20px;
          }
          .ic_form [type=color]::-webkit-color-swatch-wrapper {
            padding: 0;
          }
          .ic_form [type=color]::-webkit-color-swatch {
            border: none;
            border-radius: 3px;
          }
          .ic_form [type=number] {
            -moz-appearance: textfield;
            background: #b3c3cb;
            border: 0;
            border-radius: 3px;
            padding: 2px 4px;
            text-align: center;
            width: 26px;
          }
          .ic_form [type=number]::-webkit-outer-spin-button,
          .ic_form [type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .ic_form [type=number]:disabled {
            background: none;
            color: lightgrey;
          }
          .ic_form :is(label, input) {
            cursor: pointer;
          }
          .ic_dialog {
            background: url(//gf1.geo.gfsrv.net/cdnc8/a70be772b78f27691516fa29654cef.jpg) -100px -100px;
            border: 1px solid #1f2833;
            color: lightgrey;
            padding: 16px;
          }
          .ic_dialog::backdrop {
            background: rgb(0, 0, 0, .5);
          }
          .ic_dialog h1 {
            align-items: center;
            background: linear-gradient(to top, #3d4b5b 0%, #2b343f 49%, #1f262d 50%, #1f2934 100%);
            color: #6f9fc8;
            display: flex;
            font-weight: bold;
            justify-content: space-between;
            margin: -16px -16px 16px;
            padding: 8px 16px;
          }
          .ic_dialog form {
            flex-direction: column;
            gap: 16px;
          }
          .ic_dialog fieldset {
            flex-direction: column;
            gap: 4px;
          }
          .ic_dialog label:has([type=color], [type=number]) {
            gap: 8px;
            justify-content: space-between;
          }
          .ic_dialog .ui-icon {
            cursor: pointer;
            margin-left: 8px;
          }
          .ic_box {
            background: #0d1014;
            border: 2px solid black;
            box-sizing: border-box;
            color: lightgrey;
            line-height: 1;
            margin: 0px auto;
            padding: 8px;
            position: relative;
            width: 654px;
          }
          .ic_box::before,
          .ic_box::after {
            content: '';
            position: absolute;
            width: 668px;
          }
          .ic_box::before {
            background: url(//gf3.geo.gfsrv.net/cdn53/f333e15eb738b8ec692340f507e1ae.png) bottom left no-repeat,
                        url(//gf2.geo.gfsrv.net/cdnd5/66551209db14e23b3001901b996cc6.png) bottom right no-repeat;
            height: 28px;
            left: -9px;
            top: -3px;
          }
          .ic_box::after {
            background: url(//gf3.geo.gfsrv.net/cdnea/0330abcdca0d125d35a0ebace4b584.png) bottom left no-repeat,
                        url(//gf1.geo.gfsrv.net/cdn9b/8003a40825bc96919c5fec01b018b8.png) bottom right no-repeat;
            height: 50px;
            bottom: -4px;
            left: -9px;
            z-index: -1;
          }
          .ic_top-box {
            margin: 5px auto 5px auto;
          }
          .ic_bottom-box {
            margin-bottom: 24px;
          }
          .ic_box_title {
            background: url(//gf1.geo.gfsrv.net/cdnfb/a4e7913209228ebaf2297429aeb87b.png);
            color: #6f9fc8;
            font: bold 12px/27px Verdana,Arial,Helvetica,sans-serif;
            margin: -9px -8px 4px;
            text-align: center;
            position: relative;
          }
          .ic_box_title::before,
          .ic_box_title::after {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            width: 26px;
            height: 27px;
          }
          .ic_box_title::before {
            background: url(//gf2.geo.gfsrv.net/cdn4a/127bd495b9325216af08a588ecc540.png);
            left: 0;
          }
          .ic_box_title::after {
            background: url(//gf2.geo.gfsrv.net/cdn1d/80db96934a5b82ce002f839cd85a44.png);
            right: 0;
          }
          .ic_panel {
            padding: 1px 0;
          }
          .ic_panel_title {
            background-image: url(//gf3.geo.gfsrv.net/cdne1/d03835718066a5a592a6426736e019.png);
            color: #576472;
            cursor: pointer;
            font-weight: bold;
            line-height: 28px;
            overflow: hidden;
            padding-left: 35px;
            position: relative;
          }
          .ic_panel_title::after {
            background-image: url(//gf3.geo.gfsrv.net/cdne1/d03835718066a5a592a6426736e019.png);
            background-position: -21px -169px;
            content: '';
            display: block;
            position: absolute;
            right: -2px;
            top: 1px;
            width: 10px;
            height: 26px;
          }
          .ic_panel_title:hover::after {
            background-position: -21px -196px;
          }
          .ic_panel_title:hover {
            background-position: 0 -28px;
            color: #6f9fc8;
          }
          .ic_panel_title > span {
            background-image: url(//gf3.geo.gfsrv.net/cdne1/d03835718066a5a592a6426736e019.png);
            left: -4px;
            position: absolute;
            width: 31px;
            height: 27px;
          }
          .ic_panel[data-state=collapsed] .ic_panel_main {
            display: none;
          }
          .ic_panel[data-state=expanded] .ic_panel_title > span {
            background-position: 0 -113px;
          }
          .ic_panel[data-state=expanded] .ic_panel_title:hover > span {
            background-position: 0 -141px;
          }
          .ic_panel[data-state=collapsed] .ic_panel_title > span {
            background-position: 0 -57px;
          }
          .ic_panel[data-state=collapsed] .ic_panel_title:hover > span {
            background-position: 0 -85px;
          }
          .ic_panel_main {
            background: #12171c;
            border: 1px solid black;
            display: flex;
            font-size: 11px;
            margin: 0 1px;
          }
          .ic_panel_main form {
            padding: 8px;
          }
          #overviewcomponent {
            margin-bottom: 0;
          }
          #ic_needed-panel .ic_panel_main {
            flex-direction: column;
            gap: 12px;
            padding: 8px;
          }
          #ic_needed-panel h4 {
            font-weight: bold;
            margin-bottom: 8px;
          }
          #ic_needed-panel p {
            line-height: 1.5;
          }
          #ic_account-points-panel th {
            text-align: left;
          }
          #ic_account-points-panel td:last-child {
            text-align: right;
          }
          #ic_account-points-panel tr:nth-child(8) > * {
            padding-bottom: 8px;
          }
          #ic_account-points-panel tr:nth-child(9) > * {
            border-top: 1px dotted rgb(128, 128, 128, .2);
            padding-top: 8px;
          }
          #ic_account-points-panel th::before {
            color: transparent;
            content: '\u2b24';
            margin-right: 8px;
          }
          #ic_account-points-panel tr:nth-child(1) th::before {
            color: ${ colors.mines };
          }
          #ic_account-points-panel tr:nth-child(2) th::before {
            color: ${ colors.planetBuildings };
          }
          #ic_account-points-panel tr:nth-child(3) th::before {
            color: ${ colors.moonBuildings };
          }
          #ic_account-points-panel tr:nth-child(4) th::before {
            color: ${ colors.lifeformBuildings };
          }
          #ic_account-points-panel tr:nth-child(5) th::before {
            color: ${ colors.lifeformResearches };
          }
          #ic_account-points-panel tr:nth-child(6) th::before {
            color: ${ colors.researches };
          }
          #ic_account-points-panel tr:nth-child(7) th::before {
            color: ${ colors.ships };
          }
          #ic_account-points-panel tr:nth-child(8) th::before {
            color: ${ colors.defences };
          }
          #ic_account-points-panel svg {
            padding: 36px;
          }
          #ic_positions-points-panel table {
            width: 100%;
          }
          #ic_positions-points-panel tr {
            text-align: center;
          }
          #ic_positions-points-panel td {
            vertical-align: top;
          }
          #ic_positions-points-panel :is(th, td):nth-child(-n + 2) {
            text-align: left;
            width: 0;
          }
          #ic_positions-points-panel td:nth-child(3) {
            color: ${ colors.mines };
          }
          #ic_positions-points-panel td:nth-child(4) {
            color: ${ colors.planetBuildings };
          }
          #ic_positions-points-panel td:nth-child(4) div:nth-child(2) {
            color: ${ colors.moonBuildings };
          }
          #ic_positions-points-panel td:nth-child(5) {
            color: ${ colors.lifeformBuildings };
          }
          #ic_positions-points-panel td:nth-child(6) {
            color: ${ colors.lifeformResearches };
          }
          #ic_positions-points-panel td:nth-child(7) {
            color: ${ colors.defences };
          }
          #ic_positions-points-panel td:last-child {
            text-align: right;
            width: 0;
          }
          #ic_productions-panel table {
            width: 100%;
          }
          #ic_productions-panel tr > :first-child {
            text-align: left;
          }
          #ic_productions-panel td {
            text-align: right;
          }
          #ic_productions-panel td:nth-child(2) {
            color: ${ colors.metal };
          }
          #ic_productions-panel td:nth-child(3) {
            color: ${ colors.crystal };
          }
          #ic_productions-panel td:nth-child(4) {
            color: ${ colors.deuterium };
          }
          #ic_amortizations-panel .ic_panel_main {
            flex-direction: column;
          }
          #ic_amortizations-panel form {
            flex-direction: column;
            gap: 8px;
          }
          #ic_amortizations-panel fieldset {
            gap: 8px;
            justify-content: end;
          }
          #ic_amortizations-panel label:not(:last-child) {
            margin-bottom: 2px;
          }
          #ic_amortizations-panel table {
            text-align: center;
          }
          #ic_amortizations-panel td:nth-child(3) {
            align-items: center;
            display: flex;
            gap: 8px;
            height: 62px;
            text-align: left;
          }
          #ic_amortizations-panel td:nth-child(3) > div:nth-child(1) {
            align-items: center;
            display: flex;
            justify-content: center;
          }
          #ic_amortizations-panel td:nth-child(3) > div:nth-child(1) span {
            background: rgba(0, 0, 0, .5);
            color: white;
            padding: 4px 11px;
          }
          #ic_amortizations-panel td:nth-child(3) > div:nth-child(2) {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          #ic_amortizations-panel td:nth-child(n + 4) div:first-child {
            color: ${ colors.metal };
          }
          #ic_amortizations-panel td:nth-child(n + 4) div:nth-child(2) {
            color: ${ colors.crystal };
          }
          #ic_amortizations-panel td:nth-child(n + 4) div:nth-child(3) {
            color: ${ colors.deuterium };
          }
          #ic_amortizations-panel .queuePic {
            margin: 0;
          }
          #ic_amortizations-panel_settings fieldset:has(> fieldset) {
            display: flex;
            gap: 12px;
          }
          #ic_exports-panel .ic_panel_main {
            flex-direction: column;
          }
          #ic_exports-panel form {
            justify-content: space-between;
          }
          #ic_exports-panel fieldset {
            gap: 8px;
          }
          #ic_exports-notification {
            align-items: center;
            display: none;
            justify-content: center;
            padding: 8px;
            height: 27.6px;
          }
          #ic_menu_text {
            font-size: 10px;
          }
          #ic_menu_icon-wrapper {
            align-items: center;
            background: linear-gradient(to bottom, #1b2024 50%, #000 50%);
            border-radius: 4px;
            color: #353a3c;
            cursor: pointer;
            display: flex;
            justify-content: center;
            width: 27px;
            height: 27px;
          }
          #ic_menu_icon-wrapper:hover {
            color: #d39343;
          }
          #ic_settings button {
            display: block;
            margin: 24px auto 16px auto;
          }
          #ic_support-links {
            align-items: center;
            animation: 4s linear infinite alternate slide;
            background: linear-gradient(-45deg, #ee775242, #e73c7e42, #23a6d542, #23d5ab42);
            background-size: 300% 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin: auto -16px -16px;
            padding: 12px;
          }
          #ic_support-links a {
            color: lightgrey;
            text-decoration-color: #d3d3d380;
          }
          @keyframes slide {
            to {
              background-position-x: 100%;
            }
          }
          @keyframes pulse {
            to {
              opacity: .2;
            }
          }`;
}

var Styles = {
  init: init$1
};

function init(data) {
  Settings.init(data);
  EnergyWarnings.init(data);
  MenuButton.init(data);
  Highscores.init(data);
  OverviewBox.init(data);
  Styles.init(data);
}

var Interface = {
  init
};

(async function() {
  const data = await Data.get();
  Interface.init(data);
  Storage.set(data);
})();
