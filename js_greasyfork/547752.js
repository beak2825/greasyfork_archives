// ==UserScript==
// @name     Limpar apostila
// @description Remove todos os elementos exceto a apostila, e centraliza ela no meio verticalmente e horizontalmente
// @author gabrielpm
// @version  1.0.1
// @grant    none
// @match https://conteudosdigitais.uninter.com/libraries/newrota/*
// @noframes
// @license MIT
// @namespace https://greasyfork.org/users/1510037
// @downloadURL https://update.greasyfork.org/scripts/547752/Limpar%20apostila.user.js
// @updateURL https://update.greasyfork.org/scripts/547752/Limpar%20apostila.meta.js
// ==/UserScript==

let limpo = false;

let elemArr = [
  "#tutorial_button",
  "#tuto_container",
  "#aula_atual",
  "#bg-escola",
  "#bg-animado-uninter",
  "#nav_bar",
  "#nav_player",
  "#material_nav",
  "#modal-abrir-links",
  "#modal-footnote",
  "#impressao_options",
  ".Header",
  ".bg_intro",
  ".intro",
];

function clean() {
  if (!limpo) {
    console.log("Limpando...");
    document.querySelector("#lib2020").className = "material impressao";
    elemArr.forEach((elem) => {
      document.querySelector(elem).style.display = "none";
    });

    document.querySelector("#material_drawer_wrap").style.cssText = `
    position: fixed;
    left: 50%;
    right: auto;
    top: -10vh;
    transform: translate(-50%, 0);
    min-height: 110vh;
    margin: 0;
    `;

    document.querySelector(".apostila-wrap").style.height = "110vh";
    limpo = true;
  } else {
    console.log("Sujando...");
    elemArr.forEach((elem) => {
      document.querySelector(elem).style.display = "";
    });
    document.querySelector("#material_drawer_wrap").style.cssText = ``;
    document.querySelector(".apostila-wrap").style.height = "";
    limpo = false;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "AltGraph") {
    clean();
  }
});

setTimeout(() => {
  clean();
}, 4000);
