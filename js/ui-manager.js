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
            printReferenceBtn: document.getElementById('print-reference-btn'),
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
            printInfo: document.getElementById('print-info'),
            printCipherTextTable: document.getElementById('print-cipher-text-table'),
            printSubstitutionTable: document.getElementById('print-substitution-table'),
            printReferenceTable: document.getElementById('print-reference-table'),
            
            // Notice elements
            k4Notice: document.getElementById('k4-notice'),
            
            // Porta options elements
            portaOptions: document.getElementById('porta-options'),
            hideKeywordToggle: document.getElementById('hide-keyword-toggle'),
            
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
        this.elements.printReferenceBtn.addEventListener('click', () => this.printReferenceSheet());
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

        // Format encoded text with spaces every 5 letters for Porta cipher only
        const selectedCipher = this.elements.cipherSelect.value;
        let displayText = encodedText;
        
        if (selectedCipher === 'porta') {
            // Add spaces every 5 characters for better readability
            displayText = encodedText.replace(/(.{5})/g, '$1 ').trim();
        }

        this.elements.encodedQuote.textContent = displayText;
        this.elements.cipherInfo.textContent = cipherDescription;
        
        this.resetRevealButtons();
        this.hideRevealSections();
    }

    resetRevealButtons() {
        // Update K4 notice regardless of quote status
        this.updateK4Notice();
        
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
        this.elements.printCipherBtn.textContent = 'Print Cipher Worksheet';
        
        // Show/hide keyword button and customize labels based on cipher type
        const selectedCipher = this.elements.cipherSelect.value;
        if (selectedCipher === 'random') {
            this.elements.revealKeywordBtn.style.display = 'none';
            this.elements.revealAlphabetBtn.textContent = 'Reveal Alphabet Table';
        } else if (selectedCipher === 'nihilist') {
            this.elements.revealKeywordBtn.style.display = 'inline-block';
            this.elements.revealKeywordBtn.disabled = false;
            this.elements.revealKeywordBtn.textContent = 'Reveal Keys';
            this.elements.revealAlphabetBtn.textContent = 'Reveal Polybius Square';
        } else if (selectedCipher === 'porta') {
            this.elements.revealKeywordBtn.style.display = 'inline-block';
            this.elements.revealKeywordBtn.disabled = false;
            this.elements.revealKeywordBtn.textContent = 'Reveal Keyword';
            this.elements.revealAlphabetBtn.style.display = 'none'; // No view table button for Porta
        } else {
            this.elements.revealKeywordBtn.style.display = 'inline-block';
            this.elements.revealKeywordBtn.disabled = false;
            this.elements.revealKeywordBtn.textContent = 'Reveal Keyword(s)';
            this.elements.revealAlphabetBtn.textContent = 'Reveal Alphabet Table';
        }
        
        // K4 LEGACY CODE - Handle K4 competition notice - DO NOT MODIFY
        this.updateK4Notice();
        
        // Update Porta options visibility
        this.updatePortaOptions();
    }

    // K4 LEGACY CODE - Update K4 notice visibility - DO NOT MODIFY
    updateK4Notice() {
        const selectedCipher = this.elements.cipherSelect.value;
        if (selectedCipher === 'k4') {
            this.elements.k4Notice.style.display = 'flex';
        } else {
            this.elements.k4Notice.style.display = 'none';
        }
    }

    // Update Porta options visibility
    updatePortaOptions() {
        const selectedCipher = this.elements.cipherSelect.value;
        if (selectedCipher === 'porta') {
            this.elements.portaOptions.style.display = 'block';
        } else {
            this.elements.portaOptions.style.display = 'none';
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
            // K4 LEGACY CODE - DO NOT MODIFY
            case 'k4':
                keywordInfo = `<strong>K4 Keywords:</strong> Plaintext: ${this.currentCipherResult.plaintextKeyword}, Ciphertext: ${this.currentCipherResult.ciphertextKeyword}`;
                break;
            case 'random':
                keywordInfo = `<strong>Random Alphabet:</strong> No keyword used - completely randomized substitution`;
                break;
            case 'nihilist':
                keywordInfo = `<strong>Polybius Key:</strong> ${this.currentCipherResult.polybiusKeyword}<br><strong>Key:</strong> ${this.currentCipherResult.nihilistKey}`;
                break;
            case 'porta':
                keywordInfo = `<strong>Porta Keyword:</strong> ${this.currentCipherResult.keyword}`;
                break;
        }

        this.elements.revealedKeywords.innerHTML = keywordInfo;
        this.elements.revealedKeywordContent.style.display = 'block';
        this.elements.revealKeywordBtn.disabled = true;
        
        // Update button text based on cipher type
        if (selectedCipher === 'nihilist') {
            this.elements.revealKeywordBtn.textContent = 'Keys Revealed';
        } else if (selectedCipher === 'porta') {
            this.elements.revealKeywordBtn.textContent = 'Keyword Revealed';
        } else {
            this.elements.revealKeywordBtn.textContent = 'Keywords Revealed';
        }
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
            // K4 LEGACY CODE - DO NOT MODIFY
            case 'k4':
                tableHtml = this.generateK3K4Table('k4');
                break;
            case 'random':
                tableHtml = this.generateRandomTable();
                break;
            case 'nihilist':
                tableHtml = this.generateNihilistTable();
                break;
        }

        this.elements.revealedAlphabet.innerHTML = tableHtml;
        this.elements.revealedAlphabetContent.style.display = 'block';
        this.elements.revealAlphabetBtn.disabled = true;
        
        // Update button text based on cipher type
        if (selectedCipher === 'nihilist') {
            this.elements.revealAlphabetBtn.textContent = 'Polybius Square Revealed';
        } else {
            this.elements.revealAlphabetBtn.textContent = 'Alphabet Revealed';
        }
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

    // K3/K4 table generator (K4 LEGACY CODE - DO NOT MODIFY K4 PORTIONS)
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
        
        // Add additional info for ciphers that need keywords shown
        if (selectedCipher === 'nihilist') {
            const keywordsText = `Polybius Key: ${this.currentCipherResult.polybiusKeyword} | Key: ${this.currentCipherResult.nihilistKey}`;
            this.elements.printInfo.textContent = keywordsText;
        } else if (selectedCipher === 'porta') {
            // Check if hide keyword is enabled
            const hideKeyword = this.elements.hideKeywordToggle.checked;
            if (hideKeyword) {
                this.elements.printInfo.textContent = '';
            } else {
                const keywordText = `Keyword: ${this.currentCipherResult.keyword}`;
                this.elements.printInfo.textContent = keywordText;
            }
        } else {
            this.elements.printInfo.textContent = '';
        }
        
        // Generate all print tables
        this.generatePrintCipherTextTable();
        
        // Only generate substitution table for non-Porta ciphers
        if (selectedCipher !== 'porta') {
            this.generatePrintSubstitutionTable(selectedCipher);
            // Show substitution chart section
            const substitutionHeader = document.getElementById('substitution-chart-header');
            const substitutionTable = document.getElementById('print-substitution-table');
            if (substitutionHeader) substitutionHeader.style.display = 'block';
            if (substitutionTable) substitutionTable.style.display = 'block';
        } else {
            // Clear and hide the substitution table and header for Porta
            this.elements.printSubstitutionTable.innerHTML = '';
            // Hide substitution chart section and header
            const substitutionHeader = document.getElementById('substitution-chart-header');
            const substitutionTable = document.getElementById('print-substitution-table');
            if (substitutionHeader) substitutionHeader.style.display = 'none';
            if (substitutionTable) substitutionTable.style.display = 'none';
        }
        
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

    printReferenceSheet() {
        // Open the reference sheet PDF in a new window/tab for printing
        const referenceSheetUrl = './assets/reference-sheet.pdf';
        
        // Create a new window/tab and navigate to the PDF
        const printWindow = window.open(referenceSheetUrl, '_blank');
        
        // Focus on the new window/tab for better user experience
        if (printWindow) {
            printWindow.focus();
            
            // Wait for the PDF to load, then trigger print dialog
            printWindow.addEventListener('load', () => {
                setTimeout(() => {
                    printWindow.print();
                }, 500);
            });
        } else {
            // Fallback if popup is blocked
            alert('Please allow popups to print the reference sheet, or navigate to ./assets/reference-sheet.pdf manually.');
        }
    }

    generatePrintCipherTextTable() {
        const selectedCipher = this.elements.cipherSelect.value;
        
        // Special handling for nihilist cipher
        if (selectedCipher === 'nihilist') {
            this.generatePrintNihilistCipherTable();
            return;
        }
        
        let encodedText = this.currentCipherResult.encodedText.toUpperCase();
        
        // For Porta cipher, add spaces every 5 characters for better readability
        if (selectedCipher === 'porta') {
            encodedText = encodedText.replace(/(.{5})/g, '$1 ').trim();
        }
        
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

    generatePrintNihilistCipherTable() {
        // For Nihilist cipher, show the cipher numbers in a simple table
        const cipherNumbers = this.currentCipherResult.cipherNumbers;
        const numbersPerRow = 26; // Numbers per row to match other tables
        
        let tableHtml = '';
        
        // Split cipher numbers into rows
        let currentPos = 0;
        
        while (currentPos < cipherNumbers.length) {
            let numbersInRow = 0;
            let rowEnd = currentPos;
            
            // Find where to break the row (up to numbersPerRow numbers)
            while (rowEnd < cipherNumbers.length && numbersInRow < numbersPerRow) {
                rowEnd++;
                numbersInRow++;
            }
            
            // Create a table for this segment
            let segmentTable = '<table class="worksheet-table cipher-text-table">';
            let numberRow = '<tr>';
            let blankRow = '<tr>';
            
            // Add cipher numbers to top row, blanks to bottom row
            for (let i = currentPos; i < rowEnd && i < cipherNumbers.length; i++) {
                const number = cipherNumbers[i];
                numberRow += `<td class="cipher-char">${number}</td>`;
                blankRow += `<td class="blank-cell"></td>`;
            }
            
            numberRow += '</tr>';
            blankRow += '</tr>';
            segmentTable += numberRow + blankRow + '</table>';
            
            tableHtml += segmentTable;
            currentPos = rowEnd;
        }
        
        this.elements.printCipherTextTable.innerHTML = tableHtml;
    }

    generatePrintSubstitutionTable(selectedCipher) {
        // Special handling for nihilist cipher
        if (selectedCipher === 'nihilist') {
            this.generatePrintNihilistTable();
            return;
        }
        
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

    generateNihilistTable() {
        const result = this.currentCipherResult;
        const polybiusSquare = result.polybiusSquare;
        
        let tableHtml = '<div class="alphabet-label">Polybius Square (I/J combined):</div>';
        tableHtml += '<table class="alphabet-table polybius-table">';
        
        // Header row with column numbers
        tableHtml += '<tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>';
        
        // Add each row
        for (let row = 0; row < 5; row++) {
            tableHtml += `<tr><th>${row + 1}</th>`;
            for (let col = 0; col < 5; col++) {
                const letter = polybiusSquare[row][col];
                tableHtml += `<td>${letter}</td>`;
            }
            tableHtml += '</tr>';
        }
        
        tableHtml += '</table>';
        
        // Add encoding example
        tableHtml += '<div class="cipher-explanation">';
        tableHtml += '<strong>How it works:</strong><br>';
        tableHtml += `1. Each letter is converted to coordinates (row, column)<br>`;
        tableHtml += `2. Key "${result.nihilistKey}" is repeated and converted to coordinates<br>`;
        tableHtml += `3. Text coordinates + Key coordinates = Cipher numbers`;
        tableHtml += '</div>';
        
        return tableHtml;
    }

    generatePrintNihilistTable() {
        let tableHtml = '<table class="worksheet-table polybius-square-print">';
        tableHtml += '<tr><th colspan="6">Polybius Square (I/J combined)</th></tr>';
        
        // Header row with column numbers
        tableHtml += '<tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>';
        
        // Add each row with blank cells for user to fill in
        for (let row = 0; row < 5; row++) {
            tableHtml += `<tr><th>${row + 1}</th>`;
            for (let col = 0; col < 5; col++) {
                tableHtml += `<td class="blank-substitution"></td>`;
            }
            tableHtml += '</tr>';
        }
        
        tableHtml += '</table>';
        this.elements.printSubstitutionTable.innerHTML = tableHtml;
    }
}
