// valiables
let retryCount = 0;
let initialized = false;

const urlList = [
  'https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js',
  'https://www.gstatic.com/firebasejs/6.3.4/firebase-firestore.js',
];

// functions
/**
 * setup phase
 */
function injectScripts(src) {
  const s = document.createElement('script');
  s.src = src;
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

function preventInjectFirebase() {
  // ライブラリの読み込みが完了してから後続処理に進むようにする
  if (typeof firebase === 'undefined') {
    if (retryCount > 10) return;
    retryCount += 1;
    setTimeout(() => preventInjectFirebase(), 1000);
  } else {
    const event = new Event('initialized');
    document.dispatchEvent(event);
  }
}

function main() {
  urlList.forEach(src => injectScripts(src));
  preventInjectFirebase();
}

/**
 * execute phase
 */

class Firestore {
  constructor({ firebase, apiKey, projectId }) {
    this.messages = [];
    this.stock = [];
    this.prepend = false;
    this.firebase = firebase;
    if (!initialized) this.initFirebase({ apiKey, projectId });
    this.setDbRef();
    this.setListener();
  }

  initFirebase({ apiKey, projectId }) {
    this.firebase.initializeApp({ apiKey, projectId });
    initialized = true;
  }

  setDbRef() {
    this.dbRef = this.firebase
      .firestore()
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(10);
  }

  setListener() {
    this.unsubscribe = this.dbRef.onSnapshot(snapshot => {
      const messages = snapshot.docs.map(doc => doc.data());
      this.addMessage(messages[0]);
      this.addStock(messages);
    });
    const removeListener = e => {
      console.log('unsubscribe');
      this.unsubscribe();
      removeMessage();
      document.removeEventListener('unsubscribe-firestore', removeListener);
    };
    document.addEventListener('unsubscribe-firestore', removeListener);
  }

  addMessage(message) {
    console.log('new message', { message }, 'old messagees', { messages: this.messages });
    const oldMessages = this.messages;
    this.messages = [...oldMessages, message];
    // 空っぽだった時だけrender呼ぶ
    // そうでなかったら一定時間おきに勝手に呼ばれるから明示的に呼ばない
    if (!oldMessages.length) this.render();
  }

  addStock(messages) {
    this.stock = messages;
  }

  render() {
    if (this.prepend) return;

    if (this.messages.length) {
      // 新着メッセージがあればそれを表示
      const message = this.messages[0];
      this.prepend = true;
      this.messages = [...this.messages.slice(1)];
      removeMessage();
      appendMessage(message);
    } else {
      // 新着メッセージがなけばストッししておいた過去分を表示
      if (!this.stock.length) return;
      const message = this.stock[this.stock.length - 1];
      this.prepend = true;
      this.stock = [...this.stock.slice(0, -1)];
      removeMessage();
      appendMessage(message);
    }

    setTimeout(() => {
      this.prepend = false;
      this.render();
    }, 4000);
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
  const element = document.querySelector('#inject-background');
  if (element) {
    element.parentNode.removeChild(element);
  }
}

function excute(e) {
  try {
    const { apiKey, projectId } = e.detail;
    new Firestore({ firebase, apiKey, projectId });
  } catch (e) {
    console.log(e);
  }
}

// listeners
document.addEventListener('subscribe-firestore', excute);

// executes
main();