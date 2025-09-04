# Quote Cipher - Codebusters Web App

A simple web application that fetches random quotes from the ZenQuotes API and encodes them using various monoalphabetic ciphers.

## Features

- **Random Quote Fetching**: Gets quotes from ZenQuotes.io API (no API key required)
- **Five Cipher Types** with **Random Keywords**:
  - **K1**: Mixed plaintext alphabet, standard ciphertext alphabet
  - **K2**: Standard plaintext alphabet, mixed ciphertext alphabet
  - **K3**: Both alphabets mixed with same random keyword
  - **K4**: Both alphabets mixed with different random keywords
  - **Random Alphabet**: Completely randomized substitution alphabet
- **Cryptogram Format**: Shows only encoded text (no plaintext) for solving practice
- **100+ Random Keywords**: Each cipher uses randomly selected keywords from a large pool
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Encoding**: Change cipher type to instantly re-encode with new random keywords
- **ACA Compliant**: All ciphers follow ACA rules (no letter stands for itself)

## How to Use

1. Open `index.html` in your web browser
2. Select a cipher type from the dropdown menu
3. Click "Get Random Quote" to fetch a new quote
4. View the encoded cryptogram (plaintext is hidden for solving practice)
5. The author and random keywords used are shown in the cipher info
6. Change the cipher type to see different encodings with new random keywords

## Cipher Details

### K1 Cipher

- **Mixed plaintext alphabet** using random keyword, **standard ciphertext alphabet**
- Keywords randomly selected from 100+ word pool (e.g., ADVENTURE, GALAXY, TREASURE)
- Alphabet automatically shifted to avoid identity mappings
- Example: With keyword "MOUNTAIN" → "HELLO" → "GDKKN"

### K2 Cipher

- **Standard plaintext alphabet**, **mixed ciphertext alphabet** using random keyword
- New random keyword selected each time
- Example: With keyword "CRYSTAL" → "HELLO" → "AJCCQ"

### K3 Cipher

- **Both alphabets mixed** using the **same random keyword**
- Creates more complex substitution patterns
- Example: With keyword "PHOENIX" → "HELLO" → "BJCCQ"

### K4 Cipher

- **Both alphabets mixed** using **different random keywords**
- Most complex substitution pattern with two independent keywords
- Example: With keywords "GALAXY/OCEAN" → "HELLO" → "FJDDQ"

### Random Alphabet

- **Completely randomized** substitution alphabet
- New random alphabet generated each time option is selected
- Shows the full substitution alphabet in cipher info

### Keyword Pool

The app randomly selects from 100+ keywords including: ADVENTURE, BEAUTIFUL, CHALLENGE, DISCOVERY, ELEPHANT, FANTASTIC, GALAXY, HARMONY, IMAGINATION, JOURNEY, KNOWLEDGE, LIGHTHOUSE, MOUNTAIN, NAUTICAL, OCEAN, PARADISE, QUALITY, RAINBOW, SUNSHINE, TREASURE, UNIVERSE, VICTORY, WISDOM, and many more.

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and responsive design
- `script.js` - JavaScript functionality and cipher algorithms

## Testing

- Press `Ctrl+T` to load a sample quote for testing purposes
- The app handles API errors gracefully
- All ciphers preserve non-alphabetic characters (spaces, punctuation, numbers)

## Browser Compatibility

Works in all modern browsers that support:

- ES6 Classes
- Fetch API
- CSS Grid
- Flexbox

## Notes

- **API Access**: The ZenQuotes API has CORS restrictions for browser-based requests
- **Fallback System**: When the API is unavailable, the app uses 20+ built-in inspirational quotes
- **CORS Proxy**: The app attempts to use a CORS proxy (allorigins.win) as a backup
- **Attribution**: Required attribution to ZenQuotes.io is included as per their terms
- No external dependencies or frameworks required
- Pure vanilla JavaScript implementation
- All ciphers follow ACA (American Cryptogram Association) rules
- Alphabets are automatically shifted to ensure no letter encodes to itself
- **Cryptogram Practice**: Plaintext is hidden to simulate real cryptogram solving
- **Random Keywords**: Each cipher uses randomly selected keywords from a pool of 100+ words
- Keywords and author information provided as solving hints
- Press `Ctrl+T` for a test quote when API is unavailable

## File Structure

```
/
├── index.html            # Main HTML file
├── style.css             # Styling
└── js/                   # New modular JavaScript files
    ├── app.js            # Main application coordinator
    ├── config.js         # Configuration and constants
    ├── api-manager.js    # API and quote fetching
    ├── cipher-engine.js  # All cipher implementations
    ├── ui-manager.js     # User interface management
    └── validator.js      # Keyword validation system
```

## Module Responsibilities

### 1. `config.js` - Configuration and Constants

- **Purpose**: Centralized configuration and data constants
- **Contents**:
  - Standard alphabet constant
  - Keyword list (100+ words)
  - Fallback quotes
  - KeywordGenerator class for managing cipher keywords
  - Random alphabet generation

### 2. `api-manager.js` - API Management

- **Purpose**: Handles all quote fetching and API key management
- **Contents**:
  - API key validation and storage
  - ZenQuotes API integration
  - CORS proxy fallback handling
  - Fallback quote system
  - Attribution management

### 3. `cipher-engine.js` - Cipher Implementations

- **Purpose**: All cryptographic operations and alphabet generation
- **Contents**:
  - K1, K2, K3, K4 cipher implementations
  - Random alphabet cipher
  - Smart alphabet rearrangement (Caesar-style shifting)
  - Identity mapping prevention
  - Keyword positioning algorithms

### 4. `ui-manager.js` - User Interface Management

- **Purpose**: All UI interactions and display logic
- **Contents**:
  - DOM element management
  - Event binding
  - Quote and cipher result display
  - Reveal functionality (quote, keywords, alphabet tables)
  - Error message display
  - Table generation for alphabet visualization

### 5. `validator.js` - Validation System

- **Purpose**: Keyword positioning validation and verification
- **Contents**:
  - Keyword order validation
  - Contiguity checking
  - Silent validation system
  - Auto-fix coordination
  - Detailed validation reporting

### 6. `app.js` - Main Application Coordinator

- **Purpose**: Orchestrates all modules and manages application flow
- **Contents**:
  - Module initialization
  - Event coordination
  - Quote encoding workflow
  - Cipher type switching
  - Testing functionality