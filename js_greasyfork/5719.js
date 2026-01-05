// ==UserScript==
// @name         InstaSynchP Settings
// @namespace    InstaSynchP
// @description  Provides the ability to store settings for the plugins
// @version      1.1.2
// @author       Zod-
// @source       https://github.com/Zod-/InstaSynchP-Settings
// @license      MIT
// @require      https://greasyfork.org/scripts/5647-instasynchp-library/code/code.js?version=49210
// @include      *://instasync.com/r/*
// @include      *://*.instasync.com/r/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/5719/InstaSynchP%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/5719/InstaSynchP%20Settings.meta.js
// ==/UserScript==

function SettingsField(opts) {
  'use strict';
  this.type = opts.type;
  this.label = opts.label || '';
  this.id = opts.id.replace(/ /g, '-');
  this.default = opts.default;
  this.title = opts.title || '';
  this.size = opts.size || 2;
  this.options = opts.options;
  this.section = opts.section || ['General'];
  this.disabled = opts.disabled || false;
  this.tooltipPlacement = opts.tooltipPlacement || 'top';
  this.destination = opts.destination || 'chat';
  this.hidden = opts.hidden || false;
  this.$div = $('<div>');
  this.$input = undefined;
  this.$tooltip = undefined;
  this.oldVal = undefined;
  this.val = undefined;
  this.init();
  this.buildDiv();
}

SettingsField.prototype.init = function () {
  'use strict';
  var _this = this;
  if (!window.localStorage.hasOwnProperty(_this.id)) {
    _this.setStorage(_this.default);
  }
  _this.getFromStorage();
  _this.oldVal = _this.val;
};

SettingsField.prototype.getFromStorage = function () {
  'use strict';
  var _this = this;
  var val = window.localStorage.getItem(_this.id);

  switch (_this.type) {
  case 'checkbox':
    val = (val === 'true');
    break;
  case 'int':
    val = Number(val);
    break;
  }

  _this.val = val;
};

SettingsField.prototype.updateDisplay = function (fromGUI) {
  'use strict';
  var _this = this;
  if (fromGUI) {
    return;
  }
  switch (_this.type) {
  case 'checkbox':
    _this.$input.prop('checked', _this.get());
    break;
  case 'int':
  case 'text':
  case 'select':
    _this.$input.val(_this.get());
    break;
  }
};

SettingsField.prototype.get = function () {
  'use strict';
  return this.val;
};

SettingsField.prototype.setStorage = function (val) {
  'use strict';
  var _this = this;

  switch (_this.type) {
  case 'checkbox':
    val = !!val;
    break;
  }

  window.localStorage.setItem(_this.id, val);
};

SettingsField.prototype.set = function (val, fromGUI) {
  'use strict';
  var _this = this;
  _this.oldVal = _this.val;
  _this.setStorage(val);
  _this.getFromStorage();
  _this.updateDisplay(fromGUI);
  if (_this.oldVal !== _this.val) {
    _this.onChange();
  }
};

SettingsField.prototype.onChange = function () {
  'use strict';
  events.fire('SettingChange[{0}]'.format(this.id), [this.oldVal, this.val]);
};

SettingsField.prototype.createTooltip = function () {
  'use strict';
  var _this = this;
  return $('<label>', {
    class: 'active_toolip',
    'data-original-title': _this.title,
    'data-placement': _this.tooltipPlacement
  }).tooltip();
};

SettingsField.prototype.createInput = function () {
  'use strict';
  var _this = this;
  switch (_this.type) {
  case 'checkbox':
    return _this.createCheckboxInput();
  case 'text':
  case 'int':
    return _this.createStringInput();
  case 'select':
    return _this.createSelectInput();
    //TODO remove when all types are implemented
  default:
    logger().warn(_this.name, 'settingtype not implemented yet ' + _this.type);
    _this.hidden = true;
  }
};

SettingsField.prototype.createSelectInput = function () {
  'use strict';
  var _this = this;
  _this.$div.addClass('instasync_settings_select');
  var $input = $('<select>', {
    id: 'instasyncp-settings-text-' + _this.id
  }).on('change', function () {
    _this.set($(this).val(), true);
  });
  _this.options.forEach(function (option) {
    $input.append(
      $('<option>').text(option)
    );
  });
  $input.val(_this.get());
  return $input;
};

