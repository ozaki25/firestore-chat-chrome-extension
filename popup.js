const checkbox = document.querySelector('#activate');
let checked = false;

checkbox.addEventListener('change', onChange);

function onChange(e) {
  checked = e.target.checked;
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { checked });
  });
}
