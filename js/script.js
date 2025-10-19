const $ = (id) => document.getElementById(id);

const DEFAULT_ALPHABET = 'абвгдеєжзиіїйклмнопрстуфхцчшщьюя';

class Caesar {
    constructor(shift = 3, keyword, alphabet) {
        this.shift = shift;
        this.keyword = keyword.toLowerCase() || '';
        this.alphabet = alphabet.toLowerCase() || DEFAULT_ALPHABET;
    }

    encrypt(plaintext, shift = this.shift) {
        let ciphertext = '';
        for (let i = 0; i < plaintext.length; i++) {
            let char = plaintext[i];
            let newChar = this.shiftChar(char, shift);
            ciphertext += newChar;
        }
        return ciphertext;
    }

    shiftChar(char, shift) {
        const Pi = this.alphabet.indexOf(char);
        if (Pi === -1) {
            return char; // Character not in alphabet, return as is
        }
        const Ci = mod(Pi + shift, this.alphabet.length);
        return this.alphabet[Ci];
    }

    decrypt(ciphertext, shift = this.shift) {
        return this.encrypt(ciphertext, -shift); // Decrypt by shifting in the opposite direction
    }
}

class Vigenere {
    static Direction = Object.freeze({
        ENCRYPT: 1,
        DECRYPT: -1
    });

    constructor(key, alphabet) {
        this.key = key.toLowerCase() || '';
        this.alphabet = alphabet.toLowerCase() || DEFAULT_ALPHABET + " ";
    }

    generateFullKey(text) {
        let fullKey = '';
        for (let i = 0; i < text.length; i++) {
            fullKey += this.key[i % this.key.length];
        }
        return fullKey;
    }

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

    encrypt(plaintext) {
        const fullKey = this.generateFullKey(plaintext);
        return plaintext
            .split('')
            .map((char, i) => this.shiftChar(char, fullKey[i], Vigenere.Direction.ENCRYPT))
            .join('');
    }

    decrypt(ciphertext) {
        const fullKey = this.generateFullKey(ciphertext);
        return ciphertext
            .split('')
            .map((char, i) => this.shiftChar(char, fullKey[i], Vigenere.Direction.DECRYPT))
            .join('');
    }
}

function mod(k, n) {
    return (k + n) % n;
}

const caesar = new Caesar(10);
console.log(caesar.encrypt('захист'));
console.log(caesar.decrypt('піврюя'));

const caesarInput = $('caesar-input');
const caesarOutput = $('caesar-output');
const caesarShift = $('caesar-shift');
const caesarEncryptBtn = $('caesar-encrypt');
const caesarDecryptBtn = $('caesar-decrypt');

const caesarEncryptFn = () => {
    caesar.alphabet = $('caesar-alphabet').value || caesar.alphabet;
    const plaintext = caesarInput.value.toLowerCase();
    const shift = parseInt(caesarShift.value, 10);
    const ciphertext = caesar.encrypt(plaintext, shift);
    caesarOutput.value = ciphertext;
    caesarOutput.classList.remove('d-none');
}

const caesarDecryptFn = () => {
    caesar.alphabet = $('caesar-alphabet').value.toLowerCase() || caesar.alphabet.toLowerCase();
    const ciphertext = caesarInput.value.toLowerCase();
    const shift = parseInt(caesarShift.value, 10);
    const plaintext = caesar.decrypt(ciphertext, shift);
    caesarOutput.value = plaintext;
    caesarOutput.classList.remove('d-none');
}

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


const vigenere = new Vigenere();

const vigenereEncryptFn = () => {
    vigenere.alphabet = $('vigenere-alphabet').value || vigenere.alphabet;
    const key = vigenereKeyInput.value;
    const plaintext = vigenereInput.value;
    vigenere.key = key;
    const ciphertext = vigenere.encrypt(plaintext);
    vigenereOutput.value = ciphertext;
    vigenereOutput.classList.remove('d-none');
}
const vigenereDecryptFn = () => {
    vigenere.alphabet = $('vigenere-alphabet').value || vigenere.alphabet;
    const key = vigenereKeyInput.value;
    const ciphertext = vigenereInput.value;
    vigenere.key = key;
    const plaintext = vigenere.decrypt(ciphertext);
    vigenereOutput.value = plaintext;
    vigenereOutput.classList.remove('d-none');
}

vigenereEncryptBtn.addEventListener('click', (e) => {
    e.preventDefault();
    vigenereEncryptFn();
});

vigenereDecryptBtn.addEventListener('click', (e) => {
    e.preventDefault();
    vigenereDecryptFn();
});