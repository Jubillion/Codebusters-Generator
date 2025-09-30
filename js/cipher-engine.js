// Cipher Engine - All cipher implementations and alphabet generation
import { CONFIG } from './config.js';

export class CipherEngine {
    constructor() {
        this.lastKeywordPositions = null;
    }

    // Helper function to create ACA-compliant keyed alphabet
    createKeyedAlphabet(keyword, positionInMiddle = false) {
        // Remove duplicates from keyword and convert to uppercase
        const cleanKeyword = [...new Set(keyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        
        // Step 1: Add the key to the alphabet
        // Get remaining letters not in keyword
        const remainingLetters = CONFIG.STANDARD_ALPHABET.split('').filter(letter => !cleanKeyword.includes(letter));
        
        let baseAlphabet;
        let keywordStartPosition;
        
        if (positionInMiddle && cleanKeyword.length <= 20) {
            // Position keyword in the middle for better visibility
            const targetStart = Math.max(0, Math.floor((26 - cleanKeyword.length) / 2));
            const beforeKeyword = remainingLetters.slice(0, targetStart);
            const afterKeyword = remainingLetters.slice(targetStart);
            
            baseAlphabet = beforeKeyword.join('') + cleanKeyword + afterKeyword.join('');
            keywordStartPosition = beforeKeyword.length;
        } else {
            // Default: keyword at the beginning
            baseAlphabet = cleanKeyword + remainingLetters.join('');
            keywordStartPosition = 0;
        }
        
        // Store keyword position for highlighting
        this.lastKeywordPositions = {
            keyword: cleanKeyword,
            startPosition: keywordStartPosition,
            endPosition: keywordStartPosition + cleanKeyword.length - 1
        };
        
        // Step 3: Apply random shift (1-25) and check for identity mappings
        return this.applyACAShift(baseAlphabet);
    }

    // Apply ACA-compliant shift with identity mapping check
    applyACAShift(alphabet) {
        let shiftAmount = Math.floor(Math.random() * 25) + 1; // Random shift 1-25
        let attempts = 0;
        const maxAttempts = 25;
        const originalKeywordPositions = { ...this.lastKeywordPositions };
        
        while (attempts < maxAttempts) {
            // Apply circular shift to the entire alphabet
            const shiftedAlphabet = this.circularShift(alphabet, shiftAmount);
            
            // Check for identity mappings against standard alphabet
            let hasIdentityMapping = false;
            for (let i = 0; i < 26; i++) {
                if (shiftedAlphabet[i] === CONFIG.STANDARD_ALPHABET[i]) {
                    hasIdentityMapping = true;
                    break;
                }
            }
            
            // If no identity mappings, update keyword positions and return
            if (!hasIdentityMapping) {
                this.updateKeywordPositionsAfterShift(originalKeywordPositions, shiftAmount);
                return shiftedAlphabet;
            }
            
            // Try next shift amount
            attempts++;
            shiftAmount = (shiftAmount % 25) + 1; // Cycle through 1-25
        }
        
        // If all shifts have identity mappings, return the last attempt
        // This is extremely rare but provides fallback
        this.updateKeywordPositionsAfterShift(originalKeywordPositions, shiftAmount);
        return this.circularShift(alphabet, shiftAmount);
    }
    
    // Apply ACA-compliant shift with additional check against another alphabet (for K3)
    applyACAShiftWithComparison(alphabet, comparisonAlphabet) {
        let shiftAmount = Math.floor(Math.random() * 25) + 1; // Random shift 1-25
        let attempts = 0;
        const maxAttempts = 25;
        const originalKeywordPositions = { ...this.lastKeywordPositions };
        
        while (attempts < maxAttempts) {
            // Apply circular shift to the entire alphabet
            const shiftedAlphabet = this.circularShift(alphabet, shiftAmount);
            
            // Check for identity mappings against standard alphabet
            let hasStandardIdentity = false;
            for (let i = 0; i < 26; i++) {
                if (shiftedAlphabet[i] === CONFIG.STANDARD_ALPHABET[i]) {
                    hasStandardIdentity = true;
                    break;
                }
            }
            
            // Check if shifted alphabet is identical to comparison alphabet
            let isIdenticalToComparison = (shiftedAlphabet === comparisonAlphabet);
            
            // If no identity mappings and not identical to comparison, return
            if (!hasStandardIdentity && !isIdenticalToComparison) {
                this.updateKeywordPositionsAfterShift(originalKeywordPositions, shiftAmount);
                return shiftedAlphabet;
            }
            
            // Try next shift amount
            attempts++;
            shiftAmount = (shiftAmount % 25) + 1; // Cycle through 1-25
        }
        
        // Fallback: return shift that at least avoids standard identity mappings
        for (let fallbackShift = 1; fallbackShift <= 25; fallbackShift++) {
            const fallbackAlphabet = this.circularShift(alphabet, fallbackShift);
            let hasStandardIdentity = false;
            for (let i = 0; i < 26; i++) {
                if (fallbackAlphabet[i] === CONFIG.STANDARD_ALPHABET[i]) {
                    hasStandardIdentity = true;
                    break;
                }
            }
            if (!hasStandardIdentity) {
                this.updateKeywordPositionsAfterShift(originalKeywordPositions, fallbackShift);
                return fallbackAlphabet;
            }
        }
        
        // Ultimate fallback
        this.updateKeywordPositionsAfterShift(originalKeywordPositions, shiftAmount);
        return this.circularShift(alphabet, shiftAmount);
    }
    
    // Helper method to update keyword positions after circular shift
    updateKeywordPositionsAfterShift(originalPositions, shiftAmount) {
        const shift = shiftAmount % 26;
        const newStartPosition = (originalPositions.startPosition - shift + 26) % 26;
        
        this.lastKeywordPositions = {
            keyword: originalPositions.keyword,
            startPosition: newStartPosition,
            endPosition: (newStartPosition + originalPositions.keyword.length - 1) % 26
        };
    }
    
    // Helper method to perform circular shift on alphabet string
    circularShift(alphabet, shiftAmount) {
        const arr = alphabet.split('');
        const n = arr.length;
        const shift = shiftAmount % n;
        
        // Perform right circular shift
        return (arr.slice(-shift).concat(arr.slice(0, -shift))).join('');
    }

    // Smart rearrangement that preserves keyword integrity with Caesar-style shifting
    smartRearrangeAlphabet(alphabet, keywordStart, keywordLength) {
        let result = alphabet.split('');
        const keywordEnd = keywordStart + keywordLength - 1;
        
        // Collect non-keyword positions and their letters
        const nonKeywordPositions = [];
        const nonKeywordLetters = [];
        
        for (let i = 0; i < 26; i++) {
            const isInKeyword = i >= keywordStart && i <= keywordEnd;
            if (!isInKeyword) {
                nonKeywordPositions.push(i);
                nonKeywordLetters.push(result[i]);
            }
        }
        
        // Try different Caesar shift amounts until we find one with no identity mappings
        let caesarShift = Math.floor(Math.random() * 24) + 1; // Start with 1-24 (avoid 0)
        let maxAttempts = 25;
        let attempt = 0;
        
        while (attempt < maxAttempts) {
            // Apply Caesar shift to the non-keyword letters
            if (nonKeywordLetters.length > 0) {
                const shiftedLetters = [];
                for (let i = 0; i < nonKeywordLetters.length; i++) {
                    const shiftedIndex = (i + caesarShift) % nonKeywordLetters.length;
                    shiftedLetters[shiftedIndex] = nonKeywordLetters[i];
                }
                
                // Put the shifted letters back into their positions
                for (let i = 0; i < nonKeywordPositions.length; i++) {
                    result[nonKeywordPositions[i]] = shiftedLetters[i];
                }
            }
            
            // Check for identity mappings
            let hasIdentityMappings = false;
            for (let i = 0; i < 26; i++) {
                if (result[i] === CONFIG.STANDARD_ALPHABET[i]) {
                    hasIdentityMappings = true;
                    break;
                }
            }
            
            // If no identity mappings found, we're done
            if (!hasIdentityMappings) {
                break;
            }
            
            // Try next shift amount (avoid 0)
            attempt++;
            caesarShift = (caesarShift % 24) + 1; // Cycle through 1-24, never 0
            
            // Reset result for next attempt
            result = alphabet.split('');
        }
        
        // If we still have identity mappings after all attempts, apply minimal swaps as fallback
        // But NEVER swap keyword letters to preserve keyword contiguity for highlighting
        for (let i = 0; i < 26; i++) {
            if (result[i] === CONFIG.STANDARD_ALPHABET[i]) {
                const isInKeyword = i >= keywordStart && i <= keywordEnd;
                
                if (isInKeyword) {
                    // Skip keyword positions - never swap keyword letters to preserve contiguity
                    // This maintains proper keyword highlighting even if it means some identity mappings remain
                    continue;
                } else {
                    // For non-keyword positions, apply a simple forward shift
                    for (let offset = 1; offset < nonKeywordPositions.length; offset++) {
                        const currentIndex = nonKeywordPositions.indexOf(i);
                        if (currentIndex !== -1) {
                            const targetIndex = (currentIndex + offset) % nonKeywordPositions.length;
                            const targetPos = nonKeywordPositions[targetIndex];
                            if (result[targetPos] !== CONFIG.STANDARD_ALPHABET[targetPos] && 
                                result[i] !== CONFIG.STANDARD_ALPHABET[targetPos] && result[targetPos] !== CONFIG.STANDARD_ALPHABET[i]) {
                                [result[i], result[targetPos]] = [result[targetPos], result[i]];
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        return result.join('');
    }

    // Create keyed alphabet without identity checking (raw version)
    createKeyedAlphabetRaw(keyword, positionInMiddle = false) {
        // Remove duplicates from keyword and convert to uppercase
        const cleanKeyword = [...new Set(keyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        
        // Get remaining letters not in keyword
        const remainingLetters = CONFIG.STANDARD_ALPHABET.split('').filter(letter => !cleanKeyword.includes(letter));
        
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

    // K4 LEGACY CODE - Included for reference only - DO NOT MODIFY
    // Smart K4-specific rearrangement that preserves both keywords with Caesar-style shifting
    smartK4Rearrangement(plaintextAlphabet, ciphertextAlphabet, plaintextPositions, ciphertextPositions) {
        let plainResult = plaintextAlphabet.split('');
        let cipherResult = ciphertextAlphabet.split('');
        
        // Collect non-keyword positions for both alphabets
        const plaintextNonKeywordPositions = [];
        const plaintextNonKeywordLetters = [];
        const ciphertextNonKeywordPositions = [];
        const ciphertextNonKeywordLetters = [];
        
        for (let i = 0; i < 26; i++) {
            const isInPlaintextKeyword = i >= plaintextPositions.startPosition && i <= plaintextPositions.endPosition;
            const isInCiphertextKeyword = i >= ciphertextPositions.startPosition && i <= ciphertextPositions.endPosition;
            
            if (!isInPlaintextKeyword) {
                plaintextNonKeywordPositions.push(i);
                plaintextNonKeywordLetters.push(plainResult[i]);
            }
            
            if (!isInCiphertextKeyword) {
                ciphertextNonKeywordPositions.push(i);
                ciphertextNonKeywordLetters.push(cipherResult[i]);
            }
        }
        
        // Try different Caesar shift amounts for plaintext until no identity mappings
        let plaintextCaesarShift = Math.floor(Math.random() * 14) + 1; // Start with 1-14 (avoid 0)
        let maxAttempts = 15;
        let attempt = 0;
        
        while (attempt < maxAttempts) {
            // Apply Caesar shift to plaintext non-keyword letters
            if (plaintextNonKeywordLetters.length > 0) {
                const shiftedPlaintextLetters = [];
                for (let i = 0; i < plaintextNonKeywordLetters.length; i++) {
                    const shiftedIndex = (i + plaintextCaesarShift) % plaintextNonKeywordLetters.length;
                    shiftedPlaintextLetters[shiftedIndex] = plaintextNonKeywordLetters[i];
                }
                
                for (let i = 0; i < plaintextNonKeywordPositions.length; i++) {
                    plainResult[plaintextNonKeywordPositions[i]] = shiftedPlaintextLetters[i];
                }
            }
            
            // Check for identity mappings in plaintext
            let hasPlaintextIdentity = false;
            for (let i = 0; i < 26; i++) {
                if (plainResult[i] === CONFIG.STANDARD_ALPHABET[i]) {
                    hasPlaintextIdentity = true;
                    break;
                }
            }
            
            if (!hasPlaintextIdentity) break;
            
            // Try next shift amount (avoid 0)
            attempt++;
            plaintextCaesarShift = (plaintextCaesarShift % 14) + 1; // Cycle through 1-14
            
            // Reset plaintext for next attempt
            plainResult = plaintextAlphabet.split('');
        }
        
        // Try different Caesar shift amounts for ciphertext until no identity mappings
        let ciphertextCaesarShift = Math.floor(Math.random() * 14) + 1; // Start with 1-14 (avoid 0)
        attempt = 0;
        
        while (attempt < maxAttempts) {
            // Apply Caesar shift to ciphertext non-keyword letters
            if (ciphertextNonKeywordLetters.length > 0) {
                const shiftedCiphertextLetters = [];
                for (let i = 0; i < ciphertextNonKeywordLetters.length; i++) {
                    const shiftedIndex = (i + ciphertextCaesarShift) % ciphertextNonKeywordLetters.length;
                    shiftedCiphertextLetters[shiftedIndex] = ciphertextNonKeywordLetters[i];
                }
                
                for (let i = 0; i < ciphertextNonKeywordPositions.length; i++) {
                    cipherResult[ciphertextNonKeywordPositions[i]] = shiftedCiphertextLetters[i];
                }
            }
            
            // Check for identity mappings in ciphertext
            let hasCiphertextIdentity = false;
            for (let i = 0; i < 26; i++) {
                if (cipherResult[i] === CONFIG.STANDARD_ALPHABET[i]) {
                    hasCiphertextIdentity = true;
                    break;
                }
            }
            
            if (!hasCiphertextIdentity) break;
            
            // Try next shift amount (avoid 0)
            attempt++;
            ciphertextCaesarShift = (ciphertextCaesarShift % 14) + 1; // Cycle through 1-14
            
            // Reset ciphertext for next attempt
            cipherResult = ciphertextAlphabet.split('');
        }
        
        // Final fallback: if still have identity mappings, apply minimal swaps
        for (let i = 0; i < 26; i++) {
            if (plainResult[i] === CONFIG.STANDARD_ALPHABET[i]) {
                const isInPlaintextKeyword = i >= plaintextPositions.startPosition && i <= plaintextPositions.endPosition;
                
                if (!isInPlaintextKeyword) {
                    const currentIndex = plaintextNonKeywordPositions.indexOf(i);
                    if (currentIndex !== -1) {
                        for (let offset = 1; offset < plaintextNonKeywordPositions.length; offset++) {
                            const targetIndex = (currentIndex + offset) % plaintextNonKeywordPositions.length;
                            const targetPos = plaintextNonKeywordPositions[targetIndex];
                            if (plainResult[targetPos] !== CONFIG.STANDARD_ALPHABET[targetPos]) {
                                [plainResult[i], plainResult[targetPos]] = [plainResult[targetPos], plainResult[i]];
                                break;
                            }
                        }
                    }
                }
            }
            
            if (cipherResult[i] === CONFIG.STANDARD_ALPHABET[i]) {
                const isInCiphertextKeyword = i >= ciphertextPositions.startPosition && i <= ciphertextPositions.endPosition;
                
                if (!isInCiphertextKeyword) {
                    const currentIndex = ciphertextNonKeywordPositions.indexOf(i);
                    if (currentIndex !== -1) {
                        for (let offset = 1; offset < ciphertextNonKeywordPositions.length; offset++) {
                            const targetIndex = (currentIndex + offset) % ciphertextNonKeywordPositions.length;
                            const targetPos = ciphertextNonKeywordPositions[targetIndex];
                            if (cipherResult[targetPos] !== CONFIG.STANDARD_ALPHABET[targetPos]) {
                                [cipherResult[i], cipherResult[targetPos]] = [cipherResult[targetPos], cipherResult[i]];
                                break;
                            }
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

    // K1 - Mixed plaintext alphabet, standard ciphertext (ACA compliant)
    k1Cipher(text, keyword) {
        // Create keyed plaintext alphabet using ACA method
        const keyedPlaintext = this.createKeyedAlphabet(keyword);
        const plaintextPositions = { ...this.lastKeywordPositions };
        const plaintextAlphabet = keyedPlaintext;
        const ciphertextAlphabet = CONFIG.STANDARD_ALPHABET;
        
        return {
            encodedText: this.substituteText(text, keyedPlaintext, ciphertextAlphabet),
            plaintextAlphabet,
            ciphertextAlphabet,
            plaintextPositions
        };
    }

    // K2 - Standard plaintext, mixed ciphertext alphabet (ACA compliant)
    k2Cipher(text, keyword) {
        const plaintextAlphabet = CONFIG.STANDARD_ALPHABET;
        
        // Create keyed ciphertext alphabet using ACA method
        const keyedCiphertext = this.createKeyedAlphabet(keyword);
        const ciphertextPositions = { ...this.lastKeywordPositions };
        const ciphertextAlphabet = keyedCiphertext;
        
        return {
            encodedText: this.substituteText(text, plaintextAlphabet, keyedCiphertext),
            plaintextAlphabet,
            ciphertextAlphabet,
            ciphertextPositions
        };
    }

    // K3 - Both alphabets mixed with same keyword (ACA compliant)
    k3Cipher(text, keyword) {
        // Create base keyed alphabet without shifting
        const cleanKeyword = [...new Set(keyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        const remainingLetters = CONFIG.STANDARD_ALPHABET.split('').filter(letter => !cleanKeyword.includes(letter));
        const baseKeyedAlphabet = cleanKeyword + remainingLetters.join('');
        
        // Plaintext alphabet - use base keyed alphabet without shifting
        this.lastKeywordPositions = {
            keyword: cleanKeyword,
            startPosition: 0,
            endPosition: cleanKeyword.length - 1
        };
        const plaintextAlphabet = baseKeyedAlphabet;
        const plaintextPositions = { ...this.lastKeywordPositions };
        
        // Ciphertext alphabet - apply ACA shift ensuring it's different from plaintext
        const ciphertextAlphabet = this.applyACAShiftWithComparison(baseKeyedAlphabet, plaintextAlphabet);
        const ciphertextPositions = { ...this.lastKeywordPositions };
        
        return {
            encodedText: this.substituteText(text, plaintextAlphabet, ciphertextAlphabet),
            plaintextAlphabet,
            ciphertextAlphabet,
            plaintextPositions,
            ciphertextPositions
        };
    }

    // K4 LEGACY CODE - Included for reference only - DO NOT MODIFY
    // K4 - Both alphabets mixed with different keywords (ACA compliant)
    k4Cipher(text, plaintextKeyword, ciphertextKeyword) {
        // Create plaintext alphabet with first keyword using ACA method
        const plaintextAlphabet = this.createKeyedAlphabet(plaintextKeyword);
        const plaintextPositions = { ...this.lastKeywordPositions };
        
        // Create ciphertext alphabet with second keyword using ACA method
        const ciphertextAlphabet = this.createKeyedAlphabet(ciphertextKeyword, true);
        const ciphertextPositions = { ...this.lastKeywordPositions };
        
        return {
            encodedText: this.substituteText(text, plaintextAlphabet, ciphertextAlphabet),
            plaintextAlphabet,
            ciphertextAlphabet,
            plaintextPositions,
            ciphertextPositions
        };
    }

    // Random alphabet substitution
    randomCipher(text, randomAlphabet) {
        return {
            encodedText: this.substituteText(text, CONFIG.STANDARD_ALPHABET, randomAlphabet),
            plaintextAlphabet: CONFIG.STANDARD_ALPHABET,
            ciphertextAlphabet: randomAlphabet
        };
    }

    // Nihilist cipher implementation
    nihilistCipher(text, polybiusKey, key) {
        // Create the Polybius square with deranged alphabet (I/J combined)
        const polybiusSquare = this.createPolybiusSquare(polybiusKey);
        
        // Convert text to coordinates
        const coordinates = this.textToCoordinates(text, polybiusSquare);
        
        // Convert key to coordinates and repeat as needed
        const keyCoordinates = this.keyToCoordinates(key, polybiusSquare, coordinates.length);
        
        // Add coordinates together to get cipher numbers
        const cipherNumbers = [];
        for (let i = 0; i < coordinates.length; i++) {
            const textCoord = coordinates[i];
            const keyCoord = keyCoordinates[i];
            if (textCoord && keyCoord) {
                cipherNumbers.push(textCoord + keyCoord);
            }
        }
        
        // Join cipher numbers with spaces
        const encodedText = cipherNumbers.join(' ');
        
        return {
            encodedText,
            polybiusSquare,
            polybiusKey,
            key,
            coordinates,
            keyCoordinates,
            cipherNumbers
        };
    }

    // Porta cipher implementation - polyalphabetic substitution cipher
    portaCipher(text, keyword) {
        const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
        const cleanKeyword = keyword.toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!cleanKeyword) {
            throw new Error('Keyword cannot be empty');
        }
        
        // Porta cipher tableau - each pair of key letters uses the same row
        const portaTableau = {
            'AB': 'NOPQRSTUVWXYZABCDEFGHIJKLM',
            'CD': 'OPQRSTUVWXYZABCDEFGHIJKLMN',
            'EF': 'PQRSTUVWXYZABCDEFGHIJKLMNO',
            'GH': 'QRSTUVWXYZABCDEFGHIJKLMNOP',
            'IJ': 'RSTUVWXYZABCDEFGHIJKLMNOPQ',
            'KL': 'STUVWXYZABCDEFGHIJKLMNOPQR',
            'MN': 'TUVWXYZABCDEFGHIJKLMNOPQRS',
            'OP': 'UVWXYZABCDEFGHIJKLMNOPQRST',
            'QR': 'VWXYZABCDEFGHIJKLMNOPQRSTU',
            'ST': 'WXYZABCDEFGHIJKLMNOPQRSTUV',
            'UV': 'XYZABCDEFGHIJKLMNOPQRSTUVW',
            'WX': 'YZABCDEFGHIJKLMNOPQRSTUVWX',
            'YZ': 'ZABCDEFGHIJKLMNOPQRSTUVWXY'
        };
        
        const plainAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        // Function to get the cipher alphabet for a given key letter
        const getCipherAlphabet = (keyLetter) => {
            for (const [keyPair, cipherAlph] of Object.entries(portaTableau)) {
                if (keyPair.includes(keyLetter)) {
                    return cipherAlph;
                }
            }
            return plainAlphabet; // fallback
        };
        
        let encodedText = '';
        let keywordExtended = '';
        
        // Extend keyword to match text length
        for (let i = 0; i < cleanText.length; i++) {
            keywordExtended += cleanKeyword[i % cleanKeyword.length];
        }
        
        // Encrypt each letter
        for (let i = 0; i < cleanText.length; i++) {
            const plainLetter = cleanText[i];
            const keyLetter = keywordExtended[i];
            
            const plainIndex = plainAlphabet.indexOf(plainLetter);
            const cipherAlphabet = getCipherAlphabet(keyLetter);
            const encodedLetter = cipherAlphabet[plainIndex];
            
            encodedText += encodedLetter;
        }
        
        return {
            encodedText,
            keyword: cleanKeyword,
            extendedKeyword: keywordExtended,
            tableau: portaTableau
        };
    }
    
    // Create Polybius square with deranged alphabet
    createPolybiusSquare(polybiusKey) {
        // Clean the keyword - remove J and duplicates
        const cleanKey = polybiusKey.toUpperCase()
            .replace(/J/g, '') // Remove J entirely
            .replace(/[^A-Z]/g, ''); // Remove non-letters
        
        const uniqueKey = [...new Set(cleanKey)].join('');
        
        // Get remaining letters (excluding J)
        const remainingLetters = CONFIG.STANDARD_ALPHABET
            .replace('J', '') // Remove J from standard alphabet
            .split('')
            .filter(letter => !uniqueKey.includes(letter));
        
        // Create deranged alphabet
        const derangedAlphabet = uniqueKey + remainingLetters.join('');
        
        // Create 5x5 grid
        const square = [];
        for (let row = 0; row < 5; row++) {
            const rowArray = [];
            for (let col = 0; col < 5; col++) {
                const index = row * 5 + col;
                rowArray.push(derangedAlphabet[index]);
            }
            square.push(rowArray);
        }
        
        return square;
    }
    
    // Convert text to coordinate pairs
    textToCoordinates(text, polybiusSquare) {
        const coordinates = [];
        const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
        
        for (const char of cleanText) {
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    if (polybiusSquare[row][col] === char) {
                        // Use 1-based indexing for coordinates
                        coordinates.push(parseInt(`${row + 1}${col + 1}`));
                        break;
                    }
                }
            }
        }
        
        return coordinates;
    }
    
    // Convert key to coordinates and repeat as needed
    keyToCoordinates(key, polybiusSquare, length) {
        const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
        const keyCoordinates = [];
        
        // Get coordinates for key letters
        const singleKeyCoords = [];
        for (const char of cleanKey) {
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    if (polybiusSquare[row][col] === char) {
                        singleKeyCoords.push(parseInt(`${row + 1}${col + 1}`));
                        break;
                    }
                }
            }
        }
        
        // Repeat key coordinates to match text length
        for (let i = 0; i < length; i++) {
            keyCoordinates.push(singleKeyCoords[i % singleKeyCoords.length]);
        }
        
        return keyCoordinates;
    }

    // Complete Columnar Transposition Cipher
    columnarCipher(text) {
        // Generate random number of columns (1-9)
        const numColumns = Math.floor(Math.random() * 6) + 4;
        
        // Generate random column ordering
        const columns = Array.from({length: numColumns}, (_, i) => i + 1);
        const originalColumns = [...columns];
        
        // Shuffle the columns to create the key ordering
        // Keep shuffling until we get a different order than the original
        let shuffleAttempts = 0;
        const maxShuffleAttempts = 100; // Prevent infinite loop
        
        do {
            // Fisher-Yates shuffle
            for (let i = columns.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [columns[i], columns[j]] = [columns[j], columns[i]];
            }
            shuffleAttempts++;
        } while (this.arraysEqual(columns, originalColumns) && shuffleAttempts < maxShuffleAttempts);
        
        // If we somehow still have the original order after max attempts (very rare),
        // manually swap the first two elements to ensure different order
        if (this.arraysEqual(columns, originalColumns) && numColumns > 1) {
            [columns[0], columns[1]] = [columns[1], columns[0]];
        }
        
        // Clean text - remove non-alphabetic characters and convert to uppercase
        const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
        
        // Pad text to fill complete rows if needed
        const padding = numColumns - (cleanText.length % numColumns);
        const paddedText = cleanText + 'X'.repeat(padding === numColumns ? 0 : padding);
        
        // Create grid
        const numRows = Math.ceil(paddedText.length / numColumns);
        const grid = [];
        
        // Fill grid row by row
        for (let row = 0; row < numRows; row++) {
            const gridRow = [];
            for (let col = 0; col < numColumns; col++) {
                const index = row * numColumns + col;
                gridRow.push(index < paddedText.length ? paddedText[index] : '');
            }
            grid.push(gridRow);
        }
        
        // Read columns in key order
        let encodedText = '';
        for (let keyPos = 1; keyPos <= numColumns; keyPos++) {
            const colIndex = columns.indexOf(keyPos);
            for (let row = 0; row < numRows; row++) {
                if (grid[row][colIndex]) {
                    encodedText += grid[row][colIndex];
                }
            }
        }
        
        return {
            encodedText,
            numColumns,
            originalColumns,
            keyOrder: columns,
            grid,
            paddedText
        };
    }

    // 2x2 Hill Cipher
    hillCipher(text) {
        // Generate a random invertible 2x2 matrix (either numeric or word-based)
        const matrixData = this.generateInvertibleMatrix();
        
        // Clean text - remove non-alphabetic characters and convert to uppercase
        const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
        
        // Pad text to even length if needed
        const paddedText = cleanText.length % 2 === 0 ? cleanText : cleanText + 'X';
        
        // Encrypt in pairs using numeric matrix
        let encodedText = '';
        for (let i = 0; i < paddedText.length; i += 2) {
            const char1 = paddedText[i];
            const char2 = paddedText[i + 1];
            
            // Convert to numbers (A=0, B=1, ..., Z=25)
            const num1 = char1.charCodeAt(0) - 65;
            const num2 = char2.charCodeAt(0) - 65;
            
            // Matrix multiplication: [a b] [x] = [ax + by]
            //                        [c d] [y]   [cx + dy]
            const result1 = (matrixData.numericMatrix[0][0] * num1 + matrixData.numericMatrix[0][1] * num2) % 26;
            const result2 = (matrixData.numericMatrix[1][0] * num1 + matrixData.numericMatrix[1][1] * num2) % 26;
            
            // Convert back to letters
            encodedText += String.fromCharCode(result1 + 65);
            encodedText += String.fromCharCode(result2 + 65);
        }
        
        return {
            encodedText,
            matrix: matrixData.displayMatrix,
            numericMatrix: matrixData.numericMatrix,
            isWordBased: matrixData.isWordBased,
            keyword: matrixData.keyword,
            paddedText
        };
    }

    // Generate a random 2x2 matrix that is invertible mod 26
    generateInvertibleMatrix() {
        // Randomly decide whether to use word-based or numeric matrix
        const useWordBased = Math.random() < 0.5;
        
        if (useWordBased) {
            return this.generateWordBasedMatrix();
        } else {
            return this.generateNumericMatrix();
        }
    }
    
    // Generate matrix from a 4-letter word (all keywords are pre-verified as invertible)
    generateWordBasedMatrix() {
        // Select a random 4-letter word from pre-verified invertible keywords
        const hillKeywords = CONFIG.HILL_CIPHER_KEYWORDS;
        const keyword = hillKeywords[Math.floor(Math.random() * hillKeywords.length)];
        
        // Convert letters to numbers for the numeric matrix
        const numericMatrix = [
            [keyword.charCodeAt(0) - 65, keyword.charCodeAt(1) - 65],
            [keyword.charCodeAt(2) - 65, keyword.charCodeAt(3) - 65]
        ];
        
        // Create display matrix with letters
        const displayMatrix = [
            [keyword[0], keyword[1]],
            [keyword[2], keyword[3]]
        ];
        
        return {
            displayMatrix,
            numericMatrix,
            isWordBased: true,
            keyword
        };
    }
    
    // Generate numeric matrix
    generateNumericMatrix() {
        let matrix;
        let det;
        let attempts = 0;
        const maxAttempts = 1000;
        
        do {
            // Generate random 2x2 matrix with values 0-25
            matrix = [
                [Math.floor(Math.random() * 26), Math.floor(Math.random() * 26)],
                [Math.floor(Math.random() * 26), Math.floor(Math.random() * 26)]
            ];
            
            det = this.determinant2x2(matrix);
            attempts++;
        } while (this.gcd(det, 26) !== 1 && attempts < maxAttempts);
        
        // If we couldn't find an invertible matrix, use a known good one
        if (this.gcd(det, 26) !== 1) {
            matrix = [[3, 2], [5, 7]]; // Known invertible matrix
        }
        
        return {
            displayMatrix: matrix,
            numericMatrix: matrix,
            isWordBased: false,
            keyword: null
        };
    }


    // Calculate determinant of 2x2 matrix
    determinant2x2(matrix) {
        const det = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 26;
        return det < 0 ? det + 26 : det; // Ensure positive result
    }

    // Calculate GCD using Euclidean algorithm
    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Helper method to check if two arrays are equal
    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
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
}
