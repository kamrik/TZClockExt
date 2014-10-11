'use strict';

var defaults = {};
defaults.locale = 'en-GB';
defaults.zonelist = 'Europe/London:LON\nAmerica/New_York:NY\nAmerica/Los_Angeles:LA';

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
  var opts = { minute: '2-digit', hour: 'numeric'} //, second: 'numeric' };
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
  // Use ['UTC'] as default.
  chrome.storage.local.get({
    zonelist: defaults.zonelist
  }, function(items) {
    cb(items.zonelist);
  });
}

// Parse a single time zone string like
// America/Los_Angeles:LA
// To an object
// z = {tz:'America/Los_Angeles', title:'LA'}
function parseZone(z) {
  var parts = z.split(':');
  var zname = parts[0].trim();
  var zlbl;
  if (parts[1]) {
    zlbl = parts[1].trim();
  } else {
    zlbl = zname.replace(/.*\//,'').trim().replace('_', ' ');
  }
  return {tz: zname, title: zlbl, raw:z};
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

  // Handler to be called every 0.1 second or so to make the clock tick.
  // Defined here because it needs access to a bunch of vars defined in initUI().

  globals.zones.forEach(function(z) {
    var tr = z.tr = tbody.insertRow(-1);
    z.nameCell = tr.insertCell(-1);
    z.timeCell = tr.insertCell(-1);
    z.nameCell.className = 'tzname';
    z.timeCell.className = 'tztime';
    z.nameCell.innerText = z.title;
    updateOneTZ(z, d);
  });

  var old_tbody = tbl.tBodies[0];
  if (old_tbody) {
    tbl.removeChild(old_tbody);
  }
  tbl.appendChild(tbody);
  if (!globals.intervalHandle) {
    globals.intervalHandle = window.setInterval(updateClocks, 100);
  }
}
