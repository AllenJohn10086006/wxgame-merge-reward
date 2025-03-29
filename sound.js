// 音效管理系统
const audioContext = wx.createInnerAudioContext();

export const sound = {
  load(sources) {
    this.sounds = Object.fromEntries(
      Object.entries(sources).map(([key, path]) => [key, {
        src: path,
        instance: null
      }])
    );
  },

  play(name) {
    const sound = this.sounds[name];
    if (sound) {
      audioContext.src = sound.src;
      audioContext.play();
    }
  },

  stopAll() {
    audioContext.stop();
  }
};