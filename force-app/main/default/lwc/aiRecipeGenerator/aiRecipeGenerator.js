import { LightningElement } from 'lwc';
import generateRecipe from '@salesforce/apex/AIRecipeController.generateRecipe';

export default class AiRecipeGenerator extends LightningElement {
    ingredients = '';
    cuisine = 'Any';
    mealType = 'Dinner';
    dietaryPreference = 'No restriction';
    servings = '2';
    recipe;
    isLoading = false;
    errorMessage;

    cuisineOptions = [
        { label: 'Any cuisine', value: 'Any' },
        { label: 'Indian', value: 'Indian' },
        { label: 'Italian', value: 'Italian' },
        { label: 'Chinese', value: 'Chinese' },
        { label: 'Mexican', value: 'Mexican' },
        { label: 'Mediterranean', value: 'Mediterranean' }
    ];

    mealOptions = [
        { label: 'Breakfast', value: 'Breakfast' },
        { label: 'Lunch', value: 'Lunch' },
        { label: 'Dinner', value: 'Dinner' },
        { label: 'Snack', value: 'Snack' },
        { label: 'Dessert', value: 'Dessert' }
    ];

    dietOptions = [
        { label: 'No restriction', value: 'No restriction' },
        { label: 'Vegetarian', value: 'Vegetarian' },
        { label: 'Vegan', value: 'Vegan' },
        { label: 'Gluten-free', value: 'Gluten-free' },
        { label: 'Dairy-free', value: 'Dairy-free' },
        { label: 'High-protein', value: 'High-protein' }
    ];

    servingOptions = [1, 2, 3, 4, 5, 6, 8, 10].map(value => ({
        label: String(value),
        value: String(value)
    }));

    get isGenerateDisabled() {
        return this.isLoading || !this.ingredients.trim();
    }

    get prepTimeLabel() {
        return `${this.recipe?.prepTimeMinutes ?? 0} min`;
    }

    get cookTimeLabel() {
        return `${this.recipe?.cookTimeMinutes ?? 0} min`;
    }

    get numberedInstructions() {
        return (this.recipe?.instructions || []).map((text, index) => ({
            id: `step-${index + 1}`,
            number: index + 1,
            text
        }));
    }

    handleIngredientsChange(event) {
        this.ingredients = event.detail.value;
    }
    handleCuisineChange(event) {
        this.cuisine = event.detail.value;
    }
    handleMealChange(event) {
        this.mealType = event.detail.value;
    }
    handleDietChange(event) {
        this.dietaryPreference = event.detail.value;
    }
    handleServingsChange(event) {
        this.servings = event.detail.value;
    }

    async handleGenerate() {
        this.errorMessage = undefined;
        this.recipe = undefined;

        if (!this.ingredients.trim()) {
            this.errorMessage = 'Please enter at least one ingredient.';
            return;
        }

        this.isLoading = true;
        try {
            const rawResponse = await generateRecipe({
                ingredients: this.ingredients,
                cuisine: this.cuisine,
                mealType: this.mealType,
                dietaryPreference: this.dietaryPreference,
                servings: Number(this.servings)
            });

            const parsed = JSON.parse(rawResponse);
            this.validateRecipe(parsed);
            this.recipe = {
                ...parsed,
                ingredients: parsed.ingredients || [],
                instructions: parsed.instructions || [],
                chefTips: parsed.chefTips || [],
                nutrition: parsed.nutrition || {}
            };
        } catch (error) {
            this.errorMessage =
                error?.body?.message ||
                (error instanceof SyntaxError
                    ? 'The AI response was not valid JSON. Review the Prompt Template instructions and try again.'
                    : 'Unable to generate the recipe. Check your Prompt Builder setup and try again.');
        } finally {
            this.isLoading = false;
        }
    }

    validateRecipe(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('Invalid recipe response.');
        }
        const requiredKeys = ['title', 'ingredients', 'instructions', 'chefTips'];
        const missing = requiredKeys.some(key => !(key in value));
        if (missing || !Array.isArray(value.ingredients) ||
            !Array.isArray(value.instructions) || !Array.isArray(value.chefTips)) {
            throw new Error('The AI response is missing required recipe fields.');
        }
    }

    handleReset() {
        this.recipe = undefined;
        this.errorMessage = undefined;
    }
}