SettingsField.prototype.createStringInput = function () {
  'use strict';
  var _this = this;
  _this.$div.addClass('instasync_settings_text');
  return $('<input>', {
    id: 'instasyncp-settings-text-' + _this.id,
    type: 'text'
  }).val(_this.get()).attr('size', _this.size).bind('input', function () {
    _this.set($(this).val(), true);
  });
};

SettingsField.prototype.createCheckboxInput = function () {
  'use strict';
  var _this = this;
  _this.$div.addClass('checkbox');
  return $('<input>', {
    id: 'instasyncp-settings-checkbox-' + _this.id,
    type: 'checkbox'
  }).prop('checked', _this.get()).change(function () {
    _this.set($(this).is(':checked'), true);
  });
};

SettingsField.prototype.setLabel = function (label) {
  'use strict';
  var _this = this;
  _this.label = label;
  _this.$input.detach();
  _this.$tooltip.empty().append(_this.$input).append(_this.label);
};

SettingsField.prototype.setTitle = function (title) {
  'use strict';
  var _this = this;
  _this.title = title;
  _this.$tooltip.attr('data-original-title', _this.title);
};

SettingsField.prototype.buildDiv = function () {
  'use strict';
  var _this = this;
  _this.$tooltip = _this.createTooltip();
  _this.$input = _this.createInput();
  if (_this.$input) {
    _this.$input.attr('disabled', _this.disabled);
  }
  _this.$div.append(_this.$tooltip.append(_this.$input).append(_this.label));
  if (_this.hidden) {
    _this.$div.hide();
  }
};

function Settings() {
  'use strict';
  this.version = '1.1.2';
  this.name = 'InstaSynchP Settings';
  this.fields = [];
  this.SettingsField = SettingsField;
  this.styles = [{
    name: 'instasync-settings',
    url: 'https://cdn.rawgit.com/Zod-/InstaSynchP-Settings/6a74f6d8b9351082e7c32459f5014fbd63a477b0/dist/settings.css',
    autoload: true
  }];
  this.destinations = {
    chat: '#tabs_chat_settings_content',
    playlist: '#tabs_playlist_settings',
    plugin: '#tabs_plugin_list_content'
  };
  this.settings = [{
    label: 'Interval to check for updates',
    title: 'The script will check for updates in the selected' +
      ' interval or on every refresh',
    id: 'update-timer',
    type: 'select',
    options: ['10m', '20m', '30m', '1h', 'on refresh'],
    'default': '30m',
    section: ['Plugins']
  }, {
    label: 'Autosync',
    id: 'instasync-autosync',
    type: 'checkbox',
    destination: 'playlist',
    'default': true,
    section: ['InstaSync']
  }, {
    label: 'Native YouTube controls',
    id: 'instasync-yt-controls',
    type: 'checkbox',
    destination: 'playlist',
    'default': false,
    section: ['InstaSync']
  }, {
    label: 'Show greynames in chat',
    id: 'instasync-greynames-chat',
    type: 'checkbox',
    'default': true,
    section: ['InstaSync']
  }, {
    label: 'Disable player',
    id: 'instasync-disable-player',
    type: 'checkbox',
    destination: 'playlist',
    'default': false,
    section: ['InstaSync']
  }];
  var temp = {
    InstaSync: {
      fields: []
    }
  };
  this.sections = {
    chat: JSON.parse(JSON.stringify(temp)),
    playlist: JSON.parse(JSON.stringify(temp)),
    plugin: JSON.parse(JSON.stringify(temp))
  };
  this.pluginNames = {
    'Core': ['Core', 'Event Hooks', 'CSSLoader', 'Settings', 'Commands',
      'Logger'
    ],
    'Chat': ['ModSpy', 'UserSpy', 'Input History', 'Autocomplete',
      'Emote Names', 'Name Completion', 'SysMessage Hide', 'Timestamp'
    ],
    'General': ['Layouts', 'Poll Menu', 'Bibby'],
    'Commands': ['Bump', 'TrimWall'],
    'Playlist': ['Wallcounter', 'History']
  };
  this.plugins = [];
  this.updateIntervalId = undefined;
}

