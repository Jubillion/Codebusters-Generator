// Validation System for Keyword Positioning
import { CONFIG } from './config.js';

export class Validator {
    constructor() {}

    // Validation and auto-fix function for keyword positioning
    validateAndFixKeywordPositioning(cipherType, cipherResult, maxRetries = 5) {
        let attempts = 0;
        let isFixed = false;

        while (attempts < maxRetries && !isFixed) {
            const results = this.validateKeywordPositioning(cipherType, cipherResult, false); // Silent validation
            
            if (results.isValid && results.errors.length === 0 && this.hasProperKeywordOrder(cipherType, cipherResult)) {
                isFixed = true;
                break;
            }

            // For this refactored version, we'll assume the cipher engine handles fixes
            // In practice, you'd need to regenerate the cipher here
            attempts++;
        }

        return {
            isFixed,
            attempts,
            maxRetriesReached: attempts >= maxRetries
        };
    }

    // Check if keywords are in proper order and contiguous
    hasProperKeywordOrder(cipherType, cipherResult) {
        try {
            switch (cipherType) {
                case 'k1':
                    return this.checkKeywordOrder(cipherResult.plaintextAlphabet, cipherResult.keyword);
                case 'k2':
                    return this.checkKeywordOrder(cipherResult.ciphertextAlphabet, cipherResult.keyword);
                case 'k3':
                    return this.checkKeywordOrder(cipherResult.plaintextAlphabet, cipherResult.keyword) &&
                           this.checkKeywordOrder(cipherResult.ciphertextAlphabet, cipherResult.keyword);
                case 'k4': // K4 LEGACY CODE - Included for reference only - DO NOT MODIFY
                    return this.checkKeywordOrder(cipherResult.plaintextAlphabet, cipherResult.plaintextKeyword) &&
                           this.checkKeywordOrder(cipherResult.ciphertextAlphabet, cipherResult.ciphertextKeyword);
                case 'porta':
                    // Porta cipher doesn't use standard alphabets, so keyword validation is different
                    return this.validatePortaKeyword(cipherResult.keyword);
                default:
                    return true;
            }
        } catch (error) {
            return false;
        }
    }

