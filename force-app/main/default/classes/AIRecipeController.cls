public with sharing class AIRecipeController {
    private static final String PROMPT_TEMPLATE_API_NAME = 'AI_Recipe_Generator';

    @AuraEnabled
    public static String generateRecipe(
        String ingredients,
        String cuisine,
        String mealType,
        String dietaryPreference,
        Integer servings
    ) {
        validateInputs(ingredients, cuisine, mealType, dietaryPreference, servings);

        try {
            Map<String, ConnectApi.WrappedValue> inputParams =
                new Map<String, ConnectApi.WrappedValue>();

            inputParams.put('Input:Ingredients', wrapValue(ingredients.trim()));
            inputParams.put('Input:Cuisine', wrapValue(String.isBlank(cuisine) ? 'Any' : cuisine.trim()));
            inputParams.put('Input:MealType', wrapValue(String.isBlank(mealType) ? 'Any' : mealType.trim()));
            inputParams.put(
                'Input:DietaryPreference',
                wrapValue(String.isBlank(dietaryPreference) ? 'No specific restriction' : dietaryPreference.trim())
            );
            inputParams.put('Input:Servings', wrapValue(String.valueOf(servings)));

            ConnectApi.EinsteinPromptTemplateGenerationsInput request =
                new ConnectApi.EinsteinPromptTemplateGenerationsInput();
            request.isPreview = false;
            request.inputParams = inputParams;
            request.additionalConfig = new ConnectApi.EinsteinLlmAdditionalConfigInput();
            request.additionalConfig.applicationName = 'PromptTemplateGenerationsInvocable';

            ConnectApi.EinsteinPromptTemplateGenerationsRepresentation result =
                ConnectApi.EinsteinLLM.generateMessagesForPromptTemplate(
                    PROMPT_TEMPLATE_API_NAME,
                    request
                );

            if (result == null || result.generations == null || result.generations.isEmpty()) {
                throw new AuraHandledException('The AI service did not return a recipe. Please try again.');
            }

            String generatedText = result.generations[0].text;
            if (String.isBlank(generatedText)) {
                throw new AuraHandledException('The AI service returned an empty recipe. Please try again.');
            }

            return normalizeJson(generatedText);
        } catch (AuraHandledException handledException) {
            throw handledException;
        } catch (Exception exceptionValue) {
            // Keep internal implementation details out of the client-facing error.
            System.debug(LoggingLevel.ERROR, 'AI recipe generation failed: ' + exceptionValue.getMessage());
            throw new AuraHandledException(
                'Recipe generation failed. Check Prompt Builder access, template activation, and org AI availability.'
            );
        }
    }

    private static ConnectApi.WrappedValue wrapValue(String inputValue) {
        ConnectApi.WrappedValue wrapped = new ConnectApi.WrappedValue();
        wrapped.value = inputValue;
        return wrapped;
    }

    private static void validateInputs(
        String ingredients,
        String cuisine,
        String mealType,
        String dietaryPreference,
        Integer servings
    ) {
        if (String.isBlank(ingredients)) {
            throw new AuraHandledException('Please enter at least one ingredient.');
        }
        if (ingredients.length() > 1500) {
            throw new AuraHandledException('Please keep the ingredient list under 1,500 characters.');
        }
        if (servings == null || servings < 1 || servings > 20) {
            throw new AuraHandledException('Servings must be between 1 and 20.');
        }
        if (cuisine != null && cuisine.length() > 80) {
            throw new AuraHandledException('Cuisine must be 80 characters or fewer.');
        }
        if (mealType != null && mealType.length() > 80) {
            throw new AuraHandledException('Meal type must be 80 characters or fewer.');
        }
        if (dietaryPreference != null && dietaryPreference.length() > 200) {
            throw new AuraHandledException('Dietary preference must be 200 characters or fewer.');
        }
    }

    @TestVisible
    private static String normalizeJson(String responseText) {
        String cleaned = responseText == null ? '' : responseText.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.substring(7).trim();
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.substring(3).trim();
        }
        if (cleaned.endsWith('```')) {
            cleaned = cleaned.substring(0, cleaned.length() - 3).trim();
        }
        // Validate that the model returned JSON before passing it to the browser.
        Object parsed = JSON.deserializeUntyped(cleaned);
        if (!(parsed instanceof Map<String, Object>)) {
            throw new AuraHandledException('The AI response was not a JSON object. Please try again.');
        }
        return cleaned;
    }
}
