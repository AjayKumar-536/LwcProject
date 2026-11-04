import { createElement } from '@lwc/engine-dom';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import ThirdPartyFiles from 'c/thirdPartyFiles';

jest.mock('lightning/platformResourceLoader', () => ({
    loadScript: jest.fn(),
    loadStyle: jest.fn()
}));

describe('c-third-party-files', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        delete window.moment;
        jest.restoreAllMocks();
    });

    it('displays the date when Moment loads even if the stylesheet fails', async () => {
        loadScript.mockResolvedValue();
        loadStyle.mockRejectedValue(new Error('stylesheet load failed'));
        window.moment = jest.fn(() => ({
            format: jest.fn(() => 'Monday, October 6, 2026 8:00 PM')
        }));
        jest.spyOn(console, 'error').mockImplementation(() => {});

        const element = createElement('c-third-party-files', {
            is: ThirdPartyFiles
        });
        document.body.appendChild(element);

        await Promise.resolve();
        await Promise.resolve();

        expect(element.shadowRoot.textContent).toContain('Monday, October 6, 2026 8:00 PM');
        expect(element.shadowRoot.textContent).toContain('The animation stylesheet could not be loaded.');
        expect(window.moment).toHaveBeenCalled();
    });
});