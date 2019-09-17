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
  try {
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {
    console.log(e);
  }
}

function preventInjectFirebase() {
  // ライブラリの読み込みが完了してから後続処理に進むようにする
  if (typeof firebase === 'undefined') {
    if (retryCount > 10) return;
    retryCount += 1;
    setTimeout(() => preventInjectFirebase(), 1000);
  } else {
    excute();
  }
}

function appendMessage({ content }) {
  const fullScreenElement = document.querySelector('.punch-full-screen-element');

  const h1 = document.createElement('h1');
  const text = document.createTextNode(content);
  h1.appendChild(text);
  h1.setAttribute('class', 'inject-h1');

  if (fullScreenElement) {
    fullScreenElement.appendChild(h1);
  } else {
    document.body.appendChild(h1);
  }
}

function removeMessage() {
  const fullScreenElement = document.querySelector('.punch-full-screen-element');

  if (fullScreenElement) {
    const oldMessageInFullScreen = fullScreenElement.querySelector('.inject-h1');
    if (oldMessageInFullScreen) {
      fullScreenElement.removeChild(oldMessageInFullScreen);
    }
  }

  const oldMessage = document.body.querySelector('.inject-h1');
  if (oldMessage) {
    document.body.removeChild(oldMessage);
  }
}

class Firestore {
  constructor({ firebase }) {
    this.message = { content: '' };
    this.firebase = firebase;
    this.initFirebase();
    this.setDbRef();
    this.setListener();
  }

  initFirebase() {
    this.firebase.initializeApp({
      apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      projectId: 'xxxxxxx',
    });
  }

  setDbRef() {
    this.dbRef = this.firebase
      .firestore()
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(1);
  }

  setListener() {
    this.dbRef.onSnapshot(snapshot => {
      // limit(1)なので1件しか来ない
      snapshot.docs.forEach(doc => this.setMessage(doc.data()));
    });
  }

  setMessage(message) {
    console.log({ message });
    this.message = message;
    this.render();
  }

  render() {
    removeMessage();
    appendMessage(this.message);
  }
}

function excute() {
  try {
    new Firestore({ firebase });
  } catch (e) {
    console.log(e);
  }
}

function main() {
  urlList.forEach(src => injectScripts(src));
  preventInjectFirebase();
}

main();
