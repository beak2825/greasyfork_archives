// ==UserScript==
// @name        MusicBrainz: Sort artists
// @description Allows you to change the order of artist names in any of the multiple artists editors. NOTICE: This will remove any artist lookup data already present in the editor. You have to assign this manually again.
// @supportURL  https://github.com/JensBee/userscripts
// @namespace   http://www.jens-bertram.net/userscripts/sort-artists
// @icon        https://wiki.musicbrainz.org/-/images/3/39/MusicBrainz_Logo_Square_Transparent.png
// @license     MIT
// @version     0.1.1beta
//
// @require     https://greasyfork.org/scripts/5140-musicbrainz-function-library/code/MusicBrainz%20function%20library.js?version=21997
//
// @grant       none
// @include     *://musicbrainz.org/recording/*/edit
// @include     *://*.musicbrainz.org/recording/*/edit
// @include     *://musicbrainz.org/recording/create
// @include     *://*.musicbrainz.org/recording/create
// @include     *://musicbrainz.org/release/*/edit
// @include     *://*.musicbrainz.org/release/*/edit
// @include     *://musicbrainz.org/release-group/*/edit
// @include     *://*.musicbrainz.org/release-group/*/edit
// @include     *://musicbrainz.org/release/add
// @include     *://*.musicbrainz.org/release/add
// @include     *://musicbrainz.org/artist/*/split
// @include     *://*.musicbrainz.org/artist/*/split
// @downloadURL https://update.greasyfork.org/scripts/5687/MusicBrainz%3A%20Sort%20artists.user.js
// @updateURL https://update.greasyfork.org/scripts/5687/MusicBrainz%3A%20Sort%20artists.meta.js
// ==/UserScript==
// Hackish solution to re-sort artist credits. There's currently no (no known to
// me) option to preserve already associated artist data. Sorting is done by
// first removing all credits, resorting them and adding them again.
//**************************************************************************//
var mbz = mbz || {};

mbz.artist_sort = {
  btn: {
    down: '<button class="icon track-down artist_sort MBZ-ArtistSort" '
      + 'type="button"></button>',
    up: '<button class="icon track-up artist_sort MBZ-ArtistSort" '
      + 'type="button"></button>'
  },
  notice: '<b>Notice:</b> When sorting artists you\'ll have '
      + 'to lookup all associations already made again.'
};

mbz.artist_sort.BubbleEditor = function() {};
mbz.artist_sort.BubbleEditor.prototype = {
  /**
    * Executes the sorting.
    */
  _doSort: function(api, idx, dir) {
    this.rewriteRows(api, this.moveRow(this._scanRowData(api), idx, dir));
  },

  /**
    * Extract data from each artist credit table row.
    */
  _scanRowData: function(api) {
    var rowsData = [];
    var rows = api.getCreditRows();
    if (rows.length > 1) {
      $.each(rows, function(idx) {
        // collect row data
        var inputs = api.getCreditInputs($(this));
        if (inputs.length == 3) {
          // mb-artist, artist-credit, join phrase
          rowsData.push([inputs[0].val(), inputs[1].val(),
            inputs[2].val()]);
        } else {
          console.err("Error scanning artist credits: inputs not found.");
        }
      });
    }
    return rowsData;
  },

  /**
    * Re-writes row data to move a data row up or down.
    * @rowsData current row data array
    *	@idx Row index to move
    * @dir >0 move down, <0 move up
    * @return new row data array
    */
  moveRow: function(rowsData, idx, dir) {
    var newRowData = null;

    if (dir > 0 && idx < rowsData.length -1) { // down
      newRowData = this.swapRows(rowsData, idx, idx + 1);
    } else if (dir < 0 && idx > 0){ // up
      newRowData = this.swapRows(rowsData, idx, idx - 1);
    }

    if (newRowData && newRowData.length > 0) {
      return newRowData;
    }

    return [];
  },

  /**
    * Removes all rows from the editor and add all new ones with the updated
    *	data.
    * @bubbleApi MBZ Bubble API to use for calls
    * @rowData new row data to write
    */
  rewriteRows: function(bubbleApi, rowData) {
    if (rowData.length > 0) {
      // get current rows..
      var rows = bubbleApi.getCreditRows();
      // add a new empty one, that will survive, else any data may be still set
      bubbleApi.addArtist("", true);
      // remove all previous credits, but the last one will survive
      $.each(bubbleApi.getCreditRows(), function(){
        bubbleApi.removeArtist(this); // remove by row
      });
      // add as many rows as we need
      for (var i=0; i < rowData.length; i++) {
        bubbleApi.addArtist(rowData[i], true);
      }
    }
  },

  /**
    * Swap position of two rows.
    * @rowsData current row data array
    * @indexA first row to swap
    * @indexB second row to swap
    * @return row data array with the two rows position swapped
    */
  swapRows: function(rowsData, idxA, idxB) {
    var newRowData = [];
    for (var idx in rowsData) {
      if (idx == idxA) {
        newRowData[idx] = rowsData[idxB];
      } else if (idx == idxB) {
        newRowData[idx] = rowsData[idxA];
      } else {
        newRowData[idx] = rowsData[idx];
      }
    }

    // switch join phrases
    var joinA = newRowData[idxA][2];
    var joinB = newRowData[idxB][2];
    newRowData[idxA][2] = joinB;
    newRowData[idxB][2] = joinA;

    return newRowData;
  }
};

