const { initGame, mergeItems, renderGame, createMergeEffect } = require('./game.js');

// 初始化画布
const canvas = wx.createCanvas();
const ctx = canvas.getContext('2d');

// 触摸相关变量
let touchStartItem = null;
let touchStartX = 0;
let touchStartY = 0;

// 初始化游戏
initGame();

// 触摸开始事件
wx.onTouchStart(e => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  
  // 检测点击了哪个物品
  touchStartItem = getItemAtPosition(touchStartX, touchStartY);
  
  // 添加选中效果
  if (touchStartItem) {
    touchStartItem.originalY = touchStartItem.y;
    touchStartItem.isDragging = true;
  }
});

// 触摸移动事件
wx.onTouchMove(e => {
  if (!touchStartItem) return;
  
  const touch = e.touches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  
  // 更新物品位置并添加缓动效果
  touchStartItem.x += deltaX * 0.7;
  touchStartItem.y += deltaY * 0.7;
  
  // 边界限制
  touchStartItem.x = Math.max(0, Math.min(canvas.width - 80, touchStartItem.x));
  touchStartItem.y = Math.max(0, Math.min(canvas.height - 80, touchStartItem.y));
  
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  
  // 实时渲染
  renderGame();
  
  // 绘制拖拽轨迹
  ctx.beginPath();
  ctx.arc(touchStartItem.x + 40, touchStartItem.y + 40, 30, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,165,0,0.5)';
  ctx.lineWidth = 4;
  ctx.stroke();
});

// 触摸结束事件
wx.onTouchEnd(e => {
  if (!touchStartItem) return;
  
  const touch = e.changedTouches[0];
  const touchEndX = touch.clientX;
  const touchEndY = touch.clientY;
  
  // 检测是否释放到另一个物品上
  const touchEndItem = getItemAtPosition(touchEndX, touchEndY);
  
  if (touchEndItem && touchEndItem !== touchStartItem) {
    // 尝试合并物品
    if (mergeItems(touchStartItem, touchEndItem)) {
      // 合并成功特效
      createMergeEffect(touchEndItem.x + 40, touchEndItem.y + 40);
      // 创建新物品
      createRandomItem();
    }
  }
  
  // 重新渲染
  renderGame();
});

// 获取指定位置的物品
function getItemAtPosition(x, y) {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if (x >= item.x && x <= item.x + 80 && 
        y >= item.y && y <= item.y + 80) {
      return item;
    }
  }
  return null;
}