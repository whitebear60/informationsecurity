// Utility wrapper for getting element by ID
const $ = (id) => document.getElementById(id);

// Default alphabet for the ciphers
const DEFAULT_ALPHABET = 'абвгдеєжзиіїйклмнопрстуфхцчшщьюя';

/**
 * Implements the Caesar cipher for a custom alphabet.
 */
class Caesar {

    /**
     * Creates a Caesar cipher instance.
     * @param {number} [shift=3] - Number of positions to shift each character.
     * @param {string} [alphabet] - Custom alphabet to use for encryption.
     */
    constructor(shift = 3, alphabet) {
        this.shift = shift;
        this.alphabet = alphabet ? alphabet.toLowerCase() : DEFAULT_ALPHABET;
    }

    /**
     * Encrypts a plaintext string using Caesar cipher.
     * @param {string} plaintext - The input text to encrypt.
     * @param {number} [shift=this.shift] - Optional shift override.
     * @returns {string} The encrypted ciphertext.
     */
    encrypt(plaintext, shift = this.shift) {
        let ciphertext = '';
        for (let i = 0; i < plaintext.length; i++) {
            let char = plaintext[i];
            let newChar = this.shiftChar(char, shift);
            ciphertext += newChar;
        }
        return ciphertext;
    }


    /**
     * Shifts a single character by the given amount.
     * @param {string} char - The character to shift.
     * @param {number} shift - The number of positions to shift.
     * @returns {string} The shifted character.
     */
    shiftChar(char, shift) {
        const Pi = this.alphabet.indexOf(char);
        if (Pi === -1) {
            return char; // Character not in alphabet, return as is
        }
        const Ci = mod(Pi + shift, this.alphabet.length);
        return this.alphabet[Ci];
    }

    /**
     * Decrypts a ciphertext string using Caesar cipher.
     * @param {string} ciphertext - The encrypted text to decrypt.
     * @param {number} [shift=this.shift] - Optional shift override.
     * @returns {string} The decrypted plaintext.
     */
    decrypt(ciphertext, shift = this.shift) {
        return this.encrypt(ciphertext, -shift); // Decrypt by shifting in the opposite direction
    }
}

/**
 * Implements the Vigenère cipher for a custom alphabet.
 */
class Vigenere {
    /**
     * Direction constants for encryption and decryption.
     * @readonly
     * @enum {number}
     */
    static Direction = Object.freeze({
        ENCRYPT: 1,
        DECRYPT: -1
    });

    /**
    * Creates a Vigenère cipher instance.
    * @param {string} key - The keyword used for encryption/decryption.
    * @param {string} [alphabet] - Custom alphabet to use.
    */
    constructor(key, alphabet) {
        this.key = key ? key.toLowerCase() : '';
        this.alphabet = alphabet ? alphabet.toLowerCase() : DEFAULT_ALPHABET + " ";
    }

    /**
     * Generates a full key by repeating the keyword to match the text length.
     * @param {string} text - The text to match the key length to.
     * @returns {string} The repeated full key.
     */
    generateFullKey(text) {
        let fullKey = '';
        for (let i = 0; i < text.length; i++) {
            fullKey += this.key[i % this.key.length];
        }
        return fullKey;
    }

    /**
    * Shifts a character using the Vigenère algorithm.
    * 
    * @param {string} char - The character to shift.
    * @param {string} keyChar - The corresponding character from the key.
    * @param {number} [direction=Vigenere.Direction.ENCRYPT] - Direction of shift.
    * Could be Direction.ENCRYPT or Direction.DECRYPT.
    * 
    * @returns {string} The shifted character.
    */
    shiftChar(char, keyChar, direction = Vigenere.Direction.ENCRYPT) {
        const charIndex = this.alphabet.indexOf(char);
        const keyIndex = this.alphabet.indexOf(keyChar);

        if (charIndex === -1 || keyIndex === -1) {
            return char;
        }

        // const shiftedIndex = (charIndex + (direction * keyIndex)) % this.alphabet.length;
        const shiftedIndex = mod(charIndex + (direction * keyIndex), this.alphabet.length);
        return this.alphabet[shiftedIndex];
    }

