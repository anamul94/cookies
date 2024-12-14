const Customer = require("../models/Customer");
const bcrypt = require('bcrypt');
const { generateRandomPassword } = require("../utils/randomePasswordGenerator");

const createCustomer = async(email, name, phoneNumber, facebookId) => {
    try {
        const password =  generateRandomPassword();
        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = await Customer.create({ email, password: hashedPassword, name, phoneNumber, facebookId });
    return customer;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
}

const checkUseExists = async(email) => {
    try {
        const customer = await Customer.findOne({ where: { email } });
        if (customer) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
}

module.exports = {
    createCustomer,
    checkUseExists
}