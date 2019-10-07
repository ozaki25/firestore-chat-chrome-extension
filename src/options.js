const button = document.querySelector('#submit');
const inputApiKey = document.querySelector('#apiKey');
const inputProjectId = document.querySelector('#projectId');
const clear = document.querySelector('#clear');

function onClickSubmit(e) {
  e.preventDefault();
  const apiKey = inputApiKey.value.trim();
  const projectId = inputProjectId.value.trim();
  if (!apiKey || !projectId) {
    alert('入力して下さい！！');
    return;
  }
  chrome.storage.sync.set({ apiKey, projectId }, function() {
    alert('保存しました！！');
  });
}

function onClickClear(e) {
  e.preventDefault();
  chrome.storage.sync.clear(function() {
    alert('保存されたデータを削除しました');
  });
}

button.addEventListener('click', onClickSubmit);
clear.addEventListener('click', onClickClear);