    checkKeywordOrder(alphabet, keyword) {
        const cleanKeyword = [...new Set(keyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        const keywordLetters = [...cleanKeyword];
        
        // Find positions of keyword letters
        const positions = [];
        for (const letter of keywordLetters) {
            const pos = alphabet.indexOf(letter);
            if (pos === -1) return false;
            positions.push(pos);
        }
        
        // Check if positions are contiguous and in order
        positions.sort((a, b) => a - b);
        for (let i = 1; i < positions.length; i++) {
            if (positions[i] !== positions[i-1] + 1) {
                return false;
            }
        }
        
        // Check if letters appear in correct order at those positions
        const foundSequence = positions.map(pos => alphabet[pos]).join('');
        return foundSequence === cleanKeyword;
    }

    // Silent validation function
    validateKeywordPositioning(cipherType, cipherResult, outputToConsole = true) {
        const results = {
            isValid: true,
            errors: [],
            warnings: []
        };

        try {
            switch (cipherType) {
                case 'k1':
                    this.validateK1Keywords(cipherResult, results);
                    break;
                case 'k2':
                    this.validateK2Keywords(cipherResult, results);
                    break;
                case 'k3':
                    this.validateK3Keywords(cipherResult, results);
                    break;
                case 'k4': // K4 LEGACY CODE - Included for reference only - DO NOT MODIFY
                    this.validateK4Keywords(cipherResult, results);
                    break;
                case 'porta':
                    this.validatePortaKeywords(cipherResult, results);
                    break;
            }
        } catch (error) {
            results.isValid = false;
            results.errors.push(`Validation error: ${error.message}`);
        }

        // Log validation results to console only if requested
        if (outputToConsole) {
            if (results.errors.length > 0) {
                console.warn(`Keyword validation failed for ${cipherType}:`, results.errors);
            }
            if (results.warnings.length > 0) {
                console.info(`Keyword validation warnings for ${cipherType}:`, results.warnings);
            }
            if (results.isValid && results.errors.length === 0) {
                console.log(`✓ Keyword validation passed for ${cipherType}`);
            }
        }

        return results;
    }

    validateK1Keywords(cipherResult, results) {
        const alphabet = cipherResult.plaintextAlphabet;
        const keyword = cipherResult.keyword;
        const cleanKeyword = [...new Set(keyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        
        this.validateKeywordInAlphabet(alphabet, cleanKeyword, 'K1 plaintext', results);
    }

    validateK2Keywords(cipherResult, results) {
        const alphabet = cipherResult.ciphertextAlphabet;
        const keyword = cipherResult.keyword;
        const cleanKeyword = [...new Set(keyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        
        this.validateKeywordInAlphabet(alphabet, cleanKeyword, 'K2 ciphertext', results);
    }

    validateK3Keywords(cipherResult, results) {
        const plaintextAlphabet = cipherResult.plaintextAlphabet;
        const ciphertextAlphabet = cipherResult.ciphertextAlphabet;
        const keyword = cipherResult.keyword;
        const cleanKeyword = [...new Set(keyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        
        this.validateKeywordInAlphabet(plaintextAlphabet, cleanKeyword, 'K3 plaintext', results);
        this.validateKeywordInAlphabet(ciphertextAlphabet, cleanKeyword, 'K3 ciphertext', results);
    }

    // K4 LEGACY CODE - Included for reference only - DO NOT MODIFY
    validateK4Keywords(cipherResult, results) {
        const plaintextAlphabet = cipherResult.plaintextAlphabet;
        const ciphertextAlphabet = cipherResult.ciphertextAlphabet;
        const plaintextKeyword = cipherResult.plaintextKeyword;
        const ciphertextKeyword = cipherResult.ciphertextKeyword;
        
        const cleanPlaintextKeyword = [...new Set(plaintextKeyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        const cleanCiphertextKeyword = [...new Set(ciphertextKeyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        
        this.validateKeywordInAlphabet(plaintextAlphabet, cleanPlaintextKeyword, 'K4 plaintext', results);
        this.validateKeywordInAlphabet(ciphertextAlphabet, cleanCiphertextKeyword, 'K4 ciphertext', results);
    }

    validatePortaKeywords(cipherResult, results) {
        const keyword = cipherResult.keyword;
        const cleanKeyword = [...new Set(keyword.toUpperCase().replace(/[^A-Z]/g, ''))].join('');
        
        // Porta cipher validation is simpler - just ensure keyword is valid
        if (!cleanKeyword) {
            results.isValid = false;
            results.errors.push('Porta cipher keyword cannot be empty');
        }
        
        // Store clean keyword for reference
        results.cleanKeyword = cleanKeyword;
    }

    validatePortaKeyword(keyword) {
        // Simple validation for Porta keyword - just needs to be non-empty
        const cleanKeyword = keyword.toUpperCase().replace(/[^A-Z]/g, '');
        return cleanKeyword.length > 0;
    }

    validateKeywordInAlphabet(alphabet, keyword, context, results) {
        const keywordLetters = [...keyword];
        let foundPositions = [];
        
        // Find all positions of keyword letters in the alphabet
        for (let i = 0; i < keywordLetters.length; i++) {
            const letter = keywordLetters[i];
            const position = alphabet.indexOf(letter);
            
            if (position === -1) {
                results.isValid = false;
                results.errors.push(`${context}: Keyword letter '${letter}' not found in alphabet`);
                continue;
            }
            
            foundPositions.push({ letter, position, expectedIndex: i });
        }
        
        if (foundPositions.length === 0) {
            return; // No valid positions found, already logged errors
        }
        
        // Sort positions by their location in the alphabet
        foundPositions.sort((a, b) => a.position - b.position);
        
        // Check if keyword letters are contiguous (in one place)
        let isContiguous = true;
        for (let i = 1; i < foundPositions.length; i++) {
            if (foundPositions[i].position !== foundPositions[i-1].position + 1) {
                isContiguous = false;
                break;
            }
        }
        
        if (!isContiguous) {
            results.warnings.push(`${context}: Keyword letters are not contiguous in alphabet. Positions: ${foundPositions.map(p => `${p.letter}@${p.position}`).join(', ')}`);
        }
        
        // Check if keyword letters are in the correct order
        let isCorrectOrder = true;
        const expectedOrder = [...keyword];
        const actualOrder = foundPositions.map(p => p.letter);
        
        for (let i = 0; i < expectedOrder.length; i++) {
            if (expectedOrder[i] !== actualOrder[i]) {
                isCorrectOrder = false;
                break;
            }
        }
        
        if (!isCorrectOrder) {
            results.warnings.push(`${context}: Keyword letters not in expected order. Expected: ${expectedOrder.join('')}, Found: ${actualOrder.join('')}`);
        }
        
        // Success case
        if (isContiguous && isCorrectOrder) {
            results.warnings.push(`${context}: ✓ Keyword '${keyword}' correctly positioned at positions ${foundPositions[0].position}-${foundPositions[foundPositions.length-1].position}`);
        }
    }
}
