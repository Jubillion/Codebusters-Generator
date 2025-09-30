# Quote Cipher - Codebusters Web App

A simple web application that fetches random quotes from the ZenQuotes API and encodes them using various monoalphabetic ciphers.

## Features

- **Random Quote Fetching**: Gets quotes from ZenQuotes.io API (no API key required)
- **Eight Cipher Types** with **Random Keywords**:
  - **K1**: Mixed plaintext alphabet, standard ciphertext alphabet
  - **K2**: Standard plaintext alphabet, mixed ciphertext alphabet
  - **K3**: Both alphabets mixed with same random keyword
  - ~~**K4**: Both alphabets mixed with different random keywords~~ *(deprecated - legacy code)*
  - **Random Alphabet**: Completely randomized substitution alphabet
  - **Porta Cipher**: Polyalphabetic cipher with keyword-based tableau
  - **Complete Columnar Transposition**: Transposition cipher with random column ordering
  - **2x2 Hill Cipher**: Matrix-based cipher with guaranteed invertible encryption matrix
  - **Nihilist**: Number-based cipher using Polybius square and key addition
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

### K1 Patristocrat

- **Mixed plaintext alphabet** using random keyword, **standard ciphertext alphabet**
- **All spaces and punctuation removed** from final ciphertext
- Same substitution as K1 but continuous letter string output
- Example: With keyword "MOUNTAIN" → "HELLO WORLD!" → "GDKKNNQZKP"

### K2 Patristocrat

- **Standard plaintext alphabet**, **mixed ciphertext alphabet** using random keyword
- **All spaces and punctuation removed** from final ciphertext
- Same substitution as K2 but continuous letter string output
- Example: With keyword "CRYSTAL" → "HELLO WORLD!" → "AJCCQSQMCP"
- Creates more complex substitution patterns
- Example: With keyword "PHOENIX" → "HELLO" → "BJCCQ"

### K4 Cipher *(Deprecated - Legacy Code Only)*

- ~~**Both alphabets mixed** using **different random keywords**~~
- ~~Most complex substitution pattern with two independent keywords~~
- ~~Example: With keywords "GALAXY/OCEAN" → "HELLO" → "FJDDQ"~~
- **Note**: K4 substitutions are not used in Science Olympiad Codebusters competitions as of the 2025-2026 season

### Random Alphabet

- **Completely randomized** substitution alphabet
- New random alphabet generated each time option is selected
- Shows the full substitution alphabet in cipher info

### Nihilist Cipher

- **Number-based encryption** using a 5×5 Polybius square and key addition
- **Two keywords**: Polybius key (creates the square) and encryption key (for addition)
- **Process**:
  1. Polybius square created from keyword (I and J share same cell)
  2. Text converted to row,column coordinates
  3. Key repeated and converted to coordinates
  4. Text coordinates + Key coordinates = cipher numbers
- **Output**: Space-separated numbers instead of letters
- **Example**: With keys "MOUNTAIN/CIPHER" → "HELLO" → "52 73 64 64 75"
- **Print worksheets**: Custom format with number grids and blank Polybius square

### Porta Cipher

- **Polyalphabetic substitution** using keyword and Porta tableau
- **Process**:
  1. Keyword repeated to match message length
  2. Each letter uses different cipher alphabet based on keyword letter
  3. Porta tableau provides 13 different alphabets (A/B use same, C/D use same, etc.)
- **Self-Reciprocal**: Same key encrypts and decrypts
- **Example**: With keyword "CIPHER" → "HELLO" → "MGDMP"
- **Output**: Grouped in blocks of 5 letters for readability
- **Print worksheets**: No substitution chart included (uses tableau instead)

### Complete Columnar Transposition

- **Transposition cipher** that rearranges letter positions rather than substituting
- **Random column count**: Uses 4-9 columns randomly
- **Process**:
  1. Text arranged in grid by rows
  2. Columns numbered and shuffled randomly
  3. Text read out by columns in key order
- **Guaranteed scrambling**: Ensures columns are never in natural order (1,2,3...)
- **Example**: 5 columns, key order [3,1,5,2,4] rearranges "HELLO WORLD" grid
- **Reveal options**: Separate buttons for column count and column ordering with grid visualization
- **Print worksheets**: No substitution chart included (transposition-based cipher)

### 2x2 Hill Cipher

- **Matrix-based encryption** using a randomly generated 2x2 matrix
- **Two matrix types**: Numeric matrices (numbers 0-25) or word-based matrices (4-letter keywords)
- **Guaranteed invertibility**: All matrices ensured invertible (matrix determinant and 26 are coprime)
- **Word-based matrices**: Uses pre-verified invertible 4-letter keywords with letters arranged in reading order
- **Process**:
  1. Text divided into pairs of letters (A=0, B=1, ..., Z=25)
  2. Each pair multiplied by the 2x2 encryption matrix (letters converted to numbers)
  3. Results taken modulo 26 and converted back to letters
- **Auto-padding**: Odd-length text padded with 'X'
- **Examples**:
  - Numeric matrix [[3,2],[5,7]] → "HE" becomes "DI"
  - Word matrix "HILL" → [[H,I],[L,L]] → encryption using numeric equivalents
- **Print worksheets**: Shows the encryption matrix (letters or numbers) instead of substitution chart

### Keyword Pool

The app randomly selects from 200+ keywords including: ADVENTURE, BEAUTIFUL, CHALLENGE, DISCOVERY, ELEPHANT, FANTASTIC, GALAXY, HARMONY, IMAGINATION, JOURNEY, KNOWLEDGE, LIGHTHOUSE, MOUNTAIN, NAUTICAL, OCEAN, PARADISE, QUALITY, RAINBOW, SUNSHINE, TREASURE, UNIVERSE, VICTORY, WISDOM, and many more.

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and responsive design
- `js/` - Modular JavaScript files (see File Structure section below)

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

```sh
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
  - Keyword list (200+ words for general ciphers)
  - Hill cipher keyword list (45 pre-verified invertible 4-letter words)
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
  - K1, K2, K3 cipher implementations
  - K4 cipher implementation *(deprecated - legacy code only)*
  - Random alphabet cipher
  - Porta cipher with polyalphabetic tableau
  - Complete columnar transposition with guaranteed scrambling
  - 2x2 Hill cipher with invertible matrix generation
  - Nihilist cipher with Polybius square
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
  - Columnar cipher reveals (column count and ordering with grid visualization)
  - Hill cipher matrix display (encryption matrix with determinant)
  - Custom Nihilist cipher displays (Polybius square, number tables)
  - Print worksheet generation with cipher-specific layouts (matrix for Hill, excludes substitution charts for Porta and Columnar)
  - Error message display
  - Table generation for alphabet, Polybius square, and columnar grid visualization

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
