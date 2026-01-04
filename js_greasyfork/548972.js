// ==UserScript==
// @name        NAV-Estado de patio inbound
// @description Permite visualizar las unidades reportadas, registrar el tiempo en que se solicitó perfilar, guardar número de gafete e identificación, el tiempo dentro de cervecería, y los tiempos en los que se realizaron las tareas.
// @namespace   CBI_P44_Plugins
// @version     4.1.10
// @author      tomasmoralescbi
// @include     https://yard-visibility-na12.voc.project44.com/asset/trailer_listing
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/548972/NAV-Estado%20de%20patio%20inbound.user.js
// @updateURL https://update.greasyfork.org/scripts/548972/NAV-Estado%20de%20patio%20inbound.meta.js
// ==/UserScript==
 
(function() {
  // Variables to store authorization and cookie information
  let authorization = '';
  let cookieValue = '';
  let yardData = [];
  let taskData = []; // Store task data
  let carrierData = []; // Store carrier data
  let modalCreated = false;
  let refreshIntervalId = null;
  let taskRefreshIntervalId = null;
  let trailerCheckIntervalId = null;
  let sortConfig = { column: null, direction: 'asc' };
  let filters = {};
  let appointmentCache = {}; // Cache appointment data to reduce API calls
  let statusBar = null;
  let loadingPercentage = 0;
  let productTypeCache = []; // Cache for product types
  let activityLogCache = {}; // Cache for activity log data
 
  // Add these variables at the top with your other variable declarations
  let carrierDataCache = null;
  let productTypeDataCache = null;
  let lastYardDataFetch = 0;
  let lastTaskDataFetch = 0;
  const FETCH_INTERVAL = 10000; // 10 seconds
 
 
  // Status bar management
  function createStatusBar() {
    if (statusBar) return;
    
    statusBar = document.createElement('div');
    statusBar.id = 'yard-status-bar';
    statusBar.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      width: 400px;
      height: 40px;
      background-color: #f0f0f0;
      border: 2px solid #4185f4;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      display: block;
      visibility: visible;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.cssText = `
      height: 100%;
      background: linear-gradient(90deg, #4CAF50, #4185f4);
      width: 0%;
      transition: width 0.3s ease;
      border-radius: 18px;
    `;
    
    const progressText = document.createElement('div');
    progressText.id = 'progress-text';
    progressText.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #333;
      font-size: 14px;
      font-weight: bold;
      text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
      z-index: 100000;
    `;
    progressText.textContent = 'Inicializando...';
    
    statusBar.appendChild(progressBar);
    statusBar.appendChild(progressText);
    document.body.appendChild(statusBar);
    
    // Force display
    setTimeout(() => {
      statusBar.style.display = 'block';
      statusBar.style.visibility = 'visible';
    }, 100);
  }
 
  function updateStatusBar(percentage, text) {
    if (!statusBar) createStatusBar();
    
    // Force the status bar to be visible and in front
    statusBar.style.display = 'block';
    statusBar.style.visibility = 'visible';
    statusBar.style.zIndex = '99999';
    
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) progressBar.style.width = percentage + '%';
    if (progressText) progressText.textContent = text || 'Cargando... ' + percentage + '%';
    
    if (percentage >= 100) {
      setTimeout(() => {
        statusBar.style.display = 'none';
        statusBar.style.visibility = 'hidden';
      }, 3000);
    }
  }
 
  function showStatusBar() {
    if (!statusBar) createStatusBar();
    statusBar.style.display = 'block';
    statusBar.style.visibility = 'visible';
    statusBar.style.zIndex = '99999';
  }
 
  function hideStatusBar() {
    if (statusBar) {
      statusBar.style.display = 'none';
      statusBar.style.visibility = 'hidden';
    }
  }
 
  // Function to fetch activity log for missing data
  function fetchActivityLog(uuid) {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
 
      // Check cache first
      if (activityLogCache[uuid]) {
        resolve(activityLogCache[uuid]);
        return;
      }
 
      console.log("Fetching activity log for UUID: " + uuid);
 
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
 
      fetch('https://yard-visibility-na12.api.project44.com/v1/asset/activity-log/search?start=1&end=10&asset_class=trailer&asset_id=' + uuid + '&site=nava&activity_type=arrival', {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Activity log API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log("Activity log fetched successfully for UUID: " + uuid);
        
        let activityData = {
          reference_1: '',
          reference_2: '',
          load_information: []
        };
 
        if (data.data && data.data.length > 0) {
          const latestActivity = data.data[0]; // Get the most recent activity
          const shipmentDetails = latestActivity.snapshot_details?.shipment_details;
          
          if (shipmentDetails) {
            activityData.reference_1 = shipmentDetails.reference_1 || '';
            activityData.reference_2 = shipmentDetails.reference_2 || '';
            activityData.load_information = shipmentDetails.load_information || [];
          }
        }
 
        // Cache the result
        activityLogCache[uuid] = activityData;
        resolve(activityData);
      })
      .catch(error => {
        console.log("Error fetching activity log:", error.message);
        // Cache empty result to avoid repeated failed requests
        activityLogCache[uuid] = { reference_1: '', reference_2: '', load_information: [] };
        resolve(activityLogCache[uuid]);
      });
    });
  }
 
  // Function to get enriched data with activity log fallback
  function getEnrichedData(item) {
    return new Promise((resolve) => {
      const currentData = {
        reference_1: item.trailer?.shipment_details?.reference_1 || '',
        reference_2: item.trailer?.shipment_details?.reference_2 || '',
        load_information: item.trailer?.load_information || []
      };
 
      // Check if we need to fetch activity log data
      const needsActivityLog = !currentData.reference_1 || !currentData.reference_2 || currentData.load_information.length === 0;
 
      if (needsActivityLog && item.uuid) {
        fetchActivityLog(item.uuid)
          .then(activityData => {
            const enrichedData = {
              ...item,
              enriched_reference_1: currentData.reference_1 || activityData.reference_1,
              enriched_reference_2: currentData.reference_2 || activityData.reference_2,
              enriched_load_information: currentData.load_information.length > 0 ? currentData.load_information : activityData.load_information
            };
            resolve(enrichedData);
          })
          .catch(() => {
            // If activity log fails, return current data
            resolve({
              ...item,
              enriched_reference_1: currentData.reference_1,
              enriched_reference_2: currentData.reference_2,
              enriched_load_information: currentData.load_information
            });
          });
      } else {
        // Return current data if no activity log needed
        resolve({
          ...item,
          enriched_reference_1: currentData.reference_1,
          enriched_reference_2: currentData.reference_2,
          enriched_load_information: currentData.load_information
        });
      }
    });
  }
 
  
// Modified fetchProductTypes function - fetch only once
function fetchProductTypes() {
  return new Promise((resolve, reject) => {
    // Return cached data if available
    if (productTypeDataCache !== null) {
      console.log("Using cached product types data");
      productTypeCache = productTypeDataCache;
      resolve(productTypeDataCache);
      return;
    }
 
    if (!authorization || !cookieValue) {
      reject(new Error("Authorization or Cookie not captured yet."));
      return;
    }
    
    console.log("Fetching product types...");
    
    const headers = new Headers();
    headers.append('Authorization', authorization);
    headers.append('Cookie', cookieValue);
    
    fetch('https://yard-visibility-na12.api.project44.com/v1/dock-configuration/product-type/list', {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Product types API responded with status ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log("Product types fetched successfully", { items: data.data?.length || 0 });
      productTypeCache = data.data || [];
      productTypeDataCache = productTypeCache; // Cache the data
      resolve(productTypeCache);
    })
    .catch(error => {
      console.log("Error fetching product types:", error.message);
      resolve([]); // Return empty array on error
    });
  });
}
 
 
 
  // Function to get asset details
  function getAssetDetails(uuid) {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
 
      console.log("Fetching asset details for UUID: " + uuid);
 
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
 
      fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + uuid, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Asset API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log("Asset details fetched successfully for UUID: " + uuid);
        resolve(data);
      })
      .catch(error => {
        console.log("Error fetching asset details:", error.message);
        reject(error);
      });
    });
  }
 
  // Function to create trailer departure
  function createTrailerDeparture(payload) {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
 
      console.log("Creating trailer departure...");
 
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
      headers.append('Content-Type', 'application/json');
 
      fetch('https://yard-visibility-na12.api.project44.com/v1/gate/console/trailer', {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Departure API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log("Trailer departure created successfully");
        resolve(data);
      })
      .catch(error => {
        console.log("Error creating trailer departure:", error.message);
        reject(error);
      });
    });
  }
 
  // Function to extract values from comment XML
  function extractFromComment(comment, tag) {
    if (!comment) return '';
    const regex = new RegExp('<' + tag + '>(.*?)</' + tag + '>');
    const match = comment.match(regex);
    return match ? match[1] : '';
  }
 
  // Function to update comment with new value - optimized with size limit
  function updateCommentTag(comment, tag, value) {
    if (!comment) comment = '';
    const regex = new RegExp('<' + tag + '>.*?</' + tag + '>');
    const newTag = '<' + tag + '>' + value + '</' + tag + '>';
    
    let updatedComment;
    if (comment.match(regex)) {
      updatedComment = comment.replace(regex, newTag);
    } else {
      updatedComment = comment + newTag;
    }
    
    // Check if comment exceeds 500 characters
    if (updatedComment.length > 500) {
      // List of tags that can be removed to free space (in order of priority)
      const removableTags = ['<b>', '<c>', '<d>', '<e>', '<f>', '<g>', '<h>', '<i>', '<j>', '<k>', '<l>', '<m>', '<n>', '<o>', '<p>', '<q>', '<r>', '<s>', '<t>'];
      
      // Remove tags until we're under the limit
      for (const removeTag of removableTags) {
        if (updatedComment.length <= 500) break;
        
        const removeRegex = new RegExp('<' + removeTag.slice(1, -1) + '>.*?</' + removeTag.slice(1, -1) + '>', 'g');
        updatedComment = updatedComment.replace(removeRegex, '');
      }
      
      // If still too long, truncate
      if (updatedComment.length > 500) {
        updatedComment = updatedComment.substring(0, 500);
      }
    }
    
    return updatedComment;
  }
 
  // Function to show loading modal
  function showLoadingModal() {
    const modal = document.createElement('div');
    modal.id = 'loading-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 21003;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
 
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background-color: white;
      padding: 40px;
      border-radius: 10px;
      text-align: center;
      min-width: 300px;
    `;
 
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      border: 4px solid #f3f3f3;
      border-top: 4px solid #4185f4;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px auto;
    `;
 
    // Add CSS animation for spinner
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
 
    const message = document.createElement('p');
    message.textContent = 'CARGANDO DATOS DE SALIDA...';
    message.style.cssText = `
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin: 0;
    `;
 
    modalContent.appendChild(spinner);
    modalContent.appendChild(message);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
 
    return modal;
  }
 
  // Function to hide loading modal
  function hideLoadingModal(modal) {
    if (modal && modal.parentNode) {
      document.body.removeChild(modal);
    }
  }
 
  // Function to show departure window (async)
  function showDepartureWindow(item) {
    // Show loading modal immediately
    const loadingModal = showLoadingModal();
 
    // Start async operations
    Promise.all([
      getAssetDetails(item.uuid),
      getEnrichedData(item)
    ])
    .then(([assetData, enrichedItem]) => {
      // Hide loading modal
      hideLoadingModal(loadingModal);
      
      // Create the departure modal with enriched data
      createDepartureModal(assetData, enrichedItem);
    })
    .catch(error => {
      hideLoadingModal(loadingModal);
      alert('Error obteniendo detalles del activo: ' + error.message);
    });
  }
 
function createDepartureModal(assetData, enrichedItem) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 21000;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow-y: auto;
    `;
 
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      margin: 20px;
    `;
 
    const title = document.createElement('h2');
    title.textContent = 'CREAR SALIDA DE TRAILER';
    title.style.cssText = `
      text-align: center;
      margin-bottom: 20px;
      color: #333;
    `;
    modalContent.appendChild(title);
 
    // Extract values using enriched data
    const folio = (enrichedItem.enriched_reference_1 || 
                   assetData.trailer?.shipment_details?.reference_1 || 
                   assetData.trailer?.shipment_no || '').toUpperCase();
    
    const entrega = (enrichedItem.enriched_reference_2 || 
                     assetData.trailer?.shipment_details?.reference_2 || '').toUpperCase();
    
    const nombre = ((assetData.cab?.first_name || '') + ' ' + (assetData.cab?.last_name || '')).trim().toUpperCase();
 
    // Material list using enriched data
    let materialList = '';
    const loadInfo = enrichedItem.enriched_load_information.length > 0 ? 
                     enrichedItem.enriched_load_information : 
                     (assetData.trailer?.load_information || []);
    
    if (loadInfo.length > 0) {
      materialList = loadInfo.map(item => 
        item.sku.toUpperCase() + ' (' + item.qty + ')'
      ).join(', ');
    }
 
    // Extract comment values
    const comment = assetData.trailer?.comment || assetData.comment || '';
    const razonRechazo = extractFromComment(comment, 'rr');
    const incidenciaTransporte = extractFromComment(comment, 'w');
    const incidenciaSeguridad = extractFromComment(comment, 'x');
    const incidenciaAlmacen = extractFromComment(comment, 'y');
    const localizador = extractFromComment(comment, 'lo');
 
    // Create form fields
    const createField = (label, value, editable = false, isDropdown = false, dropdownOptions = []) => {
      const fieldDiv = document.createElement('div');
      fieldDiv.style.cssText = `
        margin-bottom: 15px;
      `;
 
      const labelElement = document.createElement('label');
      labelElement.textContent = label + ':';
      labelElement.style.cssText = `
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #333;
      `;
 
      let inputElement;
      if (isDropdown && editable) {
        inputElement = document.createElement('select');
        inputElement.style.cssText = `
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          text-transform: uppercase;
        `;
        
        // Add options
        dropdownOptions.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          // Fix: Properly compare the values (case insensitive and trimmed)
          if (option.trim().toUpperCase() === value.trim().toUpperCase()) {
            optionElement.selected = true;
          }
          inputElement.appendChild(optionElement);
        });
        
        // If no option was selected and value exists, set the value directly
        if (value && inputElement.selectedIndex === 0 && value.trim() !== '') {
          inputElement.value = value;
        }
      } else {
        inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = value;
        inputElement.readOnly = !editable;
        inputElement.style.cssText = `
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          text-transform: uppercase;
          background-color: ` + (editable ? '#fff' : '#f5f5f5') + `;
        `;
      }
 
      fieldDiv.appendChild(labelElement);
      fieldDiv.appendChild(inputElement);
      return { fieldDiv, inputElement };
    };
 
    // Add fields
    const folioField = createField('FOLIO', folio);
    modalContent.appendChild(folioField.fieldDiv);
 
    const entregaField = createField('ENTREGA', entrega);
    modalContent.appendChild(entregaField.fieldDiv);
 
    const materialField = createField('MATERIAL', materialList);
    modalContent.appendChild(materialField.fieldDiv);
 
    const nombreField = createField('NOMBRE', nombre);
    modalContent.appendChild(nombreField.fieldDiv);
 
    // Rejection reasons dropdown options
    const rejectionReasons = [
      '',
      'R1-RECHAZO ALARMA DE REVERSA',
      'R1-RECHAZO CHALECO',
      'R1-RECHAZO CORTINAS',
      'R1-RECHAZO DUELAS DAÑADAS DE CAJA',
      'R1-RECHAZO FALLA ELECTRICA',
      'R1-RECHAZO FUGA DE ACEITE',
      'R1-RECHAZO GAFETE',
      'R1-RECHAZO LLANTA POCHADA',
      'R1-RECHAZO OBJETOS EXTRAÑOS',
      'R1-RECHAZO OPERADOR VETADO',
      'R1-RECHAZO PANTALON ROTO',
      'R1-RECHAZO POR ACOMPAÑANTE',
      'R1-RECHAZO POR ARRANQUE',
      'R1-RECHAZO POR FALTA SPOT (TAREAS)',
      'R1-RECHAZO POR LLEGAR TARDE AL AREA',
      'R1-RECHAZO POR LUCES',
      'R1-RECHAZO POR PUERTAS',
      'R1-RECHAZO POR SELLOS',
      'R1-RECHAZO POR ZAPATOS DE SEGURIDAD',
      'R1-RECHAZO POSITIVO DOPING',
      'R1-RECHAZOS POR BOLSAS DE AIRE',
      'R1-RECHAZO POR ALMACEN ERRONEO',
      'R1-RECHAZO POR CAJA DAÑADA',
      'R1-RECHAZO POR SISTEMA YMS',
      'R1-RECHAZO POR EPP',
      'R1-RECHAZO POR GAFETE',
      'R1-RECHAZO POR FALLA MECANICA',
      'R2-RECHAZO ALMACEN LLENO',
      'R2-RECHAZO PAPELERIA ERRONEA',
      'R2-RECHAZO POR AIRE (CLIMA)',
      'R2-RECHAZO POR FALLA DE RAMPAS',
      'R2-RECHAZO POR LLUVIA',
      'R2-RECHAZO POR MATERIAL DAÑADO',
      'R2-RECHAZO SAP/SYSTORE',
      'R2-RECHAZO MATERIAL COLAPSADO',
      'R2-RECHAZO POR CALIDAD',
      'R2-RECHAZO POR ALMACÉN',
      'R2-RECHAZO POR ELABORACIÓN'
    ];
 
    const razonRechazoField = createField('RAZÓN DE RECHAZO', razonRechazo, true, true, rejectionReasons);
    modalContent.appendChild(razonRechazoField.fieldDiv);
 
    const incidenciaTransporteField = createField('INCIDENCIA TRANSPORTE', incidenciaTransporte, true);
    modalContent.appendChild(incidenciaTransporteField.fieldDiv);
 
    const incidenciaSeguridadField = createField('INCIDENCIA SEGURIDAD', incidenciaSeguridad, true);
    modalContent.appendChild(incidenciaSeguridadField.fieldDiv);
 
    const incidenciaAlmacenField = createField('INCIDENCIA ALMACÉN', incidenciaAlmacen, true);
    modalContent.appendChild(incidenciaAlmacenField.fieldDiv);
 
    const localizadorField = createField('LOCALIZADOR', localizador);
    modalContent.appendChild(localizadorField.fieldDiv);
 
    // Additional fields if loaded
    let productoField = null;
    if (assetData.status === 'loaded') {
      const sello1Field = createField('SELLO 1', (assetData.trailer?.seal1 || '').toUpperCase());
      modalContent.appendChild(sello1Field.fieldDiv);
 
      const sello2Field = createField('SELLO 2', (assetData.trailer?.seal2 || '').toUpperCase());
      modalContent.appendChild(sello2Field.fieldDiv);
 
      productoField = createField('PRODUCTO', (assetData.trailer?.product_type || '').toUpperCase(), true, true, productTypeCache);
      modalContent.appendChild(productoField.fieldDiv);
    }
 
    // Buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      gap: 10px;
    `;
 
    const salidaNormalButton = document.createElement('button');
    salidaNormalButton.textContent = 'SALIDA NORMAL';
    salidaNormalButton.style.cssText = `
      flex: 1;
      padding: 12px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    `;
 
    const salidaRechazoButton = document.createElement('button');
    salidaRechazoButton.textContent = 'SALIDA CON RECHAZO';
    salidaRechazoButton.style.cssText = `
      flex: 1;
      padding: 12px;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    `;
 
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'CANCELAR';
    cancelButton.style.cssText = `
      flex: 1;
      padding: 12px;
      background-color: #9E9E9E;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    `;
 
    // Event handlers
    salidaNormalButton.onclick = function() {
      processDeparture(assetData, false, {
        razonRechazo: razonRechazoField.inputElement.value,
        incidenciaTransporte: incidenciaTransporteField.inputElement.value,
        incidenciaSeguridad: incidenciaSeguridadField.inputElement.value,
        incidenciaAlmacen: incidenciaAlmacenField.inputElement.value,
        producto: productoField ? productoField.inputElement.value : ''
      })
      .then(() => {
        document.body.removeChild(modal);
      })
      .catch(error => {
        alert('Error procesando salida: ' + error.message);
      });
    };
 
    salidaRechazoButton.onclick = function() {
      showRejectionTypeModal(assetData, {
        razonRechazo: razonRechazoField.inputElement.value,
        incidenciaTransporte: incidenciaTransporteField.inputElement.value,
        incidenciaSeguridad: incidenciaSeguridadField.inputElement.value,
        incidenciaAlmacen: incidenciaAlmacenField.inputElement.value,
        producto: productoField ? productoField.inputElement.value : ''
      }, folioField.inputElement.value)
      .then(() => {
        document.body.removeChild(modal);
      })
      .catch(error => {
        alert('Error procesando salida con rechazo: ' + error.message);
      });
    };
 
    cancelButton.onclick = function() {
      document.body.removeChild(modal);
    };
 
    buttonContainer.appendChild(salidaNormalButton);
    buttonContainer.appendChild(salidaRechazoButton);
    buttonContainer.appendChild(cancelButton);
    modalContent.appendChild(buttonContainer);
 
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}
 
 
  // Function to show rejection type selection modal
  function showRejectionTypeModal(assetData, formData, folio) {
    return new Promise((resolve, reject) => {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 21001;
        display: flex;
        justify-content: center;
        align-items: center;
      `;
 
      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        width: 500px;
        max-height: 600px;
        overflow-y: auto;
      `;
 
      const title = document.createElement('h3');
      title.textContent = 'TIPO DE RECHAZO';
      title.style.cssText = `
        text-align: center;
        margin-bottom: 20px;
        color: #333;
      `;
      modalContent.appendChild(title);
 
      const select = document.createElement('select');
      select.style.cssText = `
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        font-size: 14px;
        border: 1px solid #ddd;
        border-radius: 4px;
      `;
 
      // Rejection types with reason codes
      const rejectionTypes = [
        { text: 'SELECCIONAR TIPO...', code: '' },
        { text: 'Rechazo por calidad', code: 'CAL' },
        { text: 'Rechazo por sellos', code: 'SEL' },
        { text: 'Rechazo por caja dañada', code: 'DAN' },
        { text: 'Rechazo por sistema YMS', code: 'YMS' },
        { text: 'Rechazo por EPP', code: 'EPP' },
        { text: 'Rechazo por gafete', code: 'GAF' },
        { text: 'Rechazo por falla mecánica', code: 'MEC' },
        { text: 'Rechazo por SAP/Systore/E80', code: 'SAP' },
        { text: 'Rechazo por llegar tarde al área', code: 'TAR' },
        { text: 'Rechazo por operador vetado', code: 'VET' },
        { text: 'Rechazo por alarma de reversa', code: 'REV' },
        { text: 'Rechazo por falta de chaleco', code: 'CHA' },
        { text: 'Rechazo por cortinas', code: 'COR' },
        { text: 'Rechazo por duela dañada', code: 'DUE' },
        { text: 'Rechazo por falla eléctrica', code: 'ELE' },
        { text: 'Rechazo por fuga de aceite', code: 'ACE' },
        { text: 'Rechazo por llanta ponchada', code: 'LLA' },
        { text: 'Rechazo por objetos extraños', code: 'EXT' },
        { text: 'Rechazo por pantalón roto', code: 'PAN' },
        { text: 'Rechazo por acompañante', code: 'ACO' },
        { text: 'Rechazo por arranque', code: 'ARR' },
        { text: 'Rechazo por falta de SPOT (áreas)', code: 'SPO' },
        { text: 'Rechazo por luces', code: 'LUC' },
        { text: 'Rechazo por puertas', code: 'PUE' },
        { text: 'Rechazo por zapatos de seguridad', code: 'ZAP' },
        { text: 'Rechazo por positivo doping', code: 'DOP' },
        { text: 'Rechazo por bolsas de aire', code: 'BOL' },
        { text: 'Rechazo por almacén erroneo', code: 'AER' },
        { text: 'Rechazo por almacén lleno', code: 'ALL' },
        { text: 'Rechazo por papelería erronea', code: 'PAP' },
        { text: 'Rechazo por aire (clima)', code: 'AIR' },
        { text: 'Rechazo por falla de rampas', code: 'RAM' },
        { text: 'Rechazo por lluvia', code: 'LLU' },
        { text: 'Rechazo por material dañado', code: 'MDA' },
        { text: 'Rechazo por material colapsado', code: 'MCO' },
        { text: 'Rechazo por almacén', code: 'ALM' },
        { text: 'Rechazo por elaboración', code: 'ELA' }
      ];
 
      rejectionTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.code;
        option.textContent = type.text;
        select.appendChild(option);
      });
 
      modalContent.appendChild(select);
 
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      `;
 
      const confirmButton = document.createElement('button');
      confirmButton.textContent = 'CONFIRMAR';
      confirmButton.style.cssText = `
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      `;
 
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'CANCELAR';
      cancelButton.style.cssText = `
        padding: 10px 20px;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      `;
 
      confirmButton.onclick = function() {
        if (select.value) {
          processDeparture(assetData, true, formData)
            .then(() => {
              // Open Google Apps Script URL
              const cleanFolio = folio.replace(/_[12]\$/, ''); // Fixed regex
              const url = 'https://script.google.com/macros/s/AKfycbx4ON5up4km7Y_BiwakUfClMB9F_s-jaNEMudoeMGyF-KZkkxkCZSy26_kB4wiCHML5jw/exec?shipment=' + cleanFolio + '&reasoncode=' + select.value;
              window.open(url, '_blank');
              
              document.body.removeChild(modal);
              resolve();
            })
            .catch(error => {
              reject(error);
            });
        } else {
          alert('Por favor selecciona un tipo de rechazo');
        }
      };
 
      cancelButton.onclick = function() {
        document.body.removeChild(modal);
        reject(new Error('Cancelado por usuario'));
      };
 
      buttonContainer.appendChild(cancelButton);
      buttonContainer.appendChild(confirmButton);
      modalContent.appendChild(buttonContainer);
 
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
    });
  }
 
  // Function to process departure
  function processDeparture(assetData, isRejection, formData) {
    return new Promise((resolve, reject) => {
      // Update comment with form values
      let updatedComment = assetData.trailer?.comment || assetData.comment || '';
      
      updatedComment = updateCommentTag(updatedComment, 'rr', formData.razonRechazo);
      updatedComment = updateCommentTag(updatedComment, 'w', formData.incidenciaTransporte);
      updatedComment = updateCommentTag(updatedComment, 'x', formData.incidenciaSeguridad);
      updatedComment = updateCommentTag(updatedComment, 'y', formData.incidenciaAlmacen);
 
      // Prepare departure payload
const payload = {
        asset_class: assetData.asset_class,
        type: "departure",
        gate_zone: "eagle eye gate",
        site: "nava",
        site_name: "nava",
        to_site: "nava",
        ble: [],
        lora: [],
        inspection_questions: [
          { question: "Defensa", is_enabled: true },
          { question: "Motor", is_enabled: true },
          { question: "Llantas", is_enabled: true },
          { question: "Piso cabina", is_enabled: true },
          { question: "Tanque Combustible", is_enabled: true },
          { question: "Tanque Combustible", is_enabled: true },
          { question: "Cabina", is_enabled: true },
          { question: "Suspension de Aire", is_enabled: true },
          { question: "Flecha embrague", is_enabled: true },
          { question: "Quinta Rueda", is_enabled: true },
          { question: "Debajo de Plataforma", is_enabled: true },
          { question: "Puertas internas y externas", is_enabled: true },
          { question: "Piso interior de la caja", is_enabled: true },
          { question: "Paredes laterals interior y exterior", is_enabled: true },
          { question: "Pared frontal", is_enabled: true },
          { question: "Techo", is_enabled: true },
          { question: "Escape", is_enabled: true },
          { question: "Agrícola: ausencia de plagas (vivas o muertas), de material orgánico (hongos, sangre, huesos, etc.) y de plantas o productos vegetales (frutas, semillas, etc.)", is_enabled: true },
          { question: "Revision de sello", is_enabled: true },
          { question: "Cumple, NO es una unidad de refrigeración", is_enabled: true },
          { question: "Cumple, SI es una unidad de refrigeración", is_enabled: false }
        ],
        size: assetData.size || 53,
        gate: "salia_ea",
        name: assetData.name,
        rfid: assetData.rfid || "",
        asset_type: assetData.asset_type,
        license_plate_no: assetData.trailer?.license_plate_no || "",
        trailer: assetData.name,
        scheduled_time: assetData.scheduled_time,
        cab_carrier: assetData.cab?.carrier || "",
        carrier: assetData.trailer?.carrier || assetData.cab?.carrier || "",
        asset_condition: [
          {
            code: "passed inspection",
            name: "passed inspection",
            is_admin_only: false
          }
        ],
        first_name: assetData.cab?.first_name || "",
        color: assetData.color || "#6fcd17",
        departure_status: "allowed",
        driver_cell_no: assetData.cab?.driver_cell_no || "",
        uuid: assetData.uuid,
        comment: updatedComment,
        cab_no: assetData.cab?.cab_no || "",
        last_name: assetData.cab?.last_name || "",
        load_type: assetData.trailer?.load_type || "",
        asset_status: "empty",
        is_seal_updated: false,
        is_reefer: assetData.is_reefer || false,
        id: assetData.name,
        gate_name: "salida ea"
      };
 
 
      // Add loaded-specific fields
      if (assetData.status === 'loaded') {
        payload.seal1 = assetData.trailer?.seal1 || "";
        payload.seal2 = assetData.trailer?.seal2 || "";
        payload.product_type = formData.producto;
      }
 
      // Create departure
      createTrailerDeparture(payload)
        .then(result => {
          showDepartureResult(result, true);
          resolve(result);
        })
        .catch(error => {
          showDepartureResult({ message: error.message }, false);
          reject(error);
        });
    });
  }
 
  // Function to show departure result
  function showDepartureResult(result, success) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 21002;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
 
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background-color: white;
      padding: 40px;
      border-radius: 10px;
      width: 400px;
      text-align: center;
    `;
 
    if (success) {
      const smiley = document.createElement('div');
      smiley.textContent = '😊';
      smiley.style.cssText = `
        font-size: 48px;
        margin-bottom: 20px;
      `;
      modalContent.appendChild(smiley);
 
      const message = document.createElement('h3');
      message.textContent = 'SALIDA CREADA EXITOSAMENTE';
      message.style.cssText = `
        color: #4CAF50;
        margin-bottom: 20px;
      `;
      modalContent.appendChild(message);
    } else {
      const errorIcon = document.createElement('div');
      errorIcon.textContent = '❌';
      errorIcon.style.cssText = `
        font-size: 48px;
        margin-bottom: 20px;
      `;
      modalContent.appendChild(errorIcon);
 
      const message = document.createElement('h3');
      message.textContent = 'ERROR EN LA SALIDA';
      message.style.cssText = `
        color: #f44336;
        margin-bottom: 10px;
      `;
      modalContent.appendChild(message);
 
      const errorMsg = document.createElement('p');
      errorMsg.textContent = result.message || 'Error desconocido';
      errorMsg.style.cssText = `
        color: #666;
        margin-bottom: 20px;
        word-wrap: break-word;
      `;
      modalContent.appendChild(errorMsg);
    }
 
    const closeButton = document.createElement('button');
    closeButton.textContent = 'CERRAR';
    closeButton.style.cssText = `
      padding: 10px 20px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    `;
 
    closeButton.onclick = function() {
      document.body.removeChild(modal);
      if (success) {
        // Refresh the table
        fetchYardData(true);
      }
    };
 
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }
 
  // Function to determine status based on conditions
  function determineStatus(item) {
    const folio = item.trailer?.shipment_details?.reference_1 || '';
    const carrier = (item.cab?.carrier || '').toUpperCase();
    const serviceType = (item.trailer?.service_type || '').toUpperCase();
    
    // Get task times
    const ingressTime = getTaskTimeForAsset(item.uuid, 'spot', 'created_time');
    const arrivalToRampTime = getTaskTimeForAsset(item.uuid, 'spot', 'completed_time');
    const endLoadingTime = getTaskTimeForAsset(item.uuid, 'pull', 'created_time');
    const exitRampTime = getTaskTimeForAsset(item.uuid, 'pull', 'completed_time');
    
    // Get notification time
    const notificationTime = extractNotificationTime(item);
    
    // Check conditions in order of priority
    if ((carrier === 'LEYVA' || carrier === 'LYV') && !folio) {
      return 'MOVIMIENTO INTERNO';
    }
    
    if (exitRampTime) {
      return 'SALIENDO';
    }
    
    if (endLoadingTime) {
      if (serviceType === 'INBOUND') {
        return 'TERMINÓ DESCARGA';
      } else if (serviceType === 'OUTBOUND') {
        return 'TERMINÓ CARGA';
      }
    }
    
    if (arrivalToRampTime) {
      if (serviceType === 'INBOUND') {
        return 'DESCARGANDO';
      } else if (serviceType === 'OUTBOUND') {
        return 'CARGANDO';
      }
    }
    
    if (ingressTime) {
      return 'EN CAMINO A RAMPA';
    }
    
    if (notificationTime) {
      return 'PERFILANDO';
    }
    
    return 'EN ESPERA';
  }
 
  // Get row color based on status
  function getRowColorByStatus(status) {
    switch(status) {
      case 'MOVIMIENTO INTERNO':
        return '#e3f2fd'; // Light blue
      case 'SALIENDO':
        return '#e8f5e9'; // Light green
      case 'TERMINÓ DESCARGA':
      case 'TERMINÓ CARGA':
        return '#fff3e0'; // Light orange
      case 'DESCARGANDO':
      case 'CARGANDO':
        return '#fce4ec'; // Light pink
      case 'EN CAMINO A RAMPA':
        return '#f3e5f5'; // Light purple
      case 'PERFILANDO':
        return '#fff8e1'; // Light yellow
      case 'EN ESPERA':
        return '#ffebee'; // Light red
      default:
        return '#f5f5f5'; // Light gray
    }
  }
 
  // Format Unix timestamp to day/month HH:MM
  function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.getDate() + '/' + (date.getMonth() + 1) + ' ' + 
           String(date.getHours()).padStart(2, '0') + ':' + 
           String(date.getMinutes()).padStart(2, '0');
  }
 
  // Calculate time difference between two timestamps and return formatted string
  function calculateTimeDifference(timestamp1, timestamp2) {
    if (!timestamp1 || !timestamp2) return '';
    
    const diff = Math.abs(timestamp1 - timestamp2);
    
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)));
    
    return String(hours).padStart(2, '0') + ':' + 
           String(minutes).padStart(2, '0');
  }
 
  // Calculate time difference with current time and return formatted string with appropriate emoji
  function calculateDwellTime(timestamp) {
    if (!timestamp) return '';
    
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)));
    
    const formattedTime = String(hours).padStart(2, '0') + ':' + 
                         String(minutes).padStart(2, '0') + ':' + 
                         String(seconds).padStart(2, '0');
    
    let emoji = '';
    if (diff < 30 * 60 * 1000) { // less than 30 mins
      emoji = '😊';
    } else if (diff < 60 * 60 * 1000) { // less than 1 hour
      emoji = '😐';
    } else if (diff < 2 * 60 * 60 * 1000) { // less than 2 hours
      emoji = '⚠️';
    } else if (diff < 4 * 60 * 60 * 1000) { // less than 4 hours
      emoji = '⛔';
    } else { // more than 4 hours
      emoji = '💀';
    }
    
    return formattedTime + ' ' + emoji;
  }
 
  // Get latest task time by type and stage for a specific asset
  function getTaskTimeForAsset(uuid, taskType, timeField) {
    if (!taskData || !taskData.length || !uuid) return null;
    
    // Filter tasks by asset UUID and task type
    const relevantTasks = taskData.filter(task => {
      return task.task_type.code === taskType && 
             task.assets && 
             task.assets.some(asset => asset.uuid === uuid);
    });
    
    if (!relevantTasks.length) return null;
    
    // Sort by the specified time field in descending order
    relevantTasks.sort((a, b) => {
      const timeA = a[timeField] || 0;
      const timeB = b[timeField] || 0;
      return timeB - timeA;  // Most recent first
    });
    
    // Return the time from the most recent task
    return relevantTasks[0][timeField];
  }
 