Settings.prototype.removeInstaSyncSettings = function () {
  'use strict';
  $('#toggle_greyname_chat').parent().parent().remove();
  $('#toggle_show_joined').parent().parent().remove();
  $('#toggleYTcontrols_box').parent().parent().remove();
  $('#toggle_autosync_box').parent().parent().remove();
};

Settings.prototype.postConnect = function () {
  'use strict';
  var _this = this;
  window.room.autosync = _this.get('instasync-autosync');
  window.room.showYTcontrols = _this.get('instasync-yt-controls');
  window.room.filterGreyname = !_this.get('instasync-greynames-chat');
  window.room.playerDisabled = _this.get('instasync-disable-player');
  reloadPlayer();
};

Settings.prototype.preConnect = function () {
  'use strict';
  var _this = this;
  $('#disable_player').remove();
  $('#reload_btn').off().on('click', function () {
    if (!_this.get('instasync-disable-player')) {
      reloadPlayer();
    } else {
      _this.set('instasync-disable-player', false);
    }
  });
};

Settings.prototype.createResetButtons = function () {
  'use strict';
  var _this = this;
  var $resetButton = $('<button>', {
    id: 'instasyncp-settings-reset',
    class: 'btn btn-xs btn-danger btn-primary',
    title: 'Reset the settings in this tab'
  }).text('Reset InstaSyncP Settings');
  Object.keys(_this.destinations).forEach(function (destination) {
    $(_this.destinations[destination]).append(
      $resetButton.clone().click(function () {
        _this.reset(destination);
      }).tooltip()
    );
  });
  $(_this.destinations.plugin).append(
    $('<button>', {
      id: 'instasyncp-settings-refresh',
      class: 'btn btn-xs btn-danger btn-primary',
      title: 'Apply changes by reloading the page'
    }).text('Apply Changes (Refresh)').click(function () {
      location.reload();
    }).tooltip()
  );
};

Settings.prototype.createFields = function () {
  'use strict';
  var _this = this;
  var newFields = {};
  _this.fields.forEach(function (field) {
    field = new _this.SettingsField(field);
    newFields[field.id] = field;
    _this.addToSection(field);
  });
  _this.sortSections();
  _this.fields = newFields;
};

Settings.prototype.forEachDestination = function (callback) {
  'use strict';
  var _this = this;
  Object.keys(_this.sections).forEach(function (destinationName) {
    callback({
      name: destinationName,
      value: _this.sections[destinationName]
    });
  });
};

Settings.prototype.forEachSection = function (callback) {
  'use strict';
  var _this = this;
  _this.forEachDestination(function (destinationPair) {
    Object.keys(destinationPair.value).forEach(function (sectionName) {
      callback(destinationPair, {
        name: sectionName,
        value: destinationPair.value[sectionName]
      });
    });
  });
};

Settings.prototype.forEachField = function (callback) {
  'use strict';
  var _this = this;
  _this.forEachSection(function (destinationPair, sectionPair) {
    sectionPair.value.fields.forEach(function (field) {
      callback(destinationPair, sectionPair, field);
    });
  });
};

Settings.prototype.sortSections = function () {
  'use strict';
  var _this = this;
  _this.forEachSection(function (destination, section) {
    section.value.fields.sort(function (field, otherField) {
      return field.label.localeCompare(otherField.label);
    });
  });
};

Settings.prototype.addToSection = function (field) {
  'use strict';
  var _this = this;
  if (field.hidden) {
    return;
  }
  var sectionName = field.section[1] || field.section[0];
  var destination = _this.sections[field.destination];
  if (!destination.hasOwnProperty(sectionName)) {
    destination[sectionName] = {
      fields: []
    };
  }
  destination[sectionName].fields.push(field);
};

Settings.prototype.addFieldsToSite = function () {
  'use strict';
  var _this = this;
  _this.forEachField(function (destinationPair, sectionPair, field) {
    var destinationSelector = _this.destinations[destinationPair.name];
    if (!sectionPair.value.isCreated) {
      $(destinationSelector).append(
        $('<div>', {
          class: 'instasync_settings_section'
        }).text(sectionPair.name)
      );
      sectionPair.value.isCreated = true;
    }

    $(destinationSelector).append(field.$div);
  });
};

