// ==UserScript==
// @name        Tweaks for DivxATope
// @description Corrects shoddy grammar in this ugly site... as requested.
// @namespace   Swyter
// @match       http://www.divxatope.com/*
// @version     1
// @grant       none
// @run         document-start
// @downloadURL https://update.greasyfork.org/scripts/6213/Tweaks%20for%20DivxATope.user.js
// @updateURL https://update.greasyfork.org/scripts/6213/Tweaks%20for%20DivxATope.meta.js
// ==/UserScript==


String.prototype.replaceArray = function(find_and_replace)
{
  var replaceString = this;
  for (var i = 0; i < find_and_replace.length; i++)
  {
    replaceString = replaceString.replace(find_and_replace[i][0], find_and_replace[i][1], "g");
  }
  return replaceString;
};

document.documentElement.innerHTML = document.documentElement.innerHTML.replaceArray(
[
  [
    "Escribir el titulo aqui ...",
    "Escribe un título..."
  ],
  [
    "Navigate to",
    "Ir a"
  ],
  [
    "Peliculas Castellano",
    "Películas en castellano"
  ],
  [
    "Peliculas HD",
    "Películas en alta definición"
  ],
  [
    "Size:",
    "Tamaño:"
  ],
  [
    "Descarga Torrent",
    "Descarga por Torrent"
  ],
  [
    "Ver Online",
    "Ver en línea"
  ],
  [
    "Deja tu Comentario AQUI!",
    "¡Déjanos un comentario!"
  ],
  [
    "Peliculas Destacadas",
     "Películas destacadas"
  ],
  [
    "Monstrar mas Estrenos de Cine",
    "Ver más estrenos de cine"
  ],
  [
    "Ultimas Publicaciones",
    "Últimas series y películas añadidas"
  ],
  [
    "first",
    "Primera pág."
  ],
  [
    "last</a>",
    "Última pag.</a>"
  ],
  [
    "Next",
    "Siguiente pag."
  ],
  [
    "previous",
    "Pág. anterior"
  ],
  [
    "Ver todas las nociticas",
    "Ver todas las noticias"
  ],
  [
    "Leer mas",
    "Leer más"
  ],
  [
    "Estrenos de Cine",
    "Estrenos de cine"
  ],
  [
    "Mas Descargadas",
    "Más descargadas"
  ],
  [
    "Mas Vistas",
    "Más vistas"
  ],
  [
    "mas vistas del mes",
    "más vistas del mes"
  ],
  [
    "Imprescindibles",
    "imprescindibles"
  ],
  [
    "Ultimas Publicadas",
    "Últimas publicadas"
  ],
  [
    "Ultimas</strong> Noticias",
    "Últimas</strong> noticias"
  ],
  [
    "Ver Pelicula",
    "Ver película"
  ],
  [
    "Peliculas",
    "Películas"
  ],
  [
    "Ultimas",
    "Últimas"
  ],
  [
    "Musica",
    "Música"
  ],
  
]);


//document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/Peliculas/g, "Películas").replace(/Ultimas/g,"Últimas").replace(/Musica/g,"Música").replace(/(\s)([Mm])as(\s)/g, "$1$2ás$3").replace(/Mas(\s\w+)/g, "Más$1");

