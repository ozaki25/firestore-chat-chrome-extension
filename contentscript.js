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

function onChangeStorage({ checked }) {
  const { newValue } = checked;
  const { hostname } = location;
  const eventName = newValue[hostname] ? 'subscribe-firestore' : 'unsubscribe-firestore';
  const event = new Event(eventName);
  document.dispatchEvent(event);
}

// listeners
document.addEventListener('initialized', onInit);
chrome.runtime.onMessage.addListener(onMessage);
chrome.storage.onChanged.addListener(onChangeStorage);

// executes
inject();