Settings.prototype.createPluginTab = function () {
  'use strict';
  var $navTab = createNavTab({
    tooltip: 'Plugins',
    tooltipPlacement: 'top',
    tab: '#tabs_plugin_list_content',
    class: 'fa fa-plug'
  });
  $navTab.find('i').before(
    $('<span>', {
      class: 'badge unread-msg-count updates'
    })
  );
  $('.chat-tabs').append($navTab);
  $('.chat-tabs-content').append(
    $('<div>', {
      class: 'tab-pane',
      id: 'tabs_plugin_list_content'
    })
  );
};

Settings.prototype.createPluginFields = function () {
  'use strict';
  var _this = this;
  Object.keys(_this.pluginNames).forEach(function (sectionName) {
    var section = _this.pluginNames[sectionName];
    section.forEach(function (pluginName, index) {
      var id;
      var disabled = false;
      if (sectionName === 'Commands') {
        id = 'InstaSynchP {0} Command'.format(pluginName);
      } else {
        id = 'InstaSynchP {0}'.format(pluginName);
      }
      if (sectionName === 'Core') {
        disabled = true;
      }
      _this.pluginNames[sectionName][index] = id;
      _this.fields.push({
        id: id,
        label: pluginName,
        type: 'checkbox',
        destination: 'plugin',
        disabled: disabled,
        'default': true,
        section: [sectionName]
      });
    });
    _this.plugins = _this.plugins.concat(_this.pluginNames[sectionName]);
  });
  _this.fields.push({
    id: 'plugins-count',
    type: 'int',
    hidden: true,
    'default': _this.plugins.length
  });
};

Settings.prototype.disablePlugins = function () {
  'use strict';
  var _this = this;
  Object.keys(window.plugins).forEach(function (pluginName) {
    var plugin = window.plugins[pluginName];
    plugin.enabled = _this.get(plugin.name.replace(/ /g, '-'), true);
  });
};

Settings.prototype.collectSettings = function () {
  'use strict';
  var _this = this;
  Object.keys(window.plugins).forEach(function (pluginName) {
    var plugin = window.plugins[pluginName];
    if (Array.isArray(plugin.settings)) {
      _this.fields = _this.fields.concat(plugin.settings);
    }
    if (Array.isArray(plugin.styles)) {
      plugin.styles.forEach(function (style) {
        _this.fields.push({
          label: '',
          id: style.name + '-css-content',
          type: 'text',
          hidden: true,
          value: '',
          section: ['Core']
        });
        _this.fields.push({
          label: '',
          id: style.name + '-css-url',
          type: 'text',
          hidden: true,
          value: '',
          section: ['Core']
        });
        events.on(plugins.cssLoader, 'ExecuteOnce', function () {
          plugins.cssLoader.addStyle(style);
        });
      });
    }
  });
};

Settings.prototype.persistentSettings = function () {
  'use strict';
  var _this = this;
  events.on(_this, 'SettingChange[instasync-autosync]', function (ig, v) {
    window.room.autosync = v;
    if (v) {
      sendcmd('resynch');
    }
  });
  events.on(_this, 'SettingChange[instasync-yt-controls]', function (ig, v) {
    window.room.showYTcontrols = v;
    reloadPlayer();
  });
  events.on(_this, 'SettingChange[instasync-greynames-chat]', function (ig, v) {
    window.room.filterGreyname = !v;
  });
  events.on(_this, 'SettingChange[instasync-disable-player]', function (ig, v) {
    window.room.playerDisabled = v;
    if (v) {
      $('#media').html('');
    } else {
      reloadPlayer();
    }
  });
};

Settings.prototype.executeOnce = function () {
  'use strict';
  var _this = this;

  function startTimer(timeString) {
    if (_this.updateIntervalId) {
      clearInterval(_this.updateIntervalId);
      _this.updateIntervalId = undefined;
    }
    if (timeString === 'on refresh') {
      return;
    }
    _this.updateIntervalId = setInterval(function () {
      _this.searchPluginUpdates();
    }, getTime(timeString) * 1000);
  }

  events.on(_this, 'SettingChange[update-timer]', function (ignore, newVal) {
    _this.searchPluginUpdates();
    startTimer(newVal);
  });

  startTimer(_this.get('update-timer'));
};

