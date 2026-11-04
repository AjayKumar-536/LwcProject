
import { LightningElement } from 'lwc';
import GALLERY from '@salesforce/resourceUrl/GalleryImagess';

export default class ColorfulGallery extends LightningElement {
    selectedCategory = 'All';
    searchTerm = '';
    selectedImage = null;
    favorites = [];

    images = [
        {
            id: 1,
            title: 'Mountain Escape',
            category: 'Nature',
            description: 'Discover the beauty of peaceful mountain landscapes.',
            image: `${GALLERY}/nature.jpg`,
            color: 'nature-card'
        },
        {
            id: 2,
            title: 'Colorful Creativity',
            category: 'Art',
            description: 'Explore a world of color, imagination, and creativity.',
            image: `${GALLERY}/art.jpg`,
            color: 'art-card'
        },
        {
            id: 3,
            title: 'Modern Spaces',
            category: 'Architecture',
            description: 'Experience inspiring architectural designs.',
            image: `${GALLERY}/architecture.jpg`,
            color: 'architecture-card'
        },
        {
            id: 4,
            title: 'Floral Dreams',
            category: 'Flowers',
            description: 'Enjoy the beauty and colors of nature.',
            image: `${GALLERY}/flowers.jpg`,
            color: 'flowers-card'
        },
        {
            id: 5,
            title: 'Mountain Escape',
            category: 'Nature',
            description: 'Discover the beauty of peaceful mountain landscapes.',
            image: `${GALLERY}/nature1.jpg`,
            color: 'nature-card'
        },
        {
            id: 6,
            title: 'Colorful Creativity',
            category: 'Art',
            description: 'Explore a world of color, imagination, and creativity.',
            image: `${GALLERY}/art1.jpg`,
            color: 'art-card'
        },
        {
            id: 7,
            title: 'Modern Spaces',
            category: 'Architecture',
            description: 'Experience inspiring architectural designs.',
            image: `${GALLERY}/architecture1.jpg`,
            color: 'architecture-card'
        },
        {
            id: 8,
            title: 'Floral Dreams',
            category: 'Flowers',
            description: 'Enjoy the beauty and colors of nature.',
            image: `${GALLERY}/flowers1.jpg`,
            color: 'flowers-card'
        },
         {
            id: 9,
            title: 'Mountain Escape',
            category: 'Nature',
            description: 'Discover the beauty of peaceful mountain landscapes.',
            image: `${GALLERY}/nature2.jpg`,
            color: 'nature-card'
        },
        {
            id: 10,
            title: 'Colorful Creativity',
            category: 'Art',
            description: 'Explore a world of color, imagination, and creativity.',
            image: `${GALLERY}/art2.jpg`,
            color: 'art-card'
        },
        {
            id: 11,
            title: 'Modern Spaces',
            category: 'Architecture',
            description: 'Experience inspiring architectural designs.',
            image: `${GALLERY}/architecture2.jpg`,
            color: 'architecture-card'
        },
        {
            id: 12,
            title: 'Floral Dreams',
            category: 'Flowers',
            description: 'Enjoy the beauty and colors of nature.',
            image: `${GALLERY}/flowers2.jpg`,
            color: 'flowers-card'
        },
         {
            id: 13,
            title: 'Mountain Escape',
            category: 'Nature',
            description: 'Discover the beauty of peaceful mountain landscapes.',
            image: `${GALLERY}/nature3.jpg`,
            color: 'nature-card'
        },
        {
            id: 14,
            title: 'Colorful Creativity',
            category: 'Art',
            description: 'Explore a world of color, imagination, and creativity.',
            image: `${GALLERY}/art3.jpg`,
            color: 'art-card'
        },
        {
            id: 15,
            title: 'Modern Spaces',
            category: 'Architecture',
            description: 'Experience inspiring architectural designs.',
            image: `${GALLERY}/architecture3.jpg`,
            color: 'architecture-card'
        },
        {
            id: 16,
            title: 'Floral Dreams',
            category: 'Flowers',
            description: 'Enjoy the beauty and colors of nature.',
            image: `${GALLERY}/flowers3.jpg`,
            color: 'flowers-card'
        }
    ];

    categories = [
        { label: 'All', value: 'All' },
        { label: 'Nature', value: 'Nature' },
        { label: 'Art', value: 'Art' },
        { label: 'Architecture', value: 'Architecture' },
        { label: 'Flowers', value: 'Flowers' }
    ];

    handleCategoryChange(event) {
        this.selectedCategory = event.detail.value;
    }

    handleSearch(event) {
        this.searchTerm = event.target.value;
    }

    get filteredImages() {
        const search = this.searchTerm.toLowerCase().trim();

        return this.images
            .filter(image =>
                this.selectedCategory === 'All' ||
                image.category === this.selectedCategory
            )
            .filter(image =>
                image.title.toLowerCase().includes(search) ||
                image.category.toLowerCase().includes(search)
            )
            .map(image => ({
                ...image,
                isFavorite: this.favorites.includes(image.id),
                favoriteIcon: this.favorites.includes(image.id)
                    ? 'utility:favorite'
                    : 'utility:like'
            }));
    }

    get totalImages() {
        return this.images.length;
    }

    get favoriteCount() {
        return this.favorites.length;
    }

    get hasImages() {
        return this.filteredImages.length > 0;
    }

    toggleFavorite(event) {
        const id = Number(event.currentTarget.dataset.id);

        this.favorites = this.favorites.includes(id)
            ? this.favorites.filter(item => item !== id)
            : [...this.favorites, id];
    }

    openPreview(event) {
        const id = Number(event.currentTarget.dataset.id);

        this.selectedImage = this.images.find(image => image.id === id);
    }

    closePreview() {
        this.selectedImage = null;
    }

    stopPropagation(event) {
        event.stopPropagation();
    }
}
