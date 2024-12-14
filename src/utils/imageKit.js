const ImageKit = require("imagekit");
dotenv = require("dotenv");

dotenv.config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY, // Replace with your public API key
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // Replace with your private API key
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT, // Replace with your URL endpoint
});

module.exports = imagekit;
