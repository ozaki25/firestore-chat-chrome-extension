const checkbox = document.querySelector('#activate');

function onLoad() {
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
