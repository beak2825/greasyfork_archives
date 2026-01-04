// ==UserScript==
// @name         Phnt3D Studio MOD v.BETA 0.1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds export/import (.p3ds JSON) and extra shape spawners (torusKnot, capsule, prism, roundedBox, ring) to Phnt3D-Studio via injection into page context.
// @author       S4IL
// @match        https://phntvldacer1.github.io/Phnt3D-Studio/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556712/Phnt3D%20Studio%20MOD%20vBETA%2001.user.js
// @updateURL https://update.greasyfork.org/scripts/556712/Phnt3D%20Studio%20MOD%20vBETA%2001.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Inject into page context so we can access THREE, scene, shapes, spawnShape, etc.
  const injected = document.createElement('script');
  injected.type = 'text/javascript';
  injected.textContent = '(' + function() {
    // --- Utility: wait for page variables to exist ---
    function waitFor(fn, timeout = 5000) {
      return new Promise((resolve, reject) => {
        const start = Date.now();
        (function poll() {
          try {
            if (fn()) return resolve();
            if (Date.now() - start > timeout) return reject(new Error('timeout'));
          } catch (err) {
            // keep waiting
          }
          requestAnimationFrame(poll);
        })();
      });
    }

    // --- Core: P3DS export/import (JSON) ---
    function exportP3DS() {
      try {
        const out = { meta: { format: "p3ds-json", version: 1, exportedAt: new Date().toISOString() }, shapes: [] };
        // Use global 'shapes' array if present
        const arr = window.shapes || [];
        for (let g of arr) {
          // try to detect type (prefer userData.type or userData._type)
          const type = (g.userData && (g.userData.type || g.userData._type)) || inferTypeFromGroup(g);
          const pos = [g.position.x, g.position.y, g.position.z];
          const quat = [g.quaternion.x, g.quaternion.y, g.quaternion.z, g.quaternion.w];
          const scale = [g.scale.x, g.scale.y, g.scale.z];
          const color = tryGetColor(g);
          const user = g.userData || {};
          out.shapes.push({ type, pos, quat, scale, color, user });
        }
        const dataStr = JSON.stringify(out, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'scene.p3ds';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        console.log('P3DS exported,', out.shapes.length, 'shapes.');
      } catch (e) {
        console.error('Export failed', e);
        alert('Export failed: ' + e.message);
      }
    }

    function importP3DSFile(file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const json = JSON.parse(evt.target.result);
          if (!json.shapes || !Array.isArray(json.shapes)) {
            throw new Error('Invalid .p3ds file: missing shapes array');
          }
          // Clear selection and existing shapes? We'll just add to scene.
          for (let s of json.shapes) {
            createShapeFromDef(s);
          }
          console.log('Imported', json.shapes.length, 'shapes from .p3ds');
        } catch (e) {
          console.error('Import error', e);
          alert('Import failed: ' + e.message);
        }
      };
      reader.readAsText(file);
    }

    function inferTypeFromGroup(g) {
      // try to inspect children[0] geometry type
      try {
        const m = g.children.find(c => c.isMesh);
        if (!m || !m.geometry) return 'unknown';
        const geom = m.geometry;
        if (geom.type === 'BoxGeometry' || geom.parameters && geom.parameters.width !== undefined) return 'cube';
        if (geom.type === 'SphereGeometry' || geom.parameters && geom.parameters.radius !== undefined && geom.parameters.widthSegments) return 'sphere';
        if (geom.type === 'CylinderGeometry' && geom.parameters && geom.parameters.radialSegments && geom.parameters.height !== undefined) {
          if (geom.parameters.radialSegments === 3) return 'prism';
          return 'cylinder';
        }
        if (geom.type === 'ConeGeometry') return 'cone';
        if (geom.type === 'TorusGeometry') return 'torus';
        if (geom.type === 'TorusKnotGeometry') return 'torusKnot';
        if (geom.type === 'PlaneGeometry') return 'plane';
        if (geom.type === 'CapsuleGeometry') return 'capsule';
        // fallback
        return geom.type || 'mesh';
      } catch (e) {
        return 'unknown';
      }
    }

    function tryGetColor(g) {
      try {
        const mesh = g.children.find(c => c.isMesh);
        if (mesh && mesh.material && mesh.material.color) {
          return [mesh.material.color.r, mesh.material.color.g, mesh.material.color.b];
        }
      } catch (e) {}
      return null;
    }

    // --- Shape creation helpers (mirror style used by page) ---
    function makeGroupFromGeometry(geom, colorHex = 0x999999, typeName = 'custom') {
      // create mesh and outline line like the site does
      const mat = new THREE.MeshBasicMaterial({ color: colorHex });
      const mesh = new THREE.Mesh(geom, mat);
      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 }));
      const g = new THREE.Group();
      g.add(mesh);
      g.add(line);
      g.userData = g.userData || {};
      g.userData._type = typeName;
      return g;
    }

    // Additional shapes:
    function spawn_torusKnot() {
      const geom = new THREE.TorusKnotGeometry(0.4, 0.12, 128, 16, 2, 3);
      const g = makeGroupFromGeometry(geom, 0x999999, 'torusKnot');
      scene.add(g);
      g.position.set(0, 0, 0);
      window.shapes = window.shapes || [];
      window.shapes.push(g);
      // keep selection behavior similar by deselecting existing: attempt to call deselect/selectShape if present
      if (typeof window.deselect === 'function') window.deselect();
      if (typeof window.selectShape === 'function') window.selectShape(g);
    }

    function spawn_ring() {
      const geom = new THREE.RingGeometry(0.4, 0.6, 64);
      // Ring geometry lies in XY plane and is normally two-faced; convert to mesh by giving slight thickness via extrude? Simpler: use Torus thin
      const torus = new THREE.TorusGeometry(0.5, 0.12, 16, 64);
      const g = makeGroupFromGeometry(torus, 0x999999, 'ring');
      scene.add(g);
      g.position.set(0, 0, 0);
      window.shapes = window.shapes || []; window.shapes.push(g);
      if (typeof window.deselect === 'function') window.deselect();
      if (typeof window.selectShape === 'function') window.selectShape(g);
    }

    function spawn_capsule() {
      // Build capsule from cylinder + hemispheres
      const radius = 0.25, length = 0.8;
      // Use built-in CapsuleGeometry if available (recent three), otherwise compose
      let geom;
      if (THREE.CapsuleGeometry) {
        geom = new THREE.CapsuleGeometry(radius, Math.max(0, length - 2*radius), 8, 16);
      } else {
        // Compose: cylinder + two spheres merged into one geometry? Simpler: use cylinder (visual acceptable)
        geom = new THREE.CylinderGeometry(radius, radius, length, 32);
      }
      const g = makeGroupFromGeometry(geom, 0x999999, 'capsule');
      scene.add(g);
      g.position.set(0, 0, 0);
      window.shapes = window.shapes || []; window.shapes.push(g);
      if (typeof window.deselect === 'function') window.deselect();
      if (typeof window.selectShape === 'function') window.selectShape(g);
    }

    function spawn_prism(sides = 6) {
      // Cylinder with N radial segments acts as prism
      const geom = new THREE.CylinderGeometry(0.5, 0.5, 1, Math.max(3, Math.floor(sides)));
      const g = makeGroupFromGeometry(geom, 0x999999, 'prism');
      scene.add(g);
      g.position.set(0, 0, 0);
      window.shapes = window.shapes || []; window.shapes.push(g);
      if (typeof window.deselect === 'function') window.deselect();
      if (typeof window.selectShape === 'function') window.selectShape(g);
    }

    function spawn_roundedBox() {
      // Approx rounded box by chamfered geometry — approximate with BoxGeometry for now (rounded comes from bevel, which requires CSG or custom geometry)
      // We'll create a box and slightly bevel its edges visually by using a small chamfer implemented via subdivision is heavy; keep simple
      const geom = new THREE.BoxGeometry(1, 1, 1); // placeholder
      const g = makeGroupFromGeometry(geom, 0x999999, 'roundedBox');
      scene.add(g);
      g.position.set(0, 0, 0);
      window.shapes = window.shapes || []; window.shapes.push(g);
      if (typeof window.deselect === 'function') window.deselect();
      if (typeof window.selectShape === 'function') window.selectShape(g);
    }

    // Create a shape from importer definition
    function createShapeFromDef(def) {
      const t = (def.type || 'cube').toLowerCase();
      const pos = def.pos || [0,0,0];
      const quat = def.quat || [0,0,0,1];
      const scale = def.scale || [1,1,1];
      const color = def.color ? rgbArrayToHex(def.color) : 0x999999;
      let g = null;
      switch(t) {
        case 'cube': g = makeGroupFromGeometry(new THREE.BoxGeometry(1,1,1), color, 'cube'); break;
        case 'sphere': g = makeGroupFromGeometry(new THREE.SphereGeometry(0.5, 32, 32), color, 'sphere'); break;
        case 'cylinder': g = makeGroupFromGeometry(new THREE.CylinderGeometry(0.5,0.5,1,32), color, 'cylinder'); break;
        case 'cone': g = makeGroupFromGeometry(new THREE.ConeGeometry(0.5,1,32), color, 'cone'); break;
        case 'torus': g = makeGroupFromGeometry(new THREE.TorusGeometry(0.5,0.18,16,48), color, 'torus'); break;
        case 'plane': g = makeGroupFromGeometry(new THREE.PlaneGeometry(1,1), color, 'plane'); break;
        case 'pyramid': g = makeGroupFromGeometry(new THREE.ConeGeometry(0.7,1,4), color, 'pyramid'); break;
        case 'torusknot': g = makeGroupFromGeometry(new THREE.TorusKnotGeometry(0.4,0.12,128,16,2,3), color, 'torusKnot'); break;
        case 'capsule':
          if (THREE.CapsuleGeometry) g = makeGroupFromGeometry(new THREE.CapsuleGeometry(0.25, 0.3, 8, 16), color, 'capsule');
          else g = makeGroupFromGeometry(new THREE.CylinderGeometry(0.25,0.25,0.6,16), color, 'capsule');
          break;
        case 'prism':
          g = makeGroupFromGeometry(new THREE.CylinderGeometry(0.5,0.5,1,6), color, 'prism');
          break;
        case 'ring':
          g = makeGroupFromGeometry(new THREE.TorusGeometry(0.5,0.12,16,64), color, 'ring');
          break;
        default:
          // fallback to box
          g = makeGroupFromGeometry(new THREE.BoxGeometry(1,1,1), color, t);
      }
      // apply transform
      g.position.set(pos[0]||0, pos[1]||0, pos[2]||0);
      g.quaternion.set((quat[0]||0), (quat[1]||0), (quat[2]||0), (quat[3]!==undefined?quat[3]:1));
      g.scale.set(scale[0]||1, scale[1]||1, scale[2]||1);
      // apply userData
      if (def.user && typeof def.user === 'object') {
        g.userData = Object.assign({}, g.userData, def.user);
      }
      scene.add(g);
      window.shapes = window.shapes || []; window.shapes.push(g);
      return g;
    }

    function rgbArrayToHex(arr) {
      if (!Array.isArray(arr) || arr.length < 3) return 0x999999;
      // arr are floats 0..1 maybe — handle both 0..1 and 0..255
      let r=arr[0], g=arr[1], b=arr[2];
      if (r <= 1 && g <= 1 && b <= 1) { r = Math.round(r*255); g = Math.round(g*255); b = Math.round(b*255); }
      return (r<<16) + (g<<8) + b;
    }

    // --- UI: small side panel with Export/Import + new shape buttons ---
    function createUIPanel() {
      if (document.getElementById('p3ds-mod-panel')) return;
      const panel = document.createElement('div');
      panel.id = 'p3ds-mod-panel';
      panel.style.position = 'fixed';
      panel.style.right = '12px';
      panel.style.top = '120px';
      panel.style.zIndex = 99999;
      panel.style.background = '#232323';
      panel.style.border = '2px solid #444';
      panel.style.padding = '8px';
      panel.style.borderRadius = '8px';
      panel.style.width = '140px';
      panel.style.color = '#fff';
      panel.style.fontFamily = 'Arial, sans-serif';
      panel.style.fontSize = '13px';
      panel.style.boxShadow = '0 6px 18px rgba(0,0,0,0.6)';
      panel.innerHTML = `
        <div style="text-align:center; font-weight:bold; margin-bottom:6px;">P3DS MOD</div>
        <button id="p3ds-export" style="width:100%; padding:6px; margin-bottom:6px; cursor:pointer;">Export .p3ds</button>
        <input id="p3ds-import-file" type="file" accept=".p3ds,.json" style="width:100%; margin-bottom:6px;">
        <div style="margin-top:6px; font-weight:600;">Add shape</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
          <button class="p3ds-shape-btn" data-shape="torusKnot" style="flex:1; padding:6px; cursor:pointer;">TorusKnot</button>
          <button class="p3ds-shape-btn" data-shape="capsule" style="flex:1; padding:6px; cursor:pointer;">Capsule</button>
          <button class="p3ds-shape-btn" data-shape="prism" style="flex:1; padding:6px; cursor:pointer;">Prism</button>
          <button class="p3ds-shape-btn" data-shape="ring" style="flex:1; padding:6px; cursor:pointer;">Ring</button>
          <button class="p3ds-shape-btn" data-shape="roundedBox" style="flex:1; padding:6px; cursor:pointer;">RoundedBox</button>
        </div>
      `;
      document.body.appendChild(panel);

      document.getElementById('p3ds-export').addEventListener('click', () => {
        exportP3DS();
      });
      const fileInput = document.getElementById('p3ds-import-file');
      fileInput.addEventListener('change', (ev) => {
        if (ev.target.files && ev.target.files[0]) {
          importP3DSFile(ev.target.files[0]);
          fileInput.value = null;
        }
      });
      panel.querySelectorAll('.p3ds-shape-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const s = btn.dataset.shape;
          switch(s) {
            case 'torusKnot': spawn_torusKnot(); break;
            case 'capsule': spawn_capsule(); break;
            case 'prism': {
              const n = parseInt(prompt('Number of sides for prism (3..32)', '6')) || 6;
              spawn_prism(Math.max(3, Math.min(32, n))); break;
            }
            case 'ring': spawn_ring(); break;
            case 'roundedBox': spawn_roundedBox(); break;
            default: break;
          }
          // Recreate move gizmo if page has an API for it
          if (typeof window.updateMoveGizmoVisibility === 'function') window.updateMoveGizmoVisibility();
        });
      });
    }

    // Expose functions for debugging
    window.p3dsMod = window.p3dsMod || {};
    window.p3dsMod.exportP3DS = exportP3DS;
    window.p3dsMod.importP3DSFile = importP3DSFile;
    window.p3dsMod.createShapeFromDef = createShapeFromDef;

    // Wait until basic globals are available, then add UI
    waitFor(() => window.THREE && window.scene && window.shapes !== undefined).then(() => {
      console.log('P3DS mod: environment ready — injecting UI');
      createUIPanel();
      // Hook into existing spawnShape if present to annotate userData._type when user uses page's spawner
      if (typeof window.spawnShape === 'function') {
        const orig = window.spawnShape;
        window.spawnShape = function(type, recordAction = true) {
          const result = orig(type, recordAction);
          try {
            // The page creates a group and selects it — find latest shape and set its userData
            const arr = window.shapes || [];
            const g = arr[arr.length - 1];
            if (g) g.userData = g.userData || {}, g.userData._type = type;
          } catch (e) {}
          return result;
        };
      }
    }).catch(err => {
      // If wait times out, still add UI (best-effort)
      console.warn('P3DS mod: waited for scene but timed out; adding UI anyway', err);
      createUIPanel();
    });

    // End injected function
  } + ')();';
  document.documentElement.appendChild(injected);
  injected.parentNode.removeChild(injected);
})();
