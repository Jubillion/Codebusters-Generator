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
            printCipherBtn: document.getElementById('print-cipher-btn'),
            revealedQuoteContent: document.getElementById('revealed-quote-content'),
            revealedKeywordContent: document.getElementById('revealed-keyword-content'),
            revealedAlphabetContent: document.getElementById('revealed-alphabet-content'),
            revealedQuote: document.getElementById('revealed-quote'),
            revealedKeywords: document.getElementById('revealed-keywords'),
            revealedAlphabet: document.getElementById('revealed-alphabet'),
            
            // Print elements
            printContent: document.getElementById('print-content'),
            printTitle: document.getElementById('print-title'),
            printCipherInfo: document.getElementById('print-cipher-info'),
            printAuthor: document.getElementById('print-author'),
            printCipherTextTable: document.getElementById('print-cipher-text-table'),
            printSubstitutionTable: document.getElementById('print-substitution-table'),
            printReferenceTable: document.getElementById('print-reference-table'),
            
            // API Key elements
            apiKeyToggle: document.getElementById('api-key-toggle'),
            apiKeyInput: document.getElementById('api-key-input'),
            apiKeyContainer: document.getElementById('api-key-container'),
            apiKeyStatus: document.getElementById('api-key-status')
        };

        // Initially hide all reveal buttons since no quote is loaded
        this.hideAllRevealButtons();
        this.hideRevealSections();

        return this.elements;
    }

    bindEvents(callbacks) {
        this.elements.getQuoteBtn.addEventListener('click', callbacks.onGetQuote);
        this.elements.cipherSelect.addEventListener('change', callbacks.onCipherChange);
        this.elements.revealQuoteBtn.addEventListener('click', () => this.revealQuote());
        this.elements.revealKeywordBtn.addEventListener('click', () => this.revealKeywords());
        this.elements.revealAlphabetBtn.addEventListener('click', () => this.revealAlphabet());
        this.elements.printCipherBtn.addEventListener('click', () => this.printCipher());
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
        // Only show reveal buttons if we have a quote to reveal
        if (!this.currentQuote) {
            this.hideAllRevealButtons();
            return;
        }
        
        // Show reveal buttons and reset their state
        this.elements.revealQuoteBtn.style.display = 'inline-block';
        this.elements.revealAlphabetBtn.style.display = 'inline-block';
        this.elements.printCipherBtn.style.display = 'inline-block';
        this.elements.revealQuoteBtn.disabled = false;
        this.elements.revealAlphabetBtn.disabled = false;
        this.elements.printCipherBtn.disabled = false;
        this.elements.revealQuoteBtn.textContent = 'Reveal Original Quote';
        this.elements.revealAlphabetBtn.textContent = 'Reveal Alphabet Table';
        this.elements.printCipherBtn.textContent = 'Print Cipher Worksheet';
        
        // Show/hide keyword button based on cipher type
        const selectedCipher = this.elements.cipherSelect.value;
        if (selectedCipher === 'random') {
            this.elements.revealKeywordBtn.style.display = 'none';
        } else {
            this.elements.revealKeywordBtn.style.display = 'inline-block';
            this.elements.revealKeywordBtn.disabled = false;
            this.elements.revealKeywordBtn.textContent = 'Reveal Keyword(s)';
        }
    }

    hideAllRevealButtons() {
        // Hide all reveal buttons when there's no quote
        this.elements.revealQuoteBtn.style.display = 'none';
        this.elements.revealKeywordBtn.style.display = 'none';
        this.elements.revealAlphabetBtn.style.display = 'none';
        this.elements.printCipherBtn.style.display = 'none';
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

    printCipher() {
        if (!this.currentQuote || !this.currentCipherResult) return;
        
        const selectedCipher = this.elements.cipherSelect.value;
        
        // Set up print header
        this.elements.printTitle.textContent = 'Cipher Worksheet';
        this.elements.printCipherInfo.textContent = this.elements.cipherInfo.textContent;
        this.elements.printAuthor.textContent = `— ${this.currentAuthor}`;
        
        // Generate all print tables
        this.generatePrintCipherTextTable();
        this.generatePrintSubstitutionTable(selectedCipher);
        
        // Add no-print class to screen elements
        document.body.classList.add('printing');
        const screenElements = document.querySelectorAll('header, main');
        screenElements.forEach(el => el.classList.add('no-print'));
        
        // Print
        window.print();
        
        // Remove classes after printing
        setTimeout(() => {
            document.body.classList.remove('printing');
            screenElements.forEach(el => el.classList.remove('no-print'));
        }, 1000);
    }

    generatePrintCipherTextTable() {
        const encodedText = this.currentCipherResult.encodedText.toUpperCase();
        const charsPerRow = 26; // Match the 26 columns of the substitution table
        
        let tableHtml = '';
        
        // Split text into chunks that match the width of other tables
        let currentPos = 0;
        
        while (currentPos < encodedText.length) {
            let charsInRow = 0;
            let rowEnd = currentPos;
            
            // Find where to break the row (up to 26 cells to match other tables)
            while (rowEnd < encodedText.length && charsInRow < charsPerRow) {
                rowEnd++;
                charsInRow++;
            }
            
            // Create a proper table for this segment
            let segmentTable = '<table class="worksheet-table cipher-text-table">';
            let cipherRow = '<tr>';
            let blankRow = '<tr>';
            
            // Only fill with actual characters, no padding
            for (let i = currentPos; i < rowEnd && i < encodedText.length; i++) {
                const char = encodedText[i];
                
                if (char.match(/[A-Z]/)) {
                    // Letter - show in cipher row, blank in answer row
                    cipherRow += `<td class="cipher-char">${char}</td>`;
                    blankRow += `<td class="blank-cell"></td>`;
                } else if (char.match(/[.!?,:;"'-]/)) {
                    // Punctuation - show in both rows
                    cipherRow += `<td class="punctuation">${char}</td>`;
                    blankRow += `<td class="punctuation">${char}</td>`;
                } else if (char === ' ') {
                    // Space - special marker
                    cipherRow += `<td class="space-cell">⌐</td>`;
                    blankRow += `<td class="space-cell">⌐</td>`;
                } else {
                    // Other characters
                    cipherRow += `<td class="punctuation">${char}</td>`;
                    blankRow += `<td class="punctuation">${char}</td>`;
                }
            }
            
            cipherRow += '</tr>';
            blankRow += '</tr>';
            segmentTable += cipherRow + blankRow + '</table>';
            
            tableHtml += segmentTable;
            currentPos = rowEnd;
        }
        
        this.elements.printCipherTextTable.innerHTML = tableHtml;
    }

    generatePrintSubstitutionTable(selectedCipher) {
        // Calculate letter frequencies in the cipher text
        const frequencies = this.calculateLetterFrequencies();
        
        let tableHtml = '<table class="worksheet-table substitution-table">';
        
        // Create the rows based on cipher type
        if (selectedCipher === 'k2') {
            // K2: Blank row (top), Ciphertext letters (A-Z), Frequency row (bottom)
            
            // Row 1: Blank row for user to fill in plaintext
            let blankRow = '<tr>';
            for (let i = 0; i < 26; i++) {
                blankRow += `<td class="blank-substitution"></td>`;
            }
            blankRow += '</tr>';
            
            // Row 2: Ciphertext row (showing A-Z) - this is the alphabet header
            let ciphertextRow = '<tr>';
            for (let i = 0; i < 26; i++) {
                const letter = String.fromCharCode(65 + i);
                ciphertextRow += `<th class="letter-header">${letter}</th>`;
            }
            ciphertextRow += '</tr>';
            
            // Row 3: Frequency row
            let frequencyRow = '<tr>';
            for (let i = 0; i < 26; i++) {
                const letter = String.fromCharCode(65 + i);
                const freq = frequencies[letter] || 0;
                if (freq > 0) {
                    frequencyRow += `<td class="frequency">${freq}</td>`;
                } else {
                    frequencyRow += `<td class="blank-freq">-</td>`;
                }
            }
            frequencyRow += '</tr>';
            
            tableHtml += blankRow + ciphertextRow + frequencyRow;
        } else {
            // All others: Ciphertext letters (A-Z), Frequency row, Blank row (bottom)
            
            // Row 1: Ciphertext row (showing A-Z) - this is the alphabet header
            let ciphertextRow = '<tr>';
            for (let i = 0; i < 26; i++) {
                const letter = String.fromCharCode(65 + i);
                ciphertextRow += `<th class="letter-header">${letter}</th>`;
            }
            ciphertextRow += '</tr>';
            
            // Row 2: Frequency row
            let frequencyRow = '<tr>';
            for (let i = 0; i < 26; i++) {
                const letter = String.fromCharCode(65 + i);
                const freq = frequencies[letter] || 0;
                if (freq > 0) {
                    frequencyRow += `<td class="frequency">${freq}</td>`;
                } else {
                    frequencyRow += `<td class="blank-freq">-</td>`;
                }
            }
            frequencyRow += '</tr>';
            
            // Row 3: Blank row for user to fill in plaintext
            let blankRow = '<tr>';
            for (let i = 0; i < 26; i++) {
                blankRow += `<td class="blank-substitution"></td>`;
            }
            blankRow += '</tr>';
            
            tableHtml += ciphertextRow + frequencyRow + blankRow;
        }
        
        tableHtml += '</table>';
        this.elements.printSubstitutionTable.innerHTML = tableHtml;
    }

    calculateLetterFrequencies() {
        const frequencies = {};
        const encodedText = this.currentCipherResult.encodedText.toUpperCase();
        
        for (const char of encodedText) {
            if (char.match(/[A-Z]/)) {
                frequencies[char] = (frequencies[char] || 0) + 1;
            }
        }
        
        return frequencies;
    }

    generatePrintReferenceTable() {
        // English letter frequency reference
        const englishFreq = {
            'E': 12.7, 'T': 9.1, 'A': 8.2, 'O': 7.5, 'I': 7.0, 'N': 6.7, 'S': 6.3,
            'H': 6.1, 'R': 6.0, 'D': 4.3, 'L': 4.0, 'C': 2.8, 'U': 2.8, 'M': 2.4,
            'W': 2.4, 'F': 2.2, 'G': 2.0, 'Y': 2.0, 'P': 1.9, 'B': 1.3, 'V': 1.0,
            'K': 0.8, 'J': 0.15, 'X': 0.15, 'Q': 0.10, 'Z': 0.07
        };
        
        // Sort by frequency for reference
        const sortedLetters = Object.keys(englishFreq).sort((a, b) => englishFreq[b] - englishFreq[a]);
        
        let tableHtml = '<table class="worksheet-table reference-table">';
        tableHtml += '<tr><th colspan="4">English Letter Frequency (%)</th></tr>';
        
        // Create header row for the columns
        tableHtml += '<tr><th>Letter</th><th>Freq</th><th>Letter</th><th>Freq</th></tr>';
        
        // Split letters into two columns (13 letters each)
        const midPoint = Math.ceil(sortedLetters.length / 2);
        
        for (let i = 0; i < midPoint; i++) {
            tableHtml += '<tr>';
            
            // Left column
            const leftLetter = sortedLetters[i];
            tableHtml += `<td><strong>${leftLetter}</strong></td>`;
            tableHtml += `<td>${englishFreq[leftLetter]}</td>`;
            
            // Right column (if exists)
            const rightIndex = i + midPoint;
            if (rightIndex < sortedLetters.length) {
                const rightLetter = sortedLetters[rightIndex];
                tableHtml += `<td><strong>${rightLetter}</strong></td>`;
                tableHtml += `<td>${englishFreq[rightLetter]}</td>`;
            } else {
                // Empty cells if odd number of letters
                tableHtml += `<td></td><td></td>`;
            }
            
            tableHtml += '</tr>';
        }
        
        tableHtml += '</table>';
        this.elements.printReferenceTable.innerHTML = tableHtml;
    }
}
