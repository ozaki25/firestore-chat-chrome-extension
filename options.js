const button = document.querySelector('#submit');
const inputApiKey = document.querySelector('#apiKey');
const inputProjectId = document.querySelector('#projectId');

function onClick(e) {
  e.preventDefault();
  const apiKey = inputApiKey.value.trim();
  const projectId = inputProjectId.value.trim();
  if (!apiKey || !projectId) {
    alert('入力して下さい！！');
    return;
  }
  chrome.storage.sync.set({ apiKey, projectId });
  alert('保存しました！！');
}

button.addEventListener('click', onClick);
