// Cipher Engine - All cipher implementations and alphabet generation
import { CONFIG } from './config.js';

export class CipherEngine {
    constructor() {
        this.lastKeywordPositions = null;
    }

    // Helper function to create keyed alphabet with keyword positioned for readability
    createKeyedAlphabet(keyword, positionInMiddle = false) {
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
        
        // Apply smart rearrangement to prevent identity mappings while preserving keyword
        return this.smartRearrangeAlphabet(finalAlphabet, keywordStartPosition, cleanKeyword.length);
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

    // K1 - Mixed plaintext alphabet, standard ciphertext
    k1Cipher(text, keyword) {
        const keyedPlaintext = this.createKeyedAlphabet(keyword);
        const plaintextPositions = { ...this.lastKeywordPositions };
        const plaintextAlphabet = keyedPlaintext;
        const standardCipher = CONFIG.STANDARD_ALPHABET;
        
        return {
            encodedText: this.substituteText(text, keyedPlaintext, standardCipher),
            plaintextAlphabet,
            ciphertextAlphabet: standardCipher,
            plaintextPositions
        };
    }

    // K2 - Standard plaintext, mixed ciphertext alphabet
    k2Cipher(text, keyword) {
        const standardPlaintext = CONFIG.STANDARD_ALPHABET;
        const keyedCipher = this.createKeyedAlphabet(keyword);
        const ciphertextPositions = { ...this.lastKeywordPositions };
        const ciphertextAlphabet = keyedCipher;
        
        return {
            encodedText: this.substituteText(text, standardPlaintext, keyedCipher),
            plaintextAlphabet: standardPlaintext,
            ciphertextAlphabet,
            ciphertextPositions
        };
    }

    // K3 - Both alphabets mixed with same keyword but positioned differently
    k3Cipher(text, keyword) {
        const keyedPlaintext = this.createKeyedAlphabet(keyword);
        const plaintextPositions = { ...this.lastKeywordPositions };
        const plaintextAlphabet = keyedPlaintext;
        
        // Create a different arrangement for ciphertext using the same keyword but positioned in middle
        const keyedCipher = this.createKeyedAlphabet(keyword, true);
        const ciphertextPositions = { ...this.lastKeywordPositions };
        const ciphertextAlphabet = keyedCipher;
        
        return {
            encodedText: this.substituteText(text, keyedPlaintext, keyedCipher),
            plaintextAlphabet,
            ciphertextAlphabet,
            plaintextPositions,
            ciphertextPositions
        };
    }

    // K4 - Both alphabets mixed with different keywords
    k4Cipher(text, plaintextKeyword, ciphertextKeyword) {
        // Create both alphabets first without identity checking
        const keyedPlaintext = this.createKeyedAlphabetRaw(plaintextKeyword);
        const plaintextPositions = { ...this.lastKeywordPositions };
        
        // Position the second keyword in the middle for better visibility
        const keyedCipher = this.createKeyedAlphabetRaw(ciphertextKeyword, true);
        const ciphertextPositions = { ...this.lastKeywordPositions };
        
        // Now apply smart K4 rearrangement that considers both keywords
        const { finalPlaintext, finalCiphertext } = this.smartK4Rearrangement(
            keyedPlaintext, 
            keyedCipher, 
            plaintextPositions, 
            ciphertextPositions
        );
        
        return {
            encodedText: this.substituteText(text, finalPlaintext, finalCiphertext),
            plaintextAlphabet: finalPlaintext,
            ciphertextAlphabet: finalCiphertext,
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
