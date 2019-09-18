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

  const div = document.createElement('div');
  const p = document.createElement('p');
  const text = document.createTextNode(content);
  p.appendChild(text);
  p.setAttribute('id', 'inject-text');
  div.appendChild(p);
  div.setAttribute('id', 'inject-background');

  if (fullScreenElement) {
    fullScreenElement.appendChild(div);
  } else {
    document.body.appendChild(div);
  }
}

function removeMessage() {
  const textElement = document.querySelector('#inject-text');
  if (textElement) {
    textElement.parentNode.removeChild(textElement);
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
