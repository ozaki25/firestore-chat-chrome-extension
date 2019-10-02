// functions
function inject() {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('inject.js');
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

function onInit() {
  chrome.storage.sync.get('checked', function({ checked }) {
    const { hostname } = location;
    onMessage({ isChecked: checked && checked[hostname] });
  });
}

function onMessage({ isChecked }) {
  const eventName = isChecked ? 'subscribe-firestore' : 'unsubscribe-firestore';
  const event = new Event(eventName);
  document.dispatchEvent(event);

  chrome.storage.sync.get('checked', function({ checked }) {
    const { hostname } = location;
    chrome.storage.sync.set({ checked: { ...checked, [hostname]: isChecked } });
    console.log({ checked: { ...checked, [hostname]: isChecked } });
  });
}

// listeners
document.addEventListener('initialized', onInit);
chrome.runtime.onMessage.addListener(onMessage);

// executes
inject();
