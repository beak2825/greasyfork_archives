// ==UserScript==
// @name         TitanCraft - Custom Folders
// @namespace    TitanCraft
// @version      1.00
// @description  Allows the creation of folders in TitanCraft
// @author       Gazza
// @match        ^https://titancraft.com/$
// @icon         https://www.google.com/s2/favicons?sz=64&domain=titancraft.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/563935/TitanCraft%20-%20Custom%20Folders.user.js
// @updateURL https://update.greasyfork.org/scripts/563935/TitanCraft%20-%20Custom%20Folders.meta.js
// ==/UserScript==

/* global $ */

(function() {
    var folders = {};
    var movedMinis = {};
    var currentFolder = "";
    var renamingFolder = "";
    var deletingFolder = "";
    var currentMini = "";

    const callback = (mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(addedNode => {
                    if ($(addedNode).data("id") === "save-files-loaded") {
                        // All save files have been loaded
                        observer.disconnect();
                        $(addedNode).remove();
                        $(`<div id="folderscontrols">
                               <input type="file" id="hiddenImport" />
                               <button class="import">
                                   <span class="fa fa-file-import"></span>
                                   Import
                               </button>
                               <button class="export">
                                   <span class="fa fa-file-export"></span>
                                   Export
                               </button>
                           </div>`).prependTo("#addcharactermycharacterstab");
                        $("#folderscontrols .import").click(function() {
                            $("#folderscontrols #hiddenImport").click();
                        });
                        $("#folderscontrols #hiddenImport").change(function(event) {
                            var file = event.target.files[0];
                            if (file) {
                                var reader = new FileReader();
                                reader.onload = function(e) {
                                    var fileContent = e.target.result;
                                    try {
                                        var jsonData = JSON.parse(fileContent);
                                        folders = jsonData.folders;
                                        GM_setValue("TitanCraftFolders", folders);
                                        movedMinis = jsonData.minis;
                                        GM_setValue("TitanCraftMovedMinis", movedMinis);
                                        $("div.savefile.folder").remove();
                                        var dom = generateFolderDom(folders);
                                        $("div.savefile.createfolder").after(dom);
                                        changeDisplay();
                                    } catch (error) {

                                    }
                                };
                                reader.readAsText(file);
                            }
                        });
                        $("#folderscontrols .export").click(function() {
                            var savedValues = {"folders": folders, "minis": movedMinis};
                            var element = document.createElement('a');
                            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedValues)));
                            element.setAttribute('download', "titancraft-custom-folders.json");

                            element.style.display = 'none';
                            document.body.appendChild(element);

                            element.click();

                            document.body.removeChild(element);
                        });
                        $("div.savefile.radiobtn").attr("draggable", true);
                        $("div.savefile.radiobtn").on("dragstart", function(e) {
                            e.originalEvent.dataTransfer.effectAllowed = "move";
                            e.originalEvent.dataTransfer.setData('text/plain', $(this).data("id"));
                        });
                        $("div.savefiles").on("dragover", "div.savefile.folder", function(e) {
                            e.preventDefault();
                            e.originalEvent.dataTransfer.dropEffect = "move";
                        });
                        $("div.savefiles").on("drop", "div.savefile.folder", function(e) {
                            e.preventDefault();
                            var miniId = e.originalEvent.dataTransfer.getData('text/plain');
                            var folderId = $(this).data("id");
                            moveMini(miniId, folderId);
                        });
                        changeDisplay();
                        $("div.savefiles").on("dblclick", "div.savefile.folder", function() {
                            currentFolder = $(this).data("id");
                            changeDisplay();
                        });
                        $("div.savefile.upfolder").dblclick(function() {
                            var folderPath = folders[currentFolder].path;
                            if (folderPath === "") {
                                currentFolder = "";
                            } else {
                                const lastSlashIndex = folderPath.lastIndexOf('/');
                                currentFolder = lastSlashIndex !== -1 ? folderPath.substring(lastSlashIndex + 1) : folderPath;
                            }
                            changeDisplay();
                        });
                        $("div.savefile.createfolder").dblclick(function() {
                            $("#foldermodal .title").text("Create Folder");
                            $("#foldermodal input").val("");
                            $("#foldermodal .nameerror").addClass("hide");
                            $("#foldermodal").css("display", "flex");
                        });
                        $("div.savefile.radiobtn .dropdown a:first-of-type").each(function() {
                            var miniId = $(this).parents(".savefile").data("id");
                            $(this).after(`
                                <span class="item moveFolder" data-id="${miniId}">
                                    <span class="fa fa-angle-double-right"></span>Move
                                </span>
                            `);
                        });
                        $("#dropdowncontainer").on("mouseup", "span.moveFolder", function(e) {
                            $(this).off("click");
                            currentMini = $(this).data("id");
                            setFolderDropdownOptions();
                            $("#movefoldermodal select").val(currentFolder);
                            $("#movefoldermodal").css("display", "flex");
                        });
                        $("#dropdowncontainer").on("mouseup", "a.renameFolder", function(e) {
                            $(this).off("click");
                            renamingFolder = $(this).data("id");
                            $("#foldermodal .title").text("Rename Folder");
                            $("#foldermodal input").val(folders[renamingFolder].name);
                            $("#foldermodal .nameerror").addClass("hide");
                            $("#foldermodal").css("display", "flex");
                        });
                        $("#dropdowncontainer").on("mouseup", "a.deleteFolder", function(e) {
                            $(this).off("click");
                            deletingFolder = $(this).data("id");
                            $("#deletefoldermodal").css("display", "flex");
                        });
                        $("#saveasmodal").after(`
                   <div id="foldermodal" class="modal modal-small">
  <div class="modal-content">
    <div class="modal-header">
      <span class="modal-x-btn modal-cancel">×</span>
      <span class="title">Create Folder</span>
    </div>
    <form autocomplete="off" class="modal-body">
      Enter Folder Name: <input name="name">
      <div>
          <small class="nameerror text-error hide">Please enter a valid folder name</small>
      <div>
    </form>
    <div class="modal-footer">
      <button class="modal-cancel">Cancel</button>
      <button class="confirmbtn primary">Save</button>
    </div>
  </div>
</div>
</div>
</div>
<div id="movefoldermodal" class="modal modal-small">
  <div class="modal-content">
    <div class="modal-header">
      <span class="modal-x-btn modal-cancel">×</span>
      <span class="title">Move Mini</span>
    </div>
    <form autocomplete="off" class="modal-body">
      Select New Folder: <select name="folder"></select>
    </form>
    <div class="modal-footer">
      <button class="modal-cancel">Cancel</button>
      <button class="confirmbtn primary">Save</button>
    </div>
  </div>
</div>
</div>
</div>
<div id="deletefoldermodal" class="modal modal-small">
  <div class="modal-content">
    <div class="modal-header">
      <span class="modal-x-btn modal-cancel">×</span>
      <span class="title">Delete Folder</span>
    </div>
    <p>Performing this is irreversible.</p>
    <span>Any folders/minis inside will be placed in the parent folder</span>
    <div class="modal-footer">
      <button class="modal-cancel">Cancel</button>
      <button class="confirmbtn primary">Save</button>
    </div>
  </div>
</div>
</div>
</div>`);
                        $("#foldermodal .modal-cancel").click(function(e) {
                            $("#foldermodal").css("display", "");
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        $("#foldermodal .confirmbtn").click(function(e) {
                            var folderName = $("#foldermodal input").val();
                            if (folderName.length > 0) {
                                var folder = {};
                                if (renamingFolder.length > 0) {
                                    folders[renamingFolder].name = folderName;
                                    $(`div.savefile.folder[data-id='${renamingFolder}'] .title`).text(folderName);
                                    $(`div.savefile.folder[data-id='${renamingFolder}']`).data("name", folderName);
                                    renamingFolder = "";
                                    $("#foldermodal").css("display", "");
                                } else {
                                    var folderId = uuidv4();
                                    folder[folderId] = {
                                        "name": folderName,
                                        "path": currentFolder
                                    };
                                    folders[folderId] = folder[folderId];
                                    var dom = generateFolderDom(folder);

                                    $("div.savefile.createfolder").after(dom);
                                    $("#foldermodal").css("display", "");
                                }
                                GM_setValue("TitanCraftFolders", folders);
                            } else {
                                $("#foldermodal .nameerror").removeClass("hide");
                            }
                            e.preventDefault();
                            e.stopPropagation();
                        });

                        $("#movefoldermodal .modal-cancel").click(function(e) {
                            $("#movefoldermodal").css("display", "");
                            renamingFolder = "";
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        $("#movefoldermodal .confirmbtn").click(function(e) {
                            var folderId = $("#movefoldermodal select").val();
                            $("#movefoldermodal").css("display", "");
                            moveMini(currentMini, folderId);
                            e.preventDefault();
                            e.stopPropagation();
                        });

                        $("#deletefoldermodal .modal-cancel").click(function(e) {
                            $("#deletefoldermodal").css("display", "");
                            deletingFolder = "";
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        $("#deletefoldermodal .confirmbtn").click(function(e) {
                            var deletingFolderParent = folders[deletingFolder].path;
                            for (const [folderId, folder] of Object.entries(folders)) {
                                if (folder.path === deletingFolder) {
                                    folder.path = deletingFolderParent;
                                };
                            }
                            if (movedMinis[deletingFolder]) {
                                if (deletingFolderParent !== "") {
                                    if (!movedMinis[deletingFolderParent]) {
                                        movedMinis[deletingFolderParent] = [];
                                    }
                                    for (const miniId of movedMinis[deletingFolder]) {
                                        movedMinis[deletingFolderParent].push(miniId);
                                    }
                                }
                                delete movedMinis[deletingFolder];
                            }
                            delete folders[deletingFolder];
                            $(`div.savefile.folder[data-id='${deletingFolder}']`).remove();
                            deletingFolder = "";
                            GM_setValue("TitanCraftMovedMinis", movedMinis);
                            GM_setValue("TitanCraftFolders", folders);
                            changeDisplay();
                            $("#deletefoldermodal").css("display", "");
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        $(".loadmoresavedcharactersbtn").remove();
                    }
                });
            }
        }
    };

    const observer = new MutationObserver(callback);
    const config = {
        childList: true
    };

    $(document).on("ajaxSend", function(event, request, settings) {
        if (settings.url === "/api/v1/editor/savefiles/?start=0&numResults=20") {
            settings.url = "/api/v1/editor/savefiles/";
        }
    });
    $(document).on("ajaxComplete", function(event, xhr, settings) {
        if (settings.url === "/api/v1/editor/savefiles/") {
            xhr.responseJSON.saveFiles[xhr.responseJSON.count] = ["save-files-loaded", "Loaded", ""];
            xhr.responseJSON.count++;
            folders = GM_getValue("TitanCraftFolders") || {};
            movedMinis = GM_getValue("TitanCraftMovedMinis") || {};
            var dom = `<div class="savefile upfolder" data-type="upfolder">
  <div class="thumbnail">
    <i class="fa fa-undo maxSize"></i>
  </div>
  <div class="title">Go Up</div>
</div>
<div class="savefile createfolder" data-type="createfolder">
  <div class="thumbnail">
    <i class="fa fa-folder-plus maxSize"></i>
  </div>
  <div class="title">Create Folder</div>
</div>`;
            dom += generateFolderDom(folders);
            $(".savefiles").prepend(dom);
            observer.observe(document.querySelector('div.savefiles'), config);
            $("div.savefiles").on("click", "div.savefile div.dropdown.folder", function() {
                $("#dropdowncontainer").html($(this).children(".managesavedcharacterfolder").prop("outerHTML"));
                $("#dropdowncontainer").css($(this).offset());
            });
        }
    });
    $("head").append(`
            <style>
                div.savefile div.thumbnail i.maxSize {
                    height: 250px;
                    font-size: 80pt;
                    position: relative;
                    top: 70px;
                }
                #foldermodal, #movefoldermodal, #deletefoldermodal {
                    text-align: center;
                    z-index: 2005;
                }
                .radio #folderscontrols button {
                    border: 0px;
                }
                #folderscontrols {
                    position: sticky;
                    top: -10px;
                    text-align: left;
                    background: var(--background-main);
                    z-index: 99;
                }
                #folderscontrols > span {
                    cursor: pointer;
                    margin-right: 10px;
                }
                #folderscontrols #hiddenImport {
                    display: none;
                }
            </style>
        `);

    function generateFolderDom(folders) {
        var dom = "";
        if (folders !== undefined) {
            for (const [id, folder] of Object.entries(folders)) {
                dom += `
                <div class="savefile folder" data-type="savedfolder" data-id="${id}" data-name="${folder.name}">
  <div class="thumbnail">
    <i class="fa fa-folder maxSize"></i>
  </div>
  <div class="title">${folder.name}</div>
  <div class="dropdown folder">
    <div class="dropdown-button">
      <i class="fa fa-cog"></i>
    </div>
    <div class="managesavedcharacterfolder dropdown-items">
      <div class="header">Saved Folder</div>
      <a name="rename" class="item renameFolder" data-id="${id}">
        <span class="fa fa-edit"></span>
        Rename
      </a>
      <div class="h-divider"></div>
      <a name="delete" class="item deleteFolder" data-id="${id}">
        <span class="fa fa-trash"></span>
        Delete
      </a>
    </div>
  </div>
</div>`
            }
        }
        return dom;
    }

    function changeDisplay() {
        if (currentFolder === "") {
            $("div.savefile.radiobtn").show();
            for (const miniId of Object.values(movedMinis).flat()) {
                $("div.savefile.radiobtn[data-id='" + miniId + "']").hide();
            }
            $("div.savefile.folder").each(function() {
                var folderId = $(this).data("id");
                folders[folderId].path === "" ? $(this).show() : $(this).hide();
            });
            $("div.savefile.upfolder").hide();
        } else {
            var minis = movedMinis[currentFolder];
            if (!minis) {
                $("div.savefile.radiobtn").hide();
            } else {
                $("div.savefile.radiobtn").each(function() {
                    var miniId = $(this).data("id");
                    minis.includes(miniId) ? $(this).show() : $(this).hide();
                });
            }
            $("div.savefile.folder").each(function() {
                var folderId = $(this).data("id");
                folders[folderId].path.endsWith(currentFolder) ? $(this).show() : $(this).hide();
            });
            $("div.savefile.upfolder").show();
        }
    }

    function moveMini(miniId, folderId) {
        if (!miniId || currentFolder === folderId) {
            return;
        }
        if (folderId !== "" && !movedMinis[folderId]) {
            movedMinis[folderId] = [];
        }
        for (const [, arr] of Object.entries(movedMinis)) {
            const index = arr.indexOf(miniId);
            if (index !== -1) {
                arr.splice(index, 1);
            }
        }
        if (folderId !== "") {
            movedMinis[folderId].push(miniId);
        }
        $("div.savefile.radiobtn[data-id='" + miniId + "']").hide();
        GM_setValue("TitanCraftMovedMinis", movedMinis);
    }

    function setFolderDropdownOptions() {
        var dom = `<option value="">Root</option>`;
        for (const [folderId, folder] of Object.entries(folders)) {
            dom += `<option value="${folderId}">${folder.name}</option>`;
        }
        $("#movefoldermodal select").html(dom);
    }

    function uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }
})();