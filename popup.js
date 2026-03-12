const speedInput = document.getElementById('speedInput');

// 1. 初始化读取
chrome.storage.local.get(['targetSpeed'], (res) => {
  if (res.targetSpeed) {
    speedInput.value = res.targetSpeed;
  }
});

// 封装核心功能：存入 storage + 通知 content.js
function setSpeedAndNotify(speed) {
  speedInput.value = speed; // 同步更新输入框里的数字
  chrome.storage.local.set({ targetSpeed: speed }, () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "setSpeed", speed: speed});
    });
  });
}

// 2. 监听自定义应用按钮
document.getElementById('applyBtn').addEventListener('click', () => {
  let speed = parseFloat(speedInput.value);
  if (speed > 0) setSpeedAndNotify(speed);
});

// 3. 监听恢复按钮
document.getElementById('resetBtn').addEventListener('click', () => {
  setSpeedAndNotify(1);
});

// 4. 监听所有的快捷按钮 (3.0x, 4.0x)
document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // 从 HTML 的 data-speed 属性里把数字抠出来
    let quickSpeed = parseFloat(e.target.dataset.speed);
    setSpeedAndNotify(quickSpeed);
  });
});