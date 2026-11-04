import { LightningElement } from 'lwc';
import SUBBU_PHOTO from '@salesforce/resourceUrl/subbuBirthday';
import BIRTHDAY_VIDEO from '@salesforce/resourceUrl/subbuBirthdayVideo';
import BIRTHDAY_AUDIO from '@salesforce/resourceUrl/subbuBirthdayAudio';

export default class subbuBirthday extends LightningElement {
    giftOpened = false;
    audioPlaying = false;

    subbuPhoto = SUBBU_PHOTO;
    birthdayVideo = BIRTHDAY_VIDEO;
    birthdayAudio = BIRTHDAY_AUDIO;

    get giftButtonLabel() {
        return this.giftOpened
            ? 'Surprise Opened 💖'
            : 'Open Surprise Gift 🎁';
    }

    get hintMessage() {
        return this.giftOpened
            ? 'Your special birthday wishes are revealed! ✨'
            : 'Click the gift to reveal a special message!';
    }

    get audioButtonLabel() {
        return this.audioPlaying
            ? '⏸ Pause Birthday Music'
            : '🎵 Play Birthday Music';
    }

    get confetti() {
        const symbols = ['✨', '🎊', '💖', '⭐', '🎉', '💛'];

        return Array.from({ length: 24 }, (_, index) => ({
            id: index,
            className: `confetti confetti-${index % 6}`,
            style: `--left:${(index * 37) % 100}%;` +
                `--delay:${(index % 8) * 0.35}s;` +
                `--duration:${4 + (index % 5)}s;`,
            symbol: symbols[index % symbols.length]
        }));
    }

    openGift() {
        this.giftOpened = true;
    }

    async playVideo() {
        const video = this.template.querySelector('video');

        if (video) {
            try {
                await video.play();
            } catch (error) {
                // Use the visible video controls if playback is blocked.
                // Browsers may require a direct user interaction.
            }
        }
    }

    async toggleAudio() {
        const audio = this.template.querySelector('audio');

        if (!audio) {
            return;
        }

        if (this.audioPlaying) {
            audio.pause();
            this.audioPlaying = false;
            return;
        }

        try {
            await audio.play();
            this.audioPlaying = true;
        } catch (error) {
            // Use the native audio controls if playback is blocked.
            this.audioPlaying = false;
        }

        audio.onended = () => {
            this.audioPlaying = false;
        };
    }

    replayCelebration() {
        this.giftOpened = false;
        this.audioPlaying = false;

        const audio = this.template.querySelector('audio');
        const video = this.template.querySelector('video');

        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }
}
