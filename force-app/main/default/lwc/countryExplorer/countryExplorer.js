import { LightningElement } from 'lwc';
import COUNTRY_ASSETS from '@salesforce/resourceUrl/countryAssets';

const COUNTRIES = [
    { code: 'IN', name: 'India', capital: 'New Delhi', region: 'Asia', population: 1428600000, currency: 'Indian rupee (INR)', languages: 'Hindi, English and others' },
    { code: 'JP', name: 'Japan', capital: 'Tokyo', region: 'Asia', population: 124500000, currency: 'Japanese yen (JPY)', languages: 'Japanese' },
    { code: 'SG', name: 'Singapore', capital: 'Singapore', region: 'Asia', population: 5920000, currency: 'Singapore dollar (SGD)', languages: 'English, Malay, Mandarin, Tamil' },
    { code: 'FR', name: 'France', capital: 'Paris', region: 'Europe', population: 68000000, currency: 'Euro (EUR)', languages: 'French' },
    { code: 'DE', name: 'Germany', capital: 'Berlin', region: 'Europe', population: 84500000, currency: 'Euro (EUR)', languages: 'German' },
    { code: 'IT', name: 'Italy', capital: 'Rome', region: 'Europe', population: 58900000, currency: 'Euro (EUR)', languages: 'Italian' },
    { code: 'BR', name: 'Brazil', capital: 'Brasília', region: 'Americas', population: 216400000, currency: 'Brazilian real (BRL)', languages: 'Portuguese' },
    { code: 'CA', name: 'Canada', capital: 'Ottawa', region: 'Americas', population: 40000000, currency: 'Canadian dollar (CAD)', languages: 'English, French' },
    { code: 'US', name: 'United States', capital: 'Washington, D.C.', region: 'Americas', population: 334900000, currency: 'US dollar (USD)', languages: 'English (widely used)' },
    { code: 'AU', name: 'Australia', capital: 'Canberra', region: 'Oceania', population: 26600000, currency: 'Australian dollar (AUD)', languages: 'English (widely used)' },
    { code: 'NZ', name: 'New Zealand', capital: 'Wellington', region: 'Oceania', population: 5300000, currency: 'New Zealand dollar (NZD)', languages: 'English, Māori, NZ Sign Language' },
    { code: 'EG', name: 'Egypt', capital: 'Cairo', region: 'Africa', population: 112700000, currency: 'Egyptian pound (EGP)', languages: 'Arabic' },
    { code: 'ZA', name: 'South Africa', capital: 'Pretoria (executive)', region: 'Africa', population: 60400000, currency: 'South African rand (ZAR)', languages: 'Multiple official languages' },
    { code: 'NG', name: 'Nigeria', capital: 'Abuja', region: 'Africa', population: 223800000, currency: 'Nigerian naira (NGN)', languages: 'English and others' }
];

export default class CountryExplorer extends LightningElement {
    searchTerm = '';
    selectedRegion = 'All regions';
    sortOrder = 'largest';
    selectedCode;

    get countries() {
        return COUNTRIES.map((country) => ({
            ...country,
            flagUrl: `${COUNTRY_ASSETS}/flags/${country.code.toLowerCase()}.svg`,
            flagAlt: `Flag of ${country.name}`,
            populationLabel: new Intl.NumberFormat('en-US', {
                notation: 'compact',
                maximumFractionDigits: 1
            }).format(country.population),
            cardClass: country.code === this.selectedCode ? 'country-card selected' : 'country-card'
        }));
    }

    get regions() {
        return ['All regions', ...new Set(COUNTRIES.map((country) => country.region))];
    }

    get visibleCountries() {
        const query = this.searchTerm.trim().toLowerCase();

        const filtered = this.countries.filter((country) => {
            const matchesSearch =
                country.name.toLowerCase().includes(query) ||
                country.capital.toLowerCase().includes(query);
            const matchesRegion =
                this.selectedRegion === 'All regions' ||
                country.region === this.selectedRegion;
            return matchesSearch && matchesRegion;
        });

        return filtered.sort((a, b) => {
            if (this.sortOrder === 'smallest') {
                return a.population - b.population;
            }
            if (this.sortOrder === 'name') {
                return a.name.localeCompare(b.name);
            }
            return b.population - a.population;
        });
    }

    get filteredCount() {
        return this.visibleCountries.length;
    }

    get hasCountries() {
        return this.visibleCountries.length > 0;
    }

    get selectedCountry() {
        return this.countries.find((country) => country.code === this.selectedCode);
    }

    get hasSelectedCountry() {
        return Boolean(this.selectedCountry);
    }

    handleSearch(event) {
        this.searchTerm = event.target.value;
    }

    handleRegionChange(event) {
        this.selectedRegion = event.target.value;
    }

    handleSortChange(event) {
        this.sortOrder = event.target.value;
    }

    selectCountry(event) {
        this.selectedCode = event.currentTarget.dataset.code;
    }

    clearSelection() {
        this.selectedCode = undefined;
    }

    resetFilters() {
        this.searchTerm = '';
        this.selectedRegion = 'All regions';
        this.sortOrder = 'largest';
        this.selectedCode = undefined;
    }
}