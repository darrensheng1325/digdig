export class SoundManager {
    private audioContext: AudioContext;

    constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    public playCollectSound() {
        this.playSound(440, 0.1, 'sine');
    }

    public playHurtSound() {
        this.playSound(100, 0.2, 'sawtooth');
    }

    public playPortalSound() {
        this.playSweep(300, 600, 0.3);
    }

    public playBackgroundMusic() {
        this.playAmbientSound();
    }

    public playGoldDigSound() {
        this.playSound(660, 0.1, 'sine'); // Higher pitch for gold
    }

    public playBuyEmoteSound() {
        this.playSweep(440, 880, 0.2); // Upward sweep for purchase
    }

    private playSound(frequency: number, duration: number, type: OscillatorType) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Reduce the volume here
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime); // Changed from 0.1 to 0.05
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    private playSweep(startFreq: number, endFreq: number, duration: number) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    private playAmbientSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(50, this.audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Reduce the volume of the ambient sound
        gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime); // Changed from 0.02 to 0.01

        oscillator.start();

        // Modulate the frequency slightly for an ambient effect
        setInterval(() => {
            const newFreq = 45 + Math.random() * 10;
            oscillator.frequency.exponentialRampToValueAtTime(newFreq, this.audioContext.currentTime + 2);
        }, 2000);
    }
}