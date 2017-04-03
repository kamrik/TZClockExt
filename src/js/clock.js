/* global $ */

'use strict';

var defaults = {};
defaults.locale = 'en-GB';
defaults.zonelist = 'Europe/London\nAmerica/New_York:NY\nAmerica/Los_Angeles:LA';
defaults.week_start_day = 1; // 0 = 7 = Sunday, 1 = Monday etc.

// An object to keep some global values and settings.
var globals = {};

// Debug logging helper
function mylog(msg) {
  console.error('DEBUG: ' + String(msg));
}

function getTimeString(d, timeZone, locale) {
  // As of this writing, this won't work in other browsers, the timeZone
  // parameter is new, part of ECMA-402 1.0
  // http://www.ecma-international.org/ecma-402/1.0/
  locale = locale || defaults.locale;
  var opts = { minute: '2-digit', hour: 'numeric'}; //, second: 'numeric' };
  if (timeZone) opts.timeZone = timeZone;
  var s = d.toLocaleTimeString(locale, opts);
  return s;
}

// Return the date in browser's local time zone. Without year.
function getDateString(d) {
  // The other option is to use d.toLocaleDateString()
  var localDate = d.toDateString();
  // Strip the last 4 digits of the year
  localDate = localDate.substr(0, localDate.length - 4);
  return localDate;
}

// Load stored string with time zones.
function load_settings(cb) {
  var defaults_dcopy = jQuery.extend(true, {}, defaults);
  chrome.storage.local.get(defaults_dcopy, cb);
}

// Parse a single time zone string like
// America/New_York:NY
// To an object
// z = {tz: "America/New_York", title: "NY", raw: "America/New_York:NY"}
function parseZone(zstr) {
  var z = {raw:zstr}
  var parts = zstr.split(':');

  // First part is the time zone name as it appears on Oslon DB
  z.tz = parts[0].trim();

  // Second part (optional) is the display label, like 'NY'
  if (parts[1]) {
    z.title = parts[1].trim();
  } else {
    z.title = z.tz.replace(/.*\//,'').trim().replace('_', ' ');
  }

  // Third part (optional) is display color - any HTML/CSS color.
  if (parts[2]) {
    z.color = parts[2].trim();
  }
  return z
}

// Convert a string with a list of time zones to an array.
function parseZonelist(zonelist) {
  var zones = zonelist
      .trim()
      .split(/[,\n\r]+/)
      .map(parseZone);
  return zones;
}

function updateOneTZ(z, d) {
  try {
    z.time = getTimeString(d, z.tz);
    z.timeCell.innerText = z.time;
  } catch (e) {
    z.timeCell.innerText = 'Bad TZ';
    z.timeCell.className = 'bad_tztime';
    z.isBad = true;
    z.parseError = e;
  }
}

function updateClocks() {
  var d = new Date();
  var localTime = getTimeString(d);
  if (localTime == globals.lastLocalTime) {
    // Don't update any visuals if time string hasn't changed.
    return;
  }
  globals.lastLocalTime = localTime;
  var localTimeElem = document.querySelector('#time');
  var dateElem = document.querySelector('#date');
  if (localTimeElem) localTimeElem.innerText = localTime;
  if (dateElem) dateElem.innerText = getDateString(d);

  globals.zones.forEach(function (z) {
    updateOneTZ(z, d);
  });
}

function initUI() {
  // Init and add HTML table rows for each time zone.
  var d = new Date();
  var tbl = document.querySelector('#tbl');
  var tbody = document.createElement('tbody');

  globals.zones.forEach(function(z) {
    var tr = z.tr = tbody.insertRow(-1);
    z.nameCell = tr.insertCell(-1);
    z.timeCell = tr.insertCell(-1);
    z.nameCell.className = 'tzname';
    if (z.color) {
      z.nameCell.style.color = z.color;
    }
    z.timeCell.className = 'tztime';
    z.nameCell.innerText = z.title;
    updateOneTZ(z, d);
  });

  var old_tbody = tbl.tBodies[0];
  if (old_tbody) {
    tbl.removeChild(old_tbody);
  }
  tbl.appendChild(tbody);

  // Set up date picker
  if (globals.datePicker && globals.update_datepicker) {
    $('#datepicker').datepicker('destroy');
    globals.datePicker = null;
  }
  if (!globals.datePicker) {
    globals.datePicker = $('#datepicker').datepicker({
      firstDay: globals.settings.week_start_day
    });
    $('#date').click(function() {
      globals.datePicker.datepicker('setDate', new Date());
    });
  }

  if (!globals.intervalHandle) {
    globals.intervalHandle = window.setInterval(updateClocks, 100);
  }
}
