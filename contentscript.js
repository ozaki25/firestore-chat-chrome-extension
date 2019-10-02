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
  const event = new Event('subscribe-firestore');
  document.dispatchEvent(event);
}

function onMessage(request) {
  const { checked } = request;
  const eventName = checked ? 'subscribe-firestore' : 'unsubscribe-firestore';
  const event = new Event(eventName);
  document.dispatchEvent(event);
}

// listeners
document.addEventListener('initialized', onInit);
chrome.runtime.onMessage.addListener(onMessage);

// executes
inject();
