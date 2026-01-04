// ==UserScript==
// @name         uMap Routing
// @namespace    http://umaprouting.technetium.be
// @version      v0.0.3
// @description  Add routing to uMap
// @author       Toni Cornelissen
// @match        https://umap.openstreetmap.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556285/uMap%20Routing.user.js
// @updateURL https://update.greasyfork.org/scripts/556285/uMap%20Routing.meta.js
// ==/UserScript==

/*

This script adds option to add routing to uMap
intended as a proof of concept to resolve 
https://github.com/umap-project/umap/issues/297

This is done by adding a route icon to the edit toolbar.
ToDo: Create a more sensible icon
Clicking on it will open a modal where the route can be defined.
The route is defined by clicking on the points that will be part of the route
Routing is done via GraphHopper, a GraphHopper api key must also be entered.
The api key is stored in localStorage, saving it for future use.
ToDo: Create more input options for other GraphHopper parameters

When GraphHopper has calculated the route, it's imported via manipulation
of the import modal, not an elegant solution, but it works. 

ToDo:
	- When a route is added, make it possible to edit the points (delete, add, reorder) and recalculate the route.

*/


(function() {
    'use strict';

	// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
	function waitForElm(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector));
			}

			const observer = new MutationObserver(mutations => {
				if (document.querySelector(selector)) {
					observer.disconnect();
					resolve(document.querySelector(selector));
				}
			});

			// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
	}

	// https://stackoverflow.com/questions/31798816/simple-mutationobserver-version-of-domnoderemovedfromdocument
	function onRemove(element, onDetachCallback) {
		const observer = new MutationObserver(function () {
			if (!document.contains(element)) {
				observer.disconnect();
				onDetachCallback();
			}
		})

		observer.observe(document, {
			 childList: true,
			 subtree: true
		});
	}

	function routingHtml() {
		return `
            <div class="body"><div><form data-ref="form">
                <h3><i class="icon icon-24 icon-clone"></i>Add points to route</h3>
                <p>Explanation. Bla Bla.</p>
		
				<div class="formbox umap-field-graph-hopper-api-key" data-ref="container">
					<label title="apikey" data-ref="label" data-help="">API Key</label>
					<input type="text" placeholder="" name="graphHopperApiKey" id="graphHopperApiKey" data-ref="input" />
					<!-- <small class="help-text" data-ref="helpText" hidden=""></small> -->
				</div>
					
				<div class="formbox umap-field-datalayer" data-ref="container">
					<div class="select-with-actions">
						<select name="datalayer" id="routeDataLayer" data-ref="select"></select>
						<button type="button" class="icon icon-16 icon-edit flat" data-ref="openEditPanel"></button>
						<button type="button" class="icon icon-16 icon-table flat" data-ref="openTableEditor"></button>
					</div>
					<small class="help-text" data-ref="helpText" hidden=""></small>
				</div>

				</div>		
					
				<div class="formbox umap-field-profile" data-ref="container">
					<label title="Routing profile" data-ref="label" data-help="">Routing profile</label>
					<select name id="graphHopperProfile" name="graphHopperProfile">
						<option value="car">Car</option>
						<option value="bike">Bike</option>
						<option value="foot">Foot</option>
					</select>
					<small class="help-text" data-ref="helpText" hidden=""></small>
				</div>			
				
				<div class="formbox umap-field-type" data-ref="container">
					<label title="Route points" data-ref="label" data-help="">Route points</label>
					<ul id="routePoints">
					</ul>
                </div>
				<div class="button-bar half">
					<button type="button" class="primary" data-ref="confirm" id="addRouteButton" disabled="disabled">Add Route</button>
				</div>
            </form></div></div>
		`;
	}
	
	function fillRouteFormDataLayer() {
		const options = [];
		for (let key in U.MAP.datalayers) {
			const option = document.createElement('option');
			option.value = key;
			option.text = U.MAP.datalayers[key].properties.name;
			options[Object.keys(U.MAP.datalayers).length - U.MAP.datalayers[key].properties.rank - 1] = option;
		}
		const select = document.getElementById('routeDataLayer');
		options.forEach(option => select.appendChild(option));
		
		if (U.MAP._editedFeature) {
			select.value = dataLayerKeyFromId(U.MAP._editedFeature.id);
		}
	}
	
	function fillRouteForm(ids='') {
		console.log(`fillRouteForm(ids)`)
		document.getElementById('graphHopperApiKey').value = localStorage.getItem('graphHopperApiKey');
		document.getElementById('graphHopperProfile').value = localStorage.getItem('graphHopperProfile');
        document.getElementById('addRouteButton').addEventListener('click', addRoute);
		fillRouteFormDataLayer();
		if (ids) { ids.split(',').forEach(id => addToRoute(id)); }
		
		
		
		// ToDo: Handle recalculation of the route
	}

    function addRoutingModal() {
        console.log('addRoutingModal');
		let panel = document.querySelector('.panel.right.dark');
		if (!panel) {
			console.log('Panel not found: Create it.');
			const elem = document.createElement("div");

			U.MAP.editPanel.open({content: elem});
			console.log('openend');
		panel = document.querySelector('.panel.right.dark');
		}
		
		panel.querySelector('.body').innerHTML = routingHtml();
		fillRouteForm();
		panel.classList.add('on');
    }

    function showRoutingModal() {
        console.log('showRoutingModal');
        if (!document.getElementById('routingList')) {
          addRoutingModal();
        }
    }

    function addRoutingIcon() {
        console.log('addRoutingIcon');
        const elem = document.createElement("li");
        elem.dataset.ref = "route";
        elem.innerHTML = '<button type="button" data-getstarted="" title="Draw a route (Ctrl+R)"><i class="icon icon-24 icon-clone"></i></button>';
        elem.addEventListener('click', showRoutingModal);
        //elem.addEventListener('click', importData);
		waitForElm('.umap-edit-bar hr').then((hr) => {
			hr.parentNode.insertBefore(elem, hr);
		});
    }

	function idFromElement(elem) {
        while (elem && elem.classList) {
            if (elem.classList.contains('leaflet-marker-icon')) {
				return elem.dataset.feature;
			}
            elem = elem.parentNode;
        }
	}

	function coordinatesFromId(id) {
	    for (let key in U.MAP.datalayers) {
            if (U.MAP.datalayers[key].features.has(id)) {
                return U.MAP.datalayers[key].features.get(id).geometry.coordinates;
            }
        }
	}

	function dataLayerFromId(id) {
	    for (let key in U.MAP.datalayers) {
            if (U.MAP.datalayers[key].features.has(id)) {
                return U.MAP.datalayers[key];
            }
        }
	}

	function dataLayerKeyFromId(id) {
	    for (let key in U.MAP.datalayers) {
            if (U.MAP.datalayers[key].features.has(id)) {
                return key;
            }
        }
	}

	function nameFromId(id) {
	    for (let key in U.MAP.datalayers) {
            if (U.MAP.datalayers[key].features.has(id)) {
                return U.MAP.datalayers[key].features.get(id).properties.name;
            }
        }
	}

	function addToRoute(id) {
		console.log(`addToRoute(${id}`);
    	const elem = document.createElement("li");
		elem.classList = "orderable"
		elem.setAttribute('dragable', 'true');
		elem.dataset.featureId = id;
		const drag = document.createElement('i');
		drag.classList = 'icon icon-16 icon-drag';
		drag.title = 'Drag to reorder';
		elem.appendChild(drag);
		const del = document.createElement('button');
		del.classList = "icon icon-16 icon-delete show-on-edit "
		del.title = "Delete waypoint";
		del.addEventListener('click', e => del.parentNode.remove());
		elem.appendChild(del);
		const span = document.createElement('span');
		span.textContent = nameFromId(id) || id;
		elem.appendChild(span);
		const hr = document.getElementById('routePoints');
		hr.appendChild(elem);
		document.getElementById('addRouteButton').disabled = (
			(!document.getElementById("graphHopperApiKey").value) ||
			(hr.childElementCount < 2)
		);
		// Have to include the orderable module somehow
		// const orderable = new Orderable(ul, onReorder);
	}
	
	function addRoute() {
		console.log('AddRoute()');
		if (U.MAP._editedFeature) {
			dataLayerFromId(U.MAP._editedFeature.id).removeFeature(U.MAP._editedFeature);
		}
		const apiKey = document.getElementById('graphHopperApiKey').value;
		const profile = document.getElementById('graphHopperProfile').value;
		const dataLayer = document.getElementById('routeDataLayer').value;
		localStorage.setItem('graphHopperApiKey', apiKey);
		localStorage.setItem('graphHopperProfile', profile);
		const url = 'https://graphhopper.com/api/1/route?key=' + apiKey;
		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		
		const data = {
			elevation: false,
			points: Array
				.from(document.getElementById('routePoints').children)
				.map(elem => coordinatesFromId(elem.dataset.featureId)),
			points_encoded: false,	
			profile: profile,
		}
		console.log(data);
	
		window.fetch(
			url,
			{
				body: JSON.stringify(data),
				headers: headers,
				method: 'POST',
                mode: 'cors',
			}
		)
			.then(res => res.json())
			.then(json => {
				const ids = Array
					.from(document.getElementById('routePoints').children)
					.map(elem => elem.dataset.featureId)
					.join(',')
				const name = Array
					.from(document.getElementById('routePoints').children)
					.map(elem => nameFromId(elem.dataset.featureId) || elem.dataset.featureId)
					.join(' - ')
				document.querySelector('.panel').classList.remove('on');
				const distance =  new Intl.NumberFormat("en-EN", { style: "unit", unit: "kilometer",}).format(json.paths[0].distance / 1000);
				const duration = new Date(json.paths[0].time).toISOString().substr(11, 8);
				importData({
					"type": "Feature",
					"geometry": json.paths[0].points,
					"properties": {
						"name": name,
						"description": `Distance: ${distance}\nDuration: ${duration}`,
                        "feature-ids": ids,
						"profile": profile,
					}
				}, dataLayer);
			})
			.catch(error => console.error(error))
		;
	}

	function importData(geojson, dataLayer = null) {
		console.log(`importData(geojson, $dataLayer)`);
		const layer = dataLayer ? U.MAP.datalayers[dataLayer] : Object.values(U.MAP.datalayers)[0];
		layer.sync.startBatch();
		const data = layer.addData(geojson);
		layer.sync.commitBatch();
		return data;
	}

	function addRoutingForm() {
		console.log('addRoutingForm()');
		document.querySelector('.umap-field-feature-ids').innerHTML = routingHtml();
		fillRouteForm(U.MAP._editedFeature.properties['feature-ids']);
		document.querySelector('[data-feature="'+U.MAP._editedFeature.id+'"]'); 
	}


	function checkEditPolygonModal() {
		console.log('checkEditPolygonModal()');
		waitForElm('.umap-feature-container .icon-polyline').then(elem => {
			if (U.MAP._editedFeature.properties['feature-ids']) {
				addRoutingForm();
			}
			onRemove(elem, checkEditPolygonModal);
		});
	}

    function onClick(e) {
        if (!document.getElementById('routePoints')) { return; }
        //console.log(e);
        const id = idFromElement(e.target);
		if (id) {
			addToRoute(id);
		}
    }

    console.log('uMap Routing');
    addRoutingIcon();
    document.addEventListener('click', onClick);
	checkEditPolygonModal();

})();
