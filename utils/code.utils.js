const { v4: uuidv4 } = require('uuid');

exports.generarCodigo = () => {
    return uuidv4();
};

exports.luhnCheck = (cardNumber) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
};


exports.generarTokenUsuario = () => {
    const caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 20; i++){
        token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return token;
}