let currentTargetSpeed = 1;

// 1. 页面刚打开时，去保险柜拿倍速
chrome.storage.local.get(['targetSpeed'], (res) => {
  if (res.targetSpeed) {
    currentTargetSpeed = res.targetSpeed;
    enforceSpeed();
  }
});

// 2. 接收你在 popup 弹窗里点的最新倍数
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setSpeed") {
    currentTargetSpeed = request.speed;
    enforceSpeed();
  }
});

// 3. 核心逻辑：强制改速
function enforceSpeed() {
  const video = document.querySelector('video');
  // 只有当视频存在，且当前倍速不对的时候，才去修改（防抖）
  if (video && video.playbackRate !== currentTargetSpeed) {
    video.playbackRate = currentTargetSpeed;
  }
}

// 4. 终极流氓打法：对付 Vue 这种单页面无刷新换集，直接搞个定时器盯着
// 每 1000 毫秒检查一次，B站敢切集重置，我就给你强行掰回来
setInterval(enforceSpeed, 1000);