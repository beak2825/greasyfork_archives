
/*
// ==UserScript==
// @name        bog
// @namespace   BOG
// @version     1.1
// @description ぼけおめ大リーグ 昇格/残留/降格の自動チェック
// @include     /http://2\.pro\.tok2\.com/(~|%7E)reflection/league\d+/vote\.cgi.*$/
// @run-at      document-end
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore.js
// @downloadURL https://update.greasyfork.org/scripts/8092/bog.user.js
// @updateURL https://update.greasyfork.org/scripts/8092/bog.meta.js
// ==/UserScript==
 */

(function() {
  var CharacteristicNamesManager, Color, EndResultPageManager, InterimResultPageManager, LeagueConfig, LeagueConfig1A, LeagueConfig2A, LeagueConfig3A, LeagueConfigMajor, Player, PlayersManager, Progress, Range, ResultPageManager, getLeagueConfig, getLeagueId, getProgress, main,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  Player = (function() {
    function Player(_at_name) {
      this.name = _at_name;
      this.scores = [];
      this.rank = null;
    }

    Player.prototype.addScore = function(score) {
      return this.scores.push(score);
    };

    return Player;

  })();

  PlayersManager = (function() {
    function PlayersManager() {
      this.players = [];
    }

    PlayersManager.prototype.addScore = function(name, score) {
      var player;
      player = _.findWhere(this.players, {
        name: name
      });
      if (!player) {
        player = new Player(name);
        this.players.push(player);
      }
      return player.addScore(parseInt(score, 10));
    };

    PlayersManager.prototype.getPlayers = function() {
      var maxScores;
      maxScores = _.map(this.players, function(player) {
        return _.max(player.scores);
      });
      maxScores.sort(function(a, b) {
        return b - a;
      });
      _.each(this.players, function(player) {
        return player.rank = _.indexOf(maxScores, _.max(player.scores));
      });
      return this.players;
    };

    return PlayersManager;

  })();

  CharacteristicNamesManager = (function() {
    function CharacteristicNamesManager() {
      localStorage.characteristicNames = localStorage.characteristicNames || JSON.stringify([]);
    }

    CharacteristicNamesManager.prototype.toggle = function(name) {
      var names;
      names = JSON.parse(localStorage.characteristicNames);
      if (_.contains(names, name)) {
        names = _.without(names, name);
      } else {
        names.push(name);
      }
      return localStorage.characteristicNames = JSON.stringify(names);
    };

    CharacteristicNamesManager.prototype.getNames = function() {
      return JSON.parse(localStorage.characteristicNames);
    };

    return CharacteristicNamesManager;

  })();

  Range = (function() {
    function Range(_at_begin, _at_end, _at_color) {
      this.begin = _at_begin;
      this.end = _at_end;
      this.color = _at_color;
    }

    return Range;

  })();

  Color = (function() {
    function Color() {}

    Color.promotion = "#ff99ff";

    Color.stay = "#99cc00";

    Color.demotion = "#66ccff";

    Color.characteristic = "#ffd900";

    return Color;

  })();

  Progress = (function() {
    function Progress() {}

    Progress.unexpected = 0;

    Progress.interim = 1;

    Progress.end = 2;

    return Progress;

  })();

  ResultPageManager = (function() {
    function ResultPageManager(_at_leagueConfig) {
      this.leagueConfig = _at_leagueConfig;
    }

    ResultPageManager.prototype.extractRankTable = function() {};

    ResultPageManager.prototype.extractRankRows = function() {
      var rankTable;
      rankTable = this.extractRankTable();
      return _.filter($(rankTable).find("tr"), function(tr) {
        var regexp;
        regexp = /^\d+位$/;
        return regexp.test($(tr).find("td").eq(0).text());
      });
    };

    ResultPageManager.prototype.extractName = function(row) {};

    ResultPageManager.prototype.extractScore = function(row) {};

    ResultPageManager.prototype.extractPlayers = function() {
      var playersManager, rows;
      playersManager = new PlayersManager;
      rows = this.extractRankRows();
      _.each(rows, (function(_this) {
        return function(row) {
          var name, score;
          name = _this.extractName(row);
          score = _this.extractScore(row);
          return playersManager.addScore(name, score);
        };
      })(this));
      return playersManager.getPlayers();
    };

    ResultPageManager.prototype.highlightRankTable = function() {
      var highlightedNames, players, ranges, rows;
      players = this.extractPlayers();
      rows = this.extractRankRows();
      ranges = this.leagueConfig.getRanges();
      highlightedNames = [];
      return _.each(rows, (function(_this) {
        return function(row) {
          var name, player, range;
          name = _this.extractName(row);
          if (!_.contains(highlightedNames, name)) {
            player = _.findWhere(players, {
              name: name
            });
            range = _.find(ranges, function(range) {
              return range.begin <= player.rank && player.rank < range.end;
            });
            _this.highlightRankRow(row, range.color);
            return highlightedNames.push(name);
          }
        };
      })(this));
    };

    ResultPageManager.prototype.highlightRankRow = function(row, color) {};

    ResultPageManager.prototype.characterizeRankTable = function(playersName) {
      var characterizedNames, rows;
      rows = this.extractRankRows();
      characterizedNames = [];
      return _.each(rows, (function(_this) {
        return function(row) {
          var name;
          name = _this.extractName(row);
          if (_.contains(playersName, name) && !_.contains(characterizedNames, name)) {
            _this.characterizeRankRow(row, Color.characteristic);
            return characterizedNames.push(name);
          }
        };
      })(this));
    };

    ResultPageManager.prototype.characterizeRankRow = function(row, color) {};

    ResultPageManager.prototype.setEvents = function() {};

    return ResultPageManager;

  })();

  InterimResultPageManager = (function(_super) {
    __extends(InterimResultPageManager, _super);

    function InterimResultPageManager(leagueConfig) {
      InterimResultPageManager.__super__.constructor.call(this, leagueConfig);
    }

    InterimResultPageManager.prototype.extractRankTable = function() {
      return _.find($("table"), function(table) {
        var regexp;
        regexp = /人が投票した時点での順位$/;
        return regexp.test($(table).find("tr").eq(0).find("td").eq(0).text());
      });
    };

    InterimResultPageManager.prototype.extractName = function(row) {
      return $(row).find("td").eq(5).text();
    };

    InterimResultPageManager.prototype.extractScore = function(row) {
      return parseInt($(row).find("td").eq(1).text(), 10);
    };

    InterimResultPageManager.prototype.highlightRankRow = function(row, color) {
      return $(row).find("td").css({
        backgroundColor: color
      });
    };

    InterimResultPageManager.prototype.characterizeRankRow = function(row, color) {
      return $(row).find("td").eq(5).css({
        backgroundColor: color
      });
    };

    InterimResultPageManager.prototype.setEvents = function() {
      var rows;
      rows = this.extractRankRows();
      return _.each(rows, (function(_this) {
        return function(row) {
          $(row).css({
            cursor: "pointer"
          });
          return $(row).on("click", function() {
            var cnm;
            cnm = new CharacteristicNamesManager;
            cnm.toggle(_this.extractName(row));
            _this.highlightRankTable();
            return _this.characterizeRankTable(cnm.getNames());
          });
        };
      })(this));
    };

    return InterimResultPageManager;

  })(ResultPageManager);

  EndResultPageManager = (function(_super) {
    __extends(EndResultPageManager, _super);

    function EndResultPageManager(leagueConfig) {
      EndResultPageManager.__super__.constructor.call(this, leagueConfig);
    }

    EndResultPageManager.prototype.extractRankTable = function() {
      return _.find($("table"), function(table) {
        var regexp;
        regexp = /終了日：\d{4}年\d{2}月\d{2}日\d{2}時$/;
        return regexp.test($(table).find("tr").eq(0).find("td").eq(0).text());
      });
    };

    EndResultPageManager.prototype.extractName = function(row) {
      var container, regexp;
      regexp = /^(?:\d+\/\d+\/\d+ 　\[一言\]　 )(.+)(?:さんの作品)$/;
      container = $(row).find("td").eq(2).find("div.SMALL1");
      return regexp.exec(container.text().trim())[1];
    };

    EndResultPageManager.prototype.extractScore = function(row) {
      return parseInt($(row).find("td").eq(1).text(), 10);
    };

    EndResultPageManager.prototype.highlightRankRow = function(row, color) {
      return $(row).find("td").eq(0).css({
        backgroundColor: color
      });
    };

    return EndResultPageManager;

  })(ResultPageManager);

  LeagueConfig = (function() {
    function LeagueConfig(_at_beginStay, _at_beginDemotion) {
      this.beginStay = _at_beginStay != null ? _at_beginStay : 5;
      this.beginDemotion = _at_beginDemotion != null ? _at_beginDemotion : 15;
    }

    LeagueConfig.prototype.getRanges = function() {
      var ranges;
      ranges = [];
      ranges.push(new Range(0, this.beginStay, Color.promotion));
      ranges.push(new Range(this.beginStay, this.beginDemotion, Color.stay));
      ranges.push(new Range(this.beginDemotion, Number.POSITIVE_INFINITY, Color.demotion));
      return ranges;
    };

    return LeagueConfig;

  })();

  LeagueConfigMajor = (function(_super) {
    __extends(LeagueConfigMajor, _super);

    function LeagueConfigMajor() {
      LeagueConfigMajor.__super__.constructor.call(this, 1, 10);
    }

    return LeagueConfigMajor;

  })(LeagueConfig);

  LeagueConfig3A = (function(_super) {
    __extends(LeagueConfig3A, _super);

    function LeagueConfig3A() {
      LeagueConfig3A.__super__.constructor.call(this, 5, 15);
    }

    return LeagueConfig3A;

  })(LeagueConfig);

  LeagueConfig2A = (function(_super) {
    __extends(LeagueConfig2A, _super);

    function LeagueConfig2A() {
      LeagueConfig2A.__super__.constructor.call(this, 5, 15);
    }

    return LeagueConfig2A;

  })(LeagueConfig);

  LeagueConfig1A = (function(_super) {
    __extends(LeagueConfig1A, _super);

    function LeagueConfig1A() {
      LeagueConfig1A.__super__.constructor.call(this, 10, 10);
    }

    return LeagueConfig1A;

  })(LeagueConfig);

  getLeagueId = function() {
    var matches;
    matches = location.href.match(/\/league(\d+)\//);
    if (matches !== null) {
      return parseInt(matches[1]);
    } else {
      return null;
    }
  };

  getLeagueConfig = function(leagueId) {
    switch (leagueId) {
      case 4:
        return new LeagueConfigMajor;
      case 3:
        return new LeagueConfig3A;
      case 2:
        return new LeagueConfig2A;
      case 1:
        return new LeagueConfig1A;
      default:
        return new LeagueConfig;
    }
  };

  getProgress = function() {
    var isEndResultPage, isInterimResultPage;
    isInterimResultPage = _.find($("table"), function(table) {
      var regexp;
      regexp = /人が投票した時点での順位$/;
      return regexp.test($(table).find("tr").eq(0).find("td").eq(0).text());
    });
    isEndResultPage = _.find($("table"), function(table) {
      var regexp;
      regexp = /終了日：\d{4}年\d{2}月\d{2}日\d{2}時$/;
      return regexp.test($(table).find("tr").eq(0).find("td").eq(0).text());
    });
    if (isInterimResultPage) {
      return Progress.interim;
    }
    if (isEndResultPage) {
      return Progress.end;
    }
    return Progress.unexpected;
  };

  main = function() {
    var leagueConfig, leagueId, resultPageManager;
    leagueId = getLeagueId();
    if (leagueId === null) {
      return;
    }
    leagueConfig = getLeagueConfig(leagueId);
    resultPageManager = null;
    switch (getProgress()) {
      case Progress.interim:
        resultPageManager = new InterimResultPageManager(leagueConfig);
        break;
      case Progress.end:
        resultPageManager = new EndResultPageManager(leagueConfig);
        break;
      default:
        resultPageManager = null;
    }
    if (resultPageManager === null) {
      return;
    }
    resultPageManager.highlightRankTable();
    resultPageManager.characterizeRankTable((new CharacteristicNamesManager).getNames());
    return resultPageManager.setEvents();
  };

  main();

}).call(this);
