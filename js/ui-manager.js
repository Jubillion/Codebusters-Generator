// UI Management - Handles all user interface interactions and display
export class UIManager {
    constructor() {
        this.elements = {};
        this.currentQuote = null;
        this.currentAuthor = null;
        this.currentCipherResult = null;
    }

    initializeElements() {
        this.elements = {
            cipherSelect: document.getElementById('cipher-select'),
            getQuoteBtn: document.getElementById('get-quote-btn'),
            originalQuote: document.getElementById('original-quote'),
            encodedQuote: document.getElementById('encoded-quote'),
            quoteAuthor: document.getElementById('quote-author'),
            cipherInfo: document.getElementById('cipher-info'),
            loading: document.getElementById('loading'),
            revealQuoteBtn: document.getElementById('reveal-quote-btn'),
            revealKeywordBtn: document.getElementById('reveal-keyword-btn'),
            revealAlphabetBtn: document.getElementById('reveal-alphabet-btn'),
            revealedQuoteContent: document.getElementById('revealed-quote-content'),
            revealedKeywordContent: document.getElementById('revealed-keyword-content'),
            revealedAlphabetContent: document.getElementById('revealed-alphabet-content'),
            revealedQuote: document.getElementById('revealed-quote'),
            revealedKeywords: document.getElementById('revealed-keywords'),
            revealedAlphabet: document.getElementById('revealed-alphabet'),
            
            // API Key elements
            apiKeyToggle: document.getElementById('api-key-toggle'),
            apiKeyInput: document.getElementById('api-key-input'),
            apiKeyContainer: document.getElementById('api-key-container'),
            apiKeyStatus: document.getElementById('api-key-status')
        };

        return this.elements;
    }

    bindEvents(callbacks) {
        this.elements.getQuoteBtn.addEventListener('click', callbacks.onGetQuote);
        this.elements.cipherSelect.addEventListener('change', callbacks.onCipherChange);
        this.elements.revealQuoteBtn.addEventListener('click', () => this.revealQuote());
        this.elements.revealKeywordBtn.addEventListener('click', () => this.revealKeywords());
        this.elements.revealAlphabetBtn.addEventListener('click', () => this.revealAlphabet());
    }

    showLoading(show) {
        this.elements.loading.style.display = show ? 'block' : 'none';
        this.elements.getQuoteBtn.disabled = show;
    }

    displayQuote(quote, author, encodedText, cipherDescription, cipherResult) {
        this.currentQuote = quote;
        this.currentAuthor = author;
        this.currentCipherResult = cipherResult;

        this.elements.encodedQuote.textContent = encodedText;
        this.elements.cipherInfo.textContent = cipherDescription;
        
        this.resetRevealButtons();
        this.hideRevealSections();
    }

    resetRevealButtons() {
        // Show reveal buttons and reset their state
        this.elements.revealQuoteBtn.style.display = 'inline-block';
        this.elements.revealKeywordBtn.style.display = 'inline-block';
        this.elements.revealAlphabetBtn.style.display = 'inline-block';
        this.elements.revealQuoteBtn.disabled = false;
        this.elements.revealKeywordBtn.disabled = false;
        this.elements.revealAlphabetBtn.disabled = false;
        this.elements.revealQuoteBtn.textContent = 'Reveal Original Quote';
        this.elements.revealKeywordBtn.textContent = 'Reveal Keyword(s)';
        this.elements.revealAlphabetBtn.textContent = 'Reveal Alphabet Table';
    }

    hideRevealSections() {
        // Hide all reveal sections
        this.elements.revealedQuoteContent.style.display = 'none';
        this.elements.revealedKeywordContent.style.display = 'none';
        this.elements.revealedAlphabetContent.style.display = 'none';
        
        // Clear content
        this.elements.revealedQuote.innerHTML = '';
        this.elements.revealedKeywords.innerHTML = '';
        this.elements.revealedAlphabet.innerHTML = '';
    }

    revealQuote() {
        if (!this.currentQuote) return;
        
        this.elements.revealedQuote.innerHTML = `<strong>Original Quote:</strong> "${this.currentQuote}" — ${this.currentAuthor}`;
        this.elements.revealedQuoteContent.style.display = 'block';
        this.elements.revealQuoteBtn.disabled = true;
        this.elements.revealQuoteBtn.textContent = 'Quote Revealed';
    }

    revealKeywords() {
        if (!this.currentQuote || !this.currentCipherResult) return;
        
        const selectedCipher = this.elements.cipherSelect.value;
        let keywordInfo = '';

        switch (selectedCipher) {
            case 'k1':
                keywordInfo = `<strong>K1 Keyword:</strong> ${this.currentCipherResult.keyword}`;
                break;
            case 'k2':
                keywordInfo = `<strong>K2 Keyword:</strong> ${this.currentCipherResult.keyword}`;
                break;
            case 'k3':
                keywordInfo = `<strong>K3 Keyword:</strong> ${this.currentCipherResult.keyword}`;
                break;
            case 'k4':
                keywordInfo = `<strong>K4 Keywords:</strong> Plaintext: ${this.currentCipherResult.plaintextKeyword}, Ciphertext: ${this.currentCipherResult.ciphertextKeyword}`;
                break;
            case 'random':
                keywordInfo = `<strong>Random Alphabet:</strong> No keyword used - completely randomized substitution`;
                break;
        }

        this.elements.revealedKeywords.innerHTML = keywordInfo;
        this.elements.revealedKeywordContent.style.display = 'block';
        this.elements.revealKeywordBtn.disabled = true;
        this.elements.revealKeywordBtn.textContent = 'Keywords Revealed';
    }

