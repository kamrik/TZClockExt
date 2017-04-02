'use strict';

/*global load_settings, parseZonelist, initUI, globals */

// Saves options to chrome.storage
function save_settings() {
  // Reconstruct the settings from defaults + the state of settings page.
  var settings = jQuery.extend(true, {}, defaults);
  settings.zonelist = document.getElementById('zonelist').value;
  chrome.storage.local.set(settings, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
        status.textContent = '';
      }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_settings() {
  load_settings(function(settings) {
    document.getElementById('zonelist').value = settings.zonelist;
    check_list();
  });
}

function check_list() {
  var zonelist = document.getElementById('zonelist').value;
  globals.zones = parseZonelist(zonelist);

  var status = document.getElementById('status');
  initUI();
  var badZone;
  for (var i in globals.zones) {
    var z = globals.zones[i];
    if (z.isBad) {
      badZone = z;
      break;
    }
  }

  var saveButton = document.getElementById('save');
  status.textContent = '';
  status.className = '';
  saveButton.disabled = !!badZone;
  if (badZone) {
    status.className = 'status-error';
    status.textContent = 'Can\'t parse "' + badZone.raw + '"';
    status.title = badZone.parseError.message;
  }
}

document.addEventListener('DOMContentLoaded', restore_settings);
document.getElementById('save').addEventListener('click', save_settings);
document.getElementById('zonelist').addEventListener('input', check_list);
