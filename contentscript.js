function inject() {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('inject.js');
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

inject();

chrome.runtime.onMessage.addListener(function() {
  const event = new Event('unsubscribe-firestore');
  document.dispatchEvent(event);
});
