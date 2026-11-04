
import { LightningElement } from 'lwc';

const API_URL =
    'https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,currencies,cca3';

export default class CountryExplorer extends LightningElement {
    countries = [];
    searchKey = '';
    selectedRegion = 'All';
    sortOrder = 'asc';
    isLoading = false;
    errorMessage = '';

    connectedCallback() {
        this.loadCountries();
    }

    async loadCountries() {
        this.isLoading = true;
        this.errorMessage = '';

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('Unable to fetch country data.');
            }

            const data = await response.json();

            this.countries = data.map((item) => {
                const currencyList = Object.values(
                    item.currencies || {}
                );

                return {
                    code: item.cca3,
                    name: item.name?.common || 'Unknown',
                    flag: item.flags?.svg || item.flags?.png || '',
                    flagAlt: item.flags?.alt || 'Country flag',
                    capital: (item.capital || []).join(', ') || 'N/A',
                    region: item.region || 'Other',
                    population: item.population || 0,
                    populationLabel: (
                        item.population || 0
                    ).toLocaleString('en-IN'),
                    currency: currencyList
                        .map((currency) =>
                            `${currency.name} (${currency.symbol || ''})`
                        )
                        .join(', ') || 'N/A'
                };
            });
        } catch (error) {
            this.errorMessage =
                'Could not load countries. Check your internet connection and Salesforce security settings.';
            console.error('Country API error:', error);
        } finally {
            this.isLoading = false;
        }
    }

    handleSearch(event) {
        this.searchKey = event.target.value;
    }

    handleRegion(event) {
        this.selectedRegion = event.target.value;
    }

    handleSort(event) {
        this.sortOrder = event.target.value;
    }

    get visibleCountries() {
        const search = this.searchKey.trim().toLowerCase();

        let results = this.countries.filter((country) => {
            const matchesSearch =
                country.name.toLowerCase().includes(search) ||
                country.capital.toLowerCase().includes(search);

            const matchesRegion =
                this.selectedRegion === 'All' ||
                country.region === this.selectedRegion;

            return matchesSearch && matchesRegion;
        });

        results = [...results];

        if (this.sortOrder === 'asc') {
            results.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        } else if (this.sortOrder === 'desc') {
            results.sort((a, b) =>
                b.name.localeCompare(a.name)
            );
        } else if (this.sortOrder === 'population') {
            results.sort((a, b) =>
                b.population - a.population
            );
        }

        return results;
    }

    get countryCount() {
        return this.visibleCountries.length;
    }

    get hasCountries() {
        return !this.isLoading &&
            !this.errorMessage &&
            this.visibleCountries.length > 0;
    }

    get showEmpty() {
        return !this.isLoading &&
            !this.errorMessage &&
            this.visibleCountries.length === 0;
    }
}
