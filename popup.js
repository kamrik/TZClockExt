// Excellent writeup about time zones on StackOverflow
// http://stackoverflow.com/tags/timezone/info

// JS libs for dealing with time zones, none is simple
// http://stackoverflow.com/questions/15141762/how-to-initialize-javascript-date-to-a-particular-timezone/15171030#15171030

// Human readable list of all time zones in Olson DB.
// http://en.wikipedia.org/wiki/List_of_tz_database_time_zones

// Olson DB on GitHub
// https://github.com/eggert/tz

// Olson DB home page on IANA
// http://www.iana.org/time-zones

/* jshint browser: true, laxcomma: true */
/* globals chrome: true */

'use strict';



/*
var zones =
   [{tz: 'Asia/Jerusalem', title: 'TLV'}
   ,{tz: 'Europe/London', title: 'LON'}
   ,{tz: 'America/Los_Angeles', title: 'MTV'}
   ];
*/

// var dateOptions = {weekday: "long", year: "numeric", month: "long", day: "numeric"};


// Useful globals
var localTimeElem;
var dateElem;
var tbl;
var optionsLink;

document.addEventListener('DOMContentLoaded', startItUp);


function startItUp() {
  // Init globals
  localTimeElem = document.querySelector('#time');
  dateElem = document.querySelector('#date');
  tbl = document.querySelector('#tbl');
  optionsLink = document.querySelector('#options-link');

  // load options and start the rest
  load_options(function(zonelist) {
        zones = parseZonelist(zonelist);
        initUI(zones);
        //adjustWindowSize();
        window.setInterval(updateClocks, 100);
      });
}



function getDateString(d) {
  // Return the date in browser's local time zone. Without year.
  // The other option is to use d.toLocaleDateString()
  var localDate = d.toDateString();
  // Strip the last 4 digits of the year
  localDate = localDate.substr(0, localDate.length - 4);
  return localDate;
}

function updateClocks() {
  var d = new Date();

  dateElem.innerText = getDateString(d);
  localTimeElem.innerText = getTimeString(d);

  zones.forEach(function(z) {
    z.time = getTimeString(d, z.tz);
    z.timeCell.innerText = z.time;
  });
}




function adjustWindowSize() {
  // Window size
  var tblWidth = tbl.getBoundingClientRect().width;
  var winWidth = Math.floor(tblWidth * 1.2);
  var winHeight = document.querySelector('body').getBoundingClientRect().height;
  appWindow.setBounds({ width: winWidth, height: winHeight});
}
