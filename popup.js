const speedInput = document.getElementById('speedInput');

// 1. 每次点开弹窗，先从存储里读出上次设置的倍数
chrome.storage.local.get(['targetSpeed'], (res) => {
  if (res.targetSpeed) {
    speedInput.value = res.targetSpeed;
  }
});

document.getElementById('applyBtn').addEventListener('click', () => {
  let speed = parseFloat(speedInput.value);
  if (speed > 0) {
    // 2. 把新倍数存进浏览器的保险柜
    chrome.storage.local.set({ targetSpeed: speed }, () => {
      // 3. 发消息通知当前页面的 content.js 立刻执行
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "setSpeed", speed: speed});
      });
    });
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  speedInput.value = 1;
  chrome.storage.local.set({ targetSpeed: 1 }, () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "setSpeed", speed: 1});
    });
  });
});