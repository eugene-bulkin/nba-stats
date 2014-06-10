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
  var allPlayers;
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
      allPlayers = players.map(function(player) {
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
      // drop to lower case for less annoyance
      query = query.trim().toLowerCase();
      var querySplit = query.split(',');
      if(querySplit.length > 1) {
        // comma separated name, so turn into full name
        query = querySplit.reverse().join(' ').trim();
      }
      var result = players.filter(function(player) {
        return fuzzy.test(query, player.fullName.toLowerCase());
      });
      return result.pop();
    });
  };
  return {
    findPlayer: findPlayer,
    listPlayers: listPlayers
  };
})();

module.exports = NBA;
