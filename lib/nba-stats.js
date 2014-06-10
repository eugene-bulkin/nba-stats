/*
 * nba-stats
 * https://github.com/eugene-bulkin/nba-stats
 *
 * Copyright (c) 2014 Eugene Bulkin
 * Licensed under the MIT license.
 */

'use strict';

var Promise = require('bluebird');
var fuzzy = require('fuzzy');
var request = Promise.promisify(require('request'));
var extend = require('util')._extend;
var qs = require('querystring');

var requestJSON = function() {
  return request.apply(null, arguments).spread(function(response, body) {
    return JSON.parse(body);
  });
};

var zipHeaders = function(headers, array) {
  var obj = {};
  // nulls are ignored
  headers.forEach(function(key, i) {
    if(key) {
      obj[key] = array[i];
    }
  });
  return obj;
};

var NBA = (function() {
  var allPlayers, playerHash = {};
  var currentSeason = (function() {
    var date = new Date();
    var curYear = date.getFullYear(), curMonth = date.getMonth() + 1;
    // season usually starts in October; if we're past October, it's the
    // next season
    if(curMonth >= 10) {
      curYear += 1;
    }
    return (curYear - 1) + '-' + (curYear % 100);
  })();
  var retrievePlayers = function() {
    var url = 'http://stats.nba.com/stats/commonallplayers/?LeagueID=00&Season=' + currentSeason + '&IsOnlyCurrentSeason=0';
    return requestJSON({
      url: url,
      headers: {
        'User-Agent': 'Node NBA API'
      }
    }).then(function(json) {
      // default headers are json.resultSets[0], but those are annoying
      var headers = ['playerId', 'displayName', 'rosterStatus', 'fromSeason', 'toSeason', 'playerCode'];
      var players = json.resultSets[0].rowSet;
      allPlayers = players.map(function(player, i) {
        var obj = zipHeaders(headers, player);
        // do some extras, cleanup
        obj.fullName = obj.displayName.split(', ').reverse().join(' ');
        obj.active = Boolean(obj.rosterStatus);
        // turn to integers
        obj.fromSeason *= 1;
        obj.toSeason *= 1;
        delete obj.rosterStatus;
        delete obj.displayName;
        return obj;
      });
    });
  };
  var listPlayers = function(onlyActive) {
    if (!allPlayers) {
      return retrievePlayers().then(function() {
        return listPlayers(onlyActive);
      });
    }
    if(onlyActive) {
      return Promise.resolve(allPlayers.filter(function(player) { return player.active; }));
    }
    return Promise.resolve(allPlayers);
  };
  var findPlayer = function(query, includeInactive) {
    if (!allPlayers) {
      return retrievePlayers().then(function() {
        return findPlayer(query, includeInactive);
      });
    }
    return listPlayers(!includeInactive).then(function(players) {
      // searching by name
      if(typeof query === 'string') {
        // drop to lower case for less annoyance
        query = query.trim().toLowerCase();
        var querySplit = query.split(',');
        if(querySplit.length > 1) {
          // comma separated name, so turn into full name
          query = querySplit.reverse().join(' ').trim();
        }
        return players.filter(function(player) {
          return fuzzy.test(query, player.fullName.toLowerCase());
        }).pop();
      } else {
        // searching by player ID
        return players.filter(function(player) {
          return player.playerId === query;
        }).pop();
      }
    });
  };
  var defaultStatOptions = {
    basic: true,
    advanced: false
  };
  var generateStatParams = function(options) {
    var defaultParams = {
      "Season": currentSeason,
      "SeasonType": "Regular Season",
      "LeagueID": "00",
      "PlayerID": "",
      "MeasureType": "Base",
      "PerMode": "PerGame",
      "PlusMinus": "N",
      "PaceAdjust": "N",
      "Rank": "N",
      "Outcome": "",
      "Location": "",
      "Month": "0",
      "SeasonSegment": "",
      "DateFrom": "",
      "DateTo": "",
      "OpponentTeamID": "0",
      "VsConference": "",
      "VsDivision": "",
      "GameSegment": "",
      "Period": "0",
      "LastNGames": "0"
    };
    return extend(defaultParams, options);
  };
  var getStats = function(player, options) {
    if (!allPlayers) {
      return retrievePlayers().then(function() {
        return getStats(player, options);
      });
    }
    var opts = extend({}, defaultStatOptions);
    opts = extend(opts, options);
    var pid;
    if(typeof player === 'object') {
      // player object
      pid = Promise.resolve(player.playerId);
    } else if(typeof player === 'number') {
      pid = Promise.resolve(player);
    } else {
      pid = findPlayer(player, true).then(function(player) { return player.playerId; });
    }

    return pid.then(function(playerId) {
      console.log('http://stats.nba.com/stats/playerdashboardbygeneralsplits?' + qs.stringify(generateStatParams({ 'PlayerID': playerId })));
      console.log('http://stats.nba.com/stats/commonplayerinfo/?playerID=' + playerId);
    });
  };
  return {
    findPlayer: findPlayer,
    listPlayers: listPlayers,
    getStats: getStats
  };
})();

module.exports = NBA;
