// variables
let retryCount = 0;
const urlList = ['src/libs/firebase-app.js', 'src/libs/firebase-firestore.js', 'src/inject.js'];

// functions
function injectScripts(src) {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL(src);
  s.onload = function() {
    this.remove();
    const event = new Event('script-loaded');
    document.dispatchEvent(event);
  };
  (document.head || document.documentElement).appendChild(s);
}

function main() {
  let count = 0;
  document.addEventListener('script-loaded', () => {
    count += 1;
    if (count === urlList.length) onInit();
  });
  urlList.forEach(src => injectScripts(src));
}

function onInit() {
  chrome.storage.sync.get('checked', function({ checked }) {
    const { hostname } = location;
    onMessage({ isChecked: checked && checked[hostname] });
  });
}

function onMessage({ isChecked }) {
  chrome.storage.sync.get(
    ['checked', 'apiKey', 'projectId', 'displayTime', 'stockNumber', 'infiniteLoop'],
    function({ checked, apiKey, projectId, displayTime, stockNumber, infiniteLoop }) {
      const eventName = isChecked ? 'subscribe-firestore' : 'unsubscribe-firestore';
      const event = new CustomEvent(eventName, {
        detail: { apiKey, projectId, displayTime, stockNumber, infiniteLoop },
      });
      document.dispatchEvent(event);

      const { hostname } = location;
      chrome.storage.sync.set({ checked: { ...checked, [hostname]: isChecked } });
      console.log({ checked: { ...checked, [hostname]: isChecked } });
    }
  );
}

function onChangeStorage({ checked }) {
  const { newValue } = checked;
  const { hostname } = location;
  const eventName = newValue[hostname] ? 'subscribe-firestore' : 'unsubscribe-firestore';
  const event = new Event(eventName);
  document.dispatchEvent(event);
}

// listeners
chrome.runtime.onMessage.addListener(onMessage);
chrome.storage.onChanged.addListener(onChangeStorage);

// executes
main();
