// ==UserScript==
// @name        Tim Cep
// @namespace   Alpe
// @include     http://www.livetim.tim.com.br/rj
// @version     2.3
// @grant       none
// @run-at      document-end
// @description Checa se Live Tim está disponível no CEP
// @downloadURL https://update.greasyfork.org/scripts/7164/Tim%20Cep.user.js
// @updateURL https://update.greasyfork.org/scripts/7164/Tim%20Cep.meta.js
// ==/UserScript==

cep = []
cepsingle = 0
multi = true

tipos = ["","SERVICO DISPONIVEL","SERVICO BREVISSIMO","EM BREVE","SERVICO NAO DISPONIVEL - POSSIVEL","SERVICO NAO DISPONIVEL - IMPOSSIVEL"];

function type(){
  for (i = 1; i <= 5; i++){
    if ($('#tipo_' + i)[0].offsetTop != 0){
      return i;
    }
  }
}

if (multi == true && cep.length > 1){
  
  function check(cepcode, numcode){
    $("#form_cep")[0].value = cepcode
    $("#nres")[0].value = numcode
    validar_Cep();
  }
  
  title = document.title
  var types = [[],[],[],[],[],[]]
  
  var n = 0;
  function myLoop () {
    if (n != 0){ voltar(); }
    setTimeout(function () {
      check(cep[n].split(':')[0], cep[n].split(':')[1]);
      setTimeout(function() {types[type()].push(n); }, 1000);
      n++;
      document.title = title + " | " + n + "/" + cep.length
      if (n < cep.length) {
        myLoop();
      } else {
        setTimeout(function() {
          document.title = title
          if (types[1].length != 0){
            for (x = 0; x < types[1].length; x++){ types[1][x] = cep[types[1][x] - 1] }
            console.log("1. " + tipos[1] + ": " + types[1].join("; "));
          }
          if (types[2].length != 0){
            for (x = 0; x < types[2].length; x++){ types[2][x] = cep[types[2][x] - 1] }
            console.log("2. " + tipos[2] + ": " + types[2].join("; "));
          }
          if (types[3].length != 0){
            for (x = 0; x < types[3].length; x++){ types[3][x] = cep[types[3][x] - 1] }
            console.log("3. " + tipos[3] + ": " + types[3].join("; "));
          }
          if (types[4].length != 0){
            for (x = 0; x < types[4].length; x++){ types[4][x] = cep[types[4][x] - 1] }
            console.log("4. " + tipos[4] + ": " + types[4].join("; "));
          }
          if (types[5].length != 0){
            for (x = 0; x < types[5].length; x++){ types[5][x] = cep[types[5][x] - 1] }
            console.log("5. " + tipos[5] + ": " + types[5].join("; "));
          }
        }, 2000)
      }
    }, 2000)
  }
  
  myLoop();
  setTimeout('window.location.reload()', 600000);
  
} else {
  title = document.title
  
  if ($("#form_cep")[0].value != cep[cepsingle].split(':')[0] || $("#nres")[0].value != cep[cepsingle].split(':')[1]){
    $("#form_cep")[0].value = cep[cepsingle].split(':')[0]
    $("#nres")[0].value = cep[cepsingle].split(':')[1]
    console.log("modificado");
  }
  
  function run(a){
    if (a = 0){ voltar(); }
    validar_Cep();
    setTimeout(function() {document.title = title + " | " + type() + ". " + tipos[i] + " | " + data; }, 2000);
  }
  run();
  setInterval(function() {run(0); }, 60000);
}