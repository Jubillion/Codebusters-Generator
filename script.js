// Quote Cipher App - JavaScript
class QuoteCipher {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.currentQuote = null;
        this.currentAuthor = null;
        this.randomAlphabet = null;
        this.initializeAlphabets();
    }

    initializeElements() {
        this.cipherSelect = document.getElementById('cipher-select');
        this.getQuoteBtn = document.getElementById('get-quote-btn');
        this.originalQuote = document.getElementById('original-quote');
        this.encodedQuote = document.getElementById('encoded-quote');
        this.quoteAuthor = document.getElementById('quote-author');
        this.cipherInfo = document.getElementById('cipher-info');
        this.loading = document.getElementById('loading');
        this.revealQuoteBtn = document.getElementById('reveal-quote-btn');
        this.revealKeywordBtn = document.getElementById('reveal-keyword-btn');
        this.revealAlphabetBtn = document.getElementById('reveal-alphabet-btn');
        this.revealedQuoteContent = document.getElementById('revealed-quote-content');
        this.revealedKeywordContent = document.getElementById('revealed-keyword-content');
        this.revealedAlphabetContent = document.getElementById('revealed-alphabet-content');
        this.revealedQuote = document.getElementById('revealed-quote');
        this.revealedKeywords = document.getElementById('revealed-keywords');
        this.revealedAlphabet = document.getElementById('revealed-alphabet');
        
        // API Key elements
        this.apiKeyToggle = document.getElementById('api-key-toggle');
        this.apiKeyInput = document.getElementById('api-key-input');
        this.apiKeyContainer = document.getElementById('api-key-container');
        this.apiKeyStatus = document.getElementById('api-key-status');
    }

    initializeAlphabets() {
        // Standard alphabet
        this.standardAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        // List of 100+ keywords for cipher generation
        this.keywordList = [
            'ADVENTURE', 'BEAUTIFUL', 'CHALLENGE', 'DISCOVERY', 'ELEPHANT', 'FANTASTIC', 'GALAXY', 'HARMONY',
            'IMAGINATION', 'JOURNEY', 'KNOWLEDGE', 'LIGHTHOUSE', 'MOUNTAIN', 'NAUTICAL', 'OCEAN', 'PARADISE',
            'QUALITY', 'RAINBOW', 'SUNSHINE', 'TREASURE', 'UNIVERSE', 'VICTORY', 'WISDOM', 'XENIAL',
            'YELLOW', 'ZEPHYR', 'ACOUSTIC', 'BICYCLE', 'CATHEDRAL', 'DIAMOND', 'ENVELOPE', 'FESTIVAL',
            'GUITAR', 'HURRICANE', 'ISLAND', 'JUNGLE', 'KEYBOARD', 'LANTERN', 'MELODY', 'NOTEBOOK',
            'ORCHESTRA', 'PENGUIN', 'QUANTUM', 'ROCKET', 'SATELLITE', 'TELESCOPE', 'UMBRELLA', 'VOLCANO',
            'WATERFALL', 'XYLOPHONE', 'YACHT', 'ZODIAC', 'ANCHOR', 'BUTTERFLY', 'CRYSTAL', 'DOLPHIN',
            'EMERALD', 'FIREFLY', 'GLACIER', 'HAMSTER', 'ICEBERG', 'JAGUAR', 'KOALA', 'LAVENDER',
            'MONARCH', 'NIGHTFALL', 'OPAL', 'PYRAMID', 'QUARTZ', 'RIVER', 'STARLIGHT', 'THUNDER',
            'UNICORN', 'VIOLET', 'WINDMILL', 'XERUS', 'YEARNING', 'ZENITH', 'ARCTIC', 'BRONZE',
            'COMPASS', 'DESERT', 'ECHO', 'FALCON', 'GOLDEN', 'HORIZON', 'IRIS', 'JUBILEE',
            'KEYSTONE', 'LUNAR', 'MIRROR', 'NEBULA', 'ORCHID', 'PHOENIX', 'QUEST', 'RUBY',
            'SILVER', 'TWILIGHT', 'URBANE', 'VORTEX', 'WHIRLWIND', 'XERARCH', 'ZIRCON', 'AMBER',
            'BRAVE', 'COSMIC', 'DAZZLE', 'ETERNAL', 'FROST', 'GLEAM', 'HERALD', 'IVORY'
        ];
        
        // Generate random keywords for current session
        this.generateRandomKeywords();
        
        // Generate a random alphabet for the random option
        this.generateRandomAlphabet();
    }

    generateRandomKeywords() {
        // Shuffle the keyword list and pick keywords for each cipher type
        const shuffled = [...this.keywordList].sort(() => Math.random() - 0.5);
        this.k1Keyword = shuffled[0];
        this.k2Keyword = shuffled[1];
        this.k3Keyword = shuffled[2];
        this.k4PlaintextKeyword = shuffled[3];
        this.k4CiphertextKeyword = shuffled[4];
    }

    generateRandomAlphabet() {
        const maxAttempts = 10;
        const triedAlphabets = new Set();
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let alphabet = this.standardAlphabet.split('');
            // Fisher-Yates shuffle
            for (let i = alphabet.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [alphabet[i], alphabet[j]] = [alphabet[j], alphabet[i]];
            }
            const shuffledAlphabet = alphabet.join('');
            
            // Check if any letter maps to itself
            let hasIdentity = false;
            for (let i = 0; i < 26; i++) {
                if (shuffledAlphabet[i] === this.standardAlphabet[i]) {
                    hasIdentity = true;
                    break;
                }
            }
            
            if (!hasIdentity && !triedAlphabets.has(shuffledAlphabet)) {
                this.randomAlphabet = shuffledAlphabet;
                return;
            }
            
            triedAlphabets.add(shuffledAlphabet);
        }
        
        // Fallback: use a simple shift of 13 positions
        this.randomAlphabet = this.standardAlphabet.slice(13) + this.standardAlphabet.slice(0, 13);
    }

    bindEvents() {
        this.getQuoteBtn.addEventListener('click', () => this.fetchAndEncodeQuote());
        this.cipherSelect.addEventListener('change', () => {
            if (this.cipherSelect.value === 'random') {
                this.generateRandomAlphabet();
            } else if (['k1', 'k2', 'k3', 'k4'].includes(this.cipherSelect.value)) {
                this.generateRandomKeywords();
            }
            this.encodeCurrentQuote();
        });
        this.revealQuoteBtn.addEventListener('click', () => this.revealQuote());
        this.revealKeywordBtn.addEventListener('click', () => this.revealKeywords());
        this.revealAlphabetBtn.addEventListener('click', () => this.revealAlphabet());
        
        // API Key events
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
            this.apiKeyStatus.textContent = 'API key seems too short';
            this.apiKeyStatus.className = 'api-key-status warning';
        } else {
            this.apiKeyStatus.textContent = 'API key format looks valid';
            this.apiKeyStatus.className = 'api-key-status success';
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

    async fetchAndEncodeQuote() {
        try {
            this.showLoading(true);
            
            const apiKey = this.getApiKey();
            let quote;
            
            if (apiKey) {
                // Use API key for unlimited requests
                quote = await this.fetchQuoteWithKey(apiKey);
            } else {
                // Use free tier with fallbacks
                quote = await this.fetchQuoteFromApi();
            }
            
            this.currentQuote = quote.q;
            this.currentAuthor = quote.a;
            
            // Generate new random keywords for each new quote
            this.generateRandomKeywords();
            
            this.encodeCurrentQuote();
            this.hideRevealSections();
            
            // Show attribution only if no API key is used
            this.updateAttribution(!apiKey);
            
        } catch (error) {
            console.error('Error fetching quote:', error);
            this.displayError('Failed to fetch quote. Please try again.');
        } finally {
            this.showLoading(false);
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
                if (response.status === 401) {
                    throw new Error('Invalid API key');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded');
                } else {
                    throw new Error(`API error: ${response.status}`);
                }
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
        this.showLoading(true);
        
        try {
            // Try to use a CORS proxy first
            let response;
            let data;
            
            try {
                // Attempt 1: Try direct API call
                response = await fetch('https://zenquotes.io/api/random', {
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                data = await response.json();
            } catch (corsError) {
                console.log('Direct API call failed, trying CORS proxy...', corsError);
                
                // Attempt 2: Try with a CORS proxy
                response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
                
                if (!response.ok) {
                    throw new Error(`Proxy HTTP error! status: ${response.status}`);
                }
                
                const proxyData = await response.json();
                data = JSON.parse(proxyData.contents);
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
        const fallbackQuotes = [
            { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
            { q: "Life is what happens to you while you're busy making other plans.", a: "John Lennon" },
            { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
            { q: "In the middle of difficulty lies opportunity.", a: "Albert Einstein" },
            { q: "It is during our darkest moments that we must focus to see the light.", a: "Aristotle" },
            { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
            { q: "The way to get started is to quit talking and begin doing.", a: "Walt Disney" }
        ];
        
        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
        return fallbackQuotes[randomIndex];
    }

    updateAttribution(show) {
        const attribution = document.querySelector('.attribution');
        if (attribution) {
            attribution.style.display = show ? 'block' : 'none';
        }
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

    useFallbackQuote() {
        // Fallback quotes when API is not accessible
        const fallbackQuotes = [
            { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
            { q: "Innovation distinguishes between a leader and a follower.", a: "Steve Jobs" },
            { q: "Life is what happens to you while you're busy making other plans.", a: "John Lennon" },
            { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
            { q: "It is during our darkest moments that we must focus to see the light.", a: "Aristotle" },
            { q: "The way to get started is to quit talking and begin doing.", a: "Walt Disney" },
            { q: "Don't let yesterday take up too much of today.", a: "Will Rogers" },
            { q: "You learn more from failure than from success.", a: "Unknown" },
            { q: "If you are working on something that you really care about, you don't have to be pushed.", a: "Steve Jobs" },
            { q: "The only impossible journey is the one you never begin.", a: "Tony Robbins" },
            { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
            { q: "The greatest glory in living lies not in never falling, but in rising every time we fall.", a: "Nelson Mandela" },
            { q: "Your time is limited, don't waste it living someone else's life.", a: "Steve Jobs" },
            { q: "If life were predictable it would cease to be life, and be without flavor.", a: "Eleanor Roosevelt" },
            { q: "In the end, it's not the years in your life that count. It's the life in your years.", a: "Abraham Lincoln" },
            { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
            { q: "The only person you are destined to become is the person you decide to be.", a: "Ralph Waldo Emerson" },
            { q: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", a: "Maya Angelou" },
            { q: "Whether you think you can or you think you can't, you're right.", a: "Henry Ford" },
            { q: "Perfection is not attainable, but if we chase perfection we can catch excellence.", a: "Vince Lombardi" }
        ];

        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
        this.currentQuote = fallbackQuotes[randomIndex].q;
        this.currentAuthor = fallbackQuotes[randomIndex].a;
        
        // Generate new random keywords for each new quote
        this.generateRandomKeywords();
        
        this.encodeCurrentQuote();
    }

    hideRevealSections() {
        // Hide all reveal sections
        this.revealedQuoteContent.style.display = 'none';
        this.revealedKeywordContent.style.display = 'none';
        this.revealedAlphabetContent.style.display = 'none';
        
        // Show reveal buttons
        this.revealQuoteBtn.style.display = 'inline-block';
        this.revealKeywordBtn.style.display = 'inline-block';
        this.revealAlphabetBtn.style.display = 'inline-block';
    }

    displayError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: #ffebee;
            color: #c62828;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
            border: 1px solid #ffcdd2;
        `;
        
        // Insert error message before the controls
        const container = document.querySelector('.container main');
        const controls = document.querySelector('.controls');
        container.insertBefore(errorDiv, controls);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    revealQuote() {
        if (!this.currentQuote) return;
        
        this.revealedQuote.innerHTML = `<strong>Original Quote:</strong> "${this.currentQuote}" — ${this.currentAuthor}`;
        this.revealedQuoteContent.style.display = 'block';
        this.revealQuoteBtn.disabled = true;
        this.revealQuoteBtn.textContent = 'Quote Revealed';
    }

    revealKeywords() {
        if (!this.currentQuote) return;
        
        const selectedCipher = this.cipherSelect.value;
        let keywordInfo = '';

        switch (selectedCipher) {
            case 'k1':
                keywordInfo = `<strong>K1 Keyword:</strong> ${this.k1Keyword}`;
                break;
            case 'k2':
                keywordInfo = `<strong>K2 Keyword:</strong> ${this.k2Keyword}`;
                break;
            case 'k3':
                keywordInfo = `<strong>K3 Keyword:</strong> ${this.k3Keyword}`;
                break;
            case 'k4':
                keywordInfo = `<strong>K4 Keywords:</strong> Plaintext: ${this.k4PlaintextKeyword}, Ciphertext: ${this.k4CiphertextKeyword}`;
                break;
            case 'random':
                keywordInfo = `<strong>Random Alphabet:</strong> No keyword used - completely randomized substitution`;
                break;
        }

        this.revealedKeywords.innerHTML = keywordInfo;
        this.revealedKeywordContent.style.display = 'block';
        this.revealKeywordBtn.disabled = true;
        this.revealKeywordBtn.textContent = 'Keywords Revealed';
    }

    revealAlphabet() {
        if (!this.currentQuote) return;
        
        const selectedCipher = this.cipherSelect.value;
        let tableHtml;

        switch (selectedCipher) {
            case 'k1':
                tableHtml = this.generateK1K2Table('k1');
                break;
            case 'k2':
                tableHtml = this.generateK1K2Table('k2');
                break;
            case 'k3':
                tableHtml = this.generateK3K4Table('k3');
                break;
            case 'k4':
                tableHtml = this.generateK3K4Table('k4');
                break;
            case 'random':
                tableHtml = this.generateRandomTable();
                break;
        }

        this.revealedAlphabet.innerHTML = tableHtml;
        this.revealedAlphabetContent.style.display = 'block';
        this.revealAlphabetBtn.disabled = true;
        this.revealAlphabetBtn.textContent = 'Alphabet Revealed';
    }

    generateK1K2Table(cipherType) {
        let tableHtml = '<div class="alphabet-label">Substitution Table:</div>';
        tableHtml += '<table class="alphabet-table">';
        
        // Header row
        tableHtml += '<tr><th colspan="26">Plaintext → Ciphertext</th></tr><tr>';
        
        let plaintextAlphabet, ciphertextAlphabet, keyword;
        
        if (cipherType === 'k1') {
            plaintextAlphabet = this.createKeyedAlphabet(this.k1Keyword);
            ciphertextAlphabet = this.standardAlphabet;
            keyword = this.k1Keyword;
        } else {
            plaintextAlphabet = this.standardAlphabet;
            ciphertextAlphabet = this.createKeyedAlphabet(this.k2Keyword);
            keyword = this.k2Keyword;
        }
        
        // Remove duplicates from keyword for highlighting
        const uniqueKeyword = [...new Set(keyword.toUpperCase())].join('');
        
        // Plaintext row
        for (let i = 0; i < 26; i++) {
            const letter = plaintextAlphabet[i];
            const isKeyword = (cipherType === 'k1') && (i < uniqueKeyword.length);
            const className = isKeyword ? 'keyword-highlight' : '';
            tableHtml += `<td class="${className}">${letter}</td>`;
        }
        tableHtml += '</tr><tr>';
        
        // Ciphertext row
        for (let i = 0; i < 26; i++) {
            const letter = ciphertextAlphabet[i];
            const isKeyword = (cipherType === 'k2') && (i < uniqueKeyword.length);
            const className = isKeyword ? 'keyword-highlight' : '';
            tableHtml += `<td class="${className}">${letter}</td>`;
        }
        tableHtml += '</tr></table>';
        
        return tableHtml;
    }

    generateK3K4Table(cipherType) {
        let tableHtml = '<div class="alphabet-label">Substitution Table:</div>';
        tableHtml += '<table class="alphabet-table">';
        
        // Header row
        tableHtml += '<tr><th colspan="26">Plaintext → Ciphertext</th></tr><tr>';
        
        let plaintextAlphabet, ciphertextAlphabet, keywordPositions;
        
        if (cipherType === 'k3') {
            plaintextAlphabet = this.k3PlaintextAlphabet;
            ciphertextAlphabet = this.k3CiphertextAlphabet;
            keywordPositions = { 
                plaintext: this.k3PlaintextPositions,
                ciphertext: this.k3CiphertextPositions
            };
        } else {
            plaintextAlphabet = this.k4PlaintextAlphabet;
            ciphertextAlphabet = this.k4CiphertextAlphabet;
            keywordPositions = { 
                plaintext: this.k4PlaintextPositions,
                ciphertext: this.k4CiphertextPositions
            };
        }
        
        // Plaintext row
        for (let i = 0; i < 26; i++) {
            const letter = plaintextAlphabet[i];
            const isKeyword = this.isPositionInKeyword(i, 'plaintext', keywordPositions);
            const className = isKeyword ? 'keyword-highlight' : '';
            tableHtml += `<td class="${className}">${letter}</td>`;
        }
        tableHtml += '</tr><tr>';
        
        // Ciphertext row
        for (let i = 0; i < 26; i++) {
            const letter = ciphertextAlphabet[i];
            const isKeyword = this.isPositionInKeyword(i, 'ciphertext', keywordPositions);
            const className = isKeyword ? 'keyword-highlight' : '';
            tableHtml += `<td class="${className}">${letter}</td>`;
        }
        tableHtml += '</tr></table>';
        
        return tableHtml;
    }

    generateRandomTable() {
        let tableHtml = '<div class="alphabet-label">Substitution Table:</div>';
        tableHtml += '<table class="alphabet-table">';
        
        // Header row
        tableHtml += '<tr><th colspan="26">Plaintext → Ciphertext</th></tr><tr>';
        
        // Plaintext row
        for (let i = 0; i < 26; i++) {
            const letter = this.standardAlphabet[i];
            tableHtml += `<td>${letter}</td>`;
        }
        tableHtml += '</tr><tr>';
        
        // Ciphertext row
        for (let i = 0; i < 26; i++) {
            const letter = this.randomAlphabet[i];
            tableHtml += `<td>${letter}</td>`;
        }
        tableHtml += '</tr></table>';
        
        return tableHtml;
    }

    isPositionInKeyword(position, type, keywordPositions) {
        if (!keywordPositions[type]) return false;
        
        const positionData = keywordPositions[type];
        if (positionData && positionData.startPosition !== undefined && positionData.endPosition !== undefined) {
            return position >= positionData.startPosition && position <= positionData.endPosition;
        }
        
        return false;
    }

    encodeCurrentQuote() {
        if (!this.currentQuote) return;

        const selectedCipher = this.cipherSelect.value;
        let encodedText = '';
        let cipherDescription = '';

        switch (selectedCipher) {
            case 'k1':
                encodedText = this.k1Cipher(this.currentQuote);
                cipherDescription = `K1 - Mixed plaintext alphabet, standard ciphertext | Author: ${this.currentAuthor}`;
                break;
            case 'k2':
                encodedText = this.k2Cipher(this.currentQuote);
                cipherDescription = `K2 - Standard plaintext, mixed ciphertext alphabet | Author: ${this.currentAuthor}`;
                break;
            case 'k3':
                encodedText = this.k3Cipher(this.currentQuote);
                cipherDescription = `K3 - Both alphabets mixed with same keyword | Author: ${this.currentAuthor}`;
                break;
            case 'k4':
                encodedText = this.k4Cipher(this.currentQuote);
                cipherDescription = `K4 - Both alphabets mixed with different keywords | Author: ${this.currentAuthor}`;
                break;
            case 'random':
                encodedText = this.randomCipher(this.currentQuote);
                cipherDescription = `Random alphabet substitution | Author: ${this.currentAuthor}`;
                break;
        }

        this.encodedQuote.textContent = encodedText;
        this.cipherInfo.textContent = cipherDescription;
        
        // Show reveal buttons and reset their state
        this.revealQuoteBtn.style.display = 'inline-block';
        this.revealKeywordBtn.style.display = 'inline-block';
        this.revealAlphabetBtn.style.display = 'inline-block';
        this.revealQuoteBtn.disabled = false;
        this.revealKeywordBtn.disabled = false;
        this.revealAlphabetBtn.disabled = false;
        this.revealQuoteBtn.textContent = 'Reveal Original Quote';
        this.revealKeywordBtn.textContent = 'Reveal Keyword(s)';
        this.revealAlphabetBtn.textContent = 'Reveal Alphabet Table';
        
        // Hide revealed content
        this.revealedQuoteContent.style.display = 'none';
        this.revealedKeywordContent.style.display = 'none';
        this.revealedAlphabetContent.style.display = 'none';
        this.revealedQuote.innerHTML = '';
        this.revealedKeywords.innerHTML = '';
        this.revealedAlphabet.innerHTML = '';
    }

    // Helper function to create keyed alphabet with keyword positioned for readability
    createKeyedAlphabet(keyword, positionInMiddle = false) {
        // Remove duplicates from keyword and convert to uppercase
        const cleanKeyword = [...new Set(keyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        
        // Get remaining letters not in keyword
        const remainingLetters = this.standardAlphabet.split('').filter(letter => !cleanKeyword.includes(letter));
        
        let finalAlphabet;
        let keywordStartPosition;
        
        if (positionInMiddle && cleanKeyword.length <= 20) {
            // Position keyword in the middle for better visibility
            const targetStart = Math.max(0, Math.floor((26 - cleanKeyword.length) / 2));
            const beforeKeyword = remainingLetters.slice(0, targetStart);
            const afterKeyword = remainingLetters.slice(targetStart);
            
            finalAlphabet = beforeKeyword.join('') + cleanKeyword + afterKeyword.join('');
            keywordStartPosition = beforeKeyword.length;
        } else {
            // Default: keyword at the beginning
            finalAlphabet = cleanKeyword + remainingLetters.join('');
            keywordStartPosition = 0;
        }
        
        // Store keyword position for highlighting
        this.lastKeywordPositions = {
            keyword: cleanKeyword,
            startPosition: keywordStartPosition,
            endPosition: keywordStartPosition + cleanKeyword.length - 1
        };
        
        // Apply smart rearrangement to prevent identity mappings while preserving keyword
        return this.smartRearrangeAlphabet(finalAlphabet, keywordStartPosition, cleanKeyword.length);
    }

    // Smart rearrangement that preserves keyword integrity
    smartRearrangeAlphabet(alphabet, keywordStart, keywordLength) {
        let result = alphabet.split('');
        const keywordEnd = keywordStart + keywordLength - 1;
        
        // Check for identity mappings and fix them by selective rearrangement
        for (let i = 0; i < 26; i++) {
            if (result[i] === this.standardAlphabet[i]) {
                const isInKeyword = i >= keywordStart && i <= keywordEnd;
                
                if (isInKeyword) {
                    // For keyword positions, swap with a non-keyword position that doesn't create identity
                    for (let j = 0; j < 26; j++) {
                        const jInKeyword = j >= keywordStart && j <= keywordEnd;
                        if (!jInKeyword && result[j] !== this.standardAlphabet[j] && 
                            result[i] !== this.standardAlphabet[j] && result[j] !== this.standardAlphabet[i]) {
                            [result[i], result[j]] = [result[j], result[i]];
                            break;
                        }
                    }
                } else {
                    // For non-keyword positions, try to swap with another non-keyword position
                    for (let j = 0; j < 26; j++) {
                        const jInKeyword = j >= keywordStart && j <= keywordEnd;
                        if (i !== j && !jInKeyword && result[j] !== this.standardAlphabet[j] &&
                            result[i] !== this.standardAlphabet[j] && result[j] !== this.standardAlphabet[i]) {
                            [result[i], result[j]] = [result[j], result[i]];
                            break;
                        }
                    }
                }
            }
        }
        
        // If there are still identity mappings, do a final check and minimal adjustment
        for (let i = 0; i < 26; i++) {
            if (result[i] === this.standardAlphabet[i]) {
                // Find any position that can be swapped without creating new identities
                for (let j = i + 1; j < 26; j++) {
                    if (result[j] !== this.standardAlphabet[j] && 
                        result[i] !== this.standardAlphabet[j] && 
                        result[j] !== this.standardAlphabet[i]) {
                        [result[i], result[j]] = [result[j], result[i]];
                        break;
                    }
                }
            }
        }
        
        return result.join('');
    }

    // Shift alphabet to avoid any letter standing for itself (deprecated - keeping for compatibility)
    shiftAlphabetToAvoidIdentity(alphabet) {
        return this.smartRearrangeAlphabet(alphabet, 0, 0);
    }

    // K1 - Mixed plaintext alphabet, standard ciphertext
    k1Cipher(text) {
        const keyedPlaintext = this.createKeyedAlphabet(this.k1Keyword);
        const standardCipher = this.standardAlphabet;
        
        return this.substituteText(text, keyedPlaintext, standardCipher);
    }

    // K2 - Standard plaintext, mixed ciphertext alphabet
    k2Cipher(text) {
        const standardPlaintext = this.standardAlphabet;
        const keyedCipher = this.createKeyedAlphabet(this.k2Keyword);
        
        return this.substituteText(text, standardPlaintext, keyedCipher);
    }

    // K3 - Both alphabets mixed with same keyword but positioned differently
    k3Cipher(text) {
        const keyedPlaintext = this.createKeyedAlphabet(this.k3Keyword);
        this.k3PlaintextPositions = { ...this.lastKeywordPositions };
        this.k3PlaintextAlphabet = keyedPlaintext;
        
        // Create a different arrangement for ciphertext using the same keyword but positioned in middle
        const keyedCipher = this.createKeyedAlphabet(this.k3Keyword, true);
        this.k3CiphertextPositions = { ...this.lastKeywordPositions };
        
        // Store the ciphertext alphabet for reveal function
        this.k3CiphertextAlphabet = keyedCipher;
        
        return this.substituteText(text, keyedPlaintext, keyedCipher);
    }

    // K4 - Both alphabets mixed with different keywords
    k4Cipher(text) {
        // Create both alphabets first without identity checking
        const keyedPlaintext = this.createKeyedAlphabetRaw(this.k4PlaintextKeyword);
        this.k4PlaintextPositions = { ...this.lastKeywordPositions };
        
        // Position the second keyword in the middle for better visibility
        const keyedCipher = this.createKeyedAlphabetRaw(this.k4CiphertextKeyword, true);
        this.k4CiphertextPositions = { ...this.lastKeywordPositions };
        
        // Now apply smart K4 rearrangement that considers both keywords
        const { finalPlaintext, finalCiphertext } = this.smartK4Rearrangement(
            keyedPlaintext, 
            keyedCipher, 
            this.k4PlaintextPositions, 
            this.k4CiphertextPositions
        );
        
        // Store the final alphabets
        this.k4PlaintextAlphabet = finalPlaintext;
        this.k4CiphertextAlphabet = finalCiphertext;
        
        return this.substituteText(text, finalPlaintext, finalCiphertext);
    }

    // Create keyed alphabet without identity checking (raw version)
    createKeyedAlphabetRaw(keyword, positionInMiddle = false) {
        // Remove duplicates from keyword and convert to uppercase
        const cleanKeyword = [...new Set(keyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        
        // Get remaining letters not in keyword
        const remainingLetters = this.standardAlphabet.split('').filter(letter => !cleanKeyword.includes(letter));
        
        let finalAlphabet;
        let keywordStartPosition;
        
        if (positionInMiddle && cleanKeyword.length <= 20) {
            // Position keyword in the middle for better visibility
            const targetStart = Math.max(0, Math.floor((26 - cleanKeyword.length) / 2));
            const beforeKeyword = remainingLetters.slice(0, targetStart);
            const afterKeyword = remainingLetters.slice(targetStart);
            
            finalAlphabet = beforeKeyword.join('') + cleanKeyword + afterKeyword.join('');
            keywordStartPosition = beforeKeyword.length;
        } else {
            // Default: keyword at the beginning
            finalAlphabet = cleanKeyword + remainingLetters.join('');
            keywordStartPosition = 0;
        }
        
        // Store keyword position for highlighting
        this.lastKeywordPositions = {
            keyword: cleanKeyword,
            startPosition: keywordStartPosition,
            endPosition: keywordStartPosition + cleanKeyword.length - 1
        };
        
        return finalAlphabet;
    }

    // Smart K4-specific rearrangement that preserves both keywords
    smartK4Rearrangement(plaintextAlphabet, ciphertextAlphabet, plaintextPositions, ciphertextPositions) {
        let plainResult = plaintextAlphabet.split('');
        let cipherResult = ciphertextAlphabet.split('');
        
        // Check for identity mappings and fix them while preserving both keywords
        for (let i = 0; i < 26; i++) {
            if (plainResult[i] === this.standardAlphabet[i]) {
                // Found identity in plaintext alphabet
                const isInPlaintextKeyword = i >= plaintextPositions.startPosition && i <= plaintextPositions.endPosition;
                
                if (isInPlaintextKeyword) {
                    // Try to swap with a non-keyword position in plaintext
                    for (let j = 0; j < 26; j++) {
                        const jInPlaintextKeyword = j >= plaintextPositions.startPosition && j <= plaintextPositions.endPosition;
                        if (!jInPlaintextKeyword && plainResult[j] !== this.standardAlphabet[j] && 
                            plainResult[i] !== this.standardAlphabet[j] && plainResult[j] !== this.standardAlphabet[i]) {
                            [plainResult[i], plainResult[j]] = [plainResult[j], plainResult[i]];
                            break;
                        }
                    }
                } else {
                    // For non-keyword positions, find a safe swap
                    for (let j = 0; j < 26; j++) {
                        const jInPlaintextKeyword = j >= plaintextPositions.startPosition && j <= plaintextPositions.endPosition;
                        if (i !== j && !jInPlaintextKeyword && plainResult[j] !== this.standardAlphabet[j] &&
                            plainResult[i] !== this.standardAlphabet[j] && plainResult[j] !== this.standardAlphabet[i]) {
                            [plainResult[i], plainResult[j]] = [plainResult[j], plainResult[i]];
                            break;
                        }
                    }
                }
            }
            
            if (cipherResult[i] === this.standardAlphabet[i]) {
                // Found identity in ciphertext alphabet
                const isInCiphertextKeyword = i >= ciphertextPositions.startPosition && i <= ciphertextPositions.endPosition;
                
                if (isInCiphertextKeyword) {
                    // Try to swap with a non-keyword position in ciphertext
                    for (let j = 0; j < 26; j++) {
                        const jInCiphertextKeyword = j >= ciphertextPositions.startPosition && j <= ciphertextPositions.endPosition;
                        if (!jInCiphertextKeyword && cipherResult[j] !== this.standardAlphabet[j] && 
                            cipherResult[i] !== this.standardAlphabet[j] && cipherResult[j] !== this.standardAlphabet[i]) {
                            [cipherResult[i], cipherResult[j]] = [cipherResult[j], cipherResult[i]];
                            break;
                        }
                    }
                } else {
                    // For non-keyword positions, find a safe swap
                    for (let j = 0; j < 26; j++) {
                        const jInCiphertextKeyword = j >= ciphertextPositions.startPosition && j <= ciphertextPositions.endPosition;
                        if (i !== j && !jInCiphertextKeyword && cipherResult[j] !== this.standardAlphabet[j] &&
                            cipherResult[i] !== this.standardAlphabet[j] && cipherResult[j] !== this.standardAlphabet[i]) {
                            [cipherResult[i], cipherResult[j]] = [cipherResult[j], cipherResult[i]];
                            break;
                        }
                    }
                }
            }
        }
        
        return {
            finalPlaintext: plainResult.join(''),
            finalCiphertext: cipherResult.join('')
        };
    }

    // Random alphabet substitution
    randomCipher(text) {
        return this.substituteText(text, this.standardAlphabet, this.randomAlphabet);
    }

    // Generic substitution function
    substituteText(text, plaintextAlphabet, ciphertextAlphabet) {
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                const index = plaintextAlphabet.indexOf(char);
                return index !== -1 ? ciphertextAlphabet[index] : char;
            } else if (char >= 'a' && char <= 'z') {
                const upperChar = char.toUpperCase();
                const index = plaintextAlphabet.indexOf(upperChar);
                return index !== -1 ? ciphertextAlphabet[index].toLowerCase() : char;
            }
            return char; // Keep non-alphabetic characters unchanged
        }).join('');
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
        this.getQuoteBtn.disabled = show;
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
        app.currentQuote = "The only way to do great work is to love what you do.";
        app.currentAuthor = "Steve Jobs";
        app.encodeCurrentQuote();
    }
});
