import { LightningElement } from 'lwc';
import CAROUSEL_IMAGES from '@salesforce/resourceUrl/CarouselImages';

export default class CustomCarousel extends LightningElement {
    currentIndex = 0;
    autoplayEnabled = true;
    timerId;

    slides = [
        {
            id: 1,
            title: 'Explore Nature',
            description: 'Discover the beauty of mountains and lakes.',
            image: `${CAROUSEL_IMAGES}/nature.svg`,
            index: 0,
            label: 'Show nature slide',
            dotClass: 'dot active-dot'
        },
        {
            id: 2,
            title: 'Beautiful Beaches',
            description: 'Enjoy the sunshine and ocean views.',
            image: `${CAROUSEL_IMAGES}/beach.svg`,
            index: 1,
            label: 'Show beach slide',
            dotClass: 'dot'
        },
        {
            id: 3,
            title: 'Forest Life',
            description: 'Experience the excitement of forest life.',
            image: `${CAROUSEL_IMAGES}/forest.svg`,
            index: 2,
            label: 'Show city slide',
            dotClass: 'dot'
        },
        {
            id: 4,
            title: 'Desert Adventure',
            description: 'Experience the excitement of desert life.',
            image: `${CAROUSEL_IMAGES}/desert.svg`,
            index: 3,
            label: 'Show desert slide',
            dotClass: 'dot'
        },
        {
            id: 5,
            title: 'Forest Life',
            description: 'Experience the excitement of forest life.',
            image: `${CAROUSEL_IMAGES}/forest.svg`,
            index: 4,
            label: 'Show forest slide',
            dotClass: 'dot'
        },
        {
            id: 6,
            title: 'Space Life',
            description: 'Experience the excitement of space life.',
            image: `${CAROUSEL_IMAGES}/space.svg`,
            index: 5,
            label: 'Show space slide',
            dotClass: 'dot'
        },
        {
            id: 7,
            title: 'Waterfall Life',
            description: 'Experience the excitement of waterfall life.',
            image: `${CAROUSEL_IMAGES}/waterfall.svg`,
            index: 6,
            label: 'Show waterfall slide',
            dotClass: 'dot'
        }
    ];

    get currentSlide() {
        return this.slides[this.currentIndex];
    }

    get pauseLabel() {
        return this.autoplayEnabled ? 'Pause' : 'Resume';
    }

    get pauseIcon() {
        return this.autoplayEnabled ? 'utility:pause' : 'utility:play';
    }

    connectedCallback() {
        this.startAutoplay();
    }

    disconnectedCallback() {
        this.stopAutoplay();
    }

    startAutoplay() {
        this.stopAutoplay();

        if (this.autoplayEnabled) {
            this.timerId = setInterval(() => {
                this.handleNext();
            }, 4000);
        }
    }

    stopAutoplay() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = undefined;
        }
    }

    handleNext() {
        this.currentIndex =
            (this.currentIndex + 1) % this.slides.length;

        this.updateIndicators();
    }

    handlePrevious() {
        this.currentIndex =
            (this.currentIndex - 1 + this.slides.length) %
            this.slides.length;

        this.updateIndicators();
    }

    handleIndicator(event) {
        this.currentIndex = Number(event.currentTarget.dataset.index);
        this.updateIndicators();
    }

    toggleAutoplay() {
        this.autoplayEnabled = !this.autoplayEnabled;

        if (this.autoplayEnabled) {
            this.startAutoplay();
        } else {
            this.stopAutoplay();
        }
    }

    updateIndicators() {
        this.slides = this.slides.map((slide, index) => ({
            ...slide,
            dotClass: index === this.currentIndex
                ? 'dot active-dot'
                : 'dot'
        }));
    }
}
