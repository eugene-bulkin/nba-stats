/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var NBA = require('../lib/nba-stats.js');
var assert = require('assert');
var Promise = require('bluebird');

var correctObjects = require('./correctStats.json');

describe('Retrieving statistics', function(done) {
  this.timeout(5000);
  var player;
  before(function(done) {
      NBA.findPlayer('LeBron James').then(function(p) {
        player = p;
      }).done(done);
  });
  describe('Should retrieve full regular statistics...', function(done) {
    it('...from full player object', function(done) {
      NBA.getStats(player).then(function(stats) {
        stats.profile.birthdate = stats.profile.birthdate.toString();
        assert.deepEqual(stats.profile, correctObjects.lebronRegular.profile);
        assert.deepEqual(stats.basicStats, correctObjects.lebronRegular.basicStats);
        assert.strictEqual(stats.advancedStats, undefined);
      }).done(done);
    });
    it('...from player id', function(done) {
      NBA.getStats(2544).then(function(stats) {
        stats.profile.birthdate = stats.profile.birthdate.toString();
        assert.deepEqual(stats.profile, correctObjects.lebronRegular.profile);
        assert.deepEqual(stats.basicStats, correctObjects.lebronRegular.basicStats);
        assert.strictEqual(stats.advancedStats, undefined);
      }).done(done);
    });
    it('...from player name', function(done) {
      NBA.getStats('Lebron James').then(function(stats) {
        stats.profile.birthdate = stats.profile.birthdate.toString();
        assert.deepEqual(stats.profile, correctObjects.lebronRegular.profile);
        assert.deepEqual(stats.basicStats, correctObjects.lebronRegular.basicStats);
        assert.strictEqual(stats.advancedStats, undefined);
      }).done(done);
    });
  });
  describe('Should retrieve only points...', function(done) {
    it('...from full player object', function(done) {
      NBA.getStats(player, { basic: ['PTS'] }).then(function(stats) {
        stats.profile.birthdate = stats.profile.birthdate.toString();
        assert.deepEqual(stats.profile, correctObjects.lebronPts.profile);
        assert.deepEqual(stats.basicStats, correctObjects.lebronPts.basicStats);
        assert.strictEqual(stats.advancedStats, undefined);
      }).done(done);
    });
    it('...from player id', function(done) {
      NBA.getStats(2544, { basic: ['PTS'] }).then(function(stats) {
        stats.profile.birthdate = stats.profile.birthdate.toString();
        assert.deepEqual(stats.profile, correctObjects.lebronPts.profile);
        assert.deepEqual(stats.basicStats, correctObjects.lebronPts.basicStats);
        assert.strictEqual(stats.advancedStats, undefined);
      }).done(done);
    });
    it('...from player name', function(done) {
      NBA.getStats('Lebron James', { basic: ['PTS'] }).then(function(stats) {
        stats.profile.birthdate = stats.profile.birthdate.toString();
        assert.deepEqual(stats.profile, correctObjects.lebronPts.profile);
        assert.deepEqual(stats.basicStats, correctObjects.lebronPts.basicStats);
        assert.strictEqual(stats.advancedStats, undefined);
      }).done(done);
    });
  });
  describe('Should retrieve full advanced statistics...', function(done) {
    it('...from full player object', function(done) {
      NBA.getStats(player, { advanced: true }).then(function(stats) {
        stats.profile.birthdate = stats.profile.birthdate.toString();
        assert.deepEqual(stats.profile, correctObjects.lebronAdvanced.profile);
        assert.deepEqual(stats.basicStats, correctObjects.lebronAdvanced.basicStats);
        assert.deepEqual(stats.advancedStats, correctObjects.lebronAdvanced.advancedStats);
      }).done(done);
    });
    it('...from player id', function(done) {
      NBA.getStats(2544, { advanced: true }).then(function(stats) {
        stats.profile.birthdate = stats.profile.birthdate.toString();
        assert.deepEqual(stats.profile, correctObjects.lebronAdvanced.profile);
        assert.deepEqual(stats.basicStats, correctObjects.lebronAdvanced.basicStats);
        assert.deepEqual(stats.advancedStats, correctObjects.lebronAdvanced.advancedStats);
      }).done(done);
    });
    it('...from player name', function(done) {
      NBA.getStats('Lebron James', { advanced: true }).then(function(stats) {
        stats.profile.birthdate = stats.profile.birthdate.toString();
        assert.deepEqual(stats.profile, correctObjects.lebronAdvanced.profile);
        assert.deepEqual(stats.basicStats, correctObjects.lebronAdvanced.basicStats);
        assert.deepEqual(stats.advancedStats, correctObjects.lebronAdvanced.advancedStats);
      }).done(done);
    });
  });
  describe('Should retrieve only eFG% and TS%...', function(done) {
    it('...from full player object', function(done) {
      NBA.getStats(player, { basic: false, advanced: ['eFG', 'TS'] }).then(function(stats) {
        stats.profile.birthdate = stats.profile.birthdate.toString();
        assert.deepEqual(stats.profile, correctObjects.lebronAdvFg.profile);
        assert.deepEqual(stats.advancedStats, correctObjects.lebronAdvFg.advancedStats);
        assert.strictEqual(stats.basicStats, undefined);
      }).done(done);
    });
    it('...from player id', function(done) {
      NBA.getStats(2544, { basic: false, advanced: ['eFG', 'TS'] }).then(function(stats) {
        stats.profile.birthdate = stats.profile.birthdate.toString();
        assert.deepEqual(stats.profile, correctObjects.lebronAdvFg.profile);
        assert.deepEqual(stats.advancedStats, correctObjects.lebronAdvFg.advancedStats);
        assert.strictEqual(stats.basicStats, undefined);
      }).done(done);
    });
    it('...from player name', function(done) {
      NBA.getStats('Lebron James', { basic: false, advanced: ['eFG', 'TS'] }).then(function(stats) {
        stats.profile.birthdate = stats.profile.birthdate.toString();
        assert.deepEqual(stats.profile, correctObjects.lebronAdvFg.profile);
        assert.deepEqual(stats.advancedStats, correctObjects.lebronAdvFg.advancedStats);
        assert.strictEqual(stats.basicStats, undefined);
      }).done(done);
    });
  });
});
