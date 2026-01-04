// ==UserScript==
// @name         Copiador Divine Pride
// @namespace    http://tampermonkey.net/
// @version      2025-10-13
// @description  Facilitador para copiar elementos (Nome do item, imagem, link e gerar bb code) do Divine Pride
// @author       You
// @match        https://www.divine-pride.net/database/item/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=divine-pride.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552605/Copiador%20Divine%20Pride.user.js
// @updateURL https://update.greasyfork.org/scripts/552605/Copiador%20Divine%20Pride.meta.js
// ==/UserScript==

$(document).ready(function(){

  $(".container-fluid").eq(0).prepend(`
    <div class="row">
      <div class="col-lg-12 col-md-12 col-xl-9">
        <button id="copiar-link">link</button>
        <button id="copiar-nome">nome</button>
        <button id="copiar-imagem">imagem</button>
        <button id="copiar-bb">bb code</button>
      </div>
    </div>
  `);

  $(".listview-mode-default thead tr").append("<th>Copiadores</th>");
  $(".listview-mode-default tbody tr").each(function() {
    $(this).append(`
      <td style="font-size: 12px;line-height: 25px;">
        <button class="copiar-link">link</button>
        <button class="copiar-nome">nome</button>
        <button class="copiar-imagem">imagem</button>
        <button class="copiar-bb">bbcode</button>
      </td>
  `);
  });

  $("#copiar-link").on("click", function() {
    let url = String(window.location);
    let itemId = url.match(/\/item\/(\d+)/)[1];
    url = "https://www.divine-pride.net/database/item/" + itemId;
    copiarTexto(url);
    divQueSome("Link", url);
  });
  $("#copiar-nome").on("click", function() {
    let nome = $("title").html().trim().replace("\n","").split(" - ").pop();
    copiarTexto();
    divQueSome("Nome", nome);
  });
  $("#copiar-imagem").on("click", function() {
    let url = String(window.location);
    copiarTexto("https://divine-pride.net/img/items/item/bRO/" + (url.match(/\/item\/(\d+)/)[1]));
    divQueSome("Imagem", url);
  });
  $("#copiar-bb").on("click", function() {
    let url = String(window.location);
    let itemId = url.match(/\/item\/(\d+)/)[1];
    url = "https://www.divine-pride.net/database/item/" + itemId;
    let nome = $("title").html().trim().replace("\n","").split(" - ").pop();
    let imagem = "https://divine-pride.net/img/items/item/bRO/" + itemId;
    let textofinal = `[img=${imagem}] [url=${url}]${nome}[/url]`;
    copiarTexto(textofinal);
    divQueSome("BB Code", textofinal);
  });

  $(".copiar-link").on("click", function() {
    let link = $(this).closest("tr").find("td").first().find("a").attr("href");
    link = "https://www.divine-pride.net/database/item/" + link.match(/\/item\/(\d+)/)[1];
    copiarTexto(link);
    divQueSome("Link", link);
  });
  $(".copiar-nome").on("click", function() {
    let nome = $(this).closest("tr").find("td").first().find("a").html();
    copiarTexto(nome);
    divQueSome("Nome", nome);
  });
  $(".copiar-imagem").on("click", function() {
    let url = "https://divine-pride.net/img/items/item/bRO/" + String($(this).closest("tr").find("td").first().find("a").attr("href")).match(/\/item\/(\d+)/)[1];
    copiarTexto(url);
    divQueSome("Link", url);
  });
  $(".copiar-bb").on("click", function() {
    let url = $(this).closest("tr").find("td").first().find("a").attr("href");
    let itemId = url.match(/\/item\/(\d+)/)[1];
    url = "https://www.divine-pride.net/database/item/" + itemId;
    let nome = $(this).closest("tr").find("td").first().find("a").html();
    let imagem = "https://divine-pride.net/img/items/item/bRO/" + itemId;
    let textofinal = `[img=${imagem}] [url=${url}]${nome}[/url]`;
    copiarTexto(textofinal);
    divQueSome("BB Code", textofinal);
  });

  function divQueSome(elemento, texto) {
    $(`<div style="position:fixed;top: 20px;left: 50%;background: #000000b5;color: white;transform: translateX(-50%);padding: 10px 20px;border-radius: 5px;">${elemento} copiado ✅<br>${texto}</div>`)
      .appendTo('body')               // adiciona ao body
      .hide()                         // começa oculta
      .fadeIn(200)                    // aparece suavemente
      .delay(2000)                    // espera 3 segundos
      .fadeOut(400, function() {      // desaparece suavemente
        $(this).remove();             // remove do DOM
      });
  }

  function copiarTexto(textToCopy) {
    var tempTextArea = $('<textarea>'); // Create a temporary textarea
    $('body').append(tempTextArea); // Append it to the body
    tempTextArea.val(textToCopy).select(); // Set value and select text

    try {
        document.execCommand('copy'); // Execute copy command
    } catch (err) {
        console.error('Failed to copy text:', err);
    } finally {
        tempTextArea.remove(); // Remove the temporary textarea
    }
  }

});