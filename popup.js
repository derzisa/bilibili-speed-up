document.getElementById('applyBtn').addEventListener('click', () => {
  let speed = parseFloat(document.getElementById('speedInput').value);
  if (speed > 0) {
    setVideoSpeed(speed);
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('speedInput').value = 1;
  setVideoSpeed(1);
});

function setVideoSpeed(speed) {
  // 获取当前活跃的标签页
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      func: (s) => {
        // B站的播放器底层依然是 video 标签
        const video = document.querySelector('video');
        if (video) {
          video.playbackRate = s;
          // 在网页控制台打印一下，方便确认
          console.log(`[自定义倍速插件] 已将视频倍速设置为: ${s}x`);
        } else {
          alert('未检测到视频元素，请确保当前在视频播放页面。');
        }
      },
      args: [speed]
    });
  });
}