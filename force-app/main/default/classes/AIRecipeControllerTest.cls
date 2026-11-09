@IsTest
private class AIRecipeControllerTest {
    @IsTest
    static void normalizeJsonAcceptsPlainJson() {
        String input = '{"title":"Tomato Rice","ingredients":[]}';
        String actual = AIRecipeController.normalizeJson(input);
        System.assertEquals(input, actual);
    }

    @IsTest
    static void normalizeJsonRemovesMarkdownFence() {
        String input = '```json\n{"title":"Tomato Rice"}\n```';
        String actual = AIRecipeController.normalizeJson(input);
        System.assertEquals('{"title":"Tomato Rice"}', actual);
    }

    @IsTest
    static void normalizeJsonRejectsArrayRoot() {
        try {
            AIRecipeController.normalizeJson('[{"title":"Dish"}]');
            System.assert(false, 'Expected invalid root JSON to be rejected.');
        } catch (Exception expectedException) {
            System.assert(expectedException.getMessage().contains('JSON object'));
        }
    }
}
