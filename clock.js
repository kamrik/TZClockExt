var defaults = {}
defaults.locale = 'en-GB';
defaults.zonelist = 'Europe/London:LON, America/New_York:NY, America/Los_Angeles:LA';


var zones;


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

function load_options(cb) {
    // Use ['UTC'] as default.
    chrome.storage.sync.get({
        zonelist: defaults.zonelist
    }, function(items) {
        cb(items.zonelist);
    });
}

function parseZonelist(zonelist) {
  console.log('XXXX' + zonelist)
  zones = zonelist.split(/[,\n\r]+/).map(function(z) {
    console.log('zone z=' + z)
    var parts = z.split(':');
    var zname = parts[0].trim();
    var zlbl;
    if (parts[1]) {
      zlbl = parts[1].trim();
    } else {
      zlbl = zname.replace(/.*\//,'').trim().replace('_', ' ');
    }
    return {tz: zname, title: zlbl};
  });
  return zones;
}

function initUI(zones) {
  // Init and add HTML table rows for each time zone.
  var d = new Date();
  var tbl = document.querySelector('#tbl');
  var tbody = document.createElement('tbody');


  zones.forEach(function(z) {
    z.time = getTimeString(d, z.tz);
    var tr = z.tr = tbody.insertRow(-1);
    z.nameCell = tr.insertCell(-1);
    z.timeCell = tr.insertCell(-1);
    z.nameCell.className = 'tzname';
    z.timeCell.className = 'tztime';
    z.nameCell.innerText = z.title;
    z.timeCell.innerText = z.time;
  });
  var old_tbody = tbl.tBodies[0];
  if (old_tbody)
    tbl.removeChild(old_tbody);
  tbl.appendChild(tbody)
}
