/* jshint browser: false */
/* globals chrome: true, load_settings: true */

'use strict';

/*global load_settings, parseZonelist, initUI */

/*
var zones =
   [{tz: 'Asia/Jerusalem', title: 'TLV'}
   ,{tz: 'Europe/London', title: 'LON'}
   ,{tz: 'America/Los_Angeles', title: 'MTV'}
   ];
*/

document.addEventListener('DOMContentLoaded', startItUp);

function startItUp() {
  // load settings and start the rest
  load_settings(function(zonelist) {
    var zones = parseZonelist(zonelist);
    initUI(zones);
  });
}

// function adjustWindowSize() {
//   // Window size
//   var tblWidth = tbl.getBoundingClientRect().width;
//   var winWidth = Math.floor(tblWidth * 1.2);
//   var winHeight = document.querySelector('body').getBoundingClientRect().height;
//   appWindow.setBounds({ width: winWidth, height: winHeight});
// }
