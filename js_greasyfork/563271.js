// ==UserScript==
// @name        MB: Copy Recording Relationships to Karaoke/Edited Recordings
// @description Copy recording-{artist, work, etc...} relationships to karaoke/edited recordings with one button!
// @version     0.2.0
// @grant       none
// @namespace   https://rinsuki.net
// @author      rinsuki
// @match       https://*musicbrainz.org/release/*/edit-relationships*
// @homepageURL https://github.com/rinsuki/userscripts
// @supportURL  https://github.com/rinsuki/userscripts/issues
// @require     https://cdn.jsdelivr.net/npm/@rinsuki/dom-chef@5.1.1/umd.js#sha256-EvGMVNob2jRhcwSo8gGGJp3mZJENNaQwrpYlNRQlUMc=,sha512-b/5dx8A+dc01RsqR2hF2Na/DFwwn64M4PQFka7dXhcAeXjPfpkgWS9YFs1LHPaEckkxAI7ivhVn6i+OrFivnYQ==
// @downloadURL https://update.greasyfork.org/scripts/563271/MB%3A%20Copy%20Recording%20Relationships%20to%20KaraokeEdited%20Recordings.user.js
// @updateURL https://update.greasyfork.org/scripts/563271/MB%3A%20Copy%20Recording%20Relationships%20to%20KaraokeEdited%20Recordings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //#region node_modules/.pnpm/typedbrainz@0.1.4/node_modules/typedbrainz/lib/index.js
    // SPDX-License-Identifier: MIT
    function isReleaseRelationshipEditor(relationshipEditor) {
        return relationshipEditor.state?.entity.entityType === "release";
    }

    //#endregion

    /** @jsx h */

    const KARAOKE_REL_LINK_TYPE_ID = 226; // gid: 39a08d0e-26e4-44fb-ae19-906f5fe9435d
    const EDITS_REL_LINK_TYPE_ID = 309; // gid: ce01b3ac-dd47-4702-9302-085344f96e84
    const WORK_REL_LINK_TYPE_ID = 278; // gid: a3005666-a872-32c3-ad06-98af558e99b0
    const WORK_REL_KARAOKE_LINK_ATTR_TYPE_ID = 1261; // gid: 3d984f6e-bbe2-4620-9425-5f32e945b60d
    const WORK_REL_PARTIAL_LINK_ATTR_TYPE_ID = 579; // gid: d2b63be6-91ec-426a-987a-30b47f8aae2d
    function doIt() {
        const MB = window.MB;
        if (MB == null)
            return alert("MB global not found");
        if (MB.tree == null)
            return alert("MB.tree not found");
        const editor = MB.relationshipEditor;
        if (editor == null || !isReleaseRelationshipEditor(editor))
            return alert("Relationship editor not found");
        const currentRecordings = new Map();
        for (const medium of MB.tree.iterate(editor.state.mediums)) {
            for (const track of MB.tree.iterate(medium[1])) {
                currentRecordings.set(track.recording.gid, track.recording);
            }
        }
        for (const recording of currentRecordings.values()) {
            console.log(recording);
            const subrecordingrels = [
                ...recording.relationships.filter(rel => KARAOKE_REL_LINK_TYPE_ID === rel.linkTypeID && rel.entity0_id === recording.id),
                ...recording.relationships.filter(rel => EDITS_REL_LINK_TYPE_ID === rel.linkTypeID && rel.entity1_id === recording.id),
            ];
            for (const subrecordingrel of subrecordingrels) {
                const subrecording = subrecordingrel.target;
                for (const rel of recording.relationships) {
                    if (rel.source_type === "recording" && rel.target_type === "recording")
                        continue; // probably don't want to copy
                    if (rel.source_type === "url" || rel.target_type === "url")
                        continue; // probably don't want to copy
                    const attrs = [...rel.attributes];
                    if (subrecordingrel.linkTypeID === KARAOKE_REL_LINK_TYPE_ID) {
                        if (rel.linkTypeID === WORK_REL_LINK_TYPE_ID && attrs.find(x => x.typeID === WORK_REL_KARAOKE_LINK_ATTR_TYPE_ID) == null) {
                            const karaokeAttr = MB.linkedEntities.link_attribute_type[WORK_REL_KARAOKE_LINK_ATTR_TYPE_ID];
                            attrs.push({
                                type: karaokeAttr,
                                typeID: WORK_REL_KARAOKE_LINK_ATTR_TYPE_ID,
                                typeName: karaokeAttr.name,
                            });
                        }
                    }
                    else if (subrecordingrel.linkTypeID === EDITS_REL_LINK_TYPE_ID) {
                        if (rel.linkTypeID === WORK_REL_LINK_TYPE_ID && attrs.find(x => x.typeID === WORK_REL_PARTIAL_LINK_ATTR_TYPE_ID) == null) {
                            const partialAttr = MB.linkedEntities.link_attribute_type[WORK_REL_PARTIAL_LINK_ATTR_TYPE_ID];
                            attrs.push({
                                type: partialAttr,
                                typeID: WORK_REL_PARTIAL_LINK_ATTR_TYPE_ID,
                                typeName: partialAttr.name,
                            });
                        }
                    }
                    editor.dispatch({
                        type: "update-relationship-state",
                        sourceEntity: rel.backward ? rel.target : subrecording,
                        oldRelationshipState: null,
                        newRelationshipState: {
                            _lineage: [],
                            _original: null,
                            editsPending: false,
                            _status: 1,
                            entity0: rel.backward ? rel.target : subrecording,
                            entity1: rel.backward ? subrecording : rel.target,
                            entity0_credit: rel.entity0_credit,
                            entity1_credit: rel.entity1_credit,
                            begin_date: rel.begin_date,
                            end_date: rel.end_date,
                            ended: rel.ended,
                            attributes: MB.tree.fromDistinctAscArray(attrs),
                            id: editor.getRelationshipStateId(null),
                            linkTypeID: rel.linkTypeID,
                            linkOrder: rel.linkOrder,
                        },
                        batchSelectionCount: undefined,
                        creditsToChangeForSource: "",
                        creditsToChangeForTarget: "",
                    });
                }
            }
        }
        let editNote = editor.state.editNoteField.value;
        if (editNote.length)
            editNote += "\n";
        editNote += "Script: \"" + GM.info.script.name + "\" (" + GM.info.script.version + ")";
        editor.dispatch({ type: "update-edit-note", editNote });
    }
    const elm = DOMChef.h("div", null,
        DOMChef.h("button", { onClick: () => doIt() }, "Copy Recording Relationships to Karaoke Recordings"));
    document.querySelector("#content > div.tabs")?.insertAdjacentElement("afterend", elm);

})();
