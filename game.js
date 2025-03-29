// 游戏全局变量
let items = []; // 所有物品
let mergedItems = []; // 已合成的物品
let score = 0; // 玩家分数
let canvas = null;
let ctx = null;

// 初始化游戏
function initGame() {
  // 获取canvas和context
  canvas = wx.createCanvas();
  ctx = canvas.getContext('2d');
  
  // 生成初始物品
  for (let i = 0; i < 5; i++) {
    createRandomItem();
  }
  
  // 初始化渲染
  renderGame();
}

// 创建随机物品
function createRandomItem() {
  const randomItem = itemConfigs[0]; // 初始只生成1级物品
  items.push({
    ...randomItem,
    x: Math.random() * (canvas.width - 100),
    y: Math.random() * (canvas.height - 100)
  });
}

// 合并物品
// 堆积检测函数
function checkOverflow() {
  const topLine = 200; // 屏幕顶部警戒线
  return items.some(item => item.y < topLine && item.y < canvas.height * 0.3);
}

// 游戏失败处理
function gameOver() {
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '40px Arial';
  ctx.fillText('游戏结束！', canvas.width/2 - 80, canvas.height/2);
  
  // 禁用后续操作
  items.length = 0;
  renderGame();
}

function mergeItems(item1, item2) {
  if (item1.id === item2.id && item1.id !== itemConfigs[itemConfigs.length - 1].id) {
    // 找到下一级物品配置
    const nextLevelConfig = itemConfigs.find(config => config.id === item1.nextLevel);
    
    if (nextLevelConfig) {
      // 创建新物品
      const newItem = {
        ...nextLevelConfig,
        x: (item1.x + item2.x) / 2,
        y: (item1.y + item2.y) / 2
      };
      
      // 移除旧物品，添加新物品
      items = items.filter(item => item !== item1 && item !== item2);
      items.push(newItem);
      mergedItems.push(newItem);
      
      // 增加分数
      score += newItem.value;
      
      // 自动生成新物品（每100分增加生成概率）
      if(Math.random() < 0.3 + score/1000) {
        createRandomItem();
      }
      
      // 检测最终合成（魔法树）
      if(newItem.id === 4) {
        gameVictory();
      }
      
      // 检测物品堆积
      if(checkOverflow()) {
        gameOver();
      }
      
      return true;
    }
  }
  return false;
}

// 渲染游戏
// 游戏状态
let isGameOver = false;

function renderGame() {
  if(isGameOver) return;
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制所有物品
  items.forEach(item => {
    ctx.fillStyle = getColorByLevel(item.id);
    ctx.fillRect(item.x, item.y, 80, 80);
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(item.name, item.x + 10, item.y + 45);
  });
  
  // 绘制分数
  ctx.font = '24px Arial';
  ctx.fillText(`分数: ${score}`, 20, 30);
}

// 根据物品等级获取颜色
function getColorByLevel(level) {
  const colors = ['#FF5252', '#FFEB3B', '#4CAF50', '#2196F3'];
  return colors[level - 1] || '#9E9E9E';
}

// 游戏胜利
function gameVictory() {
  isGameOver = true;
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#FFD700';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('胜利！', canvas.width/2, canvas.height/2);
  ctx.font = '24px Arial';
  ctx.fillText(`最终分数: ${score}`, canvas.width/2, canvas.height/2 + 50);
}

// 导出模块
module.exports = {
  initGame,
  mergeItems,
  renderGame
};