/**
  * Access the artists bubble editor.
  */
mbz.artist_sort.ArtistBubbleEditor = function() {
  var b = null;
  var initialized = false;
  var self = this;

  /**
    * Executes the sorting.
    */
  function doSort(idx, dir) {
    self._doSort.call(self, MBZ.BubbleEditor.ArtistCredits, idx, dir);
  };

  this.init = function(bubble) {
    if (initialized) {
      return;
    }
    if (bubble.length == 0) {
      console.debug("Credits bubble not found.");
      return;
    }
    initialized = true;
    b = bubble;

    b.on('click', 'button.MBZ-ArtistSort', function(){
      var btn = $(this);
      var idx = btn.data('idx');
      if (typeof idx !== 'undefined' && idx != null) {
        if (btn.hasClass('track-up')) {
          doSort(idx, -1);
          return false;
        } else if (btn.hasClass('track-down')) {
          doSort(idx, 1);
          return false;
        }
      }
    });

    var notice = $(b.find('p').get(0));
    notice.after('<p>' + mbz.artist_sort.notice + '</p>');
  };

  /**
    * Attach sort buttons to each data row.
    */
  this.attachSortButtons = function() {
    var rows = MBZ.BubbleEditor.ArtistCredits.getCreditRows();

    if (rows.length > 1) {
      var self = this;
      $.each(rows, function(idx) {
        var cell = $(this).children('td').first().find('label');
        if (cell.find('button.artist_sort').length == 0) {
          var btnUp = $(mbz.artist_sort.btn.up);
          var btnDown = $(mbz.artist_sort.btn.down);
          btnUp.data('idx', idx);
          btnDown.data('idx', idx);
          cell.prepend(btnUp);
          cell.prepend(btnDown);
        }
      });
    }
  };

  MBZ.BubbleEditor.ArtistCredits.onAppear({cb: self.init});
  MBZ.BubbleEditor.ArtistCredits.onContentChange({cb: self.attachSortButtons});
};
mbz.artist_sort.ArtistBubbleEditor.prototype =
  new mbz.artist_sort.BubbleEditor();

/**
  * Access the track artists bubble editor.
  */
mbz.artist_sort.TrackBubbleEditor = function() {
  var b = $('#track-ac-bubble');
  var rowsData = [];
  var initialized = false;
  var self = this;

  /**
    * Executes the sorting.
    */
  function doSort(idx, dir) {
    self._doSort.call(self, MBZ.BubbleEditor.TrackArtistCredits, idx, dir);
  };

  /**
    * Initialize the component.
    */
  function init() {
    if (initialized) {
      return;
    }
    initialized = true;
    b.find('thead').prepend('<tr><td colspan="4" style="padding-bottom:1em;">'
      + mbz.artist_sort.notice + '</td></tr>');

    b.on('click', 'button.MBZ-ArtistSort', function(){
      var btn = $(this);
      var idx = btn.data('idx');
      if (typeof idx !== 'undefined' && idx != null) {
        if (btn.hasClass('track-up')) {
          doSort(idx, -1);
          return false;
        } else if (btn.hasClass('track-down')) {
          doSort(idx, 1);
          return false;
        }
      }
    });
  };

  /**
    * Attach sort buttons to each data row.
    */
  this.attachSortButtons = function() {
    var rows = MBZ.BubbleEditor.TrackArtistCredits.getCreditRows();
    if (rows.length > 1) {
      $.each(rows, function(idx) {
        var cell = $($(this).find('td').get(3));
        if (cell.length == 1 && cell.find('button.MBZ-ArtistSort').length == 0) {
          var btnUp = $(mbz.artist_sort.btn.up);
          var btnDown = $(mbz.artist_sort.btn.down);
          btnUp.data('idx', idx);
          btnDown.data('idx', idx);
          cell.prepend(btnUp);
          cell.prepend(btnDown);
        }
      });
    }
  };

  MBZ.BubbleEditor.TrackArtistCredits.onContentChange({
    cb: this.attachSortButtons});
  init();
};
mbz.artist_sort.TrackBubbleEditor.prototype =
  new mbz.artist_sort.BubbleEditor();

/**
  * Initialize all required components.
  */
mbz.artist_sort.init = function() {
  var path = window.location.pathname;
  // artist bubble editor is always there
  new mbz.artist_sort.ArtistBubbleEditor();

  // release page has also a track bubble editor
  if (path.contains('/release/')) {
    // resize bubble slightly to make space for sort buttons
    MBZ.Html.addStyle('#release-editor #track-ac-bubble {width:61%;}');
    // track artist bubble editor
    new mbz.artist_sort.TrackBubbleEditor();
  }
}

mbz.artist_sort.init();
