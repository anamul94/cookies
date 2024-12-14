const generatePassword = require('generate-password');

const password = generatePassword.generate({
    length: 8,
    numbers: true,
    symbols: false,
    uppercase: true,
    lowercase: true,
    excludeSimilarCharacters: true, // Avoid confusing characters like "I" and "l"
});

const generateRandomPassword = () => {
    return password;
};

module.exports = {
    generateRandomPassword,
};
