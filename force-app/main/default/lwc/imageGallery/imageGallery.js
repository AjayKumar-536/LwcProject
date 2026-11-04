import { LightningElement } from 'lwc';
import GALLERY_IMAGES from '@salesforce/resourceUrl/galleryImages';

const PHOTOS = [
    {
        id: 'nature',
        title: 'Quiet Nature',
        category: 'Nature',
        file: 'nature.svg',
        alt: 'Green hills and a peaceful valley',
        description: 'A peaceful view surrounded by green hills.'
    },
    {
        id: 'mountains',
        title: 'Mountain Escape',
        category: 'Nature',
        file: 'mountains.svg',
        alt: 'Mountain peaks beneath the sky',
        description: 'Mountain scenery for a moment of calm.'
    },
    {
        id: 'city',
        title: 'City Lights',
        category: 'City',
        file: 'city.svg',
        alt: 'Stylized city skyline at dusk',
        description: 'A vibrant city skyline at the end of the day.'
    },
    {
        id: 'beach',
        title: 'Coastal Breeze',
        category: 'Travel',
        file: 'beach.svg',
        alt: 'Blue sea beside a sandy beach',
        description: 'A sunny beach with blue water and soft sand.'
    },
    {
        id: 'forest',
        title: 'Forest Trail',
        category: 'Nature',
        file: 'forest.svg',
        alt: 'A trail through a green forest',
        description: 'A quiet trail through a green forest.'
    },
    {
        id: 'architecture',
        title: 'Modern Lines',
        category: 'City',
        file: 'architecture.svg',
        alt: 'Modern geometric architecture',
        description: 'Modern architecture with clean geometric lines.'
    }
];

export default class ImageGallery extends LightningElement {
    selectedCategory = 'All';
    selectedImageId;
    isLightboxOpen = false;

    get images() {
        return PHOTOS.map((photo) => ({
            ...photo,
            src: `${GALLERY_IMAGES}/${photo.file}`,
            openLabel: `Open ${photo.title}`
        }));
    }

    get categories() {
        const names = ['All', ...new Set(PHOTOS.map((photo) => photo.category))];
        return names.map((value) => ({
            value,
            label: value,
            cssClass: value === this.selectedCategory ? 'filter active' : 'filter'
        }));
    }

    get filteredImages() {
        return this.images.filter(
            (photo) => this.selectedCategory === 'All' || photo.category === this.selectedCategory
        );
    }

    get visibleCount() {
        return this.filteredImages.length;
    }

    get hasImages() {
        return this.filteredImages.length > 0;
    }

    get selectedImage() {
        return this.images.find((photo) => photo.id === this.selectedImageId) || this.images[0];
    }

    handleCategoryClick(event) {
        this.selectedCategory = event.currentTarget.dataset.category;
    }

    openLightbox(event) {
        this.selectedImageId = event.currentTarget.dataset.id;
        this.isLightboxOpen = true;
    }

    closeLightbox() {
        this.isLightboxOpen = false;
    }

    showPrevious() {
        const list = this.filteredImages;
        const index = list.findIndex((photo) => photo.id === this.selectedImageId);
        const nextIndex = index <= 0 ? list.length - 1 : index - 1;
        if (list[nextIndex]) {
            this.selectedImageId = list[nextIndex].id;
        }
    }

    showNext() {
        const list = this.filteredImages;
        const index = list.findIndex((photo) => photo.id === this.selectedImageId);
        const nextIndex = index >= list.length - 1 ? 0 : index + 1;
        if (list[nextIndex]) {
            this.selectedImageId = list[nextIndex].id;
        }
    }

    connectedCallback() {
        this._handleKeydown = (event) => {
            if (!this.isLightboxOpen) {
                return;
            }
            if (event.key === 'Escape') {
                this.closeLightbox();
            } else if (event.key === 'ArrowLeft') {
                this.showPrevious();
            } else if (event.key === 'ArrowRight') {
                this.showNext();
            }
        };
        window.addEventListener('keydown', this._handleKeydown);
    }

    disconnectedCallback() {
        window.removeEventListener('keydown', this._handleKeydown);
    }
}