    /**
     * Encrypts a plaintext string using the Vigenère cipher.
     * @param {string} plaintext - The input text to encrypt.
     * @returns {string} The encrypted ciphertext.
     */

    encrypt(plaintext) {
        const fullKey = this.generateFullKey(plaintext);
        return plaintext
            .split('')
            .map((char, i) => this.shiftChar(char, fullKey[i], Vigenere.Direction.ENCRYPT))
            .join('');
    }

    /**
     * Decrypts a ciphertext string using the Vigenère cipher.
     * @param {string} ciphertext - The encrypted text to decrypt.
     * @returns {string} The decrypted plaintext.
     */

    decrypt(ciphertext) {
        const fullKey = this.generateFullKey(ciphertext);
        return ciphertext
            .split('')
            .map((char, i) => this.shiftChar(char, fullKey[i], Vigenere.Direction.DECRYPT))
            .join('');
    }
}

// Utility function for modulo operation that handles negative numbers correctly
function mod(k, n) {
    return (k + n) % n;
}

// Creating the Caesar cipher class instance
const caesar = new Caesar(10);
// Getting the UI elements for Caesar cipher
const caesarInput = $('caesar-input');
const caesarOutput = $('caesar-output');
const caesarShift = $('caesar-shift');
const caesarEncryptBtn = $('caesar-encrypt');
const caesarDecryptBtn = $('caesar-decrypt');

/**
 * Encrypts the input text using Caesar cipher and updates the output field.
 */
const caesarEncryptFn = () => {
    caesar.alphabet = $('caesar-alphabet').value || caesar.alphabet;
    const plaintext = caesarInput.value.toLowerCase();
    const shift = parseInt(caesarShift.value, 10);
    const ciphertext = caesar.encrypt(plaintext, shift);
    caesarOutput.value = ciphertext;
    caesarOutput.classList.remove('d-none');
}

/**
 * Decrypts the input text using Caesar cipher and updates the output field.
 */
const caesarDecryptFn = () => {
    caesar.alphabet = $('caesar-alphabet').value.toLowerCase() || caesar.alphabet.toLowerCase();
    const ciphertext = caesarInput.value.toLowerCase();
    const shift = parseInt(caesarShift.value, 10);
    const plaintext = caesar.decrypt(ciphertext, shift);
    caesarOutput.value = plaintext;
    caesarOutput.classList.remove('d-none');
}
// Adding event listeners to the buttons
caesarEncryptBtn.addEventListener('click', (e) => {
    e.preventDefault();
    caesarEncryptFn();
});
caesarDecryptBtn.addEventListener('click', (e) => {
    e.preventDefault();
    caesarDecryptFn();
});

// Vigenere cipher UI elements
const vigenereInput = $('vigenere-input');
const vigenereOutput = $('vigenere-output');
const vigenereKeyInput = $('vigenere-key');
const vigenereEncryptBtn = $('vigenere-encrypt');
const vigenereDecryptBtn = $('vigenere-decrypt');

// Creating the Vigenere cipher class instance
const vigenere = new Vigenere();
/**
 * Encrypts the input text using Vigenère cipher and updates the output field.
 */
const vigenereEncryptFn = () => {
    vigenere.alphabet = $('vigenere-alphabet').value || vigenere.alphabet;
    const key = vigenereKeyInput.value;
    const plaintext = vigenereInput.value;
    vigenere.key = key;
    const ciphertext = vigenere.encrypt(plaintext);
    vigenereOutput.value = ciphertext;
    vigenereOutput.classList.remove('d-none');
}
/**
 * Decrypts the input text using Vigenère cipher and updates the output field.
 */
const vigenereDecryptFn = () => {
    vigenere.alphabet = $('vigenere-alphabet').value || vigenere.alphabet;
    const key = vigenereKeyInput.value;
    const ciphertext = vigenereInput.value;
    vigenere.key = key;
    const plaintext = vigenere.decrypt(ciphertext);
    vigenereOutput.value = plaintext;
    vigenereOutput.classList.remove('d-none');
}

// Adding event listeners to the buttons
vigenereEncryptBtn.addEventListener('click', (e) => {
    e.preventDefault();
    vigenereEncryptFn();
});

vigenereDecryptBtn.addEventListener('click', (e) => {
    e.preventDefault();
    vigenereDecryptFn();
});