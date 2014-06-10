/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var NBA = require('../lib/nba-stats.js');
var assert = require('assert');
var Promise = require('bluebird');

describe('Player Search', function(done) {
  this.timeout(5000);
  var correctObjects = {
    lebron: {
      playerId: 2544,
      fromSeason: 2003,
      toSeason: 2013,
      playerCode: 'lebron_james',
      fullName: 'LeBron James',
      active: true
    },
    noah: {
      playerId: 201149,
      fromSeason: 2007,
      toSeason: 2013,
      playerCode: 'joakim_noah',
      fullName: 'Joakim Noah',
      active: true
    },
    dragic: {
      playerId: 201609,
      fromSeason: 2008,
      toSeason: 2013,
      playerCode: 'goran_dragic',
      fullName: 'Goran Dragic',
      active: true
    },
    hakeem: {
      playerId: 165,
      fromSeason: 1984,
      toSeason: 2002,
      playerCode: 'HISTADD_hakeem_olajuwon',
      fullName: 'Hakeem Olajuwon',
      active: false
    },
    barkley: {
      playerId: 787,
      fromSeason: 1984,
      toSeason: 1999,
      playerCode: 'HISTADD_charles_barkley',
      fullName: 'Charles Barkley',
      active: false
    },
    jordan: {
      playerId: 893,
      fromSeason: 1984,
      toSeason: 2002,
      playerCode: 'HISTADD_michael_jordan',
      fullName: 'Michael Jordan',
      active: false
    }
  };
  it('Should find a player based on full name (FirstName LastName)', function(done) {
    Promise.all([
      NBA.findPlayer('LeBron James').then(function(player) {
        assert.deepEqual(player, correctObjects.lebron);
      }),
      NBA.findPlayer('Joakim Noah').then(function(player) {
        assert.deepEqual(player, correctObjects.noah);
      }),
      NBA.findPlayer('Goran Dragic').then(function(player) {
        assert.deepEqual(player, correctObjects.dragic);
      })
    ]).done(function() {
      done();
    });
  });
  it('Should find a player based on full name (LastName, FirstName)', function(done) {
    Promise.all([
      NBA.findPlayer('James, LeBron').then(function(player) {
        assert.deepEqual(player, correctObjects.lebron);
      }),
      NBA.findPlayer('Noah, Joakim').then(function(player) {
        assert.deepEqual(player, correctObjects.noah);
      }),
      NBA.findPlayer('Dragic, Goran').then(function(player) {
        assert.deepEqual(player, correctObjects.dragic);
      })
    ]).done(function() {
      done();
    });
  });
  it('Should find a retired player based on full name (FirstName LastName)', function(done) {
    Promise.all([
      NBA.findPlayer('Hakeem Olajuwon', true).then(function(player) {
        assert.deepEqual(player, correctObjects.hakeem);
      }),
      NBA.findPlayer('Charles Barkley', true).then(function(player) {
        assert.deepEqual(player, correctObjects.barkley);
      }),
      NBA.findPlayer('Michael Jordan', true).then(function(player) {
        assert.deepEqual(player, correctObjects.jordan);
      })
    ]).done(function() {
      done();
    });
  });
  it('Should find a retired player based on full name (LastName, FirstName)', function(done) {
    Promise.all([
      NBA.findPlayer('Olajuwon, Hakeem', true).then(function(player) {
        assert.deepEqual(player, correctObjects.hakeem);
      }),
      NBA.findPlayer('Barkley, Charles', true).then(function(player) {
        assert.deepEqual(player, correctObjects.barkley);
      }),
      NBA.findPlayer('Jordan, Michael', true).then(function(player) {
        assert.deepEqual(player, correctObjects.jordan);
      })
    ]).done(function() {
      done();
    });
  });
  it('Should find players based on player ID', function(done) {
    Promise.all([
      NBA.findPlayer(2544).then(function(player) {
        assert.deepEqual(player, correctObjects.lebron);
      }),
      NBA.findPlayer(201149).then(function(player) {
        assert.deepEqual(player, correctObjects.noah);
      }),
      NBA.findPlayer(201609).then(function(player) {
        assert.deepEqual(player, correctObjects.dragic);
      })
    ]).done(function() {
      done();
    });
  });
});

describe('Retrieving statistics', function(done) {
  var player;
  before(function(done) {
      NBA.findPlayer('LeBron James').then(function(p) {
        player = p;
      }).done(done);
  });
  describe('Should retrieve full regular statistics...', function(done) {
    it('From full player object', function(done) {
      NBA.getStats(player).then(function(stats) {
        console.log(stats, player);
      }).done(done);
    });
  });
});