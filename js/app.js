// Main Application - Coordinates all modules
import { CONFIG, KeywordGenerator } from './config.js';
import { ApiManager } from './api-manager.js';
import { CipherEngine } from './cipher-engine.js';
import { UIManager } from './ui-manager.js';
import { Validator } from './validator.js';

export class QuoteCipher {
    constructor() {
        // Initialize all modules
        this.keywordGenerator = new KeywordGenerator();
        this.apiManager = new ApiManager();
        this.cipherEngine = new CipherEngine();
        this.uiManager = new UIManager();
        this.validator = new Validator();
        
        // Initialize the application
        this.init();
    }

    init() {
        // Initialize UI elements
        const elements = this.uiManager.initializeElements();
        
        // Initialize API manager with elements
        this.apiManager.initializeElements(elements);
        
        // Bind all events
        this.bindEvents();
        
        // Generate random alphabet for random cipher
        this.randomAlphabet = this.keywordGenerator.generateRandomAlphabet();
    }

    bindEvents() {
        // Bind UI events
        this.uiManager.bindEvents({
            onGetQuote: () => this.fetchAndEncodeQuote(),
            onCipherChange: () => this.onCipherChange()
        });
        
        // Bind API events
        this.apiManager.bindEvents();
    }

    onCipherChange() {
        // Update button visibility based on cipher type
        this.uiManager.resetRevealButtons();
        
        // Re-encode current quote if exists
        if (this.uiManager.currentQuote) {
            this.encodeCurrentQuote();
        }
    }

    async fetchAndEncodeQuote() {
        try {
            this.uiManager.showLoading(true);
            
            // Fetch quote from API
            const quote = await this.apiManager.fetchQuote();
            
            // Generate new random keywords for each new quote
            this.keywordGenerator.regenerate();
            
            // Encode the quote
            this.encodeQuote(quote.q, quote.a);
            
            // Show attribution only if no API key is used
            const hasApiKey = this.apiManager.getApiKey() !== null;
            this.apiManager.updateAttribution(!hasApiKey);
            
        } catch (error) {
            console.error('Error fetching quote:', error);
            this.uiManager.displayError('Failed to fetch quote. Please try again.');
        } finally {
            this.uiManager.showLoading(false);
        }
    }

    encodeQuote(quote, author) {
        this.encodeCurrentQuote(quote, author);
    }

    encodeCurrentQuote(quote = this.uiManager.currentQuote, author = this.uiManager.currentAuthor) {
        if (!quote) return;

        const selectedCipher = this.uiManager.getSelectedCipher();
        const keywords = this.keywordGenerator.currentKeywords;
        
        let cipherResult;
        let cipherDescription = '';

        switch (selectedCipher) {
            case 'k1':
                cipherResult = this.cipherEngine.k1Cipher(quote, keywords.k1);
                cipherResult.keyword = keywords.k1;
                cipherDescription = `K1 - Mixed plaintext alphabet, standard ciphertext | Author: ${author}`;
                this.validator.validateAndFixKeywordPositioning('k1', cipherResult);
                break;
                
            case 'k2':
                cipherResult = this.cipherEngine.k2Cipher(quote, keywords.k2);
                cipherResult.keyword = keywords.k2;
                cipherDescription = `K2 - Standard plaintext, mixed ciphertext alphabet | Author: ${author}`;
                this.validator.validateAndFixKeywordPositioning('k2', cipherResult);
                break;
                
            case 'k3':
                cipherResult = this.cipherEngine.k3Cipher(quote, keywords.k3);
                cipherResult.keyword = keywords.k3;
                cipherDescription = `K3 - Both alphabets mixed with same keyword | Author: ${author}`;
                this.validator.validateAndFixKeywordPositioning('k3', cipherResult);
                break;
                
            case 'k1-patristocrat':
                cipherResult = this.cipherEngine.k1Cipher(quote, keywords.k1);
                cipherResult.keyword = keywords.k1;
                // Remove all non-alphabetical characters for Patristocrat
                cipherResult.encodedText = cipherResult.encodedText.replace(/[^A-Za-z]/g, '');
                cipherDescription = `K1 Patristocrat - Mixed plaintext alphabet, no spaces/punctuation | Author: ${author}`;
                this.validator.validateAndFixKeywordPositioning('k1', cipherResult);
                break;
                
            case 'k2-patristocrat':
                cipherResult = this.cipherEngine.k2Cipher(quote, keywords.k2);
                cipherResult.keyword = keywords.k2;
                // Remove all non-alphabetical characters for Patristocrat
                cipherResult.encodedText = cipherResult.encodedText.replace(/[^A-Za-z]/g, '');
                cipherDescription = `K2 Patristocrat - Mixed ciphertext alphabet, no spaces/punctuation | Author: ${author}`;
                this.validator.validateAndFixKeywordPositioning('k2', cipherResult);
                break;
                
            // K4 LEGACY CODE - Included for reference only - DO NOT MODIFY
            case 'k4':
                cipherResult = this.cipherEngine.k4Cipher(quote, keywords.k4Plaintext, keywords.k4Ciphertext);
                cipherResult.plaintextKeyword = keywords.k4Plaintext;
                cipherResult.ciphertextKeyword = keywords.k4Ciphertext;
                cipherDescription = `K4 - Both alphabets mixed with different keywords | Author: ${author}`;
                this.validator.validateAndFixKeywordPositioning('k4', cipherResult);
                break;
                
            case 'random':
                cipherResult = this.cipherEngine.randomCipher(quote, this.randomAlphabet);
                cipherDescription = `Random alphabet substitution | Author: ${author}`;
                break;
                
            case 'nihilist':
                cipherResult = this.cipherEngine.nihilistCipher(quote, keywords.nihilistPolybius, keywords.nihilistKey);
                cipherResult.polybiusKeyword = keywords.nihilistPolybius;
                cipherResult.nihilistKey = keywords.nihilistKey;
                cipherDescription = `Nihilist cipher with Polybius square | Author: ${author}`;
                break;
                
            case 'porta':
                cipherResult = this.cipherEngine.portaCipher(quote, keywords.porta);
                cipherResult.keyword = keywords.porta;
                cipherDescription = `Porta cipher with keyword substitution | Author: ${author}`;
                break;
                
            case 'columnar':
                cipherResult = this.cipherEngine.columnarCipher(quote);
                cipherDescription = `Complete columnar transposition cipher | Author: ${author}`;
                break;
                
            case 'hill':
                cipherResult = this.cipherEngine.hillCipher(quote);
                cipherDescription = `2x2 Hill cipher | Author: ${author}`;
                break;
        }

        // Display the encoded quote
        this.uiManager.displayQuote(
            quote, 
            author, 
            cipherResult.encodedText, 
            cipherDescription, 
            cipherResult
        );
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuoteCipher();
});

// Add some sample functionality for testing without API
document.addEventListener('keydown', (e) => {
    // Press 'T' to test with a sample quote
    if (e.key.toLowerCase() === 't' && e.ctrlKey) {
        const app = new QuoteCipher();
        app.encodeQuote("The only way to do great work is to love what you do.", "Steve Jobs");
    }
});
