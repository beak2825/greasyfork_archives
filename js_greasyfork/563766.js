// ==UserScript==
// @name         Kraland Map Enhancer
// @version      2026.01.23
// @description  A script that allow map customisation on kraland.org
// @author       Marshkalk
// @match        http://www.kraland.org/map*
// @grant        none
// @namespace https://greasyfork.org/users/1320445
// @downloadURL https://update.greasyfork.org/scripts/563766/Kraland%20Map%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/563766/Kraland%20Map%20Enhancer.meta.js
// ==/UserScript==

(function () {
  console.log('[Map] Update design started');

  const images = {
    Restaurant: [
      "http://img7.kraland.org/2/map/1/4022.gif",
      "http://img7.kraland.org/2/map/1/4023.gif"
    ]
  };

  const basicImages = {
    "Scieries": {
      "Petite Scierie": "http://img7.kraland.org/2/map/1/3921.gif",
      "Scierie": "http://img7.kraland.org/2/map/1/3922.gif",
      "Grande Scierie": "http://img7.kraland.org/2/map/1/3923.gif",
      "Complexe Scierie": "http://img7.kraland.org/2/map/1/3924.gif"
    },
    "Briqueteries": {
      "Petite Briqueterie": "http://img7.kraland.org/2/map/1/3941.gif",
      "Briqueterie": "http://img7.kraland.org/2/map/1/3942.gif",
      "Grande Briqueterie": "http://img7.kraland.org/2/map/1/3943.gif",
      "Complexe Briqueterie": "http://img7.kraland.org/2/map/1/3944.gif"
    },
    "Forges": {
      "Petite Forge": "http://img7.kraland.org/2/map/1/3951.gif",
      "Forge": "http://img7.kraland.org/2/map/1/3952.gif",
      "Grande Forge": "http://img7.kraland.org/2/map/1/3953.gif",
      "Complexe Forge": "http://img7.kraland.org/2/map/1/3954.gif"
    },
    "Raffineries": {
      "Petite Raffinerie": "http://img7.kraland.org/2/map/1/3961.gif",
      "Raffinerie": "http://img7.kraland.org/2/map/1/3962.gif",
      "Grande Raffinerie": "http://img7.kraland.org/2/map/1/3963.gif",
      "Complexe Raffinerie": "http://img7.kraland.org/2/map/1/3964.gif"
    },
    "Armureries": {
      "Petite Armurerie": "http://img7.kraland.org/2/map/1/4011.gif",
      "Armurerie": "http://img7.kraland.org/2/map/1/4012.gif",
      "Armurerie Centrale": "http://img7.kraland.org/2/map/1/4013.gif",
      "Complexe Armurier": "http://img7.kraland.org/2/map/1/4014.gif"
    },
    "Hôtellerie et Restauration": {
      "Bar": "http://img7.kraland.org/2/map/1/4021.gif",
      "Restaurant": "http://img7.kraland.org/2/map/1/4022.gif",
      "Auberge": "http://img7.kraland.org/2/map/1/4023.gif",
      "Hôtel": "http://img7.kraland.org/2/map/1/4024.gif"
    },
    "Textile et Couture": {
      "Vendeur de Tissu": "http://img7.kraland.org/2/map/1/4031.gif",
      "Tailleur": "http://img7.kraland.org/2/map/1/4032.gif",
      "Grand Tailleur": "http://img7.kraland.org/2/map/1/4033.gif",
      "Haute-Couture": "http://img7.kraland.org/2/map/1/4034.gif"
    },
    "Quincailleries": {
      "Vendeur de Pacotille": "http://img7.kraland.org/2/map/1/4041.gif",
      "Quincaillerie": "http://img7.kraland.org/2/map/1/4042.gif",
      "Centre Quincailler": "http://img7.kraland.org/2/map/1/4043.gif",
      "Complexe Quincailler": "http://img7.kraland.org/2/map/1/4044.gif"
    },
    "Bibliothèques et Librairies": {
      "Librairie": "http://img7.kraland.org/2/map/1/4051.gif",
      "Bibliothèque": "http://img7.kraland.org/2/map/1/4052.gif",
      "Bibliothèque Centrale": "http://img7.kraland.org/2/map/1/4053.gif",
      "Complexe Bibliothécaire": "http://img7.kraland.org/2/map/1/4054.gif"
    },
    "Technologie et Cybernétique": {
      "Technicien": "http://img7.kraland.org/2/map/1/4061.gif",
      "Électronique": "http://img7.kraland.org/2/map/1/4062.gif",
      "Centre Électronique": "http://img7.kraland.org/2/map/1/4063.gif",
      "Complexe Cybernétique": "http://img7.kraland.org/2/map/1/4064.gif"
    },
    "Garages et Transports": {
      "Station-Service": "http://img7.kraland.org/2/map/1/4071.gif",
      "Garage": "http://img7.kraland.org/2/map/1/4072.gif",
      "Garage Central": "http://img7.kraland.org/2/map/1/4073.gif",
      "Complexe Garagiste": "http://img7.kraland.org/2/map/1/4074.gif"
    },
    "Bijouteries": {
      "Orfèvrerie": "http://img7.kraland.org/2/map/1/4081.gif",
      "Bijouterie": "http://img7.kraland.org/2/map/1/4082.gif",
      "Centre Bijoutier": "http://img7.kraland.org/2/map/1/4083.gif",
      "Complexe Bijoutier": "http://img7.kraland.org/2/map/1/4084.gif"
    },
    "Santé": {
      "Infirmerie": "http://img7.kraland.org/2/map/1/4091.gif",
      "Clinique": "http://img7.kraland.org/2/map/1/4092.gif",
      "Hôpital": "http://img7.kraland.org/2/map/1/4093.gif",
      "Complexe Hospitalier": "http://img7.kraland.org/2/map/1/4094.gif"
    },
    "Alchimie": {
      "Herboriste": "http://img7.kraland.org/2/map/1/4101.gif",
      "Alchimie": "http://img7.kraland.org/2/map/1/4102.gif",
      "Centre Alchimique": "http://img7.kraland.org/2/map/1/4103.gif",
      "Complexe Alchimique": "http://img7.kraland.org/2/map/1/4104.gif"
    },
    "Éducation": {
      "École": "http://img7.kraland.org/2/map/1/4111.gif",
      "École Supérieure": "http://img7.kraland.org/2/map/1/4112.gif",
      "Université": "http://img7.kraland.org/2/map/1/4113.gif",
      "Campus Universitaire": "http://img7.kraland.org/2/map/1/4114.gif"
    },
    "Banques": {
      "Comptoir": "http://img7.kraland.org/2/map/1/4121.gif",
      "Banque": "http://img7.kraland.org/2/map/1/4122.gif",
      "Centre Bancaire": "http://img7.kraland.org/2/map/1/4123.gif",
      "Complexe Bancaire": "http://img7.kraland.org/2/map/1/4124.gif"
    },
    "Musées": {
      "Petit Musée": "http://img7.kraland.org/2/map/1/4131.gif",
      "Musée": "http://img7.kraland.org/2/map/1/4132.gif",
      "Grand Musée": "http://img7.kraland.org/2/map/1/4133.gif",
      "Musée Impérial": "http://img7.kraland.org/2/map/1/4134.gif"
    },
    "Hotel de ville":{
      "Niveau 1" : "http://img7.kraland.org/2/map/1/2111.gif",
      "Niveau 2" : "http://img7.kraland.org/2/map/1/2112.gif",
      "Niveau 3" : "http://img7.kraland.org/2/map/1/2113.gif",
      "Niveau 4" : "http://img7.kraland.org/2/map/1/2114.gif"
    },
    "Caserne": {
      "Poste de Garde" : "http://img7.kraland.org/2/map/1/2121.gif",
      "Niveau 2" : "http://img7.kraland.org/2/map/1/2122.gif",
      "Niveau 3" : "http://img7.kraland.org/2/map/1/2123.gif",
      "Niveau 4" : "http://img7.kraland.org/2/map/1/2124.gif"
    },
    "Commissariat": {
      "Poste de Police" : "http://img7.kraland.org/2/map/1/2191.gif",
      "Niveau 2" : "http://img7.kraland.org/2/map/1/2192.gif",
      "Niveau 3" : "http://img7.kraland.org/2/map/1/2193.gif",
      "Niveau 4" : "http://img7.kraland.org/2/map/1/2194.gif"
    },
    "Palais du Gouverneur": {
      "Niveau 1" : "http://img7.kraland.org/2/map/1/2311.gif",
      "Niveau 2" : "http://img7.kraland.org/2/map/1/2312.gif",
      "Niveau 3" : "http://img7.kraland.org/2/map/1/2313.gif",
      "Niveau 4" : "http://img7.kraland.org/2/map/1/2314.gif"
    },
    "Base Militaire": {
      "Niveau 1" : "http://img7.kraland.org/2/map/1/2321.gif",
      "Niveau 2" : "http://img7.kraland.org/2/map/1/2322.gif",
      "Niveau 3" : "http://img7.kraland.org/2/map/1/2323.gif",
      "Niveau 4" : "http://img7.kraland.org/2/map/1/2324.gif"
    },
    "Tribunal": {
      "Niveau 1" : "http://img7.kraland.org/2/map/1/2331.gif",
      "Niveau 2" : "http://img7.kraland.org/2/map/1/2332.gif",
      "Niveau 3" : "http://img7.kraland.org/2/map/1/2333.gif",
      "Niveau 4" : "http://img7.kraland.org/2/map/1/2334.gif"
    },
    "Intendance": {
      "Niveau 1" : "http://img7.kraland.org/2/map/1/2351.gif",
      "Niveau 2" : "http://img7.kraland.org/2/map/1/2352.gif",
      "Niveau 3" : "http://img7.kraland.org/2/map/1/2353.gif",
      "Niveau 4" : "http://img7.kraland.org/2/map/1/2354.gif"
    },
    "Préfecture de Police": {
      "Niveau 1" : "http://img7.kraland.org/2/map/1/2391.gif",
      "Niveau 2" : "http://img7.kraland.org/2/map/1/2392.gif",
      "Niveau 3" : "http://img7.kraland.org/2/map/1/2393.gif",
      "Niveau 4" : "http://img7.kraland.org/2/map/1/2394.gif"
    },
    "Agriculture": {
      "Potager" : "http://img7.kraland.org/2/map/1/3011.gif",
      "Ferme" : "http://img7.kraland.org/2/map/1/3012.gif",
      "Centre Agricole" : "http://img7.kraland.org/2/map/1/3013.gif",
      "Complexe Agricole" : "http://img7.kraland.org/2/map/1/3014.gif"
    },
    "Bûcheronnage": {
      "Camp de Bûcherons" : "http://img7.kraland.org/2/map/1/3021.gif",
      "Prod. de Bois" : "http://img7.kraland.org/2/map/1/3022.gif",
      "Centre de Prod. de Bois" : "http://img7.kraland.org/2/map/1/3023.gif",
      "Complexe de Prod. de Bois" : "http://img7.kraland.org/2/map/1/3024.gif"
    },
    "Élevage": {
      "Pré": "http://img7.kraland.org/2/map/1/3031.gif",
      "Enclos": "http://img7.kraland.org/2/map/1/3032.gif",
      "Centre d'Élevage": "http://img7.kraland.org/2/map/1/3033.gif",
      "Complexe d'Élevage": "http://img7.kraland.org/2/map/1/3034.gif"
    },
    "Extraction de Pierre": {
      "Carrière": "http://img7.kraland.org/2/map/1/3041.gif",
      "Mine de Pierre": "http://img7.kraland.org/2/map/1/3042.gif",
      "Centre Minier de Pierre": "http://img7.kraland.org/2/map/1/3043.gif",
      "Complexe Minier de Pierre": "http://img7.kraland.org/2/map/1/3044.gif"
    },
    "Extraction de Métal": {
      "Gisement de Fer": "http://img7.kraland.org/2/map/1/3051.gif",
      "Mine de Fer": "http://img7.kraland.org/2/map/1/3052.gif",
      "Centre Minier de Fer": "http://img7.kraland.org/2/map/1/3053.gif",
      "Complexe Minier de Fer": "http://img7.kraland.org/2/map/1/3054.gif"
    },
    "Extraction de Pétrole": {
      "Nappe de Pétrole": "http://img7.kraland.org/2/map/1/3061.gif",
      "Puits de Pétrole": "http://img7.kraland.org/2/map/1/3062.gif",
      "Centre Pétrolier": "http://img7.kraland.org/2/map/1/3063.gif",
      "Complexe Pétrolier": "http://img7.kraland.org/2/map/1/3064.gif"
    },
    "Extraction d’Or": {
      "Gisement d'Or": "http://img7.kraland.org/2/map/1/3071.gif",
      "Mine d'Or": "http://img7.kraland.org/2/map/1/3072.gif",
      "Centre Minier d'Or": "http://img7.kraland.org/2/map/1/3073.gif",
      "Complexe Minier d'Or": "http://img7.kraland.org/2/map/1/3074.gif"
    },
    "Centrale Thermique": {
      "Niveau 1": "http://img7.kraland.org/2/map/1/3081.gif",
      "Niveau 2": "http://img7.kraland.org/2/map/1/3082.gif",
      "Niveau 3": "http://img7.kraland.org/2/map/1/3083.gif",
      "Niveau 4": "http://img7.kraland.org/2/map/1/3084.gif"
    },
    "Épuration": {
      "Pompe d'Épuration": "http://img7.kraland.org/2/map/1/3091.gif",
      "Station d'Épuration": "http://img7.kraland.org/2/map/1/3092.gif",
      "Centre d'Épuration": "http://img7.kraland.org/2/map/1/3093.gif",
      "Complexe d'Épuration": "http://img7.kraland.org/2/map/1/3094.gif"
    },
    "Logique Brute": {
      "Nappe Logique Brute": "http://img7.kraland.org/2/map/1/3101.gif",
      "Puits Logique Brute": "http://img7.kraland.org/2/map/1/3102.gif",
      "Centre Logique Brute": "http://img7.kraland.org/2/map/1/3103.gif",
      "Complexe Logique Brute": "http://img7.kraland.org/2/map/1/3104.gif"
    },
    "Port": {
      "Embarcadère": "http://img7.kraland.org/2/map/1/3111.gif",
      "Port": "http://img7.kraland.org/2/map/1/3112.gif",
      "Centre Portuaire": "http://img7.kraland.org/2/map/1/3113.gif",
      "Complexe Portuaire": "http://img7.kraland.org/2/map/1/3114.gif"
    },
    "Transport Ferroviaire": {
      "Station": "http://img7.kraland.org/2/map/1/3121.gif",
      "Gare": "http://img7.kraland.org/2/map/1/3122.gif",
      "Centre Ferroviaire": "http://img7.kraland.org/2/map/1/3123.gif",
      "Complexe Ferroviaire": "http://img7.kraland.org/2/map/1/3124.gif"
    },
    "Transport Aérien": {
      "Aérodrome": "http://img7.kraland.org/2/map/1/3131.gif",
      "Aéroport": "http://img7.kraland.org/2/map/1/3132.gif",
      "Aéroport Central": "http://img7.kraland.org/2/map/1/3133.gif",
      "Complexe Aéroport": "http://img7.kraland.org/2/map/1/3134.gif"
    },
    "Arène": {
      "Petite Arène": "http://img7.kraland.org/2/map/1/3141.gif",
      "Arène": "http://img7.kraland.org/2/map/1/3142.gif",
      "Grande Arène": "http://img7.kraland.org/2/map/1/3143.gif",
      "Colisée": "http://img7.kraland.org/2/map/1/3144.gif"
    },
    "Nécropole": {
      "Tombe": "http://img7.kraland.org/2/map/1/3151.gif",
      "Crypte": "http://img7.kraland.org/2/map/1/3152.gif",
      "Cimetière": "http://img7.kraland.org/2/map/1/3153.gif",
      "Nécropole": "http://img7.kraland.org/2/map/1/3154.gif"
    },
    "H.L.M.": {
      "Petit H.L.M.": "http://img7.kraland.org/2/map/1/5081.gif",
      "H.L.M.": "http://img7.kraland.org/2/map/1/5082.gif",
      "Quartier H.L.M.": "http://img7.kraland.org/2/map/1/5083.gif",
      "Cité H.L.M.": "http://img7.kraland.org/2/map/1/5084.gif"
    },
    "Nature": {
        "Herbe": "http://img7.kraland.org/2/map/1/100.gif",
        "Arbre": "http://img7.kraland.org/2/map/1/101.gif",
        "Forêt": "http://img7.kraland.org/2/map/1/102.gif",
        "Mer": "http://img7.kraland.org/2/map/1/103.gif",
        "Rivière": "http://img7.kraland.org/2/map/1/104.gif",
        "Montagne": "http://img7.kraland.org/2/map/1/105.gif",
        "Sable": "http://img7.kraland.org/2/map/1/106.gif",
        "Glace": "http://img7.kraland.org/2/map/1/107.gif",
        "Fleur": "http://img7.kraland.org/2/map/1/108.gif",
        "Arbres mutants": "http://img7.kraland.org/2/map/1/132.gif",
        "Bambous": "http://img7.kraland.org/2/map/1/133.gif",
        "Palmiers": "http://img7.kraland.org/2/map/1/134.gif",
        "Lave": "http://img7.kraland.org/2/map/1/148.gif",
        "Métal": "http://img7.kraland.org/2/map/1/149.gif"
      },

      "Routes": {
        "Route 1": "http://img7.kraland.org/2/map/1/110.gif",
        "Route 2": "http://img7.kraland.org/2/map/1/111.gif",
        "Route 3": "http://img7.kraland.org/2/map/1/112.gif",
        "Route 4": "http://img7.kraland.org/2/map/1/113.gif",
        "Route 5": "http://img7.kraland.org/2/map/1/114.gif",
        "Route 6": "http://img7.kraland.org/2/map/1/115.gif",
        "Route 7": "http://img7.kraland.org/2/map/1/116.gif",
        "Route 8": "http://img7.kraland.org/2/map/1/117.gif",
        "Route 9": "http://img7.kraland.org/2/map/1/118.gif",
        "Route 10": "http://img7.kraland.org/2/map/1/119.gif",
        "Route 11": "http://img7.kraland.org/2/map/1/120.gif"
      },

      "Ponts": {
        "Pont 1": "http://img7.kraland.org/2/map/1/121.gif",
        "Pont 2": "http://img7.kraland.org/2/map/1/122.gif",
        "Pont 3": "http://img7.kraland.org/2/map/1/123.gif",
        "Pont 4": "http://img7.kraland.org/2/map/1/124.gif",
        "Pont 5": "http://img7.kraland.org/2/map/1/125.gif",
        "Pont 6": "http://img7.kraland.org/2/map/1/126.gif",
        "Pont 7": "http://img7.kraland.org/2/map/1/127.gif",
        "Pont 8": "http://img7.kraland.org/2/map/1/128.gif",
        "Pont 9": "http://img7.kraland.org/2/map/1/129.gif",
        "Pont 10": "http://img7.kraland.org/2/map/1/130.gif",
        "Pont 11": "http://img7.kraland.org/2/map/1/131.gif"
      },

      "Glyphes": {
        "Glyphe 1": "http://img7.kraland.org/2/map/1/141.gif",
        "Glyphe 2": "http://img7.kraland.org/2/map/1/142.gif",
        "Glyphe 3": "http://img7.kraland.org/2/map/1/143.gif",
        "Glyphe 4": "http://img7.kraland.org/2/map/1/144.gif"
      },

      "Décorations": {
        "Menhir": "http://img7.kraland.org/2/map/1/145.gif",
        "Cratère": "http://img7.kraland.org/2/map/1/146.gif",
        "Cratères": "http://img7.kraland.org/2/map/1/147.gif",
        "???": "http://img7.kraland.org/2/map/1/150.gif"
      },
    "Kraland": {
      "Palais Impérial": "http://img7.kraland.org/2/map/1/2511.gif",
      "Ministère de la Guerre": "http://img7.kraland.org/2/map/1/2521.gif",
      "Ministère de la Justice": "http://img7.kraland.org/2/map/1/2531.gif",
      "Ministère des Affaires Étrangères": "http://img7.kraland.org/2/map/1/2541.gif",
      "Ministère de l'Économie": "http://img7.kraland.org/2/map/1/2551.gif",
      "Ministère de la Recherche": "http://img7.kraland.org/2/map/1/2561.gif",
      "Ministère de l'Intérieur": "http://img7.kraland.org/2/map/1/2571.gif",
      "Ministère de l'Information": "http://img7.kraland.org/2/map/1/2581.gif",
      "Ministère des Services Secrets": "http://img7.kraland.org/2/map/1/2591.gif",
      "Ministère du Travail": "http://img7.kraland.org/2/map/1/2601.gif",
      "Ambassade": "http://img7.kraland.org/2/map/1/2711.gif",
      "Commissariat du Bonheur": "http://img7.kraland.org/2/map/1/3611.gif",
      "Drapeau": "http://img7.kraland.org/2/map/1/3211.gif",
      "Buste": "http://img7.kraland.org/2/map/1/3311.gif",
      "Statue": "http://img7.kraland.org/2/map/1/3312.gif",
      "Mémorial": "http://img7.kraland.org/2/map/1/3313.gif",
      "Monument": "http://img7.kraland.org/2/map/1/3314.gif"
    },
    "Empire": {
      "Palais Impérial": "http://img7.kraland.org/2/map/1/2512.gif",
      "Ministère de la Guerre": "http://img7.kraland.org/2/map/1/2522.gif",
      "Ministère de la Justice": "http://img7.kraland.org/2/map/1/2532.gif",
      "Ministère des Affaires Étrangères": "http://img7.kraland.org/2/map/1/2542.gif",
      "Ministère de l'Économie": "http://img7.kraland.org/2/map/1/2552.gif",
      "Ministère de la Recherche": "http://img7.kraland.org/2/map/1/2562.gif",
      "Ministère de l'Intérieur": "http://img7.kraland.org/2/map/1/2572.gif",
      "Ministère de l'Information": "http://img7.kraland.org/2/map/1/2582.gif",
      "Ministère des Services Secrets": "http://img7.kraland.org/2/map/1/2592.gif",
      "Ministère du Travail": "http://img7.kraland.org/2/map/1/2602.gif",
      "Ambassade": "http://img7.kraland.org/2/map/1/2721.gif",
      "Nexus Magique": "http://img7.kraland.org/2/map/1/3621.gif",
      "Drapeau": "http://img7.kraland.org/2/map/1/3221.gif",
      "Buste": "http://img7.kraland.org/2/map/1/3321.gif",
      "Statue": "http://img7.kraland.org/2/map/1/3322.gif",
      "Mémorial": "http://img7.kraland.org/2/map/1/3323.gif",
      "Monument": "http://img7.kraland.org/2/map/1/3324.gif"
    },
    "Palladium": {
      "Palais Impérial": "http://img7.kraland.org/2/map/1/2513.gif",
      "Ministère de la Guerre": "http://img7.kraland.org/2/map/1/2523.gif",
      "Ministère de la Justice": "http://img7.kraland.org/2/map/1/2533.gif",
      "Ministère des Affaires Étrangères": "http://img7.kraland.org/2/map/1/2543.gif",
      "Ministère de l'Économie": "http://img7.kraland.org/2/map/1/2553.gif",
      "Ministère de la Recherche": "http://img7.kraland.org/2/map/1/2563.gif",
      "Ministère de l'Intérieur": "http://img7.kraland.org/2/map/1/2573.gif",
      "Ministère de l'Information": "http://img7.kraland.org/2/map/1/2583.gif",
      "Ministère des Services Secrets": "http://img7.kraland.org/2/map/1/2593.gif",
      "Ministère du Travail": "http://img7.kraland.org/2/map/1/2603.gif",
      "Ambassade": "http://img7.kraland.org/2/map/1/2731.gif",
      "Banque Cybermondiale": "http://img7.kraland.org/2/map/1/3631.gif",
      "Drapeau": "http://img7.kraland.org/2/map/1/3231.gif",
      "Buste": "http://img7.kraland.org/2/map/1/3331.gif",
      "Statue": "http://img7.kraland.org/2/map/1/3332.gif",
      "Mémorial": "http://img7.kraland.org/2/map/1/3333.gif",
      "Monument": "http://img7.kraland.org/2/map/1/3334.gif"
    },
    "Théocratie": {
      "Palais Impérial": "http://img7.kraland.org/2/map/1/2514.gif",
      "Ministère de la Guerre": "http://img7.kraland.org/2/map/1/2524.gif",
      "Ministère de la Justice": "http://img7.kraland.org/2/map/1/2534.gif",
      "Ministère des Affaires Étrangères": "http://img7.kraland.org/2/map/1/2544.gif",
      "Ministère de l'Économie": "http://img7.kraland.org/2/map/1/2554.gif",
      "Ministère de la Recherche": "http://img7.kraland.org/2/map/1/2564.gif",
      "Ministère de l'Intérieur": "http://img7.kraland.org/2/map/1/2574.gif",
      "Ministère de l'Information": "http://img7.kraland.org/2/map/1/2584.gif",
      "Ministère des Services Secrets": "http://img7.kraland.org/2/map/1/2594.gif",
      "Ministère du Travail": "http://img7.kraland.org/2/map/1/2604.gif",
      "Ambassade": "http://img7.kraland.org/2/map/1/2741.gif",
      "Grand Observatoire": "http://img7.kraland.org/2/map/1/3641.gif",
      "Drapeau": "http://img7.kraland.org/2/map/1/3241.gif",
      "Buste": "http://img7.kraland.org/2/map/1/3341.gif",
      "Statue": "http://img7.kraland.org/2/map/1/3342.gif",
      "Mémorial": "http://img7.kraland.org/2/map/1/3343.gif",
      "Monument": "http://img7.kraland.org/2/map/1/3344.gif"
    },
    "Paradigme": {
      "Palais Impérial": "http://img7.kraland.org/2/map/1/2515.gif",
      "Ministère de la Guerre": "http://img7.kraland.org/2/map/1/2525.gif",
      "Ministère de la Justice": "http://img7.kraland.org/2/map/1/2535.gif",
      "Ministère des Affaires Étrangères": "http://img7.kraland.org/2/map/1/2545.gif",
      "Ministère de l'Économie": "http://img7.kraland.org/2/map/1/2555.gif",
      "Ministère de la Recherche": "http://img7.kraland.org/2/map/1/2565.gif",
      "Ministère de l'Intérieur": "http://img7.kraland.org/2/map/1/2575.gif",
      "Ministère de l'Information": "http://img7.kraland.org/2/map/1/2585.gif",
      "Ministère des Services Secrets": "http://img7.kraland.org/2/map/1/2595.gif",
      "Ministère du Travail": "http://img7.kraland.org/2/map/1/2605.gif",
      "Ambassade": "http://img7.kraland.org/2/map/1/2751.gif",
      "Inspection Écologique": "http://img7.kraland.org/2/map/1/3651.gif",
      "Drapeau": "http://img7.kraland.org/2/map/1/3251.gif",
      "Buste": "http://img7.kraland.org/2/map/1/3351.gif",
      "Statue": "http://img7.kraland.org/2/map/1/3352.gif",
      "Mémorial": "http://img7.kraland.org/2/map/1/3353.gif",
      "Monument": "http://img7.kraland.org/2/map/1/3354.gif"
    },
    "Khanat": {
      "Palais Impérial": "http://img7.kraland.org/2/map/1/2516.gif",
      "Ministère de la Guerre": "http://img7.kraland.org/2/map/1/2526.gif",
      "Ministère de la Justice": "http://img7.kraland.org/2/map/1/2536.gif",
      "Ministère des Affaires Étrangères": "http://img7.kraland.org/2/map/1/2546.gif",
      "Ministère de l'Économie": "http://img7.kraland.org/2/map/1/2556.gif",
      "Ministère de la Recherche": "http://img7.kraland.org/2/map/1/2566.gif",
      "Ministère de l'Intérieur": "http://img7.kraland.org/2/map/1/2576.gif",
      "Ministère de l'Information": "http://img7.kraland.org/2/map/1/2586.gif",
      "Ministère des Services Secrets": "http://img7.kraland.org/2/map/1/2596.gif",
      "Ministère du Travail": "http://img7.kraland.org/2/map/1/2606.gif",
      "Ambassade": "http://img7.kraland.org/2/map/1/2761.gif",
      "Comité Olympique": "http://img7.kraland.org/2/map/1/3661.gif",
      "Drapeau": "http://img7.kraland.org/2/map/1/3261.gif",
      "Buste": "http://img7.kraland.org/2/map/1/3361.gif",
      "Statue": "http://img7.kraland.org/2/map/1/3362.gif",
      "Mémorial": "http://img7.kraland.org/2/map/1/3363.gif",
      "Monument": "http://img7.kraland.org/2/map/1/3364.gif"
    },
    "Confédération": {
      "Palais Impérial": "http://img7.kraland.org/2/map/1/2517.gif",
      "Ministère de la Guerre": "http://img7.kraland.org/2/map/1/2527.gif",
      "Ministère de la Justice": "http://img7.kraland.org/2/map/1/2537.gif",
      "Ministère des Affaires Étrangères": "http://img7.kraland.org/2/map/1/2547.gif",
      "Ministère de l'Économie": "http://img7.kraland.org/2/map/1/2557.gif",
      "Ministère de la Recherche": "http://img7.kraland.org/2/map/1/2567.gif",
      "Ministère de l'Intérieur": "http://img7.kraland.org/2/map/1/2577.gif",
      "Ministère de l'Information": "http://img7.kraland.org/2/map/1/2587.gif",
      "Ministère des Services Secrets": "http://img7.kraland.org/2/map/1/2597.gif",
      "Ministère du Travail": "http://img7.kraland.org/2/map/1/2607.gif",
      "Ambassade": "http://img7.kraland.org/2/map/1/2771.gif",
      "Tribunal Cybermondial": "http://img7.kraland.org/2/map/1/3671.gif",
      "Drapeau": "http://img7.kraland.org/2/map/1/3271.gif",
      "Buste": "http://img7.kraland.org/2/map/1/3371.gif",
      "Statue": "http://img7.kraland.org/2/map/1/3372.gif",
      "Mémorial": "http://img7.kraland.org/2/map/1/3373.gif",
      "Monument": "http://img7.kraland.org/2/map/1/3374.gif"
    },
    "Royaume": {
      "Palais Impérial": "http://img7.kraland.org/2/map/1/2518.gif",
      "Ministère de la Guerre": "http://img7.kraland.org/2/map/1/2528.gif",
      "Ministère de la Justice": "http://img7.kraland.org/2/map/1/2538.gif",
      "Ministère des Affaires Étrangères": "http://img7.kraland.org/2/map/1/2548.gif",
      "Ministère de l'Économie": "http://img7.kraland.org/2/map/1/2558.gif",
      "Ministère de la Recherche": "http://img7.kraland.org/2/map/1/2568.gif",
      "Ministère de l'Intérieur": "http://img7.kraland.org/2/map/1/2578.gif",
      "Ministère de l'Information": "http://img7.kraland.org/2/map/1/2588.gif",
      "Ministère des Services Secrets": "http://img7.kraland.org/2/map/1/2598.gif",
      "Ministère du Travail": "http://img7.kraland.org/2/map/1/2608.gif",
      "Ambassade": "http://img7.kraland.org/2/map/1/2781.gif",
      "Arbitrage des Élégances": "http://img7.kraland.org/2/map/1/3681.gif",
      "Drapeau": "http://img7.kraland.org/2/map/1/3281.gif",
      "Buste": "http://img7.kraland.org/2/map/1/3381.gif",
      "Statue": "http://img7.kraland.org/2/map/1/3382.gif",
      "Mémorial": "http://img7.kraland.org/2/map/1/3383.gif",
      "Monument": "http://img7.kraland.org/2/map/1/3384.gif"
    },
   "Rebelle": {
     "Drapeau": "http://img7.kraland.org/2/map/1/3291.gif",
     "Buste": "http://img7.kraland.org/2/map/1/3391.gif",
     "Statue": "http://img7.kraland.org/2/map/1/3392.gif",
     "Mémorial": "http://img7.kraland.org/2/map/1/3393.gif",
     "Monument": "http://img7.kraland.org/2/map/1/3394.gif"
   },
   "Donjon": {
     "Niveau 1": "http://img7.kraland.org/2/map/1/3521.gif",
     "Niveau 2": "http://img7.kraland.org/2/map/1/3522.gif",
     "Niveau 3": "http://img7.kraland.org/2/map/1/3523.gif",
     "Niveau 4": "http://img7.kraland.org/2/map/1/3524.gif",
     "Niveau 5": "http://img7.kraland.org/2/map/1/3525.gif",
     "Niveau 6": "http://img7.kraland.org/2/map/1/3526.gif"
   },
    "Autres": {
      "Marché": "http://img7.kraland.org/2/map/1/4990.gif",
      "Cabane": "http://img7.kraland.org/2/map/1/5011.gif",
      "Maisonnette": "http://img7.kraland.org/2/map/1/5012.gif",
      "Maison": "http://img7.kraland.org/2/map/1/5013.gif",
      "Villa": "http://img7.kraland.org/2/map/1/5014.gif",
      "Tente": "http://img7.kraland.org/2/map/1/5090.gif",
      "Portail Vide-Ordures": "http://img7.kraland.org/2/map/1/3510.gif",
      "Portail": "http://img7.kraland.org/2/map/1/3530.gif",
      "Portail Démoniaque": "http://img7.kraland.org/2/map/1/3540.gif",
      "Fontaine" : "http://img7.kraland.org/2/map/1/3161.gif",
      "Chapiteau" : "http://img7.kraland.org/2/map/1/3551.gif",
      "Fontaine de Cailloux" : "http://img7.kraland.org/2/map/1/3561.gif",
      "Mausolée d'Elmer Caps" : "http://img7.kraland.org/2/map/1/3571.gif",
      "Entrée des Sous-Sols" : "http://img7.kraland.org/2/map/1/3581.gif",
      "Porte des Étoiles" : "http://img7.kraland.org/2/map/1/3591.gif"
    }
  };

  // =========================
  // Namespace (page-header)
  // =========================
  function getNamespace() {
    const header = document.querySelector(".page-header");
    if (!header) return "default";
    return header.textContent.trim() || "default";
  }
  const namespace = getNamespace();

  // =========================
  // Storage (newImages)
  // =========================
  const storage = JSON.parse(localStorage.getItem("newImages") || "{}");
  if (!storage[namespace]) storage[namespace] = {};
  const newImages = storage[namespace];

  // =========================
  // POS Mode Storage
  // =========================
  function getPosMode() {
    const pos = JSON.parse(localStorage.getItem("posMode") || "{}");
    return !!pos.pos;
  }

  function setPosMode(value) {
    localStorage.setItem("posMode", JSON.stringify({ pos: !!value }));
  }

  function getPosStorage() {
    const pos = JSON.parse(localStorage.getItem("pos") || "{}");
    if (!pos[namespace]) pos[namespace] = {};
    return pos;
  }

  function setPosStorage(posStorage) {
    localStorage.setItem("pos", JSON.stringify(posStorage));
  }

  function resetNamespacePos(namespace) {
    const pos = JSON.parse(localStorage.getItem("pos")) || {};
    delete pos[namespace];
    localStorage.setItem("pos", JSON.stringify(pos));
  }

  // =========================
  // Add POS checkbox
  // =========================
  function addPosCheckbox() {
    const pagination = document.querySelector(".pagination");
    if (!pagination) return;

    if (document.getElementById("posModeCheckbox")) return;

    const container = document.createElement("div");
    container.style.marginTop = "10px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "posModeCheckbox";
    checkbox.checked = getPosMode();

    const label = document.createElement("label");
    label.htmlFor = "posModeCheckbox";
    label.textContent = "Activer le mode POS";
    label.style.marginLeft = "6px";

    const controls = document.createElement("div");
    controls.style.marginTop = "6px";

    // -------------------------
    // Bouton réinitialiser POS
    // -------------------------
    const resetButton = document.createElement("button");
    resetButton.textContent = "Réinitialiser le POS";
    resetButton.style.cursor = "pointer";

    resetButton.addEventListener("click", () => {
      resetNamespacePos(namespace);
      location.reload();
    });

    // Affiche le bouton seulement si POS est activé
    if (getPosMode()) {
      controls.appendChild(resetButton);
    }

    checkbox.addEventListener("change", () => {
      setPosMode(checkbox.checked);
      location.reload();
    });

    container.appendChild(checkbox);
    container.appendChild(label);
    container.appendChild(controls);

    pagination.insertAdjacentElement("beforebegin", container);
  }

  addPosCheckbox();

  // =========================
  // Apply background
  // =========================
  function applyBackground(x, y) {
    const coordKey = `${x},${y}`;

    const isPos = getPosMode();
    const posStorage = getPosStorage();
    const url = isPos ? posStorage[namespace][coordKey] : newImages[coordKey];

    if (!url) return;

    const el = document.getElementById(`c${x}-${y}`);
    if (!el) return;

    el.style.backgroundImage = `url("${url}")`;
  }

  // =========================
  // Apply all saved images
  // =========================
  if (getPosMode()) {
    const pos = getPosStorage();
    const posImages = pos[namespace] || {};

    Object.keys(posImages).forEach(coordKey => {
      const [x, y] = coordKey.split(',').map(Number);
      applyBackground(x, y);
    });
  } else {
    Object.keys(newImages).forEach(coordKey => {
      const [x, y] = coordKey.split(',').map(Number);
      applyBackground(x, y);
    });
  }

  console.log("🟢 Script lancé dans le namespace :", namespace);

  // =========================
  // Find basic image
  // =========================
  function findBasicImage(typeBatiment) {
    for (const group in basicImages) {
      if (basicImages[group][typeBatiment]) {
        return basicImages[group][typeBatiment];
      }
    }
    return null;
  }

  // =========================
  // Get all basic images for a typeBatiment (ordered)
  // =========================
  function getBasicImagesFor(typeBatiment) {
    const result = [];
    for (const group in basicImages) {
      if (basicImages[group][typeBatiment]) {
        result.push(basicImages[group][typeBatiment]);
      }
    }
    return result;
  }

  // =========================
  // Observer
  // =========================
  const observer = new MutationObserver(() => {

    // 1️⃣ attendre #info rempli
    const info = document.getElementById("info");
    if (!info || !info.innerHTML.trim()) return;

    // 2️⃣ récupérer x,y depuis ldint
    const link = Array.from(document.querySelectorAll("a[onclick]"))
      .find(a => a.getAttribute("onclick")?.includes("ldint("));
    if (!link) return;

    const match = link
      .getAttribute("onclick")
      .match(/ldint\(\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (!match) return;

    const x = match[1];
    const y = match[2];
    const coordKey = `${x},${y}`;

    // application immédiate
    applyBackground(x, y);

    // 3️⃣ type de bâtiment
    const titleEl = document.querySelector(".map-box-title");
    if (!titleEl) return;

    const typeBatiment = titleEl.textContent
      .trim()
      .replace(/^\[[^\]]+\]/, "")
      .trim();

    // 4️⃣ création du sélecteur
    if (document.querySelector(".custom-image-selector")) return;

    const mapBoxBg2 = document.querySelector(".map-box.bg2");
    if (mapBoxBg2) {
      mapBoxBg2.style.width = "200px";
    }

    const container = document.createElement("div");
    container.className = "custom-image-selector";
    container.style.marginTop = "6px";
    container.style.maxHeight = "300px";
    container.style.overflowY = "auto";
    container.style.width = "200px";

    const orderedImages = [];

    const basicList = getBasicImagesFor(typeBatiment);
    const baseImage = findBasicImage(typeBatiment);

    // 4.1 Ajouter d'abord l'image de base (si existe)
    if (baseImage) orderedImages.push(baseImage);

    // 4.2 Ajouter toutes les images basicImages (sans doublons)
    basicList.forEach(url => {
      if (!orderedImages.includes(url)) orderedImages.push(url);
    });

    // 4.3 Ajouter images spécifiques (si existantes)
    if (images[typeBatiment]) {
      images[typeBatiment].forEach(url => {
        if (!orderedImages.includes(url)) orderedImages.push(url);
      });
    }

    // En mode normal : si aucune image, on arrête
    if (!getPosMode() && orderedImages.length === 0) return;

    const isPos = getPosMode();
    const posStorage = getPosStorage();
    const currentStorage = isPos ? posStorage[namespace] : newImages;

    const currentImage = currentStorage[coordKey] || orderedImages[0];

    if (getPosMode()) {
      // POS MODE => affichage groupé

      const pos = getPosStorage();
      const currentImage = pos[namespace][coordKey] || null;

      // --- INPUT DE FILTRE ---
      const filterInput = document.createElement("input");
      filterInput.placeholder = "Filtrer...";
      filterInput.style.margin = "5px auto";
      filterInput.style.display = "block";
      container.appendChild(filterInput);

      const applyFilter = () => {
        const query = filterInput.value.toLowerCase();
        const blocks = container.querySelectorAll("p");

        blocks.forEach(p => {
          const text = p.textContent.toLowerCase();
          let showBlock = false;

          // Si le texte du <p> correspond => on affiche tout le bloc
          if (text.includes(query)) {
            showBlock = true;
          }

          // On traite ensuite les images juste après
          let next = p.nextElementSibling;
          let foundMatchingImage = false;

          while (next && next.tagName === "IMG") {
            const alt = next.alt.toLowerCase();
            const match = alt.includes(query);

            // Si le <p> ne match pas, on masque les images non-matching
            if (!showBlock) {
              next.style.display = match ? "inline-block" : "none";
              if (match) foundMatchingImage = true;
            } else {
              // si le p match, on affiche toutes les images
              next.style.display = "inline-block";
            }

            next = next.nextElementSibling;
          }

          // Si le p ne match pas mais qu'une image match => on garde le p
          if (!showBlock && foundMatchingImage) {
            p.style.display = "block";
          } else {
            p.style.display = showBlock ? "block" : "none";
          }
        });
      };

      filterInput.addEventListener("input", applyFilter);

      // Ajout des images personnalisées (si existantes)
      if (images[typeBatiment]) {
        const customTitle = document.createElement("p");
        customTitle.textContent = "Images personnalisées";
        container.appendChild(customTitle);

        images[typeBatiment].forEach(url => {
          const img = document.createElement("img");
          img.src = url;
          img.alt = typeBatiment;
          img.style.width = "40px";
          img.style.height = "auto";
          img.style.margin = "3px";
          img.style.cursor = "pointer";
          img.style.border =
            url === currentImage
              ? "2px solid red"
              : "2px solid transparent";

          img.onclick = () => {
            container.querySelectorAll("img")
              .forEach(i => i.style.border = "2px solid transparent");

            img.style.border = "2px solid red";

            const posData = getPosStorage();
            posData[namespace][coordKey] = url;
            setPosStorage(posData);

            applyBackground(x, y);
          };

          container.appendChild(img);
        });
      }

      // Pour chaque groupe de basicImages
      for (const group in basicImages) {
        const groupTitle = document.createElement("p");
        groupTitle.style.marginTop = "10px";
        groupTitle.style.fontWeight = "1000";
        groupTitle.textContent = group;
        container.appendChild(groupTitle);

        for (const type in basicImages[group]) {
          const url = basicImages[group][type];

          const img = document.createElement("img");
          img.src = url;
          img.alt = type;
          img.style.width = "40px";
          img.style.height = "auto";
          img.style.margin = "3px";
          img.style.cursor = "pointer";
          img.style.border =
            url === currentImage
              ? "2px solid red"
              : "2px solid transparent";

          img.onclick = () => {
            container.querySelectorAll("img")
              .forEach(i => i.style.border = "2px solid transparent");

            img.style.border = "2px solid red";

            const posData = getPosStorage();
            posData[namespace][coordKey] = url;
            setPosStorage(posData);

            applyBackground(x, y);
          };

          container.appendChild(img);
        }
      }

      // Applique le filtre dès le chargement
      applyFilter();
    } else {
      // MODE NORMAL => liste simple
      orderedImages.forEach((url) => {
        const img = document.createElement("img");
        img.src = url;
        img.style.width = "40px";
        img.style.height = "auto";
        img.style.margin = "3px";
        img.style.cursor = "pointer";
        img.style.border =
          url === currentImage
            ? "2px solid red"
            : "2px solid transparent";

        img.onclick = () => {
          container.querySelectorAll("img")
            .forEach(i => i.style.border = "2px solid transparent");

          img.style.border = "2px solid red";

          newImages[coordKey] = url;
          storage[namespace] = newImages;
          localStorage.setItem("newImages", JSON.stringify(storage));

          applyBackground(x, y);
        };

        container.appendChild(img);
      });
    }

    // 5️⃣ insertion
    const contentEl = document.querySelector(".map-box-content");
    if (!contentEl) return;

    contentEl.insertAdjacentElement("afterend", container);

  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
