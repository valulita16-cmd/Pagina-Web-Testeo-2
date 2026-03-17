export const playTone = (frequency: number, type: OscillatorType, duration: number, volume = 0.1) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const playTapSound = () => playTone(600, 'sine', 0.1, 0.05);
export const playSwipeSound = () => playTone(300, 'triangle', 0.15, 0.03);
export const playSuccessSound = () => {
  playTone(400, 'sine', 0.1, 0.05);
  setTimeout(() => playTone(600, 'sine', 0.15, 0.05), 100);
};
export const playErrorSound = () => {
  playTone(200, 'sawtooth', 0.15, 0.05);
  setTimeout(() => playTone(150, 'sawtooth', 0.2, 0.05), 150);
};
