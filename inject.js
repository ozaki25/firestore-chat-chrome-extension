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
    const dbRef = db.collection('messages').orderBy('timestamp');

    dbRef.onSnapshot(function(snapshot) {
      let messages2 = [];
      snapshot.docs.forEach(doc => messages2.push(doc.data()));
      console.log({ messages2 });
      appendMessage(messages2[messages2.length - 1]);
    });

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
  removeMessage();
  const h1 = document.createElement('h1');
  const text = document.createTextNode(content);
  h1.appendChild(text);
  h1.setAttribute('class', 'inject-h1');
  document.body.appendChild(h1);
}

function removeMessage() {
  const oldElement = document.getElementsByClassName('inject-h1')[0];
  if (oldElement) document.body.removeChild(oldElement);
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
