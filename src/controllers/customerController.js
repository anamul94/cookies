const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Plan = require('../models/Package');
const Order = require('../models/Order');
const { sendMail } = require('../utils/mailsender');
const bcrypt = require('bcrypt');
const { generateRandomPassword } = require('../utils/randomePasswordGenerator');
exports.createCustomer = async (req, res) => {
    try {
        const { email, name } = req.body;
        const isCustomer = await Customer.findOne({ where: { email } });
        if (isCustomer) {
            return res.status(400).json({ error: 'Customer already exists' });
        }
        const password = await generateRandomPassword();
        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = await Customer.create({ email, password: hashedPassword, name });
        sendMail(email, "Your password", password);
        res.status(201).json(customer);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ error: 'Failed to create customer' });
    }
};

exports.genNewPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        const newPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await customer.update({ password: hashedPassword });
        sendMail(email, "Your new password", newPassword);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error generating new password:', error);
        res.status(500).json({ error: 'Failed to generate new password' });
    }
};

exports.authicateCustomer = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        if (!(await bcrypt.compare(password, customer.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        req.customer = customer;
        next();
    } catch (error) {
        console.error('Error authenticating customer:', error);
        res.status(500).json({ error: 'Failed to authenticate customer' });
    }
};

exports.authicateCustomer = async (email, password) => {
    try {
        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            return false;
        }
        if (!(await bcrypt.compare(password, customer.password))) {
            return false;
        }
        return customer;
    } catch (error) {
        console.error('Error authenticating customer:', error);
        return false;
    }
};