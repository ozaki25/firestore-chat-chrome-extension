// variables
const button = document.querySelector('#submit');
const inputApiKey = document.querySelector('#apiKey');
const inputProjectId = document.querySelector('#projectId');
const inputCollectionName = document.querySelector('#collectionName');
const inputDisplayTime = document.querySelector('#displayTime');
const inputStockNumber = document.querySelector('#stockNumber');
const inputInfiniteLoop = document.querySelector('#infiniteLoop');
const clear = document.querySelector('#clear');

// functions
function onClickSubmit(e) {
  e.preventDefault();
  const apiKey = inputApiKey.value.trim();
  const projectId = inputProjectId.value.trim();
  const collectionName = inputCollectionName.value.trim();
  const displayTime = Number(inputDisplayTime.value);
  const stockNumber = Number(inputStockNumber.value);
  const infiniteLoop = inputInfiniteLoop.checked;
  if (!apiKey || !projectId) {
    alert('入力して下さい！！');
    return;
  }
  chrome.storage.sync.set(
    { apiKey, projectId, collectionName, displayTime, stockNumber, infiniteLoop },
    function () {
      alert('保存しました！！');
    }
  );
}

function onClickClear(e) {
  e.preventDefault();
  const res = confirm('保存したデータを削除します\nよろしいですか？');
  if (res) {
    chrome.storage.sync.clear(function () {
      alert('保存されたデータを削除しました');
    });
  }
}

function init() {
  chrome.storage.sync.get(
    ['apiKey', 'projectId', 'collectionName', 'displayTime', 'stockNumber', 'infiniteLoop'],
    function ({ apiKey, projectId, collectionName, displayTime, stockNumber, infiniteLoop }) {
      inputApiKey.value = apiKey || '';
      inputProjectId.value = projectId || '';
      inputCollectionName.value = collectionName || '';
      inputDisplayTime.value = displayTime || 8000;
      inputStockNumber.value = stockNumber || 10;
      inputInfiniteLoop.checked = infiniteLoop;
    }
  );
}

// listeners
button.addEventListener('click', onClickSubmit);
clear.addEventListener('click', onClickClear);

// executes
init();