// Modified fetchCarrierData function - fetch only once
function fetchCarrierData() {
  return new Promise((resolve, reject) => {
    // Return cached data if available
    if (carrierDataCache !== null) {
      console.log("Using cached carrier data");
      carrierData = carrierDataCache;
      resolve(carrierDataCache);
      return;
    }
 
    if (!authorization || !cookieValue) {
      reject(new Error("Authorization or Cookie not captured yet."));
      return;
    }
    
    console.log("Fetching carrier data...");
    
    // Create request headers
    const headers = new Headers();
    headers.append('Authorization', authorization);
    headers.append('Cookie', cookieValue);
    
    fetch('https://yard-visibility-na12.api.project44.com/v1/carrier/list?size=100', {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Carrier API responded with status ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log("Carrier data fetched successfully", { items: data.data?.length || 0 });
      
      if (!data.data) {
        console.log("API response missing data property", data);
        reject(new Error("API response missing data property"));
        return;
      }
      
      carrierData = data.data || [];
      carrierDataCache = carrierData; // Cache the data
      resolve(carrierData);
    })
    .catch(error => {
      console.log("Error fetching carrier data:", error.message);
      console.error("Error fetching carrier data:", error);
      reject(error);
    });
  });
}
 
 
 
 
  // Function to get carrier name by SCAC
  function getCarrierName(scac) {
    if (!scac || !carrierData.length) return scac || '';
    
    // First, try direct match
    let carrier = carrierData.find(c => c.scac.toLowerCase() === scac.toLowerCase());
    if (carrier) {
      // If the name is 3 characters, look for one with 0 prefix
      if (carrier.name.length === 3) {
        const prefixedCarrier = carrierData.find(c => c.scac.toLowerCase() === ('0' + carrier.name).toLowerCase());
        if (prefixedCarrier) {
          return prefixedCarrier.name;
        }
      }
      return carrier.name;
    }
    
    // If no direct match found, return the original SCAC
    return scac;
  }
 
