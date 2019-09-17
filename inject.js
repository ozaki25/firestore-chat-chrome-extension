let retryCount = 0;

const urlList = [
  'https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js',
  'https://www.gstatic.com/firebasejs/6.3.4/firebase-firestore.js',
];

function injectScripts(src) {
  const s = document.createElement('script');
  s.src = src;
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

function preventInjectFirebase() {
  if (typeof firebase === 'undefined') {
    if (retryCount > 10) return;
    retryCount += 1;
    setTimeout(() => preventInjectFirebase(), 1000);
  } else {
    excute();
  }
}

function initFirebase() {
  firebase.initializeApp({
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    projectId: 'xxxxxxx',
  });
}

async function getMessages() {
  try {
    const db = firebase.firestore();
    const dbRef = db.collection('messages');
    const snapshots = await dbRef.get();
    let messages = [];
    snapshots.forEach(doc => messages.push(doc.data()));
    console.log({ messages });
    return messages;
  } catch (e) {
    console.log(e);
  }
}

function appendMessage({ content }) {
  const h1 = document.createElement('h1');
  const text = document.createTextNode(content);
  h1.appendChild(text);
  h1.setAttribute('class', 'inject-h1');
  document.body.appendChild(h1);
}

async function excute() {
  initFirebase();
  const messages = await getMessages();
  if (!messages) {
    appendMessage({ content: 'Empty' });
    return;
  }
  const latestMessage = messages[messages.length - 1];
  appendMessage(latestMessage);
}

function main() {
  urlList.forEach(src => injectScripts(src));
  preventInjectFirebase();
}

main();
