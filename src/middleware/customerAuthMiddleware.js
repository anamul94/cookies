const { customerAuth } = require("../servicees/customerService");

exports.customerAuth = async (req, res, next) => {
    console.log("Customer authentication middleware", req.body);
    const { customerEmail, password } = req.body;
    console.log("Customer authentication middleware", customerEmail, password);
    if (!customerEmail || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const customer = await customerAuth(customerEmail, password);
    if (!customer) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log("Customer authenticated");
    next();
}