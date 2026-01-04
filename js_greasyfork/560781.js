// ==UserScript==
// @name         Mets en évidence les fichiers non téléchargés
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Mets en évidence les fichiers non téléchargés et permet de les rendre disponibles ou de les télécharger
// @author       Grummfy
// @match        https://black-book-editions.fr/mon_compte.php?a=pdf*
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @grant        GM_notification
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560781/Mets%20en%20%C3%A9vidence%20les%20fichiers%20non%20t%C3%A9l%C3%A9charg%C3%A9s.user.js
// @updateURL https://update.greasyfork.org/scripts/560781/Mets%20en%20%C3%A9vidence%20les%20fichiers%20non%20t%C3%A9l%C3%A9charg%C3%A9s.meta.js
// ==/UserScript==


// compatibility layer
const GMRequest = (typeof GM !== 'undefined' && (
  (typeof GM.xmlHttpRequest !== 'undefined' && GM.xmlHttpRequest) ||
  (typeof GM_xmlhttpRequest !== 'undefined' && GM_xmlhttpRequest)
)) || function() { console.error("GM.xmlHttpRequest ou GM_xmlhttpRequest non disponible !") }

const GMOpenTab = (() => {
  if (typeof GM !== 'undefined' && typeof GM.openInTab === 'function') {
    return GM.openInTab
  }
  if (typeof GM_openInTab === 'function') {
    return GM_openInTab
  }
  return (url) => window.open(url, '_blank')
})()

const GMNotify = (typeof GM !== 'undefined' && (
  (typeof GM.notification !== 'undefined' && GM.notification) ||
  (typeof GM_notification !== 'undefined' && GM_notification)
)) || function(options) {
  alert(`${options.title}\n\n${options.text}`);
}

// btn features
const downloadAll = async () => {
  const links = document.querySelectorAll('a._bbe-ready-to-dl')
  let processedLinks = 0
  if (links.length <= 0) {
    console.log('Aucun téléchargement disponible')
    GMNotify({
      title: 'Rien à faire',
      text: 'Aucun téléchargement disponible',
      timeout: 10000,
      highlight: true,
    })
    return
  }

  const openLinkWithDelay = (link) => {
    return new Promise((resolve) => {
      GMOpenTab(link.href, { active: false })
      console.log(`Lien ouvert : ${link.href}`)

      // Attend x secondes histoire de laisser BBE soufler
      setTimeout(resolve, 10000)
    })
  }
  
  
  openProgressDialog('Lancement des téléchargemements en cours...', links.length)
  for (const link of links) {
    await openLinkWithDelay(link)
      
    processedLinks++
    updateProgressDialog(processedLinks, links.length)
  }

  // Affiche une notification à la fin
  GMNotify({
    title: 'Téléchargements terminés',
    text: `Tous les liens ont été ouverts avec succès ! (${links.length} fichiers)`,
    timeout: 10000,
    highlight: true,
  })
}

// rend les éléments facilement actionnable pour les boutons et met en évidence les éléments non téléchargé
const easeMatchingElement = () => {
	const dl = document.querySelectorAll('html body div#main div.container div#main_content.bottomPadded div table.table.table-hover.table-striped tbody tr td:nth-child(5)')
  dl.forEach((element) => {
    // chaque élément sans dl
    if (element.textContent.trim() != '0') {
      return
    }


    // on injecte les classes de mises en évidence et de sélection simple
    element.className = `${element.className} _bbe-never-dl`
    const dlStatus = element.parentNode.querySelector('td:last-child')
    const dlStatusTxt = dlStatus.textContent.trim()
    if (dlStatusTxt == 'Désarchiver & Télécharger') {
      // de-archive & dl
      const dlBtn = dlStatus.querySelector('a')
      dlBtn.className = `${dlBtn.className} _bbe-ready-to-dl`
    }
    else if (dlStatusTxt == '') {
      return
    }
    else {
      // ready to dl
      const dlBtn = dlStatus.querySelector('a')
      dlBtn.className = `${dlBtn.className} _bbe-ready-to-dl`
    }
  })
}

const injectProgressDialogElement = () => {
  const progressDialog = document.createElement('dialog')
  progressDialog.id = '_bbe-progress-dialog'
  progressDialog.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h3 id="_bbe-dialog-title">Traitement en cours...</h3>
      <p id="_bbe-dialog-message">Veuillez patienter.</p>
      <progress id="_bbe-progress-bar" value="0" max="100" style="width: 100%; margin: 10px 0;"></progress>
      <p id="_bbe-progress-text">0%</p>
      <button id="_bbe-close-dialog" style="margin-top: 10px;">Fermer</button>
    </div>
  `

  // Ajoute la boîte de dialogue au body
  document.body.appendChild(progressDialog)
  
  document.getElementById('_bbe-close-dialog').onclick = () => { document.getElementById('_bbe-progress-dialog').close() }
}

const openProgressDialog = (title, totalLinks) => {
  const dialog = document.getElementById('_bbe-progress-dialog')
  const progressBar = document.getElementById('_bbe-progress-bar')
  const progressText = document.getElementById('_bbe-progress-text')
  const dialogTitle = document.getElementById('_bbe-dialog-title')
  const dialogMessage = document.getElementById('_bbe-dialog-message')
  
  dialogTitle.textContent = title
  dialogMessage.textContent = `0/${totalLinks}...`
  dialog.showModal()
}

const updateProgressDialog = (processedLinks, totalLinks) => {
  const progressBar = document.getElementById('_bbe-progress-bar')
  const progressText = document.getElementById('_bbe-progress-text')
  const dialogMessage = document.getElementById('_bbe-dialog-message')
  
  const progress = Math.round((processedLinks / totalLinks) * 100)
  progressBar.value = progress
  progressText.textContent = `${progress}%`
  dialogMessage.textContent = `${processedLinks}/${totalLinks}...`
}

const injectStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    ._bbe-never-dl {
      background-repeat: repeat-x;
      border-color: #3e8f3e;
      background-image: linear-gradient(to bottom,#5cb85c 0,#419641 100%);
    }
    
    #_bbe-progress-dialog {
      border: none;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      padding: 0;
      max-width: 400px;
      width: 90%;
    }
    
    #_bbe-progress-dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    #_bbe-close-dialog {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    #_bbe-close-dialog:hover {
      background-color: #45a049;
    }
  `
  document.head.appendChild(style)
}

(function () {
	easeMatchingElement()
  injectStyles()
  injectProgressDialogElement()
  
  const dlTable = document.querySelector('table.table.table-hover.table-striped')
  if (!dlTable) {
    GMNotify({
      title: 'Erreur',
      text: 'Tableau de téléchargement indisponible',
      timeout: 10000,
      highlight: true,
    })
    return
  }

  // inject dl all btn
  const btnDownloadAll = document.createElement('button')
  btnDownloadAll.className = 'btn btn-success'
  btnDownloadAll.textContent = 'Télécharger tout ce qui n\'a pas été télécharger' 
  btnDownloadAll.onclick = () => { downloadAll() }
  
  dlTable.parentNode.insertBefore(btnDownloadAll, dlTable)
})()