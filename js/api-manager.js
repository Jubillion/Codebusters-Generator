// API Management for Quote Fetching
import { CONFIG } from './config.js';

export class ApiManager {
    constructor() {
        this.apiKeyToggle = null;
        this.apiKeyInput = null;
        this.apiKeyContainer = null;
        this.apiKeyStatus = null;
    }

    initializeElements(elements) {
        this.apiKeyToggle = elements.apiKeyToggle;
        this.apiKeyInput = elements.apiKeyInput;
        this.apiKeyContainer = elements.apiKeyContainer;
        this.apiKeyStatus = elements.apiKeyStatus;
    }

    bindEvents() {
        if (this.apiKeyToggle) {
            this.apiKeyToggle.addEventListener('change', () => this.toggleApiKeyInput());
        }
        if (this.apiKeyInput) {
            this.apiKeyInput.addEventListener('input', () => this.validateApiKey());
            this.apiKeyInput.addEventListener('blur', () => this.saveApiKey());
        }
    }

    toggleApiKeyInput() {
        if (this.apiKeyToggle.checked) {
            this.apiKeyContainer.style.display = 'block';
            this.loadSavedApiKey();
        } else {
            this.apiKeyContainer.style.display = 'none';
            this.clearApiKey();
        }
    }

    validateApiKey() {
        const key = this.apiKeyInput.value.trim();
        if (key.length === 0) {
            this.apiKeyStatus.textContent = '';
            this.apiKeyStatus.className = 'api-key-status';
        } else if (key.length < 10) {
            this.apiKeyStatus.textContent = 'API key appears too short';
            this.apiKeyStatus.className = 'api-key-status invalid';
        } else {
            this.apiKeyStatus.textContent = 'API key looks valid';
            this.apiKeyStatus.className = 'api-key-status valid';
        }
    }

    saveApiKey() {
        const key = this.apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('zenquotes_api_key', key);
        } else {
            localStorage.removeItem('zenquotes_api_key');
        }
    }

    loadSavedApiKey() {
        const savedKey = localStorage.getItem('zenquotes_api_key');
        if (savedKey) {
            this.apiKeyInput.value = savedKey;
            this.validateApiKey();
        }
    }

    clearApiKey() {
        this.apiKeyInput.value = '';
        this.apiKeyStatus.textContent = '';
        this.apiKeyStatus.className = 'api-key-status';
        localStorage.removeItem('zenquotes_api_key');
    }

    getApiKey() {
        if (this.apiKeyToggle && this.apiKeyToggle.checked) {
            return this.apiKeyInput.value.trim() || null;
        }
        return null;
    }

    async fetchQuote() {
        const apiKey = this.getApiKey();
        
        if (apiKey) {
            // Use API key for unlimited requests
            return await this.fetchQuoteWithKey(apiKey);
        } else {
            // Use free tier with fallbacks
            return await this.fetchQuoteFromApi();
        }
    }

    async fetchQuoteWithKey(apiKey) {
        try {
            const response = await fetch(`https://zenquotes.io/api/random/${apiKey}`, {
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data && data.length > 0) {
                return data[0];
            } else {
                throw new Error('No quote data received');
            }
        } catch (error) {
            console.error('Error with API key request:', error);
            
            // If API key fails, fall back to free tier
            this.displayWarning('API key request failed, falling back to free tier');
            return await this.fetchQuoteFromApi();
        }
    }

    async fetchQuoteFromApi() {
        try {
            // Try to use a CORS proxy first
            let response;
            let data;
            
            try {
                // Attempt 1: Try direct API call
                response = await fetch('https://zenquotes.io/api/random', {
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                data = await response.json();
            } catch (corsError) {
                console.log('Direct API call failed, trying CORS proxy:', corsError);
                
                // Attempt 2: Try with a CORS proxy
                try {
                    response = await fetch('https://api.allorigins.win/get?url=https://zenquotes.io/api/random', {
                        headers: {
                            'Accept': 'application/json',
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const proxyData = await response.json();
                    data = JSON.parse(proxyData.contents);
                } catch (proxyError) {
                    console.log('CORS proxy also failed:', proxyError);
                    throw corsError; // Use original error
                }
            }
            
            if (data && data.length > 0) {
                return data[0];
            } else {
                throw new Error('No quote received');
            }
        } catch (error) {
            console.log('All API attempts failed, using fallback quotes:', error);
            // Use fallback quotes when API is not accessible
            return this.getFallbackQuote();
        }
    }

    getFallbackQuote() {
        const randomIndex = Math.floor(Math.random() * CONFIG.FALLBACK_QUOTES.length);
        return CONFIG.FALLBACK_QUOTES[randomIndex];
    }

    displayWarning(message) {
        // Add warning message near API key status
        if (this.apiKeyStatus) {
            this.apiKeyStatus.textContent = message;
            this.apiKeyStatus.className = 'api-key-status warning';
            setTimeout(() => {
                this.validateApiKey(); // Reset to normal validation
            }, 3000);
        }
    }

    updateAttribution(show) {
        const attribution = document.querySelector('.attribution');
        if (attribution) {
            attribution.style.display = show ? 'block' : 'none';
        }
    }
}
