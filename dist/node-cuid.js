/**
 * cuid.js
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 * Extracted from CLCTR
 * 
 * Copyright (c) Eric Elliott 2012
 * MIT License
 */

/*global window, navigator, document, require, process*/
var global = global || this, module = module || undefined;

(function (app) {
  'use strict';
  var namespace = 'cuid',
    c = 0,
    blockSize = 4,
    base = 36,
    discreteValues = Math.pow(base, blockSize),

    pad = function pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
    },

    randomBlock = function randomBlock() {
      return pad((Math.random() *
            discreteValues << 0)
            .toString(base), blockSize);
    },

    api = function cuid() {
      // Starting with a lowercase letter makes
      // it HTML element ID friendly.
      var letter = 'c', // hard-coded allows for sequential access

        // timestamp
        // warning: this exposes the exact date and time
        // that the uid was created.
        timestamp = (new Date().getTime()).toString(base),

        // Prevent same-machine collisions.
        counter,

        // A few chars to generate distinct ids for different
        // clients (so different computers are far less
        // likely to generate the same id)
        fingerprint = api.fingerprint(),

        // Grab some more chars from Math.random()
        random = randomBlock() + randomBlock();

        c = (c < discreteValues) ? c : 0;
        counter = pad(c.toString(base), blockSize);

      c++; // this is not subliminal

      return  (letter + timestamp + counter + fingerprint + random);
    };


  api.fingerprint = function nodePrint() {
    var os = require('os'),

      padding = 2,
      pid = pad((process.pid).toString(36), padding),
      hostname = os.hostname(),
      length = hostname.length,
      hostId = pad((hostname)
        .split('')
        .reduce(function (prev, char) {
          return +prev + char.charCodeAt(0);
        }, +length + 36)
        .toString(36),
      padding);
    return pid + hostId;
  };


  // don't change anything from here down.
  if (app.register) {
    app.register(namespace, api);
  } else {
    namespace = app.exports ? 'exports' : namespace;
    app[namespace] = api;
  }

}(global.applitude || module || this));
