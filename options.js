// Saves options to chrome.storage
function save_options() {
    var zonelist = document.getElementById('zonelist').value;
    chrome.storage.sync.set({
        zonelist: zonelist
    }, function() {
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
function restore_options() {
    // Use ['UTC'] as default.
    load_options(function(zonelist) {
        document.getElementById('zonelist').value = zonelist;
    });
}

function check_list() {
    var zonelist = document.getElementById('zonelist').value;
    var zones = parseZonelist(zonelist);

    var status = document.getElementById('status');
    initUI(zones);
    //status.textContent = JSON.stringify(zones);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('check').addEventListener('click', check_list);

