// ==UserScript==
// @name        pf2.tools Templates en Español
// @namespace   https://phoneixs.github.io
// @match       https://template.pf2.tools/*
// @grant       none
// @version     1.0
// @author      PhoneixS
// @description:en-US Script to translate the values used by the pf2.tools' Template web app into Spanish.
// @description Script para traducir los valores usados por la app web Template de pf2.tools al español.
// @run-at      document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551485/pf2tools%20Templates%20en%20Espa%C3%B1ol.user.js
// @updateURL https://update.greasyfork.org/scripts/551485/pf2tools%20Templates%20en%20Espa%C3%B1ol.meta.js
// ==/UserScript==

console.log("Iniciando traducción")

var newElem = document.createElement( 'script'); //create a script tag
newElem.type = 'text/javascript'; // add type attribute

newElem.innerHTML = `
const Pf2 = {
    alignment: ['cm', 'cn', 'cb', 'nm', 'n', 'nb', 'lm', 'ln', 'lm'],
    size: ['menudo', 'pequeño', 'mediano', 'grande', 'enorme', 'gargantuesco'],
    type: ['aldea', 'pueblo', 'ciudad', 'metrópolis'],
    rarity: ['único', 'raro', 'poco común'],
    categories: ['dote', 'característica', 'objeto', 'criatura', 'peligro', 'armadura', 'runa', 'trampa', 'hechizo', 'foco', 'ritual', 'trasfondo', 'arma', 'organización', 'ascendencia'].sort(),
    actions: ['a', 'aa', 'aaa', 'r', 'f'],
    describe: {
        actions: {
            a: 'acción individual',
            aa: 'dos acciones',
            aaa: 'tres acciones',
            r: 'reacción',
            f: 'acción gratuita'
        }
    },
    traits: {
        all: ["aditivo", "alquímico", "apéndice", "arquetipo", "artefacto", "ataque", "auditivo", "aura", "truco", "encanto", "compañero", "complejo", "composición", "concentrado", "consagración", "contacto", "maldición", "oscuridad", "muerte", "dedicación", "detección", "enfermedad", "tiempo de inactividad", "emoción", "ambiental", "exploración", "extradimensional", "miedo", "florecer", "enfocado", "fortuna", "general", "embrujar", "curación", "incapacitación", "incorpóreo", "infundido", "instinto", "luz", "lingüístico", "letanía", "mágico", "manipular", "mecánico", "mental", "metamagico", "súbdito", "desgracia", "morfosis", "movimiento", "multiclase", "juramento", "abierto", "polimorfia", "posesión", "precioso", "predicción", "presionar", "furia", "revelación", "adivinar", "secreto", "sombra", "habilidad", "dormir", "salpicar", "postura", "invocado", "telepatía", "teletransportación", "trampa", "virulento", "visual", "caótico", "malvado", "bueno", "legal", "enano", "elfo", "gnomo", "duende", "semielfo", "mediano", "semiorco", "humano", "baluarte", "comodidad", "flexible", "ruidoso", "alquimista", "bárbaro", "bardo", "campeón", "clérigo", "druida", "guerrero", "monje", "explorador", "pícaro", "hechicero", "mago", "aberración", "animal", "astral", "bestia", "celestial", "constructo", "dragón", "elemental", "etéreo", "fey", "demonio", "Hongo", "Gigante", "Humanoide", "Monitor", "Citrato", "Planta", "Espíritu", "No-muerto", "Aire", "Tierra", "Fuego", "Agua", "Ácido", "Frío", "Electricidad", "Fuego", "Fuerza", "Negativo", "Positivo", "Sónico", "Bomba", "Consumible", "Elixir", "Invertido", "Mutágeno", "Aceite", "Poción", "Pergamino", "Trampa", "Bastón", "Estructura", "Talismán", "Varita", "Eón", "Anfibio", "Ángel", "Acuático", "Arcón", "Azata", "Boggard", "Brutal", "Caligni", "Gato", "Cambio de forma", "Demonio", "Dero", "Diablo", "Dhampir", "Dinosaurio", "Drow", "Duergar", "Genio", "Fantasma", "Gul", "Gol", "Golem", "Gremlin", "Bruja", "inevitable", "kóbold", "leshy", "hombre lagarto", "tritón", "sin mente", "momia", "mutante", "ninfa", "olfativo", "orco", "proteico", "psicopompo", "rakshasa", "hombre rata", "mar", "diablo", "esqueleto", "ligado al alma", "duende", "enjambre", "tengu", "trol", "vampiro", "hombre criatura", "xulgath", "zombi", "ingerido", "inhalado", "herida", "veneno", "común", "raro", "poco común", "único", "abjuración", "conjuración", "adivinación", "encantamiento", "evocación", "ilusión", "nigromancia", "transmutación", "arcano", "divino", "oculto", "primigenio", "ágil", "adherido", "traidor", "golpe de espaldas", "mortal", "desarmar", "enano", "elfo", "mortal", "finura", "contundente", "mano libre", "gnomo", "trasgo", "agarrar", "mediano", "justa", "monje", "no letal", "orco", "parada", "propulsivo", "alcance", "a distancia", "zancadilla", "alcance", "empujón", "barrido", "atado", "arrojado", "zancadilla", "gemela", "a dos manos", "desarmado", "versátil", "volea"].sort(),
        data: {
            'aditivo': 'Las dotes con el rasgo aditivo te permiten gastar acciones para añadir sustancias especiales a bombas o elixires. Solo puedes añadir un aditivo a un objeto alquímico, e intentar añadir otro lo estropea. Normalmente, solo puedes usar acciones con el rasgo aditivo al crear un objeto alquímico infundido, y algunas solo se pueden usar con la acción Alquimia Rápida. El rasgo aditivo siempre va seguido de un nivel, como aditivo 2. Un aditivo suma su nivel al del objeto alquímico que estás modificando; el resultado es el nuevo nivel de la mezcla. El nivel del objeto de la mezcla no debe ser superior a tu nivel de alquimia avanzada.'
        }
    },
}
`;
document.getElementsByTagName("head")[0].appendChild(newElem); // Insert it as the last child of body

var scripts = document.body;

// Options for the observer (which mutations to observe)
const config = { childList: true };

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      if (mutation.addedNodes[0].src && mutation.addedNodes[0].src.endsWith("/app/pf2.js")) {
        observer.disconnect();
        mutation.addedNodes[0].parentNode.removeChild(mutation.addedNodes[0]);
        console.log("Encontrado y eliminada traducción original!");
      }

    }
  }
};

const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(scripts, config);