Settings.prototype.searchPluginUpdates = function () {
  'use strict';
  var _this = this;
  var updatesCount = 0;
  if (_this.get('plugins-count') !== _this.plugins.length) {
    updatesCount += Math.abs(_this.get('plugins-count') - _this.plugins.length);
    _this.set('plugins-count', _this.plugins.length);
  }

  function done() {
    if (updatesCount > 0) {
      $('.updates').text(updatesCount);
    }
  }

  function updateLabel(data) {
    if (!_this.plugins.contains(data.name)) {
      return;
    }
    var url = data.url;
    var label = '';
    var name = '';
    var install = '';
    var version = '';
    var info = '';
    var feedback = '';
    var plugin = {};
    Object.keys(window.plugins).forEach(function (pluginName) {
      var p = window.plugins[pluginName];
      if (p.name === data.name) {
        plugin = p;
      }
    });
    name = data.name.replace(/^InstaSynchP/i, '')
      .replace(/Command$/i, '').trim();
    install = ('<a class="install_link links"' +
        ' href="{0}/{1}" target="_blank">{2}</a>')
      .format(url, 'code.user.js');
    info = ('<a class="info_link links"  href="{0}"' +
      ' target="_blank">info</a>').format(url);
    feedback = ('<a class="feedback_link links" href="{0}/{1}"' +
      ' target="_blank">{1}</a>').format(url, 'feedback');

    if (plugin.version) {
      version = '<span class="{1} version_link links">v{0}</span>'
        .format(plugin.version, '{0}');
      if (plugin.version === data.version) {
        install = '';
        version = version.format('current_version_link');
      } else {
        updatesCount += 1;
        install = install.format('', '', 'update');
        version = version.format('outdated_version_link');
      }
    } else {
      install = install.format('', '', 'install');
    }
    if (_this.pluginNames.Core.contains(data.name) && name !== 'Core') {
      install = '';
    }

    label = '{0} {1} {2} {3} {4}'
      .format(name, version, install, info, feedback).replace(/\s+/, ' ');

    _this.fields[data.name.replace(/ /g, '-')].setLabel(label);
    _this.fields[data.name.replace(/ /g, '-')].setTitle(data.description);
  }


  $.getJSON('https://greasyfork.org/en/scripts.json?set=1666', function (data) {
    data.forEach(function (plugin) {
      updateLabel(plugin);
    });
    done();
  });
};

Settings.prototype.executeOnceCore = function () {
  'use strict';
  var _this = this;
  _this.collectSettings();
  _this.removeInstaSyncSettings();
  _this.persistentSettings();
  _this.createPluginTab();
  _this.createPluginFields();
  _this.createResetButtons();
  _this.createFields();
  _this.addFieldsToSite();
  _this.disablePlugins();
  _this.searchPluginUpdates();

  $('#tabs_playlist_settings').append(
    $('#tabs_playlist_settings .mod-control').detach()
  );
};

Settings.prototype.reset = function (destination) {
  'use strict';
  this.forEachField(function (destinationPair, sectionPair, field) {
    if (destinationPair.name === destination && !field.hidden) {
      field.set(field.default);
    }
  });
};

Settings.prototype.log = function (opts) {
  'use strict';
  var args = [];
  opts.type = opts.type || 'debug';
  args.push(this.name);
  args.push(opts.event);
  logger()[opts.type].apply(logger(), args);
};

Settings.prototype.get = function (id, fallback) {
  'use strict';
  var _this = this;
  if (!_this.fields.hasOwnProperty(id)) {
    _this.log({
      event: 'getting a setting that does not exist ' + id,
      type: 'warn'
    });
    return fallback;
  }
  return _this.fields[id].get();
};

Settings.prototype.set = function (id, newVal) {
  'use strict';
  var _this = this;
  if (_this.fields.hasOwnProperty(id)) {
    _this.fields[id].set(newVal);
  } else {
    _this.log({
      event: 'setting a setting that does not exist ' + id,
      type: 'warn'
    });
  }
};

Settings.prototype.save = function () {
  'use strict';
};

window.plugins = window.plugins || {};
window.plugins.settings = new Settings();
//TODO remove after removing references in other plugins
window.gmc = window.plugins.settings;