    revealAlphabet() {
        if (!this.currentQuote || !this.currentCipherResult) return;
        
        const selectedCipher = this.elements.cipherSelect.value;
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

        this.elements.revealedAlphabet.innerHTML = tableHtml;
        this.elements.revealedAlphabetContent.style.display = 'block';
        this.elements.revealAlphabetBtn.disabled = true;
        this.elements.revealAlphabetBtn.textContent = 'Alphabet Revealed';
    }

    generateK1K2Table(cipherType) {
        let tableHtml = '<div class="alphabet-label">Substitution Table:</div>';
        tableHtml += '<table class="alphabet-table">';
        
        // Header row
        tableHtml += '<tr><th colspan="26">Plaintext → Ciphertext</th></tr><tr>';
        
        const result = this.currentCipherResult;
        let plaintextAlphabet, ciphertextAlphabet, keyword;
        
        if (cipherType === 'k1') {
            plaintextAlphabet = result.plaintextAlphabet;
            ciphertextAlphabet = result.ciphertextAlphabet;
            keyword = result.keyword;
        } else {
            plaintextAlphabet = result.plaintextAlphabet;
            ciphertextAlphabet = result.ciphertextAlphabet;
            keyword = result.keyword;
        }
        
        // Clean keyword (remove duplicates)
        const cleanKeyword = [...new Set(keyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        
        // For K1: Find keyword letters in the plaintext alphabet
        // For K2: Find keyword letters in the ciphertext alphabet
        const findKeywordPositions = (alphabet, keyword) => {
            const positions = [];
            const keywordLetters = [...keyword];
            
            // Track which keyword letters we've found
            const foundLetters = new Set();
            
            for (let i = 0; i < alphabet.length; i++) {
                const letter = alphabet[i];
                if (keywordLetters.includes(letter) && !foundLetters.has(letter)) {
                    positions.push(i);
                    foundLetters.add(letter);
                }
            }
            return positions;
        };
        
        const keywordPositions = (cipherType === 'k1') 
            ? findKeywordPositions(plaintextAlphabet, cleanKeyword)
            : findKeywordPositions(ciphertextAlphabet, cleanKeyword);
        
        // Plaintext row
        for (let i = 0; i < 26; i++) {
            const letter = plaintextAlphabet[i];
            const isKeyword = (cipherType === 'k1') && keywordPositions.includes(i);
            const className = isKeyword ? 'keyword-highlight' : '';
            tableHtml += `<td class="${className}">${letter}</td>`;
        }
        tableHtml += '</tr><tr>';
        
        // Ciphertext row
        for (let i = 0; i < 26; i++) {
            const letter = ciphertextAlphabet[i];
            const isKeyword = (cipherType === 'k2') && keywordPositions.includes(i);
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
        
        const result = this.currentCipherResult;
        let plaintextAlphabet, ciphertextAlphabet;
        
        if (cipherType === 'k3') {
            plaintextAlphabet = result.plaintextAlphabet;
            ciphertextAlphabet = result.ciphertextAlphabet;
            
            // For K3, use letter-search method like K1/K2 since Caesar shift breaks position-based highlighting
            const keyword = result.keyword;
            const cleanKeyword = [...new Set(keyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
            
            // Find keyword letters in both alphabets
            const findKeywordPositions = (alphabet, keyword) => {
                const positions = [];
                const keywordLetters = [...keyword];
                const foundLetters = new Set();
                
                for (let i = 0; i < alphabet.length; i++) {
                    const letter = alphabet[i];
                    if (keywordLetters.includes(letter) && !foundLetters.has(letter)) {
                        positions.push(i);
                        foundLetters.add(letter);
                    }
                }
                return positions;
            };
            
            const plaintextKeywordPositions = findKeywordPositions(plaintextAlphabet, cleanKeyword);
            const ciphertextKeywordPositions = findKeywordPositions(ciphertextAlphabet, cleanKeyword);
            
            // Plaintext row
            for (let i = 0; i < 26; i++) {
                const letter = plaintextAlphabet[i];
                const isKeyword = plaintextKeywordPositions.includes(i);
                const className = isKeyword ? 'keyword-highlight' : '';
                tableHtml += `<td class="${className}">${letter}</td>`;
            }
            tableHtml += '</tr><tr>';
            
            // Ciphertext row
            for (let i = 0; i < 26; i++) {
                const letter = ciphertextAlphabet[i];
                const isKeyword = ciphertextKeywordPositions.includes(i);
                const className = isKeyword ? 'keyword-highlight' : '';
                tableHtml += `<td class="${className}">${letter}</td>`;
            }
            
        } else {
            // K4 uses the original position-based method since it preserves keyword positions
            plaintextAlphabet = result.plaintextAlphabet;
            ciphertextAlphabet = result.ciphertextAlphabet;
            const keywordPositions = { 
                plaintext: result.plaintextPositions,
                ciphertext: result.ciphertextPositions
            };
            
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
        }
        
        tableHtml += '</tr></table>';
        
        return tableHtml;
    }

    generateRandomTable() {
        let tableHtml = '<div class="alphabet-label">Substitution Table:</div>';
        tableHtml += '<table class="alphabet-table">';
        
        // Header row
        tableHtml += '<tr><th colspan="26">Plaintext → Ciphertext</th></tr><tr>';
        
        const result = this.currentCipherResult;
        
        // Plaintext row
        for (let i = 0; i < 26; i++) {
            const letter = result.plaintextAlphabet[i];
            tableHtml += `<td>${letter}</td>`;
        }
        tableHtml += '</tr><tr>';
        
        // Ciphertext row
        for (let i = 0; i < 26; i++) {
            const letter = result.ciphertextAlphabet[i];
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

    getSelectedCipher() {
        return this.elements.cipherSelect.value;
    }
}
