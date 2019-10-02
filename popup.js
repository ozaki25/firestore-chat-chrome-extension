const checkbox = document.querySelector('#activate');
const initialized = document.querySelector('.initialized');
const uninitialized = document.querySelector('.uninitialized');

function onLoad() {
  chrome.storage.sync.get('apuKey', function(apiKey) {
    chrome.storage.sync.get('projectId', function(projectId) {
      if (apiKey && projectId) {
        initialized.style.display = 'block';
        uninitialized.style.display = 'none';
      } else {
        initialized.style.display = 'none';
        uninitialized.style.display = 'block';
      }
    });
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const { url } = tabs[0];
    const { hostname } = new URL(url);
    chrome.storage.sync.get('checked', function({ checked }) {
      checkbox.checked = checked[hostname];
    });
  });
}

function onChange(e) {
  isChecked = e.target.checked;
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { isChecked });
  });
}

window.addEventListener('load', onLoad);
checkbox.addEventListener('change', onChange);
