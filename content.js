let currentTargetSpeed = 1;

// 1. 初始化读取
chrome.storage.local.get(['targetSpeed'], (res) => {
  if (res.targetSpeed) {
    currentTargetSpeed = res.targetSpeed;
  }
});

// 2. 监听咱们自己插件 popup 的修改
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setSpeed") {
    currentTargetSpeed = request.speed;
  }
});

// 3. 暴君守护者
function enforceSpeed() {
  const video = document.querySelector('video');
  if (video && video.playbackRate !== currentTargetSpeed) {
    video.playbackRate = currentTargetSpeed;
  }
}
setInterval(enforceSpeed, 1000);

// ================= 新增核心逻辑 =================
// 4. 监听 B 站原生组件的点击事件（状态同步）
// B站的倍速菜单是在 document 里的，我们用事件捕获机制拦截点击
document.addEventListener('click', (e) => {
  const target = e.target;
  
  // 检查被点击的元素是不是 B 站的原生倍速按钮
  // B站现在的倍速选项通常带有 bpx-player-ctrl-playbackrate-menu-item 这样的 class
  if (target && target.className && typeof target.className === 'string' && target.className.includes('playbackrate-menu-item')) {
    
    // 从 B 站的 data-value 属性获取真实倍数，比如 "2.0"
    let nativeSpeed = parseFloat(target.dataset.value);
    
    if (!isNaN(nativeSpeed)) {
      console.log(`[插件] 检测到原生组件修改，同步记忆倍速为: ${nativeSpeed}x`);
      // 更新插件内存变量
      currentTargetSpeed = nativeSpeed;
      // 更新持久化存储，保证刷新不丢
      chrome.storage.local.set({ targetSpeed: nativeSpeed });
    }
  }
}, true); // true 表示在捕获阶段拦截，防止被 B 站代码阻止事件冒泡
