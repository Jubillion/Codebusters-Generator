// Configuration and Constants
export const CONFIG = {
    STANDARD_ALPHABET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    
    // List of 100+ keywords for cipher generation
    KEYWORD_LIST: [
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
    ],

    FALLBACK_QUOTES: [
        { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
        { q: "Life is what happens to you while you're busy making other plans.", a: "John Lennon" },
        { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
        { q: "In the middle of difficulty lies opportunity.", a: "Albert Einstein" },
        { q: "It is during our darkest moments that we must focus to see the light.", a: "Aristotle" },
        { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
        { q: "The way to get started is to quit talking and begin doing.", a: "Walt Disney" },
        { q: "Don't let yesterday take up too much of today.", a: "Will Rogers" },
        { q: "You learn more from failure than from success.", a: "Unknown" },
        { q: "If you are working on something that you really care about, you don't have to be pushed.", a: "Steve Jobs" },
        { q: "The only impossible journey is the one you never begin.", a: "Tony Robbins" },
        { q: "The greatest glory in living lies not in never falling, but in rising every time we fall.", a: "Nelson Mandela" },
        { q: "Your time is limited, don't waste it living someone else's life.", a: "Steve Jobs" },
        { q: "If life were predictable it would cease to be life, and be without flavor.", a: "Eleanor Roosevelt" },
        { q: "In the end, it's not the years in your life that count. It's the life in your years.", a: "Abraham Lincoln" },
        { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
        { q: "The only person you are destined to become is the person you decide to be.", a: "Ralph Waldo Emerson" },
        { q: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", a: "Maya Angelou" },
        { q: "Whether you think you can or you think you can't, you're right.", a: "Henry Ford" },
        { q: "Perfection is not attainable, but if we chase perfection we can catch excellence.", a: "Vince Lombardi" }
    ]
};

export class KeywordGenerator {
    constructor() {
        this.currentKeywords = this.generateRandomKeywords();
    }

    generateRandomKeywords() {
        // Shuffle the keyword list and pick keywords for each cipher type
        const shuffled = [...CONFIG.KEYWORD_LIST].sort(() => Math.random() - 0.5);
        return {
            k1: shuffled[0],
            k2: shuffled[1],
            k3: shuffled[2],
            k4Plaintext: shuffled[3],
            k4Ciphertext: shuffled[4]
        };
    }

    regenerate() {
        this.currentKeywords = this.generateRandomKeywords();
        return this.currentKeywords;
    }

    generateRandomAlphabet() {
        const maxAttempts = 10;
        const triedAlphabets = new Set();
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // Create a shuffled alphabet
            const alphabet = CONFIG.STANDARD_ALPHABET.split('');
            
            // Fisher-Yates shuffle
            for (let i = alphabet.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [alphabet[i], alphabet[j]] = [alphabet[j], alphabet[i]];
            }
            
            const shuffledAlphabet = alphabet.join('');
            
            // Check if any letter maps to itself
            let hasIdentityMapping = false;
            for (let i = 0; i < 26; i++) {
                if (shuffledAlphabet[i] === CONFIG.STANDARD_ALPHABET[i]) {
                    hasIdentityMapping = true;
                    break;
                }
            }
            
            // If no identity mappings and not tried before, use this alphabet
            if (!hasIdentityMapping && !triedAlphabets.has(shuffledAlphabet)) {
                return shuffledAlphabet;
            }
            
            triedAlphabets.add(shuffledAlphabet);
        }
        
        // Fallback: use a simple shift of 13 positions
        return CONFIG.STANDARD_ALPHABET.slice(13) + CONFIG.STANDARD_ALPHABET.slice(0, 13);
    }
}