// Modified fetchTaskData function - throttle to every 10 seconds
function fetchTaskData() {
  return new Promise((resolve, reject) => {
    const now = Date.now();
    
    // Check if we've fetched within the last 10 seconds
    if (now - lastTaskDataFetch < FETCH_INTERVAL) {
      console.log("Task data fetch throttled, using existing data");
      resolve(taskData);
      return;
    }
 
    if (!authorization || !cookieValue) {
      reject(new Error("Authorization or Cookie not captured yet."));
      return;
    }
    
    console.log("Fetching task data...");
    lastTaskDataFetch = now;
    
    // Create request headers
    const headers = new Headers();
    headers.append('Authorization', authorization);
    headers.append('Cookie', cookieValue);
    
    fetch('https://yard-visibility-na12.api.project44.com/v1/task-search?page_no=1&size=100&site=nava', {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Task API responded with status ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log("Task data fetched successfully", { items: data.data?.length || 0 });
      
      if (!data.data) {
        console.log("API response missing data property", data);
        reject(new Error("API response missing data property"));
        return;
      }
      
      taskData = data.data || [];
      resolve(taskData);
    })
    .catch(error => {
      console.log("Error fetching task data:", error.message);
      console.error("Error fetching task data:", error);
      reject(error);
    });
  });
}
 
 
  // Get appointment data for a trailer
  function fetchAppointmentData(shipmentNo) {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
      
      // Check if we have cached data
      if (appointmentCache[shipmentNo]) {
        resolve(appointmentCache[shipmentNo]);
        return;
      }
      
      console.log('Fetching appointment data for shipment ' + shipmentNo);
      
      // Create request headers
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
      
      fetch('https://yard-visibility-na12.api.project44.com/v1/gate/console/search?event_move=arrival&search_term=' + shipmentNo + '&location_type=gate&screen=gate_console&site=nava', {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Appointment data received for shipment ' + shipmentNo, data);
        
        // Process and cache the data
        if (data.data && data.data.length > 0) {
          const appointmentData = {
            appointmentTime: data.data[0].appointment_information?.appointment_time || null,
            sectionName: data.data[0].appointment_information?.section_name || ''
          };
          
          // Cache the result
          appointmentCache[shipmentNo] = appointmentData;
          resolve(appointmentData);
        } else {
          // Empty result
          appointmentCache[shipmentNo] = { appointmentTime: null, sectionName: '' };
          resolve(appointmentCache[shipmentNo]);
        }
      })
      .catch(error => {
        console.log('Error fetching appointment data for shipment ' + shipmentNo + ':', error.message);
        reject(error);
      });
    });
  }
 
  // Extract notification time from the comment field
  function extractNotificationTime(item) {
    if (!item) return null;
    
    // Check for comment in trailer object first
    if (item.trailer && item.trailer.comment) {
      const trailerMatch = item.trailer.comment.match(/<sc>(\d+)<\/sc>/);
      if (trailerMatch) return parseInt(trailerMatch[1]);
    }
    
    // Then check for comment in the main object
    if (item.comment) {
      const match = item.comment.match(/<sc>(\d+)<\/sc>/);
      if (match) return parseInt(match[1]);
    }
    
    return null;
  }
 
  // Extract security incident comment from the comment field
  function extractSecurityIncident(item) {
    if (!item) return null;
    
    // Check for comment in trailer object first
    if (item.trailer && item.trailer.comment) {
      const trailerMatch = item.trailer.comment.match(/<x>(.*?)<\/x>/);
      if (trailerMatch) return trailerMatch[1];
    }
    
    // Then check for comment in the main object
    if (item.comment) {
      const match = item.comment.match(/<x>(.*?)<\/x>/);
      if (match) return match[1];
    }
    
    return null;
  }
 
  // Extract transport incident from the comment field
  function extractTransportIncident(item) {
    if (!item) return null;
    
    // Check for comment in trailer object first
    if (item.trailer && item.trailer.comment) {
      const trailerMatch = item.trailer.comment.match(/<w>(.*?)<\/w>/);
      if (trailerMatch) return trailerMatch[1];
    }
    
    // Then check for comment in the main object
    if (item.comment) {
      const match = item.comment.match(/<w>(.*?)<\/w>/);
      if (match) return match[1];
    }
    
    return null;
  }
 
  // Extract localizador from the comment field
  function extractLocalizador(item) {
    if (!item) return null;
    
    // Check for comment in trailer object first
    if (item.trailer && item.trailer.comment) {
      const trailerMatch = item.trailer.comment.match(/<lo>(.*?)<\/lo>/);
      if (trailerMatch) return trailerMatch[1];
    }
    
    // Then check for comment in the main object
    if (item.comment) {
      const match = item.comment.match(/<lo>(.*?)<\/lo>/);
      if (match) return match[1];
    }
    
    return null;
  }
 
  // Extract warehouse incident from the comment field
  function extractWarehouseIncident(item) {
    if (!item) return null;
    
    // Check for comment in trailer object first
    if (item.trailer && item.trailer.comment) {
      const trailerMatch = item.trailer.comment.match(/<y>(.*?)<\/y>/);
      if (trailerMatch) return trailerMatch[1];
    }
    
    // Then check for comment in the main object
    if (item.comment) {
      const match = item.comment.match(/<y>(.*?)<\/y>/);
      if (match) return match[1];
    }
    
    return null;
  }
 
  // Extract rejection reason from the comment field
  function extractRejectionReason(item) {
    if (!item) return null;
    
    // Check for comment in trailer object first
    if (item.trailer && item.trailer.comment) {
      const trailerMatch = item.trailer.comment.match(/<rr>(.*?)<\/rr>/);
      if (trailerMatch) return trailerMatch[1];
    }
    
    // Then check for comment in the main object
    if (item.comment) {
      const match = item.comment.match(/<rr>(.*?)<\/rr>/);
      if (match) return match[1];
    }
    
    return null;
  }
 
  // Send notification for a trailer
  function sendNotification(item) {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
      
      if (!item || !item.uuid) {
        reject(new Error("Invalid item data"));
        return;
      }
      
      console.log('Fetching asset details for UUID ' + item.uuid);
      
      // Create request headers
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
      headers.append('Content-Type', 'application/json');
      
      // First, get the current asset data
      fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Asset details received for UUID ' + item.uuid, data);
        
        // Create a new payload with the structure needed for the PUT request
        const currentTimestamp = Date.now();
        let updatePayload = { ...data }; // Create a copy of the base data
        
        // Add the notification timestamp to the comment
        let comment = '';
        
        // If comment exists in trailer, use that, otherwise use the main comment if it exists
        if (data.trailer && data.trailer.comment) {
          comment = data.trailer.comment;
        } else if (data.comment) {
          comment = data.comment;
        }
        
        // Add the timestamp to the comment
        if (comment.includes('<sc>')) {
          // Replace existing timestamp
          comment = comment.replace(/<sc>.*?<\/sc>/, '<sc>' + currentTimestamp + '</sc>');
        } else {
          // Add new timestamp
          comment = comment + '<sc>' + currentTimestamp + '</sc>';
        }
        
        // Set trailer to empty string as in the example
        updatePayload.trailer = '';
        
        // Move trailer properties to the main object
        if (data.trailer && typeof data.trailer === 'object') {
          // Add all trailer properties to the main object
          Object.keys(data.trailer).forEach(key => {
            updatePayload[key] = data.trailer[key];
          });
        }
        
        // Set the comment with the timestamp
        updatePayload.comment = comment;
        
        // Add other required properties shown in the example
        updatePayload.assignedSiteFlag = false;
        updatePayload.maintenance = {};
        updatePayload.rental = {};
        updatePayload.seal1_intact = false;
        updatePayload.seal2_intact = false;
        updatePayload.seal2 = '';
        updatePayload.rfid = '';
        
        console.log('Sending notification update for UUID ' + item.uuid);
        
        // Send the update with the transformed structure
        return fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
          method: 'PUT',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify(updatePayload)
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Update API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(result => {
        console.log('Notification sent for UUID ' + item.uuid, result);
        
        // Update the item in our local data
        const itemIndex = yardData.findIndex(i => i.uuid === item.uuid);
        if (itemIndex !== -1) {
          const currentTimestamp = Date.now();
          
          // Update the comment in our local data structure
          if (yardData[itemIndex].trailer && yardData[itemIndex].trailer.comment) {
            if (yardData[itemIndex].trailer.comment.includes('<sc>')) {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment.replace(
                /<sc>.*?<\/sc>/, 
                '<sc>' + currentTimestamp + '</sc>'
              );
            } else {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment + '<sc>' + currentTimestamp + '</sc>';
            }
          } 
          else if (yardData[itemIndex].comment) {
            if (yardData[itemIndex].comment.includes('<sc>')) {
              yardData[itemIndex].comment = yardData[itemIndex].comment.replace(
                /<sc>.*?<\/sc>/, 
                '<sc>' + currentTimestamp + '</sc>'
              );
            } else {
              yardData[itemIndex].comment = yardData[itemIndex].comment + '<sc>' + currentTimestamp + '</sc>';
            }
          }
        }
        
        // Update the table
        updateTable();
        resolve(result);
      })
      .catch(error => {
        console.log('Error sending notification for UUID ' + item.uuid + ':', error.message);
        reject(error);
      });
    });
  }
 
