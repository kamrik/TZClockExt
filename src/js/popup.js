/* jshint browser: false */
/* globals chrome: true, load_settings: true */

'use strict';

/*global load_settings, parseZonelist, initUI, globals */

document.addEventListener('DOMContentLoaded', startItUp);

function startItUp() {
  // load settings and start the rest
  load_settings(function(zonelist) {
    globals.zones = parseZonelist(zonelist);
    initUI();
  });
}