// Fixed updateTransportIncident function to follow the same pattern as localizador
function updateTransportIncident(item, incidentText) {
  return new Promise((resolve, reject) => {
    if (!authorization || !cookieValue) {
      reject(new Error("Authorization or Cookie not captured yet."));
      return;
    }
    
    if (!item || !item.uuid) {
      reject(new Error("Invalid item data"));
      return;
    }
    
    console.log('Fetching asset details for UUID ' + item.uuid + ' to update transport incident');
    
    // Create request headers
    const headers = new Headers();
    headers.append('Authorization', authorization);
    headers.append('Cookie', cookieValue);
    headers.append('Content-Type', 'application/json');
    
    // First, get the current asset data
    fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('API responded with status ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log('Asset details received for UUID ' + item.uuid, data);
      
      // Create a new payload with the structure needed for the PUT request
      let updatePayload = { ...data }; // Create a copy of the base data
      
      // Add the transport incident to the comment
      let comment = '';
      
      // If comment exists in trailer, use that, otherwise use the main comment if it exists
      if (data.trailer && data.trailer.comment) {
        comment = data.trailer.comment;
      } else if (data.comment) {
        comment = data.comment;
      }
      
      // Add or update the transport incident in the comment using the same logic as localizador
      if (comment.includes('<w>')) {
        // Replace existing transport incident
        comment = comment.replace(/<w>.*?<\/w>/, '<w>' + incidentText + '</w>');
      } else {
        // Add new transport incident
        comment = comment + '<w>' + incidentText + '</w>';
      }
      
      // Set trailer to empty string as in the example
      updatePayload.trailer = '';
      
      // Move trailer properties to the main object
      if (data.trailer && typeof data.trailer === 'object') {
        // Add all trailer properties to the main object
        Object.keys(data.trailer).forEach(key => {
          updatePayload[key] = data.trailer[key];
        });
      }
      
      // Set the comment with the transport incident
      updatePayload.comment = comment;
      
      // Add other required properties shown in the example
      updatePayload.assignedSiteFlag = false;
      updatePayload.maintenance = {};
      updatePayload.rental = {};
      updatePayload.seal1_intact = false;
      updatePayload.seal2_intact = false;
      updatePayload.seal2 = '';
      updatePayload.rfid = '';
      
      console.log('Sending transport incident update for UUID ' + item.uuid);
      
      // Send the update with the transformed structure
      return fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
        method: 'PUT',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(updatePayload)
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Update API responded with status ' + response.status);
      }
      return response.json();
    })
    .then(result => {
      console.log('Transport incident updated for UUID ' + item.uuid, result);
      
      // Update the item in our local data - Following the same pattern as localizador
      const itemIndex = yardData.findIndex(i => i.uuid === item.uuid);
      if (itemIndex !== -1) {
        // Update the comment in our local data structure - following the exact pattern from localizador
        if (yardData[itemIndex].trailer && yardData[itemIndex].trailer.comment) {
          if (yardData[itemIndex].trailer.comment.includes('<w>')) {
            yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment.replace(
              /<w>.*?<\/w>/, 
              '<w>' + incidentText + '</w>'
            );
          } else {
            yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment + '<w>' + incidentText + '</w>';
          }
        } 
        else if (yardData[itemIndex].comment) {
          if (yardData[itemIndex].comment.includes('<w>')) {
            yardData[itemIndex].comment = yardData[itemIndex].comment.replace(
              /<w>.*?<\/w>/, 
              '<w>' + incidentText + '</w>'
            );
          } else {
            yardData[itemIndex].comment = yardData[itemIndex].comment + '<w>' + incidentText + '</w>';
          }
        }
      }
      
      // Update the table
      updateTable();
      resolve(result);
    })
    .catch(error => {
      console.log('Error updating transport incident for UUID ' + item.uuid + ':', error.message);
      reject(error);
    });
  });
}
 
  // Add or update localizador for a trailer
  function updateLocalizador(item, localizadorText) {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
      
      if (!item || !item.uuid) {
        reject(new Error("Invalid item data"));
        return;
      }
      
      console.log('Fetching asset details for UUID ' + item.uuid + ' to update localizador');
      
      // Create request headers
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
      headers.append('Content-Type', 'application/json');
      
      // First, get the current asset data
      fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Asset details received for UUID ' + item.uuid, data);
        
        // Create a new payload with the structure needed for the PUT request
        let updatePayload = { ...data }; // Create a copy of the base data
        
        // Add the localizador information to the comment
        let comment = '';
        
        // If comment exists in trailer, use that, otherwise use the main comment if it exists
        if (data.trailer && data.trailer.comment) {
          comment = data.trailer.comment;
        } else if (data.comment) {
          comment = data.comment;
        }
        
        // Add or update the localizador in the comment
        if (comment.includes('<lo>')) {
          // Replace existing localizador
          comment = comment.replace(/<lo>.*?<\/lo>/, '<lo>' + localizadorText + '</lo>');
        } else {
          // Add new localizador
          comment = comment + '<lo>' + localizadorText + '</lo>';
        }
        
        // Set trailer to empty string as in the example
        updatePayload.trailer = '';
        
        // Move trailer properties to the main object
        if (data.trailer && typeof data.trailer === 'object') {
          // Add all trailer properties to the main object
          Object.keys(data.trailer).forEach(key => {
            updatePayload[key] = data.trailer[key];
          });
        }
        
        // Set the comment with the localizador
        updatePayload.comment = comment;
        
        // Add other required properties shown in the example
        updatePayload.assignedSiteFlag = false;
        updatePayload.maintenance = {};
        updatePayload.rental = {};
        updatePayload.seal1_intact = false;
        updatePayload.seal2_intact = false;
        updatePayload.seal2 = '';
        updatePayload.rfid = '';
        
        console.log('Sending localizador update for UUID ' + item.uuid);
        
        // Send the update with the transformed structure
        return fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
          method: 'PUT',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify(updatePayload)
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Update API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(result => {
        console.log('Localizador updated for UUID ' + item.uuid, result);
        
        // Update the item in our local data
        const itemIndex = yardData.findIndex(i => i.uuid === item.uuid);
        if (itemIndex !== -1) {
          // Update the comment in our local data structure
          if (yardData[itemIndex].trailer && yardData[itemIndex].trailer.comment) {
            if (yardData[itemIndex].trailer.comment.includes('<lo>')) {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment.replace(
                /<lo>.*?<\/lo>/, 
                '<lo>' + localizadorText + '</lo>'
              );
            } else {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment + '<lo>' + localizadorText + '</lo>';
            }
          } 
          else if (yardData[itemIndex].comment) {
            if (yardData[itemIndex].comment.includes('<lo>')) {
              yardData[itemIndex].comment = yardData[itemIndex].comment.replace(
                /<lo>.*?<\/lo>/, 
                '<lo>' + localizadorText + '</lo>'
              );
            } else {
              yardData[itemIndex].comment = yardData[itemIndex].comment + '<lo>' + localizadorText + '</lo>';
            }
          }
        }
        
        // Update the table
        updateTable();
        resolve(result);
      })
      .catch(error => {
        console.log('Error updating localizador for UUID ' + item.uuid + ':', error.message);
        reject(error);
      });
    });
  }
 
  // Add or update rejection reason for a trailer
  function updateRejectionReason(item, rejectionText) {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
      
      if (!item || !item.uuid) {
        reject(new Error("Invalid item data"));
        return;
      }
      
      console.log('Fetching asset details for UUID ' + item.uuid + ' to update rejection reason');
      
      // Create request headers
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
      headers.append('Content-Type', 'application/json');
      
      // First, get the current asset data
      fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Asset details received for UUID ' + item.uuid, data);
        
        // Create a new payload with the structure needed for the PUT request
        let updatePayload = { ...data }; // Create a copy of the base data
        
        // Add the rejection reason to the comment
        let comment = '';
        
        // If comment exists in trailer, use that, otherwise use the main comment if it exists
        if (data.trailer && data.trailer.comment) {
          comment = data.trailer.comment;
        } else if (data.comment) {
          comment = data.comment;
        }
        
        // Add or update the rejection reason in the comment
        if (comment.includes('<rr>')) {
          // Replace existing rejection reason
          comment = comment.replace(/<rr>.*?<\/rr>/, '<rr>' + rejectionText + '</rr>');
        } else {
          // Add new rejection reason
          comment = comment + '<rr>' + rejectionText + '</rr>';
        }
        
        // Set trailer to empty string as in the example
        updatePayload.trailer = '';
        
        // Move trailer properties to the main object
        if (data.trailer && typeof data.trailer === 'object') {
          // Add all trailer properties to the main object
          Object.keys(data.trailer).forEach(key => {
            updatePayload[key] = data.trailer[key];
          });
        }
        
        // Set the comment with the rejection reason
        updatePayload.comment = comment;
        
        // Add other required properties shown in the example
        updatePayload.assignedSiteFlag = false;
        updatePayload.maintenance = {};
        updatePayload.rental = {};
        updatePayload.seal1_intact = false;
        updatePayload.seal2_intact = false;
        updatePayload.seal2 = '';
        updatePayload.rfid = '';
        
        console.log('Sending rejection reason update for UUID ' + item.uuid);
        
        // Send the update with the transformed structure
        return fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
          method: 'PUT',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify(updatePayload)
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Update API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(result => {
        console.log('Rejection reason updated for UUID ' + item.uuid, result);
        
        // Update the item in our local data
        const itemIndex = yardData.findIndex(i => i.uuid === item.uuid);
        if (itemIndex !== -1) {
          // Update the comment in our local data structure
          if (yardData[itemIndex].trailer && yardData[itemIndex].trailer.comment) {
            if (yardData[itemIndex].trailer.comment.includes('<rr>')) {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment.replace(
                /<rr>.*?<\/rr>/, 
                '<rr>' + rejectionText + '</rr>'
              );
            } else {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment + '<rr>' + rejectionText + '</rr>';
            }
          } 
          else if (yardData[itemIndex].comment) {
            if (yardData[itemIndex].comment.includes('<rr>')) {
              yardData[itemIndex].comment = yardData[itemIndex].comment.replace(
                /<rr>.*?<\/rr>/, 
                '<rr>' + rejectionText + '</rr>'
              );
            } else {
              yardData[itemIndex].comment = yardData[itemIndex].comment + '<rr>' + rejectionText + '</rr>';
            }
          }
        }
        
        // Update the table
        updateTable();
        resolve(result);
      })
      .catch(error => {
        console.log('Error updating rejection reason for UUID ' + item.uuid + ':', error.message);
        reject(error);
      });
    });
  }
 
  // Create rejection reason selection modal
  function showRejectionModal(item) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 20000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      width: 500px;
      max-height: 600px;
      overflow-y: auto;
    `;
    
    const title = document.createElement('h3');
    title.textContent = 'SELECCIONAR RAZÓN DE RECHAZO';
    title.style.textAlign = 'center';
    modalContent.appendChild(title);
    
    const select = document.createElement('select');
    select.style.cssText = `
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      font-size: 14px;
    `;
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'SELECCIONAR RAZÓN...';
    select.appendChild(defaultOption);
    
    // Add rejection options
    const rejectionOptions = [
      'R1-RECHAZO ALARMA DE REVERSA',
      'R1-RECHAZO CHALECO',
      'R1-RECHAZO CORTINAS',
      'R1-RECHAZO DUELAS DAÑADAS DE CAJA',
      'R1-RECHAZO FALLA ELECTRICA',
      'R1-RECHAZO FUGA DE ACEITE',
      'R1-RECHAZO GAFETE',
      'R1-RECHAZO LLANTA POCHADA',
      'R1-RECHAZO OBJETOS EXTRAÑOS',
      'R1-RECHAZO OPERADOR VETADO',
      'R1-RECHAZO PANTALON ROTO',
      'R1-RECHAZO POR ACOMPAÑANTE',
      'R1-RECHAZO POR ARRANQUE',
      'R1-RECHAZO POR FALTA SPOT (TAREAS)',
      'R1-RECHAZO POR LLEGAR TARDE AL AREA',
      'R1-RECHAZO POR LUCES',
      'R1-RECHAZO POR PUERTAS',
      'R1-RECHAZO POR SELLOS',
      'R1-RECHAZO POR ZAPATOS DE SEGURIDAD',
      'R1-RECHAZO POSITIVO DOPING',
      'R1-RECHAZOS POR BOLSAS DE AIRE',
      'R1-RECHAZO POR ALMACEN ERRONEO',
      'R2-RECHAZO ALMACEN LLENO',
      'R2-RECHAZO PAPELERIA ERRONEA',
      'R2-RECHAZO POR AIRE (CLIMA)',
      'R2-RECHAZO POR FALLA DE RAMPAS',
      'R2-RECHAZO POR LLUVIA',
      'R2-RECHAZO POR MATERIAL DAÑADO',
      'R2-RECHAZO SAP/SYSTORE',
      'R2-RECHAZO MATERIAL COLAPSADO'
    ];
    
    rejectionOptions.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });
    
    modalContent.appendChild(select);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    `;
    
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'CONFIRMAR';
    confirmButton.style.cssText = `
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'CANCELAR';
    cancelButton.style.cssText = `
      padding: 10px 20px;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    
    confirmButton.onclick = function() {
      if (select.value) {
        updateRejectionReason(item, select.value)
          .then(() => {
            document.body.removeChild(modal);
          })
          .catch(err => {
            alert('Error actualizando razón de rechazo: ' + err.message);
          });
      } else {
        alert('Por favor selecciona una razón de rechazo');
      }
    };
    
    cancelButton.onclick = function() {
      document.body.removeChild(modal);
    };
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);
    modalContent.appendChild(buttonContainer);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }
 
  // Export table data to Excel
  function exportToExcel() {
    console.log("Exporting data to Excel");
    
    if (yardData.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
    
    try {
      // Create a workbook
      const wb = XLSX.utils.book_new();
      
      // Prepare the data
      const excelData = [];
      
      // Add headers - Updated to remove AVISO ENVIADO, GAFETE, IDENTIFICACION and update column order
      const headers = [
        'Folio', 'Entrega', 'Estado', 'Material', 'Descripción', 
        'Tipo', 'Ubicación actual', 'Linea', 'Nombre Linea', 'Nombre operador', 
        'Teléfono operador', 'Económico tracto', 'Económico trailer', 
        'Hora reportado', 'Tiempo de estancia', 'Fecha de la cita',
        'Diferencia vs. cita', 'Sección cita', 'Incidente seguridad',
        'Incidente transporte', 'Localizador', 'Incidente Almacén', 'Razón de Rechazo',
        'Hora de ingreso', 'Hora de llegada a rampa',
        'Hora de fin de carga/descarga', 'Hora de salida de rampa', 'Status',
        'Salida'
      ];
      excelData.push(headers);
      
      // Filter and sort data according to current settings
      const displayData = getFilteredAndSortedData();
      
      // Process each item with enriched data
      const enrichPromises = displayData.map(item => getEnrichedData(item));
      
      Promise.all(enrichPromises).then(enrichedItems => {
        enrichedItems.forEach(item => {
          const reference1 = item.enriched_reference_1 || '';
          const reference2 = item.enriched_reference_2 || '';
          const status = item.status === 'empty' ? 'VACÍO' : item.status === 'loaded' ? 'CARGADO' : (item.status || '').toUpperCase();
          const commodity = (item.commodity || '').toUpperCase();
          
          // Use enriched load information for materials
          const loadInfo = item.enriched_load_information || [];
          const sku = loadInfo.length > 0 ? 
                      loadInfo.map(info => info.sku.toUpperCase() + ' (' + info.qty + ')').join(', ') : '';
          
          const serviceType = (item.trailer ? item.trailer.service_type || '' : '').toUpperCase();
          const location = (item.current_location || '').toUpperCase();
          const carrier = (item.cab ? item.cab.carrier || '' : '').toUpperCase();
          const carrierName = getCarrierName(carrier).toUpperCase();
          const driverName = (item.cab ? 
                            (item.cab.first_name || '') + ' ' + (item.cab.last_name || '').trim() : '').toUpperCase();
          const driverPhone = (item.cab ? item.cab.driver_cell_no || '' : '').toUpperCase();
          const cabNo = (item.cab ? item.cab.cab_no || '' : '').toUpperCase();
          const trailerName = (item.name || '').toUpperCase();
          const arrivalTime = formatTimestamp(item.arrival_time).toUpperCase();
          const timeDifference = calculateDwellTime(item.arrival_time).split(' ')[0].toUpperCase(); // Remove emoji for Excel
          
          // Get appointment data
          const shipmentNo = item.trailer?.shipment_no || '';
          const appointmentInfo = appointmentCache[shipmentNo] || { appointmentTime: null, sectionName: '' };
          const appointmentTime = appointmentInfo.appointmentTime ? formatTimestamp(appointmentInfo.appointmentTime).toUpperCase() : '';
          const appointmentDiff = (item.arrival_time && appointmentInfo.appointmentTime) ? 
                                 calculateTimeDifference(item.arrival_time, appointmentInfo.appointmentTime).toUpperCase() : '';
          const sectionName = (appointmentInfo.sectionName || '').toUpperCase();
          
          // Get security incident
          const securityIncident = extractSecurityIncident(item)?.toUpperCase() || '';
          
          // Get transport incident 
          const transportIncident = extractTransportIncident(item)?.toUpperCase() || '';
          
          // Get localizador
          const localizador = extractLocalizador(item)?.toUpperCase() || '';
          
          // Get warehouse incident and rejection reason
          const warehouseIncident = extractWarehouseIncident(item)?.toUpperCase() || '';
          const rejectionReason = extractRejectionReason(item)?.toUpperCase() || '';
          
          // Get task times
          const ingressTime = getTaskTimeForAsset(item.uuid, 'spot', 'created_time');
          const arrivalToRampTime = getTaskTimeForAsset(item.uuid, 'spot', 'completed_time');
          const endLoadingTime = getTaskTimeForAsset(item.uuid, 'pull', 'created_time');
          const exitRampTime = getTaskTimeForAsset(item.uuid, 'pull', 'completed_time');
          
          // Get status
          const itemStatus = determineStatus(item).toUpperCase();
          
          excelData.push([
            reference1.toUpperCase(), 
            reference2.toUpperCase(), 
            status, 
            commodity, 
            sku, 
            serviceType, 
            location,
            carrier,
            carrierName, 
            driverName, 
            driverPhone, 
            cabNo, 
            trailerName, 
            arrivalTime, 
            timeDifference,
            appointmentTime, 
            appointmentDiff, 
            sectionName, 
            securityIncident,
            transportIncident,
            localizador,
            warehouseIncident,
            rejectionReason,
            ingressTime ? formatTimestamp(ingressTime).toUpperCase() : '',
            arrivalToRampTime ? formatTimestamp(arrivalToRampTime).toUpperCase() : '',
            endLoadingTime ? formatTimestamp(endLoadingTime).toUpperCase() : '',
            exitRampTime ? formatTimestamp(exitRampTime).toUpperCase() : '',
            itemStatus,
            'DAR SALIDA'
          ]);
        });
        
        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Datos de Patio");
        
        // Generate Excel file and trigger download
        const fileName = 'datos_patio_' + new Date().toISOString().split('T')[0] + '.xlsx';
        XLSX.writeFile(wb, fileName);
        
        console.log("Excel export completed", { rows: excelData.length - 1 });
      });
    } catch (error) {
      console.log("Error exporting to Excel:", error.message);
      
      // If XLSX is not loaded, try using a simpler CSV approach
      if (typeof XLSX === 'undefined') {
        exportToCSV();
      } else {
        alert("Error al exportar: " + error.message);
      }
    }
  }
  
  // Fallback CSV export - Updated to remove columns and include INCIDENTE TRANSPORTE
  function exportToCSV() {
    console.log("Fallback to CSV export");
    
    try {
      // Prepare the data
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add headers - Updated to remove AVISO ENVIADO, GAFETE, IDENTIFICACION and include INCIDENTE TRANSPORTE
      const headers = [
        'Folio', 'Entrega', 'Estado', 'Material', 'Descripción', 
        'Tipo', 'Ubicación actual', 'Linea', 'Nombre Linea', 'Nombre operador', 
        'Teléfono operador', 'Económico tracto', 'Económico trailer', 
        'Hora reportado', 'Tiempo de estancia', 'Fecha de la cita',
        'Diferencia vs. cita', 'Sección cita', 'Incidente seguridad',
        'Incidente transporte', 'Localizador', 'Incidente Almacén', 'Razón de Rechazo',
        'Hora de ingreso', 'Hora de llegada a rampa',
        'Hora de fin de carga/descarga', 'Hora de salida de rampa', 'Status',
        'Salida'
      ];
      csvContent += headers.join(",") + "\r\n";
      
      // Filter and sort data according to current settings
      const displayData = getFilteredAndSortedData();
      
      // Process each item with enriched data
      const enrichPromises = displayData.map(item => getEnrichedData(item));
      
      Promise.all(enrichPromises).then(enrichedItems => {
        enrichedItems.forEach(item => {
          const reference1 = item.enriched_reference_1 || '';
          const reference2 = item.enriched_reference_2 || '';
          const status = item.status === 'empty' ? 'VACÍO' : item.status === 'loaded' ? 'CARGADO' : (item.status || '').toUpperCase();
          const commodity = (item.commodity || '').toUpperCase();
          
          // Use enriched load information for materials  
          const loadInfo = item.enriched_load_information || [];
          const sku = loadInfo.length > 0 ? 
                      loadInfo.map(info => info.sku.toUpperCase() + ' (' + info.qty + ')').join(' - ') : '';
          
          const serviceType = (item.trailer ? item.trailer.service_type || '' : '').toUpperCase();
          const location = (item.current_location || '').toUpperCase();
          const carrier = (item.cab ? item.cab.carrier || '' : '').toUpperCase();
          const carrierName = getCarrierName(carrier).toUpperCase();
          const driverName = (item.cab ? 
                            ((item.cab.first_name || '') + ' ' + (item.cab.last_name || '')).trim() : '').toUpperCase();
          const driverPhone = (item.cab ? item.cab.driver_cell_no || '' : '').toUpperCase();
          const cabNo = (item.cab ? item.cab.cab_no || '' : '').toUpperCase();
          const trailerName = (item.name || '').toUpperCase();
          const arrivalTime = formatTimestamp(item.arrival_time).toUpperCase();
          const timeDifference = calculateDwellTime(item.arrival_time).split(' ')[0].toUpperCase(); // Remove emoji
          
          // Get appointment data
          const shipmentNo = item.trailer?.shipment_no || '';
          const appointmentInfo = appointmentCache[shipmentNo] || { appointmentTime: null, sectionName: '' };
          const appointmentTime = appointmentInfo.appointmentTime ? formatTimestamp(appointmentInfo.appointmentTime).toUpperCase() : '';
          const appointmentDiff = (item.arrival_time && appointmentInfo.appointmentTime) ? 
                                 calculateTimeDifference(item.arrival_time, appointmentInfo.appointmentTime).toUpperCase() : '';
          const sectionName = (appointmentInfo.sectionName || '').toUpperCase();
          
          // Get security incident
          const securityIncident = extractSecurityIncident(item)?.toUpperCase() || '';
          
          // Get transport incident 
          const transportIncident = extractTransportIncident(item)?.toUpperCase() || '';
          
          // Get localizador
          const localizador = extractLocalizador(item)?.toUpperCase() || '';
          
          // Get warehouse incident and rejection reason
          const warehouseIncident = extractWarehouseIncident(item)?.toUpperCase() || '';
          const rejectionReason = extractRejectionReason(item)?.toUpperCase() || '';
          
          // Get task times
          const ingressTime = getTaskTimeForAsset(item.uuid, 'spot', 'created_time');
          const arrivalToRampTime = getTaskTimeForAsset(item.uuid, 'spot', 'completed_time');
          const endLoadingTime = getTaskTimeForAsset(item.uuid, 'pull', 'created_time');
          const exitRampTime = getTaskTimeForAsset(item.uuid, 'pull', 'completed_time');
          
          // Get status
          const itemStatus = determineStatus(item).toUpperCase();
          
          const row = [
            reference1.toUpperCase(), 
            reference2.toUpperCase(), 
            status, 
            commodity, 
            sku, 
            serviceType, 
            location,
            carrier,
            carrierName, 
            driverName, 
            driverPhone, 
            cabNo, 
            trailerName, 
            arrivalTime, 
            timeDifference,
            appointmentTime, 
            appointmentDiff, 
            sectionName, 
            securityIncident,
            transportIncident,
            localizador,
            warehouseIncident,
            rejectionReason,
            ingressTime ? formatTimestamp(ingressTime).toUpperCase() : '',
            arrivalToRampTime ? formatTimestamp(arrivalToRampTime).toUpperCase() : '',
            endLoadingTime ? formatTimestamp(endLoadingTime).toUpperCase() : '',
            exitRampTime ? formatTimestamp(exitRampTime).toUpperCase() : '',
            itemStatus,
            'DAR SALIDA'
          ].map(val => '"' + String(val).replace(/"/g, '""') + '"').join(',');
          
          csvContent += row + "\r\n";
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", 'datos_patio_' + new Date().toISOString().split('T')[0] + '.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log("CSV export completed");
      });
    } catch (error) {
      console.log("Error exporting to CSV:", error.message);
      alert("Error al exportar: " + error.message);
    }
  }
 
  // Load XLSX library if not present
  function loadXLSXLibrary() {
    if (typeof XLSX !== 'undefined') {
      console.log("XLSX library already loaded");
      return Promise.resolve();
    }
    
    console.log("Loading XLSX library");
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      script.onload = () => {
        console.log("XLSX library loaded successfully");
        resolve();
      };
      script.onerror = () => {
        console.log("Failed to load XLSX library");
        reject(new Error("Failed to load Excel export library"));
      };
      document.head.appendChild(script);
    });
  }
 
 
// Modified fetchYardData function - throttle to every 10 seconds
function fetchYardData(manualFetch = false) {
  const now = Date.now();
  
  // Check if we've fetched within the last 10 seconds (unless it's a manual fetch)
  if (!manualFetch && now - lastYardDataFetch < FETCH_INTERVAL) {
    console.log("Yard data fetch throttled, using existing data");
    return;
  }
 
  if (!authorization || !cookieValue) {
    console.log("Authorization or Cookie not captured yet. Cannot fetch data.", { auth: !!authorization, cookie: !!cookieValue });
    return;
  }
  
  updateStatusBar(10, 'Iniciando carga de datos...');
  console.log("Fetching yard data...");
  lastYardDataFetch = now;
  
  // Create request headers
  const headers = new Headers();
  headers.append('Authorization', authorization);
  headers.append('Cookie', cookieValue);
  
  console.log("Request headers prepared", {
    Authorization: authorization.substring(0, 20) + '...',
    Cookie: cookieValue.substring(0, 20) + '...'
  });
  
  // Fetch yard data
  const yardDataPromise = fetch('https://yard-visibility-na12.api.project44.com/v1/asset/search?page_no=1&size=100&assetClass=trailer&in_yard=true&site=nava&loadType=live', {
    method: 'GET',
    headers: headers,
    credentials: 'include'
  })
  .then(response => {
    updateStatusBar(30, 'Datos del patio obtenidos...');
    console.log('Response status: ' + response.status);
    if (!response.ok) {
      throw new Error('API responded with status ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("Data fetched successfully", { items: data.data?.length || 0 });
    
    // Check if data has the expected format
    if (!data.data) {
      console.log("API response missing data property", data);
      throw new Error("API response missing data property");
    }
    
    yardData = data.data || [];
    return yardData;
  });
  
  // Fetch task data (will be throttled internally)
  const taskDataPromise = fetchTaskData().then(() => {
    updateStatusBar(50, 'Datos de tareas obtenidos...');
  });
  
  // Fetch carrier data (will use cache if available)
  const carrierDataPromise = fetchCarrierData().then(() => {
    updateStatusBar(70, 'Datos de transportistas obtenidos...');
  });
 
  // Fetch product types (will use cache if available)
  const productTypesPromise = fetchProductTypes().then(() => {
    updateStatusBar(75, 'Tipos de producto obtenidos...');
  });
  
  // Wait for all promises to complete
  Promise.all([yardDataPromise, taskDataPromise, carrierDataPromise, productTypesPromise])
    .then(([yardResult]) => {
      updateStatusBar(80, 'Obteniendo datos de citas...');
      console.log("All data fetched, yard data: " + yardData.length + ", task data: " + taskData.length + ", carrier data: " + carrierData.length + ", product types: " + productTypeCache.length);
      
      // For each item, fetch appointment data if we have a shipment number
      const appointmentPromises = [];
      
      yardData.forEach(item => {
        const shipmentNo = item.trailer?.shipment_no;
        if (shipmentNo && !appointmentCache[shipmentNo]) {
          appointmentPromises.push(
            fetchAppointmentData(shipmentNo)
              .catch(err => {
                console.log('Error fetching appointment for ' + shipmentNo + ':', err.message);
                return { appointmentTime: null, sectionName: '' };
              })
          );
        }
      });
      
      // Wait for all appointment data to be fetched
      if (appointmentPromises.length > 0) {
        console.log('Fetching ' + appointmentPromises.length + ' appointment records...');
        
        Promise.allSettled(appointmentPromises)
          .then(() => {
            updateStatusBar(100, 'Datos cargados completamente');
            console.log("All appointment data fetched");
            updateTable();
          });
      } else {
        updateStatusBar(100, 'Datos cargados completamente');
        updateTable();
      }
    })
    .catch(error => {
      updateStatusBar(100, 'Error en la carga');
      console.log("Error in data fetching: ", error.message);
      console.error("Error in data fetching: ", error);
      
      // If yard data exists but other data fails, still update the table
      if (yardData.length > 0) {
        updateTable();
      }
    });
}
 
 
 
 
 
  // Sort data based on current sort configuration
  function sortData(data) {
    if (!sortConfig.column) return data;
    
    return [...data].sort((a, b) => {
      let aValue, bValue;
      
      // Extract values based on column (updated for new column count after removing 3 columns)
      switch(sortConfig.column) {
        case 0: // Folio - Use enriched data when available
          aValue = a.enriched_reference_1 || a.trailer?.shipment_details?.reference_1 || '';
          bValue = b.enriched_reference_1 || b.trailer?.shipment_details?.reference_1 || '';
          break;
        case 1: // Entrega - Use enriched data when available
          aValue = a.enriched_reference_2 || a.trailer?.shipment_details?.reference_2 || '';
          bValue = b.enriched_reference_2 || b.trailer?.shipment_details?.reference_2 || '';
          break;
        case 2: // Estado
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 3: // Material - Use enriched data when available
          const aLoadInfo = a.enriched_load_information || a.trailer?.load_information || [];
          const bLoadInfo = b.enriched_load_information || b.trailer?.load_information || [];
          aValue = aLoadInfo.length > 0 ? aLoadInfo.map(info => info.sku).join(', ') : '';
          bValue = bLoadInfo.length > 0 ? bLoadInfo.map(info => info.sku).join(', ') : '';
          break;
        case 4: // Descripción - Same as Material for sorting
          const aLoadInfo2 = a.enriched_load_information || a.trailer?.load_information || [];
          const bLoadInfo2 = b.enriched_load_information || b.trailer?.load_information || [];
          aValue = aLoadInfo2.length > 0 ? aLoadInfo2.map(info => info.sku).join(', ') : '';
          bValue = bLoadInfo2.length > 0 ? bLoadInfo2.map(info => info.sku).join(', ') : '';
          break;
        case 5: // Tipo
          aValue = a.trailer?.service_type || '';
          bValue = b.trailer?.service_type || '';
          break;
        case 6: // Ubicación actual
          aValue = a.current_location || '';
          bValue = b.current_location || '';
          break;
        case 7: // Linea
          aValue = a.cab?.carrier || '';
          bValue = b.cab?.carrier || '';
          break;
        case 8: // Nombre Linea
          aValue = getCarrierName(a.cab?.carrier || '');
          bValue = getCarrierName(b.cab?.carrier || '');
          break;
        case 9: // Nombre operador
          aValue = ((a.cab?.first_name || '') + ' ' + (a.cab?.last_name || '')).trim();
          bValue = ((b.cab?.first_name || '') + ' ' + (b.cab?.last_name || '')).trim();
          break;
        case 10: // Teléfono operador
          aValue = a.cab?.driver_cell_no || '';
          bValue = b.cab?.driver_cell_no || '';
          break;
        case 11: // Económico tracto
          aValue = a.cab?.cab_no || '';
          bValue = b.cab?.cab_no || '';
          break;
        case 12: // Económico trailer
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 13: // Hora reportado
          aValue = a.arrival_time || 0;
          bValue = b.arrival_time || 0;
          break;
        case 14: // Tiempo de estancia
          aValue = a.arrival_time || 0;
          bValue = b.arrival_time || 0;
          break;
        case 15: // Fecha de la cita
          const shipmentNoA = a.trailer?.shipment_no || '';
          const shipmentNoB = b.trailer?.shipment_no || '';
          aValue = appointmentCache[shipmentNoA]?.appointmentTime || 0;
          bValue = appointmentCache[shipmentNoB]?.appointmentTime || 0;
          break;
        case 16: // Diferencia vs. cita
          // Sort by absolute difference value
          const shipmentNo1 = a.trailer?.shipment_no || '';
          const shipmentNo2 = b.trailer?.shipment_no || '';
          const apptTimeA = appointmentCache[shipmentNo1]?.appointmentTime || 0;
          const apptTimeB = appointmentCache[shipmentNo2]?.appointmentTime || 0;
          aValue = apptTimeA && a.arrival_time ? Math.abs(apptTimeA - a.arrival_time) : Number.MAX_SAFE_INTEGER;
          bValue = apptTimeB && b.arrival_time ? Math.abs(apptTimeB - b.arrival_time) : Number.MAX_SAFE_INTEGER;
          break;
        case 17: // Sección cita
          const shipmentNoSectionA = a.trailer?.shipment_no || '';
          const shipmentNoSectionB = b.trailer?.shipment_no || '';
          aValue = appointmentCache[shipmentNoSectionA]?.sectionName || '';
          bValue = appointmentCache[shipmentNoSectionB]?.sectionName || '';
          break;
        case 18: // Incidente seguridad
          aValue = extractSecurityIncident(a) || '';
          bValue = extractSecurityIncident(b) || '';
          break;
        case 19: // Incidente transporte
          aValue = extractTransportIncident(a) || '';
          bValue = extractTransportIncident(b) || '';
          break;
        case 20: // Localizador
          aValue = extractLocalizador(a) || '';
          bValue = extractLocalizador(b) || '';
          break;
        case 21: // Incidente Almacén
          aValue = extractWarehouseIncident(a) || '';
          bValue = extractWarehouseIncident(b) || '';
          break;
        case 22: // Razón de Rechazo
          aValue = extractRejectionReason(a) || '';
          bValue = extractRejectionReason(b) || '';
          break;
        case 23: // Hora de ingreso
          aValue = getTaskTimeForAsset(a.uuid, 'spot', 'created_time') || 0;
          bValue = getTaskTimeForAsset(b.uuid, 'spot', 'created_time') || 0;
          break;
        case 24: // Hora de llegada a rampa
          aValue = getTaskTimeForAsset(a.uuid, 'spot', 'completed_time') || 0;
          bValue = getTaskTimeForAsset(b.uuid, 'spot', 'completed_time') || 0;
          break;
        case 25: // Hora de fin de carga/descarga
          aValue = getTaskTimeForAsset(a.uuid, 'pull', 'created_time') || 0;
          bValue = getTaskTimeForAsset(b.uuid, 'pull', 'created_time') || 0;
          break;
        case 26: // Hora de salida de rampa
          aValue = getTaskTimeForAsset(a.uuid, 'pull', 'completed_time') || 0;
          bValue = getTaskTimeForAsset(b.uuid, 'pull', 'completed_time') || 0;
          break;
        case 27: // Status
          aValue = determineStatus(a);
          bValue = determineStatus(b);
          break;
        case 28: // Salida
          aValue = 'DAR SALIDA';
          bValue = 'DAR SALIDA';
          break;
        default:
          return 0;
      }
      
      // Numeric comparison for numbers
      if (!isNaN(aValue) && !isNaN(bValue)) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      // Perform the comparison
      const result = 
        aValue > bValue ? 1 :
        aValue < bValue ? -1 : 0;
        
      // Reverse if direction is descending
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }
 
  // Filter data based on current filter values - Updated to use enriched data and new column order
  function filterData(data) {
    return data.filter(item => {
      for (const columnIndex in filters) {
        if (!filters[columnIndex] || filters[columnIndex] === '') continue;
        
        const filterText = filters[columnIndex].toLowerCase();
        let itemValue = '';
        
        // Extract values based on column (updated for new column count and enriched data)
        switch(parseInt(columnIndex)) {
          case 0: // Folio - Use enriched data when available
            itemValue = item.enriched_reference_1 || item.trailer?.shipment_details?.reference_1 || '';
            break;
          case 1: // Entrega - Use enriched data when available
            itemValue = item.enriched_reference_2 || item.trailer?.shipment_details?.reference_2 || '';
            break;
          case 2: // Estado
            itemValue = item.status === 'empty' ? 'vacío' : item.status === 'loaded' ? 'cargado' : item.status || '';
            break;
          case 3: // Material - Use enriched data when available
            const loadInfo = item.enriched_load_information || item.trailer?.load_information || [];
            itemValue = loadInfo.length > 0 ? loadInfo.map(info => info.sku).join(', ') : '';
            break;
          case 4: // Descripción - Same as Material
            const loadInfo2 = item.enriched_load_information || item.trailer?.load_information || [];
            itemValue = loadInfo2.length > 0 ? loadInfo2.map(info => info.sku + ' (' + info.qty + ')').join(', ') : '';
            break;
          case 5: // Tipo
            itemValue = item.trailer?.service_type || '';
            break;
          case 6: // Ubicación actual
            itemValue = item.current_location || '';
            break;
          case 7: // Linea
            itemValue = item.cab?.carrier || '';
            break;
          case 8: // Nombre Linea
            itemValue = getCarrierName(item.cab?.carrier || '');
            break;
          case 9: // Nombre operador
            itemValue = ((item.cab?.first_name || '') + ' ' + (item.cab?.last_name || '')).trim();
            break;
          case 10: // Teléfono operador
            itemValue = item.cab?.driver_cell_no || '';
            break;
          case 11: // Económico tracto
            itemValue = item.cab?.cab_no || '';
            break;
          case 12: // Económico trailer
            itemValue = item.name || '';
            break;
          case 13: // Hora reportado
            itemValue = formatTimestamp(item.arrival_time);
            break;
          case 14: // Tiempo de estancia
            itemValue = calculateDwellTime(item.arrival_time).split(' ')[0]; // Remove emoji
            break;
          case 15: // Fecha de la cita
            const shipmentNo = item.trailer?.shipment_no || '';
            const apptTime = appointmentCache[shipmentNo]?.appointmentTime;
            itemValue = apptTime ? formatTimestamp(apptTime) : '';
            break;
          case 16: // Diferencia vs. cita
            const shipmentNoDiff = item.trailer?.shipment_no || '';
            const apptTimeDiff = appointmentCache[shipmentNoDiff]?.appointmentTime;
            itemValue = (apptTimeDiff && item.arrival_time) ? 
                       calculateTimeDifference(item.arrival_time, apptTimeDiff) : '';
            break;
          case 17: // Sección cita
            const shipmentNoSection = item.trailer?.shipment_no || '';
            itemValue = appointmentCache[shipmentNoSection]?.sectionName || '';
            break;
          case 18: // Incidente seguridad
            itemValue = extractSecurityIncident(item) || '';
            break;
          case 19: // Incidente transporte
            itemValue = extractTransportIncident(item) || '';
            break;
          case 20: // Localizador
            itemValue = extractLocalizador(item) || '';
            break;
          case 21: // Incidente Almacén
            itemValue = extractWarehouseIncident(item) || '';
            break;
          case 22: // Razón de Rechazo
            itemValue = extractRejectionReason(item) || '';
            break;
          case 23: // Hora de ingreso
            const ingressTime = getTaskTimeForAsset(item.uuid, 'spot', 'created_time');
            itemValue = ingressTime ? formatTimestamp(ingressTime) : '';
            break;
          case 24: // Hora de llegada a rampa
            const arrivalTime = getTaskTimeForAsset(item.uuid, 'spot', 'completed_time');
            itemValue = arrivalTime ? formatTimestamp(arrivalTime) : '';
            break;
          case 25: // Hora de fin de carga/descarga
            const endLoadingTime = getTaskTimeForAsset(item.uuid, 'pull', 'created_time');
            itemValue = endLoadingTime ? formatTimestamp(endLoadingTime) : '';
            break;
          case 26: // Hora de salida de rampa
            const exitTime = getTaskTimeForAsset(item.uuid, 'pull', 'completed_time');
            itemValue = exitTime ? formatTimestamp(exitTime) : '';
            break;
          case 27: // Status
            itemValue = determineStatus(item);
            break;
          case 28: // Salida
            itemValue = 'dar salida';
            break;
          default:
            itemValue = '';
        }
        
        if (!itemValue.toLowerCase().includes(filterText)) {
          return false;
        }
      }
      
      return true;
    });
  }
 
  // Get data that is both filtered and sorted
  function getFilteredAndSortedData() {
    const filtered = filterData(yardData);
    return sortData(filtered);
  }
 
  // Create button at the top of the page
  function createButton() {
    const button = document.createElement('button');
    button.id = 'console-button';
    button.textContent = 'Consola de Puerta';
    button.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      padding: 10px 15px;
      background-color: #4185f4;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    button.onclick = showConsole;
    document.body.appendChild(button);
    
    console.log('Button created and added to page');
  }
 
  // Update the table with fetched yard data - Updated to use enriched data and remove columns
  function updateTable() {
    if (!modalCreated) {
      console.log("Modal not created yet, skipping table update");
      return;
    }
    
    const tableBody = document.getElementById('yard-table-body');
    if (!tableBody) {
      console.log("Table body element not found");
      return;
    }
    
    console.log('Updating table with ' + yardData.length + ' rows');
    tableBody.innerHTML = '';
    
    if (yardData.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="29" style="text-align: center; padding: 20px;">NO HAY DATOS DISPONIBLES</td>';
      tableBody.appendChild(emptyRow);
      return;
    }
    
    // Get filtered and sorted data
    const displayData = getFilteredAndSortedData();
    
    if (displayData.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="29" style="text-align: center; padding: 20px;">NO HAY RESULTADOS PARA LOS FILTROS ACTUALES</td>';
      tableBody.appendChild(emptyRow);
      return;
    }
    
    // Process each item with enriched data
    const enrichPromises = displayData.map(item => getEnrichedData(item));
    
    Promise.all(enrichPromises).then(enrichedItems => {
      enrichedItems.forEach((item, index) => {
        try {
          const row = document.createElement('tr');
          
          // Determine status and set row color based on it
          const itemStatus = determineStatus(item);
          const isCritical = (item.trailer && item.trailer.comment && item.trailer.comment.includes('<critico>')) ||
                             (item.comment && item.comment.includes('<critico>'));
          
          if (isCritical) {
            // Apply vibrant red background and yellow text for critical items
            row.style.backgroundColor = '#ff0000'; // Vibrant red
            row.style.color = '#ffff00'; // Yellow text
            row.style.fontWeight = 'bold';
          } else {
            // Set row color based on status
            row.style.backgroundColor = getRowColorByStatus(itemStatus);
            
            // Alternate row colors slightly for better readability
            if (index % 2 === 1) {
              // Make the background slightly darker
              const currentBg = row.style.backgroundColor || '#ffffff';
              const darkerBg = adjustBrightness(currentBg, -10);
              row.style.backgroundColor = darkerBg;
            }
          }
          
          // Get nested values with safe access - Use enriched data
          const reference1 = (item.enriched_reference_1 || '').toUpperCase();
          const reference2 = (item.enriched_reference_2 || '').toUpperCase();
          const statusText = (item.status === 'empty' ? 'Vacío' : item.status === 'loaded' ? 'Cargado' : item.status || '').toUpperCase();
          const commodity = (item.commodity || '').toUpperCase();
          
          // Use enriched load information for SKU display
          const loadInfo = item.enriched_load_information || [];
          const sku = loadInfo.length > 0 ? 
                      loadInfo.map(info => info.sku.toUpperCase() + ' (' + info.qty + ')').join(', ') : '';
          
          const serviceTypeText = (item.trailer ? item.trailer.service_type || '' : '').toUpperCase();
          const location = (item.current_location || '').toUpperCase();
          const carrier = (item.cab ? item.cab.carrier || '' : '').toUpperCase();
          const carrierName = getCarrierName(carrier).toUpperCase();
          const driverName = (item.cab ? 
                            (item.cab.first_name || '') + ' ' + (item.cab.last_name || '').trim() : '').toUpperCase();
          const driverPhone = (item.cab ? item.cab.driver_cell_no || '' : '').toUpperCase();
          const cabNo = (item.cab ? item.cab.cab_no || '' : '').toUpperCase();
          const trailerName = (item.name || '').toUpperCase();
          const arrivalTime = formatTimestamp(item.arrival_time).toUpperCase();
          const timeDifference = calculateDwellTime(item.arrival_time).toUpperCase();
          
          // Appointment data
          const appointmentInfo = appointmentCache[item.trailer?.shipment_no || ''] || { appointmentTime: null, sectionName: '' };
          const appointmentTime = appointmentInfo.appointmentTime ? formatTimestamp(appointmentInfo.appointmentTime).toUpperCase() : '';
          const appointmentDiff = (item.arrival_time && appointmentInfo.appointmentTime) ? 
                                 calculateTimeDifference(item.arrival_time, appointmentInfo.appointmentTime).toUpperCase() : '';
          const sectionName = (appointmentInfo.sectionName || '').toUpperCase();
          
          // Security incident data
          const securityIncident = extractSecurityIncident(item);
          
          // Transport incident data
          const transportIncident = extractTransportIncident(item);
 
          // Localizador data
          const localizador = extractLocalizador(item);
          
          // Warehouse incident data
          const warehouseIncident = extractWarehouseIncident(item);
          
          // Rejection reason data
          const rejectionReason = extractRejectionReason(item);
          
          // Task data
          const ingressTime = getTaskTimeForAsset(item.uuid, 'spot', 'created_time');
          const arrivalToRampTime = getTaskTimeForAsset(item.uuid, 'spot', 'completed_time');
          const endLoadingTime = getTaskTimeForAsset(item.uuid, 'pull', 'created_time');
          const exitRampTime = getTaskTimeForAsset(item.uuid, 'pull', 'completed_time');
          
          // Common cell style with borders
          const cellStyle = `
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            padding: 8px;
            vertical-align: middle;
          `;
          
          // Create cells (existing cells remain the same)
          const tdReference1 = document.createElement('td');
          tdReference1.textContent = reference1;
          tdReference1.style.cssText = cellStyle;
          
          const tdReference2 = document.createElement('td');
          tdReference2.textContent = reference2;
          tdReference2.style.cssText = cellStyle;
          
          const tdStatus = document.createElement('td');
          tdStatus.textContent = statusText;
          tdStatus.style.cssText = cellStyle;
          
          const tdCommodity = document.createElement('td');
          tdCommodity.textContent = commodity;
          tdCommodity.style.cssText = cellStyle;
          
          const tdSku = document.createElement('td');
          tdSku.textContent = sku;
          tdSku.style.cssText = cellStyle;
          
          const tdServiceType = document.createElement('td');
          tdServiceType.textContent = serviceTypeText;
          tdServiceType.style.cssText = cellStyle;
          
          const tdLocation = document.createElement('td');
          tdLocation.textContent = location;
          tdLocation.style.cssText = cellStyle;
          
          const tdCarrier = document.createElement('td');
          tdCarrier.textContent = carrier;
          tdCarrier.style.cssText = cellStyle;
          
          const tdCarrierName = document.createElement('td');
          tdCarrierName.textContent = carrierName;
          tdCarrierName.style.cssText = cellStyle;
          
          const tdDriverName = document.createElement('td');
          tdDriverName.textContent = driverName;
          tdDriverName.style.cssText = cellStyle;
          
          const tdDriverPhone = document.createElement('td');
          tdDriverPhone.textContent = driverPhone;
          tdDriverPhone.style.cssText = cellStyle;
          
          const tdCabNo = document.createElement('td');
          tdCabNo.textContent = cabNo;
          tdCabNo.style.cssText = cellStyle;
          
          const tdTrailerName = document.createElement('td');
          tdTrailerName.textContent = trailerName;
          tdTrailerName.style.cssText = cellStyle;
          
          const tdArrivalTime = document.createElement('td');
          tdArrivalTime.textContent = arrivalTime;
          tdArrivalTime.style.cssText = cellStyle;
          
          const tdTimeDifference = document.createElement('td');
          tdTimeDifference.className = 'time-diff';
          tdTimeDifference.innerHTML = timeDifference;
          tdTimeDifference.style.cssText = cellStyle;
          
          // Appointment columns
          const tdAppointmentTime = document.createElement('td');
          tdAppointmentTime.textContent = appointmentTime;
          tdAppointmentTime.style.cssText = cellStyle;
          
          const tdAppointmentDiff = document.createElement('td');
          tdAppointmentDiff.textContent = appointmentDiff;
          tdAppointmentDiff.style.cssText = cellStyle;
          
          const tdSectionName = document.createElement('td');
          tdSectionName.textContent = sectionName;
          tdSectionName.style.cssText = cellStyle;
          
          // Security incident column (view only - removed edit button)
          const tdSecurityIncident = document.createElement('td');
          tdSecurityIncident.textContent = securityIncident ? securityIncident.toUpperCase() : '';
          tdSecurityIncident.style.cssText = cellStyle;
 
          // Transport incident column - Now working properly with fixed updateTransportIncident function
          const tdTransportIncident = document.createElement('td');
          tdTransportIncident.style.cssText = cellStyle;
          if (transportIncident) {
            tdTransportIncident.textContent = transportIncident.toUpperCase();
            
            // Add edit button
            const editButton = document.createElement('button');
            editButton.textContent = '✏️';
            editButton.style.cssText = `
              margin-left: 5px;
              padding: 2px 5px;
              background-color: #2196F3;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 10px;
            `;
            editButton.onclick = function() {
              const newIncident = prompt("Actualizar incidente de transporte:", transportIncident);
              if (newIncident !== null) {
                updateTransportIncident(item, newIncident)
                  .catch(err => {
                    alert('Error actualizando incidente: ' + err.message);
                  });
              }
            };
            tdTransportIncident.appendChild(editButton);
          } else {
            const addButton = document.createElement('button');
            addButton.textContent = 'AÑADIR';
            addButton.className = 'transport-button';
            addButton.style.cssText = `
              padding: 4px 8px;
              background-color: #FF9800;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            `;
            addButton.onclick = function() {
              const incidentText = prompt("Ingrese el comentario de incidente de transporte:");
              if (incidentText) {
                updateTransportIncident(item, incidentText)
                  .catch(err => {
                    alert('Error añadiendo incidente: ' + err.message);
                  });
              }
            };
            tdTransportIncident.appendChild(addButton);
          }
 
          // Localizador column
          const tdLocalizador = document.createElement('td');
          tdLocalizador.style.cssText = cellStyle;
          if (localizador) {
            tdLocalizador.textContent = localizador.toUpperCase();
            
            // Add edit button
            const editButton = document.createElement('button');
            editButton.textContent = '✏️';
            editButton.style.cssText = `
              margin-left: 5px;
              padding: 2px 5px;
              background-color: #2196F3;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 10px;
            `;
            editButton.onclick = function() {
              const newLocalizador = prompt("Actualizar localizador:", localizador);
              if (newLocalizador !== null) {
                updateLocalizador(item, newLocalizador)
                  .catch(err => {
                    alert('Error actualizando localizador: ' + err.message);
                  });
              }
            };
            tdLocalizador.appendChild(editButton);
          } else {
            const addButton = document.createElement('button');
            addButton.textContent = 'AÑADIR';
            addButton.className = 'localizador-button';
            addButton.style.cssText = `
              padding: 4px 8px;
              background-color: #FF5722;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            `;
            addButton.onclick = function() {
              const localizadorText = prompt("Ingrese el localizador:");
              if (localizadorText) {
                updateLocalizador(item, localizadorText)
                  .catch(err => {
                    alert('Error añadiendo localizador: ' + err.message);
                  });
              }
            };
            tdLocalizador.appendChild(addButton);
          }
          
          // Warehouse incident column (view only)
          const tdWarehouseIncident = document.createElement('td');
          tdWarehouseIncident.textContent = warehouseIncident ? warehouseIncident.toUpperCase() : '';
          tdWarehouseIncident.style.cssText = cellStyle;
          
          // Rejection reason column
          const tdRejectionReason = document.createElement('td');
          tdRejectionReason.style.cssText = cellStyle;
          if (rejectionReason) {
            tdRejectionReason.textContent = rejectionReason.toUpperCase();
            
            // Add edit button
            const editButton = document.createElement('button');
            editButton.textContent = '✏️';
            editButton.style.cssText = `
              margin-left: 5px;
              padding: 2px 5px;
              background-color: #2196F3;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 10px;
            `;
            editButton.onclick = function() {
              showRejectionModal(item);
            };
            tdRejectionReason.appendChild(editButton);
          } else {
            const rejectButton = document.createElement('button');
            rejectButton.textContent = 'RECHAZAR';
            rejectButton.className = 'reject-button';
            rejectButton.style.cssText = `
              padding: 4px 8px;
              background-color: #f44336;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            `;
            rejectButton.onclick = function() {
              showRejectionModal(item);
            };
            tdRejectionReason.appendChild(rejectButton);
          }
          
          // Task data columns
          const tdIngressTime = document.createElement('td');
          tdIngressTime.textContent = ingressTime ? formatTimestamp(ingressTime).toUpperCase() : '';
          tdIngressTime.style.cssText = cellStyle;
          
          const tdArrivalToRampTime = document.createElement('td');
          tdArrivalToRampTime.textContent = arrivalToRampTime ? formatTimestamp(arrivalToRampTime).toUpperCase() : '';
          tdArrivalToRampTime.style.cssText = cellStyle;
          
          const tdEndLoadingTime = document.createElement('td');
          tdEndLoadingTime.textContent = endLoadingTime ? formatTimestamp(endLoadingTime).toUpperCase() : '';
          tdEndLoadingTime.style.cssText = cellStyle;
          
          const tdExitRampTime = document.createElement('td');
          tdExitRampTime.textContent = exitRampTime ? formatTimestamp(exitRampTime).toUpperCase() : '';
          tdExitRampTime.style.cssText = cellStyle;
          
          // Status column
          const tdItemStatus = document.createElement('td');
          tdItemStatus.textContent = itemStatus.toUpperCase();
          tdItemStatus.style.cssText = cellStyle + 'font-weight: bold;';
  
          // SALIDA COLUMN
          const tdSalida = document.createElement('td');
          tdSalida.style.cssText = cellStyle;
          
          const salidaButton = document.createElement('button');
          salidaButton.textContent = 'DAR SALIDA';
          salidaButton.className = 'salida-button';
          salidaButton.style.cssText = `
            padding: 6px 12px;
            background-color: #FF9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
          `;
          salidaButton.onclick = function() {
            showDepartureWindow(item);
          };
          tdSalida.appendChild(salidaButton);
          
          // Append all cells to the row (updated to remove AVISO ENVIADO, GAFETE, IDENTIFICACION)
          row.appendChild(tdReference1);
          row.appendChild(tdReference2);
          row.appendChild(tdStatus);
          row.appendChild(tdCommodity);
          row.appendChild(tdSku);
          row.appendChild(tdServiceType);
          row.appendChild(tdLocation);
          row.appendChild(tdCarrier);
          row.appendChild(tdCarrierName);
          row.appendChild(tdDriverName);
          row.appendChild(tdDriverPhone);
          row.appendChild(tdCabNo);
          row.appendChild(tdTrailerName);
          row.appendChild(tdArrivalTime);
          row.appendChild(tdTimeDifference);
          row.appendChild(tdAppointmentTime);
          row.appendChild(tdAppointmentDiff);
          row.appendChild(tdSectionName);
          row.appendChild(tdSecurityIncident);
          row.appendChild(tdTransportIncident); // Fixed INCIDENTE TRANSPORTE column
          row.appendChild(tdLocalizador); 
          row.appendChild(tdWarehouseIncident);
          row.appendChild(tdRejectionReason);
          row.appendChild(tdIngressTime);
          row.appendChild(tdArrivalToRampTime);
          row.appendChild(tdEndLoadingTime);
          row.appendChild(tdExitRampTime);
          row.appendChild(tdItemStatus);
          row.appendChild(tdSalida);
          
          tableBody.appendChild(row);
        } catch (err) {
          console.log('Error processing row ' + index + ':', err.message);
        }
      });
      
      // Update filter count display
      const statusMsg = document.getElementById('yard-status-message');
      if (statusMsg) {
        const statusSpan = statusMsg.querySelector('span');
        if (statusSpan) {
          if (enrichedItems.length < yardData.length) {
            statusSpan.textContent = 'MOSTRANDO ' + enrichedItems.length + ' DE ' + yardData.length + ' REGISTROS (FILTRADOS)';
          } else {
            statusSpan.textContent = 'MOSTRANDO ' + yardData.length + ' REGISTROS';
          }
        }
      }
      
      console.log("Table updated successfully");
    }).catch(error => {
      console.log("Error updating table with enriched data:", error.message);
    });
  }
 
  // Adjust color brightness (for row highlighting)
  function adjustBrightness(color, percent) {
    if (!color || color === 'transparent') return '#f5f5f5';
    
    // Handle hex colors
    if (color.indexOf('#') === 0) {
      let R = parseInt(color.substring(1,3), 16);
      let G = parseInt(color.substring(3,5), 16);
      let B = parseInt(color.substring(5,7), 16);
 
      R = parseInt(R * (100 + percent) / 100);
      G = parseInt(G * (100 + percent) / 100);
      B = parseInt(B * (100 + percent) / 100);
 
      R = (R < 255) ? R : 255;  
      G = (G < 255) ? G : 255;  
      B = (B < 255) ? B : 255;  
 
      const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
      const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
      const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));
 
      return "#"+RR+GG+BB;
    }
    
    // Handle rgb colors
    if (color.indexOf('rgb') === 0) {
      const rgb = color.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        let R = parseInt(rgb[0]);
        let G = parseInt(rgb[1]);
        let B = parseInt(rgb[2]);
        
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
 
        R = (R < 255) ? R : 255;  
        G = (G < 255) ? G : 255;  
        B = (B < 255) ? B : 255;  
        
        return 'rgb(' + R + ',' + G + ',' + B + ')';
      }
    }
    
    return color;
  }
 
  // Update only the time difference cells to avoid full table rerender
  function updateTimeDiffCells() {
    const timeDiffCells = document.querySelectorAll('.time-diff');
    
    // Get filtered and sorted data
    const displayData = getFilteredAndSortedData();
    
    displayData.forEach((item, index) => {
      if (index < timeDiffCells.length && item.arrival_time) {
        timeDiffCells[index].innerHTML = calculateDwellTime(item.arrival_time).toUpperCase();
      }
    });
  }
 
  // Create column header with sort capabilities
  function createSortableHeader(text, columnIndex) {
    const th = document.createElement('th');
    th.style.cssText = `
      position: relative;
      cursor: pointer;
      padding-right: 20px;
      background-color: #4185f4;
      border-left: 1px solid #2a70f0;
      border-right: 1px solid #2a70f0;
      color: white;
    `;
    
    // Header text content
    const headerText = document.createElement('span');
    headerText.textContent = text.toUpperCase();
    th.appendChild(headerText);
    
    // Sort indicator
    const sortIndicator = document.createElement('span');
    sortIndicator.style.cssText = `
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
    `;
    
    // Update sort indicator based on current sort config
    if (sortConfig.column === columnIndex) {
      sortIndicator.textContent = sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    th.appendChild(sortIndicator);
    
    // Filter input
    const filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.placeholder = 'FILTRAR...';
    filterInput.style.cssText = `
      display: block;
      width: calc(100% - 10px);
      margin-top: 4px;
      padding: 4px;
      box-sizing: border-box;
      font-size: 12px;
      color: #333;
      text-transform: uppercase;
    `;
    
    // Set initial filter value
    if (filters[columnIndex]) {
      filterInput.value = filters[columnIndex];
    }
    
    // Add input event listener
    filterInput.addEventListener('input', function() {
      filters[columnIndex] = this.value;
      updateTable();
    });
    
    th.appendChild(filterInput);
    
    // Add click event for sorting
    th.addEventListener('click', function(e) {
      // Don't trigger sort when clicking on the filter input
      if (e.target === filterInput) return;
      
      // Toggle sort direction or set new column
      if (sortConfig.column === columnIndex) {
        sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
      } else {
        sortConfig.column = columnIndex;
        sortConfig.direction = 'asc';
      }
      
      // Update all sort indicators
      document.querySelectorAll('th span:last-child').forEach((indicator, idx) => {
        if (idx !== columnIndex) {
          indicator.textContent = '';
        } else {
          indicator.textContent = sortConfig.direction === 'asc' ? '↑' : '↓';
        }
      });
      
      updateTable();
    });
    
    return th;
  }
 
  // Create and show the console modal
  function showConsole() {
    console.log("Showing console modal");
    
    if (modalCreated) {
      document.getElementById('yard-console-modal').style.display = 'block';
      // Ensure status bar stays visible
      showStatusBar();
      return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'yard-console-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: white;
      z-index: 10001;
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      overflow: auto;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    `;
    
    const title = document.createElement('h1');
    title.textContent = 'ESTADO DE PATIO';
    title.style.margin = '0';
    
    const controlsDiv = document.createElement('div');
    
    // Add refresh button
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'REFRESCAR';
    refreshBtn.style.cssText = `
      margin-right: 10px;
      padding: 5px 15px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    refreshBtn.onclick = () => {
      console.log("Manual refresh triggered from console");
      fetchYardData(true);
    };
    
    // Add export button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'EXPORTAR A EXCEL';
    exportBtn.style.cssText = `
      margin-right: 10px;
      padding: 5px 15px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    exportBtn.onclick = () => {
      // Load XLSX library before exporting
      loadXLSXLibrary()
        .then(() => exportToExcel())
        .catch(() => exportToCSV()); // Fallback to CSV export
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #333;
    `;
    closeBtn.onclick = () => {
      modal.style.display = 'none';
      hideStatusBar();
    };
    
    controlsDiv.appendChild(exportBtn);
    controlsDiv.appendChild(refreshBtn);
    controlsDiv.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(controlsDiv);
    
    const tableContainer = document.createElement('div');
    tableContainer.style.cssText = `
      overflow-x: auto;
      flex-grow: 1;
    `;
    
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      border: 2px solid #2a70f0;
      text-transform: uppercase;
    `;
    
    const thead = document.createElement('thead');
    thead.style.cssText = `
      background-color: #4185f4;
      color: white;
      position: sticky;
      top: 0;
      text-transform: uppercase;
    `;
    
    // Create header row with sortable and filterable headers - Updated to remove AVISO ENVIADO, GAFETE, IDENTIFICACION
    const headerRow = document.createElement('tr');
    
    const headers = [
      'Folio', 'Entrega', 'Estado', 'Material', 'Descripción', 
      'Tipo', 'Ubicación actual', 'Linea', 'Nombre Linea', 'Nombre operador', 
      'Teléfono operador', 'Económico tracto', 'Económico trailer', 
      'Hora reportado', 'Tiempo de estancia', 'Fecha de la cita',
      'Diferencia vs. cita', 'Sección cita', 'Incidente seguridad',
      'Incidente transporte', 'Localizador', 'Incidente Almacén', 'Razón de Rechazo',
      'Hora de ingreso', 'Hora de llegada a rampa',
      'Hora de fin de carga/descarga', 'Hora de salida de rampa', 'Status',
      'Salida'
    ];
    
    headers.forEach((headerText, index) => {
      const th = createSortableHeader(headerText, index);
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    
    const tbody = document.createElement('tbody');
    tbody.id = 'yard-table-body';
    tbody.style.cssText = `
      tr:hover {
        opacity: 0.8 !important;
      }
      td {
        padding: 8px;
        border: 1px solid #ddd;
        text-transform: uppercase;
      }
    `;
    
    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    
    modal.appendChild(header);
    modal.appendChild(tableContainer);
    document.body.appendChild(modal);
    
    modalCreated = true;
    console.log("Modal created");
    
    // Add status message element
    const statusMsg = document.createElement('div');
    statusMsg.id = 'yard-status-message';
    statusMsg.style.cssText = `
      padding: 10px;
      margin-bottom: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-transform: uppercase;
    `;
    
    // Create status message without template literals
    const statusSpan = document.createElement('span');
    statusSpan.textContent = 'CARGANDO DATOS DEL PATIO...';
    
    const statusInfo = document.createElement('div');
    statusInfo.innerHTML = 
      '<strong>AUTH:</strong> ' + (authorization ? '✅' : '❌') + 
      ' <strong>COOKIE:</strong> ' + (cookieValue ? '✅' : '❌');
    
    statusMsg.appendChild(statusSpan);
    statusMsg.appendChild(statusInfo);
    
    modal.insertBefore(statusMsg, tableContainer);
    
    fetchYardData();
    
    // Start refreshing time difference every second
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
    }
    refreshIntervalId = setInterval(updateTimeDiffCells, 1000);
    
    // Display sample data if no real data available after 3 seconds
    setTimeout(() => {
      if (yardData.length === 0) {
        console.log("No data after timeout, using fallback sample data");
        yardData = createSampleData();
        updateTable();
      }
    }, 3000);
  }
 
  // Create sample data for testing - Updated to include enriched data and transport incident
  function createSampleData() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    const twoHoursAgo = now - 7200000;
    const fiveHoursAgo = now - 18000000;
 
    // Sample appointment times
    const sampleAppointment1 = now + 1800000; // 30 minutes in future
    const sampleAppointment2 = oneHourAgo - 1800000; // 30 minutes before oneHourAgo
    
    const samples = [
      {
        trailer: {
          shipment_details: {
            reference_1: "10789315",
            reference_2: "ib-0226605606",
            sku: ["000000000002010099-env mod especial 12 oz granel premium"]
          },
          service_type: "inbound",
          shipment_no: "10789315_1",
          comment: "<a><b>angel</b><c>espinoza</c><d></d><e></e><f></f><g></g><h></h><i>380</i><j></j><k>2017</k><l>kenworth</l><m>20942063</m><n>y2a0ct</n><o>2012</o><p>hytr</p><u>mxtraabe</u><s1>1736790117367902</s1><critico></critico></a>\n<q></q>\n<r></r>\n<s></s>\n<t></t>\n<s2></s2><x>Incidente con llanta trasera</x><w>Problema con documentación</w><lo>ZN-A-01</lo><y>Problema con material dañado</y><rr>R1-RECHAZO LLANTA POCHADA</rr>",
          load_information: [
            {
              sku: "000000000002010099-env mod especial 12 oz granel premium",
              qty: 50
            }
          ]
        },
        status: "empty",
        commodity: "envaselv03",
        current_location: "llegada1",
        cab: {
          carrier: "mxtraabe",
          first_name: "angel",
          last_name: "espinoza",
          driver_cell_no: "6221478130",
          cab_no: "380"
        },
        name: "20942063",
        arrival_time: now - 1800000, // 30 minutes ago
        uuid: "sample-uuid-1",
        // Add enriched data
        enriched_reference_1: "10789315",
        enriched_reference_2: "ib-0226605606",
        enriched_load_information: [
          {
            sku: "000000000002010099-env mod especial 12 oz granel premium",
            qty: 50
          }
        ]
      },
      {
        trailer: {
          shipment_details: {
            reference_1: "",
            reference_2: ""
          },
          service_type: "inbound",
          shipment_no: "10767178_1",
          comment: "<w>Revisión de equipo necesaria</w><lo>ZN-B-15</lo><y>Revisión de documentos pendiente</y>"
        },
        status: "loaded",
        commodity: "envaselv03im",
        current_location: "stg-09",
        cab: {
          carrier: "xpog",
          first_name: "natividad",
          last_name: "bojorquez",
          driver_cell_no: "6681701792",
          cab_no: "23"
        },
        name: "411422",
        arrival_time: oneHourAgo,
        uuid: "sample-uuid-2",
        // Add enriched data (simulating activity log fallback)
        enriched_reference_1: "10767178",
        enriched_reference_2: "ib-0226430389",
        enriched_load_information: [
          {
            sku: "000000000002010099-btl mod esp 12oz bulk premium",
            qty: 35
          }
        ]
      },
      {
        trailer: {
          shipment_details: {
            reference_1: "10767172",
            reference_2: "ib-0226430364",
            sku: ["000000000002010099-btl mod esp 12oz bulk premium"]
          },
          service_type: "inbound",
          shipment_no: "10767172_2",
          comment: "<lo>ZN-C-08</lo><rr>R2-RECHAZO ALMACEN LLENO</rr>",
          load_information: [
            {
              sku: "000000000002010099-btl mod esp 12oz bulk premium",
              qty: 25
            }
          ]
        },
        status: "loaded",
        commodity: "envaselv03im",
        current_location: "stg-22",
        cab: {
          carrier: "xpog",
          first_name: "raul",
          last_name: "tejada",
          driver_cell_no: "6441500367",
          cab_no: "t04"
        },
        name: "412616",
        arrival_time: twoHoursAgo,
        uuid: "sample-uuid-3",
        // Add enriched data
        enriched_reference_1: "10767172",
        enriched_reference_2: "ib-0226430364",
        enriched_load_information: [
          {
            sku: "000000000002010099-btl mod esp 12oz bulk premium",
            qty: 25
          }
        ]
      },
      {
        trailer: {
          service_type: "outbound",
          shipment_no: "10767171_1"
        },
        status: "empty",
        current_location: "cpt2-08",
        cab: {
          carrier: "LEYVA",
          cab_no: "ley07"
        },
        name: "07",
        arrival_time: fiveHoursAgo,
        uuid: "sample-uuid-4",
        // Add enriched data
        enriched_reference_1: "",
        enriched_reference_2: "",
        enriched_load_information: []
      }
    ];
    
    // Add sample appointment data to cache
    appointmentCache["10789315_1"] = {
      appointmentTime: sampleAppointment1,
      sectionName: "pt 1"
    };
    
    appointmentCache["10767178_1"] = {
      appointmentTime: sampleAppointment2,
      sectionName: "pt 2"
    };
    
    // Add sample task data
    taskData = [
      {
        task_type: {
          code: "spot",
        },
        created_time: now - 2000000,
        completed_time: now - 1800000,
        assets: [{ uuid: "sample-uuid-1" }]
      },
      {
        task_type: {
          code: "pull",
        },
        created_time: now - 1000000,
        completed_time: now - 800000,
        assets: [{ uuid: "sample-uuid-1" }]
      },
      {
        task_type: {
          code: "spot",
        },
        created_time: now - 4000000,
        completed_time: now - 3800000,
        assets: [{ uuid: "sample-uuid-2" }]
      },
      {
        task_type: {
          code: "pull",
        },
        created_time: now - 3000000,
        completed_time: now - 2800000,
        assets: [{ uuid: "sample-uuid-2" }]
      }
    ];
    
    // Add sample carrier data
    carrierData = [
      { scac: "mxtraabe", name: "Transportes Abel" },
      { scac: "xpog", name: "XPO Logistics" },
      { scac: "LEYVA", name: "Leyva Transport" },
      { scac: "abt", name: "abt" },
      { scac: "0abt", name: "ABT Express Services" }
    ];
 
    // Add sample product types
    productTypeCache = [
      "-",
      "2a", 
      "acido ascorbico",
      "acido fosforico",
      "adhesivo",
      "envaselv03",
      "envaselv03im"
    ];
 
    // Add sample activity log cache
    activityLogCache["sample-uuid-2"] = {
      reference_1: "10767178",
      reference_2: "ib-0226430389",
      load_information: [
        {
          sku: "000000000002010099-btl mod esp 12oz bulk premium",
          qty: 35
        }
      ]
    };
    
    return samples;
  }
 
  // Intercept XHR requests to capture authorization and cookies
  function interceptXHR() {
    console.log("Setting up XHR interception");
    
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
      this.addEventListener('load', function() {
        if (this.responseURL && this.responseURL.includes('yard-visibility-na12.api.project44.com')) {
          console.log('XHR intercepted: ' + this.responseURL);
          
          // Get the request headers from the original request
          try {
            const authHeader = this._requestHeaders?.find(h => h.name === 'Authorization')?.value;
            const cookieHeader = this._requestHeaders?.find(h => h.name === 'Cookie')?.value;
            
            if (authHeader) {
              authorization = authHeader;
              console.log("Authorization captured from XHR");
            }
            
            if (cookieHeader) {
              cookieValue = cookieHeader;
              console.log("Cookie captured from XHR");
            }
            
            if (authorization && cookieValue && !yardData.length) {
              fetchYardData();
            }
          } catch (e) {
            console.log("Error extracting headers:", e.message);
          }
        }
      });
      origOpen.apply(this, arguments);
    };
    
    // Store original setRequestHeader
    const origSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
      // Store headers for later use
      if (!this._requestHeaders) this._requestHeaders = [];
      this._requestHeaders.push({ name: header, value: value });
      
      if (header.toLowerCase() === 'authorization' && value) {
        authorization = value;
        console.log("Authorization captured from setRequestHeader");
      }
      
      if (header.toLowerCase() === 'cookie' && value) {
        cookieValue = value;
        console.log("Cookie captured from setRequestHeader");
      }
      
      return origSetRequestHeader.apply(this, arguments);
    };
  }
 
  // Also intercept fetch requests
  function interceptFetch() {
    console.log("Setting up fetch interception");
    
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
      if (url && url.toString().includes('yard-visibility-na12.api.project44.com')) {
        console.log('Fetch intercepted: ' + url.toString());
        
        if (options.headers) {
          const headers = options.headers instanceof Headers ? 
            Object.fromEntries([...options.headers.entries()]) : 
            options.headers;
            
          if (headers.Authorization || headers.authorization) {
            authorization = headers.Authorization || headers.authorization;
            console.log("Authorization captured from fetch");
          }
          
          if (headers.Cookie || headers.cookie) {
            cookieValue = headers.Cookie || headers.cookie;
            console.log("Cookie captured from fetch");
          }
        }
      }
      return originalFetch.apply(this, arguments);
    };
  }
 
  // Extract cookies from document
  function extractCookies() {
    console.log("Attempting to extract cookies from document");
    if (document.cookie) {
      cookieValue = document.cookie;
      console.log("Cookies extracted from document");
    } else {
      console.log("No cookies found in document");
    }
  }
 
  // Get token from local storage
  function getTokenFromStorage() {
    console.log("Attempting to get token from storage");
    try {
      // Check for common token storage patterns
      const storageKeys = ['token', 'accessToken', 'jwt', 'authToken', 'p44_token', 'yard_token'];
      
      for (let key of storageKeys) {
        const token = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (token) {
          authorization = 'Bearer ' + token;
          console.log('Token found in storage: ' + key);
          return true;
        }
      }
      
      // Try to find token in any storage key
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        
        if (typeof value === 'string' && (
            value.startsWith('eyJ') || 
            value.includes('token') || 
            key.includes('token') || 
            key.includes('auth')
        )) {
          console.log('Potential token found in localStorage: ' + key);
          if (value.startsWith('Bearer ')) {
            authorization = value;
          } else if (value.startsWith('eyJ')) {
            authorization = 'Bearer ' + value;
          }
          return true;
        }
      }
      
      console.log("No token found in storage");
      return false;
    } catch (e) {
      console.log("Error accessing storage:", e.message);
      return false;
    }
  }
 
  // Initialize the script
  function init() {
    console.log("Initializing Yard Console");
    createButton();
    createStatusBar();
    interceptXHR();
    interceptFetch();
    extractCookies();
    getTokenFromStorage();
    
    // Check for new trailer records every 10 seconds
    trailerCheckIntervalId = setInterval(() => {
      if (authorization && cookieValue) {
        fetchYardData();
      }
    }, 10000);
    
    // Refresh task data every 30 seconds
    taskRefreshIntervalId = setInterval(() => {
      if (authorization && cookieValue) {
        fetchTaskData().catch(err => {
          console.log("Error refreshing task data:", err.message);
        });
      }
    }, 30000);
    
    console.log("Initialization complete");
  }
 
  // Run the init function
  init();
})();